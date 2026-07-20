---
phase: 25
slug: django-postgresql-stage
status: approved
nyquist_compliant: true
wave_0_complete: false
created: 2026-07-16
---

# Phase 25 - Validation Strategy

> Per-task feedback contract for the real PostgreSQL, migration Job, public
> restart, immutable publication, and exact cleanup workflow.

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | pytest 9.1.1, pytest-django 4.12.0, Django 5.2.16 Client, real PostgreSQL 17.10, Kubernetes Jobs, curl, and agent-browser 0.26.0 |
| **Configuration** | `/Users/longnv/bin/repo/sealos-django-tutorial/pyproject.toml`, `taskboard/settings.py`, and `tests/conftest.py` |
| **Public seam** | The five retained functions in `tests/test_public_http.py`, plus schema-state cases in `tests/test_postgresql.py` |
| **Quick command** | `./scripts/test-postgres.sh --pytest-only tests/test_postgresql.py -q -x` |
| **Full Django gate** | `PHASE25_EVIDENCE_DIR="$EVIDENCE" ./scripts/test-postgres.sh --phase-gate` |
| **Shared framework gate** | Run the immutable FastAPI Stage 2 gate and Django Stage 2 gate under independent run IDs |
| **Focused feedback target** | Under 30 seconds after PostgreSQL readiness |
| **External gate bound** | 15 minutes per framework gate, with bounded waits and traps |

## Sampling Rate

- **Before package mutation:** Resolve the exact `psycopg` and
  `psycopg-binary` 3.3.4 identities through PyPI, official Psycopg
  documentation, and the upstream annotated tag; receive human approval.
- **After dependency locking:** Run locked sync/export, inspect both Psycopg
  distributions, verify the exact dependency commit, and require a clean tree.
- **After PostgreSQL foundation:** Run shell syntax, a real session start/stop,
  state grammar, exact-label inventory, and explicit assert-clean.
- **After every RED commit:** Run the named public or harness test, retain the
  expected behavioral failure after database preflight, and verify test-only
  commit scope.
- **After every GREEN commit:** Run the named test, accumulated focused files,
  the five-function public seam, Django system checks, migration drift, and
  exact RED/GREEN ancestry.
- **After the Job wave:** Run fresh and repeat `migrate`, strict production Job
  validation, two source Job `Complete` observations, ready health, and exact
  cleanup.
- **Before publication:** Run the final candidate from a no-local clone against
  a fresh real PostgreSQL database, including two-process persistence and
  authenticated admin readback.
