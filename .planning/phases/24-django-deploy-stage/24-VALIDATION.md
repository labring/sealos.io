---
phase: 24
slug: django-deploy-stage
status: approved
nyquist_compliant: true
wave_0_complete: false
created: 2026-07-16
---

# Phase 24 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | pytest 9.1.1, pytest-django 4.12.0, Django 5.2.16 test client |
| **Config file** | `/Users/longnv/bin/repo/sealos-django-tutorial/pyproject.toml` - Wave 0 creates it |
| **Public seam file** | `/Users/longnv/bin/repo/sealos-django-tutorial/tests/test_public_http.py` - Wave 0 creates it |
| **Quick run command** | `uv run pytest -q tests/test_public_http.py -x` |
| **Full suite command** | `uv run pytest -q` |
| **Estimated runtime** | Under 10 seconds |

---

## Sampling Rate

- **After every RED commit:** Run the single named test and retain its expected
  public-behavior failure.
- **After every GREEN commit:** Run the named test, the accumulated public seam
  file, and `uv run python manage.py check`.
- **After every task commit:** Run `uv run pytest -q tests/test_public_http.py -x`.
- **After every plan wave:** Run the full suite, migration drift check, and
  lock/export check.
- **Before `$gsd-verify-work`:** Run the fresh SQLite migration, full suite,
  port-8000 HTTP and browser smoke, public clone, and protected-tag gates.
- **Max feedback latency:** 10 seconds for focused local public HTTP tests.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 24-01-01 | 01 | 1 | DJAN-01 | T-24-01 | Exact approved packages, migration ownership, and runtime export reproduce | dependency/schema | `uv lock --check && uv sync --locked && uv run python manage.py makemigrations --check --dry-run && uv run python manage.py migrate --noinput && uv export --locked --no-dev --no-emit-project --no-hashes --format requirements.txt --output-file requirements.txt && git diff --exit-code -- uv.lock requirements.txt` | W0 | pending |
| 24-01-02 | 01 | 1 | DJAN-01 | Health exposes one bounded public status field | HTTP behavior | `uv run pytest -q tests/test_public_http.py::test_health_is_public -x` | W0 | pending |
| 24-02-01 | 02 | 2 | DJAN-01 | Empty board renders an escaped, CSRF-bearing form and stable empty state | HTTP behavior | `uv run pytest -q tests/test_public_http.py::test_empty_task_board_is_rendered -x` | W0 | pending |
| 24-02-02 | 02 | 2 | DJAN-01 | Valid title uses CSRF-protected POST/redirect/GET and later page read | HTTP behavior | `uv run pytest -q tests/test_public_http.py::test_task_creation_redirects_then_appears_on_board -x` | W0 | pending |
| 24-02-03 | 02 | 2 | DJAN-01 | Whitespace title returns bounded inline feedback and creates no visible task | HTTP behavior | `uv run pytest -q tests/test_public_http.py::test_invalid_task_title_shows_feedback_without_creating_task -x` | W0 | pending |
| 24-02-04 | 02 | 2 | DJAN-01 | Framework-native admin login is public while protected admin content remains authenticated | HTTP behavior | `uv run pytest -q tests/test_public_http.py::test_admin_login_is_public -x` | W0 | pending |
| 24-03-01 | 03 | 3 | DJAN-01 | Reader setup, migration, test, run, and HTTP commands reproduce from source | reader replay | `rm -f db.sqlite3 && uv run python manage.py migrate --noinput && uv run pytest -q && uv run python manage.py makemigrations --check --dry-run && git diff --exit-code` | W0 | pending |
| 24-03-02 | 03 | 3 | DJAN-01 | Protected annotated tag and public clone resolve the accepted source exactly | publication | `git ls-remote --tags origin refs/tags/stage-1-deploy refs/tags/stage-1-deploy^{} && gh api repos/yangchuansheng/sealos-django-tutorial/rulesets` | W0 | pending |

