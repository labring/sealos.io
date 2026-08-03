import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { TextDecoder } from 'node:util';

export const FAQ_SOURCE_READ_BATCH_SIZE = 32;
export const DEFAULT_FAQ_SOURCE_COUNT = 2000;
export const DEFAULT_FAQ_SOURCE_DIRECTORY = resolve(
  'content/ai-quick-reference',
);

const SOURCE_FILENAME_PATTERN = /^([1-9]\d*)-(.+)\.en\.json$/;
const utf8Decoder = new TextDecoder('utf-8', { fatal: true });
const SOURCE_PROJECTION_FIELDS = [
  ['title', 'question'],
  ['description', 'description'],
  ['category', 'category'],
];
const INDEX_FIELDS = ['category', 'question', 'description', 'slug'];
const COMPARED_FIELDS = ['slug', 'question', 'description', 'category'];
const REPORT_FINDING_FIELDS = [
  'id',
  'sourcePosition',
  'indexPosition',
  'sourcePath',
  'code',
  'field',
  'expected',
  'actual',
];

export const FAQ_INDEX_FINDING_CATEGORIES = [
  {
    key: 'malformed-source-identifiers',
    label: 'malformed source identifiers',
  },
  {
    key: 'malformed-index-identifiers',
    label: 'malformed index identifiers',
  },
  {
    key: 'invalid-source-projection-schemas',
    label: 'invalid source projection schemas',
  },
  {
    key: 'invalid-index-projection-schemas',
    label: 'invalid index projection schemas',
  },
  { key: 'duplicate-source-ids', label: 'duplicate source IDs' },
  { key: 'duplicate-index-ids', label: 'duplicate index IDs' },
  { key: 'duplicate-source-slugs', label: 'duplicate source slugs' },
  { key: 'duplicate-index-slugs', label: 'duplicate index slugs' },
  { key: 'source-only-ids', label: 'source-only IDs' },
  { key: 'index-only-ids', label: 'index-only IDs' },
  { key: 'ordering-drift', label: 'ordering drift' },
  { key: 'slug-drift', label: 'slug drift' },
  { key: 'question-drift', label: 'question drift' },
  { key: 'description-drift', label: 'description drift' },
  { key: 'category-drift', label: 'category drift' },
  {
    key: 'non-canonical-serialization',
    label: 'non-canonical serialization',
  },
];

const SOURCE_FINDING_BUCKET_MAP = {
  'malformed-source-identifier': 'malformed-source-identifiers',
  'non-regular-source-entry': 'malformed-source-identifiers',
  'invalid-source-projection-schema': 'invalid-source-projection-schemas',
  'source-read-failure': 'invalid-source-projection-schemas',
  'invalid-source-json': 'invalid-source-projection-schemas',
  'duplicate-source-id': 'duplicate-source-ids',
  'duplicate-source-slug': 'duplicate-source-slugs',
  'missing-source-id': 'malformed-source-identifiers',
  'unexpected-source-id': 'malformed-source-identifiers',
};

const INDEX_FINDING_BUCKET_MAP = {
  'index-read-failure': 'invalid-index-projection-schemas',
  'invalid-index-json': 'invalid-index-projection-schemas',
};

export class FAQSourceValidationError extends Error {
  constructor(findings) {
    super(`AI FAQ source validation failed with ${findings.length} finding(s)`);
    this.name = 'FAQSourceValidationError';
    this.findings = findings;
  }
}

export function parseFAQSourceFilename(filename) {
  const match = SOURCE_FILENAME_PATTERN.exec(filename);
  if (!match) {
    return null;
  }

  const id = Number(match[1]);
  if (!Number.isSafeInteger(id)) {
    return null;
  }

  return {
    id,
    filename,
    slug: filename.slice(0, -'.en.json'.length),
  };
}

function compareCodeUnitStrings(left, right) {
  if (left < right) {
    return -1;
  }

  if (left > right) {
    return 1;
  }

  return 0;
}

function compareSourceRecords(left, right) {
  return left.id === right.id
    ? compareCodeUnitStrings(left.filename, right.filename)
    : left.id - right.id;
}

function collectDuplicateFindings(records, key, category) {
  const groups = new Map();

  for (const record of records) {
    const value = record[key];
    const group = groups.get(value) ?? [];
    group.push(record);
    groups.set(value, group);
  }

  const findings = [];
  for (const [value, group] of groups) {
    if (group.length < 2) {
      continue;
    }

    for (const record of group) {
      findings.push({
        category,
        id: record.id,
        sourcePath: record.sourcePath,
        sourcePosition: record.sourcePosition,
        field: key,
        expected: 'unique value',
        actual: value,
      });
    }
  }

  return findings;
}

