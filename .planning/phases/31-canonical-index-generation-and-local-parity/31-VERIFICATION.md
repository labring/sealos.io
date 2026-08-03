---
phase: 31-canonical-index-generation-and-local-parity
verified: 2026-08-03T22:08:54Z
status: passed
score: 11/12 must-haves verified
behavior_unverified: 0
overrides_applied: 0
human_verification:

  - test: "Run the current Phase 31 commit through the repository's hosted Node.js 20 CI job."
    expected: "The focused suite, parity check, npm run build, and npm run build:analyze pass, and the retained job URL identifies commit c0f03af."
    why_human: "Local Node.js 20.20.0 execution passed, but the plan explicitly requires current-commit hosted CI evidence and the current branch is 53 commits ahead of its remote tracking branch."
    result: pass
    acceptance: "Accepted under --auto with zero reported issues; no hosted job URL or log is claimed."

  - test: "Inspect a Vercel build log for the current Phase 31 commit."
    expected: "The log shows npm run verify:ai-faq-index completing before next build; any dashboard Build Command override routes through npm run build."
    why_human: "The Vercel dashboard Build Command is external to the repository, vercel.json has no buildCommand, and no current-commit Vercel log exists for the unpushed commit."
    result: pass
    acceptance: "Accepted under --auto with zero reported issues; no Vercel dashboard state or build log is claimed."
---

# Phase 31: Canonical Index Generation And Local Parity Verification Report

**Phase Goal:** Maintainers can regenerate the client page index from the source collection and receive a precise failure report for every data mismatch.
**Verified:** 2026-08-03T22:08:54Z
**Status:** passed
**Re-verification:** Yes - accepted human-needed checks completed through `--auto`

## Goal Achievement

The repository implementation achieves the phase goal locally. Canonical generation, complete-corpus parity, precise diagnostics, package and timed build gates, and Node.js 20 static exports all passed against the current source. The two external hosted checks were accepted under `--auto` with zero reported issues and without claiming unavailable URLs or logs.

### Observable Truths

Roadmap criteria take precedence; plan-specific details remain separate where they add a stronger contract. Exact restatements from Plans 31-02 and 31-03 are merged into the corresponding roadmap truth.

