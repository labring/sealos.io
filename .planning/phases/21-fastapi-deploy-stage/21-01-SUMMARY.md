---
phase: 21-fastapi-deploy-stage
plan: 01
subsystem: api
tags: [fastapi, python-3.12, uv, pytest, httpx, swagger]

requires:
  - phase: milestone-initialization
    provides: Confirmed FastAPI public HTTP seam and reference repository contract
provides:
  - Reproducible Python 3.12 FastAPI foundation with a locked runtime export
  - Public health endpoint verified through a fresh TestClient
  - Framework-generated Swagger UI verified through a fresh TestClient
affects: [21-02, 21-03, fastapi-postgresql-stage]

tech-stack:
  added: [FastAPI 0.139.0, Pydantic 2.13.4, Uvicorn 0.51.0, HTTPX 0.28.1, pytest 9.1.1]
  patterns: [application factory, function-scoped TestClient, exact uv runtime export]

key-files:
  created:
    - /Users/longnv/bin/repo/sealos-fastapi-tutorial/pyproject.toml
    - /Users/longnv/bin/repo/sealos-fastapi-tutorial/uv.lock
    - /Users/longnv/bin/repo/sealos-fastapi-tutorial/requirements.txt
    - /Users/longnv/bin/repo/sealos-fastapi-tutorial/app/main.py
    - /Users/longnv/bin/repo/sealos-fastapi-tutorial/tests/test_api.py
  modified: []

key-decisions:
  - "Create a fresh application with create_app() for every public HTTP test."
  - "Verify exact PyPI versions and official repositories before generating uv.lock."
  - "Declare the repository root as pytest's import path for the intentionally uninstalled Stage 1 application."

patterns-established:
  - "Public HTTP tracer: add one failing TestClient behavior, then the minimum route or framework configuration that passes it."
  - "Dependency gate: audit exact registry metadata before locking and derive the runtime-only export from uv.lock."

requirements-completed: [FAST-01]

coverage:
  - id: D1
    description: "Python 3.12 dependencies are exactly locked and reproducibly exported without development dependencies."
    requirement: FAST-01
    verification:
      - kind: integration
        ref: "uv lock --check && uv tree --locked --depth 1 && uv sync --locked && uv export --locked --no-dev --no-emit-project --no-hashes"
        status: pass
    human_judgment: false
  - id: D2
    description: "GET /health returns 200 with the exact public health payload."
    requirement: FAST-01
    verification:
      - kind: integration
        ref: "tests/test_api.py#test_health_is_public"
        status: pass
    human_judgment: false
  - id: D3
    description: "GET /docs serves FastAPI-generated Swagger UI HTML."
    requirement: FAST-01
    verification:
      - kind: integration
        ref: "tests/test_api.py#test_swagger_ui_is_public"
        status: pass
    human_judgment: false

duration: 9 min
completed: 2026-07-15
status: complete
---

# Phase 21 Plan 01: FastAPI Foundation, Health, and Swagger Summary

**Locked Python 3.12 FastAPI foundation with independently retained health and Swagger RED/GREEN evidence at the public HTTP seam**

## Performance

- **Duration:** 9 min
- **Started:** 2026-07-15T04:59:16Z
- **Completed:** 2026-07-15T05:08:37Z
- **Tasks:** 3
- **Files modified:** 8

## Accomplishments

- Audited all five exact direct packages against PyPI metadata and their official repositories before generating the lock.
- Committed a reproducible Python 3.12 environment with a runtime-only `requirements.txt` export that excludes HTTPX and pytest.
- Delivered `/health` and FastAPI-generated `/docs` through two independent public HTTP RED/GREEN slices.

## TDD Evidence

| Slice | RED evidence | GREEN evidence | Review |
|-------|--------------|----------------|--------|
| Health | `404 == 200` in `test_health_is_public` | `1 passed` with exact `{"status": "ok"}` | Minimal route retained; no refactor commit required. |
| Swagger UI | `404 == 200` in `test_swagger_ui_is_public` | `1 passed` with HTML content type and `Swagger UI` marker | Native FastAPI generation retained; no refactor commit required. |

