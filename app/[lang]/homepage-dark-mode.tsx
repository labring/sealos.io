'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { isHomepage } from './utils/is-homepage';

export function HomepageDarkMode() {
  const pathname = usePathname();

  useEffect(() => {
    const shouldBeDark = isHomepage(pathname);

    if (shouldBeDark) {
      // 主页：添加 dark 类
      document.documentElement.classList.add('dark');
    } else {
      // 非主页：移除 dark 类
      document.documentElement.classList.remove('dark');
    }
  }, [pathname]);

  return null;
}
