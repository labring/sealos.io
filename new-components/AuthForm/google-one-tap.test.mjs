import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

function readSource(filePath) {
  try {
    return readFileSync(filePath, 'utf8');
  } catch {
    return '';
  }
}

const siteConfig = readSource('config/site.ts');
const siteTypes = readSource('types/index.d.ts');
const layout = readSource('app/[lang]/layout.tsx');
const oneTap = readSource('new-components/AuthForm/GoogleOneTap.tsx');

test('site config owns Google One Tap settings', () => {
  assert.match(siteTypes, /googleOneTap:\s*\{/);
  assert.match(siteTypes, /clientId:\s*string/);
  assert.match(siteTypes, /loginEndpoint:\s*string/);
  assert.match(siteTypes, /redirectUrl:\s*string/);
  assert.match(siteConfig, /googleOneTap:\s*\{/);
  assert.match(siteConfig, /export const desktopApiEndpoint = '[^']+'/);
  assert.match(siteConfig, /enabled:\s*true/);
  assert.match(
    siteConfig,
    /clientId:\s*\n\s*'[^']+\.apps\.googleusercontent\.com'/,
  );
  assert.match(
    siteConfig,
    /loginEndpoint:\s*`\$\{desktopApiEndpoint\}\/api\/auth\/google\/onetap`/,
  );
});

test('locale shell mounts Google One Tap once', () => {
  assert.match(
    layout,
    /import \{ GoogleOneTap \} from '@\/new-components\/AuthForm\/GoogleOneTap'/,
  );
  assert.match(layout, /<GoogleOneTap \/>/);
});

test('Google One Tap loads GIS, posts credential, and redirects through oauth token callback', () => {
  assert.match(oneTap, /accounts\.google\.com\/gsi\/client/);
  assert.match(oneTap, /window\.google\.accounts\.id\.initialize/);
  assert.match(oneTap, /callback:\s*handleCredentialResponse/);
  assert.match(oneTap, /window\.google\.accounts\.id\.prompt\(\)/);
  assert.match(oneTap, /fetch\(siteConfig\.googleOneTap\.loginEndpoint/);
  assert.match(oneTap, /credentials:\s*'include'/);
  assert.match(oneTap, /credential:\s*response\.credential/);
  assert.match(
    oneTap,
    /const data: OneTapLoginResponse = await result\.json\(\)/,
  );
  assert.match(oneTap, /data\.code === 200/);
  assert.match(oneTap, /data\.data\?\.token/);
  assert.match(oneTap, /target\.pathname = '\/oauth'/);
  assert.match(oneTap, /target\.searchParams\.append\('token', data\.token\)/);
  assert.match(oneTap, /switchRegionType', 'INIT'/);
  assert.match(oneTap, /workspaceName', 'My Workspace'/);
});
