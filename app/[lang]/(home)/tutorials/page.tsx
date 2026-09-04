import StructuredDataComponent from '@/components/structured-data';
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
import { ArrowRight, BookOpen, Database, Globe2, Server } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { TutorialRequestGuideLink } from './TutorialRequestGuideLink';

const TUTORIALS_PATHNAME = '/tutorials';
const TUTORIALS_PAGE_TITLE = 'Sealos Deployment Tutorials';
const TUTORIALS_PAGE_DESCRIPTION =
  'Follow published Sealos deployment tutorials built from verified repositories and live application evidence, starting with Django.';
const DJANGO_TUTORIAL_PATH = '/tutorials/django/deploy/';

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
  const isDjangoGuide = tutorial.url === DJANGO_TUTORIAL_PATH;

  return (
    <article className="border-t border-white/10 pt-8">
      <div className="grid gap-8 md:grid-cols-12 md:items-end">
        <div className="md:col-span-2 md:self-start">
          <h2
            id="published-tutorials-heading"
            className="text-sm font-semibold text-[#5f96ff]"
          >
            Guide 01
          </h2>
          <p className="mt-2 text-sm text-zinc-500">Published tutorial</p>
        </div>

        <div className="md:col-span-7">
          <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-zinc-400">
            <span>{tutorial.framework}</span>
            <span aria-hidden="true">/</span>
            <span>
              {tutorial.stage === 'beginner'
                ? 'Core deployment'
                : tutorial.stageLabel}
            </span>
          </div>
          <Link
            href={tutorial.url}
            className="group mt-4 block rounded-sm focus-visible:ring-2 focus-visible:ring-[#5f96ff] focus-visible:outline-none"
          >
            <h3 className="text-3xl leading-[1.08] font-semibold tracking-[-0.035em] text-white md:text-4xl">
              {isDjangoGuide ? (
                <>
                  <span className="block">How to Deploy a Django App</span>
                  <span className="mt-1 block text-zinc-400 transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:text-[#5f96ff]">
                    on Sealos
                  </span>
                </>
              ) : (
                tutorial.title
              )}
            </h3>
          </Link>
          <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-400">
            {tutorial.description}
          </p>
        </div>

        <div className="flex items-center gap-5 md:col-span-3 md:flex-col md:items-end">
          {tutorial.estimatedReadingTime && (
            <span className="inline-flex items-center gap-2 text-sm text-zinc-500">
              <BookOpen size={14} aria-hidden="true" />
              {tutorial.estimatedReadingTime}
            </span>
          )}
          <Link
            href={tutorial.url}
            className="group inline-flex h-11 items-center rounded-full bg-[#146dff] py-1 pr-1 pl-5 text-sm font-semibold whitespace-nowrap text-white transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-[#0f5dd6] focus-visible:ring-2 focus-visible:ring-[#5f96ff] focus-visible:outline-none active:translate-y-0"
          >
            Read tutorial
            <span className="ml-3 flex size-9 items-center justify-center rounded-full bg-white/15 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5">
              <ArrowRight size={15} aria-hidden="true" />
            </span>
          </Link>
        </div>
      </div>

      {isDjangoGuide ? (
        <figure className="relative mt-10 flex min-h-[34rem] w-full flex-col overflow-hidden rounded-xl bg-[#080a0f] p-6 ring-1 ring-white/10 md:min-h-[21rem] md:p-7">
          <figcaption className="flex items-center justify-between gap-4 text-sm font-medium text-zinc-200">
            <span>Verified deployment topology</span>
            <span className="inline-flex items-center gap-2 text-xs text-emerald-400">
              <span className="size-2 rounded-full bg-emerald-400" />
              Healthy
            </span>
          </figcaption>

          <svg
            viewBox="0 0 1248 336"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-x-7 top-16 hidden h-[calc(100%-5rem)] w-[calc(100%-3.5rem)] md:block"
            aria-hidden="true"
          >
            <path
              d="M302 154 C 392 154, 414 168, 486 168"
              fill="none"
              stroke="#146dff"
              strokeWidth="1.75"
              strokeDasharray="6 7"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M762 168 C 850 168, 866 192, 948 192"
              fill="none"
              stroke="#146dff"
              strokeWidth="1.75"
              strokeDasharray="6 7"
              vectorEffect="non-scaling-stroke"
            />
            <circle cx="302" cy="154" r="4" fill="#146dff" />
            <circle cx="486" cy="168" r="4" fill="#146dff" />
            <circle cx="762" cy="168" r="4" fill="#146dff" />
            <circle cx="948" cy="192" r="4" fill="#146dff" />
          </svg>

          <div className="relative mt-16 flex items-center gap-4 md:absolute md:top-[36%] md:left-[8%] md:mt-0 md:w-[21%]">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[#146dff]/45 text-[#5f96ff]">
              <Globe2 size={19} aria-hidden="true" />
            </span>
            <span>
              <strong className="block text-base font-semibold text-white">
                Public access
              </strong>
              <span className="mt-1 block text-sm text-zinc-400">
                Live HTTPS endpoint
              </span>
            </span>
          </div>

          <div className="relative mt-8 rounded-lg border border-[#146dff]/55 bg-[#101722] p-5 md:absolute md:top-[29%] md:left-1/2 md:mt-0 md:w-[24%] md:-translate-x-1/2">
            <div className="flex items-center justify-between gap-3">
              <span className="flex size-10 items-center justify-center rounded-md bg-[#146dff] text-white">
                <Server size={19} aria-hidden="true" />
              </span>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400">
                <span className="size-2 rounded-full bg-emerald-400" />
                Running
              </span>
            </div>
            <strong className="mt-6 block text-xl font-semibold text-white">
              Django app
            </strong>
            <span className="mt-1 block text-sm text-zinc-400">
              Gunicorn + WhiteNoise
            </span>
          </div>

          <div className="relative mt-8 flex items-center gap-4 md:absolute md:right-[8%] md:bottom-[23%] md:mt-0 md:w-[21%]">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[#146dff]/45 text-[#5f96ff]">
              <Database size={19} aria-hidden="true" />
            </span>
            <span>
              <strong className="block text-base font-semibold text-white">
                PostgreSQL
              </strong>
              <span className="mt-1 block text-sm text-zinc-400">
                Private database
              </span>
              <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                Running
              </span>
            </span>
          </div>
        </figure>
      ) : (
        tutorial.image && (
          <figure className="mt-10 overflow-hidden rounded-xl bg-zinc-950 p-2 ring-1 ring-white/10">
            <div className="relative aspect-video w-full overflow-hidden rounded-md">
              <Image
                src={tutorial.image}
                alt={`${tutorial.title} deployment result`}
                className="h-full w-full object-cover object-center"
                fill
                priority={priorityImage}
                quality={90}
                sizes="(max-width: 760px) 90vw, 55vw"
              />
            </div>
          </figure>
        )
      )}
    </article>
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

      <main>
        <section className="container -mt-24 pt-32 pb-10">
          <p className="text-xs font-semibold tracking-[0.18em] text-[#5f96ff] uppercase">
            Deployment field notes
          </p>
          <h1
            aria-label="Deployment guides, verified end to end"
            className="mt-5 max-w-5xl text-5xl leading-[0.98] font-medium tracking-[-0.045em] text-white md:text-7xl"
          >
            <span className="block">Deployment guides,</span>
            <span className="mt-2 block text-zinc-400">
              verified end to end.
            </span>
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-7 text-zinc-400">
            Sealos tutorials trace every step from a working repository to a
            healthy public application, beginning with Django.
          </p>
        </section>

        <section
          id="published-tutorials"
          className="container scroll-mt-28 pb-12"
          aria-labelledby="published-tutorials-heading"
        >
          {firstTutorial && (
            <>
              <TutorialCatalogCard tutorial={firstTutorial} priorityImage />
              <section className="mt-12" aria-labelledby="inside-guide-heading">
                <h2
                  id="inside-guide-heading"
                  className="text-xl font-semibold tracking-tight text-white"
                >
                  Guide chapters
                </h2>
                <div className="mt-6 grid gap-8 md:grid-cols-3">
                  <Link
                    href={`${firstTutorial.url}#prepare-django-for-production`}
                    className="group flex flex-col justify-center border-t border-white/10 pt-5 focus-visible:ring-2 focus-visible:ring-[#5f96ff] focus-visible:outline-none"
                  >
                    <span className="text-2xl leading-none font-medium text-[#146dff]">
                      01
                    </span>
                    <h3 className="text-foreground group-hover:text-primary mt-4 font-semibold">
                      Prepare Django for production
                    </h3>
                    <p className="text-muted-foreground mt-2 text-sm leading-5">
                      Configure Gunicorn and WhiteNoise for deployment.
                    </p>
                  </Link>
                  <Link
                    href={`${firstTutorial.url}#deploy-with-sealos-skills`}
                    className="group flex flex-col justify-center border-t border-white/10 pt-5 focus-visible:ring-2 focus-visible:ring-[#5f96ff] focus-visible:outline-none"
                  >
                    <span className="text-2xl leading-none font-medium text-[#146dff]">
                      02
                    </span>
                    <h3 className="text-foreground group-hover:text-primary mt-4 font-semibold">
                      Deploy with Sealos Skills
                    </h3>
                    <p className="text-muted-foreground mt-2 text-sm leading-5">
                      Connect the application, container, and database.
                    </p>
                  </Link>
                  <Link
                    href={`${firstTutorial.url}#verify-the-live-django-application`}
                    className="group flex flex-col justify-center border-t border-white/10 pt-5 focus-visible:ring-2 focus-visible:ring-[#5f96ff] focus-visible:outline-none"
                  >
                    <span className="text-2xl leading-none font-medium text-[#146dff]">
                      03
                    </span>
                    <h3 className="text-foreground group-hover:text-primary mt-4 font-semibold">
                      Verify the live Django application
                    </h3>
                    <p className="text-muted-foreground mt-2 text-sm leading-5">
                      Confirm the HTTPS create/read flow on Sealos.
                    </p>
                  </Link>
                </div>
              </section>
            </>
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
                      <span className="text-foreground group-hover:text-primary transition-colors">
                        {tutorial.title}
                      </span>
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

          <section className="mt-14 flex flex-col gap-5 border-l-2 border-[#146dff] py-2 pl-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <h2 className="text-foreground text-2xl font-semibold tracking-tight">
                Need a guide for your stack?
              </h2>
              <p className="text-muted-foreground mt-3 text-sm leading-6">
                Share the framework or runtime and the deployment job you need.
                Requests help prioritize the next qualified Core tutorial.
              </p>
            </div>
            <TutorialRequestGuideLink className="group inline-flex h-11 shrink-0 items-center text-sm font-semibold text-white transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-[#5f96ff] focus-visible:ring-2 focus-visible:ring-[#5f96ff] focus-visible:outline-none">
              Request a tutorial
              <ArrowRight
                size={16}
                className="ml-3 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1"
                aria-hidden="true"
              />
            </TutorialRequestGuideLink>
          </section>
        </section>
      </main>
    </>
  );
}
