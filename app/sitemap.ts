import type { MetadataRoute } from 'next';
import { source, blog } from '@/lib/source';
import { appsConfig } from '@/config/apps';
import { getAllPlatformSlugs } from '@/app/[lang]/(home)/comparison/config/platforms';

export const revalidate = false;

const normalizePathname = (pathname: string): string =>
  pathname === '/' ? '/' : `${pathname.replace(/\/+$/, '')}/`;

const toSitemapItem = (
  getUrl: (path: string) => string,
  path: string,
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>,
  priority: number,
): MetadataRoute.Sitemap[number] => ({
  url: getUrl(path),
  changeFrequency,
  priority,
});

/**
 * Main sitemap: contains all main site URLs directly.
 * AI FAQ pages are in a separate sitemap at /ai-quick-reference/sitemap.xml
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locale = process.env.NEXT_PUBLIC_DEFAULT_LOCALE;
  const isZhCn = locale?.includes('zh-cn');
  const defaultDomain = isZhCn ? 'https://sealos.run' : 'https://sealos.io';
  const getUrl = (path: string) => {
    const url = new URL(path, defaultDomain);
    url.pathname = normalizePathname(url.pathname);
    return url.toString();
  };

  const docPages: MetadataRoute.Sitemap = source
    .getPages()
    .map((page) => toSitemapItem(getUrl, page.url, 'weekly', 0.5));

  const blogPages: MetadataRoute.Sitemap = blog
    .getPages()
    .map((post) => toSitemapItem(getUrl, post.url, 'weekly', 0.6));

  const staticProductPages: MetadataRoute.Sitemap = [
    '/products/devbox',
    '/products/databases',
    '/products/app-store',
  ].map((path) => toSitemapItem(getUrl, path, 'monthly', 0.8));

  const appStorePages: MetadataRoute.Sitemap = appsConfig.map((app) =>
    toSitemapItem(getUrl, `/products/app-store/${app.slug}`, 'weekly', 0.7),
  );

  const allPlatformSlugs = getAllPlatformSlugs();
  const comparisonPages: MetadataRoute.Sitemap = [];
  for (let i = 0; i < allPlatformSlugs.length; i++) {
    for (let j = i + 1; j < allPlatformSlugs.length; j++) {
      comparisonPages.push(
        toSitemapItem(
          getUrl,
          `/comparison/${allPlatformSlugs[i]}-vs-${allPlatformSlugs[j]}`,
          'weekly',
          0.8,
        ),
      );
    }
  }

  const chineseSpecificPages: MetadataRoute.Sitemap =
    isZhCn
      ? ['/case', '/price', '/aiproxy'].map((path) =>
          toSitemapItem(getUrl, path, 'monthly', 0.8),
        )
      : [];

  return [
    toSitemapItem(getUrl, '/', 'monthly', 1),
    ...staticProductPages,
    ...appStorePages,
    ...chineseSpecificPages,
    toSitemapItem(getUrl, '/docs', 'monthly', 0.8),
    toSitemapItem(getUrl, '/blog', 'monthly', 0.8),
    toSitemapItem(getUrl, '/ai-quick-reference', 'monthly', 0.8),
    toSitemapItem(getUrl, '/comparison', 'weekly', 0.8),
    ...comparisonPages,
    ...docPages,
    ...blogPages,
  ];
}
