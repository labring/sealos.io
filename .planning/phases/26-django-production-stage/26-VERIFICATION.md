---
phase: 26-django-production-stage
verified: 2026-07-16T15:15:18Z
status: passed
score: 21/21 must-haves verified
behavior_unverified: 0
overrides_applied: 0
decision_coverage: 12/12
requirements:
  - DJAN-03
  - DJAN-04
---

# Phase 26: Django Production Stage Verification Report

**Phase Goal:** Readers can reproduce and roll back the complete production
Django release from immutable public source and image references.
**Verified:** 2026-07-16T15:15:18Z
**Status:** passed
**Re-verification:** No - initial independent verification

## Goal Achievement

### Roadmap Success Criteria

| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| 1 | A reader can build and run the locked Django 5.2 LTS image as non-root through Gunicorn on port 8000 | VERIFIED | Exact lock/export, Dockerfile, public OCI config, and fresh PostgreSQL run `e6ba57489b35` agree on Django 5.2.16, Gunicorn 26.0.0, Python 3.12, UID/GID 10001, one sync worker, and port 8000. |
| 2 | WhiteNoise serves collected static output, readiness observes `/health`, and logs identify the image | VERIFIED | Independent anonymous exports contain `staticfiles.json` and the hashed Task CSS; the real Gunicorn test serves immutable CSS; sealed run `0f27d3ed8f1f` records four health/static/log states across eight Pods. |
| 3 | A previous immutable image restores the prior release while preserving PostgreSQL data | VERIFIED | Checksum-verified A-B-A-B evidence records two migration-first releases, `kubectl rollout undo`, explicit recovery, and one Task visible through board and native admin in all four states. |
| 4 | All three protected source stages resolve publicly and `main` matches production | VERIFIED | Live GitHub/Git reads confirm all direct objects, peeled commits, messages, ruleset `19014157`, and public main/Stage 3 equality; three fresh HTTPS clones reproduce 13/24, 24/32, and 29/38 boundaries. |

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | The exact Django/Psycopg graph gains Gunicorn 26.0.0 and WhiteNoise 6.12.0 on Python 3.12 | VERIFIED | `uv lock --check` and an out-of-tree runtime export byte comparison passed; public source and OCI inputs use the approved immutable indexes. |
| 2 | Production fails closed on secret/host inputs and runs collected static assets through one non-root Gunicorn worker | VERIFIED | Settings subprocess tests cover four invalid cases and exact valid values; Dockerfile and public config prove build-time collection, `10001:10001`, one sync worker, `/tmp`, and port 8000. |
| 3 | Every serving worker emits one credential-free source/image identity | VERIFIED | The real Gunicorn test observes exactly one record; `logs.txt` records two matching Pods in each of four states. |
| 4 | One validated full source SHA controls checkout, tests, OCI revision, sole full-SHA tag, and digest | VERIFIED | Workflow source inspection plus live runs `29477970332` and `29501299847` confirm matching API heads, logged targets, success, tags, and OCI revisions. |
| 5 | Pair 1 is an adjacent test-only RED and implementation-only GREEN | VERIFIED | `0927a971` changes only `tests/test_production.py`; `c9938489` is its direct child and changes exactly eight implementation files. Detached run `540c04fdabbc` fails only at `Dockerfile must exist` and cleans to zero. |
| 6 | One immutable candidate image and Secret feed migration before two-replica readiness | VERIFIED | Job and Deployment share exact image/Secret tokens; migrations evidence records both digests `Complete=True`, succeeded 1, failed 0, and `0001_initial` before readiness. |
| 7 | The workload enforces localhost readiness, one worker per Pod, restricted security, read-only root, and bounded `/tmp` | VERIFIED | Exact manifest tests and four-state runtime records cover every process, readiness, resources, seccomp, capability, identity, and filesystem field. |
| 8 | Image B is a distinct linux/amd64 release from the README-only final commit | VERIFIED | `8e372f93` changes only README, has distinct source/digest from Image A, and resolves anonymously with exact OCI revision and static filesystem. |
| 9 | Pair 2 is an adjacent three-test RED and three-implementation GREEN | VERIFIED | `c8cf6751` changes exactly three tests; `558f33fd` is its direct child and changes exactly three implementation files. Detached run `0f0fb915c144` fails only at `deploy/application.yaml must exist` and cleans to zero. |
| 10 | The frozen Image B tree has exactly five Phase 26 subjects, 29 commits, 38 files, and immutable migration 0001 | VERIFIED | Local and fresh public Stage 3 trees agree; migration SHA-256 is `745bc45f655bf0b164c1464c0c22786d22910e2aea235772e5dcea38495e4bf3`; Image B has zero later source commits. |
| 11 | Image A migration/deploy, Image B migration/deploy, undo to A, and recovery to B run in order on one database | VERIFIED | `migrations.txt`, `runtime.txt`, and `rollback.txt` encode the exact A-B-A-B sequence and controller revisions 1-4 for run `0f27d3ed8f1f`. |
| 12 | Every accepted state has two Ready Pods with exact image/source, process, log, identity, filesystem, and security facts | VERIFIED | Independent semantic parsing validates four runtime records, eight Pod image IDs, eight UID/GID observations, eight startup identities, and all hardened fields. |
| 13 | Health, board, hashed CSS, admin, localhost validation, and credential-free logs pass in every state | VERIFIED | Four JSON HTTP records and six static records contain exact status/body/content/cache/host results; the sealed evidence credential scan and independent 15-rule scan pass. |
| 14 | One Task survives final rollout, rollback, and recovery through board and authenticated admin | VERIFIED | Four HTTP and four rollback records retain Task ID 1 and title `Production continuity 0f27d3ed8f1f`; every admin readback is passed. |
| 15 | Live evidence is semantic, checksum-valid, source-frozen, and cleanup-complete | VERIFIED | The final package preserves all live records, semantic verifier success, valid checksums, exact source identities, and zero run-label inventory. |
| 16 | Public main equals protected annotated Stage 3 with exact production message | VERIFIED | Main and peeled Stage 3 are `8e372f93...`; direct object is `f5d48ccd...`; GitHub tag API returns `Django production stage`. |
| 17 | Stage 1, Stage 2, and ruleset `19014157` remain exact | VERIFIED | Live direct/peeled/message reads match all locked constants; ruleset is active with tag target, exact include, update/deletion rules, and empty exclude/bypass. |
| 18 | Separate anonymous configurations reproduce Image A and Image B | VERIFIED | Independent exports verify both exact digests, linux/amd64, OCI source/revision, `10001:10001`, `/app`, Gunicorn command, static manifest hashes, and hashed CSS. |
| 19 | Fresh public HTTPS clones reproduce all three source stages | VERIFIED | Three verifier-owned clones pass exact commit/count/file boundaries and lock/export; Stage 1 passes 5/5 tests and Stage 3 passes shell/help/static inventory checks. |
| 20 | Final evidence has ten curated data files, ten checksums, read-only modes, and zero residue | VERIFIED | `PUBLICATION_EVIDENCE_OK`, independent semantic parsing, credential scan, and `shasum` pass; all eleven files are regular mode 0400. |
| 21 | The package retains only the accepted Image A and Image B versions | VERIFIED | Live package API returns only version IDs `1035784039` and `1037249929`, each mapped to its exact digest and sole full-SHA tag. |

