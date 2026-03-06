import { blogAuthors, siteConfig } from '@/config/site';
import { blog, source } from '@/lib/source';
import { i18n, getLanguageSlug } from '@/lib/i18n';
import { getBlogImage, getPageCategory } from '@/lib/utils/blog-utils';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

const siteName = siteConfig.name;
const OG_IMAGE_URL = `${siteConfig.url.base}/api/og`;
const BLOG_RSS_ALTERNATE = [
  {
    title: 'Sealos Blog',
    url: `${siteConfig.url.base}/rss.xml`,
  },
];

/**
 * The canonical domain for all pages.
 * All canonical URLs should point to sealos.io regardless of the current environment.
 * This ensures search engines recognize sealos.io as the authoritative version.
 */
const CANONICAL_DOMAIN = 'https://sealos.io';
const ROOT_PATH = '/';
const DOMAIN_MAP: Record<string, string> = {
  en: 'https://sealos.io',
  'zh-cn': 'https://sealos.run',
};

function normalizePathname(pathname?: string | null): string {
  if (!pathname) return ROOT_PATH;

  let path = pathname;
  if (/^https?:\/\//i.test(path)) {
    path = new URL(path).pathname;
  }

  const pathWithoutQuery = path.split(/[?#]/)[0] || ROOT_PATH;
  const withLeadingSlash = pathWithoutQuery.startsWith('/')
    ? pathWithoutQuery
    : `/${pathWithoutQuery}`;

  if (withLeadingSlash === ROOT_PATH) return ROOT_PATH;
  return `${withLeadingSlash.replace(/\/+$/, '')}/`;
}

function buildUrl(baseUrl: string, pathname?: string | null): string {
  const normalizedPath = normalizePathname(pathname);
  return normalizedPath === ROOT_PATH
    ? `${baseUrl}/`
    : `${baseUrl}${normalizedPath}`;
}

function buildCanonicalUrl(pathname?: string | null): string {
  return buildUrl(CANONICAL_DOMAIN, pathname);
}

function buildSiteUrl(pathname?: string | null): string {
  return buildUrl(siteConfig.url.base, pathname);
}

function toAlternateLanguages(
  links: Array<{ hrefLang: string; href: string }>,
): Record<string, string> | undefined {
  if (links.length === 0) return undefined;

  return Object.fromEntries(links.map(({ hrefLang, href }) => [hrefLang, href]));
}

export async function generateBlogMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = blog.getPage([params.slug]);
  const isRootPage = !params.slug || params.slug.length === 0;

  if (!page && !isRootPage) notFound();

  let blogPath = '/blog';
  let docTitle = 'Sealos Blog';
  let imageUrl = OG_IMAGE_URL;
  let description = 'Sealos Blog';
  let keywords = ['Sealos', 'Blog'];

  if (page) {
    blogPath = `/blog/${page.slugs.join('/')}`;
    const category = getPageCategory(page);
    imageUrl = `${siteConfig.url.base}${getBlogImage(page, category)}`;
    docTitle = `${page.data.title} | Sealos Blog`;
    description = page.data.description;
  }
  const url = buildSiteUrl(blogPath);

  return {
    metadataBase: new URL(siteConfig.url.base),
    title: {
      absolute: docTitle,
    },
    description,
    keywords,
    authors: page
      ? page.data.authors.map((author) => ({ name: blogAuthors[author].name }))
      : [{ name: siteConfig.author }],
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
      canonical: buildCanonicalUrl(blogPath),
      types: {
        'application/rss+xml': BLOG_RSS_ALTERNATE,
      },
    },
    openGraph: {
      url,
      title: docTitle,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: docTitle,
        },
      ],
      siteName: siteName,
      type: page ? 'article' : 'website',
      ...(page && {
        publishedTime: page.data.date,
        modifiedTime: page.data.lastModified || page.data.date,
        authors: page.data.authors.map((author) => blogAuthors[author].name),
        section: 'Technology',
        tags: page.data.tags || keywords,
      }),
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.twitterHandle,
      creator: siteConfig.twitterHandle,
      title: docTitle,
      description,
      images: [
        {
          url: imageUrl,
          alt: docTitle,
        },
      ],
    },
    category: page ? 'Technology' : undefined,
  };
}

