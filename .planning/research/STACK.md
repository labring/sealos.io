# Stack-Specific Performance Audit Dimensions

**Project:** Sealos.io performance audit
**Researched:** 2026-06-11
**Scope:** Existing Next.js App Router, React 18, Fumadocs, static export, route handlers, build scripts, and visual/media-heavy dependencies.
**Overall confidence:** HIGH for repo structure and scripts, MEDIUM for runtime/platform behavior that depends on deployment target.

## Recommendation

Audit this repository by stack surface, then record findings module by module in `docs/performance-audit.md`. The performance audit should prioritize build-path blockers, static-export mismatches, client bundle cost, route-handler CPU and filesystem work, and media delivery because those are the surfaces already visible in `.planning/PROJECT.md`, `.planning/codebase/STACK.md`, `.planning/codebase/ARCHITECTURE.md`, `.planning/codebase/CONCERNS.md`, `package.json`, and `next.config.mjs`.

## Required Audit Dimensions

| Dimension | Confidence | Why It Matters Here | Likely Evidence Paths | Verification Commands |
|-----------|------------|---------------------|-----------------------|------------------------|
| Static export compatibility and API-like routes | HIGH | `next.config.mjs` exports static HTML in production while the repo still defines route handlers for apps, search, OG, robots, RSS, sitemap, abuse verification, thumbnails, and `llms.txt`. Each route must be classified as static artifact, runtime endpoint, or deployment-specific exception. | `next.config.mjs`, `app/api/**/route.ts`, `app/rss.xml/route.ts`, `app/sitemap-index.xml/route.ts`, `app/llms.txt/route.ts`, `app/api/blog/[lang]/[slug]/thumbnail/[format]/route.ts`, `public/_redirects`, `vercel.json`, `.github/workflows/*` | `npm run build`; `find out -maxdepth 3 -type f | sort | sed -n '1,160p'`; `rg -n "export const dynamic|revalidate|NextResponse|staticGET|runtime" app` |
| Next.js App Router static generation cost | HIGH | Locale-scoped routes, `generateStaticParams`, `generateMetadata`, docs, blog, app-store details, industries, customers, and comparison pages can multiply work across languages and content volume. | `app/[lang]/layout.tsx`, `app/[lang]/**/page.tsx`, `app/[lang]/**/layout.tsx`, `lib/i18n.ts`, `lib/utils/metadata.ts`, `config/apps-loader.ts`, `config/industries.tsx` | `time npm run build`; `rg -n "generateStaticParams|generateMetadata|notFound\(|source\.getPage|blog\.getPage|loadAllApps|getAppBySlug" app lib config` |
| React client component boundary and hydration weight | HIGH | Many site-wide and route-local components are marked `'use client'`, including header, auth, deploy modal, app-store grid, customer filters, animated UI, Mermaid, analytics, and video. The audit should identify client components pulled into high-traffic static pages and measure bundle impact. | `app/[lang]/layout.tsx`, `new-components/Header.tsx`, `new-components/AuthForm/**`, `new-components/DeployModal/**`, `components/app-store/app-grid.tsx`, `components/mdx/mermaid.tsx`, `components/video.tsx`, `components/ui/**`, `app/[lang]/(home)/(new-home)/**` | `rg -n "^['"]use client['"]" app components new-components hooks`; `npm run build:analyze`; inspect `.next/analyze/client.html` or generated analyzer output |
| Heavy visual and media dependency usage | HIGH | `motion`, `three`, `matter-js`, `react-player`, `mermaid`, `canvas`, `sharp`, `satori`, image imports, and numerous SVG/PNG/WebP assets can dominate JS, CPU, and network transfer. Audit import location, lazy-loading, animation idle cost, and first-viewport asset priority. | `package.json`, `components/video.tsx`, `components/mdx/mermaid.tsx`, `new-components/GodRays.tsx`, `components/ui/particles.tsx`, `app/[lang]/(home)/(new-home)/components/FallingTags.tsx`, `lib/og-canvas.ts`, `app/api/og/route.ts`, `assets/`, `public/` | `rg -n "motion|three|matter-js|react-player|mermaid|canvas|sharp|satori|next/dynamic|requestAnimationFrame|setInterval" app components new-components lib`; `find public assets -type f -exec du -h {} + | sort -h | tail -40`; `npm run build:analyze` |
| Fumadocs MDX generation and docs search | HIGH | Fumadocs powers docs, blog, and AI quick reference. `postinstall` runs `fumadocs-mdx`, `app/api/search/route.ts` builds indexes from localized pages, and Mermaid/remark plugins can affect build time and client cost. | `source.config.ts`, `lib/source.ts`, `app/api/search/route.ts`, `app/[lang]/docs/[[...slug]]/page.tsx`, `app/[lang]/docs/layout.tsx`, `content/docs/**`, `content/blog/**`, `content/ai-quick-reference/**`, `lib/remark/remark-mermaid.ts`, `components/mdx/mermaid.tsx` | `time npx fumadocs-mdx`; `npm run build`; `rg -n "createSearchAPI|structuredData|remarkMermaid|remarkInclude|Mermaid|createMDXSource|getLanguages" source.config.ts lib app components` |
| Build-time template generation pipeline | HIGH | `npm run build` always runs `npm run generate-apps`, and `scripts/generate-apps-api.js` fetches remote templates, downloads icons through `execSync(curl ...)`, fetches template source data, and writes generated JSON/assets. This is a direct build latency and reliability risk. | `package.json`, `scripts/generate-apps-api.js`, `config/apps.json`, `config/template-sources.json`, `public/images/apps/`, `scripts/generate-apps-api.test.mjs`, `config/apps-data-quality.test.mts` | `time npm run generate-apps`; `node scripts/generate-apps-api.test.mjs`; `node config/apps-data-quality.test.mts`; `rg -n "fetch\(|execSync|for \(const template|downloadIcon|fetchTemplateSource|writeFileSync" scripts/generate-apps-api.js` |
| App Store data loading and cache behavior | HIGH | Server paths import static JSON while browser paths fetch `/api/apps` with a five-minute in-memory cache. The audit should check duplicate normalization, cache invalidation, payload size, fallback paths, and filter/search cost. | `config/apps-loader.ts`, `lib/api/apps-api.ts`, `app/api/apps/[[...lang]]/route.ts`, `components/app-store/app-grid.tsx`, `app/[lang]/products/app-store/page.tsx`, `app/[lang]/products/app-store/[slug]/page.tsx`, `config/apps.json`, `config/template-sources.json` | `du -h config/apps.json config/template-sources.json`; `rg -n "loadAllApps|fetchDynamicApps|DYNAMIC_CACHE_TTL|searchApps|getAppsByCategory|getAppBySlug|handleAppsRequest|fetchTemplates" config lib app components`; local browser/network inspection on `/en/products/app-store/` after `npm run dev` |
| Route-handler CPU, filesystem, and native work | HIGH | `app/api/og/route.ts` calls `canvas` and `sharp`; `app/llms.txt/route.ts` scans MDX files and processes markdown; thumbnail routes load fonts and render images; abuse verification calls Turnstile. These paths need per-request versus build-time classification and timing. | `app/api/og/route.ts`, `lib/og-canvas.ts`, `app/api/blog/[lang]/[slug]/thumbnail/[format]/route.ts`, `app/llms.txt/route.ts`, `app/api/abuse/verify-turnstile/route.ts`, `app/api/search/route.ts`, `app/api/robots/route.ts` | `rg -n "readFile|fast-glob|sharp|drawCanvas|createCanvas|loadImage|ImageResponse|fetch\(|Promise\.all|Cache-Control" app lib`; `npm run build`; run selected handlers under `npm run dev` with `curl -w '@-'` timing if runtime endpoints are supported locally |
| Image delivery under static export | HIGH | `images.unoptimized: true`, `dangerouslyAllowSVG: true`, broad remote patterns, static export, downloaded app icons, local SVG-heavy assets, and video thumbnails shift optimization responsibility to source assets and CDN headers. | `next.config.mjs`, `public/images/apps/`, `public/images/**`, `assets/**`, `components/ui/app-icon.tsx`, `components/app-store/app-grid.tsx`, `components/video.tsx`, `app/[lang]/**` | `find public assets -type f \( -name '*.png' -o -name '*.jpg' -o -name '*.jpeg' -o -name '*.webp' -o -name '*.svg' -o -name '*.gif' \) -exec du -h {} + | sort -h | tail -60`; `rg -n "<Image|next/image|priority|loading=|fetchPriority|dangerouslyAllowSVG|remotePatterns|unoptimized" app components new-components next.config.mjs` |
| Analytics, auth, deploy modal, and global provider overhead | MEDIUM | Locale layout mounts analytics, Fumadocs provider/search, auth modal, deploy modal, and shared chrome for all localized pages. Audit whether global client providers add JS, network preconnects, or hydration cost to docs and simple content pages. | `app/[lang]/layout.tsx`, `components/analytics/**`, `new-components/AuthForm/**`, `new-components/DeployModal/**`, `hooks/use-gtm.ts`, `lib/gtm.ts`, `config/analytics.ts`, `components/docs/Search.tsx` | `rg -n "AuthForm|DeployModal|RootProvider|SearchDialog|GTM|GoogleTagManager|useGTM|preconnect|prefetchDNS" app components new-components hooks lib config`; `npm run build:analyze`; browser Performance trace on `/en/docs/` and `/en/` |
| CSS and Tailwind output size | MEDIUM | Tailwind 4, global CSS, animation utilities, Fumadocs UI, Radix components, and many marketing sections can inflate CSS and animation work. Static export means route-level CSS output should be inspected after build. | `app/global.css`, `postcss.config.js`, `components/ui/**`, `app/[lang]/**`, `new-components/**`, `tailwindcss-animated` dependency in `package.json` | `npm run build`; `find .next out -type f -name '*.css' -exec du -h {} + | sort -h | tail -30`; `rg -n "animate-|transition-|backdrop-blur|blur-|shadow-|fixed|sticky|will-change|transform" app components new-components app/global.css` |
| Dependency version alignment and native build variance | HIGH | `next` is 14.x while `@next/mdx` and `@next/bundle-analyzer` are 15.x; native packages `canvas` and `sharp` affect Docker, Vercel, Cloudflare, and local builds differently. Audit install/build repeatability before performance fixes rely on tooling output. | `package.json`, `package-lock.json`, `next.config.mjs`, `Dockerfile`, `.github/workflows/*.yml`, `.nvmrc` | `npm ls next @next/mdx @next/bundle-analyzer canvas sharp`; `npm run lint`; `npm run build`; `docker build .` when Docker is available |
| CI/CD artifact parity and deployment target behavior | MEDIUM | Vercel, Cloudflare Pages, Docker/Nginx, and kubectl image update workflows can serve different artifacts, redirects, headers, and runtime endpoints. Performance audit should tie each finding to the target where it manifests. | `.github/workflows/deploy.yml`, `.github/workflows/preview.yml`, `.github/workflows/deploy-cloudflare.yml`, `.github/workflows/preview-cloudflare.yml`, `.github/workflows/build-image.yml`, `Dockerfile`, `vercel.json`, `public/_headers`, `public/_redirects` | `rg -n "npm (ci|install|run build|run generate-apps)|next build|out|vercel|cloudflare|nginx|Cache-Control|headers|redirects|kubectl|docker" .github Dockerfile vercel.json public`; compare `out/`, Vercel settings, Cloudflare Pages artifact expectations |

