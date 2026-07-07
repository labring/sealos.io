import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const source = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), 'hero-supporting-proof.tsx'),
  'utf8',
);
const logoLoopSource = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), 'logo-loop.tsx'),
  'utf8',
);
const cssSource = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), 'logo-loop.module.css'),
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
  assert.match(source, /<LogoLoop/);
  assert.match(source, /logos=\{adopters\}/);
  assert.doesNotMatch(source, /src="\/logo\.svg"/);
  assert.match(source, /\/images\/logos\/github\.svg/);
  assert.match(source, /\/images\/logos\/fastgpt\.svg/);
  assert.match(source, /\/images\/logos\/jetbrains\.svg/);
  assert.match(source, /\/images\/logos\/teable\.svg/);
  assert.match(logoLoopSource, /requestAnimationFrame/);
  assert.match(logoLoopSource, /ResizeObserver/);
  assert.match(cssSource, /\.fade::before/);
  assert.match(cssSource, /--logoloop-fadeColor/);
});
