# Phase 25: Django PostgreSQL Stage - Research

**Researched:** 2026-07-16
**Domain:** Django 5.2, psycopg 3, real PostgreSQL 17, Django migrations, Kubernetes migration Jobs, public restart persistence, and protected Stage 2 publication
**Confidence:** HIGH for repository, runtime, and package identity; MEDIUM for documentation-derived API guidance

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions [VERIFIED: `.planning/phases/25-django-postgresql-stage/25-CONTEXT.md`]

#### Real PostgreSQL Test Boundary

- **D-01:** Provision a dedicated temporary PostgreSQL 17 service in the
  authenticated Sealos Kubernetes namespace `ns-let51wad`, expose it locally
  through `kubectl port-forward`, and run the Django suite against that real
  server.
- Use unique `tutorial-django-pg-test-*` resources, an `emptyDir` data volume,
  a generated Secret, bounded rollout and port-forward waits, and exact
  `tutorial.sealos.io/run-id` ownership labels.
- Keep the Django and FastAPI database runs independent. Delete and query only
  resources carrying the exact current run label.

#### Django Database Configuration

- **D-02:** Add psycopg 3 and require an explicit PostgreSQL `DATABASE_URL` for
  Stage 2 runtime and migration commands. Tests receive
  `TEST_DATABASE_URL` explicitly through the harness.
- Convert the URL to Django's native `DATABASES` structure with the Python
  standard library. Accept PostgreSQL schemes only and keep credentials in
  environment or Secret values.
- Preserve the existing `Task` model, form, routes, template, and public page
  contract. Stage 2 source has no SQLite runtime fallback.

#### Migration Ownership

- **D-03:** Keep Django migrations as the exclusive schema owner. Preserve the
  committed `tasks.0001_initial` migration unchanged and never create tables
  from application startup or test helpers.
- `python manage.py migrate --noinput` must succeed against a fresh PostgreSQL
  database and succeed again at the current migration head.
- Commit a production migration Job that runs the same command and reads
  `DATABASE_URL` from Secret key `url`.

#### Health and Readiness

- **D-04:** Return HTTP 200 with exact `{"status": "ok"}` only when PostgreSQL
  is reachable and the `tasks` table exists. Return HTTP 503 with exact
  `{"status": "unavailable"}` for missing configuration, connection failure,
  or an unmigrated schema.
- Treat completed migration as a prerequisite for workload readiness, restart,
  and future horizontal scaling.

#### Public Behavior and TDD

- **D-05:** Keep the five Stage 1 public HTTP behaviors and add real-PostgreSQL
  proof for schema-aware health and persistence across independent application
  server processes.
- Retain one RED commit before the minimum database configuration and health
  implementation. Exercise Django routing, ORM, forms, templates, middleware,
  and administration with real collaborators.
- Prove persistence through public POST/redirect/GET, stop the owned server,
  start a new process against the same database, and read the retained task
  through `GET /`.

#### Migration Job and Shared Framework Gate

- **D-06:** Commit `deploy/migration-job.yaml` as the future application-image
  contract and a source-based validation adapter for execution before Phase 26
  publishes the production image.
- Validate the production Job server-side and run the source-based Job twice by
  deleting and recreating it, observing `Complete` each time before accepting
  readiness.
- Rerun the verified FastAPI PostgreSQL phase gate and the Django phase gate in
  this phase. Record both migration commands, Job completions, readiness, public
  read/write behavior, restart persistence, and cleanup.

#### Reproducible Stage Identity

- **D-07:** Update the Python 3.12 `uv.lock` and exact runtime-only
  `requirements.txt`, preserve `stage-1-deploy`, and publish accepted source as
  annotated `stage-2-postgresql` with message `Django PostgreSQL stage`.
- Keep public `main` aligned with the accepted PostgreSQL source until Phase 26.
  Verify direct tag object, peeled commit, existing active tag ruleset, and a
  fresh public tag clone against a fresh real PostgreSQL database.

#### Evidence and Cleanup

- **D-08:** Retain credential-free evidence for package identity, migrations,
  Job status, HTTP behavior, browser behavior, source identity, and cleanup in
  the Phase 25 planning package.
- Delete every temporary Deployment, Pod, Service, Job, Secret, ConfigMap,
  database, port-forward, server process, browser session, and public replay
  clone before completion. Preserve the public source repository and protected
  stage tags.

#### Stage Fence

- **D-09:** Keep Gunicorn, WhiteNoise, `collectstatic`, the non-root production
  container, application images, replicas, rollout logs, and rollback in Phase
  26. Keep tutorial prose and screenshots in Phase 27.

### the agent's Discretion [VERIFIED: `.planning/phases/25-django-postgresql-stage/25-CONTEXT.md`]

- Choose the exact current psycopg 3 patch after official package verification.
- Choose compact URL parsing helpers, stable database error logging, and
  bounded PostgreSQL resource values.
- Choose the source-based Job packaging mechanism and evidence filenames while
  preserving the tracked production Job and zero-credential contract.

### Deferred Ideas (OUT OF SCOPE) [VERIFIED: `.planning/phases/25-django-postgresql-stage/25-CONTEXT.md`]

- Production serving, static collection, containers, images, replicas,
  rollback, and recovery remain Phase 26 scope.
- Tutorial prose, measured duration, Sealos Skills practice, and screenshots
  remain Phase 27 scope.
