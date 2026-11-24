import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const require = createRequire(import.meta.url);
const ts = require('typescript');

const rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const compiledCache = new Map();

function createStorageMock() {
  const store = new Map();
  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(key, String(value));
    },
    removeItem(key) {
      store.delete(key);
    },
  };
}

function createRuntime({
  defaultLocale = 'en',
  cnSiteUrl,
  initialHref = 'https://sealos.io/',
} = {}) {
  const localStorage = createStorageMock();
  const document = { cookie: '' };
  const window = {
    location: { href: initialHref },
    history: {
      state: { idx: 0, tree: ['en'] },
      replaceState(state, _title, nextUrl) {
        this.state = state;
        window.location.href = new URL(nextUrl, window.location.href).href;
      },
    },
  };

  const moduleCache = new Map();

  function load(relativeOrAbsPath) {
    const base = path.isAbsolute(relativeOrAbsPath)
      ? relativeOrAbsPath
      : path.resolve(rootDir, relativeOrAbsPath);
    const filename = [
      base,
      `${base}.ts`,
      `${base}.tsx`,
      `${base}.js`,
      `${base}.mjs`,
      path.join(base, 'index.ts'),
    ].find((candidate) => {
      try {
        return readFileSync(candidate, 'utf8') !== undefined;
      } catch {
        return false;
      }
    });

    assert(filename, `Missing module dependency: ${relativeOrAbsPath}`);
    if (moduleCache.has(filename)) {
      return moduleCache.get(filename).exports;
    }

    const mod = { exports: {} };
    moduleCache.set(filename, mod);

    if (!compiledCache.has(filename)) {
      const source = readFileSync(filename, 'utf8');
      const outputText = ts.transpileModule(source, {
        compilerOptions: {
          module: ts.ModuleKind.CommonJS,
          target: ts.ScriptTarget.ES2020,
          esModuleInterop: true,
        },
      }).outputText;
      compiledCache.set(filename, outputText);
    }

    const env = {
      NEXT_PUBLIC_DEFAULT_LOCALE: defaultLocale,
    };
    if (cnSiteUrl !== undefined) {
      env.NEXT_PUBLIC_CN_SITE_URL = cnSiteUrl;
    }

    vm.runInNewContext(
      compiledCache.get(filename),
      {
        module: mod,
        exports: mod.exports,
        require: (specifier) => {
          if (specifier.startsWith('@/')) {
            return load(specifier.slice(2));
          }
          if (specifier.startsWith('.')) {
            return load(path.resolve(path.dirname(filename), specifier));
          }
          return require(specifier);
        },
        process: { env },
        localStorage,
        document,
        window,
        URL,
        URLSearchParams,
        console,
      },
      { filename },
    );

    return mod.exports;
  }

  return {
    mod: load('lib/chinese-site-recommendation.ts'),
    localStorage,
    document,
    window,
  };
}

test('matchBrowserLanguage classifies Simplified Chinese, Traditional Chinese, English, and unsupported locales', () => {
  const { mod } = createRuntime();

  for (const input of [
    'zh',
    'zh-CN',
    'zh_cn',
    'zh-SG',
    'zh-Hans',
    'zh-Hans-CN',
  ]) {
    assert.equal(mod.matchBrowserLanguage(input), 'zh-cn', input);
  }

  for (const input of [
    'zh-TW',
    'zh-HK',
    'zh-MO',
    'zh-Hant',
    'zh_Hant_TW',
    'zh-Hant-HK',
  ]) {
    assert.equal(mod.matchBrowserLanguage(input), 'zh-hant', input);
  }

  for (const input of ['en', 'en-US', 'en_GB']) {
    assert.equal(mod.matchBrowserLanguage(input), 'en', input);
  }

  for (const input of ['fr-FR', 'ja-JP', '', '   ']) {
    assert.equal(mod.matchBrowserLanguage(input), undefined, input);
  }
});

