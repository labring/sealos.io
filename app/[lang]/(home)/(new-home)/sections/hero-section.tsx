'use client';

import {
  Container,
  Database,
  Github,
  PanelsTopLeft,
  RocketIcon,
  type LucideIcon,
} from 'lucide-react';
import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from 'react';
import { AnimatePresence, motion, type Transition } from 'motion/react';

import { StarBorder } from '@/components/ui/star-border';
import { useGTM } from '@/hooks/use-gtm';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';
import { getOpenBrainParam } from '@/lib/utils/brain';
import { cn } from '@/lib/utils';
import { GradientText } from '@/new-components/GradientText';
import { SideRays } from '@/new-components/SideRays';

import {
  DockerImageDemo,
  dockerImageDemoDurationMs,
} from '../components/docker-image-demo';
import {
  GitHubImportDemo,
  githubImportDemoDurationMs,
} from '../components/github-import-demo';
import { HeroTitle } from '../components/HeroTitle';
import {
  HeroAdoptionStrip,
  HeroGuarantees,
  HeroRating,
} from '../components/hero-supporting-proof';
import {
  DatabaseDemo,
  databaseDemoDurationMs,
  TemplateDemo,
  templateDemoDurationMs,
} from '../components/project-type-demos';

type DemoComponent = ComponentType<{ active?: boolean }>;
type DemoItem = {
  id: string;
  label: string;
  description: string;
  Icon: LucideIcon;
  Demo: DemoComponent;
  durationMs: number;
};
type HeroProofPhase = 'guarantees' | 'adoption' | 'rating' | 'done';

const panelTransition: Transition = {
  duration: 0.18,
  ease: 'easeOut',
};
const stickyTopOffset = 104;

const demos = [
  {
    id: 'github-import-section',
    label: 'GitHub',
    description: 'Import repository from URL or GitHub authorization.',
    Icon: Github,
    Demo: GitHubImportDemo,
    durationMs: githubImportDemoDurationMs,
  },
  {
    id: 'docker-image-section',
    label: 'Docker Image',
    description: 'Create and run a project directly using an existing image.',
    Icon: Container,
    Demo: DockerImageDemo,
    durationMs: dockerImageDemoDurationMs,
  },
  {
    id: 'database-section',
    label: 'Database',
    description: 'Set up a database project or data service first.',
    Icon: Database,
    Demo: DatabaseDemo,
    durationMs: databaseDemoDurationMs,
  },
  {
    id: 'template-section',
    label: 'Templates',
    description: 'Quickly import from commonly used application templates.',
    Icon: PanelsTopLeft,
    Demo: TemplateDemo,
    durationMs: templateDemoDurationMs,
  },
] satisfies DemoItem[];
const heroCardDemos = [
  demos[0],
  demos[3],
  demos[1],
  demos[2],
] satisfies DemoItem[];

export function HeroSection() {
  return (
    <section className="relative isolate overflow-x-clip pt-36 pb-20">
      <SideRays
        className="absolute top-[-96px] left-0 z-0 max-h-[1440px] w-full"
        speed={2.5}
        rayColor1="#5f6664"
        rayColor2="#e6f2ff"
        intensity={2}
        spread={2}
        origin="top-left"
        tilt={0}
        saturation={1.2}
        blend={0.42}
        falloff={2}
        opacity={1}
      />
      <div className="relative z-10 container">
        <div className="py-10">
          <div className="mx-auto max-w-4xl">
            <HeroTitle isInView />
            <div className="mt-10 flex justify-center">
              <HeroGetStartedButton />
            </div>
          </div>
          <HeroDemoSwitcher />
        </div>
      </div>
    </section>
  );
}

