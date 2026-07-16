---
phase: 27-practice-backed-tutorial-series
plan: "03"
subsystem: django-tutorial-evidence
tags: [django, postgresql, kubeblocks, sealos, browser, runtime-evidence]
requires:
  - phase: 27-practice-backed-tutorial-series
    plan: "01"
    provides: Frozen tutorial screenshot contract and evidence coordinator
  - phase: 25-django-postgresql-stage
    provides: Checksum-sealed PostgreSQL migration and persistence authority
  - phase: 26-django-production-stage
    provides: Checksum-sealed immutable images, admin, Gunicorn, and A-B-A-B authority
provides:
  - Protected source identities for all three Django stages
  - One accepted clean beginner deployment timing record
  - Current Stage 2 migration, persistence, tests, and admin evidence
  - Current Stage 3 baseline HTTPS and WhiteNoise evidence
  - Sealed Stage 3 final admin, Gunicorn, log, and rollback evidence
  - Twelve source-joined Django screenshot specifications
  - Per-attempt terminal cleanup and framework-wide zero-residue proof
affects: [27-04, 27-05, 27-06, 28-tutorial-publication]
tech-stack:
  added: []
  patterns: [run-owned Sealos practice, explicit authority splits, exact cleanup ledgers]
key-files:
  created:
    - .planning/phases/27-practice-backed-tutorial-series/evidence/work/django/source-identities.jsonl
    - .planning/phases/27-practice-backed-tutorial-series/evidence/work/django/timing.jsonl
    - .planning/phases/27-practice-backed-tutorial-series/evidence/work/django/claims.jsonl
    - .planning/phases/27-practice-backed-tutorial-series/evidence/work/django/practice-events.jsonl
    - .planning/phases/27-practice-backed-tutorial-series/evidence/work/django/screenshots.jsonl
    - .planning/phases/27-practice-backed-tutorial-series/evidence/work/django/cleanup.jsonl
    - .planning/phases/27-practice-backed-tutorial-series/evidence/work/django/review.txt
  modified: []
key-decisions:
  - "Keep PostgreSQL 17.10 as protected-source harness context and PostgreSQL 16.4.0 as the current generated KubeBlocks plan fact."
  - "Bind current Stage 3 baseline HTTPS, board, and WhiteNoise proof to the fresh Phase 27 run while retaining sealed Phase 26 as final admin, Gunicorn, log, and A-B-A-B authority."
  - "Retain only five sanitized 1440x900 captures and remove every raw run artifact, credential, adapter, log, and ledger."
patterns-established:
  - "Every material tutorial claim has one explicit protected-source or checksum-valid runtime selector."
  - "Current and historical production observations remain separate records and claims."
  - "Every accepted and rejected run receives a terminal cleanup record with all residue fields at zero."
requirements-completed: [CONT-01, CONT-03, CONT-04, SHOT-01, SHOT-02, OPS-01]
duration: 1h 38m
completed: 2026-07-17
status: complete
---

# Phase 27 Plan 03: Django Practice Evidence Summary

**Fresh Django practice now supplies protected source, current Sealos runtime,
12 screenshot contracts, and exact zero-residue authority for the three-page
tutorial series.**

## Performance

- **Started:** 2026-07-17T01:44:52+08:00
- **Completed:** 2026-07-17T03:22:39+08:00
- **Duration:** 1h 38m
- **Tasks:** 3
- **Files created or modified:** 14

## Accomplishments

- Verified the three annotated protected tags, peeled commits, ruleset
  `19014157`, accepted immutable images, clean reference repositories, sealed
  Phase 25/26 evidence, and Phase 28 publication boundaries.
- Accepted one clean Stage 1 Template API deployment at `26099 ms` after five
  tests, repeat migration, local Task Board proof, current plugin
  analysis/template validation, public HTTPS health, native admin login, and
  Runtime Truth convergence.
- Proved Stage 2 `tasks.0001_initial` twice, schema-aware health, all 43
  PostgreSQL tests, CSRF-protected persistence across process replacement, and
  authenticated native admin change-form readback.
- Proved a fresh Stage 3 baseline same-image migration, two Ready production
  replicas, public HTTPS health and Task Board, and manifest-named WhiteNoise
  CSS with immutable caching.
- Joined checksum-valid Phase 26 final migration, two-replica Gunicorn runtime,
  native admin, release logs, and A-B-A-B revisions to claims with explicit
  sealed selectors.
- Produced exactly 12 Django screenshot specifications and retained five safe
  1440x900 captures; structured and OCR credential scans passed.
