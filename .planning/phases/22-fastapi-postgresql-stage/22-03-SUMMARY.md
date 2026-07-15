---
phase: 22-fastapi-postgresql-stage
plan: "03"
subsystem: infra
tags: [fastapi, postgresql, readiness, kubernetes-job, alembic, pytest, tdd]

requires:
  - phase: 22-fastapi-postgresql-stage
    plan: "02"
    provides: PostgreSQL-backed CRUD, explicit application database URLs, and real-cluster test lifecycle
provides:
  - Schema-aware public readiness with one stable 503 response for every unready state
  - Strict production migration Job contract and source-mounted pre-image adapter
  - Two repeatable real migration Job completions followed by public health acceptance
  - Credential-redacted combined phase gate with exact Kubernetes and process cleanup
affects: [22-04, fastapi-production-stage, fastapi-tutorials]

tech-stack:
  added: []
  patterns: [schema-gated readiness, exact-source migration Job, bounded tunnel recovery, redacted integration evidence]

key-files:
  created:
    - /Users/longnv/bin/repo/sealos-fastapi-tutorial/tests/test_health.py
    - /Users/longnv/bin/repo/sealos-fastapi-tutorial/tests/test_migration_job.py
    - /Users/longnv/bin/repo/sealos-fastapi-tutorial/deploy/migration-job.yaml
    - /Users/longnv/bin/repo/sealos-fastapi-tutorial/deploy/source-migration-job.yaml
  modified:
    - /Users/longnv/bin/repo/sealos-fastapi-tutorial/app/database.py
    - /Users/longnv/bin/repo/sealos-fastapi-tutorial/app/main.py
    - /Users/longnv/bin/repo/sealos-fastapi-tutorial/scripts/test-postgres.sh

key-decisions:
  - "Return credential-free readiness categories internally and translate every unready category to one public 503 detail."
  - "Package only the tracked model, Alembic configuration, immutable revision, and runtime export into the source Job ConfigMap."
  - "Recover a transient local port-forward inside a bounded child process while preserving the database, run identity, and exact cleanup contract."

patterns-established:
  - "Readiness order: prove public 503 before migration, run the exclusive migration owner, then accept public 200."
  - "Job proof: strict server dry-run, render an allowlisted token set, complete and delete two exact Jobs, then verify revision and health."
  - "Evidence safety: capture pytest output to a temporary file, redact URL credentials before display, and remove the file through a subprocess trap."

requirements-completed: []

coverage:
  - id: D1
    description: "Missing configuration, unreachable PostgreSQL, and reachable unmigrated PostgreSQL return the same public 503 body; migrated PostgreSQL returns the established 200 body."
    requirement: TDD-01
    verification:
      - kind: integration
        ref: "tests/test_health.py plus ./scripts/test-postgres.sh --phase-gate (24 accumulated cases passed)"
        status: pass
    human_judgment: false
  - id: D2
    description: "The production migration manifest validates strictly and two source-mounted Jobs complete at Alembic revision 0001 before readiness acceptance."
    requirement: FAST-02
    verification:
      - kind: e2e
        ref: "run f4c71ddac91d: production dry-run, migration-1 Complete, migration-2 Complete, health 200"
        status: pass
    human_judgment: false
  - id: D3
    description: "The combined gate reproduces dependencies, redacts test evidence, and removes every exact-run object and port-forward process."
    requirement: FAST-02
    verification:
      - kind: other
        ref: "run f4c71ddac91d: lock/export zero diff and CLEANUP_OK inventory=0 port_forward=stopped"
        status: pass
    human_judgment: false

duration: 30 min
completed: 2026-07-15
status: complete
---

# Phase 22 Plan 03: FastAPI Readiness and Migration Job Summary

**Schema-aware public readiness now follows two strictly validated, repeatable migration Jobs on real Sealos PostgreSQL with redacted evidence and zero runtime footprint**

## Performance

- **Duration:** 30 min
- **Started:** 2026-07-15T09:46:05Z
- **Completed:** 2026-07-15T10:16:31Z
- **Tasks:** 3
- **Files modified:** 7

## Accomplishments

