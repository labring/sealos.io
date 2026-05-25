import { siteConfig, appDomain } from '@/config/site';
import type { languagesType } from '@/lib/i18n';
import type { StructuredData } from '@/lib/utils/structured-data';
import type { AppConfig } from '@/config/apps';

export const APP_STORE_PATHNAME = '/products/app-store';
export const APP_STORE_TITLE =
  'App Store | One-Click Self-Hosted App Templates';
export const APP_STORE_DESCRIPTION =
  'Deploy self-hosted open-source apps, databases, and developer tools from the Sealos App Store with one click, automatic HTTPS, and Kubernetes-backed infrastructure.';

export const appStoreKeywords = [
  'one-click app deployment',
  'self-hosted app store',
  'Kubernetes app templates',
  'open-source app marketplace',
  'deploy apps without YAML',
  'Sealos App Store',
];

export const appStoreFaqItems: Record<
  languagesType,
  Array<{ question: string; answer: string }>
> = {
  en: [
    {
      question: 'What is the Sealos App Store?',
      answer:
        'The Sealos App Store is a one-click self-hosted application template marketplace for Kubernetes-backed deployments. It packages open-source apps, databases, and developer tools so teams can launch them without writing Kubernetes YAML.',
    },
    {
      question: 'Do I need to write Kubernetes YAML or Helm charts?',
      answer:
        'No. App templates turn the required Kubernetes resources, configuration, storage, and networking into a guided deployment flow. Advanced teams can still inspect and manage workloads after deployment.',
    },
    {
      question: 'Can I deploy databases and apps with persistent storage?',
      answer:
        'Yes. Many templates include databases, object storage, monitoring tools, and business apps. Sealos provisions persistent volumes and related resources so application data remains durable.',
    },
    {
      question: 'Does Sealos provide HTTPS and public access?',
      answer:
        'Yes. Sealos can provision a public HTTPS endpoint for deployed apps and handle routing, certificates, and cloud infrastructure defaults for production-oriented launches.',
    },
    {
      question: 'How is billing handled for App Store deployments?',
      answer:
        'Templates are typically open source, while cloud usage is billed based on the resources the deployment consumes, such as compute, storage, and networking.',
    },
  ],
  'zh-cn': [
    {
      question: 'Sealos 应用商店是什么？',
      answer:
        'Sealos 应用商店是面向 Kubernetes 部署的一键自托管应用模板市场。它将开源应用、数据库和开发者工具打包成模板，团队无需编写 Kubernetes YAML 即可启动。',
    },
    {
      question: '我需要编写 Kubernetes YAML 或 Helm Chart 吗？',
      answer:
        '不需要。应用模板会把 Kubernetes 资源、配置、存储和网络封装成引导式部署流程；高级用户仍可在部署后继续查看和管理工作负载。',
    },
    {
      question: '可以部署带持久化存储的数据库和应用吗？',
      answer:
        '可以。许多模板包含数据库、对象存储、监控工具和业务应用。Sealos 会为应用配置持久卷等资源，保证数据可持续保存。',
    },
    {
      question: 'Sealos 会提供 HTTPS 和公网访问吗？',
      answer:
        '可以。Sealos 能为部署的应用提供公网 HTTPS 入口，并处理路由、证书和面向生产环境的云基础设施默认配置。',
    },
    {
      question: '应用商店部署如何计费？',
      answer:
        '模板通常是开源应用，云端费用按部署实际消耗的计算、存储和网络等资源计费。',
    },
  ],
};

export function getAppStoreDefinition(lang: languagesType) {
  if (lang === 'zh-cn') {
    return {
      title: '什么是 Sealos 应用商店？',
      body: 'Sealos 应用商店是面向 Kubernetes 云环境的一键自托管应用模板市场。它把开源应用、数据库、存储和开发者工具封装成可直接部署的模板，让团队无需手写 YAML 或维护 Helm 流程，也能快速获得带 HTTPS、持久化存储和可扩展资源的云上应用。',
    };
  }

  return {
    title: 'What is the Sealos App Store?',
    body: 'The Sealos App Store is a one-click self-hosted application template marketplace for Kubernetes-backed deployments. It turns open-source apps, databases, storage, and developer tools into ready-to-launch templates, so teams can get HTTPS, persistent storage, and scalable cloud resources without hand-writing YAML or maintaining Helm workflows.',
  };
}

