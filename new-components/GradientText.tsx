import { cn } from '@/lib/utils';
import React from 'react';

export function GradientText({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'bg-linear-to-r from-white to-blue-600 bg-clip-text text-transparent',
        className,
      )}
    >
      {children}
    </span>
  );
}
