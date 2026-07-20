---
phase: 26-django-production-stage
plan: "03"
subsystem: django-production-live-rollback
tags: [django, sealos, kubernetes, rollback, gunicorn, whitenoise, evidence]

requires:
  - phase: 26-django-production-stage
    provides: Frozen Image A and Image B sources, digests, workloads, and production runner
provides:
  - Four-state Django production rollout, rollback, and explicit recovery on one PostgreSQL database
  - Two-Pod Gunicorn, WhiteNoise, security, health, board, and native-admin acceptance at every state
  - Nine credential-free live evidence files with nine sorted SHA-256 checksums
affects: [26-04-stage-publication, 27-practice-backed-tutorial-series]

tech-stack:
  added: []
  patterns: [migration-first rollout, controller-native rollback, persistent Task witness, semantic evidence sealing]

key-files:
  created:
    - .planning/phases/26-django-production-stage/evidence/workflow.txt
    - .planning/phases/26-django-production-stage/evidence/images.txt
    - .planning/phases/26-django-production-stage/evidence/collectstatic.txt
    - .planning/phases/26-django-production-stage/evidence/migrations.txt
    - .planning/phases/26-django-production-stage/evidence/runtime.txt
    - .planning/phases/26-django-production-stage/evidence/logs.txt
    - .planning/phases/26-django-production-stage/evidence/http.jsonl
    - .planning/phases/26-django-production-stage/evidence/rollback.txt
    - .planning/phases/26-django-production-stage/evidence/cleanup.txt
    - .planning/phases/26-django-production-stage/evidence/checksums.txt
  modified: []

key-decisions:
  - "Accept run 0f27d3ed8f1f as the live production witness after all four ordered states and exact cleanup passed."
  - "Use a removed external browser timing adapter to wait for network-idle and the native admin title field while preserving the frozen runner, selector, credentials, and assertions."
  - "Keep the checksum-valid live evidence writable only for the exact Plan 26-04 publication append and reseal operation."

requirements-completed: []

coverage:
  - id: D1
    description: "Image A and Image B migration Jobs completed before their two-replica rollouts on one owned PostgreSQL database."
    requirement: DJAN-03
    verification:
      - kind: e2e
        ref: "live run 0f27d3ed8f1f and evidence/migrations.txt"
        status: pass
    human_judgment: false
  - id: D2
    description: "Baseline, final, rollout undo, and explicit final recovery each passed image, process, security, log, health, board, static, and admin checks."
    requirement: DJAN-03
    verification:
      - kind: e2e
        ref: "evidence/runtime.txt, logs.txt, collectstatic.txt, and http.jsonl"
        status: pass
    human_judgment: false
  - id: D3
    description: "One Task survived all four controller states through the public board and authenticated native Django administration."
    requirement: DJAN-03
    verification:
      - kind: e2e
        ref: "evidence/http.jsonl and rollback.txt"
        status: pass
    human_judgment: false
  - id: D4
    description: "Nine curated files passed semantic, credential, checksum, source-freeze, protected-tag, and zero-residue audits."
    requirement: DJAN-03
    verification:
      - kind: integration
        ref: "scripts/test-production.sh --verify-evidence live and --assert-clean-all"
        status: pass
    human_judgment: false

duration: 21 min
completed: 2026-07-16
status: complete
---

# Phase 26 Plan 03: Django Production Live Rollback Summary

**Run `0f27d3ed8f1f` proved migration-first Image A and Image B releases, controller-native rollback, explicit recovery, and one persistent Django Task across four hardened two-Pod states.**

## Performance

- **Duration:** 21 min
- **Started:** 2026-07-16T13:34:21Z
- **Completed:** 2026-07-16T13:55:49Z
- **Tasks:** 3
- **Durable files:** 10 evidence files plus this summary
- **Target repository commits:** 0

## Release Inputs

| Role | Source | Immutable image |
|---|---|---|
| Image A | `c99384891f45c8df8bfaf7803c8e1d752ffd08c5` | `ghcr.io/yangchuansheng/sealos-django-tutorial@sha256:df3772c3abedfb05c52d696f17ff8295d73f34b8b017f8b6ba2738fceb4247a8` |
| Image B | `8e372f93e1a7bb72880be5198430a065d38d65f5` | `ghcr.io/yangchuansheng/sealos-django-tutorial@sha256:aad216002fae3fd2adce92f09e47e936614b16964a6972c226c4058a16568c7b` |

