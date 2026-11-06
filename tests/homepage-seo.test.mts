import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { getHomeCopy } from '../app/[lang]/(desktop)/content.ts';

const root = process.cwd();
const readSource = (filePath: string) =>
  readFileSync(path.join(root, filePath), 'utf8');

// Google shows about 60 characters of a title and 155 of a description.
const TITLE_SUFFIX = ' | Sealos';
const MAX_TITLE = 60;
const MAX_DESCRIPTION = 155;

test('homepage title and description fit search result snippets', () => {
  for (const lang of ['en', 'zh-cn'] as const) {
    const { meta } = getHomeCopy(lang);
    assert.ok(
      meta.title.length + TITLE_SUFFIX.length <=
        MAX_TITLE + TITLE_SUFFIX.length,
      `${lang} title is ${meta.title.length} characters`,
    );
    assert.ok(
      meta.description.length <= MAX_DESCRIPTION,
      `${lang} description is ${meta.description.length} characters`,
    );
  }
});

test('homepage English title leads with a searched phrase, not the category', () => {
  const { meta } = getHomeCopy('en');
  assert.match(meta.title, /^Deploy /);
  assert.match(meta.title, /Ops Agent$/);
});

test('every FAQ answer is rendered into the HTML', () => {
  const source = readSource('app/[lang]/(desktop)/sections/faq.tsx');
  assert.match(source, /<Accordion\.Content\s+forceMount/);
});

test('homepage emits FAQPage structured data and its own share image', () => {
  const source = readSource('app/[lang]/(desktop)/page.tsx');
  assert.match(source, /generateFAQSchema\(/);
  assert.match(source, /<StructuredDataComponent data=\{faqSchema\} \/>/);
  assert.match(source, /ogImage: HOMEPAGE_OG_IMAGE_PATH/);
});

test('homepage share image is a 1200x630 PNG', () => {
  const png = readFileSync(path.join(root, 'public/images/og/homepage.png'));
  assert.equal(png.toString('ascii', 1, 4), 'PNG');
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
});

test('footer column titles are not page headings', () => {
  const source = readSource('app/[lang]/(desktop)/sections/footer.tsx');
  assert.doesNotMatch(source, /<h[1-6]/);
});

test('software application schema describes the desktop app', () => {
  const source = readSource('lib/utils/structured-data.ts');
  const start = source.indexOf(
    'export function generateSoftwareApplicationSchema',
  );
  const end = source.indexOf('export function', start + 1);
  const schema = source.slice(start, end);
  assert.match(schema, /operatingSystem: 'macOS, Windows, Linux'/);
  assert.match(schema, /downloadUrl: DESKTOP_RELEASES_URL/);
  assert.doesNotMatch(schema, /softwareVersion: '5\.0'/);
  assert.doesNotMatch(schema, /operatingSystem: 'Web'/);
});

test('canonical URLs follow the page language', () => {
  const source = readSource('lib/utils/metadata.ts');
  assert.match(source, /DOMAIN_MAP\[lang\] \?\? CANONICAL_DOMAIN/);
  assert.match(source, /buildCanonicalUrl\(normalizedPathname, lang\)/);
  assert.match(source, /buildCanonicalUrl\(docsPath, params\.lang\)/);
});

test('hero background is preloaded and unused font hosts are not preconnected', () => {
  const desktopLayout = readSource('app/[lang]/(desktop)/layout.tsx');
  assert.match(desktopLayout, /rel="preload"[\s\S]*?watercolor-hero\.webp/);
  const localeLayout = readSource('app/[lang]/layout.tsx');
  assert.doesNotMatch(localeLayout, /fonts\.(googleapis|gstatic)\.com/);
});
