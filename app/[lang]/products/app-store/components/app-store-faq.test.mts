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
  assert.match(source, /GradientText/);
  assert.match(source, /to-\[#146dff\]/);
});

test('app store FAQ expanded background is applied to the whole item', () => {
  assert.match(source, /data-\[state=open\]:bg-white\/\[0\.05\]/);
  assert.doesNotMatch(source, /index === 0 && 'bg-white\/\[0\.035\]'/);
});

test('app store FAQ arrow keeps the default color until the item is open', () => {
  assert.match(source, /\[\&>svg\]:text-zinc-500/);
  assert.match(source, /\[\&\[data-state=open\]>svg\]:text-\[#146DFF\]/);
});

test('app store FAQ uses app-store intent instead of pricing FAQ content', () => {
  assert.match(source, /appStoreFaqItems/);
  assert.match(source, /one-click app deployment/);
  assert.doesNotMatch(source, /pricing\/config\/faqs/);
});
