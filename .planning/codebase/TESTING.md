# Testing

## Current State

**No test framework is configured.** No test files exist in the codebase.

## Available Verification

- **Type checking**: `npm run lint` -> `tsc --noEmit`
- **Build verification**: `npm run build` (static export catches most issues)
- **Prettier**: Code formatting validation
- **zhlint**: Chinese text formatting checks

## CI/CD Validation

GitHub Actions workflows validate through successful builds:
- `deploy-cloudflare.yml` — Production deployment
- `preview-cloudflare.yml` — Preview deployment for PRs
- `build-image.yml` — Docker image build

Build failure = deployment failure = implicit quality gate.
