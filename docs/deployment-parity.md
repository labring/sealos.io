# Deployment Parity

Phase 9 keeps deployment validation source-owned and safe by default. This
checklist compares each maintained deployment target before route, shell,
native-rendering, and dependency remediation moves forward.

## Target Matrix

| Target | install command | build command | Node/runtime | environment source | artifact | static output location | serving layer | redirects | headers | cache policy | route support | native dependency assumptions | credentials/secrets touched | safe validation command |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Vercel production | `pnpm install --frozen-lockfile`; `pnpm add --global vercel@latest` | `pnpm app-store:refresh`; `vercel build --prod --local-config ./vercel.json`; prebuilt `vercel deploy --prod --local-config ./vercel.json --archive=tgz --prebuilt` | GitHub Actions Node 20 plus Vercel build/deploy runtime | `vercel pull --yes --environment=preview`; Vercel project secrets | Prebuilt Vercel output | Vercel prebuilt deployment output | Vercel hosting | `vercel.json` redirects | `vercel.json` headers | Vercel CDN rules plus `Cache-Control` source headers for `/mtc.js` and `/api/script.js` | Vercel App Router prebuilt behavior with static-export assumptions tracked by Phase 10 | Vercel build runtime can differ from Docker native library path | `VERCEL_TOKEN`, `VERCEL_PROJECT_ID`, `VERCEL_ORG_ID` | `pnpm deployment:check` |
| Vercel preview | `pnpm install --frozen-lockfile`; `pnpm add --global vercel@latest` | `pnpm app-store:refresh`; `vercel build --local-config ./vercel.json`; `amondnet/vercel-action@v25` deploys prebuilt preview | GitHub Actions Node 20 plus Vercel action `vercel-version` 41.4.1 | `vercel pull --yes --environment=preview`; preview action secrets | Prebuilt Vercel preview output | Vercel preview output | Vercel preview deployment | `vercel.json` redirects | `vercel.json` headers | Vercel preview CDN rules plus source headers for `/mtc.js` and `/api/script.js` | Preview branch behavior can differ by branch/env and is guarded by hosted probes when opened | Same Vercel native-runtime variance as production | `VERCEL_TOKEN`, `VERCEL_PROJECT_ID`, `VERCEL_ORG_ID`, pull request context | `pnpm deployment:check` |
| Cloudflare Pages production | `pnpm install --frozen-lockfile` | `pnpm app-store:refresh`; `pnpm build`; `pages deploy ./out --project-name=... --branch=main` | GitHub Actions Node 20 | GitHub Actions vars for `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_OPEN_SOURCE_URL`, `NEXT_PUBLIC_DEFAULT_LOCALE`; Cloudflare token/account secrets | `./out` static export | `./out` | Cloudflare Pages | `public/_redirects`, including `/robots.txt /api/robots 200` | `public/_headers` | `_headers` immutable cache rules for `/mtc.js` and `/api/script.js`; Pages defaults for other assets | Static export files and Cloudflare Pages redirects define the baseline; generated route policy remains Phase 10 | Static export path has no Docker native runtime libraries | `CLOUDFLARE_API_TOKEN` or `CF_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, Pages project vars | `pnpm static-output:check` |
| Cloudflare Pages preview | `pnpm install --frozen-lockfile` | `pnpm app-store:refresh`; `pnpm build`; upload/download `out`; `pages deploy ./out --project-name=... --branch=pr-...` | GitHub Actions Node 20 | Pull request metadata, maintainer preview guard, GitHub Actions vars, Cloudflare token/account secrets | Uploaded `cloudflare-pages-out` artifact | `./out` after artifact download | Cloudflare Pages preview branch | `public/_redirects` | `public/_headers` | Same `_headers` rules with preview branch CDN behavior | Static export artifact preview for same-repo PRs or maintainer-approved fork PRs | Static export path has no Docker native runtime libraries | `CF_API_TOKEN`, `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, GitHub token | `pnpm static-output:check` |
| Docker/Nginx | `pnpm install --frozen-lockfile` inside builder | `scripts/replace-image-paths.sh`; `pnpm install --frozen-lockfile && pnpm build`; copy `/app/out` to Nginx root | Builder `node:20-bookworm-slim`; runner `nginx:1.27-alpine` | Docker build args promoted to env; `DOCKER_BUILD=true`; `NEXT_TELEMETRY_DISABLED=1` | Docker image with static export | `/app/out` copied to `/usr/share/nginx/html` | Nginx static serving | Static files unless runtime config supplies redirect handling; `vercel.json` and `public/_redirects` remain source evidence | Nginx defaults unless runtime config supplies headers | Nginx defaults unless runtime config supplies cache headers | Static export file serving; API-like route behavior depends on generated artifacts or server config evidence | Installs Cairo, JPEG, Pango, GIF, SVG, FreeType, HarfBuzz, FriBidi, fontconfig, and curl for native `canvas`/`sharp` build path | Docker build args for public env values | `pnpm docker:smoke` |
| GHCR/Kubernetes | `pnpm install --frozen-lockfile`; `pnpm app-store:refresh` before Docker build context handoff | `docker/build-push-action@v5` builds `linux/amd64`; Kubernetes updates `deployment/sealos-docs` | GitHub Actions Node 20 for snapshot validation; GHCR image built from Dockerfile; Kubernetes deployment runtime | GitHub secrets and kube config | GHCR image containing Nginx static export | `/usr/share/nginx/html` in the image | Kubernetes deployment `sealos-docs` plus cluster ingress/CDN | Inherits Docker/Nginx assumptions plus ingress behavior outside repo evidence | Inherits Docker/Nginx assumptions plus ingress/CDN behavior outside repo evidence | Cluster ingress/CDN cache behavior outside repo evidence | Built static files plus cluster ingress configuration; route behavior remains later owner phase | Inherits Docker native libraries and architecture-specific image behavior | `GITHUB_TOKEN`, `KUBE_CONFIG`, public env build args | `pnpm docker:smoke` |

