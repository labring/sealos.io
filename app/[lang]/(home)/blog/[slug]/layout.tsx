import { siteConfig } from '@/config/site';
import { blog } from '@/lib/source';
import {
  getBlogImage,
  getPageCategory,
  getPostsByLanguage,
  getRelatedArticles,
} from '@/lib/utils/blog-utils';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { DocsPage } from 'fumadocs-ui/page';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import StructuredDataComponent from '@/components/structured-data';
import AIShareButtonsCompact from '@/components/ai-share-buttons-compact';
import {
  generateArticleSchema,
  generateBreadcrumbSchema,
} from '@/lib/utils/structured-data';

import { languagesType } from '@/lib/i18n';
import RelatedArticles from '@/app/[lang]/(home)/blog/components/RelatedArticles';
import AIShareButtons from '@/components/ai-share-buttons';
import { BlogFooter } from '../components/BlogFooter';
import Link from 'next/link';
import { ChevronLeftIcon } from 'lucide-react';
import { SealosBrandCard } from '@/new-components/SealosBrandCard';

function getAdjacentBlog(
  page: ReturnType<typeof blog.getPage>,
  lang: languagesType,
) {
  const posts = getPostsByLanguage(lang);
  const index = posts.findIndex((p) => p.data.title === page?.data.title);
  const prev = posts[index - 1];
  const next = posts[index + 1];

  return {
    previous: Boolean(prev)
      ? {
          name: prev.data.title,
          url: prev.url,
        }
      : undefined,
    next: Boolean(next)
      ? {
          name: next.data.title,
          url: next.url,
        }
      : undefined,
  };
}
export default async function BlogLayout({
  params,
  children,
}: {
  params: { lang: languagesType; slug: string };
  children: ReactNode;
}) {
  const page = blog.getPage([params.slug], params.lang);

  if (!page) notFound();
  const category = getPageCategory(page);
  const adjacentPosts = getAdjacentBlog(page, params.lang);

  // Generate structured data for the blog post
  const articleSchema = generateArticleSchema(
    page.data.title,
    page.data.description,
    `${siteConfig.url.base}${page.url}`,
    new Date(page.data.date).toISOString(),
    new Date(page.data.date).toISOString(), // Use same date if no modified date
    page.data.authors,
    getBlogImage(page, category),
    page.data.tags,
    params.lang,
  );

  // Generate breadcrumb structured data
  const breadcrumbSchema = generateBreadcrumbSchema(
    [
      { name: 'Home', url: siteConfig.url.base },
      { name: 'Blog', url: `${siteConfig.url.base}/blog` },
      { name: page.data.title, url: `${siteConfig.url.base}${page.url}` },
    ],
    params.lang,
  );

  const candidateArticles = blog.getPages(params.lang);
  const recommendedArticles = getRelatedArticles(page, candidateArticles);
  const relatedArticlesToRender =
    recommendedArticles.length > 0 ? recommendedArticles : candidateArticles;

  return (
    <>
      {/* Structured Data for SEO */}
      <StructuredDataComponent data={[articleSchema, breadcrumbSchema]} />

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
          margin-left: auto;
          margin-right: auto;
          gap: 4rem;
          --fd-toc-width: 360px !important;
          --fd-nav-height: 96px !important;
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
          <article
            className="custom-container mx-auto w-full max-w-[900px]"
            itemType="http://schema.org/Article"
            itemScope
          >
            {/* Back Button */}
            <div className="custom-container mx-auto w-full max-w-[900px] px-4">
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
                  itemProp="image"
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
                      {new Date(page.data.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
                <h1
                  className="text-foreground mb-5 text-4xl font-semibold"
                  itemProp="name"
                >
                  {page.data.title}
                </h1>

                {page.data.description && (
                  <p
                    className="text-muted-foreground text-lg"
                    itemProp="description"
                  >
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
