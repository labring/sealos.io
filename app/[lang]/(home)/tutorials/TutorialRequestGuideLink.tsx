'use client';

import { useGTM } from '@/hooks/use-gtm';
import type { ReactNode } from 'react';

interface TutorialRequestGuideLinkProps {
  className: string;
  children: ReactNode;
}

const CONTACT_EMAIL = 'contact@sealos.io';

function buildMailtoHref(): string {
  const subject = 'Request a Sealos deployment tutorial';
  const body = [
    'Hi Sealos team,',
    '',
    'I would like to request a deployment tutorial.',
    '',
    'Framework or runtime:',
    'Deployment goal:',
    'Existing project URL (optional):',
    '',
    'Source: /tutorials',
  ].join('\n');

  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function TutorialRequestGuideLink({
  className,
  children,
}: TutorialRequestGuideLinkProps): JSX.Element {
  const { trackCustom } = useGTM();
  const href = buildMailtoHref();

  return (
    <a
      href={href}
      className={className}
      aria-label="Request a Sealos deployment tutorial"
      data-request-source="tutorial-catalog"
      onClick={() => {
        trackCustom(
          'tutorial_request_guide',
          { request_source: 'tutorial-catalog' },
          { context: 'tutorials' },
        );
      }}
    >
      {children}
    </a>
  );
}
