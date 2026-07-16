---
phase: 26-django-production-stage
plan: "02"
subsystem: django-production-workload-and-release
tags: [django, kubernetes, gunicorn, whitenoise, ghcr, rollback, evidence]

requires:
  - phase: 26-django-production-stage
    provides: Image A source, public digest, production image, and exact-source publisher
provides:
  - Same-image migration-first Django workload with two hardened Gunicorn replicas
  - Bash 3.2 production harness with strict rendering, four-state rollout ownership, semantic evidence, and read-only cleanup
  - README-only final reader source and distinct public Image B digest
affects: [26-03-live-rollback, 26-04-stage-publication, 27-practice-backed-tutorial-series]

tech-stack:
  added: []
  patterns: [exact-token rendering, migration-before-readiness, four-state rollback, atomic evidence checksums, anonymous OCI replay]

key-files:
  created:
    - /Users/longnv/bin/repo/sealos-django-tutorial/deploy/application.yaml
    - /Users/longnv/bin/repo/sealos-django-tutorial/scripts/test-production.sh
  modified:
    - /Users/longnv/bin/repo/sealos-django-tutorial/deploy/migration-job.yaml
    - /Users/longnv/bin/repo/sealos-django-tutorial/README.md
    - /Users/longnv/bin/repo/sealos-django-tutorial/tests/test_migration_job.py
    - /Users/longnv/bin/repo/sealos-django-tutorial/tests/test_postgres_harness.py
    - /Users/longnv/bin/repo/sealos-django-tutorial/tests/test_production.py

key-decisions:
  - "Run the same immutable candidate image and run-owned Secret through the migration Job before accepting either application replica."
  - "Use one persistent Django Task as the witness across baseline, final, rollout undo, and explicit final recovery."
  - "Freeze the README-only final source before retaining its dynamic Image B digest in Sealos.io planning evidence."
  - "Treat cleanup secret=0 as a zero-inventory field while scanning every assigned Secret value as credential material."

requirements-completed: []

coverage:
  - id: D1
    description: "The production Job and two-replica Deployment share one immutable image and Secret with exact readiness, resources, and security controls."
    requirement: DJAN-03
    verification:
      - kind: integration
        ref: "scripts/test-postgres.sh focused suite plus strict server-render fixture"
        status: pass
    human_judgment: false
  - id: D2
    description: "The production harness owns four ordered states, Django HTTP and admin continuity, semantic evidence, credential scanning, and read-only cleanup."
    requirement: DJAN-03
    verification:
      - kind: integration
        ref: "34 focused tests, live/publication evidence fixtures, and assert-clean-all"
        status: pass
    human_judgment: false
  - id: D3
    description: "The README-only final source is public main and maps to a distinct anonymous linux/amd64 Image B."
    requirement: DJAN-03
    verification:
      - kind: e2e
        ref: "GitHub Actions run 29501299847 plus anonymous digest/config/manifest/export replay"
        status: pass
    human_judgment: false
  - id: D4
    description: "The final source preserves five exact Phase 26 commits, 29 total commits, 38 files, migration 0001, protected Stage 1/2, and tag ruleset 19014157."
    requirement: DJAN-03
    verification:
      - kind: other
        ref: "local and public Git/GitHub inventory readback"
        status: pass
    human_judgment: false

duration: 59 min
completed: 2026-07-16
status: complete
---

# Phase 26 Plan 02: Django Production Workload and Image B Summary

**Public main now contains the migration-first two-replica Django workload, four-state production harness, immutable reader workflow, and a distinct anonymously reproducible Image B.**

## Release Inputs

baseline_source=c99384891f45c8df8bfaf7803c8e1d752ffd08c5
baseline_image=ghcr.io/yangchuansheng/sealos-django-tutorial@sha256:df3772c3abedfb05c52d696f17ff8295d73f34b8b017f8b6ba2738fceb4247a8
final_source=8e372f93e1a7bb72880be5198430a065d38d65f5
final_image=ghcr.io/yangchuansheng/sealos-django-tutorial@sha256:aad216002fae3fd2adce92f09e47e936614b16964a6972c226c4058a16568c7b

## Performance

