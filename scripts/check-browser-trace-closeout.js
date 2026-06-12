#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const TRACE_GATE = 'PHASE9_RUN_BROWSER_TRACE';
const BASE_URL_ENV = 'PHASE9_BROWSER_TRACE_BASE_URL';
const ADAPTER_ENV = 'PHASE9_BROWSER_TRACE_ADAPTER';
const ARTIFACT_DIR =
  '.planning/phases/13-validation-closeout-and-audit-status/browser-traces';

const DEFAULT_ROUTE_FIXTURES = [
  {
    family: 'public-landing',
    path: '/en',
    requirement: 'VALIDATE-02',
    perfIds: ['PERF-601', 'PERF-602', 'PERF-603', 'PERF-604'],
  },
  {
    family: 'docs-content',
    path: '/en/docs',
    requirement: 'VALIDATE-02',
    perfIds: ['PERF-601', 'PERF-602', 'PERF-603'],
  },
  {
    family: 'docs-content',
    path: '/en/docs/guides/app-deploy/first-deploy',
    requirement: 'VALIDATE-02',
    perfIds: ['PERF-601', 'PERF-602', 'PERF-603'],
  },
  {
    family: 'app-store-template',
    path: '/en/products/app-store',
    requirement: 'VALIDATE-02',
    perfIds: ['PERF-601', 'PERF-602', 'PERF-603'],
  },
  {
    family: 'app-store-template',
    path: '/en/products/app-store/n8n',
    requirement: 'VALIDATE-02',
    perfIds: ['PERF-601', 'PERF-602', 'PERF-603'],
  },
  {
    family: 'native-image-adjacent',
    path: '/api/og',
    requirement: 'VALIDATE-02',
    perfIds: ['PERF-501', 'PERF-601'],
  },
  {
    family: 'native-image-adjacent',
    path: '/api/blog/en/how-to-deploy-and-configure-flarum-using-docker/thumbnail/384x256.svg',
    requirement: 'VALIDATE-02',
    perfIds: ['PERF-501', 'PERF-502', 'PERF-601'],
  },
  {
    family: 'native-image-adjacent',
    path: '/api/blog/en/what-is-sealos/thumbnail/1200x630@3x.png',
    requirement: 'VALIDATE-02',
    perfIds: ['PERF-501', 'PERF-502', 'PERF-601'],
  },
];

const DEFAULT_EXTERNAL_CONTROLS = [
  {
    key: 'analytics',
    action: 'block',
    patterns: [
      'googletagmanager.com',
      'google-analytics.com',
      'clarity.ms',
      'hm.baidu.com',
      'engage.sealos.in',
      'analytics.sealos.in',
      'rybbit',
    ],
  },
  {
    key: 'auth',
    action: 'stub',
    patterns: [
      'auth.sealos.io',
      '/api/auth/verifySharedToken',
      '/api/auth',
      '/api/email',
    ],
  },
  {
    key: 'turnstile',
    action: 'stub',
    patterns: ['challenges.cloudflare.com', 'turnstile'],
  },
  {
    key: 'template-api',
    action: 'block',
    patterns: ['template', 'getTemplateSource', 'template-api'],
  },
  {
    key: 'github-readme',
    action: 'block',
    patterns: [
      'github.com',
      'api.github.com',
      'raw.githubusercontent.com',
      'raw.github.com',
    ],
  },
  {
    key: 'hosted-preview',
    action: 'block',
    patterns: ['vercel.app', 'pages.dev', 'preview'],
  },
  {
    key: 'production',
    action: 'block',
    patterns: ['sealos.io', 'www.sealos.io'],
  },
  {
    key: 'deploy',
    action: 'block',
    patterns: ['cloud.sealos.io', 'deploy', 'kubernetes', 'labring'],
  },
];

function readJsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readTextIfExists(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  return fs.readFileSync(filePath, 'utf8');
}

