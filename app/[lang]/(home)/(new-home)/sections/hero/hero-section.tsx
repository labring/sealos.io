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
import { GradientText } from '@/new-components/GradientText';
import { SideRays } from '@/new-components/SideRays';

import {
  DockerImageDemo,
  dockerImageDemoDurationMs,
} from '../../components/deploy-demos/docker-image-demo';
import {
  GitHubImportDemo,
  githubImportDemoDurationMs,
} from '../../components/deploy-demos/github-import-demo';
import {
  HeroAdoptionStrip,
  HeroGuarantees,
  HeroRating,
} from './hero-supporting-proof';
import { HeroTitle } from './hero-title';
import {
  DatabaseDemo,
  databaseDemoDurationMs,
  TemplateDemo,
  templateDemoDurationMs,
} from '../../components/deploy-demos/project-type-demos';

type DemoComponent = ComponentType<{ active?: boolean }>;
type DemoItem = {
  id: string;
  label: string;
  description: string;
  Icon: LucideIcon;
  Demo: DemoComponent;
  durationMs: number;
};

const panelTransition: Transition = {
  duration: 0.18,
  ease: 'easeOut',
};

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
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [progress, setProgress] = useState(0);
  const activeDemo = demos[activeIndex] ?? demos[0];
  const Demo = activeDemo.Demo;

  useEffect(() => {
    setProgress(0);

    const startedAt = window.performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      setProgress(
        ((now - startedAt) % activeDemo.durationMs) / activeDemo.durationMs,
      );
      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frameId);
  }, [activeDemo.durationMs, activeIndex]);

  useEffect(() => {
    let frame = 0;

    const updateActiveDemo = () => {
      if (frame) return;

      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const scroller = scrollerRef.current;

        if (!scroller) return;

        const sectionTop =
          window.scrollY + scroller.getBoundingClientRect().top;
        const scrolledDistance = Math.max(0, window.scrollY - sectionTop);
        const viewportHeight = window.innerHeight;
        const nextIndex = Math.min(
          demos.length - 1,
          Math.floor(scrolledDistance / viewportHeight),
        );

        if (activeIndexRef.current === nextIndex) return;

        setDirection(nextIndex > activeIndexRef.current ? 1 : -1);
        activeIndexRef.current = nextIndex;
        setActiveIndex(nextIndex);
      });
    };

    updateActiveDemo();
    window.addEventListener('scroll', updateActiveDemo, { passive: true });
    window.addEventListener('resize', updateActiveDemo);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      window.removeEventListener('scroll', updateActiveDemo);
      window.removeEventListener('resize', updateActiveDemo);
    };
  }, []);

  const selectDemo = (nextIndex: number) => {
    if (nextIndex === activeIndex) return;

    const scroller = scrollerRef.current;

    setDirection(nextIndex > activeIndexRef.current ? 1 : -1);
    activeIndexRef.current = nextIndex;
    setActiveIndex(nextIndex);

    if (!scroller) return;

    const sectionTop = window.scrollY + scroller.getBoundingClientRect().top;
    window.scrollTo({
      top: sectionTop + window.innerHeight * (nextIndex + 0.05),
      behavior: 'auto',
    });
  };

  return (
    <>
      <div
        ref={scrollerRef}
        className="relative mt-12 w-full sm:h-[400vh]"
        data-hero-demo-scroller
      >
        <div
          className="z-10 sm:sticky"
          data-hero-demo-sticky
          style={{ top: 'max(4.5rem, calc(50vh - 28rem))' }}
        >
          <HeroMobileDemoCards />

          <div
            className="hidden flex-wrap justify-center gap-2.5 sm:flex"
            data-hero-demo-tabs
          >
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
              className="pointer-events-none absolute top-full left-1/2 -z-10 aspect-[2/1] w-[150%] -translate-x-1/2 -translate-y-[65%] md:w-[125%]"
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
        </div>
      </div>
      <HeroProofStack />
    </>
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
  const progressPercent = Math.max(0, Math.min(100, progress * 100));
  const progressFadeEnd =
    progressPercent === 0 ? '0%' : `calc(${progressPercent}% + 32px)`;

  return (
    <button
      type="button"
      className="relative inline-flex h-9 items-center justify-center overflow-hidden rounded-lg border border-white/10 px-5 text-sm font-medium text-white shadow-sm transition-colors hover:border-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 sm:text-base"
      aria-pressed={active}
      onClick={onClick}
    >
      <span
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to right, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.15) ${progressPercent}%, rgba(255,255,255,0) ${progressFadeEnd})`,
        }}
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

function HeroProofStack() {
  return (
    <div className="z-10 mt-10 flex flex-col gap-12 overflow-x-clip sm:mt-24">
      <div>
        <HeroGuarantees />
      </div>
      <div>
        <HeroAdoptionStrip />
      </div>
      <div>
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
