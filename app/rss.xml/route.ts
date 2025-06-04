import { Feed } from 'feed';
import { blog } from '@/lib/source';
import { NextResponse } from 'next/server';
import { i18n } from '@/lib/i18n';

export const revalidate = false;

const baseUrl = i18n.defaultLanguage === 'en' ? 'https://sealos.io' : 'https://sealos.run';

export function GET() {
  const defaultLanguage = i18n.defaultLanguage;
  const isChineseDefault = defaultLanguage === 'zh-cn';

  const feed = new Feed({
    title: isChineseDefault ? 'Sealos 博客' : 'Sealos Blog',
    id: `${baseUrl}/blog`,
    link: `${baseUrl}/blog`,
    language: defaultLanguage,
    description: isChineseDefault
      ? 'Sealos 云操作系统的最新动态和深度见解'
      : 'Latest updates and insights from Sealos - the cloud operating system',
    image: `${baseUrl}/logo.svg`,
    favicon: `${baseUrl}/favicon/favicon.ico`,
    copyright: isChineseDefault
      ? '版权所有 2025, Sealos'
      : 'All rights reserved 2025, Sealos',
    author: {
      name: isChineseDefault ? 'Sealos 团队' : 'Sealos Team',
      email: 'contact@sealos.io',
      link: baseUrl,
    },
  });

  // Get blog pages for the default language and sort by date (newest first)
  const pages = blog.getPages(defaultLanguage)
    .sort((a, b) => {
      const dateA = new Date(a.data.date);
      const dateB = new Date(b.data.date);
      return dateB.getTime() - dateA.getTime();
    });

  // Add items to feed
  for (const page of pages) {
    // Skip if no date is available
    if (!page.data.date) continue;

    feed.addItem({
      id: `${baseUrl}${page.url}`,
      title: page.data.title,
      description: page.data.description || '',
      link: `${baseUrl}${page.url}`,
      date: new Date(page.data.date),
      category: page.data.tags?.map(tag => ({ name: tag })) || [],
      author: [
        {
          name: page.data.authors?.[0] || (isChineseDefault ? 'Sealos 团队' : 'Sealos Team'),
        },
      ],
    });
  }

  return new NextResponse(feed.rss2(), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}
