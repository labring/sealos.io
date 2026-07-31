# Sealos.io International Homepage

## What This Is

Sealos.io is the international Next.js and Fumadocs site for the Sealos product,
documentation, tutorials, blog, and technical reference content. Milestone v1.4
repairs the identity contract for the 2,000-page AI Quick Reference collection.

## Core Value

Search visitors must reach the exact Sealos content represented by the URL and
source data.

## Current Milestone: v1.4 AI Quick Reference Slug Integrity and Deployment

**Status:** In progress.

**Goal:** Make every complete AI Quick Reference slug resolve to its own source
entry, then prove the correction through a production deployment.

## Requirements

### Validated

- ✓ Static localized Next.js App Router site and Fumadocs content collections.
- ✓ AI Quick Reference routes and sitemap are generated from 2,000 source entries.
- ✓ Fifteen framework tutorials and the FastAPI/Django reference workflow shipped in v1.3.

### Active

- [ ] Complete AI Quick Reference slugs resolve to their exact source entries.
- [ ] Ambiguous normalized slugs produce an explicit not-found result.
- [ ] Metadata, H1, body, canonical, related content, and adjacent navigation share one resolved page identity.
- [ ] Regression checks cover every full slug and every normalized collision group.
- [ ] Production build and live HTTP checks prove corrected route identity.

### Out of Scope

- FAQ JSON index synchronization — separate publishing pipeline work.
- Locale, hreflang, and `/zh-cn` routing cleanup — separate localization validation.
- Broad metadata, content-quality, and sitemap taxonomy cleanup — separate SEO maintenance.

## Context

- The source collection contains 2,000 English entries.
- A full audit found 288 normalized slug collision groups affecting 1,453 pages.
- The previous resolver removed numeric prefixes before matching and could return
  the first page from a collision group.
- Production therefore served wrong titles and bodies under valid URLs while
  emitting self-referencing canonicals for those requested URLs.

## Constraints

- **Compatibility**: Preserve every existing complete numbered slug.
- **Fallback**: Retain unnumbered compatibility only when one source candidate exists.
- **Scope**: Preserve unrelated repository and worktree changes.
- **Verification**: Require source-wide regression checks, a production build,
  and live route evidence.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Match complete slugs before compatibility fallback | Generated routes already contain full numbered slugs | Implemented |
| Reject ambiguous normalized candidates | Silent substitution corrupts search identity | Implemented |
| Derive metadata pathname from the resolved source page | Canonical and page content must share one identity | Implemented |
| Continue phase numbering at 29 | v1.3 completed through Phase 28 | Approved |

---
*Last updated: 2026-07-31 after v1.4 milestone initialization*
