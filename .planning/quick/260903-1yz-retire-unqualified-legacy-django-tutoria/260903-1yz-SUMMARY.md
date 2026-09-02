---
phase: 260903-1yz-retire-unqualified-legacy-django-tutoria
plan: "01"
subsystem: tutorial-publication
tags: [nextjs, mdx, redirects, vercel, cloudflare-pages]
requires:
  - phase: 260902-ojw
    provides: "Hierarchical tutorial routes and the Core Django deployment tutorial"
provides:
  - "One published Django Core tutorial with only resolvable public links"
  - "Opportunity-level Django matrix availability and permanent legacy URL handoffs"
  - "FastAPI-only legacy evidence generator contracts"
affects: [tutorials, static-export, seo-geo]
actuals:
  tokens: 40565
  tasks: 3
  commits: 6
metrics:
  duration: "11m"
  completed: "2026-09-02"
tech-stack:
  added: []
  patterns: ["Published tutorial links validate against the active route set", "Legacy URL parity is asserted across Vercel and Cloudflare Pages"]
key-files:
  created:
    - content/tutorials/django/deploy/index.en.mdx
    - docs/adr/0004-consolidate-retired-django-urls.md
  modified:
    - app/[lang]/(home)/tutorials/tutorial-growth-data.ts
    - scripts/validate-tutorials.mjs
    - scripts/python-tutorial-assets.mjs
    - vercel.json
    - public/_redirects
key-decisions:
  - "Django Deploy is available; Django PostgreSQL and Production remain planned opportunities."
  - "All retired flat Django URLs permanently hand readers to the qualified Core tutorial."
requirements-completed: [D-01, D-02, D-03, D-04, D-05, D-06, D-07]
coverage:
  - id: D01-D05
    description: "Sole Core Django tutorial with published-only navigation and retained proof images"
    verification:
      - kind: unit
        ref: "scripts/validate-tutorials.test.mjs"
        status: pass
      - kind: other
        ref: "pnpm validate-tutorials"
        status: pass
    human_judgment: false
  - id: D02
    description: "Legacy Django screenshots and generator contracts removed while FastAPI contracts remain"
    verification:
      - kind: unit
        ref: "scripts/python-tutorial-assets.test.mjs"
        status: pass
    human_judgment: false
  - id: D03-D06
    description: "Six legacy Django URL variants consolidate to Core with documented publication terms"
    verification:
      - kind: unit
        ref: "scripts/check-static-output.test.mjs#legacy Django URLs permanently consolidate on the Core tutorial"
        status: pass
      - kind: other
        ref: "pnpm static-output:check"
        status: pass
    human_judgment: false
  - id: D07
    description: "Production build and static export contain only the Core Django route and evidence"
    verification:
      - kind: integration
        ref: "pnpm build"
        status: pass
      - kind: other
        ref: "static-django-retirement-check-passed"
        status: pass
    human_judgment: false
status: complete
---

# Quick Task 260903-1yz: Retire Unqualified Legacy Django Tutorials Summary

**Django now publishes only the Core deployment tutorial; legacy evidence and URLs consolidate on that qualified path.**

## Performance

- **Completed:** 2026-09-02T17:48:46Z
- **Tasks:** 3/3
- **Files modified:** 27

## Accomplishments

- Retained `/tutorials/django/deploy/` as the sole Django tutorial and made its links resolve only to published routes or the object-storage guide.
- Marked only Django Deploy as available in the public matrix; PostgreSQL and Production collect demand as planned opportunities.
- Removed 12 legacy Django screenshots and all Django branches from the FastAPI evidence generator.
- Redirected all six flat legacy Django URL variants to Core on Vercel and Cloudflare Pages.

## Task Commits

1. **Task 1: Prove the sole public Django Core opportunity end to end** — `39d8efa`, `f5d7190`
2. **Task 2: Remove legacy Django evidence and generator contracts** — `f2bfe2d`, `19d0995`
3. **Task 3: Consolidate legacy URLs and record the publishing boundary** — `802278d`, `ecd8d8e`

## Verification

- `pnpm validate-tutorials` — PASS, 13 tutorial pages checked.
- `node --test scripts/validate-tutorials.test.mjs scripts/python-tutorial-assets.test.mjs scripts/check-static-output.test.mjs` — PASS, 29 tests.
- `pnpm lint` — PASS.
- `pnpm build` — PASS.
- `pnpm static-output:check` — PASS.
- Static output assertions — PASS: Core page and both proof images exist; retired Django routes and image directories are absent.
- `git diff --check` — PASS.

## Decisions Made

- Availability belongs to each Tutorial Opportunity, allowing Django Deploy to publish independently from planned Django PostgreSQL and Production work.
- Retired flat URLs point to the Core tutorial; planned hierarchical URLs remain without redirect contracts.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Correctness] Updated matrix explanatory copy for the opportunity-level Django status.**
- **Found during:** Task 1
- **Issue:** The matrix text still claimed five complete paths after Django PostgreSQL and Production became planned.
- **Fix:** Described four complete framework paths plus the available Django Deploy opportunity.
- **Files modified:** `app/[lang]/(home)/tutorials/TutorialFrameworkMatrix.tsx`
- **Verification:** TypeScript check and production build passed.
- **Committed in:** `f5d7190`

**Total deviations:** 1 auto-fixed (Rule 2).

## Existing Work Preserved

The user-owned tutorial migration for non-Django framework pages, the new catch-all tutorial shell, metadata utilities, source schema, and prior ADRs remained outside these commits.

## Known Stubs

None. The only placeholder occurrences are instructional Django code examples, not rendered application data.

## Next Phase Readiness

The public matrix, static export, and redirect contracts now match the strategy boundary: Core is published, Django PostgreSQL and Production are planned.

## Self-Check: PASSED

- Summary exists and all six task commits are present in git history.
