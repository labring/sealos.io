import React from 'react';
import Link from 'fumadocs-core/link';
import { siteConfig } from '@/config/site';

const year = new Date().getFullYear();

type FooterLinkItem = {
  textKey: string;
  urlKey: string;
};

type FooterCategory = {
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
    links: [{ textKey: 'templates', urlKey: 'templatesUrl' }],
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
    docs: 'Docs',
    sealosSkills: 'Agents',
    education: 'Education',
    blog: 'Blog',
    frequentlyAskedQuestions: 'FAQs',
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
    docsUrl: '/docs',
    sealosSkillsUrl: '/sealos-skills',
    educationUrl: '/solutions/industries/education',
    blogUrl: '/blog',
    faqUrl: '/ai-quick-reference',
    skillsUrl: '/sealos-skills',
    templatesUrl: '/products/app-store',
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
    docs: '文档',
    sealosSkills: 'Agents',
    education: '教育',
    blog: '博客',
    frequentlyAskedQuestions: '常见问题',
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
    docsUrl: '/docs',
    sealosSkillsUrl: '/sealos-skills',
    educationUrl: '/solutions/industries/education',
    blogUrl: '/blog',
    faqUrl: '/ai-quick-reference',
    skillsUrl: '/sealos-skills',
    templatesUrl: '/products/app-store',
    pricingUrl: '/pricing',
    fastgptUrl: 'https://fastgpt.in',
    contactUsUrl: '/contact',
    reportAbuseUrl: '/abuse',
    termsOfServiceUrl: '/docs/msa/terms-of-service',
    privacyPolicyUrl: '/docs/msa/privacy-policy',
    cookiePolicyUrl: '/legal/cookie-policy',
  },
};

const getFooterLinks = (lang: string) => {
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

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-[13px] leading-5 text-zinc-300 transition-colors hover:text-white"
    >
      {children}
    </Link>
  );
}

function SocialLink({
  href,
  title,
  children,
}: {
  href: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={title}
      aria-label={title}
      className="font-mono text-xs text-zinc-400 transition-colors hover:text-white"
    >
      {children}
    </a>
  );
}

export function FooterV2({ lang = 'en' }: { lang?: string }) {
  const footerLinks = getFooterLinks(lang);
  const homeHref = lang === 'en' ? '/' : `/${lang}`;

  return (
    <footer className="border-t border-white/10 text-white">
      <div className="container flex flex-col gap-5 py-5 lg:flex-row lg:items-center lg:gap-8">
        <Link
          href={homeHref}
          className="inline-flex items-center gap-2 text-lg font-semibold text-white"
        >
          <img src="/logo.svg" alt="" className="size-7" />
          Sealos
        </Link>

        <nav
          aria-label="Footer"
          className="flex flex-1 flex-wrap items-center gap-x-5 gap-y-2"
        >
          {footerLinks.columns.flatMap((category) =>
            category.links.map((link) => (
              <FooterLink
                key={`${category.title}-${link.text}`}
                href={link.url}
              >
                {link.text}
              </FooterLink>
            )),
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-4">
          <SocialLink href={siteConfig.links.github} title="GitHub">
            GH
          </SocialLink>
          <SocialLink href={siteConfig.links.discord} title="Discord">
            DC
          </SocialLink>
          <SocialLink href={siteConfig.links.twitter} title="X">
            X
          </SocialLink>
          <SocialLink href={siteConfig.links.youtube} title="YouTube">
            YT
          </SocialLink>
          <SocialLink href="/rss.xml" title="RSS Feed">
            RSS
          </SocialLink>
        </div>
      </div>

      <div className="border-t border-zinc-900">
        <div className="container flex flex-col items-center gap-4 py-4 text-sm leading-5 text-zinc-300 lg:flex-row">
          <p>{footerLinks.copyright}</p>

          <div className="flex flex-wrap justify-center gap-x-3 gap-y-2 lg:ml-auto lg:justify-start">
            {footerLinks.legal.map((link) => (
              <FooterLink key={link.text} href={link.url}>
                {link.text}
              </FooterLink>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export const Footer = FooterV2;
