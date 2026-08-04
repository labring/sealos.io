# Phase 32: Sitemap Route Parity And Production Verification - Pattern Map

**Mapped:** 2026-08-04
**Planned implementation files:** 5
**Analog coverage:** 5 / 5

## File Classification

| Planned file | Role | Data flow | Closest analog | Match |
|---|---|---|---|---|
| `scripts/verify-ai-faq-routes.mjs` | domain module and CLI controller | filesystem/network -> report | current file plus `verify-ai-faq-index.mjs` | direct modification |
| `scripts/verify-ai-faq-routes.test.mjs` | focused test | fixtures/fake fetch -> assertions | `ai-faq-index.test.mjs` | role match |
| `package.json` | build orchestration | command sequence | existing `build` and `build:analyze` scripts | direct modification |
| `scripts/measure-build-pipeline.js` | timed pipeline controller | child-process stages | existing index parity and normalization stages | direct modification |
| `scripts/measure-build-pipeline.test.mjs` | stage-order regression test | injected spawn -> assertions | current stage/fail-fast tests | direct modification |

## Cross-File Flow

```text
scripts/ai-faq-index.mjs
  -> scripts/ai-faq-fixture.mjs
  -> scripts/verify-ai-faq-routes.mjs
       -> scripts/verify-ai-faq-routes.test.mjs
       -> package.json build/build:analyze
       -> scripts/measure-build-pipeline.js
            -> scripts/measure-build-pipeline.test.mjs
       -> local out gate
       -> remote release gate
```

## Pattern Assignments

### Route verifier: shared domain plus thin CLI

**Current seam:** `scripts/verify-ai-faq-routes.mjs` already accepts `out` or an
HTTP(S) target, loads the canonical fixture, reads one sitemap, inspects route
HTML, checks canonical identity, and retains invalid-route probes.

**Controller analog:** `scripts/verify-ai-faq-index.mjs` exports an injected
runner, writes stable success output to stdout, writes structured failure
output to stderr, and returns the process status to a guarded ESM entrypoint.

**Apply:** retain one file and refactor top-level assertions into exported pure
parsers, comparators, formatter, target adapters, and `runVerifyFAQRoutes()`.
The main guard should only parse `process.argv`, invoke the runner, and assign
`process.exitCode`.

**Avoid:** assert-driven production control flow. Assertions stop at the first
finding and prevent the complete totals required by D-02 and D-12.

### Canonical source and numeric ordering

**Analog:** `scripts/ai-faq-index.mjs` owns strict filename identity, source
validation, numeric ID order, batches of 32, exact projection, safe value
formatting, category totals, and the first-20 detail cap.

**Apply:** load source records through `loadCanonicalFAQSource()`. Preserve
their numeric order for page checks and diagnostics. Use
`parseFAQSourceFilename()` or the validated source map to order external slugs.
Use JSON serialization for diagnostic values.

**Avoid:** lexical filename ordering and response-completion ordering.

### Test fixtures and injected boundaries

**Analog:** `scripts/ai-faq-index.test.mjs` uses `node:test`,
`node:assert/strict`, `mkdtemp()`, injected filesystems/streams, process-level
smokes, category-by-category mutation cases, deterministic reverse-order
checks, and full-corpus acceptance.

**Apply:** create compact four-record local fixtures and fake `fetch`
responses. Export a runner with `filesystem`, `fetchImpl`, `stdout`, `stderr`,
`now`, concurrency, and timeout injection where tests need observation. Keep
production defaults fixed at 32 local reads, 8 remote workers, and 10 seconds.

**Avoid:** 2,000 real network requests in the focused unit suite. The final
release plan owns the live crawl.

### HTML identity extraction

**Current seam:** `extractTagText()` strips nested markup from H1 and title;
`escapeHtml()` matches static serialization; canonical extraction currently
assumes one attribute order.

**Apply:** retain the small dependency-free scanner, parse candidate opening
tags into an order-independent attribute map, select meta description through
`name=description`, and select canonical through `rel=canonical`. Compare
escaped logical values consistently. Test nested H1 markup, quotes, ampersands,
numeric entities, attribute order, missing tags, and duplicate identity tags.

