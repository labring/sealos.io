'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { isForcedDarkMode } from './utils/is-forced-dark-mode';

export function HomepageDarkMode() {
  const pathname = usePathname();

  // Important pages are in dark mode, so default to that.
  useEffect(() => {
    const shouldNotBeDark = !isForcedDarkMode(pathname);
    if (shouldNotBeDark) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, [pathname]);

  return null;
}
