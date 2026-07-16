# Roadmap: FastAPI and Django Tutorial Expansion

## Overview

Milestone v1.3 extends the public tutorial catalog with two complete Framework
Tutorial Series. Delivery follows the same deployable stages that readers use:
each Reference Application first exposes its framework-native HTTP behavior,
then adds PostgreSQL and one-shot migrations, then becomes a reproducible
production release. The final phases turn retained practice evidence into six
tutorials and 24 screenshots, publish the 15-page catalog, and prove complete
cleanup of the live Sealos footprint.

## Phases

**Phase Numbering:**

- Integer phases (21 through 28): Planned v1.3 milestone work.
- New phase directories continue after the v1.2 roadmap while all existing
  mixed phase directories remain preserved.

- [x] **Phase 21: FastAPI Deploy Stage** - Deliver the public, behavior-tested (completed 2026-07-15)
  Tasks API starter that readers can run on port 8000.

- [x] **Phase 22: FastAPI PostgreSQL Stage** - Move Tasks API CRUD to a fresh (completed 2026-07-15)
  PostgreSQL database through SQLAlchemy, Alembic, and a migration Job.

- [x] **Phase 23: FastAPI Production Stage** - Publish the locked non-root (completed 2026-07-15)
  runtime and immutable FastAPI source stages with rollback-ready images.

- [x] **Phase 24: Django Deploy Stage** - Deliver the public, behavior-tested (completed 2026-07-15)
  Task Board starter with rendered pages, health, and administration access.

- [x] **Phase 25: Django PostgreSQL Stage** - Prove both migration paths and (completed 2026-07-16)
  move Task Board writes and reads to PostgreSQL through a one-shot Job.

- [ ] **Phase 26: Django Production Stage** - Publish the locked Gunicorn and
  WhiteNoise runtime with immutable Django source stages and rollback evidence.

- [ ] **Phase 27: Practice-Backed Tutorial Series** - Turn real local and
  Sealos runs into six English tutorials, retained evidence, and 24 screenshots.

- [ ] **Phase 28: Catalog Publication and Cleanup** - Publish the 15-page
  catalog, pass validator and static HTTP contracts, and prove resource cleanup.

## Phase Details

### Phase 21: FastAPI Deploy Stage

**Goal**: Readers can clone and run the first public Tasks API stage and verify
its framework-native HTTP behavior.
**Depends on**: Milestone initialization
**Requirements**: FAST-01
**Success Criteria** (what must be TRUE):

1. A reader can clone the public deploy-stage source, install its locked Python
   3.12 dependencies, and start it on `0.0.0.0:8000`.

2. A reader receives a successful response from `/health`, can open `/docs`,
   and can create, list, update, and delete tasks through public HTTP requests.

3. A maintainer can rerun the focused behavior suite and observe the committed
   red-green history for the health, documentation, and in-memory CRUD contract.

**Scope**:

- Establish the `Tasks API` Reference Application and its public repository.
- Add the smallest framework-native FastAPI service required by each public
  behavior test, with `uv`, `pyproject.toml`, `uv.lock`, and an exact exported
  `requirements.txt`.

- Preserve this deployable source state for the later `stage-1-deploy` tag.

**Validation Approach**: Run public HTTP behavior tests and a local port 8000
smoke check from a clean dependency install.
**Plans**: 3/3 plans complete

- [x] 21-01-PLAN.md
- [x] 21-02-PLAN.md
- [x] 21-03-PLAN.md

**UI hint**: yes

### Phase 22: FastAPI PostgreSQL Stage

**Goal**: Readers can run Tasks API against a fresh PostgreSQL database after a
single-owner migration completes.
**Depends on**: Phase 21
**Requirements**: TDD-01, FAST-02
**Success Criteria** (what must be TRUE):

1. A maintainer can provision a fresh test PostgreSQL database, run `alembic
   upgrade head`, and observe the required schema before application readiness
   succeeds.

