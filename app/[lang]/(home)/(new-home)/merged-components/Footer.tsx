import React from 'react';
import Link from 'fumadocs-core/link';
import SealosSticky from './SealosSticky';
import {
  GithubIcon,
  DiscordIcon,
  BilibiliIcon,
  WechatIcon,
  RSSIcon,
  XIcon,
} from './FooterIcons';

const year = new Date().getFullYear();

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
    className={`font-medium text-zinc-400 transition-colors hover:text-blue-600 hover:underline hover:underline-offset-4 ${className || ''}`}
  >
    {children}
  </Link>
);

type FooterLinkType = {
  textKey: string;
  urlKey: string;
  isExternal?: boolean;
};

type FooterCategoryType = {
  titleKey?: string;
  links: FooterLinkType[];
};

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

export const footerTranslations: Record<string, Record<string, string>> = {
  en: {
    resourcesTitle: 'Resources',
    productsTitle: 'Products',
    servicesTitle: 'Services',
    supportTitle: 'Support',
    docs: 'Docs',
    education: 'Education',
    blog: 'Blog',
    appStore: 'App Store',
    devbox: 'DevBox',
    databases: 'Databases',
    pricing: 'Pricing',
    fastgpt: 'FastGPT',
    contactUs: 'Contact Us',
    termsOfService: 'Terms of Service',
    privacyPolicy: 'Privacy Policy',
    cookiePolicy: 'Cookie Policy',
    copyright: `© ${year} Sealos. All rights reserved.`,
    docsUrl: '/docs',
    educationUrl: '/education',
    blogUrl: '/blog',
    devboxUrl: '/devbox',
    databasesUrl: '/databases',
    appStoreUrl: 'https://cloud.sealos.io',
    pricingUrl: '/pricing',
    fastgptUrl: 'https://fastgpt.in',
    contactUsUrl: 'https://cloud.sealos.io',
    termsOfServiceUrl: '/legal/terms',
    privacyPolicyUrl: '/legal/privacy',
    cookiePolicyUrl: '/legal/cookies',
  },
  'zh-cn': {
    resourcesTitle: '资源',
    productsTitle: '产品',
    servicesTitle: '服务',
    supportTitle: '支持',
    docs: '文档',
    education: '教育',
    blog: '博客',
    appStore: '应用商店',
    devbox: 'DevBox',
    databases: '数据库',
    pricing: '定价',
    fastgpt: 'FastGPT',
    contactUs: '联系我们',
    termsOfService: '服务条款',
    privacyPolicy: '隐私政策',
    cookiePolicy: 'Cookie 政策',
    copyright: `© ${year} Sealos. 保留所有权利。`,
    docsUrl: '/docs',
    educationUrl: '/education',
    blogUrl: '/blog',
    devboxUrl: '/devbox',
    databasesUrl: '/databases',
    appStoreUrl: 'https://cloud.sealos.io',
    pricingUrl: '/pricing',
    fastgptUrl: 'https://fastgpt.in',
    contactUsUrl: 'https://cloud.sealos.io',
    termsOfServiceUrl: '/legal/terms',
    privacyPolicyUrl: '/legal/privacy',
    cookiePolicyUrl: '/legal/cookies',
  },
};

