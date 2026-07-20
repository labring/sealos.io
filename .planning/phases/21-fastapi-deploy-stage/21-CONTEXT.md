# Phase 21: FastAPI Deploy Stage - Context

**Gathered:** 2026-07-15
**Status:** Ready for planning
**Source:** Confirmed milestone context

<domain>
## Phase Boundary

Deliver the first reproducible source stage of the public FastAPI `Tasks API`
Reference Application. This phase ends when a reader can clone the stage,
install locked dependencies, start the service on port 8000, and verify the
framework-native public HTTP contract.

</domain>

<decisions>
## Implementation Decisions

### Public HTTP Contract

- **D-01:** Expose `GET /health`, FastAPI's generated `GET /docs`, and
  in-memory task CRUD.
- Model each task with an integer `id`, string `title`, and boolean `completed`.
- Support `POST /tasks`, `GET /tasks`, `GET /tasks/{task_id}`,
  `PUT /tasks/{task_id}`, and `DELETE /tasks/{task_id}` through JSON HTTP.
- Bind the local application to `0.0.0.0:8000`.

### Public Repository and Stage Identity

- **D-02:** Build the local repository at
  `/Users/longnv/bin/repo/sealos-fastapi-tutorial`.
- Publish it as `https://github.com/yangchuansheng/sealos-fastapi-tutorial`.
- Preserve the completed Phase 21 source as the immutable
  `stage-1-deploy` tag.
- Keep `main` available for the PostgreSQL and production stages that follow.

### Reproducible Python Baseline

- **D-03:** Use Python 3.12, `uv`, `pyproject.toml`, and a committed
  `uv.lock`.
- Export exact runtime versions to `requirements.txt` from the lock file.
- Include clean setup, test, run, and HTTP verification commands in README.md.

### Behavior-First Delivery

- **D-04:** Drive the service through public HTTP tests with FastAPI
  TestClient.
- Record a failing behavior test before the smallest implementation that makes
  it pass, then repeat for the next behavior.
- Keep framework collaborators real. Use a boundary substitute only when a
  focused test cannot involve the external boundary.
- Retain readable red-green evidence in the repository history and test output.

### Stage Fence

- **D-05:** Keep Phase 21 task persistence in memory.
- PostgreSQL, SQLAlchemy, Alembic, migration Jobs, production containers, and
  image publication belong to Phases 22 and 23.
- Keep the source structure ready to evolve without adding those later-stage
  concerns during this phase.

### the agent's Discretion

- Select compatible current patch releases for FastAPI, Pydantic, Uvicorn,
  HTTPX, and pytest.
- Choose the Python package name and compact module layout.
- Choose precise validation-error and missing-task response bodies while
  retaining conventional HTTP status codes.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

- `.planning/ROADMAP.md` - Phase goal, dependencies, and FAST-01 acceptance.
- `.planning/REQUIREMENTS.md` - Public reader contract for FAST-01.
- `.planning/quick/260715-e9k-define-fastapi-and-django-tutorial-expan/260715-e9k-CONTEXT.md` - Milestone-wide framework, repository, dependency, evidence, and TDD decisions.
- `AGENTS.md` - Repository execution and language rules.

</canonical_refs>

<specifics>
## Specific Ideas

- Use a single test file organized by externally observable endpoint behavior.
- Use generated OpenAPI and Swagger UI as the documentation surface.
- Make fresh-process in-memory state deterministic for focused behavior tests.

</specifics>

<deferred>
## Deferred Ideas

- Database persistence and migration ownership are Phase 22 scope.
- Production container hardening, immutable images, readiness, logs, and
  rollback are Phase 23 scope.
- Tutorial prose and screenshot assets are Phase 27 scope.

</deferred>

---

*Phase: 21-fastapi-deploy-stage*
*Context gathered: 2026-07-15 from confirmed milestone decisions*
