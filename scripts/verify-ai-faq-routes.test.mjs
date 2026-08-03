import assert from 'node:assert/strict';
import test from 'node:test';
import {
  compareFAQRouteInventories,
  inspectFAQPageIdentity,
} from './verify-ai-faq-routes.mjs';

function sourceRecord(id, slug, overrides = {}) {
  return {
    id,
    slug,
    data: {
      category: `Category ${id}`,
      title: `Question ${id}`,
      description: `Description ${id}`,
      ...overrides,
    },
  };
}

function indexRecord(record) {
  return {
    category: record.data.category,
    question: record.data.title,
    description: record.data.description,
    slug: record.slug,
  };
}

test('compares complete route inventories independently of input order', () => {
  const source = [sourceRecord(1, '1-alpha'), sourceRecord(2, '2-beta')];
  const report = compareFAQRouteInventories({
    source,
    index: source.toReversed().map(indexRecord),
    sitemap: source.toReversed().map(({ slug }) => slug),
    route: source.toReversed().map(({ slug }) => slug),
  });

  assert.deepEqual(
    Object.fromEntries(
      Object.entries(report.inventories).map(([name, inventory]) => [
        name,
        { total: inventory.total, unique: inventory.unique },
      ]),
    ),
    {
      source: { total: 2, unique: 2 },
      index: { total: 2, unique: 2 },
      sitemap: { total: 2, unique: 2 },
      route: { total: 2, unique: 2 },
    },
  );
  assert.deepEqual(report.findings, []);
});

test('reports duplicates and every directional inventory difference deterministically', () => {
  const alpha = sourceRecord(1, '1-alpha');
  const beta = sourceRecord(2, '2-beta');
  const gamma = indexRecord(sourceRecord(3, '3-gamma'));
  const inputs = {
    source: [beta, alpha, alpha],
    index: [indexRecord(beta), gamma, gamma],
    sitemap: ['4-delta', beta.slug, beta.slug],
    route: ['5-epsilon', beta.slug, beta.slug],
  };
  const report = compareFAQRouteInventories(inputs);

  assert.deepEqual(
    report.findings.map(({ category, slug }) => [category, slug]),
    [
      ['duplicate-source-slugs', '1-alpha'],
      ['duplicate-index-slugs', '3-gamma'],
      ['duplicate-sitemap-slugs', '2-beta'],
      ['duplicate-route-slugs', '2-beta'],
      ['source-only-index-slugs', '1-alpha'],
      ['index-only-source-slugs', '3-gamma'],
      ['source-only-sitemap-slugs', '1-alpha'],
      ['sitemap-only-source-slugs', '4-delta'],
      ['source-only-route-slugs', '1-alpha'],
      ['route-only-source-slugs', '5-epsilon'],
    ],
  );
  assert.deepEqual(report.membership['1-alpha'], {
    source: true,
    index: false,
    sitemap: false,
    route: false,
  });
  assert.deepEqual(report.membership['2-beta'], {
    source: true,
    index: true,
    sitemap: true,
    route: true,
  });
  assert.deepEqual(
    report.findings.find(
      ({ category }) => category === 'source-only-index-slugs',
    ).presentIn,
    report.membership['1-alpha'],
  );
  assert.equal(
    JSON.stringify(report),
    JSON.stringify(
      compareFAQRouteInventories(
        Object.fromEntries(
          Object.entries(inputs).map(([name, values]) => [
            name,
            values.toReversed(),
          ]),
        ),
      ),
    ),
  );
});

test('validates all page identity fields with nested markup and entities', () => {
  const record = sourceRecord(7, '7-a-and-b', {
    title: 'A & B',
    description: 'Deploy "A & B" safely',
  });
  const html = `<!doctype html>
    <html><head>
      <meta content="Deploy &quot;A &amp; B&quot; safely" name="description">
      <link href="https://sealos.io/ai-quick-reference/7-a-and-b/" rel="canonical">
      <title>A &amp; <span>B</span> | Sealos</title>
    </head><body><h1>A <strong>&amp;</strong> B</h1></body></html>`;

  assert.deepEqual(inspectFAQPageIdentity({ html, record }), []);
});

test('reports missing, duplicate, and mismatched identity fields independently', () => {
  const record = sourceRecord(8, '8-identity');
  const html = `<!doctype html>
    <html><head>
      <title>Wrong</title><title>Question 8 | Sealos</title>
      <meta name="description" content="Wrong description">
      <link rel="canonical" href="https://sealos.io/wrong/">
      <link href="https://sealos.io/ai-quick-reference/8-identity/" rel="canonical">
    </head><body></body></html>`;

  assert.deepEqual(
    inspectFAQPageIdentity({ html, record }).map(({ category, field }) => [
      category,
      field,
    ]),
    [
      ['missing-page-identity', 'h1'],
      ['duplicate-page-identity', 'canonical'],
      ['duplicate-page-identity', 'title'],
      ['mismatched-page-identity', 'canonical'],
      ['mismatched-page-identity', 'description'],
      ['mismatched-page-identity', 'title'],
    ],
  );
});
