# Phase 10: Static Export Route Policy - Research

**Researched:** 2026-06-12  
**Domain:** Next.js App Router static export route policy, generated SEO/text artifacts, and deployment guard integration  
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
## Implementation Decisions

### Route Map And Classification Contract

- **D-01:** Phase 10 must produce one source-owned static-export route map that
  covers `app/sitemap.ts`, `app/sitemap-ai-faq.ts`, `app/rss.xml/route.ts`,
  `app/sitemap-index.xml/route.ts`, `app/llms.txt/route.ts`,
  `app/api/search/route.ts`, `app/api/robots/route.ts`,
  `app/api/apps/[[...lang]]/route.ts`, `app/api/og/route.ts`,
  `app/api/blog/[lang]/[slug]/thumbnail/[format]/route.ts`, and
  `app/api/abuse/verify-turnstile/route.ts`.
- **D-02:** The route map must record route path, source file, HTTP method,
  content type, current execution model, expected static-export artifact or
  supported deployment path, input data source, runtime or external dependency,
  budget ownership, validation command, and originating PERF/ROUTEFIX IDs.
- **D-03:** Use explicit classification labels that downstream guards can test:
  `static artifact`, `static artifact via route handler`,
  `documented deployment-supported route`, `runtime native route`,
  `external-service-backed route`, and `API-like runtime route with fallback`.
- **D-04:** Generated SEO/search/text surfaces are first-class route-policy
  entries. Native image and external-service endpoints are first-class
  classification rows, but behavior fixes for those endpoints stay with their
  owner phases unless static export requires a fallback.
- **D-05:** Preserve Phase 4 traceability. `static-export-route-classification`
  remains the primary duplicate key for sitemap, `llms.txt`, route support,
  generated artifact size, and deployment behavior work. `fumadocs-search-index`
  remains the related key for search payload growth.

### Static Artifacts And Supported Behavior

- **D-06:** Prefer explicit static artifacts for user-facing SEO/search/text
  outputs when feasible: main sitemap, AI FAQ sitemap, RSS, robots, search, and
  `llms.txt` should have inspectable local output or a documented supported
  deployment route with an equivalent guard.
- **D-07:** Main sitemap and AI FAQ sitemap behavior must be documented together.
  `app/sitemap.ts` currently combines docs, blog, product, App Store,
  comparison, and localized marketing pages; `app/sitemap-ai-faq.ts` separately
  expands the AI quick reference corpus with `revalidate = false` and
  `dynamic = 'force-static'`.
- **D-08:** Robots behavior must be explicit across hosts. Current Cloudflare
  Pages behavior rewrites `/robots.txt` to `/api/robots` through
  `public/_redirects`, while `app/api/robots/route.ts` returns a small text
  response. Phase 10 should either produce an inspectable `robots.txt` artifact
  or document and guard the supported rewrite/route behavior.
- **D-09:** Search behavior should preserve the existing static-compatible
  intent in `app/api/search/route.ts`, which uses Fumadocs `staticGET`, disables
  revalidation, and builds metadata-oriented localized search records. Phase 10
  should make the generated output path and budget test explicit.
- **D-10:** `llms.txt` should be treated as a generated text artifact with a
  budget. Current source scans localized docs files directly with `fast-glob`,
  `gray-matter`, and a `remark` pipeline, so Phase 10 should make output size
  and source document count visible in the guard.
- **D-11:** `/api/apps` should be classified as an API-like runtime route with a
  static fallback. The route has static params for `/api/apps` and localized
  variants, while `lib/api/apps-api.ts` calls the remote template API and falls
  back to committed `appsConfig` on API failure.
- **D-12:** `/api/og` and blog thumbnail routes should be classified as runtime
  native routes with cache headers and static-export sensitivity. Detailed
  pre-generation, cache-key, font/native dependency, and renderer timing policy
  remains Phase 12.
- **D-13:** Turnstile abuse verification should be classified as an
  external-service-backed route. It posts to Cloudflare siteverify, depends on
  `TURNSTILE_SECRET_KEY`, and uses a process-local rate-limit map. Phase 10
  should document route support boundaries and avoid service-call behavior fixes.

### Byte And Count Budgets

- **D-14:** Phase 10 must add enforceable byte and count budgets for generated
  sitemap, search, and `llms.txt` outputs. Budgets should fail closed when
  inspected artifacts exceed the configured limits.
- **D-15:** Initial safe ceilings should use local generated output plus
  headroom: main/AI sitemap outputs at no more than 5,000 URLs and 2 MiB per
  artifact; search output at no more than 1,000 records and 1 MiB; `llms.txt` at
  no more than 500 source docs and 2 MiB for the default-locale artifact.
  Planners may tighten these after measuring the current `out` artifacts.
- **D-16:** Budget output should report measured bytes, item/source counts,
  configured limit, status, and artifact path. It should include enough detail
  to explain failures without requiring a production request.
- **D-17:** RSS and robots should be inspected for existence/content type or
  documented supported behavior. Byte budgets are required for sitemap, search,
  and `llms.txt`; planners may add RSS/robots informational byte counts if it
  keeps the guard simpler.

### Validation And Guard Integration

- **D-18:** Local static-output inspection is the default validation path. Phase
  10 should extend or compose with Phase 9 guard scripts rather than replacing
  deployment parity checks.
