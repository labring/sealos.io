# Phase 23: Validation Architecture

**Phase:** FastAPI Production Stage
**Requirements:** FAST-03, FAST-04
**Mode:** Task-level TDD plus real GitHub/GHCR/Kubernetes acceptance

## Validation Goal

Prove that the accepted FastAPI source produces a locked non-root image with
one Uvicorn process, that two replicas become ready only after the migration
Job, that release identity is visible in logs and registry metadata, that the
workload can roll back to a prior immutable digest and recover, and that all
three protected source stages remain reproducible.

## Public and External Seams

| Seam | Observable contract | Real collaborators |
|------|---------------------|--------------------|
| Source/container | Dockerfile, build context, lock/export, non-root command, OCI labels, release log | Python base image, uv, Uvicorn |
| Supply chain | Workflow source SHA produces one public immutable GHCR tag and digest | GitHub Actions, GHCR API |
| Runtime | Migration completes, two Pods become ready, health/docs/CRUD pass, logs identify release | PostgreSQL, Kubernetes, image registry, HTTP |
| Rollback | Final digest -> baseline digest -> final digest each reaches healthy ready state | Deployment controller, ReplicaSets, Pods |
| Publication | Stage 1/2 remain unchanged; Stage 3 and public main resolve to accepted source | Git, GitHub API, protected tag ruleset |

## TDD Tracer 1: Production Container and Release Identity

**RED commit:** `test(23-01): specify hardened FastAPI container contract`

- Add `tests/test_production.py` assertions for the absent Dockerfile,
  `.dockerignore`, workflow, fixed non-root identity, single-process command,
  port 8000, exact lock inputs, OCI source revision, and deterministic startup
  release log.
- Preflight Python imports and the accepted 24-case suite first.
- Expected RED exits with pytest status 1 and exact message
  `AssertionError: Dockerfile must exist`.
- RED changes only `tests/test_production.py`.

**GREEN commit:** `feat(23-01): add hardened FastAPI production image`

- Add the minimum Dockerfile, `.dockerignore`, pinned workflow, and startup log.
- GREEN is the direct child of RED and changes only production implementation
  files named by the plan.
- Run all static production tests, the inherited 24-case suite, lock/export
  checks, Dockerfile parser/build-context checks, and secret scans.
- Fast-forward this production-capable baseline commit to public main, run its
  workflow, and retain its immutable `sha-<commit>` tag and digest for rollback.

## TDD Tracer 2: Production Kubernetes Contract

**RED commit:** `test(23-02): specify FastAPI production workload contract`

- Extend the static production test for absent application Deployment and
  Service manifests.
- Assert two replicas, digest-only image placeholder, database Secret,
  readiness `/health`, rolling update policy, resources, read-only root,
  bounded `/tmp`, non-root UID/GID, dropped capabilities, seccomp, and port
  8000.
- Expected RED exits with pytest status 1 and exact message
  `AssertionError: deploy/application.yaml must exist`.
- RED changes only `tests/test_production.py` and directly follows the accepted
  baseline image source commit.

**GREEN commit:** `feat(23-02): add FastAPI production workload contracts`

- Add Deployment, Service, and production harness files.
- Pytest performs static parsing only. The shell harness owns kubectl, registry,
  process, HTTP, log, rollback, and cleanup execution.
- GREEN is the direct child of RED with exact manifest/harness scope.

## Quick Gates

Run after every source edit:

```bash
uv lock --check
uv export --locked --no-dev --no-emit-project --no-hashes \
  --format requirements.txt --output-file requirements.txt
git diff --exit-code -- requirements.txt
uv run pytest tests/test_production.py -q -x
bash -n scripts/test-production.sh
git diff --check
```

Target feedback time: under 15 seconds after the production test exists.

Run the accumulated public suite before every image-source commit:

```bash
./scripts/test-postgres.sh --phase-gate
```

Expected time: 5-8 minutes with one run-scoped real PostgreSQL service.

## GitHub Actions and GHCR Gate

For both baseline and final image commits:

1. Verify local clean commit and normal fast-forward relationship to remote
   main before push.
2. Push main without force and trigger or observe the repository workflow for
   that exact source SHA.
3. Require workflow conclusion `success`, expected workflow commit, pinned
   Action identities, and no unexpected artifacts.
4. Read GHCR package metadata; require public visibility, exact immutable
   `sha-<40>` tag, linux/amd64 manifest, source revision label, and digest.
5. Pull by digest in the live Kubernetes namespace. The mutable tag is never a
   deployment input.

