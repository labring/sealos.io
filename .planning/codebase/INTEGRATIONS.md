# Integrations

## Sealos Platform APIs

The site integrates with the Sealos cloud platform at `usw-1.sealos.io`:

- **Authentication** — Email OTP (`/api/auth/email/sms`, `/api/auth/email/verify`)
- **OAuth** — GitHub and Google login (`/oauth?login=github|google`)
- **Template API** — App template marketplace (`template.usw-1.sealos.io`)
- **Desktop API** — Platform dashboard (`usw-1.sealos.io`)

Configuration in `config/site.ts`:
```
emailRequestEndpoint: 'https://usw-1.sealos.io/api/auth/email/sms'
emailVerifyEndpoint: 'https://usw-1.sealos.io/api/auth/email/verify'
templateApiEndpoint: 'https://template.usw-1.sealos.io'
desktopApiEndpoint: 'https://usw-1.sealos.io'
```

## Analytics & Tracking

- **Google Tag Manager** — `components/analytics/gtm-body.tsx`, `lib/gtm.ts`
- **Baidu Analytics** — DNS prefetch configured
- **Sealos Analytics** — Self-hosted at `analytics.sealos.in`
- **Sealos Engage** — Self-hosted at `engage.sealos.in`
- **Custom GTM hooks** — `hooks/use-gtm.ts`, `lib/gtm-utils.ts`

## Security

- **Cloudflare Turnstile** — CAPTCHA for abuse reporting
  - Site key: `0x4AAAAAABmIoQ_LAxlvw78V`
  - Package: `@marsidev/react-turnstile`
  - Rate limit: 10 requests/minute
  - Configured in `config/site.ts`

## CDN & Image Hosting

Remote image sources (configured in `next.config.mjs`):
- `oss.laf.run` — Laf object storage
- `images.tryfastgpt.ai` — FastGPT images
- `cdn.jsdelivr.net` — CDN assets
- `images.sealos.run` — Sealos image CDN

## Deployment Targets

- **Cloudflare Pages** — Primary production deployment
  - Workflow: `.github/workflows/deploy-cloudflare.yml`
  - Preview: `.github/workflows/preview-cloudflare.yml`
  - Static export (`next build` → `./out/` → Cloudflare Pages)
- **Docker/Nginx** — Alternative deployment via `Dockerfile`
  - Multi-stage build: Node.js builder → nginx:1.27-alpine
  - Static export served by nginx on port 80
- **Vercel** — Legacy/alternative (`vercel.json` with redirects/headers)

## Content Linting

- **zhlint** — Chinese text linting (`.zhlintrc`, `.zhlintignore`)
  - Checks Chinese text formatting conventions

## External Services Referenced

| Service | Domain | Purpose |
|---------|--------|---------|
| Sealos Cloud | `os.sealos.io` | Main app platform |
| Sealos Template | `template.sealos.io` | Template marketplace |
| Sealos Run (zh) | `sealos.run` | Chinese locale site |
| GitHub | `github.com/labring/sealos` | Source repository |
| Discord | `discord.gg/wdUn538zVP` | Community |
