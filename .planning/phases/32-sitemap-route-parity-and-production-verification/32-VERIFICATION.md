---
phase: 32-sitemap-route-parity-and-production-verification
verified: 2026-08-04T00:49:07Z
status: gaps_found
score: 14/16 must-haves verified
behavior_unverified: 0
overrides_applied: 0
human_verification:
  - test: "Run the retained complete verifier against https://sealos.io."
    expected: "Four 2,000-entry inventories, 2,000 direct HTTP 200 detail routes, and zero findings."
    result: blocked
    evidence: "Fresh readback at 2026-08-04T00:47:45.296Z returned status 1 with 1,972 routes, 28 route 404 findings, 28 slug drifts, and five description drifts."
  - test: "Confirm successful Vercel and Cloudflare production runs for one exact upstream/main SHA."
    expected: "Both workflow URLs identify the same accepted 40-character SHA and completed success."
    result: blocked
    evidence: "Cloudflare succeeded for 942980cc85a9fd4613c67dc89243a82cac732e14; Vercel is disabled_manually and its latest main run failed for another SHA."
---

# Phase 32: Sitemap Route Parity And Production Verification Report

**Phase Goal:** Every page-index entry has the same canonical slug in the sitemap and deployed detail-page route.
**Verified:** 2026-08-04T00:49:07Z
**Status:** gaps_found
**Re-verification:** Fresh independent Node.js 20 local build, production crawl, and GitHub workflow readback

## Goal Achievement

The local implementation satisfies the complete four-set and four-field contract for all 2,000 records. Production acceptance remains blocked: the live route inventory is 1,972, the deployed index retains 28 stale slugs and five stale descriptions, 28 attempted index routes return 404, and Vercel has no successful run for the accepted `upstream/main` SHA.

### Must-Have Score

| # | Must-have truth | Source | Status | Evidence |
| --- | --- | --- | --- | --- |
| 1 | Findings are collected before status selection with fixed categories and deterministic numeric order. | 32-01 | VERIFIED | `runVerifyFAQRoutes()` selects status after normalization and formatting at `scripts/verify-ai-faq-routes.mjs:1363`; deterministic report tests passed. |
| 2 | Four inventories expose totals, uniqueness, duplicates, and bidirectional membership facts. | 32-01 | VERIFIED | Inventory mutation coverage passed at `scripts/verify-ai-faq-routes.test.mjs:244`; fresh local totals were 2,000/2,000/2,000/2,000. |
| 3 | Title, H1, description, and canonical extraction supports nested and escaped generated markup. | 32-01 | VERIFIED | Identity fixtures passed at `scripts/verify-ai-faq-routes.test.mjs:304`; fresh local identity findings were zero across 8,000 fields. |
| 4 | The retained local and optional HTTP(S) command remains the public interface. | 32-01 | VERIFIED | `package.json:17` retains `node scripts/verify-ai-faq-routes.mjs`; both local and remote commands executed. |
| 5 | Local source, index, sitemap, and readable route sets match for all 2,000 slugs. | 32-02 | VERIFIED | Fresh `npm run build` ended with four 2,000-entry inventories and zero findings. |
| 6 | Every local page has exact title, H1, description, and canonical identity. | 32-02 | VERIFIED | Fresh build checked 2,000 pages and 8,000 identity fields with zero findings. |
| 7 | Local reads remain bounded at 32 and invalid normalized/numbered routes remain rejected. | 32-02 | VERIFIED | Batch-bound test passed at `scripts/verify-ai-faq-routes.test.mjs:459`; both fresh invalid probes returned accepted 404 statuses. |
| 8 | Standard and timed builds run route parity after export normalization. | 32-02 | VERIFIED | Build ordering is explicit at `package.json:8`; the fresh build and 9/9 pipeline tests passed. |
| 9 | Remote mode reads the live index and sitemap and attempts every valid index route once. | 32-03 | VERIFIED | Remote worker fixture passed at `scripts/verify-ai-faq-routes.test.mjs:624`; the fresh production run attempted 2,000 routes. |
| 10 | Exactly eight workers, 10-second timeouts, manual redirects, and zero retries bound remote requests. | 32-03 | VERIFIED | Constants and request options are applied in `scripts/verify-ai-faq-routes.mjs:1104`; concurrency and option assertions passed. |
| 11 | Every direct HTTP 200 body is consumed once for all four identity checks. | 32-03 | VERIFIED | The body is reused for identity inspection at `scripts/verify-ai-faq-routes.mjs:1284`; the remote fixture and fresh 7,888-field readback completed. |
| 12 | Remote diagnostic categories remain complete and deterministic across completion order. | 32-03 | VERIFIED | Mixed-failure and reverse-order tests passed at `scripts/verify-ai-faq-routes.test.mjs:674` and `:704`. |
| 13 | The release record preserves the stale baseline and a fresh production readback. | 32-04 | VERIFIED | `32-04-SUMMARY.md:91` retains the baseline and `:114` retains the prior fresh run; this report adds the bounded 2026-08-04T00:47:45.296Z readback. |
| 14 | One accepted upstream SHA owns successful Vercel and Cloudflare production workflow URLs. | 32-04 | FAILED | Cloudflare run 30782942312 succeeded for `942980cc85a9fd4613c67dc89243a82cac732e14`; Vercel is `disabled_manually` and latest run 22211308372 failed for another SHA. |
| 15 | Production reports four 2,000 counts, 2,000 direct HTTP 200 detail routes, and zero findings. | 32-04 | FAILED | Fresh production result: route 1,972; direct HTTP 200 1,972; 28 route 404 findings; 28 slug mismatches; five description mismatches; exit 1. |
| 16 | DELIVERY-02 stays pending while workflow or live acceptance evidence is incomplete. | 32-04 | VERIFIED | `.planning/REQUIREMENTS.md:38` and `:91` retain DELIVERY-02 as pending; PARITY-02 remains pending at `:28` and `:89`. |

