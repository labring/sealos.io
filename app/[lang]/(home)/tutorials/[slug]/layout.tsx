import AIShareButtons from '@/components/ai-share-buttons';
import AIShareButtonsCompact from '@/components/ai-share-buttons-compact';
import StructuredDataComponent from '@/components/structured-data';
import { languagesType } from '@/lib/i18n';
import {
  getAdjacentTutorials,
  getRelatedTutorials,
  getTutorialPage,
  getTutorialStageLabel,
} from '@/lib/utils/tutorial-utils';
import { toFaqPlainText } from '@/lib/utils/content-utils';
import { getBaseUrl, getPageUrl } from '@/lib/utils/metadata';
import {
  generateArticleSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateHowToSchema,
  type HowToData,
  type StructuredData,
} from '@/lib/utils/structured-data';
import { SealosBrandCard } from '@/new-components/SealosBrandCard';
import { SocialLinks } from '@/new-components/SocialLinks';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { DocsPage } from 'fumadocs-ui/page';
import { ArrowRight, CalendarDays, ChevronLeftIcon, Clock3 } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

interface TutorialLayoutProps {
  params: { lang: languagesType; slug: string };
  children: ReactNode;
}

function isStructuredData(
  item: StructuredData | null | undefined,
): item is StructuredData {
  return Boolean(item);
}

