---
quick_id: 260731-ogr
status: complete
created: 2026-07-31
---

# Quick Task 260731-ogr: Restore the shared navbar to the pre-846a308 visual design

## Goal

Make the pre-846a308 / `031de3f` navbar visual the default presentation of
`new-components/Header.tsx` across every current consumer while retaining the
current navigation data, localization, authentication flow, analytics
contracts, and mobile full-screen menu.

## Tasks

1. Restore the historical shared Header visual around the current behavior.
   - Files: `new-components/Header.tsx`, `new-components/header.test.mts`
   - Action: Use `git show 846a308^:new-components/Header.tsx` (the same Header
     blob as `031de3f`) as the visual source of truth. Put `container pt-8`
     inside the shared component and restore the full-width rounded pill,
     `bg-white/5`, `inset-shadow-bubble`, `backdrop-blur-lg`, `px-6 py-3`,
     32px logo, and `useScroll` / `useMotionValueEvent` logotype collapse.
     Restore the historical desktop navigation trigger, GitHub action, and
     primary CTA styling while retaining the current `18.3k` count, current CTA
     copy, GTM handlers, Rybbit properties, and auth redirect. Restore each
     dropdown to the historical 40rem, rounded-xl, neutral-950,
     inset-shadow-bubble, two-column presentation, then render
     `children.map(...)` so Products, all four Resources entries including
     Tutorials, and all Solutions entries remain visible. Keep `HeaderProps`
     exactly `{ lang?: languagesType }`, preserve current locale URL
     resolution, and keep the current mobile overlay markup, entries, counts,
     CTA copy, analytics, submenu state, and close behavior. Add a focused
     source-contract test for the restored visual tokens, scroll animation,
     complete child rendering, current menu content, single-prop API, and
     analytics identifiers.
   - Verify: Run
     `node --test new-components/header.test.mts tests/rybbit-cta.test.ts`.
   - Done: Every `Header` consumer receives the restored pill design by
     default; Resources renders Learn, Tutorials, Blog, and Community in the
     two-column panel; locale, auth, GTM, Rybbit, GitHub count, CTA copy, and
     mobile-menu contracts pass their automated assertions.

2. Make the shared Header the single owner of navbar top spacing.
   - Files: `app/[lang]/(home)/layout.tsx`,
     `app/[lang]/contact/page.tsx`,
     `app/[lang]/products/app-store/page.tsx`,
     `app/[lang]/products/app-store/[slug]/page.tsx`,
     `app/[lang]/products/app-store/app-store-page.test.mts`,
     `app/[lang]/products/app-store/[slug]/app-store-detail-page.test.mts`
   - Action: Keep each route-level Header wrapper sticky at `top-0 z-50 w-full`
     and let the Header-owned `container pt-8` provide the inset. Remove
     `max-lg:-mb-8` from the home and contact wrappers, remove
     `pt-4 sm:pt-8 lg:pt-0` from the App Store listing wrapper, remove
     `pt-4 sm:pt-8` from the detail wrapper, and remove the detail main
     container's `-mt-24`. Update both App Store source-contract tests to
     assert centralized Header spacing while preserving their existing
     min-height, footer, SEO, loading, error, and detail-section coverage.
   - Verify: Run
     `node --test 'app/[lang]/products/app-store/app-store-page.test.mts' 'app/[lang]/products/app-store/[slug]/app-store-detail-page.test.mts'`.
   - Done: Homepage, contact, App Store listing, and App Store detail render one
     consistent Header inset with content beginning below the restored navbar,
     and both App Store regression suites pass with the centralized-spacing
     contract.

3. Validate the navbar across themes, locales, interactions, and viewports.
   - Files: `new-components/Header.tsx`, `new-components/header.test.mts`,
     `app/[lang]/(home)/layout.tsx`, `app/[lang]/contact/page.tsx`,
     `app/[lang]/products/app-store/page.tsx`,
     `app/[lang]/products/app-store/[slug]/page.tsx`,
     `app/[lang]/products/app-store/app-store-page.test.mts`,
     `app/[lang]/products/app-store/[slug]/app-store-detail-page.test.mts`
   - Action: Format the changed files, run the focused Node suites and the
     repository TypeScript check, then start the development server and use
     Browser Harness against desktop `1440x1000` and mobile `390x844`.
     Inspect `/`, `/contact`, `/products/app-store`,
     `/products/app-store/n8n`, and their relevant `zh-cn` navigation paths,
     plus `/customers` as the representative light-route regression. At
     desktop width, open every dropdown and confirm the Resources panel shows
     all four children in two columns; scroll away from the top and back to
     confirm the Sealos wordmark collapses and expands while the logo and pill
     remain stable. At mobile width, open the full-screen menu, expand each
     submenu, and confirm its current content and actions remain usable. Check
     internal locale-prefixed links, the external Community link, CTA Rybbit
     data attributes, the `button_click` GTM payload, unauthenticated auth-modal
     opening, and
     `document.documentElement.scrollWidth === document.documentElement.clientWidth`
     with menus open. Capture screenshots after each meaningful state change.
   - Verify: Run
     `npm exec prettier -- --check new-components/Header.tsx new-components/header.test.mts 'app/[lang]/(home)/layout.tsx' 'app/[lang]/contact/page.tsx' 'app/[lang]/products/app-store/page.tsx' 'app/[lang]/products/app-store/[slug]/page.tsx' 'app/[lang]/products/app-store/app-store-page.test.mts' 'app/[lang]/products/app-store/[slug]/app-store-detail-page.test.mts'`,
     `node --test new-components/header.test.mts tests/rybbit-cta.test.ts 'app/[lang]/products/app-store/app-store-page.test.mts' 'app/[lang]/products/app-store/[slug]/app-store-detail-page.test.mts'`,
     `npm run lint`, and `git diff --check`. Treat the recorded TS5097
     diagnostic in `tests/rybbit-cta.test.ts` as the TypeScript baseline; every
     additional diagnostic fails this task.
   - Done: Automated checks introduce zero diagnostics beyond the recorded
     TS5097 baseline, desktop and mobile screenshots show the restored navbar
     without overlap or horizontal overflow on the representative routes,
     dropdown, scroll, locale, CTA analytics, auth, and mobile-menu checks all
     pass.
