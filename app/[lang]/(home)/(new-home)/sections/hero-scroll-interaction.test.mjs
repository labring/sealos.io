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

test('hero proof scroller reserves one viewport and swaps proof layers', () => {
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
  assert.match(heroSectionSource, /h-screen/);
  assert.match(
    heroSectionSource,
    /<HeroDemoCards[\s\S]*pinDelayVh=\{1\}[\s\S]*pinStartElementId="hero-proof-scroller"[\s\S]*\/>/,
  );
  assert.match(heroSectionSource, /type HeroProofPhase/);
  assert.match(heroSectionSource, /getHeroGlowProgress/);
  assert.match(heroSectionSource, /function getHeroGlowProgress/);
  assert.match(heroSectionSource, /absolute inset-x-0 -top-24 bottom-0/);
  assert.match(heroSectionSource, /sticky top-0/);
  assert.match(heroSectionSource, /h-\[25vh\] w-screen -translate-x-1\/2/);
  assert.match(heroSectionSource, /opacity: 1 - glowProgress/);
  assert.doesNotMatch(
    heroSectionSource,
    /transform: `translate3d\(0, -\$\{glow/,
  );
  assert.match(heroSectionSource, /phase === 'adoption'/);
  assert.match(heroSectionSource, /phase === 'rating'/);
  assert.match(heroSectionSource, /phase === 'done'/);
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
  assert.match(heroDemoCardsSource, /pinDelayVh = 0/);
  assert.match(heroDemoCardsSource, /pinStartElementId/);
  assert.match(heroDemoCardsSource, /pinStartOffset/);
  assert.match(heroDemoCardsSource, /window\.innerHeight \* pinDelayVh/);
  assert.match(heroDemoCardsSource, /pinStart =/);
});
