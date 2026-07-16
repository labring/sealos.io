---
phase: 25-django-postgresql-stage
verified: 2026-07-16T04:16:24Z
status: passed
score: 23/23 must-haves verified
behavior_unverified: 0
overrides_applied: 0
requirements:
  - TDD-02
  - TDD-03
  - DJAN-02
---

# Phase 25: Django PostgreSQL Stage Verification Report

**Phase Goal:** Readers can use persistent Task Board data after repeatable
FastAPI and Django migration Jobs have proven the shared fresh-database
contract.
**Verified:** 2026-07-16T04:16:24Z
**Status:** passed
**Re-verification:** No - initial independent verification

## Goal Achievement

### Roadmap Success Criteria

| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| 1 | FastAPI Alembic and Django migration Jobs complete against fresh PostgreSQL before readiness | VERIFIED | Checksum-verified FastAPI run `3cdb81734d85` and Django runs `d98895ed9879`, `07c61f7500a4`, `fdf9f742a798`, and `eafdda9a17fb` record fresh/repeat migrations, two Job completions, and later health 200. |
| 2 | Public Django health, rendered task creation/listing, and administration are usable | VERIFIED | Independent verifier run `b8fa47bead7c` passed 22/22 public/readiness cases on real PostgreSQL. Retained JSONL records exact 503/200 states, POST 302, later GET 200, admin index, and authenticated change-form title. |
| 3 | A Django restart retains the database-backed Task record | VERIFIED | The checked-in phase gate stops and reaps process A before starting B; checksum-verified runs render the same run-derived title through B and native Django administration. |
| 4 | Both framework gates prove Job completion, readiness, public read/write, and cleanup on real PostgreSQL | VERIFIED | Immutable FastAPI and protected Django Stage 2 evidence records the complete sequences; live `--assert-clean-all` returned all five ownership categories at zero. |

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Official psycopg and psycopg-binary 3.3.4 identities were approved before mutation | VERIFIED | Live PyPI, official installation documentation, and upstream annotated-tag checks agree; tag `3.3.4` peels to `83f110367cdd249cc0a352e2246ecea9e878e5a0`. |
| 2 | Python 3.12 locks and exports the exact psycopg runtime graph | VERIFIED | `uv lock --check`, regenerated runtime export, Django 5.2.16, psycopg 3.3.4, and psycopg-binary 3.3.4 passed with a clean tree. |
| 3 | The dependency commit has the exact three-file scope and subject | VERIFIED | Commit `c0048058` changes only `pyproject.toml`, `requirements.txt`, and `uv.lock`. |
| 4 | Stage 1 dependencies, 24-file inventory, migration, and protected tag remain exact | VERIFIED | Stage 1 direct `0d9254d3`, peeled `ca115bf2`, message `Django deploy stage`, and migration SHA-256 `745bc45f...` all match the accepted boundary. |
| 5 | Each focused database run owns a dedicated run-labeled PostgreSQL 17 service | VERIFIED | Harness source binds every object to one 12-hex run ID and exact label; verifier runs `769419abbd29` and `b8fa47bead7c` provisioned independently and cleaned to zero. |
| 6 | Stage 2 uses explicit PostgreSQL URLs, a distinct test database, and no SQLite runtime path | VERIFIED | `taskboard/settings.py` accepts only `postgres`/`postgresql`, sets explicit `TEST.NAME`, and uses the dummy backend only for unavailable health. Source scan found no SQLite backend. |
| 7 | Public health returns exact 503 until the Task table exists and exact 200 after migration | VERIFIED | `tasks/views.py` uses `Task._meta.db_table` through Django introspection; the 22/22 real-database run covers invalid URLs and unmigrated/migrated responses. |
| 8 | Exactly five retained public Stage 1 behaviors pass with real collaborators and PostgreSQL | VERIFIED | `tests/test_public_http.py` retains the exact five functions; routing, ORM, ModelForm, templates, middleware, sessions, and admin remain real. |
| 9 | The immutable migration applies fresh, repeats at current head, and has zero drift | VERIFIED | `tests/test_migrations.py`, the operator harness, and retained migration evidence verify absent table, exact columns, `[X] 0001_initial`, repeat migrate, and no drift. |
| 10 | The production Job runs the exact Django migrate command from a future immutable image and Secret key `url` | VERIFIED | `deploy/migration-job.yaml` is an exact tested `batch/v1` one-shot contract with non-root security, bounds, and `python manage.py migrate --noinput`. |
| 11 | One source Job identity completes, is deleted, recreated, and completes again before health 200 | VERIFIED | `django-jobs.txt` records both `Complete=True` sequences for the same name and manifest hash; the phase gate orders sequence 2 before migrated health. |
| 12 | Rendering, ConfigMap input, logs, and cleanup are bounded, credential-free, and run-owned | VERIFIED | Exact ten-file allowlist, strict token rendering, mode-0600 manifests, bounded waits, log scans, and exact-label cleanup are implemented and tested. |
| 13 | Process A public CSRF write survives into process B | VERIFIED | Harness performs POST/redirect/later GET, verifies A stop and free port, then starts B against the same URL and renders the retained title. |
| 14 | Authenticated native Django administration renders the retained Task after restart | VERIFIED | Named browser flow authenticates ephemeral credentials, verifies the changelist, and reads the exact title from `/admin/tasks/task/1/change/`; durable evidence contains no credentials. |
| 15 | The complete Django gate preserves the required runtime order | VERIFIED | Source-contract test pins reproducibility, 503 probes, strict Job validation, two Jobs, health 200, migrations, full pytest, restart, admin, evidence, and cleanup in order. |
| 16 | README and evidence cover the complete Stage 2 reader workflow | VERIFIED | README documents clone, lock/export, credentials, migrations, health, Jobs, phase gate, rendered workflow, restart, admin, and cleanup; all required evidence files are substantive. |
| 17 | `--assert-clean-all` is read-only and covers both frameworks plus local ownership | VERIFIED | Source test rejects delete/kill/close/remove operations in the audit; live execution twice returned Django inventory, FastAPI inventory, processes, browsers, and paths at zero. |
| 18 | Immutable public FastAPI Stage 2 independently passed its complete PostgreSQL gate | VERIFIED | Live tag identity and fresh public source clone match object `b61254c2` / commit `2b256b3d`; checksum-verified run `3cdb81734d85` records 24 tests, two Jobs, readiness, public persistence, and cleanup. |
| 19 | Public Django main, Stage 1, and annotated Stage 2 match accepted source | VERIFIED | Public main and Stage 2 peeled commit are `16279958...`; Stage 2 object is `16f60a44...` with message `Django PostgreSQL stage`; Stage 1 remains exact. |
| 20 | Ruleset 19014157 retains exact active stage-tag protection | VERIFIED | Live GitHub API readback: tag target, include `refs/tags/stage-*`, empty exclude/bypass, and exactly deletion/update rules. |
| 21 | A fresh public Django Stage 2 clone reproduces source and the PostgreSQL gate | VERIFIED | Independent verifier clone passed exact tag, 24 subjects, 32 files, lock/export, migration SHA, and shell syntax; retained public runs `d54fc2398a70` and `eafdda9a17fb` cover 22 focused and 43 full real-PostgreSQL tests. |
| 22 | Final evidence has eight sorted verified inputs and zero owned residue | VERIFIED | `sha256sum -c` passed 8/8, exact input-set and credential scans passed, all data files are mode 0600, and live cleanup readback is zero. |
| 23 | Stage 2 source contains no Phase 26 runtime or Phase 27 tutorial content | VERIFIED | Exact 32-file inventory contains only the two allowed migration Job manifests; no Dockerfile, deployment runtime, Gunicorn, WhiteNoise, collectstatic implementation, tutorials, or screenshots exist. |

