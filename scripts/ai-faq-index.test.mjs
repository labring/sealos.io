import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import {
  FAQ_SOURCE_READ_BATCH_SIZE,
  loadCanonicalFAQSource,
  parseFAQSourceFilename,
  projectFAQIndexRecord,
  serializeCanonicalFAQIndex,
  validateFAQSourceRecords,
} from './ai-faq-index.mjs';

function makeSourceData(overrides = {}) {
  return {
    title: 'Question title',
    description: 'Question description',
    category: 'Question category',
    ...overrides,
  };
}

async function createSourceFixture(entries) {
  const sourceDirectory = await mkdtemp(join(tmpdir(), 'ai-faq-source-'));

  for (const entry of entries) {
    const sourcePath = join(sourceDirectory, entry.name);
    if (entry.type === 'directory') {
      await mkdir(sourcePath);
      continue;
    }

    const contents =
      typeof entry.contents === 'string'
        ? entry.contents
        : JSON.stringify(entry.contents ?? makeSourceData());
    await writeFile(sourcePath, contents);
  }

  return sourceDirectory;
}

async function captureSourceValidationError(action) {
  let captured;
  await assert.rejects(action, (error) => {
    captured = error;
    assert.equal(error.name, 'FAQSourceValidationError');
    assert.ok(Array.isArray(error.findings));
    return true;
  });
  return captured;
}

test('parseFAQSourceFilename accepts the canonical numeric filename shape', () => {
  assert.deepEqual(parseFAQSourceFilename('12-alpha-beta.en.json'), {
    id: 12,
    filename: '12-alpha-beta.en.json',
    slug: '12-alpha-beta',
  });

  for (const filename of [
    '0-alpha.en.json',
    '01-alpha.en.json',
    '1-.en.json',
    '1-alpha.json',
    'alpha.en.json',
  ]) {
    assert.equal(parseFAQSourceFilename(filename), null);
  }
});

test('loadCanonicalFAQSource returns numeric ID order from unordered entries', async () => {
  const sourceDirectory = await createSourceFixture([
    {
      name: '3-gamma.en.json',
      contents: makeSourceData({ title: 'Gamma' }),
    },
    {
      name: '1-alpha.en.json',
      contents: makeSourceData({ title: '  Alpha  ' }),
    },
    {
      name: '2-beta.en.json',
      contents: makeSourceData({ title: 'Beta' }),
    },
  ]);

  try {
    const records = await loadCanonicalFAQSource({
      sourceDirectory,
      expectedCount: 3,
    });

    assert.equal(FAQ_SOURCE_READ_BATCH_SIZE, 32);
    assert.deepEqual(
      records.map(({ id, slug }) => ({ id, slug })),
      [
        { id: 1, slug: '1-alpha' },
        { id: 2, slug: '2-beta' },
        { id: 3, slug: '3-gamma' },
      ],
    );
    assert.equal(records[0].data.title, '  Alpha  ');
    assert.equal(records[0].sourcePosition, 1);
    assert.equal(records[2].sourcePosition, 3);
  } finally {
    await rm(sourceDirectory, { recursive: true, force: true });
  }
});

test('loadCanonicalFAQSource reports malformed source filenames', async () => {
  const sourceDirectory = await createSourceFixture([
    { name: '1-alpha.en.json' },
    { name: 'bad-name.json' },
  ]);

  try {
    const error = await captureSourceValidationError(() =>
      loadCanonicalFAQSource({ sourceDirectory, expectedCount: 1 }),
    );
    const finding = error.findings.find(
      ({ category }) => category === 'malformed-source-identifier',
    );

    assert.equal(finding.id, null);
    assert.equal(finding.field, 'filename');
    assert.equal(finding.actual, 'bad-name.json');
    assert.equal(finding.sourcePath, join(sourceDirectory, 'bad-name.json'));
  } finally {
    await rm(sourceDirectory, { recursive: true, force: true });
  }
});

test('loadCanonicalFAQSource reports every record in a duplicate numeric ID group', async () => {
  const sourceDirectory = await createSourceFixture([
    { name: '1-alpha.en.json' },
    { name: '1-beta.en.json' },
  ]);

  try {
    const error = await captureSourceValidationError(() =>
      loadCanonicalFAQSource({ sourceDirectory, expectedCount: 1 }),
    );
    const findings = error.findings.filter(
      ({ category }) => category === 'duplicate-source-id',
    );

    assert.equal(findings.length, 2);
    assert.deepEqual(
      findings.map(({ id, sourcePath }) => ({ id, sourcePath })),
      [
        { id: 1, sourcePath: join(sourceDirectory, '1-alpha.en.json') },
        { id: 1, sourcePath: join(sourceDirectory, '1-beta.en.json') },
      ],
    );
  } finally {
    await rm(sourceDirectory, { recursive: true, force: true });
  }
});

