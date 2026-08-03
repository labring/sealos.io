# Phase 32: Sitemap Route Parity And Production Verification - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md; this log preserves the alternatives considered.

**Date:** 2026-08-04
**Phase:** 32-sitemap-route-parity-and-production-verification
**Areas discussed:** Canonical Four-Set Parity, Complete Local Route Identity,
Production Verification, Deployment And Retained Evidence
**Decision authority:** The user explicitly delegated every interaction choice
through `--auto`. The agent selected the recommended option for every question
from the Phase 32 requirements, the Phase 31 boundary, current implementation,
full local static-output evidence, and current production evidence.
**Area selection:** `[--auto] Selected all gray areas: Canonical Four-Set
Parity, Complete Local Route Identity, Production Verification, Deployment And
Retained Evidence.`

---

## Canonical Four-Set Parity

### Canonical Inventory Authority

| Option | Description | Selected |
|--------|-------------|----------|
| Source canonical plus Phase 31 index gate | Use validated English source as canonical, require source/index parity first, then compare all four sets. | Yes |
| Page index alone | Treat the client asset as the complete release inventory. | |
| Sitemap alone | Treat published sitemap URLs as the complete release inventory. | |

**Selection:** `[auto] Source canonical plus Phase 31 index gate`.
**Notes:** Phase 31 established source JSON as the hand-edited authority and
the page index as a canonical derived artifact. Phase 32 composes that proven
boundary with sitemap and route sets.

### Slug Equality

| Option | Description | Selected |
|--------|-------------|----------|
| Exact bidirectional full-slug equality | Compare exact numbered slugs in both directions and classify duplicates, missing values, and extras. | Yes |
| Count-only equality | Accept matching totals across the four inventories. | |
| Normalized-slug equality | Remove numeric prefixes before comparison. | |

**Selection:** `[auto] Exact bidirectional full-slug equality`.
**Notes:** The v1.4 correction established exact full slugs as page identity.
Count equality allowed the previous 28 stale page-index slugs to remain hidden.

### Sitemap Contract

| Option | Description | Selected |
|--------|-------------|----------|
| Exact English canonical URL set | Require 2,000 unique `https://sealos.io/ai-quick-reference/<slug>/` URLs. | Yes |
| Slug count only | Require 2,000 unique sitemap entries. | |
| Combined English and Chinese inventory | Include root English and `/zh-cn` routes in one Phase 32 set. | |

**Selection:** `[auto] Exact English canonical URL set`.
**Notes:** PARITY-02 targets the 2,000-entry English inventory. Locale and
hreflang alignment remains explicitly deferred.

### Generated Route Inventory

| Option | Description | Selected |
|--------|-------------|----------|
| Enumerate generated output bidirectionally | Build the actual English route set from `out/.../<slug>/index.html` and reject missing or extra routes. | Yes |
| Check expected paths only | Visit each expected page-index path and ignore extra generated routes. | |
| Change route generation proactively | Modify static params and sitemap implementation before a full output audit. | |

**Selection:** `[auto] Enumerate generated output bidirectionally`.
**Notes:** The current full local audit found exactly 2,000 output directories
and exact set equality. Bidirectional enumeration protects against retained
stale output while preserving currently correct product generation.

**Area routing:** Next area.

---

## Complete Local Route Identity

### Maintainer Command

| Option | Description | Selected |
|--------|-------------|----------|
| Extend `verify:ai-faq-routes` | Keep one route-verification command with `out` default and optional remote target. | Yes |
| Add a second verifier | Create a separate Phase 32 command with overlapping ownership. | |
| Fold into `verify:ai-faq-index` | Expand the Phase 31 pre-build gate into sitemap and route work. | |

**Selection:** `[auto] Extend verify:ai-faq-routes`.
**Notes:** Phase 31 preserved this command specifically as the Phase 32
extension surface.

### Local Coverage

| Option | Description | Selected |
|--------|-------------|----------|
| All 2,000 routes | Validate every page-index route in numeric ID order. | Yes |
| Collision pages only | Retain the current two-page identity sample. | |
| Fixed random sample | Check a bounded subset of static pages. | |

**Selection:** `[auto] All 2,000 routes`.
**Notes:** Roadmap success criterion 2 requires every page-index URL. Numeric
order makes failures stable and directly traceable to source filenames.

### Identity Fields

| Option | Description | Selected |
|--------|-------------|----------|
| Title, H1, description, and canonical on every page | Compare all four search-facing identity fields with canonical values. | Yes |
| Status and canonical only | Validate route existence and URL identity. | |
| Representative identity samples | Validate all paths and inspect fields on selected pages. | |

**Selection:** `[auto] Title, H1, description, and canonical on every page`.
**Notes:** The route already renders these fields from one resolved source
page. Full local checks directly prove the Phase 32 static-output contract.

### Static Route Success

| Option | Description | Selected |
|--------|-------------|----------|
| Direct static-output validation | Treat readable `out/.../<slug>/index.html` as local route success and inspect its HTML. | Yes |
| Loopback HTTP server | Start a local server and request every output route. | |
| Build completion | Treat a successful Next static export as route acceptance. | |

