import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const root = process.cwd();
const routeDir = join(root, 'app', '[lang]', '(home)', 'release');
const pageSource = readFileSync(join(routeDir, 'page.tsx'), 'utf8');
const timelineSource = readFileSync(
  join(routeDir, 'components', 'ReleasesTimeline.tsx'),
  'utf8',
);
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
  assert.match(pageSource, /<ReleasesTimeline \/>/);
  assert.equal((pageSource.match(/<h1\b/g) ?? []).length, 1);
});

test('release timeline fetches live releases from GitHub on the client', () => {
  assert.match(timelineSource, /'use client'/);
  assert.match(
    timelineSource,
    /https:\/\/api\.github\.com\/repos\/labring\/brain\/releases/,
  );
  assert.match(timelineSource, /useEffect/);
  assert.match(timelineSource, /AbortController/);
  assert.match(timelineSource, /draft/);
  assert.match(timelineSource, /prerelease/);
  assert.match(timelineSource, /aria-busy/);
});

test('release timeline renders release bodies as markdown', () => {
  assert.match(timelineSource, /ReactMarkdown/);
  assert.match(timelineSource, /remarkGfm/);
  assert.match(timelineSource, /tag_name/);
  assert.match(timelineSource, /published_at/);
  assert.match(timelineSource, /html_url/);
});

test('release timeline keeps a cached fallback for API failures', () => {
  assert.match(timelineSource, /FALLBACK_RELEASES/);
  assert.match(timelineSource, /v2\.0\.14/);
  assert.match(timelineSource, /releases\/tag\/v2\.0\.14/);
  assert.match(timelineSource, /### Added/);
  assert.match(timelineSource, /### Changed/);
  assert.match(timelineSource, /### Fixed/);
  assert.match(timelineSource, /### Upgrade notes/);
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
