---
phase: 27
slug: practice-backed-tutorial-series
status: ready
nyquist_compliant: true
wave_0_complete: true
created: 2026-07-17
---

# Phase 27 - Validation Strategy

> Per-task feedback and final acceptance contract for the six practice-backed
> Python tutorial pages, 24 evidence cards, retained evidence, and cleanup.

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Primary framework** | Node.js built-in `node:test` |
| **Focused test file** | `scripts/python-tutorial-assets.test.mjs` |
| **Draft/final CLI** | `scripts/python-tutorial-assets.mjs` |
| **Real collaborators** | Public Git/GitHub, `uv`, real PostgreSQL, authenticated Sealos/Kubernetes, public HTTPS, `agent-browser`, `cwebp`, FFmpeg/ffprobe, Tesseract, `view_image` |
| **Quick run command** | `node --test scripts/python-tutorial-assets.test.mjs` |
| **Full deterministic command** | `node --test scripts/python-tutorial-assets.test.mjs && node scripts/python-tutorial-assets.mjs --check-bundle ... && npm run lint` |
| **Live gates** | Framework-owned practice checks plus `/Users/longnv/bin/repo/sealos-django-tutorial/scripts/test-production.sh --assert-clean-all` |
| **Estimated quick runtime** | Below 60 seconds after fixtures exist |
| **Human-only checks** | 0; the agent performs every visual check with `view_image` and browser assertions |

## Sampling Rate

- **After 27-01 RED:** replay the focused import test and retain the exact
  post-fixture `ERR_MODULE_NOT_FOUND` output.
- **After every source commit:** run the unchanged Node suite and exact commit
  scope/subject check.
- **After every live attempt:** write a terminal cleanup record and run an
  independent exact-name/label readback before retrying or accepting.
- **After each framework practice plan:** validate eight staging files, 12
  screenshot specs, credential scan, target immutability, and zero residue.
- **After FastAPI MDX:** require the exact one-issue intermediate report for the
  three missing Django drafts plus `assets_pending=24`; after Django MDX require
  `drafts_valid=6`, `drafts_pending=0`, `assets_pending=24`, and zero issues.
- **After each image task:** run per-image machine/semantic checks and
  `view_image`; after the second task run all six desktop/mobile previews.
- **Before phase verification:** run final bundle, checksums, source inventory,
  isolated TDD replay, immutable-boundary, cleanup, and TypeScript gates.
- **Maximum deterministic feedback latency:** 60 seconds. Live Sealos steps
  use their explicit 240/300-second operation bounds and clean on timeout.

## Requirement Coverage

| Requirement | Primary plans | Proof surface |
|-------------|---------------|---------------|
| CONT-01 | 27-02, 27-04, 27-06 | Three FastAPI stages, MDX sources, protected tags, final claim audit |
| CONT-02 | 27-03, 27-04, 27-06 | Three Django stages, MDX sources, protected tags, final claim audit |
| CONT-03 | 27-01, 27-04, 27-06 | Frontmatter, series links/order, current terminology, CTA, boundary gate |
| CONT-04 | 27-01, 27-02, 27-03, 27-04, 27-06 | Shared timing formula, symmetric titles, observed durations |
| SHOT-01 | 27-01, 27-02, 27-03, 27-05, 27-06 | Exact 24 contract, real observations, final provenance ledger |
| SHOT-02 | 27-01, 27-05, 27-06 | WebP metadata/pixels/bytes, redaction, visual and adjacent-step review |
| OPS-01 | 27-01, 27-02, 27-03, 27-06 | Real Sealos/PostgreSQL/browser practice, replayable evidence, exact cleanup |

## Decision Coverage Hotspots

