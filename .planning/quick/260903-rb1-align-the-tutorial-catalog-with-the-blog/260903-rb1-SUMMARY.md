---
status: complete
---

# Quick Task 260903-rb1: Align the Tutorial Catalog with the Blog

## Completed

- Added `ContentIndexHeader` and refactored Blog to consume the shared title,
  description, and action layout.
- Reworked `/tutorials/` around the Blog page shell and `PageTopRays`.
- Reduced the hero to a centered Django Core entry, simplified the three-stage
  cards, and moved status counts into the matrix heading.
- Replaced nested framework cards with a flat bordered matrix that stacks by
  framework on mobile.
- Kept matrix request links, GTM request events, Django detail routing, and
  structured data intact.

## Verification

- `node scripts/validate-tutorials.test.mjs` — 5 passed.
- `pnpm lint` — passed.
- `pnpm build` — passed, including AI FAQ index and route verification.
- Browser preview at 1440px and 390px — HTTP 200, no horizontal overflow; the
  Django entry, stage cards, matrix statuses, and Contact link rendered.

## Notes

The production build emitted existing Next export rewrite warnings, a stale
Browserslist notice, and native macOS sharp/canvas duplicate-symbol warnings.
They did not affect the successful build or route verification.
