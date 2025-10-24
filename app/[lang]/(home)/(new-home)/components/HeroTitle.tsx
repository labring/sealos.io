'use client';

import { GradientText } from './GradientText';
import { FramedText } from './FramedText';
import { AiAgentStar } from './AiAgentStar';
import { RotatingWords } from './RotatingWords';

export function HeroTitle() {
  return (
    <div>
      {/* 顶部标签 */}
      <div className="flex w-fit rounded-full border border-white/5 bg-white/5 px-3 py-2 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),_0_2px_4px_-1px_rgba(0,0,0,0.02)]">
        Sealos is the&nbsp;<GradientText>intelligent</GradientText>
        <AiAgentStar className="mt-1 self-start" />
        &nbsp;Cloud OS
      </div>

      {/* 主标题 */}
      <h1 className="mt-5 text-4xl leading-[1.2] sm:text-[3.25rem]">
        <div>
          Ship any&nbsp;
          <FramedText>
            <RotatingWords
              words={['AI Agent', 'Dev Runtime', 'Web App', 'Database']}
              interval={2000}
            />
          </FramedText>
        </div>
        <div>with just a prompt.</div>
      </h1>

      {/* 描述文字 */}
      <p className="mt-5 text-sm text-zinc-400 sm:text-base">
        Describe your needs, and our AI will build the environment, configure
        the database, deploy and scale it globally.
      </p>
    </div>
  );
}
