import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildTemplateListUrl,
  convertTemplateToAppConfig,
} from './generate-apps-api.js';

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

test('convertTemplateToAppConfig preserves template readme url', async () => {
  const readme =
    'https://raw.githubusercontent.com/labring-actions/templates/kb-0.9/template/sample-app/README.md';

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
      readme,
    },
  });

  assert.equal(app?.readme, readme);
});

test('convertTemplateToAppConfig skips Chinese-only templates', async () => {
  const app = await convertTemplateToAppConfig({
    metadata: {
      name: 'localized-app',
    },
    spec: {
      title: 'Localized App',
      description: 'A localized app for testing.',
      icon: '/icons/default.svg',
      categories: ['tool'],
      screenshots: [],
      locale: 'zh',
    },
  });

  assert.equal(app, null);
});

test('buildTemplateListUrl defaults to the full template list', () => {
  assert.equal(
    buildTemplateListUrl(),
    'https://template.os.sealos.io/api/listTemplate',
  );
  assert.equal(
    buildTemplateListUrl('en'),
    'https://template.os.sealos.io/api/listTemplate?language=en',
  );
});
