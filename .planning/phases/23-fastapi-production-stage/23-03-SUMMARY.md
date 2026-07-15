---
phase: 23-fastapi-production-stage
plan: "03"
subsystem: production-rollout-evidence
tags: [fastapi, kubernetes, postgresql, rollback, ghcr, evidence]

requires:
  - phase: 23-fastapi-production-stage
    plan: "02"
    provides: Frozen baseline and final public source/image release identities
provides:
  - Real four-state baseline, final, rollback, and explicit recovery proof
  - Runtime identity, process, filesystem, security, log, and HTTP evidence for two replicas
  - Checksum-valid credential-free evidence with exact zero-footprint cleanup
affects: [23-04-stage-publication, 27-practice-backed-tutorial-series]

tech-stack:
  added: []
  patterns: [migration-before-rollout, per-state service forwarding, immutable rollback, curated evidence audit]

key-files:
  created:
    - .planning/phases/23-fastapi-production-stage/evidence/workflow.txt
    - .planning/phases/23-fastapi-production-stage/evidence/images.txt
    - .planning/phases/23-fastapi-production-stage/evidence/migration.txt
    - .planning/phases/23-fastapi-production-stage/evidence/runtime.txt
    - .planning/phases/23-fastapi-production-stage/evidence/logs.txt
    - .planning/phases/23-fastapi-production-stage/evidence/http.jsonl
    - .planning/phases/23-fastapi-production-stage/evidence/rollback.txt
    - .planning/phases/23-fastapi-production-stage/evidence/cleanup.txt
    - .planning/phases/23-fastapi-production-stage/evidence/checksums.txt
  modified:
    - .planning/ROADMAP.md
    - .planning/STATE.md

key-decisions:
  - "Create a fresh bounded Service port-forward after each completed rollout before HTTP acceptance."
  - "Use the same persistent public task as the continuity witness across all four controller states."
  - "Freeze the nine reviewed evidence files read-only after semantic, credential, checksum, source, and cleanup audits pass."

patterns-established:
  - "Runtime state acceptance correlates source SHA, immutable image digest, Pod imageID, release log, controller revision, and public HTTP behavior."
  - "Live closeout requires exact-label seven-kind zero inventory plus stopped owned processes and absent state, render, clone, and temporary paths."

requirements-completed: []

duration: 101 min
completed: 2026-07-15
status: complete
---

# Phase 23 Plan 03: FastAPI Rollback and Recovery Summary

**One real Sealos run proves migration-first baseline deployment, final update, immutable rollback, explicit recovery, task continuity, and complete cleanup**

## Performance

- **Duration:** 101 min
- **Started:** 2026-07-15T15:34:55Z
- **Completed:** 2026-07-15T17:16:19Z
- **Tasks:** 2
- **Files modified:** 12

## Accomplishments

- Executed the exact baseline migration/deploy -> final migration/update -> `kubectl rollout undo` -> explicit final recovery sequence in context `dn9ue3wz@sealos`, namespace `ns-let51wad`, run `0fd32115da68`.
- Proved two Ready replicas at every state with exact source/image identity, one Uvicorn process per Pod, UID/GID 10001, port 8000, read-only root, bounded writable `/tmp`, dropped capabilities, disabled privilege escalation, and RuntimeDefault seccomp.
- Preserved task `1` and its updated payload through all four states, then removed the disposable task and retained nine credential-free, checksum-valid evidence files after exact cleanup.

## Accepted Release Identities

| Role | Source | Immutable image | Workflow |
|------|--------|-----------------|----------|
| Baseline | `1a5a66f3959f69ff66d85a9562acba738c82edb4` | `ghcr.io/yangchuansheng/sealos-fastapi-tutorial@sha256:b11293cf8ebb0e73fbabfd33ef6e812d53cb8176ea2db853769aae3dfa273337` | `29421655544` |
| Final | `1dbbf19185207aed44a29ad6a3509d94a3670c43` | `ghcr.io/yangchuansheng/sealos-fastapi-tutorial@sha256:c5f6d6df59d05ab9e079aab5dc9a9b0666218ae38f104630587343eaba25b5de` | `29434731777` |

Both public full-SHA tags passed independent empty-mode-0700 anonymous `crane`
digest, config, manifest, linux/amd64, OCI revision, and OCI source gates before
cluster mutation. Public main, remote main, and the clean local Reference
Application all equal the accepted final source.

## Migration Proof

| Sequence | Role | Job | Condition | Revision | Deployment digest |
|----------|------|-----|-----------|----------|-------------------|
| 1 | Baseline | `tutorial-fastapi-pg-test-0fd32115da68-migration-baseline` | `Complete=True` | `0001` | Baseline digest |
| 2 | Final | `tutorial-fastapi-pg-test-0fd32115da68-migration-final` | `Complete=True` | `0001` | Final digest |

Each migration Job completed before its corresponding application rollout and
used the same immutable digest later accepted on both application Pods.

## Four-State Runtime Proof

| Sequence | State | Transition | Deployment / ReplicaSet revision | Ready | Pod image IDs | Task result |
|----------|-------|------------|----------------------------------|-------|---------------|-------------|
| 1 | `baseline` | Baseline deploy | `1 / 1` | `2/2` | Baseline digest twice | Created task `1` |
| 2 | `final` | Final apply | `2 / 2` | `2/2` | Final digest twice | Updated task `1` |
| 3 | `baseline-rollback` | `kubectl rollout undo` | `3 / 3` | `2/2` | Baseline digest twice | Read updated task `1` |
| 4 | `final-recovered` | Explicit final apply | `4 / 4` | `2/2` | Final digest twice | Read updated task `1` |

