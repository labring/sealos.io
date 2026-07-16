---
phase: 25-django-postgresql-stage
plan: "05"
subsystem: publication
tags: [django, fastapi, postgresql, github, protected-tags, public-replay, evidence, cleanup]

requires:
  - phase: 25-django-postgresql-stage
    plan: "04"
    provides: Accepted Django PostgreSQL source, complete local phase gate, and initial evidence
provides:
  - Independent immutable FastAPI Stage 2 fresh-database replay
  - Public Django main and protected annotated Stage 2 identity
  - Fresh public Django Stage 2 focused and complete replay
  - Eight credential-free evidence inputs with a verified sorted SHA-256 manifest
  - Cross-framework zero-residue readback
affects: [django-production-stage, practice-backed-tutorial-series, catalog-publication]

tech-stack:
  added: []
  patterns: [four-state tag recovery, immutable public replay, exact-label cleanup, checksum-last evidence freeze]

key-files:
  created:
    - .planning/phases/25-django-postgresql-stage/evidence/django-source.txt
    - .planning/phases/25-django-postgresql-stage/evidence/fastapi-phase-gate.txt
    - .planning/phases/25-django-postgresql-stage/evidence/checksums.txt
  modified:
    - .planning/phases/25-django-postgresql-stage/evidence/cleanup.txt
    - .planning/STATE.md
    - .planning/ROADMAP.md

key-decisions:
  - "Use the immutable FastAPI Stage 2 full evidence-enabled phase gate as the authoritative harness proof because that tag predates the later standalone harness test file."
  - "Recover Django Stage 2 publication from a coherent local-only tag state through a normal single-ref push with no force, replacement, or bypass."
  - "Store absolute evidence paths in the sorted checksum manifest so verification works from either Reference Application repository."
  - "Keep TDD-02, TDD-03, and DJAN-02 pending until the independent Phase 25 verifier completes."

patterns-established:
  - "Publication gate: local candidate, no-local clone, remote preflight, normal main fast-forward, four-state annotated tag handling, and complete readback."
  - "Public replay gate: exact tag identity, exact source inventory, locked sync, focused real PostgreSQL tests, full phase gate, and clone removal."
  - "Evidence freeze: scan eight reviewed inputs, generate checksums atomically last, verify all entries, then rerun GitHub and read-only cleanup checks."

requirements-completed: []

coverage:
  - id: D1
    description: "Immutable public FastAPI Stage 2 passes migrations, two Jobs, readiness, public persistence, evidence, and cleanup."
    requirement: TDD-03
    verification:
      - kind: e2e
        ref: "FastAPI run 3cdb81734d85: 24 tests, 9 HTTP requests, 2 Jobs, EVIDENCE_OK, CLEANUP_OK"
        status: pass
    human_judgment: false
  - id: D2
    description: "Public Django main equals accepted source, Stage 1 stays exact, and protected annotated Stage 2 peels to accepted main."
    requirement: DJAN-02
    verification:
      - kind: other
        ref: "GitHub readback: main 16279958, Stage 2 object 16f60a44, ruleset 19014157"
        status: pass
    human_judgment: false
  - id: D3
    description: "A fresh public Django Stage 2 clone passes focused and complete real PostgreSQL gates with restart persistence and administration."
    requirement: TDD-02
    verification:
      - kind: e2e
        ref: "Public runs d54fc2398a70 and eafdda9a17fb: 22 focused tests, 43 full tests, 2 Jobs, restart/admin pass"
        status: pass
    human_judgment: false
  - id: D4
    description: "Eight reviewed evidence inputs are credential-free, checksum-verified, and paired with zero cross-framework residue."
    requirement: TDD-03
    verification:
      - kind: other
        ref: "evidence/checksums.txt: 8/8 OK; --assert-clean-all: all five categories zero"
        status: pass
    human_judgment: false
  - id: D5
    description: "Accepted and public source retain exactly 24 commit subjects and 32 tracked Phase 25 files with the immutable migration."
    requirement: DJAN-02
    verification:
      - kind: other
        ref: "Local, no-local, and public source inventory gates"
        status: pass
    human_judgment: false

duration: 50 min
completed: 2026-07-16
status: complete
---

