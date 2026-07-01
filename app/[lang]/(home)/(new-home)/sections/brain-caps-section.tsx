'use client';

import { useEffect, useRef, useState } from 'react';
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

type BrainCap = {
  icon: LucideIcon;
  title: string;
  description: string;
  codeLabel: string;
  codeLines: string[];
  demoTitle: string;
};

const brainCaps: BrainCap[] = [
  {
    icon: Box,
    title: 'Live Object Canvas',
    description:
      'Every container, DB and ingress is a node on a 2D canvas. Pan, zoom, draw an edge to wire things up. Live CPU/Memory/Disk on every card.',
    codeLabel: '# resource meters update in real time',
    codeLines: ['orders-api', '47% CPU · 612Mi'],
    demoTitle: 'Canvas demo placeholder',
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
    demoTitle: 'Env injection demo placeholder',
  },
  {
    icon: Database,
    title: 'Built-in DB Studio',
    description:
      'Click any database to open a full studio — schema tree, rows/schema/indexes tabs, backup scheduler. Most platforms stop at provisioning.',
    codeLabel: '// browse, schedule backups, run queries — all in-product',
    codeLines: ["SELECT * FROM orders WHERE status = 'paid';"],
    demoTitle: 'DB Studio demo placeholder',
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
    demoTitle: 'HA demo placeholder',
  },
  {
    icon: FileCode2,
    title: 'Source - Available Core',
    description:
      'Audit the code, fork it, self-host it. labring/sealos on GitHub — 16K+ stars, Apache-2.0. No vendor lock-in.',
    codeLabel: '$ git clone https://github.com/labring/sealos',
    codeLines: ['# yes, the actual platform'],
    demoTitle: 'Source demo placeholder',
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
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const scrollableDistance = section.offsetHeight - window.innerHeight;
      const progress =
        scrollableDistance > 0
          ? Math.min(1, Math.max(0, -rect.top / scrollableDistance))
          : 0;
      const nextIndex = Math.min(
        brainCaps.length - 1,
        Math.floor(progress * brainCaps.length),
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
    const scrollableDistance = section.offsetHeight - window.innerHeight;
    const progress =
      index === brainCaps.length - 1 ? 1 : (index + 0.05) / brainCaps.length;

    window.scrollTo({
      top: sectionTop + scrollableDistance * progress,
      behavior: 'auto',
    });
  };

  return (
    <section
      ref={sectionRef}
      className="relative h-[500vh] overflow-visible px-4 text-white sm:px-6 lg:px-16"
    >
      <div
        className="absolute inset-x-0 top-0 h-full bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:32px_41px] opacity-40"
        aria-hidden="true"
      />
      <div className="sticky top-0 flex min-h-screen items-center py-20 lg:py-28">
        <div className="relative mx-auto w-full max-w-[1312px]">
          <h2 className="max-w-[760px] text-4xl leading-tight font-semibold text-balance text-zinc-100 sm:text-5xl">
            <GradientText>
              Eight things you usually duct-tape together. One platform.
            </GradientText>
          </h2>

          <div className="mt-16 grid items-center gap-10 lg:grid-cols-[minmax(0,506px)_minmax(0,1fr)]">
            <div className="space-y-5">
              {brainCaps.map((cap, index) => (
                <AccordionItem
                  key={cap.title}
                  cap={cap}
                  isActive={index === activeIndex}
                  onClick={() => scrollToIndex(index)}
                />
              ))}
            </div>

            <div className="relative h-[374px] md:h-[460px]">
              <AnimatePresence custom={direction} initial={false} mode="wait">
                <motion.div
                  key={brainCaps[activeIndex].title}
                  custom={direction}
                  className="absolute inset-0"
                  initial={getPanelMotion(direction, 'enter')}
                  animate={getPanelMotion(direction, 'center')}
                  exit={getPanelMotion(direction, 'exit')}
                  transition={motionTransition}
                >
                  <DemoPlaceholder cap={brainCaps[activeIndex]} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const motionTransition: Transition = {
  duration: 0.52,
  ease: [0.22, 1, 0.36, 1],
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
        className="flex w-full items-center gap-5 text-left"
        aria-expanded={isActive}
        onClick={onClick}
      >
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
          <Icon className="size-6 text-blue-400" aria-hidden="true" />
        </span>
        <span className="text-2xl leading-8 font-medium text-zinc-100">
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
            <p className="mt-4 text-base leading-6 text-zinc-500">
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

function DemoPlaceholder({ cap }: { cap: BrainCap }) {
  const Icon = cap.icon;

  return (
    <div className="relative flex h-full overflow-hidden rounded-[28px] border border-white/20 bg-[#0b0e15] shadow-[0_28px_90px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.06)_inset]">
      <div
        className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:42px_42px]"
        aria-hidden="true"
      />
      <div className="relative flex flex-1 flex-col p-8">
        <div className="flex items-center gap-3 text-xs font-medium tracking-[0.16em] text-zinc-500 uppercase">
          <Icon className="size-4 text-blue-400" aria-hidden="true" />
          <span>{cap.demoTitle}</span>
        </div>
        <div className="mt-8 flex flex-1 items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.035]">
          <div className="text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-blue-500/10">
              <Icon className="size-8 text-blue-400" aria-hidden="true" />
            </div>
            <p className="mt-5 text-lg font-medium text-zinc-200">
              {cap.title}
            </p>
            <p className="mt-2 text-sm text-zinc-500">Demo placeholder</p>
          </div>
        </div>
      </div>
    </div>
  );
}
