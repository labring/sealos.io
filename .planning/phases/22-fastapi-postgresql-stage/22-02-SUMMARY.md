---
phase: 22-fastapi-postgresql-stage
plan: "02"
subsystem: api
tags: [fastapi, postgresql, sqlalchemy-2, psycopg-3, pytest, tdd]

requires:
  - phase: 22-fastapi-postgresql-stage
    plan: "01"
    provides: Run-scoped real PostgreSQL, Alembic revision 0001, and deterministic cleanup
provides:
  - Synchronous SQLAlchemy runtime with one closing Session per request
  - PostgreSQL-backed Tasks API CRUD with stable Stage 1 HTTP contracts
  - Four public HTTP RED/GREEN persistence tracers across application instances
affects: [22-03, 22-04, fastapi-production-stage, fastapi-tutorials]

tech-stack:
  added: []
  patterns: [explicit database URL precedence, FastAPI lifespan engine disposal, committed cross-instance HTTP proof]

key-files:
  created:
    - /Users/longnv/bin/repo/sealos-fastapi-tutorial/app/database.py
  modified:
    - /Users/longnv/bin/repo/sealos-fastapi-tutorial/app/main.py
    - /Users/longnv/bin/repo/sealos-fastapi-tutorial/tests/test_api.py

key-decisions:
  - "Build one database runtime per create_app invocation so explicit test URLs and engine disposal share the application lifecycle."
  - "Use one synchronous Session per request, commit every mutation, and prove durability only through later public HTTP reads."
  - "Keep every tracer RED directly adjacent to its minimum GREEN while the final suite passes TEST_DATABASE_URL explicitly."

patterns-established:
  - "Application factory: explicit URL takes precedence over DATABASE_URL, then lifespan disposal closes its engine."
  - "Persistence specification: application A mutates and a newly constructed application B or C observes the committed result through HTTP."

requirements-completed: []

coverage:
  - id: D1
    description: "Task create, item read, list, complete update, and delete survive independent application construction through real PostgreSQL."
    requirement: FAST-02
    verification:
      - kind: integration
        ref: "tests/test_api.py#cross-instance persistence tests"
        status: pass
    human_judgment: false
  - id: D2
    description: "Swagger UI and every inherited Tasks API response, validation, and error contract pass against real PostgreSQL."
    requirement: TDD-01
    verification:
      - kind: e2e
        ref: "./scripts/test-postgres.sh --pytest-only tests/test_api.py -q -x --state-file /tmp/sealos-fastapi-phase22-02-03.env (18 passed)"
        status: pass
    human_judgment: false
  - id: D3
    description: "Four exact RED/GREEN pairs retain direct adjacency and all three database runs leave zero owned resources or processes."
    requirement: TDD-01
    verification:
      - kind: other
        ref: "git parent/scope audit and exact run-label inventory audit"
        status: pass
    human_judgment: false

duration: 39 min
completed: 2026-07-15
status: complete
---

# Phase 22 Plan 02: FastAPI PostgreSQL CRUD Summary

**Synchronous SQLAlchemy CRUD preserves the Tasks API contract and survives fresh application instances through real PostgreSQL**

## Performance

- **Duration:** 39 min
- **Started:** 2026-07-15T08:59:38Z
- **Completed:** 2026-07-15T09:38:43Z
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments

- Added an explicit database runtime with `pool_pre_ping`, synchronous sessionmaker, one closing Session per request, and lifespan engine disposal.
- Replaced every process-local Tasks API operation with parameter-bound SQLAlchemy 2 reads and committed mutations while preserving public payloads and status codes.
- Proved create/read, list, complete PUT, and delete durability across application instances through four strict RED/GREEN pairs on real Sealos PostgreSQL.
- Passed 18 public HTTP cases, including generated Swagger UI, POST and PUT title bounds, empty 204 deletion, and stable unknown-task responses.

## TDD Evidence

| Behavior | RED and observed failure | GREEN and result | Order and scope |
|----------|--------------------------|------------------|-----------------|
| Create/read across instances | `be6463d` - `assert 404 == 200`, `{'detail': 'Task not found'}` | `d54a2ad` - focused create/read set passed | Direct child; RED test-only, GREEN `app/database.py` plus `app/main.py` |
| Persisted listing | `d18e611` - `assert [] == [{...}]` | `f49c20c` - cross-instance list and accumulated set passed | Direct child; RED test-only, GREEN `app/main.py` only |
| Persisted complete update | `167b509` - `assert 404 == 200`, stable 404 body | `ceb3aa4` - application C observed application B's PUT | Direct child; RED test-only, GREEN `app/main.py` only |
| Persisted deletion | `e93a26f` - `assert 404 == 204`, stable 404 body | `5ec9612` - empty 204 followed by application C 404 | Direct child; RED test-only, GREEN `app/main.py` only |

Every behavior assertion uses FastAPI's public HTTP interface. Test setup uses the fixture boundary only for Alembic-owned schema isolation through `TRUNCATE TABLE tasks RESTART IDENTITY`; no test queries PostgreSQL to verify application behavior.

## Real Database Evidence

