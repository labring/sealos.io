import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const modulePath = 'lib/acquisition-handoff.ts';
const source = await readFile(modulePath, 'utf8');
const code = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const api = await import(
  `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`
);
function browser() {
  const values = new Map();
  const cookies = [];
  const runtime = {
    storage: {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, value),
      removeItem: (key) => values.delete(key),
    },
    writeCookie: (value) => cookies.push(value),
    href: 'https://sealos.io/downloads?utm_source=campaign&utm_medium=cpc&utm_campaign=launch&token=secret#fragment',
    referrer: 'https://search.test/results?secret=private',
    cookie: '_ga=GA1.1.12345.67890',
    consentUpdates: [],
    now: () => new Date('2026-10-29T00:00:00Z'),
    randomId: () => 'c85cd505-fb10-4ff9-a8f4-4ba89fbe6643',
  };
  return { runtime, values, cookies };
}
const granted = (runtime) => api.setAcquisitionAnalyticsConsent(runtime, true);
const encode = (value) =>
  Buffer.from(JSON.stringify(value)).toString('base64url');

test('no identity or source before consent; declined consent deletes stored linkage', () => {
  const { runtime, values } = browser();
  assert.deepEqual(api.readAcquisitionContext(runtime), {
    version: 1,
    realm: 'global',
    consent: {
      analytics_storage: 'unspecified',
      ad_storage: 'unspecified',
      ad_user_data: 'unspecified',
      ad_personalization: 'unspecified',
    },
  });
  assert.equal(values.size, 0);
  granted(runtime);
  assert.equal(
    api.readAcquisitionContext(runtime).visitor_id,
    'c85cd505-fb10-4ff9-a8f4-4ba89fbe6643',
  );
  api.setAcquisitionAnalyticsConsent(runtime, false);
  const declined = api.readAcquisitionContext(runtime);
  assert.equal(declined.consent.analytics_storage, 'denied');
  assert.equal(declined.visitor_id, undefined);
  assert.equal(declined.source, undefined);
  assert.equal(declined.platform_ids, undefined);
  assert.equal(values.has('sealos_acquisition_visitor_v1'), false);
});

test('consented visit survives navigation and preserves the first source', () => {
  const { runtime } = browser();
  granted(runtime);
  runtime.consentUpdates.push([
    'consent',
    'update',
    {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
    },
  ]);
  const first = api.readAcquisitionContext(runtime);
  assert.deepEqual(first.source, {
    source: 'campaign',
    medium: 'cpc',
    campaign: 'launch',
  });
  assert.equal(JSON.stringify(first).includes('secret'), false);
  runtime.href = 'https://sealos.io/downloads';
  const after = api.readAcquisitionContext(runtime);
  assert.equal(after.visitor_id, first.visitor_id);
  assert.deepEqual(after.source, first.source);
  assert.equal(after.consent.ad_user_data, 'granted');
});

test('real consent updates override stored choices; consent defaults do not invent permission', () => {
  const { runtime } = browser();
  runtime.consentUpdates.push({
    0: 'consent',
    1: 'default',
    2: { analytics_storage: 'denied' },
  });
  assert.equal(
    api.readAcquisitionConsent(runtime).analytics_storage,
    'unspecified',
  );
  granted(runtime);
  runtime.consentUpdates.push({
    0: 'consent',
    1: 'update',
    2: { analytics_storage: 'denied' },
  });
  assert.equal(api.readAcquisitionContext(runtime).visitor_id, undefined);
  assert.equal(api.readAcquisitionConsent(runtime).analytics_storage, 'denied');
});

test('cross-tab denial wins over stale grants even before the granting tab rereads its choice', () => {
  const { runtime: tabA, values } = browser();
  const { runtime: tabB } = browser();
  tabB.storage = tabA.storage;
  granted(tabA);
  api.setAcquisitionAnalyticsConsent(tabB, false);
  const after = api.readAcquisitionContext(tabA);
  assert.equal(after.consent.analytics_storage, 'denied');
  assert.equal(after.visitor_id, undefined);
  assert.equal(after.platform_ids, undefined);
  assert.equal(
    JSON.parse(values.get('sealos_acquisition_consent_v1')).analytics_storage,
    'denied',
  );
});

