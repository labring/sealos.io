import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const sectionDir = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(sectionDir, 'apps-section-utils.ts'), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
});
const utils = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
);

const apps = [
  { name: 'n8n', slug: 'n8n', icon: '/n8n.svg', screenshots: ['/n8n.webp'] },
  {
    name: 'Dify',
    slug: 'dify',
    icon: '/dify.svg',
    screenshots: ['/dify.webp'],
  },
  { name: 'Supabase', slug: 'supabase', icon: '/supabase.png' },
  { name: 'Grafana', slug: 'grafana', icon: '/grafana.svg' },
  { name: 'WordPress', slug: 'wordpress', icon: '/wordpress.svg' },
];

test('home app cards follow the requested featured app order from catalog data', () => {
  assert.deepEqual(
    utils
      .getAppsSectionCards(apps, ['dify', 'n8n', 'missing', 'supabase'])
      .map((app) => app.slug),
    ['dify', 'n8n', 'supabase'],
  );
});

test('logo rows include all app icons and a 200+ More tile', () => {
  const rows = utils.getAppsSectionLogoRows(apps, 3);

  assert.equal(rows.length, 2);
  assert.deepEqual(
    rows.flat().map((item) => item.label),
    ['n8n', 'Dify', 'Supabase', 'Grafana', 'WordPress', '200+ More'],
  );
});
