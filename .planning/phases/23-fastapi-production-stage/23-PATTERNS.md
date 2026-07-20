# Phase 23: FastAPI Production Stage - Pattern Map

**Mapped:** 2026-07-15
**Implementation repository:** `/Users/longnv/bin/repo/sealos-fastapi-tutorial`
**Orchestration repository:** `/Users/longnv/.codex/worktrees/19b8/sealos.io`
**Scope:** Static production contracts, GHCR publication, live Sealos rollout,
rollback, source publication, evidence, and cleanup

## Boundary Summary

Phase 23 keeps implementation and immutable source history in the public
FastAPI Reference Application. Sealos.io owns plans, dynamic release evidence,
summaries, and independent verification. This split avoids a source-SHA cycle:
the final source commit can produce an image digest, while the digest and live
runtime results are retained after that source commit has been frozen.

The accepted Stage 2 tree at `2b256b3dfc2a7d2a4b930c9970becca8c6da8cd3`
is the Phase 23 base. Its public behavior, schema revision `0001`, locked
dependency graph, and protected Stage 1/2 identities remain unchanged.

## Exact File Classification

### Reference Application

| File | Change | Role | Closest pattern | Match |
|------|--------|------|-----------------|-------|
| `Dockerfile` | add | locked multi-stage Python image and one-process runtime | Vocabloom `Dockerfile.api` | strong role match |
| `.dockerignore` | add | minimal, secret-resistant build context | Docker build-context contract | phase-owned |
| `.github/workflows/publish-image.yml` | add | build and publish full-SHA GHCR tags; expose digest | Sealos.io `build-image.yml` | workflow shape only |
| `app/main.py` | modify | deterministic startup release log | existing FastAPI lifespan | exact extension point |
| `tests/test_production.py` | add | static container, workflow, release-log, and manifest contracts | `tests/test_migration_job.py` | exact testing style |
| `deploy/application.yaml` | add | parameterized two-replica Deployment and Service | token-board Sealos workload | strong role match |
| `deploy/migration-job.yaml` | modify | parameterized app-image migration Job with hardened runtime | existing Stage 2 Job | exact evolution |
| `tests/test_migration_job.py` | modify | expected production Job contract | existing exact-text test | exact evolution |
| `scripts/test-production.sh` | add | registry, migration, rollout, rollback, recovery, evidence, cleanup | `scripts/test-postgres.sh` | strong lifecycle match |
| `README.md` | modify | immutable image, deploy, verify, rollback, and stage lifecycle | Stage 2 README | exact documentation pattern |

Keep `pyproject.toml`, `uv.lock`, `requirements.txt`, Alembic files, database
modules, API tests, and `deploy/source-migration-job.yaml` unchanged unless a
verified production failure requires a narrow correction. Every image and
fresh-clone gate must still check the lock and runtime export.

### Planning and Evidence

| File | Change | Role |
|------|--------|------|
| `23-CONTEXT.md` | existing | locked Phase 23 decisions |
| `23-RESEARCH.md` | add separately | primary-source image, Action, registry, and Kubernetes facts |
| `23-PATTERNS.md` | add | implementation map and plan boundaries |
| `23-VALIDATION.md` | existing | TDD and external acceptance architecture |
| `23-0X-PLAN.md` | add during planning | executable cross-repository plans |
| `23-0X-SUMMARY.md` | add after each plan | commits, runtime results, deviations, and handoff |
| `evidence/workflow.txt` | add after publication | baseline/final workflow run and source identities |
| `evidence/images.txt` | add after publication | public tags, digests, architecture, and OCI labels |
| `evidence/migration.txt` | add after live gate | app-image Job completion and revision `0001` |
| `evidence/runtime.txt` | add after live gate | image IDs, UID/GID, process count, ports, and filesystem probes |
| `evidence/logs.txt` | add after live gate | redacted source/image startup log lines |
| `evidence/http.jsonl` | add after live gate | health, docs, CRUD, and persisted reads |
| `evidence/rollback.txt` | add after live gate | final to baseline to final rollout identity |
| `evidence/cleanup.txt` | add last | zero exact-label inventory and stopped owned processes |
| `evidence/checksums.txt` | add last | SHA-256 manifest over reviewed evidence |
| `23-VERIFICATION.md` | add after execution | independent FAST-03/FAST-04 verification |

Dynamic evidence belongs in the Phase 23 planning directory. The public
Reference Application remains frozen while GitHub, GHCR, and Kubernetes facts
are captured after image publication.

## Reusable Implementation Patterns

### Locked Multi-Stage Python Image

**Analog:** Vocabloom `Dockerfile.api`

The Vocabloom image establishes the useful base pattern:

