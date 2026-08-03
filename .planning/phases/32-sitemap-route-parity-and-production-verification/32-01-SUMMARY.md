---
phase: 32-sitemap-route-parity-and-production-verification
plan: "01"
subsystem: build-tooling
tags: [nodejs, esm, route-parity, html-identity, deterministic-diagnostics]

requires:
  - phase: 31-canonical-index-generation-and-local-parity
    provides: Canonical numeric source records and deterministic parity diagnostics.
provides:
  - Deterministic source, index, sitemap, and route inventory comparison.
  - Exact title, H1, description, and canonical identity extraction.
  - Import-safe injected runner with bounded English diagnostics and retained CLI contract.
affects: [32-02, 32-03, 32-04, ai-quick-reference, static-export]

tech-stack:
  added: []
  patterns:
    - Separate pure comparison and formatting from target I/O.
    - Sort findings by fixed category, numeric ID, slug, and field before rendering.

key-files:
  created:
    - scripts/verify-ai-faq-routes.test.mjs
  modified:
    - scripts/verify-ai-faq-routes.mjs

key-decisions:
  - "Every membership finding carries source, index, sitemap, and route presence facts."
  - "Logical HTML identity values are entity-decoded before exact comparison."
  - "The runner formats all category totals before selecting stdout, stderr, and status."

patterns-established:
  - "Use injected target inspection and streams for CLI tests without real filesystem or network access."
  - "Keep diagnostic totals complete while limiting rendered details to 20 per category."

requirements-completed: [PARITY-02, DELIVERY-02]

coverage:
  - id: D1
    description: Four-set inventory totals, duplicates, bidirectional membership, presence facts, and stable numeric ordering.
    requirement: PARITY-02
    verification:
      - kind: unit
        ref: scripts/verify-ai-faq-routes.test.mjs#reports duplicates and every directional inventory difference deterministically
        status: pass
    human_judgment: false
  - id: D2
    description: Exact generated-page title, nested H1, description, and canonical identity comparison.
    requirement: DELIVERY-02
    verification:
      - kind: unit
        ref: scripts/verify-ai-faq-routes.test.mjs#validates all page identity fields with nested markup and entities
        status: pass
      - kind: unit
        ref: scripts/verify-ai-faq-routes.test.mjs#reports missing duplicate and mismatched identity fields independently
        status: pass
    human_judgment: false
  - id: D3
    description: Import-safe retained CLI with complete fixed-category output and bounded escaped details.
    requirement: DELIVERY-02
    verification:
      - kind: unit
        ref: scripts/verify-ai-faq-routes.test.mjs#renders complete totals bounded escaped details and deterministic bytes
        status: pass
      - kind: integration
        ref: npm run verify:ai-faq-routes
        status: pass
    human_judgment: false

duration: 7 min
completed: 2026-08-04
status: complete
---

# Phase 32 Plan 01: Deterministic Route Verification Core Summary

**A deterministic four-set and four-identity report core now collects every
finding before returning one bounded English CLI result.**

## Performance

- **Duration:** 7 min
- **Started:** 2026-08-03T23:42:15Z
- **Completed:** 2026-08-03T23:49:15Z
- **Tasks:** 2
- **Implementation files modified:** 2

## Accomplishments

- Added stable source/index/sitemap/route inventories with total, unique,
  duplicate, directional, and four-set presence facts.
- Added order-independent HTML attribute parsing, nested text extraction, and
  entity decoding for title, H1, meta description, and canonical identity.
- Added fixed English category reports, first-20 JSON details, injected
  streams/time/inspection, and the retained `out` or HTTP(S) CLI contract.

## TDD Evidence

| Gate | Commit | Evidence |
| --- | --- | --- |
| Task 1 RED | `2f08310802cf67b42225b2696c3a9e569ce6c140` | Import failed because the deterministic inventory export was absent. |
| Task 1 GREEN | `238bac12b191c3fc3a66304d93a9ec2462452a04` | Four inventory/identity tests and syntax checks passed. |
| Task 2 RED | `d35e1205bcf45a39b364088336cbde374b505ac8` | Import failed because the planned report formatter export was absent. |
| Task 2 GREEN | `de6ec9d0b02cfe26602121c7a36a6c7bc78d10f6` | Nine route tests, syntax checks, formatting, and real `out` CLI smoke passed. |

## Task Commits

1. **Task 1 RED: inventory and identity contract** - `2f08310802cf67b42225b2696c3a9e569ce6c140`
2. **Task 1 GREEN: deterministic comparison core** - `238bac12b191c3fc3a66304d93a9ec2462452a04`
3. **Task 2 RED: report and runner contract** - `d35e1205bcf45a39b364088336cbde374b505ac8`
4. **Task 2 GREEN: bounded report runner** - `de6ec9d0b02cfe26602121c7a36a6c7bc78d10f6`

## Acceptance Evidence

| Command | Result |
| --- | --- |
| `node --test scripts/verify-ai-faq-routes.test.mjs` | PASS: 9 tests. |
| `npm run verify:ai-faq-routes` | PASS: four 2,000-entry inventories and zero findings at `out`. |
| `npm run test:ai-faq-index` | PASS: 82 tests. |
| `npm run test:ai-faq-slugs` | PASS: 2,000 exact slugs and 288 ambiguous groups. |
| Route plus pipeline suites | PASS: 17 tests. |
| `npm run lint` | PASS under Node.js 20.20.0. |
| `node --check` and Prettier | PASS. |

## Execution Roles

The user-designated replacement used the documented generic-agent fallback and
performed executor, test reviewer, and closeout roles sequentially inline.
Internal collaboration threads were unavailable by contract, so no child was
created or awaited. Task-level GREEN results received a fresh full-suite review
before summary creation.

## Files Created/Modified

- `scripts/verify-ai-faq-routes.mjs` - Pure comparisons, identity parser,
  formatter, target parser, runner, and guarded CLI.
- `scripts/verify-ai-faq-routes.test.mjs` - Inventory, identity, formatting,
  stream, target, stability, and package-command coverage.

## Decisions Made

- Membership details expose all four presence booleans for direct repair.
- Identity comparison uses decoded logical text while diagnostics retain
  JSON-safe expected and actual arrays.
- Category totals remain visible at zero to preserve a stable release record.

## Deviations from Plan

None - plan scope and public command contract were preserved.

## Issues Encountered

The first GREEN run exposed an expected-order assertion that disagreed with the
fixed category ordering. The test was corrected to the planned category-first,
numeric-ID ordering and the complete suite passed.

## User Setup Required

None.

## Next Phase Readiness

Plan 32-02 can replace the retained sampling adapter with complete local index,
sitemap, route enumeration, and 32-read batching while preserving the report
and CLI contracts.

## Self-Check: PASSED

---
*Phase: 32-sitemap-route-parity-and-production-verification*
*Completed: 2026-08-04*
