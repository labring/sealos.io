'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const ANCHOR_ITEMS = [
  { id: 'quick-start', label: 'Quick Start' },
  { id: 'evidence', label: 'What gets verified' },
  { id: 'prompts', label: 'Example prompts' },
  { id: 'resources', label: 'Resources' },
] as const;

type AnchorId = (typeof ANCHOR_ITEMS)[number]['id'];

export function AgentGuideNav({ agentName }: { agentName: string }) {
  const [activeId, setActiveId] = useState<AnchorId>('quick-start');

  useEffect(() => {
    const sections = ANCHOR_ITEMS.map(({ id }) =>
      document.getElementById(id),
    ).filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (left, right) =>
              Math.abs(left.boundingClientRect.top) -
              Math.abs(right.boundingClientRect.top),
          )[0];

        if (visibleEntry) {
          setActiveId(visibleEntry.target.id as AnchorId);
        }
      },
      {
        rootMargin: '-20% 0px -65% 0px',
        threshold: 0,
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-background/95 sticky top-16 z-30 border-y border-white/10 backdrop-blur-md">
      <nav
        aria-label={`${agentName} guide sections`}
        className="mx-auto flex max-w-[1180px] gap-1 overflow-x-auto px-4 py-2 sm:px-6 lg:px-8"
      >
        {ANCHOR_ITEMS.map((item) => {
          const active = activeId === item.id;

          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={active ? 'location' : undefined}
              className={cn(
                'min-h-9 shrink-0 rounded-md px-3 py-2 text-xs font-semibold transition-colors duration-200 hover:bg-white/[0.05] hover:text-zinc-100 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none motion-reduce:transition-none',
                active ? 'bg-blue-500/10 text-blue-300' : 'text-zinc-500',
              )}
            >
              {item.label}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
