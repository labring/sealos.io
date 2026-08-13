import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import StructuredDataComponent from '@/components/structured-data';
import { siteConfig } from '@/config/site';
import { LANGUAGES, type languagesType } from '@/lib/i18n';
import { generatePageMetadata } from '@/lib/utils/metadata';
import {
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateHowToSchema,
} from '@/lib/utils/structured-data';
import { AgentGuidePage } from './agent-guide-page';
import {
  AGENT_GUIDES,
  DEPLOYMENT_EVIDENCE,
  getAgentGuide,
  REPO_URL,
  SKILL_CATALOG,
} from '../content';

type AgentPageProps = {
  params: {
    lang: languagesType;
    agent: string;
  };
};

export function generateStaticParams() {
  return LANGUAGES.flatMap((lang) =>
    AGENT_GUIDES.map((agent) => ({ lang, agent: agent.id })),
  );
}

export function generateMetadata({ params }: AgentPageProps): Metadata {
  const agent = getAgentGuide(params.agent);

  if (!agent) {
    return { title: 'Agent Guide Not Found' };
  }

  return generatePageMetadata({
    title: `Sealos Skills for ${agent.name}: Deploy to Sealos Cloud`,
    description: `Install Sealos Skills in ${agent.name}. Deploy apps to Sealos Cloud and review the live URL, rollout, logs, resources, and saved run state.`,
    pathname: agent.path,
    lang: params.lang,
    keywords: [
      `${agent.name} Sealos Skills`,
      `${agent.name} Sealos Cloud deployment`,
      `${agent.name} install Sealos plugin`,
      'AI coding agent deployment',
      'verified cloud deployment',
    ],
  });
}

export default function SealosSkillsAgentPage({ params }: AgentPageProps) {
  const agent = getAgentGuide(params.agent);

  if (!agent) {
    notFound();
  }

  const pageUrl = `${siteConfig.url.base}${agent.path}/`;
  const description = `Install Sealos Skills in ${agent.name} and deploy to Sealos Cloud with reviewable runtime evidence.`;
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: `Sealos Skills for ${agent.name}`,
      description,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: agent.name,
      url: pageUrl,
      sameAs: REPO_URL,
      installUrl: pageUrl,
      softwareVersion: '1.2.5',
      featureList: SKILL_CATALOG.map(
        (skill) => `${skill.title}: ${skill.description}`,
      ),
      softwareRequirements: agent.installNote,
    },
    generateHowToSchema({
      name: `Install Sealos Skills in ${agent.name}`,
      description,
      steps: agent.quickStart.map((step) => ({
        name: step.title,
        text: step.command
          ? `${step.description} Run: ${step.command}`
          : step.description,
      })),
    }),
    generateFAQSchema([...agent.faq]),
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `Deployment evidence returned through ${agent.name}`,
      numberOfItems: DEPLOYMENT_EVIDENCE.length,
      itemListElement: DEPLOYMENT_EVIDENCE.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.title,
        description: item.description,
      })),
    },
    generateBreadcrumbSchema(
      [
        { name: 'Home', url: siteConfig.url.base },
        {
          name: 'Sealos Skills',
          url: `${siteConfig.url.base}/sealos-skills/`,
        },
        { name: agent.name, url: pageUrl },
      ],
      params.lang,
    ),
  ];

  return (
    <>
      <StructuredDataComponent data={structuredData} />
      <AgentGuidePage agent={agent} lang={params.lang} />
    </>
  );
}
