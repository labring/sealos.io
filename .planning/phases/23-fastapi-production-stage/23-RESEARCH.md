# Phase 23: FastAPI Production Stage - Research

**Researched:** 2026-07-15
**Domain:** Reproducible Python containers, GitHub Actions, GHCR, hardened
Kubernetes Deployments, Uvicorn, readiness, logs, and digest rollback
**Requirements:** FAST-03, FAST-04
**Confidence:** HIGH for official-source and live-environment facts; MEDIUM for
the proposed manifests until the published image completes the Sealos gate

## Research Outcome

Phase 23 should publish the production image through GitHub Actions, resolve
every runnable image tag to a registry digest, and deploy only the digest to
Sealos. The image should use the accepted Phase 22 dependency graph, an exact
Python 3.12.13 base, a pinned uv build tool, a numeric non-root user, one
explicit Uvicorn worker, and a read-only root filesystem. A two-replica
Deployment should use the existing schema-aware `/health` endpoint as its
readiness probe.

The rollback proof needs two successfully published production commits. Each
commit produces a full-SHA image tag and a digest. The live gate deploys the
earlier digest, advances to the final digest, rolls back to the earlier digest,
and restores the final digest while preserving PostgreSQL data and HTTP
behavior. This supplies stronger evidence than a mutable stage tag.

## Inherited Contracts

- Public source repository:
  `https://github.com/yangchuansheng/sealos-fastapi-tutorial`.
- Accepted Phase 22 source: public `main` and protected annotated
  `stage-2-postgresql` both peel to `2b256b3`.
- Protected annotated `stage-1-deploy` remains at `276aa00`.
- The existing active ruleset protects `refs/tags/stage-*` from update and
  deletion.
- The accepted runtime graph contains FastAPI 0.139.0, Uvicorn 0.51.0,
  SQLAlchemy 2.0.51, Alembic 1.18.5, and psycopg 3.3.4.
- Alembic exclusively owns schema revision `0001`.
- `/health` returns 200 only when PostgreSQL is reachable and `tasks` exists;
  pre-migration and unavailable database states return the stable 503 body.
- `deploy/migration-job.yaml` runs `alembic upgrade head` and must use the same
  application digest as the Deployment during live acceptance.
- The 24-case HTTP suite and full real-PostgreSQL gate remain the regression
  baseline.

## Current Source and Environment State

### Reference Repository

| Fact | Verified value |
|------|----------------|
| Visibility | Public |
| Default branch | `main` |
| Current main | `2b256b3` |
| Workflows | 0 |
| Target container package | Absent |
| Actions | Enabled; all actions allowed |
| Default workflow token | Read-only |
| Repository permissions | Authenticated owner has admin/push access |
| Secret scanning | Enabled, with push protection enabled |

The production workflow must declare `contents: read` and `packages: write`
because the repository default token is read-only. The first successful
workflow publication creates the `sealos-fastapi-tutorial` container package.

### Local Tooling

| Tool | Verified state | Phase consequence |
|------|----------------|-------------------|
| Docker / Podman / Buildah | Absent | GitHub Actions is the authoritative image builder. |
| crane | Available at `/opt/homebrew/bin/crane` | Resolve and inspect public image digests without a daemon. |
| uv | 0.10.9 | Preserve the accepted Phase 22 lock-tool version in the image builder. |
| Project virtualenv | Python 3.12.12 | Local smoke tests are compatible; the image and CI gate must select 3.12.13 exactly. |
| kubectl | Client 1.35.0 | Use API-stable commands and a supported 1.33/1.34 client for the final retained run when practical. |

The active API server is Kubernetes 1.33.6 on Linux/amd64. The local 1.35
client is two minor versions newer, while the official skew policy supports one
minor version. Existing commands work, and the retained production run should
record this warning or use a matching client.

### Sealos Namespace

The authenticated context is `dn9ue3wz@sealos`, namespace `ns-let51wad`.
Namespace Pod Security Admission is configured as:

- enforce `baseline` at v1.25;
- warn `restricted` at v1.25;
- audit `restricted` at v1.25.

