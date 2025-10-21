'use client';

import { useRef, useEffect, RefObject } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';
import HeroGrid from './HeroBackground/assets/hero-grid.svg';
import HeroCards from './HeroBackground/assets/hero-cards.svg';

interface HeroBackgroundProps {
  containerRef: RefObject<HTMLDivElement>;
}

export function HeroBackground({ containerRef }: HeroBackgroundProps) {
  // 使用 MotionValue 跟踪鼠标位置，避免触发 React 重新渲染
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const isActiveRaw = useMotionValue(0); // 0 = inactive, 1 = active

  // 使用 useSpring 为 opacity 添加过渡效果
  const isActive = useSpring(isActiveRaw, {
    stiffness: 100,
    damping: 25,
    mass: 0.5,
  });

  // 保存最后的鼠标位置，避免在淡出时跳回 (0, 0)
  const lastPositionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // 检查鼠标是否在Hero区域的水平范围和navbar+Hero的垂直范围内
        const isInHorizontalRange = x >= 0 && x <= rect.width;
        const isInVerticalRange = e.clientY >= 0 && y <= rect.height;

        if (isInHorizontalRange && isInVerticalRange) {
          // 更新 MotionValue - 不触发重新渲染
          mouseX.set(x);
          mouseY.set(y);
          isActiveRaw.set(1);
          lastPositionRef.current = { x, y };
        } else {
          isActiveRaw.set(0);
        }
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [containerRef, mouseX, mouseY, isActiveRaw]);

  // 使用 useTransform 创建渐变背景字符串
  const darkenBackground = useTransform(
    [mouseX, mouseY],
    ([x, y]) =>
      `radial-gradient(500px circle at ${x}px ${y}px, transparent, rgba(0,0,0,0.4) 70%)`,
  );

  const highlightBackground = useTransform(
    [mouseX, mouseY],
    ([x, y]) =>
      `radial-gradient(250px circle at ${x}px ${y}px, rgba(255,255,255,0.8), transparent 70%)`,
  );

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
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden blur-sm lg:blur-none">
        <div className="container h-full">
          <div className="flex h-full items-center justify-end">
            <div className="flex h-full w-full items-center justify-end md:w-1/2 md:min-w-[540px]">
              <Image
                src={HeroCards}
                alt="Hero Cards"
                className="h-auto max-h-full w-full object-contain p-4 pt-28 opacity-100"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 暗化遮罩层 - 使用 MotionValue + useSpring 实现渐变 */}
      <motion.div
        className="pointer-events-none absolute inset-0 -z-8"
        style={{
          background: darkenBackground,
          mixBlendMode: 'multiply',
          opacity: isActive,
        }}
      />

      {/* 高亮层 - 使用 MotionValue + useSpring 实现渐变 */}
      <motion.div
        className="pointer-events-none absolute inset-0 -z-5"
        style={{
          background: highlightBackground,
          mixBlendMode: 'overlay',
          opacity: isActive,
        }}
      />
    </>
  );
}
