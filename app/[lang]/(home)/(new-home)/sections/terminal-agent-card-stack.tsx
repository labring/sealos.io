'use client';

import { useEffect, useRef, useState } from 'react';
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

export function TerminalCardStack() {
  const ref = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>();
  const openRef = useRef(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      if (!ref.current) return;
      const top = ref.current.getBoundingClientRect().top + window.scrollY;
      const nextOpen = window.scrollY > top - window.innerHeight * 0.48;

      if (openRef.current === nextOpen) return;

      openRef.current = nextOpen;
      setIsOpen(nextOpen);
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
    <div
      ref={ref}
      className={[
        'relative overflow-hidden transition-[height] duration-500 ease-out motion-reduce:transition-none',
        isOpen ? 'h-[638px]' : 'h-[330px] md:h-[300px]',
      ].join(' ')}
    >
      <div
        className={[
          'absolute inset-x-0 bottom-0 z-[0] transform-gpu transition-transform duration-500 ease-out will-change-transform motion-reduce:transition-none',
        ].join(' ')}
        style={{
          transform: 'translate3d(0, 0, 0)',
        }}
      >
        <TerminalFolderBack />
      </div>
      <div
        className={[
          'absolute inset-x-0 top-0 transform-gpu px-4 transition-transform duration-500 ease-out will-change-transform motion-reduce:transition-none',
          'z-[1]',
        ].join(' ')}
        style={{
          transform: `translate3d(0, ${isOpen ? 54 : 36}px, 0) rotate(${isOpen ? 0 : -2.89}deg)`,
          transitionProperty: 'transform',
        }}
      >
        <RepositoryCard />
      </div>
      <div className="absolute inset-x-0 bottom-0 z-[2] p-px">
        <TerminalFolderFront />
      </div>
    </div>
  );
}

function RepositoryCard() {
  return (
    <article className="rounded-xl border border-white/10 bg-[#101219] p-5 shadow-[0_-4px_13px_rgba(8,10,17,1)]">
      <div className="mb-5 flex items-center gap-3 text-base text-zinc-200">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-md bg-white/5">
          <Folder className="size-6 text-blue-400" aria-hidden="true" />
        </span>
        <span className="min-w-0">Repository State: .sealos/</span>
        <span className="ml-auto hidden h-9 items-center rounded-full bg-green-500/30 px-5 text-sm leading-5 text-green-100 sm:inline-flex">
          READY FOR ROLLOUT
        </span>
      </div>
      <div className="space-y-2 rounded-xl bg-black/35 p-5 text-base leading-6 text-zinc-500">
        {repoLines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </article>
  );
}

function TerminalFolderBack() {
  return (
    <div className="relative h-[298px] rounded-xl">
      <div
        className="absolute top-0 left-0 size-full rounded-xl bg-white/15"
        style={{
          clipPath:
            'polygon(0 0, 16rem 0, 17.5rem 3rem, 100% 3rem, 100% 100%, 0 100%)',
        }}
      />
      <div
        className="absolute top-0 left-0 size-full rounded-xl bg-[#101219] shadow-[0_-4px_26px_rgba(8,10,17,0.9)]"
        style={{
          clipPath:
            'polygon(1px 1px, calc(16rem - 1px) 1px, calc(17.5rem - 1px) calc(3rem + 1px), calc(100% - 1px) calc(3rem + 1px), calc(100% - 1px) calc(100% - 1px), 1px calc(100% - 1px)',
        }}
      />
      <div className="relative top-0 h-12 w-[298px]">
        <div
          className="absolute inset-0"
          // style={{
          //   clipPath: 'polygon(0 0, calc(100% - 28px) 0, 100% 100%, 0 100%)',
          // }}
          aria-hidden="true"
        />
        <div className="absolute top-px right-px bottom-0 left-px flex items-center gap-2 px-4 text-base text-zinc-200">
          <SquareTerminal className="size-4" aria-hidden="true" />
          <GradientText className="to-blue-500 text-xl leading-7">
            terminal — sealos-skills
          </GradientText>
        </div>
      </div>
    </div>
  );
}

function TerminalFolderFront() {
  return (
    <div className="pt-12">
      {/* <div className="rounded-xl rounded-tl-none border border-white/10 bg-[#101219] pt-6"> */}
      <TerminalBody />
      {/* </div> */}
    </div>
  );
}

function TerminalBody() {
  return (
    <div className="space-y-5 rounded-xl border-t border-white/10 bg-[#13151C] p-5 shadow-xl">
      {terminalLines.map((line) => {
        const Icon = line.icon;

        return (
          <div key={line.text} className="flex items-center gap-2.5">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-md bg-white/5">
              <Icon className="size-6 text-blue-400" aria-hidden="true" />
            </span>
            <span className="min-w-0 text-base leading-none text-zinc-200">
              {line.text}
            </span>
          </div>
        );
      })}
    </div>
  );
}
