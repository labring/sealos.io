---
phase: 32-sitemap-route-parity-and-production-verification
plan: "04"
subsystem: release-verification
tags: [github-actions, production, route-parity, exact-sha, release-gate]

requires:
  - phase: 32-sitemap-route-parity-and-production-verification
    provides: Complete local and bounded remote route verification from Plans 32-01 through 32-03.
provides:
  - Timestamped stale production baseline retained beside a fresh remote readback.
  - Read-only Vercel and Cloudflare workflow state and latest-main-run evidence.
  - Explicit blocked release checkpoint with PARITY-02 and DELIVERY-02 still pending.
affects: [phase-32-verification, production-release, ai-quick-reference]

tech-stack:
  added: []
  patterns:
    - Use explicit per-command timeouts for GitHub API and production evidence reads.
    - Preserve blocked external release evidence without claiming unavailable deployment acceptance.

key-files:
  created:
    - .planning/phases/32-sitemap-route-parity-and-production-verification/32-04-SUMMARY.md
  modified:
    - .planning/ROADMAP.md
    - .planning/STATE.md
    - .planning/phases/32-sitemap-route-parity-and-production-verification/32-ROLE-LOG.md

key-decisions:
  - "Keep the plan-time stale snapshot immutable and label the 2026-08-04 fresh read separately."
  - "Treat disabled_manually Vercel state, a failed mismatched latest run, and non-zero remote parity as blocking release evidence."
  - "Leave PARITY-02 and DELIVERY-02 pending until a later exact-SHA production rerun passes."

patterns-established:
  - "Record workflow state, latest main run identity, status, conclusion, and URL before release acceptance."

requirements-completed: []

coverage:
  - id: D1
    description: Fresh production route verification retains all four inventories, HTTP status totals, identity totals, and mismatch categories.
    requirement: DELIVERY-02
    verification:
      - kind: e2e
        ref: npm run verify:ai-faq-routes -- https://sealos.io (2026-08-04T00:22:56.697Z)
        status: fail
    human_judgment: true
    rationale: The live target still serves 28 stale index slugs and returns 404 for those canonical route attempts.
  - id: D2
    description: Production workflow state and latest main run records are retained for both hosting systems.
    requirement: DELIVERY-02
    verification:
      - kind: other
        ref: gh api workflow state and branch=main run queries with 30-second timeouts
        status: fail
    human_judgment: true
    rationale: Vercel is disabled_manually and has no successful same-SHA production run.
  - id: D3
    description: Exact-SHA release checkpoint remains blocked until the approved production action and final rerun are available.
    requirement: PARITY-02
    verification: []
    human_judgment: true
    rationale: The maintainer release action and exact-SHA production acceptance were not available during this execution.

duration: 4 min
started: 2026-08-04T00:20:29Z
completed: 2026-08-04
status: blocked
---

# Phase 32 Plan 04: Production Release Evidence Summary

**The stale production baseline and a fresh failing readback are retained; the exact-SHA production release checkpoint is BLOCKED.**

## Performance

- **Duration:** 4 min
- **Started:** 2026-08-04T00:20:29Z
- **Completed:** 2026-08-04T00:24:06Z
- **Tasks:** 1 completed; 1 blocking human-action checkpoint not reached
- **Files modified:** 4 planning records

## Task 1: Stale Baseline And Release Readiness

### Plan-time stale baseline

Historical evidence from `32-RESEARCH.md` is preserved at `2026-08-03T23:02:39Z`:

| Surface | Total | Unique | Result |
|---|---:|---:|---|
| Canonical source | 2,000 | 2,000 | Reference inventory |
| Deployed page index | 2,000 | 2,000 | 28 source-only and 28 index-only slugs |
| Deployed sitemap | 2,000 | 2,000 | Exact source slug set |

The deployed index had 28 slug drifts, 5 description drifts, 0 question
drifts, and 0 category drifts. Its bytes were 790,807 versus canonical
790,830, with the first difference at byte offset 11,224. The representative
canonical route `/ai-quick-reference/28-what-role-does-ci-cd-play/` returned
200, while the stale index route
`/ai-quick-reference/28-what-role-does-cicd-play/` returned 404. The
plan-time Cloudflare record was successful at
`https://github.com/labring/sealos.io/actions/runs/30782942312` for
`942980cc85a9fd4613c67dc89243a82cac732e14`; Vercel was already
`disabled_manually`.

### Fresh remote readback

Command: `npm run verify:ai-faq-routes -- https://sealos.io`

Target: `https://sealos.io`  
Checked at: `2026-08-04T00:22:56.697Z`  
Runtime: Node.js `v24.13.0`  
Limits: workers `8`, timeout `10,000 ms`, retries `0`, detail cap `20`  
Routes attempted: `2,000`  
Process status: `1` (`FAIL`, completed within the `180s` shell timeout)

| Inventory | Total | Unique | Duplicates |
|---|---:|---:|---:|
| Source | 2,000 | 2,000 | 0 |
| Index | 2,000 | 2,000 | 0 |
| Sitemap | 2,000 | 2,000 | 0 |
| Direct HTTP 200 routes | 1,972 | 1,972 | 0 |

