# Phase 24: Django Deploy Stage - Pattern Map

**Mapped:** 2026-07-16
**Implementation repository:** `/Users/longnv/bin/repo/sealos-django-tutorial`
**Orchestration repository:** `/Users/longnv/.codex/worktrees/19b8/sealos.io`
**Files classified:** 28 (24 Reference Application files and 4 retained evidence files)
**Representative analog files:** 5
**Local analog coverage:** 11 / 28
**Official Django source coverage:** 17 / 28

## Boundary Summary

Phase 24 owns the first immutable Django reader stage: Python 3.12, Django
5.2.16, SQLite, one committed migration, five public HTTP behaviors, a local
port-8000 run, an annotated protected source tag, and a fresh public clone.

The public Reference Application owns reader-executable source and direct
RED/GREEN history. The Sealos.io phase directory owns package-legitimacy
readback, execution summaries, public GitHub state, cleanup results, and
independent verification. This keeps dynamic platform evidence outside the
protected source tag.

Phase 25 owns PostgreSQL, psycopg, migration Jobs, schema readiness, restart and
scale persistence, and administrator-backed readback. Phase 26 owns Gunicorn,
WhiteNoise, `collectstatic`, production images, replicas, rollback, and
recovery. Phases 27 and 28 own tutorial practice, screenshots, catalog
publication, and milestone cleanup.

## File Classification

### Reference Application: Repository Foundation

| Target File | Role | Data Flow | Closest Pattern | Match Quality |
|---|---|---|---|---|
| `.gitignore` | repository config | file-I/O exclusion | FastAPI Stage 1 `.gitignore` | exact role |
| `.python-version` | runtime config | interpreter selection | FastAPI Stage 1 Python foundation | exact role |
| `README.md` | reader documentation | clone -> sync -> migrate -> test -> run -> HTTP | FastAPI Stage 1 `README.md` | exact workflow |
| `manage.py` | command controller | command-response | Django 5.2 generated project pattern in `24-RESEARCH.md` | official source |
| `pyproject.toml` | dependency and test config | dependency resolution | FastAPI Stage 1 `pyproject.toml` | exact role |
| `requirements.txt` | generated runtime config | lock-to-export transform | FastAPI Stage 1 Python foundation plus the `uv export` contract | exact role |
| `uv.lock` | generated lock config | dependency resolution | FastAPI Stage 1 Python foundation | exact role |

### Reference Application: Django Project Package

| Target File | Role | Data Flow | Closest Pattern | Match Quality |
|---|---|---|---|---|
| `taskboard/__init__.py` | package config | import boundary | Django 5.2 generated project pattern in `24-RESEARCH.md` | official source |
| `taskboard/asgi.py` | runtime adapter | request-response | Django 5.2 generated ASGI entry point | official source |
| `taskboard/settings.py` | framework config | configuration resolution | Django 5.2 generated settings plus Stage 1 decisions | official source |
| `taskboard/urls.py` | root router | request-response dispatch | Django 5.2 `include()` and admin pattern | official source |
| `taskboard/wsgi.py` | runtime adapter | request-response | Django 5.2 generated WSGI entry point | official source |

### Reference Application: `tasks` Domain App

