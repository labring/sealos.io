import {
  ArticleBadge,
  ArticleDetailShell,
  ArticleTocHeader,
} from '@/components/article/article-detail-shell';
import { ArticlePager } from '@/components/article/article-pager';
import AIShareButtons from '@/components/ai-share-buttons';
import StructuredDataComponent from '@/components/structured-data';
import { languagesType } from '@/lib/i18n';
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
import {
  getAdjacentTutorials,
  getRelatedTutorials,
  getTutorialPage,
  getTutorialStageLabel,
} from '@/lib/utils/tutorial-utils';
import {
  ArrowDownRight,
  BookOpen,
  CalendarDays,
  ChevronLeftIcon,
  Clock3,
  Code2,
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

interface TutorialLayoutProps {
  params: { lang: languagesType; slug: string[] };
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

  const pageUrl = getPageUrl('en', page.data.slug);
  const baseUrl = getBaseUrl('en');
  const publishedAt = new Date(page.data.date).toISOString();
  const updatedDate = new Date(page.data.updated ?? page.data.date);
  const updatedAt = updatedDate.toISOString();
  const updatedLabel = updatedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
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
      { name: page.data.framework, url: pageUrl },
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

      <ArticleDetailShell
        pageTree={{ name: 'Tutorials', children: [] }}
        toc={page.data.toc}
        title={page.data.title}
        url={pageUrl}
        footer={{
          enabled: true,
          items: adjacentTutorials,
          component: (
            <>
              {(adjacentTutorials.previous || adjacentTutorials.next) && (
                <ArticlePager
                  adjacentItems={adjacentTutorials}
                  ariaLabel="Adjacent tutorials"
                  previousLabel="Previous Tutorial"
                  nextLabel="Next Tutorial"
                />
              )}

              <div className="mt-20 block xl:hidden">
                <ArticleTocHeader
                  className=""
                  url={pageUrl}
                  title={page.data.title}
                />
              </div>

              {relatedTutorials.length > 0 && (
                <section
                  aria-labelledby="related-tutorials-heading"
                  className="mt-16 space-y-6"
                >
                  <header>
                    <p className="text-muted-foreground text-sm font-medium">
                      Continue learning
                    </p>
                    <h2
                      id="related-tutorials-heading"
                      className="mt-2 text-2xl font-semibold tracking-tight"
                    >
                      More in the {page.data.framework} path
                    </h2>
                  </header>
                  <div className="grid gap-4 md:grid-cols-2">
                    {relatedTutorials.map((tutorial) => (
                      <Link
                        key={tutorial.slug}
                        href={tutorial.url}
                        className="bg-primary-foreground hover:border-primary focus-visible:ring-ring group flex flex-col gap-3 rounded-xl border p-4 transition-colors duration-300 focus-visible:ring-2 focus-visible:outline-none"
                      >
                        <p className="text-muted-foreground text-xs font-medium">
                          {tutorial.stageLabel}
                        </p>
                        <p className="group-hover:text-primary line-clamp-2 leading-snug font-medium">
                          {tutorial.title}
                        </p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              <AIShareButtons lang="en" className="mt-20" />
            </>
          ),
        }}
      >
        <nav
          aria-label="Breadcrumb"
          className="text-muted-foreground mt-8 mb-8 flex flex-wrap items-center gap-2 text-sm"
        >
          <Link
            href="/tutorials"
            className="hover:text-foreground focus-visible:ring-ring inline-flex min-h-10 items-center gap-1.5 rounded-lg px-2 transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            <ChevronLeftIcon className="size-4" aria-hidden="true" />
            Tutorials
          </Link>
          <span aria-hidden="true">/</span>
          <span>{page.data.framework}</span>
          <span aria-hidden="true">/</span>
          <span className="text-foreground">{page.data.sidebar_title}</span>
        </nav>

        <header className="mb-16 overflow-hidden">
          <div className="mb-5 flex flex-wrap items-center">
            <ArticleBadge>
              {page.data.framework.toUpperCase()} DEPLOYMENT GUIDE
            </ArticleBadge>
          </div>

          <h1 className="text-foreground mb-5 text-4xl font-semibold">
            {page.data.title}
          </h1>
          <p className="text-muted-foreground max-w-3xl text-lg">
            {page.data.description}
          </p>

          <div className="text-muted-foreground mt-7 flex flex-wrap gap-x-5 gap-y-3 text-sm">
            <span className="inline-flex items-center gap-2">
              <Code2 size={15} className="text-primary" aria-hidden="true" />
              {page.data.runtime}
            </span>
            {page.data.estimatedReadingTime && (
              <span className="inline-flex items-center gap-2">
                <Clock3 size={15} className="text-primary" aria-hidden="true" />
                {page.data.estimatedReadingTime}
              </span>
            )}
            <span className="inline-flex items-center gap-2">
              <BookOpen size={15} className="text-primary" aria-hidden="true" />
              {stageLabel} guide
            </span>
            <span className="inline-flex items-center gap-2">
              <CalendarDays
                size={15}
                className="text-primary"
                aria-hidden="true"
              />
              Updated {updatedLabel}
            </span>
          </div>

          {page.data.entrypoints && (
            <nav
              aria-label="Choose a tutorial starting point"
              className="bg-primary-foreground mt-9 grid overflow-hidden rounded-xl border sm:grid-cols-2"
            >
              <Link
                href={page.data.entrypoints.from_scratch}
                className="hover:bg-accent focus-visible:ring-ring group flex min-h-24 items-center justify-between gap-4 p-5 transition-colors focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset"
              >
                <span>
                  <span className="text-foreground block font-semibold">
                    Start from scratch
                  </span>
                  <span className="text-muted-foreground mt-1 block text-sm leading-5">
                    Build the tutorial project
                  </span>
                </span>
                <ArrowDownRight
                  size={19}
                  className="text-muted-foreground group-hover:text-primary shrink-0 transition-all group-hover:translate-x-0.5 group-hover:translate-y-0.5"
                  aria-hidden="true"
                />
              </Link>
              <Link
                href={page.data.entrypoints.existing_project}
                className="hover:bg-accent focus-visible:ring-ring group flex min-h-24 items-center justify-between gap-4 border-t p-5 transition-colors focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset sm:border-t-0 sm:border-l"
              >
                <span>
                  <span className="text-foreground block font-semibold">
                    I have a project
                  </span>
                  <span className="text-muted-foreground mt-1 block text-sm leading-5">
                    Check production compatibility
                  </span>
                </span>
                <ArrowDownRight
                  size={19}
                  className="text-muted-foreground group-hover:text-primary shrink-0 transition-all group-hover:translate-x-0.5 group-hover:translate-y-0.5"
                  aria-hidden="true"
                />
              </Link>
            </nav>
          )}
        </header>

        <div className="article-content -mt-4 w-full border-t pt-8">
          {children}
        </div>
      </ArticleDetailShell>
    </>
  );
}