- Catalog validation, static route checks, and milestone-wide final cleanup
  remain Phase 28 scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| TDD-02 | Maintainer can verify Django health, task creation/listing, and administration login through public HTTP. | Preserve the five accepted Stage 1 tests, add schema-state health cases, and prove browser/public restart readback against real PostgreSQL. `[VERIFIED: .planning/REQUIREMENTS.md; .planning/phases/24-django-deploy-stage/24-VERIFICATION.md]` |
| TDD-03 | Maintainer can run each migration command against fresh PostgreSQL and observe migration completion, readiness, and public read/write behavior. | Run `migrate --noinput` fresh and at head, execute the source Job twice, gate health on `tasks_task`, rerun FastAPI, and record restart persistence. `[VERIFIED: .planning/REQUIREMENTS.md; Phase 22 accepted harness]` |
| DJAN-02 | Reader can use psycopg 3, repeatable Django migrations, a one-shot migration Job, and database-backed task reads. | The exact package, settings parser, immutable migration, Job split, public persistence seam, tag, and fresh-clone gate below cover the reader contract. `[VERIFIED: .planning/REQUIREMENTS.md]` |
</phase_requirements>

## Summary

Retain Django `5.2.16`, add `psycopg[binary]==3.3.4`, and translate one explicit
PostgreSQL URL into Django's native `DATABASES` fields. Use a dummy backend
sentinel only to let `/health` report the locked 503 payload when configuration
is absent; every migration, board, admin, and accepted ready path receives a
real PostgreSQL URL. `[VERIFIED: official PyPI metadata and upstream tags; CITED: https://docs.djangoproject.com/en/5.2/ref/databases/; CITED: https://docs.djangoproject.com/en/5.2/ref/settings/#databases]`

Keep `tasks/migrations/0001_initial.py` byte-for-byte unchanged. Run Django's
migration command against fresh and current-head databases, then execute the
same command through an allowlisted ConfigMap source Job twice. Health becomes
ready only after Django introspection sees `Task._meta.db_table`, whose accepted
Stage 1 value is `tasks_task`. `[VERIFIED: local Django 5.2.16 source, Stage 1 migration SHA-256 `745bc45f655bf0b164c1464c0c22786d22910e2aea235772e5dcea38495e4bf3`; CITED: https://docs.djangoproject.com/en/5.2/ref/django-admin/#migrate]`

The phase gate starts one Django server, creates a task through CSRF-protected
public POST/redirect/GET, stops that owned process, starts a second process over
the same database, and reads the retained row. Publication follows only after
the local gate, independent FastAPI gate, protected annotated tag, and a fresh
public tag clone all pass and all run-owned state is gone. `[VERIFIED: D-05 through D-08; Phase 22 and Phase 24 verification]`

**Primary recommendation:** Build the URL/health RED-GREEN slice first, add the
repeatable migration and Job harness next, then close with restart/browser
acceptance, independent FastAPI replay, immutable Stage 2 publication, and
exact cleanup. `[VERIFIED: phase context and TDD workflow]`

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|--------------|----------------|-----------|
| URL validation and `DATABASES` assembly | API / Backend configuration | Database driver | Django consumes native fields; Python parses and validates the trusted environment URL. `[CITED: Python 3.12 urllib.parse and Django settings docs]` |
| Task persistence | Database / Storage | Django ORM | The existing model and immutable migration own the PostgreSQL schema. `[VERIFIED: Stage 1 source]` |
| Schema-aware `/health` | API / Backend | Database introspection | The view converts configuration, connection, and table-state checks into stable public JSON. `[VERIFIED: Django 5.2.16 connection/introspection source]` |
| Migration execution | Kubernetes Job | Django management command | A one-shot Job runs `python manage.py migrate --noinput` before readiness. `[CITED: Kubernetes Job docs; Django admin docs]` |
| Restart persistence | Public HTTP | PostgreSQL | Two independent server processes share one migrated database and a later GET proves retained data. `[VERIFIED: D-05]` |
| Stage identity | Git / GitHub | Fresh Sealos replay | Protected annotated tags identify exact accepted reader source. `[CITED: https://git-scm.com/docs/git-tag; GitHub ruleset docs]` |

## Standard Stack

| Package / Tool | Exact Version | Purpose | Evidence |
|----------------|---------------|---------|----------|
| Python | `>=3.12,<3.13` | Runtime and standard-library URL parsing | Existing project constraint; Python 3.12.12 is available. `[VERIFIED: pyproject and local CLI]` |
| Django | `5.2.16` | ORM, migrations, views, forms, templates, admin | Current accepted 5.2 LTS patch in Stage 1. `[VERIFIED: PyPI release and official `5.2.16` tag]` |
| `psycopg[binary]` | `3.3.4` | PostgreSQL DB-API driver with bundled client libraries | Official docs name `psycopg[binary]`; release notes, PyPI, and upstream `3.3.4` tag agree. `[VERIFIED: https://www.psycopg.org/psycopg3/docs/basic/install.html; https://www.psycopg.org/psycopg3/docs/news.html; PyPI; upstream Git]` |
| pytest | `9.1.1` | Test runner | Existing approved Stage 1 development pin. `[VERIFIED: Phase 24 verification]` |
| pytest-django | `4.12.0` | Django client and PostgreSQL test database lifecycle | Existing approved Stage 1 development pin. `[VERIFIED: Phase 24 verification; CITED: https://pytest-django.readthedocs.io/en/latest/database.html]` |
| uv | `0.10.9` available | Lock, sync, run, runtime export | Required commands are installed. `[VERIFIED: local CLI]` |
| PostgreSQL | `17.10-bookworm@sha256:4f736ae292687621d4dbe0d499ffd024a36bd2ee7d8ca6f2ccd4c800f047b394` | Temporary real database | Accepted Phase 22 image and harness. `[VERIFIED: FastAPI Stage 2 source and verification]` |
| Kubernetes / kubectl | client `1.35.0` | Database lifecycle, Secret, Jobs, waits, cleanup | Authenticated context and namespace permissions passed read-only preflight. `[VERIFIED: local CLI and cluster authorization]` |

