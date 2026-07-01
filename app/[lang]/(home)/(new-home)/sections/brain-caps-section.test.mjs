import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const sectionDir = dirname(fileURLToPath(import.meta.url));
const sectionSource = readFileSync(
  join(sectionDir, 'brain-caps-section.tsx'),
  'utf8',
);
const scrollStackPath = join(sectionDir, 'scroll-stack.tsx');
const pageSource = readFileSync(join(sectionDir, '..', 'page.tsx'), 'utf8');
const packageSource = readFileSync(
  join(sectionDir, '..', '..', '..', '..', '..', 'package.json'),
  'utf8',
);

test('BrainCapsSection is mounted after TerminalAgentSection', () => {
  assert.match(pageSource, /import \{ BrainCapsSection \}/);
  assert.match(pageSource, /<TerminalAgentSection \/>\s*<BrainCapsSection \/>/);
});

test('BrainCapsSection keeps accordion copy data-driven', () => {
  assert.match(sectionSource, /'use client'/);
  assert.match(sectionSource, /const brainCaps(: BrainCap\[\])? = \[/);
  assert.match(sectionSource, /import \{ GradientText \}/);
  assert.match(sectionSource, /<GradientText>/);
  assert.match(sectionSource, /Eight things you usually duct-tape together/);
  assert.match(sectionSource, /Live Object Canvas/);
  assert.match(sectionSource, /Auto Env Injection/);
  assert.match(sectionSource, /Built-in DB Studio/);
  assert.match(sectionSource, /One-Click High Availability/);
  assert.match(sectionSource, /Source - Available Core/);
  assert.match(sectionSource, /brainCaps\.map/);
  assert.match(sectionSource, /activeIndex/);
  assert.doesNotMatch(sectionSource, /DevBox \+ Local IDE/);
});

test('BrainCapsSection uses a scroll-driven accordion and placeholder panel', () => {
  assert.match(
    sectionSource,
    /import \{ AnimatePresence, motion, type Transition \}/,
  );
  assert.match(sectionSource, /sectionRef/);
  assert.match(sectionSource, /addEventListener\('scroll'/);
  assert.match(sectionSource, /sticky top-0/);
  assert.match(sectionSource, /direction/);
  assert.match(sectionSource, /scrollToIndex/);
  assert.match(sectionSource, /type="button"/);
  assert.match(sectionSource, /aria-expanded=\{isActive\}/);
  assert.match(sectionSource, /AccordionItem/);
  assert.match(sectionSource, /DemoPlaceholder/);
  assert.match(sectionSource, /<AnimatePresence/);
  assert.match(sectionSource, /motion\.div/);
  assert.doesNotMatch(sectionSource, /blur\(16px\)/);
  assert.doesNotMatch(sectionSource, /PreviewCard/);
  assert.doesNotMatch(sectionSource, /<ScrollStack/);
});

test('BrainCapsSection click jump does not animate through intermediate items', () => {
  assert.match(sectionSource, /setActiveIndex\(index\)/);
  assert.match(sectionSource, /activeIndexRef\.current = index/);
  assert.match(sectionSource, /behavior: 'auto'/);
  assert.doesNotMatch(sectionSource, /behavior: 'smooth'/);
});

test('ScrollStack runtime is removed with its dependency', () => {
  const pkg = JSON.parse(packageSource);
  assert.equal(existsSync(scrollStackPath), false);
  assert.equal(pkg.dependencies.lenis, undefined);
});
