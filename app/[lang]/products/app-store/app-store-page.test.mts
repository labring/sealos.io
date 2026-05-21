import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const source = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), 'page.tsx'),
  'utf8',
);

test('app store page uses the home footer implementation', () => {
  assert.match(source, /import \{ Footer \} from '@\/new-components\/Footer'/);
  assert.match(source, /BottomLightImage/);
  assert.doesNotMatch(source, /import Footer from '@\/components\/footer'/);
  assert.doesNotMatch(source, /FooterTransition/);
});

test('app store page does not hide the home footer Sealos word layer', () => {
  assert.doesNotMatch(source, /className="[^"]*overflow-hidden[^"]*"/);
  assert.match(source, /className="[^"]*isolate[^"]*"/);
});
