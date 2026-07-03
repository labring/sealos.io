'use client';

import { useEffect, useRef, useState, type ComponentType } from 'react';
import { motion, type Transition } from 'motion/react';

import { cn } from '@/lib/utils';
import { GradientText } from '@/new-components/GradientText';

import {
  demoActiveEventName,
  demoJumpEventName,
  demoNavigationItems,
  getDemoIndex,
} from '../components/demo-navigation';
import { DockerImageDemo } from '../components/docker-image-demo';
import { GitHubImportDemo } from '../components/github-import-demo';
import { DatabaseDemo, TemplateDemo } from '../components/project-type-demos';

type DemoComponent = ComponentType<{ active?: boolean }>;

const textMaskClass =
  '[mask-image:linear-gradient(to_bottom,#000_0%,rgba(0,0,0,0.55)_34%,rgba(0,0,0,0.12)_62%,transparent_86%)] [-webkit-mask-image:linear-gradient(to_bottom,#000_0%,rgba(0,0,0,0.55)_34%,rgba(0,0,0,0.12)_62%,transparent_86%)]';

const demoHoverTransition: Transition = {
  duration: 0.52,
  ease: [0.22, 1, 0.36, 1],
};

const demoTransitionMs = 520;
const demoScale = 1.04;

type DemoOffset = {
  x: number;
  y: number;
};

const demos = [
  {
    ...demoNavigationItems[0],
    headline: "From 'git push' to a public URL — without 'git push'.",
    body: 'Connect GitHub, pick a repository, and let the agent prepare the deployment path while the workspace stays visible.',
    Demo: GitHubImportDemo,
  },
  {
    ...demoNavigationItems[1],
    headline: 'Stop starting from scratch. Deploy entire stacks instantly.',
    body: 'Browse a rich library of pre-configured application templates. One click gets you a fully wired, production-ready environment without the configuration hassle.',
    Demo: TemplateDemo,
  },
  {
    ...demoNavigationItems[2],
    headline: "Bring your own image. We'll handle the infrastructure.",
    body: 'Just paste your Docker image tag. The agent instantly spins up your container, configures the network, and exposes it to the world with zero friction.',
    Demo: DockerImageDemo,
  },
  {
    ...demoNavigationItems[3],
    headline:
      'Other platforms hand you a connection string. Sealos hands you a database.',
    body: 'Schema tree, rows browser, backup policies — all built in. No second tool, no second login.',
    Demo: DatabaseDemo,
  },
] satisfies Array<
  (typeof demoNavigationItems)[number] & {
    headline: string;
    body: string;
    Demo: DemoComponent;
  }
>;

type JumpState = {
  entered: boolean;
  fromIndex: number | null;
  toIndex: number;
};

