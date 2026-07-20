# Phase 22: FastAPI PostgreSQL Stage - Context

**Gathered:** 2026-07-15
**Status:** Ready for planning
**Source:** Confirmed milestone context plus verified local environment

<domain>
## Phase Boundary

Evolve the public FastAPI `Tasks API` Reference Application from process-local
state to PostgreSQL-backed CRUD. This phase ends when migrations create a fresh
schema, every public HTTP behavior runs against real PostgreSQL, records survive
an application-process restart, the migration Job contract is repeatable, and
the accepted source is published as `stage-2-postgresql`.

</domain>

<decisions>
## Implementation Decisions

### Real PostgreSQL Test Boundary

- **D-01:** Provision a dedicated temporary PostgreSQL 17 service in the
  authenticated Sealos Kubernetes namespace `ns-let51wad`, expose it locally
  through `kubectl port-forward`, and run the focused suite against that real
  server.
- Use unique `tutorial-fastapi-pg-test-*` resource names, an `emptyDir` data
  volume, a generated Secret, rollout waiting, bounded port-forward readiness,
  and trap-based deletion.
- Query and delete only resources created by this test workflow. Preserve every
  pre-existing workload, Service, Job, Secret, and PVC.

### Database Architecture

- **D-02:** Use synchronous SQLAlchemy 2 sessions and psycopg 3 behind the
  existing FastAPI public HTTP contract.
- Read the connection string from `DATABASE_URL`; tests use
  `TEST_DATABASE_URL` and pass it explicitly to `create_app()`.
- Model `tasks` with an auto-incrementing integer primary key, a 200-character
  title, and a non-null boolean `completed` defaulting to false.
- Keep request/response models in the HTTP module and persistence models in a
  dedicated database layer.

### Migration Ownership

- **D-03:** Use Alembic as the exclusive schema owner. Application startup and
  tests never call SQLAlchemy `create_all()`.
- The first revision creates `tasks`; `alembic upgrade head` succeeds against a
  fresh database and succeeds again at the current head.
- Commit `alembic.ini`, environment configuration, and the immutable revision.

### Health and Rollout Readiness

- **D-04:** Keep `/health` at HTTP 200 only when PostgreSQL is reachable and the
  `tasks` schema exists. Return HTTP 503 with a stable public detail while the
  database is unconfigured, unreachable, or awaiting migration.
- Treat successful migration completion as a prerequisite for application
  readiness and future horizontal scaling.

### Public Behavior and TDD

- **D-05:** Keep `/docs` and the existing create, list, item read, complete PUT,
  delete, validation, and stable 404 contracts unchanged.
- Add a public behavior proving a task created through one `create_app()`
  instance remains readable through a later instance using the same database.
- Drive database persistence with a failing public HTTP test before the minimum
  database-backed implementation. Exercise every database-stage behavior with
  real PostgreSQL and real framework collaborators.

### Migration Job Contract

- **D-06:** Commit `deploy/migration-job.yaml` as a one-shot Kubernetes Job that
  runs `alembic upgrade head`, reads `DATABASE_URL` from a Secret, and uses the
  application image reference consumed by the production stage.
- Validate Job schema server-side in this phase. Run an equivalent temporary
  source-based Job against the test database to prove completion and rerun
  behavior before the production image exists; Phase 23 replaces the validation
  adapter with the published application image.
- Wait for Job completion before accepting application readiness.

### Reproducible Stage Identity

- **D-07:** Update the existing Python 3.12 `uv.lock` and exact runtime-only
  `requirements.txt`, preserve the immutable `stage-1-deploy` tag, and publish
  the accepted source as annotated `stage-2-postgresql`.
- Keep public `main` aligned with the accepted PostgreSQL stage until Phase 23.
- Verify tag object, peeled commit, active `refs/tags/stage-*` ruleset, and a
  clean public clone with a fresh real PostgreSQL database.

### Cleanup and Evidence

- **D-08:** Retain redacted commands, Job status, migration state, HTTP results,
  and cleanup inventory as Phase 22 evidence.
- Delete every temporary test Deployment, Pod, Service, Job, Secret, ConfigMap,
  and port-forward process before phase completion.

### the agent's Discretion

- Select compatible current patch releases for SQLAlchemy, Alembic, and psycopg.
- Choose compact module names, session dependency wiring, and stable 503 detail.
- Choose CPU/memory values for the temporary PostgreSQL test workload.
- Choose the exact source-based Job validation adapter while preserving the
  production Job contract and cleanup requirements.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

- `.planning/ROADMAP.md` - Phase 22 goal, dependency, and success criteria.
- `.planning/REQUIREMENTS.md` - TDD-01 and FAST-02 contracts.
- `.planning/phases/21-fastapi-deploy-stage/21-VERIFICATION.md` - Accepted Stage 1 behavior and source identity.
- `.planning/quick/260715-e9k-define-fastapi-and-django-tutorial-expan/260715-e9k-CONTEXT.md` - Milestone-wide PostgreSQL, migration Job, runtime, tagging, evidence, and cleanup decisions.
- `AGENTS.md` - Repository execution and language rules.
- `/Users/longnv/bin/repo/sealos-fastapi-tutorial` - Public Reference Application implementation repository.

</canonical_refs>

<specifics>
## Specific Ideas

- Use a shell harness under `scripts/` to own temporary PostgreSQL provisioning,
  port-forward lifecycle, migration execution, tests, evidence, and cleanup.
- Truncate the migrated table and reset its identity between behavior tests;
  use only HTTP for behavior assertions.
- Make the migration Job reusable by changing only its image and Secret name.

</specifics>

<deferred>
## Deferred Ideas

- Non-root container hardening, application-image publication, horizontal
  replicas, rollout logs, and rollback are Phase 23 scope.
- The shared FastAPI/Django live migration-runtime acceptance seam is Phase 25.
- Tutorial prose, Sealos Skills output, and screenshots are Phase 27 scope.

</deferred>

---

*Phase: 22-fastapi-postgresql-stage*
*Context gathered: 2026-07-15 from confirmed decisions and environment probes*