Dependency update:

```toml
dependencies = [
    "Django==5.2.16",
    "psycopg[binary]==3.3.4",
]
```

Regenerate `uv.lock` and the runtime-only `requirements.txt` with the existing
`uv export --locked --no-dev --no-emit-project --no-hashes` command. The export
must contain both `psycopg==3.3.4` and platform-selected
`psycopg-binary==3.3.4`. `[VERIFIED: psycopg package metadata and accepted FastAPI lock/export pattern]`

## Package Legitimacy Audit

The package seam was run for Django, pytest, pytest-django, psycopg, and
psycopg-binary. It returned `SUS` for all five because PyPI weekly download data
was unavailable; Django and pytest also appeared recent, and the seam missed
pytest-django's `Repository`-labeled source URL. It returned no `SLOP` verdict.
`[VERIFIED: GSD package-legitimacy seam]`

| Package | Exact Release | Official Identity | Seam Verdict | Disposition |
|---------|---------------|-------------------|--------------|-------------|
| Django | 5.2.16, 2026-07-07 | PyPI source `github.com/django/django`; annotated upstream tag `5.2.16` | SUS: release recency and unknown downloads | Retain prior Phase 24 approval and exact pin. |
| pytest | 9.1.1, 2026-06-19 | PyPI source `github.com/pytest-dev/pytest` | SUS: release recency and unknown downloads | Retain prior Phase 24 approval and exact pin. |
| pytest-django | 4.12.0, 2026-02-14 | PyPI `Repository` points to `github.com/pytest-dev/pytest-django`; upstream tag `v4.12.0` | SUS: unknown downloads and missed repository field | Retain prior Phase 24 approval and exact pin. |
| psycopg | 3.3.4, 2026-05-01 | Official install/news docs, PyPI `Code`, and annotated upstream tag `3.3.4` agree | SUS: unknown downloads | Add `checkpoint:human-verify` before `uv add`; record all three official identities. |
| psycopg-binary | 3.3.4, 2026-05-01 | Same official project and release as psycopg; official install docs prescribe the `binary` extra | SUS: unknown downloads | Include in the same human checkpoint and inspect the resolved lock before installation. |

**Conservative checkpoint wording:** "Verify that `psycopg` and
`psycopg-binary` both resolve to version `3.3.4`, PyPI lists
`https://github.com/psycopg/psycopg` as Code, the official Psycopg installation
page prescribes `psycopg[binary]`, and upstream tag `3.3.4` peels to commit
`83f110367cdd249cc0a352e2246ecea9e878e5a0`; approve the lock only after all
four facts agree." `[VERIFIED: official sources and upstream Git]`

**Packages removed due to SLOP:** none. `[VERIFIED: package-legitimacy seam]`

## Recommended File Map

| File | Change | Responsibility |
|------|--------|----------------|
| `taskboard/database.py` | New | Strict standard-library URL parser returning native Django fields. |
| `taskboard/settings.py` | Modify | Select `TEST_DATABASE_URL` for pytest, otherwise `DATABASE_URL`; remove SQLite runtime configuration. |
| `tasks/views.py` | Modify | Schema-aware exact 200/503 health response with credential-free logging. |
| `tests/test_public_http.py` | Modify | Preserve five public cases and run database cases against real PostgreSQL. |
| `tests/test_database_config.py` | New | Valid encoded URL, both accepted schemes, default port, and invalid-component cases. |
| `tests/test_health.py` | New | Missing, unreachable, unmigrated, and migrated public health behavior. |
| `tests/test_migrations.py` | New | Immutable `0001`, fresh migrate, current-head rerun, and zero model drift. |
| `tests/test_migration_job.py` | New | Exact production and source Job contracts. |
| `tests/test_postgres_harness.py` | New | Modes, ownership, bounded waits, redaction, restart, and cleanup grammar. |
| `deploy/migration-job.yaml` | New | Future application-image contract running `python manage.py migrate --noinput`. |
| `deploy/source-migration-job.yaml` | New | Pre-image source adapter mounted from an allowlisted ConfigMap. |
| `scripts/test-postgres.sh` | New | Real PostgreSQL, test, migration, Job, HTTP, browser, replay, and cleanup gate. |
| `pyproject.toml`, `uv.lock`, `requirements.txt`, `README.md` | Modify | Exact driver pin, reproducible export, and Stage 2 reader workflow. |

