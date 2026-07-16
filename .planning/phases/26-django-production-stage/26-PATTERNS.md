# Phase 26: Django Production Stage - Pattern Map

**Mapped:** 2026-07-16
**Implementation repository:** `/Users/longnv/bin/repo/sealos-django-tutorial`
**Orchestration repository:** `/Users/longnv/.codex/worktrees/19b8/sealos.io`
**Accepted source boundary:** protected `stage-2-postgresql` at
`16279958ca774f7a34c25b0102a483df53160d6f`
**Scope:** Django production dependencies, build-time static assets, immutable
images, migration-first Sealos rollout, rollback, public Stage 3 publication,
evidence, and cleanup

## Boundary Summary

Phase 26 evolves the exact protected Django Stage 2 tree into a production
release. The public Django repository owns source, tests, container files,
workloads, publisher, and immutable history. Sealos.io owns plans, dynamic
workflow/image/runtime evidence, summaries, and independent verification.

This split preserves a stable OCI revision. Image B is built from the final
reader-source commit, while its digest and later runtime facts are retained in
the Phase 26 planning directory. The protected Stage 1 and Stage 2 refs remain
byte-exact throughout the phase.

The closest whole-phase analog is Phase 23 FastAPI production. The closest
Django behavior and database analog is the current Stage 2 source plus Phase 25
verification. Phase 26 should copy the lifecycle and identity graph from
FastAPI while retaining Django's native settings, WSGI, templates, staticfiles,
CSRF, ORM, migrations, and administration behavior.

## Source and Evidence Map

### Reference Application Classification

| New/Modified File | Change | Role | Data Flow | Closest Analog | Match |
|---|---|---|---|---|---|
| `tests/test_production.py` | add, then extend | public/static production contract | source inspection, subprocess, build output | FastAPI `tests/test_production.py` | exact role |
| `pyproject.toml` | modify | locked runtime dependency declaration | dependency resolution | current Django `pyproject.toml` | exact evolution |
| `uv.lock` | modify | complete Python 3.12 lock | dependency resolution | current Django `uv.lock` | exact evolution |
| `requirements.txt` | modify | runtime-only compatibility export | transform | current Django export | exact evolution |
| `taskboard/settings.py` | modify | dual-mode Django settings | environment to framework configuration | current Stage 2 settings | exact extension point |
| `taskboard/wsgi.py` | modify | WSGI entrypoint and per-worker release identity | process startup to stdout | FastAPI lifespan release log | framework adaptation |
| `Dockerfile` | add | pinned multi-stage image with build-time static collection | source to OCI filesystem | FastAPI `Dockerfile` | strong role match |
| `.dockerignore` | add | allowlisted, credential-resistant build context | source filtering | FastAPI `.dockerignore` | exact role |
| `.github/workflows/publish-image.yml` | add | exact-source test/build/publish workflow | Git source to GHCR | FastAPI publisher | exact lifecycle |
| `tests/test_migration_job.py` | modify in second RED | exact production migration Job contract | public file validation | current exact-text Job test | exact evolution |
| `deploy/application.yaml` | add | two-replica Deployment and Service | immutable image to HTTP | FastAPI application manifest | strong role match |
| `deploy/migration-job.yaml` | modify | same-image Django migration Job | batch database migration | current Stage 2 Job | exact evolution |
| `scripts/test-production.sh` | add | publication, rollout, browser, evidence, cleanup harness | external state machine | FastAPI production harness plus Django Stage 2 harness | strong lifecycle match |
| `README.md` | modify last | immutable production reader workflow | documentation | current Stage 2 README | exact evolution |

The minimum implementation adds six tracked files:

1. `Dockerfile`
2. `.dockerignore`
3. `.github/workflows/publish-image.yml`
4. `tests/test_production.py`
5. `deploy/application.yaml`
6. `scripts/test-production.sh`

The minimum implementation modifies eight tracked files:

1. `pyproject.toml`
2. `uv.lock`
3. `requirements.txt`
4. `taskboard/settings.py`
5. `taskboard/wsgi.py`
6. `tests/test_migration_job.py`
7. `deploy/migration-job.yaml`
8. `README.md`

`scripts/test-postgres.sh` and `tests/test_postgres_harness.py` remain the
accepted Stage 2 lifecycle substrate. The production harness should call the
existing session modes and read-only audit. A verified incompatibility may
open a separate test-only RED and harness-only GREEN; the planned production
pairs should keep their scopes unchanged.

### Module Disposition

| Disposition | Modules |
|---|---|
| Reuse unchanged | Task model/form/views/routes/templates/source CSS/admin, migration `0001`, source migration Job, public/PostgreSQL/migration tests, PostgreSQL session harness |
| Extend in place | dependency graph, Django settings, WSGI entrypoint, production migration Job, exact Job test, README |
| Add | production test, Dockerfile, build-context filter, publisher workflow, application workload, production harness |
| Replace at the reader workflow boundary | Stage 2 `runserver` production instructions become Gunicorn/digest deployment instructions in the final README; historical Stage 1/2 source remains protected |