## Prescriptive Audit Order

1. **Build pipeline first:** run `npm run lint`, `time npm run generate-apps`, `time npm run build`, and `npm run build:analyze`. This exposes the most repo-specific risks: remote generation, static export constraints, MDX generation, and bundle-heavy dependencies.
2. **Classify generated routes:** inspect every `route.ts` and route-like file as static artifact, runtime endpoint, or deployment-specific behavior. Record how each behaves under `output: 'export'` and under `npm run dev`.
3. **Measure client bundle boundaries:** start from `app/[lang]/layout.tsx`, home, docs, app-store, devbox, customers, and comparison pages. Trace imported client components and heavy libraries with analyzer output.
4. **Audit media and animation surfaces:** inventory local assets, remote images, priority images, SVG usage, canvas animations, Matter.js, Mermaid, and ReactPlayer. Prioritize first-viewport and globally mounted surfaces.
5. **Audit data and search paths:** cover Fumadocs search, `llms.txt`, App Store JSON, template source JSON, client-side `/api/apps`, and per-route metadata generation.
6. **Map deployment variance:** tie findings to Vercel, Cloudflare Pages, Docker/Nginx, and preview workflows because static export plus route handlers can have target-specific performance behavior.

## Commands to Add to the Audit Checklist

```bash
npm run lint
npm run generate-apps
time npm run generate-apps
time npm run build
npm run build:analyze
node scripts/generate-apps-api.test.mjs
node config/apps-data-quality.test.mts
npm ls next @next/mdx @next/bundle-analyzer canvas sharp
find public assets -type f -exec du -h {} + | sort -h | tail -80
find out .next -type f \( -name '*.js' -o -name '*.css' -o -name '*.html' -o -name '*.json' \) -exec du -h {} + | sort -h | tail -80
rg -n "^['"]use client['"]" app components new-components hooks
rg -n "motion|three|matter-js|react-player|mermaid|canvas|sharp|satori|next/dynamic|requestAnimationFrame" app components new-components lib
rg -n "generateStaticParams|generateMetadata|createSearchAPI|fast-glob|readFile|fetch\(|execSync|Promise\.all" app lib config scripts
```

