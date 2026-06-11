#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { validateStaticExportRoutes } = require('./check-static-export-routes.js');

const IMMUTABLE_CACHE_CONTROL = 'public, max-age=31536000, immutable';
const NATIVE_POLICY_PATH = 'config/native-rendering-policy.json';
const CACHE_PATHS = ['/mtc.js', '/api/script.js'];
const REQUIRED_CLOUDFLARE_REDIRECTS = [
  { source: '/robots.txt', destination: '/api/robots', status: 200 },
  { source: '/en/*', destination: '/:splat', status: 302 },
];
const REQUIRED_STATIC_FILES = [
  'index.html',
  'en/index.html',
  'sitemap.xml',
  'rss.xml',
  'robots.txt',
  'llms.txt',
  'products/app-store/index.html',
  'en/products/app-store/index.html',
];
const REPRESENTATIVE_ASSET_DIRS = ['_next/static', 'images/apps'];

function readTextFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function readJsonFile(filePath) {
  return JSON.parse(readTextFile(filePath));
}

function normalizeHeaderKey(key) {
  return key.toLowerCase();
}

function parseVercelHeaders(vercelConfig) {
  return (vercelConfig.headers || []).flatMap((entry) =>
    (entry.headers || []).map((header) => ({
      source: entry.source,
      key: header.key,
      keyNormalized: normalizeHeaderKey(header.key),
      value: header.value,
    })),
  );
}

function parseCloudflareHeaders(text) {
  const headers = [];
  let currentSource = null;

  for (const rawLine of text.split('\n')) {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    if (!line.startsWith(' ') && !line.startsWith('\t')) {
      currentSource = trimmed;
      continue;
    }

    const separatorIndex = trimmed.indexOf(':');
    if (currentSource && separatorIndex !== -1) {
      const key = trimmed.slice(0, separatorIndex).trim();
      const value = trimmed.slice(separatorIndex + 1).trim();
      headers.push({
        source: currentSource,
        key,
        keyNormalized: normalizeHeaderKey(key),
        value,
      });
    }
  }

  return headers;
}

function parseCloudflareRedirects(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const parts = line.split(/\s+/);
      return {
        source: parts[0],
        destination: parts[1],
        status: Number(parts[2] || 302),
      };
    });
}

function findHeader(headers, source, key) {
  return headers.find(
    (header) =>
      header.source === source &&
      header.keyNormalized === normalizeHeaderKey(key),
  );
}

function validateHeaderParity(vercelHeaders, cloudflareHeaders) {
  const failures = [];

  for (const source of CACHE_PATHS) {
    const vercel = findHeader(vercelHeaders, source, 'Cache-Control');
    const cloudflare = findHeader(cloudflareHeaders, source, 'Cache-Control');

    if (!vercel) {
      failures.push(`vercel.json missing Cache-Control for ${source}`);
      continue;
    }

    if (!cloudflare) {
      failures.push(`public/_headers missing Cache-Control for ${source}`);
      continue;
    }

    if (vercel.value !== IMMUTABLE_CACHE_CONTROL) {
      failures.push(`vercel.json ${source} Cache-Control changed: ${vercel.value}`);
    }

    if (cloudflare.value !== IMMUTABLE_CACHE_CONTROL) {
      failures.push(
        `public/_headers ${source} Cache-Control changed: ${cloudflare.value}`,
      );
    }

    if (vercel.value !== cloudflare.value) {
      failures.push(`Cache-Control mismatch for ${source}`);
    }
  }

  return { failures };
}

function normalizeVercelRedirects(vercelRedirects) {
  return (vercelRedirects || []).map((redirect) => ({
    source: normalizeRedirectPattern(redirect.source),
    destination: normalizeRedirectPattern(redirect.destination),
    status: redirect.permanent ? 308 : 307,
  }));
}

function normalizeRedirectPattern(value) {
  return String(value)
    .replace(/:path\(\.\*\)/g, '*')
    .replace(/:path/g, ':splat');
}

function hasRedirect(redirects, expected) {
  return redirects.some(
    (redirect) =>
      normalizeRedirectPattern(redirect.source) === expected.source &&
      normalizeRedirectPattern(redirect.destination) === expected.destination &&
      Number(redirect.status) === Number(expected.status),
  );
}

function validateRedirectParity(vercelRedirects, cloudflareRedirects) {
  const failures = [];
  const normalizedVercel = normalizeVercelRedirects(vercelRedirects);

  for (const expected of REQUIRED_CLOUDFLARE_REDIRECTS) {
    if (!hasRedirect(cloudflareRedirects, expected)) {
      failures.push(
        `public/_redirects missing ${expected.source} ${expected.destination} ${expected.status}`,
      );
    }
  }

  for (const redirect of normalizedVercel) {
    const cloudflareStatus = redirect.status === 308 ? 308 : redirect.status;
    if (
      !hasRedirect(cloudflareRedirects, {
        source: redirect.source,
        destination: redirect.destination,
        status: cloudflareStatus,
      })
    ) {
      failures.push(`public/_redirects missing Vercel parity redirect ${redirect.source}`);
    }
  }

  return { failures };
}

