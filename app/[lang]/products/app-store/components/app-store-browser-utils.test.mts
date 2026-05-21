import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getCategoryCounts,
  getMinimumCountLabel,
  getVisibleApps,
  type SortOption,
} from './app-store-browser-utils.ts';

type AppFixture = Parameters<typeof getVisibleApps>[0]['apps'][number];

const fixtures: AppFixture[] = [
  {
    name: 'Dify',
    slug: 'dify',
    description: 'LLM app development platform',
    icon: '/dify.png',
    category: 'AI',
    features: [],
    benefits: [],
    useCases: [],
    gradient: '',
    tags: ['ai', 'llm'],
    source: { deployCount: 42 },
  },
  {
    name: 'Grafana',
    slug: 'grafana',
    description: 'Operational dashboards',
    icon: '/grafana.png',
    category: 'Monitoring',
    features: [],
    benefits: [],
    useCases: [],
    gradient: '',
    tags: ['dashboard'],
    source: { deployCount: 12 },
  },
  {
    name: 'Redis',
    slug: 'redis',
    description: 'In-memory database',
    icon: '/redis.png',
    category: 'Database',
    features: [],
    benefits: [],
    useCases: [],
    gradient: '',
    tags: ['cache'],
    source: { deployCount: 0 },
  },
];

test('getCategoryCounts includes all apps and category totals', () => {
  assert.deepEqual(getCategoryCounts(fixtures), {
    All: 3,
    AI: 1,
    Monitoring: 1,
    Database: 1,
  });
});

test('getMinimumCountLabel keeps the marketplace count at or above the floor', () => {
  assert.equal(getMinimumCountLabel(3, 149), '149');
  assert.equal(getMinimumCountLabel(1400, 149), '1,400');
});

test('getVisibleApps filters by query across names, descriptions, categories, and tags', () => {
  assert.deepEqual(
    getVisibleApps({
      apps: fixtures,
      query: 'dashboard',
      category: 'All',
      sort: 'name-asc',
      page: 1,
      pageSize: 12,
    }).apps.map((app) => app.slug),
    ['grafana'],
  );

  assert.deepEqual(
    getVisibleApps({
      apps: fixtures,
      query: 'data',
      category: 'All',
      sort: 'name-asc',
      page: 1,
      pageSize: 12,
    }).apps.map((app) => app.slug),
    ['redis'],
  );
});

test('getVisibleApps filters by category and sorts by deploy count', () => {
  const result = getVisibleApps({
    apps: fixtures,
    query: '',
    category: 'AI',
    sort: 'deploy-count',
    page: 1,
    pageSize: 12,
  });

  assert.deepEqual(result.apps.map((app) => app.slug), ['dify']);
  assert.equal(result.totalPages, 1);
});

test('getVisibleApps sorts by name and clamps pagination', () => {
  const sort: SortOption = 'name-desc';
  const result = getVisibleApps({
    apps: fixtures,
    query: '',
    category: 'All',
    sort,
    page: 9,
    pageSize: 2,
  });

  assert.equal(result.currentPage, 2);
  assert.equal(result.totalPages, 2);
  assert.deepEqual(result.apps.map((app) => app.slug), ['dify']);
});
