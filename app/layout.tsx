import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import './global.css';
import { siteConfig } from '@/config/site';
import { Metadata } from 'next';
import { Analytics } from '@/components/analytics';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  alternates: {
    canonical: siteConfig.url.base,
  },
  openGraph: {
    type: 'website',
    url: siteConfig.url.base,
    siteName: `${siteConfig.name} | ${siteConfig.tagline}`,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage]
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.twitterHandle,
    site: siteConfig.twitterHandle
  },
  metadataBase: new URL(siteConfig.url.base)
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/favicon/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />

        {/* <link rel="dns-prefetch" href="https://hm.baidu.com" /> */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.clarity.ms" />

        {/* <link rel="preconnect" href="https://hm.baidu.com" /> */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />

        <Analytics />
      </head>
      <body className="flex min-h-screen flex-col">{children}</body>
    </html>
  );
}
