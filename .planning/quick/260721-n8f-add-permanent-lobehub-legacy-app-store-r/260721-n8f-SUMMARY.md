---
status: complete
quick_id: 260721-n8f
completed: 2026-07-21
---

# Quick Task 260721-n8f Summary

## Completed

- Added permanent Vercel redirects for the `lobe-chat` and `lobe-chat-db`
  app-store paths, covering requests with and without a trailing slash.
- Added matching Cloudflare Pages redirects with HTTP 308 status codes.
- Pointed every legacy URL directly to the canonical
  `/products/app-store/lobehub/` path.

## Verification

- Exact-rule assertion verified all four Vercel and Cloudflare redirect pairs.
- `node --test scripts/check-static-output.test.mjs` passed 7 tests.
- `npm run static-output:check` passed all source configuration, redirect
  parity, and route policy checks. Static artifact inspection remains gated
  until an `out` directory is available.
- `git diff --check` passed.

## Commit

`ef5aad0` (`fix(app-store): redirect legacy LobeHub URLs`)
