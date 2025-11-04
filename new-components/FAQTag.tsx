import React from 'react';
import { cn } from '@/lib/utils';

interface FAQTagProps {
  label: string;
  color?: string;
  className?: string;
}

export function FAQTag({
  label,
  color = 'bg-blue-400',
  className,
}: FAQTagProps) {
  return (
    <span
      className={cn(
        'text-popover-foreground flex w-fit grow-0 items-center rounded-xl border border-dashed border-white/15 bg-white/5 px-3 py-2 text-sm font-medium whitespace-nowrap',
        className,
      )}
    >
      <div className={cn('mr-2 size-2 rounded-full', color)} />
      <span>{label}</span>
    </span>
  );
}
