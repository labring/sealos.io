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

const DEPLOYMENT_NODES = [
  {
    marker: 'A',
    x: 150,
    y: 220,
    position: { left: '12.5%', top: '65.5%' },
    title: 'Public HTTPS',
    evidence: 'GET / HTTP/2',
    status: 'Reachable',
    detail: 'TLS ingress · :443',
  },
  {
    marker: 'B',
    x: 450,
    y: 140,
    position: { left: '37.5%', top: '41.7%' },
    title: 'Django container',
    evidence: 'config.wsgi:application',
    status: 'Running',
    detail: ':8000 · 1 replica',
  },
  {
    marker: 'C',
    x: 750,
    y: 194,
    position: { left: '62.5%', top: '57.7%' },
    title: 'PostgreSQL',
    evidence: 'DATABASE_URL → :5432',
    status: 'Attached',
    detail: 'Private network',
  },
  {
    marker: 'D',
    x: 1050,
    y: 100,
    position: { left: '87.5%', top: '29.8%' },
    title: 'Browser response',
    evidence: 'HTTP/2 200 · response.html',
    status: 'Verified',
    detail: 'Task persisted',
  },
] as const;

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
                Production trace
              </span>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#44b78b]">
                <span
                  className="size-2 rounded-full bg-current"
                  aria-hidden="true"
                />
                Verified live path
              </span>
            </figcaption>

            <div className="relative hidden h-[22rem] overflow-hidden border-b border-white/15 bg-[#0d1015] text-white md:block">
              <svg
                viewBox="0 0 1200 336"
                preserveAspectRatio="none"
                className="absolute inset-0 size-full"
                aria-hidden="true"
              >
                <path
                  d="M150 220 L450 140 L750 194"
                  fill="none"
                  stroke="#146dff"
                  strokeWidth="4"
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  d="M750 194 L1050 100"
                  fill="none"
                  stroke="#44b78b"
                  strokeWidth="4"
                  vectorEffect="non-scaling-stroke"
                />
                {DEPLOYMENT_NODES.map((node) => (
                  <line
                    key={`stem-${node.marker}`}
                    x1={node.x}
                    x2={node.x}
                    y1={node.y + 10}
                    y2={node.y + 24}
                    stroke="#71717a"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
                {DEPLOYMENT_NODES.map((node, index) => (
                  <circle
                    key={node.marker}
                    cx={node.x}
                    cy={node.y}
                    r="10"
                    fill={
                      index === DEPLOYMENT_NODES.length - 1
                        ? '#44b78b'
                        : '#146dff'
                    }
                    stroke="#0d1015"
                    strokeWidth="7"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
              </svg>

              <ol className="absolute inset-0">
                {DEPLOYMENT_NODES.map((node, index) => (
                  <li
                    key={node.marker}
                    style={node.position}
                    className="absolute w-72 -translate-x-1/2 translate-y-7 text-center"
                  >
                    <span className="font-mono text-sm font-bold tracking-[0.12em] text-[#5f96ff]">
                      {node.marker}
                    </span>
                    <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
                      {node.title}
                    </h3>
                    <code className="mt-3 block truncate font-mono text-[15px] font-bold text-zinc-100">
                      <span className="text-zinc-400" aria-hidden="true">
                        &gt;{' '}
                      </span>
                      {node.evidence}
                    </code>
                    <span
                      className={`mt-2 block font-mono text-sm font-bold tracking-[0.01em] uppercase ${
                        index === DEPLOYMENT_NODES.length - 1
                          ? 'text-[#44b78b]'
                          : 'text-[#5f96ff]'
                      }`}
                    >
                      {node.status}
                      <span className="text-zinc-400"> · {node.detail}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <ol className="divide-y divide-white/10 border-b border-white/15 bg-[#0d1015] md:hidden">
              {DEPLOYMENT_NODES.map((node, index) => (
                <li key={node.marker} className="relative py-6 pl-8">
                  <span
                    className={`absolute top-7 left-0 size-3 rounded-full ${
                      index === DEPLOYMENT_NODES.length - 1
                        ? 'bg-[#44b78b]'
                        : 'bg-[#146dff]'
                    }`}
                    aria-hidden="true"
                  />
                  <span className="font-mono text-xs font-bold tracking-[0.12em] text-[#5f96ff]">
                    {node.marker}
                  </span>
                  <h3 className="mt-1 text-xl font-semibold text-white">
                    {node.title}
                  </h3>
                  <code className="mt-3 block font-mono text-xs font-bold text-zinc-300">
                    {node.evidence}
                  </code>
                  <span
                    className={`mt-2 block font-mono text-xs font-bold uppercase ${
                      index === DEPLOYMENT_NODES.length - 1
                        ? 'text-[#44b78b]'
                        : 'text-[#5f96ff]'
                    }`}
                  >
                    {node.status} · {node.detail}
                  </span>
                </li>
              ))}
            </ol>
          </figure>

          <nav className="border-b border-white/15" aria-label="Guide chapters">
            <div className="flex flex-wrap items-end justify-between gap-5 py-7">
              <div>
                <p className="text-sm font-semibold text-[#5f96ff]">
                  Inside the guide
                </p>
                <h3 className="mt-4 text-3xl leading-none font-medium tracking-[-0.04em] text-white">
                  Three decisive checks
                </h3>
              </div>
              <p className="max-w-sm text-sm leading-6 text-zinc-300">
                Configure, deploy, then verify the public flow.
              </p>
            </div>

            <ol className="border-t border-white/15">
              {DJANGO_GUIDE_CHAPTERS.map((chapter) => (
                <li
                  key={chapter.hash}
                  className="border-b border-white/15 last:border-b-0"
                >
                  <Link
                    href={`${tutorial.url}${chapter.hash}`}
                    className="group grid items-center gap-x-8 py-5 focus-visible:ring-2 focus-visible:ring-[#5f96ff] focus-visible:outline-none md:grid-cols-[8rem_minmax(20rem,1.5fr)_minmax(14rem,1fr)_1.25rem]"
                  >
                    <span className="font-mono text-xs font-bold tracking-[0.06em] uppercase">
                      <span
                        className={
                          chapter.phase === 'Verify'
                            ? 'text-[#44b78b]'
                            : 'text-[#5f96ff]'
                        }
                      >
                        {chapter.phase}
                      </span>
                      <span className="mt-2 block text-zinc-400">
                        {chapter.result}
                      </span>
                    </span>
                    <span className="mt-3 md:mt-0">
                      <strong className="block text-xl font-semibold tracking-[-0.025em] text-white transition-colors group-hover:text-[#5f96ff]">
                        {chapter.title}
                      </strong>
                      <span className="mt-1 block text-sm leading-6 text-zinc-300">
                        {chapter.detail}
                      </span>
                    </span>
                    <code className="mt-3 truncate font-mono text-sm font-bold text-zinc-300 md:mt-0">
                      {chapter.evidence}
                    </code>
                    <ArrowRight
                      size={17}
                      className="mt-3 text-zinc-300 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:text-white md:mt-0"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ol>
          </nav>

          <div className="flex flex-wrap items-center justify-between gap-6 border-b border-white/15 py-6 text-white">
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
                    className="group inline-flex items-center gap-4 border-b border-[#146dff] py-2 text-sm font-semibold text-white transition-colors hover:text-[#5f96ff] focus-visible:ring-2 focus-visible:ring-[#5f96ff] focus-visible:outline-none"
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
