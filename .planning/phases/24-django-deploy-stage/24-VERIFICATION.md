---
phase: 24-django-deploy-stage
verified: 2026-07-15T22:03:01Z
status: passed
score: 14/14 must-haves verified
behavior_unverified: 0
overrides_applied: 0
---

# Phase 24: Django Deploy Stage Verification Report

**Phase Goal:** Readers can clone and run the first public Task Board stage and
use its rendered task workflow and administration entry point.
**Verified:** 2026-07-15T22:03:01Z
**Status:** passed
**Re-verification:** No - initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | The exact Django 5.2.16, pytest 9.1.1, and pytest-django 4.12.0 identities were approved from official sources before locking. | VERIFIED | The user confirmation is present in the execution context. Fresh PyPI JSON checks and official Git tag lookups independently resolved Django `5.2.16`, pytest `9.1.1`, and pytest-django `v4.12.0` with Python `>=3.10` and the expected official repositories. |
| 2 | The Python 3.12 dependency baseline reproduces from `uv.lock`, exports runtime dependencies only, and begins from the exact five-file source fence. | VERIFIED | Fresh public clone passed `uv sync --locked`, `uv lock --check`, Python `3.12`, Django `5.2.16`, and the exact in-place runtime export with zero diff. Commit `1222766` contains exactly `.gitignore`, `.python-version`, `pyproject.toml`, `requirements.txt`, and `uv.lock`; `README.md` and `main.py` are absent there. |
| 3 | The generated Django project and `tasks` app load with conventional SQLite settings from the exact scaffold commit. | VERIFIED | Commit `d74df62` contains exactly 19 tracked files, has an empty app URL pattern set, has no admin route, and has an imports-only public test file. Current settings retain SQLite and `tasks.apps.TasksConfig`; fresh `manage.py check` succeeds. |
| 4 | A reader can clone public `stage-1-deploy`, install the lock, and start Django on `0.0.0.0:8000`. | VERIFIED | An independent HTTPS tag clone resolved accepted commit `ca115bf21b599c14e667b336bd78e3c587c24208`, installed from the lock, migrated, and started Django 5.2.16 on `0.0.0.0:8000`. The verifier observed the startup banner and completed real HTTP and Chromium requests before stopping the owned server. |
| 5 | `GET /health` returns HTTP 200 and exactly `{"status":"ok"}` through public routing. | VERIFIED | `test_health_is_public` passes, fresh-clone runtime JSON passed exact `jq` equality, and the retained RED `6cf89c1` fails before direct child GREEN `aa5ebf1` passes. |
| 6 | `GET /` renders the accessible empty Task Board, title form, CSRF field, count, empty state, local CSS, and zero scripts. | VERIFIED | `test_empty_task_board_is_rendered` passes. Template and CSS inspection confirm the labeled form, CSRF token, one app-local stylesheet, semantic list, visible focus styles, responsive media rule, and zero script elements. RED `0b56050` fails before direct child GREEN `c747493` passes. |
| 7 | The Task schema has a generated integer key, required 200-character title, incomplete default, stable ID ordering, and a replayable committed migration. | VERIFIED | `tasks/models.py` and `tasks/migrations/0001_initial.py` agree on `BigAutoField`, `max_length=200`, `default=False`, and `ordering=['id']`. A deleted database accepted all migrations, `showmigrations` returned `[X] 0001_initial`, and `makemigrations --check --dry-run` reported no drift. |
| 8 | Valid `POST /tasks/` performs create/redirect/get and a later page renders the title, `1 task`, and `Open`. | VERIFIED | The focused test passes. Independent fresh-clone HTTP returned 302 with `Location: /`, then rendered the persisted title, count, and open state. Independent Chromium repeated the labeled form flow. RED `8205741` fails before direct child GREEN `81e2b51` passes. |
| 9 | Whitespace-only titles render `Enter a task title.` and leave the later board empty. | VERIFIED | `test_invalid_task_title_shows_feedback_without_creating_task` passes against Django's real ModelForm and test database. The form exposes only `title`. RED `f9c7037` fails before direct child GREEN `197b15a` passes. |
| 10 | `GET /admin/login/` renders native Django login controls while `Task` remains registered behind Django authentication. | VERIFIED | The focused test and fresh-clone browser flow observed administration, username, password, CSRF, and login controls. Executable shell checks prove `admin.site.is_registered(Task)` and anonymous `/admin/` redirects to the login boundary. RED `a5f300c` fails before direct child GREEN `e9f8c13` passes. |
| 11 | The focused suite contains exactly five public behaviors and the retained history contains five real direct RED/GREEN pairs in the exact 13-subject sequence. | VERIFIED | Fresh public clone returned `5 passed`. Each of the five RED commits was checked out and its single named node independently failed; each direct GREEN child was checked out and the same node passed. Every RED modifies only `tests/test_public_http.py`. Full history and all subjects match the planned 13-line sequence. |
| 12 | `README.md` documents and reproduces locked sync, migration, drift, tests, export, `runserver 0.0.0.0:8000 --noreload`, health, rendered creation/listing, admin login, and SQLite cleanup. | VERIFIED | The README contains the complete immutable-tag reader path. Its lock, migration, test, export, runtime, CSRF creation, later GET, admin, and cleanup commands were independently exercised from the public tag. |
| 13 | Public main, protected annotated `stage-1-deploy`, and the fresh clone form one exact accepted identity graph. | VERIFIED | GitHub reports public `yangchuansheng/sealos-django-tutorial`, default `main`, and main commit `ca115bf...`. Annotated tag object `0d9254d...` has message `Django deploy stage` and peels to accepted main. Ruleset `19014157` is active for `refs/tags/stage-*` with exactly update/deletion, empty bypass, and empty exclude lists. The preflight-created repository path is coherent with the current exact remote ref graph. |
| 14 | Local and public-replay acceptance return to the required zero-residue state. | VERIFIED | Final independent readback shows source Git status clean, source `db.sqlite3` absent, verifier clone/temp roots absent, owned server stopped, port 8000 free, and all Phase 24 named browser sessions absent. Unrelated pre-existing browser sessions were preserved. |

