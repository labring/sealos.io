import StructuredDataComponent from '@/components/structured-data';
import { buttonVariants } from '@/components/ui/button';
import type { languagesType } from '@/lib/i18n';
import { cn } from '@/lib/utils';
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
import { PageTopRays } from '@/new-components/SideRays';
import { ArrowRight, BookOpen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { TutorialRequestGuideLink } from './TutorialRequestGuideLink';

const TUTORIALS_PATHNAME = '/tutorials';
const TUTORIALS_PAGE_TITLE = 'Sealos Deployment Tutorials';
const TUTORIALS_PAGE_DESCRIPTION =
  'Follow published Sealos deployment tutorials built from verified repositories and live application evidence, starting with Django.';

const TUTORIALS_PAGE_KEYWORDS = [
  'Sealos tutorials',
  'Django deployment tutorials',
  'deploy Django on Sealos',
  'Django deployment guide',
  'Django 5.2 deployment',
  'Django Gunicorn deployment',
  'Django PostgreSQL deployment',
  'Django WhiteNoise deployment',
  'Sealos Skills',
];

type TutorialCatalogItem = TutorialSummary & {
  image?: string;
};

function TutorialCatalogCard({
  tutorial,
  priorityImage,
}: {
  tutorial: TutorialCatalogItem;
  priorityImage?: boolean;
}) {
  return (
    <Link
      href={tutorial.url}
      className="group text-card-foreground focus-visible:ring-ring border-border bg-card hover:border-primary/50 grid overflow-hidden rounded-xl border transition-colors focus-visible:ring-2 focus-visible:outline-none md:grid-cols-12 md:items-center"
    >
      <div className="flex flex-col gap-7 p-6 md:col-span-5 md:p-10">
        <div>
          <h2
            id="published-tutorials-heading"
            className="text-primary text-lg font-semibold tracking-tight"
          >
            Published deployment tutorials
          </h2>
          <p className="text-muted-foreground mt-3 text-sm leading-6">
            Each Core guide takes one technology from a working repository to a
            verified public application on Sealos.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs font-medium">
            <span>{tutorial.framework}</span>
            <span aria-hidden="true">·</span>
            <span>
              {tutorial.stage === 'beginner'
                ? 'Core deployment'
                : tutorial.stageLabel}
            </span>
          </div>
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            <GradientText>
              <span className="text-foreground transition-colors group-hover:text-transparent">
                {tutorial.title}
              </span>
            </GradientText>
          </h2>
          <p className="text-foreground/85 text-base leading-7">
            {tutorial.description}
          </p>
        </div>

        <ul className="text-foreground/80 border-border/80 divide-border/80 grid list-none divide-y border-y text-sm leading-6">
          <li className="py-2.5 first:pt-0">
            Deploy the Django app with Gunicorn and WhiteNoise.
          </li>
          <li className="py-2.5">
            Connect PostgreSQL to the running application.
          </li>
          <li className="py-2.5 last:pb-0">
            Verify the live create/read flow on Sealos.
          </li>
        </ul>

        <div className="text-muted-foreground border-border/80 mt-auto flex flex-wrap items-center justify-between gap-3 border-t pt-5 text-sm">
          {tutorial.estimatedReadingTime && (
            <span className="inline-flex items-center gap-2">
              <BookOpen size={14} aria-hidden="true" />
              {tutorial.estimatedReadingTime}
            </span>
          )}
          <span className="bg-primary text-primary-foreground group-hover:bg-primary/90 inline-flex items-center rounded-md px-4 py-2 font-semibold transition-colors">
            Read tutorial
            <ArrowRight
              size={15}
              className="ml-2 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </span>
        </div>
      </div>

      {tutorial.image && (
        <figure className="border-border/80 order-first w-full border-b bg-zinc-950/80 p-3 md:order-none md:col-span-7 md:border-b-0 md:border-l">
          <div className="relative aspect-video w-full overflow-hidden rounded-[0.375rem]">
            <Image
              src={tutorial.image}
              alt={`${tutorial.title} deployment result`}
              className="h-full w-full scale-[1.2] object-cover object-center brightness-[0.9] contrast-[1.03]"
              fill
              priority={priorityImage}
              sizes="(max-width: 760px) 90vw, 55vw"
            />
          </div>
          <figcaption className="text-muted-foreground px-1 pt-3 pb-1 text-xs leading-5">
            Verified public application on Sealos.
          </figcaption>
        </figure>
      )}
    </Link>
  );
}

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
  const tutorials = getSortedTutorials().map((page) => ({
    ...toTutorialSummary(page),
    image: page.data.image,
  }));
  const firstTutorial = tutorials[0];
  const structuredData = getTutorialsStructuredData(tutorials);
  const shouldRenderStructuredData = params.lang === 'en';

  return (
    <>
      {shouldRenderStructuredData && (
        <StructuredDataComponent data={structuredData} />
      )}

      <PageTopRays />

      <main>
        <section className="container -mt-24 pt-32 pb-6">
          <h1
            aria-label="Sealos tutorials for app deployment"
            className="text-foreground max-w-5xl text-5xl font-medium tracking-tight md:text-6xl"
          >
            <span>Sealos tutorials for </span>
            <GradientText>app deployment</GradientText>
          </h1>
          <p className="text-muted-foreground mt-5 max-w-2xl text-base leading-7">
            Follow complete deployment guides built from verified repositories
            and live application evidence.
          </p>
        </section>

        <section
          id="published-tutorials"
          className="container scroll-mt-28 pb-2"
          aria-labelledby="published-tutorials-heading"
        >
          {firstTutorial && (
            <TutorialCatalogCard tutorial={firstTutorial} priorityImage />
          )}

          {tutorials.length > 1 && (
            <div className="mt-6 grid gap-4">
              {tutorials.slice(1).map((tutorial) => (
                <Link
                  key={tutorial.slug}
                  href={tutorial.url}
                  className="group text-card-foreground focus-visible:ring-ring border-border bg-card hover:border-primary/50 grid overflow-hidden rounded-xl border transition-colors focus-visible:ring-2 focus-visible:outline-none md:grid-cols-[minmax(0,1fr)_18rem]"
                >
                  <div className="flex flex-col gap-2 p-5">
                    <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs font-medium">
                      <span>{tutorial.framework}</span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {tutorial.stage === 'beginner'
                          ? 'Core deployment'
                          : tutorial.stageLabel}
                      </span>
                    </div>
                    <h2 className="text-lg font-semibold tracking-tight">
                      <GradientText>
                        <span className="text-foreground transition-colors group-hover:text-transparent">
                          {tutorial.title}
                        </span>
                      </GradientText>
                    </h2>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-6">
                      {tutorial.description}
                    </p>
                    {tutorial.estimatedReadingTime && (
                      <span className="text-muted-foreground mt-auto inline-flex items-center gap-2 text-sm">
                        <BookOpen size={14} aria-hidden="true" />
                        {tutorial.estimatedReadingTime}
                      </span>
                    )}
                  </div>
                  {tutorial.image && (
                    <div className="border-border relative aspect-video w-full overflow-hidden border-t md:border-t-0 md:border-l">
                      <Image
                        src={tutorial.image}
                        alt={`${tutorial.title} deployment result`}
                        className="h-full w-full object-cover"
                        fill
                        sizes="(max-width: 760px) 90vw, 18rem"
                      />
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}

          <section className="border-border mt-20 flex flex-col gap-6 border-t pt-10 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-foreground text-2xl font-semibold tracking-tight">
                Need a guide for your stack?
              </h2>
              <p className="text-muted-foreground mt-3 text-sm leading-6">
                Share the framework or runtime and the deployment job you need.
                Requests help prioritize the next qualified Core tutorial.
              </p>
            </div>
            <TutorialRequestGuideLink
              className={cn(
                buttonVariants({ variant: 'landing-primary' }),
                'h-10 shrink-0 px-5',
              )}
            >
              Request a tutorial
              <ArrowRight size={16} className="ml-2" aria-hidden="true" />
            </TutorialRequestGuideLink>
          </section>
        </section>
      </main>
    </>
  );
}
