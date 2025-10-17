'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

type SealosStickyProps = {
  letters: React.ReactNode;
  children?: React.ReactNode; // 主体内容
};

export default function SealosSticky({ letters, children }: SealosStickyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const [translateY, setTranslateY] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [docScrollHeight, setDocScrollHeight] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // 全局滚动（像素）用于计算距底部剩余距离
  const { scrollY } = useScroll();

  // 动态计算 translateY 值
  useEffect(() => {
    const updateTranslateY = () => {
      if (!containerRef.current || !mainContentRef.current) return;

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
    };

    // 初始计算
    updateTranslateY();

    // 监听滚动事件
    const handleScroll = () => {
      updateTranslateY();
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', updateTranslateY);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateTranslateY);
    };
  }, []);

  // 监听窗口尺寸变化，记录 viewport 和文档高度
  useEffect(() => {
    const measure = () => {
      const doc = document.documentElement;
      setViewportHeight(window.innerHeight);
      setDocScrollHeight(doc.scrollHeight);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // 使用 motion 的派生值计算透明度：默认 0，距底部 ≤ 400px 为 1
  const opacity = useTransform(scrollY, (y) => {
    // 尚未测量完成时保持隐藏
    if (!viewportHeight || !docScrollHeight) return 0;
    const remaining = Math.max(docScrollHeight - (y + viewportHeight), 0);
    return remaining <= 400 ? 1 : 0;
  });

  return (
    <div ref={containerRef} className="relative mb-[400px]">
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
        className="fixed right-0 bottom-0 left-0 z-0 flex h-[400px] items-end justify-center px-16 pointer-events-none"
        style={{ opacity }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {letters}
      </motion.div>
    </div>
  );
}