`tasks/models.py`, `tasks/forms.py`, routes, template, CSS, admin registration,
and `tasks/migrations/0001_initial.py` remain unchanged. `[VERIFIED: D-02, D-03, and accepted Stage 1 source]`

## Architecture Patterns

### 1. Strict Native `DATABASES` Conversion

Use `urllib.parse.urlsplit()` and `unquote(..., errors="strict")`. Accept
`postgresql://` and `postgres://`, which PostgreSQL documents as its two URI
scheme designators. Require username, password, one host, one database path,
and a valid port; reject query, fragment, extra path segments, missing values,
and malformed ports. `urlsplit()` exposes components and raises for malformed
ports, while its documentation assigns semantic validation to the caller.
`[CITED: https://docs.python.org/3.12/library/urllib.parse.html; CITED: https://www.postgresql.org/docs/17/libpq-connect.html]`

```python
from urllib.parse import unquote, urlsplit


def database_config(database_url: str) -> dict[str, object]:
    parsed = urlsplit(database_url)
    if parsed.scheme not in {"postgres", "postgresql"}:
        raise ValueError("DATABASE_URL must use PostgreSQL")
    if parsed.query or parsed.fragment:
        raise ValueError("DATABASE_URL parameters are unsupported")
    port = parsed.port or 5432
    name = unquote(parsed.path.removeprefix("/"), errors="strict")
    if not all((parsed.username, parsed.password, parsed.hostname, name)):
        raise ValueError("DATABASE_URL is missing required components")
    if "/" in name:
        raise ValueError("DATABASE_URL must name one database")
    return {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": name,
        "USER": unquote(parsed.username, errors="strict"),
        "PASSWORD": unquote(parsed.password, errors="strict"),
        "HOST": parsed.hostname,
        "PORT": str(port),
        "OPTIONS": {"connect_timeout": 1},
    }
```

Django documents these six database fields and passes PostgreSQL `OPTIONS` to
the driver; PostgreSQL defines `connect_timeout` in seconds. Keep `CONN_MAX_AGE`
at its default `0` in this tutorial stage. `[CITED: Django database/settings docs; PostgreSQL libpq docs]`

When `TEST_DATABASE_URL` is set, parse it and set `TEST.NAME` to its decoded
database name so pytest-django creates and destroys that exact isolated test
database. When neither URL exists, configure Django's dummy backend and expose
a boolean configuration flag for the health view. This supports the locked
missing-configuration 503 while every usable data path still requires an
explicit PostgreSQL URL. `[VERIFIED: D-02, D-04; CITED: Django test database docs]`

### 2. Real pytest-django PostgreSQL Lifecycle

pytest-django blocks database access until a test requests `django_db` or the
`db` fixture. It creates the test database on the first database test, applies
migrations, caches it for the session, wraps ordinary marked tests in rollback
transactions, and destroys the database after the run. PostgreSQL credentials
must read the `postgres` database and create databases. `[CITED: https://pytest-django.readthedocs.io/en/latest/database.html; https://docs.djangoproject.com/en/5.2/topics/testing/overview/]`

The harness should generate a distinct test database name and export both
`DATABASE_URL` and `TEST_DATABASE_URL`; the latter points at the explicit test
name and the temporary PostgreSQL role owns the service. Avoid `--reuse-db` in
phase gates so interrupted test databases cannot mask freshness. Preserve the
five Stage 1 public tests, mark every now-database-aware case, and retain real
Django Client, router, ORM, forms, templates, middleware, sessions, and admin.
`[VERIFIED: D-01, D-05; accepted Stage 1 tests]`

### 3. Schema-Aware Health

Use Django's public connection and introspection APIs. The physical table name
is `Task._meta.db_table` (`tasks_task`), so the probe remains correct if Django
naming metadata changes. Catch `DatabaseError` and `ImproperlyConfigured`, log
only a stable reason, close a failed connection, and return the exact public
payload. `[VERIFIED: Django 5.2.16 source and Stage 1 model; CITED: Django database exception API]`

```python
from django.conf import settings
from django.core.exceptions import ImproperlyConfigured
from django.db import DatabaseError, connection
from django.http import JsonResponse

from .models import Task


def health(request):
    if not settings.DATABASE_URL_CONFIGURED:
        return JsonResponse({"status": "unavailable"}, status=503)
    try:
        ready = Task._meta.db_table in connection.introspection.table_names()
    except (DatabaseError, ImproperlyConfigured):
        connection.close()
        ready = False
    status = "ok" if ready else "unavailable"
    return JsonResponse({"status": status}, status=200 if ready else 503)
```

Test missing configuration through the settings flag, an unreachable URL
through a bounded subprocess, an unmigrated database before the first Job, and
a migrated database after Job completion. `[VERIFIED: D-04 and accepted Phase 22 readiness pattern]`

### 4. Immutable Migration and Job Split

Django's migration executor computes the unapplied plan and reports successful
current-head completion when the plan is empty. Keep the SHA-256 of
`0001_initial.py` fixed, run `migrate --noinput` twice, verify
`showmigrations tasks --plan` contains `[X] tasks.0001_initial`, and run
`makemigrations --check --dry-run` for model drift. `[VERIFIED: exact Django 5.2.16 source; CITED: Django admin docs]`

