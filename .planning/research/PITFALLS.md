# Performance Audit Pitfalls

**Domain:** Full-codebase performance audit for Sealos.io
**Researched:** 2026-06-11
**Confidence:** HIGH for repository-specific warning signs; MEDIUM for final severity until phase evidence is collected.

## Audit Evidence Contract

Every item in `docs/performance-audit.md` should use this shape so later phases can continue without repeating inspection:

```markdown
### [Finding ID] [Area] Short finding title

- **Status:** candidate | confirmed | dismissed | fixed
- **Severity:** critical | high | medium | low
- **Phase:** [phase name]
- **Files:** `path:line`, `path:line`
- **Entry point:** route, component, API route, script, build step, or dependency
- **Evidence:** command output, code path, bundle artifact, network waterfall, timing, or static-source proof
- **Root cause:** why this can become slow
- **User/developer impact:** page load, interaction, build time, CI time, runtime endpoint, or deployment variance
- **Remediation direction:** concrete next fix path
- **Duplicate key:** stable key such as `app-store-data-pipeline` or `dynamic-og-route`
```

Use one duplicate key per underlying mechanism. Multiple affected files can point to the same key.

## Critical Pitfalls

### Pitfall 1: Re-auditing App Store Data Paths as Separate Problems

**What goes wrong:** The audit records `scripts/generate-apps-api.js`, `lib/api/apps-api.ts`, `config/apps-loader.ts`, `config/apps.json`, and app-store pages as unrelated findings.

**Warning signs in this repo:**
- `npm run build` runs `npm run generate-apps` before `next build`.
- `scripts/generate-apps-api.js` fetches templates, downloads icons with `execSync(curl ...)`, fetches template sources, sorts apps, then writes generated JSON.
- `lib/api/apps-api.ts` repeats template conversion and external API fetches for `/api/apps`.
- `config/apps-loader.ts` dynamically fetches `/api/apps` in the browser and replaces static data caches for five minutes.
- Codebase concerns already call out duplicated normalization and fallback behavior.

**Detection method:**
- Start from the user-visible App Store route and trace one data object across generator, committed JSON, runtime API, client loader, detail page, deploy modal, and tests.
- Use `rg -n "generate-apps|fetchDynamicApps|handleAppsRequest|loadAllApps|template-sources|deployUrl|readme"`.
- Record one pipeline diagram in `docs/performance-audit.md`; attach per-file evidence under the same duplicate key.

**Audit phase:** Phase 2, App Store data pipeline and network fan-out.

**Evidence record:** Use duplicate key `app-store-data-pipeline`. Record build-time timing, runtime `/api/apps` behavior, client fetch trigger, fallback path, and affected pages in one finding group with sub-findings.

**Prevention:** Roadmap should assign one phase owner to the whole App Store data pipeline before page-level audits. Page phases should link back to the pipeline finding instead of opening new findings for the same normalization or fetch behavior.

### Pitfall 2: Treating Build-Time Remote Work as Ordinary Build Cost

**What goes wrong:** The audit says builds are slow but fails to separate remote API latency, synchronous shell icon downloads, generated JSON churn, and static export work.

**Warning signs in this repo:**
- `package.json` defines `build` as `npm run generate-apps && next build && node scripts/normalize-root-locale.js`.
- `scripts/generate-apps-api.js` fetches the template list, processes templates in a serial `for...of`, calls `downloadIcon`, calls `fetchTemplateSource`, and writes `config/apps.json` plus `config/template-sources.json`.
- Icon downloads use `execSync` with a 10 second timeout per icon.
- Template source failures degrade to empty input arrays, which can hide partial build-time data loss.

**Detection method:**
- Run or inspect `npm run generate-apps` separately from `next build`.
- Add timing notes for template list fetch, icon download count, source fetch count, skipped count, and failed source count.
- Compare a normal build to `generate-apps` alone and `next build` alone when feasible.

**Audit phase:** Phase 5, build-time and CI performance.

**Evidence record:** Use duplicate key `remote-template-build-step`. Record command, duration, network dependency, serial section, sync shell call, generated file diff risk, and any failure handling.

**Prevention:** Roadmap should isolate build pipeline auditing before bundle tuning. A bundle report cannot explain remote template latency or generated-file churn.

### Pitfall 3: Missing Static Export Versus Route Handler Reality

**What goes wrong:** The audit assumes every `app/api/*` route behaves like a normal server endpoint, while production uses static export and multiple hosting targets.

