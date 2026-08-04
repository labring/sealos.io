---
phase: 32-sitemap-route-parity-and-production-verification
plan: "03"
subsystem: build-tooling
tags: [nodejs, fetch, worker-pool, timeout, remote-parity]

requires:
  - phase: 32-02
    provides: Complete local adapter, stable report contract, and accepted static build gate.
provides:
  - Eight-worker complete remote index-route crawl with 10-second request bounds.
  - Manual redirect, zero-retry, single-body-read, and deterministic result collection.
  - Strict 2,000-route remote acceptance and fresh stale-production evidence.
affects: [32-04, production-verification, release-gate, ai-quick-reference]

tech-stack:
  added: []
  patterns:
    - Centralize remote request status, timeout, network, and body classification.
    - Store worker results by index position and sort findings after all requests complete.

key-files:
  created: []
  modified:
    - scripts/verify-ai-faq-routes.mjs
    - scripts/verify-ai-faq-routes.test.mjs

key-decisions:
  - "Remote route membership contains page-index slugs that return direct HTTP 200 even when body inspection fails."
  - "Every fetch uses AbortSignal.timeout(10000), redirect manual, one attempt, and at most one body read."
  - "Production remote acceptance defaults to 2,000 total and unique entries in every inventory."

patterns-established:
  - "Use exactly eight cursor-sharing workers while retaining result slots in deterministic index order."
  - "Treat a second operator invocation as a fresh complete pass and keep automatic retry count at zero."

requirements-completed: [DELIVERY-02]

coverage:
  - id: D1
    description: Complete remote page-index crawl through exactly eight bounded workers and one request per route.
    requirement: DELIVERY-02
    verification:
      - kind: unit
        ref: scripts/verify-ai-faq-routes.test.mjs#fetches every remote route once with eight workers and fixed request bounds
        status: pass
      - kind: unit
        ref: scripts/verify-ai-faq-routes.test.mjs#keeps remote output stable across opposite completion schedules
        status: pass
    human_judgment: false
  - id: D2
    description: Independent timeout, network, redirect/status, body, malformed-data, set, and identity diagnostics.
    requirement: DELIVERY-02
    verification:
      - kind: unit
        ref: scripts/verify-ai-faq-routes.test.mjs#collects remote timeout network status body and identity failures in one pass
        status: pass
      - kind: unit
        ref: scripts/verify-ai-faq-routes.test.mjs#reports malformed remote index and sitemap bodies independently
        status: pass
    human_judgment: false
  - id: D3
    description: Strict remote acceptance report with default 2,000 counts, 404 or 410 invalid routes, and explicit full-pass reruns.
    requirement: DELIVERY-02
    verification:
      - kind: unit
        ref: scripts/verify-ai-faq-routes.test.mjs#runs a complete remote acceptance report with 404 and 410 invalid routes
        status: pass
      - kind: unit
        ref: scripts/verify-ai-faq-routes.test.mjs#reports count-valid stale remote index membership fields and dead routes together
        status: pass
      - kind: e2e
        ref: npm run verify:ai-faq-routes -- https://sealos.io
        status: fail
    human_judgment: true
    rationale: Production currently serves the retained stale index baseline; Plan 32-04 owns same-SHA release evidence and a passing live rerun.

duration: 7 min
completed: 2026-08-04
status: complete
---

# Phase 32 Plan 03: Bounded Complete Remote Route Gate Summary

**The retained CLI now performs one deterministic eight-worker pass across the
remote index, sitemap, every page-index route, and both invalid-route probes.**

## Performance

- **Duration:** 7 min
- **Started:** 2026-08-04T00:06:52Z
- **Completed:** 2026-08-04T00:13:30Z
- **Tasks:** 2
- **Implementation files modified:** 2

## Accomplishments

- Replaced two-page remote sampling with complete index/sitemap ingestion and
  an eight-worker crawl of every valid page-index slug.
- Applied a 10,000 ms abort signal, manual redirects, zero retries, and one
  successful body read across index, sitemap, detail, and invalid probes.
- Added strict 2,000 acceptance, deterministic remote summaries, stale-index
  regression fixtures, and a fresh 2,004-request production readback.

## TDD Evidence

