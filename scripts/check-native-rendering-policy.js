#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const POLICY_PATH = 'config/native-rendering-policy.json';
const ROUTE_POLICY_PATH = 'config/static-export-route-policy.json';
const REQUIRED_SURFACE_IDS = [
  'homepage-og-webp',
  'blog-thumbnail-svg-default',
  'blog-thumbnail-svg-card',
  'blog-thumbnail-png-large',
];
const REQUIRED_CACHE_KEY_FIELDS = [
  'imageType',
  'language',
  'slug',
  'dimensions',
  'dpr',
  'format',
  'rendererVersion',
  'templateVersion',
  'fontVersion',
];
const REQUIRED_VALIDATION_COMMANDS = [
  'node --test scripts/check-native-rendering-policy.test.mjs',
  'npm run native-rendering:check',
  'npm run static-routes:check',
];
const REQUIRED_TRACE_IDS = ['NATIVE-01', 'og-native-rendering'];
const REQUIRED_NATIVE_PACKAGES = ['canvas', 'sharp', 'satori'];
const REQUIRED_FONTS = [
  {
    path: 'fonts/arial.ttf',
    expectedBytes: 915212,
  },
  {
    path: 'fonts/arial-bold.ttf',
    expectedBytes: 57448,
  },
  {
    path: 'fonts/NotoSansSC-Black.ttf',
    expectedBytes: 10541596,
  },
];
const REQUIRED_ROUTE_ALIGNMENT = [
  {
    routePath: '/api/og',
    sourceFile: 'app/api/og/route.ts',
    requiredClassification: 'runtime native route',
    requiredBudgetOwner: 'phase-12-native-rendering',
  },
  {
    routePath: '/api/blog/:lang/:slug/thumbnail/:format',
    sourceFile: 'app/api/blog/[lang]/[slug]/thumbnail/[format]/route.ts',
    requiredClassification: 'runtime native route',
    requiredBudgetOwner: 'phase-12-native-rendering',
  },
];

function readTextFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function readJsonFile(filePath) {
  return JSON.parse(readTextFile(filePath));
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

function loadNativePolicy({ rootDir = process.cwd() } = {}) {
  return readJsonFile(path.join(rootDir, POLICY_PATH));
}

function loadRoutePolicy({ rootDir = process.cwd() } = {}) {
  return readJsonFile(path.join(rootDir, ROUTE_POLICY_PATH));
}

function validateNativePolicyConfig({
  rootDir = process.cwd(),
  policy = null,
} = {}) {
  const loadedPolicy = policy || loadNativePolicy({ rootDir });
  const failures = [];
  const surfaces = Array.isArray(loadedPolicy.surfaces)
    ? loadedPolicy.surfaces
    : [];
  const surfaceById = new Map(surfaces.map((surface) => [surface.id, surface]));

  if (loadedPolicy.version !== 1) {
    failures.push('policy version must be 1');
  }

  for (const field of [
    'sourceArtifactDirectory',
    'staticExportArtifactDirectory',
    'runtimeCacheHeader',
    'immutableStaticArtifactRule',
    'rendererVersions',
    'templateVersions',
    'fontVersion',
    'cacheKeys',
    'fonts',
    'nativeDependencies',
    'blogBackgroundFixtures',
    'routePolicyAlignment',
    'surfaces',
    'validationCommands',
  ]) {
    if (!hasOwn(loadedPolicy, field) || isEmptyField(loadedPolicy[field])) {
      failures.push(`policy missing required field ${field}`);
    }
  }

  if (loadedPolicy.sourceArtifactDirectory !== 'public/generated/native-images') {
    failures.push(
      'sourceArtifactDirectory must be public/generated/native-images',
    );
  }
  if (
    loadedPolicy.staticExportArtifactDirectory !== 'out/generated/native-images'
  ) {
    failures.push(
      'staticExportArtifactDirectory must be out/generated/native-images',
    );
  }
  if (loadedPolicy.runtimeCacheHeader !== 'public, max-age=86400') {
    failures.push('runtimeCacheHeader must be public, max-age=86400');
  }
  if (
    !String(loadedPolicy.immutableStaticArtifactRule || '').includes(
      'fully versioned static artifact',
    )
  ) {
    failures.push(
      'immutableStaticArtifactRule must mention fully versioned static artifact',
    );
  }

  const cacheFields = loadedPolicy.cacheKeys?.requiredDimensions;
  if (!Array.isArray(cacheFields)) {
    failures.push('cacheKeys.requiredDimensions must be an array');
  } else {
    for (const field of REQUIRED_CACHE_KEY_FIELDS) {
      if (!cacheFields.includes(field)) {
        failures.push(`cacheKeys.requiredDimensions missing ${field}`);
      }
    }
  }

  const validationCommands = loadedPolicy.validationCommands;
  if (!Array.isArray(validationCommands)) {
    failures.push('validationCommands must be an array');
  } else {
    for (const command of REQUIRED_VALIDATION_COMMANDS) {
      if (!validationCommands.includes(command)) {
        failures.push(`validationCommands missing ${command}`);
      }
    }
  }

  for (const id of REQUIRED_SURFACE_IDS) {
    if (!surfaceById.has(id)) {
      failures.push(`missing required surface ${id}`);
    }
  }

  for (const surface of surfaces) {
    for (const field of [
      'id',
      'imageType',
      'routePath',
      'sourceFile',
      'renderer',
      'format',
      'contentType',
      'width',
      'height',
      'dpr',
      'maxDpr',
      'artifactStrategy',
      'runtimeCacheHeader',
      'traceIds',
      'validationCommand',
    ]) {
      if (!hasOwn(surface, field) || isEmptyField(surface[field])) {
        failures.push(`${surface.id || surface.routePath} missing ${field}`);
      }
    }

    if (surface.sourceFile) {
      const sourcePath = resolveInside(rootDir, surface.sourceFile);
      if (!fs.existsSync(sourcePath)) {
        failures.push(`${surface.sourceFile} source file is missing`);
      }
    }

    if (surface.runtimeCacheHeader !== 'public, max-age=86400') {
      failures.push(`${surface.id} runtimeCacheHeader must be public, max-age=86400`);
    }

    if (surface.dpr > surface.maxDpr) {
      failures.push(`${surface.id} dpr exceeds maxDpr`);
    }

    if (!['webp', 'svg', 'png'].includes(surface.format)) {
      failures.push(`${surface.id} invalid format ${surface.format}`);
    }

    if (!Array.isArray(surface.cacheKeyFields)) {
      failures.push(`${surface.id} cacheKeyFields must be an array`);
    } else {
      for (const field of REQUIRED_CACHE_KEY_FIELDS) {
        if (!surface.cacheKeyFields.includes(field)) {
          failures.push(`${surface.id} cacheKeyFields missing ${field}`);
        }
      }
    }

    if (!Array.isArray(surface.traceIds)) {
      failures.push(`${surface.id} traceIds must be an array`);
    } else {
      for (const traceId of REQUIRED_TRACE_IDS) {
        if (!surface.traceIds.includes(traceId)) {
          failures.push(`${surface.id} traceIds missing ${traceId}`);
        }
      }
      const perfId = surface.imageType === 'homepage-og' ? 'PERF-501' : 'PERF-502';
      if (!surface.traceIds.includes(perfId)) {
        failures.push(`${surface.id} traceIds missing ${perfId}`);
      }
    }

    if (surface.validationCommand !== 'npm run native-rendering:check') {
      failures.push(
        `${surface.id} validationCommand must be npm run native-rendering:check`,
      );
    }
  }

  validateNativePackageEntries({ rootDir, policy: loadedPolicy, failures });
  validateBlogBackgroundFixtures({ rootDir, policy: loadedPolicy, failures });

  return {
    policy: loadedPolicy,
    surfaces,
    failures,
    status: failures.length === 0 ? 'PASS' : 'FAIL',
  };
}

function validateNativePackageEntries({ rootDir, policy, failures }) {
  const packageJson = readJsonFile(path.join(rootDir, 'package.json'));
  const lockPath = path.join(rootDir, 'package-lock.json');
  const lockJson = fs.existsSync(lockPath) ? readJsonFile(lockPath) : null;
  const dependencyRows = Array.isArray(policy.nativeDependencies)
    ? policy.nativeDependencies
    : [];

  for (const packageName of REQUIRED_NATIVE_PACKAGES) {
    const policyRow = dependencyRows.find((row) => row.name === packageName);
    if (!policyRow) {
      failures.push(`missing native dependency policy row ${packageName}`);
      continue;
    }

    const packageRange =
      packageJson.dependencies?.[packageName] ||
      packageJson.devDependencies?.[packageName];
    if (!packageRange) {
      failures.push(`package.json missing ${packageName}`);
    } else if (packageRange !== policyRow.expectedPackageRange) {
      failures.push(
        `${packageName} package range ${packageRange} differs from policy ${policyRow.expectedPackageRange}`,
      );
    }

    const lockPackage = lockJson?.packages?.[`node_modules/${packageName}`];
    const rootPackageRange =
      lockJson?.packages?.['']?.dependencies?.[packageName] ||
      lockJson?.packages?.['']?.devDependencies?.[packageName];
    if (!lockPackage && !rootPackageRange) {
      failures.push(`package-lock.json missing ${packageName}`);
    }
  }
}

function validateBlogBackgroundFixtures({ rootDir, policy, failures }) {
  const fixturePolicy = policy.blogBackgroundFixtures;
  const expectedFiles = fixturePolicy?.expectedFiles;
  if (!fixturePolicy || !Array.isArray(expectedFiles)) {
    failures.push('blogBackgroundFixtures.expectedFiles must be an array');
    return;
  }

  let totalBytes = 0;
  for (const file of expectedFiles) {
    const filePath = resolveInside(rootDir, file.path);
    if (!fs.existsSync(filePath)) {
      failures.push(`blog background fixture missing ${file.path}`);
      continue;
    }
    const actualBytes = fs.statSync(filePath).size;
    totalBytes += actualBytes;
    if (actualBytes !== file.expectedBytes) {
      failures.push(
        `${file.path} byte count ${actualBytes} differs from policy ${file.expectedBytes}`,
      );
    }
  }

  if (Number.isFinite(fixturePolicy.expectedTotalBytes)) {
    if (totalBytes !== fixturePolicy.expectedTotalBytes) {
      failures.push(
        `blog background total bytes ${totalBytes} differs from policy ${fixturePolicy.expectedTotalBytes}`,
      );
    }
  }

  if (!fixturePolicy.largestFixture) {
    failures.push('blogBackgroundFixtures.largestFixture is required');
  } else if (
    !expectedFiles.some((file) => file.path === fixturePolicy.largestFixture)
  ) {
    failures.push(
      `blogBackgroundFixtures.largestFixture ${fixturePolicy.largestFixture} is not in expectedFiles`,
    );
  }
}

function validateNativeRoutePolicyAlignment({
  rootDir = process.cwd(),
  policy = null,
  routePolicy = null,
} = {}) {
  const loadedPolicy = policy || loadNativePolicy({ rootDir });
  const loadedRoutePolicy = routePolicy || loadRoutePolicy({ rootDir });
  const failures = [];
  const routeRows = Array.isArray(loadedRoutePolicy.routes)
    ? loadedRoutePolicy.routes
    : [];
  const alignmentRows = Array.isArray(loadedPolicy.routePolicyAlignment)
    ? loadedPolicy.routePolicyAlignment
    : REQUIRED_ROUTE_ALIGNMENT;

  for (const required of REQUIRED_ROUTE_ALIGNMENT) {
    if (
      !alignmentRows.some(
        (row) =>
          row.routePath === required.routePath &&
          row.sourceFile === required.sourceFile &&
          row.requiredClassification === required.requiredClassification &&
          row.requiredBudgetOwner === required.requiredBudgetOwner,
      )
    ) {
      failures.push(`native policy missing route alignment ${required.routePath}`);
    }
  }

  for (const expected of alignmentRows) {
    const row = routeRows.find(
      (candidate) =>
        candidate.routePath === expected.routePath &&
        candidate.sourceFile === expected.sourceFile,
    );
    if (!row) {
      failures.push(`route policy missing ${expected.routePath}`);
      continue;
    }
    if (row.classification !== expected.requiredClassification) {
      failures.push(
        `${expected.routePath} classification must be ${expected.requiredClassification}`,
      );
    }
    if (row.budgetOwner !== expected.requiredBudgetOwner) {
      failures.push(
        `${expected.routePath} budgetOwner must be ${expected.requiredBudgetOwner}`,
      );
    }
    if (!String(row.validationCommand || '').includes('static-routes:check')) {
      failures.push(`${expected.routePath} validationCommand must include static-routes:check`);
    }
    if (!Array.isArray(row.traceIds) || !row.traceIds.includes('og-native-rendering')) {
      failures.push(`${expected.routePath} traceIds must include og-native-rendering`);
    }
  }

  return {
    routePolicy: loadedRoutePolicy,
    failures,
    status: failures.length === 0 ? 'PASS' : 'FAIL',
  };
}

function validateNativeFontContract({
  rootDir = process.cwd(),
  policy = null,
} = {}) {
  const loadedPolicy = policy || loadNativePolicy({ rootDir });
  const failures = [];
  const rows = Array.isArray(loadedPolicy.fonts) ? loadedPolicy.fonts : [];

  for (const requiredFont of REQUIRED_FONTS) {
    const row = rows.find((font) => font.path === requiredFont.path);
    if (!row) {
      failures.push(`missing required font ${requiredFont.path}`);
      continue;
    }
    if (row.expectedBytes !== requiredFont.expectedBytes) {
      failures.push(
        `${requiredFont.path} policy byte count must be ${requiredFont.expectedBytes}`,
      );
    }

    const fontPath = resolveInside(rootDir, row.path);
    if (!fs.existsSync(fontPath)) {
      failures.push(`${row.path} font file is missing`);
      continue;
    }
    const actualBytes = fs.statSync(fontPath).size;
    if (actualBytes !== row.expectedBytes) {
      failures.push(
        `${row.path} byte count ${actualBytes} differs from policy ${row.expectedBytes}`,
      );
    }
  }

  return {
    fonts: rows,
    failures,
    status: failures.length === 0 ? 'PASS' : 'FAIL',
  };
}

function validateNativePackageScript({
  rootDir = process.cwd(),
  requireScript = false,
} = {}) {
  const failures = [];
  const packageJson = readJsonFile(path.join(rootDir, 'package.json'));
  const checkScript = packageJson.scripts?.['native-rendering:check'];
  const benchmarkScript = packageJson.scripts?.['native-rendering:benchmark'];

  if (checkScript !== 'node scripts/check-native-rendering-policy.js') {
    const message =
      'package.json scripts.native-rendering:check must be node scripts/check-native-rendering-policy.js';
    if (requireScript) {
      failures.push(message);
    }
  }

  if (benchmarkScript !== 'node scripts/benchmark-native-rendering.js') {
    const message =
      'package.json scripts.native-rendering:benchmark must be node scripts/benchmark-native-rendering.js';
    if (requireScript) {
      failures.push(message);
    }
  }

  return {
    script: checkScript,
    benchmarkScript,
    failures,
    status: failures.length === 0 ? 'PASS' : 'FAIL',
  };
}

function validateNativeEnvironmentCaveats({
  rootDir = process.cwd(),
  env = process.env,
  nodeVersion = process.version,
} = {}) {
  const failures = [];
  const caveats = [];
  const nvmrcPath = path.join(rootDir, '.nvmrc');
  const expectedNode = fs.existsSync(nvmrcPath)
    ? readTextFile(nvmrcPath).trim()
    : '';
  const activeMajor = String(nodeVersion).match(/^v?(\d+)/)?.[1] || '';

  if (expectedNode && activeMajor && activeMajor !== expectedNode) {
    caveats.push(
      `active Node ${nodeVersion} differs from .nvmrc requires ${expectedNode}`,
    );
  }

  for (const directory of ['node_modules', '.source', 'out']) {
    if (!fs.existsSync(path.join(rootDir, directory))) {
      caveats.push(`${directory} is absent`);
    }
  }

  const dockerProbe = spawnSync('docker', ['--version'], {
    env,
    encoding: 'utf8',
  });
  if (dockerProbe.status !== 0) {
    caveats.push('Docker CLI is unavailable');
  }

  return {
    expectedNode,
    activeNode: nodeVersion,
    caveats,
    failures,
    status:
      failures.length > 0
        ? 'FAIL'
        : caveats.length > 0
          ? 'PASS_WITH_CAVEATS'
          : 'PASS',
  };
}

function validateNativeRenderingPolicy({
  rootDir = process.cwd(),
  env = process.env,
  requirePackageScript = false,
} = {}) {
  const policy = loadNativePolicy({ rootDir });
  const policyResult = validateNativePolicyConfig({ rootDir, policy });
  const routePolicyResult = validateNativeRoutePolicyAlignment({
    rootDir,
    policy,
  });
  const fontResult = validateNativeFontContract({ rootDir, policy });
  const scriptResult = validateNativePackageScript({
    rootDir,
    requireScript: requirePackageScript,
  });
  const environmentResult = validateNativeEnvironmentCaveats({ rootDir, env });
  const failures = [
    ...policyResult.failures,
    ...routePolicyResult.failures,
    ...fontResult.failures,
    ...scriptResult.failures,
    ...environmentResult.failures,
  ];

  return {
    status: failures.length === 0 ? 'PASS' : 'FAIL',
    failures,
    policy: policyResult,
    routePolicy: routePolicyResult,
    fonts: fontResult,
    packageScript: scriptResult,
    environment: environmentResult,
  };
}

function printNativeRenderingPolicySummary(result) {
  const lines = [];
  lines.push(`Native rendering policy: ${result.status}`);
  lines.push(`Policy rows: ${result.policy.surfaces.length}`);
  lines.push(`Route policy alignment: ${result.routePolicy.status}`);
  lines.push(`Font contract: ${result.fonts.status}`);
  lines.push(`Package script: ${result.packageScript.status}`);
  lines.push(`Environment: ${result.environment.status}`);

  if (result.environment.caveats.length) {
    lines.push('Caveats:');
    for (const caveat of result.environment.caveats) {
      lines.push(`- ${caveat}`);
    }
  }

  if (result.failures.length) {
    lines.push('Failures:');
    for (const failure of result.failures) {
      lines.push(`- ${failure}`);
    }
  }

  console.log(lines.join('\n'));
}

if (require.main === module) {
  const result = validateNativeRenderingPolicy({
    requirePackageScript: true,
  });
  printNativeRenderingPolicySummary(result);
  process.exitCode = result.status === 'PASS' ? 0 : 1;
}

module.exports = {
  loadNativePolicy,
  printNativeRenderingPolicySummary,
  validateNativeEnvironmentCaveats,
  validateNativeFontContract,
  validateNativePackageScript,
  validateNativePolicyConfig,
  validateNativeRenderingPolicy,
  validateNativeRoutePolicyAlignment,
};
