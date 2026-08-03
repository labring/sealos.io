import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  chmod,
  cp,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rename,
  rm,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, dirname, join } from 'node:path';
import test from 'node:test';

import {
  FAQ_INDEX_FINDING_CATEGORIES,
  FAQ_SOURCE_READ_BATCH_SIZE,
  compareFAQIndexRecords,
  formatFAQIndexReport,
  inspectCanonicalFAQSource,
  loadCanonicalFAQSource,
  parseFAQSourceFilename,
  projectFAQIndexRecord,
  serializeCanonicalFAQIndex,
  validateFAQSourceRecords,
} from './ai-faq-index.mjs';
import { runGenerateFAQIndex } from './generate-ai-faq-index.mjs';
import { runVerifyFAQIndex } from './verify-ai-faq-index.mjs';

const EXPECTED_FINDING_CATEGORY_KEYS = [
  'malformed-source-identifiers',
  'malformed-index-identifiers',
  'invalid-source-projection-schemas',
  'invalid-index-projection-schemas',
  'duplicate-source-ids',
  'duplicate-index-ids',
  'duplicate-source-slugs',
  'duplicate-index-slugs',
  'source-only-ids',
  'index-only-ids',
  'ordering-drift',
  'slug-drift',
  'question-drift',
  'description-drift',
  'category-drift',
  'non-canonical-serialization',
];

const EXPECTED_FINDING_CATEGORY_LABELS = FAQ_INDEX_FINDING_CATEGORIES.map(
  ({ label }) => label,
);

function makeSourceData(overrides = {}) {
  return {
    title: 'Question title',
    description: 'Question description',
    category: 'Question category',
    ...overrides,
  };
}

function makeCanonicalSourceRecords(count = 3) {
  return Array.from({ length: count }, (_, index) => {
    const id = index + 1;
    const slug = `${id}-slug-${id}`;
    return {
      id,
      filename: `${slug}.en.json`,
      slug,
      sourcePath: `/fixture/${slug}.en.json`,
      sourcePosition: id,
      data: makeSourceData({
        title: `Question ${id}`,
        description: `Description ${id}`,
        category: `Category ${id}`,
      }),
    };
  });
}

function makeCanonicalIndexRecords(sourceRecords) {
  return sourceRecords.map(projectFAQIndexRecord);
}

function createCaptureStream() {
  const chunks = [];

  return {
    stream: {
      write(chunk) {
        chunks.push(String(chunk));
        return true;
      },
    },
    output() {
      return chunks.join('');
    },
  };
}

async function createGeneratorFixture(t) {
  const rootDirectory = await mkdtemp(join(tmpdir(), 'ai-faq-generator-'));
  const sourceDirectory = join(rootDirectory, 'source');
  const outputPath = join(rootDirectory, 'ai-faqs.en.json');

  await mkdir(sourceDirectory);
  await writeFile(
    join(sourceDirectory, '1-alpha.en.json'),
    JSON.stringify(
      makeSourceData({
        title: 'Question 1',
        description: 'Description 1',
        category: 'Category 1',
      }),
    ),
  );
  await writeFile(
    join(sourceDirectory, '2-beta.en.json'),
    JSON.stringify(
      makeSourceData({
        title: 'Question 2',
        description: 'Description 2',
        category: 'Category 2',
      }),
    ),
  );
  await writeFile(outputPath, 'original index bytes');

  t.after(() => rm(rootDirectory, { recursive: true, force: true }));

  return { rootDirectory, sourceDirectory, outputPath };
}

async function createVerifierFixture(t) {
  const fixture = await createGeneratorFixture(t);
  const indexRecords = [
    {
      category: 'Category 1',
      question: 'Question 1',
      description: 'Description 1',
      slug: '1-alpha',
    },
    {
      category: 'Category 2',
      question: 'Question 2',
      description: 'Description 2',
      slug: '2-beta',
    },
  ];
  await writeFile(fixture.outputPath, JSON.stringify(indexRecords));

  return {
    ...fixture,
    indexPath: fixture.outputPath,
    indexRecords,
  };
}

function createRecordingFilesystem(overrides = {}) {
  const operations = [];

  return {
    operations,
    filesystem: {
      writeFile: async (...args) => {
        operations.push({
          type: 'writeFile',
          path: args[0],
          bytes: args[1],
          options: args[2],
        });
        return (overrides.writeFile ?? writeFile)(...args);
      },
      rename: async (...args) => {
        operations.push({
          type: 'rename',
          sourcePath: args[0],
          destinationPath: args[1],
        });
        return (overrides.rename ?? rename)(...args);
      },
      rm: async (...args) => {
        operations.push({
          type: 'rm',
          path: args[0],
          options: args[1],
        });
        return (overrides.rm ?? rm)(...args);
      },
    },
  };
}

async function listOwnedTemporaryFiles(outputPath) {
  const prefix = `.${basename(outputPath)}.`;
  return (await readdir(dirname(outputPath))).filter(
    (name) => name.startsWith(prefix) && name.endsWith('.tmp'),
  );
}

function getReportCategory(report, key) {
  const category = report.categories.find((item) => item.key === key);
  assert.ok(category, `missing report category: ${key}`);
  return category;
}

function getTopLevelFindingCategoryLabels(output) {
  return output
    .split('\n')
    .map((line) => /^([^\s].*): \d+$/.exec(line)?.[1])
    .filter(Boolean);
}

function assertExactTopLevelFindingCategories(output) {
  assert.deepEqual(
    getTopLevelFindingCategoryLabels(output),
    EXPECTED_FINDING_CATEGORY_LABELS,
  );
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
      typeof entry.contents === 'string' || Buffer.isBuffer(entry.contents)
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

test('verify-ai-faq-index CLI accepts the committed corpus without mutation', async () => {
  const indexPath = 'public/ai-faqs.en.json';
  const beforeBytes = await readFile(indexPath);
  const result = spawnSync(
    process.execPath,
    ['scripts/verify-ai-faq-index.mjs'],
    { encoding: 'utf8' },
  );
  const afterBytes = await readFile(indexPath);

  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, 'AI FAQ index parity passed for 2000 records.\n');
  assert.equal(result.stderr, '');
  assert.deepEqual(afterBytes, beforeBytes);
});

