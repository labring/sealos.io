'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  Box,
  Clock3,
  CodeXml,
  Database,
  Github,
  LayoutGrid,
  type LucideIcon,
} from 'lucide-react';

type BrainCap = {
  icon: LucideIcon;
  title: string;
  description: string;
  codeLabel: string;
  codeLines: string[];
  previewTitle: string;
};

const brainCaps: BrainCap[] = [
  {
    icon: Box,
    title: 'Live Object Canvas',
    description:
      'Every container, DB, ingress, and DevBox is a node on a 2D canvas. Pan, zoom, draw an edge to wire things up. Live CPU/Memory/Disk on every card.',
    codeLabel: '# resource meters update in real time',
    codeLines: ['orders-api', '47% CPU · 612Mi'],
    previewTitle: 'Canvas preview placeholder',
  },
  {
    icon: Clock3,
    title: 'Auto Env Injection',
    description:
      'Connect a container to a DB on the canvas — Sealos injects DATABASE_URL, secrets, and pool config automatically. No copy-paste credentials.',
    codeLabel: '# auto-fired when edge drawn',
    codeLines: [
      'DATABASE_URL=postgres://orders:****@pg-ha.internal:5432/orders',
    ],
    previewTitle: 'Env preview placeholder',
  },
  {
    icon: Database,
    title: 'Built-in DB Studio',
    description:
      'Click any database to open a full studio — schema tree, ER diagram, rows/schema/indexes tabs, backup scheduler, and CSV/DMP/URL import. Most platforms stop at provisioning.',
    codeLabel: '// browse, schedule backups, run queries — all in-product',
    codeLines: ["SELECT * FROM orders WHERE status = 'paid';"],
    previewTitle: 'DB Studio preview placeholder',
  },
  {
    icon: CodeXml,
    title: 'DevBox + Local IDE',
    description:
      'Spin up a cloud dev env, connect VS Code/Cursor/Windsurf/JetBrains over SSH. Everything you push runs on the same cluster as production.',
    codeLabel: '# ide-link generated automatically',
    codeLines: ['cursor://devbox/orders-api?token=eyJ...'],
    previewTitle: 'DevBox preview placeholder',
  },
  {
    icon: LayoutGrid,
    title: 'One-Click HA',
    description:
      'Toggle replicas from 1 → 2 → 3 → 5. Sealos handles failover, leader election, and replication topology automatically. Postgres, MySQL, Mongo, Redis all supported.',
    codeLabel: '# before',
    codeLines: [
      'replicas: 1',
      '# click → 3 (HA)',
      'replicas: 3 · failover: automatic',
    ],
    previewTitle: 'HA preview placeholder',
  },
  {
    icon: Github,
    title: 'Source - Available Core',
    description:
      'Audit the code, fork it, self-host it. labring/sealos on GitHub — 16K+ stars, Apache-2.0. No vendor lock-in.',
    codeLabel: '$ git clone https://github.com/labring/sealos',
    codeLines: ['# yes, the actual platform'],
    previewTitle: 'GitHub preview placeholder',
  },
];

