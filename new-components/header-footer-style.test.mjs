import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const homeLayout = readFileSync('app/[lang]/(home)/layout.tsx', 'utf8');
const appStorePage = readFileSync(
  'app/[lang]/products/app-store/page.tsx',
  'utf8',
);
const appStoreDetailPage = readFileSync(
  'app/[lang]/products/app-store/[slug]/page.tsx',
  'utf8',
);
const localeLayout = readFileSync('app/[lang]/layout.tsx', 'utf8');
const footer = readFileSync('new-components/Footer/index.tsx', 'utf8');
const header = readFileSync('new-components/Header.tsx', 'utf8');

test('home routes cover the fixed footer wordmark', () => {
  assert.match(localeLayout, /<body className="[^"]*bg-background[^"]*"/);
  assert.match(homeLayout, /className="[^"]*bg-background[^"]*"/);
  assert.match(homeLayout, /className="[^"]*relative[^"]*"/);
  assert.match(homeLayout, /className="[^"]*z-10[^"]*"/);
});

test('app store content covers the fixed footer wordmark', () => {
  assert.match(appStorePage, /<main className="[^"]*bg-background[^"]*"/);
  assert.match(appStorePage, /<main className="[^"]*relative[^"]*z-10[^"]*"/);
  assert.match(appStoreDetailPage, /<main className="[^"]*bg-background[^"]*"/);
  assert.match(
    appStoreDetailPage,
    /<main className="[^"]*relative[^"]*z-10[^"]*"/,
  );
});

test('footer wordmark keeps a filled stroke style', () => {
  assert.match(footer, /color: 'var\(--color-background\)'/);
  assert.match(footer, /4px 0 #58595E/);
  assert.match(footer, /0 4px #58595E/);
  assert.match(footer, /textShadow: wordmarkStroke/);
  assert.doesNotMatch(footer, /-webkit-text-stroke/);
  assert.doesNotMatch(footer, /text-transparent/);
});

test('desktop nav dropdown uses the transparent blurred panel style', () => {
  assert.match(header, /!overflow-visible/);
  assert.match(header, /!border-none !bg-transparent !p-0 !shadow-none/);
  assert.match(header, /border border-white\/10/);
  assert.match(header, /bg-\[#080A11\]\/20/);
  assert.match(header, /backdrop-blur-\[40px\]/);
  assert.match(header, /backdropFilter: 'blur\(40px\)'/);
  assert.match(header, /WebkitBackdropFilter: 'blur\(40px\)'/);
  assert.match(header, /hover:bg-white\/\[0\.05\]/);
  assert.match(header, /hover:\[&_svg\]:text-blue-400/);
  assert.match(header, /className="text-current"/);
  assert.doesNotMatch(header, /group\/dropdown-item/);
  assert.doesNotMatch(header, /group-hover\/dropdown-item:text-blue-400/);
  assert.doesNotMatch(header, /group-hover:text-blue-400/);
  assert.doesNotMatch(header, /inset-shadow-bubble/);
});