function buildCanonicalUrl(pathname: string) {
  return `${siteConfig.url.base}${pathname.endsWith('/') ? pathname : `${pathname}/`}`;
}

function withAbsoluteSiteUrl(value?: string) {
  if (!value) return undefined;
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith('/')) return `${siteConfig.url.base}${value}`;
  return `https://${value}`;
}

function trimMetaDescription(description: string) {
  const normalized = description.replace(/\s+/g, ' ').trim();
  if (normalized.length <= 158) return normalized;

  const slice = normalized.slice(0, 158);
  const lastSpace = slice.lastIndexOf(' ');
  return `${(lastSpace > 96 ? slice.slice(0, lastSpace) : slice).trim()}…`;
}

export function getAppDetailPathname(slug: string) {
  return `${APP_STORE_PATHNAME}/${slug.toLowerCase()}`;
}

export function getAppDetailMetadata(
  app: Pick<AppConfig, 'name' | 'description' | 'tags'>,
) {
  return {
    title: `Deploy ${app.name} on Sealos | One-Click Self-Hosted App Template`,
    description: trimMetaDescription(app.description),
    keywords: [
      ...(app.tags || []),
      app.name,
      'one-click app deployment',
      'self-hosted app template',
      'Kubernetes app template',
      'Sealos App Store',
    ],
  };
}

export function generateAppStoreCollectionSchema(
  lang: languagesType,
  apps: Array<Pick<AppConfig, 'name' | 'slug' | 'description' | 'category'>>,
): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Sealos App Store',
    description: APP_STORE_DESCRIPTION,
    url: buildCanonicalUrl(APP_STORE_PATHNAME),
    inLanguage: lang === 'zh-cn' ? 'zh-CN' : 'en-US',
    isPartOf: {
      '@type': 'WebSite',
      name: 'Sealos',
      url: siteConfig.url.base,
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: apps.length,
      itemListElement: apps.slice(0, 24).map((app, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: buildCanonicalUrl(getAppDetailPathname(app.slug)),
        name: app.name,
        description: app.description,
      })),
    },
  };
}

export function generateAppStoreSoftwareSchema(
  lang: languagesType,
): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Sealos App Store',
    description: APP_STORE_DESCRIPTION,
    url: buildCanonicalUrl(APP_STORE_PATHNAME),
    applicationCategory: 'DeveloperApplication',
    applicationSubCategory: 'Application deployment marketplace',
    operatingSystem: 'Web',
    inLanguage: lang === 'zh-cn' ? 'zh-CN' : 'en-US',
    publisher: {
      '@type': 'Organization',
      name: 'Labring',
      url: siteConfig.url.base,
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Open-source templates with usage-based cloud resources.',
    },
    featureList: [
      'One-click self-hosted app templates',
      'Kubernetes-backed deployments',
      'Automatic HTTPS and routing',
      'Persistent storage for stateful apps',
      'Database, AI, monitoring, and developer tool templates',
    ],
  };
}

export function generateAppDetailSoftwareSchema(
  app: AppConfig,
  lang: languagesType,
): StructuredData {
  const canonicalPath = getAppDetailPathname(app.slug);
  const image = withAbsoluteSiteUrl(app.screenshots?.[0] || app.icon);

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: app.name,
    description: trimMetaDescription(app.description),
    url: buildCanonicalUrl(canonicalPath),
    applicationCategory: 'DeveloperApplication',
    applicationSubCategory: app.category,
    operatingSystem: 'Web',
    inLanguage: lang === 'zh-cn' ? 'zh-CN' : 'en-US',
    image,
    screenshot: image,
    keywords: app.tags?.join(', '),
    downloadUrl: app.github || app.website,
    installUrl: `${appDomain}/?openapp=system-template%3F%2Fdeploy%3FtemplateName%3D${encodeURIComponent(app.templateName || app.slug)}`,
    publisher: {
      '@type': 'Organization',
      name: 'Labring',
      url: siteConfig.url.base,
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      description: 'Open-source template with usage-based cloud resources.',
    },
    featureList: app.features?.length ? app.features : app.tags,
    sameAs: [app.website, app.github].filter(Boolean),
  };
}