No application module is removed. The final tree remains a strict descendant
of Stage 2 with the same model, routes, public response bodies, and migration.

### Retained Source Without Behavior Changes

| File/Module | Retained Contract | Evidence Source |
|---|---|---|
| `tasks/migrations/0001_initial.py` | immutable `Task(id, title, completed)` schema | Phase 25 migration SHA and replay |
| `tasks/models.py` | one ordered Task model | public ORM tests |
| `tasks/forms.py` | framework-native ModelForm validation | public invalid/create tests |
| `tasks/views.py` | exact board/create behavior and exact 503/200 `/health` bodies | Stage 2 lines 17-57 and 22/22 verifier run |
| `tasks/templates/tasks/board.html` | public CSRF form and `{% static %}` asset lookup | Stage 2 lines 1-50 |
| `tasks/static/tasks/styles.css` | source stylesheet collected and hashed at build | existing public asset |
| `tasks/admin.py` | native Task registration | Phase 25 authenticated readback |
| `tasks/urls.py`, `taskboard/urls.py` | board, task POST, health, and admin routes | five public behavior tests |
| `deploy/source-migration-job.yaml` | immutable historical Stage 2 adapter | Phase 25 two-Job replay |
| `tests/test_public_http.py` | five retained public behaviors | Phase 25 verification |
| `tests/test_postgresql.py` | strict URL parser and schema-aware readiness | Phase 25 verification |
| `tests/test_migrations.py` | immutable fresh/repeat migration and drift gate | Phase 25 verification |
| `tests/conftest.py` | one owned server with distinct runtime/test databases | Phase 25 verification |

### Planning and Evidence Classification

| File | Change | Role |
|---|---|---|
| `26-CONTEXT.md` | existing | locked decisions and scope fence |
| `26-RESEARCH.md` | separate research output | current package, image, Action, and platform identities |
| `26-PATTERNS.md` | add | source, test, lifecycle, and evidence map |
| `26-0X-PLAN.md` | planning output | executable cross-repository plans |
| `26-0X-SUMMARY.md` | execution output | commits, workflows, images, runtime results, deviations |
| `evidence/workflow.txt` | add after publication | Image A/B workflow head, target, conclusion, URL, digest |
| `evidence/images.txt` | add after publication | tags, digests, architecture, OCI source/revision, package |
| `evidence/collectstatic.txt` | add after image/runtime checks | manifest, hashed CSS, image path, HTTP cache contract |
| `evidence/migrations.txt` | add after live gate | Image A/B Jobs, `Complete=True`, `[X] 0001_initial` |
| `evidence/runtime.txt` | add after live gate | controller revision, Pods, image IDs, UID/GID, process and filesystem checks |
| `evidence/logs.txt` | add after live gate | one worker startup identity per Pod and state |
| `evidence/http.jsonl` | add after live/browser gate | health, board, static asset, CSRF write, admin readback |
| `evidence/rollback.txt` | add after live gate | Image A/B/undo/recovery source-image tuples |
| `evidence/publication.txt` | add after Stage 3 | public main, three source refs, ruleset, package, clone replay |
| `evidence/cleanup.txt` | finalize last among data files | exact-label and ownership-ledger zero inventory |
| `evidence/checksums.txt` | generate atomically last | sorted SHA-256 manifest over reviewed data files |
| `26-VERIFICATION.md` | add after execution | independent DJAN-03/DJAN-04 verification |

The live package contains nine data files plus `checksums.txt`; publication
adds `publication.txt`, producing ten data files plus `checksums.txt`. The
checksum manifest therefore contains nine entries for live acceptance and ten
entries for final publication acceptance.

## Concrete Pattern Assignments

### Production Dependency and Settings Seam

**Primary source:** Django Stage 2 `pyproject.toml` lines 1-20 and
`taskboard/settings.py` lines 13-190.

Preserve the existing exact Django and psycopg requirements. Research supplies
current compatible patch pins for Gunicorn and WhiteNoise immediately before
implementation. All four runtime dependencies belong in `[project].dependencies`;
the dev group stays pytest-only. Every gate runs:

```text
uv lock --check
uv export --locked --no-dev --no-emit-project --no-hashes \
  --format requirements.txt --output-file requirements.txt
git diff --exit-code -- requirements.txt
```

Extend `taskboard/settings.py` in place:

