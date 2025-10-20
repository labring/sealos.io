'use client';

import { useId, memo } from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';

interface GradientWaveProps {
  progress: MotionValue<number>; // 0-1
}

interface WaveLineProps {
  progress: MotionValue<number>;
  lineIndex: number;
  lineCount: number;
  x: number;
  gradientId: string;
}

// 单条波形线组件 - 使用 MotionValue 避免重新渲染
const WaveLine = memo(
  ({ progress, lineIndex, lineCount, x, gradientId }: WaveLineProps) => {
    const lineProgress = lineIndex / lineCount;

    // 在组件内部使用 useTransform - 完全符合 Hooks 规则
    const y2 = useTransform(progress, (latest) => {
      const distanceFromProgress = Math.abs(lineProgress - latest);
      const heightFactor = Math.exp(-distanceFromProgress * 12);
      const height = 20 + heightFactor * 70;
      return 100 - height;
    });

    const opacity = useTransform(progress, (latest) => {
      const progressLineIndex = Math.round(latest * (lineCount - 1));
      const distanceInLines = Math.abs(lineIndex - progressLineIndex);
      const distanceFromProgress = Math.abs(lineProgress - latest);
      const heightFactor = Math.exp(-distanceFromProgress * 12);

      if (distanceInLines <= 5) {
        const fadeFactor = 1 - (distanceInLines / 5) * 0.4;
        return (0.6 + heightFactor * 0.3) * fadeFactor;
      } else {
        return (0.3 + heightFactor * 0.3) * 0.7;
      }
    });

    return (
      <motion.line
        x1={x}
        y1={100}
        x2={x}
        y2={y2}
        stroke={`url(#${gradientId}-${lineIndex})`}
        strokeWidth="2"
        strokeLinecap="round"
        style={{
          opacity: opacity,
        }}
      />
    );
  },
);

WaveLine.displayName = 'WaveLine';

export function GradientWave({ progress }: GradientWaveProps) {
  const gradientId = useId();
  const lineCount = 64;
  const lines = Array.from({ length: lineCount }, (_, i) => i);

  return (
    <svg
      className="h-8 w-full"
      viewBox="0 0 1000 100"
      preserveAspectRatio="none"
    >
      <defs>
        {lines.map((i) => (
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
        ))}
      </defs>
      {lines.map((i) => {
        const x = (i / (lineCount - 1)) * 1000;
        return (
          <WaveLine
            key={i}
            progress={progress}
            lineIndex={i}
            lineCount={lineCount}
            x={x}
            gradientId={gradientId}
          />
        );
      })}
    </svg>
  );
}
