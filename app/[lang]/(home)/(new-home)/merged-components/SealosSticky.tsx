'use client';

import React, { useEffect, useRef } from 'react';

type SealosStickyProps = {
  letters: React.ReactNode;
  bar: React.ReactNode;
};

export default function SealosSticky({ letters, bar }: SealosStickyProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapperRef.current;
    const lettersEl = lettersRef.current;
    if (!el || !lettersEl) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const lettersHeight = lettersEl.offsetHeight;
      const passed = Math.max(0, -rect.top);
      const cover = Math.min(lettersHeight, passed);
      el.style.setProperty('--sealosCoverH', `${cover}px`);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <div
        className="sticky top-0 right-0 left-0 z-[2] bg-black"
        style={{ height: 'var(--sealosCoverH, 0px)' }}
      />
      <div
        ref={lettersRef}
        className="sticky top-0 z-[1] mt-20 mb-5 flex w-full items-end justify-center overflow-hidden px-16"
        style={{ minHeight: 'calc((100vw - 128px) * 0.19493 * 1.262)' }}
      >
        {letters}
      </div>
      <div className="sticky right-0 bottom-0 left-0 z-[2] bg-black">{bar}</div>
    </div>
  );
}
