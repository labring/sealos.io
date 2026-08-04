---
phase: 32
slug: sitemap-route-parity-and-production-verification
status: planned
nyquist_compliant: true
wave_0_complete: false
created: 2026-08-04
requirements: [PARITY-02, DELIVERY-02]
---

# Phase 32 - Validation Strategy

## Test Infrastructure

| Property | Value |
|---|---|
| Framework | Node.js 20 `node:test` and `node:assert/strict` |
| New focused file | `scripts/verify-ai-faq-routes.test.mjs` |
| Quick command | `node --test scripts/verify-ai-faq-routes.test.mjs` |
| Local non-build command | `npm run test:ai-faq-index && npm run test:ai-faq-slugs && node --test scripts/verify-ai-faq-routes.test.mjs && node --test scripts/measure-build-pipeline.test.mjs && npm run verify:ai-faq-index && npm run lint` |
| Production command | `npm run verify:ai-faq-routes -- https://sealos.io` |
| Static build acceptance | `npm run build` on Node.js 20, followed by the retained route command |

Wave 0 creates the focused route-verifier test file and testable exports in the
existing verifier. No test framework, package, lockfile, service, or browser
installation is required.

## Sampling Rate

- After every domain/report change: run the quick command.
- After every local adapter change: run the quick command. Run
  `npm run verify:ai-faq-routes` after a fresh `npm run build` creates `out`.
- After every build-wiring change: run the quick command and
  `node --test scripts/measure-build-pipeline.test.mjs`.
- After Waves 1 and 3: run the local non-build command.
- After Wave 2: run the local non-build command and `npm run build`.
- Before production evidence: run a fresh Node.js 20 build and local full
  command from the accepted commit.
- Production crawl: one complete pass after two exact-SHA production workflows
  succeed; rerun the complete pass after any transient failure.
- Maximum focused feedback latency: 10 seconds.
- Maximum local full-suite target: 120 seconds before the static build.

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat | Test type | Automated command | Exists | Status |
|---|---|---|---|---|---|---|---|---|
| 32-01-01 | 01 | 1 | PARITY-02 | T-32-01, T-32-05 | TDD unit | `node --test scripts/verify-ai-faq-routes.test.mjs` | No - W0 | pending |
| 32-01-02 | 01 | 1 | PARITY-02, DELIVERY-02 | T-32-05, T-32-06 | TDD formatter/CLI | `node --test scripts/verify-ai-faq-routes.test.mjs` | No - W0 | pending |
| 32-02-01 | 02 | 2 | PARITY-02 | T-32-01, T-32-04 | TDD filesystem integration | `node --test scripts/verify-ai-faq-routes.test.mjs` | No - W0 | pending |
| 32-02-02 | 02 | 2 | PARITY-02 | T-32-01 | stage-order integration | `node --test scripts/measure-build-pipeline.test.mjs && npm run build` | Partial | pending |
| 32-03-01 | 03 | 3 | DELIVERY-02 | T-32-02, T-32-03, T-32-05 | TDD fake-network integration | `node --test scripts/verify-ai-faq-routes.test.mjs` | No - W0 | pending |
| 32-03-02 | 03 | 3 | DELIVERY-02 | T-32-01, T-32-06 | CLI contract plus stale fixture | `node --test scripts/verify-ai-faq-routes.test.mjs` | No - W0 | pending |
| 32-04-01 | 04 | 4 | DELIVERY-02 | T-32-01, T-32-07 | live negative baseline | `npm run verify:ai-faq-routes -- https://sealos.io` | Command exists, coverage incomplete | pending |
| 32-04-02 | 04 | 4 | DELIVERY-02 | T-32-07, T-32-08 | GitHub evidence gate | `gh api repos/labring/sealos.io/actions/workflows/deploy.yml && gh api repos/labring/sealos.io/actions/workflows/deploy-cloudflare.yml` | Yes | pending |
| 32-04-03 | 04 | 4 | PARITY-02, DELIVERY-02 | T-32-01, T-32-07 | full production acceptance | `npm run verify:ai-faq-routes -- https://sealos.io` | Command exists, coverage incomplete | pending |

## Requirement Coverage

