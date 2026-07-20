---
phase: 27-practice-backed-tutorial-series
plan: "06"
subsystem: tutorial-evidence-seal
tags: [fastapi, django, provenance, checksums, cleanup, publication-boundary]
requires:
  - phase: 27-practice-backed-tutorial-series
    plan: "05"
    provides: Twenty-four reviewed evidence cards and six responsive page reviews
provides:
  - Ten-file read-only Phase 27 evidence package
  - Exact 32-path and six-subject source history proof
  - Isolated RED and GREEN coordinator replay
  - Phase 28 publication-boundary handoff
affects: [28-catalog-publication-and-cleanup]
tech-stack:
  added: []
  patterns: [checksum-last evidence, immutable source history, final zero-residue audit]
key-files:
  created:
    - .planning/phases/27-practice-backed-tutorial-series/evidence/README.md
    - .planning/phases/27-practice-backed-tutorial-series/evidence/source-identities.jsonl
    - .planning/phases/27-practice-backed-tutorial-series/evidence/timing.jsonl
    - .planning/phases/27-practice-backed-tutorial-series/evidence/commands.txt
    - .planning/phases/27-practice-backed-tutorial-series/evidence/claims.jsonl
    - .planning/phases/27-practice-backed-tutorial-series/evidence/practice-events.jsonl
    - .planning/phases/27-practice-backed-tutorial-series/evidence/screenshots.jsonl
    - .planning/phases/27-practice-backed-tutorial-series/evidence/cleanup.jsonl
    - .planning/phases/27-practice-backed-tutorial-series/evidence/review.txt
    - .planning/phases/27-practice-backed-tutorial-series/evidence/checksums.txt
  modified: []
key-decisions:
  - "Use canonical semantic claim text and normalized SHA-256 values for durable source selectors."
  - "Retain rejected timing and production attempts with terminal cleanup joins."
  - "Generate the nine-entry checksum manifest after every semantic, visual, credential, history, boundary, and cleanup gate."
requirements-completed: [CONT-01, CONT-02, CONT-03, CONT-04, SHOT-01, SHOT-02, OPS-01]
completed: 2026-07-17
status: complete
---

# Phase 27 Plan 06: Evidence Seal Summary

Phase 27 now has a complete, read-only evidence package joining six protected
source stages, six tutorial pages, 38 material claims, 68 practice events, four
timing attempts, 24 evidence cards, responsive reviews, and 12 cleanup records.

## Evidence Package

The package contains ten files. `checksums.txt` seals the previous nine inputs
and all ten files have filesystem mode `0444`.

| Checksum input | SHA-256 |
| --- | --- |
| `README.md` | `34549665a2a3369f0621aa00739c9eb0a3bf19259d28c8daf9b01f4692e982ac` |
| `screenshots.jsonl` | `473c94b0d7225de294809e80d74971090596c123eec7345e82d9ae6c1a4306d9` |
| `source-identities.jsonl` | `7b06900289332856a437c9b9586d3b116d876f87bfc4846f0596b99cc939447e` |
| `claims.jsonl` | `7bbf385de7c3bf67f2f058e4247b065339a5d16c48797cd530794067457ce86b` |
| `practice-events.jsonl` | `8d8836da8bac0b0749c908945d74281a19790cfe5eb9c32e54be2322ef5e864f` |
| `commands.txt` | `93a7aeac3e640cbe271b77d764198e92c0b01ae88b8ac511215174849a0952e9` |
| `cleanup.jsonl` | `ba01801c18a686b8aa1c376a1701923e8542d22e4cca1add4efd63a3331a11ca` |
| `review.txt` | `cf584f1e40db4b954d3555056ba5e401b2d618d3dc554f955d98b1530fcae098` |
| `timing.jsonl` | `f14fb30ecd0f111f7c2c8f070657d05d8e342b75f90a975f4fdaabc1050a0b32` |

The manifest has exactly nine `LC_ALL=C`-sorted lines. Immediate verification,
coordinator replay, tests, lint, cleanup, and a second ten-file byte snapshot
all passed before the files were made read-only.

## Requirement Audit

| Requirement | Evidence | Result |
| --- | --- | --- |
| CONT-01 | Three FastAPI pages, protected tags, 17 claims, and 26 events | Complete |
| CONT-02 | Three Django pages, protected tags, 21 claims, and 42 events | Complete |
| CONT-03 | Coordinator frontmatter, series, stage, related-link, CTA, and terminology gates | Complete |
| CONT-04 | Accepted `21106` ms and `26099` ms timing rows plus both five-minute titles | Complete |
| SHOT-01 | Twenty-four source/evidence/capture/adjacent-step provenance rows | Complete |
| SHOT-02 | Twenty-four unique 1440x900 WebPs below 200000 bytes with machine and visual acceptance | Complete |
| OPS-01 | Commands, migrations, readiness, writes, persistence, public reads, logs, rollback, and cleanup records | Complete |

## D-01 Through D-26

- D-01 through D-06: six exact English sources, two framework-local series,
  protected tags, complete frontmatter, related links, and stage-specific
  tutorial composition pass the coordinator.
- D-07 through D-10: 38 reviewed claims, 68 reviewed events, curated public
  commands, current Sealos entry language, and continuous Tasks API/Task Board
  application state close the content authority contract.
