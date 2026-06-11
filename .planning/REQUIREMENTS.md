# Requirements: Sealos.io Performance Audit

**Defined:** 2026-06-11
**Core Value:** Find every credible performance risk in the current codebase with file-level evidence and a clear remediation path.

## v1 Requirements

### Audit Ledger

- [ ] **LEDGER-01**: Create `docs/performance-audit.md` before module inspection begins.
- [ ] **LEDGER-02**: Record a complete module inventory covering `app`, `components`, `new-components`, `config`, `content`, `hooks`, `lib`, `scripts`, `public`, `assets`, `fonts`, workflows, and deployment config.
- [ ] **LEDGER-03**: Define a finding schema with status, severity, phase, files, entry point, module boundary, work type, execution time, evidence, root cause, impact, remediation direction, validation coverage, duplicate key, and dismissal rationale.
- [ ] **LEDGER-04**: Use stable duplicate keys so shared issues such as App Store data flow, static export route classification, OG rendering, and shared layout bundle cost are grouped once.

### App Store Pipeline

- [ ] **APPPIPE-01**: Audit `scripts/generate-apps-api.js` for serial network work, icon downloads, template-source fetches, shell calls, timeout behavior, generated JSON churn, and build coupling.
- [ ] **APPPIPE-02**: Measure or statically estimate separate cost categories for `npm run generate-apps`, `next build`, export normalization, analyzer build, and Docker build.
- [ ] **APPPIPE-03**: Compare generated static data in `config/apps.json` and `config/template-sources.json` against runtime conversion in `lib/api/apps-api.ts`.
- [ ] **APPPIPE-04**: Audit `config/apps-loader.ts`, App Store routes, filters, detail pages, README rendering, screenshots, deploy modal, and template-source loading as one data subsystem.
- [ ] **APPPIPE-05**: Record App Store payload size, cache scope, fallback behavior, repeated filtering/sorting, and media-loading findings in the audit report.

### Routes and Content

- [ ] **ROUTE-01**: Classify every route-like entry as static page, generated static artifact, runtime route handler, external-service-backed endpoint, or deployment-specific path.
- [ ] **ROUTE-02**: Audit localized route entry points under `app/[lang]` for static params, metadata generation, broad imports, repeated loader calls, and async work.
- [ ] **CONTENT-01**: Audit Fumadocs loaders in `source.config.ts` and `lib/source.ts` for docs, blog, AI quick reference, page tree, metadata, and localized content traversal cost.
- [ ] **CONTENT-02**: Audit docs/blog rendering paths for Mermaid, image zoom, MDX components, GitHub edit links, static params, and client widgets.
- [ ] **CONTENT-03**: Audit generated SEO and machine-readable endpoints including `/api/search`, `/rss.xml`, `/sitemap-index.xml`, `app/sitemap.ts`, `app/sitemap-ai-faq.ts`, `/llms.txt`, `/api/robots`, metadata, and structured data.
- [ ] **CONTENT-04**: Record search payload, search relevance tradeoff, route handler CPU, static artifact opportunity, cache behavior, and content scan findings.

### Function Hotspots

- [ ] **HOTSPOT-01**: Search for synchronous filesystem, shell execution, CPU-heavy loops, markdown/MDX processors, nested transformations, native rendering, and unbounded data processing across the repo.
- [ ] **HOTSPOT-02**: Audit `/api/og`, blog thumbnail generation, `lib/og-canvas.ts`, `canvas`, `sharp`, `satori`, local fonts, and cache keys for CPU, memory, and deployment variance.
- [ ] **HOTSPOT-03**: Audit network fan-out and async/concurrency opportunities in API routes, hooks, build scripts, README/template-source loading, Turnstile verification, and analytics-adjacent flows.
- [ ] **HOTSPOT-04**: Record each hotspot with the owning module, trigger path, execution time category, root cause, and recommended fix class.

### Frontend Runtime

- [ ] **FRONTEND-01**: Audit shared layout, providers, analytics, docs search, auth modal, deploy modal, header, footer, and global client boundaries for first-load and hydration cost.
- [ ] **FRONTEND-02**: Run or prepare bundle analyzer evidence for route and dependency cost, including `motion`, `three`, `matter-js`, `react-player`, `mermaid`, Radix UI, Lucide, Fumadocs UI, auth/deploy modals, and docs widgets.
- [ ] **FRONTEND-03**: Audit visual-heavy home, product, solution, customer, and docs pages for animation scheduling, media loading, image dimensions, SVG/font usage, layout stability, and dynamic import opportunities.
- [ ] **FRONTEND-04**: Audit interaction paths including App Store filtering, category pagination, README rendering, docs search, Mermaid rendering, auth flow, deploy flow, Turnstile, video/media, and header menus.
- [ ] **FRONTEND-05**: Record page-level findings as incremental cost above the shared shell baseline.

### Assets and Dependencies

