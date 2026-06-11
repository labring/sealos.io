# Roadmap: Sealos.io Performance Audit

## Overview

This roadmap delivers a complete, evidence-backed performance audit of the existing Sealos.io codebase. The durable artifact is `docs/performance-audit.md`, which accumulates module inventory, route classification, findings, evidence, validation coverage, duplicate keys, and remediation directions for later fix work. Direct remediation implementation is v2 scope; v1 records the prioritized path with file-level evidence.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Audit Ledger and Module Inventory** - Create the audit report contract and complete repository module map before detailed inspection.
- [ ] **Phase 2: Build-Time App Catalog Pipeline** - Audit remote App Store generation, build coupling, generated data churn, and timing categories.
- [ ] **Phase 3: App Store Runtime and Static Data Path** - Audit the user-facing App Store subsystem across static JSON, runtime API, pages, README, media, and deploy flow.
- [ ] **Phase 4: Route Classification and Content/Generated Endpoints** - Classify route execution timing and audit Fumadocs, search, RSS, sitemap, robots, metadata, and `llms.txt` surfaces.
- [ ] **Phase 5: Function-Level Hotspots and Native Rendering** - Trace expensive helpers, synchronous work, native rendering paths, and network fan-out to owning modules.
- [ ] **Phase 6: Shared Shell, Bundle, Assets, and Interaction Performance** - Establish shared client cost and audit bundle, asset, hydration, media, animation, and interaction findings.
- [ ] **Phase 7: Deployment Parity, Validation Gaps, and Prioritized Findings** - Compare deployment targets, validate evidence coverage, dedupe findings, and publish final remediation order.

## Phase Details

### Phase 1: Audit Ledger and Module Inventory
**Goal**: The audit has a durable ledger and complete module inventory that future phases can extend without repeating discovery.
**Depends on**: Nothing (first phase)
**Rationale**: Shared surfaces, duplicate keys, and evidence schema must exist before page-by-page and subsystem inspection so recurring mechanisms are grouped once.
**Deliverables**:
  1. `docs/performance-audit.md` skeleton with module checklist and finding schema.
  2. Module taxonomy covering routes, components, data pipelines, API routes, scripts, integrations, assets, workflows, and deployment surfaces.
  3. Duplicate-key policy for shared mechanisms such as App Store data flow, static export route classification, OG rendering, and shared layout bundle cost.
  4. Initial inventory tables for module boundary, entry point, work type, execution time, and validation coverage.
**Requirements**: LEDGER-01, LEDGER-02, LEDGER-03, LEDGER-04
**Success Criteria** (what must be TRUE):
  1. Auditor can open `docs/performance-audit.md` and see the required schema before detailed module inspection begins.
  2. Auditor can trace every major repository surface to one inventory category: `app`, `components`, `new-components`, `config`, `content`, `hooks`, `lib`, `scripts`, `public`, `assets`, `fonts`, workflows, or deployment config.
  3. Auditor can assign a stable duplicate key to a shared performance mechanism and reuse it across later findings.
  4. Future fix planning can distinguish status, severity, phase, files, entry point, work type, execution time, root cause, impact, remediation direction, validation coverage, and dismissal rationale.
**Likely Files**: `docs/performance-audit.md`, `.planning/REQUIREMENTS.md`, `.planning/codebase/STRUCTURE.md`, `.planning/codebase/ARCHITECTURE.md`, `.planning/codebase/CONCERNS.md`, `app/**`, `components/**`, `new-components/**`, `config/**`, `content/**`, `hooks/**`, `lib/**`, `scripts/**`, `public/**`, `assets/**`, `fonts/**`, `.github/workflows/**`, `Dockerfile`, `vercel.json`, `next.config.mjs`, `package.json`
**Validation Approach**: Compare the inventory against `rg --files` output for the expected directories, verify every finding schema field exists in the report, and confirm duplicate-key examples are documented.
**Plans**: TBD

