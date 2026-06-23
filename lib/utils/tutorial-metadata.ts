import { blogAuthors, siteConfig } from '@/config/site';
import { getTutorialKeywords, getTutorialPage } from '@/lib/utils/tutorial-utils';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

const siteName = siteConfig.name;
const ogImageUrl = `${siteConfig.url.base}/api/og`;
const canonicalDomain = 'https://sealos.io';
const rootPath = '/';

function normalizePathname(pathname?: string | null): string {
  if (!pathname) return rootPath;

  let path = pathname;
  if (/^https?:\/\//i.test(path)) {
    path = new URL(path).pathname;
  }

  const pathWithoutQuery = path.split(/[?#]/)[0] || rootPath;
  const withLeadingSlash = pathWithoutQuery.startsWith('/')
    ? pathWithoutQuery
    : `/${pathWithoutQuery}`;

  if (withLeadingSlash === rootPath) return rootPath;
  return `${withLeadingSlash.replace(/\/+$/, '')}/`;
}

function buildUrl(baseUrl: string, pathname?: string | null): string {
  const normalizedPath = normalizePathname(pathname);
  return normalizedPath === rootPath
    ? `${baseUrl}/`
    : `${baseUrl}${normalizedPath}`;
}

function buildCanonicalUrl(pathname?: string | null): string {
  return buildUrl(canonicalDomain, pathname);
}

function buildSiteUrl(pathname?: string | null): string {
  return buildUrl(siteConfig.url.base, pathname);
}

export async function generateTutorialMetadata(props: {
  params: Promise<{ slug: string; lang?: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = getTutorialPage(params.slug, params.lang ?? 'en');

  if (!page) notFound();

  const tutorialPath = `/tutorials/${page.slugs.join('/')}`;
  const url = buildSiteUrl(tutorialPath);
  const docTitle = `${page.data.title} | Sealos Tutorials`;
  const publishedTime = new Date(page.data.date).toISOString();
  const modifiedTime = new Date(page.data.updated ?? page.data.date).toISOString();

  return {
    metadataBase: new URL(siteConfig.url.base),
    title: {
      absolute: docTitle,
    },
    description: page.data.description,
    keywords: getTutorialKeywords(page),
    authors: page.data.authors.map((author) => ({
      name: blogAuthors[author]?.name ?? author,
    })),
    creator: siteConfig.author,
    publisher: siteConfig.author,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: buildCanonicalUrl(tutorialPath),
    },
    openGraph: {
      url,
      title: docTitle,
      description: page.data.description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: docTitle,
        },
      ],
      siteName,
      type: 'article',
      publishedTime,
      modifiedTime,
      authors: page.data.authors.map(
        (author) => blogAuthors[author]?.name ?? author,
      ),
      section: 'Tutorials',
      tags: page.data.tags,
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.twitterHandle,
      creator: siteConfig.twitterHandle,
      title: docTitle,
      description: page.data.description,
      images: [
        {
          url: ogImageUrl,
          alt: docTitle,
        },
      ],
    },
    category: 'Tutorials',
  };
}
