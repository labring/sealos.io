'use client';

import { useRef, useState, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from 'motion/react';
import { FeatureStepper } from '../components/FeatureStepper';
import DemoLightSvg from '../assets/demo-light.svg';
import VideoThumbnailSvg from '../assets/video-thumbnail.svg';
import DemoIndicatorArrowImage from '../assets/demo-indicator-arrow.svg';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { VideoModal } from '../components/VideoModal';

export function DemoSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const patternRef = useRef<HTMLDivElement>(null);
  const videoHeightMV = useMotionValue(0);
  const patternHeightMV = useMotionValue(0);
  const [isAnimationReady, setIsAnimationReady] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Show video after scripts loaded.
  useEffect(() => {
    const initAnimation = () => {
      setIsAnimationReady(true);
    };

    requestAnimationFrame(initAnimation);
  }, []);

  // 动态读取视频和图案容器的高度
  useEffect(() => {
    if (!isAnimationReady) return;

    const updateHeights = () => {
      if (videoRef.current) {
        const height = videoRef.current.offsetHeight;
        videoHeightMV.set(height);
      }
      if (patternRef.current) {
        const height = patternRef.current.offsetHeight;
        patternHeightMV.set(height);
      }
    };

    updateHeights();
    window.addEventListener('resize', updateHeights);
    return () => window.removeEventListener('resize', updateHeights);
  }, [videoHeightMV, patternHeightMV, isAnimationReady]);

  // 跟踪整个动画容器的滚动进度
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end end'],
  });

  // 动画阶段划分（基于scrollYProgress 0-1）：
  // 阶段1: 视频从24度旋转到0度，回正
  // 阶段2: 视频保持在屏幕中心不动
  // 阶段3: 图案放大，视频不动
  // 阶段4: 图案+视频一起缩小
  // 阶段5: 视频渐隐
  // 阶段6: 图案静止
  // 阶段7: 图案随文档流滚动离开

  // 1. 视频旋转动画（阶段1）
  const rotateAngle = useTransform(scrollYProgress, [0, 0.125], [24, 0]);

  // 2. 视频容器的Y轴位置（从上方移动到中心，最后移出屏幕）
  // 计算初始位置：从中心向上移动，但留出空间给 Stepper
  // 动态计算：50vh - 50%视频高度，使视频垂直居中
  const videoYRaw = useTransform(
    [scrollYProgress, videoHeightMV],
    ([progress, height]) => {
      const progressValue = progress as number;
      const heightValue = height as number;
      const initialY =
        heightValue > 0 ? window.innerHeight / 2 - heightValue / 2 : 0;

      if (progressValue <= 0.125) {
        // 阶段1：从 0 移动到 initialY
        return initialY * (progressValue / 0.125);
      } else if (progressValue <= 0.8125) {
        // 阶段2-3：保持在 initialY
        return initialY;
      } else {
        // 阶段4：从 initialY 移动到 -100vh
        const t = (progressValue - 0.8125) / (1 - 0.8125);
        return initialY + (-window.innerHeight - initialY) * t;
      }
    },
  );

  // 3. 视频容器的scale（阶段4一起缩小）
  const videoScaleRaw = useTransform(
    scrollYProgress,
    [0, 0.5, 0.75],
    [1, 1, 0.1],
  );
  const videoScale = useSpring(videoScaleRaw, {
    stiffness: 150,
    damping: 30,
    mass: 0.6,
  });

  // 4. 视频容器的透明度（阶段4一起渐隐, 但比图案快一点）
  const videoOpacity = useTransform(scrollYProgress, [0.5, 0.725], [1, 0]);

  // 5. 图案的scale（阶段3放大到120vw，阶段4缩小到0.5）
  const patternScaleRaw = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75],
    [1, 1, 56, 0.5],
  );
  const patternScale = useSpring(patternScaleRaw, {
    stiffness: 150,
    damping: 30,
    mass: 0.6,
  });

  // 6. 图案的Y轴位置（使用50vh - 50%图案高度计算）
  const patternYRaw = useTransform(
    [scrollYProgress, patternHeightMV],
    ([progress, height]) => {
      const progressValue = progress as number;
      const heightValue = height as number;
      const initialY =
        heightValue > 0 ? window.innerHeight / 2 - heightValue / 2 : 0;

      if (progressValue <= 0.125) {
        // 阶段1：从 0 移动到 initialY
        return initialY * (progressValue / 0.125);
      } else if (progressValue <= 0.8125) {
        // 阶段2-3：保持在 initialY
        return initialY;
      } else {
        // 阶段4：从 initialY 移动到 -100vh
        const t = (progressValue - 0.8125) / (1 - 0.8125);
        return initialY + (0 - initialY) * t;
      }
    },
  );

  // Scroll down indicator opacity
  const scrollDownIndicatorOpacity = useTransform(
    scrollYProgress,
    [0, 0.7, 0.775],
    [1, 1, 0],
  );

  // 7. 图案的透明度（阶段2时从0变为1）
  const patternOpacity = useTransform(
    scrollYProgress,
    [0, 0.125, 0.25, 0.8125, 0.9],
    [0, 0, 1, 1, 0],
  );

  // 处理播放按钮点击
  const handlePlayClick = () => {
    setIsModalOpen(true);
  };

  return (
    <section className="relative w-screen overflow-x-clip overflow-y-visible object-top pt-8">
      {/* Light */}
      <div className="pointer-events-none absolute top-0 left-1/2 h-96 w-full -translate-x-1/2">
        <Image
          src={DemoLightSvg}
          alt=""
          className="mx-auto h-full w-auto object-cover object-top"
          priority
        />
      </div>

      {/* Stepper */}
      <FeatureStepper />

      {/* 滚动容器 - 设置400vh的高度来触发所有动画 */}
      <div
        ref={containerRef}
        className="relative mt-12 overflow-visible"
        style={{ height: '400vh' }}
      >
        {/* 固定容器 - 在视口中心固定显示 */}
        <div className="sticky top-0 flex h-screen w-screen justify-center overflow-visible">
          {/* Video容器 - 仅在动画准备好后渲染 */}
          {isAnimationReady && (
            <motion.div
              className="absolute will-change-transform perspective-midrange perspective-origin-top"
              style={{
                y: videoYRaw,
              }}
            >
              {/* Indicator arrow */}
              <motion.div
                className="absolute left-1/2 z-20 -translate-x-1/2 translate-y-[calc(min(39.375vw,675px)+1.5rem)] overflow-visible"
                style={{
                  opacity: scrollDownIndicatorOpacity,
                }}
              >
                <motion.div
                  initial={{
                    opacity: 1,
                  }}
                  animate={{
                    opacity: [0.5, 1, 0.5],
                    scale: [1, 1.1, 1],
                    y: ['0rem', '1rem', '0rem'],
                  }}
                  transition={{
                    type: 'keyframes',
                    repeat: Infinity,
                    duration: 1.5,
                  }}
                >
                  <Image
                    src={DemoIndicatorArrowImage}
                    alt="Scroll down indicator"
                  />
                </motion.div>
              </motion.div>

              <motion.div
                ref={videoRef}
                className="bg-background relative aspect-video w-[70vw] max-w-[1200px] origin-center cursor-pointer overflow-hidden rounded-4xl border-4"
                style={{
                  rotateX: rotateAngle,
                  scale: videoScale,
                  opacity: videoOpacity,
                  transformStyle: 'preserve-3d',
                }}
                onClick={handlePlayClick}
              >
                {/* 缩略图背景 */}
                <Image
                  src={VideoThumbnailSvg}
                  alt="Video thumbnail"
                  className="absolute inset-0 size-full object-cover"
                  priority
                />
                {/* 播放按钮覆盖层 */}
                <div className="absolute z-10 flex h-full w-full items-center justify-center">
                  <Button
                    variant="landing-primary"
                    size="icon"
                    className="size-16 cursor-pointer rounded-full"
                    onClick={handlePlayClick}
                  >
                    <Play size={24} fill="inherit" />
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* 图案容器 - 仅在动画准备好后渲染 */}
          {isAnimationReady && (
            <motion.div
              className="absolute -z-10 flex items-center justify-center"
              style={{
                y: patternYRaw,
              }}
            >
              <motion.div
                ref={patternRef}
                className="relative"
                style={{
                  scale: patternScale,
                  opacity: patternOpacity,
                }}
              >
                <div className="size-[4rem] rounded-full bg-neutral-600" />
                <div className="absolute top-1/2 left-1/2 size-[5.32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-600 opacity-60" />
                <div className="absolute top-1/2 left-1/2 size-[6.384rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-600 opacity-20" />
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>

      {/* 视频模态框 */}
      <VideoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        videoUrl="https://www.youtube.com/embed/OgeF1WhpO44?si=Ud4Gw_-gLsrBevqg&enablejsapi=1"
      />
    </section>
  );
}
