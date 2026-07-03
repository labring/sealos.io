'use client';

import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type MutableRefObject,
} from 'react';

import { cn } from '@/lib/utils';
import { GradientText } from '@/new-components/GradientText';

import {
  demoActiveEventName,
  demoHandoffEventName,
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

export function DemosSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const targetCardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const activeIndexRef = useRef(0);
  const handoffStateRef = useRef<HandoffState>('idle');
  const handoffTimeoutRef = useRef<number>();
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardFlights, setCardFlights] = useState<CardOffset[] | null>(null);
  const [isSectionActive, setIsSectionActive] = useState(false);
  const [isHandoffComplete, setIsHandoffComplete] = useState(false);
  const [isHandoffFlying, setIsHandoffFlying] = useState(false);
  const activeDemo = demos[activeIndex] ?? demos[0];

  const clearHandoffTimeout = () => {
    if (handoffTimeoutRef.current) {
      window.clearTimeout(handoffTimeoutRef.current);
    }
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

  const updateCardReturnTarget = () => {
    if (handoffStateRef.current === 'returning') {
      setCardFlights(getCardOffsets(true));
    }
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
      window.requestAnimationFrame(() => setIsHandoffFlying(true));
    });
    handoffTimeoutRef.current = window.setTimeout(() => {
      handoffStateRef.current = 'landed';
      setIsHandoffComplete(true);
    }, 760);
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
    setIsHandoffComplete(false);
    setIsHandoffFlying(false);
    window.dispatchEvent(
      new CustomEvent(demoHandoffEventName, { detail: true }),
    );
    handoffTimeoutRef.current = window.setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent(demoHandoffEventName, { detail: false }),
      );
      window.requestAnimationFrame(() => {
        handoffStateRef.current = 'idle';
        setCardFlights(null);
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

      if (activeIndexRef.current === nextIndex) {
        return;
      }

      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
      window.dispatchEvent(
        new CustomEvent(demoActiveEventName, { detail: nextIndex }),
      );
    };

    updateActiveIndex();
    window.addEventListener('scroll', updateActiveIndex, { passive: true });
    window.addEventListener('resize', updateActiveIndex);

    return () => {
      clearHandoffTimeout();
      window.removeEventListener('scroll', updateActiveIndex);
      window.removeEventListener('resize', updateActiveIndex);
    };
  }, []);

  const handleCardSelect = (index: number) => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    window.scrollTo({
      top: section.offsetTop + window.innerHeight * index,
      behavior: 'smooth',
    });
  };

  return (
    <section
      ref={sectionRef}
      id="demos-section"
      className="relative isolate h-[500vh] text-white"
    >
      <div
        className="absolute inset-0 -z-10 [background-image:radial-gradient(circle,rgba(255,255,255,0.22)_1px,transparent_1px)] [background-size:32px_32px]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 top-0 -z-10 mx-auto h-[720px] max-w-[1440px] bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.22),transparent_64%)]"
        aria-hidden="true"
      />

      <div className="sticky top-0 flex h-screen items-center px-4 py-16 sm:px-6 lg:px-16">
        <div className="mx-auto grid w-full max-w-[1310px] items-center gap-9 lg:grid-cols-[286px_minmax(0,988px)]">
          <DemoCardSlots cardRefs={targetCardRefs} />
          <DemoArticle key={activeDemo.id} demo={activeDemo} />
        </div>
      </div>
      <CardFlightOverlay
        activeIndex={activeIndex}
        flights={isSectionActive ? cardFlights : null}
        isComplete={isHandoffComplete}
        isFlying={isHandoffFlying}
        onSelect={handleCardSelect}
      />
    </section>
  );
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
  onSelect,
}: {
  activeIndex: number;
  flights: CardOffset[] | null;
  isComplete: boolean;
  isFlying: boolean;
  onSelect: (index: number) => void;
}) {
  if (!flights) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {demos.map(({ title, description, Icon }, index) => {
        const flight = flights[index];

        if (!flight || flight.width === 0 || flight.height === 0) {
          return null;
        }

        const isActive = isComplete && activeIndex === index;

        return (
          <button
            key={title}
            className={cn(
              'group fixed rounded-xl border p-5 text-left transition-[transform,width,height,border-color,background-color,box-shadow] duration-700 ease-out',
              isComplete
                ? isActive
                  ? 'border-white/20 bg-white/[0.08] shadow-2xl'
                  : 'border-white/10 bg-white/[0.03] shadow-2xl hover:border-white/20 hover:bg-white/[0.06]'
                : 'border-transparent bg-transparent shadow-none',
              isComplete && 'pointer-events-auto',
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
              width: isFlying ? flight.targetWidth : flight.width,
            }}
            tabIndex={isComplete ? 0 : -1}
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

function DemoArticle({ demo }: { demo: (typeof demos)[number] }) {
  const { id, headline, body, Demo } = demo;

  return (
    <article id={id} className="flex min-w-0 flex-col items-center gap-8">
      <div className="text-center">
        <GradientText
          as="h2"
          className="max-w-[830px] to-blue-500 text-3xl leading-tight font-semibold text-balance sm:text-4xl lg:text-5xl"
        >
          {headline}
        </GradientText>
        <p className="mt-3 max-w-[830px] text-base leading-7 text-zinc-400">
          {body}
        </p>
      </div>

      <div
        aria-label={`${headline} demo`}
        className="relative z-10 mx-auto w-full max-w-[830px]"
      >
        <Demo active />
      </div>
    </article>
  );
}