*Status: pending, green, red, or flaky.*

---

## Wave 0 Requirements

- [ ] `/Users/longnv/bin/repo/sealos-django-tutorial/pyproject.toml` - exact
  Python, runtime, development, and pytest configuration.
- [ ] `/Users/longnv/bin/repo/sealos-django-tutorial/uv.lock` - locked Python
  3.12 dependency graph.
- [ ] `/Users/longnv/bin/repo/sealos-django-tutorial/requirements.txt` - exact
  runtime-only compatibility export.
- [ ] `/Users/longnv/bin/repo/sealos-django-tutorial/manage.py` and
  `/Users/longnv/bin/repo/sealos-django-tutorial/taskboard/` - importable Django
  foundation with custom public routes initially absent.
- [ ] `/Users/longnv/bin/repo/sealos-django-tutorial/tasks/` - domain app,
  committed initial migration, template, CSS, form, routes, and admin
  registration added only by their owning slices.
- [ ] `/Users/longnv/bin/repo/sealos-django-tutorial/tests/test_public_http.py` -
  the confirmed public behavior seam.
- [ ] Package checkpoint evidence - exact PyPI version, Python requirement,
  official repository URL, official release ref, and recorded SUS explanation
  for Django, pytest, and pytest-django before installation.

---

## Phase Gate Commands

| Gate | Command | Observable result |
|------|---------|-------------------|
| Public HTTP contract | `test "$(rg -c '^def test_[A-Za-z0-9_]+\(' tests/test_public_http.py)" -eq 5 && uv run pytest -q` | Exactly five named public behaviors pass. |
| Migration ownership | `rm -f db.sqlite3 && uv run python manage.py makemigrations --check --dry-run && uv run python manage.py migrate --noinput && uv run python manage.py showmigrations tasks` | No migration drift; `tasks.0001_initial` is applied to a fresh database. |
| Reproducible dependencies | `uv sync --locked && uv lock --check && uv export --locked --no-dev --no-emit-project --no-hashes --format requirements.txt --output-file requirements.txt && git diff --exit-code -- uv.lock requirements.txt` | Exit 0 and the runtime export excludes pytest packages. |
| Port 8000 | Owned `manage.py runserver 0.0.0.0:8000 --noreload` plus bounded requests to `/health`, `/`, `/tasks/`, and `/admin/login/` | Health JSON, rendered board, CSRF-protected creation/readback, and admin login succeed. |
| Public clone | Clone `stage-1-deploy`, then repeat lock, migration, suite, export, and port smoke | Clean HTTPS clone reproduces the accepted reader contract. |
| Tag integrity | Compare local HEAD, public main, direct tag object, peeled tag commit, annotated message, and active ruleset | Exact identities match and update/deletion protection has an empty bypass list. |
| Cleanup | Query owned server PID, port 8000, temporary clone, and generated databases | Every temporary local artifact is absent. |

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Browser-rendered Task Board form workflow | DJAN-01 | Confirms the real browser receives CSRF state, submits the form, follows the redirect, and renders the new task with local CSS | Open the owned port-8000 server, create one disposable task through the visible form, confirm the later board page and admin login render correctly, then stop the server and delete `db.sqlite3`. |

All contract behavior also has automated HTTP coverage. The browser check adds
real user-agent and CSRF evidence without replacing the automated gate.

---

## Validation Sign-Off

- [x] All anticipated tasks have an automated command or Wave 0 dependency.
- [x] Sampling continuity allows no three consecutive tasks without automated verification.
- [x] Wave 0 covers every missing test, dependency, project, and migration artifact.
- [x] Commands use terminating test modes and bounded server lifecycle checks.
- [x] Local HTTP feedback latency target is under 10 seconds.
- [x] `nyquist_compliant: true` is set in frontmatter.

**Approval:** approved 2026-07-16 for planning
