---
phase: 32
slug: sitemap-route-parity-and-production-verification
status: complete
researched: 2026-08-04
requirements: [PARITY-02, DELIVERY-02]
---

# Phase 32: Sitemap Route Parity And Production Verification - Research

## Executive Summary

Phase 32 should extend `scripts/verify-ai-faq-routes.mjs` into one read-only
local and remote release gate. The command should load the Phase 31 canonical
source, consume the selected target's page index and sitemap, derive a route
set from readable local files or direct HTTP 200 responses, compare all four
sets, and inspect the exact title, H1, meta description, and canonical for all
2,000 page-index routes.

The shortest durable path keeps the existing command name and uses Node.js 20
built-ins. A focused `node:test` file supplies injected filesystem and fetch
fixtures. Local static reads use bounded batches of 32. Remote page requests
use a deterministic worker pool of exactly 8, a 10-second timeout per request,
manual redirect handling, one request body per route, and one pass with zero
automatic retries.

Current production is an intentional failing baseline. At
`2026-08-03T23:02:39Z`, the published index and sitemap both returned HTTP 200
with 2,000 unique entries. The sitemap matched the canonical source exactly.
The deployed index retained 28 stale slugs, five stale descriptions, and
non-canonical bytes. A representative canonical route returned 200 while the
stale numbered route returned 404. This proves that count-only sitemap checks
and two route samples can report success while deployed search data points at
dead routes.

## Scope And Authority

### In scope

- Exact English source/index/sitemap/route set equality at 2,000 unique slugs.
- Complete local static-output identity inspection.
- Complete remote page-index crawl and identity inspection.
- Deterministic, bounded, English diagnostics and process status.
- Build and timed-build integration after static output exists.
- Same-commit production evidence for Vercel and Cloudflare.

### Deferred boundaries

- Chinese inventory, locale parity, hreflang, taxonomy, content quality, and
  Search Console remain outside Phase 32.
- Existing route generation, page rendering, sitemap implementation, and
  deployment workflow definitions remain acceptance surfaces unless execution
  discovers a gate defect that directly blocks the locked Phase 32 contract.
- `32-DISCUSSION-LOG.md` remains an audit trail. Decisions used here come from
  `32-CONTEXT.md`, ROADMAP, REQUIREMENTS, STATE, Phase 31 artifacts, current
  source, and live read-only evidence.

## Canonical Sources Read

- `.planning/PROJECT.md`, `.planning/ROADMAP.md`,
  `.planning/REQUIREMENTS.md`, and `.planning/STATE.md`.
- `32-CONTEXT.md` and the audit-only `32-DISCUSSION-LOG.md`.
- Every Phase 31 plan, summary, review, fix review, final review, validation,
  verification, and UAT artifact.
- `scripts/ai-faq-index.mjs`, `scripts/ai-faq-fixture.mjs`,
  `scripts/verify-ai-faq-index.mjs`, `scripts/verify-ai-faq-slugs.mjs`, and
  `scripts/verify-ai-faq-routes.mjs`.
- AI Quick Reference page, metadata, slug, sitemap, build-pipeline, static-route,
  Docker, Vercel, and Cloudflare implementation files.
- Live Sealos index/sitemap/detail responses and GitHub Actions API facts.

## Current Repository Baseline

| Surface | Current fact | Planning consequence |
|---|---|---|
| Canonical source | `loadCanonicalFAQSource()` returns 2,000 validated records in numeric ID order through sequential batches of 32. | Reuse this loader as the source authority and expected identity record. |
| Local index | Phase 31 verification proves exact semantic and byte parity for 2,000 records. | Keep `verify:ai-faq-index` as the pre-build gate and reuse its projection semantics. |
| Route command | `verify:ai-faq-routes` accepts `out` by default or one URL argument. | Preserve the exact command and invocation contract. |
| Current route coverage | The command checks sitemap count, two collision pages, one ambiguous normalized slug, and one unknown numbered slug. | Replace sampling with full inventory checks while retaining the two rejection behaviors. |
| Local static output | The present `out/ai-quick-reference` tree has 2,000 route directories; Phase 31 read-only evidence found zero local identity mismatches. | Enumerate the generated tree in both directions and inspect every readable `index.html`. |
| Detail identity | Metadata comes from `generatePageMetadata`; H1 comes from `faqItem.title`; canonical comes from `faqPage.url`. | Expected title is `<source title> | Sealos`; H1 and description match source strings; canonical is `https://sealos.io/ai-quick-reference/<slug>/`. |
| Standard build | `package.json` runs index parity, Next build, and root-locale normalization. | Append route parity after normalization, when `out` is complete. |
| Timed build | `measure-build-pipeline.js` invokes Next and normalization directly. | Add route parity after normalization and before the final generated-diff guard. |
| Cloudflare production | `.github/workflows/deploy-cloudflare.yml` is active and calls `npm run build`. | The package build gate is inherited; retain a successful same-SHA run URL. |
| Vercel production | `.github/workflows/deploy.yml` is `disabled_manually` as of 2026-08-04. | DELIVERY-02 remains blocked until the existing workflow is active and has a successful run for the exact accepted main SHA. |