Read-only RBAC checks returned `yes` for the Deployment, Pod, Service, Job,
Secret, ConfigMap, Ingress, ReplicaSet, event, log, patch, and delete operations
needed by the production gate. Instance create/delete is also available for
later tutorial practice. Cluster-wide Node listing is forbidden. The API server
reports Linux/amd64, so Phase 23 can publish a focused `linux/amd64` image.

No resource containing `tutorial-fastapi` or `sealos-fastapi` and no object
carrying a Phase 22 run label remained at research time.

## Package and Image Legitimacy Audit

### Runtime and Builder Images

Digests were resolved on 2026-07-15 from the official registries with `crane`.
The index digest is the Dockerfile pin; the platform digest is retained as an
inspection cross-check.

| Component | Selected reference | Index digest | Linux/amd64 digest | Legitimacy result |
|-----------|--------------------|--------------|--------------------|-------------------|
| Python runtime | `docker.io/library/python:3.12.13-slim-bookworm` | `sha256:d50fb7611f86d04a3b0471b46d7557818d88983fc3136726336b2a4c657aa30b` | `sha256:72d3d75f2639ab82b34b29390ad3d6e0827c775befee94edda8e9976818f488d` | CLEAR: Docker Official Image, exact Python patch and Debian family. |
| uv builder | `ghcr.io/astral-sh/uv:0.10.9` | `sha256:10902f58a1606787602f303954cea099626a4adb02acbac4c69920fe9d278f82` | `sha256:f8f31ad675ac1a6e17ccabe0e5bbb7fe941b2a27f38cb509c799870570b2f1a7` | CLEAR: official Astral publisher and the exact Phase 22 tool version. |
| PostgreSQL gate | `postgres:17.10-bookworm` | `sha256:4f736ae292687621d4dbe0d499ffd024a36bd2ee7d8ca6f2ccd4c800f047b394` | Inherited Phase 22 pin | CLEAR: Docker Official Image already accepted by the real database gate. |

Astral's current release is uv 0.11.28, published 2026-07-07. Its official
distroless index digest is
`sha256:0f36cb9361a3346885ca3677e3767016687b5a170c1a6b88465ec14aefec90aa`.
Phase 23 should retain uv 0.10.9 so the production build uses the same tool that
created and accepted the current lock. A toolchain upgrade can receive its own
lock reproduction gate after this milestone.

Uvicorn 0.51.0 is present in `uv.lock` and `requirements.txt`; the official
PyPI record points to the Uvicorn project and requires Python 3.10 or newer. It
was published on 2026-07-08. Phase 23 adds no Python package and must keep
`uv lock --check` plus an exact runtime export diff at every gate.

The public repository has no explicit license file. OCI metadata should omit
`org.opencontainers.image.licenses` until the repository records a license.

### GitHub Actions Supply Chain

GitHub recommends pinning actions to full commit SHAs. The following releases
and refs were read from the official repositories on 2026-07-15:

| Action | Current release | Full commit SHA |
|--------|-----------------|-----------------|
| `actions/checkout` | v7.0.0 | `9c091bb21b7c1c1d1991bb908d89e4e9dddfe3e0` |
| `astral-sh/setup-uv` | v8.3.2 | `11f9893b081a58869d3b5fccaea48c9e9e46f990` |
| `docker/login-action` | v4.4.0 | `af1e73f918a031802d376d3c8bbc3fe56130a9b0` |
| `docker/setup-buildx-action` | v4.2.0 | `bb05f3f5519dd87d3ba754cc423b652a5edd6d2c` |
| `docker/metadata-action` | v6.2.0 | `dc802804100637a589fabce1cb79ff13a1411302` |
| `docker/build-push-action` | v7.3.0 | `53b7df96c91f9c12dcc8a07bcb9ccacbed38856a` |

The workflow should use these SHAs with release comments. This repository does
not require SHA pins at the settings layer, so the workflow itself owns this
control.

## Recommended Container Architecture

### Build Stage

Use a multi-stage Dockerfile with BuildKit syntax:

1. Copy `/uv` and `/uvx` from the pinned official uv distroless image.
2. Build from the pinned Python 3.12.13 slim-bookworm index.
3. Set `UV_PYTHON_DOWNLOADS=0`, `UV_COMPILE_BYTECODE=1`, and
   `UV_LINK_MODE=copy`.
