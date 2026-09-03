#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import yaml from 'js-yaml';

const root = process.cwd();
const tutorialDir = join(root, 'content', 'tutorials');
const errors = [];
const requiredKeys = [
  'title',
  'description',
  'slug',
  'date',
  'updated',
  'stage',
  'framework',
  'runtime',
  'sidebar_title',
  'tags',
  'authors',
  'related',
];
const internalKeys = [
  'series',
  'seriesOrder',
  'primaryKeyword',
  'targetKeywords',
  'relatedTutorials',
  'cta',
  'content_type',
  'primary_keyword',
  'target_keywords',
  'meta_title',
  'meta_description',
  'estimated_reading_time',
  'related_articles',
];
const djangoDeployPath = '/tutorials/django/deploy/';
const djangoImages = [
  '/images/tutorials/django/django-sealos-project-ops-running.webp',
  '/images/tutorials/django/django-sealos-live-app-https-proof.webp',
];

function fail(message) {
  errors.push(message);
}

function findTutorialFiles(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return findTutorialFiles(path);
    if (entry.name === 'index.zh-cn.mdx') {
      fail(
        `${relative(tutorialDir, path)}: Chinese tutorial variants are not published`,
      );
    }
    return entry.name === 'index.en.mdx' ? [path] : [];
  });
}

function parseTutorial(file) {
  const raw = readFileSync(file, 'utf8');
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    fail(`${relative(root, file)}: missing YAML frontmatter`);
    return null;
  }

  let data;
  try {
    data = yaml.load(match[1]);
  } catch (error) {
    fail(`${relative(root, file)}: invalid YAML frontmatter: ${error.message}`);
    return null;
  }

  const route = relative(tutorialDir, dirname(file)).split(sep).join('/');
  return {
    body: match[2],
    data,
    file,
    route,
    expectedPath: `/tutorials/${route}/`,
  };
}

function collectMarkdownLinks(body) {
  return [...body.matchAll(/\[([^\]]+)]\(([^)]+)\)/g)].map((match) => ({
    text: match[1],
    href: match[2],
  }));
}

function collectMarkdownImages(body) {
  return [...body.matchAll(/!\[([^\]]*)]\(([^)]+)\)/g)].map((match) => ({
    alt: match[1],
    href: match[2],
  }));
}