- retain `database_config()` and `DATABASE_CONFIGURED` exactly;
- add `BASE_DIR` from `pathlib.Path` for a fixed image-local static root;
- add an explicit production mode consumed by the image workload;
- require `DJANGO_SECRET_KEY` and an explicit allowed-host value in production;
- set `DEBUG=False` in production while retaining a local test/development path;
- insert `whitenoise.middleware.WhiteNoiseMiddleware` directly after
  `django.middleware.security.SecurityMiddleware`;
- set `STATIC_URL = '/static/'`;
- set `STATIC_ROOT` to a stable path under `/app`;
- configure `whitenoise.storage.CompressedManifestStaticFilesStorage` through
  Django's `STORAGES` setting;
- send application logs to stdout/stderr with stable, credential-free text.

The production Deployment should supply one exact allowed host, `localhost`.
Its readiness probe should send `Host: localhost`, and the production harness
should use the same Host header for port-forwarded HTTP and browser acceptance.
This keeps host validation explicit and deterministic.

### Per-Worker Startup Identity

**Django extension point:** `taskboard/wsgi.py` lines 10-16.

**Behavior analog:** FastAPI `app/main.py` lines 35-48 and
`tests/test_production.py` lines 343-424.

Emit one stable record when each Gunicorn worker imports the WSGI module:

```text
event=service_start source_release=<40-hex> image_reference=<name@sha256:digest>
```

Use the Gunicorn error logger or a Django logger wired to stdout. Keep
`--preload` absent so the master does not emit the worker record. One sync
worker per Pod then produces exactly one record per Pod. A real subprocess test
should start Gunicorn with production environment values, wait for the listener,
terminate it, and assert one record. Runtime acceptance correlates this record
with Deployment image, Pod image ID, `SOURCE_RELEASE`, and `IMAGE_REFERENCE`.

`TasksConfig.ready()` is a weaker fit because management commands also initialize
the app registry. The WSGI module gives the required per-serving-worker seam.

### Build-Time `collectstatic`, WhiteNoise, and Gunicorn

**Image analog:** FastAPI `Dockerfile` lines 1-52.

Use a pinned official Python 3.12 slim-bookworm builder and runtime, plus the
pinned uv image selected by research. Preserve these structural rules:

1. Copy `/uv` and `/uvx` from the pinned uv image.
2. Resolve the committed lock with `uv sync --locked --no-dev`.
3. Copy only `manage.py`, `taskboard/`, and `tasks/` into the builder.
4. Run `python manage.py collectstatic --noinput` in the builder with an inline
   build-only secret and the exact production static settings.
5. Copy only `.venv`, application source, and collected static output into the
   runtime image.
6. Create fixed user/group `10001:10001` and switch to it before the command.
7. Bake `SOURCE_RELEASE` from the exact source SHA.
8. Expose port 8000.
9. Exec Gunicorn against `taskboard.wsgi:application`, bind
   `0.0.0.0:8000`, select one sync worker, send access/error logs to stdout and
   stderr, and use `/tmp` for worker temporary files.

The image build fails when lock resolution, settings import, static collection,
or compressed-manifest generation fails. The runtime command performs zero
dependency installation, migrations, or static collection. Runtime Pods mount
only bounded Memory-backed `/tmp`; static output stays read-only inside the
image.

The static acceptance seam has four layers:

1. Build log records successful `collectstatic`.
2. Image inspection finds `staticfiles.json` and a hashed
   `tasks/styles.<hash>.css` file.
3. Rendered Task Board HTML contains that hashed URL.
4. Public HTTP returns CSS content with WhiteNoise immutable cache headers.

### Build Context and Image Provenance

**Context analog:** FastAPI `.dockerignore` lines 1-15 and Dockerfile
allowlisted `COPY` statements at lines 18-46.

Exclude VCS data, workflows, virtual environments, caches, bytecode, tests,
deployment files, evidence, scripts, README, local state, logs, and common
secret-bearing environment files. Use explicit `COPY` statements throughout
the Dockerfile.

The OCI image identity graph is:

```text
source commit
  -> workflow TARGET_SHA
  -> checkout HEAD
  -> SOURCE_DATE_EPOCH
  -> SOURCE_RELEASE build argument
  -> sha-<40-character-TARGET_SHA> lookup tag
  -> OCI source/revision labels
  -> public registry digest
  -> Deployment/Job name@sha256 reference
  -> Pod imageID and startup identity record
```

### GitHub Actions Publisher

**Analog:** FastAPI `.github/workflows/publish-image.yml` lines 1-339 and
`tests/test_production.py` lines 286-340.

Adapt the verified publisher shape to
`yangchuansheng/sealos-django-tutorial`:

- normalize push SHA or validated dispatch `source_sha` into one lowercase
  40-character `TARGET_SHA`;
- pin every trusted Action by a full commit SHA selected by research;
- grant only `contents: read` and `packages: write`;
- checkout and verify exact `TARGET_SHA` in test and publish jobs;
- start pinned PostgreSQL 17 and use distinct `tasks` and
  `test_<12-hex-run-id>` databases;