- **D-19:** `npm run static-output:check` already checks source config and
  representative `out` artifacts such as `sitemap.xml`, `rss.xml`,
  `robots.txt`, `llms.txt`, App Store pages, and static asset directories. Phase
  10 should add route-policy and budget checks that this command or
  `npm run validate:deployment` can call.
- **D-20:** Hosted route probes remain opt-in behind explicit gates, preferably
  reusing the Phase 9 `PHASE9_RUN_HOSTED_PROBES` gate unless a focused Phase 10
  wrapper is necessary. Production probes, deploys, external-service calls,
  Docker smoke, and browser traces remain closed by default.
- **D-21:** Accepted full validation should run under the Phase 9 Node 20
  locked-dependency path when build output is required: generated App Store diff
  guard, typecheck, timed build, static output inspection, route-policy budget
  checks, and deployment validation. Current-shell caveats such as Node 24,
  absent `node_modules`, or absent `out` may be recorded as caveats, not final
  acceptance evidence.
- **D-22:** Tests for new guard logic should follow the existing Node `node:test`
  script-test pattern used by Phase 9 guard scripts and should use temporary
  fixture directories where possible.

### Report Traceability And Phase Scope

- **D-23:** Phase 10 should trace primarily to ROUTEFIX-01 through ROUTEFIX-04,
  PERF-402, PERF-404, PERF-406, and PERF-503. It may reference PERF-401 where
  search payload budgeting overlaps `fumadocs-search-index`.
- **D-24:** `docs/performance-audit.md` may be updated during Phase 10 execution
  when the plan explicitly includes traceability/status updates for Phase 10
  evidence. This context step keeps the report read-only.
- **D-25:** Phase 10 should keep deployment target comparison, cache parity
  matrix ownership, Docker smoke policy, Node locked-build orchestration, and
  unsafe-gate definitions anchored in Phase 9 artifacts.
- **D-26:** Phase 10 should keep shared shell bundle/hydration, route chunks,
  auth/deploy modal loading, analytics loading, and browser trace closeout out
  of scope.

### the agent's Discretion

Downstream agents may decide exact document paths, route-policy data shape,
script filenames, npm script names, budget config location, and whether the
route-policy guard is a new script or an extension of `scripts/check-static-output.js`.
They must keep defaults deterministic and local, preserve Phase 9 gates, avoid
production probes by default, classify runtime/external endpoints without
turning them into broad behavior-fix work, and keep the required outputs
inspectable from local static artifacts or documented supported route behavior.

### Deferred Ideas (OUT OF SCOPE)
None recorded in `10-CONTEXT.md`.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| ROUTEFIX-01 | Developer can inspect a static-export route map that classifies sitemap, RSS, search, robots, `llms.txt`, OG, thumbnail, and API-like routes by generated artifact or runtime dependency. | Use `docs/static-export-route-policy.md` plus `config/static-export-route-policy.json` as the source-owned map and make `scripts/check-static-export-routes.js` validate all required rows and labels. [VERIFIED: `.planning/REQUIREMENTS.md`; `.planning/phases/10-static-export-route-policy/10-CONTEXT.md`] |
| ROUTEFIX-02 | User can receive generated sitemap, robots, search, RSS, and `llms.txt` outputs from explicit static artifacts or documented deployment-supported paths. | Extend local `out` inspection to require `sitemap.xml`, AI FAQ sitemap path, `rss.xml`, `robots.txt` or documented `/robots.txt -> /api/robots` support, `llms.txt`, and search artifact/route output evidence. [VERIFIED: `scripts/check-static-output.js`; `public/_redirects`; route sources] |
| ROUTEFIX-03 | Developer can enforce byte budgets for generated sitemap, search, and `llms.txt` outputs. | Add budget config and artifact measurement for bytes plus URL/record/source-doc counts; fail closed when `out` exists or `PHASE9_RUN_LOCKED_BUILD=1`. [VERIFIED: `10-CONTEXT.md`; `scripts/check-static-output.js`] |
| ROUTEFIX-04 | Developer can validate static-export route behavior with local output inspection and preview smoke checks. | Wire route-policy/budget checks into `static-output:check` and `validate:deployment`; keep hosted probes behind `PHASE9_RUN_HOSTED_PROBES`. [VERIFIED: `09-VERIFICATION.md`; `scripts/check-deployment-parity.js`] |
</phase_requirements>

## Summary

Phase 10 should create a source-owned route policy and a local guard around the existing Next.js static export model. The project already sets production `output: 'export'`, `trailingSlash: true`, and `images.unoptimized: true` in `next.config.mjs`; Phase 9 already provides `static-output:check`, `validate:deployment`, `PHASE9_RUN_LOCKED_BUILD`, and `PHASE9_RUN_HOSTED_PROBES` guard patterns. [VERIFIED: `next.config.mjs`; `package.json`; `scripts/check-static-output.js`; `scripts/check-deployment-parity.js`]

The implementation path should prefer a new `scripts/check-static-export-routes.js` that composes with `scripts/check-static-output.js`, plus a machine-readable policy file and a human documentation page. This keeps route classification, budget thresholds, and out-artifact validation testable with Node built-ins and the existing `node:test` pattern. [VERIFIED: Phase 9 scripts/tests; ASSUMED: exact filename recommendation]

Accepted full evidence requires the Phase 9 locked-build path under Node 20 with installed locked dependencies because the current shell is Node `v24.13.0`, `node_modules` is absent, and `out` is absent. [VERIFIED: environment probe; `09-VERIFICATION.md`] Current-shell source checks and fixture tests remain useful implementation evidence, while final acceptance must use generated `out` artifacts. [VERIFIED: `scripts/check-static-output.js`; `09-VERIFICATION.md`]

