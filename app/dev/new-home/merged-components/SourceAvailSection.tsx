'use client';

import Image from 'next/image';
import OSSSection from './OSSSection';
import StatsCards from './StatsCards';
import WhySourceAvailableMatters from './WhySourceAvailableMatters';
import light1 from '../assets/light1.png';
import light2 from '../assets/light2.png';
import light3 from '../assets/light3.png';

interface SourceAvailSectionProps {
  lang?: string;
}

export default function SourceAvailSection({
  lang = 'en',
}: SourceAvailSectionProps) {
  return (
    <div className="relative container">
      {/* Background Light Image */}
      <div
        className="pointer-events-none absolute left-1/2 z-50 w-screen -translate-x-1/2"
        style={{ top: '-114px' }}
      >
        <Image
          src={light1}
          alt=""
          className="h-auto w-full select-none"
          priority
        />
      </div>
      {/* Tertiary Background Light Image (same as light1) */}
      <div
        className="pointer-events-none absolute left-1/2 z-50 w-screen -translate-x-1/2"
        style={{ top: '-114px' }}
      >
        <Image
          src={light3}
          alt=""
          className="h-auto w-full select-none"
          priority
        />
      </div>
      {/* Secondary Background Light Image */}
      <div
        className="pointer-events-none absolute right-0 z-40 w-[50vw]"
        style={{ top: '-114px' }}
      >
        <Image
          src={light2}
          alt=""
          className="h-auto w-full select-none"
          priority
        />
      </div>
      {/* Hero Section */}
      <div className="relative z-30">
        <OSSSection lang={lang} />
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