4. Copy `pyproject.toml` and `uv.lock` first, then run
   `uv sync --locked --no-dev --no-install-project` with a cache mount.
5. Copy only the runtime source, Alembic configuration, and migrations.
6. Run the final locked sync and compile the application bytecode.
7. Copy `.venv` and the required runtime files into a fresh image created from
   the same Python base digest.

Add `.venv`, `.git`, local evidence, caches, and test output to `.dockerignore`.
Keep `pyproject.toml`, `uv.lock`, and `requirements.txt` in the public source
tree for each protected source stage.

### Runtime Stage

The runtime should have these properties:

- numeric user and group `10001:10001`;
- `WORKDIR /app`;
- `.venv/bin` first on `PATH`;
- `PYTHONDONTWRITEBYTECODE=1` and `PYTHONUNBUFFERED=1`;
- build arguments copied to `APP_REVISION` and `APP_VERSION`;
- exposed container port 8000;
- direct exec-form command:
  `uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 1 --log-level info --no-use-colors`.

The explicit worker count prevents an external `WEB_CONCURRENCY` value from
changing the process model. Uvicorn documents a default of one worker and
enables access logging unless `--no-access-log` is supplied. Each container
therefore has one Uvicorn server process, while Kubernetes owns replication.

The application lifespan should write one structured startup line through the
`uvicorn.error` logger with `APP_VERSION` and `APP_REVISION`. Retain Uvicorn's
startup, shutdown, and access logs on stdout/stderr. A live Pod proves the model
through `/proc/1/cmdline`, one `Started server process [1]` line, the custom
revision line, and the Pod's `status.containerStatuses[].imageID`.

### OCI Metadata

Pass the metadata action outputs to the build action as labels and annotations.
The minimum accepted set is:

- `org.opencontainers.image.title`;
- `org.opencontainers.image.description`;
- `org.opencontainers.image.url`;
- `org.opencontainers.image.source`;
- `org.opencontainers.image.version`;
- `org.opencontainers.image.created`;
- `org.opencontainers.image.revision`.

The source label should equal
`https://github.com/yangchuansheng/sealos-fastapi-tutorial`. GitHub uses this
label to connect a container package to its repository. OCI defines these keys
for manifests, indexes, and descriptors; GHCR reads the source, description,
and license keys on package pages.

## GitHub Actions and GHCR Route

### Test Job

Run a serialized test job on `ubuntu-latest` before publication:

1. Check out the exact event commit with the pinned checkout action.
2. Install uv 0.10.9 through the pinned setup action.
3. Install/select Python 3.12.13.
4. Start the pinned PostgreSQL 17.10 service with a health command.
5. Run `uv sync --locked`, `uv lock --check`, and the runtime export diff.
6. Run `alembic upgrade head` twice and `alembic current`.
7. Run the complete public HTTP and static deployment suite against the real
   PostgreSQL service.

The live Sealos harness remains the end-to-end production gate. CI supplies a
fast clean-room source and database gate before spending registry and cluster
time.

### Publish Job

The publish job should depend on the test job and run for accepted pushes to
`main`. A workflow dispatch route can replay a selected source commit under
maintainer control. Use:

- `permissions: contents: read, packages: write`;
- registry `ghcr.io`;
- username `${{ github.actor }}`;
- password `${{ secrets.GITHUB_TOKEN }}`;
- one `linux/amd64` Buildx output;
- GitHub Actions build cache;
- full source-SHA tag `sha-<40 hex characters>`;
- convenience tag `main` for discovery;
- OCI labels/annotations from the metadata action;
- build argument `APP_REVISION=${{ github.sha }}`;
- build argument `APP_VERSION=stage-3-production`.

Record `docker/build-push-action`'s `digest` output in the workflow summary.
The SHA tag identifies source; the digest identifies immutable bytes. Every
Kubernetes Job and Deployment must use
`ghcr.io/yangchuansheng/sealos-fastapi-tutorial@sha256:<digest>` after tag
resolution.

### Package Visibility Gate

