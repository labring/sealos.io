import type { MetadataRoute } from 'next';
import { source, blog } from '@/lib/source';
import { appsConfig } from '@/config/apps';
import { getAllPlatformSlugs } from '@/app/[lang]/(home)/comparison/config/platforms';

export const revalidate = false;

const escapeXmlChars = (url: string): string =>
  url
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

/**
 * Main sitemap: contains all main site URLs directly.
 * AI FAQ pages are in a separate sitemap at /sitemap-ai-faq.xml
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locale = process.env.NEXT_PUBLIC_DEFAULT_LOCALE;
  const defaultDomain = locale?.includes('zh-cn') ? 'https://sealos.run' : 'https://sealos.io';
  const getUrl = (path: string) => new URL(path, defaultDomain).toString();

  const docPages = await Promise.all(
    source.getPages().map(async (page) => ({
      url: escapeXmlChars(getUrl(page.url)),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    })),
  );

  const blogPages = await Promise.all(
    blog.getPages().map(async (post) => ({
      url: escapeXmlChars(getUrl(post.url)),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
  );

  const staticProductPages: MetadataRoute.Sitemap = [
    { url: escapeXmlChars(getUrl('/products/devbox')), changeFrequency: 'monthly', priority: 0.8 },
    { url: escapeXmlChars(getUrl('/products/databases')), changeFrequency: 'monthly', priority: 0.8 },
    { url: escapeXmlChars(getUrl('/products/app-store')), changeFrequency: 'monthly', priority: 0.8 },
  ];

  const appStorePages: MetadataRoute.Sitemap = appsConfig.map((app) => ({
    url: escapeXmlChars(getUrl(`/products/app-store/${app.slug}`)),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const allPlatformSlugs = getAllPlatformSlugs();
  const comparisonPages: MetadataRoute.Sitemap = [];
  for (let i = 0; i < allPlatformSlugs.length; i++) {
    for (let j = i + 1; j < allPlatformSlugs.length; j++) {
      comparisonPages.push({
        url: escapeXmlChars(getUrl(`/comparison/${allPlatformSlugs[i]}-vs-${allPlatformSlugs[j]}`)),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  }

  const chineseSpecificPages: MetadataRoute.Sitemap =
    locale?.includes('zh-cn') ?
      [
        { url: 'https://sealos.run/case/', changeFrequency: 'monthly', priority: 0.8 },
        { url: 'https://sealos.run/price', changeFrequency: 'monthly', priority: 0.8 },
        { url: 'https://sealos.run/aiproxy', changeFrequency: 'monthly', priority: 0.8 },
      ]
    : [];

  return [
    { url: getUrl('/'), changeFrequency: 'monthly', priority: 1 },
    ...staticProductPages,
    ...appStorePages,
    ...chineseSpecificPages,
    { url: getUrl('/docs'), changeFrequency: 'monthly', priority: 0.8 },
    { url: getUrl('/blog'), changeFrequency: 'monthly', priority: 0.8 },
    { url: getUrl('/ai-quick-reference'), changeFrequency: 'monthly', priority: 0.8 },
    { url: getUrl('/comparison'), changeFrequency: 'weekly', priority: 0.8 },
    ...comparisonPages,
    ...docPages,
    ...blogPages,
  ];
}
