'use client';

import { GradientText } from '@/new-components/GradientText';
import { FramedText } from '@/new-components/FramedText';
import { RotatingWords } from './rotating-words';

export function HeroTitle({ isInView }: { isInView: boolean }) {
  return (
    <div>
      <h1 className="sr-only">
        Sealos Cloud Platform: Deploy full-stack apps from a repo, docker image,
        template, or prompt.
      </h1>

      <div
        className="text-center text-4xl leading-[1.2] sm:text-5xl"
        aria-hidden="true"
        role="presentation"
      >
        <span className="text-nowrap whitespace-nowrap">
          Deploy full-stack apps from a
          <FramedText className="mx-4">
            <RotatingWords
              words={['repo', 'docker image', 'template', 'prompt']}
              interval={2000}
              isInView={isInView}
            />
          </FramedText>
          .
        </span>
      </div>

      <p className="mt-5 text-center text-sm text-zinc-400 sm:text-base">
        <span className="text-zinc-300">No YAML. No Dockerfile. No CI/CD.</span>{' '}
        Deploy the full stack, connect managed data services, and operate
        everything from one application view.
      </p>
    </div>
  );
}
