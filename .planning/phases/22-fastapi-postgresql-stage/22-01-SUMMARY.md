---
phase: 22-fastapi-postgresql-stage
plan: 01
subsystem: database
tags: [fastapi, postgresql-17, sqlalchemy-2, alembic, psycopg-3, kubernetes, tdd]

requires:
  - phase: 21-fastapi-deploy-stage
    provides: Accepted Tasks API public HTTP contract and reproducible Python 3.12 source
provides:
  - Exact SQLAlchemy, Alembic, and psycopg lock with a runtime-only export
  - Run-scoped Sealos PostgreSQL lifecycle with detached session ownership and fail-closed cleanup
  - Repeatable Alembic revision 0001 for the tasks schema
affects: [22-02, 22-03, 22-04, fastapi-production-stage]

tech-stack:
  added: [SQLAlchemy 2.0.51, Alembic 1.18.5, psycopg 3.3.4, PostgreSQL 17.10]
  patterns: [Alembic-exclusive DDL, typed declarative model, exact-run Kubernetes ownership, shared RED-GREEN database session]

key-files:
  created:
    - /Users/longnv/bin/repo/sealos-fastapi-tutorial/scripts/test-postgres.sh
    - /Users/longnv/bin/repo/sealos-fastapi-tutorial/tests/conftest.py
    - /Users/longnv/bin/repo/sealos-fastapi-tutorial/tests/test_migrations.py
    - /Users/longnv/bin/repo/sealos-fastapi-tutorial/app/models.py
    - /Users/longnv/bin/repo/sealos-fastapi-tutorial/alembic.ini
    - /Users/longnv/bin/repo/sealos-fastapi-tutorial/migrations/env.py
    - /Users/longnv/bin/repo/sealos-fastapi-tutorial/migrations/script.py.mako
    - /Users/longnv/bin/repo/sealos-fastapi-tutorial/migrations/versions/0001_create_tasks.py
  modified:
    - /Users/longnv/bin/repo/sealos-fastapi-tutorial/pyproject.toml
    - /Users/longnv/bin/repo/sealos-fastapi-tutorial/uv.lock
    - /Users/longnv/bin/repo/sealos-fastapi-tutorial/requirements.txt

key-decisions:
  - "Launch the session supervisor in a detached POSIX session so caller and PTY shutdown cannot terminate owned PostgreSQL control processes."
  - "Use Alembic as the exclusive schema owner and map the same explicit tasks shape through typed SQLAlchemy 2 metadata."
  - "Start every migration behavior invocation from Alembic base so the public command test is independently replayable."

patterns-established:
  - "Run ownership: every temporary object carries one generated tutorial.sealos.io/run-id label and every process is recorded in a mode-0600 state file."
  - "Migration TDD: prove database connectivity, retain one run through RED and GREEN, then run a separate fresh replay after exact cleanup."

requirements-completed: [TDD-01, FAST-02]

coverage:
  - id: D1
    description: "The exact database dependency graph and runtime-only compatibility export reproduce from committed inputs."
    requirement: FAST-02
    verification:
      - kind: integration
        ref: "uv lock --check && uv tree --locked --depth 2 && uv export --locked --no-dev --no-emit-project --no-hashes"
        status: pass
    human_judgment: false
  - id: D2
    description: "A fresh real PostgreSQL database reaches Alembic revision 0001, accepts a repeated upgrade, and recreates the exact tasks schema after downgrade."
    requirement: FAST-02
    verification:
      - kind: integration
        ref: "tests/test_migrations.py#test_fresh_and_repeat_upgrade"
        status: pass
      - kind: e2e
        ref: "./scripts/test-postgres.sh --migrations-only"
        status: pass
    human_judgment: false
  - id: D3
    description: "The real PostgreSQL fixture and run-scoped lifecycle are ready for public FastAPI HTTP persistence slices."
    requirement: TDD-01
    verification:
      - kind: integration
        ref: "shared run ccb5b4db121c: rollout, pg_isready, TCP, SQLAlchemy SELECT 1, and exact cleanup"
        status: pass
    human_judgment: false

duration: 34 min
completed: 2026-07-15
status: complete
---

# Phase 22 Plan 01: FastAPI PostgreSQL Migration Foundation Summary

**Exact database dependencies, a run-scoped real PostgreSQL harness, and repeatable Alembic revision 0001 establish the Stage 2 schema boundary**

## Performance

- **Duration:** 34 min
- **Started:** 2026-07-15T08:19:29Z
- **Completed:** 2026-07-15T08:52:58Z
- **Tasks:** 3
- **Files modified:** 11

## Accomplishments

