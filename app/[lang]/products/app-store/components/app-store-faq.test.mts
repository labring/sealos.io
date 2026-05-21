import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const source = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), 'app-store-faq.tsx'),
  'utf8',
);

test('app store FAQ title uses the Figma gradient treatment', () => {
  assert.match(source, /from-white/);
  assert.match(source, /to-\[#146dff\]/);
  assert.match(source, /bg-clip-text/);
  assert.match(source, /text-transparent/);
});

test('app store FAQ expanded background is applied to the whole item', () => {
  assert.match(source, /data-\[state=open\]:bg-white\/\[0\.05\]/);
  assert.doesNotMatch(source, /index === 0 && 'bg-white\/\[0\.035\]'/);
});
