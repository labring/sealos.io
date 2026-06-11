# Feature Landscape: Sealos.io Performance Audit

**Domain:** Brownfield full-codebase performance audit for Sealos.io
**Researched:** 2026-06-11
**Output consumer:** Requirements definition for `docs/performance-audit.md`
**Overall confidence:** HIGH for repo-specific module inventory, MEDIUM for deeper runtime impact until measured with build/analyzer/browser evidence

## Scope Decision

The v1 audit should cover every module that can change user-facing load speed, static export build time, API/route-handler latency, generated asset size, dependency weight, or developer feedback time. The audit should produce file-level evidence and a remediation order, with findings grouped by module and by performance-risk category.

## Table-Stakes Audit Categories

These categories are required in v1. Missing any of them would make the audit incomplete for this repo.

| Category | Why Expected | Likely Files or Directories | Checks | Complexity | Confidence |
|---|---|---|---|---|---|
| Route entry and static generation cost | The site is a localized Next.js App Router static-first site with many page entries. | `app/layout.tsx`, `app/[lang]/layout.tsx`, `app/[lang]/**/page.tsx`, `app/[lang]/**/layout.tsx`, `app/sitemap.ts`, `app/sitemap-ai-faq.ts` | Identify all route entries, `generateStaticParams`, `generateMetadata`, async page work, repeated loader calls, broad imports, and static export constraints. | High | HIGH |
| Localized docs and MDX rendering | Fumadocs powers docs/blog/AI reference, and content scale affects build time, search, metadata, and client rendering. | `content/docs`, `content/blog`, `content/ai-quick-reference`, `source.config.ts`, `lib/source.ts`, `app/[lang]/docs/**`, `components/mdx/**`, `lib/remark/**` | Check MDX generation cost, page-tree loading, Mermaid handling, image zoom, GitHub edit links, body-content processing, duplicated content scans, and per-locale static params. | High | HIGH |
| App Store data and rendering path | App Store is the most complex product module with generated data, runtime API fallback, detail pages, deploy flows, and client filters. | `app/[lang]/products/app-store/**`, `components/app-store/**`, `config/apps-loader.ts`, `config/apps.json`, `config/template-sources.json`, `lib/api/apps-api.ts`, `scripts/generate-apps-api.js` | Check static data load size, dynamic API fallback, slug/search/category filtering, pagination, detail page README rendering, screenshot/image loading, related-template selection, deploy URL derivation, and duplicate normalization work. | High | HIGH |
| Build-time remote generation | `npm run build` invokes remote template generation and image downloads before `next build`. | `package.json`, `scripts/generate-apps-api.js`, `scripts/normalize-root-locale.js`, `public/images/apps/`, `config/apps.json`, `config/template-sources.json` | Measure serial network fan-out, icon download strategy, source-input fetch behavior, timeout/retry behavior, JSON rewrite churn, build coupling, and cacheability. | High | HIGH |
| API and generated SEO endpoints | Routes produce search, OG, RSS, sitemap, robots, apps, abuse verification, and LLM text surfaces. | `app/api/**/route.ts`, `app/rss.xml/route.ts`, `app/sitemap-index.xml/route.ts`, `app/llms.txt/route.ts`, `lib/og-canvas.ts`, `lib/utils/metadata.ts`, `lib/utils/structured-data.ts` | Check CPU-heavy work, response caching, module-initialization payloads, content scans, XML/text generation loops, remote fetches, and static-export compatibility. | High | HIGH |
| Client component and hydration boundaries | Global layout mounts search, auth, deploy, analytics, and visual components across many pages. | `app/[lang]/layout.tsx`, `components/docs/Search.tsx`, `new-components/AuthForm/**`, `new-components/DeployModal/**`, `new-components/Header.tsx`, `components/header/**`, `hooks/**` | Inventory `'use client'` boundaries, provider scope, modal bundle reach, browser-only hooks, GTM hooks, initial state work, and route-wide hydration cost. | High | HIGH |
| Bundle-heavy dependency usage | The repo depends on `motion`, `three`, `matter-js`, `mermaid`, `react-player`, `canvas`, `sharp`, Fumadocs UI, Radix packages, and Lucide. | `package.json`, `next.config.mjs`, `components/**`, `new-components/**`, `app/[lang]/**`, `lib/og-canvas.ts` | Map import sites, dynamic import opportunities, route-level usage, analyzer output, server-only/native package leakage into client bundles, and `optimizePackageImports` effectiveness. | High | HIGH |
| Asset and image loading | Static export uses unoptimized images and broad remote patterns with SVG allowed. | `next.config.mjs`, `public/**`, `assets/**`, `fonts/**`, `components/ui/app-icon.tsx`, `components/app-store/app-grid.tsx`, `app/[lang]/products/app-store/**` | Check image dimensions, remote image domains, SVG handling, local font loading, app icons, screenshots, video/media assets, layout shift risk, and large imported assets. | Medium | HIGH |
| Marketing page visual sections | Home/product/customer/solution pages are visual-heavy and likely to carry animation/render cost. | `app/[lang]/(home)/(new-home)/**`, `app/[lang]/products/devbox/**`, `app/[lang]/products/databases/**`, `app/[lang]/solutions/**`, `app/[lang]/customers/**`, `new-components/**`, `components/ui/**` | Check repeated section imports, animation libraries, counters, intersection observers, responsive media, client-only visual effects, and above-the-fold payload. | Medium | HIGH |
| Search and docs discovery | `/api/search` is already a known functionality/performance tradeoff. | `app/api/search/route.ts`, `components/docs/Search.tsx`, `lib/source.ts`, `content/docs/**` | Check index generation timing, payload size, indexed fields, locale sharding, cache headers, client search bundle cost, and future full-body search impact. | Medium | HIGH |
| Runtime fetch, cache, and fan-out patterns | External calls exist in app-template APIs, README loading, abuse verification, analytics, and hooks. | `lib/api/apps-api.ts`, `config/apps-loader.ts`, `hooks/use-template-source.ts`, `app/api/abuse/verify-turnstile/route.ts`, `app/[lang]/products/app-store/[slug]/components/ReadmeMarkdownWindow.tsx`, `lib/gtm*.ts` | Check sequential fetches, duplicated fetches, cache scope, fallback payloads, browser/session caches, CDN cache headers, and timeout behavior. | High | HIGH |
| CI/CD and deployment build paths | Multiple workflows and targets can produce divergent performance behavior. | `.github/workflows/**`, `Dockerfile`, `vercel.json`, `public/_redirects`, `package.json`, `next.config.mjs` | Check command parity, analyzer availability, install strategy, preview vs production build path, Docker/native dependency variance, redirects, and artifact output expectations. | Medium | HIGH |
| Test and verification surface for performance findings | Existing tests cover App Store behavior and data quality, but API/docs/rendering coverage is limited. | `*.test.mts`, `*.test.mjs`, `config/apps-data-quality.test.mts`, `scripts/generate-apps-api.test.mjs`, `package.json` | Check whether findings can be protected by existing Node tests, source-text tests, build analyzer, lint, static scripts, or new smoke checks. | Medium | HIGH |