- Closed six accepted/rejected run identities with terminal zero rows and
  confirmed zero Django-owned resources, processes, browser sessions, scratch
  paths, logs, credentials, and ledgers.

## Task Commits

No task commits - the orchestrator serializes Wave 2.

## Verification

- `node --test scripts/python-tutorial-assets.test.mjs`: 17 passed, 0 failed.
- Source ledger gate: 3 unique protected Django tags with exact tag objects and
  peeled commits.
- Screenshot ledger gate: 12 unique Django page/filename records, all joined
  to protected source and existing practice events.
- Claims gate: 21 reviewed records with non-empty source artifacts and record
  selectors.
- Practice event gate: migration `tasks.0001_initial`, restart and admin
  readback 200, WhiteNoise `text/css`, and rollout 2/2 all present.
- Cleanup gate: six terminal records with zero residue, plus a final
  Django-prefix audit across 18 resource kinds, processes, browser sessions,
  paths, logs, and target repositories.
- Credential review: eight staging files and five captures passed structured
  and OCR scans.
- Phase 25 and Phase 26 checksum verification passed; the Phase 26 publication
  evidence also passed its full semantic verifier.
- Phase 28 boundary diff from
  `41aa0c2fd8d05d3c77e08e85e36011dc47a93a83`: empty across 9 paths.

## Source Identities

- `stage-1-deploy`: tag object
  `0d9254d37914976898039ff3c55f94399aa1d7c0`, commit
  `ca115bf21b599c14e667b336bd78e3c587c24208`.
- `stage-2-postgresql`: tag object
  `16f60a44885216fa35d67b0334914d8b8d4e8577`, commit
  `16279958ca774f7a34c25b0102a483df53160d6f`.
- `stage-3-production`: tag object
  `f5d48ccd96f9b62da268720686e26666e2675235`, commit
  `8e372f93e1a7bb72880be5198430a065d38d65f5`.
- Baseline image:
  `sha256:df3772c3abedfb05c52d696f17ff8295d73f34b8b017f8b6ba2738fceb4247a8`.
- Final image:
  `sha256:aad216002fae3fd2adce92f09e47e936614b16964a6972c226c4058a16568c7b`.

## Deviations

### Installed Plugin Execution Path

The executor used the installed Sealos 1.1.0 scoring, validation, Template API,
footprint, and log scripts directly. The installed database rule generated a
KubeBlocks PostgreSQL 16.4.0 plan. All plugin run logs and generated state were
removed after sanitization.

### Stage 1 Host Adapter

The Ingress controller honored upstream Host rewriting for GET requests and
did not apply the attempted Origin rewrite. A bounded run-owned Nginx edge
rewrote Host, Origin, and Referer to `localhost`, enabling the frozen Django
CSRF contract through the public HTTPS host.

### Current PostgreSQL Runtime

The protected source harness requires PostgreSQL 17.10. The current installed
plugin's mandatory KubeBlocks rule generates PostgreSQL 16.4.0. Separate
claims and events preserve both authorities.

### Stage 2 Transport Retry

One local kubectl port-forward ended during the first test pass. The database
Pod stayed Ready with zero restarts. A fresh owned port-forward and fresh test
database completed all 43 tests before exact cleanup.

### Stage 3 Current And Historical Authority

Three fresh production attempts ended after useful current observations: one
admin navigation jitter, one local port-forward loss, and one post-baseline
cluster-contract assertion. Every attempt reached terminal zero cleanup. The
third run supplies current baseline migration, 2/2 readiness, public HTTPS,
Task Board, and WhiteNoise facts. Checksum-valid Phase 26 records exclusively
supply final admin, Gunicorn, service logs, and A-B-A-B history, preventing
mixed-source claims.

### Sanitized Product Captures

Five safe browser captures were retained beside the staging ledgers. The Stage
2 admin username was deterministically replaced with `USER [REDACTED]`, and
the Stage 3 static capture renders the exact CSS bytes retrieved from the live
public host. Raw browser, HTML, header, and render scratch was removed.

## Next Plan Readiness

- Plan 27-04 can author all three Django pages from 21 reviewed claims and
  protected source/runtime events.
- Plan 27-05 can render the 12 locked Django cards from credential-free specs
  and sanitized captures.
- Plan 27-06 can merge framework evidence and seal final checksums after the
  Wave 2 barrier.
- Phase 28 publication files remain byte-identical and promotion stays closed.

---
*Phase: 27-practice-backed-tutorial-series*
*Completed: 2026-07-17*