test('a persisted denial survives initial queue history but a newly observed update can grant again', () => {
  const { runtime, values } = browser();
  values.set(
    'sealos_acquisition_consent_v1',
    JSON.stringify({ analytics_storage: 'denied' }),
  );
  runtime.consentUpdates.push({
    event: 'sealos_consent_update',
    analytics_storage: 'granted',
  });
  assert.equal(api.readAcquisitionContext(runtime).visitor_id, undefined);
  runtime.consentUpdates.push([
    'consent',
    'update',
    { analytics_storage: 'granted' },
  ]);
  assert.equal(
    api.readAcquisitionContext(runtime).visitor_id,
    'c85cd505-fb10-4ff9-a8f4-4ba89fbe6643',
  );
  assert.equal(
    api.readAcquisitionConsent(runtime).analytics_storage,
    'granted',
  );
});

test('cross-tab revocation also invalidates cached advertising permission', () => {
  const { runtime: tabA } = browser();
  const { runtime: tabB } = browser();
  tabB.storage = tabA.storage;
  granted(tabA);
  tabA.consentUpdates.push([
    'consent',
    'update',
    {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
    },
  ]);
  assert.equal(api.readAcquisitionContext(tabA).consent.ad_storage, 'granted');
  api.setAcquisitionAnalyticsConsent(tabB, false);
  assert.equal(
    api.readAcquisitionContext(tabA).consent.ad_storage,
    'unspecified',
  );
  tabA.consentUpdates.push([
    'consent',
    'update',
    { analytics_storage: 'granted' },
  ]);
  const renewed = api.readAcquisitionContext(tabA);
  assert.equal(renewed.consent.analytics_storage, 'granted');
  assert.equal(renewed.consent.ad_user_data, 'unspecified');
  assert.equal(renewed.consent.ad_storage, 'unspecified');
  assert.equal(renewed.consent.ad_personalization, 'unspecified');
});

test('real GTM queue updates notify the observer without a manually dispatched DOM event', async () => {
  const previousWindow = globalThis.window;
  const target = new EventTarget();
  target.dataLayer = [];
  globalThis.window = target;
  try {
    const { runtime, cookies } = browser();
    runtime.consentUpdates = target.dataLayer;
    let calls = 0;
    const originalPush = target.dataLayer.push;
    const unsubscribe = api.subscribeAcquisitionConsent(() => {
      calls++;
      api.readAcquisitionContext(runtime);
    });
    target.dataLayer.push([
      'consent',
      'default',
      { analytics_storage: 'denied' },
    ]);
    target.dataLayer.push({ event: 'page_view' });
    await Promise.resolve();
    assert.equal(calls, 0);
    assert.equal(cookies.length, 0);
    const pushUpdate = function () {
      return target.dataLayer.push(arguments);
    };
    assert.equal(
      pushUpdate('consent', 'update', { analytics_storage: 'granted' }),
      3,
    );
    await Promise.resolve();
    assert.equal(calls, 1);
    assert.equal(payload(cookies).visitor_id, runtime.randomId());
    target.dataLayer.push({
      event: 'sealos_consent_update',
      analytics_storage: 'denied',
    });
    await Promise.resolve();
    assert.equal(calls, 2);
    assert.match(cookies.at(-1), /Max-Age=0$/);
    unsubscribe();
    assert.equal(target.dataLayer.push, originalPush);
    pushUpdate('consent', 'update', { analytics_storage: 'granted' });
    await Promise.resolve();
    assert.equal(calls, 2);
  } finally {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
  }
});

