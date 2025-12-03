'use client';

import { GradientText } from '@/new-components/GradientText';
import { FramedText } from './FramedText';
import { RotatingWords } from './RotatingWords';
import { Star, ShieldCheck } from 'lucide-react';
import { GithubIcon } from '@/components/ui/icons';

export function HeroTitle({ isInView }: { isInView: boolean }) {
  return (
    <div>
      {/* 顶部标签 - 社会证明区 */}
      <div className="mx-auto flex w-fit items-center gap-2 text-sm text-zinc-400 sm:gap-3">
        {/* GitHub Stars */}
        <a
          href="https://github.com/labring/sealos"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-full border border-white/5 bg-white/5 px-3 py-1.5 transition-colors hover:bg-white/10 hover:text-white"
        >
          <GithubIcon />
          <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
          <span>
            <GradientText>16K+</GradientText> Stars
          </span>
        </a>

        <div className="size-1 rounded-full bg-zinc-600" />

        {/* Source Available Badge */}
        <div className="flex items-center gap-1.5 rounded-full border border-white/5 bg-white/5 px-3 py-1.5">
          <ShieldCheck className="size-4 text-emerald-500" />
          <span>100% Source Available</span>
        </div>
      </div>

      {/* SEO H1 - Hidden visually but readable by search engines and screen readers */}
      <h1 className="sr-only">
        Sealos Cloud Platform: Deploy AI Agents, Dev Runtimes, Web Apps, and
        Databases with Just a Prompt
      </h1>

      {/* Visual Title - Decorative, hidden from assistive tech */}
      <div
        className="mt-9 text-center text-4xl leading-[1.2] sm:text-5xl"
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
        seconds—powered by Kubernetes, without the complexity.
      </p>
    </div>
  );
}
