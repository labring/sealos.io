---
gsd_state_version: 1.0
milestone: v1.3
milestone_name: FastAPI and Django Tutorial Expansion
current_phase: 28
current_phase_name: Catalog Publication and Cleanup
status: executing
stopped_at: Completed 28-02-PLAN.md
last_updated: "2026-07-16T21:42:56.538Z"
last_activity: 2026-07-17
last_activity_desc: Phase 28 Plan 02 complete
progress:
  total_phases: 8
  completed_phases: 7
  total_plans: 34
  completed_plans: 33
  percent: 97
---

# Project State

## Project Reference

See: `.planning/PROJECT.md` (updated 2026-07-15)

**Core value:** Readers can follow framework-specific Sealos tutorials with
commands, screenshots, and validation evidence that match the current product
workflow.
**Current focus:** Phase 28 — Catalog Publication and Cleanup

## Current Phase

| Field | Value |
|-------|-------|
| Phase | 28 of 28 |
| Name | Catalog Publication and Cleanup |
| Status | Executing |
| Goal | Readers can navigate the complete 15-page tutorial catalog while maintainers can verify public contracts and the empty practice footprint. |
| Roadmap | `.planning/ROADMAP.md` |
| Requirements | `.planning/REQUIREMENTS.md` |

## Active Requirements

- TDD-04
- SHOT-03
- PUB-03
- OPS-02

## Current Position

Phase: 28 (Catalog Publication and Cleanup) — EXECUTING
Plan: 3 of 3
Status: Ready to execute
Last activity: 2026-07-17 — Phase 28 Plan 02 complete

## Next Action

Execute Plan 28-03 production build, HTTP, browser, evidence, and cleanup gates.

## Session

**Last session:** 2026-07-16T21:42:56.536Z
**Stopped at:** Completed 28-02-PLAN.md
**Resume file:** .planning/phases/28-catalog-publication-and-cleanup/28-03-PLAN.md

## Performance Metrics

| Phase | Plan | Duration | Notes |
|-------|------|----------|-------|
| Phase 13 P01 | 2 min | 1 tasks | 2 files |
| Phase 13 P04 | 3 min | 2 tasks | 2 files |
| Phase 13 P02 | 6 min | 2 tasks | 2 files |
| Phase 13 P05 | 5min | 2 tasks | 2 files |
| Phase 14 P01 | 10min | 1 tasks | 2 files |
| Phase 14 P04 | 4min | 3 tasks | 2 files |
| Phase 14 P02 | 20min | 2 tasks | 2 files |
| Phase 14 P05 | 5min | 2 tasks | 5 files |
| Phase 15 P01 | 8min | 2 tasks | 1 files |
| Phase 15 verification | 2026-06-16 | 12/12 must-haves verified | UAT and verification artifacts |
| Phase 21 P01 | 9 min | 3 tasks | 8 files |
| Phase 21 P02 | 15 min | 3 tasks | 2 files |
| Phase 21 P03 | 7 min | 2 tasks | 4 files |
| Phase 22 P01 | 34 min | 3 tasks | 11 files |
| Phase 22 P02 | 39 min | 3 tasks | 3 files |
| Phase 22 P03 | 30min | 3 tasks | 7 files |
| Phase 22 P04 | 50 min | 3 tasks | 10 files |
| Phase 23 P01 | 64 min | 3 tasks | 5 files |
| Phase 23 P02 | 83 min | 3 tasks | 8 files |
| Phase 23 P03 | 101 min | 2 tasks | 12 files |
| Phase 23 P04 | 45 min | 3 tasks | 6 files |
| Phase 23 verification | 2026-07-15 | 20/20 must-haves verified | FAST-03 and FAST-04 passed |
| Phase 24 P01 | 3 min | 2 tasks | 6 files |
| Phase 24 P02 | 7 min | 3 tasks | 15 files |
| Phase 24 P03 | 7 min | 2 tasks | 8 files |
| Phase 24 P04 | 6 min | 3 tasks | 7 files |
| Phase 24 P05 | 8 min | 3 tasks | 4 files |
| Phase 25 P01 | 3 min | 2 tasks | 4 files |
| Phase 25 P02 | 15 min | 3 tasks | 6 files |
| Phase 25 P03 | 37 min | 2 tasks | 6 files |
| Phase 25 P04 | 121 min | 2 tasks | 9 files |
| Phase 25 P05 | 50 min | 3 tasks | 4 evidence files |
| Phase 25 verification | 2026-07-16 | 23/23 must-haves verified | TDD-02, TDD-03, and DJAN-02 passed |
| Phase 26 P01 | 44 min | 3 tasks | 9 files |
| Phase 26 P02 | 59 min | 3 tasks | 7 target files |
| Phase 26 P03 | 21 min | 3 tasks | 11 files |
| Phase 26 P04 | 33 min | 3 tasks | protected Stage 3, public replays, and 11 sealed evidence files |
| Phase 26 verification | 2026-07-16 | 21/21 must-haves verified | DJAN-03 and DJAN-04 passed |
| Phase 28 P01 | 15 min | 2 tasks | 3 files |
| Phase 28 P02 | 10 min | 2 tasks | 5 files |

