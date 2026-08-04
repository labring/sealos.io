---
phase: 32-sitemap-route-parity-and-production-verification
plan: "02"
subsystem: build-tooling
tags: [nodejs, static-export, filesystem, bounded-io, route-parity]

requires:
  - phase: 32-01
    provides: Deterministic four-set comparison, identity parser, formatter, and injected runner.
provides:
  - Complete local source, index, sitemap, and readable-route inspection.
  - Batch-32 static page reads with all-page identity and invalid-route checks.
  - Post-normalization route parity in package and timed static builds.
affects: [32-03, 32-04, static-export, cloudflare-build, docker-build]

tech-stack:
  added: []
  patterns:
    - Enumerate immediate route directories and admit only readable index.html files to route membership.
    - Read static pages in deterministic batches of 32 and inspect each successful body once.

key-files:
  created: []
  modified:
    - scripts/verify-ai-faq-routes.mjs
    - scripts/verify-ai-faq-routes.test.mjs
    - package.json
    - scripts/measure-build-pipeline.js
    - scripts/measure-build-pipeline.test.mjs
    - scripts/ai-faq-index.test.mjs

key-decisions:
  - "Local route membership contains immediate directories whose index.html file was read successfully."
  - "Index identities align to canonical source records by numeric slug ID while membership remains exact by full slug."
  - "Package and timed route gates execute after root-locale normalization and before any timed post-build diff guard."

patterns-established:
  - "Continue local inspection after ingestion, route-read, and identity findings so one run retains complete totals."
  - "Record local missing paths as 404-style results while preserving filesystem failures as independent findings."

requirements-completed: [PARITY-02]

coverage:
  - id: D1
    description: Complete local four-set parity and four-field identity inspection across every generated FAQ page.
    requirement: PARITY-02
    verification:
      - kind: unit
        ref: scripts/verify-ai-faq-routes.test.mjs#inspects every local page in deterministic batches of at most 32
        status: pass
      - kind: integration
        ref: npm run verify:ai-faq-routes
        status: pass
    human_judgment: false
  - id: D2
    description: Structured local ingestion, duplicate, membership, read, identity, and invalid-route failure coverage.
    requirement: PARITY-02
    verification:
      - kind: unit
        ref: scripts/verify-ai-faq-routes.test.mjs#collects local ingestion membership read identity and invalid-route findings
        status: pass
      - kind: unit
        ref: scripts/verify-ai-faq-routes.test.mjs#reports malformed local index and sitemap data structurally
        status: pass
    human_judgment: false
  - id: D3
    description: Standard, analyzer, and timed static builds execute route parity after normalized output exists.
    requirement: PARITY-02
    verification:
      - kind: unit
        ref: scripts/measure-build-pipeline.test.mjs#runPipeline stops after failed route parity before the post-build guard
        status: pass
      - kind: integration
        ref: npm run build
        status: pass
      - kind: integration
        ref: npm run build:analyze
        status: pass
    human_judgment: false

duration: 11 min
completed: 2026-08-04
status: complete
---

# Phase 32 Plan 02: Complete Local Static Route Gate Summary

**Every local FAQ index route now participates in batch-bounded static HTML,
identity, inventory, and invalid-route verification after each static build.**

## Performance

- **Duration:** 11 min
- **Started:** 2026-08-03T23:53:00Z
- **Completed:** 2026-08-04T00:04:00Z
- **Tasks:** 2
- **Implementation files modified:** 6

## Accomplishments

- Loaded the built index and sitemap, enumerated immediate route directories,
  and admitted only readable static pages to exact four-set membership.
- Inspected every page-index candidate in deterministic batches capped at 32,
  with title, H1, description, canonical, index-field, and invalid-route facts.
- Added the retained route command after normalization in package build,
  analyzer build, and both corresponding timed stage lists.

## TDD Evidence

| Gate | Commit | Evidence |
| --- | --- | --- |
| Task 1 RED | `09a38c97f2b045054a95e5428de91cd088950adb` | Import failed because `inspectLocalFAQTarget` was absent. |
| Task 1 GREEN | `37e99e7351bfda28c104ce7d6ddf8aa2f9de3a75` | 12 focused tests and a real 2,000-route `out` run passed. |
| Task 2 RED | `b6b9a602d051d16227e926b753aa0be970ea3b2d` | Four package/stage tests failed on the missing post-normalization route gate. |
| Task 2 GREEN | `911cf5956c3c151cbb243c5bd9a86a1ad620e1c3` | 21 route/pipeline tests passed with exact stage order and fail-fast status. |
| Review fix | `924227d65fda959f6cdad49f50b21af16e62f821` | The inherited Phase 31 package-string assertion was synchronized; all 82 index tests passed. |

