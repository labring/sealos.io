---
phase: 24-django-deploy-stage
plan: "05"
subsystem: django-stage-1-publication
tags: [django, github, annotated-tag, ruleset, agent-browser, public-replay]

requires:
  - phase: 24-django-deploy-stage
    plan: "04"
    provides: Five public HTTP behaviors for the rendered Task Board and native administration
provides:
  - Complete Stage 1 reader workflow for locked sync, migration, tests, runtime, public task creation, and administration
  - Public main at one locally accepted source commit
  - Protected annotated stage-1-deploy identity with exact direct and peeled objects
  - Fresh public-clone replay with explicit local and clone zero-residue cleanup
affects: [24-verification, django-postgresql-stage, practice-backed-tutorial-series]

tech-stack:
  added: []
  patterns: [accepted-source publication, annotated stage identity, exact tag ruleset, fresh public replay, owned runtime cleanup]

key-files:
  created:
    - .planning/phases/24-django-deploy-stage/24-05-SUMMARY.md
  modified:
    - /Users/longnv/bin/repo/sealos-django-tutorial/README.md

key-decisions:
  - "Freeze public main only after local lock, migration, tests, export, history, inventory, browser, and cleanup gates pass."
  - "Create one active tag ruleset before publishing the annotated Stage 1 tag."
  - "Accept the public source only after a fresh HTTPS tag clone reproduces the complete runtime and returns to zero residue."

patterns-established:
  - "Stage publication: accepted main, annotated direct tag object, peeled accepted commit, and exact active tag ruleset form one identity graph."
  - "Runtime acceptance: named agent-browser session plus owned server PID are cleaned explicitly before trap removal and independent zero-state readback."

requirements-completed: []

coverage:
  - id: D1
    description: "The Stage 1 README reproduces locked setup, SQLite migration, five public behaviors, port-8000 runtime, task creation, board readback, and administration login."
    requirement: DJAN-01
    verification:
      - kind: integration
        ref: "local acceptance: uv lock, migrate, drift, pytest, export, HTTP, and terminal CSRF workflow"
        status: pass
      - kind: automated_ui
        ref: "agent-browser session phase24-local-acceptance: create Verify browser workflow, observe 1 task, open admin login"
        status: pass
    human_judgment: false
  - id: D2
    description: "Public main and protected stage-1-deploy resolve to the exact accepted source and annotated tag metadata."
    requirement: DJAN-01
    verification:
      - kind: other
        ref: "GitHub API and git ls-remote exact owner, visibility, default, main, ruleset, direct object, peeled commit, type, and message readback"
        status: pass
    human_judgment: false
  - id: D3
    description: "A fresh public tag clone reproduces the exact history, inventory, lock, migration, tests, runtime, rendered workflow, and explicit cleanup contract."
    requirement: DJAN-01
    verification:
      - kind: integration
        ref: "fresh HTTPS stage-1-deploy clone: exact 13 subjects, 24 files, locked sync, migration, 5 tests, and clean export"
        status: pass
      - kind: automated_ui
        ref: "agent-browser session phase24-public-replay: create Replay public stage, observe 1 task, open admin login"
        status: pass
      - kind: other
        ref: "post-replay PID, port, sessions, temp paths, databases, source status, and final GitHub identity readback"
        status: pass
    human_judgment: false

duration: 8 min
completed: 2026-07-16
status: complete
---

# Phase 24 Plan 05: Django Stage 1 Publication Summary

**A documented Django Task Board now reproduces from one protected public Stage 1 identity through local and fresh-clone browser acceptance with complete cleanup**

## Performance

- **Duration:** 8 min
- **Started:** 2026-07-15T21:26:04Z
- **Completed:** 2026-07-15T21:34:22Z
- **Tasks:** 3
- **Files modified:** 4

## Accomplishments

- Added the complete reader sequence from immutable clone and locked sync through SQLite migration, five public behavior tests, runtime export, port-8000 execution, CSRF task creation, board readback, administration login, and database reset.
- Published `yangchuansheng/sealos-django-tutorial` as a public repository whose default `main` points to accepted commit `ca115bf21b599c14e667b336bd78e3c587c24208`.
- Published protected annotated `stage-1-deploy`, replayed the exact source through a fresh public HTTPS clone, and proved all owned runtime residue absent after explicit cleanup.

## Task Commits

1. **Task 1: Document and accept the local reader workflow** - `ca115bf` (`docs`)
2. **Task 2: Publish and protect the accepted Stage 1 identity** - External GitHub repository, ruleset, and tag transition verified by exact readback.
3. **Task 3: Replay the public tag, clean explicitly, and read back final state** - Verification evidence retained in this summary.

## Files Created/Modified

- `/Users/longnv/bin/repo/sealos-django-tutorial/README.md` - Documents the immutable Stage 1 reader workflow and later-stage boundaries.
- `.planning/phases/24-django-deploy-stage/24-05-SUMMARY.md` - Retains redacted local acceptance, publication, public replay, identity, and cleanup evidence.
- `.planning/STATE.md` - Records Plan 24-05 execution progress and session continuity.
- `.planning/ROADMAP.md` - Records five executed Phase 24 plans.

## Accepted Identity