function collectEnvironmentContext({
  execFile = execFileSync,
  cwd = process.cwd(),
  exists = fs.existsSync,
  nodeVersion = process.version,
} = {}) {
  const nvmrcPath = path.join(cwd, '.nvmrc');
  const packageLockPath = path.join(cwd, 'package-lock.json');
  const lock = readJsonIfExists(packageLockPath);
  const nvmrc = exists(nvmrcPath) ? readTextIfExists(nvmrcPath).trim() : null;
  let npm = null;

  try {
    npm = execFile('npm', ['--version'], {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    npm = null;
  }

  const activeMajor = String(nodeVersion).match(/^v?(\d+)/)?.[1] || null;
  const expectedMajor = nvmrc ? nvmrc.replace(/^v/, '').split('.')[0] : null;

  return {
    node: nodeVersion,
    npm,
    nvmrc,
    lockfileVersion: lock?.lockfileVersion || null,
    nodeMajorMatchesNvmrc:
      expectedMajor === null || activeMajor === null
        ? null
        : activeMajor === expectedMajor,
    nodeModules: exists(path.join(cwd, 'node_modules')),
    sourceGenerated: exists(path.join(cwd, '.source')),
    staticExportOutput: exists(path.join(cwd, 'out')),
    packageLock: exists(packageLockPath),
    adapterAvailable: null,
  };
}

function createRouteFixtures() {
  return DEFAULT_ROUTE_FIXTURES.map((fixture) => ({ ...fixture }));
}

function isLocalHostname(hostname) {
  return hostname === 'localhost' || hostname === '127.0.0.1';
}

function resolveBaseUrl({ argv = process.argv.slice(2), env = process.env } = {}) {
  const arg = argv.find((item) => item.startsWith('--base-url='));
  const rawValue = arg ? arg.slice('--base-url='.length) : env[BASE_URL_ENV];

  if (!rawValue) {
    return {
      baseUrl: null,
      caveat: `local base URL is required via --base-url=... or ${BASE_URL_ENV}`,
    };
  }

  let parsed;
  try {
    parsed = new URL(rawValue);
  } catch {
    return {
      baseUrl: null,
      caveat: `local base URL is invalid: ${rawValue}`,
    };
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return {
      baseUrl: null,
      caveat: `local base URL must use http or https: ${rawValue}`,
    };
  }

  if (!isLocalHostname(parsed.hostname)) {
    return {
      baseUrl: null,
      caveat: `local base URL must use localhost or 127.0.0.1: ${rawValue}`,
    };
  }

  parsed.pathname = parsed.pathname.replace(/\/+$/, '');
  parsed.search = '';
  parsed.hash = '';

  return {
    baseUrl: parsed.toString().replace(/\/$/, ''),
    caveat: null,
  };
}

function urlMatchesControl(url, control) {
  const normalized = String(url).toLowerCase();
  return control.patterns.some((pattern) =>
    normalized.includes(String(pattern).toLowerCase()),
  );
}

function classifyTraceRequest(
  requestUrl,
  { baseUrl, controls = DEFAULT_EXTERNAL_CONTROLS } = {},
) {
  let parsed;
  try {
    parsed = new URL(requestUrl, baseUrl || 'http://127.0.0.1');
  } catch {
    return {
      action: 'unexpected',
      control: 'invalid-url',
      url: requestUrl,
      reason: 'request URL could not be parsed',
    };
  }

  const base = baseUrl ? new URL(baseUrl) : null;

  if (isLocalHostname(parsed.hostname)) {
    return {
      action: 'allow',
      control: 'local-origin',
      url: parsed.toString(),
      reason: 'local browser trace target',
    };
  }

  if (base && parsed.origin === base.origin) {
    return {
      action: 'allow',
      control: 'base-origin',
      url: parsed.toString(),
      reason: 'same origin as local browser trace target',
    };
  }

  const matched = controls.find((control) =>
    urlMatchesControl(parsed.toString(), control),
  );

  if (matched) {
    return {
      action: matched.action,
      control: matched.key,
      url: parsed.toString(),
      reason: `${matched.key} external control`,
    };
  }

  return {
    action: 'unexpected',
    control: 'unexpected-external',
    url: parsed.toString(),
    reason: 'external request is outside the Phase 13 local allowlist',
  };
}

function createPlaywrightAdapter(playwrightTest) {
  return async function runPlaywrightTrace({
    baseUrl,
    routes,
    controls,
    artifactDir,
  }) {
    const chromium = playwrightTest.chromium || playwrightTest.default?.chromium;

    if (!chromium?.launch) {
      throw new Error('Playwright chromium launcher is unavailable');
    }

    fs.mkdirSync(artifactDir, { recursive: true });

    const browser = await chromium.launch();
    const context = await browser.newContext({ baseURL: baseUrl });
    const results = [];

    try {
      await context.route('**/*', async (route) => {
        const decision = classifyTraceRequest(route.request().url(), {
          baseUrl,
          controls,
        });

        if (decision.action === 'allow') {
          await route.continue();
          return;
        }

        if (decision.action === 'stub') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: '{}',
          });
          return;
        }

        await route.abort('blockedbyclient');
      });

      for (const fixture of routes) {
        const page = await context.newPage();
        const requests = [];
        const failures = [];
        const startedAt = Date.now();

        page.on('request', (request) => {
          requests.push(request.url());
        });
        page.on('requestfailed', (request) => {
          failures.push({
            url: request.url(),
            failure: request.failure()?.errorText || 'request failed',
          });
        });

        const response = await page.goto(fixture.path, {
          waitUntil: 'networkidle',
          timeout: 30_000,
        });
        const endedAt = Date.now();

        results.push({
          ...fixture,
          url: new URL(fixture.path, baseUrl).toString(),
          httpStatus: response?.status() || null,
          requestCount: requests.length,
          requests,
          failedRequests: failures,
          durationMs: endedAt - startedAt,
          status: failures.length === 0 ? 'PASS' : 'FAIL',
          caveats: [],
        });

        await page.close();
      }
    } finally {
      await browser.close();
    }

    return { results };
  };
}

