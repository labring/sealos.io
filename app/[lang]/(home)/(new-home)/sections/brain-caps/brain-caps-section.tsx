'use client';

import Image from 'next/image';
import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from 'react';
import {
  ArrowUpNarrowWide,
  Box,
  Clock3,
  Database,
  FileCode2,
  type LucideIcon,
} from 'lucide-react';
import { AnimatePresence, motion, type Transition } from 'motion/react';
import { GradientText } from '@/new-components/GradientText';
import {
  DeployCanvasDemo,
  DBStudioDemo,
  DBDeployDemo,
  LiveObjectCanvasDemo,
} from '../../components/deploy-demos/brain-caps-demos';

type BrainCap = {
  icon: LucideIcon;
  title: string;
  description: string;
  codeLabel: string;
  codeLines: string[];
  demo: ComponentType;
};

const brainCaps: BrainCap[] = [
  {
    icon: Box,
    title: 'Live Object Canvas',
    description:
      'Every container, DB and ingress is a node on a 2D canvas. Pan, zoom, draw an edge to wire things up. Live CPU/Memory/Disk on every card.',
    codeLabel: '# resource meters update in real time',
    codeLines: ['orders-api', '47% CPU · 612Mi'],
    demo: LiveObjectCanvasDemo,
  },
  {
    icon: Clock3,
    title: 'Auto Env Injection',
    description:
      'Connect a container to a DB on the canvas — Sealos injects DATABASE_URL, secrets, and pool config automatically. No copy-paste credentials.',
    codeLabel: '# auto-fired when edge drawn',
    codeLines: [
      'DATABASE_URL=postgres://orders:••••@pg-ha.internal:5432/orders',
    ],
    demo: DeployCanvasDemo,
  },
  {
    icon: Database,
    title: 'Built-in DB Studio',
    description:
      'Click any database to open a full studio — schema tree, rows/schema/indexes tabs, backup scheduler. Most platforms stop at provisioning.',
    codeLabel: '// browse, schedule backups, run queries — all in-product',
    codeLines: ["SELECT * FROM orders WHERE status = 'paid';"],
    demo: DBStudioDemo,
  },
  {
    icon: ArrowUpNarrowWide,
    title: 'One-Click High Availability',
    description:
      'Toggle replicas from 1 → 2 → 3 → 5. Sealos handles failover, leader election, and replication topology automatically. Postgres, MySQL, Mongo, Redis all supported.',
    codeLabel: '# before',
    codeLines: [
      'replicas: 1',
      '# click → 3 (HA)',
      'replicas: 3 · failover: automatic',
    ],
    demo: DBDeployDemo,
  },
  {
    icon: FileCode2,
    title: 'Source - Available Core',
    description:
      'Audit the code, fork it, self-host it. labring/sealos on GitHub — 16K+ stars, Apache-2.0. No vendor lock-in.',
    codeLabel: '$ git clone https://github.com/labring/sealos',
    codeLines: ['# yes, the actual platform'],
    demo: SourceCoreDemo,
  },
];

