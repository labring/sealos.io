import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { groupByNormalizedSlug } from './ai-faq-fixture.mjs';
import { decodeJSONBuffer, loadCanonicalFAQSource } from './ai-faq-index.mjs';

export const FAQ_ROUTE_DETAIL_LIMIT = 20;
export const DEFAULT_FAQ_ROUTE_TARGET = 'out';
export const LOCAL_ROUTE_READ_BATCH_SIZE = 32;
export const REMOTE_ROUTE_WORKER_COUNT = 8;
export const REMOTE_REQUEST_TIMEOUT_MS = 10_000;
export const REMOTE_RETRY_COUNT = 0;

export const FAQ_ROUTE_FINDING_CATEGORIES = [
  {
    key: 'invalid-targets',
    label: 'Invalid targets',
  },
  {
    key: 'target-inspection-failures',
    label: 'Target inspection failures',
  },
  {
    key: 'source-read-failures',
    label: 'Source read failures',
  },
  {
    key: 'index-read-failures',
    label: 'Index read failures',
  },
  {
    key: 'invalid-index-data',
    label: 'Invalid index data',
  },
  {
    key: 'sitemap-read-failures',
    label: 'Sitemap read failures',
  },
  {
    key: 'invalid-sitemap-data',
    label: 'Invalid sitemap data',
  },
  {
    key: 'route-enumeration-failures',
    label: 'Route enumeration failures',
  },
  {
    key: 'route-read-failures',
    label: 'Route read failures',
  },
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
    key: 'index-category-mismatches',
    label: 'Index category mismatches',
  },
  {
    key: 'index-question-mismatches',
    label: 'Index question mismatches',
  },
  {
    key: 'index-description-mismatches',
    label: 'Index description mismatches',
  },
  {
    key: 'index-slug-mismatches',
    label: 'Index slug mismatches',
  },
  {
    key: 'route-network-failures',
    label: 'Route network failures',
  },
  {
    key: 'route-timeout-failures',
    label: 'Route timeout failures',
  },
  {
    key: 'route-status-failures',
    label: 'Route status failures',
  },
  {
    key: 'route-body-read-failures',
    label: 'Route body read failures',
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
  {
    key: 'invalid-route-status-failures',
    label: 'Invalid route status failures',
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

function createEmptyInventories() {
  return Object.fromEntries(
    INVENTORY_NAMES.map((name) => [
      name,
      { total: 0, unique: 0, duplicates: 0 },
    ]),
  );
}

function normalizeFAQRouteReport(report) {
  return {
    target: report.target ?? DEFAULT_FAQ_ROUTE_TARGET,
    mode: report.mode ?? 'local',
    checkedAt: report.checkedAt ?? new Date(0).toISOString(),
    limits: {
      localBatch: LOCAL_ROUTE_READ_BATCH_SIZE,
      remoteWorkers: REMOTE_ROUTE_WORKER_COUNT,
      timeoutMs: REMOTE_REQUEST_TIMEOUT_MS,
      retries: REMOTE_RETRY_COUNT,
      details: FAQ_ROUTE_DETAIL_LIMIT,
      ...report.limits,
    },
    inventories: {
      ...createEmptyInventories(),
      ...report.inventories,
    },
    statusHistogram: report.statusHistogram ?? {},
    routesAttempted: report.routesAttempted ?? 0,
    identityPagesChecked: report.identityPagesChecked ?? 0,
    identityFieldsChecked: report.identityFieldsChecked ?? 0,
    invalidRoutesAttempted: report.invalidRoutesAttempted ?? 0,
    invalidRoutesAccepted: report.invalidRoutesAccepted ?? 0,
    findings: [...(report.findings ?? [])].sort(compareFindings),
  };
}

export function parseFAQRouteTarget(args = []) {
  const invalid = (target, actual) => ({
    target,
    mode: 'invalid',
    findings: [
      {
        category: 'invalid-targets',
        id: null,
        slug: null,
        field: 'target',
        expected: 'zero or one local path or absolute HTTP(S) base URL',
        actual,
      },
    ],
  });

  if (args.length === 0) {
    return { target: DEFAULT_FAQ_ROUTE_TARGET, mode: 'local', findings: [] };
  }
  if (
    args.length !== 1 ||
    typeof args[0] !== 'string' ||
    args[0].length === 0
  ) {
    return invalid(args.join(' '), args);
  }

  const target = args[0];
  if (!target.includes('://')) {
    return { target, mode: 'local', findings: [] };
  }

  try {
    const url = new URL(target);
    if (!['http:', 'https:'].includes(url.protocol)) {
      return invalid(target, target);
    }
    url.hash = '';
    url.search = '';
    return {
      target: url.href.replace(/\/+$/, ''),
      mode: 'remote',
      findings: [],
    };
  } catch {
    return invalid(target, target);
  }
}

function formatStatusHistogram(histogram) {
  const entries = Object.entries(histogram).sort(
    ([left], [right]) => Number(left) - Number(right),
  );
  return entries.length > 0
    ? entries.map(([status, total]) => `${status}=${total}`).join(' ')
    : 'none';
}

function countIdentityFindings(findings, field) {
  return findings.filter(
    (finding) =>
      finding.field === field &&
      [
        'missing-page-identity',
        'duplicate-page-identity',
        'mismatched-page-identity',
      ].includes(finding.category),
  ).length;
}

export function formatFAQRouteReport(input) {
  const report = normalizeFAQRouteReport(input);
  const lines = [
    'AI FAQ route verification',
    `Target: ${JSON.stringify(report.target)}`,
    `Mode: ${report.mode}`,
    `Checked at: ${report.checkedAt}`,
    `Limits: local batch=${report.limits.localBatch} remote workers=${report.limits.remoteWorkers} timeout=${report.limits.timeoutMs}ms retries=${report.limits.retries} details=${report.limits.details}`,
    'Inventories:',
  ];

  for (const name of INVENTORY_NAMES) {
    const inventory = report.inventories[name];
    lines.push(
      `  ${name}: total=${inventory.total} unique=${inventory.unique} duplicates=${inventory.duplicates}`,
    );
  }

  lines.push(
    `HTTP statuses: ${formatStatusHistogram(report.statusHistogram)}`,
    `Routes attempted: ${report.routesAttempted}`,
    `Identity pages checked: ${report.identityPagesChecked}`,
    `Identity fields checked: ${report.identityFieldsChecked}`,
    `Identity findings: title=${countIdentityFindings(report.findings, 'title')} h1=${countIdentityFindings(report.findings, 'h1')} description=${countIdentityFindings(report.findings, 'description')} canonical=${countIdentityFindings(report.findings, 'canonical')}`,
    `Invalid routes: attempted=${report.invalidRoutesAttempted} accepted=${report.invalidRoutesAccepted}`,
    'Findings:',
  );

  for (const category of FAQ_ROUTE_FINDING_CATEGORIES) {
    const findings = report.findings.filter(
      (finding) => finding.category === category.key,
    );
    lines.push(`  ${category.label}: ${findings.length}`);
    for (const finding of findings.slice(0, report.limits.details)) {
      lines.push(`    ${JSON.stringify(finding)}`);
    }
  }

  const passed = report.findings.length === 0;
  lines.push(`Result: ${passed ? 'PASS' : 'FAIL'}`);
  const remoteSuffix = report.mode === 'remote' ? ` -- ${report.target}` : '';
  lines.push(`Rerun: npm run verify:ai-faq-routes${remoteSuffix}`);
  return lines.join('\n');
}

function describeError(error) {
  return {
    code: typeof error?.code === 'string' ? error.code : null,
    message: error instanceof Error ? error.message : String(error),
  };
}

function createIngestionFinding(category, field, expected, error) {
  return {
    category,
    id: null,
    slug: null,
    field,
    expected,
    actual: describeError(error),
  };
}

function parseLocalIndex(buffer) {
  const findings = [];
  let value;
  try {
    value = decodeJSONBuffer(buffer);
  } catch (error) {
    return {
      records: [],
      findings: [
        createIngestionFinding(
          'invalid-index-data',
          '$json',
          'valid UTF-8 JSON array',
          error,
        ),
      ],
    };
  }

  if (!Array.isArray(value)) {
    return {
      records: [],
      findings: [
        {
          category: 'invalid-index-data',
          id: null,
          slug: null,
          field: '$root',
          expected: 'array',
          actual: value,
        },
      ],
    };
  }

  const records = [];
  for (const [position, record] of value.entries()) {
    const invalidFields = [
      'category',
      'question',
      'description',
      'slug',
    ].filter(
      (field) =>
        typeof record?.[field] !== 'string' ||
        record[field].trim().length === 0,
    );
    const slug = typeof record?.slug === 'string' ? record.slug : '';
    const id = getNumericSlugId(slug);
    if (invalidFields.length > 0 || !Number.isSafeInteger(id)) {
      findings.push({
        category: 'invalid-index-data',
        id: Number.isSafeInteger(id) ? id : null,
        slug: slug || null,
        field: invalidFields.length > 0 ? invalidFields.join(',') : 'slug',
        expected: 'non-empty projected fields and a numeric slug',
        actual: record,
        position,
      });
      continue;
    }
    records.push({ ...record, id, position });
  }

  return { records, findings };
}

function parseSitemapSlugs(buffer) {
  const findings = [];
  let xml;
  try {
    xml = new TextDecoder('utf-8', { fatal: true }).decode(Buffer.from(buffer));
  } catch (error) {
    return {
      slugs: [],
      findings: [
        createIngestionFinding(
          'invalid-sitemap-data',
          '$xml',
          'valid UTF-8 sitemap XML',
          error,
        ),
      ],
    };
  }

  const locations = [...xml.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)].map((match) =>
    decodeHtmlEntities(match[1].trim()),
  );
  if (locations.length === 0) {
    findings.push({
      category: 'invalid-sitemap-data',
      id: null,
      slug: null,
      field: 'loc',
      expected: 'at least one canonical AI FAQ URL',
      actual: locations,
    });
  }

  const slugs = [];
  for (const [position, location] of locations.entries()) {
    try {
      const url = new URL(location);
      const match = /^\/ai-quick-reference\/([^/]+)\/$/.exec(url.pathname);
      if (url.origin !== 'https://sealos.io' || !match) {
        throw new Error('URL is outside the canonical English FAQ route.');
      }
      slugs.push(match[1]);
    } catch (error) {
      findings.push({
        category: 'invalid-sitemap-data',
        id: null,
        slug: null,
        field: 'loc',
        expected: 'https://sealos.io/ai-quick-reference/<slug>/',
        actual: location,
        position,
        error: describeError(error),
      });
    }
  }

  return { slugs, findings };
}

function compareLocalIndexFields(sourceRecords, indexRecords) {
  const sourceById = new Map(
    sourceRecords.map((record) => [record.id, record]),
  );
  const fields = [
    ['category', 'category', 'index-category-mismatches'],
    ['title', 'question', 'index-question-mismatches'],
    ['description', 'description', 'index-description-mismatches'],
    ['slug', 'slug', 'index-slug-mismatches'],
  ];
  const findings = [];

  for (const indexRecord of indexRecords) {
    const sourceRecord = sourceById.get(indexRecord.id);
    if (!sourceRecord) continue;
    for (const [sourceField, indexField, category] of fields) {
      const expected =
        sourceField === 'slug'
          ? sourceRecord.slug
          : sourceRecord.data[sourceField];
      const actual = indexRecord[indexField];
      if (expected === actual) continue;
      findings.push({
        category,
        id: sourceRecord.id,
        slug: indexRecord.slug,
        field: indexField,
        expected,
        actual,
      });
    }
  }

  return findings;
}

async function mapInBatches(values, batchSize, mapper) {
  const results = [];
  for (let offset = 0; offset < values.length; offset += batchSize) {
    results.push(
      ...(await Promise.all(
        values.slice(offset, offset + batchSize).map(mapper),
      )),
    );
  }
  return results;
}

async function inspectInvalidLocalRoutes({
  target,
  sourceRecords,
  targetReadFile,
}) {
  const groups = groupByNormalizedSlug(sourceRecords);
  const collision = [...groups.entries()].find(([, group]) => group.length > 1);
  if (!collision) {
    return { attempted: 0, accepted: 0, statuses: [], findings: [] };
  }

  const [normalizedSlug] = collision;
  const probes = [normalizedSlug, `999999-${normalizedSlug}`];
  const findings = [];
  const statuses = [];
  let accepted = 0;

  for (const slug of probes) {
    let status;
    try {
      await targetReadFile(
        resolve(target, 'ai-quick-reference', slug, 'index.html'),
      );
      status = 200;
    } catch (error) {
      if (error?.code === 'ENOENT') {
        status = 404;
      } else {
        status = 0;
        findings.push({
          category: 'route-read-failures',
          id: getNumericSlugId(slug),
          slug,
          field: 'route',
          expected: 'readable file or missing route',
          actual: describeError(error),
        });
      }
    }
    statuses.push(status);
    if (status === 404 || status === 410) {
      accepted += 1;
    } else {
      findings.push({
        category: 'invalid-route-status-failures',
        id: getNumericSlugId(slug),
        slug,
        field: 'status',
        expected: [404, 410],
        actual: status,
      });
    }
  }

  return { attempted: probes.length, accepted, statuses, findings };
}

export async function inspectLocalFAQTarget({
  target,
  mode = 'local',
  checkedAt,
  loadSource = loadCanonicalFAQSource,
  filesystem = {},
}) {
  const targetReadFile = filesystem.readFile ?? readFile;
  const targetReadDirectory = filesystem.readdir ?? readdir;
  const findings = [];
  let sourceRecords = [];
  let indexRecords = [];
  let sitemapSlugs = [];

  try {
    sourceRecords = await loadSource();
  } catch (error) {
    findings.push(
      createIngestionFinding(
        'source-read-failures',
        'source',
        'canonical source records',
        error,
      ),
    );
  }

  try {
    const parsed = parseLocalIndex(
      await targetReadFile(resolve(target, 'ai-faqs.en.json')),
    );
    indexRecords = parsed.records;
    findings.push(...parsed.findings);
  } catch (error) {
    findings.push(
      createIngestionFinding(
        'index-read-failures',
        'index',
        'readable ai-faqs.en.json',
        error,
      ),
    );
  }

  try {
    const parsed = parseSitemapSlugs(
      await targetReadFile(
        resolve(target, 'ai-quick-reference', 'sitemap.xml'),
      ),
    );
    sitemapSlugs = parsed.slugs;
    findings.push(...parsed.findings);
  } catch (error) {
    findings.push(
      createIngestionFinding(
        'sitemap-read-failures',
        'sitemap',
        'readable AI FAQ sitemap',
        error,
      ),
    );
  }

  const routeRoot = resolve(target, 'ai-quick-reference');
  let routeSlugs = [];
  try {
    const entries = await targetReadDirectory(routeRoot, {
      withFileTypes: true,
    });
    routeSlugs = entries
      .filter((entry) => entry?.isDirectory?.())
      .map((entry) => entry.name)
      .sort((left, right) =>
        compareEntries(
          { id: getNumericSlugId(left), slug: left },
          { id: getNumericSlugId(right), slug: right },
        ),
      );
  } catch (error) {
    findings.push(
      createIngestionFinding(
        'route-enumeration-failures',
        'route',
        'readable immediate route directories',
        error,
      ),
    );
  }

  const routeResults = await mapInBatches(
    routeSlugs,
    LOCAL_ROUTE_READ_BATCH_SIZE,
    async (slug) => {
      try {
        const buffer = await targetReadFile(
          resolve(routeRoot, slug, 'index.html'),
        );
        return { slug, html: Buffer.from(buffer).toString('utf8') };
      } catch (error) {
        return { slug, error };
      }
    },
  );
  const readableRoutes = new Map();
  const failedRoutes = new Set();
  for (const result of routeResults) {
    if (result.error) {
      failedRoutes.add(result.slug);
      findings.push({
        category: 'route-read-failures',
        id: getNumericSlugId(result.slug),
        slug: result.slug,
        field: 'route',
        expected: 'readable index.html',
        actual: describeError(result.error),
      });
    } else {
      readableRoutes.set(result.slug, result.html);
    }
  }

  const comparison = compareFAQRouteInventories({
    source: sourceRecords,
    index: indexRecords,
    sitemap: sitemapSlugs,
    route: [...readableRoutes.keys()],
  });
  findings.push(
    ...comparison.findings,
    ...compareLocalIndexFields(sourceRecords, indexRecords),
  );

  const sourceById = new Map(
    sourceRecords.map((record) => [record.id, record]),
  );
  const indexCandidates = [
    ...new Map(indexRecords.map((record) => [record.slug, record])).values(),
  ].sort(compareEntries);
  const statusHistogram = {};
  let identityPagesChecked = 0;
  let identityFieldsChecked = 0;
  const recordStatus = (status) => {
    statusHistogram[status] = (statusHistogram[status] ?? 0) + 1;
  };

  for (const indexRecord of indexCandidates) {
    const html = readableRoutes.get(indexRecord.slug);
    if (html === undefined) {
      if (!failedRoutes.has(indexRecord.slug)) recordStatus(404);
      continue;
    }
    recordStatus(200);
    const sourceRecord = sourceById.get(indexRecord.id);
    if (!sourceRecord) continue;
    identityPagesChecked += 1;
    identityFieldsChecked += IDENTITY_FIELDS.length;
    findings.push(...inspectFAQPageIdentity({ html, record: sourceRecord }));
  }

  const invalidRoutes = await inspectInvalidLocalRoutes({
    target,
    sourceRecords,
    targetReadFile,
  });
  findings.push(...invalidRoutes.findings);
  for (const status of invalidRoutes.statuses) recordStatus(status);

  return normalizeFAQRouteReport({
    target,
    mode,
    checkedAt,
    inventories: comparison.inventories,
    statusHistogram,
    routesAttempted: indexCandidates.length,
    identityPagesChecked,
    identityFieldsChecked,
    invalidRoutesAttempted: invalidRoutes.attempted,
    invalidRoutesAccepted: invalidRoutes.accepted,
    findings,
  });
}

function isTimeoutError(error) {
  return (
    error?.name === 'TimeoutError' ||
    error?.name === 'AbortError' ||
    error?.code === 'ETIMEDOUT'
  );
}

function createRemoteRequestFinding({
  category,
  resource,
  url,
  id = null,
  slug = null,
  field,
  expected,
  actual,
}) {
  return {
    category,
    id,
    slug,
    field,
    expected,
    actual,
    resource,
    url,
  };
}

async function fetchRemoteResource({
  target,
  pathname,
  resource,
  id = null,
  slug = null,
  acceptedStatuses = [200],
  readBody = true,
  statusCategory = 'route-status-failures',
  fetchImpl,
  createTimeoutSignal,
}) {
  const url = new URL(pathname, `${target}/`).href;
  let response;
  try {
    response = await fetchImpl(url, {
      redirect: 'manual',
      signal: createTimeoutSignal(REMOTE_REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    return {
      status: null,
      body: null,
      findings: [
        createRemoteRequestFinding({
          category: isTimeoutError(error)
            ? 'route-timeout-failures'
            : 'route-network-failures',
          resource,
          url,
          id,
          slug,
          field: 'request',
          expected: 'one completed request',
          actual: describeError(error),
        }),
      ],
    };
  }

  if (!acceptedStatuses.includes(response.status)) {
    return {
      status: response.status,
      body: null,
      findings: [
        createRemoteRequestFinding({
          category: statusCategory,
          resource,
          url,
          id,
          slug,
          field: 'status',
          expected: acceptedStatuses,
          actual: response.status,
        }),
      ],
    };
  }

  if (!readBody) {
    return { status: response.status, body: null, findings: [] };
  }

  try {
    return {
      status: response.status,
      body: await response.text(),
      findings: [],
    };
  } catch (error) {
    return {
      status: response.status,
      body: null,
      findings: [
        createRemoteRequestFinding({
          category: 'route-body-read-failures',
          resource,
          url,
          id,
          slug,
          field: 'body',
          expected: 'one readable response body',
          actual: describeError(error),
        }),
      ],
    };
  }
}

async function mapWithWorkers(values, workerCount, mapper) {
  const results = new Array(values.length);
  let cursor = 0;

  async function worker() {
    while (cursor < values.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await mapper(values[index], index);
    }
  }

  await Promise.all(Array.from({ length: workerCount }, () => worker()));
  return results;
}

export async function inspectRemoteFAQTarget({
  target,
  mode = 'remote',
  checkedAt,
  loadSource = loadCanonicalFAQSource,
  fetchImpl = fetch,
  createTimeoutSignal = (timeoutMs) => AbortSignal.timeout(timeoutMs),
}) {
  const findings = [];
  let sourceRecords = [];
  try {
    sourceRecords = await loadSource();
  } catch (error) {
    findings.push(
      createIngestionFinding(
        'source-read-failures',
        'source',
        'canonical source records',
        error,
      ),
    );
  }

  const [indexResponse, sitemapResponse] = await Promise.all([
    fetchRemoteResource({
      target,
      pathname: '/ai-faqs.en.json',
      resource: 'index',
      fetchImpl,
      createTimeoutSignal,
    }),
    fetchRemoteResource({
      target,
      pathname: '/ai-quick-reference/sitemap.xml',
      resource: 'sitemap',
      fetchImpl,
      createTimeoutSignal,
    }),
  ]);
  findings.push(...indexResponse.findings, ...sitemapResponse.findings);

  let indexRecords = [];
  if (indexResponse.body !== null) {
    const parsed = parseLocalIndex(Buffer.from(indexResponse.body, 'utf8'));
    indexRecords = parsed.records;
    findings.push(...parsed.findings);
  }
  let sitemapSlugs = [];
  if (sitemapResponse.body !== null) {
    const parsed = parseSitemapSlugs(Buffer.from(sitemapResponse.body, 'utf8'));
    sitemapSlugs = parsed.slugs;
    findings.push(...parsed.findings);
  }

  const indexCandidates = [
    ...new Map(indexRecords.map((record) => [record.slug, record])).values(),
  ].sort(compareEntries);
  const routeResults = await mapWithWorkers(
    indexCandidates,
    REMOTE_ROUTE_WORKER_COUNT,
    async (record) => ({
      record,
      response: await fetchRemoteResource({
        target,
        pathname: `/ai-quick-reference/${record.slug}/`,
        resource: 'detail',
        id: record.id,
        slug: record.slug,
        fetchImpl,
        createTimeoutSignal,
      }),
    }),
  );

  const routeSlugs = [];
  const statusHistogram = {};
  const sourceById = new Map(
    sourceRecords.map((record) => [record.id, record]),
  );
  let identityPagesChecked = 0;
  let identityFieldsChecked = 0;
  const recordStatus = (status) => {
    if (!Number.isInteger(status)) return;
    statusHistogram[status] = (statusHistogram[status] ?? 0) + 1;
  };

  for (const { record, response } of routeResults) {
    recordStatus(response.status);
    findings.push(...response.findings);
    if (response.status === 200) routeSlugs.push(record.slug);
    if (response.body === null) continue;
    const sourceRecord = sourceById.get(record.id);
    if (!sourceRecord) continue;
    identityPagesChecked += 1;
    identityFieldsChecked += IDENTITY_FIELDS.length;
    findings.push(
      ...inspectFAQPageIdentity({ html: response.body, record: sourceRecord }),
    );
  }

  const groups = groupByNormalizedSlug(sourceRecords);
  const collision = [...groups.entries()].find(([, group]) => group.length > 1);
  const invalidSlugs = collision
    ? [collision[0], `999999-${collision[0]}`]
    : [];
  const invalidResults = [];
  for (const slug of invalidSlugs) {
    invalidResults.push(
      await fetchRemoteResource({
        target,
        pathname: `/ai-quick-reference/${slug}/`,
        resource: 'invalid-detail',
        id: getNumericSlugId(slug),
        slug,
        acceptedStatuses: [404, 410],
        readBody: false,
        statusCategory: 'invalid-route-status-failures',
        fetchImpl,
        createTimeoutSignal,
      }),
    );
  }
  let invalidRoutesAccepted = 0;
  for (const response of invalidResults) {
    recordStatus(response.status);
    findings.push(...response.findings);
    if (response.status === 404 || response.status === 410) {
      invalidRoutesAccepted += 1;
    }
  }

  const comparison = compareFAQRouteInventories({
    source: sourceRecords,
    index: indexRecords,
    sitemap: sitemapSlugs,
    route: routeSlugs,
  });
  findings.push(
    ...comparison.findings,
    ...compareLocalIndexFields(sourceRecords, indexRecords),
  );

  return normalizeFAQRouteReport({
    target,
    mode,
    checkedAt,
    inventories: comparison.inventories,
    statusHistogram,
    routesAttempted: indexCandidates.length,
    identityPagesChecked,
    identityFieldsChecked,
    invalidRoutesAttempted: invalidResults.length,
    invalidRoutesAccepted,
    findings,
  });
}

async function inspectFAQTarget(options) {
  return options.mode === 'local'
    ? inspectLocalFAQTarget(options)
    : inspectRemoteFAQTarget(options);
}

export async function runVerifyFAQRoutes({
  args = [],
  inspectTarget = inspectFAQTarget,
  now = () => new Date(),
  stdout = process.stdout,
  stderr = process.stderr,
} = {}) {
  const parsedTarget = parseFAQRouteTarget(args);
  const checkedAt = now().toISOString();
  let report;

  if (parsedTarget.findings.length > 0) {
    report = normalizeFAQRouteReport({
      ...parsedTarget,
      checkedAt,
    });
  } else {
    try {
      report = normalizeFAQRouteReport(
        await inspectTarget({
          target: parsedTarget.target,
          mode: parsedTarget.mode,
          checkedAt,
        }),
      );
    } catch (error) {
      report = normalizeFAQRouteReport({
        ...parsedTarget,
        checkedAt,
        findings: [
          {
            category: 'target-inspection-failures',
            id: null,
            slug: null,
            field: 'target',
            expected: 'complete inspection',
            actual: error instanceof Error ? error.message : String(error),
          },
        ],
      });
    }
  }

  const output = `${formatFAQRouteReport(report)}\n`;
  const passed = report.findings.length === 0;
  (passed ? stdout : stderr).write(output);
  return passed ? 0 : 1;
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))
) {
  process.exitCode = await runVerifyFAQRoutes({ args: process.argv.slice(2) });
}