- Gated `/health` on a real PostgreSQL connection and the migrated `tasks` schema while preserving one exact 503 response across all unready states.
- Added a future Stage 2 application-image migration Job plus a source-mounted adapter that completed twice against the same real database at revision `0001`.
- Extended the real-cluster harness with strict server validation, allowlisted template rendering, exact source packaging, post-Job public health, dependency replay, credential redaction, and deterministic cleanup.
- Passed one terminating phase gate with 24 accumulated tests, two Job completions, health 200, zero lock/export drift, and zero owned resources.

## TDD Evidence

| Behavior | RED and observed failure | GREEN and result | Order and scope |
|----------|--------------------------|------------------|-----------------|
| Schema-aware readiness | `349ed88` - reachable unmigrated PostgreSQL returned `200 {"status":"ok"}` and failed with `assert 200 == 503` | `48f3ba7` - all four health states plus the 18-case API suite passed | Direct child; RED changed only `tests/test_health.py`; GREEN changed only `app/database.py` and `app/main.py` |
| Repeatable migration Job contract | `a3ba877` - failed with `AssertionError: deploy/migration-job.yaml must exist` after real database preflight | `e9edf1e` - static manifest test, strict server dry-run, two Job completions, revision `0001`, and health 200 passed | Direct child; RED changed only `tests/test_migration_job.py`; GREEN changed only both deploy manifests and the harness |

The static migration Job test reads only the tracked production manifest. It contains no harness, cluster client, subprocess, or live Job invocation; the shell harness exclusively owns live execution.

## Real Environment Evidence

| Run ID | Purpose | Result | Cleanup |
|--------|---------|--------|---------|
| `fc041b611074` | Health RED/GREEN | Exact unmigrated RED, four-state GREEN, and 22 accumulated health/API cases passed | `ASSERT_CLEAN_OK`; zero objects and stopped processes |
| `ec73f5b1e8ba` | Job RED/GREEN | Strict production dry-run; both `migration-1` and `migration-2` reached Complete at `0001`; recovered tunnel then health 200 | Both Jobs and ConfigMap deleted exactly; final inventory and process count zero |
| `f4c71ddac91d` | Combined phase gate | Pre-migration 503, repeated local migration, 24 tests, two Complete Jobs, post-Job 200, lock/export zero diff | `CLEANUP_OK inventory=0 port_forward=stopped` |

The accepted combined Job identities were:

- `tutorial-fastapi-pg-test-f4c71ddac91d-migration-1` with rendered manifest SHA-256 `9bab1e2fa0b27c8e6e84570979ba6ea7500985bed1cfc3091d353d6879cd14c2`.
- `tutorial-fastapi-pg-test-f4c71ddac91d-migration-2` with rendered manifest SHA-256 `6ce0be3af5c3c97a7a9b5b765bd4735a156a3204d26ae78551d4b838ad515f49`.

Neither rendered manifest contains a Secret payload. Job logs were scanned for database URLs, `DATABASE_URL=`, and password assignments before the redacted completion record was accepted.

## Task Commits

1. **Task 1 RED: Specify schema-aware database readiness** - `349ed88` (`test`)
2. **Task 1 GREEN: Gate health on the migrated tasks schema** - `48f3ba7` (`feat`)
3. **Task 2 RED: Specify the repeatable migration Job contract** - `a3ba877` (`test`)
4. **Task 2 GREEN: Add production and source migration Job contracts** - `e9edf1e` (`feat`)
5. **Task 3: Redact combined phase-gate test evidence** - `d5f24d7` (`fix`)

## Files Created/Modified

- `app/database.py` - Opens a bounded real connection and reports configuration, connectivity, or missing-schema readiness categories without credentials.
- `app/main.py` - Translates every unready category to `503 {"detail":"Database is not ready"}` and retains the ready response.
- `tests/test_health.py` - Exercises unconfigured, unreachable, unmigrated, and migrated readiness through public HTTP.
- `tests/test_migration_job.py` - Pins the complete static production migration Job contract without invoking live infrastructure.
- `deploy/migration-job.yaml` - Runs `alembic upgrade head` from the Stage 2 application image with `DATABASE_URL` from Secret key `url`.
- `deploy/source-migration-job.yaml` - Executes the same migration from allowlisted tracked source in a bounded, run-labeled Job.
- `scripts/test-postgres.sh` - Validates, renders, executes, redacts, recovers, and cleans the complete real-cluster gate.

## Decisions Made