function HeroGetStartedButton() {
  const { trackButton } = useGTM();
  const handleAuthRedirect = useAuthRedirect();

  return (
    <div>
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

function HeroDemoSwitcher() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [proofPhase, setProofPhase] = useState<HeroProofPhase>('guarantees');
  const [progress, setProgress] = useState(0);
  const activeDemo = demos[activeIndex] ?? demos[0];
  const Demo = activeDemo.Demo;

  useEffect(() => {
    setProgress(0);

    const startedAt = window.performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      const nextProgress = Math.min(
        1,
        (now - startedAt) / activeDemo.durationMs,
      );

      setProgress(nextProgress);

      if (nextProgress >= 1) {
        setActiveIndex((currentIndex) => {
          const nextIndex = (currentIndex + 1) % demos.length;
          setDirection(nextIndex > currentIndex ? 1 : -1);
          return nextIndex;
        });
        return;
      }

      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frameId);
  }, [activeDemo.durationMs, activeIndex]);

  useEffect(() => {
    let frame = 0;

    const updateProofPhase = () => {
      if (frame) return;

      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const scroller = scrollerRef.current;

        if (!scroller) return;

        const viewportHeight = window.innerHeight;
        const start = Math.max(0, scroller.offsetTop - stickyTopOffset);
        const nextPhase = getHeroProofPhase(
          window.scrollY,
          start,
          viewportHeight,
        );

        setProofPhase((currentPhase) =>
          currentPhase === nextPhase ? currentPhase : nextPhase,
        );
      });
    };

    updateProofPhase();
    window.addEventListener('scroll', updateProofPhase, { passive: true });
    window.addEventListener('resize', updateProofPhase);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      window.removeEventListener('scroll', updateProofPhase);
      window.removeEventListener('resize', updateProofPhase);
    };
  }, []);

  const selectDemo = (nextIndex: number) => {
    if (nextIndex === activeIndex) return;

    setDirection(nextIndex > activeIndex ? 1 : -1);
    setActiveIndex(nextIndex);
  };

  return (
    <div
      ref={scrollerRef}
      className="relative mt-12 w-full"
      data-hero-demo-scroller
    >
      <div
        className="sticky z-10"
        data-hero-demo-sticky
        style={{ top: stickyTopOffset }}
      >
        <HeroMobileDemoCards />

        <div className="hidden flex-wrap justify-center gap-2.5 sm:flex">
          {demos.map((demo, index) => (
            <HeroDemoButton
              key={demo.id}
              active={index === activeIndex}
              demo={demo}
              progress={index === activeIndex ? progress : 0}
              onClick={() => selectDemo(index)}
            />
          ))}
        </div>

        <div className="relative isolate mt-6 hidden aspect-[1312/812] w-full overflow-visible [contain:layout] sm:block">
          <div
            className="pointer-events-none absolute top-full left-1/2 z-0 aspect-[2/1] w-[150%] -translate-x-1/2 -translate-y-1/2 md:w-[125%]"
            style={{
              background:
                'radial-gradient(50% 50% at 50% 50%, rgba(29, 78, 216, 0.5) 19.35%, rgba(10, 10, 10, 0) 100%)',
            }}
            data-hero-demo-glow
            aria-hidden="true"
          />
          <AnimatePresence custom={direction} initial={false}>
            <motion.div
              key={activeDemo.id}
              custom={direction}
              className="absolute inset-0 z-10"
              initial={getPanelMotion(direction, 'enter')}
              animate={getPanelMotion(direction, 'center')}
              exit={getPanelMotion(direction, 'exit')}
              transition={panelTransition}
            >
              <ScaledDemoCanvas>
                <Demo active />
              </ScaledDemoCanvas>
            </motion.div>
          </AnimatePresence>
        </div>
        <HeroProofStack phase={proofPhase} />
      </div>
      <div className="h-[225vh] min-h-[1152px]" aria-hidden="true" />
    </div>
  );
}

