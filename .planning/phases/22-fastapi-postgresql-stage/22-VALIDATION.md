---
phase: 22
slug: fastapi-postgresql-stage
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-07-15
---

# Phase 22 - Validation Strategy

> Per-phase validation contract for real PostgreSQL feedback sampling.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | pytest, FastAPI TestClient, Alembic CLI, real PostgreSQL 17.10 in Sealos Kubernetes |
| **Config files** | `pyproject.toml`, `alembic.ini`, `tests/conftest.py` |
| **Quick run command** | `TEST_DATABASE_URL="$URL" uv run pytest tests/test_api.py -q -x` |
| **Full suite command** | `./scripts/test-postgres.sh` |
| **Feedback target** | Under 20 seconds per focused HTTP slice after PostgreSQL readiness |

---

## Sampling Rate

- **After every RED commit:** Run the one named migration, HTTP, health, or Job test and retain its expected failure.
- **After every GREEN commit:** Run the same named test and the accumulated focused file against real PostgreSQL.
- **After every task commit:** Run the focused pytest file plus `uv lock --check`.
- **After every plan wave:** Run migrations, the full HTTP suite, runtime export, strict Job dry-run, and run-labeled resource inventory.
- **Before `$gsd-verify-work`:** Run the full harness, fresh public clone, tag/ruleset checks, and zero-resource cleanup proof.
- **Max feedback latency:** 20 seconds for focused tests; 10 minutes for the full Kubernetes harness.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 22-01-01 | 01 | 1 | FAST-02 | T-22-01 | New package sources and exact pins resolve before lock generation | dependency | `uv lock --check && uv tree --locked` | W0 | pending |
| 22-01-02 | 01 | 1 | FAST-02 | Alembic owns a repeatable fresh schema | integration | `DATABASE_URL="$URL" uv run alembic upgrade head && DATABASE_URL="$URL" uv run alembic upgrade head && DATABASE_URL="$URL" uv run alembic current` | W0 | pending |
| 22-02-01 | 02 | 2 | TDD-01, FAST-02 | A later application instance reads a retained task through HTTP | HTTP integration | `TEST_DATABASE_URL="$URL" uv run pytest tests/test_api.py -q -k 'survives or create or get'` | W0 | pending |
| 22-02-02 | 02 | 2 | TDD-01, FAST-02 | List, update, delete, validation, docs, and errors retain their public contracts | HTTP regression | `TEST_DATABASE_URL="$URL" uv run pytest tests/test_api.py -q -x` | Existing plus W0 fixtures | pending |
| 22-03-01 | 03 | 3 | TDD-01, FAST-02 | Readiness stays 503 until PostgreSQL and schema are ready | HTTP integration | `TEST_DATABASE_URL="$URL" uv run pytest tests/test_health.py -q -x` | W0 | pending |
| 22-03-02 | 03 | 3 | FAST-02 | Production Job schema and two source Job runs complete before readiness | Kubernetes integration | `./scripts/test-postgres.sh --jobs-only` | W0 | pending |
| 22-04-01 | 04 | 4 | FAST-02 | Protected Stage 2 source reproduces from a clean clone and leaves no test resources | publication | `./scripts/test-postgres.sh --phase-gate` | W0 | pending |

*Status: pending, green, red, or flaky.*

---

## Wave 0 Requirements

- [ ] `tests/conftest.py` - required real-PostgreSQL URL, per-test truncate/identity reset, and fresh clients.
- [ ] `tests/test_migrations.py` - fresh upgrade, current-head, and rerun behavior.
- [ ] `tests/test_health.py` - unconfigured, unreachable, unmigrated, and ready database states.
- [ ] `scripts/test-postgres.sh` - run-scoped Sealos resources, port-forward, evidence, Job proof, and trap cleanup.
- [ ] `deploy/source-migration-job.yaml` - pre-image migration Job validation adapter.

---

## Phase Gate Outcomes

| Gate | Observable result |
|------|-------------------|
| Fresh migration | `tasks` and `alembic_version` exist only after `alembic upgrade head`; rerun exits 0 at revision `0001`. |
| Public HTTP | Every inherited behavior plus cross-instance persistence passes against real PostgreSQL. |
| Readiness | Missing URL, closed port, and blank schema return stable 503; migrated PostgreSQL returns exact 200 health JSON. |
| Migration Jobs | Production manifest passes strict server dry-run; two source Job executions reach `Complete`. |
| Reproducibility | Lock and runtime export regenerate with zero diff in local and clean public clones. |
| Stage identity | Stage 1 tag stays unchanged; protected annotated Stage 2 tag peels to remote `main`. |
| Cleanup | No run-labeled Deployment, Pod, Service, Job, Secret, or ConfigMap remains and the port-forward PID is gone. |

---

## Manual-Only Verifications

All Phase 22 behaviors have CLI, Kubernetes, Git, GitHub API, or public HTTP verification.

---

## Validation Sign-Off

- [x] Every anticipated task has an automated command or Wave 0 dependency.
- [x] Sampling continuity allows no three consecutive tasks without automated feedback.
- [x] Wave 0 covers every missing test and harness artifact.
- [x] Commands terminate and the full harness has bounded waits plus cleanup traps.
- [x] Public behavior uses real PostgreSQL and real framework collaborators.
- [x] `nyquist_compliant: true` is set in frontmatter.

**Approval:** approved 2026-07-15 for planning