**Score:** 21/21 must-haves verified; 0 behavior-unverified.

## Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `pyproject.toml`, `uv.lock`, `requirements.txt` | Exact Python/Django/Psycopg/Gunicorn/WhiteNoise graph | VERIFIED | Lock and export reproduce exactly. |
| `taskboard/settings.py` | Fail-closed production settings and WhiteNoise storage | VERIFIED | Secret/host/debug/middleware/static/logging paths pass behavioral probes. |
| `taskboard/wsgi.py` | Per-worker immutable release identity | VERIFIED | Exact input validation and one-record Gunicorn behavior pass. |
| `Dockerfile`, `.dockerignore` | Pinned, allowlisted, collected-static non-root image | VERIFIED | Substantive source and anonymous image filesystem/config agree. |
| `.github/workflows/publish-image.yml` | Exact-source minimally permissioned publisher | VERIFIED | Pinned Actions, PostgreSQL tests, linux/amd64 build, immutable tag, and anonymous readback are wired and have two successful runs. |
| `deploy/application.yaml` | Two-replica hardened Deployment and Service | VERIFIED | Exact tested resource contains readiness, identity tuple, resources, security, and bounded tmpfs. |
| `deploy/migration-job.yaml` | Same-image production migration Job | VERIFIED | Exact tested one-shot Job shares image and Secret contracts with the Deployment. |
| `scripts/test-production.sh` | Registry, rollout, evidence, and read-only cleanup state machine | VERIFIED | 2,138 substantive lines; focused tests, evidence verifier, and live cleanup paths pass. |
| `tests/test_production.py` | Production image/settings/process/workload behavior | VERIFIED | Seven functions, nine parametrized cases, real Gunicorn/WhiteNoise, exact source assertions. |
| `tests/test_migration_job.py`, `tests/test_postgres_harness.py` | Job, ordering, evidence, and cleanup contracts | VERIFIED | 24 functions with exact-value/source assertions and real PostgreSQL wrapper coverage. |
| `README.md` | Immutable production reader workflow | VERIFIED | Clone, digest, Secret, render, migrate, readiness, runtime, rollback, evidence, and cleanup paths are complete. |
| Live evidence files | Migration, runtime, logs, HTTP/admin, static, rollback, cleanup | VERIFIED | Four-state records are substantive and coherently linked. |
| `publication.txt` | Main, tags, ruleset, package, clones, and images | VERIFIED | Semantic fields agree with independent live GitHub, Git, clone, and OCI reads. |
| `checksums.txt` | Sorted ten-entry integrity manifest | VERIFIED | Exact file set and 10/10 hashes pass. |
| Three annotated tag refs | Immutable public stage boundaries | VERIFIED | Direct objects, peeled commits, messages, and protection agree live. |
| Public GHCR package | Two durable anonymous image versions | VERIFIED | Public, repository-linked, and exact two-version inventory. |

