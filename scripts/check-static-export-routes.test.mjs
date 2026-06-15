import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  measureArtifactBudget,
  parseLlmsSourceFiles,
  parseRobotsSitemaps,
  parseRssItems,
  parseSearchRecords,
  parseXmlLocs,
  validateNativeRouteOwnership,
  validateRoutePolicy,
  validateStaticExportRoutes,
} from './check-static-export-routes.js';

const REQUIRED_SOURCES = [
  'app/sitemap.ts',
  'app/sitemap-ai-faq.ts',
  'app/rss.xml/route.ts',
  'app/sitemap-index.xml/route.ts',
  'app/llms.txt/route.ts',
  'app/api/search/route.ts',
  'app/api/robots/route.ts',
  'app/api/apps/[[...lang]]/route.ts',
  'app/api/og/route.ts',
  'app/api/blog/[lang]/[slug]/thumbnail/[format]/route.ts',
  'app/api/abuse/verify-turnstile/route.ts',
];

const ALLOWED_LABELS = [
  'static artifact',
  'static artifact via route handler',
  'documented deployment-supported route',
  'runtime native route',
  'external-service-backed route',
  'API-like runtime route with fallback',
];

test('parser helpers read XML, RSS, robots, llms, and search records', () => {
  assert.deepEqual(
    parseXmlLocs(
      '<urlset><url><loc>https://sealos.io/a</loc></url><url><loc>https://sealos.io/b</loc></url></urlset>',
    ),
    ['https://sealos.io/a', 'https://sealos.io/b'],
  );
  assert.deepEqual(parseRssItems('<rss><channel><item><title>A</title></item></channel></rss>'), [
    '<item><title>A</title></item>',
  ]);
  assert.deepEqual(
    parseRobotsSitemaps('User-agent: *\nSitemap: https://sealos.io/sitemap.xml'),
    ['https://sealos.io/sitemap.xml'],
  );
  assert.deepEqual(parseLlmsSourceFiles('file: a.mdx\nbody\nfile: b.mdx'), [
    'a.mdx',
    'b.mdx',
  ]);
  assert.equal(parseSearchRecords('[{"id":"a"},{"id":"b"}]').length, 2);
  assert.equal(parseSearchRecords('{"data":[{"id":"a"}]}').length, 1);
  assert.equal(
    parseSearchRecords(
      JSON.stringify({
        type: 'advanced',
        docs: {
          docs: {
            1: { id: 'a' },
            2: { id: 'b' },
          },
        },
      }),
    ).length,
    2,
  );
});

test('validateRoutePolicy accepts the repository policy contract', () => {
  const result = validateRoutePolicy();

  assert.equal(result.status, 'PASS');
  assert.deepEqual(result.failures, []);
  assert.equal(result.rows.length, REQUIRED_SOURCES.length);
  for (const source of REQUIRED_SOURCES) {
    assert.ok(result.rows.some((row) => row.sourceFile === source));
  }
  for (const label of ALLOWED_LABELS) {
    assert.ok(result.rows.some((row) => row.classification === label));
  }
  assert.ok(
    result.rows.every((row) =>
      row.traceIds.some((traceId) => traceId.startsWith('ROUTEFIX-')),
    ),
  );
  assert.ok(
    result.rows.some((row) => row.traceIds.includes('static-export-route-classification')),
  );
  assert.ok(
    result.policy.validationGates.phase9Composition.traceIds.includes(
      'ROUTEFIX-04',
    ),
  );
});

test('search route keeps the static index metadata-oriented', async () => {
  const source = await readFile('app/api/search/route.ts', 'utf8');

  assert.match(source, /metadataOnlyStructuredData/);
  assert.match(source, /headings:\s*\[\]/);
  assert.match(source, /contents:\s*\[\]/);
  assert.doesNotMatch(source, /structuredData:\s*page\.data\.structuredData/);
});

test('native route ownership matches native rendering image surfaces', () => {
  const result = validateNativeRouteOwnership();

  assert.equal(result.status, 'PASS');
  assert.deepEqual(result.failures, []);
  assert.equal(result.nativeSurfaces.length, 4);
  assert.equal(result.nativeRoutes.length, 2);
  for (const route of ['/api/og', '/api/blog/:lang/:slug/thumbnail/:format']) {
    assert.ok(result.nativeRoutes.some((row) => row.routePath === route));
  }
});

