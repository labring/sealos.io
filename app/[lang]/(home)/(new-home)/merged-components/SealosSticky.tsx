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

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // 动态计算 translateY 值
  useEffect(() => {
    const updateTranslateY = () => {
      if (!containerRef.current || !mainContentRef.current) return;

      // 1. 获取 SealosSticky 组件顶部位置
      const sealosStickyTop = containerRef.current.getBoundingClientRect().top;
      
      // 2. 获取主内容区域底部位置（即 Footer 链接栏底部）
      const mainContentBottom = mainContentRef.current.getBoundingClientRect().bottom;
      
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

  return (
    <div ref={containerRef} className="relative min-h-[200vh]">
      {/* 主体内容 - 跟随滚动向上移动 */}
      <motion.div
        ref={mainContentRef}
        style={{ y: translateY }}
        className="relative z-30"
      >
        {children}
      </motion.div>
      
      {/* Sealos 字母 - 固定在底部 */}
      <div className="fixed bottom-0 left-0 right-0 h-[400px] z-20 flex items-end justify-center px-16">
        {letters}
      </div>
    </div>
  );
}
