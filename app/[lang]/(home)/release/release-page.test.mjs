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
const snapshot = JSON.parse(
  readFileSync(join(routeDir, 'releases-snapshot.json'), 'utf8'),
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
const forcedDarkModeSource = readFileSync(
  join(root, 'app', '[lang]', 'utils', 'is-forced-dark-mode.ts'),
  'utf8',
);

test('release route is present under the shared home shell', () => {
  assert.equal(existsSync(join(routeDir, 'page.tsx')), true);
  assert.match(pageSource, /PageTopRays/);
  assert.match(pageSource, /GradientText/);
  assert.match(pageSource, /<ReleasesTimeline \/>/);
  assert.equal((pageSource.match(/<h1\b/g) ?? []).length, 1);
});

test('release timeline server-renders the committed snapshot', () => {
  assert.match(timelineSource, /releases-snapshot\.json/);
  assert.match(
    timelineSource,
    /useState<DisplayRelease\[\]>\s*\(\s*initialReleases\s*\)/,
  );
  assert.doesNotMatch(timelineSource, /ReleaseSkeleton/);
  assert.equal(
    snapshot.length > 1,
    true,
    'snapshot must hold several releases',
  );
  assert.equal(snapshot[0].version, 'v2.0.14');
  for (const entry of snapshot) {
    for (const field of ['version', 'publishedAt', 'href', 'body']) {
      assert.equal(typeof entry[field], 'string');
    }
  }
});

test('release timeline refreshes live from GitHub and keeps the snapshot on failure', () => {
  assert.match(timelineSource, /'use client'/);
  assert.match(
    timelineSource,
    /https:\/\/api\.github\.com\/repos\/labring\/brain\/releases/,
  );
  assert.match(timelineSource, /useEffect/);
  assert.match(timelineSource, /AbortController/);
  assert.match(timelineSource, /draft/);
  assert.match(timelineSource, /prerelease/);
  // Silent fallback: on failure the snapshot stays and no notice is shown.
  assert.doesNotMatch(timelineSource, /Live release updates are unavailable/);
  assert.doesNotMatch(timelineSource, /isUsingFallback/);
});

test('release timeline renders release bodies as markdown', () => {
  assert.match(timelineSource, /ReactMarkdown/);
  assert.match(timelineSource, /remarkGfm/);
  assert.match(timelineSource, /tag_name/);
  assert.match(timelineSource, /published_at/);
  assert.match(timelineSource, /html_url/);
});

test('release snapshot can be regenerated via the refresh script', () => {
  const packageJson = JSON.parse(
    readFileSync(join(root, 'package.json'), 'utf8'),
  );
  assert.equal(
    packageJson.scripts['releases:refresh'],
    'node scripts/generate-release-snapshot.mjs',
  );
  assert.equal(
    existsSync(join(root, 'scripts', 'generate-release-snapshot.mjs')),
    true,
  );
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

test('release route inherits the site forced-dark mode', () => {
  assert.match(forcedDarkModeSource, /path: '\/release',\s*match: 'prefix'/);
});

test('release is registered for default locale rewrites and sitemap discovery', () => {
  assert.match(localeRoutesSource, /'\/release'/);
  assert.match(sitemapSource, /'\/release'/);
});
