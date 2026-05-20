# Requirements: Sealos App Deploy Docs Restructure

**Defined:** 2026-03-23
**Core Value:** A new Sealos user can successfully deploy a container application from 0 to 1 without getting lost in fragmented documentation.

## v1 Requirements

Requirements for the initial English App Deploy restructure. Each requirement will map to exactly one roadmap phase.

### Journey & IA

- [x] **JOUR-01**: A new user can identify one clear "start here" path for deploying a first container app from the App Deploy landing page.
- [x] **JOUR-02**: A user can choose an App Deploy path by intent: first deploy, migrate from Docker Compose, or manage an existing deployment.
- [x] **JOUR-03**: A user can navigate the English App Deploy section by journey and task intent instead of a flat feature list.
- [x] **JOUR-04**: A user can read consistent English terminology and page labels that match Sealos product UI terms.

### First Deploy Path

- [x] **PATH-01**: A new user can follow one canonical end-to-end tutorial from zero to a successfully deployed container app on Sealos.
- [x] **PATH-02**: A new user can see explicit prerequisites and a readiness checklist before starting the first deployment flow.
- [x] **PATH-03**: A new user can verify the first deployment with a clear success state, including how to confirm the app is running and reachable.
- [x] **PATH-04**: A new user can recover from common first-deploy failures by following compact troubleshooting branches for image, port, startup, or reachability problems.

### Follow-Up Tasks

- [x] **TASK-01**: A user with a running app can find focused task pages for common next jobs: domain/public access, environment variables, config files, persistent storage, updates, scaling, and ports/networking.
- [x] **TASK-02**: A user can complete each follow-up job from one primary task page without depending on multiple thin stub pages.
- [x] **TASK-03**: A Docker Compose user can find migration guidance as an alternate entry path rather than part of the default first-deploy tutorial.
- [x] **TASK-04**: A user can branch from the primary tutorial to follow-up pages only when a real decision point is reached.

### Content Quality & Publish Safety

- [x] **QUAL-01**: A user only encounters English App Deploy pages that have a clear role because thin, outdated, or fragmented pages are consolidated, rewritten, or removed from primary navigation.
- [x] **QUAL-02**: A user can move through App Deploy pages without broken navigation because internal links, filenames, metadata, and page relationships remain consistent after IA and URL changes.
- [x] **QUAL-03**: A user does not encounter Chinese frontmatter or partially untranslated content in English App Deploy pages.
- [x] **QUAL-04**: A maintainer can validate the restructured App Deploy section with the repo's practical docs safety checks, including build-safe navigation and route integrity.

## v1.3 Requirements

Requirements for the English Object Storage start-here page. Each requirement maps to exactly one roadmap phase.

### Product Truth & Page Contract (Phase 13)

- [ ] **OBJ-01**: The Object Storage product surface (bucket creation, permission types, file upload, access keys, SDK endpoints, static hosting) is audited against the Chinese guide and live product, producing a verified product-truth document.
- [ ] **OBJ-02**: Safe code examples for Go, Java, Node.js, and Python SDK access are locked with placeholder conventions (endpoint, access key, secret key, bucket name) that run without real credentials.
- [ ] **OBJ-03**: A page outline defines section order, heading hierarchy, and content boundaries for the English start-here page.
- [ ] **OBJ-04**: Image assets needed for the English page are inventoried, with Chinese-only screenshots flagged for replacement or language-neutral annotation.

### Canonical Start-Here Page (Phase 14)

- [ ] **OBJ-05**: A user can read one English page and understand what Object Storage is, how to create a bucket, upload files, retrieve access keys, and connect via SDK.
- [ ] **OBJ-06**: The English Object Storage page uses only verified product facts and locked safe examples from the product-truth audit.
- [ ] **OBJ-07**: English frontmatter, terminology, and heading structure follow Sealos docs conventions, with no Chinese title/keyword/description leaking into the English file.
- [ ] **OBJ-08**: The page covers the primary path (bucket creation through SDK upload) with clear next-step pointers to static hosting and advanced usage.

### Verification & Publish Safety (Phase 15)

- [ ] **QLTY-01**: All internal links in the Object Storage English page resolve correctly, including cross-links to DevBox setup, App Launchpad domain docs, and MinIO SDK references.
- [ ] **QLTY-02**: The docs build passes cleanly with Object Storage changes included, and no new build warnings or errors are introduced.
- [ ] **QLTY-03**: No Chinese frontmatter, untranslated body content, or Chinese-only image references remain in the published English Object Storage page.
- [ ] **QLTY-04**: The page renders correctly in static export with all images loading and interactive MDX components (Tabs, Callouts, step containers) functioning.

## v2 Requirements

Deferred to a later release. Tracked but not included in the current roadmap.

### Enhancements

- **ENHC-01**: Users can follow scenario-specific deployment guides beyond the canonical first-deploy path, such as stateful or multi-port examples.
- **ENHC-02**: Users can access expanded concept/reference coverage when task pages reveal recurring decision confusion.
- **ENHC-03**: Users can access a Chinese version of the restructured App Deploy section with parallel IA.

## Out of Scope

Explicit exclusions for this milestone.

| Feature | Reason |
|---------|--------|
| Full Chinese App Deploy rewrite | This project is explicitly English-only |
| Docs platform migration | The current Next.js + Fumadocs + MDX stack is sufficient for this milestone |
| Unrelated docs section redesign | Scope is limited to the English `content/docs/guides/` section |
| Broad search or CMS overhaul | Not required to achieve the first-deploy-success goal |
| Object Storage follow-up task pages | v1.3 scope is one start-here page; task-page expansion deferred |
| New English screenshots for Object Storage | Flagged for replacement but actual capture depends on product UI language support |

## Traceability

Which phases cover which requirements.

| Requirement | Phase | Status |
|-------------|-------|--------|
| JOUR-01 | Phase 2 | Complete |
| JOUR-02 | Phase 3 | Complete |
| JOUR-03 | Phase 1 | Complete |
| JOUR-04 | Phase 1 | Complete |
| PATH-01 | Phase 2 | Complete |
| PATH-02 | Phase 2 | Complete |
| PATH-03 | Phase 2 | Complete |
| PATH-04 | Phase 4 | Complete |
| TASK-01 | Phase 3 | Complete |
| TASK-02 | Phase 3 | Complete |
| TASK-03 | Phase 3 | Complete |
| TASK-04 | Phase 3 | Complete |
| QUAL-01 | Phase 3 | Complete |
| QUAL-02 | Phase 5 | Complete |
| QUAL-03 | Phase 4 | Complete |
| QUAL-04 | Phase 5 | Complete |
| OBJ-01 | Phase 13 | Pending |
| OBJ-02 | Phase 13 | Pending |
| OBJ-03 | Phase 13 | Pending |
| OBJ-04 | Phase 13 | Pending |
| OBJ-05 | Phase 14 | Pending |
| OBJ-06 | Phase 14 | Pending |
| OBJ-07 | Phase 14 | Pending |
| OBJ-08 | Phase 14 | Pending |
| QLTY-01 | Phase 15 | Pending |
| QLTY-02 | Phase 15 | Pending |
| QLTY-03 | Phase 15 | Pending |
| QLTY-04 | Phase 15 | Pending |

**Coverage:**
- v1 requirements: 16 total, 16 mapped, 0 unmapped ✓
- v1.3 requirements: 12 total, 12 mapped, 0 unmapped ✓

---
*Requirements defined: 2026-03-23*
*Last updated: 2026-04-16 after v1.3 roadmap mapping*
