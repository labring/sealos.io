#!/usr/bin/env node

const fs = require('fs');
const { execFileSync } = require('child_process');

const NATIVE_DEPENDENCIES = ['canvas', 'sharp', 'satori', 'next'];
const BENCHMARK_GATE = 'PHASE12_RUN_NATIVE_BENCHMARK';

function readJsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function collectNativeDependencyVersions(lock = readJsonIfExists('package-lock.json')) {
  const versions = {};
  const packages = lock?.packages || {};

  for (const name of NATIVE_DEPENDENCIES) {
    versions[name] = packages[`node_modules/${name}`]?.version || null;
  }

  return versions;
}

function collectEnvironmentContext({
  execFile = execFileSync,
  cwd = process.cwd(),
  exists = fs.existsSync,
  nodeVersion = process.version,
} = {}) {
  const nvmrcPath = `${cwd}/.nvmrc`;
  const lock = readJsonIfExists(`${cwd}/package-lock.json`);
  const nvmrc = exists(nvmrcPath)
    ? fs.readFileSync(nvmrcPath, 'utf8').trim()
    : null;
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
    nativeDependencyVersions: collectNativeDependencyVersions(lock),
    nodeMajorMatchesNvmrc:
      expectedMajor === null || activeMajor === null
        ? null
        : activeMajor === expectedMajor,
    nodeModules: exists(`${cwd}/node_modules`),
    sourceGenerated: exists(`${cwd}/.source`),
    staticExportOutput: exists(`${cwd}/out`),
  };
}

function createBenchmarkFixtures() {
  return [
    {
      renderer: 'canvas-sharp-webp',
      fixtureKey: 'homepage-og:webp:1200x630@1x',
      format: 'webp',
      width: 1200,
      height: 630,
      dpr: 1,
    },
    {
      renderer: 'satori-svg',
      fixtureKey: 'blog-thumbnail:en:app-deployment:svg:384x256@1x',
      format: 'svg',
      width: 384,
      height: 256,
      dpr: 1,
      lang: 'en',
      slug: 'how-to-deploy-and-configure-flarum-using-docker',
      title: 'How to Deploy and Configure Flarum Using Docker',
      category: 'app-deployment',
    },
    {
      renderer: 'satori-svg',
      fixtureKey: 'blog-thumbnail:zh-cn:what-is:svg:400x210@1x',
      format: 'svg',
      width: 400,
      height: 210,
      dpr: 1,
      lang: 'zh-cn',
      slug: 'what-is-sealos',
      title: 'What Is Sealos',
      category: 'what-is',
    },
    {
      renderer: 'next-image-response-png',
      fixtureKey: 'blog-thumbnail:en:what-is:png:1200x630@3x',
      format: 'png',
      width: 1200,
      height: 630,
      dpr: 3,
      lang: 'en',
      slug: 'what-is-sealos',
      title: 'What Is Sealos',
      category: 'what-is',
    },
  ];
}

function createParsedFormat(fixture) {
  return {
    type: fixture.format,
    width: fixture.width,
    height: fixture.height,
    baseWidth: Math.max(Math.round(fixture.width / fixture.dpr), 128),
    baseHeight: Math.max(Math.round(fixture.height / fixture.dpr), 128),
    dpr: fixture.dpr,
  };
}

async function getOutputBytes(output) {
  if (Buffer.isBuffer(output)) {
    return output.length;
  }
  if (typeof output === 'string') {
    return Buffer.byteLength(output);
  }
  if (output?.arrayBuffer) {
    const arrayBuffer = await output.arrayBuffer();
    return arrayBuffer.byteLength;
  }
  return 0;
}

async function runBenchmarkFixture(
  fixture,
  {
    renderers,
    getNativeRenderFontStatus,
    now = () => Number(process.hrtime.bigint()) / 1_000_000,
  },
) {
  const caveats = [];
  const startedAt = now();
  let output;

  if (fixture.renderer === 'canvas-sharp-webp') {
    output = await renderers.renderOgWebpBuffer();
  } else if (fixture.renderer === 'satori-svg') {
    output = await renderers.renderBlogThumbnailSvg({
      title: fixture.title,
      category: fixture.category,
      lang: fixture.lang,
      slug: fixture.slug,
      parsed: createParsedFormat(fixture),
    });
  } else if (fixture.renderer === 'next-image-response-png') {
    output = await renderers.renderBlogThumbnailPngResponse({
      title: fixture.title,
      category: fixture.category,
      lang: fixture.lang,
      slug: fixture.slug,
      parsed: createParsedFormat(fixture),
    });
  } else {
    throw new Error(`unsupported renderer ${fixture.renderer}`);
  }

  const endedAt = now();
  const fontStatus = getNativeRenderFontStatus();

  return {
    renderer: fixture.renderer,
    fixtureKey: fixture.fixtureKey,
    lang: fixture.lang || 'default',
    slug: fixture.slug || 'homepage',
    category: fixture.category || 'homepage',
    format: fixture.format,
    width: fixture.width,
    height: fixture.height,
    dpr: fixture.dpr,
    fontCache: fontStatus.cacheState,
    durationMs: endedAt - startedAt,
    bytes: await getOutputBytes(output),
    status: 'PASS',
    caveats,
  };
}