test('runVerifyFAQIndex reports valid fixture parity without mutation', async (t) => {
  const { sourceDirectory, indexPath } = await createVerifierFixture(t);
  const beforeBytes = await readFile(indexPath);
  const stdout = createCaptureStream();
  const stderr = createCaptureStream();

  const status = await runVerifyFAQIndex({
    sourceDirectory,
    indexPath,
    expectedCount: 2,
    stdout: stdout.stream,
    stderr: stderr.stream,
  });

  assert.equal(status, 0);
  assert.equal(stdout.output(), 'AI FAQ index parity passed for 2 records.\n');
  assert.equal(stderr.output(), '');
  assert.deepEqual(await readFile(indexPath), beforeBytes);
});

test('inspectCanonicalFAQSource reports fatal UTF-8 decoding as structured input', async (t) => {
  const sourceDirectory = await createSourceFixture([
    {
      name: '1-invalid.en.json',
      contents: Buffer.from(
        '{"title":"bad\xff","description":"Description","category":"Category"}',
        'binary',
      ),
    },
  ]);

  t.after(() => rm(sourceDirectory, { recursive: true, force: true }));

  const inspection = await inspectCanonicalFAQSource({
    sourceDirectory,
    expectedCount: 1,
  });

  assert.equal(inspection.records.length, 1);
  assert.deepEqual(
    inspection.findings.map(({ category, code, field }) => ({
      category,
      code,
      field,
    })),
    [
      {
        category: 'invalid-source-json',
        code: 'ERR_ENCODING_INVALID_ENCODED_DATA',
        field: '$json',
      },
    ],
  );
});

test('runVerifyFAQIndex preserves raw index bytes for canonical comparison', async (t) => {
  const fixture = await createVerifierFixture(t);
  const indexRecords = fixture.indexRecords;
  indexRecords[0].question = 'Replacement \ufffd';
  await writeFile(
    join(fixture.sourceDirectory, '1-alpha.en.json'),
    JSON.stringify(makeSourceData({ title: 'Replacement \ufffd' })),
  );

  const canonicalBytes = Buffer.from(JSON.stringify(indexRecords), 'utf8');
  const replacementOffset = canonicalBytes.indexOf(
    Buffer.from([0xef, 0xbf, 0xbd]),
  );
  assert.ok(replacementOffset >= 0);
  const invalidUtf8Bytes = Buffer.concat([
    canonicalBytes.subarray(0, replacementOffset),
    Buffer.from([0xff]),
    canonicalBytes.subarray(replacementOffset + 3),
  ]);
  await writeFile(fixture.indexPath, invalidUtf8Bytes);

  const stdout = createCaptureStream();
  const stderr = createCaptureStream();
  const status = await runVerifyFAQIndex({
    sourceDirectory: fixture.sourceDirectory,
    indexPath: fixture.indexPath,
    expectedCount: 2,
    stdout: stdout.stream,
    stderr: stderr.stream,
  });

  assert.equal(status, 1);
  assert.match(stderr.output(), /invalid index projection schemas: 1/);
  assert.match(stderr.output(), /field="\$json"/);
  assert.doesNotMatch(stderr.output(), /non-canonical serialization: [1-9]/);
  assertExactTopLevelFindingCategories(stderr.output());
  assert.deepEqual(await readFile(fixture.indexPath), invalidUtf8Bytes);
});

test('runVerifyFAQIndex separates source read failures from invalid JSON', async (t) => {
  const readFailureFixture = await createVerifierFixture(t);
  const readFailureFilesystem = {
    readFile: async (sourcePath) => {
      if (sourcePath.endsWith('1-alpha.en.json')) {
        const error = new Error('permission denied');
        error.code = 'EACCES';
        throw error;
      }
      return readFile(sourcePath);
    },
  };
  const readFailureStderr = createCaptureStream();
  const readFailureStatus = await runVerifyFAQIndex({
    sourceDirectory: readFailureFixture.sourceDirectory,
    indexPath: readFailureFixture.indexPath,
    expectedCount: 2,
    filesystem: readFailureFilesystem,
    stdout: createCaptureStream().stream,
    stderr: readFailureStderr.stream,
  });

  assert.equal(readFailureStatus, 1);
  assert.match(
    readFailureStderr.output(),
    /invalid source projection schemas: 1/,
  );
  assert.match(readFailureStderr.output(), /code="EACCES"/);
  assert.match(readFailureStderr.output(), /field="\$read"/);
  assertExactTopLevelFindingCategories(readFailureStderr.output());

  const invalidJsonFixture = await createVerifierFixture(t);
  await writeFile(
    join(invalidJsonFixture.sourceDirectory, '1-alpha.en.json'),
    '{',
  );
  const invalidJsonStderr = createCaptureStream();
  const invalidJsonStatus = await runVerifyFAQIndex({
    sourceDirectory: invalidJsonFixture.sourceDirectory,
    indexPath: invalidJsonFixture.indexPath,
    expectedCount: 2,
    stdout: createCaptureStream().stream,
    stderr: invalidJsonStderr.stream,
  });

  assert.equal(invalidJsonStatus, 1);
  assert.match(
    invalidJsonStderr.output(),
    /invalid source projection schemas: 1/,
  );
  assert.match(invalidJsonStderr.output(), /field="\$json"/);
  assertExactTopLevelFindingCategories(invalidJsonStderr.output());
});

