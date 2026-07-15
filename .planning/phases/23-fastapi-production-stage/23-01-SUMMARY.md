---
phase: 23-fastapi-production-stage
plan: "01"
subsystem: container-supply-chain
tags: [fastapi, docker, github-actions, ghcr, uvicorn, reproducibility]

requires:
  - phase: 22-fastapi-postgresql-stage
    provides: Accepted SQLAlchemy/Alembic source, real PostgreSQL gate, and protected Stage 2 identity
provides:
  - Pinned multi-stage Python 3.12.13 image with uv 0.10.9, numeric UID/GID 10001, and one Uvicorn process
  - Exact-SHA GitHub Actions publisher with test-before-publish, immutable full-SHA tags, and public registry readback
  - Public baseline image digest mapped to the accepted public main source
  - Deterministic startup log correlating source release and expected image reference
affects: [23-02-production-workload, 23-03-live-rollback, 23-04-stage-publication, 27-practice-backed-tutorial-series]

tech-stack:
  added: [Docker Buildx, GitHub Actions, GitHub Container Registry]
  patterns: [allowlist multi-stage image, exact-SHA workflow dispatch, registry-digest authority, isolated anonymous readback]

key-files:
  created:
    - /Users/longnv/bin/repo/sealos-fastapi-tutorial/tests/test_production.py
    - /Users/longnv/bin/repo/sealos-fastapi-tutorial/Dockerfile
    - /Users/longnv/bin/repo/sealos-fastapi-tutorial/.dockerignore
    - /Users/longnv/bin/repo/sealos-fastapi-tutorial/.github/workflows/publish-image.yml
  modified:
    - /Users/longnv/bin/repo/sealos-fastapi-tutorial/app/main.py

key-decisions:
  - "Treat the digest read back from GHCR as the deployable image identity because local OCI export and registry manifest exporters produce different manifest layers."
  - "Accept the first-package anonymous 403 only when both exact registry error fragments are present and the authenticated package API independently returns 404."
  - "Preserve failed immutable image versions as execution evidence until Plan 23-04 deletes their exact package version IDs."

patterns-established:
  - "Release identity: one validated TARGET_SHA drives checkout, tests, image tag, source build argument, OCI revision, concurrency, logs, and workflow summary."
  - "Registry acceptance: every existing or newly published tag is read through a fresh empty 0700 Docker config and validated for digest, linux/amd64, OCI revision, and source."

requirements-completed: []

coverage:
  - id: D1
    description: "The accepted source defines a locked non-root single-process production image and stable startup identity log."
    requirement: FAST-03
    verification:
      - kind: integration
        ref: "tests/test_production.py plus PHASE22_EVIDENCE_DIR=<temporary> ./scripts/test-postgres.sh --phase-gate"
        status: pass
    human_judgment: false
  - id: D2
    description: "The repository-owned workflow tests exact source against PostgreSQL before publishing one full-SHA linux/amd64 image tag."
    requirement: FAST-03
    verification:
      - kind: e2e
        ref: "GitHub Actions run 29421655544"
        status: pass
    human_judgment: false
  - id: D3
    description: "Public GHCR resolves accepted main to an anonymous immutable digest with exact OCI revision/source and runtime identity."
    requirement: FAST-04
    verification:
      - kind: e2e
        ref: "anonymous crane digest/config/manifest for sha-1a5a66f3959f69ff66d85a9562acba738c82edb4"
        status: pass
    human_judgment: false
  - id: D4
    description: "Stage 1, Stage 2, ruleset 18970425, local source, cluster resources, and owned processes remain coherent and clean."
    requirement: FAST-04
    verification:
      - kind: other
        ref: "Git/GitHub ruleset readback plus exact-run Kubernetes and process inventory"
        status: pass
    human_judgment: false

duration: 64 min
completed: 2026-07-15
status: complete
---

# Phase 23 Plan 01: FastAPI Production Image Baseline Summary

**Public main now maps to a locked non-root FastAPI image, one successful exact-source publisher run, and an anonymous immutable GHCR digest**

