---
phase: 31-canonical-index-generation-and-local-parity
plan: "01"
subsystem: build-tooling
tags: [nodejs, esm, canonical-json, parity, node-test]

requires:
  - phase: v1.4
    provides: Exact AI Quick Reference slug resolution and legacy source-wide verification seams.
provides:
  - Validated numeric source loading through deterministic 32-record read batches.
  - Exact four-field FAQ index projection and compact canonical serialization.
  - Bidirectional semantic and byte comparison with stable bounded diagnostics.
  - Legacy loadFAQPages and groupByNormalizedSlug compatibility.
affects: [31-02, 31-03, phase-32, ai-quick-reference]

tech-stack:
  added: []
  patterns:
    - Node.js built-in ESM domain functions with thin downstream CLI boundaries.
    - Structured findings separated from deterministic text formatting.

key-files:
  created:
    - scripts/ai-faq-index.mjs
    - scripts/ai-faq-index.test.mjs
  modified:
    - scripts/ai-faq-fixture.mjs

key-decisions:
  - "Canonical source identity comes from strict numeric filenames, and source reads run in sequential batches of 32."
  - "Parity aligns by numeric ID, compares exact slugs as fields, and checks relative order only across common valid unique records."
  - "Canonical-byte findings require a fully valid source set so validation errors do not create derivative serialization noise."

patterns-established:
  - "Validate first, project into fresh fixed-key objects, then serialize with compact JSON.stringify bytes."
  - "Return all 16 finding categories in fixed order and cap only formatted details at 20 per category."

requirements-completed: []

coverage:
  - id: D1
    description: Canonical source loading, four-field projection, and compact serialization for all 2,000 records.
    requirement: SOURCE-01
    verification:
      - kind: integration
        ref: scripts/ai-faq-index.test.mjs#the committed source corpus loads as 2,000 canonical numeric records
        status: pass
      - kind: unit
        ref: scripts/ai-faq-index.test.mjs#projection and serialization preserve fixed fields, values, and compact bytes
        status: pass
    human_judgment: false
  - id: D2
    description: Bidirectional semantic and canonical-byte parity with 16 stable diagnostic categories.
    requirement: PARITY-01
    verification:
      - kind: unit
        ref: scripts/ai-faq-index.test.mjs#compareFAQIndexRecords counts every parity finding category
        status: pass
      - kind: unit
        ref: scripts/ai-faq-index.test.mjs#formatFAQIndexReport emits stable totals and caps details at 20
        status: pass
    human_judgment: false
  - id: D3
    description: Existing exact-slug verification consumes the shared loader through the legacy fixture shape.
    requirement: SOURCE-02
    verification:
      - kind: integration
        ref: npm run test:ai-faq-slugs
        status: pass
    human_judgment: false

duration: 25 min
completed: 2026-08-03
status: complete
---

# Phase 31 Plan 01: Canonical FAQ Index Domain Summary

**Numeric source loading, fixed four-field projection, and 16-category source-to-index parity with deterministic bounded diagnostics**

## Performance

- **Duration:** 25 min
- **Started:** 2026-08-03T16:47:55Z
- **Completed:** 2026-08-03T17:12:44Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Loaded all canonical FAQ source files by numeric filename identity through sequential 32-record read batches with aggregate structured validation.
- Projected fresh `{ category, question, description, slug }` objects and serialized compact bytes ending at the closing bracket.
- Compared source and index records across all 16 locked categories while limiting ordering to common valid unique IDs and formatting at most 20 details per category.
- Preserved the established `loadFAQPages()` and `groupByNormalizedSlug()` API for the exact-slug and Phase 32 route verifiers.

## TDD Evidence

| Gate | Commit | Evidence |
| --- | --- | --- |
| Task 1 RED | `0fd532c` | Node 20 failed with `ERR_MODULE_NOT_FOUND` for the planned shared domain module. |
| Task 1 RED corpus | `577c2ac` | A committed-tree snapshot retained the same missing-module failure with the 2,000-record smoke present. |
| Task 1 GREEN | `c230942` | Loader, projection, serialization, and real-corpus tests passed. |
| Task 1 REFACTOR | `5480459` | The compatibility adapter delegated to the shared loader; both focused and legacy tests passed. |
| Task 2 RED | `283bec0` | Node 20 failed because the planned comparison category export was absent. |
| Task 2 GREEN | `4c7193a` | All semantic, ordering, formatting, and byte cases passed. |
| Controlled-cascade RED | `e767930` | The regression exposed one derivative byte finding for an invalid source identity. |
| Controlled-cascade GREEN | `787fca2` | Canonical-byte comparison now requires every source record to normalize. |
| Task 2 REFACTOR | `3b541f8` | Pure input normalization and report finalization retained all passing behavior. |

## Task Commits

1. **Task 1 RED: canonical source behaviors** - `0fd532c`
2. **Task 1 RED: complete-corpus smoke** - `577c2ac`
3. **Task 1 GREEN: canonical source domain** - `c230942`
4. **Task 1 REFACTOR: legacy fixture adapter** - `5480459`
5. **Task 2 RED: parity and report behaviors** - `283bec0`
6. **Task 2 GREEN: parity comparison and formatting** - `4c7193a`
7. **Task 2 regression RED: invalid-source byte cascade** - `e767930`
8. **Task 2 regression GREEN: cascade suppression** - `787fca2`
9. **Task 2 REFACTOR: pure report boundaries** - `3b541f8`

