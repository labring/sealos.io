'use client';

import { GradientText } from '@/new-components/GradientText';
import { FramedText } from '@/new-components/FramedText';
import { RotatingWords } from './RotatingWords';

export function HeroTitle({ isInView }: { isInView: boolean }) {
  return (
    <div>
      <h1 className="sr-only">
        Sealos Cloud Platform: Deploy AI Agents, Dev Runtimes, Web Apps, and
        Databases with Just a Prompt
      </h1>

      <div
        className="text-center text-4xl leading-[1.2] sm:text-5xl"
        aria-hidden="true"
        role="presentation"
      >
        <span className="text-nowrap whitespace-nowrap">
          Ship any
          <FramedText className="mx-4">
            <RotatingWords
              words={['AI Agent', 'Dev Runtime', 'Web App', 'Database']}
              interval={2000}
              isInView={isInView}
            />
          </FramedText>
        </span>
        <span>with just a prompt.</span>
      </div>

      <p className="mt-5 text-center text-sm text-zinc-400 sm:text-base">
        <span className="text-zinc-300">No YAML. No Dockerfile. No CI/CD.</span>{' '}
        Describe what you need in plain English and deploy to production in
        seconds, powered by Kubernetes, without the complexity.
      </p>
    </div>
  );
}
