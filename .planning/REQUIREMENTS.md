# Requirements: AI Quick Reference Index Consistency

**Defined:** 2026-08-03
**Core Value:** Readers and search engines reach the exact Sealos content represented by the URL and current source data.

The complete v1.4 planning record is preserved in
`.planning/milestones/v1.4-REQUIREMENTS.md`.

## v1.5 Requirements

### Canonical Source Projection

- [x] **SOURCE-01**: Maintainer can generate `public/ai-faqs.en.json` from
  `content/ai-quick-reference/*.en.json`, with the source collection serving as
  the only hand-edited input.

- [x] **SOURCE-02**: The generated page index contains exactly 2,000 records,
  maps each source `slug`, `title`, `description`, and `category` to the
  expected index fields, repairs the 28 stale slugs and five description
  drifts, and preserves numeric ID order.

### Parity Verification

- [x] **PARITY-01**: Maintainer can run a local parity check that compares source
  and page index in both directions and reports missing, orphaned, duplicate,
  field-drift, and ordering mismatches with record-level details.

- [ ] **PARITY-02**: Maintainer can verify that the source slug set, page index
  slug set, AI Quick Reference sitemap set, and generated detail-route set are
  identical for the 2,000-entry English inventory.

### Build And Delivery

- [x] **DELIVERY-01**: The build or CI gate runs page-index generation or parity
  verification before static export and fails with an actionable diagnostic
  when source and derived data diverge.

- [ ] **DELIVERY-02**: Post-deployment verification checks every page-index URL,
  the published sitemap, and representative page identity fields, with zero
  stale slugs, zero 404 detail routes, and a 2,000-URL sitemap.

## Context

- `content/ai-quick-reference/*.en.json` contains 2,000 English source entries.
- `public/ai-faqs.en.json` is fetched by `FAQSearch` for the client-side list,
  filtering, and pagination.

- The current page index has 28 slug mismatches and five description-field
  mismatches against the source collection.

- The live sitemap contains the 2,000 source slugs; all 28 stale page-index
  slugs return 404 in production.

- The static page index remains useful for client performance, so generation
  should retain the existing public asset contract.

## Future Requirements

- **FUTURE-01**: Align locale, hreflang, and `/zh-cn` AI Quick Reference
  inventories with the same canonical projection.

- **FUTURE-02**: Add broad metadata, content-quality, and sitemap taxonomy
  cleanup after the inventory contract is stable.

- **FUTURE-03**: Integrate Search Console recrawl and indexing follow-up into
  the publication checklist.

## Out of Scope

| Feature | Reason |
|---------|--------|
| FAQ content rewriting | The milestone repairs data projection and identity. |
| Locale and hreflang redesign | The current target is the English inventory. |
| Broad taxonomy or metadata redesign | These require a separate content and SEO decision cycle. |
| Search Console remediation operations | Live HTTP and sitemap evidence establish the release gate; recrawl operations follow the data fix. |
| AI Quick Reference visual redesign | Existing page composition remains the visual baseline. |

## Traceability

Roadmap creation maps each v1.5 requirement to exactly one phase.

| Requirement | Phase | Status |
|-------------|-------|--------|
| SOURCE-01 | Phase 31 | Complete |
| SOURCE-02 | Phase 31 | Complete |
| PARITY-01 | Phase 31 | Complete |
| PARITY-02 | Phase 32 | Pending |
| DELIVERY-01 | Phase 31 | Complete |
| DELIVERY-02 | Phase 32 | Pending |

**Coverage:** 6/6 v1.5 requirements mapped.

---
*Last updated: 2026-08-03 after v1.5 roadmap creation*
