# Phase 31: Canonical Index Generation And Local Parity - Context

**Gathered:** 2026-08-03
**Status:** Ready for planning
**Decision mode:** User-delegated autonomous selection grounded in repository evidence

<domain>
## Phase Boundary

Deliver a deterministic maintainer workflow that projects all 2,000 English AI
Quick Reference source JSON files into the existing
`public/ai-faqs.en.json` client asset, verifies source and index parity in both
directions, and rejects drift before static export starts.

Phase 31 owns source loading and validation, canonical four-field projection,
numeric ordering, atomic generation, local semantic and byte parity,
regression fixtures, actionable diagnostics, and package-level build gates.
Phase 32 owns sitemap-set parity, generated detail-route checks, complete local
static-output verification, deployment, and production evidence.

</domain>

<decisions>
## Implementation Decisions

### Canonical Projection And Serialization

- **D-01:** Treat the leading integer in every
  `<id>-<slug>.en.json` filename as canonical record identity. Require unique,
  contiguous IDs `1..2000`, reject malformed filenames and duplicate IDs or
  full slugs, and emit records in numeric ID order.
- **D-02:** Project exactly four public fields in stable key order:
  `category` from source `category`, `question` from source `title`,
  `description` from source `description`, and `slug` from the filename minus
  `.en.json`. Require each projection input to be a non-empty string.
- **D-03:** Serialize the complete array as compact deterministic JSON with no
  trailing newline. Preserve the current static asset shape, client field
  contract, and payload-efficient representation.
- **D-04:** Expose generation as an explicit maintainer command. Validate and
  project the complete collection before publication, use bounded source reads,
  write through a same-directory temporary file, atomically rename on success,
  clean temporary state on failure, and emit a concise English summary with
  record count, output path, and byte count.

### Parity Identity And Diagnostics

- **D-05:** Align source and index records by validated numeric ID, then compare
  full slug and every projected field. Independently verify source and index ID
  uniqueness, full-slug uniqueness, and array position.
- **D-06:** Classify source-only IDs, index-only IDs, duplicate IDs, duplicate
  slugs, malformed identifiers, invalid projection schemas, ordering drift,
  slug/question/description/category drift, and non-canonical serialization.
  Sitemap and route mismatch classes remain Phase 32 work.
- **D-07:** Produce diagnostics in a stable category order. Print total counts
  for every category and the first 20 records in each populated category with
  record ID, source and index position where available, field name, expected
  value, and actual value. Finish failures with the exact regeneration command
  and return a non-zero status.
- **D-08:** Share source loading, validation, numeric ordering, record
  projection, and canonical serialization between generation, parity, and
  tests. The verifier performs parsed semantic checks plus canonical byte
  comparison through read-only operations.

### Build And CI Gate Behavior

- **D-09:** Run read-only parity before static export. A stale committed index
  fails early; maintainers refresh the asset through the explicit generator
  command. Build and CI execution leave the checkout unchanged.
- **D-10:** Gate both `npm run build` and `npm run build:analyze` before Next.js
  starts. Existing Vercel, Cloudflare, and Docker build paths inherit the same
  package-level preflight.
- **D-11:** Keep the Phase 31 preflight focused on English source-to-page-index
  semantics and canonical serialization. Preserve the existing slug and route
  verification commands for their current contracts and Phase 32 extension.
- **D-12:** A failed preflight names `public/ai-faqs.en.json`, prints the shared
  grouped English diagnostics, provides `npm run generate:ai-faq-index`, exits
  before expensive static export, and preserves every repository file.

### Regression Fixtures And CLI Contract

- **D-13:** Use Node.js built-in `node:test` and `node:assert/strict`, matching
  the repository's focused test style and dependency baseline.
- **D-14:** Build compact valid source/index fixtures under unique temporary
  directories, mutate one contract dimension per case, and clean them after
  each run. Add one read-only smoke test over the complete 2,000-record corpus.
- **D-15:** Cover two byte-identical consecutive generations, exact projection,
  numeric ordering, missing and orphaned IDs, duplicate source and index IDs
  and slugs, each projected field drift, ordering drift, malformed identifiers
  and schemas, non-canonical serialization, and stable CLI status and
  diagnostics.
- **D-16:** Expose `npm run generate:ai-faq-index`,
  `npm run verify:ai-faq-index`, and `npm run test:ai-faq-index`. The build
  preflight invokes the fast production parity command; implementation and CI
  validation invoke the focused test command explicitly. Keep
  `test:ai-faq-slugs` and `verify:ai-faq-routes` available.

### the agent's Discretion

- Choose compact helper and fixture filenames while keeping one shared,
  testable projection boundary.
- Choose a bounded file-read concurrency value that balances throughput and
  file-descriptor stability for 2,000 small JSON files.
- Choose temporary-file suffixes and cleanup mechanics that preserve
  same-directory atomic replacement.
- Choose exact English punctuation and summary formatting while preserving the
  locked diagnostic fields, deterministic ordering, 20-record cap per class,
  and regeneration command.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project And Phase Contracts

- `AGENTS.md` - repository language, GSD, TDD, scope, execution, and response
  rules.
- `.planning/PROJECT.md` - v1.5 goal, source inventory facts, core value, and
  later-scope boundaries.
- `.planning/REQUIREMENTS.md` - SOURCE-01, SOURCE-02, PARITY-01, and DELIVERY-01
  acceptance contracts plus Phase 32 ownership.
- `.planning/ROADMAP.md` - Phase 31 goal, success criteria, scope, validation
  approach, and the Phase 31 to Phase 32 boundary.
