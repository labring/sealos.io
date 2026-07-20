# Phase 25: Django PostgreSQL Stage - Context

**Gathered:** 2026-07-15
**Status:** Ready for planning
**Source:** Confirmed milestone decisions plus verified Phase 22 and Phase 24 contracts

<domain>
## Phase Boundary

Evolve the public Django `Task Board` Reference Application from local SQLite
to PostgreSQL-backed persistence. This phase ends when Django migrations succeed
from a fresh database and at the current head, schema-aware health gates
readiness, public task data survives an application restart, the one-shot Job
contract completes twice, the shared FastAPI migration/runtime seam is rerun,
and the accepted source is published as `stage-2-postgresql`.

</domain>

<decisions>
## Implementation Decisions

### Real PostgreSQL Test Boundary

- **D-01:** Provision a dedicated temporary PostgreSQL 17 service in the
  authenticated Sealos Kubernetes namespace `ns-let51wad`, expose it locally
  through `kubectl port-forward`, and run the Django suite against that real
  server.
- Use unique `tutorial-django-pg-test-*` resources, an `emptyDir` data volume,
  a generated Secret, bounded rollout and port-forward waits, and exact
  `tutorial.sealos.io/run-id` ownership labels.
- Keep the Django and FastAPI database runs independent. Delete and query only
  resources carrying the exact current run label.

### Django Database Configuration

- **D-02:** Add psycopg 3 and require an explicit PostgreSQL `DATABASE_URL` for
  Stage 2 runtime and migration commands. Tests receive
  `TEST_DATABASE_URL` explicitly through the harness.
- Convert the URL to Django's native `DATABASES` structure with the Python
  standard library. Accept PostgreSQL schemes only and keep credentials in
  environment or Secret values.
- Preserve the existing `Task` model, form, routes, template, and public page
  contract. Stage 2 source has no SQLite runtime fallback.

### Migration Ownership

- **D-03:** Keep Django migrations as the exclusive schema owner. Preserve the
  committed `tasks.0001_initial` migration unchanged and never create tables
  from application startup or test helpers.
- `python manage.py migrate --noinput` must succeed against a fresh PostgreSQL
  database and succeed again at the current migration head.
- Commit a production migration Job that runs the same command and reads
  `DATABASE_URL` from Secret key `url`.

### Health and Readiness

- **D-04:** Return HTTP 200 with exact `{"status": "ok"}` only when PostgreSQL
  is reachable and the `tasks` table exists. Return HTTP 503 with exact
  `{"status": "unavailable"}` for missing configuration, connection failure,
  or an unmigrated schema.
- Treat completed migration as a prerequisite for workload readiness, restart,
  and future horizontal scaling.

### Public Behavior and TDD

- **D-05:** Keep the five Stage 1 public HTTP behaviors and add real-PostgreSQL
  proof for schema-aware health and persistence across independent application
  server processes.
- Retain one RED commit before the minimum database configuration and health
  implementation. Exercise Django routing, ORM, forms, templates, middleware,
  and administration with real collaborators.
- Prove persistence through public POST/redirect/GET, stop the owned server,
  start a new process against the same database, and read the retained task
  through `GET /`.

### Migration Job and Shared Framework Gate

- **D-06:** Commit `deploy/migration-job.yaml` as the future application-image
  contract and a source-based validation adapter for execution before Phase 26
  publishes the production image.
- Validate the production Job server-side and run the source-based Job twice by
  deleting and recreating it, observing `Complete` each time before accepting
  readiness.
- Rerun the verified FastAPI PostgreSQL phase gate and the Django phase gate in
  this phase. Record both migration commands, Job completions, readiness, public
  read/write behavior, restart persistence, and cleanup.

### Reproducible Stage Identity

- **D-07:** Update the Python 3.12 `uv.lock` and exact runtime-only
  `requirements.txt`, preserve `stage-1-deploy`, and publish accepted source as
  annotated `stage-2-postgresql` with message `Django PostgreSQL stage`.
- Keep public `main` aligned with the accepted PostgreSQL source until Phase 26.
  Verify direct tag object, peeled commit, existing active tag ruleset, and a
  fresh public tag clone against a fresh real PostgreSQL database.