## Evidence Paths by High-Risk Stack Area

### Next.js and Static Export

- `next.config.mjs` controls `output: 'export'`, `trailingSlash`, `images.unoptimized`, analyzer loading, optimized package imports, and development rewrites.
- `app/api/**/route.ts`, `app/rss.xml/route.ts`, `app/sitemap-index.xml/route.ts`, and `app/llms.txt/route.ts` need static-export classification.
- `public/_redirects`, `public/_headers`, `vercel.json`, and `.github/workflows/*` determine how static output is served.

### Fumadocs and Content

- `source.config.ts` and `lib/source.ts` define docs/blog/AI quick reference content loading.
- `app/api/search/route.ts` builds the search API from `source.getLanguages()` and currently indexes metadata fields.
- `app/[lang]/docs/[[...slug]]/page.tsx` and `app/[lang]/docs/layout.tsx` are the docs render path.
- `components/mdx/mermaid.tsx` dynamically imports Mermaid on the client.
- `app/llms.txt/route.ts` uses `fast-glob`, `gray-matter`, and remark processing over docs files.

### App Store and Template Data

- `scripts/generate-apps-api.js` is a build-path network and CPU hotspot.
- `config/apps-loader.ts` mixes static imports, browser dynamic fetch, module caches, category filters, and search.
- `lib/api/apps-api.ts` runs remote template fetch and conversion for `/api/apps`.
- `components/app-store/app-grid.tsx` and `app/[lang]/products/app-store/**` are user-facing App Store render surfaces.
- `config/apps.json`, `config/template-sources.json`, and `public/images/apps/` are generated artifacts that affect payload and image cost.

