import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

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
