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

test('both Footer implementations put Skills above Templates in Products', () => {
  for (const { filePath, source } of footerSources) {
    const productsBlock = source.match(
      /products:\s*\{[\s\S]*?\n\s*\},\n\s*services:/,
    )?.[0];

    assert.ok(productsBlock, `${filePath} must define a Products category`);
    assert.match(productsBlock, /textKey: 'skills'[\s\S]*textKey: 'templates'/);
    assert.match(
      productsBlock,
      /urlKey: 'skillsUrl'[\s\S]*urlKey: 'templatesUrl'/,
    );
    assert.equal(
      (productsBlock.match(/textKey:/g) ?? []).length,
      2,
      `${filePath} Products must contain Skills and Templates only`,
    );
    assert.match(source, /skillsUrl: '\/sealos-skills'/);
    assert.match(source, /templatesUrl: '\/products\/app-store'/);
    assert.doesNotMatch(source, /appStore|devbox|databases/i);
  }
});
