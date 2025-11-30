'use client';

import { GradientText } from '@/new-components/GradientText';
import { FramedText } from './FramedText';
import { RotatingWords } from './RotatingWords';
import { Star, ShieldCheck } from 'lucide-react';

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
          <svg
            className="size-4"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
          <span>
            <GradientText>16K+</GradientText> Stars
          </span>
        </a>

        <span className="text-zinc-600">·</span>

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
        <span className="text-zinc-300">No YAML. No Dockerfile. No CI/CD.</span>
        {' '}Describe what you need in plain English and deploy to production
        in seconds—powered by Kubernetes, without the complexity.
      </p>
    </div>
  );
}
