---
phase: 26-django-production-stage
plan: "01"
subsystem: django-container-supply-chain
tags: [django, gunicorn, whitenoise, docker, github-actions, ghcr]

requires:
  - phase: 25-django-postgresql-stage
    provides: Protected Django Stage 2, real PostgreSQL gate, immutable migration, and public behavior
provides:
  - Pinned Django 5.2.16 production image with Gunicorn 26.0.0, WhiteNoise 6.12.0, collected static assets, and UID/GID 10001
  - Exact-source GitHub Actions publisher with real PostgreSQL tests, linux/amd64 builds, public GHCR publication, and anonymous readback
  - Public Image A rollback target mapped to the first production GREEN above protected Stage 2
  - One credential-free source and immutable-image startup record per non-preloaded WSGI worker
affects: [26-02-production-workloads, 26-03-live-rollback, 26-04-stage-publication, 27-practice-backed-tutorial-series]

tech-stack:
  added: [Gunicorn 26.0.0, WhiteNoise 6.12.0, Docker Buildx, GitHub Actions, GitHub Container Registry]
  patterns: [build-time collectstatic, compressed manifest assets, exact-SHA publication, anonymous OCI readback]

key-files:
  created:
    - /Users/longnv/bin/repo/sealos-django-tutorial/tests/test_production.py
    - /Users/longnv/bin/repo/sealos-django-tutorial/Dockerfile
    - /Users/longnv/bin/repo/sealos-django-tutorial/.dockerignore
    - /Users/longnv/bin/repo/sealos-django-tutorial/.github/workflows/publish-image.yml
  modified:
    - /Users/longnv/bin/repo/sealos-django-tutorial/pyproject.toml
    - /Users/longnv/bin/repo/sealos-django-tutorial/requirements.txt
    - /Users/longnv/bin/repo/sealos-django-tutorial/taskboard/settings.py
    - /Users/longnv/bin/repo/sealos-django-tutorial/taskboard/wsgi.py
    - /Users/longnv/bin/repo/sealos-django-tutorial/uv.lock

key-decisions:
  - "Require DJANGO_PRODUCTION=1 to activate the runtime secret, exact localhost host policy, manifest static storage, and serving-worker identity gate."
  - "Use the public GHCR readback digest as the deployable Image A identity while retaining the local OCI candidate as buildability proof."
  - "Make the repository-linked package public inside the minimally permissioned workflow before isolated anonymous readback."

release:
  baseline_source: "c99384891f45c8df8bfaf7803c8e1d752ffd08c5"
  baseline_image: "ghcr.io/yangchuansheng/sealos-django-tutorial@sha256:df3772c3abedfb05c52d696f17ff8295d73f34b8b017f8b6ba2738fceb4247a8"
  lookup_tag: "ghcr.io/yangchuansheng/sealos-django-tutorial:sha-c99384891f45c8df8bfaf7803c8e1d752ffd08c5"
  workflow_id: 29477970332
  workflow_url: "https://github.com/yangchuansheng/sealos-django-tutorial/actions/runs/29477970332"
  workflow_event: push
  workflow_attempt: 1
  workflow_head: "c99384891f45c8df8bfaf7803c8e1d752ffd08c5"
  workflow_target: "c99384891f45c8df8bfaf7803c8e1d752ffd08c5"
  workflow_conclusion: success
  package_version_id: 1035784039
  package_visibility: public
  platform: linux/amd64
  media_type: application/vnd.docker.distribution.manifest.v2+json
  oci_source: "https://github.com/yangchuansheng/sealos-django-tutorial"
  oci_revision: "c99384891f45c8df8bfaf7803c8e1d752ffd08c5"
  static_manifest: "/app/staticfiles/staticfiles.json"
  static_manifest_sha256: "ae88fb5828c33016c95de6040c94ac8cc57503c037d7ef1961fa774eb07cc304"
  hashed_css: "/static/tasks/styles.852e61e8064c.css"

requirements-completed: []

coverage:
  - id: D1
    description: "The accepted Django graph has exact Gunicorn and WhiteNoise pins and a reproducible runtime export."
    requirement: DJAN-03
    verification:
      - kind: integration
        ref: "uv lock --check plus out-of-tree runtime export comparison"
        status: pass
    human_judgment: false
  - id: D2
    description: "Image A collects manifest-hashed static assets and serves them through one production Gunicorn worker with WhiteNoise."
    requirement: DJAN-03
    verification:
      - kind: integration
        ref: "tests/test_production.py plus PostgreSQL phase gate c73ebd1a23d6"
        status: pass
      - kind: e2e
        ref: "GitHub Actions run 29477970332 candidate filesystem inspection"
        status: pass
    human_judgment: false
  - id: D3
    description: "One exact source controls the public full-SHA linux/amd64 image, OCI labels, workflow target, and anonymous digest."
    requirement: DJAN-03
    verification:
      - kind: e2e
        ref: "GitHub Actions run 29477970332 plus anonymous crane digest/config/manifest/export"
        status: pass
    human_judgment: false
  - id: D4
    description: "Protected Stage 1 and Stage 2, migration 0001, ruleset 19014157, and all owned runtime resources remain exact and clean."
    requirement: DJAN-03
    verification:
      - kind: other
        ref: "Git/GitHub readback and scripts/test-postgres.sh --assert-clean-all"
        status: pass
    human_judgment: false