export function collectFAQSourceRecordFindings(
  records,
  {
    expectedCount = DEFAULT_FAQ_SOURCE_COUNT,
    sourceDirectory = DEFAULT_FAQ_SOURCE_DIRECTORY,
  } = {},
) {
  const findings = [
    ...collectDuplicateFindings(records, 'id', 'duplicate-source-id'),
    ...collectDuplicateFindings(records, 'slug', 'duplicate-source-slug'),
  ];
  const presentIds = new Set(records.map(({ id }) => id));

  for (let id = 1; id <= expectedCount; id += 1) {
    if (!presentIds.has(id)) {
      findings.push({
        category: 'missing-source-id',
        id,
        sourcePath: sourceDirectory,
        field: 'id',
        expected: id,
        actual: null,
      });
    }
  }

  for (const record of records) {
    if (record.id > expectedCount) {
      findings.push({
        category: 'unexpected-source-id',
        id: record.id,
        sourcePath: record.sourcePath,
        sourcePosition: record.sourcePosition,
        field: 'id',
        expected: `1..${expectedCount}`,
        actual: record.id,
      });
    }

    if (record.jsonError || record.ingestionError) {
      continue;
    }

    for (const [sourceField, projectedField] of SOURCE_PROJECTION_FIELDS) {
      const value = record.data?.[sourceField];
      if (typeof value !== 'string' || value.trim().length === 0) {
        findings.push({
          category: 'invalid-source-projection-schema',
          id: record.id,
          sourcePath: record.sourcePath,
          sourcePosition: record.sourcePosition,
          field: projectedField,
          expected: 'non-empty string',
          actual: value,
        });
      }
    }
  }

  return findings;
}

export function validateFAQSourceRecords(records, options = {}) {
  const findings = collectFAQSourceRecordFindings(records, options);
  if (findings.length > 0) {
    throw new FAQSourceValidationError(findings);
  }

  return records;
}

function createReadFailureFinding({ sourcePath, id, sourcePosition, error }) {
  return {
    category: 'source-read-failure',
    id,
    sourcePath,
    sourcePosition,
    code: error?.code ?? 'SOURCE_READ_FAILED',
    field: '$read',
    expected: 'readable source file',
    actual: error instanceof Error ? error.message : String(error),
  };
}

function createInvalidJsonFinding({ sourcePath, id, sourcePosition, error }) {
  return {
    category: 'invalid-source-json',
    id,
    sourcePath,
    sourcePosition,
    code: error?.code ?? 'INVALID_SOURCE_JSON',
    field: '$json',
    expected: 'valid UTF-8 JSON',
    actual: error instanceof Error ? error.message : String(error),
  };
}

export function decodeJSONBuffer(buffer) {
  return JSON.parse(utf8Decoder.decode(Buffer.from(buffer)));
}

async function readSourceRecordsInBatches(entries, sourceReadFile = readFile) {
  const records = [];
  const findings = [];

  for (
    let offset = 0;
    offset < entries.length;
    offset += FAQ_SOURCE_READ_BATCH_SIZE
  ) {
    const batch = entries.slice(offset, offset + FAQ_SOURCE_READ_BATCH_SIZE);
    const results = await Promise.all(
      batch.map(async (entry) => {
        let sourceBuffer;

        try {
          sourceBuffer = await sourceReadFile(entry.sourcePath);
        } catch (error) {
          return {
            record: {
              ...entry,
              data: undefined,
              ingestionError: error,
            },
            finding: createReadFailureFinding({ ...entry, error }),
          };
        }

        try {
          return {
            record: {
              ...entry,
              data: decodeJSONBuffer(sourceBuffer),
            },
          };
        } catch (error) {
          return {
            record: {
              ...entry,
              data: undefined,
              jsonError: error,
            },
            finding: createInvalidJsonFinding({ ...entry, error }),
          };
        }
      }),
    );

    for (const result of results) {
      records.push(result.record);
      if (result.finding) {
        findings.push(result.finding);
      }
    }
  }

  return { records, findings };
}

