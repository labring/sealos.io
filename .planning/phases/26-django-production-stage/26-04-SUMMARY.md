---
phase: 26-django-production-stage
plan: "04"
subsystem: protected-release-publication
tags: [django, git-tags, github-actions, ghcr, public-replay, evidence]

requires:
  - phase: 26-django-production-stage
    plan: "03"
    provides: Frozen Image A/Image B sources and checksum-valid four-state live rollback evidence
provides:
  - Protected annotated Django Stage 3 aligned with public main
  - Independent public HTTPS replay of all three Django source stages
  - Anonymous replay of both accepted production images and exact GHCR version inventory
  - Ten-entry checksum manifest with eleven read-only evidence files and zero temporary residue
affects: [phase-27-practice-backed-tutorial-series, phase-28-catalog-publication-and-cleanup]

tech-stack:
  added: []
  patterns: [four-state tag recovery, public-clone replay, isolated anonymous registry replay, checksum-last evidence seal]

key-files:
  created:
    - .planning/phases/26-django-production-stage/evidence/publication.txt
    - .planning/phases/26-django-production-stage/26-04-SUMMARY.md
  modified:
    - .planning/phases/26-django-production-stage/evidence/cleanup.txt
    - .planning/phases/26-django-production-stage/evidence/checksums.txt
    - .planning/STATE.md
    - .planning/ROADMAP.md

key-decisions:
  - "Publish Stage 3 only through the coherent absent-local/absent-remote branch and one normal single-ref push."
  - "Preserve GHCR versions 1035784039 and 1037249929 as the only accepted Image A/Image B versions; the package contained zero temporary versions."
  - "Replay all three public tags in separate mode-0700 roots and require separate fresh PostgreSQL runs for Stage 2 and Stage 3."
  - "Seal publication evidence after one checksum-independent preflight, one full verifier, and ten successful checksum reads."

patterns-established:
  - "Protected publication binds public main, annotated tag objects, peeled commits, messages, ruleset, workflow targets, package versions, and OCI revisions into one read-only identity graph."
  - "Public replay owns every clone, database run, registry configuration, render, evidence scratch path, process, and ledger through exact cleanup identities."

requirements-completed: []

coverage:
  - id: D1
    description: "Protected annotated Django Stage 3 equals frozen public main while Stages 1 and 2 and ruleset 19014157 remain exact."
    requirement: DJAN-04
    verification:
      - kind: integration
        ref: "Git and GitHub API direct/peeled/message/ruleset readback"
        status: pass
    human_judgment: false
  - id: D2
    description: "Three fresh public clones reproduce Stage 1, Stage 2, and Stage 3, including fresh PostgreSQL and production contracts."
    requirement: DJAN-04
    verification:
      - kind: e2e
        ref: "Stage 1: 5 tests; Stage 2 run a43c7007ec85: 43 tests; Stage 3 runs a252bcf32c38/a5c35dc04d16: 34/58 tests"
        status: pass
    human_judgment: false
  - id: D3
    description: "Image A and Image B reproduce anonymously with exact digests, linux/amd64 manifests, OCI source/revision, non-root identity, Gunicorn command, and collected static assets."
    requirement: DJAN-03
    verification:
      - kind: integration
        ref: "Separate empty DOCKER_CONFIG digest/config/manifest/rootfs replays"
        status: pass
    human_judgment: false
  - id: D4
    description: "Ten credential-free data files have a ten-entry checksum manifest, one successful full verifier, read-only modes, and zero temporary footprint."
    requirement: DJAN-03
    verification:
      - kind: integration
        ref: "scripts/test-production.sh --verify-evidence publication; shasum 10/10; --assert-clean-all"
        status: pass
    human_judgment: false

duration: 33 min
completed: 2026-07-16
status: complete
---

# Phase 26 Plan 04: Django Production Publication Summary

**Protected Django Stage 3, three independent public source replays, two anonymous image replays, and an eleven-file read-only evidence package now form one reproducible production release.**

## Performance

- **Started:** 2026-07-16T14:08:29Z
- **Completed:** 2026-07-16T14:41:16Z
- **Duration:** 33 min
- **Tasks:** 3
- **Target repository commits:** 0