- D-11 through D-17: 24 exact WebPs, four per page, dark evidence-card grammar,
  capture/source hashes, deterministic redaction, useful captions, byte and
  dimension limits, OCR, pixel, metadata, semantic, and original-detail review
  close the screenshot contract.
- D-18 through D-24: clean three-stage practice, preserved public sources,
  checksum-valid production authority, shared timing, retained package, and
  terminal cleanup for every accepted and rejected attempt close the operations
  contract.
- D-25 and D-26: Phase 28 bytes remain frozen, the source inventory and history
  are exact, every join is resolved, checksums verify, and final residue is zero.

## Exact Source History

The non-planning diff from
`41aa0c2fd8d05d3c77e08e85e36011dc47a93a83` contains exactly 32 paths: two
coordinator scripts, six MDX sources, and 24 WebPs. Filtering history to those
paths returns exactly these subjects in order:

1. `4c2def3` - `test(27-01): specify Python tutorial asset coordinator`
2. `1eae264` - `feat(27-01): add Python tutorial asset coordinator`
3. `320af97` - `docs(27-04): add FastAPI tutorial series`
4. `a6ea141` - `docs(27-04): add Django tutorial series`
5. `ff780be` - `docs(27-05): add FastAPI tutorial evidence cards`
6. `6e851f9` - `docs(27-05): add Django tutorial evidence cards`

The isolated RED worktree failed with `ERR_MODULE_NOT_FOUND` for the absent
coordinator after fixture setup. The isolated GREEN worktree passed 17 tests
with zero failures.

## Phase 28 Boundary Hashes

These current files equal their Phase 27 base blobs:

| Boundary | SHA-256 |
| --- | --- |
| `app/[lang]/(home)/tutorials/tutorial-growth-data.ts` | `f76fc52c6f85677bd1a0512ee9ba036ff2f92ef0c611fbd68cf203f24525a220` |
| `app/[lang]/(home)/tutorials/page.tsx` | `c118ebb6bcb01bc94c872ad1e11aaa9ab3c0315c9a783687271be9b21e69a095` |
| `scripts/validate-tutorials.mjs` | `746642c8726fa9afef1bbc4419eb832f99adcdac1b42fc36a466f82ba24e405a` |
| `source.config.ts` | `cb8a10470742ac80ac25f5f1627d4c087d2e03357fe201c71588961f2295723c` |
| `lib/source.ts` | `cd9f4403ae300f0bfff259fdf64e7aff276870f407b15a1aa61ac3a5620d46b5` |
| `lib/utils/tutorial-utils.ts` | `f83d9fe23e38b242e6e91f4bf7272103a4e9e00fb8e514dcd93ab34631622f14` |
| `lib/utils/tutorial-metadata.ts` | `e719d7c485bed0f0d312b6bdd953b2884dfe9c14c45fccc0c16c3629e362d5c5` |
| `app/[lang]/(home)/tutorials/[slug]/page.tsx` | `3fed8beeb5dc562bc9d3fdd5ee18e62184b714a85e4df5216016981aa3f1883f` |
| `app/[lang]/(home)/tutorials/[slug]/layout.tsx` | `b4ed6380a067127d843b1fcce94696caae34479c4aed997f3e720ae11437e0e7` |

The current production validator retains its fail-closed Phase 27 behavior and
reports exactly one issue listing the six unpublished draft directories.

## Immutable Targets And Cleanup

- Six public annotated tags retain their exact direct objects, peeled commits,
  and messages.
- Rulesets `18970425` and `19014157` remain active for
  `refs/tags/stage-*` with update and deletion protection.
- Both reference repositories are clean and aligned with public `main`.
- Four anonymous baseline/final OCI digest reads passed architecture, operating
  system, revision label, source label, manifest, and exact digest checks.
- Phase 23, 25, and 26 checksum manifests retain verified bytes.
- Namespaced Instance, App, workload, Service, Ingress, Job, PostgreSQL Cluster,
  PVC, Secret, and ConfigMap ownership queries returned zero Phase 27 matches.
- The protected cleanup harness returned zero FastAPI/Django inventory,
  processes, browser sessions, paths, and ledgers.
- Public package readback returned zero temporary Phase 27 tags; local server,
  registry, renderer, capture, browser, clone, state, log, and evidence staging
  scratch are absent.

## Verification

- `node --test scripts/python-tutorial-assets.test.mjs`: 17 passed, 0 failed.
- Coordinator bundle: six drafts, 24 assets, zero pending assets, zero issues.
- `npm run lint`: passed.
- Retained credential scan: passed.
- Nine-entry checksum verification: passed.
- Ten-file before/after read-only equality: passed.
- Final cross-framework cleanup: passed.

## Phase 28 Handoff

Phase 28 receives six accepted sources, 24 accepted assets, the exact timing
decision, full evidence joins, a clean runtime footprint, and unchanged catalog,
validator, index, loader, metadata, detail-route, build, and static publication
surfaces. It owns catalog promotion, production validator expansion, production
build, static HTTP route and image acceptance, and the final publication audit.

---
*Phase: 27-practice-backed-tutorial-series*
*Completed: 2026-07-17*
