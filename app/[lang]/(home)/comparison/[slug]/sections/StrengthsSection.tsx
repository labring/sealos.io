'use client';

import { ComparisonConfig, DimensionId } from '../../config/platforms';
import { LightMarkdown } from '../components/LightMarkdown';

interface StrengthsSectionProps {
  dimensionId: DimensionId;
  firstPlatform: ComparisonConfig;
  secondPlatform: ComparisonConfig;
}

export function StrengthsSection({
  dimensionId,
  firstPlatform,
  secondPlatform,
}: StrengthsSectionProps) {
  const firstData = firstPlatform.content.dimensions[dimensionId];
  const secondData = secondPlatform.content.dimensions[dimensionId];

  // Skip if neither platform has strengths
  if (firstData.strengths.length === 0 && secondData.strengths.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 pb-16">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
          <h3 className="mb-4 text-xl font-semibold">
            {firstPlatform.name} Strengths
          </h3>
          <div className="space-y-4">
            {firstData.strengths.map((strength, index) => (
              <div key={index} className="flex gap-3">
                <div className="mt-0.5 shrink-0 text-zinc-400">
                  {strength.icon}
                </div>
                <div className="flex-1">
                  <h4 className="mb-1 text-sm font-medium text-zinc-200">
                    {strength.title}
                  </h4>
                  <div className="text-sm">
                    <LightMarkdown>{strength.content}</LightMarkdown>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
          <h3 className="mb-4 text-xl font-semibold">
            {secondPlatform.name} Strengths
          </h3>
          <div className="space-y-4">
            {secondData.strengths.map((strength, index) => (
              <div key={index} className="flex gap-3">
                <div className="mt-0.5 shrink-0 text-zinc-400">
                  {strength.icon}
                </div>
                <div className="flex-1">
                  <h4 className="mb-1 text-sm font-medium text-zinc-200">
                    {strength.title}
                  </h4>
                  <div className="text-sm">
                    <LightMarkdown>{strength.content}</LightMarkdown>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
