---
phase: 28-catalog-publication-and-cleanup
plan: "02"
subsystem: tutorial-catalog-publication
tags: [tutorials, fastapi, django, catalog, metadata, tdd]
requires:
  - phase: 28-catalog-publication-and-cleanup
    plan: "01"
    provides: Exact 15-page public validator contract
provides:
  - Five complete framework paths with 15 direct tutorial links
  - Exact available, coming-next, and planned catalog state
  - Five-framework metadata, hero copy, and matrix explanation
  - Fail-closed catalog availability and discoverability tests
affects: [28-03-production-publication]
tech-stack:
  added: []
  patterns: [derived catalog state, CLI fixture mutation, exact availability sets]
key-files:
  created: []
  modified:
    - scripts/validate-tutorials.test.mjs
    - scripts/validate-tutorials.mjs
    - app/[lang]/(home)/tutorials/tutorial-growth-data.ts
    - app/[lang]/(home)/tutorials/page.tsx
    - app/[lang]/(home)/tutorials/TutorialFrameworkMatrix.tsx
key-decisions:
  - "Promote FastAPI and Django through the existing derived catalog state."
  - "Keep Go and Spring Boot as the exact coming-next framework set."
  - "Bind availability counts and reader-visible five-framework copy to the public validator."
requirements-completed: [PUB-01]
requirements-progressed: [TDD-04]
completed: 2026-07-17
status: complete
---

# Phase 28 Plan 02: Catalog Publication Summary

FastAPI and Django now join Next.js, React, and Node.js as complete public
framework paths. The existing matrix derives 15 direct tutorial links from the
five available framework keys.

## TDD Cycle

| State | Commit | Observed behavior |
| --- | --- | --- |
| RED | `b35fd60` | The validator accepted a fixture with Django absent from availability and accepted index copy with both Python framework names removed. |
| GREEN | `6d1ce3d` | Both mutations fail with stable catalog-state and five-framework-copy diagnostics; all four CLI behavior tests pass. |

## Catalog State

| Status | Frameworks | Matrix cells |
| --- | --- | --- |
| Available | Next.js, React, Node.js, FastAPI, Django | 15 |
| Coming next | Go, Spring Boot | 6 |
| Planned | Remaining 11 frameworks | 33 |

FastAPI now uses `Complete API and AI service path`; Django uses `Complete
backend product path`. Slug derivation, the default Next.js action, request
behavior, 18-framework inventory, and three-stage model remain unchanged.

## Reader Copy

- Metadata description names all five complete frameworks.
- Keywords now cover FastAPI and Django deploy, PostgreSQL, and production
  intent.
- The hero offers Next.js, React, Node.js, FastAPI, or Django as starting paths.
- The matrix explains that five complete paths link directly to all three
  tutorial stages.

## Verification

- `node --test scripts/validate-tutorials.test.mjs`: 4 passed, 0 failed.
- `npm run validate-tutorials`: 15 tutorial pages checked.
- `npm run lint`: passed after the development server was stopped.
- Development HTML at `/en/tutorials`: HTTP 200, five-framework copy present,
  and all 15 expected tutorial links rendered.
- Focused Prettier and `git diff --check`: passed.

## Deviation

The initial lint and development smoke were launched together and competed for
`.next/types`; TypeScript reported missing generated files during that race.
The server was stopped and the same lint command passed serially. No source
change was required.

## Self-Check

PASSED. RED and GREEN commits are adjacent, all five complete paths are
discoverable, derived counts are exact, and the original catalog interaction
model is preserved.

---
*Phase: 28-catalog-publication-and-cleanup*
*Completed: 2026-07-17*