**Artifacts:** 16/16 verified at existence, substance, wiring, and data-flow levels.

## Key Link Verification

| From | To | Via | Status |
|------|----|-----|--------|
| `uv.lock` | `requirements.txt` and Docker builder | Locked export and `uv sync --locked --no-dev` | WIRED |
| Source CSS | Image static manifest | Django `collectstatic` and compressed manifest storage | WIRED |
| Image static manifest | Public board CSS | WhiteNoise hashed URL, content, and immutable cache | WIRED |
| Full source SHA | Workflow and OCI | Target normalization, exact checkout, tag, labels, digest | WIRED |
| Runtime Secret | Job and Deployment | Exact `url` and `django-secret-key` keyRefs | WIRED |
| Candidate digest | Job and Deployment | One strict renderer value for both workloads | WIRED |
| Migration Job | Deployment readiness | Complete/current migration before rollout | WIRED |
| Deployment tuple | Pod/log identity | Image reference plus source release environment | WIRED |
| Image A/B | Four controller states | Apply A, apply B, rollout undo A, explicit apply B | WIRED |
| PostgreSQL Task | Board and native admin | Same Task ID/title across four states | WIRED |
| Runtime observations | Sealed evidence | Curated writers, semantic verifier, credential scanner, checksums | WIRED |
| Stage 3 peeled source | Public main and Image B | Exact SHA equality and OCI revision | WIRED |
| Public source tags | Fresh clones | HTTPS clone, lock/export, inventory, tests | WIRED |
| Package versions | Anonymous images | Full-SHA tags, exact digests, isolated configs | WIRED |
| Cleanup ledgers | Final global audit | Exact labels, processes, browsers, paths, and read-only checks | WIRED |

**Wiring:** 15/15 connections verified.

## Behavioral Verification

| Check | Result | Detail |
|-------|--------|--------|
| Fresh production/migration/harness suite | PASS | Verifier run `e6ba57489b35`: 34/34 on a new PostgreSQL service; cleanup inventory 0. |
| Pair 1 RED replay | PASS | Run `540c04fdabbc`: exit 1 at exact `Dockerfile must exist`; cleanup inventory 0. |
| Pair 2 RED replay | PASS | Run `0f0fb915c144`: exit 1 at exact `deploy/application.yaml must exist`; cleanup inventory 0. |
| Lock/export and shell gates | PASS | Lock check, out-of-tree byte comparison, Bash syntax, and CLI help pass. |
| Test enumeration | PASS | 58 active cases collected; zero skip, xfail, or mock seams. |
| Public source replay | PASS | Three fresh HTTPS clones reproduce stage identities and exact lock/export boundaries; Stage 1 passes 5/5. |
| Public image replay | PASS | Two fresh anonymous configs independently reproduce OCI and root-filesystem identities. |
| Publication evidence | PASS | Semantic verifier, independent cross-file parser, 15-rule credential scan, and 10/10 checksums pass. |
| Final cleanup | PASS | Run labels `0f27d3ed8f1f`, `e6ba57489b35`, `540c04fdabbc`, and `0f0fb915c144` are zero; global Django/FastAPI/production audits are zero. |

