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
const DJANGO_LIVE_EVIDENCE =
  '/images/tutorials/django/django-sealos-live-app-https-proof.webp';

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

            <div className="overflow-hidden border-b border-white/15 bg-[#eef1f6]">
              <div className="flex min-h-12 flex-wrap items-center gap-4 border-b border-black/15 bg-[#e4e8ee] px-5 py-2 text-[#10131a]">
                <span className="flex gap-1.5" aria-hidden="true">
                  <span className="size-2 rounded-full bg-[#ff5f57]" />
                  <span className="size-2 rounded-full bg-[#febc2e]" />
                  <span className="size-2 rounded-full bg-[#28c840]" />
                </span>
                <span className="min-w-0 flex-1 truncate border border-black/15 bg-white px-4 py-1.5 font-mono text-xs font-semibold">
                  https://django-tasks-mpbrofzu.usw.sealos.io/
                </span>
                <time className="font-mono text-[11px] font-bold tracking-[0.04em] text-zinc-600 uppercase">
                  Sep 03 2026 · 14:22 UTC
                </time>
              </div>

              <div className="grid md:grid-cols-[1fr_19rem]">
                <div className="relative aspect-video overflow-hidden bg-[#eef1f6] md:aspect-auto md:min-h-[26rem]">
                  <Image
                    src={DJANGO_LIVE_EVIDENCE}
                    alt="Live Django task application showing a saved task after a successful HTTPS create and read request"
                    fill
                    className="scale-[1.42] object-cover object-center"
                    priority
                    quality={100}
                    sizes="(max-width: 768px) 100vw, 75vw"
                  />
                </div>

                <aside className="flex flex-col border-l-2 border-[#146dff] bg-[#0d1015] p-7 text-white">
                  <div className="flex items-center justify-between gap-4 font-mono text-xs font-bold tracking-[0.06em] uppercase">
                    <span className="text-[#5f96ff]">Request trace</span>
                    <span className="text-zinc-400">03 / Verify</span>
                  </div>
                  <ol className="mt-8 border-t border-white/20">
                    <li className="border-b border-white/20 py-4">
                      <div className="flex items-center justify-between gap-4">
                        <code className="font-mono text-sm font-bold">
                          POST /
                        </code>
                        <span className="font-mono text-xs font-bold text-zinc-400">
                          302
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-zinc-400">
                        Task accepted · redirect
                      </p>
                    </li>
                    <li className="border-b border-white/20 py-4">
                      <div className="flex items-center justify-between gap-4">
                        <code className="font-mono text-sm font-bold">
                          GET /
                        </code>
                        <span className="font-mono text-xs font-bold text-[#44b78b]">
                          200 OK
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-zinc-400">
                        Saved row returned
                      </p>
                    </li>
                    <li className="py-4">
                      <div className="flex items-center justify-between gap-4">
                        <code className="font-mono text-[11px] font-bold">
                          GET /static/tasks/app.css
                        </code>
                        <span className="font-mono text-xs font-bold text-[#44b78b]">
                          200 OK
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-zinc-400">
                        WhiteNoise asset served
                      </p>
                    </li>
                  </ol>
                  <div className="mt-auto flex items-center gap-3 border-t border-white/20 pt-5 text-sm font-semibold text-[#44b78b]">
                    <span className="size-2 rounded-full bg-current" />
                    Runtime proof persisted
                  </div>
                </aside>
              </div>
            </div>
          </figure>

          <nav
            className="mt-10 bg-[#f2f0e8] text-[#0a0a0a]"
            aria-label="Guide chapters"
          >
            <div className="flex flex-wrap items-end justify-between gap-6 p-8 md:px-10">
              <div>
                <p className="text-sm font-semibold text-[#146dff]">
                  Inside the guide
                </p>
                <h3 className="mt-4 text-4xl leading-none font-medium tracking-[-0.05em]">
                  Three decisive checks.
                </h3>
              </div>
              <p className="max-w-sm text-base leading-7 text-zinc-600">
                Configure, deploy, then verify the public flow.
              </p>
            </div>

            <ol className="border-t border-black/20 px-8 pb-8 md:px-10">
              {DJANGO_GUIDE_CHAPTERS.map((chapter, index) => (
                <li key={chapter.hash} className="border-b border-black/25">
                  <Link
                    href={`${tutorial.url}${chapter.hash}`}
                    className="group grid min-h-24 grid-cols-[2.5rem_1fr] items-center gap-5 py-5 focus-visible:ring-2 focus-visible:ring-[#146dff] focus-visible:outline-none md:grid-cols-[2.5rem_1.15fr_0.85fr]"
                  >
                    <span className="font-mono text-xl leading-none font-medium tracking-[-0.04em] text-zinc-500">
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
                      <strong className="mt-2 block text-xl leading-tight font-semibold tracking-[-0.03em] transition-colors group-hover:text-[#146dff]">
                        {chapter.title}
                      </strong>
                    </span>
                    <span className="col-start-2 text-sm leading-6 text-zinc-600 md:col-start-auto">
                      <span className="block">{chapter.detail}</span>
                      <code className="mt-2 block font-mono text-xs font-bold text-zinc-600">
                        {chapter.evidence}
                      </code>
                    </span>
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

            <aside className="flex flex-col border-l border-white/15 pl-7 md:py-1">
              <div className="flex items-end gap-5">
                <Image
                  src="/icons/django.svg"
                  alt="Django"
                  width={148}
                  height={52}
                  className="h-9 w-auto invert"
                />
                <span className="pb-1 font-mono text-xs font-bold tracking-[0.04em] text-zinc-300">
                  Django 5.2
                </span>
              </div>
              <div className="mt-8 flex items-end gap-4">
                <span className="text-[7rem] leading-[0.8] font-medium tracking-[-0.075em] text-white">
                  35
                </span>
                <span className="pb-1 font-mono text-xs font-bold tracking-[0.06em] text-zinc-300 uppercase">
                  Minutes
                  <span className="mt-1 block">Repo → HTTPS</span>
                </span>
              </div>
              <div className="mt-auto flex items-center justify-between gap-5 border-y border-white/15 py-4 font-mono text-xs font-bold tracking-[0.06em] uppercase">
                <span className="text-zinc-300">Field note 01</span>
                <span className="text-[#44b78b]">Verified</span>
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
