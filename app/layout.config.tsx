import { templateDomain } from '@/config/site';
import { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { getLanguageSlug, languagesType } from '@/lib/i18n';
import { getAllIndustries, getIndustryConfig } from '@/config/industries';

/**
 * Shared layout configurations
 *
 * you can configure layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
  i18n: true,
  disableThemeSwitch: true,
  nav: {
    title: (
      <div className="flex items-center gap-1">
        <img alt="Sealos Logo" src="/logo.svg" />
        <span className="hidden text-base font-bold md:block">Sealos</span>
      </div>
    ),
  },
  themeSwitch: {
    enabled: false,
  },
  githubUrl: 'https://github.com/labring/sealos',
};

// Define the basic structure of navigation links
type HeaderLinkType = {
  textKey: string;
  urlKey: string;
  isExternal?: boolean;
  children?: HeaderLinkType[];
};

// Define the basic navigation link data (without translation text and localized URLs)
export const HeaderLinksData: HeaderLinkType[] = [
  {
    textKey: 'products',
    urlKey: '#',
    isExternal: false,
    children: [
      {
        textKey: 'devbox',
        urlKey: 'devboxUrl',
        isExternal: false,
      },
      {
        textKey: 'databases',
        urlKey: 'databasesUrl',
        isExternal: false,
      },
      {
        textKey: 'appStore',
        urlKey: 'appStoreUrl',
        isExternal: false,
      },
    ],
  },
  {
    textKey: 'docs',
    urlKey: 'docsUrl',
    isExternal: false,
  },
  {
    textKey: 'case',
    urlKey: 'caseUrl',
    isExternal: false,
  },
  {
    textKey: 'blog',
    urlKey: 'blogUrl',
    isExternal: false,
  },
  {
    textKey: 'pricing',
    urlKey: 'pricingUrl',
    isExternal: false,
  },
  {
    textKey: 'solutions',
    urlKey: '#',
    isExternal: false,
    children: getAllIndustries().map((industrySlug) => ({
      textKey: `industry_${industrySlug}`,
      urlKey: `industry_${industrySlug}Url`,
      isExternal: false,
    })),
  },
  {
    textKey: 'contact',
    urlKey: 'contactUrl',
    isExternal: true,
  },
];

// Define translations for each language's navigation links texts and URLs
export const navTranslations: Record<languagesType, Record<string, string>> = {
  en: {
    // Button texts
    products: 'Products',
    solutions: 'Solutions',
    devbox: 'DevBox',
    databases: 'Databases',
    appStore: 'App Store',
    docs: 'Docs',
    case: 'Customers',
    blog: 'Blog',
    pricing: 'Pricing',
    contact: 'Contact',
    getStarted: 'Get Started',

    // URLs
    devboxUrl: '/products/devbox',
    databasesUrl: '/products/databases',
    appStoreUrl: '/products/app-store',
    docsUrl: '/docs',
    caseUrl: '/',
    blogUrl: '/blog',
    pricingUrl: '/pricing',
    contactUrl: 'mailto:contact@sealos.io',
  },
  'zh-cn': {
    // Button texts
    products: '产品',
    solutions: '解决方案',
    devbox: 'DevBox',
    databases: '数据库',
    appStore: '应用商店',
    docs: '文档',
    case: '客户案例',
    blog: '博客',
    pricing: '价格',
    contact: '联系我们',
    getStarted: '免费体验 7 天',

    // URLs
    devboxUrl: '/products/devbox',
    databasesUrl: '/products/databases',
    appStoreUrl: '/products/app-store',
    docsUrl: '/docs',
    caseUrl: '/customers',
    blogUrl: '/blog',
    pricingUrl: 'https://sealos.run/pricing',
    contactUrl:
      'https://fael3z0zfze.feishu.cn/share/base/form/shrcn5oHHTKCf3VREMKOhEy6fmf',
  },
};

// Generate navigation links with translated text and URLs using the language parameter
export const getHeaderLinks = (lang: languagesType) => {
  // Create dynamic translations for industries
  const dynamicTranslations = { ...navTranslations[lang] };

  // Add industry translations dynamically
  getAllIndustries().forEach((industrySlug) => {
    const industryConfig = getIndustryConfig(industrySlug);
    if (industryConfig) {
      dynamicTranslations[`industry_${industrySlug}`] = industryConfig.name;
      dynamicTranslations[`industry_${industrySlug}Url`] =
        `/solutions/industries/${industrySlug}`;
    }
  });

  // Filter out the 'case' (Customers) link for English pages
  return HeaderLinksData.filter(
    (link) => !(link.textKey === 'case' && lang === 'en'),
  ).map((link) => ({
    text: dynamicTranslations[link.textKey],
    url:
      link.urlKey === '#'
        ? '#'
        : (link.isExternal ? '' : getLanguageSlug(lang)) +
          dynamicTranslations[link.urlKey],
    isExternal: link.isExternal,
    children: link.children?.map((child) => ({
      text: dynamicTranslations[child.textKey],
      url:
        (child.isExternal ? '' : getLanguageSlug(lang)) +
        dynamicTranslations[child.urlKey],
      isExternal: child.isExternal,
    })),
  }));
};

// Maintain backwards compatibility with default English navigation links
export const HeaderLinks = HeaderLinksData.map((link) => ({
  text: navTranslations.en[link.textKey],
  url: navTranslations.en[link.urlKey],
  isExternal: link.isExternal,
}));
