import { i18n } from '@/lib/i18n';

export type DetectedBrowserLanguage = 'en' | 'zh-cn' | 'zh-hant';

export const SITE_CHOICE_PARAM = '__sl_lang';
export const DISMISSAL_STORAGE_KEY = 'sealos_cn_banner_dismissed_until';
export const DISMISSAL_TTL_MS = 30 * 24 * 60 * 60 * 1000;
export const PREFERRED_LANG_STORAGE_KEY = 'preferredLang';
export const PREFERRED_LANG_COOKIE_NAME = 'NEXT_LOCALE';

const TRADITIONAL_CHINESE_SUBTAGS = new Set(['hant', 'tw', 'hk', 'mo']);

function normalizeSiteRoot(rawUrl: string): string {
  try {
    return new URL('/', rawUrl.trim()).href;
  } catch {
    return 'https://sealos.cn/';
  }
}

export const CN_SITE_URL = normalizeSiteRoot(
  process.env.NEXT_PUBLIC_CN_SITE_URL || 'https://sealos.cn',
);

let memoryDismissedUntil = 0;

/**
 * Match browser or stored language codes against the supported detection buckets.
 * Unknown languages return undefined so subsequent entries in navigator.languages can match.
 */
export function matchBrowserLanguage(
  value: string,
): DetectedBrowserLanguage | undefined {
  const normalized = value.trim().toLowerCase().replace(/_/g, '-');
  if (!normalized) {
    return undefined;
  }

  const parts = normalized.split('-').filter(Boolean);
  const base = parts[0];

  if (base === 'en') {
    return 'en';
  }

  if (base === 'zh') {
    const isTraditional = parts
      .slice(1)
      .some((subtag) => TRADITIONAL_CHINESE_SUBTAGS.has(subtag));
    return isTraditional ? 'zh-hant' : 'zh-cn';
  }

  return undefined;
}

export function isChinaSiteHostname(hostname: string): boolean {
  const host = hostname.trim().toLowerCase();
  if (!host) {
    return false;
  }

  return (
    host === 'sealos.cn' ||
    host.endsWith('.sealos.cn') ||
    host === 'sealos.run' ||
    host.endsWith('.sealos.run')
  );
}

export function readPreferredLanguage(): DetectedBrowserLanguage | undefined {
  try {
    if (typeof localStorage !== 'undefined') {
      const value = localStorage.getItem(PREFERRED_LANG_STORAGE_KEY);
      const matched = value ? matchBrowserLanguage(value) : undefined;
      if (matched) {
        return matched;
      }
    }
  } catch {
    // Cookies and browser languages remain usable when localStorage is blocked.
  }

  try {
    if (typeof document !== 'undefined') {
      const prefix = `${PREFERRED_LANG_COOKIE_NAME}=`;
      const rawValue = document.cookie
        .split(';')
        .map((part) => part.trim())
        .find((part) => part.startsWith(prefix))
        ?.slice(prefix.length);

      if (rawValue) {
        return matchBrowserLanguage(decodeURIComponent(rawValue));
      }
    }
  } catch {
    return undefined;
  }

  return undefined;
}

export function rememberPreferredLanguage(locale: 'en' | 'zh-cn'): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(PREFERRED_LANG_STORAGE_KEY, locale);
    }
  } catch {
    // Navigation remains functional when browser storage is blocked.
  }

  try {
    if (typeof document !== 'undefined') {
      document.cookie = `${PREFERRED_LANG_COOKIE_NAME}=${locale};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
    }
  } catch {
    // Cookie persistence is best effort, independently of localStorage.
  }
}

export function isCnRecommendationDismissed(now: number = Date.now()): boolean {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(DISMISSAL_STORAGE_KEY);
      if (raw && raw.trim()) {
        const until = Number(raw);
        if (Number.isFinite(until) && until > now) {
          return true;
        }
      }
    }
  } catch {
    // Fall back to in-memory dismissal when localStorage is blocked.
  }

  return memoryDismissedUntil > now;
}

export function dismissCnRecommendation(now: number = Date.now()): void {
  const until = now + DISMISSAL_TTL_MS;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(DISMISSAL_STORAGE_KEY, String(until));
      return;
    }
  } catch {
    // Fall back to in-memory dismissal when localStorage is blocked.
  }

  memoryDismissedUntil = until;
}

/**
 * Consume cross-origin stay preference (e.g. `?__sl_lang=en`) without redirecting,
 * and strip the marker parameter from the visible URL.
 */
export function consumeSiteLanguageChoice(currentLocale: string): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const url = new URL(window.location.href);
  if (!url.searchParams.has(SITE_CHOICE_PARAM)) {
    return false;
  }

  const values = url.searchParams.getAll(SITE_CHOICE_PARAM);
  const accepted =
    values.length === 1 &&
    currentLocale === 'en' &&
    values[0].trim().toLowerCase() === 'en';

  if (accepted) {
    rememberPreferredLanguage('en');
  }

  url.searchParams.delete(SITE_CHOICE_PARAM);
  window.history.replaceState(
    window.history.state,
    '',
    `${url.pathname}${url.search}${url.hash}`,
  );

  return accepted;
}

export function shouldRecommendChineseSite(options: {
  currentLocale: string;
  defaultLocale?: string;
  hostname?: string;
  browserLanguages: readonly string[];
  now?: number;
}): boolean {
  const defaultLocale = options.defaultLocale ?? i18n.defaultLanguage;

  if (defaultLocale === 'zh-cn' || options.currentLocale !== 'en') {
    return false;
  }

  if (options.hostname && isChinaSiteHostname(options.hostname)) {
    return false;
  }

  if (isCnRecommendationDismissed(options.now)) {
    return false;
  }

  const preferred = readPreferredLanguage();
  if (preferred) {
    return preferred === 'zh-cn';
  }

  const firstMatch = options.browserLanguages
    .map(matchBrowserLanguage)
    .find(Boolean);
  return firstMatch === 'zh-cn';
}

export function getChineseSiteHref(
  currentHref?: string,
  baseUrl: string = CN_SITE_URL,
): string {
  const destination = new URL('/', normalizeSiteRoot(baseUrl));

  if (currentHref) {
    try {
      const current = new URL(currentHref);
      current.searchParams.forEach((value, key) => {
        if (key !== SITE_CHOICE_PARAM) {
          destination.searchParams.append(key, value);
        }
      });
    } catch {
      // Ignore malformed current URL and keep clean CN site root.
    }
  }

  return destination.href;
}

export function getBrowserLanguages(): string[] {
  if (typeof navigator === 'undefined') {
    return [];
  }

  if (Array.isArray(navigator.languages) && navigator.languages.length > 0) {
    return Array.from(navigator.languages);
  }

  return navigator.language ? [navigator.language] : [];
}
