'use client';

import { useId, useState } from 'react';
import { motion, MotionValue, useMotionValueEvent } from 'framer-motion';

interface GradientWaveProps {
  progress: number | MotionValue<number>; // 0-1
}

export function GradientWave({ progress }: GradientWaveProps) {
  const gradientId = useId();
  const lineCount = 64;
  const lines = Array.from({ length: lineCount }, (_, i) => i);
  
  // 处理 MotionValue 类型的 progress
  const [currentProgress, setCurrentProgress] = useState(
    typeof progress === 'number' ? progress : 0
  );

  // 如果 progress 是 MotionValue，监听其变化
  if (typeof progress !== 'number') {
    useMotionValueEvent(progress, 'change', (latest) => {
      setCurrentProgress(latest);
    });
  }

  const actualProgress = typeof progress === 'number' ? progress : currentProgress;
  const progressLineIndex = Math.round(actualProgress * (lineCount - 1));

  return (
    <svg
      className="h-8 w-full"
      viewBox="0 0 1000 100"
      preserveAspectRatio="none"
    >
      <defs>
        {lines.map((i) => {
          const distanceInLines = Math.abs(i - progressLineIndex);

          if (distanceInLines <= 5) {
            // 为中心区域的每条线创建独立的垂直渐变
            const fadeFactorInRange = 1 - (distanceInLines / 5) * 0.7;
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
        const distanceFromProgress = Math.abs(i / lineCount - actualProgress);
        const distanceInLines = Math.abs(i - progressLineIndex);

        // 计算高度：距离进度越近越高
        const heightFactor = Math.exp(-distanceFromProgress * 12);
        const height = 20 + heightFactor * 70;

        // 计算颜色和不透明度
        let stroke;
        let opacity;

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
