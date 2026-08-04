---
phase: 31-canonical-index-generation-and-local-parity
plan: "02"
subsystem: build-tooling
tags: [nodejs, esm, atomic-write, canonical-json, node-test]

requires:
  - phase: 31-01
    provides: Validated canonical source loading, fixed-field projection, compact serialization, and parity comparison.
provides:
  - Atomic source-to-index generation through one destination-sibling rename.
  - Deterministic canonical public/ai-faqs.en.json bytes for all 2,000 source records.
  - Injected validation, write, rename, and cleanup failure coverage.
  - Legacy exact-slug verification compatibility after canonical regeneration.
affects: [31-03, phase-32, faq-search, ai-quick-reference]

tech-stack:
  added: []
  patterns:
    - Validate and serialize the complete source corpus before opening an owned temporary file.
    - Publish through an exclusive destination-sibling temporary file and one atomic rename.

key-files:
  created:
    - scripts/generate-ai-faq-index.mjs
  modified:
    - scripts/ai-faq-index.test.mjs
    - public/ai-faqs.en.json

key-decisions:
  - "The generator validates and serializes the full canonical source set before creating publication state."
  - "Temporary output uses a UUID-bearing destination sibling with wx creation, followed by one same-directory rename."
  - "Failure cleanup removes only the exact owned temporary path and keeps the publication failure as the primary error."
  - "The committed client asset uses compact fixed-field bytes in numeric source ID order."

patterns-established:
  - "Inject filesystem, paths, and streams at the CLI boundary so atomic publication behavior is testable without mutating repository files."
  - "Treat canonical source records and compact serializer output as the complete page-index authority."

requirements-completed: [SOURCE-01, SOURCE-02]

coverage:
  - id: D1
    description: Stable atomic generator from the validated canonical source set to the public client asset.
    requirement: SOURCE-01
    verification:
      - kind: unit
        ref: scripts/ai-faq-index.test.mjs#runGenerateFAQIndex publishes deterministic bytes through one sibling rename
        status: pass
      - kind: unit
        ref: scripts/ai-faq-index.test.mjs#runGenerateFAQIndex cleans its exact temporary path after write or rename failure
        status: pass
      - kind: integration
        ref: scripts/generate-ai-faq-index.mjs
        status: pass
    human_judgment: false
  - id: D2
    description: Canonical 2,000-record client asset with corrected source fields, numeric order, fixed keys, and byte parity.
    requirement: SOURCE-02
    verification:
      - kind: integration
        ref: scripts/ai-faq-index.test.mjs#the committed FAQ index matches all 2,000 canonical source records and bytes
        status: pass
      - kind: integration
        ref: scripts/verify-ai-faq-slugs.mjs
        status: pass
    human_judgment: false

duration: 27 min
completed: 2026-08-04
status: complete
---

# Phase 31 Plan 02: Atomic Canonical FAQ Index Generation Summary

Verified artifacts: `scripts/generate-ai-faq-index.mjs`,
`scripts/ai-faq-index.test.mjs`, and `public/ai-faqs.en.json`.

**Atomic generation now publishes deterministic compact bytes for all 2,000
canonical FAQ source records while preserving the established client and legacy
slug-verifier contracts.**

## Performance

- **Duration:** 27 min
- **Started:** 2026-08-03T17:42:22Z
- **Completed:** 2026-08-03T18:08:51Z
- **Tasks:** 2
- **Implementation files modified:** 3

## Accomplishments

- Added a stable `generateFAQIndex()` boundary that loads and serializes the
  complete canonical source collection before publication.
- Published through one UUID-bearing destination-sibling temporary file opened
  with `wx`, then one same-directory rename.
- Preserved destination bytes and removed the exact owned temporary file across
  validation, write, and rename failures while retaining the publication error
  when cleanup also fails.
- Regenerated `public/ai-faqs.en.json` with 28 canonical slug corrections, five
  canonical description corrections, numeric ID order, fixed field order, and
  compact bytes ending at the closing bracket.
- Preserved the legacy verifier result for 2,000 exact slugs and 288 rejected
  ambiguous normalized groups.

## TDD Evidence

| Gate | Commit | Evidence |
| --- | --- | --- |
| Task 1 RED | `2858374fc17471f2eef488d686d3cf28fc0d1e76` | Node 20 failed with `ERR_MODULE_NOT_FOUND` for the planned generator module. |
| Task 1 GREEN | `44b34ba92439b52325eee951197796e4875ada2e` | Atomic publication and injected failure tests passed: 40 tests, 0 failures. |
| Task 2 RED | `1ab0ecef28155434b8f44501cb3f80bac19bd308` | Full-corpus assertion reported 28 slug drifts, five description drifts, and one canonical serialization drift. |
| Task 2 GREEN | `92b6faf2d6e60823a788b21e585ab1f10f9a6a8e` | Canonical asset and full-corpus parity passed: 41 tests, 0 failures. |
| REFACTOR | `78a5bc23398f2acd7bf56f52d74f78f80350728f` | The planned `generateFAQIndex` key link is explicit while the tested CLI alias remains stable. |

