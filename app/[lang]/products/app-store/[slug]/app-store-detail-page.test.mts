import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const source = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), 'page.tsx'),
  'utf8',
);

test('app store detail page preserves canonical SEO and legacy slug compatibility', () => {
  assert.match(source, /StructuredDataComponent/);
  assert.match(source, /generateAppDetailSoftwareSchema/);
  assert.match(source, /generateBreadcrumbSchema/);
  assert.match(source, /getAppDetailMetadata/);
  assert.match(source, /getAppDetailPathname\(app.slug\)/);
  assert.match(source, /getTemplateName\(app\)/);
  assert.match(source, /legacySlugs/);
  assert.match(source, /\[app.slug, ...\(app.legacySlugs \|\| \[\]\)\]/);
});

const componentDir = dirname(fileURLToPath(import.meta.url));
const loadingSource = readFileSync(join(componentDir, 'loading.tsx'), 'utf8');
const errorSource = readFileSync(join(componentDir, 'error.tsx'), 'utf8');
const notFoundSource = readFileSync(
  join(componentDir, 'not-found.tsx'),
  'utf8',
);
const readmeWindowSource = readFileSync(
  join(componentDir, 'components', 'ReadmeMarkdownWindow.tsx'),
  'utf8',
);

test('app store detail route has designed loading, error, and not-found states', () => {
  assert.match(loadingSource, /variant="loading"/);
  assert.match(errorSource, /'use client'/);
  assert.match(errorSource, /variant="error"/);
  assert.match(errorSource, /reset/);
  assert.match(notFoundSource, /variant="not-found"/);
  assert.match(notFoundSource, /Back to App Store/);
});

test('README fallback communicates unavailable content with repository guidance', () => {
  assert.match(readmeWindowSource, /ReadmeUnavailableNotice/);
  assert.match(readmeWindowSource, /README preview is unavailable/);
  assert.match(readmeWindowSource, /role="status"/);
  assert.match(
    readmeWindowSource,
    /repository for setup and configuration\s+instructions/,
  );
});
