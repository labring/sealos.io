# Performance Audit Architecture

**Project:** Sealos.io full-codebase performance audit
**Researched:** 2026-06-11
**Confidence:** HIGH

## Recommended Audit Structure

Structure the performance audit by data-flow ownership first, then by file location. This codebase is a static-first localized Next.js App Router site, so the highest-impact audit paths are the flows that transform content, app catalog data, generated SEO surfaces, and global client providers into either build artifacts or first-load browser work.

The audit should produce one durable report in `docs/performance-audit.md`, with each finding tied to a module boundary, a request/build path, evidence files, expected user or developer impact, and remediation order.

## Component Boundaries

| Boundary | Primary Files | Performance Responsibility | Audit Focus |
|----------|---------------|----------------------------|-------------|
| Locale app shell | `app/layout.tsx`, `app/[lang]/layout.tsx`, `app/layout.config.tsx` | Global rendering, providers, analytics, search, auth modal, deploy modal, language params | First-load JS, provider hydration cost, global scripts, duplicated chrome, static param generation |
| Marketing routes | `app/[lang]/(home)`, `app/[lang]/products`, `app/[lang]/solutions`, `app/[lang]/customers` | Static page composition and visual-heavy sections | Client component boundaries, imported assets, animation dependencies, render size, route-level metadata |
| Docs and blog routes | `app/[lang]/docs`, `app/[lang]/(home)/blog`, `content`, `source.config.ts`, `lib/source.ts` | Fumadocs MDX loading, page trees, metadata, MDX rendering | Static generation cost, MDX component cost, Mermaid/image zoom, search relevance versus payload size |
| App Store data layer | `config/apps-loader.ts`, `lib/api/apps-api.ts`, `config/apps.json`, `config/template-sources.json`, `app/[lang]/products/app-store` | App catalog loading, filtering, slug lookup, deploy URL generation, static/dynamic fallback | Duplicate normalization, cache behavior, repeated sorting/filtering, JSON payload size, client replacement of static data |
| API and generated endpoints | `app/api/*/route.ts`, `app/rss.xml/route.ts`, `app/sitemap*.ts`, `app/llms.txt/route.ts` | Search, apps API, OG images, robots, RSS, sitemap, LLM text | CPU-heavy handlers, module-initialization work, generated payload size, caching headers, static export compatibility |
| Build scripts | `package.json`, `scripts/generate-apps-api.js`, `scripts/normalize-root-locale.js`, `source.config.ts` | Remote template ingestion, generated JSON/assets, Fumadocs generation, export normalization | Serial network work, shell calls, generated file churn, build determinism, failure visibility |
| Shared UI and hooks | `components`, `new-components`, `hooks` | Reusable client interactions, modals, docs widgets, analytics helpers | `'use client'` spread, bundle-heavy dependencies, hydration hotspots, event handlers, media rendering |
| Assets and dependency surface | `public`, `assets`, `fonts`, `next.config.mjs`, `package.json` | Static media, remote images, native image libraries, bundle analysis | Unoptimized images, SVG handling, font loading, `motion`/`three`/`matter-js`/`react-player`/`canvas`/`sharp` costs |
| Deployment and CI | `.github/workflows`, `Dockerfile`, `vercel.json`, `public/_redirects`, `next.config.mjs` | Build commands, hosting target behavior, redirects, cache headers, Docker output | Build parity, static/API route mismatch, deployment-specific cache behavior, native dependency variance |

## Performance-Sensitive Data Flows

### 1. Build-Time App Catalog Refresh

```text
package.json build
  -> npm run generate-apps
  -> scripts/generate-apps-api.js
  -> template.os.sealos.io listTemplate
  -> per-template source fetch + icon download
  -> config/apps.json + config/template-sources.json + public/images/apps
  -> next build / static export
```

Inspect this first. It is serial, network-heavy, mutates committed artifacts, and sits on the critical production build path. The audit should measure request count, sequencing, timeout behavior, generated JSON size, icon download cost, shell `curl` cost, and behavior when upstream data is slow or malformed.

