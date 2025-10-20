'use client';

import { useState, memo, useRef } from 'react';
import { Bot, CodeXml, Database, Lightbulb, Rocket } from 'lucide-react';
import {
  motion,
  useTransform,
  useMotionValueEvent,
  MotionValue,
} from 'framer-motion';
import { ProgressIndicator } from './ProgressIndicator';
import { cn } from '@/lib/utils';

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

    // useTransform 必须在组件顶层调用
    const stageProgress = useTransform(progress, [start, end], [0, 1]);

    // 使用 MotionValue 直接计算位置，避免字符串转换触发重新渲染
    const indicatorLeftPercent = useTransform(stageProgress, [0, 1], [0, 100]);
    const indicatorLeft = useTransform(indicatorLeftPercent, (v) => `${v}%`);

    // 使用 MotionValue 控制背景色，避免 animate 触发重新渲染
    const backgroundColor = useTransform(progress, (latest) => {
      const inRange = latest >= start && latest < end;
      return inRange ? 'rgb(38, 38, 38)' : 'rgb(23, 23, 23)';
    });

    return (
      <motion.div
        className="relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl px-2 py-6 text-xs font-normal sm:text-base md:gap-2 md:text-xl md:font-medium"
        style={{
          backgroundColor,
        }}
        onClick={() => onStageClick(index)}
      >
        {isActive && (
          <motion.div
            className="absolute inset-0 overflow-hidden rounded-xl"
            initial={false}
          >
            <motion.div
              className="absolute top-0 h-full"
              style={{
                left: indicatorLeft,
              }}
            >
              <ProgressIndicator className="h-full -translate-x-1/2" />
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

    // 监听进度变化，更新激活的阶段
    useMotionValueEvent(progress, 'change', (latest) => {
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
      <div className="flex w-full gap-2.5">
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
