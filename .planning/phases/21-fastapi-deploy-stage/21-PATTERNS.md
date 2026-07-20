# Phase 21: FastAPI Deploy Stage - Pattern Map

**Mapped:** 2026-07-15
**Target repository:** `/Users/longnv/bin/repo/sealos-fastapi-tutorial`
**Files classified:** 9
**Analogs found:** 7 / 9

## Stage 1 Boundary

Phase 21 owns a Python 3.12 FastAPI application with process-local task state,
HTTP tests, reproducible `uv` metadata, and reader commands. Keep SQLAlchemy,
Alembic, PostgreSQL, migration Jobs, containers, Sealos deployment, tutorial
prose, and screenshots in later phases.

## File Classification

| New File | Role | Data Flow | Closest Analog | Quality |
|---|---|---|---|---|
| `app/__init__.py` | package config | import boundary | Package layout around `os_ai_backend/app.py` | role-match |
| `app/main.py` | route, model, service | request-response, in-memory CRUD | `os_ai_backend/app.py`; Hermes Kanban `plugin_api.py` | exact composition |
| `tests/test_api.py` | behavior test | request-response, CRUD | Hermes `test_kanban_dashboard_plugin.py`; Vocabloom `test_health.py` | exact seam |
| `pyproject.toml` | dependency/test config | dependency resolution | Vocabloom API `pyproject.toml` | exact role |
| `uv.lock` | generated lock config | dependency resolution | Vocabloom API `uv.lock` | exact role |
| `requirements.txt` | generated runtime config | lock-to-export transform | No generated-export analog; use `21-RESEARCH.md` | none |
| `.python-version` | runtime config | interpreter selection | No Python 3.12 analog found | none |
| `.gitignore` | repository config | file-I/O exclusion | Vocabloom `.gitignore` | exact role |
| `README.md` | reader documentation | setup-test-run-verify sequence | Vocabloom `README.md` | role-match |

## Pattern Assignments

### `app/main.py` (route/model/service, request-response and CRUD)

**Application factory analog:**
`/Users/longnv/bin/repo/os-ai-computer-use/packages/backend/src/os_ai_backend/app.py:27`

```python
def create_app() -> FastAPI:
    app = FastAPI(title="OS AI Backend", version=__version__)

    @app.get("/healthz")
    async def healthz() -> Dict[str, Any]:
        return {"status": "ok", ...}

    return app
```

Allocate the task dictionary and integer ID counter inside `create_app()`, then
export `app = create_app()` for isolated tests and the Uvicorn import target.

**FastAPI model and CRUD analog:**
`/Users/longnv/bin/repo/hermes-agent/plugins/kanban/dashboard/plugin_api.py:47`,
`:517`, `:580`, `:597`, `:806`, `:821`, and `:944`.

```python
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

class CreateTaskBody(BaseModel):
    title: str

@router.get("/tasks/{task_id}")
def get_task(task_id: str):
    if task is None:
        raise HTTPException(status_code=404, detail=f"task {task_id} not found")

@router.post("/tasks")
def create_task(payload: CreateTaskBody):
    ...

@router.delete("/tasks/{task_id}")
def delete_task(task_id: str):
    ...
```

Place thin routes directly on the factory-created app. Use integer IDs, the
locked `PUT` contract, `201` create, `204` delete, and a closure-local store.

### `tests/test_api.py` (behavior test, public HTTP seam)

**Fresh client fixture analog:**
`/Users/longnv/bin/repo/hermes-agent/tests/plugins/test_kanban_dashboard_plugin.py:44-59`.

```python
@pytest.fixture
def client(...):
    app = FastAPI()
    app.include_router(...)
    return TestClient(app)
```

Use `return TestClient(create_app())` so each test owns fresh in-memory state.
Keep imports limited to `pytest`, `TestClient`, and the public `create_app()`.