- **Duration:** 59 min
- **Started:** 2026-07-16T20:19:07+08:00
- **Completed:** 2026-07-16T21:18:06+08:00
- **Tasks:** 3
- **Target files:** 7 across the RED, GREEN, and README-only source freeze

## Accomplishments

- Added a two-replica Deployment and ClusterIP Service with one Gunicorn sync worker per Pod, localhost Host validation, strict readiness, bounded resources, UID/GID 10001, read-only root, and a 64 MiB memory-backed `/tmp`.
- Extended the migration Job with the same candidate digest and Secret consumed by the Deployment, and required its completed migration before rollout readiness.
- Added a Bash 3.2 production harness for exact rendering, two-image registry replay, four ordered states, persistent Task Board and authenticated admin readback, semantic evidence, and read-only global cleanup.
- Froze the production reader workflow in one README-only commit, fast-forwarded public main, and published a distinct exact-source Image B.

## TDD History Proof

| Boundary | Commit | Direct parent | Scope |
|---|---|---|---|
| Pair 2 RED | `c8cf6751bfe6158fa4e010f4fc6ccb7f6f2b4741` | Image A GREEN `c99384891f45c8df8bfaf7803c8e1d752ffd08c5` | Exactly three test files |
| Pair 2 GREEN | `558f33fda13416dfbc27ccd7c75b10320fb2b0d0` | Pair 2 RED | Exactly `deploy/application.yaml`, `deploy/migration-job.yaml`, and `scripts/test-production.sh` |
| Reader freeze | `8e372f93e1a7bb72880be5198430a065d38d65f5` | Pair 2 GREEN | Exactly `README.md` |

Two retained real-PostgreSQL RED runs, `773a3c9326eb` and `4b88e712d610`, exited 1 at the exact first signature `AssertionError: deploy/application.yaml must exist`; each cleaned to zero. The final focused GREEN run `1e1f0a3a6f3b` passed 34 tests in 64.54 seconds and cleaned to zero.

## Workload and Harness Gates

| Gate | Result |
|---|---|
| Application and migration render | Server-side strict validation, resolved exact token sets, mode 0600 |
| Focused real PostgreSQL | 34 passed; frozen tests and source Job |
| Complete inherited gate | Run `82e2b96eb58f`; 58 passed; two Jobs; restart and admin continuity passed |
| Migration identity | `745bc45f655bf0b164c1464c0c22786d22910e2aea235772e5dcea38495e4bf3` |
| Live evidence fixture | Nine data files and nine sorted checksums passed; changed checksum rejected |
| Publication evidence fixture | Ten data files; absent and stale checksum preflights passed; ten final checksums passed |
| Credential scan | PostgreSQL URL, assignments, tokens, cookies, CSRF, private keys, kubeconfig, tracebacks, and unresolved tokens rejected |
| Final cleanup | PostgreSQL and production inventories, processes, browsers, paths, ledgers, registry configs, renders, clones, and image scratch all zero |

## Public Workflow and Package

| Role | Workflow | Event | Head / target | Conclusion | Package version |
|---|---:|---|---|---|---:|
| Image A | `29477970332` | push | `c99384891f45c8df8bfaf7803c8e1d752ffd08c5` / same | success | `1035784039` |
| Image B | `29501299847` | push | `8e372f93e1a7bb72880be5198430a065d38d65f5` / same | success | `1037249929` |

The GHCR package is public and linked to `yangchuansheng/sealos-django-tutorial`. Image B's registry readback digest is authoritative; its local OCI candidate digest was `sha256:515e3ef2d450261a690118871425bbc895f042bf3bf5dcb2fa363a3e928bfc5c`.

## Anonymous Image Identity

| Contract | Image A | Image B |
|---|---|---|
| Platform | `linux/amd64` | `linux/amd64` |
| Media type | Docker distribution manifest v2 | Docker distribution manifest v2 |
| User / workdir | `10001:10001` / `/app` | `10001:10001` / `/app` |
| OCI revision | `c99384891f45c8df8bfaf7803c8e1d752ffd08c5` | `8e372f93e1a7bb72880be5198430a065d38d65f5` |
| OCI source | Public Django tutorial repository | Public Django tutorial repository |
| Static manifest SHA-256 | `ae88fb5828c33016c95de6040c94ac8cc57503c037d7ef1961fa774eb07cc304` | `98bfcf6507b2dffc2d347fd75b4711043251c5106b18f65922e44f85afda9c5a` |
| Hashed Task CSS | `/static/tasks/styles.852e61e8064c.css` | `/static/tasks/styles.852e61e8064c.css` |

