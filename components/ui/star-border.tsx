import React from 'react';

import { cn } from '@/lib/utils';

import styles from './star-border.module.css';

type StarBorderProps<T extends React.ElementType> =
  React.ComponentPropsWithoutRef<T> & {
    as?: T;
    children?: React.ReactNode;
    color?: string;
    contentClassName?: string;
    speed?: React.CSSProperties['animationDuration'];
    thickness?: number;
  };

export function StarBorder<T extends React.ElementType = 'button'>({
  as,
  className,
  children,
  color = 'white',
  contentClassName,
  speed = '6s',
  thickness = 1,
  style,
  ...rest
}: StarBorderProps<T>) {
  const Component = as || 'button';

  return (
    <Component
      className={cn(
        styles.track,
        'relative inline-block overflow-hidden rounded-full',
        className,
      )}
      style={
        {
          '--star-border-color': color,
          '--star-border-speed': speed,
          '--star-border-thickness': `${thickness}px`,
          ...style,
        } as React.CSSProperties
      }
      {...(rest as React.ComponentPropsWithoutRef<T>)}
    >
      <span className={cn(styles.flare, styles.bottom)} aria-hidden="true" />
      <span className={cn(styles.flare, styles.top)} aria-hidden="true" />
      <span
        className={cn(
          'relative z-10 flex items-center justify-center rounded-full',
          contentClassName,
        )}
      >
        {children}
      </span>
    </Component>
  );
}
