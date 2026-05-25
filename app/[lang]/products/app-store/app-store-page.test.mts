import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const source = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), 'page.tsx'),
  'utf8',
);

const contentSource = readFileSync(
  join(
    dirname(fileURLToPath(import.meta.url)),
    'components',
    'app-store-content.tsx',
  ),
  'utf8',
);

test('app store page uses the home footer implementation', () => {
  assert.match(source, /import \{ Footer \} from '@\/new-components\/Footer'/);
  assert.match(source, /BottomLightImage/);
  assert.doesNotMatch(source, /import Footer from '@\/components\/footer'/);
  assert.doesNotMatch(source, /FooterTransition/);
});

test('app store page does not hide the home footer Sealos word layer', () => {
  assert.doesNotMatch(source, /className="[^"]*overflow-hidden[^"]*"/);
  assert.match(source, /className="[^"]*isolate[^"]*"/);
});

test('app store page injects SEO and GEO structured data', () => {
  assert.match(source, /StructuredDataComponent/);
  assert.match(source, /generateAppStoreCollectionSchema/);
  assert.match(source, /generateAppStoreSoftwareSchema/);
  assert.match(source, /generateFAQSchema/);
  assert.match(source, /generateBreadcrumbSchema/);
  assert.match(source, /appStoreFaqItems\[params.lang\]/);
  assert.match(source, /APP_STORE_TITLE/);
  assert.match(source, /appStoreKeywords/);
});

test('app store content includes a quotable definition block', () => {
  assert.match(contentSource, /AppStoreDefinition/);
  assert.match(contentSource, /<AppStoreDefinition lang=\{lang\} \/>/);
});

const loadingSource = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), 'loading.tsx'),
  'utf8',
);
const errorSource = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), 'error.tsx'),
  'utf8',
);
const statePanelSource = readFileSync(
  join(
    dirname(fileURLToPath(import.meta.url)),
    'components',
    'app-store-state-panel.tsx',
  ),
  'utf8',
);

test('app store page has designed loading and error state entrypoints', () => {
  assert.match(loadingSource, /AppStoreStatePanel/);
  assert.match(loadingSource, /variant="loading"/);
  assert.match(errorSource, /'use client'/);
  assert.match(errorSource, /variant="error"/);
  assert.match(errorSource, /reset/);
});

test('app store state panel supports all marketplace state variants with Radix icons', () => {
  assert.match(statePanelSource, /AppStoreStateVariant/);
  assert.match(statePanelSource, /'loading'/);
  assert.match(statePanelSource, /'empty'/);
  assert.match(statePanelSource, /'no-results'/);
  assert.match(statePanelSource, /'error'/);
  assert.match(statePanelSource, /'not-found'/);
  assert.match(statePanelSource, /@radix-ui\/react-icons/);
  assert.match(statePanelSource, /LoadingSkeleton/);
});

test('app store page tightens mobile shell and footer spacing', () => {
  assert.match(source, /min-h-\[100dvh\]/);
  assert.match(source, /pt-4 sm:pt-8/);
  assert.match(
    source,
    /h-\[520px\] sm:mt-\[80px\] sm:mb-\[400px\] sm:h-\[800px\]/,
  );
});
