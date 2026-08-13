import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();
const route = 'app/[lang]/(home)/sealos-skills';
const detailRoute = `${route}/[agent]`;
const readSource = (filePath: string) =>
  readFileSync(path.join(root, filePath), 'utf8');

const routeFiles = [
  `${route}/page.tsx`,
  `${route}/components.tsx`,
  `${route}/content.ts`,
  `${route}/top-sections.tsx`,
  `${route}/bottom-sections.tsx`,
  `${route}/interactive-sections.tsx`,
  `${route}/copy-command.tsx`,
  `${route}/shared.tsx`,
  `${route}/agent-directory.tsx`,
  `${route}/agent-logo-rotator.tsx`,
  `${detailRoute}/page.tsx`,
  `${detailRoute}/agent-guide-page.tsx`,
  `${detailRoute}/agent-guide-nav.tsx`,
];
const routeSource = routeFiles.map(readSource).join('\n');
const contentSource = readSource(`${route}/content.ts`);
const contextSource = readSource(`${route}/CONTEXT.md`);
const pageSource = readSource(`${route}/page.tsx`);
const detailPageSource = readSource(`${detailRoute}/page.tsx`);
const detailViewSource = readSource(`${detailRoute}/agent-guide-page.tsx`);
const detailNavSource = readSource(`${detailRoute}/agent-guide-nav.tsx`);
const detailUiSource = `${detailViewSource}\n${detailNavSource}`;
const landingSource = readSource(`${route}/components.tsx`);
const directorySource = readSource(`${route}/agent-directory.tsx`);
const topSource = readSource(`${route}/top-sections.tsx`);
const rotatorSource = readSource(`${route}/agent-logo-rotator.tsx`);
const sharedSource = readSource(`${route}/shared.tsx`);
const sitemapSource = readSource('app/sitemap.ts');
const localeRoutesSource = readSource('config/default-locale-routes.mjs');

const agentIds = [
  'codex',
  'claude',
  'gemini',
  'openclaw',
  'qwen',
  'kimi',
  'amp',
  'qoder',
  'codebuddy',
] as const;

test('Sealos Skills keeps every verified install path and distribution command', () => {
  const commands = [
    'codex plugin marketplace add labring/sealos-skills',
    'codex plugin add sealos@sealos',
    'claude plugin marketplace add labring/sealos-skills',
    'claude plugin install sealos@sealos',
    'python3 scripts/package-qoder-plugin.py',
    'gemini extensions install https://github.com/labring/sealos-skills',
    'qwen extensions install https://github.com/labring/sealos-skills',
    'clawhub install labring/sealos-skills',
    '/plugin marketplace add labring/sealos-skills',
    'amp skill add https://github.com/labring/sealos-skills.git',
    'cp -R .sealos-skills/skills/. .agents/skills/',
    'npx skills add labring/sealos-skills',
    'dist/sealos-1.2.5.zip',
  ];

  for (const command of commands) {
    assert.ok(contentSource.includes(command), `missing command: ${command}`);
  }

  for (const host of [
    'Codex',
    'Claude Code',
    'Gemini CLI',
    'OpenClaw',
    'Qwen Code',
    'Kimi Code',
    'Amp',
    'Qoder',
    'CodeBuddy',
    'skills.sh',
  ]) {
    assert.ok(
      contentSource.includes(`name: '${host}'`),
      `missing target: ${host}`,
    );
  }

  assert.ok(contentSource.includes("invocation: '/skill:sealos-deploy'"));
  assert.ok(contentSource.includes('AGENT_IDS = ['));
  assert.ok(contentSource.includes('SKILLS_SH_TARGET = AGENT_TARGETS[9]'));
  assert.equal(contentSource.includes('dist/sealos-1.2.0.zip'), false);
});

test('Sealos Skills exposes eight real skills and six deployment evidence types', () => {
  for (const skill of [
    'sealos-deploy',
    'sealos-database',
    'sealos-s3',
    'sealos-canvas',
    'sealos-app-builder',
    'cloud-native-readiness',
    'dockerfile-skill',
    'docker-to-sealos',
  ]) {
    assert.ok(
      contentSource.includes(`id: '${skill}'`),
      `missing skill: ${skill}`,
    );
  }

  for (const evidence of [
    'Live application URL',
    'Rollout and workload health',
    'Runtime logs',
    'Relevant page checks',
    'Resource footprint',
    'Saved run state',
    '.sealos/state.json',
  ]) {
    assert.ok(
      contentSource.includes(evidence),
      `missing evidence: ${evidence}`,
    );
  }
});

