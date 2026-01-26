import { siteConfig, blogAuthors } from '@/config/site';
import { i18n } from '@/lib/i18n';

// Base types for structured data
export interface StructuredData {
  '@context': string;
  '@type': string;
  [key: string]: unknown;
}

export interface HowToTool {
  name: string;
  url?: string;
  image?: string;
}

export interface HowToStep {
  name: string;
  text: string;
  image?: string;
  tool?: HowToTool[];
  cost?: string | HowToCost;
}

export interface HowToData {
  name: string;
  description: string;
  image?: string;
  steps: HowToStep[];
}

interface HowToCost {
  '@type': 'MonetaryAmount';
  currency: string;
  value: string | number;
}

type AuthorSchema = {
  '@type': 'Person';
  name: string;
  url: string;
  image?: string;
};

function resolveAuthorSchema(authorName?: string): AuthorSchema {
  const fallbackAuthor = blogAuthors.default ?? Object.values(blogAuthors)[0];
  const author =
    (authorName ? blogAuthors[authorName] : undefined) || fallbackAuthor;
  const imageUrl = author?.image_url;
  let image: string | undefined;

  if (imageUrl) {
    image = imageUrl.startsWith('http')
      ? imageUrl
      : `${siteConfig.url.base}${imageUrl}`;
  }

  return {
    '@type': 'Person',
    name: author?.name ?? 'Labring',
    url: author?.url ?? siteConfig.url.base,
    image,
  };
}

function sanitizeArticleDescription(raw: string): string {
  return raw
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
    .replace(/<[^>]*>/g, ' ')
    .replace(/[#>*_~]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function resolveArticleDescription(
  title: string,
  description?: string,
  content?: string,
  lang: string = 'en',
): string {
  const titleCore = title.split(/\s[|\-]\s/)[0] ?? title;
  const fallback = titleCore
    ? lang === 'zh-cn'
      ? `关于${titleCore}的博客文章`
      : `Blog post about ${titleCore}`
    : '';
  const raw = description?.trim() || content?.trim() || fallback;
  const cleaned = sanitizeArticleDescription(raw);

  if (!cleaned) return lang === 'zh-cn' ? '博客文章' : 'Blog post';
  if (cleaned.length <= 160) return cleaned;

  const slice = cleaned.slice(0, 160);
  const lastSpace = slice.lastIndexOf(' ');
  return (lastSpace > 96 ? slice.slice(0, lastSpace) : slice).trim();
}

// Organization structured data for Sealos/Labring
export function generateOrganizationSchema(
  lang: string = 'en',
): StructuredData {
  const isZhCn = lang === 'zh-cn';

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Labring',
    alternateName: 'Sealos',
    description: isZhCn
      ? 'Sealos 云操作系统，Kubernetes 云内核，多 Region 统一管理，以应用为中心的企业级容器云'
      : 'Sealos, the Intelligent Cloud OS, uses AI to automate your workflow. Deploy apps, databases, and scalable Kubernetes with one click. Faster, simpler development for developers.',
    url: siteConfig.url.base,
    logo: `${siteConfig.url.base}/logo.svg`,
    image: `${siteConfig.url.base}/images/banner.jpeg`,
    foundingDate: '2018',
    founder: {
      '@type': 'Person',
      name: 'Fanux',
    },
    sameAs: [
      siteConfig.links.github,
      siteConfig.links.twitter,
      siteConfig.links.discord,
      siteConfig.links.youtube,
      siteConfig.links.bilibili,
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['English', 'Chinese'],
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'CN',
    },
  };
}

// Website structured data
export function generateWebSiteSchema(lang: string = 'en'): StructuredData {
  const isZhCn = lang === 'zh-cn';

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Sealos',
    description: isZhCn
      ? 'Sealos 云操作系统，Kubernetes 云内核，多 Region 统一管理，以应用为中心的企业级容器云'
      : 'Sealos, the Intelligent Cloud OS, uses AI to automate your workflow. Deploy apps, databases, and scalable Kubernetes with one click. Faster, simpler development for developers.',
    url: siteConfig.url.base,
    publisher: {
      '@type': 'Organization',
      name: 'Labring',
      logo: `${siteConfig.url.base}/logo.svg`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url.base}/docs?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: isZhCn ? 'zh-CN' : 'en-US',
  };
}