| Target File | Role | Data Flow | Closest Pattern | Match Quality |
|---|---|---|---|---|
| `tasks/__init__.py` | package config | import boundary | Django 5.2 generated app pattern | official source |
| `tasks/admin.py` | administration config | authenticated CRUD | Django 5.2 admin registration pattern | official source |
| `tasks/apps.py` | app registry config | import and registry setup | Django 5.2 generated app pattern | official source |
| `tasks/forms.py` | validation adapter | POST data -> validated model | Django 5.2 `ModelForm` pattern | official source |
| `tasks/migrations/__init__.py` | migration package config | import boundary | Django 5.2 generated migration package | official source |
| `tasks/migrations/0001_initial.py` | schema migration | model state -> SQLite DDL | Django 5.2 migration generator | official source |
| `tasks/models.py` | domain model | CRUD and ordered reads | Django 5.2 model and `Meta.ordering` pattern | official source |
| `tasks/urls.py` | app router | request-response dispatch | Django 5.2 URL dispatcher pattern | official source |
| `tasks/views.py` | controller | request-response and CRUD | Django 5.2 render, redirect, and `JsonResponse` patterns | official source |
| `tasks/static/tasks/styles.css` | static presentation | file-I/O | Django 5.2 app-namespaced static pattern plus D-01 | official source |
| `tasks/templates/tasks/board.html` | server-rendered component | form/list -> HTML transform | Django 5.2 template, CSRF, and autoescape patterns | official source |
| `tests/test_public_http.py` | behavior test | request-response and CRUD | FastAPI Stage 1 `tests/test_api.py` plus pytest-django client rules | strong seam match |

### Retained Planning Evidence

| Target File | Role | Data Flow | Closest Pattern | Match Quality |
|---|---|---|---|---|
| `24-01-SUMMARY.md` | foundation evidence | package/schema checks -> curated Markdown | Phase 21 Stage 1 execution and evidence pattern | exact stage role |
| `24-02-SUMMARY.md` | behavior evidence | RED/GREEN tests -> curated Markdown | Phase 21 public HTTP history pattern | exact stage role |
| `24-03-SUMMARY.md` | replay and publication evidence | local/public readback -> curated Markdown | Phase 21 Stage 1 publication plan | exact stage role |
| `24-VERIFICATION.md` | independent verifier | retained evidence -> DJAN-01 verdict matrix | GSD phase verification convention | exact role |

The planner adds `24-01-PLAN.md`, `24-02-PLAN.md`, and `24-03-PLAN.md`. The
28-file count covers implementation and retained evidence outputs.

## Representative Analog Set

Use the protected FastAPI `stage-1-deploy` snapshot for cross-framework
repository patterns. Its nine-file source tree is the accepted first-stage
shape. Django-specific implementation authority comes from the official Django
5.2 patterns already compiled in `24-RESEARCH.md:199-316`.

### 1. Python 3.12 and `uv` Foundation

**Analog:**
`/Users/longnv/bin/repo/sealos-fastapi-tutorial@stage-1-deploy:pyproject.toml:1-20`

```toml
[project]
name = "sealos-fastapi-tutorial"
version = "0.1.0"
description = "Tasks API reference application for the Sealos FastAPI tutorial series"
requires-python = ">=3.12,<3.13"
dependencies = [
  "fastapi==0.139.0",
  "pydantic==2.13.4",
  "uvicorn==0.51.0",
]

[dependency-groups]
dev = [
  "httpx==0.28.1",
  "pytest==9.1.1",
]

[tool.pytest.ini_options]
pythonpath = ["."]
testpaths = ["tests"]
```

Apply the same layout with these Phase 24 values:

```toml
[project]
requires-python = ">=3.12,<3.13"
dependencies = ["Django==5.2.16"]

[dependency-groups]
dev = ["pytest==9.1.1", "pytest-django==4.12.0"]

[tool.pytest.ini_options]
DJANGO_SETTINGS_MODULE = "taskboard.settings"
pythonpath = ["."]
testpaths = ["tests"]
```

Set `.python-version` to `3.12`. Generate `uv.lock` through `uv`; generate
`requirements.txt` from that lock with the exact runtime-only command in
`24-RESEARCH.md:160-176`. Acceptance uses `uv lock --check`,
`uv sync --locked`, a repeated export, and `git diff --exit-code -- uv.lock
requirements.txt`. The runtime dependency set contains Django. The development
group contains pytest and pytest-django.

### 2. Public HTTP Behavior Tests

**Analog:**
`/Users/longnv/bin/repo/sealos-fastapi-tutorial@stage-1-deploy:tests/test_api.py:7-16,27-44,80-84`