`deploy/migration-job.yaml` is the Phase 26 application-image contract. It uses
`batch/v1`, `restartPolicy: Never`, `backoffLimit: 1`,
`activeDeadlineSeconds: 300`, no service-account token, bounded resources,
non-root security fields, a writable memory-backed `/tmp`, Secret key `url`,
and command `python manage.py migrate --noinput`. Render its image token to a
syntactically valid immutable future reference and run strict server-side dry
validation; the image is executed only after Phase 26 publishes it.
`[VERIFIED: D-06 and accepted FastAPI Job contract]`

The source adapter projects only tracked migration inputs through a ConfigMap:
`manage.py`, `taskboard/__init__.py`, `taskboard/settings.py`,
`taskboard/database.py`, `tasks/__init__.py`, `tasks/apps.py`, `tasks/models.py`,
`tasks/migrations/__init__.py`, `tasks/migrations/0001_initial.py`, and
`requirements.txt`. Its Python 3.12 container creates a temporary venv, installs
the exact runtime export, runs migrate, and prints only migration state. Run
the same rendered Job, wait for `Complete`, inspect credential-free logs,
delete it with a bounded wait, recreate it, and observe `Complete` again.
`[VERIFIED: Phase 22 source adapter pattern; CITED: Kubernetes ConfigMap, Secret, Job, and kubectl wait docs]`

### 5. Public Restart and Administration Evidence

After migration readiness, start an owned Django process on a dynamic local
port, wait for exact 200 health, fetch the board and CSRF token, POST one unique
task title, follow the redirect, and confirm the title on a later GET. Stop and
reap that exact PID, start a second process with the same `DATABASE_URL`, and
confirm the title again through `GET /`. `[VERIFIED: D-05]`

Generate temporary administrator credentials in memory, create the superuser
through Django's management command, log in through a named browser session,
open the Task admin changelist, and confirm the retained title. Record only
HTTP status, route, task title, and success state; keep username/password out of
evidence. `[VERIFIED: ROADMAP administrator-backed data path and D-08]`

### 6. Publication and Shared Gate

Preserve direct Stage 1 tag object `0d9254d37914976898039ff3c55f94399aa1d7c0`
and peeled commit `ca115bf21b599c14e667b336bd78e3c587c24208`.
After local acceptance, push accepted `main`, create annotated
`stage-2-postgresql` with message `Django PostgreSQL stage`, and read back its
direct object, peeled commit, tagger, message, and target. `[VERIFIED: current public refs and D-07]`

Ruleset `19014157` currently has active enforcement, include
`refs/tags/stage-*`, empty excludes and bypasses, and update/deletion rules.
Read it back after publication. Then clone the public Stage 2 tag over HTTPS
into a new path, run locked sync/export and the complete Django phase gate
against a fresh real database, and remove the clone. Run the FastAPI Stage 2
phase gate independently from its immutable public tag and keep its resources
under its own run ID. `[VERIFIED: GitHub API readback, D-01, D-06, D-07]`

## Runtime State Inventory

| Category | Items Found | Action Required |
|----------|-------------|-----------------|
| Stored data | Stage 1 `db.sqlite3` is ignored and absent; public source carries no database. Temporary PostgreSQL begins empty. `[VERIFIED: Stage 1 verification and live readback]` | Configuration migration only; preserve model/migration history and prove new data through PostgreSQL. |
| Live service config | Public repo, Stage 1 tag, and active tag ruleset exist; no Phase 25 run-labeled cluster objects exist. `[VERIFIED: GitHub and cluster readback]` | Push accepted main/tag, preserve Stage 1 and ruleset, delete only exact run labels. |
| OS-registered state | Port 8000 is free; no owned Django/FastAPI server or tutorial port-forward process is running. `[VERIFIED: local process/port probe]` | Track PIDs and browser session names; stop and reap all owned processes. |
| Secrets and env vars | `DATABASE_URL` and `TEST_DATABASE_URL` are runtime inputs; no credential file belongs in source or evidence. `[VERIFIED: D-02 and D-08]` | Generate an ephemeral Secret, use key `url`, redact logs/state, delete Secret and secure state file. |
| Build artifacts / installed packages | Existing `.venv`, `uv.lock`, and runtime export reflect Stage 1; mutable SQLite file is absent. `[VERIFIED: local repo]` | Update lock/export, verify zero diff after regeneration, remove replay venv/clone with its directory. |

## Don't Hand-Roll

| Problem | Use | Reason |
|---------|-----|--------|
| PostgreSQL connectivity | Django PostgreSQL backend plus psycopg 3.3.4 | Django owns backend semantics and driver integration. `[CITED: Django database docs]` |
| Schema changes | Django migrations and `manage.py migrate` | One recorded graph owns fresh and current-head state. `[CITED: Django migrations docs]` |
| Test isolation | pytest-django database setup and rollback | It creates, migrates, isolates, and destroys the real test database. `[CITED: pytest-django database docs]` |
| Table discovery | `connection.introspection.table_names()` and `Task._meta.db_table` | Backend-specific introspection avoids raw catalog SQL. `[VERIFIED: Django source]` |
| Credential delivery | Kubernetes Secret `secretKeyRef` | Secret values stay outside ConfigMaps and tracked manifests. `[CITED: Kubernetes Secret docs]` |
| One-shot retries/completion | Kubernetes Job plus `kubectl wait` | Job status is the authoritative completion contract. `[CITED: Kubernetes Job and kubectl wait docs]` |
| Public identity | Annotated Git tag plus existing GitHub ruleset | Direct tag object and protected ref preserve accepted source identity. `[CITED: Git and GitHub docs]` |

