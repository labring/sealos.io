'use client';

import { useRef, useEffect, useState, memo } from 'react';
import {
  useMotionValue,
  animate,
  useMotionValueEvent,
  useInView,
} from 'framer-motion';
import { GradientText } from '@/new-components/GradientText';
import { GradientWave } from '../components/GradientWave';
import { WorkflowProgress, stages } from '../components/WorkflowProgress';
import { IdeaCard } from '../components/carousel-image/IdeaCard';
import { CarouselCard } from '../components/CarouselCard';
import { AnimatedCarouselContainer } from '../components/AnimatedCarouselContainer';
import { DevelopmentCard } from '../components/carousel-image/DevelopmentCard';
import { DeploymentCard } from '../components/carousel-image/DeploymentCard';
import { DataCard } from '../components/carousel-image/DataCard';
import { GodRays } from '@/new-components/GodRays';
import { Bot } from 'lucide-react';

// 卡片内容配置 - 移到组件外部避免重复创建
const CARD_CONTENTS = [
  {
    title: 'It starts with an idea. Not a blank page.',
    description:
      'Describe your concept to Jotlin... automatically generating a comprehensive product spec...',
    buttonText: 'Try Jotlin',
    buttonLink: 'https://os.sealos.io/?openapp=system-jotlin',
  },
  {
    title: 'Your favorite IDE, supercharged by the cloud.',
    description:
      '...Securely connect your local VS Code or Cursor... without ever leaving the tools you know and love.',
    buttonText: 'Try DevBox',
    buttonLink: 'https://os.sealos.io/?openapp=system-devbox',
  },
  {
    title: 'If it runs in a container, it runs on Sealos.',
    description:
      'Deploy from a Git repo, a Docker image, or even a Docker Compose file... We manage the Kubernetes complexity...',
    buttonText: 'Try App Launchpad',
    buttonLink: 'https://os.sealos.io/?openapp=system-applaunchpad',
  },
  {
    title: 'Production databases, simplified and intelligent.',
    description:
      'Launch a high-availability database cluster... Then, use Chat2DB to interact with your data using plain English...',
    buttonText: 'Try Database',
    buttonLink: 'https://os.sealos.io/?openapp=system-dbprovider',
  },
] as const;

// 卡片组件映射
const CARD_COMPONENTS = [
  { Component: IdeaCard, id: 'idea' },
  { Component: DevelopmentCard, id: 'development' },
  { Component: DeploymentCard, id: 'deployment' },
  { Component: DataCard, id: 'data' },
] as const;

// 单个卡片包装器 - 处理首次渲染的动画
const CardWrapper = memo(
  ({
    isActive,
    cardContent,
    Component,
    id,
  }: {
    isActive: boolean;
    cardContent: (typeof CARD_CONTENTS)[number];
    Component: (typeof CARD_COMPONENTS)[number]['Component'];
    id: string;
  }) => {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      // 延迟一帧让浏览器先渲染初始状态
      const timer = requestAnimationFrame(() => {
        setIsReady(true);
      });
      return () => cancelAnimationFrame(timer);
    }, []);

    return (
      <div
        key={id}
        className="absolute inset-0 will-change-transform"
        style={{
          opacity: isActive && isReady ? 1 : 0,
          transform:
            isActive && isReady
              ? 'translateY(0px) scale(1)'
              : 'translateY(-20px) scale(0.95)',
          transition:
            'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents: isActive ? 'auto' : 'none',
        }}
        aria-hidden={!isActive}
        aria-live={isActive ? 'polite' : 'off'}
      >
        <CarouselCard
          title={cardContent.title}
          description={cardContent.description}
          buttonText={cardContent.buttonText}
          buttonLink={cardContent.buttonLink}
        >
          <Component isActive={isActive} />
        </CarouselCard>
      </div>
    );
  },
);

CardWrapper.displayName = 'CardWrapper';

