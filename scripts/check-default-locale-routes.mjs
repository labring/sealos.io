import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  createDefaultLocaleDevRewrites,
  defaultLocaleDevRouteSources,
} from '../config/default-locale-routes.mjs';

const DEFAULT_LOCALE = 'en';
const BROAD_CATCH_ALL_SOURCE = '/:path*';
const expectedSources = new Set([
  '/',
  '/abuse',
  '/ai-quick-reference',
  '/ai-quick-reference/:path*',
  '/blog',
  '/blog/:path*',
  '/comparison',
  '/comparison/:path*',
  '/contact',
  '/customers',
  '/customers/:path*',
  '/docs',
  '/docs/:path*',
  '/legal/:path*',
  '/pricing',
  '/products/:path*',
  '/sealos-skills',
  '/solutions/:path*',
]);
const layoutOnlyRoutePrefixes = ['/legal', '/products', '/solutions'];

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function assertRewriteShape() {
  const rewrites = createDefaultLocaleDevRewrites(DEFAULT_LOCALE);
  const sources = rewrites.map((rewrite) => rewrite.source);

  assert.deepEqual(
    new Set(defaultLocaleDevRouteSources),
    expectedSources,
    'default locale route source manifest must match expected unprefixed routes',
  );
  assert.deepEqual(
    new Set(sources),
    expectedSources,
    'default locale dev rewrites must cover every expected unprefixed route',
  );
  assert.equal(
    sources.includes(BROAD_CATCH_ALL_SOURCE),
    false,
    'default locale dev rewrites must stay route-scoped',
  );
  for (const source of layoutOnlyRoutePrefixes) {
    assert.equal(
      sources.includes(source),
      false,
      `${source} must rely on child-route rewrites because the route has no root page`,
    );
  }

  for (const rewrite of rewrites) {
    assert.equal(
      rewrite.destination.startsWith(`/${DEFAULT_LOCALE}`),
      true,
      `${rewrite.source} must rewrite into the default locale route tree`,
    );
    assert.equal(
      rewrite.source.startsWith(`/${DEFAULT_LOCALE}`),
      false,
      `${rewrite.source} must keep locale-prefixed routes untouched`,
    );
    assert.equal(
      rewrite.source.startsWith('/zh-cn'),
      false,
      `${rewrite.source} must keep zh-cn routes untouched`,
    );
  }

  assert.deepEqual(
    rewrites.find((rewrite) => rewrite.source === '/'),
    { source: '/', destination: `/${DEFAULT_LOCALE}` },
    'home page must rewrite to the default locale without issuing a redirect',
  );
}

function assertNextConfigUsesSharedRewrites() {
  const nextConfig = readFileSync('next.config.mjs', 'utf8');

  assert.match(
    nextConfig,
    /from '\.\/config\/default-locale-routes\.mjs'/,
    'next.config.mjs must import the shared default locale rewrite helper',
  );
  assert.match(
    nextConfig,
    /createDefaultLocaleDevRewrites\(defaultLocale\)/,
    'next.config.mjs must use the shared helper for development rewrites',
  );
  assert.match(
    nextConfig,
    /process\.env\.NODE_ENV !== 'development'/,
    'default locale rewrites must stay scoped to development mode',
  );
}

function assertPackageScript() {
  const packageJson = readJson('package.json');

  assert.equal(
    packageJson.scripts?.['default-locale:check'],
    'node scripts/check-default-locale-routes.mjs',
    'package.json must expose the default locale route check',
  );
}

assertRewriteShape();
assertNextConfigUsesSharedRewrites();
assertPackageScript();

console.log('[default-locale-routes] PASS');
