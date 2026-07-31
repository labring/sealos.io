import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const target = process.argv[2] || 'out';
const isRemote = /^https?:\/\//i.test(target);
const sourceDirectory = resolve('content/ai-quick-reference');
const sourceFiles = (await readdir(sourceDirectory))
  .filter((file) => file.endsWith('.en.json'))
  .sort();
const pages = [];
for (const file of sourceFiles) {
  pages.push({
    slug: file.slice(0, -'.en.json'.length),
    data: JSON.parse(await readFile(resolve(sourceDirectory, file), 'utf8')),
  });
}

assert.equal(pages.length, 2000);

const groups = new Map();
for (const page of pages) {
  const normalizedSlug = page.slug.replace(/^\d+-/, '');
  const group = groups.get(normalizedSlug) || [];
  group.push(page);
  groups.set(normalizedSlug, group);
}

const collision = [...groups.values()].find((group) => group.length > 1);
assert.ok(collision);
const normalizedSlug = collision[0].slug.replace(/^\d+-/, '');
const samplePages = collision.slice(0, 2);
const unknownNumberedSlug = `999999-${normalizedSlug}`;

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#x27;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function extractTagText(html, tagName) {
  const openingTagStart = html.indexOf(`<${tagName}`);
  if (openingTagStart < 0) return undefined;

  const contentStart = html.indexOf('>', openingTagStart);
  const closingTag = `</${tagName}>`;
  const contentEnd = html.indexOf(closingTag, contentStart + 1);
  if (contentStart < 0 || contentEnd < 0) return undefined;

  let text = '';
  let insideTag = false;
  for (let index = contentStart + 1; index < contentEnd; index += 1) {
    const character = html[index];
    if (character === '<') {
      insideTag = true;
    } else if (character === '>' && insideTag) {
      insideTag = false;
    } else if (!insideTag) {
      text += character;
    }
  }
  return text;
}

async function readTarget(pathname) {
  if (isRemote) {
    const response = await fetch(`${target.replace(/\/+$/, '')}${pathname}`);
    return {
      status: response.status,
      html: response.status === 200 ? await response.text() : '',
    };
  }

  try {
    return {
      status: 200,
      html: await readFile(resolve(target, `.${pathname}/index.html`), 'utf8'),
    };
  } catch (error) {
    if (error.code === 'ENOENT') return { status: 404, html: '' };
    throw error;
  }
}

async function readSitemap() {
  if (isRemote) {
    const response = await fetch(
      `${target.replace(/\/+$/, '')}/ai-quick-reference/sitemap.xml`,
    );
    assert.equal(response.status, 200);
    return response.text();
  }
  return readFile(resolve(target, './ai-quick-reference/sitemap.xml'), 'utf8');
}

const sitemap = await readSitemap();
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (match) => match[1],
);
assert.equal(sitemapUrls.length, pages.length);
assert.equal(new Set(sitemapUrls).size, sitemapUrls.length);

for (const page of samplePages) {
  const pathname = `/ai-quick-reference/${page.slug}`;
  const result = await readTarget(pathname);
  assert.equal(result.status, 200, `${pathname} must return 200`);
  const canonicalMatch = result.html.match(
    /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i,
  );
  const h1Text = extractTagText(result.html, 'h1');
  const titleText = extractTagText(result.html, 'title');
  assert.ok(canonicalMatch);
  assert.ok(h1Text);
  assert.ok(titleText);
  assert.equal(h1Text, escapeHtml(page.data.title));
  assert.equal(titleText, escapeHtml(`${page.data.title} | Sealos`));
  assert.equal(canonicalMatch[1], `https://sealos.io${pathname}/`);
}

for (const pathname of [
  `/ai-quick-reference/${normalizedSlug}`,
  `/ai-quick-reference/${unknownNumberedSlug}`,
]) {
  const result = await readTarget(pathname);
  assert.ok(result.status === 404 || result.status === 410);
}

console.log(
  `Verified sitemap (${sitemapUrls.length} URLs), ${samplePages.length} collision pages, and unresolved routes at ${target}.`,
);
