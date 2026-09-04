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
    proofDetail: 'Gunicorn entrypoint',
    title: 'Prepare Django for production',
    detail:
      'Set the WSGI entrypoint, static file middleware, and production hosts.',
    hash: '#prepare-django-for-production',
  },
  {
    phase: 'Deploy',
    evidence: 'DATABASE_URL → :5432',
    proofDetail: 'Private PostgreSQL',
    title: 'Deploy with Sealos Skills',
    detail:
      'Provision the app and PostgreSQL, then release it with Sealos Skills.',
    hash: '#deploy-with-sealos-skills',
  },
  {
    phase: 'Verify',
    evidence: 'GET / → HTTP 200',
    proofDetail: 'Persisted after fresh load',
    title: 'Verify the live application',
    detail:
      'Submit a task over HTTPS and confirm it persists after a fresh load.',
    hash: '#verify-the-live-django-application',
  },
] as const;

const DJANGO_LIVE_PROOF = [
  {
    stage: 'Request',
    command: 'POST / · task="Runtime proof…"',
    result: '302',
  },
  {
    stage: 'Write',
    command: 'INSERT tasks_task · PostgreSQL',
    result: 'COMMIT',
  },
  {
    stage: 'Fresh load',
    command: 'GET / HTTP/2 · task[0]',
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
            <div className="grid gap-8 py-9 lg:grid-cols-3 lg:items-start lg:gap-0">
              <div className="lg:col-span-2 lg:pr-12">
                <p className="text-sm font-semibold text-zinc-600">
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
                <TutorialRequestGuideLink className="group mt-5 inline-flex items-center gap-3 text-sm font-semibold text-[#146dff] focus-visible:ring-2 focus-visible:ring-[#146dff] focus-visible:outline-none">
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
            <ol className="relative divide-y divide-black/15">
              {DJANGO_GUIDE_CHAPTERS.map((chapter, index) => (
                <li key={chapter.hash}>
                  <Link
                    href={`${tutorial.url}${chapter.hash}`}
                    className="group grid min-h-28 gap-5 py-6 transition-colors hover:text-[#146dff] focus-visible:ring-2 focus-visible:ring-[#146dff] focus-visible:outline-none md:grid-cols-3 md:items-center md:gap-0"
                  >
                    <span className="grid grid-cols-[3.25rem_1fr] items-center gap-5 md:pr-7">
                      <span className="text-3xl font-medium tracking-[-0.05em] text-zinc-600">
                        0{index + 1}
                      </span>
                      <span>
                        <span className="text-sm font-semibold text-zinc-600">
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
                    <span className="relative md:pl-7">
                      <span
                        className="absolute -left-2.5 z-10 hidden size-5 place-items-center border border-[#16815d] bg-[#f2f0e8] md:grid"
                        aria-hidden="true"
                      >
                        <span className="size-2 bg-[#16815d]" />
                      </span>
                      <span className="block min-w-0">
                        <code className="block truncate font-mono text-sm font-bold text-zinc-900">
                          {chapter.evidence}
                        </code>
                        <span className="mt-1 block text-xs text-zinc-600">
                          {chapter.proofDetail}
                        </span>
                      </span>
                    </span>
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
          <div className="relative grid gap-8 md:grid-cols-3 md:items-stretch md:gap-0">
            <div className="md:col-span-2 md:pr-12">
              <p className="text-sm font-semibold text-zinc-400">
                Deployment field note
              </p>
              <h1 className="mt-6 text-6xl leading-[0.92] font-medium tracking-[-0.055em] text-white md:text-[4.75rem]">
                <span className="block">Deploy Django</span>
                <span className="block">on Sealos</span>
              </h1>
              <div className="mt-7 border-t border-white/15 pt-6 md:-mr-12 md:pr-12">
                <p className="max-w-[35rem] text-lg leading-8 text-zinc-300">
                  Build a Django 5.2 Task app with Gunicorn, WhiteNoise, and
                  PostgreSQL. Deploy it on Sealos and verify a live create/read
                  flow.
                </p>
                {firstTutorial && (
                  <Link
                    href={firstTutorial.url}
                    className="group relative z-10 mt-5 inline-flex w-60 items-center justify-between border-x border-t border-[#146dff] bg-[#146dff] px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-[#2f7bff] focus-visible:ring-2 focus-visible:ring-[#5f96ff] focus-visible:outline-none"
                  >
                    Read the field note
                    <ArrowRight
                      size={15}
                      className="rotate-45 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:translate-y-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                )}
              </div>
            </div>

            <aside className="relative">
              <span
                className="absolute top-0 bottom-0 left-0 z-10 w-px bg-[#44b78b]/60"
                aria-hidden="true"
              />
              <div className="relative grid h-full grid-rows-[auto_1fr_auto] border border-white/15">
                <div className="grid grid-cols-2 items-start py-4 pr-4 pl-7">
                  <Image
                    src="/icons/django.svg"
                    alt="Django"
                    width={148}
                    height={52}
                    className="h-8 w-auto invert"
                  />
                  <span className="text-right text-xs font-semibold text-white">
                    Live create / read
                    <span className="mt-1 block text-[#44b78b]">
                      Verified run
                    </span>
                  </span>
                </div>

                <div className="grid grid-rows-3 divide-y divide-white/15 border-y border-white/15">
                  {DJANGO_LIVE_PROOF.map((proof, index) => (
                    <div
                      key={proof.stage}
                      className="relative grid grid-cols-[2rem_1fr_auto] items-center gap-3 pr-4 pl-7"
                    >
                      <span
                        className="absolute top-1/2 -left-2 z-20 grid size-4 -translate-y-1/2 place-items-center border border-[#44b78b] bg-[#090909]"
                        aria-hidden="true"
                      >
                        <span className="size-1.5 bg-[#44b78b]" />
                      </span>
                      <span className="text-xs font-medium text-zinc-500">
                        0{index + 1}
                      </span>
                      <span className="min-w-0">
                        <strong className="block text-sm font-semibold text-white">
                          {proof.stage}
                        </strong>
                        <code className="mt-1 block truncate font-mono text-[11px] text-zinc-400">
                          {proof.command}
                        </code>
                      </span>
                      <code
                        className={`font-mono text-xs font-bold ${
                          index === DJANGO_LIVE_PROOF.length - 1
                            ? 'text-[#44b78b]'
                            : 'text-zinc-300'
                        }`}
                      >
                        {proof.result}
                      </code>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 py-3 pr-4 pl-7 text-xs text-zinc-400">
                  <span>Django 5.2 · PostgreSQL</span>
                  <span className="text-right">35 min · 2026-09-02</span>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section
          id="published-tutorials"
          className="relative container scroll-mt-28"
          aria-labelledby="published-tutorials-heading"
        >
          <span
            className="pointer-events-none absolute top-0 bottom-0 left-[calc(66.666667%-5.333px)] z-10 hidden w-px bg-[#16815d]/35 md:block"
            aria-hidden="true"
          />
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
