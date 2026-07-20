---
status: resolved
trigger: "User reports one image missing at http://192.168.100.31:3000/tutorials/fastapi-postgresql-sealos/"
created: 2026-07-17
updated: 2026-07-17
---

# Debug Session: FastAPI PostgreSQL Image

## Symptoms

expected: All four evidence images render on the FastAPI PostgreSQL tutorial page.
actual: One image is missing on the page served from port 3000.
errors: Unknown; inspect browser image state and network responses.
timeline: Reported on 2026-07-17 after tutorial publication.
reproduction: Open the reported tutorial URL and inspect all rendered image elements.

## Current Focus

hypothesis: The unprefixed tutorial URL falls outside the scoped default-locale development rewrites and reaches the root not-found redirect.
test: Add `/tutorials` and `/tutorials/:path*` to the expected rewrite contract before changing the route manifest.
expecting: The default-locale route check fails until the tutorial routes are added to the shared manifest.
next_action: Archive the resolved debug session.
reasoning_checkpoint: The reported unprefixed URL now resolves directly to the tutorial and all four compiled image assets render successfully.
tdd_checkpoint: RED failed on the missing tutorial routes; GREEN passed after the shared manifest change.

## Evidence

- PID 15277 serves the current worktree from port 3000 with Next.js 14.2.28.
- The reported URL returns 307 with `Location: /en`; the locale-prefixed tutorial returns 200.
- All four compiled WebP requests return 200 and browser decode dimensions are 1440x900.
- `config/default-locale-routes.mjs` omits `/tutorials` from both exact routes and catch-all prefixes.
- RED: `npm run default-locale:check` fails because the manifest lacks `/tutorials` and `/tutorials/:path*`.
- GREEN: `npm run default-locale:check` passes after adding both tutorial route forms.
- The reported URL returns 200 with zero redirects after restarting the development server.
- A fresh browser HAR records four 200 `image/webp` responses for the compiled tutorial assets.
- Browser DOM verification confirms four complete images at 1440x900 natural size and 752x470 rendered size.
- `npm run lint` and `npm run validate-tutorials` pass; the tutorial validator checks 15 pages.

## Eliminated

- Asset corruption: each source WebP is a valid 1440x900 image with a stable file hash.
- Compiled asset loss: all four hashed `/_next/static/media/` responses return 200 `image/webp`.
- Browser decode failure: all four tutorial images complete with nonzero natural and rendered dimensions.

## Resolution

root_cause: The scoped default-locale development rewrite manifest omitted `/tutorials`, so the reported unprefixed URL reached the root not-found redirect and landed on `/en`.
fix: Added exact and catch-all tutorial routes to the shared rewrite manifest, with a focused route contract regression.
verification: The focused route check, TypeScript check, 15-page tutorial validator, direct HTTP request, fresh browser DOM assertions, and HAR image responses all pass.
files_changed: `config/default-locale-routes.mjs`, `scripts/check-default-locale-routes.mjs`
