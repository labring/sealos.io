'use client';

import { FramedText } from './FramedText';
import { RotatingWords } from './RotatingWords';

export function HeroTitle({ isInView }: { isInView: boolean }) {
  return (
    <div>
      {/* 主标题 */}
      <h1
        className="mt-5 text-4xl leading-[1.2] sm:text-[3.25rem]"
        aria-label="Ship any AI Agent, Dev Runtime, Web App, Database with just a prompt."
      >
        <div className="text-nowrap whitespace-nowrap">
          Ship any&nbsp;
          <FramedText>
            <RotatingWords
              words={['AI Agent', 'Dev Runtime', 'Web App', 'Database']}
              interval={2000}
              isInView={isInView}
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
