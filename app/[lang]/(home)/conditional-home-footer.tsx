'use client';

import Footer from '@/components/footer';
import type { languagesType } from '@/lib/i18n';
import { usePathname } from 'next/navigation';

export function ConditionalHomeFooter({ lang }: { lang: languagesType }) {
  const pathname = usePathname();

  if (pathname === '/' || pathname === `/${lang}` || pathname === `/${lang}/`) {
    return null;
  }

  return <Footer lang={lang} />;
}
