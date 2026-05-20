# Roadmap: Sealos App Deploy Docs Restructure

## Milestones

- ✅ **v1.0 MVP** - Phases 1-5 (shipped)
- ✅ **v1.1 AI Proxy English Start-Here Docs** - Phases 6-9 (shipped)
- ✅ **v1.2 CronJob English Start-Here Docs** - Phases 10-12 (shipped)
- 🚧 **v1.3 Object Storage English Start-Here Docs** - Phases 13-15 (in progress)

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1-5) - SHIPPED</summary>

- [x] **Phase 1: Inventory, Terminology, and Target Taxonomy** - Audit current English App Deploy content and define the target IA, naming, and migration rules.
- [x] **Phase 2: Canonical First-Deploy Tutorial** - Build the zero-to-one deployment guide that becomes the primary path for new users.
- [x] **Phase 3: Router Page and Follow-Up Task Library** - Rebuild landing/navigation flow and refactor operational content into focused task guides.
- [x] **Phase 4: Troubleshooting and English Content Hardening** - Add symptom-based recovery content and clean remaining English quality issues.
- [x] **Phase 5: Link Migration, Validation, and Rollout** - Verify links, routes, metadata, and build safety before publishing the restructure.

</details>

<details>
<summary>✅ v1.1 AI Proxy English Start-Here Docs (Phases 6-9) - SHIPPED</summary>

- [x] **Phase 6: Product Truth, Safe Example Contract, and Page Outline** - Audit AI Proxy product surface, lock safe examples, and define the page contract for the English start-here guide.
- [x] **Phase 7: Canonical AI Proxy Start-Here Page** - Rewrite the English AI Proxy guide into one real start-here page.
- [x] **Phase 8: Follow-Up Task Pages and Cross-Links** - Build focused task pages for AI Proxy operational jobs and wire contextual cross-links.
- [x] **Phase 9: Verification, Failure Checks, and Publish Safety** - Verify AI Proxy docs for link integrity, build safety, and content quality before publishing.

</details>

<details>
<summary>✅ v1.2 CronJob English Start-Here Docs (Phases 10-12) - SHIPPED</summary>

- [x] **Phase 10: Product Truth, Safe Example Contract, and Page Outline** - Audit CronJob product surface, lock safe examples, and define the page contract for the English start-here guide.
- [x] **Phase 11: Canonical CronJob Start-Here Page** - Rewrite the English CronJob guide into one real start-here page.
- [x] **Phase 12: Verification, Failure Checks, and Publish Safety** - Verify CronJob docs for link integrity, build safety, and content quality before publishing.

</details>

### 🚧 v1.3 Object Storage English Start-Here Docs (In Progress)

**Milestone Goal:** Turn the nearly empty English Object Storage guide into one real start-here page that covers bucket creation, file operations, access keys, SDK usage, and static hosting -- mirroring the comprehensive Chinese version while fitting Sealos docs conventions.

**Execution order:** Validate product truth from the Chinese source and live product --> rewrite the English page --> verification and publish safety.

- [ ] **Phase 13: Product Truth, Safe Example Contract, and Page Outline** - Audit Object Storage product surface against the Chinese guide, lock safe examples, and define the page contract for the English start-here page.
- [ ] **Phase 14: Canonical Object Storage Start-Here Page** - Rewrite the English Object Storage guide into one real start-here page covering bucket ops, SDK access, and static hosting.
- [ ] **Phase 15: Verification, Failure Checks, and Publish Safety** - Verify Object Storage docs for link integrity, content quality, and build safety before publishing.

## Phase Details

<details>
<summary>✅ v1.0 MVP Phase Details (Phases 1-5)</summary>

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
- [x] 01-01: Audit current App Deploy pages, links, and content completeness
- [x] 01-02: Define target IA, page roles, and naming conventions
- [x] 01-03: Specify frontmatter, `meta.en.json`, and slug migration rules

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
- [x] 02-01: Draft the first-deploy tutorial structure and end-to-end walkthrough
- [x] 02-02: Add prerequisites, readiness checklist, and verification checkpoints
- [x] 02-03: Add success-state messaging and next-step routing from the tutorial

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
- [x] 03-01: Rewrite `index.en.mdx` into an App Deploy router page
- [x] 03-02: Refactor domain, environment, and config task pages
- [x] 03-03: Refactor storage, update, scaling, and networking task pages
- [x] 03-04: Reposition Docker Compose migration and wire cross-links between task paths

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
- [x] 04-01: Create symptom-based troubleshooting pages for first-deploy failures
- [x] 04-02: Add targeted recovery and decision-support cross-links where needed
- [x] 04-03: Clean English frontmatter, copy, and page-role consistency across App Deploy

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
- [x] 05-01: Validate links, metadata, and generated routes across App Deploy
- [x] 05-02: Run build-safe docs QA and fix rollout blockers
- [x] 05-03: Finalize rollout checklist and redirect or alias handling notes

