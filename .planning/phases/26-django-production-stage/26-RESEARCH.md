# Phase 26: Django Production Stage - Research

**Researched:** 2026-07-16
**Domain:** Reproducible Django WSGI containers, WhiteNoise static assets, GitHub Actions/GHCR publication, and migration-first Kubernetes rollback
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

#### Locked Django Runtime Graph

- **D-01:** Preserve Django 5.2 LTS, psycopg 3, Python `>=3.12,<3.13`, the
  accepted `uv.lock`, and the exact runtime-only `requirements.txt` export.
  Add only current compatible Gunicorn and WhiteNoise patch releases after
  primary-source identity and compatibility research.
- Keep `tasks.0001_initial`, the `Task` model, public form, routes, templates,
  administration, PostgreSQL URL parser, and schema-aware `/health` response
  bodies unchanged.
- Every local, CI, image, and public-clone gate must run `uv lock --check` and
  reproduce `requirements.txt` exactly from the committed lock.

#### Build-Time Static Asset Contract

- **D-02:** Use a pinned official Python 3.12 slim-bookworm multi-stage image
  and the accepted uv toolchain. Research must re-resolve every base and Action
  digest immediately before implementation.
- Configure WhiteNoise directly after Django `SecurityMiddleware`, set an
  absolute `/static/` URL, a fixed image-local `STATIC_ROOT`, and compressed
  manifest static storage.
- Run `python manage.py collectstatic --noinput` during the image build. The
  build must fail on collection or manifest errors, and the runtime image
  receives the collected output through an allowlisted copy. Runtime startup
  performs zero static collection and requires zero writable static volume.
- A build-only placeholder may satisfy Django's secret-key import while
  collecting public assets. Production startup requires the runtime Secret.
  The build-only value carries no runtime authority and stays outside retained
  evidence.
- Acceptance must resolve the hashed Task Board stylesheet from the rendered
  page, receive HTTP 200 and CSS content from WhiteNoise, and verify immutable
  cache behavior. The collected manifest and asset remain inspectable inside
  the image.

#### Production Settings, Process, and Security

- **D-03:** Production source runs with `DEBUG=False`, an explicit
  `DJANGO_SECRET_KEY`, explicit allowed hosts, the existing `DATABASE_URL`, and
  stable stdout/stderr logging. Secrets enter through a run-owned Kubernetes
  Secret and never through committed source, rendered evidence, or command
  output.
- Use exact allowed hosts for the Service acceptance path. The readiness probe
  sends a deterministic allowed Host header, preserving strict host validation
  without a wildcard.
- **D-04:** Run Gunicorn WSGI with
  `taskboard.wsgi:application`, bind `0.0.0.0:8000`, and configure exactly one
  synchronous worker per container. Each accepted Pod contains one Gunicorn
  master and one WSGI worker; Kubernetes provides horizontal scaling through
  two replicas.
- Run the final image as fixed UID/GID `10001:10001`. The Pod uses
  `runAsNonRoot`, `RuntimeDefault` seccomp, disabled privilege escalation,
  dropped Linux capabilities, a read-only root filesystem, and a bounded
  memory-backed `/tmp` volume. Gunicorn worker temporary state uses `/tmp`.
- Use `/health` exclusively as the database- and schema-aware readiness probe.
  Database outages remove Pods from Service endpoints while their processes
  remain available for logs and recovery.
- **D-05:** Emit one stable startup identity record per WSGI worker containing
  the baked source release and expected immutable image reference. Runtime
  evidence correlates the Deployment digest, Pod image ID, source environment,
  Gunicorn topology, and startup record.

#### Migration-First Workload Contract

- **D-06:** Commit parameterized Kubernetes Deployment and Service contracts
  with two replicas, rolling update `maxUnavailable: 0` and `maxSurge: 1`,
  bounded resources, revision history sufficient for rollback, port 8000,
  `/health` readiness, the full restricted security context, immutable image
  input, and a run-owned Secret reference.
- The Secret contract exposes exactly `DATABASE_URL` from key `url` and
  `DJANGO_SECRET_KEY` from a dedicated key. Harness-generated values remain in
  process environment or mode-0600 temporary state and are excluded from
  evidence.
- Evolve the accepted production migration Job in place. For each image
  candidate, run `python manage.py migrate --noinput` from the same immutable
  digest and database Secret used by the following Deployment, wait for
  `Complete=True`, verify `[X] 0001_initial`, then accept two-replica readiness.
- Keep the source-based Stage 2 migration adapter as an immutable historical
  validation surface. Production acceptance executes the application-image
  Job.
- Strict rendering accepts one allowlisted token vocabulary, rejects unresolved
  tokens, writes mode-0600 temporary manifests, and completes server-side
  validation before live creation.

#### Public Runtime and Browser Acceptance

- **D-07:** Run the complete gate against a dedicated run-labeled PostgreSQL 17
  service in the authenticated Sealos namespace. One exact run ID owns the
  database, Secret, migration Jobs, Deployment, ReplicaSets, Pods, Service,
  port-forwards, browser session, state, renders, registry configs, and clones.
- At every accepted image state, verify two Ready Pods, exact image IDs,
  UID/GID, one Gunicorn master plus one worker, port 8000, read-only root,
  writable bounded `/tmp`, effective security policy, source/image startup
  logs, `/health`, the rendered board, the hashed CSS asset, and the
  administration login surface.
- Create one persistent Task through the public CSRF form under the baseline
  image. Read the same Task through the board and authenticated native Django
  administration after final rollout, rollback, and recovery. The PostgreSQL
  record and administration identity provide the continuity witness.
- Refresh the owned Service port-forward after each rollout so HTTP acceptance
  follows the active Pods.

#### Immutable Image Publication

- **D-08:** Add the repository-owned minimal GitHub Actions publisher because
  the Django repository currently has no image workflow and the local host has
  no accepted daemon-backed builder. Follow the verified Phase 23 shape:
  exact-source checkout, clean PostgreSQL test gate, build-time collectstatic,
  pinned trusted Actions, `contents: read`, `packages: write`, linux/amd64, and
  anonymous GHCR readback.
- Publish exactly one `sha-<40-character-source-commit>` tag for each candidate
  and deploy only
  `ghcr.io/yangchuansheng/sealos-django-tutorial@sha256:<digest>`. Keep mutable
  branch, stage, date, short-SHA, `main`, and `latest` image tags outside the
  publisher contract.
- Retain two production-capable releases: Image A from the first minimal
  production GREEN descended from accepted Stage 2, and Image B from the final
  frozen Stage 3 source. Both images use migration `0001` and the same
  PostgreSQL data contract.
