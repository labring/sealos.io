# External Integrations

**Analysis Date:** 2026-06-11

## APIs & External Services

**Sealos Platform APIs:**
- Sealos template catalog - Fetches app-store/template catalog data for generated app listings.
  - SDK/Client: native `fetch` in `lib/api/apps-api.ts` and `scripts/generate-apps-api.js`
  - Endpoints: `https://template.os.sealos.io/api/listTemplate`, `https://template.usw-1.sealos.io/api/getTemplateSource`, and language-specific template domains configured in `config/site.ts`
  - Auth: None detected
- Sealos Desktop shared auth verification - Checks existing Sealos session cookies before opening the auth modal.
  - SDK/Client: native `fetch` in `lib/utils/shared-auth.ts`
  - Endpoint: `${siteConfig.desktopApiEndpoint}/api/auth/verifySharedToken`, defaulting to `https://usw-1.sealos.io/api/auth/verifySharedToken` from `config/site.ts`
  - Auth: Cross-origin cookies via `credentials: 'include'`
- Sealos email verification - Sends login email codes and receives auth tokens for website-to-Sealos OAuth redirect.
  - SDK/Client: native `fetch` in `new-components/AuthForm/AuthFormContext.tsx` and redirect handling in `new-components/AuthForm/AuthFormProvider.tsx`
  - Endpoints: `https://usw-1.sealos.io/api/auth/email/sms` and `https://usw-1.sealos.io/api/auth/email/verify` from `config/site.ts`
  - Auth: Cloudflare Turnstile token is sent as `cfToken` when enabled; email verification returns a token passed to `https://usw-1.sealos.io/oauth`
- Sealos OAuth entry points - Starts managed-cloud login and social login flows.
  - SDK/Client: URL redirects built in `hooks/use-auth-redirect.ts`, `new-components/AuthForm/AuthFormProvider.tsx`, and components under `new-components/`
  - Endpoints: `https://usw-1.sealos.io/oauth`, `https://usw-1.sealos.io/oauth?login=github`, and `https://usw-1.sealos.io/oauth?login=google` from `config/site.ts`
  - Auth: OAuth token query parameter after email verification; browser cookies for existing Sealos session

**Abuse Prevention:**
- Cloudflare Turnstile - Protects abuse report submissions and auth email-code requests.
  - SDK/Client: `@marsidev/react-turnstile` in `app/[lang]/abuse/components/abuse-form.tsx` and `new-components/AuthForm/AuthFormContext.tsx`
  - Verification endpoint: `https://challenges.cloudflare.com/turnstile/v0/siteverify` in `app/api/abuse/verify-turnstile/route.ts`
  - Auth: `TURNSTILE_SECRET_KEY`
  - Public config: `turnstileSitekey`, action, cData, allowed hostnames, and rate limits in `config/site.ts`

**Analytics & Tracking:**
- Google Tag Manager - Primary analytics container for English site.
  - SDK/Client: dynamically inserted browser script in `components/analytics/index.tsx`; noscript fallback in `components/analytics/gtm-body.tsx`; event helpers in `hooks/use-gtm.ts` and `lib/gtm.ts`
  - Endpoint/script: `https://www.googletagmanager.com/gtm.js` and `https://www.googletagmanager.com/ns.html`
  - Auth: `NEXT_PUBLIC_GTM_ID` with fallback container `GTM-5DTRN2V3` in `config/analytics.ts`
- Google Analytics - Configured as a disabled direct integration for English.
  - SDK/Client: Next `Script` in `components/analytics/index.tsx`
  - Tracking ID: `G-YF5VHZSTE0` in `config/analytics.ts`
  - Auth: None; disabled by config
- Baidu Analytics - Enabled for `zh-cn` default language builds.
  - SDK/Client: Next `Script` in `components/analytics/index.tsx`
  - Endpoint/script: `https://hm.baidu.com/hm.js`
  - Auth: Tracking ID in `config/analytics.ts`
- Microsoft Clarity - Enabled for `zh-cn` default language builds.
  - SDK/Client: dynamically inserted browser script in `components/analytics/index.tsx`
  - Endpoint/script: `https://www.clarity.ms/tag/`
  - Auth: Tracking ID in `config/analytics.ts`
- Mautic email analytics - Enabled for `zh-cn` default language builds.
  - SDK/Client: browser tracking snippet in `components/analytics/index.tsx`
  - Endpoint/script: `https://engage.sealos.in/mtc.js`
  - Auth: None detected
- Rybbit analytics - Configured as a disabled integration.
  - SDK/Client: dynamic browser script loader in `components/analytics/index.tsx`
  - Endpoint/script: `https://analytics.sealos.in/api/script.js`
  - Auth: Site ID in `config/analytics.ts`

**Content & Media Sources:**
- GitHub raw content - Fetches docs markdown and app README/source assets.
  - SDK/Client: native `fetch` in `components/page-actions.tsx`, `app/[lang]/products/app-store/[slug]/components/ReadmeMarkdownWindow.tsx`, and `scripts/generate-apps-api.js`
  - Endpoints: `https://raw.githubusercontent.com/...` and GitHub repository URLs built in `app/[lang]/docs/[[...slug]]/page.tsx`
  - Auth: None detected
