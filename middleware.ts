import { createI18nMiddleware } from 'fumadocs-core/i18n';
import { i18n } from '@/lib/i18n';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest, event: NextFetchEvent) {
  const { pathname } = request.nextUrl;

  if (
    request.nextUrl.hostname === 'sealos.io' &&
    pathname.startsWith('/zh-cn')
  ) {
    return NextResponse.redirect(new URL(`https://sealos.run${pathname}`));
  }
  if (request.nextUrl.hostname === 'sealos.run' && pathname.startsWith('/en')) {
    return NextResponse.redirect(new URL(`https://sealos.io${pathname}`));
  }

  // Redirect English customers pages to homepage
  if (pathname === '/en/customers' || pathname.startsWith('/en/customers/')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If default language is English, also redirect /customers to homepage
  if (
    (pathname === '/customers' || pathname.startsWith('/customers/')) &&
    i18n.defaultLanguage === 'en'
  ) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (pathname === '/robots.txt') {
    return NextResponse.rewrite(new URL('/api/robots', request.url));
  }

  const i18nMiddleware = createI18nMiddleware(i18n);

  // @ts-ignore
  const response = i18nMiddleware(request, event);

  // 将路径信息添加到 headers，供服务端 layout 使用
  if (response) {
    response.headers.set('x-pathname', pathname);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|images/|icons/|favicon/|favicon.ico|logo.svg|Deploy-on-Sealos.svg|sitemap.xml|llms.txt|rss.xml).*)/',
  ],
};
