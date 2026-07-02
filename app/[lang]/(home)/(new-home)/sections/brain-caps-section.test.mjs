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
const componentsDir = join(sectionDir, '..', 'components');
const brainCapsDemosSource = readFileSync(
  join(componentsDir, 'brain-caps-demos.tsx'),
  'utf8',
);
const deployDemoCommonSource = readFileSync(
  join(componentsDir, 'deploy-demo-common.tsx'),
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
  assert.match(sectionSource, /grid items-start/);
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

test('BrainCapsSection swaps panel motion direction correctly', () => {
  assert.match(sectionSource, /const offset = direction > 0 \? -36 : 36/);
  assert.match(sectionSource, /phase === 'enter' \? offset : -offset/);
});

test('BrainCapsSection maps real demos to the requested caps', () => {
  assert.match(
    sectionSource,
    /import \{[\s\S]*DeployCanvasDemo[\s\S]*DBStudioDemo[\s\S]*DBDeployDemo[\s\S]*\} from '\.\.\/components\/brain-caps-demos';/,
  );
  assert.match(
    sectionSource,
    /title: 'Auto Env Injection'[\s\S]*demo: DeployCanvasDemo/,
  );
  assert.match(
    sectionSource,
    /title: 'Built-in DB Studio'[\s\S]*demo: DBStudioDemo/,
  );
  assert.match(
    sectionSource,
    /title: 'One-Click High Availability'[\s\S]*demo: DBDeployDemo/,
  );
});

test('BrainCapsSection scales real demos without clipping right overflow', () => {
  assert.match(sectionSource, /function ScaledBrainCapDemo/);
  assert.match(sectionSource, /aspect-\[1312\/812\] h-\[166\.6667%\]/);
  assert.match(sectionSource, /relative h-full w-full overflow-visible/);
  assert.match(sectionSource, /origin-top-left scale-75/);
  assert.match(sectionSource, /\[&>\*\]:!max-w-none/);
});

test('demo cursor and canvas coordinates account for scaled ancestors', () => {
  assert.match(deployDemoCommonSource, /export function getElementScale/);
  assert.match(deployDemoCommonSource, /const stageScale = getElementScale/);
  assert.match(deployDemoCommonSource, /\/ stageScale\.x/);
  assert.match(deployDemoCommonSource, /stage\.offsetWidth \* step\.cursor\.x/);
  assert.match(brainCapsDemosSource, /getElementScale/);
  assert.match(brainCapsDemosSource, /\/ canvasScale\.x/);
  assert.match(brainCapsDemosSource, /cursorPosition\.x \* stageScale\.x/);
});

test('ScrollStack runtime is removed with its dependency', () => {
  const pkg = JSON.parse(packageSource);
  assert.equal(existsSync(scrollStackPath), false);
  assert.equal(pkg.dependencies.lenis, undefined);
});
