import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const source = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), 'hero-supporting-proof.tsx'),
  'utf8',
);
const cssSource = readFileSync(
  join(
    dirname(fileURLToPath(import.meta.url)),
    'hero-supporting-proof.module.css',
  ),
  'utf8',
);

test('hero guarantees match the Figma row treatment', () => {
  assert.doesNotMatch(source, /bg-gradient-to-r from-white\/0/);
  assert.doesNotMatch(source, /ring-offset-black/);
  assert.match(source, /sm:gap-10/);
  assert.match(source, /items-center gap-2/);
  assert.match(source, /size-5/);
  assert.match(source, /text-blue-500/);
  assert.match(source, /<CircleCheckBigIcon\s+size=\{20\}/);
});

test('hero adoption strip stays inside the page container with edge fade', () => {
  assert.match(source, /w-full space-y-9/);
  assert.doesNotMatch(source, /px-4 xl:px-14\.25 2xl:px-15/);
  assert.match(source, /overflow-hidden/);
  assert.match(source, /style=\{\{ contain: 'paint' \}\}/);
  assert.match(cssSource, /-webkit-mask-image: linear-gradient/);
  assert.match(cssSource, /mask-image: linear-gradient/);
  assert.match(
    cssSource,
    /transparent,\s+black 8%,\s+black 92%,\s+transparent/,
  );
});
