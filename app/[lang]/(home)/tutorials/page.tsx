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

const DJANGO_LIVE_TRACE = [
  {
    stage: 'Request',
    value: 'POST /',
  },
  {
    stage: 'Database',
    value: 'COMMIT',
  },
  {
    stage: 'Fresh load',
    value: 'GET /',
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
            <div className="grid gap-8 py-9 lg:grid-cols-2 lg:items-start lg:gap-0">
              <div className="lg:pr-12">
                <p className="text-sm font-semibold text-zinc-600">
                  Inside the guide
                </p>
                <h3 className="mt-3 text-5xl leading-none font-medium tracking-[-0.055em]">
                  Three decisive checks.
                </h3>
              </div>
              <div className="lg:border-l lg:border-black/15 lg:pl-8">
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

            <ol className="grid border-y border-black/15 lg:grid-cols-3">
              {DJANGO_GUIDE_CHAPTERS.map((chapter, index) => (
                <li
                  key={chapter.hash}
                  className="border-t border-black/15 first:border-t-0 lg:border-t-0 lg:border-l lg:px-8 lg:first:border-l-0 lg:first:pl-0 lg:last:pr-0"
                >
                  <Link
                    href={`${tutorial.url}${chapter.hash}`}
                    className="group flex min-h-80 flex-col py-8 transition-colors hover:text-[#146dff] focus-visible:ring-2 focus-visible:ring-[#146dff] focus-visible:outline-none"
                  >
                    <span className="flex items-center gap-4">
                      <span
                        className={`text-4xl font-medium tracking-[-0.055em] ${
                          index === DJANGO_GUIDE_CHAPTERS.length - 1
                            ? 'text-[#16815d]'
                            : 'text-zinc-500'
                        }`}
                      >
                        0{index + 1}
                      </span>
                      <span
                        className={`text-xs font-bold tracking-[0.12em] uppercase ${
                          index === DJANGO_GUIDE_CHAPTERS.length - 1
                            ? 'text-[#16815d]'
                            : 'text-zinc-600'
                        }`}
                      >
                        {chapter.phase}
                      </span>
                    </span>

                    <strong className="mt-7 block max-w-sm text-2xl leading-tight font-semibold tracking-[-0.035em] transition-colors group-hover:text-[#146dff]">
                      {chapter.title}
                    </strong>
                    <span className="mt-4 block max-w-sm text-base leading-7 text-zinc-700">
                      {chapter.detail}
                    </span>

                    <span className="mt-auto flex min-w-0 items-center gap-3 pt-8">
                      <span
                        className="grid size-5 shrink-0 place-items-center border border-[#16815d]"
                        aria-hidden="true"
                      >
                        <span className="size-2 bg-[#16815d]" />
                      </span>
                      <span className="min-w-0">
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
              <h1 className="mt-6 text-6xl leading-[0.92] font-medium tracking-[-0.06em] text-white md:text-[6rem] md:leading-[0.86]">
                <span className="block">Deploy Django</span>
                <span className="block">on Sealos</span>
              </h1>
              <div className="mt-8">
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

            <aside>
              <div className="flex h-full flex-col border border-white/15">
                <div className="flex items-start justify-between border-b border-white/10 px-7 py-4">
                  <Image
                    src="/icons/django.svg"
                    alt="Django"
                    width={148}
                    height={52}
                    className="h-7 w-auto opacity-80 invert"
                  />
                  <span className="font-mono text-[11px] font-semibold tracking-[0.08em] text-[#44b78b] uppercase">
                    Verified · 2026.09.02
                  </span>
                </div>

                <div className="flex flex-1 flex-col justify-center px-7 py-7">
                  <p className="text-xs font-semibold tracking-[0.16em] text-[#44b78b] uppercase">
                    Live persistence check
                  </p>
                  <p className="mt-3 font-mono text-5xl font-medium tracking-[-0.06em] text-white">
                    <span className="text-[#44b78b]">200</span> OK
                  </p>
                  <p className="mt-3 max-w-xs text-[15px] leading-6 text-zinc-300">
                    The submitted task remained after a fresh HTTP/2 load.
                  </p>
                </div>

                <ol className="grid grid-cols-3 border-t border-white/10">
                  {DJANGO_LIVE_TRACE.map((proof, index) => (
                    <li
                      key={proof.stage}
                      className="border-l border-white/10 px-3 py-3 first:border-l-0"
                    >
                      <span className="block text-[11px] font-medium text-zinc-400">
                        0{index + 1} · {proof.stage}
                      </span>
                      <code className="mt-1 block font-mono text-[13px] font-bold text-zinc-200">
                        {proof.value}
                      </code>
                    </li>
                  ))}
                </ol>
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