### Heavy Visual Dependencies

- `components/video.tsx` lazy-loads `react-player/lazy`, preconnects to YouTube, and marks the thumbnail priority/eager/high.
- `components/mdx/mermaid.tsx` imports Mermaid only after render, so docs pages with diagrams should be measured separately.
- `new-components/GodRays.tsx` and `components/ui/particles.tsx` run canvas animations.
- `app/[lang]/(home)/(new-home)/components/FallingTags.tsx` imports Matter.js.
- `lib/og-canvas.ts` and `app/api/og/route.ts` use native canvas and Sharp.

### Global Client and Interaction Surfaces

- `app/[lang]/layout.tsx` mounts global providers and shared UI across all locale pages.
- `new-components/Header.tsx`, `new-components/AuthForm/**`, `new-components/DeployModal/**`, `components/analytics/**`, and `components/docs/Search.tsx` are candidates for global hydration and bundle cost review.
- `app/[lang]/customers/**`, `app/[lang]/(home)/comparison/**`, and `app/[lang]/products/**` contain route-level client interactions worth measuring with browser traces.

## Confidence Assessment

| Area | Confidence | Reason |
|------|------------|--------|
| Stack inventory | HIGH | Directly grounded in `package.json`, `next.config.mjs`, and `.planning/codebase/STACK.md`. |
| Build and static export dimensions | HIGH | `package.json` scripts and `next.config.mjs` explicitly define generation and static export behavior. |
| Route-handler performance dimensions | HIGH | Route files and code paths were inspected for `canvas`, `sharp`, `fast-glob`, `readFile`, `fetch`, and Fumadocs search generation. |
| Client bundle and visual dependency dimensions | HIGH | Heavy dependencies and client boundaries are visible through imports and `'use client'` markers. Bundle size must be verified with analyzer output. |
| Deployment-specific behavior | MEDIUM | Workflows and config are present, but final behavior depends on Vercel, Cloudflare Pages, Docker/Nginx, and runtime settings outside the repo. |
| Runtime user impact severity | MEDIUM | Source paths identify credible risks; severity should be assigned after build analyzer output, local timing, asset-size inventory, and browser traces. |

## Sources

- `.planning/PROJECT.md`
- `.planning/codebase/STACK.md`
- `.planning/codebase/ARCHITECTURE.md`
- `.planning/codebase/CONCERNS.md`
- `package.json`
- `next.config.mjs`
- Repo source scan of `app/`, `components/`, `new-components/`, `lib/`, `config/`, `scripts/`, `public/`, `assets/`, and `.github/`
