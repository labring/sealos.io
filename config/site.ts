import { SiteConfig } from '@/types';
import { i18n } from '@/lib/i18n';

export const domain = process.env.NEXT_PUBLIC_APP_URL || 'https://sealos.io';

export const appDomain = 'https://os.sealos.io';
export const templateDomain =
  i18n.defaultLanguage === 'zh-cn'
    ? 'https://template.hzh.sealos.run'
    : 'https://template.sealos.io';

export const siteConfig: SiteConfig = {
  name: 'Sealos',
  author: 'Labring',
  banner: {
    enabled: false,
    text: '',
    action: null,
  },
  tagline:
    i18n.defaultLanguage === 'zh-cn'
      ? 'AI 原生云平台 - 一句话部署任何应用'
      : 'The AI-Native Cloud Platform - Deploy Anything with a Prompt',
  description:
    i18n.defaultLanguage === 'zh-cn'
      ? 'Sealos 是 AI 原生云平台，用一句话部署 AI 智能体、数据库和全栈应用。100% 源码可用，支持私有化部署或使用托管云。无需 DevOps 经验，从开发到生产一站式完成。'
      : 'Sealos is an AI-native cloud platform that lets you deploy AI agents, databases, and full-stack apps with a single prompt. 100% source-available. Self-host or use managed cloud. No DevOps required.',
  keywords:
    i18n.defaultLanguage === 'zh-cn'
      ? [
          'sealos',
          '云平台',
          'AI部署',
          'kubernetes',
          '云开发环境',
          '数据库托管',
          '应用部署',
          '开源云平台',
          'PaaS',
          '云IDE',
          'DevBox',
        ]
      : [
          'sealos',
          'cloud platform',
          'AI deployment',
          'kubernetes',
          'devbox',
          'database hosting',
          'app deployment',
          'source available',
          'PaaS',
          'cloud IDE',
          'serverless',
        ],
  url: {
    base: domain,
    author: '',
  },
  twitterHandle: '@Sealos_io',
  links: {
    github: 'https://github.com/labring/sealos',
    twitter: 'https://x.com/Sealos_io',
    discord: 'https://discord.gg/wdUn538zVP',
    youtube: 'https://www.youtube.com/@sealos_io',
    bilibili: 'https://space.bilibili.com/1803388873',
    wechat:
      'https://objectstorageapi.hzh.sealos.run/inmu3p0p-sealos/images/sealos-qr-code.jpg',
  },
  ogImage: `${
    process.env.NEXT_PUBLIC_APP_URL
  }/images/banner.jpeg?${new Date().getTime()}`,
  turnstileEnabled: true,
  turnstileSitekey: '0x4AAAAAABmIoQ_LAxlvw78V',
  turnstileAction: 'abuse-report',
  turnstileCdata: 'abuse-form',
  turnstileAllowedHostnames: ['sealos.io', 'usw.sealos.io', 'usw-1.sealos.io'],
  turnstileVerifyRateLimit: {
    maxRequests: 10,
    windowMs: 60_000,
  },
  emailRequestEndpoint: 'https://usw-1.sealos.io/api/auth/email/sms',
  emailVerifyEndpoint: 'https://usw-1.sealos.io/api/auth/email/verify',
  oauth2GithubUrl: 'https://usw-1.sealos.io/oauth?login=github',
  oauth2GoogleUrl: 'https://usw-1.sealos.io/oauth?login=google',
  oauth2Url: 'https://usw-1.sealos.io/oauth',
  // Template API configuration
  templateApiEndpoint: 'https://template.usw-1.sealos.io',
  // Desktop API configuration
  desktopApiEndpoint: 'https://usw-1.sealos.io',
};

export type AuthorData = {
  name: string;
  title: string;
  url: string;
  image_url: string;
};

export const blogAuthors: Record<string, AuthorData> = {
  default: {
    name: 'Sealos',
    title: 'Sealos',
    url: 'https://github.com/labring/sealos',
    image_url: `/logo.svg`,
  },
  zjy: {
    name: 'ZJY',
    title: 'ZJY',
    url: 'https://github.com/zjy365',
    image_url: 'https://avatars.githubusercontent.com/u/72259332?v=4',
  },
  yangchuansheng: {
    name: 'Carson Yang',
    title: 'Carson Yang',
    url: 'https://github.com/yangchuansheng',
    image_url: 'https://avatars.githubusercontent.com/u/15308462?v=4',
  },
};