// 所有卡片容器 - 管理卡片的渲染和过渡动画
const AllCardsContainer = memo(({ activeIndex }: { activeIndex: number }) => {
  const [renderedCards, setRenderedCards] = useState<Set<number>>(new Set([0]));

  useEffect(() => {
    setRenderedCards((prev) => {
      const next = new Set(prev);
      next.add(activeIndex);
      return next;
    });
  }, [activeIndex]);

  return (
    <div className="relative h-full w-full">
      {CARD_COMPONENTS.map(({ Component, id }, index) => {
        const isActive = activeIndex === index;
        const shouldRender = renderedCards.has(index);
        const cardContent = CARD_CONTENTS[index];

        if (!shouldRender) return null;

        return (
          <CardWrapper
            key={id}
            isActive={isActive}
            cardContent={cardContent}
            Component={Component}
            id={id}
          />
        );
      })}
    </div>
  );
});

AllCardsContainer.displayName = 'AllCardsContainer';

export function SequenceSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mock 进度值 - 只使用时序动画
  const mockProgress = useMotionValue(0);

  // 动画控制器引用
  const animationControlsRef = useRef<any>(null);
  const isManualControlRef = useRef(false); // 标记是否是手动控制
  const isInView = useInView(containerRef, { once: false, amount: 0.1 });

  // 跟踪当前激活的卡片索引
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const prevActiveIndexRef = useRef<number>(0);

  useEffect(() => {
    if (!isInView) {
      // Stop animation when not in view
      if (animationControlsRef.current) {
        animationControlsRef.current.stop();
      }
      return;
    }

    // 获取当前进度值
    const currentProgress = mockProgress.get();

    // 计算剩余进度和对应的时间
    const remainingProgress = 1 - currentProgress;
    const remainingDuration = 30 * remainingProgress;

    // Start/resume animation when in view from current progress
    const controls = animate(mockProgress, 1, {
      duration: remainingDuration,
      ease: 'linear',
      onComplete: () => {
        // 完成一轮后，重置并开始无限循环
        mockProgress.set(0);
        const loopControls = animate(mockProgress, 1, {
          duration: 30,
          ease: 'linear',
          repeat: Infinity,
          repeatType: 'loop',
        });
        animationControlsRef.current = loopControls;
        isManualControlRef.current = false;
      },
    });

    animationControlsRef.current = controls;

    return controls.stop;
  }, [mockProgress, isInView]);

  // 使用 mockProgress 作为进度
  const progress = mockProgress;

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
    if (!isInView) return; // Don't start animation if not in view

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

      {/* GodRays 效果 - only render when in view */}
      {isInView && (
        <GodRays
          sources={[
            {
              x: 0.08,
              y: -0.12,
              angle: 60,
              spread: 30,
              count: 13,
              color: '220, 220, 220',
            },
            {
              x: 0.8,
              y: -0.08,
              angle: 60,
              spread: 40,
              count: 12,
              color: '225, 225, 225',
            },
          ]}
          speed={0.0022}
          maxWidth={90}
          minLength={900}
          maxLength={1900}
          blur={17}
        />
      )}

      <div className="container">
        <div className="flex max-w-full flex-col items-center pb-8 md:gap-8 lg:max-w-4xl lg:flex-row lg:pb-16">
          <h2
            className="w-full text-2xl leading-tight sm:text-4xl md:text-[2.5rem]"
            aria-label="More Than a Platform. It's Your Entire Cloud Workflow, Reimagined."
          >
            <span>More Than a Platform. It's</span>&nbsp;
            <GradientText>Your Entire Cloud Workflow, Reimagined.</GradientText>
          </h2>
          <p className="mt-3 w-full text-sm text-zinc-400 sm:text-base">
            {/* description content */}
          </p>
        </div>
        <div>
          {/* 波形可视化 */}
          <GradientWave progress={progress} />

          {/* 工作流阶段 */}
          <div className="mt-4">
            <WorkflowProgress
              progress={progress}
              onProgressChange={handleProgressChange}
            />

            <div className="relative z-10 mt-4 flex w-full flex-col items-center gap-4 text-xs text-zinc-400 sm:flex-row sm:gap-2 sm:text-base">
              <div className="w-full border-b border-dashed border-zinc-400" />
              <div className="flex shrink-0 items-center gap-2">
                <Bot aria-hidden="true" />
                <span>AI across all modules</span>
              </div>
              <div className="w-full border-b border-dashed border-zinc-400" />
            </div>
          </div>
        </div>

        <AnimatedCarouselContainer activeIndex={activeCardIndex}>
          <AllCardsContainer activeIndex={activeCardIndex} />
        </AnimatedCarouselContainer>
      </div>
    </section>
  );
}
