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
    detail: 'Configure Gunicorn and WhiteNoise.',
    hash: '#prepare-django-for-production',
  },
  {
    phase: 'Deploy',
    evidence: 'DATABASE_URL → :5432',
    title: 'Deploy with Sealos Skills',
    detail: 'Connect the application and database.',
    hash: '#deploy-with-sealos-skills',
  },
  {
    phase: 'Verify',
    evidence: 'GET / → HTTP 200',
    title: 'Verify the live application',
    detail: 'Confirm the HTTPS create/read flow.',
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
        <div>
          <figure>
            <figcaption className="border-y border-white/15 py-5">
              <span className="text-2xl font-medium tracking-[-0.035em] text-white">
                Production evidence
              </span>
            </figcaption>

            <div className="grid overflow-hidden border-b border-white/15 md:grid-cols-[1fr_4rem_0.75fr_4rem_1fr]">
              <div className="flex min-h-80 flex-col bg-[#f2f0e8] p-6 text-[#111827]">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono text-sm font-bold text-zinc-500">
                    01
                  </span>
                  <p className="text-sm font-semibold text-[#146dff]">
                    Create task
                  </p>
                </div>
                <div className="mt-5 flex h-44 flex-col justify-center border-y border-black/15 bg-white p-5">
                  <p className="text-lg font-semibold tracking-[-0.025em]">
                    Django tasks
                  </p>
                  <label className="mt-5 text-xs font-medium">Title</label>
                  <div className="mt-2 flex items-stretch gap-2 text-xs">
                    <span className="flex min-w-0 flex-1 items-center border border-zinc-400 px-3 text-zinc-600">
                      Ship Django on Sealos
                    </span>
                    <span className="bg-[#146dff] px-3 py-2 font-semibold text-white">
                      Add task
                    </span>
                  </div>
                </div>
                <p className="mt-auto pt-5 text-sm leading-6 text-zinc-600">
                  Submit “Ship Django on Sealos”.
                </p>
              </div>

              <div className="flex items-center justify-center border-y border-white/15 bg-[#0d1015] py-4 md:border-y-0">
                <span className="text-3xl text-[#5f96ff]" aria-hidden="true">
                  →
                </span>
              </div>

              <div className="flex min-h-80 flex-col bg-[#0d1015] p-6 text-white">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono text-sm font-bold text-zinc-500">
                    02
                  </span>
                  <p className="text-sm font-semibold text-[#5f96ff]">
                    Response
                  </p>
                </div>
                <div className="my-auto py-7 text-center">
                  <p className="text-[6rem] leading-[0.78] font-medium tracking-[-0.075em] text-[#44b78b]">
                    200
                  </p>
                  <p className="mt-5 font-mono text-xs font-bold text-white">
                    HTTP/2 · OK
                  </p>
                </div>
                <code className="border-l-2 border-[#5f96ff] pl-3 font-mono text-xs text-zinc-400">
                  curl --fail /
                </code>
              </div>

              <div className="flex items-center justify-center border-y border-white/15 bg-[#0d1015] py-4 md:border-y-0">
                <span className="text-3xl text-[#44b78b]" aria-hidden="true">
                  →
                </span>
              </div>

              <div className="flex min-h-80 flex-col bg-[#e3f1e9] p-6 text-[#111827]">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono text-sm font-bold text-zinc-500">
                    03
                  </span>
                  <p className="text-sm font-semibold text-[#16815d]">
                    Read persisted
                  </p>
                </div>
                <div className="mt-5 flex h-44 flex-col justify-center border-y border-black/15 bg-white p-5">
                  <p className="text-lg font-semibold tracking-[-0.025em]">
                    Task list
                  </p>
                  <div className="mt-5 border-t border-zinc-200 pt-4 text-sm">
                    <span className="mr-3 text-[#16815d]">●</span>
                    Runtime proof from Sealos
                  </div>
                </div>
                <p className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-[#16815d]">
                  <span className="size-2 rounded-full bg-current" />
                  Runtime proof from Sealos
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 bg-[#0d1015] px-6 py-4 font-mono text-xs text-zinc-400">
              <code className="break-all">
                https://django-tasks-mpbrofzu.usw.sealos.io/
              </code>
              <time>Sep 03 2026 · 14:22 UTC</time>
            </div>
          </figure>

          <nav
            className="bg-[#f2f0e8] text-[#0a0a0a]"
            aria-label="Guide chapters"
          >
            <div className="grid lg:grid-cols-[18rem_1fr]">
              <div className="flex flex-col py-7 pr-8">
                <p className="text-sm font-semibold text-[#146dff]">
                  Inside the guide
                </p>
                <h3 className="mt-3 text-3xl leading-none font-medium tracking-[-0.045em]">
                  Three decisive checks.
                </h3>
                <p className="mt-5 text-sm leading-6 text-zinc-600">
                  Configure, deploy, then verify the public flow.
                </p>
                <TutorialRequestGuideLink className="group mt-auto inline-flex items-center justify-between gap-5 pt-8 text-sm font-semibold text-[#146dff] focus-visible:ring-2 focus-visible:ring-[#146dff] focus-visible:outline-none">
                  Request the next field note
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </TutorialRequestGuideLink>
              </div>

              <ol className="border-t border-black/20 lg:border-t-0 lg:border-l">
                {DJANGO_GUIDE_CHAPTERS.map((chapter, index) => (
                  <li
                    key={chapter.hash}
                    className={`border-b border-black/20 ${
                      index === 1 ? 'lg:ml-12' : ''
                    } ${index === 2 ? 'bg-[#e3f1e9] lg:ml-24' : ''}`}
                  >
                    <Link
                      href={`${tutorial.url}${chapter.hash}`}
                      className="group grid min-h-20 grid-cols-[2.5rem_1fr] items-center gap-4 px-6 py-4 focus-visible:ring-2 focus-visible:ring-[#146dff] focus-visible:outline-none md:grid-cols-[2.5rem_1fr_auto]"
                    >
                      <span className="font-mono text-sm font-bold text-zinc-500">
                        0{index + 1}
                      </span>
                      <span>
                        <span
                          className={`text-xs font-semibold ${
                            chapter.phase === 'Verify'
                              ? 'text-[#16815d]'
                              : 'text-[#146dff]'
                          }`}
                        >
                          {chapter.phase}
                        </span>
                        <strong className="mt-1 block text-lg leading-tight font-semibold tracking-[-0.025em] transition-colors group-hover:text-[#146dff]">
                          {chapter.title}
                        </strong>
                      </span>
                      <span className="col-start-2 text-sm leading-6 text-zinc-600 md:col-start-auto md:max-w-64">
                        <span>{chapter.detail}</span>
                        <code className="mt-1 block font-mono text-xs font-bold text-zinc-600">
                          {chapter.evidence}
                        </code>
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
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
          <div className="grid gap-8 md:grid-cols-4 md:items-stretch md:gap-0">
            <div className="md:col-span-3 md:pr-12">
              <p className="text-sm font-semibold text-[#5f96ff]">
                Deployment field note
              </p>
              <h1 className="mt-6 text-6xl leading-[0.92] font-medium tracking-[-0.055em] text-white md:text-[4.75rem]">
                <span className="block">Deploy Django</span>
                <span className="block">on Sealos</span>
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-7 text-zinc-300">
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
                    className="group inline-flex w-56 items-center justify-between bg-[#f2f0e8] px-5 py-3 text-base font-semibold text-[#0a0a0a] transition-colors hover:bg-white focus-visible:ring-2 focus-visible:ring-[#5f96ff] focus-visible:outline-none"
                  >
                    Read the field note
                    <ArrowRight
                      size={15}
                      className="transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              )}
            </div>

            <aside className="flex flex-col border-l border-white/15 pl-7 md:py-1">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <Image
                    src="/icons/django.svg"
                    alt="Django"
                    width={148}
                    height={52}
                    className="h-9 w-auto invert"
                  />
                  <span className="mt-3 block font-mono text-xs font-bold tracking-[0.04em] text-zinc-300">
                    Django 5.2
                  </span>
                </div>
                <span className="text-xs font-semibold text-zinc-500">
                  Field note 01
                </span>
              </div>
              <div className="mt-8 flex items-end gap-4 border-y border-white/15 py-5">
                <span className="text-[5.5rem] leading-[0.8] font-medium tracking-[-0.075em] text-white">
                  35
                </span>
                <span className="pb-1 font-mono text-xs leading-5 font-bold tracking-[0.06em] text-zinc-300 uppercase">
                  Minutes
                  <span className="block text-zinc-500">From repo</span>
                  <span className="block text-zinc-500">To HTTPS</span>
                </span>
              </div>
              <div className="mt-5 flex items-center justify-between gap-5 border-b border-white/15 pb-5 text-xs font-semibold">
                <span className="text-zinc-500">Live proof below</span>
                <span className="inline-flex items-center gap-2 text-[#44b78b]">
                  <span className="size-1.5 rounded-full bg-current" />
                  Verified
                </span>
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
