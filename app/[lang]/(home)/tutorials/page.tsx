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
    evidence: 'config.wsgi:application',
    title: 'Prepare Django for production',
    detail:
      'Set the WSGI entrypoint, static file middleware, and production hosts.',
    hash: '#prepare-django-for-production',
  },
  {
    phase: 'Deploy',
    evidence: 'DATABASE_URL → :5432',
    title: 'Deploy with Sealos Skills',
    detail:
      'Provision the app and PostgreSQL, then release it with Sealos Skills.',
    hash: '#deploy-with-sealos-skills',
  },
  {
    phase: 'Verify',
    evidence: 'GET / → HTTP 200',
    title: 'Verify the live application',
    detail:
      'Submit a task over HTTPS and confirm it persists after a fresh load.',
    hash: '#verify-the-live-django-application',
  },
] as const;

const DJANGO_RUNTIME_EVIDENCE = [
  {
    service: 'HTTPS ingress',
    event: 'django-tasks…sealos.io',
    result: 'Connected',
  },
  {
    service: 'Django 5.2 · Gunicorn',
    event: 'config.wsgi:application',
    result: 'Running',
  },
  {
    service: 'PostgreSQL write',
    event: 'tasks_task · private :5432',
    result: 'Persisted',
  },
  {
    service: 'HTTP/2 response',
    event: 'GET /',
    result: '200 OK',
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
        <div>
          <nav
            className="bg-[#f2f0e8] text-[#0a0a0a]"
            aria-label="Guide chapters"
          >
            <div className="grid gap-8 py-9 lg:grid-cols-3 lg:items-end lg:gap-0">
              <div className="lg:col-span-2 lg:pr-12">
                <p className="text-sm font-semibold text-[#146dff]">
                  Inside the guide
                </p>
                <h3 className="mt-3 text-5xl leading-none font-medium tracking-[-0.055em]">
                  Three decisive checks.
                </h3>
              </div>
              <div className="lg:pl-7">
                <p className="text-base leading-7 text-zinc-700">
                  Configure, deploy, then verify the public flow.
                </p>
                <TutorialRequestGuideLink className="group mt-5 inline-flex w-full items-center justify-between gap-5 text-sm font-semibold text-[#146dff] focus-visible:ring-2 focus-visible:ring-[#146dff] focus-visible:outline-none">
                  Request the next field note
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </TutorialRequestGuideLink>
              </div>
            </div>

            <div className="hidden grid-cols-3 border-y border-black/15 py-3 text-xs font-semibold text-zinc-500 md:grid">
              <span>Guide step</span>
              <span className="px-7">Outcome</span>
              <span className="pl-7">Verified proof</span>
            </div>
            <ol className="divide-y divide-black/15">
              {DJANGO_GUIDE_CHAPTERS.map((chapter, index) => (
                <li key={chapter.hash}>
                  <Link
                    href={`${tutorial.url}${chapter.hash}`}
                    className="group grid min-h-28 gap-5 py-6 transition-colors hover:text-[#146dff] focus-visible:ring-2 focus-visible:ring-[#146dff] focus-visible:outline-none md:grid-cols-3 md:items-center md:gap-0"
                  >
                    <span className="grid grid-cols-[3.25rem_1fr] items-center gap-5 md:pr-7">
                      <span className="font-mono text-4xl font-bold tracking-[-0.06em] text-zinc-500">
                        0{index + 1}
                      </span>
                      <span>
                        <span
                          className={`text-sm font-semibold ${
                            chapter.phase === 'Verify'
                              ? 'text-[#16815d]'
                              : 'text-[#146dff]'
                          }`}
                        >
                          {chapter.phase}
                        </span>
                        <strong className="mt-2 block text-xl leading-tight font-semibold tracking-[-0.03em] transition-colors group-hover:text-[#146dff]">
                          {chapter.title}
                        </strong>
                      </span>
                    </span>
                    <span className="text-base leading-7 text-zinc-700 md:px-7">
                      {chapter.detail}
                    </span>
                    <code className="border-l-2 border-[#16815d] py-2 pl-4 font-mono text-[13px] font-bold text-zinc-800 md:ml-7">
                      {chapter.evidence}
                    </code>
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        </div>
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
        <section className="container -mt-24 pt-32">
          <div className="grid gap-8 md:grid-cols-3 md:items-stretch md:gap-0">
            <div className="md:col-span-2 md:pr-12">
              <p className="text-sm font-semibold text-[#5f96ff]">
                Deployment field note
              </p>
              <h1 className="mt-6 text-6xl leading-[0.92] font-medium tracking-[-0.055em] text-white md:text-[4.75rem]">
                <span className="block">Deploy Django</span>
                <span className="block">on Sealos</span>
              </h1>
              <div className="mt-7 border-t border-white/15 pt-6">
                <p className="max-w-[31rem] text-base leading-7 text-zinc-300">
                  Build a Django 5.2 Task app with Gunicorn, WhiteNoise, and
                  PostgreSQL. Deploy it on Sealos and verify a live create/read
                  flow.
                </p>
                {firstTutorial && (
                  <Link
                    href={firstTutorial.url}
                    className="group mt-5 inline-flex w-56 items-center justify-between bg-[#f2f0e8] px-5 py-3.5 text-sm font-semibold text-[#0a0a0a] transition-colors hover:bg-white focus-visible:ring-2 focus-visible:ring-[#5f96ff] focus-visible:outline-none"
                  >
                    Read the field note
                    <ArrowRight
                      size={15}
                      className="transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                )}
              </div>
            </div>

            <aside className="border-l border-white/15 pl-7 md:py-1">
              <div className="flex items-start justify-between gap-6">
                <Image
                  src="/icons/django.svg"
                  alt="Django"
                  width={148}
                  height={52}
                  className="h-8 w-auto invert"
                />
                <span className="flex items-baseline gap-2 text-white">
                  <span className="text-3xl leading-none font-medium tracking-[-0.05em]">
                    35
                  </span>
                  <span className="font-mono text-xs font-bold uppercase">
                    min
                  </span>
                </span>
              </div>

              <div className="mt-5 flex items-center justify-between gap-4">
                <p className="text-sm font-semibold text-zinc-200">
                  Production evidence
                </p>
                <span className="text-xs font-semibold text-[#44b78b]">
                  4 of 4 verified
                </span>
              </div>

              <ol
                className="mt-3 divide-y divide-white/15 border-y border-white/15"
                aria-label="Verified Django deployment path"
              >
                {DJANGO_RUNTIME_EVIDENCE.map((evidence) => (
                  <li
                    key={evidence.service}
                    className="grid grid-cols-[1fr_auto] items-center gap-4 py-2.5"
                  >
                    <span className="min-w-0">
                      <strong className="block truncate text-[13px] font-semibold text-white">
                        {evidence.service}
                      </strong>
                      <code className="mt-0.5 block truncate font-mono text-xs text-zinc-400">
                        {evidence.event}
                      </code>
                    </span>
                    <span className="text-xs font-semibold text-[#44b78b]">
                      {evidence.result}
                    </span>
                  </li>
                ))}
              </ol>

              <div className="mt-4 flex items-center justify-between gap-4 text-xs text-zinc-400">
                <span>Django 5.2 · Field note 01</span>
                <span className="font-mono text-zinc-500">2026-09-02</span>
              </div>
            </aside>
          </div>
        </section>

        <section
          id="published-tutorials"
          className="container scroll-mt-28 pb-12"
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
