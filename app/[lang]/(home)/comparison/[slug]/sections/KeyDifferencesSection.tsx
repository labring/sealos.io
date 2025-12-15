'use client';

import { GradientText } from '@/new-components/GradientText';
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
      <div className="border-gradient rounded-2xl [--border-gradient-bg-from:var(--color-zinc-900)] [--border-gradient-bg-position:to_bottom_in_oklab] [--border-gradient-bg-to:var(--color-zinc-900)] [--border-gradient-from:#2563eb] [--border-gradient-position:200deg_in_oklab] [--border-gradient-to:#cfcfcf]">
        <h3 className="my-2 text-center text-lg font-medium">
          <GradientText>The Key Difference</GradientText>
        </h3>

        <div className="flex gap-6 rounded-2xl bg-zinc-950 p-8">
          {firstData.keyDifference && (
            <div>
              <h3 className="mb-2 flex items-center gap-2">
                <div className="size-5">{firstPlatform.icon}</div>
                {firstData.keyDifference.title}
              </h3>
              <LightMarkdown className="text-sm">
                {firstData.keyDifference.content}
              </LightMarkdown>
            </div>
          )}

          {secondData.keyDifference && (
            <>
              <div className="bg-border min-h-full w-px" />

              {secondData.keyDifference && (
                <div>
                  <h3 className="mb-2 flex items-center gap-2">
                    <div className="size-5">{secondPlatform.icon}</div>
                    {secondData.keyDifference.title}
                  </h3>
                  <LightMarkdown className="text-sm">
                    {secondData.keyDifference.content}
                  </LightMarkdown>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
