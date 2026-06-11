import test from 'node:test';
import assert from 'node:assert/strict';

import {
  collectEnvironmentContext,
  createBenchmarkFixtures,
  runBenchmarkFixture,
  runNativeRenderingBenchmark,
} from './benchmark-native-rendering.js';

test('collectEnvironmentContext reports native rendering prerequisites', () => {
  const context = collectEnvironmentContext({
    execFile: () => '10.9.0\n',
    exists: (filePath) => !String(filePath).endsWith('node_modules'),
    nodeVersion: 'v20.11.1',
  });

  assert.equal(context.node, 'v20.11.1');
  assert.equal(context.npm, '10.9.0');
  assert.equal(context.nvmrc, '20');
  assert.equal(context.lockfileVersion, 3);
  assert.equal(context.nodeMajorMatchesNvmrc, true);
  assert.equal(context.nodeModules, false);
  assert.equal(typeof context.sourceGenerated, 'boolean');
  assert.equal(typeof context.staticExportOutput, 'boolean');

  for (const name of ['canvas', 'sharp', 'satori', 'next']) {
    assert.ok(Object.hasOwn(context.nativeDependencyVersions, name), name);
  }
});

test('closed benchmark gate exits 0 with SKIPPED_WITH_CAVEAT and no renderers', async () => {
  const result = await runNativeRenderingBenchmark({
    env: {},
    importNativeRenderers: async () => {
      throw new Error('native imports should stay closed');
    },
  });

  assert.equal(result.exitCode, 0);
  assert.equal(result.status, 'SKIPPED_WITH_CAVEAT');
  assert.match(result.caveats.join('\n'), /PHASE12_RUN_NATIVE_BENCHMARK is closed/);
});

test('open benchmark gate fails closed with BLOCKED when prerequisites are missing', async () => {
  const result = await runNativeRenderingBenchmark({
    env: { PHASE12_RUN_NATIVE_BENCHMARK: '1' },
    context: {
      node: 'v24.13.0',
      npm: '11.6.2',
      nvmrc: '20',
      lockfileVersion: 3,
      nodeMajorMatchesNvmrc: false,
      nodeModules: false,
      sourceGenerated: false,
      staticExportOutput: false,
      nativeDependencyVersions: {},
    },
  });

  assert.equal(result.exitCode, 1);
  assert.equal(result.status, 'BLOCKED');
  assert.match(result.caveats.join('\n'), /requires Node 20/);
  assert.match(result.caveats.join('\n'), /node_modules is absent/);
});

test('injected renderer fixtures produce D-12 benchmark result rows', async () => {
  const fixtures = createBenchmarkFixtures();
  const rows = [];

  for (const fixture of fixtures) {
    rows.push(
      await runBenchmarkFixture(fixture, {
        now: (() => {
          let value = 100;
          return () => {
            value += 5;
            return value;
          };
        })(),
        renderers: {
          renderOgWebpBuffer: async () => Buffer.from('webp'),
          renderBlogThumbnailSvg: async () => '<svg />',
          renderBlogThumbnailPngResponse: async () => ({
            arrayBuffer: async () => new Uint8Array([1, 2, 3]).buffer,
          }),
        },
        getNativeRenderFontStatus: () => ({
          cacheState: 'warm',
          version: 'native-fonts-2026-06-12',
          fonts: [],
        }),
      }),
    );
  }

  assert.ok(rows.length >= 4);
  assert.ok(rows.some((row) => row.renderer === 'canvas-sharp-webp'));
  assert.ok(rows.some((row) => row.renderer === 'satori-svg'));
  assert.ok(rows.some((row) => row.renderer === 'next-image-response-png'));
  assert.ok(rows.some((row) => row.lang === 'zh-cn'));
  assert.ok(rows.some((row) => row.category === 'what-is'));
  assert.ok(rows.some((row) => row.format === 'png' && row.dpr === 3));

  for (const row of rows) {
    assert.equal(row.status, 'PASS');
    assert.equal(typeof row.fixtureKey, 'string');
    assert.equal(typeof row.width, 'number');
    assert.equal(typeof row.height, 'number');
    assert.equal(typeof row.dpr, 'number');
    assert.equal(typeof row.durationMs, 'number');
    assert.equal(typeof row.bytes, 'number');
    assert.equal(row.fontCache, 'warm');
    assert.ok(Array.isArray(row.caveats));
  }
});