export async function inspectCanonicalFAQSource({
  sourceDirectory = DEFAULT_FAQ_SOURCE_DIRECTORY,
  expectedCount = DEFAULT_FAQ_SOURCE_COUNT,
  filesystem = {},
} = {}) {
  const readDirectory = filesystem.readdir ?? readdir;
  const sourceReadFile = filesystem.readFile ?? readFile;
  let directoryEntries;

  try {
    directoryEntries = await readDirectory(sourceDirectory, {
      withFileTypes: true,
    });
  } catch (error) {
    return {
      records: [],
      findings: [
        createReadFailureFinding({
          sourcePath: resolve(sourceDirectory),
          id: null,
          error,
        }),
      ],
    };
  }

  const findings = [];
  const sourceEntries = [];

  for (const directoryEntry of [...directoryEntries].sort((left, right) =>
    compareCodeUnitStrings(left.name, right.name),
  )) {
    const parsed = parseFAQSourceFilename(directoryEntry.name);
    const sourcePath = resolve(sourceDirectory, directoryEntry.name);

    if (!parsed) {
      findings.push({
        category: 'malformed-source-identifier',
        id: null,
        sourcePath,
        field: 'filename',
        expected: '<id>-<slug>.en.json',
        actual: directoryEntry.name,
      });
      continue;
    }

    if (!directoryEntry.isFile()) {
      findings.push({
        category: 'non-regular-source-entry',
        id: parsed.id,
        sourcePath,
        field: 'entryType',
        expected: 'regular file',
        actual: 'non-regular',
      });
      continue;
    }

    sourceEntries.push({
      ...parsed,
      sourcePath,
    });
  }

  sourceEntries.sort(compareSourceRecords);
  sourceEntries.forEach((entry, index) => {
    entry.sourcePosition = index + 1;
  });

  const loaded = await readSourceRecordsInBatches(
    sourceEntries,
    sourceReadFile,
  );
  findings.push(...loaded.findings);
  findings.push(
    ...collectFAQSourceRecordFindings(loaded.records, {
      expectedCount,
      sourceDirectory,
    }),
  );

  return { records: loaded.records, findings };
}

export async function loadCanonicalFAQSource(options = {}) {
  const inspection = await inspectCanonicalFAQSource(options);
  if (inspection.findings.length > 0) {
    throw new FAQSourceValidationError(inspection.findings);
  }

  return inspection.records;
}

export function projectFAQIndexRecord(sourceRecord) {
  return {
    category: sourceRecord.data.category,
    question: sourceRecord.data.title,
    description: sourceRecord.data.description,
    slug: sourceRecord.slug,
  };
}

export function serializeCanonicalFAQIndex(sourceRecords) {
  return JSON.stringify(sourceRecords.map(projectFAQIndexRecord));
}

function createFindingBuckets() {
  return new Map(
    FAQ_INDEX_FINDING_CATEGORIES.map(({ key, label }) => [
      key,
      { key, label, findings: [], findingKeys: new Set() },
    ]),
  );
}

function addFinding(buckets, key, finding) {
  const bucket = buckets.get(key);
  const findingKey = JSON.stringify(
    finding,
    Object.keys(finding)
      .filter((field) => field !== 'category')
      .sort(),
  );
  if (bucket.findingKeys.has(findingKey)) {
    return;
  }

  bucket.findingKeys.add(findingKey);
  bucket.findings.push(finding);
}

function mergeFindings(buckets, findings, bucketMap, fallbackBucket) {
  for (const finding of findings) {
    const bucket = bucketMap[finding.category] ?? fallbackBucket;
    addFinding(
      buckets,
      bucket,
      bucketMap[finding.category]
        ? finding
        : { ...finding, code: finding.code ?? finding.category },
    );
  }
}

function finalizeReport({ buckets, recordCount }) {
  const categories = finalizeFindingBuckets(buckets);
  const totalFindings = categories.reduce(
    (total, category) => total + category.total,
    0,
  );

  return {
    ok: totalFindings === 0,
    recordCount,
    totalFindings,
    categories,
  };
}

