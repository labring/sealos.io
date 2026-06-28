---
phase: 16
slug: tutorial-template-baseline-and-expansion-map
status: approved
nyquist_compliant: true
wave_0_complete: true
created: 2026-06-29
---

# Phase 16 — Validation Strategy

Per-phase validation contract for source-backed planning execution.

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | GSD source assertions and Node.js validator scripts |
| **Config file** | `.planning/REQUIREMENTS.md`, `.planning/ROADMAP.md`, `.planning/phases/16-tutorial-template-baseline-and-expansion-map/16-CONTEXT.md` |
| **Quick run command** | `node $HOME/.codex/gsd-core/bin/gsd-tools.cjs query phase-plan-index 16` |
| **Full suite command** | `node $HOME/.codex/gsd-core/bin/gsd-tools.cjs query check.decision-coverage-plan .planning/phases/16-tutorial-template-baseline-and-expansion-map .planning/phases/16-tutorial-template-baseline-and-expansion-map/16-CONTEXT.md` |
| **Estimated runtime** | ~5 seconds |

## Sampling Rate

- **After every task commit:** Run the source assertions named in the task's
  `<verify>` block.
- **After every plan wave:** Run Phase 16 requirements coverage and decision
  coverage checks.
- **Before `$gsd-verify-work`:** Confirm all four Phase 16 deliverable files
  exist and contain the exact slug, term, and ownership tables named by the
  plans.
- **Max feedback latency:** 30 seconds.

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 16-01-01 | 01 | 1 | BASE-01 | T-16-01 / T-16-02 | Template evidence excludes secrets and uses source file paths | source assertion | `test -f .planning/phases/16-tutorial-template-baseline-and-expansion-map/16-TUTORIAL-TEMPLATE-BASELINE.md` | pending | pending |
| 16-01-02 | 01 | 1 | BASE-02 | T-16-01 | Expansion map uses locked slugs and local image folders | source assertion | `rg -n "deploy-react-sealos|nodejs-production-deployment-sealos" .planning/phases/16-tutorial-template-baseline-and-expansion-map/16-TUTORIAL-EXPANSION-MAP.md` | pending | pending |
| 16-02-01 | 02 | 2 | BASE-03 | T-16-02 | Copy checklist preserves Sealos terms and avoids direct secret examples | source assertion | `rg -n "Runtime Truth Pass|DEPLOY|UPDATE|\\.sealos/state\\.json" .planning/phases/16-tutorial-template-baseline-and-expansion-map/16-FRAMEWORK-COPY-CHECKLIST.md` | pending | pending |
| 16-02-02 | 02 | 2 | BASE-02, BASE-03 | T-16-03 | Validator plan keeps unpublished and published slug expectations explicit | source assertion | `rg -n "expected|deploy-nodejs-sealos|/sealos-skills" .planning/phases/16-tutorial-template-baseline-and-expansion-map/16-VALIDATOR-EXPANSION-PLAN.md` | pending | pending |

## Wave 0 Requirements

Existing infrastructure covers Phase 16 planning validation:

- `gsd-tools.cjs query frontmatter.validate`
- `gsd-tools.cjs query verify.plan-structure`
- `gsd-tools.cjs query phase-plan-index`
- `gsd-tools.cjs query check.decision-coverage-plan`
- `rg`

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Template baseline captures the real tutorial contract | BASE-01 | The baseline is a planning document that compares prose, metadata, links, and image conventions | Read the baseline against the three Next.js tutorial files and confirm it names frontmatter keys, body sections, CTA pattern, related links, image convention, and validation checks |
| Copy checklist preserves framework truth | BASE-03 | React and Node.js language choices are editorial and architectural | Confirm the checklist distinguishes React frontend/static concerns from Node.js service/runtime concerns and keeps Sealos workflow terms intact |

## Validation Sign-Off

- [x] All tasks have automated verify commands or source assertions.
- [x] Sampling continuity covers every task.
- [x] Wave 0 uses existing GSD and source-search infrastructure.
- [x] No watch-mode flags are required.
- [x] Feedback latency is under 30 seconds.
- [x] `nyquist_compliant: true` is set in frontmatter.

**Approval:** approved 2026-06-29
