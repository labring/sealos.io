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

  // 判断是否处于 idle 状态（progress >= 0.99，给一点容错空间）
  const isIdle = currentProgress >= 0.99;
  const progressLineIndex = Math.round(currentProgress * (lineCount - 1));

  return (
    <svg
      className="h-8 w-full"
      viewBox="0 0 1000 100"
      preserveAspectRatio="none"
    >
      <defs>
        {lines.map((i) => {
          const distanceInLines = Math.abs(i - progressLineIndex);

          // idle 状态下所有线都需要渐变，否则只有中心区域需要
          if (isIdle || distanceInLines <= 5) {
            // 为每条线创建独立的垂直渐变
            const fadeFactorInRange = isIdle
              ? 0.8
              : 1 - (distanceInLines / 5) * 0.7;
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
                <stop
                  offset="0"
                  stopColor="#146DFF"
                  stopOpacity={fadeFactorInRange}
                />
                <stop
                  offset="1"
                  stopColor="#fff"
                  stopOpacity={fadeFactorInRange}
                />
              </linearGradient>
            );
          }
          return null;
        })}
      </defs>
      {lines.map((i) => {
        const x = (i / (lineCount - 1)) * 1000;
        const distanceFromProgress = Math.abs(i / lineCount - currentProgress);
        const distanceInLines = Math.abs(i - progressLineIndex);

        // idle 状态：所有线都最长，都使用渐变
        let height;
        let stroke;
        let opacity;

        if (isIdle) {
          // idle 状态：所有线最长，使用渐变颜色
          height = 90;
          stroke = `url(#${gradientId}-${i})`;
          opacity = 0.9;
        } else {
          // 正常状态：计算高度，距离进度越近越高
          const heightFactor = Math.exp(-distanceFromProgress * 12);
          height = 20 + heightFactor * 70;

          // 计算颜色和不透明度
          if (distanceInLines <= 5) {
            // 在当前进度左右5根线内使用渐变
            stroke = `url(#${gradientId}-${i})`;
            opacity = 0.7 + heightFactor * 0.3;
          } else {
            // 超过5根线，使用低饱和度的单色
            const saturation = Math.max(15, 50 - distanceInLines * 2);
            const lightness = Math.max(25, 45 - distanceInLines);
            stroke = `hsl(215, ${saturation}%, ${lightness}%)`;
            opacity = 0.3 + heightFactor * 0.5;
          }
        }

        return (
          <motion.line
            key={i}
            x1={x}
            y1={100}
            x2={x}
            y2={100 - height}
            stroke={stroke}
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
