'use client';

import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import HeroSection from '@/components/ui/hero-section';
import StatsCards from '@/components/ui/stats-cards';
import WhySourceAvailableMatters from '@/components/ui/why-source-available-matters';

interface SixthScreenProps {
  lang?: string;
}

export default function SixthScreen({ lang = 'en' }: SixthScreenProps) {
  const light1Ref = useRef<HTMLDivElement | null>(null);
  const light2Ref = useRef<HTMLDivElement | null>(null);
  const light3Ref = useRef<HTMLDivElement | null>(null);
  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [visible3, setVisible3] = useState(false);

  useEffect(() => {
    const elements: Array<{ el: HTMLDivElement | null; setVisible: (v: boolean) => void }> = [
      { el: light1Ref.current, setVisible: setVisible1 },
      { el: light2Ref.current, setVisible: setVisible2 },
      { el: light3Ref.current, setVisible: setVisible3 },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLDivElement;
            if (target === light1Ref.current) setVisible1(true);
            if (target === light2Ref.current) setVisible2(true);
            if (target === light3Ref.current) setVisible3(true);
            observer.unobserve(target);
          }
        });
      },
      { root: null, threshold: 0.1 }
    );

    elements.forEach(({ el }) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative">
      {/* Background Light Image */}
      <div
        className="pointer-events-none absolute left-1/2 z-50 w-screen -translate-x-1/2"
        style={{ top: '-114px' }}
      >
        <img
          src="/images/light1.png"
          alt=""
          className="h-auto w-full select-none"
        />
      </div>
      {/* Tertiary Background Light Image (same as light1) */}
      <div
        className="pointer-events-none absolute left-1/2 z-50 w-screen -translate-x-1/2"
        style={{ top: '-114px' }}
      >
        <img
          src="/images/light3.png"
          alt=""
          className="h-auto w-full select-none"
        />
      </div>
      {/* Secondary Background Light Image */}
      <div
        className="pointer-events-none absolute right-0 z-40 w-[50vw]"
        style={{ top: '-114px' }}
      >
        <img
          src="/images/light2.png"
          alt=""
          className="h-auto w-full select-none"
        />
      </div>
      {/* Hero Section */}
      <div className="relative z-30">
        <HeroSection lang={lang} />
      </div>

      {/* Stats Cards Section (80px gap from hero) */}
      <div className="relative mt-20 w-full bg-black">
        <div className="relative z-30 w-full">
          <StatsCards />
        </div>
      </div>

      {/* Why Source Available Matters Section */}
      <div className="relative z-10 w-full">
        <WhySourceAvailableMatters />
      </div>
    </div>
  );
}