## Common Pitfalls

| Pitfall | Consequence | Required Guard |
|---------|-------------|----------------|
| Passing a raw URL or accepting arbitrary schemes | Ambiguous parsing and unsupported backend state | Validate scheme/components, decode explicitly, test malformed ports and encoded credentials. `[CITED: Python URL parsing security]` |
| Letting pytest prefix an implicit database name | Harness ownership and cleanup become unclear | Set explicit `TEST.NAME` from the unique test URL and use no reuse flag. `[CITED: Django test database settings]` |
| Probing only `SELECT 1` | Unmigrated databases appear ready | Require `tasks_task` through Django introspection. `[VERIFIED: D-04]` |
| Recreating schema in startup/tests | Split migration ownership | Scan for schema-editor table creation and keep all DDL in migrations. `[VERIFIED: D-03]` |
| Reapplying a completed Job | Kubernetes keeps the completed object | Delete, wait for deletion, recreate, then wait for a second `Complete`. `[CITED: Kubernetes Job lifecycle]` |
| Mounting the full repository into ConfigMap | Oversized input and unreviewed files enter execution | Project an explicit tracked allowlist. `[VERIFIED: Phase 22 pattern]` |
| Recording command environments or Secret YAML | Credentials enter durable evidence | Curate outputs, scan forbidden patterns, then checksum files. `[CITED: Kubernetes Secret good practices]` |
| Using a broad cleanup selector | Unrelated namespace resources enter scope | Verify every object name under the exact random run label before deletion. `[VERIFIED: Phase 22 harness]` |

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | pytest 9.1.1, pytest-django 4.12.0, Django Client, real PostgreSQL 17, shell/Kubernetes/browser acceptance |
| Config | Existing `pyproject.toml`; add `tests/conftest.py`, deployment manifests, and `scripts/test-postgres.sh` |
| Focused run | `DATABASE_URL="$URL" TEST_DATABASE_URL="$TEST_URL" uv run pytest tests/test_health.py -q -x` |
| Full Django gate | `./scripts/test-postgres.sh --phase-gate` |
| Shared framework gate | Run public immutable FastAPI Stage 2 `--phase-gate`, then Django Stage 2 `--phase-gate` with independent run IDs |
| Feedback target | Focused test under 30 seconds after database readiness; full external gate bounded to 15 minutes |

### Phase Requirements to Test Map

| Requirement | Behavior | Type | Automated Command / Gate | Wave 0 Gap |
|-------------|----------|------|--------------------------|------------|
| TDD-02 | Existing five public HTTP behaviors use real PostgreSQL | HTTP integration | `uv run pytest tests/test_public_http.py -q -x` with both URLs | Update existing file and add `tests/conftest.py` |
| TDD-02 | Missing, unreachable, unmigrated, and migrated health return exact payload/status | HTTP integration | `uv run pytest tests/test_health.py -q -x` plus harness pre-migration probe | Add `tests/test_health.py` |
| TDD-03 | Fresh and current-head migration pass with immutable `0001` | Migration integration | `./scripts/test-postgres.sh --migrations-only` | Add migration tests and harness mode |
| TDD-03 | Source Job completes twice before readiness | Kubernetes integration | `./scripts/test-postgres.sh --jobs-only --state-file "$STATE"` | Add manifests and harness mode |
| TDD-02, TDD-03 | Public task survives independent server restart and appears in admin | HTTP/browser integration | Full phase gate | Add owned server/browser acceptance functions |
| DJAN-02 | Lock/export, Stage 2 tag, ruleset, public clone, real PostgreSQL replay | Publication | Full public replay gate plus Git/GitHub API readback | Add publication/evidence step |
| TDD-03 | FastAPI and Django migrations remain independently green | Cross-framework integration | Run each immutable tag's phase gate separately | Reuse FastAPI gate; add Django gate |

### TDD Sequence

1. Approve the psycopg checkpoint and update the dependency lock/export.
2. Commit a RED public health/configuration test that fails against the Stage 1 SQLite/static-health implementation.
3. Add the minimum parser, settings, and schema-aware health implementation; run accumulated Stage 1 public tests against real PostgreSQL.
4. Add RED migration and Job contract tests, then implement the harness/manifests and observe fresh plus current-head completion.
5. Add RED harness contract for public restart persistence, then implement the two-process HTTP and browser/admin trace.
6. Run complete local and public replay gates before publishing accepted Stage 2 identity.

Each RED commit must contain tests only, fail for its named missing behavior,
and remain the direct parent of its GREEN commit. `[VERIFIED: TDD skill and D-05]`

### Sampling Rate

- **Every RED/GREEN commit:** named test, accumulated focused file, `uv lock --check`.
- **Every plan wave:** full pytest suite, migration drift, runtime export, manifest static tests.
- **Infrastructure wave:** bounded real-PostgreSQL session plus exact cleanup assertion.
- **Phase gate:** two Django source Job completions, ready health, public restart/admin trace, independent FastAPI gate, public tag replay, checksums, and zero residue.

### Wave 0 Gaps