- **After publication:** Replay immutable FastAPI Stage 2 and public Django
  Stage 2 independently, finalize credential-free evidence, verify every
  GitHub field, and prove zero resource/process/browser/clone residue.

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Test Type | Automated Command | Status |
|---------|------|------|-------------|------------|-----------|-------------------|--------|
| 25-01-01 | 01 | 1 | DJAN-02 | T-25-SC | package checkpoint | `bash -lc 'set -euo pipefail; p=$(mktemp); b=$(mktemp); trap '\''rm -f "$p" "$b"'\'' EXIT; curl -fsSL https://pypi.org/pypi/psycopg/3.3.4/json >"$p"; curl -fsSL https://pypi.org/pypi/psycopg-binary/3.3.4/json >"$b"; jq -e '\''.info.version == "3.3.4" and ([.info.project_urls[]] | any(test("github.com/psycopg/psycopg")))'\'' "$p" >/dev/null; jq -e '\''.info.version == "3.3.4" and .info.requires_python == ">=3.10"'\'' "$b" >/dev/null; git ls-remote --exit-code --tags https://github.com/psycopg/psycopg.git refs/tags/3.3.4 refs/tags/3.3.4^{} | rg 83f110367cdd249cc0a352e2246ecea9e878e5a0 >/dev/null'` | pending |
| 25-01-02 | 01 | 1 | DJAN-02 | T-25-SC | dependency lock | `cd /Users/longnv/bin/repo/sealos-django-tutorial && uv lock --check && uv sync --locked && uv tree --locked | rg 'psycopg' && uv export --locked --no-dev --no-emit-project --no-hashes --format requirements.txt --output-file requirements.txt && git diff --exit-code -- uv.lock requirements.txt && test "$(git show -s --format=%s HEAD)" = 'chore(25-01): lock approved psycopg dependency' && test -z "$(git status --porcelain --untracked-files=all)"` | pending |
| 25-02-01 | 02 | 2 | TDD-03, DJAN-02 | T-25-01, T-25-02 | owned PostgreSQL foundation | `bash -lc 'set -euo pipefail; cd /Users/longnv/bin/repo/sealos-django-tutorial; TMP_DIR=$(mktemp -d /tmp/sealos-django-phase25-foundation.XXXXXX); STATE_FILE=$TMP_DIR/state.env; trap '\''rm -rf "$TMP_DIR"'\'' EXIT; test "$(stat -f "%Lp" "$TMP_DIR")" = 700; bash -n scripts/test-postgres.sh; ./scripts/test-postgres.sh --session-start --state-file "$STATE_FILE"; test "$(stat -f "%Lp" "$STATE_FILE")" = 600; ./scripts/test-postgres.sh --session-stop --state-file "$STATE_FILE"; ./scripts/test-postgres.sh --assert-clean --state-file "$STATE_FILE"; test ! -e "$STATE_FILE"'` | pending |
| 25-02-02 | 02 | 2 | TDD-02, TDD-03, DJAN-02 | T-25-03 | readiness RED/GREEN | `cd /Users/longnv/bin/repo/sealos-django-tutorial && ./scripts/test-postgres.sh --pytest-only tests/test_postgresql.py tests/test_public_http.py -q -x && test "$(git show -s --format=%s HEAD)" = 'feat(25-02): require migrated PostgreSQL' && test "$(git show -s --format=%s HEAD^)" = 'test(25-02): specify PostgreSQL readiness'` | pending |
| 25-02-03 | 02 | 2 | TDD-02, DJAN-02 | T-25-04 | retained public seam | `cd /Users/longnv/bin/repo/sealos-django-tutorial && test "$(rg -c '^def test_[A-Za-z0-9_]+\(' tests/test_public_http.py)" -eq 5 && ./scripts/test-postgres.sh --pytest-only tests/test_public_http.py tests/test_postgresql.py -q -x && uv run python manage.py check` | pending |
| 25-03-01 | 03 | 3 | TDD-03, DJAN-02 | T-25-05 | migration command RED/GREEN | `cd /Users/longnv/bin/repo/sealos-django-tutorial && ./scripts/test-postgres.sh --pytest-only tests/test_migrations.py tests/test_postgres_harness.py -q -x && ./scripts/test-postgres.sh --migrations-only && test "$(git show -s --format=%s HEAD)" = 'feat(25-03): add repeatable Django migration gate' && test "$(git show -s --format=%s HEAD^)" = 'test(25-03): specify repeatable Django migration gate'` | pending |
| 25-03-02 | 03 | 3 | TDD-03, DJAN-02 | T-25-06, T-25-07 | Job RED/GREEN | `cd /Users/longnv/bin/repo/sealos-django-tutorial && ./scripts/test-postgres.sh --pytest-only tests/test_migration_job.py tests/test_postgres_harness.py -q -x && ./scripts/test-postgres.sh --jobs-only && test "$(git show -s --format=%s HEAD)" = 'feat(25-03): add repeatable migration Job contracts' && test "$(git show -s --format=%s HEAD^)" = 'test(25-03): specify repeatable migration Job'` | pending |
| 25-04-01 | 04 | 4 | TDD-02, TDD-03, DJAN-02 | T-25-08, T-25-09 | restart/admin and read-only cleanup RED/GREEN | `cd /Users/longnv/bin/repo/sealos-django-tutorial && ./scripts/test-postgres.sh --pytest-only tests/test_postgres_harness.py -q -x && ./scripts/test-postgres.sh --phase-gate && ./scripts/test-postgres.sh --assert-clean-all && test "$(git show -s --format=%s HEAD)" = 'feat(25-04): prove PostgreSQL restart persistence' && test "$(git show -s --format=%s HEAD^)" = 'test(25-04): specify public restart persistence'` | pending |
| 25-04-02 | 04 | 4 | TDD-02, TDD-03, DJAN-02 | T-25-10, T-25-11 | local final-source gate | `cd /Users/longnv/bin/repo/sealos-django-tutorial && EVIDENCE=/Users/longnv/.codex/worktrees/19b8/sealos.io/.planning/phases/25-django-postgresql-stage/evidence && bash -n scripts/test-postgres.sh && ./scripts/test-postgres.sh --pytest-only tests/test_public_http.py tests/test_postgresql.py -q -x && PHASE25_EVIDENCE_DIR="$EVIDENCE" ./scripts/test-postgres.sh --phase-gate && ./scripts/test-postgres.sh --assert-clean-all && test "$(git show -s --format=%s HEAD)" = 'docs(25-04): document PostgreSQL reader workflow' && git diff --exit-code && test -z "$(git status --porcelain --untracked-files=all)"` | pending |
| 25-05-01 | 05 | 5 | TDD-03 | T-25-12 | immutable FastAPI replay | `bash -lc 'set -euo pipefail; tmp=$(mktemp -d); trap '\''rm -rf "$tmp"'\'' EXIT; git clone --branch stage-2-postgresql https://github.com/yangchuansheng/sealos-fastapi-tutorial.git "$tmp/repo"; cd "$tmp/repo"; test "$(git rev-parse HEAD)" = 2b256b3dfc2a7d2a4b930c9970becca8c6da8cd3; uv sync --locked; bash -n scripts/test-postgres.sh; ./scripts/test-postgres.sh --pytest-only tests/test_migration_job.py tests/test_postgres_harness.py -q -x; PHASE22_EVIDENCE_DIR="$tmp/evidence" ./scripts/test-postgres.sh --phase-gate; git diff --exit-code'` | pending |
| 25-05-02 | 05 | 5 | DJAN-02 | T-25-13 | immutable publication | `cd /Users/longnv/bin/repo/sealos-django-tutorial && test "$(git ls-remote origin refs/heads/main | cut -f1)" = "$(git rev-parse HEAD)" && test "$(git cat-file -t stage-1-deploy)" = tag && test "$(git rev-parse stage-1-deploy)" = 0d9254d37914976898039ff3c55f94399aa1d7c0 && test "$(git rev-parse 'stage-1-deploy^{}')" = ca115bf21b599c14e667b336bd78e3c587c24208 && test "$(git cat-file -t stage-2-postgresql)" = tag && test "$(git rev-parse 'stage-2-postgresql^{}')" = "$(git rev-parse HEAD)" && test "$(git for-each-ref --format='%(contents:subject)' refs/tags/stage-2-postgresql)" = 'Django PostgreSQL stage' && gh api repos/yangchuansheng/sealos-django-tutorial/rulesets/19014157 | jq -e '.name == "Protect tutorial stage tags" and .target == "tag" and .enforcement == "active" and .conditions.ref_name.include == ["refs/tags/stage-*"] and .conditions.ref_name.exclude == [] and ([.rules[].type] | sort) == ["deletion","update"] and .bypass_actors == []' >/dev/null` | pending |
| 25-05-03 | 05 | 5 | TDD-02, TDD-03, DJAN-02 | T-25-14, T-25-15 | public replay and final cleanup | `bash -lc 'set -euo pipefail; tmp=$(mktemp -d); trap '\''rm -rf "$tmp"'\'' EXIT; git clone --branch stage-2-postgresql https://github.com/yangchuansheng/sealos-django-tutorial.git "$tmp/repo"; cd "$tmp/repo"; uv sync --locked; bash -n scripts/test-postgres.sh; ./scripts/test-postgres.sh --pytest-only tests/test_public_http.py tests/test_postgresql.py -q -x; PHASE25_EVIDENCE_DIR="$tmp/public-evidence" ./scripts/test-postgres.sh --phase-gate; git diff --exit-code; cd /Users/longnv/bin/repo/sealos-django-tutorial; ./scripts/test-postgres.sh --assert-clean-all; sha256sum -c /Users/longnv/.codex/worktrees/19b8/sealos.io/.planning/phases/25-django-postgresql-stage/evidence/checksums.txt'` | pending |