## Live Production Snapshot

Read-only checks ran from this worktree on 2026-08-04.

| Fact | Result |
|---|---|
| `upstream/main` live API SHA | `942980cc85a9fd4613c67dc89243a82cac732e14` |
| Production index | HTTP 200, JSON, 2,000 records, 2,000 unique slugs |
| Production sitemap | HTTP 200, XML, 2,000 URLs, 2,000 unique slugs |
| Source versus sitemap | zero source-only and zero sitemap-only slugs |
| Source versus deployed index | 28 source-only and 28 index-only slugs |
| Deployed record drift | 28 slug, 5 description, 0 question, 0 category |
| Deployed index bytes | 790,807 bytes; canonical bytes are 790,830; first difference offset 11,224 |
| Representative canonical route | `/ai-quick-reference/28-what-role-does-ci-cd-play/` returned 200 with exact title and canonical |
| Representative stale route | `/ai-quick-reference/28-what-role-does-cicd-play/` returned 404 |
| Cloudflare run | Success at `https://github.com/labring/sealos.io/actions/runs/30782942312`, exact main SHA above |
| Vercel workflow | `disabled_manually`; latest run is from 2026-02-20 and has another SHA |

The current deployed index is the locked negative production fixture for the
release-gate design. Plan execution should preserve the plan-time snapshot in
its summary and run a fresh pre-release check because hosted state can change.

## Recommended Architecture

```text
canonical source (2,000 validated records)
        |
        +--> local/remote page index ----+
        +--> local/remote sitemap -------+--> exact four-set report
        +--> local/remote route results -+
        |
        +--> expected title / H1 / description / canonical
                                         |
local: out/.../<slug>/index.html --------+--> identity report
remote: GET index slugs, pool=8 ---------+

report -> fixed category order -> numeric slug order -> first 20 details
       -> complete totals/counts/status histogram -> exit 0 or 1
```

### Domain model

Keep one testable module boundary in `verify-ai-faq-routes.mjs`:

1. Load and validate source records.
2. Load target index and sitemap bytes.
3. Parse index records and canonical sitemap URLs into ordered slug inventories.
4. Collect the route inventory and one page result per page-index slug.
5. Build exact membership, duplicate, status, network, invalid-route, and
   identity findings.
6. Sort every finding by numeric ID, then code-unit slug, then stable field
   order; format totals and at most 20 details per category.
7. Return a report and process status through an injected runner.

### Four-set semantics

- Source is the canonical reference set.
- Each set records total entries, unique entries, duplicates, and exact slugs.
- Exact parity requires all four unique sets to equal the 2,000-source set.
- Derived-set findings use explicit pair names such as
  `source-only-vs-index` and `index-only-vs-source`; a membership matrix in
  each detail shows presence across all four sets.
- The success summary always prints source, index, sitemap, and route totals,
  plus unique counts and zero mismatch totals.
- Remote route membership consists of page-index slugs that return a direct
  HTTP 200. The command still performs all 2,000 page-index requests after set
  drift is discovered so one pass yields complete status and identity totals.

### Local target adapter

- Read `<target>/ai-faqs.en.json` as the built local index authority. Phase 31
  already proves the committed `public/ai-faqs.en.json` input before Next; the
  Phase 32 local gate proves the copied static artifact after Next.
- Read `out/ai-quick-reference/sitemap.xml`.
- Enumerate immediate route directories and require readable
  `out/ai-quick-reference/<slug>/index.html` files.
- Read page files in deterministic batches capped at 32 open operations.
- Inspect all 2,000 page-index routes and retain ambiguous normalized and
  unknown numbered route rejection checks.

### Remote target adapter

- Resolve `/ai-faqs.en.json` and `/ai-quick-reference/sitemap.xml` against the
  supplied HTTP(S) base URL.
