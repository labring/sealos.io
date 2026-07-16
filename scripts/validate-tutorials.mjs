#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const tutorialDir = join(root, 'content', 'tutorials');
const strictTutorialSlugs = new Set([
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
]);

const webpBudgetBytes = 153600;

const tutorialContracts = [
  {
    slug: 'deploy-nextjs-sealos',
    framework: 'Next.js',
    stage: 'beginner',
    series: 'sealos-skills-nextjs',
    seriesOrder: 1,
    ctaHref: 'https://os.sealos.io',
    relatedTutorials: [
      'nextjs-postgresql-sealos',
      'nextjs-production-deployment-sealos',
    ],
    frontmatterPhrases: [
      'Runtime Truth Pass',
      '.sealos/template/index.yaml',
      '.sealos/state.json',
    ],
    bodyPhrases: [
      'Next.js',
      '$sealos',
      '/sealos',
      'Runtime Truth Pass',
      '.sealos/analysis.json',
      '.sealos/template/index.yaml',
      '.sealos/state.json',
    ],
    imagePolicy: { folder: null, webpOnly: false, width: null, height: null },
  },
  {
    slug: 'nextjs-postgresql-sealos',
    framework: 'Next.js',
    stage: 'advanced',
    series: 'sealos-skills-nextjs',
    seriesOrder: 2,
    ctaHref: '/sealos-skills',
    relatedTutorials: [
      'deploy-nextjs-sealos',
      'nextjs-production-deployment-sealos',
    ],
    frontmatterPhrases: [
      'generated PostgreSQL resource',
      'actual database env key',
      'Runtime Truth Pass',
      'read/write',
    ],
    bodyPhrases: [
      'Next.js',
      'PostgreSQL',
      '$sealos',
      '/sealos',
      'Runtime Truth Pass',
      '.sealos/analysis.json',
      '.sealos/template/index.yaml',
      '.sealos/state.json',
      'read/write',
      'migration',
    ],
    imagePolicy: { folder: null, webpOnly: false, width: null, height: null },
  },
  {
    slug: 'nextjs-production-deployment-sealos',
    framework: 'Next.js',
    stage: 'production',
    series: 'sealos-skills-nextjs',
    seriesOrder: 3,
    ctaHref: '/sealos-skills',
    relatedTutorials: ['deploy-nextjs-sealos', 'nextjs-postgresql-sealos'],
    frontmatterPhrases: [
      'Runtime Truth Pass',
      'DEPLOY',
      'UPDATE',
      '.sealos/state.json',
      'rollback',
      'backups',
    ],
    bodyPhrases: [
      'Next.js',
      '$sealos',
      '/sealos',
      'Runtime Truth Pass',
      '.sealos/analysis.json',
      '.sealos/template/index.yaml',
      '.sealos/state.json',
      'DEPLOY',
      'UPDATE',
      'rollback',
      'backups',
    ],
    imagePolicy: { folder: null, webpOnly: false, width: null, height: null },
  },
  {
    slug: 'deploy-react-sealos',
    framework: 'React',
    stage: 'beginner',
    series: 'sealos-skills-react',
    seriesOrder: 1,
    ctaHref: 'https://os.sealos.io',
    relatedTutorials: [
      'react-postgresql-sealos',
      'react-production-deployment-sealos',
    ],
    frontmatterPhrases: [
      'Runtime Truth Pass',
      '.sealos/template/index.yaml',
      '.sealos/state.json',
    ],
    bodyPhrases: [
      'React',
      'VITE',
      'dist',
      '$sealos',
      '/sealos',
      'Runtime Truth Pass',
      '.sealos/analysis.json',
      '.sealos/template/index.yaml',
      '.sealos/state.json',
    ],
    imagePolicy: {
      folder: '/images/deploy-react-sealos/',
      webpOnly: true,
      width: 1440,
      height: 900,
    },
  },
  {
    slug: 'react-postgresql-sealos',
    framework: 'React',
    stage: 'advanced',
    series: 'sealos-skills-react',
    seriesOrder: 2,
    ctaHref: '/sealos-skills',
    relatedTutorials: [
      'deploy-react-sealos',
      'react-production-deployment-sealos',
    ],
    frontmatterPhrases: [
      'generated PostgreSQL resource',
      'database env key',
      'Runtime Truth Pass',
      'read/write',
    ],
    bodyPhrases: [
      'React',
      'API/service',
      'PostgreSQL',
      'server-side',
      '$sealos',
      '/sealos',
      'Runtime Truth Pass',
      '.sealos/analysis.json',
      '.sealos/template/index.yaml',
      '.sealos/state.json',
      'read/write',
      'migration',
    ],
    imagePolicy: {
      folder: '/images/react-postgresql-sealos/',
      webpOnly: true,
      width: 1440,
      height: 900,
    },
  },
  {
    slug: 'react-production-deployment-sealos',
    framework: 'React',
    stage: 'production',
    series: 'sealos-skills-react',
    seriesOrder: 3,
    ctaHref: '/sealos-skills',
    relatedTutorials: ['deploy-react-sealos', 'react-postgresql-sealos'],
    frontmatterPhrases: [
      'Runtime Truth Pass',
      'DEPLOY',
      'UPDATE',
      '.sealos/state.json',
      'rollback',
    ],
    bodyPhrases: [
      'React',
      'VITE',
      'dist',
      '$sealos',
      '/sealos',
      'Runtime Truth Pass',
      '.sealos/analysis.json',
      '.sealos/template/index.yaml',
      '.sealos/state.json',
      'DEPLOY',
      'UPDATE',
      'health checks',
      'rollback',
    ],
    imagePolicy: {
      folder: '/images/react-production-deployment-sealos/',
      webpOnly: true,
      width: 1440,
      height: 900,
    },
  },
  {
    slug: 'deploy-nodejs-sealos',
    framework: 'Node.js',
    stage: 'beginner',
    series: 'sealos-skills-nodejs',
    seriesOrder: 1,
    ctaHref: 'https://os.sealos.io',
    relatedTutorials: [
      'nodejs-postgresql-sealos',
      'nodejs-production-deployment-sealos',
    ],
    frontmatterPhrases: [
      'Runtime Truth Pass',
      '.sealos/template/index.yaml',
      '.sealos/state.json',
    ],
    bodyPhrases: [
      'Node.js',
      'npm start',
      'PORT',
      '0.0.0.0',
      'health',
      '$sealos',
      '/sealos',
      'Runtime Truth Pass',
      '.sealos/analysis.json',
      '.sealos/template/index.yaml',
      '.sealos/state.json',
    ],
    imagePolicy: {
      folder: '/images/deploy-nodejs-sealos/',
      webpOnly: true,
      width: 1440,
      height: 900,
    },
  },
  {
    slug: 'nodejs-postgresql-sealos',
    framework: 'Node.js',
    stage: 'advanced',
    series: 'sealos-skills-nodejs',
    seriesOrder: 2,
    ctaHref: '/sealos-skills',
    relatedTutorials: [
      'deploy-nodejs-sealos',
      'nodejs-production-deployment-sealos',
    ],
    frontmatterPhrases: [
      'generated PostgreSQL resource',
      'actual database env key',
      'Runtime Truth Pass',
      'read/write',
    ],
    bodyPhrases: [
      'Node.js',
      'npm start',
      'PORT',
      'PostgreSQL',
      'server-side',
      '$sealos',
      '/sealos',
      'Runtime Truth Pass',
      '.sealos/analysis.json',
      '.sealos/template/index.yaml',
      '.sealos/state.json',
      'read/write',
      'migration',
    ],
    imagePolicy: {
      folder: '/images/nodejs-postgresql-sealos/',
      webpOnly: true,
      width: 1440,
      height: 900,
    },
  },
  {
    slug: 'nodejs-production-deployment-sealos',
    framework: 'Node.js',
    stage: 'production',
    series: 'sealos-skills-nodejs',
    seriesOrder: 3,
    ctaHref: '/sealos-skills',
    relatedTutorials: ['deploy-nodejs-sealos', 'nodejs-postgresql-sealos'],
    frontmatterPhrases: [
      'Runtime Truth Pass',
      'DEPLOY',
      'UPDATE',
      '.sealos/state.json',
      'rollback',
      'backup',
    ],
    bodyPhrases: [
      'Node.js',
      'npm start',
      'PORT',
      '0.0.0.0',
      'health',
      '$sealos',
      '/sealos',
      'Runtime Truth Pass',
      '.sealos/analysis.json',
      '.sealos/template/index.yaml',
      '.sealos/state.json',
      'DEPLOY',
      'UPDATE',
      'rollback',
      'backup',
    ],
    imagePolicy: {
      folder: '/images/nodejs-production-deployment-sealos/',
      webpOnly: true,
      width: 1440,
      height: 900,
    },
  },
  {
    slug: 'deploy-fastapi-sealos',
    framework: 'FastAPI',
    stage: 'beginner',
    series: 'sealos-skills-fastapi',
    seriesOrder: 1,
    ctaHref: 'https://os.sealos.io',
    sourceTag: 'stage-1-deploy',
    sourceUrl:
      'https://github.com/yangchuansheng/sealos-fastapi-tutorial/tree/stage-1-deploy',
    relatedTutorials: [
      'fastapi-postgresql-sealos',
      'fastapi-production-deployment-sealos',
    ],
    frontmatterPhrases: [
      'stage-1-deploy',
      'Runtime Truth Pass',
      '.sealos/template/index.yaml',
      '.sealos/state.json',
    ],
    bodyPhrases: [
      'FastAPI',
      'Swagger UI',
      '$sealos',
      '/sealos',
      'Runtime Truth Pass',
      '.sealos/analysis.json',
      '.sealos/template/index.yaml',
      '.sealos/state.json',
    ],
    imagePolicy: {
      folder: '/images/deploy-fastapi-sealos/',
      webpOnly: true,
      width: 1440,
      height: 900,
    },
  },
  {
    slug: 'fastapi-postgresql-sealos',
    framework: 'FastAPI',
    stage: 'advanced',
    series: 'sealos-skills-fastapi',
    seriesOrder: 2,
    ctaHref: '/sealos-skills',
    sourceTag: 'stage-2-postgresql',
    sourceUrl:
      'https://github.com/yangchuansheng/sealos-fastapi-tutorial/tree/stage-2-postgresql',
    relatedTutorials: [
      'deploy-fastapi-sealos',
      'fastapi-production-deployment-sealos',
    ],
    frontmatterPhrases: [
      'stage-2-postgresql',
      'PostgreSQL',
      'Alembic',
      'migration',
      'persistence',
    ],
    bodyPhrases: [
      'FastAPI',
      'PostgreSQL',
      'SQLAlchemy 2',
      'psycopg 3',
      'Alembic',
      '0001',
      '$sealos',
      '/sealos',
      'DEPLOY',
      'rollback',
    ],
    imagePolicy: {
      folder: '/images/fastapi-postgresql-sealos/',
      webpOnly: true,
      width: 1440,
      height: 900,
    },
  },
  {
    slug: 'fastapi-production-deployment-sealos',
    framework: 'FastAPI',
    stage: 'production',
    series: 'sealos-skills-fastapi',
    seriesOrder: 3,
    ctaHref: '/sealos-skills',
    sourceTag: 'stage-3-production',
    sourceUrl:
      'https://github.com/yangchuansheng/sealos-fastapi-tutorial/tree/stage-3-production',
    relatedTutorials: ['deploy-fastapi-sealos', 'fastapi-postgresql-sealos'],
    frontmatterPhrases: ['stage-3-production', 'Alembic', 'rollback', 'backup'],
    bodyPhrases: [
      'FastAPI',
      'PostgreSQL',
      'Alembic',
      '$sealos',
      '/sealos',
      'Runtime Truth Pass',
      '.sealos/state.json',
      'DEPLOY',
      'UPDATE',
      'rollback',
      'backup',
    ],
    imagePolicy: {
      folder: '/images/fastapi-production-deployment-sealos/',
      webpOnly: true,
      width: 1440,
      height: 900,
    },
  },
  {
    slug: 'deploy-django-sealos',
    framework: 'Django',
    stage: 'beginner',
    series: 'sealos-skills-django',
    seriesOrder: 1,
    ctaHref: 'https://os.sealos.io',
    sourceTag: 'stage-1-deploy',
    sourceUrl:
      'https://github.com/yangchuansheng/sealos-django-tutorial/tree/stage-1-deploy',
    relatedTutorials: [
      'django-postgresql-sealos',
      'django-production-deployment-sealos',
    ],
    frontmatterPhrases: [
      'stage-1-deploy',
      'Runtime Truth Pass',
      '.sealos/template/index.yaml',
      '.sealos/state.json',
    ],
    bodyPhrases: [
      'Django',
      'tasks.0001_initial',
      'Task Board',
      '$sealos',
      '/sealos',
      'Runtime Truth Pass',
      '.sealos/analysis.json',
      '.sealos/template/index.yaml',
      '.sealos/state.json',
    ],
    imagePolicy: {
      folder: '/images/deploy-django-sealos/',
      webpOnly: true,
      width: 1440,
      height: 900,
    },
  },
  {
    slug: 'django-postgresql-sealos',
    framework: 'Django',
    stage: 'advanced',
    series: 'sealos-skills-django',
    seriesOrder: 2,
    ctaHref: '/sealos-skills',
    sourceTag: 'stage-2-postgresql',
    sourceUrl:
      'https://github.com/yangchuansheng/sealos-django-tutorial/tree/stage-2-postgresql',
    relatedTutorials: [
      'deploy-django-sealos',
      'django-production-deployment-sealos',
    ],
    frontmatterPhrases: [
      'stage-2-postgresql',
      'PostgreSQL',
      'tasks.0001_initial',
      'migration',
      'persistence',
    ],
    bodyPhrases: [
      'Django',
      'PostgreSQL',
      'psycopg',
      'tasks.0001_initial',
      'Task Board',
      '$sealos',
      '/sealos',
      'DEPLOY',
      'rollback',
    ],
    imagePolicy: {
      folder: '/images/django-postgresql-sealos/',
      webpOnly: true,
      width: 1440,
      height: 900,
    },
  },
  {
    slug: 'django-production-deployment-sealos',
    framework: 'Django',
    stage: 'production',
    series: 'sealos-skills-django',
    seriesOrder: 3,
    ctaHref: '/sealos-skills',
    sourceTag: 'stage-3-production',
    sourceUrl:
      'https://github.com/yangchuansheng/sealos-django-tutorial/tree/stage-3-production',
    relatedTutorials: ['deploy-django-sealos', 'django-postgresql-sealos'],
    frontmatterPhrases: [
      'stage-3-production',
      'tasks.0001_initial',
      'rollback',
      'backup',
    ],
    bodyPhrases: [
      'Django',
      'PostgreSQL',
      'tasks.0001_initial',
      'Task Board',
      '/sealos',
      '.sealos/state.json',
      'DEPLOY',
      'UPDATE',
      'rollback',
      'backup',
    ],
    imagePolicy: {
      folder: '/images/django-production-deployment-sealos/',
      webpOnly: true,
      width: 1440,
      height: 900,
    },
  },
];

