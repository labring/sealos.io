---
phase: 28-catalog-publication-and-cleanup
plan: "03"
subsystem: tutorial-publication-evidence
tags: [static-export, http, browser, cleanup, checksums, publication]
requires:
  - phase: 28-catalog-publication-and-cleanup
    plan: "02"
    provides: Five complete catalog paths and fail-closed discoverability gates
provides:
  - Production build and established static-check acceptance
  - Exact 31-path static HTTP evidence
  - Desktop and mobile catalog review
  - Final zero-residue audit
  - Seven-file read-only Phase 28 evidence package
affects: [milestone-v1.3-completion]
tech-stack:
  added: []
  patterns: [loopback static acceptance, named browser session, checksum-last evidence]
key-files:
  created:
    - .planning/phases/28-catalog-publication-and-cleanup/evidence/README.md
    - .planning/phases/28-catalog-publication-and-cleanup/evidence/build.txt
    - .planning/phases/28-catalog-publication-and-cleanup/evidence/http.jsonl
    - .planning/phases/28-catalog-publication-and-cleanup/evidence/browser.txt
    - .planning/phases/28-catalog-publication-and-cleanup/evidence/cleanup.jsonl
    - .planning/phases/28-catalog-publication-and-cleanup/evidence/review.txt
    - .planning/phases/28-catalog-publication-and-cleanup/evidence/checksums.txt
  modified: []
key-decisions:
  - "Accept production publication through an exact 31-path loopback HTTP matrix."
  - "Require two stable DOM samples and original-detail visual review at desktop and mobile."
  - "Seal Phase 28 separately while preserving every Phase 27 evidence byte and mode."
requirements-completed: [TDD-04, SHOT-03, PUB-03, OPS-02]
completed: 2026-07-17
status: complete
---

# Phase 28 Plan 03: Publication Evidence Summary

The complete 15-page tutorial catalog passed production build, static output,
HTTP, responsive browser, cleanup, and evidence-seal gates.

## Build And Static Output

| Gate | Result |
| --- | --- |
| Production build | Pass, 148.90 seconds, 6171 static pages |
| Default-locale normalization | Pass |
| Tutorial detail inventory | 15 HTML pages |
| New Python image inventory | 24 WebPs |
| Static output check | Pass |
| Static route policy | Pass, 11 rows and zero failures |

The existing static checks retained two explicit caveats: native generated-image
artifact inspection has no static-export artifacts to inspect, and hosted probes
remain disabled by their established environment gate. Source policy, exported
artifacts, native ownership, sitemap, search, RSS, robots, and redirect/header
checks passed.

## HTTP Acceptance

The run-owned loopback server served one tutorial index, six new trailing-slash
detail routes, and 24 new WebPs. All 31 unique responses returned 200. The seven
pages used `text/html`; all images used `image/webp`. Response bodies total
`3650450` bytes and each row records its own SHA-256.

The index HTML contains all 15 tutorial links and no Next error export marker.
The exact path, content type, byte count, and digest matrix is retained in
`evidence/http.jsonl`.

## Responsive Review

The named `p28-catalog-publication` browser session reviewed `/tutorials/` at
1440x900 and 390x844. Two stable samples at each viewport confirmed:

- Final route and `Sealos Deployment Tutorials | Sealos` title.
- FastAPI and Django text plus six direct Python matrix links.
- 15 available cells, 6 coming-next cells, and 33 planned cells.
- Root overflow 0, matrix sibling overlap 0, and clipped labels 0.

Both full-page screenshots passed original-detail visual inspection. The
desktop composition preserves clear hierarchy across the hero, inventory,
journey, matrix, request panel, and footer. The mobile layout flows as one
coherent column with complete labels and controls. The browser session and both
temporary captures were removed after review.

## Cleanup

The exact static server PID was terminated and reaped, its random loopback port
is free, and its mode-0700 scratch directory is absent. Final exact-name/label
queries returned zero Instance, App, Deployment, StatefulSet, ReplicaSet, Pod,
Service, Ingress, Job, PostgreSQL Cluster, PVC, Secret, and ConfigMap resources.

The protected global harness passed with zero inventory, processes, browsers,
paths, and ledgers. Public package readback found zero Phase 27 temporary image
tags. Reference repositories are clean. Local process, port-forward, state,
log, render, browser, capture, registry scratch, ownership ledger, and temporary
path counts are all zero.

## Evidence Seal

| Input | SHA-256 |
| --- | --- |
| `README.md` | `bc84a8a024cc43c2aa2476a7526c489b3917ec27db7ba3f9502f86bce619f2e3` |
| `browser.txt` | `e40d8c2477f37f749308e9af90e35910343c8fc46e616ab99523bf89613494b6` |
| `build.txt` | `e132a585205f938d93eb2b5ae7067d2b64585294c520f1981ddfb23e4b745bef` |
| `cleanup.jsonl` | `b9f877f7678249b1a0f55a4ac029cc1f63b9253875c50f55a5fdcc0aaf6bcb9e` |
| `http.jsonl` | `202c75892e955fc1e415caf1a56cff48d609a38ae89cead2117159f395b6e18f` |
| `review.txt` | `ffa5781c6398dadd766ae620c57e2a6e1f431029a8453ce9c1354a668953604a` |

`checksums.txt` was generated last through a mode-0600 temporary file and
atomic rename. All six entries verified before and after the final read-only
suite. The complete seven-file package remains mode `0444` and was committed as
`acafbe6` (`docs(28-03): seal tutorial publication evidence`).

Phase 27 remains exactly ten files, nine valid checksum inputs, byte-identical
to its pre-build snapshot, and mode `0444`.

## Deviations

One pre-seal global cleanup probe ran concurrently with the coordinator's
temporary browser-render test and observed that live test session. The
coordinator completed its own cleanup, and every subsequent serial terminal
probe passed. Final evidence records only the serial terminal state.

## Verification

- Tutorial validator tests: 4 passed, 0 failed.
- Python asset coordinator tests: 17 passed, 0 failed.
- Public validator: 15 pages checked.
- TypeScript lint: passed.
- Production build and both static checks: passed.
- Exact HTTP matrix and both responsive reviews: passed.
- Phase 27 equality, final cleanup, credential scan, evidence byte equality,
  checksums, and modes: passed.

## Self-Check

PASSED. The publication evidence commit exists, every retained artifact
verifies, all reader-facing routes are accepted, and terminal residue is zero.

---
*Phase: 28-catalog-publication-and-cleanup*
*Completed: 2026-07-17*