2. A reader can create, list, update, and delete tasks through public HTTP and
   observe the same records after a process restart.

3. The focused FastAPI suite exercises `/health`, `/docs`, and `/tasks` against
   real PostgreSQL with SQLAlchemy 2, Alembic, and psycopg 3.

4. The one-shot migration Job can be rerun successfully and completes before
   workload scaling is accepted.

**Scope**:

- Replace the in-memory task store with the database-backed vertical slice.
- Add schema ownership, connection configuration, Alembic revisions, and the
  reusable migration Job contract.

- Preserve this deployable source state for the later
  `stage-2-postgresql` tag.

**Validation Approach**: Start from an empty PostgreSQL database, execute the
migration command, run the public HTTP suite, restart the application, and read
the retained record again.
**Plans**: 4/4 plans complete

- [x] 22-01-PLAN.md - Lock and audit the database stack, provision owned real PostgreSQL, and prove repeatable Alembic migration.
- [x] 22-02-PLAN.md - Move every Tasks API CRUD behavior to SQLAlchemy through public HTTP tracer bullets.
- [x] 22-03-PLAN.md - Gate readiness on schema and prove production/source migration Job contracts twice.
- [x] 22-04-PLAN.md - Publish the documented, evidenced, protected Stage 2 source and replay it from a fresh clone.

### Phase 23: FastAPI Production Stage

**Goal**: Readers can reproduce and roll back the complete production FastAPI
release from immutable public source and image references.
**Depends on**: Phase 22
**Requirements**: FAST-03, FAST-04
**Success Criteria** (what must be TRUE):

1. A reader can build and run the locked Python 3.12 image as a non-root user
   with one Uvicorn process bound to port 8000.

2. Sealos readiness observes `/health`, runtime logs identify the deployed
   image, and a previous immutable image reference can restore the prior
   working release.

3. The public repository resolves `stage-1-deploy`, `stage-2-postgresql`, and
   `stage-3-production`, and `main` matches the production-stage tree.

4. Each source stage retains its exact lock data and compatibility
   `requirements.txt` so a reader can reproduce the matching runtime.

**Scope**:

- Add the production container, non-root ownership, runtime command, readiness,
  logging, and immutable image conventions.

- Publish the three FastAPI source tags and align `main` with the final stage.
- Retain rollback inputs needed by the later Sealos practice run.

**Validation Approach**: Inspect the running container identity and process
model, probe readiness, compare Git trees for all tags, and exercise an image
rollback and recovery.
**Plans**: 4/4 plans executed

- [x] 23-01-PLAN.md - Publish the hardened baseline image and immutable GHCR digest.
- [x] 23-02-PLAN.md - Add production workload contracts, freeze reader source, and publish the final digest.
- [x] 23-03-PLAN.md - Prove baseline, final, rollback, and recovery on real Sealos infrastructure.
- [x] 23-04-PLAN.md - Publish protected Stage 3 and replay source plus image identities publicly.

### Phase 24: Django Deploy Stage

**Goal**: Readers can clone and run the first public Task Board stage and use
its rendered task workflow and administration entry point.
**Depends on**: Phase 23
**Requirements**: DJAN-01
**Success Criteria** (what must be TRUE):

1. A reader can clone the public deploy-stage source, install its locked Python
   3.12 dependencies, and start it on `0.0.0.0:8000`.

2. A reader receives a successful response from `/health`, can create and list
   tasks through rendered pages, and can open `/admin/login`.

3. A maintainer can rerun the focused behavior suite and observe the committed
   red-green history for health, task pages, and administration access.

**Scope**:

- Establish the `Task Board` Reference Application and its public repository.
- Add the smallest Django 5.2 LTS application required by each public behavior
  test, with `uv`, `pyproject.toml`, `uv.lock`, and an exact exported
  `requirements.txt`.

- Preserve this deployable source state for the later `stage-1-deploy` tag.