const expected = tutorialContracts.map((contract) => contract.slug);
const contractBySlug = new Map(
  tutorialContracts.map((contract) => [contract.slug, contract]),
);

const forbiddenBodyPatterns = [
  /^\*\*Meta title:/im,
  /^\*\*Meta description:/im,
  /^\*\*Estimated reading time:/im,
  /^\*\*Target keyword:/im,
  /^\*\*Secondary keywords:/im,
];

const forbiddenDirectSkillPatterns = [
  {
    label: '/sealos-deploy',
    pattern: /(^|[^A-Za-z0-9_-])\/sealos-deploy(?:\s|`|$)/m,
  },
  {
    label: '/sealos-database',
    pattern: /(^|[^A-Za-z0-9_-])\/sealos-database(?:\s|`|$)/m,
  },
  {
    label: '/sealos-s3',
    pattern: /(^|[^A-Za-z0-9_-])\/sealos-s3(?:\s|`|$)/m,
  },
  { label: 'skills.sh', pattern: /skills\.sh/ },
];

const forbiddenPublicPatterns = [
  {
    label: 'Screenshot placeholder: Phase 19',
    pattern: /Screenshot placeholder: Phase 19/,
  },
  { label: 'Phase 19 blocker', pattern: /Phase 19 blocker/ },
  { label: 'blocked-live-runtime', pattern: /blocked-live-runtime/ },
  { label: 'RBAC', pattern: /\bRBAC\b/ },
  {
    label: 'literal PostgreSQL credential',
    pattern: /postgresql:\/\/(?!USER:PASSWORD@HOST:PORT\/DATABASE)[^"'\s)]+/i,
  },
];

const errors = [];

function fail(message) {
  errors.push(message);
}

function normalizeYamlScalar(value) {
  return value.trim().replace(/^['"]|['"]$/g, '');
}

function readTutorial(slug) {
  const dir = join(tutorialDir, slug);
  const file = join(dir, 'index.en.mdx');
  if (!existsSync(file)) {
    fail(`${slug}: missing index.en.mdx`);
    return null;
  }
  const zhFile = join(dir, 'index.zh-cn.mdx');
  if (existsSync(zhFile)) {
    fail(`${slug}: must not publish index.zh-cn.mdx in v1`);
  }
  const raw = readFileSync(file, 'utf8');
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    fail(`${slug}: missing YAML frontmatter`);
    return null;
  }
  return { slug, raw, frontmatter: match[1], body: match[2], file };
}

function hasFrontmatterKey(frontmatter, key) {
  return new RegExp(`^${key}:`, 'm').test(frontmatter);
}

function parseScalar(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+?)\\s*$`, 'm'));
  return match ? normalizeYamlScalar(match[1]) : undefined;
}

