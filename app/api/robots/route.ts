// app/api/robots/route.ts
import { i18n } from '@/lib/i18n';
import { NextResponse } from 'next/server';

export async function GET() {
  const host = i18n.defaultLanguage === 'en' ? 'https://sealos.io' : 'https://sealos.run';
  
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /zh-cn/
Disallow: /en/

Host: ${host}

Sitemap: ${host}/sitemap.xml`;

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}