**Score:** 14/14 truths verified (0 present, behavior-unverified)

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `pyproject.toml`, `uv.lock`, `requirements.txt`, `.python-version`, `.gitignore` | Exact Python 3.12 lock/export and source fence | VERIFIED | Exact versions, groups, pytest settings, runtime-only export, ignore rules, lock check, and five-file initial commit all pass. |
| `taskboard/settings.py`, `taskboard/urls.py` | SQLite project settings and root routing | VERIFIED | Django loads, tasks app is installed, SQLite is ignored, app URLs and native admin are mounted. |
| `tasks/models.py`, `tasks/migrations/0001_initial.py`, `tasks/forms.py` | Schema, replay owner, and title-only input boundary | VERIFIED | Structural fields agree, fresh replay passes, drift is zero, and ModelForm field allowlist is exact. |
| `tasks/views.py`, `tasks/urls.py` | Health, board, creation, and invalid-form handlers | VERIFIED | Public routes call substantive views; public tests and fresh runtime requests cover all paths. |
| `tasks/templates/tasks/board.html`, `tasks/static/tasks/styles.css` | Rendered Task Board and local responsive presentation | VERIFIED | Dynamic task/form data renders through Django autoescaping; CSS is substantive at 216 lines and loaded successfully in Chromium. |
| `tasks/admin.py` | Native administration ownership | VERIFIED | Registry and anonymous-authentication assertions pass. |
| `tests/test_public_http.py` | Exactly five public behavior seams | VERIFIED | Five tests pass against real Django routing, ORM, forms, templates, middleware, admin, and test database. |
| `README.md` | Complete Stage 1 reader workflow | VERIFIED | Commands match the immutable tag and were replayed from a fresh clone. |
| Public `main`, `refs/tags/stage-1-deploy`, ruleset | Immutable accepted source identity | VERIFIED | Owner, visibility, default branch, direct object, peeled commit, tag metadata, target, enforcement, conditions, and rules all read back exactly. |

