---
quick_id: 260803-lix
status: complete
completed: 2026-08-03
---

# Quick Task 260803-lix: Simplify the Navbar Menu

## Outcome

The shared Header now exposes the top-level navigation sequence `Templates`,
`Docs`, `Resources`, `Pricing`, and `Contact`. Templates uses the existing App
Store route and inherits the locale prefix through the shared link builder.
The Products and Solutions menu trees are removed from the Navbar while their
underlying routes remain available. Resources keeps Learn, Tutorials, Blog,
and Community in the historical dropdown panel.

## Implementation

- Updated `new-components/Header.tsx` with the simplified shared navigation
  data and removed imports used only by the retired menu entries.
- Updated `new-components/header.test.mts` for the new top-level sequence,
  the single Resources dropdown width, removed labels, and Templates routing.
- Preserved CTA, GitHub, authentication, GTM, Rybbit, locale, and mobile menu
  contracts.

## Verification

- `npm exec prettier -- --check new-components/Header.tsx new-components/header.test.mts` passed.
- `node --test new-components/header.test.mts tests/rybbit-cta.test.ts` passed: 9 tests.
- App Store list/detail source-contract suites passed: 13 tests.
- `git diff --check` passed.
- `npm run lint` reports the repository baseline `TS5097` diagnostic in
  `tests/rybbit-cta.test.ts:8`; no additional diagnostics appeared.
- Browser Harness desktop `1440x1000` verified the required order, Templates
  navigation to `/products/app-store/`, the single Resources panel at 640px,
  and zero horizontal overflow.
- Browser Harness mobile `390x844` verified the menu overlay, body and HTML
  scroll locking, direct Templates link, Resources expansion, and zero
  horizontal overflow.
- Browser Harness Chinese route verified Templates resolves to
  `/zh-cn/products/app-store/` with the required labels and zero overflow.

Screenshots:

- `evidence/desktop-resources.png`
- `evidence/mobile-menu-resources.png`

## Commit

- `2e9dbf0 fix(260803-lix): simplify navbar navigation`
