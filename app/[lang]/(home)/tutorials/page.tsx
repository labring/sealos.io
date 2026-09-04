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
          <figure>
            <figcaption className="mb-5 text-2xl font-semibold tracking-tight text-white">
              Django deployment receipt
            </figcaption>

            <div className="overflow-hidden bg-[#e5e7e4] text-[#101318]">
              <div className="grid gap-2 border-b border-zinc-400/50 px-6 py-4 sm:px-8 md:grid-cols-12 md:items-center md:gap-x-6">
                <span className="text-xs font-bold tracking-[0.12em] text-[#146dff] md:col-span-6">
                  DJANGO 5.2 / CREATE + READ
                </span>
                <code className="text-xs font-semibold text-zinc-600 md:col-span-6 md:text-right">
                  response.html · run 01
                </code>
              </div>

              <ol className="divide-y divide-zinc-400/50 px-6 sm:px-8">
                {DJANGO_REQUEST_TRACE.map((step) => (
                  <li
                    key={step.marker}
                    className="grid grid-cols-[3rem_minmax(0,1fr)] gap-x-4 gap-y-1 py-4 md:grid-cols-12 md:items-center md:gap-x-6 md:py-5"
                  >
                    <span className="row-span-4 font-mono text-2xl font-medium tracking-[-0.08em] text-[#146dff] md:col-span-1 md:row-span-1">
                      {step.marker}
                    </span>
                    <span className="col-start-2 font-mono text-xs font-bold tracking-[0.08em] text-zinc-600 md:col-span-2 md:col-start-auto">
                      {step.label}
                    </span>
                    <code className="col-start-2 text-base font-bold text-[#101318] md:col-span-3 md:col-start-auto">
                      {step.title}
                    </code>
                    <code className="col-start-2 text-sm text-zinc-600 md:col-span-4 md:col-start-auto">
                      {step.evidence}
                    </code>
                    <strong className="col-start-2 font-mono text-sm font-bold text-[#146dff] md:col-span-2 md:col-start-auto md:text-right">
                      {step.transport}
                    </strong>
                  </li>
                ))}
              </ol>

              <div className="grid gap-2 bg-[#146dff] px-6 py-4 text-white sm:px-8 md:grid-cols-12 md:items-center md:gap-x-6">
                <span className="font-mono text-xs font-bold tracking-[0.08em] md:col-span-3">
                  ✓ PERSISTED TASK
                </span>
                <strong className="text-sm font-semibold md:col-span-6">
                  Runtime proof from Sealos
                </strong>
                <code className="text-xs font-semibold text-blue-100 md:col-span-3 md:text-right">
                  POST → 302 → GET → 200
                </code>
              </div>
            </div>
          </figure>

          <nav
            className="mt-10 border-t border-white/10 pt-7"
            aria-label="Guide chapters"
          >
            <div className="grid gap-3 md:grid-cols-12 md:items-end md:gap-x-6">
              <p className="text-sm font-semibold text-[#5f96ff] md:col-span-2">
                Inside the guide
              </p>
              <h3 className="text-2xl leading-tight font-semibold tracking-tight text-white md:col-span-5">
                Three decisive checks. 35 minutes.
              </h3>
              <p className="text-sm leading-6 text-zinc-300 md:col-span-5">
                Move from a local Django project to a working production
                service.
              </p>
            </div>
            <ol className="mt-7 grid gap-8 border-t border-white/15 pt-7 md:grid-cols-12 md:gap-x-6">
              {DJANGO_GUIDE_CHAPTERS.map((chapter, index) => (
                <li key={chapter.hash} className="md:col-span-4">
                  <Link
                    href={`${tutorial.url}${chapter.hash}`}
                    className="group block h-full focus-visible:ring-2 focus-visible:ring-[#5f96ff] focus-visible:outline-none"
                  >
                    <span className="flex items-center justify-between gap-4">
                      <span className="font-mono text-3xl font-medium tracking-[-0.08em] text-[#5f96ff]">
                        0{index + 1}
                      </span>
                      <ArrowRight
                        size={16}
                        className="text-zinc-400 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:text-[#5f96ff]"
                        aria-hidden="true"
                      />
                    </span>
                    <strong className="mt-6 block text-lg font-semibold text-zinc-100 transition-colors group-hover:text-[#5f96ff]">
                      {chapter.title}
                    </strong>
                    <span className="mt-3 block max-w-sm text-sm leading-6 text-zinc-300">
                      {chapter.detail}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
            <div className="mt-8 grid md:grid-cols-12 md:gap-x-6">
              <TutorialRequestGuideLink className="group inline-flex items-center justify-self-start border-b border-[#146dff] py-1 text-sm font-semibold text-[#5f96ff] transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-white hover:text-white focus-visible:ring-2 focus-visible:ring-[#5f96ff] focus-visible:outline-none md:col-span-5 md:col-start-8">
                Request a different stack
                <ArrowRight
                  size={16}
                  className="ml-3 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </TutorialRequestGuideLink>
            </div>
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
        <section className="container -mt-24 grid pt-32 pb-12 md:grid-cols-12 md:items-start md:gap-x-6">
          <div className="md:col-span-6">
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
          <aside className="mt-9 md:col-span-5 md:col-start-8 md:mt-0 md:self-end">
            <p className="text-sm font-semibold text-[#5f96ff]">
              What you will ship
            </p>
            <dl className="mt-5 border-t border-white/15">
              <div className="flex items-baseline justify-between gap-4 border-b border-white/15 py-4">
                <dt className="text-sm text-zinc-300">Runtime</dt>
                <dd className="text-base font-semibold text-white">
                  Django 5.2
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-b border-white/15 py-4">
                <dt className="text-sm text-zinc-300">Data</dt>
                <dd className="text-base font-semibold text-white">
                  PostgreSQL
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-b border-white/15 py-4">
                <dt className="text-sm text-zinc-300">Edge</dt>
                <dd className="text-base font-semibold text-white">
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
        </section>
      </main>
    </>
  );
}
