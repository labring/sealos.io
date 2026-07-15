# Phase 25: Django PostgreSQL Stage - Pattern Map

**Mapped:** 2026-07-16
**Implementation repository:** `/Users/longnv/bin/repo/sealos-django-tutorial`
**Orchestration repository:** `/Users/longnv/.codex/worktrees/19b8/sealos.io`
**Files classified:** 15 Django files (7 modified, 8 created)
**Representative analogs:** 5
**Analogs found:** 15 / 15 through exact or composite matches

## Boundary Summary

Phase 25 changes the accepted Django Stage 1 source from SQLite to an explicit
PostgreSQL runtime contract while preserving the rendered Task Board behavior.
The committed `tasks.0001_initial` migration remains the exclusive schema owner.
The five Stage 1 public behaviors remain in place and run against a real
PostgreSQL server provisioned by the phase harness.

The closest infrastructure analog is the independently verified FastAPI Stage 2
repository. Its PostgreSQL 17 lifecycle, exact run labels, detached session,
port-forward recovery, strict Job rendering, redaction, evidence checksums, and
zero-inventory cleanup should be copied structurally. Django commands and public
HTTP observations replace the FastAPI-specific operations.

Phase 26 owns Gunicorn, WhiteNoise, `collectstatic`, application images,
replicas, rollout logs, and rollback. Phase 27 owns tutorial prose and
screenshots. These concerns must stay outside Phase 25 source and plans.

## Exact Source Change Set

### Files to modify

1. `pyproject.toml`
2. `uv.lock`
3. `requirements.txt`
4. `taskboard/settings.py`
5. `tasks/views.py`
6. `tests/test_public_http.py`
7. `README.md`

### Files to create

1. `tests/conftest.py`
2. `tests/test_postgresql.py`
3. `tests/test_migrations.py`
4. `tests/test_migration_job.py`
5. `tests/test_postgres_harness.py`
6. `scripts/test-postgres.sh`
7. `deploy/migration-job.yaml`
8. `deploy/source-migration-job.yaml`

### Files to preserve byte-for-byte

| File | Invariant |
|---|---|
| `tasks/models.py` | Keep `title`, `completed`, and stable ID ordering from Stage 1. |
| `tasks/migrations/0001_initial.py` | Preserve the accepted migration as the only Task schema owner. |
| `tasks/forms.py` | Keep the title-only `ModelForm` and stable required-title message. |
| `tasks/urls.py` | Keep `/`, `/health`, and `/tasks/` route identities unchanged. |

The Stage 1 template, stylesheet, administration registration, project URLconf,
and runtime entry points also remain unchanged. PostgreSQL is an infrastructure
and readiness transition; the public task vocabulary and rendered experience
stay stable.

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `pyproject.toml` | dependency config | deterministic resolution | Django Stage 1 `pyproject.toml:1-19`; FastAPI Stage 2 `pyproject.toml:1-23` | exact composite |
| `uv.lock` | generated dependency config | resolver output | Django Stage 1 lock/export workflow | exact role |
| `requirements.txt` | generated runtime config | lock-to-export transform | Django Stage 1 `requirements.txt:1-10` | exact role |
| `taskboard/settings.py` | runtime config | environment-to-Django config | Stage 1 `settings.py:13-16,73-81`; FastAPI URL handling in `scripts/test-postgres.sh:960-989` | composite |
| `tasks/views.py` | controller/readiness probe | request-response, database inspection | Stage 1 `views.py:8-29`; FastAPI `app/database.py:31-42` | composite |
| `tests/conftest.py` | test infrastructure | environment validation | FastAPI `tests/conftest.py:8-16` | exact role |
| `tests/test_public_http.py` | public behavior test | request-response, CRUD | Existing Django `tests/test_public_http.py:5-81` | exact |
| `tests/test_postgresql.py` | readiness integration test | migration state to public HTTP | FastAPI `tests/test_health.py:15-62` | exact role |
| `tests/test_migrations.py` | migration integration test | repeatable schema batch | FastAPI `tests/test_migrations.py:12-59` | exact role |
| `tests/test_migration_job.py` | deployment contract test | manifest file validation | FastAPI `tests/test_migration_job.py:5-80` | exact role |
| `tests/test_postgres_harness.py` | harness safety test | subprocess and file-I/O | FastAPI `tests/test_postgres_harness.py:15-158` | exact role |
| `scripts/test-postgres.sh` | acceptance harness | Kubernetes lifecycle, process lifecycle, batch, HTTP | FastAPI `scripts/test-postgres.sh` | exact framework envelope |
| `deploy/migration-job.yaml` | production deployment config | one-shot batch | FastAPI `deploy/migration-job.yaml:1-63` | exact role |
| `deploy/source-migration-job.yaml` | validation adapter | ConfigMap-to-one-shot batch | FastAPI `deploy/source-migration-job.yaml:1-73` | exact role |
| `README.md` | reader documentation | clone to real PostgreSQL acceptance | Django Stage 1 `README.md:15-140`; FastAPI Stage 2 reader workflow | exact composite |

