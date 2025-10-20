'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'motion/react';
import { GradientText } from './GradientText';

export function RotatingWords({
  words,
  interval = 2000,
  className,
}: {
  words: string[];
  interval?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [measuredWidth, setMeasuredWidth] = useState<number | null>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLSpanElement>(null);

  // 使用 useInView 检测组件是否在视口内
  const isInView = useInView(containerRef, {
    margin: '0px 0px -10% 0px', // 提前 10% 开始动画
  });

  useEffect(() => {
    if (!words?.length || !isInView) return; // 只在视口内时运行动画
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, interval);
    return () => clearInterval(id);
  }, [words, interval, isInView]);

  useEffect(() => {
    // 测量当前词的宽度，用于外层宽度动画
    const el = measureRef.current;
    if (!el) return;
    // 下一帧测量，确保 DOM 已更新
    const raf = requestAnimationFrame(() => {
      setMeasuredWidth(el.offsetWidth);
    });
    return () => cancelAnimationFrame(raf);
  }, [index, words]);

  return (
    <span
      ref={containerRef}
      className={className}
      style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
      aria-live="polite"
    >
      <motion.span
        style={{ display: 'inline-block' }}
        animate={measuredWidth != null ? { width: measuredWidth } : undefined}
        transition={{ type: 'spring', stiffness: 200, damping: 26, mass: 0.6 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={words[index]}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 40,
              mass: 0.6,
            }}
            style={{ display: 'inline-block' }}
          >
            <GradientText>{words[index]}</GradientText>
          </motion.span>
        </AnimatePresence>
      </motion.span>

      {/* 隐藏测量元素：继承父级字体尺寸，保证测量准确 */}
      <span
        ref={measureRef}
        style={{
          position: 'absolute',
          visibility: 'hidden',
          whiteSpace: 'nowrap',
        }}
      >
        {words[index]}
      </span>
    </span>
  );
}
