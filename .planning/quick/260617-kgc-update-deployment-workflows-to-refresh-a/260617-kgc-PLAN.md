---
quick_id: 260617-kgc
status: planned
created: 2026-06-17
---

# Quick Task 260617-kgc: Update deployment workflows to refresh App Store templates before build

## Goal

Ensure deployment-related GitHub Actions refresh App Store template data before
running their build step.

## Tasks

1. Update deployment workflow build paths.
   - Files: `.github/workflows/deploy.yml`, `.github/workflows/preview.yml`,
     `.github/workflows/deploy-cloudflare.yml`,
     `.github/workflows/preview-cloudflare.yml`,
     `.github/workflows/build-image.yml`
   - Action: Add `npm run app-store:refresh` before each build path. For the
     Docker image workflow, refresh the checkout before handing the workspace to
     Docker Buildx.
   - Verify: Review workflow diffs and run deployment source checks.

2. Update deployment parity checks and evidence.
   - Files: `scripts/check-deployment-parity.js`,
     `scripts/check-deployment-parity.test.mjs`,
     `docs/deployment-parity.md`
   - Action: Require and document the refresh-before-build deployment behavior.
   - Verify: Run `node --test scripts/check-deployment-parity.test.mjs` and
     `npm run deployment:check`.

3. Confirm generated App Store assets stay unchanged by this source-only update.
   - Files: `config/apps.json`, `config/template-sources.json`,
     `public/images/apps`
   - Action: Run the generated asset diff guard.
   - Verify: Run `npm run app-store:diff`.
