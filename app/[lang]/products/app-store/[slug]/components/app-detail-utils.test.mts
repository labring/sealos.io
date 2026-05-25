import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatAppCount,
  getDisplayDescription,
  getAppBenefits,
  getAppUseCases,
  getRelatedApps,
  getTagLabel,
} from './app-detail-utils.ts';

type AppFixture = Parameters<typeof getRelatedApps>[0]['apps'][number];

const fixtures: AppFixture[] = [
  {
    name: 'Dify',
    slug: 'dify',
    description: 'LLM app development platform',
    icon: '/dify.png',
    category: 'AI',
    features: ['AI workflows'],
    benefits: [],
    useCases: [],
    gradient: '',
    tags: ['ai'],
    source: { deployCount: 0 },
  },
  {
    name: 'Flowise',
    slug: 'flowise',
    description: 'Build LLM flows visually',
    icon: '/flowise.png',
    category: 'AI',
    features: [],
    benefits: [],
    useCases: [],
    gradient: '',
    tags: ['low-code'],
    source: { deployCount: 12 },
  },
  {
    name: 'Grafana',
    slug: 'grafana',
    description: 'Dashboards',
    icon: '/grafana.png',
    category: 'Monitoring',
    features: [],
    benefits: [],
    useCases: [],
    gradient: '',
    tags: ['metrics'],
    source: { deployCount: 30 },
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
    source: { deployCount: 4 },
  },
];

test('getRelatedApps prefers the same category, excludes the current app, and fills from real apps', () => {
  const related = getRelatedApps({
    apps: fixtures,
    currentApp: fixtures[0],
    limit: 3,
  });

  assert.deepEqual(
    related.map((app) => app.slug),
    ['flowise', 'grafana', 'redis'],
  );
  assert.notEqual(related[0].slug, 'dify');
});

test('getDisplayDescription falls back to the short description', () => {
  assert.equal(
    getDisplayDescription({
      ...fixtures[0],
      longDescription: 'A longer generated app description.',
    }),
    'A longer generated app description.',
  );
  assert.equal(getDisplayDescription(fixtures[0]), fixtures[0].description);
});

test('getTagLabel normalizes tag text and falls back to category', () => {
  assert.equal(getTagLabel(fixtures[0]), 'ai');
  assert.equal(getTagLabel({ ...fixtures[0], tags: ['low-code'] }), 'low code');
  assert.equal(getTagLabel({ ...fixtures[0], tags: [] }), 'AI');
});

test('formatAppCount uses compact number formatting', () => {
  assert.equal(formatAppCount(0), '0');
  assert.equal(formatAppCount(2400), '2.4K');
});

test('getAppBenefits derives app-specific copy when generated benefits are generic', () => {
  const benefits = getAppBenefits({
    name: 'Dify',
    category: 'AI',
    benefits: [
      'Easy to deploy and manage',
      'Self-hosted solution',
      'Open source and free',
      'Community supported',
    ],
  });

  assert.equal(benefits.length, 4);
  assert.match(benefits[0], /Dify/);
  assert.match(benefits.join(' '), /AI|Kubernetes YAML/);
  assert.notDeepEqual(benefits, [
    'Easy to deploy and manage',
    'Self-hosted solution',
    'Open source and free',
    'Community supported',
  ]);
});

test('getAppUseCases replaces repeated generic use cases with category-specific use cases', () => {
  const useCases = getAppUseCases({
    category: 'Monitoring',
    useCases: [
      'Business Operations',
      'Development Workflow',
      'Data Management',
      'Team Collaboration',
    ],
  });

  assert.deepEqual(useCases, [
    'Application observability',
    'Uptime and incident response',
    'Metrics and dashboard operations',
    'Log and trace analysis',
  ]);
});
