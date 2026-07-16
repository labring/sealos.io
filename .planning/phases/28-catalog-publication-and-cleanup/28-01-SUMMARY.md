---
phase: 28-catalog-publication-and-cleanup
plan: "01"
subsystem: tutorial-publication-validator
tags: [tutorials, fastapi, django, tdd, webp, publication-gate]
requires:
  - phase: 27-practice-backed-tutorial-series
    provides: Six accepted Python tutorial sources and 24 sealed evidence cards
provides:
  - Exact 15-page English tutorial source contract
  - Twelve-folder strict evidence-image contract
  - CLI regression coverage for valid publication and missing Python assets
affects: [28-02-catalog-availability, 28-03-production-publication]
tech-stack:
  added: []
  patterns: [CLI-level TDD, exact-set validation, closed asset directories]
key-files:
  created:
    - scripts/validate-tutorials.test.mjs
  modified:
    - scripts/validate-tutorials.mjs
    - content/tutorials/django-production-deployment-sealos/index.en.mdx
key-decisions:
  - "Validate protected Python source tags through one exact repository link per page."
  - "Require exactly four unique 1440x900 WebPs below 150 KiB for every strict tutorial."
  - "Keep direct-skill detection token-bounded so evidence filenames cannot trigger false positives."
requirements-completed: [PUB-02]
requirements-progressed: [TDD-04, SHOT-03]
completed: 2026-07-17
status: complete
---

# Phase 28 Plan 01: Tutorial Publication Validator Summary

The production validator now accepts exactly 15 English tutorial pages and
closes the asset contract for all 12 React, Node.js, FastAPI, and Django pages
that use evidence cards.

## TDD Cycle

| State | Commit | Observed behavior |
| --- | --- | --- |
| RED | `cd2f772` | Both CLI cases failed: six Python directories were outside the contract and a removed FastAPI asset produced no page-specific diagnostic. |
| GREEN | `9cde5eb` | The exact 15-page catalog passes and the removed asset reports `deploy-fastapi-sealos: image reference does not resolve to public asset /images/deploy-fastapi-sealos/local-stage-validation.webp`. |

The test fixture copies the exact 15 tutorial sources, every referenced local
image, and the validator integration allowlist into a temporary root. It invokes
the public CLI with that root as `cwd` and removes the fixture after each run.

## Publication Contract

- Six Python contracts bind framework, stage, series, order, CTA, related pages,
  stage-specific terminology, protected tag, and exact source URL.
- Twelve strict pages require exactly four unique local image references.
- Every strict image must use its page folder, WebP format, 1440x900 dimensions,
  and a byte size below `153600`.
- Every strict page folder is closed against its references, so missing and
  unreferenced WebPs fail publication.
- Direct retired skill commands use token boundaries, preserving the intended
  command gate while allowing filenames such as `sealos-deployment-health.webp`.

## Deviation

The expanded invariant found one missing execution entry in the Django
production tutorial. Plan 28-01 added the standard `$sealos`, Codex App picker,
and `/sealos` invocation sentence before the protected Stage 3 clone. This is a
three-line source clarification; all Phase 27 evidence and catalog availability
bytes remain unchanged.

The Phase 27 coordinator correctly reports `PUBLICATION_BOUNDARY_CHANGED` when
run against the pre-publication Phase 27 base because the validator is now an
owned Phase 28 boundary. The same complete bundle passes against the committed
Phase 28 boundary with six drafts, 24 assets, zero pending assets, and zero
issues.

## Verification

- `node --test scripts/validate-tutorials.test.mjs`: 2 passed, 0 failed.
- `npm run validate-tutorials`: 15 tutorial pages checked.
- `node --test scripts/python-tutorial-assets.test.mjs`: 17 passed, 0 failed.
- Phase 27 `--check-bundle` at `HEAD`: six drafts, 24 assets, zero issues.
- Phase 27 checksum manifest: all nine inputs verified.
- Phase 27 evidence package: exactly ten files, all mode `0444`.
- `npm run lint`: passed.
- `git diff --check` and focused Prettier check: passed.

## Self-Check

PASSED. RED and GREEN commits are adjacent, the public CLI contract is covered,
the strict asset inventory is exact, and sealed Phase 27 evidence is unchanged.

---
*Phase: 28-catalog-publication-and-cleanup*
*Completed: 2026-07-17*
