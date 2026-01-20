// Footer content and social links with theme color variables.
import React from 'react';
import { siteConfig, templateDomain } from '@/config/site';
import Link from 'fumadocs-core/link';
import { cn } from '@/lib/utils';
import {
  DiscordIcon,
  GithubIcon,
  BilibiliIcon,
  WechatIcon,
  RSSIcon,
  XIcon,
} from '../ui/icons';
import { languagesType, i18n } from '@/lib/i18n';
import { CustomButton } from '../ui/button-custom';

const year = new Date().getFullYear();

interface FooterLinkColumnProps {
  children: React.ReactNode;
}

const FooterLinkColumn: React.FC<FooterLinkColumnProps> = ({ children }) => (
  <div className="flex flex-col justify-center space-y-4">{children}</div>
);

interface FooterLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}

const FooterLink: React.FC<FooterLinkProps> = ({
  href,
  className,
  children,
}) => (
  <Link
    href={href}
    className={cn(
      'hover:underline-decoration-4 hover:underline-color-[#005B9C] text-custom-secondary-text font-medium hover:text-[#005B9C] hover:underline hover:underline-offset-4',
      className,
    )}
  >
    {children}
  </Link>
);

// Define footer link structure
type FooterLinkType = {
  textKey: string;
  urlKey: string;
  isExternal?: boolean;
};

type FooterCategoryType = {
  titleKey?: string;
  links: FooterLinkType[];
};

// Define footer categories and links (without translation text)
const FooterLinksData: Record<string, FooterCategoryType> = {
  resources: {
    titleKey: 'resourcesTitle',
    links: [
      { textKey: 'docs', urlKey: 'docsUrl', isExternal: false },
      { textKey: 'education', urlKey: 'educationUrl', isExternal: false },
      { textKey: 'blog', urlKey: 'blogUrl', isExternal: false },
    ],
  },
  products: {
    titleKey: 'productsTitle',
    links: [
      { textKey: 'devbox', urlKey: 'devboxUrl', isExternal: false },
      { textKey: 'databases', urlKey: 'databasesUrl', isExternal: false },
      { textKey: 'appStore', urlKey: 'appStoreUrl', isExternal: true },
    ],
  },
  services: {
    titleKey: 'servicesTitle',
    links: [
      { textKey: 'pricing', urlKey: 'pricingUrl', isExternal: false },
      { textKey: 'fastgpt', urlKey: 'fastgptUrl', isExternal: true },
    ],
  },
  support: {
    titleKey: 'supportTitle',
    links: [
      { textKey: 'contactUs', urlKey: 'contactUsUrl', isExternal: true },
      { textKey: 'reportAbuse', urlKey: 'reportAbuseUrl', isExternal: false },
    ],
  },
  legal: {
    links: [
      {
        textKey: 'termsOfService',
        urlKey: 'termsOfServiceUrl',
        isExternal: false,
      },
      {
        textKey: 'privacyPolicy',
        urlKey: 'privacyPolicyUrl',
        isExternal: false,
      },
      { textKey: 'cookiePolicy', urlKey: 'cookiePolicyUrl', isExternal: false },
    ],
  },
};

// Define translations for footer text and URLs
export const footerTranslations: Record<
  languagesType,
  Record<string, string>
> = {
  en: {
    // Category titles
    resourcesTitle: 'Resources',
    productsTitle: 'Products',
    servicesTitle: 'Services',
    supportTitle: 'Support',

    // Link texts
    docs: 'Docs',
    education: 'Education',
    blog: 'Blog',
    appStore: 'App Store',
    devbox: 'DevBox',
    databases: 'Databases',
    fastgpt: 'FastGPT',
    contactUs: 'Contact Us',
    reportAbuse: 'Report Abuse',
    pricing: 'Pricing',
    case: 'Customers ',
    termsOfService: 'Terms of Service',
    privacyPolicy: 'Privacy Policy',
    cookiePolicy: 'Cookie Policy',
    copyright: `Copyright © ${year} Sealos. All rights reserved.`,

    // URLs
    docsUrl: '/docs/quick-start',
    educationUrl: '/education',
    blogUrl: '/blog',
    appStoreUrl: '/products/app-store',
    devboxUrl: '/products/devbox',
    databasesUrl: '/products/databases',
    fastgptUrl: 'https://tryfastgpt.ai',
    pricingUrl: '/pricing',
    contactUsUrl: '/contact',
    reportAbuseUrl: '/abuse',
    caseUrl: '/',
    termsOfServiceUrl: '/docs/msa/terms-of-service',
    privacyPolicyUrl: '/docs/msa/privacy-policy',
    cookiePolicyUrl: '/legal/cookie-policy',
  },
  'zh-cn': {
    // Category titles
    resourcesTitle: '资源',
    productsTitle: '产品',
    servicesTitle: '服务',
    supportTitle: '支持',

    // Link texts
    docs: '文档',
    education: '教育',
    blog: '博客',
    appStore: '应用商店',
    devbox: 'DevBox',
    databases: '数据库',
    fastgpt: 'FastGPT',
    aiproxy: 'AI Proxy',
    case: '案例',
    forum: '社区',
    pricing: '价格',
    contactUs: '联系我们',
    reportAbuse: '滥用举报',
    termsOfService: '服务条款',
    privacyPolicy: '隐私政策',
    cookiePolicy: 'Cookie 政策',
    copyright: `Copyright © ${year} Sealos. 粤ICP备2023048773号 珠海环界云计算有限公司版权所有`,

    // URLs - keeping the same URLs as English but can be customized if needed
    docsUrl: '/docs/quick-start',
    educationUrl: '/education',
    blogUrl: '/blog',
    appStoreUrl: '/products/app-store',
    devboxUrl: '/products/devbox',
    databasesUrl: '/products/databases',
    fastgptUrl: 'https://fastgpt.cn',
    aiproxyUrl: '/aiproxy',
    // Use internal subscription pricing page
    pricingUrl: '/pricing',
    contactUsUrl:
      'https://fael3z0zfze.feishu.cn/share/base/form/shrcn5oHHTKCf3VREMKOhEy6fmf',
    reportAbuseUrl: '/abuse',
    caseUrl: '/customers',
    forumUrl: 'https://forum.sealos.run',
    termsOfServiceUrl: '/docs/msa/terms-of-service',
    privacyPolicyUrl: '/docs/msa/privacy-policy',
    cookiePolicyUrl: '/legal/cookie-policy',
  },
};

