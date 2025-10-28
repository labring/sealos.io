'use client';

import { ReactNode, useRef, memo } from 'react';
import { useInView } from 'framer-motion';

interface AnimatedCarouselContainerProps {
  activeIndex: number;
  children: ReactNode;
}

export const AnimatedCarouselContainer = memo(
  function AnimatedCarouselContainer({
    activeIndex,
    children,
  }: AnimatedCarouselContainerProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    // 使用 useInView 检测组件是否在视口内
    const isInView = useInView(containerRef, {
      margin: '0px 0px 0px 0px',
      amount: 0,
    });

    return (
      <div
        ref={containerRef}
        className="relative pb-[35rem] sm:pb-[38rem] lg:pb-[40rem] 2xl:pb-[44rem]"
      >
        {/* 只在视口内时渲染内容 */}
        {isInView && <div className="absolute w-full">{children}</div>}
        {/* 不在视口时显示静态内容 */}
        {!isInView && (
          <div className="absolute w-full opacity-0">{children}</div>
        )}
      </div>
    );
  },
);