### Phase 2: Build-Time App Catalog Pipeline
**Goal**: The audit identifies how remote template generation affects build time, generated artifacts, failure behavior, and App Store data source truth.
**Depends on**: Phase 1
**Rationale**: `npm run build` depends on remote template generation, icon downloads, generated JSON, and export post-processing, so these costs need separate evidence before Next.js build or bundle conclusions.
**Deliverables**:
  1. Timing and source evidence for `npm run generate-apps`, `next build`, analyzer build, export normalization, and Docker build categories where feasible.
  2. Request/fetch/icon count notes for template list fetches, per-template source fetches, and icon downloads.
  3. Generated-file churn notes for `config/apps.json`, `config/template-sources.json`, and `public/images/apps`.
  4. Build-coupling and failure-mode findings grouped under `remote-template-build-step`.
**Requirements**: APPPIPE-01, APPPIPE-02
**Success Criteria** (what must be TRUE):
  1. Auditor can identify which build-time costs come from remote template generation versus Next.js, analyzer, Docker, or export normalization work.
  2. Auditor can see file-level evidence for serial network work, icon downloads, template-source fetches, shell calls, timeout behavior, and generated JSON churn.
  3. Auditor can classify App Store generator findings by build time, CI time, network, filesystem I/O, generated asset, and deployment variance.
  4. Future fix planning can use the report to decide whether a remediation direction targets the generator, build command, generated snapshots, or workflow behavior.
**Likely Files**: `scripts/generate-apps-api.js`, `scripts/generate-apps-api.test.mjs`, `package.json`, `config/apps.json`, `config/template-sources.json`, `public/images/apps/**`, `scripts/normalize-root-locale.js`, `Dockerfile`, `.github/workflows/**`
**Validation Approach**: Record command timings when safe, inspect generated-file diffs, count request and icon paths from source, and mark unmeasured claims with `source-text only` or `unvalidated` coverage.
**Plans**: TBD

### Phase 3: App Store Runtime and Static Data Path
**Goal**: The audit maps the App Store user path as one data subsystem across static JSON, runtime API conversion, cache behavior, pages, README rendering, screenshots, and deploy flow.
**Depends on**: Phase 2
**Rationale**: App Store index, detail, loader, API, and deploy surfaces share the same domain model, so findings need one ownership boundary before route-specific issues are scored.
**Deliverables**:
  1. Static/runtime shape comparison between `config/apps.json`, `config/template-sources.json`, `config/apps-loader.ts`, and `lib/api/apps-api.ts`.
  2. Payload size, cache scope, fallback behavior, repeated filtering/sorting, and media-loading notes.
  3. README fetch/render audit covering candidate URL sequence, cache behavior, markdown size controls, and rendering cost.
  4. App Store findings grouped under stable keys such as `app-store-data-pipeline` and `app-detail-remote-readme`.
**Requirements**: APPPIPE-03, APPPIPE-04, APPPIPE-05
**Success Criteria** (what must be TRUE):
  1. Auditor can trace an app template from generated JSON through loader, API fallback, index page, detail page, README window, screenshot rendering, and deploy modal.
  2. Auditor can compare static and runtime app shapes and identify duplicated normalization or fallback behavior in the report.
  3. Auditor can see App Store payload, cache, filter/sort, README, screenshot, and media findings as one subsystem.
  4. Future fix planning can use a single App Store data-pipeline section to avoid duplicate remediation entries.
**Likely Files**: `config/apps.json`, `config/template-sources.json`, `config/apps-loader.ts`, `config/apps.ts`, `lib/api/apps-api.ts`, `app/api/apps/[[...lang]]/route.ts`, `app/[lang]/products/app-store/page.tsx`, `app/[lang]/products/app-store/[slug]/**`, `app/[lang]/products/app-store/components/**`, `components/app-store/**`, `hooks/use-template-source.ts`, `new-components/DeployModal/**`
**Validation Approach**: Inspect static and runtime transformation paths, measure or estimate JSON payload sizes, run existing App Store data tests where useful, and record validation coverage per finding.
**Plans**: TBD
**UI hint**: yes