- an official Python 3.12 slim-bookworm builder and runtime;
- a pinned uv installation in the builder;
- `uv sync --frozen --no-dev` from `pyproject.toml` and `uv.lock`;
- a copied virtual environment in the runtime image;
- `PYTHONDONTWRITEBYTECODE=1`, `PYTHONUNBUFFERED=1`, and virtualenv `PATH`;
- a fixed non-root user, port 8000, and exec-form Uvicorn command.

Phase 23 strengthens this pattern by pinning the official base by digest,
using UID/GID 10001, copying only runtime inputs, and baking the source commit
into both an OCI revision label and an application release environment value.
The final command remains one exec-form Uvicorn process:

```dockerfile
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

The builder needs `pyproject.toml` and `uv.lock`. The runtime needs `.venv/`,
`app/`, `alembic.ini`, and `migrations/`. The migration Job therefore reuses
the same image without installing dependencies at runtime.

### Minimal Build Context

`.dockerignore` should exclude at least:

```text
.git
.github
.pytest_cache
.python-version
.venv
__pycache__
deploy
evidence
scripts
tests
README.md
*.pyc
```

The Dockerfile must use allowlisted `COPY` instructions rather than `COPY . .`.
This gives static tests two independent protections: excluded development and
evidence files, plus an explicit runtime file set.

### Deterministic Release Log

`app/main.py` already owns the application lifespan and logger. Extend that
lifespan with one startup record before `yield` and preserve disposal in the
existing `finally` block. The record should have stable keys such as:

```text
event=service_start source_release=<40-char-sha> image_reference=<name@sha256:digest>
```

The source release is baked into the image. The expected image reference is
supplied by the rendered Deployment. A focused TestClient/caplog behavior in
`tests/test_production.py` can prove the stable log without replacing FastAPI,
Uvicorn, or the application lifespan. Runtime acceptance then correlates that
record with Deployment image, Pod `imageID`, and GHCR digest.

### Static Production Contract Tests

`tests/test_migration_job.py` proves the repository convention: use `pathlib`
and exact public-file assertions, keep tests free of kubectl, subprocesses, and
recursive harness calls. `tests/test_production.py` should follow the same
style and cover two TDD tracers:

1. Dockerfile, `.dockerignore`, workflow, non-root identity, single Uvicorn
   command, port 8000, lock inputs, OCI revision, and release startup log.
2. `deploy/application.yaml`, two replicas, digest token, database Secret,
   rolling update, readiness `/health`, resources, bounded `/tmp`, read-only
   root, UID/GID 10001, dropped capabilities, seccomp, and Service port 8000.

Use explicit assertion messages for the first absent artifact so the retained
RED signature remains deterministic. Keep manifest tests static; the shell
harness owns real Kubernetes behavior.

### GitHub Actions and GHCR Identity

Sealos.io `.github/workflows/build-image.yml` supplies the basic sequence:
checkout, Buildx, GHCR login, metadata, build/push, and a downstream image
consumer. Its date tag, branch tag, `latest`, moving Action versions, and tag-
based Kubernetes update are unsuitable for the locked Reference Application
contract.

`publish-image.yml` should retain the sequence while applying these Phase 23
constraints:

- trusted Actions pinned by full commit SHA;
- `contents: read` and `packages: write` only;
- `linux/amd64` publication from the exact checked-out commit;
- image tag `sha-${{ github.sha }}` with all 40 commit characters;
- no `latest`, branch, or floating version tag;
- OCI source URL and revision labels;
- `docker/build-push-action` digest exposed as a job output and written to the
  workflow summary;
- build arguments pass the exact source commit to the image;
- bounded concurrency keyed by source ref.

The workflow is a publisher, not a cluster deployer. The live harness consumes
the public `name@sha256:...` output after GitHub and GHCR readback. This keeps
registry publication and authenticated namespace mutation as separate gates.

### Parameterized Deployment and Service

The token-board Sealos template provides the strongest local workload analog:

- `revisionHistoryLimit: 1`;
- `automountServiceAccountToken: false`;
- Pod-level non-root identity and `RuntimeDefault` seccomp;
- container-level `allowPrivilegeEscalation: false` and `drop: [ALL]`;
- named port, bounded requests/limits, and HTTP probes;
- a Service whose selector and target port match the workload.

`deploy/application.yaml` should use a small, allowlisted token vocabulary:

```text
__RUN_ID__
__APP_NAME__
__IMAGE_REFERENCE__
__SOURCE_RELEASE__
__SECRET_NAME__
```

Render these into a temporary file and fail when any `__[A-Z0-9_]+__` token
remains. The committed Deployment contract should include:

- two replicas;
- `RollingUpdate` with `maxUnavailable: 0` and bounded `maxSurge`;
- digest-only `__IMAGE_REFERENCE__`;
- matching release environment values;
- `DATABASE_URL` from Secret key `url`;
- readiness on `/health` and named port `http` at 8000;
- fixed UID/GID 10001 and a read-only root filesystem;
- a size-limited ephemeral `/tmp` volume required by the locked live policy;
- CPU/memory requests and limits selected from live namespace evidence;
- run identity on Deployment, Pod template, and Service.

The raw live-validation manifest may use a size-limited `emptyDir` for `/tmp`.
Phase 27 owns conversion into the current Sealos template surface and its
template-specific storage rules.

### Production Migration Job

Evolve `deploy/migration-job.yaml` in place. Preserve `batch/v1`,
`backoffLimit: 1`, `activeDeadlineSeconds: 300`, `restartPolicy: Never`,
`workingDir: /app`, `alembic upgrade head`, and Secret key `url`. Replace the
Stage 2 image tag and fixed resource identity with the same render tokens used
by the application contract. Add the production Pod/container security fields,
`automountServiceAccountToken: false`, and the bounded `/tmp` mount when the
read-only filesystem requires it.

Run this Job with the final digest before creating or accepting the two-replica
Deployment. The baseline and final images both use Alembic revision `0001`, so
rollback changes only the image and release tuple.

### Live Production Harness

`scripts/test-postgres.sh` already supplies the durable lifecycle mechanics:

- authenticated context and namespace preflight;
- one generated `tutorial.sealos.io/run-id` label;
- an exact-prefix ownership assertion;
- generated Secret data with no credential output;
- PostgreSQL 17 by immutable digest;
- bounded rollout, readiness, and port-forward waits;
- mode-0600 state files and PID identity checks;
- EXIT-trap deletion by one exact run label;
- credential scans followed by checksum generation.

`scripts/test-production.sh` should call the existing session modes rather than
reimplement PostgreSQL. Read the generated run ID and Secret name from the
0600 state file, use resource names under
`tutorial-fastapi-pg-test-${RUN_ID}-*`, and add application lifecycle steps:

1. Resolve and verify baseline/final public GHCR tags and digests.
2. Render and strictly server-validate Job, Deployment, and Service.
3. Run the final-image migration Job to `Complete` at revision `0001`.
4. Roll out two final Pods and port-forward the owned Service.
5. Verify `/health`, `/docs`, CRUD, Pod image IDs, UID/GID, one Uvicorn process,
   port 8000, read-only root, writable bounded `/tmp`, and startup logs.
6. Patch image plus source release to the baseline digest and repeat checks.
7. Patch back to the final digest and repeat the full acceptance check.
8. Delete and audit Deployment, ReplicaSet, Pod, Service, Job, Secret,
   ConfigMap, state files, rendered files, port-forwards, and clone directories.

Explicitly restore by immutable digest. `revisionHistoryLimit: 1` remains
compatible because recovery does not depend on ReplicaSet history.

### Evidence and Cleanup

Carry forward the Phase 22 evidence writer shape: curated fields, no raw command
logs, a credential-pattern scan, `cleanup.txt` written after the final exact
inventory, and `checksums.txt` generated last. Extend the cleanup inventory to
ReplicaSets and every application port-forward.

The strongest retained fields are identifiers that can be independently read
back: workflow run ID, workflow source SHA, immutable tag, registry digest,
architecture, OCI revision, Job name/condition/revision, Deployment revision,
Pod image IDs, UID/GID, process count, readiness result, release-log tuple,
HTTP status/body, and exact-label zero inventory.

### Source Publication and Cross-Repository Commits

The Reference Application uses direct RED/GREEN adjacency and scoped English
subjects:

```text
test(23-01): specify hardened FastAPI container contract
feat(23-01): add hardened FastAPI production image
test(23-02): specify FastAPI production workload contract
feat(23-02): add FastAPI production workload contracts
docs(23-03): document immutable FastAPI production release
test(23-04): record FastAPI production replay
```

The first GREEN commit is the baseline image source. The completed production
tree is the final image source. Each is fast-forwarded to public `main` only
after its local gates pass, and each GHCR image is accepted by full-SHA tag plus
digest. Preserve Stage 1 and Stage 2 direct and peeled objects exactly. Create
the protected annotated `stage-3-production` tag with message
`FastAPI production stage` only after final image, live rollback/recovery, and
source checks pass.

Sealos.io commits only orchestration artifacts:

```text
docs(phase-23): add FastAPI production research
docs(phase-23): create FastAPI production plans
docs(23-01): record FastAPI production image execution
docs(23-02): record FastAPI workload execution
docs(23-03): record FastAPI rollback and publication
docs(phase-23): verify FastAPI production stage
```

Generic GSD history checks operate in Sealos.io. Phase acceptance must inspect
the external repository commits, GitHub Actions runs, GHCR package, Kubernetes
evidence, and public clone directly.

## Anti-Patterns

| Anti-pattern | Failure mode | Required replacement |
|--------------|--------------|----------------------|
| `COPY . .` in the image | tests, evidence, secrets, and repository metadata enter the context/image | explicit runtime `COPY` allowlist plus `.dockerignore` |
| install at container startup | every Pod resolves dependencies and readiness becomes network-dependent | locked builder environment copied into runtime |
| shell-form command or migration plus server in one command | signal handling and process-count contracts become ambiguous | one exec-form Uvicorn command; migrations in Job |
| root or image-default user | violates the production source contract | UID/GID 10001 in image and Pod policy |
| multiple Uvicorn workers | duplicates process management inside each replica | one process per container, two Kubernetes replicas |
| mutable `latest`, `main`, date, or short-SHA deployment input | image identity and rollback cannot be reproduced exactly | full-SHA tag for lookup and digest for deployment |
| workflow deploys directly after build | registry and namespace failures become one opaque gate | publisher workflow plus separately evidenced live harness |
| application rollout before Job completion | `/health` remains 503 and replicas churn before schema exists | final-image Job `Complete`, then Deployment rollout |
| `kubectl rollout undo` as sole rollback input | revision retention controls recovery identity | explicit baseline digest plus source release tuple |
| release identity inferred only from tag | Pod, registry, and source identity can drift | correlate Deployment image, Pod imageID, OCI revision, and startup log |
| raw logs retained as evidence | credentials and unrelated namespace data can leak | curated allowlisted fields and secret scan |
| broad namespace deletion | unrelated user resources can be removed | exact run label, prefix assertion, named PID/state ownership |
| runtime evidence committed into the image source after publication | final source SHA and image source SHA diverge | retain dynamic evidence under Phase 23 planning artifacts |
| moving Stage 1/2 tags during Stage 3 publication | earlier tutorials lose reproducibility | exact direct/peeled object readback before and after publication |

## Likely Plan Boundaries

### Plan 23-01: Production Image Baseline

- Add the first `tests/test_production.py` RED.
- Add Dockerfile, `.dockerignore`, pinned publisher workflow, and release log
  GREEN.
- Run inherited public behavior and real PostgreSQL gates.
- Fast-forward the baseline commit, publish its full-SHA tag, and retain its
  public digest and OCI identity in planning evidence.

### Plan 23-02: Workload Contracts and Harness

- Add the second static manifest RED.
- Add `deploy/application.yaml`, evolve the migration Job and its test, and add
  `scripts/test-production.sh` GREEN.
- Run static manifest, strict server dry-run, shell syntax, lock, and inherited
  gates.
- Leave the complete local workload source ready for the final reader and
  publication pass.

### Plan 23-03: Final Image, Live Rollback, and Recovery

- Update README with immutable build, deploy, verify, and rollback commands.
- Freeze the completed production tree, fast-forward public `main`, publish the
  final full-SHA image, and resolve its public digest.
- Provision owned PostgreSQL with the existing Phase 22 lifecycle.
- Run final-image migration, final rollout, baseline rollback, and final
  recovery with two replicas.
- Capture curated workflow/image/runtime/log/HTTP/rollback evidence.
- Prove exact Kubernetes, process, state, render, and clone cleanup.

### Plan 23-04: Protected Stage Publication

- Re-run the final source and public-image gates from a clean clone.
- Create protected annotated `stage-3-production` at the accepted public-main
  commit and verify all three source stages plus the tag ruleset.
- Finalize evidence checksums, plan summaries, and independent verification
  inputs.

## Planning Checklist

- Every implementation task names the Reference Application working directory.
- Every planning/evidence task names the Sealos.io working directory.
- TDD RED and GREEN commits are direct parent/child with exact file scopes.
- Action commit SHAs and Python base digest come from Phase 23 research.
- Baseline and final workflow runs match their exact source commits.
- Live images use `name@sha256:digest`, never a tag.
- Migration completes before two-replica readiness acceptance.
- Rollback and recovery update image and source-release values together.
- Evidence is curated and scanned before checksums.
- Cleanup covers ReplicaSets and all owned processes in addition to Phase 22
  object kinds.
- Stage 1/2 objects and tag ruleset remain unchanged.

---

*Phase: 23-fastapi-production-stage*
*Pattern mapping completed from Phase 22 artifacts, current repository source,
Sealos.io workflows, local Sealos deployment rules, Vocabloom, and token-board*
