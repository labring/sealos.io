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
          <div className="grid overflow-hidden border border-white/15 md:grid-cols-12">
            <figure className="relative aspect-video overflow-hidden border-b border-white/15 md:col-span-8 md:min-h-[30rem] md:border-r md:border-b-0">
              <Image
                src={tutorial.image}
                alt={`${tutorial.title} live application`}
                className="object-cover object-center"
                fill
                priority={priorityImage}
                quality={90}
                sizes="(max-width: 760px) 100vw, 67vw"
              />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 bg-[#101318]/95 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm">
                <span>Live Django application</span>
                <span className="font-mono text-xs tracking-[0.04em] text-[#8db2ff]">
                  HTTPS / 200 OK
                </span>
              </figcaption>
            </figure>

            <div className="flex flex-col bg-[#e3e5df] p-7 text-[#101318] md:col-span-4 md:p-8">
              <div className="flex items-center justify-between gap-5 border-b border-black/15 pb-5">
                <Image
                  src="/icons/django.svg"
                  alt="Django"
                  width={112}
                  height={40}
                  className="h-7 w-auto"
                />
                <span className="font-mono text-xs font-bold tracking-[0.06em] text-zinc-600">
                  FIELD NOTE / 01
                </span>
              </div>
              <h3 className="mt-8 text-4xl leading-[1.02] font-medium tracking-[-0.045em]">
                Repository to a live HTTPS task app.
              </h3>
              <p className="mt-5 text-sm leading-6 text-zinc-700">
                A verified production path through Gunicorn, WhiteNoise,
                PostgreSQL, and Sealos.
              </p>
              <dl className="mt-8 divide-y divide-black/15 border-y border-black/15 text-sm">
                <div className="flex items-center justify-between gap-4 py-3">
                  <dt className="text-zinc-600">Framework</dt>
                  <dd className="font-semibold">Django 5.2</dd>
                </div>
                <div className="flex items-center justify-between gap-4 py-3">
                  <dt className="text-zinc-600">Database</dt>
                  <dd className="font-semibold">PostgreSQL</dd>
                </div>
                <div className="flex items-center justify-between gap-4 py-3">
                  <dt className="text-zinc-600">Result</dt>
                  <dd className="font-semibold">Public HTTPS</dd>
                </div>
              </dl>
              <Link
                href={tutorial.url}
                className="group mt-8 inline-flex h-12 items-center justify-between bg-[#146dff] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0f5dd6] focus-visible:ring-2 focus-visible:ring-[#101318] focus-visible:ring-offset-2 focus-visible:ring-offset-[#e3e5df] focus-visible:outline-none md:mt-auto"
              >
                Read full field note
                <ArrowRight
                  size={16}
                  className="transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>

          <nav
            className="mt-12"
            aria-label="Guide chapters and next field note"
          >
            <div className="grid gap-4 border-t border-white/15 pt-6 md:grid-cols-12 md:items-end">
              <p className="text-sm font-semibold text-[#5f96ff] md:col-span-3">
                Inside the guide
              </p>
              <h3 className="text-3xl leading-none font-medium tracking-[-0.035em] text-white md:col-span-6">
                Three decisive checks
              </h3>
              <p className="text-sm leading-6 text-zinc-400 md:col-span-3 md:text-right">
                35 minutes from repository to production.
              </p>
            </div>

            <ol className="mt-6 divide-y divide-white/15 border-y border-white/15">
              {DJANGO_GUIDE_CHAPTERS.map((chapter, index) => (
                <li key={chapter.hash}>
                  <Link
                    href={`${tutorial.url}${chapter.hash}`}
                    className="group grid gap-2 py-6 text-left focus-visible:ring-2 focus-visible:ring-[#5f96ff] focus-visible:outline-none md:grid-cols-12 md:items-center"
                  >
                    <span className="font-mono text-sm font-bold text-[#5f96ff] md:col-span-1">
                      0{index + 1}
                    </span>
                    <span className="text-sm font-semibold text-zinc-400 md:col-span-2">
                      {chapter.phase}
                    </span>
                    <strong className="text-xl font-medium tracking-[-0.02em] text-white transition-colors group-hover:text-[#5f96ff] md:col-span-5">
                      {chapter.title}
                    </strong>
                    <span className="text-sm leading-6 text-zinc-400 md:col-span-3">
                      {chapter.detail}
                    </span>
                    <ArrowRight
                      size={18}
                      className="text-zinc-500 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:text-white md:col-span-1 md:justify-self-end"
                      aria-hidden="true"
                    />
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
        <section className="container -mt-24 pt-32 pb-10">
          <p className="text-sm font-semibold text-[#5f96ff]">
            Deployment field note · 01
          </p>
          <h1 className="mt-5 text-5xl leading-[0.9] font-medium tracking-[-0.06em] text-white md:text-[4.5rem] lg:text-[6.75rem]">
            Deploy Django on Sealos
          </h1>
          <div className="mt-8 grid gap-6 border-t border-white/15 pt-6 md:grid-cols-12 md:items-end">
            <p className="max-w-3xl text-base leading-7 text-zinc-300 md:col-span-7">
              <span className="block">
                Build a Django 5.2 Task app with Gunicorn, WhiteNoise, and
                PostgreSQL.
              </span>
              <span className="block">
                Deploy it on Sealos and verify a live create/read flow.
              </span>
            </p>
            {firstTutorial && (
              <p className="text-sm font-semibold text-zinc-400 md:col-span-5 md:text-right">
                Published guide / {firstTutorial.estimatedReadingTime} / 3
                chapters
              </p>
            )}
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
