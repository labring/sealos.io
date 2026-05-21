import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const source = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), 'page.tsx'),
  'utf8',
);

test('app store detail page uses the redesigned dark shell and home footer', () => {
  assert.match(source, /import \{ Footer \} from '@\/new-components\/Footer'/);
  assert.match(source, /BottomLightImage/);
  assert.match(source, /appStoreDetailBackgroundVars/);
  assert.match(source, /data-theme="app-store"/);
  assert.match(source, /className="[^"]*isolate[^"]*"/);
  assert.doesNotMatch(source, /import Footer from '@\/components\/footer'/);
  assert.doesNotMatch(source, /@\/components\/header\/hero/);
});

test('app store detail page renders redesigned Figma sections', () => {
  assert.match(source, /AppDetailHero/);
  assert.match(source, /WhyDeployOnSealos/);
  assert.match(source, /WholeStackSection/);
  assert.match(source, /ReadmePreview/);
  assert.match(source, /RelatedTemplates/);
});
