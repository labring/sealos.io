import assert from 'node:assert/strict';
import test, { afterEach, beforeEach } from 'node:test';

import {
  ATTRIBUTION_STORAGE_KEY,
  appendAttributionToUrl,
  decodeAttributionState,
  getAttributionState,
} from './attribution.ts';

class MemoryStorage {
  private values = new Map<string, string>();

  clear() {
    this.values.clear();
  }

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

const localStorage = new MemoryStorage();
const browser = {
  __sealosAttribution: undefined,
  __sealosConsent: {
    ad_personalization: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    analytics_storage: 'denied',
  },
  atob,
  btoa,
  localStorage,
  location: { href: 'https://sealos.io/' },
};

const originalDocument = Object.getOwnPropertyDescriptor(
  globalThis,
  'document',
);
const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');

function restoreGlobal(
  name: 'document' | 'window',
  descriptor: PropertyDescriptor | undefined,
) {
  if (descriptor) {
    Object.defineProperty(globalThis, name, descriptor);
    return;
  }

  Reflect.deleteProperty(globalThis, name);
}

beforeEach(() => {
  Object.assign(globalThis, {
    document: { referrer: '' },
    window: browser,
  });
});

afterEach(() => {
  restoreGlobal('document', originalDocument);
  restoreGlobal('window', originalWindow);
});

function reset(href: string, consent: 'denied' | 'granted') {
  localStorage.clear();
  browser.location.href = href;
  browser.__sealosConsent.ad_user_data = consent;
}

test('denied consent records campaign context without the click ID value', () => {
  reset(
    'https://sealos.io/?gclid=denied-click&utm_campaign=deploy&utm_source=google',
    'denied',
  );

  const state = getAttributionState();

  assert.equal(state?.ad_user_data_consent, false);
  assert.equal(state?.first_touch?.click_id_present, true);
  assert.equal(state?.first_touch?.click_id_value, '');
  assert.doesNotMatch(
    localStorage.getItem(ATTRIBUTION_STORAGE_KEY) ?? '',
    /denied-click/,
  );
});

test('granted consent carries one click ID through sea_attr', () => {
  reset(
    'https://sealos.io/?gclid=granted-click&utm_campaign=deploy&utm_source=google',
    'granted',
  );

  const target = appendAttributionToUrl(new URL('https://cloud.sealos.io/'));
  const encoded = target.searchParams.get('sea_attr');
  const state = encoded ? decodeAttributionState(encoded) : null;

  assert.equal(state?.ad_user_data_consent, true);
  assert.equal(state?.first_touch?.click_id_value, 'granted-click');
});

test('granting consent recovers a click ID recorded while consent was denied', () => {
  reset(
    'https://sealos.io/?gclid=consent-later&utm_campaign=deploy&utm_source=google',
    'denied',
  );
  assert.equal(getAttributionState()?.first_touch?.click_id_value, '');

  browser.__sealosConsent.ad_user_data = 'granted';
  const state = getAttributionState();

  assert.equal(state?.ad_user_data_consent, true);
  assert.equal(state?.first_touch?.click_id_value, 'consent-later');
  assert.match(
    localStorage.getItem(ATTRIBUTION_STORAGE_KEY) ?? '',
    /consent-later/,
  );
});

test('withdrawing consent redacts a previously stored click ID', () => {
  reset('https://sealos.io/?wbraid=stored-click', 'granted');
  assert.equal(
    getAttributionState()?.first_touch?.click_id_value,
    'stored-click',
  );

  browser.__sealosConsent.ad_user_data = 'denied';
  browser.location.href = 'https://sealos.io/pricing/';
  const state = getAttributionState();

  assert.equal(state?.ad_user_data_consent, false);
  assert.equal(state?.first_touch?.click_id_value, '');
  assert.doesNotMatch(
    localStorage.getItem(ATTRIBUTION_STORAGE_KEY) ?? '',
    /stored-click/,
  );
});
