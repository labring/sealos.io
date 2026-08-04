---
status: partial
phase: 32-sitemap-route-parity-and-production-verification
source:
  - 32-01-SUMMARY.md
  - 32-02-SUMMARY.md
  - 32-03-SUMMARY.md
  - 32-04-SUMMARY.md
started: 2026-08-04T00:49:07Z
updated: 2026-08-04T00:49:07Z
---

## Current Test

[testing paused - 4 production checks blocked]

## Tests

### 1. Deterministic Four-Set Inventory
expected: Source, index, sitemap, and route inventories expose complete totals, duplicates, bidirectional membership, presence facts, and stable numeric ordering.
result: pass
source: automated
evidence: `node --test scripts/verify-ai-faq-routes.test.mjs` passed the inventory and deterministic reporting cases under Node.js 20.20.0.

### 2. Exact Page Identity Comparison
expected: Generated title, nested H1, meta description, and canonical values compare exactly across escaping and attribute-order variations.
result: pass
source: automated
evidence: The route-verifier suite passed all identity extraction, missing, duplicate, and mismatch cases.

### 3. Retained Route Verifier CLI And Report
expected: The retained command accepts the default `out` target or one HTTP(S) target, emits every fixed category, caps details, and exits according to complete findings.
result: pass
source: automated
evidence: The route-verifier suite passed 19/19 tests and the fresh local CLI returned status 0.

### 4. Complete Local Static Parity
expected: All 2,000 local source, index, sitemap, and readable route slugs match in both directions, with exact identity checks for every route.
result: pass
source: automated
evidence: The fresh build checked 2,000 routes and 8,000 identity fields with zero findings; both invalid probes returned accepted 404 results.

### 5. Local Failure Diagnostics And Read Bound
expected: Local ingestion, membership, read, identity, invalid-route, and malformed-data failures remain structured while page reads stay bounded at 32.
result: pass
source: automated
evidence: The focused local adapter and malformed-target tests passed under Node.js 20.20.0.

### 6. Standard And Timed Build Gate Order
expected: Static build paths execute route parity after Next export and root-locale normalization, and a failed route gate stops later stages.
result: pass
source: automated
evidence: The fresh `npm run build` completed 6,179 static pages and its post-normalization 2,000-route gate; the pipeline suite passed 9/9 tests.

### 7. Bounded Remote Crawl Mechanics
expected: Remote mode attempts each valid index route once through exactly eight workers with 10-second request timeouts, manual redirects, and zero retries.
result: pass
source: automated
evidence: Worker-count, request-option, single-attempt, and opposite-completion-order tests passed.

### 8. Complete Remote Diagnostics
expected: Network, timeout, status, body, malformed-data, set, index-field, invalid-route, and identity diagnostics remain independent and deterministic.
result: pass
source: automated
evidence: The mixed-failure and strict remote acceptance fixtures passed in the 19-test route-verifier suite.

### 9. Live Strict Remote Acceptance
expected: The retained production command reports four 2,000-entry inventories, 2,000 direct HTTP 200 detail routes, accepted invalid probes, and zero findings.
result: blocked
blocked_by: release-build
reason: The fresh 2026-08-04T00:47:45.296Z readback returned status 1 with route inventory 1,972, 1,972 direct HTTP 200 detail routes, 28 route-status 404 failures, 28 slug mismatches, and five description mismatches.

### 10. Fresh Production Route Evidence
expected: Production evidence retains all four inventories, HTTP totals, identity totals, mismatch totals, and the exact rerun command.
result: blocked
blocked_by: release-build
reason: Fresh evidence is complete and failing: source/index/sitemap are 2,000 each, route is 1,972, HTTP totals are 1,972 direct 200 plus 30 total 404 responses, and 7,888 identity fields on successful bodies have zero identity findings.

### 11. Same-SHA Production Workflow Evidence
expected: One accepted 40-character `upstream/main` SHA owns completed successful Vercel and Cloudflare production workflow URLs.
result: blocked
blocked_by: third-party
reason: `upstream/main` is `942980cc85a9fd4613c67dc89243a82cac732e14`; Cloudflare run 30782942312 succeeded for that SHA, while Vercel is `disabled_manually` and its latest main run 22211308372 failed for `ac6e452a9deb1a00f2ceaf08a50d7554e4d5d9a9`.

### 12. Exact-SHA Production Release Checkpoint
expected: The approved production release completes both workflows for one SHA and a final live rerun satisfies every production count and zero-finding gate.
result: blocked
blocked_by: release-build
reason: The same-SHA Vercel success and passing final production rerun are outstanding release prerequisites.

## Summary

total: 12
passed: 8
issues: 0
pending: 0
skipped: 0
blocked: 4

## Gaps

None. The four production acceptance checks remain blocked by the release state recorded above.
