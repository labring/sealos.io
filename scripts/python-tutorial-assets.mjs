#!/usr/bin/env node

import { execFile, execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  copyFile,
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  stat,
} from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const execFileAsync = promisify(execFile);
const MAX_IMAGE_BYTES = 200000;
const IMAGE_WIDTH = 1440;
const IMAGE_HEIGHT = 900;

const PAGE_CONTRACTS = Object.freeze([
  {
    slug: 'deploy-fastapi-sealos',
    framework: 'FastAPI',
    stage: 'beginner',
    series: 'sealos-skills-fastapi',
    order: 1,
    tag: 'stage-1-deploy',
    repo: 'sealos-fastapi-tutorial',
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
    repo: 'sealos-fastapi-tutorial',
    related: ['deploy-fastapi-sealos', 'fastapi-production-deployment-sealos'],
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
    repo: 'sealos-fastapi-tutorial',
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
    repo: 'sealos-django-tutorial',
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
    repo: 'sealos-django-tutorial',
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
    repo: 'sealos-django-tutorial',
    related: ['deploy-django-sealos', 'django-postgresql-sealos'],
    cta: ['Open Sealos Skills', '/sealos-skills'],
    files: [
      'production-state-redacted.webp',
      'immutable-rollout-health.webp',
      'domain-static-logs.webp',
      'rollback-recovery.webp',
    ],
  },
]);

const ADJACENT_STEPS = Object.freeze({
  'deploy-fastapi-sealos': [
    'Validate the protected Stage 1 source locally',
    'Review Sealos analysis and template output',
    'Accept the deployment after Runtime Truth Pass',
    'Exercise Swagger and the Tasks API',
  ],
  'fastapi-postgresql-sealos': [
    'Inspect the database-ready source',
    'Review the generated PostgreSQL plan',
    'Complete the Alembic migration',
    'Verify persistent CRUD after restart',
  ],
  'fastapi-production-deployment-sealos': [
    'Resolve immutable production state',
    'Roll out two healthy replicas',
    'Verify HTTPS and runtime logs',
    'Roll back and explicitly recover',
  ],
  'deploy-django-sealos': [
    'Validate the protected Stage 1 source locally',
    'Review Sealos analysis and template output',
    'Accept the host-rewritten deployment',
    'Use the Task Board and native admin',
  ],
  'django-postgresql-sealos': [
    'Inspect the database-ready source',
    'Review the generated PostgreSQL plan',
    'Complete the Django migration',
    'Verify board and admin persistence',
  ],
  'django-production-deployment-sealos': [
    'Resolve immutable production state',
    'Roll out two healthy replicas',
    'Verify HTTPS, static assets, and logs',
    'Roll back and explicitly recover',
  ],
});

export const SCREENSHOT_CONTRACT = Object.freeze(
  PAGE_CONTRACTS.flatMap((page) =>
    page.files.map((filename, index) =>
      Object.freeze({
        recordId: `shot-${page.slug}-${index + 1}`,
        page: page.slug,
        filename,
        framework: page.framework,
        stage: page.stage,
        adjacentStep: ADJACENT_STEPS[page.slug][index],
      }),
    ),
  ),
);

const BOUNDARY_PATHS = Object.freeze([
  'app/[lang]/(home)/tutorials/tutorial-growth-data.ts',
  'app/[lang]/(home)/tutorials/page.tsx',
  'scripts/validate-tutorials.mjs',
  'source.config.ts',
  'lib/source.ts',
  'lib/utils/tutorial-utils.ts',
  'lib/utils/tutorial-metadata.ts',
  'app/[lang]/(home)/tutorials/[slug]/page.tsx',
  'app/[lang]/(home)/tutorials/[slug]/layout.tsx',
]);

const REQUIRED_FRONTMATTER = Object.freeze([
  'title',
  'description',
  'date',
  'updated',
  'stage',
  'framework',
  'series',
  'seriesOrder',
  'estimatedReadingTime',
  'primaryKeyword',
  'targetKeywords',
  'tags',
  'authors',
  'relatedTutorials',
  'cta',
  'faq',
  'howTo',
]);

