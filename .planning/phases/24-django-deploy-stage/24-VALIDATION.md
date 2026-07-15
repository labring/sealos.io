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

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | pytest 9.1.1, pytest-django 4.12.0, Django 5.2.16 test client |
| **Config file** | `/Users/longnv/bin/repo/sealos-django-tutorial/pyproject.toml` - Plan 24-01 creates it |
| **Public seam file** | `/Users/longnv/bin/repo/sealos-django-tutorial/tests/test_public_http.py` - Plan 24-02 creates it |
| **Quick run command** | `uv run pytest -q tests/test_public_http.py -x` |
| **Full suite command** | `uv run pytest -q` |
| **Estimated runtime** | Under 10 seconds |

## Sampling Rate

- **After the package checkpoint:** Verify all three PyPI identities and source
  tags before running `uv init`, `uv add`, `uv lock`, or `uv sync`.
- **After dependency bootstrap:** Verify the exact five-file tracked inventory,
  absent sample files, exact lock/export, required commit subject, and clean Git
  status.
- **After Django scaffold:** Run collection and `manage.py check` before the
  health RED commit.
- **After every RED commit:** Run the single named test and retain its expected
  public-behavior failure.
- **After every GREEN commit:** Run the named test, accumulated public seam,
  and `uv run python manage.py check`.
- **Before publication:** Run fresh SQLite migration, exact 13-subject history,
  exact 24-file inventory, local HTTP/browser acceptance, and cleanup readback.
- **After publication:** Replay the same source, history, inventory, migration,
  tests, and browser workflow from a fresh public tag clone, then call cleanup
  explicitly and perform final GitHub plus zero-residue readback.

## Per-Task Verification Map