## Task Commits

1. **Task 1 RED: atomic generation contract** - `2858374fc17471f2eef488d686d3cf28fc0d1e76`
2. **Task 1 GREEN: atomic generator implementation** - `44b34ba92439b52325eee951197796e4875ada2e`
3. **Task 2 RED: canonical full-corpus contract** - `1ab0ecef28155434b8f44501cb3f80bac19bd308`
4. **Task 2 GREEN: canonical client asset** - `92b6faf2d6e60823a788b21e585ab1f10f9a6a8e`
5. **REFACTOR: explicit generator boundary** - `78a5bc23398f2acd7bf56f52d74f78f80350728f`

## Acceptance Evidence

Every Node command used `/Users/longnv/.nvm/versions/node/v20.20.0/bin/node`
and reported Node.js 20.20.0.

| Command | Result |
| --- | --- |
| `node --test scripts/ai-faq-index.test.mjs` | PASS: 41 tests, 0 failures. |
| `node scripts/generate-ai-faq-index.mjs` | PASS: generated 2,000 records and 790,830 bytes. |
| `node scripts/verify-ai-faq-slugs.mjs` | PASS: 2,000 exact slugs verified; 288 ambiguous normalized groups rejected. |
| `node --check scripts/generate-ai-faq-index.mjs` | PASS. |
| `prettier --check scripts/generate-ai-faq-index.mjs scripts/ai-faq-index.test.mjs` | PASS. |
| `git diff --check` | PASS. |

### Determinism And Publication Evidence

- Two independent temporary destinations generated byte-identical output.
- Both outputs were 790,830 bytes with SHA-256
  `b9d9373d897dcce3cfc142b3a347251f5e576b1e4f9a1710ba7bfb1e1c912484`.
- The tracked generator replay left `public/ai-faqs.en.json` byte-identical to
  its committed form.
- Validation failure performed zero filesystem publication calls.
- Injected write and rename failures retained destination bytes and removed the
  exact owned temporary path.
- Injected cleanup failure retained the original publication error and attached
  cleanup context.
- Final owned temporary file inventory: `[]`.

### Canonical Corpus Evidence

| Property | Result |
| --- | --- |
| Source records | 2,000 |
| Output records | 2,000 |
| Output bytes | 790,830 |
| Numeric ID order | PASS |
| Fixed field order | `category`, `question`, `description`, `slug` |
| Trailing newline | `false` |
| Canonical byte equality | PASS |
| Semantic and byte findings | 0 |
| Source-derived changes | 28 slugs, 5 descriptions |
| Category changes | 0 |
| Question changes | 0 |

## Files Created/Modified

- `scripts/generate-ai-faq-index.mjs` - Atomic generator with injected
  filesystem, paths, streams, and expected source count.
- `scripts/ai-faq-index.test.mjs` - Determinism, publication failure, cleanup,
  and complete-corpus behavior coverage.
- `public/ai-faqs.en.json` - Canonical compact client asset regenerated from all
  2,000 source files.

## Decisions Made

- Completed full source validation and canonical serialization before creating
  a temporary file so invalid input cannot create publication state.
- Used an exclusive UUID-bearing sibling temporary file and one rename so the
  destination observes complete old or complete new bytes.
- Scoped cleanup to the exact path created by the current invocation and kept
  publication failures primary when cleanup also reports an error.
- Exposed `generateFAQIndex()` as the stable atomic core while preserving
  `runGenerateFAQIndex` as the existing test and CLI boundary.

## Deviations from Plan

None - the plan executed exactly as written.

## Issues Encountered

- The shell defaulted to Node.js 24.13.0. Every runtime, test, syntax, and
  evidence command used the pinned Node.js 20.20.0 executable explicitly.
- Execute-phase initialization normalized the phase label and reset the current
  plan position. Registered GSD state handlers restored the canonical label and
  advanced tracking to the next plan during closeout.

## User Setup Required

None - generation uses repository files and Node.js built-ins.

## Next Phase Readiness

- Plan 31-03 can expose this generator through package scripts and add the
  read-only parity preflight to build and timed static-export paths.
- Phase 32 retains sitemap and deployed-route parity ownership.
- Power-loss durability beyond same-filesystem rename remains outside D-04.

## Self-Check: PASSED

- All three implementation artifacts and this summary exist in the mandated
  worktree.
- All five RED, GREEN, and REFACTOR commits resolve in branch history.
- Node 20 focused tests, syntax validation, legacy slug verification, complete
  corpus parity, byte determinism, Prettier, and `git diff --check` passed.
- The output contains 2,000 records, 790,830 bytes, zero parity findings, and
  zero owned temporary files.

---
*Phase: 31-canonical-index-generation-and-local-parity*
*Completed: 2026-08-04*
