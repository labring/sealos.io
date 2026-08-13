import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

const helperPath = resolve('lib/attribution-url.ts');
const helperSource = await readFile(helperPath, 'utf8');

assert.match(helperSource, /export function appendAttributionToUrl\(/);
assert.match(helperSource, /export function isSealosProductUrl\(/);

const callerBranch = helperSource.indexOf('encodedAttr?: string');
const runtimeBranch = helperSource.indexOf('runtimeWindow.__sealosAttribution?.encode?.()');
const pageBranch = helperSource.indexOf('searchParams.get(SEA_ATTR_PARAM)');
const storageBranch = helperSource.indexOf('getItem(LOCAL_STORAGE_KEY)');

assert.ok(callerBranch >= 0, 'caller attribution branch must exist');
assert.ok(runtimeBranch >= 0, 'runtime attribution branch must exist');
assert.ok(pageBranch >= 0, 'page attribution branch must exist');
assert.ok(storageBranch >= 0, 'local storage attribution branch must exist');
assert.ok(
  callerBranch < runtimeBranch &&
    runtimeBranch < pageBranch &&
    pageBranch < storageBranch,
  'attribution priority must be caller -> runtime -> page -> localStorage',
);

const helperCode = ts.transpileModule(helperSource, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2022,
  },
  }).outputText;
const { appendAttributionToUrl, isSealosProductUrl } = await import(
  `data:text/javascript;base64,${Buffer.from(helperCode).toString('base64')}`
);

assert.equal(typeof appendAttributionToUrl, 'function');
assert.equal(typeof isSealosProductUrl, 'function');

