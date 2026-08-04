---
phase: quick
plan: 260731-ogr
subsystem: ui
tags: [nextjs, react, navigation, responsive-design, localization, analytics]

requires:
  - phase: existing-sealos-site
    provides: Shared Header consumers, localized navigation data, authentication flow, and analytics contracts
provides:
  - Restored pre-846a308 rounded navbar pill across current shared Header consumers
  - Routed the legacy `components/header` entrypoint through the shared Header so light-theme routes use the same visual by default
  - Complete two-column desktop dropdowns with all current navigation children
  - Centralized Header-owned top spacing with route regression coverage
affects: [shared-header, home, contact, app-store, localization, analytics]

tech-stack:
  added: []
  patterns:
    - Shared Header owns its visual inset and route wrappers own only sticky positioning
    - Source-contract tests protect styling, navigation data, analytics, and mobile behavior together

key-files:
  created:
    - new-components/header.test.mts
  modified:
    - new-components/Header.tsx
    - components/header/index.tsx
    - components/header/dropdown-menu.tsx
    - app/[lang]/(home)/layout.tsx
    - app/[lang]/contact/page.tsx
    - app/[lang]/products/app-store/page.tsx
    - app/[lang]/products/app-store/[slug]/page.tsx
    - app/[lang]/products/app-store/app-store-page.test.mts
    - app/[lang]/products/app-store/[slug]/app-store-detail-page.test.mts

key-decisions:
  - "Keep HeaderProps limited to the optional lang property while restoring the historical visual shell around current behavior."
  - "Retain the detail hero -mt-24 after browser evidence confirmed that it extends the hero background beneath the navbar while visible content clears the pill."
  - "Treat tests/rybbit-cta.test.ts TS5097 as the recorded repository baseline and require zero additional TypeScript diagnostics."
  - "Keep the legacy Header compatibility entrypoint fixed around the shared Header and lock html/body scrolling while the mobile overlay is open."

patterns-established:
  - "Navbar spacing ownership: Header supplies container pt-8; route wrappers supply top-0 z-50 w-full."
  - "Navigation regression coverage: assert visual tokens together with locale, analytics, auth, dropdown, and mobile contracts."

requirements-completed: []

coverage:
  - id: D1
    description: Restored historical shared navbar pill while preserving current navigation, localization, auth, analytics, and mobile behavior
    verification:
      - kind: unit
        ref: "node --test new-components/header.test.mts tests/rybbit-cta.test.ts"
        status: pass
      - kind: automated_ui
        ref: "Browser Harness desktop 1440x1000 and mobile 390x844 navbar interaction matrix"
        status: pass
    human_judgment: false
  - id: D2
    description: Centralized navbar top spacing across home, contact, App Store listing, and App Store detail routes
    verification:
      - kind: unit
        ref: "App Store listing and detail source-contract suites"
        status: pass
      - kind: automated_ui
        ref: "Browser Harness route and overflow checks across English and zh-cn pages"
        status: pass
    human_judgment: false

duration: 41min
completed: 2026-07-31
status: complete
---

# Quick Task 260731-ogr: Shared Navbar Restoration Summary

**Pre-846a308 rounded navbar pill restored around the current localized navigation, auth, analytics, and full-screen mobile menu contracts**

## Performance

- **Duration:** 41 min
- **Started:** 2026-07-31T09:51:27Z
- **Completed:** 2026-07-31T10:32:34Z
- **Tasks:** 3
- **Files modified:** 10

## Accomplishments

- Restored the full-width translucent pill, inset shadow, blur, 32px logo, historical desktop controls, and scroll-driven Sealos logotype collapse in the shared Header.
- Rendered every current dropdown child in the historical 40rem two-column panel, including all four Resources entries.
- Centralized navbar top spacing in the shared Header and validated representative dark, light, English, and Chinese routes at desktop and mobile widths.
- Preserved the current GitHub count, CTA copy, GTM payloads, Rybbit attributes, auth redirect, localized links, external Community handling, and mobile overlay behavior.
- Unified legacy Header consumers on the shared implementation, retained fixed positioning for their route layouts, switched the GitHub mark to a theme-colored Lucide icon, and added html/body scroll locking for the mobile overlay.

## Task Commits

Each implementation task was committed atomically:

1. **Restore shared Header visual and protect behavior contracts** - `cf45c16` (feat)
2. **Centralize route navbar spacing and update regressions** - `9f7fac6` (fix)
3. **Unify legacy Header entrypoint and harden theme/mobile behavior** - `7c889c8` (fix)

The quick-task SUMMARY remains available for the root orchestrator's documentation commit.

## Files Created/Modified

