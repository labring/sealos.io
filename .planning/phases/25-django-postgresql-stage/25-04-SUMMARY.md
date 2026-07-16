---
phase: 25-django-postgresql-stage
plan: "04"
subsystem: database
tags: [django, postgresql, restart, csrf, admin, agent-browser, evidence, tdd]

requires:
  - phase: 25-django-postgresql-stage
    plan: "03"
    provides: Repeatable Django migrations, two source Job completions, and schema-aware readiness
provides:
  - Public CSRF write through process A and retained rendered read through process B
  - Authenticated Django administration readback of the retained Task title
  - Complete ordered local phase gate with credential-free evidence
  - Read-only cross-framework cleanup audit over cluster and local ownership
  - Stage 2 PostgreSQL reader workflow at exact final source SHA
affects: [25-05, django-production-stage, django-tutorials]

tech-stack:
  added: []
  patterns: [owned Django process lifecycle, public PRG persistence, named browser authentication, read-only ownership audit, curated evidence]

key-files:
  created:
    - .planning/phases/25-django-postgresql-stage/evidence/README.md
    - .planning/phases/25-django-postgresql-stage/evidence/package-identity.txt
    - .planning/phases/25-django-postgresql-stage/evidence/django-migrations.txt
    - .planning/phases/25-django-postgresql-stage/evidence/django-jobs.txt
    - .planning/phases/25-django-postgresql-stage/evidence/django-http.jsonl
    - .planning/phases/25-django-postgresql-stage/evidence/cleanup.txt
  modified:
    - /Users/longnv/bin/repo/sealos-django-tutorial/tests/test_postgres_harness.py
    - /Users/longnv/bin/repo/sealos-django-tutorial/scripts/test-postgres.sh
    - /Users/longnv/bin/repo/sealos-django-tutorial/README.md

key-decisions:
  - "Use an ephemeral sitecustomize overlay only for the unreachable runserver probe so Django reaches the public health view while production and tracked settings remain unchanged."
  - "Prove administrator authentication at the native changelist, then read the retained title from the linked Task change form because the uncustomized ModelAdmin renders Task object identity in its index."
  - "Keep assert-clean-all read-only and move every stop, close, deletion, and path removal operation into the exact-run cleanup path."
  - "Keep Phase 25 requirements pending until public replay and independent phase verification complete."

patterns-established:
  - "Restart gate: public CSRF POST and later board GET on A, verified stop/reap, then a new B process reads the same title from PostgreSQL."
  - "Admin gate: ephemeral superuser, named browser login, authenticated changelist, exact change-form title, and closed session."
  - "Evidence gate: five mode-0600 data files contain only stable states, hashes, resource names, routes, run IDs, and the run-derived title."
  - "Cleanup audit: query both framework label prefixes, process inventory, browser sessions, ledgers, state paths, and replay paths without mutation."

requirements-completed: []

coverage:
  - id: D1
    description: "Process A creates and renders one Task through public CSRF POST/redirect/GET, is reaped, and process B renders the retained title from the same PostgreSQL database."
    requirement: DJAN-02
    verification:
      - kind: e2e
        ref: "./scripts/test-postgres.sh --phase-gate (run ff27dc5635bf and evidence run d98895ed9879)"
        status: pass
    human_judgment: false
  - id: D2
    description: "The complete real-PostgreSQL suite covers public health, rendered create/list, and authenticated administration."
    requirement: TDD-02
    verification:
      - kind: integration
        ref: "43/43 full suite plus 22/22 focused public/readiness suite"
        status: pass
    human_judgment: false
  - id: D3
    description: "Two source Job completions precede migrated readiness, restart persistence, and administration readback."
    requirement: TDD-03
    verification:
      - kind: e2e
        ref: "evidence run d98895ed9879 ordered sequences 1 through 11"
        status: pass
    human_judgment: false
  - id: D4
    description: "Credential-free evidence and read-only cleanup audit prove zero cluster, process, browser, state, and temporary-path residue."
    requirement: TDD-03
    verification:
      - kind: other
        ref: "five evidence data files, source scan, CLEANUP_OK, and ASSERT_CLEAN_ALL_OK"
        status: pass
    human_judgment: false

duration: 121 min
completed: 2026-07-16
status: complete
---

# Phase 25 Plan 04: Django Restart Persistence Summary

**One public Task now survives an independently owned Django restart, appears through authenticated administration, and closes with credential-free evidence plus a read-only zero-residue audit**

## Performance

- **Duration:** 121 min
- **Started:** 2026-07-16T00:48:31Z
- **Completed:** 2026-07-16T02:48:58Z
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments

