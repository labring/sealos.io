# Project Research Summary

**Project:** Sealos.io Performance Audit
**Domain:** Brownfield full-codebase performance audit for a static-first localized Next.js/Fumadocs site
**Researched:** 2026-06-11
**Confidence:** HIGH for repository structure and audit scope; MEDIUM for final runtime severity until measured

## Executive Summary

Sealos.io is a localized Next.js App Router marketing, documentation, and app catalog site with static export behavior, Fumadocs content generation, generated SEO endpoints, route handlers, build-time app template ingestion, and visual-heavy frontend modules. Experts should audit it by ownership of data flow and execution timing: build step, static generation, request handler, shared client shell, route-level browser work, asset delivery, and deployment target.

The recommended approach is a structured, module-by-module audit that writes durable findings to `docs/performance-audit.md` before remediation. The audit should begin with the App Store generation pipeline and route/static export classification because these determine which later findings are build-time, request-time, static-artifact, or deployment-specific. Bundle, media, animation, and interaction findings should rely on analyzer output or source-level runtime evidence.

The key risks are duplicate findings across shared pipelines, hidden build latency from remote template generation, static export mismatch with API-like routes, CPU-heavy native image routes, Fumadocs/search payload growth, and global client providers inflating every page. Mitigation requires duplicate keys, execution-time tags, route classification, file-level evidence, and a final consolidation pass that separates candidate, confirmed, dismissed, and deferred findings.

## Key Findings

### Recommended Stack

The audit should preserve the existing stack and focus on measuring how the current architecture behaves. The relevant stack is Next.js 14 App Router with React 18, TypeScript, Fumadocs MDX, static export, npm scripts, route handlers, generated JSON/assets, and multi-target deployment through Vercel, Cloudflare Pages, Docker/Nginx, and GitHub Actions.

**Core technologies and audit implications:**
- Next.js App Router static export: classify route handlers, generated pages, metadata, redirects, and static artifacts before assigning severity.
- React 18 client components: trace `'use client'` boundaries from shared layout, header, docs search, auth modal, deploy modal, App Store filters, and visual effects.
- Fumadocs MDX: measure content generation, page-tree traversal, search indexing, Mermaid rendering, RSS/sitemap/`llms.txt` reuse, and payload growth.
- App Store generator and loaders: audit `scripts/generate-apps-api.js`, `config/apps-loader.ts`, `lib/api/apps-api.ts`, generated JSON, icon downloads, README loading, and deploy flow as one subsystem.
- Heavy media/native dependencies: isolate `motion`, `three`, `matter-js`, `react-player`, `mermaid`, `canvas`, `sharp`, `satori`, local assets, remote images, SVGs, and fonts.
- CI/CD and hosting config: compare build commands, output artifacts, cache headers, redirects, native dependency behavior, and route support across hosting targets.

### Expected Audit Coverage

**Must have:**
- Complete module inventory across routes, components, data pipelines, API routes, scripts, integrations, assets, and deployment surfaces.
- Static generation and route-handler classification for App Router pages, `app/api/**`, RSS, sitemap, robots, search, OG, thumbnails, and `llms.txt`.
- Build-time audit of remote app template generation, icon downloads, generated JSON churn, Fumadocs generation, analyzer build, Docker build, and export post-processing.
- App Store end-to-end audit covering generator, runtime API, static loader, client cache, filters, detail pages, README rendering, screenshots, deploy modal, and tests.
- Docs/blog/Fumadocs/search audit covering MDX generation, localized content traversal, metadata, Mermaid, search payload, RSS, sitemap, and `llms.txt`.
- Bundle, hydration, asset, image, media, animation, and frontend interaction audit with route ownership and evidence.
- Evidence/reporting contract for `docs/performance-audit.md` with severity, status, files, root cause, work type, execution time, validation coverage, and duplicate key.

