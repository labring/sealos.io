# Concerns

## Dual Component Systems

Two parallel component directories exist:
- `components/` — Original (header, footer, feature, docs, mdx, ui)
- `new-components/` — Redesigned (Header, Footer, AuthForm, DeployModal)

Root layout imports from `new-components/` but some pages may still reference `components/`.

## No Test Coverage

Zero test files. Only validation is TypeScript type checking and successful builds. Risk of regressions with ~2000 content entries, complex i18n routing, and client-side auth/deploy flows.

## Large Content Volume

~2000 AI quick reference JSON files in `content/ai-quick-reference/`. Build times affected by processing all content files.

## Static Export Limitations

`output: 'export'` means:
- No server-side rendering at request time
- No API routes at runtime (build-time only)
- No incremental static regeneration
- Full rebuild required for any content change
- Images are unoptimized (`images.unoptimized: true`)

## Hardcoded Configuration

Several values in `config/site.ts` are hardcoded: API endpoints (`usw-1.sealos.io`), Turnstile site key, OAuth URLs, template API endpoints. Would need changes for different environments.

## Chinese Locale Split

Chinese content redirects to separate domain (`sealos.run`) via `vercel.json`. Two separate deployments needed for full i18n. Content in `*.zh-cn.mdx` may not render on `sealos.io`.

## Theme Inconsistency

Root layout forces light theme but HTML has `className="font-sans dark"`. Recent commit mentions "use dark mode by default." Possible ongoing theme transition with inconsistencies.

## Build Script Dependencies

- `scripts/generate-apps-api.js` must run before build
- `scripts/normalize-root-locale.js` runs post-build
- `scripts/replace-image-paths.sh` Docker-only
- Fragile pipeline if ordering changes