### Phase 4: Route Classification and Content/Generated Endpoints
**Goal**: The audit classifies route-like entries by execution timing and records content, search, metadata, RSS, sitemap, robots, and `llms.txt` performance risks with static export context.
**Depends on**: Phase 3
**Rationale**: Static export and route handlers create deployment-sensitive behavior, while Fumadocs loaders feed docs pages, search payloads, metadata, RSS, sitemap, and machine-readable outputs.
**Deliverables**:
  1. Route classification table for static page, generated static artifact, runtime route handler, external-service-backed endpoint, and deployment-specific path.
  2. Fumadocs traversal map for docs, blog, AI quick reference, page tree, metadata, localized content, Mermaid, image zoom, and client widgets.
  3. Search, RSS, sitemap, robots, metadata, structured data, and `llms.txt` cost notes with payload and cache behavior where feasible.
  4. Findings grouped under keys such as `static-export-route-classification` and `fumadocs-search-index`.
**Requirements**: ROUTE-01, ROUTE-02, CONTENT-01, CONTENT-02, CONTENT-03, CONTENT-04
**Success Criteria** (what must be TRUE):
  1. Auditor can classify every route-like entry by where its work happens: build, static generation, request, page entry, interaction, or deployment.
  2. Auditor can see which localized route entries use static params, metadata generation, broad imports, repeated loader calls, or async work.
  3. Auditor can trace Fumadocs loaders into docs/blog rendering, search, RSS, sitemap, metadata, and `llms.txt`.
  4. Auditor can distinguish current search payload behavior from future full-body search growth and record the tradeoff in the report.
  5. Future fix planning can assign generated endpoint remediations to static artifact, cached route handler, content pipeline, or deployment bucket.
**Likely Files**: `app/[lang]/**/page.tsx`, `app/[lang]/**/layout.tsx`, `app/api/search/route.ts`, `app/api/robots/route.ts`, `app/rss.xml/route.ts`, `app/sitemap-index.xml/route.ts`, `app/sitemap.ts`, `app/sitemap-ai-faq.ts`, `app/llms.txt/route.ts`, `source.config.ts`, `lib/source.ts`, `content/docs/**`, `content/blog/**`, `content/ai-quick-reference/**`, `components/mdx/**`, `components/docs/**`, `lib/utils/metadata.ts`, `lib/utils/structured-data.ts`, `lib/remark/**`, `next.config.mjs`, `vercel.json`, `public/_redirects`
**Validation Approach**: Build a route table from file inventory, inspect loader call graphs, measure payload sizes when feasible, and tag every endpoint finding with runtime class and validation coverage.
**Plans**: TBD
**UI hint**: yes

### Phase 5: Function-Level Hotspots and Native Rendering
**Goal**: The audit identifies root-cause functions that can dominate build, request, or interaction cost, including synchronous I/O, shell calls, CPU-heavy loops, markdown processing, network fan-out, and native rendering.
**Depends on**: Phase 4
**Rationale**: Expensive work can hide below route files and page entries, so helper-level tracing is required before severity and remediation order are finalized.
**Deliverables**:
  1. Hotspot inventory for synchronous filesystem, shell execution, CPU-heavy loops, nested transformations, markdown/MDX processors, and unbounded data processing.
  2. Native rendering audit for `/api/og`, blog thumbnails, `lib/og-canvas.ts`, `canvas`, `sharp`, `satori`, local fonts, and cache keys.
  3. Network fan-out and concurrency opportunity notes for API routes, hooks, build scripts, README/template-source loading, Turnstile verification, and analytics-adjacent flows.
  4. Findings with owning module, trigger path, execution time category, root cause, and recommended fix class.
**Requirements**: HOTSPOT-01, HOTSPOT-02, HOTSPOT-03, HOTSPOT-04
**Success Criteria** (what must be TRUE):
  1. Auditor can trace each hotspot from helper function to the route, script, component, or hook that triggers it.
  2. Auditor can distinguish CPU, filesystem I/O, network, native dependency, bundle, hydration, and interaction work types.
  3. Auditor can see OG and thumbnail findings with import boundaries, cache behavior, native dependency risk, and deployment variance.
  4. Future fix planning can prioritize root-cause helper changes over broad route-level symptoms.
