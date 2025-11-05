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
  // 生成两种语言下的所有 FAQ 页面链接
  const languages = ['en', 'zh-cn'];
  const items: MetadataRoute.Sitemap = [];

  for (const lang of languages) {
    const pages = faqSource.getPages(lang);
    const langDomain =
      lang === 'zh-cn' ? 'https://sealos.run' : 'https://sealos.io';

    for (const page of pages) {
      const pageUrl = new URL(page.url, langDomain).toString();
      items.push({
        url: escapeXmlChars(pageUrl),
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    }
  }

  return items;
}
