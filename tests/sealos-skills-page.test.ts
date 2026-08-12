import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();
const route = 'app/[lang]/(home)/sealos-skills';
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
];
const routeSource = routeFiles.map(readSource).join('\n');
const contentSource = readSource(`${route}/content.ts`);
const contextSource = readSource(`${route}/CONTEXT.md`);
const pageSource = readSource(`${route}/page.tsx`);
const landingSource = readSource(`${route}/components.tsx`);
const topSource = readSource(`${route}/top-sections.tsx`);
const accordionSource = readSource('components/ui/accordion.tsx');

test('Sealos Skills uses the official host install paths', () => {
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
    'npx skills add labring/sealos-skills',
    'dist/sealos-1.2.5.zip',
  ];

  for (const command of commands) {
    assert.ok(contentSource.includes(command), `missing command: ${command}`);
  }

  for (const host of [
    'Codex',
    'Claude Code',
    'Qoder',
    'Gemini CLI',
    'Qwen Code',
    'OpenClaw',
    'CodeBuddy',
    'Amp',
    'Kimi',
    'skills.sh',
  ]) {
    assert.ok(
      contentSource.includes(`name: '${host}'`),
      `missing host: ${host}`,
    );
  }

  const agentsBlock = contentSource.slice(
    contentSource.indexOf('export const AGENT_TARGETS = ['),
    contentSource.indexOf('export type SkillIconName'),
  );
  assert.equal([...agentsBlock.matchAll(/installTrackingId:/g)].length, 10);
  assert.equal([...agentsBlock.matchAll(/guideTrackingId:/g)].length, 10);
  for (const integration of [
    'Managed plugin',
    'Packaged plugin',
    'Context extension',
    'ClawHub bundle',
    'Marketplace plugin',
    'Repository import',
    'Direct skill pack',
  ]) {
    assert.ok(
      agentsBlock.includes(`integration: '${integration}'`),
      `missing integration: ${integration}`,
    );
  }
  for (const invocation of [
    'invocation: CODEX_INVOCATION',
    "invocation: '/sealos'",
    "invocation: 'Ask Gemini to use Sealos Skills'",
    "invocation: 'Host runtime'",
    "invocation: 'Host workflow'",
    "invocation: '/sealos-deploy'",
  ]) {
    assert.ok(
      agentsBlock.includes(invocation),
      `missing invocation: ${invocation}`,
    );
  }
  assert.equal(contentSource.includes('dist/sealos-1.2.0.zip'), false);
});

test('Sealos Skills exposes the eight repository skills', () => {
  const skills = [
    'sealos-deploy',
    'sealos-database',
    'sealos-s3',
    'dockerfile-skill',
    'sealos-canvas',
    'sealos-app-builder',
    'cloud-native-readiness',
    'docker-to-sealos',
  ];

  for (const skill of skills) {
    assert.ok(
      contentSource.includes(`id: '${skill}'`),
      `missing skill: ${skill}`,
    );
  }

  const skillsBlock = contentSource.slice(
    contentSource.indexOf('export const SKILL_CATALOG = ['),
    contentSource.indexOf('export const PROOF_ITEMS'),
  );
  assert.equal([...skillsBlock.matchAll(/surface:/g)].length, 8);
  assert.deepEqual(
    [...skillsBlock.matchAll(/title: '([^']+)'/g)].map((match) => match[1]),
    [
      'Deploy and verify your app',
      'Connect a managed database',
      'Add private object storage',
      'Inspect live resources',
      'Build for Sealos Desktop',
      'Find deployment blockers',
      'Create a production Dockerfile',
      'Convert Compose into Sealos',
    ],
  );
});

