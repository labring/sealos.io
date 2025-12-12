'use client';

import { ComparisonConfig } from '../../config/platforms';
import { LightMarkdown } from '../components/LightMarkdown';

interface ChoosePlatformSectionProps {
  firstPlatform: ComparisonConfig;
  secondPlatform: ComparisonConfig;
}

export function ChoosePlatformSection({
  firstPlatform,
  secondPlatform,
}: ChoosePlatformSectionProps) {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-12">
        <h2 className="mb-6 text-center text-3xl font-bold">
          Choose the Right Platform for Your Use Case
        </h2>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">
            Choose {firstPlatform.name} if you need:
          </h3>
          <div className="space-y-4">
            {firstPlatform.content.guidance.map((item, index) => (
              <div key={index} className="flex gap-3">
                <div className="mt-0.5 shrink-0 text-zinc-400">{item.icon}</div>
                <div className="flex-1">
                  <LightMarkdown>{String(item.content)}</LightMarkdown>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold">
            {secondPlatform.name} might be better if you:
          </h3>
          <div className="space-y-4">
            {secondPlatform.content.guidance.map((item, index) => (
              <div key={index} className="flex gap-3">
                <div className="mt-0.5 shrink-0 text-zinc-400">{item.icon}</div>
                <div className="flex-1">
                  <LightMarkdown>{String(item.content)}</LightMarkdown>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
