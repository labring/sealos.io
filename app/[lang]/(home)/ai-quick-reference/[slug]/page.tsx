import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import React from 'react';
import { DocsBody } from 'fumadocs-ui/page';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { GradientText } from '../../(new-home)/components/GradientText';
import { FAQTag } from '@/new-components/FAQTag';
import { FAQCard } from '@/new-components/FAQCard';
import { siteConfig } from '@/config/site';
import {
  getFAQBySlug,
  findRelatedFAQs,
  getAdjacentFAQs,
  getAllFAQs,
  getFAQsByCategory,
  pageToFAQItem,
  getCategory,
} from '@/lib/utils/faq-utils';
import { Button } from '@/components/ui/button';
import { faqSource } from '@/lib/source';
import { GodRays } from '@/new-components/GodRays';
import FacebookIconImage from '@/assets/social-icons/facebook.svg';
import XIconImage from '@/assets/social-icons/x.svg';
import LinkedinIconImage from '@/assets/social-icons/linkedin.svg';
import YcombinatorIconImage from '@/assets/social-icons/ycombinator.svg';
import RedditIconImage from '@/assets/social-icons/reddit.svg';
import SealosLogoImage from '@/assets/shared-icons/sealos.svg';

interface PageProps {
  params: Promise<{
    slug: string;
    lang: string;
  }>;
}