test('consent subscriptions ignore source and visitor storage writes and detach cleanly', () => {
  const previousWindow = globalThis.window;
  const target = new EventTarget();
  globalThis.window = target;
  try {
    let calls = 0;
    const unsubscribe = api.subscribeAcquisitionConsent(() => calls++);
    const storage = (key) =>
      target.dispatchEvent(Object.assign(new Event('storage'), { key }));
    storage('sealos_acquisition_source_v1');
    storage('sealos_acquisition_visitor_v1');
    assert.equal(calls, 0);
    storage('sealos_acquisition_consent_v1');
    storage(null);
    target.dispatchEvent(new Event('sealos_consent_update'));
    assert.equal(calls, 3);
    unsubscribe();
    storage('sealos_acquisition_consent_v1');
    assert.equal(calls, 3);
  } finally {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
  }
});

test('an already queued CMP denial remains fail-closed on a new page with a stored grant', () => {
  const { runtime, values } = browser();
  values.set(
    'sealos_acquisition_consent_v1',
    JSON.stringify({ analytics_storage: 'granted' }),
  );
  runtime.consentUpdates.push([
    'consent',
    'update',
    { analytics_storage: 'denied' },
  ]);
  assert.equal(api.readAcquisitionContext(runtime).visitor_id, undefined);
  assert.equal(api.readAcquisitionConsent(runtime).analytics_storage, 'denied');
});

test('queue truncation cannot replay a grant that preceded a consumed denial', () => {
  const { runtime } = browser();
  granted(runtime);
  runtime.consentUpdates.push([
    'consent',
    'update',
    { analytics_storage: 'denied' },
  ]);
  assert.equal(api.readAcquisitionConsent(runtime).analytics_storage, 'denied');
  runtime.consentUpdates.splice(1);
  assert.equal(api.readAcquisitionContext(runtime).visitor_id, undefined);
  runtime.consentUpdates.push([
    'consent',
    'update',
    { analytics_storage: 'granted' },
  ]);
  assert.equal(
    api.readAcquisitionContext(runtime).visitor_id,
    'c85cd505-fb10-4ff9-a8f4-4ba89fbe6643',
  );
});

test('a newer cross-tab grant is not vetoed by already consumed denial history', () => {
  const { runtime: tabA } = browser();
  const { runtime: tabB } = browser();
  tabB.storage = tabA.storage;
  api.setAcquisitionAnalyticsConsent(tabA, false);
  assert.equal(api.readAcquisitionConsent(tabB).analytics_storage, 'denied');
  granted(tabB);
  assert.equal(api.readAcquisitionConsent(tabA).analytics_storage, 'granted');
  assert.equal(api.readAcquisitionConsent(tabB).analytics_storage, 'granted');
});

test('a bounded queue rotation with unchanged length cannot hide a new denial', () => {
  const { runtime } = browser();
  granted(runtime);
  runtime.consentUpdates.splice(0, 1, [
    'consent',
    'update',
    { analytics_storage: 'denied' },
  ]);
  assert.equal(api.readAcquisitionContext(runtime).visitor_id, undefined);
  assert.equal(api.readAcquisitionConsent(runtime).analytics_storage, 'denied');
});