**Validation Approach**: Run public HTTP behavior tests and a local port 8000
browser and HTTP smoke check from a clean dependency install.
**Plans**: 5/5 plans complete

- [x] 24-01-PLAN.md
- [x] 24-02-PLAN.md
- [x] 24-03-PLAN.md
- [x] 24-04-PLAN.md
- [x] 24-05-PLAN.md

**UI hint**: yes

### Phase 25: Django PostgreSQL Stage

**Goal**: Readers can use persistent Task Board data after repeatable FastAPI
and Django migration Jobs have proven the shared fresh-database contract.
**Depends on**: Phase 24 and Phase 22
**Requirements**: TDD-02, TDD-03, DJAN-02
**Success Criteria** (what must be TRUE):

1. A maintainer can run `alembic upgrade head` and `python manage.py migrate`
   through their one-shot Jobs against fresh PostgreSQL databases and observe
   successful completion before application readiness.

2. A reader can use `/health`, create a task through the rendered Django form,
   read it on a later page request, and open `/admin/login` through public HTTP.

3. A reader can restart or scale the Django workload after migration and still
   observe the database-backed task record.

4. Both framework migration and runtime checks prove Job completion, readiness,
   and public read/write behavior with real PostgreSQL services.

**Scope**:

- Replace the initial task persistence with psycopg 3 and Django migrations.
- Add the Django migration Job, schema-aware readiness, and administrator-backed
  data verification path.

- Re-run the shared migration/runtime seam for both Reference Applications and
  preserve the Django source state for `stage-2-postgresql`.

**Validation Approach**: Start with empty databases, run both migration Jobs,
exercise public read/write checks, restart each workload, and verify retained
records.
**Plans**: 5/5 plans executed

- [x] 25-01-PLAN.md
- [x] 25-02-PLAN.md
- [x] 25-03-PLAN.md
- [x] 25-04-PLAN.md
- [x] 25-05-PLAN.md

**Verification**: 23/23 must-haves verified; TDD-02, TDD-03, and DJAN-02 complete.

**UI hint**: yes

### Phase 26: Django Production Stage

**Goal**: Readers can reproduce and roll back the complete production Django
release from immutable public source and image references.
**Depends on**: Phase 25
**Requirements**: DJAN-03, DJAN-04
**Success Criteria** (what must be TRUE):

1. A reader can build and run the locked Django 5.2 LTS image as a non-root
   user through Gunicorn WSGI on port 8000.

2. `collectstatic` output is served by WhiteNoise, Sealos readiness observes
   `/health`, and runtime logs identify the deployed image.

3. A previous immutable image reference can restore the prior working release
   while preserving PostgreSQL data.

4. The public repository resolves `stage-1-deploy`, `stage-2-postgresql`, and
   `stage-3-production`, and `main` matches the production-stage tree.

**Scope**:

- Add the production container, Gunicorn, WhiteNoise, static collection,
  non-root ownership, readiness, logging, and immutable image conventions.

- Publish the three Django source tags and align `main` with the final stage.
- Retain rollback inputs needed by the later Sealos practice run.

**Validation Approach**: Inspect the running container identity and process
model, load rendered pages and static assets, compare Git trees for all tags,
and exercise an image rollback and recovery.
**Plans**: 4/4 plans executed; independent verification pending

- [x] 26-01-PLAN.md
- [x] 26-02-PLAN.md
- [x] 26-03-PLAN.md
- [x] 26-04-PLAN.md

**UI hint**: yes

### Phase 27: Practice-Backed Tutorial Series

**Goal**: Readers can follow six coherent tutorials whose screenshots and
claims come from retained, reproducible FastAPI and Django practice evidence.
**Depends on**: Phase 26
**Requirements**: CONT-01, CONT-02, CONT-03, CONT-04, SHOT-01, SHOT-02, OPS-01
**Success Criteria** (what must be TRUE):

1. A reader can follow deploy, PostgreSQL, and production pages for either
   framework, with each page linked to its matching immutable source tag.