## Pattern Assignments

### Dependency lock and runtime export

**Apply to:** `pyproject.toml`, `uv.lock`, `requirements.txt`

**Django Stage 1 pattern:**
`/Users/longnv/bin/repo/sealos-django-tutorial/pyproject.toml:1-19`

```toml
[project]
requires-python = ">=3.12,<3.13"
dependencies = [
    "Django==5.2.16",
]

[dependency-groups]
dev = [
    "pytest==9.1.1",
    "pytest-django==4.12.0",
]
```

**FastAPI Stage 2 psycopg pattern:**
`/Users/longnv/bin/repo/sealos-fastapi-tutorial/pyproject.toml:6-19`

```toml
dependencies = [
  "psycopg[binary]==3.3.4",
]
```

Retain the accepted Django, pytest, and pytest-django pins. Add the exact
officially verified psycopg 3 patch selected by Phase 25 research. Generate
`uv.lock` with `uv`; generate `requirements.txt` from the accepted lock:

```bash
uv lock
uv sync --locked
uv export --locked --no-dev --no-emit-project --no-hashes \
  --format requirements.txt --output-file requirements.txt
uv lock --check
git diff --exit-code -- uv.lock requirements.txt
```

`requirements.txt` contains Django, psycopg, and their runtime transitive
dependencies. Pytest dependencies remain confined to the development group.
The lock and export are generated artifacts and should never be hand-edited.

### `taskboard/settings.py` (config, environment transform)

**Analogs:**

- Django Stage 1 database block:
  `/Users/longnv/bin/repo/sealos-django-tutorial/taskboard/settings.py:13-16,73-81`
- FastAPI standard-library URL validation:
  `/Users/longnv/bin/repo/sealos-fastapi-tutorial/scripts/test-postgres.sh:960-989`

The existing SQLite block is replaced with one small pure helper that converts
an explicit PostgreSQL URL into Django's native `DATABASES` structure. Use only
`os` and `urllib.parse` for the conversion. Accepted schemes are `postgres` and
`postgresql`; decode username, password, host, database name, and port. Raise
`ImproperlyConfigured` for malformed or unsupported configured values.

The runtime contract should have this shape:

```python
import os
from urllib.parse import parse_qs, unquote, urlsplit

from django.core.exceptions import ImproperlyConfigured


def database_config(database_url: str | None) -> dict[str, object]:
    if database_url is None:
        return {'ENGINE': 'django.db.backends.dummy'}

    parsed = urlsplit(database_url)
    if parsed.scheme not in {'postgres', 'postgresql'}:
        raise ImproperlyConfigured('DATABASE_URL must use PostgreSQL')
    if not parsed.hostname or not parsed.username or not parsed.path.strip('/'):
        raise ImproperlyConfigured('DATABASE_URL is missing required components')

    try:
        port = parsed.port or 5432
    except ValueError as error:
        raise ImproperlyConfigured('DATABASE_URL has an invalid port') from error

    options = parse_qs(parsed.query)
    config: dict[str, object] = {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': unquote(parsed.path.strip('/')),
        'USER': unquote(parsed.username),
        'PASSWORD': unquote(parsed.password or ''),
        'HOST': parsed.hostname,
        'PORT': port,
        'CONN_MAX_AGE': 0,
    }
    if 'sslmode' in options:
        config['OPTIONS'] = {'sslmode': options['sslmode'][-1]}
    return config


DATABASES = {'default': database_config(os.environ.get('DATABASE_URL'))}
```