- run lock/export, migrations twice, `[X] 0001_initial`, zero drift, and all
  Django tests before publishing;
- build linux/amd64 with build-time `collectstatic` and exact OCI metadata;
- publish exactly `sha-<40-character-TARGET_SHA>`;
- expose and record the public registry digest;
- accept an existing tag only when digest/config/manifest and OCI identity are
  exact;
- perform anonymous readback from a fresh empty mode-0700 registry config;
- emit no branch, `main`, `latest`, stage, date, or short-SHA image tag.

Research owns the current official image digests, package pins, and Action
SHAs. Plans should copy the resolved values from `26-RESEARCH.md` rather than
reuse Phase 23 values by assumption.

### Public/Static Test Style

**Django analogs:** `tests/test_migration_job.py` lines 1-190 and
`tests/test_postgres_harness.py` lines 31-383.

**Production analog:** FastAPI `tests/test_production.py` lines 248-548.

Use `pathlib`, exact public-file assertions, exact test messages, real Django
startup behavior, and real subprocesses where process behavior matters. Keep
kubectl, GHCR, GitHub, and recursive production-harness execution outside
pytest. The first missing-artifact assertion supplies a deterministic RED
signature.

The test file should cover:

- exact Gunicorn/WhiteNoise pins in lock and runtime export;
- production settings import and fail-closed missing-secret/host behavior;
- middleware order, absolute static URL/root, and manifest storage;
- Dockerfile pins, allowlisted copies, build-time `collectstatic`, numeric user,
  and one-worker Gunicorn command;
- `.dockerignore` exclusions;
- exact-source publisher identity and immutable tag set;
- real Gunicorn startup identity record;
- collected hashed CSS and WhiteNoise public response/cache behavior;
- exact application manifest, migration Job, renderer, state sequence,
  evidence file set, checksum policy, and cleanup branches.

## TDD Commit Boundaries

### Pair 1: Production Dependency, Settings, Image, Static Assets, and Publisher

**RED subject:**

```text
test(26-01): specify Django production image contract
```

**RED scope:** exactly `tests/test_production.py`.

The focused RED should collect successfully, pass inherited setup, and fail at
the exact first absent artifact message:

```text
AssertionError: Dockerfile must exist
```

**GREEN subject:**

```text
feat(26-01): add hardened Django production image
```

**GREEN scope:** exactly:

```text
.dockerignore
.github/workflows/publish-image.yml
Dockerfile
pyproject.toml
requirements.txt
taskboard/settings.py
taskboard/wsgi.py
uv.lock
```

The GREEN is the direct child of RED and changes zero test files. It must pass
the focused production test, all inherited real-PostgreSQL behavior, exact
lock/export, a local image build, image-local collected-asset inspection, and a
Gunicorn/WhiteNoise smoke test. This GREEN source becomes Image A.

### Pair 2: Workloads, Same-Image Migration, Harness, and Evidence Semantics

**RED subject:**

```text
test(26-02): specify Django production workload contract
```

**RED scope:** exactly:

```text
tests/test_migration_job.py
tests/test_production.py
```

The focused RED should fail at the first absent application artifact:

```text
AssertionError: deploy/application.yaml must exist
```

**GREEN subject:**

```text
feat(26-02): add Django production workload contracts
```

**GREEN scope:** exactly:

```text
deploy/application.yaml
deploy/migration-job.yaml
scripts/test-production.sh
```

The GREEN is the direct child of RED and changes zero test files. Static tests
cover the source contract; the production harness owns real PostgreSQL,
Kubernetes, Gunicorn, WhiteNoise, HTTP, browser, GitHub, GHCR, and cleanup
acceptance.

Any newly discovered defect should follow its own adjacent test-only RED and
implementation-only GREEN. The two planned pairs retain exact ancestry and
scope for independent history verification.

## Kubernetes Workload Patterns

### Deployment and Service

**Analog:** FastAPI `deploy/application.yaml` lines 54-180 and production
harness lines 587-707.

Use a small token vocabulary:

```text
__RUN_ID__
__APP_NAME__
__IMAGE_REFERENCE__
__SOURCE_RELEASE__
__SECRET_NAME__
```

The rendered Deployment contract includes:

- exact run label on Deployment, Pod template, and Service;
- two replicas, revision history 3, progress deadline 180;
- RollingUpdate `maxUnavailable: 0`, `maxSurge: 1`;
- digest-only application image;
- `DATABASE_URL` from Secret key `url`;
- `DJANGO_SECRET_KEY` from Secret key `django-secret-key`;
- exact production mode and allowed-host environment;
- atomic `SOURCE_RELEASE` plus `IMAGE_REFERENCE` tuple;
- explicit one-worker sync Gunicorn command on port 8000;
- readiness `GET /health` on named port `http` with `Host: localhost`;
- requests `cpu: 100m, memory: 128Mi` and limits
  `cpu: 500m, memory: 512Mi`, subject to live research confirmation;
