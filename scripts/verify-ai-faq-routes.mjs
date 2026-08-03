import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { groupByNormalizedSlug, loadFAQPages } from './ai-faq-fixture.mjs';

export const FAQ_ROUTE_DETAIL_LIMIT = 20;

export const FAQ_ROUTE_FINDING_CATEGORIES = [
  {
    key: 'duplicate-source-slugs',
    label: 'Duplicate source slugs',
  },
  {
    key: 'duplicate-index-slugs',
    label: 'Duplicate index slugs',
  },
  {
    key: 'duplicate-sitemap-slugs',
    label: 'Duplicate sitemap slugs',
  },
  {
    key: 'duplicate-route-slugs',
    label: 'Duplicate route slugs',
  },
  {
    key: 'source-only-index-slugs',
    label: 'Source slugs missing from index',
  },
  {
    key: 'index-only-source-slugs',
    label: 'Index slugs missing from source',
  },
  {
    key: 'source-only-sitemap-slugs',
    label: 'Source slugs missing from sitemap',
  },
  {
    key: 'sitemap-only-source-slugs',
    label: 'Sitemap slugs missing from source',
  },
  {
    key: 'source-only-route-slugs',
    label: 'Source slugs missing from routes',
  },
  {
    key: 'route-only-source-slugs',
    label: 'Route slugs missing from source',
  },
  {
    key: 'missing-page-identity',
    label: 'Missing page identity fields',
  },
  {
    key: 'duplicate-page-identity',
    label: 'Duplicate page identity fields',
  },
  {
    key: 'mismatched-page-identity',
    label: 'Mismatched page identity fields',
  },
];

const INVENTORY_NAMES = ['source', 'index', 'sitemap', 'route'];
const IDENTITY_FIELDS = ['title', 'h1', 'description', 'canonical'];
const CATEGORY_ORDER = new Map(
  FAQ_ROUTE_FINDING_CATEGORIES.map(({ key }, index) => [key, index]),
);

function compareCodeUnitStrings(left, right) {
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
}

function getNumericSlugId(slug) {
  const match = /^(\d+)-/.exec(slug);
  return match ? Number(match[1]) : Number.POSITIVE_INFINITY;
}

function normalizeSlug(value) {
  const candidate = typeof value === 'string' ? value : value?.slug;
  if (typeof candidate !== 'string') return '';

  const trimmed = candidate.trim();
  if (trimmed.length === 0) return '';

  try {
    const pathname = /^https?:\/\//i.test(trimmed)
      ? new URL(trimmed).pathname
      : trimmed;
    const segments = pathname.split('/').filter(Boolean);
    return segments.at(-1) ?? '';
  } catch {
    return trimmed;
  }
}

function compareEntries(left, right) {
  if (left.id !== right.id) return left.id - right.id;
  return compareCodeUnitStrings(left.slug, right.slug);
}

function compareFindings(left, right) {
  const categoryDifference =
    (CATEGORY_ORDER.get(left.category) ?? Number.POSITIVE_INFINITY) -
    (CATEGORY_ORDER.get(right.category) ?? Number.POSITIVE_INFINITY);
  if (categoryDifference !== 0) return categoryDifference;

  const leftId = left.id ?? getNumericSlugId(left.slug ?? '');
  const rightId = right.id ?? getNumericSlugId(right.slug ?? '');
  if (leftId !== rightId) return leftId - rightId;

  const slugDifference = compareCodeUnitStrings(
    left.slug ?? '',
    right.slug ?? '',
  );
  if (slugDifference !== 0) return slugDifference;

  return compareCodeUnitStrings(left.field ?? '', right.field ?? '');
}

export function createFAQSlugInventory(name, values) {
  if (!INVENTORY_NAMES.includes(name)) {
    throw new TypeError(`Unknown FAQ route inventory: ${name}`);
  }

  const entries = values
    .map((value) => {
      const slug = normalizeSlug(value);
      return {
        id:
          Number.isSafeInteger(value?.id) && value.id > 0
            ? value.id
            : getNumericSlugId(slug),
        slug,
      };
    })
    .sort(compareEntries);
  const slugGroups = new Map();
  for (const entry of entries) {
    const group = slugGroups.get(entry.slug) ?? [];
    group.push(entry);
    slugGroups.set(entry.slug, group);
  }

  return {
    name,
    entries,
    slugs: [...slugGroups.keys()].sort((left, right) =>
      compareEntries(
        { id: getNumericSlugId(left), slug: left },
        { id: getNumericSlugId(right), slug: right },
      ),
    ),
    slugGroups,
    total: entries.length,
    unique: slugGroups.size,
    duplicates: entries.length - slugGroups.size,
  };
}