```python
@pytest.fixture
def client() -> TestClient:
    return TestClient(create_app())


def test_health_is_public(client: TestClient) -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_list_tasks(client: TestClient) -> None:
    created = client.post("/tasks", json={"title": "Write tutorial"})
    response = client.get("/tasks")
    assert response.status_code == 200
    assert response.json() == [created.json()]
```

Copy the behavior-first shape: create prerequisites through public HTTP, assert
status plus reader-visible output, and verify writes through later reads. Swap
the FastAPI fixture for pytest-django's `client`; apply
`@pytest.mark.django_db` to database-using behavior. The Django-specific
creation seam follows `24-RESEARCH.md:297-316`:

```python
@pytest.mark.django_db
def test_task_creation_redirects_then_appears_on_board(client):
    create_response = client.post('/tasks/', {'title': 'Write the tutorial'})
    assert create_response.status_code == 302
    assert create_response.headers['Location'] == '/'

    board_response = client.get('/')
    assert board_response.status_code == 200
    assert b'Write the tutorial' in board_response.content
    assert b'1 task' in board_response.content
```

The file contains exactly these five behavior functions from
`24-VALIDATION.md:46-55`:

1. `test_health_is_public`
2. `test_empty_task_board_is_rendered`
3. `test_task_creation_redirects_then_appears_on_board`
4. `test_invalid_task_title_shows_feedback_without_creating_task`
5. `test_admin_login_is_public`

The empty-board test asserts the form label, `/tasks/` action, hidden CSRF
field, task count, empty state, and stylesheet link. The invalid-title test
submits whitespace, asserts the stable field error, then performs a separate
`GET /` and observes an empty board. The admin test observes the generated
login controls through `GET /admin/login/`.

### 3. Reader Workflow

**Analog:**
`/Users/longnv/bin/repo/sealos-fastapi-tutorial@stage-1-deploy:README.md:7-55`

```markdown
## Prerequisites

- Git
- Python 3.12
- `uv`
- `curl`

## Clone Stage 1

git clone --branch stage-1-deploy <public-repository>
uv sync --locked

## Run the Behavior Suite

uv run pytest -q

## Start the API

uv run uvicorn app.main:app --host 0.0.0.0 --port 8000

## Verify Health and Documentation

curl --fail --silent http://127.0.0.1:8000/health
```

Keep the same prerequisite -> immutable clone -> locked sync -> migration ->
tests -> server -> HTTP verification sequence. Translate the runtime commands
to Django:

```bash
uv sync --locked
uv run python manage.py migrate --noinput
uv run python manage.py makemigrations --check --dry-run
uv run pytest -q
uv run python manage.py runserver 0.0.0.0:8000 --noreload
curl --fail --silent http://127.0.0.1:8000/health
curl --fail --silent http://127.0.0.1:8000/
curl --fail --silent http://127.0.0.1:8000/admin/login/
```

Document the rendered form workflow and local SQLite lifecycle. Acceptance
stops the owned runserver child and removes `db.sqlite3`.

### 4. Repository Exclusions

**Analog:**
`/Users/longnv/bin/repo/sealos-fastapi-tutorial@stage-1-deploy:.gitignore:1-8`

```gitignore
__pycache__/
*.py[cod]
.pytest_cache/
.venv/
.coverage
htmlcov/
.DS_Store
```

Retain these Python and local-tool entries and add `db.sqlite3`. The initial
migration stays tracked as the Stage 1 schema owner.

### 5. Publication, Replay, and Cleanup

**Analog:**
`.planning/phases/21-fastapi-deploy-stage/21-03-PLAN.md:130-199`

The accepted Stage 1 plan establishes this order:

1. Freeze `ACCEPTED_HEAD` only after the local suite, runtime export, tracked
   inventory, and owned port-8000 smoke pass.
2. Query repository visibility, default branch, remote main, named ruleset, and
   direct/peeled tag state before mutation.