- UID/GID 10001, `runAsNonRoot`, `RuntimeDefault`, disabled service-account
  token and privilege escalation, all capabilities dropped, read-only root;
- Memory-backed `/tmp` with `sizeLimit: 64Mi`;
- ClusterIP Service port 8000 to named target `http`.

The Deployment has no writable static volume. WhiteNoise reads the collected
asset tree baked into the image.

### Secret Boundary

The Stage 2 session creates a run-owned Secret with database key `url` in
`scripts/test-postgres.sh` lines 385-406. The production harness should add one
generated `django-secret-key` value to that exact Secret through a bounded,
non-printing operation after session start. The committed workloads reference
only key names. Temporary state and evidence contain no Secret value.

Static tests assert both exact refs. Live acceptance reads workload metadata and
key names without reading Secret data.

### Production Migration Job

**Existing Django source:** `deploy/migration-job.yaml` lines 1-64.

**Lifecycle analog:** FastAPI production harness lines 488-512.

Evolve the current Job in place. Preserve:

- `batch/v1`, `backoffLimit: 1`, deadline 300, `restartPolicy: Never`;
- exact tokens `__JOB_NAME__`, `__RUN_ID__`, `__IMAGE_REFERENCE__`, and
  `__SECRET_NAME__`;
- working directory `/app`;
- `python manage.py migrate --noinput`;
- `DATABASE_URL` from Secret key `url`;
- the complete numeric non-root, read-only-root, dropped-capability,
  RuntimeDefault, resources, and bounded `/tmp` contract.

Add the production secret and host environment required for settings import.
Every candidate runs this Job from the same immutable digest and Secret later
used by its Deployment. Acceptance requires `Complete=True`, succeeded once,
zero failed count, exact Job image, credential-free logs, and independent
`showmigrations tasks` output containing `[X] 0001_initial` before rollout.

Keep `deploy/source-migration-job.yaml` byte-exact as the protected Stage 2
historical adapter.

## Production Harness Composition

**Database substrate:** Django `scripts/test-postgres.sh` lines 177-253,
601-819, 1217-1313, and 1708-1741.

**Production state-machine analog:** FastAPI `scripts/test-production.sh` lines
1-220, 358-947, and 1424-1590.

`scripts/test-production.sh` should expose:

```text
--run
--preflight-evidence publication
--verify-evidence live
--verify-evidence publication
--help
```

`--run` requires Image A/Image B digest refs, both 40-character sources, and an
empty evidence directory. Install one EXIT trap before the first mutation.

Reuse `test-postgres.sh --session-start --state-file`, then validate the
mode-0600 state and one run ID. The production harness extends that ownership
with application names, two migration Job names, Secret augmentation,
Deployment, ReplicaSets, Pods, Service, application port-forward, browser
sessions, render files, anonymous registry configs, clones, and evidence
scratch paths. Cleanup calls the existing exact session stop/assert-clean modes
after deleting application objects and ends with `--assert-clean-all`.

Rendering follows the FastAPI analog at lines 383-439:

- exact token set equality;
- newline-free nonempty values;
- digest and 40-hex validation before rendering;
- mode-0600 temporary outputs;
- unresolved-token rejection;
- strict server-side dry-run before live apply.

Refresh the Service port-forward after every rollout. Phase 23 proved that a
long-lived Service forward can terminate when its selected Pod is replaced.

## Image A and Image B Provenance

Image A and Image B come from distinct source commits while sharing migration
`tasks.0001_initial` and the same PostgreSQL database contract.

### Image A

- source: `feat(26-01): add hardened Django production image`;
- parent: Pair 1 test-only RED;
- contents: dependencies, settings, WSGI startup identity, Dockerfile,
  `.dockerignore`, publisher;
- purpose: first complete Gunicorn/WhiteNoise rollback target;
- publication: public main fast-forward, exact-source successful workflow,
  full-SHA lookup tag, anonymous immutable digest readback.

### Image B

- source: `docs(26-02): document immutable Django production release`;
- parent chain: Pair 2 GREEN followed by one README-only commit;
- contents: Image A plus application manifest, evolved migration Job,
  production harness, and final reader documentation;
- purpose: final Stage 3 runtime and recovery target;
- publication: public main fast-forward, distinct exact-source workflow and
  digest, then source freeze for the rest of Phase 26.

Before both builds and after both publications, assert the SHA-256 of
`tasks/migrations/0001_initial.py` equals the accepted Phase 25 value
`745bc45f655bf0b164c1464c0c22786d22910e2aea235772e5dcea38495e4bf3`.

