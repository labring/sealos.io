const fs = require('fs');
const yaml = require('js-yaml');

function readPnpmLockIfExists(filePath = 'pnpm-lock.yaml') {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  return yaml.load(fs.readFileSync(filePath, 'utf8'));
}

function getRootDependencies(lock) {
  const importer = lock?.importers?.['.'] || {};
  return {
    ...(importer.dependencies || {}),
    ...(importer.devDependencies || {}),
    ...(importer.optionalDependencies || {}),
  };
}

function normalizeLockedVersion(entry) {
  const value = typeof entry === 'string' ? entry : entry?.version;
  if (value === undefined || value === null) {
    return null;
  }

  return String(value)
    .replace(/^runtime:/, '')
    .split('(')[0];
}

function collectLockedVersions(lock, packageNames) {
  const dependencies = getRootDependencies(lock);
  return Object.fromEntries(
    packageNames.map((name) => [
      name,
      normalizeLockedVersion(dependencies[name]),
    ]),
  );
}

function hasLockedDependency(lock, packageName) {
  return Object.hasOwn(getRootDependencies(lock), packageName);
}

module.exports = {
  collectLockedVersions,
  hasLockedDependency,
  normalizeLockedVersion,
  readPnpmLockIfExists,
};
