import { locales } from '@/lib/i18n';
import { RootProvider } from 'fumadocs-ui/provider';
import type { ReactNode } from 'react';

export default function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { lang: string };
}) {
  return (
    <RootProvider
      i18n={{
        locale: params.lang,
        locales,
        translations: {
          'zh-cn': {
            search: '搜索',
            nextPage: '下一页',
            previousPage: '上一页',
            lastUpdate: '最后更新于',
            editOnGithub: '在 GitHub 上编辑',
            searchNoResult: '没有找到相关内容',
            toc: '本页导航',
            tocNoHeadings: '本页没有导航',
            chooseLanguage: '选择语言',
          },
        }[params.lang],
      }}
      theme={{
        forcedTheme: 'light',
        defaultTheme: 'light',
        enabled: false,
        enableSystem: false,
      }}
    >
      {children}
    </RootProvider>
  );
}