- Remote image/CDN hosts - Next image configuration allows external assets.
  - SDK/Client: Next image config in `next.config.mjs`
  - Hosts: `oss.laf.run`, `images.tryfastgpt.ai`, `cdn.jsdelivr.net`, `images.sealos.run`, and `raw.githubusercontent.com`
  - Auth: None detected
- Sealos object storage image - WeChat QR image is referenced from `https://objectstorageapi.hzh.sealos.run/...` in `config/site.ts`.
  - SDK/Client: direct image URL
  - Auth: None detected
- Baidu IP geolocation - Drives China-region redirect suggestion logic.
  - SDK/Client: native `fetch` in `components/redirectSuggest.tsx`
  - Endpoint: `https://qifu-api.baidubce.com/ip/local/geo/v1/district`
  - Auth: None detected

## Data Storage

**Databases:**
- Not detected for this website application.
  - Connection: Not applicable
  - Client: Not applicable
- Product pages describe databases such as PostgreSQL, MySQL, Redis, MongoDB, Kafka, and Milvus through content and assets, but the website codebase does not connect to those databases directly.

**File Storage:**
- Static repository assets in `assets/`, `public/`, `fonts/`, and `content/`.
- Generated static app data and downloaded media are produced by `scripts/generate-apps-api.js` and consumed through `app/api/apps/[[...lang]]/route.ts` and `lib/api/apps-api.ts`.
- External media is loaded from CDN/object-storage hosts configured in `next.config.mjs` and `config/site.ts`.

**Caching:**
- Next.js/static export caching: production builds use static export in `next.config.mjs`.
- Vercel cache headers: `vercel.json` sets immutable caching for `/mtc.js` and `/api/script.js`.
- Open Graph route caching: `app/api/og/route.ts` sets `Cache-Control: public, max-age=86400`.
- Turnstile verification rate limiting: in-memory `Map` in `app/api/abuse/verify-turnstile/route.ts`; state is process-local.
- External cache service: Not detected.

## Authentication & Identity

**Auth Provider:**
- Sealos managed auth with email code, OAuth redirect, and social login links.
  - Implementation: `new-components/AuthForm/AuthFormContext.tsx` sends email-code requests; `new-components/AuthForm/VerifyCodeStep.tsx` verifies codes; `new-components/AuthForm/AuthFormProvider.tsx` redirects to `siteConfig.oauth2Url` with returned token; `hooks/use-auth-redirect.ts` checks shared auth before opening the modal.
  - Shared session check: `lib/utils/shared-auth.ts` calls `siteConfig.desktopApiEndpoint` with cookies.
  - Social providers: GitHub and Google OAuth URLs are configured in `config/site.ts` as Sealos-hosted redirect endpoints.
  - Bot protection: Cloudflare Turnstile is used before email-code request when enabled.

## Monitoring & Observability

**Error Tracking:**
- Dedicated error tracking service: Not detected.
- Runtime errors are logged with `console.error` in `lib/api/apps-api.ts`, `app/api/og/route.ts`, `lib/utils/shared-auth.ts`, and `new-components/AuthForm/AuthFormContext.tsx`.

**Logs:**
- Browser warnings/logs for analytics script failures in `components/analytics/index.tsx`.
- Route handler errors returned as JSON in `app/api/og/route.ts` and `app/api/abuse/verify-turnstile/route.ts`.
- GitHub Actions job output and deployment summaries in `.github/workflows/deploy-cloudflare.yml`, `.github/workflows/preview-cloudflare.yml`, `.github/workflows/deploy.yml`, `.github/workflows/preview.yml`, and `.github/workflows/build-image.yml`.

## CI/CD & Deployment

**Hosting:**
- Vercel production and preview deployments are configured in `.github/workflows/deploy.yml`, `.github/workflows/preview.yml`, and `vercel.json`.
- Cloudflare Pages production and preview deployments publish `./out` through `.github/workflows/deploy-cloudflare.yml` and `.github/workflows/preview-cloudflare.yml`.
- Docker/Nginx static hosting is defined in `Dockerfile` and published through `.github/workflows/build-image.yml`.
- Kubernetes deployment update uses `actions-hub/kubectl@master` to update deployment `sealos-docs` in `.github/workflows/build-image.yml`.

**CI Pipeline:**
- GitHub Actions is the CI/CD system.
- Production Vercel deploy: `.github/workflows/deploy.yml` runs on `main` push and manual dispatch, pulls Vercel env vars with `VERCEL_TOKEN`, builds, links, and deploys.
- Vercel preview deploy: `.github/workflows/preview.yml` runs on `pull_request_target` and manual dispatch, deploys via `amondnet/vercel-action@v25`, and comments a preview URL.
- Cloudflare production deploy: `.github/workflows/deploy-cloudflare.yml` builds with Node 20 and deploys `./out` through `cloudflare/wrangler-action@v3`.
- Cloudflare preview deploy: `.github/workflows/preview-cloudflare.yml` supports pull requests, `/preview` comments, and manual dispatch; it checks maintainer permissions for fork previews through `actions/github-script@v7`.
- Docker image publish: `.github/workflows/build-image.yml` builds `linux/amd64` images with Docker Buildx, pushes to GHCR, and updates Kubernetes when repository is `labring/sealos.io`.

