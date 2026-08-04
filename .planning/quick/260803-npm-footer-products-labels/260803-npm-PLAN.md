---
quick_id: 260803-npm
status: complete
created: 2026-08-03
---

# Quick Task 260803-npm: Rename Footer App Store and Add Skills

## Goal

Update both active Footer Products columns to show Skills first and Templates
second, preserving the existing `/sealos-skills` and App Store routes.

## Tasks

1. Replace the single App Store Footer item with ordered Skills and Templates
   items in `new-components/Footer/index.tsx` and `components/footer/index.tsx`.
   Use `Skills`, `Templates`, `/sealos-skills`, and `/products/app-store` for
   both English and Chinese Footer labels and URLs.
2. Update the Footer source-contract test to assert exact order, labels, and
   routes for both implementations.
3. Run focused tests, formatting, TypeScript validation, Browser Harness
   checks for English and Chinese Footer output, then record the GSD summary.

## Acceptance Criteria

- Each Footer Products column renders Skills above Templates.
- Skills links to `/sealos-skills` and Templates links to `/products/app-store`.
- DevBox and Databases remain absent from both Footer implementations.
- Existing Navbar, Footer categories, CTAs, social links, and route behavior
  remain intact.