## Differentiating or Deeper Audit Categories

These should be included after table-stakes inventory when evidence suggests meaningful impact. They can create a stronger audit than a generic checklist.

| Category | Value Proposition | Likely Files or Directories | Checks | Complexity | Confidence |
|---|---|---|---|---|---|
| Static export route classification | Clarifies which API-like routes can become static artifacts and which need runtime hosting. | `next.config.mjs`, `app/api/**`, `app/rss.xml/route.ts`, `app/llms.txt/route.ts`, `app/sitemap*.ts`, `vercel.json`, `public/_redirects` | Classify each route as static artifact, edge/server endpoint, external service, or build-time generated file. | High | HIGH |
| Native rendering dependency isolation | `canvas` and `sharp` can create build/runtime variance and cold-start cost. | `app/api/og/route.ts`, `lib/og-canvas.ts`, `app/api/blog/**/thumbnail/**`, `package.json`, `Dockerfile` | Check import boundaries, native binary installation needs, route caching, build-time OG alternatives, and smoke-test options. | Medium | HIGH |
| Full content-index strategy | Search quality and index payload growth are coupled. | `app/api/search/route.ts`, `lib/source.ts`, `content/docs/**`, `content/blog/**`, `source.config.ts` | Compare metadata-only search, precomputed search artifact, language sharding, excerpts, headings, and client payload size. | High | MEDIUM |
| App Store normalization unification | Performance and correctness both improve when generator/runtime/client paths share one normalization module. | `scripts/generate-apps-api.js`, `lib/api/apps-api.ts`, `config/apps-loader.ts`, `config/apps-data-quality.test.mts` | Map duplicate transformations and recommend a shared typed conversion path. | Medium | HIGH |
| Client interaction responsiveness | Header, deploy modal, auth modal, filters, Mermaid, video, and counters affect perceived quality. | `new-components/Header.tsx`, `new-components/AuthForm/**`, `new-components/DeployModal/**`, `app/[lang]/products/app-store/components/**`, `components/mdx/mermaid.tsx`, `components/video.tsx` | Check input latency, modal open cost, filter/sort complexity, lazy loading, and idle/deferred work. | Medium | MEDIUM |
| Dependency major-version alignment impact | Core package major mismatch can affect build output and analyzer trust. | `package.json`, `package-lock.json`, `next.config.mjs` | Check Next 14 with `@next/*` 15 packages, analyzer behavior, MDX integration, peer warnings, and install determinism. | Medium | HIGH |
| Redirect/canonical performance and crawl efficiency | Redirect chains and canonical generation affect both crawl budget and user navigation latency. | `next.config.mjs`, `vercel.json`, `public/_redirects`, `app/api/robots/route.ts`, `lib/utils/metadata.ts`, `lib/i18n.ts` | Check redirect parity, default-locale behavior, canonical URL generation, sitemap consistency, and root path normalization. | Medium | HIGH |
| Large-component hotspot review | Large TSX modules often hide repeated render work, data arrays, and unbounded loops. | `new-components/Header.tsx`, `app/[lang]/customers/[slug]/page.tsx`, `app/[lang]/(home)/(new-home)/sections/**`, `app/api/blog/**/bgs/**`, `lib/og-canvas.ts` | Flag large modules, mixed concerns, repeated arrays, inline object churn, and extraction candidates that enable testing. | Medium | HIGH |