## Performance

- **Duration:** 64 min
- **Started:** 2026-07-15T13:03:36Z
- **Completed:** 2026-07-15T14:07:12Z
- **Tasks:** 3
- **Implementation files modified:** 5

## Accomplishments

- Added a pinned multi-stage image from official Python 3.12.13 and uv 0.10.9 index digests, with allowlisted runtime copies, UID/GID 10001, port 8000, and one explicit Uvicorn worker.
- Added an exact-SHA publisher whose clean-room PostgreSQL job passes 27 tests before a linux/amd64 GHCR publication and validates the public registry result.
- Published accepted public main `1a5a66f3959f69ff66d85a9562acba738c82edb4` as `sha-1a5a66f3959f69ff66d85a9562acba738c82edb4`, resolving anonymously to `sha256:b11293cf8ebb0e73fbabfd33ef6e812d53cb8176ea2db853769aae3dfa273337`.
- Preserved protected Stage 1 and Stage 2 identities, ruleset `18970425`, and an empty Stage 3 state while leaving zero owned Kubernetes, process, state, render, and temporary evidence footprint.

## Accepted Release Identity

| Contract | Accepted value |
|----------|----------------|
| Public repository | `yangchuansheng/sealos-fastapi-tutorial` |
| Public main / baseline source | `1a5a66f3959f69ff66d85a9562acba738c82edb4` |
| Successful workflow | `29421655544` |
| Workflow URL | `https://github.com/yangchuansheng/sealos-fastapi-tutorial/actions/runs/29421655544` |
| Workflow event / attempt | `push` / `1` |
| Workflow head / normalized target | `1a5a66f3959f69ff66d85a9562acba738c82edb4` / `1a5a66f3959f69ff66d85a9562acba738c82edb4` |
| Workflow path / conclusion | `.github/workflows/publish-image.yml` / `success` |
| Full-SHA image tag | `ghcr.io/yangchuansheng/sealos-fastapi-tutorial:sha-1a5a66f3959f69ff66d85a9562acba738c82edb4` |
| Immutable image | `ghcr.io/yangchuansheng/sealos-fastapi-tutorial@sha256:b11293cf8ebb0e73fbabfd33ef6e812d53cb8176ea2db853769aae3dfa273337` |
| GHCR package version ID | `1033114568` |
| Package visibility / source | `public` / `yangchuansheng/sealos-fastapi-tutorial` |
| Platform / media type | `linux/amd64` / `application/vnd.docker.distribution.manifest.v2+json` |
| Runtime identity | `10001:10001`; `/app`; one exec-form Uvicorn command with `--workers 1` |
| OCI revision / source | Accepted source SHA / `https://github.com/yangchuansheng/sealos-fastapi-tutorial` |

The successful workflow log records `27 passed`, the exact normalized target,
and the same registry digest returned by the isolated anonymous
`crane digest`, `crane config`, and `crane manifest` acceptance gate.

## TDD History Proof

| Boundary | RED | GREEN | Proof |
|----------|-----|-------|-------|
| Production container and publisher | `06d694a8d1670a5b5f3af7f6561e42f4e17f234a` | `e39a509ee62fde7ce9893f7f27b040bd2357f870` | Direct parent/child; RED changes only `tests/test_production.py`; GREEN changes exactly Dockerfile, `.dockerignore`, workflow, and `app/main.py`. |

The retained RED exits with `AssertionError: Dockerfile must exist`. The GREEN
passes the focused three-case production suite, lock/export checks, and the
complete real PostgreSQL gate with 27 tests and two migration Jobs. Recovery
regressions were reproduced at the workflow or focused static seam before
their narrow fix commits.

## Task Commits

1. **Task 1: Specify the hardened image, publisher, and startup identity** - `06d694a` (`test`)
2. **Task 2: Add the minimum reproducible production image and publisher** - `e39a509` (`feat`)
3. **Task 3 recovery: Distinguish first-package GHCR absence** - `abd2469` (`fix`)
4. **Task 3 recovery: Use registry digest as publication authority** - `48c4442` (`fix`)
5. **Task 3 recovery: Correct Bash digest validation** - `1a5a66f` (`fix`)

