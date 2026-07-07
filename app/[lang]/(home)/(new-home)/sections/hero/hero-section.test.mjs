import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const sectionDir = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(sectionDir, 'hero-section.tsx'), 'utf8');
const pageSource = readFileSync(
  join(sectionDir, '..', '..', 'page.tsx'),
  'utf8',
);
const heroDemoButtonSource = source.slice(
  source.indexOf('function HeroDemoButton'),
  source.indexOf('function HeroMobileDemoCards'),
);

assert.match(source, /function HeroDemoSwitcher/);
assert.match(source, /scrollerRef/);
assert.doesNotMatch(source, /stickyContentRef/);
assert.match(source, /data-hero-demo-scroller/);
assert.match(source, /data-hero-demo-sticky/);
assert.match(source, /data-hero-demo-glow/);
assert.match(
  source,
  /import \{ SideRays \} from '@\/new-components\/SideRays'/,
);
assert.match(source, /<SideRays/);
assert.match(source, /top-\[-96px\]/);
assert.match(source, /origin="top-left"/);
assert.match(
  source,
  /from '\.\.\/\.\.\/components\/deploy-demos\/docker-image-demo'/,
);
assert.match(
  source,
  /from '\.\.\/\.\.\/components\/deploy-demos\/github-import-demo'/,
);
assert.match(
  source,
  /from '\.\.\/\.\.\/components\/deploy-demos\/project-type-demos'/,
);
assert.match(source, /from '\.\/hero-supporting-proof'/);
assert.match(source, /from '\.\/hero-title'/);
assert.match(source, /top-full left-1\/2 -z-10 aspect-\[2\/1\] w-\[150%\]/);
assert.match(source, /md:w-\[125%\]/);
assert.match(
  source,
  /radial-gradient\(50% 50% at 50% 50%, rgba\(29, 78, 216, 0\.5\) 19\.35%, rgba\(10, 10, 10, 0\) 100%\)/,
);
assert.match(source, /window\.requestAnimationFrame/);
assert.match(source, /window\.setTimeout/);
assert.match(source, /function getNextDemoIndex/);
assert.match(source, /getNextDemoIndex\(currentIndex\)/);
assert.doesNotMatch(source, /window\.setInterval/);
assert.match(source, /className="relative mt-12 w-full/);
assert.doesNotMatch(source, /max-w-6xl/);
assert.match(source, /function HeroMobileDemoCards/);
assert.match(source, /data-hero-mobile-demo-cards/);
assert.match(source, /flex flex-col gap-3 sm:hidden/);
assert.match(source, /hidden flex-wrap justify-center gap-2\.5 sm:flex/);
assert.match(source, /hidden aspect-\[1312\/812\].*sm:block/);
assert.match(source, /h-\[200%\] w-\[200%\].*scale-50/);
assert.match(source, /md:h-\[153\.8461%\] md:w-\[153\.8461%\] md:scale-65/);
assert.match(source, /lg:h-\[133\.3333%\] lg:w-\[133\.3333%\] lg:scale-75/);
assert.match(source, /xl:h-full xl:w-full xl:scale-100/);
assert.match(source, /durationMs: githubImportDemoDurationMs/);
assert.match(source, /durationMs: dockerImageDemoDurationMs/);
assert.match(source, /durationMs: databaseDemoDurationMs/);
assert.match(source, /durationMs: templateDemoDurationMs/);
assert.match(source, /GitHub/);
assert.match(source, /Docker Image/);
assert.match(source, /Database/);
assert.match(source, /Templates/);
assert.match(source, /function HeroDemoButton/);
assert.match(source, /progressPercent/);
assert.match(source, /active \? 'text-blue-400'/);
assert.doesNotMatch(heroDemoButtonSource, /bg-white\/10/);
assert.doesNotMatch(heroDemoButtonSource, /hover:bg-white/);
assert.match(source, /className="absolute inset-0 z-10"/);
assert.match(source, /<ScaledDemoCanvas>/);
assert.match(source, /\[contain:layout\]/);
assert.match(source, /absolute inset-0 h-\[200%\].*overflow-visible/);
assert.match(source, /<Demo active \/>/);
assert.match(source, /<HeroProofStack \/>/);
assert.match(source, /<HeroGuarantees \/>/);
assert.match(source, /<HeroAdoptionStrip \/>/);
assert.match(source, /<HeroRating \/>/);
assert.doesNotMatch(source, /headline/);
assert.doesNotMatch(source, /body:/);
assert.doesNotMatch(pageSource, /DemosSection/);

console.log('hero-section checks passed');