**Primary recommendation:** implement a policy-driven route guard with no new dependencies, wire it into `static-output:check` and `validate:deployment`, then update `docs/performance-audit.md` with Phase 10 traceability after guard evidence exists. [VERIFIED: `10-CONTEXT.md`; Phase 9 guard scripts]

## Project Constraints (from AGENTS.md)

- Every user-facing reply must begin with `爸爸`; planning artifacts are English. [VERIFIED: `AGENTS.md`]
- User-facing output uses Simplified Chinese; code, comments, commit messages, PR titles/descriptions, and planning docs use English. [VERIFIED: `AGENTS.md`]
- Preserve the existing Next.js App Router, React, Fumadocs, npm, static export, and deployment model. [VERIFIED: `AGENTS.md`; `.planning/PROJECT.md`]
- Before file-changing work, use a GSD workflow entrypoint unless the user explicitly bypasses it; this research is already inside the GSD phase flow. [VERIFIED: `AGENTS.md`; init.phase-op output]
- Use Node.js 20 from `.nvmrc` for accepted build evidence and npm with `package-lock.json`. [VERIFIED: `AGENTS.md`; `.nvmrc`; `09-VERIFICATION.md`]
- New TypeScript must type-check under strict TypeScript settings, and `npm run lint` is the TypeScript validation command. [VERIFIED: `AGENTS.md`; `tsconfig.json`; `package.json`]
- Existing tests use Node script tests; no Jest/Vitest/Playwright config is present. [VERIFIED: `AGENTS.md`; `package.json`; script files]

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|--------------|----------------|-----------|
| Static-export route map | Repository policy / build tooling | Documentation | The route map is source-owned metadata consumed by local guard scripts and planner-facing docs. [VERIFIED: `10-CONTEXT.md`] |
| Sitemap/RSS/robots/search/llms static behavior | Frontend server build/static export | CDN/static host | Next build emits static output under `out`; Cloudflare/Vercel/Docker then serve or rewrite artifacts according to target policy. [VERIFIED: `next.config.mjs`; `docs/deployment-parity.md`] |
| Byte/count budgets | Build tooling | Static output artifacts | Budgets inspect generated files and counts rather than browser runtime state. [VERIFIED: `10-CONTEXT.md`; `scripts/check-static-output.js`] |
| Hosted route probes | Deployment/preview environment | Build tooling | Hosted probes require explicit URL and network gates; local guard scripts should remain deterministic by default. [VERIFIED: `docs/deployment-parity.md`; `scripts/check-deployment-parity.js`] |
| Runtime/external route classification | API/backend route layer | Documentation | `/api/apps`, `/api/og`, thumbnails, and Turnstile routes have runtime/native/external dependencies that must be classified while owner fixes stay in later phases. [VERIFIED: route sources; `10-CONTEXT.md`] |

## Standard Stack

### Core

| Library / Tool | Current Project Version | Purpose | Why Standard |
|----------------|-------------------------|---------|--------------|
| Node.js | `.nvmrc` requires major `20`; current shell is `v24.13.0` | Run guard scripts, `node:test`, and locked validation | Existing CI and Phase 9 acceptance use Node 20. [VERIFIED: `.nvmrc`; `09-VERIFICATION.md`; environment probe] |
| npm | current shell `11.6.2`; project uses `package-lock.json` | Package script runner and lockfile workflow | Existing scripts and CI use npm. [VERIFIED: `package.json`; `package-lock.json`; AGENTS.md] |
| Next.js | package range `^14.2.28`; npm latest observed `16.2.9` on 2026-06-12 | App Router and static export | Existing app and static export config depend on Next; Phase 10 should preserve this stack. [VERIFIED: `package.json`; `next.config.mjs`; npm registry] |
| Node built-ins | Node 20+ | Guard implementation with `fs`, `path`, `child_process`, `node:test`, `assert`, temp dirs | Phase 9 guard scripts already use this pattern without extra dependencies. [VERIFIED: `scripts/check-static-output.js`; `scripts/check-static-output.test.mjs`] |

### Supporting

| Library / Tool | Current Project Version | Purpose | When to Use |
|----------------|-------------------------|---------|-------------|
| Fumadocs `createSearchAPI` | `fumadocs-core` range `^15.2.6`; npm current observed `16.10.1` | Existing `/api/search` static search route | Preserve existing `staticGET` route behavior and inspect generated output path. [VERIFIED: `app/api/search/route.ts`; npm registry] |
| `feed` | `^5.1.0` | Existing RSS XML serialization | Keep current RSS route and inspect output. [VERIFIED: `app/rss.xml/route.ts`; `package.json`] |
| `sharp`, `canvas`, `satori`, `ImageResponse` | existing package ranges in `package.json` | Runtime/native image routes | Classify `/api/og` and thumbnails; detailed policy remains Phase 12. [VERIFIED: `app/api/og/route.ts`; thumbnail route; `10-CONTEXT.md`] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| New guard script plus JSON policy | Extend `scripts/check-static-output.js` directly | Extension is smaller but mixes artifact checks, route policy validation, and budgets in one Phase 9 script; a composed script keeps Phase 10 ownership clearer. [ASSUMED] |
| Static artifact generation for robots/search through custom scripts | Document supported route behavior and inspect `out` | Custom generation can duplicate Next/Fumadocs behavior; `out` inspection follows existing static-export artifact evidence. [VERIFIED: Phase 9 guard; ASSUMED: duplication risk] |
| Hosted route probes by default | Opt-in `PHASE9_RUN_HOSTED_PROBES` | Default probes would depend on network and deployment URLs; Phase 9 locks unsafe checks behind gates. [VERIFIED: `docs/deployment-parity.md`] |

