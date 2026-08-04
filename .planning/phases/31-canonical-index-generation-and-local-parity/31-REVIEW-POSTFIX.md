---
phase: 31-canonical-index-generation-and-local-parity
reviewed: 2026-08-03T20:19:10Z
depth: standard
diff_base: fbf36a0
files_reviewed: 4
files_reviewed_list:
  - scripts/ai-faq-index.mjs
  - scripts/ai-faq-index.test.mjs
  - scripts/generate-ai-faq-index.mjs
  - scripts/verify-ai-faq-index.mjs
findings:
  critical: 3
  warning: 2
  info: 0
  total: 5
status: issues_found
---

# Phase 31: Post-Fix Code Review Report

**Reviewed:** 2026-08-03T20:19:10Z
**Depth:** standard
**Diff:** `fbf36a0..fc7d091`
**Files Reviewed:** 4
**Status:** issues_found

## Critical Issues

### CR-01: Ingestion failures escape the locked 16-category report

**Classification:** BLOCKER

**File:** `scripts/ai-faq-index.mjs:61-68`,
`scripts/ai-faq-index.mjs:433-445`,
`scripts/ai-faq-index.mjs:938-980`

**Issue:** The source bucket map omits `source-read-failure`,
`invalid-source-json`, and `non-regular-source-entry`; index findings are never
mapped into buckets. `formatIngestionFindings()` consequently prints standalone
totals before the 16 fixed D-06 totals. An invalid source JSON fixture prints
`invalid source JSON: 1` while `invalid source projection schemas` remains zero;
invalid index JSON does the same with `invalid index JSON` and the index schema
bucket. These are 17-category operator reports and directly violate the locked
D-06/D-07 contract. CR-02 from the original review therefore remains only
partially fixed: details now reach the formatter under the wrong top-level
taxonomy.

**Fix:** Replace the one-sided map with an exhaustive side-aware mapping.
Route source read/JSON failures into `invalid-source-projection-schemas`, index
read/JSON failures into `invalid-index-projection-schemas`, and non-regular
source entries into `malformed-source-identifiers`. Preserve the distinction in
stable `code` and `field` values. Remove standalone ingestion headings from the
formatter so every failure report exposes exactly the 16 exported category
totals in their declared order.

### CR-02: Source ingestion corrupts membership and schema totals

**Classification:** BLOCKER

**File:** `scripts/ai-faq-index.mjs:61-68`,
`scripts/ai-faq-index.mjs:490-531`,
`scripts/ai-faq-index.mjs:896-923`

**Issue:** Three controlled-cascade paths produce false totals:

1. `missing-source-id` is mapped to `source-only-ids`, even though a source gap
   with a matching index record is an index-only condition. The normal
   membership pass then also emits `index-only-ids`, so one removed source file
   reports both totals as 1.
2. A source record with a read or JSON error is removed from the normalized
   identity set. Its valid filename identity is already known, yet the matching
   index record is falsely reported as index-only. A two-record fixture with
   invalid JSON only at ID 1 produced `index-only IDs: 1`.
3. A blank source `title` is reported once by source inspection as `title` and
   again by normalization as `question`. One invalid input therefore produces
   `invalid source projection schemas: 2`.

These false positives break D-05 alignment, D-06 classification, D-07 complete
totals, and the controlled-cascade design in 31-RESEARCH.md.

**Fix:** Map source continuity failures to the source-identity/schema bucket.
Reserve source-only and index-only totals for the set comparison. Keep parsed
ID/slug identities in the grouping maps when
content ingestion fails, mark those records schema-invalid, and suppress field
and byte comparisons for them. Gate cross-set comparisons when source directory
enumeration itself fails. Normalize source field names once, or deduplicate the
inspection and comparison schema findings using the same canonical field name.

### CR-03: Malformed source diagnostics depend on filesystem enumeration

**Classification:** BLOCKER

**File:** `scripts/ai-faq-index.mjs:332-366`

