'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import { GradientText } from './GradientText';

export function RotatingWords({
  words,
  interval = 2000,
  className,
  isInView: parentIsInView,
}: {
  words: string[];
  interval?: number;
  className?: string;
  isInView?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [measuredWidth, setMeasuredWidth] = useState<number | null>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLSpanElement>(null);

  // 使用 useInView 检测组件是否在视口内，once: false 确保离开视口时停止动画
  const localIsInView = useInView(containerRef, {
    once: false,
    amount: 0.5, // 至少 50% 可见时才开始动画
  });

  // 优先使用父组件传递的 isInView，如果没有则使用本地的
  const isInView =
    parentIsInView !== undefined ? parentIsInView : localIsInView;

  useEffect(() => {
    if (!words?.length || !isInView) return; // 只在视口内时运行动画
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, interval);
    return () => clearInterval(id);
  }, [words, interval, isInView]);

  useEffect(() => {
    // 测量当前词的宽度
    const el = measureRef.current;
    if (!el) return;
    const raf = requestAnimationFrame(() => {
      setMeasuredWidth(el.offsetWidth);
    });
    return () => cancelAnimationFrame(raf);
  }, [index, words]);

  return (
    <span
      ref={containerRef}
      className={className}
      style={{
        display: 'inline-block',
        position: 'relative',
      }}
      aria-live="polite"
    >
      <motion.span
        style={{
          display: 'inline-block',
          overflow: 'hidden',
          verticalAlign: 'top',
        }}
        animate={measuredWidth != null ? { width: measuredWidth } : undefined}
        transition={{
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={words[index]}
            initial={{ opacity: 0, transform: 'translateY(100%)' }}
            animate={{ opacity: 1, transform: 'translateY(0%)' }}
            exit={{ opacity: 0, transform: 'translateY(-100%)' }}
            transition={{
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1],
            }}
            style={{
              display: 'inline-block',
              whiteSpace: 'nowrap',
              willChange: 'transform, opacity',
            }}
          >
            <GradientText>{words[index]}</GradientText>
          </motion.span>
        </AnimatePresence>
      </motion.span>

      {/* 隐藏测量元素 */}
      <span
        ref={measureRef}
        style={{
          position: 'absolute',
          visibility: 'hidden',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      >
        <GradientText>{words[index]}</GradientText>
      </span>
    </span>
  );
}
