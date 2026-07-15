---
phase: 25-django-postgresql-stage
plan: "01"
subsystem: dependency-foundation
tags: [django, psycopg, postgresql, python-3.12, uv, supply-chain]

requires:
  - phase: 24-django-deploy-stage
    provides: Accepted Django Stage 1 source, migration, public behavior, and protected tag identity
provides:
  - Human-approved official identities for psycopg and psycopg-binary 3.3.4
  - Reproducible Python 3.12 lock containing both Psycopg distributions
  - Runtime-only requirements export from an exact three-file dependency commit
affects: [25-02, 25-03, 25-04, 25-05, django-production-stage]

tech-stack:
  added: [psycopg 3.3.4, psycopg-binary 3.3.4, typing-extensions 4.16.0]
  patterns: [official-source package gate, exact uv lock, runtime-only requirements export, immutable stage ancestry]

key-files:
  created: []
  modified:
    - /Users/longnv/bin/repo/sealos-django-tutorial/pyproject.toml
    - /Users/longnv/bin/repo/sealos-django-tutorial/uv.lock
    - /Users/longnv/bin/repo/sealos-django-tutorial/requirements.txt

key-decisions:
  - "Approve psycopg and psycopg-binary 3.3.4 only after PyPI, official installation documentation, and the annotated upstream tag agree."
  - "Preserve the accepted Stage 1 commit, tag, migration, direct dependency pins, and 24-file inventory while adding one runtime dependency."
  - "Derive requirements.txt from uv.lock with development dependencies excluded."

patterns-established:
  - "Psycopg gate: verify both distributions, the binary-extra prescription, Python support, release state, and peeled source tag before mutation."
  - "Stage 2 dependency parent: change only pyproject.toml, uv.lock, and requirements.txt in one exact commit."

requirements-completed: []

coverage:
  - id: D1
    description: "The two Psycopg distributions have approved official identities for release 3.3.4 and the matching upstream source tag."
    requirement: DJAN-02
    verification:
      - kind: integration
        ref: "PyPI JSON assertions, official Psycopg installation page, and git ls-remote for tag 3.3.4"
        status: pass
    human_judgment: false
  - id: D2
    description: "The Python 3.12 dependency graph locks and exports psycopg 3.3.4 while preserving the accepted Django Stage 1 boundary."
    requirement: DJAN-02
    verification:
      - kind: integration
        ref: "uv lock --check && uv sync --locked && uv export --locked --no-dev --no-emit-project"
        status: pass
      - kind: integration
        ref: "exact commit parent, three-file scope, Stage 1 tag, migration SHA-256, inventory, and clean-status assertions"
        status: pass
    human_judgment: false

duration: 3 min
completed: 2026-07-16
status: complete
---

# Phase 25 Plan 01: Approved Psycopg Dependency Summary

**Official Psycopg 3.3.4 identities and a clean three-file Python 3.12 dependency commit now anchor Django Stage 2**

## Performance

- **Duration:** 3 min
- **Started:** 2026-07-15T23:22:38Z
- **Completed:** 2026-07-15T23:25:42Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Reconfirmed both Psycopg 3.3.4 distributions through official PyPI metadata, installation documentation, and the annotated upstream source tag before package mutation.
- Locked `psycopg[binary]==3.3.4` with Python 3.12 and regenerated the exact runtime-only requirements export.
- Preserved the Stage 1 parent commit, protected tag objects, migration hash, direct package pins, 24-file inventory, five public tests, and clean source state.

## Package Identity Checkpoint

The user repeatedly approved the milestone dependency decisions, previously
approved Psycopg 3.3.4 in the verified FastAPI PostgreSQL stage, and delegated
exact patch selection. The orchestrator surfaced all exact official identity
facts again and marked the blocking checkpoint satisfied before package
mutation.

| Distribution | Version | Python | Official repository | Release date |
|--------------|---------|--------|---------------------|--------------|
| psycopg | 3.3.4 | `>=3.10` | `https://github.com/psycopg/psycopg` | 2026-05-01 |
| psycopg-binary | 3.3.4 | `>=3.10` | `https://github.com/psycopg/psycopg` | 2026-05-01 |