The dummy backend is the explicit unconfigured state used by `/health` to emit
the locked 503 response. It supplies no persistence path. Every migration,
test, reader, Job, and accepted runtime command supplies a PostgreSQL URL.
Credentials remain in environment variables or Kubernetes Secret values.

Add a short PostgreSQL connection timeout through Django's `OPTIONS` when the
selected psycopg configuration supports it. Keep the timeout bounded so the
unreachable-database health case completes promptly. Log only stable error
classes from the readiness path; URLs and exception strings may contain
credentials and stay outside logs and evidence.

### `tasks/views.py` (controller, schema-aware readiness)

**Django public contract:**
`/Users/longnv/bin/repo/sealos-django-tutorial/tasks/views.py:8-29`

```python
def board(request):
    return render(
        request,
        'tasks/board.html',
        {'form': TaskForm(), 'tasks': Task.objects.all()},
    )


def health(request):
    return JsonResponse({'status': 'ok'})
```

**FastAPI schema probe:**
`/Users/longnv/bin/repo/sealos-fastapi-tutorial/app/database.py:31-42`

```python
def readiness_issue(self) -> str | None:
    if self.engine is None:
        return "database is not configured"

    try:
        with self.engine.connect() as connection:
            if not inspect(connection).has_table("tasks"):
                return "tasks schema is missing"
    except SQLAlchemyError:
        return "database connection failed"

    return None
```

Keep `board()` and `create_task()` unchanged. Replace only the health body with
a Django database introspection probe. Use `Task._meta.db_table` as the schema
identity, so the implementation checks Django's actual `tasks_task` table
without duplicating its name. A representative implementation is:

```python
import logging

from django.core.exceptions import ImproperlyConfigured
from django.db import connection
from django.db.utils import DatabaseError
from django.http import JsonResponse


logger = logging.getLogger(__name__)


def health(request):
    try:
        with connection.cursor() as cursor:
            tables = connection.introspection.table_names(cursor)
        if Task._meta.db_table not in tables:
            return JsonResponse({'status': 'unavailable'}, status=503)
    except (DatabaseError, ImproperlyConfigured) as error:
        logger.warning('database readiness failed: %s', type(error).__name__)
        return JsonResponse({'status': 'unavailable'}, status=503)

    return JsonResponse({'status': 'ok'})
```

The exact public responses are:

- migrated and reachable: HTTP 200, `{"status":"ok"}`;
- missing configuration, unreachable PostgreSQL, or missing Task table:
  HTTP 503, `{"status":"unavailable"}`.

Application startup performs no migration and creates no table. The Job or
explicit migration command establishes schema readiness.

### `tests/conftest.py` (test infrastructure, explicit real database)

**Analog:**
`/Users/longnv/bin/repo/sealos-fastapi-tutorial/tests/conftest.py:8-16`

```python
@pytest.fixture(scope="session")
def test_database_url() -> str:
    database_url = os.environ.get("TEST_DATABASE_URL")
    if not database_url:
        raise pytest.UsageError(
            "TEST_DATABASE_URL is required; run tests through "
            "./scripts/test-postgres.sh"
        )
    return database_url
```

Use an autouse session fixture to require both `TEST_DATABASE_URL` and
`DATABASE_URL`, require equality for the focused suite, and require a PostgreSQL
scheme. The harness exports both values explicitly. Pytest-django derives and
creates its isolated test database through the configured Django backend and
applies committed migrations. Test helpers never create tables directly.

### `tests/test_public_http.py` (public behavior, real PostgreSQL)

**Analog:** the accepted file itself,
`/Users/longnv/bin/repo/sealos-django-tutorial/tests/test_public_http.py:5-81`.

Retain exactly the five existing function names, request paths, reader-visible
assertions, and administration controls. Add `@pytest.mark.django_db` to the
health behavior because the health view now inspects schema. The other two
database behaviors retain their existing marks. The board, form, middleware,
template, CSRF, ORM, and admin collaborators remain real.

The retained five seams are:

1. `test_health_is_public`
2. `test_empty_task_board_is_rendered`
3. `test_task_creation_redirects_then_appears_on_board`
4. `test_invalid_task_title_shows_feedback_without_creating_task`
5. `test_admin_login_is_public`

