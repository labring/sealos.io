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
    value: 'django-tasks-mpbrofzu.us...',
  },
  {
    marker: '01.B',
    title: 'Django container',
    status: 'Running',
    value: 'Gunicorn + WhiteNoise',
  },
  {
    marker: '01.C',
    title: 'PostgreSQL',
    status: 'Attached',
    value: 'Private connection',
  },
] as const;

const DJANGO_GUIDE_CHAPTERS = [
  {
    title: 'Prepare Django for production',
    detail: 'Configure Gunicorn and WhiteNoise.',
    hash: '#prepare-django-for-production',
  },
  {
    title: 'Deploy with Sealos Skills',
    detail: 'Connect the application and database.',
    hash: '#deploy-with-sealos-skills',
  },
  {
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
        <figure>
          <figcaption className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <span className="text-2xl font-semibold tracking-tight text-white">
              Production trace / DJANGO-01
            </span>
            <span className="inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.08em] text-emerald-400 uppercase">
              <span className="size-2 rounded-full bg-emerald-400" />
              Captured from a live project
            </span>
          </figcaption>

          <div className="grid overflow-hidden bg-[#f1f1ed] text-zinc-950 md:grid-cols-[11rem_minmax(0,1fr)]">
            <aside className="flex min-h-64 flex-col justify-between bg-[#146dff] p-7 text-white">
              <p className="font-mono text-xs font-semibold tracking-[0.12em] uppercase">
                HTTP result
              </p>
              <p>
                <strong className="block text-6xl leading-none font-semibold tracking-[-0.06em]">
                  200
                </strong>
                <span className="mt-1 block text-lg font-semibold">OK</span>
              </p>
              <p className="text-xs leading-5 font-medium text-blue-100">
                Public ingress
                <br />
                Private data
              </p>
            </aside>

            <div className="px-7 py-7 md:px-9">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="font-mono text-xs font-semibold tracking-[0.1em] text-[#146dff] uppercase">
                  Verified request path
                </span>
                <code className="text-xs font-semibold text-zinc-600">
                  GET / → response.html
                </code>
              </div>

              <ol className="mt-7 grid gap-8 md:grid-cols-3 md:gap-10">
                {DEPLOYMENT_NODES.map((node, index) => (
                  <li key={node.marker} className="relative min-w-0">
                    <span className="font-mono text-xs font-semibold tracking-[0.1em] text-[#146dff]">
                      {node.marker}
                    </span>
                    <h3 className="mt-2 text-xl font-semibold tracking-tight">
                      {node.title}
                    </h3>
                    <div className="relative mt-5">
                      {index < DEPLOYMENT_NODES.length - 1 && (
                        <span
                          className="absolute top-1/2 left-2.5 hidden h-0.5 w-[calc(100%+2.5rem)] -translate-y-1/2 bg-[#146dff] md:block"
                          aria-hidden="true"
                        >
                          <span className="absolute top-1/2 left-1/2 size-0 -translate-x-1/2 -translate-y-1/2 border-y-4 border-l-7 border-y-transparent border-l-[#146dff]" />
                        </span>
                      )}
                      <span className="relative z-10 flex size-5 items-center justify-center rounded-full bg-[#f1f1ed] ring-2 ring-[#146dff]">
                        <span className="size-2 rounded-full bg-[#146dff]" />
                      </span>
                    </div>
                    <code className="mt-5 block truncate text-xs font-semibold text-zinc-900">
                      {node.value}
                    </code>
                    <span className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-emerald-700">
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                      {node.status}
                    </span>
                  </li>
                ))}
              </ol>

              <div className="mt-6 grid gap-2 border-t border-zinc-300 pt-4 font-mono text-[11px] font-semibold tracking-[0.04em] text-zinc-600 uppercase md:grid-cols-3 md:gap-10">
                <span>HTTPS :443 · 200</span>
                <span>WSGI :8000 · 1 replica</span>
                <span>PostgreSQL :5432 · private</span>
              </div>
            </div>
          </div>

          <nav
            className="mt-12 grid gap-8 border-t border-white/10 pt-8 md:grid-cols-12 md:gap-10"
            aria-label="Guide chapters"
          >
            <div className="md:col-span-4">
              <p className="font-mono text-xs font-semibold tracking-[0.12em] text-[#5f96ff] uppercase">
                Guide anatomy
              </p>
              <h3 className="mt-3 max-w-xs text-2xl leading-tight font-semibold tracking-tight text-white">
                35 minutes. Three decisive checks.
              </h3>
              <p className="mt-3 max-w-xs text-sm leading-6 text-zinc-400">
                Follow the shortest route from a local Django project to a
                verified production service.
              </p>
            </div>
            <ol className="border-t border-white/15 md:col-span-8">
              {DJANGO_GUIDE_CHAPTERS.map((chapter, index) => (
                <li key={chapter.hash} className="border-b border-white/15">
                  <Link
                    href={`${tutorial.url}${chapter.hash}`}
                    className="group grid items-center gap-x-5 rounded-sm py-5 focus-visible:ring-2 focus-visible:ring-[#5f96ff] focus-visible:outline-none sm:grid-cols-[3.5rem_minmax(0,1fr)]"
                  >
                    <span className="font-mono text-3xl font-medium tracking-[-0.08em] text-[#5f96ff]">
                      0{index + 1}
                    </span>
                    <span>
                      <strong className="inline-flex items-center gap-3 text-base font-semibold text-zinc-100 transition-colors group-hover:text-[#5f96ff]">
                        {chapter.title}
                        <ArrowRight
                          size={15}
                          className="text-zinc-500 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:text-[#5f96ff]"
                          aria-hidden="true"
                        />
                      </strong>
                      <span className="mt-1 block text-sm text-zinc-400">
                        {chapter.detail}
                      </span>
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
        <section className="container -mt-24 grid pt-32 pb-12 md:grid-cols-12 md:items-start md:gap-8">
          <div className="md:col-span-8">
            <p className="text-xs font-semibold tracking-[0.18em] text-[#5f96ff] uppercase">
              Field note 01 / Django 5.2 / Live evidence
            </p>
            <h1 className="mt-5 text-5xl leading-[0.92] font-medium tracking-[-0.05em] text-white md:text-[4.75rem]">
              <span className="block">Deploy Django</span>
              <span className="mt-2 block">on Sealos</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-300">
              Build a Django 5.2 Task app, prepare Gunicorn, WhiteNoise, and
              PostgreSQL, then deploy it and verify a live create/read flow.
            </p>
            {firstTutorial && (
              <div className="mt-7 flex flex-wrap items-center gap-5">
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
                <span className="inline-flex items-center gap-2 text-sm text-zinc-400">
                  <BookOpen size={14} aria-hidden="true" />
                  {firstTutorial.estimatedReadingTime} · Django · Core
                  deployment
                </span>
              </div>
            )}
          </div>
          <div className="mt-8 md:col-span-4 md:mt-0 md:self-stretch md:border-l md:border-[#146dff] md:pl-8">
            <p className="font-mono text-xs font-semibold tracking-[0.12em] text-[#5f96ff] uppercase">
              Run summary
            </p>
            <dl className="mt-5 border-t border-white/15">
              <div className="flex items-baseline justify-between border-b border-white/15 py-3">
                <dt className="text-sm text-zinc-400">Repo to live</dt>
                <dd className="text-3xl font-medium tracking-[-0.05em] text-white">
                  35m
                </dd>
              </div>
              <div className="flex items-baseline justify-between border-b border-white/15 py-3">
                <dt className="text-sm text-zinc-400">Proofs captured</dt>
                <dd className="text-3xl font-medium tracking-[-0.05em] text-white">
                  03
                </dd>
              </div>
              <div className="flex items-baseline justify-between border-b border-white/15 py-3">
                <dt className="text-sm text-zinc-400">Final response</dt>
                <dd className="font-mono text-lg font-semibold text-emerald-400">
                  200 OK
                </dd>
              </div>
            </dl>
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
            <TutorialRequestGuideLink className="group inline-flex h-10 shrink-0 items-center rounded-sm border border-[#146dff]/70 px-4 text-sm font-semibold text-[#5f96ff] transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-[#146dff] hover:bg-[#146dff] hover:text-white focus-visible:ring-2 focus-visible:ring-[#5f96ff] focus-visible:outline-none">
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
