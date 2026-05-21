import type { Metadata } from 'next';
import StructuredDataComponent from '@/components/structured-data';
import { generatePageMetadata } from '@/lib/utils/metadata';
import {
  generateBreadcrumbSchema,
  generateHowToSchema,
  type StructuredData,
} from '@/lib/utils/structured-data';
import { SealosSkillsLanding } from './components';
import {
  DEPLOY_COMMAND,
  DIRECT_DEPLOY_COMMAND,
  INSTALL_COMMAND,
  REPO_URL,
} from './content';

const SEALOS_SKILLS_URL = 'https://sealos.io/sealos-skills/';
const SEO_DESCRIPTION =
  'Install Sealos Skills for Codex, Claude Code, Gemini, and Qwen. Let AI coding agents inspect projects, generate Docker and Sealos artifacts, deploy to Sealos Cloud, and verify rollouts.';

export function generateMetadata(): Metadata {
  return generatePageMetadata({
    title: 'Sealos Skills: Deploy Apps from AI Coding Agents',
    description: SEO_DESCRIPTION,
    pathname: '/sealos-skills',
    keywords: [
      'Sealos Skills',
      'AI agent deployment',
      'AI coding assistant deployment',
      'Codex deployment',
      'Claude Code deployment',
      'Sealos Cloud deployment',
      'Dockerfile generation',
      'Kubernetes rollout',
      'kubectl deployment',
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
      operatingSystem: 'Web, CLI',
      url: SEALOS_SKILLS_URL,
      sameAs: REPO_URL,
      installUrl: REPO_URL,
      publisher: {
        '@type': 'Organization',
        name: 'Labring',
        url: 'https://sealos.io/',
      },
      brand: {
        '@type': 'Brand',
        name: 'Sealos',
      },
      featureList: [
        'Agent preflight for Sealos auth, workspace, git, Docker, gh, kubectl, curl, and jq',
        'Dockerfile and deploy artifact generation for inspected projects',
        'Sealos template generation for repeatable deployments',
        'Deploy and update workflows for Sealos Cloud',
        'Rollout verification for pods, endpoints, and app URLs',
      ],
    },
    generateHowToSchema({
      name: 'Deploy an app with Sealos Skills',
      description:
        'Install Sealos Skills, run the deploy command, inspect the project, generate deployment artifacts, and verify the Sealos Cloud rollout.',
      steps: [
        {
          name: 'Install the Sealos Skills plugin',
          text: `Run ${INSTALL_COMMAND} to add Sealos Skills to your AI coding assistant. Direct skill hosts can use ${DIRECT_DEPLOY_COMMAND} after installation.`,
        },
        {
          name: 'Run the deploy command',
          text: `Start a deployment with ${DEPLOY_COMMAND}, passing a local project folder or GitHub URL.`,
        },
        {
          name: 'Preflight the project and environment',
          text: 'Sealos Skills checks Sealos auth, workspace access, git, Docker, gh, kubectl, curl, jq, project runtime, ports, databases, and environment variables.',
        },
        {
          name: 'Generate Docker and Sealos artifacts',
          text: 'The agent creates inspectable Docker and Sealos template artifacts, including .sealos analysis, build, template, and state files.',
        },
        {
          name: 'Deploy and verify the rollout',
          text: 'Sealos Skills deploys or updates the app on Sealos Cloud, then verifies pods, endpoints, URLs, and rollout status.',
        },
      ],
    }),
    generateBreadcrumbSchema([
      { name: 'Home', url: 'https://sealos.io/' },
      { name: 'Sealos Skills', url: SEALOS_SKILLS_URL },
    ]),
  ];
}
