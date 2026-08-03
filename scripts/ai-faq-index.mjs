import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

export const FAQ_SOURCE_READ_BATCH_SIZE = 32;
export const DEFAULT_FAQ_SOURCE_COUNT = 2000;
export const DEFAULT_FAQ_SOURCE_DIRECTORY = resolve(
  'content/ai-quick-reference',
);

const SOURCE_FILENAME_PATTERN = /^([1-9]\d*)-(.+)\.en\.json$/;
const PROJECTED_SOURCE_FIELDS = ['title', 'description', 'category'];

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
