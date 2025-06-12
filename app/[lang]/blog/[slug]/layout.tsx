import { GetStartedButton } from '@/components/ui/shiny-button';
import { type AuthorData, blogAuthors, siteConfig } from '@/config/site';
import { blog } from '@/lib/source';
import {
  getBlogImage,
  getPageCategory,
  getPostsByLanguage,
} from '@/lib/utils/blog-utils';
import type { InferPageType } from 'fumadocs-core/source';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { Fragment } from 'react';
import { DocsPage } from 'fumadocs-ui/page';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import '../blog.module.css';
import StructuredDataComponent from '@/components/structured-data';
import { generateArticleSchema, generateBreadcrumbSchema } from '@/lib/utils/structured-data';

import { languagesType } from '@/lib/i18n';


function getAdjacentBlog(page: ReturnType<typeof blog.getPage>, lang: languagesType) {
  const posts = getPostsByLanguage(lang);
  const index = posts.findIndex((p) => p.data.title === page?.data.title);
  const prev = posts[index - 1];
  const next = posts[index + 1];

  return {
    previous: Boolean(prev) ? {
      name: prev.data.title,
      url: prev.url
    } : undefined,
    next: Boolean(next) ? {
      name: next.data.title,
      url: next.url
    } : undefined,
  }
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
    getBlogImage(page.data.imageTitle || page.data.title, category),
    page.data.tags,
    params.lang
  );

  // Generate breadcrumb structured data
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url.base },
    { name: 'Blog', url: `${siteConfig.url.base}/blog` },
    { name: page.data.title, url: `${siteConfig.url.base}${page.url}` }
  ], params.lang);

  // inline style: set the position for toc; set as a global style will make docs page strange

  return (
    <>
      {/* Structured Data for SEO */}
      <StructuredDataComponent data={[articleSchema, breadcrumbSchema]} />


    <DocsLayout
      sidebar={{
        enabled: false,
        tabs: false,
      }}
      tree={blog.pageTree[params.lang]}
    >
      <style>
        {`
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
        `}
      </style>
      <DocsPage
        toc={page.data.toc}
        tableOfContent={{
          style: 'clerk',
          single: false,
        }}
        tableOfContentPopover={{
          style: 'normal',
        }}
        breadcrumb={{
          enabled: false,
        }}
        footer={{
          enabled: true,
          items: adjacentPosts
        }}
      >
        <article
          className="custom-container mx-auto w-full max-w-[900px] px-8 py-10 sm:py-20 md:px-[15%]"
          itemType="http://schema.org/Article"
          itemScope
        >
          <div className="mb-10 overflow-hidden rounded-2xl bg-linear-to-b from-primary/10 to-background ">
            <div className="relative h-[250px] w-full">
              <Image
                src={getBlogImage(
                  page.data.imageTitle || page.data.title,
                  category,
                )}
                alt={page.data.title}
                fill
                className="object-cover object-[center_60%]"
                priority
                itemProp="image"
              />
            </div>
            <div className="px-8 py-6">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="inline-block rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">
                    {category.toUpperCase()}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(page.data.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
              <h1
                className="mb-4 text-4xl font-bold tracking-tight text-foreground"
                itemProp="name"
              >
                {page.data.title}
              </h1>

              {page.data.description && (
                <p
                  className="mb-6 text-lg text-muted-foreground"
                  itemProp="description"
                >
                  {page.data.description}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex -space-x-2">
                    {page.data.authors.map((author, i) => (
                      <div
                        key={i}
                        className="z-1 hover:z-10"
                        style={{ zIndex: page.data.authors.length - i }}
                      >
                        <AuthorAvatar author={blogAuthors[author]} />
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex flex-wrap items-center gap-1">
                      {page.data.authors.map((author, i) => (
                        <Fragment key={i}>
                          {i !== 0 && (
                            <span className="text-muted-foreground">&</span>
                          )}
                          <span className="font-medium">
                            {blogAuthors[author].name}
                          </span>
                        </Fragment>
                      ))}
                    </div>
                    {page.data.authors.length === 1 && (
                      <span className="text-sm text-muted-foreground">
                        {blogAuthors[page.data.authors[0]].title}
                      </span>
                    )}
                  </div>
                </div>

                {/* Tags section */}
                {/* {page.data.tags && page.data.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {page.data.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="inline-block rounded-full bg-secondary/70 px-3 py-1 text-xs font-medium text-secondary-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )} */}
              </div>
            </div>
          </div>
          <div className="blog-content -mt-4 w-full border-t pt-8">
            {children}
          </div>
          <Cta lang={params.lang} />
        </article>
      </DocsPage>
    </DocsLayout>
    </>
  );
}

function Cta({ lang }: { lang: languagesType }) {
  
  // Translation for CTA header text
  const ctaText = {
    en: "Ready to experience Sealos?",
    "zh-cn": "一键启动 开发未来"
  }[lang];
  
  // Translation for tagline
  const tagline = {
    en: "Develop, deploy, and scale in one seamless cloud platform",
    "zh-cn": "让环境配置、应用开发、部署发布一气呵成"
  }[lang];

  // Translation for getstarted
  const getstarted = {
    en: "Get Started",
    "zh-cn": "我要试试"
  }[lang];
  
  return (
    <div className="mt-16 rounded-2xl border border-blue-200/20 bg-linear-to-br from-blue-500/10 via-blue-400/5 to-background p-8">
      <div className="flex flex-col items-center text-center">
        <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {ctaText}
        </h3>
        <p className="mt-3 max-w-md text-muted-foreground">
          {tagline}
        </p>
        <Link href="https://os.sealos.io" target="_blank">
          <GetStartedButton className="mt-6" title={getstarted} />
        </Link>
      </div>
    </div>
  );
}

function AuthorAvatar({ author }: { author: AuthorData }) {
  return (
    <Link
      href={author.url ?? '#'}
      rel="nofollow noreferrer"
      target="_blank"
      itemProp="author"
      className="inline-block"
    >
      {author.image_url != null ? (
        <Image
          alt={`Avatar of ${author.name}`}
          src={author.image_url}
          width={40}
          height={40}
          className="rounded-full border-2 border-background"
        />
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
          {author.name.charAt(0)}
        </div>
      )}
    </Link>
  );
}

function SmallAuthor({ author }: { author: AuthorData }) {
  return (
    <Link
      className="flex flex-row items-center gap-1.5 text-foreground"
      href={author.url ?? '#'}
      rel="nofollow noreferrer"
      target="_blank"
      itemProp="author"
    >
      {author.image_url != null && (
        <Image
          alt="avatar"
          src={author.image_url}
          width={25}
          height={25}
          className="h-full rounded-full"
        />
      )}
      {author.name}
    </Link>
  );
}

function Footer({ page }: { page: InferPageType<typeof blog> }) {
  return (
    <div className="mt-[5rem] flex flex-col gap-6">
      {page.data.authors
        .map((author) => blogAuthors[author])
        .map((author, i) => (
          <Link
            key={i}
            className="flex flex-row gap-2 rounded-xl bg-card p-4 text-card-foreground"
            href={author.url ?? '#'}
            target="_blank"
            rel="nofollow noreferrer"
          >
            {author.image_url != null && (
              <Image
                itemProp="image"
                alt="avatar"
                src={author.image_url}
                width={40}
                height={40}
                className="h-full rounded-full"
              />
            )}
            <div>
              <p itemProp="name" className="font-medium">
                {author.name}
              </p>
              <p itemProp="jobTitle" className="text-sm text-muted-foreground">
                {author.title}
              </p>
            </div>
          </Link>
        ))}
    </div>
  );
}
