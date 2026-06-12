import test from 'node:test';
import assert from 'node:assert/strict';

import traceCloseout from './check-browser-trace-closeout.js';

const {
  TRACE_GATE,
  DEFAULT_ROUTE_FIXTURES,
  DEFAULT_EXTERNAL_CONTROLS,
  collectEnvironmentContext,
  createRouteFixtures,
  classifyTraceRequest,
  loadOptionalBrowserAdapter,
  runBrowserTraceCloseout,
  validatePackageScripts,
} = traceCloseout;

test('closed browser trace gate exits 0 with route and control caveats', async () => {
  let adapterLoaded = false;

  const result = await runBrowserTraceCloseout({
    env: {},
    context: {
      node: 'v20.11.1',
      npm: '10.9.0',
      nvmrc: '20',
      lockfileVersion: 3,
      nodeMajorMatchesNvmrc: true,
      nodeModules: true,
      sourceGenerated: true,
      staticExportOutput: true,
      packageLock: true,
      adapterAvailable: false,
    },
    loadAdapter: async () => {
      adapterLoaded = true;
      throw new Error('adapter should stay closed');
    },
  });

  assert.equal(result.exitCode, 0);
  assert.equal(result.status, 'SKIPPED_WITH_CAVEAT');
  assert.equal(adapterLoaded, false);
  assert.equal(result.routes.length, DEFAULT_ROUTE_FIXTURES.length);
  assert.equal(result.controls.length, DEFAULT_EXTERNAL_CONTROLS.length);
  assert.match(result.caveats.join('\n'), /PHASE9_RUN_BROWSER_TRACE is closed/);
});

test('open browser trace gate reports every missing prerequisite as BLOCKED', async () => {
  const result = await runBrowserTraceCloseout({
    env: { [TRACE_GATE]: '1' },
    argv: [],
    context: {
      node: 'v24.13.0',
      npm: '11.6.2',
      nvmrc: '20',
      lockfileVersion: 3,
      nodeMajorMatchesNvmrc: false,
      nodeModules: false,
      sourceGenerated: false,
      staticExportOutput: false,
      packageLock: false,
      adapterAvailable: false,
    },
    loadAdapter: async () => ({ adapter: null, caveat: 'optional browser adapter is absent' }),
  });

  const caveats = result.caveats.join('\n');

  assert.equal(result.exitCode, 1);
  assert.equal(result.status, 'BLOCKED');
  assert.match(caveats, /requires Node 20/);
  assert.match(caveats, /node_modules is absent/);
  assert.match(caveats, /\.source is absent/);
  assert.match(caveats, /out is absent/);
  assert.match(caveats, /package-lock\.json is absent/);
  assert.match(caveats, /local base URL is required/);
  assert.match(caveats, /optional browser adapter is absent/);
});

test('route fixtures cover the required Phase 13 public route families', () => {
  const paths = createRouteFixtures().map((fixture) => fixture.path);

  assert.deepEqual(paths, [
    '/en',
    '/en/docs',
    '/en/docs/guides/app-deploy/first-deploy',
    '/en/products/app-store',
    '/en/products/app-store/n8n',
    '/api/og',
    '/api/blog/en/how-to-deploy-and-configure-flarum-using-docker/thumbnail/384x256.svg',
    '/api/blog/en/what-is-sealos/thumbnail/1200x630@3x.png',
  ]);
});

test('external controls allow local requests and fail unexpected external traffic', async () => {
  const baseUrl = 'http://127.0.0.1:3000';

  assert.equal(
    classifyTraceRequest(`${baseUrl}/en`, { baseUrl }).action,
    'allow',
  );
  assert.equal(
    classifyTraceRequest('http://localhost:3000/_next/static/app.js', {
      baseUrl,
    }).action,
    'allow',
  );
  assert.equal(
    classifyTraceRequest('https://www.googletagmanager.com/gtm.js', {
      baseUrl,
    }).action,
    'block',
  );
  assert.equal(
    classifyTraceRequest('https://auth.sealos.io/api/auth/verifySharedToken', {
      baseUrl,
    }).action,
    'stub',
  );
  assert.equal(
    classifyTraceRequest('https://api.github.com/repos/labring/sealos', {
      baseUrl,
    }).action,
    'block',
  );
  assert.equal(
    classifyTraceRequest('https://sealos.io/en', { baseUrl }).action,
    'block',
  );
  assert.equal(
    classifyTraceRequest('https://example.com/unexpected.js', { baseUrl })
      .action,
    'unexpected',
  );

  const result = await runBrowserTraceCloseout({
    env: { [TRACE_GATE]: '1' },
    argv: ['--base-url=http://127.0.0.1:3000'],
    context: {
      node: 'v20.11.1',
      npm: '10.9.0',
      nvmrc: '20',
      lockfileVersion: 3,
      nodeMajorMatchesNvmrc: true,
      nodeModules: true,
      sourceGenerated: true,
      staticExportOutput: true,
      packageLock: true,
      adapterAvailable: true,
    },
    loadAdapter: async () => ({
      adapter: async () => ({
        results: [
          {
            route: '/en',
            status: 'PASS',
            requests: ['https://example.com/unexpected.js'],
          },
        ],
      }),
      caveat: null,
    }),
  });

  assert.equal(result.status, 'FAIL');
  assert.equal(result.exitCode, 1);
  assert.match(result.caveats.join('\n'), /unexpected external request/);
});

test('package scripts expose the exact browser trace closeout commands', () => {
  const packageJson = {
    scripts: {
      'browser-trace:check': 'node scripts/check-browser-trace-closeout.js',
      'browser-trace:run': 'node scripts/check-browser-trace-closeout.js',
    },
  };

  assert.deepEqual(validatePackageScripts(packageJson), {
    status: 'PASS',
    failures: [],
  });
});

test('environment context and optional adapter helpers are injectable', async () => {
  const context = collectEnvironmentContext({
    execFile: () => '10.9.0\n',
    exists: (filePath) =>
      !String(filePath).endsWith('node_modules') &&
      !String(filePath).endsWith('out'),
    nodeVersion: 'v20.11.1',
    cwd: process.cwd(),
  });

  assert.equal(context.node, 'v20.11.1');
  assert.equal(context.npm, '10.9.0');
  assert.equal(context.nodeMajorMatchesNvmrc, true);
  assert.equal(context.nodeModules, false);
  assert.equal(context.staticExportOutput, false);
  assert.equal(typeof context.sourceGenerated, 'boolean');

  const adapterResult = await loadOptionalBrowserAdapter({
    env: {},
    requireModule: () => {
      throw new Error('missing');
    },
  });

  assert.equal(adapterResult.adapter, null);
  assert.match(adapterResult.caveat, /optional browser adapter is absent/);
});
