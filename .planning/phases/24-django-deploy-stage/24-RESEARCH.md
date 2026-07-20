# Phase 24: Django Deploy Stage - Research

**Researched:** 2026-07-16
**Domain:** Django 5.2 server-rendered application, SQLite migration ownership, public HTTP behavior tests, and immutable Stage 1 publication
**Confidence:** HIGH for locked scope, package identity, and local environment; MEDIUM for documentation-derived framework details

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions [VERIFIED: `.planning/phases/24-django-deploy-stage/24-CONTEXT.md`]

#### Rendered Task Workflow

- **D-01:** Use one server-rendered page at `GET /` as the Task Board. It shows
  an inline task-title form, an empty state when appropriate, and the ordered
  task list.
- Submit new tasks to `POST /tasks/`, validate through a Django `ModelForm`,
  create incomplete tasks, then use post/redirect/get back to `/` so a later
  public page read proves the write.
- Model each task with an auto-generated integer primary key, a required title
  capped at 200 characters, a non-null `completed` boolean defaulting to false,
  and creation ordering suitable for a stable rendered list.
- Keep the UI server-rendered, accessible, responsive, and work-focused with a
  compact header, clear form label, submit button, task count, empty state, and
  task rows. Use local CSS and zero client-side JavaScript.

#### Health and Administration

- **D-02:** Expose `GET /health` as public JSON with the exact payload
  `{"status": "ok"}` and HTTP 200. Bind local execution to
  `0.0.0.0:8000`.
- Mount Django administration at `/admin/`, register `Task`, and verify the
  framework-native login surface at `GET /admin/login/` through public HTTP.
- Stage 1 proves the administration entry point. Administrator-backed task
  creation and readback remain Phase 25 acceptance work.

#### Stage 1 Persistence

- **D-03:** Use Django ORM with local SQLite for the deploy stage and commit the
  initial Task migration. Ignore the mutable `db.sqlite3` file.
- Run `python manage.py migrate` before local smoke acceptance. Phase 25 changes
  the database configuration to PostgreSQL while retaining the Task model and
  public page contract.
- Keep database configuration conventional and environment-ready without
  introducing PostgreSQL, psycopg, migration Jobs, or schema-aware readiness in
  this phase.

#### Reproducible Python Baseline

- **D-04:** Use Python 3.12, Django 5.2 LTS at current patch 5.2.16, `uv`,
  `pyproject.toml`, a committed `uv.lock`, and an exact runtime-only
  `requirements.txt` export.
- Use pytest 9.1.1 and pytest-django 4.12.0 as development dependencies. Verify
  exact PyPI metadata and official repository identities before locking.
- Include clean setup, migration, test, run, and HTTP verification commands in
  `README.md`.

#### Behavior-First Delivery

- **D-05:** Test only the confirmed public Django HTTP seam with Django's test
  client and the framework-managed test database. Assert health, the rendered
  empty board, task creation followed by a rendered list read, invalid-title
  feedback, and the administration login page.
- Implement one vertical slice at a time: retain one failing public behavior
  commit, add only the minimum passing implementation, run the accumulated
  suite, then review the slice before moving forward.
- Keep Django's router, ORM, form, template renderer, middleware, and test
  database real. Verify writes through later page reads rather than model-level
  assertions.

#### Public Repository and Stage Identity

- **D-06:** Build the local repository at
  `/Users/longnv/bin/repo/sealos-django-tutorial` and publish it as
  `https://github.com/yangchuansheng/sealos-django-tutorial`.
- Preserve the accepted source as the annotated `stage-1-deploy` tag, keep
  public `main` available for later stages, and protect `refs/tags/stage-*`
  against updates and deletion with no bypass.
- Accept publication only after a fresh public HTTPS clone reproduces the lock,
  runtime export, migrations, focused suite, port-8000 health, rendered board,
  and admin login.

#### Stage Fence and Cleanup

- **D-07:** Keep psycopg 3, the PostgreSQL migration Job, schema-aware
  readiness, Gunicorn, WhiteNoise, `collectstatic`, production containers,
  immutable images, and rollback outside the Stage 1 tracked source.
- Stop every local development server and delete each temporary clone and
  generated local database after acceptance. Retain the public source
  repository, protected tag, and redacted planning evidence.

### the agent's Discretion [VERIFIED: `.planning/phases/24-django-deploy-stage/24-CONTEXT.md`]

- Choose compact Django project and application package names.
- Choose the exact CSS tokens, task-row markup, form error copy, and stable
  ordering expression within the locked rendered-page contract.
- Choose the focused test filenames and bounded local server smoke harness.

### Deferred Ideas (OUT OF SCOPE) [VERIFIED: `.planning/phases/24-django-deploy-stage/24-CONTEXT.md`]

