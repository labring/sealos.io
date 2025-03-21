import { createI18nMiddleware } from 'fumadocs-core/i18n';
import { i18n } from '@/lib/i18n';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest, event: NextFetchEvent) {
  const { pathname } = request.nextUrl;

  // if (request.nextUrl.hostname === 'sealos.io' && pathname.startsWith('/zh-cn')) {
  //   return NextResponse.redirect(new URL(`https://sealos.run${pathname}`));
  // }
  if (request.nextUrl.hostname === 'sealos.run' && pathname.startsWith('/en')) {
    return NextResponse.redirect(new URL(`https://sealos.io${pathname}`));
  }

  if (pathname === '/robots.txt') {
    return NextResponse.redirect(new URL('/api/robots', request.url));
  }

  const i18nMiddleware = createI18nMiddleware(i18n);

  // @ts-ignore
  return i18nMiddleware(request, event);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|images/|icons/|favicon/|favicon.ico|logo.svg|robots.txt|sitemap.xml).*)/',
  ],
};