function getOpenGateBlockers(context) {
  const blockers = [];

  if (context.nvmrc && context.nodeMajorMatchesNvmrc === false) {
    blockers.push(`active Node ${context.node} differs from .nvmrc ${context.nvmrc}; accepted benchmark requires Node 20`);
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

  return blockers;
}

async function importNativeRenderers() {
  const [ogRenderer, blogRenderer, fonts] = await Promise.all([
    import('../lib/native-rendering/og-renderer.ts'),
    import('../lib/native-rendering/blog-thumbnail-renderer.tsx'),
    import('../lib/native-rendering/fonts.ts'),
  ]);

  return {
    renderOgWebpBuffer: ogRenderer.renderOgWebpBuffer,
    renderBlogThumbnailSvg: blogRenderer.renderBlogThumbnailSvg,
    renderBlogThumbnailPngResponse:
      blogRenderer.renderBlogThumbnailPngResponse,
    getNativeRenderFontStatus: fonts.getNativeRenderFontStatus,
  };
}

async function runNativeRenderingBenchmark({
  env = process.env,
  context = collectEnvironmentContext(),
  fixtures = createBenchmarkFixtures(),
  importNativeRenderers: nativeImporter = importNativeRenderers,
} = {}) {
  if (env[BENCHMARK_GATE] !== '1') {
    return {
      status: 'SKIPPED_WITH_CAVEAT',
      exitCode: 0,
      context,
      results: fixtures.map((fixture) => ({
        ...fixture,
        status: 'SKIPPED_WITH_CAVEAT',
        fontCache: 'cold',
        durationMs: 0,
        bytes: 0,
        caveats: [
          `${BENCHMARK_GATE} is closed; local native renderer imports are skipped by default.`,
        ],
      })),
      caveats: [
        `${BENCHMARK_GATE} is closed; local native renderer imports are skipped by default.`,
      ],
    };
  }

  const blockers = getOpenGateBlockers(context);
  if (blockers.length > 0) {
    return {
      status: 'BLOCKED',
      exitCode: 1,
      context,
      results: [],
      caveats: blockers,
    };
  }

  const nativeRenderers = await nativeImporter();
  const renderers = {
    renderOgWebpBuffer: nativeRenderers.renderOgWebpBuffer,
    renderBlogThumbnailSvg: nativeRenderers.renderBlogThumbnailSvg,
    renderBlogThumbnailPngResponse:
      nativeRenderers.renderBlogThumbnailPngResponse,
  };
  const results = [];

  for (const fixture of fixtures) {
    results.push(
      await runBenchmarkFixture(fixture, {
        renderers,
        getNativeRenderFontStatus:
          nativeRenderers.getNativeRenderFontStatus,
      }),
    );
  }

  return {
    status: 'PASS',
    exitCode: 0,
    context,
    results,
    caveats: [],
  };
}

function printBenchmarkResult(result) {
  console.log('[native-rendering-benchmark] environment');
  console.log(`  node: ${result.context.node}`);
  console.log(`  npm: ${result.context.npm || 'unavailable'}`);
  console.log(`  .nvmrc: ${result.context.nvmrc || 'missing'}`);
  console.log(`  lockfileVersion: ${result.context.lockfileVersion || 'missing'}`);
  console.log(`  node_modules: ${result.context.nodeModules}`);
  console.log(`  .source: ${result.context.sourceGenerated}`);
  console.log(`  out: ${result.context.staticExportOutput}`);

  for (const [name, version] of Object.entries(
    result.context.nativeDependencyVersions,
  )) {
    console.log(`  ${name}: ${version || 'missing'}`);
  }

  console.log(`[native-rendering-benchmark] status: ${result.status}`);
  for (const caveat of result.caveats) {
    console.log(`[native-rendering-benchmark] caveat: ${caveat}`);
  }

  for (const row of result.results) {
    console.log(
      JSON.stringify({
        renderer: row.renderer,
        fixtureKey: row.fixtureKey,
        format: row.format,
        width: row.width,
        height: row.height,
        dpr: row.dpr,
        fontCache: row.fontCache,
        durationMs: row.durationMs,
        bytes: row.bytes,
        status: row.status,
        caveats: row.caveats,
      }),
    );
  }
}

async function main() {
  try {
    const result = await runNativeRenderingBenchmark();
    printBenchmarkResult(result);
    process.exitCode = result.exitCode;
  } catch (error) {
    console.error(`[native-rendering-benchmark] failed: ${error.message}`);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  BENCHMARK_GATE,
  collectEnvironmentContext,
  collectNativeDependencyVersions,
  createBenchmarkFixtures,
  runBenchmarkFixture,
  runNativeRenderingBenchmark,
};
