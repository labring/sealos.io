import { siteConfig, blogAuthors } from '@/config/site';
import { i18n } from '@/lib/i18n';

// Base types for structured data
export interface StructuredData {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

// Organization structured data for Sealos/Labring
export function generateOrganizationSchema(lang: string = 'en'): StructuredData {
  const isZhCn = lang === 'zh-cn';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Labring',
    alternateName: 'Sealos',
    description: isZhCn 
      ? 'Sealos 云操作系统，Kubernetes 云内核，多 Region 统一管理，以应用为中心的企业级容器云'
      : 'Sealos simplifies development with one-click DevBox, scalable Kubernetes and easy app deployment',
    url: siteConfig.url.base,
    logo: `${siteConfig.url.base}/logo.svg`,
    image: `${siteConfig.url.base}/images/banner.jpeg`,
    foundingDate: '2018',
    founder: {
      '@type': 'Person',
      name: 'Fanux'
    },
    sameAs: [
      siteConfig.links.github,
      siteConfig.links.twitter,
      siteConfig.links.discord,
      siteConfig.links.youtube,
      siteConfig.links.bilibili
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['English', 'Chinese']
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'CN'
    }
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
      : 'Sealos simplifies development with one-click DevBox, scalable Kubernetes and easy app deployment',
    url: siteConfig.url.base,
    publisher: {
      '@type': 'Organization',
      name: 'Labring',
      logo: `${siteConfig.url.base}/logo.svg`
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url.base}/docs?search={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    },
    inLanguage: isZhCn ? 'zh-CN' : 'en-US'
  };
}

// Software Application schema for Sealos platform
export function generateSoftwareApplicationSchema(lang: string = 'en'): StructuredData {
  const isZhCn = lang === 'zh-cn';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Sealos',
    description: isZhCn 
      ? 'Sealos 云操作系统，Kubernetes 云内核，多 Region 统一管理，以应用为中心的企业级容器云'
      : 'Sealos simplifies development with one-click DevBox, scalable Kubernetes and easy app deployment',
    url: siteConfig.url.base,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: isZhCn ? '免费试用' : 'Free trial available'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Labring'
    },
    screenshot: `${siteConfig.url.base}/images/banner.jpeg`,
    softwareVersion: '5.0',
    releaseNotes: `${siteConfig.url.base}/blog`,
    downloadUrl: siteConfig.links.github,
    installUrl: `${siteConfig.url.base}/docs`,
    featureList: isZhCn ? [
      'DevBox 开发环境',
      '数据库托管',
      '应用商店',
      'Kubernetes 集群管理',
      '自动伸缩'
    ] : [
      'DevBox Development Environment',
      'Database Hosting',
      'App Store',
      'Kubernetes Cluster Management',
      'Auto Scaling'
    ]
  };
}

// Product schema for specific products
export function generateProductSchema(
  productName: string, 
  description: string, 
  url: string,
  lang: string = 'en'
): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productName,
    description: description,
    url: url,
    brand: {
      '@type': 'Brand',
      name: 'Sealos'
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'Labring'
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    }
  };
}

// Breadcrumb list schema
export function generateBreadcrumbSchema(
  breadcrumbs: Array<{ name: string; url: string }>,
  lang: string = 'en'
): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url
    }))
  };
}

// Article schema for blog posts
export function generateArticleSchema(
  title: string,
  description: string,
  url: string,
  publishDate: string,
  modifiedDate: string,
  authorNames: string[],
  imageUrl?: string,
  tags?: string[],
  lang: string = 'en'
): StructuredData {
  const authors = authorNames.map(authorName => {
    const author = blogAuthors[authorName] || blogAuthors.default;
    return {
      '@type': 'Person',
      name: author.name,
      url: author.url,
      image: author.image_url
    };
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    url: url,
    datePublished: publishDate,
    dateModified: modifiedDate,
    author: authors.length === 1 ? authors[0] : authors,
    publisher: {
      '@type': 'Organization',
      name: 'Labring',
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url.base}/logo.svg`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    },
    image: imageUrl ? {
      '@type': 'ImageObject',
      url: imageUrl
    } : undefined,
    keywords: tags?.join(', '),
    inLanguage: lang === 'zh-cn' ? 'zh-CN' : 'en-US'
  };
}

// FAQ Page schema
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>,
  lang: string = 'en'
): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

// Helper function to generate JSON-LD script tag
export function generateStructuredDataScript(data: StructuredData | StructuredData[]): string {
  const jsonData = Array.isArray(data) ? data : [data];
  return JSON.stringify(jsonData, null, 2);
}

// Combined schema for homepage
export function generateHomepageSchema(lang: string = 'en'): StructuredData[] {
  return [
    generateOrganizationSchema(lang),
    generateWebSiteSchema(lang),
    generateSoftwareApplicationSchema(lang)
  ];
}