## Accomplishments

- Published annotated `stage-3-production` from the exact absent/absent state through one normal single-ref push. Direct object `f5d48ccd96f9b62da268720686e26666e2675235` peels to frozen public main `8e372f93e1a7bb72880be5198430a065d38d65f5` with message `Django production stage`.
- Replayed all three protected tags from separate public HTTPS clones. Stage 1 passed 5 tests, Stage 2 run `a43c7007ec85` passed 43 tests plus two Jobs/restart/admin, and Stage 3 runs `a252bcf32c38` and `a5c35dc04d16` passed 34 focused and 58 complete tests with strict server rendering.
- Replayed Image A and Image B through separate empty mode-0700 anonymous configurations and verified exact digests, linux/amd64, OCI source/revision, UID/GID `10001:10001`, the Gunicorn command, static manifest hashes, and hashed Task CSS.
- Sealed ten curated data files behind ten sorted SHA-256 entries and one successful full verifier; all eleven evidence files are mode `0400` and the final cluster/local ownership audit is zero.

## Public Identity

| Boundary | Direct object | Peeled source | Message |
|---|---|---|---|
| Stage 1 | `0d9254d37914976898039ff3c55f94399aa1d7c0` | `ca115bf21b599c14e667b336bd78e3c587c24208` | `Django deploy stage` |
| Stage 2 | `16f60a44885216fa35d67b0334914d8b8d4e8577` | `16279958ca774f7a34c25b0102a483df53160d6f` | `Django PostgreSQL stage` |
| Stage 3 | `f5d48ccd96f9b62da268720686e26666e2675235` | `8e372f93e1a7bb72880be5198430a065d38d65f5` | `Django production stage` |

Ruleset `19014157` remains active for `refs/tags/stage-*` with update and deletion protection, zero bypass actors, and zero excluded refs. Public main remains the Stage 3 peeled source with 29 commits, 38 files, five exact unique Phase 26 subjects, and migration SHA-256 `745bc45f655bf0b164c1464c0c22786d22910e2aea235772e5dcea38495e4bf3`.

## Workflow, Package, and Images

| Role | Workflow | API head / normalized target | Version ID | Public digest |
|---|---:|---|---:|---|
| Image A | `29477970332` | `c99384891f45c8df8bfaf7803c8e1d752ffd08c5` | `1035784039` | `sha256:df3772c3abedfb05c52d696f17ff8295d73f34b8b017f8b6ba2738fceb4247a8` |
| Image B | `29501299847` | `8e372f93e1a7bb72880be5198430a065d38d65f5` | `1037249929` | `sha256:aad216002fae3fd2adce92f09e47e936614b16964a6972c226c4058a16568c7b` |

Both workflows are successful push runs with matching API head and normalized target. The package is public and linked to `yangchuansheng/sealos-django-tutorial`. Its complete version inventory contains these two accepted immutable full-SHA versions and zero phase-owned temporary versions.

## Public Replay

| Stage | Commit | Gate | Result |
|---|---|---|---|
| Stage 1 | `ca115bf21b599c14e667b336bd78e3c587c24208` | lock/export plus public suite | 5 passed |
| Stage 2 | `16279958ca774f7a34c25b0102a483df53160d6f` | fresh PostgreSQL phase gate | run `a43c7007ec85`, 43 passed, 2 Jobs, restart/admin passed |
| Stage 3 focused | `8e372f93e1a7bb72880be5198430a065d38d65f5` | production/migration/harness tests | run `a252bcf32c38`, 34 passed |
| Stage 3 complete | `8e372f93e1a7bb72880be5198430a065d38d65f5` | fresh PostgreSQL phase gate and external evidence | run `a5c35dc04d16`, 58 passed, 2 Jobs, restart/admin passed |

Every clone reproduced `uv.lock` and `requirements.txt`, remained clean, and was removed with its external evidence, registry configurations, and render scratch.

## Evidence Manifest

