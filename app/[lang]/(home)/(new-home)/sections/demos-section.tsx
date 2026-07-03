'use client';

import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type MutableRefObject,
  type ReactNode,
} from 'react';
import { AnimatePresence, motion, type Transition } from 'motion/react';

import { cn } from '@/lib/utils';
import { GradientText } from '@/new-components/GradientText';

import {
  demoActiveEventName,
  demoHandoffEventName,
  demoJumpEventName,
  demoNavigationItems,
} from '../components/demo-navigation';
import { DockerImageDemo } from '../components/docker-image-demo';
import { GitHubImportDemo } from '../components/github-import-demo';
import { DatabaseDemo, TemplateDemo } from '../components/project-type-demos';

type DemoComponent = ComponentType<{ active?: boolean }>;

type CardOffset = {
  height: number;
  left: number;
  targetHeight: number;
  targetWidth: number;
  top: number;
  width: number;
  x: number;
  y: number;
};

type HandoffState = 'idle' | 'flying' | 'landed' | 'returning';

const panelTransition: Transition = {
  duration: 0.18,
  ease: 'easeOut',
};

const minDemoScale = 0.56;
const demoScaleStartHeight = 800;
const demoScaleEndHeight = 560;

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

const emptyCardOffsets: CardOffset[] = demos.map(() => ({
  height: 0,
  left: 0,
  targetHeight: 0,
  targetWidth: 0,
  top: 0,
  width: 0,
  x: 0,
  y: 0,
}));