export function createFAQIndexIngestionReport({
  sourceFindings = [],
  indexFindings = [],
  recordCount = 0,
} = {}) {
  const buckets = createFindingBuckets();
  mergeFindings(
    buckets,
    sourceFindings,
    SOURCE_FINDING_BUCKET_MAP,
    'invalid-source-projection-schemas',
  );
  mergeFindings(
    buckets,
    indexFindings,
    INDEX_FINDING_BUCKET_MAP,
    'invalid-index-projection-schemas',
  );

  return finalizeReport({
    buckets,
    recordCount,
  });
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function normalizeSourceRecords(sourceRecords, buckets) {
  return sourceRecords.flatMap((record, index) => {
    const sourcePosition = record?.sourcePosition ?? index + 1;
    const parsed = parseFAQSourceFilename(record?.filename);

    if (!parsed) {
      addFinding(buckets, 'malformed-source-identifiers', {
        id: null,
        sourcePosition,
        sourcePath: record?.sourcePath,
        field: 'filename',
        expected: '<id>-<slug>.en.json',
        actual: record?.filename,
      });
      return [];
    }

    if (record?.jsonError || record?.ingestionError) {
      return [
        {
          id: parsed.id,
          slug: parsed.slug,
          sourcePosition,
          sourcePath: record?.sourcePath,
          projected: null,
          validSchema: false,
        },
      ];
    }

    const projectedValues = {
      category: record?.data?.category,
      question: record?.data?.title,
      description: record?.data?.description,
      slug: parsed.slug,
    };
    let validSchema = true;

    for (const field of INDEX_FIELDS) {
      const value = projectedValues[field];
      if (!isNonEmptyString(value)) {
        validSchema = false;
        addFinding(buckets, 'invalid-source-projection-schemas', {
          id: parsed.id,
          sourcePosition,
          sourcePath: record?.sourcePath,
          field,
          expected: 'non-empty string',
          actual: value,
        });
      }
    }

    return [
      {
        id: parsed.id,
        slug: parsed.slug,
        sourcePosition,
        sourcePath: record?.sourcePath,
        projected: projectedValues,
        validSchema,
      },
    ];
  });
}

function normalizeIndexRecords(indexRecords, buckets) {
  return indexRecords.flatMap((record, index) => {
    const indexPosition = index + 1;
    if (
      record === null ||
      typeof record !== 'object' ||
      Array.isArray(record)
    ) {
      addFinding(buckets, 'invalid-index-projection-schemas', {
        id: null,
        indexPosition,
        field: '$record',
        expected: 'object with category, question, description, and slug',
        actual: record,
      });
      return [];
    }

    const keys = Object.keys(record);
    let validSchema = true;
    for (const field of INDEX_FIELDS) {
      if (!isNonEmptyString(record[field])) {
        validSchema = false;
        addFinding(buckets, 'invalid-index-projection-schemas', {
          id: null,
          indexPosition,
          field,
          expected: 'non-empty string',
          actual: record[field],
        });
      }
    }

    for (const field of keys
      .filter((key) => !INDEX_FIELDS.includes(key))
      .sort()) {
      validSchema = false;
      addFinding(buckets, 'invalid-index-projection-schemas', {
        id: null,
        indexPosition,
        field,
        expected: 'absent',
        actual: record[field],
      });
    }

    if (!isNonEmptyString(record.slug)) {
      return [];
    }

    const parsed = parseFAQSourceFilename(`${record.slug}.en.json`);
    if (!parsed) {
      addFinding(buckets, 'malformed-index-identifiers', {
        id: null,
        indexPosition,
        field: 'slug',
        expected: '<id>-<slug>',
        actual: record.slug,
      });
      return [];
    }

    return [
      {
        id: parsed.id,
        slug: record.slug,
        indexPosition,
        projected: record,
        validSchema,
      },
    ];
  });
}

function groupRecords(records, key) {
  const groups = new Map();
  for (const record of records) {
    const value = record[key];
    const group = groups.get(value) ?? [];
    group.push(record);
    groups.set(value, group);
  }
  return groups;
}

function addDuplicateGroupFindings({ buckets, groups, category, field, side }) {
  for (const [value, group] of groups) {
    if (group.length < 2) {
      continue;
    }

    for (const record of group) {
      addFinding(buckets, category, {
        id: record.id,
        ...(side === 'source'
          ? {
              sourcePosition: record.sourcePosition,
              sourcePath: record.sourcePath,
            }
          : { indexPosition: record.indexPosition }),
        field,
        expected: 'unique value',
        actual: value,
      });
    }
  }
}

function addMembershipFindings({ buckets, sourceIdGroups, indexIdGroups }) {
  const ids = [
    ...new Set([...sourceIdGroups.keys(), ...indexIdGroups.keys()]),
  ].sort((left, right) => left - right);

  for (const id of ids) {
    const sourceGroup = sourceIdGroups.get(id) ?? [];
    const indexGroup = indexIdGroups.get(id) ?? [];

    if (sourceGroup.length === 0) {
      addFinding(buckets, 'index-only-ids', {
        id,
        indexPosition: indexGroup[0].indexPosition,
        field: 'id',
        expected: 'present in source',
        actual: id,
      });
    } else if (indexGroup.length === 0) {
      addFinding(buckets, 'source-only-ids', {
        id,
        sourcePosition: sourceGroup[0].sourcePosition,
        field: 'id',
        expected: 'present in index',
        actual: null,
      });
    }
  }
}

function getComparableIds(sourceIdGroups, indexIdGroups) {
  return [...sourceIdGroups.keys()]
    .filter((id) => {
      const sourceGroup = sourceIdGroups.get(id);
      const indexGroup = indexIdGroups.get(id);
      return (
        sourceGroup.length === 1 &&
        indexGroup?.length === 1 &&
        sourceGroup[0].validSchema &&
        indexGroup[0].validSchema
      );
    })
    .sort((left, right) => left - right);
}

function addOrderingFindings({
  buckets,
  comparableIds,
  sourceIdGroups,
  indexIdGroups,
  indexRecords,
}) {
  const comparableIdSet = new Set(comparableIds);
  const actualIds = indexRecords
    .filter((record) => comparableIdSet.has(record.id))
    .map((record) => record.id);

  for (let position = 0; position < actualIds.length; position += 1) {
    const actualId = actualIds[position];
    const expectedId = comparableIds[position];
    if (actualId === expectedId) {
      continue;
    }

    addFinding(buckets, 'ordering-drift', {
      id: actualId,
      sourcePosition: sourceIdGroups.get(actualId)[0].sourcePosition,
      indexPosition: indexIdGroups.get(actualId)[0].indexPosition,
      field: 'position',
      expected: expectedId,
      actual: actualId,
    });
  }
}

function addFieldFindings({
  buckets,
  comparableIds,
  sourceIdGroups,
  indexIdGroups,
}) {
  for (const id of comparableIds) {
    const sourceRecord = sourceIdGroups.get(id)[0];
    const indexRecord = indexIdGroups.get(id)[0];

    for (const field of COMPARED_FIELDS) {
      const expected = sourceRecord.projected[field];
      const actual = indexRecord.projected[field];
      if (expected !== actual) {
        addFinding(buckets, `${field}-drift`, {
          id,
          sourcePosition: sourceRecord.sourcePosition,
          indexPosition: indexRecord.indexPosition,
          field,
          expected,
          actual,
        });
      }
    }
  }
}

function findFirstDifference(left, right) {
  const sharedLength = Math.min(left.length, right.length);
  for (let index = 0; index < sharedLength; index += 1) {
    if (left[index] !== right[index]) {
      return index;
    }
  }
  return left.length === right.length ? null : sharedLength;
}

function addSerializationFinding({
  buckets,
  sourceRecords,
  sourceInputCount,
  sourceIdGroups,
  sourceSlugGroups,
  indexBytes,
}) {
  const sourceIsCanonical =
    sourceRecords.length === sourceInputCount &&
    sourceRecords.every((record) => record.validSchema) &&
    [...sourceIdGroups.values()].every((group) => group.length === 1) &&
    [...sourceSlugGroups.values()].every((group) => group.length === 1);
  if (!sourceIsCanonical) {
    return;
  }

  const expectedBytes = Buffer.from(
    JSON.stringify(
      [...sourceRecords]
        .sort((left, right) => left.id - right.id)
        .map((record) => record.projected),
    ),
    'utf8',
  );
  const actualBytes = Buffer.isBuffer(indexBytes)
    ? indexBytes
    : Buffer.from(String(indexBytes), 'utf8');
  if (expectedBytes.equals(actualBytes)) {
    return;
  }

  addFinding(buckets, 'non-canonical-serialization', {
    id: null,
    field: 'bytes',
    expected: {
      byteLength: expectedBytes.length,
    },
    actual: {
      byteLength: actualBytes.length,
      firstDifferenceOffset: findFirstDifference(expectedBytes, actualBytes),
    },
  });
}

function finalizeFindingBuckets(buckets) {
  return FAQ_INDEX_FINDING_CATEGORIES.map(({ key }) => {
    const category = buckets.get(key);
    return {
      key: category.key,
      label: category.label,
      findings: category.findings,
      total: category.findings.length,
    };
  });
}

export function compareFAQIndexRecords({
  sourceRecords,
  sourceFindings = [],
  indexRecords,
  indexFindings = [],
  indexBytes = indexRecords === null || indexRecords === undefined
    ? Buffer.alloc(0)
    : Buffer.from(JSON.stringify(indexRecords), 'utf8'),
}) {
  const buckets = createFindingBuckets();
  mergeFindings(
    buckets,
    sourceFindings,
    SOURCE_FINDING_BUCKET_MAP,
    'invalid-source-projection-schemas',
  );
  const sourceEnumerationFailed = sourceFindings.some(
    (finding) =>
      finding.category === 'source-read-failure' && finding.id === null,
  );
  mergeFindings(
    buckets,
    indexFindings,
    INDEX_FINDING_BUCKET_MAP,
    'invalid-index-projection-schemas',
  );
  const sourceIsArray = Array.isArray(sourceRecords);
  const sourceInputCount = sourceIsArray ? sourceRecords.length : null;
  if (!sourceIsArray) {
    addFinding(buckets, 'invalid-source-projection-schemas', {
      id: null,
      field: '$root',
      expected: 'array',
      actual: sourceRecords,
    });
  }

  const indexIsArray = Array.isArray(indexRecords);
  if (!indexIsArray && indexFindings.length === 0) {
    addFinding(buckets, 'invalid-index-projection-schemas', {
      id: null,
      field: '$root',
      expected: 'array',
      actual: indexRecords,
    });
  }

  const normalizedSourceRecords = normalizeSourceRecords(
    sourceIsArray ? sourceRecords : [],
    buckets,
  );
  const normalizedIndexRecords = indexIsArray
    ? normalizeIndexRecords(indexRecords, buckets)
    : [];
  const sourceIdGroups = groupRecords(normalizedSourceRecords, 'id');
  const indexIdGroups = groupRecords(normalizedIndexRecords, 'id');
  const sourceSlugGroups = groupRecords(normalizedSourceRecords, 'slug');
  const indexSlugGroups = groupRecords(normalizedIndexRecords, 'slug');

  addDuplicateGroupFindings({
    buckets,
    groups: sourceIdGroups,
    category: 'duplicate-source-ids',
    field: 'id',
    side: 'source',
  });
  addDuplicateGroupFindings({
    buckets,
    groups: indexIdGroups,
    category: 'duplicate-index-ids',
    field: 'id',
    side: 'index',
  });
  addDuplicateGroupFindings({
    buckets,
    groups: sourceSlugGroups,
    category: 'duplicate-source-slugs',
    field: 'slug',
    side: 'source',
  });
  addDuplicateGroupFindings({
    buckets,
    groups: indexSlugGroups,
    category: 'duplicate-index-slugs',
    field: 'slug',
    side: 'index',
  });

  if (
    !sourceEnumerationFailed &&
    indexIsArray &&
    indexFindings.length === 0
  ) {
    addMembershipFindings({ buckets, sourceIdGroups, indexIdGroups });
    const comparableIds = getComparableIds(sourceIdGroups, indexIdGroups);
    addOrderingFindings({
      buckets,
      comparableIds,
      sourceIdGroups,
      indexIdGroups,
      indexRecords: normalizedIndexRecords,
    });
    addFieldFindings({
      buckets,
      comparableIds,
      sourceIdGroups,
      indexIdGroups,
    });
  }

  if (
    !sourceEnumerationFailed &&
    sourceFindings.length === 0 &&
    indexFindings.length === 0
  ) {
    addSerializationFinding({
      buckets,
      sourceRecords: normalizedSourceRecords,
      sourceInputCount,
      sourceIdGroups,
      sourceSlugGroups,
      indexBytes,
    });
  }

  return finalizeReport({
    buckets,
    recordCount: normalizedSourceRecords.length,
  });
}

function stringifyReportValue(value) {
  const serialized = JSON.stringify(value);
  return serialized === undefined ? 'undefined' : serialized;
}

export function formatFAQIndexReport(report) {
  if (report.ok) {
    return `AI FAQ index parity passed for ${report.recordCount} records.\n`;
  }

  const lines = ['AI FAQ index parity failed for public/ai-faqs.en.json.'];

  for (const category of report.categories) {
    lines.push(`${category.label}: ${category.total}`);

    for (const finding of category.findings.slice(0, 20)) {
      const details = [];
      for (const field of REPORT_FINDING_FIELDS) {
        if (Object.hasOwn(finding, field)) {
          details.push(`${field}=${stringifyReportValue(finding[field])}`);
        }
      }
      lines.push(`  - ${details.join(' ')}`);
    }
  }

  lines.push('Regenerate with: npm run generate:ai-faq-index');

  return `${lines.join('\n')}\n`;
}