## Verification

All acceptance commands used the repository-pinned Node.js 20 runtime at `/Users/longnv/.nvm/versions/node/v20.20.0/bin`.

| Command | Result |
| --- | --- |
| `node --test scripts/ai-faq-index.test.mjs` | PASS: 34 tests, 0 failures, including the read-only 2,000-record smoke. |
| `npm run test:ai-faq-slugs` | PASS: 2,000 exact slugs verified and 288 ambiguous normalized groups rejected. |
| `node --check scripts/ai-faq-index.mjs` | PASS. |
| `git diff --check` | PASS. |

### Fixture Coverage

| Boundary | Covered mutations |
| --- | --- |
| Source identity | Unordered enumeration, malformed names, duplicate IDs, duplicate full slugs, missing IDs, and non-regular entries. |
| Source content | Invalid JSON plus blank, whitespace-only, null, and preserved-whitespace projection values. |
| Index semantics | Malformed identifiers, invalid schemas, duplicate IDs/slugs, source-only/index-only IDs, ordering, and four field drifts. |
| Serialization | Compact fixed-key bytes, trailing newline drift, semantic equality with byte inequality, and invalid-source cascade suppression. |
| Diagnostics | Fixed 16-category order, complete totals, one-based positions, JSON-stringified values, and a 20-detail cap over 21 findings. |

### Full-Corpus Result

The shared Node 20 smoke loaded 2,000 contiguous IDs. Comparison against the pre-generation committed index produced the planned baseline: 28 slug drifts, five description drifts, one canonical-byte drift, zero ordering drift, and zero findings in the other 12 categories. Plan 31-02 owns regeneration of the committed asset.

## Files Created/Modified

- `scripts/ai-faq-index.mjs` - Canonical loading, validation, projection, serialization, comparison, and formatting domain.
- `scripts/ai-faq-index.test.mjs` - Isolated fixtures, complete finding matrix, diagnostic-cap coverage, and 2,000-record smoke.
- `scripts/ai-faq-fixture.mjs` - Compatibility adapter backed by the shared validated loader.

## Decisions Made

- Used strict filename parsing as the only source ID authority and retained filename tie-breaking for deterministic duplicate diagnostics.
- Preserved raw source strings after whitespace-aware validation so canonical output reflects source bytes exactly.
- Limited membership, ordering, and field cascades to independently valid comparison boundaries while retaining complete category totals.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Corrected a patch target outside the mandated worktree**
- **Found during:** Task 1 GREEN
- **Issue:** One relative patch resolved against the session root and created `scripts/ai-faq-index.mjs` outside the execution worktree.
- **Fix:** Verified absolute worktree containment, removed the exact file created by this run, and recreated the module under the mandated worktree.
- **Files modified:** `scripts/ai-faq-index.mjs`
- **Verification:** The external path is absent; all task commits contain only worktree paths.
- **Committed in:** Resolved before `c230942`.

**2. [Rule 1 - Bug] Suppressed serialization noise after source identity failure**
- **Found during:** Task 2 REFACTOR review
- **Issue:** Removed malformed source records left a valid-looking empty normalized set, creating a derivative byte finding.
- **Fix:** Required normalized source count to equal the original source count before canonical-byte comparison.
- **Files modified:** `scripts/ai-faq-index.mjs`, `scripts/ai-faq-index.test.mjs`
- **Verification:** The regression failed before the fix and all 34 tests passed after it.
- **Committed in:** `e767930`, `787fca2`

**Total deviations:** 2 auto-fixed (1 blocking issue, 1 implementation bug). **Impact:** Both corrections preserve the plan boundary and deterministic diagnostics.

## Issues Encountered

The local dependency tree is absent, so the repository Prettier binary was unavailable. This plan uses Node built-ins only; Node 20 syntax checks, focused tests, legacy compatibility tests, and `git diff --check` all passed without installing packages.

## User Setup Required

None - the shared domain uses repository files and Node.js built-ins only.

## Next Phase Readiness

- Plan 31-02 can call `loadCanonicalFAQSource()` and `serializeCanonicalFAQIndex()` to publish the canonical asset atomically.
- Plan 31-03 can call `compareFAQIndexRecords()` and `formatFAQIndexReport()` from a read-only CLI and build preflight.
- The current 28 slug and five description drifts remain the planned Plan 31-02 regeneration input.

## Self-Check: PASSED

- All three implementation artifacts and this summary exist in the mandated worktree.
- All nine RED, GREEN, fix, and REFACTOR commits resolve in Git history.
- Coverage classification reports three automated deliverables with passing evidence and zero schema errors.
- Final Node 20 tests, legacy compatibility verification, corpus smoke, and `git diff --check` passed.

---
*Phase: 31-canonical-index-generation-and-local-parity*
*Completed: 2026-08-03*