async function loadOptionalBrowserAdapter({
  env = process.env,
  cwd = process.cwd(),
  requireModule = require,
} = {}) {
  const candidates = env[ADAPTER_ENV]
    ? [env[ADAPTER_ENV]]
    : ['@playwright/test', 'playwright'];

  for (const candidate of candidates) {
    try {
      const loaded = requireModule(candidate);

      if (typeof loaded === 'function') {
        return {
          adapter: loaded,
          source: candidate,
          caveat: null,
        };
      }

      if (typeof loaded?.runBrowserTraceCloseout === 'function') {
        return {
          adapter: loaded.runBrowserTraceCloseout,
          source: candidate,
          caveat: null,
        };
      }

      if (loaded?.chromium || loaded?.default?.chromium) {
        return {
          adapter: createPlaywrightAdapter(loaded),
          source: candidate,
          caveat: null,
        };
      }

      return {
        adapter: null,
        source: candidate,
        caveat: `optional browser adapter ${candidate} does not export a supported runner`,
      };
    } catch (error) {
      if (env[ADAPTER_ENV]) {
        return {
          adapter: null,
          source: env[ADAPTER_ENV],
          caveat: `optional browser adapter ${env[ADAPTER_ENV]} could not be loaded from ${cwd}: ${error.message}`,
        };
      }
    }
  }

  return {
    adapter: null,
    source: null,
    caveat:
      'optional browser adapter is absent; install or expose an approved adapter only in an open-gate validation environment',
  };
}