export function generateDocsMetadata({
  params,
}: {
  params: { lang: string; slug?: string[] };
}) {
  const page = source.getPage(params.slug, params.lang);
  if (!page) notFound();

  const fullPathTitle = page.slugs
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' > ');

  const docsPath =
    page.slugs.length > 0 ? `/docs/${page.slugs.join('/')}` : '/docs';
  const url = buildSiteUrl(docsPath);
  const imageUrl = OG_IMAGE_URL;

  const isRootPage = !params.slug || params.slug.length === 0;
  const docTitle = isRootPage
    ? 'Sealos Docs'
    : `${fullPathTitle} | Sealos Docs`;

  return {
    metadataBase: new URL(siteConfig.url.base),
    title: {
      absolute: docTitle,
    },
    description: page.data.description,
    keywords: [
      'sealos',
      'documentation',
      'kubernetes',
      'cloud platform',
      'devops',
      'container',
    ],
    authors: [{ name: siteConfig.author }],
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
      canonical: buildCanonicalUrl(docsPath),
      types: {
        'application/rss+xml': BLOG_RSS_ALTERNATE,
      },
    },
    openGraph: {
      url,
      title: docTitle,
      description: page.data.description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: docTitle,
        },
      ],
      siteName: siteName,
      type: 'website',
      locale: params.lang === 'zh-cn' ? 'zh_CN' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.twitterHandle,
      creator: siteConfig.twitterHandle,
      title: docTitle,
      description: page.data.description,
      images: [
        {
          url: imageUrl,
          alt: docTitle,
        },
      ],
    },
    category: 'Documentation',
  } satisfies Metadata;
}