### 2. Runtime and Static App Store Resolution

```text
App Store route/detail page
  -> config/apps-loader.ts
  -> config/apps.json module import
  -> category/search/slug filtering
  -> components/app-store + deploy modal

Browser/API fallback
  -> /api/apps/[lang]
  -> lib/api/apps-api.ts
  -> template.os.sealos.io
  -> conversion to AppConfig-like shape
  -> client cache replacement
```

This path should be second because the same domain model crosses static JSON, runtime API conversion, route generation, client caches, filters, and deploy actions. The audit should compare static and runtime shapes, identify duplicated transformations, and quantify repeated sort/filter work in app-store UI.

### 3. Localized Layout and First-Load Browser Work

```text
Every /:lang route
  -> app/[lang]/layout.tsx
  -> Fumadocs provider + search UI
  -> analytics scripts
  -> auth provider/modal
  -> deploy provider/modal
  -> header/footer/chrome
  -> route page
```

This path affects every public page. Inspect provider hydration boundaries, analytics script strategy, modal code included on routes that rarely use it, search component loading, and shared header/footer client code. This phase should use bundle analyzer output and route-level import tracing.

### 4. Docs, Blog, and Search Generation

```text
content/docs + content/blog
  -> source.config.ts
  -> Fumadocs generated .source
  -> lib/source.ts loaders
  -> docs/blog pages + metadata
  -> app/api/search/route.ts
  -> generated search payload
```

Audit this before visual page sections because content generation drives static params, metadata, docs rendering, search, RSS, sitemap, and `llms.txt`. The main performance questions are MDX generation cost, body-content search tradeoffs, page-tree duplication across locales, Mermaid rendering cost, and payload growth as content expands.

### 5. Generated SEO and Machine-Readable Routes

```text
lib/source.ts + content/config
  -> /api/search
  -> /rss.xml
  -> /sitemap-index.xml + app/sitemap.ts
  -> /llms.txt
  -> /api/robots
```

These routes are build/runtime bridge points. Inspect module-level work, file scans, generated string size, language loops, cache headers, static export output, and hosting compatibility. `llms.txt` deserves special attention because it scans localized docs, expands includes, and can become a large text serialization path.

### 6. Dynamic Image and Thumbnail Generation

```text
/api/og
  -> app/api/og/route.ts
  -> lib/og-canvas.ts drawCanvas()
  -> canvas buffer
  -> sharp WebP encode
  -> Cache-Control response

Blog thumbnail routes
  -> TSX background components
  -> generated image response path
```

This path is CPU-heavy and native-dependency-sensitive. Inspect per-request CPU/memory, cache key behavior, static pre-generation opportunities, bundle/runtime compatibility across Vercel, Cloudflare, Docker, and local macOS, plus the size and complexity of TSX background components.

### 7. Visual-Heavy Marketing Pages

```text
Route page
  -> route-local section components
  -> shared UI/new-components
  -> motion/three/matter-js/react-player/media assets
  -> browser hydration and paint
```

Audit route groups after global shell and data flows. Focus on imported dependency cost, client component scope, media loading, animation scheduling, layout shift, and repeated data arrays embedded inside large TSX files.

### 8. Auth, Abuse, and External Verification

```text
Auth modal
  -> shared auth cookie check
  -> Turnstile token when enabled
  -> Sealos email code API
  -> Sealos OAuth redirect

Abuse form
  -> Turnstile client
  -> /api/abuse/verify-turnstile
  -> Cloudflare siteverify
  -> mailto flow
```

This path is user-interaction sensitive. Inspect client-loaded Turnstile cost, shared auth check timing, request timeouts, retry behavior, per-process rate-limit memory, and whether auth code is included in unrelated routes.

### 9. Deployment Build and Hosting Parity

```text
GitHub Actions
  -> npm install / npm ci
  -> generate-apps
  -> next build / static export
  -> Vercel, Cloudflare Pages, Docker/GHCR
  -> redirects/cache headers/runtime route behavior
```

