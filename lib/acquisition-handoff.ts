export type ConsentValue = 'granted' | 'denied' | 'unspecified';
export type AcquisitionConsent = Record<
  'analytics_storage' | 'ad_storage' | 'ad_user_data' | 'ad_personalization',
  ConsentValue
>;
export type AcquisitionSource = {
  source: string;
  medium?: string;
  campaign?: string;
};
export type AcquisitionContext = {
  version: 1;
  visitor_id?: string;
  source?: AcquisitionSource;
  realm: 'global';
  consent: AcquisitionConsent;
};
export type AcquisitionRuntime = {
  storage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
  href: string;
  referrer: string;
  cookie: string;
  writeCookie: (value: string) => void;
  consentUpdates: unknown[];
  randomId: () => string;
};
const VISITOR_KEY = 'sealos_acquisition_visitor_v1';
const SOURCE_KEY = 'sealos_acquisition_source_v1';
const CONSENT_KEY = 'sealos_acquisition_consent_v1';
const CONSENT_FIELDS = [
  'analytics_storage',
  'ad_storage',
  'ad_user_data',
  'ad_personalization',
] as const;
export const ACQUISITION_COOKIE = 'sealos_acquisition_v1';
const COOKIE_DOMAIN = 'sealos.io';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function readJson(runtime: AcquisitionRuntime, key: string): unknown {
  try {
    return JSON.parse(runtime.storage.getItem(key) || 'null');
  } catch {
    return undefined;
  }
}
function object(value: unknown): Record<string, unknown> | undefined {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}
type ConsentReadState = {
  cursor: number;
  lastEntry: unknown;
  stored: string | null | undefined;
  consent: AcquisitionConsent;
};
const consentReads = new WeakMap<unknown[], ConsentReadState>();
function storedConsent(runtime: AcquisitionRuntime): string | null | undefined {
  try {
    return runtime.storage.getItem(CONSENT_KEY);
  } catch {
    return undefined;
  }
}
function initialConsent(stored: string | null | undefined): AcquisitionConsent {
  const consent: AcquisitionConsent = {
    analytics_storage: 'unspecified',
    ad_storage: 'unspecified',
    ad_user_data: 'unspecified',
    ad_personalization: 'unspecified',
  };
  try {
    const saved = object(JSON.parse(stored || 'null'));
    if (
      saved?.['analytics_storage'] === 'granted' ||
      saved?.['analytics_storage'] === 'denied'
    )
      consent.analytics_storage = saved['analytics_storage'];
  } catch {
    /* An invalid stored decision grants nothing. */
  }
  return consent;
}
export function readAcquisitionConsent(
  runtime: AcquisitionRuntime,
): AcquisitionConsent {
  const queue = runtime.consentUpdates;
  const stored = storedConsent(runtime);
  let state = consentReads.get(queue);
  let updatesFrom = state?.cursor ?? 0;
  const historyMoved =
    state && state.cursor > 0 && state.lastEntry !== queue[state.cursor - 1];
  let historyOnly = false;
  if (!state || state.stored !== stored) {
    historyOnly = Boolean(state) || stored != null;
    if (updatesFrom > queue.length) updatesFrom = 0;
    // Persisted choices reset page state; old grants cannot undo a newer withdrawal.
    state = {
      cursor: historyOnly ? queue.length : 0,
      lastEntry: queue.at(-1),
      stored,
      consent: initialConsent(stored),
    };
    consentReads.set(queue, state);
  }
  if (historyMoved || state.cursor > queue.length) {
    // A rotated queue has unknown ordering: historical entries may only tighten permission.
    historyOnly = true;
    updatesFrom = 0;
    state.cursor = queue.length;
    state.lastEntry = queue.at(-1);
  }
  let updated = false;
  for (const value of queue.slice(updatesFrom)) {
    const item: Record<string, unknown> | undefined =
      object(value) ||
      (Array.isArray(value)
        ? { 0: value[0], 1: value[1], 2: value[2] }
        : undefined);
    const payload =
      item?.['0'] === 'consent' && item?.['1'] === 'update'
        ? object(item?.['2'])
        : item?.['event'] === 'sealos_consent_update'
          ? item
          : undefined;
    if (!payload) continue;
    for (const key of CONSENT_FIELDS) {
      const value = payload[key];
      if (
        value === 'granted' ||
        value === 'denied' ||
        value === 'unspecified'
      ) {
        if (historyOnly && value !== 'denied') continue;
        state.consent[key] = value;
        updated = true;
      }
    }
  }
  state.cursor = queue.length;
  state.lastEntry = queue.at(-1);
  if (updated && state.consent.analytics_storage !== 'unspecified') {
    try {
      runtime.storage.setItem(
        CONSENT_KEY,
        JSON.stringify({ analytics_storage: state.consent.analytics_storage }),
      );
    } catch {
      /* A blocked store must not prevent an explicit in-page choice. */
    }
    state.stored = storedConsent(runtime);
  }
  return { ...state.consent };
}
export function setAcquisitionAnalyticsConsent(
  runtime: AcquisitionRuntime,
  allowed: boolean,
): AcquisitionConsent {
  const consent = {
    ...readAcquisitionConsent(runtime),
    analytics_storage: allowed ? 'granted' : 'denied',
  } satisfies AcquisitionConsent;
  try {
    runtime.storage.setItem(
      CONSENT_KEY,
      JSON.stringify({ analytics_storage: consent.analytics_storage }),
    );
  } catch {
    /* A blocked store must not block the user's action. */
  }
  runtime.consentUpdates.push({
    event: 'sealos_consent_update',
    ...Object.fromEntries(
      Object.entries(consent).filter(([, value]) => value !== 'unspecified'),
    ),
  });
  // Consume the local choice now so a later withdrawal cannot replay this grant.
  consentReads.set(runtime.consentUpdates, {
    cursor: runtime.consentUpdates.length,
    lastEntry: runtime.consentUpdates.at(-1),
    stored: storedConsent(runtime),
    consent: { ...consent },
  });
  if (!allowed) clearIdentity(runtime);
  return consent;
}
export function subscribeAcquisitionConsent(listener: () => void): () => void {
  const runtimeWindow = window as Window & { dataLayer?: unknown[] };
  const queue = (runtimeWindow.dataLayer ||= []);
  const previousPush = queue.push;
  let active = true;
  let scheduled = false;
  // GTM/gtag consent updates are Data Layer entries, not browser DOM events.
  // Keep the existing push contract and defer observation beyond GTM's call stack.
  const push = function (this: unknown[], ...items: unknown[]) {
    const length = previousPush.apply(this, items);
    const hasUpdate = items.some((value) => {
      const item: Record<string, unknown> | undefined =
        object(value) ||
        (Array.isArray(value) ? { 0: value[0], 1: value[1] } : undefined);
      return (
        item?.['event'] === 'sealos_consent_update' ||
        (item?.['0'] === 'consent' && item?.['1'] === 'update')
      );
    });
    if (active && this === queue && hasUpdate && !scheduled) {
      scheduled = true;
      queueMicrotask(() => {
        scheduled = false;
        if (active) listener();
      });
    }
    return length;
  };
  queue.push = push;
  const storage = (event: StorageEvent) => {
    // Ignore source/visitor writes so cross-tab updates cannot cause a read/write loop.
    if (event.key === CONSENT_KEY || event.key === null) listener();
  };
  runtimeWindow.addEventListener('sealos_consent_update', listener);
  runtimeWindow.addEventListener('storage', storage);
  return () => {
    active = false;
    if (queue.push === push) queue.push = previousPush;
    runtimeWindow.removeEventListener('sealos_consent_update', listener);
    runtimeWindow.removeEventListener('storage', storage);
  };
}
function clearIdentity(runtime: AcquisitionRuntime, eraseCookie = true): void {
  if (eraseCookie) writeSharedCookie(runtime);
  try {
    runtime.storage.removeItem(VISITOR_KEY);
    runtime.storage.removeItem(SOURCE_KEY);
  } catch {
    /* Storage may be disabled. */
  }
}
function bounded(value: string | null, max = 100): string | undefined {
  return value &&
    value.length <= max &&
    !Array.from(value).some(
      (character) =>
        character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127,
    )
    ? value
    : undefined;
}
function label(value: string | null): string | undefined {
  const safe = bounded(value);
  return safe && /^[\p{L}\p{N} _.-]+$/u.test(safe) && !/\d{7,}/.test(safe)
    ? safe
    : undefined;
}
function captureSource(runtime: AcquisitionRuntime): AcquisitionSource {
  const url = new URL(runtime.href);
  let referralSource: string | undefined;
  try {
    const referrer = new URL(runtime.referrer);
    if (
      ['https:', 'http:'].includes(referrer.protocol) &&
      !referrer.username &&
      !referrer.password &&
      referrer.hostname !== COOKIE_DOMAIN &&
      !referrer.hostname.endsWith(`.${COOKIE_DOMAIN}`)
    )
      referralSource = label(referrer.hostname);
  } catch {
    /* A missing/invalid referrer contributes no source. */
  }
  return {
    source:
      label(url.searchParams.get('utm_source')) || referralSource || 'direct',
    medium: label(url.searchParams.get('utm_medium')),
    campaign: label(url.searchParams.get('utm_campaign')),
  };
}
function storedSource(value: unknown): AcquisitionSource | undefined {
  const record = object(value);
  const source =
    typeof record?.['source'] === 'string'
      ? label(record['source'])
      : undefined;
  if (!source) return undefined;
  return {
    source,
    medium:
      typeof record?.['medium'] === 'string'
        ? label(record['medium'])
        : undefined,
    campaign:
      typeof record?.['campaign'] === 'string'
        ? label(record['campaign'])
        : undefined,
  };
}
function base64url(value: string): string {
  return btoa(
    Array.from(new TextEncoder().encode(value), (byte) =>
      String.fromCharCode(byte),
    ).join(''),
  )
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}
function decode(value: string): unknown {
  return JSON.parse(
    new TextDecoder('utf-8', { fatal: true }).decode(
      Uint8Array.from(
        atob(value.replace(/-/g, '+').replace(/_/g, '/')),
        (char) => char.charCodeAt(0),
      ),
    ),
  );
}
function sharedContext(
  runtime: AcquisitionRuntime,
): Record<string, unknown> | undefined {
  try {
    const raw = runtime.cookie
      .split(';')
      .map((value) => value.trim())
      .find((value) => value.startsWith(`${ACQUISITION_COOKIE}=`))
      ?.slice(ACQUISITION_COOKIE.length + 1);
    if (!raw || raw.length > 2400 || !/^[A-Za-z0-9_-]+$/.test(raw))
      return undefined;
    const saved = object(decode(raw));
    if (
      saved?.['version'] !== 1 ||
      saved['realm'] !== 'global' ||
      typeof saved['visitor_id'] !== 'string' ||
      !UUID.test(saved['visitor_id']) ||
      object(saved['consent'])?.['analytics_storage'] !== 'granted'
    )
      return undefined;
    return saved;
  } catch {
    return undefined;
  }
}
function officialDomain(href: string): boolean {
  try {
    const url = new URL(href);
    return (
      url.protocol === 'https:' &&
      [COOKIE_DOMAIN, `www.${COOKIE_DOMAIN}`].includes(url.hostname) &&
      !url.port
    );
  } catch {
    return false;
  }
}
function writeSharedCookie(
  runtime: AcquisitionRuntime,
  context?: AcquisitionContext,
): void {
  if (!officialDomain(runtime.href)) return;
  try {
    let value = '';
    if (context?.visitor_id) {
      const payload = { ...context };
      if (new TextEncoder().encode(JSON.stringify(payload)).length > 1800)
        delete payload.source;
      value = base64url(JSON.stringify(payload));
    }
    runtime.writeCookie(
      `${ACQUISITION_COOKIE}=${value}; Domain=${COOKIE_DOMAIN}; Path=/; Secure; SameSite=Lax; Max-Age=${value ? 2592000 : 0}`,
    );
  } catch {
    /* Cookie blocking cannot interrupt navigation. */
  }
}
export function readAcquisitionContext(
  runtime: AcquisitionRuntime,
): AcquisitionContext {
  const consent = readAcquisitionConsent(runtime);
  const context: AcquisitionContext = { version: 1, realm: 'global', consent };
  if (consent.analytics_storage !== 'granted') {
    // Unknown consent on www must not erase a root-domain journey before a choice.
    clearIdentity(runtime, consent.analytics_storage === 'denied');
    return context;
  }
  try {
    const shared = sharedContext(runtime);
    const localVisitor = runtime.storage.getItem(VISITOR_KEY);
    const visitor =
      typeof shared?.['visitor_id'] === 'string'
        ? shared['visitor_id']
        : localVisitor && UUID.test(localVisitor)
          ? localVisitor
          : runtime.randomId();
    if (!UUID.test(visitor)) return context;
    runtime.storage.setItem(VISITOR_KEY, visitor);
    context.visitor_id = visitor;
    const previous = object(readJson(runtime, SOURCE_KEY));
    context.source =
      storedSource(shared?.['source']) ||
      (visitor === localVisitor
        ? storedSource(previous?.['first_touch'])
        : undefined) ||
      captureSource(runtime);
    runtime.storage.setItem(
      SOURCE_KEY,
      JSON.stringify({ version: 1, first_touch: context.source }),
    );
  } catch {
    /* Without durable storage, do not invent a persistent visitor. */
  }
  if (!context.visitor_id) return context;
  writeSharedCookie(runtime, context);
  return context;
}

export function createBrowserAcquisitionRuntime(): AcquisitionRuntime {
  const runtimeWindow = window as Window & {
    dataLayer?: unknown[];
  };
  runtimeWindow.dataLayer = runtimeWindow.dataLayer || [];
  return {
    storage: {
      getItem: (key) => window.localStorage.getItem(key),
      setItem: (key, value) => window.localStorage.setItem(key, value),
      removeItem: (key) => window.localStorage.removeItem(key),
    },
    href: window.location.href,
    referrer: document.referrer,
    get cookie() {
      return document.cookie;
    },
    writeCookie: (value) => {
      // Finish synchronously before ordinary installer navigation; works without Cookie Store.
      document.cookie = value;
    },
    consentUpdates: runtimeWindow.dataLayer,
    randomId: () => crypto.randomUUID(),
  };
}
