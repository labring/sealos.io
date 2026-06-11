<!-- GSD:project-start source:PROJECT.md -->

## Project

**Sealos.io Performance Audit**

This project is a full-codebase performance audit for the existing Sealos.io
site. It covers frontend, backend-style API routes, build-time scripts, content
pipelines, runtime integrations, and any functions or modules that can create
slow page loads, excessive network requests, slow data processing, blocking
synchronous work, or unnecessary bundle/runtime cost.

The immediate deliverable is a durable module-by-module performance findings
report under `docs/`, so repeated checks can continue from recorded evidence
instead of restarting from scratch.

**Core Value:** Find every credible performance risk in the current codebase with file-level
evidence and a clear remediation path.

### Constraints

- **Scope**: Cover the entire repository module by module — the objective is
  complete potential performance-risk discovery.

- **Artifact**: Record the analysis in `docs/performance-audit.md` — the report
  is the durable working memory for the audit.

- **Evidence**: Every finding needs file-level evidence and a concrete reason
  it can affect performance.

- **Stack**: Keep the existing Next.js App Router, React, Fumadocs, npm, static
  export, and deployment model while auditing.

- **Quality**: Treat likely user-facing slow paths, build-time slow paths, and
  developer workflow slow paths as separate impact categories.

- **Language**: Planning docs, code, code comments, commits, and PR text are
  written in English.
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->

## Technology Stack

## Languages

- TypeScript 5.8.3 - Application code, React components, Next.js route handlers, Fumadocs content configuration, and shared utilities in `app/`, `components/`, `new-components/`, `hooks/`, `lib/`, `config/`, `types/`, `source.config.ts`, and `mdx-components.tsx`.
- TSX / React 18.3.1 - UI pages, layouts, components, analytics loaders, auth forms, and product experiences in `app/`, `components/`, and `new-components/`.
- MDX / Markdown - Documentation and blog content loaded by Fumadocs from `content/docs/` and `content/blog/` via `source.config.ts`.
- JSON - Generated and static data for app listings and AI quick references in `content/ai-quick-reference/` and generated app API assets managed by `scripts/generate-apps-api.js`.
- JavaScript / Node.js - Build and maintenance scripts in `scripts/generate-apps-api.js`, `scripts/normalize-root-locale.js`, `scripts/replace-image-paths.sh`, and configuration files including `next.config.mjs`, `postcss.config.js`, and `prettier.config.js`.
- Shell - Static-export image path rewriting and URL audit utilities in `scripts/replace-image-paths.sh` and `scripts/url-index-audit.sh`.
- CSS / Tailwind utility classes - Styling is authored primarily through Tailwind classes in TSX files and processed through `postcss.config.js` with `@tailwindcss/postcss`.

## Runtime

- Node.js 20 - Required by `.nvmrc` and GitHub Actions setup in `.github/workflows/deploy.yml`, `.github/workflows/preview.yml`, `.github/workflows/deploy-cloudflare.yml`, and `.github/workflows/preview-cloudflare.yml`.
- Docker builder runtime: `node:20-bookworm-slim` in `Dockerfile`.
- Docker serving runtime: `nginx:1.27-alpine` in `Dockerfile` serves the static export from `/usr/share/nginx/html`.
- npm - `package-lock.json` is present and CI uses `npm install` or `npm ci` in `.github/workflows/deploy.yml`, `.github/workflows/preview.yml`, `.github/workflows/deploy-cloudflare.yml`, `.github/workflows/preview-cloudflare.yml`, and `Dockerfile`.
- Lockfile: present at `package-lock.json`.

## Frameworks

