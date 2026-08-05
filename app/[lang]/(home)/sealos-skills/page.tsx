import type { Metadata } from 'next';
import StructuredDataComponent from '@/components/structured-data';
import { generatePageMetadata } from '@/lib/utils/metadata';
import {
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateHowToSchema,
  type StructuredData,
} from '@/lib/utils/structured-data';
import { SealosSkillsLanding } from './components';
import {
  AGENT_TARGETS,
  CODEX_INSTALL_COMMAND,
  DEPLOY_PROMPT,
  FAQ_ITEMS,
  REPO_URL,
  SKILL_CATALOG,
} from './content';

const SEALOS_SKILLS_URL = 'https://sealos.io/sealos-skills/';
const SEALOS_SKILLS_IMAGE =
  'https://sealos.io/images/sealos-skills/codex-sealos.png';
const SEO_DESCRIPTION =
  'Install Sealos Skills in Codex, Claude Code, Qoder, Gemini, Qwen, and compatible AI coding agents. Deploy apps, connect databases and S3 storage, and verify cloud rollouts on Sealos.';

export function generateMetadata(): Metadata {
  return generatePageMetadata({
    title: 'Sealos Skills: Deploy with Your AI Coding Agent',
    description: SEO_DESCRIPTION,
    pathname: '/sealos-skills',
    keywords: [
      'Sealos Skills',
      'AI coding agent deployment',
      'Codex plugin',
      'Claude Code plugin',
      'Qoder plugin',
      'Gemini CLI extension',
      'Qwen Code extension',
      'Sealos Cloud deployment',
      'managed database',
      'S3 object storage',
    ],
    languageAlternates: {
      en: SEALOS_SKILLS_URL,
      'x-default': SEALOS_SKILLS_URL,
    },
  });
}

export default function SealosSkillsPage() {
  return (
    <>
      <StructuredDataComponent data={getSealosSkillsStructuredData()} />
      <SealosSkillsLanding />
    </>
  );
}

function getSealosSkillsStructuredData(): StructuredData[] {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Sealos Skills',
      description: SEO_DESCRIPTION,
      applicationCategory: 'DeveloperApplication',
      operatingSystem:
        'Codex CLI, Codex App, Claude Code, Qoder, Gemini CLI, Qwen Code',
      url: SEALOS_SKILLS_URL,
      sameAs: REPO_URL,
      installUrl: REPO_URL,
      screenshot: SEALOS_SKILLS_IMAGE,
      publisher: {
        '@type': 'Organization',
        name: 'Labring',
        url: 'https://sealos.io/',
      },
      brand: {
        '@type': 'Brand',
        name: 'Sealos',
      },
      softwareRequirements:
        'A compatible AI coding agent, a Sealos Cloud account, and container registry access for deployment.',
      featureList: SKILL_CATALOG.map(
        (skill) => `${skill.title}: ${skill.description}`,
      ),
    },
    generateHowToSchema({
      name: 'Deploy an app with Sealos Skills',
      description:
        'Install Sealos Skills, invoke the deploy workflow, and review the verified Sealos Cloud runtime.',
      image: SEALOS_SKILLS_IMAGE,
      steps: [
        {
          name: 'Install Sealos Skills in Codex',
          text: `Run ${CODEX_INSTALL_COMMAND} to install the managed Sealos plugin.`,
        },
        {
          name: 'Start the deploy workflow',
          text: `Use ${DEPLOY_PROMPT} with a local project or GitHub URL.`,
        },
        {
          name: 'Review deployment evidence',
          text: 'Review generated .sealos artifacts, the application URL, rollout status, logs, and resource footprint.',
        },
      ],
    }),
    generateFAQSchema([...FAQ_ITEMS]),
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Sealos Skills supported agent hosts',
      numberOfItems: AGENT_TARGETS.length,
      itemListElement: AGENT_TARGETS.map((agent, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: agent.name,
        item: {
          '@type': 'SoftwareApplication',
          name: agent.name,
          applicationCategory: 'DeveloperApplication',
          url: agent.guideHref,
        },
      })),
    },
    generateBreadcrumbSchema([
      { name: 'Home', url: 'https://sealos.io/' },
      { name: 'Sealos Skills', url: SEALOS_SKILLS_URL },
    ]),
  ];
}
