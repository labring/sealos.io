---
quick_id: 260803-npm
status: complete
completed: 2026-08-03
---

# Quick Task 260803-npm: Rename Footer App Store and Add Skills

## Outcome

Both active Footer Products columns now render `Skills` above `Templates`.
Skills links to `/sealos-skills`, Templates keeps `/products/app-store`, and
both English and Chinese translations use the requested labels. DevBox and
Databases remain absent from both Footer data sources.

## Verification

- Footer and Header source-contract tests passed: 7 tests.
- App Store list/detail source-contract tests passed: 13 tests.
- `npm run lint` passed with no diagnostics.
- Prettier and `git diff --check` passed.
- Browser Harness verified English and Chinese new Footer output and English
  and Chinese legacy Footer output at desktop dimensions. Products links were
  ordered Skills then Templates, all routes resolved, and horizontal overflow
  remained zero.

Screenshots:

- `evidence/desktop-footer-products.png`
- `evidence/mobile-footer-products.png`

## Commit

- `4bc4a09 fix(260803-npm): label footer products as Skills and Templates`
