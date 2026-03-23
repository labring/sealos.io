# Concerns

## Dual Component Systems

Two parallel component directories exist:
- `components/` — Original components (header, footer, feature, docs, mdx, ui)
- `new-components/` — Redesigned components (Header, Footer, AuthForm, DeployModal)

This creates ambiguity about which components to use and maintain. The `app/[lang]/layout.tsx` imports from `new-components/` while some pages may still reference `components/`.

## No Test Coverage

Zero test files exist. The only validation is TypeScript type checking and successful builds. No unit tests, integration tests, or E2E tests. Risk of regressions, especially with:
- ~2000 AI quick reference entries
- Complex i18n routing
- Client-side auth/deploy flows

## Large Content Volume

- **~2000 AI quick reference JSON files** in `content/ai-quick-reference/`
- Build times likely affected by processing all content files
- Each file must be individually maintained for accuracy

## Static Export Limitations

The site uses `output: 'export'` which means:
- No server-side rendering at request time
- No API routes at runtime (only build-time)
- No incremental static regeneration
- Full rebuild required for any content change
- Images are unoptimized (`images.unoptimized: true`)

## Hardcoded Configuration

Several values in `config/site.ts` are hardcoded:
- API endpoints (`usw-1.sealos.io`)
- Turnstile site key
- OAuth URLs
- Template API endpoints

These would need to change for different environments or regions.

## Chinese Locale Split

Chinese content is redirected to a separate domain (`sealos.run`) via `vercel.json`. This means:
- Two separate deployments for full i18n
- Content in `*.zh-cn.mdx` files may not render on the `sealos.io` domain
- Maintenance overhead for keeping both sites in sync

## Theme Forcing

The root layout forces light theme:
```typescript
theme={{ forcedTheme: 'light', defaultTheme: 'light', enabled: false }}
```
But the HTML element has `className="font-sans dark"`, and a recent commit (`9dca856`) mentions "use dark mode by default." This suggests an ongoing theme transition that may have inconsistencies.

## Build Script Dependencies

- `scripts/generate-apps-api.js` — Must run before build (`npm run generate-apps && next build`)
- `scripts/normalize-root-locale.js` — Post-build script for locale handling
- `scripts/replace-image-paths.sh` — Docker-only image path rewriting
- These create a fragile build pipeline if script ordering changes

## Security Considerations

- Turnstile keys are client-side (expected, but worth noting)
- `.env.example` exists but actual secrets management is unclear
- OAuth redirect URLs point to production Sealos instance
- No CSP headers beyond SVG image policy
