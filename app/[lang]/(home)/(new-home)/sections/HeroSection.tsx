'use client';

import { useState, useEffect, useRef } from 'react';
import { PromptInput } from '../components/PromptInput';
import { HeroBackground } from '../components/HeroBackground';
import { HeroTitle } from '../components/HeroTitle';
import { GodRays } from '../components/GodRays';
import Cursor from '../components/HeroBackground/assets/cursor.svg';

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={containerRef}
      className="relative overflow-x-clip pt-36 pb-32"
      style={{
        cursor: `url(${Cursor.src}) 12 12, auto`,
      }}
    >
      {/* 背景组件 */}
      <HeroBackground containerRef={containerRef} />

      {/* GodRays 效果 */}
      <GodRays
        sources={[
          {
            x: 0.1,
            y: -0.15,
            angle: 70,
            spread: 40,
            count: 16,
            color: '220, 220, 220',
          },
          {
            x: 0.5,
            y: -0.2,
            angle: 70,
            spread: 60,
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