- Readiness checks return fixed internal categories. Application logging records only those categories, so connection URLs and driver exception text stay outside responses and evidence.
- The source ConfigMap contains exactly six tracked inputs: the SQLAlchemy model, Alembic configuration and environment, revision template, revision `0001`, and runtime export.
- Each source Job is deleted by exact name before the next execution. The run label remains the ownership boundary for final inventory and cleanup.
- A dead local tunnel can be re-established on the recorded local port inside a subprocess while the real database and run label remain unchanged. Its trap proves the replacement process stops.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Recovered a transient port-forward loss without replacing the database run**
- **Found during:** Task 2 GREEN live Job verification
- **Issue:** Both source Jobs completed, then the long-lived local tunnel logged `lost connection to pod`; the PostgreSQL Pod remained Ready with zero restarts and public health could not reach it.
- **Fix:** Added a bounded recovery tunnel on the recorded local port inside a subprocess, retained the same Service, database, and run identity, and stopped the recovery PID through an EXIT trap.
- **Files modified:** `scripts/test-postgres.sh`
- **Verification:** Run `ec73f5b1e8ba` replayed both Jobs, observed health 200, stopped recovery PID `40398`, and finished with zero resources or processes.
- **Committed in:** `e9edf1e`

**2. [Rule 1 - Bug] Replaced a Bash-version-specific recovery log identifier**
- **Found during:** Task 2 GREEN recovery replay
- **Issue:** The host Bash version treats `BASHPID` as unavailable under `set -u`.
- **Fix:** Allocate the recovery log through `mktemp` with the run ID in its validated prefix.
- **Files modified:** `scripts/test-postgres.sh`
- **Verification:** The next recovery replay completed both Jobs and removed its temporary log and process.
- **Committed in:** `e9edf1e`

**3. [Rule 2 - Security] Redacted pytest fixture credentials on failure paths**
- **Found during:** Task 3 combined-gate preparation
- **Issue:** A failed public health assertion showed the real test URL in pytest fixture output.
- **Fix:** Capture every harness-owned pytest invocation in a mode-scoped temporary log, redact URL credentials before display, and delete the log through a subprocess trap.
- **Files modified:** `scripts/test-postgres.sh`
- **Verification:** The terminating `--phase-gate` passed with redacted output and left no run-scoped temporary files.
- **Committed in:** `d5f24d7`

---

**Total deviations:** 3 auto-fixed issues (2 Rule 1 bugs, 1 Rule 2 security requirement).
**Impact on plan:** The fixes preserve the planned public contracts, exact database runs, commit scopes, and Job order while making evidence and local transport resilient.

## Issues Encountered

- The cluster emits a legacy service-account token warning on authenticated commands. Every exact-name and exact-label operation completed successfully.
- Strict server dry-run reports the production Job's expected restricted-policy warning because application-image non-root hardening remains Phase 23 scope. The source validation adapter itself runs non-root with dropped capabilities and `RuntimeDefault` seccomp.
- The accepted FastAPI/Starlette TestClient deprecation warning remains unchanged; all public behavior passes with the locked dependency graph.

## Known Stubs

None. The prior `--jobs-only` placeholder is removed, and scans found no TODO, mock, `create_all`, or incomplete execution branch in the changed files.

## User Setup Required

None. The authenticated Sealos context supplied the real database and Job boundary, and all temporary state was removed.

## TDD Gate Compliance

- Health RED `349ed88` and GREEN `48f3ba7` are directly adjacent with exact test-only and production-only scopes.
- Job RED `a3ba877` and GREEN `e9edf1e` are directly adjacent with exact static-test-only and deployment/harness-only scopes.
- Both accepted RED failures followed successful real PostgreSQL preflight, and every GREEN ran against the same run ID as its RED.

## Next Phase Readiness

- Plan 22-04 can publish the accepted Stage 2 source after README, clean-clone, protected annotated tag, and retained evidence gates pass.
- Phase 23 can consume `deploy/migration-job.yaml` while adding the planned application-image hardening, replicas, rollout logs, and rollback evidence.
- Phase requirements stay pending until Phase 22 verification completes.

## Self-Check: PASSED

- All seven created or modified implementation files exist.
- All five Plan 22-03 implementation commits exist with the recorded parent relationships and exact scopes.
- Health, static manifest, full HTTP, strict server validation, two Job completions, revision, lock/export, redaction, and zero-footprint gates pass.

---
*Phase: 22-fastapi-postgresql-stage*
*Completed: 2026-07-15*