## Four-State Rollout, Rollback, and Recovery

Run one dedicated PostgreSQL 17 service under one exact run ID. The accepted
sequence is fixed:

| Sequence | State | Required Transition | Migration | Data Witness |
|---:|---|---|---|---|
| 1 | `baseline` | Image A Job, then Image A Deployment | `0001`, Complete | create one Task via public CSRF form |
| 2 | `final` | Image B Job, then atomic Image B/source tuple apply | `0001`, Complete/current | board and authenticated admin read same Task |
| 3 | `baseline-rollback` | `kubectl rollout undo` to Image A tuple | unchanged `0001` | board and authenticated admin read same Task |
| 4 | `final-recovered` | explicit Image B/source tuple apply | unchanged `0001` | board and authenticated admin read same Task |

At each state require:

- Deployment Available and 2/2 Ready;
- one active ReplicaSet at the recorded controller revision;
- two Pods with the expected digest and image ID;
- UID/GID 10001;
- one Gunicorn master and one sync WSGI worker per Pod;
- listener on `0.0.0.0:8000`;
- read-only root and successful bounded `/tmp` write/remove;
- effective service-account, seccomp, privilege, and capability policy;
- one matching startup identity record per Pod;
- `/health` 200 with exact body;
- Task Board 200 and hashed CSS 200 with immutable cache policy;
- administration login surface 200;
- retained Task through board and authenticated native administration.

Refresh port-forward and browser state around each rollout so acceptance
follows current Pods and current local endpoint identity.

## Public Tags, Replay, and Publication State

Preserve these constants before and after every source/tag mutation:

| Stage | Direct object | Peeled commit | Message |
|---|---|---|---|
| Stage 1 | `0d9254d37914976898039ff3c55f94399aa1d7c0` | `ca115bf21b599c14e667b336bd78e3c587c24208` | `Django deploy stage` |
| Stage 2 | `16f60a44885216fa35d67b0334914d8b8d4e8577` | `16279958ca774f7a34c25b0102a483df53160d6f` | `Django PostgreSQL stage` |

Ruleset `19014157` remains active for `refs/tags/stage-*` with update and
deletion protection, empty exclude, and empty bypass sets.

Publish annotated `stage-3-production` with message `Django production stage`
only after the live four-state gate passes and public main equals Image B
source. Use the four coherent tag recovery states from Phase 23: absent/absent,
exact-local/absent-remote, absent-local/exact-remote, or exact/exact. Use normal
fast-forward branch and single-ref tag pushes.

Fresh public HTTPS clones independently verify:

- Stage 1 exact peeled source, lock/export, and public suite;
- Stage 2 exact peeled source, lock/export, migration hash, and real
  PostgreSQL gate;
- Stage 3 exact peeled source, 29-subject/38-file inventory, lock/export,
  production static tests, shell syntax/help, fresh real PostgreSQL gate,
  collectstatic/image identity, and clean tree.

Derive the final GHCR lookup tag from the Stage 3 peeled commit and replay
digest, config, and manifest through a new empty mode-0700 anonymous registry
configuration. Replay Image A separately with another empty configuration.

## Evidence, Checksums, and Cleanup

Follow the Phase 23 semantic-evidence pattern at production harness lines
948-1481. Curate stable fields and retain no raw namespace logs, credentials,
cookies, CSRF values, Secret data, registry auth, or kubeconfig content.

The live semantic verifier requires exactly these nine data files:

```text
workflow.txt
images.txt
collectstatic.txt
migrations.txt
runtime.txt
logs.txt
http.jsonl
rollback.txt
cleanup.txt
```

Its checksum manifest contains exactly nine sorted repository-relative entries.
Final publication adds `publication.txt`, and the final checksum manifest
contains exactly ten sorted repository-relative entries.

The publication preflight validates the ten data-file set, field schemas,
state order, source/image relationships, tag/ruleset/package identities,
credential scan, and cleanup while treating checksum bytes as pending. Generate
`checksums.txt` atomically after preflight, run full publication verification,
then make all eleven evidence files read-only. Later checks only read and parse
the sealed package.

Cleanup covers:

- PostgreSQL Deployment, Pod, Service, and Secret;
- application Deployment, ReplicaSets, Pods, Service, and Secret augmentation;
- both migration Jobs and any ConfigMap;
- application and database port-forwards;
- Gunicorn and harness processes;
- every named browser session;
- mode-0600 state and render files;
- public replay clones and scratch evidence;
- every anonymous registry config;
- exact package-version cleanup attempted only by recorded immutable ID.

Finish with the existing read-only `test-postgres.sh --assert-clean-all` plus an
exact-label seven-kind application inventory and ownership-ledger audit. Public
source, all three protected tags, ruleset, public package, and the two accepted
image versions remain durable artifacts.

## Recommended Plan and Wave Boundaries

