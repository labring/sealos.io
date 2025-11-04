'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function HorizonImageFade() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`pointer-events-none absolute inset-x-0 z-10 overflow-hidden transition-opacity duration-[2500ms] ease-out ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ top: 0 }}
    >
      <div className="mx-auto w-full">
        <img src="/images/horizon.png" alt="" className="w-full h-auto select-none" />
      </div>
    </div>
  );
}