**Score:** 14/16 must-haves verified; two production release truths failed.

### Roadmap Success Criteria

| Criterion | Result | Evidence |
| --- | --- | --- |
| Built sitemap contains exactly the 2,000 source and index slugs. | VERIFIED | Fresh static build reported source/index/sitemap/route totals of 2,000 with zero duplicates or membership findings. |
| Static verifier checks all 2,000 URLs and four identity fields. | VERIFIED | 2,000 routes, 8,000 fields, two accepted invalid probes, zero findings. |
| Deployed verifier reports 2,000 routes and zero stale URLs. | FAILED | Fresh live route total 1,972 with 28 source-only routes and 28 route 404 findings. |
| Release evidence binds production verification to one exact commit. | FAILED | Cloudflare has exact-SHA success; Vercel same-SHA success and final passing live evidence remain outstanding. |

## Requirement Coverage

| Requirement | Status | Evidence |
| --- | --- | --- |
| PARITY-02 | PENDING / BLOCKED | Local four-set parity passes; the deployed route set has 1,972 entries and 28 canonical source routes remain absent. |
| DELIVERY-02 | PENDING / BLOCKED | Production has 28 stale index slugs, five stale descriptions, 28 detail-route 404 findings, and incomplete same-SHA workflow evidence. |

## Required Artifacts

| Artifact | Expected | Status | Details |
| --- | --- | --- | --- |
| `scripts/verify-ai-faq-routes.mjs` | Four-set, identity, local, remote, reporting, and CLI boundary | VERIFIED | Exists, substantive, package-wired, import-safe, and exercised locally and remotely. |
| `scripts/verify-ai-faq-routes.test.mjs` | Deterministic local and remote regression coverage | VERIFIED | Exists and passed 19/19 tests under Node.js 20.20.0. |
| `package.json` | Retained command and post-normalization build gate | VERIFIED | Standard build invokes the index gate, Next build, normalization, then route gate. |
| `scripts/measure-build-pipeline.js` | Equivalent timed route stage | VERIFIED | Stage ordering is implemented and exercised by the focused suite. |
| `scripts/measure-build-pipeline.test.mjs` | Timed ordering and fail-fast coverage | VERIFIED | Passed 9/9 tests under Node.js 20.20.0. |
| `32-04-SUMMARY.md` | Stale baseline, workflow state, exact SHA, and live result | VERIFIED | Exists and truthfully records the blocked production checkpoint. |

## Key Link Verification

