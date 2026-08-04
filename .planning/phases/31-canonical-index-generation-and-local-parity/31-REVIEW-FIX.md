---
phase: 31-canonical-index-generation-and-local-parity
fixed_at: 2026-08-04T04:04:43+08:00
review_path: .planning/phases/31-canonical-index-generation-and-local-parity/31-REVIEW.md
iteration: 1
findings_in_scope: 6
fixed: 6
skipped: 0
status: all_fixed
---

# Phase 31: Code Review Fix Report

**Fixed at:** 2026-08-04T04:04:43+08:00
**Source review:** `.planning/phases/31-canonical-index-generation-and-local-parity/31-REVIEW.md`
**Iteration:** 1

## TDD Evidence

The regression suite was extended before implementation. Commit `2347407`
recorded RED: Node.js 20 failed during module loading because
`inspectCanonicalFAQSource` did not exist. The GREEN implementation and the
follow-up regression hardening are recorded in `c6b4177`, `64cf62b`, and
`2c03f2e`.

## Fixed Issues

### CR-01: Lossy UTF-8 decoding defeats source validation and byte parity

**Files modified:** `scripts/ai-faq-index.mjs`, `scripts/verify-ai-faq-index.mjs`, `scripts/ai-faq-index.test.mjs`
**Commits:** `c6b4177`, `2c03f2e`
**Applied fix:** Source and index JSON now decode through a fatal UTF-8
`TextDecoder`. The verifier keeps the index as a raw `Buffer` and compares
canonical bytes with `Buffer.equals`, while invalid index bytes stop semantic
and derivative serialization checks.

### CR-02: Ingestion failures bypass the required structured report

**Files modified:** `scripts/ai-faq-index.mjs`, `scripts/verify-ai-faq-index.mjs`, `scripts/generate-ai-faq-index.mjs`, `scripts/ai-faq-index.test.mjs`
**Commit:** `c6b4177`
**Applied fix:** `inspectCanonicalFAQSource` returns records and structured
findings without throwing. Verifier and generator failures use the shared
formatter, preserving source paths, IDs, fields, expected values, actual
values, and system error codes through the stable 16-category report.

### WR-01: Summary-stream failure was reported as failed publication

**Files modified:** `scripts/generate-ai-faq-index.mjs`, `scripts/ai-faq-index.test.mjs`
**Commit:** `c6b4177`
**Applied fix:** Publication is marked complete immediately after rename.
Summary output is handled independently and reports that generation succeeded
when the injected stdout stream throws; the generator returns status 0.

### WR-02: Filesystem read failures were mislabeled as invalid JSON

**Files modified:** `scripts/ai-faq-index.mjs`, `scripts/verify-ai-faq-index.mjs`, `scripts/ai-faq-index.test.mjs`
**Commit:** `c6b4177`
**Applied fix:** Source read errors and JSON/UTF-8 decoding errors have separate
structured finding categories. Read failures preserve the path and system
error code, and parsing is attempted only after a successful byte read.

### WR-03: Filename tie-breaking depended on the process locale

**Files modified:** `scripts/ai-faq-index.mjs`, `scripts/ai-faq-index.test.mjs`
**Commit:** `c6b4177`
**Applied fix:** Duplicate source records use explicit code-unit filename
comparison, producing the same order across ICU locale settings.

### WR-04: The regression matrix omitted failing ingestion boundaries

**Files modified:** `scripts/ai-faq-index.test.mjs`
**Commit:** `64cf62b`
**Applied fix:** Added Node.js 20 production CLI subprocess coverage for
malformed filenames, sparse and duplicate source IDs, unreadable source files,
invalid UTF-8 source bytes, invalid index JSON, and invalid UTF-8 index bytes.
The matrix asserts status 1, structured diagnostics, regeneration guidance,
and unchanged index bytes. Existing direct tests cover the post-rename stdout
failure and raw canonical byte boundary.

## Verification Evidence

- `npm run test:ai-faq-index`: 72 passed, 0 failed.
- `node --test scripts/measure-build-pipeline.test.mjs`: 8 passed, 0 failed.
- `npm run test:ai-faq-slugs`: 2,000 exact slugs verified; 288 ambiguous
  normalized groups rejected.
- `npm run verify:ai-faq-routes`: sitemap 2,000 URLs, 2 collision pages, and
  unresolved routes verified at `out`.
- `npm run lint`: passed with the repository Node.js 20 runtime.
- Prettier check: all changed implementation and test files matched.
- `node --check`: all changed JavaScript and ESM files passed.
- `git diff --check`: passed.
- Read-only verifier smoke: status remained clean, index SHA-256 remained
  `b9d9373d897dcce3cfc142b3a347251f5e576b1e4f9a1710ba7bfb1e1c912484`, and
  index size remained 790,830 bytes.

## Remaining Risk

Phase 31's existing Node.js 20 production and analyzer build evidence remains
valid because package and timed-build wiring were unchanged by this review fix.
Current-commit hosted CI and Vercel logs still require a later pushed run and
remain outside this local no-push execution.

---

_Fixed: 2026-08-04T04:04:43+08:00_
_Fixer: the agent (gsd-code-fixer)_
_Iteration: 1_