**Warning signs in this repo:**
- `next.config.mjs` is mapped as static export in the codebase stack.
- Route handlers exist for `/api/apps`, `/api/search`, `/api/og`, `/api/robots`, `/rss.xml`, `/llms.txt`, and sitemap outputs.
- `app/api/search/route.ts` exports `staticGET`.
- `app/api/og/route.ts` dynamically renders canvas and Sharp output with cache headers.
- `app/llms.txt/route.ts` scans MDX files and processes content with Remark.

**Detection method:**
- Classify each route as static artifact, server/edge endpoint, or platform-dependent route.
- For each route, record whether its work happens during build/export, at request time, or through platform support.
- Inspect Cloudflare Pages, Vercel, Docker/Nginx, and redirect files as separate deployment surfaces.

**Audit phase:** Phase 3, route handlers and generated SEO surfaces.

**Evidence record:** Use duplicate key `static-export-route-classification`. Add a table with route, runtime class, work performed, cache header, static export compatibility, and hosting target implication.

**Prevention:** Roadmap should include a route classification checkpoint before route-level severity scoring. Dynamic OG and static search should land in different remediation buckets.

### Pitfall 4: Over-focusing on Page Entrypoints and Missing Function-Level Hotspots

**What goes wrong:** The audit checks route files and high-level pages, then misses expensive helpers and scripts that dominate build, request, or interaction time.

**Warning signs in this repo:**
- `lib/og-canvas.ts` imports Node canvas, registers fonts, draws complex graphics, and returns PNG buffers.
- `app/api/og/route.ts` calls `drawCanvas()` and then `sharp(...).webp().toBuffer()`.
- `lib/utils/blog-utils.ts` uses synchronous directory and stat calls.
- `app/sitemap.ts` builds pairwise comparison sitemap entries with nested loops.
- `app/llms.txt/route.ts` reads many files and runs Remark processing concurrently.

**Detection method:**
- Build a hotspot inventory from `rg -n "execSync|readFileSync|readdirSync|statSync|writeFileSync|sharp\\(|createCanvas|Promise\\.all|for \\("`.
- For each hit, classify CPU, filesystem, network, native dependency, or algorithmic growth.
- Attach each helper to the route, script, or page that calls it.

**Audit phase:** Phase 4, function-level hotspot and synchronous work audit.

**Evidence record:** Use duplicate key per helper family, such as `og-canvas-sharp`, `sync-fs-blog-utils`, or `sitemap-comparison-pair-generation`. Record caller chain and growth factor.

**Prevention:** Roadmap should require function-level tracing after route inventory and before remediation prioritization. The docs should distinguish "entry point" from "root cause function."

### Pitfall 5: Counting Client Components Without Measuring Payload or Runtime Work

**What goes wrong:** The audit lists many `'use client'` files and heavy dependencies, then lacks evidence showing which entries affect route payload, hydration, or main-thread work.

**Warning signs in this repo:**
- Client components span headers, App Store filtering, deploy/auth modals, docs search, pricing, comparison pages, customer filters, homepage sections, and visual effects.
- Heavy client-side libraries include `motion`, `framer-motion` imports in some files, `matter-js`, `react-player`, Mermaid, canvas effects, and many Radix primitives.
- `components/video.tsx` dynamically imports `react-player/lazy` and globally preconnects/prefetches YouTube domains at module evaluation.
- `app/[lang]/(home)/(new-home)/components/FallingTags.tsx` runs Matter.js physics with rAF and DOM mutation.
- `new-components/GodRays.tsx` keeps a rAF loop alive while out of view to detect re-entry.

**Detection method:**
- Run `npm run build:analyze` when feasible and map route chunks to imports.
- Pair bundle evidence with source-level runtime evidence: rAF loops, timers, scroll listeners, resize listeners, physics engines, canvas rendering, and markdown/diagram renderers.
- Record route-level ownership for shared components like `new-components/Header.tsx`.

**Audit phase:** Phase 6, asset, bundle, and frontend interaction performance.

**Evidence record:** Use duplicate keys `client-heavy-homepage`, `client-heavy-shared-header`, `video-player-lazy-load`, `matterjs-falling-tags`, and `canvas-raf-effects`. Include route chunk, dependency, trigger, and observed or inferred runtime cost.

**Prevention:** Roadmap should require bundle analyzer evidence for bundle-size claims and source evidence for runtime-loop claims. File count alone should never become a performance finding.

## Moderate Pitfalls

### Pitfall 6: Recording Search as a Simple Payload Issue

**What goes wrong:** The audit says `/api/search` is small or large without capturing the product tradeoff: metadata-only indexing is fast but incomplete, body indexing improves relevance and can grow payload/build memory.

