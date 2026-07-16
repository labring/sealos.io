---
phase: 28
slug: catalog-publication-and-cleanup
status: approved
nyquist_compliant: true
wave_0_complete: true
created: 2026-07-17
---

# Phase 28 - Validation Strategy

## Test Infrastructure

| Property | Value |
| --- | --- |
| **Framework** | Node.js 20 `node:test`, production CLI, static export, HTTP, browser |
| **Config file** | None; repository scripts and `package.json` own commands |
| **Quick run command** | `node --test scripts/validate-tutorials.test.mjs` |
| **Full suite command** | `node --test scripts/validate-tutorials.test.mjs && npm run validate-tutorials && npm run lint` |
| **Estimated runtime** | Quick under 5 seconds; build and HTTP closeout under 10 minutes |

## Sampling Rate

- **After every TDD gate commit:** Run the focused Node test.
- **After every GREEN:** Run the public validator and TypeScript lint.
- **After catalog promotion:** Run the focused test, validator, and development
  index smoke.
- **After production build:** Run static-output, static-route, 31-path HTTP, and
  browser checks.
- **Before verification:** Re-run the complete suite, cleanup, evidence checksum,
  and Phase 27 immutability checks.
- **Max quick feedback latency:** 10 seconds.

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 28-01-01 | 01 | 1 | TDD-04, PUB-02, SHOT-03 | TDD RED | `node --test scripts/validate-tutorials.test.mjs` exits 1 for expected missing 15-page behavior | pending |
| 28-01-02 | 01 | 1 | PUB-02, SHOT-03 | TDD GREEN | `node --test scripts/validate-tutorials.test.mjs && npm run validate-tutorials` | pending |
| 28-02-01 | 02 | 2 | TDD-04, PUB-01 | TDD RED | Focused catalog invalid-input tests fail before validator/catalog changes | pending |
| 28-02-02 | 02 | 2 | PUB-01, PUB-02 | TDD GREEN | Focused tests, validator, and `npm run lint` pass | pending |
| 28-03-01 | 03 | 3 | PUB-03, SHOT-03 | integration | Build plus exact 31-path HTTP matrix | pending |
| 28-03-02 | 03 | 3 | PUB-01 | browser | Desktop/mobile catalog assertions and visual inspection | pending |
| 28-03-03 | 03 | 3 | OPS-02 | cleanup/evidence | Global cleanup, checksum, read-only equality | pending |

## Wave 0 Requirements

Existing Node test infrastructure covers the phase. Plan 28-01 creates the
focused CLI test file through its required RED gate.

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
| --- | --- | --- | --- |
| Catalog visual quality | PUB-01 | Composition and reading hierarchy require visual judgment | Inspect 1440x900 and 390x844 temporary screenshots at original detail |

## Validation Sign-Off

- All tasks have automated verification or an explicit browser visual review.
- Sampling continuity has no three-task gap.
- No watch mode is used.
- TDD RED and GREEN commits are independently observable.
- Phase 27 evidence remains immutable.
- `nyquist_compliant: true` is set.

**Approval:** approved 2026-07-17