HTTP histogram: `200=1,972`, `404=30`. Identity pages checked: `1,972`;
identity fields checked: `7,888`; title, H1, description, and canonical
identity findings: `0` each. Invalid probes: `2` attempted, `2` accepted;
invalid-route status findings: `0`.

| Finding category | Total |
|---|---:|
| Invalid targets, target inspection, source/index/sitemap reads, invalid data | 0 each |
| Inventory count mismatches | 1 (`route` expected 2,000, actual 1,972) |
| Source-only index slugs | 28 |
| Index-only source slugs | 28 |
| Source-only sitemap slugs | 0 |
| Sitemap-only source slugs | 0 |
| Source-only route slugs | 28 |
| Route-only source slugs | 0 |
| Duplicate source/index/sitemap/route slugs | 0 each |
| Index category mismatches | 0 |
| Index question mismatches | 0 |
| Index description mismatches | 5 |
| Index slug mismatches | 28 |
| Route network failures | 0 |
| Route timeout failures | 0 |
| Route status failures | 28 (all stale detail routes returned 404) |
| Route body read failures | 0 |
| Missing, duplicate, or mismatched page identity fields | 0 each |

Representative stale IDs were 28, 79, 245, 585, and 1204. The command
completed its full pass and returned the expected non-zero status for the
retained stale production state.

### GitHub workflow readback

Each `gh api` call used an explicit `30s` shell timeout and returned status 0.
The fresh `upstream/main` reference resolved to the exact 40-character SHA
`942980cc85a9fd4613c67dc89243a82cac732e14`.

| Workflow | State | Latest `main` run | `head_sha` | Status | Conclusion | URL |
|---|---|---:|---|---|---|---|
| `deploy.yml` (Vercel) | `disabled_manually` | `22211308372` | `ac6e452a9deb1a00f2ceaf08a50d7554e4d5d9a9` | completed | failure | `https://github.com/labring/sealos.io/actions/runs/22211308372` |
| `deploy-cloudflare.yml` (Cloudflare) | `active` | `30782942312` | `942980cc85a9fd4613c67dc89243a82cac732e14` | completed | success | `https://github.com/labring/sealos.io/actions/runs/30782942312` |

Vercel latest-main metadata: created `2026-02-20T04:28:36Z`, updated
`2026-02-20T04:39:21Z`, event `push`, branch `main`. Cloudflare latest-main
metadata: created `2026-08-03T03:54:00Z`, updated `2026-08-03T04:07:59Z`,
event `push`, branch `main`.

## Release Checkpoint

**BLOCKED - Task 2 was not started.** The existing Vercel production workflow
is `disabled_manually`; its latest `main` run is a failed run for a different
commit. The remote verifier also returned status 1 with 28 stale route
statuses, 28 slug mismatches, and 5 description mismatches. These facts leave
the exact-SHA Vercel plus Cloudflare release contract incomplete.

No merge, push, force-push, workflow-source edit, alternate deployment, or
workflow dispatch was performed. No deployment URL, approval, or accepted
production SHA is claimed. Task 3 remains unexecuted.

## Task Commits

1. **Task 1: Preserve the stale production baseline and release readiness state** - evidence-only; no production source changes
2. **Task 2: Complete the approved main release through existing production workflows** - BLOCKED before execution
3. **Task 3: Prove same-SHA deployments and complete production parity** - not executed because the release checkpoint is BLOCKED

## Decisions Made

- Preserved the historical `2026-08-03T23:02:39Z` stale snapshot beside the
  fresh `2026-08-04T00:22:56.697Z` readback.
- Treated `disabled_manually`, the mismatched failed Vercel run, and the
  failing remote parity result as blocking facts.
- Kept `PARITY-02` and `DELIVERY-02` pending for independent verification and
  a later approved release action.

## Deviations From Plan

None - the planned read-only Task 1 evidence collection completed. The
blocking human-action checkpoint was recorded and no release action was
attempted.

## Issues Encountered

The first bounded wrapper used the zsh read-only variable name `status` after
the verifier finished. The verifier output itself completed with the expected
stale-production failure; the command was rerun with `rc` to retain the exact
exit status `1` and completion time. No live request timed out.

## User Setup Required

The maintainer must restore the existing Vercel workflow and complete the
approved PR-to-`main` release before exact-SHA acceptance can proceed. This
execution does not wait for that action.

## Next Phase Readiness

The worktree is ready for independent `$gsd-verify-work 32`. That verifier
should retain this blocked evidence, keep both requirements pending, and only
revisit exact-SHA production acceptance after active Vercel and a fresh
passing remote readback are available.

## Self-Check: PASSED

- Historical stale baseline and fresh remote readback are both timestamped.
- Both workflow state records include latest-main SHA, status, conclusion, and URL.
- The exact current `upstream/main` SHA is recorded without claiming acceptance.
- No source, workflow, deployment, or remote data was changed.

---
*Phase: 32-sitemap-route-parity-and-production-verification*
*Plan: 04*
*Execution checkpoint: BLOCKED*
