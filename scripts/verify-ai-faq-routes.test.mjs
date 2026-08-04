import assert from 'node:assert/strict';
import {
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import {
  compareFAQRouteInventories,
  formatFAQRouteReport,
  inspectFAQPageIdentity,
  inspectLocalFAQTarget,
  inspectRemoteFAQTarget,
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

function createPageHtml(record, overrides = {}) {
  const title = overrides.title ?? `${record.data.title} | Sealos`;
  const h1 = overrides.h1 ?? record.data.title;
  const description = overrides.description ?? record.data.description;
  const canonical =
    overrides.canonical ??
    `https://sealos.io/ai-quick-reference/${record.slug}/`;
  return `<!doctype html><html><head>
    <title>${title}</title>
    <meta content="${description}" name="description">
    <link href="${canonical}" rel="canonical">
    </head><body><h1><span>${h1}</span></h1></body></html>`;
}

async function createLocalTarget(
  t,
  records,
  {
    indexRecords = records.map(indexRecord),
    sitemapSlugs = records.map(({ slug }) => slug),
    routeRecords = records,
    routeHtml = new Map(),
    indexText,
    sitemapText,
  } = {},
) {
  const target = await mkdtemp(join(tmpdir(), 'faq-routes-'));
  t.after(() => rm(target, { recursive: true, force: true }));
  const routeRoot = join(target, 'ai-quick-reference');
  await mkdir(routeRoot, { recursive: true });
  await writeFile(
    join(target, 'ai-faqs.en.json'),
    indexText ?? JSON.stringify(indexRecords),
  );
  await writeFile(
    join(routeRoot, 'sitemap.xml'),
    sitemapText ??
      `<urlset>${sitemapSlugs
        .map(
          (slug) =>
            `<url><loc>https://sealos.io/ai-quick-reference/${slug}/</loc></url>`,
        )
        .join('')}</urlset>`,
  );

  for (const record of routeRecords) {
    const directory = join(routeRoot, record.slug);
    await mkdir(directory, { recursive: true });
    await writeFile(
      join(directory, 'index.html'),
      routeHtml.get(record.slug) ?? createPageHtml(record),
    );
  }

  return target;
}

function createRemoteFixture(
  records,
  {
    indexRecords = records.map(indexRecord),
    sitemapSlugs = records.map(({ slug }) => slug),
    overrides = new Map(),
    reverseCompletion = false,
  } = {},
) {
  const calls = [];
  const bodyReads = new Map();
  let active = 0;
  let maximumActive = 0;
  const pageBySlug = new Map(records.map((record) => [record.slug, record]));

  async function fetchImpl(input, options) {
    const url = new URL(input);
    const pathname = url.pathname.replace(/\/$/, '') || '/';
    calls.push({ pathname, options });
    active += 1;
    maximumActive = Math.max(maximumActive, active);
    const numericId = Number(
      /^\/ai-quick-reference\/(\d+)-/.exec(pathname)?.[1],
    );
    const delayTurns = Number.isSafeInteger(numericId)
      ? reverseCompletion
        ? numericId
        : records.length - numericId
      : 0;
    for (let turn = 0; turn < Math.min(delayTurns, 3); turn += 1) {
      await new Promise((resolvePromise) => setImmediate(resolvePromise));
    }

    try {
      const override = overrides.get(pathname);
      if (override?.error) throw override.error;

      let status = override?.status;
      let body = override?.body;
      if (pathname === '/ai-faqs.en.json') {
        status ??= 200;
        body ??= JSON.stringify(indexRecords);
      } else if (pathname === '/ai-quick-reference/sitemap.xml') {
        status ??= 200;
        body ??= `<urlset>${sitemapSlugs
          .map(
            (slug) =>
              `<url><loc>https://sealos.io/ai-quick-reference/${slug}/</loc></url>`,
          )
          .join('')}</urlset>`;
      } else {
        const slug = pathname.split('/').at(-1);
        const record = pageBySlug.get(slug);
        status ??= record ? 200 : 404;
        body ??= record ? createPageHtml(record) : '';
      }

      return {
        status,
        async text() {
          bodyReads.set(pathname, (bodyReads.get(pathname) ?? 0) + 1);
          if (override?.bodyError) throw override.bodyError;
          return body;
        },
      };
    } finally {
      active -= 1;
    }
  }

  return {
    fetchImpl,
    calls,
    bodyReads,
    get maximumActive() {
      return maximumActive;
    },
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
  assert.equal(
    packageJson.scripts.build,
    'npm run verify:ai-faq-index && next build && node scripts/normalize-root-locale.js && npm run verify:ai-faq-routes',
  );
  assert.equal(
    packageJson.scripts['build:analyze'],
    'npm run verify:ai-faq-index && ANALYZE=true next build && node scripts/normalize-root-locale.js && npm run verify:ai-faq-routes',
  );
});

test('inspects every local page in deterministic batches of at most 32', async (t) => {
  const records = Array.from({ length: 40 }, (_, index) => {
    const id = index + 1;
    const slug = id <= 2 ? `${id}-shared` : `${id}-slug-${id}`;
    return sourceRecord(id, slug);
  });
  const target = await createLocalTarget(t, records);
  let activeRouteReads = 0;
  let maximumRouteReads = 0;
  const observedRouteReads = [];
  const filesystem = {
    async readFile(path) {
      if (path.endsWith('index.html')) {
        activeRouteReads += 1;
        maximumRouteReads = Math.max(maximumRouteReads, activeRouteReads);
        observedRouteReads.push(path);
        await new Promise((resolvePromise) => setImmediate(resolvePromise));
        try {
          return await readFile(path);
        } finally {
          activeRouteReads -= 1;
        }
      }
      return readFile(path);
    },
    async readdir(path, options) {
      return (await readdir(path, options)).toReversed();
    },
  };

  const report = await inspectLocalFAQTarget({
    target,
    mode: 'local',
    checkedAt: '2026-08-04T00:00:00.000Z',
    loadSource: async () => records,
    filesystem,
  });

  assert.deepEqual(report.findings, []);
  assert.equal(maximumRouteReads, 32);
  assert.equal(observedRouteReads.length, 42);
  assert.deepEqual(
    Object.fromEntries(
      Object.entries(report.inventories).map(([name, inventory]) => [
        name,
        [inventory.total, inventory.unique],
      ]),
    ),
    {
      source: [40, 40],
      index: [40, 40],
      sitemap: [40, 40],
      route: [40, 40],
    },
  );
  assert.equal(report.routesAttempted, 40);
  assert.equal(report.identityPagesChecked, 40);
  assert.equal(report.identityFieldsChecked, 160);
  assert.deepEqual(report.statusHistogram, { 200: 40, 404: 2 });
  assert.equal(report.invalidRoutesAttempted, 2);
  assert.equal(report.invalidRoutesAccepted, 2);
});

test('collects local ingestion, membership, read, identity, and invalid-route findings', async (t) => {
  const records = [
    sourceRecord(1, '1-shared'),
    sourceRecord(2, '2-shared'),
    sourceRecord(3, '3-third'),
  ];
  const extraRoute = sourceRecord(5, '5-extra-route');
  const routeHtml = new Map([
    [records[0].slug, createPageHtml(records[0], { title: 'Wrong title' })],
  ]);
  const duplicateIndex = indexRecord(records[0]);
  duplicateIndex.question = 'Wrong question';
  const target = await createLocalTarget(t, records, {
    indexRecords: [
      indexRecord(records[0]),
      duplicateIndex,
      indexRecord(records[2]),
    ],
    sitemapSlugs: [
      records[0].slug,
      records[0].slug,
      records[2].slug,
      '4-extra-sitemap',
    ],
    routeRecords: [records[0], records[2], extraRoute],
    routeHtml,
  });
  const ambiguousDirectory = join(target, 'ai-quick-reference', 'shared');
  await mkdir(ambiguousDirectory);
  await writeFile(
    join(ambiguousDirectory, 'index.html'),
    createPageHtml(sourceRecord(9, 'shared')),
  );
  const unreadablePath = join(
    target,
    'ai-quick-reference',
    records[2].slug,
    'index.html',
  );

  const report = await inspectLocalFAQTarget({
    target,
    mode: 'local',
    checkedAt: '2026-08-04T00:00:00.000Z',
    loadSource: async () => records,
    filesystem: {
      async readFile(path) {
        if (path === unreadablePath) {
          const error = new Error('permission denied');
          error.code = 'EACCES';
          throw error;
        }
        return readFile(path);
      },
      readdir,
    },
  });
  const categories = new Set(report.findings.map(({ category }) => category));

  for (const category of [
    'duplicate-index-slugs',
    'duplicate-sitemap-slugs',
    'source-only-index-slugs',
    'source-only-sitemap-slugs',
    'sitemap-only-source-slugs',
    'source-only-route-slugs',
    'route-only-source-slugs',
    'index-question-mismatches',
    'route-read-failures',
    'mismatched-page-identity',
    'invalid-route-status-failures',
  ]) {
    assert.ok(categories.has(category), category);
  }
  assert.equal(report.routesAttempted, 2);
  assert.equal(report.identityPagesChecked, 1);
  assert.equal(report.invalidRoutesAttempted, 2);
  assert.equal(report.invalidRoutesAccepted, 1);
});

test('reports malformed local index and sitemap data structurally', async (t) => {
  const records = [sourceRecord(1, '1-shared'), sourceRecord(2, '2-shared')];
  const target = await createLocalTarget(t, records, {
    indexText: '{broken',
    sitemapText: '<urlset><loc>broken</loc>',
  });
  const report = await inspectLocalFAQTarget({
    target,
    mode: 'local',
    checkedAt: '2026-08-04T00:00:00.000Z',
    loadSource: async () => records,
  });

  assert.ok(
    report.findings.some(({ category }) => category === 'invalid-index-data'),
  );
  assert.ok(
    report.findings.some(({ category }) => category === 'invalid-sitemap-data'),
  );
  assert.equal(report.inventories.route.total, 2);
});

test('fetches every remote route once with eight workers and fixed request bounds', async () => {
  const records = Array.from({ length: 18 }, (_, index) => {
    const id = index + 1;
    return sourceRecord(id, id <= 2 ? `${id}-shared` : `${id}-slug-${id}`);
  });
  const fixture = createRemoteFixture(records, { reverseCompletion: true });
  const timeoutSignals = [];
  const report = await inspectRemoteFAQTarget({
    target: 'https://example.test',
    mode: 'remote',
    checkedAt: '2026-08-04T00:00:00.000Z',
    expectedCount: records.length,
    loadSource: async () => records,
    fetchImpl: fixture.fetchImpl,
    createTimeoutSignal(timeoutMs) {
      const signal = { timeoutMs };
      timeoutSignals.push(signal);
      return signal;
    },
  });

  assert.deepEqual(report.findings, []);
  assert.equal(fixture.maximumActive, 8);
  assert.equal(fixture.calls.length, 22);
  assert.equal(timeoutSignals.length, 22);
  assert.ok(timeoutSignals.every(({ timeoutMs }) => timeoutMs === 10_000));
  assert.ok(
    fixture.calls.every(
      ({ options }) =>
        options.redirect === 'manual' && options.signal.timeoutMs === 10_000,
    ),
  );
  for (const record of records) {
    const pathname = `/ai-quick-reference/${record.slug}`;
    assert.equal(
      fixture.calls.filter((call) => call.pathname === pathname).length,
      1,
    );
    assert.equal(fixture.bodyReads.get(pathname), 1);
  }
  assert.equal(fixture.bodyReads.get('/ai-faqs.en.json'), 1);
  assert.equal(fixture.bodyReads.get('/ai-quick-reference/sitemap.xml'), 1);
  assert.equal(fixture.bodyReads.get('/ai-quick-reference/shared'), undefined);
  assert.deepEqual(report.statusHistogram, { 200: 18, 404: 2 });
  assert.equal(report.routesAttempted, 18);
  assert.equal(report.identityPagesChecked, 18);
  assert.equal(report.identityFieldsChecked, 72);
  assert.equal(report.invalidRoutesAccepted, 2);
});

test('keeps remote output stable across opposite completion schedules', async () => {
  const records = Array.from({ length: 12 }, (_, index) => {
    const id = index + 1;
    return sourceRecord(id, id <= 2 ? `${id}-shared` : `${id}-slug-${id}`);
  });
  const forward = createRemoteFixture(records);
  const reverse = createRemoteFixture(records, { reverseCompletion: true });
  const options = {
    target: 'https://example.test',
    mode: 'remote',
    checkedAt: '2026-08-04T00:00:00.000Z',
    expectedCount: records.length,
    loadSource: async () => records,
    createTimeoutSignal: (timeoutMs) => ({ timeoutMs }),
  };

  const forwardReport = await inspectRemoteFAQTarget({
    ...options,
    fetchImpl: forward.fetchImpl,
  });
  const reverseReport = await inspectRemoteFAQTarget({
    ...options,
    fetchImpl: reverse.fetchImpl,
  });
  assert.equal(
    formatFAQRouteReport(forwardReport),
    formatFAQRouteReport(reverseReport),
  );
});

test('collects remote timeout, network, status, body, and identity failures in one pass', async () => {
  const records = Array.from({ length: 8 }, (_, index) => {
    const id = index + 1;
    return sourceRecord(id, id <= 2 ? `${id}-shared` : `${id}-slug-${id}`);
  });
  const overrides = new Map([
    ['/ai-quick-reference/1-shared', { error: new Error('connection reset') }],
    [
      '/ai-quick-reference/2-shared',
      {
        error: Object.assign(new Error('timed out'), { name: 'TimeoutError' }),
      },
    ],
    ['/ai-quick-reference/3-slug-3', { status: 301 }],
    ['/ai-quick-reference/4-slug-4', { status: 404 }],
    ['/ai-quick-reference/5-slug-5', { status: 500 }],
    [
      '/ai-quick-reference/6-slug-6',
      { bodyError: new Error('body stream failed') },
    ],
    [
      '/ai-quick-reference/7-slug-7',
      { body: createPageHtml(records[6], { title: 'Wrong title' }) },
    ],
  ]);
  const fixture = createRemoteFixture(records, { overrides });
  const report = await inspectRemoteFAQTarget({
    target: 'https://example.test',
    mode: 'remote',
    checkedAt: '2026-08-04T00:00:00.000Z',
    expectedCount: records.length,
    loadSource: async () => records,
    fetchImpl: fixture.fetchImpl,
    createTimeoutSignal: (timeoutMs) => ({ timeoutMs }),
  });
  const totals = Object.fromEntries(
    [
      'route-network-failures',
      'route-timeout-failures',
      'route-status-failures',
      'route-body-read-failures',
      'mismatched-page-identity',
    ].map((category) => [
      category,
      report.findings.filter((finding) => finding.category === category).length,
    ]),
  );

  assert.deepEqual(totals, {
    'route-network-failures': 1,
    'route-timeout-failures': 1,
    'route-status-failures': 3,
    'route-body-read-failures': 1,
    'mismatched-page-identity': 1,
  });
  assert.equal(report.routesAttempted, 8);
  assert.equal(report.identityPagesChecked, 2);
  assert.equal(report.inventories.route.total, 3);
  for (const record of records) {
    assert.equal(
      fixture.calls.filter(
        ({ pathname }) => pathname === `/ai-quick-reference/${record.slug}`,
      ).length,
      1,
    );
  }
});

test('reports malformed remote index and sitemap bodies independently', async () => {
  const records = [sourceRecord(1, '1-shared'), sourceRecord(2, '2-shared')];
  const fixture = createRemoteFixture(records, {
    overrides: new Map([
      ['/ai-faqs.en.json', { body: '{broken' }],
      ['/ai-quick-reference/sitemap.xml', { body: '<broken>' }],
    ]),
  });
  const report = await inspectRemoteFAQTarget({
    target: 'https://example.test',
    mode: 'remote',
    checkedAt: '2026-08-04T00:00:00.000Z',
    expectedCount: records.length,
    loadSource: async () => records,
    fetchImpl: fixture.fetchImpl,
    createTimeoutSignal: (timeoutMs) => ({ timeoutMs }),
  });

  assert.ok(
    report.findings.some(({ category }) => category === 'invalid-index-data'),
  );
  assert.ok(
    report.findings.some(({ category }) => category === 'invalid-sitemap-data'),
  );
});

test('requires every remote inventory to match the configured acceptance count', async () => {
  const records = [sourceRecord(1, '1-shared'), sourceRecord(2, '2-shared')];
  const fixture = createRemoteFixture(records);
  const report = await inspectRemoteFAQTarget({
    target: 'https://example.test',
    mode: 'remote',
    checkedAt: '2026-08-04T00:00:00.000Z',
    expectedCount: 3,
    loadSource: async () => records,
    fetchImpl: fixture.fetchImpl,
    createTimeoutSignal: (timeoutMs) => ({ timeoutMs }),
  });

  assert.equal(
    report.findings.filter(
      ({ category }) => category === 'inventory-count-mismatches',
    ).length,
    4,
  );
});

test('runs a complete remote acceptance report with 404 and 410 invalid routes', async () => {
  const records = [
    sourceRecord(1, '1-shared'),
    sourceRecord(2, '2-shared'),
    sourceRecord(3, '3-third'),
  ];
  const fixture = createRemoteFixture(records, {
    overrides: new Map([['/ai-quick-reference/shared', { status: 410 }]]),
  });
  const stdout = createStreamCapture();
  const stderr = createStreamCapture();
  const run = () =>
    runVerifyFAQRoutes({
      args: ['https://example.test/'],
      inspectTarget: (options) =>
        inspectRemoteFAQTarget({
          ...options,
          expectedCount: records.length,
          loadSource: async () => records,
          fetchImpl: fixture.fetchImpl,
          createTimeoutSignal: (timeoutMs) => ({ timeoutMs }),
        }),
      now: () => new Date('2026-08-04T00:00:00.000Z'),
      stdout: stdout.stream,
      stderr: stderr.stream,
    });

  assert.equal(await run(), 0);
  assert.equal(stderr.read(), '');
  assert.match(stdout.read(), /Target: "https:\/\/example\.test"/);
  assert.match(
    stdout.read(),
    /Limits: local batch=32 remote workers=8 timeout=10000ms retries=0/,
  );
  assert.match(stdout.read(), /source: total=3 unique=3 duplicates=0/);
  assert.match(stdout.read(), /route: total=3 unique=3 duplicates=0/);
  assert.match(stdout.read(), /HTTP statuses: 200=3 404=1 410=1/);
  assert.match(stdout.read(), /Identity fields checked: 12/);
  assert.match(stdout.read(), /Invalid routes: attempted=2 accepted=2/);
  assert.match(stdout.read(), /Result: PASS/);

  assert.equal(await run(), 0);
  assert.equal(fixture.calls.length, 14);
  for (const record of records) {
    assert.equal(
      fixture.calls.filter(
        ({ pathname }) => pathname === `/ai-quick-reference/${record.slug}`,
      ).length,
      2,
    );
  }
});

test('reports count-valid stale remote index membership, fields, and dead routes together', async () => {
  const records = [
    sourceRecord(1, '1-shared'),
    sourceRecord(2, '2-shared'),
    sourceRecord(3, '3-third'),
  ];
  const stale = indexRecord(records[0]);
  stale.slug = '1-stale';
  stale.description = 'Stale description';
  const fixture = createRemoteFixture(records, {
    indexRecords: [stale, indexRecord(records[1]), indexRecord(records[2])],
  });
  const report = await inspectRemoteFAQTarget({
    target: 'https://example.test',
    mode: 'remote',
    checkedAt: '2026-08-04T00:00:00.000Z',
    expectedCount: records.length,
    loadSource: async () => records,
    fetchImpl: fixture.fetchImpl,
    createTimeoutSignal: (timeoutMs) => ({ timeoutMs }),
  });
  const categories = new Set(report.findings.map(({ category }) => category));

  for (const category of [
    'source-only-index-slugs',
    'index-only-source-slugs',
    'source-only-route-slugs',
    'index-slug-mismatches',
    'index-description-mismatches',
    'route-status-failures',
  ]) {
    assert.ok(categories.has(category), category);
  }
  assert.equal(report.inventories.source.total, 3);
  assert.equal(report.inventories.index.total, 3);
  assert.equal(report.inventories.sitemap.total, 3);
  assert.equal(report.inventories.route.total, 2);
  assert.deepEqual(report.statusHistogram, { 200: 2, 404: 3 });
  assert.match(formatFAQRouteReport(report), /Result: FAIL/);
});