**Issue:** Valid source entries are sorted after parsing, while malformed and
non-regular entries are appended in raw `readdir()` order. Node does not
guarantee directory enumeration order. Injecting the same malformed entries as
`[z.bad, a.bad]` and `[a.bad, z.bad]` produced different formatted reports and
reversed first-detail order. This violates D-07 and the research requirement
that output remain stable independent of filesystem enumeration.

**Fix:** Apply an explicit code-unit ordering to all directory entries before
classification, or sort every finalized bucket with a stable comparator over
ID, positions, path, field, expected value, and actual value. Add a reversed
enumeration regression that requires byte-identical reports.

## Warnings

### WR-01: Regression tests codify the forbidden ingestion headings

**Classification:** WARNING

**File:** `scripts/ai-faq-index.test.mjs:340`,
`scripts/ai-faq-index.test.mjs:368-390`,
`scripts/ai-faq-index.test.mjs:901-995`

**Issue:** The new production-boundary tests explicitly require `source read
failures`, `invalid source JSON`, and `invalid index JSON` headings. The stale
fixture test verifies the presence of all 16 labels and leaves top-level label
completeness unchecked. The suite therefore passes while CR-01 is
present. It also omits negative assertions for the false membership and doubled
schema totals in CR-02.

**Fix:** Extract every top-level `label: count` line and assert exact equality
with the 16 exported labels in stable order. For ingestion fixtures, assert the
appropriate source/index schema bucket, the `$read` or `$json` field and error
code, and zero derivative membership findings. Add sparse-source, blank-field,
root-read-failure, and reversed-directory-enumeration counterexamples.

### WR-02: Index ingestion diagnostics label the index path as a source path

**Classification:** WARNING

**File:** `scripts/verify-ai-faq-index.mjs:33-41`,
`scripts/verify-ai-faq-index.mjs:57-65`

**Issue:** Both index read and index JSON findings store `indexPath` under the
`sourcePath` key. The report therefore tells operators that
`public/ai-faqs.en.json` is a source file, which makes otherwise structured
diagnostics semantically inaccurate.

**Fix:** Add `indexPath` to the structured report field contract and use it for
index-side ingestion findings. Keep `sourcePath` exclusively for canonical
source files.

## Original Finding Recheck

| Original finding | Verdict | Evidence |
| --- | --- | --- |
| CR-01 lossy UTF-8 decoding | FIXED | Fatal source/index decoding rejects invalid bytes; the verifier retains raw index buffers. |
| CR-02 unstructured ingestion failures | PARTIAL | Structured details survive, while CR-01 and CR-02 above show taxonomy and cascade defects. |
| WR-01 false publication failure | FIXED | A post-rename stdout exception returns status 0 and preserves published bytes. |
| WR-02 read errors mislabeled JSON | FIXED | Read and decode/parse failures carry distinct categories, fields, and codes internally. |
| WR-03 locale-dependent filename order | FIXED | Canonical filenames use explicit code-unit comparison; CR-03 covers a separate raw-directory ordering path. |
| WR-04 missing ingestion regression matrix | PARTIAL | End-to-end cases exist, while WR-01 shows that their assertions encode the wrong report contract. |

## Verification Evidence

All commands used Node.js 20.20.0.

| Command | Result |
| --- | --- |
| `npm run test:ai-faq-index` | PASS: 72 tests, 0 failures. |
| `node --test scripts/measure-build-pipeline.test.mjs` | PASS: 8 tests, 0 failures. |
| `npm run verify:ai-faq-index` | PASS: 2,000 committed records. |
| `npm run lint` | PASS. |
| `npx prettier --check` on all four reviewed files | PASS. |
| `node --check` on all four reviewed files | PASS. |
| Sparse-source counterexample | FAIL CONTRACT: both source-only and index-only totals equal 1. |
| Invalid-source-JSON counterexample | FAIL CONTRACT: extra heading, zero source-schema total, and false index-only total. |
| Blank-title counterexample | FAIL CONTRACT: one invalid field produces source-schema total 2. |
| Reversed-`readdir` counterexample | FAIL CONTRACT: formatted reports are byte-different. |

---

_Reviewed: 2026-08-03T20:19:10Z_
_Reviewer: the agent (gsd-code-reviewer)_
_Depth: standard_
