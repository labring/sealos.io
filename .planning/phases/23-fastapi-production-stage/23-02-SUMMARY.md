---
phase: 23-fastapi-production-stage
plan: "02"
subsystem: production-workload-and-release
tags: [fastapi, kubernetes, rollout, rollback, ghcr, evidence]

requires:
  - phase: 23-fastapi-production-stage
    plan: "01"
    provides: Accepted baseline source and public immutable image digest
provides:
  - Parameterized hardened migration Job, two-replica Deployment, and Service contracts
  - Four-state production harness with semantic live and publication evidence verification
  - Frozen reader source on public main and a distinct public final image digest
  - Durable baseline and final source/image input contract for the live gate
affects: [23-03-live-rollback, 23-04-stage-publication, 27-practice-backed-tutorial-series]

tech-stack:
  added: [Kubernetes Deployment, Kubernetes Service, crane]
  patterns: [allowlisted manifest rendering, migration-first rollout, four-state recovery, checksum-independent publication preflight]

key-files:
  created:
    - /Users/longnv/bin/repo/sealos-fastapi-tutorial/deploy/application.yaml
    - /Users/longnv/bin/repo/sealos-fastapi-tutorial/scripts/test-production.sh
  modified:
    - /Users/longnv/bin/repo/sealos-fastapi-tutorial/deploy/migration-job.yaml
    - /Users/longnv/bin/repo/sealos-fastapi-tutorial/scripts/test-postgres.sh
    - /Users/longnv/bin/repo/sealos-fastapi-tutorial/README.md

key-decisions:
  - "Render the parameterized production Job through an exact token allowlist before inherited server validation."
  - "Freeze reader source before accepting its dynamic registry digest, then retain the mapping only in Sealos.io planning evidence."
  - "Keep Stage 3 absent until real rollback/recovery evidence and public replay complete in Plans 23-03 and 23-04."

patterns-established:
  - "Workload identity: one run label and exact prefix bind database, migration Jobs, Deployment, ReplicaSets, Pods, Service, Secret, ConfigMap, state, render, and process cleanup."
  - "Evidence acceptance: live requires eight data files plus eight checksums; publication preflight checks nine data files while ignoring only checksum state; publication verification requires nine checksums."

requirements-completed: []

duration: 83 min
completed: 2026-07-15
status: complete
---

# Phase 23 Plan 02: FastAPI Production Workload and Final Image Summary

**Public main now contains the complete hardened production workload, reader workflow, and a distinct immutable final image ready for the real rollback gate**

## Performance

- **Duration:** 83 min
- **Started:** 2026-07-15T14:11:34Z
- **Completed:** 2026-07-15T15:34:54Z
- **Tasks:** 3
- **Implementation files modified:** 8

## Accomplishments

- Added exact-token migration Job, two-replica Deployment, and Service contracts with UID/GID 10001, RuntimeDefault seccomp, no service-account token, read-only root, dropped capabilities, bounded resources, Memory-backed 64 MiB `/tmp`, and `/health` readiness.
- Added a fail-closed production harness for baseline migration/deploy, final migration/update, `kubectl rollout undo`, explicit final recovery, persistent public task checks, exact cleanup, anonymous image gates, and semantic evidence verification.
- Repaired the inherited PostgreSQL gate so its production Job check renders the new parameterized contract through an allowlist into a mode-0600 temporary manifest before strict server validation.
- Recovered and froze the reader source at `9e781775dd88f53f20c85ce2c763270925e123b8`, fast-forwarded public main, and accepted workflow run `29431446589` plus final image digest `sha256:177799c8ae9266019fbe954d2548aebc77b2a03868b49bdaa1fae10707ab115f`.

## Release Input Contract

baseline_source=1a5a66f3959f69ff66d85a9562acba738c82edb4
baseline_image=ghcr.io/yangchuansheng/sealos-fastapi-tutorial@sha256:b11293cf8ebb0e73fbabfd33ef6e812d53cb8176ea2db853769aae3dfa273337
final_source=9e781775dd88f53f20c85ce2c763270925e123b8
final_image=ghcr.io/yangchuansheng/sealos-fastapi-tutorial@sha256:177799c8ae9266019fbe954d2548aebc77b2a03868b49bdaa1fae10707ab115f

## Accepted Final Identity

