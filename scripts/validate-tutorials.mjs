#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const tutorialDir = join(root, 'content', 'tutorials');
const expected = [
  'deploy-nextjs-sealos',
  'nextjs-postgresql-sealos',
  'nextjs-production-deployment-sealos',
];

const forbiddenBodyPatterns = [
  /^\*\*Meta title:/im,
  /^\*\*Meta description:/im,
  /^\*\*Estimated reading time:/im,
  /^\*\*Target keyword:/im,
  /^\*\*Secondary keywords:/im,
];

const errors = [];

function fail(message) {
  errors.push(message);
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
  return { slug, raw, frontmatter: match[1], body: match[2] };
}

function hasFrontmatterKey(frontmatter, key) {
  return new RegExp(`^${key}:`, 'm').test(frontmatter);
}

function readList(frontmatter, key) {
  const lines = frontmatter.split('\n');
  const start = lines.findIndex((line) => line.trim() === `${key}:`);
  if (start === -1) return [];
  const items = [];
  for (const line of lines.slice(start + 1)) {
    if (/^[A-Za-z][A-Za-z0-9]*:/.test(line)) break;
    const item = line.match(/^\s*-\s*(.+?)\s*$/);
    if (item) items.push(item[1].replace(/^['"]|['"]$/g, ''));
  }
  return items;
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

const frontmatterContracts = {
  'deploy-nextjs-sealos': [
    'Runtime Truth Pass',
    '.sealos/template/index.yaml',
    '.sealos/state.json',
  ],
  'nextjs-postgresql-sealos': [
    'generated PostgreSQL resource',
    'actual database env key',
    'Runtime Truth Pass',
    'read/write',
  ],
  'nextjs-production-deployment-sealos': [
    'Runtime Truth Pass',
    'DEPLOY',
    'UPDATE',
    '.sealos/state.json',
    'live Kubernetes Deployment',
    'rollback',
    'backups',
  ],
};

const forbiddenDirectSkillPatterns = [
  { label: '/sealos-deploy', pattern: /\/sealos-deploy/ },
  { label: '/sealos-database', pattern: /\/sealos-database/ },
  { label: '/sealos-s3', pattern: /\/sealos-s3/ },
  { label: 'skills.sh', pattern: /skills\.sh/ },
];

for (const tutorial of tutorials) {
  const { slug, frontmatter, body, raw } = tutorial;
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

  for (const imageRef of body.matchAll(/!\[[^\]]*]\(([^)]+)\)/g)) {
    const ref = imageRef[1];
    if (!ref.startsWith('http') && !ref.startsWith('/')) {
      fail(`${slug}: contains local image reference ${ref}`);
    }
  }

  const related = readList(frontmatter, 'relatedTutorials');
  for (const relatedSlug of related) {
    if (!slugs.has(relatedSlug)) {
      fail(`${slug}: relatedTutorials references unknown slug ${relatedSlug}`);
    }
  }

  if (
    raw.includes('/blog/deploy-nextjs-sealos') ||
    raw.includes('/blog/nextjs-postgresql-sealos') ||
    raw.includes('/blog/nextjs-production-deployment-sealos')
  ) {
    fail(`${slug}: contains blog URL for tutorial content`);
  }

  requireSourcePhrases(
    tutorial,
    'frontmatter',
    frontmatterContracts[slug] ?? [],
  );
  forbidSourceMatches(tutorial, forbiddenDirectSkillPatterns);

  requireSourcePhrases(tutorial, 'raw', ['$sealos']);
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

  if (slug === 'deploy-nextjs-sealos') {
    if (!frontmatter.includes('href: "https://os.sealos.io"')) {
      fail(`${slug}: beginner cloud signup CTA must use https://os.sealos.io`);
    }
  } else if (!/^  href: ["']?\/sealos-skills["']?$/m.test(frontmatter)) {
    fail(`${slug}: Sealos Skills CTA must use /sealos-skills`);
  }
}

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
      'tutorial-metadata.ts: tutorial metadata must not use Sealos Blog suffix',
    );
  if (!metadata.includes('/tutorials'))
    fail('tutorial-metadata.ts: missing tutorials canonical path handling');
}

if (existsSync(tutorialIndexPagePath)) {
  const page = readFileSync(tutorialIndexPagePath, 'utf8');
  if (!page.includes('Next.js Deployment Tutorials')) {
    fail(
      'tutorials/page.tsx: index metadata must target deployment tutorial intent',
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
