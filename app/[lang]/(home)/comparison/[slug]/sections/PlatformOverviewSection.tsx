'use client';

import { ComparisonConfig } from '../../config/platforms';

interface PlatformOverviewSectionProps {
  firstPlatform: ComparisonConfig;
  secondPlatform: ComparisonConfig;
}

export function PlatformOverviewSection({
  firstPlatform,
  secondPlatform,
}: PlatformOverviewSectionProps) {
  return (
    <section className="container mx-auto px-4 pb-16">
      <div className="space-y-8">
        <div className="space-y-3">
          <h3 className="text-xl font-bold">{firstPlatform.name} Overview</h3>
          <p className="text-muted-foreground leading-relaxed">
            {firstPlatform.content.overview}
          </p>
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-bold">{secondPlatform.name} Overview</h3>
          <p className="text-muted-foreground leading-relaxed">
            {secondPlatform.content.overview}
          </p>
        </div>
      </div>
    </section>
  );
}

