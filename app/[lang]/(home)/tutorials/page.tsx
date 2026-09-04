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
import { ArrowRight, BookOpen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Fragment } from 'react';
import { TutorialRequestGuideLink } from './TutorialRequestGuideLink';

const TUTORIALS_PATHNAME = '/tutorials';
const TUTORIALS_PAGE_TITLE = 'Sealos Deployment Tutorials';
const TUTORIALS_PAGE_DESCRIPTION =
  'Follow published Sealos deployment tutorials built from verified repositories and live application evidence, starting with Django.';
const DJANGO_TUTORIAL_PATH = '/tutorials/django/deploy/';

const DJANGO_GUIDE_CHAPTERS = [
  {
    step: '01',
    title: 'Prepare Django',
    detail: 'Gunicorn and WhiteNoise',
    hash: '#prepare-django-for-production',
    badge: 'APP',
    serviceName: 'django-tasks-tcavnrnb',
    serviceType: 'Container',
    status: 'Running',
    rows: [
      ['Image', 'ghcr.io/yangchuansheng/sealos-django'],
      ['Runtime', 'Gunicorn · WhiteNoise'],
    ],
    metrics: ['CPU 1%', 'RAM 87%', 'Replicas 1'],
  },
  {
    step: '02',
    title: 'Deploy with Skills',
    detail: 'Application and database',
    hash: '#deploy-with-sealos-skills',
    badge: 'DB',
    serviceName: 'django-tasks-tcavnrnb-pg',
    serviceType: 'Database PostgreSQL',
    status: 'Running',
    rows: [
      ['Private connection', '••••••••••'],
      ['Public connection', 'Disabled'],
    ],
    metrics: ['CPU 1%', 'RAM 26%', 'Disk 8%'],
  },
  {
    step: '03',
    title: 'Verify the live app',
    detail: 'HTTPS create/read proof',
    hash: '#verify-the-live-django-application',
    badge: 'URL',
    serviceName: 'django-tasks-mpbrofzu.us...',
    serviceType: 'Access domain',
    status: 'Reachable',
    rows: [
      ['Public address', 'https://django-tasks-mpbrofzu.us...'],
      ['Response', '200 OK · HTTPS'],
    ],
    metrics: ['TLS valid', 'GET 200', 'Create/read'],
  },
] as const;

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
    <article>
      <h2 id="published-tutorials-heading" className="sr-only">
        Published tutorial evidence
      </h2>

      {isDjangoGuide ? (
        <figure>
          <div className="mb-6">
            <figcaption>
              <span className="block text-2xl font-semibold tracking-tight text-white">
                Three checks. One running application.
              </span>
              <span className="mt-1 block text-sm text-zinc-400">
                Each chapter resolves to visible output inside the Sealos
                project.
              </span>
            </figcaption>
          </div>

          <h2 id="inside-guide-heading" className="sr-only">
            Guide chapters and deployment evidence
          </h2>
          <div className="overflow-hidden rounded-sm ring-1 ring-white/15">
            <div className="hidden grid-cols-[1fr_auto_1fr_auto_1fr] items-center bg-[#0d111b] px-5 py-4 text-sm md:grid">
              {DJANGO_GUIDE_CHAPTERS.map((chapter, index) => (
                <Fragment key={chapter.step}>
                  <span className="flex items-center justify-center gap-3 font-medium text-zinc-100">
                    <span className="text-[#5f96ff]">{chapter.step}</span>
                    {chapter.serviceType}
                  </span>
                  {index < DJANGO_GUIDE_CHAPTERS.length - 1 && (
                    <span className="text-[#5f96ff]" aria-hidden="true">
                      →
                    </span>
                  )}
                </Fragment>
              ))}
            </div>
            <ol
              className="grid bg-white/10 md:grid-cols-3 md:gap-px"
              aria-labelledby="inside-guide-heading"
            >
              {DJANGO_GUIDE_CHAPTERS.map((chapter) => (
                <li key={chapter.step} className="bg-[#070707]">
                  <Link
                    href={`${tutorial.url}${chapter.hash}`}
                    className="group block focus-visible:ring-2 focus-visible:ring-[#5f96ff] focus-visible:outline-none focus-visible:ring-inset"
                  >
                    <div className="flex min-h-[19rem] flex-col bg-[#0b101a] p-5">
                      <div className="flex items-center gap-3">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-[#14213a] font-mono text-[0.6875rem] font-semibold text-[#5f96ff]">
                          {chapter.badge}
                        </span>
                        <span className="min-w-0">
                          <strong className="block truncate font-mono text-sm font-medium text-zinc-100">
                            {chapter.serviceName}
                          </strong>
                          <span className="mt-1 block text-sm text-zinc-400">
                            {chapter.serviceType}
                          </span>
                        </span>
                        <span
                          className="ml-auto text-zinc-500"
                          aria-hidden="true"
                        >
                          •••
                        </span>
                      </div>

                      <dl className="mt-6 grid gap-3">
                        {chapter.rows.map(([label, value]) => (
                          <div key={label} className="bg-black/25 px-4 py-3">
                            <dt className="text-xs text-zinc-500">{label}</dt>
                            <dd className="mt-2 truncate font-mono text-sm text-zinc-200">
                              {value}
                            </dd>
                          </div>
                        ))}
                      </dl>

                      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                        <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400">
                          <span className="size-2 rounded-full bg-emerald-400" />
                          {chapter.status}
                        </span>
                        <span className="flex flex-wrap justify-end gap-3 font-mono text-[0.6875rem] text-zinc-400">
                          {chapter.metrics.map((metric) => (
                            <span key={metric}>{metric}</span>
                          ))}
                        </span>
                      </div>
                    </div>
                    <div className="p-5 md:min-h-40">
                      <span className="text-sm font-medium text-[#5f96ff]">
                        Chapter {chapter.step}
                      </span>
                      <strong className="mt-3 block text-lg font-semibold text-white transition-colors group-hover:text-[#5f96ff]">
                        {chapter.title}
                      </strong>
                      <span className="mt-1 block text-sm text-zinc-400">
                        {chapter.detail}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
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
        <section className="container -mt-24 grid pt-32 pb-12 md:grid-cols-12 md:items-start md:gap-8">
          <div className="md:col-span-8">
            <p className="text-xs font-semibold tracking-[0.18em] text-[#5f96ff] uppercase">
              Sealos deployment field note · 01
            </p>
            <h1
              aria-label="How to Deploy a Django App on Sealos"
              className="mt-5 text-5xl leading-[0.98] font-medium tracking-[-0.045em] text-white md:text-[4rem]"
            >
              <span className="block">How to Deploy a</span>
              <span className="mt-2 block">
                Django App <span className="text-zinc-400">on Sealos</span>
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-300">
              Build a Django 5.2 Task app, prepare Gunicorn, WhiteNoise, and
              PostgreSQL, then deploy it and verify a live create/read flow.
            </p>
            {firstTutorial && (
              <div className="mt-7 flex flex-wrap items-center gap-5">
                <Link
                  href={firstTutorial.url}
                  className="group inline-flex h-11 items-center rounded-sm bg-[#146dff] px-5 text-sm font-semibold whitespace-nowrap text-white transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-[#0f5dd6] focus-visible:ring-2 focus-visible:ring-[#5f96ff] focus-visible:outline-none active:translate-y-0"
                >
                  Read tutorial
                  <ArrowRight
                    size={15}
                    className="ml-3 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
                <span className="inline-flex items-center gap-2 text-sm text-zinc-400">
                  <BookOpen size={14} aria-hidden="true" />
                  {firstTutorial.estimatedReadingTime} · Django · Core
                  deployment
                </span>
              </div>
            )}
          </div>
          <div className="mt-8 md:col-span-4 md:mt-0 md:flex md:self-stretch md:border-l md:border-[#146dff] md:pt-14 md:pl-8">
            <div className="flex flex-col justify-between">
              <div>
                <p className="max-w-sm text-3xl leading-[1.15] font-medium tracking-[-0.03em] text-zinc-200">
                  From working code{' '}
                  <span className="text-[#5f96ff]">to green lights.</span>
                </p>
                <p className="mt-5 text-sm font-medium text-zinc-400">
                  Build → Deploy → Verify
                </p>
              </div>
              <p className="mt-10 flex items-end gap-3">
                <span className="text-5xl leading-none font-medium tracking-[-0.04em] text-[#5f96ff]">
                  03
                </span>
                <span className="max-w-24 text-sm leading-5 text-zinc-400">
                  visible proof points
                </span>
              </p>
            </div>
          </div>
        </section>

        <section
          id="published-tutorials"
          className="container scroll-mt-28 border-t border-white/10 pt-10 pb-12"
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

          <section className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 py-2">
            <h2 className="text-xl font-semibold tracking-tight text-white">
              Missing your stack?
            </h2>
            <p className="text-sm leading-6 text-zinc-400">
              Share the deployment job you need.
            </p>
            <TutorialRequestGuideLink className="group inline-flex h-10 shrink-0 items-center rounded-sm border border-[#146dff]/70 px-4 text-sm font-semibold text-[#5f96ff] transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-[#146dff] hover:bg-[#146dff] hover:text-white focus-visible:ring-2 focus-visible:ring-[#5f96ff] focus-visible:outline-none">
              Request the next field note
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
