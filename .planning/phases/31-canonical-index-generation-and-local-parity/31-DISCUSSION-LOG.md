# Phase 31: Canonical Index Generation And Local Parity - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md; this log preserves the alternatives considered.

**Date:** 2026-08-03
**Phase:** 31-canonical-index-generation-and-local-parity
**Areas discussed:** Canonical Projection And Serialization, Parity Identity And Diagnostics, Build And CI Gate Behavior, Regression Fixtures And CLI Contract
**Decision authority:** The user explicitly delegated every interactive choice
to the agent and requested uninterrupted progress. The agent selected every
recommended option from repository evidence, the approved roadmap boundary,
performance and stability priorities, and existing validation patterns.
**Area selection:** All four material gray areas were selected. Each area
completed after four decisions, followed by an agent-selected `Next area`
route. The final routing choice was `Ready for context` because every material
choice had a concrete outcome.

---

## Canonical Projection And Serialization

### Canonical Identity And Order

| Option | Description | Selected |
|--------|-------------|----------|
| Numeric filename ID with contiguous-range validation | Parse the leading integer, require unique IDs `1..2000`, and sort numerically. | Yes |
| Lexicographic filename order | Reuse the current `.sort()` behavior, which places `10` before `2`. | |
| Filesystem enumeration order | Preserve directory traversal order and its environment-dependent behavior. | |

**Selection:** Numeric filename ID with contiguous-range validation.
**Notes:** The source filenames already encode stable numeric identity. The
public index currently follows IDs `1..2000`; numeric parsing makes that
contract explicit and detects missing or malformed records early.

### Public Record Projection

| Option | Description | Selected |
|--------|-------------|----------|
| Exact existing four-field client contract | Emit `category`, `question` from `title`, `description`, and filename-derived `slug`; validate every input. | Yes |
| Expand with keywords and content | Add source fields the current client data contract does not consume. | |
| Preserve existing values on invalid source | Fall back to derived-file values when canonical source fields fail validation. | |

**Selection:** Exact existing four-field client contract.
**Notes:** `FAQSearch.tsx` consumes these four fields and preserves existing
Fuse search, category filtering, and pagination behavior. Strict source
validation keeps source JSON authoritative.

### Serialization Shape

| Option | Description | Selected |
|--------|-------------|----------|
| Compact deterministic JSON | Preserve stable record/key order, compact encoding, and the current closing-bracket ending. | Yes |
| Two-space pretty JSON | Improve direct artifact reading and increase the public payload. | |
| Newline-delimited JSON | Change the asset format and client parsing contract. | |

**Selection:** Compact deterministic JSON.
**Notes:** The current client asset is 790,807 bytes and compact. Deterministic
serialization plus the verifier supplies reviewability while preserving the
payload-efficient public shape.

### Publication Behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Validated atomic replacement | Validate all sources, use bounded reads, write a same-directory temporary file, rename atomically, clean up, and log a summary. | Yes |
| Direct overwrite | Stream results into the committed asset while source processing remains in progress. | |
| Standard output only | Leave publication and redirection mechanics to the maintainer. | |

**Selection:** Validated atomic replacement.
**Notes:** Atomic replacement protects the committed asset from partial output.
Bounded reads preserve throughput and file-descriptor stability across 2,000
small files. English count/path/byte logs give operators a clear completion
record.

**Area routing:** Next area. Remaining areas were Parity Identity And
Diagnostics, Build And CI Gate Behavior, and Regression Fixtures And CLI
Contract.

---

## Parity Identity And Diagnostics

### Record Alignment

| Option | Description | Selected |
|--------|-------------|----------|
| Numeric ID plus full-slug uniqueness | Align source and index by numeric ID, then compare full slug and fields; validate IDs and slugs independently. | Yes |
| Full-slug sets only | Represent each stale slug as one source-only and one index-only record. | |
| Array position only | Compare records by offset and derive identity from ordering. | |

**Selection:** Numeric ID plus full-slug uniqueness.
**Notes:** Numeric alignment turns the known 28 stale slugs into precise field
drifts tied to their source IDs while still detecting missing and orphaned
records.

### Mismatch Classes

| Option | Description | Selected |
|--------|-------------|----------|
| Required classes plus invalid-input and serialization checks | Cover missing, orphaned, duplicates, order, projected fields, malformed IDs/schemas, and canonical bytes. | Yes |
| Required semantic classes only | Cover the five roadmap categories and leave malformed inputs and serialization unconstrained. | |
| Byte comparison only | Detect drift through one canonical text comparison. | |

**Selection:** Required classes plus invalid-input and serialization checks.
**Notes:** The expanded classifications remain inside source-to-index parity and
produce actionable root causes. Sitemap and route classifications retain Phase
32 ownership.

### Failure Detail Volume

| Option | Description | Selected |
|--------|-------------|----------|
| Grouped totals plus first 20 per class | Print complete counts and bounded record details in deterministic category order. | Yes |
| First mismatch only | Stop at one issue and require repeated runs for broader drift. | |
| Full unbounded dump | Print every mismatch and allow large logs for corrupted inventories. | |

**Selection:** Grouped totals plus first 20 per class.
**Notes:** Twenty detailed records per class balance diagnosis and log size. Each
detail carries ID, positions, field, expected value, and actual value, followed
by the exact regeneration command.

### Shared Projection Authority

| Option | Description | Selected |
|--------|-------------|----------|
| Shared pure projection and serialization functions | Reuse one loader, validator, sorter, projector, and serializer in generation, parity, and tests. | Yes |
| Independent implementations | Give generator and verifier separate mapping logic. | |
| Write-capable generator subprocess | Make the verifier invoke generation and inspect the written result. | |

