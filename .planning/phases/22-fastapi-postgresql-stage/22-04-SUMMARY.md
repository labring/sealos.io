---
phase: 22-fastapi-postgresql-stage
plan: "04"
subsystem: publication
tags: [fastapi, postgresql, alembic, kubernetes, github, evidence, reproducibility]

requires:
  - phase: 22-fastapi-postgresql-stage
    plan: "03"
    provides: Schema-aware readiness, repeatable migration Jobs, and the complete real-PostgreSQL phase gate
provides:
  - Protected public FastAPI PostgreSQL source at an accepted immutable commit
  - Reader workflow covering migration-before-readiness, persistent CRUD, and the production Job contract
  - Checksum-protected redacted evidence from a fresh local clone
  - Two pre-public local clone replays and one post-public HTTPS tag replay with zero footprint
affects: [23-fastapi-production-stage, 27-practice-backed-tutorial-series]

tech-stack:
  added: []
  patterns: [fail-closed publication recovery, immutable annotated stage tags, external replay evidence, exact-label cleanup]

key-files:
  created:
    - /Users/longnv/bin/repo/sealos-fastapi-tutorial/evidence/phase-22/README.md
    - /Users/longnv/bin/repo/sealos-fastapi-tutorial/evidence/phase-22/commands.txt
    - /Users/longnv/bin/repo/sealos-fastapi-tutorial/evidence/phase-22/migrations.txt
    - /Users/longnv/bin/repo/sealos-fastapi-tutorial/evidence/phase-22/http.jsonl
    - /Users/longnv/bin/repo/sealos-fastapi-tutorial/evidence/phase-22/jobs.txt
    - /Users/longnv/bin/repo/sealos-fastapi-tutorial/evidence/phase-22/cleanup.txt
    - /Users/longnv/bin/repo/sealos-fastapi-tutorial/evidence/phase-22/checksums.txt
  modified:
    - /Users/longnv/bin/repo/sealos-fastapi-tutorial/README.md
    - /Users/longnv/bin/repo/sealos-fastapi-tutorial/scripts/test-postgres.sh

key-decisions:
  - "Freeze all tracked replay evidence in the accepted commit before advancing public main or creating the Stage 2 tag."
  - "Accept publication recovery only when local and remote tag type, message, direct object, peeled commit, repository metadata, and protection rules are coherent."
  - "Keep every post-public replay artifact outside the immutable Reference Application tree and retain only redacted proof in the planning summary."

patterns-established:
  - "Evidence gate: curate public outputs, scan credential patterns, write cleanup last, then generate and verify the SHA-256 manifest."
  - "Publication gate: verify Stage 1 and ruleset identity, fast-forward main, recover one of four coherent Stage 2 states, and read back every contract."

requirements-completed: [TDD-01, FAST-02]

coverage:
  - id: D1
    description: "The public PostgreSQL stage preserves Stage 1 and exposes an immutable annotated Stage 2 tag that peels to public main."
    requirement: FAST-02
    verification:
      - kind: e2e
        ref: "GitHub owner/main/tag/message/ruleset readback plus HTTPS clone at stage-2-postgresql"
        status: pass
    human_judgment: false
  - id: D2
    description: "Fresh local and public clones reproduce the lock, migrations, 24 public HTTP cases, three-application persistence trace, and two migration Jobs."
    requirement: TDD-01
    verification:
      - kind: integration
        ref: "local runs 3992abb04fa7 and 54a954787c9f; public run 1a408db7620c"
        status: pass
    human_judgment: false
  - id: D3
    description: "Tracked evidence is redacted and checksum-protected, and every retained or temporary run ends with zero resources and stopped owned processes."
    requirement: FAST-02
    verification:
      - kind: other
        ref: "sha256sum -c evidence/phase-22/checksums.txt plus exact-label Kubernetes and process audits"
        status: pass
    human_judgment: false

duration: 50 min
completed: 2026-07-15
status: complete
---

# Phase 22 Plan 04: FastAPI PostgreSQL Publication Summary

**Protected Stage 2 source now reproduces database-backed FastAPI behavior from local and public clones with retained redacted evidence and zero runtime footprint**

## Performance

- **Duration:** 50 min
- **Started:** 2026-07-15T10:25:21Z
- **Completed:** 2026-07-15T11:15:18Z
- **Tasks:** 3
- **Files modified:** 10

## Accomplishments

