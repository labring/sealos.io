'use client';

import { GradientText } from '@/new-components/GradientText';
import { FramedText } from './FramedText';
import { RotatingWords } from './RotatingWords';
import { AiAgentStar } from '@/new-components/AiAgentStar';
import ltAvatar from '@/assets/lt.png';
import rbAvatar from '@/assets/rb.png';
import lbAvatar from '@/assets/lb.png';
import Image from 'next/image';

export function HeroTitle({ isInView }: { isInView: boolean }) {
  return (
    <div>
      {/* 顶部标签 */}
      <div className="mx-auto flex w-fit rounded-full border border-white/5 bg-white/5 px-3 py-2 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),_0_2px_4px_-1px_rgba(0,0,0,0.02)]">
        <div className="mr-1 flex items-center">
          <Image
            src={ltAvatar}
            alt="Avatar"
            className="z-20 -mr-2 size-5 rounded-full border border-neutral-500"
          />
          <Image
            src={rbAvatar}
            alt="Avatar"
            className="z-10 -mr-2 size-5 rounded-full border border-neutral-500"
          />
          <Image
            src={lbAvatar}
            alt="Avatar"
            className="size-5 rounded-full border"
          />
        </div>
        Trusted by&nbsp;<GradientText>10K+</GradientText>
        <AiAgentStar className="mt-1 self-start" aria-hidden="true" />
        &nbsp;developers
      </div>

      {/* 主标题 */}
      <h1
        className="mt-9 text-center text-4xl leading-[1.2] sm:text-5xl"
        aria-label="Ship any AI Agent, Dev Runtime, Web App, Database with just a prompt."
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
      </h1>

      <p className="mt-5 text-center text-sm text-zinc-400 sm:text-base">
        Generate fully managed web apps and agents with AI simply by describing
        them.
      </p>
    </div>
  );
}