**Selection:** Shared pure projection and serialization functions.
**Notes:** Shared functions remove projection drift and support semantic plus
canonical byte verification through read-only operations.

**Area routing:** Next area. Remaining areas were Build And CI Gate Behavior
and Regression Fixtures And CLI Contract.

---

## Build And CI Gate Behavior

### Stale Index Handling

| Option | Description | Selected |
|--------|-------------|----------|
| Verify-only build gate | Reject drift and direct maintainers to the explicit generator command. | Yes |
| Automatic build generation | Refresh the derived file during every build and continue. | |
| CI workflow gate only | Keep local package builds independent from parity. | |

**Selection:** Verify-only build gate.
**Notes:** Read-only verification exposes stale committed data and preserves a
clean deterministic checkout in local, CI, and deployment environments.

### Gate Coverage

| Option | Description | Selected |
|--------|-------------|----------|
| All package build entry points | Gate `build` and `build:analyze`; let Vercel, Cloudflare, and Docker inherit the package preflight. | Yes |
| Dedicated GitHub Actions step | Add workflow-specific parity execution. | |
| Default local build only | Gate `npm run build` and leave analyzer and other paths independent. | |

**Selection:** All package build entry points.
**Notes:** A package-level seam centralizes behavior and prevents workflow
implementations from drifting. Existing deployment paths already converge on
the project build commands.

### Phase Boundary At The Gate

| Option | Description | Selected |
|--------|-------------|----------|
| Source and page-index parity | Check English projection semantics and canonical bytes before export. | Yes |
| Representative route verification | Add the current sitemap and collision-route sample verifier. | |
| Full four-set route matrix | Compare source, index, sitemap, and every generated route. | |

**Selection:** Source and page-index parity.
**Notes:** This is the complete Phase 31 requirement surface. Phase 32 owns
sitemap, route, static-output, and deployed verification.

### Operator Failure Experience

| Option | Description | Selected |
|--------|-------------|----------|
| Early actionable failure | Print grouped English diagnostics, name the asset, show the generation command, return non-zero, and preserve files. | Yes |
| Silent non-zero failure | Keep build logs compact and rely on command knowledge. | |
| Auto-fix with warning | Refresh the asset and continue static export. | |

**Selection:** Early actionable failure.
**Notes:** The gate runs before expensive static export, so drift consumes
minimal build time and operators receive the next concrete action immediately.

**Area routing:** Next area. The remaining area was Regression Fixtures And CLI
Contract.

---

## Regression Fixtures And CLI Contract

### Test Runner

| Option | Description | Selected |
|--------|-------------|----------|
| `node:test` and strict assertions | Match the existing repository test stack and Node 20 runtime. | Yes |
| Vitest | Add a framework and dependency for the new suite. | |
| Top-level assertion scripts | Follow the current slug verifier style for every focused test. | |

**Selection:** `node:test` and strict assertions.
**Notes:** The repository already uses `node:test` for generated-data and
validator contracts, making this the smallest stable extension.

### Fixture Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Small temporary fixtures plus real-corpus smoke | Exercise filesystem and CLI behavior with isolated mutations, then verify all 2,000 committed sources read-only. | Yes |
| Full corpus copy per case | Copy all source files and the index for each mutation. | |
| In-memory records only | Test pure mapping behavior and skip filesystem and CLI contracts. | |

**Selection:** Small temporary fixtures plus real-corpus smoke.
**Notes:** Temporary paths protect the committed asset, allow one-fault fixtures,
and keep the suite fast. The full-corpus case proves production-scale input.

### Required Regression Matrix

| Option | Description | Selected |
|--------|-------------|----------|
| Complete deterministic and invalid-input matrix | Cover repeat generation, projection, order, all parity classes, malformed input, serialization, status, and diagnostics. | Yes |
| Happy path plus one stale slug | Cover core generation and the current headline drift. | |
| Public JSON snapshot | Treat the committed artifact as the expected output snapshot. | |

**Selection:** Complete deterministic and invalid-input matrix.
**Notes:** One mutation per fixture keeps failures attributable. Two consecutive
generations must produce identical bytes.

### Maintainer Commands

| Option | Description | Selected |
|--------|-------------|----------|
| Three focused npm commands | Separate generation, production parity, and regression tests; preserve existing slug and route commands. | Yes |
| One combined command | Write, verify, test, and build in one invocation. | |
| Replace current AI FAQ commands | Fold exact-slug and route verification into the new tools. | |

**Selection:** Three focused npm commands.
**Notes:** Commands are `generate:ai-faq-index`, `verify:ai-faq-index`, and
`test:ai-faq-index`. Build invokes the fast production verifier. Focused tests
run explicitly during implementation and CI validation. Existing slug and
route verifiers retain their established surfaces.

**Area routing:** Ready for context. Every selected area had four concrete
decisions and the repository evidence exposed no additional material gray area.

---

## the agent's Discretion

- Shared helper, CLI, and fixture filenames.
- Bounded source-read concurrency value.
- Same-directory temporary-file suffix and cleanup implementation.
- Exact English log punctuation and summary layout inside the locked diagnostic
  contract.

## Deferred Ideas

- Phase 32: sitemap-set parity, complete generated-route checks, static-output
  validation, deployment, and production evidence.
- Later milestones: locale and hreflang alignment, `/zh-cn` inventory work,
  broad taxonomy and metadata cleanup, content rewriting, Search Console
  recrawl operations, and client payload sharding.
