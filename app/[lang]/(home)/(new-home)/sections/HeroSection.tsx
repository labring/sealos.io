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
            x: -0.05,
            y: -0.05,
            angle: 50,
            spread: 30,
            count: 8,
            color: '250, 250, 250',
            opacityMin: 0.55,
            opacityMax: 1,
          },
          {
            x: 0.25,
            y: -0.02,
            angle: 50,
            spread: 30,
            count: 14,
            color: '200, 200, 200',
            opacityMin: 0.3,
            opacityMax: 0.7,
          },
        ]}
        speed={0.002}
        maxWidth={100}
        minLength={1200}
        maxLength={2000}
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
