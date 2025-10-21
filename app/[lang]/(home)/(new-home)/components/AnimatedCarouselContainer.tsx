'use client';

import { ReactNode, useRef, useEffect, useState } from 'react';
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
  const [isFirefox, setIsFirefox] = useState(false);

  // 使用 useInView 检测组件是否在视口内
  const isInView = useInView(containerRef, {
    margin: '0px 0px 0px 0px',
    amount: 0,
  });

  // 检测是否为 Firefox 浏览器
  useEffect(() => {
    setIsFirefox(
      typeof navigator !== 'undefined' &&
        navigator.userAgent.toLowerCase().indexOf('firefox') > -1,
    );
  }, []);

  // Firefox 降级动画配置：移除 blur 和 scale，减少 GPU 负载
  const firefoxVariants = {
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

  // 标准浏览器完整动画配置
  const standardVariants = {
    initial: {
      opacity: 0,
      scale: 1.05,
      filter: 'blur(8px)',
      y: -20,
      zIndex: 10,
    },
    animate: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      y: 0,
      zIndex: 10,
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      filter: 'blur(8px)',
      y: 20,
      zIndex: 20,
    },
  };

  const variants = isFirefox ? firefoxVariants : standardVariants;
  const transitionConfig = isFirefox
    ? { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const } // Firefox 使用更短的过渡时间
    : { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const };

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
