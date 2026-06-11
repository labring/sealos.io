# Coding Conventions

**Analysis Date:** 2026-06-11

## Naming Patterns

**Files:**
- Use kebab-case for route components, feature modules, and tests: `app/[lang]/products/app-store/components/app-store-browser-utils.ts`, `app/[lang]/products/app-store/components/app-store-browser-utils.test.mts`, `components/app-store/app-grid.tsx`.
- Use Next.js reserved filenames inside `app/`: `app/[lang]/products/app-store/page.tsx`, `app/[lang]/products/app-store/error.tsx`, `app/[lang]/products/app-store/loading.tsx`, `app/not-found.tsx`.
- Use PascalCase directory names for stateful feature component packages: `new-components/AuthForm/AuthFormContext.tsx`, `new-components/DeployModal/DeployModalContext.tsx`.
- Use `index.tsx` as the public entrypoint for multi-file component packages: `new-components/Footer/index.tsx`, `new-components/AuthForm/index.tsx`, `new-components/DeployModal/index.tsx`.
- Use generated data filenames under `config/` with stable names consumed by runtime modules: `config/apps.json`, `config/template-sources.json`, `config/apps.ts`, `config/apps-loader.ts`.

**Functions:**
- Use camelCase verbs for pure utilities and data mappers: `getVisibleApps`, `getCategoryCounts`, `getMinimumCountLabel` in `app/[lang]/products/app-store/components/app-store-browser-utils.ts`.
- Use `generate*` for metadata/schema producers: `generateMetadata` in `app/[lang]/products/app-store/page.tsx`, `generateAppStoreCollectionSchema` in `app/[lang]/products/app-store/app-store-seo.ts`.
- Use `load*`, `fetch*`, `search*`, and `refresh*` for async data access: `loadAllApps`, `fetchDynamicApps`, `searchApps`, `refreshApps` in `config/apps-loader.ts`.
- Keep helper functions close to the feature that owns them when the helper is feature-specific: `getRelatedApps`, `getAppBenefits`, and `formatAppCount` live in `app/[lang]/products/app-store/[slug]/components/app-detail-utils.ts`.

**Variables:**
- Use `UPPER_SNAKE_CASE` for constants that represent product or routing facts: `APP_STORE_TITLE`, `APP_STORE_PATHNAME`, `HERO_ICON_COUNT`, `MINIMUM_APP_COUNT_LABEL`.
- Use descriptive local names for derived UI state: `categoryCounts`, `selectedCategory`, `visible`, `activeSort` in `components/app-store/app-grid.tsx`.
- Use `*Config`, `*Schema`, and `*Vars` suffixes for structured configuration values: `appsConfig` in `config/apps.ts`, `appStoreBackgroundVars` in `app/[lang]/products/app-store/page.tsx`.

**Types:**
- Use PascalCase for interfaces and type aliases: `AppConfig` in `config/apps-loader.ts`, `VisibleAppsInput` and `VisibleAppsResult` in `app/[lang]/products/app-store/components/app-store-browser-utils.ts`.
- Use prop type names that mirror component names: `AppGridProps` in `components/app-store/app-grid.tsx`, `AppStoreHeroProps` in `app/[lang]/products/app-store/components/app-store-hero.tsx`.
- Use `Pick<...>` to keep utility function contracts narrow: `getTemplateName` and `matchesAppSlug` in `config/apps-loader.ts`, `getDeployCount` in `app/[lang]/products/app-store/[slug]/components/app-detail-utils.ts`.

## Code Style

**Formatting:**
- Use Prettier from `prettier.config.js`.
- Key settings: 2-space tabs, semicolons, single quotes, trailing commas, LF endings, `printWidth: 80`, bracket spacing enabled.
- Use `prettier-plugin-tailwindcss` from `prettier.config.js` so Tailwind class ordering stays deterministic.
- Keep JSX props and long function calls wrapped across lines after formatting, as in `app/[lang]/products/app-store/page.tsx` and `components/app-store/app-grid.tsx`.

**Linting:**
- The `lint` script in `package.json` runs `rm -f tsconfig.tsbuildinfo && tsc --noEmit`.
- TypeScript strict mode is enabled in `tsconfig.json`; new TypeScript must type-check with `strict: true`, `isolatedModules: true`, and `moduleResolution: "Bundler"`.
- No ESLint config is present in the repo root. Existing lint enforcement is TypeScript compile-time validation plus focused Node tests.

## Import Organization

**Order:**
1. File-level directives and one-line file comments when needed: `'use client';` in `components/app-store/app-grid.tsx`, `app/[lang]/products/app-store/error.tsx`.
2. Framework and platform imports: `next/image`, `next/navigation`, `react`, `node:test`, `node:assert/strict`.
3. Third-party UI/runtime imports: `lucide-react`, `@radix-ui/react-icons`, Radix wrapper modules.
4. Absolute project imports using `@/`: `@/config/apps`, `@/lib/utils`, `@/components/ui/app-icon`, `@/new-components/Footer`.
5. Relative imports for same-feature files: `./app-store-seo`, `./components/app-store-content`, `./app-detail-utils.ts`.

