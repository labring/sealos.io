import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const appStoreDir = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(appStoreDir, 'app-store-seo.ts'), 'utf8');
const sitemapSource = readFileSync(
  join(appStoreDir, '..', '..', '..', 'sitemap.ts'),
  'utf8',
);

test('app store SEO module targets one-click self-hosted Kubernetes template intent', () => {
  assert.match(source, /one-click app deployment/);
  assert.match(source, /self-hosted app store/);
  assert.match(source, /Kubernetes app templates/);
  assert.match(
    source,
    /one-click self-hosted application template marketplace/,
  );
});

test('app store SEO module generates rich-result schema for list and detail pages', () => {
  assert.match(source, /'@type': 'CollectionPage'/);
  assert.match(source, /'@type': 'ItemList'/);
  assert.match(source, /generateAppStoreSoftwareSchema/);
  assert.match(source, /generateAppDetailSoftwareSchema/);
  assert.match(source, /installUrl/);
  assert.match(source, /SoftwareApplication/);
});

test('app detail metadata uses canonical lowercase URLs and SEO-oriented titles', () => {
  assert.match(source, /slug\.toLowerCase\(\)/);
  assert.match(source, /Deploy \$\{app\.name\} on Sealos/);
  assert.match(source, /One-Click Self-Hosted App Template/);
  assert.match(source, /trimMetaDescription/);
});

test('sitemap emits canonical app detail paths through the SEO helper', () => {
  assert.match(sitemapSource, /getAppDetailPathname/);
  assert.match(sitemapSource, /getAppDetailPathname\(app\.slug\)/);
  assert.doesNotMatch(sitemapSource, /products\/app-store\/\$\{app\.slug\}/);
});
