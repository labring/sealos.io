import type { languagesType } from '@/lib/i18n';

export interface TypewriterTextsConfig {
  [key: string]: string[];
}

export const TYPEWRITER_TEXTS: Record<languagesType, string[]> = {
  en: [
    'I want to create a full-stack application using Next.js and database.',
    'I want to deploy n8n from app store with queue mode.',
    'I want to build a Python Django web application.',
    'I want to deploy a databse for caching.',
  ],
  'zh-cn': [
    '我想从应用商店部署 N8N。',
    '我想使用 Next.js 构建 SaaS 平台。',
    '我想部署 PostgreSQL 数据库。',
    '我想创建一个 TypeScript React 应用。',
    '我想部署 Redis 用于缓存。',
    '我想构建一个 Python Django Web 应用。',
    '我想部署 MongoDB 副本集。',
    '我想创建一个使用 Next.js 和 PostgreSQL 的全栈应用。',
  ],
};

export const DEFAULT_TYPEWRITER_CONFIG = {
  TYPING_SPEED: 50, // ms per character
  PAUSE_DURATION: 3000, // ms between texts
  CLEAR_DURATION: 300, // ms for clearing animation
  CURSOR_BLINK_SPEED: 1000, // ms for cursor blink
} as const;

export function getRandomText(lang: languagesType): string {
  const texts = TYPEWRITER_TEXTS[lang];
  return texts[Math.floor(Math.random() * texts.length)];
}

export function getTextsByLanguage(lang: string): string[] {
  return TYPEWRITER_TEXTS[lang as languagesType] || TYPEWRITER_TEXTS.en;
}