**Score:** 23/23 must-haves verified; 0 behavior-unverified.

## Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `pyproject.toml` | Exact Django/Psycopg pins | VERIFIED | Substantive, locked, and exported. |
| `uv.lock` | Python 3.12 runtime and development graph | VERIFIED | Lock check passes; exact identity retained in evidence. |
| `requirements.txt` | Runtime-only export | VERIFIED | Reproduction has zero diff and excludes pytest packages. |
| `scripts/test-postgres.sh` | Owned PostgreSQL and complete phase gate | VERIFIED | 1,803 lines; session, migration, Job, HTTP, browser, evidence, and cleanup modes are wired. |
| `taskboard/settings.py` | Strict PostgreSQL configuration | VERIFIED | Standard-library parsing, one-second timeout, explicit test database, no usable fallback. |
| `tasks/views.py` | Schema-aware health | VERIFIED | Database introspection returns exact public payloads. |
| `tests/test_postgresql.py` | URL and readiness behavior | VERIFIED | Real PostgreSQL behavioral assertions passed. |
| `tests/test_public_http.py` | Five public behaviors | VERIFIED | Exact five retained functions passed on real PostgreSQL. |
| `tests/test_migrations.py` | Fresh/repeat migration contract | VERIFIED | Immutable source, physical schema, applied state, and drift assertions. |
| `tests/test_postgres_harness.py` | Harness safety and ordering contract | VERIFIED | 17 active source-contract tests; no skips or mocks. |
| `tests/test_migration_job.py` | Exact Job manifests | VERIFIED | RED preceded both artifacts; exact-text contracts pass. |
| `deploy/migration-job.yaml` | Future immutable-image migration Job | VERIFIED | Strict one-shot, Secret-backed, non-root contract. |
| `deploy/source-migration-job.yaml` | Allowlisted executable migration adapter | VERIFIED | Ten tracked inputs, exact command, bounded resources, and read-only source. |
| `README.md` | Stage 2 reader workflow | VERIFIED | Full migration-before-readiness and cleanup path. |
| `evidence/django-http.jsonl` | Ordered public/admin observations | VERIFIED | Eleven valid compact JSON records. |
| `evidence/cleanup.txt` | Cross-framework zero-state evidence | VERIFIED | All accepted and public run IDs plus final zero inventory. |
| `refs/tags/stage-2-postgresql` | Protected annotated source identity | VERIFIED | Live local, remote, and GitHub identities agree. |
| `evidence/fastapi-phase-gate.txt` | Immutable FastAPI replay | VERIFIED | Substantive, redacted, checksum verified. |
| `evidence/django-source.txt` | Public source and ruleset identity | VERIFIED | Current live readback agrees with retained values. |
| `evidence/checksums.txt` | Eight-input manifest | VERIFIED | Sorted exact set; 8/8 verify. |

