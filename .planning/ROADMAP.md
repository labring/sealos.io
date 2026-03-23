# Roadmap: Sealos App Deploy Docs Restructure

## Overview

This roadmap restructures the English `App Deploy` docs around one dominant first-success journey, then rebuilds the surrounding section into focused follow-up tasks, troubleshooting, and publish-safe navigation. The execution order starts with taxonomy and migration foundations, then creates the canonical first-deploy tutorial, then refactors the remaining App Deploy content around that path, and finally validates links, routes, and rollout safety.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Inventory, Terminology, and Target Taxonomy** - Audit current English App Deploy content and define the target IA, naming, and migration rules.
- [ ] **Phase 2: Canonical First-Deploy Tutorial** - Build the zero-to-one deployment guide that becomes the primary path for new users.
- [ ] **Phase 3: Router Page and Follow-Up Task Library** - Rebuild landing/navigation flow and refactor operational content into focused task guides.
- [ ] **Phase 4: Troubleshooting and English Content Hardening** - Add symptom-based recovery content and clean remaining English quality issues.
- [ ] **Phase 5: Link Migration, Validation, and Rollout** - Verify links, routes, metadata, and build safety before publishing the restructure.

## Phase Details

### Phase 1: Inventory, Terminology, and Target Taxonomy
**Goal**: Audit the current English App Deploy docs and define the target information architecture, page roles, naming rules, and slug strategy for the restructure.
**Depends on**: Nothing (first phase)
**Requirements**: JOUR-03, JOUR-04
**Success Criteria** (what must be TRUE):
  1. Current English App Deploy pages are inventoried with quality, role, and migration disposition.
  2. A target App Deploy content tree and navigation order exist with explicit page-role definitions.
  3. Canonical English terminology and slug/file mapping rules are documented for later rewrites.
**Plans**: 3 plans

Plans:
- [ ] 01-01: Audit current App Deploy pages, links, and content completeness
- [ ] 01-02: Define target IA, page roles, and naming conventions
- [ ] 01-03: Specify frontmatter, `meta.en.json`, and slug migration rules

### Phase 2: Canonical First-Deploy Tutorial
**Goal**: Create the primary zero-to-one deployment tutorial that gets a new user from prerequisites to a reachable running app.
**Depends on**: Phase 1
**Requirements**: JOUR-01, PATH-01, PATH-02, PATH-03
**Success Criteria** (what must be TRUE):
  1. The English App Deploy section has one clearly designated first-deploy path for new users.
  2. The first-deploy tutorial includes explicit prerequisites, readiness checks, exact steps, and verification checkpoints.
  3. A new user can identify the expected success state and how to confirm it inside Sealos.
  4. The tutorial ends with clear post-success next steps instead of sending users back to a flat topic list.
**Plans**: 3 plans

Plans:
- [ ] 02-01: Draft the first-deploy tutorial structure and end-to-end walkthrough
- [ ] 02-02: Add prerequisites, readiness checklist, and verification checkpoints
- [ ] 02-03: Add success-state messaging and next-step routing from the tutorial

### Phase 3: Router Page and Follow-Up Task Library
**Goal**: Rebuild App Deploy navigation around user intent and refactor operational content into focused, one-job task guides.
**Depends on**: Phase 2
**Requirements**: JOUR-02, TASK-01, TASK-02, TASK-03, TASK-04, QUAL-01
**Success Criteria** (what must be TRUE):
  1. The App Deploy landing page routes users by intent: first deploy, migrate from Docker Compose, or manage an existing app.
  2. Focused task pages exist for domain/public access, environment variables, config files, persistent storage, updates, scaling, and ports/networking.
  3. Each follow-up page owns one primary job and can be completed without relying on multiple thin stub pages.
  4. The primary tutorial and task pages include contextual branching links only at real decision points.
**Plans**: 4 plans

Plans:
- [ ] 03-01: Rewrite `index.en.mdx` into an App Deploy router page
- [ ] 03-02: Refactor domain, environment, and config task pages
- [ ] 03-03: Refactor storage, update, scaling, and networking task pages
- [ ] 03-04: Reposition Docker Compose migration and wire cross-links between task paths

### Phase 4: Troubleshooting and English Content Hardening
**Goal**: Add recovery guidance for common first-deploy failures and remove remaining English-quality defects from the App Deploy section.
**Depends on**: Phase 3
**Requirements**: PATH-04, QUAL-03
**Success Criteria** (what must be TRUE):
  1. Common first-deploy failures are covered by symptom-based troubleshooting guidance.
  2. English App Deploy pages no longer contain Chinese frontmatter or partially untranslated copy.
  3. The main tutorial and follow-up task pages link to the right recovery pages at failure-prone steps.
**Plans**: 3 plans

Plans:
- [ ] 04-01: Create symptom-based troubleshooting pages for first-deploy failures
- [ ] 04-02: Add targeted recovery and decision-support cross-links where needed
- [ ] 04-03: Clean English frontmatter, copy, and page-role consistency across App Deploy

### Phase 5: Link Migration, Validation, and Rollout
**Goal**: Make the App Deploy restructure publish-safe through route, metadata, navigation, and build validation.
**Depends on**: Phase 4
**Requirements**: QUAL-02, QUAL-04
**Success Criteria** (what must be TRUE):
  1. Internal links, filenames, metadata, and navigation all resolve consistently after IA and URL changes.
  2. The docs build and route structure validate cleanly for the restructured App Deploy section.
  3. A rollout checklist or redirect/alias plan exists for any changed public slugs.
**Plans**: 3 plans

Plans:
- [ ] 05-01: Validate links, metadata, and generated routes across App Deploy
- [ ] 05-02: Run build-safe docs QA and fix rollout blockers
- [ ] 05-03: Finalize rollout checklist and redirect or alias handling notes

## Progress

**Execution Order:**
Phases execute in numeric order: 2 -> 2.1 -> 2.2 -> 3 -> 3.1 -> 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Inventory, Terminology, and Target Taxonomy | 0/3 | Not started | - |
| 2. Canonical First-Deploy Tutorial | 0/3 | Not started | - |
| 3. Router Page and Follow-Up Task Library | 0/4 | Not started | - |
| 4. Troubleshooting and English Content Hardening | 0/3 | Not started | - |
| 5. Link Migration, Validation, and Rollout | 0/3 | Not started | - |
