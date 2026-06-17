---
status: complete
quick_id: 260617-kgc
completed: 2026-06-17
---

# Quick Task 260617-kgc Summary

## Completed

- Added `npm run app-store:refresh` before Vercel production and preview
  builds.
- Added `npm run app-store:refresh` between `npm ci` and `npm run build` in
  Cloudflare Pages production and preview builds.
- Added Node 20 setup and `npm run app-store:refresh` before the GHCR Docker
  Buildx handoff so refreshed generated assets are included in the Docker build
  context.
- Updated deployment parity source checks, tests, and documentation to require
  and describe refresh-before-build behavior.

## Verification

- `node --test scripts/check-deployment-parity.test.mjs`
- `npm run deployment:check`
- `npm run app-store:diff`
- `git diff --check`

## Generated Assets

`npm run app-store:diff` reported 150 apps, 150 template source keys, and 0
changed generated paths.