**Path Aliases:**
- Use `@/*` for root-relative imports as configured in `tsconfig.json`.
- Use relative imports for sibling feature files in route directories: `./components/app-store-content` in `app/[lang]/products/app-store/page.tsx`, `./app-store-browser-utils.ts` in `app/[lang]/products/app-store/components/app-store-browser-utils.test.mts`.

## Error Handling

**Patterns:**
- For recoverable client-side data fetch failures, log the error and fall back to static data: `fetchDynamicApps` catches fetch failures and returns `loadStaticApps()` in `config/apps-loader.ts`.
- For missing generated config required at runtime, throw an actionable `Error` that names the required command: `loadStaticApps` and `loadAppsByCategory` in `config/apps-loader.ts`.
- For route-level rendering errors, use a Next.js `error.tsx` boundary with a retry action and a shared state panel: `app/[lang]/products/app-store/error.tsx`.
- For loading, empty, no-results, and error UI states, centralize state visuals in a feature component: `app/[lang]/products/app-store/components/app-store-state-panel.tsx`.
- For scripts, log operational progress and return/throw explicit failures from the failing step: `scripts/generate-apps-api.js`, `scripts/normalize-root-locale.js`.

## Logging

**Framework:** console

**Patterns:**
- Use `console.error` for caught failures that need operator visibility: `config/apps-loader.ts`, `lib/api/apps-api.ts`, `scripts/generate-apps-api.js`.
- Use `console.warn` for optional or skipped build/deployment steps: `scripts/normalize-root-locale.js`, `components/analytics/index.tsx`, `lib/og-canvas.ts`.
- Use `console.log` in Node scripts for fetch/generation progress and summary output: `scripts/generate-apps-api.js`.
- Keep browser component logging sparse and tied to failed user actions: `components/page-actions.tsx`, `new-components/AuthForm/VerifyCodeStep.tsx`.

## Comments

**When to Comment:**
- Use comments to mark public module intent or non-obvious generated-data behavior: `app/[lang]/products/app-store/page.tsx`, `config/apps-loader.ts`, `scripts/generate-apps-api.js`.
- Prefer readable function names over comments for pure utility behavior: `getVisibleApps`, `getCategoryCounts`, `formatAppCount`.
- Keep comments short and tied to maintenance decisions, such as cache usage in `config/apps-loader.ts`.

**JSDoc/TSDoc:**
- JSDoc is used lightly for exported data-loading functions in `config/apps-loader.ts`.
- Large Node scripts use block comments for usage and output behavior: `scripts/generate-apps-api.js`.
- Component files generally rely on TypeScript prop types and descriptive names instead of JSDoc.

## Function Design

**Size:** Keep pure utilities small and testable. Filtering, sorting, pagination, formatting, and fallback-copy logic live in focused functions such as `getVisibleApps` in `app/[lang]/products/app-store/components/app-store-browser-utils.ts` and `getAppBenefits` in `app/[lang]/products/app-store/[slug]/components/app-detail-utils.ts`.

**Parameters:** Prefer object parameters for multi-field operations: `getVisibleApps({ apps, query, category, sort, page, pageSize })`, `getRelatedApps({ apps, currentApp, limit })`.

**Return Values:** Return plain data from utilities and avoid side effects: `VisibleAppsResult` in `app/[lang]/products/app-store/components/app-store-browser-utils.ts`, arrays from `getAppBenefits` and `getAppUseCases` in `app/[lang]/products/app-store/[slug]/components/app-detail-utils.ts`.

## Module Design

**Exports:** Use named exports for utilities, config helpers, context hooks, and types: `config/apps-loader.ts`, `app/[lang]/products/app-store/components/app-store-browser-utils.ts`, `new-components/DeployModal/index.tsx`.

**Barrel Files:** Use package-level `index.tsx` files to expose component APIs from multi-file component directories: `new-components/AuthForm/index.tsx`, `new-components/DeployModal/index.tsx`, `new-components/Footer/index.tsx`.

**Component Boundaries:**
- Keep page composition in route files such as `app/[lang]/products/app-store/page.tsx`.
- Keep interactive client UI behind `'use client'` in files such as `components/app-store/app-grid.tsx`, `app/[lang]/products/app-store/error.tsx`, and `new-components/DeployModal/DeployModalContext.tsx`.
- Keep reusable primitive wrappers in `components/ui/`, including `components/ui/button.tsx`, `components/ui/dialog.tsx`, `components/ui/dropdown-menu.tsx`, and `components/ui/app-icon.tsx`.
- Keep newer product-specific shared components in `new-components/`, including `new-components/Header.tsx`, `new-components/Footer/index.tsx`, and `new-components/GodRays.tsx`.

---

*Convention analysis: 2026-06-11*