const SECRET_PATTERNS = Object.freeze([
  /authorization\s*:\s*bearer\s+[^\s"']{6,}/i,
  /(?:password|passwd|secret|token|api[_-]?key)\s*[=:]\s*[^\s"'\[<]{4,}/i,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\bns-[a-z0-9]{6,}\b/i,
  /server:\s*https?:\/\/[^\s]+\/api/i,
  /\bclusters:\s*\n[\s\S]{0,300}\bcontexts:/i,
]);

class UsageError extends Error {}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function sourceUrl(page) {
  return `https://github.com/yangchuansheng/${page.repo}/tree/${page.tag}`;
}

function normalizeFramework(value) {
  if (value === 'FastAPI' || value === 'Django') return value;
  return null;
}

function makeIssue(code, path, message, recordId = '') {
  return { code, path: path || '', recordId: recordId || '', message };
}

function sortIssues(issues) {
  const seen = new Set();
  return issues
    .filter((item) => {
      const key = [item.code, item.path, item.recordId, item.message].join(
        '\0',
      );
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((left, right) =>
      [left.code, left.path, left.recordId, left.message]
        .join('\0')
        .localeCompare(
          [right.code, right.path, right.recordId, right.message].join('\0'),
        ),
    );
}

async function pathExists(path) {
  try {
    await stat(path);
    return true;
  } catch (error) {
    if (error?.code === 'ENOENT') return false;
    throw error;
  }
}

async function readJsonl(path, issues, code = 'EVIDENCE_JOIN_MISSING') {
  if (!(await pathExists(path))) {
    issues.push(makeIssue(code, path, 'required JSONL file is missing'));
    return [];
  }
  const text = await readFile(path, 'utf8');
  const records = [];
  for (const [index, line] of text.split('\n').entries()) {
    if (!line.trim()) continue;
    try {
      records.push(JSON.parse(line));
    } catch (error) {
      issues.push(
        makeIssue(
          code,
          path,
          `line ${index + 1} is invalid JSON: ${error.message}`,
        ),
      );
    }
  }
  return records;
}

function parseMdx(path, text, issues) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) {
    issues.push(
      makeIssue(
        'DRAFT_FRONTMATTER_MISMATCH',
        path,
        'frontmatter block is missing',
      ),
    );
    return { frontmatter: {}, body: text };
  }
  try {
    return {
      frontmatter: yaml.load(match[1]) || {},
      body: text.slice(match[0].length),
    };
  } catch (error) {
    issues.push(
      makeIssue(
        'DRAFT_FRONTMATTER_MISMATCH',
        path,
        `frontmatter is invalid YAML: ${error.message}`,
      ),
    );
    return { frontmatter: {}, body: text.slice(match[0].length) };
  }
}

function equalArray(left, right) {
  return (
    Array.isArray(left) &&
    left.length === right.length &&
    left.every((value, index) => value === right[index])
  );
}

function hasSecret(value) {
  return SECRET_PATTERNS.some((pattern) => pattern.test(String(value)));
}

function scanStructuredSecrets(value, key = '') {
  if (['forbidden_tokens', 'redactions'].includes(key)) return false;
  if (Array.isArray(value))
    return value.some((item) => scanStructuredSecrets(item, key));
  if (value && typeof value === 'object')
    return Object.entries(value).some(([childKey, child]) =>
      scanStructuredSecrets(child, childKey),
    );
  return typeof value === 'string' && hasSecret(value);
}

function acceptedFiveMinuteMode(timings) {
  const accepted = new Map();
  for (const record of timings) {
    const framework = String(record.framework || '').toLowerCase();
    if (
      ['fastapi', 'django'].includes(framework) &&
      record.accepted === true &&
      record.evidence_complete === true &&
      record.http_status === 200 &&
      Number.isFinite(record.elapsed_ms)
    ) {
      accepted.set(framework, record.elapsed_ms);
    }
  }
  return (
    accepted.size === 2 &&
    accepted.get('fastapi') <= 300000 &&
    accepted.get('django') <= 300000
  );
}

function expectedBeginnerTitle(framework, fiveMinutes) {
  return `How to Deploy ${framework} on Sealos${fiveMinutes ? ' in 5 Minutes' : ''}`;
}

function gitBlob(repoRoot, phaseBase, path) {
  const listing = spawnSync(
    'git',
    ['-C', repoRoot, 'ls-tree', phaseBase, '--', `:(literal)${path}`],
    { encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 },
  );
  if (listing.status !== 0)
    throw new Error(
      `git boundary listing failed for ${path}: ${listing.stderr.trim()}`,
    );
  const line = listing.stdout.trim();
  if (!line) return null;
  const match = line.match(/^\d+\s+blob\s+([a-f0-9]{40,64})\t/);
  if (!match)
    throw new Error(`git boundary listing is invalid for ${path}: ${line}`);
  return execFileSync('git', ['-C', repoRoot, 'cat-file', 'blob', match[1]], {
    encoding: null,
    maxBuffer: 16 * 1024 * 1024,
  });
}

async function validateBoundaries(repoRoot, phaseBase, issues) {
  const object = spawnSync('git', [
    '-C',
    repoRoot,
    'cat-file',
    '-e',
    `${phaseBase}^{commit}`,
  ]);
  if (object.status !== 0) {
    issues.push(
      makeIssue(
        'PUBLICATION_BOUNDARY_CHANGED',
        repoRoot,
        'phaseBase is not a readable commit',
      ),
    );
    return;
  }
  for (const path of BOUNDARY_PATHS) {
    const base = gitBlob(repoRoot, phaseBase, path);
    const workPath = join(repoRoot, path);
    const current = (await pathExists(workPath))
      ? await readFile(workPath)
      : null;
    if (
      (base === null) !== (current === null) ||
      (base !== null && !base.equals(current))
    ) {
      issues.push(
        makeIssue(
          'PUBLICATION_BOUNDARY_CHANGED',
          path,
          'worktree bytes or inventory differ from phaseBase',
        ),
      );
    }
  }
}

async function validateChecksums(evidenceRoot, issues) {
  const path = join(evidenceRoot, 'checksums.txt');
  if (!(await pathExists(path))) return;
  const text = await readFile(path, 'utf8');
  const lines = text.split('\n').filter(Boolean);
  const sorted = [...lines].sort((left, right) => left.localeCompare(right));
  if (!equalArray(lines, sorted)) {
    issues.push(
      makeIssue(
        'CHECKSUM_ORDER_INVALID',
        path,
        'checksum entries are not LC_ALL=C sorted',
      ),
    );
  }
  for (const line of lines) {
    const match = line.match(/^([a-f0-9]{64})  ([^/].*)$/);
    if (!match) {
      issues.push(
        makeIssue(
          'CHECKSUM_ORDER_INVALID',
          path,
          `invalid checksum entry: ${line}`,
        ),
      );
      continue;
    }
    const target = resolve(evidenceRoot, match[2]);
    if (
      !target.startsWith(`${resolve(evidenceRoot)}${sep}`) ||
      !(await pathExists(target))
    ) {
      issues.push(
        makeIssue(
          'CHECKSUM_ORDER_INVALID',
          match[2],
          'checksum target is missing or escapes evidence root',
        ),
      );
      continue;
    }
    if (sha256(await readFile(target)) !== match[1]) {
      issues.push(
        makeIssue(
          'CHECKSUM_ORDER_INVALID',
          match[2],
          'checksum digest does not match target bytes',
        ),
      );
    }
  }
}

async function validateEvidenceSecrets(evidenceRoot, issues) {
  const names = await readdir(evidenceRoot);
  for (const name of names.sort()) {
    const path = join(evidenceRoot, name);
    const file = await stat(path);
    if (!file.isFile()) continue;
    if (name.endsWith('.jsonl')) {
      const records = await readJsonl(path, issues);
      if (records.some((record) => scanStructuredSecrets(record))) {
        issues.push(
          makeIssue(
            'EVIDENCE_SECRET_MATCH',
            path,
            'structured evidence contains a credential or private context',
          ),
        );
      }
      continue;
    }
    if (name === 'checksums.txt' || name === 'README.md') continue;
    const value = await readFile(path, 'utf8');
    if (hasSecret(value)) {
      issues.push(
        makeIssue(
          'EVIDENCE_SECRET_MATCH',
          path,
          'retained evidence contains a credential or private context',
        ),
      );
    }
  }
}

function imageReferences(body) {
  return [...body.matchAll(/!\[([^\]]+)\]\((\/images\/[^)]+\.webp)\)/g)].map(
    (match) => ({ alt: match[1].trim(), path: match[2] }),
  );
}

