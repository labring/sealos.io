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
const DJANGO_PROJECT_EVIDENCE =
  '/images/tutorials/django/django-sealos-project-ops-running.webp';
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

            <div className="relative grid overflow-hidden border-b border-white/15 bg-[#10151d] md:grid-cols-3 md:divide-x md:divide-white/10">
              <div className="absolute inset-x-0 top-0 z-10 h-0.5 bg-gradient-to-r from-[#146dff] via-[#3d8cff] to-[#44b78b]" />

              <section
                className="relative min-h-88 overflow-hidden bg-[#08101f]"
                aria-label="Deploy: Django container running"
              >
                <div
                  className="absolute inset-0 bg-no-repeat brightness-[1.5] contrast-[1.15] saturate-[0.72]"
                  role="img"
                  aria-label="Running Django container in the Sealos project view"
                  style={{
                    backgroundImage: `url('${DJANGO_PROJECT_EVIDENCE}')`,
                    backgroundPosition: '55% 34%',
                    backgroundSize: '340% auto',
                  }}
                />
                <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-[#080b10] to-transparent px-6 pt-7 pb-16">
                  <span className="font-mono text-sm font-bold text-zinc-300">
                    01
                  </span>
                  <span className="text-sm font-semibold text-[#5f96ff]">
                    Deploy · container running
                  </span>
                </div>
              </section>

              <section
                className="flex min-h-88 flex-col border-t border-white/10 p-7 text-white md:border-t-0"
                aria-label="Write: Django task submitted"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono text-sm font-bold text-zinc-500">
                    02
                  </span>
                  <span className="text-sm font-semibold text-[#5f96ff]">
                    Write · task submitted
                  </span>
                </div>
                <h4 className="mt-12 text-3xl font-semibold tracking-[-0.045em]">
                  Django tasks
                </h4>
                <p className="mt-6 text-sm font-medium text-zinc-300">Title</p>
                <div className="mt-2 flex gap-2 text-sm">
                  <span className="min-w-0 flex-1 border border-white/25 bg-[#0d1015] px-3 py-3 text-zinc-200">
                    Ship Django on Sealos
                  </span>
                  <span className="bg-[#146dff] px-4 py-3 font-semibold text-white">
                    Add task
                  </span>
                </div>
                <div className="mt-auto flex items-center justify-between gap-5 border-t border-white/15 pt-5">
                  <span className="flex items-center gap-2 text-sm text-zinc-200">
                    <span className="size-2 rounded-full bg-[#16815d]" />
                    Saved to PostgreSQL
                  </span>
                  <span className="text-lg text-[#3d8cff]" aria-hidden="true">
                    →
                  </span>
                </div>
              </section>

              <section
                className="flex min-h-88 flex-col border-t border-white/10 p-7 text-white md:border-t-0"
                aria-label="Verify: public HTTP 200 response"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono text-sm font-bold text-zinc-500">
                    03
                  </span>
                  <span className="text-sm font-semibold text-[#44b78b]">
                    Verify · public response
                  </span>
                </div>
                <div className="mt-12 flex items-center justify-between gap-4 border-b border-white/15 pb-5">
                  <code className="font-mono text-sm font-bold text-[#5f96ff]">
                    GET /
                  </code>
                  <span className="text-sm text-zinc-400">HTTP/2</span>
                </div>
                <p className="mt-8 text-7xl leading-none font-semibold tracking-[-0.065em] text-[#44b78b]">
                  200 OK
                </p>
                <div className="mt-auto border-t border-white/15 pt-5">
                  <p className="text-sm font-semibold text-white">
                    Read after redirect
                  </p>
                  <code className="mt-2 block font-mono text-[13px] text-zinc-300">
                    django-tasks-mpbrofzu.usw.sealos.io
                  </code>
                </div>
              </section>
            </div>
          </figure>

          <nav
            className="bg-[#f2f0e8] text-[#0a0a0a]"
            aria-label="Guide chapters"
          >
            <div className="grid gap-8 px-7 py-9 lg:grid-cols-[2fr_1fr] lg:items-end">
              <div>
                <p className="text-sm font-semibold text-[#146dff]">
                  Inside the guide
                </p>
                <h3 className="mt-3 text-5xl leading-none font-medium tracking-[-0.055em]">
                  Three decisive checks.
                </h3>
              </div>
              <div>
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

            <ol className="grid border-t border-black/15 lg:grid-cols-3 lg:divide-x lg:divide-black/15">
              {DJANGO_GUIDE_CHAPTERS.map((chapter, index) => (
                <li
                  key={chapter.hash}
                  className="border-t border-black/15 first:border-t-0 lg:border-t-0"
                >
                  <Link
                    href={`${tutorial.url}${chapter.hash}`}
                    className="group flex min-h-64 flex-col p-7 transition-colors hover:bg-black/[0.035] focus-visible:ring-2 focus-visible:ring-[#146dff] focus-visible:outline-none"
                  >
                    <span className="flex items-start justify-between gap-5">
                      <span className="font-mono text-4xl font-bold tracking-[-0.06em] text-zinc-400">
                        0{index + 1}
                      </span>
                      <span
                        className={`text-sm font-semibold ${
                          chapter.phase === 'Verify'
                            ? 'text-[#16815d]'
                            : 'text-[#146dff]'
                        }`}
                      >
                        {chapter.phase}
                      </span>
                    </span>
                    <strong className="mt-8 text-2xl leading-tight font-semibold tracking-[-0.035em] transition-colors group-hover:text-[#146dff]">
                      {chapter.title}
                    </strong>
                    <span className="mt-4 text-base leading-7 text-zinc-700">
                      {chapter.detail}
                    </span>
                    <code className="mt-auto pt-7 font-mono text-[13px] font-bold text-zinc-600">
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
              <div className="mt-7 flex flex-col gap-7 border-t border-white/15 pt-6 md:flex-row md:items-end md:justify-between">
                <p className="max-w-[31rem] text-base leading-7 text-zinc-300">
                  Build a Django 5.2 Task app with Gunicorn, WhiteNoise, and
                  PostgreSQL. Deploy it on Sealos and verify a live create/read
                  flow.
                </p>
                {firstTutorial && (
                  <Link
                    href={firstTutorial.url}
                    className="group inline-flex w-64 shrink-0 items-center justify-between bg-[#f2f0e8] px-6 py-4 text-base font-semibold text-[#0a0a0a] transition-colors hover:bg-white focus-visible:ring-2 focus-visible:ring-[#5f96ff] focus-visible:outline-none"
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
                  <span className="mt-3 block font-mono text-sm font-bold tracking-[0.04em] text-zinc-300">
                    Django 5.2
                  </span>
                </div>
                <span className="text-sm font-semibold text-zinc-300">
                  Field note 01
                </span>
              </div>
              <div className="mt-8 flex items-end gap-4 border-y border-white/15 py-5">
                <span className="text-[4.75rem] leading-[0.8] font-medium tracking-[-0.075em] text-white">
                  35
                </span>
                <span className="pb-1 font-mono text-xs leading-5 font-bold tracking-[0.06em] text-zinc-300 uppercase">
                  Minutes
                  <span className="block text-zinc-400">From repo</span>
                  <span className="block text-zinc-400">To HTTPS</span>
                </span>
              </div>
              <div className="grid flex-1 grid-cols-3 items-center gap-3 border-b border-white/15 py-4 text-xs font-semibold text-zinc-300">
                <span>Gunicorn</span>
                <span>WhiteNoise</span>
                <span>PostgreSQL</span>
              </div>
              <div className="flex items-center justify-between gap-5 border-b border-white/15 py-4 text-xs font-semibold">
                <span className="text-zinc-300">Live proof below</span>
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
