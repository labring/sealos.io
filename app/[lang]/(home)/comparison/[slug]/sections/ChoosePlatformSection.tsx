'use client';

import { GradientText } from '@/new-components/GradientText';
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
    <section className="container mx-auto border-t px-4 py-32">
      <div className="mb-16">
        <h2 className="mb-6 text-center text-3xl font-semibold">
          <GradientText>
            Choose the Right Platform for Your Use Case
          </GradientText>
        </h2>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="border-gradient rounded-2xl bg-zinc-900 [--border-gradient-bg-from:var(--color-zinc-900)] [--border-gradient-bg-position:to_bottom_in_oklab] [--border-gradient-bg-to:var(--color-zinc-900)] [--border-gradient-from:#2563eb] [--border-gradient-position:200deg_in_oklab] [--border-gradient-to:#cfcfcf]">
          <h3 className="flex items-center gap-2 px-8 py-4 text-lg font-medium">
            <div className="size-6">{firstPlatform.icon}</div>
            Choose {firstPlatform.name} if you need:
          </h3>
          <div className="space-y-6 rounded-2xl border-t bg-zinc-950 p-8 text-sm">
            {firstPlatform.content.guidance.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="text-muted-foreground size-4">{item.icon}</div>
                <LightMarkdown>{String(item.content)}</LightMarkdown>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border bg-zinc-900">
          <h3 className="flex items-center gap-2 px-8 py-4 text-lg font-medium">
            <div className="size-6">{secondPlatform.icon}</div>
            Choose {secondPlatform.name} if you need:
          </h3>
          <div className="space-y-6 rounded-2xl border-t bg-zinc-950 p-8 text-sm">
            {secondPlatform.content.guidance.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="text-muted-foreground size-4">{item.icon}</div>
                <LightMarkdown>{String(item.content)}</LightMarkdown>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
