import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const root = process.cwd();
const routeDir = join(root, 'app', '[lang]', '(home)', 'release');
const pageSource = readFileSync(join(routeDir, 'page.tsx'), 'utf8');
const headerSource = readFileSync(
  join(root, 'new-components', 'Header.tsx'),
  'utf8',
);
const footerSource = readFileSync(
  join(root, 'new-components', 'Footer', 'index.tsx'),
  'utf8',
);
const localeRoutesSource = readFileSync(
  join(root, 'config', 'default-locale-routes.mjs'),
  'utf8',
);
const sitemapSource = readFileSync(join(root, 'app', 'sitemap.ts'), 'utf8');

test('release route is present under the shared home shell', () => {
  assert.equal(existsSync(join(routeDir, 'page.tsx')), true);
  assert.match(pageSource, /PageTopRays/);
  assert.match(pageSource, /GradientText/);
  assert.equal((pageSource.match(/<h1\b/g) ?? []).length, 1);
});

test('release page documents Brain v2.0.14 in scannable categories', () => {
  for (const label of [
    'Product releases',
    'Brain',
    'v2.0.14',
    'September 10, 2026',
    'Added',
    'Changed',
    'Fixed',
    'Upgrade notes',
    'Release assets',
  ]) {
    assert.match(
      pageSource,
      new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
    );
  }

  assert.match(
    pageSource,
    /https:\/\/github\.com\/labring\/brain\/releases\/tag\/v2\.0\.14/,
  );
  assert.match(pageSource, /target="_blank"/);
  assert.match(pageSource, /rel="noopener noreferrer"/);
});

test('release page metadata follows the localized page contract', () => {
  assert.match(pageSource, /generatePageMetadata/);
  assert.match(pageSource, /pathname: '\/release'/);
  assert.match(pageSource, /lang: params\.lang/);
});

test('release is discoverable from active navigation and footer resources', () => {
  assert.match(headerSource, /text: 'Releases'/);
  assert.match(headerSource, /url: '\/release'/);
  assert.match(footerSource, /textKey: 'releases', urlKey: 'releasesUrl'/);
  assert.match(footerSource, /releases: 'Releases'/);
  assert.match(footerSource, /releasesUrl: '\/release'/);
});

test('release is registered for default locale rewrites and sitemap discovery', () => {
  assert.match(localeRoutesSource, /'\/release'/);
  assert.match(sitemapSource, /'\/release'/);
});