The Stage 2 harness runs the full file against the temporary PostgreSQL 17
service. The valid-task test continues to prove POST -> redirect -> later GET
through the rendered public surface.

### `tests/test_postgresql.py` (integration test, readiness states)

**Analog:**
`/Users/longnv/bin/repo/sealos-fastapi-tutorial/tests/test_health.py:15-62`

```python
def test_health_waits_for_migrated_schema(test_database_url: str) -> None:
    command.downgrade(config, "base")
    try:
        response = client.get("/health")
        assert response.status_code == 503
    finally:
        command.upgrade(config, "head")


def test_health_accepts_migrated_database(test_database_url: str) -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
```

Translate this to Django's `MigrationExecutor`, `connection`, and public test
client. Migrate the `tasks` app to its zero state, observe exact public 503,
then restore `tasks.0001_initial` in `finally`. A second test observes exact 200
against the normally migrated real test database. Mark the schema-changing test
transactional. The external harness additionally exercises missing
configuration and an unreachable local socket through real server processes.

### `tests/test_migrations.py` (integration test, repeatable Django migration)

**Analog:**
`/Users/longnv/bin/repo/sealos-fastapi-tutorial/tests/test_migrations.py:12-59`

Copy the lifecycle assertions and replace Alembic with Django migration APIs:

1. use `MigrationExecutor(connection)` to move `tasks` to zero;
2. assert `Task._meta.db_table` is absent through Django introspection;
3. invoke `call_command('migrate', interactive=False, verbosity=0)` twice;
4. assert `('tasks', '0001_initial')` is applied;
5. inspect the table columns and preserve the Stage 1 field contract;
6. restore the migration head in `finally`.

The external harness remains the authoritative fresh-server proof and runs the
reader command exactly:

```bash
DATABASE_URL=<redacted> uv run python manage.py migrate --noinput
DATABASE_URL=<redacted> uv run python manage.py migrate --noinput
DATABASE_URL=<redacted> uv run python manage.py showmigrations tasks
DATABASE_URL=<redacted> uv run python manage.py makemigrations --check --dry-run
```

Require `[X] 0001_initial` and `No changes detected`. Keep
`tasks/migrations/0001_initial.py` byte-identical before and after every gate.

### `deploy/migration-job.yaml` (production Job contract)

**Analog:**
`/Users/longnv/bin/repo/sealos-fastapi-tutorial/deploy/migration-job.yaml:1-63`

Copy the complete metadata, label, deadline, restart, resource, seccomp,
capability-drop, read-only-root, and `/tmp` volume structure. Change only the
framework command:

```yaml
command:
  - python
  - manage.py
  - migrate
  - --noinput
env:
  - name: DATABASE_URL
    valueFrom:
      secretKeyRef:
        name: __SECRET_NAME__
        key: url
```

Retain placeholders `__JOB_NAME__`, `__RUN_ID__`, `__IMAGE_REFERENCE__`, and
`__SECRET_NAME__`. The tracked manifest is the future application-image
contract consumed by Phase 26. Phase 25 renders it to a mode-0600 temporary
file, requires an immutable validation image reference, rejects unknown or
unresolved tokens, runs server-side `--dry-run=server --validate=strict`, and
deletes the render under a trap.

### `deploy/source-migration-job.yaml` (pre-image execution adapter)

**Analog:**
`/Users/longnv/bin/repo/sealos-fastapi-tutorial/deploy/source-migration-job.yaml:1-73`

Copy the bounded Job and read-only ConfigMap volume pattern. Use Python 3.12 and
these source commands:

```yaml
args:
  - |
    python -m venv /tmp/runtime
    /tmp/runtime/bin/pip install --disable-pip-version-check --no-cache-dir \
      --requirement /app/requirements.txt
    export PATH="/tmp/runtime/bin:${PATH}"
    python manage.py migrate --noinput
    python manage.py showmigrations tasks
```

The ConfigMap allowlist contains only tracked migration inputs:

- `manage.py`
- `taskboard/__init__.py`
- `taskboard/settings.py`
- `tasks/__init__.py`
- `tasks/apps.py`
- `tasks/admin.py`
- `tasks/models.py`
- `tasks/migrations/__init__.py`
- `tasks/migrations/0001_initial.py`
- `requirements.txt`

