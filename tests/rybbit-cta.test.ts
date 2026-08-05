import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { getRybbitCtaProps, toRybbitCtaId } from '../lib/analytics/rybbit-cta';

const root = process.cwd();

const readSource = (filePath: string) =>
  readFileSync(path.join(root, filePath), 'utf8');

test('Rybbit CTA helper exposes the stable DOM property contract', () => {
  assert.deepEqual(
    getRybbitCtaProps({
      id: 'home_header_get_started',
      location: 'header',
      destination: 'signup_modal',
    }),
    {
      'data-rybbit-prop-cta-id': 'home_header_get_started',
      'data-rybbit-prop-cta-location': 'header',
      'data-rybbit-prop-cta-destination': 'signup_modal',
    },
  );
});

const homepageCtas = [
  {
    file: 'new-components/Header.tsx',
    id: 'home_header_get_started',
  },
  {
    file: 'new-components/Header.tsx',
    id: 'home_header_mobile_get_started',
  },
  {
    file: 'app/[lang]/(home)/(new-home)/sections/hero/hero-section.tsx',
    id: 'home_hero_get_started',
  },
  {
    file: 'app/[lang]/(home)/(new-home)/sections/cta/cta-section.tsx',
    id: 'home_bottom_deploy_free',
  },
  {
    file: 'new-components/Footer/StartBuildingButton.tsx',
    id: 'home_footer_start_building',
  },
];

const pricingCtas = [
  {
    file: 'app/[lang]/(home)/pricing/components/PricingCard.tsx',
    idSource: 'id: `pricing_${toRybbitCtaId(name)}_get_started`',
  },
  {
    file: 'app/[lang]/(home)/pricing/components/FreeTrialCard.tsx',
    idSource: "id: 'pricing_free_trial_start_deploying'",
  },
  {
    file: 'app/[lang]/(home)/pricing/components/MorePlans.tsx',
    idSource: 'id: `pricing_${toRybbitCtaId(plan.name)}_get_started`',
  },
];

const sealosSkillsSources = [
  'app/[lang]/(home)/sealos-skills/content.ts',
  'app/[lang]/(home)/sealos-skills/top-sections.tsx',
  'app/[lang]/(home)/sealos-skills/bottom-sections.tsx',
  'app/[lang]/(home)/sealos-skills/interactive-sections.tsx',
]
  .map(readSource)
  .join('\n');

test('homepage conversion CTAs use unique stable Rybbit CTA IDs', () => {
  const seenIds = new Set<string>();

  for (const cta of homepageCtas) {
    const source = readSource(cta.file);

    assert.match(
      source,
      new RegExp(`id: ['"]${cta.id}['"]`),
      `${cta.file} must declare ${cta.id}`,
    );
    assert.equal(seenIds.has(cta.id), false, `${cta.id} must be unique`);
    seenIds.add(cta.id);
  }
});

test('Pricing CTA IDs normalize dynamic plan names', () => {
  assert.equal(toRybbitCtaId('Pro Plan'), 'pro_plan');
  assert.equal(toRybbitCtaId('GPU / H100'), 'gpu_h100');
  assert.equal(toRybbitCtaId('  Free Trial  '), 'free_trial');

  for (const cta of pricingCtas) {
    assert.ok(
      readSource(cta.file).includes(cta.idSource),
      `${cta.file} must declare ${cta.idSource}`,
    );
  }
});

test('Sealos Skills conversion CTAs keep stable business IDs', () => {
  const stableIds = [
    'skills_hero_copy_codex_install',
    'skills_hero_view_github',
    'skills_install_copy_codex',
    'skills_install_copy_claude',
    'skills_install_copy_skills_sh',
    'skills_repository_view_github',
    'skills_final_copy_codex_install',
  ];

  for (const id of stableIds) {
    assert.ok(
      sealosSkillsSources.includes(id),
      `Sealos Skills must declare ${id}`,
    );
  }
});
