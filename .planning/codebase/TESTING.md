# Testing

## Current State

**No test framework is configured.** No test files (`*.test.*`, `*.spec.*`, `__tests__/`) exist in the codebase.

## Available Verification

- **Type checking**: `npm run lint` → `tsc --noEmit`
- **Build verification**: `npm run build` (static export catches most issues)
- **Prettier**: Code formatting validation
- **zhlint**: Chinese text formatting checks

## CI/CD Validation

The GitHub Actions workflows (`.github/workflows/`) validate through successful builds:
- `deploy-cloudflare.yml` — Production deployment (builds before deploying)
- `preview-cloudflare.yml` — Preview deployment for PRs
- `deploy.yml` / `preview.yml` — Alternative deployment targets
- `build-image.yml` — Docker image build

Build failure = deployment failure = implicit quality gate.

## Recommendations for Testing

If tests were to be added:
- **Unit tests**: Component logic, utility functions, content schema validation
- **Integration tests**: Content collection loading, i18n routing
- **E2E tests**: Critical user flows (blog navigation, docs search, deploy modal)
- **Visual regression**: Homepage sections, comparison pages
