---
phase: 31-canonical-index-generation-and-local-parity
plan: "03"
subsystem: build-tooling
tags: [nodejs, esm, parity, build-preflight, node-test]

requires:
  - phase: 31-01
    provides: Canonical source loading, parity comparison, stable mismatch taxonomy, and diagnostic formatting.
  - phase: 31-02
    provides: Deterministic generator command and canonical 2,000-record public index bytes.
provides:
  - Read-only source-to-index parity CLI with semantic and canonical-byte diagnostics.
  - Package build and analyzer preflight before every repository-owned Next invocation.
  - Timed build and analyzer fail-fast coverage with parity as the first measured stage.
  - Node.js 20 local acceptance evidence for both static-export entry points.
affects: [phase-32, faq-search, ai-quick-reference, cloudflare-build, docker-build]

tech-stack:
  added: []
  patterns:
    - Keep parity read-only and route every finding through the shared structured comparison and formatter.
    - Gate package and direct timed-build Next invocations with the same verifier command.

key-files:
  created:
    - scripts/verify-ai-faq-index.mjs
  modified:
    - package.json
    - scripts/ai-faq-index.mjs
    - scripts/ai-faq-index.test.mjs
    - scripts/measure-build-pipeline.js
    - scripts/measure-build-pipeline.test.mjs

key-decisions:
  - "The verifier reads source and index bytes, delegates all parity semantics to shared helpers, and returns process status without publishing files."
  - "Both package builds run verify:ai-faq-index before Next while retaining root-locale normalization after Next."
  - "Timed build and analyzer modes use AI FAQ parity as their first stage and stop with only completed timing rows when it fails."
  - "Hosted current-commit CI and Vercel observations remain a post-push evidence step because this execution stayed local and read-only."

patterns-established:
  - "Expose CLI logic through injected paths and streams so success and failure mutation behavior can be asserted directly."
  - "Assert package command strings and measured stage arrays exactly to keep deployment entry-point ordering reviewable."

requirements-completed: [PARITY-01, DELIVERY-01]

coverage:
  - id: D1
    description: Read-only semantic and canonical-byte parity for the complete FAQ source and public index.
    requirement: PARITY-01
    verification:
      - kind: unit
        ref: scripts/ai-faq-index.test.mjs#runVerifyFAQIndex reports stale fixture categories without mutation
        status: pass
      - kind: integration
        ref: scripts/ai-faq-index.test.mjs#verify-ai-faq-index CLI accepts the committed corpus without mutation
        status: pass
      - kind: integration
        ref: npm run verify:ai-faq-index
        status: pass
    human_judgment: false
  - id: D2
    description: Package and timed static-export paths execute parity before Next and stop immediately on parity failure.
    requirement: DELIVERY-01
    verification:
      - kind: unit
        ref: scripts/measure-build-pipeline.test.mjs#runPipeline stops after failed FAQ parity before spawning Next
        status: pass
      - kind: integration
        ref: npm run build
        status: pass
      - kind: integration
        ref: npm run build:analyze
        status: pass
    human_judgment: false

duration: 47 min
completed: 2026-08-04
status: complete
---

# Phase 31 Plan 03: Read-Only FAQ Parity Build Gate Summary

Verified artifacts: `scripts/verify-ai-faq-index.mjs`, package build scripts,
and the direct timed-build pipeline.

**A read-only 2,000-record semantic and byte verifier now blocks standard,
analyzer, and timed static exports before Next.js can consume stale FAQ data.**

## Performance

- **Duration:** 47 min
- **Started:** 2026-08-03T18:21:00Z
- **Completed:** 2026-08-03T19:08:12Z
- **Tasks:** 2
- **Implementation files modified:** 6

## Accomplishments

- Added `runVerifyFAQIndex()` and its process entry point with injected paths
  and streams, exit status 0/1, stdout success, stderr failure, and zero writes.
- Covered 12 representative stale fixtures while printing all 16 D-06 category
  totals, stable capped details, serialized expected/actual values, and the
  exact regeneration command.
- Added the three D-16 package commands and placed `verify:ai-faq-index` before
  Next in both package build entry points.
