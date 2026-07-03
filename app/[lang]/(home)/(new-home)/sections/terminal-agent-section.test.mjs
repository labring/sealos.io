import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const sectionDir = dirname(fileURLToPath(import.meta.url));
const sectionSource = readFileSync(
  join(sectionDir, 'terminal-agent-section.tsx'),
  'utf8',
);
const stackSource = readFileSync(
  join(sectionDir, 'terminal-agent-card-stack.tsx'),
  'utf8',
);

test('Terminal automation stacks cards below desktop', () => {
  assert.match(sectionSource, /TerminalCardStack/);
  assert.match(sectionSource, /grid gap-6 lg:grid-cols-3/);
  assert.doesNotMatch(sectionSource, /md:grid-cols-3/);
  assert.match(stackSource, /'use client'/);
  assert.match(stackSource, /matchMedia\('\(min-width: 1024px\)'\)/);
  assert.match(stackSource, /addEventListener\('scroll'/);
  assert.match(stackSource, /Repository State: \.sealos\//);
  assert.match(stackSource, /terminal — sealos-skills/);
  assert.match(stackSource, /className="space-y-4 lg:hidden"/);
  assert.match(stackSource, /lg:block/);
  assert.match(stackSource, /transform: 'translate3d/);
  assert.doesNotMatch(stackSource, /setTimeout/);
});
