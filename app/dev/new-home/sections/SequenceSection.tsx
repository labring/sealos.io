'use client';

import { useRef, useEffect, useState } from 'react';
import {
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
  stages,
} from '../components/WorkflowProgress';
import { IdeaCard } from '../components/carousel-image/IdeaCard';
import { CarouselCard } from '../components/CarouselCard';
import { AnimatedCarouselContainer } from '../components/AnimatedCarouselContainer';
import { DevelopmentCard } from '../components/carousel-image/DevelopmentCard';
import { DeploymentCard } from '../components/carousel-image/DeploymentCard';
import { DataCard } from '../components/carousel-image/DataCard';
import { AiAgentCard } from '../components/carousel-image/AiAgentCard';

export function SequenceSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mock 进度值 - 只使用时序动画
  const mockProgress = useMotionValue(0);

  // 动画控制器引用
  const animationControlsRef = useRef<any>(null);
  const isManualControlRef = useRef(false); // 标记是否是手动控制

  // 跟踪最后阶段是否激活
  const [isLastStageActive, setIsLastStageActive] = useState(false);
  const prevLastStageActiveRef = useRef(false);

  // 卡片内容配置（不包含组件，避免重复创建）
  const cardContents = [
    {
      title: 'It starts with an idea. Not a blank page.',
      description:
        'Describe your concept to Jotlin... automatically generating a comprehensive product spec...',
      buttonText: 'Try Jotlin',
    },
    {
      title: 'If it runs in a container, it runs on Sealos.',
      description:
        '...Securely connect your local VS Code or Cursor... without ever leaving the tools you know and love.',
      buttonText: 'Try DevBox',
    },
    {
      title: 'Your favorite IDE, supercharged by the cloud.',
      description:
        'Deploy from a Git repo, a Docker image, or even a Docker Compose file... We manage the Kubernetes complexity...',
      buttonText: 'Try App Launchpad',
    },
    {
      title: 'Production databases, simplified and intelligent.',
      description:
        'Launch a high-availability database cluster... Then, use Chat2DB to interact with your data using plain English...',
      buttonText: 'Try Database',
    },
    {
      title: 'From one sentence, to a complete system.',
      description:
        'Remember that sentence you started with? The AI Pilot is what makes it possible... automating thousands of complex tasks...',
      buttonText: 'Try AI Pilot',
    },
  ];

  // 根据索引渲染对应的卡片组件
  const renderCardComponent = (index: number) => {
    switch (index) {
      case 0:
        return <IdeaCard />;
      case 1:
        return <DevelopmentCard />;
      case 2:
        return <DeploymentCard />;
      case 3:
        return <DataCard />;
      case 4:
        return <AiAgentCard />;
      default:
        return <IdeaCard />;
    }
  };

  // 跟踪当前激活的卡片索引
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);

  // 获取最后阶段的开始位置
  const lastStageStartProgress = getLastStageStartProgress();

  useEffect(() => {
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
  }, [mockProgress]);

  // 使用 mockProgress 作为进度
  const progress = mockProgress;

  // GradientWave 进度：最后阶段之前映射到 0-1，最后阶段保持为 1 (idle状态)
  const waveProgress = useTransform(progress, (value) => {
    if (value >= lastStageStartProgress) return 1; // idle 状态
    return value / lastStageStartProgress; // 映射到 0-1
  });

  // 监听进度变化，更新最后阶段激活状态和当前卡片索引
  useMotionValueEvent(progress, 'change', (latest) => {
    // 更新最后阶段激活状态
    const newIsActive = latest >= lastStageStartProgress;
    if (newIsActive !== prevLastStageActiveRef.current) {
      prevLastStageActiveRef.current = newIsActive;
      setIsLastStageActive(newIsActive);
    }

    // 更新当前激活的卡片索引
    let newActiveIndex: number;
    if (latest >= 1) {
      newActiveIndex = stages.length - 1;
    } else if (latest < 0) {
      newActiveIndex = 0;
    } else {
      newActiveIndex = stages.findIndex(
        (stage) => latest >= stage.range[0] && latest < stage.range[1],
      );
      if (newActiveIndex === -1) newActiveIndex = 0;
    }

    if (newActiveIndex !== activeCardIndex) {
      setActiveCardIndex(newActiveIndex);
    }
  });

  // 手动设置进度
  const handleProgressChange = (targetProgress: number) => {
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

      <AnimatedCarouselContainer activeIndex={activeCardIndex}>
        <CarouselCard
          title={cardContents[activeCardIndex].title}
          description={cardContents[activeCardIndex].description}
          buttonText={cardContents[activeCardIndex].buttonText}
        >
          {renderCardComponent(activeCardIndex)}
        </CarouselCard>
      </AnimatedCarouselContainer>
    </section>
  );
}
