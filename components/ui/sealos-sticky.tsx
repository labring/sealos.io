'use client';

import React, { useEffect, useRef } from 'react';

type SealosStickyProps = {
  letters: React.ReactNode;
};

export default function SealosSticky({ letters }: SealosStickyProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapperRef.current;
    const lettersEl = lettersRef.current;
    if (!el || !lettersEl) return;

    const update = () => {
      const lettersHeight = lettersEl.offsetHeight;
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      const viewportH =
        window.innerHeight || document.documentElement.clientHeight;
      const docH = document.documentElement.scrollHeight;
      // 剩余可滚动距离（越靠近底部越小，向上滚动越大）
      const remaining = docH - (scrollTop + viewportH);
      // 将剩余距离映射为遮罩高度：从 0 → lettersHeight
      const cover = Math.max(0, Math.min(lettersHeight, remaining * 0.5));
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
    </div>
  );
}
