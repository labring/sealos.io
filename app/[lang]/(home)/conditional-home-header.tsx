'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import type { languagesType } from '@/lib/i18n';

export function ConditionalHomeHeader({
  children,
  lang,
}: {
  children: ReactNode;
  lang: languagesType;
}) {
  const pathname = usePathname();

  if (pathname === '/' || pathname === `/${lang}` || pathname === `/${lang}/`) {
    return null;
  }

  return <>{children}</>;
}
