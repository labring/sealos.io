'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import Image from 'next/image';
import { CircleCheck, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VideoModal } from '../components/VideoModal';
import VideoThumbnailSvg from '@/assets/video-thumbnail.svg';
import { useGTM } from '@/hooks/use-gtm';
import { useOpenAuthForm } from '@/new-components/AuthForm/AuthFormContext';
import { getOpenBrainParam } from '@/lib/utils/brain';
import { GradientLucideIcon } from '@/new-components/GradientLucideIcon';

export function DemoSection() {
  const { trackButton } = useGTM();
  const openAuthForm = useOpenAuthForm();

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const videoRotateX = useTransform(scrollYProgress, [0.05, 0.5], [24, 0]);

  return (
    <section className="relative -mt-28 w-screen overflow-x-clip overflow-y-visible object-top">
      <div className="container flex w-full justify-center gap-5">
        <Button
          variant="landing-primary"
          className="h-11 w-48"
          aria-label="Start using Sealos for free."
          onClick={() => {
            trackButton('Get Started', 'demo-section', 'auth-form', '');
            openAuthForm({ openapp: getOpenBrainParam() });
          }}
        >
          Get Started Free
        </Button>
        <Button
          variant="outline"
          className="h-11 w-48 rounded-full border-white/10 bg-neutral-900"
          aria-label="Watch the 1 minute demo video."
          onClick={() => {
            const containerTop =
              containerRef.current?.getBoundingClientRect().top ?? null;
            if (containerTop) {
              // Scroll to video container
              window.scrollTo({
                top: containerTop + window.scrollY - window.innerHeight / 4,
                behavior: 'auto',
              });
            }
            setIsModalOpen(true);
          }}
        >
          Watch 1-min Demo
        </Button>
      </div>

      <div className="text-muted-foreground container mt-6 flex w-full max-w-sm flex-col justify-center gap-3 md:max-w-max md:flex-row md:gap-6">
        <div className="flex items-center gap-2">
          <GradientLucideIcon Icon={CircleCheck} className="size-5" />
          <span>7 days free trial</span>
        </div>
        <div className="flex items-center gap-2">
          <GradientLucideIcon Icon={CircleCheck} className="size-5" />
          <span>No credit card required to get started</span>
        </div>
        <div className="flex items-center gap-2">
          <GradientLucideIcon Icon={CircleCheck} className="size-5" />
          <span>Cancel anytime</span>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative mt-20 overflow-visible md:mt-32"
      >
        <div
          className="container flex w-screen justify-center"
          style={{
            perspective: '2000px',
            perspectiveOrigin: 'center center',
          }}
        >
          <motion.div
            ref={videoRef}
            className="bg-background relative aspect-video w-full cursor-pointer overflow-hidden rounded-4xl border-4"
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
              first app in under 60 seconds using our AI-powered cloud platform.
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