# Phase 25 Plan 05: Protected Django Stage 2 Publication Summary

**Protected Django Stage 2 reproduces publicly from fresh PostgreSQL alongside the independently replayed immutable FastAPI migration seam**

## Performance

- **Duration:** 50 min
- **Started:** 2026-07-16T02:58:03Z
- **Completed:** 2026-07-16T03:47:58Z
- **Tasks:** 3
- **Files modified:** 4 evidence artifacts plus 3 planning artifacts

## Accomplishments

- Replayed immutable public FastAPI Stage 2 at peeled commit `2b256b3d` with 24 tests, fresh/repeat Alembic state, two source Jobs, nine public HTTP requests, checksums, and exact cleanup.
- Published Django main `16279958ca774f7a34c25b0102a483df53160d6f` and annotated Stage 2 object `16f60a44885216fa35d67b0334914d8b8d4e8577` while preserving Stage 1 and ruleset `19014157`.
- Passed complete local candidate and no-local clone gates, then passed a fresh public HTTPS tag replay with 22 focused tests, 43 full tests, restart persistence, admin readback, and zero residue.
- Froze eight credential-free evidence inputs behind a sorted, atomically generated, fully verified SHA-256 manifest.

## Runtime Evidence

| Gate | Run ID | Result |
|------|--------|--------|
| Immutable FastAPI Stage 2 | `3cdb81734d85` | 24 tests, fresh/repeat `0001`, two Jobs, health 200, 9 HTTP records, checksums, cleanup |
| Django accepted local source | `07c61f7500a4` | 43 tests, two Jobs, restart/admin pass, cleanup |
| Django no-local pre-public clone | `fdf9f742a798` | Exact 24/32 source, 43 tests, two Jobs, restart/admin pass, cleanup |
| Django public focused replay | `d54fc2398a70` | 22 public/readiness tests, cleanup |
| Django public complete replay | `eafdda9a17fb` | 43 tests, two Jobs, 11 HTTP records, restart/admin pass, cleanup |

Every listed run has zero exact-label Deployment, Pod, Service, Job, Secret,
and ConfigMap inventory. Port-forwards, Django servers, browser sessions,
temporary roots, replay clones, state files, logs, cookie jars, and response
paths are absent.

## Publication Identity

- Repository: `yangchuansheng/sealos-django-tutorial`, public, default branch `main`.
- Public main: `16279958ca774f7a34c25b0102a483df53160d6f`.
- Stage 1: direct `0d9254d37914976898039ff3c55f94399aa1d7c0`, peeled `ca115bf21b599c14e667b336bd78e3c587c24208`, message `Django deploy stage`.
- Stage 2: direct `16f60a44885216fa35d67b0334914d8b8d4e8577`, peeled `16279958ca774f7a34c25b0102a483df53160d6f`, message `Django PostgreSQL stage`.
- Ruleset: `19014157`, active tag target, include `refs/tags/stage-*`, empty exclude/bypass, exact deletion and update rules.

## Task Commits

No new source commit was created. This plan published and replayed accepted
source commit `1627995`. Evidence and planning artifacts remain under the
planning repository workflow for the orchestrator's atomic metadata commit.

## Files Created/Modified

- `evidence/fastapi-phase-gate.txt` - Immutable FastAPI migration, Job, public behavior, checksum, and cleanup facts.
- `evidence/django-source.txt` - Accepted/public main, both source tags, ruleset, immutable migration, and public replay facts.
- `evidence/cleanup.txt` - Every accepted and diagnostic run plus final cross-framework zero-state readback.
- `evidence/checksums.txt` - Sorted SHA-256 manifest for the eight reviewed inputs.

## Decisions Made