- Require public package visibility, repository linkage, isolated anonymous
  digest/config/manifest resolution, linux/amd64 identity, OCI source and
  revision equality, and workflow source/target equality before Sealos
  mutation.

#### Source and Image Rollback

- **D-09:** Preserve the source boundary and runtime rollback as two linked
  proofs. Fresh public Stage 2 replay proves the exact protected pre-production
  source. Image A is the first production-capable child of that boundary and
  supplies the executable rollback target. Image B supplies the final Stage 3
  target.
- On one migrated PostgreSQL database, execute this exact state sequence:
  Image A migration and baseline rollout, Image B migration and final rollout,
  `kubectl rollout undo` to Image A, and explicit Image B recovery. Verify the
  same Task and administration readback through all four states.
- Update image digest and source-release environment as one Pod-template tuple.
  Both images retain schema `0001`, so rollback changes the application tuple
  while PostgreSQL data remains intact.

#### Protected Stage 3 Publication

- **D-10:** Freeze the complete reader source before final image acceptance.
  Public `main` must equal that final commit. Publish protected annotated
  `stage-3-production` with exact message `Django production stage` only after
  live rollback/recovery and clean public replay pass.
- Preserve Stage 1 direct object
  `0d9254d37914976898039ff3c55f94399aa1d7c0`, peeled commit
  `ca115bf21b599c14e667b336bd78e3c587c24208`, and message
  `Django deploy stage`.
- Preserve Stage 2 direct object
  `16f60a44885216fa35d67b0334914d8b8d4e8577`, peeled commit
  `16279958ca774f7a34c25b0102a483df53160d6f`, and message
  `Django PostgreSQL stage`.
- Preserve active ruleset `19014157` for `refs/tags/stage-*` update and deletion
  protection. Recover Stage 3 only through coherent absent or exact-matching
  local/remote states and use normal fast-forward branch and single-ref tag
  pushes.
- Fresh public HTTPS clones of all three tags must reproduce lock/export. Stage
  1 retains its public suite, Stage 2 retains its real PostgreSQL contract, and
  Stage 3 passes production static tests, a fresh real PostgreSQL gate, and
  anonymous final-image identity replay.

#### TDD, Evidence, and Cleanup

- **D-11:** Drive the production dependency/settings/container/collectstatic
  contract through one public/static test-only RED followed directly by its
  minimum GREEN. Drive the Deployment/Service/Secret/migration/harness contract
  through a second test-only RED followed directly by its minimum GREEN.
- Tests inspect public files, Django startup behavior, collected asset output,
  and rendered workload contracts. Real GitHub, GHCR, PostgreSQL, Kubernetes,
  Gunicorn, WhiteNoise, HTTP, browser, and Git collaborators supply integration
  acceptance. Keep RED subjects unique, file scopes exact, and each GREEN a
  direct child of its RED.
- **D-12:** Retain curated credential-free evidence under the Phase 26 planning
  directory. The reviewed data set should cover workflow, images,
  `collectstatic`, migrations, runtime, logs, HTTP/admin behavior, rollback,
  publication, and cleanup, followed by one sorted checksum manifest generated
  atomically last.
- Scan every reviewed file for database URLs, password or Secret values,
  cookies, CSRF values, GitHub/bearer/service-account tokens, registry auth,
  kubeconfig data, private keys, unresolved tokens, tracebacks, and exception
  dumps before checksum acceptance.
- Freeze the evidence directory read-only after semantic verification,
  credential scanning, and checksum verification. Final readback may parse and
  verify the sealed package while preserving bytes.
- Delete every run-owned PostgreSQL object, application Deployment,
  ReplicaSet, Pod, Service, migration Job, Secret, ConfigMap, port-forward,
  Gunicorn process, browser session, temporary manifest, state path, clone,
  evidence scratch path, and anonymous registry configuration. Finish with a
  read-only exact-label and ownership-ledger audit.
- Preserve the public source repository, three protected source tags, active
  tag ruleset, public GHCR package, and the two accepted immutable image
  versions as durable release artifacts. Inventory any externally blocked
  temporary package-version cleanup by exact ID for Phase 28.

### the agent's Discretion

- Choose current compatible Gunicorn and WhiteNoise patch versions after
  official package and Django 5.2 compatibility verification.
- Choose the exact official Python and uv image digests after immediate
  registry re-resolution.
- Choose compact production test, workflow, manifest, evidence, and harness
  filenames that preserve the public contracts above.
- Choose bounded CPU, memory, timeout, and probe values that fit the
  authenticated namespace and preserve deterministic acceptance.
- Choose the stable startup log format and the smallest Django extension point
  that emits one record per WSGI worker.

### Deferred Ideas (OUT OF SCOPE)

- Django production tutorial prose, screenshot rendering, measured duration
  claims, Sealos Skills conversion, Ingress, public domain, and browser capture
  remain Phase 27 scope.
- Framework matrix promotion, 15-page tutorial validation, static site route
  checks, image content-type checks, and milestone-wide final resource cleanup
  remain Phase 28 scope.
- Additional Django features, model fields, APIs, authentication flows, worker
  classes, caches, external static storage, and observability systems remain
  outside the current milestone.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| DJAN-03 | Reader can use the production stage with Django 5.2 LTS, Gunicorn WSGI, WhiteNoise, `collectstatic`, non-root execution, readiness, logs, and rollback-ready image tags. | Exact packages, image digests, WSGI/static patterns, workload constraints, rollback sequence, and validation commands below. |
| DJAN-04 | Reader can resolve all three protected source stages while public `main` matches production. | Exact Stage 1/2 identities, Stage 3 publication state machine, public-clone commands, and ruleset checks below. |
</phase_requirements>

## Summary

Django `5.2.16` remains the accepted LTS line and officially supports Python
3.12. Gunicorn `26.0.0` and WhiteNoise `6.12.0` are the current PyPI releases;
both require Python 3.10+, their official repositories confirm the package
identity, WhiteNoise explicitly classifies Django 5.2 support, and an isolated
Python 3.12 import smoke test loaded Django, Gunicorn WSGI, WhiteNoise
middleware, and compressed manifest storage together. [VERIFIED: Django docs,
PyPI JSON, official source repositories, local uv smoke]

The production design should mirror the accepted FastAPI Phase 23 identity
chain while keeping Django-specific static collection and administration as
first-class acceptance surfaces. Build once with exact image and Action pins,
publish only `sha-<40-char>` tags, resolve each to an anonymous GHCR digest,
migrate with that digest, and deploy by digest. [VERIFIED: Phase 23 artifacts,
GitHub docs, GHCR docs, Kubernetes docs]