The official installation page prescribes `psycopg[binary]`. Annotated tag
object `6697f47c113ea47c671fd2c7a286074b88182a9b` peels to commit
`83f110367cdd249cc0a352e2246ecea9e878e5a0`. All PyPI artifacts report
`yanked: false`. The GSD legitimacy seam reports SUS solely because download
telemetry is unavailable; it supplies no SLOP verdict. Official package,
documentation, and source identities are coherent.

## Dependency Baseline

- `pyproject.toml` retains Django 5.2.16, pytest 9.1.1, pytest-django 4.12.0, and Python `>=3.12,<3.13`, while adding `psycopg[binary]==3.3.4` to runtime dependencies.
- `uv.lock` resolves `psycopg==3.3.4`, `psycopg-binary==3.3.4`, and `typing-extensions==4.16.0`.
- `requirements.txt` is reproduced from the lock with `--no-dev --no-emit-project`; pytest and pytest-django remain outside the runtime graph.
- Dependency commit `c0048058fab5e76bbf20c811dda43effa886c92f` is a direct child of accepted Stage 1 commit `ca115bf21b599c14e667b336bd78e3c587c24208` and changes exactly three dependency files.

## Artifact Identities

| Artifact | SHA-256 |
|----------|---------|
| `pyproject.toml` | `72a784153af207dccb4ef745ad99a406b8530cbcb7da55a4114ee8cba3788a4d` |
| `uv.lock` | `a02b8d643f521728b080ba4a7b290fabaf26821733713ca1b424dcffcb95910b` |
| `requirements.txt` | `f5d7eda82d69ed911d01287c248014dfa1fb3894c61529de2a928bad5fb3e6c9` |
| `tasks/migrations/0001_initial.py` | `745bc45f655bf0b164c1464c0c22786d22910e2aea235772e5dcea38495e4bf3` |

## Task Commits

1. **Task 1: Confirm exact Psycopg package identities** - approved checkpoint with repeated official-source verification
2. **Task 2: Lock the approved Psycopg runtime graph** - `c004805` (`chore`)

## Files Created/Modified

- `/Users/longnv/bin/repo/sealos-django-tutorial/pyproject.toml` - Adds the exact approved Psycopg binary-extra runtime pin.
- `/Users/longnv/bin/repo/sealos-django-tutorial/uv.lock` - Locks both Psycopg distributions and their runtime dependencies for Python 3.12.
- `/Users/longnv/bin/repo/sealos-django-tutorial/requirements.txt` - Exports the exact runtime-only compatibility graph.
- `.planning/phases/25-django-postgresql-stage/25-01-SUMMARY.md` - Records package approval, artifact identities, and retained Stage 1 evidence.

## Decisions Made

- Accepted the previously approved exact Psycopg 3.3.4 identities after repeating every official-source assertion in this plan.
- Kept Stage 1 source identity immutable and established one exact dependency-only parent for all PostgreSQL behavior commits.
- Left `DJAN-02`, `TDD-02`, and `TDD-03` pending for Phase 25 verification because this plan supplies only their dependency foundation.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Known Stubs

None.

## Next Phase Readiness

- Commit `c004805` is the clean direct child of accepted Stage 1 for Plan 25-02.
- Exact psycopg 3 packages are available for real PostgreSQL settings, readiness, and test-foundation work.
- Database behavior, migration Jobs, persistence, publication, and phase requirements remain assigned to Plans 25-02 through 25-05.

## Self-Check: PASSED

- All three dependency files exist and are the exact scope of commit `c004805`.
- Official PyPI identities, installation guidance, annotated source tag, and peeled commit assertions pass.
- Lock, sync, Django 5.2.16, runtime export, both Psycopg distributions, and development-dependency exclusion assertions pass.
- Stage 1 direct and peeled tag identities, migration SHA-256, parent inventory, five public tests, and clean status assertions pass.

---
*Phase: 25-django-postgresql-stage*
*Completed: 2026-07-16*