Expected time per build: 3-12 minutes. Poll with bounded intervals and retain
workflow/run IDs plus public metadata only.

## Live Production Gate

Use one generated run ID and exact names in namespace `ns-let51wad`.

1. Provision one temporary PostgreSQL 17 Deployment, Service, and Secret with
   the accepted Phase 22 ownership model.
2. Strictly render and validate the migration Job, application Deployment, and
   Service with zero unresolved tokens.
3. Run the migration Job using the baseline image digest and wait for
   `Complete`.
4. Create the two-replica baseline Deployment and Service; wait for rollout,
   require both Pods Ready, and create one persistent task.
5. For each Pod, prove:
   - Pod `imageID` equals the expected registry digest.
   - Python reports UID/GID 10001.
   - exactly one `/proc/*/cmdline` contains the Uvicorn application command.
   - the root filesystem rejects a write probe and `/tmp` accepts/removes one.
   - `/health` returns 200 through an owned Pod port-forward.
   - logs contain the exact baked source release and expected image reference.
6. Through the Service, run `/docs` plus create/list/read/update/delete HTTP and
   verify database persistence across requests.

## Rollback and Recovery Gate

1. Run the migration Job with the final digest, patch the Deployment
   image/reference tuple from baseline to final, and wait for two Ready final
   Pods. Re-run every runtime check and update the retained baseline task.
2. Run `kubectl rollout undo` to restore the prior baseline Pod template. Wait
   for two Ready baseline Pods and re-run imageID, UID, process, filesystem,
   health, logs, and persisted task read checks.
3. Patch the tuple back to the final digest/release explicitly.
4. Wait for recovery; require two Ready final Pods and repeat every check.
5. Record the Deployment revision sequence, ReplicaSet image identities,
   rollout status, health results, and release log correlation.

The rollback gate uses forward-compatible schema revision `0001`; it does not
run a reverse migration.

## Evidence Contract

Retain under `.planning/phases/23-fastapi-production-stage/evidence/`:

- `workflow.txt` - baseline/final workflow IDs, source SHAs, conclusions.
- `images.txt` - immutable tags, registry digests, architecture, labels.
- `migration.txt` - Job identity, image digest, completion, revision.
- `runtime.txt` - Pods, imageIDs, UID/GID, process counts, filesystem probes.
- `logs.txt` - redacted release identity lines for final/baseline/recovered Pods.
- `http.jsonl` - public status/body evidence without credentials.
- `rollback.txt` - final -> baseline -> final rollout identities and readiness.
- `cleanup.txt` - exact run inventory and process termination.
- `checksums.txt` - SHA-256 of every reviewed evidence file.

Write curated fields directly. Scan for database URLs, passwords, Secret data,
GitHub tokens, bearer tokens, Kubernetes tokens, and private registry
credentials before checksum generation.

## Cleanup Gate

The EXIT trap and final verifier must query the exact run label across:

```text
Deployment, ReplicaSet, Pod, Service, Job, Secret, ConfigMap
```

Require zero matching objects, zero owned port-forward processes, no state
files, no rendered manifests, and no temporary clone directories. Retain only
the protected public source/tags, public GHCR package, and the two immutable
image tags/digests.

## Publication Gate

- Preserve Stage 1 direct `77e57a2...` and peeled `276aa00...` identities.
- Preserve Stage 2 direct `b61254c...` and peeled `2b256b3...` identities.
- Require one active ruleset targeting exactly `refs/tags/stage-*` with update
  and deletion rules and no bypass.
- Fast-forward public main to the accepted production source.
- Recover `stage-3-production` through the same four coherent local/remote
  states used in Phase 22; require annotated type, exact message, direct object,
  and peeled accepted commit.
- Fresh-clone the public tag, reproduce lock/export and all static/public tests,
  verify both immutable GHCR identities, and keep post-public evidence outside
  the immutable Reference Application tree.

## Cross-Repository Verification

Generic GSD artifact/history checks run in Sealos.io and will miss absolute
implementation paths plus GitHub/GHCR objects. The phase verifier must replace
those advisories with direct checks in
`/Users/longnv/bin/repo/sealos-fastapi-tutorial`, GitHub API readback, GHCR
metadata, retained Kubernetes evidence, and a fresh public clone.

## Phase Acceptance

- Every quick, accumulated, workflow, registry, live runtime, rollback,
  recovery, publication, fresh-clone, redaction, checksum, and cleanup gate
  passes.
- Both TDD pairs retain intended RED signatures, direct GREEN adjacency, and
  exact scopes.
- FAST-03 and FAST-04 remain pending until the independent phase verifier
  confirms every merged must-have.
