'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownProps {
  children: string;
  className?: string;
}

export function LightMarkdown({ children, className = '' }: MarkdownProps) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          strong: ({ children }) => (
            <strong className="text-primary font-normal">{children}</strong>
          ),
          p: ({ children }) => (
            <p className="text-muted-foreground">{children}</p>
          ),
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto">
              <table className="w-full border-collapse text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="border-b border-zinc-700">{children}</thead>
          ),
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => (
            <tr className="border-b border-zinc-800 last:border-b-0">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-3 py-2 text-left font-semibold">{children}</th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2">{children}</td>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