function validatePage(page, path, text, fiveMinutes, issues) {
  const { frontmatter, body } = parseMdx(path, text, issues);
  const missing = REQUIRED_FRONTMATTER.filter(
    (key) => !Object.prototype.hasOwnProperty.call(frontmatter, key),
  );
  const expectedTitle =
    page.stage === 'beginner'
      ? expectedBeginnerTitle(page.framework, fiveMinutes)
      : null;
  if (
    missing.length > 0 ||
    frontmatter.framework !== page.framework ||
    frontmatter.stage !== page.stage ||
    frontmatter.seriesOrder !== page.order ||
    (expectedTitle && frontmatter.title !== expectedTitle) ||
    !Array.isArray(frontmatter.targetKeywords) ||
    !Array.isArray(frontmatter.tags) ||
    !frontmatter.tags.includes(page.framework.toLowerCase()) ||
    !Array.isArray(frontmatter.authors) ||
    !Array.isArray(frontmatter.faq) ||
    !frontmatter.howTo
  ) {
    issues.push(
      makeIssue(
        'DRAFT_FRONTMATTER_MISMATCH',
        path,
        `frontmatter differs from the ${page.framework} ${page.stage} contract${
          missing.length ? `; missing ${missing.join(', ')}` : ''
        }`,
      ),
    );
  }
  if (
    frontmatter.series !== page.series ||
    !equalArray(frontmatter.relatedTutorials, page.related) ||
    frontmatter.cta?.label !== page.cta[0] ||
    frontmatter.cta?.href !== page.cta[1]
  ) {
    issues.push(
      makeIssue(
        'DRAFT_SERIES_LINK_MISMATCH',
        path,
        'series, related tutorials, or CTA differs from the locked stage order',
      ),
    );
  }
  if (!body.includes(`[${page.tag}](${sourceUrl(page)})`)) {
    issues.push(
      makeIssue(
        'DRAFT_SOURCE_TAG_MISMATCH',
        path,
        `body must link the protected ${page.tag} source`,
      ),
    );
  }
  const references = imageReferences(body);
  const expected = page.files.map(
    (filename) => `/images/${page.slug}/${filename}`,
  );
  const actual = references.map((reference) => reference.path);
  if (
    references.length !== 4 ||
    new Set(actual).size !== 4 ||
    !equalArray([...actual].sort(), [...expected].sort()) ||
    references.some(({ alt }) =>
      /^(?:screenshot|image|terminal)(?:\s|$)/i.test(alt),
    )
  ) {
    issues.push(
      makeIssue(
        'DRAFT_IMAGE_REFERENCE_MISMATCH',
        path,
        'page must contain four unique descriptive references from its locked image directory',
      ),
    );
  }
}