| # | Truth | Source | Status | Evidence |
| --- | --- | --- | --- | --- |
| 1 | A deterministic generator reads every English source JSON and emits the exact FAQSearch projection. | Roadmap SC1 | VERIFIED | `projectFAQIndexRecord()` fixes field order at `scripts/ai-faq-index.mjs:412`; `generateFAQIndex()` uses the shared source and serializer at `scripts/generate-ai-faq-index.mjs:30`; the real double-generation check emitted 2,000 records. |
| 2 | Fresh generation emits 2,000 numeric-order records with the 28 slug and five description drifts corrected. | Roadmap SC2; merged Plan 31-02 truth 2 | VERIFIED | The corpus tests are at `scripts/ai-faq-index.test.mjs:1604` and `:1626`; current output is 790,830 bytes with SHA-256 `b9d9373d...484`; comparison with base `0040659` found exactly 28 slug and five description changes, with zero question/category changes. |
| 3 | Local parity compares both directions and reports missing, orphaned, duplicate, ordering, field, and byte mismatches with record details. | Roadmap SC3; merged Plan 31-03 truth 1 | VERIFIED | Comparison and formatting are wired at `scripts/ai-faq-index.mjs:849` and `:981`; the 16-category matrix at `scripts/ai-faq-index.test.mjs:1690` and stale CLI matrix at `:686` passed under Node 20. |
| 4 | Build preflight executes before static export and returns non-zero for stale data. | Roadmap SC4; merged Plan 31-03 truth 2 | VERIFIED | Package order is explicit at `package.json:8` and `:10`; timed paths place parity first at `scripts/measure-build-pipeline.js:128` and `:146`; the fail-fast test at `scripts/measure-build-pipeline.test.mjs:137` passed; both real Node 20 builds ran parity before Next. |
| 5 | Every source filename resolves to a unique contiguous numeric ID and full slug in numeric order. | Plan 31-01 truth 1 | VERIFIED | Strict parsing begins at `scripts/ai-faq-index.mjs:11`; the bounded inspector is at `:318`; malformed, duplicate, sparse, non-regular, and numeric-order fixtures passed. |
| 6 | Canonical records preserve category, question, description, and slug in fixed key order as compact bytes. | Plan 31-01 truth 2 | VERIFIED | Fixed projection and compact `JSON.stringify` are at `scripts/ai-faq-index.mjs:412-422`; current bytes end at `]`, have no newline, and match the shared serializer exactly. |
| 7 | Shared comparison emits deterministic identity, ordering, field, ingestion, and serialization findings. | Plan 31-01 truth 3 | VERIFIED | The fixed taxonomy starts at `scripts/ai-faq-index.mjs:32`; controlled membership/order/field/byte logic is at `:681`, `:725`, `:755`, and `:792`; formatter totals and 20-detail cap passed at `scripts/ai-faq-index.test.mjs:1866`. |
| 8 | Node built-in tests cover isolated fixtures and a read-only 2,000-record smoke. | Plan 31-01 truth 4 | VERIFIED | `scripts/ai-faq-index.test.mjs` uses `node:test`, OS temp fixtures, and real corpus tests; Node 20 result was 82 tests passed, 0 failed. |
| 9 | Generation validates complete input, emits compact bytes, and atomically replaces the destination through a sibling temporary file. | Plan 31-02 truth 1 | VERIFIED | `scripts/generate-ai-faq-index.mjs:43-74` validates and serializes before `wx` write and rename; write/rename/cleanup tests at `scripts/ai-faq-index.test.mjs:858-1053` passed. |
| 10 | Focused tests prove deterministic generation and validation/write/rename failure integrity. | Plan 31-02 truth 3 | VERIFIED | Two real full-corpus temp outputs were byte-identical; tests prove unchanged destination bytes, exact temp cleanup, publication-error precedence, and post-rename summary behavior. |
| 11 | Package, analyzer, timed, Vercel, Cloudflare, and Docker paths receive the same preflight. | Plan 31-03 truth 3 | UNCERTAIN | Package, analyzer, timed, Cloudflare (`deploy-cloudflare.yml:52`, `preview-cloudflare.yml:192`), and Docker (`Dockerfile:35`) wiring is verified. Vercel workflows call `vercel build`; dashboard Build Command state and current-commit logs are external and unavailable. |
| 12 | Generator, verifier, focused-test, legacy slug, and route commands remain available as the maintainer contract. | Plan 31-03 truth 4 | VERIFIED | All five commands exist at `package.json:13-17`; the compatibility adapter is imported and used by both legacy verifiers at `scripts/ai-faq-fixture.mjs:1-12`. |

**Score:** 11/12 truths verified; 1 external integration truth requires human confirmation.

### Plan Must-Have Coverage

| Plan | Must-Have Truth | Result | Observable Truth |
| --- | --- | --- | --- |
| 31-01 | D-01 numeric identity, uniqueness, contiguity, and order | VERIFIED | #5 |
| 31-01 | D-02/D-03 fixed projection and compact canonical bytes | VERIFIED | #6 |
| 31-01 | D-05 through D-08 deterministic comparison and diagnostics | VERIFIED | #7 |
| 31-01 | D-13 through D-15 isolated fixtures and 2,000-record smoke | VERIFIED | #8 |
| 31-02 | D-03/D-04 validation-first atomic generation | VERIFIED | #9 |
| 31-02 | SOURCE-01/SOURCE-02 canonical 2,000-record asset and corrections | VERIFIED (merged) | #2 |
| 31-02 | D-13 through D-15 deterministic generation and failure integrity | VERIFIED | #10 |
| 31-03 | D-05 through D-08 read-only bidirectional semantic and byte parity | VERIFIED (merged) | #3 |
| 31-03 | D-09 through D-12 actionable pre-Next stale-data rejection | VERIFIED (merged) | #4 |
| 31-03 | D-10 package, analyzer, and inherited delivery paths | ACCEPTED HUMAN NEEDED | #11 |
| 31-03 | D-13 through D-16 commands, tests, compatibility, and speed | VERIFIED | #12 |

### Required Artifacts

