# Phase 32: Sitemap Route Parity And Production Verification - Context

**Gathered:** 2026-08-04
**Status:** Ready for planning
**Decision mode:** User-delegated autonomous selection grounded in repository and live production evidence

<domain>
## Phase Boundary

Extend the existing English AI Quick Reference route verifier into the complete
release gate for PARITY-02 and DELIVERY-02. The phase compares canonical
source, page index, sitemap, and generated route slug sets; validates every
local and deployed detail page; deploys through the established reviewed
repository flow; and retains exact-commit production evidence.

Phase 31 remains the owner of source validation, page-index generation,
source/index parity, and pre-build gating. Phase 32 owns English sitemap and
detail-route parity, full static-output verification, production crawling, and
release evidence. Locale, hreflang, taxonomy, content expansion, and Search
Console operations remain later scope.

</domain>

<decisions>
## Implementation Decisions

### Canonical Four-Set Parity

- **D-01:** Treat the validated 2,000-file English source collection as the
  canonical inventory. Run the Phase 31 source/index parity boundary first,
  then compare source, page index, sitemap, and generated route slug sets.
- **D-02:** Compare exact full slugs bidirectionally. Report duplicate,
  source-only, index-only, sitemap-only, route-only, missing, and extra values
  in deterministic numeric-ID order with complete totals and bounded details.
- **D-03:** Require exactly 2,000 unique English sitemap URLs in the canonical
  form `https://sealos.io/ai-quick-reference/<slug>/`. The sitemap set must
  equal the source and page-index sets exactly.
- **D-04:** Establish the local generated route set by enumerating readable
  `out/ai-quick-reference/<slug>/index.html` artifacts in both directions.
  Preserve current sitemap and detail-route generation while this full audit
  remains green.

### Complete Local Route Identity

- **D-05:** Extend the existing `npm run verify:ai-faq-routes` command. Keep
  `out` as its default target and retain the optional remote base URL argument.
- **D-06:** Validate all 2,000 page-index routes in numeric ID order. Each local
  page must have a readable static output file and exact title, H1, meta
  description, and canonical URL derived from the canonical source/index
  record.
- **D-07:** Use direct static-output inspection as the local generated-route
  boundary. A readable `index.html` represents the generated static route;
  deployed verification supplies the real HTTP acceptance boundary.
- **D-08:** Retain the established ambiguous normalized-slug and unknown
  numbered-slug rejection checks alongside the complete canonical route
  matrix.

### Production Verification

- **D-09:** Fetch deployed `/ai-faqs.en.json` and
  `/ai-quick-reference/sitemap.xml` from the selected production target.
  Production comparison uses those deployed bytes and URLs as live truth.
- **D-10:** GET all 2,000 deployed page-index URLs through a deterministic pool
  of eight concurrent requests. Keep diagnostics and summaries in numeric ID
  order regardless of completion order.
- **D-11:** Validate HTTP 200 plus exact title, H1, meta description, and
  canonical URL for every deployed response. The full crawl already retrieves
  each response body, so complete identity validation adds zero requests.
- **D-12:** Use one bounded pass with per-request timeouts. Group network,
  status, set, and identity failures by category, print complete totals and the
  first 20 details per category, and return a non-zero status for any finding.
  Operators rerun the complete gate after a transient failure.

### Deployment And Retained Evidence

- **D-13:** Publish the accepted implementation through the existing reviewed
  PR-to-`main` flow and the existing Vercel and Cloudflare production
  workflows. Retain current deployment workflow ownership and structure.
- **D-14:** Bind release evidence to the full 40-character `upstream/main`
  commit SHA and the successful Vercel and Cloudflare production workflow run
  URLs for that same SHA before verifying `https://sealos.io`.
- **D-15:** Retain the exact verifier command, target, UTC timestamp, commit
  SHA, workflow URLs, source/index/sitemap/route counts, HTTP status totals,
  and mismatch totals in the Phase 32 plan summary and final verification
  artifact. Keep production evidence inside planning records.