### Plan 26-01 / Wave 1: Image A

**Goal:** Produce and accept the first production-capable Django image.

1. Run Stage 2 lock/export, migration hash, full real PostgreSQL gate, and
   read-only cleanup preflight.
2. Commit Pair 1 test-only RED.
3. Commit Pair 1 implementation-only GREEN.
4. Prove lock/export, all inherited tests, real PostgreSQL, local image build,
   build-time collectstatic, hashed CSS, WhiteNoise, Gunicorn topology, startup
   identity, and clean tree.
5. Fast-forward public main and accept the successful exact-source workflow,
   public package, full-SHA tag, anonymous digest/config/manifest, linux/amd64,
   and OCI source/revision.
6. Record Image A source/digest/workflow in `26-01-SUMMARY.md`.

**Plan acceptance:** direct RED/GREEN ancestry and scopes; Image A is public,
immutable, production-capable, distinct from Stage 2 source, and leaves zero
temporary footprint.

### Plan 26-02 / Wave 2: Workloads, Harness, and Image B

**Goal:** Freeze the complete reader source and accept the final image.

1. Commit Pair 2 test-only RED.
2. Commit Pair 2 implementation-only GREEN.
3. Run static manifests, strict rendering/server dry-runs, shell syntax/help,
   inherited PostgreSQL gate, and production fixture semantics.
4. Update README in one commit with immutable image lookup, same-image Job,
   migration-before-readiness, Gunicorn/WhiteNoise/static verification,
   two replicas, rollback, recovery, stages, and cleanup.
5. Freeze that README commit as Image B source and prohibit later Reference
   Application writes.
6. Fast-forward public main and accept a distinct exact-source workflow and
   anonymous immutable digest.
7. Record the machine-readable Image A/Image B source/digest input block in
   `26-02-SUMMARY.md`.

**Plan acceptance:** direct second RED/GREEN pair, README-only final source,
two distinct public digests, same migration hash, and a frozen clean tree.

### Plan 26-03 / Wave 3: Real Four-State Sealos Gate

**Goal:** Prove migration-first production behavior, rollback, recovery, and
data continuity on one PostgreSQL database.

1. Re-read both public workflow/image/source identities anonymously before
   namespace mutation.
2. Run the fixed four-state sequence.
3. Capture the nine live data files and nine-entry checksum manifest.
4. Run semantic, credential, checksum, source-freeze, and exact cleanup audits.
5. Commit only Phase 26 evidence and `26-03-SUMMARY.md` in Sealos.io.

**Plan acceptance:** all four states pass two-Pod identity, Gunicorn,
WhiteNoise/static, readiness, board/admin continuity, rollback/recovery,
checksums, and zero-footprint checks.

### Plan 26-04 / Wave 4: Protected Stage 3 and Public Replay

**Goal:** Publish and independently reproduce the complete source/image release.

1. Verify public main, Image B, Stage 1/2 constants, and ruleset before tag
   mutation.
2. Recover/publish annotated Stage 3 through one coherent state.
3. Replay all three stages from fresh public clones and both images through
   isolated anonymous registry configs.
4. Add `publication.txt`, run checksum-independent ten-file preflight, replace
   checksums atomically with ten entries, and run full verification once.
5. Seal evidence read-only and perform final public identity plus zero-residue
   readback.
6. Commit publication artifacts and `26-04-SUMMARY.md` in Sealos.io.

**Plan acceptance:** public main equals Stage 3 peeled source; all three tag
identities and ruleset are exact; Stage 3 and both images replay publicly; all
ten checksums pass; temporary inventory is zero.

The four plans are sequential. Each consumes identities or sealed evidence from
the prior plan, so parallel execution would weaken the fail-closed state graph.

## Anti-Patterns and Risk Controls

