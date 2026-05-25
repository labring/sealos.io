import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const configDir = dirname(fileURLToPath(import.meta.url));
const apps = JSON.parse(readFileSync(join(configDir, 'apps.json'), 'utf8'));
const loaderSource = readFileSync(join(configDir, 'apps-loader.ts'), 'utf8');
const appsSource = readFileSync(join(configDir, 'apps.ts'), 'utf8');

const legacySlugExpectations = new Map([
  ['reactive-resume', 'Reactive-Resume'],
  ['readeck', 'Readeck'],
  ['ruiqi-waf', 'Ruiqi-Waf'],
]);

test('app data keeps every canonical slug lowercase kebab-case', () => {
  assert.ok(apps.length >= 149);

  const slugs = new Set();
  for (const app of apps) {
    assert.match(app.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/u, app.slug);
    assert.equal(slugs.has(app.slug), false, `duplicate slug: ${app.slug}`);
    slugs.add(app.slug);
  }
});

test('legacy mixed-case slugs map to lowercase canonical slugs', () => {
  for (const [canonicalSlug, legacySlug] of legacySlugExpectations) {
    const app = apps.find((item) => item.slug === canonicalSlug);
    assert.ok(app, `missing canonical app: ${canonicalSlug}`);
    assert.equal(app.templateName, legacySlug);
    assert.deepEqual(app.legacySlugs, [legacySlug]);
  }
});

test('app data has the SEO-critical fields required for indexable detail pages', () => {
  for (const app of apps) {
    assert.ok(app.description?.trim(), `missing description: ${app.slug}`);
    assert.ok(app.icon?.trim(), `missing icon: ${app.slug}`);
    assert.ok(app.readme?.trim(), `missing readme: ${app.slug}`);
    assert.ok(
      Array.isArray(app.tags) && app.tags.length > 0,
      `missing tags: ${app.slug}`,
    );
    assert.ok(
      Array.isArray(app.screenshots) && app.screenshots.length > 0,
      `missing screenshots: ${app.slug}`,
    );
    assert.ok(
      app.i18n?.zh?.description?.trim(),
      `missing zh description: ${app.slug}`,
    );
  }
});

test('external app URLs are explicit safe HTTP(S) URLs', () => {
  for (const app of apps) {
    for (const field of ['website', 'github', 'readme']) {
      if (!app[field]) continue;
      assert.match(
        app[field],
        /^https?:\/\//i,
        `${app.slug}.${field}: ${app[field]}`,
      );
    }
  }
});

test('runtime app lookup and generated links understand canonical and legacy slugs', () => {
  assert.match(loaderSource, /matchesAppSlug/);
  assert.match(loaderSource, /legacySlugs\?\.some/);
  assert.match(loaderSource, /getTemplateName/);
  assert.match(appsSource, /getTemplateName/);
  assert.match(appsSource, /matchesAppSlug/);
});
