import { GodRays } from '@/new-components/GodRays';
import Image from 'next/image';
import Link from 'next/link';
import HeaderImage from './assets/header.svg';
import { GradientText } from '@/new-components/GradientText';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon } from 'lucide-react';
import { FramedText } from '../../../../new-components/FramedText';
import {
  platforms,
  getAllPlatformSlugs,
  comparePlatforms,
} from './config/platforms';

function generateComparisonSlug(
  a: keyof typeof platforms,
  b: keyof typeof platforms,
): string {
  const [first, second] = comparePlatforms(a, b);
  return `${first}-vs-${second}`;
}

export default async function ComparisonPage() {
  return (
    <>
      <GodRays
        sources={[
          {
            x: -0.05,
            y: -0.05,
            angle: 60,
            spread: 20,
            count: 12,
            color: '220, 220, 220',
            opacityMin: 0.24,
            opacityMax: 0.25,
            minWidth: 120,
            maxWidth: 180,
          },
          {
            x: -0.05,
            y: -0.05,
            angle: 60,
            spread: 8,
            count: 6,
            color: '255, 255, 255',
            opacityMin: 0.89,
            opacityMax: 0.9,
            minWidth: 12,
            maxWidth: 24,
          },
          {
            x: 0.25,
            y: -0.06,
            angle: 50,
            spread: 20,
            count: 6,
            color: '180, 180, 180',
            opacityMin: 0.14,
            opacityMax: 0.15,
            minWidth: 60,
            maxWidth: 120,
          },
        ]}
        speed={0.0}
        maxWidth={48}
        minLength={1200}
        maxLength={2000}
        blur={8}
      />

      <section
        className="relative container -mt-24 flex flex-col items-center pt-44 pb-18"
        role="main"
      >
        <Image src={HeaderImage} alt="" className="h-[16rem]" />

        <h1
          aria-label="PaaS Platform Comparison"
          className="mt-9 mb-6 text-center text-3xl font-medium sm:text-5xl"
        >
          <span>PaaS Platform&nbsp;</span>
          <GradientText>Comparison</GradientText>
        </h1>
        <p className="text-muted-foreground text-center">
          We want you to choose the best platform for you, even if it's not us.
        </p>

        <Button variant="landing-primary" className="mt-10 h-10 w-fit gap-2">
          <span>Try Sealos for free</span>
          <ArrowRightIcon size={16} />
        </Button>
      </section>

      {getAllPlatformSlugs().map((platformSlug) => {
        const platform = platforms[platformSlug];
        const otherPlatforms = getAllPlatformSlugs().filter(
          (slug) => slug !== platformSlug,
        );

        return (
          <section
            key={platformSlug}
            className="container flex flex-col items-center gap-16 border-t pt-16 pb-24"
          >
            <h2 className="text-muted-foreground flex items-center gap-3 text-2xl font-medium">
              <span>Compare</span>
              <FramedText className="text-foreground [--from:var(--color-zinc-500)] [--to:var(--color-zinc-600)]">
                {platform.name}
              </FramedText>
              <span>with others</span>
            </h2>

            <div className="flex w-full gap-8">
              <div className="flex h-fit items-center gap-8">
                <div className="border-gradient flex size-28 flex-col items-center justify-center gap-2 rounded-2xl [--border-gradient-bg-from:#3C3C3C] [--border-gradient-bg-position:to_bottom_in_oklab] [--border-gradient-bg-to:#1C1C1C] [--border-gradient-from:#6C6C6C] [--border-gradient-position:to_bottom_in_oklab] [--border-gradient-to:#1B1B1B]">
                  <div className="flex size-12 items-center justify-center">
                    {platform.icon}
                  </div>
                  <span className="font-medium">{platform.name}</span>
                </div>
                <span className="text-xl font-medium">VS.</span>
              </div>
              <div className="flex w-full flex-wrap gap-8">
                {otherPlatforms
                  .map((otherSlug) => {
                    const otherPlatform = platforms[otherSlug];
                    const slug = generateComparisonSlug(
                      platformSlug,
                      otherSlug,
                    );

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
                      className="group border-gradient flex size-28 flex-col items-center justify-center gap-2 rounded-2xl transition-all [--border-gradient-bg-from:var(--color-zinc-950)] [--border-gradient-bg-position:to_bottom_in_oklab] [--border-gradient-bg-to:var(--color-zinc-950)] [--border-gradient-from:var(--color-border)] [--border-gradient-position:to_right_in_oklab] [--border-gradient-to:var(--color-border)] hover:[--border-gradient-from:var(--color-white)] hover:[--border-gradient-to:var(--color-blue-600)]"
                    >
                      <div className="flex size-12 items-center justify-center">
                        {icon}
                      </div>
                      <GradientText className="from-foreground to-foreground font-medium transition-colors group-hover:to-blue-600">
                        {name}
                      </GradientText>
                    </Link>
                  ))}
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
