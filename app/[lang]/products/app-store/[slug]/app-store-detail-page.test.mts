import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const source = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), 'page.tsx'),
  'utf8',
);

test('app store detail page uses the redesigned dark shell and home footer', () => {
  assert.match(source, /import \{ Footer \} from '@\/new-components\/Footer'/);
  assert.match(source, /BottomLightImage/);
  assert.match(source, /appStoreDetailBackgroundVars/);
  assert.match(source, /data-theme="app-store"/);
  assert.match(source, /className="[^"]*isolate[^"]*"/);
  assert.doesNotMatch(source, /import Footer from '@\/components\/footer'/);
  assert.doesNotMatch(source, /@\/components\/header\/hero/);
});

test('app store detail page renders redesigned Figma sections', () => {
  assert.match(source, /AppDetailHero/);
  assert.match(source, /WhyDeployOnSealos/);
  assert.match(source, /WholeStackSection/);
  assert.match(source, /ReadmePreview/);
  assert.match(source, /RelatedTemplates/);
});

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

test('README fallback communicates unavailable content while keeping app preview visible', () => {
  assert.match(readmeWindowSource, /ReadmeUnavailableNotice/);
  assert.match(readmeWindowSource, /README preview is unavailable/);
  assert.match(readmeWindowSource, /app preview visible/);
  assert.match(readmeWindowSource, /src=\{screenshot\}/);
  assert.match(readmeWindowSource, /alt=\{`\$\{app\.name\} screenshot`\}/);
});

test('app store detail page tightens mobile shell and footer spacing', () => {
  assert.match(source, /min-h-\[100dvh\]/);
  assert.match(source, /pt-4 sm:pt-8/);
  assert.match(
    source,
    /h-\[520px\] sm:mt-\[80px\] sm:mb-\[400px\] sm:h-\[800px\]/,
  );
});
