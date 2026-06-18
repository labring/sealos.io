import StructuredDataComponent from '@/components/structured-data';
import { Button } from '@/components/ui/button';
import type { languagesType } from '@/lib/i18n';
import {
  generatePageMetadata,
  getBaseUrl,
  getPageUrl,
} from '@/lib/utils/metadata';
import {
  generateBreadcrumbSchema,
  type StructuredData,
} from '@/lib/utils/structured-data';
import {
  getSortedTutorials,
  type TutorialSummary,
  toTutorialSummary,
} from '@/lib/utils/tutorial-utils';
import { GradientText } from '@/new-components/GradientText';
import { ArrowRight, BookOpenCheck, Boxes, GitBranch } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  TutorialFrameworkMatrix,
  TutorialRequestPanel,
} from './TutorialFrameworkMatrix';
import {
  TutorialJourneyRail,
  TutorialStatusSummary,
} from './TutorialJourneyRail';
import {
  TUTORIAL_INVENTORY_TOTAL,
  TUTORIAL_STAGES,
} from './tutorial-growth-data';

const TUTORIALS_PATHNAME = '/tutorials';
const TUTORIALS_PAGE_TITLE = 'Next.js Deployment Tutorials';
const TUTORIALS_PAGE_DESCRIPTION =
  'Deploy Next.js on Sealos with step-by-step tutorials for GitHub deploys, PostgreSQL, env vars, domains, monitoring, rollback, and production checks.';

const TUTORIALS_PAGE_KEYWORDS = [
  'Sealos tutorials',
  'Next.js deployment tutorials',
  'Next.js deployment guide',
  'deploy Next.js on Sealos',
  'Sealos Skills',
  'Next.js PostgreSQL deployment',
  'Next.js production deployment',
];

function getTutorialsStructuredData(
  tutorials: TutorialSummary[],
): StructuredData[] {
  const pageUrl = getPageUrl('en', TUTORIALS_PATHNAME);
  const baseUrl = getBaseUrl('en');

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: TUTORIALS_PAGE_TITLE,
      description: TUTORIALS_PAGE_DESCRIPTION,
      url: pageUrl,
      inLanguage: 'en-US',
      isPartOf: {
        '@type': 'WebSite',
        name: 'Sealos',
        url: baseUrl,
      },
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: tutorials.length,
        itemListElement: tutorials.map((tutorial, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: getPageUrl('en', tutorial.url),
          name: tutorial.title,
          description: tutorial.description,
        })),
      },
    },
    generateBreadcrumbSchema(
      [
        { name: 'Home', url: baseUrl },
        { name: 'Tutorials', url: pageUrl },
      ],
      'en',
    ),
  ];
}

export function generateMetadata({
  params,
}: {
  params: { lang: languagesType };
}): Metadata {
  const metadata = generatePageMetadata({
    title: TUTORIALS_PAGE_TITLE,
    description: TUTORIALS_PAGE_DESCRIPTION,
    keywords: TUTORIALS_PAGE_KEYWORDS,
    pathname: TUTORIALS_PATHNAME,
    section: 'Tutorials',
    languageAlternates: false,
  });

  if (params.lang !== 'en') {
    return {
      ...metadata,
      robots: {
        index: false,
        follow: true,
        googleBot: {
          index: false,
          follow: true,
        },
      },
    };
  }

  return metadata;
}

export default function TutorialsPage({
  params,
}: {
  params: { lang: languagesType };
}) {
  const tutorials = getSortedTutorials().map(toTutorialSummary);
  const tutorialBySlug = new Map(
    tutorials.map((tutorial) => [tutorial.slug, tutorial]),
  );
  const firstTutorial = tutorialBySlug.get(TUTORIAL_STAGES[0].availableSlug);
  const structuredData = getTutorialsStructuredData(tutorials);
  const shouldRenderStructuredData = params.lang === 'en';

  return (
    <>
      {shouldRenderStructuredData && (
        <StructuredDataComponent data={structuredData} />
      )}

      <main className="relative -mt-24 overflow-hidden bg-[#020203] pt-28 pb-24 text-white md:pt-28 lg:pt-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(255,255,255,0.09),transparent_26%),radial-gradient(circle_at_78%_8%,rgba(37,99,235,0.12),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.025),transparent_22rem)]" />
        <div className="pointer-events-none absolute top-0 -left-24 h-[38rem] w-[18rem] rotate-[28deg] bg-white/8 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 top-[27rem] h-[28rem] bg-[linear-gradient(180deg,transparent,rgba(39,39,42,0.2),transparent)]" />

        <div className="relative container max-w-7xl">
          <section className="grid min-h-[calc(100dvh-6rem)] gap-10 py-8 lg:min-h-[calc(100dvh-12rem)] lg:grid-cols-[minmax(0,0.92fr)_minmax(360px,0.78fr)] lg:items-center">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex min-h-9 items-center rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-medium text-zinc-200 backdrop-blur-lg">
                Tutorials for real Sealos deployments
              </div>
              <h1 className="text-4xl leading-[1.03] font-semibold tracking-tight text-balance md:text-6xl lg:text-7xl">
                Sealos tutorials for <GradientText>app deployment</GradientText>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-400">
                Start with Next.js, then add PostgreSQL and production checks
                when the app is ready.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  variant="landing-primary"
                  className="min-h-11 rounded-full px-6 transition-transform active:translate-y-px"
                  asChild
                >
                  <Link
                    href={
                      firstTutorial?.url ?? '/tutorials/deploy-nextjs-sealos'
                    }
                  >
                    Start with Next.js
                    <ArrowRight size={16} className="ml-2" aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="min-h-11 rounded-full border-white/10 bg-neutral-900/80 px-6 text-white transition-transform hover:bg-zinc-800 hover:text-white active:translate-y-px"
                  asChild
                >
                  <Link href="#frameworks">View framework paths</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="inset-shadow-bubble relative overflow-hidden rounded-3xl border border-zinc-700 bg-neutral-950 p-3 shadow-[0_30px_110px_rgba(0,0,0,0.45)]">
                <Image
                  src="/images/sealos-skills-page-preview.png"
                  alt="Sealos Skills page showing AI-assisted deployment workflows"
                  width={1440}
                  height={980}
                  priority
                  className="h-auto w-full rounded-2xl border border-zinc-700 bg-neutral-900"
                  sizes="(min-width: 1024px) 42vw, 100vw"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  {
                    label: 'Guides',
                    value: TUTORIAL_INVENTORY_TOTAL,
                    icon: BookOpenCheck,
                  },
                  { label: 'Frameworks', value: 18, icon: Boxes },
                  { label: 'Launch jobs', value: 3, icon: GitBranch },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-zinc-800 bg-white/[0.04] p-4"
                    >
                      <Icon
                        size={17}
                        className="text-neutral-400"
                        aria-hidden="true"
                      />
                      <div className="mt-3 text-2xl font-semibold text-white tabular-nums">
                        {item.value}
                      </div>
                      <div className="mt-1 text-sm text-zinc-400">
                        {item.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <TutorialStatusSummary />
          <TutorialJourneyRail tutorialBySlug={tutorialBySlug} />
          <TutorialFrameworkMatrix />
          <TutorialRequestPanel />
        </div>
      </main>
    </>
  );
}
