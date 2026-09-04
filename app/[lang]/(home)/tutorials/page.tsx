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
    marker: '01.A',
    title: 'Public HTTPS',
    status: 'Reachable',
    value: 'django-tasks-mpbrofzu',
    evidence: 'HTTPS :443 · create/read verified',
  },
  {
    marker: '01.B',
    title: 'Django container',
    status: 'Running',
    value: 'Gunicorn + WhiteNoise',
    evidence: 'WSGI :8000 · 1 replica',
  },
  {
    marker: '01.C',
    title: 'PostgreSQL',
    status: 'Attached',
    value: 'Private connection',
    evidence: 'PostgreSQL :5432 · public access disabled',
  },
] as const;

const DJANGO_GUIDE_CHAPTERS = [
  {
    title: 'Prepare Django for production',
    detail: 'Configure Gunicorn and WhiteNoise.',
    hash: '#prepare-django-for-production',
    image: '/images/tutorials/django/django-sealos-project-ops-running.webp',
    imageAlt: 'Public HTTPS service captured in the live Sealos project',
    imageSize: '290% auto',
    imagePosition: '12% 47%',
    imageClassName: 'brightness-150 contrast-110 saturate-75',
    proofLabel: 'Public address',
    proofValue: 'Reachable',
  },
  {
    title: 'Deploy with Sealos Skills',
    detail: 'Connect the application and database.',
    hash: '#deploy-with-sealos-skills',
    image: '/images/tutorials/django/django-sealos-project-ops-running.webp',
    imageAlt: 'Running Django container captured in the live Sealos project',
    imageSize: '290% auto',
    imagePosition: '50% 47%',
    imageClassName: 'brightness-150 contrast-110 saturate-75',
    proofLabel: 'Django container',
    proofValue: 'Running',
  },
  {
    title: 'Verify the live application',
    detail: 'Confirm the HTTPS create/read flow.',
    hash: '#verify-the-live-django-application',
    image: '/images/tutorials/django/django-sealos-live-app-https-proof.webp',
    imageAlt: 'Live Django task application after deployment',
    imageSize: '100% auto',
    imagePosition: '50% 47%',
    imageClassName: 'brightness-65 contrast-125 saturate-75',
    proofLabel: 'Create + read',
    proofValue: 'Verified',
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
        <figure>
          <figcaption className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <span className="text-2xl font-semibold tracking-tight text-white">
              Production trace / DJANGO-01
            </span>
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <span className="size-2 rounded-full bg-emerald-400" />
              Captured from a live project
            </span>
          </figcaption>

          <div className="border-y border-white/15 bg-[#0d1016] px-6 py-5 text-white">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-sm font-semibold text-zinc-300">
                Request enters the public service
              </span>
              <code className="inline-flex items-center gap-3 text-sm font-semibold text-zinc-300">
                GET /<span className="text-emerald-400">200 OK</span>
              </code>
            </div>

            <div className="relative mt-5">
              <span
                className="absolute top-20 right-3 left-3 hidden h-1 bg-[#146dff] md:block"
                aria-hidden="true"
              />
              <span
                className="absolute top-20 left-1/4 hidden size-0 -translate-x-1/2 -translate-y-1/2 border-y-[6px] border-l-[10px] border-y-transparent border-l-[#146dff] md:block"
                aria-hidden="true"
              />
              <span
                className="absolute top-20 left-3/4 hidden size-0 -translate-x-1/2 -translate-y-1/2 border-y-[6px] border-l-[10px] border-y-transparent border-l-[#146dff] md:block"
                aria-hidden="true"
              />

              <ol className="grid gap-8 md:grid-cols-3 md:gap-0">
                {DEPLOYMENT_NODES.map((node) => (
                  <li
                    key={node.marker}
                    className="relative flex min-w-0 flex-col items-center text-center first:items-start first:text-left last:items-end last:text-right"
                  >
                    <span className="font-mono text-xs font-semibold tracking-[0.1em] text-[#146dff]">
                      {node.marker}
                    </span>
                    <h3 className="mt-2 text-2xl font-semibold tracking-[-0.035em]">
                      {node.title}
                    </h3>
                    <span className="relative z-10 mt-5 flex size-6 items-center justify-center rounded-full bg-[#090909] ring-3 ring-[#146dff]">
                      <span className="size-2.5 rounded-full bg-[#146dff]" />
                    </span>
                    <code className="mt-5 block text-sm font-semibold text-zinc-100">
                      {node.value}
                    </code>
                    <span className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-emerald-400">
                      <span className="size-2 rounded-full bg-emerald-400" />
                      {node.status}
                    </span>
                    <span className="mt-3 text-xs text-zinc-400">
                      {node.evidence}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <nav
            className="mt-10 border-t border-white/10 pt-7"
            aria-label="Guide chapters"
          >
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h3 className="text-2xl leading-tight font-semibold tracking-tight text-white">
                Inside the 35-minute guide
              </h3>
              <p className="max-w-lg text-sm leading-6 text-zinc-400">
                Three field-tested chapters, each tied to visible production
                evidence.
              </p>
            </div>
            <ol className="mt-6 grid border-y border-white/15 md:grid-cols-3 md:divide-x md:divide-white/15">
              {DJANGO_GUIDE_CHAPTERS.map((chapter, index) => (
                <li
                  key={chapter.hash}
                  className="border-b border-white/15 md:border-b-0"
                >
                  <Link
                    href={`${tutorial.url}${chapter.hash}`}
                    className="group block h-full p-5 focus-visible:ring-2 focus-visible:ring-[#5f96ff] focus-visible:outline-none md:p-6"
                  >
                    <span className="mb-3 flex items-center justify-between font-mono text-xs font-semibold">
                      <span className="text-[#5f96ff]">0{index + 1}</span>
                      <span className="text-zinc-500">Evidence capture</span>
                    </span>
                    <span className="relative block h-40 overflow-hidden bg-[#08111f]">
                      <span
                        role="img"
                        aria-label={chapter.imageAlt}
                        className={`absolute inset-3 bg-no-repeat transition-opacity duration-500 group-hover:opacity-100 ${chapter.imageClassName}`}
                        style={{
                          backgroundImage: `url(${chapter.image})`,
                          backgroundPosition: chapter.imagePosition,
                          backgroundSize: chapter.imageSize,
                        }}
                      />
                      <span className="absolute inset-3 ring-1 ring-white/10 ring-inset" />
                      <span className="absolute right-3 bottom-3 left-3 flex items-center justify-between bg-[#06090e]/90 px-3 py-2 text-xs">
                        <span className="text-zinc-300">
                          {chapter.proofLabel}
                        </span>
                        <strong className="inline-flex items-center gap-2 font-semibold text-emerald-400">
                          <span className="size-1.5 rounded-full bg-emerald-400" />
                          {chapter.proofValue}
                        </strong>
                      </span>
                    </span>
                    <strong className="mt-5 inline-flex items-center gap-3 text-lg font-semibold text-zinc-100 transition-colors group-hover:text-[#5f96ff]">
                      {chapter.title}
                      <ArrowRight
                        size={16}
                        className="text-zinc-500 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:text-[#5f96ff]"
                        aria-hidden="true"
                      />
                    </strong>
                    <span className="mt-2 block text-sm text-zinc-300">
                      {chapter.detail}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        </figure>
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
        <section className="container -mt-24 pt-32 pb-12">
          <p className="text-sm font-semibold text-[#5f96ff]">
            Field note 01 · Django 5.2 · Live evidence
          </p>
          <h1 className="mt-5 text-5xl leading-[0.92] font-medium tracking-[-0.055em] text-white md:text-[5.75rem]">
            Deploy Django on Sealos
          </h1>
          <div className="mt-8 grid gap-6 md:grid-cols-12 md:items-end md:gap-8">
            <p className="max-w-2xl text-base leading-7 text-zinc-300 md:col-span-7">
              Build a Django 5.2 Task app, prepare Gunicorn, WhiteNoise, and
              PostgreSQL, then deploy it and verify a live create/read flow.
            </p>
            {firstTutorial && (
              <div className="flex flex-wrap items-center gap-5 md:col-span-5 md:justify-end">
                <span className="inline-flex items-center gap-2 text-sm text-zinc-400">
                  <BookOpen size={14} aria-hidden="true" />
                  {firstTutorial.estimatedReadingTime} · 3 proofs ·{' '}
                  <span className="text-emerald-400">HTTP 200</span>
                </span>
                <Link
                  href={firstTutorial.url}
                  className="group inline-flex h-11 items-center rounded-sm bg-[#146dff] px-5 text-sm font-semibold whitespace-nowrap text-white transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-[#0f5dd6] focus-visible:ring-2 focus-visible:ring-[#5f96ff] focus-visible:outline-none active:translate-y-0"
                >
                  Read tutorial
                  <ArrowRight
                    size={15}
                    className="ml-3 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            )}
          </div>
        </section>

        <section
          id="published-tutorials"
          className="container scroll-mt-28 border-t border-white/10 pt-10 pb-12"
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

          <section className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 pt-7">
            <h2 className="text-2xl font-semibold tracking-tight text-white">
              Missing your stack?
            </h2>
            <p className="text-sm leading-6 text-zinc-400">
              Share the deployment job you need.
            </p>
            <TutorialRequestGuideLink className="group inline-flex shrink-0 items-center border-b border-[#146dff] py-1 text-sm font-semibold text-[#5f96ff] transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-white hover:text-white focus-visible:ring-2 focus-visible:ring-[#5f96ff] focus-visible:outline-none">
              Request the next field note
              <ArrowRight
                size={16}
                className="ml-3 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1"
                aria-hidden="true"
              />
            </TutorialRequestGuideLink>
          </section>
        </section>
      </main>
    </>
  );
}