- PostgreSQL, psycopg 3, fresh-database migrations, the migration Job, and
  administrator-backed data readback remain Phase 25 scope.
- Gunicorn, WhiteNoise, `collectstatic`, non-root images, release logs,
  horizontal replicas, rollback, and recovery remain Phase 26 scope.
- Sealos Skills practice, measured duration, custom domain, tutorial prose, and
  screenshots remain Phase 27 scope.
- Tutorial matrix publication, static route validation, and milestone-wide
  cleanup remain Phase 28 scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| DJAN-01 | Reader can clone a public Task Board stage that exposes `/health`, rendered task pages, and Django administration on port 8000. | The stack, exact layout, public HTTP seams, migration path, RED/GREEN order, local smoke, and fresh-clone publication gates below cover the full reader contract. `[VERIFIED: .planning/REQUIREMENTS.md]` |
</phase_requirements>

## Summary

Build a compact Django project package named `taskboard` and one application
named `tasks`. Keep routing, ORM, `ModelForm`, templates, middleware, admin, and
the pytest-django managed database real. Five public HTTP tracer bullets cover
the complete locked behavior while source inspection and migration checks cover
Task registration and schema ownership. `[VERIFIED: 24-CONTEXT.md; CITED: https://docs.djangoproject.com/en/5.2/topics/testing/tools/]`

Use SQLite for Stage 1 because the shipped configuration and reader workflow
are local and single-process. Commit `tasks/migrations/0001_initial.py`, ignore
`db.sqlite3`, and build every test database through migrations. Phase 25 must
switch its integration and migration gates to real PostgreSQL because backend
DDL behavior, one-shot Job execution, schema readiness, restart persistence,
and administrator-backed readback are PostgreSQL acceptance claims.
`[VERIFIED: 24-CONTEXT.md; CITED: https://docs.djangoproject.com/en/5.2/topics/migrations/; CITED: https://pytest-django.readthedocs.io/en/latest/database.html]`

**Primary recommendation:** Plan five sequential units: approved dependency
bootstrap; generated Django project/app scaffold plus health; rendered board
schema and presentation; task creation, validation, and administration; then
README/local acceptance, publication, public replay, and explicit cleanup.
`[VERIFIED: TDD skill and accepted Phase 23 publication pattern]`

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|--------------|----------------|-----------|
| `/`, `/tasks/`, `/health` | API / Backend | Server-rendered HTML | Django URLconf and views own request handling; templates own presentation. `[CITED: https://docs.djangoproject.com/en/5.2/intro/tutorial01/]` |
| Task validation | API / Backend | HTML form | `ModelForm` owns bound POST validation and the model default owns `completed=False`. `[CITED: https://docs.djangoproject.com/en/5.2/topics/forms/modelforms/]` |
| Task persistence | Database / Storage | Django ORM | Stage 1 uses local SQLite with a committed Django migration. `[VERIFIED: D-03]` |
| Administration | API / Backend | Django auth/session tables | Django admin exposes the framework-native login and registered `Task`. `[CITED: https://docs.djangoproject.com/en/5.2/intro/tutorial02/]` |
| Stage identity | Git / GitHub | Fresh public clone | An annotated protected tag identifies the accepted reader source. `[CITED: https://git-scm.com/docs/git-tag; CITED: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets]` |

## Standard Stack

| Package / Tool | Exact Version | Scope | Evidence |
|----------------|---------------|-------|----------|
| Python | 3.12 (`3.12.13` available locally) | Runtime | Locked family and local CLI. `[VERIFIED: local CLI]` |
| `Django` [WARNING: GSD legitimacy seam returned SUS; retain a human verification checkpoint before installation.] | 5.2.16 | Runtime framework, ORM, forms, templates, admin, runserver | PyPI requires Python >=3.10; PyPI source URL is `https://github.com/django/django`; official download page lists 5.2.16 as the supported 5.2 LTS patch. `[VERIFIED: PyPI metadata; CITED: https://www.djangoproject.com/download/]` |
| `pytest` [WARNING: GSD legitimacy seam returned SUS; retain a human verification checkpoint before installation.] | 9.1.1 | Development test runner | PyPI requires Python >=3.10 and identifies `https://github.com/pytest-dev/pytest` as source. `[VERIFIED: PyPI metadata]` |
| `pytest-django` [WARNING: GSD legitimacy seam returned SUS; retain a human verification checkpoint before installation.] | 4.12.0 | Development Django integration and client/database fixtures | PyPI requires Python >=3.10 and identifies `https://github.com/pytest-dev/pytest-django` as repository. `[VERIFIED: PyPI metadata]` |
| `uv` | 0.10.9 available locally | Lock, sync, run, export | Installed CLI exposes every required flag. `[VERIFIED: local CLI; CITED: https://docs.astral.sh/uv/concepts/projects/sync/]` |
| SQLite | Python 3.12 standard library backend | Stage 1 persistence and tests | Django's generated project defaults to SQLite. `[CITED: https://docs.djangoproject.com/en/5.2/intro/tutorial02/]` |

