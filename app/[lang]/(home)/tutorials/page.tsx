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
    detail: 'Configure Gunicorn and WhiteNoise.',
    result: 'Settings locked',
    hash: '#prepare-django-for-production',
  },
  {
    phase: 'Deploy',
    title: 'Deploy with Sealos Skills',
    detail: 'Connect the application and database.',
    result: 'Services linked',
    hash: '#deploy-with-sealos-skills',
  },
  {
    phase: 'Verify',
    title: 'Verify the live application',
    detail: 'Confirm the HTTPS create/read flow.',
    result: 'Flow confirmed',
    hash: '#verify-the-live-django-application',
  },
] as const;

const DJANGO_REQUEST_TRACE = [
  {
    marker: '01',
    label: 'FORM',
    title: 'POST /',
    evidence: 'title="Runtime proof from Sealos"',
    transport: '302 FOUND',
  },
  {
    marker: '02',
    label: 'GUNICORN',
    title: 'WSGI :8000',
    evidence: 'Django 5.2 request accepted',
    transport: 'PASS',
  },
  {
    marker: '03',
    label: 'POSTGRESQL',
    title: 'INSERT tasks_task',
    evidence: 'id=1 · private :5432',
    transport: 'COMMIT',
  },
  {
    marker: '04',
    label: 'BROWSER',
    title: 'GET /',
    evidence: 'response.html returned saved task',
    transport: '200 OK',
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
          <figure className="overflow-hidden border border-white/15">
            <figcaption className="flex items-center justify-between gap-4 border-b border-white/15 bg-[#111419] px-6 py-4 text-white">
              <span className="text-xl font-semibold tracking-tight">
                Django deployment receipt
              </span>
              <span className="font-mono text-xs font-bold tracking-[0.06em] text-zinc-400">
                RUN 01 / VERIFIED
              </span>
            </figcaption>

            <div className="grid bg-[#d4d7d4] text-[#101318] md:grid-cols-12">
              <div className="flex flex-col border-b border-white/15 bg-[#111419] p-6 text-white md:col-span-3 md:border-r md:border-b-0">
                <p className="text-sm font-semibold text-zinc-400">
                  Deployment result
                </p>
                <p className="mt-4 font-mono text-5xl leading-none font-medium tracking-[-0.08em]">
                  200
                </p>
                <p className="mt-1 text-2xl leading-none font-semibold text-[#5f96ff]">
                  OK
                </p>
                <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">
                  <span
                    className="size-1.5 rounded-full bg-[#44b78b]"
                    aria-hidden="true"
                  />
                  Production verified
                </p>
              </div>

              <div className="relative bg-[repeating-linear-gradient(0deg,rgba(16,19,24,0.018)_0,rgba(16,19,24,0.018)_1px,transparent_1px,transparent_4px)] md:col-span-9">
                <span
                  className="absolute top-7 bottom-7 left-[1.875rem] w-px bg-[#146dff]/35"
                  aria-hidden="true"
                />
                <ol className="divide-y divide-zinc-600/30 px-6">
                  {DJANGO_REQUEST_TRACE.map((step) => (
                    <li
                      key={step.marker}
                      className="relative grid grid-cols-[2rem_minmax(0,1fr)] items-center gap-x-4 gap-y-1 py-3 md:grid-cols-12"
                    >
                      <span
                        className="z-10 ml-0.5 size-2 bg-[#146dff] md:col-span-1"
                        aria-hidden="true"
                      />
                      <span className="col-start-2 text-xs font-bold tracking-[0.04em] text-zinc-600 md:col-span-2 md:col-start-auto">
                        {step.label}
                      </span>
                      <span className="col-start-2 md:col-span-7 md:col-start-auto md:grid md:grid-cols-[10rem_minmax(0,1fr)] md:items-center md:gap-x-6">
                        <code className="block text-sm font-bold text-[#101318]">
                          {step.title}
                        </code>
                        <code className="mt-1 block text-sm text-zinc-600 md:mt-0">
                          {step.evidence}
                        </code>
                      </span>
                      <strong
                        className={`col-start-2 font-mono text-xs font-bold md:col-span-2 md:col-start-auto md:text-right ${
                          step.marker === '04'
                            ? 'text-[#146dff]'
                            : 'text-zinc-600'
                        }`}
                      >
                        {step.transport}
                      </strong>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </figure>

          <nav
            className="overflow-hidden border-x border-b border-white/15 bg-[#111419]"
            aria-label="Guide chapters and next field note"
          >
            <div className="grid md:grid-cols-12">
              <div className="flex flex-col border-b border-white/15 p-6 md:col-span-3 md:border-r md:border-b-0">
                <p className="text-sm font-semibold text-[#5f96ff]">
                  Inside the guide
                </p>
                <h3 className="mt-5 text-2xl leading-tight font-semibold text-white">
                  Three decisive checks
                </h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  Configure, deploy, then verify.
                </p>
                <p className="mt-auto pt-5 text-sm leading-6 text-zinc-300">
                  35 minutes from local project to verified production service.
                </p>
              </div>
              <ol className="divide-y divide-white/15 md:col-span-9">
                {DJANGO_GUIDE_CHAPTERS.map((chapter, index) => (
                  <li key={chapter.hash}>
                    <Link
                      href={`${tutorial.url}${chapter.hash}`}
                      className="group grid gap-2 px-6 py-5 text-left focus-visible:ring-2 focus-visible:ring-[#5f96ff] focus-visible:outline-none md:min-h-[5.75rem] md:grid-cols-12 md:items-center"
                    >
                      <span className="font-mono text-xl font-bold text-[#5f96ff] md:col-span-1">
                        0{index + 1}
                      </span>
                      <span className="text-sm font-semibold text-zinc-300 md:col-span-2">
                        {chapter.phase}
                      </span>
                      <span className="md:col-span-7">
                        <strong className="block text-lg font-semibold text-white transition-colors group-hover:text-[#5f96ff]">
                          {chapter.title}
                        </strong>
                        <span className="mt-1 block text-sm leading-5 text-zinc-400">
                          {chapter.detail}
                        </span>
                      </span>
                      <span className="inline-flex items-center gap-2 text-sm font-semibold whitespace-nowrap text-zinc-300 md:col-span-2 md:justify-end">
                        <span
                          className="size-1.5 rounded-full bg-[#44b78b]"
                          aria-hidden="true"
                        />
                        {chapter.result}
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>

            <TutorialRequestGuideLink className="group flex flex-col gap-4 border-t border-white/15 px-6 py-4 text-left transition-colors hover:bg-white/[0.03] focus-visible:ring-2 focus-visible:ring-[#5f96ff] focus-visible:outline-none sm:flex-row sm:items-center sm:justify-between">
              <span className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-5">
                <span className="text-sm font-semibold text-[#5f96ff]">
                  Other runtime
                </span>
                <strong className="text-base font-semibold text-white">
                  Request another deployment field note.
                </strong>
              </span>
              <span className="inline-flex items-center text-sm font-semibold text-zinc-300">
                Suggest a stack
                <ArrowRight
                  size={16}
                  className="ml-3 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
            </TutorialRequestGuideLink>
          </nav>
        </div>
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
          <div className="grid gap-9 md:grid-cols-12 md:items-stretch md:gap-x-6">
            <div className="md:col-span-8 md:pt-6">
              <p className="text-sm font-semibold text-[#5f96ff]">
                Deployment field note · 01
              </p>
              <h1 className="mt-5 text-5xl leading-[0.92] font-medium tracking-[-0.055em] text-white md:text-[5rem]">
                Deploy Django on Sealos
              </h1>
              <p className="mt-7 max-w-3xl text-base leading-7 text-zinc-300">
                <span className="block">
                  Build a Django 5.2 Task app with Gunicorn, WhiteNoise, and
                  PostgreSQL.
                </span>
                <span className="block">
                  Deploy it on Sealos and verify a live create/read flow.
                </span>
              </p>
              {firstTutorial && (
                <div className="mt-7 flex flex-wrap items-center gap-5">
                  <Link
                    href={firstTutorial.url}
                    className="group inline-flex h-11 items-center bg-[#146dff] px-5 text-sm font-semibold whitespace-nowrap text-white transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-[#0f5dd6] focus-visible:ring-2 focus-visible:ring-[#5f96ff] focus-visible:outline-none active:translate-y-0"
                  >
                    Read tutorial
                    <ArrowRight
                      size={15}
                      className="ml-3 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                  <span className="text-sm font-semibold text-zinc-400">
                    Guide / {firstTutorial.estimatedReadingTime} / 3 chapters
                  </span>
                </div>
              )}
            </div>

            <aside className="border-y border-[#2f6d55] py-5 md:col-span-4 md:self-end">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-semibold text-[#b8e8d1]">
                  Runtime profile
                </p>
                <span className="text-sm font-semibold text-zinc-400">
                  Production
                </span>
              </div>
              <div className="mt-5 flex items-end justify-between gap-6">
                <Image
                  src="/icons/django.svg"
                  alt="Django"
                  width={104}
                  height={36}
                  className="h-7 w-auto invert"
                />
                <span className="font-mono text-4xl leading-none font-medium tracking-[-0.08em] text-white">
                  5.2
                </span>
              </div>
              <p className="mt-5 border-t border-white/15 pt-4 text-sm font-semibold text-zinc-300">
                Gunicorn · PostgreSQL · Public HTTPS
              </p>
              <p className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-white">
                <span
                  className="size-1.5 rounded-full bg-[#73d6aa]"
                  aria-hidden="true"
                />
                Production stack verified
              </p>
            </aside>
          </div>
        </section>

        <section
          id="published-tutorials"
          className="container scroll-mt-28 border-t border-white/10 pt-8 pb-12"
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