**Selection:** `[auto] Direct static-output validation`.
**Notes:** The current command already models local output this way. Production
verification supplies actual HTTP status, and the existing ambiguous and
unknown route checks remain part of the command.

**Area routing:** Next area.

---

## Production Verification

### Deployed Data Sources

| Option | Description | Selected |
|--------|-------------|----------|
| Fetch deployed index and sitemap | Compare live `/ai-faqs.en.json` and live sitemap bytes/URLs with canonical source. | Yes |
| Local index plus deployed sitemap | Reuse committed page-index bytes while testing the live target. | |
| Deployed sitemap only | Treat sitemap membership as production parity. | |

**Selection:** `[auto] Fetch deployed index and sitemap`.
**Notes:** The current production command passes while the deployed index still
contains 28 slug drifts, five description drifts, and one byte drift. Fetching
the deployed index closes the root verification gap.

### Full Route Crawl

| Option | Description | Selected |
|--------|-------------|----------|
| Eight-request bounded full crawl | GET every deployed page-index URL with eight requests in flight. | Yes |
| Unbounded full crawl | Dispatch all 2,000 requests together. | |
| Representative route sample | Check selected collision and boundary pages. | |

**Selection:** `[auto] Eight-request bounded full crawl`.
**Notes:** Eight requests keep production load conservative. Results retain
numeric ordering independent of network completion order.

### Production Identity Depth

| Option | Description | Selected |
|--------|-------------|----------|
| All four fields on all responses | Parse title, H1, meta description, and canonical from every successful GET body. | Yes |
| Fields on a fixed sample | Validate all statuses and inspect identity on representative pages. | |
| HTTP status only | Prove route reachability across all 2,000 URLs. | |

**Selection:** `[auto] All four fields on all responses`.
**Notes:** The full GET crawl already supplies every response body, so complete
field validation adds zero network requests and eliminates sampling gaps.

### Failure Policy

| Option | Description | Selected |
|--------|-------------|----------|
| Deterministic one-pass gate | Apply per-request timeouts, group all failures, cap details, and return non-zero. | Yes |
| Automatic retries | Retry selected network and HTTP failures inside the verifier. | |
| Advisory warnings | Print findings and retain a successful exit status. | |

**Selection:** `[auto] Deterministic one-pass gate`.
**Notes:** A release gate should expose transient production instability. An
operator can rerun the complete bounded command after the target stabilizes.

**Area routing:** Next area.

---

## Deployment And Retained Evidence

### Delivery Flow

| Option | Description | Selected |
|--------|-------------|----------|
| Existing PR and production workflows | Merge the reviewed change to `main`, then use current Vercel and Cloudflare production workflows. | Yes |
| New deployment workflow | Add a Phase 32-specific publishing pipeline. | |
| Manual direct deployment | Publish outside the reviewed repository flow. | |

**Selection:** `[auto] Existing PR and production workflows`.
**Notes:** Current workflows already build with Node.js 20 and represent the
repository's production ownership boundaries.

### Exact Commit Binding

| Option | Description | Selected |
|--------|-------------|----------|
| Full SHA plus both production runs | Record the 40-character `upstream/main` SHA and successful Vercel and Cloudflare runs for it. | Yes |
| Branch name only | Associate production evidence with `main`. | |
| Deployment timestamp only | Associate production evidence with the observation time. | |

**Selection:** `[auto] Full SHA plus both production runs`.
**Notes:** Phase 31 accepted external checks through `--auto` with missing
hosted evidence. Phase 32 converts that inherited gap into exact release
identity.

### Evidence Location

| Option | Description | Selected |
|--------|-------------|----------|
| Phase summary and verification artifacts | Retain command output, counts, SHA, workflow URLs, target, and timestamp in GSD records. | Yes |
| New committed JSON evidence file | Add a machine-readable production snapshot to the repository. | |
| Console output only | Keep production evidence in the terminal session. | |

**Selection:** `[auto] Phase summary and verification artifacts`.
**Notes:** Durable GSD records satisfy the release-evidence requirement and
keep runtime observations out of product source and generated public assets.

### DELIVERY-02 Acceptance

| Option | Description | Selected |
|--------|-------------|----------|
| Local plus exact-SHA production acceptance | Require the full local gate, successful exact-SHA workflows, and a full `https://sealos.io` gate. | Yes |
| Local verification only | Accept repository output before deployment. | |
| Production sample only | Accept deployed sitemap counts and representative routes. | |

**Selection:** `[auto] Local plus exact-SHA production acceptance`.
**Notes:** Final evidence must show all four counts at 2,000, all detail routes
at HTTP 200, and zero duplicate, membership, status, or identity findings.

**Area routing:** Ready for context.

---

## the agent's Discretion

- Compact helper and focused test filenames within the existing command.
- Internal report object shape and HTML extraction helper boundaries.
- Per-request timeout value for production requests.
- Reuse boundaries for Phase 31 comparison and formatting helpers.
- Concise English summary punctuation within the locked evidence fields and
  20-detail cap.

## Deferred Ideas

- Locale, hreflang, and `/zh-cn` inventory alignment.
- Broad taxonomy, metadata, and FAQ content-quality work.
- Search Console recrawl and indexing operations.
- Client payload sharding or search-index redesign.
