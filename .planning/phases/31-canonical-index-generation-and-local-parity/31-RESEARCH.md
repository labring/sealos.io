# Phase 31: Canonical Index Generation And Local Parity - Research

**Researched:** 2026-08-03
**Domain:** Deterministic Node.js generated-data pipeline and bidirectional parity verification
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

The text in this section is copied verbatim from `31-CONTEXT.md`. [VERIFIED: `.planning/phases/31-canonical-index-generation-and-local-parity/31-CONTEXT.md`]

### Locked Decisions

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

### Deferred Ideas (OUT OF SCOPE)

- Phase 32 owns source/index/sitemap/detail-route set parity, complete local
  static route checks, deployment, and production verification.
- Later milestones own locale, hreflang, and `/zh-cn` inventory alignment;
  broad metadata and taxonomy work; FAQ content rewriting; Search Console
  recrawl operations; and client payload sharding or search-index redesign.

</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SOURCE-01 | Maintainer can generate `public/ai-faqs.en.json` from `content/ai-quick-reference/*.en.json`, with the source collection serving as the only hand-edited input. | Shared source loader, exact projection boundary, and atomic generator CLI described below. [VERIFIED: `.planning/REQUIREMENTS.md`] |
| SOURCE-02 | The generated page index contains exactly 2,000 records, maps each source `slug`, `title`, `description`, and `category` to the expected index fields, repairs the 28 stale slugs and five description drifts, and preserves numeric ID order. | Repository baseline and full-corpus smoke specify exact count, fields, order, and known drift. [VERIFIED: repository data audit] |
| PARITY-01 | Maintainer can run a local parity check that compares source and page index in both directions and reports missing, orphaned, duplicate, field-drift, and ordering mismatches with record-level details. | ID-indexed two-way comparison, stable finding taxonomy, and fixture matrix described below. [VERIFIED: `.planning/REQUIREMENTS.md`] |
| DELIVERY-01 | The build or CI gate runs page-index generation or parity verification before static export and fails with an actionable diagnostic when source and derived data diverge. | Read-only package preflight, timed-build coverage, and failure-order assertions described below. [VERIFIED: `.planning/REQUIREMENTS.md`; repository build-path audit] |

</phase_requirements>

## Summary

Phase 31 should add one small Node.js domain module that owns source enumeration, filename/field validation, numeric ordering, four-field projection, canonical serialization, semantic comparison, and diagnostic formatting. Two thin CLIs should consume it: generation validates everything before writing a unique same-directory temporary file and renaming it over the asset; verification reads source and index, reports structured semantic findings, then compares the existing bytes with the canonical bytes. [VERIFIED: `31-CONTEXT.md`; repository inspection]

The current corpus is already structurally sound: 2,000 regular English JSON files, unique contiguous IDs `1..2000`, unique full slugs, and non-empty projection fields. The committed index also has 2,000 valid records in numeric ID order and fixed key order. Its remaining drift is exactly 28 slugs and five descriptions; source-derived canonical output is 790,830 bytes, versus 790,807 committed bytes. [VERIFIED: read-only Node data audit on 2026-08-03]