**Likely Files**: `app/api/og/route.ts`, `lib/og-canvas.ts`, `app/api/blog/[lang]/[slug]/thumbnail/[format]/**`, `app/llms.txt/route.ts`, `app/sitemap.ts`, `lib/utils/blog-utils.ts`, `scripts/generate-apps-api.js`, `lib/api/apps-api.ts`, `hooks/**`, `app/api/abuse/verify-turnstile/route.ts`, `fonts/**`, `package.json`, `Dockerfile`
**Validation Approach**: Use targeted source scans for `execSync`, synchronous filesystem calls, native renderers, loops, `Promise.all`, markdown processors, and fetches; run narrow timing or import checks where safe; record unmeasured severity as candidate.
**Plans**: TBD

### Phase 6: Shared Shell, Bundle, Assets, and Interaction Performance
**Goal**: The audit establishes the shared first-load baseline and records route-level frontend, bundle, asset, media, animation, hydration, and interaction findings as incremental cost above that baseline.
**Depends on**: Phase 5
**Rationale**: Every localized page pays the shared shell cost, and visual-heavy routes need analyzer or source-level runtime evidence before dependency or client-component claims become findings.
**Deliverables**:
  1. Shared shell inventory covering layout, providers, analytics, docs search, auth modal, deploy modal, header, footer, and global client boundaries.
  2. Bundle analyzer or source-grounded dependency map for `motion`, `three`, `matter-js`, `react-player`, `mermaid`, Radix UI, Lucide, Fumadocs UI, auth/deploy modals, and docs widgets.
  3. Asset inventory for `public`, `assets`, and `fonts`, including app icons, screenshots, SVGs, videos, local fonts, remote images, and imported hero assets.
  4. Interaction findings for App Store filtering, category pagination, README rendering, docs search, Mermaid rendering, auth flow, deploy flow, Turnstile, video/media, and header menus.
  5. Page-level findings recorded as incremental cost above shared shell baseline.
**Requirements**: FRONTEND-01, FRONTEND-02, FRONTEND-03, FRONTEND-04, FRONTEND-05, ASSET-01, ASSET-02
**Success Criteria** (what must be TRUE):
  1. Auditor can see which costs belong to the shared localized shell and which costs belong to route-specific pages or interactions.
  2. Auditor can connect bundle-heavy dependency findings to route ownership, import traces, analyzer evidence, runtime triggers, or asset evidence.
  3. Auditor can inspect asset and image findings with dimensions, source type, cache behavior, local versus remote delivery, SVG policy, and static export implications.
  4. Auditor can reproduce or source-trace interaction risks for search, modals, filters, Mermaid, video/media, animation loops, and header menus.
  5. Future fix planning can target shared shell, route-local bundle, asset pipeline, or interaction code with clear ownership.
**Likely Files**: `app/[lang]/layout.tsx`, `app/layout.config.tsx`, `components/docs/Search.tsx`, `components/analytics/**`, `components/header/**`, `components/footer/**`, `components/mdx/mermaid.tsx`, `components/video.tsx`, `components/ui/**`, `new-components/Header.tsx`, `new-components/Footer/**`, `new-components/AuthForm/**`, `new-components/DeployModal/**`, `app/[lang]/(home)/(new-home)/**`, `app/[lang]/products/**`, `app/[lang]/solutions/**`, `app/[lang]/customers/**`, `hooks/**`, `public/**`, `assets/**`, `fonts/**`, `next.config.mjs`, `package.json`
**Validation Approach**: Run `npm run build:analyze` when feasible, inspect route chunks and import traces, inventory assets with size commands, and pair runtime-loop claims with source evidence such as requestAnimationFrame, timers, listeners, media loading, or browser trace notes.
**Plans**: TBD
**UI hint**: yes

### Phase 7: Deployment Parity, Validation Gaps, and Prioritized Findings
**Goal**: The audit report is complete, deduplicated, validation-tagged, and ordered by remediation priority across deployment targets and evidence quality.
**Depends on**: Phase 6
**Rationale**: Hosting and build-command differences determine whether remediation directions should target static artifacts, route handlers, CDN headers, Docker/native dependencies, workflows, or dependency alignment.
**Deliverables**:
  1. Deployment parity review for Vercel, Cloudflare Pages, Docker/Nginx, GHCR, Kubernetes image updates, redirects, headers, cache behavior, route support, and build commands.
  2. Dependency baseline for Next.js, `@next/*`, analyzer reliability, MDX integration, native packages, and install/build determinism.
  3. Validation coverage matrix for tested, source-text only, typecheck only, manual only, and unvalidated findings.
  4. Final candidate, confirmed, dismissed, and deferred counts.
  5. Prioritized remediation order with fix class, owner module, evidence, expected impact, and recommended validation path.
