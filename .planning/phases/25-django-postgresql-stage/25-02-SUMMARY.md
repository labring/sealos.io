---
phase: 25-django-postgresql-stage
plan: "02"
subsystem: database-testing
tags: [django, postgresql-17, psycopg-3, pytest-django, kubernetes, tdd]

requires:
  - phase: 25-django-postgresql-stage
    plan: "01"
    provides: Approved Psycopg 3.3.4 dependency foundation
  - phase: 24-django-deploy-stage
    provides: Accepted five-behavior Django Stage 1 public seam
  - phase: 22-fastapi-postgresql-stage
    provides: Verified run-labeled PostgreSQL lifecycle and cleanup pattern
provides:
  - Owned run-labeled PostgreSQL 17 test sessions with exact cleanup
  - Strict explicit PostgreSQL URL conversion with a distinct pytest database
  - Schema-aware public health and all five Stage 1 behaviors on real PostgreSQL
affects: [25-03, 25-04, 25-05, django-production-stage, django-tutorials]

tech-stack:
  added: []
  patterns: [owned database session, explicit test database, schema-aware readiness, public-seam TDD]

key-files:
  created:
    - /Users/longnv/bin/repo/sealos-django-tutorial/scripts/test-postgres.sh
    - /Users/longnv/bin/repo/sealos-django-tutorial/tests/conftest.py
    - /Users/longnv/bin/repo/sealos-django-tutorial/tests/test_postgresql.py
  modified:
    - /Users/longnv/bin/repo/sealos-django-tutorial/tests/test_public_http.py
    - /Users/longnv/bin/repo/sealos-django-tutorial/taskboard/settings.py
    - /Users/longnv/bin/repo/sealos-django-tutorial/tasks/views.py

key-decisions:
  - "Name each pytest database test_<run-id> while retaining tasks as the runtime database on the same owned PostgreSQL service."
  - "Represent missing database configuration with Django's dummy backend and expose no usable persistence fallback."
  - "Derive readiness from PostgreSQL reachability and Task._meta.db_table introspection with a one-second connection timeout."

patterns-established:
  - "Django PostgreSQL test session: one exact run label owns the Secret, Deployment, Service, Pod, supervisor, and loopback port-forward."
  - "Readiness TDD: migrate only tasks to zero, observe exact public 503, restore 0001_initial in finally, then observe exact public 200."

requirements-completed: []

coverage:
  - id: D1
    description: "A five-key mode-0600 session owns a dedicated PostgreSQL 17 service and proves exact cleanup for every run."
    requirement: TDD-02
    verification:
      - kind: integration
        ref: "scripts/test-postgres.sh --session-start/--session-stop/--assert-clean for runs 72b34cce0ecf and 14c09f421314"
        status: pass
      - kind: integration
        ref: "exact-label Kubernetes and process readback for all three Plan 25-02 run IDs"
        status: pass
    human_judgment: false
  - id: D2
    description: "Django accepts only explicit PostgreSQL URLs, isolates pytest in a distinct database, and gates health on the migrated Task table."
    requirement: DJAN-02
    verification:
      - kind: integration
        ref: "tests/test_postgresql.py URL cases and migration-zero/migrated public health cases"
        status: pass
      - kind: integration
        ref: "22/22 tests passed on shared real PostgreSQL run 14c09f421314"
        status: pass
    human_judgment: false
  - id: D3
    description: "Exactly the five accepted Stage 1 public behaviors pass through Django Client, ORM, forms, templates, middleware, admin, and real PostgreSQL."
    requirement: TDD-02
    verification:
      - kind: integration
        ref: "scripts/test-postgres.sh --pytest-only tests/test_public_http.py tests/test_postgresql.py -q -x on run 7f19c0945a8c"
        status: pass
    human_judgment: false

duration: 15 min
completed: 2026-07-16
status: complete
---

# Phase 25 Plan 02: Real PostgreSQL Public Seam Summary

**Run-scoped PostgreSQL 17 sessions now drive strict Django configuration, schema-aware health, and all five retained public behaviors**

## Performance

- **Duration:** 15 min
- **Started:** 2026-07-15T23:32:49Z
- **Completed:** 2026-07-15T23:47:20Z
- **Tasks:** 3
- **Files modified:** 6

## Accomplishments

- Added a Bash 3.2-compatible session harness that creates one labeled PostgreSQL 17 service, writes a five-key 0600 handle after authenticated connectivity, and proves exact cleanup.
- Added one retained RED/GREEN pair for strict PostgreSQL URL conversion and Task-table-aware public readiness on a real database.
- Replayed exactly five Stage 1 public behaviors through real Django collaborators and real PostgreSQL with a PostgreSQL-only runtime backend.

## Runtime Evidence

| Run ID | Purpose | Result | Cleanup |
|--------|---------|--------|---------|
| `72b34cce0ecf` | Foundation session start/stop/assert | PostgreSQL rollout, loopback forwarding, and Psycopg `SELECT 1` passed | `ASSERT_CLEAN_OK`; state removed |
| `14c09f421314` | Shared readiness RED/GREEN | RED produced `assert 200 == 503`; GREEN passed 22/22 | `ASSERT_CLEAN_OK`; temp root removed |
| `7f19c0945a8c` | Fresh complete public-seam replay | 22/22, Django check, lock, export, and source checks passed | `CLEANUP_OK`; exact-label readback zero |