- Added three bounded public 503 probes for missing configuration, unreachable PostgreSQL, and fresh schema, followed by migrated HTTP 200.
- Proved public CSRF POST/redirect/GET through process A, verified A stop and port release, then started process B and rendered the retained title.
- Created an ephemeral superuser, authenticated one named browser session, opened the Task changelist, and read the exact title from the native Task change form.
- Ordered lock/export, readiness, strict production validation, two source Jobs, migration readback, full pytest, restart, admin, evidence finalization, and exact cleanup in one phase gate.
- Added a read-only `--assert-clean-all` mode that checks both framework label prefixes and every Phase 25 owned local category while containing zero mutation operations.
- Replaced the primary README path with the immutable Stage 2 PostgreSQL reader workflow and retained Stage 1 and Stage 3 boundaries.

## TDD Evidence

| Behavior | RED and observed failure | GREEN and accepted result | Order and scope |
|----------|--------------------------|---------------------------|-----------------|
| Public restart persistence and cleanup audit | `d1960cc` - real PostgreSQL preflight passed, 9 prior tests passed, then the absent `--phase-gate` contract failed | `38df4c7` - 17/17 focused harness tests, 43/43 full tests, A/B persistence, admin readback, and cleanup passed | Direct parent/child; RED changed only `tests/test_postgres_harness.py`; GREEN changed only `scripts/test-postgres.sh` |

The retained tests assert public and executable seams: bounded HTTP states,
CSRF form behavior, independently ordered process ownership, named browser
authentication, curated evidence, and a mutation-free cleanup audit.

## Runtime Evidence

- Final GREEN full run `ff27dc5635bf` passed all 43 tests, both source Jobs, A/B restart persistence, authenticated admin title readback, `PHASE_GATE_OK`, and `CLEANUP_OK`.
- Final focused run `b3503a16b06a` passed all 17 harness tests through a real PostgreSQL preflight and returned to zero state.
- Focused final-source public/readiness run `0c6f8b3b706e` passed 22/22 tests and exact cleanup.
- Evidence run `d98895ed9879` passed the same complete gate and wrote the retained package.
- The immutable migration SHA-256 remains `745bc45f655bf0b164c1464c0c22786d22910e2aea235772e5dcea38495e4bf3`.
- Source Job sequences 1 and 2 reused `tutorial-django-pg-test-d98895ed9879-migration`, reached `Complete=True`, and used manifest SHA-256 `918a29940c6a555868a03993b95076dbdb475749e763417a0e2e1a879411a2dd`.
- HTTP evidence contains 11 ordered observations from unavailable readiness through authenticated change-form title readback.
- Final source is `16279958ca774f7a34c25b0102a483df53160d6f`, with exactly 24 commit subjects and 32 tracked files.

## Evidence Package

- `package-identity.txt` records psycopg and psycopg-binary 3.3.4, official source identity, Python 3.12, and lock SHA-256 `a02b8d643f521728b080ba4a7b290fabaf26821733713ca1b424dcffcb95910b`.
- `django-migrations.txt` records fresh/repeat Job state, direct migrate state, zero drift, exact columns, and immutable source hash.
- `django-jobs.txt` records production validation and both exact source Job completions.
- `django-http.jsonl` records stable process, method, route, status, result, and retained-title observations.
- `cleanup.txt` records zero inventory, stopped port-forward and servers, closed browser state, absent paths, and free ports.
- The data-file scan found no database URLs, credential assignments, password/token/cookie/CSRF values, Secret data, unresolved template tokens, tracebacks, or exception text.
- Checksums remain deferred to Plan 25-05, after public identity and FastAPI replay evidence are added.

## Task Commits

1. **Task 1 RED: Specify public restart persistence** - `d1960cc` (`test`)
2. **Task 1 GREEN: Prove PostgreSQL restart persistence** - `38df4c7` (`feat`)
3. **Task 2: Document PostgreSQL reader workflow** - `1627995` (`docs`)

## Files Created/Modified

- `tests/test_postgres_harness.py` - Pins restart, readiness, browser, evidence, and read-only cleanup contracts.
- `scripts/test-postgres.sh` - Owns the complete phase gate, server lifecycle, public form, admin browser, evidence, and cleanup.
- `README.md` - Documents the Stage 2 immutable reader path and migration-before-readiness workflow.
- `evidence/README.md` - Defines provenance, schemas, redaction boundary, replay order, and ownership ledger.
- Five evidence data files - Retain the exact accepted local source outcomes.

## Decisions Made

