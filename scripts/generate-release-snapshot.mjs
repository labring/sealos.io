#!/usr/bin/env node
/**
 * Refresh the committed snapshot of published Brain releases shown on /release.
 *
 * The releases page server-renders this snapshot so the full list is always
 * visible (and crawlable), then attempts a browser-side refresh from the
 * GitHub API on every visit. Run this script whenever releases should be
 * re-snapshotted; set GITHUB_TOKEN or GH_TOKEN to raise the API rate limit
 * from 60 to 5000 requests per hour.
 *
 * Usage: node scripts/generate-release-snapshot.mjs
 * Output: app/[lang]/(home)/release/releases-snapshot.json
 */

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const GITHUB_RELEASES_URL =
  'https://api.github.com/repos/labring/brain/releases?per_page=30';
const OUTPUT_PATH = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'app',
  '[lang]',
  '(home)',
  'release',
  'releases-snapshot.json',
);

const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;

async function fetchPublishedReleases() {
  const headers = { Accept: 'application/vnd.github+json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(GITHUB_RELEASES_URL, { headers });

  if (!response.ok) {
    throw new Error(`GitHub API responded with ${response.status}`);
  }

  const releases = await response.json();

  return releases
    .filter((release) => !release.draft && !release.prerelease)
    .map((release) => ({
      version: release.tag_name,
      publishedAt: release.published_at,
      href: release.html_url,
      body: release.body ?? '',
    }));
}

async function main() {
  console.log(`[release-snapshot] Fetching ${GITHUB_RELEASES_URL}`);

  const releases = await fetchPublishedReleases();

  if (releases.length === 0) {
    throw new Error('GitHub API returned no published releases');
  }

  writeFileSync(OUTPUT_PATH, `${JSON.stringify(releases, null, 2)}\n`);
  console.log(
    `[release-snapshot] Wrote ${releases.length} releases to ${OUTPUT_PATH}`,
  );
}

main().catch((error) => {
  console.error('[release-snapshot] Failed:', error.message);
  process.exit(1);
});