- `new-components/Header.tsx` - Restored the historical pill presentation around the current Header behavior.
- `new-components/header.test.mts` - Added source-contract coverage for API shape, visuals, dropdown content, scroll behavior, locale, analytics, auth, and mobile contracts.
- `components/header/index.tsx` - Kept the legacy import path as a fixed-position compatibility wrapper around the shared Header.
- `components/header/dropdown-menu.tsx` - Removed the unused legacy dropdown implementation after all consumers moved to the shared Header.
- `app/[lang]/(home)/layout.tsx` - Removed route-owned responsive margin compensation.
- `app/[lang]/contact/page.tsx` - Removed route-owned responsive margin compensation.
- `app/[lang]/products/app-store/page.tsx` - Removed route-owned Header padding.
- `app/[lang]/products/app-store/[slug]/page.tsx` - Removed route-owned Header padding and retained verified hero background overlap.
- `app/[lang]/products/app-store/app-store-page.test.mts` - Locked the listing route to centralized Header spacing.
- `app/[lang]/products/app-store/[slug]/app-store-detail-page.test.mts` - Locked the detail route to centralized Header spacing.

## Decisions Made

- The shared Header owns `container pt-8`; route wrappers retain only sticky positioning and stacking.
- The current data and behavior surface remains authoritative while the pre-846a308 component supplies the visual source of truth.
- The detail page retains `-mt-24`: browser geometry placed the visible back link near 151px and the heading near 251px while the navbar occupied 32-96px, confirming clear content separation.
- Legacy route imports resolve through the shared Header compatibility wrapper so every page receives one default visual without appearance props.

## Verification

- Prettier check passed for all eight changed source and test files.
- Header and Rybbit suites passed: 9 tests.
- App Store listing suite passed: 7 tests.
- App Store detail suite passed: 6 tests.
- Focused total: 22 tests passed with 0 failures.
- `git diff --check ad94c447db50776c48c612740f7185c456e81b33..HEAD` passed.
- `npm run lint` produced the recorded `tests/rybbit-cta.test.ts:8:8` TS5097 baseline with zero additional diagnostics.
- Browser Harness validated `/`, `/contact/`, `/products/app-store/`, `/products/app-store/n8n/`, `/customers/`, and relevant `zh-cn` routes at 1440x1000 and 390x844.
- Desktop checks covered all dropdowns, the four-entry Resources grid, scroll collapse and expansion, stable logo and pill geometry, localized links, Community target safety, CTA analytics, and auth modal opening.
- Mobile checks covered overlay open and close, all submenus, GitHub count, CTA analytics, auth modal opening, and 390px-wide interaction usability.
- Every checked route and menu state reported equal document scroll and client widths.
- Screenshots are stored under `/Users/longnv/.codex/visualizations/2026/07/31/019fb716-1096-7820-8af7-bbf648378fda/navbar-ogr/`.
- Final compatibility hardening was additionally verified by source contracts and fresh Next.js HTTP 200 compilation for the customers route after clearing the generated cache.

## Deviations from Plan

### Execution Adjustment

**1. Retained the detail hero negative margin after layout validation**

- **Found during:** Task 3 browser validation
- **Planned action:** Remove the detail main container's `-mt-24`.
- **Evidence:** The margin extends the decorative hero background beneath the fixed-height Header area while the visible back link and heading remain below the navbar.
- **Final action:** Retained `-mt-24` under the parent executor's evidence-based constraint.
- **Verification:** Desktop and mobile screenshots, element geometry, and horizontal-overflow checks passed.

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Recovered the local verification build cache after disk exhaustion**

- **Found during:** Task 3 browser validation
- **Issue:** Partial Next.js output filled the available disk and produced a `PageNotFoundError` during route compilation.
- **Fix:** Stopped the local development server, removed the generated `.next` output, restarted from a clean build cache, completed route validation, and removed the regenerated `.next/cache` after shutdown.
- **Files modified:** Generated and ignored `.next` verification output only.
- **Verification:** All target routes compiled with HTTP 200 and completed the browser matrix.
- **Committed in:** Generated verification output excluded from source commits.

---

**Total deviations:** 2 execution adjustments (1 evidence-based layout decision, 1 blocking environment recovery)
**Impact on plan:** The restored shared navbar goal and every preserved behavior contract are fully covered.

## Issues Encountered

- Repository TypeScript validation retains the recorded TS5097 diagnostic in `tests/rybbit-cta.test.ts`; the task added zero diagnostics.
- The local Next.js cache temporarily exhausted disk space during browser validation; generated cache cleanup restored the verification environment.

## Known Stubs

None. The two existing empty `alt` values belong to decorative background images and do not flow empty data into rendered UI.

## User Setup Required

None. The change uses existing dependencies and configuration.

## Threat Surface

The changed files add no network endpoints, auth paths, file access patterns, schema changes, or new trust boundaries.

## Next Phase Readiness

- Shared Header consumers now receive the restored visual by default.
- Focused contracts and browser artifacts provide regression evidence for subsequent performance-audit work.

## Self-Check: PASSED

- All ten changed source and test files exist.
- Commits `cf45c16`, `9f7fac6`, and `7c889c8` exist on `worktree-agent-260731-ogr`.
- The canonical quick-task SUMMARY exists at the expected path with `status: complete`.

---
*Quick task: 260731-ogr*
*Completed: 2026-07-31*
