import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { compileFunction } from 'node:vm';
import ts from 'typescript';

const appStoreDir = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(appStoreDir, 'app-store-seo.ts'), 'utf8');
const sitemapSource = readFileSync(
  join(appStoreDir, '..', '..', '..', 'sitemap.ts'),
  'utf8',
);
const require = createRequire(import.meta.url);
const root = join(appStoreDir, '..', '..', '..', '..');
const modules = new Map();
function loadTypeScript(path) {
  if (modules.has(path)) return modules.get(path);
  const exports = {};
  modules.set(path, exports);
  const code = ts.transpileModule(readFileSync(path, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      esModuleInterop: true,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  compileFunction(code, ['exports', 'require'], { filename: path })(
    exports,
    (name) =>
      name.startsWith('@/')
        ? name.endsWith('.json')
          ? require(join(root, name.slice(2)))
          : loadTypeScript(join(root, `${name.slice(2)}.ts`))
        : require(name),
  );
  return exports;
}
const seo = loadTypeScript(join(appStoreDir, 'app-store-seo.ts'));
const apps = JSON.parse(readFileSync(join(root, 'config/apps.json'), 'utf8'));

test('all template identities resolve their local input snapshot without an API request', async (t) => {
  const sources = JSON.parse(
    readFileSync(join(root, 'config/template-sources.json'), 'utf8'),
  );
  const { loadTemplateSource } = loadTypeScript(
    join(root, 'hooks/use-template-source.ts'),
  );
  const fetch = t.mock.method(globalThis, 'fetch', async () => {
    throw new Error('Unexpected template API fallback');
  });
  for (const app of apps) {
    const data = await loadTemplateSource(app.templateName || app.slug);
    assert.deepEqual(data?.source.inputs, sources[app.slug], app.slug);
    assert.ok(Array.isArray(data?.source.inputs), app.slug);
  }
  assert.equal(fetch.mock.callCount(), 0);
});

test('legacy LobeChat routes retain permanent redirects across hosting targets', () => {
  const vercel = JSON.parse(readFileSync(join(root, 'vercel.json'), 'utf8'));
  const cloudflare = readFileSync(join(root, 'public/_redirects'), 'utf8');
  const nginx = readFileSync(join(root, 'config/nginx.conf'), 'utf8');
  const location = new RegExp(nginx.match(/location ~ (\S+) \{/)[1]);
  assert.match(nginx, /return 308 \/products\/app-store\/lobehub\//);
  assert.match(
    readFileSync(join(root, 'Dockerfile'), 'utf8'),
    /COPY config\/nginx.conf \/etc\/nginx\/conf.d\/default.conf/,
  );
  for (const slug of ['lobe-chat', 'lobe-chat-db']) {
    for (const suffix of ['', '/']) {
      const source = `/products/app-store/${slug}${suffix}`;
      assert.ok(
        vercel.redirects.some(
          (rule) =>
            rule.source === source &&
            rule.destination === '/products/app-store/lobehub/' &&
            rule.permanent,
        ),
      );
      assert.ok(
        cloudflare
          .split('\n')
          .includes(`${source} /products/app-store/lobehub/ 308`),
      );
      assert.ok(location.test(source));
      assert.ok(location.test(`/en${source}`));
    }
  }
  assert.equal(location.test('/products/app-store/lobehub/'), false);
});

test('README app links use canonical paths and preserve query strings and fragments', () => {
  assert.equal(
    seo.normalizeAppStoreLink(
      'https://sealos.io/en/products/app-store/N8N?ref=guide#setup',
    ),
    'https://sealos.io/products/app-store/n8n/?ref=guide#setup',
  );
  assert.equal(
    seo.normalizeAppStoreLink('https://sealos.io/products/app-store'),
    'https://sealos.io/products/app-store/',
  );
  for (const href of [
    'https://github.com/example/repo',
    'https://sealos.run/products/app-store/n8n',
    'https://sealos.io/docs',
    'mailto:support@example.com',
  ]) {
    assert.equal(seo.normalizeAppStoreLink(href), href);
  }
});

test('app store SEO module targets one-click self-hosted Kubernetes template intent', () => {
  assert.match(source, /one-click app deployment/);
  assert.match(source, /self-hosted app store/);
  assert.match(source, /Kubernetes app templates/);
  assert.match(
    source,
    /one-click self-hosted application template marketplace/,
  );
});

test('app store SEO module generates collection and software entities', () => {
  assert.match(source, /'@type': 'CollectionPage'/);
  assert.match(source, /'@type': 'ItemList'/);
  assert.match(source, /generateAppStoreSoftwareSchema/);
  assert.match(source, /generateAppDetailSoftwareSchema/);
  assert.match(source, /installUrl/);
  assert.match(source, /SoftwareApplication/);
});

test('app detail metadata uses canonical lowercase URLs and SEO-oriented titles', () => {
  assert.equal(seo.getAppDetailPathname('N8N'), '/products/app-store/n8n');
  for (const app of apps) {
    const metadata = seo.getAppDetailMetadata(app);
    assert.equal(metadata.title, `${app.name} Hosting & Deployment`);
    assert.ok(metadata.description.length > 0);
    assert.ok(metadata.description.length <= 159);
  }
});

test('software entities preserve deployment identity without invented offers or features', () => {
  for (const app of apps) {
    const schema = seo.generateAppDetailSoftwareSchema(app, 'en');
    assert.equal(
      schema.url,
      `https://sealos.io/products/app-store/${app.slug}/`,
    );
    assert.ok(
      schema.installUrl.endsWith(
        encodeURIComponent(app.templateName || app.slug),
      ),
    );
    for (const field of [
      'offers',
      'featureList',
      'aggregateRating',
      'review',
    ]) {
      assert.equal(field in schema, false, `${app.slug}: unsupported ${field}`);
    }
    assert.equal(new Set(schema.sameAs).size, schema.sameAs.length);
  }
});

test('software categories reflect purpose rather than assigning all apps to developer tools', () => {
  assert.equal(
    seo.getAppApplicationCategory({ category: 'Tools', tags: ['game'] }),
    'GameApplication',
  );
  assert.equal(
    seo.getAppApplicationCategory({ category: 'AI', tags: ['ai', 'low-code'] }),
    'BusinessApplication',
  );
  assert.equal(
    seo.getAppApplicationCategory({
      category: 'Monitoring',
      tags: ['monitor'],
    }),
    'DeveloperApplication',
  );
  assert.equal(
    seo.getAppApplicationCategory({ category: 'AI', tags: ['ai'] }),
    undefined,
  );
});

test('sitemap emits canonical app detail paths through the SEO helper', () => {
  assert.match(sitemapSource, /getAppDetailPathname/);
  assert.match(sitemapSource, /getAppDetailPathname\(app\.slug\)/);
  assert.doesNotMatch(sitemapSource, /products\/app-store\/\$\{app\.slug\}/);
});
