import type { Metadata } from 'next';
import StructuredDataComponent from '@/components/structured-data';
import type { languagesType } from '@/lib/i18n';
import { generatePageMetadata } from '@/lib/utils/metadata';
import {
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateHowToSchema,
  type StructuredData,
} from '@/lib/utils/structured-data';
import { SealosSkillsLanding } from './components';
import {
  AGENT_GUIDES,
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
  'Install Sealos Skills in Codex, Claude Code, and compatible agents. Deploy to Sealos Cloud and review the live URL, rollout, logs, and resources.';

export function generateMetadata({
  params,
}: {
  params: { lang: languagesType };
}): Metadata {
  return generatePageMetadata({
    title: 'Sealos Skills: Deploy and Verify Apps with AI Agents',
    description: SEO_DESCRIPTION,
    pathname: '/sealos-skills',
    lang: params.lang,
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

export default function SealosSkillsPage({
  params,
}: {
  params: { lang: languagesType };
}) {
  return (
    <>
      <StructuredDataComponent data={getSealosSkillsStructuredData()} />
      <SealosSkillsLanding lang={params.lang} />
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
      softwareVersion: '1.2.5',
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
        'A compatible AI coding agent and project, with Sealos Cloud and registry access when the selected workflow requires them.',
      featureList: SKILL_CATALOG.map(
        (skill) => `${skill.title}: ${skill.description}`,
      ),
    },
    generateHowToSchema({
      name: 'Deploy an app with Sealos Skills',
      description:
        'Install Sealos Skills, deploy a repo, and review the live URL, rollout, logs, and resources.',
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
      numberOfItems: AGENT_GUIDES.length,
      itemListElement: AGENT_GUIDES.map((agent, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: agent.name,
        item: {
          '@type': 'SoftwareApplication',
          name: agent.name,
          description: `${agent.integration}: ${agent.installNote}`,
          applicationCategory: 'DeveloperApplication',
          url: `${SEALOS_SKILLS_URL}${agent.id}/`,
        },
      })),
    },
    generateBreadcrumbSchema([
      { name: 'Home', url: 'https://sealos.io/' },
      { name: 'Sealos Skills', url: SEALOS_SKILLS_URL },
    ]),
  ];
}