**Installation:** none. Phase 10 should avoid new dependencies. [VERIFIED: user request; `10-CONTEXT.md` discretion]

## Package Legitimacy Audit

No new external packages are recommended for Phase 10. Existing project packages remain governed by the lockfile and current dependency alignment scope. [VERIFIED: user request; `package-lock.json`; `.planning/REQUIREMENTS.md` DEPS-03 future scope]

| Package | Registry | Age | Downloads | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-----------|-------------|-----------|-------------|
| n/a | n/a | n/a | n/a | n/a | n/a | No new package install recommended. [VERIFIED: research decision] |

**Packages removed due to slopcheck [SLOP] verdict:** none.  
**Packages flagged as suspicious [SUS]:** none.

## Architecture Patterns

### System Architecture Diagram

```text
Source route files + policy JSON
  -> static-export route guard
    -> source row validation
    -> classification label validation
    -> required field validation
    -> Phase 4/10 traceability token validation
  -> static-output inspection
    -> if out exists or PHASE9_RUN_LOCKED_BUILD=1
      -> artifact existence/content-type heuristics
      -> sitemap/search/llms byte and count budgets
      -> optional RSS/robots informational counts
    -> else
      -> SKIPPED_WITH_CAVEAT for artifact-only evidence
  -> deployment validation
    -> app-store diff guard
    -> locked Node 20 build path when gate is open
    -> static-output route-policy checks
    -> Docker/hosted probes only behind Phase 9 gates
```

### Recommended Project Structure

```text
docs/
├── static-export-route-policy.md        # Human route map, supported behavior, caveats, and validation commands.
└── performance-audit.md                 # Phase 10 traceability/status update after implementation evidence exists.
config/
└── static-export-route-policy.json      # Machine-readable route rows and budget thresholds.
scripts/
├── check-static-export-routes.js        # Policy, budget, artifact, and optional hosted-probe guard.
├── check-static-export-routes.test.mjs  # node:test fixtures for policy and budget behavior.
├── check-static-output.js               # Compose or call Phase 10 guard from existing static output check.
└── check-static-output.test.mjs         # Add integration fixture covering new route-policy call.
package.json                            # Add `static-routes:check` or equivalent and wire into existing commands.
```

All paths above are recommendations for implementation planning, not existing files except the Phase 9 files listed. [VERIFIED: current file scan; ASSUMED: exact new filenames]

### Pattern 1: Machine-Readable Policy Rows

**What:** Store route rows in JSON, with docs rendering the same fields for humans. [ASSUMED]  
**When to use:** Use for the D-02 route map fields and D-03 testable classification labels. [VERIFIED: `10-CONTEXT.md`]  
**Example:**

```json
{
  "budgets": {
    "sitemap": { "maxUrls": 5000, "maxBytes": 2097152 },
    "search": { "maxRecords": 1000, "maxBytes": 1048576 },
    "llms": { "maxSourceDocs": 500, "maxBytes": 2097152 }
  },
  "routes": [
    {
      "routePath": "/sitemap.xml",
      "sourceFile": "app/sitemap.ts",
      "httpMethod": "GET",
      "contentType": "application/xml",
      "classification": "static artifact",
      "expectedArtifact": "out/sitemap.xml",
      "inputDataSource": "source.getPages(), blog.getPages(), appsConfig, platform slugs",
      "runtimeDependency": "none",
      "budgetOwner": "sitemap",
      "validationCommand": "npm run static-routes:check",
      "traceability": ["ROUTEFIX-01", "ROUTEFIX-02", "ROUTEFIX-03", "ROUTEFIX-04", "PERF-404", "PERF-406"]
    }
  ]
}
```

### Pattern 2: Fail-Closed Artifact Budgets

**What:** Measure artifact bytes plus item counts only when `out` exists or `PHASE9_RUN_LOCKED_BUILD=1`; treat missing `out` under the open locked gate as failure. [VERIFIED: `scripts/check-static-output.js`]  
**When to use:** Use for sitemap, AI FAQ sitemap, search, and `llms.txt` budgets. [VERIFIED: `10-CONTEXT.md`]  
**Example:**

```javascript
function inspectBudget({ artifactPath, maxBytes, count, maxCount, label }) {
  const bytes = fs.statSync(artifactPath).size;
  const failures = [];
  if (bytes > maxBytes) failures.push(`${label} bytes ${bytes} > ${maxBytes}`);
  if (count > maxCount) failures.push(`${label} count ${count} > ${maxCount}`);
  return { label, artifactPath, bytes, maxBytes, count, maxCount, failures };
}
```

### Pattern 3: Phase 9 Guard Composition

**What:** Add a focused script and call it from `static-output:check`; keep `validate:deployment` as the umbrella entrypoint. [VERIFIED: existing Phase 9 scripts; ASSUMED: exact composition point]  
**When to use:** Use whenever static route policy needs artifact inspection and deployment validation. [VERIFIED: `10-CONTEXT.md`]  
**Example:**

```javascript
const routePolicy = validateStaticExportRoutes({ rootDir, env });
failures.push(...routePolicy.failures);
```

### Anti-Patterns to Avoid