test('source content failures preserve identity without derivative findings', async (t) => {
  const cases = [
    {
      name: 'read failure',
      field: '$read',
      configure(fixture) {
        return {
          readFile: async (sourcePath) => {
            if (sourcePath.endsWith('1-alpha.en.json')) {
              const error = new Error('permission denied');
              error.code = 'EACCES';
              throw error;
            }
            return readFile(sourcePath);
          },
        };
      },
    },
    {
      name: 'invalid JSON',
      field: '$json',
      async configure(fixture) {
        await writeFile(join(fixture.sourceDirectory, '1-alpha.en.json'), '{');
        return {};
      },
    },
  ];

  for (const fixtureCase of cases) {
    await t.test(fixtureCase.name, async (subtest) => {
      const fixture = await createVerifierFixture(subtest);
      const filesystem = await fixtureCase.configure(fixture);
      const sourceInspection = await inspectCanonicalFAQSource({
        sourceDirectory: fixture.sourceDirectory,
        expectedCount: 2,
        filesystem,
      });
      const report = compareFAQIndexRecords({
        sourceRecords: sourceInspection.records,
        sourceFindings: sourceInspection.findings,
        indexRecords: fixture.indexRecords,
        indexBytes: JSON.stringify(fixture.indexRecords),
      });

      assert.equal(
        getReportCategory(report, 'invalid-source-projection-schemas').total,
        1,
      );
      assert.equal(
        getReportCategory(report, 'invalid-source-projection-schemas')
          .findings[0].field,
        fixtureCase.field,
      );
      assert.equal(getReportCategory(report, 'source-only-ids').total, 0);
      assert.equal(getReportCategory(report, 'index-only-ids').total, 0);
      assert.equal(
        getReportCategory(report, 'non-canonical-serialization').total,
        0,
      );
    });
  }
});

test('sparse source reports source continuity and index membership once', async (t) => {
  const fixture = await createVerifierFixture(t);
  await rm(join(fixture.sourceDirectory, '2-beta.en.json'));
  const sourceInspection = await inspectCanonicalFAQSource({
    sourceDirectory: fixture.sourceDirectory,
    expectedCount: 2,
  });
  const report = compareFAQIndexRecords({
    sourceRecords: sourceInspection.records,
    sourceFindings: sourceInspection.findings,
    indexRecords: fixture.indexRecords,
    indexBytes: JSON.stringify(fixture.indexRecords),
  });

  assert.equal(
    getReportCategory(report, 'malformed-source-identifiers').total,
    1,
  );
  assert.equal(getReportCategory(report, 'source-only-ids').total, 0);
  assert.equal(getReportCategory(report, 'index-only-ids').total, 1);
  assert.equal(getReportCategory(report, 'ordering-drift').total, 0);
  assert.equal(
    getReportCategory(report, 'non-canonical-serialization').total,
    0,
  );
});

test('blank source projection produces one canonical field finding', async (t) => {
  const fixture = await createVerifierFixture(t);
  await writeFile(
    join(fixture.sourceDirectory, '1-alpha.en.json'),
    JSON.stringify(makeSourceData({ title: '   ' })),
  );
  const sourceInspection = await inspectCanonicalFAQSource({
    sourceDirectory: fixture.sourceDirectory,
    expectedCount: 2,
  });
  const report = compareFAQIndexRecords({
    sourceRecords: sourceInspection.records,
    sourceFindings: sourceInspection.findings,
    indexRecords: fixture.indexRecords,
    indexBytes: JSON.stringify(fixture.indexRecords),
  });
  const findings = getReportCategory(
    report,
    'invalid-source-projection-schemas',
  ).findings;

  assert.deepEqual(
    findings.map(({ id, field, actual }) => ({ id, field, actual })),
    [{ id: 1, field: 'question', actual: '   ' }],
  );
  assert.equal(getReportCategory(report, 'source-only-ids').total, 0);
  assert.equal(getReportCategory(report, 'index-only-ids').total, 0);
  assert.equal(
    getReportCategory(report, 'non-canonical-serialization').total,
    0,
  );
});

test('source directory read failure suppresses cross-set cascades', async () => {
  const sourceDirectory = '/fixture/source';
  const sourceError = new Error('directory unavailable');
  sourceError.code = 'EACCES';
  const indexRecords = makeCanonicalIndexRecords(makeCanonicalSourceRecords(2));

  const sourceInspection = await inspectCanonicalFAQSource({
    sourceDirectory,
    expectedCount: 2,
    filesystem: {
      readdir: async () => {
        throw sourceError;
      },
    },
  });
  const report = compareFAQIndexRecords({
    sourceRecords: sourceInspection.records,
    sourceFindings: sourceInspection.findings,
    indexRecords,
    indexBytes: JSON.stringify(indexRecords),
  });

  assert.equal(
    getReportCategory(report, 'invalid-source-projection-schemas').total,
    1,
  );
  assert.equal(getReportCategory(report, 'source-only-ids').total, 0);
  assert.equal(getReportCategory(report, 'index-only-ids').total, 0);
  assert.equal(getReportCategory(report, 'ordering-drift').total, 0);
  assert.equal(
    getReportCategory(report, 'non-canonical-serialization').total,
    0,
  );
});

test('runVerifyFAQIndex reports source and index ingestion findings through the shared formatter', async (t) => {
  const sourceFixture = await createVerifierFixture(t);
  await writeFile(
    join(sourceFixture.sourceDirectory, 'malformed-name.json'),
    JSON.stringify(makeSourceData()),
  );
  const sourceStderr = createCaptureStream();
  const sourceStatus = await runVerifyFAQIndex({
    sourceDirectory: sourceFixture.sourceDirectory,
    indexPath: sourceFixture.indexPath,
    expectedCount: 2,
    stdout: createCaptureStream().stream,
    stderr: sourceStderr.stream,
  });

  assert.equal(sourceStatus, 1);
  assert.match(sourceStderr.output(), /malformed source identifiers: 1/);
  assert.match(sourceStderr.output(), /sourcePath=/);
  assert.equal(
    sourceStderr
      .output()
      .endsWith('Regenerate with: npm run generate:ai-faq-index\n'),
    true,
  );

  const indexFixture = await createVerifierFixture(t);
  await writeFile(indexFixture.indexPath, Buffer.from([0xff, 0x7b]));
  const indexStderr = createCaptureStream();
  const indexStatus = await runVerifyFAQIndex({
    sourceDirectory: indexFixture.sourceDirectory,
    indexPath: indexFixture.indexPath,
    expectedCount: 2,
    stdout: createCaptureStream().stream,
    stderr: indexStderr.stream,
  });

  assert.equal(indexStatus, 1);
  assert.match(indexStderr.output(), /invalid index projection schemas: 1/);
  assert.match(
    indexStderr.output(),
    /code="ERR_ENCODING_INVALID_ENCODED_DATA"/,
  );
  assert.match(indexStderr.output(), /field="\$json"/);
  assertExactTopLevelFindingCategories(indexStderr.output());
});