## Anti-Features and Deferred Items

| Anti-Feature or Deferred Item | Why Avoid in v1 | What to Do Instead |
|---|---|---|
| Production load testing against live Sealos services | The project goal is a source-level audit and local evidence report; live traffic tests add operational risk and need separate approval. | Record where load tests would be useful and keep v1 to local build/runtime inspection. |
| Direct performance fixes during initial discovery | Fixes can obscure cross-module patterns before the report is complete. | Capture root cause, impact, and fix order in `docs/performance-audit.md`. |
| SEO copy rewrites or visual redesign | The audit targets performance-risk code paths and assets. | Limit SEO/UI comments to performance effects such as payload, route generation, redirects, metadata generation, and layout stability. |
| New analytics instrumentation as a primary task | Instrumentation changes expand product scope and can affect privacy/compliance. | Use existing build output, analyzer output, route inspection, and local measurements. |
| Database query tuning | The repo is a static/docs/marketing site with external template APIs and static JSON rather than a production database layer. | Audit API fetches, generated data, JSON transforms, and remote fallback behavior. |
| Wholesale framework migration | The roadmap depends on the current Next.js/Fumadocs/static-export architecture. | Recommend targeted changes inside the existing stack. |
| Broad content quality audit | Content quality is a separate editorial problem. | Inspect content only where it affects MDX generation, search payload, assets, links, or metadata. |

## Module List With Expected Audit Coverage

