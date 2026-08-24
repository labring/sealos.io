import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

import {
  getRemainingDuration,
  getNextPlaybackState,
} from '../app/[lang]/(home)/(new-home)/components/deploy-demos/deploy-demo-playback.mjs';

const root = process.cwd();
const routeDir = join(root, 'app', '[lang]', '(home)', 'railway-alternative');
const pageSource = readFileSync(join(routeDir, 'page.tsx'), 'utf8');
const ctaSource = readFileSync(
  join(routeDir, 'railway-alternative-ctas.tsx'),
  'utf8',
);
const heroDemoSource = readFileSync(
  join(routeDir, 'railway-hero-demo.tsx'),
  'utf8',
);
const deployDemoDir = join(
  root,
  'app',
  '[lang]',
  '(home)',
  '(new-home)',
  'components',
  'deploy-demos',
);
const githubDemoSource = readFileSync(
  join(deployDemoDir, 'github-import-demo.tsx'),
  'utf8',
);
const playbackSource = readFileSync(
  join(deployDemoDir, 'deploy-demo-common.tsx'),
  'utf8',
);
const deploymentCanvasSource = readFileSync(
  join(deployDemoDir, 'deployment-canvas.tsx'),
  'utf8',
);
const routeStyles = readFileSync(
  join(routeDir, 'railway-alternative.module.css'),
  'utf8',
);
const globalStyles = readFileSync(join(root, 'app', 'global.css'), 'utf8');
const tokenStyles = readFileSync(join(root, 'tokens.css'), 'utf8');
const localeLayoutSource = readFileSync(
  join(root, 'app', '[lang]', 'layout.tsx'),
  'utf8',
);
const sitemapSource = readFileSync(join(root, 'app', 'sitemap.ts'), 'utf8');
const darkModeSource = readFileSync(
  join(root, 'app', '[lang]', 'utils', 'is-forced-dark-mode.ts'),
  'utf8',
);
const pricingSource = readFileSync(
  join(
    root,
    'app',
    '[lang]',
    '(home)',
    'pricing',
    'components',
    'RailwayCostCalculator.tsx',
  ),
  'utf8',
);
const railwayCostSource = readFileSync(
  join(root, 'app', '[lang]', '(home)', 'pricing', 'config', 'railway-cost.ts'),
  'utf8',
);
const railwayComparisonSource = readFileSync(
  join(root, 'app', '[lang]', '(home)', 'comparison', 'config', 'railway.tsx'),
  'utf8',
);
const comparisonFaqSource = readFileSync(
  join(root, 'app', '[lang]', '(home)', 'comparison', 'config', 'faqs.ts'),
  'utf8',
);
const railwayFaqStart = comparisonFaqSource.indexOf(
  '// Railway-specific FAQs (default)',
);
assert.notEqual(railwayFaqStart, -1);
const railwayFaqSource = comparisonFaqSource.slice(railwayFaqStart);
const authRedirectSource = readFileSync(
  join(root, 'hooks', 'use-auth-redirect.ts'),
  'utf8',
);
const attributionSource = readFileSync(
  join(root, 'lib', 'attribution-url.ts'),
  'utf8',
);
const packageJson = JSON.parse(
  readFileSync(join(root, 'package.json'), 'utf8'),
);

test('route metadata and owned schema follow the locale contract', () => {
  assert.match(pageSource, /languageAlternates: false/);
  assert.match(pageSource, /if \(lang !== 'en'\)/);
  assert.match(pageSource, /index: false/);
  assert.match(pageSource, /generateBreadcrumbSchema/);
  assert.match(pageSource, /lang === 'en'/);
  assert.doesNotMatch(pageSource, /FAQPage/);
});

test('route inherits the homepage forced-dark mode', () => {
  assert.match(
    darkModeSource,
    /path: '\/railway-alternative',\s*match: 'prefix'/,
  );
});

test('page renders the six locked sections and one H1', () => {
  const sections = [
    ...pageSource.matchAll(/data-railway-alternative-section="([^"]+)"/g),
  ].map(([, section]) => section);

  assert.deepEqual(sections, [
    'hero',
    'reasons',
    'cost-example',
    'comparison',
    'migration',
    'faq',
  ]);
  assert.equal((pageSource.match(/<h1\b/g) ?? []).length, 1);
});