function parseNumber(frontmatter, key) {
  const value = parseScalar(frontmatter, key);
  if (value === undefined) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function readList(frontmatter, key) {
  const lines = frontmatter.split('\n');
  const start = lines.findIndex((line) => line.trim() === `${key}:`);
  if (start === -1) return [];
  const items = [];
  for (const line of lines.slice(start + 1)) {
    if (/^[A-Za-z][A-Za-z0-9]*:/.test(line)) break;
    const item = line.match(/^\s*-\s*(.+?)\s*$/);
    if (item) items.push(normalizeYamlScalar(item[1]));
  }
  return items;
}

function parseNestedScalar(frontmatter, parentKey, childKey) {
  const lines = frontmatter.split('\n');
  const start = lines.findIndex((line) => line.trim() === `${parentKey}:`);
  if (start === -1) return undefined;
  for (const line of lines.slice(start + 1)) {
    if (/^[A-Za-z][A-Za-z0-9]*:/.test(line)) break;
    const match = line.match(new RegExp(`^\\s{2}${childKey}:\\s*(.+?)\\s*$`));
    if (match) return normalizeYamlScalar(match[1]);
  }
  return undefined;
}

function requireSourcePhrases(tutorial, field, phrases) {
  const source = tutorial[field];
  for (const phrase of phrases) {
    if (!source.includes(phrase)) {
      fail(`${tutorial.slug}: ${field} missing required phrase "${phrase}"`);
    }
  }
}

function forbidSourceMatches(tutorial, patterns) {
  for (const { label, pattern } of patterns) {
    if (pattern.test(tutorial.raw)) {
      fail(`${tutorial.slug}: contains forbidden source match ${label}`);
    }
  }
}

function collectTutorialLinkSlugs(raw) {
  return [...raw.matchAll(/\/tutorials\/([A-Za-z0-9-]+)/g)].map(
    (match) => match[1],
  );
}

function collectMarkdownLinks(raw) {
  return [...raw.matchAll(/\[([^\]]+)]\(([^)]+)\)/g)].map((match) => ({
    text: match[1],
    href: match[2],
  }));
}