The verifier retained the checksum-sealed four-state Sealos run as the external
runtime oracle and independently repeated both historical REDs, the 34-case
fresh PostgreSQL GREEN seam, public Git/GitHub/package identities, three public
clones, two anonymous image exports, evidence semantics, and final cleanup.

## Test Quality Audit

| Test Area | Active | Skipped/Xfail | Internal Mocks | Assertion Level | Verdict |
|-----------|-------:|--------------:|---------------:|-----------------|---------|
| Production settings, process, static, publisher | 9 collected cases | 0 | 0 | Behavioral plus exact public source/value | PASS |
| Migration Job and production harness | 24 functions | 0 | 0 | Exact resources/order/safety plus live evidence | PASS |
| Inherited PostgreSQL/public behavior | 25 collected cases | 0 | 0 | Real database, HTTP, ORM, form, migration, admin | PASS |

- Both Phase 26 REDs are test-only, directly followed by implementation-only
  GREENs, and independently fail for the exact missing implementation.
- Source-contract assertions are backed by real Gunicorn, WhiteNoise,
  PostgreSQL, GitHub, GHCR, Kubernetes, HTTP, browser, and cleanup evidence.
- No disabled tests, internal collaborator mocks, generated snapshots, weak
  pass-only placeholders, circular expected-value generation, or post-GREEN
  test changes were found.

## Requirements Coverage

| Requirement | Status | Evidence |
|-------------|--------|----------|
| DJAN-03 | SATISFIED | Exact production graph, non-root Gunicorn/WhiteNoise image, collectstatic, readiness, logs, same-image migration, four-state rollback, public images, and zero cleanup. |
| DJAN-04 | SATISFIED | Public main, three protected annotated stages, active ruleset, fresh clone replays, and exact production tree. |

**Coverage:** 2/2 requirements satisfied; 0 orphaned requirements.

## Decision Coverage

All 12/12 trackable `26-CONTEXT.md` decisions are honored by shipped
artifacts. The GSD decision-coverage query returned no missing decisions.

## Anti-Patterns

No blocker or warning anti-patterns were found. Phase source contains no TODO,
FIXME, XXX, HACK, placeholder, stub implementation, skip, xfail, or internal
mock. Source and evidence scans found no credential material. The read-only
audit functions contain no delete, kill, close, unlink, or remove mutation.

## Human Verification

N/A - production behavior, public source/image identity, browser administration,
database continuity, evidence integrity, and cleanup are all covered by
executable programmatic evidence.

## Tooling Note

The generic-agent workaround used the complete installed `gsd-verifier`
instructions. GSD's artifact/key-link query treats absolute target-repository
paths and Git refs as relative files. Two plan `contains` examples also use
human-readable message/inventory spellings while the sealed schema stores
parseable per-field values. Direct filesystem, semantic, Git, GitHub, public
clone, OCI, test, checksum, and live cleanup checks supersede those parser
false negatives.

## Gaps Summary

No gaps found. Phase 26 achieves its goal and is ready for Phase 27.

## Verification Metadata

**Verification approach:** Goal-backward, adversarial, independent of SUMMARY claims
**Must-haves source:** Four roadmap criteria plus 21 detailed PLAN truths, consolidated to 21 scored truths
**Automated checks:** 21 truths, 16 artifact groups, 15 links, 58 collected tests, 36 independently rerun cases
**Human checks required:** 0
**Residual risk:** The multi-minute four-state Sealos lifecycle was validated from its recent immutable, checksum-sealed run instead of repeated during this verifier pass; independent fresh PostgreSQL, current public identity, anonymous image, evidence-semantic, and zero-residue checks found no drift.

---
*Verified: 2026-07-16T15:15:18Z*
*Verifier: generic-agent workaround with installed gsd-verifier instructions*
