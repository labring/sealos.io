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
import { WorkflowProgress, stages } from '../components/WorkflowProgress';
import { IdeaCard } from '../components/carousel-image/IdeaCard';
import { CarouselCard } from '../components/CarouselCard';
import { AnimatedCarouselContainer } from '../components/AnimatedCarouselContainer';
import { DevelopmentCard } from '../components/carousel-image/DevelopmentCard';
import { DeploymentCard } from '../components/carousel-image/DeploymentCard';
import { DataCard } from '../components/carousel-image/DataCard';
import { GodRays } from '../components/GodRays';
import { Bot } from 'lucide-react';

export function SequenceSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mock 进度值 - 只使用时序动画
  const mockProgress = useMotionValue(0);

  // 动画控制器引用
  const animationControlsRef = useRef<any>(null);
  const isManualControlRef = useRef(false); // 标记是否是手动控制

  // 卡片内容配置（不包含组件，避免重复创建）
  const cardContents = [
    {
      title: 'It starts with an idea. Not a blank page.',
      description:
        'Describe your concept to Jotlin... automatically generating a comprehensive product spec...',
      buttonText: 'Try Jotlin',
      buttonLink: 'https://usw.sealos.io/?openapp=system-jotlin',
    },
    {
      title: 'If it runs in a container, it runs on Sealos.',
      description:
        '...Securely connect your local VS Code or Cursor... without ever leaving the tools you know and love.',
      buttonText: 'Try DevBox',
      buttonLink: 'https://usw.sealos.io/?openapp=system-devbox',
    },
    {
      title: 'Your favorite IDE, supercharged by the cloud.',
      description:
        'Deploy from a Git repo, a Docker image, or even a Docker Compose file... We manage the Kubernetes complexity...',
      buttonText: 'Try App Launchpad',
      buttonLink: 'https://usw.sealos.io/?openapp=system-applaunchpad',
    },
    {
      title: 'Production databases, simplified and intelligent.',
      description:
        'Launch a high-availability database cluster... Then, use Chat2DB to interact with your data using plain English...',
      buttonText: 'Try Database',
      buttonLink: 'https://usw.sealos.io/?openapp=system-dbprovider',
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
      default:
        return <IdeaCard />;
    }
  };

  // 跟踪当前激活的卡片索引
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const prevActiveIndexRef = useRef<number>(0);

  useEffect(() => {
    const controls = animate(mockProgress, 1, {
      duration: 30,
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

  // GradientWave 进度：直接使用 progress
  const waveProgress = progress;

  // 监听进度变化，更新当前卡片索引（只在真正改变时触发状态更新）
  useMotionValueEvent(progress, 'change', (latest) => {
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

    // 只在索引真正改变时才更新状态，避免不必要的重新渲染
    if (newActiveIndex !== prevActiveIndexRef.current) {
      prevActiveIndexRef.current = newActiveIndex;
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
      duration: 30 * (1 - targetProgress), // 根据剩余进度调整时间
      ease: 'linear',
      onComplete: () => {
        // 播放完成后，如果是手动触发的，从头开始循环播放
        if (isManualControlRef.current) {
          mockProgress.set(0);
          const loopControls = animate(mockProgress, 1, {
            duration: 30,
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
    <section
      ref={containerRef}
      className="relative w-screen overflow-x-clip pt-28 pb-32"
    >
      {/* 顶部渐变遮罩 - 灰到黑，覆盖整个屏幕宽度 */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -z-5 h-96 w-screen -translate-x-1/2"
        style={{
          background:
            'linear-gradient(to bottom, rgba(30, 30, 30, 0.6) 0%, rgba(20, 20, 20, 0.4) 40%, transparent 100%)',
        }}
      />

      {/* GodRays 效果 */}
      <GodRays
        sources={[
          {
            x: -0.08,
            y: -0.12,
            angle: 70,
            spread: 125,
            count: 13,
            color: '220, 220, 220',
          },
          {
            x: 0.5,
            y: -0.08,
            angle: 70,
            spread: 110,
            count: 12,
            color: '225, 225, 225',
          },
        ]}
        speed={0.0022}
        maxWidth={90}
        minLength={900}
        maxLength={2100}
        blur={17}
      />

      <div className="container">
        <div className="flex max-w-full flex-col items-center pb-8 md:gap-8 lg:max-w-4xl lg:flex-row lg:pb-16">
          <h2 className="w-full text-2xl leading-tight sm:text-4xl md:text-[2.5rem]">
            <span>More Than a Platform. It's</span>&nbsp;
            <GradientText>Your Entire Cloud Workflow, Reimagined.</GradientText>
          </h2>
          <p className="mt-3 w-full text-sm text-zinc-400 sm:text-base">
            A sequence of modules that appear as the user scrolls.
          </p>
        </div>
        <div>
          {/* 波形可视化 */}
          <GradientWave progress={waveProgress} />

          {/* 工作流阶段 */}
          <div className="mt-4">
            <WorkflowProgress
              progress={progress}
              onProgressChange={handleProgressChange}
            />

            <div className="relative mt-4 flex w-full flex-col items-center justify-center overflow-hidden rounded-xl bg-white/5 px-2 py-6">
              <div className="relative z-10 flex flex-col items-center gap-1 text-xs font-normal sm:flex-row sm:gap-2 sm:text-base md:text-xl md:font-medium">
                <div className="text-zinc-400">
                  <Bot />
                </div>
                <span>AI Agent</span>
              </div>

              <div className="text-sm text-zinc-400">Across all modules</div>
            </div>
          </div>
        </div>

        <AnimatedCarouselContainer activeIndex={activeCardIndex}>
          <CarouselCard
            title={cardContents[activeCardIndex].title}
            description={cardContents[activeCardIndex].description}
            buttonText={cardContents[activeCardIndex].buttonText}
            buttonLink={cardContents[activeCardIndex].buttonLink}
          >
            {renderCardComponent(activeCardIndex)}
          </CarouselCard>
        </AnimatedCarouselContainer>
      </div>
    </section>
  );
}