test('Hub places the Agent directory directly after the Hero', () => {
  for (const copy of [
    'Deploy from your coding agent. See the proof.',
    'Connect Sealos Skills to your coding agent.',
    '9 Agent guides. One shared skill source.',
    'Install through skills.sh',
    'From prompt to evidence.',
    'The cloud work between your repo and a live app.',
    'Before the first run',
    'Deploy your repo. Keep the evidence.',
  ]) {
    assert.ok(contentSource.includes(copy), `missing Hub copy: ${copy}`);
  }

  const orderedSections = [
    '<HeroSection />',
    '<AgentDirectorySection lang={lang} />',
    '<WorkflowSection />',
    '<CapabilitiesSection />',
    '<SetupFaqSection />',
    '<FinalCtaSection />',
  ];
  let previousIndex = -1;
  for (const section of orderedSections) {
    const sectionIndex = landingSource.indexOf(section);
    assert.ok(
      sectionIndex > previousIndex,
      `incorrect section order: ${section}`,
    );
    previousIndex = sectionIndex;
  }

  assert.ok(directorySource.includes('AGENT_GUIDES.map'));
  assert.ok(directorySource.includes('View {agent.name} guide'));
  assert.ok(directorySource.includes('SKILLS_SH_TARGET'));
  assert.equal(routeSource.includes('InstallTabs'), false);

  for (const removedCopy of [
    'Use Sealos Skills in the agent you already use.',
    'Pick the install path for your agent.',
    'Install Sealos Skills where you code.',
  ]) {
    assert.equal(routeSource.includes(removedCopy), false);
  }
});

test('Agent guide data covers nine routes with tailored content', () => {
  for (const id of agentIds) {
    assert.ok(contentSource.includes(`'${id}'`), `missing Agent id: ${id}`);
    assert.ok(
      contentSource.includes(`${id}: {`),
      `missing guide details: ${id}`,
    );
    assert.ok(
      contentSource.includes(`skills_install_copy_${id}`),
      `missing install analytics: ${id}`,
    );
    assert.ok(
      contentSource.includes(`skills_install_guide_${id}`),
      `missing guide analytics: ${id}`,
    );
  }

  assert.ok(contentSource.includes('createQuickStart('));
  assert.ok(contentSource.includes('createPrompts('));
  assert.ok(contentSource.includes('createAgentFaq('));
  assert.ok(contentSource.includes('related:'));
  assert.ok(contentSource.includes('Gemini CLI supports Google sign-in'));
  assert.ok(contentSource.includes('Kimi Code'));
});

test('Agent guide route generates localized static pages, metadata, and five schemas', () => {
  assert.ok(detailPageSource.includes('LANGUAGES.flatMap'));
  assert.ok(detailPageSource.includes('AGENT_GUIDES.map'));
  assert.ok(
    detailPageSource.includes(
      'Sealos Skills for ${agent.name}: Deploy to Sealos Cloud',
    ),
  );
  assert.ok(detailPageSource.includes('pathname: agent.path'));
  assert.ok(detailPageSource.includes("'@type': 'SoftwareApplication'"));
  assert.ok(detailPageSource.includes('generateHowToSchema({'));
  assert.ok(detailPageSource.includes('generateFAQSchema([...agent.faq])'));
  assert.ok(detailPageSource.includes("'@type': 'ItemList'"));
  assert.ok(detailPageSource.includes('generateBreadcrumbSchema('));
  assert.ok(detailPageSource.includes("softwareVersion: '1.2.5'"));
  assert.ok(sitemapSource.includes('AGENT_GUIDES.map((agent) => agent.path)'));
  assert.ok(localeRoutesSource.includes("'/sealos-skills'"));
});

