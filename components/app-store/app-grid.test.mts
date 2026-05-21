import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const componentDir = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(componentDir, 'app-grid.tsx'), 'utf8');

test('app cards do not render deploy count pills', () => {
  assert.doesNotMatch(source, /const deployCount = getDeployCount\(app\)/);
  assert.doesNotMatch(source, /hasDeployCount/);
  assert.doesNotMatch(source, /formatCount\(deployCount\)/);
  assert.doesNotMatch(
    source,
    /<Star className="h-3 w-3 fill-\[#8fd44e\] text-\[#8fd44e\]" \/>/,
  );
});

test('app cards use the first real screenshot before falling back to placeholder art', () => {
  assert.match(source, /import Image from 'next\/image'/);
  assert.match(source, /const primaryScreenshot = app\.screenshots\?\.\[0\]/);
  assert.match(source, /primaryScreenshot \?/);
  assert.match(source, /src=\{primaryScreenshot\}/);
  assert.match(source, /alt=\{`\$\{app\.name\} screenshot`\}/);
  assert.match(source, /appCardScreenshotClassName/);
});

test('app card screenshots keep the angled Figma preview treatment', () => {
  assert.match(
    source,
    /className="absolute left-\[6\.8%\] top-\[12px\] h-\[355px\] w-\[111\.3%\]"/,
  );
  assert.match(source, /className="relative h-\[315px\] w-\[93%\] rotate-\[-6deg\]/);
  assert.match(source, /group-hover:rotate-\[-4deg\]/);
  assert.match(source, /group-hover:scale-\[1\.02\]/);
  assert.doesNotMatch(source, /w-\[424px\]/);
  assert.doesNotMatch(source, /w-\[430px\]/);
  assert.doesNotMatch(source, /w-\[400px\]/);
});

test('app cards do not render bottom primary tag pills', () => {
  assert.doesNotMatch(source, /function getPrimaryTag/);
  assert.doesNotMatch(source, /getPrimaryTag\(app\)/);
  assert.doesNotMatch(
    source,
    /min-w-0 truncate rounded-full bg-white\/\[0\.045\]/,
  );
});

test('app card deploy button spans the Figma footer row', () => {
  assert.match(source, /className="mt-auto flex w-full items-center"/);
  assert.match(source, /className="inline-flex h-9 w-full items-center justify-center/);
  assert.doesNotMatch(source, /mt-auto flex items-center justify-end/);
  assert.doesNotMatch(source, /min-w-\[120px\]/);
});
