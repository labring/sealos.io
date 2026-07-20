---
phase: 23-fastapi-production-stage
plan: "04"
subsystem: protected-release-publication
tags: [fastapi, git-tags, github-actions, ghcr, public-replay, evidence]

requires:
  - phase: 23-fastapi-production-stage
    plan: "03"
    provides: Live-accepted rollback and recovery evidence with frozen source/image identities
provides:
  - Protected annotated Stage 3 source identity aligned with public main
  - Independent public HTTPS clone and anonymous image replay across all three source stages
  - Final checksum-valid publication evidence package with audited immutable package versions
affects: [phase-24-django-deploy, phase-27-practice-tutorials, phase-28-catalog-cleanup]

tech-stack:
  added: []
  patterns: [four-state tag recovery, isolated anonymous registry replay, checksum-independent publication preflight]

key-files:
  created:
    - .planning/phases/23-fastapi-production-stage/evidence/publication.txt
  modified:
    - .planning/phases/23-fastapi-production-stage/evidence/cleanup.txt
    - .planning/phases/23-fastapi-production-stage/evidence/checksums.txt
    - .planning/ROADMAP.md
    - .planning/STATE.md

key-decisions:
  - "Recover Stage 3 only through the coherent absent-local and absent-remote branch, then push that single annotated ref normally."
  - "Derive final image identity from the peeled Stage 3 public clone and require isolated anonymous config, manifest, and digest access."
  - "Retain all seven immutable full-SHA package versions after the exact deletion API exposed a missing OAuth scope, while preserving the accepted baseline/final mappings."

patterns-established:
  - "Protected stage publication freezes direct object, peeled commit, message, ruleset, public main, workflow target, and OCI revision as one identity graph."
  - "Publication evidence becomes read-only only after checksum-independent preflight, atomic checksum replacement, and one full verification."

requirements-completed: []

coverage:
  - id: D1
    description: Protected annotated Stage 3 aligns with public main while Stage 1, Stage 2, and the tag ruleset remain exact.
    requirement: FAST-04
    verification:
      - kind: integration
        ref: git and GitHub API direct/peeled tag plus ruleset readback
        status: pass
    human_judgment: false
  - id: D2
    description: Public HTTPS clones reproduce all three source stages and baseline/final images reproduce anonymously.
    requirement: FAST-03
    verification:
      - kind: e2e
        ref: public clone replay with Stage 3 PostgreSQL run a848f3722cc7
        status: pass
    human_judgment: false
  - id: D3
    description: Publication evidence is credential-free, checksum-valid, read-only, and closed with zero temporary footprint.
    requirement: FAST-03
    verification:
      - kind: integration
        ref: scripts/test-production.sh --verify-evidence publication
        status: pass
    human_judgment: false

duration: 45 min
completed: 2026-07-15
status: complete
---

# Phase 23 Plan 04: FastAPI Production Publication Summary

**Protected Stage 3, independent public clone and image replay, checksum-valid publication evidence, and exact zero-footprint cleanup are complete**

## Performance

- **Started:** 2026-07-15T17:16:20Z
- **Completed:** 2026-07-15T18:01:04Z
- **Duration:** 45 min
- **Tasks:** 3
- **Files modified:** 6

## Accomplishments

- Published protected annotated `stage-3-production` through the coherent absent/absent recovery branch with direct object `148b525452c3e1cd1b187b5d8ffb488b8fd16403`, peeled source `1dbbf19185207aed44a29ad6a3509d94a3670c43`, and exact message `FastAPI production stage`.
- Replayed Stage 1, Stage 2, and Stage 3 independently from public HTTPS tags; every stage reproduced its lock/export, Stage 1 passed 12 tests, and Stage 3 passed 10 static tests plus a fresh 33-test PostgreSQL gate.
- Replayed final and baseline full-SHA image tags through separate empty mode-0700 anonymous registry configurations and removed every clone, registry configuration, database resource, process, state file, and render path.

## Publication Identity

| Stage | Direct object | Peeled commit | Message |
|-------|---------------|---------------|---------|
| Stage 1 | `77e57a281ecc087041b54273c1bfc63b66f13d1a` | `276aa00e4d5bb7a0d5e375fee530cde3240b2ce8` | `FastAPI deploy stage` |
| Stage 2 | `b61254c237885744ae85cb6f81386f77f1e3ac09` | `2b256b3dfc2a7d2a4b930c9970becca8c6da8cd3` | `FastAPI PostgreSQL stage` |
| Stage 3 | `148b525452c3e1cd1b187b5d8ffb488b8fd16403` | `1dbbf19185207aed44a29ad6a3509d94a3670c43` | `FastAPI production stage` |