async function validateScreenshotMatrix(evidenceRoot, issues) {
  const records = await readJsonl(
    join(evidenceRoot, 'screenshots.jsonl'),
    issues,
  );
  const expected = new Set(
    SCREENSHOT_CONTRACT.map(({ page, filename }) => `${page}/${filename}`),
  );
  const actual = records.map((record) => `${record.page}/${record.filename}`);
  if (
    records.length !== SCREENSHOT_CONTRACT.length ||
    new Set(actual).size !== SCREENSHOT_CONTRACT.length ||
    actual.some((key) => !expected.has(key)) ||
    [...expected].some((key) => !actual.includes(key))
  ) {
    issues.push(
      makeIssue(
        'DRAFT_IMAGE_MATRIX_MISMATCH',
        join(evidenceRoot, 'screenshots.jsonl'),
        'screenshot ledger differs from the exact 24-record matrix',
      ),
    );
  }
  const eventRecords = await readJsonl(
    join(evidenceRoot, 'practice-events.jsonl'),
    issues,
  );
  const eventIds = new Set(
    eventRecords.map((record) => record.record_id).filter(Boolean),
  );
  for (const contract of SCREENSHOT_CONTRACT) {
    const record = records.find(
      (item) =>
        item.page === contract.page && item.filename === contract.filename,
    );
    if (!record) continue;
    const ids = Array.isArray(record.evidence_ids) ? record.evidence_ids : [];
    if (
      !record.source_artifact ||
      !record.source_record_id ||
      ids.length === 0 ||
      ids.some((id) => !eventIds.has(id)) ||
      record.framework !== contract.framework ||
      record.stage !== contract.stage
    ) {
      issues.push(
        makeIssue(
          'EVIDENCE_JOIN_MISSING',
          `${record.page}/${record.filename}`,
          'screenshot record lacks a matching source or observed evidence join',
          record.record_id,
        ),
      );
    }
  }
  return records;
}