</details>

<details>
<summary>✅ v1.1 AI Proxy Phase Details (Phases 6-9)</summary>

### Phase 6: Product Truth, Safe Example Contract, and Page Outline
**Goal**: Establish verified product facts, lock safe examples, and define the page contract for the English AI Proxy start-here guide.
**Depends on**: Phase 5
**Requirements**: AIP-01, AIP-02, AIP-03
**Success Criteria** (what must be TRUE):
  1. AI Proxy product surface (models, endpoints, auth) is audited against live product and Chinese docs.
  2. Safe code/curl examples are locked with placeholder conventions that work without real credentials.
  3. A page outline defines section order, heading hierarchy, and content boundaries for the start-here page.
**Plans**: 3 plans

Plans:
- [x] 06-01: Audit AI Proxy product surface and extract product truths
- [x] 06-02: Lock safe example contract (placeholders, curl/SDK patterns)
- [x] 06-03: Define page outline and section contract for start-here page

### Phase 7: Canonical AI Proxy Start-Here Page
**Goal**: Deliver one complete English AI Proxy start-here page that gets a user from zero to a working API call.
**Depends on**: Phase 6
**Requirements**: AIP-04, AIP-05, AIP-06, AIP-07
**Success Criteria** (what must be TRUE):
  1. A user can read one page and understand what AI Proxy is, how to get an API key, and how to make a first call.
  2. The page uses only verified product facts and locked safe examples.
  3. English frontmatter, terminology, and heading structure follow docs conventions.
  4. The page covers the primary path (OpenAI-compatible chat completion) with clear next-step pointers.
**Plans**: 3 plans

Plans:
- [x] 07-01: Write the AI Proxy start-here page body
- [x] 07-02: Integrate safe examples and verification checkpoints
- [x] 07-03: Add next-step routing and cross-links

### Phase 8: Follow-Up Task Pages and Cross-Links
**Goal**: Build focused task pages for AI Proxy operational jobs and wire contextual cross-links.
**Depends on**: Phase 7
**Requirements**: AIP-08, AIP-09
**Success Criteria** (what must be TRUE):
  1. Focused task pages exist for model selection, billing, and advanced SDK usage.
  2. Cross-links between start-here and task pages appear at real decision points.
**Plans**: 2 plans

Plans:
- [x] 08-01: Write AI Proxy follow-up task pages
- [x] 08-02: Wire cross-links between start-here and task pages

### Phase 9: Verification, Failure Checks, and Publish Safety
**Goal**: Verify AI Proxy docs for link integrity, build safety, and content quality before publishing.
**Depends on**: Phase 8
**Requirements**: AIP-10, AIP-11, AIP-12
**Success Criteria** (what must be TRUE):
  1. All internal links in AI Proxy pages resolve correctly.
  2. The docs build passes cleanly with AI Proxy changes included.
  3. No Chinese frontmatter or untranslated content remains in English AI Proxy pages.
**Plans**: 3 plans

Plans:
- [x] 09-01: Validate links and metadata across AI Proxy pages
- [x] 09-02: Run build-safe QA and fix blockers
- [x] 09-03: Final content quality pass and publish readiness check

</details>

<details>
<summary>✅ v1.2 CronJob Phase Details (Phases 10-12)</summary>

### Phase 10: Product Truth, Safe Example Contract, and Page Outline
**Goal**: Establish verified product facts, lock safe examples, and define the page contract for the English CronJob start-here guide.
**Depends on**: Phase 9
**Requirements**: CRN-01, CRN-02, CRN-03
**Success Criteria** (what must be TRUE):
  1. CronJob product surface (schedule syntax, image config, lifecycle) is audited against live product and Chinese docs.
  2. Safe examples are locked with placeholder conventions that work without real credentials.
  3. A page outline defines section order, heading hierarchy, and content boundaries for the start-here page.
**Plans**: 3 plans

Plans:
- [x] 10-01: Audit CronJob product surface and extract product truths
- [x] 10-02: Lock safe example contract
- [x] 10-03: Define page outline and section contract

### Phase 11: Canonical CronJob Start-Here Page
**Goal**: Deliver one complete English CronJob start-here page that gets a user from zero to a working scheduled job.
**Depends on**: Phase 10
**Requirements**: CRN-04, CRN-05, CRN-06, CRN-07
**Success Criteria** (what must be TRUE):
  1. A user can read one page and understand what CronJob does, how to create a job, and how to verify it ran.
  2. The page uses only verified product facts and locked safe examples.
  3. English frontmatter, terminology, and heading structure follow docs conventions.
  4. The page covers the primary path with clear next-step pointers.
**Plans**: 3 plans

Plans:
- [x] 11-01: Write the CronJob start-here page body
- [x] 11-02: Integrate safe examples and verification checkpoints
- [x] 11-03: Add next-step routing and cross-links

