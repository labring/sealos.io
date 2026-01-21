import type { ReactNode } from 'react';

export type SiteConfig = {
  name: string;
  author: string;
  tagline: string;
  description: string;
  keywords: Array<string>;
  banner?: {
    enabled?: boolean;
    text?: ReactNode;
    action?: ReactNode;
  };
  url: {
    base: string;
    author: string;
  };
  twitterHandle: string;
  links: {
    github: string;
    twitter: string;
    discord: string;
    youtube: string;
    bilibili: string;
    wechat: string;
  };
  ogImage: string;
  turnstileEnabled: boolean;
  turnstileSitekey: string;
  turnstileAction: string;
  turnstileCdata: string;
  turnstileAllowedHostnames: string[];
  turnstileVerifyRateLimit: {
    maxRequests: number;
    windowMs: number;
  };
  emailRequestEndpoint: string;
  emailVerifyEndpoint: string;
  signinSwitchRegionUrl: string;
  oauth2GithubUrl: string;
  oauth2GoogleUrl: string;
};