- Published accepted commit `2b256b3dfc2a7d2a4b930c9970becca8c6da8cd3` to public `main` through a normal fast-forward from the immutable Stage 1 commit.
- Created protected annotated `stage-2-postgresql` object `b61254c237885744ae85cb6f81386f77f1e3ac09` with message `FastAPI PostgreSQL stage`; it peels to the accepted public commit.
- Preserved Stage 1 object `77e57a281ecc087041b54273c1bfc63b66f13d1a`, message `FastAPI deploy stage`, and peeled commit `276aa00e4d5bb7a0d5e375fee530cde3240b2ce8` locally and remotely.
- Replayed the exact source twice through local `git clone --no-local` before publication and once through public HTTPS after publication.
- Retained a credential-free, checksum-protected evidence package from the first fresh local clone and proved every run left zero owned Kubernetes objects or port-forward processes.

## Public Identity

| Contract | Accepted value | Result |
|----------|----------------|--------|
| Repository | `yangchuansheng/sealos-fastapi-tutorial` | Public, owner and default branch read back exactly |
| Public main | `2b256b3dfc2a7d2a4b930c9970becca8c6da8cd3` | Passed |
| Stage 1 direct object | `77e57a281ecc087041b54273c1bfc63b66f13d1a` | Unchanged |
| Stage 1 peeled commit | `276aa00e4d5bb7a0d5e375fee530cde3240b2ce8` | Unchanged |
| Stage 2 direct object | `b61254c237885744ae85cb6f81386f77f1e3ac09` | Annotated tag |
| Stage 2 peeled commit | `2b256b3dfc2a7d2a4b930c9970becca8c6da8cd3` | Equals public main |
| Protection ruleset | `18970425` | Active tag target, exact `refs/tags/stage-*` include, empty exclude and bypass, update plus deletion rules |

## Replay Evidence

| Run ID | Source boundary | Result | Cleanup |
|--------|-----------------|--------|---------|
| `290c28e99083` | Final Task 1 source gate | 24 tests, 9 curated HTTP records, two Jobs, lock/export and checksum gate passed | Exact inventory zero; owned port-forward stopped |
| `3992abb04fa7` | First `git clone --no-local` from Task 1 candidate | Full gate passed; its redacted migration, HTTP, Job, and cleanup records became tracked evidence | Exact inventory zero; owned port-forward stopped |
| `54a954787c9f` | Second `git clone --no-local` of final accepted commit | Full gate passed with evidence outside the clone and zero tracked diff | Exact inventory zero; owned port-forward stopped |
| `1a408db7620c` | Public HTTPS clone at `stage-2-postgresql` | Full gate passed with exact tag object, lock/export, 24 tests, 9 HTTP records, two Jobs, and external evidence | Exact inventory zero; owned port-forward stopped |

Every complete gate proved an unmigrated `503`, fresh and repeat Alembic revision `0001`, schema-ready `200`, generated Swagger UI, cross-application create/list/read/update/delete persistence, stable `404`, strict production Job validation, and two source Job `Complete` conditions.

## Tracked Evidence Checksums

| File | SHA-256 |
|------|---------|
| `README.md` | `f72003f92a359df7d0110a1df2190f593fee7ee4dcab366d9378beef745b4c35` |
| `commands.txt` | `7ccad0dc27967a0d2baff8642e12337afc8e0fb83c4148094b66a9cd6ac8e79c` |
| `migrations.txt` | `b9cb5f932722bcf3669265f8c9c85206966b01c1c1c5aedd763a210a4dfdc1c4` |
| `http.jsonl` | `8e2b2f9764bc85b033f4d09464c077204664ce32b874de7b7eccd17ba0c48855` |
| `jobs.txt` | `2f1f359d3041a9b9df1ca039405f3e9cdec882a38af4c96969a9c845e9a9832b` |
| `cleanup.txt` | `94a1e960bce33d5d0a304e4838f4e5c3610e97e944e9a0d7d0c8bfe9f2d74a8e` |

The credential scan covered PostgreSQL userinfo URLs, database URL assignments, passwords, GitHub and bearer tokens, Kubernetes token prefixes, and Secret data markers before checksum generation.

## Task Commits

1. **Task 1: Document Stage 2 and retain a redacted full-gate evidence package** - `15b1eb4` (`docs`)
2. **Task 2: Replay fresh local clones and freeze all tracked evidence before publication** - `2b256b3` (`test`)
3. **Task 3: Publish immutable Stage 2 and replay HTTPS** - public main and tag retain accepted commit `2b256b3`; no post-public source commit was created by design.