- Verified the three direct database packages against official PyPI metadata before resolving a 31-package Python 3.12 lock and exact runtime export.
- Provisioned PostgreSQL 17.10 in Sealos with one exact run label, bounded rollout and TCP checks, a detached supervisor, a recorded port-forward PID, and cleanup proof for successful and failed commands.
- Drove a real PostgreSQL Alembic test from the missing `script_location` RED to revision `0001`, including repeat upgrade, downgrade, schema inspection, and fresh one-shot replay.

## Package Audit

| Package | Version | Registry/source gate | Result |
|---------|---------|----------------------|--------|
| SQLAlchemy | 2.0.51 | PyPI name/version, Python 3.12, `github.com/sqlalchemy/sqlalchemy`, zero yanked files | Passed |
| Alembic | 1.18.5 | PyPI name/version, Python 3.12, `github.com/sqlalchemy/alembic`, zero yanked files | Passed |
| psycopg with binary extra | 3.3.4 | PyPI name/version, Python 3.12, `github.com/psycopg/psycopg`, zero yanked files | Passed |
| psycopg-binary | 3.3.4 | Locked PyPI registry identity and implementation marker | Passed |
| Mako / MarkupSafe | 1.3.12 / 3.0.3 | Locked PyPI registry identities | Passed |
| greenlet / tzdata | 3.5.3 / 2026.3 | Locked PyPI registry identities and platform markers | Passed |

## TDD Evidence

| Gate | Commit or run | Evidence |
|------|---------------|----------|
| Accepted RED | `46ca2f4` | The test reached real PostgreSQL and failed with pytest status 1 plus `No 'script_location' key found in configuration.` |
| GREEN | `19080ba` | The same public Alembic command test passed with exact `tasks` columns, primary key, boolean default, and revision `0001`. |
| Independent replay | `0945fcf` | The test now begins with `downgrade base`, passes repeatedly, and finishes at `0001`. |
| Fresh cluster replay | `caf54f2c89b5` | `--migrations-only` completed `SELECT 1`, two upgrades, `0001 (head)`, and exact cleanup. |

The accepted RED is the only reachable commit with its exact subject and changes only `tests/test_migrations.py`. GREEN directly follows that RED and changes only the five planned production migration files.

## Resource Ownership and Cleanup

| Run | Purpose | Result |
|-----|---------|--------|
| `08627db24f35` | Successful foundation lifecycle and inherited HTTP regression | 12 tests passed; session stop and assert-clean reported zero objects and stopped processes. |
| `49970394a874` | Expected missing-Alembic failure lifecycle | Nonzero failure retained the exact signature; cleanup reported zero objects and a stopped port-forward. |
| `ccb5b4db121c` | Shared migration RED/GREEN session | Rollout, in-pod `pg_isready`, TCP, and SQLAlchemy `SELECT 1` passed; final inventory and process count were zero. |
| `caf54f2c89b5` | Fresh migrations-only replay | Revision `0001` and repeat upgrade passed; final inventory and process count were zero. |

Every inventory query used the generated `tutorial.sealos.io/run-id` value. Every mutation addressed exact generated names or that exact label. State files held five validated keys at mode 0600 and were removed after cleanup proof.

## Task Commits

1. **Task 1: Audit packages, lock the database stack, and create the owned PostgreSQL harness** - `a638908` (`chore`)
2. **Task 2 RED: Specify fresh and repeat Alembic behavior** - `46ca2f4` (`test`)
3. **Task 3 GREEN: Add the exclusive tasks schema owner** - `19080ba` (`feat`)
4. **Post-GREEN correction: Make each migration test invocation start from base** - `0945fcf` (`test`)

## Files Created/Modified

- `pyproject.toml`, `uv.lock`, and `requirements.txt` - Exact direct database pins, locked transitive graph, and runtime-only export.
- `scripts/test-postgres.sh` - Authenticated Sealos PostgreSQL provisioning, session protocol, mode-0600 handle, detached process ownership, dispatch, and exact cleanup.
- `tests/conftest.py` - Required real database URL, disposable engine, and committed-row reset fixture for later HTTP slices.
- `tests/test_migrations.py` - Public Alembic fresh, repeat, downgrade, current-head, and schema contract.
- `app/models.py` - Typed SQLAlchemy `Base` and `TaskRecord` metadata.
- `alembic.ini` and `migrations/env.py` - Environment-owned URL configuration, `Base.metadata`, and `NullPool` online execution.
- `migrations/script.py.mako` and `migrations/versions/0001_create_tasks.py` - Future revision template and immutable reversible first revision.

## Decisions Made

