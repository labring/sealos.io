# Requirements: AI Quick Reference Slug Integrity and Deployment

**Defined:** 2026-07-31
**Milestone:** v1.4
**Core Value:** Search visitors reach the exact content represented by the URL.

## Exact Slug Resolution

- [ ] **SLUG-01**: A complete AI Quick Reference slug resolves to the source
  entry with that exact full slug, and title, description, and body come from
  the same entry.
- [ ] **SLUG-02**: A normalized slug with multiple source candidates produces
  an explicit not-found result.
- [ ] **SLUG-03**: Canonical URL, H1, metadata, related content, and adjacent
  navigation derive from one exact resolution result.

## Regression Verification

- [ ] **QA-01**: Automated checks cover every exact source slug, missing slugs,
  unknown numbered slugs, and all normalized collision groups.
- [ ] **QA-02**: Representative built detail pages keep metadata and rendered
  identity aligned with the requested full slug.

## Deployment Verification

- [ ] **DEPLOY-01**: The production build succeeds with complete AI Quick
  Reference static params and sitemap generation.
- [ ] **DEPLOY-02**: Post-deployment checks validate sitemap count and sample
  collision URLs for HTTP status, H1, and canonical alignment.

## Future Requirements

- Synchronize the published FAQ JSON index with current source slugs.
- Repair locale, hreflang, and `/zh-cn` route generation.
- Clean up broad metadata, content-quality, and sitemap taxonomy issues.

## Out of Scope

| Feature | Reason |
|---------|--------|
| FAQ JSON synchronization | Separate publishing pipeline concern |
| Locale and hreflang cleanup | Requires independent multilingual crawl validation |
| Broad content and sitemap cleanup | Exceeds the resolver release |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| SLUG-01 | Phase 29 | In progress |
| SLUG-02 | Phase 29 | In progress |
| SLUG-03 | Phase 29 | In progress |
| QA-01 | Phase 29 | In progress |
| QA-02 | Phase 29 | In progress |
| DEPLOY-01 | Phase 30 | Pending |
| DEPLOY-02 | Phase 30 | Pending |

**Coverage:** 7 requirements, 7 mapped, 0 unmapped.

---
*Last updated: 2026-07-31 after roadmap creation*
