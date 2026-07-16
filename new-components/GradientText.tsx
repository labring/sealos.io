import { cn } from '@/lib/utils';
import React from 'react';

export function GradientText({
  as: Component = 'span',
  children,
  className,
}: {
  as?: React.ElementType;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <Component
      className={cn(
        'bg-linear-to-r from-white to-blue-600 bg-clip-text text-transparent',
        className,
      )}
    >
      {children}
    </Component>
  );
}