- Made AI FAQ parity the first stage in direct timed build and analyzer modes,
  with an injected failure test proving that no Next process is spawned.
- Preserved and executed the established exact-slug and static-route commands.
- Completed real Node.js 20 production and analyzer static exports with 6,179
  generated pages while preserving index bytes and Git status.

## TDD Evidence

| Gate | Commit | Evidence |
| --- | --- | --- |
| Task 1 RED | `f619889b4e1900828d71be7ec1e8b87741007210` | Node 20 failed with `ERR_MODULE_NOT_FOUND` for the planned verifier module. |
| Task 1 GREEN | `3202b1b2f83d1f1e0791fb89354c4b3150622097` | Verifier process, injected success/failure, full-corpus, and mutation assertions passed. |
| Task 2 RED | `c1a8f600a8b1f562f4e6b0846ef8d594c1a29d03` | Four command and stage-order assertions failed because parity had not yet been wired. |
| Task 2 GREEN | `b9615c9c4996b9b3f539cf3708dc13d41588a396` | Package gates, timed-stage arrays, and pre-Next failure behavior passed: 57 FAQ tests and 8 pipeline tests. |
| REFACTOR review | included in GREEN | The thin verifier and shared formatter already represented the smallest coherent boundary; the review produced no semantic cleanup. |

## Task Commits

1. **Task 1 RED: verifier failure contract** - `f619889b4e1900828d71be7ec1e8b87741007210`
2. **Task 1 GREEN: read-only verifier** - `3202b1b2f83d1f1e0791fb89354c4b3150622097`
3. **Task 2 RED: build preflight contract** - `c1a8f600a8b1f562f4e6b0846ef8d594c1a29d03`
4. **Task 2 GREEN: package and timed-build gates** - `b9615c9c4996b9b3f539cf3708dc13d41588a396`

## Acceptance Evidence

Every accepted runtime command used
`/Users/longnv/.nvm/versions/node/v20.20.0/bin/node` and reported Node.js
20.20.0.

| Command | Result |
| --- | --- |
| `npm run test:ai-faq-index` | PASS: 57 tests, 0 failures, including 12 stale fixture cases. |
| `npm run test:ai-faq-slugs` | PASS: 2,000 exact slugs verified; 288 ambiguous normalized groups rejected. |
| `npm run verify:ai-faq-index` | PASS: 2,000 records; index bytes unchanged. |
| `scripts/measure-build-pipeline.test.mjs` via the Node test runner | PASS: 8 tests, including first-stage parity and pre-Next fail-fast behavior. |
| `npm run lint` | PASS. |
| Full non-build suite | PASS in 6.59 seconds. |
| `npm run build` | PASS in 171.27 seconds; parity preceded Next; 6,179 static pages generated. |
| `npm run build:analyze` | PASS in 162.74 seconds; parity preceded Next; 6,179 static pages generated. |
| `npm run verify:ai-faq-routes` | PASS: 2,000 sitemap URLs, 2 collision pages, and unresolved routes verified at `out`. |
| `node --check` and Prettier | PASS for all changed implementation files. |
| `git diff --check` | PASS. |

### Read-Only Failure Proof

- A one-record temporary fixture with question drift returned status 1.
- The output reported all 16 category totals, an actionable question detail,
  and `Regenerate with: npm run generate:ai-faq-index` as its final line.
- Fixture bytes were identical before and after verification.
- Repository `git status --porcelain=v1` was identical before and after the
  failed preflight.
- The timed-pipeline failure test recorded only the failed `AI FAQ parity`
  timing row and observed zero local Next binary spawns.

### Production Corpus Proof

| Property | Result |
| --- | --- |
| Source records | 2,000 |
| Index records | 2,000 |
| Index SHA-256 | `b9d9373d897dcce3cfc142b3a347251f5e576b1e4f9a1710ba7bfb1e1c912484` |
| Semantic findings | 0 |
| Canonical-byte findings | 0 |
| Production build index mutation | 0 bytes |
| Analyzer build index mutation | 0 bytes |
| Build Git status mutation | none |

## CI And Deployment Evidence