| Field | Accepted value |
|-------|----------------|
| Repository | `yangchuansheng/sealos-django-tutorial` |
| Visibility | Public |
| Default branch | `main` |
| Main commit | `ca115bf21b599c14e667b336bd78e3c587c24208` |
| Tag | `refs/tags/stage-1-deploy` |
| Tag type | `tag` |
| Tag message | `Django deploy stage` |
| Direct tag object | `0d9254d37914976898039ff3c55f94399aa1d7c0` |
| Peeled source commit | `ca115bf21b599c14e667b336bd78e3c587c24208` |
| Ruleset | `Protect tutorial stage tags` (`19014157`) |
| Ruleset target | Active tag target for `refs/tags/stage-*` |
| Rules | Exactly `update` and `deletion`, with empty bypass and exclude lists |

## Local Acceptance Evidence

- `uv sync --locked` and `uv lock --check` passed from a clean source database state.
- All framework migrations plus `tasks.0001_initial` applied; `showmigrations` returned `[X] 0001_initial`; the drift check returned `No changes detected`.
- The complete public seam returned `5 passed in 0.09s`.
- The runtime-only export reproduced `requirements.txt` with an empty Git diff.
- The exact ordered 13-subject history and exact 24-file tracked inventory passed.
- Exact health JSON, rendered board, and native administration login passed through HTTP.
- `phase24-local-acceptance` created `Verify browser workflow`, observed `1 task`, and opened the Django administration login through the real CSRF middleware.
- The README terminal CSRF flow created `Verify the Django tutorial` through `POST /tasks/` and found it on a later public board read.

## Publication Evidence

- Read-only preflight confirmed the GitHub repository and local origin were absent before creation.
- Public repository creation pushed only accepted `main`, then owner, visibility, default branch, and remote main read back exactly.
- One complete active ruleset payload was created and read back with tag target, `refs/tags/stage-*`, empty bypass/exclude lists, and exactly update/deletion rules.
- The logical `stage-1-deploy` ref was pushed once after local annotated type, message, direct object, and peeled commit checks passed.
- Final local, remote direct, and remote peeled identities match the accepted graph above.

## Public Replay Evidence

- A fresh HTTPS clone of `stage-1-deploy` resolved to accepted main and retained annotated type plus message.
- The clone reproduced the exact 13 ordered subjects and 24 tracked files.
- Locked sync, lock check, fresh migration, migration readback, drift check, five tests, and runtime export all passed with clean clone status.
- `phase24-public-replay` created `Replay public stage`, observed `1 task`, and opened the Django administration login on the owned clone server.
- The clone suite returned `5 passed in 0.13s`.

## Cleanup Evidence

- Local and clone cleanup functions ran explicitly in the same shell scope as each PID, named browser session, database, log, response directory, and temporary root; each trap was removed afterward.
- Both owned runserver PIDs stopped and port 8000 returned clear.
- Successful session-list readbacks contain neither `phase24-local-acceptance` nor `phase24-public-replay`.
- Local and clone temporary roots, logs, response directories, cookie file, clone tree, and both SQLite paths are absent.
- The source repository has empty tracked and untracked status.
- An independent final zero-residue audit passed after public replay.

## Decisions Made

- Froze `ACCEPTED_HEAD` after the complete local source and browser gate so public main represents one reader-reproducible identity.
- Installed exact tag protection before creating the logical stage ref so later update and deletion attempts are governed immediately.
- Used public HTTPS clone replay as the final source acceptance boundary and repeated platform identity readback after cleanup.

## Deviations from Plan

Execution matched the plan exactly.

## Issues Encountered

- The first read-only GitHub preflight used zsh's reserved `status` variable and exited before mutation. The repeated probe used `gh_exit`, confirmed HTTP 404 repository absence, and left no temporary files.
- Git emitted the expected annotated-tag checkout warning during `git clone --branch`; clone HEAD, local tag type, direct object, and peeled commit all passed their explicit assertions.

## Authentication Gates

The existing GitHub CLI session was authenticated as `yangchuansheng`; publication required no authentication gate.

## Known Stubs

The README stub scan passed with no placeholder or deferred implementation text inside the Stage 1 contract.

## Security Review

- The public inventory contains exactly the 24 allowlisted files and no credential-bearing or runtime-generated files.
- Public form acceptance traversed Django CSRF middleware, while administration remained behind Django's native login boundary.
- Publication checks bound repository ownership, visibility, canonical origin, main, ruleset, annotated metadata, and peeled source before and after the public replay.
- Logs and response files stayed inside removed temporary roots; retained evidence contains source and platform identities only.

## User Setup Required

No external service configuration remains for the accepted Stage 1 reader workflow.

## Next Phase Readiness

- Public `stage-1-deploy` is ready for independent Phase 24 verification and Phase 25 PostgreSQL evolution.
- The Task model, initial migration, rendered public seam, and protected source identity are stable inputs for psycopg 3 and the one-shot Django migration Job.
- `DJAN-01` remains pending until the independent phase verifier records its result.

## Self-Check: PASSED

- README commit `ca115bf`, accepted main, annotated tag object, peeled commit,
  exact 13-subject history, exact 24-file inventory, and clean source status all
  exist and match the recorded identities.
- Coverage classification accepted all three deliverables with passing
  automated evidence and no schema errors.

---
*Phase: 24-django-deploy-stage*
*Completed: 2026-07-16*