**Should have:**
- Static export route table with hosting-target implications.
- Native rendering dependency isolation for OG and thumbnail paths.
- Search strategy analysis covering metadata-only search, body-content growth, sharding, precomputed artifacts, and relevance tradeoffs.
- Shared App Store normalization recommendation across generator, runtime API, loader, and tests.
- Dependency version baseline for `next`, `@next/mdx`, and `@next/bundle-analyzer` before trusting analyzer output.
- Deployment parity review for Vercel, Cloudflare Pages, Docker/Nginx, GitHub Actions, redirects, headers, and cache behavior.

**Defer:**
- Production load testing against live Sealos services.
- Direct performance fixes during first-pass discovery.
- SEO copy rewrites, visual redesign, broad editorial content audit, database tuning, and framework migration.

### Architecture Approach

The audit should be organized by data-flow ownership before file location. The roadmap should follow dependencies: build-time App Store generation, App Store runtime/static data consistency, global locale shell baseline, Fumadocs content traversal, generated endpoints, native image generation, visual-heavy route pages, external interaction paths, then deployment parity.

**Major components:**
1. Locale app shell: global layout, providers, analytics, search, auth, deploy modal, header/footer, and shared hydration cost.
2. Marketing/product/customer routes: static page composition, visual-heavy sections, animation imports, route metadata, media, and route-local client code.
3. Docs/blog/content pipeline: Fumadocs source, MDX rendering, Mermaid, metadata, search, RSS, sitemap, and `llms.txt`.
4. App Store data subsystem: remote generator, generated JSON, runtime API, client loader, filters, detail pages, README, deploy URLs, and normalization.
5. API/generated endpoint layer: search, apps API, OG, thumbnails, robots, RSS, sitemap, LLM text, abuse verification, and cache behavior.
6. Build/deployment layer: npm scripts, analyzer, static export normalization, Docker, workflows, redirects, headers, and host-specific runtime support.

### Critical Pitfalls

1. **Splitting App Store data into unrelated findings** — keep generator, API, loader, pages, README, and deploy modal under `app-store-data-pipeline` with sub-findings.
2. **Treating remote generation as generic build time** — time `generate-apps`, `next build`, analyzer, Docker, and export normalization separately.
3. **Missing static export route reality** — classify every route-like endpoint by static artifact, runtime route, external service, or deployment-specific behavior before severity scoring.
4. **Stopping at page entrypoints** — search for function-level hotspots such as sync filesystem calls, shell calls, native canvas/sharp, markdown processors, nested loops, and network helpers.
5. **Counting client components without impact evidence** — require bundle analyzer, route ownership, runtime triggers, rAF/timer/listener evidence, or browser traces for frontend performance claims.
6. **Leaving candidates open forever** — require status, duplicate key, validation coverage, and dismissal rationale when evidence shows acceptable impact.

## Implications for Roadmap

Based on research, use a seven-phase audit roadmap.

### Phase 1: Audit Ledger and Module Inventory

**Rationale:** Shared surfaces, duplicate keys, and evidence schema must exist before page-by-page inspection.  
**Delivers:** `docs/performance-audit.md` skeleton, module taxonomy, route list, API route list, script list, asset/dependency register, shared component register, duplicate-key policy.  
**Addresses:** Complete module inventory and evidence/reporting contract.  
**Avoids:** Duplicate shared-layout findings and open-ended candidate lists.

### Phase 2: Build-Time App Catalog Pipeline

**Rationale:** `npm run build` depends on remote template generation, icon downloads, source fetches, generated JSON, and post-processing. This can dominate CI and production build time independently from Next.js.  
**Delivers:** Timing and source evidence for `scripts/generate-apps-api.js`, generated files, request/fetch/icon counts, cache/failure behavior, and build coupling.  
**Addresses:** Build-time remote generation, generated-file churn, App Store data source truth.  
**Avoids:** Treating remote network work as ordinary `next build` cost.

### Phase 3: App Store Runtime and Static Data Path

**Rationale:** App Store user paths reuse the same domain model through static JSON, runtime API, client cache, route generation, detail pages, README, screenshots, and deploy modal.  
**Delivers:** Static/runtime shape comparison, duplicated normalization map, cache behavior, payload size, filter/search cost, README fetch/render audit, detail page media audit.  
**Addresses:** App Store index, detail, loader, API, deploy flow, template source behavior, and tests.  
**Avoids:** Re-auditing one data pipeline as many unrelated issues.

