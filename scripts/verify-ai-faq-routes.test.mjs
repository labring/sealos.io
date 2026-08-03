import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  compareFAQRouteInventories,
  formatFAQRouteReport,
  inspectFAQPageIdentity,
  parseFAQRouteTarget,
  runVerifyFAQRoutes,
} from './verify-ai-faq-routes.mjs';

function sourceRecord(id, slug, overrides = {}) {
  return {
    id,
    slug,
    data: {
      category: `Category ${id}`,
      title: `Question ${id}`,
      description: `Description ${id}`,
      ...overrides,
    },
  };
}

function indexRecord(record) {
  return {
    category: record.data.category,
    question: record.data.title,
    description: record.data.description,
    slug: record.slug,
  };
}

function createStreamCapture() {
  let output = '';
  return {
    stream: {
      write(value) {
        output += value;
      },
    },
    read() {
      return output;
    },
  };
}

function createReport(overrides = {}) {
  return {
    target: 'out',
    mode: 'local',
    checkedAt: '2026-08-04T00:00:00.000Z',
    inventories: Object.fromEntries(
      ['source', 'index', 'sitemap', 'route'].map((name) => [
        name,
        { total: 2, unique: 2, duplicates: 0 },
      ]),
    ),
    statusHistogram: { 200: 2 },
    routesAttempted: 2,
    identityPagesChecked: 2,
    identityFieldsChecked: 8,
    invalidRoutesAttempted: 2,
    invalidRoutesAccepted: 2,
    findings: [],
    ...overrides,
  };
}

test('compares complete route inventories independently of input order', () => {
  const source = [sourceRecord(1, '1-alpha'), sourceRecord(2, '2-beta')];
  const report = compareFAQRouteInventories({
    source,
    index: source.toReversed().map(indexRecord),
    sitemap: source.toReversed().map(({ slug }) => slug),
    route: source.toReversed().map(({ slug }) => slug),
  });

  assert.deepEqual(
    Object.fromEntries(
      Object.entries(report.inventories).map(([name, inventory]) => [
        name,
        { total: inventory.total, unique: inventory.unique },
      ]),
    ),
    {
      source: { total: 2, unique: 2 },
      index: { total: 2, unique: 2 },
      sitemap: { total: 2, unique: 2 },
      route: { total: 2, unique: 2 },
    },
  );
  assert.deepEqual(report.findings, []);
});

test('reports duplicates and every directional inventory difference deterministically', () => {
  const alpha = sourceRecord(1, '1-alpha');
  const beta = sourceRecord(2, '2-beta');
  const gamma = indexRecord(sourceRecord(3, '3-gamma'));
  const inputs = {
    source: [beta, alpha, alpha],
    index: [indexRecord(beta), gamma, gamma],
    sitemap: ['4-delta', beta.slug, beta.slug],
    route: ['5-epsilon', beta.slug, beta.slug],
  };
  const report = compareFAQRouteInventories(inputs);

  assert.deepEqual(
    report.findings.map(({ category, slug }) => [category, slug]),
    [
      ['duplicate-source-slugs', '1-alpha'],
      ['duplicate-index-slugs', '3-gamma'],
      ['duplicate-sitemap-slugs', '2-beta'],
      ['duplicate-route-slugs', '2-beta'],
      ['source-only-index-slugs', '1-alpha'],
      ['index-only-source-slugs', '3-gamma'],
      ['source-only-sitemap-slugs', '1-alpha'],
      ['sitemap-only-source-slugs', '4-delta'],
      ['source-only-route-slugs', '1-alpha'],
      ['route-only-source-slugs', '5-epsilon'],
    ],
  );
  assert.deepEqual(report.membership['1-alpha'], {
    source: true,
    index: false,
    sitemap: false,
    route: false,
  });
  assert.deepEqual(report.membership['2-beta'], {
    source: true,
    index: true,
    sitemap: true,
    route: true,
  });
  assert.deepEqual(
    report.findings.find(
      ({ category }) => category === 'source-only-index-slugs',
    ).presentIn,
    report.membership['1-alpha'],
  );
  assert.equal(
    JSON.stringify(report),
    JSON.stringify(
      compareFAQRouteInventories(
        Object.fromEntries(
          Object.entries(inputs).map(([name, values]) => [
            name,
            values.toReversed(),
          ]),
        ),
      ),
    ),
  );
});

test('validates all page identity fields with nested markup and entities', () => {
  const record = sourceRecord(7, '7-a-and-b', {
    title: 'A & B',
    description: 'Deploy "A & B" safely',
  });
  const html = `<!doctype html>
    <html><head>
      <meta content="Deploy &quot;A &amp; B&quot; safely" name="description">
      <link href="https://sealos.io/ai-quick-reference/7-a-and-b/" rel="canonical">
      <title>A &amp; <span>B</span> | Sealos</title>
    </head><body><h1>A <strong>&amp;</strong> B</h1></body></html>`;

  assert.deepEqual(inspectFAQPageIdentity({ html, record }), []);
});