function shouldInspectOut({ rootDir = process.cwd(), env = process.env } = {}) {
  return (
    fs.existsSync(path.join(rootDir, 'out')) ||
    env.PHASE9_RUN_LOCKED_BUILD === '1'
  );
}

function findFirstFile(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return null;
  }

  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isFile()) {
      return fullPath;
    }
    if (entry.isDirectory()) {
      const nested = findFirstFile(fullPath);
      if (nested) {
        return nested;
      }
    }
  }

  return null;
}

function loadNativePolicy({ rootDir = process.cwd() } = {}) {
  const policyPath = path.join(rootDir, NATIVE_POLICY_PATH);
  if (!fs.existsSync(policyPath)) {
    return null;
  }

  return readJsonFile(policyPath);
}

function inspectNativeArtifactDirectory({ rootDir, directory }) {
  const absoluteDir = path.join(rootDir, directory);
  const firstFile = findFirstFile(absoluteDir);

  return {
    directory,
    exists: fs.existsSync(absoluteDir),
    firstFile,
    status: firstFile ? 'PASS' : 'SKIPPED_WITH_CAVEAT',
  };
}

function validateNativeArtifactStatus({
  rootDir = process.cwd(),
  env = process.env,
} = {}) {
  const policy = loadNativePolicy({ rootDir });
  const failures = [];

  if (!policy) {
    return {
      status: 'SKIPPED_WITH_CAVEAT',
      reason: `${NATIVE_POLICY_PATH} is absent; native artifact checks are skipped.`,
      failures,
      policy: null,
    };
  }

  const sourceDirectory =
    policy.sourceArtifactDirectory || 'public/generated/native-images';
  const outDirectory =
    policy.staticExportArtifactDirectory || 'out/generated/native-images';
  const source = inspectNativeArtifactDirectory({
    rootDir,
    directory: sourceDirectory,
  });
  const out = inspectNativeArtifactDirectory({
    rootDir,
    directory: outDirectory,
  });
  const outRootExists = fs.existsSync(path.join(rootDir, 'out'));
  const lockedGateOpen = env.PHASE9_RUN_LOCKED_BUILD === '1';

  if (!source.exists && !outRootExists && !lockedGateOpen) {
    return {
      status: 'SKIPPED_WITH_CAVEAT',
      reason:
        'source artifacts are absent and out is absent; native artifact inspection is skipped until static artifacts or export output exist.',
      failures,
      policy,
      source,
      out,
    };
  }

  if (lockedGateOpen && !outRootExists) {
    failures.push(
      'PHASE9_RUN_LOCKED_BUILD is open but out is absent for native artifacts.',
    );
  }

  if (source.exists && !source.firstFile) {
    failures.push(`${source.directory} exists but contains no native artifact files`);
  }

  if (outRootExists && !out.exists) {
    failures.push(`${out.directory} is missing while out exists`);
  } else if (out.exists && !out.firstFile) {
    failures.push(`${out.directory} exists but contains no native artifact files`);
  }

  return {
    status: failures.length === 0 ? 'PASS' : 'FAIL',
    reason:
      failures.length === 0
        ? 'native artifact source/output directories are aligned with policy.'
        : 'native artifact source/output directories failed policy checks.',
    failures,
    policy,
    source,
    out,
  };
}

function validateOutArtifacts({ outDir = path.join(process.cwd(), 'out') } = {}) {
  const missingRequired = REQUIRED_STATIC_FILES.filter(
    (file) => !fs.existsSync(path.join(outDir, file)),
  );
  const representativeAssets = REPRESENTATIVE_ASSET_DIRS.map((dir) => ({
    dir,
    file: findFirstFile(path.join(outDir, dir)),
  })).filter((entry) => entry.file);
  const missingAssetDirs = REPRESENTATIVE_ASSET_DIRS.filter(
    (dir) => !representativeAssets.some((entry) => entry.dir === dir),
  );

  return {
    outDir,
    missingRequired,
    representativeAssets,
    missingAssetDirs,
    status:
      missingRequired.length === 0 && missingAssetDirs.length === 0
        ? 'PASS'
        : 'FAIL',
  };
}