function HeroDemoButton({
  active,
  demo,
  progress,
  onClick,
}: {
  active: boolean;
  demo: DemoItem;
  progress: number;
  onClick: () => void;
}) {
  const Icon = demo.Icon;

  return (
    <button
      type="button"
      className="relative inline-flex h-9 items-center justify-center overflow-hidden rounded-lg border border-white/10 px-5 text-sm font-medium text-white shadow-sm transition-colors hover:border-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 sm:text-base"
      aria-pressed={active}
      onClick={onClick}
    >
      <span
        className="absolute inset-y-0 left-0 w-full origin-left bg-gradient-to-r from-white/15 to-white/0"
        style={{ transform: `scaleX(${progress})` }}
        aria-hidden="true"
      />
      <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
        <Icon
          className={active ? 'text-blue-400' : undefined}
          size={16}
          strokeWidth={2}
          aria-hidden="true"
        />
        {demo.label}
      </span>
    </button>
  );
}

function HeroMobileDemoCards() {
  return (
    <div className="flex flex-col gap-3 sm:hidden" data-hero-mobile-demo-cards>
      {heroCardDemos.map(({ label, description, Icon }) => (
        <div
          key={label}
          className="rounded-xl border border-transparent bg-transparent p-5 text-left transition hover:border-white/10 hover:bg-white/[0.04]"
        >
          <div className="mb-1.5 flex items-center gap-2 text-base font-medium text-white">
            <Icon className="text-zinc-300" size={16} aria-hidden="true" />
            {label}
          </div>
          <p className="text-sm leading-5 text-zinc-400">{description}</p>
        </div>
      ))}
    </div>
  );
}

function HeroProofStack({ phase }: { phase: HeroProofPhase }) {
  const proofTransition =
    'transition duration-500 ease-out motion-reduce:transition-none';

  return (
    <div
      className="relative mt-10 min-h-52 overflow-x-clip [contain:layout]"
      data-hero-proof-stack
    >
      <div
        className={cn(
          proofTransition,
          'absolute inset-0 flex items-center justify-center will-change-[filter,opacity,transform]',
          phase === 'guarantees'
            ? 'blur-0 translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-8 opacity-0 blur-[12px]',
        )}
        aria-hidden={phase !== 'guarantees'}
      >
        <HeroGuarantees />
      </div>
      <div
        className={cn(
          proofTransition,
          'absolute inset-0 flex items-center justify-center will-change-[filter,opacity,transform]',
          phase === 'adoption'
            ? 'blur-0 translate-y-0 opacity-100'
            : phase === 'rating' || phase === 'done'
              ? 'pointer-events-none -translate-y-8 opacity-0 blur-[12px]'
              : 'pointer-events-none translate-y-8 opacity-0 blur-[12px]',
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
  );
}

function getPanelMotion(direction: number, phase: 'enter' | 'center' | 'exit') {
  if (phase === 'center') {
    return { opacity: 1, filter: 'blur(0px)', y: 0 };
  }

  const offset = direction > 0 ? 36 : -36;

  return {
    opacity: 0,
    filter: 'blur(12px)',
    y: phase === 'enter' ? offset : -offset,
  };
}

function ScaledDemoCanvas({ children }: { children: ReactNode }) {
  return (
    <div className="relative h-full w-full max-w-full min-w-0 [contain:layout]">
      <div className="absolute inset-0 h-[200%] w-[200%] origin-top-left scale-50 overflow-visible md:h-[153.8461%] md:w-[153.8461%] md:scale-65 lg:h-[133.3333%] lg:w-[133.3333%] lg:scale-75 xl:h-full xl:w-full xl:scale-100 [&>*]:!mx-0 [&>*]:!h-full [&>*]:!w-full [&>*]:!max-w-none">
        {children}
      </div>
    </div>
  );
}

function getHeroProofPhase(
  scrollY: number,
  start: number,
  viewportHeight: number,
): HeroProofPhase {
  const stepDistance = getScrollStepDistance(viewportHeight);

  if (scrollY >= start + stepDistance * 3) {
    return 'done';
  }

  if (scrollY >= start + stepDistance * 2) {
    return 'rating';
  }

  if (scrollY >= start + stepDistance) {
    return 'adoption';
  }

  return 'guarantees';
}

function getScrollStepDistance(viewportHeight: number) {
  return Math.max(viewportHeight * 0.75, 384);
}
