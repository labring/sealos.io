'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { isHomepage } from './utils/is-homepage';

export function HomepageDarkMode() {
  const pathname = usePathname();

  // 立即同步执行，不等待 useEffect
  useEffect(() => {
    const shouldBeDark = isHomepage(pathname);

    // 使用 requestAnimationFrame 确保 DOM 已经准备好
    requestAnimationFrame(() => {
      if (shouldBeDark) {
        // 主页：添加 dark 类
        document.documentElement.classList.add('dark');
      } else {
        // 非主页：移除 dark 类
        document.documentElement.classList.remove('dark');
      }
    });
  }, [pathname]);

  // 组件挂载时立即检查一次（处理直接访问主页的情况）
  useEffect(() => {
    const shouldBeDark = isHomepage(pathname);
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return null;
}