function validateSourceConfig({ rootDir = process.cwd() } = {}) {
  const vercel = readJsonFile(path.join(rootDir, 'vercel.json'));
  const cloudflareHeadersText = readTextFile(path.join(rootDir, 'public/_headers'));
  const cloudflareRedirectsText = readTextFile(
    path.join(rootDir, 'public/_redirects'),
  );
  const nextConfigText = readTextFile(path.join(rootDir, 'next.config.mjs'));
  const pkg = readJsonFile(path.join(rootDir, 'package.json'));
  const vercelHeaders = parseVercelHeaders(vercel);
  const cloudflareHeaders = parseCloudflareHeaders(cloudflareHeadersText);
  const cloudflareRedirects = parseCloudflareRedirects(cloudflareRedirectsText);
  const headerParity = validateHeaderParity(vercelHeaders, cloudflareHeaders);
  const redirectParity = validateRedirectParity(
    vercel.redirects || [],
    cloudflareRedirects,
  );
  const sourceFailures = [];

  if (
    !nextConfigText.includes('output:') ||
    !nextConfigText.includes("'export'")
  ) {
    sourceFailures.push("next.config.mjs missing static export output policy");
  }

  if (!nextConfigText.includes('trailingSlash')) {
    sourceFailures.push('next.config.mjs missing trailingSlash policy');
  }

  if (!nextConfigText.includes('unoptimized')) {
    sourceFailures.push('next.config.mjs missing static image policy');
  }

  if (!pkg.scripts?.build) {
    sourceFailures.push('package.json missing build script');
  }

  return {
    vercelHeaders,
    cloudflareHeaders,
    cloudflareRedirects,
    headerParity,
    redirectParity,
    sourceFailures,
  };
}

function validateStaticOutput({ rootDir = process.cwd(), env = process.env } = {}) {
  const source = validateSourceConfig({ rootDir });
  const routePolicy = validateStaticExportRoutes({ rootDir, env });
  const nativeArtifacts = validateNativeArtifactStatus({ rootDir, env });
  const failures = [
    ...source.headerParity.failures,
    ...source.redirectParity.failures,
    ...source.sourceFailures,
    ...routePolicy.failures,
    ...nativeArtifacts.failures,
  ];
  let out = {
    status: 'SKIPPED_WITH_CAVEAT',
    reason:
      'out is absent and PHASE9_RUN_LOCKED_BUILD is closed; run the locked build gate in a Node 20 dependency environment for full static artifact evidence.',
  };

  if (shouldInspectOut({ rootDir, env })) {
    const outDir = path.join(rootDir, 'out');

    if (!fs.existsSync(outDir)) {
      out = {
        status: 'FAIL',
        reason:
          'PHASE9_RUN_LOCKED_BUILD is open but out is absent after the build path.',
      };
      failures.push(out.reason);
    } else {
      out = validateOutArtifacts({ outDir });
      failures.push(
        ...out.missingRequired.map((file) => `out missing required file ${file}`),
        ...out.missingAssetDirs.map(
          (dir) => `out missing representative asset directory ${dir}`,
        ),
      );
    }
  }

  return {
    source,
    out,
    routePolicy,
    nativeArtifacts,
    failures,
    status: failures.length === 0 ? 'PASS' : 'FAIL',
  };
}

function printStaticOutputSummary(result) {
  console.log('[static-output] source checks');
  console.log(`  header failures: ${result.source.headerParity.failures.length}`);
  console.log(`  redirect failures: ${result.source.redirectParity.failures.length}`);
  console.log(`  config failures: ${result.source.sourceFailures.length}`);
  console.log(`[static-output] out artifacts: ${result.out.status}`);
  console.log(`[static-output] route policy: ${result.routePolicy.status}`);
  console.log(
    `[static-output] native artifacts: ${result.nativeArtifacts.status}`,
  );

  if (result.out.reason) {
    console.log(`  ${result.out.reason}`);
  }

  if (result.routePolicy.out.reason) {
    console.log(`  ${result.routePolicy.out.reason}`);
  }

  if (result.nativeArtifacts.reason) {
    console.log(`  ${result.nativeArtifacts.reason}`);
  }

  if (result.out.missingRequired) {
    console.log(`  missing required files: ${result.out.missingRequired.length}`);
    console.log(`  representative assets: ${result.out.representativeAssets.length}`);
  }

  for (const failure of result.failures) {
    console.error(`[static-output] FAIL: ${failure}`);
  }
}

function main() {
  try {
    const result = validateStaticOutput();
    printStaticOutputSummary(result);
    process.exitCode = result.failures.length === 0 ? 0 : 1;
  } catch (error) {
    console.error(`[static-output] failed: ${error.message}`);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  CACHE_PATHS,
  IMMUTABLE_CACHE_CONTROL,
  parseCloudflareHeaders,
  parseCloudflareRedirects,
  parseVercelHeaders,
  shouldInspectOut,
  validateNativeArtifactStatus,
  validateHeaderParity,
  validateOutArtifacts,
  validateRedirectParity,
  validateSourceConfig,
  validateStaticOutput,
};
