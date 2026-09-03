import RelatedArticles from '@/app/[lang]/(home)/blog/components/RelatedArticles';
import {
  ArticleBadge,
  ArticleDetailShell,
  ArticleTocHeader,
} from '@/components/article/article-detail-shell';
import { ArticlePager } from '@/components/article/article-pager';
import AIShareButtons from '@/components/ai-share-buttons';
import AIShareButtonsCompact from '@/components/ai-share-buttons-compact';
import StructuredDataComponent from '@/components/structured-data';
import { getLanguageSlug, languagesType } from '@/lib/i18n';
import { blog } from '@/lib/source';
import {
  getBlogImage,
  getPageCategory,
  getPostsByLanguage,
  getRelatedArticles,
  resolvePageContent,
} from '@/lib/utils/blog-utils';
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
import { ChevronLeftIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

type BlogPageData = NonNullable<ReturnType<typeof blog.getPage>>;

type AdjacentPost = {
  name: string;
  url: string;
};

type AdjacentPosts = {
  previous: AdjacentPost | undefined;
  next: AdjacentPost | undefined;
};

type BlogLayoutProps = {
  params: { lang: languagesType; slug: string };
  children: ReactNode;
};

function toAdjacentPost(post?: BlogPageData): AdjacentPost | undefined {
  if (!post) return undefined;
  return { name: post.data.title, url: post.url };
}

function getAdjacentBlog(
  page: BlogPageData,
  lang: languagesType,
): AdjacentPosts {
  const posts = getPostsByLanguage(lang);
  const index = posts.findIndex((p) => p.data.title === page?.data.title);
  const prev = posts[index - 1];
  const next = posts[index + 1];

  return {
    previous: toAdjacentPost(prev),
    next: toAdjacentPost(next),
  };
}

function isStructuredData(
  item: StructuredData | null | undefined,
): item is StructuredData {
  return Boolean(item);
}

export default async function BlogLayout({
  params,
  children,
}: BlogLayoutProps): Promise<JSX.Element> {
  const page = blog.getPage([params.slug], params.lang);

  if (!page) notFound();
  const category = getPageCategory(page);
  const adjacentPosts = getAdjacentBlog(page, params.lang);

  // Generate full page URL for social sharing and structured data
  const pageUrl = getPageUrl(params.lang, page.url);
  const baseUrl = getBaseUrl(params.lang);
  const langPrefix = getLanguageSlug(params.lang);
  const pageContent = resolvePageContent(page.data);
  const publishedDate = new Date(page.data.date);
  const publishedAt = publishedDate.toISOString();
  const publishedLabel = publishedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const lastModifiedAt = page.data.lastModified
    ? new Date(page.data.lastModified).toISOString()
    : undefined;

  // Generate structured data for the blog post
  const articleSchema = generateArticleSchema(
    page.data.title,
    page.data.description,
    pageUrl,
    publishedAt,
    publishedAt, // Use same date if no modified date
    page.data.authors,
    getBlogImage(page, category),
    page.data.tags,
    params.lang,
    lastModifiedAt,
    pageContent,
  );

  // Generate breadcrumb structured data
  const breadcrumbSchema = generateBreadcrumbSchema(
    [
      { name: 'Home', url: baseUrl },
      { name: 'Blog', url: `${baseUrl}${langPrefix}/blog` },
      { name: page.data.title, url: pageUrl },
    ],
    params.lang,
  );

  let faqSchema: StructuredData | null = null;
  if (page.data.faq && page.data.faq.length > 0) {
    const faqItems = await Promise.all(
      page.data.faq.map(async (item) => ({
        question: item.question,
        answer: await toFaqPlainText(item.answer),
      })),
    );
    faqSchema = generateFAQSchema(faqItems, params.lang);
  }

  let howToSchema: StructuredData | null = null;
  if (
    page.data.howTo &&
    Array.isArray(page.data.howTo.steps) &&
    page.data.howTo.steps.length > 0
  ) {
    howToSchema = generateHowToSchema(page.data.howTo as HowToData);
  }

  const structuredData = [
    articleSchema,
    breadcrumbSchema,
    faqSchema,
    howToSchema,
  ].filter(isStructuredData);

  const candidateArticles = blog.getPages(params.lang);
  const recommendedArticles = getRelatedArticles(page, candidateArticles);
  const relatedArticlesToRender =
    recommendedArticles.length > 0 ? recommendedArticles : candidateArticles;

  return (
    <>
      {/* Structured Data for SEO */}
      <StructuredDataComponent data={structuredData} />

      <ArticleDetailShell
        pageTree={blog.pageTree[params.lang]}
        toc={page.data.toc}
        title={page.data.title}
        url={pageUrl}
        footer={{
          enabled: true,
          items: adjacentPosts,
          component: (
            <>
              <ArticlePager adjacentItems={adjacentPosts} />

              <div className="mt-20 block xl:hidden">
                <ArticleTocHeader
                  className=""
                  url={pageUrl}
                  title={page.data.title}
                />
              </div>

              <RelatedArticles
                currentArticle={page}
                relatedArticles={relatedArticlesToRender}
                lang={params.lang}
              />

              <AIShareButtons
                lang={params.lang as languagesType}
                className="mt-20"
              />
            </>
          ),
        }}
      >
        {/* Back Button */}
        <div className="custom-container w-full max-w-[900px] px-4">
          <Link
            href={`/${params.lang}/blog`}
            className="text-muted-foreground hover:text-foreground mt-8 mb-8 inline-flex items-center gap-2 text-sm transition-colors"
          >
            <ChevronLeftIcon size={16} />
            <span>Back to Blogs</span>
          </Link>
        </div>

        <div className="mb-16 overflow-hidden">
          <div className="relative aspect-[120/63] w-full overflow-clip rounded-xl border">
            <Image
              src={getBlogImage(page, category, 'svg-header')}
              alt={page.data.title}
              fill
              className="h-full w-full object-cover"
              priority
            />
          </div>

          <div className="py-10">
            <div className="mb-5 flex flex-wrap items-center justify-between">
              <div className="flex items-center gap-5">
                <ArticleBadge>{category.toUpperCase()}</ArticleBadge>
                <span className="text-muted-foreground text-sm">
                  {publishedLabel}
                </span>
              </div>
            </div>
            <h1 className="text-foreground mb-5 text-4xl font-semibold">
              {page.data.title}
            </h1>

            {page.data.description && (
              <p className="text-muted-foreground text-lg">
                {page.data.description}
              </p>
            )}
          </div>

          <AIShareButtonsCompact lang={params.lang} />
        </div>

        <div className="article-content -mt-4 w-full border-t pt-8">
          {children}
        </div>
      </ArticleDetailShell>
    </>
  );
}