**Primary recommendation:** Add Gunicorn `26.0.0` and WhiteNoise `6.12.0`, use
the exact supply-chain table below, emit the release record from Gunicorn's
`post_worker_init` hook, collect hashed static assets in the builder, and prove
Image A -> Image B -> rollout undo -> explicit Image B recovery on one owned
PostgreSQL database. [VERIFIED: official docs and accepted local patterns]

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Production settings and WSGI process | API / Backend | Kubernetes | Django and Gunicorn own request execution; Kubernetes owns process placement and replacement. [VERIFIED: Django and Gunicorn docs] |
| Static collection and serving | Build / Image | API / Backend | Django storage creates hashed assets at build time; WhiteNoise serves the immutable image-local output through WSGI. [VERIFIED: WhiteNoise 6.12 docs] |
| Schema migration | Database / Storage | Kubernetes Job | Django migrations exclusively change schema; the Job gives each immutable candidate a bounded one-shot execution. [VERIFIED: Django and Kubernetes Job docs] |
| Readiness and traffic routing | API / Backend | Kubernetes Service | `/health` observes database/schema state; readiness removes an unhealthy Pod from Service endpoints. [VERIFIED: existing source and Kubernetes probe docs] |
| Image publication and identity | GitHub Actions / GHCR | OCI image | One target source SHA drives checkout, tag, labels, digest, and anonymous readback. [VERIFIED: GitHub and OCI docs] |
| Rolling update and rollback | Kubernetes Deployment | PostgreSQL | ReplicaSet history restores the Pod-template tuple while PostgreSQL remains the continuity witness. [VERIFIED: Kubernetes Deployment docs] |
| Source-stage protection | Git / GitHub | GHCR | Annotated tags establish source boundaries; OCI revision maps runtime bytes to the peeled commit. [VERIFIED: live repository and accepted Phase 23 pattern] |

## Exact Recommended Supply Chain

Re-resolve every row immediately before the first implementation commit and
stop on drift. The index digest is the Dockerfile pin; the linux/amd64 child is
the identity expected after platform resolution. [VERIFIED: anonymous `crane`
digest/manifest/config on 2026-07-16]

### Python Packages

| Package | Exact version | Compatibility and identity | Published | Recommendation |
|---------|---------------|----------------------------|-----------|----------------|
| Django | `5.2.16` | Python `>=3.10`; official 5.2 docs list Python 3.12 and designate 5.2 LTS. | 2026-07-07 | Preserve the accepted lock. [VERIFIED: PyPI JSON and Django 5.2 docs] |
| psycopg | `3.3.4` with `binary` extra | Accepted Phase 25 PostgreSQL driver and lock identity. | Existing lock | Preserve unchanged. [VERIFIED: `uv.lock` and Phase 25 verification] |
| Gunicorn | `26.0.0` | Python `>=3.10`; official source exposes WSGI application, sync worker, hooks, and graceful TERM behavior. | 2026-05-05 | Add exact pin. [VERIFIED: PyPI JSON and `benoitc/gunicorn` tag `26.0.0`] |
| WhiteNoise | `6.12.0` | Python `>=3.10`; official classifiers include Django 5.2; middleware and storage imports passed with Django 5.2.16. | 2026-02-27 | Add exact pin. [VERIFIED: PyPI JSON, `evansd/whitenoise` source, local uv smoke] |

The exact runtime export command remains:

```bash
uv lock --check
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
uv export --locked --no-dev --no-emit-project --no-hashes \
  --format requirements.txt --output-file "$tmp/requirements.txt"
cmp -s requirements.txt "$tmp/requirements.txt"
```

[VERIFIED: accepted Phase 25 lock/export contract]

### Container Images

| Purpose | Official tag | Index digest | linux/amd64 child digest | Verified config |
|---------|--------------|--------------|----------------------------|-----------------|
| Python builder/runtime | `docker.io/library/python:3.12.13-slim-bookworm` | `sha256:d50fb7611f86d04a3b0471b46d7557818d88983fc3136726336b2a4c657aa30b` | `sha256:72d3d75f2639ab82b34b29390ad3d6e0827c775befee94edda8e9976818f488d` | `PYTHON_VERSION=3.12.13`, Debian bookworm, `linux/amd64`. [VERIFIED: Docker Official Images manifest and anonymous registry config] |
| uv binary source | `ghcr.io/astral-sh/uv:0.10.9` | `sha256:10902f58a1606787602f303954cea099626a4adb02acbac4c69920fe9d278f82` | `sha256:f8f31ad675ac1a6e17ccabe0e5bbb7fe941b2a27f38cb509c799870570b2f1a7` | OCI source `https://github.com/astral-sh/uv`, revision `f675560f322a6ee6490643a2fce3cb520966c402`, version `0.10.9`. [VERIFIED: anonymous registry config and official release] |
| PostgreSQL acceptance | `postgres:17.10-bookworm` | `sha256:4f736ae292687621d4dbe0d499ffd024a36bd2ee7d8ca6f2ccd4c800f047b394` | Accepted Phase 25 pin | Preserve the real PostgreSQL gate input. [VERIFIED: Phase 25 verification] |

Use digest-qualified stage sources:

```dockerfile
FROM ghcr.io/astral-sh/uv:0.10.9@sha256:10902f58a1606787602f303954cea099626a4adb02acbac4c69920fe9d278f82 AS uv
FROM docker.io/library/python:3.12.13-slim-bookworm@sha256:d50fb7611f86d04a3b0471b46d7557818d88983fc3136726336b2a4c657aa30b AS builder
COPY --from=uv /uv /uvx /bin/
```

[VERIFIED: uv official Docker guide recommends version and digest pinning]

### GitHub Actions

| Action | Current release | Immutable commit SHA | Official release date |
|--------|-----------------|----------------------|-----------------------|
| `actions/checkout` | `v7.0.0` | `9c091bb21b7c1c1d1991bb908d89e4e9dddfe3e0` | 2026-06-18 |
| `astral-sh/setup-uv` | `v8.3.2` | `11f9893b081a58869d3b5fccaea48c9e9e46f990` | 2026-07-08 |
| `docker/login-action` | `v4.4.0` | `af1e73f918a031802d376d3c8bbc3fe56130a9b0` | 2026-07-03 |
| `docker/setup-buildx-action` | `v4.2.0` | `bb05f3f5519dd87d3ba754cc423b652a5edd6d2c` | 2026-07-02 |
| `docker/metadata-action` | `v6.2.0` | `dc802804100637a589fabce1cb79ff13a1411302` | 2026-07-02 |
| `docker/build-push-action` | `v7.3.0` | `53b7df96c91f9c12dcc8a07bcb9ccacbed38856a` | 2026-07-01 |

