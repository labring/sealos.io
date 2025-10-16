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
              x: 0.05,
              y: -0.2,
              angle: 70,
              spread: 115,
              count: 15,
              color: '220, 220, 220',
            },
            {
              x: 0.55,
              y: -0.15,
              angle: 70,
              spread: 105,
              count: 13,
              color: '225, 225, 225',
            },
          ]}
          speed={0.0019}
          maxWidth={90}
          minLength={1100}
          maxLength={2400}
          blur={17}
        />
      </div>

      {/* 顶部渐变遮罩 - 在 GodRays 上方 */}
      <div
        className="pointer-events-none absolute top-0 -z-10 h-96"
        style={{
          left: '50%',
          right: '50%',
          marginLeft: '-50vw',
          marginRight: '-50vw',
          width: '100vw',
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
