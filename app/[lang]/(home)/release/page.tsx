import { GradientText } from '@/new-components/GradientText';
import { PageTopRays } from '@/new-components/SideRays';
import { generatePageMetadata } from '@/lib/utils/metadata';
import type { languagesType } from '@/lib/i18n';
import type { Metadata } from 'next';
import ReleasesTimeline from './components/ReleasesTimeline';

export function generateMetadata({
  params,
}: {
  params: { lang: languagesType };
}): Metadata {
  return generatePageMetadata({
    title: 'Product Releases',
    description: 'Follow the latest Sealos product releases and improvements.',
    pathname: '/release',
    lang: params.lang,
  });
}

export default function ReleasePage() {
  return (
    <>
      <PageTopRays />

      <main className="container -mt-24 pt-44 pb-24">
        <header className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-4 text-sm font-medium tracking-[0.18em] text-zinc-400 uppercase">
            Product updates
          </p>
          <h1 className="text-4xl leading-tight font-medium sm:text-5xl">
            <GradientText>Product releases</GradientText>
          </h1>
          <p className="mt-5 text-base leading-7 text-zinc-400 sm:text-lg">
            A clear record of what shipped, why it matters, and where to find
            the details.
          </p>
        </header>

        <ReleasesTimeline />

        <p className="mx-auto mt-16 max-w-2xl text-center text-sm leading-6 text-zinc-500">
          Releases are written for people using Sealos day to day: concise,
          benefit-led, and linked to the source notes for deeper context.
        </p>
      </main>
    </>
  );
}
