---
phase: 13-product-truth-safe-example-contract-and-page-outline
plan: "03"
subsystem: docs-object-storage
tags: [page-outline, writing-guardrails, screenshot-posture, navigation-contract]
dependency_graph:
  requires:
    - 13-object-storage-audit.md (screenshot classifications, section inventory, route posture)
    - 13-CONTEXT.md (implementation decisions D-01 through D-10)
  provides:
    - 13-page-outline-spec.md (heading blueprint, writing guardrails, screenshot rules for Phase 14)
  affects:
    - content/docs/guides/object-storage/index.en.mdx (Phase 14 target)
tech_stack:
  added: []
  patterns: [fumadocs-fd-steps, callout-info, callout-tip, single-leaf-page]
key_files:
  created:
    - .planning/phases/13-product-truth-safe-example-contract-and-page-outline/13-page-outline-spec.md
  modified: []
decisions:
  - "Locked heading order: What Object Storage Is -> Create a Bucket -> Get Your Credentials -> Upload Your First File -> Verify Your Upload -> What's Next"
  - "Credential retrieval placed before file upload to establish full access model context, even though console upload does not require manual credential entry"
  - "4 Chinese screenshots reused with English alt text; 5 screenshots omitted (1 decorative, 1 reference-only, 3 deferred)"
  - "Recommended small test file (plain text or small image) for first upload example"
  - "No Tabs/Tab components in v1.3 (console-UI-first, no SDK code)"
metrics:
  duration: 115s
  completed: "2026-04-16"
---

# Phase 13 Plan 03: Page Outline Specification Summary

English Object Storage page outline locked with 6 heading sections, console-UI-first MDX component choices, 4 reusable screenshots with alt text rules, and single-leaf-page navigation contract for v1.3.

## Completed Tasks

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Write English page outline specification and writing guardrails | 6ba19c0 | 13-page-outline-spec.md |

## What Was Done

Task 1 created the page outline specification (253 lines) that locks:

- **Canonical page role:** Single leaf page at `index.en.mdx`, no router, no child pages
- **Heading order:** 6 sections following a console-first flow from product framing to first upload to scope boundary
- **Frontmatter contract:** English title, ~20-word description mentioning S3-compatible and first upload, English keywords
- **MDX components:** `fd-steps` for Create a Bucket and Upload Your First File; `Callout type="info"` for permissions; `Callout type="tip"` for endpoint explanation; no Tabs/Tab
- **Screenshot posture:** 4 first-upload-path screenshots reused with English alt text; 5 screenshots omitted; alt text rules require mentioning Chinese console UI
- **Writing guardrails:** Action-oriented second person, short paragraphs, content boundaries excluding SDK/static hosting/monitoring/CLI, product-truth rules separating stable facts from unstable UI labels
- **Navigation exclusions:** No child entries in `meta.en.json`, no new MDX files, exactly one leaf page

## Deviations from Plan

None -- plan executed exactly as written.

## Known Stubs

None -- this is a planning artifact with no runtime code.

## Self-Check: PASSED

- [x] `13-page-outline-spec.md` exists (253 lines, above 80-line minimum)
- [x] Contains `## Canonical page role` with "single canonical English Object Storage leaf page"
- [x] Contains `## Heading-level outline` with all 6 section headings
- [x] Contains `## Frontmatter contract` with "Object Storage" title
- [x] Contains `## MDX component usage` with "fd-steps"
- [x] Contains `## Screenshot posture` with 4 reuse + 5 omit entries
- [x] Contains `## Writing guardrails` with product-truth rules
- [x] Contains `## Navigation exclusions` with "meta.en.json"
- [x] Commit 6ba19c0 exists