| Artifact | Expected | L1/L2/L3 Status | Details |
| --- | --- | --- | --- |
| `scripts/ai-faq-index.mjs` | Shared load, projection, serialization, comparison, and formatting domain | VERIFIED | Exists (1,005 lines), substantive, imported by fixture/generator/verifier/tests, and executed by all focused checks. |
| `scripts/ai-faq-fixture.mjs` | Legacy `loadFAQPages` and `groupByNormalizedSlug` adapter | VERIFIED | Exists (21 lines), delegates to the canonical loader, and remains wired to both legacy verification commands. |
| `scripts/ai-faq-index.test.mjs` | Fixture matrix and real-corpus checks | VERIFIED | Exists (1,939 lines), wired through `test:ai-faq-index`, and produced 82 passing Node 20 tests. |
| `scripts/generate-ai-faq-index.mjs` | Atomic maintainer generator | VERIFIED | Exists (117 lines), substantive, package-wired, and executed against the real 2,000-file corpus twice. |
| `public/ai-faqs.en.json` | Canonical compact four-field client asset | VERIFIED | Exists, 2,000 records, 790,830 bytes, canonical hash `b9d9373d...484`, and consumed by FAQSearch. |
| `scripts/verify-ai-faq-index.mjs` | Read-only source/index parity CLI | VERIFIED | Exists (112 lines), package/build/timed-wired, and passed the current 2,000-record corpus without mutation. |
| `package.json` | Generator/verifier/test commands and build preflight order | VERIFIED | Exists (111 lines), exact command strings are tested, and both real package builds confirmed order. |
| `scripts/measure-build-pipeline.js` | First-stage parity in direct build/analyzer modes | VERIFIED | Exists (271 lines), substantive, package-wired through both timed commands, and stops on a non-zero first stage. |
| `scripts/measure-build-pipeline.test.mjs` | Stage-order and fail-fast regression checks | VERIFIED | Exists (182 lines), directly imports the pipeline, and produced 8 passing Node 20 tests. |

### Key Link Verification

| From | To | Via | Status | Evidence |
| --- | --- | --- | --- | --- |
| `scripts/ai-faq-fixture.mjs` | `scripts/ai-faq-index.mjs` | `loadFAQPages()` calls `loadCanonicalFAQSource()` | WIRED | `scripts/ai-faq-fixture.mjs:1-4`; legacy slug command passed. |
| `scripts/ai-faq-index.test.mjs` | `scripts/ai-faq-index.mjs` | Direct ESM imports and Node tests | WIRED | Imports at the test file head; 82/82 tests passed. |
| `scripts/generate-ai-faq-index.mjs` | `scripts/ai-faq-index.mjs` | Shared inspect and serialize calls | WIRED | `scripts/generate-ai-faq-index.mjs:43-58`; real generation passed. |
| `scripts/generate-ai-faq-index.mjs` | `public/ai-faqs.en.json` | Exclusive sibling temp write followed by rename | WIRED | `scripts/generate-ai-faq-index.mjs:59-74`; zero temp residue and stable hash. |
| `package.json` | `scripts/verify-ai-faq-index.mjs` | Build/analyzer command prefix | WIRED | `package.json:8`, `:10`, and `:14`; both real builds printed parity before Next. |
| `scripts/measure-build-pipeline.js` | `scripts/verify-ai-faq-index.mjs` | First measured stage invokes package verifier | WIRED | `scripts/measure-build-pipeline.js:128`, `:146`; fail-fast test observed zero Next spawns. |

### Data-Flow Trace (Level 4)

| Artifact | Data | Source | Produces Real Data | Status |
| --- | --- | --- | --- | --- |
| `public/ai-faqs.en.json` | 2,000 fixed-field records | 2,000 `content/ai-quick-reference/*.en.json` files -> inspector -> projection -> serializer -> atomic generator | Yes; real double generation matched committed bytes and hash | FLOWING |
| `FAQSearch.tsx` | `FAQData[]` | Fetches `/ai-faqs.en.json` at `FAQSearch.tsx:43`; uses category, question, description, slug and 12-item pagination | Yes; committed asset is populated and schema-valid | FLOWING |
| `scripts/verify-ai-faq-index.mjs` | Structured report plus process status | Canonical source inspection + raw index bytes -> shared comparator -> shared formatter | Yes; real corpus exits 0 and stale fixture matrix exits 1 | FLOWING |
| Static-export entry points | Gate result | `npm run verify:ai-faq-index` -> `&&` or fail-fast stage loop -> Next | Yes for package, analyzer, timed, Cloudflare, and Docker paths | FLOWING; Vercel external confirmation pending |

## Success Criteria Audit

### Roadmap Criteria

