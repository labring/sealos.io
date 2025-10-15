'use client';

import { useState, useEffect, useRef } from 'react';
import { GradientText } from '../components/GradientText';
import { FramedText } from '../components/FramedText';
import { PromptInput } from '../components/PromptInput';
import { AiAgentStar } from '../components/AiAgentStar';
import HeroGrid from '../components/assets/hero-grid.svg';
import HeroCards from '../components/assets/hero-cards.svg';
import Cursor from '../components/assets/cursor.svg';
import Image from 'next/image';

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
      className="relative overflow-hidden pt-24"
      style={{
        cursor: `url(${Cursor.src}) 12 12, auto`,
      }}
    >
      {/* 背景网格 - 铺满整个容器 */}
      <div className="pointer-events-none absolute inset-0 -z-20">
        <Image
          src={HeroGrid}
          alt="Hero Grid"
          className="h-full w-full object-cover opacity-30"
        />
      </div>

      {/* 右侧卡片 - 铺满整个容器 */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-end">
        <div className="flex h-full w-1/2 items-center justify-end pr-8">
          <Image
            src={HeroCards}
            alt="Hero Cards"
            className="h-auto max-h-full w-full object-contain p-4 pt-28 opacity-100"
          />
        </div>
      </div>

      {/* 暗化遮罩层 - 带淡入淡出效果 */}
      <div
        className="pointer-events-none absolute inset-0 -z-8 transition-opacity duration-500 ease-in-out"
        style={{
          background: `radial-gradient(500px circle at ${mousePosition?.x ?? 0}px ${mousePosition?.y ?? 0}px, transparent, rgba(0,0,0,0.7) 70%)`,
          mixBlendMode: 'multiply',
          opacity: mousePosition ? 1 : 0,
        }}
      />

      {/* 高亮层 - 带淡入淡出效果 */}
      <div
        className="pointer-events-none absolute inset-0 -z-5 transition-opacity duration-500 ease-in-out"
        style={{
          background: `radial-gradient(250px circle at ${mousePosition?.x ?? 0}px ${mousePosition?.y ?? 0}px, rgba(255,255,255,0.8), transparent 70%)`,
          mixBlendMode: 'overlay',
          opacity: mousePosition ? 1 : 0,
        }}
      />

      {/* 左侧内容区域 */}
      <div className="z-10 container">
        <div className="w-full py-10 lg:w-1/2">
          <div className="flex w-fit rounded-full border border-white/5 bg-white/5 px-3 py-2 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),_0_2px_4px_-1px_rgba(0,0,0,0.02)]">
            Sealos is the&nbsp;<GradientText>intelligent</GradientText>
            <AiAgentStar className="mt-1 self-start" />
            &nbsp;Cloud OS
          </div>

          <h1 className="mt-5 text-[3.25rem] leading-[1.2]">
            <div>
              Ship any&nbsp;
              <FramedText>
                <GradientText>AI Agent</GradientText>
              </FramedText>
            </div>
            <div>with just a prompt.</div>
          </h1>

          <p className="mt-5 text-zinc-400">
            Sealos is the intelligent Cloud OS. Describe your needs, and our AI
            Pilot will build the environment, configure the database, and deploy
            it globally.
          </p>

          <div className="mt-10">
            <PromptInput />
          </div>
        </div>
      </div>
    </section>
  );
}
