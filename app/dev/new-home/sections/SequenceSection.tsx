'use client';

import { useRef, useEffect } from 'react';
import { ArrowRight, Bot } from 'lucide-react';
import {
  useScroll,
  useTransform,
  useMotionValue,
  animate,
} from 'framer-motion';
import { GradientText } from '../components/GradientText';
import { WorkflowProgress } from '../components/WorkflowProgress';
import { Button } from '@/components/ui/button';

// 设置为 true 使用 mock 动画，false 使用滚动
const USE_MOCK = true;

export function SequenceSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  // 追踪滚动进度
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });

  // Mock 进度值
  const mockProgress = useMotionValue(0);

  useEffect(() => {
    if (USE_MOCK) {
      // 10秒从0到1的循环动画
      const controls = animate(mockProgress, 1, {
        duration: 10,
        ease: 'linear',
        repeat: Infinity,
        repeatType: 'loop',
      });

      return controls.stop;
    }
  }, [mockProgress]);

  // 根据配置选择使用 mock 还是滚动进度
  const progress = USE_MOCK
    ? mockProgress
    : useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={containerRef} className="mt-48 mb-32">
      <div className="flex flex-col gap-8">
        <h2 className="text-[2.5rem] leading-tight">
          <span>More Than a Platform. It's</span>&nbsp;
          <GradientText>Your Entire Cloud Workflow, Reimagined.</GradientText>
        </h2>
        <p className="mt-3 text-zinc-400">
          A sequence of modules that appear as the user scrolls.
        </p>
      </div>

      <div className="mt-12">
        <WorkflowProgress progress={progress} />
      </div>

      <div className="mt-4 flex w-full flex-col items-center justify-center rounded-xl bg-neutral-900 py-6 text-xl">
        <div className="flex gap-2">
          <Bot size={24} className="text-zinc-400" />
          <span>AI Agent</span>
        </div>

        <div className="text-sm text-zinc-400">Across all modules</div>
      </div>

      <div className="inset-shadow-bubble mt-6 flex flex-col rounded-2xl border border-zinc-700">
        <div className="h-96 border-b border-zinc-700">Images here</div>
        <div className="flex items-center justify-between px-12 pt-6 pb-8">
          <div className="flex flex-col">
            <h3 className="text-2xl text-zinc-200">
              It starts with an idea. Not a blank page.
            </h3>
            <p className="text-zinc-500">
              Describe your concept to Jotlin... automatically generating a
              comprehensive product spec...
            </p>
          </div>

          <div>
            <Button variant="landing-primary">
              <span>Try Jotlin</span>
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
