'use client';

import { useRef, useState, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from 'motion/react';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FeatureStepper } from '../components/FeatureStepper';
import { VideoModal } from '../components/VideoModal';
import DemoLightSvg from '../assets/demo-light.svg';
import VideoThumbnailSvg from '../assets/video-thumbnail.svg';
import DemoIndicatorArrowImage from '../assets/demo-indicator-arrow.svg';

export function DemoSection() {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const patternRef = useRef<HTMLDivElement>(null);

  // State
  const [isAnimationReady, setIsAnimationReady] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Motion values for dynamic measurements
  const viewportHeightMV = useMotionValue(0);
  const videoHeightMV = useMotionValue(0);
  const patternHeightMV = useMotionValue(0);

  // Initialize animation after mount
  useEffect(() => {
    requestAnimationFrame(() => setIsAnimationReady(true));
  }, []);

  // Update element heights on resize
  useEffect(() => {
    if (!isAnimationReady) return;

    const updateHeights = () => {
      viewportHeightMV.set(window.innerHeight);
      if (videoRef.current) videoHeightMV.set(videoRef.current.offsetHeight);
      if (patternRef.current)
        patternHeightMV.set(patternRef.current.offsetHeight);
    };

    updateHeights();
    window.addEventListener('resize', updateHeights);
    return () => window.removeEventListener('resize', updateHeights);
  }, [videoHeightMV, patternHeightMV, viewportHeightMV, isAnimationReady]);

  // Scroll progress tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end end'],
  });

  // Smooth scroll progress with spring physics
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 40,
    mass: 0.5,
  });

  // Video animations
  const videoRotateX = useTransform(smoothProgress, [0, 0.125], [24, 0]);
  const videoY = useTransform(
    [smoothProgress, videoHeightMV, viewportHeightMV],
    ([p, h, vh]) => {
      const progress = p as number;
      const height = h as number;
      const viewportH = vh as number;
      const centerY = height > 0 ? viewportH / 2 - height / 2 : 0;

      if (progress <= 0.125) return centerY * (progress / 0.125);
      if (progress <= 0.8125) return centerY;
      return centerY + (-viewportH - centerY) * ((progress - 0.8125) / 0.1875);
    },
  );
  const videoScaleRaw = useTransform(
    smoothProgress,
    [0, 0.5, 0.75],
    [1, 1, 0.1],
  );
  const videoScale = useSpring(videoScaleRaw, {
    stiffness: 150,
    damping: 30,
    mass: 0.6,
  });
  const videoOpacity = useTransform(smoothProgress, [0.5, 0.725], [1, 0]);

  // Pattern animations
  const patternY = useTransform(
    [smoothProgress, patternHeightMV, viewportHeightMV],
    ([p, h, vh]) => {
      const progress = p as number;
      const height = h as number;
      const viewportH = vh as number;
      const centerY = height > 0 ? viewportH / 2 - height / 2 : 0;

      if (progress <= 0.125) return centerY * (progress / 0.125);
      if (progress <= 0.8125) return centerY;
      return centerY - centerY * ((progress - 0.8125) / 0.1875);
    },
  );
  const patternScaleRaw = useTransform(
    smoothProgress,
    [0, 0.25, 0.5, 0.75],
    [0.333, 0.333, 18.667, 0.167],
  );
  const patternScale = useSpring(patternScaleRaw, {
    stiffness: 200,
    damping: 35,
    mass: 0.5,
  });
  const patternOpacity = useTransform(
    smoothProgress,
    [0, 0.125, 0.25, 0.8125, 0.9],
    [0, 0, 1, 1, 0],
  );

  // Indicator animations
  const indicatorOpacity = useTransform(
    smoothProgress,
    [0, 0.7, 0.775],
    [1, 1, 0],
  );

  return (
    <section className="relative w-screen overflow-x-clip overflow-y-visible object-top pt-8">
      {/* Background light */}
      <div className="pointer-events-none absolute top-0 left-1/2 h-96 w-full -translate-x-1/2">
        <Image
          src={DemoLightSvg}
          alt=""
          className="mx-auto h-full w-auto object-cover object-top"
          priority
        />
      </div>

      <FeatureStepper />

      {/* Scroll container */}
      <div
        ref={containerRef}
        className="relative mt-12 overflow-visible"
        style={{ height: '400vh' }}
      >
        {/* Sticky viewport */}
        <div className="sticky top-0 flex h-screen w-screen justify-center overflow-visible">
          {/* Video container */}
          {isAnimationReady && (
            <motion.div
              className="absolute will-change-transform perspective-midrange perspective-origin-top"
              style={{ y: videoY }}
            >
              {/* Scroll indicator */}
              <motion.div
                className="absolute left-1/2 z-20 -translate-x-1/2 translate-y-[calc(min(39.375vw,675px)+1.5rem)] overflow-visible"
                style={{ opacity: indicatorOpacity }}
              >
                <motion.div
                  animate={{
                    opacity: [0.5, 1, 0.5],
                    scale: [1, 1.1, 1],
                    y: ['0rem', '1rem', '0rem'],
                  }}
                  transition={{
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

              {/* Video player */}
              <motion.div
                ref={videoRef}
                className="bg-background relative aspect-video w-[70vw] max-w-[1200px] origin-center cursor-pointer overflow-hidden rounded-4xl border-4 will-change-[transform,opacity]"
                style={{
                  rotateX: videoRotateX,
                  scale: videoScale,
                  opacity: videoOpacity,
                  transformStyle: 'preserve-3d',
                }}
                onClick={() => setIsModalOpen(true)}
              >
                <Image
                  src={VideoThumbnailSvg}
                  alt="Video thumbnail"
                  className="absolute inset-0 size-full object-cover"
                  priority
                />
                <div className="absolute z-10 flex h-full w-full items-center justify-center">
                  <Button
                    variant="landing-primary"
                    size="icon"
                    className="size-16 cursor-pointer rounded-full"
                  >
                    <Play size={24} fill="inherit" />
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Pattern background */}
          {isAnimationReady && (
            <motion.div
              className="absolute -z-10 flex items-center justify-center will-change-transform"
              style={{ y: patternY }}
            >
              <motion.div
                ref={patternRef}
                className="relative will-change-[transform,opacity]"
                style={{
                  scale: patternScale,
                  opacity: patternOpacity,
                }}
              >
                <div className="size-[12rem] rounded-full bg-neutral-600" />
                <div className="absolute top-1/2 left-1/2 size-[calc(1.333_*_12rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-600 opacity-60" />
                <div className="absolute top-1/2 left-1/2 size-[calc(1.596_*_12rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-600 opacity-20" />
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>

      <VideoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        videoUrl="https://www.youtube.com/embed/OgeF1WhpO44?si=Ud4Gw_-gLsrBevqg&enablejsapi=1"
      />
    </section>
  );
}