All six tag objects were resolved through the GitHub API to their current
peeled commit on 2026-07-16. [VERIFIED: GitHub releases and Git Data APIs]

The publishing job should grant only:

```yaml
permissions:
  contents: read
  packages: write
```

GitHub's official container workflow uses these permissions, `GITHUB_TOKEN`,
`login-action`, `metadata-action`, and `build-push-action`; GitHub separately
recommends least-required token access. [VERIFIED: GitHub Actions docs]

## Package Legitimacy Audit

The GSD legitimacy seam currently cannot obtain PyPI download counts. It
returned `SUS` for both new packages on that missing signal, and also missed
WhiteNoise's `Repository` URL even though current PyPI JSON exposes it. The
official repositories, release tags, PyPI metadata, and local import smoke all
agree on identity. [VERIFIED: GSD seam output, PyPI JSON, GitHub APIs]

| Package | Registry | Project age | Downloads | Source repo | Seam verdict | Disposition |
|---------|----------|-------------|-----------|-------------|--------------|-------------|
| `gunicorn==26.0.0` | PyPI | Repository created 2009-11-30 | Unknown to seam | `github.com/benoitc/gunicorn` | SUS: `unknown-downloads` | Approved by locked decision and primary-source identity; planner records the required pre-install identity checkpoint. |
| `whitenoise==6.12.0` | PyPI | Repository created 2013-08-08 | Unknown to seam | `github.com/evansd/whitenoise` | SUS: `unknown-downloads`, stale `no-repository` signal | Approved by locked decision and primary-source identity; planner records the required pre-install identity checkpoint. |

**Packages removed due to SLOP verdict:** none.

**Packages flagged as suspicious by the seam:** `gunicorn`, `whitenoise`; each
requires the protocol-mandated identity checkpoint before lock mutation.

## Architecture Patterns

### End-to-End Identity and Runtime Flow

```text
protected Stage 2 commit
  -> test-only RED
  -> minimal production GREEN (Image A source)
  -> exact-SHA GitHub Actions checkout + PostgreSQL gate
  -> linux/amd64 build (collectstatic in builder)
  -> GHCR sha-<40-char> tag
  -> anonymous digest/config/manifest gate
  -> same-digest migration Job Complete
  -> 2-replica Gunicorn + WhiteNoise Deployment Ready
  -> persistent Task + admin witness
  -> final frozen source (Image B)
  -> same gates and migration
  -> Image B rollout
  -> kubectl rollout undo to Image A
  -> explicit Image B tuple recovery
  -> public-clone replay
  -> protected annotated Stage 3
  -> sealed evidence + exact cleanup audit
```

[VERIFIED: locked context and accepted Phase 23/25 contracts]

### Recommended Public File Boundary

```text
.github/workflows/publish-image.yml     # exact-source test/build/publish gate
.dockerignore                           # allowlisted build context exclusions
Dockerfile                              # pinned multi-stage production image
deploy/application.yaml                # Secret + Deployment + Service contract
deploy/migration-job.yaml               # same-digest application migration Job
scripts/test-production.sh              # registry, runtime, rollback, evidence, cleanup gate
tests/test_production.py                 # both public production RED seams
tests/test_migration_job.py              # extend exact same-image Job contract
tests/test_postgres_harness.py           # extend production harness contract
taskboard/settings.py                   # production secret/hosts/static/logging
taskboard/wsgi.py                        # one startup identity per serving worker
pyproject.toml / uv.lock / requirements.txt
```

[VERIFIED: current Django tree plus Phase 23 production pattern]

### Pattern 1: Build-Time Static Assets

Use these exact Django settings:

```python
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    # existing middleware follows
]

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STORAGES = {
    'default': {
        'BACKEND': 'django.core.files.storage.FileSystemStorage',
    },
    'staticfiles': {
        'BACKEND': (
            'whitenoise.storage.'
            'CompressedManifestStaticFilesStorage'
        ),
    },
}
```

WhiteNoise requires `WhiteNoiseMiddleware` directly after
`SecurityMiddleware`. Its compressed manifest backend extends Django's
manifest backend, writes hashed/compressed output during `collectstatic`, and
recognizes manifest-hashed names as immutable. Such responses receive
`Cache-Control: max-age=315360000, public, immutable`. [VERIFIED: WhiteNoise
6.12 docs and source]

Run collection in the builder with an inline public placeholder:

```dockerfile
RUN DJANGO_SECRET_KEY=build-only-collectstatic \
    python manage.py collectstatic --noinput
```

Copy only the resolved virtual environment, application source, and collected
`staticfiles/` tree into the runtime stage. Keep
`collectstatic`, uv, caches, source control, tests, and build credentials out of
the runtime. [VERIFIED: locked context and uv Docker guidance]

### Pattern 2: One Gunicorn Worker per Pod

Emit the stable startup identity from `taskboard/wsgi.py` when a serving worker
imports the WSGI application:

```python
import os
import sys

print(
    'event=worker_start source_release=%s image_reference=%s' % (
        os.environ['SOURCE_RELEASE'],
        os.environ['IMAGE_REFERENCE'],
    ),
    file=sys.stderr,
    flush=True,
)
```

Run `gunicorn taskboard.wsgi:application` with explicit command-line arguments
for bind `0.0.0.0:8000`, one sync worker, `/tmp` worker temporary state,
timeouts, and stdout/stderr logs. Keep `--preload` absent so only the serving
worker imports the WSGI module and emits the record. Gunicorn's official model
is one master plus a pre-fork worker pool; one worker therefore yields the
required master/worker topology. [VERIFIED: Gunicorn 26.0.0 design/settings
docs]

Gunicorn treats `TERM` as graceful shutdown and waits up to
`graceful_timeout`; Kubernetes sends `SIGTERM` to PID 1 during Pod termination.
Set `terminationGracePeriodSeconds: 35` so the 25-second Gunicorn window has a
bounded outer margin. [VERIFIED: Gunicorn signals and Kubernetes Pod lifecycle]

### Pattern 3: Migration-First Deployment

For each candidate digest:

1. Render and server-side dry-run the exact-token Secret, migration Job,
   Deployment, and Service.
2. Create the run-owned Secret without printing its values.
3. Delete/recreate the candidate-specific Job, wait for `Complete=True`, and
   require migration output `[X] 0001_initial`.
4. Apply image digest plus `SOURCE_RELEASE` and `IMAGE_REFERENCE` in one Pod
   template change.
