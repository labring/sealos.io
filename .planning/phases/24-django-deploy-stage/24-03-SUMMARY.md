---
phase: 24-django-deploy-stage
plan: "03"
subsystem: django-stage-1-board
tags: [django, sqlite, model-form, server-rendered-html, tdd]

requires:
  - phase: 24-django-deploy-stage
    plan: "02"
    provides: Django project scaffold and public health RED/GREEN tracer
provides:
  - Ordered Task model with a committed and replayable initial migration
  - Public server-rendered Task Board with CSRF-bearing title form and empty state
  - Single local responsive stylesheet with a script-free frontend asset boundary
affects: [24-04, 24-05, django-postgresql-stage]

tech-stack:
  added: []
  patterns: [Django ModelForm field allowlist, model-owned stable ordering, app-namespaced templates and static assets]

key-files:
  created:
    - /Users/longnv/bin/repo/sealos-django-tutorial/tasks/forms.py
    - /Users/longnv/bin/repo/sealos-django-tutorial/tasks/migrations/0001_initial.py
    - /Users/longnv/bin/repo/sealos-django-tutorial/tasks/static/tasks/styles.css
    - /Users/longnv/bin/repo/sealos-django-tutorial/tasks/templates/tasks/board.html
  modified:
    - /Users/longnv/bin/repo/sealos-django-tutorial/tasks/models.py
    - /Users/longnv/bin/repo/sealos-django-tutorial/tasks/urls.py
    - /Users/longnv/bin/repo/sealos-django-tutorial/tasks/views.py
    - /Users/longnv/bin/repo/sealos-django-tutorial/tests/test_public_http.py

key-decisions:
  - "Use Task Meta ordering by the unique integer ID so every rendered read has stable creation order."
  - "Keep the Stage 1 board server-rendered with one local stylesheet, Django autoescaping, and zero script assets."
  - "Expose only title through TaskForm while the model supplies the incomplete-task default."

patterns-established:
  - "Schema ownership: commit the generated initial migration beside the model and prove replay against a deleted SQLite database."
  - "Rendered read seam: observe board copy, CSRF markup, task count, empty state, and asset boundaries through public GET /."

requirements-completed: [DJAN-01]

coverage:
  - id: D1
    description: "GET / renders the accessible empty Task Board with title form, CSRF field, zero-count state, and no scripts."
    requirement: DJAN-01
    verification:
      - kind: integration
        ref: "tests/test_public_http.py#test_empty_task_board_is_rendered"
        status: pass
      - kind: other
        ref: "0b56050 RED -> c747493 GREEN direct ancestry"
        status: pass
    human_judgment: false
  - id: D2
    description: "The Task schema has a generated initial migration, required 200-character title, incomplete default, and stable ID ordering."
    requirement: DJAN-01
    verification:
      - kind: integration
        ref: "fresh manage.py migrate plus showmigrations tasks and makemigrations --check --dry-run"
        status: pass
    human_judgment: false
  - id: D3
    description: "The board uses normal Django template interpolation and one app-namespaced local stylesheet as its complete frontend asset set."
    requirement: DJAN-01
    verification:
      - kind: integration
        ref: "tests/test_public_http.py asset assertions plus source scan for safe filters, scripts, and remote URLs"
        status: pass
    human_judgment: false

duration: 7 min
completed: 2026-07-16
status: complete
---

# Phase 24 Plan 03: Django Empty Task Board Summary

**An ordered SQLite-backed Task model now feeds an accessible server-rendered board through a title-only ModelForm and one local stylesheet**

## Performance

- **Duration:** 7 min
- **Started:** 2026-07-15T21:00:39Z
- **Completed:** 2026-07-15T21:07:00Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments

- Retained an empty-board public HTTP test that first failed on the real missing root route while the existing health tracer stayed green.
- Added the ordered `Task` model, title-only `TaskForm`, generated `tasks.0001_initial` migration, and complete board read path.
- Rendered the board with fixed accessible copy, CSRF markup, semantic task list, autoescaped titles, responsive local CSS, and zero scripts.

## Task Commits

Each task was committed atomically:

1. **Task 1 RED: Specify the empty Task Board** - `0b56050` (`test`)
2. **Task 2 GREEN: Render the empty Task Board** - `c747493` (`feat`)

## Files Created/Modified

- `/Users/longnv/bin/repo/sealos-django-tutorial/tasks/models.py` - Defines the ordered Task schema and incomplete default.
- `/Users/longnv/bin/repo/sealos-django-tutorial/tasks/migrations/0001_initial.py` - Replays the Stage 1 schema on fresh SQLite.
- `/Users/longnv/bin/repo/sealos-django-tutorial/tasks/forms.py` - Restricts public model input to the title field.
- `/Users/longnv/bin/repo/sealos-django-tutorial/tasks/views.py` - Renders the board from an unbound form and ordered task queryset.
- `/Users/longnv/bin/repo/sealos-django-tutorial/tasks/urls.py` - Names the public root board route while preserving health.
- `/Users/longnv/bin/repo/sealos-django-tutorial/tasks/templates/tasks/board.html` - Owns the accessible server-rendered form, count, list, and empty state.
- `/Users/longnv/bin/repo/sealos-django-tutorial/tasks/static/tasks/styles.css` - Provides responsive work-focused presentation and visible focus states.
- `/Users/longnv/bin/repo/sealos-django-tutorial/tests/test_public_http.py` - Adds the second confirmed public behavior seam.

## Decisions Made

- Used `Meta.ordering = ['id']` because the unique generated primary key provides deterministic Stage 1 creation order without another field.
- Kept all task-title interpolation inside Django's default autoescaping and loaded only the app-namespaced stylesheet.
- Kept the form writable surface to `title`; `completed=False` remains model-owned.

## Deviations from Plan

None - plan executed exactly as written.

## TDD Gate Compliance

- RED commit `0b56050` contains only `test_empty_task_board_is_rendered` and fails after successful Django loading because `GET /` returns 404.
- GREEN commit `c747493` is RED's direct child and adds only the planned schema, form, route, view, template, stylesheet, and generated migration.
- The named node, accumulated two-test public suite, system check, fresh migration, migration readback, and drift check pass at GREEN.

## Issues Encountered

- A temporary requirements export embedded its temporary destination in the generated comment header. The final gate used the plan's exact in-place export and confirmed zero diff in `requirements.txt` and `uv.lock`.

## User Setup Required

None - no external service configuration required.

## Known Stubs

- `tasks/templates/tasks/board.html` posts to the locked `/tasks/` contract while that mutation route remains intentionally pending for Plan 24-04. The complete Plan 24-03 read surface is functional.

## Next Phase Readiness

- Commit `c747493` is the clean schema-and-board parent for three sequential Plan 24-04 RED/GREEN behavior slices.
- The rendered list already reads ordered tasks and exposes the `Open` state required by the later public creation readback.
- `DJAN-01` remains pending until all five Phase 24 plans and phase-level verification pass.

## Self-Check: PASSED

- All eight created or modified source paths exist, and the implementation repository is clean with `db.sqlite3` absent.
- Commits `0b56050` and `c747493` exist with the exact required subjects and direct ancestry.
- Two public tests, Django system checks, fresh migration replay, `tasks.0001_initial` readback, migration drift, dependency lock/export, and template security scans pass.

---
*Phase: 24-django-deploy-stage*
*Completed: 2026-07-16*