export default async function FAQDetailPage({ params }: PageProps) {
  const { slug, lang } = await params;
  const langPrefix = `/${lang}`;

  // Get FAQ page from source
  const faqPage = getFAQBySlug(slug, lang);
  if (!faqPage) {
    notFound();
  }

  const faqItem = pageToFAQItem(faqPage);

  // Generate full page URL for social sharing
  const baseUrl = lang === 'zh-cn' ? 'https://sealos.run' : 'https://sealos.io';
  const pageUrl = `${baseUrl}${langPrefix}${faqPage.url}`;
  const encodedUrl = encodeURIComponent(pageUrl);
  const encodedTitle = encodeURIComponent(faqItem.title);
  const category = faqItem.category;

  // Get related FAQs
  const relatedPages = findRelatedFAQs(slug, lang, 4);
  const relatedQuestions = relatedPages.map((page) => {
    const item = pageToFAQItem(page);
    return {
      tag: {
        label: item.category,
      },
      title: item.title,
      description: item.description,
      href: `${langPrefix}${page.url}`,
    };
  });

  // Get adjacent FAQs
  const { previous, next } = getAdjacentFAQs(slug, lang);

  // Get keep reading from the same category, excluding current page and related questions
  const relatedSlugs = new Set(
    relatedPages.map((p) => p.url.split('/').pop() || ''),
  );
  const keepReadingPages = getFAQsByCategory(category, lang)
    .filter((page) => {
      const pageSlug = page.url.split('/').pop() || '';
      return (
        pageSlug !== slug &&
        pageSlug.replace(/^\d+-/, '') !== slug.replace(/^\d+-/, '') &&
        !relatedSlugs.has(pageSlug)
      );
    })
    .slice(0, 4);

  // If not enough from same category, fill with other categories
  if (keepReadingPages.length < 4) {
    const additionalPages = getAllFAQs(lang)
      .filter((page) => {
        const pageSlug = page.url.split('/').pop() || '';
        const pageCategory = getCategory(page);
        return (
          pageCategory !== category &&
          pageSlug !== slug &&
          pageSlug.replace(/^\d+-/, '') !== slug.replace(/^\d+-/, '') &&
          !relatedSlugs.has(pageSlug)
        );
      })
      .slice(0, 4 - keepReadingPages.length);
    keepReadingPages.push(...additionalPages);
  }
  const keepReading = keepReadingPages.map((page) => ({
    title: (page.data.title as string) || '',
    href: `${langPrefix}${page.url}`,
  }));

  // Get the MDX content component
  const Content = (faqPage.data as any).body as React.ComponentType<any>;

  return (
    <>
      <GodRays
        sources={[
          {
            x: -0.05,
            y: -0.05,
            angle: 60,
            spread: 20,
            count: 12,
            color: '220, 220, 220',
            opacityMin: 0.24,
            opacityMax: 0.25,
            minWidth: 120,
            maxWidth: 180,
          },
          {
            x: -0.05,
            y: -0.05,
            angle: 60,
            spread: 8,
            count: 6,
            color: '255, 255, 255',
            opacityMin: 0.89,
            opacityMax: 0.9,
            minWidth: 12,
            maxWidth: 24,
          },
          {
            x: 0.25,
            y: -0.06,
            angle: 50,
            spread: 20,
            count: 6,
            color: '180, 180, 180',
            opacityMin: 0.14,
            opacityMax: 0.15,
            minWidth: 60,
            maxWidth: 120,
          },
        ]}
        speed={0.0}
        maxWidth={48}
        minLength={1200}
        maxLength={2000}
        blur={8}
      />
      <div className="container -mt-24 pt-44 pb-20">
        {/* Back Button */}
        <Link
          href={`${langPrefix}/ai-quick-reference`}
          className="text-muted-foreground hover:text-foreground mb-14 inline-flex items-center gap-2 text-sm transition-colors"
        >
          <ChevronLeft size={16} />
          <span>Back to FAQ</span>
        </Link>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_360px]">
          {/* Main Content */}
          <article>
            <div className="mb-12 flex flex-col gap-5">
              {/* Tag */}
              <div>
                <FAQTag label={category} color="bg-blue-400" />
              </div>

              {/* Title */}
              <h1 className="text-4xl leading-[40px] font-semibold">
                <GradientText>{faqItem.title}</GradientText>
              </h1>
            </div>

            {/* Main Content - Render MDX */}
            <div className="mb-14">
              <DocsBody>
                <Content
                  components={{
                    ...defaultMdxComponents,
                  }}
                />
              </DocsBody>
            </div>

            {/* Prev/Next Navigation */}
            <div className="flex gap-3">
              {previous ? (
                <Link
                  href={`${langPrefix}${previous.url}`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/15"
                >
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </Link>
              ) : (
                <div className="flex flex-1" />
              )}
              {next ? (
                <Link
                  href={`${langPrefix}${next.url}`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/15"
                >
                  <span>Next</span>
                  <ChevronRight size={16} />
                </Link>
              ) : (
                <div className="flex flex-1" />
              )}
            </div>
          </article>

          {/* Sidebar */}
          <aside className="flex flex-col gap-10 sm:flex-row sm:gap-6 lg:sticky lg:top-28 lg:h-fit lg:flex-col lg:gap-12">
            {/* Sealos Brand Card */}
            <div>
              <div className="border-border bg-primary-foreground w-full rounded-xl border p-8">
                <div className="mb-8 flex flex-col gap-6">
                  <div className="flex items-center gap-1">
                    <Image
                      alt="Sealos Logo"
                      src={SealosLogoImage}
                      className="mr-2 h-10 w-10"
                      width={24}
                      height={24}
                    />
                    <span className="text-2xl font-medium text-white">
                      Sealos
                    </span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <p className="text-xl font-medium">
                      <GradientText>Unify Your Entire Workflow.</GradientText>
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Code in a ready-to-use cloud environment, deploy with a
                      click. Sealos combines the entire dev-to-prod lifecycle
                      into one seamless platform. No more context switching.
                    </p>
                  </div>
                </div>

                <Button variant="landing-primary" asChild className="w-full">
                  <Link href={siteConfig.links.mainCta}>
                    <span>Try Free</span>
                    <ArrowRight size={16} className="ml-1" />
                  </Link>
                </Button>
              </div>

              {/* Social Links */}
              <div className="mt-6 flex gap-6 text-white">
                <Button
                  variant="secondary"
                  className="h-10 w-10 rounded-full p-0"
                  asChild
                >
                  <a
                    href={`https://linkedin.com/shareArticle?url=${encodedUrl}&mini=true&title=${encodedTitle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src={LinkedinIconImage}
                      alt="Share to Linkedin"
                      className="size-4"
                      width={24}
                      height={24}
                    />
                  </a>
                </Button>
                <Button
                  variant="secondary"
                  className="h-10 w-10 rounded-full p-0"
                  asChild
                >
                  <a
                    href={`https://x.com/intent/post?url=${encodedUrl}&text=${encodedTitle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src={XIconImage}
                      alt="Share to X"
                      className="size-4"
                      width={24}
                      height={24}
                    />
                  </a>
                </Button>
                <Button
                  variant="secondary"
                  className="h-10 w-10 rounded-full p-0"
                  asChild
                >
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src={FacebookIconImage}
                      alt="Share to Facebook"
                      className="size-4"
                      width={24}
                      height={24}
                    />
                  </a>
                </Button>
                <Button
                  variant="secondary"
                  className="h-10 w-10 rounded-full p-0"
                  asChild
                >
                  <a
                    href={`https://www.reddit.com/submit?url=${encodedUrl}&type=LINK`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src={RedditIconImage}
                      alt="Share to Reddit"
                      className="size-6"
                      width={24}
                      height={24}
                    />
                  </a>
                </Button>
                <Button
                  variant="secondary"
                  className="h-10 w-10 rounded-full p-0"
                  asChild
                >
                  <a
                    href={`https://news.ycombinator.com/submitlink?t=${encodedTitle}&u=${encodedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src={YcombinatorIconImage}
                      alt="Share to Hacker News"
                      className="size-4"
                      width={24}
                      height={24}
                    />
                  </a>
                </Button>
              </div>
            </div>

            {/* Keep Reading */}
            <div className="flex w-full flex-col gap-6">
              <h2 className="text-lg font-bold">Keep Reading</h2>
              <div className="flex flex-col gap-3">
                {keepReading.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="border-border bg-card text-muted-foreground hover:text-foreground rounded-xl border p-4 text-sm transition-colors"
                  >
                    <span className="line-clamp-1">{item.title}</span>
                  </Link>
                ))}
              </div>
              <Link
                href={`${langPrefix}/ai-quick-reference`}
                className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm font-medium transition-colors"
              >
                <span>All Frequently Asked Questions</span>
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </aside>

          {/* Related Questions */}
          <div className="order-1 mt-4 lg:order-2">
            <h2 className="mb-8 text-2xl font-semibold">Related Questions</h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {relatedQuestions.map((question, index) => (
                <FAQCard
                  key={index}
                  tag={question.tag}
                  title={question.title}
                  description={question.description}
                  href={question.href}
                  // Show only 2 entries when screen width < sm
                  className="not-nth-[-n_+_2]:hidden sm:not-nth-[-n_+_2]:block"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function generateStaticParams() {
  // Generate params for all languages
  // Since we only have English content, we'll generate params for both languages
  // but the content will fallback to English
  const languages = ['en', 'zh-cn'];
  const params: Array<{ lang: string; slug: string }> = [];

  // Get all pages from the default language (English)
  const defaultPages = faqSource.getPages('en');

  for (const lang of languages) {
    for (const page of defaultPages) {
      const slug = page.slugs[0];
      if (slug) {
        params.push({ lang, slug });
      }
    }
  }

  return params;
}
