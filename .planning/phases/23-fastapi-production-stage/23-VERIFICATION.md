---
phase: 23-fastapi-production-stage
verified: 2026-07-15T18:19:16Z
status: passed
score: 20/20 must-haves verified
behavior_unverified: 0
overrides_applied: 0
requirements:
  - FAST-03
  - FAST-04
planning_commit: 07756adc11312d39bedb951aea6c1a7dbb3fa490
reference_commit: 1dbbf19185207aed44a29ad6a3509d94a3670c43
---

# Phase 23: FastAPI Production Stage Verification Report

**Phase Goal:** Readers can reproduce and roll back the complete production
FastAPI release from immutable public source and image references.
**Status:** passed
**Verification basis:** independent source, Git/GitHub/GHCR, checksum, and
sealed-evidence review

## Verdict

Phase 23 achieves its goal. The public production source is locked, the two
accepted images are immutable and anonymously readable, the sealed Sealos run
proves migration-first four-state rollout and recovery, all three protected
source stages resolve exactly, and the final cleanup inventory is zero.

`FAST-03` and `FAST-04` are verified.

## Goal Achievement

| # | Observable truth | Status | Independent evidence |
|---|------------------|--------|----------------------|
| 1 | The final source reproduces its Python 3.12 lock and runtime export. | VERIFIED | `uv lock --check` passed for 31 packages; public Stage 3 export reproduced `requirements.txt` exactly. |
| 2 | Every public source stage retains reproducible lock and export data. | VERIFIED | Fresh public HTTPS clones of Stages 1, 2, and 3 passed lock/export checks. |
| 3 | The image uses pinned official Python 3.12.13 and uv 0.10.9 bases. | VERIFIED | Both Dockerfile digests still resolve from their official registries. |
| 4 | The runtime image is allowlisted, non-root, and single-process on port 8000. | VERIFIED | Dockerfile and anonymous OCI config show user `10001:10001`, `/app`, and one Uvicorn command with `--workers 1` on `0.0.0.0:8000`. |
| 5 | Startup logs correlate source release and immutable image reference. | VERIFIED | Public behavior tests pass; sealed `logs.txt` records two matching Pods in each of four states. |
| 6 | The repository-owned publisher uses exact source identity and pinned Actions. | VERIFIED | Workflow uses six release SHAs, one normalized target SHA, PostgreSQL-before-publish tests, and one full-SHA tag. Official release refs still resolve to the committed Action SHAs. |
| 7 | The baseline workflow and image form one accepted immutable release. | VERIFIED | Run `29421655544` completed successfully with 27 tests and digest `sha256:b11293cf8ebb0e73fbabfd33ef6e812d53cb8176ea2db853769aae3dfa273337`. |
| 8 | The final workflow and image form one accepted immutable release. | VERIFIED | Run `29434731777` completed successfully with 33 tests and digest `sha256:c5f6d6df59d05ab9e079aab5dc9a9b0666218ae38f104630587343eaba25b5de`. |
| 9 | Both accepted images resolve without registry credentials. | VERIFIED | Separate empty mode-0700 Docker configs reproduced baseline and final digest, config, manifest, linux/amd64 platform, OCI revision/source, user, and command. |
| 10 | The production workload contract is hardened and migration-first. | VERIFIED | Static tests pass for the two-replica Deployment, Service, migration Job, readiness, resources, immutable image tokens, and complete security context. |
| 11 | The baseline image migration completed before its rollout. | VERIFIED | Sealed run `0fd32115da68` records the baseline Job `Complete=True` at Alembic `0001` using the baseline digest. |
| 12 | The final image migration completed before its rollout. | VERIFIED | The same sealed run records the final Job `Complete=True` at Alembic `0001` using the final digest. |
| 13 | The baseline state reached two Ready hardened replicas. | VERIFIED | Runtime sequence 1 records 2/2 Ready, UID/GID 10001, one PID-1 Uvicorn process per Pod, read-only root, writable bounded `/tmp`, and health/docs 200. |
| 14 | The final state reached two Ready hardened replicas and retained data. | VERIFIED | Runtime sequence 2 records the final digest on both Pods and public update of task `1`. |
| 15 | `kubectl rollout undo` restored the immutable baseline release. | VERIFIED | Runtime and rollback sequence 3 return to the baseline digest/source at controller revision 3 with task `1` preserved. |
| 16 | Explicit recovery restored the final immutable release. | VERIFIED | Runtime and rollback sequence 4 return to the final digest/source at controller revision 4 with task `1` preserved. |
| 17 | Public HTTP behavior survived every release transition. | VERIFIED | `http.jsonl` records health/docs 200 in all four states, persistent task continuity, disposable CRUD, delete 204, and later 404. |
| 18 | The final evidence package is complete, redacted, and checksum-valid. | VERIFIED | Exact ten-file evidence set exists; all nine repository-relative checksum entries pass; independent credential-pattern scan found no secrets. |
| 19 | Public main and all protected source stages are exact. | VERIFIED | Main is `1dbbf191...`; Stage 1, 2, and 3 are annotated tags with exact direct objects, peeled commits, and messages; ruleset `18970425` remains active with update/deletion protection and no bypass. |
| 20 | Public replay and cleanup close the release. | VERIFIED | Public Stage 1 passed 12 tests, public Stage 3 passed 10 static tests, sealed clone replay records the 33-test PostgreSQL gate, and `cleanup.txt` reports zero resources, processes, state, render, clone, evidence-temp, and registry-config residue. |

**Score:** 20/20 must-haves verified (0 behavior-unverified)