- **Production probes by default:** Keep hosted checks behind `PHASE9_RUN_HOSTED_PROBES`. [VERIFIED: `docs/deployment-parity.md`]
- **Runtime behavior fixes in classification rows:** Keep `/api/og`, thumbnails, `/api/apps`, and Turnstile as route policy rows unless static export requires a fallback. [VERIFIED: `10-CONTEXT.md`]
- **String-only policy documentation:** Use machine-readable route rows so tests can enforce labels and required fields. [ASSUMED]
- **Hard-coded artifact success without `out`:** Artifact budgets require generated output; current shell has no `out`. [VERIFIED: environment probe]
- **New dependency for XML/text parsing:** URL and record counts can be counted with Node string/regex parsing for this guard. [ASSUMED]

## Recommended Route Policy Rows

| Route Path | Source File | Method | Content Type | Classification | Expected Artifact / Supported Path | Data Source | Runtime Dependency | Budget Owner | Traceability |
|------------|-------------|--------|--------------|----------------|------------------------------------|-------------|--------------------|--------------|--------------|
| `/sitemap.xml` | `app/sitemap.ts` | GET | XML | `static artifact` | `out/sitemap.xml` | docs, blog, App Store, comparison, static pages | none | sitemap | ROUTEFIX-01..04, PERF-404, PERF-406 [VERIFIED: source] |
| `/ai-quick-reference/sitemap.xml` | `app/sitemap-ai-faq.ts` | GET | XML | `static artifact` | likely `out/ai-quick-reference/sitemap.xml`; verify actual `out` path after build | `faqSource` en/zh-cn | none | sitemap | ROUTEFIX-01..04, PERF-404, PERF-406 [VERIFIED: source; ASSUMED: exact output path until `out` exists] |
| `/rss.xml` | `app/rss.xml/route.ts` | GET | `application/rss+xml; charset=utf-8` | `static artifact via route handler` | `out/rss.xml` | default-language blog pages | none | informational | ROUTEFIX-01, ROUTEFIX-02, ROUTEFIX-04 [VERIFIED: source] |
| `/sitemap-index.xml` | `app/sitemap-index.xml/route.ts` | GET | `application/xml` | `static artifact via route handler` | `out/sitemap-index.xml` if emitted; otherwise document supported route behavior | static string plus default locale host | none | informational | ROUTEFIX-01, ROUTEFIX-02, ROUTEFIX-04, PERF-406 [VERIFIED: source; ASSUMED: exact output path until `out` exists] |
| `/llms.txt` | `app/llms.txt/route.ts` | GET | text | `static artifact via route handler` | `out/llms.txt` | localized docs filesystem scan | `fast-glob`, `gray-matter`, remark pipeline | llms | ROUTEFIX-01..04, PERF-402, PERF-503 [VERIFIED: source] |
| `/api/search` | `app/api/search/route.ts` | GET | JSON/search API response | `static artifact via route handler` | inspect actual `out` search path after build; document supported route path | Fumadocs `source.getLanguages()` | Fumadocs static search, Mandarin tokenizer | search | ROUTEFIX-01..04, PERF-401, PERF-406 [VERIFIED: source; ASSUMED: exact output path until `out` exists] |
| `/robots.txt` / `/api/robots` | `app/api/robots/route.ts`, `public/_redirects` | GET | `text/plain` | `documented deployment-supported route` or `static artifact via route handler` | prefer `out/robots.txt`; otherwise document Cloudflare `/robots.txt /api/robots 200` and Vercel behavior | default locale host | host routing | informational | ROUTEFIX-01, ROUTEFIX-02, ROUTEFIX-04, PERF-406 [VERIFIED: source] |
| `/api/apps`, `/api/apps/[lang]` | `app/api/apps/[[...lang]]/route.ts`, `lib/api/apps-api.ts` | GET | JSON | `API-like runtime route with fallback` | supported runtime path plus static `appsConfig` fallback | remote template API, committed app config | network API; static fallback | none | ROUTEFIX-01, PERF-406 [VERIFIED: source] |
| `/api/og` | `app/api/og/route.ts` | GET | `image/webp` | `runtime native route` | runtime route; Phase 12 owns behavior fixes | canvas helper and Sharp | native image dependencies | none | ROUTEFIX-01, PERF-501, PERF-406 [VERIFIED: source; `10-CONTEXT.md`] |
| `/api/blog/[lang]/[slug]/thumbnail/[format]` | thumbnail route | GET | SVG/PNG/JSON error | `runtime native route` | generated params for common formats; Phase 12 owns renderer policy | blog pages, fonts, Satori/ImageResponse | native/image/font rendering | none | ROUTEFIX-01, PERF-502, PERF-406 [VERIFIED: source; `10-CONTEXT.md`] |
| `/api/abuse/verify-turnstile` | `app/api/abuse/verify-turnstile/route.ts` | POST | JSON | `external-service-backed route` | runtime route requiring `TURNSTILE_SECRET_KEY` and Cloudflare siteverify | request token, env secret | external Cloudflare call, process-local map | none | ROUTEFIX-01, PERF-406, PERF-508 [VERIFIED: source] |

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Static export build orchestration | A new build runner | Phase 9 `PHASE9_RUN_LOCKED_BUILD=1 npm run validate:deployment` | Existing guard already sequences diff, lint, build, analyzer, and static-output checks. [VERIFIED: `scripts/check-deployment-parity.js`] |
| Deployment unsafe-gate policy | New env gates with different semantics | Reuse `PHASE9_RUN_HOSTED_PROBES`, `PHASE9_RUN_LOCKED_BUILD`, and existing Phase 9 gates | Phase 9 already documents gate defaults and verification. [VERIFIED: `docs/deployment-parity.md`; `09-VERIFICATION.md`] |
| Route inventory from runtime crawling | Production or preview crawling by default | Source policy plus local `out` inspection | Phase 10 defaults are deterministic and local. [VERIFIED: `10-CONTEXT.md`] |
| XML/RSS/search/llms budget parsing dependency | New parser dependency | Node `fs` plus focused regex/count helpers | The budgets need byte and item counts, not full semantic parsing. [ASSUMED] |

