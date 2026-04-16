# Phase 13: Product Truth, Safe Example Contract, and Page Outline - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-16
**Phase:** 13-product-truth-safe-example-contract-and-page-outline
**Areas discussed:** Upload example strategy, Screenshot handling, Credential display strategy, Permission level guidance

---

## Upload Example Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Console UI upload (Recommended) | Match first-success path: click Upload button, shortest path, no code. SDK deferred | ✓ |
| Console UI + simple CLI | UI upload primary, plus a minimal cURL/s3cmd command as developer alternative | |
| SDK upload primary | Code examples for first upload, console UI only for verification | |

**User's choice:** Console UI upload
**Notes:** Consistent with zero-to-one first-success philosophy — shortest path with no code requirement.

---

## Screenshot Handling

| Option | Description | Selected |
|--------|-------------|----------|
| Claude's Discretion (Recommended) | Planning/execution phases decide per screenshot: reuse with English alt text, or omit decorative ones | ✓ |
| Omit all | English page uses no screenshots, pure text guidance | |
| Reuse Chinese screenshots | Reference existing .zh-cn.png files with English alt text | |

**User's choice:** Claude's Discretion
**Notes:** 9 Chinese screenshots inventoried. Decision deferred to audit/execution based on actual need.

---

## Credential Display Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Console-guided (Recommended) | Direct users to click "Access Key" button in console. No placeholder values in page. Matches UI-first path | ✓ |
| Environment variable pattern | Like AI Proxy: export env vars first, then use in commands. Better for SDK/CLI path | |
| Placeholder direct display | Write your-access-key / your-endpoint placeholders in page | |

**User's choice:** Console-guided
**Notes:** Differs from AI Proxy v1.2 because Object Storage milestone is console-UI-first.

---

## Permission Level Guidance

| Option | Description | Selected |
|--------|-------------|----------|
| private (Recommended) | Safest default. First success = file appears in console file list. No public URL needed | ✓ |
| publicRead | Upload then verify via public URL — more visual proof but grants unnecessary public access | |
| Explain all three | Page explains all levels, recommends private, mentions publicRead for static hosting | |

**User's choice:** private
**Notes:** First-success verification simplified to console file list check.

---

## Claude's Discretion

- Page outline section order and pacing
- Which Chinese screenshots to reuse/omit/flag
- File type and size recommendation for first upload
- Whether to mention SDK/static hosting as "next steps"

## Deferred Ideas

None — discussion stayed within phase scope.
