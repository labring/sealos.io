import { cn } from '@/lib/utils';
import React from 'react';

export function FramedText({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const gradientId = React.useId();

  return (
    <span
      className={cn(
        'relative inline-block overflow-visible [--bg:color-mix(in_oklab,_var(--color-white),_transparent_95%)] [--from:var(--color-white)] [--to:var(--color-blue-600)]',
        className,
      )}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ overflow: 'visible' }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--from)" />
            <stop offset="100%" stopColor="var(--to)" />
          </linearGradient>
        </defs>

        {/* LT */}
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="var(--bg)"
          stroke={`url(#${gradientId})`}
          strokeWidth="1"
        />

        <rect x="-2" y="-2" width="4" height="4" fill={`url(#${gradientId})`} />

        {/* RT */}
        <rect
          x="100%"
          y="-2"
          width="4"
          height="4"
          fill={`url(#${gradientId})`}
          style={{ transform: 'translateX(-2px)' }}
        />

        {/* LB */}
        <rect
          x="-2"
          y="calc(100% - 2px)"
          width="4"
          height="4"
          fill={`url(#${gradientId})`}
        />

        {/* RB */}
        <rect
          x="100%"
          y="calc(100% - 2px)"
          width="4"
          height="4"
          fill={`url(#${gradientId})`}
          style={{ transform: 'translateX(-2px)' }}
        />
      </svg>

      <span className="relative z-10 inline-block px-3 py-1">{children}</span>
    </span>
  );
}