export async function validateDraftBundle({
  repoRoot,
  evidenceRoot,
  phaseBase,
  requireAssets = false,
  framework = null,
} = {}) {
  if (!repoRoot || !evidenceRoot || !phaseBase)
    throw new UsageError('repoRoot, evidenceRoot, and phaseBase are required');
  const normalizedFramework = framework ? normalizeFramework(framework) : null;
  if (framework && !normalizedFramework)
    throw new UsageError('framework must be FastAPI or Django');
  const root = resolve(repoRoot);
  const evidence = resolve(evidenceRoot);
  const issues = [];
  const timings = await readJsonl(join(evidence, 'timing.jsonl'), issues);
  const fiveMinutes = acceptedFiveMinuteMode(timings);
  const existingPages = [];
  const missingPages = [];
  for (const page of PAGE_CONTRACTS) {
    const path = join(root, 'content/tutorials', page.slug, 'index.en.mdx');
    if (!(await pathExists(path))) {
      missingPages.push(`content/tutorials/${page.slug}/index.en.mdx`);
      continue;
    }
    existingPages.push(page.slug);
    validatePage(page, path, await readFile(path, 'utf8'), fiveMinutes, issues);
  }
  if (missingPages.length > 0) {
    issues.push(
      makeIssue(
        'DRAFT_PAGE_SET_MISMATCH',
        'content/tutorials',
        `missing locked drafts: ${missingPages.join(', ')}`,
      ),
    );
  }
  const screenshotRecords = await validateScreenshotMatrix(evidence, issues);
  await validateEvidenceSecrets(evidence, issues);
  await validateChecksums(evidence, issues);
  await validateBoundaries(root, phaseBase, issues);

  const selectedContracts = normalizedFramework
    ? SCREENSHOT_CONTRACT.filter(
        (contract) => contract.framework === normalizedFramework,
      )
    : SCREENSHOT_CONTRACT;
  let assetsPending = 0;
  for (const contract of selectedContracts) {
    const path = join(root, 'public/images', contract.page, contract.filename);
    if (!(await pathExists(path))) {
      assetsPending += 1;
      if (requireAssets) {
        issues.push(
          makeIssue(
            'IMAGE_FORMAT_MISMATCH',
            relative(root, path),
            'required WebP asset is missing',
            contract.recordId,
          ),
        );
      }
      continue;
    }
    if (requireAssets) {
      const record = screenshotRecords.find(
        (item) =>
          item.page === contract.page && item.filename === contract.filename,
      );
      const validation = await validateEvidenceCard({
        path,
        record: record || {},
      });
      issues.push(...validation.issues);
    }
  }
  const sorted = sortIssues(issues);
  return {
    ok: sorted.length === 0,
    issues: sorted,
    counts: {
      draftsValid: existingPages.length,
      draftsPending: missingPages.length,
      assetsPending,
    },
  };
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function stringLines(value) {
  if (Array.isArray(value)) return value.map(String);
  return String(value ?? '')
    .split('\n')
    .filter(Boolean);
}

async function assertNoSymlink(root, target) {
  const rootPath = resolve(root);
  const targetPath = resolve(target);
  const rel = relative(rootPath, targetPath);
  if (rel.startsWith('..') || resolve(rootPath, rel) !== targetPath)
    throw new Error('OUTPUT_PATH_REJECTED');
  let current = rootPath;
  for (const part of rel.split(sep).filter(Boolean)) {
    current = join(current, part);
    try {
      if ((await lstat(current)).isSymbolicLink())
        throw new Error('OUTPUT_PATH_REJECTED');
    } catch (error) {
      if (error?.code === 'ENOENT') break;
      throw error;
    }
  }
}

function renderHtml(spec, evidence, captureData) {
  const accent = spec.framework === 'FastAPI' ? '#009688' : '#44b78b';
  const secondary = spec.framework === 'FastAPI' ? '#60a5fa' : '#7aa7d8';
  const lines = stringLines(
    evidence.output || evidence.lines || 'Observed result',
  );
  const command = evidence.command || evidence.source_artifact;
  const capture = captureData
    ? `<div class="capture"><img src="${captureData}" alt="Sanitized observed application state" /></div>`
    : '';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${escapeHtml(evidence.heading || spec.adjacentStep)}</title>
<style>
*{box-sizing:border-box}html,body{margin:0;width:1440px;height:900px;overflow:hidden;background:#090d13;color:#f5f7fa;font-family:Arial,sans-serif;letter-spacing:0}body{padding:44px}main{width:1352px;height:812px;border:1px solid #263140;background:#0d131c;display:grid;grid-template-rows:132px 1fr 74px;box-shadow:0 20px 64px rgba(0,0,0,.34)}header{padding:26px 32px;border-bottom:1px solid #263140;display:flex;align-items:center;justify-content:space-between}.eyebrow{font-size:16px;color:${accent};font-weight:700;text-transform:uppercase}.heading{font-size:38px;line-height:1.12;margin:12px 0 0;max-width:980px}.badge{border:1px solid ${accent};color:#c9fff7;padding:10px 14px;font:600 16px Menlo,monospace}.content{display:grid;grid-template-columns:${captureData ? '1.08fr .92fr' : '1fr'};gap:22px;padding:24px 28px;min-height:0}.panel,.capture{border:1px solid #2a3645;background:#0a0f16;min-width:0;overflow:hidden}.chrome{height:46px;border-bottom:1px solid #263140;display:flex;align-items:center;padding:0 18px;color:#8f9bad;font:15px Menlo,monospace}.dots{color:${secondary};margin-right:14px}.terminal{padding:26px 28px;font:20px/1.55 Menlo,monospace;white-space:pre-wrap;overflow-wrap:anywhere}.command{color:#a7e8df;margin-bottom:22px}.output{color:#e7ebf0}.line{margin:0 0 8px}.capture img{width:100%;height:100%;object-fit:contain;background:#080c12}footer{border-top:1px solid #263140;display:flex;align-items:center;justify-content:space-between;padding:0 30px;color:#8f9bad;font:15px Menlo,monospace}.source{max-width:1040px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.verified{color:${accent};font-weight:700}
</style>
</head>
<body><main data-card>
<header><div><div class="eyebrow">${escapeHtml(evidence.eyebrow || 'PRACTICE-BACKED EVIDENCE')}</div><h1 class="heading">${escapeHtml(evidence.heading || spec.adjacentStep)}</h1></div><div class="badge">${escapeHtml(spec.framework)} / ${escapeHtml(spec.stage)}</div></header>
<section class="content"><div class="panel"><div class="chrome"><span class="dots">● ● ●</span> observed command + output</div><div class="terminal"><div class="command">$ ${escapeHtml(command)}</div><div class="output">${lines.map((line) => `<div class="line">${escapeHtml(line)}</div>`).join('')}</div></div></div>${capture}</section>
<footer><div class="source">source: ${escapeHtml(evidence.source_artifact)}</div><div class="verified">VERIFIED</div></footer>
</main></body></html>`;
}

async function captureDataUri(browserCapture, scratchRoot) {
  const path = browserCapture?.path;
  if (!path) return null;
  const resolvedPath = resolve(path);
  const resolvedScratch = resolve(scratchRoot);
  if (!resolvedPath.startsWith(`${resolvedScratch}${sep}`))
    throw new Error('BROWSER_CAPTURE_PATH_REJECTED');
  await assertNoSymlink(resolvedScratch, resolvedPath);
  const extension = extname(resolvedPath).toLowerCase();
  const mime = extension === '.webp' ? 'image/webp' : 'image/png';
  return `data:${mime};base64,${(await readFile(resolvedPath)).toString('base64')}`;
}

async function runAgentBrowser(session, args, options = {}) {
  return execFileAsync('agent-browser', ['--session', session, ...args], {
    encoding: 'utf8',
    maxBuffer: 8 * 1024 * 1024,
    ...options,
  });
}

async function waitForSessionClose(session) {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const { stdout } = await execFileAsync(
      'agent-browser',
      ['session', 'list', '--json'],
      { encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 },
    );
    const sessions = JSON.parse(stdout)?.data?.sessions;
    if (!Array.isArray(sessions))
      throw new Error('AGENT_BROWSER_SESSION_SCHEMA_INVALID');
    if (!sessions.includes(session)) return;
    await new Promise((accept) => setTimeout(accept, 100));
  }
  throw new Error(`AGENT_BROWSER_SESSION_CLOSE_TIMEOUT: ${session}`);
}

export async function renderEvidenceCard({
  spec,
  evidence,
  browserCapture = null,
  outputPath,
} = {}) {
  const contract = SCREENSHOT_CONTRACT.find(
    (item) =>
      item.page === spec?.page &&
      item.filename === spec?.filename &&
      item.framework === spec?.framework,
  );
  if (!contract) throw new Error('SCREENSHOT_CONTRACT_REQUIRED');
  if (!spec.repoRoot || !outputPath) throw new Error('OUTPUT_PATH_REJECTED');
  const repoRoot = resolve(spec.repoRoot);
  const expectedOutput = join(
    repoRoot,
    'public/images',
    contract.page,
    contract.filename,
  );
  if (resolve(outputPath) !== expectedOutput)
    throw new Error('OUTPUT_PATH_REJECTED');
  await assertNoSymlink(repoRoot, expectedOutput);
  if (
    !evidence?.source_artifact ||
    !Array.isArray(evidence?.evidence_ids) ||
    evidence.evidence_ids.length === 0
  )
    throw new Error('EVIDENCE_JOIN_MISSING');
  if (scanStructuredSecrets(evidence) || scanStructuredSecrets(browserCapture))
    throw new Error('EVIDENCE_SECRET_MATCH');

  const scratchParent = resolve(
    spec.scratchRoot || join(tmpdir(), 'python-tutorial-assets'),
  );
  await mkdir(scratchParent, { recursive: true, mode: 0o700 });
  await chmodIfPossible(scratchParent, 0o700);
  const scratch = await mkdtemp(join(scratchParent, 'card-'));
  const pngPath = join(scratch, 'capture.png');
  const session = `p27-render-${contract.framework.toLowerCase()}-${sha256(
    `${contract.page}/${contract.filename}/${Date.now()}`,
  ).slice(0, 12)}`;
  let server;
  let opened = false;
  try {
    const capture = await captureDataUri(browserCapture, scratchParent);
    const html = renderHtml(contract, evidence, capture);
    server = createServer((request, response) => {
      if (request.url !== '/') {
        response.writeHead(404, { 'content-type': 'text/plain' });
        response.end('not found');
        return;
      }
      response.writeHead(200, {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'no-store',
        'content-security-policy':
          "default-src 'none'; img-src data:; style-src 'unsafe-inline'",
      });
      response.end(html);
    });
    await new Promise((accept, reject) => {
      server.once('error', reject);
      server.listen(0, '127.0.0.1', accept);
    });
    const address = server.address();
    const url = `http://127.0.0.1:${address.port}/`;
    await runAgentBrowser(session, ['set', 'viewport', '1440', '900', '1']);
    opened = true;
    await runAgentBrowser(session, ['open', url]);
    await runAgentBrowser(session, ['wait', '350']);
    await runAgentBrowser(session, [
      'eval',
      `(() => { const card=document.querySelector('[data-card]'); const r=card.getBoundingClientRect(); const ok=innerWidth===1440&&innerHeight===900&&document.documentElement.scrollWidth<=innerWidth&&document.documentElement.scrollHeight<=innerHeight&&r.left>=0&&r.top>=0&&r.right<=innerWidth&&r.bottom<=innerHeight; if(!ok) throw new Error('CARD_LAYOUT_INVALID'); return {width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight}; })()`,
    ]);
    await runAgentBrowser(session, ['screenshot', pngPath]);
    if (!(await pathExists(pngPath)))
      throw new Error('BROWSER_CAPTURE_MISSING');

    let selected = null;
    for (const quality of [84, 80, 76, 72, 68, 64, 60]) {
      const candidate = join(scratch, `card-${quality}.webp`);
      await execFileAsync(
        'cwebp',
        [
          '-quiet',
          '-q',
          String(quality),
          '-m',
          '6',
          '-sharp_yuv',
          '-metadata',
          'none',
          pngPath,
          '-o',
          candidate,
        ],
        { maxBuffer: 8 * 1024 * 1024 },
      );
      const size = (await stat(candidate)).size;
      if (size < MAX_IMAGE_BYTES) {
        selected = { path: candidate, quality, bytes: size };
        break;
      }
    }
    if (!selected) throw new Error('IMAGE_SIZE_LIMIT');
    await mkdir(dirname(expectedOutput), { recursive: true });
    await copyFile(selected.path, expectedOutput);
    const bytes = await readFile(expectedOutput);
    return {
      path: relative(repoRoot, expectedOutput),
      width: IMAGE_WIDTH,
      height: IMAGE_HEIGHT,
      format: 'WEBP',
      bytes: bytes.length,
      sha256: sha256(bytes),
      nonblank: true,
      metadataStripped: true,
      quality: selected.quality,
      captureSession: session,
    };
  } finally {
    if (opened) {
      await runAgentBrowser(session, ['close']);
      await waitForSessionClose(session);
    }
    if (server) {
      await new Promise((accept) => server.close(accept));
    }
    await rm(scratch, { recursive: true, force: true });
  }
}

async function chmodIfPossible(path, mode) {
  try {
    const { chmod } = await import('node:fs/promises');
    await chmod(path, mode);
  } catch (error) {
    if (!['ENOTSUP', 'EPERM'].includes(error?.code)) throw error;
  }
}

function decodePixels(path, issues) {
  try {
    const pixels = execFileSync(
      'ffmpeg',
      [
        '-v',
        'error',
        '-i',
        path,
        '-f',
        'rawvideo',
        '-pix_fmt',
        'rgb24',
        'pipe:1',
      ],
      { encoding: null, maxBuffer: 16 * 1024 * 1024 },
    );
    let min = 255;
    let max = 0;
    let sum = 0;
    let sumSquares = 0;
    const stride = Math.max(1, Math.floor(pixels.length / 180000));
    let count = 0;
    for (let index = 0; index < pixels.length; index += stride) {
      const value = pixels[index];
      min = Math.min(min, value);
      max = Math.max(max, value);
      sum += value;
      sumSquares += value * value;
      count += 1;
    }
    const mean = sum / count;
    const variance = sumSquares / count - mean * mean;
    return { nonblank: max - min >= 12 && variance >= 20, min, max, variance };
  } catch (error) {
    issues.push(
      makeIssue(
        'IMAGE_FORMAT_MISMATCH',
        path,
        `FFmpeg decode failed: ${error.message}`,
      ),
    );
    return { nonblank: false, min: 0, max: 0, variance: 0 };
  }
}

function probeImage(path, issues) {
  try {
    const output = execFileSync(
      'ffprobe',
      [
        '-v',
        'error',
        '-select_streams',
        'v:0',
        '-show_entries',
        'stream=codec_name,width,height',
        '-of',
        'json',
        path,
      ],
      { encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 },
    );
    const stream = JSON.parse(output).streams?.[0];
    if (!stream) throw new Error('video stream is missing');
    return stream;
  } catch (error) {
    issues.push(
      makeIssue(
        'IMAGE_FORMAT_MISMATCH',
        path,
        `ffprobe failed: ${error.message}`,
      ),
    );
    return null;
  }
}

function metadataIsStripped(path) {
  return ['icc', 'exif', 'xmp'].every((kind) => {
    const result = spawnSync(
      'webpmux',
      ['-get', kind, path, '-o', '/dev/null'],
      {
        encoding: 'utf8',
      },
    );
    return result.status !== 0;
  });
}

async function ocrImage(path) {
  const scratch = await mkdtemp(join(tmpdir(), 'p27-ocr-'));
  const png = join(scratch, 'input.png');
  try {
    await execFileAsync(
      'ffmpeg',
      ['-v', 'error', '-y', '-i', path, '-frames:v', '1', png],
      { maxBuffer: 8 * 1024 * 1024 },
    );
    const { stdout } = await execFileAsync(
      'tesseract',
      [png, 'stdout', '--psm', '6'],
      { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 },
    );
    return stdout;
  } finally {
    await rm(scratch, { recursive: true, force: true });
  }
}

export async function validateEvidenceCard({ path, record = {} } = {}) {
  const issues = [];
  if (!path || !(await pathExists(path))) {
    return {
      ok: false,
      issues: [
        makeIssue('IMAGE_FORMAT_MISMATCH', path || '', 'asset is missing'),
      ],
      format: null,
      width: null,
      height: null,
      bytes: 0,
      sha256: null,
      nonblank: false,
      metadataStripped: false,
      ocrText: '',
    };
  }
  const bytes = await readFile(path);
  const signature = bytes.subarray(0, 4).toString('ascii') === 'RIFF';
  const webp = bytes.subarray(8, 12).toString('ascii') === 'WEBP';
  if (!signature || !webp) {
    issues.push(
      makeIssue('IMAGE_FORMAT_MISMATCH', path, 'asset is not RIFF/WEBP'),
    );
    return {
      ok: false,
      issues: sortIssues(issues),
      format: null,
      width: null,
      height: null,
      bytes: bytes.length,
      sha256: sha256(bytes),
      nonblank: false,
      metadataStripped: false,
      ocrText: '',
    };
  }
  if (bytes.length >= MAX_IMAGE_BYTES) {
    issues.push(
      makeIssue(
        'IMAGE_SIZE_LIMIT',
        path,
        `asset is ${bytes.length} bytes; limit is ${MAX_IMAGE_BYTES - 1}`,
      ),
    );
  }
  const probe = probeImage(path, issues);
  const width = Number(probe?.width || 0);
  const height = Number(probe?.height || 0);
  if (
    probe &&
    (probe.codec_name !== 'webp' ||
      width !== IMAGE_WIDTH ||
      height !== IMAGE_HEIGHT)
  ) {
    issues.push(
      makeIssue(
        'IMAGE_DIMENSION_MISMATCH',
        path,
        `expected WEBP ${IMAGE_WIDTH}x${IMAGE_HEIGHT}; received ${probe.codec_name} ${width}x${height}`,
      ),
    );
  }
  const pixels = probe ? decodePixels(path, issues) : { nonblank: false };
  if (probe && !pixels.nonblank) {
    issues.push(
      makeIssue(
        'IMAGE_BLANK_CANVAS',
        path,
        'decoded pixels do not contain enough tonal variance',
      ),
    );
  }
  const digest = sha256(bytes);
  if (record.sha256 && record.sha256 !== digest) {
    issues.push(
      makeIssue(
        'IMAGE_DIGEST_MISMATCH',
        path,
        `recorded digest ${record.sha256} differs from ${digest}`,
      ),
    );
  }
  const metadataStripped = metadataIsStripped(path);
  if (!metadataStripped) {
    issues.push(
      makeIssue(
        'IMAGE_FORMAT_MISMATCH',
        path,
        'asset retains ICC, EXIF, or XMP metadata',
      ),
    );
  }
  let ocrText = '';
  const required = Array.isArray(record.required_tokens)
    ? record.required_tokens
    : [];
  const forbidden = Array.isArray(record.forbidden_tokens)
    ? record.forbidden_tokens
    : [];
  if (probe && (required.length || forbidden.length)) {
    try {
      ocrText = await ocrImage(path);
      const normalized = ocrText.toLowerCase().replace(/\s+/g, ' ');
      for (const token of required) {
        if (!normalized.includes(String(token).toLowerCase())) {
          issues.push(
            makeIssue(
              'EVIDENCE_JOIN_MISSING',
              path,
              `required visible token is missing: ${token}`,
            ),
          );
        }
      }
      for (const token of forbidden) {
        if (normalized.includes(String(token).toLowerCase())) {
          issues.push(
            makeIssue(
              'EVIDENCE_SECRET_MATCH',
              path,
              `forbidden visible token is present: ${token}`,
            ),
          );
        }
      }
    } catch (error) {
      issues.push(
        makeIssue(
          'EVIDENCE_JOIN_MISSING',
          path,
          `OCR inspection failed: ${error.message}`,
        ),
      );
    }
  }
  return {
    ok: issues.length === 0,
    issues: sortIssues(issues),
    format: 'WEBP',
    width,
    height,
    bytes: bytes.length,
    sha256: digest,
    nonblank: Boolean(pixels.nonblank),
    metadataStripped,
    ocrText,
  };
}

function parseCli(argv) {
  const options = {};
  let mode = null;
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (['--check-drafts', '--check-bundle'].includes(token)) {
      if (mode) throw new UsageError('exactly one mode is required');
      mode = token;
      continue;
    }
    if (token === '--render') {
      if (mode) throw new UsageError('exactly one mode is required');
      mode = token;
      if (!argv[index + 1] || argv[index + 1].startsWith('--'))
        throw new UsageError('--render requires a record ID');
      options.recordId = argv[++index];
      continue;
    }
    const key = {
      '--repo-root': 'repoRoot',
      '--evidence-root': 'evidenceRoot',
      '--phase-base': 'phaseBase',
      '--scratch-root': 'scratchRoot',
      '--framework': 'framework',
    }[token];
    if (!key) throw new UsageError(`unknown argument: ${token}`);
    if (Object.prototype.hasOwnProperty.call(options, key))
      throw new UsageError(`repeated argument: ${token}`);
    if (!argv[index + 1] || argv[index + 1].startsWith('--'))
      throw new UsageError(`${token} requires a value`);
    options[key] = argv[++index];
  }
  if (!mode) throw new UsageError('one mode is required');
  for (const key of ['repoRoot', 'evidenceRoot', 'phaseBase']) {
    if (!options[key])
      throw new UsageError(
        `--${key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)} is required`,
      );
  }
  if (mode === '--render' && !options.scratchRoot)
    throw new UsageError('--scratch-root is required for --render');
  if (mode !== '--render' && options.scratchRoot)
    throw new UsageError('--scratch-root is valid only for --render');
  if (mode !== '--check-bundle' && options.framework)
    throw new UsageError('--framework is valid only for --check-bundle');
  if (options.framework && !normalizeFramework(options.framework))
    throw new UsageError('--framework must be FastAPI or Django');
  return { mode, ...options };
}