function payload(cookies) {
  const value = cookies.at(-1).split(';')[0].split('=')[1];
  return JSON.parse(Buffer.from(value, 'base64url').toString('utf8'));
}
test('official root/www Cookie shares a bounded UTF-8 visitor snapshot for console OAuth', () => {
  const { runtime, cookies } = browser();
  granted(runtime);
  runtime.href =
    'https://www.sealos.io/downloads?utm_source=搜索&utm_campaign=推广';
  const context = api.readAcquisitionContext(runtime);
  const cookie = cookies.at(-1);
  assert.match(cookie, /^sealos_acquisition_v1=[A-Za-z0-9_-]+;/);
  assert.match(
    cookie,
    /Domain=sealos.io; Path=\/; Secure; SameSite=Lax; Max-Age=2592000/,
  );
  const saved = payload(cookies);
  assert.equal(saved.realm, 'global');
  assert.equal(saved.visitor_id, context.visitor_id);
  assert.equal(saved.source.source, '搜索');
  assert.equal(saved.platform_ids, undefined);
  assert.equal(saved.sea_attr, undefined);
  assert.equal('user_id' in saved, false);
  const { runtime: other, cookies: more } = browser();
  granted(other);
  other.cookie = cookie.split(';')[0];
  other.href = 'https://sealos.io/';
  other.randomId = () => {
    throw new Error('must reuse existing shared visitor');
  };
  assert.equal(
    api.readAcquisitionContext(other).visitor_id,
    context.visitor_id,
  );
  assert.equal(payload(more).source.source, '搜索');
});
test('tenant, lookalike, insecure and development hosts cannot write shared Cookie', () => {
  for (const host of [
    'https://hzh.sealos.io',
    'https://tenant.sealos.io',
    'https://sealos.io.attacker.test',
    'http://sealos.io',
    'https://sealos.io:3000',
  ]) {
    const { runtime, cookies } = browser();
    runtime.href = host;
    granted(runtime);
    api.readAcquisitionContext(runtime);
    assert.equal(cookies.length, 0, host);
  }
});
test('withdrawal clears shared Cookie, new identity and source without retaining aliases', () => {
  const { runtime, cookies, values } = browser();
  granted(runtime);
  api.readAcquisitionContext(runtime);
  api.setAcquisitionAnalyticsConsent(runtime, false);
  assert.match(cookies.at(-1), /^sealos_acquisition_v1=;.*Max-Age=0$/);
  assert.equal(values.has('sealos_acquisition_visitor_v1'), false);
  assert.equal(values.has('sealos_acquisition_source_v1'), false);
});
test('campaign PII and URL secrets are omitted from the shared snapshot', () => {
  for (const campaign of [
    'someone@example.com',
    '13800138000',
    'https://attacker.test/token',
    'secret%0Avalue',
  ]) {
    const { runtime, cookies } = browser();
    granted(runtime);
    runtime.href = `https://sealos.io/downloads?utm_campaign=${campaign}&token=secret#private`;
    runtime.referrer = 'https://user:password@example.com/path?secret=true';
    api.readAcquisitionContext(runtime);
    const saved = payload(cookies);
    assert.equal(saved.source.campaign, undefined);
    assert.equal(saved.source.referrer, undefined);
    assert.equal(saved.source.landing_page, undefined);
  }
});
test('Cookie blocked storage cannot create an identity or affect downloads', () => {
  const { runtime, cookies } = browser();
  granted(runtime);
  runtime.storage.setItem = () => {
    throw new Error('blocked');
  };
  assert.equal(api.readAcquisitionContext(runtime).visitor_id, undefined);
  assert.equal(cookies.length, 0);
});

test('unknown permission does not erase an existing root-domain journey before a www choice', () => {
  const { runtime, cookies } = browser();
  runtime.href = 'https://www.sealos.io/downloads';
  api.readAcquisitionContext(runtime);
  assert.equal(cookies.length, 0);
});

test('shared root/www visitor wins over an older origin-local visitor and source', () => {
  const first = browser();
  granted(first.runtime);
  first.runtime.href = 'https://sealos.io/?utm_source=original';
  const context = api.readAcquisitionContext(first.runtime);
  const other = browser();
  granted(other.runtime);
  other.runtime.href = 'https://www.sealos.io/?utm_source=later';
  other.values.set(
    'sealos_acquisition_visitor_v1',
    '11111111-1111-4111-8111-111111111111',
  );
  other.values.set(
    'sealos_acquisition_source_v1',
    JSON.stringify({
      first_touch: {
        source: 'stale',
        landing_page: 'https://www.sealos.io/',
        timestamp: '2026-10-28T00:00:00Z',
      },
    }),
  );
  other.runtime.cookie = first.cookies.at(-1).split(';')[0];
  const after = api.readAcquisitionContext(other.runtime);
  assert.equal(after.visitor_id, context.visitor_id);
  assert.equal(after.source.source, 'original');
});

