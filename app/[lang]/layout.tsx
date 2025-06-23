import { locales } from '@/lib/i18n';
import { RootProvider } from 'fumadocs-ui/provider';
import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { Analytics } from '@/components/analytics';
import { GTMBody } from '@/components/analytics/gtm-body';
import { generatePageMetadata } from '@/lib/utils/metadata';
import StructuredDataComponent from '@/components/structured-data';
import { generateHomepageSchema } from '@/lib/utils/structured-data';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata = generatePageMetadata();

// Generate static params for all supported languages
export async function generateStaticParams() {
  return locales.map((locale) => ({
    lang: locale.locale,
  }));
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { lang: string };
}) {
  const htmlLang = params.lang || 'en';
  const homepageSchema = generateHomepageSchema(htmlLang);

  return (
    <html lang={htmlLang} className={inter.className} suppressHydrationWarning>
      <head>
        {/* Favicon and App Icons */}
        <link
          rel="icon"
          type="image/png"
          href="/favicon/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link rel="manifest" href="/favicon/site.webmanifest" />

        {/* Viewport and Mobile Optimization */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Sealos" />
        <meta name="application-name" content="Sealos" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />

        {/* Security Headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />

        {/* Performance and Resource Hints */}
        {/* <link rel="dns-prefetch" href="https://hm.baidu.com" /> */}
        {/* <link rel="dns-prefetch" href="https://www.clarity.ms" /> */}
        {/* <link rel="preconnect" href="https://hm.baidu.com" /> */}

        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        {/* <link rel="preconnect" href="https://hm.baidu.com" /> */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Language and Locale */}
        <meta httpEquiv="Content-Language" content={htmlLang} />

        {/* Structured Data for SEO */}
        <StructuredDataComponent data={homepageSchema} />

        <Analytics />
      </head>
      <body className="flex min-h-screen flex-col overflow-x-hidden">
        <GTMBody />
        <RootProvider
          i18n={{
            locale: params.lang,
            locales,
            translations: {
              'zh-cn': {
                search: '搜索',
                nextPage: '下一页',
                previousPage: '上一页',
                lastUpdate: '最后更新于',
                editOnGithub: '在 GitHub 上编辑',
                searchNoResult: '没有找到相关内容',
                toc: '本页导航',
                tocNoHeadings: '本页没有导航',
                chooseLanguage: '选择语言',
              },
            }[params.lang],
          }}
          theme={{
            forcedTheme: 'light',
            defaultTheme: 'light',
            enabled: false,
            enableSystem: false,
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