- **D-16:** Complete DELIVERY-02 only after the full local gate passes, both
  production workflows succeed for the recorded SHA, and the production gate
  reports 2,000 source records, 2,000 deployed index records, 2,000 unique
  sitemap URLs, 2,000 HTTP 200 detail routes, and zero duplicate, membership,
  status, or identity findings.

### the agent's Discretion

- Choose compact helper and focused test filenames while retaining one
  `verify:ai-faq-routes` public command.
- Choose the internal report object shape, HTML extraction helper boundaries,
  and per-request timeout value.
- Reuse the Phase 31 source loader, index comparison, and diagnostic patterns
  wherever that keeps one canonical semantic implementation.
- Choose concise English summary punctuation while preserving D-02, D-12, and
  D-15 fields and the 20-detail cap.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project And Phase Contracts

- `AGENTS.md` - repository language, GSD, scope, execution, and validation
  rules.
- `.planning/PROJECT.md` - v1.5 core value, current milestone facts, and later
  scope boundaries.
- `.planning/REQUIREMENTS.md` - PARITY-02 and DELIVERY-02 acceptance contracts.
- `.planning/ROADMAP.md` - Phase 32 goal, success criteria, scope, validation
  approach, and Phase 31 dependency.
- `.planning/STATE.md` - active Phase 32 position and completed Phase 31
  requirement ownership.

### Phase 31 Contracts And Evidence

- `.planning/phases/31-canonical-index-generation-and-local-parity/31-CONTEXT.md` - locked source/index authority, exact projection, diagnostics,
  build gate, and Phase 32 boundary.
- `.planning/phases/31-canonical-index-generation-and-local-parity/31-RESEARCH.md` - shared loader architecture, route-verifier ownership, deployment
  path audit, and execution risks.
- `.planning/phases/31-canonical-index-generation-and-local-parity/31-PATTERNS.md` - established ESM, thin CLI, fixture, build-gate, and preserved
  route-verifier patterns.
- `.planning/phases/31-canonical-index-generation-and-local-parity/31-01-SUMMARY.md` - implemented canonical loader, exact projection, and stable
  findings boundary.
- `.planning/phases/31-canonical-index-generation-and-local-parity/31-02-SUMMARY.md` - implemented atomic generator and canonical 2,000-record asset.
- `.planning/phases/31-canonical-index-generation-and-local-parity/31-03-SUMMARY.md` - implemented read-only index verifier, package gates, and local
  Node.js 20 build evidence.
- `.planning/phases/31-canonical-index-generation-and-local-parity/31-VERIFICATION.md` - final Phase 31 evidence and the external current-commit
  deployment evidence gap inherited by Phase 32.
- `.planning/phases/31-canonical-index-generation-and-local-parity/31-UAT.md` - accepted hosted-CI and Vercel checks whose exact-SHA evidence remains
  for Phase 32.

### Canonical Data And Route Identity

- `content/ai-quick-reference/` - canonical English source collection.
- `public/ai-faqs.en.json` - generated page index and deployed index contract.
- `scripts/ai-faq-index.mjs` - validated numeric source loading, exact
  projection, comparison, and deterministic diagnostics.
- `scripts/verify-ai-faq-index.mjs` - Phase 31 source/index parity gate.
- `scripts/ai-faq-fixture.mjs` - compatible source page shape used by slug and
  route verification.
- `lib/utils/faq-slug.mjs` - exact and normalized slug resolution helpers.
- `lib/utils/faq-utils.ts` - detail-page lookup and source-to-page identity
  mapping.
- `lib/utils/metadata.ts` - title, description, canonical URL, and public URL
  generation behavior.

### Sitemap, Static Output, And Detail Routes

- `scripts/verify-ai-faq-routes.mjs` - current Phase 32 extension surface,
  local/remote target abstraction, sitemap reader, HTML extraction, and
  unresolved-route checks.
- `app/[lang]/(home)/ai-quick-reference/sitemap.ts` - generated English sitemap
  route that produces `/ai-quick-reference/sitemap.xml`.
- `app/sitemap-ai-faq.ts` - legacy AI FAQ sitemap source retained by static
  route audits; research must confirm its current build ownership.
- `app/[lang]/(home)/ai-quick-reference/[slug]/page.tsx` - static params,
  metadata, H1, and detail-page rendering contract.