- Next.js 14.2.28 - App Router, static export, route handlers, image handling, rewrites, and MDX integration configured in `next.config.mjs`; routes live under `app/`.
- React 18.3.1 - Client and server components across `app/`, `components/`, and `new-components/`.
- Fumadocs Core/UI/MDX 15.2.x / 11.5.8 - Documentation source loading, MDX compilation, docs UI, and search support configured in `source.config.ts`, `lib/source.ts`, and `app/api/search/route.ts`.
- Tailwind CSS 4.1.3 - Utility-class styling with PostCSS configured in `postcss.config.js`; class merging via `tailwind-merge` in `lib/utils.ts`.
- Radix UI - Accessible primitives for accordion, dialog, dropdown, navigation menu, popover, select, switch, tooltip, and related controls used through UI components in `components/ui/` and feature code in `new-components/`.
- Node.js script tests - `scripts/generate-apps-api.test.mjs` imports `scripts/generate-apps-api.js` directly and validates template conversion logic.
- TypeScript compiler check - `npm run lint` runs `rm -f tsconfig.tsbuildinfo && tsc --noEmit` from `package.json`.
- Dedicated test runner: Not detected in `package.json`; no Jest/Vitest/Playwright config file is present.
- Next.js CLI - `npm run dev`, `npm run build`, `npm run build:analyze`, and `npm run start` are defined in `package.json`.
- Fumadocs MDX generator - `postinstall` runs `fumadocs-mdx` from `package.json` to prepare content sources.
- `scripts/generate-apps-api.js` - Fetches Sealos template catalog data and produces local app listing assets before every build via `npm run generate-apps`.
- `scripts/normalize-root-locale.js` - Runs after `next build` in `package.json` to normalize root locale output.
- `scripts/replace-image-paths.sh` - Runs during Docker builds to replace relative image paths with CDN URLs before `npm run build` in `Dockerfile`.
- `@next/bundle-analyzer` 15.4.1 - Loaded dynamically when `ANALYZE=true` in `next.config.mjs` and invoked through `npm run build:analyze`.

## Key Dependencies

- `next` 14.2.28 - Application framework and static export engine configured in `next.config.mjs`.
- `react` / `react-dom` 18.3.1 - UI runtime for all TSX components under `app/`, `components/`, and `new-components/`.
- `fumadocs-core` / `fumadocs-ui` 15.2.8 and `fumadocs-mdx` 11.5.8 - Documentation system configured in `source.config.ts` and consumed by `lib/source.ts` and docs routes under `app/[lang]/docs/`.
- `@marsidev/react-turnstile` 1.3.1 - Cloudflare Turnstile widget used by `app/[lang]/abuse/components/abuse-form.tsx` and `new-components/AuthForm/AuthFormContext.tsx`.
- `zod` 3.24.2 - Schema validation for Fumadocs content in `source.config.ts` and email validation in `new-components/AuthForm/AuthFormContext.tsx`.
- `sharp` 0.33.5 and `canvas` 3.1.0 - Open Graph image rendering pipeline in `app/api/og/route.ts` and `lib/og-canvas.ts`; Docker installs native build dependencies for these packages in `Dockerfile`.
- `@orama/tokenizers` 3.1.11 - Mandarin tokenizer for Fumadocs search in `app/api/search/route.ts`.
- `@next/mdx`, `@mdx-js/loader`, and `@mdx-js/react` - MDX rendering path integrated by `next.config.mjs` and `source.config.ts`.
- `remark`, `remark-gfm`, `remark-html`, `mermaid`, and custom `lib/remark/remark-mermaid.ts` - Markdown/MDX processing and diagram support.
- `feed` - RSS generation used by route handlers under `app/rss.xml/route.ts`.
- `satori` and `sharp` - Dynamic image and OG generation support.
- `lucide-react`, `@radix-ui/*`, `class-variance-authority`, `clsx`, and `tailwind-merge` - Component primitives and class composition used by UI modules.
- `motion`, `matter-js`, `three`, `react-countup`, `@number-flow/react`, `react-intersection-observer`, `react-responsive`, and `react-player` - Interactive marketing/product page behavior and media presentation.
- `js-yaml` - Template YAML parsing in `scripts/generate-apps-api.js`.

## Configuration