**Key insight:** Phase 10 is a policy and guard phase; the durable fix is making route behavior explicit, measurable, and wired into existing validation. [VERIFIED: `10-CONTEXT.md`; `09-VERIFICATION.md`]

## Common Pitfalls

### Pitfall 1: Treating Missing `out` As Success
**What goes wrong:** Source checks pass while artifact budgets never inspect generated files. [VERIFIED: `scripts/check-static-output.js`]  
**Why it happens:** The Phase 9 guard intentionally reports `SKIPPED_WITH_CAVEAT` when `out` is absent and the locked-build gate is closed. [VERIFIED: `scripts/check-static-output.js`]  
**How to avoid:** Route-budget checks should mirror `shouldInspectOut()` and fail when `PHASE9_RUN_LOCKED_BUILD=1` but `out` is missing. [VERIFIED: `scripts/check-static-output.js`]  
**Warning signs:** Output mentions `SKIPPED_WITH_CAVEAT`, active Node 24, absent `node_modules`, or absent `out`. [VERIFIED: environment probe; `09-VERIFICATION.md`]

### Pitfall 2: Ambiguous Search Artifact Path
**What goes wrong:** A guard asserts `/api/search` behavior without confirming the actual static export output path. [ASSUMED]  
**Why it happens:** The route uses Fumadocs `staticGET`, and the current workspace has no `out` directory for artifact-path inspection. [VERIFIED: `app/api/search/route.ts`; environment probe]  
**How to avoid:** Implement source validation first, then require measured artifact path once the locked build creates `out`. [VERIFIED: `10-CONTEXT.md`; `scripts/check-static-output.js`]  
**Warning signs:** Policy rows for search contain `expectedArtifact` without matching `out` evidence. [ASSUMED]

### Pitfall 3: Converting Classification Work Into Phase 12/13 Work
**What goes wrong:** Planner pulls OG rendering benchmarks, browser traces, or native image pre-generation into Phase 10. [VERIFIED: `10-CONTEXT.md`]  
**Why it happens:** `/api/og` and thumbnail routes are in the route map but their behavior fixes are owned later. [VERIFIED: `10-CONTEXT.md`]  
**How to avoid:** Classify these rows and record cache/native dependencies; leave renderer timing and pre-generation to Phase 12. [VERIFIED: `10-CONTEXT.md`]  
**Warning signs:** Phase 10 tasks modify `lib/og-canvas.ts`, thumbnail template rendering, or browser trace tooling. [ASSUMED]

### Pitfall 4: Host-Specific Robots Behavior
**What goes wrong:** `/robots.txt` works on one host path and fails on another. [VERIFIED: `public/_redirects`; `docs/deployment-parity.md`]  
**Why it happens:** Current Cloudflare behavior rewrites `/robots.txt` to `/api/robots`; Docker/Nginx serves static files unless runtime config supplies redirects. [VERIFIED: `public/_redirects`; `docs/deployment-parity.md`]  
**How to avoid:** Prefer a generated `out/robots.txt` artifact; otherwise document and guard host-specific supported behavior. [VERIFIED: `10-CONTEXT.md`]  
**Warning signs:** Static output contains no `robots.txt` while docs claim static-file support. [ASSUMED]

## Code Examples

### Node Test Fixture Pattern

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { validateStaticExportRoutes } from './check-static-export-routes.js';

