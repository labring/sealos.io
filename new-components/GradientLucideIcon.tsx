import React from 'react';

import type { LucideIcon } from 'lucide-react';

export function GradientLucideIcon({
  Icon,
  className,
  from = '#ffffff',
  to = '#2563eb',
  ...props
}: {
  Icon: LucideIcon;
  className?: string;
  from?: string;
  to?: string;
} & React.ComponentProps<LucideIcon>) {
  const id = React.useId();

  return (
    <Icon {...props} className={className} color={`url(#${id})`}>
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
    </Icon>
  );
}