- [ ] `tests/conftest.py` - required URL checks and explicit real PostgreSQL test database lifecycle.
- [ ] `tests/test_database_config.py` - strict standard-library parser contract.
- [ ] `tests/test_health.py` - four readiness states.
- [ ] `tests/test_migrations.py` - immutable fresh/current-head migration proof.
- [ ] `tests/test_migration_job.py` and `tests/test_postgres_harness.py` - manifest and lifecycle contract.
- [ ] `deploy/migration-job.yaml` and `deploy/source-migration-job.yaml` - production/source split.
- [ ] `scripts/test-postgres.sh` - session modes, migration/Job/runtime gates, evidence, and cleanup.

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|------------------|
| V2 Authentication | Yes | Retain Django admin authentication and use ephemeral acceptance credentials. `[VERIFIED: Stage 1 admin]` |
| V3 Session Management | Yes | Retain Django session middleware and migrated session tables. `[VERIFIED: Stage 1 settings and Django migrations]` |
| V4 Access Control | Yes | Anonymous access stops at the login boundary; authenticated admin owns Task management. `[VERIFIED: Stage 1 verification]` |
| V5 Validation, Sanitization, Encoding | Yes | ModelForm title validation, CSRF middleware, template autoescaping, strict URL parser. `[VERIFIED: Stage 1 source; CITED: Django security docs]` |
| V6 Stored Cryptography | Limited | Use Kubernetes/Django platform controls; keep generated secrets out of source and evidence. `[CITED: Kubernetes Secret good practices]` |

### Threat Map

| Pattern | STRIDE | Mitigation |
|---------|--------|------------|
| SQL injection through task input | Tampering | Django ORM and ModelForm parameterization. `[CITED: Django security docs]` |
| CSRF task/admin action | Spoofing | Existing CSRF middleware/token and real browser form flow. `[VERIFIED: Stage 1 source]` |
| Credential disclosure in logs/evidence | Information Disclosure | Secret key reference, curated output, redaction scan, checksums. `[CITED: Kubernetes Secret good practices]` |
| Resource deletion outside the run | Tampering / Denial of Service | Random run label, name-prefix assertion, exact-label queries and deletion. `[VERIFIED: accepted Phase 22 harness]` |
| Ready signal before schema | Denial of Service | Require migrated physical table after first completed Job. `[VERIFIED: D-04]` |
| Test run against durable runtime database | Tampering | Explicit unique `TEST.NAME`, create/destroy lifecycle, no reuse. `[CITED: Django/pytest-django testing docs]` |

## Project Constraints (from AGENTS.md)

- Use a GSD workflow before edits and keep planning state synchronized.
- Write planning docs, code, comments, commit messages, and PR text in English.
- Use the minimum implementation that satisfies locked behavior and keep edits surgical.
- Verify failures before fixes, cover invalid inputs, and preserve direct RED/GREEN history.
- Use `rg` for repository search; `.codegraph/` is absent, so CodeGraph does not apply.
- Use `apply_patch` for manual edits and preserve unrelated worktree changes.
- Keep user-facing replies in Simplified Chinese and begin them with `爸爸`.
`[VERIFIED: AGENTS.md]`

No project-defined skill directory exists under `.codex/skills` or
`.agents/skills`. `[VERIFIED: project skill discovery]`

## Evidence and Cleanup Contract

Retain a Phase 25 planning evidence package containing `package-identity.txt`,
`migrations.txt`, `jobs.txt`, `http.jsonl`, `browser.txt`,
`source-identity.txt`, `cleanup.txt`, and `checksums.txt`. Record run IDs,
resource names, migration state, Job `Complete=True`, public status/payload,
restart title readback, browser routes, tag object/peeled commit, ruleset fields,
and zero counts. `[VERIFIED: D-08 and Phase 22 evidence pattern]`

Before checksums, reject credential-bearing PostgreSQL URLs, URL assignments,
password/token patterns, Secret data, browser credentials, and Kubernetes
tokens. Cleanup must prove zero exact-label Deployment, Pod, Service, Job,
Secret, and ConfigMap; stopped/reaped port-forward and both server PIDs; closed
named browser sessions; absent secure state/log files; absent replay clones;
clean target repositories; unchanged protected Stage 1 refs. `[VERIFIED: D-08 and accepted Phase 22 cleanup]`

## Environment Availability

| Dependency | Available | Version / State | Fallback |
|------------|-----------|-----------------|----------|
| Python | Yes | 3.12.12 | Use locked Python 3.12 family. |
| uv | Yes | 0.10.9 | None required. |
| kubectl | Yes | 1.35.0, context `dn9ue3wz@sealos` | None required. |
| Sealos namespace | Yes | `ns-let51wad`; create/delete/get allowed for required resource types | None required. |
| GitHub CLI | Yes | 2.86.0, authenticated public repo access | Git CLI for refs; REST still required for ruleset. |
| agent-browser | Yes | 0.26.0 | Public curl trace covers nonvisual behavior. |
| Port 8000 | Yes | Free at research time | Harness selects/checks owned ports. |
| Stage 1 repository | Yes | Clean public `main` and protected annotated tag | None required. |
| Existing Phase 25 residue | Clear | No matching Django/FastAPI run-labeled objects or owned processes | Exact-label cleanup remains mandatory after every run. |

## State of the Art