| Contract | Accepted value |
|----------|----------------|
| Public repository | `yangchuansheng/sealos-fastapi-tutorial` |
| Public main / final source | `9e781775dd88f53f20c85ce2c763270925e123b8` |
| Final source tree | `f116171455d6b1ea373848a04289800e93d7d247` |
| Final source archive SHA-256 | `92c0b51c78c6257e0fbb84a4dbb012a85dd62d5c89c44516d7b8beaa2fa6ebef` |
| Successful workflow | `29431446589` |
| Workflow URL | `https://github.com/yangchuansheng/sealos-fastapi-tutorial/actions/runs/29431446589` |
| Workflow event / head / target | `push` / final source / final source |
| Workflow conclusion | `success` |
| Full-SHA image tag | `ghcr.io/yangchuansheng/sealos-fastapi-tutorial:sha-9e781775dd88f53f20c85ce2c763270925e123b8` |
| Final immutable image | `ghcr.io/yangchuansheng/sealos-fastapi-tutorial@sha256:177799c8ae9266019fbe954d2548aebc77b2a03868b49bdaa1fae10707ab115f` |
| Final GHCR package version | `1033569381` |
| Package visibility / repository | `public` / `sealos-fastapi-tutorial` |
| Baseline immutable image | `ghcr.io/yangchuansheng/sealos-fastapi-tutorial@sha256:b11293cf8ebb0e73fbabfd33ef6e812d53cb8176ea2db853769aae3dfa273337` |

The final and baseline tags each passed separate empty-mode-0700 anonymous
`crane digest`, `crane config`, and `crane manifest` gates with all registry
credential environment variables cleared. Their digests are distinct and both
OCI identities map to the recorded source SHA and public repository.

## TDD History Proof

| Boundary | RED | GREEN | Scope proof |
|----------|-----|-------|-------------|
| Disabled evidence append | `ac816fc8910a086b57e701e1aeeb1beb791688ec` | `031b5fee6bf4f4a8117c07ae405ab1b125961d72` | RED changes one harness test; GREEN changes only `scripts/test-postgres.sh`. |
| Disabled evidence finalizers | `f10603e6a4c99f4bf06b17007727d2cf58829209` | `f20fa0069bc61c5b059869980a0538daae21dde9` | RED extends the one harness test file; GREEN changes only two disabled guards. |
| Production workload contracts | `d2718109af799a0a5c0f2340b5d0fef304385b4e` | `881d039593a9ddd61e6dd3662eab84ee00fa9798` | Direct parent/child; RED changes exactly two tests; GREEN changes exactly two manifests and `test-production.sh`. |
| Inherited parameterized Job validation | `af1753f068d019546dfb7582e3f819a02b4518b4` | `683155b1800587b49f3754c4a803b21c1612ed50` | RED changes only `tests/test_postgres_harness.py`; GREEN changes only `scripts/test-postgres.sh`. |
| Runtime release identity logging | `6eaa808d099243e70a06fbbe4abde6044f01e5a8` | `9e781775dd88f53f20c85ce2c763270925e123b8` | RED changes only `tests/test_production.py`; GREEN changes exactly `app/main.py`, `deploy/application.yaml`, and `scripts/test-production.sh`. |

The workload RED exited at the exact absent application-manifest assertion.
The inherited Job-render RED exited at `render_production_job must exist`.
The workload GREEN remains the direct child of its RED and contains only the
three planned production artifacts.

## Task Commits

1. **Evidence helper guard recovery** - `ac816fc`, `031b5fe`, `f10603e`, `f20fa00` (`test` / `fix`)
2. **Task 1: Specify the complete production workload boundary** - `d271810` (`test`)
3. **Task 2: Add workloads and the complete production harness** - `881d039` (`feat`)
4. **Verified inherited-gate recovery** - `af1753f`, `683155b` (`test` / `fix`)
5. **Task 3: Freeze the immutable production reader source** - `e1a62c7` (`docs`)
6. **Runtime recovery: Emit baseline and final release identity logs** - `6eaa808`, `9e78177` (`test` / `fix`)

## Verification

- Focused workload, migration, and harness suite: `9 passed`.
- Exact no-environment PostgreSQL phase gate: `33 passed`, two source migration Jobs at revision `0001`, parameterized production Job strict validation, migrated health `200`, lock/export pass, and `CLEANUP_OK` for run `55ab76c1c416`.
- Strict server dry-run: parameterized Deployment, Service, and migration Job accepted by the authenticated Kubernetes API.
- Evidence semantics: live eight-checksum fixture passed; a changed checksum failed; publication preflight passed with stale and absent checksums; full publication nine-checksum fixture passed.
- Clean clone: `git clone --no-local` at final source passed lock/export, nine focused tests, shell syntax/help, clean-tree readback, and exact clone removal.
- Workflow run `29431446589`: API event `push`, exact head and normalized target, successful test and publish jobs, and matching final digest output.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Made disabled evidence helpers succeed under `set -e`**