*Status: pending, green, red, or flaky.*

## Wave 0 Requirements

- [ ] `tests/conftest.py` requires explicit real PostgreSQL runtime and test
  URLs and delegates isolated database creation/destruction to pytest-django.
- [ ] `tests/test_postgresql.py` covers strict URL conversion and exact public
  health behavior for unmigrated and migrated PostgreSQL.
- [ ] `tests/test_migrations.py` preserves migration hash, fresh application,
  current-head rerun, schema fields, and zero model drift.
- [ ] `tests/test_migration_job.py` and `tests/test_postgres_harness.py` cover
  production/source manifests, mode grammar, rendering, evidence, restart, and
  cleanup contracts.
- [ ] `scripts/test-postgres.sh` supplies session, pytest, migration, Job,
  phase-gate, assert-clean, and assert-clean-all modes with bounded ownership.
- [ ] `deploy/migration-job.yaml` and `deploy/source-migration-job.yaml` supply
  the future application-image contract and pre-image execution adapter.

## Exact Phase Assertions

### Ordered History

Run in the accepted local source, pre-public no-local clone, and fresh public
tag clone:

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
  'docs(24-05): document Stage 1 reader workflow' \
  'chore(25-01): lock approved psycopg dependency' \
  'chore(25-02): add owned PostgreSQL test foundation' \
  'test(25-02): specify PostgreSQL readiness' \
  'feat(25-02): require migrated PostgreSQL' \
  'test(25-03): specify repeatable Django migration gate' \
  'feat(25-03): add repeatable Django migration gate' \
  'test(25-03): specify repeatable migration Job' \
  'feat(25-03): add repeatable migration Job contracts' \
  'test(25-04): specify public restart persistence' \
  'feat(25-04): prove PostgreSQL restart persistence' \
  'docs(25-04): document PostgreSQL reader workflow')
