---
phase: 26
slug: django-production-stage
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-07-16
---

# Phase 26 - Validation Strategy

## Validation Goal

Prove that protected Django Stage 2 evolves through two adjacent public TDD
pairs into a frozen 29-commit/38-file production release, that two exact-source
public images pass a real migration-first four-state Sealos run on one
PostgreSQL database, and that protected Stage 3 plus all retained evidence can
be reproduced from public inputs with zero temporary residue.

## Test Infrastructure

| Property | Value |
|----------|-------|
| Framework | pytest 9.1.1, pytest-django 4.12.0, real PostgreSQL wrapper |
| Existing config | `pyproject.toml`, `tests/conftest.py`, `scripts/test-postgres.sh` |
| Production additions | `tests/test_production.py`, extended Job/harness tests, `scripts/test-production.sh` |
| Quick image gate | `./scripts/test-postgres.sh --pytest-only tests/test_production.py -q -x` |
| Quick workload gate | `./scripts/test-postgres.sh --pytest-only tests/test_migration_job.py tests/test_postgres_harness.py tests/test_production.py -q -x` |
| Inherited full gate | `./scripts/test-postgres.sh --phase-gate` |
| Live production gate | `./scripts/test-production.sh --run ...` |
| Final audit | `./scripts/test-production.sh --assert-clean-all` |

All Django behavioral tests run through the owned PostgreSQL wrapper. Static
source tests may parse public files and launch bounded local subprocesses;
pytest never invokes GitHub, GHCR, kubectl, browser automation, or recursively
invokes the complete production harness.

## Requirements, Truths, Tasks, and Tests

| Requirement | Observable truth | Plan task | Test or evidence gate |
|-------------|------------------|-----------|-----------------------|
| DJAN-03 | Exact Django/Psycopg plus Gunicorn 26.0.0 and WhiteNoise 6.12.0 lock/export | 26-01 T1/T3 | `uv lock --check`; out-of-tree runtime export comparison; `tests/test_production.py` |
| DJAN-03 | Pinned multi-stage image collects manifest-hashed CSS at build time | 26-01 T2/T3 | Dockerfile public assertions; workflow build; image `staticfiles.json` and hashed CSS inspection |
| DJAN-03 | Production requires secret/localhost host, DEBUG false, WhiteNoise order, `/static/`, fixed root | 26-01 T2/T3 | settings import failure/success cases and real production HTTP/static smoke |
| DJAN-03 | Image runs UID/GID 10001 with one Gunicorn master and one sync worker on 8000 | 26-01 T2/T3, 26-03 T2 | bounded Gunicorn subprocess plus per-Pod process/UID/listener evidence |
| DJAN-03 | One worker startup record correlates source, expected image, Pod imageID, and OCI revision | 26-01 T2/T3, 26-03 T2 | subprocess log assertion and `evidence/logs.txt` at four states |
| DJAN-03 | Same candidate digest migration Job completes before each two-replica rollout | 26-02 T1/T2, 26-03 T2 | exact manifests/render tests; two `Complete=True` Job records before Ready Pods |
| DJAN-03 | Deployment satisfies readiness, rolling update, resources, restricted security, read-only root, bounded `/tmp` | 26-02 T1/T2, 26-03 T2 | public manifest assertions plus live Pod/Deployment checks |
| DJAN-03 | Image A -> Image B -> rollout undo A -> explicit recovery B preserves one Task | 26-03 T2 | rollback/controller evidence plus board and authenticated admin readback |
| DJAN-03 | Hashed CSS, `/health`, board, CSRF write, and admin remain usable in every state | 26-03 T2 | `collectstatic.txt`, `http.jsonl`, `runtime.txt`, and browser assertions |
| DJAN-03 | Nine live and ten final data files are semantic, credential-free, checksum-valid, and cleanup-complete | 26-03 T3, 26-04 T3 | evidence preflight/full verifiers, `shasum -a 256 -c`, sealed-mode check, read-only audit |
| DJAN-04 | Public main equals frozen Image B source with exact five-subject/29-commit/38-file inventory | 26-02 T3, 26-04 T1/T2 | Git/GitHub equality, history/file arithmetic, fresh Stage 3 clone |
| DJAN-04 | Stage 1, Stage 2, and Stage 3 are exact protected annotated refs | 26-04 T1 | direct object, peeled commit, message, type, remote equality, ruleset 19014157 |
| DJAN-04 | All three tags and both images replay from public HTTPS/anonymous GHCR | 26-04 T2 | three fresh clones and two separate empty-config `crane` replays |

## TDD Contract

### Pair 1 - Production Image

