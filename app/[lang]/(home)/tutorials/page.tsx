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
import { TutorialRequestGuideLink } from './TutorialRequestGuideLink';

const TUTORIALS_PATHNAME = '/tutorials';
const TUTORIALS_PAGE_TITLE = 'Sealos Deployment Tutorials';
const TUTORIALS_PAGE_DESCRIPTION =
  'Follow published Sealos deployment tutorials built from verified repositories and live application evidence, starting with Django.';
const DJANGO_TUTORIAL_PATH = '/tutorials/django/deploy/';
const DJANGO_GUIDE_CHAPTERS = [
  {
    phase: 'Configure',
    title: 'Prepare Django for production',
    detail:
      'Set the WSGI entrypoint, static file middleware, and production hosts.',
    hash: '#prepare-django-for-production',
  },
  {
    phase: 'Deploy',
    title: 'Deploy with Sealos Skills',
    detail:
      'Provision the app and PostgreSQL, then release it with Sealos Skills.',
    hash: '#deploy-with-sealos-skills',
  },
  {
    phase: 'Verify',
    title: 'Verify the live application',
    detail:
      'Submit a task over HTTPS and confirm it persists after a fresh load.',
    hash: '#verify-the-live-django-application',
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
        <nav className="text-[#0a0a0a]" aria-label="Guide chapters">
          <div className="grid border-b border-zinc-500/30 lg:grid-cols-[minmax(0,1fr)_26rem]">
            <div className="grid gap-5 bg-[#f2f0e8] py-5 pr-8 lg:grid-cols-[22rem_minmax(0,1fr)] lg:items-center lg:gap-0">
              <div className="lg:pr-8">
                <p className="text-sm font-semibold text-zinc-600">
                  Inside the guide
                </p>
                <h3 className="mt-2 text-4xl leading-none font-medium tracking-[-0.05em]">
                  Three decisive checks.
                </h3>
              </div>
              <div className="lg:border-l lg:border-black/15 lg:pl-7">
                <p className="text-sm leading-6 text-zinc-700">
                  Configure, deploy, then verify the public flow.
                </p>
                <TutorialRequestGuideLink className="group mt-3 inline-flex items-center gap-3 text-sm font-semibold text-zinc-800 focus-visible:ring-2 focus-visible:ring-zinc-800 focus-visible:outline-none">
                  Request the next field note
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </TutorialRequestGuideLink>
              </div>
            </div>

            <div className="bg-[#090909] px-6 py-5 font-mono text-white lg:border-l lg:border-white/15">
              <p className="text-sm font-bold tracking-wide text-zinc-300">
                LIVE DATA PROOF
              </p>
              <p className="mt-3 text-[11px] text-zinc-400">
                ONE RECORD · TWO REQUESTS · FRESH READ
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-[minmax(0,1fr)_26rem]">
            <ol>
              {DJANGO_GUIDE_CHAPTERS.map((chapter, index) => (
                <li
                  key={chapter.hash}
                  className={`lg:min-h-[6.75rem] ${
                    index === 0 ? '' : 'border-t border-zinc-500/30'
                  }`}
                >
                  <Link
                    href={`${tutorial.url}${chapter.hash}`}
                    className="group grid gap-5 bg-[#f2f0e8] py-4 pr-8 transition-colors hover:text-[#146dff] focus-visible:ring-2 focus-visible:ring-[#146dff] focus-visible:outline-none lg:grid-cols-[3rem_16.5rem_1fr] lg:items-center lg:gap-5"
                  >
                    <span
                      className={`font-medium tracking-[-0.055em] ${
                        index === DJANGO_GUIDE_CHAPTERS.length - 1
                          ? 'text-4xl text-[#16815d]'
                          : index === 1
                            ? 'text-[2.125rem] text-zinc-500'
                            : 'text-3xl text-zinc-500'
                      }`}
                    >
                      0{index + 1}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-zinc-600">
                        {chapter.phase}
                      </span>
                      <strong
                        className={`mt-2 block leading-tight font-semibold tracking-[-0.03em] transition-colors group-hover:text-[#146dff] ${
                          index === DJANGO_GUIDE_CHAPTERS.length - 1
                            ? 'text-[1.375rem]'
                            : index === 1
                              ? 'text-xl'
                              : 'text-lg'
                        }`}
                      >
                        {chapter.title}
                      </strong>
                    </span>
                    <span className="text-[15px] leading-6 text-zinc-700 lg:translate-y-3">
                      {chapter.detail}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>

            <div className="grid content-center gap-5 bg-[#090909] px-6 py-6 font-mono text-white lg:border-l lg:border-white/15">
              <div>
                <p className="text-[13px] tracking-wide text-zinc-400">
                  01 / CREATE REQUEST
                </p>
                <p className="mt-2 flex items-baseline justify-between gap-4">
                  <code className="text-lg font-bold">POST / HTTP/2</code>
                  <code className="text-base text-zinc-300">302</code>
                </p>
                <code className="mt-1 block text-sm text-zinc-300">
                  task=&quot;Runtime proof from Sealos&quot;
                </code>
              </div>
              <div>
                <p className="text-[13px] tracking-wide text-zinc-400">
                  02 / FRESH REQUEST
                </p>
                <p className="mt-2 flex items-baseline justify-between gap-4">
                  <code className="text-lg font-bold">GET / HTTP/2</code>
                  <code className="text-base text-zinc-300">200</code>
                </p>
              </div>
              <div className="border-t border-white/15 pt-5">
                <p className="text-[13px] tracking-wide text-zinc-400">
                  03 / DATABASE RECORD
                </p>
                <code className="mt-2 block text-sm text-zinc-200">
                  task[0]=&quot;Runtime proof from Sealos&quot;
                </code>
                <strong className="mt-2 block text-base text-[#44b78b]">
                  PERSISTED
                </strong>
              </div>
            </div>
          </div>
        </nav>
      ) : tutorial.image ? (
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
      ) : null}
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
        <section className="container -mt-24 pt-32 pb-5">
          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-stretch lg:gap-0">
            <div className="lg:pr-12">
              <p className="text-sm font-semibold text-zinc-400">
                Deployment field note · 01
              </p>
              <h1
                className="mt-6 flex items-center gap-4 text-[2.9rem] leading-none font-medium tracking-[-0.06em] whitespace-nowrap text-white sm:text-6xl md:text-[5.5rem]"
                aria-label="Deploy Django on Sealos"
              >
                <span aria-hidden="true">Django</span>
                <ArrowRight
                  className="h-[0.68em] w-[1.2em] shrink-0 stroke-[1.25] text-[#146dff]"
                  aria-hidden="true"
                />
                <span aria-hidden="true">Sealos</span>
              </h1>
              <div className="mt-7">
                <p className="max-w-[38rem] text-lg leading-8 text-zinc-300">
                  Build a Django 5.2 Task app with Gunicorn, WhiteNoise, and
                  PostgreSQL. Deploy it on Sealos and verify a live create/read
                  flow.
                </p>
                {firstTutorial && (
                  <Link
                    href={firstTutorial.url}
                    className="group relative z-10 mt-6 mb-4 inline-flex min-w-[19rem] items-center justify-between gap-8 border-b-2 border-[#146dff] pb-3 text-[1.375rem] font-semibold text-white transition-colors hover:border-[#5f96ff] hover:text-[#5f96ff] focus-visible:ring-2 focus-visible:ring-[#5f96ff] focus-visible:outline-none"
                  >
                    Read the field note
                    <ArrowRight
                      size={19}
                      className="text-[#5f96ff] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                )}
              </div>
            </div>

            <aside className="lg:border-l lg:border-white/15 lg:px-6">
              <div className="flex h-full flex-col border-t border-white/15 pt-5 pb-7 font-mono">
                <div className="flex items-center justify-between gap-5 text-xs font-semibold tracking-wide text-zinc-400">
                  <span>DEPLOYMENT RECEIPT</span>
                  <span>2026.09.02</span>
                </div>
                <dl className="mt-7 divide-y divide-white/15 border-y border-white/15">
                  <div className="grid grid-cols-[4.5rem_1fr] items-baseline gap-3 py-4">
                    <dt className="text-xs text-zinc-400">BUILD</dt>
                    <dd className="text-sm text-zinc-200">collectstatic</dd>
                  </div>
                  <div className="grid grid-cols-[4.5rem_1fr] items-baseline gap-3 py-4">
                    <dt className="text-xs text-zinc-400">MIGRATE</dt>
                    <dd className="text-sm text-zinc-200">PostgreSQL</dd>
                  </div>
                  <div className="grid grid-cols-[4.5rem_1fr] items-baseline gap-3 py-4">
                    <dt className="text-xs text-zinc-400">SERVE</dt>
                    <dd className="text-sm text-zinc-200">:8080</dd>
                  </div>
                </dl>
                <p className="mt-auto border-t border-white/15 pt-4 text-sm text-zinc-400">
                  Django 5.2 · Gunicorn · PostgreSQL
                </p>
              </div>
            </aside>
          </div>
        </section>

        <section
          id="published-tutorials"
          className="relative container scroll-mt-28"
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
        </section>
      </main>
    </>
  );
}
