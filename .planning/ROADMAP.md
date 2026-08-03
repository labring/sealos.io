# Roadmap: AI Quick Reference Index Consistency

## Milestone v1.5: AI Quick Reference Index Consistency

**Goal:** Make the source JSON the canonical dataset for page index entries,
sitemap URLs, and detail-page routes.

**Phases:** 2

### Phase 31: Canonical Index Generation And Local Parity

**Goal:** Maintainers can regenerate the client page index from the source
collection and receive a precise failure report for every data mismatch.
**Depends on:** Phase 30 (v1.4 production verification)
**Requirements:** SOURCE-01, SOURCE-02, PARITY-01, DELIVERY-01

**Success Criteria** (what must be TRUE):

1. A deterministic generator reads every English source JSON and emits one
   page-index record with the exact `slug`, `title`, `description`, and
   `category` projection required by `FAQSearch`.
2. A fresh generation produces 2,000 records in numeric ID order, with zero
   source-only, index-only, duplicate, or field-drift records; the 28 stale
   slugs and five description drifts are corrected.
3. A local parity command compares both directions and reports the first set of
   missing, orphaned, duplicate, ordering, and field mismatches with record
   identifiers and field names.
4. The build or CI preflight runs generation or parity verification before
   static export and returns a non-zero status for a deliberately stale index.

**Scope:** Add the source-to-index generator, the local parity verifier, focused
   regression fixtures, and the build/CI gate. Preserve the existing static
   `/ai-faqs.en.json` asset contract and client pagination behavior.

**Validation Approach:** Run the generator twice, compare the byte-stable
   output, inject representative stale and missing records into a temporary
   fixture, verify actionable failures, then run lint and the build preflight.

**Plans:** 3

**Plan Waves:**

- **Wave 1:** `31-01-PLAN.md` establishes the canonical source loader,
  deterministic projection, shared parity comparison, and focused fixtures.
- **Wave 2:** `31-02-PLAN.md` adds the atomic generator and regenerates the
  committed page-index asset from source.
- **Wave 3:** `31-03-PLAN.md` adds the read-only verifier and preflight wiring
  for package and timed static-export paths.

**Cross-Cutting Constraints:** Preserve the existing FAQSearch asset contract,
keep verification read-only, retain existing slug and route verifier commands,
and reserve sitemap and deployed route checks for Phase 32.

### Phase 32: Sitemap Route Parity And Production Verification

**Goal:** Every page-index entry has the same canonical slug in the sitemap and
   deployed detail-page route.
**Depends on:** Phase 31
**Requirements:** PARITY-02, DELIVERY-02

**Success Criteria** (what must be TRUE):

1. The built AI Quick Reference sitemap contains exactly the 2,000 source and
   page-index slugs, with one canonical URL per slug.
2. The static output verifier checks every page-index URL and confirms HTTP 200
   plus matching title, H1, description, and canonical identity fields.
3. The deployed verifier confirms the same 2,000-URL sitemap and zero stale
   page-index URLs, with bounded concurrency and a retained status summary.
4. The release evidence records source, index, sitemap, and route counts plus
   the exact commit used for production verification.

**Scope:** Extend the route verifier and sitemap-set checks, run the complete
   local static-output matrix, deploy the approved change through the existing
   repository flow, and capture production evidence.

**Validation Approach:** Compare all four slug sets locally, exercise every
   generated route from static output, repeat the comparison against the live
   sitemap and page index, and inspect representative page identity fields.

## Execution Order

Phases execute in numeric order: 31 -> 32

## Requirement Coverage

| Requirement | Phase | Status |
|-------------|-------|--------|
| SOURCE-01 | Phase 31 | Pending |
| SOURCE-02 | Phase 31 | Pending |
| PARITY-01 | Phase 31 | Pending |
| PARITY-02 | Phase 32 | Pending |
| DELIVERY-01 | Phase 31 | Pending |
| DELIVERY-02 | Phase 32 | Pending |

**Coverage:** 6/6 v1.5 requirements mapped.

---
*Roadmap created: 2026-08-03 for milestone v1.5*