The Container registry supports granular permissions. GitHub documents that a
package created by a workflow using `GITHUB_TOKEN` inherits the workflow
repository's visibility and permissions model. This repository is public, and
the source OCI label links the package to it.

After the first publication, require all of these readbacks:

1. Authenticated package API reports `visibility: public`.
2. Package source links to the FastAPI repository.
3. An unauthenticated `crane digest
   ghcr.io/yangchuansheng/sealos-fastapi-tutorial:sha-<commit>` succeeds.
4. `crane config` returns the expected OCI revision, source, title, and version.
5. The resolved digest equals the build action output.

Public GHCR container packages support anonymous pulls. This allows Sealos to
run the tutorial image without an image pull Secret.

## Kubernetes Production Contract

### Deployment

Use a run-scoped Deployment and Service owned by the same exact run label as
the PostgreSQL and migration resources. The production Deployment should set:

- two replicas after the migration Job completes;
- `RollingUpdate` with `maxUnavailable: 0` and `maxSurge: 1`;
- `revisionHistoryLimit: 3`;
- `progressDeadlineSeconds: 180`;
- named container port `http` on 8000;
- `automountServiceAccountToken: false`;
- CPU/memory requests and limits;
- `DATABASE_URL` from the owned Secret;
- an exact image digest and `imagePullPolicy: IfNotPresent`.

The Pod security context should set `runAsNonRoot: true`, `runAsUser: 10001`,
`runAsGroup: 10001`, and `seccompProfile.type: RuntimeDefault`. The container
security context should set `allowPrivilegeEscalation: false`,
`readOnlyRootFilesystem: true`, and `capabilities.drop: ["ALL"]`. Mount one
size-limited `emptyDir` at `/tmp` for libraries that require temporary storage.

These values satisfy the restricted-policy controls currently emitted as
namespace warnings. Kubernetes Restricted requires non-root execution,
disables privilege escalation, requires a seccomp profile, and drops all Linux
capabilities. A read-only root filesystem adds the requested runtime hardening.

### Readiness

Use an HTTP readiness probe on `/health` port `http`, with a short initial
delay, a two-second timeout, and bounded repeated failures. The existing health
implementation includes a one-second database connection timeout and checks
the `tasks` schema.

Keep database readiness separate from process liveness. A PostgreSQL outage
should remove Pods from Service endpoints while retaining their processes for
recovery and diagnosis. Adding a database-coupled liveness probe would create
restart churn during an external dependency outage.

Kubernetes keeps an unready Pod out of Service traffic for the full lifecycle
of the readiness probe. This directly enforces the inherited migration-before-
readiness contract.

### Migration Ordering

For each image candidate:

1. Resolve the full-SHA tag to a digest.
2. Recreate the one-shot migration Job with that exact digest.
3. Wait for `Complete` and verify Alembic revision `0001`.
4. Update the Deployment to the same digest.
5. Wait for rollout completion and two available replicas.
6. Verify `/health`, `/docs`, and persistent CRUD through the Service.

The Phase 22 source migration adapter has completed its purpose. Phase 23 must
run the production Job from the published application image.

## Two-Image Rollback Strategy

Use two consecutive commits after the production workflow and Dockerfile exist:

- **Image A - known good:** first complete production-container commit,
  published as `sha-<commit-a>` and resolved to digest A.
- **Image B - final candidate:** final accepted production-stage commit,
  published as `sha-<commit-b>` and resolved to digest B.

Both images retain schema revision `0001`, so the rollback has a compatible
database contract.

Execute this sequence against one owned PostgreSQL database:

1. Migrate and deploy digest A; wait for two ready replicas; create a task.
2. Migrate and deploy digest B; wait for two ready replicas; read and update the
   task; capture revision B logs and image IDs.
3. Run `kubectl rollout undo` to restore the previous Pod template; wait for
   completion; assert the Deployment image is digest A; read the same task and
   capture revision A logs.
4. Set the image explicitly back to digest B; wait for completion; assert two
   ready replicas; read the updated task and capture revision B logs.
5. Record Deployment rollout history, ReplicaSet revisions, digest values,
   readiness, HTTP results, process identity, security context, and cleanup.

