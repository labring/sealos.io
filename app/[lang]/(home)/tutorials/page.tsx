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

const DJANGO_REQUEST_TRACE = [
  {
    marker: '01',
    label: 'FORM POST',
    title: 'Task submitted',
    evidence: 'Runtime proof from Sealos',
    transport: 'POST / · CSRF',
  },
  {
    marker: '02',
    label: 'WSGI',
    title: 'Gunicorn',
    evidence: 'Django 5.2 application',
    transport: ':8000 · 1 replica',
  },
  {
    marker: '03',
    label: 'DATA',
    title: 'PostgreSQL',
    evidence: 'Task row committed',
    transport: ':5432 · private',
  },
  {
    marker: '04',
    label: 'BROWSER GET',
    title: '200 OK',
    evidence: 'Saved task returned',
    transport: 'HTTPS :443',
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
            <figcaption className="mb-5 text-2xl font-semibold tracking-tight text-white">
              Django deployment receipt
            </figcaption>

            <div className="overflow-hidden bg-[#e5e7e4] text-[#101318]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-400/50 px-6 py-4 sm:px-8">
                <span className="text-xs font-bold tracking-[0.12em] text-[#146dff]">
                  DJANGO 5.2 / CREATE + READ
                </span>
                <code className="text-xs font-semibold text-zinc-600">
                  response.html · run 01
                </code>
              </div>

              <ol className="grid gap-8 px-6 py-8 sm:px-8 md:grid-cols-4 md:gap-10 md:py-10">
                {DJANGO_REQUEST_TRACE.map((step, index) => (
                  <li key={step.marker} className="relative min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-mono text-xs font-bold text-[#146dff]">
                        {step.marker}
                      </span>
                      <span className="font-mono text-xs font-semibold text-zinc-500">
                        {step.label}
                      </span>
                    </div>
                    <h3 className="mt-5 text-xl font-semibold tracking-tight">
                      {step.title}
                    </h3>
                    <p className="mt-2 min-h-10 text-sm leading-5 text-zinc-600">
                      {step.evidence}
                    </p>

                    <div className="relative mt-6">
                      {index < DJANGO_REQUEST_TRACE.length - 1 && (
                        <span
                          className="absolute top-1/2 left-2.5 hidden h-0.5 w-[calc(100%+2.5rem)] -translate-y-1/2 bg-[#146dff] md:block"
                          aria-hidden="true"
                        >
                          <span className="absolute top-1/2 left-1/2 size-0 -translate-x-1/2 -translate-y-1/2 border-y-4 border-l-7 border-y-transparent border-l-[#146dff]" />
                        </span>
                      )}
                      <span className="relative z-10 flex size-5 items-center justify-center rounded-full bg-[#e5e7e4] ring-2 ring-[#146dff]">
                        <span className="size-2 rounded-full bg-[#146dff]" />
                      </span>
                    </div>

                    <code className="mt-5 block text-xs font-semibold text-zinc-700">
                      {step.transport}
                    </code>
                  </li>
                ))}
              </ol>

              <div className="grid gap-2 bg-[#146dff] px-6 py-4 text-white sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:gap-6 sm:px-8">
                <span className="font-mono text-xs font-bold tracking-[0.08em]">
                  ✓ PERSISTED TASK
                </span>
                <strong className="text-sm font-semibold">
                  Runtime proof from Sealos
                </strong>
                <code className="text-xs font-semibold text-blue-100">
                  POST → 302 → GET → 200
                </code>
              </div>
            </div>
          </figure>

          <nav
            className="mt-10 border-t border-white/10 pt-7"
            aria-label="Guide chapters"
          >
            <div className="grid gap-3 md:grid-cols-12 md:items-end md:gap-8">
              <p className="text-sm font-semibold text-[#5f96ff] md:col-span-3">
                Inside the guide
              </p>
              <h3 className="text-2xl leading-tight font-semibold tracking-tight text-white md:col-span-5">
                Three decisive checks. 35 minutes.
              </h3>
              <p className="max-w-sm text-sm leading-6 text-zinc-300 md:col-span-4">
                Move from a local Django project to a working production
                service.
              </p>
            </div>
            <ol className="mt-6 border-y border-white/15">
              {DJANGO_GUIDE_CHAPTERS.map((chapter, index) => (
                <li
                  key={chapter.hash}
                  className="border-b border-white/15 last:border-b-0"
                >
                  <Link
                    href={`${tutorial.url}${chapter.hash}`}
                    className="group grid grid-cols-[3rem_minmax(0,1fr)_1rem] items-center gap-x-5 py-4 focus-visible:ring-2 focus-visible:ring-[#5f96ff] focus-visible:outline-none sm:grid-cols-[3.5rem_minmax(0,1.15fr)_minmax(15rem,0.85fr)_1rem]"
                  >
                    <span className="font-mono text-2xl font-medium tracking-[-0.08em] text-[#5f96ff]">
                      0{index + 1}
                    </span>
                    <strong className="text-base font-semibold text-zinc-100 transition-colors group-hover:text-[#5f96ff]">
                      {chapter.title}
                    </strong>
                    <span className="col-start-2 mt-1 text-sm text-zinc-300 sm:col-start-auto sm:mt-0">
                      {chapter.detail}
                    </span>
                    <ArrowRight
                      size={15}
                      className="col-start-3 row-start-1 justify-self-end text-zinc-400 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:text-[#5f96ff] sm:col-start-auto sm:row-start-auto"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ol>
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
        <section className="container -mt-24 grid pt-32 pb-12 md:grid-cols-12 md:items-start md:gap-8">
          <div className="md:col-span-7">
            <p className="text-sm font-semibold text-[#5f96ff]">
              Deployment field note · 01
            </p>
            <h1 className="mt-5 text-5xl leading-[0.92] font-medium tracking-[-0.05em] text-white md:text-[4.75rem]">
              <span className="block">Deploy Django</span>
              <span className="mt-2 block">on Sealos</span>
            </h1>
            <p className="mt-6 max-w-[42rem] text-base leading-7 text-zinc-300">
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
                <span className="inline-flex items-center gap-2 text-sm text-zinc-300">
                  <BookOpen size={14} aria-hidden="true" />
                  {firstTutorial.estimatedReadingTime} · 3 chapters
                </span>
              </div>
            )}
          </div>
          <aside className="mt-9 md:col-span-5 md:mt-0">
            <p className="text-sm font-semibold text-[#5f96ff]">
              What you will ship
            </p>
            <dl className="mt-5 grid grid-cols-3 divide-x divide-white/15 border-y border-white/15">
              <div className="p-4 first:pl-0">
                <dt className="text-sm text-zinc-300">Runtime</dt>
                <dd className="mt-2 text-base font-semibold text-white">
                  Django 5.2
                </dd>
              </div>
              <div className="p-4">
                <dt className="text-sm text-zinc-300">Data</dt>
                <dd className="mt-2 text-base font-semibold text-white">
                  PostgreSQL
                </dd>
              </div>
              <div className="p-4 pr-0">
                <dt className="text-sm text-zinc-300">Edge</dt>
                <dd className="mt-2 text-base font-semibold text-white">
                  Public HTTPS
                </dd>
              </div>
            </dl>
          </aside>
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
            <p className="text-sm leading-6 text-zinc-300">
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