5. Wait for `2/2` Ready and correlate Deployment image, Pod `imageID`, process
   tree, environment identity, and worker startup logs.

Kubernetes Jobs have terminal `Complete` and `Failed` conditions; with
`backoffLimit: 1`, `activeDeadlineSeconds: 300`, and `restartPolicy: Never`, a
bad migration ends as a bounded visible failure. [VERIFIED: Kubernetes Job
docs]

### Pattern 4: Readiness and Rolling Rollback

Use the existing schema-aware `/health` only as readiness. Configure the HTTP
probe with `Host: taskboard.local`, initial delay 2 seconds, period 5 seconds,
timeout 2 seconds, failure threshold 12, and success threshold 1. Failed
readiness removes a Pod from Service traffic while preserving the process for
logs and recovery. [VERIFIED: Kubernetes probe docs and locked context]

Use two replicas, `maxUnavailable: 0`, `maxSurge: 1`,
`progressDeadlineSeconds: 180`, and `revisionHistoryLimit: 3`. Kubernetes stores
Deployment revisions in ReplicaSets; a positive history limit preserves the
previous Pod template for `kubectl rollout undo`. [VERIFIED: Kubernetes
Deployment docs]

### Pattern 5: Restricted Runtime

Mirror the accepted production workload:

```yaml
spec:
  automountServiceAccountToken: false
  terminationGracePeriodSeconds: 35
  securityContext:
    runAsNonRoot: true
    runAsUser: 10001
    runAsGroup: 10001
    seccompProfile:
      type: RuntimeDefault
  containers:
    - securityContext:
        allowPrivilegeEscalation: false
        readOnlyRootFilesystem: true
        capabilities:
          drop: ["ALL"]
      resources:
        requests: {cpu: 100m, memory: 128Mi}
        limits: {cpu: 500m, memory: 512Mi}
      volumeMounts:
        - {name: tmp, mountPath: /tmp}
  volumes:
    - name: tmp
      emptyDir:
        medium: Memory
        sizeLimit: 64Mi
```

Kubernetes defines `readOnlyRootFilesystem`, privilege escalation, capability,
and seccomp controls in `securityContext`. A memory-backed `emptyDir` is tmpfs,
its writes count against memory, and an explicit `sizeLimit` bounds the mount.
[VERIFIED: Kubernetes security-context and volume docs]

### Pattern 6: Exact-SHA Publisher and GHCR Gate

Normalize one `TARGET_SHA` for push or dispatch and use it for checkout, clean
tests, build context, `sha-${TARGET_SHA}`, `SOURCE_RELEASE`, OCI revision,
concurrency, and summary. `metadata-action` supports a long SHA format and
generates OCI source/revision labels; `build-push-action` exposes the pushed
digest. [VERIFIED: exact Action READMEs/action metadata]

GHCR packages created through a repository workflow with `GITHUB_TOKEN` link
to that repository. The `org.opencontainers.image.source` label supplies the
repository association, public container images support anonymous access, and
digest-qualified pulls preserve exact bytes. New personal packages default to
private, so acceptance must verify public visibility and anonymous resolution
before Kubernetes mutation. [VERIFIED: GitHub Container registry docs]

## Implementation Implications

1. Add both packages in the first GREEN and regenerate `uv.lock` plus
   `requirements.txt` atomically; every later boundary treats those files as an
   identity triplet. [VERIFIED: locked D-01]
2. Set `DEBUG = False`, require `DJANGO_SECRET_KEY`, parse one explicit
   allowed-host input, and update the owned tests/harness to inject their test
   secret and deterministic Host. Preserve every database parser and health
   response byte. [VERIFIED: current source and locked D-03]
3. Bake `SOURCE_RELEASE` from the normalized source SHA. Supply
   `IMAGE_REFERENCE=name@sha256:digest` in the Pod template because the pushed
   registry digest becomes known after the image build. Log both from
   `post_worker_init`. [VERIFIED: OCI build sequence and Gunicorn hook docs]
4. Retain `deploy/source-migration-job.yaml` byte-for-byte as the Stage 2
   historical adapter. Evolve `deploy/migration-job.yaml` to consume the same
   runtime Secret keys and same candidate digest as the Deployment. [VERIFIED:
   locked D-06/D-09]
5. Use the Phase 23 four-plan order: image baseline, workload/final image, live
   rollback/recovery, then protected publication/public replay. This keeps the
   two TDD RED/GREEN pairs adjacent and freezes each image source before dynamic
   registry evidence exists. [VERIFIED: Phase 23 plans and verification]

## Don't Hand-Roll

| Problem | Avoid building | Use instead | Reason |
|---------|----------------|-------------|--------|
| Static asset versioning/compression | Custom hash renamer or ad hoc WSGI file route | Django `collectstatic` + WhiteNoise `CompressedManifestStaticFilesStorage` | Handles manifest references, compression, immutable names, and cache headers. [VERIFIED: WhiteNoise docs/source] |
| WSGI process supervision | Custom multiprocessing wrapper | Gunicorn master + one sync worker | Supplies worker lifecycle, signals, logs, timeout, and hooks. [VERIFIED: Gunicorn docs] |
| Schema startup | Table creation inside application startup | Django migrations in a Kubernetes Job | Preserves exclusive schema ownership and bounded failure state. [VERIFIED: Phase 25 and Kubernetes Job docs] |
| Release tag generation | Shell-shortened mutable tags | `metadata-action` with validated full source SHA | Produces deterministic tag/OCI metadata from one input. [VERIFIED: metadata-action docs] |
| Registry identity | Authenticated pull as the sole check | Fresh empty config plus anonymous `crane digest/config/manifest` | Proves public reader access and exact OCI identity. [VERIFIED: GHCR docs and Phase 23 acceptance] |
| Traffic health | Process-only liveness as readiness | Existing database/schema-aware `/health` | Service endpoints follow actual request readiness. [VERIFIED: Kubernetes readiness docs] |
| Rollback controller | Scripted delete/recreate | Deployment rolling update and `kubectl rollout undo` | Preserves controller history and exposes revision state. [VERIFIED: Kubernetes Deployment docs] |

## Common Failure Modes

