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
      // amount the wrapper's top has moved past the viewport top
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
    <div ref={wrapperRef} className="sealos-sticky-wrapper">
      <div className="sealos-top-mask" />
      <div ref={lettersRef} className="sealos-background-text">
        {letters}
      </div>
      <div className="footer-sticky">{bar}</div>
    </div>
  );
}