- Used the FastAPI Stage 2 evidence-enabled full phase gate because the standalone harness test arrived in Stage 3 and is absent from the immutable Stage 2 inventory.
- Preserved immutable FastAPI source despite its disabled-evidence helper return bug; focused tests and live cleanup passed, and the complete evidence-enabled gate returned success.
- Used the documented tag recovery state machine after main advanced and local Stage 2 existed alone; the exact tag ref then published through a normal push.
- Generated absolute-path checksums so the planned `sha256sum -c` command succeeds from the external Django source repository.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Replaced an unavailable immutable FastAPI test path**
- **Found during:** Task 1 focused preflight
- **Issue:** FastAPI Stage 2 predates `tests/test_postgres_harness.py`.
- **Fix:** Ran Stage 2 migration Job and migration tests, shell syntax, and the complete evidence-enabled phase gate.
- **Files modified:** None
- **Verification:** 24 tests, two Jobs, nine HTTP observations, checksums, and cleanup passed from the exact public tag.
- **Committed in:** No source commit; immutable replay only.

**2. [Rule 3 - Blocking] Classified the FastAPI focused cleanup return**
- **Found during:** Task 1 focused replay
- **Issue:** A bare `return` after the false evidence-enabled test makes evidence-disabled runs report status 1 after successful tests and cleanup.
- **Fix:** Confirmed the branch with a transient mode-0600 trace, removed the trace and generated credentials, verified live zero state, and used the evidence-enabled full gate for acceptance.
- **Files modified:** None
- **Verification:** Final FastAPI gate returned `EVIDENCE_OK` and `CLEANUP_OK`; the final cross-framework audit reports all categories zero.
- **Committed in:** No source commit; immutable replay only.

**3. [Rule 3 - Blocking] Recovered the Stage 2 tag push from local-only state**
- **Found during:** Task 2 publication
- **Issue:** zsh interpreted an unbraced variable followed by `:refs` as a modifier after public main had fast-forwarded.
- **Fix:** Revalidated main, local tag, remote absence, Stage 1, and ruleset, then pushed `refs/tags/${TAG}:refs/tags/${TAG}`.
- **Files modified:** Git refs only
- **Verification:** Local, remote, and GitHub tag API direct/peeled/message/type readback agree.
- **Committed in:** Annotated tag object `16f60a4`.

**4. [Rule 3 - Blocking] Scoped the evidence scan to the exact input array**
- **Found during:** Task 3 evidence freeze
- **Issue:** A zsh path modifier expanded the first scan across the repository and stopped before checksum creation.
- **Fix:** Confirmed no partial manifest existed and reran the scan with eight explicit absolute paths.
- **Files modified:** `evidence/checksums.txt`
- **Verification:** The scan passed, the manifest has eight sorted entries, and every checksum verifies.
- **Committed in:** Planning metadata commit deferred to the orchestrator.

---

**Total deviations:** 4 auto-fixed Rule 3 blockers.
**Impact on plan:** Immutable source, public identities, behavior, evidence boundaries, and cleanup guarantees remain exact.

## Issues Encountered

Kubernetes emitted its existing TokenRequest advisory, and immutable FastAPI
Stage 2 emitted its accepted restricted-policy dry-run advisory. Authentication,
validation, Jobs, public behavior, evidence, publication, and cleanup passed.

## User Setup Required

None - existing authenticated GitHub and Sealos contexts completed publication
and runtime replay, and every temporary resource was removed.

## TDD Gate Compliance

- Plan 25-05 changed no application source and preserved every retained RED/GREEN pair.
- Django accepted history remains exactly 24 subjects and 32 tracked files.
- Immutable FastAPI and public Django gates exercise the accumulated real-collaborator suites.
- TDD-02, TDD-03, and DJAN-02 remain pending until independent phase verification.

## Next Phase Readiness

- Phase 25 has 5/5 plans executed and is ready for independent verification.
- Phase 26 can consume protected Django Stage 2, its PostgreSQL migration/readiness seam, and verified public replay evidence.
- Public Stage 1 and Stage 2 identities are stable, and the practice footprint is empty.

## Self-Check: PASSED

- Public main, both annotated tags, GitHub tag metadata, and ruleset fields read back exactly after replay.
- Local, no-local, and public source have 24 subjects, 32 files, the immutable migration hash, clean lock/export, and clean Git status.
- Eight evidence inputs pass scoped credential scanning and verify against `checksums.txt`.
- Final `--assert-clean-all` reports zero Django/FastAPI inventory, processes, browsers, and paths.

---
*Phase: 25-django-postgresql-stage*
*Completed: 2026-07-16*
