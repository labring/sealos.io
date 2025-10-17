'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { FeatureStepper } from '../components/FeatureStepper';
import DemoLightSvg from '../assets/demo-light.svg';

export function DemoSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  // 跟踪整个动画容器的滚动进度
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end end'],
  });

  // 动画阶段划分（基于scrollYProgress 0-1）：
  // 阶段1 (0-0.125): 视频从24度旋转到0度，回正
  // 阶段2 (0.125-0.25): 视频保持在屏幕中心100vh不动
  // 阶段3 (0.25-0.50): 图案放大200vh，视频不动
  // 阶段4 (0.50-0.75): 图案+视频一起缩小200vh
  // 阶段5 (0.75-0.8125): 视频渐隐50vh
  // 阶段6 (0.8125-0.875): 图案静止50vh
  // 阶段7 (0.875-1.0): 图案随文档流滚动离开

  // 1. 视频旋转动画（阶段1）
  const rotateAngle = useTransform(scrollYProgress, [0, 0.125], [24, 0]);

  // 2. 视频容器的Y轴位置（调整初始位置使其紧贴容器顶部）
  const videoY = useTransform(
    scrollYProgress,
    [0, 0.125, 0.8125, 1],
    ['-35vh', '0vh', '0vh', '-100vh'],
  );

  // 3. 视频容器的scale（阶段4一起缩小）
  const videoScale = useTransform(scrollYProgress, [0, 0.5, 0.75], [1, 1, 0.1]);

  // 4. 视频容器的透明度（阶段4一起渐隐）
  const videoOpacity = useTransform(scrollYProgress, [0.5, 0.75], [1, 0]);

  // 5. 图案的scale（阶段3放大到120vw，阶段4缩小到0.5）
  const patternScale = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75],
    [1, 1, 56, 0.5],
  );

  // 6. 图案的Y轴位置（阶段7随文档流滚动）
  const patternY = useTransform(
    scrollYProgress,
    [0, 0.875, 1],
    ['0vh', '0vh', '0vh'],
  );

  return (
    <section className="relative overflow-visible">
      {/* Light */}
      <div className="absolute top-0 -z-10 -mt-36 w-full">
        <img src={DemoLightSvg.src} alt="" className="w-full" />
      </div>

      {/* Stepper */}
      <FeatureStepper />

      {/* 滚动容器 - 设置800vh的高度来触发所有动画 */}
      <div
        ref={containerRef}
        className="relative mt-12 overflow-visible"
        style={{ height: '800vh' }}
      >
        {/* 固定容器 - 在视口中心固定显示 */}
        <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-visible">
          {/* Video容器 */}
          <motion.div
            className="absolute perspective-midrange perspective-origin-center"
            style={{
              y: videoY,
            }}
          >
            <motion.div
              className="bg-background aspect-video w-[80vw] max-w-[1200px] origin-center rounded-4xl border-4"
              style={{
                rotateX: rotateAngle,
                scale: videoScale,
                opacity: videoOpacity,
              }}
            >
              Video here
            </motion.div>
          </motion.div>

          {/* 图案容器 */}
          <motion.div
            className="absolute flex items-center justify-center"
            style={{
              y: patternY,
            }}
          >
            <motion.div
              className="relative -z-10"
              style={{
                scale: patternScale,
              }}
            >
              <div className="size-[4rem] rounded-full bg-neutral-600" />
              <div className="absolute top-1/2 left-1/2 size-[5.32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-600 opacity-60" />
              <div className="absolute top-1/2 left-1/2 size-[6.384rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-600 opacity-20" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