function collectMarkdownImageRefs(raw) {
  return [...raw.matchAll(/!\[([^\]]*)]\(([^)]+)\)/g)].map((match) => ({
    alt: match[1],
    href: match[2],
  }));
}

function parseStringSet(source, name, fileLabel) {
  const match = source.match(
    new RegExp(
      `(?:export\\s+)?const\\s+${name}\\s*=\\s*new Set\\(\\[([\\s\\S]*?)\\]\\);`,
    ),
  );
  if (!match) {
    fail(`${fileLabel}: unable to parse ${name}`);
    return null;
  }

  const keys = [...match[1].matchAll(/'([^']+)'/g)].map(
    (keyMatch) => keyMatch[1],
  );
  const residue = match[1].replace(/'[^']+'\s*,?/g, '').replace(/[\s,]/g, '');
  if (residue) {
    fail(`${fileLabel}: ${name} must contain only string keys`);
    return null;
  }
  return keys;
}

function parseFrameworkKeys(source) {
  const match = source.match(
    /export const TUTORIAL_FRAMEWORKS = \[([\s\S]*?)\] as const satisfies/,
  );
  if (!match) {
    fail('tutorial-growth-data.ts: unable to parse TUTORIAL_FRAMEWORKS');
    return null;
  }
  return [...match[1].matchAll(/\bkey:\s*'([^']+)'/g)].map(
    (keyMatch) => keyMatch[1],
  );
}