**Requirements**: DEPS-01, DEPS-02, DEPLOY-01, DEPLOY-02, VERIFY-01, VERIFY-02, VERIFY-03
**Success Criteria** (what must be TRUE):
  1. Auditor can compare Vercel, Cloudflare Pages, Docker/Nginx, GHCR, and Kubernetes update paths for artifact output, route support, caching, redirects, headers, and command differences.
  2. Auditor can trust analyzer and dependency findings because exact package versions and native dependency constraints are recorded.
  3. Auditor can see validation coverage for every module and finding, including tested, source-text only, typecheck only, manual only, or unvalidated status.
  4. Future fix planning can start from a prioritized remediation list with candidate, confirmed, dismissed, and deferred counts.
  5. The final `docs/performance-audit.md` report contains complete traceability from requirement to phase, evidence, root cause, impact, and remediation direction.
**Likely Files**: `.github/workflows/**`, `Dockerfile`, `vercel.json`, `public/_headers`, `public/_redirects`, `next.config.mjs`, `package.json`, `package-lock.json`, `docs/performance-audit.md`, `config/*.test.mts`, `scripts/*.test.mjs`, `app/**`, `components/**`, `new-components/**`, `lib/**`
**Validation Approach**: Run available safe checks where useful, including `npm run lint`, Node tests, data quality tests, generator tests, `npm run build:analyze`, payload size commands, and targeted source scans; update the report with validation gaps and final counts.
**Plans**: TBD

## Requirement Coverage

| Requirement | Phase |
|-------------|-------|
| LEDGER-01 | Phase 1 |
| LEDGER-02 | Phase 1 |
| LEDGER-03 | Phase 1 |
| LEDGER-04 | Phase 1 |
| APPPIPE-01 | Phase 2 |
| APPPIPE-02 | Phase 2 |
| APPPIPE-03 | Phase 3 |
| APPPIPE-04 | Phase 3 |
| APPPIPE-05 | Phase 3 |
| ROUTE-01 | Phase 4 |
| ROUTE-02 | Phase 4 |
| CONTENT-01 | Phase 4 |
| CONTENT-02 | Phase 4 |
| CONTENT-03 | Phase 4 |
| CONTENT-04 | Phase 4 |
| HOTSPOT-01 | Phase 5 |
| HOTSPOT-02 | Phase 5 |
| HOTSPOT-03 | Phase 5 |
| HOTSPOT-04 | Phase 5 |
| FRONTEND-01 | Phase 6 |
| FRONTEND-02 | Phase 6 |
| FRONTEND-03 | Phase 6 |
| FRONTEND-04 | Phase 6 |
| FRONTEND-05 | Phase 6 |
| ASSET-01 | Phase 6 |
| ASSET-02 | Phase 6 |
| DEPS-01 | Phase 7 |
| DEPS-02 | Phase 7 |
| DEPLOY-01 | Phase 7 |
| DEPLOY-02 | Phase 7 |
| VERIFY-01 | Phase 7 |
| VERIFY-02 | Phase 7 |
| VERIFY-03 | Phase 7 |

**Coverage**: 33/33 v1 requirements mapped.

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Audit Ledger and Module Inventory | 0/TBD | Not started | - |
| 2. Build-Time App Catalog Pipeline | 0/TBD | Not started | - |
| 3. App Store Runtime and Static Data Path | 0/TBD | Not started | - |
| 4. Route Classification and Content/Generated Endpoints | 0/TBD | Not started | - |
| 5. Function-Level Hotspots and Native Rendering | 0/TBD | Not started | - |
| 6. Shared Shell, Bundle, Assets, and Interaction Performance | 0/TBD | Not started | - |
| 7. Deployment Parity, Validation Gaps, and Prioritized Findings | 0/TBD | Not started | - |

