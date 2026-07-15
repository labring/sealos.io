---
phase: 21
slug: fastapi-deploy-stage
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-07-15
---

# Phase 21 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | pytest 9.1.1 with FastAPI TestClient and HTTPX 0.28.1 |
| **Config file** | `/Users/longnv/bin/repo/sealos-fastapi-tutorial/pyproject.toml` |
| **Quick run command** | `uv run pytest tests/test_api.py -q -x` |
| **Full suite command** | `uv run pytest -q` |
| **Estimated runtime** | Under 10 seconds |

---

## Sampling Rate

- **After every red commit:** Run the single named test and retain its expected failure.
- **After every green commit:** Run the single named test and observe a pass.
- **After every task commit:** Run `uv run pytest tests/test_api.py -q -x`.
- **After every plan wave:** Run `uv run pytest -q` and the lock/export check.
- **Before `$gsd-verify-work`:** Full suite, port smoke, public clone, and tag integrity checks must pass.
- **Max feedback latency:** 10 seconds for local HTTP behavior tests.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 21-01-01 | 01 | 1 | FAST-01 | T-21-01 | Runtime export excludes development tools | dependency | `uv sync --locked && uv lock --check && uv export --locked --no-dev --no-emit-project --no-hashes --format requirements.txt -o requirements.txt && git diff --exit-code -- uv.lock requirements.txt` | W0 | pending |
| 21-01-02 | 01 | 1 | FAST-01 | T-21-02 | Public health and docs expose bounded responses | HTTP behavior | `uv run pytest tests/test_api.py -q -k 'health or swagger'` | W0 | pending |
| 21-02-01 | 02 | 2 | FAST-01 | T-21-02 | Task input is validated and state remains test-isolated | HTTP behavior | `uv run pytest tests/test_api.py -q -k 'create or list or get'` | W0 | pending |
| 21-02-02 | 02 | 2 | FAST-01 | T-21-02 | Updates, deletion, invalid input, and missing IDs use stable status codes | HTTP behavior | `uv run pytest tests/test_api.py -q -k 'update or delete or invalid or missing'` | W0 | pending |
| 21-03-01 | 03 | 3 | FAST-01 | T-21-03 | Public tag resolves the accepted source commit | publication | `uv run pytest -q && git ls-remote --tags origin 'refs/tags/stage-1-deploy^{}'` | W0 | pending |

*Status: pending, green, red, or flaky.*

---

## Wave 0 Requirements

- [ ] `/Users/longnv/bin/repo/sealos-fastapi-tutorial/pyproject.toml` - exact runtime and development dependencies plus pytest configuration.
- [ ] `/Users/longnv/bin/repo/sealos-fastapi-tutorial/app/main.py` - application factory and public seam used by TestClient and Uvicorn.
- [ ] `/Users/longnv/bin/repo/sealos-fastapi-tutorial/tests/test_api.py` - function-scoped client fixture and first failing behavior.
- [ ] `/Users/longnv/bin/repo/sealos-fastapi-tutorial/uv.lock` - locked Python 3.12 dependency graph.
- [ ] `/Users/longnv/bin/repo/sealos-fastapi-tutorial/requirements.txt` - runtime-only exact export.

---

## Phase Gate Commands

| Gate | Command | Observable result |
|------|---------|-------------------|
| Full HTTP contract | `uv run pytest -q` | Nine public behavior tests pass. |
| Reproducible dependencies | `uv sync --locked && uv lock --check && uv export --locked --no-dev --no-emit-project --no-hashes --format requirements.txt -o requirements.txt && git diff --exit-code -- uv.lock requirements.txt` | Exit 0 and generated artifacts stay unchanged. |
| Port 8000 | `uv run uvicorn app.main:app --host 0.0.0.0 --port 8000` plus curls to `/health` and `/docs` | Health JSON and Swagger HTML return HTTP 200. |
| Public clone | Clone `stage-1-deploy`, then run `uv sync --locked && uv run pytest -q` | Clean public clone installs and passes nine tests. |
| Tag integrity | Compare local HEAD to the peeled remote tag and query the active tag ruleset | SHAs match and update/deletion protections are active. |

---

## Manual-Only Verifications

All phase behaviors have command-line or HTTP verification.

---

## Validation Sign-Off

- [x] All anticipated tasks have an automated command or Wave 0 dependency.
- [x] Sampling continuity allows no three consecutive tasks without automated verification.
- [x] Wave 0 covers every missing test and dependency artifact.
- [x] Commands use terminating test modes.
- [x] Local HTTP feedback latency target is under 10 seconds.
- [x] `nyquist_compliant: true` is set in frontmatter.

**Approval:** approved 2026-07-15 for planning