| Module | Expected v1 Coverage | Key Files or Directories | Primary Risk Categories |
|---|---|---|---|
| Root and localized app shell | Global CSS, locale layout, provider scope, analytics, search/auth/deploy mounting, structured data, route static params. | `app/layout.tsx`, `app/[lang]/layout.tsx`, `app/layout.config.tsx`, `app/[lang]/conditional-site-banner.tsx`, `app/[lang]/homepage-dark-mode.tsx` | Route entry cost, hydration boundaries, bundle reach, analytics cost |
| Home marketing pages | Above-the-fold composition, visual components, animation imports, repeated assets, server/client split. | `app/[lang]/(home)/(new-home)/**`, `new-components/**`, `components/ui/**` | Visual-heavy sections, bundle-heavy dependencies, client hydration |
| Blog and AI quick reference | Listing/article generation, metadata, MDX rendering, content loaders, sitemap generation. | `app/[lang]/(home)/blog/**`, `app/[lang]/(home)/ai-quick-reference/**`, `content/blog`, `content/ai-quick-reference`, `lib/utils/blog-utils*.ts` | MDX generation, route static generation, metadata, search/crawl surfaces |
| Documentation | Docs route generation, Fumadocs source, page tree, Mermaid, image zoom, docs search integration. | `app/[lang]/docs/**`, `content/docs`, `source.config.ts`, `lib/source.ts`, `components/docs/**`, `components/mdx/**`, `lib/remark/**` | MDX rendering, search index, Mermaid/client cost, static params |
| App Store index | Static app loading, filter/sort/pagination, highlighted apps, category showcase, empty/error/loading states. | `app/[lang]/products/app-store/page.tsx`, `app/[lang]/products/app-store/components/**`, `components/app-store/**`, `config/apps-loader.ts`, `config/apps.json` | Data size, client interaction, render loops, image loading |
| App Store detail | Detail static params, README rendering, screenshot loading, related templates, deploy button, metadata, legacy slug handling. | `app/[lang]/products/app-store/[slug]/**`, `hooks/use-template-source.ts`, `config/template-sources.json` | Remote content fetch, markdown render cost, media loading, route generation |
| App data generator | Template list fetch, conversion, icon downloads, template source fetches, JSON writes, clean mode. | `scripts/generate-apps-api.js`, `scripts/generate-apps-api.test.mjs`, `public/images/apps/`, `config/apps.json`, `config/template-sources.json` | Build-time network, serial work, native shell cost, cacheability |
| Apps API and loader | Runtime API conversion, static fallback, client dynamic loading, cache maps, language handling. | `app/api/apps/[[...lang]]/route.ts`, `lib/api/apps-api.ts`, `config/apps-loader.ts`, `config/apps.ts` | Runtime fetch fan-out, duplicated normalization, cache scope, fallback payload |
| DevBox and Databases product pages | Product-section composition, images/icons, animated counters, CTA sections. | `app/[lang]/products/devbox/**`, `app/[lang]/products/databases/**`, `components/animated-icons/**` | Visual-heavy pages, dependency reach, asset loading |
| Solutions and industries | Dynamic industry routes, content/config loading, static params, visual sections. | `app/[lang]/solutions/**`, `config/industries.tsx` | Route generation, config size, visual sections |
| Customers | Customer listing/detail, filters, TOC/sidebar, testimonials, large detail page. | `app/[lang]/customers/**` | Client filtering, large TSX modules, image/media loading |
| Abuse/contact/legal | Form interactions, Turnstile verification, simple static pages, legal MDX. | `app/[lang]/abuse/**`, `app/api/abuse/verify-turnstile/route.ts`, `app/[lang]/contact/page.tsx`, `app/[lang]/legal/**` | Runtime verification latency, rate-limit memory, static page cost |
| Generated SEO endpoints | RSS, sitemap, robots, llms text, metadata, structured data. | `app/rss.xml/route.ts`, `app/sitemap-index.xml/route.ts`, `app/sitemap.ts`, `app/sitemap-ai-faq.ts`, `app/llms.txt/route.ts`, `app/api/robots/route.ts`, `lib/utils/metadata.ts`, `lib/utils/structured-data.ts` | Content scans, route handler CPU, static artifact opportunity |
| Search endpoint and UI | Static search API, docs search UI, locale handling, future full-body index risk. | `app/api/search/route.ts`, `components/docs/Search.tsx`, `lib/source.ts` | Index payload, build memory, client search cost |
| OG and thumbnail generation | Canvas drawing, Sharp encoding, blog thumbnail backgrounds, cache headers. | `app/api/og/route.ts`, `lib/og-canvas.ts`, `app/api/blog/[lang]/[slug]/thumbnail/[format]/**`, `fonts/**` | CPU-heavy route handlers, native dependencies, cache strategy |
| Shared UI primitives | Button/input/dialog/popover/select/accordion/navigation primitives and animated widgets. | `components/ui/**`, `components/video.tsx`, `components/scroll-progress-wrapper.tsx`, `components/structured-data.tsx` | Bundle reach, hydration, animation/media cost |
| Header/footer/auth/deploy system | Navigation menus, dropdowns, auth modal steps, deploy modal provider and template form. | `components/header/**`, `components/footer/**`, `new-components/Header.tsx`, `new-components/Footer/**`, `new-components/AuthForm/**`, `new-components/DeployModal/**` | Route-wide client code, modal lazy loading, interaction latency |
| Hooks and browser utilities | GTM events, auth redirects, template source fetching, button handlers, typewriter effect. | `hooks/**`, `lib/gtm*.ts`, `lib/utils/shared-auth.ts` | Browser fetches, client state, repeated effects, analytics cost |
| Asset and font inventory | Public images, imported assets, fonts, app icons, SVG assets. | `public/**`, `assets/**`, `fonts/**` | Static payload, unoptimized images, SVG safety/performance, layout stability |
| Build/deploy configuration | Next config, static export, bundle analyzer, redirects, workflows, Docker. | `next.config.mjs`, `package.json`, `.github/workflows/**`, `Dockerfile`, `vercel.json`, `public/_redirects` | Build time, analyzer reliability, deployment parity, native package variance |
| Existing tests and audit scripts | Data-quality tests, App Store tests, generator tests, URL audit shell script. | `config/*.test.mts`, `app/[lang]/products/app-store/**/*.test.mts`, `components/app-store/*.test.mts`, `scripts/*.test.mjs`, `scripts/url-index-audit.sh` | Verification gaps, regression coverage, audit automation potential |

