import assert from 'node:assert/strict';
import test from 'node:test';
import {
  filterTutorials,
  getTutorialTask,
  getTutorialRuntime,
  getTutorialGroups,
  hasMultipleTutorialRuntimes,
  type CatalogTutorial,
} from './tutorial-catalog.ts';

test('catalog follows published records across frameworks and all six tasks', () => {
  const paths = [
    '/tutorials/django/deploy/',
    '/tutorials/django/postgresql/',
    '/tutorials/django/production/',
    '/tutorials/django/troubleshooting/static-files/',
    '/tutorials/migrate/heroku/django/',
    '/tutorials/data-migration/postgresql/restore/',
  ];
  assert.deepEqual(paths.map(getTutorialTask), [
    'deploy',
    'integration',
    'production',
    'troubleshooting',
    'migrate',
    'data-migration',
  ]);
  const guides: CatalogTutorial[] = [
    {
      title: 'Django deployment',
      description: 'Deploy Django',
      url: paths[0],
      slug: 'django/deploy',
      framework: 'Django',
      runtime: 'Python 3.12',
      stage: 'beginner',
      stageLabel: 'Beginner',
    },
    {
      title: 'Deploy Axum',
      description: 'Deploy Rust',
      url: '/tutorials/axum/deploy/',
      slug: 'axum/deploy',
      framework: 'Axum',
      runtime: 'Rust 1.89',
      stage: 'beginner',
      stageLabel: 'Beginner',
    },
    {
      title: 'Django PostgreSQL',
      description: 'Connect data',
      url: paths[1],
      slug: 'django/postgresql',
      framework: 'Django',
      runtime: 'Python 3.12',
      stage: 'advanced',
      stageLabel: 'Database',
    },
  ];
  assert.equal(filterTutorials(guides, 'all').length, 3);
  assert.equal(hasMultipleTutorialRuntimes([]), false);
  assert.equal(hasMultipleTutorialRuntimes([guides[0]]), false);
  assert.equal(hasMultipleTutorialRuntimes(guides), true);
  assert.equal(hasMultipleTutorialRuntimes(guides.slice(0, 2)), true);
  assert.equal(hasMultipleTutorialRuntimes([guides[0], guides[2]]), false);
  assert.deepEqual(
    filterTutorials(guides, 'deploy').map((guide) => [guide.title, guide.url]),
    [
      ['Django deployment', '/tutorials/django/deploy/'],
      ['Deploy Axum', '/tutorials/axum/deploy/'],
    ],
  );
  assert.equal(filterTutorials(guides, 'integration').length, 1);
  assert.equal(filterTutorials(guides, 'production').length, 0);
  assert.equal(filterTutorials(guides, 'all', 'Python').length, 2);
  assert.equal(filterTutorials(guides, 'deploy', 'Rust').length, 1);
  assert.equal(filterTutorials(guides, 'all', 'Browser').length, 0);
  assert.deepEqual(
    getTutorialGroups(guides, 'all', 'Python').map((group) => group.name),
    ['Python'],
  );
  assert.deepEqual(
    getTutorialGroups(guides, 'all', 'Browser')[0].frameworks.map(
      (framework) => [framework.name, framework.guides.length],
    ),
    [['React + Vite', 0]],
  );
  assert.equal(getTutorialRuntime(guides[0]), 'Python');
  assert.equal(getTutorialRuntime(guides[1]), 'Rust');
  assert.equal(
    getTutorialRuntime({
      ...guides[0],
      framework: 'Phoenix',
      runtime: 'Elixir',
    }),
    'Elixir',
  );
  assert.equal(filterTutorials([], 'all').length, 0);
  const groups = getTutorialGroups(guides, 'all');
  assert.deepEqual(
    groups.slice(0, 2).map((group) => group.name),
    ['Python', 'Rust'],
  );
  assert.equal(
    groups.flatMap((group) =>
      group.frameworks.flatMap((framework) => framework.guides),
    ).length,
    3,
  );
  assert.deepEqual(
    groups[0].frameworks.map((framework) => [
      framework.name,
      framework.guides.length,
    ]),
    [
      ['Django', 2],
      ['FastAPI', 0],
    ],
  );
  assert.deepEqual(
    groups[1].frameworks.map((framework) => [
      framework.name,
      framework.guides.length,
    ]),
    [['Axum', 1]],
  );
  const integrationGroups = getTutorialGroups(guides, 'integration');
  assert.equal(
    integrationGroups.flatMap((group) =>
      group.frameworks.flatMap((framework) => framework.guides),
    ).length,
    1,
  );
  assert.equal(
    integrationGroups.some((group) => group.name === 'Rust'),
    false,
  );
  assert.deepEqual(
    getTutorialGroups([guides[2]], 'deploy')
      .find((group) => group.name === 'Python')
      ?.frameworks.map((framework) => framework.name),
    ['FastAPI'],
  );
  assert.equal(
    getTutorialGroups([], 'all').flatMap((group) => group.frameworks).length,
    10,
  );
});