### Phase 12: Verification, Failure Checks, and Publish Safety
**Goal**: Verify CronJob docs for link integrity, build safety, and content quality before publishing.
**Depends on**: Phase 11
**Requirements**: CRN-08, CRN-09, CRN-10
**Success Criteria** (what must be TRUE):
  1. All internal links in CronJob pages resolve correctly.
  2. The docs build passes cleanly with CronJob changes included.
  3. No Chinese frontmatter or untranslated content remains in English CronJob pages.
**Plans**: 3 plans

Plans:
- [x] 12-01: Validate links and metadata across CronJob pages
- [x] 12-02: Run build-safe QA and fix blockers
- [x] 12-03: Final content quality pass and publish readiness check

</details>

### Phase 13: Product Truth, Safe Example Contract, and Page Outline
**Goal**: Establish verified product facts for Object Storage (bucket ops, permissions, access keys, SDK patterns, static hosting), lock safe examples, and define the page contract for the English start-here page.
**Depends on**: Phase 12
**Requirements**: OBJ-01, OBJ-02, OBJ-03, OBJ-04
**Success Criteria** (what must be TRUE):
  1. Object Storage product surface (bucket creation, permission model, access key structure, SDK endpoints, static hosting flow) is audited against the Chinese guide and live product.
  2. Safe code examples are locked for Go, Java, Node.js, and Python SDK snippets with placeholder conventions (endpoint, access key, secret key, bucket name) that work without real credentials.
  3. A page outline defines section order, heading hierarchy, and content boundaries for the English start-here page covering basic usage, static hosting, and SDK access.
  4. Image assets needed for the English page are inventoried -- Chinese-only screenshots are flagged for replacement or annotation.
**Plans**: TBD

### Phase 14: Canonical Object Storage Start-Here Page
**Goal**: Deliver one complete English Object Storage start-here page that gets a user from zero to a working bucket with uploaded files, SDK access, and optional static hosting.
**Depends on**: Phase 13
**Requirements**: OBJ-05, OBJ-06, OBJ-07, OBJ-08
**Success Criteria** (what must be TRUE):
  1. A user can read one page and understand what Object Storage is, how to create a bucket, upload files, get access keys, and connect via SDK.
  2. The page uses only verified product facts and locked safe examples from Phase 13.
  3. English frontmatter, terminology, and heading structure follow Sealos docs conventions.
  4. The page covers the primary path (bucket creation through SDK upload) with clear next-step pointers to static hosting and advanced usage.
  5. All screenshots are English-appropriate (English UI captures or language-neutral annotations).
**Plans**: TBD
**UI hint**: yes

### Phase 15: Verification, Failure Checks, and Publish Safety
**Goal**: Verify Object Storage docs for link integrity, content quality, image validity, and build safety before publishing.
**Depends on**: Phase 14
**Requirements**: QLTY-01, QLTY-02, QLTY-03, QLTY-04
**Success Criteria** (what must be TRUE):
  1. All internal links in the Object Storage English page resolve correctly (including cross-links to DevBox, App Launchpad domain docs, and SDK references).
  2. The docs build passes cleanly with Object Storage changes included.
  3. No Chinese frontmatter, untranslated content, or Chinese-only image references remain in the English Object Storage page.
  4. The page renders correctly in static export with all images loading and interactive components (Tabs, Callouts) functioning.
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 13 -> 14 -> 15

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Inventory, Terminology, and Target Taxonomy | v1.0 | 3/3 | Complete | - |
| 2. Canonical First-Deploy Tutorial | v1.0 | 3/3 | Complete | - |
| 3. Router Page and Follow-Up Task Library | v1.0 | 4/4 | Complete | - |
| 4. Troubleshooting and English Content Hardening | v1.0 | 3/3 | Complete | - |
| 5. Link Migration, Validation, and Rollout | v1.0 | 3/3 | Complete | - |
| 6. Product Truth, Safe Example Contract, and Page Outline | v1.1 | 3/3 | Complete | - |
| 7. Canonical AI Proxy Start-Here Page | v1.1 | 3/3 | Complete | - |
| 8. Follow-Up Task Pages and Cross-Links | v1.1 | 2/2 | Complete | - |
| 9. Verification, Failure Checks, and Publish Safety | v1.1 | 3/3 | Complete | - |
| 10. Product Truth, Safe Example Contract, and Page Outline | v1.2 | 3/3 | Complete | - |
| 11. Canonical CronJob Start-Here Page | v1.2 | 3/3 | Complete | - |
| 12. Verification, Failure Checks, and Publish Safety | v1.2 | 3/3 | Complete | - |
| 13. Product Truth, Safe Example Contract, and Page Outline | v1.3 | 0/0 | Not started | - |
| 14. Canonical Object Storage Start-Here Page | v1.3 | 0/0 | Not started | - |
| 15. Verification, Failure Checks, and Publish Safety | v1.3 | 0/0 | Not started | - |
