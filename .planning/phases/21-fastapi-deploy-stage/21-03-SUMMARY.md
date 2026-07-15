---
phase: 21-fastapi-deploy-stage
plan: 03
subsystem: release
tags: [fastapi, github, annotated-tag, ruleset, uv, public-clone]

requires:
  - phase: 21-fastapi-deploy-stage
    plan: 01
    provides: Locked FastAPI foundation, health, Swagger UI, and initial RED/GREEN history
  - phase: 21-fastapi-deploy-stage
    plan: 02
    provides: Complete process-local task CRUD and the final 12-case public HTTP suite
provides:
  - Reader-facing Stage 1 setup, test, run, CRUD, and lifecycle documentation
  - Public FastAPI reference repository with accepted main history
  - Protected annotated stage-1-deploy source identity
  - Independent locked public-clone acceptance evidence
affects: [22-fastapi-postgresql-stage, 23-fastapi-production-stage, 27-practice-backed-tutorial-series]

tech-stack:
  added: []
  patterns:
    - Fail-closed public repository and tag recovery
    - Annotated tag object plus peeled commit verification
    - Complete GitHub ruleset payload with exact readback
    - Fresh public clone acceptance from the immutable stage tag

key-files:
  created:
    - /Users/longnv/bin/repo/sealos-fastapi-tutorial/README.md
    - .planning/phases/21-fastapi-deploy-stage/21-03-SUMMARY.md
  modified:
    - .planning/STATE.md
    - .planning/ROADMAP.md

key-decisions:
  - "Publish only the locally accepted README commit after the full lock, history, inventory, export, and owned-port smoke gate passes."
  - "Protect every refs/tags/stage-* tag with one active update-and-deletion ruleset before accepting the stage identity."
  - "Treat the annotated tag object SHA and peeled commit SHA as separate required identities during local, remote, and public-clone validation."

patterns-established:
  - "Publication recovery: accept an existing repository, ruleset, or tag only after every owner, visibility, branch, payload, object type, and SHA field matches."
  - "Reader release gate: verify a fresh public tag clone with uv sync --locked, the complete behavior suite, exact history, regenerated export, and exact inventory."

requirements-completed: [FAST-01]

coverage:
  - id: D1
    description: "Readers can reproduce the immutable Stage 1 setup, tests, Uvicorn runtime, task CRUD, and process-local lifecycle from README.md."
    requirement: FAST-01
    verification:
      - kind: integration
        ref: "README contract scan plus local uv sync --locked, pytest, export, inventory, and port-8000 smoke gate"
        status: pass
    human_judgment: false
  - id: D2
    description: "The public repository main branch and annotated stage-1-deploy tag resolve to the accepted Stage 1 source."
    requirement: FAST-01
    verification:
      - kind: integration
        ref: "gh repo view and git ls-remote direct/peeled SHA acceptance"
        status: pass
    human_judgment: false
  - id: D3
    description: "Exactly one active GitHub ruleset protects refs/tags/stage-* from update and deletion with no bypass actors."
    requirement: FAST-01
    verification:
      - kind: integration
        ref: "GitHub repository rulesets API readback for ruleset 18970425"
        status: pass
    human_judgment: false
  - id: D4
    description: "A fresh public tag clone installs from uv.lock and passes 12 cases from nine named behavior functions with exact export, history, and inventory."
    requirement: FAST-01
    verification:
      - kind: e2e
        ref: "public git clone --branch stage-1-deploy followed by locked install and full acceptance script"
        status: pass
    human_judgment: false

duration: 7 min
completed: 2026-07-15
status: complete
---

# Phase 21 Plan 03: FastAPI Stage 1 Publication Summary

**Public Tasks API Stage 1 with reproducible reader commands, a protected annotated source tag, and clean-clone proof of the complete 12-case HTTP contract**

## Performance

- **Duration:** 7 min
- **Started:** 2026-07-15T05:49:59Z
- **Completed:** 2026-07-15T05:57:15Z
- **Tasks:** 2
- **Files modified:** 4 across the implementation and planning repositories

## Accomplishments

- Published English reader documentation covering Python 3.12, immutable source cloning, locked installation, all tests, Uvicorn on `0.0.0.0:8000`, every CRUD operation, and the process-local reset lifecycle.
- Published `https://github.com/yangchuansheng/sealos-fastapi-tutorial` as a public repository whose `main` branch resolves to accepted commit `276aa00e4d5bb7a0d5e375fee530cde3240b2ce8`.
- Created annotated `stage-1-deploy` object `77e57a281ecc087041b54273c1bfc63b66f13d1a`, peeled to the accepted commit, under active ruleset `18970425` for update and deletion protection.
- Proved the public tag from a fresh clone with a locked install, 12 passing cases from nine named functions, the exact 18-subject RED/GREEN history, a zero-diff runtime export, and the exact nine-file inventory.

