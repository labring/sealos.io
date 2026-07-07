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
const repoDemoImagePath = join(
  sectionDir,
  '..',
  '..',
  '..',
  '..',
  '..',
  '..',
  'public',
  'images',
  'home',
  'sealos-github-repo-demo.png',
);
const componentsDir = join(
  sectionDir,
  '..',
  '..',
  'components',
  'deploy-demos',
);
const brainCapsDemosSource = readFileSync(
  join(componentsDir, 'brain-caps-demos.tsx'),
  'utf8',
);
const deployDemoCommonSource = readFileSync(
  join(componentsDir, 'deploy-demo-common.tsx'),
  'utf8',
);
const scrollStackPath = join(sectionDir, 'scroll-stack.tsx');
const pageSource = readFileSync(
  join(sectionDir, '..', '..', 'page.tsx'),
  'utf8',
);
const packageSource = readFileSync(
  join(sectionDir, '..', '..', '..', '..', '..', '..', 'package.json'),
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

test('BrainCapsSection uses scroll-driven accordion only in sticky layout', () => {
  assert.match(
    sectionSource,
    /import \{ AnimatePresence, motion, type Transition \}/,
  );
  assert.match(sectionSource, /sectionRef/);
  assert.match(sectionSource, /addEventListener\('scroll'/);
  assert.match(sectionSource, /lg:h-\[475vh\]/);
  assert.match(sectionSource, /lg:min-h-\[calc\(100vh\+1920px\)\]/);
  assert.match(sectionSource, /lg:sticky lg:top-0/);
  assert.match(sectionSource, /lg:flex lg:min-h-screen lg:items-center/);
  assert.match(sectionSource, /function isStickyLayout/);
  assert.match(sectionSource, /function getScrollStepDistance/);
  assert.match(sectionSource, /Math\.max\(viewportHeight \* 0\.75, 384\)/);
  assert.match(
    sectionSource,
    /Math\.floor\(scrolledDistance \/ stepDistance\)/,
  );
  assert.match(sectionSource, /stepDistance \* \(index \+ 0\.05\)/);
  assert.match(sectionSource, /matchMedia\('\(min-width: 1024px\)'\)/);
  assert.match(
    sectionSource,
    /if \(!section \|\| !isStickyLayout\(\)\) return/,
  );
  assert.match(sectionSource, /if \(!isStickyLayout\(\)\) return/);
  assert.doesNotMatch(sectionSource, /getScrollProgressDistance/);
  assert.doesNotMatch(
    sectionSource,
    /className="flex min-h-screen items-center/,
  );
  assert.match(sectionSource, /grid items-start/);
  assert.match(
    sectionSource,
    /grid items-start[\s\S]*<h2[\s\S]*Eight things you usually duct-tape together[\s\S]*<div className="mt-8 space-y-5">/,
  );
  assert.doesNotMatch(sectionSource, /mt-16 grid items-start/);
  assert.match(sectionSource, /scrollToIndex/);
  assert.match(sectionSource, /type="button"/);
  assert.match(sectionSource, /aria-expanded=\{isActive\}/);
  assert.match(sectionSource, /group-hover:text-blue-400/);
  assert.match(
    sectionSource,
    /isActive\s*\?\s*'text-blue-400'\s*:\s*'text-white/,
  );
  assert.match(sectionSource, /text-lg leading-7 font-semibold text-zinc-100/);
  assert.match(sectionSource, /text-base leading-6 font-normal text-zinc-500/);
  assert.match(sectionSource, /AccordionItem/);
  assert.match(sectionSource, /SourceCoreDemo/);
  assert.doesNotMatch(sectionSource, /DemoPlaceholder/);
  assert.match(sectionSource, /<AnimatePresence/);
  assert.match(sectionSource, /motion\.div/);
  assert.doesNotMatch(sectionSource, /mode="wait"/);
  assert.doesNotMatch(sectionSource, /blur\(16px\)/);
  assert.doesNotMatch(sectionSource, /PreviewCard/);
  assert.doesNotMatch(sectionSource, /<ScrollStack/);
});

test('new home sections use container for page width', () => {
  const comparisonSource = readFileSync(
    join(sectionDir, '..', 'comparison-section.tsx'),
    'utf8',
  );
  const appsSource = readFileSync(
    join(sectionDir, '..', 'apps', 'apps-section.tsx'),
    'utf8',
  );
  const faqSource = readFileSync(
    join(sectionDir, '..', 'faq-section.tsx'),
    'utf8',
  );
  const ctaSource = readFileSync(
    join(sectionDir, '..', 'cta', 'cta-section.tsx'),
    'utf8',
  );

  for (const source of [
    sectionSource,
    comparisonSource,
    appsSource,
    faqSource,
    ctaSource,
  ]) {
    assert.match(source, /className="container /);
  }
});

test('ComparisonSection clips the highlighted table header background', () => {
  const comparisonSource = readFileSync(
    join(sectionDir, '..', 'comparison-section.tsx'),
    'utf8',
  );

  assert.match(
    comparisonSource,
    /clipPath: 'inset\(0 round 0\.75rem 0\.75rem 0 0\)'/,
  );
  assert.match(
    comparisonSource,
    /className="pointer-events-none absolute inset-0 bg-zinc-800"/,
  );
  assert.match(
    comparisonSource,
    /className="pointer-events-none absolute inset-x-px top-px bottom-0 bg-linear-to-b from-\[#161A28\] to-\[#16181D\]"/,
  );
  assert.match(
    comparisonSource,
    /clipPath:\s*'inset\(0 round calc\(0\.75rem - 1px\) calc\(0\.75rem - 1px\) 0 0\)'/,
  );
  assert.doesNotMatch(comparisonSource, /rounded-t-xl border border-b-0/);
  assert.doesNotMatch(comparisonSource, /absolute inset-0 border/);
});

test('BrainCapsSection click jump does not animate through intermediate items', () => {
  assert.match(sectionSource, /setActiveIndex\(index\)/);
  assert.match(sectionSource, /activeIndexRef\.current = index/);
  assert.match(sectionSource, /behavior: 'auto'/);
  assert.doesNotMatch(sectionSource, /behavior: 'smooth'/);
});

test('BrainCapsSection keeps directional panel motion without wait gap', () => {
  assert.match(sectionSource, /const \[direction, setDirection\]/);
  assert.match(
    sectionSource,
    /setDirection\(nextIndex > activeIndexRef\.current/,
  );
  assert.match(sectionSource, /const panelTransition: Transition = \{/);
  assert.match(sectionSource, /duration: 0\.18/);
  assert.match(sectionSource, /custom=\{direction\}/);
  assert.match(sectionSource, /const offset = direction > 0 \? 36 : -36/);
  assert.match(sectionSource, /filter: 'blur\(12px\)'/);
  assert.match(sectionSource, /y: phase === 'enter' \? offset : -offset/);
});

test('BrainCapsSection hides the right demo panel on tablet and mobile', () => {
  assert.match(
    sectionSource,
    /className="relative hidden h-\[374px\] md:h-\[460px\] lg:block lg:self-center"/,
  );
});

test('BrainCapsSection maps real demos to the requested caps', () => {
  assert.match(
    sectionSource,
    /import \{[\s\S]*DeployCanvasDemo[\s\S]*DBStudioDemo[\s\S]*DBDeployDemo[\s\S]*LiveObjectCanvasDemo[\s\S]*\} from '\.\.\/\.\.\/components\/deploy-demos\/brain-caps-demos';/,
  );
  assert.match(
    sectionSource,
    /title: 'Live Object Canvas'[\s\S]*demo: LiveObjectCanvasDemo/,
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
  assert.match(
    sectionSource,
    /title: 'Source - Available Core'[\s\S]*demo: SourceCoreDemo/,
  );
  assert.match(sectionSource, /sealos-github-repo-demo\.png/);
  assert.equal(existsSync(repoDemoImagePath), true);
});

test('BrainCapsSection scales real demos without clipping right overflow', () => {
  assert.match(sectionSource, /function ScaledBrainCapDemo/);
  assert.match(sectionSource, /aspect-\[1312\/812\] h-\[166\.6667%\]/);
  assert.match(
    sectionSource,
    /relative flex h-full w-full items-center justify-start/,
  );
  assert.match(sectionSource, /origin-left scale-75/);
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
