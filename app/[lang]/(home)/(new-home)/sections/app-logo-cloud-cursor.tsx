'use client';

import { type ReactNode, useEffect, useRef, useState } from 'react';
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
} from 'motion/react';

type CursorTarget = {
  x: number;
  y: number;
  label: string;
  commentSide: 'left' | 'right';
};

const fallbackTarget: CursorTarget = {
  x: 656,
  y: 96,
  label: 'Deploy',
  commentSide: 'right',
};

export function AppLogoCloudCursor({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [target, setTarget] = useState<CursorTarget>(fallbackTarget);
  const shouldReduceMotion = useReducedMotion();
  const x = useMotionValue(fallbackTarget.x);
  const y = useMotionValue(fallbackTarget.y);
  const mask = useMotionTemplate`radial-gradient(circle 220px at ${x}px ${y}px, transparent 0 82px, rgba(0,0,0,0.35) 128px, black 220px)`;

  useEffect(() => {
    let previousIndex = -1;

    function pickTarget() {
      const cloud = rootRef.current?.parentElement;

      if (!cloud) {
        return;
      }

      const cloudRect = cloud.getBoundingClientRect();
      const headingRect = cloud.parentElement
        ?.querySelector<HTMLElement>('[data-apps-section-heading]')
        ?.getBoundingClientRect();
      const visibleTiles = Array.from(
        cloud.querySelectorAll<HTMLElement>('[data-app-logo-tile]'),
      ).filter((tile) => {
        const rect = tile.getBoundingClientRect();

        return (
          rect.right > cloudRect.left &&
          rect.left < cloudRect.right &&
          rect.bottom > cloudRect.top &&
          rect.top < cloudRect.bottom
        );
      });
      const tiles =
        headingRect && visibleTiles.length > 1
          ? visibleTiles.filter((tile) => {
              const rect = tile.getBoundingClientRect();
              const cursorX = rect.left + rect.width * 0.58;
              const cursorY = rect.top + rect.height * 0.3;

              return (
                cursorX > headingRect.right ||
                cursorX + 220 < headingRect.left ||
                cursorY > headingRect.bottom + 12 ||
                cursorY + 64 < headingRect.top
              );
            })
          : visibleTiles;

      const targetTiles = tiles.length ? tiles : visibleTiles;

      if (!targetTiles.length) {
        return;
      }

      let nextIndex = Math.floor(Math.random() * targetTiles.length);

      if (targetTiles.length > 1 && nextIndex === previousIndex) {
        nextIndex = (nextIndex + 1) % targetTiles.length;
      }

      previousIndex = nextIndex;

      const tile = targetTiles[nextIndex];
      const rect = tile.getBoundingClientRect();

      setTarget({
        x: rect.left - cloudRect.left + rect.width * 0.58,
        y: rect.top - cloudRect.top + rect.height * 0.3,
        label: tile.dataset.appName ?? fallbackTarget.label,
        commentSide: rect.left + 240 > window.innerWidth ? 'left' : 'right',
      });
    }

    pickTarget();

    if (shouldReduceMotion) {
      return;
    }

    const intervalId = window.setInterval(pickTarget, 1000);

    window.addEventListener('resize', pickTarget);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('resize', pickTarget);
    };
  }, [shouldReduceMotion]);

  useEffect(() => {
    if (shouldReduceMotion) {
      x.set(target.x);
      y.set(target.y);
      return;
    }

    const options = {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as const,
    };
    const xAnimation = animate(x, target.x, options);
    const yAnimation = animate(y, target.y, options);

    return () => {
      xAnimation.stop();
      yAnimation.stop();
    };
  }, [shouldReduceMotion, target.x, target.y, x, y]);

  return (
    <div ref={rootRef} className="absolute inset-0 z-20" aria-hidden="true">
      <motion.div
        className="absolute inset-0"
        style={{
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      >
        {children}
      </motion.div>
      <motion.div
        className="absolute top-0 left-0 drop-shadow-[0_12px_24px_rgba(0,0,0,0.38)] will-change-transform"
        style={{ x, y }}
      >
        <img
          src="/images/home/apps-cursor.svg"
          alt=""
          width="22"
          height="22"
          className="max-w-none"
        />
        <div
          className={`absolute top-[22px] flex h-9 max-w-[180px] items-center rounded-full border-2 border-blue-500 bg-blue-500 px-4 text-base leading-6 font-medium whitespace-nowrap text-white ${
            target.commentSide === 'left' ? 'right-2' : 'left-[24px]'
          }`}
        >
          <span className="truncate">{target.label}</span>
        </div>
      </motion.div>
    </div>
  );
}