function getMembership(slug, inventories) {
  return Object.fromEntries(
    INVENTORY_NAMES.map((name) => [
      name,
      inventories[name].slugGroups.has(slug),
    ]),
  );
}

function collectDuplicateFindings(inventory) {
  const findings = [];
  for (const [slug, group] of inventory.slugGroups) {
    if (group.length < 2) continue;
    findings.push({
      category: `duplicate-${inventory.name}-slugs`,
      id: group[0].id,
      slug,
      field: 'slug',
      expected: 'unique slug',
      actual: slug,
      occurrences: group.length,
    });
  }
  return findings;
}

function collectDirectionalFindings({
  source,
  derived,
  sourceCategory,
  derivedCategory,
  inventories,
}) {
  const findings = [];
  for (const slug of source.slugs) {
    if (derived.slugGroups.has(slug)) continue;
    findings.push({
      category: sourceCategory,
      id: getNumericSlugId(slug),
      slug,
      field: 'slug',
      expected: true,
      actual: false,
      presentIn: getMembership(slug, inventories),
    });
  }
  for (const slug of derived.slugs) {
    if (source.slugGroups.has(slug)) continue;
    findings.push({
      category: derivedCategory,
      id: getNumericSlugId(slug),
      slug,
      field: 'slug',
      expected: true,
      actual: false,
      presentIn: getMembership(slug, inventories),
    });
  }
  return findings;
}

export function compareFAQRouteInventories({
  source = [],
  index = [],
  sitemap = [],
  route = [],
}) {
  const inventories = {
    source: createFAQSlugInventory('source', source),
    index: createFAQSlugInventory('index', index),
    sitemap: createFAQSlugInventory('sitemap', sitemap),
    route: createFAQSlugInventory('route', route),
  };
  const membership = Object.fromEntries(
    [...new Set(INVENTORY_NAMES.flatMap((name) => inventories[name].slugs))]
      .sort((left, right) =>
        compareEntries(
          { id: getNumericSlugId(left), slug: left },
          { id: getNumericSlugId(right), slug: right },
        ),
      )
      .map((slug) => [slug, getMembership(slug, inventories)]),
  );
  const findings = INVENTORY_NAMES.flatMap((name) =>
    collectDuplicateFindings(inventories[name]),
  );

  for (const derivedName of ['index', 'sitemap', 'route']) {
    findings.push(
      ...collectDirectionalFindings({
        source: inventories.source,
        derived: inventories[derivedName],
        sourceCategory: `source-only-${derivedName}-slugs`,
        derivedCategory: `${derivedName}-only-source-slugs`,
        inventories,
      }),
    );
  }

  return {
    inventories,
    membership,
    findings: findings.sort(compareFindings),
  };
}