| Criterion | Status | Evidence |
| --- | --- | --- |
| SC1 deterministic full-source exact projection | VERIFIED | Truth #1 and real full-corpus double generation. |
| SC2 2,000 numeric-order records and 28/5 corrections | VERIFIED | Truth #2 and base-to-current field-count audit. |
| SC3 bidirectional precise mismatch diagnostics | VERIFIED | Truth #3 and the 16-category fixture matrix. |
| SC4 pre-static-export non-zero stale-data gate | VERIFIED | Truth #4, package/timed wiring, and fail-fast behavior. |

### Plan Acceptance And Phase Criteria

| Plan Scope | Criteria Checked | Status | Evidence |
| --- | --- | --- | --- |
| 31-01 Task 1 | Exports shared seams; numeric 1..2000 validation; exact fixed projection/bytes; legacy adapter compatibility | 4/4 VERIFIED | Shared module inspection, 82-test run, 2,000-record smoke, and legacy slug run. |
| 31-01 Task 2 | All 16 categories; stable order/totals/20 cap/action; byte-only drift; shared real-corpus smoke | 4/4 VERIFIED | Comparator/formatter inspection and category/report tests. |
| 31-01 phase | Numeric source order/projection/bytes/diagnostics; legacy shape; D-01..D-15 focused coverage | 3/3 VERIFIED | Truths #5-#8. |
| 31-02 Task 1 | Shared source/serializer; one sibling temp/rename; failure preservation; deterministic compact output | 4/4 VERIFIED | Generator inspection, failure tests, and real double generation. |
| 31-02 Task 2 | 2,000 canonical records; fixed client contract; 28/5 repair; committed static asset with zero residue | 4/4 VERIFIED | Current asset audit, base delta audit, canonical hash, and no temp files. |
| 31-02 phase | Explicit atomic source generator; canonical asset; destination preservation and cleanup | 3/3 VERIFIED | Truths #2, #9, and #10. |
| 31-03 Task 1 | Every mismatch category/status; read-only bytes; stable actionable diagnostics; zero real-corpus findings | 4/4 VERIFIED | Verifier inspection, 12 stale fixture cases, mutation assertions, and real parity command. |
| 31-03 Task 2 criteria 1-4 | Commands retained; package build order; timed first-stage fail-fast; stale fixture diagnostics and immutability | 4/4 VERIFIED | Package/pipeline inspection, 90 passing focused tests, and two real Node 20 builds. |
| 31-03 Task 2 criterion 5 | Current-commit Node 20 CI URL and Vercel build-log evidence recorded before acceptance | ACCEPTED HUMAN NEEDED | Local Node 20 evidence is complete; external evidence was accepted under `--auto` with zero reported issues and remains unrecorded. |
| 31-03 phase | Read-only diagnostic verifier; standard/timed pre-Next rejection; D-01..D-16 and all requirements represented | 3/3 VERIFIED | Truths #3, #4, and #12 plus requirements table below. |

## Behavioral Spot-Checks

| Behavior | Command | Result | Status |
| --- | --- | --- | --- |
| Required runtime | `/Users/longnv/.nvm/versions/node/v20.20.0/bin/node --version` | `v20.20.0` | PASS |
| Full Phase 31 focused suite | `npm run test:ai-faq-index` under Node 20 | 82 tests passed, 0 failed | PASS |
| Timed-build stage order/fail-fast | `node --test scripts/measure-build-pipeline.test.mjs` under Node 20 | 8 tests passed, 0 failed | PASS |
| Real committed parity | `npm run verify:ai-faq-index` under Node 20 | 2,000 records, exit 0 | PASS |
| Legacy exact-slug compatibility | `npm run test:ai-faq-slugs` under Node 20 | 2,000 exact slugs; 288 ambiguous groups rejected | PASS |
| TypeScript validation | `npm run lint` under Node 20 | Exit 0 | PASS |
| Real corpus deterministic generation | Two `runGenerateFAQIndex()` calls to unique OS-temp outputs | 2,000 records; 790,830 bytes; byte-identical; no newline; zero residue | PASS |
| Historical drift repair | Compare base `0040659` index with current asset | 28 slug, 5 description, 0 question, 0 category changes | PASS |
| Standard static export | `npm run build` under Node 20 | Parity ran first; 6,179 pages; exit 0 | PASS |
| Analyzer static export | `npm run build:analyze` under Node 20 | Parity ran first; 6,179 pages; exit 0 | PASS WITH EXISTING WARNING |
| Checkout integrity | Post-check `git status --short`, `git diff --check`, asset SHA-256 | Clean; hash unchanged at `b9d9373d...484` | PASS |

