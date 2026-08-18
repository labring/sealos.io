import test from 'node:test';
import assert from 'node:assert/strict';

import lockHelpers from './pnpm-lock.js';

const { collectLockedVersions, hasLockedDependency } = lockHelpers;

test('reads direct versions from pnpm importer entries', () => {
  const lock = {
    importers: {
      '.': {
        dependencies: {
          next: {
            specifier: '^14.2.28',
            version: '14.2.28(react@18.3.1)',
          },
          sharp: '0.33.5',
        },
        devDependencies: {
          node: {
            specifier: 'runtime:20.20.0',
            version: 'runtime:20.20.0',
          },
        },
      },
    },
  };

  assert.deepEqual(collectLockedVersions(lock, ['next', 'sharp', 'node']), {
    next: '14.2.28',
    sharp: '0.33.5',
    node: '20.20.0',
  });
  assert.equal(hasLockedDependency(lock, 'sharp'), true);
  assert.equal(hasLockedDependency(lock, 'canvas'), false);
});