`revisionHistoryLimit: 3` retains enough ReplicaSets for this proof. Kubernetes
documents `kubectl rollout undo` and warns that a history limit of zero removes
rollback capability. Digest references ensure every recreated Pod runs the
same image bytes even when convenience tags move.

## TDD and Validation Shape

Phase 23 stays inside the confirmed migration/runtime public seam:

- Begin with a focused failing contract for the absent production container,
  workflow, and hardened Deployment requirements.
- Add the smallest Dockerfile, workflow, manifest, and startup identity needed
  to satisfy that contract.
- Preserve the complete public HTTP suite as the image behavior gate.
- Exercise PostgreSQL, GHCR, Kubernetes, Uvicorn, readiness, and rollback with
  real collaborators in the phase gate.
- Keep static tests limited to deterministic file contracts; live evidence
  proves process identity, non-root execution, read-only filesystem, public
  image pulling, migration completion, two ready replicas, and rollback.

Suggested acceptance commands and observations:

- `uv lock --check` and exact `uv export` diff;
- complete pytest suite against real PostgreSQL;
- workflow conclusion `success` for image A and image B;
- anonymous `crane digest` and OCI config inspection;
- strict server-side manifest validation;
- production migration Job `Complete` at `0001`;
- Deployment `Available=True` with 2/2 replicas;
- `/proc/1/cmdline`, revision logs, and Pod `imageID` evidence;
- public HTTP create/read/update across A, B, rollback A, and recovery B;
- exact-label zero inventory and stopped local tunnels.

## Publication and Source Identity

After the final production gate passes:

1. Keep `stage-1-deploy` and `stage-2-postgresql` unchanged.
2. Publish final accepted source on `main`.
3. Create protected annotated `stage-3-production` with the approved message.
4. Verify direct and peeled refs, tag object type, active tag ruleset, and exact
   equality between peeled Stage 3 and public main.
5. Clone each source tag and verify its own `uv.lock` plus exported
   `requirements.txt`.
6. Clone Stage 3 from public HTTPS, run the real PostgreSQL suite, resolve its
   full-SHA image tag, and verify OCI revision equality.

The source tag is the immutable reader snapshot. The image digest is the
immutable runtime snapshot. Retain their explicit mapping in Phase 23 evidence.

## Evidence and Cleanup

Retain credential-free evidence for:

- action release/SHA audit and successful workflow URLs;
- source commit to full-SHA tag to digest mapping for images A and B;
- package visibility, anonymous pull, OCI labels, and image config;
- migration completion and Alembic revision;
- Deployment security context, readiness, replicas, rollout history, and Pod
  image IDs;
- revision-tagged Uvicorn logs and PID 1 command;
- HTTP persistence through upgrade, rollback, and recovery;
- tag/ruleset/public-clone verification;
- exact resource cleanup inventory.

Apply unique Phase 23 run labels to every temporary Deployment, Pod, Service,
Job, Secret, ConfigMap, and PostgreSQL object. Cleanup removes only that exact
run, terminates every port-forward, and proves zero owned resources. GHCR
images, protected source tags, public source, and redacted evidence remain.

## Risks and Guardrails

| Risk | Guardrail |
|------|-----------|
| Base tags can be rebuilt | Pin Python and uv index digests in the Dockerfile and record the selected platform manifest. |
| GHCR tags can move | Resolve tags once and deploy `name@sha256:digest`; retain both digest mappings. |
| First package publication has unverified visibility | Require authenticated visibility readback and anonymous `crane digest` before any Sealos deployment. |
| Local Docker daemon is unavailable | Use GitHub Actions as the builder and Sealos as the real runtime; inspect registry config and runtime identity. |
| Local virtualenv uses Python 3.12.12 | Select Python 3.12.13 explicitly in CI and the pinned container base. |
| uv latest has advanced to 0.11.28 | Pin accepted uv 0.10.9 for this stage and prove lock/export reproduction. |
| Action release tags can move | Use the verified full commit SHAs with release comments. |
| kubectl 1.35 exceeds supported skew against API server 1.33 | Use a 1.33/1.34 client for retained acceptance or limit commands to stable APIs and retain the warning. |
| Read-only root exposes hidden writes | Compile bytecode in the builder, set `PYTHONDONTWRITEBYTECODE`, mount bounded `/tmp`, and execute live writes/reads. |
| Database-coupled liveness creates restart churn | Use `/health` for readiness and keep liveness outside this phase. |
| Rollback crosses a destructive migration | Keep both Phase 23 images on Alembic `0001`; future schema changes require expand/contract migration design. |
| Multi-process settings can drift through environment | Pass `--workers 1` explicitly and verify PID 1 plus one server-process log per Pod. |
| Broad cleanup can affect user workloads | Use unique exact labels and compare pre/post owned inventories only. |