function orderedValuesEqual(actual, expectedValues) {
  return (
    actual.length === expectedValues.length &&
    actual.every((value, index) => value === expectedValues[index])
  );
}

function getImageDimensions(path) {
  const buffer = readFileSync(path);
  if (buffer.toString('ascii', 0, 4) === 'RIFF') {
    const format = buffer.toString('ascii', 8, 12);
    if (format !== 'WEBP') {
      return { width: null, height: null };
    }
    const chunk = buffer.toString('ascii', 12, 16);
    if (chunk === 'VP8X') {
      return {
        width: 1 + buffer.readUIntLE(24, 3),
        height: 1 + buffer.readUIntLE(27, 3),
      };
    }
    if (chunk === 'VP8 ') {
      return {
        width: buffer.readUInt16LE(26) & 0x3fff,
        height: buffer.readUInt16LE(28) & 0x3fff,
      };
    }
    if (chunk === 'VP8L') {
      const b0 = buffer[21];
      const b1 = buffer[22];
      const b2 = buffer[23];
      const b3 = buffer[24];
      return {
        width: 1 + (((b1 & 0x3f) << 8) | b0),
        height: 1 + (((b3 & 0x0f) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6)),
      };
    }
  }
  return { width: null, height: null };
}

function publicPathForImageRef(ref) {
  if (!ref.startsWith('/')) return null;
  return join(root, 'public', ref.slice(1));
}

function validateRelatedTutorials(tutorial, contract, slugs) {
  const related = readList(tutorial.frontmatter, 'relatedTutorials');
  for (const relatedSlug of related) {
    if (!slugs.has(relatedSlug)) {
      fail(
        `${tutorial.slug}: relatedTutorials references unknown slug ${relatedSlug}`,
      );
    }
  }
  const expectedRelated = contract.relatedTutorials;
  if (related.length !== expectedRelated.length) {
    fail(
      `${tutorial.slug}: relatedTutorials expected ${expectedRelated.length} entries, found ${related.length}`,
    );
  }
  for (let index = 0; index < expectedRelated.length; index += 1) {
    if (related[index] !== expectedRelated[index]) {
      fail(
        `${tutorial.slug}: relatedTutorials[${index}] expected ${expectedRelated[index]}, found ${related[index] ?? 'missing'}`,
      );
    }
  }
}

function validateFrontmatterContract(tutorial, contract) {
  const scalarChecks = [
    ['framework', contract.framework],
    ['stage', contract.stage],
    ['series', contract.series],
  ];
  for (const [key, expectedValue] of scalarChecks) {
    const actual = parseScalar(tutorial.frontmatter, key);
    if (actual !== expectedValue) {
      fail(
        `${tutorial.slug}: frontmatter ${key} expected ${expectedValue}, found ${actual ?? 'missing'}`,
      );
    }
  }

  const seriesOrder = parseNumber(tutorial.frontmatter, 'seriesOrder');
  if (seriesOrder !== contract.seriesOrder) {
    fail(
      `${tutorial.slug}: frontmatter seriesOrder expected ${contract.seriesOrder}, found ${seriesOrder ?? 'missing'}`,
    );
  }

  const ctaHref = parseNestedScalar(tutorial.frontmatter, 'cta', 'href');
  if (ctaHref !== contract.ctaHref) {
    fail(
      `${tutorial.slug}: CTA href expected ${contract.ctaHref}, found ${ctaHref ?? 'missing'}`,
    );
  }

  requireSourcePhrases(tutorial, 'frontmatter', contract.frontmatterPhrases);
}

function validateProtectedSource(tutorial, contract) {
  if (!contract.sourceTag || !contract.sourceUrl) return;

  const protectedSourceLinks = collectMarkdownLinks(tutorial.body).filter(
    (link) => link.href === contract.sourceUrl,
  );
  if (protectedSourceLinks.length !== 1) {
    fail(
      `${tutorial.slug}: protected source ${contract.sourceTag} must link exactly once to ${contract.sourceUrl}`,
    );
  }
}