| Requirement | Automated proof | Production proof | Coverage |
|---|---|---|---|
| PARITY-02 | Fixture matrix plus complete local `out` gate asserts exact source/index/sitemap/route equality at 2,000 | Final remote report repeats all four counts and zero set findings | complete |
| DELIVERY-02 | Fake network proves all page-index routes, bounded concurrency/timeouts, exact identities, and deterministic diagnostics | Same-SHA Vercel/Cloudflare URLs plus 2,000 direct HTTP 200 pages and zero findings | complete |

## Threat Coverage

| ID | Threat | Automated control | Release control |
|---|---|---|---|
| T-32-01 | stale count-valid index | bidirectional four-set and identity fixtures | current stale production fails, accepted production passes |
| T-32-02 | unbounded or hanging remote crawl | active-worker and timeout tests | summary records concurrency 8 and timeout 10,000 ms |
| T-32-03 | redirect masks a stale route | manual redirect fixture | direct 200 histogram contains 2,000 |
| T-32-04 | local file descriptor exhaustion | injected filesystem observes batch maximum 32 | Node.js 20 build completes |
| T-32-05 | nondeterministic completion order | reversed/delayed fixture yields byte-identical report | summary retains numeric ordered diagnostics |
| T-32-06 | diagnostic control characters or truncation | JSON-escaped values and 21-finding cap test | retained totals and first 20 details |
| T-32-07 | deployment evidence belongs to another commit | exact 40-character SHA assertions | both run `head_sha` values equal fresh `upstream/main` |
| T-32-08 | disabled workflow is accepted | workflow-state fixture/readback | Vercel state and successful URL are blocking conditions |

## Nyquist Audit

### Fast feedback availability

Every implementation task has a focused command that can fail before a build
or production crawl. The new route test file is Wave 0 infrastructure and is
created in Plan 32-01 before domain behavior.

### Requirement traceability

Both requirements map to task-level automated commands. PARITY-02 gains local
full-inventory proof in Wave 2. DELIVERY-02 gains deterministic remote behavior
proof in Wave 3 and live exact-SHA proof in Wave 4.

### Real-boundary coverage

- Filesystem fixtures exercise unreadable files, duplicate route directories,
  local sitemap/index parsing, and every identity field.
- Fake fetch exercises completion order, timeouts, failures, statuses,
  redirects, body reuse, and the concurrency cap.
- The accepted `out` tree exercises the complete 2,000-page static boundary.
- The final production command exercises the complete 2,000-page HTTP boundary.

### Manual-only justification

Workflow activation and an approved PR-to-main merge are repository operations
at the release boundary. Plan 32-04 exposes one blocking human-action
checkpoint. Every fact after that action is checked automatically through the
GitHub API and the route verifier.

## Wave 0 Requirements

| Artifact | Purpose | Owner plan |
|---|---|---|
| `scripts/verify-ai-faq-routes.test.mjs` | focused domain, filesystem, network, CLI, and report tests | 32-01 |
| exported verifier runner/helpers | injected test boundary and guarded CLI | 32-01 |

## Validation Gates

### Gate A - deterministic domain

- Every four-set category is exercised.
- Reversed inputs and delayed completion yield identical output.
- Totals include all findings and details cap at 20.

### Gate B - local static output

- `npm run build` finishes through route parity on Node.js 20.
- Source, local index, local sitemap, and readable local routes each total and
  uniquely contain 2,000 slugs.
- All 2,000 files have exact title, H1, description, and canonical.
- Ambiguous normalized and unknown numbered routes remain unresolved.

### Gate C - remote mechanics

- Exactly eight workers are available and observed concurrency never exceeds 8.
- Every request uses a 10-second abort signal and manual redirect handling.
- All 2,000 page-index routes are attempted once.
- Network, timeout, status, set, and identity diagnostics remain grouped and
  deterministic.

### Gate D - release evidence

- Fresh `upstream/main` resolves to one 40-character SHA.
- Vercel and Cloudflare production workflows are active and each provide a
  successful completed run URL with that exact `head_sha`.
- The remote command reports four totals and unique counts of 2,000, an HTTP
  200 count of 2,000, and zero findings in every category.
- Summary and later verification record command, target, UTC, SHA, run URLs,
  counts, status histogram, and mismatch totals.

## Nyquist Verdict

**PASS (planned):** every task has an executable automated command, Wave 0 is
explicit, feedback remains bounded, both requirements have local and live
proof, clean checkouts create `out` before the real local command, and the
single external action is isolated behind a blocking release
checkpoint.