- `.github/workflows/deploy-cloudflare.yml` and
  `.github/workflows/preview-cloudflare.yml` select Node 20 and invoke
  `npm run build`, so both inherit the package parity preflight.
- `Dockerfile` invokes `npm run build`, so container builds inherit the same
  preflight.
- The latest branch Cloudflare preview is the successful historical run
  [30618347432](https://github.com/labring/sealos.io/actions/runs/30618347432)
  for SHA `01d8a18376aff95ba8ceb74f090aca080a787385`; its log predates the current
  parity commits and therefore supplies runtime-path history only.
- PR [#315](https://github.com/labring/sealos.io/pull/315) is merged at that
  historical SHA. The current plan commits remain local.
- Vercel workflows select Node 20 and call `vercel build`; dashboard Build
  Command ownership is external to this checkout.
- Current-commit hosted CI and Vercel log evidence requires a push and hosted
  run. Read-only inspection found zero current branch `preview.yml` runs, zero
  GitHub deployments, no local Vercel project link, and no Vercel CLI.

## Files Created/Modified

- `scripts/verify-ai-faq-index.mjs` - Read-only verifier CLI and injected
  execution boundary.
- `scripts/ai-faq-index.mjs` - Concise success output while preserving grouped
  failure totals and details.
- `scripts/ai-faq-index.test.mjs` - Process, fixture, mutation, package command,
  and stale taxonomy coverage.
- `scripts/measure-build-pipeline.js` - First-stage parity for build and
  analyzer modes.
- `scripts/measure-build-pipeline.test.mjs` - Exact stage-order and pre-Next
  failure assertions.
- `package.json` - Generator, verifier, test, build, and analyzer command
  contract.

## Decisions Made

- Kept verification read-only and reused canonical source loading, comparison,
  serialization, and formatting boundaries.
- Used direct `&&` package sequencing so verifier status controls whether the
  Next process can start.
- Added the same package verifier as the first direct timed-build stage so
  timing paths share identical parity semantics.
- Retained `test:ai-faq-slugs` and `verify:ai-faq-routes` unchanged and verified
  their established production-corpus behavior.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Isolated concurrent Next build output collisions**

- **Found during:** Task 2 acceptance builds
- **Issue:** Separate executor-owned Next processes wrote the same ignored
  `.next` directory during one production attempt and one analyzer attempt,
  producing missing generated server-module failures.
- **Fix:** Waited for each foreign process to exit, removed only the ignored
  `.next` cache, and reran each command exclusively from an empty cache.
- **Files modified:** none; `.next` is generated and gitignored.
- **Verification:** Exclusive Node 20 production and analyzer builds passed,
  with unchanged index SHA and unchanged Git status.

## Issues Encountered

- `build:analyze` prints the existing `Bundle analyzer not available, skipping
  analysis: require is not defined` warning from the ESM Next configuration;
  the analyzer-mode static export itself completed successfully.
- Execute-phase initialization normalized the phase label and reset the current
  plan position. Closeout restores the canonical state label and completed
  plan position through the GSD state handlers.
- Current-commit hosted CI and Vercel observations remain outside this local,
  read-only execution scope and are recorded above with the available evidence.

## User Setup Required

None - local verification uses repository files and Node.js built-ins.

## Next Phase Readiness

- Phase 31 repository-owned source, generation, parity, package, timed-build,
  and legacy route contracts are executable on Node.js 20.
- Phase 32 retains sitemap and deployed-route parity ownership.
- A future pushed commit can supply current-SHA hosted CI and Vercel log
  observations without changing the repository gate implementation.

## Self-Check: PASSED

- All six implementation artifacts and this summary exist in the mandated
  worktree.
- All four RED and GREEN commits resolve in the target branch history.
- Node 20 focused tests, full non-build suite, production build, analyzer build,
  legacy slug and route verification, syntax, Prettier, and `git diff --check`
  passed.
- Success and deliberately stale verifier runs preserved index, fixture, and
  repository status bytes as asserted.

---
*Phase: 31-canonical-index-generation-and-local-parity*
*Completed: 2026-08-04*
