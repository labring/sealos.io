import type { I18nConfig } from 'fumadocs-core/i18n';

export const LANGUAGES = ['en', 'zh-cn'];

export const i18n: I18nConfig = {
  defaultLanguage: process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'en',
  languages: LANGUAGES,
  hideLocale: 'default-locale',
};

export const locales = [
  { name: 'English', locale: 'en' },
  { name: '简体中文', locale: 'zh-cn' },
];
