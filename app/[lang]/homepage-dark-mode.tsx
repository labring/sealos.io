'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { isForcedDarkMode } from './utils/is-forced-dark-mode';

export function HomepageDarkMode() {
  const pathname = usePathname();

  // Immediately set dark mode on mount to avoid flash
  useEffect(() => {
    const shouldBeDark = isForcedDarkMode(pathname);
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [pathname]);

  return null;
}
