'use client';

import Image from 'next/image';
import HeroSection from '@/components/ui/hero-section';
import StatsCards from '@/components/ui/stats-cards';
import WhySourceAvailableMatters from '@/components/ui/why-source-available-matters';

interface SixthScreenProps {
  lang?: string;
}

export default function SixthScreen({ lang = 'en' }: SixthScreenProps) {
  return (
    <div className="relative">
      {/* Background Light Image */}
      <div
        className="pointer-events-none absolute z-50 left-1/2 -translate-x-1/2 w-screen"
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
        className="pointer-events-none absolute z-50 left-1/2 -translate-x-1/2 w-screen"
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
        className="pointer-events-none absolute z-40 right-0 w-[50vw]"
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
