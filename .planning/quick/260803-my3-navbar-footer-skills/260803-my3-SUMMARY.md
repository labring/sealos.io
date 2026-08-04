---
quick_id: 260803-my3
status: complete
completed: 2026-08-03
---

# Quick Task 260803-my3: Add Skills and Trim Footer Products

## Outcome

The shared Navbar now exposes `Skills`, `Templates`, `Docs`, `Resources`,
`Pricing`, and `Contact` in that order. Skills uses `/sealos-skills` and the
existing Header locale builder produces `/zh-cn/sealos-skills` for Chinese
pages. Both active Footer implementations keep App Store as the only Products
entry while preserving all product routes and the remaining Footer categories.

## Implementation

- Added the Skills navigation item and updated Header ordering and routing
  source-contract assertions.
- Removed DevBox and Databases link data, translations, and URLs from
  `new-components/Footer/index.tsx` and `components/footer/index.tsx`.
- Added `new-components/footer.test.mts` to cover both Footer data sources.

## Verification

- Header and Footer source-contract tests passed: 7 tests.
- App Store list/detail source-contract tests passed: 13 tests.
- Prettier and `git diff --check` passed.
- `npm run lint` passed with no diagnostics.
- Browser Harness desktop `1440x1000` verified Skills before Templates,
  Skills navigation, Resources dropdown, App Store-only Products links, and
  zero horizontal overflow.
- Browser Harness mobile `390x844` verified the direct Skills link, menu
  scroll locking, absence of retired menu labels, and zero horizontal
  overflow.
- English and Chinese home routes plus the Chinese legacy legal Footer route
  verified localized Skills links and DevBox/Databases-free Footer output.
- The existing direct Node Rybbit test remains runtime-blocked by its
  extensionless TypeScript import; the repository source and TypeScript
  contracts remain unchanged by this task.

Screenshots:

- `evidence/desktop-navbar-skills.png`
- `evidence/mobile-navbar-skills.png`

## Commit

- `2b46fc8 feat(260803-my3): add Skills and trim footer products`
