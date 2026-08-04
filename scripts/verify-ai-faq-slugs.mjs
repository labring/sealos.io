import assert from 'node:assert/strict';
import {
  getFAQPageSlug,
  resolveFAQPageBySlug,
} from '../lib/utils/faq-slug.mjs';
import { groupByNormalizedSlug, loadFAQPages } from './ai-faq-fixture.mjs';

const pages = await loadFAQPages();

assert.equal(
  pages.length,
  2000,
  'the source collection must contain 2,000 pages',
);

const collisionGroups = groupByNormalizedSlug(pages);

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

const uniqueGroupEntry = [...collisionGroups.entries()].find(
  ([, group]) => group.length === 1,
);
assert.ok(
  uniqueGroupEntry,
  'the fixture must contain a unique normalized slug',
);
const [uniqueSlug, uniqueGroup] = uniqueGroupEntry;
assert.equal(
  resolveFAQPageBySlug(pages, uniqueSlug),
  uniqueGroup[0],
  'an unnumbered unique slug should retain compatibility',
);

console.log(
  `Verified ${pages.length} exact slugs and rejected ${ambiguousGroups.length} ambiguous normalized groups.`,
);