- The temporary PostgreSQL Pod runs as UID/GID 999 with `RuntimeDefault` seccomp, all capabilities dropped, and privilege escalation disabled, satisfying the namespace restricted policy warning.
- Python `os.setsid()` detaches the session supervisor from the invoking PTY while preserving one recorded supervisor PID for exact shutdown.
- Alembic `Config(stdout=StringIO())` provides deterministic `current` output for the command-level test.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Detached the session supervisor from invoking PTY teardown**
- **Found during:** Task 1 live lifecycle verification
- **Issue:** The initial background supervisor and port-forward inherited the Codex PTY lifetime and exited after `--session-start` returned.
- **Fix:** Launched the supervisor through Python `os.setsid()`, retained exact PID identity checks, and reaped the owned port-forward during cleanup.
- **Files modified:** `scripts/test-postgres.sh`
- **Verification:** Run `08627db24f35` stayed reachable from a later command, passed `SELECT 1` and 12 HTTP tests, then stopped with zero owned objects and processes.
- **Committed in:** `a638908`

**2. [Rule 1 - Bug] Replaced the invalid Alembic stdout assertion before GREEN acceptance**
- **Found during:** Task 3 first GREEN run
- **Issue:** Alembic `Config` binds its stdout object at construction, so `capsys.readouterr()` returned empty even though `command.current()` printed `0001 (head)`.
- **Fix:** Amended the test-only RED from retired `6711ebd` to accepted `46ca2f4`, using `Config(stdout=StringIO())`, then replayed the accepted RED from an isolated committed-only clone against the same real PostgreSQL run.
- **Files modified:** `tests/test_migrations.py`
- **Verification:** The isolated replay failed with pytest status 1 and the exact missing-`script_location` signature; one accepted RED subject remains reachable.
- **Committed in:** `46ca2f4`

**3. [Rule 1 - Bug] Made migration test invocations independently replayable**
- **Found during:** Task 3 post-GREEN verification
- **Issue:** The first successful invocation finished at head, so a later invocation encountered an existing table before exercising the repeat contract.
- **Fix:** Begin each invocation with Alembic `downgrade base`, then assert application-schema absence and execute the complete upgrade sequence.
- **Files modified:** `tests/test_migrations.py`
- **Verification:** Two consecutive focused invocations passed, GREEN remains directly adjacent to accepted RED, and fresh run `caf54f2c89b5` passed independently.
- **Committed in:** `0945fcf`

---

**Total deviations:** 3 auto-fixed bugs.
**Impact on plan:** The fixes enforce process ownership and independently repeatable migration evidence while preserving the requested package, schema, commit-scope, and cleanup boundaries.

## Issues Encountered

- `kubectl` emits the cluster's legacy service-account token warning on authenticated commands. Every exact-name and exact-label operation still completes successfully.
- FastAPI 0.139.0 emits Starlette's upstream TestClient deprecation warning with HTTPX 0.28.1. The inherited 12-case behavior suite passes with the accepted lock.

## Known Stubs

- `scripts/test-postgres.sh:534` recognizes `--jobs-only` and stops behind an explicit manifest gate. Plan 22-03 supplies and validates the production and source migration Job contracts; this staged boundary does not affect the Plan 22-01 package, PostgreSQL lifecycle, or Alembic goals.

## User Setup Required

None - the authenticated Sealos context and namespace were available, and every temporary resource was removed.

## TDD Gate Compliance

- Accepted RED `46ca2f4` changes only `tests/test_migrations.py` and reproduces the exact intended real-database failure.
- GREEN `19080ba` is the direct child of accepted RED and changes exactly `alembic.ini`, `app/models.py`, `migrations/env.py`, `migrations/script.py.mako`, and `migrations/versions/0001_create_tasks.py`.
- Forward test correction `0945fcf` preserves both accepted gate commits and makes later verification repeatable.

## Next Phase Readiness

- Plan 22-02 can inject the explicit test URL into `create_app()` and replace process-local task storage one public HTTP behavior at a time.
- Plan 22-03 can extend the existing run ownership and cleanup functions with the tracked production Job and source validation adapter.
- Plan 22-04 can publish only after the database HTTP, health, Job, clean-clone, and immutable tag gates pass.

## Self-Check: PASSED

- All 11 created or modified implementation files exist.
- All four reachable Plan 22-01 commits exist with accepted RED/GREEN identity and exact scope.
- Official metadata, lock, export, migration behavior, fresh replay, inherited HTTP regression, secret scan, deletion scan, and exact cleanup gates pass.

---
*Phase: 22-fastapi-postgresql-stage*
*Completed: 2026-07-15*