test('Sealos Skills renders the approved conversion hierarchy and section order', () => {
  for (const copy of [
    'Deploy from your coding agent. See the proof.',
    'Install in Codex',
    'View source on GitHub',
    'From prompt to evidence.',
    'The cloud work between your repo and a live app.',
    'Choose your agent. Copy one install path.',
    'One skill source. 10 documented install paths.',
    'More install paths',
    'Before the first run',
    'Deploy your repo. Keep the evidence.',
    'skills from one source',
    'documented install paths',
    'checked before handoff',
    'inspectable run evidence',
  ]) {
    assert.ok(contentSource.includes(copy), `missing page copy: ${copy}`);
  }

  const orderedSections = [
    '<HeroSection />',
    '<WorkflowSection />',
    '<CapabilitiesSection />',
    '<InstallSection />',
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

  for (const removedCopy of [
    'Use Sealos Skills in the agent you already use.',
    'Pick the install path for your agent.',
    'Install Sealos Skills where you code.',
  ]) {
    assert.equal(
      routeSource.includes(removedCopy),
      false,
      `repeated copy remains: ${removedCopy}`,
    );
  }
});

test('Sealos Skills defines the copy terminology contract', () => {
  for (const term of [
    'Sealos Skills',
    'Agent',
    'Plugin',
    'Install Path',
    'Evidence',
    'Verified Deployment',
    '.sealos/state.json',
  ]) {
    assert.ok(contextSource.includes(term), `missing terminology: ${term}`);
  }
});

test('Sealos Skills keeps the Railway-inspired visual contract focused', () => {
  for (const token of ['#13111C', '#191624', '#4CAFE1', 'rounded-lg']) {
    assert.ok(routeSource.includes(token), `missing visual token: ${token}`);
  }

  assert.ok(topSource.includes('Georgia, "Times New Roman", serif'));
  assert.ok(topSource.includes('text-[42px]'));
  assert.ok(topSource.includes('lg:text-[56px]'));
  assert.equal(routeSource.includes('PageTopRays'), false);
  assert.equal(routeSource.includes('bg-gradient'), false);
  assert.equal(/[—–]/u.test(routeSource), false);
});

test('Sealos Skills install decision, workflows, and FAQ cover the public contract', () => {
  assert.equal(routeSource.includes('AgentDirectorySection'), false);
  assert.equal(routeSource.includes('SupportMatrixSection'), false);
  assert.equal(routeSource.includes('INSTALL_TARGETS'), false);
  assert.equal(routeSource.includes('<table'), false);
  assert.ok(routeSource.includes("type PrimaryInstallId = 'codex' | 'claude'"));
  assert.ok(routeSource.includes('More install paths'));
  assert.ok(routeSource.includes('type="single"'));
  assert.ok(routeSource.includes('collapsible'));
  assert.ok(routeSource.includes('Open install guide'));
  assert.ok(routeSource.includes('Start with {activeTarget.invocation}'));
  assert.ok(routeSource.includes('Start with {agent.invocation}'));
  assert.ok(routeSource.includes('<AnchorAlias id="compatibility" />'));
  assert.ok(routeSource.includes('<AnchorAlias id="support" />'));
  assert.ok(
    accordionSource.includes('motion-reduce:data-[state=closed]:animate-none'),
  );
  assert.ok(
    accordionSource.includes('motion-reduce:data-[state=open]:animate-none'),
  );

  for (const workflowLabel of [
    'Your prompt',
    'What Sealos Skills does',
    'Evidence you get',
    'Verified result',
  ]) {
    assert.ok(routeSource.includes(workflowLabel));
  }

  for (const workflow of ['deploy', 'postgres', 's3', 'canvas']) {
    assert.ok(contentSource.includes(`id: '${workflow}'`));
  }

  for (const prerequisite of [
    'A project and a supported agent',
    'Sealos Cloud access',
    'A container registry for deploys',
    'Tools checked on demand',
    'Sealos workspace',
    'Docker',
    'kubectl',
    '.sealos/state.json',
  ]) {
    assert.ok(
      contentSource.includes(prerequisite),
      `missing prerequisite: ${prerequisite}`,
    );
  }

  const faqBlock = contentSource.slice(
    contentSource.indexOf('export const FAQ_ITEMS = ['),
  );
  assert.equal([...faqBlock.matchAll(/question:/g)].length, 8);
  for (const question of [
    'What do I need to start?',
    'Do I need a Sealos account before installation?',
    'How does Sealos Skills verify a deployment?',
    'How are credentials handled?',
    'When are Docker and kubectl used?',
    'When can I use Canvas?',
    'Can Sealos Skills update an existing deployment?',
    'What comes with the plugin?',
  ]) {
    assert.ok(faqBlock.includes(question), `missing FAQ: ${question}`);
  }
});

test('Sealos Skills metadata includes canonical routing and five schema types', () => {
  assert.ok(pageSource.includes("pathname: '/sealos-skills'"));
  assert.ok(
    pageSource.includes('Sealos Skills: Deploy and Verify Apps with AI Agents'),
  );
  assert.ok(pageSource.includes("softwareVersion: '1.2.5'"));
  assert.ok(
    pageSource.includes(
      'Install Sealos Skills in Codex, Claude Code, and compatible agents. Deploy to Sealos Cloud and review the live URL, rollout, logs, and resources.',
    ),
  );
  assert.ok(pageSource.includes("'@type': 'SoftwareApplication'"));
  assert.ok(pageSource.includes('generateHowToSchema({'));
  assert.ok(pageSource.includes('generateFAQSchema([...FAQ_ITEMS])'));
  assert.ok(pageSource.includes("'@type': 'ItemList'"));
  assert.ok(pageSource.includes('generateBreadcrumbSchema(['));
  assert.ok(pageSource.includes('featureList: SKILL_CATALOG.map('));
  assert.ok(pageSource.includes('numberOfItems: AGENT_TARGETS.length'));
});

test('Sealos Skills conversion CTAs use stable Rybbit IDs', () => {
  const trackingIds = [
    'skills_hero_copy_codex_install',
    'skills_hero_view_github',
    'skills_install_copy_codex',
    'skills_install_copy_claude',
    'skills_install_copy_skills_sh',
    'skills_repository_view_github',
    'skills_final_copy_codex_install',
  ];

  for (const id of trackingIds) {
    assert.ok(routeSource.includes(id), `missing CTA tracking ID: ${id}`);
  }

  for (const pathId of [
    'codex',
    'claude',
    'qoder',
    'gemini',
    'qwen',
    'openclaw',
    'codebuddy',
    'amp',
    'kimi',
    'skills_sh',
  ]) {
    assert.ok(routeSource.includes(`skills_install_copy_${pathId}`));
    assert.ok(routeSource.includes(`skills_install_guide_${pathId}`));
  }

  assert.equal(routeSource.includes('skills_agent_copy_'), false);
  assert.equal(routeSource.includes('skills_agent_guide_'), false);

  const declaredInstallIds = [
    ...contentSource.matchAll(
      /(?:guideTrackingId|installTrackingId): '(skills_install_[^']+)'/g,
    ),
  ].map((match) => match[1]);
  assert.equal(declaredInstallIds.length, 20);
  assert.equal(new Set(declaredInstallIds).size, 20);
});

test('Sealos Skills ships the real Codex plugin screenshot', () => {
  const assetPath = path.join(
    root,
    'public/images/sealos-skills/codex-sealos.png',
  );

  assert.equal(existsSync(assetPath), true);
  assert.ok(statSync(assetPath).size > 100_000);
  assert.ok(topSource.includes('width={2922}'));
  assert.ok(topSource.includes('height={1888}'));
  assert.ok(topSource.includes('Codex plugin picker showing Sealos Skills'));
});