## Files Created/Modified

- `README.md` - Documents the immutable Stage 2 clone, locked install/export, migration-before-readiness order, complete public CRUD, process restart persistence, Job contract, source adapter, integration gate, and Stage 3 boundary.
- `scripts/test-postgres.sh` - Adds an explicit evidence directory, curated public HTTP tracer, deterministic migration and Job records, credential scan, repo-root-verifiable checksums, and exact cleanup proof.
- `evidence/phase-22/README.md` and `commands.txt` - Map every retained artifact to its reproduction command and scope.
- `evidence/phase-22/migrations.txt`, `http.jsonl`, `jobs.txt`, and `cleanup.txt` - Retain the fresh-clone run's public, redacted results.
- `evidence/phase-22/checksums.txt` - Protects the reviewed evidence package with SHA-256 values.

## Decisions Made

- The first fresh local clone is the sole source of tracked dynamic evidence. Later local and public replays write only to external temporary directories.
- Stage 2 recovery uses four explicit local/remote presence states. Every direct-object, peeled-commit, object-type, or tag-message mismatch terminates before tag mutation.
- Publication advances main only from the exact Stage 1 commit or accepts the exact Stage 2 commit as a matching recovery state.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Made retained checksums verifiable from the repository root**
- **Found during:** Task 1 acceptance replay after run `f229142a19c8`
- **Issue:** The initial manifest stored file basenames, so `sha256sum -c evidence/phase-22/checksums.txt` resolved them against the repository root and failed to find the evidence files.
- **Fix:** Generate repository-relative paths for in-repository evidence and absolute paths for external replay evidence, then self-verify the manifest before reporting evidence success.
- **Files modified:** `scripts/test-postgres.sh`
- **Verification:** Replacement run `290c28e99083`, both local clones, and the public HTTPS clone generated and verified their checksum manifests successfully.
- **Committed in:** `15b1eb4`

---

**Total deviations:** 1 auto-fixed bug.
**Impact on plan:** The correction strengthened the exact planned verification command and preserved one accepted tracked evidence run.

## Issues Encountered

- The authenticated cluster emits a legacy service-account token warning on `kubectl` commands. Every exact-name and exact-label operation completed.
- Strict dry-run reports the planned restricted-policy warning for the future application-image Job. Phase 23 owns application-image non-root hardening; the source adapter already runs under the restricted policy controls.
- Public `git clone --branch` warns that the direct annotated tag object is not itself a commit, then correctly peels to the accepted Stage 2 commit. Direct object and peeled commit checks passed before the gate.
- FastAPI continues to emit the accepted Starlette TestClient deprecation warning with HTTPX 0.28.1. All 24 public behavior cases pass from every replay boundary.

## Known Stubs

None. The reader workflow, evidence writer, publication recovery, and public replay paths are complete; scans found no TODO, FIXME, placeholder, mock, or incomplete branch in the Plan 22-04 changes.

## User Setup Required

None. Existing GitHub and Sealos authentication supported every automated gate, and all temporary resources and clones were removed.

## TDD Gate Compliance

- Phase 22 retains all accepted public HTTP and migration RED/GREEN pairs from Plans 22-01 through 22-03.
- Plan 22-04 adds publication and evidence acceptance around those behaviors and introduces no new application behavior seam.
- Local and public clone gates execute the real collaborators and 24-case suite without internal mocks.

## Next Phase Readiness

- Phase 23 can build and publish the hardened application image from protected Stage 2 source while preserving the accepted migration Job contract.
- Phase 27 can cite the immutable Stage 2 tag and retained evidence when authoring the PostgreSQL tutorial and screenshots.
- TDD-01 and FAST-02 are complete with local, cluster, GitHub, and public-clone proof.

## Self-Check: PASSED

- Both implementation commits exist, the accepted source is clean at `2b256b3`, and tracked evidence checksums pass.
- Public main, both tag objects, both peeled commits, both messages, and ruleset `18970425` read back exactly after the HTTPS replay.
- Tracked run `3992abb04fa7`, final local run `54a954787c9f`, and public run `1a408db7620c` each have independent zero-resource and stopped-process proof.
- No post-public tracked write changed the Reference Application or protected Stage 2 tag.

---
*Phase: 22-fastapi-postgresql-stage*
*Completed: 2026-07-15*
