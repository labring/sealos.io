# Requirements: FastAPI and Django Tutorial Expansion

**Defined:** 2026-07-15
**Core Value:** Readers can reproduce framework-specific Sealos deployments
from source, commands, screenshots, and runtime evidence that match the current
product.

## v1.3 Requirements

### Test-Driven Delivery

- [x] **TDD-01**: Maintainer can verify FastAPI health, documentation, and task
  CRUD through its public HTTP interface with a real test PostgreSQL database.

- [ ] **TDD-02**: Maintainer can verify Django health, task creation and listing,
  and administration login through its public HTTP interface.

- [ ] **TDD-03**: Maintainer can run each migration command against a fresh
  PostgreSQL database and observe migration completion, readiness, and public
  read/write behavior.

- [ ] **TDD-04**: Maintainer can verify the tutorial catalog through the public
  validator CLI and static HTTP routes.

### FastAPI Reference Application

- [x] **FAST-01**: Reader can clone a public Tasks API stage that exposes
  `/health`, `/docs`, and in-memory task CRUD on port 8000.

- [x] **FAST-02**: Reader can use the PostgreSQL stage with SQLAlchemy 2,
  Alembic, psycopg 3, a repeatable migration Job, and database-backed CRUD.

- [x] **FAST-03**: Reader can use the production stage with a locked Python 3.12
  environment, non-root image, single Uvicorn process, readiness, logs, and
  rollback-ready image tags.

- [x] **FAST-04**: Reader can resolve `stage-1-deploy`, `stage-2-postgresql`, and
  `stage-3-production` in the public FastAPI repository while `main` matches the
  production stage.

### Django Reference Application

- [x] **DJAN-01**: Reader can clone a public Task Board stage that exposes
  `/health`, rendered task pages, and Django administration on port 8000.

- [ ] **DJAN-02**: Reader can use the PostgreSQL stage with psycopg 3, repeatable
  Django migrations, a one-shot migration Job, and database-backed task reads.

- [ ] **DJAN-03**: Reader can use the production stage with Django 5.2 LTS,
  Gunicorn WSGI, WhiteNoise, `collectstatic`, non-root execution, readiness,
  logs, and rollback-ready image tags.

- [ ] **DJAN-04**: Reader can resolve `stage-1-deploy`, `stage-2-postgresql`, and
  `stage-3-production` in the public Django repository while `main` matches the
  production stage.

### Tutorial Content

- [ ] **CONT-01**: Reader can follow FastAPI deploy, PostgreSQL, and production
  tutorials using the FastAPI Reference Application and matching source tags.

- [ ] **CONT-02**: Reader can follow Django deploy, PostgreSQL, and production
  tutorials using the Django Reference Application and matching source tags.

- [ ] **CONT-03**: Each new page has valid frontmatter, framework-local related
  links, correct series order, current Sealos Skills terminology, and the
  established CTA for its stage.

- [ ] **CONT-04**: Beginner duration titles follow the confirmed measured
  five-minute evidence gate.

### Practice Evidence and Assets

- [ ] **SHOT-01**: Maintainer can trace each of the 24 screenshots to actual
  local, Sealos, Kubernetes, HTTP, or browser evidence.

- [ ] **SHOT-02**: Every screenshot is a redacted 1440x900 WebP below 200 KB and
  matches its adjacent tutorial step.

- [ ] **SHOT-03**: Every new MDX image reference resolves locally and through the
  static HTTP output with the expected image content type.

### Publication and Operations

- [ ] **PUB-01**: Reader sees FastAPI and Django as available paths in the
  tutorial framework matrix and can navigate all 15 tutorial pages.

- [ ] **PUB-02**: `npm run validate-tutorials` validates the 15-page catalog,
  six new source pages, series relationships, required terminology, and image
  contracts.

- [ ] **PUB-03**: Static route smoke checks return successful responses for the
  tutorial index, six new pages, and 24 new images.

- [ ] **OPS-01**: Maintainer can reproduce successful FastAPI and Django Sealos
  deployments, migration Jobs, readiness, and public read/write checks from the
  retained evidence package.

- [ ] **OPS-02**: Maintainer can verify removal of every practice `Instance`,
  workload, Service, Ingress, Job, PostgreSQL Cluster, PVC, Secret, and temporary
  image resource after evidence capture.

## Future Requirements

### Tutorial Expansion

- **FUTURE-01**: Add additional framework tutorial series using the verified
  expansion workflow.

- **FUTURE-02**: Add localized tutorial sources after the English catalog is
  stable.

- **FUTURE-03**: Automate repeatable browser and terminal evidence capture.
- **FUTURE-04**: Add browser walkthrough videos for complete framework paths.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Additional framework families | v1.3 is committed to FastAPI and Django. |
| Localized tutorials | Current publication remains English. |
| Tutorial page redesign | Existing page composition remains the visual baseline. |
| Sealos Skills implementation changes | Tutorials consume current upstream behavior. |
| Persistent live demos | Public source, tags, and retained evidence provide reproducibility. |

## Traceability

Roadmap creation maps each v1.3 requirement to exactly one phase.

| Requirement | Phase | Status |
|-------------|-------|--------|
| TDD-01 | Phase 22 | Complete |
| TDD-02 | Phase 25 | Pending |
| TDD-03 | Phase 25 | Pending |
| TDD-04 | Phase 28 | Pending |
| FAST-01 | Phase 21 | Complete |
| FAST-02 | Phase 22 | Complete |
| FAST-03 | Phase 23 | Complete |
| FAST-04 | Phase 23 | Complete |
| DJAN-01 | Phase 24 | Complete |
| DJAN-02 | Phase 25 | Pending |
| DJAN-03 | Phase 26 | Pending |
| DJAN-04 | Phase 26 | Pending |
| CONT-01 | Phase 27 | Pending |
| CONT-02 | Phase 27 | Pending |
| CONT-03 | Phase 27 | Pending |
| CONT-04 | Phase 27 | Pending |
| SHOT-01 | Phase 27 | Pending |
| SHOT-02 | Phase 27 | Pending |
| SHOT-03 | Phase 28 | Pending |
| PUB-01 | Phase 28 | Pending |
| PUB-02 | Phase 28 | Pending |
| PUB-03 | Phase 28 | Pending |
| OPS-01 | Phase 27 | Pending |
| OPS-02 | Phase 28 | Pending |

**Coverage:**

- v1.3 requirements: 24 total
- Mapped to phases: 24
- Unmapped: 0

---
*Requirements defined: 2026-07-15*
*Last updated: 2026-07-15 after v1.3 roadmap creation*
