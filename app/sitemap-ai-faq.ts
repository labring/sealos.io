import type { MetadataRoute } from 'next';
import { faqSource } from '@/lib/source';
import { getPageUrl } from '@/lib/utils/metadata';

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
 * AI FAQ sitemap: separate sitemap for all AI quick reference pages.
 * Referenced by main sitemap index at /sitemap.xml
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const items: MetadataRoute.Sitemap = [];
  const faqPagesEn = faqSource.getPages('en');
  const faqPagesZh = faqSource.getPages('zh-cn');
  const enPages = faqPagesEn.length ? faqPagesEn : faqPagesZh;
  
  for (const page of enPages) {
    items.push({
      url: escapeXmlChars(getPageUrl('en', page.url)),
      changeFrequency: 'weekly',
      priority: 0.6,
    });
  }
  
  for (const page of faqPagesZh) {
    items.push({
      url: escapeXmlChars(getPageUrl('zh-cn', page.url)),
      changeFrequency: 'weekly',
      priority: 0.6,
    });
  }
  
  return items;
}