- [ ] **ASSET-01**: Inventory large or risky assets under `public`, `assets`, and `fonts`, including app icons, screenshots, SVGs, videos, local fonts, and imported hero assets.
- [ ] **ASSET-02**: Audit `next.config.mjs` image settings, remote patterns, unoptimized static export behavior, SVG policy, cache headers, and local versus remote image choices.
- [ ] **DEPS-01**: Audit dependency version alignment, especially `next` 14.x with `@next/*` 15.x packages, analyzer reliability, MDX integration, native packages, and install/build determinism.
- [ ] **DEPS-02**: Record dependency-heavy findings only with route ownership, bundle evidence, import trace, runtime trigger, or build/deployment evidence.

### Deployment and Validation

- [ ] **DEPLOY-01**: Audit `.github/workflows`, `Dockerfile`, `vercel.json`, `public/_headers`, `public/_redirects`, `next.config.mjs`, and `package.json` for build command parity, static export behavior, redirects, headers, caching, and native dependency variance.
- [ ] **DEPLOY-02**: Compare Vercel, Cloudflare Pages, Docker/Nginx, GHCR, and Kubernetes update paths for artifact output, route support, caching, and command differences.
- [ ] **VERIFY-01**: Record current validation coverage for each module: tested, source-text only, typecheck only, manual only, or unvalidated.
- [ ] **VERIFY-02**: Run available safe checks where useful, including `npm run lint`, Node tests, data quality tests, generator tests, `npm run build:analyze`, payload size commands, and targeted source scans.
- [ ] **VERIFY-03**: Produce final prioritized remediation order with candidate, confirmed, dismissed, and deferred counts.

## v2 Requirements

### Fix Execution

- **FIX-01**: Implement high-priority performance fixes discovered by the audit.
- **FIX-02**: Add regression tests, build checks, or monitoring artifacts for fixed performance paths.
- **FIX-03**: Refactor shared App Store normalization if confirmed as a high-value remediation.
- **FIX-04**: Split or lazy-load heavy global client surfaces if confirmed by analyzer/browser evidence.

### Measurement Expansion

- **MEASURE-01**: Run production-like browser traces against deployed preview URLs.
- **MEASURE-02**: Add CI timing dashboards for generation, build, analyzer, Docker, and route artifact steps.
- **MEASURE-03**: Add payload budget checks for JS, CSS, fonts, images, search payload, app JSON, sitemap, and `llms.txt`.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Direct fixes during v1 discovery | The first deliverable is complete audit coverage and prioritized evidence. |
| Production load testing against live Sealos services | Requires separate operational approval and traffic controls. |
| SEO copy rewriting | Content quality work is separate from performance-risk discovery. |
| Visual redesign | UI code is audited only where it affects performance. |
| Database query tuning | The current repo is a static/docs/marketing site with external APIs and generated data, so database query tuning needs a separate target system. |
| Framework migration | The audit evaluates the existing Next.js/Fumadocs/static-export architecture. |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| LEDGER-01 | Phase 1 | Pending |
| LEDGER-02 | Phase 1 | Pending |
| LEDGER-03 | Phase 1 | Pending |
| LEDGER-04 | Phase 1 | Pending |
| APPPIPE-01 | Phase 2 | Pending |
| APPPIPE-02 | Phase 2 | Pending |
| APPPIPE-03 | Phase 3 | Pending |
| APPPIPE-04 | Phase 3 | Pending |
| APPPIPE-05 | Phase 3 | Pending |
| ROUTE-01 | Phase 4 | Pending |
| ROUTE-02 | Phase 4 | Pending |
| CONTENT-01 | Phase 4 | Pending |
| CONTENT-02 | Phase 4 | Pending |
| CONTENT-03 | Phase 4 | Pending |
| CONTENT-04 | Phase 4 | Pending |
| HOTSPOT-01 | Phase 5 | Pending |
| HOTSPOT-02 | Phase 5 | Pending |
| HOTSPOT-03 | Phase 5 | Pending |
| HOTSPOT-04 | Phase 5 | Pending |
| FRONTEND-01 | Phase 6 | Pending |
| FRONTEND-02 | Phase 6 | Pending |
| FRONTEND-03 | Phase 6 | Pending |
| FRONTEND-04 | Phase 6 | Pending |
| FRONTEND-05 | Phase 6 | Pending |
| ASSET-01 | Phase 6 | Pending |
| ASSET-02 | Phase 6 | Pending |
| DEPS-01 | Phase 7 | Pending |
| DEPS-02 | Phase 7 | Pending |
| DEPLOY-01 | Phase 7 | Pending |
| DEPLOY-02 | Phase 7 | Pending |
| VERIFY-01 | Phase 7 | Pending |
| VERIFY-02 | Phase 7 | Pending |
| VERIFY-03 | Phase 7 | Pending |

**Coverage:**
- v1 requirements: 33 total
- Mapped to phases: 33
- Unmapped: 0

---
*Requirements defined: 2026-06-11*
*Last updated: 2026-06-11 after initial definition*
