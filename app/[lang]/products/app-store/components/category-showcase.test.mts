import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const source = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), 'category-showcase.tsx'),
  'utf8',
);

test('category showcase keeps a dedicated horizontal scroll viewport', () => {
  assert.match(source, /data-testid="category-showcase-scroll"/);
  assert.match(source, /overflow-x-auto/);
  assert.match(source, /snap-x/);
});

test('category showcase fade overlay does not block carousel interaction', () => {
  assert.match(source, /data-testid="category-showcase-fade"/);
  assert.match(source, /pointer-events-none/);
});
