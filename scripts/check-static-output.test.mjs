import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  parseCloudflareHeaders,
  parseCloudflareRedirects,
  parseVercelHeaders,
  shouldInspectOut,
  validateNativeArtifactStatus,
  validateHeaderParity,
  validateOutArtifacts,
  validateRedirectParity,
  validateStaticOutput,
} from './check-static-output.js';

const PHASE10_SOURCES = [
  'app/sitemap.ts',
  'app/sitemap-ai-faq.ts',
  'app/rss.xml/route.ts',
  'app/sitemap-index.xml/route.ts',
  'app/llms.txt/route.ts',
  'app/api/search/route.ts',
  'app/api/robots/route.ts',
  'app/api/apps/[[...lang]]/route.ts',
  'app/api/og/route.ts',
  'app/api/blog/[lang]/[slug]/thumbnail/[format]/route.ts',
  'app/api/abuse/verify-turnstile/route.ts',
];

test('header parsers normalize Vercel and Cloudflare immutable cache rules', () => {
  const vercel = parseVercelHeaders({
    headers: [
      {
        source: '/mtc.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/script.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ],
  });
  const cloudflare = parseCloudflareHeaders(`
/mtc.js
  Cache-Control: public, max-age=31536000, immutable

/api/script.js
  Cache-Control: public, max-age=31536000, immutable
`);

  assert.deepEqual(validateHeaderParity(vercel, cloudflare).failures, []);
});

test('redirect parser validates robots, language routing, and Vercel parity', () => {
  const redirects = parseCloudflareRedirects(`
# en rewrite
/en/* /:splat 302

# robots.txt rewrite
/robots.txt /api/robots 200

# Vercel redirect parity
/docs/guides/fundamentals https://sealos.io/docs/guides/devbox/ 308
`);
  const vercelRedirects = [
    {
      source: '/docs/guides/fundamentals',
      destination: 'https://sealos.io/docs/guides/devbox/',
      permanent: true,
    },
  ];

  assert.deepEqual(
    validateRedirectParity(vercelRedirects, redirects).failures,
    [],
  );
});

test('static output source checks pass with out caveat when build gate is closed', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'phase9-static-source-'));

  try {
    await mkdir(join(dir, 'public'), { recursive: true });
    await writeFile(
      join(dir, 'vercel.json'),
      JSON.stringify(
        {
          headers: [
            {
              source: '/mtc.js',
              headers: [
                {
                  key: 'Cache-Control',
                  value: 'public, max-age=31536000, immutable',
                },
              ],
            },
            {
              source: '/api/script.js',
              headers: [
                {
                  key: 'Cache-Control',
                  value: 'public, max-age=31536000, immutable',
                },
              ],
            },
          ],
          redirects: [
            {
              source: '/docs/guides/fundamentals',
              destination: 'https://sealos.io/docs/guides/devbox/',
              permanent: true,
            },
          ],
        },
        null,
        2,
      ),
    );
    await writeFile(
      join(dir, 'public/_headers'),
      [
        '/mtc.js',
        '  Cache-Control: public, max-age=31536000, immutable',
        '',
        '/api/script.js',
        '  Cache-Control: public, max-age=31536000, immutable',
      ].join('\n'),
    );
    await writeFile(
      join(dir, 'public/_redirects'),
      [
        '/en/* /:splat 302',
        '/robots.txt /api/robots 200',
        '/docs/guides/fundamentals https://sealos.io/docs/guides/devbox/ 308',
      ].join('\n'),
    );
    await writeFile(
      join(dir, 'next.config.mjs'),
      "const nextConfig = { output: 'export', trailingSlash: true, images: { unoptimized: true } }; export default nextConfig;\n",
    );
    await writeFile(
      join(dir, 'package.json'),
      JSON.stringify({ scripts: { build: 'next build' } }),
    );
    await writePhase10PolicyFixture(dir);
    await writeNativePolicyFixture(dir);

    const result = validateStaticOutput({ rootDir: dir, env: {} });

    assert.equal(shouldInspectOut({ rootDir: dir, env: {} }), false);
    assert.equal(result.out.status, 'SKIPPED_WITH_CAVEAT');
    assert.equal(result.nativeArtifacts.status, 'SKIPPED_WITH_CAVEAT');
    assert.match(result.nativeArtifacts.reason, /out is absent/);
    assert.equal(result.routePolicy.status, 'PASS');
    assert.equal(result.routePolicy.out.status, 'SKIPPED_WITH_CAVEAT');
    assert.deepEqual(result.failures, []);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('validateStaticOutput includes Phase 10 route-policy result', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'phase10-static-compose-'));

  try {
    await mkdir(join(dir, 'public'), { recursive: true });
    await writeFile(
      join(dir, 'vercel.json'),
      JSON.stringify({
        headers: [
          {
            source: '/mtc.js',
            headers: [
              {
                key: 'Cache-Control',
                value: 'public, max-age=31536000, immutable',
              },
            ],
          },
          {
            source: '/api/script.js',
            headers: [
              {
                key: 'Cache-Control',
                value: 'public, max-age=31536000, immutable',
              },
            ],
          },
        ],
        redirects: [],
      }),
    );
    await writeFile(
      join(dir, 'public/_headers'),
      [
        '/mtc.js',
        '  Cache-Control: public, max-age=31536000, immutable',
        '',
        '/api/script.js',
        '  Cache-Control: public, max-age=31536000, immutable',
      ].join('\n'),
    );
    await writeFile(
      join(dir, 'public/_redirects'),
      ['/en/* /:splat 302', '/robots.txt /api/robots 200'].join('\n'),
    );
    await writeFile(
      join(dir, 'next.config.mjs'),
      "const nextConfig = { output: 'export', trailingSlash: true, images: { unoptimized: true } }; export default nextConfig;\n",
    );
    await writeFile(
      join(dir, 'package.json'),
      JSON.stringify({ scripts: { build: 'next build' } }),
    );
    await writePhase10PolicyFixture(dir);
    await writeNativePolicyFixture(dir);

    const result = validateStaticOutput({ rootDir: dir, env: {} });

    assert.equal(result.status, 'PASS');
    assert.equal(result.routePolicy.status, 'PASS');
    assert.equal(result.routePolicy.policy.rows.length, PHASE10_SOURCES.length);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('native artifact status checks source and out directories only when present', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'phase12-native-artifacts-'));

  try {
    await writeNativePolicyFixture(dir);

    let result = validateNativeArtifactStatus({ rootDir: dir, env: {} });
    assert.equal(result.status, 'SKIPPED_WITH_CAVEAT');
    assert.match(result.reason, /source artifacts are absent and out is absent/);

    await mkdir(join(dir, 'public/generated/native-images/homepage-og'), {
      recursive: true,
    });
    await writeFile(
      join(
        dir,
        'public/generated/native-images/homepage-og/homepage-og-renderer-v1-homepage-og-template-v1-native-fonts-2026-06-12-1200x630@1x.webp',
      ),
      'webp',
    );

    result = validateNativeArtifactStatus({ rootDir: dir, env: {} });
    assert.equal(result.status, 'PASS');
    assert.equal(result.source.exists, true);
    assert.equal(result.source.firstFile.endsWith('.webp'), true);
    assert.equal(result.out.status, 'SKIPPED_WITH_CAVEAT');

    await mkdir(join(dir, 'out'), { recursive: true });

    result = validateNativeArtifactStatus({ rootDir: dir, env: {} });
    assert.equal(result.status, 'SKIPPED_WITH_CAVEAT');
    assert.match(result.reason, /without native generated images/);
    assert.deepEqual(result.failures, []);

    await mkdir(join(dir, 'out/generated/native-images/homepage-og'), {
      recursive: true,
    });
    await writeFile(
      join(
        dir,
        'out/generated/native-images/homepage-og/homepage-og-renderer-v1-homepage-og-template-v1-native-fonts-2026-06-12-1200x630@1x.webp',
      ),
      'webp',
    );

    result = validateNativeArtifactStatus({ rootDir: dir, env: {} });
    assert.equal(result.status, 'PASS');
    assert.equal(result.out.exists, true);
    assert.equal(result.out.firstFile.endsWith('.webp'), true);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

async function writePhase10PolicyFixture(dir) {
  await mkdir(join(dir, 'config'), { recursive: true });
  for (const source of PHASE10_SOURCES) {
    await mkdir(join(dir, source, '..'), { recursive: true });
    await writeFile(join(dir, source), 'export const revalidate = false;\n');
  }
  const policy = JSON.parse(
    await readFile('config/static-export-route-policy.json', 'utf8'),
  );
  await writeFile(
    join(dir, 'config/static-export-route-policy.json'),
    JSON.stringify(policy, null, 2),
  );
}

async function writeNativePolicyFixture(dir) {
  await mkdir(join(dir, 'config'), { recursive: true });
  const policy = JSON.parse(
    await readFile('config/native-rendering-policy.json', 'utf8'),
  );
  await writeFile(
    join(dir, 'config/native-rendering-policy.json'),
    JSON.stringify(policy, null, 2),
  );
}

test('validateOutArtifacts verifies representative static export files', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'phase9-out-'));
  const outDir = join(dir, 'out');

  try {
    await mkdir(join(outDir, 'en/products/app-store'), { recursive: true });
    await mkdir(join(outDir, 'products/app-store'), { recursive: true });
    await mkdir(join(outDir, '_next/static/chunks'), { recursive: true });
    await mkdir(join(outDir, 'images/apps'), { recursive: true });
    await writeFile(join(outDir, 'index.html'), '');
    await writeFile(join(outDir, 'en/index.html'), '');
    await writeFile(join(outDir, 'sitemap.xml'), '');
    await writeFile(join(outDir, 'rss.xml'), '');
    await writeFile(join(outDir, 'robots.txt'), '');
    await writeFile(join(outDir, 'llms.txt'), '');
    await writeFile(join(outDir, 'en/products/app-store/index.html'), '');
    await writeFile(join(outDir, 'products/app-store/index.html'), '');
    await writeFile(join(outDir, '_next/static/chunks/app.js'), '');
    await writeFile(join(outDir, 'images/apps/example.png'), '');

    const result = validateOutArtifacts({ outDir });

    assert.deepEqual(result.missingRequired, []);
    assert.equal(result.representativeAssets.length, 2);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
