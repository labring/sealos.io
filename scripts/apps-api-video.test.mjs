import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { compileFunction } from 'node:vm';
import ts from 'typescript';
import { convertTemplateToAppConfig } from './generate-apps-api.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const modules = new Map();

// Run the real route, loaders, and configuration with the installed Node 20 compiler.
function loadTypeScript(filename) {
  if (modules.has(filename)) return modules.get(filename);
  const exports = {};
  modules.set(filename, exports);
  const require = createRequire(filename);
  const compiled = ts.transpileModule(readFileSync(filename, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  }).outputText;
  compileFunction(compiled, ['exports', 'require'], { filename })(
    exports,
    (id) => {
      if (id.startsWith('@/') || id.startsWith('.')) {
        const path = id.startsWith('@/')
          ? resolve(root, id.slice(2))
          : resolve(dirname(filename), id);
        return path.endsWith('.json')
          ? require(path)
          : loadTypeScript(`${path}.ts`);
      }
      return require(id);
    },
  );
  return exports;
}

const route = loadTypeScript(
  resolve(root, 'app/api/apps/[[...lang]]/route.ts'),
);

test('static hosts resolve the default Apps API to the exported English response', () => {
  const vercel = JSON.parse(readFileSync(resolve(root, 'vercel.json'), 'utf8'));
  const cloudflare = readFileSync(resolve(root, 'public/_redirects'), 'utf8')
    .split('\n')
    .map((line) => line.trim().split(/\s+/));
  for (const path of ['/api/apps', '/api/apps/']) {
    assert.equal(
      vercel.rewrites.find((rule) => rule.source === path)?.destination,
      '/api/apps/en',
    );
    assert.deepEqual(
      cloudflare.find(([source]) => source === path),
      [path, '/api/apps/en', '200'],
    );
  }
});

test('Apps API and catalog conversion retain the same optional Template Video', async (t) => {
  const values = [
    [
      '  https://www.youtube.com/watch?v=-tuMrj63-6g\n',
      'https://www.youtube.com/watch?v=-tuMrj63-6g',
    ],
    ['https://youtu.be/x-NrQq3C84Q', 'https://youtu.be/x-NrQq3C84Q'],
    [undefined, undefined],
    ['', undefined],
    [' \t\n ', undefined],
    [123, undefined],
    [{ url: 'https://youtu.be/x-NrQq3C84Q' }, undefined],
    ['malformed', 'malformed'],
    [
      'https://foreign.example/watch?v=-tuMrj63-6g',
      'https://foreign.example/watch?v=-tuMrj63-6g',
    ],
  ];
  const templates = values.map(([youtube], index) => ({
    metadata: { name: `video-${index}` },
    spec: { title: `Video ${index}`, icon: '/icons/default.svg', youtube },
  }));
  templates.push(
    {
      metadata: { name: 'draft' },
      spec: { draft: true, youtube: values[1][0] },
    },
    {
      metadata: { name: 'localized' },
      spec: { locale: 'zh', youtube: values[1][0] },
    },
  );
  t.mock.method(globalThis, 'fetch', async () =>
    Response.json({
      code: 200,
      data: { templates },
    }),
  );
  for (const params of await route.generateStaticParams()) {
    const response = await route.GET(new Request('http://localhost/api/apps'), {
      params,
    });
    const data = await response.json();
    assert.equal(response.status, 200);
    assert.equal(data.language, params.lang?.[0] || 'en');
    assert.equal(data.apps.length, values.length);
    for (const [index, [, expected]] of values.entries()) {
      const catalog = await convertTemplateToAppConfig(templates[index]);
      const api = data.apps.find((app) => app.slug === `video-${index}`);
      assert.equal(api.youtube, expected);
      assert.equal(catalog.youtube, expected);
    }
  }
});

test('Apps API failure retains static catalog videos and template identity in every locale', async (t) => {
  t.mock.method(
    globalThis,
    'fetch',
    async () => new Response('', { status: 503 }),
  );
  t.mock.method(console, 'error', () => {});
  t.mock.method(console, 'log', () => {});
  const catalog = JSON.parse(
    readFileSync(resolve(root, 'config/apps.json'), 'utf8'),
  );
  for (const params of await route.generateStaticParams()) {
    const response = await route.GET(new Request('http://localhost/api/apps'), {
      params,
    });
    const { apps } = await response.json();
    assert.equal(apps.length, catalog.length);
    assert.deepEqual(
      apps.map(({ slug, templateName, youtube }) => ({
        slug,
        templateName,
        youtube,
      })),
      catalog.map(({ slug, templateName, youtube }) => ({
        slug,
        templateName,
        youtube,
      })),
    );
  }
});
