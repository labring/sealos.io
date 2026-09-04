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
const DJANGO_PRODUCTION_EVIDENCE =
  '/images/tutorials/django/django-sealos-project-ops-running.webp';

const DJANGO_GUIDE_CHAPTERS = [
  {
    phase: 'Configure',
    evidence: 'config.wsgi:application',
    result: 'WSGI ready',
    title: 'Prepare Django for production',
    detail: 'Configure Gunicorn and WhiteNoise.',
    hash: '#prepare-django-for-production',
  },
  {
    phase: 'Deploy',
    evidence: 'DATABASE_URL → :5432',
    result: 'Services linked',
    title: 'Deploy with Sealos Skills',
    detail: 'Connect the application and database.',
    hash: '#deploy-with-sealos-skills',
  },
  {
    phase: 'Verify',
    evidence: 'GET / → HTTP 200',
    result: 'Flow verified',
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
            <figcaption className="flex flex-wrap items-center justify-between gap-4 border-y border-white/15 py-5">
              <span className="text-2xl font-medium tracking-[-0.035em] text-white">
                Production evidence
              </span>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#44b78b]">
                <span
                  className="size-2 rounded-full bg-current"
                  aria-hidden="true"
                />
                Verified live path
              </span>
            </figcaption>

            <div className="relative aspect-[16/8] overflow-hidden border-b border-white/15 bg-[#07101c] md:aspect-[16/5.25]">
              <Image
                src={DJANGO_PRODUCTION_EVIDENCE}
                alt="Sealos project canvas showing the public HTTPS endpoint, running Django container, and attached PostgreSQL database"
                fill
                className="scale-[1.18] object-cover object-center brightness-110 contrast-125 saturate-75"
                priority
                quality={95}
                sizes="(max-width: 1280px) 100vw, 1248px"
              />

              <div className="pointer-events-none absolute inset-0 hidden md:block">
                <div className="absolute top-[4%] left-[10%]">
                  <p className="font-mono text-xs font-bold tracking-[0.06em] text-[#79a8ff] uppercase">
                    HTTPS · :443
                  </p>
                  <span className="mt-2 ml-1 block h-8 w-px bg-[#79a8ff]" />
                </div>
                <div className="absolute top-[4%] left-[42%]">
                  <p className="font-mono text-xs font-bold tracking-[0.06em] text-[#79a8ff] uppercase">
                    Running · :8000
                  </p>
                  <span className="mt-2 ml-1 block h-8 w-px bg-[#79a8ff]" />
                </div>
                <div className="absolute top-[4%] left-[74%]">
                  <p className="font-mono text-xs font-bold tracking-[0.06em] text-[#79a8ff] uppercase">
                    Database · private
                  </p>
                  <span className="mt-2 ml-1 block h-8 w-px bg-[#79a8ff]" />
                </div>
              </div>

              <ul className="grid border-t border-white/15 bg-black sm:grid-cols-2 md:hidden">
                <li className="border-b border-white/15 px-4 py-3 font-mono text-xs font-bold text-[#5f96ff] uppercase sm:border-r">
                  Public HTTPS · reachable
                </li>
                <li className="border-b border-white/15 px-4 py-3 font-mono text-xs font-bold text-[#5f96ff] uppercase">
                  Django · running
                </li>
                <li className="px-4 py-3 font-mono text-xs font-bold text-[#5f96ff] uppercase sm:border-r">
                  PostgreSQL · attached
                </li>
                <li className="px-4 py-3 font-mono text-xs font-bold text-[#44b78b] uppercase">
                  HTTP 200 · verified
                </li>
              </ul>
            </div>
          </figure>

          <nav
            className="mt-10 grid bg-[#f2f0e8] text-[#0a0a0a] md:grid-cols-[0.85fr_1.5fr]"
            aria-label="Guide chapters"
          >
            <div className="flex flex-col p-8 md:min-h-[27rem] md:p-10">
              <p className="text-sm font-semibold text-[#146dff]">
                Inside the guide
              </p>
              <h3 className="mt-5 max-w-xs text-5xl leading-[0.95] font-medium tracking-[-0.055em]">
                Three decisive checks.
              </h3>
              <p className="mt-6 max-w-xs text-base leading-7 text-zinc-600">
                Configure, deploy, then verify the public flow.
              </p>
              <span className="mt-auto hidden font-mono text-xs font-bold tracking-[0.06em] text-zinc-500 uppercase md:block">
                35 min · field note 01
              </span>
            </div>

            <ol className="border-t border-black/20 md:border-t-0 md:border-l">
              {DJANGO_GUIDE_CHAPTERS.map((chapter, index) => (
                <li
                  key={chapter.hash}
                  className="border-b border-black/20 last:border-b-0"
                >
                  <Link
                    href={`${tutorial.url}${chapter.hash}`}
                    className="group grid min-h-36 grid-cols-[3.5rem_1fr_auto] gap-x-5 p-6 focus-visible:ring-2 focus-visible:ring-[#146dff] focus-visible:outline-none md:grid-cols-[4.5rem_1fr_auto]"
                  >
                    <span className="font-mono text-3xl leading-none font-medium tracking-[-0.05em] text-zinc-400">
                      0{index + 1}
                    </span>
                    <span>
                      <span
                        className={`font-mono text-xs font-bold tracking-[0.06em] uppercase ${
                          chapter.phase === 'Verify'
                            ? 'text-[#16815d]'
                            : 'text-[#146dff]'
                        }`}
                      >
                        {chapter.phase} · {chapter.result}
                      </span>
                      <strong className="mt-4 block text-2xl leading-tight font-semibold tracking-[-0.035em] transition-colors group-hover:text-[#146dff]">
                        {chapter.title}
                      </strong>
                      <span className="mt-1 block text-sm leading-6 text-zinc-600">
                        {chapter.detail}
                      </span>
                      <code className="mt-4 block font-mono text-xs font-bold text-zinc-600">
                        {chapter.evidence}
                      </code>
                    </span>
                    <ArrowRight
                      size={20}
                      className="self-center text-[#146dff] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ol>
          </nav>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-6 bg-[#0d1015] px-6 py-5 text-white">
            <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2">
              <h3 className="text-2xl leading-none font-medium tracking-[-0.035em]">
                Missing your stack?
              </h3>
              <p className="text-sm leading-6 text-zinc-300">
                Share the deployment job you need.
              </p>
            </div>
            <TutorialRequestGuideLink className="group inline-flex items-center gap-5 text-sm font-semibold text-[#5f96ff] transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-[#5f96ff] focus-visible:outline-none">
              Request a field note
              <ArrowRight
                size={16}
                className="transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1"
                aria-hidden="true"
              />
            </TutorialRequestGuideLink>
          </div>
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
                    className="group inline-flex w-56 items-center justify-between border-b-2 border-[#146dff] py-3 text-base font-semibold text-white transition-colors hover:text-[#5f96ff] focus-visible:ring-2 focus-visible:ring-[#5f96ff] focus-visible:outline-none"
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

            <aside className="border-l border-white/15 pl-7 md:py-1">
              <div className="flex items-start justify-between gap-5">
                <Image
                  src="/icons/django.svg"
                  alt="Django"
                  width={148}
                  height={52}
                  className="h-9 w-auto invert"
                />
                <span className="font-mono text-xs font-bold tracking-[0.04em] text-zinc-300">
                  Django 5.2
                </span>
              </div>
              <p className="mt-7 max-w-64 text-3xl leading-[1.08] font-medium tracking-[-0.035em] text-white">
                A 35-minute production runbook.
              </p>
              <dl className="mt-7 border-t border-white/15 text-sm">
                <div className="grid grid-cols-[4.5rem_1fr] gap-3 border-b border-white/15 py-3">
                  <dt className="font-mono text-[13px] font-bold text-zinc-300">
                    RUNTIME
                  </dt>
                  <dd className="font-semibold text-white">Gunicorn</dd>
                </div>
                <div className="grid grid-cols-[4.5rem_1fr] gap-3 border-b border-white/15 py-3">
                  <dt className="font-mono text-[13px] font-bold text-zinc-300">
                    STATIC
                  </dt>
                  <dd className="font-semibold text-white">WhiteNoise</dd>
                </div>
                <div className="grid grid-cols-[4.5rem_1fr] gap-3 border-b border-white/15 py-3">
                  <dt className="font-mono text-[13px] font-bold text-zinc-300">
                    DATA
                  </dt>
                  <dd className="font-semibold text-white">PostgreSQL</dd>
                </div>
                <div className="grid grid-cols-[4.5rem_1fr] gap-3 border-b border-white/15 py-3">
                  <dt className="font-mono text-[13px] font-bold text-zinc-300">
                    RESULT
                  </dt>
                  <dd className="font-semibold text-[#44b78b]">HTTPS · 200</dd>
                </div>
              </dl>
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