test('Cookie carries only the minimal backend fields and is bounded after UTF-8 encoding', () => {
  const { runtime, cookies } = browser();
  granted(runtime);
  runtime.href =
    'https://sealos.io/' +
    'a'.repeat(400) +
    '?utm_source=' +
    '搜'.repeat(100) +
    '&utm_medium=' +
    '媒'.repeat(100) +
    '&utm_campaign=' +
    '广'.repeat(100);
  runtime.referrer = 'https://search.test/' + 'b'.repeat(400);
  runtime.rawAttribution = () => {
    throw new Error('must not read sea_attr');
  };
  runtime.rybbitUserId = () => {
    throw new Error('must not read SDK aliases');
  };
  api.readAcquisitionContext(runtime);
  const saved = payload(cookies);
  assert.deepEqual(Object.keys(saved).sort(), [
    'consent',
    'realm',
    'source',
    'version',
    'visitor_id',
  ]);
  assert.ok(
    Buffer.from(cookies.at(-1).split(';')[0].split('=')[1], 'base64url')
      .length <= 1800,
  );
  assert.deepEqual(Object.keys(saved.source).sort(), [
    'campaign',
    'medium',
    'source',
  ]);
  assert.equal(saved.platform_ids, undefined);
  assert.equal(saved.sea_attr, undefined);
});

test('invalid shared identities and malformed source cannot become a new Cookie', () => {
  for (const data of [
    {
      version: 1,
      realm: 'china',
      visitor_id: '11111111-1111-4111-8111-111111111111',
    },
    { version: 1, realm: 'global', visitor_id: 'not-a-uuid' },
    {
      version: 1,
      realm: 'global',
      visitor_id: '11111111-1111-4111-8111-111111111111',
      consent: { analytics_storage: 'denied' },
    },
  ]) {
    const { runtime, cookies } = browser();
    granted(runtime);
    runtime.cookie = api.ACQUISITION_COOKIE + '=' + encode(data);
    assert.equal(
      api.readAcquisitionContext(runtime).visitor_id,
      runtime.randomId(),
    );
    assert.equal(payload(cookies).source.source, 'campaign');
  }
});

test('Cookie write failures do not interrupt consented observation or ordinary navigation', () => {
  const { runtime } = browser();
  granted(runtime);
  runtime.writeCookie = () => {
    throw new Error('Cookie blocked');
  };
  assert.equal(
    api.readAcquisitionContext(runtime).visitor_id,
    runtime.randomId(),
  );
  assert.doesNotThrow(() => api.setAcquisitionAnalyticsConsent(runtime, false));
});

test('unused long URLs and timestamps never enlarge the shared visitor Cookie', () => {
  const { runtime, cookies } = browser();
  granted(runtime);
  runtime.href =
    'https://sealos.io/' +
    '搜'.repeat(250) +
    '?utm_source=' +
    '搜'.repeat(100) +
    '&utm_medium=' +
    '媒'.repeat(100) +
    '&utm_campaign=' +
    '广'.repeat(100);
  runtime.referrer = 'https://search.test/' + '搜'.repeat(250);
  api.readAcquisitionContext(runtime);
  assert.equal(payload(cookies).source.source, '搜'.repeat(100));
  assert.equal(payload(cookies).source.landing_page, undefined);
  assert.equal(payload(cookies).source.referrer, undefined);
  assert.equal(payload(cookies).source.timestamp, undefined);
  assert.equal(payload(cookies).visitor_id, runtime.randomId());
  assert.ok(
    Buffer.from(cookies.at(-1).split(';')[0].split('=')[1], 'base64url')
      .length <= 1800,
  );
});