## Explicit Deferrals

- Phase 24 creates and behavior-tests the Django Task Board deploy stage.
- Phase 25 proves the shared FastAPI/Django fresh-migration runtime requirement
  and implements Django PostgreSQL behavior.
- Phase 26 owns Django Gunicorn, WhiteNoise, static collection, image
  hardening, and Django rollback evidence.
- Phase 27 owns Sealos Skills analysis/template output, public Ingress/domain
  practice, tutorial prose, measured duration claims, the six pages, and all 24
  screenshots. Production-page screenshots will use the Phase 23 digest,
  readiness, log, and rollback evidence.
- Phase 28 owns catalog promotion, 15-page validator coverage, static HTTP image
  checks, and the milestone-wide final resource cleanup audit. Phase 23 still
  performs immediate exact cleanup of its own run.

## Official Primary Sources

- Python Docker Official Image:
  `https://hub.docker.com/_/python`.
- uv Docker integration and reproducible pinning:
  `https://docs.astral.sh/uv/guides/integration/docker/`.
- uv official releases:
  `https://github.com/astral-sh/uv/releases/tag/0.11.28`.
- Uvicorn deployment and settings:
  `https://www.uvicorn.org/deployment/`,
  `https://www.uvicorn.org/settings/`.
- GitHub Docker publication workflow:
  `https://docs.github.com/en/actions/tutorials/publish-packages/publish-docker-images`.
- GitHub Packages workflow permissions:
  `https://docs.github.com/en/packages/managing-github-packages-using-github-actions-workflows/publishing-and-installing-a-package-with-github-actions`.
- GHCR operation, labels, and repository connection:
  `https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry`,
  `https://docs.github.com/en/packages/learn-github-packages/connecting-a-repository-to-a-package`.
- GitHub package visibility and anonymous public pulls:
  `https://docs.github.com/en/packages/learn-github-packages/configuring-a-packages-access-control-and-visibility`,
  `https://docs.github.com/en/packages/learn-github-packages/about-permissions-for-github-packages`.
- OCI annotations:
  `https://github.com/opencontainers/image-spec/blob/main/annotations.md`.
- Official action releases:
  `https://github.com/actions/checkout/releases/tag/v7.0.0`,
  `https://github.com/astral-sh/setup-uv/releases/tag/v8.3.2`,
  `https://github.com/docker/login-action/releases/tag/v4.4.0`,
  `https://github.com/docker/setup-buildx-action/releases/tag/v4.2.0`,
  `https://github.com/docker/metadata-action/releases/tag/v6.2.0`,
  `https://github.com/docker/build-push-action/releases/tag/v7.3.0`.
- Kubernetes Pod Security Standards and security context:
  `https://kubernetes.io/docs/concepts/security/pod-security-standards/`,
  `https://kubernetes.io/docs/tasks/configure-pod-container/security-context/`.
- Kubernetes readiness probes, Deployments, rollback, and image digests:
  `https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/`,
  `https://kubernetes.io/docs/concepts/workloads/controllers/deployment/`,
  `https://kubernetes.io/docs/concepts/containers/images/`.
- Kubernetes kubectl skew policy:
  `https://kubernetes.io/releases/version-skew-policy/#kubectl`.

## Metadata

Registry digests, current release versions, and Action SHAs are time-sensitive
and were verified on 2026-07-15. Re-resolve them immediately before execution.
Architecture and acceptance guidance remain valid while the Phase 22 contracts
and Phase 23 roadmap requirements remain unchanged.