| Anti-pattern | Failure Mode | Required Pattern |
|---|---|---|
| Floating Gunicorn/WhiteNoise/base/Action version | source rebuild changes over time | lock package patches and pin images/Actions by immutable identity |
| `COPY . .` | tests, VCS data, local state, and secrets enter image | explicit build/runtime copy allowlists plus `.dockerignore` |
| Runtime dependency install or `collectstatic` | readiness depends on network and writable filesystem | resolve and collect during image build |
| Writable static volume | image and served asset provenance diverge | baked collected output served read-only by WhiteNoise |
| Development secret or wildcard host in production | production security contract becomes ambiguous | runtime Secret and exact allowed Host |
| `runserver` in the production image | process and signal behavior differ from release contract | one Gunicorn master plus one sync worker per Pod |
| Gunicorn `--preload` with WSGI import logging | startup record comes from master | worker imports WSGI and emits one record per worker |
| Multiple workers per Pod | worker topology and evidence multiply | one sync worker per Pod, two Kubernetes replicas |
| Migration in container startup | replicas race schema changes | same-digest one-shot Job reaches Complete first |
| Application rollout before Job completion | `/health` returns 503 during rollout | migration Job, `[X] 0001_initial`, then Deployment |
| Mutable image reference | rollback source cannot be reproduced | full-SHA lookup tag and digest-only deployment |
| Image A derived from Stage 2 image | rollback target lacks Gunicorn/WhiteNoise | Image A is the first production GREEN child of Stage 2 |
| Image A and B share one source commit | source-to-image provenance collapses | publish each from its own exact commit |
| Readiness without Host header | strict Django host validation rejects probes | deterministic `Host: localhost` header |
| Long-lived Service port-forward across rollout | selected Pod deletion terminates acceptance path | recreate the owned forward after each rollout |
| Raw logs or browser storage retained | credentials, cookies, or CSRF data leak | curate stable fields, scan, then checksum |
| Checksums generated before publication fields | later appends invalidate integrity | semantic preflight, atomic final manifest, one full verifier |
| Evidence mutation after final verification | retained proof loses integrity | seal all evidence files read-only |
| Broad namespace deletion | unrelated resources can be removed | one exact run label, prefix assertion, named process/path ownership |
| Source writes after Image B | OCI revision and final source diverge | freeze Image B source and store dynamic facts only in Sealos.io |
| Moving Stage 1/2 refs | earlier tutorials lose reproducibility | verify direct/peeled/message/ruleset before and after Stage 3 |

Primary risks are current package/image/Action drift, GitHub workflow recovery,
Gunicorn log topology, strict Host behavior, WhiteNoise cache semantics,
Kubernetes controller defaults, browser session lifecycle, and credential-safe
evidence curation. Research resolves time-varying identities; source/static
tests pin deterministic contracts; real collaborators prove behavior.

## Expected Commit and File Inventory Algorithm

The accepted Stage 2 boundary has exactly 24 commit subjects and 32 tracked
files. The planned Phase 26 source history adds five commits:

```text
test(26-01): specify Django production image contract
feat(26-01): add hardened Django production image
test(26-02): specify Django production workload contract
feat(26-02): add Django production workload contracts
docs(26-02): document immutable Django production release
```

Expected final source inventory:

```text
final_commit_count = stage2_commit_count + planned_source_commits
                   = 24 + 5
                   = 29

final_file_count = stage2_tracked_files + new_tracked_files - removed_tracked_files
                 = 32 + 6 - 0
                 = 38
```

Verify mechanically from a fresh public Stage 3 clone:

```bash
test "$(git rev-list --count HEAD)" = 29
test "$(git ls-tree -r --name-only HEAD | wc -l | tr -d ' ')" = 38
test "$(git log --format=%s | sort | uniq -d | wc -l | tr -d ' ')" = 0
git diff --exit-code stage-2-postgresql -- tasks/migrations/0001_initial.py
```

For each RED/GREEN pair, derive scope from Git instead of a handwritten count:

```bash
git diff-tree --no-commit-id --name-only -r <red-sha>
git diff-tree --no-commit-id --name-only -r <green-sha>
test "$(git rev-parse <green-sha>^)" = "<red-sha>"
```

If an execution defect requires another TDD pair, update the formula with the
exact new pair and its files before public Stage 3 acceptance. A new file adds
one to the tracked-file count; modifications preserve the count; deletions
subtract one. The final public replay records the computed constants in
`publication.txt` and verifies them independently.

## Planner Checklist

- Every implementation task names the Django Reference Application directory.
- Every planning/evidence task names the Sealos.io worktree.
- Research values are copied exactly for package pins, base digests, Action
  SHAs, and platform identity.
- Pair 1 and Pair 2 preserve test-only RED and implementation-only GREEN scopes.
- Image A is the first GREEN source; Image B is the README-only final source.
- Image A and Image B use distinct commits/digests and the same immutable
  `0001` migration.
- Workflow test and publish jobs use one normalized target source.
- Build-time collection produces a hashed Task Board CSS asset.
- Migration completes from each candidate digest before rollout acceptance.
- Deployment image and source-release values update atomically.
- Four runtime states preserve one Task through board and native admin readback.
- Evidence is curated, semantically verified, scanned, checksummed atomically,
  and sealed read-only.
- Cleanup covers ReplicaSets, browsers, port-forwards, render/state/clone paths,
  and anonymous registry configs.
- Stage 1/2 objects and ruleset `19014157` remain exact.
- Public Stage 3 replay verifies 29 commits, 38 files, lock/export, static tests,
  real PostgreSQL, both images, and zero temporary footprint.

---

*Phase: 26-django-production-stage*
*Pattern mapping completed from the protected Django Stage 2 source, Phase 25
verification, Phase 23 plans/summaries/verification, and the accepted FastAPI
production source patterns.*
