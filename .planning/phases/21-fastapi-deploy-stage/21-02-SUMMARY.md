---
phase: 21-fastapi-deploy-stage
plan: 02
subsystem: api
tags: [fastapi, pydantic, pytest, testclient, crud, tdd]

requires:
  - phase: 21-fastapi-deploy-stage
    plan: 01
    provides: Locked FastAPI foundation, application factory, health, and Swagger UI
provides:
  - Complete process-local Tasks API CRUD through public JSON HTTP
  - Bounded task titles with framework-native 422 responses
  - Stable missing-item responses across GET, PUT, and DELETE
  - Seven independently retained RED then GREEN tracer histories
affects: [21-03, 22-fastapi-postgresql-stage, fastapi-tutorial-content]

tech-stack:
  added: []
  patterns:
    - Factory-local in-memory state with deterministic integer IDs
    - Public HTTP setup and verification through fresh TestClient instances
    - Shared request constraints and centralized missing-item lookup

key-files:
  created: []
  modified:
    - /Users/longnv/bin/repo/sealos-fastapi-tutorial/app/main.py
    - /Users/longnv/bin/repo/sealos-fastapi-tutorial/tests/test_api.py

key-decisions:
  - "Keep the dictionary and ID counter inside create_app() so every fresh application starts empty at ID 1."
  - "Use complete PUT replacement with a retained integer ID and verify persistence through a later public GET."
  - "Centralize unknown-ID resolution so GET, PUT, and DELETE expose the same stable error body."

patterns-established:
  - "CRUD tracer: create prerequisites through HTTP, observe one missing method, then add only that public route."
  - "Mutation proof: verify updates and deletion through later HTTP reads instead of internal state inspection."

requirements-completed: [FAST-01]

coverage:
  - id: D1
    description: "Readers can create, list, fetch, update, and delete deterministic in-memory tasks through JSON HTTP."
    requirement: FAST-01
    verification:
      - kind: integration
        ref: "tests/test_api.py#test_create_task, test_list_tasks, test_get_task, test_update_task, test_delete_task"
        status: pass
    human_judgment: false
  - id: D2
    description: "Invalid titles receive 422 and every unknown item operation receives the stable 404 body."
    requirement: FAST-01
    verification:
      - kind: integration
        ref: "tests/test_api.py#test_reject_invalid_task and test_missing_task_returns_404"
        status: pass
    human_judgment: false
  - id: D3
    description: "Nine named public behavior functions collect and pass as 12 cases with seven ordered RED/GREEN histories."
    requirement: FAST-01
    verification:
      - kind: integration
        ref: "uv run pytest tests/test_api.py -q -x plus exact git subject-order gate"
        status: pass
    human_judgment: false

duration: 15 min
completed: 2026-07-15
status: complete
---

# Phase 21 Plan 02: Public Tasks CRUD Lifecycle Summary

**Typed process-local task CRUD with bounded input, stable errors, and seven public HTTP tracer histories**

## Performance

- **Duration:** 15 min
- **Started:** 2026-07-15T05:22:06Z
- **Completed:** 2026-07-15T05:36:54Z
- **Tasks:** 3
- **Files modified:** 2 application files

## Accomplishments

- Delivered create, ascending-ID list, item retrieval, complete replacement, and empty-204 deletion through public JSON HTTP.
- Applied the same 1..200-character title contract to create and update models and exposed native FastAPI 422 responses.
- Unified GET, valid PUT, and DELETE missing-item responses as `{"detail":"Task not found"}`.
- Preserved seven exact RED then GREEN commit pairs with fresh application state and real FastAPI collaborators.

## TDD Evidence

| Slice | RED evidence | GREEN evidence | Review |
|-------|--------------|----------------|--------|
| Create | POST returned 404 | POST returned 201 with ID 1 and default `completed=false` | Minimal model, store, counter, and route retained. |
| List | GET collection returned 405 | GET returned the exact created representation | Explicit ascending integer-ID order retained. |
| Item retrieval | GET for the returned existing ID returned 404 | GET returned the exact created representation | Generic unknown-item 404 retained for the later error slice. |
| Update | PUT returned 405 | PUT returned a complete replacement and later GET matched | Factory-local mutation retained. |
| Delete | DELETE returned 405 | DELETE returned an empty 204 and later GET returned 404 | Explicit empty response retained. |
| Validation | Empty and 201-character titles returned 201 | Both title bounds returned 422 | Shared Pydantic constraints retained. |
| Missing items | Three methods returned `{"detail":"Not Found"}` | GET, PUT, and DELETE returned the stable body | Central lookup retained; no refactor commit required. |

## Task Commits

1. **Create RED** - `d4d62ad` (`test`)
2. **Create GREEN** - `0251c49` (`feat`)
3. **List RED** - `fba6263` (`test`)
4. **List GREEN** - `4f22885` (`feat`)
5. **Item retrieval RED** - `93f3666` (`test`)
6. **Item retrieval GREEN** - `4bcfb84` (`feat`)
7. **Update RED** - `2153e0c` (`test`)
8. **Update GREEN** - `59079bb` (`feat`)
9. **Delete RED** - `05541fe` (`test`)
10. **Delete GREEN** - `f48ecbf` (`feat`)
11. **Validation RED** - `09253e1` (`test`)
12. **Validation GREEN** - `d29bbb3` (`feat`)
13. **Missing-item RED** - `701952d` (`test`)
14. **Missing-item GREEN** - `4b1e096` (`feat`)

## Files Modified

- `app/main.py` - Exports typed task models, factory-local storage, CRUD routes, title constraints, and stable missing-item lookup.
- `tests/test_api.py` - Defines nine public HTTP behavior functions producing 12 collected pytest cases.

## Decisions Made

- Stored `Task` objects directly in a closure-local dictionary because process-local state is the complete Stage 1 persistence contract.
- Kept `TaskCreate` and `TaskUpdate` distinct so create can default `completed` while update remains a complete replacement.
- Used a single lookup function for all item methods to make the externally visible 404 contract mechanically consistent.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- The approved FastAPI/TestClient stack continues to emit the known Starlette HTTPX deprecation warning recorded in Plan 21-01. All 12 public behavior cases pass.

## Known Stubs

None. The empty factory-local task dictionary is the required initial Stage 1 state and is populated through public HTTP.

## User Setup Required

None - this local stage uses only the locked dependencies from Plan 21-01.

## TDD Gate Compliance

- All seven `test(21-02)` RED commits precede their matching `feat(21-02)` GREEN commits in behavior order.
- Every RED run failed on the planned public status or body mismatch.
- Every GREEN run passed its focused behavior and the accumulated suite.
- The final suite contains zero internal collaborator mocks or side-channel state reads.

## Next Phase Readiness

- Plan 21-03 can document, smoke, publish, tag, protect, and clean-clone verify this exact 12-case source stage.
- Phase 22 can replace the factory-local persistence boundary through its independently planned PostgreSQL and migration seams.

## Self-Check: PASSED

- The summary and both modified application files exist.
- All fourteen RED/GREEN commits resolve in the implementation repository.
- Nine named test functions collect as exactly 12 public HTTP cases.

---
*Phase: 21-fastapi-deploy-stage*
*Completed: 2026-07-15*
