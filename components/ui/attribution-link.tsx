'use client';

import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { appendAttributionToUrl } from '@/lib/attribution-url';

type AttributionLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children?: ReactNode;
};

export function AttributionLink({
  href,
  children,
  ...props
}: AttributionLinkProps) {
  const renderedHref = appendAttributionToUrl(href);

  return (
    <a {...props} href={renderedHref}>
      {children}
    </a>
  );
}