Mount each item at its repository-relative path. The first source Job applies
the migration to a fresh database. Use one run-owned Job name, delete it by
exact name, recreate the same Job, and require a second `Complete=True` at the
current head. Record sequence 1 and 2 in evidence while the Kubernetes object
identity stays stable. Require `[X] 0001_initial` in redacted logs and reject
database URLs, passwords, tokens, and connection strings.

### Manifest and harness contract tests

**Apply to:** `tests/test_migration_job.py`,
`tests/test_postgres_harness.py`

**Analogs:**

- Exact manifest text test:
  `/Users/longnv/bin/repo/sealos-fastapi-tutorial/tests/test_migration_job.py:5-80`
- Disabled-evidence and render allowlist tests:
  `/Users/longnv/bin/repo/sealos-fastapi-tutorial/tests/test_postgres_harness.py:15-158`

Copy the exact-text manifest assertion and replace the Alembic command with the
four-item Django command. Keep the Job labels, Secret key, time bounds, resource
bounds, and security context under test.

Copy these harness safety tests with Django names and paths:

- evidence helpers succeed under `set -e` when evidence is disabled;
- production rendering accepts exactly the four allowlisted placeholders;
- unexpected and unresolved placeholders fail closed;
- temporary production renders use mode 0600 and are removed;
- source ConfigMap inputs are tracked and exactly allowlisted;
- usage exposes `session-start`, `session-stop`, `assert-clean`, `pytest-only`,
  `migrations-only`, `jobs-only`, and `phase-gate` modes.

Static tests complement the live Kubernetes gate. Live server-side validation,
Job completion, HTTP observations, and cleanup remain mandatory acceptance.

### `scripts/test-postgres.sh` (real PostgreSQL lifecycle)

**Primary analog:**
`/Users/longnv/bin/repo/sealos-fastapi-tutorial/scripts/test-postgres.sh`

Copy the shell structure and retain Bash 3.2-compatible syntax. Replace the
resource prefix with `tutorial-django-pg-test`; use independent generated run
IDs and the exact ownership label `tutorial.sealos.io/run-id=<run-id>`.

#### Run identity and cluster preflight

**Source:** `scripts/test-postgres.sh:249-305`

```bash
set_run_identity() {
  RUN_ID="$1"
  RUN_LABEL="${RUN_LABEL_KEY}=${RUN_ID}"
  SECRET_NAME="${RESOURCE_PREFIX}-${RUN_ID}-secret"
  DEPLOYMENT_NAME="${RESOURCE_PREFIX}-${RUN_ID}-db"
  SERVICE_NAME="${RESOURCE_PREFIX}-${RUN_ID}-service"
  SOURCE_CONFIGMAP_NAME="${RESOURCE_PREFIX}-${RUN_ID}-source"
}
```

Retain context and namespace checks, create/delete authorization checks, and the
inventory-name assertion. Provision PostgreSQL 17 with `emptyDir`, a generated
Secret, bounded rollout waiting, an ephemeral loopback port, and a supervised
port-forward. The local test URL uses `postgresql://`; the in-cluster Secret key
`url` uses the Service DNS name and the same database identity.

#### Detached session and state file

**Source:** `scripts/test-postgres.sh:618-749`

Retain the 0600 atomic state file containing only:

```text
RUN_ID=<12 lowercase hex characters>
DATABASE_URL=postgresql://<credentials>@127.0.0.1:<port>/<database>
TEST_DATABASE_URL=postgresql://<credentials>@127.0.0.1:<port>/<database>
SUPERVISOR_PID=<pid>
PORT_FORWARD_PID=<pid>
```

Validate the file grammar before sourcing it. Validate supervisor and
port-forward command identity before signaling any PID. Support recovery when
the recorded port-forward exits while the owned PostgreSQL service remains.
This session boundary lets the source repository and a fresh public tag clone
share one temporary database without sharing source state.

#### Explicit test environment

**Source:** `scripts/test-postgres.sh:751-780`

```bash
DATABASE_URL="$DATABASE_URL" TEST_DATABASE_URL="$TEST_DATABASE_URL" \
  uv run pytest "$@"
```

Capture output to an owned temporary log, redact credentials before printing,
preserve the original exit status, and remove the log under a trap.

#### Fresh and repeat migrations

