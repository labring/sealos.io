import React from 'react';
import { siteConfig, templateDomain } from '@/config/site';
import Link from 'fumadocs-core/link';
import { cn } from '@/lib/utils';
import { DiscordIcon, GithubIcon, BilibiliIcon, WechatIcon, RSSIcon } from '../ui/icons';
import { languagesType, i18n } from '@/lib/i18n';

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
      'hover:underline-decoration-4 hover:underline-color-[#005B9C] text-custom-secondary-text text-sm font-medium hover:text-[#005B9C] hover:underline hover:underline-offset-4',
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
      { textKey: 'appStore', urlKey: 'appStoreUrl', isExternal: true },
    ],
  },
  products: {
    titleKey: 'productsTitle',
    links: [
      { textKey: 'devbox', urlKey: 'devboxUrl', isExternal: false },
      { textKey: 'fastgpt', urlKey: 'fastgptUrl', isExternal: true },
    ],
  },
  support: {
    titleKey: 'supportTitle',
    links: [{ textKey: 'contactUs', urlKey: 'contactUsUrl', isExternal: true }],
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
    supportTitle: 'Support',

    // Link texts
    docs: 'Docs',
    education: 'Education',
    appStore: 'App Store',
    devbox: 'DevBox',
    fastgpt: 'FastGPT',
    contactUs: 'Contact Us',
    case: 'Customers ',
    termsOfService: 'Terms of Service',
    privacyPolicy: 'Privacy Policy',
    cookiePolicy: 'Cookie Policy',
    copyright: `Copyright © ${year} Sealos. All rights reserved.`,

    // URLs
    docsUrl: '/docs/quick-start',
    educationUrl: '/education',
    appStoreUrl: templateDomain,
    devboxUrl: '/devbox',
    fastgptUrl: 'https://tryfastgpt.ai',
    contactUsUrl: 'mailto:contact@sealos.io',
    caseUrl: '/',
    termsOfServiceUrl: '/docs/msa/terms-of-service',
    privacyPolicyUrl: '/docs/msa/privacy-policy',
    cookiePolicyUrl: '/legal/cookie-policy',
  },
  'zh-cn': {
    // Category titles
    resourcesTitle: '资源',
    productsTitle: '产品',
    supportTitle: '支持',

    // Link texts
    docs: '文档',
    appStore: '应用商店',
    devbox: 'DevBox',
    fastgpt: 'FastGPT',
    aiproxy: 'AI Proxy',
    case: '案例',
    forum: '社区',
    contactUs: '联系我们',
    termsOfService: '服务条款',
    privacyPolicy: '隐私政策',
    cookiePolicy: 'Cookie 政策',
    copyright: `Copyright © ${year} Sealos. 粤ICP备2023048773号 珠海环界云计算有限公司版权所有`,

    // URLs - keeping the same URLs as English but can be customized if needed
    docsUrl: '/docs/quick-start',
    appStoreUrl: templateDomain,
    devboxUrl: '/devbox',
    fastgptUrl: 'https://fastgpt.cn',
    aiproxyUrl: '/aiproxy',
    contactUsUrl:
      'https://fael3z0zfze.feishu.cn/share/base/form/shrcn5oHHTKCf3VREMKOhEy6fmf',
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

  const productLinks = [...FooterLinksData.products.links];
  if (lang === 'zh-cn') {
    productLinks.push({
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
      links: productLinks.map((link) => ({
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

const Footer = async ({
  lang = i18n.defaultLanguage as languagesType,
}: FooterProps) => {
  const footerLinks = getFooterLinks(lang);

  return (
    <div className="relative w-full pt-20">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between text-sm max-xl:px-8 lg:flex-row">
        <div>
          <div className="mr-4 mb-4 md:flex">
            <Link
              href={'/'}
              aria-label={siteConfig.name}
              title={siteConfig.name}
              className="flex items-center gap-2 font-bold"
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
          <div className="text-custom-secondary-text mt-3 text-xs font-medium sm:text-sm">
            {siteConfig.tagline}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-3 items-start gap-10 lg:mt-0">
          <FooterLinkColumn>
            <div className="text-base font-semibold text-black uppercase hover:text-black hover:no-underline">
              {footerLinks.resources.title}
            </div>
            {footerLinks.resources.links.map((link, index) => (
              <FooterLink key={index} href={link.url}>
                {link.text}
              </FooterLink>
            ))}
          </FooterLinkColumn>
          <FooterLinkColumn>
            <div className="text-base font-semibold text-black uppercase hover:text-black hover:no-underline">
              {footerLinks.products.title}
            </div>
            {footerLinks.products.links.map((link, index) => (
              <FooterLink key={index} href={link.url}>
                {link.text}
              </FooterLink>
            ))}
          </FooterLinkColumn>
          <FooterLinkColumn>
            <div className="text-base font-semibold text-black uppercase hover:text-black hover:no-underline">
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

      <div className="mt-16 h-[1px] w-full bg-[#DDE7F7]"></div>
      <div className="mx-auto flex max-w-7xl justify-between px-2 pt-4 pb-6 pl-2">
        <div className="text-custom-secondary-text flex items-center space-x-2 text-[10px] font-normal md:text-sm">
          {footerLinks.legal.links.map((link, index) => (
            <FooterLink
              key={index}
              className="text-custom-secondary-text text-[10px] font-normal md:text-sm"
              href={link.url}
            >
              {link.text}
            </FooterLink>
          ))}
          <div>|</div>
          <div>{footerLinks.copyright}</div>
        </div>
        <div className="flex space-x-4">
          <Link
            className="flex size-8 items-center justify-center rounded-full bg-[#FAFCFF] object-center hover:bg-[#1118240D]"
            href={siteConfig.links.github}
            aria-label="GitHub"
          >
            <GithubIcon />
          </Link>

          <Link
            className="flex size-8 items-center justify-center rounded-full bg-[#FAFCFF] object-center hover:bg-[#1118240D]"
            href={siteConfig.links.discord}
            aria-label="Discord"
          >
            <DiscordIcon />
          </Link>
          <Link
            className="flex size-8 items-center justify-center rounded-full bg-[#FAFCFF] object-center hover:bg-[#1118240D]"
            href={siteConfig.links.twitter}
            aria-label="Twitter"
          >
            <img
              src="/icons/twitter.svg"
              alt="Twitter"
              width={16}
              height={16}
              className="h-4 w-4"
            />
          </Link>
          <Link
            className="flex size-8 items-center justify-center rounded-full bg-[#FAFCFF] object-center hover:bg-[#1118240D]"
            href={siteConfig.links.youtube}
            aria-label="YouTube"
          >
            <img
              src="/icons/youtube.svg"
              alt="YouTube"
              width={16}
              height={16}
              className="h-4 w-4"
            />
          </Link>
          {lang === 'zh-cn' && (
            <Link
              className="flex size-8 items-center justify-center rounded-full bg-[#FAFCFF] object-center hover:bg-[#1118240D]"
              href={siteConfig.links.bilibili}
              aria-label="Bilibili"
            >
              <BilibiliIcon />
            </Link>
          )}
          {lang === 'zh-cn' && (
            <Link
              className="flex size-8 items-center justify-center rounded-full bg-[#FAFCFF] object-center hover:bg-[#1118240D]"
              href={siteConfig.links.wechat}
              aria-label="WeChat"
            >
              <WechatIcon />
            </Link>
          )}
          <Link
            className="flex size-8 items-center justify-center rounded-full bg-[#FAFCFF] object-center hover:bg-[#1118240D]"
            href="/rss.xml"
            aria-label="RSS Feed"
          >
            <RSSIcon />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
