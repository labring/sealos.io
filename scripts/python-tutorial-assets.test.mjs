import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  chmod,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';

const SCRIPT_PATH = join(process.cwd(), 'scripts/python-tutorial-assets.mjs');

const PAGE_FIXTURES = [
  {
    slug: 'deploy-fastapi-sealos',
    framework: 'FastAPI',
    stage: 'beginner',
    series: 'sealos-skills-fastapi',
    order: 1,
    tag: 'stage-1-deploy',
    title: 'How to Deploy FastAPI on Sealos in 5 Minutes',
    related: [
      'fastapi-postgresql-sealos',
      'fastapi-production-deployment-sealos',
    ],
    cta: ['Start free on Sealos', 'https://os.sealos.io'],
    files: [
      'local-stage-validation.webp',
      'sealos-analysis-template.webp',
      'sealos-deployment-health.webp',
      'swagger-tasks-api.webp',
    ],
  },
  {
    slug: 'fastapi-postgresql-sealos',
    framework: 'FastAPI',
    stage: 'advanced',
    series: 'sealos-skills-fastapi',
    order: 2,
    tag: 'stage-2-postgresql',
    title: 'Deploy FastAPI with PostgreSQL on Sealos',
    related: [
      'deploy-fastapi-sealos',
      'fastapi-production-deployment-sealos',
    ],
    cta: ['Open Sealos Skills', '/sealos-skills'],
    files: [
      'database-ready-source.webp',
      'sealos-postgresql-plan.webp',
      'alembic-migration-complete.webp',
      'persistent-crud-readback.webp',
    ],
  },
  {
    slug: 'fastapi-production-deployment-sealos',
    framework: 'FastAPI',
    stage: 'production',
    series: 'sealos-skills-fastapi',
    order: 3,
    tag: 'stage-3-production',
    title: 'FastAPI Production Deployment on Sealos',
    related: ['deploy-fastapi-sealos', 'fastapi-postgresql-sealos'],
    cta: ['Open Sealos Skills', '/sealos-skills'],
    files: [
      'production-state-redacted.webp',
      'immutable-rollout-health.webp',
      'domain-runtime-logs.webp',
      'rollback-recovery.webp',
    ],
  },
  {
    slug: 'deploy-django-sealos',
    framework: 'Django',
    stage: 'beginner',
    series: 'sealos-skills-django',
    order: 1,
    tag: 'stage-1-deploy',
    title: 'How to Deploy Django on Sealos in 5 Minutes',
    related: [
      'django-postgresql-sealos',
      'django-production-deployment-sealos',
    ],
    cta: ['Start free on Sealos', 'https://os.sealos.io'],
    files: [
      'local-stage-validation.webp',
      'sealos-analysis-template.webp',
      'sealos-deployment-health.webp',
      'task-board-admin.webp',
    ],
  },
  {
    slug: 'django-postgresql-sealos',
    framework: 'Django',
    stage: 'advanced',
    series: 'sealos-skills-django',
    order: 2,
    tag: 'stage-2-postgresql',
    title: 'Deploy Django with PostgreSQL on Sealos',
    related: ['deploy-django-sealos', 'django-production-deployment-sealos'],
    cta: ['Open Sealos Skills', '/sealos-skills'],
    files: [
      'database-ready-source.webp',
      'sealos-postgresql-plan.webp',
      'django-migration-complete.webp',
      'persistent-board-admin.webp',
    ],
  },
  {
    slug: 'django-production-deployment-sealos',
    framework: 'Django',
    stage: 'production',
    series: 'sealos-skills-django',
    order: 3,
    tag: 'stage-3-production',
    title: 'Django Production Deployment on Sealos',
    related: ['deploy-django-sealos', 'django-postgresql-sealos'],
    cta: ['Open Sealos Skills', '/sealos-skills'],
    files: [
      'production-state-redacted.webp',
      'immutable-rollout-health.webp',
      'domain-static-logs.webp',
      'rollback-recovery.webp',
    ],
  },
];