test('validateFAQSourceRecords reports duplicate full slugs defensively', () => {
  const records = [
    {
      id: 1,
      filename: '1-alpha.en.json',
      slug: '1-shared',
      sourcePath: '/fixture/1-alpha.en.json',
      sourcePosition: 1,
      data: makeSourceData(),
    },
    {
      id: 2,
      filename: '2-beta.en.json',
      slug: '1-shared',
      sourcePath: '/fixture/2-beta.en.json',
      sourcePosition: 2,
      data: makeSourceData(),
    },
  ];

  assert.throws(
    () => validateFAQSourceRecords(records, { expectedCount: 2 }),
    (error) => {
      assert.equal(error.name, 'FAQSourceValidationError');
      assert.equal(
        error.findings.filter(
          ({ category }) => category === 'duplicate-source-slug',
        ).length,
        2,
      );
      return true;
    },
  );
});

test('loadCanonicalFAQSource reports gaps in the expected ID range', async () => {
  const sourceDirectory = await createSourceFixture([
    { name: '1-alpha.en.json' },
    { name: '3-gamma.en.json' },
  ]);

  try {
    const error = await captureSourceValidationError(() =>
      loadCanonicalFAQSource({ sourceDirectory, expectedCount: 3 }),
    );

    assert.deepEqual(
      error.findings.filter(
        ({ category }) => category === 'missing-source-id',
      ),
      [
        {
          category: 'missing-source-id',
          id: 2,
          sourcePath: sourceDirectory,
          field: 'id',
          expected: 2,
          actual: null,
        },
      ],
    );
  } finally {
    await rm(sourceDirectory, { recursive: true, force: true });
  }
});

test('loadCanonicalFAQSource rejects non-regular canonical entries', async () => {
  const sourceDirectory = await createSourceFixture([
    { name: '1-alpha.en.json' },
    { name: '2-beta.en.json', type: 'directory' },
  ]);

  try {
    const error = await captureSourceValidationError(() =>
      loadCanonicalFAQSource({ sourceDirectory, expectedCount: 2 }),
    );
    const finding = error.findings.find(
      ({ category }) => category === 'non-regular-source-entry',
    );

    assert.equal(finding.id, 2);
    assert.equal(finding.field, 'entryType');
    assert.equal(finding.actual, 'non-regular');
    assert.equal(
      finding.sourcePath,
      join(sourceDirectory, '2-beta.en.json'),
    );
  } finally {
    await rm(sourceDirectory, { recursive: true, force: true });
  }
});

test('loadCanonicalFAQSource reports invalid JSON with source and ID context', async () => {
  const sourceDirectory = await createSourceFixture([
    { name: '1-alpha.en.json', contents: '{' },
  ]);

  try {
    const error = await captureSourceValidationError(() =>
      loadCanonicalFAQSource({ sourceDirectory, expectedCount: 1 }),
    );
    const finding = error.findings.find(
      ({ category }) => category === 'invalid-source-json',
    );

    assert.equal(finding.id, 1);
    assert.equal(finding.field, '$json');
    assert.equal(finding.sourcePath, join(sourceDirectory, '1-alpha.en.json'));
    assert.equal(typeof finding.actual, 'string');
  } finally {
    await rm(sourceDirectory, { recursive: true, force: true });
  }
});

test('loadCanonicalFAQSource reports blank projected fields independently', async () => {
  const sourceDirectory = await createSourceFixture([
    {
      name: '1-alpha.en.json',
      contents: makeSourceData({ title: '   ' }),
    },
    {
      name: '2-beta.en.json',
      contents: makeSourceData({ description: '' }),
    },
    {
      name: '3-gamma.en.json',
      contents: makeSourceData({ category: null }),
    },
  ]);

  try {
    const error = await captureSourceValidationError(() =>
      loadCanonicalFAQSource({ sourceDirectory, expectedCount: 3 }),
    );
    const findings = error.findings.filter(
      ({ category }) => category === 'invalid-source-projection-schema',
    );

    assert.deepEqual(
      findings.map(({ id, field, actual }) => ({ id, field, actual })),
      [
        { id: 1, field: 'title', actual: '   ' },
        { id: 2, field: 'description', actual: '' },
        { id: 3, field: 'category', actual: null },
      ],
    );
    for (const finding of findings) {
      assert.equal(finding.expected, 'non-empty string');
      assert.match(finding.sourcePath, /\.en\.json$/);
    }
  } finally {
    await rm(sourceDirectory, { recursive: true, force: true });
  }
});

test('projection and serialization preserve fixed fields, values, and compact bytes', () => {
  const sourceRecord = {
    id: 1,
    filename: '1-alpha.en.json',
    slug: '1-alpha',
    sourcePath: '/fixture/1-alpha.en.json',
    sourcePosition: 1,
    data: makeSourceData({
      title: '  Question title  ',
      description: 'Question description ',
      category: ' Question category',
    }),
  };

  const projected = projectFAQIndexRecord(sourceRecord);

  assert.deepEqual(Object.keys(projected), [
    'category',
    'question',
    'description',
    'slug',
  ]);
  assert.deepEqual(projected, {
    category: ' Question category',
    question: '  Question title  ',
    description: 'Question description ',
    slug: '1-alpha',
  });

  const bytes = serializeCanonicalFAQIndex([sourceRecord]);
  assert.equal(bytes, JSON.stringify([projected]));
  assert.equal(bytes.endsWith(']'), true);
  assert.equal(bytes.endsWith('\n'), false);
});
