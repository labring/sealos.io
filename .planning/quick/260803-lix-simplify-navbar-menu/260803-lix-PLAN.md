---
quick_id: 260803-lix
status: complete
created: 2026-08-03
---

# Quick Task 260803-lix: Simplify the Navbar Menu

## Goal

Make the shared Navbar expose only Templates, Docs, Resources, Pricing, and Contact. Templates links to the existing App Store route while the current analytics, authentication, localization, and mobile menu behavior remains intact.

## Tasks

1. Update the shared navigation data in `new-components/Header.tsx`.
   - Remove the Products dropdown and its DevBox, App Store, and Databases children.
   - Add a top-level Templates link at the former Products position with `/products/app-store` as its route.
   - Remove the Solutions dropdown and all of its children.
   - Remove imports used only by the removed menu entries while preserving Resources and all shared Header behavior.
   - Verify desktop and mobile render the same navigation data and localized links resolve with the current language prefix.

2. Update `new-components/header.test.mts`.
   - Assert Templates is a top-level navigation entry.
   - Assert Products, Solutions, and their removed children are absent from the navigation data.
   - Change the historical dropdown width count from three panels to the single Resources panel.
   - Preserve assertions for Resources children, CTA, GitHub, auth, analytics, locale handling, mobile overlay, and scroll locking.

3. Run focused validation and record the quick task.
   - Run Header and Rybbit tests, the App Store source-contract suites, Prettier, `git diff --check`, and TypeScript checking.
   - Use Browser Harness at 1440x1000 and 390x844 to verify menu order, Templates navigation, Resources dropdown, mobile menu contents, localized links, and zero horizontal overflow.
   - Write the completion summary and update `.planning/STATE.md` with the quick-task commit.

## Acceptance Criteria

- Desktop and mobile Navbar labels are exactly Templates, Docs, Resources, Pricing, and Contact.
- Templates points to `/products/app-store` in English and `/zh-cn/products/app-store` in Chinese.
- Products, Solutions, DevBox, Databases, Education, Gaming, and Information Technology are absent from the Navbar.
- Resources still renders Learn, Tutorials, Blog, and Community in its two-column panel.
- Existing CTA, GitHub, auth, GTM, Rybbit, scroll, and mobile overlay contracts remain unchanged.
- Focused tests and formatting pass; TypeScript reports the repository's existing TS5097 baseline only.