**HTTP lifecycle analogs:**
`test_kanban_dashboard_plugin.py:87-114`, `:268-295`, `:303-317`, and
`:505-519`.

```python
created = client.post("/tasks", json={"title": "to-delete"})
task = created.json()
read = client.get(f"/tasks/{task['id']}")
updated = client.put(f"/tasks/{task['id']}", json={...})
deleted = client.delete(f"/tasks/{task['id']}")
missing = client.get(f"/tasks/{task['id']}")
assert missing.status_code == 404
```

Build prerequisites through HTTP and assert status plus public JSON. Mirror
Vocabloom's compact health assertion from
`/Users/longnv/bin/repo/Vocabloom/services/api/tests/test_health.py:6-11`:

```python
response = client.get("/health")
assert response.status_code == 200
assert response.json() == {"status": "ok"}
```

Follow `21-RESEARCH.md` slice order: health, docs, create, list, get, update,
delete, invalid title, and missing ID.

### `pyproject.toml` and `uv.lock` (dependency config)

**Analog:**
`/Users/longnv/bin/repo/Vocabloom/services/api/pyproject.toml:1-32`.

```toml
[project]
requires-python = ">=3.12"
dependencies = [
  "fastapi>=0.115",
  "httpx>=0.27",
  "uvicorn[standard]>=0.30",
]

[dependency-groups]
dev = ["pytest>=8.3"]

[tool.pytest.ini_options]
testpaths = ["tests"]
```

Use the exact pins from `21-RESEARCH.md`, set
`requires-python = ">=3.12,<3.13"`, keep HTTPX and pytest in the dev group,
and let `uv` generate `uv.lock`. Treat the lock as generated output and verify
it with `uv lock --check`.

### `.gitignore` (repository config)

**Analog:** `/Users/longnv/bin/repo/Vocabloom/.gitignore:1-14`.

```gitignore
__pycache__/
*.py[cod]
.pytest_cache/
.venv/
.env
.env.*
!.env.example
```

Retain entries relevant to this single-service Python repository.

### `README.md` (reader workflow)

**Analog:** `/Users/longnv/bin/repo/Vocabloom/README.md:12-17` and `:67-99`.

```markdown
## Prerequisites
- Python 3.12 with `uv`

## Backend setup
uv sync

## Start the API
...
The API runs ... at `http://localhost:8000`.
```

Use prerequisite -> setup -> test -> start. Show locked `uv` commands, Uvicorn
on `0.0.0.0:8000`, HTTP verification, and the process-local data lifecycle.

## Shared Patterns

### Validation and Error Responses

- Define request and response shapes with Pydantic models beside their routes.
- Bound `title` with `Field(min_length=1, max_length=...)`; FastAPI supplies
  the public `422` response.
- Resolve a task once per detail/update/delete handler and raise
  `HTTPException(status_code=404, detail="Task not found")` consistently.
- Return typed task representations so generated `/docs` describes the API.

### Test Isolation

- Construct `TestClient(create_app())` in a function-scoped fixture.
- Create prerequisite records through HTTP inside each test.
- Assert post-update and post-delete state through later HTTP reads.
- Keep framework collaborators real; Stage 1 has no external boundary to mock.

### Publication

After local gates pass, publish `main`, create annotated `stage-1-deploy`,
compare its peeled remote SHA with `HEAD`, apply the tag ruleset, and verify a
clean public clone according to `21-RESEARCH.md`.

## No Close Analog Found

| File | Required Pattern |
|---|---|
| `.python-version` | One line: `3.12`, fixed by D-03. |
| `requirements.txt` | Generate from `uv.lock` with the exact runtime-only export command in `21-RESEARCH.md`; verify HTTPX and pytest are absent. |

## Metadata

**Analog search scope:** Sealos.io plus neighboring Vocabloom, Hermes Agent,
and OS AI Computer Use repositories
**Primary analog files inspected:** 8
**Pattern extraction date:** 2026-07-15