The package scripts are the shared delivery gate for Cloudflare and Docker. Vercel's default build-command resolution uses the package build script unless a project override is configured, while the repository's timed build helper directly invokes Next and therefore needs its own parity stage. [VERIFIED: `package.json`, workflows, `Dockerfile`, `scripts/measure-build-pipeline.js`; CITED: https://vercel.com/docs/builds/configure-a-build#build-command]

**Primary recommendation:** implement `scripts/ai-faq-index.mjs` as the shared boundary, keep the existing fixture API as an adapter, add generator/verifier CLIs plus one `node:test` file, regenerate the public asset once, and place the same read-only verifier before every repository-owned Next build entry point.

## Project Constraints (from AGENTS.md)

- Preserve the existing Next.js App Router, React, Fumadocs, npm, static-export, and deployment model. [VERIFIED: `AGENTS.md`]
- Use Node.js 20 as the repository compatibility target and npm with the committed lockfile. [VERIFIED: `AGENTS.md`, `.nvmrc`, `Dockerfile`, GitHub workflows]
- Write planning documents, source, code comments, commit text, and PR text in English. [VERIFIED: `AGENTS.md`]
- Follow the repository's Prettier style: 2 spaces, semicolons, single quotes, trailing commas, LF, and 80-column wrapping. [VERIFIED: `AGENTS.md`, `prettier.config.js`]
- Keep focused Node tests on `node:test` and `node:assert/strict`; the repository has no dedicated Jest/Vitest configuration. [VERIFIED: `AGENTS.md`, `scripts/*.test.mjs`, `package.json`]
- Use explicit non-zero script failures and concise English operational logs. [VERIFIED: `AGENTS.md`, existing scripts]
- Keep edits scoped to generated-data tooling and preserve `FAQSearch`, its `/ai-faqs.en.json` fetch contract, Fuse fields, category behavior, and 12-item pagination. [VERIFIED: `31-CONTEXT.md`, `FAQSearch.tsx`]
- Perform implementation through the GSD execution workflow; this research artifact authorizes planning only. [VERIFIED: `AGENTS.md`]
- No project-defined skills exist under `.codex/skills` or `.agents/skills`. [VERIFIED: project skill discovery]

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Enumerate and validate canonical source files | Build tooling / Node CLI | File storage | Raw JSON files are the locked hand-edited authority. [VERIFIED: `31-CONTEXT.md`] |
| Project and serialize the page index | Build tooling / Node CLI | CDN / Static | The output is a committed static asset consumed at `/ai-faqs.en.json`. [VERIFIED: `FAQSearch.tsx`, `public/ai-faqs.en.json`] |
| Compare source and index in both directions | Build tooling / Node CLI | CI | The verifier is local, read-only, and returns process status for build gating. [VERIFIED: `31-CONTEXT.md`] |
| Publish generated bytes atomically | Build tooling / Node CLI | File storage | Same-directory rename owns the single publication boundary. [CITED: https://pubs.opengroup.org/onlinepubs/9799919799/functions/rename.html] |
| Reject stale data before static export | Package scripts / CI | Frontend build | Cloudflare and Docker call `npm run build`; Vercel resolves a project build command during `vercel build`. [VERIFIED: workflows and `Dockerfile`; CITED: https://vercel.com/docs/builds/configure-a-build#build-command] |
| Search, category filtering, and pagination | Browser / Client | CDN / Static | `FAQSearch` fetches the static asset and paginates 12 records without server involvement. [VERIFIED: `FAQSearch.tsx`] |

## Repository Baseline

| Surface | Current Evidence | Planning Consequence |
|---------|------------------|----------------------|
| Source inventory | 2,000 regular `.en.json` files, 3,755,109 bytes total, no symlinks, IDs `1..2000`, no malformed names, duplicate IDs, or duplicate slugs. [VERIFIED: filesystem and Node audit] | Production defaults can enforce exactly 2,000 and contiguous `1..2000`; compact tests need an injected expected count. |
| Source projection fields | All 2,000 records have non-empty string `title`, `description`, and `category`. [VERIFIED: Node audit] | Validate whitespace-aware non-emptiness and preserve raw source strings byte-for-byte in values. |
| Existing fixture loader | `ai-faq-fixture.mjs` sorts names lexically and submits all reads through one `Promise.all`. [VERIFIED: `scripts/ai-faq-fixture.mjs:7`] | Replace lexical ordering with validated numeric ordering and use bounded batches. |
| Existing index | 2,000 schema-valid records, exact key order, numeric ID order, no duplicate ID/slug, compact JSON, and no trailing newline. [VERIFIED: Node audit] | Generation changes only stale projected values while retaining asset shape and ordering. |
| Known drift | 28 slug drifts; description drifts at IDs 443, 1136, 1341, 1487, and 1845; zero question/category drifts. [VERIFIED: bidirectional Node audit] | Full-corpus parity should fail before regeneration and pass immediately after canonical generation. |
| Byte baseline | Current: 790,807 bytes and SHA-256 `bc2aebdae92d7dbbe2530c19776ff39e50303752a4703363193b7d567af4cdbc`; source-canonical: 790,830 bytes and SHA-256 `b9d9373d897dcce3cfc142b3a347251f5e576b1e4f9a1710ba7bfb1e1c912484`. [VERIFIED: read-only byte/hash audit] | Use canonical bytes computed at runtime for tests; retain these values as implementation-review evidence for this source snapshot. |
| Slug regression | Existing command passes 2,000 exact slugs and rejects 288 ambiguous normalized groups. [VERIFIED: `node scripts/verify-ai-faq-slugs.mjs`] | Preserve `loadFAQPages()` and `groupByNormalizedSlug()` compatibility while changing source order. |
| Client contract | Fields are `category`, `question`, `description`, `slug`; Fuse searches question/description; page size is 12. [VERIFIED: `FAQSearch.tsx:6`] | No client source change is required. |
| Build paths | Cloudflare and Docker use `npm run build`; `build:analyze` is local; timed builds invoke the Next binary directly; Vercel workflows use `vercel build`. [VERIFIED: package, workflow, Docker, and timing-script inspection] | Gate package scripts and the direct timed-build stages; verify Vercel logs show the package preflight. |

## Standard Stack

### Core

| Library / API | Version | Purpose | Why Standard |
|---------------|---------|---------|--------------|
| Node.js | 20.x project contract | Execute generator, verifier, and tests | Already fixed by `.nvmrc`, Docker, and CI; `node:test` is stable in Node 20. [VERIFIED: repository config; CITED: https://nodejs.org/download/release/v20.19.0/docs/api/test.html] |
| `node:fs/promises` | Node 20 built-in | Directory reads, file reads, temp writes, rename, cleanup | Supplies every required filesystem primitive without an external dependency. [CITED: https://nodejs.org/docs/latest-v20.x/api/fs.html] |
| `node:path` | Node 20 built-in | Fixed source/index path composition | Matches existing script conventions. [VERIFIED: repository scripts] |
| `node:crypto` `randomUUID()` | Node 20 built-in | Collision-resistant temporary suffix | Supports a unique `wx` temporary file without a package. [CITED: https://nodejs.org/docs/latest-v20.x/api/crypto.html] |
| `JSON.parse` / `JSON.stringify` | ECMAScript in Node 20 | Semantic parsing and canonical compact serialization | Plain-object property order is stable under the `Object.keys()` ordering algorithm. [CITED: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify] |
| `Map` / `Set` | ECMAScript in Node 20 | ID/slug grouping and bidirectional comparison | Gives linear-time identity lookup and explicit duplicate groups. [VERIFIED: standard runtime behavior exercised by repository Node scripts] |

### Supporting

| Library / API | Version | Purpose | When to Use |
|---------------|---------|---------|-------------|
| `node:test` | Stable in Node 20 | Focused unit/integration tests | Use for shared functions, temp fixtures, CLI behavior, and the full-corpus smoke. [CITED: https://nodejs.org/download/release/v20.19.0/docs/api/test.html] |
| `node:assert/strict` | Node 20 built-in | Exact value, bytes, status, and diagnostic assertions | Match every existing focused repository test. [VERIFIED: `scripts/*.test.mjs`] |
| `node:os` `tmpdir()` | Node 20 built-in | Isolated fixture roots | Pair with `mkdtemp()` and per-test cleanup. [CITED: https://nodejs.org/docs/latest-v20.x/api/os.html] |
| `node:child_process` | Node 20 built-in | One real process-level CLI smoke | `spawnSync`/`execFileSync` exposes status, stdout, and stderr. [CITED: https://nodejs.org/docs/latest-v20.x/api/child_process.html] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Explicit field guards | Existing `zod` dependency | Zod is already installed, while importing the TypeScript Fumadocs schema into a plain Node `.mjs` preflight adds build coupling. Four exact string fields are clearer as local guards. [VERIFIED: `source.config.ts`, package lock] |
| Batched `Promise.all` | A concurrency-limit package | The corpus is only 2,000 small files and a 32-item batch helper is sufficient; a package would add supply-chain and lockfile work. [VERIFIED: source inventory; ASSUMED: concurrency selection] |
| Canonical byte comparison | A JSON diff package | Four known fields and two identity maps provide more precise domain diagnostics with no dependency. [VERIFIED: locked field contract] |

**Installation:** no package installation or lockfile change is required. [VERIFIED: selected stack consists of Node built-ins and existing project dependencies]

**Version verification:** `.nvmrc`, all relevant GitHub Actions jobs, and `Dockerfile` pin Node 20; `package-lock.json` is lockfile v3 and currently resolves Next 14.2.28, TypeScript 5.8.3, Fumadocs MDX 11.5.8, and Fuse 7.1.0. [VERIFIED: repository inspection]

## Package Legitimacy Audit

Phase 31 should install zero external packages, so the package-legitimacy gate has no package candidates. [VERIFIED: Standard Stack recommendation]

**Packages removed due to [SLOP] verdict:** none

**Packages flagged as suspicious [SUS]:** none

## Architecture Patterns

### System Architecture Diagram

```text
content/ai-quick-reference/*.en.json
              |
              v
  enumerate regular .en.json entries
              |
              v
 validate filename -> parse numeric ID -> stable numeric sort
              |
              v
 read in bounded batches -> JSON/schema validation
              |
              v
 project { category, question, description, slug }
              |
              v
      canonical record array
          /             \
         v               v
 GENERATE command     VERIFY command
         |               |
 JSON.stringify          +--> read/parse committed index
         |               +--> source/index ID and slug maps
 same-dir temp write     +--> membership/order/field findings
         |               +--> canonical byte comparison
 atomic rename           |
         |          pass | fail + grouped diagnostics + exit 1
         v               |
 public/ai-faqs.en.json  |
         |               |
         +------> npm build preflight ------> Next static export
         |
         +------> /ai-faqs.en.json ------> FAQSearch in browser
```

This keeps the hand-edited source, derived static asset, read-only gate, build, and browser consumer as separate ownership boundaries. [VERIFIED: locked decisions and current repository flow]

### Recommended Project Structure

```text
scripts/
├── ai-faq-index.mjs              # Shared validation/projection/parity domain
├── ai-faq-fixture.mjs            # Compatibility adapter for slug/route checks
├── generate-ai-faq-index.mjs     # Atomic mutating CLI
├── verify-ai-faq-index.mjs       # Read-only parity CLI
└── ai-faq-index.test.mjs         # Focused fixtures and full-corpus smoke
public/
└── ai-faqs.en.json               # Generated committed artifact
```

### Component Responsibilities

| Component | Responsibility | Side Effects |
|-----------|----------------|--------------|
| `ai-faq-index.mjs` | Parse names, load with bounded concurrency, validate, project, serialize, compare, and format findings. | Reads only when loader functions are called. |
| `ai-faq-fixture.mjs` | Preserve `loadFAQPages()` and normalized grouping for Phase 29/32 consumers by delegating source loading to the shared module. | Source reads only. |
| `generate-ai-faq-index.mjs` | Run complete validation, compute bytes, write one unique same-directory temp file, rename, summarize. | Mutates only the requested output and its owned temp file. |
| `verify-ai-faq-index.mjs` | Read canonical source plus committed index, format every finding class, return status. | Read-only. |
| `ai-faq-index.test.mjs` | Exercise domain functions, injected CLI streams/status, temp directories, atomic cleanup, and full corpus. | Writes only unique OS temp directories and removes them. |
| `package.json` | Expose three commands and place verifier before Next in `build` and `build:analyze`. | Package orchestration only. |
| `measure-build-pipeline.js` | Add parity as the first build/analyze stage because this helper invokes Next directly. | Read-only preflight before existing build outputs. |

### Pattern 1: Parse Identity Before Reading Content

**What:** enumerate `Dirent` entries, select `.en.json`, reject non-regular entries, parse `^([1-9]\d*)-(.+)\.en\.json$`, preserve the full filename-derived slug, group duplicate IDs/slugs, then sort by numeric ID with filename as a deterministic tie-breaker.

**When to use:** every generation, verification, legacy fixture load, and full-corpus test.

**Why:** the current lexical sort begins `1, 10, 100, 1000...`, while canonical order is `1, 2, 3...`. [VERIFIED: `ai-faq-fixture.mjs` and filesystem audit]

### Pattern 2: Bounded Ordered Batches

**What:** use 32-file batches; each batch uses `Promise.all`, and batches execute sequentially. Preserve the already-sorted result array and project immediately after parsing.

**When to use:** the 2,000-file production loader and compact fixture loader.

**Why:** the current source is 3.76 MB across 2,000 files, so a fixed 32-item bound keeps descriptor pressure predictable while retaining parallel reads. [VERIFIED: source byte/count audit; ASSUMED: 32-file bound]

### Pattern 3: Structured Findings Before Text

**What:** comparison returns a report object containing a fixed category array, complete totals, and finding records. Formatting owns the 20-detail cap and process output; comparison never logs.

**When to use:** both verifier and generator validation failures, plus all tests.

**Recommended stable category order:**

1. malformed source identifiers
2. malformed index identifiers
3. invalid source projection schemas
4. invalid index projection schemas
5. duplicate source IDs
6. duplicate index IDs
7. duplicate source slugs
8. duplicate index slugs
9. source-only IDs
10. index-only IDs
11. ordering drift
12. slug drift
13. question drift
14. description drift
15. category drift
16. non-canonical serialization

Use one-based source/index positions in operator output. Render expected and actual values with `JSON.stringify()` so quotes, newlines, and control characters remain on one deterministic line. [CITED: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify]

### Pattern 4: Independent Invariants With Controlled Cascades

Build `Map<number, Record[]>` and `Map<string, Record[]>` for each side. Membership findings come from the union of valid unique IDs. Field comparison runs only when one valid source and one valid index record exist for an ID. Ordering compares the relative sequence of valid unique index IDs with its numerically sorted copy, so a single missing ID produces a source-only finding and avoids thousands of derived position findings.

This gives O(n) identity/field work plus O(n log n) sorting for 2,000 records, with stable output independent of filesystem enumeration. [VERIFIED: algorithm analysis against locked invariants]

### Pattern 5: Atomic Replacement After Complete Validation

```javascript
// Source: Node.js fs/promises docs and POSIX rename semantics.
const temporaryPath = join(
  dirname(outputPath),
  `.${basename(outputPath)}.${process.pid}.${randomUUID()}.tmp`,
);
let published = false;

try {
  await writeFile(temporaryPath, canonicalBytes, {
    encoding: 'utf8',
    flag: 'wx',
  });
  await rename(temporaryPath, outputPath);
  published = true;
} finally {
  if (!published) await rm(temporaryPath, { force: true });
}
```

The temporary path stays beside the destination to avoid `EXDEV`; POSIX specifies rename replacement as atomic visibility. The phase requires atomic replacement and leaves crash-durability synchronization outside its contract. [CITED: https://pubs.opengroup.org/onlinepubs/9799919799/functions/rename.html]

### Pattern 6: Explicit Read-Only Build Prefix

Use direct `&&` sequencing in `build` and `build:analyze` so the verifier completes before the Next process starts. Add the same verifier stage before direct Next invocations in `measure-build-pipeline.js`. [VERIFIED: locked D-09/D-10 and direct-invocation audit]

```json
{
  "scripts": {
    "generate:ai-faq-index": "node scripts/generate-ai-faq-index.mjs",
    "verify:ai-faq-index": "node scripts/verify-ai-faq-index.mjs",
    "test:ai-faq-index": "node --test scripts/ai-faq-index.test.mjs",
    "build": "npm run verify:ai-faq-index && next build && node scripts/normalize-root-locale.js",
    "build:analyze": "npm run verify:ai-faq-index && ANALYZE=true next build && node scripts/normalize-root-locale.js"
  }
}
```

### Anti-Patterns to Avoid

- **Aligning by slug:** slug is a compared field and is currently wrong for 28 records; align by validated numeric ID.
- **Lexical filename sorting:** it produces `1, 10, 100...`; parse and sort integers.
- **Generating inside build:** the locked build gate is read-only and must expose stale committed data.
- **Writing the destination directly:** partial writes can corrupt the static asset; publish through one same-directory rename.
- **Failing on the first mismatch:** collect complete totals and cap only the displayed details.
- **Raw expected/actual logging:** source values can contain newlines or control characters; serialize diagnostic values.
- **Using `Promise.all` over all 2,000 reads:** retain a fixed bound selected for file-descriptor stability.
- **Calling Fumadocs generated loaders from the preflight:** raw JSON is the canonical input and must remain available before an expensive framework build.
- **Extending Phase 31 into sitemap/route verification:** retain those checks for Phase 32.

## Candidate Files

| File | Planned Action | Rationale |
|------|----------------|-----------|
| `scripts/ai-faq-index.mjs` | Add | Single shared, testable domain boundary required by D-08. |
| `scripts/ai-faq-fixture.mjs` | Modify | Delegate loading to the shared numeric loader while preserving existing exports. [VERIFIED: imported by both current FAQ verifiers] |
| `scripts/generate-ai-faq-index.mjs` | Add | Explicit atomic maintainer command required by SOURCE-01 and D-04. |
| `scripts/verify-ai-faq-index.mjs` | Add | Read-only parity/build command required by PARITY-01 and DELIVERY-01. |
| `scripts/ai-faq-index.test.mjs` | Add | Focused Node test matrix plus full-corpus smoke required by D-13 through D-15. |
| `public/ai-faqs.en.json` | Regenerate once | Removes the observed 28 slug and five description drifts through canonical projection. [VERIFIED: data audit] |
| `package.json` | Modify | Adds the three locked commands and gates build/analyze. |
| `scripts/measure-build-pipeline.js` | Modify | Its build/analyze modes call the Next binary directly and bypass package scripts. [VERIFIED: file inspection] |
| `scripts/measure-build-pipeline.test.mjs` | Modify | Lock the parity stage before direct Next stages and preserve stop-on-failure behavior. [VERIFIED: existing stage-order tests] |
| `.github/workflows/deploy.yml`, `.github/workflows/preview.yml` | Verify during execution | Vercel uses `vercel build`; accepted logs must show package preflight before Next. [VERIFIED: workflow inspection; CITED: https://vercel.com/docs/builds/configure-a-build#build-command] |
| `.github/workflows/deploy-cloudflare.yml`, `.github/workflows/preview-cloudflare.yml`, `Dockerfile` | Inspection-only acceptance surfaces | They already call `npm run build` and inherit the package gate. [VERIFIED: repository inspection] |
| `FAQSearch.tsx`, `source.config.ts`, `lib/source.ts`, `verify-ai-faq-routes.mjs` | Preserve | They define stable client/source/Phase 32 boundaries and need no Phase 31 behavior change. [VERIFIED: locked scope] |

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| JSON parsing/serialization | Custom tokenizer or key sorter | `JSON.parse` and fixed-order object literals with `JSON.stringify` | Handles escaping and stable plain-object property traversal. [CITED: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify] |
| Atomic visibility | Copy/truncate/delete sequence | `writeFile(..., { flag: 'wx' })` plus same-directory `rename` | Keeps old or new directory entry visible across replacement. [CITED: https://pubs.opengroup.org/onlinepubs/9799919799/functions/rename.html] |
| Temporary fixture lifecycle | Repository scratch folders | `mkdtemp(tmpdir())` plus test cleanup hook | Isolates parallel tests and protects the checkout. [CITED: https://nodejs.org/download/release/v20.19.0/docs/api/test.html] |
| Identity reconciliation | Nested scans | `Map`/`Set` keyed by numeric ID and full slug | Gives direct grouping, duplicate detection, and linear comparison. |
| Concurrency package | New limiter dependency | 32-item ordered batches | The fixed 2,000-file workload needs only a small local helper. [ASSUMED] |
| General JSON diff | Deep-diff dependency | Four explicit projected field comparisons | Diagnostics need domain field names and source/index positions. |
| Source schema reuse through build output | Import `.source` or compile `source.config.ts` | Plain Node guards over raw JSON fields | The preflight must run before Fumadocs/Next build work. [VERIFIED: build order and source authority] |

**Key insight:** this phase has a narrow four-field domain. Standard runtime primitives plus explicit domain findings are easier to audit than generic generator, schema, diff, or concurrency packages.

## Common Pitfalls

### Pitfall 1: Slug-Based Alignment Hides the Exact Bug

**What goes wrong:** the 28 stale index records appear as one source-only plus one index-only slug instead of one precise `slug` drift at the same ID.

**Why it happens:** the full slug is treated as identity even though the locked identity is the leading numeric ID.

**How to avoid:** derive IDs independently on both sides, group by ID, then compare the complete slug as a field.

**Warning signs:** known IDs such as 28 or 79 appear in missing/orphan categories. [VERIFIED: current drift audit]

### Pitfall 2: Missing Records Create Cascading Ordering Noise

**What goes wrong:** one missing index record shifts every later absolute position and fills the first-20 output with consequences.

**Why it happens:** ordering is checked by raw absolute positions before membership is understood.

**How to avoid:** compare relative order among valid unique IDs; membership findings own absent records.

**Warning signs:** a one-record fixture reports hundreds of order mismatches.

### Pitfall 3: Semantic Equality Lets Stale Bytes Through

**What goes wrong:** pretty printing, key reordering, or a trailing newline passes field comparison while the committed artifact is non-canonical.

**Why it happens:** the verifier stops after `JSON.parse` and deep equality.

**How to avoid:** compute `JSON.stringify(canonicalRecords)` and compare the complete UTF-8 string after semantic checks.

**Warning signs:** a whitespace-only fixture exits zero. [VERIFIED: D-03 and D-08]

### Pitfall 4: Direct Timed Builds Bypass Package Gates

**What goes wrong:** `npm run build:timed` and `npm run build:analyze:timed` start Next without invoking the new package `build` scripts.

**Why it happens:** `measure-build-pipeline.js` executes `node_modules/.bin/next build` directly.

**How to avoid:** add the parity command as the first build/analyze timing stage and update stage-order tests.

**Warning signs:** timed-build output begins with `pre generated diff guard` and then `Next ... build`, with no AI FAQ parity stage. [VERIFIED: `measure-build-pipeline.js`]

### Pitfall 5: Temp Cleanup Masks the Original Failure

**What goes wrong:** a cleanup error replaces the validation/write/rename error or leaves an owned temp file.

**Why it happens:** cleanup is unguarded or runs against a broad pattern.

**How to avoid:** own one exact temp path, use `rm(path, { force: true })` in `finally`, and retain the original error when cleanup also fails.

**Warning signs:** `.ai-faqs.en.json.*.tmp` remains after an injected rename failure. [CITED: https://nodejs.org/docs/latest-v20.x/api/fs.html]

### Pitfall 6: Test Fixtures Cannot Express a Duplicate Source Filename

**What goes wrong:** a test attempts to create two files with the same full slug in one directory and silently overwrites the first.

**Why it happens:** filesystem names are unique, while D-01 also requires defensive duplicate-slug validation at the record boundary.

**How to avoid:** test duplicate source IDs through two filenames and test duplicate full source slugs through the pure record-validator input.

**Warning signs:** the supposed duplicate-source-slug fixture contains only one file.

### Pitfall 7: Local Success Uses the Wrong Node Major

**What goes wrong:** tests pass under the machine's Node 24.13.0 while the repository contract and hosted builds use Node 20.

**Why it happens:** `.nvmrc` is not active in this shell and no local Node 20 executable is installed.

**How to avoid:** run fast local feedback on Node 24, then require the full focused suite and build preflight on CI's pinned Node 20 before phase acceptance.

**Warning signs:** `node --version` prints `v24.13.0`. [VERIFIED: environment audit]

## Code Examples

### Exact Projection

```javascript
// Source: Phase 31 D-02 and FAQSearch's public shape.
export function projectFAQIndexRecord(sourceRecord) {
  return {
    category: sourceRecord.data.category,
    question: sourceRecord.data.title,
    description: sourceRecord.data.description,
    slug: sourceRecord.slug,
  };
}
```

The validator should use `value.trim().length > 0` only as an acceptance predicate and preserve the original string value in output. [VERIFIED: exact-projection requirement]

### Relative Ordering Check

```javascript
// Source: locked numeric-order requirement.
const actualIds = indexRecords
  .filter((record) => record.validIdentifier && record.uniqueId)
  .map((record) => record.id);
const expectedIds = [...actualIds].sort((left, right) => left - right);

for (let position = 0; position < actualIds.length; position += 1) {
  if (actualIds[position] !== expectedIds[position]) {
    findings.push({
      id: actualIds[position],
      indexPosition: position + 1,
      field: 'position',
      expected: expectedIds[position],
      actual: actualIds[position],
    });
  }
}
```

### Injectable CLI Boundary

```javascript
// Source: repository runCli test pattern in check-deployment-parity.test.mjs.
export async function runVerifyFAQIndex({
  sourceDirectory = DEFAULT_SOURCE_DIRECTORY,
  indexPath = DEFAULT_INDEX_PATH,
  stdout = process.stdout,
  stderr = process.stderr,
} = {}) {
  const report = await verifyFAQIndex({ sourceDirectory, indexPath });
  const output = formatFAQIndexReport(report);
  (report.ok ? stdout : stderr).write(output);
  return report.ok ? 0 : 1;
}
```

This lets compact temp fixtures exercise the CLI contract without adding public test-only path flags. [VERIFIED: existing injected-CLI repository pattern]

## State of the Art

| Old Approach | Current Phase Approach | Impact |
|--------------|------------------------|--------|
| Hand-maintained `public/ai-faqs.en.json` | Source-derived explicit generator | Source becomes the sole hand-edited authority. [VERIFIED: SOURCE-01] |
| Lexical filename order | Validated numeric ID order | IDs emit predictably from 1 through 2000. [VERIFIED: D-01] |
| Source-wide slug resolution only | Source/index semantic and byte parity | Missing, orphaned, duplicate, field, order, and serialization drift fail locally. [VERIFIED: D-06] |
| Build begins with Next | Build begins with read-only parity | Stale committed data fails before static export cost. [VERIFIED: D-09/D-10] |
| Unbounded 2,000-read `Promise.all` | Bounded 32-read batches | Descriptor usage becomes fixed and testable. [ASSUMED] |

**Deprecated/outdated:**

- Direct manual edits to `public/ai-faqs.en.json`: the generator owns this derived artifact after Phase 31. [VERIFIED: SOURCE-01]
- Lexical `.sort()` in the shared FAQ loader: numeric identity defines canonical order. [VERIFIED: D-01]
- Any parity implementation that normalizes slugs: Phase 31 compares exact full slugs. [VERIFIED: D-05]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | A read concurrency of 32 balances throughput and descriptor stability for this 2,000-file, 3.76 MB corpus. | Architecture Patterns / Standard Stack | A lower bound may be faster on Node 20's filesystem thread pool; a higher bound may still be safe. Keep it one constant and verify runtime under Node 20. |

## Open Questions (RESOLVED)

1. **Does the linked Vercel project override its Build Command?**
   - What we know: the repository has no `buildCommand`; Vercel documentation says a configured `buildCommand` overrides the package build script. [VERIFIED: `vercel.json`; CITED: https://vercel.com/docs/project-configuration#buildcommand]
   - What's unclear: dashboard state is external to git and was unavailable during this planning-only run.
   - RESOLVED: Phase 31 accepts the delivery path only after one Vercel build log proves `verify:ai-faq-index` completes before Next. The operator routes any dashboard Build Command through `npm run build` before acceptance.

2. **When will the repository move beyond Node 20?**
   - What we know: repository execution is pinned to Node 20, and the Node.js Release Working Group records Node 20 end-of-life as 2026-04-30. [VERIFIED: repository config; CITED: https://github.com/nodejs/Release#release-schedule]
   - What's unclear: the runtime-upgrade owner and schedule are outside Phase 31.
   - RESOLVED: Phase 31 retains Node 20 compatibility and records focused suite plus both static build commands on pinned Node 20 CI. Runtime upgrade ownership remains a separate security task.

3. **Should atomic publication include crash durability?**
   - What we know: same-filesystem rename gives atomic visibility; guaranteed post-crash durability can require file and directory synchronization. [CITED: https://pubs.opengroup.org/onlinepubs/9799919799/xrat/V4_xbd_chap01.html]
   - What's unclear: D-04 requires atomic replacement and does not require power-loss durability.
   - RESOLVED: D-04 accepts same-filesystem atomic visibility through temporary write and rename. Power-loss durability and directory synchronization remain outside Phase 31 scope.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Node.js default shell runtime | Fast local tests and data audit | Available, wrong major | 24.13.0 | Use for fast feedback; accept on pinned Node 20 CI. [VERIFIED: environment audit] |
| Node.js 20 local executable | Compatibility acceptance | No | — | GitHub Actions and Dockerfile are configured for Node 20; Docker CLI is unavailable locally. [VERIFIED: environment and repo audit] |
| npm | Package commands | Yes | 11.6.2 | CI uses npm with the committed lockfile. [VERIFIED: environment and workflows] |
| Installed dependencies | Existing tests/build tooling | Yes | lockfile v3 | `node_modules` is present. [VERIFIED: environment audit] |
| Docker CLI | Container-path reproduction | No | — | Phase 31 can validate package/build behavior through hosted CI; container publication remains outside local research. [VERIFIED: environment audit] |
| Network services | Generator/verifier | Not required | — | All Phase 31 source/index work is repository-local. [VERIFIED: locked phase scope] |

**Missing dependencies with no fallback:** none for implementation; final Node 20 acceptance depends on hosted CI. [VERIFIED: environment audit]

**Missing dependencies with fallback:** local Node 20 and Docker; hosted build configuration supplies the required Node major and Phase 31 needs no container-local behavior. [VERIFIED: repository configuration]

## Validation Architecture

`workflow.nyquist_validation` is enabled, so Phase 31 needs an executable requirement-to-test map and Wave 0 test seam. [VERIFIED: `.planning/config.json`]

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Node.js 20 built-in `node:test` + `node:assert/strict` |
| Config file | none |
| Quick run command | `npm run test:ai-faq-index` |
| Full suite command | `npm run test:ai-faq-index && npm run test:ai-faq-slugs && npm run verify:ai-faq-index && npm run lint` |
| Phase gate command | Full suite, then `npm run build` and `npm run build:analyze` on Node 20 |

### Phase Requirements -> Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SOURCE-01 | Generator reads only source files, projects exact fields, publishes atomically, and leaves no temp residue on failure. | unit + integration | `npm run test:ai-faq-index` | ❌ Wave 0 |
| SOURCE-02 | Full corpus emits exactly 2,000 records in ID order and equals the source-derived canonical bytes. | read-only corpus smoke | `npm run test:ai-faq-index && npm run verify:ai-faq-index` | ❌ Wave 0 |
| PARITY-01 | Both-direction membership, duplicate, identifier, schema, order, field, and byte findings have stable totals/details/status. | fixture matrix + CLI contract | `npm run test:ai-faq-index` | ❌ Wave 0 |
| DELIVERY-01 | Build/analyze and timed-build paths run parity before Next; stale fixture returns non-zero without mutation. | package wiring + stage order + integration | `npm run test:ai-faq-index && node --test scripts/measure-build-pipeline.test.mjs` | Partial: timing test exists; FAQ tests are Wave 0 |

### Focused Fixture Matrix

| Case | Mutation | Required Assertion |
|------|----------|--------------------|
| Valid compact corpus | IDs 1..3 | Zero findings, exact projection, canonical bytes. |
| Determinism | Generate same fixture twice | Byte-identical reads and no trailing newline. |
| Malformed source identifier | Rename one file outside canonical regex | Category total, filename detail, status 1, output untouched. |
| Missing source ID | Remove ID 2 | Contiguity/schema failure with actionable ID. |
| Duplicate source ID | Add another `2-*.en.json` | Both records/positions identified. |
| Duplicate source slug | Inject duplicate records into pure validator | Duplicate slug group is detected defensively. |
| Invalid source JSON/schema | Broken JSON, missing field, empty/whitespace field | Stable field or `$json` diagnostic. |
| Source-only ID | Remove matching index record | Source-only total/detail; zero synthetic order cascade. |
| Index-only ID | Add ID 4 to index | Index-only total/detail. |
| Duplicate index ID | Add distinct slug with existing ID | Duplicate ID records/positions. |
| Duplicate index slug | Repeat a full index record | Duplicate slug records/positions. |
| Malformed index identifier/schema | Bad slug, non-array top-level, extra/missing/non-string key | Correct category and field detail. |
| Field drift | Mutate slug, question, description, category one case each | ID, positions, exact field, expected, actual. |
| Ordering drift | Swap IDs 2 and 3 | Ordering findings only for moved records. |
| Non-canonical bytes | Whitespace, key order, or trailing newline only | Semantic totals zero; serialization total one; status 1. |
| Display cap | Supply 21 synthetic findings in one category | Total 21, exactly 20 details, deterministic ordering. |
| Atomic failure | Inject write or rename failure | Existing destination bytes preserved and exact temp path removed. |
| Complete corpus | Real source + regenerated index | 2,000 records and zero category totals. |

### Sampling Rate

- **Per task commit:** `npm run test:ai-faq-index`
- **Per shared-loader change:** `npm run test:ai-faq-index && npm run test:ai-faq-slugs`
- **Per build-integration change:** focused tests plus `node --test scripts/measure-build-pipeline.test.mjs`
- **Per wave merge:** full suite command
- **Phase gate:** full suite, byte-stable double generation in temp space, clean `git diff --exit-code` around read-only verifier, then build and analyzer on Node 20

### Wave 0 Gaps

- [ ] `scripts/ai-faq-index.test.mjs` - defines SOURCE-01, SOURCE-02, PARITY-01, and DELIVERY-01 behavior before implementation.
- [ ] `scripts/ai-faq-index.mjs` - minimal exports required for the first failing projection/validation tests.
- [ ] Package commands `generate:ai-faq-index`, `verify:ai-faq-index`, and `test:ai-faq-index` - absent today.
- [ ] Node 20 execution surface - unavailable locally; hosted CI must supply accepted runtime evidence.

## Security Domain

`security_enforcement` is enabled at ASVS Level 1. Phase 31 processes repository-controlled JSON and writes one public static asset; its applicable controls center on validation, path safety, resource bounds, and failure integrity. [VERIFIED: `.planning/config.json`; phase architecture]

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | No identity boundary exists in this local CLI. |
| V3 Session Management | no | No session state exists. |
| V4 Access Control | no | The CLI uses fixed repository paths and local filesystem permissions. |
| V5 Input Validation | yes | Canonical filename regex, regular-file check, JSON parse handling, exact object/field guards, bounded inventory, and exact index schema. |
| V6 Cryptography | no | `randomUUID()` supplies temp-name uniqueness; the phase defines no security token or cryptographic protocol. |

### Known Threat Patterns for Node File Generators

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Symlink or unexpected directory entry followed during source read | Tampering | Enumerate `Dirent`, require regular `.en.json` files, reject unexpected entry types. |
| Temp-path collision or pre-created link | Tampering | `randomUUID()` suffix plus exclusive `wx` creation in the destination directory. |
| Partial destination write | Tampering / Denial of Service | Complete validation and temp write before atomic rename. [CITED: https://pubs.opengroup.org/onlinepubs/9799919799/functions/rename.html] |
| File-descriptor/resource exhaustion | Denial of Service | 32-read bound and exact 2,000-record production inventory. [ASSUMED: bound; VERIFIED: inventory] |
| Terminal/log control characters in data | Spoofing | Render diagnostic values through `JSON.stringify()` and keep one finding per line. |
| Prototype-bearing parsed objects | Tampering | Read only named scalar fields and construct fresh fixed-key objects; avoid object merge/spread from source data. |
| Unsupported Node runtime | Elevation / maintenance exposure | Preserve pinned compatibility for Phase 31 and record Node 20 EOL as a separate upgrade/security action. [CITED: https://github.com/nodejs/Release#release-schedule] |

## Sources

### Primary (HIGH confidence)

- Repository source and planning files - phase decisions, requirements, data counts, drift audit, build paths, current tests, and client contract. [VERIFIED: direct codebase inspection]
- `content/ai-quick-reference/*.en.json` and `public/ai-faqs.en.json` - full 2,000-record semantic and byte audit. [VERIFIED: read-only Node audit]

### Secondary (MEDIUM confidence)

- https://nodejs.org/docs/latest-v20.x/api/fs.html - filesystem promise APIs and write sequencing. [CITED: https://nodejs.org/docs/latest-v20.x/api/fs.html]
- https://nodejs.org/download/release/v20.19.0/docs/api/test.html - Node 20 stable test runner and cleanup hooks. [CITED: https://nodejs.org/download/release/v20.19.0/docs/api/test.html]
- https://nodejs.org/docs/latest-v20.x/api/child_process.html - child-process status/stdout/stderr behavior. [CITED: https://nodejs.org/docs/latest-v20.x/api/child_process.html]
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify - stable property traversal and compact serialization. [CITED: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify]
- https://pubs.opengroup.org/onlinepubs/9799919799/functions/rename.html - atomic same-filesystem rename replacement and `EXDEV`. [CITED: https://pubs.opengroup.org/onlinepubs/9799919799/functions/rename.html]
- https://pubs.opengroup.org/onlinepubs/9799919799/xrat/V4_xbd_chap01.html - atomic visibility versus durability. [CITED: https://pubs.opengroup.org/onlinepubs/9799919799/xrat/V4_xbd_chap01.html]
- https://vercel.com/docs/builds/configure-a-build#build-command - Vercel build-command resolution. [CITED: https://vercel.com/docs/builds/configure-a-build#build-command]
- https://vercel.com/docs/project-configuration#buildcommand - project override precedence. [CITED: https://vercel.com/docs/project-configuration#buildcommand]
- https://github.com/nodejs/Release#release-schedule - Node 20 lifecycle status. [CITED: https://github.com/nodejs/Release#release-schedule]

### Tertiary (LOW confidence)

- 32-file source-read concurrency - engineering recommendation pending Node 20 measurement. [ASSUMED]

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - no new packages; Node built-ins and repository pins were directly verified.
- Architecture: HIGH - derived from locked decisions, exact current call paths, and full-corpus inspection.
- Parity algorithm: HIGH - each invariant maps directly to D-01 through D-08 and was checked against the observed drift.
- Build integration: MEDIUM - repository-owned paths are verified; Vercel dashboard override state remains external.
- Performance bound: LOW - 32 is deliberately configurable and requires Node 20 timing confirmation.
- Pitfalls: HIGH - grounded in current lexical/unbounded loader behavior, current drift, and direct build bypasses.

**Research date:** 2026-08-03

**Valid until:** 2026-09-02 for codebase findings; recheck Vercel project settings and Node runtime policy at execution.