- `.planning/STATE.md` - current milestone position and approved Phase 31
  readiness.

### Prior Slug Integrity Contracts

- `.planning/milestones/v1.4-REQUIREMENTS.md` - exact slug resolution and the
  explicit FAQ JSON synchronization deferral inherited by v1.5.
- `.planning/milestones/v1.4-ROADMAP.md` - Phase 29 source-wide slug checks and
  Phase 30 build and production verification contracts.
- `.planning/phases/28-catalog-publication-and-cleanup/28-CONTEXT.md` - prior
  repository decision to test public CLI seams with temporary invalid fixtures,
  exit status, and stable user-facing diagnostics.

### Canonical Data And Client Contract

- `content/ai-quick-reference/` - canonical English source collection and
  filename-derived slug identities.
- `public/ai-faqs.en.json` - current compact four-field client asset and the
  generated target.
- `app/[lang]/(home)/ai-quick-reference/components/FAQSearch.tsx` - exact public
  data shape, fetch path, Fuse search fields, category behavior, and pagination
  contract.
- `source.config.ts` - source field schema for AI Quick Reference metadata.
- `lib/source.ts` - Fumadocs AI Quick Reference loader integration.

### Existing Verification And Build Integration

- `scripts/ai-faq-fixture.mjs` - shared 2,000-file loader and normalized-slug
  grouping seam available for refactoring.
- `scripts/verify-ai-faq-slugs.mjs` - current exact-slug and normalized-collision
  regression command.
- `scripts/verify-ai-faq-routes.mjs` - current sitemap and representative route
  verifier owned by the Phase 32 extension path.
- `lib/utils/faq-slug.mjs` - runtime-safe exact and normalized slug helpers.
- `scripts/generate-apps-api.js` - established generated-data script, English
  operational logging, JSON serialization, and npm build-adjacent pattern.
- `scripts/generate-apps-api.test.mjs` - established Node built-in test pattern.
- `package.json` - build, analyze, existing AI FAQ verification, and new command
  integration surface.
- `.github/workflows/deploy.yml` - Vercel production build path.
- `.github/workflows/preview.yml` - Vercel preview build path.
- `.github/workflows/deploy-cloudflare.yml` - Cloudflare production static build
  path.
- `.github/workflows/preview-cloudflare.yml` - Cloudflare preview static build
  path.
- `.github/workflows/build-image.yml` - Docker publication path.
- `Dockerfile` - container-local npm build path.

The project planning records and repository sources above constitute the
complete authority for Phase 31.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- `scripts/ai-faq-fixture.mjs` already reads every English source JSON and
  returns filename-derived slug, URL, and parsed data. Its current lexical
  filename sort must become validated numeric ordering for canonical output.
- `lib/utils/faq-slug.mjs` provides Node-importable slug extraction and
  normalization helpers already shared by runtime and verification code.
- `scripts/verify-ai-faq-slugs.mjs` demonstrates source-wide assertions across
  2,000 exact slugs and 288 ambiguous normalized groups.
- `scripts/generate-apps-api.js` and its adjacent test demonstrate repository
  conventions for generated JSON, explicit npm commands, English operator
  logs, and `node:test` coverage.

### Established Patterns

- AI Quick Reference source files contain `title`, `description`, `category`,
  `keywords`, and `content`; the public client consumes only `category`,
  `question`, `description`, and `slug`.
- The current public asset contains exactly 2,000 unique, non-empty records in
  numeric ID order, occupies 790,807 bytes, uses compact JSON with stable key
  order, and ends at the closing bracket.
- Current drift is precisely 28 slug fields and five description fields. Title
  to question and category projections already match all 2,000 records.
- Repository scripts use explicit non-zero failures and concise console output;
  TypeScript validation runs through `npm run lint`.
- Existing Vercel, Cloudflare, and Docker delivery paths converge on package or
  framework build commands, making the package-level preflight the shared gate.

### Integration Points

- Extend or refactor `scripts/ai-faq-fixture.mjs` into the shared source,
  projection, parity, and serialization boundary used by all new commands.
- Add focused generator, verifier, and `node:test` CLI files under `scripts/`.
- Update `package.json` with the three locked commands and place parity before
  both default and analyzer static-export commands.
- Regenerate `public/ai-faqs.en.json` once from source so the 28 slug and five
  description drifts disappear through canonical projection.
- Keep `FAQSearch.tsx`, client pagination, Fuse configuration, detail-page
  resolution, sitemap generation, and route verification behavior stable.

</code_context>

<specifics>
## Specific Ideas

- Canonical output order is ID `1` through ID `2000`, independent of directory
  enumeration and lexical filename order.
- Canonical key order is `category`, `question`, `description`, `slug`.
- Canonical JSON is compact and has no trailing newline.
- Failure output is grouped and capped at 20 detailed records per mismatch
  class while retaining complete category totals.
- Success and failure logs are concise English operational messages.
- The build gate runs parity before Next.js consumes static-export time and
  resources.

</specifics>

<deferred>
## Deferred Ideas

- Phase 32 owns source/index/sitemap/detail-route set parity, complete local
  static route checks, deployment, and production verification.
- Later milestones own locale, hreflang, and `/zh-cn` inventory alignment;
  broad metadata and taxonomy work; FAQ content rewriting; Search Console
  recrawl operations; and client payload sharding or search-index redesign.

</deferred>

---

*Phase: 31-canonical-index-generation-and-local-parity*
*Context gathered: 2026-08-03*
