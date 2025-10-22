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
  tagline:
    i18n.defaultLanguage === 'zh-cn'
      ? '一个集本地开发、线上测试、打包上线为一体的云操作系统'
      : 'Develop, deploy, and scale in one seamless cloud platform',
  description:
    i18n.defaultLanguage === 'zh-cn'
      ? 'Sealos 云操作系统，Kubernetes 云内核，多 Region 统一管理，以应用为中心的企业级容器云，秒级创建高可用数据库，自动伸缩杜绝资源浪费，一键创建容器集群，端到端的应用安全保障，支持多种复杂应用场景快速上云，超10w+企业，近百万开发者在线使用。'
      : 'Sealos, the Intelligent Cloud OS, uses AI to automate your workflow. Deploy apps, databases, and scalable Kubernetes with one click. Faster, simpler development for developers.',
  keywords: ['sealos'],
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
