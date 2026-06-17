---
status: complete
quick_id: 260617-kt3
completed: 2026-06-17
---

# Quick Task 260617-kt3 Summary

## Completed

- Added `npm ci` before `npm run app-store:refresh` in the GHCR Docker image
  workflow.
- Enabled npm caching on the workflow Node 20 setup step.
- Updated deployment parity source expectations, fixture data, and docs so the
  GHCR/Kubernetes path records `npm ci` before refresh.
- Added a static route test that guards the AI quick reference detail page's
  `generateStaticParams()` contract.

## Verification

- `gh run view 27592338749 --repo labring/sealos.io --log-failed`
- `npm run build` with Node 20.20.0
- `node --test scripts/check-deployment-parity.test.mjs scripts/check-static-export-routes.test.mjs`
- `npm run deployment:check`
- `npm run static-routes:check`
- `npm run app-store:diff`
- `npm run docker:smoke`
- `git diff --check`

## Notes

Local Docker was unavailable (`docker: command not found`), so the Docker smoke
command ran its default guarded path. The Node 20 build completed successfully
and generated 6037 static pages, including the AI quick reference detail route
that failed in the latest GHCR run.