| Checkpoint ID | Plan | Wave | Requirement | Threat Ref | Test Type | Final command | Status |
|---------------|------|------|-------------|------------|-----------|---------------|--------|
| 24-01-PKG | 01 | 1 | DJAN-01 | T-24-SC | package checkpoint | `bash -lc 'set -euo pipefail; d=$(mktemp); p=$(mktemp); pd=$(mktemp); trap '\''rm -f "$d" "$p" "$pd"'\'' EXIT; curl -fsSL https://pypi.org/pypi/Django/5.2.16/json >"$d"; curl -fsSL https://pypi.org/pypi/pytest/9.1.1/json >"$p"; curl -fsSL https://pypi.org/pypi/pytest-django/4.12.0/json >"$pd"; jq -e '\''.info.version == "5.2.16" and ([.info.project_urls[]] | any(test("github.com/django/django/?$")))'\'' "$d" >/dev/null; jq -e '\''.info.version == "9.1.1" and ([.info.project_urls[]] | any(test("github.com/pytest-dev/pytest/?$")))'\'' "$p" >/dev/null; jq -e '\''.info.version == "4.12.0" and ([.info.project_urls[]] | any(test("github.com/pytest-dev/pytest-django/?$")))'\'' "$pd" >/dev/null; git ls-remote --exit-code --tags https://github.com/django/django.git refs/tags/5.2.16 >/dev/null; git ls-remote --exit-code --tags https://github.com/pytest-dev/pytest.git refs/tags/9.1.1 >/dev/null; git ls-remote --exit-code --tags https://github.com/pytest-dev/pytest-django.git refs/tags/v4.12.0 >/dev/null'` | pending |
| 24-01-DEPS | 01 | 1 | DJAN-01 | T-24-SC | dependency baseline | `cd /Users/longnv/bin/repo/sealos-django-tutorial && uv lock --check && uv sync --locked && uv export --locked --no-dev --no-emit-project --no-hashes --format requirements.txt --output-file requirements.txt && git diff --exit-code -- uv.lock requirements.txt && test ! -e main.py && test ! -e README.md && test "$(git ls-files | sort)" = "$(printf '%s\n' .gitignore .python-version pyproject.toml requirements.txt uv.lock)" && test "$(git show -s --format=%s HEAD)" = 'chore(24-01): lock approved Django dependencies' && test -z "$(git status --porcelain)"` | pending |
| 24-02-SCAFFOLD | 02 | 2 | DJAN-01 | T-24-01 | Django scaffold | `cd /Users/longnv/bin/repo/sealos-django-tutorial && uv run python manage.py check && uv run pytest --collect-only -q && test "$(git show -s --format=%s HEAD)" = 'chore(24-02): initialize Django project' && test ! -e tasks/tests.py && test -z "$(git status --porcelain)"` | pending |
| 24-02-HEALTH | 02 | 2 | DJAN-01 | T-24-02 | health RED/GREEN | `cd /Users/longnv/bin/repo/sealos-django-tutorial && uv run pytest -q tests/test_public_http.py::test_health_is_public -x && uv run python manage.py check && test "$(git show -s --format=%s HEAD)" = 'feat(24-02): add public health endpoint' && test "$(git show -s --format=%s HEAD^)" = 'test(24-02): specify public health'` | pending |
| 24-03-BOARD | 03 | 3 | DJAN-01 | T-24-03 | rendered schema/board RED/GREEN | `cd /Users/longnv/bin/repo/sealos-django-tutorial && uv run pytest -q tests/test_public_http.py::test_empty_task_board_is_rendered -x && rm -f db.sqlite3 && uv run python manage.py migrate --noinput && uv run python manage.py showmigrations tasks | grep -F '[X] 0001_initial' >/dev/null && uv run python manage.py makemigrations --check --dry-run && test "$(git show -s --format=%s HEAD)" = 'feat(24-03): render empty task board' && test "$(git show -s --format=%s HEAD^)" = 'test(24-03): specify empty task board'` | pending |
| 24-04-CREATE | 04 | 4 | DJAN-01 | T-24-04 | creation/listing RED/GREEN | `cd /Users/longnv/bin/repo/sealos-django-tutorial && uv run pytest -q tests/test_public_http.py::test_task_creation_redirects_then_appears_on_board -x && test "$(git show -s --format=%s HEAD)" = 'feat(24-04): create tasks through rendered workflow' && test "$(git show -s --format=%s HEAD^)" = 'test(24-04): specify task creation and listing'` | pending |
| 24-04-INVALID | 04 | 4 | DJAN-01 | T-24-04 | invalid-title RED/GREEN | `cd /Users/longnv/bin/repo/sealos-django-tutorial && uv run pytest -q tests/test_public_http.py::test_invalid_task_title_shows_feedback_without_creating_task -x && test "$(git show -s --format=%s HEAD)" = 'feat(24-04): render task form errors' && test "$(git show -s --format=%s HEAD^)" = 'test(24-04): specify invalid task feedback'` | pending |
| 24-04-ADMIN | 04 | 4 | DJAN-01 | T-24-05 | admin RED/GREEN | `cd /Users/longnv/bin/repo/sealos-django-tutorial && uv run pytest -q tests/test_public_http.py::test_admin_login_is_public -x && test "$(rg -c '^def test_[A-Za-z0-9_]+\(' tests/test_public_http.py)" -eq 5 && uv run pytest -q && uv run python manage.py shell -c "from django.contrib import admin; from tasks.models import Task; assert admin.site.is_registered(Task)" && uv run python manage.py check && test "$(git show -s --format=%s HEAD)" = 'feat(24-04): expose Django administration' && test "$(git show -s --format=%s HEAD^)" = 'test(24-04): specify administration login'` | pending |
| 24-05-LOCAL | 05 | 5 | DJAN-01 | T-24-06, T-24-10 | local acceptance and LOCAL cleanup | `bash -lc 'set -euo pipefail; SOURCE=/Users/longnv/bin/repo/sealos-django-tutorial; LOCAL_TMP=$(mktemp -d "${TMPDIR:-/tmp}/phase24-local.XXXXXX"); LOCAL_LOG="$LOCAL_TMP/local.log"; LOCAL_RESPONSE_DIR="$LOCAL_TMP/responses"; LOCAL_PID=0; LOCAL_SESSION=phase24-local-acceptance; mkdir -p "$LOCAL_RESPONSE_DIR"; cleanup(){ agent-browser --session "$LOCAL_SESSION" close >/dev/null 2>&1 || true; if test "$LOCAL_PID" -gt 0; then kill "$LOCAL_PID" 2>/dev/null || true; wait "$LOCAL_PID" 2>/dev/null || true; fi; rm -f "$SOURCE/db.sqlite3"; rm -rf "$LOCAL_TMP"; }; trap cleanup EXIT INT TERM; cd "$SOURCE"; rm -f db.sqlite3; uv sync --locked; uv lock --check; uv run python manage.py migrate --noinput; uv run python manage.py showmigrations tasks | grep -F "[X] 0001_initial" >/dev/null; uv run python manage.py makemigrations --check --dry-run; uv run pytest -q; uv export --locked --no-dev --no-emit-project --no-hashes --format requirements.txt --output-file requirements.txt; git diff --exit-code; actual=$(git log --reverse --format=%s); expected=$(printf "%s\n" "chore(24-01): lock approved Django dependencies" "chore(24-02): initialize Django project" "test(24-02): specify public health" "feat(24-02): add public health endpoint" "test(24-03): specify empty task board" "feat(24-03): render empty task board" "test(24-04): specify task creation and listing" "feat(24-04): create tasks through rendered workflow" "test(24-04): specify invalid task feedback" "feat(24-04): render task form errors" "test(24-04): specify administration login" "feat(24-04): expose Django administration" "docs(24-05): document Stage 1 reader workflow"); test "$actual" = "$expected"; actual=$(git ls-files | sort); expected=$(printf "%s\n" .gitignore .python-version README.md manage.py pyproject.toml requirements.txt taskboard/__init__.py taskboard/asgi.py taskboard/settings.py taskboard/urls.py taskboard/wsgi.py tasks/__init__.py tasks/admin.py tasks/apps.py tasks/forms.py tasks/migrations/0001_initial.py tasks/migrations/__init__.py tasks/models.py tasks/static/tasks/styles.css tasks/templates/tasks/board.html tasks/urls.py tasks/views.py tests/test_public_http.py uv.lock); test "$actual" = "$expected"; test -z "$(git status --porcelain --untracked-files=all)"; ! lsof -nP -iTCP:8000 -sTCP:LISTEN >/dev/null 2>&1; uv run python manage.py runserver 0.0.0.0:8000 --noreload >"$LOCAL_LOG" 2>&1 & LOCAL_PID=$!; ready=0; for _ in {1..40}; do kill -0 "$LOCAL_PID"; if curl -fsS http://127.0.0.1:8000/health >"$LOCAL_RESPONSE_DIR/health.json"; then ready=1; break; fi; sleep 0.25; done; test "$ready" -eq 1; jq -e '\''. == {"status":"ok"}'\'' "$LOCAL_RESPONSE_DIR/health.json" >/dev/null; curl -fsS http://127.0.0.1:8000/ >"$LOCAL_RESPONSE_DIR/board.html"; curl -fsS http://127.0.0.1:8000/admin/login/ >"$LOCAL_RESPONSE_DIR/admin.html"; rg -F "Task Board" "$LOCAL_RESPONSE_DIR/board.html" >/dev/null; rg -F "Django administration" "$LOCAL_RESPONSE_DIR/admin.html" >/dev/null; AGENT_BROWSER_ALLOWED_DOMAINS=127.0.0.1 agent-browser --session "$LOCAL_SESSION" open http://127.0.0.1:8000/; agent-browser --session "$LOCAL_SESSION" find label "Task title" fill "Verify browser workflow"; agent-browser --session "$LOCAL_SESSION" find role button click --name "Add task"; agent-browser --session "$LOCAL_SESSION" wait --text "Verify browser workflow"; agent-browser --session "$LOCAL_SESSION" wait --text "1 task"; agent-browser --session "$LOCAL_SESSION" open http://127.0.0.1:8000/admin/login/; agent-browser --session "$LOCAL_SESSION" wait --text "Django administration"; cleanup; trap - EXIT INT TERM; ! kill -0 "$LOCAL_PID" 2>/dev/null; ! lsof -nP -iTCP:8000 -sTCP:LISTEN >/dev/null 2>&1; session_list=$(agent-browser session list); if printf "%s\n" "$session_list" | rg -F -- "$LOCAL_SESSION" >/dev/null; then exit 1; fi; test ! -e "$LOCAL_TMP"; test ! -e "$LOCAL_LOG"; test ! -e "$LOCAL_RESPONSE_DIR"; test ! -e "$SOURCE/db.sqlite3"; test -z "$(git status --porcelain --untracked-files=all)"'` | pending |
| 24-05-PUBLISH | 05 | 5 | DJAN-01 | T-24-07, T-24-08 | publication | `cd /Users/longnv/bin/repo/sealos-django-tutorial && test "$(gh api user --jq .login)" = yangchuansheng && test "$(gh repo view yangchuansheng/sealos-django-tutorial --json nameWithOwner --jq .nameWithOwner)" = yangchuansheng/sealos-django-tutorial && test "$(gh repo view yangchuansheng/sealos-django-tutorial --json isPrivate --jq .isPrivate)" = false && test "$(gh repo view yangchuansheng/sealos-django-tutorial --json defaultBranchRef --jq .defaultBranchRef.name)" = main && test "$(git ls-remote origin refs/heads/main | cut -f1)" = "$(git rev-parse HEAD)"` plus the exact ruleset/direct/peeled/type/message readback in 24-05 Task 2 | pending |
| 24-05-CLONE | 05 | 5 | DJAN-01 | T-24-SC, T-24-09, T-24-10 | public replay and CLONE cleanup | `bash -lc 'set -euo pipefail; SOURCE=/Users/longnv/bin/repo/sealos-django-tutorial; ACCEPTED_HEAD=$(git -C "$SOURCE" rev-parse HEAD); PHASE_TMP=$(mktemp -d "${TMPDIR:-/tmp}/phase24.XXXXXX"); CLONE_DIR="$PHASE_TMP/repo"; CLONE_LOG="$PHASE_TMP/clone.log"; CLONE_RESPONSE_DIR="$PHASE_TMP/responses"; CLONE_DB="$CLONE_DIR/db.sqlite3"; CLONE_SESSION=phase24-public-replay; CLONE_PID=0; mkdir -p "$CLONE_RESPONSE_DIR"; cleanup(){ agent-browser --session "$CLONE_SESSION" close >/dev/null 2>&1 || true; if test "$CLONE_PID" -gt 0; then kill "$CLONE_PID" 2>/dev/null || true; wait "$CLONE_PID" 2>/dev/null || true; fi; rm -f "$SOURCE/db.sqlite3" "$CLONE_DB"; rm -rf "$PHASE_TMP"; }; trap cleanup EXIT INT TERM; git clone --branch stage-1-deploy https://github.com/yangchuansheng/sealos-django-tutorial.git "$CLONE_DIR"; cd "$CLONE_DIR"; test "$(git rev-parse HEAD)" = "$ACCEPTED_HEAD"; test "$(git cat-file -t refs/tags/stage-1-deploy)" = tag; test "$(git for-each-ref refs/tags/stage-1-deploy --format="%(contents:subject)")" = "Django deploy stage"; actual=$(git log --reverse --format=%s); expected=$(printf "%s\n" "chore(24-01): lock approved Django dependencies" "chore(24-02): initialize Django project" "test(24-02): specify public health" "feat(24-02): add public health endpoint" "test(24-03): specify empty task board" "feat(24-03): render empty task board" "test(24-04): specify task creation and listing" "feat(24-04): create tasks through rendered workflow" "test(24-04): specify invalid task feedback" "feat(24-04): render task form errors" "test(24-04): specify administration login" "feat(24-04): expose Django administration" "docs(24-05): document Stage 1 reader workflow"); test "$actual" = "$expected"; actual=$(git ls-files | sort); expected=$(printf "%s\n" .gitignore .python-version README.md manage.py pyproject.toml requirements.txt taskboard/__init__.py taskboard/asgi.py taskboard/settings.py taskboard/urls.py taskboard/wsgi.py tasks/__init__.py tasks/admin.py tasks/apps.py tasks/forms.py tasks/migrations/0001_initial.py tasks/migrations/__init__.py tasks/models.py tasks/static/tasks/styles.css tasks/templates/tasks/board.html tasks/urls.py tasks/views.py tests/test_public_http.py uv.lock); test "$actual" = "$expected"; uv sync --locked; uv lock --check; rm -f db.sqlite3; uv run python manage.py migrate --noinput; uv run python manage.py showmigrations tasks | grep -F "[X] 0001_initial" >/dev/null; uv run python manage.py makemigrations --check --dry-run; uv run pytest -q; uv export --locked --no-dev --no-emit-project --no-hashes --format requirements.txt --output-file requirements.txt; git diff --exit-code; test -z "$(git status --porcelain --untracked-files=all)"; ! lsof -nP -iTCP:8000 -sTCP:LISTEN >/dev/null 2>&1; uv run python manage.py runserver 0.0.0.0:8000 --noreload >"$CLONE_LOG" 2>&1 & CLONE_PID=$!; ready=0; for _ in {1..40}; do kill -0 "$CLONE_PID"; if curl -fsS http://127.0.0.1:8000/health >"$CLONE_RESPONSE_DIR/health.json"; then ready=1; break; fi; sleep 0.25; done; test "$ready" -eq 1; jq -e '\''. == {"status":"ok"}'\'' "$CLONE_RESPONSE_DIR/health.json" >/dev/null; AGENT_BROWSER_ALLOWED_DOMAINS=127.0.0.1 agent-browser --session "$CLONE_SESSION" open http://127.0.0.1:8000/; agent-browser --session "$CLONE_SESSION" find label "Task title" fill "Replay public stage"; agent-browser --session "$CLONE_SESSION" find role button click --name "Add task"; agent-browser --session "$CLONE_SESSION" wait --text "Replay public stage"; agent-browser --session "$CLONE_SESSION" open http://127.0.0.1:8000/admin/login/; agent-browser --session "$CLONE_SESSION" wait --text "Django administration"; cd "$SOURCE"; cleanup; trap - EXIT INT TERM; ! kill -0 "$CLONE_PID" 2>/dev/null; ! lsof -nP -iTCP:8000 -sTCP:LISTEN >/dev/null 2>&1; session_list=$(agent-browser session list); if printf "%s\n" "$session_list" | rg -F -- "$CLONE_SESSION" >/dev/null; then exit 1; fi; test ! -e "$CLONE_DIR"; test ! -e "$PHASE_TMP"; test ! -e "$CLONE_LOG"; test ! -e "$CLONE_RESPONSE_DIR"; test ! -e "$SOURCE/db.sqlite3"; test ! -e "$CLONE_DB"; test -z "$(git status --porcelain --untracked-files=all)"; test "$(gh repo view yangchuansheng/sealos-django-tutorial --json nameWithOwner --jq .nameWithOwner)" = yangchuansheng/sealos-django-tutorial; test "$(gh repo view yangchuansheng/sealos-django-tutorial --json isPrivate --jq .isPrivate)" = false; test "$(gh repo view yangchuansheng/sealos-django-tutorial --json defaultBranchRef --jq .defaultBranchRef.name)" = main; test "$(git ls-remote origin refs/heads/main | cut -f1)" = "$ACCEPTED_HEAD"; test "$(git cat-file -t refs/tags/stage-1-deploy)" = tag; test "$(git for-each-ref refs/tags/stage-1-deploy --format="%(contents:subject)")" = "Django deploy stage"; test "$(git ls-remote --tags origin refs/tags/stage-1-deploy | cut -f1)" = "$(git rev-parse refs/tags/stage-1-deploy)"; test "$(git ls-remote --tags origin "refs/tags/stage-1-deploy^{}" | cut -f1)" = "$ACCEPTED_HEAD"; ids=$(gh api repos/yangchuansheng/sealos-django-tutorial/rulesets --jq '\''.[] | select(.name == "Protect tutorial stage tags") | .id'\''); test "$(printf "%s\n" "$ids" | sed "/^$/d" | wc -l | tr -d " ")" -eq 1; gh api "repos/yangchuansheng/sealos-django-tutorial/rulesets/$ids" | jq -e '\''.name == "Protect tutorial stage tags" and .target == "tag" and .enforcement == "active" and .conditions.ref_name.exclude == [] and .conditions.ref_name.include == ["refs/tags/stage-*"] and ([.rules[].type] | sort) == ["deletion","update"] and (.bypass_actors | length == 0)'\'' >/dev/null'` | pending |

