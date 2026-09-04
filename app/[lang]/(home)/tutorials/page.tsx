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
import { Fragment } from 'react';
import { TutorialRequestGuideLink } from './TutorialRequestGuideLink';

const TUTORIALS_PATHNAME = '/tutorials';
const TUTORIALS_PAGE_TITLE = 'Sealos Deployment Tutorials';
const TUTORIALS_PAGE_DESCRIPTION =
  'Follow published Sealos deployment tutorials built from verified repositories and live application evidence, starting with Django.';
const DJANGO_TUTORIAL_PATH = '/tutorials/django/deploy/';

const DJANGO_GUIDE_CHAPTERS = [
  {
    step: '01',
    title: 'Prepare Django',
    detail: 'Gunicorn and WhiteNoise',
    hash: '#prepare-django-for-production',
    evidence: 'Django container',
    status: 'Running',
    cropClassName: '-left-[186.8%] -top-[58.3%]',
  },
  {
    step: '02',
    title: 'Deploy with Skills',
    detail: 'Application and database',
    hash: '#deploy-with-sealos-skills',
    evidence: 'PostgreSQL',
    status: 'Running',
    cropClassName: '-left-[302.1%] -top-[62.5%]',
  },
  {
    step: '03',
    title: 'Verify the live app',
    detail: 'HTTPS create/read proof',
    hash: '#verify-the-live-django-application',
    evidence: 'Public HTTPS',
    status: 'Reachable',
    cropClassName: '-left-[73.6%] -top-[55.6%]',
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
    <article className="border-t border-white/10 pt-8">
      <div className="grid gap-7 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-3">
          <h2
            id="published-tutorials-heading"
            className="text-sm font-semibold text-[#5f96ff]"
          >
            Featured field guide
          </h2>
          <p className="mt-4 text-sm text-zinc-400">
            01 · Published · {tutorial.estimatedReadingTime}
          </p>
          <p className="mt-2 text-sm text-zinc-400">
            {tutorial.framework} ·{' '}
            {tutorial.stage === 'beginner'
              ? 'Core deployment'
              : tutorial.stageLabel}
          </p>
        </div>

        <div className="md:col-span-9">
          <Link
            href={tutorial.url}
            className="group block rounded-sm focus-visible:ring-2 focus-visible:ring-[#5f96ff] focus-visible:outline-none"
          >
            <h3 className="max-w-4xl text-3xl leading-[1.08] font-semibold tracking-[-0.035em] text-white md:text-[2.65rem]">
              {isDjangoGuide ? (
                <>
                  How to Deploy a Django App{' '}
                  <span className="text-zinc-400 transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:text-[#5f96ff]">
                    on Sealos
                  </span>
                </>
              ) : (
                tutorial.title
              )}
            </h3>
          </Link>
          <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-300">
            {tutorial.description}
          </p>
          <Link
            href={tutorial.url}
            className="group mt-6 inline-flex h-11 items-center rounded-md bg-[#146dff] px-5 text-sm font-semibold whitespace-nowrap text-white transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-[#0f5dd6] focus-visible:ring-2 focus-visible:ring-[#5f96ff] focus-visible:outline-none active:translate-y-0"
          >
            Read tutorial
            <ArrowRight
              size={15}
              className="ml-3 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>

      {isDjangoGuide ? (
        <figure className="mt-12">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <figcaption>
              <span className="block text-2xl font-semibold tracking-tight text-white">
                Three checks. One running application.
              </span>
              <span className="mt-1 block text-sm text-zinc-400">
                Each chapter resolves to visible output inside the Sealos
                project.
              </span>
            </figcaption>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400">
              <span className="size-2 rounded-full bg-emerald-400" />
              All services running
            </span>
          </div>

          <h2 id="inside-guide-heading" className="sr-only">
            Guide chapters and deployment evidence
          </h2>
          <div className="overflow-hidden rounded-lg ring-1 ring-white/15">
            <div className="hidden grid-cols-[1fr_auto_1fr_auto_1fr] items-center bg-[#0d111b] px-5 py-4 text-sm md:grid">
              {DJANGO_GUIDE_CHAPTERS.map((chapter, index) => (
                <Fragment key={chapter.step}>
                  <span className="flex items-center justify-center gap-3 font-medium text-zinc-100">
                    {chapter.evidence}
                    <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
                      <span className="size-1.5 rounded-full bg-emerald-400" />
                      {chapter.status}
                    </span>
                  </span>
                  {index < DJANGO_GUIDE_CHAPTERS.length - 1 && (
                    <span className="text-[#5f96ff]" aria-hidden="true">
                      →
                    </span>
                  )}
                </Fragment>
              ))}
            </div>
            <ol
              className="grid bg-white/10 md:grid-cols-3 md:gap-px"
              aria-labelledby="inside-guide-heading"
            >
              {DJANGO_GUIDE_CHAPTERS.map((chapter) => (
                <li key={chapter.step} className="bg-[#070707]">
                  <Link
                    href={`${tutorial.url}${chapter.hash}`}
                    className="group block focus-visible:ring-2 focus-visible:ring-[#5f96ff] focus-visible:outline-none focus-visible:ring-inset"
                  >
                    <div className="relative aspect-square overflow-hidden bg-[#090c14]">
                      <Image
                        src="/images/tutorials/django/django-sealos-project-ops-running.webp"
                        alt={`${chapter.evidence} shown in the running Sealos project`}
                        className={`absolute h-auto w-[444.444%] max-w-none ${chapter.cropClassName}`}
                        width={3200}
                        height={1800}
                        priority={priorityImage}
                        quality={90}
                        sizes="(max-width: 760px) 92vw, 416px"
                      />
                    </div>
                    <div className="p-5 md:min-h-40">
                      <span className="text-sm font-medium text-[#5f96ff]">
                        Chapter {chapter.step}
                      </span>
                      <strong className="mt-3 block text-lg font-semibold text-white transition-colors group-hover:text-[#5f96ff]">
                        {chapter.title}
                      </strong>
                      <span className="mt-1 block text-sm text-zinc-400">
                        {chapter.detail}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
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
        <section className="container -mt-24 grid pt-32 pb-10 md:grid-cols-12 md:items-end md:gap-8">
          <div className="md:col-span-8">
            <p className="text-xs font-semibold tracking-[0.18em] text-[#5f96ff] uppercase">
              Deployment field notes
            </p>
            <h1
              aria-label="From working code to green lights"
              className="mt-5 text-5xl leading-[0.98] font-medium tracking-[-0.045em] text-white md:text-7xl"
            >
              <span className="block">From working code</span>
              <span className="mt-2 block text-zinc-300">to green lights.</span>
            </h1>
          </div>
          <div className="mt-8 md:col-span-4 md:mt-0 md:pb-1 md:pl-8">
            <p className="max-w-sm text-base leading-7 text-zinc-300">
              Deployment field guides that finish with a running service, an
              attached database, and a reachable public endpoint.
            </p>
            <p className="mt-7 text-sm font-medium text-[#5f96ff]">
              Build → Deploy → Verify
            </p>
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

          <section className="mt-16 grid gap-7 bg-[#146dff] px-7 py-8 text-white md:grid-cols-12 md:items-center md:gap-8 md:px-9">
            <div className="md:col-span-8">
              <h2 className="text-3xl font-semibold tracking-tight">
                Need a guide for your stack?
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100">
                Share the framework or runtime and the deployment job you need.
                Requests help prioritize the next qualified Core tutorial.
              </p>
            </div>
            <TutorialRequestGuideLink className="group inline-flex h-11 shrink-0 items-center text-sm font-semibold text-white transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:translate-x-1 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none md:col-span-4 md:justify-end">
              Request a tutorial
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