export function generatePageMetadata(
  options: {
    title?: string;
    description?: string;
    keywords?: string[];
    pathname?: string | null;
    lang?: string;
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
    section?: string;
    tags?: string[];
    ogType?: string;
  } = {},
): Metadata {
  const title = options.title
    ? `${options.title} | ${siteConfig.name}`
    : `${siteConfig.name} | ${siteConfig.tagline}`;
  const description = options.description ?? siteConfig.description;
  const keywords = options.keywords ?? siteConfig.keywords;
  const lang = options.lang || 'en';

  const normalizedPathname = normalizePathname(options.pathname);

  const alternateLanguages = options.pathname
    ? toAlternateLanguages(generateHreflangLinks(normalizedPathname))
    : undefined;

  return {
    title,
    description,
    keywords,
    authors: options.author
      ? [{ name: options.author }]
      : [{ name: siteConfig.author }],
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
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
    alternates: {
      canonical: buildCanonicalUrl(normalizedPathname),
      languages: alternateLanguages,
      types: {
        'application/rss+xml': BLOG_RSS_ALTERNATE,
      },
    },
    openGraph: {
      type: 'website',
      url: buildSiteUrl(normalizedPathname),
      siteName: siteName,
      title,
      description,
      images: [
        {
          url: OG_IMAGE_URL,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: lang === 'zh-cn' ? 'zh_CN' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [
        {
          url: OG_IMAGE_URL,
          alt: title,
        },
      ],
      creator: siteConfig.twitterHandle,
      site: siteConfig.twitterHandle,
    },
    metadataBase: new URL(siteConfig.url.base),
    category: options.section,
  };
}

/**
 * Generate metadata for product pages with enhanced SEO
 */
export function generateProductMetadata(options: {
  productName: string;
  description: string;
  pathname: string;
  lang?: string;
  features?: string[];
  category?: string;
}): Metadata {
  const lang = options.lang || 'en';
  const isZhCn = lang === 'zh-cn';

  const title = `${options.productName} | ${siteConfig.name}`;
  const keywords = [
    'sealos',
    options.productName.toLowerCase(),
    'cloud platform',
    'kubernetes',
    'container',
    'devops',
    'cloud native',
    ...(options.features || []),
  ];

  const normalizedPathname = normalizePathname(options.pathname);

  // Generate hreflang links
  const alternateLanguages = toAlternateLanguages(
    generateHreflangLinks(normalizedPathname),
  );

  return {
    title,
    description: options.description,
    keywords,
    authors: [{ name: siteConfig.author }],
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
      canonical: buildCanonicalUrl(normalizedPathname),
      languages: alternateLanguages,
      types: {
        'application/rss+xml': BLOG_RSS_ALTERNATE,
      },
    },
    openGraph: {
      type: 'website',
      url: buildSiteUrl(normalizedPathname),
      siteName: siteName,
      title,
      description: options.description,
      images: [
        {
          url: OG_IMAGE_URL,
          width: 1200,
          height: 630,
          alt: `${options.productName} - ${options.description}`,
        },
      ],
      locale: isZhCn ? 'zh_CN' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: options.description,
      images: [
        {
          url: OG_IMAGE_URL,
          alt: `${options.productName} - ${options.description}`,
        },
      ],
      creator: siteConfig.twitterHandle,
      site: siteConfig.twitterHandle,
    },
    metadataBase: new URL(siteConfig.url.base),
    category: options.category || 'Technology',
  };
}

/**
 * Get base URL based on language
 * @param lang - Language code ('en' or 'zh-cn')
 * @returns Base URL for the given language
 */
export function getBaseUrl(lang: string): string {
  return DOMAIN_MAP[lang] || DOMAIN_MAP.en;
}

/**
 * Get full page URL for social sharing and OpenGraph
 * For default locale (en), the language prefix is omitted
 * @param lang - Language code ('en' or 'zh-cn')
 * @param pagePath - Page path relative to root (e.g., '/blog/some-slug' or '/ai-quick-reference/some-slug')
 * @returns Full URL for the page
 */
export function getPageUrl(lang: string, pagePath: string): string {
  const baseUrl = getBaseUrl(lang);
  const langPrefix = getLanguageSlug(lang);
  const normalizedPath = normalizePathname(pagePath);

  if (normalizedPath === ROOT_PATH) {
    return `${baseUrl}/`;
  }

  return `${baseUrl}${langPrefix}${normalizedPath}`;
}

/**
 * Generate hreflang links for international SEO
 * @param currentPath - The current page path (without language prefix)
 * @returns Array of hreflang link objects
 */
export function generateHreflangLinks(
  currentPath: string = '',
): Array<{ hrefLang: string; href: string }> {
  const links: Array<{ hrefLang: string; href: string }> = [];
  const normalizedCurrentPath = normalizePathname(currentPath);

  // Clean the current path - remove leading slash and language prefix
  const cleanPath = normalizedCurrentPath
    .replace(/^\/?(en|zh-cn)\/?/, '')
    .replace(/^\/+|\/+$/g, '');

  // Generate hreflang links for each supported language
  i18n.languages.forEach((lang) => {
    const domain = getBaseUrl(lang);
    const href = cleanPath ? `${domain}/${cleanPath}/` : `${domain}/`;

    // Add the hreflang link
    links.push({
      hrefLang: lang === 'zh-cn' ? 'zh-CN' : lang,
      href,
    });
  });

  // Add x-default (fallback to English domain)
  const defaultDomain = getBaseUrl('en');
  const defaultHref = cleanPath
    ? `${defaultDomain}/${cleanPath}/`
    : `${defaultDomain}/`;

  links.push({
    hrefLang: 'x-default',
    href: defaultHref,
  });

  return links;
}