*Status: pending, green, red, or flaky.*

## Wave 0 Requirements

- [ ] Package checkpoint evidence records exact PyPI versions, Python
  requirements, official repositories, release refs, and the resolved
  pytest-django metadata discrepancy before installation.
- [ ] Plan 24-01 creates only `.gitignore`, `.python-version`,
  `pyproject.toml`, `requirements.txt`, and `uv.lock`; the two `uv init --app`
  sample files are absent before its commit.
- [ ] Plan 24-02 creates the six-file project group and eight-file app/test
  group in two bounded scaffold tasks; Task 2 commits both groups once before
  the first health RED commit.
- [ ] Plans 24-03 and 24-04 add exactly one public behavior per RED commit and
  retain every direct RED/GREEN pair.

## Exact Phase Assertions

### Ordered History

Run this command in the accepted source and in the fresh public tag clone:

```bash
actual=$(git log --reverse --format=%s)
expected=$(printf '%s\n' \
  'chore(24-01): lock approved Django dependencies' \
  'chore(24-02): initialize Django project' \
  'test(24-02): specify public health' \
  'feat(24-02): add public health endpoint' \
  'test(24-03): specify empty task board' \
  'feat(24-03): render empty task board' \
  'test(24-04): specify task creation and listing' \
  'feat(24-04): create tasks through rendered workflow' \
  'test(24-04): specify invalid task feedback' \
  'feat(24-04): render task form errors' \
  'test(24-04): specify administration login' \
  'feat(24-04): expose Django administration' \
  'docs(24-05): document Stage 1 reader workflow')
test "$actual" = "$expected"
```

