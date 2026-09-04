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
    detail:
      'Set the WSGI entrypoint, static file middleware, and production hosts.',
    hash: '#prepare-django-for-production',
  },
  {
    phase: 'Deploy',
    title: 'Deploy with Sealos Skills',
    detail:
      'Provision the app and PostgreSQL, then release it with Sealos Skills.',
    hash: '#deploy-with-sealos-skills',
  },
  {
    phase: 'Verify',
    title: 'Verify the live application',
    detail:
      'Submit a task over HTTPS and confirm it persists after a fresh load.',
    hash: '#verify-the-live-django-application',
  },
] as const;

const DJANGO_LIVE_PROOF = [
  {
    stage: 'Request',
    command: 'POST /',
    detail: 'task="Runtime proof from Sealos"',
    result: '302 Redirect',
  },
  {
    stage: 'Database',
    command: 'INSERT tasks_task',
    detail: 'PostgreSQL transaction committed',
    result: 'COMMIT',
  },
  {
    stage: 'Fresh load',
    command: 'GET / HTTP/2',
    detail: 'task[0]="Runtime proof from Sealos"',
    result: '200 OK',
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
        <nav className="text-[#0a0a0a]" aria-label="Guide chapters">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_24rem]">
            <div className="grid gap-5 bg-[#f2f0e8] py-5 pr-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-center lg:gap-0">
              <div className="lg:pr-8">
                <p className="text-sm font-semibold text-zinc-600">
                  Inside the guide
                </p>
                <h3 className="mt-2 text-4xl leading-none font-medium tracking-[-0.05em]">
                  Three decisive checks.
                </h3>
              </div>
              <div className="lg:border-l lg:border-black/15 lg:pl-7">
                <p className="text-sm leading-6 text-zinc-700">
                  Configure, deploy, then verify the public flow.
                </p>
                <TutorialRequestGuideLink className="group mt-3 inline-flex items-center gap-3 text-sm font-semibold text-[#146dff] focus-visible:ring-2 focus-visible:ring-[#146dff] focus-visible:outline-none">
                  Request the next field note
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </TutorialRequestGuideLink>
              </div>
            </div>

            <div className="relative bg-[#090909] py-5 pr-6 pl-12 text-white lg:border-l lg:border-white/15">
              <span
                className="absolute top-0 bottom-0 left-6 w-px bg-white/15"
                aria-hidden="true"
              />
              <p className="text-sm font-semibold text-zinc-400">
                Observed transaction
              </p>
              <p className="mt-2 font-mono text-sm font-bold text-zinc-300">
                POST → COMMIT → GET
              </p>
            </div>
          </div>

          <ol>
            {DJANGO_GUIDE_CHAPTERS.map((chapter, index) => {
              const proof = DJANGO_LIVE_PROOF[index];

              return (
                <li
                  key={chapter.hash}
                  className="grid border-t border-black/15 lg:grid-cols-[minmax(0,1fr)_24rem]"
                >
                  <Link
                    href={`${tutorial.url}${chapter.hash}`}
                    className="group grid gap-5 bg-[#f2f0e8] py-5 pr-8 transition-colors hover:text-[#146dff] focus-visible:ring-2 focus-visible:ring-[#146dff] focus-visible:outline-none lg:grid-cols-[3rem_minmax(13rem,0.75fr)_1.25fr] lg:items-center lg:gap-5"
                  >
                    <span
                      className={`text-4xl font-medium tracking-[-0.055em] ${
                        index === DJANGO_GUIDE_CHAPTERS.length - 1
                          ? 'text-[#16815d]'
                          : 'text-zinc-500'
                      }`}
                    >
                      0{index + 1}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-zinc-600">
                        {chapter.phase}
                      </span>
                      <strong className="mt-2 block text-xl leading-tight font-semibold tracking-[-0.03em] transition-colors group-hover:text-[#146dff]">
                        {chapter.title}
                      </strong>
                    </span>
                    <span className="text-base leading-7 text-zinc-700">
                      {chapter.detail}
                    </span>
                  </Link>

                  <span className="relative bg-[#090909] py-5 pr-6 pl-12 text-white lg:border-l lg:border-white/15">
                    <span
                      className="absolute top-0 bottom-0 left-6 w-px bg-white/15"
                      aria-hidden="true"
                    />
                    <span
                      className={`absolute top-[1.6rem] left-[1.32rem] size-1.5 ${
                        index === DJANGO_LIVE_PROOF.length - 1
                          ? 'bg-[#44b78b]'
                          : 'bg-zinc-600'
                      }`}
                      aria-hidden="true"
                    />
                    <span className="flex items-center justify-between gap-4">
                      <span className="text-sm font-semibold text-zinc-300">
                        {proof.stage}
                      </span>
                      {index < DJANGO_LIVE_PROOF.length - 1 && (
                        <code className="font-mono text-sm font-bold text-zinc-300">
                          {proof.result}
                        </code>
                      )}
                    </span>
                    <code className="mt-2 block font-mono text-sm font-bold text-zinc-200">
                      {proof.command}
                    </code>
                    <code className="mt-1 block font-mono text-xs leading-5 break-words text-zinc-400">
                      {proof.detail}
                    </code>
                    {index === DJANGO_LIVE_PROOF.length - 1 && (
                      <span className="mt-2 flex items-baseline gap-3">
                        <strong className="font-mono text-xl text-[#44b78b]">
                          {proof.result}
                        </strong>
                        <span className="text-xs font-semibold text-[#44b78b]">
                          Persisted after refresh
                        </span>
                      </span>
                    )}
                  </span>
                </li>
              );
            })}
          </ol>
        </nav>
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
          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-stretch lg:gap-0">
            <div className="lg:pr-12">
              <p className="text-sm font-semibold text-zinc-400">
                Deployment field note
              </p>
              <h1 className="mt-5 text-6xl leading-[0.92] font-medium tracking-[-0.06em] text-white md:text-[6rem] md:leading-[0.86]">
                <span className="block">Deploy Django</span>
                <span className="block">on Sealos</span>
              </h1>
              <div className="mt-7">
                <p className="max-w-[35rem] text-lg leading-8 text-zinc-300">
                  Build a Django 5.2 Task app with Gunicorn, WhiteNoise, and
                  PostgreSQL. Deploy it on Sealos and verify a live create/read
                  flow.
                </p>
                {firstTutorial && (
                  <Link
                    href={firstTutorial.url}
                    className="group relative z-10 mt-5 mb-7 inline-flex items-center gap-3 text-base font-semibold text-[#5f96ff] focus-visible:ring-2 focus-visible:ring-[#5f96ff] focus-visible:outline-none"
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

            <aside className="flex flex-col justify-end pb-7 lg:border-l lg:border-white/15 lg:pl-8">
              <div className="border-t border-white/15 pt-5">
                <div className="flex items-center justify-between gap-5">
                  <Image
                    src="/icons/django.svg"
                    alt="Django"
                    width={148}
                    height={52}
                    className="h-7 w-auto opacity-80 invert"
                  />
                  <span className="font-mono text-xs font-semibold text-zinc-400">
                    2026.09.02
                  </span>
                </div>
                <p className="mt-8 text-sm font-semibold text-zinc-500">
                  Live create / read proof
                </p>
                <p className="mt-3 max-w-xs text-3xl leading-tight font-medium tracking-[-0.04em] text-white">
                  One task. Written once. Read after refresh.
                </p>
                <p className="mt-6 flex items-center gap-3 text-sm font-semibold text-[#44b78b]">
                  <span className="size-2 bg-[#44b78b]" aria-hidden="true" />
                  HTTP 200 · persisted
                </p>
              </div>
            </aside>
          </div>
        </section>

        <section
          id="published-tutorials"
          className="relative container scroll-mt-28"
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