**Warning signs in this repo:**
- `app/api/search/route.ts` indexes title, description, structuredData, URL, and language tag.
- Codebase concerns already note body text is absent.
- Fumadocs source spans localized docs and blog content.

**Detection method:**
- Count indexed pages per language and estimate serialized search payload.
- Record current indexed fields and missed body-content behavior.
- Treat "add all body text" as a scaling risk that needs sharding or precomputed artifacts.

**Audit phase:** Phase 3, generated SEO/search surfaces.

**Evidence record:** Use duplicate key `fumadocs-search-index`. Include current fields, page count, payload estimate, and relevance limitation.

**Prevention:** Roadmap should ask for a search-specific finding that includes both performance and completeness, with remediation framed as sharded/precomputed indexed excerpts.

### Pitfall 7: Losing the Difference Between Network Fan-Out and CPU Work

**What goes wrong:** The audit groups external fetches, markdown parsing, icon downloads, Turnstile verification, and canvas encoding as generic "slow API" risks.

**Warning signs in this repo:**
- External fetches exist in template API, template source API, `/api/apps`, README loading, Turnstile verification, auth endpoints, page actions, and AI FAQ JSON.
- CPU-heavy work exists in OG image generation, MDX/Remark processing, Mermaid rendering, Matter.js physics, and canvas animations.
- Some work is build-time, some request-time, and some browser interaction-time.

**Detection method:**
- For every performance candidate, tag `network`, `cpu`, `io`, `bundle`, `hydration`, or `native`.
- Add execution timing category: `build`, `request`, `page-entry`, `interaction`, or `ci`.
- Group findings by tag and timing category before severity ordering.

**Audit phase:** Cross-phase quality gate at the end of each audit phase.

**Evidence record:** Add `Work type` and `Execution time` fields to every finding in `docs/performance-audit.md`.

**Prevention:** Roadmap should include a dedupe review after each phase that merges findings sharing a root cause and splits findings that only share a symptom.

### Pitfall 8: Treating Remote README Rendering as Only a Security Concern

**What goes wrong:** README rendering gets audited for unsafe links while performance issues from sequential candidate fetches, remote markdown size, and ReactMarkdown rendering are under-recorded.

**Warning signs in this repo:**
- `ReadmeMarkdownWindow.tsx` tries README candidates sequentially until one succeeds.
- It fetches markdown with `cache: 'force-cache'`, reads full response text, normalizes GitHub markdown, then renders via `ReactMarkdown` and `remarkGfm`.
- App detail pages load README content through `loadReadmeMarkdown`.

**Detection method:**
- Trace app detail page render path through `loadReadmeMarkdown`.
- Count candidate URLs generated per README source.
- Check response-size controls, timeout handling, cache behavior, and fallback path.

**Audit phase:** Phase 2 for App Store detail pages; revisit in Phase 4 for function-level markdown costs.

**Evidence record:** Use duplicate key `app-detail-remote-readme`. Record candidate sequence, fetch cache setting, size/timeout controls, markdown processing path, and page impact.

**Prevention:** Roadmap should keep README performance under the App Store data/detail umbrella while cross-linking the markdown rendering helper audit.

### Pitfall 9: Assuming Existing Tests Prove Performance Safety

**What goes wrong:** The audit treats source-text tests and data-quality tests as coverage for runtime performance.

**Warning signs in this repo:**
- Testing map shows Node built-in tests, many source-text assertions, and no Jest/Vitest/Playwright config.
- No automated API route tests exist for `/api/apps`, `/api/search`, `/api/og`, `/api/robots`, or Turnstile verification.
- No browser E2E test verifies request waterfall, hydration behavior, or interaction latency.

**Detection method:**
- For each performance finding, record existing tests and missing validation separately.
- Use source-text tests only as contract evidence for wiring.
- Mark unmeasured runtime claims as candidate until command, analyzer, or browser evidence exists.

**Audit phase:** Phase 7, consolidation and validation gaps.

**Evidence record:** Add `Validation coverage` to each finding: `tested`, `source-text only`, `typecheck only`, `manual only`, or `unvalidated`.

**Prevention:** Roadmap should place validation-gap review after findings inventory so the audit does not become a test rewrite project.

## Minor Pitfalls

### Pitfall 10: Duplicate Findings from Shared Layout and Header Components

**What goes wrong:** Shared components such as `new-components/Header.tsx`, analytics loaders, footer, modals, and UI primitives appear under many routes and get counted repeatedly.

**Warning signs in this repo:**
- Shared client components live in `new-components/`, `components/ui/`, and top-level layouts.
- `new-components/Header.tsx` imports `motion/react` and contains many animated areas.
- Analytics components are client modules included near layout boundaries.

