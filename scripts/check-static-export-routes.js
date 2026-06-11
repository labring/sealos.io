#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const POLICY_PATH = 'config/static-export-route-policy.json';
const NATIVE_POLICY_PATH = 'config/native-rendering-policy.json';
const REQUIRED_FIELDS = [
  'routePath',
  'sourceFile',
  'httpMethod',
  'contentType',
  'classification',
  'executionModel',
  'inputDataSource',
  'runtimeDependency',
  'externalDependency',
  'budgetOwner',
  'validationCommand',
  'traceIds',
];
const REQUIRED_TRACE_PREFIXES = ['ROUTEFIX-', 'PERF-'];
const REQUIRED_VALIDATION_GATE_TRACE_IDS = ['ROUTEFIX-04'];
const SEARCH_ARTIFACT_FALLBACKS = [
  'out/api/search.json',
  'out/api/search/index.json',
  'out/api/search/index.txt',
];

function readTextFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function readJsonFile(filePath) {
  return JSON.parse(readTextFile(filePath));
}

function parseXmlLocs(text) {
  return [...text.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map((match) =>
    decodeXml(match[1].trim()),
  );
}

function parseRssItems(text) {
  return [...text.matchAll(/<item\b[\s\S]*?<\/item>/gi)].map(
    (match) => match[0],
  );
}

function parseRobotsSitemaps(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^sitemap:/i.test(line))
    .map((line) => line.replace(/^sitemap:\s*/i, '').trim())
    .filter(Boolean);
}

function parseLlmsSourceFiles(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.match(/^file:\s*(.+?)\s*$/))
    .filter(Boolean)
    .map((match) => match[1]);
}

function parseSearchRecords(text) {
  const parsed = JSON.parse(text);
  if (Array.isArray(parsed)) {
    return parsed;
  }
  if (Array.isArray(parsed.data)) {
    return parsed.data;
  }
  if (Array.isArray(parsed.records)) {
    return parsed.records;
  }
  if (Array.isArray(parsed.indexes)) {
    return parsed.indexes;
  }
  if (parsed && typeof parsed === 'object') {
    const arrays = Object.values(parsed).filter(Array.isArray);
    if (arrays.length === 1) {
      return arrays[0];
    }
  }
  return [];
}

