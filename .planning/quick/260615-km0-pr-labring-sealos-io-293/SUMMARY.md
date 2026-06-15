---
status: complete
quick_id: 260615-km0
title: Address PR #293 static export guard feedback
completed_at: 2026-06-15
---

# Summary

Addressed the latest PR #293 review feedback for static export route artifacts
and native static output inspection.

## Changed

- Updated the `/api/search` static export contract to use `out/api/search` as
  the primary artifact in `config/static-export-route-policy.json`.
- Updated the static export route policy documentation and search artifact
  fallback guard so `out/api/search` is checked first while existing alternate
  emitted shapes remain accepted.
- Updated the route-policy test fixture to write the reviewed `out/api/search`
  output path.
- Updated native artifact validation so an existing `out` directory without
  `out/generated/native-images` reports a caveat instead of a failure.
- Added focused test coverage for the reviewed native output shape.

## Review Feedback

- https://github.com/labring/sealos.io/pull/293#discussion_r3411389894
- https://github.com/labring/sealos.io/pull/293#discussion_r3411401177

## Verification

- `node --test scripts/check-static-export-routes.test.mjs scripts/check-static-output.test.mjs`
- `npm run static-routes:check`
- `npm run static-output:check`
- `npm run lint`