Every state returned health `200`, docs `200`, exactly two matching
`service_start` records, and the expected persistent payload. The final state
also returned disposable delete `204` and subsequent read `404`.

## Runtime and Security Proof

- Both Pods at every state ran as UID/GID `10001` with one PID 1 Uvicorn command bound to `0.0.0.0:8000` and one worker.
- Root-filesystem writes were rejected; write/remove under the Memory-backed bounded `/tmp` mount passed.
- The accepted security context had read-only root, no service-account token, `RuntimeDefault` seccomp, `allowPrivilegeEscalation=false`, and all capabilities dropped.
- Deployment digest, both Pod image IDs, source environment, and both startup records agreed in each state.

## Evidence Manifest

| File | Proof |
|------|-------|
| `workflow.txt` | Exact baseline/final workflow head, target, conclusion, URL, and digest |
| `images.txt` | Anonymous public tag, digest, platform, package, and OCI identity |
| `migration.txt` | Two completed immutable migration Jobs at Alembic `0001` |
| `runtime.txt` | Ordered two-replica identity, process, filesystem, and security state |
| `logs.txt` | Two matching release startup records at every state |
| `http.jsonl` | Health, docs, task continuity, update, delete, and 404 behavior |
| `rollback.txt` | Controller revisions, rollout undo, and explicit final recovery |
| `cleanup.txt` | Exact-run Kubernetes and local zero inventories |
| `checksums.txt` | Eight repository-relative SHA-256 entries |

`checksums.txt` SHA-256 is
`08999393e17b7aec171a7d55d9331a0c3c95933c0dc80cb260d1d2adc5598470`.
The nine reviewed evidence files are read-only after acceptance.

## Verification

- `scripts/test-production.sh --verify-evidence live`: `LIVE_EVIDENCE_OK`, nine files, semantic parsing passed, and checksums passed.
- `sha256sum -c`: all eight reviewed data files passed and the manifest contains exactly eight entries.
- Independent credential scan: nine rules passed across all nine files, covering database credentials, Secret data, GitHub/bearer/service-account tokens, registry credentials, and kubeconfig data.
- Independent cleanup readback: seven Kubernetes kinds for selector `tutorial.sealos.io/run-id=0fd32115da68` returned zero; owned processes and exact temporary paths returned zero.
- Source freeze: local HEAD, remote main, and GitHub API main all equal `1dbbf19185207aed44a29ad6a3509d94a3670c43`; the Reference Application tree is clean.

## Task Commit

Tasks 1 and 2 are recorded atomically by the plan closeout commit
`docs(23-03): record FastAPI rollback and recovery`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Emitted release identity through effective Uvicorn logging**

- **Found during:** Baseline run `e64cce37d164`
- **Issue:** Both Ready Pods carried exact release environment values while the application logger filtered its INFO startup event.
- **Fix:** Added the root-INFO log configuration, explicit Uvicorn log-config mount, and final-source `uvicorn.error` release logger through TDD commits `6eaa808` and `9e78177`.
- **Verification:** Real Uvicorn subprocess, static suite, database gate `55ab76c1c416`, two-Pod baseline diagnostic `2e5e6b75902c`, and public image readback passed.

**2. [Rule 1 - Bug] Accepted the Kubernetes ConfigMap volume default**

- **Found during:** Replacement run `f32736d38f34`
- **Issue:** Server validation represented the committed ConfigMap volume with API-defaulted numeric mode `420`.
- **Fix:** Extended the exact live readback through TDD commits `627ca96` and `dfdd7ea`.
- **Verification:** Static suite, strict server dry-run, workflow `29432521938`, and anonymous image readback passed.

**3. [Rule 1 - Bug] Refreshed Service forwarding after every rollout**

- **Found during:** Replacement run `e503aad1957e`
- **Issue:** The original Service port-forward selected a baseline Pod and exited when the final rollout deleted that Pod.
- **Fix:** Each release-state verification now reaps its prior forwarding process and creates a fresh bounded Service port-forward through TDD commits `73db032` and `1dbbf19`.
- **Verification:** Six focused tests, complete static suite, database gate `794abcfd1fb4`, workflow `29434731777`, clean-clone replay, and the successful four-state run passed.

**Total deviations:** 3 auto-fixed correctness issues.
**Impact on plan:** Each fix directly enabled the required real-runtime identity or state transition proof and stayed within the frozen production harness boundary.

## Cleanup Proof

- Successful run `0fd32115da68` ended with `SESSION_STOPPED`, `ASSERT_CLEAN_OK`, `LIVE_EVIDENCE_OK`, and `PRODUCTION_CLEANUP_OK`.
- Deployments, ReplicaSets, Pods, Services, Jobs, Secrets, ConfigMaps, port-forwards, state files, rendered files, clone directories, and owned processes all reached zero.
- Earlier diagnostic and replacement runs were also removed to exact zero before the accepted run began.

## Next Phase Readiness

- Plan 23-04 can publish protected Stage 3 from final source `1dbbf19`, replay source plus image identities publicly, and retain the accepted baseline/final versions.
- Exact package cleanup remains recorded for failed versions `1033073401`, `1033102122` and superseded versions `1033435304`, `1033569381`, `1033619284`.
- FAST-03 and FAST-04 remain pending through Stage 3 publication and full Phase 23 verification.

## Self-Check: PASSED

- The mandatory four-state order, migration ordering, controller revisions, runtime contract, startup records, and task continuity are internally coherent.
- Semantic verification, credential scan, all eight checksums, source freeze, and independent zero-footprint readback pass.
- The retained final state maps source `1dbbf19` to digest `c5f6d6df`, and all live resources are absent after evidence capture.

---
*Phase: 23-fastapi-production-stage*
*Completed: 2026-07-15*