test('runVerifyFAQIndex reports stale fixture categories without mutation', async (t) => {
  const cases = [
    {
      name: 'source-only membership',
      category: 'source-only-ids',
      mutate(records) {
        records.splice(1, 1);
      },
    },
    {
      name: 'index-only membership',
      category: 'index-only-ids',
      mutate(records) {
        records.push({
          category: 'Category 3',
          question: 'Question 3',
          description: 'Description 3',
          slug: '3-gamma',
        });
      },
    },
    {
      name: 'duplicate ID',
      category: 'duplicate-index-ids',
      mutate(records) {
        records.push({ ...records[0], slug: '1-other' });
      },
    },
    {
      name: 'duplicate slug',
      category: 'duplicate-index-slugs',
      mutate(records) {
        records.push({ ...records[0] });
      },
    },
    {
      name: 'malformed identifier',
      category: 'malformed-index-identifiers',
      mutate(records) {
        records[0].slug = 'malformed';
      },
    },
    {
      name: 'invalid schema',
      category: 'invalid-index-projection-schemas',
      mutate(records) {
        delete records[0].question;
      },
    },
    {
      name: 'ordering drift',
      category: 'ordering-drift',
      mutate(records) {
        [records[0], records[1]] = [records[1], records[0]];
      },
    },
    {
      name: 'slug drift',
      category: 'slug-drift',
      mutate(records) {
        records[0].slug = '1-stale';
      },
    },
    {
      name: 'question drift',
      category: 'question-drift',
      mutate(records) {
        records[0].question = 'Stale question';
      },
    },
    {
      name: 'description drift',
      category: 'description-drift',
      mutate(records) {
        records[0].description = 'Stale description';
      },
    },
    {
      name: 'category drift',
      category: 'category-drift',
      mutate(records) {
        records[0].category = 'Stale category';
      },
    },
    {
      name: 'canonical-byte drift',
      category: 'non-canonical-serialization',
      serialize(records) {
        return `${JSON.stringify(records, null, 2)}\n`;
      },
    },
  ];

  for (const fixtureCase of cases) {
    await t.test(fixtureCase.name, async (subtest) => {
      const { sourceDirectory, indexPath, indexRecords } =
        await createVerifierFixture(subtest);
      fixtureCase.mutate?.(indexRecords);
      const fixtureBytes = fixtureCase.serialize
        ? fixtureCase.serialize(indexRecords)
        : JSON.stringify(indexRecords);
      await writeFile(indexPath, fixtureBytes);
      const beforeBytes = await readFile(indexPath);
      const stdout = createCaptureStream();
      const stderr = createCaptureStream();

      const status = await runVerifyFAQIndex({
        sourceDirectory,
        indexPath,
        expectedCount: 2,
        stdout: stdout.stream,
        stderr: stderr.stream,
      });
      const output = stderr.output();
      const categoryLabel = FAQ_INDEX_FINDING_CATEGORIES.find(
        ({ key }) => key === fixtureCase.category,
      )?.label;

      assert.equal(status, 1);
      assert.equal(stdout.output(), '');
      assert.match(
        output,
        /^AI FAQ index parity failed for public\/ai-faqs\.en\.json\./,
      );
      for (const { label } of FAQ_INDEX_FINDING_CATEGORIES) {
        assert.match(output, new RegExp(`^${label}: \\d+$`, 'm'));
      }
      assert.match(output, new RegExp(`^${categoryLabel}: [1-9]\\d*$`, 'm'));
      assert.match(output, /^  - .*field=/m);
      assert.equal(
        output.endsWith('Regenerate with: npm run generate:ai-faq-index\n'),
        true,
      );
      assert.deepEqual(await readFile(indexPath), beforeBytes);
    });
  }
});

test('package scripts expose FAQ index commands and gate Next builds', async () => {
  const packageJson = JSON.parse(await readFile('package.json', 'utf8'));
  const { scripts } = packageJson;

  assert.equal(
    scripts['generate:ai-faq-index'],
    'node scripts/generate-ai-faq-index.mjs',
  );
  assert.equal(
    scripts['verify:ai-faq-index'],
    'node scripts/verify-ai-faq-index.mjs',
  );
  assert.equal(
    scripts['test:ai-faq-index'],
    'node --test scripts/ai-faq-index.test.mjs',
  );
  assert.equal(
    scripts.build,
    'npm run verify:ai-faq-index && next build && node scripts/normalize-root-locale.js',
  );
  assert.equal(
    scripts['build:analyze'],
    'npm run verify:ai-faq-index && ANALYZE=true next build && node scripts/normalize-root-locale.js',
  );
  assert.equal(
    scripts['test:ai-faq-slugs'],
    'node scripts/verify-ai-faq-slugs.mjs',
  );
  assert.equal(
    scripts['verify:ai-faq-routes'],
    'node scripts/verify-ai-faq-routes.mjs',
  );
});