test('route policy budgets pass for fixture artifacts', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'phase10-routes-'));
  try {
    const outDir = join(dir, 'out');
    await mkdir(outDir, { recursive: true });
    await writeFile(join(outDir, 'sitemap.xml'), '<urlset><url /></urlset>');
    const result = validateStaticExportRoutes({ rootDir: dir, env: {} });
    assert.equal(result.status, 'PASS');
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
```

Source pattern: existing `scripts/check-static-output.test.mjs` uses `mkdtemp`, fixture files, and exported validator functions. [VERIFIED: `scripts/check-static-output.test.mjs`]

### Static Export Route Handler Rule

Next.js official static export docs state that route handlers with `GET` can be statically exported when they return a `Response`, and route handlers that rely on Request data are unsupported for static export. [CITED: https://nextjs.org/docs/app/guides/static-exports] The route handler docs also show `GET` functions returning `Response` objects and separate request-aware examples. [CITED: https://nextjs.org/docs/app/api-reference/file-conventions/route]

```typescript
// Source: https://nextjs.org/docs/app/guides/static-exports
export async function GET() {
  return Response.json({ name: 'Lee' });
}
```

Use that rule as policy context, while accepting actual evidence only from this repository's `out` artifacts. [VERIFIED: official docs; `scripts/check-static-output.js`]

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| App Router route behavior inferred from source comments and Phase 4 audit rows | Testable source-owned route policy plus local artifact budgets | Phase 10 planned change | Planner can create deterministic tasks and validators. [VERIFIED: Phase 4 audit; `10-CONTEXT.md`] |
| Phase 9 representative static file checks only | Phase 10 route-specific policy and budget checks composed with Phase 9 | Phase 10 planned change | `static-output:check` can verify route behavior and generated payload growth. [VERIFIED: `scripts/check-static-output.js`; `10-CONTEXT.md`] |
| Hosted behavior checked manually or deferred | Hosted probes behind `PHASE9_RUN_HOSTED_PROBES` | Phase 9 | Network checks remain opt-in and documented. [VERIFIED: `docs/deployment-parity.md`] |

**Deprecated/outdated:**
- Treating all `app/api/**/route.ts` files as equivalent under static export is outdated for this project; Phase 10 requires separate static artifact, route-handler artifact, runtime native, external-service, and fallback labels. [VERIFIED: `10-CONTEXT.md`]
- Using current shell command success as final build evidence is outdated for this phase; full evidence requires Node 20, installed dependencies, and generated `out`. [VERIFIED: `09-VERIFICATION.md`; environment probe]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Use `docs/static-export-route-policy.md`, `config/static-export-route-policy.json`, and `scripts/check-static-export-routes.js` as exact new file paths. | Summary, Architecture Patterns | Planner may choose a different but equivalent path; risk is low if package scripts and docs agree. |
| A2 | Implement a new guard script rather than only expanding `scripts/check-static-output.js`. | Standard Stack, Patterns | A single-script implementation could still satisfy requirements; plan should keep composition explicit. |
| A3 | Count XML/search/llms records with Node string/regex helpers. | Don't Hand-Roll | Edge XML formatting could require slightly more robust parsing; no new dependency is still preferred. |
| A4 | Exact `out` path for AI FAQ sitemap, sitemap index, and search route must be confirmed after a locked build. | Route Policy Rows | Guard could point at wrong artifact path until `out` is inspected. |

## Open Questions

None blocking. The only unresolved details are output-path measurements that require the Phase 9 locked-build path to create `out`. [VERIFIED: current environment; `09-VERIFICATION.md`]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Node.js | Script tests and guard execution | Yes, wrong major for accepted full evidence | `v24.13.0`; project requires major `20` | Use Node 20 for final locked-build evidence. [VERIFIED: environment probe; `.nvmrc`] |
| npm | Package scripts | Yes | `11.6.2` | Use npm with project lockfile. [VERIFIED: environment probe; `package-lock.json`] |
| `node_modules` | `npm run lint`, `next build`, route imports | No | n/a | Install locked deps under Node 20 before accepted full validation. [VERIFIED: environment probe; `09-VERIFICATION.md`] |
| `out` | Static artifact and budget inspection | No | n/a | Source checks and fixture tests now; locked build for final artifact evidence. [VERIFIED: environment probe; `scripts/check-static-output.js`] |
| Docker | Phase 9 Docker smoke | Unknown/not required by Phase 10 default | n/a | Keep Docker smoke behind `PHASE9_RUN_DOCKER_SMOKE`. [VERIFIED: `09-VERIFICATION.md`] |
| Hosted preview URL | Hosted probes | Not provided | n/a | Keep probes behind `PHASE9_RUN_HOSTED_PROBES`. [VERIFIED: `docs/deployment-parity.md`] |
| Context7 CLI | Documentation lookup | No | n/a | Official Next docs were fetched directly. [VERIFIED: environment probe; official docs URLs] |

**Missing dependencies with no fallback:**
- None for source-level research and planning. [VERIFIED: environment probe]

**Missing dependencies with fallback:**
- `node_modules` and `out` are missing; source checks and fixture tests can proceed, while final acceptance uses Node 20 locked validation. [VERIFIED: `09-VERIFICATION.md`]

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Node `node:test` using built-in `assert`. [VERIFIED: Phase 9 tests] |
| Config file | none. [VERIFIED: `package.json`; file scan] |
| Quick run command | `node --test scripts/check-static-export-routes.test.mjs scripts/check-static-output.test.mjs` [ASSUMED: new test filename] |
| Full suite command | `PHASE9_RUN_LOCKED_BUILD=1 npm run validate:deployment` in Node 20 with installed locked dependencies. [VERIFIED: `09-VERIFICATION.md`] |

### Phase Requirements -> Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|--------------|
| ROUTEFIX-01 | Policy includes all D-01 route sources and D-03 labels with D-02 required fields | unit/source | `node --test scripts/check-static-export-routes.test.mjs` | No, Wave 0 |
| ROUTEFIX-02 | Static artifact or documented supported path exists for sitemap, AI FAQ sitemap, RSS, robots, search, and `llms.txt` | unit + artifact integration | `npm run static-routes:check` and `npm run static-output:check` | No, Wave 0 |
| ROUTEFIX-03 | Sitemap/search/llms budgets fail closed on bytes/count excess | unit + artifact integration | `node --test scripts/check-static-export-routes.test.mjs` | No, Wave 0 |
| ROUTEFIX-04 | Route policy guard composes with Phase 9 local output inspection and hosted probes remain gated | integration | `npm run validate:deployment` plus `PHASE9_RUN_HOSTED_PROBES=1 npm run static-routes:check -- --hosted-url=$URL` when URL is supplied | Partial; Phase 9 exists |

### Sampling Rate

- **Per task commit:** `node --test scripts/check-static-export-routes.test.mjs scripts/check-static-output.test.mjs` [ASSUMED: new test filename]
- **Per wave merge:** `npm run static-routes:check && npm run static-output:check && npm run validate:deployment` [ASSUMED: new npm script]
- **Phase gate:** `PHASE9_RUN_LOCKED_BUILD=1 npm run validate:deployment` under Node 20 with `node_modules` and generated `out`; optionally add `PHASE9_RUN_HOSTED_PROBES=1` with an approved preview URL. [VERIFIED: `09-VERIFICATION.md`; `10-CONTEXT.md`]

### Wave 0 Gaps

- [ ] `config/static-export-route-policy.json` - machine-readable rows and budgets. [ASSUMED]
- [ ] `docs/static-export-route-policy.md` - human-readable policy, supported paths, caveats, and commands. [ASSUMED]
- [ ] `scripts/check-static-export-routes.js` - policy, budget, artifact, and optional hosted-probe guard. [ASSUMED]
- [ ] `scripts/check-static-export-routes.test.mjs` - fixture tests for required rows, labels, budgets, missing artifacts, and hosted gate behavior. [ASSUMED]
- [ ] `package.json` script such as `static-routes:check` plus existing `static-output:check` integration. [ASSUMED]

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|------------------|
| V2 Authentication | No | Phase 10 does not modify auth flows; classify auth-adjacent Turnstile route only. [VERIFIED: `10-CONTEXT.md`] |
| V3 Session Management | No | No session state changes are planned. [VERIFIED: `10-CONTEXT.md`] |
| V4 Access Control | No | Guard scripts read local files and optional hosted public URLs. [ASSUMED] |
| V5 Input Validation | Yes | Validate JSON policy schema fields, allowed classification labels, artifact path inputs, and hosted URL gate inputs. [ASSUMED] |
| V6 Cryptography | No | No cryptographic code is planned. [VERIFIED: phase scope] |
| V10 SSRF | Yes for optional hosted probes | Allow only explicit `PHASE9_RUN_HOSTED_PROBES=1` and supplied preview URL; avoid implicit production probing. [VERIFIED: `docs/deployment-parity.md`; ASSUMED: SSRF category mapping] |

### Known Threat Patterns for Phase 10

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Accidental production probing | Information Disclosure / Denial of Service | Keep hosted probes opt-in through `PHASE9_RUN_HOSTED_PROBES` and require explicit URL. [VERIFIED: `docs/deployment-parity.md`] |
| Path traversal in artifact inspection | Tampering / Information Disclosure | Resolve artifact paths under `rootDir`/`outDir` and reject paths outside the workspace. [ASSUMED] |
| Silent policy drift | Repudiation | Validate required rows, labels, traceability IDs, and commands in CI/local guard output. [ASSUMED] |
| External-service call from Turnstile probe | Information Disclosure / Denial of Service | Classify route only; keep service-call smoke outside Phase 10. [VERIFIED: `10-CONTEXT.md`] |

## Sources

### Primary (HIGH confidence)

- `.planning/phases/10-static-export-route-policy/10-CONTEXT.md` - locked Phase 10 scope, route labels, budgets, guard integration, and caveats.
- `.planning/REQUIREMENTS.md` - ROUTEFIX-01..04 definitions and traceability.
- `.planning/ROADMAP.md` - Phase 10 goal and success criteria.
- `.planning/STATE.md` - v2.0 state.
- `.planning/phases/09-deployment-parity-and-guard-foundation/09-VERIFICATION.md` - Phase 9 guard status and current caveats.
- `.planning/phases/04-route-classification-and-content-generated-endpoints/04-CONTEXT.md` and `04-VERIFICATION.md` - route classification provenance.
- `docs/performance-audit.md` - PERF-401, PERF-402, PERF-404, PERF-406, PERF-503 evidence and prioritized remediation rows.
- Route sources listed in Phase 10 context - current source behavior and dependencies.
- `scripts/check-static-output.js`, `scripts/check-static-output.test.mjs`, `scripts/check-deployment-parity.js` - Phase 9 guard APIs and test patterns.
- `next.config.mjs`, `public/_redirects`, `docs/deployment-parity.md`, `package.json` - static export and deployment wiring.
- Next.js official docs: `https://nextjs.org/docs/app/guides/static-exports`, `https://nextjs.org/docs/app/api-reference/file-conventions/route`, `https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap`, `https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots`.

### Secondary (MEDIUM confidence)

- npm registry checks for latest package versions observed on 2026-06-12: `next` latest `16.2.9`, `fumadocs-core`/`fumadocs-ui` latest `16.10.1`, `fumadocs-mdx` latest `15.0.12`. These inform drift awareness only; Phase 10 should keep existing project versions. [VERIFIED: npm registry]

### Tertiary (LOW confidence)

- Exact new filenames and exact `out` paths for search/sitemap-index/AI FAQ sitemap before a locked build creates `out`. [ASSUMED]

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Existing repo stack, package scripts, and official docs were inspected; no new dependencies are recommended.
- Architecture: HIGH - Phase 10 is constrained by locked context and existing Phase 9 guard APIs.
- Pitfalls: HIGH - Caveats are directly verified from Phase 9 verification and current environment probes.
- Exact output artifact paths: MEDIUM - Current workspace lacks `out`, so final artifact paths require locked-build inspection.

**Research date:** 2026-06-12  
**Valid until:** 2026-07-12 for repo-local guidance; re-check official Next static export docs if Next is upgraded before implementation.