| Failure mode | Consequence | Prevention and early signal |
|--------------|-------------|-----------------------------|
| WhiteNoise appears below session/common middleware | Static responses traverse unintended middleware or fail to serve from the expected position. | Static test asserts `SecurityMiddleware`, then `WhiteNoiseMiddleware`, then the retained list. [VERIFIED: WhiteNoise docs] |
| `STATIC_URL` remains `static/` | URL and probe assertions become path-context dependent. | Require exact `/static/` and resolve the stylesheet from rendered HTML. [VERIFIED: current source and locked D-02] |
| Runtime executes `collectstatic` | Startup needs a writable static tree and can drift from image identity. | Container command contains Gunicorn only; image test inspects manifest and hashed CSS. [VERIFIED: locked D-02] |
| Missing manifest input during collection | Build raises a manifest/post-process error. | Keep collection as a mandatory image build step and test the real asset graph. [VERIFIED: Django/WhiteNoise storage behavior] |
| `AppConfig.ready()` emits release identity | Migration and management commands also initialize apps, diluting the one-record-per-worker contract. | Use Gunicorn `post_worker_init`. [VERIFIED: Gunicorn hook scope; current Django app layout] |
| Gunicorn temporary heartbeat uses an unwritable location | Worker heartbeat can block or fail under a read-only root. | Set `worker_tmp_dir='/tmp'` and mount bounded tmpfs. [VERIFIED: Gunicorn setting and Kubernetes volume docs] |
| Pod grace ends before Gunicorn grace | Requests receive forced termination. | Use 25-second Gunicorn grace inside 35-second Pod grace and test TERM behavior. [VERIFIED: Gunicorn/Kubernetes signal docs] |
| Readiness Host is absent from `ALLOWED_HOSTS` | Django returns host-validation errors and the rollout stalls. | Probe with exact `Host: taskboard.local`; use the same host for port-forward acceptance. [VERIFIED: locked D-03] |
| Migration image and Deployment image differ | Schema acceptance proves another artifact. | Renderer accepts one candidate digest and injects it into both resources. [VERIFIED: locked D-06] |
| `revisionHistoryLimit: 0` or old ReplicaSet pruned | `rollout undo` loses its executable target. | Set 3 and assert pre/post controller revisions. [VERIFIED: Kubernetes Deployment docs] |
| GHCR package stays private | Sealos or a public reader requires ambient credentials. | Read visibility through API and resolve digest/config/manifest with a fresh empty config. [VERIFIED: GHCR docs] |
| Workflow dispatch builds public `main` instead of requested baseline | Image A OCI revision silently maps to Image B. | Checkout validated `TARGET_SHA`; distinguish API `head_sha` from normalized target in logs and summary. [VERIFIED: Phase 23 recovery lesson] |
| Mutable or short tags enter the publisher | Runtime identity can move or collide. | Assert the exact tag set equals one `sha-<40-char>` value. [VERIFIED: locked D-08] |
| Sensitive runtime values enter evidence | Durable credential exposure. | Evidence writers emit semantic booleans/identities; scanner reports only file and rule. [VERIFIED: locked D-12] |
| Local kubectl/client skew changes validation | Client behavior falls outside the supported skew warning. | Require server-side dry-run and record server `v1.33.6`; use an official 1.33/1.34 client if a client-side compatibility issue appears. [VERIFIED: live `kubectl version` warning] |

## Environment Availability

| Dependency | Required by | Available | Version / state | Implementation consequence |
|------------|-------------|-----------|-----------------|----------------------------|
| Python | lock/tests | Yes | 3.12.12 | Meets project range; image uses official 3.12.13. [VERIFIED: local probe and image config] |
| uv | lock/export | Yes | 0.10.9 | Matches accepted toolchain. [VERIFIED: local probe] |
| GitHub CLI | workflow/package/tag APIs | Yes | 2.86.0 | Can resolve releases, runs, refs, rulesets, and package state. [VERIFIED: local probe] |
| crane | anonymous OCI readback | Yes | 0.21.7 | Can resolve digest/config/manifest without a daemon. [VERIFIED: local probe and live reads] |
| kubectl | Sealos gate | Yes | client 1.35.0, server 1.33.6 | Live access works; client prints a greater-than-one-minor skew warning. [VERIFIED: live cluster probe] |
| Authenticated Sealos namespace | production runtime | Yes | `dn9ue3wz@sealos`, `ns-let51wad` | Required create/delete/log/port-forward authorization checks returned yes. [VERIFIED: `kubectl auth can-i`] |
| Local daemon-backed builder | image build | Missing | Docker, Podman, Buildah absent | GitHub Actions remains the authoritative builder. [VERIFIED: local command probe] |
| Local registry inspectors | optional | Partial | Skopeo/regctl absent | crane supplies the accepted read-only path. [VERIFIED: local command probe] |

### Sealos Namespace Constraints

The live namespace quota allows 160 CPU, 640 GiB memory, 200 Pods, and 2 TiB
ephemeral storage; current usage at research time was 9.9 CPU, 21.94 GiB memory,
11 Pods, and 46 GiB ephemeral storage. Its LimitRange defaults are 50m CPU,
64Mi memory, and a 100Mi ephemeral-storage request. [VERIFIED: live
ResourceQuota and LimitRange readback]

Pod Security Admission enforces `baseline` v1.25 and warns/audits `restricted`
v1.25. The recommended manifest meets the restricted profile shape through
non-root execution, RuntimeDefault seccomp, disabled escalation, and dropped
capabilities. [VERIFIED: live namespace labels and Kubernetes security docs]

The two application Pods plus one migration Pod at the recommended limits fit
the observed namespace headroom. The 64Mi memory-backed `/tmp` is charged as
memory and remains within each 512Mi container limit. [VERIFIED: quota
arithmetic and Kubernetes emptyDir docs]

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | pytest 9.1.1 + pytest-django 4.12.0, real PostgreSQL wrapper |
| Existing config | `pyproject.toml` and `tests/conftest.py` |
| Focused run | `./scripts/test-postgres.sh --pytest-only tests/test_production.py -q` |
| Full existing gate | `./scripts/test-postgres.sh --phase-gate` |
| Final production gate | `./scripts/test-production.sh --run --baseline-image "$IMAGE_A" --baseline-source "$SOURCE_A" --final-image "$IMAGE_B" --final-source "$SOURCE_B" --evidence-dir "$EVIDENCE_DIR"` |

[VERIFIED: accepted target repository]

### Phase Requirements to Test Map

