import type { MetadataRoute } from 'next';
import { faqSource } from '@/lib/source';

export const revalidate = false;

// Function to escape special characters in URLs
const escapeXmlChars = (url: string): string => {
  return url
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // [TODO] English only, will add `alternatives.languages.<lang>` later.
  const pages = faqSource.getPages('en');
  const domain = 'https://sealos.io';

  const items: MetadataRoute.Sitemap = pages.map((page) => {
    const pageUrl = new URL(page.url, domain).toString();
    return {
      url: escapeXmlChars(pageUrl),
      changeFrequency: 'weekly',
      priority: 0.6,
    };
  });

  return items;
}