| File | SHA-256 |
|---|---|
| `cleanup.txt` | `2455a51fe21c9a49dabd7eddf8b302ee263b0fa7164a9bb8261cc7216eea4e90` |
| `collectstatic.txt` | `2f9a8985ee73279b5b8c2e8188e1c5558dcffa7f501710faa667baab57aacd61` |
| `http.jsonl` | `79962d4f1a319eec73c07d043ca93914d6838536f222cfacc3ab7d04e8bcc0c4` |
| `images.txt` | `d9fdd69f28b094485f67660ee9f099ffb9066dce16d7456871508eca0185e725` |
| `logs.txt` | `150640191e48dc5f74f480e694af43f608c9eba2a8b8352888569420a3333348` |
| `migrations.txt` | `3db4f3d068a21d8ba34175f21987b1bec00157f069c295b2760a199ec7e45d46` |
| `publication.txt` | `b04ed94e2f0630067853f50d5685a92c55210013575c3335e59c4599f0d4d7f5` |
| `rollback.txt` | `9b603ae231051db3ba8add5bdb82f9377d20f5ee708b93f56174193f968f833e` |
| `runtime.txt` | `5f62c3f328b4cc2d1dde8779f524d38649c6e826729bf52d56deb4ac98b24bf3` |
| `workflow.txt` | `f518ca5ef580351dc21effd8d115ca7c7552bf89aaad37a6f7ef277b754db0f8` |

Publication preflight accepted exactly ten data files and the credential scan. The manifest was generated atomically, the full publication verifier ran once, `shasum -a 256 -c` passed 10/10, and all eleven files were sealed mode `0400`.

## Task Results

1. **Task 1:** Public main, Stage 1/2, ruleset, workflows, package, and both anonymous images passed before the Stage 3 absent/absent publication. Target commits: 0.
2. **Task 2:** Three public clones, two isolated image replays, exact GHCR version attribution, and final replay cleanup passed. Target commits: 0.
3. **Task 3:** Ten-file preflight, atomic checksums, one full verifier, read-only sealing, public readback, and final zero-residue audit passed. Target commits: 0.

Planning metadata commit was skipped because `.planning/` is ignored. No force-add or target-source commit was created.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Removed one pre-tag anonymous-image scratch directory left by a shell mismatch**

- **Found during:** Task 3 final ownership audit.
- **Issue:** The first pre-tag image command started under zsh, failed on Bash-only substitution after creating one mode-0700 baseline scratch root, and exited before its Bash cleanup trap was installed.
- **Fix:** Re-ran the image gate under Bash, validated the residual root's exact prefix, mode, and two expected children, removed that exact path, and repeated the complete ownership audit.
- **Files modified:** None.
- **Verification:** Final path scan, exact run-label scan, and `--assert-clean-all` report zero inventory, processes, browsers, paths, and ledgers.

**Total deviations:** 1 auto-fixed correctness issue. **Impact:** The final public and evidence identities remained unchanged; temporary ownership closed at zero.

## Issues Encountered

- Public clones of annotated tags emitted Git's expected tag-object warning before checking out each peeled commit.
- The Stage 3 complete suite emitted seven development-only missing-static-directory warnings; all 58 tests and production static contracts passed.

## User Setup Required

None. Public source tags and both immutable GHCR images are available anonymously.

## Next Phase Readiness

- Phase 26 execution is complete and ready for independent DJAN-03/DJAN-04 verification.
- Phase 27 can consume protected Stage 3, both image digests, live run `0f27d3ed8f1f`, public replay runs, and the sealed evidence manifest after verification passes.
- Final cluster and local ownership inventory is zero.

## Self-Check: PASSED

- Stage 3 direct/peeled/message and all preserved Stage 1/2/ruleset identities pass local and remote readback.
- Three public clones, two anonymous images, two accepted GHCR versions, and three fresh PostgreSQL runs pass their contracts.
- All ten checksums verify and all eleven evidence files are mode `0400`.
- Target source remains clean at the frozen 29-commit/38-file FINAL SHA with zero new commit.
- Exact labels, seven production categories, processes, browsers, clones, configs, scratch paths, and ledgers are zero.

---
*Phase: 26-django-production-stage*
*Completed: 2026-07-16*