## Acceptance Evidence

| Gate | Result |
|------|--------|
| Local suite | `12 passed, 1 warning in 0.45s` from nine named functions |
| TDD history | Exact 18 RED/GREEN subjects in required order |
| Runtime export | `uv export --locked --no-dev --no-emit-project --no-hashes` produced zero diff |
| Local runtime | Owned port 8000 returned `{"status":"ok"}` and Swagger UI HTML; trap stopped the child |
| Source inventory | Exactly nine tracked Stage 1 files |
| Public repository | Public, owned by `yangchuansheng`, default branch `main` |
| Remote main | `276aa00e4d5bb7a0d5e375fee530cde3240b2ce8` |
| Annotated tag object | `77e57a281ecc087041b54273c1bfc63b66f13d1a` |
| Peeled tag commit | `276aa00e4d5bb7a0d5e375fee530cde3240b2ce8` |
| Tag protection | Active ruleset `18970425`, `refs/tags/stage-*`, update and deletion, empty bypass list |
| Public clone | `12 passed, 1 warning in 1.54s`; exact history, export, and inventory passed |

## Task Commits

1. **Task 1: Document and accept the local Stage 1 reader workflow** - `276aa00` (`docs`)
2. **Task 2: Publish, protect, and clean-clone the immutable Stage 1 source** - external GitHub repository, tag, and ruleset state anchored to `276aa00`

## Files Created/Modified

- `/Users/longnv/bin/repo/sealos-fastapi-tutorial/README.md` - Reproducible Stage 1 reader workflow and source-stage lifecycle.
- `.planning/phases/21-fastapi-deploy-stage/21-03-SUMMARY.md` - Local, GitHub, tag, ruleset, and public-clone evidence.
- `.planning/STATE.md` - Phase completion position, metric, decisions, and session state.
- `.planning/ROADMAP.md` - Phase 21 plan progress and completion state.

## Decisions Made

- Kept `main` and the annotated tag on the same fully accepted README commit so Stage 1 has one reader-visible source identity.
- Created the complete active ruleset payload before accepting the tag and required exact API readback with one named ruleset.
- Validated both tag SHAs because the direct SHA proves the signed metadata object identity and the peeled SHA proves the source commit identity.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Replaced a zsh-reserved preflight variable**
- **Found during:** Task 2 repository preflight
- **Issue:** The login shell rejected assignment to the read-only zsh variable `status` before any GitHub mutation.
- **Fix:** Reran the read-only preflight under Bash with a portable `rc` variable.
- **Files modified:** None
- **Verification:** The repository absence, authenticated owner, missing origin, and missing local tag were all read back successfully.
- **Committed in:** No source commit; execution-only portability fix.

**2. [Rule 3 - Blocking] Replaced Bash 4-only ruleset array handling**
- **Found during:** Task 2 ruleset creation
- **Issue:** macOS Bash 3.2 does not provide `mapfile`, so the ruleset count gate stopped before mutation.
- **Fix:** Counted and selected exact-name ruleset IDs with `sed` and `wc`, preserving the zero/one/duplicate fail-closed contract.
- **Files modified:** None
- **Verification:** One active ruleset was created and its complete payload was read back as ID `18970425`.
- **Committed in:** No source commit; execution-only portability fix.

---

**Total deviations:** 2 auto-fixed blocking portability issues.
**Impact on plan:** Both fixes occurred before the corresponding external mutation and preserved the exact fail-closed acceptance contract.

## Authentication Gates

None. GitHub CLI was already authenticated as `yangchuansheng` with repository scope.

## Issues Encountered

- FastAPI 0.139.0 continues to emit the known Starlette TestClient deprecation warning for HTTPX 0.28.1. The exact approved dependency set remains locked, and every local and public-clone case passes.
- Git reports that the annotated tag object itself is not a commit during `git clone --branch`; it then peels the tag to the accepted commit as designed. Direct and peeled SHAs were verified separately.

## Known Stubs

None. The process-local store and future-stage references are the explicit Stage 1 lifecycle contract.

## User Setup Required

None. The public repository and protected source tag are already available.

## Next Phase Readiness

- Phase 22 can evolve `main` from accepted Stage 1 into SQLAlchemy, Alembic, psycopg, and PostgreSQL-backed persistence while the protected Stage 1 tag remains fixed.
- The public URL, source commit, tag object, peeled commit, and ruleset ID are available for later tutorial and evidence phases.

## Self-Check: PASSED

- The README, implementation commit, summary, public repository, annotated tag object, peeled commit, and ruleset all resolve.
- The structured coverage classifier accepted all four deliverables as fully automated passing evidence.
- The implementation repository is clean and port 8000 has no remaining listener.

---
*Phase: 21-fastapi-deploy-stage*
*Completed: 2026-07-15*
