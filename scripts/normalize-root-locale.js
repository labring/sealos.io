#!/usr/bin/env node

/**
 * Ensure static export serves English at root without redirecting to /en.
 *
 * Strategy:
 * - After `next build` (with `output: export`), copy `out/en/*` into `out/*`.
 * - This makes `/` and other root-level paths serve English content directly.
 */

const fs = require('fs/promises');
const path = require('path');

async function pathExists(target) {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const locale = process.env.ROOT_DEFAULT_LOCALE || 'en';
  const outDir = path.resolve(process.cwd(), 'out');
  const localeDir = path.join(outDir, locale);

  if (!(await pathExists(outDir))) {
    console.warn('[normalize-root-locale] out directory not found, skip.');
    return;
  }

  if (!(await pathExists(localeDir))) {
    console.warn(
      `[normalize-root-locale] locale directory "${localeDir}" not found, skip.`,
    );
    return;
  }

  const entries = await fs.readdir(localeDir);

  for (const entry of entries) {
    const src = path.join(localeDir, entry);
    const dest = path.join(outDir, entry);
    await fs.cp(src, dest, { recursive: true, force: true });
  }

  console.log(
    `[normalize-root-locale] copied ${locale}/ content to root export directory.`,
  );
}

main().catch((error) => {
  console.error('[normalize-root-locale] failed:', error);
  process.exit(1);
});