- Public runtime/build variables are read through `process.env.NEXT_PUBLIC_APP_URL`, `process.env.NEXT_PUBLIC_OPEN_SOURCE_URL`, and `process.env.NEXT_PUBLIC_DEFAULT_LOCALE` in `config/site.ts`, `lib/i18n.ts`, `next.config.mjs`, `Dockerfile`, and GitHub workflows.
- Analytics configuration reads `process.env.NEXT_PUBLIC_GTM_ID` in `config/analytics.ts`; English defaults to GTM container `GTM-5DTRN2V3`.
- Turnstile verification requires `TURNSTILE_SECRET_KEY` in `app/api/abuse/verify-turnstile/route.ts`.
- SEO verification reads `GOOGLE_SITE_VERIFICATION` in `lib/utils/metadata.ts`.
- Build flags include `ANALYZE=true` for bundle analyzer in `next.config.mjs`, `DOCKER_BUILD=true` for Fumadocs image handling in `source.config.ts`, and `ROOT_DEFAULT_LOCALE` for `scripts/normalize-root-locale.js`.
- `.env.example` exists and is treated as environment documentation; secret-bearing `.env` files are not read.
- `package.json` defines `dev`, `build`, `build:analyze`, `start`, `lint`, `postinstall`, `generate-apps`, and `generate-apps:clean`.
- `next.config.mjs` enables Fumadocs MDX, static export in production, trailing slashes, strict mode, package import optimization, unoptimized images, allowed remote image hosts, and development rewrites.
- `source.config.ts` defines Fumadocs collections for `content/docs`, `content/blog`, and `content/ai-quick-reference`.
- `tsconfig.json` uses strict TypeScript, bundler module resolution, `@/*` path alias, `jsx: preserve`, and Next plugin integration.
- `postcss.config.js` uses `@tailwindcss/postcss`.
- `prettier.config.js` uses 2 spaces, single quotes, semicolons, trailing commas, `printWidth: 80`, and `prettier-plugin-tailwindcss`.
- `vercel.json` contains Vercel cache headers and permanent redirects.
- `Dockerfile` builds a static export with Node 20 and serves it with Nginx.

## Platform Requirements

- Use Node.js 20 from `.nvmrc`.
- Use npm with `package-lock.json`; install native build toolchain when building `canvas` or `sharp` outside prebuilt-compatible environments.
- Run `npm run generate-apps` before builds or use `npm run build`, which runs it automatically.
- Use `npm run lint` for TypeScript validation.
- Static export output is generated by `next build` with `output: 'export'` in production in `next.config.mjs`.
- Vercel deployment is configured through `.github/workflows/deploy.yml`, `.github/workflows/preview.yml`, and `vercel.json`.
- Cloudflare Pages deployment publishes `./out` through `.github/workflows/deploy-cloudflare.yml` and `.github/workflows/preview-cloudflare.yml`.
- Docker image deployment builds through `.github/workflows/build-image.yml`, publishes to GitHub Container Registry, and updates Kubernetes deployment `sealos-docs` with `kubectl`.
- Docker production runtime serves static files from Nginx as defined in `Dockerfile`.

<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->

## Conventions

## Naming Patterns