export function DemosSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const targetCardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const activeIndexRef = useRef(0);
  const handoffStateRef = useRef<HandoffState>('idle');
  const handoffTimeoutRef = useRef<number>();
  const jumpTimeoutRef = useRef<number>();
  const isJumpingRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardFlights, setCardFlights] =
    useState<CardOffset[]>(emptyCardOffsets);
  const [isSectionActive, setIsSectionActive] = useState(false);
  const [isHandoffComplete, setIsHandoffComplete] = useState(false);
  const [isHandoffFlying, setIsHandoffFlying] = useState(false);
  const [isHandoffLayoutActive, setIsHandoffLayoutActive] = useState(false);
  const [direction, setDirection] = useState(1);
  const [demoScale, setDemoScale] = useState(1);
  const activeDemo = demos[activeIndex] ?? demos[0];

  const clearHandoffTimeout = () => {
    if (handoffTimeoutRef.current) {
      window.clearTimeout(handoffTimeoutRef.current);
    }
  };

  const scheduleHandoffFinish = () => {
    clearHandoffTimeout();
    handoffTimeoutRef.current = window.setTimeout(finishCardHandoff, 760);
  };

  const clearJumpTimeout = () => {
    if (jumpTimeoutRef.current) {
      window.clearTimeout(jumpTimeoutRef.current);
    }
  };

  const resetCardHandoff = () => {
    if (handoffStateRef.current === 'idle') return;

    window.dispatchEvent(
      new CustomEvent(demoHandoffEventName, { detail: false }),
    );

    clearHandoffTimeout();
    handoffStateRef.current = 'idle';
    setCardFlights(emptyCardOffsets);
    setIsSectionActive(false);
    setIsHandoffComplete(false);
    setIsHandoffFlying(false);
    setIsHandoffLayoutActive(false);
  };

  const getCardOffsets = (useStaticFallback = false) =>
    demos.map((_, index) => {
      const sourceCard =
        document.querySelector(`[data-demo-source-card="${index}"]`) ??
        (useStaticFallback
          ? document.querySelector(`[data-demo-static-card="${index}"]`)
          : null);
      const targetCard = targetCardRefs.current[index];

      if (!targetCard) {
        return {
          height: 0,
          left: 0,
          targetHeight: 0,
          targetWidth: 0,
          top: 0,
          width: 0,
          x: 0,
          y: 0,
        };
      }

      const targetRect = targetCard.getBoundingClientRect();
      const sourceRect = sourceCard?.getBoundingClientRect() ?? targetRect;

      return {
        height: sourceRect.height,
        left: sourceRect.left,
        targetHeight: targetRect.height,
        targetWidth: targetRect.width,
        top: sourceRect.top,
        width: sourceRect.width,
        x: targetRect.left - sourceRect.left,
        y: targetRect.top - sourceRect.top,
      };
    });

  const getTargetCardOffsets = () =>
    demos.map((_, index) => {
      const targetCard = targetCardRefs.current[index];

      if (!targetCard) {
        return {
          height: 0,
          left: 0,
          targetHeight: 0,
          targetWidth: 0,
          top: 0,
          width: 0,
          x: 0,
          y: 0,
        };
      }

      const targetRect = targetCard.getBoundingClientRect();

      return {
        height: targetRect.height,
        left: targetRect.left,
        targetHeight: targetRect.height,
        targetWidth: targetRect.width,
        top: targetRect.top,
        width: targetRect.width,
        x: 0,
        y: 0,
      };
    });

  const updateCardReturnTarget = () => {
    if (handoffStateRef.current === 'flying') {
      setCardFlights(getCardOffsets());
    } else if (handoffStateRef.current === 'landed') {
      setCardFlights(getTargetCardOffsets());
    } else if (handoffStateRef.current === 'returning') {
      setCardFlights(getCardOffsets(true));
    }
  };

  const finishCardHandoff = () => {
    if (handoffStateRef.current !== 'flying') {
      return;
    }

    clearHandoffTimeout();
    setCardFlights(getCardOffsets());
    setIsHandoffFlying(true);
    window.requestAnimationFrame(() => {
      handoffStateRef.current = 'landed';
      setCardFlights(getTargetCardOffsets());
      setIsHandoffComplete(true);
      setIsHandoffFlying(false);
    });
  };

  const setActiveDemo = (index: number) => {
    const nextIndex = Math.max(0, Math.min(demos.length - 1, index));

    if (activeIndexRef.current !== nextIndex) {
      setDirection(nextIndex > activeIndexRef.current ? 1 : -1);
      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
    }

    window.dispatchEvent(
      new CustomEvent(demoActiveEventName, { detail: nextIndex }),
    );
  };

  const startCardHandoff = () => {
    if (handoffStateRef.current === 'flying') {
      return;
    }

    if (handoffStateRef.current === 'landed') {
      window.dispatchEvent(
        new CustomEvent(demoHandoffEventName, { detail: true }),
      );
      return;
    }

    if (handoffStateRef.current === 'returning') {
      return;
    }

    const offsets = getCardOffsets();

    clearHandoffTimeout();
    handoffStateRef.current = 'flying';
    setCardFlights(offsets);
    setIsSectionActive(true);
    setIsHandoffFlying(false);
    window.requestAnimationFrame(() => {
      window.dispatchEvent(
        new CustomEvent(demoHandoffEventName, { detail: true }),
      );
      window.requestAnimationFrame(() => {
        setIsHandoffLayoutActive(true);
        setIsHandoffFlying(true);
        scheduleHandoffFinish();
      });
    });
  };

  const startCardReturn = () => {
    if (
      handoffStateRef.current !== 'flying' &&
      handoffStateRef.current !== 'landed'
    ) {
      return;
    }

    clearHandoffTimeout();
    handoffStateRef.current = 'returning';
    setCardFlights(getCardOffsets(true));
    setIsSectionActive(true);
    setIsHandoffComplete(true);
    setIsHandoffLayoutActive(false);
    setIsHandoffFlying(true);
    window.dispatchEvent(
      new CustomEvent(demoHandoffEventName, { detail: true }),
    );
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        setIsHandoffComplete(false);
        setIsHandoffFlying(false);
      });
    });
    handoffTimeoutRef.current = window.setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent(demoHandoffEventName, { detail: false }),
      );
      window.requestAnimationFrame(() => {
        handoffStateRef.current = 'idle';
        setCardFlights(emptyCardOffsets);
        setIsSectionActive(false);
      });
    }, 760);
  };

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const updateActiveIndex = () => {
      const progress = window.scrollY - section.offsetTop;
      const sectionRect = section.getBoundingClientRect();
      const sourceGrid = document.querySelector('[data-demo-source-grid]');
      const sourceGridRect = sourceGrid?.getBoundingClientRect();
      const sourceGridIsInsideSection = sourceGridRect
        ? sectionRect.top <= sourceGridRect.top &&
          sectionRect.bottom >= sourceGridRect.bottom
        : progress >= 0;
      const nextSectionActive =
        sectionRect.top < window.innerHeight && sectionRect.bottom > 0;
      const nextIndex = Math.max(
        0,
        Math.min(demos.length - 1, Math.floor(progress / window.innerHeight)),
      );

      if (!isHandoffLayout()) {
        resetCardHandoff();

        if (!isJumpingRef.current && activeIndexRef.current !== nextIndex) {
          setActiveDemo(nextIndex);
        }

        return;
      }

      updateCardReturnTarget();
      setIsSectionActive(
        nextSectionActive ||
          handoffStateRef.current === 'flying' ||
          handoffStateRef.current === 'returning',
      );

      if (sourceGridIsInsideSection) {
        startCardHandoff();
      } else if (
        sectionRect.top > (sourceGridRect?.top ?? 112) &&
        handoffStateRef.current !== 'idle'
      ) {
        startCardReturn();
      }

      if (isJumpingRef.current || activeIndexRef.current === nextIndex) {
        return;
      }

      setActiveDemo(nextIndex);
    };

    const handleDemoJump = (event: Event) => {
      const nextIndex = (event as CustomEvent<number>).detail;

      if (typeof nextIndex !== 'number' || isJumpingRef.current) {
        return;
      }

      isJumpingRef.current = true;
      clearJumpTimeout();
      setActiveDemo(nextIndex);
      jumpTimeoutRef.current = window.setTimeout(() => {
        isJumpingRef.current = false;
      }, 250);
    };

    updateActiveIndex();
    window.addEventListener('scroll', updateActiveIndex, { passive: true });
    window.addEventListener('resize', updateActiveIndex);
    window.addEventListener(demoJumpEventName, handleDemoJump);

    return () => {
      clearHandoffTimeout();
      clearJumpTimeout();
      window.removeEventListener('scroll', updateActiveIndex);
      window.removeEventListener('resize', updateActiveIndex);
      window.removeEventListener(demoJumpEventName, handleDemoJump);
    };
  }, []);

  useEffect(() => {
    const updateDemoScale = () => {
      setDemoScale(getDemoScale(window.innerHeight));
    };

    updateDemoScale();
    window.addEventListener('resize', updateDemoScale);

    return () => {
      window.removeEventListener('resize', updateDemoScale);
    };
  }, []);

  const handleCardSelect = (index: number) => {
    const section = sectionRef.current;

    if (!section || isJumpingRef.current) {
      return;
    }

    isJumpingRef.current = true;
    clearJumpTimeout();
    setActiveDemo(index);
    window.scrollTo({
      top: section.offsetTop + window.innerHeight * index,
      behavior: 'auto',
    });
    jumpTimeoutRef.current = window.setTimeout(() => {
      isJumpingRef.current = false;
    }, 250);
  };

  return (
    <section
      ref={sectionRef}
      id="demos-section"
      className="relative isolate h-[500vh] text-white"
    >
      <div
        className="absolute inset-0 -z-10 [background-image:radial-gradient(circle,rgba(255,255,255,0.22)_1px,transparent_1px)] [background-size:32px_32px] bg-fixed"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.22),transparent_64%)] bg-fixed"
        aria-hidden="true"
      />

      <div className="sticky top-14 flex h-[calc(100svh-3.5rem)] items-center py-8 lg:py-12">
        <div className="pointer-events-none absolute inset-0 hidden items-center py-8 opacity-0 lg:flex lg:py-12">
          <div className="container mx-auto grid w-full items-center gap-9 lg:grid-cols-[286px_minmax(0,1fr)]">
            <DemoCardSlots cardRefs={targetCardRefs} />
            <div aria-hidden="true" />
          </div>
        </div>
        <div className="container mx-auto grid w-full items-center gap-9 lg:grid-cols-[286px_minmax(0,1fr)]">
          <div className="hidden lg:block" aria-hidden="true" />
          <div
            className={cn(
              'relative h-[min(720px,calc(100svh-9.5rem))] min-h-[360px] min-w-0 transition-transform duration-700 ease-out',
              !isHandoffLayoutActive && 'lg:-translate-x-[161px]',
            )}
          >
            <AnimatePresence custom={direction} initial={false}>
              <motion.div
                key={activeDemo.id}
                custom={direction}
                className="absolute inset-0"
                initial={getPanelMotion(direction, 'enter')}
                animate={getPanelMotion(direction, 'center')}
                exit={getPanelMotion(direction, 'exit')}
                transition={panelTransition}
              >
                <DemoArticle demo={activeDemo} demoScale={demoScale} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      <CardFlightOverlay
        activeIndex={activeIndex}
        flights={cardFlights}
        isComplete={isHandoffComplete}
        isFlying={isHandoffFlying}
        isVisible={isSectionActive}
        onSelect={handleCardSelect}
      />
    </section>
  );
}