## Files Created/Modified

- `tests/test_production.py` - Public/static container, workflow, anonymous registry, and startup-log contract.
- `Dockerfile` - Pinned locked multi-stage Python runtime with fixed non-root process identity.
- `.dockerignore` - Excludes VCS, tests, evidence, caches, development inputs, and local state from the build context.
- `.github/workflows/publish-image.yml` - Exact-source clean-room test, candidate build, immutable publication, and anonymous registry readback.
- `app/main.py` - Emits one stable source-release and expected-image-reference startup record before serving.

## Decisions Made

- Registry readback is the release digest authority. The OCI candidate export proves buildability, while the registry publisher can emit a different media type and therefore a different top-level digest.
- An existing tag is accepted only after its remote digest, linux/amd64 image config, OCI revision, and OCI source all match the requested source. A mismatch exits before login or tag association.
- The exact `failed to authorize` plus `403 Forbidden` first-package response is accepted only when the authenticated package API independently reports package absence with HTTP 404.
- Failed full-SHA versions remain immutable execution evidence through Plan 23-03. Plan 23-04 must delete package version `1033073401` (`sha-abd2469...`) and version `1033102122` (`sha-48c4442...`) by exact ID after final publication evidence is complete.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Enabled the inherited evidence writer during the PostgreSQL gate**
- **Found during:** Task 1 preflight
- **Issue:** The accepted Phase 22 harness returns status 1 from `evidence_append` when `PHASE22_EVIDENCE_DIR` is unset, causing `set -e` to stop after the first passing health test.
- **Fix:** Ran each inherited gate with a fresh temporary evidence directory and removed it after checksum and cleanup acceptance. The source harness remains unchanged so the planned RED keeps Stage 2 as its direct parent; Plan 23-02 owns the regression fix where the production harness is in scope.
- **Verification:** Runs `fa06bdd1e3a5` and `ce5722a89b77` passed all tests, Jobs, checksums, and exact cleanup.
- **Committed in:** No source commit; bounded execution workaround only.

**2. [Rule 1 - Bug] Distinguished an absent first GHCR package from protected existing states**
- **Found during:** Task 3, workflow run `29420227162`
- **Issue:** Anonymous GHCR lookup returned the exact absent-repository `failed to authorize` / `403 Forbidden` signature before any package existed.
- **Fix:** Require both error fragments plus an authenticated package API 404 before the first publish; every existing or ambiguous package state remains fail closed.
- **Files modified:** `.github/workflows/publish-image.yml`, `tests/test_production.py`
- **Verification:** Focused regression test and later workflow package creation passed.
- **Committed in:** `abd2469`

**3. [Rule 1 - Bug] Separated OCI candidate and registry manifest digest layers**
- **Found during:** Task 3, workflow run `29420761969`
- **Issue:** Candidate digest `sha256:a46dc0e...` described a local OCI export while published digest `sha256:9f94036e...` described the registry's Docker v2 single-platform manifest.
- **Fix:** Keep the candidate as buildability proof, use registry readback as the release identity, and validate existing plus newly published tags through isolated anonymous image-config checks.
- **Files modified:** `.github/workflows/publish-image.yml`, `tests/test_production.py`
- **Verification:** Anonymous readback proved exact digest, linux/amd64, OCI revision/source, UID/GID, and command for the accepted image.
- **Committed in:** `48c4442`

**4. [Rule 1 - Bug] Used Bash conditional syntax for digest regex validation**
- **Found during:** Task 3, workflow run `29421372013`
- **Issue:** `test VALUE =~ REGEX` exits 2 because `=~` belongs to Bash `[[ ... ]]` conditionals.
- **Fix:** Replace both digest checks with `[[ "$VALUE" =~ ^sha256:[0-9a-f]{64}$ ]]` and add positive plus negative static assertions.
- **Files modified:** `.github/workflows/publish-image.yml`, `tests/test_production.py`
- **Verification:** Focused regression gates and successful run `29421655544` passed.
- **Committed in:** `1a5a66f`