2. All six pages expose valid frontmatter, framework-local series navigation,
   correct stage order, current Sealos Skills terminology, and the established
   stage CTA.

3. Each of the 24 visible screenshots traces to retained local, Sealos,
   Kubernetes, HTTP, or browser evidence; sensitive values are redacted and the
   adjacent tutorial step matches the shown result.

4. Every screenshot is a 1440x900 WebP below 200 KB, and the retained evidence
   package reproduces deploy, migration, readiness, public read/write, logs,
   domain, and rollback checks.

5. Beginner titles apply the same measured deploy-command-to-public-health
   result for both frameworks and record the observed duration.

**Scope**:

- Run both three-stage workflows in a clean authenticated Sealos workspace and
  retain redacted commands, resource state, logs, timings, and browser results.

- Author the six English MDX pages from the verified workflow and immutable
  source tags.

- Render four dark evidence-card screenshots per page in the established style
  and wire them beside their matching steps.

**Validation Approach**: Cross-check every tutorial claim and image against the
evidence ledger, inspect frontmatter and series links, and verify image format,
dimensions, file size, redaction, and step relevance.
**Plans**: TBD
**UI hint**: yes

### Phase 28: Catalog Publication and Cleanup

**Goal**: Readers can navigate the complete 15-page tutorial catalog while
maintainers can verify its public contracts and the empty practice footprint.
**Depends on**: Phase 27
**Requirements**: TDD-04, SHOT-03, PUB-01, PUB-02, PUB-03, OPS-02
**Success Criteria** (what must be TRUE):

1. The tutorial matrix presents FastAPI and Django as available paths, and a
   reader can navigate all 15 tutorial pages and each three-page series.

2. `npm run validate-tutorials` passes for the 15-page catalog, six new source
   pages, their series relationships, required terminology, and image contract.

3. Static HTTP smoke checks return successful responses for the tutorial index,
   six new pages, and 24 new images with the expected image content type.

4. Every MDX image reference resolves to the intended local and static-output
   WebP asset.

5. Cleanup evidence shows that every practice `Instance`, workload, Service,
   Ingress, Job, PostgreSQL Cluster, PVC, Secret, and temporary image resource
   has been removed.

**Scope**:

- Complete the public validator CLI through focused red-green tests and promote
  both framework paths in the catalog matrix.

- Build the static site and exercise the reader-visible route and asset surface.
- Remove the full Sealos practice footprint and retain redacted before/after
  resource evidence.

**Validation Approach**: Run the validator CLI, TypeScript and static build
checks, issue static HTTP requests for every new route and asset, inspect the
matrix and navigation, then query each cleanup resource class.
**Plans**: TBD
**UI hint**: yes

## Requirement Coverage

Every one of the 24 v1.3 requirements is assigned to exactly one Phase detail
above. Traceability is mirrored in `.planning/REQUIREMENTS.md`.

**Coverage**: 24/24 v1.3 requirements mapped.

## Progress

**Execution Order:**
Phases execute in numeric order: 21 -> 22 -> 23 -> 24 -> 25 -> 26 -> 27 -> 28

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 21. FastAPI Deploy Stage | 3/3 | Complete    | 2026-07-15 |
| 22. FastAPI PostgreSQL Stage | 4/4 | Complete    | 2026-07-15 |
| 23. FastAPI Production Stage | 4/4 | Complete    | 2026-07-15 |
| 24. Django Deploy Stage | 5/5 | Complete    | 2026-07-15 |
| 25. Django PostgreSQL Stage | 5/5 | Complete | 2026-07-16 |
| 26. Django Production Stage | 4/4 | Verification Pending |  |
| 27. Practice-Backed Tutorial Series | 0/TBD | Not started | - |
| 28. Catalog Publication and Cleanup | 0/TBD | Not started | - |

---
*Roadmap created: 2026-07-15 for milestone v1.3*