test('shouldRecommendChineseSite enforces Simplified Chinese priority and route/host guards', () => {
  const { mod } = createRuntime();

  assert.equal(
    mod.shouldRecommendChineseSite({
      currentLocale: 'en',
      hostname: 'sealos.io',
      browserLanguages: ['zh-CN', 'en-US'],
    }),
    true,
  );
  assert.equal(
    mod.shouldRecommendChineseSite({
      currentLocale: 'en',
      hostname: 'sealos.io',
      browserLanguages: ['fr-FR', 'zh-CN', 'en-US'],
    }),
    true,
  );
  assert.equal(
    mod.shouldRecommendChineseSite({
      currentLocale: 'en',
      hostname: 'sealos.io',
      browserLanguages: ['en-US', 'zh-CN'],
    }),
    false,
  );
  assert.equal(
    mod.shouldRecommendChineseSite({
      currentLocale: 'en',
      hostname: 'sealos.io',
      browserLanguages: ['zh-TW', 'zh-CN'],
    }),
    false,
  );
  assert.equal(
    mod.shouldRecommendChineseSite({
      currentLocale: 'en',
      hostname: 'sealos.io',
      browserLanguages: ['zh-HK', 'en-US'],
    }),
    false,
  );
  assert.equal(
    mod.shouldRecommendChineseSite({
      currentLocale: 'en',
      hostname: 'sealos.io',
      browserLanguages: ['ja-JP'],
    }),
    false,
  );

  assert.equal(
    mod.shouldRecommendChineseSite({
      currentLocale: 'zh-cn',
      hostname: 'sealos.io',
      browserLanguages: ['zh-CN'],
    }),
    false,
  );
  assert.equal(
    mod.shouldRecommendChineseSite({
      currentLocale: 'en',
      defaultLocale: 'zh-cn',
      hostname: 'sealos.io',
      browserLanguages: ['zh-CN'],
    }),
    false,
  );

  for (const chinaHost of [
    'sealos.cn',
    'www.sealos.cn',
    'sealos.run',
    'docs.sealos.run',
  ]) {
    assert.equal(
      mod.shouldRecommendChineseSite({
        currentLocale: 'en',
        hostname: chinaHost,
        browserLanguages: ['zh-CN'],
      }),
      false,
      chinaHost,
    );
  }

  for (const allowedHost of ['sealos.io', 'www.sealos.io', 'localhost']) {
    assert.equal(
      mod.shouldRecommendChineseSite({
        currentLocale: 'en',
        hostname: allowedHost,
        browserLanguages: ['zh-CN'],
      }),
      true,
      allowedHost,
    );
  }
});

test('30-day dismissal TTL suppresses banner for 30 days and resets on expiry or corrupted values', () => {
  const { mod, localStorage } = createRuntime();
  const t0 = 1_700_000_000_000;
  const dayMs = 24 * 60 * 60 * 1000;

  mod.dismissCnRecommendation(t0);
  assert.equal(
    localStorage.getItem(mod.DISMISSAL_STORAGE_KEY),
    String(t0 + 30 * dayMs),
  );

  assert.equal(
    mod.shouldRecommendChineseSite({
      currentLocale: 'en',
      hostname: 'sealos.io',
      browserLanguages: ['zh-CN'],
      now: t0,
    }),
    false,
  );
  assert.equal(
    mod.shouldRecommendChineseSite({
      currentLocale: 'en',
      hostname: 'sealos.io',
      browserLanguages: ['zh-CN'],
      now: t0 + 29 * dayMs,
    }),
    false,
  );
  assert.equal(
    mod.shouldRecommendChineseSite({
      currentLocale: 'en',
      hostname: 'sealos.io',
      browserLanguages: ['zh-CN'],
      now: t0 + 30 * dayMs - 1,
    }),
    false,
  );
  assert.equal(
    mod.shouldRecommendChineseSite({
      currentLocale: 'en',
      hostname: 'sealos.io',
      browserLanguages: ['zh-CN'],
      now: t0 + 30 * dayMs,
    }),
    true,
  );
  assert.equal(
    mod.shouldRecommendChineseSite({
      currentLocale: 'en',
      hostname: 'sealos.io',
      browserLanguages: ['zh-CN'],
      now: t0 + 30 * dayMs + 1,
    }),
    true,
  );

  for (const badValue of ['abc', '', 'NaN', '-100']) {
    localStorage.setItem(mod.DISMISSAL_STORAGE_KEY, badValue);
    assert.equal(
      mod.shouldRecommendChineseSite({
        currentLocale: 'en',
        hostname: 'sealos.io',
        browserLanguages: ['zh-CN'],
        now: t0,
      }),
      true,
      `badValue=${JSON.stringify(badValue)}`,
    );
  }
});

