# Technology Stack

**Analysis Date:** 2026-06-11

## Languages

**Primary:**
- TypeScript 5.8.3 - Application code, React components, Next.js route handlers, Fumadocs content configuration, and shared utilities in `app/`, `components/`, `new-components/`, `hooks/`, `lib/`, `config/`, `types/`, `source.config.ts`, and `mdx-components.tsx`.
- TSX / React 18.3.1 - UI pages, layouts, components, analytics loaders, auth forms, and product experiences in `app/`, `components/`, and `new-components/`.
- MDX / Markdown - Documentation and blog content loaded by Fumadocs from `content/docs/` and `content/blog/` via `source.config.ts`.
- JSON - Generated and static data for app listings and AI quick references in `content/ai-quick-reference/` and generated app API assets managed by `scripts/generate-apps-api.js`.

**Secondary:**
- JavaScript / Node.js - Build and maintenance scripts in `scripts/generate-apps-api.js`, `scripts/normalize-root-locale.js`, `scripts/replace-image-paths.sh`, and configuration files including `next.config.mjs`, `postcss.config.js`, and `prettier.config.js`.
- Shell - Static-export image path rewriting and URL audit utilities in `scripts/replace-image-paths.sh` and `scripts/url-index-audit.sh`.
- CSS / Tailwind utility classes - Styling is authored primarily through Tailwind classes in TSX files and processed through `postcss.config.js` with `@tailwindcss/postcss`.

## Runtime

**Environment:**
- Node.js 20 - Required by `.nvmrc` and GitHub Actions setup in `.github/workflows/deploy.yml`, `.github/workflows/preview.yml`, `.github/workflows/deploy-cloudflare.yml`, and `.github/workflows/preview-cloudflare.yml`.
- Docker builder runtime: `node:20-bookworm-slim` in `Dockerfile`.
- Docker serving runtime: `nginx:1.27-alpine` in `Dockerfile` serves the static export from `/usr/share/nginx/html`.

**Package Manager:**
- npm - `package-lock.json` is present and CI uses `npm install` or `npm ci` in `.github/workflows/deploy.yml`, `.github/workflows/preview.yml`, `.github/workflows/deploy-cloudflare.yml`, `.github/workflows/preview-cloudflare.yml`, and `Dockerfile`.
- Lockfile: present at `package-lock.json`.

## Frameworks

**Core:**
- Next.js 14.2.28 - App Router, static export, route handlers, image handling, rewrites, and MDX integration configured in `next.config.mjs`; routes live under `app/`.
- React 18.3.1 - Client and server components across `app/`, `components/`, and `new-components/`.
- Fumadocs Core/UI/MDX 15.2.x / 11.5.8 - Documentation source loading, MDX compilation, docs UI, and search support configured in `source.config.ts`, `lib/source.ts`, and `app/api/search/route.ts`.
- Tailwind CSS 4.1.3 - Utility-class styling with PostCSS configured in `postcss.config.js`; class merging via `tailwind-merge` in `lib/utils.ts`.
- Radix UI - Accessible primitives for accordion, dialog, dropdown, navigation menu, popover, select, switch, tooltip, and related controls used through UI components in `components/ui/` and feature code in `new-components/`.

**Testing:**
- Node.js script tests - `scripts/generate-apps-api.test.mjs` imports `scripts/generate-apps-api.js` directly and validates template conversion logic.
- TypeScript compiler check - `npm run lint` runs `rm -f tsconfig.tsbuildinfo && tsc --noEmit` from `package.json`.
- Dedicated test runner: Not detected in `package.json`; no Jest/Vitest/Playwright config file is present.

**Build/Dev:**
- Next.js CLI - `npm run dev`, `npm run build`, `npm run build:analyze`, and `npm run start` are defined in `package.json`.
- Fumadocs MDX generator - `postinstall` runs `fumadocs-mdx` from `package.json` to prepare content sources.
- `scripts/generate-apps-api.js` - Fetches Sealos template catalog data and produces local app listing assets before every build via `npm run generate-apps`.
- `scripts/normalize-root-locale.js` - Runs after `next build` in `package.json` to normalize root locale output.
- `scripts/replace-image-paths.sh` - Runs during Docker builds to replace relative image paths with CDN URLs before `npm run build` in `Dockerfile`.
- `@next/bundle-analyzer` 15.4.1 - Loaded dynamically when `ANALYZE=true` in `next.config.mjs` and invoked through `npm run build:analyze`.

## Key Dependencies

