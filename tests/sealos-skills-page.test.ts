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
const pageSource = readSource(`${route}/page.tsx`);
const landingSource = readSource(`${route}/components.tsx`);
const topSource = readSource(`${route}/top-sections.tsx`);

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
    contentSource.indexOf('export type InstallTargetId'),
  );
  assert.equal([...agentsBlock.matchAll(/copyTrackingId:/g)].length, 10);
  for (const mode of [
    'Plugin',
    'Package import',
    'Extension',
    'Bundle',
    'Repo import',
    'Skill pack',
  ]) {
    assert.ok(agentsBlock.includes(`mode: '${mode}'`), `missing mode: ${mode}`);
  }
  for (const invocation of [
    'invocation: CODEX_INVOCATION',
    "invocation: '/sealos'",
    'Host command exposure depends on the ClawHub runtime',
    'Host command exposure depends on the CodeBuddy runtime',
    "invocation: 'Host-dependent'",
    "invocation: '/sealos-deploy'",
  ]) {
    assert.ok(
      agentsBlock.includes(invocation),
      `missing invocation: ${invocation}`,
    );
  }
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
      'Deploy a verified app',
      'Connect managed databases',
      'Provision private S3 storage',
      'Inspect live resources',
      'Build a Sealos Desktop app',
      'Assess cloud readiness',
      'Generate a Dockerfile',
      'Convert Compose to Sealos',
    ],
  );
});

test('Sealos Skills renders the approved conversion hierarchy and section order', () => {
  for (const copy of [
    'Your agent writes the code. Sealos ships it.',
    'Install in Codex',
    'Bring the same cloud path to your favorite agent.',
    'One skill pack. Clear host paths.',
    'What your agent can finish on Sealos Cloud',
    'From prompt to evidence.',
    'Install once. Use the same workflow everywhere.',
    'Before the first run',
    'Install the skill. Ship the runtime.',
  ]) {
    assert.ok(contentSource.includes(copy), `missing page copy: ${copy}`);
  }

  const orderedSections = [
    '<HeroSection />',
    '<AgentDirectorySection />',
    '<SupportMatrixSection />',
    '<CapabilitiesSection />',
    '<WorkflowSection />',
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

test('Sealos Skills matrix, workflows, and FAQ cover the public contract', () => {
  for (const column of [
    'Agent',
    'Install mode',
    'Install path',
    'Invoke',
    'Deploy',
    'Database',
    'S3',
    'Canvas',
  ]) {
    assert.ok(
      routeSource.includes(`'${column}'`),
      `missing matrix column: ${column}`,
    );
  }

  for (const workflow of ['deploy', 'postgres', 's3', 'canvas']) {
    assert.ok(contentSource.includes(`id: '${workflow}'`));
  }

  for (const prerequisite of [
    'Sealos Cloud account',
    'Container registry access',
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
});

test('Sealos Skills metadata includes canonical routing and five schema types', () => {
  assert.ok(pageSource.includes("pathname: '/sealos-skills'"));
  assert.ok(
    pageSource.includes('Sealos Skills: Deploy with Your AI Coding Agent'),
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

  for (const agentId of [
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
    assert.ok(routeSource.includes(`skills_agent_copy_${agentId}`));
    assert.ok(routeSource.includes(`skills_agent_guide_${agentId}`));
  }
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
