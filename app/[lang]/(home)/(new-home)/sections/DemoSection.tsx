'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FeatureStepper } from '../components/FeatureStepper';
import { VideoModal } from '../components/VideoModal';
import DemoLightSvg from '@/assets/demo-light.svg';
import VideoThumbnailSvg from '@/assets/video-thumbnail.svg';
import { useGTM } from '@/hooks/use-gtm';
import { useOpenAuthForm } from '@/new-components/AuthForm/AuthFormContext';
import { getOpenBrainParam } from '@/lib/utils/brain';

export function DemoSection() {
  const { trackButton } = useGTM();
  const openAuthForm = useOpenAuthForm();

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isSpringReady, setIsSpringReady] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 40,
    mass: 0.5,
    restDelta: 0.001,
  });

  // Initialize spring to current scroll position
  const isInitializedRef = useRef(false);
  if (!isInitializedRef.current && typeof window !== 'undefined') {
    const currentProgress = scrollYProgress.get();
    smoothProgress.jump(currentProgress);
    isInitializedRef.current = true;
  }

  // Wait for spring to settle before showing content
  useEffect(() => {
    let settleTimeout: NodeJS.Timeout;

    const unsubscribe = smoothProgress.on('change', (latest) => {
      clearTimeout(settleTimeout);

      settleTimeout = setTimeout(() => {
        if (!isSpringReady) {
          setIsSpringReady(true);
        }
      }, 50);
    });

    const fallbackTimeout = setTimeout(() => {
      if (!isSpringReady) {
        setIsSpringReady(true);
      }
    }, 100);

    return () => {
      unsubscribe();
      clearTimeout(settleTimeout);
      clearTimeout(fallbackTimeout);
    };
  }, [scrollYProgress, smoothProgress, isSpringReady]);

  const videoRotateX = useTransform(smoothProgress, [0.05, 0.5], [24, 0]);

  return (
    <section className="relative w-screen overflow-x-clip overflow-y-visible object-top pt-24">
      <div
        className="pointer-events-none absolute top-0 left-1/2 h-96 w-full -translate-x-1/2"
        aria-hidden="true"
      >
        <Image
          src={DemoLightSvg}
          alt=""
          className="mx-auto h-full w-auto object-cover object-top"
          priority
        />
      </div>

      <FeatureStepper />

      <div className="mt-12 flex w-full justify-center">
        <Button
          variant="landing-primary"
          className="mx-auto h-11 w-48"
          aria-label="Start using Sealos for free."
          onClick={() => {
            trackButton('Get Started', 'demo-section', 'auth-form', '');
            openAuthForm({ openapp: getOpenBrainParam() });
          }}
        >
          Get Started Free
        </Button>
      </div>

      <div ref={containerRef} className="relative mt-12 overflow-visible">
        {isMounted && (
          <motion.div
            className="flex w-screen justify-center"
            style={{
              perspective: '2000px',
              perspectiveOrigin: 'center center',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isSpringReady ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              ref={videoRef}
              className="bg-background relative aspect-video w-[70vw] max-w-[1200px] cursor-pointer overflow-hidden rounded-4xl border-4"
              style={{
                rotateX: videoRotateX,
                transformStyle: 'preserve-3d',
                transformOrigin: 'center center',
              }}
              onClick={() => setIsModalOpen(true)}
            >
              <span className="sr-only">
                Watch how Sealos enables one-click deployment of AI agents,
                databases, and full-stack applications. Learn how to deploy your
                first app in under 60 seconds using our AI-powered cloud
                platform.
              </span>
              <Image
                src={VideoThumbnailSvg}
                alt="Video thumbnail"
                className="absolute inset-0 size-full object-cover"
                priority
                aria-hidden="true"
              />
              <div className="absolute z-10 flex h-full w-full items-center justify-center">
                <Button
                  variant="landing-primary"
                  size="icon"
                  className="size-16 cursor-pointer rounded-full"
                  aria-label="Click to play the demo video."
                  aria-hidden="false"
                >
                  <Play size={24} fill="inherit" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>

      <VideoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        videoUrl="https://www.youtube.com/embed/OgeF1WhpO44?si=Ud4Gw_-gLsrBevqg&enablejsapi=1"
      />
    </section>
  );
}
