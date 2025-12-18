import { GodRays } from '@/new-components/GodRays';
import Image from 'next/image';
import HeaderImage from './assets/header.svg';
import { GradientText } from '@/new-components/GradientText';
import { platforms, getAllPlatformSlugs } from './config/platforms';
import { CompareWithOthersSection } from './[slug]/sections/CompareWithOthersSection';
import { TrySealosButton } from './components/TrySealosButton';
import { generatePageMetadata } from '@/lib/utils/metadata';
import { Metadata } from 'next';

export function generateMetadata(): Metadata {
  return generatePageMetadata({
    title: 'PaaS Platform Comparison',
    description:
      "Compare Sealos with other PaaS platforms. We want you to choose the best platform for you, even if it's not us.",
    pathname: '/comparison',
  });
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
        className="container-compact relative -mt-24 flex flex-col items-center pt-36 pb-20 sm:pt-44"
        role="main"
      >
        <Image
          src={HeaderImage}
          alt=""
          className="h-[9rem] sm:h-[13rem] md:h-[16rem]"
        />

        <h1
          aria-label="PaaS Platform Comparison"
          className="mt-9 mb-6 text-center text-2xl font-medium sm:text-4xl"
        >
          <span>PaaS Platform&nbsp;</span>
          <GradientText>Comparison</GradientText>
        </h1>
        <p className="text-muted-foreground text-center text-xs sm:text-base">
          We want you to choose the best platform for you, even if it's not us.
        </p>

        <TrySealosButton />
      </section>

      {getAllPlatformSlugs().map((platformSlug) => {
        const platform = platforms[platformSlug];
        return (
          <CompareWithOthersSection
            key={platformSlug}
            platform={platform}
            platformSlug={platformSlug}
          />
        );
      })}
    </>
  );
}
