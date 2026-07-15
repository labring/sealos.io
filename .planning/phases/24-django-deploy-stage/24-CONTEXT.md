# Phase 24: Django Deploy Stage - Context

**Gathered:** 2026-07-15
**Status:** Ready for planning
**Source:** Confirmed milestone decisions plus the verified FastAPI three-stage pattern

<domain>
## Phase Boundary

Deliver the first reproducible source stage of the public Django `Task Board`
Reference Application. This phase ends when a reader can clone the protected
deploy stage, reproduce its Python 3.12 environment, migrate its local SQLite
database, start Django on `0.0.0.0:8000`, create and list tasks through rendered
pages, and open the framework-native administration login.

</domain>

<decisions>
## Implementation Decisions

### Rendered Task Workflow

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

### Health and Administration

- **D-02:** Expose `GET /health` as public JSON with the exact payload
  `{"status": "ok"}` and HTTP 200. Bind local execution to
  `0.0.0.0:8000`.
- Mount Django administration at `/admin/`, register `Task`, and verify the
  framework-native login surface at `GET /admin/login/` through public HTTP.
- Stage 1 proves the administration entry point. Administrator-backed task
  creation and readback remain Phase 25 acceptance work.

### Stage 1 Persistence

- **D-03:** Use Django ORM with local SQLite for the deploy stage and commit the
  initial Task migration. Ignore the mutable `db.sqlite3` file.
- Run `python manage.py migrate` before local smoke acceptance. Phase 25 changes
  the database configuration to PostgreSQL while retaining the Task model and
  public page contract.
- Keep database configuration conventional and environment-ready without
  introducing PostgreSQL, psycopg, migration Jobs, or schema-aware readiness in
  this phase.

### Reproducible Python Baseline

- **D-04:** Use Python 3.12, Django 5.2 LTS at current patch 5.2.16, `uv`,
  `pyproject.toml`, a committed `uv.lock`, and an exact runtime-only
  `requirements.txt` export.
- Use pytest 9.1.1 and pytest-django 4.12.0 as development dependencies. Verify
  exact PyPI metadata and official repository identities before locking.
- Include clean setup, migration, test, run, and HTTP verification commands in
  `README.md`.

### Behavior-First Delivery

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

### Public Repository and Stage Identity

- **D-06:** Build the local repository at
  `/Users/longnv/bin/repo/sealos-django-tutorial` and publish it as
  `https://github.com/yangchuansheng/sealos-django-tutorial`.
- Preserve the accepted source as the annotated `stage-1-deploy` tag, keep
  public `main` available for later stages, and protect `refs/tags/stage-*`
  against updates and deletion with no bypass.
- Accept publication only after a fresh public HTTPS clone reproduces the lock,
  runtime export, migrations, focused suite, port-8000 health, rendered board,
  and admin login.

### Stage Fence and Cleanup

- **D-07:** Keep psycopg 3, the PostgreSQL migration Job, schema-aware
  readiness, Gunicorn, WhiteNoise, `collectstatic`, production containers,
  immutable images, and rollback outside the Stage 1 tracked source.
- Stop every local development server and delete each temporary clone and
  generated local database after acceptance. Retain the public source
  repository, protected tag, and redacted planning evidence.

### the agent's Discretion

- Choose compact Django project and application package names.
- Choose the exact CSS tokens, task-row markup, form error copy, and stable
  ordering expression within the locked rendered-page contract.
- Choose the focused test filenames and bounded local server smoke harness.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

- `.planning/ROADMAP.md` - Phase 24 goal, scope, and success criteria.
- `.planning/REQUIREMENTS.md` - DJAN-01 reader contract.
- `.planning/quick/260715-e9k-define-fastapi-and-django-tutorial-expan/260715-e9k-CONTEXT.md`
  - milestone-wide repository, runtime, TDD, evidence, and cleanup decisions.
- `.planning/phases/23-fastapi-production-stage/23-VERIFICATION.md` - accepted
  three-stage source, publication, protection, replay, and cleanup pattern.
- `CONTEXT.md` - canonical Framework Tutorial Series, Reference Application,
  Practice Evidence, and Task Board language.
- `AGENTS.md` - repository execution, language, GSD, and response rules.
- `/Users/longnv/bin/repo/sealos-fastapi-tutorial` - verified public Python
  Reference Application pattern for exact locks, RED/GREEN history, stage
  publication, and public replay.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- The FastAPI Reference Application supplies the proven Python 3.12 `uv`
  lock/export, annotated-stage publication, tag-ruleset, public-clone, evidence,
  and cleanup patterns.
- Root `CONTEXT.md` supplies the canonical Task Board and Framework Tutorial
  Series vocabulary.

### Established Patterns

- Each Reference Application evolves in one public repository through three
  protected annotated source tags while `main` advances to the accepted stage.
- Tests observe public framework behavior, retain direct RED/GREEN history, and
  keep external collaborators real at the confirmed seam.
- Planning evidence lives outside immutable reader source so later public tags
  remain reproducible and free of credentials.

### Integration Points

- Phase 25 consumes the Stage 1 Task model, migration history, public page
  routes, and test seam when replacing SQLite with PostgreSQL.
- Phase 26 consumes the same Django project for Gunicorn, WhiteNoise,
  production container, image, rollout, rollback, and Stage 3 identity.
- Phase 27 consumes all three protected source stages and live Task Board
  behavior for tutorial practice and screenshots.

</code_context>

<specifics>
## Specific Ideas

- Keep the task form and list on one page so the Stage 1 screenshot shows the
  complete reader workflow in a single browser surface.
- Use the default Django administration appearance as recognizable
  framework-native evidence.
- Keep test names phrased as reader-visible behavior and replay the final source
  from the public annotated tag.

</specifics>

<deferred>
## Deferred Ideas

- PostgreSQL, psycopg 3, fresh-database migrations, the migration Job, and
  administrator-backed data readback remain Phase 25 scope.
- Gunicorn, WhiteNoise, `collectstatic`, non-root images, release logs,
  horizontal replicas, rollback, and recovery remain Phase 26 scope.
- Sealos Skills practice, measured duration, custom domain, tutorial prose, and
  screenshots remain Phase 27 scope.
- Tutorial matrix publication, static route validation, and milestone-wide
  cleanup remain Phase 28 scope.

</deferred>

---

*Phase: 24-django-deploy-stage*
*Context gathered: 2026-07-15 from confirmed decisions and verified prior-stage patterns*
