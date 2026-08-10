export const ATTRIBUTION_STORAGE_KEY = 'sealos_attr_v2';
export const ATTRIBUTION_URL_PARAM = 'sea_attr';

export type GoogleClickIdType = 'gclid' | 'gbraid' | 'wbraid';

export interface AttributionTouch {
  campaign: string;
  channel: string;
  click_id_present: boolean;
  click_id_type: string;
  click_id_value: string;
  content: string;
  direct: boolean;
  landing_hostname: string;
  landing_path: string;
  medium: string;
  referrer_domain: string;
  source: string;
  term: string;
  ts: string;
}

export interface AttributionState {
  ad_user_data_consent: boolean;
  first_touch?: AttributionTouch;
  last_qualified_touch?: AttributionTouch;
  last_touch?: AttributionTouch;
  version: 2;
}

interface SealosConsentState {
  ad_personalization?: 'denied' | 'granted';
  ad_storage?: 'denied' | 'granted';
  ad_user_data?: 'denied' | 'granted';
  analytics_storage?: 'denied' | 'granted';
}

interface SealosAttributionApi {
  encode: () => string;
  getState: () => AttributionState;
  refresh: () => AttributionState;
}

const CLICK_ID_KEYS: GoogleClickIdType[] = ['gclid', 'gbraid', 'wbraid'];

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isAttributionState(value: unknown): value is AttributionState {
  return isRecord(value) && value.version === 2;
}

function redactTouchClickId(
  touch: AttributionTouch | undefined,
): AttributionTouch | undefined {
  return touch ? { ...touch, click_id_value: '' } : undefined;
}

function withConsent(
  state: AttributionState,
  adUserDataConsent: boolean,
): AttributionState {
  return {
    ...state,
    ad_user_data_consent: adUserDataConsent,
    ...(adUserDataConsent
      ? {}
      : {
          first_touch: redactTouchClickId(state.first_touch),
          last_qualified_touch: redactTouchClickId(state.last_qualified_touch),
          last_touch: redactTouchClickId(state.last_touch),
        }),
  };
}

function withCurrentConsent(state: AttributionState): AttributionState {
  return withConsent(state, window.__sealosConsent?.ad_user_data === 'granted');
}

function parseState(raw: string | null): AttributionState | null {
  try {
    const value = raw ? JSON.parse(raw) : null;
    return isAttributionState(value) ? value : null;
  } catch {
    return null;
  }
}

function encodeUtf8(value: string): string {
  return encodeURIComponent(value).replace(/%([0-9A-F]{2})/g, (_, hex) =>
    String.fromCharCode(Number.parseInt(hex, 16)),
  );
}

