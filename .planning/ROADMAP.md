# Roadmap: AI Quick Reference Slug Integrity and Deployment

## Overview

Milestone v1.4 makes AI Quick Reference URLs deterministic and
production-verifiable. Phase 29 establishes exact full-slug resolution and
regression evidence. Phase 30 proves the behavior through a production build,
deployment, and live URL checks.

## Phases

- [ ] **Phase 29: Deterministic Slug Resolution and Regression Coverage** -
  Resolve full slugs exactly and lock collision behavior with automated checks.
- [ ] **Phase 30: Production Deployment Verification** - Build, deploy, and
  verify the complete AI Quick Reference route inventory.

## Phase Details

### Phase 29: Deterministic Slug Resolution and Regression Coverage

**Goal:** Every requested full slug displays the matching source entry and all
page identity fields derive from that resolution.
**Depends on:** Phase 28
**Requirements:** SLUG-01, SLUG-02, SLUG-03, QA-01, QA-02
**Success Criteria:**

1. Every complete source slug resolves to its own source entry.
2. Every ambiguous normalized slug and unknown numbered slug remains unresolved.
3. H1, metadata, canonical URL, related content, and adjacent navigation share
   the resolved page identity.
4. Automated checks cover all 2,000 exact slugs and all collision groups.
5. TypeScript and focused regression checks pass on the release branch.

### Phase 30: Production Deployment Verification

**Goal:** Production serves corrected AI Quick Reference identities across the
complete generated inventory.
**Depends on:** Phase 29
**Requirements:** DEPLOY-01, DEPLOY-02
**Success Criteria:**

1. The production build generates all static params and the AI Quick Reference sitemap.
2. The deployed sitemap count matches the 2,000-entry source inventory.
3. Sample collision URLs return successful responses with H1 and canonical
   values matching their requested full slugs.

## Progress

**Execution Order:** Phase 29 -> Phase 30

| Phase | Status | Completed |
|-------|--------|-----------|
| 29. Deterministic Slug Resolution and Regression Coverage | In progress | - |
| 30. Production Deployment Verification | Pending | - |
