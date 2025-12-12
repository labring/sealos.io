'use client';

import ReactMarkdown from 'react-markdown';

interface MarkdownProps {
  children: string;
  className?: string;
}

export function LightMarkdown({ children, className = '' }: MarkdownProps) {
  return (
    <div className={className}>
      <ReactMarkdown
        components={{
          strong: ({ children }) => (
            <strong className="text-primary font-normal">{children}</strong>
          ),
          p: ({ children }) => (
            <p className="text-muted-foreground">{children}</p>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