**Source pattern:** FastAPI `scripts/test-postgres.sh:945-957`

For a fresh one-shot session, run the Django command twice and read migration
state:

```bash
DATABASE_URL="$DATABASE_URL" uv run python manage.py migrate --noinput
DATABASE_URL="$DATABASE_URL" uv run python manage.py migrate --noinput
DATABASE_URL="$DATABASE_URL" uv run python manage.py showmigrations tasks
DATABASE_URL="$DATABASE_URL" uv run python manage.py makemigrations \
  --check --dry-run
```

Record `fresh_migrate=passed`, `repeat_migrate=passed`,
`migration=tasks.0001_initial`, and `drift=none`. Record commands with
`DATABASE_URL=<redacted>`.

#### Source Job rendering and completion

**Source:** FastAPI `scripts/test-postgres.sh:992-1095`

Copy the tracked-file allowlist, JSON ConfigMap generation, exact placeholder
set check, strict dry-run, manifest SHA-256, bounded Job wait, log redaction,
exact Job deletion, and second completion. Translate accepted readback from
`0001 (head)` to `[X] 0001_initial` and translate the health node to Django's
public `/health` behavior.

#### Real server-process readiness and persistence

The FastAPI evidence function proves independent application instances at
`scripts/test-postgres.sh:782-942`. Django needs operating-system process
separation because its acceptance surface is rendered HTTP:

1. Before migration, start an owned `runserver 127.0.0.1:<ephemeral-port>
   --noreload` against the fresh database and observe exact HTTP 503 from
   `/health`.
2. Run the first migration Job and wait for `Complete=True`.
3. Start process A against the migrated database and observe exact HTTP 200 from
   `/health` plus the empty board and `/admin/login/`.
4. Fetch `/`, retain its CSRF cookie and token in mode-0600 temporary files, and
   submit one run-specific task through `POST /tasks/`.
5. Follow the redirect with `GET /` and observe the title, `1 task`, and `Open`.
6. Stop process A by verified PID and command identity.
7. Start process B against the same `DATABASE_URL` and read the retained title
   through `GET /`.
8. Observe exact HTTP 200 health and the administration login from process B,
   then stop it by verified identity.

Use a task title derived from the run ID. Persist only redacted JSONL records
containing sequence, process identity `A` or `B`, method, path, status, and
reader-visible result. Cookie jars, CSRF tokens, response bodies, logs, and PIDs
are temporary and removed during cleanup.

Exercise two additional readiness states through owned short-lived server
processes: missing `DATABASE_URL` and an unreachable loopback URL. Both return
the exact public 503 JSON within a bounded interval. These processes receive
distinct local ports and are stopped before the persistence workflow begins.

#### Modes and order

**Source:** FastAPI `scripts/test-postgres.sh:1198-1330`

Retain these commands:

```text
./scripts/test-postgres.sh --session-start --state-file PATH
./scripts/test-postgres.sh --session-stop --state-file PATH
./scripts/test-postgres.sh --assert-clean --state-file PATH
./scripts/test-postgres.sh --pytest-only [PYTEST_ARGS...]
./scripts/test-postgres.sh --migrations-only
./scripts/test-postgres.sh --jobs-only [--state-file PATH]
./scripts/test-postgres.sh --phase-gate
```

The Django `phase-gate` order is:

1. lock/export reproducibility;
2. missing, unreachable, and fresh-schema 503 observations;
3. production manifest server-side validation;
4. first source Job against the fresh database;
5. second source Job at the current head;
6. migrated 200 health;
7. fresh/repeat migration command readback and zero drift;
8. complete pytest suite against the real PostgreSQL service;
9. process A POST/read and process B restart readback;
10. evidence finalization and exact cleanup.

Attached modes reuse the validated state file and supervised port-forward.
One-shot modes install cleanup immediately after provisioning begins.

#### Exact cleanup

**Source:** FastAPI `scripts/test-postgres.sh:545-617,714-749`

Delete only Job, Deployment, Service, Secret, ConfigMap, and Pod objects selected
by the exact run label. Stop only PIDs whose command lines match the current
run's server, supervisor, or port-forward identity. Require zero labeled
inventory, zero owned processes, absent state/log/cookie/response files, and
available local ports. Emit:

