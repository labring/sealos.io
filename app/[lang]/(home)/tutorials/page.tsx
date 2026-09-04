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

            <div className="overflow-hidden border border-l-4 border-white/15 border-l-[#146dff]">
              <div className="grid md:grid-cols-12">
                <div className="border-b border-zinc-600/35 bg-[#b9bfbc] p-6 text-[#101318] md:col-span-4 md:border-r md:border-b-0 md:p-8">
                  <p className="text-xs font-bold tracking-[0.08em] text-zinc-600">
                    RUNTIME / 5.2
                  </p>
                  <Image
                    src="/icons/django.svg"
                    alt="Django"
                    width={104}
                    height={36}
                    className="mt-5 h-8 w-auto"
                  />
                  <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-zinc-600/35 pt-5">
                    <div>
                      <dt className="text-xs font-bold tracking-[0.08em] text-zinc-600">
                        DATA
                      </dt>
                      <dd className="mt-1 text-base font-bold">PostgreSQL</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-bold tracking-[0.08em] text-zinc-600">
                        EDGE
                      </dt>
                      <dd className="mt-1 text-base font-bold">Public HTTPS</dd>
                    </div>
                  </dl>
                </div>

                <div className="bg-[#c3c8c5] text-[#101318] md:col-span-8">
                  <div className="flex items-center justify-between gap-4 border-b border-zinc-600/35 px-6 py-3.5">
                    <div className="flex items-baseline gap-4">
                      <span className="font-mono text-xl font-bold text-[#146dff]">
                        01
                      </span>
                      <strong className="text-sm font-bold">
                        Request trace
                      </strong>
                    </div>
                    <span className="text-sm font-bold text-[#006f56]">
                      Verified
                    </span>
                  </div>

                  <div className="relative">
                    <span
                      className="absolute top-7 bottom-7 left-[2.2rem] w-px bg-[#146dff]/45"
                      aria-hidden="true"
                    />
                    <ol className="divide-y divide-zinc-600/30 px-6">
                      {DJANGO_REQUEST_TRACE.map((step) => (
                        <li
                          key={step.marker}
                          className="relative grid grid-cols-[2rem_minmax(0,1fr)] items-center gap-x-4 gap-y-1 py-3.5 md:grid-cols-12 md:gap-x-4"
                        >
                          <span className="z-10 flex size-6 items-center justify-center bg-[#146dff] font-mono text-[11px] font-bold text-white md:col-span-1">
                            {step.marker}
                          </span>
                          <span className="col-start-2 text-xs font-bold tracking-[0.06em] text-zinc-600 md:col-span-2 md:col-start-auto">
                            {step.label}
                          </span>
                          <code className="col-start-2 text-sm font-bold text-[#101318] md:col-span-3 md:col-start-auto">
                            {step.title}
                          </code>
                          <code className="col-start-2 text-sm text-zinc-600 md:col-span-4 md:col-start-auto">
                            {step.evidence}
                          </code>
                          <strong className="col-start-2 font-mono text-xs font-bold text-[#146dff] md:col-span-2 md:col-start-auto md:text-right">
                            {step.transport}
                          </strong>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>

              <div className="grid gap-2 bg-[#101318] px-6 py-3.5 text-white md:grid-cols-12 md:items-center md:gap-x-6">
                <span className="text-sm font-bold text-emerald-400 md:col-span-3">
                  ✓ Persisted task
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
            className="overflow-hidden border-x border-b border-white/15 bg-[#111419]"
            aria-label="Guide chapters and next field note"
          >
            <div className="grid md:grid-cols-12">
              <div className="border-b border-white/15 p-6 md:col-span-3 md:border-r md:border-b-0 md:p-8">
                <p className="font-mono text-xs font-bold tracking-[0.08em] text-[#5f96ff]">
                  INSIDE THE GUIDE
                </p>
                <p className="mt-5 font-mono text-5xl leading-none font-medium tracking-[-0.08em] text-white">
                  03
                </p>
                <h3 className="mt-3 text-xl leading-tight font-semibold text-white">
                  Decisive checks
                </h3>
                <p className="mt-6 text-sm leading-6 text-zinc-300">
                  35 minutes from local project to verified production service.
                </p>
              </div>
              <ol className="divide-y divide-white/15 md:col-span-9">
                {DJANGO_GUIDE_CHAPTERS.map((chapter, index) => (
                  <li key={chapter.hash}>
                    <Link
                      href={`${tutorial.url}${chapter.hash}`}
                      className="group grid gap-2 px-6 py-5 text-left focus-visible:ring-2 focus-visible:ring-[#5f96ff] focus-visible:outline-none md:min-h-[5.75rem] md:grid-cols-12 md:items-center md:gap-x-4"
                    >
                      <span className="font-mono text-xl font-bold text-[#5f96ff] md:col-span-1">
                        0{index + 1}
                      </span>
                      <span className="text-sm font-semibold text-zinc-400 md:col-span-1">
                        {chapter.phase}
                      </span>
                      <strong className="text-lg font-semibold text-white transition-colors group-hover:text-[#5f96ff] md:col-span-4">
                        {chapter.title}
                      </strong>
                      <span className="text-sm leading-6 text-zinc-300 md:col-span-3">
                        {chapter.detail}
                      </span>
                      <span className="text-sm font-semibold text-[#00dca0] md:col-span-3 md:text-right">
                        ✓ {chapter.result}
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>

            <TutorialRequestGuideLink className="group flex flex-col gap-4 border-t border-white/15 px-6 py-4 text-left transition-colors hover:bg-white/[0.03] focus-visible:ring-2 focus-visible:ring-[#5f96ff] focus-visible:outline-none sm:flex-row sm:items-center sm:justify-between">
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
