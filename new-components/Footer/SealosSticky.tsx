'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'motion/react';

type SealosStickyProps = {
  letters: React.ReactNode;
  children?: React.ReactNode; // 主体内容
};

export default function SealosSticky({ letters, children }: SealosStickyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const [translateY, setTranslateY] = useState(0);
  const rafIdRef = useRef<number>(0);
  const tickingRef = useRef(false);

  // 使用 Intersection Observer 检测组件是否接近视口
  // 提前 400px 开始监听，确保平滑过渡
  const isNearViewport = useInView(containerRef, {
    margin: '400px 0px 0px 0px',
    once: false,
  });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // 全局滚动（像素）用于计算距底部剩余距离
  const { scrollY } = useScroll();

  // 使用 motion 的派生值计算透明度：默认 0，距底部 ≤ 200 为 1
  const opacity = useTransform(scrollY, (latest) => {
    if (typeof window === 'undefined' || !isNearViewport) return 0;
    const doc = document.documentElement;
    const viewportHeight = window.innerHeight;
    const docScrollHeight = doc.scrollHeight;
    const remaining = Math.max(docScrollHeight - (latest + viewportHeight), 0);
    return remaining <= 200 ? 1 - remaining / 200 : 0;
  });

  // 动态计算 translateY 值 - 使用 rAF 节流，仅在接近视口时启用
  useEffect(() => {
    // 只有在接近视口时才启用监听器
    if (!isNearViewport) {
      // 清理可能存在的 rAF
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = 0;
      }
      tickingRef.current = false;
      return;
    }

    const updateTranslateY = () => {
      if (!containerRef.current || !mainContentRef.current) {
        tickingRef.current = false;
        return;
      }

      // 1. 获取 SealosSticky 组件顶部位置
      const sealosStickyTop = containerRef.current.getBoundingClientRect().top;

      // 2. 获取主内容区域底部位置（即 Footer 链接栏底部）
      const mainContentBottom =
        mainContentRef.current.getBoundingClientRect().bottom;

      // 3. 计算两者之间的距离
      const distance = mainContentBottom - sealosStickyTop;

      // 4. 当距离为 0 时（重合），不再允许上滑
      // translateY 为负值表示向上移动
      const maxTranslateY = Math.max(0, -distance);

      setTranslateY(maxTranslateY);
      tickingRef.current = false;
    };

    const requestUpdate = () => {
      if (!tickingRef.current) {
        tickingRef.current = true;
        rafIdRef.current = requestAnimationFrame(updateTranslateY);
      }
    };

    // 初始计算
    updateTranslateY();

    // 使用 passive 监听器和 rAF 节流
    const handleScroll = () => {
      requestUpdate();
    };

    const handleResize = () => {
      requestUpdate();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [isNearViewport]);

  return (
    <div
      ref={containerRef}
      className="relative mb-[min(300px,100vw)]"
      aria-hidden="true"
    >
      {/* 主体内容 - 跟随滚动向上移动 */}
      <motion.div
        ref={mainContentRef}
        style={{ y: translateY }}
        className="relative z-30"
      >
        {children}
      </motion.div>

      {/* Sealos 字母 - 固定在底部 */}
      <motion.div
        className="pointer-events-none fixed right-0 bottom-0 left-0 -z-10 container flex h-[400px] items-end justify-center px-16"
        style={{ opacity }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {letters}
      </motion.div>
    </div>
  );
}
