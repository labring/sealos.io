import type { MetadataRoute } from 'next';
import { faqSource } from '@/lib/source';
import { getPageUrl } from '@/lib/utils/metadata';
import { locales } from '@/lib/i18n';

export const revalidate = false;
/** Force static generation for static export (output: 'export') */
export const dynamic = 'force-static';

const escapeXmlChars = (url: string): string =>
  url
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

/**
 * Generate static params for all supported languages
 * Required for static export (output: 'export')
 */
export async function generateStaticParams() {
  return locales.map((locale) => ({
    lang: locale.locale,
  }));
}

/**
 * Standard Next.js sitemap metadata route
 * For dynamic route segments, Next.js calls this function for each generated param
 * Params are passed synchronously (not as Promise) in metadata routes
 */
export default async function sitemap(
  props?: { params?: { lang: string }; id?: string | Promise<string> },
): Promise<MetadataRoute.Sitemap> {
  // For dynamic route segments, params should be available
  // If params is not provided, fallback to default language
  const lang = props?.params?.lang || 'en';
  const pages = faqSource.getPages(lang as 'en' | 'zh-cn');

  const items: MetadataRoute.Sitemap = pages.map((page) => {
    const pageUrl = getPageUrl(lang, page.url);
    return {
      url: escapeXmlChars(pageUrl),
      changeFrequency: 'weekly',
      priority: 0.6,
    };
  });

  return items;
}