## Task Commits

1. **Task 1 RED: local adapter contract** - `09a38c97f2b045054a95e5428de91cd088950adb`
2. **Task 1 GREEN: complete local inspection** - `37e99e7351bfda28c104ce7d6ddf8aa2f9de3a75`
3. **Task 2 RED: build-stage contract** - `b6b9a602d051d16227e926b753aa0be970ea3b2d`
4. **Task 2 GREEN: post-normalization build gate** - `911cf5956c3c151cbb243c5bd9a86a1ad620e1c3`
5. **Review fix: inherited package assertion** - `924227d65fda959f6cdad49f50b21af16e62f821`

## Local Acceptance Evidence

Every accepted command used Node.js 20.20.0.

| Property | Standard build | Analyzer build |
| --- | --- | --- |
| Static pages | 6,179 | 6,179 |
| Route report UTC | 2026-08-04T00:00:58.117Z | 2026-08-04T00:02:43.580Z |
| Source/index/sitemap/route | 2,000 unique each | 2,000 unique each |
| Direct local page status | 2,000 x 200 | 2,000 x 200 |
| Identity fields | 8,000 checked, 0 findings | 8,000 checked, 0 findings |
| Invalid routes | 2 attempted, 2 accepted | 2 attempted, 2 accepted |
| Result | PASS | PASS |

## Regression Evidence

| Command | Result |
| --- | --- |
| `npm run test:ai-faq-index` | PASS: 82 tests. |
| `npm run test:ai-faq-slugs` | PASS: 2,000 exact slugs and 288 ambiguous groups. |
| Route plus pipeline suites | PASS: 21 tests. |
| `npm run lint` | PASS. |
| `npm run build` | PASS: fresh post-normalization 2,000-route gate. |
| `npm run build:analyze` | PASS: fresh post-normalization 2,000-route gate. |
| Prettier and `git diff --check` | PASS. |

## Execution Roles

The replacement executed the generic-agent executor, code reviewer, fixer, and
closeout roles sequentially inline. The code-review pass inspected the complete
32-02 diff, found the stale inherited package-string assertion through the full
suite, applied the focused fix, and repeated every acceptance command. No child
thread was created or awaited.

## Files Created/Modified

- `scripts/verify-ai-faq-routes.mjs` - Complete local target adapter and
  deterministic batch processing.
- `scripts/verify-ai-faq-routes.test.mjs` - Temporary filesystem, concurrency,
  ingestion, membership, identity, and invalid-route fixtures.
- `package.json` - Standard and analyzer post-normalization route gates.
- `scripts/measure-build-pipeline.js` - Equivalent timed route stages.
- `scripts/measure-build-pipeline.test.mjs` - Exact order and failure stop.
- `scripts/ai-faq-index.test.mjs` - Updated inherited complete build contract.

## Decisions Made

- Local HTML is read once during directory enumeration and reused for identity
  checks.
- Duplicate index slugs retain duplicate findings while route work is deduped
  by exact slug.
- Workflow definitions and generated output remained read-only acceptance
  surfaces.

## Deviations from Plan

### Auto-fixed Issues

**1. Inherited exact build-string assertion**

- **Found during:** Wave-boundary full test suite.
- **Issue:** The Phase 31 test encoded the previous build tail exactly.
- **Fix:** Appended the planned route command to both expected strings.
- **Files modified:** `scripts/ai-faq-index.test.mjs`.
- **Verification:** 82 index tests and both static builds passed.
- **Committed in:** `924227d65fda959f6cdad49f50b21af16e62f821`.

**Total deviations:** 1 auto-fixed compatibility assertion.
**Impact on plan:** The fix directly preserves the combined Phase 31 and Phase
32 build contract.

## Issues Encountered

The analyzer path emitted its existing `require is not defined` warning and
continued through a successful 6,179-page export and route gate. This warning
belongs to the pre-existing analyzer configuration and did not affect Phase 32
acceptance.

## User Setup Required

None.

## Next Phase Readiness

Plan 32-03 can replace the remote sampling adapter with an eight-worker,
10-second-timeout, zero-retry complete crawl while reusing the accepted report
and comparison core.

## Self-Check: PASSED

---
*Phase: 32-sitemap-route-parity-and-production-verification*
*Completed: 2026-08-04*
