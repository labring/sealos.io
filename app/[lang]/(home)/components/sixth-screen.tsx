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
        ref={light1Ref}
        className={`pointer-events-none absolute z-50 left-1/2 -translate-x-1/2 w-screen transition-opacity duration-[2500ms] ease-out ${
          visible1 ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ top: '-114px' }}
      >
        <img
          src="/images/light1.png"
          alt=""
          className="w-full h-auto select-none"
        />
      </div>
      {/* Tertiary Background Light Image (same as light1) */}
      <div
        ref={light3Ref}
        className={`pointer-events-none absolute z-50 left-1/2 -translate-x-1/2 w-screen transition-opacity duration-[2500ms] ease-out ${
          visible3 ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ top: '-114px' }}
      >
        <img
          src="/images/light3.png"
          alt=""
          className="w-full h-auto select-none"
        />
      </div>
      {/* Secondary Background Light Image */}
      <div
        ref={light2Ref}
        className={`pointer-events-none absolute z-40 right-0 w-[50vw] transition-opacity duration-[2500ms] ease-out ${
          visible2 ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ top: '-114px' }}
      >
        <img
          src="/images/light2.png"
          alt=""
          className="w-full h-auto select-none"
        />
      </div>
      {/* Hero Section */}
      <div className="relative z-30">
        <HeroSection lang={lang} />
      </div>
      
      {/* Stats Cards Section (80px gap from hero) */}
      <div className="relative bg-black mt-20 w-full">
        <div className="w-full relative z-30">
          <StatsCards />
        </div>
      </div>

      {/* Why Source Available Matters Section */}
      <div className="w-full relative z-10">
        <WhySourceAvailableMatters />
      </div>
    </div>
  );
}