function getOpenGateBlockers({ context, baseUrlResult, adapterResult }) {
  const blockers = [];

  if (context.nvmrc && context.nodeMajorMatchesNvmrc === false) {
    blockers.push(
      `active Node ${context.node} differs from .nvmrc ${context.nvmrc}; accepted browser trace requires Node 20`,
    );
  }
  if (!context.nodeModules) {
    blockers.push('node_modules is absent');
  }
  if (!context.sourceGenerated) {
    blockers.push('.source is absent');
  }
  if (!context.staticExportOutput) {
    blockers.push('out is absent');
  }
  if (!context.packageLock) {
    blockers.push('package-lock.json is absent');
  }
  if (baseUrlResult.caveat) {
    blockers.push(baseUrlResult.caveat);
  }
  if (!adapterResult.adapter) {
    blockers.push(adapterResult.caveat);
  }

  return blockers;
}

function normalizeAdapterResult(adapterOutput) {
  if (Array.isArray(adapterOutput)) {
    return { results: adapterOutput };
  }

  return {
    results: adapterOutput?.results || [],
    artifacts: adapterOutput?.artifacts || [],
    caveats: adapterOutput?.caveats || [],
  };
}

function collectUnexpectedRequests({ results, baseUrl, controls }) {
  const unexpected = [];

  for (const result of results) {
    for (const requestUrl of result.requests || []) {
      const decision = classifyTraceRequest(requestUrl, { baseUrl, controls });
      if (decision.action === 'unexpected') {
        unexpected.push({
          route: result.path || result.route,
          url: decision.url,
          reason: decision.reason,
        });
      }
    }
  }

  return unexpected;
}

function createSkippedRows(routes) {
  return routes.map((route) => ({
    ...route,
    status: 'SKIPPED_WITH_CAVEAT',
    requestCount: 0,
    durationMs: 0,
    bytes: 0,
    caveats: [
      `${TRACE_GATE} is closed; browser trace adapter loading and navigation are skipped by default.`,
    ],
  }));
}

async function runBrowserTraceCloseout({
  env = process.env,
  argv = process.argv.slice(2),
  context = collectEnvironmentContext(),
  routes = createRouteFixtures(),
  controls = DEFAULT_EXTERNAL_CONTROLS,
  artifactDir = ARTIFACT_DIR,
  loadAdapter = loadOptionalBrowserAdapter,
} = {}) {
  if (env[TRACE_GATE] !== '1') {
    return {
      status: 'SKIPPED_WITH_CAVEAT',
      exitCode: 0,
      context,
      routes,
      controls,
      results: createSkippedRows(routes),
      caveats: [
        `${TRACE_GATE} is closed; browser trace adapter loading and navigation are skipped by default.`,
      ],
    };
  }

  const baseUrlResult = resolveBaseUrl({ argv, env });
  const adapterResult = await loadAdapter({ env });
  const openContext = {
    ...context,
    adapterAvailable: Boolean(adapterResult.adapter),
    adapterSource: adapterResult.source || null,
  };
  const blockers = getOpenGateBlockers({
    context: openContext,
    baseUrlResult,
    adapterResult,
  });

  if (blockers.length > 0) {
    return {
      status: 'BLOCKED',
      exitCode: 1,
      context: openContext,
      routes,
      controls,
      results: [],
      caveats: blockers,
    };
  }

  let adapterOutput;
  try {
    adapterOutput = await adapterResult.adapter({
      baseUrl: baseUrlResult.baseUrl,
      routes,
      controls,
      artifactDir,
      classifyTraceRequest,
    });
  } catch (error) {
    return {
      status: 'FAIL',
      exitCode: 1,
      context: openContext,
      routes,
      controls,
      results: [],
      caveats: [`browser trace adapter failed: ${error.message}`],
    };
  }

  const normalized = normalizeAdapterResult(adapterOutput);
  const unexpectedRequests = collectUnexpectedRequests({
    results: normalized.results,
    baseUrl: baseUrlResult.baseUrl,
    controls,
  });
  const failedRows = normalized.results.filter((row) => row.status === 'FAIL');
  const caveats = [...(normalized.caveats || [])];

  for (const request of unexpectedRequests) {
    caveats.push(
      `unexpected external request on ${request.route}: ${request.url}`,
    );
  }

  if (failedRows.length > 0) {
    caveats.push(`${failedRows.length} browser trace route row(s) failed`);
  }

  const status =
    unexpectedRequests.length > 0 || failedRows.length > 0 ? 'FAIL' : 'PASS';

  return {
    status,
    exitCode: status === 'PASS' ? 0 : 1,
    context: openContext,
    routes,
    controls,
    results: normalized.results,
    artifacts: normalized.artifacts,
    caveats,
    baseUrl: baseUrlResult.baseUrl,
  };
}