test('consumeSiteLanguageChoice transfers ?__sl_lang=en cleanly and rejects malformed markers', () => {
  const validRuntime = createRuntime({
    initialHref:
      'https://sealos.io/pricing/?__sl_lang=en&utm_source=cn#section',
  });
  const preservedState = validRuntime.window.history.state;
  const accepted = validRuntime.mod.consumeSiteLanguageChoice('en');

  assert.equal(accepted, true);
  assert.equal(
    validRuntime.localStorage.getItem(
      validRuntime.mod.PREFERRED_LANG_STORAGE_KEY,
    ),
    'en',
  );
  assert.match(validRuntime.document.cookie, /NEXT_LOCALE=en/);
  assert.equal(
    validRuntime.window.location.href,
    'https://sealos.io/pricing/?utm_source=cn#section',
  );
  assert.equal(validRuntime.window.history.state, preservedState);
  assert.equal(
    validRuntime.mod.shouldRecommendChineseSite({
      currentLocale: 'en',
      hostname: 'sealos.io',
      browserLanguages: ['zh-CN'],
    }),
    false,
  );

  for (const badQuery of [
    '__sl_lang=fr',
    '__sl_lang=zh-cn',
    '__sl_lang=en&__sl_lang=zh-cn',
    '__sl_lang=https://evil.com',
  ]) {
    const r = createRuntime({
      initialHref: `https://sealos.io/docs/?${badQuery}&utm_source=x#top`,
    });
    assert.equal(r.mod.consumeSiteLanguageChoice('en'), false, badQuery);
    assert.equal(
      r.localStorage.getItem(r.mod.PREFERRED_LANG_STORAGE_KEY),
      null,
      badQuery,
    );
    assert.equal(
      r.window.location.href,
      'https://sealos.io/docs/?utm_source=x#top',
      badQuery,
    );
  }

  const cookieOnly = createRuntime();
  cookieOnly.document.cookie = 'other=1; NEXT_LOCALE=en';
  assert.equal(
    cookieOnly.mod.shouldRecommendChineseSite({
      currentLocale: 'en',
      hostname: 'sealos.io',
      browserLanguages: ['zh-CN'],
    }),
    false,
  );
});

test('getChineseSiteHref always targets sealos.cn root, preserves query params, strips __sl_lang and #hash', () => {
  const { mod } = createRuntime();

  assert.equal(
    mod.getChineseSiteHref(
      'https://sealos.io/pricing?utm_source=google&tag=a&tag=b&__sl_lang=en#cost',
    ),
    'https://sealos.cn/?utm_source=google&tag=a&tag=b',
  );
  assert.equal(
    mod.getChineseSiteHref('https://sealos.io/docs/overview/intro/'),
    'https://sealos.cn/',
  );

  const customRuntime = createRuntime({
    cnSiteUrl: 'https://cn.example.com/custom/',
  });
  assert.equal(
    customRuntime.mod.getChineseSiteHref('https://sealos.io/blog?ref=1#h'),
    'https://cn.example.com/?ref=1',
  );
});

test('blocked localStorage and cookies never throw and keep in-memory fallback working', () => {
  const r = createRuntime({
    initialHref: 'https://sealos.io/pricing?__sl_lang=en&utm_source=test#top',
  });
  r.localStorage.getItem = r.localStorage.setItem = () => {
    throw new Error('Storage blocked');
  };
  Object.defineProperty(r.document, 'cookie', {
    get() {
      throw new Error('Cookies blocked');
    },
    set() {
      throw new Error('Cookies blocked');
    },
  });

  assert.equal(
    r.mod.shouldRecommendChineseSite({
      currentLocale: 'en',
      hostname: 'sealos.io',
      browserLanguages: ['zh-CN'],
    }),
    true,
  );
  assert.equal(r.mod.consumeSiteLanguageChoice('en'), true);
  assert.equal(
    r.window.location.href,
    'https://sealos.io/pricing?utm_source=test#top',
  );

  assert.doesNotThrow(() => r.mod.dismissCnRecommendation(1000));
  assert.equal(
    r.mod.shouldRecommendChineseSite({
      currentLocale: 'en',
      hostname: 'sealos.io',
      browserLanguages: ['zh-CN'],
      now: 1001,
    }),
    false,
  );
});

test('layout wiring and banner component source contracts match requirements', () => {
  const layoutSource = readFileSync(
    path.join(rootDir, 'app/[lang]/layout.tsx'),
    'utf8',
  );
  const bannerSource = readFileSync(
    path.join(rootDir, 'app/[lang]/chinese-site-banner.tsx'),
    'utf8',
  );
  const docsLayoutSource = readFileSync(
    path.join(rootDir, 'app/[lang]/docs/layout.tsx'),
    'utf8',
  );

  assert.match(layoutSource, /<ChineseSiteBanner lang=\{params\.lang\} \/>/);
  assert.doesNotMatch(bannerSource, /useSearchParams/);
  assert.ok(
    bannerSource.includes(
      'Sealos 中国区与国际区账号独立。前往中国站（sealos.cn）后，请使用中国区账号登录。',
    ),
  );
  assert.ok(bannerSource.includes('前往中国站'));
  assert.ok(bannerSource.includes('aria-label="关闭中文站推荐"'));
  assert.match(bannerSource, /cn_site_banner_go_cn/);
  assert.match(bannerSource, /cn_site_banner_dismiss/);
  assert.match(bannerSource, /trackButton/);
  assert.match(bannerSource, /trackCustom/);
  assert.match(docsLayoutSource, /--sealos-cn-banner-height/);
});
