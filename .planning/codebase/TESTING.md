# Testing Patterns

**Analysis Date:** 2026-06-11

## Test Framework

**Runner:**
- Node.js built-in test runner via `node:test`.
- Tests import `test` from `node:test` and assertions from `node:assert/strict`.
- No Jest, Vitest, or Playwright config is present in the repo root.
- Config: Not detected.

**Assertion Library:**
- `node:assert/strict`.
- Common assertions: `assert.equal`, `assert.deepEqual`, `assert.match`, `assert.doesNotMatch`, `assert.ok`, `assert.notEqual`.

**Run Commands:**
```bash
npm run lint                                                   # Run TypeScript validation
node --test '**/*.test.mjs' '**/*.test.mts'                    # Run all Node test files in shells that expand globs
node --test config/apps-data-quality.test.mts                  # Run app data quality checks
node --test scripts/generate-apps-api.test.mjs                 # Run script conversion tests
node --test app/[lang]/products/app-store/components/app-store-browser-utils.test.mts
```

## Test File Organization

**Location:**
- Tests are co-located with the code or data they protect.
- Feature route tests live under `app/[lang]/products/app-store/`.
- Component tests live beside components: `components/app-store/app-grid.test.mts`.
- Config/data tests live beside config: `config/apps-data-quality.test.mts`.
- Script tests live beside scripts: `scripts/generate-apps-api.test.mjs`.

**Naming:**
- Use `.test.mts` for TypeScript/ESM tests that import `.ts` source files or inspect `.tsx` source text.
- Use `.test.mjs` for JavaScript/ESM tests that import `.js` scripts.
- Test names are user-facing behavior statements: `getVisibleApps filters by query across names, descriptions, categories, and tags`, `app data has the SEO-critical fields required for indexable detail pages`.

**Structure:**
```text
app/[lang]/products/app-store/
├── app-store-page.test.mts
├── app-store-seo.test.mts
├── components/
│   ├── app-store-browser-utils.test.mts
│   ├── app-store-hero.test.mts
│   ├── app-store-faq.test.mts
│   └── category-showcase.test.mts
└── [slug]/
    ├── app-store-detail-page.test.mts
    └── components/
        ├── app-detail-utils.test.mts
        └── figma-gradient-heading.test.mts

components/app-store/
├── app-grid.tsx
└── app-grid.test.mts

config/
└── apps-data-quality.test.mts

scripts/
└── generate-apps-api.test.mjs
```

## Test Structure

**Suite Organization:**
```typescript
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getCategoryCounts,
  getMinimumCountLabel,
  getVisibleApps,
  type SortOption,
} from './app-store-browser-utils.ts';

type AppFixture = Parameters<typeof getVisibleApps>[0]['apps'][number];

const fixtures: AppFixture[] = [
  {
    name: 'Dify',
    slug: 'dify',
    description: 'LLM app development platform',
    icon: '/dify.png',
    category: 'AI',
    features: [],
    benefits: [],
    useCases: [],
    gradient: '',
    tags: ['ai', 'llm'],
    source: { deployCount: 42 },
  },
];

test('getVisibleApps filters by category and sorts by deploy count', () => {
  const result = getVisibleApps({
    apps: fixtures,
    query: '',
    category: 'AI',
    sort: 'deploy-count',
    page: 1,
    pageSize: 12,
  });

  assert.deepEqual(result.apps.map((app) => app.slug), ['dify']);
  assert.equal(result.totalPages, 1);
});
```

**Patterns:**
- Import the function under test directly when it is pure logic: `app/[lang]/products/app-store/components/app-store-browser-utils.test.mts`, `app/[lang]/products/app-store/[slug]/components/app-detail-utils.test.mts`.
- Read source files as text when protecting UI composition, exact copy, SEO structure, Tailwind classes, or route-state files: `components/app-store/app-grid.test.mts`, `app/[lang]/products/app-store/components/app-store-hero.test.mts`, `app/[lang]/products/app-store/[slug]/components/figma-gradient-heading.test.mts`.
- Use top-level fixtures shared by tests in the same file: `fixtures` in `app/[lang]/products/app-store/components/app-store-browser-utils.test.mts` and `app/[lang]/products/app-store/[slug]/components/app-detail-utils.test.mts`.
- Keep each `test(...)` focused on one behavior or regression contract.

## Mocking

**Framework:** Not detected.