Workflows `29477970332` and `29501299847` remain successful with exact push heads, normalized targets, and public digests. The linked GHCR package remains public. Separate empty mode-0700 anonymous configurations resolved both linux/amd64 full-SHA tags, OCI source/revision labels, non-root command, collected manifest, and hashed Task CSS.

## Live Run

| Contract | Accepted value |
|---|---|
| Sealos context / namespace | `dn9ue3wz@sealos` / `ns-let51wad` |
| Run ID / selector | `0f27d3ed8f1f` / `tutorial.sealos.io/run-id=0f27d3ed8f1f` |
| PostgreSQL | One owned PostgreSQL 17 database for all four states |
| Baseline Job | `tutorial-django-pg-test-0f27d3ed8f1f-migration-baseline`, Complete=True, succeeded=1, failed=0 |
| Final Job | `tutorial-django-pg-test-0f27d3ed8f1f-migration-final`, Complete=True, succeeded=1, failed=0 |
| Migration | `[X] 0001_initial` before each corresponding rollout |
| Task witness | ID `1`, title `Production continuity 0f27d3ed8f1f` |

## Four-State Proof

| Sequence | State | Transition | Revision | Image | Ready | Task/admin |
|---:|---|---|---:|---|---:|---|
| 1 | `baseline` | Image A apply | 1 | Image A | 2/2 | passed |
| 2 | `final` | Image B apply | 2 | Image B | 2/2 | passed |
| 3 | `baseline-rollback` | `kubectl rollout undo` | 3 | Image A | 2/2 | passed |
| 4 | `final-recovered` | explicit Image B apply | 4 | Image B | 2/2 | passed |

Every state had one active ReplicaSet at the Deployment revision, two Ready Pods with the exact expected image IDs and source tuple, and monotonically increasing controller revisions. The same Task ID and title appeared through the public board and authenticated native Django change form in all four states.

## Runtime Acceptance

Each of the eight accepted application Pods passed:

- UID/GID `10001:10001`, read-only root, writable removable memory-backed `/tmp`, `RuntimeDefault` seccomp, service-account token disabled, privilege escalation disabled, and all capabilities dropped.
- One Gunicorn master plus one sync worker, one matching startup identity record, and one listener on `0.0.0.0:8000`.
- `/health` HTTP 200 with `{"status":"ok"}`, Task Board HTTP 200, admin login HTTP 200, and authenticated Task readback.
- `/static/tasks/styles.852e61e8064c.css` HTTP 200 with `text/css`, immutable cache policy, and retained content.

## Evidence Manifest

| File | SHA-256 |
|---|---|
| `cleanup.txt` | `11de3fa3d040ac379bf24844d1b414518dd1e82ff39cf01db46667f54a9784cb` |
| `collectstatic.txt` | `2f9a8985ee73279b5b8c2e8188e1c5558dcffa7f501710faa667baab57aacd61` |
| `http.jsonl` | `79962d4f1a319eec73c07d043ca93914d6838536f222cfacc3ab7d04e8bcc0c4` |
| `images.txt` | `d9fdd69f28b094485f67660ee9f099ffb9066dce16d7456871508eca0185e725` |
| `logs.txt` | `150640191e48dc5f74f480e694af43f608c9eba2a8b8352888569420a3333348` |
| `migrations.txt` | `3db4f3d068a21d8ba34175f21987b1bec00157f069c295b2760a199ec7e45d46` |
| `rollback.txt` | `9b603ae231051db3ba8add5bdb82f9377d20f5ee708b93f56174193f968f833e` |
| `runtime.txt` | `5f62c3f328b4cc2d1dde8779f524d38649c6e826729bf52d56deb4ac98b24bf3` |
| `workflow.txt` | `f518ca5ef580351dc21effd8d115ca7c7552bf89aaad37a6f7ef277b754db0f8` |

All nine data files and `checksums.txt` are regular mode-0600 files inside a mode-0700 directory. Live semantic verification parsed the exact file set, release links, state ordering, two Jobs, eight Pod observations, Task continuity, rollback/recovery markers, and cleanup. Credential scans covered PostgreSQL userinfo, URL assignments, passwords, Secret values, cookies, CSRF values, GitHub/bearer/service-account tokens, registry auth, kubeconfig, private keys, unresolved tokens, tracebacks, and exception dumps.

