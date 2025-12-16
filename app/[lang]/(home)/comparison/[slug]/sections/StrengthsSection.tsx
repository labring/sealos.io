'use client';

import { GradientLucideIcon } from '@/new-components/GradientLucideIcon';

import {
  ComparisonConfig,
  DimensionId,
  DIMENSIONS,
} from '../../config/platforms';
import { LightMarkdown } from '../components/LightMarkdown';
import { Sparkles } from 'lucide-react';

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
    <section className="container-compact pb-6">
      <div className="mx-auto flex w-fit items-center gap-1.5 rounded-full border border-white/5 bg-white/10 px-3 py-1.5 text-center text-sm">
        <GradientLucideIcon Icon={Sparkles} className="size-4" />
        In-depth Analysis
      </div>

      <h2 className="mt-4 mb-12 text-center text-2xl font-medium">
        {DIMENSIONS[dimensionId].title}: Two Powerful Approaches
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="border-gradient rounded-2xl [--border-gradient-bg-from:var(--color-neutral-950)] [--border-gradient-bg-position:to_bottom_in_oklab] [--border-gradient-bg-to:var(--color-neutral-950)] [--border-gradient-from:#394C85] [--border-gradient-position:to_bottom_in_oklab] [--border-gradient-to:#3F3F46]">
          <h3 className="mb-4 flex items-center gap-2 border-b px-8 py-4 text-lg font-medium">
            <div className="size-6">{firstPlatform.icon}</div>
            Where {firstPlatform.name} Excels
          </h3>
          <div className="space-y-6 p-8 pt-6">
            {firstData.strengths.map((strength, index) => (
              <div key={index} className="flex flex-col gap-2">
                <h4 className="text-primary flex items-center gap-2">
                  <div className="size-4">{strength.icon}</div>
                  {strength.title}
                </h4>
                <LightMarkdown className="flex-1 text-sm">
                  {strength.content}
                </LightMarkdown>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border">
          <h3 className="mb-4 flex items-center gap-2 border-b px-8 py-4 text-lg font-medium">
            <div className="size-6">{secondPlatform.icon}</div>
            Where {secondPlatform.name} Excels
          </h3>
          <div className="space-y-6 p-8 pt-6">
            {secondData.strengths.map((strength, index) => (
              <div key={index} className="flex flex-col gap-2">
                <h4 className="text-primary flex items-center gap-2">
                  <div className="size-4">{strength.icon}</div>
                  {strength.title}
                </h4>
                <LightMarkdown className="flex-1 text-sm">
                  {strength.content}
                </LightMarkdown>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
