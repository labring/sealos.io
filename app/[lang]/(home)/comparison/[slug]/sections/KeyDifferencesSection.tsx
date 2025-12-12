'use client';

import { ComparisonConfig, DimensionId } from '../../config/platforms';
import { LightMarkdown } from '../components/LightMarkdown';

interface KeyDifferencesSectionProps {
  dimensionId: DimensionId;
  firstPlatform: ComparisonConfig;
  secondPlatform: ComparisonConfig;
}

export function KeyDifferencesSection({
  dimensionId,
  firstPlatform,
  secondPlatform,
}: KeyDifferencesSectionProps) {
  const firstData = firstPlatform.content.dimensions[dimensionId];
  const secondData = secondPlatform.content.dimensions[dimensionId];

  // Skip overview dimension
  if (dimensionId === 'overview') {
    return null;
  }

  // Skip if neither platform has a keyDifference
  if (!firstData.keyDifference && !secondData.keyDifference) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 pb-16">
      <div className="grid gap-6 md:grid-cols-2">
        {firstData.keyDifference && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
            <h3 className="mb-2 text-sm font-semibold">
              {firstData.keyDifference.title}
            </h3>
            <div className="text-sm">
              <LightMarkdown>{firstData.keyDifference.content}</LightMarkdown>
            </div>
          </div>
        )}
        {secondData.keyDifference && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
            <h3 className="mb-2 text-sm font-semibold">
              {secondData.keyDifference.title}
            </h3>
            <div className="text-sm">
              <LightMarkdown>{secondData.keyDifference.content}</LightMarkdown>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