Every independent readback found zero labeled Deployment, Pod, Service,
Secret, Job, and ConfigMap objects plus zero matching port-forward processes.
Database URLs and credentials remained inside child environments and 0600 state.

## TDD Evidence

- RED commit `087ee6323dce005090c6707598fd21149bbb0536` changed only `tests/test_postgresql.py` and `tests/test_public_http.py`.
- The focused RED ran after a real PostgreSQL `SELECT 1` and exited with pytest status 1 on `assert 200 == 503` for an unmigrated Task schema.
- GREEN commit `d5036c9b0b2a14b5ddde523f61691b0340d42c26` is the direct child of RED and changed only `taskboard/settings.py` and `tasks/views.py`.
- GREEN and the fresh acceptance run each passed 22/22 tests on PostgreSQL.

## Database Contract

- `TEST_DATABASE_URL` takes precedence during pytest; `DATABASE_URL` remains the runtime URL.
- Both URLs use one authenticated owned service while naming `tasks` and `test_<run-id>` as distinct databases.
- Accepted schemes are `postgres` and `postgresql`; credentials, host, port, and one database segment are mandatory and strictly decoded.
- Queried, fragmented, multi-path, malformed-port, unsupported, and incomplete values fail configuration without echoing input or credentials.
- The configured backend is `django.db.backends.postgresql` with `connect_timeout: 1`, `CONN_MAX_AGE: 0`, and explicit `TEST.NAME`.
- Missing configuration selects Django's dummy backend and exposes no persistence path.

## Public Readiness

- Migrated and reachable PostgreSQL returns exact HTTP 200 `{"status":"ok"}`.
- Missing configuration, database failure, or a missing `Task._meta.db_table` returns exact HTTP 503 `{"status":"unavailable"}`.
- Database failures close the connection and log only a stable reason class.
- The initial migration remains byte-identical at SHA-256 `745bc45f655bf0b164c1464c0c22786d22910e2aea235772e5dcea38495e4bf3`.

## Task Commits

1. **Task 1: Create the owned real-PostgreSQL test foundation** - `67e7b19` (`chore`)
2. **Task 2 RED: Specify strict PostgreSQL readiness** - `087ee63` (`test`)
3. **Task 2 GREEN: Require migrated PostgreSQL** - `d5036c9` (`feat`)
4. **Task 3: Re-run the complete Stage 1 public seam** - acceptance only; no commit

## Files Created/Modified

- `/Users/longnv/bin/repo/sealos-django-tutorial/scripts/test-postgres.sh` - Owns session identity, Kubernetes resources, state transfer, pytest dispatch, redaction, and cleanup.
- `/Users/longnv/bin/repo/sealos-django-tutorial/tests/conftest.py` - Requires harness identity and coherent explicit runtime/test URLs.
- `/Users/longnv/bin/repo/sealos-django-tutorial/tests/test_postgresql.py` - Covers URL conversion and real migrated/unmigrated health states.
- `/Users/longnv/bin/repo/sealos-django-tutorial/tests/test_public_http.py` - Retains exactly five public behaviors and marks health for database access.
- `/Users/longnv/bin/repo/sealos-django-tutorial/taskboard/settings.py` - Converts explicit URLs into native Django PostgreSQL fields with no SQLite runtime path.
- `/Users/longnv/bin/repo/sealos-django-tutorial/tasks/views.py` - Gates health on configured, reachable, migrated PostgreSQL.

## Decisions Made

- Used the run identity in the explicit pytest database name so state-file coherence is mechanically verifiable before any process signaling.
- Kept pytest-django responsible for test database creation, migrations, isolation, and destruction.
- Preserved the rendered board, ModelForm, routes, template, CSRF/session middleware, administration, and immutable migration byte-for-byte.
- Left `DJAN-02`, `TDD-02`, and `TDD-03` pending until the complete Phase 25 verification gate.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

The Kubernetes API emitted its existing TokenRequest advisory during read-only
and lifecycle commands. Authentication and every authorized operation passed.

## User Setup Required

None - the authenticated Sealos context supplied the planned test namespace.

## Known Stubs

None.

## Next Phase Readiness

- Plan 25-03 can use the strict runtime settings and run-labeled harness to prove fresh/repeat Django migrations and the source migration Job.
- Plan 25-04 can extend the same owned session grammar to independent server-process persistence without changing the accepted public board seam.
- Phase requirements remain pending until migration, persistence, shared-framework, publication, and independent phase verification finish.

## Self-Check: PASSED

- All six implementation/test files exist and the three exact task commits resolve.
- RED/GREEN ancestry, commit scopes, 22/22 PostgreSQL tests, five public function names, migration hash, lock/export, and PostgreSQL-only settings assertions pass.
- Runs `72b34cce0ecf`, `14c09f421314`, and `7f19c0945a8c` each have zero exact-label inventory and zero owned processes.
- Coverage classification reports three fully automated, passing deliverables with zero schema errors.

---
*Phase: 25-django-postgresql-stage*
*Completed: 2026-07-16*
