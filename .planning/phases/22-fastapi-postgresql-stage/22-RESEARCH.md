# Phase 22: FastAPI PostgreSQL Stage - Research

**Researched:** 2026-07-15
**Domain:** FastAPI, synchronous SQLAlchemy 2, Alembic, psycopg 3, PostgreSQL 17, and Kubernetes migration Jobs
**Confidence:** HIGH for architecture and environment; MEDIUM for fresh package releases

<user_constraints>
## User Constraints (from CONTEXT.md)
### Locked Decisions
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

### Deferred Ideas (OUT OF SCOPE)
- Non-root container hardening, application-image publication, horizontal
  replicas, rollout logs, and rollback are Phase 23 scope.
- The shared FastAPI/Django live migration-runtime acceptance seam is Phase 25.
- Tutorial prose, Sealos Skills output, and screenshots are Phase 27 scope.
</user_constraints>
## Summary
Use Alembic to create the only application schema, then make each FastAPI request open a short synchronous SQLAlchemy session over the explicit `postgresql+psycopg` driver. A fresh PostgreSQL 17.10 Deployment in Sealos supplies the real database for every behavior test; the harness owns it through a unique run label and removes the complete footprint through a trap. `[VERIFIED: phase context, SQLAlchemy 2.0 docs, Alembic docs, local cluster probes]`

The first HTTP tracer creates a task with one application instance and reads it with a second. Subsequent slices preserve list, PUT, delete, validation, 404, docs, and schema-aware health behavior. The production Job manifest and a source-mounted temporary Job prove repeatable `alembic upgrade head` before an application image exists. `[VERIFIED: confirmed TDD seam and Kubernetes Job docs]`

**Primary recommendation:** Build migrations first as executable infrastructure, then deliver one public HTTP persistence slice at a time and publish the exact accepted commit as protected `stage-2-postgresql`.

<phase_requirements>
## Phase Requirements
| ID | Description | Research Support |
|----|-------------|------------------|
| TDD-01 | Verify FastAPI health, documentation, and task CRUD through public HTTP with real test PostgreSQL. | Real-cluster harness, HTTP tracer sequence, per-test table reset, and quick/full commands. |
| FAST-02 | Provide SQLAlchemy 2, Alembic, psycopg 3, repeatable migration Job, and database-backed CRUD. | Exact stack, schema ownership, Job contracts, publication gates, and clean-clone proof. |
</phase_requirements>
## Exact New Package Set
| Package | Version | Role | Lock status |
|---------|---------|------|-------------|
| SQLAlchemy | 2.0.51 | ORM, engine, synchronous sessions | Direct runtime pin |
| Alembic | 1.18.5 | Exclusive schema migration owner | Direct runtime pin |
| psycopg | 3.3.4 with `[binary]` | SQLAlchemy PostgreSQL driver | Direct runtime pin |
| psycopg-binary | 3.3.4 | Bundled libpq implementation | Universal lock transitive |
| Mako | 1.3.12 | Alembic revision templates | Universal lock transitive |
| MarkupSafe | 3.0.3 | Mako dependency | Universal lock transitive |
| greenlet | 3.5.3 | SQLAlchemy platform dependency | Universal lock conditional |
| tzdata | 2026.3 | psycopg Windows timezone data | Universal lock conditional |

