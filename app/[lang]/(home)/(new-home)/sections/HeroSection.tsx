'use client';

import { useRef } from 'react';
import { PromptInput } from '../components/PromptInput';
import { HeroBackground } from '../components/HeroBackground';
import { HeroTitle } from '../components/HeroTitle';
import { GodRays } from '../components/GodRays';
import Cursor from '../assets/cursor.svg';

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={containerRef}
      className="relative overflow-x-clip pt-36 pb-32"
      style={{
        cursor: `url(${Cursor.src}) 0 0, auto`,
      }}
    >
      {/* 背景组件 */}
      <HeroBackground containerRef={containerRef} />

      {/* GodRays 效果 */}
      <GodRays
        sources={[
          {
            x: -0.05,
            y: -0.05,
            angle: 60,
            spread: 20,
            count: 12,
            color: '220, 220, 220',
            opacityMin: 0.24,
            opacityMax: 0.25,
            minWidth: 120,
            maxWidth: 180,
          },
          {
            x: -0.05,
            y: -0.05,
            angle: 60,
            spread: 8,
            count: 6,
            color: '255, 255, 255',
            opacityMin: 0.89,
            opacityMax: 0.9,
            minWidth: 12,
            maxWidth: 24,
          },
          {
            x: 0.25,
            y: -0.06,
            angle: 50,
            spread: 20,
            count: 6,
            color: '180, 180, 180',
            opacityMin: 0.14,
            opacityMax: 0.15,
            minWidth: 60,
            maxWidth: 120,
          },
        ]}
        speed={0.0}
        maxWidth={48}
        minLength={1200}
        maxLength={2000}
        blur={8}
      />

      {/* 左侧内容区域 */}
      <div className="z-10 container">
        <div className="w-full py-10 md:w-4/5 lg:w-1/2">
          <HeroTitle />

          <div className="mt-10">
            <PromptInput />
          </div>
        </div>
      </div>
    </section>
  );
}