Recommended metadata and lock commands:

```bash
uv init --app --python 3.12
uv add 'Django==5.2.16'
uv add --dev 'pytest==9.1.1' 'pytest-django==4.12.0'
uv lock --check
uv sync --locked
uv export --locked --no-dev --no-emit-project --no-hashes \
  --format requirements.txt --output-file requirements.txt
git diff --exit-code -- uv.lock requirements.txt
```

`pyproject.toml` should use `requires-python = ">=3.12,<3.13"`, put Django in
`dependencies`, put pytest packages in `[dependency-groups].dev`, and configure
`DJANGO_SETTINGS_MODULE = "taskboard.settings"` under
`[tool.pytest.ini_options]`. `[VERIFIED: D-04; CITED: https://pytest-django.readthedocs.io/en/latest/configuring_django.html]`

## Package Legitimacy Audit

The required command was run as
`package-legitimacy check --ecosystem pypi Django pytest pytest-django`.
`[VERIFIED: GSD package-legitimacy seam]`

| Package | Registry Age | Exact Release | Downloads | Official Source From PyPI | Verdict | Disposition |
|---------|--------------|---------------|-----------|---------------------------|---------|-------------|
| Django | PyPI files since 2010 | 5.2.16, uploaded 2026-07-07 | Unavailable to seam | `github.com/django/django` | SUS: `too-new`, `unknown-downloads` | Keep locked version; planner adds `checkpoint:human-verify` before `uv add`. |
| pytest | PyPI files since 2010 | 9.1.1, uploaded 2026-06-19 | Unavailable to seam | `github.com/pytest-dev/pytest` | SUS: `too-new`, `unknown-downloads` | Keep locked version; planner adds `checkpoint:human-verify` before `uv add`. |
| pytest-django | PyPI files since 2012 | 4.12.0, uploaded 2026-02-14 | Unavailable to seam | `github.com/pytest-dev/pytest-django` | SUS: `unknown-downloads`, `no-repository` | Keep locked version; planner adds `checkpoint:human-verify` and records PyPI `Repository` URL. |

All three exact distributions exist on PyPI and all three official Git
repositories expose matching release tags (`5.2.16`, `9.1.1`, and `v4.12.0`).
The seam missed pytest-django's repository because PyPI labels that project URL
`Repository` rather than `Source`. Its current documentation changelog still
labels 4.12.0 as unreleased, so the human checkpoint must record this official
metadata/documentation inconsistency before locking. `[VERIFIED: PyPI metadata and official GitHub refs; CITED: https://pytest-django.readthedocs.io/en/latest/changelog.html]`

**Packages removed due to SLOP verdict:** none. `[VERIFIED: GSD package-legitimacy seam]`

## Exact Recommended File Layout

```text
sealos-django-tutorial/
├── .gitignore                         # Ignore .venv/, caches, and db.sqlite3
├── .python-version                    # 3.12
├── README.md                          # Clean clone, migrate, test, run, HTTP checks
├── manage.py
├── pyproject.toml
├── requirements.txt                   # Exact runtime-only uv export
├── uv.lock
├── taskboard/
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py                    # SQLite, installed tasks app, dev settings
│   ├── urls.py                        # tasks URLconf plus admin/
│   └── wsgi.py
├── tasks/
│   ├── __init__.py
│   ├── admin.py                       # Register Task
│   ├── apps.py
│   ├── forms.py                       # TaskForm exposes title only
│   ├── migrations/
│   │   ├── __init__.py
│   │   └── 0001_initial.py            # Committed schema owner
│   ├── models.py                      # Task and unique-key ordering
│   ├── urls.py                        # /, /tasks/, /health
│   ├── views.py                       # health, board, create_task
│   ├── static/tasks/styles.css        # Local responsive CSS
│   └── templates/tasks/board.html     # One accessible server-rendered surface
└── tests/
    └── test_public_http.py            # Five confirmed public seam behaviors
```

This layout keeps the Django-generated project boundary intact and gives the
single domain app ownership of its model, form, routes, template, CSS, admin,
and migration. It leaves no repository/service layer to unwind in Phase 25.
`[CITED: https://docs.djangoproject.com/en/5.2/intro/tutorial01/; VERIFIED: D-07]`

## Django Implementation Patterns

### URL and Request Flow