Versions resolve together on Python 3.12 with uv 0.10.9. `[VERIFIED: PyPI JSON, pip index, and isolated uv resolution]`
```bash
uv add 'sqlalchemy==2.0.51' 'alembic==1.18.5' 'psycopg[binary]==3.3.4'
uv lock --check
uv sync --locked
uv export --locked --no-dev --no-emit-project --no-hashes \
  --format requirements.txt --output-file requirements.txt
```
## Package Legitimacy Audit
| Package | Registry | Age | Downloads | Source Repo | Verdict | Disposition |
|---------|----------|-----|-----------|-------------|---------|-------------|
| SQLAlchemy | PyPI | Since 2006; latest 2026-06-15 | Unavailable from seam | `github.com/sqlalchemy/sqlalchemy` | SUS (`too-new`, `unknown-downloads`) | User delegated patch selection on 2026-07-15; verify PyPI metadata before lock. |
| Alembic | PyPI | Since 2011; latest 2026-06-25 | Unavailable from seam | `github.com/sqlalchemy/alembic` | SUS (`too-new`, `unknown-downloads`) | User delegated patch selection on 2026-07-15; verify PyPI metadata before lock. |
| psycopg | PyPI | Since 2021; latest 2026-05-01 | Unavailable from seam | `github.com/psycopg/psycopg` | SUS (`unknown-downloads`) | User delegated patch selection on 2026-07-15; verify PyPI metadata before lock. |
| psycopg-binary | PyPI | Since 2021; latest 2026-05-01 | Unavailable from seam | `github.com/psycopg/psycopg` | SUS (`unknown-downloads`) | Approved transitive of the delegated psycopg binary extra; verify lock identity. |
| Mako | PyPI | Since 2006; latest 2026-04-28 | Unavailable from seam | `github.com/sqlalchemy/mako` | SUS (`unknown-downloads`) | Approved Alembic transitive; verify lock and PyPI source. |
| MarkupSafe | PyPI | Since 2010; latest 2025-09-27 | Unavailable from seam | `github.com/pallets/markupsafe` | SUS (`unknown-downloads`) | Approved Mako transitive; verify lock and PyPI source. |
| greenlet | PyPI | Since 2006; latest 2026-06-26 | Unavailable from seam | `github.com/python-greenlet/greenlet` | SUS (`too-new`, `unknown-downloads`) | Approved SQLAlchemy conditional transitive; verify lock markers. |
| tzdata | PyPI | Since 2016; latest 2026-07-10 | Unavailable from seam | `github.com/python/tzdata` | SUS (`too-new`, `unknown-downloads`) | Approved psycopg conditional transitive; verify lock markers. |

**Packages removed due to SLOP verdict:** none. **Packages flagged SUS:** all eight rows because the seam lacks download telemetry and applies a freshness heuristic. Official documentation, registry metadata, source repositories, and the user's recorded version delegation satisfy the human disposition; execution repeats exact metadata and lock-tree checks before installation. `[VERIFIED: package-legitimacy seam and phase context]`
## Stage 2 File Map
| File | Responsibility |
|------|----------------|
| `app/database.py` | Resolve explicit URL, create engine/session factory, expose session and schema probe. |
| `app/models.py` | Declarative `Base` and mapped `TaskRecord`. |
| `app/main.py` | Pydantic HTTP models, factory, health, docs, and unchanged task routes. |
| `alembic.ini`, `migrations/env.py` | Read `DATABASE_URL`, load metadata, run online migrations with `NullPool`. |
| `migrations/versions/0001_create_tasks.py` | Immutable first revision and reversible `tasks` DDL. |
| `tests/conftest.py` | Require `TEST_DATABASE_URL`, create clients, truncate/reset identity around tests. |
| `tests/test_api.py` | Public HTTP persistence, CRUD, docs, errors, and readiness behaviors. |
| `tests/test_migrations.py` | Public Alembic CLI fresh-upgrade, current-head, and rerun contract. |
| `scripts/test-postgres.sh` | Sealos provisioning, port-forward, migrations, tests, Job proof, evidence, trap cleanup. |
| `deploy/migration-job.yaml` | Tracked application-image migration Job. |
| `deploy/source-migration-job.yaml` | Temporary ConfigMap-mounted source adapter used before Phase 23 image publication. |
| `README.md` | Stage 2 reader workflow, migration-before-readiness order, rerun and cleanup. |
## SQLAlchemy and Alembic Architecture
```text
HTTP -> create_app(explicit URL) -> Engine -> sessionmaker -> one Session/request
                                      |                -> CRUD transaction
                                      -> health connection -> tasks table probe
Fresh PostgreSQL -> alembic upgrade head -> alembic_version + tasks -> readiness 200
```
Use `create_app(database_url: str | None = None)`: tests pass `TEST_DATABASE_URL`; the exported app resolves `DATABASE_URL`. Configure `create_engine(url, pool_pre_ping=True)` and `sessionmaker(bind=engine, expire_on_commit=False)`, yield one closing Session per request, commit mutations, and retain FastAPI's Pydantic response models. `[CITED: https://docs.sqlalchemy.org/en/20/orm/session_basics.html]`

Map `TaskRecord.id` as an integer primary key, `title` as `String(200), nullable=False`, and `completed` as `Boolean, nullable=False` with Python and server defaults false. Alembic imports `Base.metadata`, injects `DATABASE_URL` into the online configuration dictionary, and uses `NullPool`; application and test code contain zero `create_all()` calls. `[CITED: https://alembic.sqlalchemy.org/en/latest/tutorial.html]`

