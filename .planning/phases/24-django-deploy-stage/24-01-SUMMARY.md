---
phase: 24-django-deploy-stage
plan: "01"
subsystem: dependency-foundation
tags: [django, python-3.12, uv, pytest, pytest-django, supply-chain]

requires:
  - phase: 23-fastapi-production-stage
    provides: Verified Python reference-application lock, publication, and replay pattern
provides:
  - Human-approved official identities for Django 5.2.16, pytest 9.1.1, and pytest-django 4.12.0
  - Reproducible Python 3.12 dependency graph with an exact runtime-only export
  - Exact five-file parent commit for Django project generation
affects: [24-02, 24-03, 24-04, 24-05, django-postgresql-stage]

tech-stack:
  added: [Django 5.2.16, pytest 9.1.1, pytest-django 4.12.0, uv 0.10.9]
  patterns: [official-source package gate, exact uv lock, runtime-only requirements export, tracked-source allowlist]

key-files:
  created:
    - /Users/longnv/bin/repo/sealos-django-tutorial/.gitignore
    - /Users/longnv/bin/repo/sealos-django-tutorial/.python-version
    - /Users/longnv/bin/repo/sealos-django-tutorial/pyproject.toml
    - /Users/longnv/bin/repo/sealos-django-tutorial/requirements.txt
    - /Users/longnv/bin/repo/sealos-django-tutorial/uv.lock
  modified: []

key-decisions:
  - "Approve the exact package identities only after PyPI metadata and official repository tags agree."
  - "Treat pytest-django's Repository-labeled PyPI URL as authoritative while recording its stale changelog status."
  - "Keep the initial source boundary to five dependency and configuration files, with both uv application samples removed."

patterns-established:
  - "Dependency gate: verify registry identity, repository ownership, release tag, Python support, and release date before locking."
  - "Stage baseline: derive runtime requirements from uv.lock and compare the tracked source to an exact allowlist."

requirements-completed: [DJAN-01]

coverage:
  - id: D1
    description: "The three direct packages have approved official PyPI identities and matching source release tags."
    requirement: DJAN-01
    verification:
      - kind: integration
        ref: "PyPI JSON assertions plus git ls-remote for Django 5.2.16, pytest 9.1.1, and pytest-django v4.12.0"
        status: pass
    human_judgment: false
  - id: D2
    description: "The Python 3.12 baseline reproduces from a clean exact five-file commit and exports runtime dependencies only."
    requirement: DJAN-01
    verification:
      - kind: integration
        ref: "uv lock --check && uv sync --locked && uv export --locked --no-dev --no-emit-project"
        status: pass
    human_judgment: false

duration: 3 min
completed: 2026-07-16
status: complete
---

# Phase 24 Plan 01: Django Dependency Baseline Summary

**Official-source package approval and a clean five-file Python 3.12 dependency baseline now anchor Django Stage 1**

## Performance

- **Duration:** 3 min
- **Started:** 2026-07-15T20:36:08Z
- **Completed:** 2026-07-15T20:39:25Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments

- Confirmed all three exact distributions through PyPI metadata and matching tags in their official repositories before package resolution.
- Locked Django 5.2.16 with pytest 9.1.1 and pytest-django 4.12.0 under the Python `>=3.12,<3.13` constraint.
- Created the exact five-file first commit and proved that its runtime export excludes development packages.

## Package Identity Checkpoint

The user approved the exact package identities after the official-source
evidence was surfaced. Package operations began after that approval.

| Package | Version | Python | Official repository | Official tag | Release date |
|---------|---------|--------|---------------------|--------------|--------------|
| Django | 5.2.16 | `>=3.10` | `https://github.com/django/django` | `5.2.16` | 2026-07-07 |
| pytest | 9.1.1 | `>=3.10` | `https://github.com/pytest-dev/pytest` | `9.1.1` | 2026-06-19 |
| pytest-django | 4.12.0 | `>=3.10` | `https://github.com/pytest-dev/pytest-django` | `v4.12.0` | 2026-02-14 |

The GSD legitimacy seam classified Django and pytest as SUS for `too-new` and
`unknown-downloads`. It classified pytest-django as SUS for
`unknown-downloads` and `no-repository`; PyPI exposes that official URL under
the `Repository` label, which explains the repository false negative. PyPI and
the official `v4.12.0` source tag confirm the pytest-django release while its
documentation changelog still labels 4.12.0 as unreleased. This discrepancy
was recorded and accepted before locking.

## Dependency Baseline

- `.python-version` selects Python 3.12.
- `pyproject.toml` pins the three approved direct packages in runtime and development groups and configures pytest for `taskboard.settings`.
- `uv.lock` resolves the exact Python 3.12 graph.
- `requirements.txt` is a locked runtime-only export containing Django and its runtime dependencies, with pytest packages excluded.
- `.gitignore` excludes environments, Python and pytest caches, coverage output, macOS metadata, and mutable `db.sqlite3` state.

## Task Commits

1. **Task 1: Confirm exact package identities before installation** - approved checkpoint with official-source evidence
2. **Task 2: Lock the exact dependency baseline** - `1222766` (`chore`)

## Files Created/Modified

- `/Users/longnv/bin/repo/sealos-django-tutorial/.gitignore` - Excludes generated environments, caches, coverage artifacts, and SQLite state.
- `/Users/longnv/bin/repo/sealos-django-tutorial/.python-version` - Selects Python 3.12.
- `/Users/longnv/bin/repo/sealos-django-tutorial/pyproject.toml` - Pins approved dependencies and configures pytest.
- `/Users/longnv/bin/repo/sealos-django-tutorial/requirements.txt` - Records the exact runtime-only compatibility export.
- `/Users/longnv/bin/repo/sealos-django-tutorial/uv.lock` - Locks the complete Python 3.12 dependency graph.
- `.planning/phases/24-django-deploy-stage/24-01-SUMMARY.md` - Records checkpoint and baseline evidence.

## Decisions Made

- Approved only the three exact versions named in D-04 after official-source verification passed.
- Retained the pytest-django metadata discrepancy as explicit supply-chain evidence.
- Removed `README.md` and `main.py` immediately after `uv init --app`; Plan 24-02 owns Django source generation.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Known Stubs

None. The `taskboard.settings` pytest target intentionally becomes available in Plan 24-02 before test collection begins.

## Next Phase Readiness

- Commit `1222766` is the clean one-commit parent for Plan 24-02.
- Django project and application generation can begin from the exact approved lock.
- PostgreSQL, production serving, and deployment concerns remain assigned to Phases 25 and 26.

## Self-Check: PASSED

- All five baseline files exist and are the repository's exact tracked inventory.
- Commit `1222766` exists with the required subject on `main`.
- Lock, sync, Django version, runtime-only export, absent samples, and clean status assertions pass.

---
*Phase: 24-django-deploy-stage*
*Completed: 2026-07-16*
