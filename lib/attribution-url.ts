type SealosAttributionWindow = Window & {
  __sealosAttribution?: {
    encode?: () => string | undefined;
  };
};

const WEBSITE_HOSTS = new Set(['sealos.io', 'www.sealos.io']);
const PRODUCT_HOST_SUFFIX = '.sealos.io';
const SEA_ATTR_PARAM = 'sea_attr';
const LOCAL_STORAGE_KEY = 'sealos_attr_v2';

function parseAbsoluteHttpUrl(url: string): URL | undefined {
  try {
    const parsed = new URL(url);

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return undefined;
    }

    return parsed;
  } catch {
    return undefined;
  }
}

function isAllowedSealosProductHostname(hostname: string): boolean {
  return hostname.endsWith(PRODUCT_HOST_SUFFIX) && !WEBSITE_HOSTS.has(hostname);
}

function resolveCallerAttribution(encodedAttr?: string): string | undefined {
  return typeof encodedAttr === 'string' && encodedAttr.length > 0
    ? encodedAttr
    : undefined;
}

function resolveRuntimeAttribution(): string | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  try {
    const runtimeWindow = window as SealosAttributionWindow;
    const encoded = runtimeWindow.__sealosAttribution?.encode?.();

    return typeof encoded === 'string' && encoded.length > 0
      ? encoded
      : undefined;
  } catch {
    return undefined;
  }
}

function resolvePageAttribution(): string | undefined {
  const pageHref =
    typeof document !== 'undefined' && document.location?.href
      ? document.location.href
      : typeof window !== 'undefined' && window.location?.href
        ? window.location.href
        : undefined;

  if (!pageHref) {
    return undefined;
  }

  const parsed = parseAbsoluteHttpUrl(pageHref);
  if (!parsed) {
    return undefined;
  }

  const encoded = parsed.searchParams.get(SEA_ATTR_PARAM);
  return typeof encoded === 'string' && encoded.length > 0 ? encoded : undefined;
}

function resolveStoredAttribution(): string | undefined {
  try {
    const storage =
      typeof localStorage !== 'undefined'
        ? localStorage
        : typeof window !== 'undefined'
          ? window.localStorage
          : undefined;

    if (!storage) {
      return undefined;
    }

    const stored = storage.getItem(LOCAL_STORAGE_KEY);
    return typeof stored === 'string' && stored.length > 0 ? stored : undefined;
  } catch {
    return undefined;
  }
}

function resolveAttributionValue(encodedAttr?: string): string | undefined {
  return (
    resolveCallerAttribution(encodedAttr) ??
    resolveRuntimeAttribution() ??
    resolvePageAttribution() ??
    resolveStoredAttribution()
  );
}

export function isSealosProductUrl(url: string): boolean {
  const parsed = parseAbsoluteHttpUrl(url);

  if (!parsed) {
    return false;
  }

  return isAllowedSealosProductHostname(parsed.hostname);
}

export function appendAttributionToUrl(url: string, encodedAttr?: string): string {
  if (typeof url !== 'string' || url.length === 0) {
    return url;
  }

  const parsed = parseAbsoluteHttpUrl(url);
  if (!parsed || !isAllowedSealosProductHostname(parsed.hostname)) {
    return url;
  }

  const resolvedAttribution = resolveAttributionValue(encodedAttr);
  if (!resolvedAttribution) {
    return url;
  }

  parsed.searchParams.set(SEA_ATTR_PARAM, resolvedAttribution);
  return parsed.toString();
}
