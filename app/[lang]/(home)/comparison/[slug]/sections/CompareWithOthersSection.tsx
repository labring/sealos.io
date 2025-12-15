import Link from 'next/link';
import { FramedText } from '@/new-components/FramedText';
import { GradientText } from '@/new-components/GradientText';
import {
  platforms,
  getAllPlatformSlugs,
  comparePlatforms,
  ComparisonConfig,
} from '../../config/platforms';
import { cn } from '@/lib/utils';

interface CompareWithOthersSectionProps {
  platform: ComparisonConfig;
  platformSlug: keyof typeof platforms;
}

function generateComparisonSlug(
  a: keyof typeof platforms,
  b: keyof typeof platforms,
): string {
  const [first, second] = comparePlatforms(a, b);
  return `${first}-vs-${second}`;
}

export function CompareWithOthersSection({
  platform,
  platformSlug,
}: CompareWithOthersSectionProps) {
  const otherPlatforms = getAllPlatformSlugs().filter(
    (slug) => slug !== platformSlug,
  );

  return (
    <section className="container flex flex-col items-center gap-12 border-t pt-10 pb-14 sm:gap-16 sm:pb-20 md:pt-16 md:pb-24">
      <h2 className="text-muted-foreground flex items-center gap-3 text-xs font-medium sm:text-lg md:text-2xl">
        <span>Compare</span>
        <FramedText className="text-foreground text-sm [--from:var(--color-zinc-500)] [--to:var(--color-zinc-600)] sm:text-xl md:text-2xl">
          {platform.name}
        </FramedText>
        <span>with others</span>
      </h2>

      <div className="flex w-full flex-col gap-3 sm:flex-row sm:gap-8">
        <div className="flex h-fit flex-col items-center gap-3 sm:flex-row sm:gap-8">
          <div className="border-gradient flex size-20 flex-col items-center justify-center gap-2 rounded-2xl [--border-gradient-bg-from:#3C3C3C] [--border-gradient-bg-position:to_bottom_in_oklab] [--border-gradient-bg-to:#1C1C1C] [--border-gradient-from:#6C6C6C] [--border-gradient-position:to_bottom_in_oklab] [--border-gradient-to:#1B1B1B] sm:size-24 md:size-28">
            <div className="flex size-6 items-center justify-center sm:size-8 md:size-12">
              {platform.icon}
            </div>
            <span className="text-xs font-medium sm:text-sm md:text-base">
              {platform.name}
            </span>
          </div>
          <span className="text-sm font-medium md:text-xl">VS.</span>
        </div>
        <div className="flex w-full flex-wrap gap-3 sm:gap-8">
          {otherPlatforms
            .map((otherSlug) => {
              const otherPlatform = platforms[otherSlug];
              const slug = generateComparisonSlug(platformSlug, otherSlug);

              return {
                slug,
                name: otherPlatform.name,
                icon: otherPlatform.icon,
                order: otherPlatform.order,
                slugKey: otherSlug,
              };
            })
            .sort((a, b) => {
              if (a.order !== b.order) {
                return a.order - b.order;
              }
              return a.slugKey.localeCompare(b.slugKey);
            })
            .map(({ slug, name, icon }) => (
              <Link
                key={slug}
                href={`/comparison/${slug}`}
                className={cn(
                  'group border-gradient flex size-20 flex-col items-center justify-center gap-2 rounded-2xl transition-all sm:size-24 md:size-28',
                  '[--border-gradient-bg-position:to_bottom_in_oklab] [--border-gradient-position:to_right_in_oklab]',
                  '[--border-gradient-bg-from:var(--color-zinc-950)] [--border-gradient-bg-to:var(--color-zinc-950)]',
                  '[--border-gradient-from:var(--color-border)] [--border-gradient-to:var(--color-border)]',
                  'hover:[--border-gradient-bg-from:color-mix(in_oklab,var(--color-white)_10%,var(--color-zinc-950))]',
                  'hover:[--border-gradient-bg-to:color-mix(in_oklab,var(--color-white)_10%,var(--color-zinc-950))]',
                  'hover:[--border-gradient-from:var(--color-white)] hover:[--border-gradient-to:var(--color-blue-600)]',
                )}
              >
                <div className="flex size-6 items-center justify-center sm:size-8 md:size-12">
                  {icon}
                </div>
                <GradientText className="from-foreground to-foreground text-xs font-medium transition-colors group-hover:to-blue-600 sm:text-sm md:text-base">
                  {name}
                </GradientText>
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
}
