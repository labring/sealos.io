'use client';

import { ReactNode, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

interface AnimatedCarouselContainerProps {
  activeIndex: number;
  children: ReactNode;
}

export function AnimatedCarouselContainer({
  activeIndex,
  children,
}: AnimatedCarouselContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // 使用 useInView 检测组件是否在视口内
  const isInView = useInView(containerRef, {
    margin: '0px 0px 0px 0px',
    amount: 0,
  });

  const variants = {
    initial: {
      opacity: 0,
      y: -20,
      zIndex: 10,
    },
    animate: {
      opacity: 1,
      y: 0,
      zIndex: 10,
    },
    exit: {
      opacity: 0,
      y: 20,
      zIndex: 20,
    },
  };

  const transitionConfig = { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const };

  return (
    <div
      ref={containerRef}
      className="relative pb-[35rem] sm:pb-[38rem] lg:pb-[40rem] 2xl:pb-[44rem]"
    >
      {/* 只在视口内时渲染动画 */}
      {isInView && (
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={`carousel-item-${activeIndex}`}
            className="absolute w-full"
            initial={variants.initial}
            animate={variants.animate}
            exit={variants.exit}
            transition={transitionConfig}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      )}
      {/* 不在视口时显示静态内容 */}
      {!isInView && <div className="absolute w-full opacity-0">{children}</div>}
    </div>
  );
}
