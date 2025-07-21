'use client';

import React from 'react';
import * as LucideIcons from 'lucide-react';

// Memoized icon component to prevent re-renders
const OptimizedIcon = React.memo(
  ({
    icon,
    className = '',
  }: {
    icon: keyof typeof LucideIcons;
    className?: string;
  }) => {
    const Icon = LucideIcons[icon] as React.ComponentType<{ className?: string }>;
    return Icon ? <Icon className={className} /> : null;
  },
);

OptimizedIcon.displayName = 'OptimizedIcon';

export default OptimizedIcon;