function printBrowserTraceCloseout(result, { write = console.log } = {}) {
  write(`[browser-trace] status: ${result.status}`);
  write(`[browser-trace] exitCode: ${result.exitCode}`);
  write(`[browser-trace] gate: ${TRACE_GATE}`);

  if (result.baseUrl) {
    write(`[browser-trace] baseUrl: ${result.baseUrl}`);
  }

  write(
    `[browser-trace] context: ${JSON.stringify({
      node: result.context.node,
      npm: result.context.npm,
      nvmrc: result.context.nvmrc,
      nodeMajorMatchesNvmrc: result.context.nodeMajorMatchesNvmrc,
      nodeModules: result.context.nodeModules,
      sourceGenerated: result.context.sourceGenerated,
      staticExportOutput: result.context.staticExportOutput,
      packageLock: result.context.packageLock,
      adapterAvailable: result.context.adapterAvailable,
      adapterSource: result.context.adapterSource,
    })}`,
  );

  for (const route of result.routes || []) {
    write(
      `[browser-trace] route: ${JSON.stringify({
        family: route.family,
        path: route.path,
        requirement: route.requirement,
        perfIds: route.perfIds,
      })}`,
    );
  }

  for (const control of result.controls || []) {
    write(
      `[browser-trace] external-control: ${JSON.stringify({
        key: control.key,
        action: control.action,
        patterns: control.patterns,
      })}`,
    );
  }

  for (const row of result.results || []) {
    write(
      `[browser-trace] result: ${JSON.stringify({
        family: row.family,
        path: row.path || row.route,
        status: row.status,
        requestCount: row.requestCount || row.requests?.length || 0,
        durationMs: row.durationMs || 0,
        bytes: row.bytes || 0,
      })}`,
    );
  }

  for (const caveat of result.caveats || []) {
    write(`[browser-trace] caveat: ${caveat}`);
  }

  for (const artifact of result.artifacts || []) {
    write(`[browser-trace] artifact: ${artifact}`);
  }
}

function validatePackageScripts(packageJson = readJsonIfExists('package.json')) {
  const expectedCommand = 'node scripts/check-browser-trace-closeout.js';
  const failures = [];

  if (packageJson?.scripts?.['browser-trace:check'] !== expectedCommand) {
    failures.push(`browser-trace:check must be "${expectedCommand}"`);
  }
  if (packageJson?.scripts?.['browser-trace:run'] !== expectedCommand) {
    failures.push(`browser-trace:run must be "${expectedCommand}"`);
  }

  return {
    status: failures.length > 0 ? 'FAIL' : 'PASS',
    failures,
  };
}

async function runCli() {
  try {
    const result = await runBrowserTraceCloseout();
    printBrowserTraceCloseout(result);
    process.exitCode = result.exitCode;
    return result;
  } catch (error) {
    console.error(`[browser-trace] failed: ${error.message}`);
    process.exitCode = 1;
    return {
      status: 'FAIL',
      exitCode: 1,
      caveats: [error.message],
    };
  }
}

if (require.main === module) {
  runCli();
}

module.exports = {
  TRACE_GATE,
  BASE_URL_ENV,
  ADAPTER_ENV,
  DEFAULT_ROUTE_FIXTURES,
  DEFAULT_EXTERNAL_CONTROLS,
  collectEnvironmentContext,
  createRouteFixtures,
  classifyTraceRequest,
  loadOptionalBrowserAdapter,
  runBrowserTraceCloseout,
  printBrowserTraceCloseout,
  validatePackageScripts,
  runCli,
};
