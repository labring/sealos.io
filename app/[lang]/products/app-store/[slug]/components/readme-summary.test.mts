import test from 'node:test';
import assert from 'node:assert/strict';
import { getReadmeSummary } from './readme-summary.ts';

test('README preview contains complete prose without screenshots', () => {
  const summary = getReadmeSummary(
    '# App\n\n![Screenshot](screen.png)\n\nFirst **paragraph**.\n\n## Setup\n\nSecond paragraph.\n\n## Configuration\n\nThird paragraph.',
  );
  assert.match(summary.join('\n'), /First \*\*paragraph\*\*/);
  assert.match(summary.join('\n'), /Second paragraph/);
  assert.doesNotMatch(summary.join('\n'), /Screenshot|Third paragraph/);
  assert.deepEqual(getReadmeSummary(''), []);
});