| Decision | Owning plans | Explicit proof |
|----------|--------------|----------------|
| D-08 | 27-01, 27-02, 27-03, 27-04, 27-06 | Every reader command resolves to protected source or a minimally parameterized reviewed practice command, with argument-array and metacharacter tests. |
| D-13 | 27-01, 27-02, 27-03, 27-05, 27-06 | Every screenshot is a presentation layer joined to source and real evidence IDs; unsupported pixels, tokens, or browser captures fail the bundle. |
| D-23 | 27-01, 27-02, 27-03, 27-05, 27-06 | Credentials, workspace identity, private endpoints, cookies, CSRF, and Secret values remain in owned scratch; source, OCR, and retained-evidence scans prove exclusion. |

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirements | Threat refs | Test type | Automated command or assertion | Status |
|---------|------|------|--------------|-------------|-----------|--------------------------------|--------|
| 27-01-01 | 01 | 1 | CONT-03, CONT-04, SHOT-01, SHOT-02, OPS-01 | T-27-01..04 | TDD RED | Focused `node --test --test-name-pattern` exits 1 after fixture setup with `ERR_MODULE_NOT_FOUND`; RED commit has one file | pending |
| 27-01-02 | 01 | 1 | CONT-03, CONT-04, SHOT-01, SHOT-02, OPS-01 | T-27-01..04 | TDD GREEN | `node --test scripts/python-tutorial-assets.test.mjs`; exact exports, issue codes, CLI exits, direct RED parent, one-file GREEN scope | pending |
| 27-02-01 | 02 | 2 | CONT-01, CONT-03, CONT-04, SHOT-01, OPS-01 | T-27-05..09 | live integration | FastAPI Stage 1 lock/12 tests/local HTTP plus accepted D-21 timing, public domain/browser schema, named-session close | pending |
| 27-02-02 | 02 | 2 | CONT-01, CONT-04, SHOT-01, OPS-01 | T-27-05..09 | live integration | Real PostgreSQL migration/readiness/restart plus production rollout/domain/log/rollback events and 12 unique spec joins | pending |
| 27-02-03 | 02 | 2 | SHOT-02, OPS-01 | T-27-06, T-27-08..09 | security/cleanup | Eight-file credential scan, one terminal per run, framework-scoped exact run counts zero | pending |
| 27-03-01 | 03 | 2 | CONT-02, CONT-03, CONT-04, SHOT-01, OPS-01 | T-27-10..14 | live integration | Django Stage 1 lock/migration/5 tests/local HTTP plus accepted timing, host rewrite, board/admin/browser schema | pending |
| 27-03-02 | 03 | 2 | CONT-02, CONT-04, SHOT-01, OPS-01 | T-27-10..14 | live integration | Real PostgreSQL Jobs/readiness/process A-B/admin plus production Gunicorn/WhiteNoise/rollback events and 12 joins | pending |
| 27-03-03 | 03 | 2 | SHOT-02, OPS-01 | T-27-11, T-27-13..14 | security/cleanup | Eight-file credential scan, terminal per run, framework-scoped exact run/credential counts zero | pending |
| 27-04-01 | 04 | 3 | CONT-01, CONT-03, CONT-04, SHOT-01 | T-27-15..19 | content contract | `--check-drafts`; three FastAPI paths, full schema/links/CTA/source/claims, shared title, 12 refs, exact commit | pending |
| 27-04-02 | 04 | 3 | CONT-02, CONT-03, CONT-04, SHOT-01 | T-27-15..19 | content contract | `--check-drafts`; three Django paths, full schema/links/CTA/source/claims, title parity, 12 refs, exact commit | pending |
| 27-05-01 | 05 | 4 | CONT-01, SHOT-01, SHOT-02 | T-27-20..24 | machine + visual | 12 FastAPI `validateEvidenceCard` results, unique digests, `view_image` 12/12, closed sessions, image-only commit | pending |
| 27-05-02 | 05 | 4 | CONT-02, CONT-03, SHOT-01, SHOT-02 | T-27-20..24 | machine + visual + browser | 12 Django asset checks, `view_image` 12/12, six pages at 1440x900 and 390x844, no overflow/overlap, full bundle | pending |
| 27-06-01 | 06 | 5 | CONT-01..04, OPS-01 | T-27-25..29 | provenance | Six source IDs, two accepted timings/title parity, all claim selectors/events, command and credential scan | pending |
| 27-06-02 | 06 | 5 | SHOT-01, SHOT-02, OPS-01 | T-27-26..28 | provenance + cleanup | 24 unique final screenshot rows/digests, 24 visual + 12 responsive reviews, all attempts + final zero cleanup | pending |
| 27-06-03 | 06 | 5 | all Phase 27 | T-27-25..29 | final integration | Nine sorted checksums, read-only bundle, exact 32 paths/six subjects, isolated TDD replay, boundary/target immutability, lint | pending |

## TDD Gate Evidence

| Gate | Required evidence | Failure behavior |
|------|-------------------|------------------|
| RED | Fixture-ready assertion completes; focused test exits 1 with exact absent coordinator module; commit touches only test | Stop when import fails before fixture setup, passes unexpectedly, or changes another file |
| GREEN | Same test file passes without modification; direct child commit touches only implementation | Stop on any test edit, extra dependency/script, skipped case, or non-direct ancestry |
| Review | Complete suite, stable issue-code/CLI behavior, Phase 28 boundary hashes | Create a refactor commit only when reviewed code changes and all tests remain green |