test "$actual" = "$expected"
```

### Tracked Inventory

Run in the same three source trees:

```bash
actual=$(git ls-files | sort)
expected=$(printf '%s\n' \
  .gitignore \
  .python-version \
  README.md \
  deploy/migration-job.yaml \
  deploy/source-migration-job.yaml \
  manage.py \
  pyproject.toml \
  requirements.txt \
  scripts/test-postgres.sh \
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
  tests/conftest.py \
  tests/test_migration_job.py \
  tests/test_migrations.py \
  tests/test_postgres_harness.py \
  tests/test_postgresql.py \
  tests/test_public_http.py \
  uv.lock)
test "$actual" = "$expected"
```

### Immutable Inputs

```bash
test "$(sha256sum tasks/migrations/0001_initial.py | cut -d' ' -f1)" = \
  745bc45f655bf0b164c1464c0c22786d22910e2aea235772e5dcea38495e4bf3
test "$(git rev-parse stage-1-deploy)" = \
  0d9254d37914976898039ff3c55f94399aa1d7c0
test "$(git rev-parse 'stage-1-deploy^{}')" = \
  ca115bf21b599c14e667b336bd78e3c587c24208
```

## Phase Gate Outcomes

| Gate | Observable result |
|------|-------------------|
| Package identity | Both Psycopg distributions resolve to 3.3.4 and the official upstream tag peels to `83f110367cdd249cc0a352e2246ecea9e878e5a0` before lock mutation. |
| Fresh database | `migrate --noinput` applies `tasks.0001_initial`; a second invocation exits successfully at current head; drift remains zero. |
| Readiness | Missing configuration, unreachable PostgreSQL, and a fresh unmigrated database return exact 503 JSON; migrated PostgreSQL returns exact 200 JSON. |
| Public seam | Exactly five retained public HTTP tests pass through Django routing, ORM, forms, templates, middleware, sessions, and administration on real PostgreSQL. |
| Migration Jobs | Production manifest passes strict server validation and the source Job reaches `Complete=True` twice before accepted readiness. |
| Restart/admin | Process A writes through public CSRF form HTTP; process B reads the retained title; authenticated admin renders the same task. |
| Shared framework | Immutable public FastAPI Stage 2 and Django Stage 2 pass independent fresh-database gates under separate run labels. |
| Reproducibility | Lock/export, exact 24-subject history, exact 32-file inventory, migration hash, and clean status pass locally and from the public tag. |
| Stage identity | Stage 1 remains unchanged; annotated Stage 2 peels to public main; ruleset `19014157` retains exact active update/deletion protection and empty bypass. |
| Evidence | Eight credential-free evidence inputs verify against a sorted SHA-256 manifest generated last. |
| Cleanup | Exact-label Deployment, Pod, Service, Job, Secret, and ConfigMap counts are zero; owned port-forwards, servers, browser sessions, secure state, logs, response files, and clones are absent. |

## Multi-Source Coverage Audit

| Source | ID | Feature or requirement | Plans | Status |
|--------|----|------------------------|-------|--------|
| GOAL | - | Persistent Task Board after both fresh migration paths pass | 25-02..25-05 | COVERED |
| REQ | TDD-02 | Django health, create/list, and admin through public HTTP | 25-02, 25-04, 25-05 | COVERED |
| REQ | TDD-03 | Both migration commands, Jobs, readiness, read/write, and cleanup | 25-03..25-05 | COVERED |
| REQ | DJAN-02 | psycopg 3, Django migrations, one-shot Job, persistent reads, and protected source | 25-01..25-05 | COVERED |
| CONTEXT | D-01 | Dedicated run-labeled PostgreSQL 17 in `ns-let51wad` | 25-02..25-05 | COVERED |
| CONTEXT | D-02 | Explicit PostgreSQL URL, strict parser, and no runtime SQLite path | 25-01, 25-02 | COVERED |
| CONTEXT | D-03 | Immutable Django migration and fresh/current-head commands | 25-03, 25-05 | COVERED |
| CONTEXT | D-04 | Exact schema-aware 200/503 health | 25-02..25-05 | COVERED |
| CONTEXT | D-05 | Five public seams plus independent-process persistence | 25-02, 25-04, 25-05 | COVERED |
| CONTEXT | D-06 | Production/source Jobs twice and FastAPI rerun | 25-03, 25-05 | COVERED |
| CONTEXT | D-07 | Lock/export, preserved Stage 1, protected Stage 2, public replay | 25-01, 25-05 | COVERED |
| CONTEXT | D-08 | Credential-free evidence and complete cleanup | 25-04, 25-05 | COVERED |
| CONTEXT | D-09 | Production/image/tutorial concerns stay in Phases 26/27 | 25-05 inventory gate | COVERED |
| RESEARCH | Strict native URL conversion and explicit test database | 25-02 | COVERED |
| RESEARCH | Two source Job completions before readiness | 25-03, 25-04 | COVERED |
| RESEARCH | Browser admin readback and restart persistence | 25-04, 25-05 | COVERED |
| RESEARCH | Exact public tag/ruleset identity and zero residue | 25-05 | COVERED |

## Manual-Only Verifications

The package legitimacy checkpoint requires human approval by policy. Every
technical identity fact and all runtime, browser, publication, evidence, and
cleanup behaviors have executable verification.

## Validation Sign-Off

- [x] Twelve plan tasks have twelve distinct executable validation rows.
- [x] Every RED/GREEN task has a named focused command plus accumulated
  real-PostgreSQL sampling.
- [x] Fresh and repeat migration commands, two source Job completions, public
  restart persistence, admin readback, and both framework gates are explicit.
- [x] Exact history, inventory, immutable migration, tag identities, ruleset,
  evidence checksums, and final cleanup have fail-closed assertions.
- [x] External waits are bounded and every ownership path installs cleanup.
- [x] The source audit covers the goal, all three requirements, D-01 through
  D-09, and every in-scope research constraint.
- [x] `nyquist_compliant: true` is set in frontmatter.

**Approval:** approved 2026-07-16 for Phase 25 planning