- Use kebab-case for route components, feature modules, and tests: `app/[lang]/products/app-store/components/app-store-browser-utils.ts`, `app/[lang]/products/app-store/components/app-store-browser-utils.test.mts`, `components/app-store/app-grid.tsx`.
- Use Next.js reserved filenames inside `app/`: `app/[lang]/products/app-store/page.tsx`, `app/[lang]/products/app-store/error.tsx`, `app/[lang]/products/app-store/loading.tsx`, `app/not-found.tsx`.
- Use PascalCase directory names for stateful feature component packages: `new-components/AuthForm/AuthFormContext.tsx`, `new-components/DeployModal/DeployModalContext.tsx`.
- Use `index.tsx` as the public entrypoint for multi-file component packages: `new-components/Footer/index.tsx`, `new-components/AuthForm/index.tsx`, `new-components/DeployModal/index.tsx`.
- Use generated data filenames under `config/` with stable names consumed by runtime modules: `config/apps.json`, `config/template-sources.json`, `config/apps.ts`, `config/apps-loader.ts`.
- Use camelCase verbs for pure utilities and data mappers: `getVisibleApps`, `getCategoryCounts`, `getMinimumCountLabel` in `app/[lang]/products/app-store/components/app-store-browser-utils.ts`.
- Use `generate*` for metadata/schema producers: `generateMetadata` in `app/[lang]/products/app-store/page.tsx`, `generateAppStoreCollectionSchema` in `app/[lang]/products/app-store/app-store-seo.ts`.
- Use `load*`, `fetch*`, `search*`, and `refresh*` for async data access: `loadAllApps`, `fetchDynamicApps`, `searchApps`, `refreshApps` in `config/apps-loader.ts`.
- Keep helper functions close to the feature that owns them when the helper is feature-specific: `getRelatedApps`, `getAppBenefits`, and `formatAppCount` live in `app/[lang]/products/app-store/[slug]/components/app-detail-utils.ts`.
- Use `UPPER_SNAKE_CASE` for constants that represent product or routing facts: `APP_STORE_TITLE`, `APP_STORE_PATHNAME`, `HERO_ICON_COUNT`, `MINIMUM_APP_COUNT_LABEL`.
- Use descriptive local names for derived UI state: `categoryCounts`, `selectedCategory`, `visible`, `activeSort` in `components/app-store/app-grid.tsx`.
- Use `*Config`, `*Schema`, and `*Vars` suffixes for structured configuration values: `appsConfig` in `config/apps.ts`, `appStoreBackgroundVars` in `app/[lang]/products/app-store/page.tsx`.
- Use PascalCase for interfaces and type aliases: `AppConfig` in `config/apps-loader.ts`, `VisibleAppsInput` and `VisibleAppsResult` in `app/[lang]/products/app-store/components/app-store-browser-utils.ts`.
- Use prop type names that mirror component names: `AppGridProps` in `components/app-store/app-grid.tsx`, `AppStoreHeroProps` in `app/[lang]/products/app-store/components/app-store-hero.tsx`.
- Use `Pick<...>` to keep utility function contracts narrow: `getTemplateName` and `matchesAppSlug` in `config/apps-loader.ts`, `getDeployCount` in `app/[lang]/products/app-store/[slug]/components/app-detail-utils.ts`.

## Code Style

- Use Prettier from `prettier.config.js`.
- Key settings: 2-space tabs, semicolons, single quotes, trailing commas, LF endings, `printWidth: 80`, bracket spacing enabled.
- Use `prettier-plugin-tailwindcss` from `prettier.config.js` so Tailwind class ordering stays deterministic.
- Keep JSX props and long function calls wrapped across lines after formatting, as in `app/[lang]/products/app-store/page.tsx` and `components/app-store/app-grid.tsx`.
- The `lint` script in `package.json` runs `rm -f tsconfig.tsbuildinfo && tsc --noEmit`.
- TypeScript strict mode is enabled in `tsconfig.json`; new TypeScript must type-check with `strict: true`, `isolatedModules: true`, and `moduleResolution: "Bundler"`.
- No ESLint config is present in the repo root. Existing lint enforcement is TypeScript compile-time validation plus focused Node tests.

## Import Organization

- Use `@/*` for root-relative imports as configured in `tsconfig.json`.
- Use relative imports for sibling feature files in route directories: `./components/app-store-content` in `app/[lang]/products/app-store/page.tsx`, `./app-store-browser-utils.ts` in `app/[lang]/products/app-store/components/app-store-browser-utils.test.mts`.

## Error Handling

- For recoverable client-side data fetch failures, log the error and fall back to static data: `fetchDynamicApps` catches fetch failures and returns `loadStaticApps()` in `config/apps-loader.ts`.
- For missing generated config required at runtime, throw an actionable `Error` that names the required command: `loadStaticApps` and `loadAppsByCategory` in `config/apps-loader.ts`.
- For route-level rendering errors, use a Next.js `error.tsx` boundary with a retry action and a shared state panel: `app/[lang]/products/app-store/error.tsx`.
- For loading, empty, no-results, and error UI states, centralize state visuals in a feature component: `app/[lang]/products/app-store/components/app-store-state-panel.tsx`.
- For scripts, log operational progress and return/throw explicit failures from the failing step: `scripts/generate-apps-api.js`, `scripts/normalize-root-locale.js`.

## Logging

- Use `console.error` for caught failures that need operator visibility: `config/apps-loader.ts`, `lib/api/apps-api.ts`, `scripts/generate-apps-api.js`.
- Use `console.warn` for optional or skipped build/deployment steps: `scripts/normalize-root-locale.js`, `components/analytics/index.tsx`, `lib/og-canvas.ts`.
- Use `console.log` in Node scripts for fetch/generation progress and summary output: `scripts/generate-apps-api.js`.
- Keep browser component logging sparse and tied to failed user actions: `components/page-actions.tsx`, `new-components/AuthForm/VerifyCodeStep.tsx`.

