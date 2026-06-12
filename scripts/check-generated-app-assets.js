#!/usr/bin/env node

const fs = require('fs');
const { execFileSync } = require('child_process');

const GENERATED_ASSET_PATHS = [
  'config/apps.json',
  'config/template-sources.json',
  'public/images/apps',
];

function parseArgs(argv = process.argv.slice(2)) {
  return {
    allowChanges: argv.includes('--allow-changes'),
  };
}

function readJsonFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function hasDeterministicJsonFormatting(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const parsed = JSON.parse(raw);
  const formatted = JSON.stringify(parsed, null, 2);
  return raw === formatted || raw === `${formatted}\n`;
}

function validateGeneratedJson({
  appsPath = 'config/apps.json',
  templateSourcesPath = 'config/template-sources.json',
} = {}) {
  const apps = readJsonFile(appsPath);
  const templateSources = readJsonFile(templateSourcesPath);

  if (!Array.isArray(apps)) {
    throw new Error(`${appsPath} must contain an array`);
  }

  if (!templateSources || Array.isArray(templateSources)) {
    throw new Error(`${templateSourcesPath} must contain an object`);
  }

  if (!hasDeterministicJsonFormatting(appsPath)) {
    throw new Error(`${appsPath} must use two-space JSON formatting`);
  }

  if (!hasDeterministicJsonFormatting(templateSourcesPath)) {
    throw new Error(
      `${templateSourcesPath} must use two-space JSON formatting`,
    );
  }

  const appSlugs = apps.map((app) => app.slug);
  const sourceKeys = Object.keys(templateSources).sort();
  const sortedSlugs = [...appSlugs].sort();

  if (new Set(appSlugs).size !== appSlugs.length) {
    throw new Error('config/apps.json contains duplicate slugs');
  }

  if (sourceKeys.length !== appSlugs.length) {
    throw new Error(
      `app/source count mismatch: apps=${appSlugs.length}, sources=${sourceKeys.length}`,
    );
  }

  for (const slug of sortedSlugs) {
    if (!Object.prototype.hasOwnProperty.call(templateSources, slug)) {
      throw new Error(`missing template source key for ${slug}`);
    }
  }

  for (const key of sourceKeys) {
    if (!appSlugs.includes(key)) {
      throw new Error(`template source key has no app slug: ${key}`);
    }

    if (!Array.isArray(templateSources[key])) {
      throw new Error(`template source value must be an array: ${key}`);
    }
  }

  return {
    appCount: appSlugs.length,
    sourceKeyCount: sourceKeys.length,
    appSlugs: sortedSlugs,
    sourceKeys,
  };
}

function parsePorcelainLine(line) {
  const status = line.slice(0, 2);
  const pathText = line.slice(3);
  const renameParts = pathText.split(' -> ');
  const path = renameParts[renameParts.length - 1];

  if (status.includes('R')) {
    return {
      type: 'rename',
      path,
      from: renameParts[0],
      raw: line,
    };
  }

  if (status.includes('D')) {
    return { type: 'delete', path, raw: line };
  }

  if (status.includes('A') || status === '??') {
    return { type: 'add', path, raw: line };
  }

  return { type: 'modify', path, raw: line };
}

function summarizeGeneratedAssetStatus(porcelainOutput = '') {
  const entries = porcelainOutput
    .split('\n')
    .map((line) => line.trimEnd())
    .filter(Boolean)
    .map(parsePorcelainLine);

  const summary = {
    add: 0,
    modify: 0,
    delete: 0,
    rename: 0,
    paths: [],
    entries,
  };

  for (const entry of entries) {
    summary[entry.type] += 1;
    summary.paths.push(entry.path);
  }

  return summary;
}

function getExitCodeForGeneratedStatus(statusSummary, options = {}) {
  if (statusSummary.paths.length > 0 && !options.allowChanges) {
    return 1;
  }

  return 0;
}

function getGeneratedPorcelain(paths = GENERATED_ASSET_PATHS) {
  return execFileSync('git', ['status', '--porcelain=v1', '--', ...paths], {
    encoding: 'utf8',
  });
}

function printSummary(validation, statusSummary) {
  console.log('[app-store:diff] generated asset validation');
  console.log(`  apps: ${validation.appCount}`);
  console.log(`  template source keys: ${validation.sourceKeyCount}`);
  console.log(`  changed paths: ${statusSummary.paths.length}`);
  console.log(`  added: ${statusSummary.add}`);
  console.log(`  modified: ${statusSummary.modify}`);
  console.log(`  deleted: ${statusSummary.delete}`);
  console.log(`  renamed: ${statusSummary.rename}`);

  for (const entry of statusSummary.entries) {
    console.log(`  ${entry.raw}`);
  }
}

function main() {
  const options = parseArgs();

  try {
    const validation = validateGeneratedJson();
    const statusSummary = summarizeGeneratedAssetStatus(getGeneratedPorcelain());
    printSummary(validation, statusSummary);

    if (getExitCodeForGeneratedStatus(statusSummary, options) !== 0) {
      console.error(
        '[app-store:diff] generated App Store assets changed; review with --allow-changes.',
      );
      process.exitCode = 1;
    }
  } catch (error) {
    console.error(`[app-store:diff] failed: ${error.message}`);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  GENERATED_ASSET_PATHS,
  parseArgs,
  validateGeneratedJson,
  summarizeGeneratedAssetStatus,
  getExitCodeForGeneratedStatus,
};