## Guard Matrix

| Env var | Default state | Open behavior | Skip rationale |
|---|---|---|---|
| `PHASE9_RUN_LOCKED_BUILD` | Closed | Runs Node 20 locked-dependency validation: `pnpm app-store:diff`, `pnpm lint`, `pnpm build:timed`, `pnpm app-store:diff`, `pnpm build:analyze:timed`, `pnpm app-store:diff`. | Full VALIDATE-01 confidence requires Node 20 from `.nvmrc` and installed `node_modules`. |
| `PHASE9_RUN_DOCKER_SMOKE` | Closed | Builds a disposable local image, runs a disposable Nginx container, probes representative static/header/redirect/asset paths, and cleans up. | Docker crosses package install, native library, daemon, image, and serving boundaries. |
| `PHASE9_RUN_HOSTED_PROBES` | Closed | Allows hosted preview or production header, redirect, and route probes. | Hosted probes require deployment URLs and network access. |
| `PHASE9_RUN_BROWSER_TRACE` | Closed | Allows browser automation or trace capture for later UI/runtime validation. | Browser traces require browser automation runtime and target URLs. |
| `PHASE9_RUN_NETWORK_REFRESH` | Closed | Allows external network refreshes such as remote catalog validation. | Network refreshes can be slow and can change generated artifacts. |
| `PHASE9_RUN_DEPLOY` | Closed | Allows credentialed deploy commands. | Deploys require credentials and can mutate hosted environments. |
| `PHASE9_ACCEPT_GENERATED_CHANGES` | Closed | Allows reviewed generated App Store artifact mutation acceptance. | Generated changes require explicit review of `config/apps.json`, `config/template-sources.json`, and `public/images/apps`. |

## App Store Snapshot Refresh

Deployment jobs run `pnpm app-store:refresh` before build so the deployed
App Store snapshot follows the current template API inventory.

When template data should change, refresh locally and commit the generated
snapshot:

```bash
pnpm app-store:refresh
pnpm app-store:diff
```

Review `config/apps.json`, `config/template-sources.json`, and
`public/images/apps` before committing. For changed templates, manually confirm
the input list in `config/template-sources.json` matches the template source
API expectation; an unexpected empty input array can skip the deploy form.

## Validation Commands

Default safe checks:

```bash
pnpm app-store:diff
pnpm deployment:check
pnpm static-output:check
pnpm docker:smoke
pnpm validate:deployment
```

Accepted Node 20 locked-dependency evidence:

```bash
PHASE9_RUN_LOCKED_BUILD=1 pnpm validate:deployment
```

Accepted Docker/Nginx smoke evidence:

```bash
PHASE9_RUN_DOCKER_SMOKE=1 pnpm docker:smoke
```

The default command path avoids Docker, deploy credentials, hosted URLs, browser
automation, external-service calls, package installs, and generated mutation
acceptance.