**Artifacts:** 20/20 verified at existence, substance, wiring, and data-flow levels.

## Key Link Verification

| From | To | Via | Status |
|------|----|-----|--------|
| Package approval | `pyproject.toml` | Exact approved pin | WIRED |
| `uv.lock` | `requirements.txt` | Runtime-only uv export | WIRED |
| Harness | Sealos PostgreSQL 17 | Exact run label, owned objects, supervised port-forward | WIRED |
| `taskboard/settings.py` | Django PostgreSQL backend | Strict explicit URL conversion | WIRED |
| `tasks/views.py` | `Task` model schema | `Task._meta.db_table` introspection | WIRED |
| Harness | `0001_initial.py` | Fresh and repeat exact migrate commands | WIRED |
| Production Job | Secret key `url` | `DATABASE_URL` `secretKeyRef` | WIRED |
| Harness | Source Job | Exact renderer, ConfigMap allowlist, two Complete waits | WIRED |
| Process A POST | Process B GET | Same migrated database and later title | WIRED |
| Job sequence 2 | `/health` 200 | Enforced phase-gate order | WIRED |
| README | Harness | Documented `--phase-gate` and read-only audit | WIRED |
| FastAPI protected tag | Complete FastAPI gate | Checksummed immutable run evidence | WIRED |
| Django Stage 2 peeled ref | Public main | Exact SHA and tag message | WIRED |
| Fresh public Django clone | Complete Django gate | Locked source plus retained public replay evidence | WIRED |

**Wiring:** 14/14 connections verified.

## Behavioral Verification

