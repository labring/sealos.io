import assert from 'node:assert/strict';
import {
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  unlink,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const root = process.cwd();
const validatorPath = join(root, 'scripts', 'validate-tutorials.mjs');

const tutorialSlugs = [
  'deploy-nextjs-sealos',
  'nextjs-postgresql-sealos',
  'nextjs-production-deployment-sealos',
  'deploy-react-sealos',
  'react-postgresql-sealos',
  'react-production-deployment-sealos',
  'deploy-nodejs-sealos',
  'nodejs-postgresql-sealos',
  'nodejs-production-deployment-sealos',
  'deploy-fastapi-sealos',
  'fastapi-postgresql-sealos',
  'fastapi-production-deployment-sealos',
  'deploy-django-sealos',
  'django-postgresql-sealos',
  'django-production-deployment-sealos',
];

const integrationFiles = [
  'lib/utils/metadata.ts',
  'lib/utils/tutorial-metadata.ts',
  'app/[lang]/(home)/tutorials/page.tsx',
  'app/sitemap.ts',
  'lib/source.ts',
  'new-components/Header.tsx',
  'app/[lang]/utils/is-forced-dark-mode.ts',
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

async function createTutorialFixture() {
  const fixtureRoot = await mkdtemp(join(tmpdir(), 'validate-tutorials-'));

  for (const slug of tutorialSlugs) {
    const tutorialPath = join('content', 'tutorials', slug, 'index.en.mdx');
    await copyRootFile(tutorialPath, fixtureRoot);

    const source = await readFile(join(root, tutorialPath), 'utf8');
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

test('validator accepts the exact 15-page publication contract', () => {
  const result = runValidator(root);

  assert.equal(result.status, 0, result.stderr);
  assert.equal(
    result.stdout.trim(),
    'validate-tutorials passed: 15 tutorial pages checked.',
  );
});

test('validator fails closed when a Python evidence asset is missing', async (t) => {
  const fixtureRoot = await createTutorialFixture();
  t.after(() => rm(fixtureRoot, { force: true, recursive: true }));

  await unlink(
    join(
      fixtureRoot,
      'public/images/deploy-fastapi-sealos/local-stage-validation.webp',
    ),
  );

  const result = runValidator(fixtureRoot);

  assert.equal(result.status, 1);
  assert.match(
    result.stderr,
    /deploy-fastapi-sealos: image reference does not resolve to public asset \/images\/deploy-fastapi-sealos\/local-stage-validation\.webp/,
  );
});
