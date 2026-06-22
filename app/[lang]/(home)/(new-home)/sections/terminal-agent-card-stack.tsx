'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import {
  Folder,
  Loader,
  PencilLine,
  Rocket,
  SquareTerminal,
} from 'lucide-react';

import { GradientText } from '@/new-components/GradientText';

const repoLines = [
  'Analysis Output: analysis.json (Readiness Scored)',
  'Build State: build-result.json',
  'Cloud Spec: template/index.yaml',
  '✓ Preflight environment check: auth, workspace, docker, gh, and kubectl validated',
];

const terminalLines = [
  { icon: Rocket, text: '$sealos deploy ~/project' },
  {
    icon: PencilLine,
    text: 'Scanning project runtime, entry points, and Sealos auth helper templates...',
  },
  { icon: Loader, text: 'Running skill: /sealos-deploy (~/project)' },
];

type CardId = 'repo' | 'terminal';

const frontPose = {
  opacity: 1,
  transform: 'translate3d(0, 0, 0) rotate(0deg) scale(1)',
  transformOrigin: 'center center',
};
const skewedBackPose = {
  opacity: 0.45,
  transform: 'translate3d(20px, -48px, 0) rotate(-7deg) scale(0.95)',
  transformOrigin: 'top right',
};

export function TerminalCardStack() {
  const ref = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>();
  const frontCardRef = useRef<CardId>('terminal');
  const [frontCard, setFrontCard] = useState<CardId>('terminal');
  const [repoPose, setRepoPose] = useState<CSSProperties>(skewedBackPose);
  const [terminalPose, setTerminalPose] = useState<CSSProperties>(frontPose);

  useEffect(() => {
    const setCardPose = (card: CardId, pose: CSSProperties) => {
      if (card === 'repo') {
        setRepoPose(pose);
        return;
      }

      setTerminalPose(pose);
    };
    const runSwap = (nextFront: CardId) => {
      const currentFront = frontCardRef.current;
      if (currentFront === nextFront) return;

      frontCardRef.current = nextFront;
      setFrontCard(nextFront);
      setCardPose(nextFront, frontPose);
      setCardPose(currentFront, skewedBackPose);
    };
    const update = () => {
      if (!ref.current) return;
      const top = ref.current.getBoundingClientRect().top + window.scrollY;
      const nextFront =
        window.scrollY > top - window.innerHeight * 0.48 ? 'repo' : 'terminal';

      runSwap(nextFront);
    };
    const requestUpdate = () => {
      cancelAnimationFrame(frameRef.current ?? 0);
      frameRef.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('scrollend', requestUpdate, { passive: true });
    window.addEventListener('wheel', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });

    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('scrollend', requestUpdate);
      window.removeEventListener('wheel', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      cancelAnimationFrame(frameRef.current ?? 0);
    };
  }, []);

  return (
    <div ref={ref} className="relative min-h-[360px] md:min-h-[320px]">
      <div
        className={[
          'absolute inset-x-0 top-0 origin-center transform-gpu transition-[transform,opacity] duration-300 ease-out will-change-transform motion-reduce:transform-none motion-reduce:transition-none',
          frontCard === 'repo' ? 'z-[2]' : 'z-[1]',
        ].join(' ')}
        style={repoPose}
      >
        <RepositoryCard />
      </div>
      <div
        className={[
          'absolute inset-x-0 top-0 origin-center transform-gpu transition-[transform,opacity] duration-300 ease-out will-change-transform motion-reduce:transform-none motion-reduce:transition-none',
          frontCard === 'terminal' ? 'z-[2]' : 'z-[1]',
        ].join(' ')}
        style={terminalPose}
      >
        <TerminalCard />
      </div>
    </div>
  );
}

function RepositoryCard() {
  return (
    <article className="bg-background rounded-xl border border-white/10 p-4 shadow-[0_-4px_26px_rgba(8,10,17,0.9)]">
      <div className="mb-4 flex items-center gap-3 text-sm text-zinc-200">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
          <Folder className="size-5 text-blue-400" aria-hidden="true" />
        </span>
        <span className="min-w-0">Repository State: .sealos/</span>
        <span className="ml-auto hidden rounded-full bg-green-500/25 px-4 py-2 text-xs text-green-200 sm:inline-flex">
          READY FOR ROLLOUT
        </span>
      </div>
      <div className="space-y-2 rounded-lg bg-black/35 p-4 text-sm leading-6 text-zinc-500">
        {repoLines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </article>
  );
}

function TerminalCard() {
  return (
    <article className="bg-background rounded-xl border border-white/10 p-4 shadow-[0_-4px_26px_rgba(8,10,17,0.9)]">
      <div className="mb-4 flex items-center gap-2 text-sm text-zinc-400">
        <SquareTerminal className="size-4" aria-hidden="true" />
        <GradientText className="to-blue-500 text-lg">
          terminal — sealos-skills
        </GradientText>
      </div>
      <div className="space-y-4 rounded-lg border border-white/5 bg-white/[0.03] p-4">
        {terminalLines.map((line) => {
          const Icon = line.icon;

          return (
            <div key={line.text} className="flex items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                <Icon className="size-4 text-blue-400" aria-hidden="true" />
              </span>
              <span className="min-w-0 text-sm text-zinc-200">{line.text}</span>
            </div>
          );
        })}
      </div>
    </article>
  );
}