`/health` opens a real connection and checks the `tasks` table. Success returns `200 {"status":"ok"}`; missing configuration, connection failure, and missing schema return `503 {"detail":"Database is not ready"}` while logs retain the internal cause. `[VERIFIED: D-04 and SQLAlchemy inspection pattern]`
## Real Sealos PostgreSQL Harness
Use `postgres:17.10-bookworm@sha256:4f736ae292687621d4dbe0d499ffd024a36bd2ee7d8ca6f2ccd4c800f047b394`, a generated alphanumeric password, `emptyDir` at `/var/lib/postgresql/data`, 250m CPU, and 512Mi memory as the initial temporary profile. `[VERIFIED: PostgreSQL current-minor policy, Docker Official Image registry, and D-01]`

`scripts/test-postgres.sh` creates a run ID, names every object `tutorial-fastapi-pg-test-$RUN_ID-*`, and labels every object `tutorial.sealos.io/run-id=$RUN_ID`. It creates Secret, Deployment, and ClusterIP Service; waits for rollout and in-pod `pg_isready`; starts an owned `kubectl port-forward`; bounds local TCP readiness; exports the two URLs only to child processes; and records redacted evidence. `[VERIFIED: Kubernetes Deployment, Service, Secret, and port-forward docs]`

The harness runs pre-migration 503, `alembic upgrade head` twice, the full HTTP suite, a second application instance reading a retained task, both migration Jobs, and final inventory. Its EXIT trap kills only the recorded port-forward PID, deletes `job,deploy,svc,secret,configmap` with the exact run label, waits for dependents, and asserts zero matching objects. `[VERIFIED: D-01, D-08, and Kubernetes Job cleanup docs]`
## TDD Tracer Sequence
| Slice | RED specification and expected reason | GREEN implementation | Exact commits |
|-------|---------------------------------------|----------------------|---------------|
| 1 | Fresh `alembic upgrade head` exits because migration config is absent. | Add config, environment, and first revision; second upgrade stays at head. | `test(migrations): specify repeatable schema upgrade` / `feat(migrations): add tasks schema revision` |
| 2 | POST in app A then GET in app B returns Stage 1's 404. | Add engine, mapped task, session dependency, database create/read. | `test(db): specify task persistence across app instances` / `feat(db): persist task create and read` |
| 3 | App B list omits the record created by app A. | Select persisted tasks ordered by ID. | `test(db): specify persisted task listing` / `feat(db): list persisted tasks` |
| 4 | PUT result disappears through app B. | Update and commit the mapped row. | `test(db): specify persisted task updates` / `feat(db): update persisted tasks` |
| 5 | Deleted record remains readable through app B. | Delete and commit the mapped row. | `test(db): specify persisted task deletion` / `feat(db): delete persisted tasks` |
| 6 | Stage 1 health returns 200 for missing URL, closed port, or blank schema. | Add connection and schema readiness probe with stable 503. | `test(health): specify database readiness states` / `feat(health): gate readiness on migrated schema` |
| 7 | Job dry-run/completion contract has no artifact. | Add production manifest and source adapter; complete and recreate the Job. | `test(deploy): specify repeatable migration Job` / `feat(deploy): add migration Job contracts` |

Before and after each HTTP test, execute `TRUNCATE TABLE tasks RESTART IDENTITY` through a fixture. This fixture manages test isolation; assertions observe behavior exclusively through HTTP. Each client owns a fresh app/engine, which proves process restart persistence while the shared database retains the row. `[VERIFIED: confirmed TDD seam and TDD skill]`
## Migration Job Contracts
`deploy/migration-job.yaml` uses `batch/v1`, `restartPolicy: Never`, `backoffLimit: 1`, `activeDeadlineSeconds: 300`, working directory `/app`, command `alembic upgrade head`, `DATABASE_URL` from Secret key `url`, and `ghcr.io/yangchuansheng/sealos-fastapi-tutorial:stage-2-postgresql`. Validate with `kubectl apply --dry-run=server --validate=strict -f deploy/migration-job.yaml`. `[CITED: https://kubernetes.io/docs/concepts/workloads/controllers/job/]`