export function DemosSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [backgroundPinned, setBackgroundPinned] = useState(false);
  const [jumpState, setJumpState] = useState<JumpState | null>(null);
  const [settlingJump, setSettlingJump] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const updateActiveIndex = () => {
      const progress = window.scrollY - section.offsetTop;
      const nextIndex = getDemoIndex(progress, window.innerHeight);
      const isInsideSection =
        progress >= 0 && progress <= section.offsetHeight - window.innerHeight;

      setBackgroundPinned(isInsideSection);
      window.dispatchEvent(
        new CustomEvent(demoActiveEventName, { detail: nextIndex }),
      );
      setActiveIndex((currentIndex) => {
        if (currentIndex === nextIndex) {
          return currentIndex;
        }

        activeIndexRef.current = nextIndex;
        return nextIndex;
      });
    };

    updateActiveIndex();

    const handleDemoJump = (event: Event) => {
      const nextIndex = (event as CustomEvent<number>).detail;

      if (typeof nextIndex !== 'number') {
        return;
      }

      const sectionTop = window.scrollY + section.getBoundingClientRect().top;
      const isInsideSection =
        window.scrollY >= sectionTop &&
        window.scrollY <=
          sectionTop + section.offsetHeight - window.innerHeight;
      const fromIndex = isInsideSection ? activeIndexRef.current : null;

      setJumpState({
        entered: false,
        fromIndex,
        toIndex: nextIndex,
      });
      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
      window.dispatchEvent(
        new CustomEvent(demoActiveEventName, { detail: nextIndex }),
      );
      window.requestAnimationFrame(() => {
        setJumpState((current) =>
          current?.toIndex === nextIndex
            ? { ...current, entered: true }
            : current,
        );
      });
      window.setTimeout(() => {
        setJumpState((current) =>
          current?.toIndex === nextIndex ? null : current,
        );
        setSettlingJump(true);
        window.requestAnimationFrame(() => setSettlingJump(false));
      }, 520);
    };

    window.addEventListener('scroll', updateActiveIndex, { passive: true });
    window.addEventListener('resize', updateActiveIndex);
    window.addEventListener(demoJumpEventName, handleDemoJump);

    return () => {
      window.removeEventListener('scroll', updateActiveIndex);
      window.removeEventListener('resize', updateActiveIndex);
      window.removeEventListener(demoJumpEventName, handleDemoJump);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="demos-section"
      className="relative isolate h-[500vh] text-white"
    >
      <div
        className={cn(
          'inset-0 -z-10 [background-image:radial-gradient(circle,rgba(255,255,255,0.22)_1px,transparent_1px)] [background-size:32px_32px]',
          backgroundPinned ? 'fixed' : 'absolute',
        )}
        aria-hidden="true"
      />
      <div
        className={cn(
          'inset-x-0 top-0 -z-10 mx-auto h-[720px] max-w-[1440px] bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.22),transparent_64%)]',
          backgroundPinned ? 'fixed' : 'absolute',
        )}
        aria-hidden="true"
      />

      <div className="sticky top-0 h-screen overflow-hidden px-4 pt-0 pb-20 sm:px-6 lg:px-16">
        <div className="relative h-full">
          {demos.map((demo, index) => (
            <DemoArticle
              key={demo.id}
              demo={demo}
              isActive={activeIndex === index}
              isVisible={isSlideVisible(index, jumpState)}
              opacity={getSlideOpacity(index, jumpState)}
              transitionEnabled={
                !settlingJump && (!jumpState || jumpState.entered)
              }
              transform={getSlideTransform(index, activeIndex, jumpState)}
            />
          ))}
        </div>
        <div
          className="pointer-events-none absolute inset-x-0 bottom-8 z-20 flex justify-center gap-3"
          aria-hidden="true"
        >
          {demos.map((demo, dotIndex) => (
            <span
              key={demo.id}
              className={cn(
                'size-2 rounded-full border border-white/40 bg-white/10',
                activeIndex === dotIndex && 'bg-white/70',
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function isSlideVisible(index: number, jumpState: JumpState | null) {
  if (!jumpState) {
    return true;
  }

  return index === jumpState.fromIndex || index === jumpState.toIndex;
}

function getSlideTransform(
  index: number,
  activeIndex: number,
  jumpState: JumpState | null,
) {
  if (!jumpState) {
    return `translate3d(${(index - activeIndex) * 100}%, 0, 0)`;
  }

  const { entered, fromIndex, toIndex } = jumpState;

  if (fromIndex === null || fromIndex === toIndex) {
    if (index === toIndex) {
      return 'translate3d(0, 0, 0)';
    }

    return 'translate3d(0, 0, 0)';
  }

  const movingForward = toIndex > fromIndex;

  if (index === fromIndex) {
    return entered
      ? `translate3d(${movingForward ? -100 : 100}%, 0, 0)`
      : 'translate3d(0, 0, 0)';
  }

  if (index === toIndex) {
    return entered
      ? 'translate3d(0, 0, 0)'
      : `translate3d(${movingForward ? 100 : -100}%, 0, 0)`;
  }

  return 'translate3d(0, 0, 0)';
}

function getSlideOpacity(index: number, jumpState: JumpState | null) {
  if (!jumpState) {
    return 1;
  }

  if (jumpState.fromIndex === null && index === jumpState.toIndex) {
    return jumpState.entered ? 1 : 0;
  }

  return isSlideVisible(index, jumpState) ? 1 : 0;
}

function DemoArticle({
  demo,
  isActive,
  isVisible,
  opacity,
  transform,
  transitionEnabled,
}: {
  demo: (typeof demos)[number];
  isActive: boolean;
  isVisible: boolean;
  opacity: number;
  transform: string;
  transitionEnabled: boolean;
}) {
  const { id, headline, body, Demo } = demo;
  const demoRef = useRef<HTMLDivElement>(null);
  const [isDemoPlaying, setIsDemoPlaying] = useState(false);
  const [demoOffset, setDemoOffset] = useState<DemoOffset>({ x: 0, y: 0 });

  useEffect(() => {
    if (isActive || !isDemoPlaying) return;

    const timeout = window.setTimeout(() => {
      setIsDemoPlaying(false);
      setDemoOffset({ x: 0, y: 0 });
    }, demoTransitionMs);

    return () => window.clearTimeout(timeout);
  }, [isActive, isDemoPlaying]);

  const handlePlay = () => {
    const demoElement = demoRef.current;

    if (!demoElement) {
      setIsDemoPlaying(true);
      return;
    }

    const demoRect = demoElement.getBoundingClientRect();
    const targetCenter = getDemoTargetCenter();

    setDemoOffset({
      x: targetCenter.x - (demoRect.left + demoRect.width / 2),
      y: targetCenter.y - (demoRect.top + demoRect.height / 2),
    });
    setIsDemoPlaying(true);
  };

  return (
    <article
      id={id}
      className={cn(
        'absolute inset-0 flex h-full w-full items-start pt-56 lg:pt-60',
        transitionEnabled &&
          'transition-[transform,opacity] duration-500 ease-out',
        !isVisible && 'pointer-events-none',
      )}
      style={{ opacity, transform }}
      aria-hidden={!isActive}
    >
      <div className="mx-auto flex w-full flex-col items-center gap-10">
        <div className={cn('text-center', isDemoPlaying && textMaskClass)}>
          <GradientText
            as="h2"
            className="max-w-4xl to-blue-500 text-4xl leading-tight font-semibold text-balance sm:text-5xl"
          >
            {headline}
          </GradientText>
          <p className="mt-7 max-w-4xl text-base leading-7 text-zinc-400">
            {body}
          </p>
        </div>

        <motion.div
          aria-label={`${headline} demo`}
          ref={demoRef}
          className="relative z-10 mx-auto w-full max-w-[1312px] outline-none"
          initial={false}
          animate={{
            x: isDemoPlaying ? demoOffset.x : 0,
            y: isDemoPlaying ? demoOffset.y : 0,
            scale: isDemoPlaying ? demoScale : 1,
          }}
          transition={demoHoverTransition}
          style={{
            transformOrigin: 'center',
            zIndex: isDemoPlaying ? 30 : 1,
          }}
        >
          <Demo active={isDemoPlaying} />
          <motion.button
            aria-label={`Play ${headline} demo`}
            className={cn(
              'absolute inset-0 z-50 rounded-[18px] transition-shadow outline-none focus-visible:ring-2 focus-visible:ring-blue-400',
              isDemoPlaying ? 'pointer-events-none' : 'cursor-pointer',
            )}
            animate={{ opacity: isDemoPlaying ? 0 : 1 }}
            transition={demoHoverTransition}
            onClick={handlePlay}
            tabIndex={isActive && !isDemoPlaying ? 0 : -1}
            type="button"
          />
        </motion.div>
      </div>
    </article>
  );
}

function getDemoTargetCenter() {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const safeTop =
    viewportWidth >= 1280 ? 272 : viewportWidth >= 768 ? 344 : 408;

  return {
    x: viewportWidth / 2,
    y: safeTop + (viewportHeight - safeTop) / 2,
  };
}
