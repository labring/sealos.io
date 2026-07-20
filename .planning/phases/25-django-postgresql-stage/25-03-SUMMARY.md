---
phase: 25-django-postgresql-stage
plan: "03"
subsystem: database
tags: [django, postgresql, migrations, kubernetes-job, pytest, tdd]

requires:
  - phase: 25-django-postgresql-stage
    plan: "02"
    provides: Owned PostgreSQL sessions, strict runtime configuration, and schema-aware health
provides:
  - Immutable fresh and repeat Django migration gate with zero model drift
  - Strict production migration Job contract for a future immutable image
  - Ten-file source migration adapter that completes twice under one Job identity
  - Readiness-after-migration ordering with credential-free logs and exact cleanup
affects: [25-04, 25-05, django-production-stage, django-tutorials]

tech-stack:
  added: []
  patterns: [exclusive Django migration ownership, exact-token Job rendering, same-identity Job replay, nested trap isolation]

key-files:
  created:
    - /Users/longnv/bin/repo/sealos-django-tutorial/tests/test_migrations.py
    - /Users/longnv/bin/repo/sealos-django-tutorial/tests/test_migration_job.py
    - /Users/longnv/bin/repo/sealos-django-tutorial/tests/test_postgres_harness.py
    - /Users/longnv/bin/repo/sealos-django-tutorial/deploy/migration-job.yaml
    - /Users/longnv/bin/repo/sealos-django-tutorial/deploy/source-migration-job.yaml
  modified:
    - /Users/longnv/bin/repo/sealos-django-tutorial/scripts/test-postgres.sh

key-decisions:
  - "Generate a minimal migration-only settings and URLConf overlay in writable /tmp so the exact ten tracked inputs and exact Django migrate command remain intact."
  - "Recreate one exact run-owned source Job name after bounded deletion so idempotence is proven at the Kubernetes object boundary."
  - "Isolate render cleanup traps inside nested subshells so temporary-file cleanup cannot clear the outer exact-run cleanup trap."

patterns-established:
  - "Migration gate: verify the immutable source hash, prove the Task table absent, migrate twice, read applied state, check drift, and inspect exact columns."
  - "Job gate: strict production dry-run, ten-file ConfigMap, one same-name Job completed twice, runtime health 200, then exact-label cleanup."
  - "Evidence safety: keep credentials in Secret and process environments while outputs retain only run IDs, status, applied migration, and manifest hashes."

requirements-completed: []

coverage:
  - id: D1
    description: "The unchanged tasks.0001_initial migration exclusively creates the fresh PostgreSQL Task table, repeats at current head, and has zero drift."
    requirement: TDD-03
    verification:
      - kind: integration
        ref: "tests/test_migrations.py plus ./scripts/test-postgres.sh --migrations-only (run 61f98b2cfe34)"
        status: pass
    human_judgment: false
  - id: D2
    description: "The future production Job validates strictly and one allowlisted source Job identity completes twice before public readiness."
    requirement: DJAN-02
    verification:
      - kind: e2e
        ref: "./scripts/test-postgres.sh --jobs-only (run 190c1fb278ed)"
        status: pass
    human_judgment: false
  - id: D3
    description: "Rendering, Job logs, Kubernetes resources, temporary files, and local processes remain credential-free and clean to zero."
    requirement: TDD-03
    verification:
      - kind: other
        ref: "run 190c1fb278ed CLEANUP_OK plus independent exact-label, temporary-file, and process audit"
        status: pass
    human_judgment: false

duration: 37 min
completed: 2026-07-16
status: complete
---

# Phase 25 Plan 03: Repeatable Django Migration Jobs Summary

**The immutable Django migration now owns fresh and current-head PostgreSQL schema state, while one source Job identity completes twice before runtime health is accepted**

## Performance

- **Duration:** 37 min
- **Started:** 2026-07-15T23:55:33Z
- **Completed:** 2026-07-16T00:32:15Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments

