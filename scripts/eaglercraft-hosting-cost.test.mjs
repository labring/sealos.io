import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const articlePath = new URL(
  '../content/blog/(app-deployment)/eaglercraft-hosting-cost/index.en.mdx',
  import.meta.url,
);
const tutorialPath = new URL(
  '../content/blog/(app-deployment)/eaglercraft-server/index.en.mdx',
  import.meta.url,
);
const guidePath = new URL(
  '../app/[lang]/products/app-store/[slug]/components/eaglercraft-guide.tsx',
  import.meta.url,
);

test('cost guide article exists with required structure and boundaries', () => {
  assert.ok(existsSync(articlePath), 'article file exists');
  const raw = readFileSync(articlePath, 'utf8');
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  assert.ok(match, 'frontmatter present');
  const [, frontmatter, body] = match;
  assert.ok(
    frontmatter.includes(
      "'Eaglercraft Hosting Costs: Free Options, Paid Plans, and Setup Trade-offs'",
    ),
  );
  assert.ok(
    frontmatter.includes(
      "seoTitle: 'Eaglercraft Hosting Costs: Free and Paid Options'",
    ),
  );

  // Fumadocs renders the frontmatter title as the page's single H1.
  assert.ok(!/^#\s+/m.test(body), 'body leaves the H1 to the title');

  for (const heading of [
    '## What a Complete Hosting Offer Needs',
    '## Free, Paid and Self-Managed Paths',
    '## Understand the Payment Before Comparing Resources',
    '## How Sealos Plan and Allocation Costs Fit Together',
    '## Results for Two, Five and Ten Players',
    '## Setup, Availability and World Recovery',
    "## Choose Around Your Group's Next Month of Play",
  ])
    assert.ok(body.includes(heading), heading);

  // The shared ArticleFaq renderer supplies the FAQ heading from frontmatter.
  assert.equal((frontmatter.match(/^  - question:/gm) || []).length, 5);
  assert.ok(
    !/^##\s+FAQ/m.test(body),
    'body leaves the FAQ heading to ArticleFaq',
  );

  for (const text of [
    '**Documentary',
    '**Practice Evidence**',
    '**Introductory Price:**',
    '**Regular Listed Price:**',
    '**Actual Hosting Charge:**',
    '**Resource Plan**',
    '**Server Allocation**',
    '**Lowest Passing Offer**',
    '**Persistent World**',
    '**Recovery Copy**',
    '**Restored World**',
    'TPS of at least 19',
    '95% of sampled points',
    'checked September 14, 2026',
    '[Eagler.Host service page](https://eagler.host/)',
    'https://topeaglerservers.com/terms-of-service',
    'https://hostinghaven.us/cloudhosting/Games/eaglercraft',
    'https://hostinghaven.us/service-level-agreement',
    'https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm',
    'https://sealos.io/pricing/',
    '[Follow the Setup Guide](/blog/eaglercraft-server/)',
    '[Deploy an Eaglercraft Server on Sealos](/products/app-store/eaglercraft-server/)',
    'Treat any\nminimum-cost claim as unverified',
  ])
    assert.ok(body.includes(text), text);

  // Evidence-label integrity: observed paired runs remain absent from the article.
  assert.ok(body.includes('have yet to be produced'));
  assert.ok(!body.includes('passed the ten-player workload'));
  assert.ok(!body.includes('Lowest Passing Offer:'));
});

test('tutorial and template page link to the cost guide', () => {
  const tutorial = readFileSync(tutorialPath, 'utf8');
  assert.ok(
    tutorial.includes(
      '[Eaglercraft Hosting Costs: Free Options, Paid Plans, and Setup Trade-offs](/blog/eaglercraft-hosting-cost/)',
    ),
  );
  const guide = readFileSync(guidePath, 'utf8');
  assert.ok(guide.includes('href="/blog/eaglercraft-hosting-cost/"'));
  assert.ok(guide.includes('Eaglercraft Hosting Costs'));
});