## TDD History Proof

| Boundary | RED | GREEN | Independent history result |
|----------|-----|-------|----------------------------|
| Production container and publisher | `06d694a` | `e39a509` | Direct parent/child; one test file followed by exactly Dockerfile, `.dockerignore`, workflow, and `app/main.py`. RED replay failed with `Dockerfile must exist`. |
| Disabled evidence append | `ac816fc` | `031b5fe` | Direct parent/child; harness test followed by `scripts/test-postgres.sh`. |
| Disabled evidence finalizers | `f10603e` | `f20fa00` | Direct parent/child; harness test followed by the two disabled-guard fixes. |
| Production workload contract | `d271810` | `881d039` | Direct parent/child; two static test files followed by exactly two manifests and the production harness. RED replay failed with `deploy/application.yaml must exist`. |
| Parameterized Job validation | `af1753f` | `683155b` | Direct parent/child; renderer test followed by the inherited harness fix. |
| Runtime release logging | `6eaa808` | `9e78177` | Direct parent/child; public logging test followed by application, manifest, and harness wiring. |
| Server-defaulted logging volume | `627ca96` | `dfdd7ea` | Direct parent/child; static test followed by one harness adjustment. |
| Per-state HTTP forwarding | `73db032` | `1dbbf19` | Direct parent/child; static test followed by one port-forward lifecycle adjustment. |

All eight RED subjects are unique. Current static production, migration, and
harness tests pass 10/10, and both shell harnesses pass syntax checks.

## Public Identity

| Artifact | Direct / source | Peeled / digest | Result |
|----------|-----------------|-----------------|--------|
| Public `main` | `1dbbf19185207aed44a29ad6a3509d94a3670c43` | Final source | VERIFIED |
| `stage-1-deploy` | `77e57a281ecc087041b54273c1bfc63b66f13d1a` | `276aa00e4d5bb7a0d5e375fee530cde3240b2ce8` | VERIFIED |
| `stage-2-postgresql` | `b61254c237885744ae85cb6f81386f77f1e3ac09` | `2b256b3dfc2a7d2a4b930c9970becca8c6da8cd3` | VERIFIED |
| `stage-3-production` | `148b525452c3e1cd1b187b5d8ffb488b8fd16403` | `1dbbf19185207aed44a29ad6a3509d94a3670c43` | VERIFIED |
| Baseline image | `1a5a66f3959f69ff66d85a9562acba738c82edb4` | `sha256:b11293cf8ebb0e73fbabfd33ef6e812d53cb8176ea2db853769aae3dfa273337` | VERIFIED |
| Final image | `1dbbf19185207aed44a29ad6a3509d94a3670c43` | `sha256:c5f6d6df59d05ab9e079aab5dc9a9b0666218ae38f104630587343eaba25b5de` | VERIFIED |

The GHCR package is public and linked to the source repository. Its seven
current versions each carry exactly one `sha-<40-hex>` tag; no mutable
`latest`, `main`, branch, stage, date, or short-SHA tag exists.

## Evidence Integrity

- The sealed evidence directory contains exactly nine data files plus
  `checksums.txt`.
- All nine checksum entries verify against repository-relative paths.
- Independent parsing confirms two successful workflow identities, two
  distinct source/image mappings, two completed `0001` migrations, four
  ordered runtime/log/HTTP/rollback states, and one persistent task ID.
- Credential scans cover PostgreSQL userinfo, database/password assignments,
  GitHub and bearer tokens, Kubernetes service-account tokens, registry auth,
  kubeconfig data, AWS-style access keys, and private keys. No match exists.
- The full publication verifier was not rerun during independent verification;
  the accepted sealed result remains read-only as required.

## Cleanup Verdict

**PASSED.** The sealed run selector
`tutorial.sealos.io/run-id=0fd32115da68` records zero Deployments,
ReplicaSets, Pods, Services, Jobs, Secrets, and ConfigMaps. Owned
port-forwards, processes, state files, rendered manifests, clone directories,
temporary evidence, and anonymous registry configurations are all absent.
The public-clone replay also records exact cleanup.

## Requirement Coverage

| Requirement | Verdict | Evidence |
|-------------|---------|----------|
| FAST-03 | VERIFIED | Locked Python 3.12 source, pinned non-root image, one Uvicorn process, migration-gated two-replica readiness, release logs, public HTTP continuity, immutable baseline/final images, rollback, recovery, evidence integrity, and cleanup all pass. |
| FAST-04 | VERIFIED | Public main equals the protected Stage 3 source; all three annotated source tags retain exact direct/peeled identities and each stage reproduces its lock/export contract. |

## Findings

No blocking findings or uncovered Phase 23 requirements remain.

## Residual Risk

- FastAPI 0.139.0 emits the accepted Starlette TestClient deprecation warning
  with HTTPX 0.28.1. All behavior and static tests pass.
- GHCR retains five additional immutable full-SHA audit versions created by
  failed or superseded workflow attempts because the active OAuth token lacked
  package deletion scopes. They carry no mutable tags and do not affect the
  accepted baseline/final identities. Final temporary-image hygiene remains an
  explicit Phase 28 `OPS-02` closeout concern.
- `kubectl` reports the legacy service-account token warning during read-only
  namespace checks. Exact resource queries and cleanup evidence remain valid.

## Gaps Summary

No gaps found. `FAST-03`, `FAST-04`, and every merged Phase 23 must-have are
verified.

---

_Verified: 2026-07-15T18:19:16Z_
_Verifier: independent gsd-verifier_
