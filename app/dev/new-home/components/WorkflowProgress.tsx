'use client';

import { useState } from 'react';
import { CodeXml, Database, Lightbulb, Rocket } from 'lucide-react';
import {
  motion,
  useTransform,
  useMotionValueEvent,
  MotionValue,
} from 'framer-motion';
import { GradientWave } from './GradientWave';
import { ProgressIndicator } from './ProgressIndicator';
import { cn } from '@/lib/utils';

interface StageConfig {
  name: string;
  icon: React.ReactNode;
  range: [number, number]; // [start, end] 0-1
}

const stages: StageConfig[] = [
  { name: 'Idea', icon: <Lightbulb size={24} />, range: [0, 0.25] },
  { name: 'Development', icon: <CodeXml size={24} />, range: [0.25, 0.5] },
  { name: 'Deployment', icon: <Rocket size={24} />, range: [0.5, 0.75] },
  { name: 'Data', icon: <Database size={24} />, range: [0.75, 1] },
];

interface WorkflowProgressProps {
  progress: MotionValue<number>;
}

export function WorkflowProgress({ progress }: WorkflowProgressProps) {
  // 跟踪当前激活的阶段索引
  const [activeStageIndex, setActiveStageIndex] = useState<number>(-1);

  // 监听进度变化，更新激活的阶段
  useMotionValueEvent(progress, 'change', (latest) => {
    const newActiveIndex = stages.findIndex(
      (stage) => latest >= stage.range[0] && latest < stage.range[1],
    );
    // 处理边界情况：当进度为1时，激活最后一个阶段
    if (latest >= 1) {
      setActiveStageIndex(stages.length - 1);
    } else {
      setActiveStageIndex(newActiveIndex);
    }
  });

  return (
    <div>
      <GradientWave progress={progress} />

      <div className="mt-4 flex w-full gap-2.5">
        {stages.map((stage, index) => {
          const [start, end] = stage.range;
          const isActive = activeStageIndex === index;

          // 计算当前阶段的局部进度 (0-1)
          const stageProgress = useTransform(progress, [start, end], [0, 1]);

          // ProgressIndicator 的左侧偏移量（从左到右）
          const indicatorLeft = useTransform(
            stageProgress,
            [0, 1],
            ['0%', '100%'],
          );

          return (
            <motion.div
              key={stage.name}
              className={cn(
                'relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-2 py-6 text-xl',
              )}
              animate={{
                backgroundColor: isActive
                  ? 'rgb(38, 38, 38)'
                  : 'rgb(23, 23, 23)',
              }}
              transition={{
                backgroundColor: {
                  duration: 0.25,
                  ease: 'easeInOut',
                },
              }}
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

              <div className="relative z-10 flex items-center gap-2">
                <div className="text-zinc-400">{stage.icon}</div>
                <span>{stage.name}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