## Comments

- Use comments to mark public module intent or non-obvious generated-data behavior: `app/[lang]/products/app-store/page.tsx`, `config/apps-loader.ts`, `scripts/generate-apps-api.js`.
- Prefer readable function names over comments for pure utility behavior: `getVisibleApps`, `getCategoryCounts`, `formatAppCount`.
- Keep comments short and tied to maintenance decisions, such as cache usage in `config/apps-loader.ts`.
- JSDoc is used lightly for exported data-loading functions in `config/apps-loader.ts`.
- Large Node scripts use block comments for usage and output behavior: `scripts/generate-apps-api.js`.
- Component files generally rely on TypeScript prop types and descriptive names instead of JSDoc.

## Function Design

## Module Design

- Keep page composition in route files such as `app/[lang]/products/app-store/page.tsx`.
- Keep interactive client UI behind `'use client'` in files such as `components/app-store/app-grid.tsx`, `app/[lang]/products/app-store/error.tsx`, and `new-components/DeployModal/DeployModalContext.tsx`.
- Keep reusable primitive wrappers in `components/ui/`, including `components/ui/button.tsx`, `components/ui/dialog.tsx`, `components/ui/dropdown-menu.tsx`, and `components/ui/app-icon.tsx`.
- Keep newer product-specific shared components in `new-components/`, including `new-components/Header.tsx`, `new-components/Footer/index.tsx`, and `new-components/GodRays.tsx`.

<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->

## Architecture

## System Overview

```text

```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| Root shell | Loads global CSS and delegates HTML rendering to locale layout. | `app/layout.tsx` |
| Locale shell | Creates `<html>`, analytics, Fumadocs provider, search, auth modal, deploy modal, and language params. | `app/[lang]/layout.tsx` |
| Navigation config | Defines shared docs layout options and localized header URLs. | `app/layout.config.tsx` |
| Docs source | Loads MDX docs, blog, and AI quick reference collections through Fumadocs. | `lib/source.ts` |
| MDX schema | Defines Fumadocs content collections and remark plugins. | `source.config.ts` |
| Docs route | Renders localized docs pages from `source.getPage()` and wires MDX components. | `app/[lang]/docs/[[...slug]]/page.tsx` |
| Docs layout | Renders Fumadocs sidebar tree and docs chrome. | `app/[lang]/docs/layout.tsx` |
| Blog routes | Render blog index and article pages from the blog loader. | `app/[lang]/(home)/blog/page.tsx`, `app/[lang]/(home)/blog/[slug]/page.tsx` |
| Marketing home | Composes the new landing page from section components. | `app/[lang]/(home)/(new-home)/page.tsx` |
| App Store data | Loads, caches, filters, and resolves deploy URLs for app templates. | `config/apps-loader.ts` |
| Apps API | Converts remote template API records to local app config shape. | `lib/api/apps-api.ts` |
| Metadata | Centralizes Next metadata for pages, docs, and blog routes. | `lib/utils/metadata.ts` |
| Structured data | Generates Schema.org JSON-LD objects for SEO surfaces. | `lib/utils/structured-data.ts` |

## Pattern Overview

- Use `app/[lang]` as the language-scoped route boundary for public pages.
- Use Fumadocs loaders in `lib/source.ts` as the only entry point for docs, blog, and AI quick reference content.
- Use `config/*` for product, site, analytics, app-store, industry, and template data.
- Use server components for static page composition and client components for search, auth, deploy, filters, GTM, and interactive UI.
- Build output is configured as static export in production through `next.config.mjs`.

## Layers

