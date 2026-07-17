import { PageTopRays } from '@/new-components/SideRays';
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
      <PageTopRays />

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
