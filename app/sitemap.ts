import type { MetadataRoute } from 'next';
import { source, blog } from '@/lib/source';
import { appsConfig } from '@/config/apps';

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
  const locale = process.env.NEXT_PUBLIC_DEFAULT_LOCALE;
  // Default domain from env or config (fallback)
  const defaultDomain = locale?.includes('zh-cn')
    ? 'https://sealos.run'
    : 'https://sealos.io';

  // Generate URL with appropriate domain based on locale
  const getUrl = (path: string, locale?: string): string => {
    return new URL(path, defaultDomain).toString();
  };

  // Get all documentation pages
  const docPages = await Promise.all(
    source.getPages().map(async (page) => {
      // Escape special characters in URL
      const escapedUrl = escapeXmlChars(getUrl(page.url, locale));
      return {
        url: escapedUrl,
        changeFrequency: 'weekly',
        priority: 0.5,
      } as MetadataRoute.Sitemap[number];
    }),
  );

  // Get all blog posts
  const blogPages = await Promise.all(
    blog.getPages().map(async (post) => {
      const escapedUrl = escapeXmlChars(getUrl(post.url, locale));
      return {
        url: escapedUrl,
        changeFrequency: 'weekly',
        priority: 0.6,
      } as MetadataRoute.Sitemap[number];
    }),
  );

  // Generate static product pages
  const staticProductPages: MetadataRoute.Sitemap = [
    {
      url: escapeXmlChars(getUrl('/products/devbox')),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: escapeXmlChars(getUrl('/products/databases')),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: escapeXmlChars(getUrl('/products/app-store')),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // Generate dynamic app store pages for each app
  const appStorePages: MetadataRoute.Sitemap = appsConfig.map((app) => ({
    url: escapeXmlChars(getUrl(`/products/app-store/${app.slug}`)),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Additional Chinese-specific pages
  const chineseSpecificPages: MetadataRoute.Sitemap = locale?.includes('zh-cn')
    ? [
        {
          url: 'https://sealos.run/case/',
          changeFrequency: 'monthly',
          priority: 0.8,
        },
        {
          url: 'https://sealos.run/price',
          changeFrequency: 'monthly',
          priority: 0.8,
        },
        {
          url: 'https://sealos.run/aiproxy',
          changeFrequency: 'monthly',
          priority: 0.8,
        },
      ]
    : [];

  return [
    {
      // Use default domain for main pages
      url: getUrl('/'),
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...staticProductPages,
    ...appStorePages,
    ...chineseSpecificPages,
    {
      url: getUrl('/docs'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: getUrl('/blog'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...docPages,
    ...blogPages,
  ];
}
