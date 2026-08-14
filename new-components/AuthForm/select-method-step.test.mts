import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const source = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), 'SelectMethodStep.tsx'),
  'utf8',
);

test('email request failures reset Turnstile before retrying', () => {
  assert.match(
    source,
    /if \(success\) \{[\s\S]*setStep\('verify-code'\);[\s\S]*\} else \{[\s\S]*handleCaptchaError\(\);[\s\S]*turnstileRef\.current\?\.reset\(\);[\s\S]*\}/,
  );
});