**Critical:**
- `next` 14.2.28 - Application framework and static export engine configured in `next.config.mjs`.
- `react` / `react-dom` 18.3.1 - UI runtime for all TSX components under `app/`, `components/`, and `new-components/`.
- `fumadocs-core` / `fumadocs-ui` 15.2.8 and `fumadocs-mdx` 11.5.8 - Documentation system configured in `source.config.ts` and consumed by `lib/source.ts` and docs routes under `app/[lang]/docs/`.
- `@marsidev/react-turnstile` 1.3.1 - Cloudflare Turnstile widget used by `app/[lang]/abuse/components/abuse-form.tsx` and `new-components/AuthForm/AuthFormContext.tsx`.
- `zod` 3.24.2 - Schema validation for Fumadocs content in `source.config.ts` and email validation in `new-components/AuthForm/AuthFormContext.tsx`.
- `sharp` 0.33.5 and `canvas` 3.1.0 - Open Graph image rendering pipeline in `app/api/og/route.ts` and `lib/og-canvas.ts`; Docker installs native build dependencies for these packages in `Dockerfile`.
- `@orama/tokenizers` 3.1.11 - Mandarin tokenizer for Fumadocs search in `app/api/search/route.ts`.

**Infrastructure:**
- `@next/mdx`, `@mdx-js/loader`, and `@mdx-js/react` - MDX rendering path integrated by `next.config.mjs` and `source.config.ts`.
- `remark`, `remark-gfm`, `remark-html`, `mermaid`, and custom `lib/remark/remark-mermaid.ts` - Markdown/MDX processing and diagram support.
- `feed` - RSS generation used by route handlers under `app/rss.xml/route.ts`.
- `satori` and `sharp` - Dynamic image and OG generation support.
- `lucide-react`, `@radix-ui/*`, `class-variance-authority`, `clsx`, and `tailwind-merge` - Component primitives and class composition used by UI modules.
- `motion`, `matter-js`, `three`, `react-countup`, `@number-flow/react`, `react-intersection-observer`, `react-responsive`, and `react-player` - Interactive marketing/product page behavior and media presentation.
- `js-yaml` - Template YAML parsing in `scripts/generate-apps-api.js`.

## Configuration

**Environment:**
- Public runtime/build variables are read through `process.env.NEXT_PUBLIC_APP_URL`, `process.env.NEXT_PUBLIC_OPEN_SOURCE_URL`, and `process.env.NEXT_PUBLIC_DEFAULT_LOCALE` in `config/site.ts`, `lib/i18n.ts`, `next.config.mjs`, `Dockerfile`, and GitHub workflows.
- Analytics configuration reads `process.env.NEXT_PUBLIC_GTM_ID` in `config/analytics.ts`; English defaults to GTM container `GTM-5DTRN2V3`.
- Turnstile verification requires `TURNSTILE_SECRET_KEY` in `app/api/abuse/verify-turnstile/route.ts`.
- SEO verification reads `GOOGLE_SITE_VERIFICATION` in `lib/utils/metadata.ts`.
- Build flags include `ANALYZE=true` for bundle analyzer in `next.config.mjs`, `DOCKER_BUILD=true` for Fumadocs image handling in `source.config.ts`, and `ROOT_DEFAULT_LOCALE` for `scripts/normalize-root-locale.js`.
- `.env.example` exists and is treated as environment documentation; secret-bearing `.env` files are not read.

**Build:**
- `package.json` defines `dev`, `build`, `build:analyze`, `start`, `lint`, `postinstall`, `generate-apps`, and `generate-apps:clean`.
- `next.config.mjs` enables Fumadocs MDX, static export in production, trailing slashes, strict mode, package import optimization, unoptimized images, allowed remote image hosts, and development rewrites.
- `source.config.ts` defines Fumadocs collections for `content/docs`, `content/blog`, and `content/ai-quick-reference`.
- `tsconfig.json` uses strict TypeScript, bundler module resolution, `@/*` path alias, `jsx: preserve`, and Next plugin integration.
- `postcss.config.js` uses `@tailwindcss/postcss`.
- `prettier.config.js` uses 2 spaces, single quotes, semicolons, trailing commas, `printWidth: 80`, and `prettier-plugin-tailwindcss`.
- `vercel.json` contains Vercel cache headers and permanent redirects.
- `Dockerfile` builds a static export with Node 20 and serves it with Nginx.

## Platform Requirements

**Development:**
- Use Node.js 20 from `.nvmrc`.
- Use npm with `package-lock.json`; install native build toolchain when building `canvas` or `sharp` outside prebuilt-compatible environments.
- Run `npm run generate-apps` before builds or use `npm run build`, which runs it automatically.
- Use `npm run lint` for TypeScript validation.

**Production:**
- Static export output is generated by `next build` with `output: 'export'` in production in `next.config.mjs`.
- Vercel deployment is configured through `.github/workflows/deploy.yml`, `.github/workflows/preview.yml`, and `vercel.json`.
- Cloudflare Pages deployment publishes `./out` through `.github/workflows/deploy-cloudflare.yml` and `.github/workflows/preview-cloudflare.yml`.
- Docker image deployment builds through `.github/workflows/build-image.yml`, publishes to GitHub Container Registry, and updates Kubernetes deployment `sealos-docs` with `kubectl`.
- Docker production runtime serves static files from Nginx as defined in `Dockerfile`.

---

*Stack analysis: 2026-06-11*