function decodeHtmlEntities(value) {
  const namedEntities = {
    amp: '&',
    apos: "'",
    gt: '>',
    lt: '<',
    quot: '"',
  };
  return value.replace(
    /&(?:#(\d+)|#x([\da-f]+)|([a-z]+));/gi,
    (entity, decimal, hexadecimal, named) => {
      if (decimal) return String.fromCodePoint(Number(decimal));
      if (hexadecimal)
        return String.fromCodePoint(Number.parseInt(hexadecimal, 16));
      return namedEntities[named.toLowerCase()] ?? entity;
    },
  );
}

function extractAttributes(source) {
  const attributes = {};
  const pattern =
    /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  for (const match of source.matchAll(pattern)) {
    attributes[match[1].toLowerCase()] = decodeHtmlEntities(
      match[2] ?? match[3] ?? match[4] ?? '',
    );
  }
  return attributes;
}

function extractElementText(html, tagName) {
  const values = [];
  const pattern = new RegExp(
    `<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}\\s*>`,
    'gi',
  );
  for (const match of html.matchAll(pattern)) {
    values.push(decodeHtmlEntities(match[1].replace(/<[^>]*>/g, '')).trim());
  }
  return values;
}

function extractMetaDescriptions(html) {
  const values = [];
  for (const match of html.matchAll(/<meta\b([^>]*)>/gi)) {
    const attributes = extractAttributes(match[1]);
    if (attributes.name?.toLowerCase() === 'description') {
      values.push(attributes.content ?? '');
    }
  }
  return values;
}

function extractCanonicalLinks(html) {
  const values = [];
  for (const match of html.matchAll(/<link\b([^>]*)>/gi)) {
    const attributes = extractAttributes(match[1]);
    const relationships = (attributes.rel ?? '').toLowerCase().split(/\s+/);
    if (relationships.includes('canonical')) {
      values.push(attributes.href ?? '');
    }
  }
  return values;
}

export function inspectFAQPageIdentity({ html, record }) {
  const source = typeof html === 'string' ? html : '';
  const expected = {
    title: `${record.data.title} | Sealos`,
    h1: record.data.title,
    description: record.data.description,
    canonical: `https://sealos.io/ai-quick-reference/${record.slug}/`,
  };
  const actual = {
    title: extractElementText(source, 'title'),
    h1: extractElementText(source, 'h1'),
    description: extractMetaDescriptions(source),
    canonical: extractCanonicalLinks(source),
  };
  const findings = [];

  for (const field of IDENTITY_FIELDS) {
    const values = actual[field];
    const context = {
      id: record.id ?? getNumericSlugId(record.slug),
      slug: record.slug,
      field,
      expected: expected[field],
      actual: values,
    };
    if (values.length === 0) {
      findings.push({ category: 'missing-page-identity', ...context });
      continue;
    }
    if (values.length > 1) {
      findings.push({ category: 'duplicate-page-identity', ...context });
    }
    if (values.some((value) => value !== expected[field])) {
      findings.push({ category: 'mismatched-page-identity', ...context });
    }
  }

  return findings.sort(compareFindings);
}

async function runLegacyVerification(target) {
  const isRemote = /^https?:\/\//i.test(target);
  const pages = await loadFAQPages();
  const groups = groupByNormalizedSlug(pages);
  const collision = [...groups.values()].find((group) => group.length > 1);
  const normalizedSlug = collision[0].slug.replace(/^\d+-/, '');
  const samplePages = collision.slice(0, 2);
  const unknownNumberedSlug = `999999-${normalizedSlug}`;

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
        html: await readFile(
          resolve(target, `.${pathname}/index.html`),
          'utf8',
        ),
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
      if (response.status !== 200) {
        throw new Error(`Sitemap returned HTTP ${response.status}.`);
      }
      return response.text();
    }
    return readFile(
      resolve(target, './ai-quick-reference/sitemap.xml'),
      'utf8',
    );
  }

  const sitemap = await readSitemap();
  const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => match[1],
  );
  const comparison = compareFAQRouteInventories({
    source: pages,
    index: pages,
    sitemap: sitemapUrls,
    route: pages,
  });
  const findings = [...comparison.findings];

  for (const page of samplePages) {
    const pathname = `/ai-quick-reference/${page.slug}`;
    const result = await readTarget(pathname);
    if (result.status === 200) {
      findings.push(
        ...inspectFAQPageIdentity({ html: result.html, record: page }),
      );
    } else {
      findings.push({
        category: 'source-only-route-slugs',
        id: getNumericSlugId(page.slug),
        slug: page.slug,
        field: 'status',
        expected: 200,
        actual: result.status,
      });
    }
  }

  for (const pathname of [
    `/ai-quick-reference/${normalizedSlug}`,
    `/ai-quick-reference/${unknownNumberedSlug}`,
  ]) {
    const result = await readTarget(pathname);
    if (result.status !== 404 && result.status !== 410) {
      findings.push({
        category: 'route-only-source-slugs',
        id: null,
        slug: pathname.split('/').at(-1),
        field: 'status',
        expected: [404, 410],
        actual: result.status,
      });
    }
  }

  if (findings.length > 0) {
    throw new Error(
      `AI FAQ route verification found ${findings.length} finding(s).`,
    );
  }
  console.log(
    `Verified sitemap (${sitemapUrls.length} URLs), ${samplePages.length} collision pages, and unresolved routes at ${target}.`,
  );
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))
) {
  try {
    await runLegacyVerification(process.argv[2] || 'out');
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