**Detection method:** Build a shared-component register before page-by-page audit. Mark each finding as `shared` or `route-local`.

**Audit phase:** Phase 1, inventory and audit ledger setup.

**Evidence record:** Use duplicate key `shared-layout-client-cost` and link affected routes beneath one finding.

**Prevention:** Roadmap should require a shared-surface pass before route-specific page audits.

### Pitfall 11: Ignoring Dependency Major Mismatch During Analyzer Work

**What goes wrong:** Bundle analysis noise gets attributed to app code while `next` 14.x is paired with `@next/mdx` and `@next/bundle-analyzer` 15.x.

**Warning signs in this repo:**
- `package.json` uses `next` `^14.2.28`, `@next/mdx` `^15.2.0`, and `@next/bundle-analyzer` `^15.4.1`.
- Codebase concerns flag this mismatch as dependency risk.

**Detection method:** Record exact installed versions from `package-lock.json` or `npm ls next @next/mdx @next/bundle-analyzer` before interpreting analyzer output.

**Audit phase:** Phase 6, bundle and dependency performance.

**Evidence record:** Use duplicate key `next-next-mdx-analyzer-version-mismatch`. Include installed versions and whether analyzer output completed cleanly.

**Prevention:** Roadmap should schedule dependency version baseline before analyzer-derived recommendations.

### Pitfall 12: Writing Findings Without a Dismissal Path

**What goes wrong:** Candidate risks remain open forever because the audit has no evidence status for dismissed or platform-accepted behavior.

**Warning signs in this repo:**
- Many risks are plausible from source alone: dynamic routes in static export, native canvas dependencies, rAF loops, dynamic loading, remote image/SVG handling, and generated SEO endpoints.
- The project goal is "every credible potential performance issue," which can create a large candidate set.

**Detection method:** Require `Status` and `Why dismissed` fields when a candidate has acceptable measured impact or is outside scope.

**Audit phase:** Phase 7, consolidation and prioritization.

**Evidence record:** Keep dismissed items in `docs/performance-audit.md` with evidence and rationale, then exclude them from fix ordering.

**Prevention:** Roadmap should include a final dedupe/triage phase with candidate, confirmed, dismissed, and deferred counts.

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|----------------|------------|
| Phase 1: Inventory and audit ledger | Starting page-by-page before shared surfaces and duplicate keys exist | Create module taxonomy, shared component register, route list, script list, API route list, and `docs/performance-audit.md` template first |
| Phase 2: App Store data pipeline | Duplicate findings across generator, runtime API, client loader, detail page, README, and deploy modal | Use one `app-store-data-pipeline` group with sub-findings and cross-links |
| Phase 3: Route handlers and SEO surfaces | Mixing static generated routes with request-time dynamic work | Classify each route by execution time and deployment target before severity scoring |
| Phase 4: Function hotspots | Missing helpers hidden behind route/page entrypoints | Search sync filesystem, native image/canvas, loops, markdown processors, and network helpers; attach caller chains |
| Phase 5: Build and CI | Treating remote template ingestion as Next.js build cost | Time `generate-apps`, `next build`, analyzer build, Docker build, and post-export normalization separately |
| Phase 6: Bundle/assets/interactions | Equating dependency presence with user impact | Require analyzer output, route ownership, and runtime trigger evidence for each bundle or interaction finding |
| Phase 7: Consolidation | Large candidate list with duplicated root causes | Merge by duplicate key, split by work type, mark dismissed candidates, and produce prioritized fix order |

## Recommended Roadmap Guardrails

1. Create `docs/performance-audit.md` with the evidence contract before any module audit.
2. Require every finding to declare phase, duplicate key, work type, execution time, and validation coverage.
3. Run a dedupe checkpoint after each phase, using duplicate keys as the primary merge mechanism.
4. Keep source-only concerns as `candidate` until backed by timing, bundle, route classification, or command evidence.
5. Preserve dismissed findings with rationale so future auditors do not reopen the same source-only risk.

## Sources

- `.planning/PROJECT.md` - project scope, active audit requirements, out-of-scope boundaries, and initial performance zones.
- `.planning/codebase/CONCERNS.md` - known performance bottlenecks, fragile areas, missing tests, and dependency risks.
- `.planning/codebase/STACK.md` - Next.js, React, Fumadocs, static export, dependency, runtime, and deployment context.
- `.planning/codebase/TESTING.md` - current test runner, source-text testing pattern, and coverage gaps.
- `package.json` - build scripts and performance-sensitive dependencies.
- Source scan on 2026-06-11 across `app/`, `components/`, `new-components/`, `lib/`, `config/`, and `scripts/`.