function normalizeTutorialPath(path) {
  const clean = path.split(/[?#]/)[0].replace(/\/+$/, '');
  return `${clean}/`;
}

function headingIds(body) {
  return new Set(
    [...body.matchAll(/^#{2,6}\s+(.+)$/gm)].map((match) =>
      match[1]
        .replace(/[`*_]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-'),
    ),
  );
}

function getWebpDimensions(path) {
  const buffer = readFileSync(path);
  if (
    buffer.toString('ascii', 0, 4) !== 'RIFF' ||
    buffer.toString('ascii', 8, 12) !== 'WEBP'
  ) {
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
  return { width: null, height: null };
}

function validateFrontmatter(tutorial) {
  for (const key of requiredKeys) {
    if (tutorial.data?.[key] === undefined) {
      fail(`${tutorial.expectedPath}: missing public frontmatter key ${key}`);
    }
  }
  for (const key of internalKeys) {
    if (tutorial.data?.[key] !== undefined) {
      fail(
        `${tutorial.expectedPath}: contains internal frontmatter key ${key}`,
      );
    }
  }
  if (tutorial.data?.slug !== tutorial.expectedPath) {
    fail(
      `${tutorial.expectedPath}: frontmatter slug must match its content path, found ${tutorial.data?.slug ?? 'missing'}`,
    );
  }
  if (!['beginner', 'advanced', 'production'].includes(tutorial.data?.stage)) {
    fail(
      `${tutorial.expectedPath}: invalid tutorial stage ${tutorial.data?.stage}`,
    );
  }
  for (const key of ['tags', 'authors', 'related']) {
    if (!Array.isArray(tutorial.data?.[key])) {
      fail(`${tutorial.expectedPath}: ${key} must be a list`);
    }
  }
}

function validateReferences(tutorial, publishedPaths) {
  const references = [
    ...(Array.isArray(tutorial.data?.related) ? tutorial.data.related : []),
    ...(tutorial.data?.next ? [tutorial.data.next] : []),
  ];
  for (const path of references) {
    if (!publishedPaths.has(normalizeTutorialPath(path))) {
      fail(`${tutorial.expectedPath}: references unpublished tutorial ${path}`);
    }
  }

  for (const link of collectMarkdownLinks(tutorial.body)) {
    if (
      link.href.startsWith('/tutorials/') &&
      !publishedPaths.has(normalizeTutorialPath(link.href))
    ) {
      fail(
        `${tutorial.expectedPath}: links to unpublished tutorial ${link.href}`,
      );
    }
  }

  for (const image of collectMarkdownImages(tutorial.body)) {
    if (!image.alt.trim()) {
      fail(
        `${tutorial.expectedPath}: image ${image.href} needs alternative text`,
      );
    }
    if (image.href.startsWith('/')) {
      const imagePath = join(root, 'public', image.href.slice(1));
      if (!existsSync(imagePath) || !statSync(imagePath).isFile()) {
        fail(
          `${tutorial.expectedPath}: image does not resolve to ${image.href}`,
        );
      }
    }
  }
}

function validateEntrypoints(tutorial) {
  if (!tutorial.data?.entrypoints) return;
  const ids = headingIds(tutorial.body);
  for (const [name, anchor] of Object.entries(tutorial.data.entrypoints)) {
    if (typeof anchor !== 'string' || !anchor.startsWith('#')) {
      fail(`${tutorial.expectedPath}: entrypoint ${name} must be an anchor`);
      continue;
    }
    if (!ids.has(anchor.slice(1))) {
      fail(
        `${tutorial.expectedPath}: entrypoint ${name} does not resolve to ${anchor}`,
      );
    }
  }
}

function validateDjangoDeploy(tutorial) {
  if (tutorial.data?.slug !== djangoDeployPath) return;
  const requiredPhrases = [
    '## Create a Django Task app',
    '## Prepare Django for production',
    'gunicorn',
    'whitenoise',
    'DATABASE_URL',
    'makemigrations --check',
    'check --deploy --fail-level ERROR',
    'collectstatic --noinput',
    'local Codex',
    '$sealos deploy this repo to Sealos Cloud.',
    'Sealos web interface',
  ];
  for (const phrase of requiredPhrases) {
    if (!tutorial.body.includes(phrase)) {
      fail(`${djangoDeployPath}: missing required workflow phrase ${phrase}`);
    }
  }
  if (/^#\s+/m.test(tutorial.body)) {
    fail(
      `${djangoDeployPath}: body must leave the page H1 to the Tutorial Detail Shell`,
    );
  }
  if (/\b(?:kubectl|StatefulSet)\b/.test(tutorial.body)) {
    fail(
      `${djangoDeployPath}: deployment flow must use Sealos Skills and product operations`,
    );
  }

  const imageRefs = collectMarkdownImages(tutorial.body).map(
    (image) => image.href,
  );
  for (const image of djangoImages) {
    if (!imageRefs.includes(image)) {
      fail(`${djangoDeployPath}: missing required screenshot ${image}`);
      continue;
    }
    const imagePath = join(root, 'public', image.slice(1));
    if (!existsSync(imagePath)) continue;
    const dimensions = getWebpDimensions(imagePath);
    if (dimensions.width !== 3200 || dimensions.height !== 1800) {
      fail(
        `${djangoDeployPath}: screenshot ${image} must be 3200x1800, found ${dimensions.width}x${dimensions.height}`,
      );
    }
  }
}

if (!existsSync(tutorialDir)) fail('content/tutorials directory is missing');

const tutorials = findTutorialFiles(tutorialDir)
  .map(parseTutorial)
  .filter(Boolean);
if (tutorials.length !== 1) {
  fail(`expected 1 published tutorial page, found ${tutorials.length}`);
}

const publishedPaths = new Set(
  tutorials.map((tutorial) => tutorial.expectedPath),
);
if (publishedPaths.size !== tutorials.length)
  fail('tutorial canonical paths must be unique');

for (const tutorial of tutorials) {
  validateFrontmatter(tutorial);
  validateReferences(tutorial, publishedPaths);
  validateEntrypoints(tutorial);
  validateDjangoDeploy(tutorial);
}

for (const path of [
  'app/[lang]/(home)/tutorials/[...slug]/layout.tsx',
  'app/[lang]/(home)/tutorials/[...slug]/page.tsx',
  'lib/utils/tutorial-metadata.ts',
  'lib/utils/tutorial-utils.ts',
]) {
  if (!existsSync(join(root, path)))
    fail(`${path}: missing tutorial integration`);
}

if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log(
  `validate-tutorials passed: ${tutorials.length} tutorial page checked.`,
);
