'use client';

import HeroSection from '@/components/ui/hero-section';
import StatsCards from '@/components/ui/stats-cards';
import WhySourceAvailableMatters from '@/components/ui/why-source-available-matters';

interface SixthScreenProps {
  lang?: string;
}

export default function SixthScreen({ lang = 'en' }: SixthScreenProps) {
  return (
    <div className="relative">
      {/* Hero Section */}
      <HeroSection lang={lang} />
      
      {/* Stats Cards Section (80px gap from hero) */}
      <div className="relative z-10 bg-black mt-20 w-full">
        <div className="w-full">
          <StatsCards />
        </div>
      </div>

      {/* Why Source Available Matters Section */}
      <div className="w-full">
        <WhySourceAvailableMatters />
      </div>
    </div>
  );
}