3. Create or reconcile one complete tag ruleset payload:

```json
{
  "name": "Protect tutorial stage tags",
  "target": "tag",
  "enforcement": "active",
  "bypass_actors": [],
  "conditions": {
    "ref_name": {
      "exclude": [],
      "include": ["refs/tags/stage-*"]
    }
  },
  "rules": [{"type": "update"}, {"type": "deletion"}]
}
```

4. Resolve the four coherent local/remote tag states, require an annotated tag
   object, compare direct objects, and require every peeled commit to equal
   `ACCEPTED_HEAD`.
5. Create `stage-1-deploy` with message `Django deploy stage`, push that exact
   ref, and re-read the repository plus ruleset.
6. Clone the public tag into a fresh temporary directory, replay lock, export,
   migrations, five tests, port smoke, and tracked inventory, then remove the
   clone and generated database through an installed trap.

Use an owned runserver PID and bounded readiness polling for each local or clone
smoke. The cleanup readback covers port 8000, the child PID, temporary clone,
temporary logs/responses, and every generated `db.sqlite3` path.

## Django-Specific Pattern Assignments

The FastAPI Stage 1 repository supplies the cross-framework repository,
dependency, test-seam, documentation, publication, and cleanup envelope. The
following files use the official Django 5.2 patterns compiled in
`24-RESEARCH.md` as their implementation source authority.

### Generated Project Files

**Apply to:** `manage.py`, `taskboard/__init__.py`, `taskboard/asgi.py`,
`taskboard/settings.py`, `taskboard/urls.py`, `taskboard/wsgi.py`,
`tasks/__init__.py`, `tasks/apps.py`, and `tasks/migrations/__init__.py`.

Generate the project and app with Django 5.2.16, then keep generated import and
runtime entry-point conventions. Configure `taskboard.settings` with
`tasks.apps.TasksConfig`, the default middleware and template engines, SQLite at
`BASE_DIR / 'db.sqlite3'`, and app-namespaced static discovery. Root routing
follows `24-RESEARCH.md:240-253`:

```python
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('', include('tasks.urls')),
    path('admin/', admin.site.urls),
]
```

### Task Model, Migration, and Administration

**Apply to:** `tasks/models.py`, `tasks/migrations/0001_initial.py`, and
`tasks/admin.py`.

Source authority: `24-RESEARCH.md:256-262,288-295` and the linked official
Django 5.2 model, migration, and administration documentation.

```python
from django.db import models


class Task(models.Model):
    title = models.CharField(max_length=200)
    completed = models.BooleanField(default=False)

    class Meta:
        ordering = ['id']
```

Generate `0001_initial.py` through `makemigrations tasks` and commit it beside
the model. Register `Task` with `admin.site.register(Task)`. Acceptance deletes
the mutable SQLite file, migrates a fresh database, requires migration
`tasks.0001_initial`, and runs `makemigrations --check --dry-run`.

### ModelForm, Views, and App Routes

**Apply to:** `tasks/forms.py`, `tasks/views.py`, and `tasks/urls.py`.

Source authority: `24-RESEARCH.md:240-286` and the linked official Django 5.2
URL dispatcher, `ModelForm`, form field, render, redirect, and response
documentation.

```python
class TaskForm(forms.ModelForm):
    class Meta:
        model = Task
        fields = ['title']
        error_messages = {'title': {'required': 'Enter a task title.'}}
```

```python
app_name = 'tasks'
urlpatterns = [
    path('', views.board, name='board'),
    path('tasks/', views.create_task, name='create-task'),
    path('health', views.health, name='health'),
]
```

The board creates an unbound `TaskForm`, reads `Task.objects.all()`, and renders
`tasks/board.html`. The create view binds `request.POST`; a valid form saves and
redirects to `tasks:board`; an invalid form renders the same template with
ordered tasks and HTTP 200. The health view returns
`JsonResponse({'status': 'ok'})` with HTTP 200. Method decorators may express
the locked GET and POST contracts directly.

