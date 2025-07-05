import { languagesType } from '@/lib/i18n';

/**
 * Generic translation utility for components
 * Provides type-safe translation management
 */
export interface TranslationConfig<T> {
  en: T;
  'zh-cn': T;
}

/**
 * Get translation for a specific language with fallback to English
 */
export function getTranslation<T>(
  translations: TranslationConfig<T>,
  lang: languagesType
): T {
  return translations[lang] || translations.en;
}

/**
 * Create a translation hook for components
 */
export function createTranslationHook<T>(translations: TranslationConfig<T>) {
  return (lang: languagesType) => getTranslation(translations, lang);
}

/**
 * Common translation patterns used across components
 */
export const commonTranslations: TranslationConfig<CommonTranslations> = {
  en: {
    getStarted: 'Get Started',
    learnMore: 'Learn More',
    readMore: 'Read More',
    watchDemo: 'Watch Demo',
    viewAll: 'View All',
    loading: 'Loading...',
    error: 'Error',
    retry: 'Retry',
    close: 'Close',
    next: 'Next',
    previous: 'Previous',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
  },
  'zh-cn': {
    getStarted: '开始使用',
    learnMore: '了解更多',
    readMore: '阅读更多',
    watchDemo: '观看演示',
    viewAll: '查看全部',
    loading: '加载中...',
    error: '错误',
    retry: '重试',
    close: '关闭',
    next: '下一步',
    previous: '上一步',
    save: '保存',
    cancel: '取消',
    confirm: '确认',
  },
};

export type CommonTranslations = {
  getStarted: string;
  learnMore: string;
  readMore: string;
  watchDemo: string;
  viewAll: string;
  loading: string;
  error: string;
  retry: string;
  close: string;
  next: string;
  previous: string;
  save: string;
  cancel: string;
  confirm: string;
};

/**
 * Get common translations for a specific language
 */
export function getCommonTranslations(lang: languagesType): CommonTranslations {
  return getTranslation(commonTranslations, lang);
}
