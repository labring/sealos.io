'use client';

import OSSSection from './OSSSection';
import StatsCards from './StatsCards';
import WhySourceAvailableMatters from './WhySourceAvailableMatters';
import { GodRays } from '../components/GodRays';

interface SourceAvailSectionProps {
  lang?: string;
}

export default function SourceAvailSection({
  lang = 'en',
}: SourceAvailSectionProps) {
  return (
    <section className="relative z-10 pt-28 pb-32">
      {/* GodRays 效果 - 最底层 */}
      <div className="pointer-events-none absolute inset-0 -z-20">
        <GodRays
          sources={[
            {
              x: 0.4,
              y: -0.2,
              angle: 60,
              spread: 30,
              count: 15,
              color: '220, 220, 220',
            },
            {
              x: 0.85,
              y: -0.15,
              angle: 60,
              spread: 25,
              count: 13,
              color: '225, 225, 225',
            },
          ]}
          speed={0.0019}
          maxWidth={90}
          minLength={1100}
          maxLength={1700}
          blur={17}
        />
      </div>

      {/* 顶部渐变遮罩 - 在 GodRays 上方 */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -z-10 h-96 w-screen -translate-x-1/2"
        style={{
          background:
            'linear-gradient(to bottom, rgba(30, 30, 30, 0.6) 0%, rgba(20, 20, 20, 0.4) 40%, transparent 100%)',
        }}
      />

      <div className="container">
        {/* Hero Section */}
        <div className="relative">
          <OSSSection lang={lang} />
        </div>

        {/* Stats Cards Section (80px gap from hero) */}
        <div className="relative mt-20 w-full">
          <div className="relative w-full">
            <StatsCards />
          </div>
        </div>

        {/* Why Source Available Matters Section */}
        <div className="relative w-full">
          <WhySourceAvailableMatters />
        </div>
      </div>
    </section>
  );
}