- Used a temporary `sitecustomize.py` only for the unreachable probe because Django `runserver` performs a database-backed migration check before opening its listener. The overlay suppresses that CLI advisory so the real public health view handles the unavailable database; all other servers use native tracked source.
- Verified the native admin changelist first, then opened `/admin/tasks/task/1/change/` to read `#id_title`. The uncustomized Stage 1 `ModelAdmin` intentionally keeps its default `Task object (1)` changelist label.
- Used sequential agent-browser commands with exact URL polling because event-only URL waits can start after navigation has already completed.
- Kept credentials in process environments and mode-0600 temporary files; retained evidence stores only stable outcomes.
- Deferred requirement completion until Plan 25-05 publishes and replays the immutable source and independent FastAPI gate.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Allowed the unreachable probe to reach public health**
- **Found during:** Task 1 GREEN full phase gate
- **Issue:** Django `runserver` attempted migration-state readback before binding and exited on unreachable PostgreSQL.
- **Fix:** Generated an ephemeral `sitecustomize` overlay that suppresses only the runserver migration advisory for this probe.
- **Files modified:** `scripts/test-postgres.sh`
- **Verification:** Final runs returned exact unreachable HTTP 503 and removed the overlay with the run temporary root.
- **Committed in:** `38df4c7`

**2. [Rule 1 - Bug] Distinguished closed listeners from TCP TIME_WAIT**
- **Found during:** Task 1 GREEN cleanup
- **Issue:** A recently closed browser-backed connection could keep a port in TIME_WAIT and make a raw bind check report false residue.
- **Fix:** Applied `SO_REUSEADDR` to the port-release assertion and retained verified PID stop/reap checks.
- **Files modified:** `scripts/test-postgres.sh`
- **Verification:** Process B closes with `port=free`, followed by read-only zero-state audit.
- **Committed in:** `38df4c7`

**3. [Rule 1 - Bug] Made browser acceptance converge on stable page state**
- **Found during:** Task 1 GREEN authenticated admin acceptance
- **Issue:** A URL event wait could begin after navigation, and the native changelist does not expose the Task title as its default row label.
- **Fix:** Polled exact current URLs, verified the authenticated changelist, then read the rendered title value from the linked Task change form.
- **Files modified:** `scripts/test-postgres.sh`
- **Verification:** Final and evidence runs emitted `ADMIN_READBACK_OK` with the exact retained title.
- **Committed in:** `38df4c7`

---

**Total deviations:** 3 auto-fixed issues (2 Rule 1 bugs, 1 Rule 3 blocker).
**Impact on plan:** The fixes preserve public behavior, exact RED/GREEN scopes, tracked application source, native Django security, and complete cleanup.

## Issues Encountered

The Kubernetes API emitted its existing TokenRequest advisory during lifecycle
commands. Authentication, authorization, validation, Jobs, public behavior,
browser acceptance, and cleanup all succeeded.

## User Setup Required

None - the authenticated Sealos context and installed agent-browser satisfied
the planned local acceptance prerequisites, and every temporary resource was
removed.

## Known Stubs

- `scripts/test-postgres.sh` retains the syntactically immutable all-ones
  `PRODUCTION_VALIDATION_IMAGE` only for strict server-side validation of the
  future application-image Job. Phase 26 supplies and executes the real image
  digest; Phase 25 executes the reviewed source Job.

## TDD Gate Compliance

- RED `d1960cc` and GREEN `38df4c7` are directly adjacent.
- RED changes only `tests/test_postgres_harness.py`.
- GREEN changes only `scripts/test-postgres.sh`.
- RED failed after a successful real PostgreSQL preflight at the first absent
  restart/audit contract.
- Final focused and full gates both pass through the real PostgreSQL harness.

## Next Phase Readiness

- Plan 25-05 can replay the unchanged immutable FastAPI Stage 2 gate, publish
  Django Stage 2 from exact SHA `16279958ca774f7a34c25b0102a483df53160d6f`,
  clone it publicly, and finalize source/checksum evidence.
- The local evidence schema and five data files are complete and credential-free.
- `--assert-clean-all` reports zero Django inventory, zero FastAPI inventory,
  zero owned processes, zero owned browser sessions, and zero owned paths.

## Self-Check: PASSED

- All nine implementation/evidence files exist, and all three exact task commits resolve.
- RED/GREEN ancestry and file scopes are exact.
- Final source has 24 commit subjects, 32 tracked files, a clean lock/export, the immutable migration hash, and zero Git changes.
- Runs `ff27dc5635bf`, `b3503a16b06a`, `0c6f8b3b706e`, and `d98895ed9879` have zero remaining exact-label inventory, owned process, browser session, state file, replay path, or temporary path.

---
*Phase: 25-django-postgresql-stage*
*Completed: 2026-07-16*