| Req ID | Behavior | Test type | Automated command | File state |
|--------|----------|-----------|-------------------|------------|
| DJAN-03 | Exact dependencies, production settings, Docker stages, collection output, Gunicorn topology | Public/static integration | `./scripts/test-postgres.sh --pytest-only tests/test_production.py -q` | Wave 1: create |
| DJAN-03 | Secret/Deployment/Service/Job renderer, readiness, security, rollback order, cleanup | Static + real integration | `./scripts/test-postgres.sh --pytest-only tests/test_migration_job.py tests/test_postgres_harness.py tests/test_production.py -q` then `./scripts/test-production.sh --run ...` | Wave 2: extend |
| DJAN-03 | Hashed CSS, board/admin continuity, two Pods, logs, four runtime states | Real HTTP/browser/Kubernetes | `./scripts/test-production.sh --run ...` | Extend existing harness pattern |
| DJAN-04 | Direct/peeled refs/messages, main equality, ruleset, three public-clone replays | Public Git/registry integration | public Git/GitHub checks plus `./scripts/test-production.sh --verify-evidence publication --evidence-dir "$EVIDENCE_DIR"` | Extend harness |

### Sampling Rate

- **Per RED/GREEN task:** the focused new test file plus lock/export check.
- **Per plan:** all public pytest files through the owned PostgreSQL wrapper.
- **Per image candidate:** exact successful workflow plus anonymous OCI identity.
- **Phase gate:** fresh Stage 3 clone, real PostgreSQL, four-state Sealos run,
  publication replay, sealed evidence, and read-only global cleanup.

### Wave 0 Gaps

- [ ] `tests/test_production.py` - both public production RED seams.
- [ ] Extend `tests/test_migration_job.py` and `tests/test_postgres_harness.py`
  in the second RED.
- [ ] `scripts/test-production.sh` - production registry/runtime/evidence gate.
- [ ] Extend `taskboard/wsgi.py` with the stable per-worker release record.
- [ ] `.github/workflows/publish-image.yml`, `Dockerfile`, `.dockerignore`, and
  `deploy/application.yaml` - public production contracts.

## Validation Commands

### Re-resolve Packages

```bash
python3 -m pip index versions gunicorn | head -2
python3 -m pip index versions whitenoise | head -2
curl -fsSL https://pypi.org/pypi/gunicorn/26.0.0/json | jq -r '.info.version'
curl -fsSL https://pypi.org/pypi/whitenoise/6.12.0/json | jq -r '.info.version'
```

### Re-resolve Image Index and linux/amd64 Child

```bash
crane digest docker.io/library/python:3.12.13-slim-bookworm
crane manifest docker.io/library/python:3.12.13-slim-bookworm |
  jq -r '.manifests[] | select(.platform.os=="linux" and .platform.architecture=="amd64") | .digest'
crane digest ghcr.io/astral-sh/uv:0.10.9
crane manifest ghcr.io/astral-sh/uv:0.10.9 |
  jq -r '.manifests[] | select(.platform.os=="linux" and .platform.architecture=="amd64") | .digest'
```

Run these with a fresh empty mode-0700 `DOCKER_CONFIG` and unset registry/token
variables, matching the anonymous acceptance path. [VERIFIED: Phase 23 gate]

### Re-resolve Action Commits

```bash
gh api repos/actions/checkout/git/ref/tags/v7.0.0 --jq .object.sha
gh api repos/astral-sh/setup-uv/git/ref/tags/v8.3.2 --jq .object.sha
gh api repos/docker/login-action/git/ref/tags/v4.4.0 --jq .object.sha
gh api repos/docker/setup-buildx-action/git/ref/tags/v4.2.0 --jq .object.sha
gh api repos/docker/metadata-action/git/ref/tags/v6.2.0 --jq .object.sha
gh api repos/docker/build-push-action/git/ref/tags/v7.3.0 --jq .object.sha
```

### Static and Runtime Acceptance

```bash
./scripts/test-postgres.sh --pytest-only tests/test_production.py -q
./scripts/test-postgres.sh --pytest-only tests/test_migration_job.py tests/test_postgres_harness.py tests/test_production.py -q
./scripts/test-production.sh --run --baseline-image "$IMAGE_A" --baseline-source "$SOURCE_A" --final-image "$IMAGE_B" --final-source "$SOURCE_B" --evidence-dir "$EVIDENCE_DIR"
./scripts/test-production.sh --verify-evidence live --evidence-dir "$EVIDENCE_DIR"
./scripts/test-production.sh --verify-evidence publication --evidence-dir "$EVIDENCE_DIR"
./scripts/test-production.sh --assert-clean-all
```

The production gate must additionally inspect the image filesystem for
`staticfiles.json` and the resolved hashed stylesheet, issue HTTP requests for
the board, hashed CSS, `/admin/login/`, and `/health`, and validate process
counts plus Pod image IDs at all four states. [VERIFIED: locked D-05/D-07/D-12]

### Source and Package Identity

```bash
git ls-remote --tags https://github.com/yangchuansheng/sealos-django-tutorial.git \
  stage-1-deploy stage-1-deploy^{} \
  stage-2-postgresql stage-2-postgresql^{} \
  stage-3-production stage-3-production^{}
gh api repos/yangchuansheng/sealos-django-tutorial/rulesets/19014157
gh api repos/yangchuansheng/sealos-django-tutorial/commits/main --jq .sha
```

The accepted live ruleset is active and contains update/deletion rules for
`refs/tags/stage-*`. [VERIFIED: GitHub API on 2026-07-16]

## Security Domain

### Applicable ASVS Categories

| ASVS category | Applies | Standard control |
|---------------|---------|------------------|
| V2 Authentication | Yes | Native Django administration authentication and password validation remain unchanged. [VERIFIED: current source] |
| V3 Session Management | Yes | Django session and CSRF middleware; browser evidence stores credentials/cookies only in owned ephemeral state. [VERIFIED: current source and locked D-12] |
| V4 Access Control | Yes | Native admin authorization; Kubernetes Secret and namespace RBAC; no public management endpoint. [VERIFIED: current source and live authorization] |
| V5 Input Validation | Yes | Existing ModelForm, strict URL/host/token parsers, server-side Kubernetes validation. [VERIFIED: current source and Phase 25] |
| V6 Cryptography | Yes | Django secret/password primitives and transport supplied by existing platform paths; custom cryptography remains outside scope. [VERIFIED: Django architecture and locked scope] |

### Threat Map

| Pattern | STRIDE | Mitigation |
|---------|--------|------------|
| Mutable or spoofed image identity | Spoofing | Full source SHA tag, digest deployment, OCI source/revision, workflow head/target correlation, Pod imageID. |
| Secret disclosure in logs/evidence | Information disclosure | SecretRef, mode-0600 state, semantic evidence, credential scan before checksums. |
| Unmigrated or incompatible runtime | Tampering / denial of service | Same-digest Job completion and `[X] 0001_initial` before rollout. |
| Privileged container escape surface | Elevation of privilege | UID/GID 10001, seccomp, escalation disabled, capabilities dropped, read-only root. |
| Public form request forgery | Spoofing / tampering | Native Django CSRF form and browser acceptance. |
| Shared namespace collateral deletion | Tampering / denial of service | Exact run label, prefix, PID, session, and ownership-ledger cleanup only. |
| Dependency/Action substitution | Tampering | Exact package pins, image digests, Action commit SHAs, public source identity checks. |