## Decisions

- [Phase 13]: 13-04: Production checklist body uses native Codex and Claude Code plugin install commands before compatibility npx installers.
- [Phase 13]: 13-02: Beginner tutorial body uses native Codex and Claude Code plugin install commands before compatibility npx installers.
- [Phase 13]: 13-05: Cross-article validation confirms native-first install commands, compatibility placement, host invocation mapping, and direct skills.sh scope across all three tutorials.
- [Phase 14]: Planning covers DEPLOY-01 through DEPLOY-06 across source truth, beginner tutorial, PostgreSQL tutorial, production checklist, and cross-article validation.
- [Phase 14]: 14-04: Production deploy guidance uses DEPLOY for missing, stale, broken, or unverifiable state and UPDATE only after state plus live Kubernetes Deployment verification.
- [Phase 14]: 14-04: Runtime Truth Pass is documented as the production launch gate with App URL, custom domain, logs after smoke, login/authenticated checks, footprint, database evidence, rollback readiness, and backup/restore awareness.
- [Phase 14]: 14-04: Phase 15 remains responsible for FAQ/HowTo frontmatter harmonization and final stale-reference reporting.
- [Phase 14]: 14-02: Beginner tutorial body now treats Runtime Truth Pass as live-runtime acceptance evidence with App URL, non-5xx smoke, logs, and footprint.
- [Phase 14]: 14-05: Cross-article deploy workflow validation passed for DEPLOY-01 through DEPLOY-06 across all three tutorial bodies.
- [Phase 14]: 14-05: Phase 15 remains responsible for FAQ/HowTo metadata harmonization, terminology-only cleanup, stale-reference reporting, and final repository tutorial validation.
- [Phase 14]: 14-05: Commit creation is blocked by the branch safety gate on codex/rebase-upstream-main-d65d.
- [Phase 14]: Verification passed for DEPLOY-01 through DEPLOY-06 with 14-UAT.md and 14-VERIFICATION.md recorded.
- [Phase ?]: [Phase 15]: 15-01: Beginner tutorial FAQ and HowTo metadata now mirror Runtime Truth Pass, .sealos/template/index.yaml, and .sealos/state.json acceptance language.
- [Phase 15]: verify-work passed for CONSIST-01 through CONSIST-04 and VERIFY-01 through VERIFY-04; next gate is `$gsd-secure-phase 15`.
- [Phase 21]: 21-01: Fresh create_app() instances define the public HTTP seam, and exact PyPI metadata is verified before locking. — This keeps public behavior tests deterministic and preserves a reproducible dependency trust record.
- [Phase 21]: Keep the dictionary and ID counter inside create_app() so every fresh application starts empty at ID 1. — This preserves deterministic public HTTP tests and the Stage 1 process-local boundary.
- [Phase 21]: Use complete PUT replacement with a retained integer ID and verify persistence through a later public GET. — This defines update behavior exclusively through the public seam.
- [Phase 21]: Centralize unknown-ID resolution for GET, PUT, and DELETE. — This mechanically preserves the stable public 404 response contract.
- [Phase 21]: 21-03: Publish only the fully accepted README commit after lock, history, export, inventory, and port-8000 gates pass. — This keeps the public branch and immutable tag aligned with the exact locally accepted reader source.
- [Phase 21]: 21-03: Protect refs/tags/stage-* with one active update-and-deletion ruleset and verify direct plus peeled tag identities. — This preserves both the annotated metadata object and its accepted source commit.
- [Phase 22]: 22-01: Launch the PostgreSQL session supervisor in a detached POSIX session so caller and PTY shutdown cannot terminate owned control processes.
- [Phase 22]: 22-01: Use Alembic as the exclusive schema owner and map the same explicit tasks shape through typed SQLAlchemy 2 metadata.
- [Phase 22]: 22-01: Start every migration behavior invocation from Alembic base so the public command test is independently replayable.
- [Phase 22]: 22-03: Return credential-free readiness categories internally and translate every unready category to one public 503 detail.
- [Phase 22]: 22-03: Package only the tracked model, Alembic configuration, immutable revision, and runtime export into the source Job ConfigMap.
- [Phase 22]: 22-03: Recover transient local port-forward loss inside a bounded child process while preserving database and run identity.
- [Phase 22]: Freeze all tracked replay evidence in the accepted commit before advancing public main or creating the Stage 2 tag.
- [Phase 22]: Accept Stage 2 recovery only when local and remote type, message, direct object, peeled commit, repository metadata, and tag protection are coherent.
- [Phase 22]: Keep post-public replay artifacts outside the immutable Reference Application tree.
- [Phase 23]: Use the GHCR registry readback digest as the deployable release identity across exporter media-type differences.
- [Phase 23]: Accept the first-package anonymous 403 only with exact error fragments and independent authenticated package absence.
- [Phase 23]: Render parameterized production Jobs through an exact token allowlist before strict inherited server validation.
- [Phase 23]: Freeze final reader source before retaining its dynamic GHCR digest in Sealos.io planning evidence.
- [Phase 23]: Recreate the bounded Service port-forward after each completed rollout before accepting public HTTP behavior.
- [Phase 23]: Use one persistent public task to prove continuity through baseline, final, rollback, and explicit recovery.
- [Phase 23]: Freeze reviewed live evidence read-only after semantic, credential, checksum, source, and exact cleanup audits pass.
- [Phase 23]: Publish Stage 3 only through the exact absent/absent annotated-tag recovery branch and a normal single-ref push.
- [Phase 23]: Derive the final image replay from the peeled public Stage 3 clone and isolate every anonymous registry read in a fresh empty configuration.
- [Phase 23]: Retain seven immutable full-SHA audit versions after package deletion authorization failed while preserving the accepted baseline/final mappings and zero mutable tags.
- [Phase 23]: Freeze publication evidence after checksum-independent preflight, atomic nine-entry checksums, and exactly one full verifier run.
- [Phase 23]: Independent verification passed 20/20 must-haves for FAST-03 and FAST-04; Phase 24 is the next active stage.
- [Phase 24]: Approve Django 5.2.16, pytest 9.1.1, and pytest-django 4.12.0 only after exact PyPI and official tag verification. — This preserves an explicit supply-chain trust record before executable package resolution.
- [Phase 24]: Preserve a five-file dependency baseline and derive the runtime-only requirements export from uv.lock. — This gives Django generation a clean reproducible parent commit and excludes development packages from reader runtime installs.
- [Phase 24]: Use an explicit Stage 1 development-only secret value and leave production secret injection to Phase 26. — This keeps tracked Stage 1 settings credential-free while preserving a conventional local Django setup.
- [Phase 24]: Keep the generated scaffold free of custom behavior, then add only the public health tracer through one retained RED/GREEN pair. — This preserves the confirmed public HTTP seam and exact TDD ancestry.
- [Phase 24]: Use Task Meta ordering by the unique integer ID so every rendered read has stable creation order. — This preserves deterministic read order without an additional timestamp field.
- [Phase 24]: Keep the Stage 1 board server-rendered with one local stylesheet, Django autoescaping, and zero script assets. — This preserves the locked accessible and inspectable reader surface.
- [Phase 24]: Expose only title through TaskForm while the model supplies the incomplete-task default. — This constrains public model input to the confirmed Stage 1 field.
- [Phase 24]: Use a namespaced tasks:create-task route and redirect successful writes to tasks:board. — This keeps route ownership explicit across the rendered form and PRG response.
- [Phase 24]: Render invalid bound forms with HTTP 200 while preserving ordered public board state. — This keeps validation feedback on the public response and proves failed writes through a separate board read.
- [Phase 24]: Mount Django's native administration and keep Task ownership behind the framework authentication stack. — This preserves Django's built-in security boundary and the confirmed Stage 1 login contract.
- [Phase 24]: Freeze public main only after local lock, migration, tests, export, history, inventory, browser, and cleanup gates pass.
- [Phase 24]: Protect the annotated Stage 1 tag with one exact active update-and-deletion ruleset before publication.
- [Phase 24]: Accept Stage 1 only after a fresh public HTTPS tag replay and independent zero-residue readback.
- [Phase 25]: Approve psycopg and psycopg-binary 3.3.4 only after PyPI, official installation documentation, and the annotated upstream tag agree. — This preserves an explicit supply-chain trust record before executable package resolution.
- [Phase 25]: Preserve the accepted Stage 1 commit, tag, migration, direct pins, and 24-file inventory in the exact three-file Psycopg dependency commit. — This gives every PostgreSQL behavior commit one clean immutable parent.
- [Phase 25]: Keep DJAN-02, TDD-02, and TDD-03 pending until Phase 25 verification completes. — Plan 25-01 supplies the dependency foundation while later plans prove database behavior and publication.
- [Phase 25]: 25-02: Name each pytest database test_<run-id> while retaining tasks as the runtime database on the same owned PostgreSQL service.
- [Phase 25]: 25-02: Use Django's dummy backend for the explicit unconfigured health state and provide no usable SQLite fallback.
- [Phase 25]: 25-02: Gate public readiness on Task._meta.db_table through Django introspection with a one-second PostgreSQL timeout.
- [Phase 25]: 25-03: Generate a minimal migration-only settings and URLConf overlay in writable /tmp so the exact ten tracked inputs and exact Django migrate command remain intact.
- [Phase 25]: 25-03: Recreate one exact run-owned source Job name after bounded deletion so idempotence is proven at the Kubernetes object boundary.
- [Phase 25]: 25-03: Isolate render cleanup traps inside nested subshells so temporary-file cleanup cannot clear the outer exact-run cleanup trap.
- [Phase 25]: 25-04: Use an ephemeral sitecustomize overlay only for the unreachable runserver probe so public health owns the HTTP 503 result.
- [Phase 25]: 25-04: Verify native admin registration at the changelist and read the retained title from the linked Task change form.
- [Phase 25]: 25-04: Keep assert-clean-all read-only and concentrate every lifecycle mutation in exact-run cleanup.
- [Phase 25]: 25-04: Keep Phase 25 requirements pending until immutable publication and independent phase verification complete.
- [Phase 25]: 25-05: Publish accepted Django Stage 2 only through normal main and single-tag pushes after local and no-local fresh-database gates.
- [Phase 25]: 25-05: Treat the immutable FastAPI evidence-enabled phase gate as the authoritative Stage 2 harness replay.
- [Phase 25]: 25-05: Freeze exactly eight reviewed evidence inputs before the final GitHub and read-only cleanup audit.
- [Phase 25]: Independent verification passed 23/23 must-haves; TDD-02, TDD-03, and DJAN-02 are complete, and Phase 26 is the next active stage.
- [Phase 26]: 26-01: Gate production-only secrets, localhost hosts, manifest static storage, and serving-worker identity behind DJANGO_PRODUCTION=1. — Preserve the accepted Stage 2 development path while production fails closed on every runtime identity input.
- [Phase 26]: 26-01: Use the anonymous GHCR readback digest as the deployable Image A identity. — The public registry result is the immutable reader and Sealos deployment reference.
- [Phase 26]: 26-01: Publish package visibility only after repository linkage is exact. — Anonymous replay begins after source ownership and package association are proven.
- [Phase 26]: 26-02: Run the same immutable image and Secret through the migration Job before accepting either hardened Gunicorn replica. — Migration completion is the release readiness boundary.
- [Phase 26]: 26-02: Use one persistent Django Task across baseline, final, rollout undo, and explicit final recovery. — Board and authenticated administration read the same public witness.
- [Phase 26]: 26-02: Freeze the README-only final source before retaining Image B's dynamic digest in Sealos.io planning evidence. — Public source stays self-consistent and immutable.
- [Phase 26]: 26-02: Accept cleanup `secret=0` as zero inventory while rejecting every assigned Secret value. — Evidence scanning stays credential-safe and compatible with the cleanup schema.
- [Phase 26]: Accept live run 0f27d3ed8f1f after four ordered production states and exact cleanup. — This run provides the checksum-valid DJAN-03 runtime witness.
- [Phase 26]: Use a removed external browser timing adapter while keeping the target source and assertions frozen. — agent-browser 0.26.0 required bounded navigation and selector readiness waits.
- [Phase 26]: Keep live evidence writable only for the exact Plan 26-04 publication append and reseal. — The final publication package adds one data file and regenerates the checksum manifest.
- [Phase 26]: Independent verification passed 21/21 must-haves; DJAN-03 and DJAN-04 are complete, and Phase 27 is ready for discussion and planning.
- [Phase 28]: Validate protected Python source tags through one exact repository link per page.
- [Phase 28]: Require exactly four unique 1440x900 WebPs below 150 KiB for every strict tutorial.
- [Phase 28]: Use token-bounded retired-skill detection so evidence filenames remain valid.
- [Phase 28]: Promote FastAPI and Django through the existing derived catalog state.
- [Phase 28]: Keep Go and Spring Boot as the exact coming-next framework set.
- [Phase 28]: Bind availability counts and five-framework copy to the public validator.
