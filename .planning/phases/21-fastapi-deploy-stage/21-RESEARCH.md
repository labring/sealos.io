# Phase 21: FastAPI Deploy Stage - Research

**Researched:** 2026-07-15
**Domain:** FastAPI in-memory HTTP service, reproducible Python dependencies, and public Git stage publication
**Confidence:** HIGH for locked scope and local environment; MEDIUM for current package selection

<user_constraints>
## User Constraints (from CONTEXT.md)
### Locked Decisions
### D-01: Public HTTP Contract
- Expose `GET /health`, FastAPI's generated `GET /docs`, and in-memory task CRUD.
- Model each task with an integer `id`, string `title`, and boolean `completed`.
- Support `POST /tasks`, `GET /tasks`, `GET /tasks/{task_id}`,
  `PUT /tasks/{task_id}`, and `DELETE /tasks/{task_id}` through JSON HTTP.
- Bind the local application to `0.0.0.0:8000`.
### D-02: Public Repository and Stage Identity
- Build the local repository at
  `/Users/longnv/bin/repo/sealos-fastapi-tutorial`.
- Publish it as `https://github.com/yangchuansheng/sealos-fastapi-tutorial`.
- Preserve the completed Phase 21 source as the immutable
  `stage-1-deploy` tag.
- Keep `main` available for the PostgreSQL and production stages that follow.
### D-03: Reproducible Python Baseline
- Use Python 3.12, `uv`, `pyproject.toml`, and a committed `uv.lock`.
- Export exact runtime versions to `requirements.txt` from the lock file.
- Include clean setup, test, run, and HTTP verification commands in README.md.
### D-04: Behavior-First Delivery
- Drive the service through public HTTP tests with FastAPI TestClient.
- Record a failing behavior test before the smallest implementation that makes
  it pass, then repeat for the next behavior.
- Keep framework collaborators real. Use a boundary substitute only when a
  focused test cannot involve the external boundary.
- Retain readable red-green evidence in the repository history and test output.
### D-05: Stage Fence
- Keep Phase 21 task persistence in memory.
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
### Deferred Ideas (OUT OF SCOPE)
- Database persistence and migration ownership are Phase 22 scope.
- Production container hardening, immutable images, readiness, logs, and
  rollback are Phase 23 scope.