The generic GSD artifact query resolves paths under the planning repository and
therefore reports the plans' absolute external-repository paths as missing.
The verifier treated those results as a path-resolution limitation and checked
every external artifact directly at all four levels: existence, substance,
wiring, and flowing runtime data.

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `pyproject.toml` | `uv.lock` and `requirements.txt` | Locked resolution and runtime-only export | WIRED | Lock check, locked sync, version readback, regeneration, and zero diff pass in a fresh public clone. |
| `taskboard/urls.py` | `tasks/urls.py` | Root `include('tasks.urls')` | WIRED | Public `/`, `/health`, and `/tasks/` requests resolve through the app URLconf. |
| `tasks/urls.py` | `tasks/views.py` | Named board, health, and create routes | WIRED | Tests plus live runtime requests execute each handler. |
| `Task` model | `0001_initial.py` | Django migration state | WIRED | Model and migration agree; fresh migration and zero-drift checks pass. |
| `Task` and `TaskForm` | `create_task` and board template | Bound validation/save plus rendered form/tasks | WIRED | Valid data saves and redirects; invalid data renders stable feedback; later GET supplies real ordered rows. |
| Board template | `/tasks/` | Namespaced CSRF form action | WIRED | Browser and curl submissions pass through CSRF and return PRG behavior. |
| `taskboard/urls.py` and `tasks/admin.py` | `/admin/login/` | Native admin routing and Task registration | WIRED | Login renders; registry is true; anonymous administration redirects. |
| Public `main` | Annotated tag and ruleset | Direct/peeled identity and stage-tag protection | WIRED | Direct tag object, peeled accepted commit, and exact active protection all agree. |
| Fresh public tag clone | Lock, migration, suite, and runtime | Immutable-source replay | WIRED | Exact history/inventory, setup, schema, tests, HTTP, Chromium, and cleanup all pass. |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| Board view/template | `tasks` | `Task.objects.all()` ordered by model metadata | Yes - empty state and persisted task row were both observed | FLOWING |
| Creation workflow | bound `TaskForm` | Public POST data through CSRF and ModelForm | Yes - save, redirect, later GET, title/count/state observed | FLOWING |
| Invalid workflow | bound form errors | Whitespace-only public POST | Yes - stable field error rendered and no task appeared | FLOWING |
| Administration | registered `Task` model | Django admin registry and auth/session stack | Yes - native login and protected admin boundary observed | FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Fresh public source reproduction | Clone `stage-1-deploy`; exact history/inventory; locked sync/export | 13 subjects, 24 files, Python 3.12, Django 5.2.16, zero diff | PASS |
| Fresh migration | `migrate --noinput`, `showmigrations`, `makemigrations --check --dry-run` | `tasks.0001_initial` applied; no drift | PASS |
| Complete public suite | `uv run pytest -q` | `5 passed in 0.13s` | PASS |
| TDD history | Checkout and run one named node at every RED and direct GREEN | Five RED failures and five direct GREEN passes | PASS |
| Runtime health and board | Owned `runserver 0.0.0.0:8000 --noreload`, curl health/board | Exact JSON and rendered board | PASS |
| Public task workflow | CSRF POST and independent Chromium labeled-form flow | 302 to `/`; later `1 task` and `OPEN` | PASS |
| Administration | Chromium `/admin/login/` plus executable registry/protection assertions | Native controls, registered Task, anonymous redirect | PASS |
| GitHub identity | `gh repo view`, `gh api .../rulesets`, `git ls-remote` | All accepted fields exact | PASS |
| Cleanup | PID/port/session/path/database/status readback | Every Phase 24 owned residue absent | PASS |

### Probe Execution

No phase plan or implementation path declares a `probe-*.sh` artifact. Probe
execution is not applicable; the runnable acceptance surface is covered by the
fresh-clone commands above.

### Requirements Coverage

| Requirement | Source Plans | Description | Status | Evidence |
|-------------|--------------|-------------|--------|----------|
| DJAN-01 | 24-01 through 24-05 | Reader can clone a public Task Board stage exposing health, rendered task pages, and Django administration on port 8000. | SATISFIED | Fresh public tag clone, exact lock, migration, five public tests, live port-8000 HTTP, Chromium workflow, admin checks, public identity, and cleanup all pass. |

No Phase 24 requirement is orphaned. `TDD-02` remains mapped to Phase 25 by
the milestone traceability contract.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| None | - | No `TBD`, `FIXME`, `XXX`, `TODO`, `HACK`, placeholder, empty implementation, unsafe template filter, remote board asset, or later-stage runtime dependency was found. | - | - |

### Disconfirmation Notes

- The administration HTTP test alone proves the login surface. Independent
  registry and anonymous redirect assertions close the ownership/protection
  portion of the contract.
- The board test proves the CSS reference and script boundary. Independent
  Chromium network logs confirm the app stylesheet returns HTTP 200.
- The current five-test contract does not name an overlength-title case or a
  direct `GET /tasks/` case. The schema and ModelForm enforce the 200-character
  bound; the roadmap and Phase 24 behavior contract specify POST behavior.

### Human Verification Required

None. Every phase-goal behavior, including the real rendered browser flow, was
independently exercised through the accepted public tag.

### Gaps Summary

No blocking gaps, warnings, deferred corrections, or behavior-unverified truths
remain. The Stage 1 scope fence is intact: PostgreSQL work belongs to Phase 25,
and production serving belongs to Phase 26.

---

_Verified: 2026-07-15T22:03:01Z_
_Verifier: the agent (gsd-verifier)_
