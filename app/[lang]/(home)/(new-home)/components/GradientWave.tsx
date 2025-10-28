'use client';

import { useRef, useEffect } from 'react';
import { MotionValue } from 'framer-motion';

interface GradientWaveProps {
  progress: MotionValue<number>; // 0-1
}

export function GradientWave({ progress }: GradientWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>();
  const isInViewRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const lineCount = 64;
    const dpr = Math.min(window.devicePixelRatio || 1, 2); // 限制最大 DPR 为 2

    // 设置 canvas 尺寸
    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    updateSize();

    // 创建渐变缓存
    const createGradient = (x: number, height: number) => {
      const gradient = ctx.createLinearGradient(x, height, x, 0);
      gradient.addColorStop(0, '#146DFF');
      gradient.addColorStop(1, '#ffffff');
      return gradient;
    };

    // 渲染函数
    const render = () => {
      if (!isInViewRef.current) return;

      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const progressValue = progress.get();

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < lineCount; i++) {
        const lineProgress = i / lineCount;
        const x = (i / (lineCount - 1)) * width;

        // 计算高度
        const distanceFromProgress = Math.abs(lineProgress - progressValue);
        const heightFactor = Math.exp(-distanceFromProgress * 12);
        const lineHeight = (20 + heightFactor * 70) * (height / 100);

        // 计算透明度
        const progressLineIndex = Math.round(progressValue * (lineCount - 1));
        const distanceInLines = Math.abs(i - progressLineIndex);
        let opacity: number;

        if (distanceInLines <= 5) {
          const fadeFactor = 1 - (distanceInLines / 5) * 0.4;
          opacity = (0.6 + heightFactor * 0.3) * fadeFactor;
        } else {
          opacity = (0.3 + heightFactor * 0.3) * 0.7;
        }

        // 绘制线条
        ctx.beginPath();
        ctx.moveTo(x, height);
        ctx.lineTo(x, height - lineHeight);
        ctx.strokeStyle = createGradient(x, lineHeight);
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.globalAlpha = opacity;
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(render);
    };

    // 监听 progress 变化
    const unsubscribe = progress.on('change', () => {
      if (!rafRef.current && isInViewRef.current) {
        rafRef.current = requestAnimationFrame(render);
      }
    });

    // Intersection Observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          rafRef.current = requestAnimationFrame(render);
        } else {
          if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = undefined;
          }
        }
      },
      { threshold: 0 },
    );

    observer.observe(canvas);

    // 初始渲染
    render();

    // Resize observer
    const resizeObserver = new ResizeObserver(() => {
      updateSize();
      render();
    });
    resizeObserver.observe(canvas);

    return () => {
      unsubscribe();
      observer.disconnect();
      resizeObserver.disconnect();
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [progress]);

  return <canvas ref={canvasRef} className="h-8 w-full" />;
}
