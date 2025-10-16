'use client';

import Image from 'next/image';
import HeroGrid from './assets/hero-grid.svg';
import HeroCards from './assets/hero-cards.svg';

interface HeroBackgroundProps {
  mousePosition: { x: number; y: number } | null;
}

export function HeroBackground({ mousePosition }: HeroBackgroundProps) {
  return (
    <>
      {/* 背景网格 - 铺满整个容器 */}
      <div className="pointer-events-none absolute inset-0 -z-20">
        <Image
          src={HeroGrid}
          alt="Hero Grid"
          className="h-full w-full object-cover opacity-30"
        />
      </div>

      {/* 右侧卡片 - 限制在 container 内 */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="container h-full">
          <div className="flex h-full items-center justify-end">
            <div className="flex h-full w-1/2 items-center justify-end">
              <Image
                src={HeroCards}
                alt="Hero Cards"
                className="h-auto max-h-full w-full object-contain p-4 pt-28 opacity-100"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 暗化遮罩层 - 带淡入淡出效果 */}
      <div
        className="pointer-events-none absolute inset-0 -z-8 transition-opacity duration-500 ease-in-out"
        style={{
          background: `radial-gradient(500px circle at ${mousePosition?.x ?? 0}px ${mousePosition?.y ?? 0}px, transparent, rgba(0,0,0,0.7) 70%)`,
          mixBlendMode: 'multiply',
          opacity: mousePosition ? 1 : 0,
        }}
      />

      {/* 高亮层 - 带淡入淡出效果 */}
      <div
        className="pointer-events-none absolute inset-0 -z-5 transition-opacity duration-500 ease-in-out"
        style={{
          background: `radial-gradient(250px circle at ${mousePosition?.x ?? 0}px ${mousePosition?.y ?? 0}px, rgba(255,255,255,0.8), transparent 70%)`,
          mixBlendMode: 'overlay',
          opacity: mousePosition ? 1 : 0,
        }}
      />
    </>
  );
}
