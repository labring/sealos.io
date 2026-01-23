import RelatedArticles from '@/app/[lang]/(home)/blog/components/RelatedArticles';
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
import { SealosBrandCard } from '@/new-components/SealosBrandCard';
import { SocialLinks } from '@/new-components/SocialLinks';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { DocsPage } from 'fumadocs-ui/page';
import { ChevronLeftIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { BlogFooter } from '../components/BlogFooter';

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

        .blog-content img {
          display: block;
          margin-left: auto;
          margin-right: auto;
        }

        .blog_layout [data-toc] {
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
        sidebar={{
          enabled: false,
          tabs: false,
        }}
        tree={blog.pageTree[params.lang]}
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
          tableOfContentPopover={{
            style: 'normal',
          }}
          breadcrumb={{
            enabled: false,
          }}
          footer={{
            enabled: true,
            items: adjacentPosts,
            component: (
              <>
                <BlogFooter adjacentPosts={adjacentPosts} />

                <div className="mt-20 block xl:hidden">
                  <SealosBrandCard />
                  <SocialLinks url={pageUrl} title={page.data.title} />
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
          <article className="custom-container w-full max-w-[900px]">
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
                    <span className="bg-primary/5 border-primary/5 text-primary flex items-center gap-1 rounded-lg border border-dashed px-3 py-2 text-xs font-medium">
                      <div className="size-1.5 rounded-full bg-blue-400" />
                      {category.toUpperCase()}
                    </span>
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

            <div className="blog-content -mt-4 w-full border-t pt-8">
              {children}
            </div>
          </article>
        </DocsPage>
      </DocsLayout>
    </>
  );
}