Image B and Image A were replayed in that order with separate fresh empty mode-0700 anonymous registry configurations. Digest, config, manifest, root filesystem, collected manifest, and the single hashed Task CSS each passed.

## Final Source Inventory

The final source tree has 29 commits, 38 tracked files, zero duplicate subjects, and source tree checksum `c1c939392ff123b5d8674f213de99a6def55f10b8464160993b1191f1669e6eb`. Its last five subjects are exactly:

1. `test(26-01): specify Django production image contract`
2. `feat(26-01): add hardened Django production image`
3. `test(26-02): specify Django production workload contract`
4. `feat(26-02): add Django production workload contracts`
5. `docs(26-02): document immutable Django production release`

The six files added above protected Stage 2 are `.dockerignore`, `.github/workflows/publish-image.yml`, `Dockerfile`, `deploy/application.yaml`, `scripts/test-production.sh`, and `tests/test_production.py`. Public main equals the final source and the target worktree is clean and frozen.

## Protected Public State

| Stage | Direct object | Peeled commit | Message |
|---|---|---|---|
| Stage 1 | `0d9254d37914976898039ff3c55f94399aa1d7c0` | `ca115bf21b599c14e667b336bd78e3c587c24208` | `Django deploy stage` |
| Stage 2 | `16f60a44885216fa35d67b0334914d8b8d4e8577` | `16279958ca774f7a34c25b0102a483df53160d6f` | `Django PostgreSQL stage` |

Ruleset `19014157` remains active for `refs/tags/stage-*` with update and deletion protection, zero bypass actors, and zero excluded refs. Stage 3 remains absent for the live rollback and protected publication plans.

## Task Commits

1. **Task 1: Specify the Django production workload contract** - `c8cf675` (`test`)
2. **Task 2: Add the migration-first workload and production harness** - `558f33f` (`feat`)
3. **Task 3: Freeze reader documentation and publish Image B** - `8e372f9` (`docs`)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Allowed the zero Secret inventory field through credential scanning**
- **Found during:** Task 2 semantic evidence fixtures
- **Issue:** The legal cleanup record `secret=0` matched the broad Secret assignment pattern and blocked every complete evidence package.
- **Fix:** Exempted only a zero inventory value followed by whitespace or end-of-file while retaining rejection for assigned Secret values.
- **Files modified:** `scripts/test-production.sh`
- **Verification:** Live and publication semantic fixtures passed; a changed checksum failed; the source credential-pattern tests stayed green.
- **Committed in:** `558f33f`

**Total deviations:** 1 auto-fixed correctness issue. The exact RED/GREEN scopes and final README-only source remained intact.

## Issues Encountered

- macOS Bash 3.2 did not populate sourced functions through process substitution in the standalone renderer fixture. The accepted fixture rendered the exact token sets into mode-0600 temporary files and passed both resources through the Kubernetes server's strict dry-run path.
- The Kubernetes API emitted its legacy service-account token warning during real PostgreSQL gates. Every owned resource and process cleaned to zero.

## User Setup Required

None. The public repository, workflow, GHCR package, Image A, and Image B are available for the next live gate.

## Next Phase Readiness

- Plan 26-03 can invoke `scripts/test-production.sh --run` with the four release lines above and a fresh empty evidence directory.
- The final source is frozen on public main; Image A and Image B are distinct anonymous immutable inputs.
- Stage 1, Stage 2, migration `0001`, and ruleset protection remain exact for the four-state live rollback gate.

## Self-Check: PASSED

- Pair 2 RED/GREEN ancestry, subjects, exact disjoint scopes, and retained RED signature are proven.
- README is the only file in the final source commit; the source has 29 commits and 38 files.
- Workflow `29501299847` succeeded with exact head/target and public readback digest.
- Both images pass anonymous linux/amd64 OCI and static filesystem replay through separate configurations.
- Final `--assert-clean-all` and image scratch audits report every category at zero.

---
*Phase: 26-django-production-stage*
*Completed: 2026-07-16*
