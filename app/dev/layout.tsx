import { locales } from '@/lib/i18n';
import type { ReactNode } from 'react';
// import { Inter } from 'next/font/google';
import { generatePageMetadata } from '@/lib/utils/metadata';

// const inter = Inter({
//   subsets: ['latin'],
//   display: 'swap',
//   preload: true,
//   fallback: [
//     'system-ui',
//     '-apple-system',
//     'BlinkMacSystemFont',
//     'Segoe UI',
//     'Roboto',
//     'sans-serif',
//   ],
// });

export const metadata = generatePageMetadata();

// Generate static params for all supported languages
export async function generateStaticParams() {
  return locales.map((locale) => ({
    lang: locale.locale,
  }));
}

export default function LocaleLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`dark`}
      //   className={`dark ${inter.className}`}
      suppressHydrationWarning
    >
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

        <meta name="referrer" content="strict-origin-when-cross-origin" />
      </head>
      <body className="flex min-h-screen flex-col overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