| Gate | Exact contract |
|------|----------------|
| RED subject | `test(26-01): specify Django production image contract` |
| RED scope | exactly `tests/test_production.py` |
| RED parent | protected Stage 2 `16279958ca774f7a34c25b0102a483df53160d6f` |
| RED signature | pytest status 1 after collection with `AssertionError: Dockerfile must exist` |
| GREEN subject | `feat(26-01): add hardened Django production image` |
| GREEN scope | exactly `.dockerignore`, `.github/workflows/publish-image.yml`, `Dockerfile`, `pyproject.toml`, `requirements.txt`, `taskboard/settings.py`, `taskboard/wsgi.py`, `uv.lock` |
| Adjacency | GREEN parent equals RED; GREEN changes zero tests |
| Image boundary | GREEN exact SHA is Image A source and is published before Pair 2 |

### Pair 2 - Production Workload

| Gate | Exact contract |
|------|----------------|
| RED subject | `test(26-02): specify Django production workload contract` |
| RED scope | exactly `tests/test_migration_job.py`, `tests/test_postgres_harness.py`, `tests/test_production.py` |
| RED parent | exact Image A GREEN |
| RED signature | pytest status 1 after collection with `AssertionError: deploy/application.yaml must exist` |
| GREEN subject | `feat(26-02): add Django production workload contracts` |
| GREEN scope | exactly `deploy/application.yaml`, `deploy/migration-job.yaml`, `scripts/test-production.sh` |
| Adjacency | GREEN parent equals RED; GREEN changes zero tests |
| Final source | README-only `docs(26-02): document immutable Django production release` is Image B source |

The final history adds exactly five source commits to the accepted Stage 2
count: `24 + 5 = 29`. Six new tracked files produce `32 + 6 = 38`. Any
execution-discovered behavior defect receives its own adjacent test-only RED
and implementation-only GREEN; the inventory formula and plans must then be
updated before public acceptance.

## Static and Real-Collaborator Boundary

| Static/public contract checks | Real collaborator checks |
|-------------------------------|--------------------------|
| Exact package/export text and lock contents | uv lock/export resolution |
| Dockerfile stages, digests, copies, user, command | GitHub Actions linux/amd64 build and image filesystem inspection |
| Workflow triggers, permissions, Action SHAs, tag grammar | GitHub run API/logs, public package, anonymous GHCR digest/config/manifest |
| Settings values, middleware order, static storage | Real Django/Gunicorn/WhiteNoise subprocess and PostgreSQL HTTP behavior |
| Exact Kubernetes templates and renderer source | Server dry-run, Jobs, Deployments, Pods, Service, port-forwards |
| Harness ordering, evidence schemas, cleanup source | Sealos four-state run, browser/admin, controller rollback, exact cleanup |
| Git subject/scope/adjacency assertions | Public main/tag/ruleset APIs and fresh HTTPS clone replays |

Mocks, skipped tests, weak existence-only acceptance, raw Secret reads, and
ambient registry credentials are outside the accepted proof.

## Per-Plan Gates

| Plan | Before mutation | Fast feedback | Full acceptance |
|------|-----------------|---------------|-----------------|
| 26-01 | clean protected Stage 2, lock/export, migration hash, exact pins, inherited gate, global audit | intended Pair 1 RED; focused production pytest | direct GREEN scope; full PostgreSQL gate; exact successful Image A workflow/package/anonymous OCI/static identity |
| 26-02 | public main/Image A exact; Stage 1/2/ruleset unchanged | intended Pair 2 RED; focused three-file pytest; `bash -n`; `--help` | direct GREEN scope; inherited full gate; README-only freeze; exact five subjects/29/38; distinct Image B workflow/OCI/static identity |
| 26-03 | source frozen at public FINAL_SHA; both images anonymous and exact; cluster permissions/quota; empty evidence and ownership | per-state Job/readiness/process/HTTP assertions | four ordered states, Task continuity, nine-file semantic scan/checksum, source freeze, exact cleanup, read-only audit |
| 26-04 | live checksums valid; Image B equals recovered state; main/Stage 1/2/ruleset exact | Stage 3 state validation; per-clone and per-image replay | three public clones, two anonymous image replays, ten-file preflight/checksum/full verifier, read-only seal, final audit |

## Supply Chain and Public Identity

- Packages: Django `5.2.16`, psycopg/psycopg-binary `3.3.4`, Gunicorn
  `26.0.0`, WhiteNoise `6.12.0`, Python `>=3.12,<3.13`.
- Base indexes: Python
  `sha256:d50fb7611f86d04a3b0471b46d7557818d88983fc3136726336b2a4c657aa30b`
  and uv
  `sha256:10902f58a1606787602f303954cea099626a4adb02acbac4c69920fe9d278f82`.
- Trusted Actions: checkout `9c091bb21b7c1c1d1991bb908d89e4e9dddfe3e0`,
  setup-uv `11f9893b081a58869d3b5fccaea48c9e9e46f990`, login
  `af1e73f918a031802d376d3c8bbc3fe56130a9b0`, buildx
  `bb05f3f5519dd87d3ba754cc423b652a5edd6d2c`, metadata
  `dc802804100637a589fabce1cb79ff13a1411302`, build-push
  `53b7df96c91f9c12dcc8a07bcb9ccacbed38856a`.