The source adapter mounts tracked app, migration, lock-export, and configuration files from a run-scoped ConfigMap into `python:3.12.13-slim-bookworm`, installs the exact runtime export into a temporary target, and runs the same Alembic command. A completed Job reruns through delete-and-recreate; both runs must reach `Complete`, and `alembic current` must equal the immutable revision. `[VERIFIED: D-06 and Kubernetes Job lifecycle]`
## Publication, Recovery, and Cleanup
After the full harness passes, commit README/evidence, push accepted `main`, create `git tag -a stage-2-postgresql -m 'FastAPI PostgreSQL stage'`, and push the tag. Verify `git cat-file -t` returns `tag`; direct and peeled remote refs exist; peeled tag equals remote `main`; the active ruleset still targets `refs/tags/stage-*` with update/deletion restrictions; and `stage-1-deploy^{}` remains unchanged. `[CITED: https://git-scm.com/docs/git-ls-remote.html and GitHub ruleset docs]`

A fresh public clone of `stage-2-postgresql` must run locked sync, reproduce `requirements.txt`, and pass `scripts/test-postgres.sh`. Publication starts after local acceptance, which keeps recovery limited to completing the main/tag push while preserving all immutable refs. `[VERIFIED: D-07 and Phase 21 publication precedent]`

Retain only redacted Phase 22 evidence and Git/GitHub source state. The phase gate requires zero run-labeled Kubernetes objects, a stopped port-forward, a clean local tree, unchanged Stage 1 identity, and matching Stage 2 local/remote/tag commits. `[VERIFIED: D-08]`
## Risks and Guardrails
- Alembic drift appears when application startup creates tables; scan for `create_all` and prove fresh migration before readiness. `[VERIFIED: D-03]`
- A shared Session crosses request/thread boundaries; create one Session per request and close it deterministically. `[CITED: SQLAlchemy Session Basics]`
- A completed Job stays complete after apply; delete and recreate it, then wait for `condition=complete`. `[CITED: Kubernetes Jobs]`
- Mutable database tags weaken replay; pin the PostgreSQL minor and multi-architecture digest. `[VERIFIED: Docker Hub tag API]`
- Broad cleanup selectors threaten user resources; exact run labels and post-delete zero inventory bound ownership. `[VERIFIED: D-01]`
- URL-special passwords break DSNs; generate alphanumeric credentials and keep Secret values out of logs and evidence. `[VERIFIED: security analysis]`
## Runtime State Inventory
| Category | Items Found | Action Required |
|----------|-------------|-----------------|
| Stored data | Stage 1 data exists only in process memory. | Start from fresh PostgreSQL; migrate schema only. |
| Live service config | Run-scoped Sealos Kubernetes resources. | Label, inventory, and delete the exact run. |
| OS-registered state | One local port-forward child process. | Record PID, trap termination, verify port closes. |
| Secrets/env vars | Generated Secret, `DATABASE_URL`, `TEST_DATABASE_URL`. | Avoid stdout, redact evidence, delete Secret. |
| Build artifacts | Updated lock/export plus ignored caches and virtualenv. | Commit lock/export; keep caches untracked. |
## Project Constraints (from AGENTS.md)
Use the active GSD phase workflow, write planning/code/comments/commits/PR text in English, keep edits surgical, drive each behavior through a verified public seam, preserve unrelated resources and worktree changes, and verify every external-state action before closing the phase.
## Validation Architecture
### Test Framework
| Property | Value |
|----------|-------|
| Framework | pytest 9.1.1, FastAPI TestClient/HTTPX 0.28.1, real PostgreSQL 17.10 |
| Config | `pyproject.toml`, `tests/conftest.py`, `tests/test_api.py`, `tests/test_migrations.py` |
| Quick command | `TEST_DATABASE_URL="$URL" uv run pytest tests/test_api.py -q -x` |
| Full command | `./scripts/test-postgres.sh` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test type | Automated command | File exists? |
|--------|----------|-----------|-------------------|--------------|
| TDD-01 | Health/docs/CRUD and restart persistence through HTTP on real PostgreSQL | integration | `TEST_DATABASE_URL="$URL" uv run pytest tests/test_api.py -q -x` | `test_api.py` exists; DB fixtures are Wave 0 |
| FAST-02 | Fresh/repeat Alembic, production Job schema, source Job completion, lock/export, public stage | integration/e2e | `./scripts/test-postgres.sh` | Wave 0 |