function validateImageReferences(tutorial, contract) {
  const imageRefs = collectMarkdownImageRefs(tutorial.body);
  const seen = new Set();
  const duplicates = new Set();

  for (const imageRef of imageRefs) {
    const ref = imageRef.href;
    if (!ref.startsWith('http') && !ref.startsWith('/')) {
      fail(`${tutorial.slug}: contains local image reference ${ref}`);
      continue;
    }
    if (!ref.startsWith('/')) continue;
    if (seen.has(ref)) duplicates.add(ref);
    seen.add(ref);

    const publicPath = publicPathForImageRef(ref);
    if (!publicPath || !existsSync(publicPath)) {
      fail(
        `${tutorial.slug}: image reference does not resolve to public asset ${ref}`,
      );
      continue;
    }

    if (!contract.imagePolicy.folder) continue;
    if (!ref.startsWith(contract.imagePolicy.folder)) {
      fail(
        `${tutorial.slug}: image reference ${ref} must start with ${contract.imagePolicy.folder}`,
      );
    }
    if (contract.imagePolicy.webpOnly && !ref.endsWith('.webp')) {
      fail(`${tutorial.slug}: image reference ${ref} must use .webp`);
    }

    const stats = statSync(publicPath);
    if (stats.size >= webpBudgetBytes) {
      fail(
        `${tutorial.slug}: image ${ref} is ${stats.size} bytes, expected below ${webpBudgetBytes}`,
      );
    }

    if (ref.endsWith('.webp')) {
      const dimensions = getImageDimensions(publicPath);
      if (
        dimensions.width !== contract.imagePolicy.width ||
        dimensions.height !== contract.imagePolicy.height
      ) {
        fail(
          `${tutorial.slug}: image ${ref} expected ${contract.imagePolicy.width}x${contract.imagePolicy.height}, found ${dimensions.width}x${dimensions.height}`,
        );
      }
    }
  }

  for (const duplicate of duplicates) {
    fail(`${tutorial.slug}: duplicate image reference ${duplicate}`);
  }

  if (contract.imagePolicy.folder) {
    if (imageRefs.length !== 4) {
      fail(
        `${tutorial.slug}: expected exactly 4 evidence image references, found ${imageRefs.length}`,
      );
    }
    if (seen.size !== 4) {
      fail(
        `${tutorial.slug}: expected exactly 4 unique evidence image references, found ${seen.size}`,
      );
    }
  }

  return imageRefs.map((imageRef) => imageRef.href);
}

function validatePublishedImageSet(tutorials) {
  const refsBySlug = new Map();
  for (const tutorial of tutorials) {
    if (!strictTutorialSlugs.has(tutorial.slug)) continue;
    refsBySlug.set(
      tutorial.slug,
      new Set(
        collectMarkdownImageRefs(tutorial.body).map((image) => image.href),
      ),
    );
  }

  for (const slug of strictTutorialSlugs) {
    const folder = join(root, 'public', 'images', slug);
    if (!existsSync(folder)) {
      fail(`${slug}: image folder is missing at public/images/${slug}`);
      continue;
    }
    const refs = refsBySlug.get(slug) ?? new Set();
    const files = readdirSync(folder, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith('.webp'))
      .map((entry) => `/images/${slug}/${entry.name}`)
      .sort();

    for (const fileRef of files) {
      if (!refs.has(fileRef)) {
        fail(`${slug}: unreferenced WebP asset ${fileRef}`);
      }
    }
    for (const ref of refs) {
      if (!files.includes(ref)) {
        fail(`${slug}: referenced WebP asset missing from folder ${ref}`);
      }
    }
  }
}

