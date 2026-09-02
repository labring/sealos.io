---
phase: 260903-1yz-retire-unqualified-legacy-django-tutoria
verified: 2026-09-02T17:55:05Z
status: passed
score: 7/7 must-haves verified
behavior_unverified: 0
overrides_applied: 0
---

# Quick Task 260903-1yz Verification Report

**Goal:** Retire unqualified legacy Django tutorials and align the public
tutorial matrix with opportunity-level strategy.

**Status:** passed

## Goal Achievement

| # | Must-have truth | Status | Codebase evidence |
| --- | --- | --- | --- |
| 1 | Core is the sole published Django tutorial and its links resolve. | VERIFIED | `content/tutorials/` contains 13 pages and one Django source: `django/deploy/index.en.mdx`. `validateReferences()` rejects unpublished tutorial links; the focused regression rejects a planned Django reference. Core points durable-upload readers to `/docs/guides/object-storage/`. |
| 2 | The matrix exposes Django Deploy as available and PostgreSQL/Production as planned, with only the available item linked. | VERIFIED | `getInventoryStatus()` returns `available` solely for Django `deploy` and `planned` for the other Django stages. `MatrixCell` renders a `Link` only for `available`; planned cells use the request-guide action. |
| 3 | Retired sources and all 12 legacy screenshots are absent; the two Core proof images remain. | VERIFIED | All five retired MDX paths are absent. The three legacy image directories are absent; both 3200x1800 Core WebP files exist under `public/images/tutorials/django/` and in the fresh `out/` export. |
| 4 | The asset generator and fixtures retain only FastAPI contracts. | VERIFIED | `PAGE_CONTRACTS` has three FastAPI entries and `normalizeFramework()` accepts only `FastAPI`; the focused suite verifies three drafts, 12 assets, and rejects `Django` CLI input. |
| 5 | Six flat legacy URL variants permanently hand off to Core on Vercel and Cloudflare. | VERIFIED | `vercel.json` has six `permanent: true` rules and `public/_redirects` has the matching six 308 rules, each targeting `/tutorials/django/deploy/`; the parity regression passed. |
| 6 | Domain language and ADR preserve the opportunity-level publication boundary. | VERIFIED | `CONTEXT.md` defines `Tutorial Opportunity`, `Available Tutorial Opportunity`, and `Retired Tutorial`; ADR 0004 records the Core consolidation and keeps hierarchical planned paths unredirected. |
| 7 | Required tutorial, Node, TypeScript, production-build, and static-output gates pass. | VERIFIED | All prescribed commands exited successfully. The build regenerated `out/` at `2026-09-03T01:53:32+0800`; route and artifact checks confirm only the Core Django output exists. |

**Score:** 7/7 must-haves verified

## Artifact and Wiring Checks

| Artifact | Status | Evidence |
| --- | --- | --- |
| `content/tutorials/django/deploy/index.en.mdx` | VERIFIED | Substantive 886-line Core tutorial with valid frontmatter, local HSTS guidance, object-storage link, and both proof images. |
| `app/[lang]/(home)/tutorials/tutorial-growth-data.ts` | VERIFIED | Stage-aware Django status is consumed by `getTutorialFrameworkMatrix()`. |
| `app/[lang]/(home)/tutorials/TutorialFrameworkMatrix.tsx` | VERIFIED | Matrix consumes the data function and maps status to a public `Link` or demand-capture control. |
| `scripts/validate-tutorials.mjs` | VERIFIED | Validates source count, published navigation/body links, Core workflow, image existence, and 3200x1800 dimensions. |
| `scripts/python-tutorial-assets.mjs` | VERIFIED | FastAPI-only contract is executable and its focused tests pass. |
| `vercel.json` and `public/_redirects` | VERIFIED | Configurations contain exactly matching six-source Core redirects with permanent semantics. |
| `CONTEXT.md` and `docs/adr/0004-consolidate-retired-django-urls.md` | VERIFIED | Substantive canonical terminology and concise decision record. |

## Static Data-Flow and Route Trace

| Surface | Source | Result |
| --- | --- | --- |
| Matrix Django Deploy | `getInventoryStatus(django, deploy)` → `MatrixCell` | FLOWING: available item becomes `/tutorials/django/deploy/` link. |
| Matrix Django PostgreSQL/Production | `getInventoryStatus(django, stage)` → `MatrixCell` | FLOWING: planned items remain demand-capture controls, with no public tutorial link. |
| Tutorial route export | `getSortedTutorials()` → catch-all `generateStaticParams()` | FLOWING: fresh `out/` contains `tutorials/django/deploy/index.html`; planned and flat retired output paths are absent. |
| Legacy URL handoff | Vercel and Cloudflare redirect tables | FLOWING: six source variants map to the single Core destination with 308 semantics. |

## D-01 through D-07 Coverage

| Requirement | Status | Verification evidence |
| --- | --- | --- |
| D-01 | SATISFIED | Sole Django MDX page, 13-page validator pass, and Core static route present. |
| D-02 | SATISFIED | Five retired MDX paths, 12 screenshots, and Django generator contracts absent; proof images and FastAPI workflow retained. |
| D-03 | SATISFIED | Six Vercel/Cloudflare redirect pairs target Core permanently; parity test passes. |
| D-04 | SATISFIED | Stage-aware matrix code and rendered-link guard provide one available Django opportunity. |
| D-05 | SATISFIED | Validator finds no retired internal targets; Core has the existing object-storage guide link. |
| D-06 | SATISFIED | Glossary and ADR define the publishing and handoff decision. |
| D-07 | SATISFIED | Focused Node tests, tutorial validation, TypeScript, production build, static-output check, and diff check pass. |

## Executed Checks

| Command | Result |
| --- | --- |
| `pnpm validate-tutorials` | PASS — 13 tutorial pages. |
| `node --test scripts/validate-tutorials.test.mjs scripts/python-tutorial-assets.test.mjs scripts/check-static-output.test.mjs` | PASS — 29 tests. |
| `pnpm lint` | PASS. |
| `pnpm build` | PASS — fresh static output produced. |
| `pnpm static-output:check` | PASS — source, output artifacts, and route policy pass. Native generated-image inspection reports its pre-existing `SKIPPED_WITH_CAVEAT`; it does not concern Django route or image output. |
| `git diff --check` | PASS. |

## Anti-Patterns and Worktree Integrity

No task-owned source contains `TBD`, `FIXME`, or `XXX` debt markers. The only
`placeholder` text found is inside the Django tutorial's example form code and
does not affect rendered site data.

The six task commits (`39d8efa`, `f5d7190`, `f2bfe2d`, `19d0995`, `802278d`,
`ecd8d8e`) have no path overlap with the pre-existing dirty tutorial migration
worktree changes. Those unrelated changes remain preserved.

---

_Verified: 2026-09-02T17:55:05Z_
_Verifier: gsd-verifier_