- Apply a 10,000 ms `AbortSignal.timeout()` to index, sitemap, and every detail
  request. Node 20 supplies global `fetch` and `AbortSignal.timeout()`
  ([Node.js globals documentation](https://nodejs.org/download/release/v20.18.1/docs/api/globals.html)).
- Use exactly eight workers over the numeric page-index order.
- Set `redirect: 'manual'` so redirects remain visible status findings.
- Read each successful response body once and extract all four identity fields
  from that body.
- Execute one complete pass. Operators rerun the entire command after a
  transient network incident.

## Diagnostic Contract

English output should have fixed sections:

1. Target, mode, UTC timestamp, and configured limits.
2. Source/index/sitemap/route total and unique counts.
3. Duplicate and pairwise membership totals.
4. HTTP status histogram and network/timeout totals.
5. Title, H1, meta-description, canonical, and invalid-route totals.
6. Up to 20 JSON-serialized details per category in numeric order.
7. A final pass/fail line with the exact rerun command.

Every finding remains represented in category totals. Completion status is
non-zero for any ingestion, duplicate, count, membership, network, timeout,
non-200, invalid-route, or identity finding.

## Test Strategy

Use a new `scripts/verify-ai-faq-routes.test.mjs` with Node 20 built-ins and
small synthetic fixtures. Inject filesystem and fetch adapters so tests cover:

- exact four-set success and every pairwise missing/extra direction;
- duplicates in source, index, sitemap, and local route enumeration;
- canonical URL parsing, malformed XML/index input, and unreadable local pages;
- exact title, nested H1 text, meta description, and canonical extraction;
- attribute-order and HTML-escaping cases;
- all routes inspected after early drift;
- out-of-order network completion with deterministic numeric diagnostics;
- concurrency never above 8;
- per-request abort classification, network failure, non-200 status, manual
  redirect visibility, one body read, and zero automatic retries;
- first-20 detail cap with complete totals;
- existing command name, default `out`, optional URL, and invalid slug checks;
- full committed-corpus/local-output smoke after a production build.

## Build And Release Integration

`npm run build` and `npm run build:analyze` should run route parity after root
locale normalization. Timed build/analyzer modes should add the same stage at
the equivalent position. Existing Vercel, Cloudflare, and Docker paths inherit
the package build behavior; workflow source changes are outside the expected
implementation set.

Release evidence should bind one accepted 40-character `upstream/main` SHA to:

- one successful Vercel production workflow URL;
- one successful Cloudflare production workflow URL;
- one remote `npm run verify:ai-faq-routes -- https://sealos.io` command;
- UTC execution time and exact target;
- four counts and unique counts of 2,000;
- HTTP 200 count of 2,000;
- zero duplicate, membership, network, timeout, status, invalid-route, title,
  H1, meta-description, and canonical findings.

GitHub's workflow-run API exposes `head_sha`, status, conclusion, and
`html_url`, and accepts a `head_sha` filter
([GitHub workflow-runs REST documentation](https://docs.github.com/en/rest/actions/workflow-runs)).
The existing workflows support `workflow_dispatch`; GitHub documents dispatch
through `gh workflow run`
([GitHub manual workflow documentation](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow)).

## Threat Model And Controls

| Threat | Severity | Control |
|---|---|---|
| Stale index retains valid counts and sends users to dead numbered routes | high | Exact source/index/sitemap/route membership plus all 2,000 direct status checks. |
| Redirect following masks stale routes | medium | `redirect: 'manual'` and direct HTTP 200 acceptance. |
| Hanging or hostile target exhausts the verifier | medium | HTTP(S) base validation, concurrency 8, 10-second per-request abort, one pass. |
| Unbounded local reads exhaust file descriptors | medium | Numeric-order batches capped at 32. |
| Response completion order changes diagnostics | medium | Store by source position and sort before report formatting. |
| HTML values inject terminal control text into diagnostics | low | JSON-serialize expected and actual values. |
| A workflow URL proves a different deployment | high | Require both successful run records to equal the same full `upstream/main` SHA. |
| A disabled production workflow is silently accepted | high | Treat workflow state and absent same-SHA run as blocking release findings. |

## Performance Budget

| Operation | Bound | Expected behavior |
|---|---|---|
| Source reads | existing batches of 32 | Reuses Phase 31 canonical loader. |
| Local HTML reads | batches of at most 32 | Reads 2,000 small static files with bounded descriptors. |
| Remote detail requests | exactly 8 concurrent | About 250 worker rounds for 2,000 pages. |
| Request timeout | 10 seconds each | Every request has a finite terminal state. |
| Response reads | one per route | All identity extraction reuses the fetched body. |
| Diagnostic details | 20 per category | Output remains bounded while totals remain complete. |

The remote crawl is a release gate and stays outside the build command. Local
route parity belongs in builds because it performs filesystem reads only.

## Resolved Planning Decisions

- Use four sequential plans: deterministic report core, complete local gate,
  complete remote gate, and exact-SHA production evidence.
- Keep `scripts/verify-ai-faq-routes.mjs` as the implementation owner and add
  one focused test file.
- Keep all Phase 31 commands and source/index semantics.
- Keep workflows as observed acceptance surfaces.
- Mark the Vercel production state as a release blocker until a same-SHA
  successful run exists.
- Require fresh production facts during execution while retaining this stale
  snapshot as the design regression baseline.

## Sources

- [Node.js 20 globals: fetch and AbortSignal timeout](https://nodejs.org/download/release/v20.18.1/docs/api/globals.html)
- [GitHub REST API: workflow runs](https://docs.github.com/en/rest/actions/workflow-runs)
- [GitHub Actions: manually run a workflow](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow)
- [Current Vercel production workflow page](https://github.com/labring/sealos.io/actions/workflows/deploy.yml)
- [Current Cloudflare production workflow page](https://github.com/labring/sealos.io/actions/workflows/deploy-cloudflare.yml)