---

**Total deviations:** 4 auto-fixed issues (1 blocking harness workaround, 3 workflow bugs).
**Impact on plan:** The planned RED/GREEN pair remains direct and exact in scope. Recovery added fail-closed publication checks and retained immutable failure evidence without overwriting any tag.

## Failed Workflow Evidence

| Run | Source | Outcome | Durable state |
|-----|--------|---------|---------------|
| `29420227162` | `e39a509...` | Failed at first anonymous GHCR absence classification after prepare/test passed | No image tag; candidate `sha256:ee518a29...` only |
| `29420761969` | `abd2469...` | Published successfully, then failed the cross-exporter digest equality assertion | Version `1033073401`, digest `sha256:9f94036e...`, retained for exact Plan 23-04 deletion |
| `29421372013` | `48c4442...` | Published successfully, then failed before readback on Bash regex syntax | Version `1033102122`, digest `sha256:4746411c...`, retained for exact Plan 23-04 deletion |

No failed tag was overwritten or moved. Every durable tag uses one complete
40-character source SHA. The package currently has three full-SHA tags and no
`latest`, `main`, date, short-SHA, or stage image tag.

## Issues Encountered

- The authenticated Kubernetes API continues to print its legacy service-account token warning. All exact-label operations completed and every owned inventory is zero.
- FastAPI 0.139.0 continues to emit the accepted Starlette TestClient deprecation warning with HTTPX 0.28.1. All 27 cases pass locally and in GitHub Actions.
- The failed workflow versions are deliberate temporary evidence. Their exact package version IDs are recorded above for Plan 23-04 cleanup after final-image and rollback evidence is complete.

## Known Stubs

None. The Dockerfile, publisher, startup identity, public package, immutable tag,
and anonymous registry readback are complete. Workload manifests and live
rollback remain the explicit scope of Plans 23-02 and 23-03.

## Threat Flags

| Flag | File | Description |
|------|------|-------------|
| threat_flag: package-publication | `.github/workflows/publish-image.yml` | The workflow writes a public container package with `packages: write`; exact Action SHAs, one target SHA, immutable tags, and fail-closed readback bound the surface. |

## User Setup Required

None. Existing GitHub and Sealos authentication supported every planned gate.
The accepted package is public and anonymous reads pass.

## Next Phase Readiness

- Plan 23-02 can evolve migration and workload contracts from accepted source `1a5a66f...` and deploy baseline digest `sha256:b11293cf...`.
- Plan 23-03 can use the immutable baseline reference for two-replica rollout, rollback, and recovery evidence.
- FAST-03 and FAST-04 remain pending until all four Phase 23 plans and the independent phase verifier pass.

## Self-Check: PASSED

- All five implementation commits exist locally and publicly; source is clean and public main equals `1a5a66f3959f69ff66d85a9562acba738c82edb4`.
- Successful workflow run `29421655544` has event `push`, attempt 1, exact head/target, 27 passing tests, conclusion `success`, and the recorded registry digest.
- Anonymous digest/config/manifest readback confirms `sha256:b11293cf...`, linux/amd64, UID/GID 10001, `/app`, the exact one-worker Uvicorn command, OCI revision/source, and deterministic created time.
- Stage 1 is `77e57a2...` -> `276aa00...`; Stage 2 is `b61254c...` -> `2b256b3...`; Stage 3 remains absent; active ruleset `18970425` retains exact update/deletion protection and no bypass.
- Runs `bceed74ef6cc`, `635eb7bdc5b1`, `d4d4b5d6f7e5`, `fa06bdd1e3a5`, and `ce5722a89b77` have zero Deployments, ReplicaSets, Pods, Services, Jobs, Secrets, ConfigMaps, port-forwards, state files, render files, and temporary evidence directories.

---
*Phase: 23-fastapi-production-stage*
*Completed: 2026-07-15*