| Stage 1 / Earlier Pattern | Stage 2 Pattern | Impact |
|---------------------------|-----------------|--------|
| SQLite settings | Explicit PostgreSQL URL -> native Django settings | Reader exercises the target backend. `[VERIFIED: D-02]` |
| Static 200 health | Connection plus migrated-table readiness | Workload starts serving only after schema completion. `[VERIFIED: D-04]` |
| Local `migrate` only | Local command plus one-shot Kubernetes Job | Operational migration ordering becomes reproducible. `[VERIFIED: D-03, D-06]` |
| One server process | Public write followed by a second server read | Persistence survives application restart. `[VERIFIED: D-05]` |
| psycopg2-compatible history | Django-recommended psycopg 3.3.4 | Current driver generation and Python 3.12 support. `[CITED: Django and Psycopg docs]` |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| None | All planning-relevant claims were verified from locked context, exact source/runtime probes, official registries/upstream tags, or cited primary documentation. | All | No unresolved assumption. |

## Open Questions (RESOLVED)

1. **Which psycopg patch?** `3.3.4`; official release notes, PyPI, and upstream tag agree. The conservative legitimacy checkpoint remains required because the seam lacks download telemetry.
2. **Which URL schemes?** Accept `postgresql` and `postgres`, the two PostgreSQL-documented URI designators; validate every required component and reject query/fragment complexity.
3. **How should pytest use the real server?** Give it an explicit unique `TEST_DATABASE_URL`/`TEST.NAME`; let pytest-django create, migrate, isolate, and destroy that database.
4. **What table gates readiness?** `Task._meta.db_table`, currently `tasks_task`; Django introspection supplies the table list.
5. **How can the Job run before an application image exists?** Validate the tracked production image contract server-side and execute an allowlisted ConfigMap source adapter.
6. **How is repeat Job completion proven?** Wait for first `Complete`, delete and confirm deletion, recreate the same source Job, then wait for second `Complete`.
7. **How is restart persistence proven?** Commit a public form write, stop the first owned server, start a second process against the same database, and read the retained title through public GET and admin.
8. **What uncertainty remains?** The package seam cannot supply PyPI download counts. Official identity is coherent; the human package checkpoint records that boundary before locking.

## Sources

### Primary / Official

- https://docs.djangoproject.com/en/5.2/ref/databases/ - PostgreSQL support, psycopg recommendation, driver options.
- https://docs.djangoproject.com/en/5.2/ref/settings/#databases - native fields and explicit test database name.
- https://docs.djangoproject.com/en/5.2/topics/testing/overview/ - PostgreSQL test database privileges and lifecycle.
- https://docs.djangoproject.com/en/5.2/ref/django-admin/#migrate - migration and current-head command behavior.
- https://pytest-django.readthedocs.io/en/latest/database.html - marker, setup, transaction, and database reuse semantics.
- https://docs.python.org/3.12/library/urllib.parse.html - component parsing, percent decoding, port errors, validation boundary.
- https://www.postgresql.org/docs/17/libpq-connect.html - accepted URI schemes and connection timeout.
- https://www.psycopg.org/psycopg3/docs/basic/install.html - official package name and binary extra.
- https://www.psycopg.org/psycopg3/docs/news.html - current 3.3.4 release.
- https://kubernetes.io/docs/concepts/workloads/controllers/job/ - completion and cleanup lifecycle.
- https://kubernetes.io/docs/reference/kubectl/generated/kubectl_wait/ - bounded condition waits.
- https://kubernetes.io/docs/tasks/inject-data-application/distribute-credentials-secure/ - Secret key environment projection.
- https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/ - ConfigMap source projection.
- https://kubernetes.io/docs/concepts/security/secrets-good-practices/ - credential handling and logging boundary.
- https://git-scm.com/docs/git-tag - annotated tag objects.
- https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets - tag update/deletion protection.

### Exact Repository and Runtime Evidence

- `.planning/phases/22-fastapi-postgresql-stage/22-RESEARCH.md` and `22-VERIFICATION.md` - accepted real PostgreSQL, Job, evidence, identity, and cleanup pattern.
- `.planning/phases/24-django-deploy-stage/24-VERIFICATION.md` - accepted Stage 1 behavior, immutable migration, tag, ruleset, and zero residue.
- `/Users/longnv/bin/repo/sealos-django-tutorial` - exact Stage 1 source and migration identity.
- `/Users/longnv/bin/repo/sealos-fastapi-tutorial` - accepted shared PostgreSQL harness and manifests.
- Official PyPI JSON plus upstream Git tags for Django 5.2.16, pytest-django 4.12.0, psycopg 3.3.4, and psycopg-binary 3.3.4.
- Live read-only checks of Python, uv, kubectl, namespace authorization, GitHub refs/ruleset, process state, port 8000, and exact run-label inventory.

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - exact registry metadata, official docs, upstream tags, and accepted locks agree.
- Architecture: HIGH - locked decisions align with exact Django source and the accepted FastAPI Stage 2 harness.
- pytest-django lifecycle: MEDIUM - official docs plus exact installed behavior; execution remains the final proof.
- Kubernetes and publication: HIGH - accepted prior implementation plus live cluster/GitHub readback.
- Package telemetry: MEDIUM - official identity is coherent; weekly download counts are unavailable to the legitimacy seam.

**Research date:** 2026-07-16
**Valid until:** 2026-08-15 for package versions; architecture remains valid for Django 5.2.x and the locked milestone.
