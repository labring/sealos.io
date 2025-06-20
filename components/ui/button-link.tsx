'use client';

import { ReactNode, forwardRef } from 'react';
import Link from 'next/link';
import { ButtonActionType } from '@/lib/gtm';

type ButtonLinkProps = {
  children: ReactNode;
  className?: string;
  title: string;
  href: string;
  actionType?: ButtonActionType;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
  newWindow?: boolean;
};

export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  (
    {
      children,
      className = '',
      title,
      href,
      actionType = 'url',
      onClick,
      style,
      newWindow = false,
      ...props
    },
    ref,
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Call the provided onClick handler if it exists (this handles tracking)
      if (onClick) {
        onClick(e);
      }
    };

    const isExternal =
      href.startsWith('http://') ||
      href.startsWith('https://') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('ftp://') ||
      href.startsWith('//'); // Protocol-relative URLs

    const linkProps = {
      className,
      title,
      onClick: handleClick,
      style,
      ref,
      ...props,
    };

    if (isExternal || newWindow) {
      return (
        <a
          href={href}
          target={newWindow || isExternal ? '_blank' : undefined}
          rel={newWindow || isExternal ? 'noopener noreferrer' : undefined}
          {...linkProps}
        >
          {children}
        </a>
      );
    }

    // Internal links use Next.js Link for optimal performance
    return (
      <Link href={href} {...linkProps}>
        {children}
      </Link>
    );
  },
);

ButtonLink.displayName = 'ButtonLink';