## Environment Configuration

**Required env vars:**
- `NEXT_PUBLIC_APP_URL` - Site base URL used by `config/site.ts`, `lib/utils/metadata.ts`, `Dockerfile`, and GitHub workflows.
- `NEXT_PUBLIC_OPEN_SOURCE_URL` - Build argument passed by `Dockerfile` and `.github/workflows/build-image.yml`.
- `NEXT_PUBLIC_DEFAULT_LOCALE` - Default language used by `lib/i18n.ts`, `next.config.mjs`, `Dockerfile`, and GitHub workflows.
- `NEXT_PUBLIC_GTM_ID` - Optional Google Tag Manager container override in `config/analytics.ts`.
- `TURNSTILE_SECRET_KEY` - Required by `app/api/abuse/verify-turnstile/route.ts` for Cloudflare Turnstile verification.
- `GOOGLE_SITE_VERIFICATION` - Optional SEO verification token read by `lib/utils/metadata.ts`.
- `ANALYZE` - Optional build-analysis flag in `next.config.mjs`.
- `DOCKER_BUILD` - Enables Docker-specific Fumadocs image behavior in `source.config.ts`.
- `ROOT_DEFAULT_LOCALE` - Optional root locale normalization input for `scripts/normalize-root-locale.js`.
- `VERCEL_TOKEN`, `VERCEL_PROJECT_ID`, and `VERCEL_ORG_ID` - Required by Vercel workflows in `.github/workflows/deploy.yml` and `.github/workflows/preview.yml`.
- `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`, or `CF_API_TOKEN` - Required by Cloudflare workflows in `.github/workflows/deploy-cloudflare.yml` and `.github/workflows/preview-cloudflare.yml`.
- `KUBE_CONFIG` - Required by Kubernetes update step in `.github/workflows/build-image.yml`.
- `GITHUB_TOKEN` - Provided by GitHub Actions for GHCR login and GitHub API operations in `.github/workflows/build-image.yml` and preview workflows.

**Secrets location:**
- GitHub Actions secrets and variables are referenced in `.github/workflows/deploy.yml`, `.github/workflows/preview.yml`, `.github/workflows/deploy-cloudflare.yml`, `.github/workflows/preview-cloudflare.yml`, and `.github/workflows/build-image.yml`.
- Vercel environment variables are pulled during CI by `vercel pull` in `.github/workflows/deploy.yml` and `.github/workflows/preview.yml`.
- `.env.example` is present as a sample file; secret-bearing `.env` files are not read.

## Webhooks & Callbacks

**Incoming:**
- `POST /api/abuse/verify-turnstile` - Verifies Cloudflare Turnstile tokens in `app/api/abuse/verify-turnstile/route.ts`.
- `GET /api/apps` and `GET /api/apps/[lang]` - Returns generated app listings via `app/api/apps/[[...lang]]/route.ts` and `lib/api/apps-api.ts`.
- `GET /api/og` - Generates WebP Open Graph images in `app/api/og/route.ts`.
- `GET /api/search` - Serves static Fumadocs search index in `app/api/search/route.ts`.
- `GET /api/robots`, `GET /rss.xml`, `GET /llms.txt`, and `GET /sitemap-index.xml` - Static SEO/feed endpoints under `app/api/robots/route.ts`, `app/rss.xml/route.ts`, `app/llms.txt/route.ts`, and `app/sitemap-index.xml/route.ts`.
- GitHub Actions events - Push, pull request, pull request target, issue comment `/preview`, and workflow dispatch triggers are configured in `.github/workflows/`.

**Outgoing:**
- Cloudflare Turnstile verification POST to `https://challenges.cloudflare.com/turnstile/v0/siteverify` from `app/api/abuse/verify-turnstile/route.ts`.
- Sealos template API GET calls from `lib/api/apps-api.ts` and `scripts/generate-apps-api.js`.
- Sealos auth/email/shared-token calls from `new-components/AuthForm/AuthFormContext.tsx`, `new-components/AuthForm/VerifyCodeStep.tsx`, and `lib/utils/shared-auth.ts`.
- Browser redirects to Sealos OAuth URLs from `hooks/use-auth-redirect.ts` and `new-components/AuthForm/AuthFormProvider.tsx`.
- Browser analytics script requests to Google Tag Manager, Baidu Analytics, Microsoft Clarity, Mautic, and Rybbit from `components/analytics/index.tsx`.
- GitHub raw content fetches from `components/page-actions.tsx`, `app/[lang]/products/app-store/[slug]/components/ReadmeMarkdownWindow.tsx`, and `scripts/generate-apps-api.js`.
- `mailto:abuse@sealos.io` callback is generated by `app/[lang]/abuse/components/abuse-form.tsx` after successful Turnstile validation.

---

*Integration audit: 2026-06-11*
