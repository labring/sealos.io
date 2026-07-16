import React from 'react';
import Link from 'fumadocs-core/link';
import { siteConfig } from '@/config/site';
import { GradientText } from '@/new-components/GradientText';
import { StartBuildingButton } from './StartBuildingButton';
import { DiscordIcon, GithubIcon, RSSIcon, XIcon } from './FooterIcons';
import c from './index.module.css';

const year = new Date().getFullYear();
const wordmarkSize = 'clamp(120px, 26vw, 360px)';
const wordmarkHeight = wordmarkSize;

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
      { textKey: 'education', urlKey: 'educationUrl' },
      { textKey: 'blog', urlKey: 'blogUrl' },
    ],
  },
  products: {
    titleKey: 'productsTitle',
    links: [
      { textKey: 'devbox', urlKey: 'devboxUrl' },
      { textKey: 'databases', urlKey: 'databasesUrl' },
      { textKey: 'appStore', urlKey: 'appStoreUrl' },
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
      { textKey: 'customers', urlKey: 'customersUrl' },
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
    education: 'Education',
    blog: 'Blog',
    devbox: 'DevBox',
    databases: 'Databases',
    appStore: 'App Store',
    pricing: 'Pricing',
    fastgpt: 'FastGPT',
    contactUs: 'Contact Us',
    customers: 'Customers',
    termsOfService: 'Terms of Service',
    privacyPolicy: 'Privacy Policy',
    cookiePolicy: 'Cookie Policy',
    copyright: `Copyright © ${year} Sealos. All rights reserved.`,
    docsUrl: '/docs',
    educationUrl: '/solutions/industries/education',
    blogUrl: '/blog',
    devboxUrl: '/products/devbox',
    databasesUrl: '/products/databases',
    appStoreUrl: '/products/app-store',
    pricingUrl: '/pricing',
    fastgptUrl: 'https://fastgpt.in',
    contactUsUrl: '/contact',
    customersUrl: '/customers',
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
    education: '教育',
    blog: '博客',
    devbox: 'DevBox',
    databases: '数据库',
    appStore: '应用商店',
    pricing: '定价',
    fastgpt: 'FastGPT',
    contactUs: '联系我们',
    customers: '客户案例',
    termsOfService: '服务条款',
    privacyPolicy: '隐私政策',
    cookiePolicy: 'Cookie 政策',
    copyright: `Copyright © ${year} Sealos. 保留所有权利。`,
    docsUrl: '/docs',
    educationUrl: '/solutions/industries/education',
    blogUrl: '/blog',
    devboxUrl: '/products/devbox',
    databasesUrl: '/products/databases',
    appStoreUrl: '/products/app-store',
    pricingUrl: '/pricing',
    fastgptUrl: 'https://fastgpt.in',
    contactUsUrl: '/contact',
    customersUrl: '/customers',
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
      className="text-sm leading-5 text-zinc-400 transition-colors hover:text-white"
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
      className="flex size-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
    >
      {children}
    </a>
  );
}

export function FooterV2({ lang = 'en' }: { lang?: string }) {
  const footerLinks = getFooterLinks(lang);
  const wordmarkStroke =
    '4px 0 #58595E, -4px 0 #58595E, 0 4px #58595E, 0 -4px #58595E, 3px 3px #58595E, -3px -3px #58595E, -3px 3px #58595E, 3px -3px #58595E, 4px 4px #58595E, -4px -4px #58595E, -4px 4px #58595E, 4px -4px #58595E';

  return (
    <footer className="relative isolate text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed right-0 bottom-0 left-0 overflow-hidden"
      >
        <div
          className="[mask-image:linear-gradient(to_bottom,black_35%,transparent_100%)] text-center font-semibold tracking-normal opacity-40 select-none [-webkit-mask-image:linear-gradient(to_bottom,black_35%,transparent_100%)]"
          style={{
            color: 'var(--color-background)',
            fontSize: wordmarkSize,
            lineHeight: 1,
            textShadow: wordmarkStroke,
          }}
        >
          Sealos
        </div>
      </div>

      <div
        className={c.footerGradientClip}
        style={{
          clipPath: `inset(0 0 ${wordmarkSize} 0)`,
        }}
      >
        <div className={c.footerGradient} />
      </div>

      <div className="relative z-10 px-4 pt-60 pb-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-[1313px] flex-col gap-20">
          <div className="flex flex-col justify-between gap-14 lg:flex-row lg:gap-20">
            <div className="flex max-w-[520px] flex-col items-start gap-8">
              <div className="flex flex-col gap-[13px]">
                <h2 className="text-[32px] leading-[1.5] font-medium tracking-normal">
                  <span className="block">Ready to Stop Configuring and</span>
                  <GradientText className="block to-[#146dff]">
                    Start Creating?
                  </GradientText>
                </h2>
                <p className="text-lg leading-none text-zinc-500">
                  Get started for free. No credit card required.
                </p>
              </div>
              <StartBuildingButton className="h-10 shadow-[0_6px_25px_rgba(29,78,216,0.6)]" />
            </div>

            <nav
              aria-label="Footer"
              className="grid grid-cols-2 gap-x-10 gap-y-10 sm:grid-cols-4 lg:gap-x-20"
            >
              {footerLinks.columns.map((category) => (
                <div key={category.title} className="flex flex-col gap-6">
                  <h3 className="text-base leading-6 font-medium text-zinc-200 uppercase">
                    {category.title}
                  </h3>
                  <div className="flex flex-col gap-3.5">
                    {category.links.map((link) => (
                      <FooterLink key={link.text} href={link.url}>
                        {link.text}
                      </FooterLink>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </div>

          <div className="flex flex-col items-center justify-between gap-6 border-t border-zinc-900 pt-4 pb-6 text-sm leading-5 text-zinc-400 lg:flex-row">
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-2 lg:justify-start">
              {footerLinks.legal.map((link) => (
                <FooterLink key={link.text} href={link.url}>
                  {link.text}
                </FooterLink>
              ))}
            </div>

            <p className="text-center">{footerLinks.copyright}</p>

            <div className="flex items-center gap-6">
              <SocialLink href={siteConfig.links.github} title="GitHub">
                <GithubIcon />
              </SocialLink>
              <SocialLink href={siteConfig.links.discord} title="Discord">
                <DiscordIcon />
              </SocialLink>
              <SocialLink href={siteConfig.links.twitter} title="X">
                <XIcon className="size-4" />
              </SocialLink>
              <SocialLink href={siteConfig.links.youtube} title="YouTube">
                <img
                  src="/icons/youtube.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="size-4"
                />
              </SocialLink>
              <SocialLink href="/rss.xml" title="RSS Feed">
                <RSSIcon className="size-4" />
              </SocialLink>
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden="true" style={{ height: wordmarkHeight }} />
    </footer>
  );
}

export const Footer = FooterV2;
