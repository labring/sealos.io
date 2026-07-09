# Requirements: React and Node.js Tutorial Expansion

**Defined:** 2026-06-29
**Core Value:** Readers can follow framework-specific Sealos tutorials with
commands, screenshots, and validation evidence that match the current product
workflow.

## v1.2 Requirements

### Template Baseline

- [ ] **BASE-01**: Maintainer can identify the reusable structure, frontmatter
  contract, CTA pattern, related tutorial pattern, image convention, and
  validation expectations from the three existing Next.js tutorials.

- [ ] **BASE-02**: Maintainer can define the final React and Node.js tutorial
  slug map, series ordering, related tutorial links, and image folder names
  before writing article bodies.

- [ ] **BASE-03**: Maintainer can use a framework-specific copy checklist that
  replaces Next.js-only wording with React or Node.js language while preserving
  current Sealos Skills, Runtime Truth Pass, DEPLOY/UPDATE, and `.sealos/`
  guidance.

### React Tutorials

- [ ] **REACT-01**: Reader can follow a React beginner deployment tutorial that
  mirrors the beginner Next.js tutorial structure with React-specific setup,
  build, deploy, Runtime Truth Pass, metadata, CTA, and screenshots.

- [ ] **REACT-02**: Reader can follow a React PostgreSQL/full-stack tutorial
  that mirrors the Next.js PostgreSQL tutorial structure with React-specific
  app, API/service, database, environment, migration, verification, metadata,
  CTA, and screenshots.

- [ ] **REACT-03**: Reader can follow a React production checklist tutorial
  that mirrors the Next.js production tutorial structure with React-specific
  build, deployment, update, rollback, runtime verification, metadata, CTA, and
  screenshots.

- [ ] **REACT-04**: React tutorial pages participate in tutorial listing,
  adjacent navigation, related tutorials, framework labels, tags, and source
  metadata with no broken internal links.

### Node.js Tutorials

- [ ] **NODE-01**: Reader can follow a Node.js beginner deployment tutorial that
  mirrors the beginner Next.js tutorial structure with Node.js-specific setup,
  server entrypoint, build/run, deploy, Runtime Truth Pass, metadata, CTA, and
  screenshots.

- [ ] **NODE-02**: Reader can follow a Node.js PostgreSQL/full-stack tutorial
  that mirrors the Next.js PostgreSQL tutorial structure with Node.js-specific
  service, database, environment, migration, verification, metadata, CTA, and
  screenshots.

- [ ] **NODE-03**: Reader can follow a Node.js production checklist tutorial
  that mirrors the Next.js production tutorial structure with Node.js-specific
  process management, health checks, update, rollback, runtime verification,
  metadata, CTA, and screenshots.

- [ ] **NODE-04**: Node.js tutorial pages participate in tutorial listing,
  adjacent navigation, related tutorials, framework labels, tags, and source
  metadata with no broken internal links.

### Practice Evidence and Screenshots

- [ ] **SHOT-01**: Maintainer can trace each new tutorial screenshot to real
  Sealos practice evidence captured during this milestone.

- [ ] **SHOT-02**: Maintainer can verify that sensitive values in practice
  evidence and screenshots are redacted before assets are committed.

- [ ] **SHOT-03**: Maintainer can verify that every new tutorial image is WebP,
  referenced by MDX, uses stable tutorial dimensions, and stays within the
  project image-size budget.

- [ ] **SHOT-04**: Reader sees screenshot states that match the surrounding
  tutorial steps and do not contradict the visible commands or verification
  text.

### Validation and Release

- [ ] **VALID-01**: Repository tutorial validation covers the expanded tutorial
  slug set and catches missing English source files, unexpected localized
  tutorial files, stale `/tutorials/<slug>` links, and required frontmatter
  fields.

- [ ] **VALID-02**: Targeted source checks prove the expanded tutorial set keeps
  current Sealos Skills install, invocation, Runtime Truth Pass, `.sealos/`,
  DEPLOY/UPDATE, and CTA terminology consistent.

- [ ] **VALID-03**: Image validation proves all new tutorial image references
  resolve to local assets with expected format, dimensions, and file size.

- [ ] **VALID-04**: Final verification runs `npm run validate-tutorials`,
  TypeScript/content validation, targeted searches, and changed-file scope
  review with evidence recorded in the phase artifacts.

## Future Requirements

### Tutorial Expansion

- **FUTURE-01**: Add tutorial families for additional frameworks after React and
  Node.js are verified.

- **FUTURE-02**: Add localized tutorial versions after the English React and
  Node.js source set is stable.

- **FUTURE-03**: Add first-party browser walkthrough videos after screenshot
  workflows are stable.

- **FUTURE-04**: Add automation that captures tutorial screenshots from repeatable
  deployments.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Additional framework families | The user requested React and Node.js based on the existing Next.js templates. |
| Non-English tutorial localization | Current tutorial publication remains English-only for this milestone. |
| Tutorial page visual redesign | This milestone extends content, metadata, screenshots, and validation coverage. |
| Sealos Skills behavior changes | Tutorials consume current Sealos workflow behavior as source truth. |
| Imagined screenshot states | Screenshots must be grounded in practice evidence captured during this milestone. |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| BASE-01 | Phase 16 | Pending |
| BASE-02 | Phase 16 | Pending |
| BASE-03 | Phase 16 | Pending |
| REACT-01 | Phase 17 | Pending |
| REACT-02 | Phase 17 | Pending |
| REACT-03 | Phase 17 | Pending |
| REACT-04 | Phase 17 | Pending |
| NODE-01 | Phase 18 | Pending |
| NODE-02 | Phase 18 | Pending |
| NODE-03 | Phase 18 | Pending |
| NODE-04 | Phase 18 | Pending |
| SHOT-01 | Phase 19 | Pending |
| SHOT-02 | Phase 19 | Pending |
| SHOT-03 | Phase 19 | Pending |
| SHOT-04 | Phase 19 | Pending |
| VALID-01 | Phase 20 | Pending |
| VALID-02 | Phase 20 | Pending |
| VALID-03 | Phase 20 | Pending |
| VALID-04 | Phase 20 | Pending |

**Coverage:**

- v1.2 requirements: 19 total
- Mapped to phases: 19
- Unmapped: 0

---
*Requirements defined: 2026-06-29*
*Last updated: 2026-06-29 after v1.2 milestone initialization*