function decodeXml(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function hasOwn(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}

function isEmptyField(value) {
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  return value === undefined || value === null || String(value).trim() === '';
}

function resolveInside(baseDir, candidate) {
  const resolved = path.resolve(baseDir, candidate);
  const base = path.resolve(baseDir);
  if (resolved !== base && !resolved.startsWith(`${base}${path.sep}`)) {
    throw new Error(`${candidate} resolves outside ${base}`);
  }
  return resolved;
}

function resolveArtifactPath({ rootDir, outDir, artifactPath }) {
  if (!artifactPath) {
    return null;
  }

  if (artifactPath.startsWith('out/')) {
    const relative = artifactPath.slice('out/'.length);
    return resolveInside(outDir, relative);
  }

  if (artifactPath.startsWith('public/')) {
    return resolveInside(rootDir, artifactPath);
  }

  throw new Error(`unsupported artifact path ${artifactPath}`);
}

function loadPolicy({ rootDir = process.cwd() } = {}) {
  return readJsonFile(path.join(rootDir, POLICY_PATH));
}

function loadNativePolicy({ rootDir = process.cwd() } = {}) {
  const policyPath = path.join(rootDir, NATIVE_POLICY_PATH);
  if (!fs.existsSync(policyPath)) {
    return null;
  }

  return readJsonFile(policyPath);
}

function validateNativeRouteOwnership({
  rootDir = process.cwd(),
  routePolicy = null,
  nativePolicy = null,
} = {}) {
  const loadedRoutePolicy = routePolicy || loadPolicy({ rootDir });
  const loadedNativePolicy = nativePolicy || loadNativePolicy({ rootDir });
  const failures = [];
  const routeRows = Array.isArray(loadedRoutePolicy.routes)
    ? loadedRoutePolicy.routes
    : [];
  const nativeSurfaces = Array.isArray(loadedNativePolicy?.surfaces)
    ? loadedNativePolicy.surfaces
    : [];

  if (!loadedNativePolicy) {
    return {
      status: 'SKIPPED_WITH_CAVEAT',
      reason: `${NATIVE_POLICY_PATH} is absent; native route ownership alignment is skipped.`,
      failures,
      nativeSurfaces,
      nativeRoutes: [],
    };
  }

  const nativeRoutes = routeRows.filter(
    (row) => row.budgetOwner === 'phase-12-native-rendering',
  );
  const surfacesByRoute = new Map();
  for (const surface of nativeSurfaces) {
    if (!surface.routePath || !surface.sourceFile) {
      failures.push(`${surface.id || 'native surface'} missing routePath or sourceFile`);
      continue;
    }

    const key = `${surface.routePath}\0${surface.sourceFile}`;
    if (!surfacesByRoute.has(key)) {
      surfacesByRoute.set(key, []);
    }
    surfacesByRoute.get(key).push(surface);
  }

  for (const [key, surfaces] of surfacesByRoute) {
    const [routePath, sourceFile] = key.split('\0');
    const row = nativeRoutes.find(
      (candidate) =>
        candidate.routePath === routePath && candidate.sourceFile === sourceFile,
    );

    if (!row) {
      failures.push(`route policy missing Phase 12 native route ${routePath}`);
      continue;
    }

    if (row.classification !== 'runtime native route') {
      failures.push(`${routePath} classification must be runtime native route`);
    }
    if (row.budgetOwner !== 'phase-12-native-rendering') {
      failures.push(`${routePath} budgetOwner must be phase-12-native-rendering`);
    }
    if (!String(row.validationCommand || '').includes('static-routes:check')) {
      failures.push(`${routePath} validationCommand must include static-routes:check`);
    }
    if (!Array.isArray(row.traceIds) || !row.traceIds.includes('og-native-rendering')) {
      failures.push(`${routePath} traceIds must include og-native-rendering`);
    }

    const formats = new Set(surfaces.map((surface) => surface.format));
    if (routePath === '/api/og' && !formats.has('webp')) {
      failures.push('/api/og native surfaces must include webp');
    }
    if (
      routePath === '/api/blog/:lang/:slug/thumbnail/:format' &&
      (!formats.has('svg') || !formats.has('png'))
    ) {
      failures.push('blog thumbnail native surfaces must include svg and png');
    }
  }

  return {
    status: failures.length === 0 ? 'PASS' : 'FAIL',
    failures,
    nativeSurfaces,
    nativeRoutes,
  };
}

function validateRoutePolicy({ rootDir = process.cwd(), policy = null } = {}) {
  const loadedPolicy = policy || loadPolicy({ rootDir });
  const rows = Array.isArray(loadedPolicy.routes) ? loadedPolicy.routes : [];
  const failures = [];
  const allowed = new Set(loadedPolicy.allowedClassifications || []);
  const requiredSources = loadedPolicy.requiredSourceFiles || [];
  const rowsBySource = new Map(rows.map((row) => [row.sourceFile, row]));
  const phase9CompositionTraceIds =
    loadedPolicy.validationGates?.phase9Composition?.traceIds;

  if (!rows.length) {
    failures.push('policy routes are missing or empty');
  }

  for (const source of requiredSources) {
    if (!rowsBySource.has(source)) {
      failures.push(`missing required route source ${source}`);
    }
  }

  for (const label of loadedPolicy.allowedClassifications || []) {
    if (!rows.some((row) => row.classification === label)) {
      failures.push(`classification label has no route row: ${label}`);
    }
  }

  if (!Array.isArray(phase9CompositionTraceIds)) {
    failures.push('validationGates.phase9Composition.traceIds must be an array');
  } else {
    for (const traceId of REQUIRED_VALIDATION_GATE_TRACE_IDS) {
      if (!phase9CompositionTraceIds.includes(traceId)) {
        failures.push(
          `validationGates.phase9Composition.traceIds missing ${traceId}`,
        );
      }
    }
  }

  for (const row of rows) {
    for (const field of REQUIRED_FIELDS) {
      if (!hasOwn(row, field) || isEmptyField(row[field])) {
        failures.push(`${row.sourceFile || row.routePath} missing required field ${field}`);
      }
    }

    if (
      isEmptyField(row.expectedArtifact) &&
      isEmptyField(row.supportedDeploymentPath)
    ) {
      failures.push(
        `${row.sourceFile || row.routePath} missing expectedArtifact or supportedDeploymentPath`,
      );
    }

    if (!allowed.has(row.classification)) {
      failures.push(
        `${row.sourceFile || row.routePath} invalid classification ${row.classification}`,
      );
    }

    if (row.sourceFile) {
      const sourcePath = resolveInside(rootDir, row.sourceFile);
      if (!fs.existsSync(sourcePath)) {
        failures.push(`${row.sourceFile} source file is missing`);
      }
    }

    if (!String(row.validationCommand || '').includes('static-routes:check')) {
      failures.push(`${row.sourceFile} validationCommand must include static-routes:check`);
    }

    if (!Array.isArray(row.traceIds)) {
      failures.push(`${row.sourceFile} traceIds must be an array`);
    } else {
      for (const prefix of REQUIRED_TRACE_PREFIXES) {
        if (!row.traceIds.some((traceId) => traceId.startsWith(prefix))) {
          failures.push(`${row.sourceFile} traceIds missing ${prefix} entry`);
        }
      }
    }

    if (row.expectedArtifact) {
      try {
        const outDir = path.join(rootDir, 'out');
        resolveArtifactPath({
          rootDir,
          outDir,
          artifactPath: row.expectedArtifact,
        });
      } catch (error) {
        failures.push(`${row.sourceFile} ${error.message}`);
      }
    }
  }

  return {
    policy: loadedPolicy,
    rows,
    failures,
    status: failures.length === 0 ? 'PASS' : 'FAIL',
  };
}

function shouldInspectOut({ rootDir = process.cwd(), env = process.env } = {}) {
  return (
    fs.existsSync(path.join(rootDir, 'out')) ||
    env.PHASE9_RUN_LOCKED_BUILD === '1'
  );
}

function measureArtifactBudget({ artifactPath, budgetOwner, budget, count }) {
  const text = readTextFile(artifactPath);
  const bytes = fs.statSync(artifactPath).size;
  const measuredCount = count(text);
  const failures = [];

  if (Number.isFinite(budget.maxCount) && measuredCount > budget.maxCount) {
    failures.push(
      `${budgetOwner} count exceeds budget: ${measuredCount} > ${budget.maxCount}`,
    );
  }

  if (Number.isFinite(budget.maxBytes) && bytes > budget.maxBytes) {
    failures.push(
      `${budgetOwner} bytes exceed budget: ${bytes} > ${budget.maxBytes}`,
    );
  }

  return {
    artifactPath,
    budgetOwner,
    bytes,
    count: measuredCount,
    countLimit: budget.maxCount,
    byteLimit: budget.maxBytes,
    countLabel: budget.countLabel || 'items',
    failures,
    status: failures.length === 0 ? 'PASS' : 'FAIL',
  };
}

function findExistingArtifact({ rootDir, outDir, row }) {
  const candidates =
    row.budgetOwner === 'search-index'
      ? SEARCH_ARTIFACT_FALLBACKS
      : [row.expectedArtifact].filter(Boolean);

  for (const candidate of candidates) {
    const resolved = resolveArtifactPath({ rootDir, outDir, artifactPath: candidate });
    if (resolved && fs.existsSync(resolved)) {
      return {
        artifactPath: candidate,
        resolvedPath: resolved,
      };
    }
  }

  return {
    artifactPath: row.expectedArtifact,
    resolvedPath: row.expectedArtifact
      ? resolveArtifactPath({
          rootDir,
          outDir,
          artifactPath: row.expectedArtifact,
        })
      : null,
  };
}

function countForBudget(owner, text) {
  if (owner === 'main-sitemap' || owner === 'ai-faq-sitemap') {
    return parseXmlLocs(text).length;
  }
  if (owner === 'search-index') {
    return parseSearchRecords(text).length;
  }
  if (owner === 'llms') {
    return parseLlmsSourceFiles(text).length;
  }
  return 0;
}

function validateArtifactSupport({ rootDir, outDir, row }) {
  const failures = [];
  const artifacts = [];

  if (row.budgetOwner === 'rss') {
    const artifact = findExistingArtifact({ rootDir, outDir, row });
    if (!artifact.resolvedPath || !fs.existsSync(artifact.resolvedPath)) {
      failures.push(`${row.routePath} missing RSS artifact ${row.expectedArtifact}`);
    } else {
      const text = readTextFile(artifact.resolvedPath);
      const items = parseRssItems(text);
      if (!/<rss\b/i.test(text) || items.length === 0) {
        failures.push(`${row.routePath} RSS artifact has no rss/items`);
      }
      artifacts.push({
        kind: 'rss',
        artifactPath: artifact.artifactPath,
        bytes: fs.statSync(artifact.resolvedPath).size,
        count: items.length,
        status: failures.length === 0 ? 'PASS' : 'FAIL',
      });
    }
  }

  if (row.budgetOwner === 'sitemap-index') {
    const artifact = findExistingArtifact({ rootDir, outDir, row });
    if (!artifact.resolvedPath || !fs.existsSync(artifact.resolvedPath)) {
      failures.push(`${row.routePath} missing sitemap index artifact ${row.expectedArtifact}`);
    } else {
      const text = readTextFile(artifact.resolvedPath);
      const locs = parseXmlLocs(text);
      for (const required of ['/sitemap.xml', '/ai-quick-reference/sitemap.xml']) {
        if (!locs.some((loc) => loc.includes(required))) {
          failures.push(`${row.routePath} sitemap index missing ${required}`);
        }
      }
      artifacts.push({
        kind: 'sitemap-index',
        artifactPath: artifact.artifactPath,
        bytes: fs.statSync(artifact.resolvedPath).size,
        count: locs.length,
        status: failures.length === 0 ? 'PASS' : 'FAIL',
      });
    }
  }

  if (row.budgetOwner === 'robots') {
    const outRobots = path.join(outDir, 'robots.txt');
    const publicRobots = path.join(rootDir, 'public/robots.txt');
    const redirectsPath = path.join(rootDir, 'public/_redirects');
    const hasOut = fs.existsSync(outRobots);
    const hasPublic = fs.existsSync(publicRobots);
    const hasRedirect =
      fs.existsSync(redirectsPath) &&
      readTextFile(redirectsPath).includes('/robots.txt /api/robots 200');

    if (!hasOut && !hasPublic && !hasRedirect) {
      failures.push(
        `${row.routePath} missing robots artifact or documented Cloudflare rewrite support`,
      );
    }

    const robotsPath = hasOut ? outRobots : publicRobots;
    const text = fs.existsSync(robotsPath) ? readTextFile(robotsPath) : '';
    artifacts.push({
      kind: 'robots',
      artifactPath: hasOut ? 'out/robots.txt' : 'public/robots.txt',
      bytes: text ? fs.statSync(robotsPath).size : 0,
      count: parseRobotsSitemaps(text).length,
      status: failures.length === 0 ? 'PASS' : 'FAIL',
      supportedByRedirect: hasRedirect,
    });
  }

  return {
    artifacts,
    failures,
  };
}

function validateHostedProbeGate({ policy, env = process.env } = {}) {
  const gate = policy.hostedProbe?.gate || 'PHASE9_RUN_HOSTED_PROBES';
  const baseUrlEnv = policy.hostedProbe?.baseUrlEnv || 'PHASE10_HOSTED_BASE_URL';

  if (env[gate] !== '1') {
    return {
      status: 'SKIPPED_WITH_CAVEAT',
      reason: `${gate} is closed; hosted route probes are skipped by default.`,
      failures: [],
    };
  }

  if (!env[baseUrlEnv]) {
    return {
      status: 'BLOCKED',
      reason: `${gate} is open but ${baseUrlEnv} is missing.`,
      failures: [`${baseUrlEnv} is required when ${gate}=1`],
    };
  }

  return {
    status: 'READY',
    reason: `${gate} is open for ${env[baseUrlEnv]}; execute preview probes outside the deterministic source guard.`,
    failures: [],
  };
}

function validateStaticExportRoutes({
  rootDir = process.cwd(),
  env = process.env,
} = {}) {
  const policyResult = validateRoutePolicy({ rootDir });
  const policy = policyResult.policy;
  const nativeRouteOwnership = validateNativeRouteOwnership({
    rootDir,
    routePolicy: policy,
  });
  const outDir = path.join(rootDir, 'out');
  const failures = [
    ...policyResult.failures,
    ...nativeRouteOwnership.failures,
  ];
  const budgets = [];
  const artifacts = [];
  let out = {
    status: 'SKIPPED_WITH_CAVEAT',
    reason:
      'out is absent and PHASE9_RUN_LOCKED_BUILD is closed; source policy checks ran without static artifact inspection.',
  };

  if (shouldInspectOut({ rootDir, env })) {
    if (!fs.existsSync(outDir)) {
      out = {
        status: 'FAIL',
        reason:
          'PHASE9_RUN_LOCKED_BUILD is open but out is absent after the build path.',
      };
      failures.push(out.reason);
    } else {
      out = {
        status: 'PASS',
        outDir,
      };

      for (const row of policy.routes) {
        const budget = policy.budgets?.[row.budgetOwner];
        if (budget) {
          const artifact = findExistingArtifact({ rootDir, outDir, row });
          if (!artifact.resolvedPath || !fs.existsSync(artifact.resolvedPath)) {
            failures.push(
              `${row.routePath} missing budget artifact ${row.expectedArtifact}`,
            );
            continue;
          }

          const measured = measureArtifactBudget({
            artifactPath: artifact.resolvedPath,
            budgetOwner: row.budgetOwner,
            budget,
            count: (text) => countForBudget(row.budgetOwner, text),
          });
          budgets.push({
            ...measured,
            artifactPath: artifact.artifactPath,
          });
          failures.push(...measured.failures);
        } else if (
          ['rss', 'sitemap-index', 'robots'].includes(row.budgetOwner)
        ) {
          const support = validateArtifactSupport({ rootDir, outDir, row });
          artifacts.push(...support.artifacts);
          failures.push(...support.failures);
        }
      }
    }
  }

  const hosted = validateHostedProbeGate({ policy, env });
  failures.push(...hosted.failures);

  return {
    policy: policyResult,
    out,
    budgets,
    artifacts,
    hosted,
    nativeRouteOwnership,
    failures,
    status: failures.length === 0 ? 'PASS' : 'FAIL',
  };
}

function printStaticExportRoutesSummary(result) {
  console.log('[static-export-routes] policy');
  console.log(`  rows: ${result.policy.rows.length}`);
  console.log(`  failures: ${result.policy.failures.length}`);
  console.log(`[static-export-routes] out artifacts: ${result.out.status}`);
  if (result.out.reason) {
    console.log(`  ${result.out.reason}`);
  }
  console.log(`[static-export-routes] hosted probes: ${result.hosted.status}`);
  console.log(
    `[static-export-routes] native route ownership: ${result.nativeRouteOwnership.status}`,
  );
  if (result.hosted.reason) {
    console.log(`  ${result.hosted.reason}`);
  }

  for (const item of result.budgets) {
    console.log(
      `[static-export-routes] ${item.status}: ${item.budgetOwner} ${item.count}/${item.countLimit} ${item.countLabel}, ${item.bytes}/${item.byteLimit} bytes (${item.artifactPath})`,
    );
  }

  for (const item of result.artifacts) {
    console.log(
      `[static-export-routes] ${item.status}: ${item.kind} ${item.count} items, ${item.bytes} bytes (${item.artifactPath})`,
    );
  }

  for (const failure of result.failures) {
    console.error(`[static-export-routes] FAIL: ${failure}`);
  }
}

function main() {
  try {
    const result = validateStaticExportRoutes();
    printStaticExportRoutesSummary(result);
    process.exitCode = result.failures.length === 0 ? 0 : 1;
  } catch (error) {
    console.error(`[static-export-routes] failed: ${error.message}`);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  parseXmlLocs,
  parseRssItems,
  parseRobotsSitemaps,
  parseLlmsSourceFiles,
  parseSearchRecords,
  measureArtifactBudget,
  validateNativeRouteOwnership,
  validateRoutePolicy,
  validateStaticExportRoutes,
};