test('runGenerateFAQIndex publishes deterministic bytes through one sibling rename', async (t) => {
  const { sourceDirectory, outputPath } = await createGeneratorFixture(t);
  const stdout = createCaptureStream();
  const stderr = createCaptureStream();
  const { filesystem, operations } = createRecordingFilesystem();
  const options = {
    sourceDirectory,
    outputPath,
    expectedCount: 2,
    stdout: stdout.stream,
    stderr: stderr.stream,
    filesystem,
  };

  assert.equal(await runGenerateFAQIndex(options), 0);
  const firstBytes = await readFile(outputPath, 'utf8');
  assert.equal(await runGenerateFAQIndex(options), 0);
  const secondBytes = await readFile(outputPath, 'utf8');

  assert.equal(secondBytes, firstBytes);
  assert.equal(secondBytes.endsWith(']'), true);
  assert.equal(secondBytes.endsWith('\n'), false);
  assert.deepEqual(JSON.parse(secondBytes), [
    {
      category: 'Category 1',
      question: 'Question 1',
      description: 'Description 1',
      slug: '1-alpha',
    },
    {
      category: 'Category 2',
      question: 'Question 2',
      description: 'Description 2',
      slug: '2-beta',
    },
  ]);

  const writeOperations = operations.filter(({ type }) => type === 'writeFile');
  const renameOperations = operations.filter(({ type }) => type === 'rename');
  assert.equal(writeOperations.length, 2);
  assert.equal(renameOperations.length, 2);
  assert.equal(
    operations.some(({ type }) => type === 'rm'),
    false,
  );

  for (let index = 0; index < writeOperations.length; index += 1) {
    const writeOperation = writeOperations[index];
    const renameOperation = renameOperations[index];
    assert.equal(dirname(writeOperation.path), dirname(outputPath));
    assert.match(
      basename(writeOperation.path),
      /^\.ai-faqs\.en\.json\.\d+\.[0-9a-f-]{36}\.tmp$/,
    );
    assert.deepEqual(writeOperation.options, {
      encoding: 'utf8',
      flag: 'wx',
    });
    assert.equal(writeOperation.bytes, firstBytes);
    assert.equal(renameOperation.sourcePath, writeOperation.path);
    assert.equal(renameOperation.destinationPath, outputPath);
  }

  assert.notEqual(writeOperations[0].path, writeOperations[1].path);
  assert.deepEqual(await listOwnedTemporaryFiles(outputPath), []);
  assert.equal(stderr.output(), '');

  const summary = `Generated 2 AI FAQ records at ${outputPath} (${Buffer.byteLength(
    firstBytes,
  )} bytes).\n`;
  assert.equal(stdout.output(), `${summary}${summary}`);
});

test('runGenerateFAQIndex validates before publication and retains destination bytes', async (t) => {
  const { sourceDirectory, outputPath } = await createGeneratorFixture(t);
  await writeFile(
    join(sourceDirectory, '1-alpha.en.json'),
    JSON.stringify(makeSourceData({ title: '   ' })),
  );
  const stdout = createCaptureStream();
  const stderr = createCaptureStream();
  const { filesystem, operations } = createRecordingFilesystem();

  const status = await runGenerateFAQIndex({
    sourceDirectory,
    outputPath,
    expectedCount: 2,
    stdout: stdout.stream,
    stderr: stderr.stream,
    filesystem,
  });

  assert.equal(status, 1);
  assert.equal(await readFile(outputPath, 'utf8'), 'original index bytes');
  assert.deepEqual(operations, []);
  assert.deepEqual(await listOwnedTemporaryFiles(outputPath), []);
  assert.equal(stdout.output(), '');
  assert.match(
    stderr.output(),
    /^AI FAQ index parity failed for public\/ai-faqs\.en\.json\./,
  );
  assert.match(stderr.output(), /invalid source projection schemas: 1/);
  assert.equal(
    stderr
      .output()
      .endsWith('Regenerate with: npm run generate:ai-faq-index\n'),
    true,
  );
});

test('runGenerateFAQIndex cleans its exact temporary path after write or rename failure', async (t) => {
  for (const failureKind of ['write', 'rename']) {
    await t.test(failureKind, async (subtest) => {
      const { sourceDirectory, outputPath } =
        await createGeneratorFixture(subtest);
      const stdout = createCaptureStream();
      const stderr = createCaptureStream();
      const overrides =
        failureKind === 'write'
          ? {
              writeFile: async (temporaryPath, _bytes, options) => {
                await writeFile(temporaryPath, 'partial bytes', options);
                throw new Error('injected write failure');
              },
            }
          : {
              rename: async () => {
                throw new Error('injected rename failure');
              },
            };
      const { filesystem, operations } = createRecordingFilesystem(overrides);

      const status = await runGenerateFAQIndex({
        sourceDirectory,
        outputPath,
        expectedCount: 2,
        stdout: stdout.stream,
        stderr: stderr.stream,
        filesystem,
      });

      const writeOperation = operations.find(
        ({ type }) => type === 'writeFile',
      );
      const cleanupOperation = operations.find(({ type }) => type === 'rm');
      assert.equal(status, 1);
      assert.equal(await readFile(outputPath, 'utf8'), 'original index bytes');
      assert.ok(writeOperation);
      assert.equal(cleanupOperation.path, writeOperation.path);
      assert.deepEqual(cleanupOperation.options, { force: true });
      assert.deepEqual(await listOwnedTemporaryFiles(outputPath), []);
      assert.equal(stdout.output(), '');
      assert.match(
        stderr.output(),
        new RegExp(
          `^AI FAQ index generation failed: injected ${failureKind} failure\\n$`,
        ),
      );
    });
  }
});

test('runGenerateFAQIndex keeps publication failure primary when cleanup also fails', async (t) => {
  const { sourceDirectory, outputPath } = await createGeneratorFixture(t);
  const stdout = createCaptureStream();
  const stderr = createCaptureStream();
  const { filesystem } = createRecordingFilesystem({
    rename: async () => {
      throw new Error('injected rename failure');
    },
    rm: async (...args) => {
      await rm(...args);
      throw new Error('injected cleanup failure');
    },
  });

  const status = await runGenerateFAQIndex({
    sourceDirectory,
    outputPath,
    expectedCount: 2,
    stdout: stdout.stream,
    stderr: stderr.stream,
    filesystem,
  });

  assert.equal(status, 1);
  assert.equal(await readFile(outputPath, 'utf8'), 'original index bytes');
  assert.deepEqual(await listOwnedTemporaryFiles(outputPath), []);
  assert.equal(stdout.output(), '');
  assert.match(
    stderr.output(),
    /^AI FAQ index generation failed: injected rename failure\nAI FAQ index cleanup failed: injected cleanup failure\n$/,
  );
});