test('Agent guide visual contract includes navigation, three steps, prompts, FAQ, and final CTA', () => {
  for (const copy of [
    'Deploy to Sealos Cloud with {agent.name}',
    'Copy install path',
    'Quick Start',
    'What gets verified',
    'Example prompts',
    'Resources',
    'What Sealos Skills verifies',
    'Start with a concrete cloud outcome',
    '{agent.name} installation FAQ',
    'Deploy with {agent.name}. Keep the evidence.',
  ]) {
    assert.ok(detailUiSource.includes(copy), `missing detail copy: ${copy}`);
  }

  assert.ok(detailViewSource.includes('<AgentGuideNav'));
  assert.ok(detailNavSource.includes('sticky top-16'));
  assert.ok(detailNavSource.includes('IntersectionObserver'));
  assert.ok(detailNavSource.includes("aria-current={active ? 'location'"));
  assert.ok(detailViewSource.includes('agent.quickStart.map'));
  assert.ok(detailViewSource.includes('agent.prompts.map'));
  assert.ok(detailViewSource.includes('agent.faq.map'));
  assert.ok(detailViewSource.includes('relatedAgents.map'));
  assert.ok(detailViewSource.includes('overflow-x-auto'));
  assert.ok(detailViewSource.includes('focus-visible:ring-2'));
  assert.ok(detailViewSource.includes('motion-reduce:transition-none'));
});

test('Hub keeps its metadata, structured data, anchors, and workflow contract', () => {
  assert.ok(pageSource.includes("pathname: '/sealos-skills'"));
  assert.ok(pageSource.includes('lang: params.lang'));
  assert.ok(pageSource.includes('numberOfItems: AGENT_GUIDES.length'));
  assert.ok(pageSource.includes("'@type': 'SoftwareApplication'"));
  assert.ok(pageSource.includes('generateHowToSchema({'));
  assert.ok(pageSource.includes('generateFAQSchema([...FAQ_ITEMS])'));
  assert.ok(pageSource.includes("'@type': 'ItemList'"));
  assert.ok(pageSource.includes('generateBreadcrumbSchema(['));

  for (const anchor of [
    'skills',
    'compatibility',
    'support',
    'pipeline',
    'use-cases',
    'setup',
    'runtime',
    'repository',
    'faq',
    'install',
  ]) {
    assert.ok(
      routeSource.includes(`id="${anchor}"`),
      `missing anchor: ${anchor}`,
    );
  }

  for (const workflowLabel of [
    'Your prompt',
    'What Sealos Skills does',
    'Evidence you get',
    'Verified result',
  ]) {
    assert.ok(routeSource.includes(workflowLabel));
  }
});

test('Agent icons are localized and retain official source URLs', () => {
  for (const asset of [
    'public/images/apps/openclaw.svg',
    'public/images/sealos-skills/agent-icons/amp.png',
    'public/images/sealos-skills/agent-icons/kimi.png',
  ]) {
    const assetPath = path.join(root, asset);
    assert.equal(existsSync(assetPath), true, `missing icon: ${asset}`);
    assert.ok(statSync(assetPath).size > 500, `invalid icon: ${asset}`);
  }

  for (const icon of ['openclaw', 'amp', 'kimi']) {
    assert.ok(sharedSource.includes(`${icon}: { src:`));
  }

  for (const sourceUrl of [
    'https://openclaw.ai/favicon.svg',
    'https://ampcode.com/app-icon.png?v=3',
    'raw.githubusercontent.com/MoonshotAI/kimi-cli',
  ]) {
    assert.ok(contentSource.includes(sourceUrl));
  }
});

test('Sealos Skills keeps stable Hub analytics and unique Agent analytics templates', () => {
  for (const id of [
    'skills_hero_copy_codex_install',
    'skills_hero_view_github',
    'skills_install_copy_codex',
    'skills_install_copy_claude',
    'skills_install_copy_skills_sh',
    'skills_repository_view_github',
    'skills_final_copy_codex_install',
  ]) {
    assert.ok(routeSource.includes(id), `missing CTA tracking ID: ${id}`);
  }

  for (const template of [
    'skills_agent_guide_${agent.id}',
    'skills_agent_copy_${agent.id}',
    'skills_agent_source_${agent.id}',
    'skills_agent_prompt_${agent.id}_${prompt.id}',
  ]) {
    assert.ok(routeSource.includes(template), `missing template: ${template}`);
  }
});

