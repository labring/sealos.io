import { locales } from '@/lib/i18n';
import { RootProvider } from 'fumadocs-ui/provider';
import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { Analytics } from '@/components/analytics';
import { generatePageMetadata } from '@/lib/utils/metadata';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata = generatePageMetadata();

export default function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { lang: string };
}) {
  const htmlLang = params.lang || 'en';
  return (
    <html lang={htmlLang} className={inter.className} suppressHydrationWarning>
      <head>
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

        {/*
            Alternate URLs based on language
            <link rel="alternate" hrefLang="en" href="https://sealos.io" />
            <link rel="alternate" hrefLang="zh-CN" href="https://sealos.run" />
            <link rel="alternate" hrefLang="x-default" href="https://sealos.io" /> 
            */}

        {/* <link rel="dns-prefetch" href="https://hm.baidu.com" /> */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.clarity.ms" />

        {/* <link rel="preconnect" href="https://hm.baidu.com" /> */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />

        <Analytics />
      </head>
      <body className="flex min-h-screen flex-col">
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