Audit this after code-level paths are mapped because deployment differences decide which performance fixes are valid. Verify command parity, Node version parity, cache reuse, static export/API route compatibility, native `canvas`/`sharp` behavior, and redirect/canonical duplication.

## Suggested Audit Order

| Phase | Scope | Why This Order | Dependency Implication |
|-------|-------|----------------|------------------------|
| 1 | Build-time app catalog pipeline | It is already identified as serial, network-heavy, and build-blocking | Later App Store and deployment findings depend on knowing the canonical app data source |
| 2 | App Store runtime/static data path | It shares models with the generator and user-facing app pages | Establishes whether normalization should be audited as one shared module |
| 3 | Global locale shell and first-load bundles | Every route pays this cost | Route-level page audits need a clean baseline for shared JS and providers |
| 4 | Docs/blog/Fumadocs content pipeline | It feeds pages, metadata, search, RSS, sitemap, and `llms.txt` | Search and generated SEO endpoint audits depend on loader behavior |
| 5 | Generated API/SEO endpoints | These are compact, high-risk build/runtime bridge points | Classifies which endpoints should become static artifacts, runtime handlers, or cached outputs |
| 6 | OG/image generation and native dependencies | CPU-heavy route work can dominate uncached requests and deployment variance | Deployment audit needs native dependency facts from this phase |
| 7 | Visual-heavy marketing and product pages | Route-level UX cost is clearer after shared-shell costs are separated | Findings should avoid double-counting global provider and analytics cost |
| 8 | Auth, Turnstile, abuse, analytics integrations | External calls affect interaction latency and third-party script cost | Needs shell and client bundle context to assign ownership correctly |
| 9 | Deployment, CI, static export, redirects, cache headers | Deployment behavior validates whether fixes survive each hosting target | Final remediation roadmap should account for Vercel, Cloudflare, Docker, and Kubernetes paths |

## Cross-Module Coupling Risks

| Coupling | Files | Performance Risk | Audit Treatment |
|----------|-------|------------------|-----------------|
| Generator/API/app-loader normalization split | `scripts/generate-apps-api.js`, `lib/api/apps-api.ts`, `config/apps-loader.ts`, `config/apps.json` | Repeated transformations, inconsistent payloads, cache misses, duplicate filtering | Audit as one App Store data subsystem with static and runtime branches |
| Static export with route handlers | `next.config.mjs`, `app/api/*`, `app/rss.xml/route.ts`, `app/llms.txt/route.ts` | API-like code can behave differently across static, Vercel, Cloudflare, and Docker targets | Classify each endpoint by required runtime: static artifact, edge/server route, or external service |
| Fumadocs loaders feeding many surfaces | `source.config.ts`, `lib/source.ts`, docs/blog routes, search, RSS, sitemap, `llms.txt` | One content change can increase build time, search payload, metadata generation, and text export size | Record loader call graph and count content traversal per build/route |
| Global providers mounted for every route | `app/[lang]/layout.tsx`, `new-components/AuthForm`, `new-components/DeployModal`, docs search, analytics | Rarely used interactions can inflate common-route JS and hydration | Measure shared layout bundle first, then assign page-specific costs |
| Remote media and static export image config | `next.config.mjs`, `config/apps.json`, `components/ui/app-icon.tsx`, app-store components | Unoptimized remote images and SVGs can harm first paint and shift risk into browser work | Audit image source type, dimensions, local copies, remote host, and cacheability |
| Native rendering dependencies across hosts | `app/api/og/route.ts`, `lib/og-canvas.ts`, `package.json`, `Dockerfile`, workflows | `canvas` and `sharp` affect install time, runtime CPU, and host compatibility | Treat OG generation as both runtime performance and deployment performance |
| Analytics language gating | `components/analytics/index.tsx`, `config/analytics.ts`, `app/[lang]/layout.tsx` | Third-party scripts can alter LCP/INP and differ by locale | Audit by language route, script strategy, and enabled integration set |
| Redirect/canonical surface split | `next.config.mjs`, `vercel.json`, `public/_redirects`, `lib/utils/metadata.ts`, `app/api/robots/route.ts` | Extra redirects and mismatched canonicals can waste request hops and crawl budget | Include redirect chain and generated metadata checks in deployment phase |

