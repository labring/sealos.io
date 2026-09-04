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
    result: 'Production settings locked',
    hash: '#prepare-django-for-production',
  },
  {
    phase: 'Deploy',
    title: 'Deploy with Sealos Skills',
    detail: 'Connect the application and database.',
    result: 'Service and database linked',
    hash: '#deploy-with-sealos-skills',
  },
  {
    phase: 'Verify',
    title: 'Verify the live application',
    detail: 'Confirm the HTTPS create/read flow.',
    result: 'HTTPS create/read confirmed',
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

            <div className="overflow-hidden border border-l-4 border-white/15 border-l-[#146dff] bg-[#b9bfbc] text-[#101318]">
              <dl className="grid border-b border-zinc-600/35 md:grid-cols-[7rem_repeat(3,minmax(0,1fr))] md:divide-x md:divide-zinc-600/35">
                <div className="px-5 py-3.5">
                  <dt className="text-xs font-bold tracking-[0.08em] text-zinc-600">
                    RUN
                  </dt>
                  <dd className="mt-1 font-mono text-xl font-bold text-[#146dff]">
                    01
                  </dd>
                </div>
                <div className="border-t border-zinc-600/35 px-6 py-3.5 sm:px-8 md:border-t-0">
                  <dt className="text-xs font-bold tracking-[0.08em] text-zinc-600">
                    RUNTIME
                  </dt>
                  <dd className="mt-1 flex items-center gap-3 text-base font-bold">
                    <Image
                      src="/icons/django.svg"
                      alt="Django"
                      width={72}
                      height={25}
                      className="h-5 w-auto"
                    />
                    <span>5.2</span>
                  </dd>
                </div>
                <div className="border-t border-zinc-600/35 px-6 py-3.5 sm:px-8 md:border-t-0">
                  <dt className="text-xs font-bold tracking-[0.08em] text-zinc-600">
                    DATA
                  </dt>
                  <dd className="mt-1 text-base font-bold">PostgreSQL</dd>
                </div>
                <div className="border-t border-zinc-600/35 px-6 py-3.5 sm:px-8 md:border-t-0">
                  <dt className="text-xs font-bold tracking-[0.08em] text-zinc-600">
                    EDGE
                  </dt>
                  <dd className="mt-1 text-base font-bold">Public HTTPS</dd>
                </div>
              </dl>

              <ol className="divide-y divide-zinc-600/35 px-6 sm:px-8">
                {DJANGO_REQUEST_TRACE.map((step) => (
                  <li
                    key={step.marker}
                    className="grid grid-cols-[3rem_minmax(0,1fr)] gap-x-4 gap-y-1 py-4 md:grid-cols-12 md:items-center md:gap-x-6"
                  >
                    <span className="row-span-4 font-mono text-2xl font-medium tracking-[-0.08em] text-[#146dff] md:col-span-1 md:row-span-1">
                      {step.marker}
                    </span>
                    <span className="col-start-2 text-xs font-bold tracking-[0.08em] text-zinc-600 md:col-span-2 md:col-start-auto">
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

              <div className="grid gap-2 bg-[#101318] px-6 py-3.5 text-white sm:px-8 md:grid-cols-12 md:items-center md:gap-x-6">
                <span className="font-mono text-xs font-bold tracking-[0.08em] text-emerald-400 md:col-span-3">
                  ✓ PERSISTED TASK
                </span>
                <strong className="text-sm font-semibold md:col-span-6">
                  Runtime proof from Sealos
                </strong>
                <code className="text-xs font-semibold text-zinc-300 md:col-span-3 md:text-right">
                  POST → 302 → GET → 200
                </code>
              </div>
            </div>
          </figure>

          <nav
            className="mt-10 border-t border-white/10 pt-7"
            aria-label="Guide chapters and next field note"
          >
            <div className="grid gap-4 md:grid-cols-12 md:items-end md:gap-x-6">
              <div className="md:col-span-9">
                <p className="text-sm font-semibold text-[#5f96ff]">
                  Inside the guide
                </p>
                <h3 className="mt-2 text-2xl leading-tight font-semibold tracking-tight text-white">
                  Three decisive checks. 35 minutes.
                </h3>
              </div>
              <p className="text-sm leading-6 text-zinc-300 md:col-span-3">
                Move from a local Django project to a working production
                service.
              </p>
            </div>
            <div className="mt-7 overflow-hidden border border-t-2 border-white/15 border-t-[#146dff] bg-[#111419]">
              <div className="flex items-center justify-between gap-4 border-b border-white/15 px-6 py-3.5">
                <span className="font-mono text-xs font-bold tracking-[0.08em] text-[#5f96ff]">
                  DEPLOYMENT PATH
                </span>
                <span className="text-sm font-semibold text-zinc-300">
                  3 verified stages
                </span>
              </div>
              <ol className="grid md:grid-cols-3 md:divide-x md:divide-white/15">
                {DJANGO_GUIDE_CHAPTERS.map((chapter, index) => (
                  <li
                    key={chapter.hash}
                    className="relative border-b border-white/15 last:border-b-0 md:border-b-0"
                  >
                    <Link
                      href={`${tutorial.url}${chapter.hash}`}
                      className="group flex min-h-60 flex-col p-6 text-left focus-visible:ring-2 focus-visible:ring-[#5f96ff] focus-visible:outline-none"
                    >
                      <span className="flex items-baseline justify-between gap-4">
                        <span className="font-mono text-4xl font-medium tracking-[-0.08em] text-[#5f96ff]">
                          0{index + 1}
                        </span>
                        <span className="text-sm font-semibold text-zinc-300">
                          {chapter.phase}
                        </span>
                      </span>
                      <strong className="mt-7 block text-2xl leading-tight font-semibold text-white transition-colors group-hover:text-[#5f96ff]">
                        {chapter.title}
                      </strong>
                      <span className="mt-3 block text-sm leading-6 text-zinc-300">
                        {chapter.detail}
                      </span>
                      <span className="mt-auto border-t border-white/10 pt-4 text-base font-semibold text-[#00dca0]">
                        ✓ {chapter.result}
                      </span>
                    </Link>
                    {index < DJANGO_GUIDE_CHAPTERS.length - 1 && (
                      <span
                        className="absolute top-1/2 -right-4 z-10 hidden size-8 -translate-y-1/2 items-center justify-center border border-white/20 bg-[#111419] text-[#5f96ff] md:flex"
                        aria-hidden="true"
                      >
                        <ArrowRight size={15} />
                      </span>
                    )}
                  </li>
                ))}
              </ol>

              <TutorialRequestGuideLink className="group flex flex-col gap-4 border-t border-white/15 px-6 py-5 text-left transition-colors hover:bg-white/[0.03] focus-visible:ring-2 focus-visible:ring-[#5f96ff] focus-visible:outline-none sm:flex-row sm:items-center sm:justify-between">
                <span className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-5">
                  <span className="font-mono text-xs font-bold tracking-[0.08em] text-[#5f96ff]">
                    OTHER RUNTIME
                  </span>
                  <strong className="text-base font-semibold text-white">
                    Request another deployment field note.
                  </strong>
                </span>
                <span className="inline-flex items-center font-mono text-xs font-bold tracking-[0.04em] text-zinc-300 uppercase">
                  Suggest a stack
                  <ArrowRight
                    size={16}
                    className="ml-3 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
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
        <section className="container -mt-24 pt-32 pb-10">
          <p className="font-mono text-xs font-bold tracking-[0.08em] text-[#5f96ff] uppercase">
            Deployment field note · 01
          </p>
          <h1 className="mt-5 text-5xl leading-[0.92] font-medium tracking-[-0.055em] text-white md:text-[5.75rem]">
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
                className="group inline-flex h-11 items-center bg-[#146dff] px-5 font-mono text-xs font-bold tracking-[0.04em] whitespace-nowrap text-white uppercase transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-[#0f5dd6] focus-visible:ring-2 focus-visible:ring-[#5f96ff] focus-visible:outline-none active:translate-y-0"
              >
                Read tutorial
                <ArrowRight
                  size={15}
                  className="ml-3 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
              <span className="font-mono text-xs font-semibold tracking-[0.04em] text-zinc-400 uppercase">
                Guide / {firstTutorial.estimatedReadingTime} / 3 chapters
              </span>
            </div>
          )}
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