export default async function TutorialLayout({
  params,
  children,
}: TutorialLayoutProps): Promise<JSX.Element> {
  const page = getTutorialPage(params.slug, params.lang);
  if (!page) notFound();

  const pageUrl = getPageUrl('en', page.url);
  const baseUrl = getBaseUrl('en');
  const publishedDate = new Date(page.data.date);
  const publishedAt = publishedDate.toISOString();
  const updatedAt = new Date(page.data.updated ?? page.data.date).toISOString();
  const publishedLabel = publishedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const adjacentTutorials = getAdjacentTutorials(page);
  const relatedTutorials = getRelatedTutorials(page);
  const stageLabel = getTutorialStageLabel(page.data.stage);
  const pageContent =
    typeof page.data.body === 'string' ? page.data.body : undefined;

  const articleSchema = generateArticleSchema(
    page.data.title,
    page.data.description,
    pageUrl,
    publishedAt,
    updatedAt,
    page.data.authors,
    undefined,
    page.data.tags,
    'en',
    updatedAt,
    pageContent,
  );

  const breadcrumbSchema = generateBreadcrumbSchema(
    [
      { name: 'Home', url: baseUrl },
      { name: 'Tutorials', url: `${baseUrl}/tutorials` },
      { name: page.data.title, url: pageUrl },
    ],
    'en',
  );

  let faqSchema: StructuredData | null = null;
  if (page.data.faq && page.data.faq.length > 0) {
    const faqItems = await Promise.all(
      page.data.faq.map(async (item) => ({
        question: item.question,
        answer: await toFaqPlainText(item.answer),
      })),
    );
    faqSchema = generateFAQSchema(faqItems, 'en');
  }

  const howToSchema =
    page.data.howTo && page.data.howTo.steps.length > 0
      ? generateHowToSchema(page.data.howTo as HowToData)
      : null;

  const structuredData = [
    articleSchema,
    breadcrumbSchema,
    faqSchema,
    howToSchema,
  ].filter(isStructuredData);

  return (
    <>
      <StructuredDataComponent data={structuredData} />

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media (min-width: 768px) {
          .md\\:\\[--fd-nav-height\\:0px\\] {
            --fd-nav-height: 55px !important;
          }
        }
        @media (min-width: 1280px) {
          .md\\:\\[--fd-nav-height\\:0px\\] {
            --fd-nav-height: 100px !important;
          }
        }
        #nd-subnav {
          display: none;
        }

        .tutorial-content img {
          display: block;
          margin-left: auto;
          margin-right: auto;
        }

        .tutorial_layout [data-toc] {
          position: sticky;
          padding-top: 100px !important;
        }

        #nd-docs-layout {
          gap: 4rem;
          --fd-nav-height: 96px !important;

          @media (width >= 80rem) {
            --fd-toc-width: 360px !important;
            margin-left: auto;
            margin-right: auto;
          }
        }

        #nd-page > article {
          margin-left: auto !important;
          margin-right: auto !important;
        }

        #nd-page > :first-child {
          margin-left: auto;
          margin-right: auto;
          padding-left: 1rem;
          padding-right: 1rem;

          /* container */
          width: 100%;
          @media (width >= 40rem) {
            max-width: 40rem;
          }
          @media (width >= 48rem) {
            max-width: 48rem;
          }
          @media (width >= 64rem) {
            max-width: 64rem;
          }
          @media (width >= 80rem) {
            max-width: 80rem;
          }
          @media (width >= 96rem) {
            max-width: 96rem;
          }
        }

        #nd-tocnav {
          margin-top: 0.5rem;
          border-radius: 20px;
          border: 1px solid var(--color-border);
          margin-left: auto;
          margin-right: auto;
        }
        `,
        }}
      />

      <DocsLayout
        sidebar={{ enabled: false, tabs: false }}
        tree={{ name: 'Tutorials', children: [] }}
      >
        <DocsPage
          toc={page.data.toc}
          tableOfContent={{
            style: 'clerk',
            single: false,
            header: (
              <div className="mb-4">
                <SealosBrandCard />
                <SocialLinks url={pageUrl} title={page.data.title} />
              </div>
            ),
          }}
          tableOfContentPopover={{ style: 'normal' }}
          breadcrumb={{ enabled: false }}
          footer={{
            enabled: true,
            items: adjacentTutorials,
            component: (
              <>
                {(adjacentTutorials.previous || adjacentTutorials.next) && (
                  <nav
                    className="mt-12 grid gap-4 border-t pt-8 sm:grid-cols-2"
                    aria-label="Adjacent tutorials"
                  >
                    {adjacentTutorials.previous ? (
                      <Link
                        href={adjacentTutorials.previous.url}
                        className="group rounded-2xl border p-4 text-left transition-colors hover:border-emerald-300"
                      >
                        <p className="text-muted-foreground text-sm">
                          Previous
                        </p>
                        <p className="mt-2 font-medium leading-snug">
                          {adjacentTutorials.previous.name}
                        </p>
                      </Link>
                    ) : (
                      <div />
                    )}
                    {adjacentTutorials.next && (
                      <Link
                        href={adjacentTutorials.next.url}
                        className="group rounded-2xl border p-4 text-left transition-colors hover:border-emerald-300 sm:text-right"
                      >
                        <p className="text-muted-foreground text-sm">Next</p>
                        <p className="mt-2 font-medium leading-snug">
                          {adjacentTutorials.next.name}
                        </p>
                      </Link>
                    )}
                  </nav>
                )}

                {relatedTutorials.length > 0 && (
                  <section className="bg-card/40 mt-12 rounded-3xl border p-6">
                    <p className="text-muted-foreground text-sm font-medium">
                      Keep building
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold">
                      Continue this Sealos path
                    </h2>
                    <div className="mt-5 grid gap-3 md:grid-cols-2">
                      {relatedTutorials.map((tutorial) => (
                        <Link
                          key={tutorial.slug}
                          href={tutorial.url}
                          className="group rounded-2xl border bg-background/80 p-4 transition-colors hover:border-emerald-300"
                        >
                          <p className="text-muted-foreground text-xs font-medium">
                            {tutorial.stageLabel}
                          </p>
                          <p className="mt-1 font-medium leading-snug">
                            {tutorial.title}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}

                <div className="mt-20 block xl:hidden">
                  <SealosBrandCard />
                  <SocialLinks url={pageUrl} title={page.data.title} />
                </div>

                <AIShareButtons lang="en" className="mt-20" />
              </>
            ),
          }}
        >
          <article className="custom-container w-full max-w-[900px]">
            <div className="mb-6 w-full">
              <Link
                href="/tutorials"
                className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-4 text-sm font-medium text-zinc-300 transition-all hover:border-blue-200/50 hover:bg-blue-400/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/70 active:translate-y-px"
              >
                <ChevronLeftIcon className="size-4" />
                <span>Back to Tutorials</span>
              </Link>
            </div>

            <header className="relative mb-12 overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b0b0d] p-6 shadow-[0_32px_120px_rgba(0,0,0,0.45)] sm:p-10">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(255,255,255,0.12),transparent_18rem),radial-gradient(circle_at_88%_12%,rgba(37,99,235,0.18),transparent_20rem)]" />
              <div className="relative">
                <div className="mb-5 flex flex-wrap items-center gap-3">
                  <span className="inline-flex min-h-7 items-center rounded-full border border-blue-300/35 bg-blue-400/10 px-3 py-1 text-xs font-medium text-blue-100">
                    Step {page.data.seriesOrder}
                  </span>
                  <span className="inline-flex min-h-7 items-center rounded-full border border-white/10 bg-white/[0.055] px-3 py-1 text-xs font-medium text-zinc-200">
                    {stageLabel}
                  </span>
                  <span className="inline-flex min-h-7 items-center rounded-full border border-white/10 bg-white/[0.055] px-3 py-1 text-xs font-medium text-zinc-400">
                    {page.data.framework}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm text-zinc-500">
                    <CalendarDays size={14} aria-hidden="true" />
                    {publishedLabel}
                  </span>
                  {page.data.estimatedReadingTime && (
                    <span className="inline-flex items-center gap-1.5 text-sm text-zinc-500">
                      <Clock3 size={14} aria-hidden="true" />
                      {page.data.estimatedReadingTime}
                    </span>
                  )}
                </div>

                <h1 className="mb-5 max-w-4xl text-balance text-4xl font-semibold leading-[1.04] tracking-tight text-white sm:text-5xl lg:text-6xl">
                  {page.data.title}
                </h1>
                <p className="max-w-3xl text-lg leading-8 text-zinc-400">
                  {page.data.description}
                </p>

                <div className="mt-8 flex flex-col gap-4">
                  <Link
                    href={page.data.cta.href}
                    className="inline-flex min-h-11 w-fit items-center justify-center whitespace-nowrap rounded-full border border-white bg-gradient-to-b from-white from-10% to-gray-300 to-90% px-5 py-3 text-sm font-semibold text-zinc-900 shadow-[0_10px_15px_-3px_rgba(255,255,255,0.16),0_4px_6px_-2px_rgba(255,255,255,0.05)] transition-all hover:border-neutral-200 hover:from-[#eaeaea] hover:to-[#9e9e9e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/70 active:translate-y-px"
                  >
                    {page.data.cta.label}
                    <ArrowRight size={16} className="ml-2" aria-hidden="true" />
                  </Link>

                  <AIShareButtonsCompact lang="en" />
                </div>
              </div>
            </header>

            <div className="tutorial-content -mt-4 w-full border-t pt-8">
              {children}
            </div>
          </article>
        </DocsPage>
      </DocsLayout>
    </>
  );
}
