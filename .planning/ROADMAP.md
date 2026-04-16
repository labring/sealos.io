# Roadmap: Object Storage English Start-Here Docs

## Overview

This roadmap turns the nearly empty English `Object Storage` guide into one real
start-here page for Sealos users. The milestone is intentionally narrow: rewrite
`content/docs/guides/object-storage/index.en.mdx` into a canonical English entry
point that explains the product, gets the user to one first successful file
upload, and provides only the minimum permission guidance and first-failure
checks needed for zero-to-one success.

The execution order starts by validating product truth and example safety, then
rewrites the page itself, and finally adds verification plus publish-safety
checks. This keeps the milestone aligned with the proven v1.2/v1.3 strategy:
single-page start-here first, deeper Object Storage docs later only if real gaps
remain.

## Phases

**Phase Numbering:**
- Integer phases continue from the previous milestone
- v1.2 ended at Phase 12, so this milestone starts at **Phase 13**
- Decimal phases remain reserved for urgent insertions if needed later

- [x] **Phase 13: Product Truth, Safe Example Contract, and Page Outline** -
  Audit the current Object Storage docs and UI evidence, then lock the
  single-page contract and safe upload example.
- [ ] **Phase 14: Canonical Object Storage Start-Here Page** - Rewrite the
  English Object Storage page into the real overview + bucket creation +
  credential path + first-upload guide.
- [ ] **Phase 15: Verification, Failure Checks, and Publish Safety** - Add
  success verification, first-failure checks, metadata cleanup, and repo-level
  validation.

## Phase Details

### Phase 13: Product Truth, Safe Example Contract, and Page Outline
**Goal**: Lock the real Object Storage product surface, safe example assumptions,
and single-page section contract before the milestone rewrites user-facing
content.
**Depends on**: Nothing (first phase of this milestone)
**Requirements**: QLTY-04
**Success Criteria** (what must be TRUE):
  1. Current Object Storage English and Chinese docs, screenshots, and navigation
     state are inventoried from the current worktree.
  2. The v1.3 English IA contract is documented: one canonical
     `content/docs/guides/object-storage/index.en.mdx` page and no child-page
     navigation.
  3. Safe first-upload assumptions are defined well enough to guide writing:
     where the Access Key and Endpoint come from, which bucket permission level
     to use for the example, what file type and size to recommend, and what live
     values must be rechecked before publish.
  4. Chinese-only screenshots (`.zh-cn.png`) are inventoried and decisions made
     for the English page (reuse with caution, replace, or omit).
**UI hint**: no
**Plans**: 3 plans

Plans:
- [x] 13-01: Audit the current Object Storage docs surface, screenshots, and
  English gap
- [x] 13-02: Define the safe first-upload example contract and product-truth
  constraints
- [x] 13-03: Define the English page outline, writing guardrails, and page-role
  contract

### Phase 14: Canonical Object Storage Start-Here Page
**Goal**: Create the primary zero-to-one Object Storage path that gets a user
from product understanding to one verified first successful file upload.
**Depends on**: Phase 13
**Requirements**: OBJ-01, OBJ-02, OBJ-03, UPLD-01, UPLD-02, UPLD-03
**Success Criteria** (what must be TRUE):
  1. The English Object Storage page explains what the product is, why to use it,
     and what the user will complete on the page.
  2. The guide walks a user through creating a bucket with clear permission
     guidance and obtaining Access Key, Secret Key, and Endpoint from one path.
  3. The guide walks a user through uploading a first file and confirming success
     in the console.
  4. The page stays a single canonical entry point rather than becoming a router
     or a mini library.
**UI hint**: no
**Plans**: 3 plans

Plans:
- [ ] 14-01: Rewrite frontmatter plus the opening overview and start-here framing
- [ ] 14-02: Author the bucket creation, credential retrieval, and permission
  guidance path
- [ ] 14-03: Author the first file upload walkthrough plus boundaries and next
  steps

### Phase 15: Verification, Failure Checks, and Publish Safety
**Goal**: Make the English Object Storage page publish-safe by adding explicit
verification, compact recovery guidance, route integrity evidence, and
repo-level rollout checks.
**Depends on**: Phase 14
**Requirements**: VRFY-01, VRFY-02, QLTY-01, QLTY-02, QLTY-03
**Success Criteria** (what must be TRUE):
  1. The page defines what first success looks like using the console file list
     and a direct access URL.
  2. The page provides a short first-failure checklist that covers the most
     likely zero-to-one blockers (wrong endpoint, wrong credentials, permission
     denied, bucket not found, upload size issues).
  3. The English Object Storage surface has only English metadata and does not
     expose non-existent child pages or broken local navigation.
  4. Route/content checks, `npm run build`, and `npm run lint` all validate
     cleanly for the milestone output.
**UI hint**: no
**Plans**: 4 plans

Plans:
- [ ] 15-01: Strengthen success verification and the compact first-failure
  checklist
- [ ] 15-02: Enforce English-only publish-safe copy and preserve the single-leaf
  route posture
- [ ] 15-03: Record Object Storage nav, route, and focused UAT integrity evidence
- [ ] 15-04: Run build-safe QA, repo validation, and final milestone closeout

## Progress

**Execution Order:**
Phases execute in numeric order: 13 -> 14 -> 15

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 13. Product Truth, Safe Example Contract, and Page Outline | 3/3 | Completed | 2026-04-16 |
| 14. Canonical Object Storage Start-Here Page | 0/3 | Not started | - |
| 15. Verification, Failure Checks, and Publish Safety | 0/4 | Not started | - |