export function BrainCapsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const updateActiveIndex = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const scrollableDistance = section.offsetHeight - window.innerHeight;
      const progress =
        scrollableDistance > 0
          ? Math.min(
              1,
              Math.max(0, -rect.top / scrollableDistance),
            )
          : 0;
      const nextIndex = Math.min(
        brainCaps.length - 1,
        Math.floor(progress * brainCaps.length),
      );

      if (activeIndexRef.current === nextIndex) return;
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

  return (
    <section
      ref={sectionRef}
      className="relative h-[600vh] overflow-visible px-4 text-white sm:px-6 lg:px-16"
    >
      <div
        className="absolute inset-x-0 top-0 h-full bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:32px_41px] opacity-40"
        aria-hidden="true"
      />
      <div className="sticky top-0 flex min-h-screen items-center py-20 lg:py-28">
        <div className="relative mx-auto w-full max-w-[1312px]">
          <h2 className="max-w-[760px] text-4xl leading-tight font-semibold text-balance text-zinc-100 sm:text-5xl">
            Eight things you usually duct-tape together. One platform.
          </h2>

          <div className="mt-16 grid items-center gap-10 lg:grid-cols-[minmax(0,506px)_minmax(0,1fr)]">
            <div className="relative min-h-[335px]">
              {brainCaps.map((cap, index) => (
                <div
                  key={cap.title}
                  className="absolute inset-0 transition-[filter,opacity,transform] duration-500 ease-out"
                  style={getCopyStyle(index, activeIndex)}
                >
                  <BrainCapCopy cap={cap} />
                </div>
              ))}
            </div>

            <div className="relative h-[374px] md:h-[460px]">
              {brainCaps.map((cap, index) => (
                <div
                  key={cap.title}
                  className="absolute inset-0 origin-top transition-[filter,opacity,transform] duration-500 ease-out"
                  style={getPreviewStyle(index, activeIndex)}
                >
                  <PreviewCard cap={cap} index={index} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function getCopyStyle(index: number, activeIndex: number): CSSProperties {
  const offset = index - activeIndex;

  return {
    opacity: offset === 0 ? 1 : 0,
    pointerEvents: offset === 0 ? 'auto' : 'none',
    filter: offset === 0 ? 'blur(0px)' : 'blur(12px)',
    transform: `translate3d(0, ${
      offset < 0 ? -36 : offset > 0 ? 36 : 0
    }px, 0)`,
  };
}

function getPreviewStyle(index: number, activeIndex: number) {
  const depth = activeIndex - index;
  const isFuture = depth < 0;
  const clampedDepth = Math.max(0, depth);

  return {
    zIndex: isFuture ? 0 : brainCaps.length - clampedDepth,
    opacity: isFuture ? 0 : 1,
    filter: isFuture ? 'blur(8px)' : 'none',
    transform: `translate3d(0, ${clampedDepth * 64}px, 0) scale(${
      1 - clampedDepth * 0.035
    }) rotate(${clampedDepth * -0.6}deg)`,
  };
}

function BrainCapCopy({ cap }: { cap: BrainCap }) {
  const Icon = cap.icon;

  return (
    <article className="max-w-[506px]">
      <div className="flex items-center gap-5">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
          <Icon className="size-6 text-blue-400" aria-hidden="true" />
        </div>
        <h3 className="text-2xl leading-8 font-medium text-zinc-100">
          {cap.title}
        </h3>
      </div>
      <p className="mt-5 text-base leading-6 text-zinc-500">
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
    </article>
  );
}

function PreviewCard({ cap, index }: { cap: BrainCap; index: number }) {
  const Icon = cap.icon;

  return (
    <div className="relative flex h-full overflow-hidden rounded-[28px] border border-white/20 bg-[#0b0e15] shadow-[0_28px_90px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.06)_inset]">
      <div
        className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:42px_42px]"
        aria-hidden="true"
      />
      <div
        className="absolute -top-20 right-10 size-56 rounded-full bg-blue-500/20 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative flex flex-1 flex-col p-8">
        <div className="flex items-center gap-3 text-xs font-medium tracking-[0.16em] text-zinc-500 uppercase">
          <Icon className="size-4 text-blue-400" aria-hidden="true" />
          <span>{cap.previewTitle}</span>
          <span className="ml-auto text-blue-400">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
        <div className="mt-8 flex flex-1 items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.035]">
          <div className="text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-blue-500/10">
              <Icon className="size-8 text-blue-400" aria-hidden="true" />
            </div>
            <p className="mt-5 text-lg font-medium text-zinc-200">
              {cap.title}
            </p>
            <p className="mt-2 text-sm text-zinc-500">Image placeholder</p>
          </div>
        </div>
      </div>
    </div>
  );
}
