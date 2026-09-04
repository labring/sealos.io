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

const DJANGO_EVIDENCE_STEPS = [
  {
    marker: '01',
    title: 'Input',
    evidence: 'Task title entered',
  },
  {
    marker: '02',
    title: 'Write',
    evidence: 'POST accepted over HTTPS',
  },
  {
    marker: '03',
    title: 'Read',
    evidence: 'Saved task returned',
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
          <nav
            className="grid border-y border-white/15 md:grid-cols-[0.52fr_2fr]"
            aria-label="Guide chapters"
          >
            <div className="flex items-center gap-4 border-b border-l-4 border-white/15 border-l-[#146dff] bg-[#101318] p-7 md:border-r md:border-b-0">
              <strong className="text-6xl leading-none font-medium tracking-[-0.08em] text-[#5f96ff]">
                35
              </strong>
              <div>
                <h3 className="text-xl font-semibold text-white">
                  minute guide
                </h3>
                <p className="mt-1 text-sm text-zinc-400">Three chapters</p>
              </div>
            </div>
            <ol>
              {DJANGO_GUIDE_CHAPTERS.map((chapter, index) => (
                <li
                  key={chapter.hash}
                  className="border-b border-white/15 last:border-b-0"
                >
                  <Link
                    href={`${tutorial.url}${chapter.hash}`}
                    className="group grid grid-cols-[2rem_minmax(0,1fr)_1rem] items-center gap-x-5 px-6 py-5 focus-visible:ring-2 focus-visible:ring-[#5f96ff] focus-visible:outline-none sm:grid-cols-[2rem_20rem_minmax(0,1fr)_1rem]"
                  >
                    <span className="font-mono text-sm font-semibold text-[#5f96ff]">
                      0{index + 1}
                    </span>
                    <strong className="text-lg font-semibold text-zinc-100 transition-colors group-hover:text-[#5f96ff]">
                      {chapter.title}
                    </strong>
                    <span className="col-start-2 mt-1 text-sm text-zinc-300 sm:col-start-auto sm:mt-0">
                      {chapter.detail}
                    </span>
                    <ArrowRight
                      size={16}
                      className="col-start-3 row-start-1 justify-self-end text-zinc-400 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:text-[#5f96ff] sm:col-start-auto sm:row-start-auto"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ol>
          </nav>

          <figure className="mt-10">
            <figcaption className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <span className="text-xl font-semibold tracking-tight text-white">
                Deployment evidence / DJANGO-01
              </span>
              <span className="font-mono text-xs font-semibold text-zinc-400">
                01 / LIVE PROJECT CAPTURE
              </span>
            </figcaption>

            <div className="grid border border-white/15 lg:grid-cols-[minmax(0,1fr)_17rem]">
              <div className="relative aspect-[2.3/1] overflow-hidden bg-[#07101d]">
                <Image
                  src="/images/tutorials/django/django-sealos-live-app-https-proof.webp"
                  alt="Live Django task application with a verified task write and read result"
                  fill
                  priority={priorityImage}
                  quality={95}
                  className="origin-[40%_40%] scale-[1.35] object-cover object-[50%_37%]"
                  sizes="(max-width: 760px) 100vw, 88vw"
                />
              </div>
              <ol className="grid grid-cols-3 border-t border-white/15 bg-[#0c0d0f] lg:grid-cols-1 lg:grid-rows-3 lg:border-t-0 lg:border-l">
                {DJANGO_EVIDENCE_STEPS.map((step) => (
                  <li
                    key={step.marker}
                    className="border-r border-white/15 p-4 last:border-r-0 lg:border-r-0 lg:border-b lg:last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[11px] font-semibold text-[#5f96ff]">
                        {step.marker}
                      </span>
                      <span className="h-px flex-1 bg-white/15" />
                    </div>
                    <h3 className="mt-3 text-sm font-semibold text-white">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-zinc-300">
                      {step.evidence}
                    </p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="grid gap-2 border-x border-b border-white/15 px-4 py-3 text-xs sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:gap-6">
              <strong className="inline-flex items-center gap-2 font-semibold text-emerald-400">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                Live create/read verified
              </strong>
              <span className="text-zinc-300 sm:text-right">
                Django 5.2 · Gunicorn · WhiteNoise · PostgreSQL · HTTPS :443
              </span>
            </div>
          </figure>
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
        <section className="container -mt-24 pt-32 pb-12">
          <p className="text-sm font-semibold text-[#5f96ff]">
            Field note 01 · Django 5.2 · Live evidence
          </p>
          <h1 className="mt-5 text-5xl leading-[0.92] font-medium tracking-[-0.055em] text-white md:text-[5.75rem]">
            Deploy Django on Sealos
          </h1>
          <div className="mt-8 flex flex-wrap items-end gap-x-8 gap-y-6">
            <p className="max-w-2xl flex-1 text-base leading-7 text-zinc-300">
              Build a Django 5.2 Task app, prepare Gunicorn, WhiteNoise, and
              PostgreSQL, then deploy it and verify a live create/read flow.
            </p>
            {firstTutorial && (
              <div className="flex flex-wrap items-center gap-5">
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
                  {firstTutorial.estimatedReadingTime} · 3 proofs ·{' '}
                  <span className="text-emerald-400">HTTP 200</span>
                </span>
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
            <p className="text-sm leading-6 text-zinc-300">
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