Real collaborators remain real at their meaningful seams. Coordinator fixtures
exercise filesystem, YAML, named-browser capture, `cwebp` encoding, FFmpeg
metadata/pixel decoding, Tesseract OCR, hashing, and Git boundaries. Live
practice uses public Git, real PostgreSQL, authenticated
Sealos/Kubernetes, public HTTPS, and real browser sessions. Tests do not mock
database, Sealos, Kubernetes, HTTP, browser, or image behavior.

## Machine Asset Gates

Each of 24 files must satisfy all rows:

| Gate | Exact acceptance |
|------|------------------|
| Contract | Page and filename equal one `SCREENSHOT_CONTRACT` row; directory has exact four-file allowlist |
| Signature | First 12 bytes identify RIFF/WEBP and decoder succeeds |
| Dimensions | Exactly 1440x900 at DPR-independent output |
| Size | `< 200000` bytes; target `<= 150000` where text remains readable |
| Pixels | Nonblank variance and expected dark/accent pixels; no transparent empty canvas |
| Metadata | Variable metadata absent |
| Semantics | Required visible tokens equal joined reviewed evidence; forbidden tokens absent |
| Provenance | Source tag/artifact/record, evidence IDs, capture session/hash, redactions, adjacent step, digest all present |
| Reference | Exactly one MDX reference with descriptive alt/caption immediately beside its proving step |

## Visual And Responsive Gates

- Use `view_image` with original detail for every final WebP.
- Inspect typography, hierarchy, wrapping, evidence truth, browser/terminal
  framing, contrast, and redaction; regenerate any weak result.
- Open every draft page in named `agent-browser` sessions at 1440x900 and
  390x844.
- Record final URL, title, language, body selector, four loaded images,
  captions, `scrollWidth <= innerWidth`, and zero incoherent overlap.
- Close every session, stop the owned development server, and remove review
  captures after results enter `review.txt`.

## Evidence And Cleanup Gates

The retained directory has exactly ten files. `checksums.txt` is generated
last and contains exactly nine LC_ALL=C-sorted relative entries for:

1. `README.md`
2. `source-identities.jsonl`
3. `timing.jsonl`
4. `commands.txt`
5. `claims.jsonl`
6. `practice-events.jsonl`
7. `screenshots.jsonl`
8. `cleanup.jsonl`
9. `review.txt`

Every accepted and rejected run has a unique ID and one terminal cleanup row.
The final audit covers Instance, App, Deployment, StatefulSet, ReplicaSet, Pod, Service,
Ingress, Job, PostgreSQL cluster, PVC, Secret, ConfigMap, temporary image,
process, port-forward, local server/port, browser session, clone, `.sealos`,
state, log, credential, render/image scratch, registry config, and ownership
ledger. The final inherited `--assert-clean-all` command is read-only.

## Phase 28 Boundary

Require byte equality from `phase27_base` for:

- `app/[lang]/(home)/tutorials/tutorial-growth-data.ts`
- `app/[lang]/(home)/tutorials/page.tsx`
- `scripts/validate-tutorials.mjs`
- `source.config.ts`
- `lib/source.ts`
- `lib/utils/tutorial-utils.ts`
- `lib/utils/tutorial-metadata.ts`
- `app/[lang]/(home)/tutorials/[slug]/page.tsx`
- `app/[lang]/(home)/tutorials/[slug]/layout.tsx`
- production build/static publication scripts and metadata surfaces

The Phase 27 coordinator must pass. The current production validator must fail
only because the six draft directories exceed its nine-page contract. Phase 28
owns catalog availability, index metadata/copy/keywords, 15-page validation,
production build, route/image HTTP checks, and milestone-wide cleanup.

## Wave 0 Requirements

Existing infrastructure covers Wave 0: Node's built-in test runner, existing
`js-yaml`, `agent-browser`, `cwebp`, FFmpeg/ffprobe, Tesseract, `view_image`,
`uv`, `jq`, `kubectl`, real PostgreSQL, and protected reference harnesses are
already available. Plan 27-01 creates the single new test file through the
required RED commit. Repository image libraries, ImageMagick, Playwright, new
dependencies, and new package scripts remain outside the contract.

## Validation Sign-Off

- [x] Every one of 15 tasks has an automated gate.
- [x] No three consecutive tasks lack deterministic feedback.
- [x] Every Phase 27 requirement maps to at least one task and final proof.
- [x] TDD RED/GREEN commit order and exact failure cause are explicit.
- [x] Machine, visual, desktop, mobile, real-collaborator, credential, and cleanup gates are explicit.
- [x] Human-only checks are zero.
- [x] Phase 28 ownership remains fail-closed and testable.
- [x] `nyquist_compliant: true` is set.

**Approval:** ready for plan checker