- Added a migration integration gate that proves the physical Task table is absent at the tasks zero state, applies the unchanged migration twice, reads `[X] 0001_initial`, reports zero model drift, and verifies exact columns.
- Added an immutable-image production Job template with strict token rendering, Secret key `url`, bounded retry/deadline/resources, disabled service-account token, non-root execution, and a memory-backed `/tmp`.
- Added a source Job using exactly ten tracked inputs that completes, is deleted, is recreated under the same name, completes again, and precedes exact runtime health 200.
- Completed every accepted run with zero exact-label Kubernetes objects, zero owned port-forward processes, and zero retained render files.

## TDD Evidence

| Behavior | RED and observed failure | GREEN and accepted result | Order and scope |
|----------|--------------------------|---------------------------|-----------------|
| Repeatable Django migration | `ebc58a4` - real PostgreSQL migration API/hash cases passed, then the absent `--migrations-only` contract failed | `f7393c9` - focused suite passed 5/5 and external run `61f98b2cfe34` proved fresh/repeat/applied/drift/columns/hash | Direct child; RED changed only two tests; GREEN changed only the harness |
| Repeatable migration Job | `055e79f` - real PostgreSQL preflight passed, then the absent production manifest failed | `b8952a2` - static suite passed 11/11 and run `190c1fb278ed` completed one Job identity twice before health 200 | Direct child; RED changed only two tests; GREEN changed only two manifests and the harness |

The final test-only Job contract contains no cluster client, subprocess phase
gate, recursive harness call, or live execution. The shell harness exclusively
owns external lifecycle work.

## Migration Evidence

- The accepted source SHA-256 remains `745bc45f655bf0b164c1464c0c22786d22910e2aea235772e5dcea38495e4bf3`.
- Run `371fcba24d0e` passed the focused migration and harness suite 5/5 on a real pytest PostgreSQL database.
- Fresh external run `61f98b2cfe34` emitted `fresh=passed`, `repeat=passed`, `applied=0001_initial`, `drift=zero`, and exact columns `completed,id,title`.
- Both runs emitted `CLEANUP_OK` with zero inventory and stopped port-forward state.

## Job Evidence

- Run `190c1fb278ed` validated the rendered production Job server-side with `--validate=strict` and the exact future immutable image grammar.
- Job `tutorial-django-pg-test-190c1fb278ed-migration` reached `Complete=True` for sequence 1, was deleted with a bounded wait, was recreated under the same name, and reached `Complete=True` for sequence 2.
- Both sequences used rendered manifest SHA-256 `f58c4c15570ce1d0f3936bd3936f39db70823ec285e5119c634d3b660e4e8365` and reported `[X] 0001_initial` without credential-bearing output.
- Runtime `/health` returned exact HTTP 200 only after sequence 2, followed by `MIGRATION_JOBS_OK` and `CLEANUP_OK`.
- Independent readback found zero labeled Jobs, Deployments, Pods, Services, Secrets, and ConfigMaps, zero owned port-forward processes, and zero run-scoped render files.

## Task Commits

1. **Task 1 RED: Specify repeatable Django migration gate** - `ebc58a4` (`test`)
2. **Task 1 GREEN: Add repeatable Django migration gate** - `f7393c9` (`feat`)
3. **Task 2 RED: Specify repeatable migration Job** - `055e79f` (`test`)
4. **Task 2 GREEN: Add repeatable migration Job contracts** - `b8952a2` (`feat`)

## Files Created/Modified

- `tests/test_migrations.py` - Uses Django migration APIs and PostgreSQL introspection to prove zero-state absence, immutable migration replay, current head, and zero drift.
- `tests/test_postgres_harness.py` - Pins public modes, command grammar, rendering, source allowlist, repeated Job ordering, redaction, and cleanup contracts.
- `tests/test_migration_job.py` - Pins the complete production and source Job manifests as static text.
- `scripts/test-postgres.sh` - Owns migration modes, exact render validation, ConfigMap construction, two Job completions, readiness ordering, redaction, and cleanup.
- `deploy/migration-job.yaml` - Defines the future application-image migration contract.
- `deploy/source-migration-job.yaml` - Executes the reviewed migration inputs before an application image exists.

## Decisions Made