function isHandoffLayout() {
  return window.matchMedia('(min-width: 1024px)').matches;
}

function DemoCardSlots({
  cardRefs,
}: {
  cardRefs: MutableRefObject<Array<HTMLDivElement | null>>;
}) {
  return (
    <div className="pointer-events-none flex flex-col gap-2.5 opacity-0">
      {demos.map(({ id }, index) => (
        <div
          key={id}
          ref={(node) => {
            cardRefs.current[index] = node;
          }}
          className="min-h-[110px] rounded-2xl p-5"
        />
      ))}
    </div>
  );
}

function CardFlightOverlay({
  activeIndex,
  flights,
  isComplete,
  isFlying,
  isVisible,
  onSelect,
}: {
  activeIndex: number;
  flights: CardOffset[];
  isComplete: boolean;
  isFlying: boolean;
  isVisible: boolean;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 hidden lg:block">
      {demos.map(({ title, description, Icon }, index) => {
        const flight = flights[index];

        const isActive = isComplete && activeIndex === index;
        const isCardVisible =
          isVisible && flight.width > 0 && flight.height > 0;

        return (
          <button
            key={title}
            className={cn(
              'group fixed rounded-xl border p-5 text-left duration-700 ease-out',
              !isCardVisible
                ? 'transition-none'
                : isComplete
                  ? 'transition-[border-color,background-color,box-shadow]'
                  : 'transition-[transform,border-color,background-color,box-shadow]',
              isComplete
                ? isActive
                  ? 'border-white/20 bg-white/[0.08] shadow-2xl'
                  : 'border-transparent bg-transparent shadow-none hover:border-white/20 hover:bg-white/[0.06]'
                : 'border-transparent bg-transparent shadow-none',
              isCardVisible && isComplete && 'pointer-events-auto',
            )}
            onClick={() => {
              if (isComplete) {
                onSelect(index);
              }
            }}
            style={{
              height: isFlying ? flight.targetHeight : flight.height,
              left: flight.left,
              top: flight.top,
              transform: isFlying
                ? `translate3d(${flight.x}px, ${flight.y}px, 0)`
                : 'translate3d(0, 0, 0)',
              visibility: isCardVisible ? 'visible' : 'hidden',
              width: isFlying ? flight.targetWidth : flight.width,
            }}
            tabIndex={isCardVisible && isComplete ? 0 : -1}
            type="button"
          >
            <DemoCardContent
              Icon={Icon}
              active={isActive}
              description={description}
              isComplete={isComplete}
              title={title}
            />
          </button>
        );
      })}
    </div>
  );
}

