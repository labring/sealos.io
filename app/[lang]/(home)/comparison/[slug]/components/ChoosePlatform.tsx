'use client';

import { ComparisonConfig } from '../../config/platforms';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChoosePlatformProps {
  firstPlatform: ComparisonConfig;
  secondPlatform: ComparisonConfig;
}

export function ChoosePlatform({
  firstPlatform,
  secondPlatform,
}: ChoosePlatformProps) {
  // Use guidance from first platform (both should have the same guidance)
  const guidance = firstPlatform.content.guidance;

  return (
    <div className="space-y-8">
      <div className="prose prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h2: ({ children }) => (
              <h2 className="mb-6 text-center text-3xl font-bold">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="mb-4 text-xl font-semibold">{children}</h3>
            ),
            ul: ({ children }) => <ul className="space-y-4">{children}</ul>,
            li: ({ children }) => (
              <li className="flex gap-3">
                <span className="mt-1 shrink-0">✅</span>
                <div className="flex-1">{children}</div>
              </li>
            ),
            p: ({ children }) => (
              <p className="text-muted-foreground">{children}</p>
            ),
            strong: ({ children }) => (
              <strong className="font-semibold text-zinc-200">
                {children}
              </strong>
            ),
          }}
        >
          {guidance}
        </ReactMarkdown>
      </div>
    </div>
  );
}