test('runGenerateFAQIndex reports publication truth when summary output fails', async (t) => {
  const { sourceDirectory, outputPath } = await createGeneratorFixture(t);
  const stderr = createCaptureStream();
  const stdout = {
    write() {
      throw new Error('injected stdout failure');
    },
  };

  const status = await runGenerateFAQIndex({
    sourceDirectory,
    outputPath,
    expectedCount: 2,
    stdout,
    stderr: stderr.stream,
  });

  assert.equal(status, 0);
  assert.deepEqual(JSON.parse(await readFile(outputPath, 'utf8')), [
    {
      category: 'Category 1',
      question: 'Question 1',
      description: 'Description 1',
      slug: '1-alpha',
    },
    {
      category: 'Category 2',
      question: 'Question 2',
      description: 'Description 2',
      slug: '2-beta',
    },
  ]);
  assert.match(
    stderr.output(),
    /AI FAQ index was generated, but summary output failed: injected stdout failure/,
  );
});

test('duplicate source diagnostics use code-unit filename ordering', async () => {
  const sourceDirectory = await createSourceFixture([
    { name: '1-z.en.json' },
    { name: '1-ä.en.json' },
  ]);

  try {
    const error = await captureSourceValidationError(() =>
      loadCanonicalFAQSource({ sourceDirectory, expectedCount: 1 }),
    );
    const duplicateFindings = error.findings.filter(
      ({ category }) => category === 'duplicate-source-id',
    );

    assert.deepEqual(
      duplicateFindings.map(({ sourcePath }) => basename(sourcePath)),
      ['1-z.en.json', '1-ä.en.json'],
    );
  } finally {
    await rm(sourceDirectory, { recursive: true, force: true });
  }
});

test('production CLI reports structured source ingestion failures end to end', async (t) => {
  const fixture = await createVerifierFixture(t);
  const contentDirectory = join(
    fixture.rootDirectory,
    'content',
    'ai-quick-reference',
  );
  const publicDirectory = join(fixture.rootDirectory, 'public');
  await mkdir(contentDirectory, { recursive: true });
  await mkdir(publicDirectory, { recursive: true });
  await cp(fixture.sourceDirectory, contentDirectory, { recursive: true });
  await cp(fixture.indexPath, join(publicDirectory, 'ai-faqs.en.json'));
  await writeFile(join(contentDirectory, '1-alpha.en.json'), '{');

  const verifier = spawnSync(
    process.execPath,
    [join(process.cwd(), 'scripts/verify-ai-faq-index.mjs')],
    { cwd: fixture.rootDirectory, encoding: 'utf8' },
  );
  const generator = spawnSync(
    process.execPath,
    [join(process.cwd(), 'scripts/generate-ai-faq-index.mjs')],
    { cwd: fixture.rootDirectory, encoding: 'utf8' },
  );

  assert.equal(verifier.status, 1);
  assert.match(verifier.stderr, /invalid source projection schemas: 1/);
  assertExactTopLevelFindingCategories(verifier.stderr);
  assert.equal(generator.status, 1);
  assert.match(generator.stderr, /invalid source projection schemas: 1/);
  assertExactTopLevelFindingCategories(generator.stderr);
  assert.equal(
    await readFile(join(publicDirectory, 'ai-faqs.en.json'), 'utf8'),
    await readFile(fixture.indexPath, 'utf8'),
  );
});

test('production verifier CLI covers source and index ingestion matrix', async (t) => {
  const cases = [
    {
      name: 'malformed source filename',
      mutate: (sourceDirectory) =>
        writeFile(
          join(sourceDirectory, 'bad-name.json'),
          JSON.stringify(makeSourceData()),
        ),
      expected: /malformed source identifiers: 1/,
    },
    {
      name: 'sparse source IDs',
      mutate: (sourceDirectory) => rm(join(sourceDirectory, '2-beta.en.json')),
      expected: /source-only IDs: [1-9]\d*/,
    },
    {
      name: 'duplicate source IDs',
      mutate: (sourceDirectory) =>
        writeFile(
          join(sourceDirectory, '1-other.en.json'),
          JSON.stringify(makeSourceData()),
        ),
      expected: /duplicate source IDs: 2/,
    },
    {
      name: 'unreadable source file',
      mutate: async (sourceDirectory) => {
        const sourcePath = join(sourceDirectory, '1-alpha.en.json');
        await chmod(sourcePath, 0o000);
        return () => chmod(sourcePath, 0o644);
      },
      expected: /invalid source projection schemas: 1/,
    },
    {
      name: 'invalid UTF-8 source bytes',
      mutate: (sourceDirectory) =>
        writeFile(
          join(sourceDirectory, '1-alpha.en.json'),
          Buffer.from([0x7b, 0x22, 0xff, 0x22, 0x3a, 0x31, 0x7d]),
        ),
      expected: /invalid source projection schemas: 1/,
    },
    {
      name: 'invalid index JSON',
      mutate: (_sourceDirectory, indexPath) => writeFile(indexPath, '{'),
      expected: /invalid index projection schemas: 1/,
    },
    {
      name: 'invalid UTF-8 index bytes',
      mutate: (_sourceDirectory, indexPath) =>
        writeFile(indexPath, Buffer.from([0xff, 0x7b])),
      expected: /invalid index projection schemas: 1/,
    },
  ];

  for (const fixtureCase of cases) {
    await t.test(fixtureCase.name, async (subtest) => {
      const fixture = await createVerifierFixture(subtest);
      const contentDirectory = join(
        fixture.rootDirectory,
        'content',
        'ai-quick-reference',
      );
      const publicDirectory = join(fixture.rootDirectory, 'public');
      await mkdir(contentDirectory, { recursive: true });
      await mkdir(publicDirectory, { recursive: true });
      await cp(fixture.sourceDirectory, contentDirectory, { recursive: true });
      await cp(fixture.indexPath, join(publicDirectory, 'ai-faqs.en.json'));

      const restorePermissions = await fixtureCase.mutate(
        contentDirectory,
        join(publicDirectory, 'ai-faqs.en.json'),
      );
      const indexBefore = await readFile(
        join(publicDirectory, 'ai-faqs.en.json'),
      );
      const result = spawnSync(
        process.execPath,
        [join(process.cwd(), 'scripts/verify-ai-faq-index.mjs')],
        { cwd: fixture.rootDirectory, encoding: 'utf8' },
      );
      await restorePermissions?.();

      assert.equal(result.status, 1, result.stdout);
      assert.match(result.stderr, fixtureCase.expected);
      assertExactTopLevelFindingCategories(result.stderr);
      assert.deepEqual(
        await readFile(join(publicDirectory, 'ai-faqs.en.json')),
        indexBefore,
      );
      assert.match(
        result.stderr,
        /Regenerate with: npm run generate:ai-faq-index\n$/,
      );
    });
  }
});

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
      error.findings.filter(({ category }) => category === 'missing-source-id'),
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
    assert.equal(finding.sourcePath, join(sourceDirectory, '2-beta.en.json'));
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

