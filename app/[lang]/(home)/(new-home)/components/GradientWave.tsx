'use client';

import { useId, useState, useRef, useEffect } from 'react';
import { motion, MotionValue, useMotionValueEvent } from 'framer-motion';

interface GradientWaveProps {
  progress: MotionValue<number>; // 0-1
}

export function GradientWave({ progress }: GradientWaveProps) {
  const gradientId = useId();
  const lineCount = 64;
  const lines = Array.from({ length: lineCount }, (_, i) => i);

  // 跟踪当前进度值用于计算
  const [currentProgress, setCurrentProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  // 使用 requestAnimationFrame 优化渲染性能
  useMotionValueEvent(progress, 'change', (latest) => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }
    rafRef.current = requestAnimationFrame(() => {
      setCurrentProgress(latest);
    });
  });

  // 清理未完成的 requestAnimationFrame
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const progressLineIndex = Math.round(currentProgress * (lineCount - 1));

  return (
    <svg
      className="h-8 w-full"
      viewBox="0 0 1000 100"
      preserveAspectRatio="none"
    >
      <defs>
        {lines.map((i) => {
          // 为所有线创建渐变
          return (
            <linearGradient
              key={i}
              id={`${gradientId}-${i}`}
              x1="0%"
              y1="100%"
              x2="0%"
              y2="0%"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#146DFF" />
              <stop offset="1" stopColor="#fff" />
            </linearGradient>
          );
        })}
      </defs>
      {lines.map((i) => {
        const x = (i / (lineCount - 1)) * 1000;
        const distanceFromProgress = Math.abs(i / lineCount - currentProgress);
        const distanceInLines = Math.abs(i - progressLineIndex);

        // 计算高度，距离进度越近越高
        const heightFactor = Math.exp(-distanceFromProgress * 12);
        const height = 20 + heightFactor * 70;

        // 计算不透明度
        let opacity;
        if (distanceInLines <= 5) {
          // 在当前进度左右5根线内使用较高不透明度
          const fadeFactor = 1 - (distanceInLines / 5) * 0.4;
          opacity = (0.6 + heightFactor * 0.3) * fadeFactor;
        } else {
          // 超过5根线，使用更高的基础不透明度，让未亮起的线更明显
          opacity = (0.3 + heightFactor * 0.3) * 0.7;
        }

        return (
          <motion.line
            key={i}
            x1={x}
            y1={100}
            x2={x}
            y2={100 - height}
            stroke={`url(#${gradientId}-${i})`}
            strokeWidth="2"
            strokeLinecap="round"
            opacity={opacity}
            transition={{
              y2: {
                duration: 0.3,
                ease: 'easeOut',
              },
              opacity: {
                duration: 0.2,
                ease: 'easeInOut',
              },
            }}
          />
        );
      })}
    </svg>
  );
}