## Package Audit

| Package | Version | Official repository | Result |
|---------|---------|---------------------|--------|
| FastAPI | 0.139.0 | `https://github.com/fastapi/fastapi` | Passed |
| Pydantic | 2.13.4 | `https://github.com/pydantic/pydantic` | Passed |
| Uvicorn | 0.51.0 | `https://github.com/Kludex/uvicorn` | Passed |
| HTTPX | 0.28.1 | `https://github.com/encode/httpx` | Passed |
| pytest | 9.1.1 | `https://github.com/pytest-dev/pytest` | Passed |

## Task Commits

1. **Task 1: Initialize the approved repository and reproducible test seam** - `a63b15f` (`chore`)
2. **Task 2 RED: Specify public health** - `b37010b` (`test`)
3. **Task 2 GREEN: Add public health endpoint** - `e29425b` (`feat`)
4. **Task 3 RED: Specify generated Swagger UI** - `eee4f35` (`test`)
5. **Task 3 GREEN: Enable generated Swagger UI** - `1445011` (`feat`)

## Files Created/Modified

- `.gitignore` - Ignores Python, pytest, coverage, virtual environment, and macOS generated files.
- `.python-version` - Selects Python 3.12.
- `pyproject.toml` - Pins runtime and development dependencies and configures pytest.
- `uv.lock` - Records the exact Python 3.12 dependency graph.
- `requirements.txt` - Exports exact runtime-only compatibility dependencies.
- `app/__init__.py` - Defines the Tasks API package boundary.
- `app/main.py` - Exports `create_app`, the Uvicorn `app`, health, and generated docs.
- `tests/test_api.py` - Verifies health and Swagger UI through fresh TestClient instances.

## Decisions Made

- Kept the Stage 1 application uninstalled and declared `pythonpath = ["."]` in pytest configuration so tests import the public application module directly from the repository.
- Enabled FastAPI's native OpenAPI and Swagger surfaces with the `Tasks API` title and `0.1.0` version.
- Preserved `/tasks` as a 404 stage boundary for Plan 21-02.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Configured pytest's repository import path**
- **Found during:** Task 2 RED
- **Issue:** The first focused run stopped during collection with `ModuleNotFoundError: No module named 'app'`, so the test had not reached the required HTTP failure.
- **Fix:** Added `pythonpath = ["."]` to the existing pytest configuration and reran the same test until RED failed on the observed 404 response.
- **Files modified:** `pyproject.toml`
- **Verification:** `test_health_is_public` failed with `assert 404 == 200`, then passed after the health route was added.
- **Committed in:** `b37010b`

---

**Total deviations:** 1 auto-fixed blocking issue.
**Impact on plan:** The fix makes the intended public HTTP seam reachable while preserving the compact source layout.

## Issues Encountered

- FastAPI 0.139.0 emits Starlette's upstream TestClient deprecation warning for HTTPX 0.28.1. The approved exact dependency set remains locked, and both public behavior tests pass.

## User Setup Required

None - no external service configuration is required for this local stage.

## TDD Gate Compliance

- Health: `b37010b` RED precedes `e29425b` GREEN.
- Swagger UI: `eee4f35` RED precedes `1445011` GREEN.
- Both RED runs failed for the specified 404 reason and both GREEN runs passed.

## Next Phase Readiness

- Plan 21-02 can extend the fresh application factory with in-memory task CRUD one public HTTP behavior at a time.
- PostgreSQL, migrations, containers, publication, tutorial prose, and screenshots remain outside this plan's tracked inventory.

## Self-Check: PASSED

- All eight tracked application files exist.
- All five application commits exist in the implementation repository.
- The full two-test suite, lock check, runtime export diff, import check, `/tasks` stage fence, and exact commit-order gate pass.

---
*Phase: 21-fastapi-deploy-stage*
*Completed: 2026-07-15*