// Generate the footer links with translated text and URLs
const getFooterLinks = (lang: languagesType) => {
  const translations = footerTranslations[lang];

  const servicesLinks = [...FooterLinksData.services.links];
  if (lang === 'zh-cn') {
    servicesLinks.push({
      textKey: 'aiproxy',
      urlKey: 'aiproxyUrl',
      isExternal: false,
    });
  }

  const supportLinks = [...FooterLinksData.support.links];
  supportLinks.push({ textKey: 'case', urlKey: 'caseUrl', isExternal: false });
  if (lang === 'zh-cn') {
    supportLinks.push({
      textKey: 'forum',
      urlKey: 'forumUrl',
      isExternal: true,
    });
  }

  return {
    resources: {
      title: FooterLinksData.resources.titleKey
        ? translations[FooterLinksData.resources.titleKey]
        : '',
      links: FooterLinksData.resources.links.map((link) => ({
        text: translations[link.textKey],
        url: translations[link.urlKey],
        isExternal: link.isExternal,
      })),
    },
    products: {
      title: FooterLinksData.products.titleKey
        ? translations[FooterLinksData.products.titleKey]
        : '',
      links: FooterLinksData.products.links.map((link) => ({
        text: translations[link.textKey],
        url: translations[link.urlKey],
        isExternal: link.isExternal,
      })),
    },
    services: {
      title: FooterLinksData.services.titleKey
        ? translations[FooterLinksData.services.titleKey]
        : '',
      links: servicesLinks.map((link) => ({
        text: translations[link.textKey],
        url: translations[link.urlKey],
        isExternal: link.isExternal,
      })),
    },
    support: {
      title: FooterLinksData.support.titleKey
        ? translations[FooterLinksData.support.titleKey]
        : '',
      links: supportLinks.map((link) => ({
        text: translations[link.textKey],
        url: translations[link.urlKey],
        isExternal: link.isExternal,
      })),
    },
    legal: {
      links: FooterLinksData.legal.links.map((link) => ({
        text: translations[link.textKey],
        url: translations[link.urlKey],
        isExternal: link.isExternal,
      })),
    },
    copyright: translations.copyright,
  };
};

interface FooterProps {
  lang?: languagesType;
}