const authPath = resolve('hooks/use-auth-redirect.ts');
const authSource = await readFile(authPath, 'utf8');
assert.match(authSource, /from ['"]@\/lib\/attribution-url['"]/);
const builderStart = authSource.indexOf('export function buildAuthRedirectUrl');
const helperCall = authSource.indexOf('appendAttributionToUrl(target.toString())');
assert.ok(builderStart >= 0, 'buildAuthRedirectUrl source must exist');
assert.ok(helperCall > builderStart, 'buildAuthRedirectUrl must call appendAttributionToUrl');

const buttonHandlerSource = await readFile(resolve('hooks/use-button-handler.ts'), 'utf8');
assert.match(buttonHandlerSource, /from ['"]@\/lib\/attribution-url['"]/);
const handlerCall = buttonHandlerSource.indexOf('appendAttributionToUrl(');
const handlerWindowOpen = buttonHandlerSource.indexOf('window.open(');
const handlerLocationHref = buttonHandlerSource.indexOf('window.location.href');
const handlerRouterPush = buttonHandlerSource.indexOf('router.push(');
assert.ok(handlerCall >= 0, 'useButtonHandler must call appendAttributionToUrl');
assert.ok(
  handlerCall < handlerWindowOpen &&
    handlerCall < handlerLocationHref &&
    handlerCall < handlerRouterPush,
  'appendAttributionToUrl must run before navigation branches in useButtonHandler',
);

const buttonLinkSource = await readFile(resolve('components/ui/button-link.tsx'), 'utf8');
assert.match(buttonLinkSource, /from ['"]@\/lib\/attribution-url['"]/);
const buttonLinkCall = buttonLinkSource.indexOf('appendAttributionToUrl(');
const buttonLinkHref = buttonLinkSource.indexOf('href={renderedHref}');
assert.ok(buttonLinkCall >= 0, 'ButtonLink must call appendAttributionToUrl');
assert.ok(
  buttonLinkCall < buttonLinkHref,
  'ButtonLink must render the decorated href',
);

const attributionLinkSource = await readFile(
  resolve('components/ui/attribution-link.tsx'),
  'utf8',
);
assert.match(attributionLinkSource, /export function AttributionLink/);
assert.match(attributionLinkSource, /from ['"]@\/lib\/attribution-url['"]/);
const attributionLinkCall = attributionLinkSource.indexOf('appendAttributionToUrl(');
const attributionLinkHref = attributionLinkSource.indexOf('href={renderedHref}');
assert.ok(
  attributionLinkCall >= 0,
  'AttributionLink must call appendAttributionToUrl',
);
assert.ok(
  attributionLinkCall < attributionLinkHref,
  'AttributionLink must render the decorated href',
);

const appsLoaderSource = await readFile(resolve('config/apps-loader.ts'), 'utf8');
assert.match(appsLoaderSource, /from ['"]@\/lib\/attribution-url['"]/);
const getDeployUrlStart = appsLoaderSource.indexOf('export function getDeployUrl');
const getDeployUrlCall = appsLoaderSource.indexOf(
  'appendAttributionToUrl(',
  getDeployUrlStart,
);
assert.ok(getDeployUrlStart >= 0, 'getDeployUrl source must exist');
assert.ok(
  getDeployUrlCall > getDeployUrlStart,
  'getDeployUrl must return a decorated deploy URL',
);

const carouselCardSource = await readFile(
  resolve('app/[lang]/(home)/(new-home)/components/CarouselCard.tsx'),
  'utf8',
);
assert.match(carouselCardSource, /from ['"]@\/lib\/attribution-url['"]/);
const carouselHelperCall = carouselCardSource.indexOf('appendAttributionToUrl(');
const carouselRenderedHref = carouselCardSource.indexOf('href={renderedButtonLink}');
assert.ok(
  carouselHelperCall >= 0 && carouselHelperCall < carouselRenderedHref,
  'CarouselCard must render an attribution-aware buttonLink href',
);

const redirectSuggestSource = await readFile(
  resolve('components/redirectSuggest.tsx'),
  'utf8',
);
assert.match(redirectSuggestSource, /from ['"]@\/components\/ui\/attribution-link['"]/);
assert.match(
  redirectSuggestSource,
  /<AttributionLink[\s\S]*href=\{redirectDomain\}/,
  'RedirectSuggest must render through AttributionLink',
);

const brandCardSource = await readFile(
  resolve('new-components/SealosBrandCard.tsx'),
  'utf8',
);
assert.match(brandCardSource, /useAuthRedirect/);
assert.match(
  brandCardSource,
  /handleAuthRedirect\(\{\s*openapp:\s*getOpenBrainParam\(\)\s*\}\)/,
  'SealosBrandCard must use the attribution-aware auth redirect boundary',
);

const rawAnchorFiles = [
  'components/docs/Links.tsx',
  'app/[lang]/customers/components/hero.tsx',
  'app/[lang]/customers/components/call-to-action.tsx',
  'app/[lang]/customers/[slug]/page.tsx',
  'app/[lang]/products/databases/components/footerCta.tsx',
];
for (const file of rawAnchorFiles) {
  const source = await readFile(resolve(file), 'utf8');
  assert.match(
    source,
    /from ['"]@\/components\/ui\/attribution-link['"]/,
    `${file} must import AttributionLink`,
  );
  assert.match(
    source,
    /<AttributionLink[\s\S]*href=/,
    `${file} must render product anchors through AttributionLink`,
  );
}

const authFormProviderSource = await readFile(
  resolve('new-components/AuthForm/AuthFormProvider.tsx'),
  'utf8',
);
assert.match(authFormProviderSource, /from ['"]@\/lib\/attribution-url['"]/);
const authFormProviderCall = authFormProviderSource.indexOf(
  'appendAttributionToUrl(',
);
const authFormProviderHref = authFormProviderSource.indexOf(
  'window.location.href',
);
assert.ok(
  authFormProviderCall >= 0 && authFormProviderCall < authFormProviderHref,
  'AuthFormProvider must decorate the final verification redirect',
);

const selectMethodStepSource = await readFile(
  resolve('new-components/AuthForm/SelectMethodStep.tsx'),
  'utf8',
);
assert.match(selectMethodStepSource, /from ['"]@\/lib\/attribution-url['"]/);
const selectMethodStepCall = selectMethodStepSource.indexOf(
  'appendAttributionToUrl(',
);
const selectMethodStepHref = selectMethodStepSource.indexOf(
  'window.location.href',
);
assert.ok(
  selectMethodStepCall >= 0 && selectMethodStepCall < selectMethodStepHref,
  'SelectMethodStep must decorate OAuth redirects before navigation',
);

const googleOneTapPath = resolve('new-components/AuthForm/GoogleOneTap.tsx');
const googleOneTapSource = await readFile(googleOneTapPath, 'utf8');
assert.match(googleOneTapSource, /from ['"]@\/lib\/attribution-url['"]/);
assert.match(
  googleOneTapSource,
  /export function buildOneTapRedirectUrl/,
  'GoogleOneTap must expose its redirect builder for regression coverage',
);
const googleOneTapCall = googleOneTapSource.indexOf(
  'appendAttributionToUrl(target.toString())',
);
const googleOneTapHref = googleOneTapSource.indexOf('window.location.href');
assert.ok(
  googleOneTapCall >= 0 && googleOneTapCall < googleOneTapHref,
  'GoogleOneTap must decorate the final login redirect before navigation',
);

const deployModalSource = await readFile(
  resolve('new-components/DeployModal/DeployModalContext.tsx'),
  'utf8',
);
assert.match(deployModalSource, /buildAuthRedirectUrl\(deployParams\)/);
assert.match(deployModalSource, /window.location.href = urlString/);

const pricingFiles = [
  'app/[lang]/(home)/pricing/components/FreeTrialCard.tsx',
  'app/[lang]/(home)/pricing/components/PricingCard.tsx',
  'app/[lang]/(home)/pricing/components/MorePlans.tsx',
];
for (const file of pricingFiles) {
  const source = await readFile(resolve(file), 'utf8');
  assert.match(
    source,
    /from ['"]@\/lib\/attribution-url['"]/,
    `${file} must import appendAttributionToUrl`,
  );
  const helperCall = source.indexOf('appendAttributionToUrl(');
  const windowOpen = source.indexOf('window.open(');
  assert.ok(
    helperCall >= 0 && helperCall < windowOpen,
    `${file} must decorate the target before window.open`,
  );
}

const siteConfigSource = await readFile(resolve('config/site.ts'), 'utf8');
const oauth2Match = siteConfigSource.match(/oauth2Url:\s*'([^']+)'/);
assert.ok(oauth2Match, 'oauth2Url must exist in config/site.ts');
const oauth2Url = oauth2Match[1];

const authCode = ts.transpileModule(authSource, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;

const hookModule = { exports: {} };
const hookSandbox = {
  module: hookModule,
  exports: hookModule.exports,
  require(specifier) {
    if (specifier === 'react') {
      return { useCallback: (fn) => fn };
    }

    if (specifier === '@/config/site') {
      return { siteConfig: { oauth2Url } };
    }

    if (specifier === '@/lib/utils/shared-auth') {
      return { verifySharedAuth: async () => null };
    }

    if (specifier === '@/new-components/AuthForm/AuthFormContext') {
      return { useOpenAuthForm: () => () => {} };
    }

    if (specifier === '@/lib/attribution-url') {
      return { appendAttributionToUrl };
    }

    throw new Error(`Unexpected import: ${specifier}`);
  },
  console,
  URL,
  URLSearchParams,
};

hookSandbox.globalThis = hookSandbox;
hookSandbox.window = globalThis.window;
hookSandbox.document = globalThis.document;
vm.runInNewContext(authCode, hookSandbox, { filename: authPath });
const { buildAuthRedirectUrl } = hookModule.exports;

assert.equal(typeof buildAuthRedirectUrl, 'function');

const googleOneTapCode = ts.transpileModule(googleOneTapSource, {
  compilerOptions: {
    jsx: ts.JsxEmit.ReactJSX,
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;

const googleOneTapModule = { exports: {} };
const googleOneTapSandbox = {
  module: googleOneTapModule,
  exports: googleOneTapModule.exports,
  require(specifier) {
    if (specifier === 'next/script') {
      return { __esModule: true, default: () => null };
    }

    if (specifier === 'react') {
      return { useCallback: (fn) => fn };
    }

    if (specifier === 'react/jsx-runtime') {
      return { jsx: () => null };
    }

    if (specifier === '@/config/site') {
      return {
        appDomain: 'https://os.sealos.io',
        siteConfig: {
          googleOneTap: {
            clientId: 'test-client',
            enabled: true,
            loginEndpoint: '/api/auth/google/onetap',
            redirectUrl: 'https://os.sealos.io',
          },
        },
      };
    }

    if (specifier === '@/lib/attribution-url') {
      return { appendAttributionToUrl };
    }

    throw new Error(`Unexpected import: ${specifier}`);
  },
  console,
  fetch: async () => ({ json: async () => ({}) }),
  URL,
  URLSearchParams,
};

googleOneTapSandbox.globalThis = googleOneTapSandbox;
googleOneTapSandbox.window = globalThis.window;
vm.runInNewContext(googleOneTapCode, googleOneTapSandbox, {
  filename: googleOneTapPath,
});
const { buildOneTapRedirectUrl } = googleOneTapModule.exports;

assert.equal(typeof buildOneTapRedirectUrl, 'function');

const previousWindow = globalThis.window;
const previousDocument = globalThis.document;
const previousLocalStorage = globalThis.localStorage;

function setBrowserFixtures({
  href,
  runtimeAttr,
  pageAttr,
  storedAttr,
}) {
  const windowLocation = { href };
  const documentLocation = { href };
  const storage = {
    getItem(key) {
      return key === 'sealos_attr_v2' ? storedAttr ?? null : null;
    },
  };

  globalThis.window = {
    location: windowLocation,
    localStorage: storage,
    __sealosAttribution:
      runtimeAttr === undefined
        ? undefined
        : {
            encode() {
              return runtimeAttr;
            },
          },
  };
  globalThis.document = {
    location: documentLocation,
  };
  globalThis.localStorage = storage;

  if (typeof pageAttr === 'string') {
    globalThis.window.location.href = new URL(
      `https://sealos.io/?sea_attr=${encodeURIComponent(pageAttr)}`,
    ).toString();
    globalThis.document.location.href = globalThis.window.location.href;
  }
}

function restoreBrowserFixtures() {
  if (previousWindow === undefined) {
    delete globalThis.window;
  } else {
    globalThis.window = previousWindow;
  }

  if (previousDocument === undefined) {
    delete globalThis.document;
  } else {
    globalThis.document = previousDocument;
  }

  if (previousLocalStorage === undefined) {
    delete globalThis.localStorage;
  } else {
    globalThis.localStorage = previousLocalStorage;
  }
}

try {
  assert.equal(isSealosProductUrl('https://os.sealos.io/'), true);
  assert.equal(isSealosProductUrl('https://usw-1.sealos.io/'), true);
  assert.equal(isSealosProductUrl('https://usw.sealos.io/'), true);
  assert.equal(isSealosProductUrl('https://template.sealos.io/'), true);
  assert.equal(isSealosProductUrl('https://sealos.io/'), false);
  assert.equal(isSealosProductUrl('https://www.sealos.io/'), false);
  assert.equal(isSealosProductUrl('https://example.com/'), false);
  assert.equal(isSealosProductUrl('/docs'), false);
  assert.equal(isSealosProductUrl('mailto:hello@sealos.io'), false);
  assert.equal(isSealosProductUrl('tel:+8613800138000'), false);

  const decorated = appendAttributionToUrl(
    'https://os.sealos.io/?openapp=system-brain#x',
    'abc',
  );
  const decoratedUrl = new URL(decorated);
  assert.equal(decoratedUrl.searchParams.get('openapp'), 'system-brain');
  assert.equal(decoratedUrl.searchParams.get('sea_attr'), 'abc');
  assert.equal(decoratedUrl.hash, '#x');

  const refreshed = appendAttributionToUrl(
    'https://os.sealos.io/?sea_attr=old&openapp=system-brain',
    'new',
  );
  const refreshedUrl = new URL(refreshed);
  assert.equal(refreshedUrl.searchParams.get('openapp'), 'system-brain');
  assert.equal(refreshedUrl.searchParams.get('sea_attr'), 'new');
  assert.equal(refreshedUrl.searchParams.getAll('sea_attr').length, 1);

  const noChangeInputs = [
    'https://sealos.io/?sea_attr=old',
    'https://www.sealos.io/?sea_attr=old',
    'https://example.com/?sea_attr=old',
    '/pricing?sea_attr=old',
    'not a url',
    'mailto:hello@sealos.io',
    'tel:+8613800138000',
  ];
  for (const input of noChangeInputs) {
    assert.equal(appendAttributionToUrl(input, 'new'), input);
  }

  setBrowserFixtures({
    href: 'https://sealos.io/?sea_attr=page',
    runtimeAttr: 'runtime',
    pageAttr: 'page',
    storedAttr: 'stored',
  });
  assert.equal(
    appendAttributionToUrl('https://os.sealos.io/?openapp=system-brain'),
    'https://os.sealos.io/?openapp=system-brain&sea_attr=runtime',
  );

  setBrowserFixtures({
    href: 'https://sealos.io/?sea_attr=page',
    storedAttr: 'stored',
  });
  assert.equal(
    appendAttributionToUrl('https://os.sealos.io/?openapp=system-brain'),
    'https://os.sealos.io/?openapp=system-brain&sea_attr=page',
  );

  setBrowserFixtures({
    href: 'https://sealos.io/',
    storedAttr: 'stored',
  });
  assert.equal(
    appendAttributionToUrl('https://os.sealos.io/?openapp=system-brain'),
    'https://os.sealos.io/?openapp=system-brain&sea_attr=stored',
  );

  setBrowserFixtures({
    href: 'https://sealos.io/',
  });
  assert.equal(
    appendAttributionToUrl('https://os.sealos.io/?openapp=system-brain'),
    'https://os.sealos.io/?openapp=system-brain',
  );

  setBrowserFixtures({
    href: 'https://sealos.io/?sea_attr=page',
    runtimeAttr: 'runtime',
  });
  assert.equal(
    buildAuthRedirectUrl({ openapp: 'system-brain' }),
    `${oauth2Url}?openapp=system-brain&sea_attr=runtime`,
  );

  const oneTapRedirect = new URL(
    buildOneTapRedirectUrl({ token: 'test-token', needInit: true }),
  );
  assert.equal(oneTapRedirect.pathname, '/oauth');
  assert.equal(oneTapRedirect.searchParams.get('token'), 'test-token');
  assert.equal(oneTapRedirect.searchParams.get('switchRegionType'), 'INIT');
  assert.equal(
    oneTapRedirect.searchParams.get('workspaceName'),
    'My Workspace',
  );
  assert.equal(oneTapRedirect.searchParams.get('sea_attr'), 'runtime');

  setBrowserFixtures({ href: 'https://sealos.io/' });
  const unattributedOneTapRedirect = new URL(
    buildOneTapRedirectUrl({ token: 'test-token' }),
  );
  assert.equal(unattributedOneTapRedirect.pathname, '/oauth');
  assert.equal(
    unattributedOneTapRedirect.searchParams.get('token'),
    'test-token',
  );
  assert.equal(unattributedOneTapRedirect.searchParams.has('sea_attr'), false);
} finally {
  restoreBrowserFixtures();
}

console.log('Verified attribution URL helper behavior and source priority.');
