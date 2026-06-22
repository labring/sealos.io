import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const source = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), 'app-store-hero.tsx'),
  'utf8',
);

test('hero title matches the Figma gradient treatment and scale', () => {
  assert.match(source, /GradientText/);
  assert.match(source, /to-\[#146DFF\]/);
  assert.match(source, /lg:text-\[36px\]/);
  assert.doesNotMatch(source, /text-\[#6ea2ff\]/);
  assert.doesNotMatch(source, /lg:text-\[52px\]/);
  assert.doesNotMatch(source, /xl:text-\[56px\]/);
});

test('hero search field uses the neutral Figma surface color', () => {
  const labelClass = source.match(
    /<label\s+htmlFor="hero-app-search"\s+className="([^"]+)"/,
  )?.[1];

  assert.ok(labelClass);
  assert.match(labelClass, /border-\[#46464A\]/);
  assert.match(labelClass, /bg-\[#121214\]/);
  assert.doesNotMatch(labelClass, /bg-\[#111318\]/);
  assert.doesNotMatch(labelClass, /bg-\[#13161c\]/);
  assert.doesNotMatch(labelClass, /border-white\/10/);
  assert.match(source, /placeholder:text-\[#6B6B72\]/);
});