test('the committed source corpus loads as 2,000 canonical numeric records', async () => {
  const records = await loadCanonicalFAQSource();

  assert.equal(records.length, 2000);
  assert.equal(records[0].id, 1);
  assert.equal(records[1999].id, 2000);
  assert.deepEqual(
    records.map(({ id }) => id),
    Array.from({ length: 2000 }, (_, index) => index + 1),
  );

  const bytes = serializeCanonicalFAQIndex(records);
  assert.equal(bytes.endsWith(']'), true);
  assert.equal(bytes.endsWith('\n'), false);
  assert.deepEqual(Object.keys(JSON.parse(bytes)[0]), [
    'category',
    'question',
    'description',
    'slug',
  ]);
});

test('the committed FAQ index matches all 2,000 canonical source records and bytes', async () => {
  const sourceRecords = await loadCanonicalFAQSource();
  const indexBytes = await readFile('public/ai-faqs.en.json', 'utf8');
  const indexRecords = JSON.parse(indexBytes);
  const report = compareFAQIndexRecords({
    sourceRecords,
    indexRecords,
    indexBytes,
  });
  const nonzeroFindings = Object.fromEntries(
    report.categories
      .filter(({ total }) => total > 0)
      .map(({ key, total }) => [key, total]),
  );

  assert.equal(sourceRecords.length, 2000);
  assert.equal(indexRecords.length, 2000);
  assert.deepEqual(
    indexRecords.map(
      ({ slug }) => parseFAQSourceFilename(`${slug}.en.json`)?.id,
    ),
    Array.from({ length: 2000 }, (_, index) => index + 1),
  );
  assert.equal(
    indexRecords.findIndex(
      (record) =>
        Object.keys(record).join(',') !==
        ['category', 'question', 'description', 'slug'].join(','),
    ),
    -1,
  );
  assert.equal(indexBytes.endsWith('\n'), false);
  assert.deepEqual(
    nonzeroFindings,
    {},
    `Committed index drift: ${JSON.stringify(nonzeroFindings)}`,
  );
  assert.equal(indexBytes, serializeCanonicalFAQIndex(sourceRecords));
});

test('compareFAQIndexRecords accepts exact records and preserves category order', () => {
  const sourceRecords = makeCanonicalSourceRecords();
  const indexRecords = makeCanonicalIndexRecords(sourceRecords);
  const indexBytes = JSON.stringify(indexRecords);

  const report = compareFAQIndexRecords({
    sourceRecords,
    indexRecords,
    indexBytes,
  });

  assert.deepEqual(
    FAQ_INDEX_FINDING_CATEGORIES.map(({ key }) => key),
    EXPECTED_FINDING_CATEGORY_KEYS,
  );
  assert.deepEqual(
    report.categories.map(({ key }) => key),
    EXPECTED_FINDING_CATEGORY_KEYS,
  );
  assert.equal(report.ok, true);
  assert.equal(report.totalFindings, 0);
  assert.equal(report.recordCount, 3);
});