- **Found during:** Accepted baseline phase-gate replay before workload RED
- **Issue:** Three no-evidence guards returned status 1 and stopped otherwise successful no-environment phase gates.
- **Fix:** Added two narrow TDD pairs and explicit successful disabled returns.
- **Impact:** The workload RED follows the accepted fail-closed baseline fixes rather than rewinding to an earlier image commit. The production RED/GREEN pair remains direct and exact in scope.

**2. [Rule 1 - Bug] Rendered the parameterized production Job in the inherited gate**

- **Found during:** Task 2 exact phase gate, run `f6ce9e66f44f`
- **Issue:** Thirty DB-backed tests passed, then the old harness sent raw `__JOB_NAME__`, `__RUN_ID__`, and `__SECRET_NAME__` tokens to server validation.
- **Fix:** Added an exact four-token renderer, immutable public validation image, owned names, mode-0600 temporary manifest, unresolved-token rejection, strict server validation, and trap cleanup.
- **Verification:** The independent RED/GREEN pair passed four focused tests; exact later runs `5b1e1cb3fa5c` and `9665120a3aa7` completed end to end.

**3. [Rule 1 - Bug] Made startup release identity visible in real Uvicorn logs**

- **Found during:** Plan 23-03 live baseline run `e64cce37d164`
- **Issue:** Both Ready baseline Pods had exact source/image environment values, while `app.main` remained at effective level `WARNING` with no handlers and emitted zero INFO startup identity records.
- **Fix:** Added a run-labeled root-INFO Uvicorn logging ConfigMap and explicit read-only log-config mount so the immutable baseline image emits its existing record; route the recovered final source release record through `uvicorn.error`; extend the frozen harness to validate the exact command, arguments, mounts, and volumes.
- **Verification:** Real Uvicorn subprocess RED/GREEN, ten focused tests, strict ConfigMap/Deployment/Service server dry-run, 33-case database gate `55ab76c1c416`, two-Pod old-baseline diagnostic `2e5e6b75902c` with exactly two events, successful workflow `29431446589`, and anonymous replacement image readback.
- **Recovery:** Public main advanced by normal fast-forward from the original README freeze through RED/GREEN. The original final image version `1033435304` remains immutable for exact Plan 23-04 cleanup.

## Protected Source State

- Stage 1 remains direct `77e57a281ecc087041b54273c1bfc63b66f13d1a`, peeled `276aa00e4d5bb7a0d5e375fee530cde3240b2ce8`, message `FastAPI deploy stage`.
- Stage 2 remains direct `b61254c237885744ae85cb6f81386f77f1e3ac09`, peeled `2b256b3dfc2a7d2a4b930c9970becca8c6da8cd3`, message `FastAPI PostgreSQL stage`.
- Active ruleset `18970425` still targets only `refs/tags/stage-*` with update and deletion protection, empty bypass, and empty exclude.
- Stage 3 remains absent for Plan 23-04 publication after the live Plan 23-03 gate.
- The package contains only full-SHA tags. Failed versions `1033073401`, `1033102122`, and superseded final version `1033435304` remain recorded for exact Plan 23-04 cleanup.

## Cleanup Proof

- Phase-gate and diagnostic runs `f6ce9e66f44f`, `5b1e1cb3fa5c`, `9665120a3aa7`, `c09525bff20f`, `e64cce37d164`, `ed05a513ef74`, `28987171ec52`, `55ab76c1c416`, and `2e5e6b75902c` have zero Deployments, ReplicaSets, Pods, Services, Jobs, Secrets, ConfigMaps, port-forwards, state files, render files, and owned processes.
- Both anonymous registry directories and the no-local clone directory were removed and independently checked absent.
- The Reference Application is clean at recovered public final source; no source writes are permitted after `9e781775dd88f53f20c85ce2c763270925e123b8` during the remaining Phase 23 plans.

## Next Phase Readiness

- Plan 23-03 can invoke `scripts/test-production.sh --run` directly with the four release block values above and an empty planning evidence directory.
- The harness is frozen and owns the complete baseline, final, rollback, recovery, evidence, and cleanup state machine.
- FAST-03 and FAST-04 remain pending until live evidence, protected Stage 3 publication, public clone replay, and independent phase verification complete.

## Self-Check: PASSED

- All recorded commits exist and public main equals the clean final source.
- Workflow, package, tag, digest, manifest, OCI revision, and OCI source identities agree.
- Baseline and final immutable references remain separately and anonymously readable.
- Stage 1, Stage 2, and the tag ruleset remain unchanged; Stage 3 remains absent.
- Exact-run Kubernetes, process, state, render, registry, and clone inventories are zero.

---
*Phase: 23-fastapi-production-stage*
*Completed: 2026-07-15*
