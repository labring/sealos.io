import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(__dirname, 'demo-navigation.ts'), 'utf8');

const ids = [
  'github-import-section',
  'template-section',
  'docker-image-section',
  'database-section',
];

for (const id of ids) {
  assert.match(source, new RegExp(`id: '${id}'`), `${id} registered`);
}

assert.match(source, /Math\.floor\(progressPx \/ viewportHeight\)/);
assert.match(source, /Math\.min\(\s*demoNavigationItems\.length - 1/);
assert.match(source, /demoJumpEventName = 'sealos-demo-jump'/);

const sectionSource = readFileSync(
  join(__dirname, '../sections/demos-section.tsx'),
  'utf8',
);

assert.match(sectionSource, /h-\[500vh\]/);

console.log(
  `demo-navigation checks passed: ${ids.length + 4}/${ids.length + 4}`,
);
