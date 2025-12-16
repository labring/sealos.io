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
    <section className="container-compact border-b pb-16">
      <div className="space-y-8">
        <div className="space-y-3">
          <h3 className="text-2xl font-medium">
            {firstPlatform.name} Overview
          </h3>
          <p className="text-muted-foreground mt-5 text-sm leading-relaxed">
            {firstPlatform.content.overview}
          </p>
        </div>
        <div className="space-y-3">
          <h3 className="text-2xl font-medium">
            {secondPlatform.name} Overview
          </h3>
          <p className="text-muted-foreground mt-5 text-sm leading-relaxed">
            {secondPlatform.content.overview}
          </p>
        </div>
      </div>
    </section>
  );
}
