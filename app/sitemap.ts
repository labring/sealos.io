import { domain } from '@/config/site';
import type { MetadataRoute } from 'next';
import { source } from '@/lib/source';

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
  const url = (path: string): string => new URL(path, domain).toString();

  return [
    {
      url: url('/'),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: url('/docs'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
        url: url('/blog'),
        changeFrequency: 'monthly',
        priority: 0.8,
      },
    ...(await Promise.all(
      source.getPages().map(async (page) => {
        // Escape special characters in URL
        const escapedUrl = escapeXmlChars(url(page.url));
        return {
          url: escapedUrl,
          changeFrequency: 'weekly',
          priority: 0.5,
        } as MetadataRoute.Sitemap[number];
      }),
    )),
  ];
}