test('reports missing, duplicate, and mismatched identity fields independently', () => {
  const record = sourceRecord(8, '8-identity');
  const html = `<!doctype html>
    <html><head>
      <title>Wrong</title><title>Question 8 | Sealos</title>
      <meta name="description" content="Wrong description">
      <link rel="canonical" href="https://sealos.io/wrong/">
      <link href="https://sealos.io/ai-quick-reference/8-identity/" rel="canonical">
    </head><body></body></html>`;

  assert.deepEqual(
    inspectFAQPageIdentity({ html, record }).map(({ category, field }) => [
      category,
      field,
    ]),
    [
      ['missing-page-identity', 'h1'],
      ['duplicate-page-identity', 'canonical'],
      ['duplicate-page-identity', 'title'],
      ['mismatched-page-identity', 'canonical'],
      ['mismatched-page-identity', 'description'],
      ['mismatched-page-identity', 'title'],
    ],
  );
});

test('parses the retained local and remote target contract', () => {
  assert.deepEqual(parseFAQRouteTarget([]), {
    target: 'out',
    mode: 'local',
    findings: [],
  });
  assert.deepEqual(parseFAQRouteTarget(['https://sealos.io/']), {
    target: 'https://sealos.io',
    mode: 'remote',
    findings: [],
  });
  assert.equal(parseFAQRouteTarget(['ftp://sealos.io']).findings.length, 1);
  assert.equal(parseFAQRouteTarget(['out', 'extra']).findings.length, 1);
});

test('writes a complete passing report to stdout and returns zero', async () => {
  const stdout = createStreamCapture();
  const stderr = createStreamCapture();
  const status = await runVerifyFAQRoutes({
    args: [],
    inspectTarget: async () => createReport(),
    now: () => new Date('2026-08-04T00:00:00.000Z'),
    stdout: stdout.stream,
    stderr: stderr.stream,
  });

  assert.equal(status, 0);
  assert.equal(stderr.read(), '');
  assert.match(stdout.read(), /Target: "out"/);
  assert.match(stdout.read(), /Mode: local/);
  assert.match(stdout.read(), /source: total=2 unique=2 duplicates=0/);
  assert.match(stdout.read(), /HTTP statuses: 200=2/);
  assert.match(stdout.read(), /Identity fields checked: 8/);
  assert.match(stdout.read(), /Result: PASS/);
});

test('renders complete totals, bounded escaped details, and deterministic bytes', () => {
  const findings = Array.from({ length: 21 }, (_, index) => ({
    category: 'mismatched-page-identity',
    id: 21 - index,
    slug: `${21 - index}-slug`,
    field: 'title',
    expected: 'expected',
    actual: `line ${21 - index}\nvalue`,
  }));
  const report = createReport({ findings });
  const output = formatFAQRouteReport(report);
  const reversedOutput = formatFAQRouteReport({
    ...report,
    findings: findings.toReversed(),
  });

  assert.equal(output, reversedOutput);
  assert.match(output, /Mismatched page identity fields: 21/);
  assert.equal(output.match(/^    \{/gm)?.length, 20);
  assert.match(output, /line 1\\nvalue/);
  assert.doesNotMatch(output, /line 21\\nvalue/);
  assert.match(output, /Result: FAIL/);
  assert.match(output, /Rerun: npm run verify:ai-faq-routes/);
});

test('writes one complete failing report to stderr after inspection', async () => {
  const stdout = createStreamCapture();
  const stderr = createStreamCapture();
  const report = createReport({
    findings: [
      {
        category: 'source-only-index-slugs',
        id: 2,
        slug: '2-beta',
        field: 'slug',
        expected: true,
        actual: false,
      },
    ],
  });
  const status = await runVerifyFAQRoutes({
    args: ['https://sealos.io/'],
    inspectTarget: async ({ target, mode, checkedAt }) => ({
      ...report,
      target,
      mode,
      checkedAt,
    }),
    now: () => new Date('2026-08-04T00:00:00.000Z'),
    stdout: stdout.stream,
    stderr: stderr.stream,
  });

  assert.equal(status, 1);
  assert.equal(stdout.read(), '');
  assert.match(stderr.read(), /Source slugs missing from index: 1/);
  assert.match(
    stderr.read(),
    /Rerun: npm run verify:ai-faq-routes -- https:\/\/sealos\.io/,
  );
});

test('retains the package command exactly', async () => {
  const packageJson = JSON.parse(await readFile('package.json', 'utf8'));
  assert.equal(
    packageJson.scripts['verify:ai-faq-routes'],
    'node scripts/verify-ai-faq-routes.mjs',
  );
});