const Footer = ({
  lang = i18n.defaultLanguage as languagesType,
}: FooterProps) => {
  const footerLinks = getFooterLinks(lang);

  return (
    <div className="relative w-full pt-20">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between px-8 text-sm lg:flex-row">
        <div className="flex w-full flex-col items-center lg:items-start">
          <div className="mr-4 mb-4 w-full justify-center md:flex lg:justify-start">
            <Link
              href={'/'}
              aria-label={siteConfig.name}
              title={siteConfig.name}
              className="flex w-full items-center justify-center gap-2 font-bold lg:justify-start"
            >
              <img
                alt={siteConfig.name}
                src="/logo.svg"
                className="h-7 w-7"
                width={48}
                height={48}
              />
              <span className="text-xl font-bold">{siteConfig.name}</span>
            </Link>
          </div>
          <div className="text-custom-secondary-text mt-3 w-full text-center text-sm font-medium lg:text-left">
            {siteConfig.tagline}
          </div>
        </div>

        {/* Footer Links: single column on small screens, grid on large */}
        <div className="mt-10 hidden w-full grid-cols-1 gap-4 text-center sm:grid sm:grid-cols-2 sm:gap-y-8 lg:mt-0 lg:grid-cols-4 lg:items-start lg:gap-10 lg:text-left">
          <FooterLinkColumn>
            <div className="text-base font-semibold text-foreground uppercase hover:text-foreground hover:no-underline">
              {footerLinks.resources.title}
            </div>
            {footerLinks.resources.links.map((link, index) => (
              <FooterLink key={index} href={link.url}>
                {link.text}
              </FooterLink>
            ))}
          </FooterLinkColumn>
          <FooterLinkColumn>
            <div className="text-base font-semibold text-foreground uppercase hover:text-foreground hover:no-underline">
              {footerLinks.products.title}
            </div>
            {footerLinks.products.links.map((link, index) => (
              <FooterLink key={index} href={link.url}>
                {link.text}
              </FooterLink>
            ))}
          </FooterLinkColumn>
          <FooterLinkColumn>
            <div className="text-base font-semibold text-foreground uppercase hover:text-foreground hover:no-underline">
              {footerLinks.services.title}
            </div>
            {footerLinks.services.links.map((link, index) => (
              <FooterLink key={index} href={link.url}>
                {link.text}
              </FooterLink>
            ))}
          </FooterLinkColumn>
          <FooterLinkColumn>
            <div className="text-base font-semibold text-foreground uppercase hover:text-foreground hover:no-underline">
              {footerLinks.support.title}
            </div>
            {footerLinks.support.links.map((link, index) => (
              <FooterLink key={index} href={link.url}>
                {link.text}
              </FooterLink>
            ))}
          </FooterLinkColumn>
        </div>
      </div>

      <div className="mt-16 h-[1px] w-full bg-[color:var(--color-footer-divider)]"></div>
      {/* Legal links, copyright, and social icons row */}
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-8 pt-4 pb-4 text-center text-xs lg:flex-row lg:items-center lg:justify-between lg:gap-0">
        {/* Legal links */}
        <div className="text-custom-secondary-text order-1 flex flex-wrap justify-center gap-2 font-normal lg:order-none">
          {footerLinks.legal.links.map((link, index) => (
            <FooterLink
              key={index}
              className="text-custom-secondary-text font-normal"
              href={link.url}
            >
              {link.text}
            </FooterLink>
          ))}
        </div>
        {/* Copyright */}
        <div className="text-custom-secondary-text order-3 font-normal lg:order-none lg:px-4">
          {footerLinks.copyright}
        </div>
        {/* Social icons */}
        <div className="order-2 flex justify-center space-x-4 lg:order-none">
          <CustomButton
            className="flex size-8 items-center justify-center rounded-full bg-[color:var(--color-footer-icon-bg)] object-center hover:bg-[color:var(--color-footer-icon-hover)]"
            href={siteConfig.links.github}
            title="GitHub"
            location="footer_social"
            newWindow={true}
          >
            <GithubIcon />
          </CustomButton>
          <CustomButton
            className="flex size-8 items-center justify-center rounded-full bg-[color:var(--color-footer-icon-bg)] object-center hover:bg-[color:var(--color-footer-icon-hover)]"
            href={siteConfig.links.discord}
            title="Discord"
            location="footer_social"
            newWindow={true}
          >
            <DiscordIcon />
          </CustomButton>
          <CustomButton
            className="flex size-8 items-center justify-center rounded-full bg-[color:var(--color-footer-icon-bg)] object-center hover:bg-[color:var(--color-footer-icon-hover)]"
            href={siteConfig.links.twitter}
            title="Twitter"
            location="footer_social"
            newWindow={true}
          >
            <XIcon className="h-4 w-4" />
          </CustomButton>
          <CustomButton
            className="flex size-8 items-center justify-center rounded-full bg-[color:var(--color-footer-icon-bg)] object-center hover:bg-[color:var(--color-footer-icon-hover)]"
            href={siteConfig.links.youtube}
            title="YouTube"
            location="footer_social"
            newWindow={true}
          >
            <img
              src="/icons/youtube.svg"
              alt="YouTube"
              width={16}
              height={16}
              className="h-4 w-4"
            />
          </CustomButton>
          {lang === 'zh-cn' && (
            <CustomButton
              className="flex size-8 items-center justify-center rounded-full bg-[color:var(--color-footer-icon-bg)] object-center hover:bg-[color:var(--color-footer-icon-hover)]"
              href={siteConfig.links.bilibili}
              title="Bilibili"
              location="footer_social"
              newWindow={true}
            >
              <BilibiliIcon />
            </CustomButton>
          )}
          {lang === 'zh-cn' && (
            <CustomButton
              className="flex size-8 items-center justify-center rounded-full bg-[color:var(--color-footer-icon-bg)] object-center hover:bg-[color:var(--color-footer-icon-hover)]"
              href={siteConfig.links.wechat}
              title="WeChat"
              location="footer_social"
              newWindow={true}
            >
              <WechatIcon />
            </CustomButton>
          )}
          <CustomButton
            className="flex size-8 items-center justify-center rounded-full bg-[color:var(--color-footer-icon-bg)] object-center hover:bg-[color:var(--color-footer-icon-hover)]"
            href="/rss.xml"
            title="RSS Feed"
            location="footer_social"
            newWindow={true}
          >
            <RSSIcon />
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default Footer;