### Evidence and Cleanup

- **D-08:** Retain credential-free evidence for package identity, migrations,
  Job status, HTTP behavior, browser behavior, source identity, and cleanup in
  the Phase 25 planning package.
- Delete every temporary Deployment, Pod, Service, Job, Secret, ConfigMap,
  database, port-forward, server process, browser session, and public replay
  clone before completion. Preserve the public source repository and protected
  stage tags.

### Stage Fence

- **D-09:** Keep Gunicorn, WhiteNoise, `collectstatic`, the non-root production
  container, application images, replicas, rollout logs, and rollback in Phase
  26. Keep tutorial prose and screenshots in Phase 27.

### the agent's Discretion

- Choose the exact current psycopg 3 patch after official package verification.
- Choose compact URL parsing helpers, stable database error logging, and
  bounded PostgreSQL resource values.
- Choose the source-based Job packaging mechanism and evidence filenames while
  preserving the tracked production Job and zero-credential contract.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

- `.planning/ROADMAP.md` - Phase 25 goal, dependencies, and success criteria.
- `.planning/REQUIREMENTS.md` - TDD-02, TDD-03, and DJAN-02 contracts.
- `.planning/phases/22-fastapi-postgresql-stage/22-CONTEXT.md` - verified real
  PostgreSQL, migration Job, readiness, identity, and cleanup decisions.
- `.planning/phases/22-fastapi-postgresql-stage/22-VERIFICATION.md` - accepted
  FastAPI migration/runtime and zero-residue evidence.
- `.planning/phases/24-django-deploy-stage/24-VERIFICATION.md` - accepted
  Django Stage 1 behavior, source history, and public identity.
- `.planning/quick/260715-e9k-define-fastapi-and-django-tutorial-expan/260715-e9k-CONTEXT.md`
  - milestone-wide runtime, TDD, evidence, tagging, and cleanup decisions.
- `AGENTS.md` - repository execution, language, GSD, and response rules.
- `/Users/longnv/bin/repo/sealos-django-tutorial` - verified public Django
  Reference Application repository.
- `/Users/longnv/bin/repo/sealos-fastapi-tutorial` - verified shared
  PostgreSQL phase-gate implementation.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- Django Stage 1 provides the stable model, initial migration, form, rendered
  page, administration registration, five public tests, and protected tag.
- FastAPI Stage 2 provides the run-labeled PostgreSQL 17 lifecycle, detached
  port-forward supervision, production/source Job split, strict validation,
  repeat completion, evidence redaction, and cleanup assertions.

### Established Patterns

- Migration tooling exclusively owns schema changes; application startup waits
  for schema readiness and never creates tables.
- Public HTTP behavior is the acceptance seam. Persistence is proven through a
  later process and page read.
- Every temporary infrastructure object carries one exact run label and every
  retained source stage is a protected annotated tag.

### Integration Points

- Phase 26 consumes the PostgreSQL settings, readiness behavior, migration Job,
  immutable Stage 2 source, and retained database continuity contract.
- Phase 27 consumes the Stage 2 public tag and real PostgreSQL evidence for the
  Django database tutorial and screenshots.

</code_context>

<specifics>
## Specific Ideas

- Reuse the FastAPI harness command grammar so operators can run session,
  pytest-only, migrations-only, jobs-only, phase-gate, and assert-clean modes
  consistently across both repositories.
- Keep the existing Task migration immutable; the database transition should
  change configuration and verification, not the schema history.
- Use one persisted task to prove public readback before and after an owned
  Django server restart.

</specifics>

<deferred>
## Deferred Ideas

- Production serving, static collection, containers, images, replicas,
  rollback, and recovery remain Phase 26 scope.
- Tutorial prose, measured duration, Sealos Skills practice, and screenshots
  remain Phase 27 scope.
- Catalog validation, static route checks, and milestone-wide final cleanup
  remain Phase 28 scope.

</deferred>

---

*Phase: 25-django-postgresql-stage*
*Context gathered: 2026-07-15 from confirmed decisions and verified prior-stage patterns*
