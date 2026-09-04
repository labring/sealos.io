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
const DJANGO_PROJECT_EVIDENCE =
  '/images/tutorials/django/django-sealos-project-ops-running.webp';
const DJANGO_GUIDE_CHAPTERS = [
  {
    phase: 'Configure',
    evidence: 'config.wsgi:application',
    title: 'Prepare Django for production',
    detail: 'Configure Gunicorn and WhiteNoise.',
    hash: '#prepare-django-for-production',
  },
  {
    phase: 'Deploy',
    evidence: 'DATABASE_URL → :5432',
    title: 'Deploy with Sealos Skills',
    detail: 'Connect the application and database.',
    hash: '#deploy-with-sealos-skills',
  },
  {
    phase: 'Verify',
    evidence: 'GET / → HTTP 200',
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
            <figcaption className="border-y border-white/15 py-5">
              <span className="text-2xl font-medium tracking-[-0.035em] text-white">
                Production evidence
              </span>
            </figcaption>

            <div className="relative overflow-hidden border-b border-white/15 bg-[#08101f]">
              <div className="absolute inset-x-0 top-0 z-10 h-0.5 bg-gradient-to-r from-[#146dff] to-[#44b78b]" />
              <div className="relative aspect-[16/7] overflow-hidden">
                <Image
                  src={DJANGO_PROJECT_EVIDENCE}
                  alt="Running Sealos project with public domain, Django container, and PostgreSQL database"
                  fill
                  className="scale-[1.1] object-cover object-center brightness-[1.45] contrast-[1.12] saturate-[0.8]"
                  priority
                  quality={100}
                  sizes="(max-width: 768px) 100vw, 87vw"
                />
              </div>
              <div className="grid bg-[#10151d] md:grid-cols-3 md:divide-x md:divide-white/10">
                <span className="flex min-h-24 items-center gap-5 px-6 py-5">
                  <span className="font-mono text-sm font-bold text-zinc-500">
                    01
                  </span>
                  <span>
                    <strong className="block text-base font-semibold text-white">
                      Runtime online
                    </strong>
                    <code className="mt-1 block font-mono text-[13px] text-zinc-300">
                      Django container · Running
                    </code>
                  </span>
                </span>
                <span className="flex min-h-24 items-center gap-5 border-t border-white/10 px-6 py-5 md:border-t-0">
                  <span className="font-mono text-sm font-bold text-zinc-500">
                    02
                  </span>
                  <span>
                    <strong className="block text-base font-semibold text-white">
                      Data connected
                    </strong>
                    <code className="mt-1 block font-mono text-[13px] text-zinc-300">
                      PostgreSQL · private network
                    </code>
                  </span>
                </span>
                <span className="flex min-h-24 items-center gap-5 border-t border-white/10 px-6 py-5 md:border-t-0">
                  <span className="font-mono text-sm font-bold text-zinc-500">
                    03
                  </span>
                  <span>
                    <strong className="block text-base font-semibold text-[#44b78b]">
                      Public response verified
                    </strong>
                    <code className="mt-1 block font-mono text-[13px] text-zinc-300">
                      GET / · HTTP/2 · 200 OK
                    </code>
                  </span>
                </span>
              </div>
            </div>
          </figure>

          <nav
            className="bg-[#f2f0e8] text-[#0a0a0a]"
            aria-label="Guide chapters"
          >
            <div className="grid gap-8 px-7 py-9 lg:grid-cols-[2fr_1fr] lg:items-end">
              <div>
                <p className="text-sm font-semibold text-[#146dff]">
                  Inside the guide
                </p>
                <h3 className="mt-3 text-5xl leading-none font-medium tracking-[-0.055em]">
                  Three decisive checks.
                </h3>
              </div>
              <div>
                <p className="text-base leading-7 text-zinc-700">
                  Configure, deploy, then verify the public flow.
                </p>
                <TutorialRequestGuideLink className="group mt-5 inline-flex w-full items-center justify-between gap-5 text-sm font-semibold text-[#146dff] focus-visible:ring-2 focus-visible:ring-[#146dff] focus-visible:outline-none">
                  Request the next field note
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </TutorialRequestGuideLink>
              </div>
            </div>

            <ol className="grid border-t border-black/15 lg:grid-cols-3 lg:divide-x lg:divide-black/15">
              {DJANGO_GUIDE_CHAPTERS.map((chapter, index) => (
                <li
                  key={chapter.hash}
                  className="border-t border-black/15 first:border-t-0 lg:border-t-0"
                >
                  <Link
                    href={`${tutorial.url}${chapter.hash}`}
                    className="group flex min-h-64 flex-col p-7 transition-colors hover:bg-black/[0.035] focus-visible:ring-2 focus-visible:ring-[#146dff] focus-visible:outline-none"
                  >
                    <span className="flex items-start justify-between gap-5">
                      <span className="font-mono text-4xl font-bold tracking-[-0.06em] text-zinc-400">
                        0{index + 1}
                      </span>
                      <span
                        className={`text-sm font-semibold ${
                          chapter.phase === 'Verify'
                            ? 'text-[#16815d]'
                            : 'text-[#146dff]'
                        }`}
                      >
                        {chapter.phase}
                      </span>
                    </span>
                    <strong className="mt-8 text-2xl leading-tight font-semibold tracking-[-0.035em] transition-colors group-hover:text-[#146dff]">
                      {chapter.title}
                    </strong>
                    <span className="mt-4 text-base leading-7 text-zinc-700">
                      {chapter.detail}
                    </span>
                    <code className="mt-auto pt-7 font-mono text-[13px] font-bold text-zinc-600">
                      {chapter.evidence}
                    </code>
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
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
          <div className="grid gap-8 md:grid-cols-3 md:items-stretch md:gap-0">
            <div className="md:col-span-2 md:pr-12">
              <p className="text-sm font-semibold text-[#5f96ff]">
                Deployment field note
              </p>
              <h1 className="mt-6 text-6xl leading-[0.92] font-medium tracking-[-0.055em] text-white md:text-[4.75rem]">
                <span className="block">Deploy Django</span>
                <span className="block">on Sealos</span>
              </h1>
              <div className="mt-7 flex flex-col gap-7 border-t border-white/15 pt-6 md:flex-row md:items-end md:justify-between">
                <p className="max-w-[31rem] text-base leading-7 text-zinc-300">
                  Build a Django 5.2 Task app with Gunicorn, WhiteNoise, and
                  PostgreSQL. Deploy it on Sealos and verify a live create/read
                  flow.
                </p>
                {firstTutorial && (
                  <Link
                    href={firstTutorial.url}
                    className="group inline-flex w-64 shrink-0 items-center justify-between bg-[#f2f0e8] px-6 py-4 text-base font-semibold text-[#0a0a0a] transition-colors hover:bg-white focus-visible:ring-2 focus-visible:ring-[#5f96ff] focus-visible:outline-none"
                  >
                    Read the field note
                    <ArrowRight
                      size={15}
                      className="transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                )}
              </div>
            </div>

            <aside className="flex flex-col border-l border-white/15 pl-7 md:py-1">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <Image
                    src="/icons/django.svg"
                    alt="Django"
                    width={148}
                    height={52}
                    className="h-9 w-auto invert"
                  />
                  <span className="mt-3 block font-mono text-sm font-bold tracking-[0.04em] text-zinc-300">
                    Django 5.2
                  </span>
                </div>
                <span className="text-sm font-semibold text-zinc-300">
                  Field note 01
                </span>
              </div>
              <div className="mt-8 flex items-end gap-4 border-y border-white/15 py-5">
                <span className="text-[4.75rem] leading-[0.8] font-medium tracking-[-0.075em] text-white">
                  35
                </span>
                <span className="pb-1 font-mono text-xs leading-5 font-bold tracking-[0.06em] text-zinc-300 uppercase">
                  Minutes
                  <span className="block text-zinc-400">From repo</span>
                  <span className="block text-zinc-400">To HTTPS</span>
                </span>
              </div>
              <div className="grid flex-1 grid-cols-3 items-center gap-3 border-b border-white/15 py-4 text-xs font-semibold text-zinc-300">
                <span>Gunicorn</span>
                <span>WhiteNoise</span>
                <span>PostgreSQL</span>
              </div>
              <div className="flex items-center justify-between gap-5 border-b border-white/15 py-4 text-xs font-semibold">
                <span className="text-zinc-300">Live proof below</span>
                <span className="inline-flex items-center gap-2 text-[#44b78b]">
                  <span className="size-1.5 rounded-full bg-current" />
                  Verified
                </span>
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