- Publisher emits only `sha-<40-character-TARGET_SHA>` and deploys only
  `ghcr.io/yangchuansheng/sealos-django-tutorial@sha256:<digest>`.
- Stage 1 direct/peeled/message:
  `0d9254d37914976898039ff3c55f94399aa1d7c0` /
  `ca115bf21b599c14e667b336bd78e3c587c24208` / `Django deploy stage`.
- Stage 2 direct/peeled/message:
  `16f60a44885216fa35d67b0334914d8b8d4e8577` /
  `16279958ca774f7a34c25b0102a483df53160d6f` /
  `Django PostgreSQL stage`.
- Stage 3 message: `Django production stage`; ruleset: `19014157`.

## Evidence and Cleanup Acceptance

Live data set: `workflow.txt`, `images.txt`, `collectstatic.txt`,
`migrations.txt`, `runtime.txt`, `logs.txt`, `http.jsonl`, `rollback.txt`, and
`cleanup.txt`; live checksum count is nine. Publication adds
`publication.txt`; final checksum count is ten. Preflight validates semantics
and redaction before atomic checksum generation. Full verification runs after
the completed manifest, then all eleven files become read-only.

The credential scan covers PostgreSQL URLs/userinfo, database assignments,
password and Secret values, cookies, CSRF values, GitHub/bearer/service-account
tokens, registry auth, kubeconfig/private keys, unresolved render tokens,
tracebacks, and exception dumps. Failures report filename and rule only.

Final cleanup reads exact labels and ownership ledgers for Deployment,
ReplicaSet, Pod, Service, Job, Secret, ConfigMap, port-forwards, Gunicorn and
harness processes, browser sessions, state/renders, clones, registry configs,
evidence scratch, and temporary directories. Durable public source/tags,
ruleset, public GHCR package, Image A, Image B, and sealed evidence remain.
Phase-owned temporary GHCR versions are deleted only by verified immutable ID;
an externally blocked deletion records the exact version ID and Phase 28
disposition in publication and cleanup evidence.

## Bash 3.2 and zsh Portability

- Production scripts use `#!/usr/bin/env bash`, `set -euo pipefail`, and no
  indexed or associative arrays, `mapfile`, `readarray`, `${var,,}`, GNU-only
  `stat`, or GNU-only `mktemp` flags.
- Temporary directories/files use templates such as
  `mktemp -d "${TMPDIR:-/tmp}/name.XXXXXX"` and
  `mktemp "$dir/.name.XXXXXX"`; state paths are mode 0700/0600.
- SHA-256 commands use macOS-available `shasum -a 256`; line counts normalize
  spaces with `tr -d ' '`.
- zsh-facing commands brace variables adjacent to punctuation and quote
  `refs/tags/stage-3-production^{}` arguments where expansion can occur.
- Loop variables never use `path` or `PATH`; public commands avoid zsh variable
  modifiers and always brace variables adjacent to `:` or other punctuation.
- `bash -n scripts/test-production.sh` and real `--help`, renderer, evidence,
  and cleanup modes are mandatory before publication.

## Manual Verification

No manual or human-only verification is required. Public HTTP, native Django
administration, browser interaction, Git/GitHub/GHCR identities, Sealos
runtime, evidence integrity, and cleanup all have executable programmatic
acceptance. Authentication failures become runtime gates for the existing
operator session and never weaken the criteria.

## Phase Verifier Checklist

- [ ] Both RED signatures were observed before implementation and both RED
      commits have exact test-only scopes.
- [ ] Both GREEN commits directly follow their RED and have exact
      implementation-only scopes.
- [ ] Image A is Pair 1 GREEN; Image B is README-only final source; both public
      workflows and anonymous digests are distinct and exact.
- [ ] Final source has the exact five new subjects, 29 commits, 38 files,
      migration hash `745bc45f...`, clean local tree, and public-main equality.
- [ ] Image A/B migration Jobs precede rollout, and all four states prove two
      Ready Pods, Gunicorn topology, logs, static assets, security, health,
      board/admin continuity, and one retained Task.
- [ ] Stage 1/2/3 direct objects, peeled commits, messages, and ruleset 19014157
      pass live readback; three fresh public clones reproduce their contracts.
- [ ] Separate anonymous configs replay Image A and Image B with linux/amd64,
      OCI source/revision, and collected-static identities.
- [ ] Nine live and ten final evidence checksums verify after credential scans;
      final eleven files are read-only.
- [ ] Final production `--assert-clean-all` is source-audited as read-only and
      live readback reports every run-owned category at zero.
- [ ] Target repository has zero source commit after Image B.

## Validation Sign-Off

- [x] Every task has an automated verification command.
- [x] Sampling continuity covers every plan task and external mutation boundary.
- [x] Wave 0 creates both required production test surfaces before GREEN work.
- [x] Static and real-collaborator responsibilities are explicit.
- [x] Human-only checks: 0.
- [x] `nyquist_compliant: true`.

**Approval:** pending independent plan checker and post-execution verifier
