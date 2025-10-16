'use client';

import { useState, useEffect, useRef } from 'react';
import { PromptInput } from '../components/PromptInput';
import { HeroBackground } from '../components/HeroBackground';
import { HeroTitle } from '../components/HeroTitle';
import { GodRays } from '../components/GodRays';
import Cursor from '../components/assets/cursor.svg';

export function HeroSection() {
  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // 检查鼠标是否在Hero区域的水平范围和navbar+Hero的垂直范围内
        const isInHorizontalRange = x >= 0 && x <= rect.width;
        const isInVerticalRange = e.clientY >= 0 && y <= rect.height;

        if (isInHorizontalRange && isInVerticalRange) {
          setMousePosition({ x, y });
        } else {
          setMousePosition(null);
        }
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative pt-36 pb-32"
      style={{
        cursor: `url(${Cursor.src}) 12 12, auto`,
      }}
    >
      {/* 背景组件 */}
      <HeroBackground mousePosition={mousePosition} />

      {/* GodRays 效果 */}
      <GodRays
        sources={[
          {
            x: -0.1,
            y: -0.15,
            angle: 70,
            spread: 120,
            count: 16,
            color: '220, 220, 220',
          },
          {
            x: 0.5,
            y: -0.2,
            angle: 70,
            spread: 110,
            count: 14,
            color: '225, 225, 225',
          },
        ]}
        speed={0.002}
        maxWidth={100}
        minLength={1200}
        maxLength={2800}
        blur={16}
      />

      {/* 左侧内容区域 */}
      <div className="z-10 container">
        <div className="w-full py-10 lg:w-1/2">
          <HeroTitle />

          <div className="mt-10">
            <PromptInput />
          </div>
        </div>
      </div>
    </section>
  );
}