test('CTA contracts preserve handoffs and emit one approved event shape', () => {
  const ctaIds = [
    'railway_alt_hero_deploy_github',
    'railway_alt_cost_compare',
    'railway_alt_migration_deploy_image',
    'railway_alt_final_deploy_github',
  ];

  for (const ctaId of ctaIds) assert.match(ctaSource, new RegExp(ctaId));
  for (const label of [
    'Deploy a GitHub repo',
    'Compare your cost',
    'Deploy your existing image',
    'Compare costs',
  ]) {
    assert.match(ctaSource, new RegExp(label));
  }
  for (const location of ['hero', 'cost_example', 'migration', 'final_cta']) {
    assert.match(ctaSource, new RegExp(`location: '${location}'`));
  }
  for (const deployIntent of ['github_repo', 'docker_image', 'unselected']) {
    assert.match(ctaSource, new RegExp(`deployIntent: '${deployIntent}'`));
  }

  assert.equal(
    (ctaSource.match(/trackCustom\('railway_alt_cta_clicked'/g) ?? []).length,
    1,
  );
  for (const field of ['cta_id', 'location', 'destination', 'deploy_intent']) {
    assert.match(ctaSource, new RegExp(`${field}:`));
  }
  assert.doesNotMatch(ctaSource, /email|user_id|identity/);
  assert.match(ctaSource, /getOpenBrainParam\('Deploy my GitHub repository'\)/);
  assert.match(
    ctaSource,
    /getOpenBrainParam\('Deploy my existing Docker image'\)/,
  );
  assert.match(ctaSource, /useAuthRedirect/);
  assert.match(ctaSource, /getRybbitCtaProps/);
  assert.match(authRedirectSource, /appendAttributionToUrl/);
  assert.match(attributionSource, /sea_attr/);
});

test('Hero reuses the compact GitHub walkthrough with one-shot playback', () => {
  assert.match(pageSource, /<RailwayHeroDemo \/>/);
  assert.doesNotMatch(
    pageSource,
    /next\/image|figcaption|github-import\.webp|account data/,
  );

  assert.match(heroDemoSource, /dynamic\(/);
  assert.match(heroDemoSource, /ssr: false/);
  assert.match(heroDemoSource, /IntersectionObserver/);
  assert.match(heroDemoSource, /\(min-width: 48rem\)/);
  assert.match(heroDemoSource, /prefers-reduced-motion: reduce/);
  assert.match(heroDemoSource, /loop=\{false\}/);
  assert.match(heroDemoSource, /paused=\{paused\}/);
  assert.match(heroDemoSource, /onComplete=\{handleComplete\}/);
  assert.match(heroDemoSource, /variant="compact"/);
  assert.match(heroDemoSource, /\['Import', 'Deploy', 'Live'\]/);
  assert.match(heroDemoSource, /paused \? 'Play' : 'Pause'/);
  assert.match(heroDemoSource, />\s*Replay\s*</);
  assert.doesNotMatch(heroDemoSource, /aria-pressed/);

  const compactStart = githubDemoSource.indexOf('const compactGithubSteps');
  const compactEnd = githubDemoSource.indexOf(
    'export const githubImportDemoDurationMs',
  );
  assert.ok(compactStart > -1 && compactEnd > compactStart);
  assert.match(githubDemoSource, /variant = 'full'/);
  assert.match(
    githubDemoSource,
    /githubImportDemoDurationMs = githubSteps\.reduce/,
  );
  const compactSource = githubDemoSource.slice(compactStart, compactEnd);
  const compactRawDuration = [
    ...compactSource.matchAll(/duration: (\d+)/g),
  ].reduce((total, [, duration]) => total + Number(duration), 0);

  assert.equal(Math.round(compactRawDuration * 0.42), 7350);
  assert.match(compactSource, /clickTarget: 'repoDeploy'/);
  assert.match(compactSource, /formClosed: true/);
  assert.doesNotMatch(
    compactSource,
    /clickTarget: 'authorize'|activeField: 'secret'|clickTarget: 'secretSubmit'/,
  );

  assert.match(playbackSource, /loop = true/);
  assert.match(playbackSource, /paused = false/);
  assert.match(playbackSource, /onComplete\?\.\(\)/);
  assert.match(playbackSource, /completionNotifiedRef/);
  assert.match(playbackSource, /getRemainingDuration/);
  assert.match(playbackSource, /getNextPlaybackState/);
  assert.match(playbackSource, /DEMO_STEP_DURATION_SCALE = 0\.42/);
  assert.match(
    githubDemoSource,
    /variant === 'compact' && readyStage === 15[\s\S]*\? 'Running'/,
  );
  assert.match(
    deploymentCanvasSource,
    /runtimeStatus \?\? config\.runtimeStatus \?\? 'Creating'/,
  );
});

test('shared playback calculations retain progress and completion semantics', () => {
  assert.equal(getRemainingDuration(1_000, 0.4), 600);

  assert.deepEqual(
    getNextPlaybackState({ index: 2, loop: false, stepCount: 3 }),
    { completed: true, index: 2, progress: 1 },
  );

  assert.deepEqual(
    getNextPlaybackState({ index: 2, loop: true, stepCount: 3 }),
    { completed: false, index: 0, progress: 0 },
  );
});

test('route includes required links, evidence, and shared pricing consumption', () => {
  for (const requiredPath of [
    '/pricing/#railway-cost',
    '/comparison/sealos-vs-railway/',
    '/docs/guides/app-deploy/create-app/',
    '/docs/guides/app-deploy/environments/',
    '/docs/guides/databases/database-migration-guide/',
    '/docs/guides/app-deploy/add-a-domain/',
    'RAILWAY_RATE_CARD.sourceUrl',
  ]) {
    assert.match(pageSource, new RegExp(requiredPath.replaceAll('/', '\\/')));
  }

  assert.match(pageSource, /estimateRailwayMonthlyCost/);
  assert.match(pageSource, /RAILWAY_RATE_CARD/);
  assert.match(pageSource, /standardRailwayEstimate\.selectedPlan === 'pro'/);
  assert.match(pageSource, /standardRailwayEstimate\.usageSubtotal === 182\.5/);
  assert.doesNotMatch(pageSource, /cpuPerVcpuMonth:\s*20/);
});

test('connected discovery consumes the route and links back to it', () => {
  assert.match(sitemapSource, /const railwayAlternativePages/);
  assert.match(sitemapSource, /isZhCn/);
  assert.match(sitemapSource, /'\/railway-alternative'/);
  assert.match(pricingSource, /railway-alternative/);
  assert.match(pricingSource, /railway_alternative_page/);
  assert.match(railwayComparisonSource, /railway-alternative/);
});

test('all evaluation surfaces consume shared Railway evidence and estimates', () => {
  for (const source of [pageSource, pricingSource, railwayComparisonSource]) {
    assert.match(source, /RAILWAY_RATE_CARD/);
    assert.match(source, /estimateRailwayMonthlyCost/);
    assert.match(source, /RAILWAY_RATE_CARD\.verifiedAt/);
  }

  for (const field of [
    'billedTotal',
    'planMinimum',
    'resourceEligibility',
    'validationResult',
  ]) {
    assert.match(railwayComparisonSource, new RegExp(`estimate\\.${field}`));
  }
  assert.match(railwayComparisonSource, /RAILWAY_RATE_CARD\.plans/);
  assert.match(
    railwayComparisonSource,
    /RAILWAY_RATE_CARD\.deploymentSourceUrl/,
  );
  assert.match(railwayCostSource, /RAILWAY_RATE_CARD/);
  assert.match(railwayCostSource, /verifiedAt: '2026-08-21'/);

  for (const source of [
    pageSource,
    pricingSource,
    railwayComparisonSource,
    railwayFaqSource,
  ]) {
    assert.doesNotMatch(
      source,
      /(?:hobby|pro)(?:MonthlySubscription|IncludedUsage|PerVcpuMonth|PerGbMonth|PerGb):\s*\d/i,
    );
  }
});

test('evaluation surfaces expose locale-aware two-way discovery links', () => {
  assert.match(
    pricingSource,
    /getLanguageSlug\(lang\)[\s\S]{0,100}railway-alternative\//,
  );
  assert.match(
    pageSource,
    /getLanguageSlug\(lang\)[\s\S]{0,100}pricing\/#railway-cost/,
  );
  assert.match(
    ctaSource,
    /getLanguageSlug\(lang\)[\s\S]{0,100}pricing\/#railway-cost/,
  );
  assert.match(railwayComparisonSource, /Ready to migrate or deploy/);
  assert.match(railwayComparisonSource, /\/railway-alternative\//);
  assert.match(railwayFaqSource, /\/pricing\/#railway-cost/);
});

test('Railway comparison copy excludes prohibited stale claims', () => {
  const sources = [pageSource, railwayComparisonSource, railwayFaqSource];
  for (const source of sources) {
    for (const claim of [
      /always cheaper/i,
      /save 70%/i,
      /zero lock-in|never locked in/i,
      /Hobby:\s*8|Pro:\s*32/i,
      /Typical migrations complete in/i,
      /support response/i,
      /\btestimonial\b|\brating\b|\bbenchmark\b/i,
      /unlimited team seats/i,
    ]) {
      assert.doesNotMatch(source, claim);
    }
  }
});

test('focused contract test remains runnable through package scripts', () => {
  assert.equal(
    packageJson.scripts['test:railway-alternative'],
    'node --test scripts/railway-alternative.test.mjs',
  );
  const assetPath = join(
    root,
    'public',
    'images',
    'railway-alternative',
    'github-import.webp',
  );
  assert.equal(existsSync(assetPath), false);
});

test('route design contract uses the shared Hallmark token surface', () => {
  assert.match(
    pageSource,
    /import styles from '.\/railway-alternative\.module\.css'/,
  );
  assert.match(
    ctaSource,
    /import styles from '.\/railway-alternative\.module\.css'/,
  );
  assert.match(
    routeStyles.trimStart(),
    /^\/\* Hallmark · genre: modern-minimal · macrostructure: Split Studio · tone: technical-austere · anchor hue: cobalt/,
  );
  assert.match(routeStyles, /Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5/);
  assert.equal(
    (globalStyles.match(/@import '\.\.\/tokens\.css';/g) ?? []).length,
    1,
  );

  for (const group of [
    '--color-railway-',
    '--font-railway-',
    '--space-railway-',
    '--text-railway-',
    '--ease-railway-',
    '--duration-railway-',
    '--rule-railway-',
    '--radius-railway-',
  ]) {
    assert.match(tokenStyles, new RegExp(group));
  }

  assert.match(
    tokenStyles.trimStart(),
    /^\/\* Hallmark · genre: modern-minimal · macrostructure: Split Studio/,
  );
  assert.match(tokenStyles, /html,[\s\S]*body[\s\S]*overflow-x: clip/);
  assert.match(tokenStyles, /--color-railway-surface-raised:/);
  const [, paperLightness] =
    tokenStyles.match(/--color-railway-paper: oklch\(([\d.]+)/) ?? [];
  const [, inkLightness] =
    tokenStyles.match(/--color-railway-ink: oklch\(([\d.]+)/) ?? [];
  assert.ok(Number(paperLightness) < 0.2);
  assert.ok(Number(inkLightness) > 0.9);
  assert.match(localeLayoutSource, /overflow-x-clip/);
  assert.match(routeStyles, /minmax\(0, 1fr\)/);
  assert.match(routeStyles, /overflow-wrap: anywhere/);
  assert.match(routeStyles, /white-space: nowrap/);
  assert.match(routeStyles, /prefers-reduced-motion/);
  assert.match(routeStyles, /var\(--color-railway-/);
  assert.match(routeStyles, /var\(--font-railway-/);
  assert.match(
    routeStyles,
    /nav:has\(\[role='banner'\]\)[\s\S]{0,100}var\(--color-railway-graphite\)/,
  );
  for (const easing of ['out', 'in', 'in-out']) {
    assert.match(tokenStyles, new RegExp(`--ease-railway-${easing}:`));
  }
  assert.doesNotMatch(routeStyles, /color-mix\(/);
  assert.doesNotMatch(pageSource, /styles\.eyebrow/);
  assert.doesNotMatch(
    routeStyles,
    /transition-all|backdrop-filter|box-shadow|position:\s*fixed/,
  );
  assert.doesNotMatch(pageSource, /(?:bg|text|border)-(?:blue|zinc|white)-/);
  assert.doesNotMatch(ctaSource, /(?:bg|text|border)-(?:blue|zinc|white)-/);
  assert.match(routeStyles, /theme: adapted dark Cobalt/);
});