- Used a generated `/tmp/migration_settings.py` and `/tmp/migration_urls.py` overlay because Django's migration command runs URL system checks while the locked source adapter intentionally excludes the Web URL tree. The tracked settings remain the source of every other setting.
- Kept one exact Job object identity across both completion sequences. Sequence labels live only in stable evidence output.
- Nested temporary-render traps inside helper-local subshells so they preserve the one-shot harness cleanup trap.
- Kept `TDD-03` and `DJAN-02` pending until the complete Phase 25 verification gate.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Removed Django shell banner contamination from exact column readback**
- **Found during:** Task 1 GREEN external migration replay
- **Issue:** Django 5.2 printed its automatic import banner before the exact column list.
- **Fix:** Initialized Django directly in a bounded Python readback while retaining migrations as the exclusive schema owner.
- **Files modified:** `scripts/test-postgres.sh`
- **Verification:** Run `61f98b2cfe34` reported exact columns and completed cleanup.
- **Committed in:** `f7393c9`

**2. [Rule 3 - Blocking] Supplied a migration-only URLConf without expanding the tracked source allowlist**
- **Found during:** Task 2 GREEN live Job run `6e40cac1e987`
- **Issue:** The exact migrate command ran Django system checks and could not import the deliberately excluded `taskboard.urls` Web module.
- **Fix:** Generated a minimal settings and URLConf overlay in writable `/tmp`, preserving the ten tracked inputs, read-only `/app`, and exact migration command.
- **Files modified:** `deploy/source-migration-job.yaml`, `tests/test_migration_job.py`
- **Verification:** Final run `190c1fb278ed` completed both migrations and health acceptance.
- **Committed in:** `055e79f`, `b8952a2`

**3. [Rule 1 - Bug] Isolated helper cleanup traps from the outer run cleanup trap**
- **Found during:** Task 2 GREEN live Job run `8f1471d531f7`
- **Issue:** Two brace-form helper functions cleared the outer EXIT trap after cleaning their own render files.
- **Fix:** Retained the tested brace interfaces and ran each helper body in a nested subshell with local traps.
- **Files modified:** `scripts/test-postgres.sh`
- **Verification:** Final run `190c1fb278ed` emitted harness-owned `CLEANUP_OK`, followed by independent zero-residue readback.
- **Committed in:** `b8952a2`

---

**Total deviations:** 3 auto-fixed issues (2 Rule 1 bugs, 1 Rule 3 blocker).
**Impact on plan:** All fixes preserve the locked migration, source allowlist, command, TDD ancestry, and implementation scopes while making the real gates executable and clean.

## Issues Encountered

The Kubernetes API emitted its existing TokenRequest advisory during lifecycle
commands. Authentication, authorization, strict validation, both completion
waits, and every cleanup operation succeeded.

## User Setup Required

None - the authenticated Sealos context supplied the planned namespace and all
temporary state was removed.

## Known Stubs

None. The manifest placeholders are validated template inputs with exact token
allowlists and fail-closed render checks.

## TDD Gate Compliance

- Migration RED `ebc58a4` and GREEN `f7393c9` are directly adjacent with exact two-test and one-harness scopes.
- Job RED `055e79f` and GREEN `b8952a2` are directly adjacent with exact two-test and three-file implementation scopes.
- Both RED failures followed successful real PostgreSQL preflight; every database-dependent test used the harness wrapper.

## Next Phase Readiness

- Plan 25-04 can use the accepted migration and readiness order to prove one public task survives an independently restarted Django process.
- Plan 25-05 can compose the migration, Job, restart, shared-framework, public-tag, evidence, and cleanup gates without changing migration ownership.
- Phase requirements remain pending until the complete Phase 25 verification gate.

## Self-Check: PASSED

- All six implementation and test files exist, and all four exact task commits resolve with direct RED/GREEN ancestry and exact scopes.
- The migration hash, static 11/11 suite, strict production validation, both same-name Job completions, runtime health 200, and independent cleanup audits pass.
- Runs `a290a659c1ba`, `61f98b2cfe34`, `ab6cf3beacdb`, `6e40cac1e987`, `8f1471d531f7`, and `190c1fb278ed` have zero remaining exact-label inventory and zero owned processes.

---
*Phase: 25-django-postgresql-stage*
*Completed: 2026-07-16*