test('Sealos Skills keeps terminology and uses the Homepage visual system', () => {
  for (const term of [
    'Sealos Skills',
    'Agent',
    'Agent Guide',
    'Plugin',
    'Install Path',
    'Evidence',
    'Verified Deployment',
    '.sealos/state.json',
  ]) {
    assert.ok(contextSource.includes(term), `missing term: ${term}`);
  }

  for (const token of [
    'bg-background',
    '#101219',
    '#13151C',
    '#080A11',
    'blue-500',
    'blue-400',
    'rounded-lg',
  ]) {
    assert.ok(routeSource.includes(token), `missing visual token: ${token}`);
  }
  for (const removedToken of [
    '#13111C',
    '#191624',
    '#15121E',
    '#100E18',
    '#4CAFE1',
    'Georgia',
    'Times New Roman',
  ]) {
    assert.equal(
      routeSource.includes(removedToken),
      false,
      `obsolete visual token remains: ${removedToken}`,
    );
  }
  assert.ok(routeSource.includes('tracking-normal'));
  assert.equal(routeSource.includes('PageTopRays'), false);
  assert.equal(routeSource.includes('bg-gradient'), false);
  assert.equal(/[—–]/u.test(routeSource), false);
});

test('Sealos Skills keeps the Codex asset but removes it from the rendered Hero', () => {
  const assetPath = path.join(
    root,
    'public/images/sealos-skills/codex-sealos.png',
  );
  assert.equal(existsSync(assetPath), true);
  assert.ok(statSync(assetPath).size > 100_000);
  assert.equal(topSource.includes('codex-sealos.png'), false);
  assert.equal(topSource.includes("from 'next/image'"), false);
});

test('Sealos Skills uses continuous panels and complete mobile proof', () => {
  assert.ok(topSource.includes('data-skills-hero-command'));
  assert.ok(topSource.includes('data-skills-proof-grid'));
  assert.ok(topSource.includes('grid-cols-2'));
  assert.ok(topSource.includes('lg:grid-cols-4'));
  assert.ok(directorySource.includes('data-skills-agent-directory'));
  assert.ok(directorySource.includes('gap-px'));
  assert.ok(topSource.includes('data-skills-capability-grid'));
  assert.ok(detailViewSource.includes('data-agent-quick-start-grid'));
  assert.ok(detailViewSource.includes('data-agent-evidence-grid'));
  assert.ok(detailViewSource.includes('data-agent-prompt-grid'));
});

test('Sealos Skills centers the Hero terminal and rotates all Agent logos', () => {
  assert.ok(topSource.includes('flex flex-col items-center text-center'));
  assert.ok(topSource.includes('icons={AGENT_GUIDES.map(({ icon }) => icon)}'));
  assert.ok(
    topSource.includes('<span className="sr-only">{PAGE_COPY.hero.title}'),
  );
  assert.ok(topSource.includes('aria-label="Jump to Agent guide"'));
  assert.ok(topSource.includes('data-agent-logo-nav'));
  assert.ok(topSource.includes('href={`#agent-${agent.id}`}'));
  assert.ok(topSource.includes('data-agent-logo-id={agent.id}'));
  assert.ok(topSource.includes('bg-[#13151C]'));
  assert.ok(topSource.includes('rounded-full bg-white/20'));
  assert.ok(directorySource.includes('id={`agent-${agent.id}`}'));
  assert.ok(directorySource.includes('scroll-mt-32'));
  assert.ok(rotatorSource.includes('ROTATION_DELAY = 2400'));
  assert.ok(rotatorSource.includes('prefers-reduced-motion: reduce'));
  assert.ok(rotatorSource.includes('visibilitychange'));
  assert.ok(rotatorSource.includes('data-agent-logo-rotator'));
  assert.ok(rotatorSource.includes('duration-[320ms]'));
  assert.ok(rotatorSource.includes('aria-hidden="true"'));
});

test('Sealos Skills copy source remains byte-for-byte unchanged', () => {
  const contentHash = createHash('sha256')
    .update(readSource(`${route}/content.ts`))
    .digest('hex');

  assert.equal(
    contentHash,
    '4e7d08050b640903ba7602ffb456734f3ae623e8dda6d6efb126ea54d86dc085',
  );
});