// Software Application schema for Sealos platform
export function generateSoftwareApplicationSchema(
  lang: string = 'en',
): StructuredData {
  const isZhCn = lang === 'zh-cn';

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Sealos',
    description: isZhCn
      ? 'Sealos 云操作系统，Kubernetes 云内核，多 Region 统一管理，以应用为中心的企业级容器云'
      : 'Sealos, the Intelligent Cloud OS, uses AI to automate your workflow. Deploy apps, databases, and scalable Kubernetes with one click. Faster, simpler development for developers.',
    url: siteConfig.url.base,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: isZhCn ? '免费试用' : 'Free trial available',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Labring',
    },
    screenshot: `${siteConfig.url.base}/images/banner.jpeg`,
    softwareVersion: '5.0',
    releaseNotes: `${siteConfig.url.base}/blog`,
    downloadUrl: siteConfig.links.github,
    installUrl: `${siteConfig.url.base}/docs`,
    featureList: isZhCn
      ? [
          'DevBox 开发环境',
          '数据库托管',
          '应用商店',
          'Kubernetes 集群管理',
          '自动伸缩',
        ]
      : [
          'DevBox Development Environment',
          'Database Hosting',
          'App Store',
          'Kubernetes Cluster Management',
          'Auto Scaling',
        ],
  };
}

// Product schema for specific products
export function generateProductSchema(
  productName: string,
  description: string,
  url: string,
  lang: string = 'en',
): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productName,
    description: description,
    url: url,
    brand: {
      '@type': 'Brand',
      name: 'Sealos',
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'Labring',
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  };
}

// Breadcrumb list schema
export function generateBreadcrumbSchema(
  breadcrumbs: Array<{ name: string; url: string }>,
  lang: string = 'en',
): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

// Article schema for blog posts
export function generateArticleSchema(
  title: string,
  description: string | undefined,
  url: string,
  publishDate: string,
  modifiedDate: string,
  authorNames: string[],
  imageUrl?: string,
  tags?: string[],
  lang: string = 'en',
  lastModified?: string,
  content?: string,
): StructuredData {
  const authors =
    Array.isArray(authorNames) && authorNames.length > 0
      ? authorNames.map((authorName) => resolveAuthorSchema(authorName))
      : [resolveAuthorSchema()];
  const resolvedModifiedDate =
    modifiedDate === publishDate && lastModified ? lastModified : modifiedDate;
  const resolvedDescription = resolveArticleDescription(
    title,
    description,
    content,
    lang,
  );

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: resolvedDescription,
    url: url,
    datePublished: publishDate,
    dateModified: resolvedModifiedDate,
    author: authors.length === 1 ? authors[0] : authors,
    publisher: {
      '@type': 'Organization',
      name: 'Labring',
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url.base}/logo.svg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    image: imageUrl
      ? {
          '@type': 'ImageObject',
          url: imageUrl.startsWith('http')
            ? imageUrl
            : `${siteConfig.url.base}${imageUrl}`,
        }
      : undefined,
    keywords: tags?.join(', '),
    inLanguage: lang === 'zh-cn' ? 'zh-CN' : 'en-US',
  };
}

// BlogPosting schema for blog posts
export function generateBlogPostingSchema(
  title: string,
  description: string | undefined,
  url: string,
  publishDate: string,
  modifiedDate: string,
  authorNames: string[],
  imageUrl?: string,
  tags?: string[],
  lang: string = 'en',
  lastModified?: string,
  content?: string,
): StructuredData {
  const authors =
    Array.isArray(authorNames) && authorNames.length > 0
      ? authorNames.map((authorName) => resolveAuthorSchema(authorName))
      : [resolveAuthorSchema()];
  const resolvedModifiedDate =
    modifiedDate === publishDate && lastModified ? lastModified : modifiedDate;
  const resolvedDescription = resolveArticleDescription(
    title,
    description,
    content,
    lang,
  );

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: resolvedDescription,
    url: url,
    datePublished: publishDate,
    dateModified: resolvedModifiedDate,
    author: authors.length === 1 ? authors[0] : authors,
    publisher: {
      '@type': 'Organization',
      name: 'Labring',
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url.base}/logo.svg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    image: imageUrl
      ? {
          '@type': 'ImageObject',
          url: imageUrl.startsWith('http')
            ? imageUrl
            : `${siteConfig.url.base}${imageUrl}`,
        }
      : undefined,
    keywords: tags?.join(', '),
    inLanguage: lang === 'zh-cn' ? 'zh-CN' : 'en-US',
  };
}