export function BrainCapsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const updateActiveIndex = () => {
      const section = sectionRef.current;
      if (!section || !isStickyLayout()) return;

      const rect = section.getBoundingClientRect();
      const scrolledDistance = Math.max(0, -rect.top);
      const stepDistance = getScrollStepDistance(window.innerHeight);
      const nextIndex = Math.min(
        brainCaps.length - 1,
        Math.floor(scrolledDistance / stepDistance),
      );

      if (activeIndexRef.current === nextIndex) return;
      setDirection(nextIndex > activeIndexRef.current ? 1 : -1);
      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
    };

    updateActiveIndex();
    window.addEventListener('scroll', updateActiveIndex, { passive: true });
    window.addEventListener('resize', updateActiveIndex);

    return () => {
      window.removeEventListener('scroll', updateActiveIndex);
      window.removeEventListener('resize', updateActiveIndex);
    };
  }, []);

  const scrollToIndex = (index: number) => {
    const section = sectionRef.current;
    if (!section) return;

    setDirection(index > activeIndexRef.current ? 1 : -1);
    activeIndexRef.current = index;
    setActiveIndex(index);

    const sectionTop = window.scrollY + section.getBoundingClientRect().top;
    if (!isStickyLayout()) return;

    const stepDistance = getScrollStepDistance(window.innerHeight);

    window.scrollTo({
      top: sectionTop + stepDistance * (index + 0.05),
      behavior: 'auto',
    });
  };

  return (
    <div className="w-full max-w-[100vw] overflow-x-clip">
      <section
        ref={sectionRef}
        className="relative overflow-visible text-white lg:h-[475vh] lg:min-h-[calc(100vh+1920px)]"
      >
        <div
          className="absolute inset-x-0 top-0 h-full bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:32px_41px] opacity-40"
          aria-hidden="true"
        />
        <div className="container mx-auto py-20 lg:sticky lg:top-0 lg:flex lg:min-h-screen lg:items-center lg:py-28">
          <div className="relative w-full">
            <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,506px)_minmax(0,1fr)]">
              <div>
                <h2 className="text-3xl leading-tight font-semibold text-balance text-zinc-100 sm:text-4xl">
                  <GradientText>
                    Eight things you usually duct-tape together. One platform.
                  </GradientText>
                </h2>

                <div className="mt-8 space-y-5">
                  {brainCaps.map((cap, index) => (
                    <AccordionItem
                      key={cap.title}
                      cap={cap}
                      isActive={index === activeIndex}
                      onClick={() => scrollToIndex(index)}
                    />
                  ))}
                </div>
              </div>

              <div className="relative hidden h-[374px] md:h-[460px] lg:block lg:self-center">
                <AnimatePresence custom={direction} initial={false}>
                  <motion.div
                    key={brainCaps[activeIndex].title}
                    custom={direction}
                    className="absolute inset-0"
                    initial={getPanelMotion(direction, 'enter')}
                    animate={getPanelMotion(direction, 'center')}
                    exit={getPanelMotion(direction, 'exit')}
                    transition={panelTransition}
                  >
                    <BrainCapDemo cap={brainCaps[activeIndex]} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function isStickyLayout() {
  return window.matchMedia('(min-width: 1024px)').matches;
}

function getScrollStepDistance(viewportHeight: number) {
  return Math.max(viewportHeight * 0.75, 384);
}

const motionTransition: Transition = {
  duration: 0.52,
  ease: [0.22, 1, 0.36, 1],
};

const panelTransition: Transition = {
  duration: 0.18,
  ease: 'easeOut',
};

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

function AccordionItem({
  cap,
  isActive,
  onClick,
}: {
  cap: BrainCap;
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = cap.icon;

  return (
    <article className="rounded-2xl p-0">
      <button
        type="button"
        className="group flex w-full items-center gap-5 text-left"
        aria-expanded={isActive}
        onClick={onClick}
      >
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
          <Icon
            className={`size-6 transition-colors ${
              isActive
                ? 'text-blue-400'
                : 'text-white group-hover:text-blue-400'
            }`}
            aria-hidden="true"
          />
        </span>
        <span className="text-lg leading-7 font-semibold text-zinc-100">
          {cap.title}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isActive ? (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={motionTransition}
            className="overflow-hidden"
          >
            <p className="mt-4 text-base leading-6 font-normal text-zinc-500">
              {cap.description}
            </p>
            <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.04] p-4 font-mono text-xs leading-5 text-zinc-400">
              <p>{cap.codeLabel}</p>
              <div className="mt-4 space-y-1 text-zinc-300">
                {cap.codeLines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </article>
  );
}

function BrainCapDemo({ cap }: { cap: BrainCap }) {
  const Demo = cap.demo;

  return (
    <ScaledBrainCapDemo>
      <Demo />
    </ScaledBrainCapDemo>
  );
}

function ScaledBrainCapDemo({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex h-full w-full items-center justify-start overflow-visible">
      <div className="relative aspect-[1312/812] h-[166.6667%] shrink-0 origin-left scale-75 [&>*]:!mx-0 [&>*]:!h-full [&>*]:!w-full [&>*]:!max-w-none">
        {children}
      </div>
    </div>
  );
}

function SourceCoreDemo() {
  return (
    <div className="relative size-full overflow-hidden rounded-[18px] border border-white/10 bg-[#080a11] shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
      <Image
        src="/images/home/sealos-github-repo-demo.png"
        alt="GitHub repository page for the Sealos source-available core"
        fill
        sizes="(min-width: 1024px) 984px, 100vw"
        className="object-cover"
      />
    </div>
  );
}