const BOUNDARY_PATHS = [
  'app/[lang]/(home)/tutorials/tutorial-growth-data.ts',
  'app/[lang]/(home)/tutorials/page.tsx',
  'scripts/validate-tutorials.mjs',
];

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function jsonl(records) {
  return `${records.map((record) => JSON.stringify(record)).join('\n')}\n`;
}

function sourceUrl(page) {
  const repo =
    page.framework === 'FastAPI'
      ? 'sealos-fastapi-tutorial'
      : 'sealos-django-tutorial';
  return `https://github.com/yangchuansheng/${repo}/tree/${page.tag}`;
}

function mdxFor(page) {
  const images = page.files
    .map(
      (filename, index) =>
        `![Observed ${page.framework} ${page.stage} result ${index + 1}](/images/${page.slug}/${filename})`,
    )
    .join('\n\n');
  return `---
title: '${page.title}'
description: 'Practice-backed ${page.framework} ${page.stage} deployment on Sealos with Runtime Truth Pass.'
date: 2026-07-17
updated: 2026-07-17
stage: ${page.stage}
framework: ${page.framework}
series: ${page.series}
seriesOrder: ${page.order}
estimatedReadingTime: 10 minutes
primaryKeyword: 'deploy ${page.framework}'
targetKeywords:
  - ${page.framework} deployment
  - Sealos tutorial
tags:
  - tutorial
  - sealos-skills
  - ${page.framework.toLowerCase()}
authors: ['default']
relatedTutorials:
${page.related.map((slug) => `  - ${slug}`).join('\n')}
cta:
  label: '${page.cta[0]}'
  href: '${page.cta[1]}'
faq:
  - question: 'What does this guide verify?'
    answer: 'It verifies protected source and a real Runtime Truth Pass.'
howTo:
  name: '${page.title}'
  description: 'Follow protected source through deployment and verification.'
  steps:
    - name: 'Deploy and verify'
      text: 'Use the Sealos plugin, inspect .sealos/analysis.json and .sealos/template/index.yaml, then complete Runtime Truth Pass.'
---

# ${page.title}

Protected source: [${page.tag}](${sourceUrl(page)})

Use \`$sealos\` or \`/sealos\` to create \`.sealos/analysis.json\`, \`.sealos/template/index.yaml\`, and \`.sealos/state.json\` before Runtime Truth Pass.

${images}
`;
}

async function writeBoundary(root) {
  for (const path of BOUNDARY_PATHS) {
    await mkdir(dirname(join(root, path)), { recursive: true });
    await writeFile(join(root, path), `export const boundary = '${path}';\n`);
  }
}

