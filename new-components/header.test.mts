import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const source = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), 'Header.tsx'),
  'utf8',
);

const headerProps =
  source.match(/type HeaderProps = \{[\s\S]*?\n\};/)?.[0] ?? '';
const navigationLinks =
  source.match(
    /const navigationLinks: NavigationLink\[\] = \[[\s\S]*?\n\];\n\nconst DropdownMenuItem/,
  )?.[0] ?? '';

test('shared Header keeps a single optional language prop', () => {
  assert.match(headerProps, /lang\?: languagesType;/);
  assert.doesNotMatch(headerProps, /appearance|variant/);
  assert.equal(
    (headerProps.match(/\?:/g) ?? []).length,
    1,
    'HeaderProps must expose only lang',
  );
});

test('shared Header owns the historical pill presentation', () => {
  assert.match(source, /<div className="container pt-8">/);
  assert.match(
    source,
    /inset-shadow-bubble flex w-full justify-between rounded-full bg-white\/5 px-6 py-3 backdrop-blur-lg/,
  );
  assert.match(source, /className="h-8 w-8"/);
  assert.match(source, /width=\{36\}/);
  assert.match(source, /height=\{36\}/);
  assert.match(source, /navigationMenuTriggerStyle\(\)/);
});

test('desktop logotype collapses after scrolling and expands at the top', () => {
  assert.match(source, /const \{ scrollY \} = useScroll\(\);/);
  assert.match(source, /useMotionValueEvent\(scrollY, 'change'/);
  assert.match(source, /setHideLogotype\(true\)/);
  assert.match(source, /setHideLogotype\(false\)/);
  assert.match(source, /width: hideLogotype \? 0 : 'auto'/);
  assert.match(source, /opacity: hideLogotype \? 0 : 1/);
});

test('all current dropdown children render in historical two-column panels', () => {
  assert.equal(
    (navigationLinks.match(/className: 'w-\[40rem\]! md:w-\[40rem\]!'/g) ?? [])
      .length,
    3,
  );
  assert.match(
    source,
    /inset-shadow-bubble rounded-xl bg-neutral-950 p-4 backdrop-blur-xl/,
  );
  assert.match(source, /grid grid-cols-2 gap-3/);
  assert.match(source, /\{children\.map\(\(child, index\) => \(/);
  assert.doesNotMatch(source, /children\.slice/);

  for (const label of [
    'Products',
    'Docs',
    'Resources',
    'Pricing',
    'Solutions',
    'Contact',
    'Learn',
    'Tutorials',
    'Blog',
    'Community',
  ]) {
    assert.match(navigationLinks, new RegExp(`text: '${label}'`));
  }
});

test('locale, analytics, auth, and mobile menu contracts remain current', () => {
  assert.match(source, /const resolvedLang = lang \?\?/);
  assert.match(source, /children: link\.children\?\.map/);
  assert.match(source, /return `\/\$\{resolvedLang\}\$\{url\}`;/);
  assert.match(source, /https:\/\/discord\.gg\/wdUn538zVP/);

  assert.equal((source.match(/<span>18\.3k<\/span>/g) ?? []).length, 2);
  assert.match(source, />\s*Get Started For Free\s*</);
  assert.match(source, />\s*Get Start For Free\s*</);
  assert.match(source, /home_header_get_started/);
  assert.match(source, /home_header_mobile_get_started/);
  assert.match(
    source,
    /trackButton\('Get Started', 'header', 'auth-form', ''\)/,
  );
  assert.match(source, /'header-mobile',\s*'auth-form'/);
  assert.match(
    source,
    /handleAuthRedirect\(\{ openapp: getOpenBrainParam\(\) \}\)/,
  );

  assert.match(
    source,
    /className="fixed inset-0 z-50 bg-black\/95 backdrop-blur-lg lg:hidden"/,
  );
  assert.match(source, /\{link\.children\.map\(\(child, childIndex\) => \(/);
  assert.match(source, /onClick=\{closeMobileMenu\}/);
});