- Tutorial prose and screenshot assets are Phase 27 scope.
</user_constraints>
## Summary
Build Phase 21 as a compact application factory plus one public HTTP behavior
test file. A fresh app instance per test keeps in-memory IDs deterministic while
all setup and assertions remain at the HTTP seam. `[VERIFIED: phase context and TDD skill]`
Pin the five direct runtime/test packages selected below, commit `uv.lock`, and
derive runtime-only `requirements.txt` from that lock. Publish only after a
clean-clone test and port-8000 smoke pass, then protect and verify the annotated
`stage-1-deploy` tag. `[VERIFIED: local environment and official project docs]`
**Primary recommendation:** Execute nine vertical red-green HTTP slices, then
publish the exact green commit as a protected annotated tag.
<phase_requirements>
## Phase Requirements
| ID | Description | Research Support |
|----|-------------|------------------|
| FAST-01 | Reader can clone a public Tasks API stage exposing `/health`, `/docs`, and in-memory task CRUD on port 8000. | Layout, TDD sequence, lock/export workflow, clean-clone smoke, and tag verification below. |
</phase_requirements>
## Architectural Responsibility Map
| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|--------------|----------------|-----------|
| Health, docs, and task JSON | API / Backend | ASGI server | FastAPI owns routing and validation; Uvicorn exposes port 8000. `[CITED: https://fastapi.tiangolo.com/deployment/manually/]` |
| Task state | API process memory | - | The stage fence explicitly requires process-local persistence. `[VERIFIED: phase context]` |
| Behavior validation | Public HTTP seam | Test process | TestClient drives the same ASGI application through HTTPX. `[CITED: https://fastapi.tiangolo.com/tutorial/testing/]` |
| Stage identity | Git / GitHub | Public clone | An annotated tag resolves the exact accepted commit. `[CITED: https://git-scm.com/book/en/v2/Git-Basics-Tagging]` |
## Standard Stack
| Package | Version | Role | Evidence |
|---------|---------|------|----------|
| Python | 3.12 | Runtime family | Installed `3.12.13`; locked decision. `[VERIFIED: local environment]` |
| FastAPI | 0.139.0 | Routing, OpenAPI, Swagger UI | Current PyPI release; supports Python 3.12. `[VERIFIED: PyPI and FastAPI release notes]` |
| Pydantic | 2.13.4 | Request and response models | Current PyPI release; compatible with FastAPI constraint. `[VERIFIED: PyPI metadata]` |
| Uvicorn | 0.51.0 | Local ASGI server | Current PyPI release; supports Python 3.12. `[VERIFIED: PyPI metadata]` |
| HTTPX | 0.28.1 | TestClient transport | FastAPI testing docs require HTTPX. `[CITED: https://fastapi.tiangolo.com/tutorial/testing/]` |
| pytest | 9.1.1 | Behavior test runner | Current PyPI release; supports Python 3.12. `[VERIFIED: PyPI metadata]` |
| uv | 0.10.9 installed | Lock, sync, run, and export | Required flags are present locally. `[VERIFIED: local CLI]` |
Use exact direct constraints and a runtime-only compatibility export:
```bash
uv init --app --python 3.12
uv add 'fastapi==0.139.0' 'pydantic==2.13.4' 'uvicorn==0.51.0'
uv add --dev 'httpx==0.28.1' 'pytest==9.1.1'
uv sync --locked
uv export --locked --no-dev --no-emit-project --no-hashes \
  --format requirements.txt --output-file requirements.txt
```
`pyproject.toml` should use `requires-python = ">=3.12,<3.13"`; commit
`.python-version`, `uv.lock`, and the generated `requirements.txt` together.
`[VERIFIED: locked decision and uv CLI]`
## Package Legitimacy Audit
FastAPI, Uvicorn, Pydantic, HTTPX, and pytest each resolve to an established
official repository and current PyPI project. Before lock generation, verify
the exact pins through PyPI metadata, inspect the resolved graph with
`uv tree`, and retain `uv.lock` as the executable dependency record. D-03 and
the user's patch-version discretion authorize these compatible releases.
`[VERIFIED: package-legitimacy seam, PyPI metadata, and phase context]`
## Recommended Stage-1 Layout
```text
sealos-fastapi-tutorial/
├── app/
│   ├── __init__.py
│   └── main.py          # create_app(), models, process-local store, routes, app
├── tests/
│   └── test_api.py      # fixture plus public HTTP behavior tests
├── .gitignore
├── .python-version
├── pyproject.toml
├── uv.lock
├── requirements.txt
└── README.md
```
Keep models and the in-memory store in `app/main.py` for this stage. Use
`create_app()` to allocate a fresh dictionary and ID counter, and export
`app = create_app()` for Uvicorn. This creates a deterministic test boundary
without a premature repository abstraction. `[VERIFIED: TDD skill and D-05]`
Recommended observable contract: health returns `200 {"status":"ok"}`; create
returns `201`; missing tasks return `404 {"detail":"Task not found"}`; delete
returns `204`; invalid task bodies return FastAPI's `422` validation response.
Use `title` length bounds and default `completed=false`. `[CITED: FastAPI request-body and error conventions]`
## TDD and Commit Sequence
Create an empty FastAPI scaffold with generated docs temporarily disabled so
both `/health` and `/docs` begin with observable `404` responses. For each row,
commit the failing test, add only the passing behavior, run the focused test,
then commit the green implementation. `[VERIFIED: TDD skill]`
| Slice | Red test | Green behavior |
|-------|----------|----------------|
| 1 | `test_health_is_public` | `GET /health` returns the literal health payload. |
| 2 | `test_swagger_ui_is_public` | Enable generated `/docs`; assert HTML content type and Swagger marker. |
| 3 | `test_create_task` | `POST /tasks` validates input and assigns integer ID. |
| 4 | `test_list_tasks` | Create through HTTP, then list the exact created record. |
| 5 | `test_get_task` | Create through HTTP, then fetch by returned ID. |
| 6 | `test_update_task` | Create, update, then read the changed representation through HTTP. |
| 7 | `test_delete_task` | Create, delete, then observe `404` through HTTP. |
| 8 | `test_reject_invalid_task` | Empty title receives `422`. |
| 9 | `test_missing_task_returns_404` | Unknown integer ID receives the stable error body. |
Use `test(api): specify ...` for red commits and `feat(api): add ...` for green
commits. Keep prerequisites inside each test through HTTP calls against a fresh
`create_app()` fixture. `[VERIFIED: TDD skill]`
## Publication and Immutable Stage Sequence
After the full suite and local smoke are green:
```bash
gh repo create yangchuansheng/sealos-fastapi-tutorial --public \
  --source=. --remote=origin --push
git tag -a stage-1-deploy -m 'FastAPI deploy stage' HEAD
git push origin stage-1-deploy
gh repo view yangchuansheng/sealos-fastapi-tutorial \
  --json nameWithOwner,isPrivate,url,defaultBranchRef
git ls-remote --tags origin 'refs/tags/stage-1-deploy^{}'
```
Create an active GitHub tag ruleset for `refs/tags/stage-*` that restricts
updates and deletions, then read it back through the repository rulesets API.
GitHub documents tag rulesets for public repositories. `[CITED: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository]`
The peeled remote tag SHA must equal `git rev-parse HEAD`. A fresh public clone
at `stage-1-deploy` must pass `uv sync --locked`, the full suite, and the port
smoke before FAST-01 closes. `[VERIFIED: Git tagging docs and phase acceptance]`
## Common Risks and Phase Exclusions
- Test order can leak process-local records. A function-scoped `create_app()` fixture removes the coupling. `[VERIFIED: TDD analysis]`
- A runtime export can accidentally include pytest and HTTPX. `--no-dev` plus an absence check prevents that drift. `[VERIFIED: uv CLI]`
- A lightweight or movable tag weakens source identity. Use an annotated tag, compare the peeled SHA, and enforce the tag ruleset. `[CITED: Git and GitHub docs]`
- In-memory state clears on restart and has one-process concurrency limits. README must identify this as the Stage 1 boundary. `[VERIFIED: phase context]`
- Phase 21 excludes PostgreSQL, SQLAlchemy, Alembic, migration Jobs, Dockerfiles, image publication, Sealos deployment, tutorial prose, and screenshots. `[VERIFIED: phase context]`
## Project Constraints (from AGENTS.md)
Use a GSD workflow; write planning docs, code, comments, commits, and PR text
in English; keep implementation surgical; verify public behavior per slice;
keep framework collaborators real.
## Validation Architecture
### Test Framework
| Property | Value |
|----------|-------|
| Framework | pytest 9.1.1 + FastAPI TestClient/HTTPX 0.28.1 |
| Config file | `pyproject.toml` plus `tests/test_api.py` |
| Quick command | `uv run pytest tests/test_api.py -q -x` |
| Full command | `uv run pytest -q` |
### FAST-01 Test Map
| Behavior | Command | Observable result |
|----------|---------|-------------------|
| Public health and docs | `uv run pytest tests/test_api.py -q -k 'health or swagger'` | Two passing HTTP tests; health literal and Swagger HTML verified. |
| In-memory CRUD and errors | `uv run pytest tests/test_api.py -q -k 'task'` | Seven passing tests covering create/list/get/update/delete/invalid/missing. |
| Lock and export reproducibility | `uv sync --locked && uv lock --check && uv export --locked --no-dev --no-emit-project --no-hashes --format requirements.txt -o requirements.txt && git diff --exit-code -- uv.lock requirements.txt` | Exit 0 and committed generated files remain unchanged. |
| Port 8000 smoke | `uv run uvicorn app.main:app --host 0.0.0.0 --port 8000` plus `curl --fail http://127.0.0.1:8000/health` and `curl --fail http://127.0.0.1:8000/docs` | Health JSON and successful Swagger HTML response. |
| Public stage clone | Clone `--branch stage-1-deploy --depth 1`, then run `uv sync --locked && uv run pytest -q` | Nine tests pass from the public tag. |
| Tag integrity | Compare `git rev-parse HEAD` with the peeled `git ls-remote` tag SHA and query the active ruleset | Equal SHAs; update/deletion protections are active. |
### Sampling Rate
- **Per red commit:** Run the one named test and retain its expected failure output.
- **Per green commit:** Run the one named test with `-q -x` and observe a pass.
- **Per CRUD wave:** Run `uv run pytest tests/test_api.py -q -x`.
- **Phase gate:** Run lock/export, full suite, port smoke, public clone, and tag integrity checks.
### Wave 0 Gaps
- [ ] `pyproject.toml` with exact dependencies and pytest configuration.
- [ ] `app/main.py` empty public seam and application factory.
- [ ] `tests/test_api.py` function-scoped TestClient fixture and first failing test.
- [ ] `uv.lock` and runtime-only `requirements.txt` generated after package checkpoint.
## Security Domain
| ASVS category | Applies | Phase control |
|---------------|---------|---------------|
| V2 Authentication | No | Public tutorial API carries no identity contract. `[VERIFIED: phase context]` |
| V3 Session Management | No | The service has no session state. `[VERIFIED: phase context]` |
| V4 Access Control | No | Every Stage 1 endpoint is public. `[VERIFIED: phase context]` |
| V5 Input Validation | Yes | Pydantic validates JSON types, title bounds, and integer paths. `[CITED: FastAPI/Pydantic docs]` |
| V6 Cryptography | No | Phase 21 processes no credentials or protected data. `[VERIFIED: phase context]` |
Keep error bodies free of stack traces and cap title length to bound individual
request memory. The Stage 1 README should state its educational, process-local
data boundary. `[VERIFIED: security analysis]`
## Environment Availability
| Dependency | Available | Version / state |
|------------|-----------|-----------------|
| Python 3.12 | Yes | 3.12.13 |
| uv | Yes | 0.10.9 with every required flag |
| Git | Yes | 2.50.1 |
| GitHub CLI | Yes | 2.86.0, authenticated as `yangchuansheng` with repository scope |
| Local target | Ready | Target directory absent |
| Public target | Ready | Repository absent before Phase 21 publication |
No environment blocker was found. `[VERIFIED: local probes]`
## Assumptions Log
All implementation decisions are locked or backed by official documentation,
registry metadata, the package-legitimacy seam, and local environment probes.
## Sources
Primary sources: FastAPI testing, metadata, deployment, and release docs;
Astral uv dependency and export docs; PyPI metadata; Git tagging docs; GitHub
tag-push, repository-creation, and ruleset docs.
## Metadata
**Confidence breakdown:** Stack MEDIUM due fresh releases and required package
checkpoint; architecture HIGH from locked scope; validation HIGH from the
confirmed HTTP seam and installed tooling.
**Valid until:** 2026-07-22 for package versions; phase architecture remains
valid while `21-CONTEXT.md` stays unchanged.
