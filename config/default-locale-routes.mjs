const DEFAULT_LOCALE_EXACT_ROUTES = [
  '/',
  '/abuse',
  '/ai-quick-reference',
  '/blog',
  '/comparison',
  '/contact',
  '/customers',
  '/docs',
  '/pricing',
  '/sealos-skills',
  '/tutorials',
];

const DEFAULT_LOCALE_CATCH_ALL_PREFIXES = [
  '/ai-quick-reference',
  '/blog',
  '/comparison',
  '/customers',
  '/docs',
  '/legal',
  '/products',
  '/solutions',
  '/tutorials',
];

function normalizeLocale(locale) {
  const normalized = String(locale || 'en').replace(/^\/+|\/+$/g, '');

  return normalized || 'en';
}

function createDestination(locale, source) {
  if (source === '/') {
    return `/${locale}`;
  }

  return `/${locale}${source}`;
}

export function createDefaultLocaleDevRewrites(defaultLocale = 'en') {
  const locale = normalizeLocale(defaultLocale);
  const rewrites = DEFAULT_LOCALE_EXACT_ROUTES.map((source) => ({
    source,
    destination: createDestination(locale, source),
  }));

  for (const prefix of DEFAULT_LOCALE_CATCH_ALL_PREFIXES) {
    rewrites.push({
      source: `${prefix}/:path*`,
      destination: createDestination(locale, `${prefix}/:path*`),
    });
  }

  return rewrites;
}

export const defaultLocaleDevRouteSources = [
  ...DEFAULT_LOCALE_EXACT_ROUTES,
  ...DEFAULT_LOCALE_CATCH_ALL_PREFIXES.map((prefix) => `${prefix}/:path*`),
];
