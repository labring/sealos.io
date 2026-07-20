# Phase 23: FastAPI Production Stage - Context

**Gathered:** 2026-07-15
**Status:** Ready for planning
**Source:** Confirmed milestone decisions plus verified Phase 22 source and runtime evidence

<domain>
## Phase Boundary

Evolve the public FastAPI Tasks API from the accepted PostgreSQL source into a
production container release. This phase ends when two immutable production
image digests exist, the final digest runs as a hardened two-replica Sealos
workload after the one-shot migration Job, rollback to the baseline digest and
recovery to the final digest both pass, and protected `stage-3-production`
resolves to public `main`.

</domain>

<decisions>
## Implementation Decisions

### Reproducible Production Image

- **D-01:** Use a multi-stage Dockerfile based on an official pinned Python
  3.12 slim-bookworm image. Verify the live digest through official registry
  metadata before committing it.
- Resolve the application environment from committed `pyproject.toml` and
  `uv.lock`; keep `requirements.txt` as the exact runtime compatibility export.
- Copy only the runtime virtual environment and required application, Alembic,
  migration, and deployment inputs into the runtime stage. Keep caches,
  development dependencies, tests, evidence, and repository metadata outside
  the image.

### Process and Container Security

- **D-02:** Run as fixed non-root UID/GID 10001, bind `0.0.0.0:8000`, and use
  one Uvicorn application process per container. Sealos replicas provide
  horizontal scaling.
- Validate a read-only root filesystem with a writable bounded `/tmp` volume,
  `allowPrivilegeEscalation: false`, all Linux capabilities dropped, and
  `RuntimeDefault` seccomp.
- The live gate must prove the runtime UID, process topology, listening port,
  filesystem policy, and absence of a second Uvicorn application process.

### Release Identity and Logs

- **D-03:** Add one deterministic startup log containing an immutable source
  release baked into the image and the expected image reference supplied by the
  Deployment. Keep the established `/health`, `/docs`, and Tasks API response
  bodies unchanged.
- Runtime evidence must correlate Deployment image digest, Pod image ID,
  release environment, and application startup log without exposing database
  credentials or Kubernetes Secret values.

### Image Build and Registry Identity

- **D-04:** Build and publish images through a repository-owned GitHub Actions
  workflow to public GHCR because Docker is unavailable on the local host.
- Pin trusted Actions by full commit SHA and grant the workflow only the
  permissions required for source checkout and package publication.
- Publish immutable `sha-<40-character-commit>` tags and record registry
  digests. Retain one production-capable baseline digest and one final digest;
  omit mutable `latest` and `main` image tags.
- Read back the first GHCR package visibility. If initial publication creates
  a private package, use the authenticated owner package API to make it public,
  then prove anonymous digest resolution before live Kubernetes acceptance.

### Production Deployment Contract

- **D-05:** Commit parameterized Kubernetes Deployment and Service contracts
  with two replicas, readiness on `/health`, bounded resources, rolling update
  settings, database Secret input, immutable image input, and the hardened Pod
  security context.
- Run the existing one-shot migration Job with each image digest and the same
  database Secret before accepting that image's first application rollout.
- Validate manifests strictly server-side before live creation.

### Rollback and Recovery

- **D-06:** Deploy the baseline digest after its migration Job, wait for two
  ready replicas, and create a persistent task. Run the final-image migration
  Job, update to the final image/reference tuple, and verify health, task
  persistence, release logs, runtime UID, process model, and Pod image IDs.
- Use `kubectl rollout undo` to restore the prior baseline Pod template, wait
  for completion, and repeat health, persistence, process, image, and log
  checks. Restore the final digest explicitly and repeat the full acceptance
  checks.
- Both images use the same accepted Alembic schema so rollback requires no
  reverse migration.

### Source and Stage Identity

- **D-07:** Preserve protected Stage 1 and Stage 2 direct and peeled identities.
  Publish the final production source as protected annotated
  `stage-3-production`, align public `main` with that commit, and verify a fresh
  public clone.
- Accept only coherent absent or exact-matching GitHub main/tag/package states.
  Use fast-forward pushes, immutable image tags, and the existing active
  `refs/tags/stage-*` update/deletion ruleset.

### TDD and Acceptance Boundaries

- **D-08:** Drive the production container contract and release-log behavior
  from a failing public/static production test before the minimum passing
  implementation. Drive the Kubernetes production manifest contract through a
  second failing static test before its implementation.
- Tests inspect public files, application startup behavior, and rendered
  deployment contracts. Live gates use the real image, PostgreSQL, Kubernetes,
  HTTP, process, log, and registry collaborators.
- Keep RED/GREEN subjects unique, direct parent/child, and exact in file scope.

### Evidence and Cleanup

- **D-09:** Retain redacted image, workflow, migration, rollout, security,
  process, log, HTTP, rollback, recovery, and cleanup evidence under the Phase
  23 planning directory. This keeps accepted image source immutable and avoids
  a source-SHA evidence cycle.
- Delete every temporary PostgreSQL Deployment/Pod/Service, application
  Deployment/ReplicaSet/Pod/Service, migration Job, Secret, ConfigMap,
  port-forward, and fresh-clone directory by exact run identity.
- Retain the public source repository, protected source tags, public GHCR
  package, baseline immutable image tag/digest, and final immutable image
  tag/digest as durable release artifacts.

### the agent's Discretion

- Choose current compatible patch releases and official Action commit SHAs
  after primary-source verification.
- Choose compact production test, workflow, manifest, and harness filenames.
- Choose CPU/memory requests and limits that fit the authenticated namespace.
- Choose a stable structured startup-log format and bounded rollout timeouts.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

- `.planning/ROADMAP.md` - Phase 23 goal and success criteria.
- `.planning/REQUIREMENTS.md` - FAST-03 and FAST-04 contracts.
- `.planning/phases/22-fastapi-postgresql-stage/22-VERIFICATION.md` - accepted
  database behavior, source identity, migration Job, and cleanup baseline.
- `.planning/quick/260715-e9k-define-fastapi-and-django-tutorial-expan/260715-e9k-CONTEXT.md`
  - milestone-wide runtime, source-stage, evidence, and cleanup decisions.
- `AGENTS.md` - repository execution, language, and GSD rules.
- `/Users/longnv/bin/repo/sealos-fastapi-tutorial` - public Reference
  Application implementation repository.

</canonical_refs>

<specifics>
## Specific Ideas

- Build the first immutable image immediately after the minimum production
  container contract passes. Build the second image from the final accepted
  source tree after workflow, manifests, harness, and README are complete.
- Parameterize live manifests with exact run ID, database Secret name, image
  digest, source release, and evidence directory; render into temporary files
  and require zero unresolved tokens.
- Query the GitHub Actions run and GHCR package directly for workflow SHA,
  source commit, image tag, and digest before cluster deployment.

</specifics>

<deferred>
## Deferred Ideas

- FastAPI tutorial prose, screenshots, Sealos Skills practice, custom domain,
  and five-minute measurement remain Phase 27 scope.
- Django application and container implementation remain Phases 24-26.
- Cross-framework catalog, static routes, and final cleanup audit remain Phase
  28 scope.

</deferred>

---

*Phase: 23-fastapi-production-stage*
*Context gathered: 2026-07-15 from confirmed decisions and Phase 22 evidence*