test('legacy first-source snapshots retain only consumed labels and infer referral hosts without storing URLs', () => {
  const { runtime, cookies, values } = browser();
  granted(runtime);
  values.set(
    'sealos_acquisition_source_v1',
    JSON.stringify({
      first_touch: {
        source: 'legacy',
        medium: 'cpc',
        campaign: 'first',
        landing_page: 'https://sealos.io/old?token=private',
        referrer: 'https://search.test/private',
        timestamp: '2026-10-29T00:00:00Z',
      },
    }),
  );
  values.set('sealos_acquisition_visitor_v1', runtime.randomId());
  api.readAcquisitionContext(runtime);
  assert.deepEqual(payload(cookies).source, {
    source: 'legacy',
    medium: 'cpc',
    campaign: 'first',
  });
  assert.doesNotMatch(
    values.get('sealos_acquisition_source_v1'),
    /landing_page|referrer|timestamp|private/,
  );
  const referral = browser();
  referral.runtime.href = 'https://sealos.io/downloads';
  granted(referral.runtime);
  assert.equal(
    api.readAcquisitionContext(referral.runtime).source.source,
    'search.test',
  );
  assert.doesNotMatch(
    referral.values.get('sealos_acquisition_source_v1'),
    /results|referrer|timestamp/,
  );
});

function componentHarness(file, component, prepare = () => {}) {
  const { runtime, cookies, values } = browser();
  prepare(runtime, values);
  const target = new EventTarget();
  target.dataLayer = runtime.consentUpdates;
  // Node 20's EventTarget does not normalize boolean capture on removal as the
  // browser DOM does. Preserve the real DOM contract at this boundary.
  const document = new (class extends EventTarget {
    addEventListener(type, listener, options) {
      super.addEventListener(
        type,
        listener,
        typeof options === 'boolean' ? { capture: options } : options,
      );
    }
    removeEventListener(type, listener, options) {
      super.removeEventListener(
        type,
        listener,
        typeof options === 'boolean' ? { capture: options } : options,
      );
    }
  })();
  const states = [],
    refs = [],
    effects = [];
  let stateCursor = 0,
    refCursor = 0,
    cleanups = [];
  class Anchor {
    constructor(download = true) {
      this.download = download;
    }
    closest(selector) {
      return this.download && selector.includes('a[download]') ? this : null;
    }
  }
  const react = {
    useRef(initial) {
      const i = refCursor++;
      return (refs[i] ||= { current: initial });
    },
    useState(initial) {
      const i = stateCursor++;
      if (!(i in states)) states[i] = initial;
      return [
        states[i],
        (next) => {
          states[i] = next;
        },
      ];
    },
    useEffect(effect) {
      effects.push(effect);
    },
  };
  const exports = {};
  const jsx = (type, props) => ({ type, props });
  const code = ts.transpileModule(file, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  }).outputText;
  vm.runInNewContext(code, {
    exports,
    document,
    Element: Anchor,
    Event,
    window: target,
    require: (name) =>
      name === 'react'
        ? react
        : name === 'react/jsx-runtime'
          ? { jsx, jsxs: jsx }
          : {
              ...api,
              createBrowserAcquisitionRuntime: () => runtime,
              subscribeAcquisitionConsent(listener) {
                const previousWindow = globalThis.window;
                globalThis.window = target;
                try {
                  return api.subscribeAcquisitionConsent(listener);
                } finally {
                  if (previousWindow === undefined) delete globalThis.window;
                  else globalThis.window = previousWindow;
                }
              },
            },
  });
  const render = () => {
    stateCursor = 0;
    refCursor = 0;
    return exports[component]();
  };
  render();
  const mount = () => {
    cleanups = effects.map((effect) => effect());
  };
  const cleanup = () => {
    for (const fn of cleanups) fn?.();
  };
  mount();
  return {
    runtime,
    cookies,
    values,
    target,
    document,
    consent(allowed) {
      api.setAcquisitionAnalyticsConsent(runtime, allowed);
      target.dispatchEvent(new Event('sealos_consent_update'));
    },
    click(download = true) {
      const event = new Event('click', { cancelable: true });
      Object.defineProperty(event, 'target', { value: new Anchor(download) });
      document.dispatchEvent(event);
      return event;
    },
    events: () =>
      target.dataLayer.filter((entry) =>
        ['acquisition_visit', 'download_click'].includes(entry.event),
      ),
    replayEffect() {
      cleanup();
      mount();
    },
    cleanup,
  };
}

