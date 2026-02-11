'use client';

import { usePathname } from 'next/navigation';
import { SiteBanner } from '@/new-components/SiteBanner';
import { siteConfig } from '@/config/site';
import { isForcedDarkMode } from './utils/is-forced-dark-mode';

export function ConditionalSiteBanner() {
  const pathname = usePathname();
  const needsDarkMode = isForcedDarkMode(pathname);
  const hasBanner = Boolean(
    siteConfig.banner?.enabled && siteConfig.banner.text,
  );

  if (!needsDarkMode || !hasBanner) {
    return null;
  }

  return (
    <SiteBanner
      text={siteConfig.banner?.text}
      action={siteConfig.banner?.action}
    />
  );
}
