'use client';

import { useRef, useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import {
  useScroll,
  useTransform,
  useMotionValue,
  animate,
  useMotionValueEvent,
} from 'framer-motion';
import { GradientText } from '../components/GradientText';
import { GradientWave } from '../components/GradientWave';
import {
  WorkflowProgress,
  LastStage,
  getLastStageStartProgress,
} from '../components/WorkflowProgress';
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

  // 动画控制器引用
  const animationControlsRef = useRef<any>(null);
  const isManualControlRef = useRef(false); // 标记是否是手动控制

  // 跟踪最后阶段是否激活
  const [isLastStageActive, setIsLastStageActive] = useState(false);
  const prevLastStageActiveRef = useRef(false);

  // 获取最后阶段的开始位置
  const lastStageStartProgress = getLastStageStartProgress();

  useEffect(() => {
    if (USE_MOCK) {
      // 10秒从0到1的循环动画
      const controls = animate(mockProgress, 1, {
        duration: 10,
        ease: 'linear',
        repeat: Infinity,
        repeatType: 'loop',
        onComplete: () => {
          // 动画完成时重置标记
          isManualControlRef.current = false;
        },
      });

      animationControlsRef.current = controls;

      return controls.stop;
    }
  }, [mockProgress]);

  // 根据配置选择使用 mock 还是滚动进度
  const progress = USE_MOCK ? mockProgress : scrollYProgress;

  // GradientWave 进度：最后阶段之前映射到 0-1，最后阶段保持为 1 (idle状态)
  const waveProgress = useTransform(progress, (value) => {
    if (value >= lastStageStartProgress) return 1; // idle 状态
    return value / lastStageStartProgress; // 映射到 0-1
  });

  // 监听进度变化，更新最后阶段激活状态
  useMotionValueEvent(progress, 'change', (latest) => {
    const newIsActive = latest >= lastStageStartProgress;
    if (newIsActive !== prevLastStageActiveRef.current) {
      prevLastStageActiveRef.current = newIsActive;
      setIsLastStageActive(newIsActive);
    }
  });

  // 手动设置进度
  const handleProgressChange = (targetProgress: number) => {
    if (USE_MOCK) {
      // 停止当前动画
      if (animationControlsRef.current) {
        animationControlsRef.current.stop();
      }

      isManualControlRef.current = true;

      // 设置新进度
      mockProgress.set(targetProgress);

      // 先播放到 1
      const controls = animate(mockProgress, 1, {
        duration: 10 * (1 - targetProgress), // 根据剩余进度调整时间
        ease: 'linear',
        onComplete: () => {
          // 播放完成后，如果是手动触发的，从头开始循环播放
          if (isManualControlRef.current) {
            mockProgress.set(0);
            const loopControls = animate(mockProgress, 1, {
              duration: 10,
              ease: 'linear',
              repeat: Infinity,
              repeatType: 'loop',
            });
            animationControlsRef.current = loopControls;
            isManualControlRef.current = false;
          }
        },
      });

      animationControlsRef.current = controls;
    } else {
      // 滚动模式下可以通过滚动到对应位置实现
      // 这里暂时不实现，因为需要计算容器位置
    }
  };

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
        {/* 波形可视化 */}
        <GradientWave progress={waveProgress} />

        {/* 常规工作流阶段 */}
        <div className="mt-4">
          <WorkflowProgress
            progress={progress}
            isLastStageActive={isLastStageActive}
            onProgressChange={handleProgressChange}
          />
        </div>

        {/* 最后阶段 - 单独一行 */}
        <div className="mt-4">
          <LastStage
            progress={progress}
            isActive={isLastStageActive}
            onProgressChange={handleProgressChange}
          />
        </div>
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
