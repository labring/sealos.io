import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  GENERATED_ASSET_PATHS,
  getExitCodeForGeneratedStatus,
  parseArgs,
  summarizeGeneratedAssetStatus,
  validateGeneratedJson,
} from './check-generated-app-assets.js';

test('guard allowlist is exactly the generated App Store surfaces', () => {
  assert.deepEqual(GENERATED_ASSET_PATHS, [
    'config/apps.json',
    'config/template-sources.json',
    'public/images/apps',
  ]);
});

test('validateGeneratedJson checks formatting, app count, and source parity', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'apps-json-'));
  const appsPath = join(dir, 'apps.json');
  const sourcesPath = join(dir, 'template-sources.json');

  try {
    await writeFile(
      appsPath,
      `${JSON.stringify(
        [
          {
            name: 'App One',
            slug: 'app-one',
          },
          {
            name: 'App Two',
            slug: 'app-two',
          },
        ],
        null,
        2,
      )}\n`,
    );
    await writeFile(
      sourcesPath,
      `${JSON.stringify(
        {
          'app-one': [],
          'app-two': [{ key: 'PASSWORD' }],
        },
        null,
        2,
      )}\n`,
    );

    const result = validateGeneratedJson({
      appsPath,
      templateSourcesPath: sourcesPath,
    });

    assert.equal(result.appCount, 2);
    assert.equal(result.sourceKeyCount, 2);
    assert.deepEqual(result.appSlugs, ['app-one', 'app-two']);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('validateGeneratedJson rejects non-deterministic formatting', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'apps-json-format-'));
  const appsPath = join(dir, 'apps.json');
  const sourcesPath = join(dir, 'template-sources.json');

  try {
    await writeFile(appsPath, '[{"slug":"app-one"}]\n');
    await writeFile(sourcesPath, '{\n  "app-one": []\n}\n');

    assert.throws(
      () => validateGeneratedJson({ appsPath, templateSourcesPath: sourcesPath }),
      /two-space JSON formatting/,
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('summarizeGeneratedAssetStatus counts porcelain changes and paths', () => {
  const summary = summarizeGeneratedAssetStatus(
    [
      ' M config/apps.json',
      'A  public/images/apps/new.svg',
      'D  public/images/apps/old.svg',
      'R  public/images/apps/a.svg -> public/images/apps/b.svg',
      '?? public/images/apps/untracked.svg',
    ].join('\n'),
  );

  assert.equal(summary.modify, 1);
  assert.equal(summary.add, 2);
  assert.equal(summary.delete, 1);
  assert.equal(summary.rename, 1);
  assert.deepEqual(summary.paths, [
    'config/apps.json',
    'public/images/apps/new.svg',
    'public/images/apps/old.svg',
    'public/images/apps/b.svg',
    'public/images/apps/untracked.svg',
  ]);
});

test('parseArgs supports review mode for generated changes', () => {
  assert.equal(parseArgs([]).allowChanges, false);
  assert.equal(parseArgs(['--allow-changes']).allowChanges, true);
});

test('default guard mode fails on dirty surfaces while allow-changes passes', () => {
  const dirtySummary = summarizeGeneratedAssetStatus(' M config/apps.json');

  assert.equal(getExitCodeForGeneratedStatus(dirtySummary), 1);
  assert.equal(
    getExitCodeForGeneratedStatus(dirtySummary, {
      allowChanges: true,
    }),
    0,
  );
});