### Template and Static CSS

**Apply to:** `tasks/templates/tasks/board.html` and
`tasks/static/tasks/styles.css`.

Source authority: `24-RESEARCH.md:288-295`, the linked official Django 5.2 CSRF
and static-file patterns, and D-01 in `24-CONTEXT.md:14-25`.

The template owns one `<main>` with:

- a compact Task Board header;
- a visible `<label for="id_title">`;
- `{% csrf_token %}` and bound field errors;
- form action `{% url 'tasks:create-task' %}` and a submit button;
- a stable task count;
- an empty state;
- a semantic ordered task list;
- `{% load static %}` plus `{% static 'tasks/styles.css' %}`.

Render task titles through normal template interpolation so Django autoescape
remains active. The page uses server-rendered HTML and one local stylesheet as
its frontend asset set. CSS supplies responsive spacing, visible focus states,
clear errors, and stable row layout.

## Evidence File Contracts

### `24-01-SUMMARY.md`

Record the package human-verification checkpoint, exact package sources and
release refs, Python and `uv` versions, generated file inventory, foundation
commit, health RED/GREEN commits, lock/sync/export results, Django version,
`manage.py check`, and cleanup state. Curate values and command outcomes; keep
credentials and ambient configuration outside the artifact.

### `24-02-SUMMARY.md`

Record each board, creation, invalid-title, and admin RED/GREEN pair; named and
accumulated test results; the committed migration identity; fresh SQLite
migration; drift check; rendered public observations; deviations; and source
tree cleanliness.

### `24-03-SUMMARY.md`

Record README acceptance, owned local browser/HTTP smoke, accepted HEAD, public
repository metadata, remote main, annotated tag direct object, peeled commit,
tag message, exact ruleset readback, fresh-clone lock/export/migration/test/port
results, tracked inventory, and zero cleanup counts.

### `24-VERIFICATION.md`

Independently map DJAN-01 and each Phase 24 success criterion to current source,
test, migration, runtime, public GitHub, tag/ruleset, clone, and cleanup
evidence. Re-read live external identities during verification because GitHub
repository and ruleset state can change after summary creation.

## Shared Patterns

### Public Seam and Test Isolation

- Observe health, board rendering, creation, validation, and admin login through
  Django's test client.
- Use pytest-django's framework-managed test database and committed migrations.
- Prove creation through a 302 response followed by an independent board GET.
- Express test names in reader-visible behavior language.

### Validation and Security

- Expose `title` as the sole `ModelForm` field; the model default owns
  `completed=False`.
- Retain Django's generated CSRF, session, authentication, and message
  middleware.
- Include `{% csrf_token %}` and normal autoescaped title interpolation.
- Let Django admin and auth own `/admin/login/` and protected administration.

### Migration Ownership

- Commit the generated initial migration with the model slice.
- Build acceptance databases from migrations after removing `db.sqlite3`.
- Use `makemigrations --check --dry-run`, `migrate --noinput`, and
  `showmigrations tasks` as distinct drift, application, and readback gates.

### RED/GREEN History

- Create the reproducible Django foundation first with custom public routes
  absent.
- Add one named public test in each RED commit and its minimum behavior in the
  direct GREEN child.
- Run the named test, accumulated public file, and `manage.py check` before each
  GREEN commit.
- Verify the exact ordered commit subjects before publication and in the fresh
  clone.

### Cleanup

- Require port 8000 availability before launch.
- Install cleanup immediately after creating each PID or temporary path.
- Use bounded readiness polling and verify the child remains live during probes.
- Stop the owned runserver, remove temporary clones and response files, delete
  generated SQLite databases, and record zero-state readback.

## Source Authority Matrix