## Source Freeze and Public State

- Local target HEAD and public `main` equal `8e372f93e1a7bb72880be5198430a065d38d65f5`.
- The source remains clean with 29 commits, 38 tracked files, and the exact five Phase 26 subjects.
- Migration `tasks/migrations/0001_initial.py` remains SHA-256 `745bc45f655bf0b164c1464c0c22786d22910e2aea235772e5dcea38495e4bf3`.
- Protected Stage 1 remains direct `0d9254d37914976898039ff3c55f94399aa1d7c0`, peeled `ca115bf21b599c14e667b336bd78e3c587c24208`.
- Protected Stage 2 remains direct `16f60a44885216fa35d67b0334914d8b8d4e8577`, peeled `16279958ca774f7a34c25b0102a483df53160d6f`.
- Ruleset `19014157` remains active for `refs/tags/stage-*` with update and deletion protection and zero bypass actors.

## Cleanup

Successful run `0f27d3ed8f1f` finished with Deployment, ReplicaSet, Pod, Service, Job, Secret, and ConfigMap counts at zero. PostgreSQL and application port-forwards stopped; state, render, clone, registry, browser, evidence scratch, process, and ownership-ledger categories are empty.

Diagnostic runs `3238245aea7b` and `e9390b2af00e` each stopped at the same baseline native-admin field timing boundary and each completed `SESSION_STOPPED`, `ASSERT_CLEAN_OK`, and `PRODUCTION_CLEANUP_OK`. Independent final `--assert-clean-all` reported Django, FastAPI, and production inventory, processes, browsers, paths, and ledgers at zero.

## Task Results

1. **Task 1:** Frozen local/public source, two successful workflows, public linked package, and both anonymous images passed before namespace mutation. Target source commit: 0.
2. **Task 2:** Run `0f27d3ed8f1f` completed both migrations and all four ordered controller states on one database. Target source commit: 0.
3. **Task 3:** Nine data files passed semantic and credential checks, nine checksums verified, source/tags remained frozen, and final read-only cleanup passed. Target source commit: 0.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added a bounded external browser readiness adapter**
- **Found during:** Task 2, baseline native-admin readback in runs `3238245aea7b` and `e9390b2af00e`.
- **Issue:** `agent-browser 0.26.0` returned from the login submit before the native change-form title selector became ready.
- **Fix:** A mode-0700 adapter outside the target repository waited for login navigation to reach network-idle and retried the unchanged `#id_title` selector for at most five seconds.
- **Files modified:** One temporary ignored planning scratch file, removed after the accepted run. Target source files changed: 0.
- **Verification:** Accepted run `0f27d3ed8f1f` passed admin readback in all four states; the adapter directory is absent; final cleanup and source-freeze checks pass.

**Total deviations:** 1 auto-fixed runtime compatibility issue. **Impact:** Browser timing became deterministic while application, release, selector, credential, and assertion contracts stayed frozen.

## Issues Encountered

- The Kubernetes API emitted its legacy service-account token warning during read-only and owned operations. Runtime Pods retained `automountServiceAccountToken: false`, and evidence scans remained clean.
- One final anonymous digest recheck used zsh word splitting incorrectly; the corrected explicit two-image command passed with separate fresh configurations and removed both directories.

## Known Stubs

None. The live rollback and recovery evidence is complete.

## Next Phase Readiness

- Plan 26-04 can append `publication.txt`, publish the protected annotated Stage 3 tag, replay all public stages, reseal ten checksums, and freeze the final eleven-file package.
- The accepted live evidence remains writable only for that exact publication append and reseal sequence.
- DJAN-03 and DJAN-04 remain pending until protected Stage 3 publication and independent Phase 26 verification complete.

## Self-Check: PASSED

- All ten evidence files exist with expected modes; nine checksum entries verify.
- Live semantic, credential, source-freeze, protected-tag, anonymous-image, and read-only cleanup gates pass.
- Run `0f27d3ed8f1f` records both Jobs, revisions `1/2/3/4`, the expected A/B/A/B image sequence, eight accepted Pods, and one Task witness.
- Target repository HEAD, public main, 29/38 inventory, migration hash, and clean tree remain exact.
- Temporary adapter, registry configurations, renders, state, browser sessions, processes, ledgers, and run-labeled resources are absent.

---
*Phase: 26-django-production-stage*
*Completed: 2026-07-16*