test('validateRoutePolicy fails closed for row, label, field, and source drift', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'phase10-policy-'));

  try {
    await copyPolicyFixture(dir);
    const policyPath = join(dir, 'config/static-export-route-policy.json');
    const policy = JSON.parse(await readFile(policyPath, 'utf8'));

    policy.routes = policy.routes.slice(1);
    await writeFile(policyPath, JSON.stringify(policy, null, 2));
    assert.match(
      validateRoutePolicy({ rootDir: dir }).failures.join('\n'),
      /missing required route source app\/sitemap\.ts/,
    );

    await copyPolicyFixture(dir);
    const labelPolicy = JSON.parse(await readFile(policyPath, 'utf8'));
    labelPolicy.routes[0].classification = 'dynamic maybe';
    await writeFile(policyPath, JSON.stringify(labelPolicy, null, 2));
    assert.match(
      validateRoutePolicy({ rootDir: dir }).failures.join('\n'),
      /invalid classification/,
    );

    await copyPolicyFixture(dir);
    const emptyPolicy = JSON.parse(await readFile(policyPath, 'utf8'));
    emptyPolicy.routes[0].validationCommand = '';
    await writeFile(policyPath, JSON.stringify(emptyPolicy, null, 2));
    assert.match(
      validateRoutePolicy({ rootDir: dir }).failures.join('\n'),
      /missing required field validationCommand/,
    );

    await copyPolicyFixture(dir);
    const sourcePolicy = JSON.parse(await readFile(policyPath, 'utf8'));
    sourcePolicy.routes[0].sourceFile = 'app/missing.ts';
    sourcePolicy.requiredSourceFiles[0] = 'app/missing.ts';
    await writeFile(policyPath, JSON.stringify(sourcePolicy, null, 2));
    assert.match(
      validateRoutePolicy({ rootDir: dir }).failures.join('\n'),
      /source file is missing/,
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('validateRoutePolicy fails closed when ROUTEFIX-04 validation gate trace drifts', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'phase10-trace-'));

  try {
    await copyPolicyFixture(dir);
    const policyPath = join(dir, 'config/static-export-route-policy.json');
    const policy = JSON.parse(await readFile(policyPath, 'utf8'));

    policy.validationGates.phase9Composition.traceIds = [];
    await writeFile(policyPath, JSON.stringify(policy, null, 2));

    assert.match(
      validateRoutePolicy({ rootDir: dir }).failures.join('\n'),
      /validationGates\.phase9Composition\.traceIds missing ROUTEFIX-04/,
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('validateStaticExportRoutes skips out with caveat when locked build is closed', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'phase10-no-out-'));

  try {
    await copyPolicyFixture(dir);
    await copyNativePolicyFixture(dir);
    const result = validateStaticExportRoutes({ rootDir: dir, env: {} });

    assert.equal(result.out.status, 'SKIPPED_WITH_CAVEAT');
    assert.equal(result.nativeRouteOwnership.status, 'PASS');
    assert.deepEqual(result.failures, []);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('validateStaticExportRoutes fails when locked build is open and out is absent', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'phase10-locked-no-out-'));

  try {
    await copyPolicyFixture(dir);
    await copyNativePolicyFixture(dir);
    const result = validateStaticExportRoutes({
      rootDir: dir,
      env: { PHASE9_RUN_LOCKED_BUILD: '1' },
    });

    assert.equal(result.status, 'FAIL');
    assert.match(result.failures.join('\n'), /out is absent/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('fixture out artifacts pass route policy artifact budgets', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'phase10-out-pass-'));

  try {
    await copyPolicyFixture(dir);
    await copyNativePolicyFixture(dir);
    await writePassingOutFixture(dir);
    const result = validateStaticExportRoutes({ rootDir: dir, env: {} });

    assert.equal(result.status, 'PASS');
    assert.deepEqual(result.failures, []);
    assert.equal(result.out.status, 'PASS');
    assert.ok(result.budgets.some((item) => item.budgetOwner === 'main-sitemap'));
    const searchBudget = result.budgets.find(
      (item) => item.budgetOwner === 'search-index',
    );
    assert.equal(searchBudget.count, 2);
    assert.equal(searchBudget.artifactPath, 'out/api/search');
    assert.ok(result.artifacts.some((item) => item.kind === 'sitemap-index'));
    assert.ok(result.artifacts.some((item) => item.kind === 'robots'));
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('fixture out artifacts fail closed when budgets are exceeded', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'phase10-out-fail-'));

  try {
    await copyPolicyFixture(dir);
    await copyNativePolicyFixture(dir);
    await writePassingOutFixture(dir);

    let result = await withBudgetLimit(dir, 'main-sitemap', { maxCount: 1 });
    assert.match(result.failures.join('\n'), /main-sitemap count exceeds budget/);

    result = await withBudgetLimit(dir, 'main-sitemap', { maxBytes: 10 });
    assert.match(result.failures.join('\n'), /main-sitemap bytes exceed budget/);

    result = await withBudgetLimit(dir, 'search-index', { maxCount: 1 });
    assert.match(result.failures.join('\n'), /search-index count exceeds budget/);

    result = await withBudgetLimit(dir, 'search-index', { maxBytes: 10 });
    assert.match(result.failures.join('\n'), /search-index bytes exceed budget/);

    result = await withBudgetLimit(dir, 'llms', { maxCount: 1 });
    assert.match(result.failures.join('\n'), /llms count exceeds budget/);

    result = await withBudgetLimit(dir, 'llms', { maxBytes: 10 });
    assert.match(result.failures.join('\n'), /llms bytes exceed budget/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('measureArtifactBudget reports measured bytes and counts', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'phase10-measure-'));

  try {
    const filePath = join(dir, 'sitemap.xml');
    await writeFile(
      filePath,
      '<urlset><url><loc>https://sealos.io/a</loc></url></urlset>',
    );

    const result = measureArtifactBudget({
      artifactPath: filePath,
      budgetOwner: 'main-sitemap',
      budget: { maxCount: 5, maxBytes: 1000 },
      count: (text) => parseXmlLocs(text).length,
    });

    assert.equal(result.status, 'PASS');
    assert.equal(result.count, 1);
    assert.equal(result.countLimit, 5);
    assert.equal(result.byteLimit, 1000);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('hosted route probes stay gated and require explicit preview URL', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'phase10-hosted-'));

  try {
    await copyPolicyFixture(dir);
    await copyNativePolicyFixture(dir);
    let result = validateStaticExportRoutes({ rootDir: dir, env: {} });
    assert.equal(result.hosted.status, 'SKIPPED_WITH_CAVEAT');

    result = validateStaticExportRoutes({
      rootDir: dir,
      env: { PHASE9_RUN_HOSTED_PROBES: '1' },
    });
    assert.equal(result.hosted.status, 'BLOCKED');
    assert.match(result.failures.join('\n'), /PHASE10_HOSTED_BASE_URL/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

async function withBudgetLimit(dir, owner, patch) {
  const policyPath = join(dir, 'config/static-export-route-policy.json');
  const policy = JSON.parse(await readFile(policyPath, 'utf8'));
  policy.budgets[owner] = {
    ...policy.budgets[owner],
    ...patch,
  };
  await writeFile(policyPath, JSON.stringify(policy, null, 2));
  const result = validateStaticExportRoutes({ rootDir: dir, env: {} });
  await copyPolicyFixture(dir);
  await writePassingOutFixture(dir);
  return result;
}

async function copyPolicyFixture(dir) {
  await mkdir(join(dir, 'config'), { recursive: true });
  await mkdir(join(dir, 'public'), { recursive: true });
  await mkdir(join(dir, 'app/api/apps/[[...lang]]'), { recursive: true });
  await mkdir(
    join(dir, 'app/api/blog/[lang]/[slug]/thumbnail/[format]'),
    { recursive: true },
  );
  for (const source of REQUIRED_SOURCES) {
    await mkdir(join(dir, source, '..'), { recursive: true });
    await writeFile(join(dir, source), 'export const revalidate = false;\n');
  }
  const policy = JSON.parse(
    await readFile('config/static-export-route-policy.json', 'utf8'),
  );
  await writeFile(
    join(dir, 'config/static-export-route-policy.json'),
    JSON.stringify(policy, null, 2),
  );
  await writeFile(
    join(dir, 'public/_redirects'),
    '/robots.txt /api/robots 200\n',
  );
  await writeFile(
    join(dir, 'public/robots.txt'),
    'User-agent: *\nSitemap: https://sealos.io/sitemap.xml\nSitemap: https://sealos.io/ai-quick-reference/sitemap.xml\n',
  );
}

async function copyNativePolicyFixture(dir) {
  const policy = JSON.parse(
    await readFile('config/native-rendering-policy.json', 'utf8'),
  );
  await writeFile(
    join(dir, 'config/native-rendering-policy.json'),
    JSON.stringify(policy, null, 2),
  );
}

async function writePassingOutFixture(dir) {
  await mkdir(join(dir, 'out/ai-quick-reference'), { recursive: true });
  await mkdir(join(dir, 'out/api'), { recursive: true });
  await writeFile(
    join(dir, 'out/sitemap.xml'),
    [
      '<urlset>',
      '<url><loc>https://sealos.io/</loc></url>',
      '<url><loc>https://sealos.io/docs/</loc></url>',
      '</urlset>',
    ].join(''),
  );
  await writeFile(
    join(dir, 'out/ai-quick-reference/sitemap.xml'),
    '<urlset><url><loc>https://sealos.io/ai-quick-reference/a/</loc></url></urlset>',
  );
  await writeFile(
    join(dir, 'out/rss.xml'),
    '<rss><channel><item><title>A</title></item></channel></rss>',
  );
  await writeFile(
    join(dir, 'out/sitemap-index.xml'),
    '<sitemapindex><sitemap><loc>https://sealos.io/sitemap.xml</loc></sitemap><sitemap><loc>https://sealos.io/ai-quick-reference/sitemap.xml</loc></sitemap></sitemapindex>',
  );
  await writeFile(
    join(dir, 'out/llms.txt'),
    'file: content/docs/a.en.mdx\nA\n\nfile: content/docs/b.en.mdx\nB\n',
  );
  await writeFile(
    join(dir, 'out/api/search'),
    JSON.stringify({
      type: 'advanced',
      docs: {
        docs: {
          1: { id: 'a', type: 'page', content: 'A', url: '/a' },
          2: { id: 'b', type: 'page', content: 'B', url: '/b' },
        },
      },
    }),
  );
  await writeFile(
    join(dir, 'out/robots.txt'),
    'User-agent: *\nSitemap: https://sealos.io/sitemap.xml\n',
  );
}