| Check | Result | Detail |
|-------|--------|--------|
| Public/readiness focused suite | PASS | 22/22 on independent real PostgreSQL run `b8fa47bead7c`; exact cleanup passed. |
| Manifest/harness focused suite | PASS | 19/19 on independent real PostgreSQL run `769419abbd29`; exact cleanup passed. |
| Test enumeration | PASS | 43 active cases collected; 0 skipped/xfail. |
| Public Django source replay | PASS | Fresh HTTPS clone: exact identities, 24/32, lock/export, migration hash, shell syntax, clean tree. |
| Public FastAPI source replay | PASS | Fresh HTTPS clone: exact immutable identity, lock/export, shell syntax, clean tree. |
| Complete runtime evidence | PASS | Five independent Django gates plus immutable FastAPI gate retained with checksums. |
| Read-only final audit | PASS | Five ownership categories report zero after both verifier test runs. |

The verifier did not repeat the multi-minute complete phase gate. It used the
checksum-verified independent full runs as the runtime oracle and independently
reran both focused real-PostgreSQL suites, both fresh public source clones, live
GitHub identity checks, and final cleanup. This avoids another external
lifecycle run while preserving behavioral evidence for every state transition.

## Test Quality Audit

| Test Area | Active | Skipped | Circular | Assertion Level | Verdict |
|-----------|-------:|--------:|----------|-----------------|---------|
| Public HTTP and readiness | 22 collected cases | 0 | 0 | Behavioral, exact status/payload/value | PASS |
| Migration and Job contracts | 4 functions plus live gate evidence | 0 | 0 | Behavioral and exact value | PASS |
| Harness safety and ordering | 17 functions | 0 | 0 | Source contract plus external end-to-end evidence | PASS |

- All nine Django test-to-feature pairs are directly adjacent. Every RED is
  test-only and every GREEN is implementation-only.
- The four Phase 25 RED causes are independently observable in their parents:
  static health 200, absent migrations mode, absent Job manifests, and absent
  phase-gate/restart mode.
- The only test-side file write creates a known-bad renderer input for rejection;
  it does not derive an expected value from the system under test.
- No internal collaborator mocks, disabled requirement tests, generated
  snapshots, or weak existence-only acceptance assertions were found.

## Requirements Coverage

| Requirement | Status | Evidence |
|-------------|--------|----------|
| TDD-02 | SATISFIED | Independent 22/22 public/readiness run plus checksum-verified restart/admin browser runs. |
| TDD-03 | SATISFIED | Fresh/repeat Django migration, two Jobs before readiness, immutable FastAPI migration gate, public read/write, and zero cleanup. |
| DJAN-02 | SATISFIED | psycopg 3, strict PostgreSQL settings, immutable migration, one-shot Job, persistent reads, protected Stage 2, and public replay. |

**Coverage:** 3/3 requirements satisfied; 0 orphaned requirements.

## Decision Coverage

All 9/9 trackable `25-CONTEXT.md` decisions are honored by shipped artifacts.
The GSD decision-coverage query returned no missing decisions.

## Anti-Patterns

No blocker or warning anti-patterns were found. The generic `XXX` debt-marker
scan matched only the required `mktemp` `XXXXXX` templates; these are secure
random-suffix formats, not debt markers. No TODO, FIXME, HACK, placeholder,
stub return, internal mock, or credential-bearing evidence was found.

## Human Verification

N/A - this is an infrastructure/backend phase whose public HTTP, browser,
database, GitHub, and cleanup acceptance criteria are all covered by executable
and retained programmatic evidence.

## Tooling Note

The generic-agent workaround used the complete installed `gsd-verifier`
instructions. GSD's artifact/key-link query currently treats quoted absolute
paths and Git refs in these plans as relative files, producing false
"not found" results. This report supersedes those parser results with direct
filesystem, Git, GitHub API, public clone, test, checksum, and live cleanup
checks.

## Gaps Summary

No gaps found. Phase 25 achieves its goal and is ready for Phase 26.

## Verification Metadata

**Verification approach:** Goal-backward, adversarial, independent of SUMMARY claims
**Must-haves source:** Four roadmap criteria plus 23 detailed PLAN truths, consolidated to 23 scored truths
**Automated checks:** 23 truths, 20 artifacts, 14 links, 43 collected tests, 41 independently rerun focused cases
**Human checks required:** 0
**Residual risk:** External full-gate replay was evidenced through recent immutable, checksum-verified runs rather than repeated during this verifier pass; focused real-database and live identity/cleanup checks found no drift.

---
*Verified: 2026-07-16T04:16:24Z*
*Verifier: generic-agent workaround with installed gsd-verifier instructions*