- `app/sitemap-index.xml/route.ts` - sitemap-index reference to the AI Quick
  Reference sitemap.
- `scripts/check-static-export-routes.js` - existing sitemap artifact and route
  budget checks that remain complementary to page-level parity.
- `package.json` - stable maintainer command names and build integration.

### Production Delivery

- `.github/workflows/preview.yml` - reviewed Vercel preview path.
- `.github/workflows/preview-cloudflare.yml` - exact-head-SHA Cloudflare preview
  path and retained preview identity.
- `.github/workflows/deploy.yml` - Vercel production workflow triggered from
  `main`.
- `.github/workflows/deploy-cloudflare.yml` - Cloudflare production workflow,
  deployment URL, and summary surface triggered from `main`.
- `Dockerfile` - Node.js 20 static-export path that inherits package gates.

The repository records above constitute the complete Phase 32 authority.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- `loadCanonicalFAQSource()` already returns all 2,000 English source records
  in numeric order through bounded batches and supplies exact projected data.
- `compareFAQIndexRecords()` and `formatFAQIndexReport()` already establish
  deterministic grouped totals, bounded details, and non-zero parity behavior.
- `scripts/verify-ai-faq-routes.mjs` already supports `out` and HTTP targets,
  reads the published sitemap, extracts HTML title/H1/canonical values, and
  checks ambiguous and unknown routes.
- `generatePageMetadata()` and `pageToFAQItem()` define the exact title,
  description, canonical, and H1 values expected from each detail route.

### Established Patterns

- English public detail routes live at
  `/ai-quick-reference/<full-numbered-slug>/`; static export writes
  `out/ai-quick-reference/<slug>/index.html`.
- The public English sitemap contains one trailing-slash canonical URL per
  source page. Locale and `/zh-cn` route generation stay outside this phase's
  parity inventory.
- Verification scripts use Node.js built-ins, explicit `.mjs` imports, concise
  English output, process status, and small `node:test` fixtures.
- Current delivery paths use Node.js 20 and converge on reviewed preview and
  `main` production workflows.

### Integration Points

- Use `scripts/verify-ai-faq-routes.mjs` and its focused tests as the single
  Phase 32 route-verification extension surface. Keep sitemap and route
  behavior separate from the Phase 31 index gate.
- Fetch the remote page index inside the remote route verifier. The current
  command compares a deployed sitemap and two deployed pages against local
  source data, so it can pass while deployed index bytes remain stale.
- Preserve sitemap and detail-page source while complete local parity remains
  green. Product routing changes become relevant only when the extended gate
  exposes a concrete defect.
- Capture production workflow identity and full verifier output in Phase 32
  summaries and verification records after the accepted commit reaches
  `main`.

</code_context>

<specifics>
## Specific Ideas

- A read-only full local audit on 2026-08-04 found source, page index, sitemap,
  and generated route counts of 2,000 each, zero duplicates, zero set
  mismatches, and zero title/H1/description/canonical mismatches across all
  2,000 static pages.
- The current production sitemap also contains the exact 2,000 source slugs
  with zero duplicates, source-only slugs, or sitemap-only slugs.
- The current production `/ai-faqs.en.json` returns HTTP 200 and 2,000 records,
  yet comparison with canonical source data finds 28 slug drifts, five
  description drifts, and one canonical serialization drift.
- The current remote `verify:ai-faq-routes` command reads local source data,
  checks sitemap count, and validates two collision pages. These boundaries
  allow the stale deployed index to pass; Phase 32 closes all three gaps.
- The successful production summary should make all four counts, the HTTP 200
  total, the exact commit SHA, and zero-finding totals visible in one retained
  record.

</specifics>

<deferred>
## Deferred Ideas

- Locale, hreflang, and `/zh-cn` AI Quick Reference inventory alignment.
- Broad taxonomy, metadata, and FAQ content-quality work.
- Search Console recrawl, reindexing, and indexing follow-up operations.
- Client payload sharding or search-index redesign.

</deferred>

---

*Phase: 32-sitemap-route-parity-and-production-verification*
*Context gathered: 2026-08-04*
