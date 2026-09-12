import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { compileFunction } from 'node:vm';
import * as docgen from 'fumadocs-docgen';
import * as fumadocsConfig from 'fumadocs-mdx/config';
import ts from 'typescript';

const require = createRequire(import.meta.url);

function loadTypeScript(path, imports = {}) {
  const filename = fileURLToPath(new URL(path, import.meta.url));
  const compiled = ts.transpileModule(readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  const exports = {};
  compileFunction(compiled, ['exports', 'require'], { filename })(
    exports,
    (id) => (Object.hasOwn(imports, id) ? imports[id] : require(id)),
  );
  return exports;
}

test('blog seoTitle overrides only the search title and falls back for blank values', async () => {
  const { blog } = loadTypeScript('../source.config.ts', {
    'fumadocs-mdx/config': fumadocsConfig,
    'fumadocs-docgen': docgen,
    './lib/remark/remark-mermaid': loadTypeScript(
      '../lib/remark/remark-mermaid.ts',
    ),
  });
  const page = { slugs: ['example'], data: undefined };
  const { generateBlogMetadata } = loadTypeScript('../lib/utils/metadata.ts', {
    '@/config/site': {
      siteConfig: { name: 'Sealos', url: { base: 'https://sealos.io' } },
      blogAuthors: {},
    },
    '@/lib/source': { blog: { getPage: () => page } },
    '@/lib/i18n': {},
    '@/lib/utils/blog-utils': {
      getPageCategory: () => 'app-deployment',
      getBlogImage: () => '/thumbnail.png',
    },
    '@/lib/utils/tutorial-metadata': {},
    'next/navigation': {
      notFound: () => assert.fail('Unexpected missing page'),
    },
  });
  const frontmatter = {
    title: 'A Detailed Article Title',
    description: 'An example article.',
    date: '2025-11-20',
  };
  let originalMetadata;

  for (const [seoTitle, expectedTitle] of [
    [undefined, frontmatter.title],
    ['', frontmatter.title],
    [' \t\n ', frontmatter.title],
    ['Short Search Title', 'Short Search Title'],
    ['  Short Search Title \n', 'Short Search Title'],
  ]) {
    page.data = blog.schema.parse({ ...frontmatter, seoTitle });
    assert.equal(page.data.seoTitle, seoTitle?.trim());
    const metadata = await generateBlogMetadata({
      params: Promise.resolve({ slug: 'example' }),
    });
    assert.equal(metadata.title.absolute, `${expectedTitle} | Sealos Blog`);
    assert.equal(
      metadata.openGraph.title,
      `${frontmatter.title} | Sealos Blog`,
    );
    assert.equal(metadata.twitter.title, `${frontmatter.title} | Sealos Blog`);
    const sharedMetadata = { ...metadata, title: undefined };
    originalMetadata ??= sharedMetadata;
    assert.deepEqual(sharedMetadata, originalMetadata);
  }

  assert.equal(
    blog.schema.safeParse({ ...frontmatter, seoTitle: 123 }).success,
    false,
  );
});