Use `taskboard.urls` as the root URLconf. Include `tasks.urls` at `""` and mount
`admin.site.urls` at `"admin/"`. In `tasks.urls`, name the routes `board`,
`create-task`, and `health`; keep the trailing slash on `tasks/` so POST data is
never exposed to `APPEND_SLASH` redirect behavior. `[CITED: https://docs.djangoproject.com/en/5.2/intro/tutorial01/; CITED: https://docs.djangoproject.com/en/5.2/ref/settings/#append-slash]`

```python
# Source: Django 5.2 URL dispatcher and request/response documentation.
urlpatterns = [
    path('', views.board, name='board'),
    path('tasks/', views.create_task, name='create-task'),
    path('health', views.health, name='health'),
]
```

### Model, Migration, and Ordering

Use the auto-created primary key, `title = models.CharField(max_length=200)`,
and `completed = models.BooleanField(default=False)`. Set
`Meta.ordering = ['id']`; the unique primary key gives deterministic creation
order without a second timestamp field. Run `makemigrations tasks` once and
commit model plus `0001_initial.py` together. `[CITED: https://docs.djangoproject.com/en/5.2/topics/migrations/; CITED: https://docs.djangoproject.com/en/5.2/ref/models/options/#ordering]`

### ModelForm and PRG

Expose only `title` in `TaskForm.Meta.fields`. Use the error copy
`Enter a task title.` for the `required` key. Django's form `CharField` strips
leading/trailing whitespace by default, so whitespace-only input reaches the
required error. A valid POST calls `form.save()` and returns
`redirect('tasks:board')`; a later independent GET proves the write. An invalid
POST renders the same board template with the bound form and HTTP 200 so the
reader sees field feedback. `[CITED: https://docs.djangoproject.com/en/5.2/topics/forms/modelforms/; CITED: https://docs.djangoproject.com/en/5.2/ref/forms/fields/#charfield; CITED: https://docs.djangoproject.com/en/5.2/topics/http/shortcuts/]`

```python
# Source: Django 5.2 ModelForm and shortcuts documentation.
def create_task(request):
    form = TaskForm(request.POST)
    if form.is_valid():
        form.save()
        return redirect('tasks:board')
    return render(
        request,
        'tasks/board.html',
        {'form': form, 'tasks': Task.objects.all()},
    )
```

### Template and Admin

Render one `<main>` with a visible `<label for="id_title">`, bound field errors,
`{% csrf_token %}`, a submit button, task count, empty state, and semantic task
list. Render titles with normal Django template interpolation so autoescaping
remains active. Load only `{% static 'tasks/styles.css' %}` and ship no script.
Register `Task` in `tasks/admin.py`; direct `GET /admin/login/` remains the
Stage 1 public acceptance surface. `[CITED: https://docs.djangoproject.com/en/5.2/howto/csrf/; CITED: https://docs.djangoproject.com/en/5.2/intro/tutorial02/]`

### Public Test Seam

Use pytest-django's `client` fixture, mark database-using tests with
`@pytest.mark.django_db`, and assert status, redirect location, JSON, and
reader-visible HTML. Keep assertions away from ORM rows, private view helpers,
template context internals, and mock call counts. `[CITED: https://pytest-django.readthedocs.io/en/latest/helpers.html; VERIFIED: TDD skill]`