| Gate | Commit | Evidence |
| --- | --- | --- |
| Task 1 RED | `f95ee0ae12c99f9e733ec74cf7edade26081c013` | Import failed because the complete remote adapter export was absent. |
| Task 1 GREEN | `dceece732fe43d5fbb110b9c5bdd2488f5ead905` | 16 tests proved pool 8, timeout 10,000 ms, manual redirects, one attempt, one body read, and deterministic completion. |
| Task 2 RED | `81a6a6b7da8d616ce9417d6ba5adf03bc1bd391c` | The acceptance-count test found zero count findings for a short inventory. |
| Task 2 GREEN | `53908f96796f79133bf822b335df6d68c3f89bac` | 19 tests passed with default 2,000 acceptance, 404/410 probes, stale fixtures, and explicit full reruns. |

## Task Commits

1. **Task 1 RED: bounded remote crawl contract** - `f95ee0ae12c99f9e733ec74cf7edade26081c013`
2. **Task 1 GREEN: eight-worker remote adapter** - `dceece732fe43d5fbb110b9c5bdd2488f5ead905`
3. **Task 2 RED: strict acceptance contract** - `81a6a6b7da8d616ce9417d6ba5adf03bc1bd391c`
4. **Task 2 GREEN: complete remote acceptance** - `53908f96796f79133bf822b335df6d68c3f89bac`

## Automated Acceptance Evidence

| Check | Result |
| --- | --- |
| Route verifier tests | PASS: 19 tests. |
| Route plus pipeline suites | PASS: 28 tests. |
| Index suite | PASS: 82 tests. |
| Exact slug verifier | PASS: 2,000 slugs and 288 ambiguous groups. |
| Local route gate | PASS: four 2,000 inventories, 2,000 pages, 8,000 fields, 2/2 invalid routes. |
| TypeScript, syntax, Prettier | PASS under Node.js 20.20.0. |

### Fake Network Matrix

- 18 valid pages produced 22 requests: 2 data, 18 detail, and 2 invalid.
- Observed active request peak was exactly 8.
- Every option used `redirect: 'manual'` and a 10,000 ms signal.
- Every successful index, sitemap, and detail body was read exactly once.
- The mixed pass retained network 1, timeout 1, status 3, body 1, and identity
  1 while attempting every valid route once.
- Forward and reverse completion schedules produced byte-identical output.

## Fresh Production Readback

Command: `npm run verify:ai-faq-routes -- https://sealos.io`

UTC: `2026-08-04T00:11:43.923Z`; result: expected FAIL against the retained
stale production baseline.

| Property | Fresh result |
| --- | --- |
| Source/index/sitemap | 2,000 total and unique each |
| Direct HTTP 200 route inventory | 1,972 |
| HTTP histogram | 200=1,972; 404=30 |
| Route attempts | 2,000 |
| Identity pages/fields | 1,972 / 7,888, zero identity findings |
| Invalid routes | 2 attempted, 2 accepted as 404 |
| Source-only vs index | 28 |
| Index-only vs source | 28 |
| Source-only vs route | 28 |
| Index slug drift | 28 |
| Index description drift | 5 |
| Detail status failures | 28 x 404 |
| Network/timeout/body failures | 0 / 0 / 0 |

This fresh result confirms the plan-time stale shape and proves the remote gate
attempted all 2,000 index routes in one bounded pass.

## Execution Roles

The replacement performed executor, code reviewer, fixer gate, and closeout
sequentially through the generic-agent fallback. The reviewer re-read the
request boundary, worker scheduler, positional result collection, count gate,
and formatter output. The fixer gate received zero actionable findings. No
child thread was created or awaited.

## Files Created/Modified

- `scripts/verify-ai-faq-routes.mjs` - Remote request classifier, worker pool,
  complete adapter, and strict acceptance counts.
- `scripts/verify-ai-faq-routes.test.mjs` - Instrumented fake network,
  scheduling, failure taxonomy, stale fixture, and runner coverage.

## Decisions Made

- Index and sitemap requests run together before the detail pool begins.
- Detail response status 200 establishes route membership; readable body and
  source identity establish the four field checks independently.
- Status histogram covers detail and invalid routes, keeping the direct page
  count visible as 2,000 on accepted production.

## Deviations from Plan

None - planned remote surfaces and request bounds were implemented directly.

## Issues Encountered

The live target retains the documented stale deployed index. The verifier
returned status 1 with complete deterministic evidence, as required before the
Plan 32-04 release checkpoint.

## User Setup Required

None.

## Next Phase Readiness

Plan 32-04 can inspect the existing reviewed release path and workflow state,
then either capture exact same-SHA Vercel/Cloudflare success plus a passing live
rerun or record the mandatory blocked checkpoint with this fresh baseline.

## Self-Check: PASSED

---
*Phase: 32-sitemap-route-parity-and-production-verification*
*Completed: 2026-08-04*