const observerSource = await readFile(
  'components/analytics/acquisition-observer.tsx',
  'utf8',
);

test('the actual observer follows real GTM pushes, preserves a later GTM push wrapper and stops on denial', async () => {
  const h = componentHarness(observerSource, 'AcquisitionObserver');
  const subscribedPush = h.target.dataLayer.push;
  let gtmCalls = 0;
  const gtmPush = function (...items) {
    gtmCalls++;
    return subscribedPush.apply(this, items);
  };
  h.target.dataLayer.push = gtmPush;
  h.target.dataLayer.push([
    'consent',
    'default',
    { analytics_storage: 'denied' },
  ]);
  await Promise.resolve();
  assert.equal(h.events().length, 0);
  h.target.dataLayer.push([
    'consent',
    'update',
    { analytics_storage: 'granted' },
  ]);
  await Promise.resolve();
  assert.equal(h.events().length, 1);
  const visitor = payload(h.cookies).visitor_id;
  h.click();
  assert.equal(h.events()[1].visitor_id, visitor);
  h.target.dataLayer.push([
    'consent',
    'update',
    { analytics_storage: 'denied' },
  ]);
  await Promise.resolve();
  assert.match(h.cookies.at(-1), /Max-Age=0$/);
  assert.equal(h.click().defaultPrevented, false);
  assert.equal(h.events().length, 2);
  h.cleanup();
  assert.equal(
    h.target.dataLayer.push,
    gtmPush,
    'cleanup must preserve the installed GTM handler',
  );
  h.target.dataLayer.push([
    'consent',
    'update',
    { analytics_storage: 'granted' },
  ]);
  await Promise.resolve();
  assert.equal(h.events().length, 2);
  assert.ok(gtmCalls > 0);
});

test('queued GTM grants cannot create a visitor after withdrawal or observer cleanup', async () => {
  const h = componentHarness(observerSource, 'AcquisitionObserver');
  h.target.dataLayer.push([
    'consent',
    'update',
    { analytics_storage: 'granted' },
  ]);
  h.target.dataLayer.push([
    'consent',
    'update',
    { analytics_storage: 'denied' },
  ]);
  await Promise.resolve();
  assert.equal(h.events().length, 0);
  h.target.dataLayer.push([
    'consent',
    'update',
    { analytics_storage: 'granted' },
  ]);
  h.cleanup();
  await Promise.resolve();
  assert.equal(h.events().length, 0);
});

test('the actual observer writes the Cookie before direct download and emits the complete global wire', () => {
  const h = componentHarness(observerSource, 'AcquisitionObserver');
  assert.equal(h.events().length, 0);
  assert.equal(h.click().defaultPrevented, false);
  assert.equal(h.events().length, 0);
  h.consent(true);
  assert.equal(h.events().length, 1);
  assert.ok(h.cookies.length > 0);
  h.click();
  assert.deepEqual(JSON.parse(JSON.stringify(h.events())), [
    {
      event: 'acquisition_visit',
      visitor_id: h.runtime.randomId(),
      surface: 'website',
      product_edition: 'global',
      analytics_consent: 'granted',
      acquisition_source: 'campaign',
      acquisition_medium: 'cpc',
      acquisition_campaign: 'launch',
    },
    {
      event: 'download_click',
      visitor_id: h.runtime.randomId(),
      surface: 'website',
      product_edition: 'global',
      analytics_consent: 'granted',
      acquisition_source: 'campaign',
      acquisition_medium: 'cpc',
      acquisition_campaign: 'launch',
    },
  ]);
  assert.equal(payload(h.cookies).visitor_id, h.events()[1].visitor_id);
  h.click(false);
  assert.equal(h.events().length, 2);
  h.consent(false);
  assert.equal(h.click().defaultPrevented, false);
  assert.equal(h.events().length, 2);
  assert.match(h.cookies.at(-1), /Max-Age=0$/);
  h.cleanup();
});