test('compareFAQIndexRecords counts every parity finding category', async (t) => {
  const cases = [
    {
      key: 'malformed-source-identifiers',
      mutate({ sourceRecords }) {
        sourceRecords[0].filename = 'malformed.en.json';
      },
    },
    {
      key: 'malformed-index-identifiers',
      mutate({ indexRecords }) {
        indexRecords[0].slug = 'malformed';
      },
    },
    {
      key: 'invalid-source-projection-schemas',
      mutate({ sourceRecords }) {
        sourceRecords[0].data.title = '   ';
      },
    },
    {
      key: 'invalid-index-projection-schemas',
      mutate({ indexRecords }) {
        delete indexRecords[0].question;
      },
    },
    {
      key: 'duplicate-source-ids',
      mutate({ sourceRecords }) {
        sourceRecords.push({
          ...sourceRecords[0],
          filename: '1-other.en.json',
          slug: '1-other',
          sourcePath: '/fixture/1-other.en.json',
          sourcePosition: 4,
        });
      },
    },
    {
      key: 'duplicate-index-ids',
      mutate({ indexRecords }) {
        indexRecords.push({ ...indexRecords[0], slug: '1-other' });
      },
    },
    {
      key: 'duplicate-source-slugs',
      mutate({ sourceRecords }) {
        sourceRecords.push({
          ...sourceRecords[0],
          sourcePosition: 4,
        });
      },
    },
    {
      key: 'duplicate-index-slugs',
      mutate({ indexRecords }) {
        indexRecords.push({ ...indexRecords[0] });
      },
    },
    {
      key: 'source-only-ids',
      mutate({ indexRecords }) {
        indexRecords.splice(1, 1);
      },
    },
    {
      key: 'index-only-ids',
      mutate({ indexRecords }) {
        indexRecords.push({
          category: 'Category 4',
          question: 'Question 4',
          description: 'Description 4',
          slug: '4-slug-4',
        });
      },
    },
    {
      key: 'ordering-drift',
      mutate({ indexRecords }) {
        [indexRecords[1], indexRecords[2]] = [indexRecords[2], indexRecords[1]];
      },
    },
    {
      key: 'slug-drift',
      mutate({ indexRecords }) {
        indexRecords[0].slug = '1-changed-slug';
      },
    },
    {
      key: 'question-drift',
      mutate({ indexRecords }) {
        indexRecords[0].question = 'Changed question';
      },
    },
    {
      key: 'description-drift',
      mutate({ indexRecords }) {
        indexRecords[0].description = 'Changed description';
      },
    },
    {
      key: 'category-drift',
      mutate({ indexRecords }) {
        indexRecords[0].category = 'Changed category';
      },
    },
    {
      key: 'non-canonical-serialization',
      mutate(state) {
        state.indexBytes = `${JSON.stringify(state.indexRecords, null, 2)}\n`;
      },
    },
  ];

  for (const fixtureCase of cases) {
    await t.test(fixtureCase.key, () => {
      const sourceRecords = makeCanonicalSourceRecords();
      const indexRecords = makeCanonicalIndexRecords(sourceRecords);
      const state = { sourceRecords, indexRecords, indexBytes: null };
      fixtureCase.mutate(state);

      const report = compareFAQIndexRecords({
        sourceRecords,
        indexRecords,
        indexBytes: state.indexBytes ?? JSON.stringify(indexRecords),
      });

      assert.equal(report.ok, false);
      assert.ok(getReportCategory(report, fixtureCase.key).total > 0);
      assert.deepEqual(
        report.categories.map(({ key }) => key),
        EXPECTED_FINDING_CATEGORY_KEYS,
      );
    });
  }
});

test('field drift stays aligned by numeric ID without membership findings', () => {
  const sourceRecords = makeCanonicalSourceRecords();
  const indexRecords = makeCanonicalIndexRecords(sourceRecords);
  indexRecords[1].slug = '2-correct-id-with-stale-slug';

  const report = compareFAQIndexRecords({
    sourceRecords,
    indexRecords,
    indexBytes: JSON.stringify(indexRecords),
  });

  assert.equal(getReportCategory(report, 'slug-drift').total, 1);
  assert.equal(getReportCategory(report, 'source-only-ids').total, 0);
  assert.equal(getReportCategory(report, 'index-only-ids').total, 0);
  assert.deepEqual(getReportCategory(report, 'slug-drift').findings[0], {
    id: 2,
    sourcePosition: 2,
    indexPosition: 2,
    field: 'slug',
    expected: '2-slug-2',
    actual: '2-correct-id-with-stale-slug',
  });
});

test('one membership error does not create relative ordering drift', () => {
  const sourceRecords = makeCanonicalSourceRecords();
  const indexRecords = makeCanonicalIndexRecords(sourceRecords);
  indexRecords.splice(1, 1);

  const report = compareFAQIndexRecords({
    sourceRecords,
    indexRecords,
    indexBytes: JSON.stringify(indexRecords),
  });

  assert.equal(getReportCategory(report, 'source-only-ids').total, 1);
  assert.equal(getReportCategory(report, 'ordering-drift').total, 0);
});

test('formatFAQIndexReport emits stable totals and caps details at 20', () => {
  const sourceRecords = makeCanonicalSourceRecords(21);
  const indexRecords = makeCanonicalIndexRecords(sourceRecords).map(
    (record, index) => ({
      ...record,
      question: `Changed question\n${index + 1}`,
    }),
  );
  const report = compareFAQIndexRecords({
    sourceRecords,
    indexRecords,
    indexBytes: JSON.stringify(indexRecords),
  });

  const output = formatFAQIndexReport(report);
  const questionDetails = output
    .split('\n')
    .filter(
      (line) => line.startsWith('  - ') && line.includes('field="question"'),
    );

  assert.equal(getReportCategory(report, 'question-drift').total, 21);
  assert.equal(questionDetails.length, 20);
  assert.match(output, /question drift: 21/);
  assert.match(output, /expected="Question 1"/);
  assert.match(output, /actual="Changed question\\n1"/);
  assert.doesNotMatch(output, /actual="Changed question\n1"/);
  assert.ok(
    output.indexOf('malformed source identifiers: 0') <
      output.indexOf('malformed index identifiers: 0'),
  );
  assert.ok(
    output.indexOf('category drift: 0') <
      output.indexOf('non-canonical serialization: 1'),
  );
  assert.equal(output.endsWith('npm run generate:ai-faq-index\n'), true);
});

test('canonical byte drift is reported when parsed records are equal', () => {
  const sourceRecords = makeCanonicalSourceRecords();
  const indexRecords = makeCanonicalIndexRecords(sourceRecords);
  const report = compareFAQIndexRecords({
    sourceRecords,
    indexRecords,
    indexBytes: `${JSON.stringify(indexRecords)}\n`,
  });

  assert.equal(report.totalFindings, 1);
  assert.equal(
    getReportCategory(report, 'non-canonical-serialization').total,
    1,
  );
});

test('invalid source identity suppresses derivative byte findings', () => {
  const sourceRecords = makeCanonicalSourceRecords();
  const indexRecords = makeCanonicalIndexRecords(sourceRecords);
  sourceRecords[0].filename = 'malformed.en.json';

  const report = compareFAQIndexRecords({
    sourceRecords,
    indexRecords,
    indexBytes: JSON.stringify(indexRecords),
  });

  assert.equal(
    getReportCategory(report, 'malformed-source-identifiers').total,
    1,
  );
  assert.equal(
    getReportCategory(report, 'non-canonical-serialization').total,
    0,
  );
});
