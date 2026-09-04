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
const DJANGO_DEPLOYMENT_IMAGE =
  '/images/tutorials/django/django-sealos-project-ops-running.webp';

const DJANGO_PROOF_NODES = [
  {
    label: '01 / PUBLIC HTTPS',
    title: 'Public edge',
    detail: 'Reachable on port 443',
    imageClassName: 'origin-[13%_28%] scale-[2.6]',
  },
  {
    label: '02 / APP RUNTIME',
    title: 'Django container',
    detail: 'Gunicorn process running',
    imageClassName: 'origin-[56%_37%] scale-[2.6]',
  },
  {
    label: '03 / PRIVATE DATA',
    title: 'PostgreSQL',
    detail: 'Private service attached',
    imageClassName: 'origin-[98%_53%] scale-[2.6]',
  },
] as const;

const DJANGO_GUIDE_CHAPTERS = [
  {
    phase: 'Configure',
    title: 'Prepare Django for production',
    detail: 'Configure Gunicorn and WhiteNoise.',
    hash: '#prepare-django-for-production',
  },
  {
    phase: 'Deploy',
    title: 'Deploy with Sealos Skills',
    detail: 'Connect the application and database.',
    hash: '#deploy-with-sealos-skills',
  },
  {
    phase: 'Verify',
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

      {isDjangoGuide && tutorial.image ? (
        <div>
          <div className="mb-6 flex items-end justify-between gap-6">
            <h2 className="text-2xl font-medium tracking-[-0.035em] text-white">
              Production evidence / DJANGO–01
            </h2>
            <p className="hidden items-baseline gap-3 sm:flex">
              <span className="text-sm text-zinc-400">Final response</span>
              <strong className="font-mono text-base text-white">200 OK</strong>
            </p>
          </div>

          <div className="overflow-hidden border border-white/15">
            <figure>
              <div className="relative aspect-[8/3] overflow-hidden bg-[#10131c]">
                <Image
                  src={DJANGO_DEPLOYMENT_IMAGE}
                  alt="Complete Sealos path from public access through the Django container to PostgreSQL"
                  className="object-cover object-center"
                  fill
                  priority={priorityImage}
                  quality={90}
                  sizes="(max-width: 760px) 100vw, 90vw"
                />
              </div>
              <figcaption className="flex items-center justify-between gap-4 border-t border-white/15 bg-[#111419] px-5 py-3 text-sm text-zinc-300">
                <span>Complete running topology</span>
                <span className="font-mono text-xs font-bold tracking-[0.04em]">
                  PUBLIC → RUNTIME → DATA
                </span>
              </figcaption>
            </figure>

            <div className="grid border-t border-white/15 md:grid-cols-3 md:divide-x md:divide-white/15">
              {DJANGO_PROOF_NODES.map((node) => (
                <figure
                  key={node.label}
                  className="border-b border-white/15 last:border-b-0 md:border-b-0"
                >
                  <div className="relative aspect-[11/5] overflow-hidden bg-[#10131c]">
                    <Image
                      src={DJANGO_DEPLOYMENT_IMAGE}
                      alt={`${node.title} deployment evidence`}
                      className={`object-cover object-center ${node.imageClassName}`}
                      fill
                      quality={90}
                      sizes="(max-width: 760px) 100vw, 30vw"
                    />
                  </div>
                  <figcaption className="bg-[#e3e5df] p-5 text-[#101318]">
                    <p className="font-mono text-xs font-bold tracking-[0.05em] text-zinc-600">
                      {node.label}
                    </p>
                    <p className="mt-4 text-lg font-medium tracking-[-0.02em]">
                      {node.title}
                    </p>
                    <p className="mt-1 text-sm text-zinc-700">{node.detail}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          <nav
            className="mt-16"
            aria-label="Guide chapters and next field note"
          >
            <div className="grid gap-5 md:grid-cols-12 md:items-end">
              <h3 className="text-3xl leading-none font-medium tracking-[-0.035em] text-white md:col-span-8">
                Three decisive checks
              </h3>
              <p className="text-sm leading-6 text-zinc-300 md:col-span-4 md:text-right">
                Inside the guide · 35 minutes
              </p>
            </div>

            <ol className="mt-7 grid divide-y divide-white/15 border-y border-white/15 md:grid-cols-3 md:divide-x md:divide-y-0">
              {DJANGO_GUIDE_CHAPTERS.map((chapter, index) => (
                <li key={chapter.hash}>
                  <Link
                    href={`${tutorial.url}${chapter.hash}`}
                    className="group flex min-h-60 flex-col p-6 text-left focus-visible:ring-2 focus-visible:ring-[#5f96ff] focus-visible:outline-none"
                  >
                    <span className="font-mono text-5xl leading-none font-medium tracking-[-0.06em] text-white/55">
                      0{index + 1}
                    </span>
                    <span className="mt-8 text-sm font-semibold text-zinc-400">
                      {chapter.phase}
                    </span>
                    <strong className="mt-2 text-xl font-medium tracking-[-0.02em] text-white transition-colors group-hover:text-[#5f96ff]">
                      {chapter.title}
                    </strong>
                    <span className="mt-auto flex items-end justify-between gap-5 pt-6 text-sm leading-6 text-zinc-200">
                      {chapter.detail}
                      <ArrowRight
                        size={18}
                        className="shrink-0 text-zinc-200 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:text-white"
                        aria-hidden="true"
                      />
                    </span>
                  </Link>
                </li>
              ))}
            </ol>

            <TutorialRequestGuideLink className="group flex flex-col gap-4 border-b border-white/15 py-5 text-left transition-colors hover:border-white/30 focus-visible:ring-2 focus-visible:ring-[#5f96ff] focus-visible:outline-none sm:flex-row sm:items-center sm:justify-between">
              <span className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-5">
                <span className="text-sm font-semibold text-[#5f96ff]">
                  Other runtime
                </span>
                <strong className="text-base font-semibold text-white">
                  Request another deployment field note.
                </strong>
              </span>
              <span className="inline-flex items-center text-sm font-semibold text-zinc-300">
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
        <section className="container -mt-24 pt-32 pb-12">
          <div className="grid gap-12 md:grid-cols-12 md:items-stretch">
            <div className="md:col-span-8">
              <p className="text-sm font-semibold text-[#5f96ff]">
                Field note 01 · Django 5.2 · Live evidence
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
                    className="group inline-flex h-11 items-center bg-[#146dff] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0f5dd6] focus-visible:ring-2 focus-visible:ring-[#5f96ff] focus-visible:outline-none"
                  >
                    Read tutorial
                    <ArrowRight
                      size={15}
                      className="ml-3 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                  <span className="text-sm font-semibold text-zinc-400">
                    {firstTutorial.estimatedReadingTime} · 3 chapters
                  </span>
                </div>
              )}
            </div>

            <aside className="flex flex-col justify-between border-l border-[#44b78b] pl-8 md:col-span-4">
              <div>
                <Image
                  src="/icons/django.svg"
                  alt="Django"
                  width={148}
                  height={52}
                  className="h-9 w-auto invert"
                />
                <p className="mt-3 font-mono text-xs font-bold tracking-[0.04em] text-zinc-300">
                  5.2 / PRODUCTION RUNBOOK
                </p>
              </div>
              <div className="my-8">
                <p className="text-[4.75rem] leading-none font-medium tracking-[-0.065em] text-white">
                  35
                </p>
                <p className="mt-3 max-w-52 text-base leading-6 text-zinc-200">
                  minutes from repository to public HTTPS.
                </p>
              </div>
              <p className="font-mono text-xs font-bold tracking-[0.04em] text-zinc-300">
                03 PROOFS · 200 OK
              </p>
            </aside>
          </div>
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