## Feature Dependencies

```text
Module inventory -> Route entry/static generation audit
Module inventory -> Bundle-heavy dependency map
Module inventory -> Asset inventory

Route entry/static generation audit -> Static export route classification
Route entry/static generation audit -> Generated SEO endpoint audit

Content/MDX inventory -> Search endpoint audit
Content/MDX inventory -> Blog/docs/AI quick reference audit
Content/MDX inventory -> llms.txt/RSS/sitemap audit

App Store module audit -> App data generator audit
App Store module audit -> Apps API and loader audit
App Store module audit -> Deploy modal/template-source audit

Bundle-heavy dependency map -> Client hydration audit
Bundle-heavy dependency map -> Visual-heavy marketing page audit
Bundle-heavy dependency map -> Native rendering dependency isolation

Asset inventory -> Image loading audit
Asset inventory -> App Store detail/media audit
Asset inventory -> OG/thumbnail generation audit

Build/deploy configuration audit -> CI/CD parity audit
Build/deploy configuration audit -> Static export route classification
Build/deploy configuration audit -> Dependency major-version alignment audit
```

## MVP Recommendation for v1 Audit

Prioritize:

1. Complete module inventory and route classification for `app`, `components`, `new-components`, `config`, `lib`, `hooks`, `scripts`, assets, and workflows.
2. Audit App Store end to end because it combines generated data, remote APIs, client filtering, images, README rendering, detail pages, and deploy flows.
3. Audit docs/MDX/search end to end because Fumadocs content affects build time, search payload, metadata, and user-facing docs performance.
4. Audit generated endpoints and native rendering because `/api/search`, `/api/og`, `/rss.xml`, `/llms.txt`, sitemaps, and robots can create hidden route-handler or static-export costs.
5. Audit bundle/assets/hydration because global providers and visual dependencies can affect every page.
6. Audit build/deploy paths because `npm run build` currently depends on remote generation and multiple deployment targets.

Defer:

- Production load testing: requires a separate operational scope.
- Direct fixes: the current deliverable is the report and prioritized remediation path.
- Editorial SEO/content rewriting: include only performance-relevant content processing issues.

## Table-Stakes Checks for `docs/performance-audit.md`

Each module section in the final audit report should include:

| Check | Required Evidence |
|---|---|
| Module entry points | File paths and route/API/script names. |
| Runtime surface | Static page, client component, route handler, build script, workflow, or static asset. |
| User-facing impact | Initial load, interaction latency, search/docs quality, image/media load, generated endpoint latency, or redirect/navigation latency. |
| Build/developer impact | Build time, install/native dependency risk, remote network dependency, analyzer availability, CI variance, or generated-file churn. |
| Data/network behavior | Fetch count, sequential vs concurrent flow, cache scope, timeout/retry behavior, payload size, fallback behavior. |
| Bundle/asset behavior | Heavy imports, client boundary reach, dynamic import opportunity, unoptimized image/SVG/font/media risk. |
| Static export compatibility | Works as static artifact, needs runtime route, depends on platform rewrite, or should be pre-generated. |
| Existing verification | Current tests/scripts that cover it and missing checks needed for safe remediation. |
| Finding priority | Severity, confidence, root cause, expected fix class, and recommended order. |

## Sources

- `.planning/PROJECT.md` (HIGH): project scope, validated modules, active audit requirements, constraints, and out-of-scope boundaries.
- `.planning/codebase/STRUCTURE.md` (HIGH): repo directory structure, key files, route/component/data locations, testing file locations.
- `.planning/codebase/ARCHITECTURE.md` (HIGH): layers, data flows, route handlers, App Store flow, generated SEO endpoints, static export constraints.
- `.planning/codebase/TESTING.md` (HIGH): current Node test runner, test files, source-text regression patterns, coverage gaps.
- `.planning/codebase/CONCERNS.md` (HIGH): known performance bottlenecks, fragile areas, scaling limits, missing critical checks, dependency risks.
- `package.json` (HIGH): scripts and dependency inventory.
- `next.config.mjs` (HIGH): static export, image, bundle analyzer, optimizer, and rewrite behavior.
- Repo file inventory from `rg --files app config lib components new-components hooks scripts .github` (HIGH): module coverage validation.
