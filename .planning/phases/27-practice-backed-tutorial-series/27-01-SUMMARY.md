---
phase: 27-practice-backed-tutorial-series
plan: "01"
subsystem: tutorial-asset-coordinator
tags: [tdd, node-test, mdx, webp, agent-browser, evidence]
requires:
  - phase: 27-planning
    provides: Locked six-page and 24-image contract
provides:
  - Exact immutable 24-record screenshot contract
  - Read-only six-draft and final-bundle validator
  - Evidence-card renderer using agent-browser and cwebp
  - WebP format, dimension, pixel, metadata, OCR, and digest validator
  - Stable CLI modes and exit codes
affects: [27-02, 27-03, 27-04, 27-05, 27-06]
tech-stack:
  added: []
  patterns: [strict red-green ancestry, literal subprocess arguments, git blob boundary checks]
key-files:
  created:
    - scripts/python-tutorial-assets.test.mjs
    - scripts/python-tutorial-assets.mjs
  modified: []
key-decisions:
  - "Keep the public module surface to four exports and the CLI surface to three modes."
  - "Read bracketed App Router paths with Git literal pathspecs before comparing phase-base blobs."
  - "Wait for the exact named browser session to disappear after close while preserving unrelated sessions."
patterns-established:
  - "RED fixtures complete before the dynamic import of the absent production module."
  - "Validation paths remain read-only; render writes one contract-owned WebP through an allowlisted path."
requirements-completed: [CONT-03, CONT-04, SHOT-01, SHOT-02, OPS-01]
duration: 35m
completed: 2026-07-17
---

# Phase 27 Plan 01: Python Tutorial Asset Coordinator Summary

**A strict test-only RED followed by an implementation-only GREEN established
the six-draft, 24-card, evidence, rendering, and publication-boundary seam.**

phase27_base=41aa0c2fd8d05d3c77e08e85e36011dc47a93a83

## Performance

- **Started:** 2026-07-17T01:20:00+08:00
- **Completed:** 2026-07-17T01:55:00+08:00
- **Tasks:** 2
- **Files created:** 2

## Accomplishments

- Created a 721-line behavior specification after constructing complete
  six-page, 24-record, timing, evidence, image-corruption, browser-session, and
  Git-boundary fixtures.
- Captured the authentic RED twice: focused and complete runs both exited 1
  with `ERR_MODULE_NOT_FOUND` naming the absent coordinator after fixture
  readiness.
- Implemented the exact four exports and three CLI modes with structured MDX
  and JSONL parsing, sorted semantic findings, title parity, checksum checking,
  and phase-base blob comparison.
- Rendered a real 1440x900 card through an owned loopback server and exact
  `agent-browser` session, encoded it with `cwebp`, then validated it with
  `ffprobe`, FFmpeg pixels, `webpmux`, Tesseract, and SHA-256.
- Preserved every unrelated browser session and all Phase 28 boundary bytes.

## Task Commits

1. **Task 1: Specify the Python tutorial asset coordinator** - `4c2def3`
   (`test`)
2. **Task 2: Implement the Python tutorial asset coordinator** - `1eae264`
   (`feat`)

The GREEN commit is the direct child of RED. RED changes only the test file;
GREEN changes only the implementation file.

## Verification

- `node --test scripts/python-tutorial-assets.test.mjs`: 17 passed, 0 failed.
- `npm run lint`: passed with TypeScript strict checking.
- Public exports: `SCREENSHOT_CONTRACT`, `validateDraftBundle`,
  `renderEvidenceCard`, `validateEvidenceCard`.
- Contract: 24 unique frozen page/filename records.
- Browser inventory after render: original unrelated session set only.
- `package.json` SHA-256:
  `bc80045dfeea8117687a66eef20bf02673045b384f24f312e88a7d56257bc90e`.
- `package-lock.json` SHA-256:
  `5c46bcc7d24762a3b1b83e20a0f6ee6e02068bcf31848f9539592291bb391b62`.
- Phase 28 boundary diff from `phase27_base`: empty.

## Deviations

### Environment Setup

The worktree had no `node_modules`. `npm ci` ran under the repository-required
Node 20 runtime and used the existing lockfile. It created ignored dependency
state only; both package files retained their original hashes.

### Implementation Fixes During GREEN

- Git revision-path syntax treated square-bracket route segments as pathspec
  patterns. Literal `ls-tree` lookup plus `cat-file blob` now reads the exact
  App Router paths.
- `agent-browser close` acknowledges before its session disappears from the
  inventory. The renderer now polls `.data.sessions[]` for exact-session
  removal before returning.

## Next Plan Readiness

- Plans 27-02 and 27-03 can write framework-scoped evidence records that join
  directly to the frozen screenshot contract.
- Draft authoring can use `--check-drafts`; image production can use
  `--render` and framework-filtered `--check-bundle`.
- Phase 28 publication files remain byte-identical and release promotion stays
  closed.