```text
CLEANUP_OK run_id=<run-id> inventory=0 port_forward=stopped servers=0
ASSERT_CLEAN_OK run_id=<run-id> inventory=0 processes=stopped
```

The harness never deletes by broad tutorial prefix. Every post-cleanup query
uses the exact current run label.

### `README.md` and public Stage 2 identity

**Django reader analog:**
`/Users/longnv/bin/repo/sealos-django-tutorial/README.md:15-140`

Preserve the prerequisite -> immutable clone -> locked sync -> migrate -> test
-> server -> public HTTP -> data lifecycle sequence. Change the primary reader
path to `stage-2-postgresql` and document:

- a supplied PostgreSQL `DATABASE_URL` and credential handling;
- `uv sync --locked` and lock/export verification;
- `python manage.py migrate --noinput` twice;
- `showmigrations tasks` and zero migration drift;
- `./scripts/test-postgres.sh --phase-gate` as the full real-server gate;
- `runserver 0.0.0.0:8000 --noreload` with explicit `DATABASE_URL`;
- exact `/health`, rendered create/read, and `/admin/login/` behavior;
- migration Job Secret key `url` and migration-before-readiness ordering;
- PostgreSQL lifecycle and exact-label cleanup.

The SQLite preparation and `db.sqlite3` lifecycle sections are replaced by the
PostgreSQL workflow. Historical `stage-1-deploy` remains documented as the
starter stage.

After every local gate passes, publish public `main` at the accepted commit and
create annotated `stage-2-postgresql` with message `Django PostgreSQL stage`.
Verify:

1. public repository owner, visibility, and default branch;
2. remote `main` equals accepted HEAD;
3. `stage-1-deploy` direct and peeled identities remain unchanged;
4. Stage 2 direct object is an annotated tag and peels to accepted HEAD;
5. tag message and tagger identity are present;
6. active `Protect tutorial stage tags` ruleset still targets
   `refs/tags/stage-*` with update and deletion rules and empty bypass;
7. a fresh HTTPS Stage 2 clone passes lock/export, real PostgreSQL phase gate,
   rendered restart persistence, source identity, and cleanup.

The fresh clone attaches to a separately owned Django harness session through a
mode-0600 state file. It never receives evidence files or credentials in Git.

## Cross-Framework Phase Gate

Phase 25 reruns both frameworks with independent PostgreSQL services and run
IDs. No implementation change is required in the FastAPI repository.

Run the accepted FastAPI gate from
`/Users/longnv/bin/repo/sealos-fastapi-tutorial` and the Django gate from
`/Users/longnv/bin/repo/sealos-django-tutorial`. For each framework, retain
redacted proof of:

- fresh and repeat migration commands;
- production manifest strict validation;
- two source Job `Complete=True` observations;
- migrated 200 readiness;
- public database read/write behavior;
- later-process readback;
- exact-label zero inventory and stopped owned processes.

Use separate temporary evidence roots. Capture FastAPI output into the Phase 25
planning package after its own credential redaction and checksum gate. Query
both namespaces by their exact current run labels during cleanup. An unchanged
FastAPI Git status is part of acceptance.

## Evidence File Contracts

Retain credential-free evidence under:
`.planning/phases/25-django-postgresql-stage/evidence/`.

| File | Required content |
|---|---|
| `README.md` | Evidence schema, command provenance, redaction boundary, and replay order. |
| `package-identity.txt` | Official psycopg package source, selected version, Python compatibility, and lock identity. |
| `django-migrations.txt` | Fresh/repeat command results, `tasks.0001_initial`, drift result, and source hash. |
| `django-jobs.txt` | Production validation plus two source Job names, completion states, and manifest hashes. |
| `django-http.jsonl` | 503 states, process A write/read, process B retained read, health, and admin observations. |
| `django-source.txt` | Accepted HEAD, public main, Stage 1 identity, Stage 2 direct/peeled identity, message, and ruleset. |
| `fastapi-phase-gate.txt` | Current redacted FastAPI migrations, Jobs, readiness, public behavior, and cleanup result. |
| `cleanup.txt` | Both exact run labels, zero resource counts, stopped PIDs, removed temp paths, clean repositories, and free ports. |
| `checksums.txt` | SHA-256 for every retained evidence file except itself, sorted by filename. |