duration: 44 min
completed: 2026-07-16
status: complete
---

# Phase 26 Plan 01: Django Production Image A Summary

**Public main now maps the first production GREEN to a locked non-root Gunicorn/WhiteNoise image, build-time collected static assets, and one anonymously reproducible GHCR digest.**

## Performance

- **Duration:** 44 min
- **Started:** 2026-07-16T06:13:58Z
- **Completed:** 2026-07-16T06:57:36Z
- **Tasks:** 3
- **Target implementation files:** 9 total across the RED and GREEN

## Accomplishments

- Added exact Gunicorn `26.0.0` and WhiteNoise `6.12.0` runtime pins while preserving Django `5.2.16`, psycopg `3.3.4`, Python 3.12, migration `0001`, and the exact runtime-only export.
- Added production settings that require an explicit secret and exact `localhost` host, disable debug, place WhiteNoise directly after SecurityMiddleware, and use `/app/staticfiles` with compressed manifest storage.
- Added a pinned multi-stage image that runs `collectstatic` in the builder, copies only allowlisted runtime assets, executes as `10001:10001`, and starts one non-preloaded sync Gunicorn worker on port 8000.
- Published Image A from exact source `c99384891f45c8df8bfaf7803c8e1d752ffd08c5`; the public full-SHA tag resolves anonymously to `sha256:df3772c3abedfb05c52d696f17ff8295d73f34b8b017f8b6ba2738fceb4247a8`.

## Accepted Supply Chain

| Contract | Accepted value |
|----------|----------------|
| Django / psycopg | `5.2.16` / `3.3.4` |
| Gunicorn / WhiteNoise | `26.0.0` / `6.12.0` |
| Python index / linux-amd64 child | `sha256:d50fb761...aa30b` / `sha256:72d3d75...f488d` |
| uv index / linux-amd64 child | `sha256:10902f58...8f82` / `sha256:f8f31ad6...f1a7` |
| PostgreSQL index | `sha256:4f736ae2...b394` |
| checkout / setup-uv | `9c091bb2...fe3e0` / `11f9893b...f990` |
| login / buildx | `af1e73f9...a9b0` / `bb05f3f5...6d2c` |
| metadata / build-push | `dc802804...302` / `53b7df96...856a` |

All package versions, image index and linux/amd64 identities, and six Action refs were re-resolved from their official public APIs immediately before the RED and matched `26-RESEARCH.md` exactly.

## TDD History Proof

| Boundary | RED | GREEN | Proof |
|----------|-----|-------|-------|
| Production settings, image, static assets, process, and publisher | `0927a971705695f0273eb355d95d55747199d9b0` | `c99384891f45c8df8bfaf7803c8e1d752ffd08c5` | Direct parent/child; RED changes only `tests/test_production.py`; GREEN changes exactly the eight planned implementation files and zero tests. |

The retained RED exits with `AssertionError: Dockerfile must exist`. The GREEN focused suite passes 9/9 cases. The complete real PostgreSQL gate `c73ebd1a23d6` passes 52/52 tests, two repeatable migration Jobs, schema-aware readiness, restart persistence, native administration readback, and exact cleanup.

## Public Image A Identity

| Contract | Accepted value |
|----------|----------------|
| Public repository | `yangchuansheng/sealos-django-tutorial` |
| Public main / baseline source | `c99384891f45c8df8bfaf7803c8e1d752ffd08c5` |
| Workflow | `29477970332`, push attempt 1, success |
| Workflow head / normalized target | `c99384891f45c8df8bfaf7803c8e1d752ffd08c5` / same |
| Full-SHA lookup tag | `sha-c99384891f45c8df8bfaf7803c8e1d752ffd08c5` |
| Immutable Image A | `ghcr.io/yangchuansheng/sealos-django-tutorial@sha256:df3772c3abedfb05c52d696f17ff8295d73f34b8b017f8b6ba2738fceb4247a8` |
| Package | version `1035784039`, public, linked to `yangchuansheng/sealos-django-tutorial` |
| Platform / media type | `linux/amd64` / Docker distribution manifest v2 |
| Runtime identity | `10001:10001`, `/app`, one sync Gunicorn worker, `/tmp`, port 8000 |
| OCI source / revision | public repository URL / exact baseline source |
| Static manifest | `/app/staticfiles/staticfiles.json`, SHA-256 `ae88fb5828c33016c95de6040c94ac8cc57503c037d7ef1961fa774eb07cc304` |
| Hashed Task CSS | `/static/tasks/styles.852e61e8064c.css` |

