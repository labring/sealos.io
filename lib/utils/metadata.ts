import { blogAuthors, domain, siteConfig } from '@/config/site';
import { blog } from '@/lib/source';
import { source } from '@/lib/source';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { i18n } from '@/lib/i18n';

const ogImageApi = `${siteConfig.url.base}/api/og`;

const siteName = siteConfig.name;

export async function generateBlogMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const blogImageApi = `${ogImageApi}/blog/`;
  const params = await props.params;
  const page = blog.getPage([params.slug]);
  const isRootPage = !params.slug || params.slug.length === 0;

  if (!page && !isRootPage) notFound();

  let url = `${siteConfig.url.base}/blog`;
  let docTitle = 'Sealos Blog';
  let imageUrl = blogImageApi + docTitle;
  let description = 'Sealos Blog';
  let keywords = ['Sealos', 'Blog'];

  if (page) {
    url = `${siteConfig.url.base}/blog/${page.slugs.join('/')}`;
    imageUrl = blogImageApi + (page.data.imageTitle || page.data.title);
    docTitle = `${page.data.title} | Sealos Blog`;
    description = page.data.description;
  }

  return {
    metadataBase: new URL(siteConfig.url.base),
    title: {
      absolute: docTitle,
    },
    description: description,
    keywords: keywords,
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
      canonical: `${domain}/blog/${params.slug || ''}`,
      types: {
        'application/rss+xml': [
          {
            title: 'Sealos Blog',
            url: `${siteConfig.url.base}/rss.xml`,
          },
        ],
      },
    },
    openGraph: {
      url,
      title: docTitle,
      description: description,
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
      description: description,
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
  const docsImageApi = `${ogImageApi}/docs/`;

  const page = source.getPage(params.slug, params.lang);
  if (!page) notFound();

  const fullPathTitle = page.slugs
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' > ');

  const url = `${siteConfig.url.base}/docs/${page.slugs.join('/')}`;
  const imageUrl =
    docsImageApi +
    (fullPathTitle ? fullPathTitle.toUpperCase() : 'Sealos Docs');

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
    keywords: ['sealos', 'documentation', 'kubernetes', 'cloud platform', 'devops', 'container'],
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
      canonical: url,
      types: {
        'application/rss+xml': [
          {
            title: 'Sealos Blog',
            url: `${siteConfig.url.base}/rss.xml`,
          },
        ],
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
  } = {},
): Metadata {
  const title = options.title
    ? `${options.title} | ${siteConfig.name}`
    : `${siteConfig.name} | ${siteConfig.tagline}`;
  const description = options.description
    ? options.description
    : siteConfig.description;
  const keywords = options.keywords ? options.keywords : siteConfig.keywords;
  const lang = options.lang || 'en';

  // Determine the correct image API endpoint based on the pathname
  let imageApi = `${ogImageApi}/website/`;
  let imagePath = 'default';

  if (options.pathname) {
    const path = options.pathname.replace(/^\/*/, '');

    // Extract the language and the rest of the path
    const pathParts = path.split('/');
    const restPath = pathParts.slice(1).join('/');

    if (restPath.startsWith('customers/')) {
      // For customer case pages
      imageApi = `${ogImageApi}/customers/`;
      imagePath = restPath.replace('customers/', '');
    } else if (restPath === 'customers') {
      // For main customers page
      imageApi = `${ogImageApi}/customers/`;
      imagePath = 'default';
    } else {
      // For other pages
      imagePath = restPath || path; // Use restPath if available, otherwise use the full path
    }
  }

  const imageUrl = imageApi + imagePath;

  // Generate hreflang links if pathname is provided
  const hreflangLinks = options.pathname ? generateHreflangLinks(options.pathname) : [];
  const alternateLanguages: Record<string, string> = {};

  hreflangLinks.forEach(link => {
    alternateLanguages[link.hrefLang] = link.href;
  });

  return {
    title: title,
    description: description,
    keywords: keywords,
    authors: options.author ? [{ name: options.author }] : [{ name: siteConfig.author }],
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
      canonical: options.pathname ? `${siteConfig.url.base}${options.pathname}` : siteConfig.url.base,
      languages: Object.keys(alternateLanguages).length > 0 ? alternateLanguages : undefined,
      types: {
        'application/rss+xml': [
          {
            title: 'Sealos Blog',
            url: `${siteConfig.url.base}/rss.xml`,
          },
        ],
      },
    },
    openGraph: {
      type: 'website',
      url: options.pathname ? `${siteConfig.url.base}${options.pathname}` : siteConfig.url.base,
      siteName: siteName,
      title: title,
      description: description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: lang === 'zh-cn' ? 'zh_CN' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [
        {
          url: imageUrl,
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
export function generateProductMetadata(
  options: {
    productName: string;
    description: string;
    pathname: string;
    lang?: string;
    features?: string[];
    category?: string;
  }
): Metadata {
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
    ...(options.features || [])
  ];

  const imageApi = `${ogImageApi}/products/`;
  const imageUrl = imageApi + options.productName.toLowerCase().replace(/\s+/g, '-');

  // Generate hreflang links
  const hreflangLinks = generateHreflangLinks(options.pathname);
  const alternateLanguages: Record<string, string> = {};

  hreflangLinks.forEach(link => {
    alternateLanguages[link.hrefLang] = link.href;
  });

  return {
    title: title,
    description: options.description,
    keywords: keywords,
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
      canonical: `${siteConfig.url.base}${options.pathname}`,
      languages: Object.keys(alternateLanguages).length > 0 ? alternateLanguages : undefined,
      types: {
        'application/rss+xml': [
          {
            title: 'Sealos Blog',
            url: `${siteConfig.url.base}/rss.xml`,
          },
        ],
      },
    },
    openGraph: {
      type: 'website',
      url: `${siteConfig.url.base}${options.pathname}`,
      siteName: siteName,
      title: title,
      description: options.description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${options.productName} - ${options.description}`,
        },
      ],
      locale: isZhCn ? 'zh_CN' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: options.description,
      images: [
        {
          url: imageUrl,
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
 * Generate hreflang links for international SEO
 * @param currentPath - The current page path (without language prefix)
 * @returns Array of hreflang link objects
 */
export function generateHreflangLinks(
  currentPath: string = ''
): Array<{ hrefLang: string; href: string }> {
  const links: Array<{ hrefLang: string; href: string }> = [];

  // Clean the current path - remove leading slash and language prefix
  const cleanPath = currentPath.replace(/^\/?(en|zh-cn)\/?/, '').replace(/^\/+/, '');

  // Domain mapping based on language
  const domainMap = {
    'en': 'https://sealos.io',
    'zh-cn': 'https://sealos.run'
  };

  // Generate hreflang links for each supported language
  i18n.languages.forEach((lang) => {
    const domain = domainMap[lang as keyof typeof domainMap];
    let href = domain;

    // Add path if it exists
    if (cleanPath) {
      href = `${domain}/${cleanPath}`;
    }

    // Add the hreflang link
    links.push({
      hrefLang: lang === 'zh-cn' ? 'zh-CN' : lang,
      href: href
    });
  });

  // Add x-default (fallback to English domain)
  const defaultDomain = domainMap['en'];
  let defaultHref = defaultDomain;
  if (cleanPath) {
    defaultHref = `${defaultDomain}/${cleanPath}`;
  }

  links.push({
    hrefLang: 'x-default',
    href: defaultHref
  });

  return links;
}