// FAQ Page schema
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>,
  lang: string = 'en',
): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// Helper function to generate JSON-LD script tag
export function generateStructuredDataScript(
  data: StructuredData | StructuredData[],
): string {
  const jsonData = Array.isArray(data) ? data : [data];
  return JSON.stringify(jsonData, null, 2);
}

// DevBox specific schema
export function generateDevBoxSchema(lang: string = 'en'): StructuredData {
  const isZhCn = lang === 'zh-cn';

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Sealos DevBox',
    description: isZhCn
      ? '标准镜像发布，一键部署，IDE 不限，环境 100% 一致。'
      : 'Standard image-based releases, one-click deploy, IDE-agnostic, 100% environment parity.',
    url: `${siteConfig.url.base}/products/devbox`,
    applicationCategory: 'DeveloperApplication',
    applicationSubCategory: 'Cloud Development Environment',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      priceValidUntil: '2025-12-31',
      availability: 'https://schema.org/InStock',
      description: isZhCn ? '免费试用' : 'Free trial available',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Labring',
      url: siteConfig.url.base,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
      bestRating: '5',
      worstRating: '1',
    },
    screenshot: [
      `${siteConfig.url.base}/images/devbox-screenshot-1.png`,
      `${siteConfig.url.base}/images/devbox-screenshot-2.png`,
    ],
    softwareVersion: '2.0',
    installUrl: `${siteConfig.url.base}/docs/quick-start`,
    featureList: isZhCn
      ? [
          '标准镜像发布',
          '一键部署到生产环境',
          'IDE 不限（VS Code、JetBrains、Vim 等）',
          '环境 100% 一致（团队标准化）',
          '即时开发环境设置',
          'Kubernetes 原生架构',
          '多语言支持（Python, Go, Java, Node.js 等）',
          '预配置开发模板',
        ]
      : [
          'Standard image-based releases',
          'One-click deployment to production',
          'IDE-agnostic (VS Code, JetBrains, Vim, etc.)',
          '100% environment parity (team standardization)',
          'Instant development environment setup',
          'Kubernetes native architecture',
          'Multi-language support (Python, Go, Java, Node.js, etc.)',
          'Pre-configured development templates',
        ],
    softwareRequirements: isZhCn ? '现代网页浏览器' : 'Modern web browser',
    permissions: isZhCn ? '无需特殊权限' : 'No special permissions required',
  };
}

// Combined schema for homepage
export function generateHomepageSchema(lang: string = 'en'): StructuredData[] {
  return [
    generateOrganizationSchema(lang),
    generateWebSiteSchema(lang),
    generateSoftwareApplicationSchema(lang),
  ];
}

/**
 * Generate HowTo structured data (JSON-LD) with steps mapped to schema.org `step`.
 *
 * @example
 * const schema = generateHowToSchema({
 *   name: 'Quick app deployment',
 *   description: 'A concise path from project creation to launch.',
 *   image: 'https://example.com/howto-cover.png',
 *   steps: [
 *     {
 *       name: 'Create project',
 *       text: 'Create a new project in the console.',
 *       tool: [{ name: 'Sealos Console' }],
 *     },
 *   ],
 * });
 */
export function generateHowToSchema(data: HowToData): StructuredData {
  const steps = data.steps.map((step) => ({
    '@type': 'HowToStep',
    name: step.name,
    text: step.text,
    image: step.image
      ? {
          '@type': 'ImageObject',
          url: step.image,
        }
      : undefined,
    tool: step.tool?.map((tool) => ({
      '@type': 'HowToTool',
      name: tool.name,
      url: tool.url,
      image: tool.image
        ? {
            '@type': 'ImageObject',
            url: tool.image,
          }
        : undefined,
    })),
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: data.name,
    description: data.description,
    image: data.image
      ? {
          '@type': 'ImageObject',
          url: data.image,
        }
      : undefined,
    step: steps,
    estimatedCost: data.steps.some((step) => step.cost)
      ? {
          '@type': 'MonetaryAmount',
          currency: 'USD',
          value: data.steps.find((step) => step.cost)?.cost,
        }
      : undefined,
  };
}
