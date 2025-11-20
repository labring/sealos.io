export type SiteConfig = {
  name: string;
  author: string;
  tagline: string;
  description: string;
  keywords: Array<string>;
  url: {
    base: string;
    author: string;
  };
  twitterHandle: string;
  links: {
    mainCta: string;
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
  emailRequestEndpoint: string;
  emailVerifyEndpoint: string;
  oauth2GithubUrl: string;
  oauth2GoogleUrl: string;
};