- Purpose: Own URL structure, route params, static params, layouts, metadata hooks, and route handlers.
- Location: `app`
- Contains: `page.tsx`, `layout.tsx`, `route.ts`, loading states, not-found states.
- Depends on: `lib`, `config`, `components`, `new-components`, `content` through loaders.
- Used by: Next.js runtime and static export build.
- Purpose: Store localized MDX/MD content for docs, blog, and AI quick reference.
- Location: `content`
- Contains: `content/docs`, `content/blog`, `content/ai-quick-reference`.
- Depends on: Fumadocs frontmatter schemas in `source.config.ts`.
- Used by: `lib/source.ts`, route pages under `app/[lang]/docs`, `app/[lang]/(home)/blog`, and `app/[lang]/(home)/ai-quick-reference`.
- Purpose: Store structured site, product, app-store, analytics, and industry data.
- Location: `config`
- Contains: `config/site.ts`, `config/analytics.ts`, `config/apps.json`, `config/apps-loader.ts`, `config/industries.tsx`, `config/template-sources.json`.
- Depends on: Environment variables and static JSON.
- Used by: Route pages, metadata helpers, header/footer, app-store pages, auth/deploy flows.
- Purpose: Provide reusable UI primitives, site chrome, MDX components, and feature widgets.
- Location: `components`, `new-components`
- Contains: Fumadocs extensions, shadcn-style primitives, header/footer, analytics, auth form, deploy modal, marketing widgets.
- Depends on: `lib/utils.ts`, `config/site.ts`, hooks, Radix UI, Fumadocs UI, Motion, Lucide.
- Used by: Route layer and MDX renderers.
- Purpose: Encapsulate source loaders, i18n, metadata, structured data, content transforms, GTM events, OG rendering, and API adapters.
- Location: `lib`, `hooks`
- Contains: `lib/source.ts`, `lib/i18n.ts`, `lib/utils/metadata.ts`, `lib/utils/structured-data.ts`, `lib/api/apps-api.ts`, `hooks/use-gtm.ts`.
- Depends on: Next APIs, Fumadocs, local config, content loaders, browser APIs for hooks.
- Used by: Pages, route handlers, and client components.
- Purpose: Store static media and icons served directly or imported by components.
- Location: `public`, `assets`, `fonts`
- Contains: Public images, app icons, SVG assets, fonts, OG assets.
- Depends on: Next static file serving.
- Used by: Components, metadata, OG image generation, app-store cards.

## Data Flow

### Primary Docs Request Path

### Blog Article Path

### Marketing Page Path

### App Store Data Path

### Generated SEO Endpoints

- Global app state is provider-based for auth and deploy modals in `new-components/AuthForm/AuthFormProvider.tsx` and `new-components/DeployModal/DeployModalContext.tsx`.
- App-store loader state uses module-level caches in `config/apps-loader.ts`.
- Abuse verification rate limiting uses a module-level `Map` in `app/api/abuse/verify-turnstile/route.ts`.
- Most page content state is static build-time data from MDX, JSON, and config modules.

## Key Abstractions

- Purpose: Provide typed access to docs, blog, and AI quick reference collections.
- Examples: `lib/source.ts`, `source.config.ts`.
- Pattern: Define collections once, expose `source`, `blog`, and `faqSource` loaders to routes.
- Purpose: Keep all public pages under `/:lang` while hiding the default locale where configured.
- Examples: `lib/i18n.ts`, `app/[lang]/layout.tsx`, `app/layout.config.tsx`.
- Pattern: Use `languagesType`, `LANGUAGES`, `locales`, and `getLanguageSlug()` rather than hard-coded language path logic in components.
- Purpose: Provide canonical domains, product URLs, auth endpoints, analytics-adjacent links, Turnstile config, and metadata defaults.
- Examples: `config/site.ts`, `config/analytics.ts`.
- Pattern: Read shared values from config modules and pass localized variants through helpers.
- Purpose: Generate consistent SEO metadata and Schema.org output for route surfaces.
- Examples: `lib/utils/metadata.ts`, `lib/utils/structured-data.ts`, `components/structured-data.tsx`.
- Pattern: Route pages export `generateMetadata` from centralized helpers or call `generatePageMetadata()`.
- Purpose: Support auth and template deploy flows across route trees without prop drilling.
- Examples: `new-components/AuthForm/AuthFormProvider.tsx`, `new-components/DeployModal/DeployModalContext.tsx`, `hooks/use-auth-redirect.ts`.
- Pattern: Mount providers once in `app/[lang]/layout.tsx`; client controls consume context hooks.
- Purpose: Shared component primitives and variants.
- Examples: `components/ui/button.tsx`, `components/ui/dialog.tsx`, `components/ui/popover.tsx`, `lib/utils.ts`.
- Pattern: Compose `cn()` with Radix primitives, Lucide icons, Fumadocs components, and Tailwind classes.

