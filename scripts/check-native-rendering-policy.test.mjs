import test from 'node:test';
import assert from 'node:assert/strict';
import {
  cp,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  validateNativeEnvironmentCaveats,
  validateNativeFontContract,
  validateNativePolicyConfig,
  validateNativeRenderingPolicy,
  validateNativeRoutePolicyAlignment,
} from './check-native-rendering-policy.js';

test('native rendering policy and docs define the Phase 12 contract', async () => {
  const [policyText, docsText] = await Promise.all([
    readFile('config/native-rendering-policy.json', 'utf8'),
    readFile('docs/native-rendering-policy.md', 'utf8'),
  ]);
  const policy = JSON.parse(policyText);
  const combined = `${policyText}\n${docsText}`;

  for (const token of [
    'public/generated/native-images',
    'out/generated/native-images',
    'public, max-age=86400',
    'fully versioned static artifact',
    'NATIVE-01',
    'PERF-501',
    'PERF-502',
    'og-native-rendering',
  ]) {
    assert.match(combined, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  assert.deepEqual(policy.cacheKeys.requiredDimensions, [
    'imageType',
    'language',
    'slug',
    'dimensions',
    'dpr',
    'format',
    'rendererVersion',
    'templateVersion',
    'fontVersion',
  ]);

  assert.ok(
    policy.surfaces.some(
      (surface) =>
        surface.imageType === 'homepage-og' &&
        surface.format === 'webp' &&
        surface.sourceFile === 'app/api/og/route.ts',
    ),
  );
  assert.ok(
    policy.surfaces.some(
      (surface) =>
        surface.imageType === 'blog-thumbnail' &&
        surface.format === 'svg' &&
        surface.sourceFile ===
          'app/api/blog/[lang]/[slug]/thumbnail/[format]/route.ts',
    ),
  );
  assert.ok(
    policy.surfaces.some(
      (surface) =>
        surface.imageType === 'blog-thumbnail' &&
        surface.format === 'png' &&
        surface.sourceFile ===
          'app/api/blog/[lang]/[slug]/thumbnail/[format]/route.ts',
    ),
  );

  for (const phase of ['Phase 9', 'Phase 10', 'Phase 13']) {
    assert.match(docsText, new RegExp(phase));
  }
});

test('validateNativeRenderingPolicy accepts the repository source contract', () => {
  const result = validateNativeRenderingPolicy();

  assert.equal(result.status, 'PASS');
  assert.deepEqual(result.failures, []);
  assert.equal(result.policy.status, 'PASS');
  assert.equal(result.routePolicy.status, 'PASS');
  assert.equal(result.fonts.status, 'PASS');
  assert.equal(result.environment.status, 'PASS_WITH_CAVEATS');
});

test('fixture policies fail closed for required rows and cache-key drift', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'phase12-policy-'));

  try {
    await copyRepositoryFixture(dir);
    const policyPath = join(dir, 'config/native-rendering-policy.json');
    const policy = JSON.parse(await readFile(policyPath, 'utf8'));

    policy.surfaces = policy.surfaces.filter(
      (surface) => surface.id !== 'homepage-og-webp',
    );
    await writeFile(policyPath, JSON.stringify(policy, null, 2));
    assert.match(
      validateNativePolicyConfig({ rootDir: dir }).failures.join('\n'),
      /missing required surface homepage-og-webp/,
    );

    await copyRepositoryFixture(dir);
    const cachePolicy = JSON.parse(await readFile(policyPath, 'utf8'));
    cachePolicy.cacheKeys.requiredDimensions =
      cachePolicy.cacheKeys.requiredDimensions.filter(
        (field) => field !== 'fontVersion',
      );
    await writeFile(policyPath, JSON.stringify(cachePolicy, null, 2));
    assert.match(
      validateNativePolicyConfig({ rootDir: dir }).failures.join('\n'),
      /cacheKeys\.requiredDimensions missing fontVersion/,
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('fixture policies fail closed for route ownership, fonts, and validation commands', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'phase12-route-font-'));

  try {
    await copyRepositoryFixture(dir);
    const routePolicyPath = join(dir, 'config/static-export-route-policy.json');
    const routePolicy = JSON.parse(await readFile(routePolicyPath, 'utf8'));
    routePolicy.routes.find((row) => row.routePath === '/api/og').budgetOwner =
      'phase-10-static-export';
    await writeFile(routePolicyPath, JSON.stringify(routePolicy, null, 2));
    assert.match(
      validateNativeRoutePolicyAlignment({ rootDir: dir }).failures.join('\n'),
      /budgetOwner must be phase-12-native-rendering/,
    );

    await copyRepositoryFixture(dir);
    const policyPath = join(dir, 'config/native-rendering-policy.json');
    const fontPolicy = JSON.parse(await readFile(policyPath, 'utf8'));
    fontPolicy.fonts = fontPolicy.fonts.filter(
      (font) => font.path !== 'fonts/arial.ttf',
    );
    await writeFile(policyPath, JSON.stringify(fontPolicy, null, 2));
    assert.match(
      validateNativeFontContract({ rootDir: dir }).failures.join('\n'),
      /missing required font fonts\/arial\.ttf/,
    );

    await copyRepositoryFixture(dir);
    const commandPolicy = JSON.parse(await readFile(policyPath, 'utf8'));
    commandPolicy.validationCommands =
      commandPolicy.validationCommands.filter(
        (command) => command !== 'npm run native-rendering:check',
      );
    await writeFile(policyPath, JSON.stringify(commandPolicy, null, 2));
    assert.match(
      validateNativePolicyConfig({ rootDir: dir }).failures.join('\n'),
      /validationCommands missing npm run native-rendering:check/,
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('environment caveats report current shell blockers without failing source validation', () => {
  const result = validateNativeEnvironmentCaveats({
    rootDir: process.cwd(),
    env: { PATH: '' },
    nodeVersion: 'v24.13.0',
  });

  assert.equal(result.status, 'PASS_WITH_CAVEATS');
  assert.match(result.caveats.join('\n'), /active Node v24\.13\.0/);
  assert.match(result.caveats.join('\n'), /\.nvmrc requires 20/);
  assert.match(result.caveats.join('\n'), /node_modules is absent/);
  assert.match(result.caveats.join('\n'), /\.source is absent/);
  assert.match(result.caveats.join('\n'), /out is absent/);
  assert.match(result.caveats.join('\n'), /Docker CLI is unavailable/);
});

test('native rendering helpers expose cache, font, OG, and blog contracts', async () => {
  const [
    cacheKeyText,
    fontsText,
    ogRendererText,
    blogRendererText,
  ] = await Promise.all([
    readFile('lib/native-rendering/cache-key.ts', 'utf8'),
    readFile('lib/native-rendering/fonts.ts', 'utf8'),
    readFile('lib/native-rendering/og-renderer.ts', 'utf8'),
    readFile('lib/native-rendering/blog-thumbnail-renderer.tsx', 'utf8'),
  ]);

  assert.match(cacheKeyText, /buildNativeImageCacheKey/);
  assert.match(
    cacheKeyText,
    /imageType[\s\S]*language[\s\S]*slug[\s\S]*dimensions[\s\S]*dpr[\s\S]*format[\s\S]*rendererVersion[\s\S]*templateVersion[\s\S]*fontVersion/,
  );

  for (const token of [
    'getNativeRenderFonts',
    'getNativeRenderFontStatus',
    'expectedBytes: 915212',
    'expectedBytes: 57448',
    'expectedBytes: 10541596',
    'NotoSansSC-Black.ttf',
    'cold',
    'warm',
  ]) {
    assert.match(fontsText, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  for (const token of [
    'renderOgPngBuffer',
    'renderOgWebpBuffer',
    'OG_RENDER_DIMENSIONS',
    'quality: 90',
    'width: 1200',
    'height: 630',
  ]) {
    assert.match(ogRendererText, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  for (const token of [
    'parseBlogThumbnailFormat',
    'getBlogThumbnailStaticParams',
    'renderBlogThumbnailSvg',
    'renderBlogThumbnailPngResponse',
    'PREGENERATED_FORMATS',
    'ImageResponse',
    'MAX_DPR = 3',
    'MAX_DIM = 4000',
  ]) {
    assert.match(blogRendererText, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('native rendering routes delegate to shared helper adapters', async () => {
  const [ogRoute, blogRoute] = await Promise.all([
    readFile('app/api/og/route.ts', 'utf8'),
    readFile(
      'app/api/blog/[lang]/[slug]/thumbnail/[format]/route.ts',
      'utf8',
    ),
  ]);

  assert.match(ogRoute, /renderOgWebpBuffer/);
  assert.match(ogRoute, /Content-Type': OG_RENDER_DIMENSIONS\.contentType/);
  assert.match(ogRoute, /Cache-Control': OG_RENDER_DIMENSIONS\.cacheControl/);

  for (const token of [
    'parseBlogThumbnailFormat',
    'getBlogThumbnailStaticParams',
    'renderBlogThumbnailSvg',
    'renderBlogThumbnailPngResponse',
  ]) {
    assert.match(blogRoute, new RegExp(token));
  }

  assert.match(blogRoute, /Invalid format\. Use <width>x<height>\[@dpr\]\.\(png\|svg\)/);
  assert.match(blogRoute, /Blog post not found/);
  assert.match(blogRoute, /image\/svg\+xml/);
});

async function copyRepositoryFixture(dir) {
  const files = [
    'config/native-rendering-policy.json',
    'config/static-export-route-policy.json',
    'app/api/og/route.ts',
    'app/api/blog/[lang]/[slug]/thumbnail/[format]/route.ts',
    'package.json',
    'package-lock.json',
    '.nvmrc',
    'fonts/arial.ttf',
    'fonts/arial-bold.ttf',
    'fonts/NotoSansSC-Black.ttf',
    'app/api/blog/[lang]/[slug]/thumbnail/[format]/bgs/AppDeploymentBg.tsx',
    'app/api/blog/[lang]/[slug]/thumbnail/[format]/bgs/AppStoreChoicesBg.tsx',
    'app/api/blog/[lang]/[slug]/thumbnail/[format]/bgs/BestPracticesBg.tsx',
    'app/api/blog/[lang]/[slug]/thumbnail/[format]/bgs/TechComparedBg.tsx',
    'app/api/blog/[lang]/[slug]/thumbnail/[format]/bgs/WhatIsBg.tsx',
  ];

  for (const file of files) {
    await mkdir(join(dir, file, '..'), { recursive: true });
    await cp(file, join(dir, file));
  }
}