The package contains exactly one version and one tag. Anonymous digest, config, manifest, and root-filesystem export each ran with a new empty mode-0700 registry configuration and no ambient token variables.

## Task Commits

1. **Task 1:** No source commit; protected Stage 2 and all current supply-chain identities passed read-only preflight.
2. **Task 2:** `0927a97` - `test(26-01): specify Django production image contract`.
3. **Task 3:** `c993848` - `feat(26-01): add hardened Django production image`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Reproduced the export from a temporary project copy**
- **Found during:** Task 1
- **Issue:** Supplying an absolute temporary output or `--project` path changes uv's generated command header even when all resolved requirements are identical.
- **Fix:** Copied only `pyproject.toml` and `uv.lock` to a BSD-safe temporary directory and exported there with the canonical relative output name.
- **Files modified:** None.
- **Verification:** Byte comparison with committed `requirements.txt` passed.

**2. [Rule 1 - Test Bug] Kept the intended RED first under pytest-django ordering**
- **Found during:** Task 2 RED execution and Task 3 focused execution
- **Issue:** pytest-django groups transaction-marked tests ahead of unmarked tests, and the original CSS literal did not exist in the retained stylesheet.
- **Fix:** Marked the Dockerfile contract with the same transaction scope and replaced the CSS content assertion with the retained public `color-scheme: dark` literal before the GREEN commit. The RED was amended while retaining its Stage 2 parent, exact subject, and one-file scope.
- **Files modified:** `tests/test_production.py` in the RED only.
- **Verification:** The deterministic RED signature and the 9/9 focused GREEN suite both passed.

**3. [Rule 3 - Blocking] Committed the GREEN before the repository-clean phase gate**
- **Found during:** Task 3
- **Issue:** The inherited reproducibility gate intentionally runs `git diff --exit-code -- requirements.txt`; the uncommitted planned dependency export therefore stopped the pre-commit full run.
- **Fix:** Committed the already accepted exact eight-file GREEN, then reran the complete gate from the clean tree as required by the plan's publication sequence.
- **Files modified:** None beyond the planned GREEN.
- **Verification:** Run `c73ebd1a23d6` passed 52/52 and cleaned to zero.

**Total deviations:** 3 auto-fixed execution/test issues. The planned adjacent RED/GREEN ancestry and exact scopes remain intact.

## Issues Encountered

- Local development-mode requests emit seven WhiteNoise warnings because the uncollected development `staticfiles/` directory is absent. Production collection and serving pass through the explicit manifest root; all 52 inherited and production tests pass.
- The Kubernetes API continues to print its legacy service-account token warning. Every exact-label resource and owned process was removed.
- One final parallel GitHub readback encountered a transient API connection failure; a serialized retry immediately passed without mutation.

## Known Stubs

None. Image A, its publisher, package visibility, anonymous OCI identity, collected manifest, hashed CSS, and worker startup identity are complete. Workload manifests, Image B, and live rollback remain Plans 26-02 and 26-03.

## Threat Flags

| Flag | File | Description |
|------|------|-------------|
| threat_flag: package-publication | `.github/workflows/publish-image.yml` | The minimally permissioned workflow writes one public immutable container tag after exact-source PostgreSQL tests and linked-package validation. |
| threat_flag: runtime-secret | `taskboard/settings.py` | Production imports require a runtime-injected Django secret and expose no fallback or secret value in logs. |

## Next Phase Readiness

- Plan 26-02 can use baseline source `c99384891f45c8df8bfaf7803c8e1d752ffd08c5` and Image A digest `sha256:df3772c3abedfb05c52d696f17ff8295d73f34b8b017f8b6ba2738fceb4247a8` as immutable workload and rollback inputs.
- Stage 1 direct/peeled objects remain `0d9254d3...` / `ca115bf2...`; Stage 2 remains `16f60a44...` / `16279958...`; ruleset `19014157` remains active with update/deletion protection and no bypass.
- DJAN-03 remains pending until all four Phase 26 plans and independent verification complete.

## Self-Check: PASSED

- RED `0927a97` and GREEN `c993848` exist with direct ancestry and exact disjoint scopes.
- Public main equals GREEN; the repository has 26 commits and 36 tracked files at this boundary.
- Workflow `29477970332` succeeded with exact head/target, 52 passing tests, static filesystem inspection, one public full-SHA tag, and the recorded registry digest.
- Anonymous OCI readback confirms linux/amd64, user/group `10001:10001`, workdir `/app`, exact Gunicorn command, OCI source/revision, manifest, and hashed CSS.
- Stage 1/2 objects, migration SHA-256 `745bc45f...`, and ruleset `19014157` remain exact.
- Runs `f200fc0d26b8`, `ff999c130c47`, `fcd7953a6dd2`, `1b12b94f2d8c`, `c9742f53f5ed`, and `c73ebd1a23d6` have zero owned resources; final `--assert-clean-all` reports every category at zero.

---
*Phase: 26-django-production-stage*
*Completed: 2026-07-16*
