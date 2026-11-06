import { i18n, type languagesType } from '@/lib/i18n';

/**
 * Primary site navigation shared by every header. Each header owns its own
 * presentation and right-side actions; only the link set lives here so the
 * headers cannot drift apart again.
 */

type LocalizedText = Record<languagesType, string>;

export type HeaderLinkId =
  | 'agents'
  | 'templates'
  | 'docs'
  | 'resources'
  | 'learn'
  | 'tutorials'
  | 'blog'
  | 'community'
  | 'pricing'
  | 'contact';

type HeaderLinkSource = {
  id: HeaderLinkId;
  text: LocalizedText;
  url: string;
  isExternal: boolean;
  description?: LocalizedText;
  children?: HeaderLinkSource[];
};

export type HeaderNavChild = {
  id: HeaderLinkId;
  text: string;
  url: string;
  isExternal: boolean;
  description?: string;
};

export type HeaderNavLink = HeaderNavChild & {
  children?: HeaderNavChild[];
};

const headerLinks: HeaderLinkSource[] = [
  {
    id: 'agents',
    text: { en: 'Agents', 'zh-cn': 'Agents' },
    url: '/sealos-skills',
    isExternal: false,
  },
  {
    id: 'templates',
    text: { en: 'Templates', 'zh-cn': '模板' },
    url: '/products/app-store/',
    isExternal: false,
  },
  {
    id: 'docs',
    text: { en: 'Docs', 'zh-cn': '文档' },
    url: '/docs',
    isExternal: false,
  },
  {
    id: 'resources',
    text: { en: 'Resources', 'zh-cn': '资源' },
    url: '#',
    isExternal: false,
    children: [
      {
        id: 'learn',
        text: { en: 'Learn', 'zh-cn': '学习' },
        url: '/blog/category/best-practices',
        isExternal: false,
        description: {
          en: 'Learn and build with the best practices',
          'zh-cn': '跟着最佳实践学习和构建',
        },
      },
      {
        id: 'tutorials',
        text: { en: 'Tutorials', 'zh-cn': '教程' },
        url: '/tutorials',
        isExternal: false,
        description: {
          en: 'Step-by-step guides for real app deployments',
          'zh-cn': '真实应用部署的分步指南',
        },
      },
      {
        id: 'blog',
        text: { en: 'Blog', 'zh-cn': '博客' },
        url: '/blog',
        isExternal: false,
        description: {
          en: 'Latest news and updates from Sealos',
          'zh-cn': 'Sealos 的最新动态',
        },
      },
      {
        id: 'community',
        text: { en: 'Community', 'zh-cn': '社区' },
        url: 'https://discord.gg/wdUn538zVP',
        isExternal: true,
        description: {
          en: 'Join our community of developers',
          'zh-cn': '加入开发者社区',
        },
      },
    ],
  },
  {
    id: 'pricing',
    text: { en: 'Pricing', 'zh-cn': '定价' },
    url: '/pricing',
    isExternal: false,
  },
  {
    id: 'contact',
    text: { en: 'Contact', 'zh-cn': '联系我们' },
    url: '/contact',
    isExternal: false,
  },
];

export function localizeHeaderUrl(
  url: string,
  isExternal: boolean,
  lang?: languagesType,
) {
  if (!lang || lang === i18n.defaultLanguage) {
    return url;
  }
  if (isExternal || url.startsWith('#')) {
    return url;
  }
  if (url.startsWith(`/${lang}`)) {
    return url;
  }
  if (url === '/') {
    return `/${lang}`;
  }
  if (url.startsWith('/')) {
    return `/${lang}${url}`;
  }
  return `/${lang}/${url}`;
}

function resolveLink(
  link: HeaderLinkSource,
  lang: languagesType | undefined,
  textLang: languagesType,
): HeaderNavChild {
  return {
    id: link.id,
    text: link.text[textLang],
    url: localizeHeaderUrl(link.url, link.isExternal, lang),
    isExternal: link.isExternal,
    description: link.description?.[textLang],
  };
}

/**
 * Resolves the header links for a page.
 *
 * @param lang - Route language, used for URL prefixes.
 * @param textLang - Language of the link labels. Defaults to `lang`, then English.
 */
export function getHeaderLinks({
  lang,
  textLang = lang ?? 'en',
}: {
  lang?: languagesType;
  textLang?: languagesType;
}): HeaderNavLink[] {
  return headerLinks.map((link) => ({
    ...resolveLink(link, lang, textLang),
    children: link.children?.map((child) => resolveLink(child, lang, textLang)),
  }));
}