if (!existsSync(tutorialDir)) {
  fail('content/tutorials directory is missing');
} else {
  const extra = readdirSync(tutorialDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((slug) => !expected.includes(slug));
  if (extra.length > 0) {
    fail(
      `v1 must publish only expected tutorials; found extra directories: ${extra.join(', ')}`,
    );
  }
}

const tutorials = expected.map(readTutorial).filter(Boolean);
const slugs = new Set(tutorials.map((tutorial) => tutorial.slug));

for (const tutorial of tutorials) {
  const { slug, frontmatter, body, raw } = tutorial;
  const contract = contractBySlug.get(slug);
  if (!contract) {
    fail(`${slug}: missing tutorial contract`);
    continue;
  }

  for (const key of [
    'title',
    'description',
    'date',
    'updated',
    'stage',
    'framework',
    'series',
    'seriesOrder',
    'primaryKeyword',
    'targetKeywords',
    'tags',
    'authors',
    'relatedTutorials',
    'cta',
  ]) {
    if (!hasFrontmatterKey(frontmatter, key)) {
      fail(`${slug}: missing frontmatter key ${key}`);
    }
  }

  for (const forbidden of [
    'slug:',
    'content_type:',
    'primary_keyword:',
    'target_keywords:',
    'meta_title:',
    'meta_description:',
    'estimated_reading_time:',
    'related_articles:',
  ]) {
    if (hasFrontmatterKey(frontmatter, forbidden.replace(':', ''))) {
      fail(`${slug}: contains raw Obsidian key ${forbidden}`);
    }
  }

  for (const pattern of forbiddenBodyPatterns) {
    if (pattern.test(body)) {
      fail(`${slug}: body contains Obsidian SEO/admin line ${pattern}`);
    }
  }

  validateFrontmatterContract(tutorial, contract);
  validateProtectedSource(tutorial, contract);
  validateRelatedTutorials(tutorial, contract, slugs);
  validateImageReferences(tutorial, contract);

  if (
    raw.includes('/blog/deploy-nextjs-sealos') ||
    raw.includes('/blog/nextjs-postgresql-sealos') ||
    raw.includes('/blog/nextjs-production-deployment-sealos')
  ) {
    fail(`${slug}: contains blog URL for tutorial content`);
  }

  forbidSourceMatches(tutorial, forbiddenDirectSkillPatterns);
  forbidSourceMatches(tutorial, forbiddenPublicPatterns);
  requireSourcePhrases(tutorial, 'body', contract.bodyPhrases);

  if (!/(^|[^A-Za-z0-9_-])\/sealos(\s|`|$)/m.test(raw)) {
    fail(`${slug}: missing Claude Code /sealos plugin invocation`);
  }

  for (const tutorialSlug of collectTutorialLinkSlugs(raw)) {
    if (!slugs.has(tutorialSlug)) {
      fail(`${slug}: links to unknown tutorial slug ${tutorialSlug}`);
    }
  }

  const markdownLinks = collectMarkdownLinks(raw);
  for (const link of markdownLinks) {
    if (link.text.includes('Sealos Skills') && link.href !== '/sealos-skills') {
      fail(`${slug}: Sealos Skills link must use /sealos-skills`);
    }
    if (
      link.href.includes('sealos.io/docs') &&
      !link.href.startsWith('https://sealos.io/docs/')
    ) {
      fail(`${slug}: Sealos docs link must start with https://sealos.io/docs/`);
    }
  }
}

validatePublishedImageSet(tutorials);

const metadataPath = join(root, 'lib', 'utils', 'metadata.ts');
const tutorialMetadataPath = join(root, 'lib', 'utils', 'tutorial-metadata.ts');
const tutorialIndexPagePath = join(
  root,
  'app',
  '[lang]',
  '(home)',
  'tutorials',
  'page.tsx',
);
const tutorialGrowthDataPath = join(
  root,
  'app',
  '[lang]',
  '(home)',
  'tutorials',
  'tutorial-growth-data.ts',
);
const tutorialFrameworkMatrixPath = join(
  root,
  'app',
  '[lang]',
  '(home)',
  'tutorials',
  'TutorialFrameworkMatrix.tsx',
);
const sitemapPath = join(root, 'app', 'sitemap.ts');
const sourcePath = join(root, 'lib', 'source.ts');
const headerPath = join(root, 'new-components', 'Header.tsx');
const forcedDarkModePath = join(
  root,
  'app',
  '[lang]',
  'utils',
  'is-forced-dark-mode.ts',
);

for (const [name, path] of [
  ['metadata.ts', metadataPath],
  ['tutorial-metadata.ts', tutorialMetadataPath],
  ['tutorials/page.tsx', tutorialIndexPagePath],
  ['tutorial-growth-data.ts', tutorialGrowthDataPath],
  ['TutorialFrameworkMatrix.tsx', tutorialFrameworkMatrixPath],
  ['sitemap.ts', sitemapPath],
  ['source.ts', sourcePath],
  ['Header.tsx', headerPath],
  ['is-forced-dark-mode.ts', forcedDarkModePath],
]) {
  if (!existsSync(path)) {
    fail(`${name}: missing`);
  }
}

if (existsSync(metadataPath)) {
  const metadata = readFileSync(metadataPath, 'utf8');
  if (!metadata.includes('generateTutorialMetadata'))
    fail('metadata.ts: missing generateTutorialMetadata export');
}

if (existsSync(tutorialMetadataPath)) {
  const metadata = readFileSync(tutorialMetadataPath, 'utf8');
  if (!metadata.includes('generateTutorialMetadata'))
    fail('tutorial-metadata.ts: missing generateTutorialMetadata');
  if (!metadata.includes('Sealos Tutorials'))
    fail(
      'tutorial-metadata.ts: tutorial metadata must use Sealos Tutorials suffix',
    );
  if (!metadata.includes('/tutorials'))
    fail('tutorial-metadata.ts: missing tutorials canonical path handling');
}

if (existsSync(tutorialIndexPagePath)) {
  const page = readFileSync(tutorialIndexPagePath, 'utf8');
  if (!page.includes('Sealos Deployment Tutorials')) {
    fail(
      'tutorials/page.tsx: index metadata must target expanded deployment tutorial intent',
    );
  }
  const requiredCatalogCopy = [
    'Next.js, React, Node.js, FastAPI, and Django',
    'Next.js, React, Node.js, FastAPI, or Django',
    'React deployment tutorials',
    'Node.js deployment tutorials',
    'FastAPI deployment tutorials',
    'Django deployment tutorials',
    'deploy FastAPI on Sealos',
    'deploy Django on Sealos',
    'FastAPI PostgreSQL deployment',
    'Django PostgreSQL deployment',
    'FastAPI production deployment',
    'Django production deployment',
  ];
  if (requiredCatalogCopy.some((phrase) => !page.includes(phrase))) {
    fail(
      'tutorials/page.tsx: missing five-framework catalog metadata and hero copy',
    );
  }
  if (!page.includes('languageAlternates: false')) {
    fail(
      'tutorials/page.tsx: English-only tutorial index must disable hreflang alternates',
    );
  }
  if (
    !page.includes("'@type': 'CollectionPage'") ||
    !page.includes("'@type': 'ItemList'")
  ) {
    fail(
      'tutorials/page.tsx: tutorial index must expose CollectionPage ItemList schema',
    );
  }
  if (!page.includes('StructuredDataComponent')) {
    fail('tutorials/page.tsx: missing tutorial index structured data renderer');
  }
  if (
    !page.includes("params.lang !== 'en'") ||
    !page.includes('index: false')
  ) {
    fail(
      'tutorials/page.tsx: non-English tutorial index export must be noindex',
    );
  }
}

if (existsSync(tutorialGrowthDataPath)) {
  const growthData = readFileSync(tutorialGrowthDataPath, 'utf8');
  const availableKeys = parseStringSet(
    growthData,
    'AVAILABLE_FRAMEWORK_KEYS',
    'tutorial-growth-data.ts',
  );
  const comingNextKeys = parseStringSet(
    growthData,
    'COMING_NEXT_FRAMEWORK_KEYS',
    'tutorial-growth-data.ts',
  );
  const frameworkKeys = parseFrameworkKeys(growthData);
  const expectedAvailableKeys = [
    'nextjs',
    'react',
    'nodejs',
    'fastapi',
    'django',
  ];
  const expectedComingNextKeys = ['go', 'spring-boot'];

  if (
    availableKeys &&
    !orderedValuesEqual(availableKeys, expectedAvailableKeys)
  ) {
    fail(
      'tutorial-growth-data.ts: available framework keys must be exactly nextjs, react, nodejs, fastapi, django',
    );
  }
  if (
    comingNextKeys &&
    !orderedValuesEqual(comingNextKeys, expectedComingNextKeys)
  ) {
    fail(
      'tutorial-growth-data.ts: coming-next framework keys must be exactly go, spring-boot',
    );
  }

  if (availableKeys && comingNextKeys && frameworkKeys) {
    const availableSet = new Set(availableKeys);
    const comingNextSet = new Set(comingNextKeys);
    const availableCount = frameworkKeys.filter((key) =>
      availableSet.has(key),
    ).length;
    const comingNextCount = frameworkKeys.filter((key) =>
      comingNextSet.has(key),
    ).length;
    const plannedCount =
      frameworkKeys.length - availableCount - comingNextCount;
    if (
      availableCount * 3 !== 15 ||
      comingNextCount * 3 !== 6 ||
      plannedCount * 3 !== 33
    ) {
      fail(
        'tutorial-growth-data.ts: derived inventory must contain 15 available, 6 coming-next, and 33 planned cells',
      );
    }
  }

  if (
    !growthData.includes("pathNote: 'Complete API and AI service path'") ||
    !growthData.includes("pathNote: 'Complete backend product path'")
  ) {
    fail(
      'tutorial-growth-data.ts: FastAPI and Django must identify complete public paths',
    );
  }
}

if (existsSync(tutorialFrameworkMatrixPath)) {
  const matrix = readFileSync(tutorialFrameworkMatrixPath, 'utf8');
  if (
    !matrix.includes('Five complete public paths link directly') ||
    !matrix.includes('Remaining entries collect demand')
  ) {
    fail(
      'TutorialFrameworkMatrix.tsx: missing five-framework availability explanation',
    );
  }
}

if (existsSync(sourcePath)) {
  const source = readFileSync(sourcePath, 'utf8');
  if (!source.includes('tutorials'))
    fail('source.ts: missing tutorials loader/export');
  if (!source.includes("baseUrl: '/tutorials'"))
    fail('source.ts: tutorials loader must use /tutorials baseUrl');
}

if (existsSync(sitemapPath)) {
  const sitemap = readFileSync(sitemapPath, 'utf8');
  if (!sitemap.includes('/tutorials'))
    fail('sitemap.ts: missing /tutorials entries');
  if (!sitemap.includes('tutorialPages'))
    fail('sitemap.ts: missing tutorialPages collection');
}

if (existsSync(headerPath)) {
  const header = readFileSync(headerPath, 'utf8');
  if (!header.includes('Tutorials') || !header.includes('/tutorials')) {
    fail('Header.tsx: Resources menu missing Tutorials link');
  }
}

if (existsSync(forcedDarkModePath)) {
  const forcedDarkMode = readFileSync(forcedDarkModePath, 'utf8');
  if (
    !forcedDarkMode.includes("path: '/tutorials'") ||
    !forcedDarkMode.includes("match: 'prefix'")
  ) {
    fail(
      'is-forced-dark-mode.ts: /tutorials must force dark mode like homepage',
    );
  }
}

const outZhTutorialDir = join(root, 'out', 'zh-cn', 'tutorials');
if (existsSync(outZhTutorialDir)) {
  for (const slug of expected) {
    const detailPath = join(outZhTutorialDir, slug, 'index.html');
    if (!existsSync(detailPath)) continue;

    const html = readFileSync(detailPath, 'utf8');
    const isNonIndexedError =
      html.includes('noindex') &&
      (html.includes('id="__next_error__"') || html.includes('NEXT_NOT_FOUND'));

    if (!isNonIndexedError) {
      fail(
        `out/zh-cn/tutorials/${slug}: localized tutorial detail must remain a non-indexed error export`,
      );
    }
  }
}

if (errors.length > 0) {
  console.error(`validate-tutorials failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `validate-tutorials passed: ${tutorials.length} tutorial pages checked.`,
);