**Patterns:**
```typescript
const source = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), 'app-store-hero.tsx'),
  'utf8',
);

test('hero search field uses the neutral Figma surface color', () => {
  const labelClass = source.match(
    /<label\s+htmlFor="hero-app-search"\s+className="([^"]+)"/,
  )?.[1];

  assert.ok(labelClass);
  assert.match(labelClass, /border-\[#46464A\]/);
  assert.match(labelClass, /bg-\[#121214\]/);
});
```

**What to Mock:**
- Prefer fixture objects over mocking for pure utility tests: app fixtures in `app/[lang]/products/app-store/components/app-store-browser-utils.test.mts`.
- For script conversion behavior, pass a minimal template object directly to `convertTemplateToAppConfig` as in `scripts/generate-apps-api.test.mjs`.
- For UI regression checks, inspect source text rather than rendering React components when the contract is exact class/copy/module usage.

**What NOT to Mock:**
- Do not mock `config/apps.json` in data-quality tests; `config/apps-data-quality.test.mts` reads the committed generated dataset directly.
- Do not mock source files for class/copy/SEO regression tests; tests read the actual `.tsx`/`.ts` files with `readFileSync`.
- Do not introduce Jest/Vitest mocking helpers unless the repo adds those frameworks and config.

## Fixtures and Factories

**Test Data:**
```typescript
const fixtures: AppFixture[] = [
  {
    name: 'Dify',
    slug: 'dify',
    description: 'LLM app development platform',
    icon: '/dify.png',
    category: 'AI',
    features: ['AI workflows'],
    benefits: [],
    useCases: [],
    gradient: '',
    tags: ['ai'],
    source: { deployCount: 0 },
  },
];
```

**Location:**
- Keep fixtures inside the test file that uses them.
- Use real generated data only for repository-wide data quality checks: `config/apps-data-quality.test.mts` reads `config/apps.json`.
- No shared fixture directory is present.

## Coverage

**Requirements:** None enforced.

**View Coverage:**
```bash
node --test --experimental-test-coverage '**/*.test.mjs' '**/*.test.mts'
```

## Test Types

**Unit Tests:**
- Pure function tests cover filtering, sorting, pagination, formatting, slug matching, fallback copy, and app config conversion.
- Representative files: `app/[lang]/products/app-store/components/app-store-browser-utils.test.mts`, `app/[lang]/products/app-store/[slug]/components/app-detail-utils.test.mts`, `scripts/generate-apps-api.test.mjs`.

**Integration Tests:**
- Data-quality tests validate generated app data against SEO, URL, slug, and legacy compatibility contracts in `config/apps-data-quality.test.mts`.
- Source-text integration tests protect page composition, structured-data wiring, state entrypoints, route files, and design-specific class contracts in `app/[lang]/products/app-store/app-store-page.test.mts`, `app/[lang]/products/app-store/app-store-seo.test.mts`, and `app/[lang]/products/app-store/[slug]/app-store-detail-page.test.mts`.

**E2E Tests:**
- Not used.
- No browser automation framework config is present.

## Common Patterns

**Async Testing:**
```typescript
test('convertTemplateToAppConfig preserves template screenshots', async () => {
  const app = await convertTemplateToAppConfig({
    metadata: {
      name: 'sample-app',
    },
    spec: {
      title: 'Sample App',
      description: 'A sample app for testing.',
      icon: '/icons/default.svg',
      categories: ['tool'],
      screenshots: ['https://example.com/app-screen-1.webp'],
    },
  });

  assert.deepEqual(app?.screenshots, ['https://example.com/app-screen-1.webp']);
});
```

**Error Testing:**
```typescript
test('app grid distinguishes empty app data from no-result filters', () => {
  assert.match(source, /AppStoreStatePanel/);
  assert.match(source, /apps\.length === 0/);
  assert.match(source, /variant="empty"/);
  assert.match(source, /variant="no-results"/);
  assert.match(source, /Reset filters/);
});
```

**Regression Testing:**
- Use `assert.doesNotMatch` to protect removed UI or copy from returning: `components/app-store/app-grid.test.mts`, `app/[lang]/products/app-store/[slug]/components/figma-gradient-heading.test.mts`.
- Use exact regex checks for Tailwind classes when design fidelity is the behavior under test: `app/[lang]/products/app-store/components/app-store-hero.test.mts`, `app/[lang]/products/app-store/components/app-store-faq.test.mts`.
- Use source-level checks for SEO and schema wiring where runtime rendering would add overhead: `app/[lang]/products/app-store/app-store-seo.test.mts`.

---

*Testing analysis: 2026-06-11*
