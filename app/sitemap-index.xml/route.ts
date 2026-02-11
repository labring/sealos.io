import { NextResponse } from 'next/server';
import { i18n } from '@/lib/i18n';

export const revalidate = false;

/**
 * Sitemap index: references main sitemap and ai-faq sitemap.
 * Main sitemap is at /sitemap.xml (contains all main site URLs)
 * AI FAQ sitemap is at /sitemap-ai-faq.xml (contains all AI quick reference pages)
 */
export function GET() {
  const baseUrl =
    i18n.defaultLanguage === 'zh-cn' ? 'https://sealos.run' : 'https://sealos.io';

  const index = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-ai-faq.xml</loc>
  </sitemap>
</sitemapindex>`;

  return new NextResponse(index, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
