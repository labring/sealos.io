'use client';

import { RocketIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { StarBorder } from '@/components/ui/star-border';
import { useGTM } from '@/hooks/use-gtm';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';
import { getOpenBrainParam } from '@/lib/utils/brain';
import { cn } from '@/lib/utils';
import { GradientText } from '@/new-components/GradientText';

import { HeroDemoCards } from '../components/hero-demo-cards';
import {
  HeroAdoptionStrip,
  HeroGuarantees,
  HeroRating,
} from '../components/hero-supporting-proof';

export function HeroSection() {
  return (
    <section className="px-4 text-white sm:px-6 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <HeroProofScroller />
      </div>
    </section>
  );
}

function HeroHeadline() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center gap-9 text-center">
      <div className="flex flex-col items-center gap-6">
        <GradientText
          as="h1"
          className="max-w-4xl to-blue-500 text-center text-4xl leading-tight font-semibold text-balance sm:text-5xl"
        >
          Deploy anything from a repo, an image, or a sentence.
        </GradientText>
        <p className="max-w-2xl text-base leading-6 text-zinc-500">
          You describe it. Our AI builds, wires, and deploys it. No YAML. No
          CI/CD. Preview your deployment instantly, without a credit card or
          signup wall.
        </p>
      </div>

      <HeroGetStartedButton />
    </div>
  );
}

function HeroGetStartedButton() {
  const { trackButton } = useGTM();
  const handleAuthRedirect = useAuthRedirect();

  return (
    <div className="relative isolate">
      <div
        className="absolute -top-12 -left-32 -z-10 h-36 w-96 rounded-full bg-blue-700/35 blur-3xl"
        aria-hidden="true"
      />
      <StarBorder
        color="var(--color-blue-500)"
        contentClassName="h-10 gap-2 border border-blue-500/80 bg-gradient-to-b from-white via-zinc-100 to-zinc-300 px-4 text-sm font-medium text-zinc-900 shadow-lg"
        onClick={() => {
          trackButton('Get Started', 'hero', 'auth-form', '');
          handleAuthRedirect({ openapp: getOpenBrainParam() });
        }}
        speed="5s"
        thickness={2}
        type="button"
      >
        <RocketIcon size={16} aria-hidden="true" />
        <GradientText className="from-blue-600 to-zinc-950 text-sm">
          Get Started
        </GradientText>
      </StarBorder>
    </div>
  );
}

type HeroProofPhase = 'adoption' | 'rating' | 'done';

function HeroProofScroller() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const topOffset = 312;
  const [phase, setPhase] = useState<HeroProofPhase>('adoption');
  const [glowProgress, setGlowProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const updatePhase = () => {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const scroller = scrollerRef.current;

        if (!scroller) {
          return;
        }

        const start = Math.max(0, scroller.offsetTop - topOffset);
        const nextPhase = getHeroProofPhase(
          window.scrollY,
          start,
          window.innerHeight,
        );
        const nextGlowProgress = getHeroGlowProgress(
          window.scrollY,
          start,
          window.innerHeight,
        );

        setPhase((currentPhase) =>
          currentPhase === nextPhase ? currentPhase : nextPhase,
        );
        setGlowProgress((currentProgress) =>
          currentProgress === nextGlowProgress
            ? currentProgress
            : nextGlowProgress,
        );
      });
    };

    updatePhase();
    window.addEventListener('scroll', updatePhase, { passive: true });
    window.addEventListener('resize', updatePhase);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      window.removeEventListener('scroll', updatePhase);
      window.removeEventListener('resize', updatePhase);
    };
  }, []);

  const proofTransition =
    'transition duration-500 ease-out motion-reduce:transition-none';

  return (
    <div
      ref={scrollerRef}
      id="hero-proof-scroller"
      className="relative pb-20 lg:pb-24"
    >
      <div
        className="pointer-events-none absolute inset-x-0 -top-24 bottom-0 z-0"
        aria-hidden="true"
      >
        <div
          className="sticky top-0 h-screen"
          style={{ opacity: 0.3 + 0.7 * (1 - glowProgress) }}
        >
          <div className="absolute bottom-0 left-1/2 h-[25vh] w-screen -translate-x-1/2 overflow-hidden">
            <div
              className="absolute top-0 left-1/2 h-screen w-screen -translate-x-1/2"
              style={{
                background:
                  'radial-gradient(50% 50% at 50% 50%, #1D4ED8 19.35%, rgba(10, 10, 10, 0) 100%)',
              }}
            />
          </div>
        </div>
      </div>

      <div
        className="sticky z-10 flex flex-col gap-20"
        style={{ top: topOffset }}
      >
        <HeroHeadline />

        <div className="space-y-8">
          <HeroDemoCards
            pinDelayVh={1}
            pinStartElementId="hero-proof-scroller"
          />
          <div
            className={cn(
              proofTransition,
              'will-change-[filter,opacity,transform]',
              phase === 'done'
                ? 'pointer-events-none -translate-y-8 opacity-0 blur-[12px]'
                : 'blur-0 translate-y-0 opacity-100',
            )}
            aria-hidden={phase === 'done'}
          >
            <HeroGuarantees />
          </div>
        </div>

        <div className="relative min-h-52">
          <div
            className={cn(
              proofTransition,
              'absolute inset-0 flex items-center justify-center will-change-[filter,opacity,transform]',
              phase === 'adoption'
                ? 'blur-0 translate-y-0 opacity-100'
                : 'pointer-events-none -translate-y-8 opacity-0 blur-[12px]',
            )}
            aria-hidden={phase !== 'adoption'}
          >
            <HeroAdoptionStrip />
          </div>
          <div
            className={cn(
              proofTransition,
              'absolute inset-0 flex items-center justify-center will-change-[filter,opacity,transform]',
              phase === 'rating'
                ? 'blur-0 translate-y-0 opacity-100'
                : phase === 'done'
                  ? 'pointer-events-none -translate-y-8 opacity-0 blur-[12px]'
                  : 'pointer-events-none translate-y-8 opacity-0 blur-[12px]',
            )}
            aria-hidden={phase !== 'rating'}
          >
            <HeroRating />
          </div>
        </div>
      </div>
      <div className="h-screen" aria-hidden="true" />
    </div>
  );
}

function getHeroProofPhase(
  scrollY: number,
  start: number,
  viewportHeight: number,
): HeroProofPhase {
  if (scrollY >= start + viewportHeight) {
    return 'done';
  }

  if (scrollY >= start + viewportHeight * 0.5) {
    return 'rating';
  }

  return 'adoption';
}

function getHeroGlowProgress(
  scrollY: number,
  start: number,
  viewportHeight: number,
): number {
  const offset = Math.max(0, scrollY - (start + viewportHeight));

  return clamp(offset / (viewportHeight * 0.5), 0, 1);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
