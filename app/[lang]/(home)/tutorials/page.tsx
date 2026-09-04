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
    detail: 'HTTPS · 200 OK · Create/read verified',
  },
  {
    marker: '01.B',
    title: 'Django container',
    status: 'Running',
    value: 'Gunicorn + WhiteNoise',
    detail: 'Container · 1 replica · Image deployed',
  },
  {
    marker: '01.C',
    title: 'PostgreSQL',
    status: 'Attached',
    value: 'Private connection',
    detail: 'PostgreSQL · Public access disabled',
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
          <div className="mb-6">
            <figcaption>
              <span className="block text-2xl font-semibold tracking-tight text-white">
                One request. Three verified services.
              </span>
              <span className="mt-1 block text-sm text-zinc-400">
                The live route from public HTTPS to a private PostgreSQL
                service.
              </span>
            </figcaption>
          </div>

          <div className="bg-[#f1f1ed] px-7 py-8 text-zinc-950 md:px-10 md:py-9">
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <span className="font-semibold">Verified request path</span>
              <span className="font-mono text-xs tracking-[0.08em] text-zinc-500 uppercase">
                Live project / Django 5.2
              </span>
            </div>

            <div className="relative mt-10">
              <span
                className="absolute top-24 right-[8%] left-[8%] hidden h-0.5 bg-[#146dff] md:block"
                aria-hidden="true"
              />
              <ol className="grid gap-10 md:grid-cols-3 md:gap-12">
                {DEPLOYMENT_NODES.map((node) => (
                  <li key={node.marker} className="relative">
                    <span className="font-mono text-xs font-semibold tracking-[0.1em] text-[#146dff]">
                      {node.marker}
                    </span>
                    <h3 className="mt-3 text-2xl font-semibold tracking-tight">
                      {node.title}
                    </h3>
                    <span className="relative z-10 mt-8 flex size-5 items-center justify-center rounded-full bg-[#f1f1ed] ring-2 ring-[#146dff]">
                      <span className="size-2 rounded-full bg-[#146dff]" />
                    </span>
                    <code className="mt-8 block truncate text-sm font-semibold text-zinc-900">
                      {node.value}
                    </code>
                    <p className="mt-3 text-sm leading-6 text-zinc-600">
                      {node.detail}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
                      <span className="size-2 rounded-full bg-emerald-500" />
                      {node.status}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-9 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-300 pt-5 text-sm text-zinc-600">
              <span>Ingress → WSGI runtime → private data</span>
              <span className="font-semibold text-zinc-950">
                3 proof points recorded
              </span>
            </div>
          </div>

          <nav className="mt-10" aria-label="Guide chapters">
            <h3 className="text-lg font-semibold text-white">
              Inside the 35-minute guide
            </h3>
            <ol className="mt-6 grid gap-7 md:grid-cols-3 md:gap-10">
              {DJANGO_GUIDE_CHAPTERS.map((chapter, index) => (
                <li key={chapter.hash}>
                  <Link
                    href={`${tutorial.url}${chapter.hash}`}
                    className="group block rounded-sm focus-visible:ring-2 focus-visible:ring-[#5f96ff] focus-visible:outline-none"
                  >
                    <span className="text-sm font-medium text-[#5f96ff]">
                      0{index + 1}
                    </span>
                    <strong className="mt-3 block text-base font-semibold text-zinc-100 transition-colors group-hover:text-[#5f96ff]">
                      {chapter.title}
                    </strong>
                    <span className="mt-2 block text-sm text-zinc-400">
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
        <section className="container -mt-24 grid pt-32 pb-12 md:grid-cols-12 md:items-start md:gap-8">
          <div className="md:col-span-8">
            <p className="text-xs font-semibold tracking-[0.18em] text-[#5f96ff] uppercase">
              Sealos deployment field note · 01
            </p>
            <h1
              aria-label="How to Deploy a Django App on Sealos"
              className="mt-5 text-5xl leading-[0.98] font-medium tracking-[-0.045em] text-white md:text-[4rem]"
            >
              <span className="block">How to Deploy a</span>
              <span className="mt-2 block">
                Django App <span className="text-zinc-400">on Sealos</span>
              </span>
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
          <div className="mt-8 md:col-span-4 md:mt-0 md:flex md:self-stretch md:border-l md:border-[#146dff] md:pt-14 md:pl-8">
            <div>
              <p className="text-sm font-semibold text-[#5f96ff]">
                Verified outcome
              </p>
              <ul className="mt-6 space-y-4 text-lg font-medium text-zinc-100">
                <li className="flex items-center gap-3">
                  <span className="size-2 rounded-full bg-emerald-400" />
                  Public endpoint reachable
                </li>
                <li className="flex items-center gap-3">
                  <span className="size-2 rounded-full bg-emerald-400" />
                  Django container running
                </li>
                <li className="flex items-center gap-3">
                  <span className="size-2 rounded-full bg-emerald-400" />
                  PostgreSQL attached
                </li>
              </ul>
              <p className="mt-7 text-sm font-medium text-zinc-400">
                Build → Deploy → Verify
              </p>
            </div>
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

          <section className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 py-2">
            <h2 className="text-xl font-semibold tracking-tight text-white">
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
