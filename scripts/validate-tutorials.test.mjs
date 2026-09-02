import assert from 'node:assert/strict';
import {
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  unlink,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const root = process.cwd();
const validatorPath = join(root, 'scripts', 'validate-tutorials.mjs');
const integrationFiles = [
  'app/[lang]/(home)/tutorials/[...slug]/layout.tsx',
  'app/[lang]/(home)/tutorials/[...slug]/page.tsx',
  'lib/utils/tutorial-metadata.ts',
  'lib/utils/tutorial-utils.ts',
];

function runValidator(cwd) {
  return spawnSync(process.execPath, [validatorPath], {
    cwd,
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
  });
}

async function copyRootFile(relativePath, fixtureRoot) {
  const destination = join(fixtureRoot, relativePath);
  await mkdir(dirname(destination), { recursive: true });
  await copyFile(join(root, relativePath), destination);
}

async function findFiles(directory, filename) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await findFiles(path, filename)));
    if (entry.name === filename) files.push(path);
  }
  return files;
}

async function createTutorialFixture() {
  const fixtureRoot = await mkdtemp(join(tmpdir(), 'validate-tutorials-'));
  const tutorialFiles = await findFiles(
    join(root, 'content', 'tutorials'),
    'index.en.mdx',
  );

  for (const file of tutorialFiles) {
    const relativePath = file.slice(root.length + 1);
    await copyRootFile(relativePath, fixtureRoot);
    const source = await readFile(file, 'utf8');
    const imageRefs = [...source.matchAll(/!\[[^\]]*]\((\/[^)]+)\)/g)].map(
      (match) => match[1],
    );
    for (const imageRef of imageRefs) {
      await copyRootFile(join('public', imageRef.slice(1)), fixtureRoot);
    }
  }

  for (const relativePath of integrationFiles) {
    await copyRootFile(relativePath, fixtureRoot);
  }
  return fixtureRoot;
}

async function updateFixtureFile(fixtureRoot, relativePath, transform) {
  const path = join(fixtureRoot, relativePath);
  const source = await readFile(path, 'utf8');
  await writeFile(path, transform(source));
}

test('validator accepts the 13-page public tutorial contract', () => {
  const result = runValidator(root);

  assert.equal(result.status, 0, result.stderr);
  assert.equal(
    result.stdout.trim(),
    'validate-tutorials passed: 13 tutorial pages checked.',
  );
});

test('validator fails when a required Django screenshot is missing', async (t) => {
  const fixtureRoot = await createTutorialFixture();
  t.after(() => rm(fixtureRoot, { force: true, recursive: true }));

  await unlink(
    join(
      fixtureRoot,
      'public/images/tutorials/django/django-sealos-project-ops-running.webp',
    ),
  );
  const result = runValidator(fixtureRoot);

  assert.equal(result.status, 1);
  assert.match(
    result.stderr,
    /image does not resolve to \/images\/tutorials\/django\/django-sealos-project-ops-running\.webp/,
  );
});

test('validator rejects internal publishing fields in public MDX', async (t) => {
  const fixtureRoot = await createTutorialFixture();
  t.after(() => rm(fixtureRoot, { force: true, recursive: true }));

  await updateFixtureFile(
    fixtureRoot,
    'content/tutorials/django/deploy/index.en.mdx',
    (source) =>
      source.replace(
        'stage: beginner',
        "stage: beginner\nprimaryKeyword: 'deploy Django'",
      ),
  );
  const result = runValidator(fixtureRoot);

  assert.equal(result.status, 1);
  assert.match(
    result.stderr,
    /contains internal frontmatter key primaryKeyword/,
  );
});

test('validator rejects an unresolved tutorial entrypoint', async (t) => {
  const fixtureRoot = await createTutorialFixture();
  t.after(() => rm(fixtureRoot, { force: true, recursive: true }));

  await updateFixtureFile(
    fixtureRoot,
    'content/tutorials/django/deploy/index.en.mdx',
    (source) =>
      source.replace(
        "existing_project: '#prepare-django-for-production'",
        "existing_project: '#missing-section'",
      ),
  );
  const result = runValidator(fixtureRoot);

  assert.equal(result.status, 1);
  assert.match(
    result.stderr,
    /entrypoint existing_project does not resolve to #missing-section/,
  );
});

test('validator rejects a Core page that links to a planned Django tutorial', async (t) => {
  const fixtureRoot = await createTutorialFixture();
  t.after(() => rm(fixtureRoot, { force: true, recursive: true }));

  await updateFixtureFile(
    fixtureRoot,
    'content/tutorials/django/deploy/index.en.mdx',
    (source) =>
      source.replace(
        'related: []',
        "related:\n  - '/tutorials/django/postgresql/'",
      ),
  );
  const result = runValidator(fixtureRoot);

  assert.equal(result.status, 1);
  assert.match(
    result.stderr,
    /references unpublished tutorial \/tutorials\/django\/postgresql\//,
  );
});
