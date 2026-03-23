# Requirements: Sealos App Deploy Docs Restructure

**Defined:** 2026-03-23
**Core Value:** A new Sealos user can successfully deploy a container application from 0 to 1 without getting lost in fragmented documentation.

## v1 Requirements

Requirements for the initial English App Deploy restructure. Each requirement will map to exactly one roadmap phase.

### Journey & IA

- [ ] **JOUR-01**: A new user can identify one clear "start here" path for deploying a first container app from the App Deploy landing page.
- [ ] **JOUR-02**: A user can choose an App Deploy path by intent: first deploy, migrate from Docker Compose, or manage an existing deployment.
- [ ] **JOUR-03**: A user can navigate the English App Deploy section by journey and task intent instead of a flat feature list.
- [ ] **JOUR-04**: A user can read consistent English terminology and page labels that match Sealos product UI terms.

### First Deploy Path

- [ ] **PATH-01**: A new user can follow one canonical end-to-end tutorial from zero to a successfully deployed container app on Sealos.
- [ ] **PATH-02**: A new user can see explicit prerequisites and a readiness checklist before starting the first deployment flow.
- [ ] **PATH-03**: A new user can verify the first deployment with a clear success state, including how to confirm the app is running and reachable.
- [ ] **PATH-04**: A new user can recover from common first-deploy failures by following compact troubleshooting branches for image, port, startup, or reachability problems.

### Follow-Up Tasks

- [ ] **TASK-01**: A user with a running app can find focused task pages for common next jobs: domain/public access, environment variables, config files, persistent storage, updates, scaling, and ports/networking.
- [ ] **TASK-02**: A user can complete each follow-up job from one primary task page without depending on multiple thin stub pages.
- [ ] **TASK-03**: A Docker Compose user can find migration guidance as an alternate entry path rather than part of the default first-deploy tutorial.
- [ ] **TASK-04**: A user can branch from the primary tutorial to follow-up pages only when a real decision point is reached.

### Content Quality & Publish Safety

- [ ] **QUAL-01**: A user only encounters English App Deploy pages that have a clear role because thin, outdated, or fragmented pages are consolidated, rewritten, or removed from primary navigation.
- [ ] **QUAL-02**: A user can move through App Deploy pages without broken navigation because internal links, filenames, metadata, and page relationships remain consistent after IA and URL changes.
- [ ] **QUAL-03**: A user does not encounter Chinese frontmatter or partially untranslated content in English App Deploy pages.
- [ ] **QUAL-04**: A maintainer can validate the restructured App Deploy section with the repo's practical docs safety checks, including build-safe navigation and route integrity.

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
| Unrelated docs section redesign | Scope is limited to the English `content/docs/guides/app-deploy/` section |
| Broad search or CMS overhaul | Not required to achieve the first-deploy-success goal |

## Traceability

Which phases cover which requirements.

| Requirement | Phase | Status |
|-------------|-------|--------|
| JOUR-01 | Phase 2 | Pending |
| JOUR-02 | Phase 3 | Pending |
| JOUR-03 | Phase 1 | Pending |
| JOUR-04 | Phase 1 | Pending |
| PATH-01 | Phase 2 | Pending |
| PATH-02 | Phase 2 | Pending |
| PATH-03 | Phase 2 | Pending |
| PATH-04 | Phase 4 | Pending |
| TASK-01 | Phase 3 | Pending |
| TASK-02 | Phase 3 | Pending |
| TASK-03 | Phase 3 | Pending |
| TASK-04 | Phase 3 | Pending |
| QUAL-01 | Phase 3 | Pending |
| QUAL-02 | Phase 5 | Pending |
| QUAL-03 | Phase 4 | Pending |
| QUAL-04 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 16 total
- Mapped to phases: 16
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-23*
*Last updated: 2026-03-23 after roadmap mapping*
