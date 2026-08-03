import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import ts from 'typescript';

const resolverSource = await readFile(resolve('lib/utils/faq-slug.ts'), 'utf8');
const resolverCode = ts.transpileModule(resolverSource, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const { getFAQPageSlug, normalizeFAQSlug, resolveFAQPageBySlug } = await import(
  `data:text/javascript;base64,${Buffer.from(resolverCode).toString('base64')}`
);

const sourceDirectory = resolve('content/ai-quick-reference');
const sourceFiles = (await readdir(sourceDirectory))
  .filter((file) => file.endsWith('.en.json'))
  .sort();
const pages = [];
for (const file of sourceFiles) {
  pages.push({
    url: `/ai-quick-reference/${file.slice(0, -'.en.json'.length)}`,
    data: JSON.parse(await readFile(resolve(sourceDirectory, file), 'utf8')),
  });
}

assert.equal(
  pages.length,
  2000,
  'the source collection must contain 2,000 pages',
);

const collisionGroups = new Map();
for (const page of pages) {
  const normalizedSlug = normalizeFAQSlug(getFAQPageSlug(page));
  const group = collisionGroups.get(normalizedSlug) || [];
  group.push(page);
  collisionGroups.set(normalizedSlug, group);
}

for (const page of pages) {
  assert.equal(
    resolveFAQPageBySlug(pages, getFAQPageSlug(page)),
    page,
    `exact slug should resolve to ${getFAQPageSlug(page)}`,
  );
}

const ambiguousGroups = [...collisionGroups.entries()].filter(
  ([, group]) => group.length > 1,
);
assert.ok(
  ambiguousGroups.length > 0,
  'the fixture must contain a normalized slug collision',
);
for (const [normalizedSlug] of ambiguousGroups) {
  assert.equal(
    resolveFAQPageBySlug(pages, normalizedSlug),
    undefined,
    `ambiguous normalized slug must not resolve: ${normalizedSlug}`,
  );
}

const [collisionSlug] = ambiguousGroups[0];
assert.equal(
  resolveFAQPageBySlug(pages, `999-${collisionSlug}`),
  undefined,
  'an unknown numbered slug must not fall through to a normalized candidate',
);
assert.equal(
  resolveFAQPageBySlug(pages, 'what-is-sealos'),
  undefined,
  'a missing slug must remain unresolved',
);

const uniqueGroup = [...collisionGroups.values()].find(
  (group) => group.length === 1,
);
assert.ok(uniqueGroup, 'the fixture must contain a unique normalized slug');
assert.equal(
  resolveFAQPageBySlug(pages, normalizeFAQSlug(getFAQPageSlug(uniqueGroup[0]))),
  uniqueGroup[0],
  'an unnumbered unique slug should retain compatibility',
);

console.log(
  `Verified ${pages.length} exact slugs and rejected ${ambiguousGroups.length} ambiguous normalized groups.`,
);
