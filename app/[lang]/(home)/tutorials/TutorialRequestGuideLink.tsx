'use client';

import { useGTM } from '@/hooks/use-gtm';
import type {
  TutorialGrowthStage,
  TutorialInventoryStatus,
} from './tutorial-growth-data';
import type { ReactNode } from 'react';

interface TutorialRequestGuideLinkProps {
  framework: string;
  stage: TutorialGrowthStage;
  stageLabel: string;
  slug: string;
  status: TutorialInventoryStatus;
  source: 'journey-rail' | 'framework-matrix';
  className: string;
  children: ReactNode;
}

const CONTACT_EMAIL = 'contact@sealos.io';

function buildMailtoHref({
  framework,
  stageLabel,
  slug,
}: Pick<
  TutorialRequestGuideLinkProps,
  'framework' | 'stageLabel' | 'slug'
>): string {
  const subject = `Request tutorial: ${framework} ${stageLabel} on Sealos`;
  const body = [
    'Hi Sealos team,',
    '',
    'I would like to request this tutorial:',
    `Framework: ${framework}`,
    `Stage: ${stageLabel}`,
    `Suggested slug: ${slug}`,
    '',
    'Source: /tutorials Growth Gateway',
  ].join('\n');

  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function TutorialRequestGuideLink({
  framework,
  stage,
  stageLabel,
  slug,
  status,
  source,
  className,
  children,
}: TutorialRequestGuideLinkProps): JSX.Element {
  const { trackCustom } = useGTM();
  const href = buildMailtoHref({ framework, stageLabel, slug });

  return (
    <a
      href={href}
      className={className}
      aria-label={`Request the ${framework} ${stageLabel} tutorial`}
      data-framework={framework}
      data-stage={stage}
      data-slug={slug}
      data-status={status}
      data-request-source={source}
      onClick={() => {
        trackCustom(
          'tutorial_request_guide',
          {
            framework,
            stage,
            slug,
            status,
            request_source: source,
          },
          { context: 'tutorials' },
        );
      }}
    >
      {children}
    </a>
  );
}