### Phase 4: Route Classification and Content/Generated Endpoints

**Rationale:** Static export and route handlers create deployment-sensitive behavior. Fumadocs loaders feed docs pages, search, metadata, RSS, sitemap, and `llms.txt`.  
**Delivers:** Route classification table; Fumadocs traversal map; search payload/relevance analysis; RSS/sitemap/robots/`llms.txt` cost notes; static artifact versus runtime handler decisions.  
**Addresses:** Docs/blog/AI reference, search, SEO endpoints, localized static generation, static export compatibility.  
**Avoids:** Mixing build-generated artifacts with request-time dynamic work.

### Phase 5: Function-Level Hotspots and Native Rendering

**Rationale:** Expensive work can hide under helpers and scripts rather than route entry files. Native image generation and synchronous I/O need separate treatment.  
**Delivers:** Hotspot inventory for `execSync`, sync fs, nested loops, markdown/MDX processors, `canvas`, `sharp`, OG routes, thumbnails, sitemap comparison generation, and `llms.txt` processing.  
**Addresses:** Route-handler CPU, filesystem I/O, native dependency variance, build/request CPU paths.  
**Avoids:** Missing root-cause functions behind broad route findings.

### Phase 6: Shared Shell, Bundle, Assets, and Interaction Performance

**Rationale:** Every localized page pays the shared shell cost, and visual-heavy pages need incremental measurement above that baseline.  
**Delivers:** Bundle analyzer notes, `'use client'` route ownership, shared provider/modal/header cost, asset inventory, image/font/SVG risks, animation/media runtime triggers, route-level frontend findings.  
**Addresses:** Hydration boundaries, global providers, analytics, docs search UI, auth/deploy modals, App Store filters, video, Mermaid, Matter.js, canvas effects, media-heavy pages.  
**Avoids:** Dependency-name findings without payload or runtime evidence.

### Phase 7: Deployment Parity, Validation Gaps, and Prioritized Findings

**Rationale:** Hosting differences decide whether each fix should target static artifacts, route handlers, build scripts, CDN headers, Docker/native dependencies, or workflow commands.  
**Delivers:** Vercel/Cloudflare/Docker/GitHub Actions parity notes, cache/redirect/header findings, validation coverage matrix, candidate/confirmed/dismissed/deferred counts, prioritized remediation order.  
**Addresses:** CI/CD artifact parity, analyzer reliability, dependency version baseline, missing tests, final report consistency.  
**Avoids:** Shipping a large undeduped audit without clear fix order.

### Phase Ordering Rationale

- Start with the ledger because the final report is the durable working memory and must preserve duplicate keys, evidence quality, and dismissal paths.
- Establish App Store data truth before App Store UI findings because static and runtime shapes can change which modules own cost.
- Classify static export and Fumadocs traversal before endpoint severity because execution timing depends on build, request, or platform behavior.
- Audit function hotspots before final remediation priority because root causes often sit in helpers.
- Measure shared shell before route pages because route-level JS should be incremental above shared providers, header, search, auth, deploy, and analytics.
- End with deployment parity because hosting target behavior validates which remediation directions are viable.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 2:** Requires command timing, generated-file diff review, network behavior, and failure-mode inspection.
- **Phase 4:** Requires careful static export and hosting behavior classification for route handlers.
- **Phase 5:** Requires native dependency and CPU/memory spot checks for OG and thumbnail generation.
- **Phase 6:** Requires analyzer output and browser/performance evidence for bundle and interaction claims.
- **Phase 7:** Requires workflow, Docker, Vercel, Cloudflare, headers, redirects, and cache-behavior comparison.

Phases with standard patterns:
- **Phase 1:** Standard audit ledger setup and source inventory.
- **Phase 3:** Mostly repository-specific tracing, with standard data pipeline audit patterns.

## Evidence and Reporting Contract for `docs/performance-audit.md`