| Area | Local Stage 1 Authority | Django 5.2 Authority |
|---|---|---|
| Python 3.12, `uv`, lock/export | FastAPI protected Stage 1 | Exact Phase 24 versions and pytest settings in `24-RESEARCH.md:149-176` |
| Public behavior testing | FastAPI protected Stage 1 HTTP style | pytest-django client/database pattern in `24-RESEARCH.md:297-324` |
| Reader README | FastAPI protected Stage 1 workflow | Django migration and runserver commands in `24-RESEARCH.md:452-505` |
| Public tag, ruleset, clone, cleanup | Phase 21 accepted publication plan | Django inventory and five-test gate in `24-RESEARCH.md:507-529` |
| Generated project and app | Cross-framework repository envelope | Official Django 5.2 generated project pattern |
| Model, migration, admin | Cross-framework Task vocabulary | Official Django 5.2 ORM, migrations, and admin patterns |
| `ModelForm`, views, routes | Cross-framework request-response seam | Official Django 5.2 forms, shortcuts, and URL dispatcher patterns |
| Template and static CSS | Cross-framework reader workflow | Official Django 5.2 template, CSRF, autoescape, and static patterns |

The local FastAPI analogy covers repository and acceptance mechanics. Official
Django 5.2 patterns in `24-RESEARCH.md` govern every generated project, model,
`ModelForm`, template, static CSS, migration, and administration file.

## No-Analog Table

| Django-Specific Files | Role and Data Flow | Implementation Source |
|---|---|---|
| `manage.py`, `taskboard/__init__.py`, `taskboard/asgi.py`, `taskboard/settings.py`, `taskboard/urls.py`, `taskboard/wsgi.py` | command controller, package/config, runtime adapters, request routing | Django 5.2 generated project and URLconf patterns in `24-RESEARCH.md:199-253` |
| `tasks/__init__.py`, `tasks/apps.py`, `tasks/migrations/__init__.py` | package and app registry boundaries | Django 5.2 generated app pattern in `24-RESEARCH.md:199-230` |
| `tasks/models.py`, `tasks/migrations/0001_initial.py` | ordered ORM CRUD and model-to-schema transform | Django 5.2 model and migration patterns in `24-RESEARCH.md:256-262` |
| `tasks/forms.py` | POST data to validated model transform | Django 5.2 `ModelForm` pattern in `24-RESEARCH.md:264-272` |
| `tasks/urls.py`, `tasks/views.py` | request-response dispatch and CRUD | Django 5.2 URL, render, redirect, and JSON response patterns in `24-RESEARCH.md:240-286` |
| `tasks/templates/tasks/board.html`, `tasks/static/tasks/styles.css` | server data to accessible HTML and static file-I/O | Django 5.2 template, CSRF, autoescape, and app-namespaced static patterns in `24-RESEARCH.md:288-295` |
| `tasks/admin.py` | framework-managed authenticated CRUD | Django 5.2 administration registration pattern in `24-RESEARCH.md:288-295` |

These 17 files have Django-specific roles absent from the local FastAPI Stage 1
tree. Their implementation authority is the official Django 5.2 material
already cited and distilled in `24-RESEARCH.md`.

## Metadata

**Analog search scope:** protected `stage-1-deploy` snapshot in
`/Users/longnv/bin/repo/sealos-fastapi-tutorial`, accepted Phase 21 Stage 1
publication plan, and Phase 24 official-source research.

**Five representative analog files:**

1. `/Users/longnv/bin/repo/sealos-fastapi-tutorial@stage-1-deploy:pyproject.toml`
2. `/Users/longnv/bin/repo/sealos-fastapi-tutorial@stage-1-deploy:tests/test_api.py`
3. `/Users/longnv/bin/repo/sealos-fastapi-tutorial@stage-1-deploy:README.md`
4. `/Users/longnv/bin/repo/sealos-fastapi-tutorial@stage-1-deploy:.gitignore`
5. `.planning/phases/21-fastapi-deploy-stage/21-03-PLAN.md`

**Pattern extraction date:** 2026-07-16