| From | To | Status | Evidence |
| --- | --- | --- | --- |
| Route verifier | Canonical source/index domain | WIRED | `loadCanonicalFAQSource` is imported and exercised by local and remote runs. |
| Route tests | Route verifier | WIRED | Direct imports produced 19 passing tests. |
| Package build | Route verifier | WIRED | Fresh `npm run build` executed route verification after normalization. |
| Timed pipeline | Route verifier | WIRED | Nine pipeline tests confirm stage order and fail-fast behavior. |
| Remote verifier | Live index, sitemap, and detail routes | WIRED | Fresh bounded crawl attempted 2,000 production index routes. |
| `upstream/main` | Cloudflare workflow | VERIFIED | Run 30782942312 completed successfully for exact SHA `942980cc85a9fd4613c67dc89243a82cac732e14`. |
| `upstream/main` | Vercel workflow | FAILED | Workflow state is `disabled_manually`; latest main run 22211308372 failed for SHA `ac6e452a9deb1a00f2ceaf08a50d7554e4d5d9a9`. |
| Production summary | `https://sealos.io` | FAILED | Fresh retained command returned exit 1 with the exact mismatches above. |

## Verification Commands

| Check | Result |
| --- | --- |
| `node --test scripts/verify-ai-faq-routes.test.mjs` | PASS: 19 tests |
| `node --test scripts/measure-build-pipeline.test.mjs` | PASS: 9 tests |
| `npm run test:ai-faq-index` | PASS: 82 tests |
| `npm run test:ai-faq-slugs` | PASS: 2,000 exact slugs; 288 ambiguous normalized groups rejected |
| `npm run verify:ai-faq-index` | PASS: 2,000 records |
| `npm run lint` | PASS |
| `node --check` on route verifier, pipeline, and index domain | PASS |
| Prettier check on all Phase 32 changed implementation files | PASS |
| `npm run build` | PASS: 6,179 static pages; route gate 2,000; identity fields 8,000; findings 0 |
| `npm run verify:ai-faq-routes -- https://sealos.io` | FAIL as expected from production state: route 1,972; route-status failures 28; slug mismatches 28; description mismatches 5 |
| GSD artifact verification | PASS: plans 32-01 through 32-04 artifacts exist; implementation key links pass; two 32-04 external workflow links remain unresolved |
| GSD commit verification | PASS: 18/18 Phase 32 commits exist |

The Node built-in suites passed 110 tests in total. A broader Prettier read
across both production workflows reported pre-existing formatting drift in
`.github/workflows/deploy.yml`; all Phase 32 changed implementation files pass
Prettier.

## Artifact Scan

`gsd-tools audit-open --json` completed at `2026-08-04T00:52:50.635Z` and
reported five open records:

- Phase 32: one partial UAT record and one `gaps_found` verification record.
- Historical quick tasks: two completed entries and one missing entry
  (`260715-e9k-define-fastapi-and-django-tutorial-expan`).
- Debug sessions, threads, todos, seeds, and context questions: zero.

`gsd-tools audit-uat` resolved the Phase 32 UAT record into four exact blocked
items: three `release-build` prerequisites and one `third-party` workflow
prerequisite. The Phase 32 items are acknowledged production gaps. The three
historical quick-task records remain outside this verification scope.

## Production Blockers

1. Enable and complete the Vercel production workflow for the accepted release SHA, retaining its successful run URL.
2. Complete both production workflows for one identical 40-character SHA.
3. Rerun `npm run verify:ai-faq-routes -- https://sealos.io` and require source/index/sitemap/route totals of 2,000, direct HTTP 200 detail total of 2,000, and zero findings.
4. Keep PARITY-02 and DELIVERY-02 pending until all three production conditions hold.

## Gaps

- **Same-SHA production workflows:** Vercel is `disabled_manually`; one accepted SHA lacks two successful production workflow URLs.
- **Live four-set parity:** production route inventory is 1,972 and retains 28 source/index slug differences.
- **Live derived-field parity:** production retains five description differences and 28 slug differences.
- **Live route acceptance:** 28 index detail attempts return 404; the two intentional invalid probes also return 404 and remain accepted.

Independent verification stopped before transition, gap planning, release,
and gap-fix execution. Phase 32 remains the current blocked phase.