export function encodeAttributionState(state: AttributionState): string {
  try {
    const consentSafeState = withConsent(
      state,
      state.ad_user_data_consent === true,
    );
    return window
      .btoa(encodeUtf8(JSON.stringify(consentSafeState)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  } catch {
    return '';
  }
}

export function decodeAttributionState(value: string): AttributionState | null {
  try {
    let normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    while (normalized.length % 4) normalized += '=';
    const binary = window.atob(normalized);
    let encoded = '';
    for (let index = 0; index < binary.length; index += 1) {
      encoded += `%${binary.charCodeAt(index).toString(16).padStart(2, '0')}`;
    }
    const state = JSON.parse(decodeURIComponent(encoded));
    return isAttributionState(state) ? state : null;
  } catch {
    return null;
  }
}

function referrerDomain(): string {
  try {
    return document.referrer
      ? new URL(document.referrer).hostname.replace(/^www\./, '')
      : '';
  } catch {
    return '';
  }
}

function currentTouch(url: URL): AttributionTouch {
  const clickIdType = CLICK_ID_KEYS.find((key) => url.searchParams.has(key));
  const clickIdValue = clickIdType
    ? url.searchParams.get(clickIdType) || ''
    : '';
  const canStoreClickId = window.__sealosConsent?.ad_user_data === 'granted';
  const source =
    url.searchParams.get('utm_source') || (clickIdType ? 'google' : 'direct');
  const medium =
    url.searchParams.get('utm_medium') || (clickIdType ? 'paid' : 'none');
  const direct = source === 'direct';

  return {
    campaign: url.searchParams.get('utm_campaign') || '',
    channel: clickIdType ? 'paid_search' : direct ? 'direct' : 'campaign',
    click_id_present: Boolean(clickIdType),
    click_id_type: clickIdType || '',
    click_id_value: canStoreClickId ? clickIdValue : '',
    content: url.searchParams.get('utm_content') || '',
    direct,
    landing_hostname: url.hostname,
    landing_path: url.pathname,
    medium,
    referrer_domain: referrerDomain(),
    source,
    term: url.searchParams.get('utm_term') || '',
    ts: new Date().toISOString(),
  };
}

function recoverRedactedClickId(
  existing: AttributionTouch | undefined,
  candidates: readonly (AttributionTouch | undefined)[],
): AttributionTouch | undefined {
  if (!existing || existing.click_id_value || !existing.click_id_present) {
    return existing;
  }

  const candidate = candidates.find(
    (touch) =>
      touch?.click_id_value &&
      touch.click_id_type === existing.click_id_type &&
      touch.source === existing.source &&
      touch.campaign === existing.campaign &&
      touch.medium === existing.medium &&
      touch.landing_hostname === existing.landing_hostname &&
      touch.landing_path === existing.landing_path,
  );

  return candidate
    ? { ...existing, click_id_value: candidate.click_id_value }
    : existing;
}

function mergeAttributionState(
  stored: AttributionState | null,
  inbound: AttributionState | null,
  touch: AttributionTouch,
): AttributionState {
  const firstTouch =
    recoverRedactedClickId(stored?.first_touch, [
      inbound?.first_touch,
      touch,
    ]) ||
    recoverRedactedClickId(inbound?.first_touch, [touch]) ||
    touch;
  const lastTouch = touch.direct
    ? stored?.last_touch || inbound?.last_touch || touch
    : touch;
  const lastQualifiedTouch = touch.direct
    ? stored?.last_qualified_touch ||
      inbound?.last_qualified_touch ||
      firstTouch
    : touch;

  return {
    ad_user_data_consent: window.__sealosConsent?.ad_user_data === 'granted',
    first_touch: firstTouch,
    last_qualified_touch: lastQualifiedTouch,
    last_touch: lastTouch,
    version: 2,
  };
}

function browserAttributionApi(): SealosAttributionApi | undefined {
  return window.__sealosAttribution;
}

export function getAttributionState(): AttributionState | null {
  if (typeof window === 'undefined') return null;

  const apiState = browserAttributionApi()?.getState();
  if (isAttributionState(apiState)) {
    const state = withCurrentConsent(apiState);
    window.localStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(state));
    return state;
  }

  const url = new URL(window.location.href);
  const stored = parseState(
    window.localStorage.getItem(ATTRIBUTION_STORAGE_KEY),
  );
  const inboundValue = url.searchParams.get(ATTRIBUTION_URL_PARAM);
  const inbound = inboundValue ? decodeAttributionState(inboundValue) : null;
  const state = withCurrentConsent(
    mergeAttributionState(stored, inbound, currentTouch(url)),
  );
  window.localStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(state));
  return state;
}

export function appendAttributionToUrl(target: URL): URL {
  if (typeof window === 'undefined') return target;

  const state = getAttributionState();
  const encoded = state ? encodeAttributionState(state) : '';

  if (encoded) target.searchParams.set(ATTRIBUTION_URL_PARAM, encoded);
  return target;
}

declare global {
  interface Window {
    __sealosAttribution?: SealosAttributionApi;
    __sealosConsent?: SealosConsentState;
    __sealosUpdateConsent?: (update: SealosConsentState) => void;
  }
}