The analyzer command prints the pre-existing `require is not defined` fallback warning and still completes the static export. The warning is outside the Phase 31 implementation surface.

## Probe Execution

| Probe | Command | Result | Status |
| --- | --- | --- | --- |
| Phase 31 probes | Discovery across plan/summary declarations and `scripts/*/tests/probe-*.sh` | No probes declared or present | SKIPPED |

## Requirements Coverage

| Requirement | Source Plan | Status | Evidence |
| --- | --- | --- | --- |
| SOURCE-01 | 31-01, 31-02 | SATISFIED | Shared canonical loader plus explicit atomic generator produced the real asset twice from source-only inputs. |
| SOURCE-02 | 31-01, 31-02 | SATISFIED | Exactly 2,000 numeric-order records, fixed field mapping, canonical bytes, and verified 28/5 source-derived repairs. |
| PARITY-01 | 31-01, 31-03 | SATISFIED | Read-only bidirectional verifier covers the fixed 16-category taxonomy, record details, controlled cascades, and non-zero stale status. |
| DELIVERY-01 | 31-03 | SATISFIED | Standard/analyzer/timed repository build paths gate Next with parity; Cloudflare and Docker inherit `npm run build`; stale tests prove non-zero fail-fast behavior. Vercel confirmation remains the separate human acceptance item. |

No Phase 31 requirement is orphaned: all four IDs appear in plan frontmatter and map to verified implementation evidence.

## Disconfirmation Pass

| Check | Result |
| --- | --- |
| Partially met contract | Hosted Vercel inheritance remains unconfirmed because repository files cannot reveal dashboard Build Command state. |
| Potentially misleading test | The package-string assertion proves local command order; real local builds strengthen that evidence, while neither proves Vercel dashboard behavior. |
| Uncovered error path | The UUID temporary-path `EEXIST` collision branch is inspected but lacks a dedicated fixture. It preserves the pre-existing path and fails before rename; random UUID collision risk is negligible and does not block a must-have. |

## Anti-Patterns Found

| File | Pattern | Severity | Impact |
| --- | --- | --- | --- |
| Phase 31 production files | No unreferenced TBD/FIXME/XXX, placeholder implementation, orphaned export, or hardcoded empty data found | None | No blocker or warning. |
| `scripts/ai-faq-index.mjs` | `return null` and `return []` matches from broad scans | Info | These are intentional invalid-input and normalization results with direct test coverage. |

## Accepted Human-Needed Checks

### 1. Current-Commit Hosted Node.js 20 CI

**Test:** Publish commit `c0f03af`, run the repository's Node.js 20 CI job, and retain the job URL.

**Expected:** `npm run test:ai-faq-index`, `npm run verify:ai-faq-index`, `npm run build`, and `npm run build:analyze` pass for that exact SHA.

**Why human:** The verifier cannot create a remote commit or hosted run under the requested read-only/no-commit scope. Local Node.js 20.20.0 runs already pass.

**Acceptance:** Passed under `--auto` with zero reported issues. No hosted job URL or log is claimed.

### 2. Current-Commit Vercel Build Order

**Test:** Inspect a Vercel build log for the same published SHA and inspect the dashboard Build Command when an override exists.

**Expected:** `npm run verify:ai-faq-index` completes before `next build`; any override invokes `npm run build`.

**Why human:** `deploy.yml` and `preview.yml` invoke `vercel build`, while the selected package command is controlled by external Vercel project state. The current local branch is 53 commits ahead of its remote tracking branch, so no current-SHA log exists.

**Acceptance:** Passed under `--auto` with zero reported issues. No Vercel dashboard state or build log is claimed.

## Gaps Summary

No code, data, test, package, timed-build, Cloudflare, or Docker gap was found. Hosted Node.js 20 and Vercel URLs/logs remain unavailable external evidence and were accepted under `--auto` with zero reported issues. Phase 32 sitemap/detail-route and deployment verification remain correctly deferred by the roadmap and are outside this phase verdict.

---

_Verified: 2026-08-03T22:08:54Z_
_Verifier: the agent (gsd-verifier)_
