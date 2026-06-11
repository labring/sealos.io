# Sealos.io Performance Audit

## What This Is

This project is a full-codebase performance audit for the existing Sealos.io
site. It covers frontend, backend-style API routes, build-time scripts, content
pipelines, runtime integrations, and any functions or modules that can create
slow page loads, excessive network requests, slow data processing, blocking
synchronous work, or unnecessary bundle/runtime cost.

The immediate deliverable is a durable module-by-module performance findings
report under `docs/`, so repeated checks can continue from recorded evidence
instead of restarting from scratch.

## Core Value

Find every credible performance risk in the current codebase with file-level
evidence and a clear remediation path.

## Requirements

### Validated

- ✓ Static-first localized Next.js App Router site exists — implemented through
  `app/[lang]`, `next.config.mjs`, and static export build behavior.
- ✓ Documentation, blog, and AI quick reference content are loaded through
  Fumadocs — implemented in `source.config.ts` and `lib/source.ts`.
- ✓ App Store pages and deploy flows exist — implemented through
  `config/apps-loader.ts`, `lib/api/apps-api.ts`,
  `app/[lang]/products/app-store`, and `new-components/DeployModal`.
- ✓ Generated SEO surfaces exist — implemented through routes such as
  `app/api/search/route.ts`, `app/api/og/route.ts`, `app/rss.xml/route.ts`,
  `app/sitemap-index.xml/route.ts`, and `app/llms.txt/route.ts`.
- ✓ Build-time app data generation exists — implemented through
  `scripts/generate-apps-api.js`, `config/apps.json`, and
  `config/template-sources.json`.
- ✓ Baseline codebase map exists — recorded in `.planning/codebase/`.

### Active

- [ ] Inventory every functional module and group each module by route,
  component, data pipeline, API route, script, integration, and deployment
  surface.
- [ ] Audit page entry performance, including initial render cost, route-level
  data loading, client component boundaries, bundle-heavy dependencies,
  metadata generation, search, and static export constraints.
- [ ] Audit network and data-fetch behavior, including fan-out patterns,
  sequential requests, cache usage, remote API fallbacks, duplicated fetches,
  and places where concurrent work is possible.
- [ ] Audit server and route-handler performance, including OG generation,
  search generation, app API conversion, abuse verification, RSS, sitemap,
  robots, and LLM text generation.
- [ ] Audit build-time performance, including remote template generation,
  image downloads, MDX/Fumadocs generation, bundle analyzer output, Docker
  build behavior, CI workflow commands, and static export post-processing.
- [ ] Audit function-level performance hotspots, including synchronous shell
  calls, CPU-heavy loops, large JSON transformations, unbounded markdown/MDX
  processing, repeated sorting/filtering, and expensive rendering helpers.
- [ ] Audit asset and bundle performance, including `motion`, `three`,
  `matter-js`, `react-player`, `canvas`, `sharp`, remote images, SVG handling,
  local fonts, and large static datasets.
- [ ] Audit frontend interaction performance, including header, auth modal,
  deploy modal, app-store filters, docs search, Mermaid rendering, video/media
  components, and visual-heavy marketing sections.
- [ ] Produce `docs/performance-audit.md` as the working audit record with
  module checklist, findings, severity, evidence paths, root cause, likely user
  impact, and recommended fix order.
- [ ] Produce a roadmap where phases proceed module by module and leave enough
  traceability for later fix work.

### Out of Scope

- Direct performance fixes — this project first creates the complete audit
  inventory and prioritized findings.
- Production load testing against live Sealos services — source-level audit and
  local build/runtime inspection come first.
- SEO copy rewrites or visual redesign — performance risks in SEO and UI code
  are in scope, content strategy changes are deferred.
- New product functionality — the audit targets the current codebase.
- Database query tuning against an unavailable production database — static
  source inspection covers SQL-like or API-query patterns when present.

## Context

This is a brownfield Next.js 14.2.28, React 18.3.1, TypeScript 5.8.3,
Fumadocs-powered Sealos marketing and documentation site. The app is structured
around localized routes in `app/[lang]`, static MDX content under `content/`,
structured data and product configuration under `config/`, and shared utilities
under `lib/`.

The codebase map highlights several likely performance zones before deeper
audit work begins:

- `scripts/generate-apps-api.js` performs serial network-heavy template
  generation during build.
- `lib/api/apps-api.ts`, `config/apps-loader.ts`, and
  `scripts/generate-apps-api.js` duplicate app-template normalization and
  fallback behavior.
- `app/api/search/route.ts` builds search data from localized docs metadata and
  can grow into a static payload or build-memory concern.
- `app/api/og/route.ts` uses `canvas` and `sharp` to render images dynamically.
- Visual-heavy pages and components use dependencies such as `motion`, `three`,
  `matter-js`, `react-player`, `canvas`, and `sharp`.
- App Store, docs, MDX, localized routing, generated SEO endpoints, and CI/CD
  flows are fragile enough to require evidence-based audit notes before fixes.

The user explicitly asked for the audit to cover the entire project without
front-end/back-end boundaries and to record the analysis under `docs/` to avoid
duplicate inspection.

## Constraints

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

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use a dedicated GSD project for performance audit | The audit spans all modules and needs durable traceability. | — Pending |
| Use fine-grained phase slicing | The user wants module-by-module coverage and broad discovery. | — Pending |
| Keep the first pass as audit/reporting | Fixing before complete discovery can hide cross-module patterns. | — Pending |
| Store the audit record under `docs/` | The user requested a persistent report to prevent repeated inspection. | — Pending |
| Include frontend, API routes, scripts, build, integrations, and deployment | Performance risks can exist across the whole codebase. | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `$gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `$gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-06-11 after initialization*