**Avoid:** a new HTML parser dependency for four static fields. The repository
has no direct server-side HTML parser contract, and the generated shape is
small and controlled.

### Exact set parity and controlled diagnostics

**Analog:** `compareFAQIndexRecords()` builds every category before returning,
suppresses derivative cascades where the authority cannot be established,
sorts deterministic data, and renders all totals with bounded details.

**Apply:** represent each source/index/sitemap/route inventory as ordered
entries plus a `Map<slug, entries[]>`. Report duplicates per set and explicit
pairwise source/derived membership categories. Attach a four-set presence
matrix to details. Continue route requests after set findings so network,
status, and identity totals are complete.

**Avoid:** one `Set` equality boolean. It hides the direction and records that
maintainers need to repair.

### Bounded remote worker pool

**Analog:** Phase 31 uses sequential bounded batches for file reads. Repository
network scripts use injected process boundaries and status reporting.

**Apply:** use a fixed array of eight async workers sharing a monotonic cursor
over numeric page-index records. Store results by original position. Pass
`AbortSignal.timeout(10_000)` and `redirect: 'manual'` to every fetch. Read a
200 response body once and reuse it for all field checks.

**Avoid:** `Promise.all()` over 2,000 URLs, automatic retry loops, and implicit
redirect following.

### Build and timed-build stage placement

**Package analog:** Phase 31 prefixes standard builds with
`verify:ai-faq-index` and preserves root-locale normalization.

**Apply:** append `npm run verify:ai-faq-routes` after
`scripts/normalize-root-locale.js`. Keep the exact script name and default
`out` target.

**Timed pipeline analog:** `getStagesForMode()` lists exact stage objects and
`runPipeline()` stops at the first non-zero status.

**Apply:** add `AI FAQ route parity` after `root locale normalization` for
build and analyze modes. Extend exact stage arrays and add a failure case that
observes the final generated-diff guard stays uninvoked.

### Production evidence

**Analog:** Phase 31 summaries and verification artifacts record exact command,
environment, URL, and outcome. GitHub workflow runs expose full `head_sha`,
`conclusion`, and `html_url`.

**Apply:** derive one 40-character SHA from fresh `upstream/main`. Query each
production workflow by that SHA, require `state=active`,
`status=completed`, `conclusion=success`, and retain both run URLs. Execute the
remote verifier only after both records satisfy the same SHA. Record UTC,
target, four counts, HTTP histogram, and every zero mismatch total.

**Current blocker:** Vercel production is `disabled_manually`. Plan 32-04 owns
the blocking release checkpoint and preserves pending requirement status until
the existing workflow produces valid evidence.

## Interface Contracts

| Interface | Producer | Consumer | Contract |
|---|---|---|---|
| Canonical records | `loadCanonicalFAQSource()` | route verifier | 2,000 validated numeric records with slug and data |
| Local index | `out/ai-faqs.en.json` | local adapter | copied static artifact with exact Phase 31 four-field records |
| Remote index | `<base>/ai-faqs.en.json` | remote adapter | HTTP 200 JSON array, exact source parity |
| Sitemap | target sitemap XML | inventory parser | canonical Sealos URL with one trailing slash per slug |
| Local route | `out/.../<slug>/index.html` | local adapter | readable static HTML |
| Remote route | `<base>/ai-quick-reference/<slug>/` | worker pool | direct HTTP 200 and exact four identity fields |
| Report | domain comparator | formatter/CLI | fixed categories, numeric order, totals, first 20 details |
| Build gate | package/timed pipeline | deployments | route command runs after complete static export |
| Release evidence | GitHub Actions plus remote CLI | summary/verification | same full SHA, two successful run URLs, zero findings |

## Planned Modification Boundaries

- `scripts/verify-ai-faq-routes.mjs`: full implementation owner.
- `scripts/verify-ai-faq-routes.test.mjs`: new focused contract owner.
- `package.json`: exact command retention and post-build placement.
- `scripts/measure-build-pipeline.js`: equivalent direct-build placement.
- `scripts/measure-build-pipeline.test.mjs`: stage order and fail-fast proof.
- `.github/workflows/*.yml`, route/page/sitemap source, generated JSON, and
  static output remain read-only acceptance surfaces for implementation.