### Observable Outcomes
- Pre-migration, missing configuration, and unreachable database each return the stable HTTP 503 body; migrated health returns the exact HTTP 200 body.
- Two `alembic upgrade head` invocations exit 0 and `alembic current` reports `0001`; application code never writes schema.
- All inherited HTTP cases pass against PostgreSQL; app B reads app A's create/update/delete results.
- Production Job passes strict server dry-run; two source Job executions reach `Complete` before readiness acceptance.
- Lock/export regenerate with zero diff; fresh public tag clone passes the full harness; cleanup inventory is empty.

### Sampling Rate
- **Per RED commit:** Run one named test and retain its specified failure.
- **Per GREEN commit:** Run the same named test, then `tests/test_api.py -q -x` against the active database.
- **Per wave:** Run migration tests, full HTTP tests, lock/export, and Job server dry-run.
- **Phase gate:** Run `./scripts/test-postgres.sh`, public-clone replay, tag/ruleset checks, and zero-resource cleanup proof.

### Wave 0 Gaps
- [ ] `tests/conftest.py` real-PostgreSQL URL, client, and truncate/reset fixtures.
- [ ] `tests/test_migrations.py` fresh upgrade, current head, and rerun seam.
- [ ] `scripts/test-postgres.sh` owned resource lifecycle and evidence harness.
- [ ] `deploy/source-migration-job.yaml` pre-image validation adapter.
## Security Domain
| ASVS Category | Applies | Standard Control |
|---------------|---------|------------------|
| V2 Authentication | No | Educational API endpoints remain public by contract. |
| V3 Session Management | No | HTTP identity sessions are outside this phase. |
| V4 Access Control | No | Public task access remains the confirmed contract. |
| V5 Input Validation | Yes | Pydantic bounds plus SQLAlchemy parameter binding. |
| V6 Cryptography | Credentials only | Kubernetes Secret, redacted evidence, cluster transport policy. |
## Environment Availability
| Dependency | Available | Version/state | Phase use |
|------------|-----------|---------------|-----------|
| Python | Yes | 3.12.13 | Application, tests, port checks |
| uv | Yes | 0.10.9 | Lock, sync, run, export |
| kubectl | Yes | 1.35.0; context `dn9ue3wz@sealos` | Sealos PostgreSQL and Jobs |
| Namespace RBAC | Yes | `ns-let51wad`; create/delete Deployment, Service, Job, Secret, ConfigMap | Harness lifecycle |
| gh / Git | Yes | gh 2.86.0; Git 2.50.1 | Publication and tag proof |
| curl / jq | Yes | curl 8.7.1; jq 1.7.1 | HTTP and JSON evidence |
| Docker / psql | Missing | CLIs absent | Kubernetes PostgreSQL and in-pod `pg_isready` are the validated adapter |
## Sources
- SQLAlchemy 2.0 Session Basics and PostgreSQL psycopg dialect: `https://docs.sqlalchemy.org/en/20/orm/session_basics.html`, `https://docs.sqlalchemy.org/en/20/dialects/postgresql.html`.
- Alembic tutorial and command API: `https://alembic.sqlalchemy.org/en/latest/tutorial.html`, `https://alembic.sqlalchemy.org/en/latest/api/commands.html`.
- Psycopg 3 installation: `https://www.psycopg.org/psycopg3/docs/basic/install.html`.
- PostgreSQL version policy and Docker Official Image: `https://www.postgresql.org/support/versioning/`, `https://hub.docker.com/_/postgres/`.
- Kubernetes Jobs, Services, Secrets, apply, and port-forward: `https://kubernetes.io/docs/concepts/workloads/controllers/job/`, `https://kubernetes.io/docs/concepts/services-networking/service/`, `https://kubernetes.io/docs/concepts/configuration/secret/`, `https://kubernetes.io/docs/reference/kubectl/generated/kubectl_apply/`.
- Git annotated/peeled refs and GitHub tag rulesets: `https://git-scm.com/docs/git-ls-remote.html`, `https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets`.
- Astral uv export: `https://docs.astral.sh/uv/concepts/projects/export/`.
## Metadata
Package recommendations remain current through 2026-07-22; architecture and validation remain current while `22-CONTEXT.md` stays unchanged. No unresolved assumptions remain.