## Entry Points

- Location: `app/layout.tsx`
- Triggers: Every App Router request.
- Responsibilities: Import `app/global.css` and return children.
- Location: `app/[lang]/layout.tsx`
- Triggers: All language-scoped pages.
- Responsibilities: Generate language static params, mount global providers, analytics, search, structured data, auth form, and deploy modal.
- Location: `app/[lang]/docs/[[...slug]]/page.tsx`
- Triggers: `/docs` and `/docs/*` routes for each language.
- Responsibilities: Resolve MDX page, render docs content, expose static params, and generate metadata.
- Location: `app/[lang]/(home)/blog/page.tsx`, `app/[lang]/(home)/blog/[slug]/page.tsx`
- Triggers: `/blog` and `/blog/:slug` for each language.
- Responsibilities: Render blog listing, category/tag filters, and article MDX.
- Location: `app/[lang]/(home)/(new-home)/page.tsx`, `app/[lang]/products/*/page.tsx`, `app/[lang]/solutions/industries/[industry]/page.tsx`
- Triggers: Public localized marketing URLs.
- Responsibilities: Compose product, solution, pricing, customer, and home views from local sections and shared components.
- Location: `app/api/*/route.ts`, `app/rss.xml/route.ts`, `app/sitemap-index.xml/route.ts`, `app/llms.txt/route.ts`
- Triggers: API, RSS, sitemap, robots, search, OG, and LLM text requests.
- Responsibilities: Return generated JSON, XML, text, or images from local config, content loaders, or external template data.
- Location: `package.json`, `next.config.mjs`, `scripts/generate-apps-api.js`, `scripts/normalize-root-locale.js`
- Triggers: `npm run build`, `npm run dev`, `npm run generate-apps`.
- Responsibilities: Generate app data, build Next output, normalize root locale output, and run Fumadocs MDX generation after install.

## Architectural Constraints

- **Rendering model:** Next.js App Router with static export in production via `output: process.env.NODE_ENV === 'production' ? 'export' : undefined` in `next.config.mjs`.
- **Threading:** JavaScript event loop and Next route handlers; CPU-heavy OG rendering uses `canvas` and `sharp` in `app/api/og/route.ts`.
- **Global state:** Module-level caches exist in `config/apps-loader.ts`; Turnstile verification rate-limit state exists in `app/api/abuse/verify-turnstile/route.ts`.
- **Language model:** Public routes are language-scoped by `app/[lang]`; language list is centralized in `lib/i18n.ts`.
- **Content generation:** `.source` is generated by `fumadocs-mdx` and imported by `lib/source.ts`.
- **Static images:** `next.config.mjs` sets `images.unoptimized: true` for static export compatibility.
- **Path aliases:** Use `@/*` from `tsconfig.json` for repo-root imports.
- **Secrets:** Runtime secrets are read only from environment variables, such as `TURNSTILE_SECRET_KEY` in `app/api/abuse/verify-turnstile/route.ts`.

## Anti-Patterns

### Direct Content Scans Inside Page Components

### Hard-Coded Locale URL Assembly

### Page-Local SEO Metadata Duplication

### Fetching App Template Data From UI Components

## Error Handling

- Use `notFound()` when content loader lookup fails in `app/[lang]/docs/[[...slug]]/page.tsx` and `app/[lang]/(home)/blog/[slug]/page.tsx`.
- Use `NextResponse.json()` with status codes in API routes such as `app/api/abuse/verify-turnstile/route.ts` and `app/api/og/route.ts`.
- Log external fetch/conversion failures with `console.error` in `lib/api/apps-api.ts` and `config/apps-loader.ts`.
- Throw setup guidance errors when generated app config is unavailable in `config/apps-loader.ts`.

## Cross-Cutting Concerns

<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->

## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->

## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:

- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->

## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