function printIssues(result) {
  for (const issue of result.issues) {
    process.stderr.write(
      `${issue.code} ${issue.path || issue.recordId || 'input'}: ${issue.message}\n`,
    );
  }
}

function printCounts(result) {
  process.stdout.write(
    `drafts_valid=${result.counts.draftsValid} drafts_pending=${result.counts.draftsPending} assets_pending=${result.counts.assetsPending} issues=${result.issues.length}\n`,
  );
}

async function cli(argv) {
  let options;
  try {
    options = parseCli(argv);
  } catch (error) {
    if (error instanceof UsageError) {
      process.stderr.write(`USAGE ${error.message}\n`);
      return 2;
    }
    throw error;
  }
  try {
    if (
      options.mode === '--check-drafts' ||
      options.mode === '--check-bundle'
    ) {
      const result = await validateDraftBundle({
        repoRoot: options.repoRoot,
        evidenceRoot: options.evidenceRoot,
        phaseBase: options.phaseBase,
        requireAssets: options.mode === '--check-bundle',
        framework: options.framework || null,
      });
      printIssues(result);
      printCounts(result);
      return result.ok ? 0 : 1;
    }
    const issues = [];
    const records = await readJsonl(
      join(resolve(options.evidenceRoot), 'screenshots.jsonl'),
      issues,
    );
    if (issues.length) {
      printIssues({ issues });
      return 1;
    }
    const record = records.find(
      (item) =>
        item.record_id === options.recordId ||
        item.recordId === options.recordId,
    );
    if (!record) {
      process.stderr.write(
        `EVIDENCE_JOIN_MISSING ${options.recordId}: record is missing\n`,
      );
      return 1;
    }
    const contract = SCREENSHOT_CONTRACT.find(
      (item) => item.page === record.page && item.filename === record.filename,
    );
    if (!contract) {
      process.stderr.write(
        `DRAFT_IMAGE_MATRIX_MISMATCH ${options.recordId}: contract is missing\n`,
      );
      return 1;
    }
    const rendered = await renderEvidenceCard({
      spec: {
        ...contract,
        repoRoot: resolve(options.repoRoot),
        scratchRoot: resolve(options.scratchRoot),
      },
      evidence: record,
      browserCapture: record.browser_capture || null,
      outputPath: join(
        resolve(options.repoRoot),
        'public/images',
        contract.page,
        contract.filename,
      ),
    });
    process.stdout.write(`${JSON.stringify(rendered)}\n`);
    return 0;
  } catch (error) {
    if (error instanceof UsageError) {
      process.stderr.write(`USAGE ${error.message}\n`);
      return 2;
    }
    process.stderr.write(`INTERNAL ${error.message}\n`);
    return 3;
  }
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  process.exitCode = await cli(process.argv.slice(2));
}