The Django harness may write these through a caller-supplied
`PHASE25_EVIDENCE_DIR` only in `--phase-gate` mode. Evidence helpers return
success immediately when evidence is disabled. Finalization scans for URL
schemes, credentials, password fields, cookies, CSRF tokens, Kubernetes Secret
data, and unresolved template tokens before producing checksums.

Phase execution summaries record commit ancestry, test counts, exact commands,
public identities, evidence checksums, and cleanup readback. Independent
`25-VERIFICATION.md` rechecks live GitHub refs, ruleset state, public clone,
both real database gates, and zero residue.

## Shared Patterns

### Migration ownership

- Django migrations exclusively create and evolve schema.
- Application startup and test helpers perform no `CREATE TABLE` operation.
- `tasks.0001_initial` remains unchanged and replayable on PostgreSQL.
- Readiness becomes healthy only after the Task table exists.

### Public acceptance seam

- Health is observed through `/health`.
- Writes enter through the rendered CSRF-protected `/tasks/` form.
- Persistence is observed through a later `GET /` from a new server process.
- Django administration is observed through `/admin/login/` and the existing
  registered `Task` model.

### Secrets and evidence

- Database credentials live only in environment, 0600 state files, and
  Kubernetes Secret key `url`.
- Temporary logs are redacted before display.
- Retained evidence contains stable outcomes, resource names, hashes, statuses,
  and reader-visible values.
- Error logs identify stable error classes and omit exception text.

### TDD sequence

- Add a real PostgreSQL public-readiness RED before settings and health GREEN.
- Add fresh/repeat migration RED before migration harness GREEN.
- Add production/source Job contract RED before manifest and renderer GREEN.
- Add restart-persistence RED before process-lifecycle GREEN.
- Keep each RED test-only and each direct GREEN child limited to the minimum
  implementation and generated dependency artifacts required by that behavior.

### Cleanup

- Install a trap immediately after each process or resource becomes owned.
- Use bounded waits for database rollout, port-forward, Job completion, and
  Django server readiness.
- Validate PID command identity before signaling.
- Delete Kubernetes resources by exact run label and Jobs by exact name.
- Require clean Django and FastAPI worktrees after generated lock/export checks.

## No Analog Found

Every target has a strong local analog. Two Django-specific details use
composite patterns:

| Detail | Source authority |
|---|---|
| Standard-library PostgreSQL URL to `DATABASES` conversion | Stage 1 Django settings shape plus Phase 25 official Django/psycopg research; FastAPI harness supplies validated `urlsplit` input handling. |
| Django schema-aware health | Existing Django public view plus Django connection introspection; FastAPI Stage 2 supplies the accepted readiness-state behavior. |

The planner should use the exact psycopg patch and connection option names from
`25-RESEARCH.md` once that file is available. The verified implementation
patterns above determine file ownership, public responses, lifecycle order,
security boundaries, and evidence contracts.

## Metadata

**Analog search scope:**

- `/Users/longnv/bin/repo/sealos-django-tutorial` at protected
  `stage-1-deploy` / accepted `main`;
- `/Users/longnv/bin/repo/sealos-fastapi-tutorial` accepted Stage 2 and current
  Stage 3 source;
- `.planning/phases/22-fastapi-postgresql-stage/22-CONTEXT.md`;
- `.planning/phases/22-fastapi-postgresql-stage/22-PATTERNS.md`;
- `.planning/phases/22-fastapi-postgresql-stage/22-VERIFICATION.md`;
- `.planning/phases/24-django-deploy-stage/24-PATTERNS.md`;
- `.planning/phases/24-django-deploy-stage/24-VERIFICATION.md`;
- Phase 25 context, roadmap, requirements, and milestone context.

**Five representative analogs:**

1. `/Users/longnv/bin/repo/sealos-django-tutorial/taskboard/settings.py`
2. `/Users/longnv/bin/repo/sealos-django-tutorial/tests/test_public_http.py`
3. `/Users/longnv/bin/repo/sealos-fastapi-tutorial/scripts/test-postgres.sh`
4. `/Users/longnv/bin/repo/sealos-fastapi-tutorial/deploy/migration-job.yaml`
5. `/Users/longnv/bin/repo/sealos-fastapi-tutorial/tests/test_health.py`

**Pattern extraction date:** 2026-07-16