### Tracked Inventory

Run this command in the accepted source and in the fresh public tag clone:

```bash
actual=$(git ls-files | sort)
expected=$(printf '%s\n' \
  .gitignore \
  .python-version \
  README.md \
  manage.py \
  pyproject.toml \
  requirements.txt \
  taskboard/__init__.py \
  taskboard/asgi.py \
  taskboard/settings.py \
  taskboard/urls.py \
  taskboard/wsgi.py \
  tasks/__init__.py \
  tasks/admin.py \
  tasks/apps.py \
  tasks/forms.py \
  tasks/migrations/0001_initial.py \
  tasks/migrations/__init__.py \
  tasks/models.py \
  tasks/static/tasks/styles.css \
  tasks/templates/tasks/board.html \
  tasks/urls.py \
  tasks/views.py \
  tests/test_public_http.py \
  uv.lock)
test "$actual" = "$expected"
```

## Phase Gate Commands

| Gate | Command | Observable result |
|------|---------|-------------------|
| Public HTTP contract | `test "$(rg -c '^def test_[A-Za-z0-9_]+\(' tests/test_public_http.py)" -eq 5 && uv run pytest -q` | Exactly five named public behaviors pass. |
| Migration ownership | `rm -f db.sqlite3 && uv run python manage.py makemigrations --check --dry-run && uv run python manage.py migrate --noinput && uv run python manage.py showmigrations tasks | grep -F '[X] 0001_initial'` | No migration drift; `tasks.0001_initial` applies to a fresh database. |
| Reproducible dependencies | `uv sync --locked && uv lock --check && uv export --locked --no-dev --no-emit-project --no-hashes --format requirements.txt --output-file requirements.txt && git diff --exit-code -- uv.lock requirements.txt` | Exit 0 and the runtime export excludes development packages. |
| Local acceptance and LOCAL cleanup | Run the exact `24-05-LOCAL` command in one shell lifetime | Health JSON, rendered board, CSRF creation/readback, admin login, `cleanup; trap - EXIT INT TERM`, successful session-list absence, dead PID, free port, absent paths/database, and clean all-files status pass. |
| Publication | Use Plan 24-05 Task 2's absent/exact-empty/exact-existing state machine and complete readback | Public main, annotated tag, and one exact active ruleset form one accepted identity. |
| Public replay and CLONE cleanup | Run the exact `24-05-CLONE` command in its own shell lifetime | Clone reproduces history, inventory, dependencies, migration, tests, runtime behavior, pre-cleanup clean status, `cleanup; trap - EXIT INT TERM`, successful session-list absence, and post-cleanup clean status. |
| Final external readback | Use the final section of `24-05-CLONE` after its explicit cleanup assertions | Owner, visibility, default branch, main, ruleset, direct tag, peeled commit, object type, and annotated message remain exact. |

## Manual-Only Verifications

None. `agent-browser` performs the real browser CSRF form workflow and native
admin-login observation in both local and fresh-clone acceptance.

## Validation Sign-Off

- [x] Package checkpoint, dependency baseline, scaffold, each behavior slice,
  local acceptance, publication, public replay, and cleanup have distinct
  executable rows.
- [x] Every RED/GREEN task has a named node and accumulated-suite sampling.
- [x] Exact ordered history and the exact 24-file inventory run locally and in
  the public clone.
- [x] Server lifecycle checks use bounded polling, explicit cleanup invocation,
  trap removal, and zero-state assertions.
- [x] Final GitHub readback covers owner, visibility, default branch, main,
  ruleset, direct tag, peeled commit, object type, and annotated message.
- [x] `nyquist_compliant: true` is set in frontmatter.

**Approval:** approved 2026-07-16 for revised planning
