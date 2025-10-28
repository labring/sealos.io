'use client';

import { useState, memo, useRef, useEffect } from 'react';
import { CodeXml, Database, Lightbulb, Rocket } from 'lucide-react';
import {
  motion,
  useMotionValueEvent,
  MotionValue,
  useInView,
  useAnimate,
} from 'framer-motion';
import { ProgressIndicator } from './ProgressIndicator';

interface StageDefinition {
  name: string;
  icon: React.ReactNode;
  weight: number; // 相对权重
}

interface StageConfig extends StageDefinition {
  range: [number, number]; // [start, end] 0-1，基于总进度
  isLastStage: boolean; // 是否是最后一个阶段（用于特殊处理）
}

// 阶段定义：name, icon, weight（权重）
// 权重会被归一化为 0-1 的范围
const stageDefinitions: StageDefinition[] = [
  {
    name: 'Idea',
    icon: <Lightbulb className="size-4 sm:size-5 md:size-6" />,
    weight: 1,
  },
  {
    name: 'Development',
    icon: <CodeXml className="size-4 sm:size-5 md:size-6" />,
    weight: 1,
  },
  {
    name: 'Deployment',
    icon: <Rocket className="size-4 sm:size-5 md:size-6" />,
    weight: 1,
  },
  {
    name: 'Data',
    icon: <Database className="size-4 sm:size-5 md:size-6" />,
    weight: 1,
  },
];

// 根据权重计算每个阶段的 range
function calculateStageRanges(definitions: StageDefinition[]): StageConfig[] {
  const totalWeight = definitions.reduce((sum, stage) => sum + stage.weight, 0);

  let currentStart = 0;
  return definitions.map((def, index) => {
    const proportion = def.weight / totalWeight;
    const range: [number, number] = [currentStart, currentStart + proportion];
    currentStart += proportion;

    return {
      ...def,
      range,
      isLastStage: index === definitions.length - 1,
    };
  });
}

const stages: StageConfig[] = calculateStageRanges(stageDefinitions);

// 导出配置供外部使用
export { stages, stageDefinitions };

interface StageItemProps {
  stage: StageConfig;
  index: number;
  isActive: boolean;
  progress: MotionValue<number>;
  onStageClick: (stageIndex: number) => void;
}

// 拆分单个 stage 为独立组件，避免所有 stage 重新渲染
const StageItem = memo(
  ({ stage, index, isActive, progress, onStageClick }: StageItemProps) => {
    const [start, end] = stage.range;
    const [scope, animate] = useAnimate();
    const containerRef = useRef<HTMLDivElement>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const prevProgressRef = useRef<number>(0);

    // 获取容器宽度
    const getContainerWidth = () => {
      return containerRef.current?.offsetWidth || 0;
    };

    // 监听全局进度，当进入当前 stage 时触发动画
    useMotionValueEvent(progress, 'change', (latest) => {
      if (!scope.current) return; // 确保 ref 已挂载

      const inRange = latest >= start && latest < end;
      const wasInRange =
        prevProgressRef.current >= start && prevProgressRef.current < end;
      const containerWidth = getContainerWidth();

      if (inRange && !wasInRange && !isAnimating) {
        // 刚进入当前 stage，开始动画
        setIsAnimating(true);
        const stageDuration = (end - start) * 10; // 假设总时长 10 秒

        animate(
          scope.current,
          { x: containerWidth },
          {
            duration: stageDuration,
            ease: 'linear',
          },
        ).then(() => {
          setIsAnimating(false);
        });
      } else if (!inRange && wasInRange) {
        // 离开当前 stage，停止动画并重置
        animate(scope.current, { x: 0 }, { duration: 0 });
        setIsAnimating(false);
      } else if (inRange && wasInRange) {
        // 在当前 stage 内跳转（用户点击）
        const stageProgress = (latest - start) / (end - start);
        animate(
          scope.current,
          { x: stageProgress * containerWidth },
          { duration: 0 },
        );

        if (!isAnimating) {
          setIsAnimating(true);
          const remainingDuration = (end - latest) * 10;
          animate(
            scope.current,
            { x: containerWidth },
            {
              duration: remainingDuration,
              ease: 'linear',
            },
          ).then(() => {
            setIsAnimating(false);
          });
        }
      }

      prevProgressRef.current = latest;
    });

    return (
      <motion.div
        ref={containerRef}
        className="relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl px-2 py-6 text-xs font-normal sm:text-base md:gap-2 md:text-xl md:font-medium"
        animate={{
          backgroundColor: isActive ? 'rgb(38, 38, 38)' : 'rgb(23, 23, 23)',
        }}
        transition={{ duration: 0.3 }}
        onClick={() => onStageClick(index)}
      >
        {isActive && (
          <motion.div
            className="absolute inset-0 overflow-hidden rounded-xl"
            initial={false}
          >
            <motion.div
              ref={scope}
              className="absolute top-0 left-0 h-full -translate-x-1/2 will-change-transform"
              initial={{ x: '0%' }}
            >
              <ProgressIndicator className="h-full" />
            </motion.div>
          </motion.div>
        )}

        <div className="relative z-10 flex flex-col items-center gap-1 sm:flex-row sm:gap-2">
          <div className="text-zinc-400">{stage.icon}</div>
          <span>{stage.name}</span>
        </div>
      </motion.div>
    );
  },
);

StageItem.displayName = 'StageItem';

interface WorkflowProgressProps {
  progress: MotionValue<number>;
  onProgressChange?: (progress: number) => void;
}

export const WorkflowProgress = memo(
  ({ progress, onProgressChange }: WorkflowProgressProps) => {
    // 跟踪当前激活的阶段索引
    const [activeStageIndex, setActiveStageIndex] = useState<number>(-1);
    const prevActiveIndexRef = useRef<number>(-1);
    const containerRef = useRef<HTMLDivElement>(null);

    // 使用 useInView 检测组件是否在视口内
    const isInView = useInView(containerRef, {
      margin: '0px 0px 0px 0px',
      amount: 0,
    });

    // 监听进度变化，更新激活的阶段
    useMotionValueEvent(progress, 'change', (latest) => {
      if (!isInView) return; // 不在视口时不更新状态

      let newActiveIndex: number;

      // 找到当前进度对应的阶段
      if (latest >= 1) {
        newActiveIndex = stages.length - 1;
      } else if (latest < 0) {
        newActiveIndex = -1;
      } else {
        newActiveIndex = stages.findIndex(
          (stage) => latest >= stage.range[0] && latest < stage.range[1],
        );
      }

      // 只在阶段真正改变时才更新状态
      if (newActiveIndex !== prevActiveIndexRef.current) {
        prevActiveIndexRef.current = newActiveIndex;
        setActiveStageIndex(newActiveIndex);
      }
    });

    // 点击阶段时跳转到该阶段的开头
    const handleStageClick = (stageIndex: number) => {
      if (onProgressChange && stageIndex >= 0 && stageIndex < stages.length) {
        const targetProgress = stages[stageIndex].range[0];
        onProgressChange(targetProgress);
      }
    };

    return (
      <div ref={containerRef} className="flex w-full gap-2.5">
        {stages.map((stage, index) => (
          <StageItem
            key={stage.name}
            stage={stage}
            index={index}
            isActive={activeStageIndex === index}
            progress={progress}
            onStageClick={handleStageClick}
          />
        ))}
      </div>
    );
  },
);

WorkflowProgress.displayName = 'WorkflowProgress';
