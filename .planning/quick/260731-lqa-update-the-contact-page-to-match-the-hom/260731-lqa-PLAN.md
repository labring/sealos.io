---
quick_id: 260731-lqa
status: planned
created: 2026-07-31
---

# Quick Task 260731-lqa: Align the contact page with the homepage theme

## Goal

Update `/contact` to use the current homepage visual system while preserving
its bilingual content, email action, social destinations, and responsive
behavior.

## Tasks

1. Replace the legacy contact-page shell with the homepage design system.
   - Files: `app/[lang]/contact/page.tsx`
   - Action: Reuse the current homepage header, footer, grid background, and
     top-ray components. Present the existing contact content in a restrained,
     asymmetric dark layout with clear email and community actions, complete
     focus, hover, and pressed states, and a mobile-safe social grid.
   - Verify: Confirm the existing English and Chinese copy, email address, and
     every configured social destination remain reachable.

2. Keep the dark theme active throughout the contact route lifecycle.
   - Files: `app/[lang]/utils/is-forced-dark-mode.ts`
   - Action: Add `/contact` to the exact-match forced-dark route set so client
     navigation retains the homepage palette.
   - Verify: Exercise `/contact` and `/zh-cn/contact` in a browser and confirm
     the root dark class remains active.

3. Validate implementation and responsive presentation.
   - Files: `app/[lang]/contact/page.tsx`,
     `app/[lang]/utils/is-forced-dark-mode.ts`
   - Action: Format the changed files, run TypeScript validation, and inspect
     desktop and mobile renders for layout, overflow, focus visibility, and
     working links.
   - Verify: Run Prettier, `npm run lint`, `git diff --check`, and browser
     screenshot checks at desktop and mobile widths.