## Phase Deliverables for `docs/performance-audit.md`

Each audit phase should append rows using this contract:

| Field | Requirement |
|-------|-------------|
| Module boundary | One of the boundaries above |
| Data flow | Directional path from trigger to output |
| Evidence | File paths and relevant function/component names |
| Cost type | Build time, first load, interaction, route CPU, network, asset, deployment |
| Finding | Concrete performance risk with root cause |
| Severity | High, Medium, Low |
| Verification | Static evidence, bundle analyzer, local build timing, route timing, or source trace |
| Fix direction | Durable remediation, owner module, and dependency constraints |

## Build Order and Dependency Implications

1. Establish App Store data truth before auditing app-store UI. UI findings around filters, detail pages, README rendering, and deploy modal can be misleading until static and runtime app shapes are compared.
2. Measure the locale shell before route pages. The shared layout includes analytics, search, auth, deploy modal, providers, and chrome, so page-level bundle cost should be calculated as incremental cost above this baseline.
3. Map Fumadocs traversal before generated endpoints. Search, RSS, sitemap, metadata, and `llms.txt` all depend on the same loaders; repeated content traversal is a system-level issue.
4. Classify endpoints before deployment recommendations. Static export, Vercel routes, Cloudflare Pages, Docker, and Kubernetes have different runtime guarantees, so endpoint cost must be tied to hosting behavior.
5. Audit native image generation before CI/Docker conclusions. `canvas` and `sharp` affect route CPU and install/runtime variance, so deployment-phase findings should depend on measured import/render behavior.

## Recommended Inspection Techniques

| Technique | Use For | Expected Evidence |
|-----------|---------|-------------------|
| Import graph and `'use client'` scan | Shared shell, visual pages, modal providers | Files that pull client bundles into broad route scopes |
| Bundle analyzer with `ANALYZE=true` | Route and dependency cost | Heavy chunks from `motion`, `three`, `matter-js`, `react-player`, docs widgets, auth/deploy modals |
| Timed local build with network disabled/enabled | Generator, Fumadocs, static export | Delta between snapshot build and remote refresh build |
| Request count and concurrency trace | `scripts/generate-apps-api.js`, `/api/apps` | Serial versus parallel fetch behavior and slow upstream sensitivity |
| Payload inventory | `/api/search`, `/api/apps`, `/llms.txt`, JSON configs | Response size, locale sharding, generated text size |
| CPU/memory spot checks | `/api/og`, image thumbnail routes, MDX generation | Per-render timing, buffer sizes, native dependency import behavior |
| Deployment command parity review | Workflows and Docker | Divergent Node versions, install commands, build flags, cache headers |

## Architecture Recommendation

Use a nine-phase audit roadmap that starts with build-time data generation, then app-store data consistency, then global first-load cost, then content and generated endpoints, then CPU-heavy image generation, route-level visual pages, external interaction paths, and deployment parity. This order follows real dependencies in the codebase and prevents later page audits from mixing shared-shell, content-loader, and deployment costs into the wrong modules.

## Sources

- `.planning/PROJECT.md` - project scope, constraints, and known likely performance zones.
- `.planning/codebase/ARCHITECTURE.md` - system layers, entry points, data flows, and architectural constraints.
- `.planning/codebase/STRUCTURE.md` - directory/module boundaries and key files.
- `.planning/codebase/INTEGRATIONS.md` - external APIs, analytics, auth, storage, CI/CD, and environment dependencies.
- `.planning/codebase/CONCERNS.md` - known bottlenecks, fragile areas, scaling limits, and test gaps.
