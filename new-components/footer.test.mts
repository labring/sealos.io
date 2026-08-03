import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const footerSources = [
  join(root, 'Footer', 'index.tsx'),
  join(root, '..', 'components', 'footer', 'index.tsx'),
].map((filePath) => ({
  filePath,
  source: readFileSync(filePath, 'utf8'),
}));

test('both Footer implementations keep only App Store in Products', () => {
  for (const { filePath, source } of footerSources) {
    assert.match(
      source,
      /products:\s*\{\s*titleKey: 'productsTitle',\s*links:\s*\[\s*\{\s*textKey: 'appStore',\s*urlKey: 'appStoreUrl'(?:,\s*isExternal: (?:true|false))?\s*\},?\s*\],/,
      `${filePath} Products must contain only App Store`,
    );
    assert.match(source, /appStoreUrl: '\/products\/app-store'/);
    assert.doesNotMatch(source, /devbox|databases/i);
  }
});