| Run ID | Purpose | Result | Cleanup |
|--------|---------|--------|---------|
| `5a5b93f1bacb` | Create/read RED and GREEN | Rollout, in-pod `pg_isready`, port-forward TCP, `SELECT 1`, revision `0001`, and 3 focused cases passed | Exact inventory 0; supervisor and port-forward stopped; state removed |
| `27a4bd4930b4` | Serialized list, update, and delete cycles | All exact RED signatures reproduced; final committed suite reported 16 passed | Exact inventory 0; supervisor and port-forward stopped; state removed |
| `0445a746ec24` | Complete Stage 1 contract plus PUT validation | Attached `--pytest-only` run reported 18 passed in 134.80 seconds | Exact inventory 0; supervisor and port-forward stopped; state removed |

Final exact-label queries for all three run IDs returned zero Deployment, Pod, Service, Job, Secret, and ConfigMap objects. Exact process-name probes returned zero processes.

## Task Commits

1. **Task 1 RED: Specify cross-instance task persistence** - `be6463d` (`test`)
2. **Task 1 GREEN: Persist task creation and retrieval** - `d54a2ad` (`feat`)
3. **Task 2 listing RED: Specify persisted listing** - `d18e611` (`test`)
4. **Task 2 listing GREEN: List persisted tasks** - `f49c20c` (`feat`)
5. **Task 2 update RED: Specify persisted updates** - `167b509` (`test`)
6. **Task 2 update GREEN: Update persisted tasks** - `ceb3aa4` (`feat`)
7. **Task 2 deletion RED: Specify persisted deletion** - `e93a26f` (`test`)
8. **Task 2 deletion GREEN: Delete persisted tasks** - `5ec9612` (`feat`)
9. **Task 3: Cover complete PUT validation** - `d261b10` (`test`)

## Files Created/Modified

- `app/database.py` - Owns the explicit engine, synchronous session factory, request dependency, and deterministic disposal path.
- `app/main.py` - Resolves the database URL per application and implements database-backed public CRUD.
- `tests/test_api.py` - Supplies closing real-database clients, cross-instance persistence specifications, and complete POST/PUT validation coverage.

## Decisions Made

- A `DatabaseRuntime` belongs to each FastAPI application factory call. This keeps explicit test configuration isolated and gives every TestClient context a deterministic engine shutdown path.
- SQLAlchemy sessions belong to individual HTTP requests. Mutations commit before responses so a later application instance observes them.
- ORM records are converted to the established Pydantic response shape at the route boundary, preserving the Stage 1 JSON contract.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Staged the explicit factory URL transition after the first accepted GREEN**
- **Found during:** Task 1 RED
- **Issue:** The baseline `create_app()` accepted zero arguments, while the plan required the accepted RED commit to change only the test and fail with application B's HTTP 404. Calling the future explicit-URL signature at RED would have failed with `TypeError` before reaching the confirmed HTTP seam.
- **Fix:** Replayed the exact 404 RED with both clients consuming the already sourced run database environment, implemented the database-aware factory in the directly adjacent GREEN, then changed the final fixtures and all persistence clients to `create_app(test_database_url)` in the next test-only RED.
- **Files modified:** `tests/test_api.py`, `app/database.py`, `app/main.py`
- **Verification:** Accepted RED reproduced `assert 404 == 200`; GREEN directly followed it; the final source contains explicit URL calls and all 18 cases pass.
- **Committed in:** `be6463d`, `d54a2ad`, `d18e611`

---

**Total deviations:** 1 auto-fixed blocking issue.
**Impact on plan:** The adjustment preserves the exact requested RED failure, direct RED/GREEN adjacency, final explicit URL contract, and public-only behavior seam.

## Issues Encountered

- A post-test zsh audit wrapper referenced Bash-only `PIPESTATUS` after a successful 16-case run. The database session stayed active, a zsh-safe audit confirmed all three pairs, and normal `session-stop` plus `assert-clean` completed with zero footprint.
- Real Sealos PostgreSQL round trips made complete API runs take 120 to 135 seconds, above the 20-second focused feedback target. All commands stayed within bounded harness limits and passed consistently.
- FastAPI 0.139.0 continues to emit the accepted Starlette TestClient deprecation warning with HTTPX 0.28.1. The locked dependency graph remains unchanged and all behavior passes.

## Known Stubs

None. Scans found no TODO, placeholder, mock, `create_all`, or process-local task store in the changed application and test files.

## User Setup Required

None. The authenticated Sealos context supplied the real database boundary and every temporary object was removed.

## TDD Gate Compliance

- Four accepted RED commits each change only `tests/test_api.py` and reproduce the planned public HTTP failure.
- Each GREEN is the direct child of its RED; the first changes exactly `app/database.py` and `app/main.py`, and the remaining three change only `app/main.py`.
- Every GREEN passed its named test and the accumulated implemented behaviors. The committed final suite passes 18 cases on real PostgreSQL.

## Next Phase Readiness

- Plan 22-03 can use `DatabaseRuntime` for schema-aware `/health` and the tracked migration Job contracts.
- Plan 22-04 can publish after readiness, Job, clean-clone, and immutable Stage 2 identity gates pass.
- Phase requirements remain open until all four Phase 22 plans and the phase verifier complete.

## Self-Check: PASSED

- All three changed application/test files exist and implementation HEAD is `d261b10881bfc44f23c8a058ba8653e76edb7a4b`.
- All nine Plan 22-02 implementation commits exist with the recorded scopes and parent relationships.
- `uv lock --check`, 18-case collection, public HTTP full run, mock scan, `create_all` scan, stub scan, and exact cleanup audits pass.

---
*Phase: 22-fastapi-postgresql-stage*
*Completed: 2026-07-15*