Every finding must include:
- **Status:** `candidate`, `confirmed`, `dismissed`, or `fixed`.
- **Severity:** `critical`, `high`, `medium`, or `low`.
- **Phase:** roadmap phase name.
- **Files:** exact file paths and line references when available.
- **Entry point:** route, component, API route, script, build step, workflow, asset, or dependency.
- **Module boundary:** locale shell, App Store data, docs/content, generated endpoint, build script, visual route, shared UI, asset surface, or deployment.
- **Work type:** build time, request CPU, network, filesystem I/O, native dependency, bundle, hydration, interaction, asset, or deployment variance.
- **Execution time:** build, CI, static generation, request, page entry, interaction, or deployment.
- **Evidence:** command output, source trace, analyzer artifact, route timing, payload size, asset inventory, network waterfall, or browser trace.
- **Root cause:** why this can become slow.
- **User/developer impact:** page load, interaction latency, endpoint latency, search/docs quality, build time, CI time, or deployment variance.
- **Remediation direction:** concrete fix class and owner module.
- **Validation coverage:** tested, source-text only, typecheck only, manual only, or unvalidated.
- **Duplicate key:** stable grouping key such as `app-store-data-pipeline`, `remote-template-build-step`, `static-export-route-classification`, `og-canvas-sharp`, or `shared-layout-client-cost`.
- **Dismissal rationale:** required when status is `dismissed`.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Grounded in repository scripts, Next config, package versions, source paths, and codebase planning docs. |
| Features | HIGH | Audit categories and module coverage align with `.planning/PROJECT.md` active requirements and source inventory. |
| Architecture | HIGH | Data flows, component boundaries, and phase dependencies are consistent across architecture and stack research. |
| Pitfalls | HIGH | Warning signs are repository-specific and tied to concrete files, commands, and known code paths. |
| Runtime severity | MEDIUM | Severity needs analyzer output, timings, payload sizes, route classification, and browser traces before confirmation. |
| Deployment behavior | MEDIUM | Repo configs are visible, but host-specific behavior must be verified per Vercel, Cloudflare Pages, Docker/Nginx, and workflow target. |

**Overall confidence:** HIGH for roadmap structure; MEDIUM for final severity rankings before audit execution.

### Gaps to Address

- Analyzer output: run `npm run build:analyze` and record chunk ownership before making bundle-size claims.
- Build timing: measure `generate-apps`, `next build`, analyzer build, Docker build, and post-export normalization separately.
- Route export behavior: verify how each route-like endpoint behaves under static export and each deployment target.
- Payload sizes: measure `config/apps.json`, `config/template-sources.json`, `/api/search`, `/api/apps`, `llms.txt`, RSS, sitemap, JS, CSS, image, font, and SVG assets.
- Browser evidence: collect local traces for shared layout, docs, home, App Store index/detail, video, Mermaid, auth/deploy modal, and visual-heavy routes.
- Validation gaps: distinguish source-text assertions from runtime coverage and record missing API/browser checks.

## Sources

### Primary (HIGH confidence)
- `.planning/PROJECT.md` — audit scope, constraints, active requirements, out-of-scope boundaries, and initial performance zones.
- `.planning/research/STACK.md` — stack-specific audit dimensions, commands, evidence paths, and confidence.
- `.planning/research/FEATURES.md` — table-stakes audit categories, deeper audit categories, module coverage, and report requirements.
- `.planning/research/ARCHITECTURE.md` — component boundaries, data flows, audit order, and phase deliverables.
- `.planning/research/PITFALLS.md` — evidence contract, duplicate-key guidance, phase warnings, and roadmap guardrails.

### Secondary (MEDIUM confidence)
- `.planning/codebase/STACK.md`, `.planning/codebase/ARCHITECTURE.md`, `.planning/codebase/STRUCTURE.md`, `.planning/codebase/CONCERNS.md`, `.planning/codebase/TESTING.md`, `.planning/codebase/INTEGRATIONS.md` — repository maps cited by research files.
- `package.json`, `next.config.mjs`, `.github/workflows/**`, `Dockerfile`, `vercel.json`, `public/_headers`, `public/_redirects` — build, deployment, static export, and dependency evidence cited by research files.

---
*Research completed: 2026-06-11*
*Ready for roadmap: yes*
