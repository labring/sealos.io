---
phase: 31
slug: canonical-index-generation-and-local-parity
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-08-03
---

# Phase 31 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node.js 20 built-in `node:test` and `node:assert/strict` |
| **Config file** | none; focused tests run directly through package scripts |
| **Quick run command** | `npm run test:ai-faq-index` |
| **Full suite command** | `npm run test:ai-faq-index && npm run test:ai-faq-slugs && npm run verify:ai-faq-index && node --test scripts/measure-build-pipeline.test.mjs && npm run lint` |
| **Estimated runtime** | ~90 seconds before static builds |

The phase acceptance gate additionally runs `npm run build` and
`npm run build:analyze` on the repository-pinned Node.js 20 runtime. Local
Node.js 24 runs provide fast feedback only; hosted CI supplies the required
Node.js 20 evidence.

---

## Sampling Rate

- **After every task commit:** Run `npm run test:ai-faq-index`.
- **After every shared-loader change:** Run
  `npm run test:ai-faq-index && npm run test:ai-faq-slugs`.
- **After every build-wiring change:** Run
  `npm run test:ai-faq-index && node --test scripts/measure-build-pipeline.test.mjs`.
- **After every plan wave:** Run the full suite command.
- **Before `$gsd-verify-work`:** Run the full suite, verify a clean read-only
  parity diff, then run both static build commands on Node.js 20.
- **Max feedback latency:** 90 seconds for the non-build suite.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 31-01-01 | 01 | 1 | SOURCE-01, SOURCE-02, PARITY-01 | T-31-01, T-31-03 | Reject malformed, non-regular, and invalid source entries while bounding reads | TDD unit + fixture integration | `npm run test:ai-faq-index` | No - W0 | pending |
| 31-01-02 | 01 | 1 | SOURCE-01, PARITY-01 | T-31-03 | Render values safely and preserve deterministic complete finding totals | TDD unit + CLI contract | `npm run test:ai-faq-index` | No - W0 | pending |
| 31-02-01 | 02 | 2 | SOURCE-01, SOURCE-02 | T-31-02 | Publish through one exclusive same-directory temporary file and preserve the destination on failure | TDD integration + corpus smoke | `npm run test:ai-faq-index && npm run verify:ai-faq-index` | No - W0 | pending |
| 31-03-01 | 03 | 3 | PARITY-01, DELIVERY-01 | T-31-01, T-31-03 | Keep verification read-only and fail before Next.js starts | integration + stage order | `npm run test:ai-faq-index && node --test scripts/measure-build-pipeline.test.mjs` | Partial - timing test exists | pending |
| 31-03-02 | 03 | 3 | SOURCE-02, DELIVERY-01 | - | Prove the committed 2,000-record asset is canonical and both build entry points inherit parity | corpus + build | `npm run verify:ai-faq-index && npm run build && npm run build:analyze` | No - W0 | pending |

Threat references for planning:

- **T-31-01:** Unexpected source entry, malformed identifier, symlink, or
  invalid JSON/schema reaches the generated public asset.
- **T-31-02:** Temporary-path collision, partial write, or failed rename
  damages the existing committed asset or leaves owned residue.
- **T-31-03:** Unbounded reads or unsafe diagnostic rendering cause resource
  exhaustion or ambiguous multi-line operator output.

Status values: pending, green, red, or flaky.

---

## Wave 0 Requirements

- [ ] `scripts/ai-faq-index.test.mjs` - failing tests for exact projection,
  numeric identity/order, bounded source validation, both-direction parity,
  stable diagnostics, canonical bytes, atomic failure cleanup, CLI status, and
  the complete 2,000-record read-only smoke.
- [ ] `scripts/ai-faq-index.mjs` - minimal exported seams required for the
  first failing projection, validation, serialization, and comparison tests.
- [ ] Package commands `generate:ai-faq-index`, `verify:ai-faq-index`, and
  `test:ai-faq-index` - stable commands used by tasks and phase verification.
- [ ] Node.js 20 execution evidence - hosted CI runs the focused suite and both
  build commands on the repository-pinned runtime.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Vercel uses the package build command and prints the FAQ parity stage before Next.js | DELIVERY-01 | A dashboard Build Command override is external to the repository | Inspect one Vercel build log; verify `npm run verify:ai-faq-index` completes before `next build`. Route any override through `npm run build`. |
| Node.js 20 compatibility evidence exists | SOURCE-01, PARITY-01, DELIVERY-01 | The local shell exposes Node.js 24 and Docker is unavailable | Run the focused suite, parity command, `npm run build`, and `npm run build:analyze` in the Node.js 20 CI job and retain the successful job URL. |

All source/index semantics, byte stability, diagnostics, mutation safety, and
repository-owned build ordering have automated verification.

---

## Validation Sign-Off

- [ ] All tasks have an automated verify command or an explicit Wave 0
  dependency.
- [ ] Sampling continuity has no three consecutive tasks without automated
  verification.
- [ ] Wave 0 covers every missing test and command reference.
- [ ] Commands contain no watch-mode flags.
- [ ] Non-build feedback latency remains below 90 seconds.
- [ ] The focused suite and both build commands pass on Node.js 20.
- [ ] `nyquist_compliant: true` is set after Wave 0 and all task mappings are
  confirmed against the final plans.

**Approval:** pending plan-checker verification