Public main equals the Stage 3 peeled commit. Active ruleset `18970425`
continues to target only `refs/tags/stage-*` with update and deletion
protection, empty exclude, and empty bypass sets.

## Public Replay

| Replay | Commit | Lock/export | Tests/runtime | Cleanup |
|--------|--------|-------------|---------------|---------|
| Stage 1 public clone | `276aa00e4d5bb7a0d5e375fee530cde3240b2ce8` | Passed | 12 public tests passed | Removed |
| Stage 2 public clone | `2b256b3dfc2a7d2a4b930c9970becca8c6da8cd3` | Passed | Stage contract reproduced | Removed |
| Stage 3 public clone | `1dbbf19185207aed44a29ad6a3509d94a3670c43` | Passed | 10 static tests and 33 PostgreSQL tests passed | Run `a848f3722cc7` reached exact zero |

The Stage 3 database gate reached Alembic `0001`, completed two source
migration Jobs, returned migrated health `200`, generated redacted seven-file
temporary evidence, and ended with `CLEANUP_OK`.

## Image Replay

| Role | Source | Digest | Result |
|------|--------|--------|--------|
| Baseline | `1a5a66f3959f69ff66d85a9562acba738c82edb4` | `sha256:b11293cf8ebb0e73fbabfd33ef6e812d53cb8176ea2db853769aae3dfa273337` | Anonymous digest/config/manifest and OCI identity passed |
| Final | `1dbbf19185207aed44a29ad6a3509d94a3670c43` | `sha256:c5f6d6df59d05ab9e079aab5dc9a9b0666218ae38f104630587343eaba25b5de` | Clone-derived anonymous digest/config/manifest and OCI identity passed |

## Package Version Audit

The fail-closed inventory contains exactly seven immutable full-SHA versions
and zero mutable tags. Accepted baseline version `1033114568` and accepted
final version `1033710956` remain public and anonymously readable.

| Classification | Version IDs |
|----------------|-------------|
| Accepted release versions | `1033114568`, `1033710956` |
| Retained immutable audit versions | `1033073401`, `1033102122`, `1033435304`, `1033569381`, `1033619284` |

## Evidence State

- `publication.txt` contains the exact eleven expected repository, stage, ruleset, package, image, and clone records.
- `cleanup.txt` contains the live-run zero inventory plus the public-clone zero inventory.
- Checksum-independent publication preflight passed before the atomic nine-entry manifest replacement.
- Full publication verification ran exactly once and returned `PUBLICATION_EVIDENCE_OK` with semantic and checksum validation passed.
- `checksums.txt` SHA-256 is `0d84da0dbb202866048731c79e5bc7359c0a7fd38380045de3e4d51f187de642`; all ten evidence files are read-only.

## Deviations from Plan

### Retained immutable audit versions after package deletion authorization failed

- **Found during:** Final package hygiene after Stage 3 publication
- **Issue:** The seven-version set matched the accepted two IDs plus the five recorded failed/superseded IDs exactly. The first exact version DELETE returned HTTP 403 because the active OAuth token lacks `read:packages` and `delete:packages`.
- **Impact:** The API rejected the request before any deletion, so the package retained all seven coherent full-SHA versions and produced zero partial deletion state.
- **Disposition:** Keep the seven-version immutable audit inventory. Phase acceptance relies on the accepted baseline/final mappings, public anonymous access, and zero mutable tags, all of which pass.

**Total deviations:** 1 external authorization deviation with zero release-identity impact.

## Task Commit

Tasks 1-3 are recorded atomically by the plan closeout commit
`docs(23-04): publish FastAPI production stage`.

## Next Phase Readiness

- Phase 23 has four executed plans and complete FAST-03/FAST-04 verification inputs.
- Independent Phase 23 verification is the next gate; requirement status remains pending until that verifier passes.

## Self-Check: PASSED

- Public main, all three protected annotated tags, ruleset `18970425`, workflow `29434731777`, package visibility, and both accepted OCI identities agree.
- Stage 1 passed 12 public tests; Stage 3 passed 10 static tests and fresh PostgreSQL run `a848f3722cc7` passed 33 tests, two revision-`0001` Jobs, and exact cleanup.
- Publication preflight, the unique full verifier run, nine checksums, ten read-only evidence files, credential scans, and 14 exact run-label zero inventories pass.

---
*Phase: 23-fastapi-production-stage*
*Completed: 2026-07-15*
