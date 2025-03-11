import { SiteConfig } from '@/types';

export const domain = process.env.NEXT_PUBLIC_APP_URL || 'https://sealos.io';

export const siteConfig: SiteConfig = {
  name: 'Sealos',
  author: 'labring',
  tagline: 'Develop, deploy, and scale in one seamless cloud platform',
  description:
    'Sealos DevBox is an all-in-one cloud platform for 1-click environment/database/app setup, local IDE integration & auto-deployment.',
  keywords: ['sealos', 'Next.js'],
  url: {
    base: process.env.NEXT_PUBLIC_APP_URL || '',
    author: '',
  },
  twitterHandle: '@Sealos_io',
  links: {
    github: 'https://github.com/labring/sealos',
    twitter: 'https://x.com/Sealos_io',
    discord: 'https://discord.gg/wdUn538zVP',
    youtube: 'https://www.youtube.com/@sealos_io',
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
