const year = new Date().getFullYear();

export type FooterLinkItem = {
  textKey: string;
  urlKey: string;
};

export type FooterCategory = {
  titleKey: string;
  links: FooterLinkItem[];
};

const FooterLinksData: Record<string, FooterCategory> = {
  resources: {
    titleKey: 'resourcesTitle',
    links: [
      { textKey: 'docs', urlKey: 'docsUrl' },
      { textKey: 'sealosSkills', urlKey: 'sealosSkillsUrl' },
      { textKey: 'education', urlKey: 'educationUrl' },
      { textKey: 'blog', urlKey: 'blogUrl' },
      { textKey: 'frequentlyAskedQuestions', urlKey: 'faqUrl' },
    ],
  },
  products: {
    titleKey: 'productsTitle',
    links: [
      { textKey: 'skills', urlKey: 'skillsUrl' },
      { textKey: 'templates', urlKey: 'templatesUrl' },
    ],
  },
  services: {
    titleKey: 'servicesTitle',
    links: [
      { textKey: 'pricing', urlKey: 'pricingUrl' },
      { textKey: 'fastgpt', urlKey: 'fastgptUrl' },
    ],
  },
  support: {
    titleKey: 'supportTitle',
    links: [
      { textKey: 'contactUs', urlKey: 'contactUsUrl' },
      { textKey: 'reportAbuse', urlKey: 'reportAbuseUrl' },
    ],
  },
};

const legalLinks: FooterLinkItem[] = [
  { textKey: 'termsOfService', urlKey: 'termsOfServiceUrl' },
  { textKey: 'privacyPolicy', urlKey: 'privacyPolicyUrl' },
  { textKey: 'cookiePolicy', urlKey: 'cookiePolicyUrl' },
];

export const footerTranslations: Record<string, Record<string, string>> = {
  en: {
    resourcesTitle: 'Resources',
    productsTitle: 'Products',
    servicesTitle: 'Services',
    supportTitle: 'Support',
    legalTitle: 'Legal',
    connectTitle: 'Connect',
    docs: 'Docs',
    sealosSkills: 'Agents',
    education: 'Education',
    blog: 'Blog',
    frequentlyAskedQuestions: 'Frequently Asked Questions',
    faqShort: 'FAQ',
    skills: 'Skills',
    templates: 'Templates',
    pricing: 'Pricing',
    fastgpt: 'FastGPT',
    contactUs: 'Contact Us',
    reportAbuse: 'Report Abuse',
    termsOfService: 'Terms of Service',
    privacyPolicy: 'Privacy Policy',
    cookiePolicy: 'Cookie Policy',
    copyright: `Copyright © ${year} Sealos. All rights reserved.`,
    copyrightShort: `© ${year} Sealos. All rights reserved.`,
    docsUrl: '/docs',
    sealosSkillsUrl: '/sealos-skills',
    educationUrl: '/solutions/industries/education',
    blogUrl: '/blog',
    faqUrl: '/ai-quick-reference',
    skillsUrl: '/sealos-skills',
    templatesUrl: '/products/app-store/',
    pricingUrl: '/pricing',
    fastgptUrl: 'https://fastgpt.in',
    contactUsUrl: '/contact',
    reportAbuseUrl: '/abuse',
    termsOfServiceUrl: '/docs/msa/terms-of-service',
    privacyPolicyUrl: '/docs/msa/privacy-policy',
    cookiePolicyUrl: '/legal/cookie-policy',
  },
  'zh-cn': {
    resourcesTitle: '资源',
    productsTitle: '产品',
    servicesTitle: '服务',
    supportTitle: '支持',
    legalTitle: '法律',
    connectTitle: '关注我们',
    docs: '文档',
    sealosSkills: 'Agents',
    education: '教育',
    blog: '博客',
    frequentlyAskedQuestions: '常见问题',
    faqShort: '常见问题',
    skills: 'Skills',
    templates: 'Templates',
    pricing: '定价',
    fastgpt: 'FastGPT',
    contactUs: '联系我们',
    reportAbuse: '滥用举报',
    termsOfService: '服务条款',
    privacyPolicy: '隐私政策',
    cookiePolicy: 'Cookie 政策',
    copyright: `Copyright © ${year} Sealos. 保留所有权利。`,
    copyrightShort: `© ${year} Sealos. 保留所有权利。`,
    docsUrl: '/docs',
    sealosSkillsUrl: '/sealos-skills',
    educationUrl: '/solutions/industries/education',
    blogUrl: '/blog',
    faqUrl: '/ai-quick-reference',
    skillsUrl: '/sealos-skills',
    templatesUrl: '/products/app-store/',
    pricingUrl: '/pricing',
    fastgptUrl: 'https://fastgpt.in',
    contactUsUrl: '/contact',
    reportAbuseUrl: '/abuse',
    termsOfServiceUrl: '/docs/msa/terms-of-service',
    privacyPolicyUrl: '/docs/msa/privacy-policy',
    cookiePolicyUrl: '/legal/cookie-policy',
  },
};

export const getFooterLinks = (lang: string) => {
  const translations = footerTranslations[lang] || footerTranslations.en;

  return {
    columns: Object.values(FooterLinksData).map((category) => ({
      title: translations[category.titleKey],
      links: category.links.map((link) => ({
        text: translations[link.textKey],
        url: translations[link.urlKey],
      })),
    })),
    legal: legalLinks.map((link) => ({
      text: translations[link.textKey],
      url: translations[link.urlKey],
    })),
    copyright: translations.copyright,
  };
};
