import StructuredDataComponent from '@/components/structured-data';
import { buttonVariants } from '@/components/ui/button';
import type { languagesType } from '@/lib/i18n';
import { cn } from '@/lib/utils';
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
const DJANGO_PROJECT_PROOF_IMAGE =
  '/images/tutorials/django/django-sealos-project-ops-running.webp';
const DJANGO_TOPOLOGY_FACTS = [
  {
    label: 'Public access',
    value: 'Live HTTPS',
  },
  {
    label: 'Django app',
    value: 'Running',
  },
  {
    label: 'PostgreSQL',
    value: 'Running',
  },
];

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
    <Link
      href={tutorial.url}
      className="group text-card-foreground focus-visible:ring-ring bg-card grid overflow-hidden rounded-lg border border-white/15 transition-colors hover:border-[#146dff]/60 focus-visible:ring-2 focus-visible:outline-none md:grid-cols-2 md:items-stretch"
    >
      <div className="flex flex-col gap-4 p-6 md:p-7">
        <div className="flex flex-col gap-2">
          <h2
            id="published-tutorials-heading"
            className="text-primary text-base font-semibold tracking-tight"
          >
            Published guide
          </h2>
          <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm font-medium">
            <span>01</span>
            <span aria-hidden="true">/</span>
            <span>{tutorial.framework}</span>
            <span aria-hidden="true">/</span>
            <span>
              {tutorial.stage === 'beginner'
                ? 'Core deployment'
                : tutorial.stageLabel}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">
            <span className="text-foreground group-hover:text-primary transition-colors">
              {isDjangoGuide ? (
                <>
                  <span className="block">How to Deploy a Django App</span>
                  <span className="block">on Sealos</span>
                </>
              ) : (
                tutorial.title
              )}
            </span>
          </h3>
          <p className="text-foreground/85 text-sm leading-6">
            {tutorial.description}
          </p>
        </div>

        <ul className="text-foreground/85 grid list-none divide-y divide-white/10 border-y border-white/10 text-sm leading-5">
          <li className="flex gap-3 py-2 first:pt-0">
            <span className="text-muted-foreground w-14 shrink-0">Runtime</span>
            <span>Django with Gunicorn and WhiteNoise.</span>
          </li>
          <li className="flex gap-3 py-2">
            <span className="text-muted-foreground w-14 shrink-0">Data</span>
            <span>PostgreSQL connected to the running application.</span>
          </li>
          <li className="flex gap-3 py-2 last:pb-0">
            <span className="text-muted-foreground w-14 shrink-0">Proof</span>
            <span>Live create/read verification on Sealos.</span>
          </li>
        </ul>

        <div className="text-muted-foreground border-border/80 mt-auto flex flex-wrap items-center justify-between gap-3 border-t pt-4 text-sm">
          {tutorial.estimatedReadingTime && (
            <span className="inline-flex items-center gap-2">
              <BookOpen size={14} aria-hidden="true" />
              {tutorial.estimatedReadingTime}
            </span>
          )}
          <span className="inline-flex items-center rounded-md bg-[#146dff] px-4 py-2 font-semibold text-white transition-colors group-hover:bg-[#0f5dd6]">
            Read tutorial
            <ArrowRight
              size={15}
              className="ml-2 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </span>
        </div>
      </div>

      {isDjangoGuide ? (
        <figure className="order-first flex w-full flex-col border-b border-white/10 bg-[#080a0f] p-4 md:order-none md:border-b-0 md:border-l md:border-white/10">
          <div className="relative aspect-[2.05/1] w-full overflow-hidden rounded-md border border-white/10">
            <Image
              src={DJANGO_PROJECT_PROOF_IMAGE}
              alt="Sealos Project Canvas showing public access, the Django container, and PostgreSQL running"
              className="h-full w-full scale-[1.28] object-cover object-[52%_45%]"
              fill
              priority={priorityImage}
              quality={95}
              sizes="(max-width: 760px) 90vw, 48vw"
            />
          </div>
          <figcaption className="mt-3 grid grid-cols-3 divide-x divide-white/10 border-t border-white/10">
            {DJANGO_TOPOLOGY_FACTS.map((fact) => (
              <span key={fact.label} className="px-3 pt-3 first:pl-0">
                <span className="block text-xs leading-4 text-zinc-500">
                  {fact.label}
                </span>
                <span className="mt-1 flex items-center gap-1.5 text-sm leading-5 font-medium text-zinc-100">
                  <span className="size-1.5 rounded-full bg-emerald-400" />
                  {fact.value}
                </span>
              </span>
            ))}
          </figcaption>
        </figure>
      ) : (
        tutorial.image && (
          <figure className="border-border/80 order-first flex w-full flex-col gap-3 border-b bg-zinc-950 p-4 md:order-none md:col-span-7 md:border-b-0 md:border-l">
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
    </Link>
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
        <section className="container -mt-24 pt-32 pb-6">
          <h1
            aria-label="Sealos tutorials for app deployment"
            className="text-foreground max-w-5xl text-5xl font-medium tracking-tight md:text-6xl"
          >
            <span>Sealos tutorials for </span>
            <span className="text-primary">app deployment</span>
          </h1>
          <p className="text-muted-foreground mt-5 max-w-2xl text-base leading-7">
            Follow a small set of complete deployment guides built from verified
            repositories and live application evidence, beginning with Django.
          </p>
        </section>

        <section
          id="published-tutorials"
          className="container scroll-mt-28 pb-2"
          aria-labelledby="published-tutorials-heading"
        >
          {firstTutorial && (
            <>
              <TutorialCatalogCard tutorial={firstTutorial} priorityImage />
              <section
                className="border-border -mt-px border-t"
                aria-labelledby="inside-guide-heading"
              >
                <h2
                  id="inside-guide-heading"
                  className="text-foreground py-5 text-lg font-semibold tracking-tight"
                >
                  Inside this guide
                </h2>
                <div className="grid border-t border-[#146dff]/55 md:grid-cols-3">
                  <Link
                    href={`${firstTutorial.url}#prepare-django-for-production`}
                    className="group relative flex flex-col justify-center py-7 pr-8 focus-visible:ring-2 focus-visible:outline-none"
                  >
                    <span className="absolute -top-2.5 left-0 flex size-5 items-center justify-center rounded-full bg-[#146dff] text-[9px] font-semibold text-white">
                      01
                    </span>
                    <h3 className="text-foreground group-hover:text-primary font-semibold">
                      Prepare Django for production
                    </h3>
                    <p className="text-muted-foreground mt-2 text-sm leading-5">
                      Configure Gunicorn and WhiteNoise for deployment.
                    </p>
                  </Link>
                  <Link
                    href={`${firstTutorial.url}#deploy-with-sealos-skills`}
                    className="group border-border relative flex flex-col justify-center border-t py-7 focus-visible:ring-2 focus-visible:outline-none md:border-t-0 md:border-l md:px-8"
                  >
                    <span className="absolute -top-2.5 left-0 flex size-5 items-center justify-center rounded-full bg-[#146dff] text-[9px] font-semibold text-white md:-left-2.5">
                      02
                    </span>
                    <h3 className="text-foreground group-hover:text-primary font-semibold">
                      Deploy with Sealos Skills
                    </h3>
                    <p className="text-muted-foreground mt-2 text-sm leading-5">
                      Connect the application, container, and database.
                    </p>
                  </Link>
                  <Link
                    href={`${firstTutorial.url}#verify-the-live-django-application`}
                    className="group border-border relative flex flex-col justify-center border-t py-7 focus-visible:ring-2 focus-visible:outline-none md:border-t-0 md:border-l md:pl-8"
                  >
                    <span className="absolute -top-2.5 left-0 flex size-5 items-center justify-center rounded-full bg-[#146dff] text-[9px] font-semibold text-white md:-left-2.5">
                      03
                    </span>
                    <h3 className="text-foreground group-hover:text-primary font-semibold">
                      Verify the live Django application
                    </h3>
                    <p className="text-muted-foreground mt-2 text-sm leading-5">
                      Confirm the HTTPS create/read flow on Sealos.
                    </p>
                  </Link>
                </div>
              </section>
            </>
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

          <section className="mt-10 flex flex-col gap-5 border-y border-white/10 bg-white/[0.015] px-6 py-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <h2 className="text-foreground text-2xl font-semibold tracking-tight">
                Need a guide for your stack?
              </h2>
              <p className="text-muted-foreground mt-3 text-sm leading-6">
                Share the framework or runtime and the deployment job you need.
                Requests help prioritize the next qualified Core tutorial.
              </p>
            </div>
            <TutorialRequestGuideLink
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'border-border text-foreground hover:text-foreground h-10 shrink-0 bg-transparent px-5 hover:bg-white/5',
              )}
            >
              Request a tutorial
              <ArrowRight size={16} className="ml-2" aria-hidden="true" />
            </TutorialRequestGuideLink>
          </section>
        </section>
      </main>
    </>
  );
}
