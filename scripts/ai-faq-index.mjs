import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

export const FAQ_SOURCE_READ_BATCH_SIZE = 32;
export const DEFAULT_FAQ_SOURCE_COUNT = 2000;
export const DEFAULT_FAQ_SOURCE_DIRECTORY = resolve(
  'content/ai-quick-reference',
);

const SOURCE_FILENAME_PATTERN = /^([1-9]\d*)-(.+)\.en\.json$/;
const PROJECTED_SOURCE_FIELDS = ['title', 'description', 'category'];
const INDEX_FIELDS = ['category', 'question', 'description', 'slug'];
const COMPARED_FIELDS = ['slug', 'question', 'description', 'category'];

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

function compareSourceRecords(left, right) {
  return left.id - right.id || left.filename.localeCompare(right.filename);
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
    ...collectDuplicateFindings(
      records,
      'slug',
      'duplicate-source-slug',
    ),
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

    if (record.jsonError) {
      continue;
    }

    for (const field of PROJECTED_SOURCE_FIELDS) {
      const value = record.data?.[field];
      if (typeof value !== 'string' || value.trim().length === 0) {
        findings.push({
          category: 'invalid-source-projection-schema',
          id: record.id,
          sourcePath: record.sourcePath,
          sourcePosition: record.sourcePosition,
          field,
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

async function readSourceRecordsInBatches(entries) {
  const records = [];
  const findings = [];

  for (
    let offset = 0;
    offset < entries.length;
    offset += FAQ_SOURCE_READ_BATCH_SIZE
  ) {
    const batch = entries.slice(
      offset,
      offset + FAQ_SOURCE_READ_BATCH_SIZE,
    );
    const results = await Promise.all(
      batch.map(async (entry) => {
        try {
          return {
            record: {
              ...entry,
              data: JSON.parse(await readFile(entry.sourcePath, 'utf8')),
            },
          };
        } catch (error) {
          return {
            record: {
              ...entry,
              data: undefined,
              jsonError: error,
            },
            finding: {
              category: 'invalid-source-json',
              id: entry.id,
              sourcePath: entry.sourcePath,
              sourcePosition: entry.sourcePosition,
              field: '$json',
              expected: 'valid JSON',
              actual: error instanceof Error ? error.message : String(error),
            },
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

export async function loadCanonicalFAQSource({
  sourceDirectory = DEFAULT_FAQ_SOURCE_DIRECTORY,
  expectedCount = DEFAULT_FAQ_SOURCE_COUNT,
} = {}) {
  const directoryEntries = await readdir(sourceDirectory, {
    withFileTypes: true,
  });
  const findings = [];
  const sourceEntries = [];

  for (const directoryEntry of directoryEntries) {
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

  const loaded = await readSourceRecordsInBatches(sourceEntries);
  findings.push(...loaded.findings);
  findings.push(
    ...collectFAQSourceRecordFindings(loaded.records, {
      expectedCount,
      sourceDirectory,
    }),
  );

  if (findings.length > 0) {
    throw new FAQSourceValidationError(findings);
  }

  return loaded.records;
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
      { key, label, findings: [] },
    ]),
  );
}

function addFinding(buckets, key, finding) {
  buckets.get(key).findings.push(finding);
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
    if (record === null || typeof record !== 'object' || Array.isArray(record)) {
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

    for (const field of keys.filter((key) => !INDEX_FIELDS.includes(key)).sort()) {
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

function addDuplicateGroupFindings({
  buckets,
  groups,
  category,
  field,
  side,
}) {
  for (const [value, group] of groups) {
    if (group.length < 2) {
      continue;
    }

    for (const record of group) {
      addFinding(buckets, category, {
        id: record.id,
        ...(side === 'source'
          ? { sourcePosition: record.sourcePosition }
          : { indexPosition: record.indexPosition }),
        field,
        expected: 'unique value',
        actual: value,
      });
    }
  }
}

function addMembershipFindings({
  buckets,
  sourceIdGroups,
  indexIdGroups,
}) {
  const ids = [...new Set([...sourceIdGroups.keys(), ...indexIdGroups.keys()])].sort(
    (left, right) => left - right,
  );

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

  const expectedBytes = JSON.stringify(
    [...sourceRecords]
      .sort((left, right) => left.id - right.id)
      .map((record) => record.projected),
  );
  if (expectedBytes === indexBytes) {
    return;
  }

  addFinding(buckets, 'non-canonical-serialization', {
    id: null,
    field: 'bytes',
    expected: {
      byteLength: Buffer.byteLength(expectedBytes),
    },
    actual: {
      byteLength: Buffer.byteLength(indexBytes),
      firstDifferenceOffset: findFirstDifference(expectedBytes, indexBytes),
    },
  });
}

export function compareFAQIndexRecords({
  sourceRecords,
  indexRecords,
  indexBytes = JSON.stringify(indexRecords),
}) {
  const buckets = createFindingBuckets();
  const sourceInputCount = Array.isArray(sourceRecords)
    ? sourceRecords.length
    : null;
  if (!Array.isArray(sourceRecords)) {
    addFinding(buckets, 'invalid-source-projection-schemas', {
      id: null,
      field: '$root',
      expected: 'array',
      actual: sourceRecords,
    });
    sourceRecords = [];
  }

  const indexIsArray = Array.isArray(indexRecords);
  if (!indexIsArray) {
    addFinding(buckets, 'invalid-index-projection-schemas', {
      id: null,
      field: '$root',
      expected: 'array',
      actual: indexRecords,
    });
  }

  const normalizedSourceRecords = normalizeSourceRecords(
    sourceRecords,
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

  if (indexIsArray) {
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

  addSerializationFinding({
    buckets,
    sourceRecords: normalizedSourceRecords,
    sourceInputCount,
    sourceIdGroups,
    sourceSlugGroups,
    indexBytes: String(indexBytes),
  });

  const categories = FAQ_INDEX_FINDING_CATEGORIES.map(({ key }) => {
    const category = buckets.get(key);
    return {
      ...category,
      total: category.findings.length,
    };
  });
  const totalFindings = categories.reduce(
    (total, category) => total + category.total,
    0,
  );

  return {
    ok: totalFindings === 0,
    recordCount: normalizedSourceRecords.length,
    totalFindings,
    categories,
  };
}

function stringifyReportValue(value) {
  const serialized = JSON.stringify(value);
  return serialized === undefined ? 'undefined' : serialized;
}

export function formatFAQIndexReport(report) {
  const lines = [
    report.ok
      ? `AI FAQ index parity passed for ${report.recordCount} records.`
      : 'AI FAQ index parity failed for public/ai-faqs.en.json.',
  ];

  for (const category of report.categories) {
    lines.push(`${category.label}: ${category.total}`);

    for (const finding of category.findings.slice(0, 20)) {
      const details = [];
      for (const field of [
        'id',
        'sourcePosition',
        'indexPosition',
        'sourcePath',
        'field',
        'expected',
        'actual',
      ]) {
        if (Object.hasOwn(finding, field)) {
          details.push(`${field}=${stringifyReportValue(finding[field])}`);
        }
      }
      lines.push(`  - ${details.join(' ')}`);
    }
  }

  if (!report.ok) {
    lines.push('Regenerate with: npm run generate:ai-faq-index');
  }

  return `${lines.join('\n')}\n`;
}