```python
# Source: pytest-django client/database helpers and the confirmed TDD seam.
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

The Stage 1 default test database is appropriate for health, empty-board,
form-write/read, validation, and admin-login behaviors because it matches the
stage's configured SQLite backend and pytest-django creates it from migrations
with per-test isolation. Phase 25 must use a real PostgreSQL service for both
Reference Application migration commands, Django's one-shot migration Job,
schema-aware readiness, restart/scale persistence, and administrator-backed
readback. `[CITED: https://docs.djangoproject.com/en/5.2/topics/testing/overview/; CITED: https://pytest-django.readthedocs.io/en/latest/database.html; VERIFIED: D-03 and Phase 25 roadmap]`

## TDD Commit Sequence

Lock approved dependencies before generating Django source. Delete the sample
`README.md` and `main.py` created by `uv init --app`, then commit the exact
five-file dependency baseline. Generate the Django project/app in the next
commit with custom routes absent. Execute exactly one test and one
behavior-complete GREEN change per slice; run the accumulated suite before
every GREEN commit. `[VERIFIED: TDD skill]`

| Order | Commit Subject | Public Observation |
|-------|----------------|--------------------|
| 1 | `chore(24-01): lock approved Django dependencies` | Python 3.12, the exact dependency groups, lock, and runtime export reproduce from five tracked files. |
| 2 | `chore(24-02): initialize Django project` | pytest starts, settings load, SQLite is configured, and custom public routes remain absent. |
| 3 | `test(24-02): specify public health` | RED reaches Django and fails on missing `/health`. |
| 4 | `feat(24-02): add public health endpoint` | `GET /health` returns exact 200 JSON. |
| 5 | `test(24-03): specify empty task board` | RED reaches Django and fails on the absent rendered board. |
| 6 | `feat(24-03): render empty task board` | `GET /` shows form, count, empty state, CSRF field, and CSS; GREEN adds Task model and initial migration. |
| 7 | `test(24-04): specify task creation and listing` | RED fails on the absent POST workflow. |
| 8 | `feat(24-04): create tasks through rendered workflow` | POST redirects; a separate GET displays the incomplete task. |
| 9 | `test(24-04): specify invalid task feedback` | RED fails on the stable validation-copy contract. |
| 10 | `feat(24-04): render task form errors` | Whitespace title shows stable error and a later GET remains empty. |
| 11 | `test(24-04): specify administration login` | RED fails on the absent framework-native login. |
| 12 | `feat(24-04): expose Django administration` | `GET /admin/login/` shows Django login controls; GREEN mounts admin and registers Task. |
| 13 | `docs(24-05): document Stage 1 reader workflow` | README, lock/export, migration, smoke, and publication inputs are frozen. |

Each RED commit must fail for its named missing behavior and be the direct
parent of its GREEN commit. Preserve the failure output in plan summaries and
verify all 13 ordered subjects locally and in the fresh public tag clone.
Refactoring belongs in the post-slice review and preserves every public
assertion. `[VERIFIED: TDD skill and Phase 23 verification pattern]`

## Project Constraints (from AGENTS.md)

- Planning, source, code comments, commit messages, and PR text are English. `[VERIFIED: AGENTS.md]`
- Start file-changing work through the active GSD workflow and keep planning artifacts synchronized. `[VERIFIED: AGENTS.md]`
- Keep edits surgical and evidence-backed. Phase 24 creates the separate Django Reference Application; the Sealos.io Next.js source tree has no implementation role in this phase. `[VERIFIED: AGENTS.md and 24-CONTEXT.md]`
- Preserve the existing Sealos.io stack and deployment model. This phase records planning only in the current repository. `[VERIFIED: AGENTS.md]`
- No project-defined skills exist; the requested TDD skill supplies the test discipline. `[VERIFIED: AGENTS.md and project skill scan]`

## Don't Hand-Roll

| Problem | Use | Reason |
|---------|-----|--------|
| Routing and method dispatch | Django `path()`, `include()`, and view decorators | Keeps URL resolution and middleware on the public framework seam. `[CITED: https://docs.djangoproject.com/en/5.2/intro/tutorial01/]` |
| Validation and persistence mapping | `ModelForm` with `fields = ['title']` | Reuses required/max-length validation and prevents writable `completed` input. `[CITED: https://docs.djangoproject.com/en/5.2/topics/forms/modelforms/]` |
| Schema ownership | Django migrations | Gives Phase 25 a real migration history and fresh-database upgrade path. `[CITED: https://docs.djangoproject.com/en/5.2/topics/migrations/]` |
| Administration and authentication | `django.contrib.admin` and `django.contrib.auth` | Supplies the required framework-native login and later administrator path. `[CITED: https://docs.djangoproject.com/en/5.2/intro/tutorial02/]` |
| CSRF and escaping | Django middleware, `{% csrf_token %}`, template autoescape | Protects the public form and task-title rendering. `[CITED: https://docs.djangoproject.com/en/5.2/howto/csrf/]` |
| Test database lifecycle | pytest-django `django_db` | Applies migrations and isolates each behavior through Django's test database. `[CITED: https://pytest-django.readthedocs.io/en/latest/database.html]` |

## Common Pitfalls

1. **A passing POST test that hides the read seam.** `follow=True` combines the redirect and page read. Assert 302 and `Location`, then issue a separate GET so D-05 visibly proves persistence. `[VERIFIED: D-05]`
2. **Testing ORM state directly.** Row assertions couple tests to internals and weaken the Phase 25 database swap. Observe every write through the later rendered page. `[VERIFIED: TDD skill]`
3. **Uncommitted or drifting migrations.** A local `db.sqlite3` can hide a missing migration. Ignore the file, delete it before replay, run `makemigrations --check --dry-run`, then migrate a fresh database. `[CITED: https://docs.djangoproject.com/en/5.2/topics/migrations/]`
4. **Unstable task order.** Database order is unspecified without an ordering over unique fields. Use `Meta.ordering = ['id']`. `[CITED: https://docs.djangoproject.com/en/5.2/ref/models/options/#ordering]`
5. **Mass assignment through the form.** `fields = '__all__'` would expose later model fields. Keep the explicit title allowlist and let the model default create incomplete tasks. `[CITED: https://docs.djangoproject.com/en/5.2/topics/forms/modelforms/]`
6. **CSRF confidence from the default test client.** Django's test client relaxes CSRF checks by default. Assert the hidden token in HTML and include one live browser form submission in local acceptance. `[CITED: https://docs.djangoproject.com/en/5.2/topics/testing/tools/; CITED: https://docs.djangoproject.com/en/5.2/howto/csrf/]`
7. **POSTing to `/tasks` without the trailing slash.** `APPEND_SLASH` may redirect and lose POST data. The reader contract and form action use `/tasks/`. `[CITED: https://docs.djangoproject.com/en/5.2/ref/settings/#append-slash]`
8. **Treating runserver as production.** `runserver` serves this locked development stage only; Phase 26 owns Gunicorn and production settings. `[CITED: https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/; VERIFIED: D-07]`
9. **Publishing before exact replay.** Create the public repository and protected tag after local suite, lock/export, fresh migration, and port smoke pass. Verify both annotated tag object and peeled commit. `[VERIFIED: D-06 and Phase 23 verification pattern]`
10. **Leaving acceptance residue.** Own the runserver PID, require port 8000 free before launch, stop it through a trap, and remove temporary clones plus generated SQLite databases. `[VERIFIED: D-07]`

## Security Domain

| ASVS Category | Applies | Stage 1 Control |
|---------------|---------|-----------------|
| V2 Authentication | Yes | Django admin/auth owns the login surface; Stage 1 verifies login-page access only. `[CITED: https://docs.djangoproject.com/en/5.2/intro/tutorial02/]` |
| V3 Session Management | Yes | Retain Django session middleware and generated auth migrations. `[CITED: https://docs.djangoproject.com/en/5.2/intro/tutorial02/]` |
| V4 Access Control | Yes | Admin content remains protected by Django admin; the Task Board and health endpoint are public by decision. `[VERIFIED: D-01 and D-02]` |
| V5 Input Validation | Yes | `ModelForm` exposes title only, enforces required/max length, and strips whitespace. `[CITED: https://docs.djangoproject.com/en/5.2/topics/forms/modelforms/]` |
| V6 Cryptography | Limited | Use a clearly labeled local-development `SECRET_KEY` fallback in Stage 1; Phase 26 must load a production random key from secret configuration. `[CITED: https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/#secret-key]` |

Keep `CsrfViewMiddleware`, include `{% csrf_token %}`, retain template
autoescaping, and avoid `|safe` for task titles. Keep `DEBUG=True` and local
host handling explicitly documented as Stage 1 development settings. Phase 26
must set `DEBUG=False`, production `ALLOWED_HOSTS`, secure cookies, and a secret
key from the environment. `[CITED: https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/; CITED: https://docs.djangoproject.com/en/5.2/ref/settings/#allowed-hosts]`

## Environment Availability

| Dependency | Required By | Available | Version / State | Planner Action |
|------------|-------------|-----------|-----------------|----------------|
| Python 3.12 | Runtime and uv resolution | Yes | `python3.12` 3.12.13 | Use it for lock and replay. `[VERIFIED: local CLI]` |
| uv | Lock/sync/export/run | Yes | 0.10.9 | Record version in evidence. `[VERIFIED: local CLI]` |
| Git | RED/GREEN history, tags, clones | Yes | 2.50.1 | Use HTTPS remote. `[VERIFIED: local CLI]` |
| GitHub CLI | Repository/ruleset publication | Yes | 2.86.0, authenticated as `yangchuansheng` | Query state before mutation. `[VERIFIED: local CLI]` |
| curl | Port-8000 smoke | Yes | 8.7.1 | Use bounded retries. `[VERIFIED: local CLI]` |
| jq | Ruleset payload/readback | Yes | 1.7.1 | Build structured API payloads. `[VERIFIED: local CLI]` |
| Local Django repository | Phase implementation | Pending creation | `/Users/longnv/bin/repo/sealos-django-tutorial` absent | Create in the first execution plan. `[VERIFIED: filesystem probe]` |
| Public Django repository | D-06 publication | Pending creation | GitHub repository absent | Publish only accepted HEAD. `[VERIFIED: GitHub query]` |
| TCP port 8000 | Local smoke | Yes | Free at research time | Recheck immediately before launch. `[VERIFIED: local probe]` |
| PostgreSQL | Phase 25 integration | Deferred | Outside Stage 1 | Phase 25 provisions and tests a real service. `[VERIFIED: D-03 and deferred scope]` |

No missing dependency blocks planning. Repository creation is intentional phase
work. `[VERIFIED: environment probes]`

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | pytest 9.1.1 + pytest-django 4.12.0 + Django 5.2.16 test client |
| Config file | `pyproject.toml` created in Wave 0 |
| Public seam file | `tests/test_public_http.py` created in Wave 0 |
| Quick command | `uv run pytest -q tests/test_public_http.py -x` |
| Full command | `uv run pytest -q` |

### DJAN-01 Test Map

| Behavior | Test | Automated Command | Initial State |
|----------|------|-------------------|---------------|
| Exact public health JSON | `test_health_is_public` | `uv run pytest -q tests/test_public_http.py::test_health_is_public -x` | Wave 0 gap |
| Accessible empty rendered board | `test_empty_task_board_is_rendered` | `uv run pytest -q tests/test_public_http.py::test_empty_task_board_is_rendered -x` | Wave 0 gap |
| ModelForm create, PRG, later list read | `test_task_creation_redirects_then_appears_on_board` | `uv run pytest -q tests/test_public_http.py::test_task_creation_redirects_then_appears_on_board -x` | Wave 0 gap |
| Whitespace title feedback and no public record | `test_invalid_task_title_shows_feedback_without_creating_task` | `uv run pytest -q tests/test_public_http.py::test_invalid_task_title_shows_feedback_without_creating_task -x` | Wave 0 gap |
| Framework-native admin login | `test_admin_login_is_public` | `uv run pytest -q tests/test_public_http.py::test_admin_login_is_public -x` | Wave 0 gap |

### Wave 0

1. Create the repository, `.python-version`, `pyproject.toml`, lock/export, and
   exact five-file dependency inventory after the package-verification
   checkpoint. Remove the two `uv init --app` sample files before the first
   commit.
2. Generate the Django project/app package in Plan 24-02, configure pytest and
   SQLite, create `tests/test_public_http.py` with imports only, and start with
   custom URL patterns empty.
3. Add exactly one test in each RED commit and establish baseline commands:

```bash
uv sync --locked
uv run python -m django --version | grep '^5\.2\.16$'
uv run python manage.py check
uv run pytest --collect-only -q
```

### Per-Task Commands

**Foundation and schema:**

```bash
uv lock --check
uv sync --locked
uv run python manage.py makemigrations --check --dry-run
uv run python manage.py migrate --noinput
uv run python manage.py showmigrations tasks | grep -F '[X] 0001_initial'
uv export --locked --no-dev --no-emit-project --no-hashes \
  --format requirements.txt --output-file requirements.txt
git diff --exit-code -- uv.lock requirements.txt
```

**Every RED commit:** run its node command and require failure for the named
missing public behavior. **Every GREEN commit:** rerun that node, then run the
accumulated file:

```bash
uv run pytest -q tests/test_public_http.py -x
uv run python manage.py check
```

**Pre-publication phase gate:**

```bash
rm -f db.sqlite3
uv run python manage.py migrate --noinput
uv run python manage.py makemigrations --check --dry-run
uv run pytest -q
test "$(rg -c '^def test_' tests/test_public_http.py)" -eq 5
uv lock --check
uv export --locked --no-dev --no-emit-project --no-hashes \
  --format requirements.txt --output-file requirements.txt
git diff --exit-code
```

Launch an owned server with
`uv run python manage.py runserver 0.0.0.0:8000 --noreload`, fail when port 8000
already has a listener, poll the child PID and health endpoint with a bounded
retry, and verify:

```bash
curl --fail --silent http://127.0.0.1:8000/health \
  | jq -e '. == {"status":"ok"}'
curl --fail --silent http://127.0.0.1:8000/ \
  | grep -F 'Task Board'
curl --fail --silent http://127.0.0.1:8000/admin/login/ \
  | grep -F 'Django administration'
```

Perform one browser form submission to exercise real CSRF middleware, then
stop the owned PID and remove `db.sqlite3`. `[CITED: https://docs.djangoproject.com/en/5.2/ref/django-admin/#runserver; VERIFIED: D-07]`

**Publication and fresh-clone gate:** create/query the public repository,
require public visibility and `main == ACCEPTED_HEAD`, create one active tag
ruleset targeting `refs/tags/stage-*` with `update` and `deletion` rules plus an
empty bypass list, then create and push the annotated tag only from accepted
HEAD. In a temporary directory run:

```bash
git clone --branch stage-1-deploy \
  https://github.com/yangchuansheng/sealos-django-tutorial.git repo
cd repo
uv sync --locked
uv lock --check
uv run python manage.py migrate --noinput
uv run pytest -q
uv export --locked --no-dev --no-emit-project --no-hashes \
  --format requirements.txt --output-file requirements.txt
git diff --exit-code
```

Also run the port-8000 smoke in the clone, require the tag object type `tag`,
and compare local/remote direct tag object plus peeled commit with
`ACCEPTED_HEAD`. Remove clone and generated database afterward.
`[CITED: https://git-scm.com/docs/git-tag; CITED: https://docs.github.com/en/rest/repos/rules#create-a-repository-ruleset; VERIFIED: D-06 and D-07]`

### Sampling Rate

- **Per RED/GREEN task:** named test, accumulated public file, `manage.py check`.
- **Per plan:** full public suite, migration drift check, lock/export diff.
- **Phase gate:** fresh SQLite migration, five tests, live port 8000, browser
  form submit, annotated/protected public tag, and independent fresh-clone replay.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `taskboard` and `tasks` are the selected project/app package names. | Layout | Low; both are within agent discretion and must remain consistent across settings, imports, and tests. |
| A2 | Invalid bound forms return HTTP 200 with inline feedback. | ModelForm and PRG | Low; the locked behavior requires feedback and leaves the exact status to implementation discretion. |
| A3 | `Meta.ordering = ['id']` expresses stable creation order. | Model | Low; the auto-generated integer primary key is unique and monotonic for this Stage 1 workflow. |

These are implementation recommendations inside explicit agent discretion.
`[VERIFIED: 24-CONTEXT.md]`

## Open Questions (RESOLVED)

1. **RESOLVED: pytest-django 4.12.0 publication metadata.** PyPI and the
   official Git tag confirm the release while the latest official changelog
   labels it unreleased. Preserve the locked version and record the discrepancy
   at the mandatory package checkpoint before installation.
   `[VERIFIED: official PyPI and GitHub metadata; CITED: https://pytest-django.readthedocs.io/en/latest/changelog.html]`

No user decision is required for the Django architecture or test seams.
`[VERIFIED: D-01 through D-07]`

## Sources

### Primary / Official

- [Django 5.2 tutorial, project/app structure and URLconf](https://docs.djangoproject.com/en/5.2/intro/tutorial01/)
- [Django 5.2 database and admin tutorial](https://docs.djangoproject.com/en/5.2/intro/tutorial02/)
- [Django 5.2 ModelForm documentation](https://docs.djangoproject.com/en/5.2/topics/forms/modelforms/)
- [Django 5.2 test client](https://docs.djangoproject.com/en/5.2/topics/testing/tools/)
- [Django 5.2 test database](https://docs.djangoproject.com/en/5.2/topics/testing/overview/)
- [Django 5.2 migrations](https://docs.djangoproject.com/en/5.2/topics/migrations/)
- [Django 5.2 runserver](https://docs.djangoproject.com/en/5.2/ref/django-admin/#runserver)
- [Django 5.2 deployment checklist](https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/)
- [Django 5.2 CSRF guidance](https://docs.djangoproject.com/en/5.2/howto/csrf/)
- [Django supported versions](https://www.djangoproject.com/download/)
- [pytest-django configuration](https://pytest-django.readthedocs.io/en/latest/configuring_django.html)
- [pytest-django database lifecycle](https://pytest-django.readthedocs.io/en/latest/database.html)
- [pytest-django client helpers](https://pytest-django.readthedocs.io/en/latest/helpers.html)
- [uv locking and syncing](https://docs.astral.sh/uv/concepts/projects/sync/)
- [uv lock export](https://docs.astral.sh/uv/concepts/projects/export/)
- [Git annotated tags](https://git-scm.com/docs/git-tag)
- [GitHub ruleset protections](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets)
- [GitHub repository ruleset API](https://docs.github.com/en/rest/repos/rules#create-a-repository-ruleset)
- PyPI JSON metadata for `Django==5.2.16`, `pytest==9.1.1`, and
  `pytest-django==4.12.0`. `[VERIFIED: pypi.org JSON API]`

### Repository Evidence

- `.planning/phases/24-django-deploy-stage/24-CONTEXT.md`
- `.planning/REQUIREMENTS.md` (`DJAN-01`)
- `.planning/ROADMAP.md` (Phases 24-26 boundaries)
- `.planning/phases/23-fastapi-production-stage/23-VERIFICATION.md`
- `/Users/longnv/bin/repo/sealos-fastapi-tutorial` accepted lock/export,
  RED/GREEN, annotated-tag, ruleset, clone-replay, and cleanup pattern.
- `/Users/longnv/.agents/skills/tdd/{SKILL.md,tests.md,mocking.md}`

## Metadata

**Confidence breakdown:**
- Locked scope and phase boundary: HIGH - copied from confirmed context.
- Package versions and repository identity: HIGH for exact metadata; SUS gate
  retained for planner checkpoint.
- Django architecture and public seams: MEDIUM - official documentation plus
  locked user decisions.
- Validation and publication pattern: HIGH - commands are locally available and
  mirror the independently verified prior three-stage repository workflow.

**Research date:** 2026-07-16
**Valid until:** 2026-08-15; re-run package metadata and legitimacy checks at
implementation because all three exact releases are recent.