const getFooterLinks = (lang: string) => {
  const translations = footerTranslations[lang] || footerTranslations.en;

  const resourcesLinks = FooterLinksData.resources.links;
  const productsLinks = FooterLinksData.products.links;
  const servicesLinks = FooterLinksData.services.links;
  const supportLinks = FooterLinksData.support.links;

  return {
    resources: {
      title: FooterLinksData.resources.titleKey
        ? translations[FooterLinksData.resources.titleKey]
        : '',
      links: resourcesLinks.map((link) => ({
        text: translations[link.textKey],
        url: translations[link.urlKey],
        isExternal: link.isExternal,
      })),
    },
    products: {
      title: FooterLinksData.products.titleKey
        ? translations[FooterLinksData.products.titleKey]
        : '',
      links: productsLinks.map((link) => ({
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
  lang?: string;
}

const Footer = async ({ lang = 'en' }: FooterProps) => {
  const footerLinks = getFooterLinks(lang);

  return (
    <SealosSticky
      letters={
        <>
          {/* S Letter SVG */}
          <div
            style={{
              width: 'calc((100vw - 128px) * 0.19493)',
              flex: '0 0 auto',
            }}
          >
            <svg width="100%" height="auto" viewBox="0 0 248 313" fill="none">
              <path
                d="M79.578 200.01C81.0129 210.054 83.8159 218.283 87.7661 224.921C91.8483 231.096 97.1252 235.718 103.716 238.917C110.618 242.139 119.477 243.958 130.629 243.958V253.197C118.864 253.197 108.833 251.339 100.536 247.622L99.7385 247.257C91.5539 243.297 84.9527 237.489 79.9363 229.832C75.1839 221.911 72.0155 212.406 70.4313 201.317L9.83892 204.089C11.159 224.155 16.703 241.581 26.4719 256.366C36.2408 271.151 49.8381 282.636 67.2635 290.821C84.1446 298.75 104.247 302.839 127.571 303.087L129.837 303.099C152.015 303.099 171.157 299.666 187.263 292.801C203.632 285.937 216.173 276.167 224.886 263.494C233.582 250.962 238.066 236.323 238.338 219.578L238.351 217.95C238.351 204.139 235.378 191.814 229.432 180.975L228.846 179.93C222.51 168.842 211.685 159.337 196.371 151.417C181.792 143.488 162.01 136.921 137.024 131.717L134.589 131.218C119.276 128.05 107.395 124.75 98.9462 121.317C90.7617 117.885 84.8211 113.925 81.1248 109.437C77.6925 104.684 75.9761 98.8748 75.9761 92.0102C75.9763 82.2415 79.8053 74.3216 87.4619 68.2491C95.3826 62.1766 106.208 59.1403 119.937 59.1403L120.947 59.1457C131.338 59.2656 140.242 61.2433 147.659 65.0799C155.316 69.0403 161.389 74.7178 165.877 82.1104C170.225 89.0163 172.839 97.1611 173.718 106.545L173.797 107.456L233.995 104.288C232.147 85.8065 226.602 69.4361 217.361 55.1788C208.665 41.3675 196.624 30.4054 181.238 22.2927L179.738 21.5166C163.633 13.3319 143.962 9.2386 120.728 9.2386C98.8143 9.23867 79.9369 12.8035 64.0956 19.932L62.6205 20.608C47.498 27.6818 35.8451 37.3583 27.6604 49.6354L26.9046 50.8292C19.2234 63.2342 15.3824 77.6214 15.3824 93.9909C15.3824 109.832 18.6831 123.033 25.2835 133.594C31.884 143.891 42.445 152.473 56.9662 159.337C71.7516 166.202 91.1582 172.406 115.184 177.951C132.61 181.911 145.811 186.003 154.788 190.228C163.764 194.188 169.837 198.676 173.005 203.693C176.173 208.445 177.758 214.123 177.758 220.723L177.752 221.388C177.64 228.23 175.794 234.081 172.213 238.941L171.861 239.383C168.177 243.915 162.881 247.331 155.976 249.633C149.111 252.009 140.662 253.197 130.629 253.197V243.958C139.996 243.958 147.353 242.841 152.953 240.903L153.004 240.885L153.054 240.868C158.826 238.944 162.518 236.309 164.85 233.353C167.165 230.163 168.519 226.116 168.519 220.723C168.519 215.655 167.323 211.828 165.317 208.818L165.254 208.724L165.193 208.626C163.457 205.878 159.346 202.337 151.059 198.681L150.956 198.636L150.853 198.587C142.778 194.787 130.34 190.87 113.136 186.96L113.121 186.957L113.106 186.953C88.7391 181.33 68.6574 174.951 53.0763 167.717L53.0466 167.704L53.0182 167.69C37.4104 160.312 25.2917 150.727 17.5051 138.58L17.4483 138.491C9.71096 126.111 6.14375 111.098 6.14375 93.9909C6.14375 75.5356 10.6357 58.9639 19.8982 44.6219L19.9347 44.5651L19.9726 44.5097C29.514 30.1976 43.1079 19.2444 60.3044 11.506C77.6062 3.72038 97.8379 6.78951e-05 120.728 0C145.014 0 166.205 4.27489 183.924 13.2799C201.368 22.1449 215.189 34.4317 225.115 50.1545L226.05 51.6229C235.598 66.8724 241.27 84.1812 243.189 103.369L244.152 113.005L165.315 117.154L164.589 108.202C163.897 99.6746 161.633 92.7107 158.058 87.0332L158.018 86.9697L157.978 86.9048C154.368 80.9584 149.557 76.4645 143.414 73.2869C137.362 70.1568 129.654 68.379 119.937 68.3789C107.535 68.3789 98.945 71.1148 93.1473 75.5313C87.7377 79.8436 85.2162 85.0867 85.2161 92.0102C85.2161 97.129 86.4369 100.89 88.4435 103.78C90.8521 106.598 95.2282 109.734 102.483 112.78C110.172 115.897 121.407 119.056 136.462 122.17C163.01 127.536 184.564 134.488 200.728 143.268C217.029 151.719 229.406 162.288 236.868 175.347C244.092 187.989 247.59 202.276 247.59 217.95C247.59 237.035 242.647 254.088 232.498 268.728C222.634 283.076 208.582 293.88 190.836 301.322L190.835 301.321C173.333 308.771 152.918 312.337 129.837 312.337C104.534 312.337 82.268 308.077 63.3358 299.184C44.511 290.343 29.5477 277.783 18.7625 261.459C7.99519 245.163 2.03033 226.144 0.619242 204.696L0 195.29L78.3923 191.704L79.578 200.01Z"
                fill="url(#paint0_linear_604_44394)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_604_44394"
                  x1="653.807"
                  y1="-42.4424"
                  x2="653.807"
                  y2="296.226"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="white" stopOpacity="0.4" />
                  <stop offset="1" stopColor="#999999" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          {/* E Letter SVG */}
          <div
            style={{
              width: 'calc((100vw - 128px) * 0.18040)',
              flex: '0 0 auto',
            }}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 123 130"
              fill="none"
              preserveAspectRatio="xMidYMid meet"
            >
              <path
                d="M0.123535 65.342C0.123539 52.6666 2.58624 41.429 7.7115 31.7996L7.71802 31.7873L7.72527 31.7743C12.9569 22.0805 20.2439 14.4659 29.5489 9.03794C38.9271 3.56735 49.8722 0.93165 62.1981 0.931641C74.263 0.931641 85.0055 3.57755 94.242 9.05678C103.451 14.5199 110.526 22.3227 115.454 32.3093C120.552 42.3499 122.999 54.1248 122.999 67.4653V78.7896L43.4663 78.7896C44.3624 84.249 46.2257 88.0024 48.6852 90.4764C52.1346 93.8041 56.7586 95.6373 63.0477 95.6373V100.592L62.3612 100.585C55.3158 100.452 49.5989 98.2596 45.2105 94.0083C40.8222 89.6199 38.4156 82.8959 37.9908 73.8361L118.045 73.8361V67.4653C118.045 54.7246 115.709 43.7531 111.037 34.5515C106.507 25.3501 100.066 18.2719 91.7141 13.3173C83.3618 8.36258 73.5231 5.88517 62.1981 5.88517C50.5899 5.88517 40.5387 8.36254 32.0449 13.3173C23.5511 18.272 16.8975 25.209 12.0843 34.1274C7.41285 42.9043 5.07706 53.3092 5.07706 65.342C5.07706 77.3747 7.41284 87.8504 12.0843 96.7689C16.8975 105.687 23.5511 112.624 32.0449 117.579C40.4104 122.242 50.1712 124.646 61.3267 124.792L62.4105 124.799C75.7131 124.799 87.0895 121.81 96.5393 115.831L97.4476 115.243C107.074 108.873 113.373 100.025 116.346 88.7003L84.282 86.7886C82.7248 91.4602 80.1057 94.9287 76.4251 97.1937C72.886 99.4587 68.427 100.591 63.0477 100.592V95.6373C67.7431 95.6372 71.2088 94.6506 73.7551 93.021L73.7914 92.9977L73.829 92.9746C76.3816 91.4037 78.3386 88.9529 79.5822 85.222L80.7841 81.6176L122.672 84.1143L121.138 89.9581C117.861 102.443 110.839 112.322 100.181 119.375C89.6009 126.376 76.927 129.753 62.4105 129.753C50.1058 129.753 39.1249 127.197 29.633 121.906L29.5489 121.858C20.2439 116.43 12.9569 108.816 7.72527 99.1221L7.71077 99.0952L7.69627 99.0677C2.58722 89.314 0.123535 78.0201 0.123535 65.342ZM62.8179 29.4617C69.1865 29.5859 74.3596 31.6365 78.3367 35.6136C82.5836 39.7189 84.9193 45.9482 85.344 54.3004L37.9908 54.3004C38.8137 46.6208 41.2306 40.6678 45.2417 36.4422L45.6354 36.0384C50.0238 31.6499 55.5446 29.4559 62.1981 29.4559L62.8179 29.4617ZM62.1981 34.4094C56.7537 34.4095 52.5261 36.1535 49.1383 39.5413C46.8173 41.8622 45.008 45.0557 43.8911 49.3461L79.7989 49.3461C78.9064 44.636 77.1641 41.3704 74.8933 39.1752L74.8628 39.1462L74.8338 39.1165C71.7951 36.0777 67.746 34.4094 62.1981 34.4094Z"
                fill="url(#paint0_linear_820_9318)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_820_9318"
                  x1="207.556"
                  y1="-59.6227"
                  x2="207.556"
                  y2="121.964"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="white" stopOpacity="0.4" />
                  <stop offset="1" stopColor="#999999" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          {/* A Letter SVG */}
          <div
            style={{
              width: 'calc((100vw - 128px) * 0.18411)',
              flex: '0 0 auto',
            }}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 127 130"
              fill="none"
              preserveAspectRatio="xMidYMid meet"
            >
              <path
                d="M38.3102 90.8237C38.3102 87.143 39.584 84.1697 42.1321 81.9047C44.6537 79.6485 48.2332 78.0146 52.8699 77.0026L53.8116 76.8084L79.7174 71.2879V76.8084C79.7174 82.1878 78.5853 86.8599 76.3203 90.8237L76.105 91.1926C73.8594 94.9767 70.8163 97.8972 66.9765 99.9543C63.0128 101.936 58.4121 102.927 53.1744 102.927V97.973C57.7495 97.973 61.5448 97.1148 64.693 95.5553C67.7963 93.8801 70.2186 91.5152 72.0185 88.3654C73.7088 85.4074 74.6768 81.8071 74.7573 77.4093L54.8439 81.6539L54.8004 81.6633L54.7569 81.6713C50.1749 82.5622 47.2294 83.9919 45.4356 85.5968L45.4298 85.6019L45.4233 85.6077C44.0241 86.8515 43.2644 88.4314 43.2644 90.8237C43.2645 93.4256 44.0642 94.903 45.3037 95.9359C46.6357 97.046 49.0102 97.973 53.1744 97.973V102.927L52.7264 102.924C48.1322 102.86 44.6006 101.799 42.1321 99.7419C39.6638 97.6849 38.391 94.8307 38.3138 91.1796L38.3102 90.8237ZM111.569 92.3098V53.4507C111.569 37.8788 107.252 26.0579 98.6166 17.9888C90.1228 9.91966 77.3817 5.88517 60.3941 5.88517C45.53 5.88517 33.4972 9.1412 24.2956 15.653L23.873 15.9539C15.0612 22.3183 9.61001 31.6324 7.51974 43.8953L39.5846 45.3814C40.5446 40.1702 42.6333 36.2208 45.8517 33.5337L46.1671 33.2778C49.5646 30.4466 54.3069 29.0311 60.3941 29.0311L60.974 29.0362C66.9179 29.1519 71.4669 31.0614 74.621 34.7639C78.0186 38.4446 79.7174 43.9661 79.7174 51.3274L42.9817 58.5471C30.6657 61.0952 21.3222 65.1297 14.9518 70.6507L14.6626 70.9044C8.62686 76.2717 5.6088 83.9026 5.6088 93.7966L5.61967 94.7057C5.8425 104.04 9.51981 111.381 16.6511 116.729C23.9195 121.941 33.1805 124.628 44.4345 124.791L45.5299 124.799C53.0327 124.799 59.6155 123.737 65.278 121.613C71.082 119.49 75.7535 116.517 79.2926 112.695C81.5494 110.351 83.3794 107.767 84.7847 104.945C85.367 108.282 86.3674 111.078 87.7867 113.332C90.1932 117.013 93.3077 119.631 97.1297 121.189C101.094 122.746 105.341 123.524 109.871 123.524C111.994 123.524 114.117 123.383 116.241 123.1C118.505 122.817 120.134 122.534 121.125 122.251V100.379H117.94V95.4249H126.079V125.988L122.486 127.014C121.108 127.408 119.168 127.725 116.895 128.01L116.896 128.01C114.557 128.322 112.215 128.479 109.871 128.479C104.761 128.479 99.8956 127.598 95.3188 125.8L95.2608 125.777C90.4442 123.814 86.5601 120.508 83.6408 116.043L83.6168 116.007L83.5944 115.972C83.5163 115.848 83.4403 115.722 83.3646 115.596C83.2204 115.752 83.0747 115.907 82.9274 116.06C78.7723 120.548 73.4053 123.909 67.0171 126.252C60.6826 128.627 53.489 129.753 45.5299 129.753C33.0281 129.753 22.3131 126.885 13.7644 120.756L13.7209 120.725L13.6788 120.693C4.98334 114.171 0.655363 105.012 0.655273 93.7966C0.655273 82.6532 4.15795 73.4272 11.7143 66.9013C18.9632 60.6217 29.2143 56.3366 41.9784 53.6958L42.0262 53.6856L74.5493 47.2938C74.0509 42.9219 72.7226 40.0107 70.9811 38.124L70.9144 38.0515L70.8499 37.9769C68.7562 35.5191 65.551 33.9846 60.3941 33.9846C55.0318 33.9846 51.5614 35.2315 49.3387 37.0837L49.2909 37.1236L49.2416 37.162C47.0121 38.9272 45.2886 41.7605 44.4562 46.2789L43.6733 50.53L1.69556 48.5842L2.63654 43.0623C4.94784 29.5031 11.1507 18.8394 21.4459 11.6006C31.7125 4.33967 44.8344 0.931649 60.3941 0.931641C78.0655 0.931641 92.2416 5.11994 101.998 14.3692C111.927 23.6471 116.523 36.9636 116.523 53.4507V92.3098C116.523 93.7185 116.634 94.6877 116.773 95.3067C116.775 95.3118 116.776 95.3169 116.777 95.3219C117.031 95.3771 117.405 95.4249 117.94 95.4249V100.379L117.548 100.373C115.744 100.319 114.319 99.8856 113.274 99.0728L113.056 98.8923C112.065 97.7597 111.569 95.5657 111.569 92.3098Z"
                fill="url(#paint0_linear_820_9317)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_820_9317"
                  x1="80.5561"
                  y1="-59.6227"
                  x2="80.5561"
                  y2="121.964"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="white" stopOpacity="0.4" />
                  <stop offset="1" stopColor="#999999" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          {/* L Letter SVG */}
          <div
            style={{
              width: 'calc((100vw - 128px) * 0.08594)',
              flex: '0 0 auto',
            }}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 60 162"
              fill="none"
              preserveAspectRatio="xMidYMid meet"
            >
              <path
                d="M37.6253 123.125L37.6253 5.4855L5.77359 5.4855L5.77359 126.522L5.78156 127.496C5.94012 137.469 8.55632 144.718 13.6305 149.244C18.7047 153.769 25.7052 156.103 34.6321 156.244L35.502 156.251H54.4005L54.4005 132.468H46.756V127.514H59.3547L59.3547 161.205H35.502C25.352 161.205 16.7432 158.658 10.3327 152.941C3.61156 146.946 0.819336 137.709 0.819336 126.522L0.819336 0.53125L42.5796 0.53125L42.5796 123.125C42.5796 125.961 43.2571 126.646 43.2937 126.679C43.6228 126.978 44.5086 127.514 46.756 127.514V132.468L46.2072 132.46C43.5031 132.377 41.421 131.671 39.9611 130.344C38.404 128.929 37.6253 126.522 37.6253 123.125Z"
                fill="url(#paint0_linear_820_9316)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_820_9316"
                  x1="-49.4437"
                  y1="-25.6225"
                  x2="-49.4437"
                  y2="155.964"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="white" stopOpacity="0.4" />
                  <stop offset="1" stopColor="#999999" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          {/* O Letter SVG */}
          <div
            style={{
              width: 'calc((100vw - 128px) * 0.18411)',
              flex: '0 0 auto',
            }}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 126 130"
              fill="none"
              preserveAspectRatio="xMidYMid meet"
            >
              <path
                d="M120.623 65.342C120.623 53.6851 118.365 43.5558 113.848 34.9546L113.404 34.1274C108.59 25.2089 101.866 18.272 93.2307 13.3173C84.5953 8.36255 74.4733 5.88517 62.8651 5.88517C51.2571 5.8852 41.1355 8.36266 32.5002 13.3173L31.6962 13.7878C23.4463 18.7077 16.99 25.4876 12.3273 34.1274L11.8829 34.9546C7.36578 43.5559 5.10757 53.685 5.10757 65.342L5.11409 66.4656C5.25982 78.0281 7.66456 88.1291 12.3273 96.7689C17.1404 105.687 23.8648 112.624 32.5002 117.579C40.8657 122.242 50.626 124.646 61.7813 124.792L62.8651 124.799C74.1104 124.799 83.9611 122.54 92.4166 118.023L93.2307 117.579C101.596 112.779 108.168 106.119 112.947 97.5997L113.404 96.7689C118.066 88.1292 120.47 78.0281 120.616 66.4656L120.623 65.342ZM82.9684 65.342C82.9684 54.8728 80.8756 47.476 77.3212 42.5455L77.3052 42.5237L77.29 42.5012C73.8731 37.6515 69.2587 35.2591 62.8651 35.2591C56.4717 35.2591 51.8578 37.6516 48.4409 42.5012L48.4257 42.5237L48.4098 42.5455C44.8553 47.476 42.7625 54.8727 42.7625 65.342C42.7625 75.7821 44.8437 83.2722 48.4214 88.3668C51.8175 93.0685 56.4315 95.4248 62.8651 95.4249V100.379L62.1271 100.37C54.5546 100.186 48.6427 97.1452 44.3914 91.2485C40.0029 85.0197 37.8082 76.3839 37.8082 65.342C37.8082 54.6452 39.8678 46.2734 43.9862 40.2264L44.3914 39.6479C48.7798 33.4193 54.9378 30.3049 62.8651 30.3048C70.7926 30.3048 76.951 33.4192 81.3395 39.6479C85.728 45.7351 87.922 54.3 87.922 65.342C87.922 76.3839 85.728 85.0197 81.3395 91.2485C76.951 97.3356 70.7926 100.379 62.8651 100.379V95.4249C69.299 95.4249 73.9126 93.068 77.3088 88.3661C80.8864 83.2715 82.9684 75.7819 82.9684 65.342ZM125.577 65.342C125.577 78.0426 123.034 89.3566 117.763 99.1221C112.521 108.837 105.147 116.453 95.6962 121.876L95.6426 121.906C86.1507 127.197 75.1698 129.753 62.8651 129.753C50.5606 129.753 39.5801 127.197 30.0883 121.906L30.0347 121.876C20.5842 116.453 13.2104 108.837 7.96746 99.1221C2.69719 89.3566 0.15332 78.0426 0.15332 65.342C0.153324 52.6568 2.69123 41.4089 7.96746 31.7743C13.2104 22.0594 20.5842 14.4429 30.0347 9.02054C39.5367 3.56856 50.5368 0.931673 62.8651 0.931641C75.1935 0.931641 86.1941 3.56848 95.6962 9.02054C105.147 14.4429 112.521 22.0594 117.763 31.7743H117.763C123.039 41.409 125.577 52.6567 125.577 65.342Z"
                fill="url(#paint0_linear_820_9315)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_820_9315"
                  x1="-108.444"
                  y1="-59.6227"
                  x2="-108.444"
                  y2="121.964"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="white" stopOpacity="0.4" />
                  <stop offset="1" stopColor="#999999" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          {/* S Letter SVG */}
          <div
            style={{
              width: 'calc((100vw - 128px) * 0.17050)',
              flex: '0 0 auto',
            }}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 117 130"
              fill="none"
              preserveAspectRatio="xMidYMid meet"
            >
              <path
                d="M43.4467 84.405C44.2691 88.8697 46.0535 91.9352 48.5561 94.0373C50.8502 95.9644 54.7495 97.3365 61.0831 97.3365V102.29L60.4379 102.286C54.0342 102.199 49.1238 100.805 45.7063 98.105L45.3692 97.8309C41.8302 94.8581 39.5653 90.6819 38.5744 85.3025L6.29779 86.3645C6.86408 93.8671 9.19993 100.52 13.3051 106.324C17.552 111.987 23.6395 116.517 31.5671 119.915C39.2469 123.069 48.7202 124.695 59.987 124.794L61.0831 124.799C71.4171 124.799 80.3356 123.454 87.8385 120.764C95.244 118.159 101.056 114.424 105.273 109.56L105.676 109.085C109.79 104.148 111.911 98.1481 112.04 91.0854L112.046 90.3988C112.046 83.9534 110.585 78.5041 107.662 74.0514L107.374 73.6237C104.26 69.0937 99.0925 65.3418 91.8728 62.369C84.7946 59.2547 75.1683 56.848 62.994 55.1493C57.7562 54.4415 53.5799 53.5212 50.4656 52.3887C47.3513 51.2562 45.0863 49.8407 43.6707 48.142C42.4762 46.4167 41.8416 44.2559 41.767 41.6596L41.7598 41.1347C41.7598 37.4319 43.1549 34.46 45.9448 32.2187L46.2189 32.0041C49.3333 29.5975 53.722 28.3939 59.3845 28.3939L60.0942 28.4033C63.6112 28.4945 66.6308 29.2698 69.1524 30.7296C71.842 32.1453 74.0361 34.1984 75.7349 36.888C77.4601 39.2769 78.5631 42.1633 79.0442 45.5474L79.1327 46.2311L111.197 44.9566C110.206 37.4538 107.658 30.8001 103.552 24.9961C99.7124 19.2363 94.2781 14.6726 87.2498 11.3041L86.5648 10.9815C79.5707 7.69017 70.9157 5.99311 60.6003 5.89024L59.5969 5.88517C42.7509 5.88517 30.0806 9.28279 21.5868 16.0778L21.1982 16.391C13.105 23.0058 9.05843 31.6784 9.05837 42.4084C9.05837 48.9204 10.4738 54.4419 13.3051 58.9719C16.1363 63.5018 20.9496 67.1823 27.7445 70.0135C34.5395 72.8448 43.9538 75.3221 55.9867 77.4456C62.4986 78.4365 67.3826 79.5693 70.6385 80.8434C74.036 81.9759 76.3009 83.3914 77.4334 85.0901C78.5659 86.6473 79.1327 88.6295 79.1327 91.0361L79.1276 91.3913C79.029 95.0339 77.4027 97.7467 74.2487 99.5295L73.9529 99.6991C70.8587 101.426 66.5688 102.29 61.0831 102.29V97.3365C66.316 97.3365 69.6925 96.4675 71.7281 95.2646L71.8107 95.2168C73.4698 94.2791 74.1783 93.1208 74.1784 91.0361C74.1784 89.4119 73.8048 88.5226 73.4274 88.0036L73.3679 87.9224L73.3114 87.8383C73.1028 87.5254 72.1287 86.5621 69.0719 85.5432L68.9516 85.5026L68.8334 85.4562C66.0981 84.3858 61.6493 83.3184 55.2415 82.3433L55.1835 82.3346L55.1255 82.3244C42.936 80.1733 33.1174 77.619 25.8393 74.5864C18.4454 71.5056 12.6512 67.2724 9.10404 61.5969C5.68288 56.1229 4.10412 49.6447 4.10412 42.4084C4.10418 30.0362 8.93965 19.8189 18.5 12.203C28.2393 4.41583 42.2145 0.931641 59.5969 0.931641C70.8281 0.931674 80.5787 2.69789 88.6395 6.48324C96.6835 10.1958 103.084 15.4004 107.617 22.1644C112.204 28.66 115.02 36.074 116.108 44.3085L116.819 49.6912L74.7381 51.3636L74.211 46.7987C73.8661 43.8092 72.9805 41.5357 71.7187 39.7885L71.6288 39.6631L71.5461 39.5333C70.2887 37.5423 68.7295 36.1052 66.8449 35.1134L66.7565 35.067L66.6702 35.0169C64.8902 33.9864 62.534 33.3482 59.3845 33.3481C54.3521 33.3481 51.1865 34.4256 49.2477 35.9238L49.2346 35.934L49.2208 35.9441C47.5103 37.2475 46.7133 38.8175 46.7133 41.1347C46.7133 43.0725 47.1133 44.3138 47.6216 45.1349C48.3162 45.8835 49.6733 46.8292 52.159 47.7331C54.8039 48.6949 58.59 49.5552 63.6573 50.24L63.6791 50.2429C76.0485 51.9689 86.1617 54.4517 93.8229 57.8149C101.544 61.0036 107.624 65.2429 111.456 70.8167C115.249 76.3329 117 82.9572 117 90.3988C117 98.7833 114.553 106.171 109.482 112.257C104.548 118.177 97.7834 122.517 89.4826 125.437L89.4819 125.437C81.3165 128.359 71.8145 129.753 61.0831 129.753C48.9118 129.753 38.387 128.071 29.6851 124.497L29.6155 124.468C21.0641 120.803 14.2119 115.791 9.34182 109.297L9.3005 109.242L9.26063 109.186C4.60631 102.605 1.98777 95.0807 1.35804 86.7372L0.96875 81.5828L42.6739 80.2112L43.4467 84.405Z"
                fill="url(#paint0_linear_820_9314)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_820_9314"
                  x1="-236.444"
                  y1="-59.6227"
                  x2="-236.444"
                  y2="121.964"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="white" stopOpacity="0.4" />
                  <stop offset="1" stopColor="#999999" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </>
      }
    >
      {/* 主体内容 - Footer 的链接部分 */}
      <div className="relative w-full pt-0">
        <div className="relative z-10 container flex flex-col items-start justify-between gap-10 px-0 text-sm lg:flex-row lg:gap-0">
          <div className="flex w-full flex-col items-start">
            <h2 className="mb-4 text-[32px] leading-[48px] font-medium">
              <div style={{ color: 'white' }}>
                Ready to Stop Configuring and
              </div>
              <div
                style={{
                  background: 'linear-gradient(90deg, #FFF 0%, #146DFF 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Start Creating?
              </div>
            </h2>
            <p
              style={{
                color: '#A1A1AA',
                fontSize: '16px',
                marginBottom: '24px',
              }}
            >
              Get started for free. No credit card required.
            </p>
            <Link
              href="https://cloud.sealos.io"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '54px',
                fontWeight: 500,
                transition: 'colors',
                border: '1px solid #FFF',
                background:
                  'linear-gradient(191.74deg, #FFFFFF 8.86%, #CECECE 91.87%)',
                boxShadow:
                  '0px 4px 6px -2px rgba(255, 255, 255, 0.05), 0px 10px 15px -3px rgba(255, 255, 255, 0.16)',
                color: '#18181B',
                textDecoration: 'none',
              }}
            >
              <span>Start Building for Free</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M1.33333 6.00065H10.6667M10.6667 6.00065L6 1.33398M10.6667 6.00065L6 10.6673"
                  stroke="#18181B"
                  strokeWidth="1.33"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
          {/* Footer Links */}
          <div className="mt-10 grid w-full grid-cols-4 items-start gap-6 text-left lg:mt-0 lg:grid-cols-4 lg:gap-10">
            {[
              footerLinks.resources,
              footerLinks.products,
              footerLinks.services,
              footerLinks.support,
            ].map((category, idx) => (
              <div key={idx} className="cib flex flex-col justify-center gap-4">
                <div className="text-[clamp(14px,calc(14px+2*(100vw-375px)/265),16px)] font-semibold text-white uppercase">
                  {category.title}
                </div>
                {category.links.map((link: any, index: number) => (
                  <FooterLink key={index} href={link.url}>
                    {link.text}
                  </FooterLink>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Footer 链接栏 - 作为主内容的一部分 */}
        <div className="container mt-[30px] grid grid-cols-1 grid-rows-3 items-center border-t border-gray-600 px-0 py-4 text-sm sm:grid-cols-2 sm:grid-rows-2 lg:grid-cols-3 lg:grid-rows-1">
          <div className="col-start-1 row-start-1 flex items-center gap-6 justify-self-center sm:justify-self-start">
            {footerLinks.legal.links.map((link: any, index: number) => (
              <FooterLink key={index} href={link.url}>
                {link.text}
              </FooterLink>
            ))}
          </div>
          <div className="col-start-1 row-start-2 text-center text-[#A1A1AA] sm:col-start-2 sm:row-start-1 sm:justify-self-end lg:col-start-2 lg:row-start-1">
            Copyright © 2025 Sealos. All rights reserved.
          </div>
          <div className="col-span-1 row-start-3 flex items-center gap-4 justify-self-center sm:col-span-2 sm:row-start-2 sm:justify-self-center lg:col-start-3 lg:row-start-1 lg:justify-self-end">
            <a
              href="https://github.com/labring/sealos"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                width: '32px',
                height: '32px',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '9999px',
                background: '#FFFFFF1A',
                color: 'white',
                textDecoration: 'none',
              }}
              title="GitHub"
            >
              <GithubIcon />
            </a>
            <a
              href="https://discord.gg/Sealos"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                width: '32px',
                height: '32px',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '9999px',
                background: '#FFFFFF1A',
                color: ' #6688FF',
                textDecoration: 'none',
              }}
              title="Discord"
            >
              <DiscordIcon />
            </a>
            <a
              href="https://x.com/sealos_io"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                width: '32px',
                height: '32px',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '9999px',
                background: '#FFFFFF1A',
                color: 'white',
                textDecoration: 'none',
              }}
              title="X (Twitter)"
            >
              <XIcon />
            </a>
            <a
              href="https://x.com/sealos_io"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                width: '32px',
                height: '32px',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '9999px',
                background: '#FFFFFF1A',
                color: 'white',
                textDecoration: 'none',
              }}
              title="X (Twitter)"
            >
              <img
                src="/images/og/icons/play.png"
                alt="Play"
                style={{ width: '16px', height: '16px' }}
              />
            </a>
            {lang === 'zh-cn' && (
              <>
                <a
                  href="https://space.bilibili.com/1775707947"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    width: '32px',
                    height: '32px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '9999px',
                    background: '#FFFFFF1A',
                    color: 'white',
                    textDecoration: 'none',
                  }}
                  title="Bilibili"
                >
                  <BilibiliIcon />
                </a>
                <a
                  href="https://mp.weixin.qq.com/s/GNv9N5vXqXRKPvhVJB9aGw"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    width: '32px',
                    height: '32px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '9999px',
                    background: '#FFFFFF1A',
                    color: 'white',
                    textDecoration: 'none',
                  }}
                  title="WeChat"
                >
                  <WechatIcon />
                </a>
              </>
            )}
            <a
              href="/rss.xml"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                width: '32px',
                height: '32px',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '9999px',
                background: 'rgba(82,82,91,0.35)',
                color: 'white',
                textDecoration: 'none',
              }}
              title="RSS Feed"
            >
              <RSSIcon className="text-white" />
            </a>
          </div>
        </div>
      </div>
    </SealosSticky>
  );
};

export default Footer;
