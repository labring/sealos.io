import test from 'node:test';
import assert from 'node:assert/strict';
import { convertTemplateToAppConfig } from './generate-apps-api.js';

test('convertTemplateToAppConfig preserves template screenshots', async () => {
  const screenshots = [
    'https://example.com/app-screen-1.webp',
    'https://example.com/app-screen-2.webp',
  ];

  const app = await convertTemplateToAppConfig({
    metadata: {
      name: 'sample-app',
    },
    spec: {
      title: 'Sample App',
      description: 'A sample app for testing.',
      icon: '/icons/default.svg',
      categories: ['tool'],
      screenshots,
    },
  });

  assert.deepEqual(app?.screenshots, screenshots);
});

test('convertTemplateToAppConfig reads deploy count from template spec', async () => {
  const app = await convertTemplateToAppConfig({
    metadata: {
      name: 'sample-app',
    },
    spec: {
      title: 'Sample App',
      description: 'A sample app for testing.',
      icon: '/icons/default.svg',
      categories: ['tool'],
      screenshots: [],
      deployCount: 37,
    },
  });

  assert.equal(app?.source?.deployCount, 37);
});
