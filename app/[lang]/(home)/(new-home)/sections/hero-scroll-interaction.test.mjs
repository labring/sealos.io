import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const sectionDir = dirname(fileURLToPath(import.meta.url));
const heroSectionSource = readFileSync(
  join(sectionDir, 'hero-section.tsx'),
  'utf8',
);
const heroDemoCardsSource = readFileSync(
  join(sectionDir, '../components/hero-demo-cards.tsx'),
  'utf8',
);
const demosSectionSource = readFileSync(
  join(sectionDir, 'demos-section.tsx'),
  'utf8',
);

test('hero proof scroller uses three 75vh proof steps', () => {
  assert.match(heroSectionSource, /function HeroProofScroller/);
  assert.match(heroSectionSource, /const topOffset = 312/);
  assert.match(
    heroSectionSource,
    /function HeroSection\(\)[\s\S]*<HeroProofScroller \/>/,
  );
  assert.doesNotMatch(
    heroSectionSource,
    /function HeroSection\(\)[\s\S]*<HeroHeadline \/>[\s\S]*<HeroProofScroller \/>/,
  );
  assert.match(
    heroSectionSource,
    /function HeroProofScroller\(\)[\s\S]*<HeroHeadline \/>[\s\S]*<HeroDemoCards/,
  );
  assert.doesNotMatch(heroSectionSource, /pt-24/);
  assert.match(heroSectionSource, /h-\[225vh\] min-h-\[1152px\]/);
  assert.match(
    heroSectionSource,
    /<HeroDemoCards[\s\S]*pinDelayPx=\{1152\}[\s\S]*pinDelayVh=\{2\.25\}[\s\S]*pinStartElementId="hero-proof-scroller"[\s\S]*\/>/,
  );
  assert.match(heroSectionSource, /type HeroProofPhase/);
  assert.match(
    heroSectionSource,
    /'guarantees' \| 'adoption' \| 'rating' \| 'done'/,
  );
  assert.match(heroSectionSource, /useState<HeroProofPhase>\('guarantees'\)/);
  assert.match(heroSectionSource, /getHeroGlowProgress/);
  assert.match(heroSectionSource, /function getHeroGlowProgress/);
  assert.match(heroSectionSource, /function getScrollStepDistance/);
  assert.match(heroSectionSource, /Math\.max\(viewportHeight \* 0\.75, 384\)/);
  assert.match(heroSectionSource, /absolute inset-x-0 -top-24 bottom-0/);
  assert.match(heroSectionSource, /sticky top-0/);
  assert.match(heroSectionSource, /h-\[25vh\] w-screen -translate-x-1\/2/);
  assert.match(heroSectionSource, /0\.3 \+ 0\.7 \* \(1 - glowProgress\)/);
  assert.doesNotMatch(
    heroSectionSource,
    /transform: `translate3d\(0, -\$\{glow/,
  );
  assert.match(heroSectionSource, /phase === 'guarantees'/);
  assert.match(heroSectionSource, /phase === 'adoption'/);
  assert.match(heroSectionSource, /phase === 'rating'/);
  assert.match(heroSectionSource, /phase === 'done'/);
  assert.match(heroSectionSource, /start \+ stepDistance \* 2/);
  assert.match(heroSectionSource, /start \+ stepDistance/);
  assert.match(heroSectionSource, /start \+ stepDistance \* 3/);
  assert.match(heroSectionSource, /const nextPhase = getHeroProofPhase/);
  assert.match(
    heroSectionSource,
    /Math\.max\(0, scroller\.offsetTop - topOffset\)/,
  );
  assert.doesNotMatch(heroSectionSource, /swapProgress/);
  assert.match(heroSectionSource, /<HeroAdoptionStrip \/>/);
  assert.match(heroSectionSource, /<HeroRating \/>/);
  assert.match(heroSectionSource, /<HeroGuarantees \/>/);
  assert.match(
    heroSectionSource,
    /radial-gradient\(50% 50% at 50% 50%, #1D4ED8 19\.35%, rgba\(10, 10, 10, 0\) 100%\)/,
  );
  assert.match(heroSectionSource, /h-\[25vh\]/);
  assert.match(heroSectionSource, /-translate-y-8 opacity-0 blur-\[12px\]/);
});

test('hero demo cards can delay their demos-section pin until proof scroll ends', () => {
  assert.match(heroDemoCardsSource, /pinDelayPx = 0/);
  assert.match(heroDemoCardsSource, /pinDelayVh = 0/);
  assert.match(heroDemoCardsSource, /pinStartElementId/);
  assert.match(heroDemoCardsSource, /pinStartOffset/);
  assert.match(
    heroDemoCardsSource,
    /Math\.max\(window\.innerHeight \* pinDelayVh, pinDelayPx\)/,
  );
  assert.match(heroDemoCardsSource, /pinStart =/);
});

test('hero demo cards use hover styling without active sync', () => {
  assert.match(heroDemoCardsSource, /activeIndexRef/);
  assert.doesNotMatch(heroDemoCardsSource, /\[activeIndex, setActiveIndex\]/);
  assert.doesNotMatch(heroDemoCardsSource, /setActiveIndex/);
  assert.doesNotMatch(heroDemoCardsSource, /activeIndex === index/);
  assert.match(
    heroDemoCardsSource,
    /border-transparent bg-transparent p-5[\s\S]*hover:border-white\/10 hover:bg-white\/\[0\.04\]/,
  );
});

test('demo cards hand off from the hero grid into the demos section', () => {
  assert.match(heroDemoCardsSource, /demoHandoffEventName/);
  assert.match(heroDemoCardsSource, /isHandoffHidden/);
  assert.doesNotMatch(heroDemoCardsSource, /isHandoffActive/);
  assert.match(heroDemoCardsSource, /detail !== false/);
  assert.doesNotMatch(
    heroDemoCardsSource,
    /sectionRect\.top > topOffset[\s\S]*setIsHandoffHidden\(false\)/,
  );
  assert.doesNotMatch(heroDemoCardsSource, /setIsPinned\(true\)/);
  assert.match(heroDemoCardsSource, /if \(!hidden\) \{\s*updatePin\(\);/);
  assert.match(heroDemoCardsSource, /hidden=\{isPinned \|\| isHandoffHidden\}/);
  assert.match(heroDemoCardsSource, /data-demo-static-card/);
  assert.match(heroDemoCardsSource, /data-demo-source-grid/);
  assert.match(heroDemoCardsSource, /data-demo-source-card/);
  assert.match(heroDemoCardsSource, /pointer-events-none opacity-0/);
  assert.match(demosSectionSource, /targetCardRefs/);
  assert.match(demosSectionSource, /startCardHandoff/);
  assert.match(demosSectionSource, /startCardReturn/);
  assert.match(demosSectionSource, /updateCardReturnTarget/);
  assert.match(demosSectionSource, /data-demo-static-card/);
  assert.match(demosSectionSource, /demoHandoffEventName/);
  assert.match(demosSectionSource, /detail: false/);
  assert.match(
    demosSectionSource,
    /detail: false[\s\S]*window\.requestAnimationFrame\(\(\) => \{[\s\S]*setCardFlights\(null\)/,
  );
  assert.match(demosSectionSource, /CardFlightOverlay/);
  assert.match(demosSectionSource, /cardFlights/);
  assert.match(demosSectionSource, /isHandoffComplete/);
  assert.match(demosSectionSource, /border-transparent bg-transparent/);
  assert.match(demosSectionSource, /pointer-events-none[\s\S]*opacity-0/);
  assert.match(demosSectionSource, /sourceGridIsInsideSection/);
  assert.match(demosSectionSource, /translate3d/);
});
