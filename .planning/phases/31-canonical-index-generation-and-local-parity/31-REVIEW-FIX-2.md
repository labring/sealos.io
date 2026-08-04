---
phase: 31-canonical-index-generation-and-local-parity
fixed_at: 2026-08-03T20:54:21Z
review_path: .planning/phases/31-canonical-index-generation-and-local-parity/31-REVIEW-POSTFIX.md
iteration: 2
findings_in_scope: 5
fixed: 5
skipped: 0
status: all_fixed
---

# Phase 31: Post-Fix Code Review Fix Report

**Fixed at:** 2026-08-03T20:54:21Z
**Source review:** `.planning/phases/31-canonical-index-generation-and-local-parity/31-REVIEW-POSTFIX.md`
**Iteration:** 2

**Summary:**

- Findings in scope: 5
- Fixed: 5
- Skipped: 0

## TDD Evidence

Each contract defect received a failing Node.js 20 regression before its
implementation change:

| Finding | RED commit | GREEN commit |
| --- | --- | --- |
| CR-01 | `28372a4` | `715f972` |
| CR-02 | `01d9465` | `33960ed` |
| CR-03 | `5a35af0` | `25ec9b1` |
| WR-01 | `807444a` | `be48233` |
| WR-02 | `1402b2e` | `23b921b` |

The controlled-cascade and deterministic-order regressions also strengthen the
WR-01 coverage contract. Commit `2dfce57` applies the repository formatting
rules after all GREEN changes.

## Fixed Issues

### CR-01: Ingestion failures escape the locked 16-category report

**Status:** fixed: requires human verification
**Files modified:** `scripts/ai-faq-index.mjs`, `scripts/verify-ai-faq-index.mjs`, `scripts/ai-faq-index.test.mjs`
**Commits:** `28372a4`, `715f972`, `2dfce57`
**Applied fix:** Source read and JSON failures now map to invalid source
projection schemas; index read and JSON failures map to invalid index projection
schemas; non-regular source entries map to malformed source identifiers. Stable
codes and fields retain the underlying failure type. The formatter emits only
the 16 exported category totals in their declared order.

### CR-02: Source ingestion corrupts membership and schema totals

**Status:** fixed: requires human verification
**Files modified:** `scripts/ai-faq-index.mjs`, `scripts/ai-faq-index.test.mjs`
**Commits:** `01d9465`, `33960ed`, `2dfce57`
**Applied fix:** Source continuity failures use the source identity bucket, and
membership totals come exclusively from set comparison. Parsed filename
identities survive content read and JSON failures with schema-invalid state, so
field and byte comparisons are suppressed while membership remains accurate.
Source fields use canonical names once, root directory failures gate derivative
comparisons, and serialization runs only after both sides pass validation.

### CR-03: Malformed source diagnostics depend on filesystem enumeration

**Status:** fixed: requires human verification
**Files modified:** `scripts/ai-faq-index.mjs`, `scripts/ai-faq-index.test.mjs`
**Commits:** `5a35af0`, `25ec9b1`, `2dfce57`
**Applied fix:** Every directory entry is ordered with an explicit code-unit
comparator before classification. Reversed filesystem enumeration now produces
byte-identical reports and identical first-detail ordering.

### WR-01: Regression tests codify the forbidden ingestion headings

**Status:** fixed
**Files modified:** `scripts/ai-faq-index.test.mjs`
**Commits:** `807444a`, `01d9465`, `5a35af0`, `be48233`, `2dfce57`
**Applied fix:** Tests extract every top-level `label: count` line and require
exact equality with the 16 exported labels in stable order. The production CLI
matrix now covers sparse sources, blank canonical fields, root read failures,
source and index ingestion failures, and reversed directory enumeration while
asserting the absence of derivative membership findings.

### WR-02: Index ingestion diagnostics label the index path as a source path

**Status:** fixed: requires human verification
**Files modified:** `scripts/ai-faq-index.mjs`, `scripts/verify-ai-faq-index.mjs`, `scripts/ai-faq-index.test.mjs`
**Commits:** `1402b2e`, `23b921b`
**Applied fix:** Structured report details now include `indexPath`. Index read
and JSON findings populate that field, while `sourcePath` remains exclusive to
canonical source files.

## Verification Evidence

All JavaScript gates used Node.js 20.20.2.

- `npm run test:ai-faq-index`: 82 passed, 0 failed.
- `node --test scripts/measure-build-pipeline.test.mjs`: 8 passed, 0 failed.
- `npm run verify:ai-faq-index`: 2,000 committed records verified.
- `npm run test:ai-faq-slugs`: 2,000 exact slugs verified; 288 ambiguous
  normalized groups rejected.
- `npm run lint`: passed after the production build generated `.source` types.
- Prettier check: all four review-scope scripts matched repository style.
- `node --check`: all four review-scope scripts passed.
- `npm run build`: compiled successfully and generated all 6,179 static pages.
- `npm run verify:ai-faq-routes`: verified 2,000 sitemap URLs, 2 collision pages,
  and unresolved route behavior after both builds.
- `npm run build:analyze`: exited successfully and generated all 6,179 static
  pages. The existing ESM analyzer loader reported `require is not defined` and
  skipped bundle chart generation.
- `git diff --check`: passed.
- The committed index stayed byte-identical at 790,830 bytes with SHA-256
  `b9d9373d897dcce3cfc142b3a347251f5e576b1e4f9a1710ba7bfb1e1c912484`.

## Remaining Risk

The four logic-oriented findings retain the required human-verification marker;
the next independent code review provides that check. Bundle chart generation
still depends on correcting the repository's existing ESM analyzer loader.
Hosted CI and Vercel evidence require a later pushed run.

---

_Fixed: 2026-08-03T20:54:21Z_
_Fixer: the agent (gsd-code-fixer)_
_Iteration: 2_