[VERIFIED: locked security/evidence contracts and official framework/platform
controls]

## Project Constraints (from AGENTS.md)

- Planning artifacts, code, comments, commits, and PR text use English.
- Work starts and remains inside the GSD workflow; Phase 26 changes execute
  through `$gsd-execute-phase` plans.
- Edits stay surgical, preserve existing architecture/style, remove only items
  made unused by the change, and avoid speculative abstractions.
- TDD reproduces each missing public contract as a test-only RED before its
  minimum GREEN and verifies invalid inputs plus live collaborators.
- Runtime and public evidence carry more weight than local build success.
- `.codegraph/` is absent, so direct repository inspection is the active code
  discovery path. [VERIFIED: filesystem probe]
- Project-local skills are absent. [VERIFIED: AGENTS.md project-skill section]

## State of the Art

| Earlier shape | Current recommended shape | Impact |
|---------------|---------------------------|--------|
| Development server and `DEBUG=True` | Gunicorn 26 WSGI, `DEBUG=False`, explicit secret/hosts | Production process and host validation become executable contracts. [VERIFIED: current source and official docs] |
| Relative `STATIC_URL` with Django development serving | Absolute `/static/`, build-time compressed manifest, WhiteNoise middleware | Hashed assets become image identity with immutable HTTP proof. [VERIFIED: WhiteNoise docs] |
| Source-based Stage 2 migration adapter | Same-digest application image Job for production; Stage 2 adapter retained | Migration proves the exact runtime candidate. [VERIFIED: locked context] |
| No image workflow | Exact-SHA, minimally permissioned GHCR publisher with current Action pins | Public runtime bytes map to public source and can be replayed anonymously. [VERIFIED: GitHub docs/APIs] |
| One process restart persistence proof | Two-replica, two-image, four-state controller proof | Demonstrates process, image, and source rollback while preserving PostgreSQL data. [VERIFIED: Phase 23/25 contracts] |

## Assumptions Log

All implementation recommendations are verified against current official
sources, live registry/cluster APIs, or accepted local evidence. No training-only
claim controls planning.

## Open Questions

None blocking. Re-resolution drift in package versions, image digests, Action
tags, or live namespace policy is a fail-closed implementation preflight and
requires updating this research before using replacement values.

## Sources

### Primary (HIGH confidence)

- Django 5.2 release and Python support:
  <https://docs.djangoproject.com/en/5.2/releases/5.2/>,
  <https://docs.djangoproject.com/en/5.2/faq/install/#what-python-version-can-i-use-with-django>
- Django static deployment and `collectstatic`:
  <https://docs.djangoproject.com/en/5.2/howto/static-files/deployment/>,
  <https://docs.djangoproject.com/en/5.2/ref/contrib/staticfiles/>
- WhiteNoise Django integration, settings, storage, and source:
  <https://whitenoise.readthedocs.io/en/stable/django.html>,
  <https://github.com/evansd/whitenoise/tree/6.12.0>
- Gunicorn design, settings, and signals:
  <https://gunicorn.org/design/>,
  <https://gunicorn.org/reference/settings/>,
  <https://gunicorn.org/signals/>,
  <https://github.com/benoitc/gunicorn/tree/26.0.0>
- PyPI version/identity APIs:
  <https://pypi.org/pypi/Django/5.2.16/json>,
  <https://pypi.org/pypi/gunicorn/26.0.0/json>,
  <https://pypi.org/pypi/whitenoise/6.12.0/json>
- Docker Official Images Python manifest:
  <https://github.com/docker-library/official-images/blob/master/library/python>
- uv Docker guidance and release:
  <https://docs.astral.sh/uv/guides/integration/docker/>,
  <https://github.com/astral-sh/uv/releases/tag/0.10.9>
- GitHub Actions publishing, token, and Container registry:
  <https://docs.github.com/en/actions/tutorials/publish-packages/publish-docker-images>,
  <https://docs.github.com/en/actions/tutorials/authenticate-with-github_token>,
  <https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry>,
  <https://docs.github.com/en/packages/learn-github-packages/configuring-a-packages-access-control-and-visibility>
- Exact Action releases:
  <https://github.com/actions/checkout/releases/tag/v7.0.0>,
  <https://github.com/astral-sh/setup-uv/releases/tag/v8.3.2>,
  <https://github.com/docker/login-action/releases/tag/v4.4.0>,
  <https://github.com/docker/setup-buildx-action/releases/tag/v4.2.0>,
  <https://github.com/docker/metadata-action/releases/tag/v6.2.0>,
  <https://github.com/docker/build-push-action/releases/tag/v7.3.0>
- Kubernetes Jobs, Deployments, probes, Pod termination, security, and volumes:
  <https://kubernetes.io/docs/concepts/workloads/controllers/job/>,
  <https://kubernetes.io/docs/concepts/workloads/controllers/deployment/>,
  <https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/>,
  <https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination>,
  <https://kubernetes.io/docs/tasks/configure-pod-container/security-context/>,
  <https://kubernetes.io/docs/concepts/storage/volumes/#emptydir>

### Repository and Live Primary Evidence

- `/Users/longnv/bin/repo/sealos-django-tutorial` at protected Stage 2.
- `.planning/phases/23-fastapi-production-stage/*` accepted production pattern.
- `.planning/phases/25-django-postgresql-stage/*` accepted Django database boundary.
- Anonymous `crane` reads, GitHub API release/ref/ruleset reads, and read-only
  Sealos namespace/API probes performed 2026-07-16.

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - exact official releases, registry metadata, source
  tags, lock identity, and local compatibility smoke agree.
- Architecture: HIGH - locked context plus accepted Phase 23/25 runtime patterns
  and current official Gunicorn/WhiteNoise/Kubernetes behavior.
- Supply chain: HIGH - image indexes/children and Action commits were resolved
  live; implementation must repeat the resolution.
- Sealos constraints: HIGH for the 2026-07-16 snapshot; namespace quotas,
  policies, authorization, and server version can change before execution.
- Package-legitimacy seam: MEDIUM - official identity is strong while the seam
  lacks PyPI download metrics and emitted protocol-required SUS warnings.

**Research date:** 2026-07-16
**Valid until:** 2026-07-23 for registry/Action/namespace pins; stable framework
behavior remains valid for the exact versions above.