function DemoCardContent({
  active,
  description,
  Icon,
  isComplete,
  title,
}: {
  active: boolean;
  description: string;
  Icon: (typeof demos)[number]['Icon'];
  isComplete: boolean;
  title: string;
}) {
  return (
    <>
      <div className="mb-1.5 flex items-center gap-2 text-base font-medium text-white">
        <Icon
          className={cn(
            'size-4 transition-colors',
            isComplete
              ? 'text-zinc-400'
              : 'text-zinc-300 group-hover:text-white',
            active && 'text-white',
          )}
          aria-hidden="true"
        />
        {title}
      </div>
      <p className="text-sm leading-5 text-zinc-400">{description}</p>
    </>
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

function getDemoScale(viewportHeight: number) {
  const progress =
    (demoScaleStartHeight - viewportHeight) /
    (demoScaleStartHeight - demoScaleEndHeight);

  return Math.min(1, Math.max(minDemoScale, 1 - progress * (1 - minDemoScale)));
}

function DemoArticle({
  demo,
  demoScale,
}: {
  demo: (typeof demos)[number];
  demoScale: number;
}) {
  const { id, headline, body, Demo } = demo;

  return (
    <article
      id={id}
      className="flex h-full w-full min-w-0 flex-col items-center gap-8"
    >
      <div className="w-full text-left">
        <GradientText
          as="h2"
          className="to-blue-500 text-3xl leading-9 font-semibold text-balance"
        >
          {headline}
        </GradientText>
        <p className="mt-3 text-base leading-6 font-normal text-zinc-400">
          {body}
        </p>
      </div>

      <div
        aria-label={`${headline} demo`}
        className="relative z-10 mx-auto w-full"
        style={{ width: `${demoScale * 100}%` }}
      >
        <ScaledDemoCanvas>
          <Demo active />
        </ScaledDemoCanvas>
      </div>
    </article>
  );
}

function ScaledDemoCanvas({ children }: { children: ReactNode }) {
  return (
    <div className="relative aspect-[1312/812] w-full overflow-visible">
      <div className="absolute top-0 left-0 h-[117.6471%] w-[117.6471%] origin-top-left scale-[0.85] [&>*]:!mx-0 [&>*]:!h-full [&>*]:!w-full [&>*]:!max-w-none">
        {children}
      </div>
    </div>
  );
}