test('website visitor events never become GA account IDs or replace browser client IDs', () => {
  const h = componentHarness(observerSource, 'AcquisitionObserver');
  h.target.dataLayer.push({
    user_id: 'existing-account',
    client_id: 'existing-browser',
  });
  h.consent(true);
  h.click();
  h.replayEffect();
  const visitor = payload(h.cookies).visitor_id;
  assert.ok(h.events().length > 0);
  assert.ok(h.events().every((event) => event.visitor_id === visitor));
  const identityWrites = h.target.dataLayer.filter(
    (item) =>
      Object.hasOwn(item, 'user_id') || Object.hasOwn(item, 'client_id'),
  );
  assert.deepEqual(JSON.parse(JSON.stringify(identityWrites)), [
    { user_id: 'existing-account', client_id: 'existing-browser' },
  ]);
  h.consent(false);
  assert.equal(
    h.target.dataLayer.filter(
      (item) =>
        Object.hasOwn(item, 'user_id') || Object.hasOwn(item, 'client_id'),
    ).length,
    1,
  );
  h.cleanup();
});

test('effect replay does not duplicate visits and missing scalar source fields explicitly clear stale Data Layer values', () => {
  const h = componentHarness(observerSource, 'AcquisitionObserver');
  h.runtime.href = 'https://sealos.io/downloads';
  h.runtime.referrer = '';
  h.target.dataLayer.push({
    acquisition_medium: 'stale',
    acquisition_campaign: 'stale',
  });
  h.consent(true);
  h.replayEffect();
  assert.equal(h.events().length, 1);
  assert.equal(h.events()[0].acquisition_source, 'direct');
  assert.equal(h.events()[0].acquisition_medium, null);
  assert.equal(h.events()[0].acquisition_campaign, null);
  h.cleanup();
  h.click();
  assert.equal(h.events().length, 1);
});

test('returning stored analytics consent reaches existing GTM before the visit exactly once across effect replay', () => {
  const h = componentHarness(
    observerSource,
    'AcquisitionObserver',
    (_runtime, values) => {
      values.set(
        'sealos_acquisition_consent_v1',
        JSON.stringify({ analytics_storage: 'granted' }),
      );
    },
  );
  const updates = () =>
    h.target.dataLayer.filter((item) => item.event === 'sealos_consent_update');
  assert.equal(updates().length, 1);
  assert.deepEqual(JSON.parse(JSON.stringify(updates()[0])), {
    event: 'sealos_consent_update',
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  assert.ok(
    h.target.dataLayer.indexOf(updates()[0]) <
      h.target.dataLayer.indexOf(h.events()[0]),
  );
  h.replayEffect();
  h.target.dispatchEvent(new Event('sealos_consent_update'));
  assert.equal(updates().length, 1);
  assert.equal(h.events().length, 1);
  h.cleanup();
});

test('withdrawal observed before late GTM does not replay an old stored grant or old advertising grants', () => {
  const h = componentHarness(
    observerSource,
    'AcquisitionObserver',
    (runtime) => {
      granted(runtime);
      runtime.consentUpdates.push([
        'consent',
        'update',
        {
          ad_storage: 'granted',
          ad_user_data: 'granted',
          ad_personalization: 'granted',
        },
      ]);
      const other = browser();
      other.runtime.storage = runtime.storage;
      api.setAcquisitionAnalyticsConsent(other.runtime, false);
    },
  );
  assert.equal(h.events().length, 0);
  const last = h.target.dataLayer
    .filter((item) => item.event === 'sealos_consent_update')
    .at(-1);
  assert.equal(last.analytics_storage, 'denied');
  assert.equal(last.ad_storage, 'denied');
  assert.equal(last.ad_user_data, 'denied');
  assert.equal(last.ad_personalization, 'denied');
  h.replayEffect();
  assert.equal(h.events().length, 0);
  h.cleanup();
});
