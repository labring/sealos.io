import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const sectionDir = dirname(fileURLToPath(import.meta.url));
const sectionSource = readFileSync(
  join(sectionDir, 'brain-caps-section.tsx'),
  'utf8',
);
const scrollStackSource = readFileSync(
  join(sectionDir, 'scroll-stack.tsx'),
  'utf8',
);
const pageSource = readFileSync(join(sectionDir, '..', 'page.tsx'), 'utf8');
const packageSource = readFileSync(
  join(sectionDir, '..', '..', '..', '..', '..', 'package.json'),
  'utf8',
);

test('BrainCapsSection is mounted after TerminalAgentSection', () => {
  assert.match(pageSource, /import \{ BrainCapsSection \}/);
  assert.match(pageSource, /<TerminalAgentSection \/>\s*<BrainCapsSection \/>/);
});

test('BrainCapsSection keeps copy and previews data-driven', () => {
  assert.match(sectionSource, /'use client'/);
  assert.match(sectionSource, /const brainCaps(: BrainCap\[\])? = \[/);
  assert.match(sectionSource, /Eight things you usually duct-tape together/);
  assert.match(sectionSource, /Live Object Canvas/);
  assert.match(sectionSource, /Auto Env Injection/);
  assert.match(sectionSource, /Built-in DB Studio/);
  assert.match(sectionSource, /DevBox \+ Local IDE/);
  assert.match(sectionSource, /Source - Available Core/);
  assert.match(sectionSource, /brainCaps\.map/);
  assert.match(sectionSource, /activeIndex/);
});

test('BrainCapsSection is one sticky scroll story', () => {
  assert.match(sectionSource, /sectionRef/);
  assert.match(sectionSource, /addEventListener\('scroll'/);
  assert.match(sectionSource, /sticky top-0/);
  assert.match(sectionSource, /getCopyStyle\(index, activeIndex\)/);
  assert.match(sectionSource, /pointerEvents/);
  assert.match(sectionSource, /zIndex: isFuture \? 0 : brainCaps\.length - clampedDepth/);
  assert.match(sectionSource, /translate3d\(0,/);
  assert.doesNotMatch(sectionSource, /<ScrollStack/);
});

test('lenis is installed as the ScrollStack runtime dependency', () => {
  const pkg = JSON.parse(packageSource);
  assert.equal(typeof pkg.dependencies.lenis, 'string');
});