function git(root, args) {
  return execFileSync('git', ['-C', root, ...args], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

async function makeFixture({ pages = PAGE_FIXTURES } = {}) {
  const root = await mkdtemp(join(tmpdir(), 'p27-assets-test-'));
  await chmod(root, 0o700);
  await writeBoundary(root);
  git(root, ['init', '-q']);
  git(root, ['config', 'user.name', 'Phase 27 Test']);
  git(root, ['config', 'user.email', 'phase27@example.test']);
  git(root, ['add', '.']);
  git(root, ['commit', '-q', '-m', 'fixture boundary']);
  const phaseBase = git(root, ['rev-parse', 'HEAD']);

  for (const page of pages) {
    const path = join(root, 'content/tutorials', page.slug, 'index.en.mdx');
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, mdxFor(page));
  }

  const evidenceRoot = join(root, 'evidence');
  await mkdir(evidenceRoot, { recursive: true });
  await chmod(evidenceRoot, 0o700);
  const screenshotRecords = PAGE_FIXTURES.flatMap((page) =>
    page.files.map((filename, index) => ({
      schema_version: 1,
      record_id: `shot-${page.slug}-${index + 1}`,
      page: page.slug,
      filename,
      framework: page.framework,
      stage: page.stage,
      adjacent_step: `Observed step ${index + 1}`,
      source_artifact: sourceUrl(page),
      source_record_id: `source-${page.framework.toLowerCase()}-${page.tag}`,
      evidence_ids: [`event-${page.slug}-${index + 1}`],
      redactions: ['workspace', 'credential'],
      required_tokens: [],
      forbidden_tokens: ['Authorization: Bearer', 'password='],
      asset_pending: true,
    })),
  );
  const timings = [
    {
      schema_version: 1,
      record_id: 'timing-fastapi',
      run_id: 'p27-fastapi-fixture',
      framework: 'fastapi',
      accepted: true,
      evidence_complete: true,
      http_status: 200,
      elapsed_ms: 240000,
      cleanup_record_id: 'cleanup-fastapi',
    },
    {
      schema_version: 1,
      record_id: 'timing-django',
      run_id: 'p27-django-fixture',
      framework: 'django',
      accepted: true,
      evidence_complete: true,
      http_status: 200,
      elapsed_ms: 280000,
      cleanup_record_id: 'cleanup-django',
    },
  ];
  const events = screenshotRecords.map((record) => ({
    schema_version: 1,
    record_id: record.evidence_ids[0],
    run_id: `p27-${record.framework.toLowerCase()}-fixture`,
    event: 'observed-result',
    status: 200,
  }));
  const cleanup = ['fastapi', 'django'].map((framework) => ({
    schema_version: 1,
    record_id: `cleanup-${framework}`,
    run_id: `p27-${framework}-fixture`,
    terminal: true,
    zero_residue: true,
  }));
  const claims = PAGE_FIXTURES.map((page) => ({
    schema_version: 1,
    record_id: `claim-${page.slug}`,
    claim_id: `claim-${page.slug}`,
    page: page.slug,
    source_tag: page.tag,
    authority_path: sourceUrl(page),
    reviewed: true,
  }));
  const files = {
    'timing.jsonl': jsonl(timings),
    'screenshots.jsonl': jsonl(screenshotRecords),
    'practice-events.jsonl': jsonl(events),
    'cleanup.jsonl': jsonl(cleanup),
    'claims.jsonl': jsonl(claims),
    'source-identities.jsonl': jsonl(
      PAGE_FIXTURES.map((page) => ({
        schema_version: 1,
        record_id: `source-${page.framework.toLowerCase()}-${page.tag}`,
        framework: page.framework,
        tag: page.tag,
        protected: true,
        url: sourceUrl(page),
      })),
    ),
    'commands.txt': 'git clone --branch <protected-tag> <public-url>\n',
    'review.txt': 'credentials=passed\ncleanup=zero\n',
  };
  for (const [name, contents] of Object.entries(files)) {
    await writeFile(join(evidenceRoot, name), contents, { mode: 0o600 });
  }
  await writeFile(
    join(evidenceRoot, 'README.md'),
    '# Phase 27 evidence fixture\n',
    { mode: 0o600 },
  );
  return { root, evidenceRoot, phaseBase, screenshotRecords };
}

async function replace(path, from, to) {
  const value = await readFile(path, 'utf8');
  assert.match(value, typeof from === 'string' ? new RegExp(from) : from);
  await writeFile(path, value.replace(from, to));
}

function sessionNames() {
  const result = JSON.parse(
    execFileSync('agent-browser', ['session', 'list', '--json'], {
      encoding: 'utf8',
    }),
  );
  assert.ok(Array.isArray(result.data.sessions));
  return [...result.data.sessions].sort();
}

function makeSolidPpm(path, width, height, value = 8) {
  const header = Buffer.from(`P6\n${width} ${height}\n255\n`);
  const pixels = Buffer.alloc(width * height * 3, value);
  return writeFile(path, Buffer.concat([header, pixels]));
}

function encodeWebp(input, output) {
  execFileSync(
    'cwebp',
    ['-quiet', '-q', '82', '-m', '6', '-sharp_yuv', '-metadata', 'none', input, '-o', output],
    { stdio: 'pipe' },
  );
}

test('imports the coordinator after fixture setup', async (t) => {
  const initialFixture = await makeFixture();
  assert.equal((await stat(initialFixture.root)).mode & 0o777, 0o700);
  assert.equal(initialFixture.screenshotRecords.length, 24);

  const coordinator = await import(
    `${pathToFileURL(SCRIPT_PATH).href}?test=${Date.now()}`
  );

  await t.test('exports only the confirmed public seam', () => {
    assert.deepEqual(Object.keys(coordinator).sort(), [
      'SCREENSHOT_CONTRACT',
      'renderEvidenceCard',
      'validateDraftBundle',
      'validateEvidenceCard',
    ]);
    assert.equal(Object.isFrozen(coordinator.SCREENSHOT_CONTRACT), true);
    assert.equal(coordinator.SCREENSHOT_CONTRACT.length, 24);
    assert.equal(
      new Set(
        coordinator.SCREENSHOT_CONTRACT.map(
          ({ page, filename }) => `${page}/${filename}`,
        ),
      ).size,
      24,
    );
  });

  await t.test('accepts six drafts and reports 24 pending assets', async () => {
    const result = await coordinator.validateDraftBundle({
      repoRoot: initialFixture.root,
      evidenceRoot: initialFixture.evidenceRoot,
      phaseBase: initialFixture.phaseBase,
    });
    assert.equal(result.ok, true, JSON.stringify(result.issues, null, 2));
    assert.deepEqual(result.counts, {
      draftsValid: 6,
      draftsPending: 0,
      assetsPending: 24,
    });
  });

  await t.test('reports only the three missing Django drafts', async () => {
    const fixture = await makeFixture({ pages: PAGE_FIXTURES.slice(0, 3) });
    t.after(() => rm(fixture.root, { recursive: true, force: true }));
    const result = await coordinator.validateDraftBundle({
      repoRoot: fixture.root,
      evidenceRoot: fixture.evidenceRoot,
      phaseBase: fixture.phaseBase,
    });
    assert.equal(result.ok, false);
    assert.equal(result.issues.length, 1);
    assert.equal(result.issues[0].code, 'DRAFT_PAGE_SET_MISMATCH');
    assert.deepEqual(result.counts, {
      draftsValid: 3,
      draftsPending: 3,
      assetsPending: 24,
    });
    for (const page of PAGE_FIXTURES.slice(3))
      assert.match(result.issues[0].message, new RegExp(page.slug));
  });

  const draftMutations = [
    [
      'DRAFT_FRONTMATTER_MISMATCH',
      async (fixture) =>
        replace(
          join(
            fixture.root,
            'content/tutorials/deploy-fastapi-sealos/index.en.mdx',
          ),
          'framework: FastAPI',
          'framework: Flask',
        ),
    ],
    [
      'DRAFT_SERIES_LINK_MISMATCH',
      async (fixture) =>
        replace(
          join(
            fixture.root,
            'content/tutorials/deploy-fastapi-sealos/index.en.mdx',
          ),
          'series: sealos-skills-fastapi',
          'series: sealos-skills-python',
        ),
    ],
    [
      'DRAFT_SOURCE_TAG_MISMATCH',
      async (fixture) =>
        replace(
          join(
            fixture.root,
            'content/tutorials/deploy-fastapi-sealos/index.en.mdx',
          ),
          'stage-1-deploy',
          'main',
        ),
    ],
    [
      'DRAFT_IMAGE_REFERENCE_MISMATCH',
      async (fixture) =>
        replace(
          join(
            fixture.root,
            'content/tutorials/deploy-fastapi-sealos/index.en.mdx',
          ),
          /!\[Observed FastAPI beginner result 4\][^\n]+\n?/,
          '',
        ),
    ],
    [
      'DRAFT_IMAGE_MATRIX_MISMATCH',
      async (fixture) => {
        const path = join(fixture.evidenceRoot, 'screenshots.jsonl');
        const records = (await readFile(path, 'utf8'))
          .trim()
          .split('\n')
          .map(JSON.parse);
        records.pop();
        await writeFile(path, jsonl(records));
      },
    ],
    [
      'EVIDENCE_JOIN_MISSING',
      async (fixture) => {
        const path = join(fixture.evidenceRoot, 'screenshots.jsonl');
        const records = (await readFile(path, 'utf8'))
          .trim()
          .split('\n')
          .map(JSON.parse);
        records[0].evidence_ids = [];
        await writeFile(path, jsonl(records));
      },
    ],
    [
      'EVIDENCE_SECRET_MATCH',
      async (fixture) =>
        writeFile(
          join(fixture.evidenceRoot, 'commands.txt'),
          'Authorization: Bearer retained-secret\n',
        ),
    ],
    [
      'CHECKSUM_ORDER_INVALID',
      async (fixture) =>
        writeFile(
          join(fixture.evidenceRoot, 'checksums.txt'),
          `${'0'.repeat(64)}  timing.jsonl\n${'1'.repeat(64)}  README.md\n`,
        ),
    ],
    [
      'PUBLICATION_BOUNDARY_CHANGED',
      async (fixture) =>
        writeFile(
          join(
            fixture.root,
            'app/[lang]/(home)/tutorials/tutorial-growth-data.ts',
          ),
          'export const boundary = "changed";\n',
        ),
    ],
  ];

  for (const [code, mutate] of draftMutations) {
    await t.test(`emits stable issue ${code}`, async () => {
      const fixture = await makeFixture();
      t.after(() => rm(fixture.root, { recursive: true, force: true }));
      await mutate(fixture);
      const result = await coordinator.validateDraftBundle({
        repoRoot: fixture.root,
        evidenceRoot: fixture.evidenceRoot,
        phaseBase: fixture.phaseBase,
      });
      assert.equal(result.ok, false);
      assert.ok(
        result.issues.some((issue) => issue.code === code),
        JSON.stringify(result.issues, null, 2),
      );
    });
  }

  await t.test('renders one real card and preserves unrelated sessions', async () => {
    const fixture = await makeFixture();
    t.after(() => rm(fixture.root, { recursive: true, force: true }));
    const contract = coordinator.SCREENSHOT_CONTRACT[0];
    const outputPath = join(
      fixture.root,
      'public/images',
      contract.page,
      contract.filename,
    );
    const before = sessionNames();
    const rendered = await coordinator.renderEvidenceCard({
      spec: {
        ...contract,
        repoRoot: fixture.root,
        scratchRoot: join(fixture.root, 'render-scratch'),
      },
      evidence: {
        source_artifact: sourceUrl(PAGE_FIXTURES[0]),
        evidence_ids: ['event-deploy-fastapi-sealos-1'],
        eyebrow: 'PROTECTED SOURCE + LIVE CHECK',
        heading: 'FastAPI Stage 1 is healthy',
        command: 'curl https://public.example/health',
        output: '{"status":"ok"}',
      },
      outputPath,
    });
    assert.equal(rendered.width, 1440);
    assert.equal(rendered.height, 900);
    assert.ok(rendered.bytes < 200000);
    assert.deepEqual(sessionNames(), before);

    const record = {
      ...rendered,
      required_tokens: ['FastAPI', 'healthy'],
      forbidden_tokens: ['Authorization: Bearer'],
      source_artifact: sourceUrl(PAGE_FIXTURES[0]),
      evidence_ids: ['event-deploy-fastapi-sealos-1'],
    };
    const validation = await coordinator.validateEvidenceCard({
      path: outputPath,
      record,
    });
    assert.equal(validation.ok, true, JSON.stringify(validation.issues, null, 2));
    assert.equal(validation.nonblank, true);
    assert.equal(validation.metadataStripped, true);
  });

  await t.test('rejects render path escape and retained secrets', async () => {
    const fixture = await makeFixture();
    t.after(() => rm(fixture.root, { recursive: true, force: true }));
    const contract = coordinator.SCREENSHOT_CONTRACT[0];
    await assert.rejects(
      coordinator.renderEvidenceCard({
        spec: { ...contract, repoRoot: fixture.root },
        evidence: {
          source_artifact: sourceUrl(PAGE_FIXTURES[0]),
          evidence_ids: ['event-1'],
          output: 'safe',
        },
        outputPath: join(fixture.root, '..', contract.filename),
      }),
      /OUTPUT_PATH_REJECTED/,
    );
    await assert.rejects(
      coordinator.renderEvidenceCard({
        spec: { ...contract, repoRoot: fixture.root },
        evidence: {
          source_artifact: sourceUrl(PAGE_FIXTURES[0]),
          evidence_ids: ['event-1'],
          output: 'Authorization: Bearer retained-secret',
        },
        outputPath: join(
          fixture.root,
          'public/images',
          contract.page,
          contract.filename,
        ),
      }),
      /EVIDENCE_SECRET_MATCH/,
    );
  });

  await t.test('returns stable image failure codes', async () => {
    const fixture = await makeFixture();
    t.after(() => rm(fixture.root, { recursive: true, force: true }));
    const imageRoot = join(fixture.root, 'image-cases');
    await mkdir(imageRoot, { recursive: true });

    const invalid = join(imageRoot, 'invalid.webp');
    await writeFile(invalid, 'not webp');
    let result = await coordinator.validateEvidenceCard({ path: invalid, record: {} });
    assert.ok(result.issues.some(({ code }) => code === 'IMAGE_FORMAT_MISMATCH'));

    const smallPpm = join(imageRoot, 'small.ppm');
    const small = join(imageRoot, 'small.webp');
    await makeSolidPpm(smallPpm, 20, 20, 80);
    encodeWebp(smallPpm, small);
    result = await coordinator.validateEvidenceCard({ path: small, record: {} });
    assert.ok(result.issues.some(({ code }) => code === 'IMAGE_DIMENSION_MISMATCH'));

    const blankPpm = join(imageRoot, 'blank.ppm');
    const blank = join(imageRoot, 'blank.webp');
    await makeSolidPpm(blankPpm, 1440, 900, 5);
    encodeWebp(blankPpm, blank);
    result = await coordinator.validateEvidenceCard({
      path: blank,
      record: { sha256: sha256(await readFile(blank)) },
    });
    assert.ok(result.issues.some(({ code }) => code === 'IMAGE_BLANK_CANVAS'));

    const oversized = join(imageRoot, 'oversized.webp');
    const bytes = await readFile(blank);
    await writeFile(
      oversized,
      Buffer.concat([bytes, Buffer.alloc(200001 - bytes.length, 0)]),
    );
    result = await coordinator.validateEvidenceCard({ path: oversized, record: {} });
    assert.ok(result.issues.some(({ code }) => code === 'IMAGE_SIZE_LIMIT'));

    result = await coordinator.validateEvidenceCard({
      path: blank,
      record: { sha256: 'f'.repeat(64) },
    });
    assert.ok(result.issues.some(({ code }) => code === 'IMAGE_DIGEST_MISMATCH'));
  });

  await t.test('uses stable CLI usage and semantic exits', async () => {
    const fixture = await makeFixture();
    t.after(() => rm(fixture.root, { recursive: true, force: true }));
    const base = [
      SCRIPT_PATH,
      '--repo-root',
      fixture.root,
      '--evidence-root',
      fixture.evidenceRoot,
      '--phase-base',
      fixture.phaseBase,
    ];
    let result = spawnSync(process.execPath, [SCRIPT_PATH, '--unknown'], {
      encoding: 'utf8',
    });
    assert.equal(result.status, 2);
    result = spawnSync(process.execPath, [
      SCRIPT_PATH,
      '--check-drafts',
      ...base.slice(1),
      '--framework',
      'FastAPI',
    ]);
    assert.equal(result.status, 2);
    result = spawnSync(process.execPath, [
      SCRIPT_PATH,
      '--check-drafts',
      ...base.slice(1),
    ], { encoding: 'utf8' });
    assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
    assert.match(
      result.stdout,
      /drafts_valid=6 drafts_pending=0 assets_pending=24 issues=0/,
    );
    result = spawnSync(process.execPath, [
      SCRIPT_PATH,
      '--check-bundle',
      ...base.slice(1),
      '--framework',
      'FastAPI',
    ]);
    assert.equal(result.status, 1);
  });

  t.after(() => rm(initialFixture.root, { recursive: true, force: true }));
});
