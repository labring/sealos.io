# Sealos.io Performance Audit

This report is the durable v1 performance audit ledger. Later phases append
evidence, findings, validation results, and remediation ordering here so shared
mechanisms are grouped once.

## Audit Status

| Field | Value |
|-------|-------|
| Audit version | v1 |
| Last updated | 2026-06-12 |
| Phase status | Phase 13 v2 closeout records browser trace guard evidence, final v2 status matrix, and open-gate caveats |
| Scope | Full-codebase performance audit across source, content, assets, build, and deployment surfaces |
| Durable artifact | `docs/performance-audit.md` |
| Planning source | `.planning/phases/01-audit-ledger-and-module-inventory/01-CONTEXT.md` |
| Requirements covered | LEDGER-01, LEDGER-02, LEDGER-03, LEDGER-04, APPPIPE-01, APPPIPE-02, APPPIPE-03, APPPIPE-04, APPPIPE-05, ROUTE-01, ROUTE-02, CONTENT-01, CONTENT-02, CONTENT-03, CONTENT-04, HOTSPOT-01, HOTSPOT-02, HOTSPOT-03, HOTSPOT-04, FRONTEND-01, FRONTEND-02, FRONTEND-03, FRONTEND-04, FRONTEND-05, ASSET-01, ASSET-02, DEPS-01, DEPS-02, DEPLOY-01, DEPLOY-02, VERIFY-01, VERIFY-02, VERIFY-03 |
| Inventory coverage | 21 module rows across required repository surfaces |
| Source inventory count | 3886 files from `rg --files app components new-components config content hooks lib scripts public assets fonts .github/workflows` |
| Finding counts | candidate: 36, confirmed: 0, dismissed: 0, deferred: 0 |
| Seed candidate notes | 6 |
| Validation coverage | `tested` for ledger checks; `source-text only`, `manual only`, and `unvalidated` gaps normalized in Phase 7 matrix |
| Last validation commands | See [Phase 7 Validation](#phase-7-validation) |

## Finding Schema

Every later finding must use this contract. The fields are intentionally stable
so module-level evidence can be counted, deduplicated, dismissed, or promoted
without rewriting earlier audit work.

| Field | Allowed Values or Format | Required | Notes |
|-------|--------------------------|----------|-------|
| status | `candidate`, `confirmed`, `dismissed`, `deferred` | yes | Lifecycle value for counting and remediation planning. |
| severity | `high`, `medium`, `low`, `info` | yes | Use `info` for inventory-only notes. |
| phase | `1` through `7` | yes | Phase that owns the evidence or dismissal. |
| files | Backtick paths, comma-separated | yes | Include file-level evidence paths. |
| entry point | Route, script, component, asset group, workflow, or config file | yes | Name the trigger or user/developer path. |
| module boundary | Must match a row in [Module Inventory](#module-inventory) | yes | Keeps findings attached to a stable owner. |
| work type | CPU, network, filesystem I/O, native rendering, bundle, hydration, asset, developer workflow | yes | Cost category. Keep separate from execution timing. |
| execution timing | build, static generation, request, page entry, interaction, CI, Docker, deployment | yes | When the work happens. Keep separate from work type. |
| evidence | File path plus concrete source, command, or measurement reason | yes | Every finding needs evidence and a performance reason. |
| root cause | Short text | yes for `candidate`, `confirmed`, and `deferred` | Reuse the shared mechanism when duplicate key is reused. |
| impact | User-facing, build-time, developer workflow, or deployment variance impact | yes for `candidate`, `confirmed`, and `deferred` | Describe why the cost matters. |
| remediation direction | Short direction, not a full implementation plan during v1 | yes for `candidate`, `confirmed`, and `deferred` | Keep fixes in later fix phases. |
| validation coverage | `tested`, `source-text only`, `typecheck only`, `manual only`, `unvalidated` | yes | Update when stronger evidence is collected. |
| duplicate key | Kebab-case key from the registry or a route/module-local key | yes | Reuse when root cause and remediation path are shared. |
| dismissal rationale | Text or `n/a` | yes | Required for `dismissed`; use `n/a` for active findings. |

### Finding Row Template

| ID | status | severity | phase | files | entry point | module boundary | work type | execution timing | evidence | root cause | impact | remediation direction | validation coverage | duplicate key | dismissal rationale |
|----|--------|----------|-------|-------|-------------|-----------------|-----------|------------------|----------|------------|--------|-----------------------|---------------------|---------------|---------------------|
| EXAMPLE-000 | candidate | info | 1 | `path/to/file.ts` | `route-or-script` | Inventory boundary | CPU | request | Evidence path and reason. | Shared mechanism. | Impact category. | Direction only. | source-text only | `example-key` | n/a |

## Module Inventory

Inventory rows are broad by design. Later phases can add child rows or detailed
findings while keeping the same module boundary vocabulary.

| Module Boundary | Entry Points | Owning Files | Work Type | Execution Timing | Likely Phase Owner | Validation Coverage | Notes |
|-----------------|--------------|--------------|-----------|------------------|--------------------|---------------------|-------|
| `app` | Root layout, localized pages, route handlers, generated SEO routes | `app/layout.tsx`, `app/[lang]/**`, `app/api/**`, `app/rss.xml/route.ts`, `app/sitemap.ts`, `app/sitemap-ai-faq.ts`, `app/llms.txt/route.ts` | CPU, network, native rendering, bundle, hydration, developer workflow | static generation, request, page entry, interaction, deployment | Phases 4, 5, 6, 7 | source-text only | First-class route tree for page, API, generated artifact, and deployment-sensitive audit work. |
| `app/[lang]` | Locale shell, docs, blog, home, product, solution, customer, contact, legal, abuse pages | `app/[lang]/layout.tsx`, `app/[lang]/**/page.tsx`, `app/[lang]/**/layout.tsx` | bundle, hydration, CPU, asset | static generation, page entry, interaction | Phases 4, 6 | source-text only | Shared locale shell and localized page entries set the baseline for route-level cost. |
| `app/api` | Apps, search, OG, robots, abuse verification, blog helpers | `app/api/**/route.ts` | CPU, network, native rendering, filesystem I/O | request, deployment | Phases 4, 5, 7 | source-text only | Route handlers require static-export classification and hosting-target notes. |
| `components` | Shared UI, docs search, analytics, MDX helpers, app-store grid, header/footer | `components/**` | bundle, hydration, asset, CPU | page entry, interaction | Phase 6 | source-text only | Shared components can affect broad route scopes and docs/product interactions. |
| `new-components` | New header, footer, auth modal, deploy modal, visual components | `new-components/Header.tsx`, `new-components/Footer/**`, `new-components/AuthForm/**`, `new-components/DeployModal/**`, `new-components/GodRays.tsx` | bundle, hydration, network, asset | page entry, interaction | Phase 6 | source-text only | Globally mounted auth and deploy surfaces belong to shared-shell cost before route-local findings. |
| `config` | Site config, analytics, App Store config, industries, generated JSON loaders | `config/site.ts`, `config/analytics.ts`, `config/apps-loader.ts`, `config/apps.ts`, `config/apps.json`, `config/template-sources.json`, `config/industries.tsx` | network, CPU, asset, developer workflow | build, static generation, request, interaction | Phases 2, 3, 6, 7 | source-text only | Structured data and generated App Store payloads feed pages, APIs, and deploy flows. |
| `content` | Docs, blog, AI quick reference MDX/Markdown content | `content/docs/**`, `content/blog/**`, `content/ai-quick-reference/**` | filesystem I/O, CPU, asset | build, static generation, request | Phase 4 | source-text only | Fumadocs and generated endpoints depend on this content corpus. |
| `hooks` | GTM, auth redirect, template source, button handling, typewriter effect | `hooks/use-gtm.ts`, `hooks/use-auth-redirect.ts`, `hooks/use-template-source.ts`, `hooks/use-button-handler.ts`, `hooks/useTypewriterEffect.ts` | network, hydration, developer workflow | interaction, page entry | Phases 3, 6 | source-text only | Browser hooks own repeated effects, fetch behavior, and interaction latency. |
| `lib` | Source loaders, i18n, metadata, structured data, API adapters, OG canvas, utilities | `lib/source.ts`, `lib/i18n.ts`, `lib/api/apps-api.ts`, `lib/utils/metadata.ts`, `lib/utils/structured-data.ts`, `lib/og-canvas.ts`, `lib/remark/**` | CPU, network, filesystem I/O, native rendering, developer workflow | build, static generation, request, deployment | Phases 3, 4, 5, 7 | source-text only | Shared helpers often form root causes beneath route-level symptoms. |
| `scripts` | App generation, locale normalization, image path replacement, URL audit | `scripts/generate-apps-api.js`, `scripts/normalize-root-locale.js`, `scripts/replace-image-paths.sh`, `scripts/url-index-audit.sh`, `scripts/generate-apps-api.test.mjs` | network, filesystem I/O, CPU, developer workflow | build, CI, Docker | Phases 2, 7 | source-text only | Build-time scripts affect production build latency and generated artifact churn. |
| `public` | Static web-root assets, robots, redirects, headers, app images | `public/**`, `public/_headers`, `public/_redirects`, `public/images/**`, `public/icons/**` | asset, developer workflow | page entry, static generation, deployment | Phases 6, 7 | source-text only | Static export shifts image, SVG, cache, and redirect performance to source assets and host config. |
| `assets` | Imported SVGs and image groups used by components | `assets/**` | asset, bundle | page entry, build | Phase 6 | source-text only | Imported assets can increase route chunks or first-viewport transfer. |
| `fonts` | Local font files used by generated images and UI paths | `fonts/**` | asset, native rendering | request, build, deployment | Phases 5, 6, 7 | source-text only | Font loading affects browser paint and native image generation paths. |
| `.github/workflows` | Vercel, Cloudflare, Docker/GHCR, preview, deployment update workflows | `.github/workflows/deploy.yml`, `.github/workflows/preview.yml`, `.github/workflows/deploy-cloudflare.yml`, `.github/workflows/preview-cloudflare.yml`, `.github/workflows/build-image.yml` | developer workflow, network, deployment | CI, deployment | Phase 7 | source-text only | Workflow command parity and artifact behavior determine which performance fixes survive deployment. |
| `Dockerfile` | Static export image build and Nginx runtime | `Dockerfile` | filesystem I/O, native rendering, developer workflow | Docker, deployment | Phase 7 | source-text only | Docker installs/builds with native dependencies and serves static export output. |
| `vercel.json` | Vercel headers and redirects | `vercel.json` | deployment, developer workflow | deployment | Phase 7 | source-text only | Redirect and cache behavior needs parity with Cloudflare and static export files. |
| `next.config.mjs` | Next.js, MDX, static export, images, analyzer, rewrites | `next.config.mjs` | bundle, asset, developer workflow, deployment | build, static generation, deployment | Phases 4, 6, 7 | source-text only | Static export, unoptimized images, analyzer, remote patterns, and package optimization are cross-cutting. |
| `package.json` | npm scripts, dependencies, postinstall, analyzer and build commands | `package.json`, `package-lock.json` | developer workflow, bundle, native rendering | build, CI, Docker | Phases 2, 6, 7 | source-text only | Scripts define build coupling and dependency weight; package versions affect analyzer trust. |
| `config/apps.json` | Generated App Store app data snapshot | `config/apps.json` | CPU, asset, developer workflow | build, static generation, page entry | Phases 2, 3 | source-text only | Snapshot size and shape affect app-store route generation, filtering, metadata, and payload comparisons. |
| `config/template-sources.json` | Generated template-source input data | `config/template-sources.json` | network, filesystem I/O, developer workflow | build, interaction | Phases 2, 3 | source-text only | Detail pages and deploy modal/template-source paths need data-shape and payload audit. |
| `public/images/apps` | App Store app icon/image assets | `public/images/apps/**` | asset, filesystem I/O, developer workflow | build, page entry, deployment | Phases 2, 3, 6 | source-text only | Generated/downloaded app media affects build churn and browser image delivery. |

### Source Inventory Counts

| Surface | File Count |
|---------|------------|
| `app` | 264 |
| `components` | 80 |
| `new-components` | 29 |
| `config` | 8 |
| `content` | 2991 |
| `hooks` | 5 |
| `lib` | 16 |
| `scripts` | 5 |
| `public` | 396 |
| `assets` | 84 |
| `fonts` | 3 |
| `.github/workflows` | 5 |
| Combined required surfaces | 3886 |

Counts were collected with:

```bash
for d in app components new-components config content hooks lib scripts public assets fonts .github/workflows; do
  printf '%s ' "$d"
  rg --files "$d" 2>/dev/null | wc -l | tr -d ' '
  printf '\n'
done

rg --files app components new-components config content hooks lib scripts public assets fonts .github/workflows | wc -l | tr -d ' '
```

## Duplicate-Key Policy

Duplicate keys group repeated symptoms under the same root cause and remediation
path. Reuse a key when the mechanism is shared across files, routes, or
deployment targets. Create a route-local or module-local key when ownership,
root cause, and remediation direction are materially different.

| Duplicate Key | Shared Mechanism | Reuse Rule | Initial Evidence Pointers | Owner Phase |
|---------------|------------------|------------|---------------------------|-------------|
| `app-store-data-pipeline` | App Store generated JSON, runtime API conversion, loader caches, filters, detail pages, template sources, and deploy flow. | Use when root cause is shared app-template normalization, cache scope, payload behavior, or repeated data transformation. | `scripts/generate-apps-api.js`, `lib/api/apps-api.ts`, `config/apps-loader.ts`, `config/apps.json`, `config/template-sources.json`, `app/[lang]/products/app-store/**` | Phase 3 |
| `app-detail-remote-readme` | App detail README candidate discovery, remote fetch sequence, markdown normalization, full markdown rendering, and README media resolution. | Use when the root cause is specific to README candidate fetch fan-out, markdown size/render cost, or remote README media behavior. | `app/[lang]/products/app-store/[slug]/page.tsx`, `app/[lang]/products/app-store/[slug]/components/ReadmeMarkdownWindow.tsx`, `app/[lang]/products/app-store/[slug]/components/ReadmePreview.tsx` | Phase 3 |
| `remote-template-build-step` | Remote template ingestion and generated artifact writes in the production build path. | Use when root cause is generator/build coupling, serial remote fetches, icon downloads, JSON churn, or build-time network sensitivity. | `package.json`, `scripts/generate-apps-api.js`, `config/apps.json`, `config/template-sources.json`, `public/images/apps/**` | Phase 2 |
| `static-export-route-classification` | Static export deployment with API-like routes and generated endpoints. | Use when root cause is a mismatch or ambiguity between static artifact, runtime route handler, external-service-backed endpoint, and deployment-specific path. | `next.config.mjs`, `app/api/**/route.ts`, `app/rss.xml/route.ts`, `app/sitemap-index.xml/route.ts`, `app/sitemap.ts`, `app/sitemap-ai-faq.ts`, `app/llms.txt/route.ts`, `vercel.json`, `public/_redirects` | Phase 4 |
| `fumadocs-search-index` | Fumadocs loaders and localized content feeding search payloads, docs pages, and content discovery. | Use when root cause is search generation, payload growth, metadata-only relevance limits, content traversal, or language sharding. | `app/api/search/route.ts`, `components/docs/Search.tsx`, `lib/source.ts`, `source.config.ts`, `content/docs/**` | Phase 4 |
| `og-native-rendering` | Canvas, Sharp, font, and generated thumbnail image rendering paths. | Use when root cause is native rendering CPU, memory, cache keys, build/runtime variance, or static pre-generation opportunity. | `app/api/og/route.ts`, `lib/og-canvas.ts`, `app/api/blog/[lang]/[slug]/thumbnail/[format]/**`, `fonts/**`, `Dockerfile`, `package.json` | Phase 5 |
| `shared-auth-interaction-check` | Shared auth verification, auth modal email request/verification, and deploy/auth handoff checks. | Use when root cause is interaction-time network work before navigation, modal state, or deploy continuation. | `hooks/use-auth-redirect.ts`, `lib/utils/shared-auth.ts`, `new-components/AuthForm/**`, `new-components/DeployModal/**`, `config/site.ts` | Phase 5 |
| `turnstile-request-verification` | Abuse form Turnstile submission, process-local rate limiting, and Cloudflare siteverify request behavior. | Use when root cause is request-time external Turnstile verification, rate-limit map cleanup, or API route deployment variance. | `app/api/abuse/verify-turnstile/route.ts`, `app/[lang]/abuse/components/abuse-form.tsx`, `config/site.ts` | Phase 5 |
| `shared-layout-bundle-cost` | Locale layout providers, analytics, docs search, auth modal, deploy modal, header/footer, and route-wide client boundaries. | Use when root cause is shared shell bundle reach, hydration cost, globally mounted client surfaces, or third-party script baseline. | `app/[lang]/layout.tsx`, `components/analytics/**`, `components/docs/Search.tsx`, `new-components/AuthForm/**`, `new-components/DeployModal/**`, `new-components/Header.tsx` | Phase 6 |
| `visual-animation-loop-cost` | Route-local visual effects using Motion, Framer Motion, canvas loops, Matter.js physics, timers, and media modals. | Use when root cause is animation scheduling, physics, canvas drawing, iframe/video activation, or route-local visual hydration above the shared shell baseline. | `app/[lang]/(home)/(new-home)/**`, `new-components/GodRays.tsx`, `components/video.tsx` | Phase 6 |
| `static-export-asset-delivery` | Static-export image and asset delivery where browser transfer depends on source assets, unoptimized images, SVG policy, remote patterns, and host cache behavior. | Use when root cause is general cross-route static export asset delivery or image policy rather than App Store generated media shape. | `next.config.mjs`, `public/**`, `assets/**`, `fonts/**` | Phase 6 |
| `customer-interaction-scheduling` | Customer page filter, testimonial, table-of-contents, markdown, scroll, resize, timer, and rAF scheduling. | Use when root cause is customer-route interaction scheduling and markdown/filter work above the shared shell baseline. | `app/[lang]/customers/**` | Phase 6 |
| `deployment-command-parity` | Build, install, environment, static export, serving, redirects, headers, cache, route support, and native dependency behavior differ across Vercel, Cloudflare Pages, Docker/Nginx, GHCR, and Kubernetes paths. | Use when root cause is deployment-target command/config parity across CI, static export hosts, image build, and runtime serving. | `.github/workflows/deploy.yml`, `.github/workflows/preview.yml`, `.github/workflows/deploy-cloudflare.yml`, `.github/workflows/preview-cloudflare.yml`, `.github/workflows/build-image.yml`, `Dockerfile`, `vercel.json`, `public/_headers`, `public/_redirects`, `next.config.mjs`, `package.json` | Phase 7 |
| `next-package-version-alignment` | Next runtime, `@next/*` tooling, MDX integration, analyzer behavior, and lockfile exact versions are aligned through package and lockfile evidence rather than semver ranges alone. | Use when root cause is version alignment evidence for Next, `@next/bundle-analyzer`, `@next/mdx`, MDX/Fumadocs packages, static export config, analyzer reliability, or build/deployment variance. | `package.json`, `package-lock.json`, `.nvmrc`, `next.config.mjs` | Phase 7 |

## Seed Candidate Notes

These are seed audit notes from `.planning/codebase/CONCERNS.md` and
`.planning/research/*`. They are not detailed findings yet. Later phases should
promote, merge, dismiss, or replace them with measured evidence.

| Seed ID | Status | Duplicate Key | Module Boundary | Evidence Paths | Work Type | Execution Timing | Candidate Reason | Validation Coverage | Later Owner |
|---------|--------|---------------|-----------------|----------------|-----------|------------------|------------------|---------------------|-------------|
| SEED-01 | candidate | `remote-template-build-step` | `scripts`, `package.json`, `config/apps.json`, `config/template-sources.json`, `public/images/apps` | `package.json`, `scripts/generate-apps-api.js`, `config/apps.json`, `config/template-sources.json`, `public/images/apps/**` | network, filesystem I/O, developer workflow | build, CI, Docker | `npm run build` includes app generation; the generator fetches remote templates, downloads icons, fetches template sources, and writes generated artifacts. | source-text only | Phase 2 |
| SEED-02 | candidate | `app-store-data-pipeline` | `config`, `lib`, `app/[lang]`, `components` | `scripts/generate-apps-api.js`, `lib/api/apps-api.ts`, `config/apps-loader.ts`, `config/apps.ts`, `components/app-store/app-grid.tsx` | CPU, network, hydration | static generation, request, interaction | Static generator, runtime API conversion, loader fallback, and UI filtering share App Store concepts that need one data-subsystem audit. | source-text only | Phase 3 |
| SEED-03 | candidate | `fumadocs-search-index` | `app/api`, `lib`, `content`, `components` | `app/api/search/route.ts`, `lib/source.ts`, `content/docs/**`, `components/docs/Search.tsx` | CPU, filesystem I/O, bundle | static generation, request, page entry | Search currently indexes metadata-oriented content; full-body search would increase payload and build/runtime work. | source-text only | Phase 4 |
| SEED-04 | candidate | `og-native-rendering` | `app/api`, `lib`, `fonts`, `Dockerfile` | `app/api/og/route.ts`, `lib/og-canvas.ts`, `fonts/**`, `package.json`, `Dockerfile` | CPU, native rendering, asset | request, Docker, deployment | OG generation uses native image tooling and should be audited for CPU cost, cache behavior, and deployment variance. | source-text only | Phase 5 |
| SEED-05 | candidate | `shared-layout-bundle-cost` | `app/[lang]`, `components`, `new-components`, `hooks` | `app/[lang]/layout.tsx`, `components/analytics/**`, `components/docs/Search.tsx`, `new-components/AuthForm/**`, `new-components/DeployModal/**`, `new-components/Header.tsx`, `hooks/**` | bundle, hydration, network | page entry, interaction | The localized shell mounts global providers and client surfaces that every public route may pay for. | source-text only | Phase 6 |
| SEED-06 | candidate | `static-export-route-classification` | `app`, `next.config.mjs`, `vercel.json`, `.github/workflows` | `next.config.mjs`, `app/api/**/route.ts`, `app/rss.xml/route.ts`, `app/sitemap-index.xml/route.ts`, `app/llms.txt/route.ts`, `vercel.json`, `public/_redirects`, `.github/workflows/**` | developer workflow, CPU, deployment | static generation, request, deployment | Production static export and API-like route handlers require route classification by hosting target before severity is assigned. | source-text only | Phase 4 |

## Phase 1 Validation

Phase 1 validation proves the ledger exists, required schema fields are present,
required repository surfaces are represented, and duplicate keys are documented.
It uses local source checks only. Network-heavy, Docker, analyzer, route timing,
and browser trace commands belong to later phases.

### Validation Commands

```bash
test -f docs/performance-audit.md

node -e "const fs=require('fs'); const s=fs.readFileSync('docs/performance-audit.md','utf8'); for (const token of ['Audit Status','Finding Schema','status','severity','phase','files','entry point','module boundary','work type','execution timing','evidence','root cause','impact','remediation direction','validation coverage','duplicate key','dismissal rationale','candidate','confirmed','dismissed','deferred','tested','source-text only','typecheck only','manual only','unvalidated']) { if (!s.includes(token)) throw new Error('missing '+token); }"

node -e "const fs=require('fs'); const s=fs.readFileSync('docs/performance-audit.md','utf8'); const surfaces=['app','app/[lang]','app/api','components','new-components','config','content','hooks','lib','scripts','public','assets','fonts','.github/workflows','Dockerfile','vercel.json','next.config.mjs','package.json','config/apps.json','config/template-sources.json','public/images/apps']; for (const token of surfaces) { if (!s.includes(token)) throw new Error('missing surface '+token); } const keys=['app-store-data-pipeline','remote-template-build-step','static-export-route-classification','fumadocs-search-index','og-native-rendering','shared-layout-bundle-cost']; for (const token of keys) { if (!s.includes(token)) throw new Error('missing duplicate key '+token); }"

for surface_path in app components new-components config content hooks lib scripts public assets fonts .github/workflows Dockerfile vercel.json next.config.mjs package.json config/apps.json config/template-sources.json public/images/apps; do
  test -e "$surface_path" || { echo "missing expected repo surface: $surface_path"; exit 1; }
done

node -e "const fs=require('fs'); const s=fs.readFileSync('docs/performance-audit.md','utf8'); for (const token of ['Phase 1 Validation','rg --files','file existence','schema','Module Inventory','Duplicate-Key Policy']) { if (!s.includes(token)) throw new Error('missing validation token '+token); }"

count=$(rg --files app components new-components config content hooks lib scripts public assets fonts .github/workflows | wc -l | tr -d ' ')
test "$count" -ge 100

test -f .planning/phases/01-audit-ledger-and-module-inventory/01-01-SUMMARY.md
```

### Validation Log

| Check | Result | Evidence |
|-------|--------|----------|
| File existence | Passed on 2026-06-11 | `test -f docs/performance-audit.md` |
| Schema fields and vocabulary | Passed on 2026-06-11 | Node token check for required fields, status values, and validation values |
| Inventory surface tokens | Passed on 2026-06-11 | Node token check for required repository surfaces |
| Repository surface existence | Passed on 2026-06-11 | Shell `test -e` loop over required paths |
| Duplicate-key registry tokens | Passed on 2026-06-11 | Node token check for six initial duplicate keys |
| Source inventory breadth | Passed on 2026-06-11 | `rg --files` count gate returned `3886`, above threshold `>= 100` |
| Summary existence | Passed on 2026-06-11 | `test -f .planning/phases/01-audit-ledger-and-module-inventory/01-01-SUMMARY.md` |

## Phase 2: Build-Time App Catalog Pipeline

Phase 2 promotes the `remote-template-build-step` seed into source-grounded
build-time findings for APPPIPE-01 and APPPIPE-02. This phase covers the
generator, generated snapshots, build command coupling, and CI/Docker command
surfaces. Runtime App Store loader, API conversion, README rendering, filters,
detail pages, and deploy modal behavior remain Phase 3 `app-store-data-pipeline`
work.

### Phase 2 Source Audit

| Subpath | Files | Evidence | Performance Reason | Validation Coverage | Duplicate Key |
|---------|-------|----------|--------------------|---------------------|---------------|
| Template list fetch | `scripts/generate-apps-api.js` | `fetchTemplates()` calls `https://template.os.sealos.io/api/listTemplate` with `fetch()` and validates the API response before returning templates. See `scripts/generate-apps-api.js:19-22` and `scripts/generate-apps-api.js:56-76`. | The build depends on an external network list before local app data can be refreshed. | source-text only | `remote-template-build-step` |
| Serial template processing | `scripts/generate-apps-api.js` | `processTemplates()` loops with `for (const template of templates)`, awaits `convertTemplateToAppConfig()`, then awaits `fetchTemplateSource()` per accepted app. See `scripts/generate-apps-api.js:467-556`. | Per-template conversion, icon handling, and source fetches are serialized, so total build time scales with accepted template count and remote latency. | source-text only | `remote-template-build-step` |
| Icon download and shell call | `scripts/generate-apps-api.js` | `convertTemplateToAppConfig()` awaits `downloadIcon()`, and `downloadIcon()` shells out with `execSync('curl ...')` using a 10000 ms timeout. See `scripts/generate-apps-api.js:199-203` and `scripts/generate-apps-api.js:366-403`. | Each non-default icon can add a blocking shell call, network transfer, filesystem write, and per-icon timeout ceiling. | source-text only | `remote-template-build-step` |
| Template-source fetch | `scripts/generate-apps-api.js` | `fetchTemplateSource()` calls `https://template.usw-1.sealos.io/api/getTemplateSource?templateName=...`; successful responses are reduced to input arrays through `extractTemplateSourceInputs()`. See `scripts/generate-apps-api.js:409-449` and `scripts/generate-apps-api.js:534-548`. | A second remote endpoint is queried per accepted app, adding serial build-time network work and generated-data variance. | source-text only | `remote-template-build-step` |
| Clean mode image churn | `scripts/generate-apps-api.js` | `--clean` triggers `cleanImagesDirectory()`, which removes and recreates `public/images/apps`. See `scripts/generate-apps-api.js:477-487` and `scripts/generate-apps-api.js:452-461`. | Clean generation can recreate the app image directory and create large generated asset diffs. | source-text only | `remote-template-build-step` |
| Generated JSON writes | `scripts/generate-apps-api.js`, `config/apps.json`, `config/template-sources.json` | The generator sorts app configs and writes `config/apps.json` plus `config/template-sources.json` with `fs.writeFileSync()`. See `scripts/generate-apps-api.js:558-576`. | Each refresh can rewrite generated snapshots, which affects build artifacts, review diffs, and downstream App Store data truth. | source-text only | `remote-template-build-step` |
| List-fetch network failure | `scripts/generate-apps-api.js` | Recognized network failures in `fetchTemplates()` are detected by `isNetworkError()` and cause `processTemplates()` to keep existing config by returning early. See `scripts/generate-apps-api.js:30-51` and `scripts/generate-apps-api.js:489-500`. | Network outages can silently retain prior generated snapshots, making build success distinct from data freshness. | source-text only | `remote-template-build-step` |
| Per-template source failure | `scripts/generate-apps-api.js`, `config/template-sources.json` | `fetchTemplateSource()` returns `null` on error; the caller writes an empty input array for that app and increments `sourceFailedCount`. See `scripts/generate-apps-api.js:429-435` and `scripts/generate-apps-api.js:545-548`. | Partial source failures preserve the build path while degrading generated template input completeness. | source-text only | `remote-template-build-step` |

### Build Coupling And Timing Categories

| Category | Command Surface | Files | Evidence | Phase 2 Classification | Validation Coverage |
|----------|-----------------|-------|----------|------------------------|---------------------|
| `npm run generate-apps` | Local generator refresh | `package.json`, `scripts/generate-apps-api.js` | `package.json:12` maps `generate-apps` to `node scripts/generate-apps-api.js`. | Remote template list fetch, serial per-app source fetches, icon downloads, generated JSON writes, and app image writes. | source-text only |
| `next build` | Local production build | `package.json` | `package.json:7` runs `npm run generate-apps && next build && node scripts/normalize-root-locale.js`. | Aggregate build category containing generator, Next static export, and export normalization. | source-text only |
| `npm run build:analyze` | Analyzer build | `package.json` | `package.json:8` runs `npm run generate-apps && ANALYZE=true next build && node scripts/normalize-root-locale.js`. | Analyzer timing includes the same remote generator pre-step; bundle interpretation belongs to Phase 6. | source-text only |
| Export normalization | Static export post-processing | `scripts/normalize-root-locale.js` | The script copies entries from `out/en` to `out` with `fs.cp()` after checking output directories. See `scripts/normalize-root-locale.js:23-50`. | Filesystem I/O after Next export, separate from generator and Next build work. | source-text only |
| Docker build | Docker builder | `Dockerfile` | The builder installs native/system dependencies, runs image path replacement, then runs `npm ci && npm run build`. See `Dockerfile:1-35`. | Docker timing includes package install, image path replacement, generator, Next build, and normalization. | source-text only |
| CI build | Cloudflare and Vercel workflows | `.github/workflows/deploy-cloudflare.yml`, `.github/workflows/preview-cloudflare.yml`, `.github/workflows/deploy.yml`, `.github/workflows/preview.yml` | Cloudflare workflows run `npm ci` and `npm run build`; Vercel workflows install dependencies and run `vercel build`. See `.github/workflows/deploy-cloudflare.yml:44-59`, `.github/workflows/preview-cloudflare.yml:184-192`, `.github/workflows/deploy.yml:32-43`, and `.github/workflows/preview.yml:40-48`. | CI cost splits by hosting path; Cloudflare follows local static export build, while Vercel build behavior is hosted-tooling dependent. | source-text only |
| Deployment update | Docker image publish and Kubernetes image update | `.github/workflows/build-image.yml` | Docker image build uses `docker/build-push-action@v5`, then `kubectl` updates and annotates `deployment/sealos-docs`. See `.github/workflows/build-image.yml:56-89`. | Deployment update inherits Docker build artifact timing and adds downstream rollout steps. Full deployment parity belongs to Phase 7. | source-text only |

### Generated Snapshot Baseline

These counts are read-only local snapshot evidence collected on 2026-06-11.
They are a baseline for generated artifact churn and APPPIPE-02 category
separation. They are not remote refresh results.

| Artifact | Metric | Value | Command | Validation Coverage |
|----------|--------|-------|---------|---------------------|
| `config/apps.json` | Bytes | 203,676 | `wc -c config/apps.json config/template-sources.json` | source-text only |
| `config/template-sources.json` | Bytes | 71,833 | `wc -c config/apps.json config/template-sources.json` | source-text only |
| `config/apps.json` | App records | 150 | `node -e "const fs=require('fs'); console.log(JSON.parse(fs.readFileSync('config/apps.json','utf8')).length)"` | source-text only |
| `config/template-sources.json` | Template-source keys | 150 | `node -e "const fs=require('fs'); console.log(Object.keys(JSON.parse(fs.readFileSync('config/template-sources.json','utf8'))).length)"` | source-text only |
| `public/images/apps` | Files | 210 | `find public/images/apps -type f \| wc -l \| tr -d ' '` | source-text only |
| `public/images/apps` | Total bytes | 4,219,013 | `find public/images/apps -type f -print0 \| xargs -0 stat -f %z \| awk '{s+=$1} END{print s+0}'` | source-text only |

### Phase 2 Findings

| ID | status | severity | phase | files | entry point | module boundary | work type | execution timing | evidence | root cause | impact | remediation direction | validation coverage | duplicate key | dismissal rationale |
|----|--------|----------|-------|-------|-------------|-----------------|-----------|------------------|----------|------------|--------|-----------------------|---------------------|---------------|---------------------|
| PERF-201 | candidate | high | 2 | `package.json`, `scripts/generate-apps-api.js`, `scripts/normalize-root-locale.js` | `npm run build`, `npm run build:analyze` | `package.json`, `scripts` | network, filesystem I/O, developer workflow | build, CI, Docker | `package.json:7-13` wires `build` and `build:analyze` through `npm run generate-apps` before Next build/analyzer work; generator evidence is in `scripts/generate-apps-api.js:56-76`, `scripts/generate-apps-api.js:467-576`. | Production and analyzer builds are coupled to remote template ingestion and generated snapshot writes. | Build-time and CI latency can vary with remote API latency and generated data freshness; analyzer timing includes generator work. | Split remote catalog refresh from routine build/analyzer commands or make refresh an explicit guarded step with snapshot reuse for ordinary builds. | source-text only | `remote-template-build-step` | n/a |
| PERF-202 | candidate | high | 2 | `scripts/generate-apps-api.js` | `node scripts/generate-apps-api.js` | `scripts` | network, filesystem I/O, developer workflow | build, CI, Docker | `processTemplates()` uses a serial `for (const template of templates)` loop and awaits app conversion plus template-source fetch per accepted app. See `scripts/generate-apps-api.js:518-548`. | Per-template network and filesystem work is serialized. | Total generator time can grow linearly with template count, icon latency, and template-source endpoint latency. | Use bounded concurrency, caching, and per-stage timing around list fetch, icon downloads, source fetches, and JSON writes in a later fix phase. | source-text only | `remote-template-build-step` | n/a |
| PERF-203 | candidate | medium | 2 | `scripts/generate-apps-api.js`, `public/images/apps` | `downloadIcon()` | `scripts`, `public/images/apps` | network, filesystem I/O, developer workflow | build, CI, Docker | `downloadIcon()` shells out to `curl` via `execSync()` with a 10000 ms timeout and writes downloaded files under `public/images/apps`. See `scripts/generate-apps-api.js:366-403`; current image snapshot has 210 files totaling 4,219,013 bytes. | Blocking per-icon shell downloads are part of catalog generation. | Slow or unreachable icon URLs can delay generation up to the per-icon timeout ceiling and create asset churn in the generated image directory. | Replace blocking shell downloads with a bounded async downloader, content-addressed or slug-stable cache checks, and diff-aware asset writes in a later fix phase. | source-text only | `remote-template-build-step` | n/a |
| PERF-204 | candidate | medium | 2 | `scripts/generate-apps-api.js`, `config/apps.json`, `config/template-sources.json`, `public/images/apps` | `npm run generate-apps`, `npm run generate-apps:clean` | `scripts`, `config/apps.json`, `config/template-sources.json`, `public/images/apps` | filesystem I/O, developer workflow, asset | build, CI, Docker | The generator writes 203,676 bytes to `config/apps.json`, 71,833 bytes to `config/template-sources.json`, and clean mode removes/recreates `public/images/apps`. See `scripts/generate-apps-api.js:452-461` and `scripts/generate-apps-api.js:568-576`. | Generated app snapshots and app images are refreshed as build inputs. | Remote data changes can create review churn and deployment artifact differences beyond application source changes. | Add guarded refresh policy, generated diff review, stable sort/write behavior checks, and snapshot freshness metadata in later fix planning. | source-text only | `remote-template-build-step` | n/a |

### Skipped Optional Timing

| Measurement | Status | Reason | Guard For Future Manual Run | Validation Coverage |
|-------------|--------|--------|-----------------------------|---------------------|
| `time npm run generate-apps` | skipped | It can call remote template APIs, download icons, and rewrite `config/apps.json`, `config/template-sources.json`, or `public/images/apps`. | Capture `git status --short`, then `git diff --stat -- config/apps.json config/template-sources.json public/images/apps` before and after the timing command. | manual only |
| `time npm run build` | skipped | It includes `npm run generate-apps`, `next build`, and root export normalization, so it can refresh generated artifacts before measuring Next work. | Use the generated-file guard above and record whether `out/` is created or modified. | manual only |
| `time npm run build:analyze` | skipped | It includes `npm run generate-apps` before analyzer output; bundle interpretation belongs to Phase 6. | Use the generated-file guard above and store analyzer output only as Phase 6 evidence. | manual only |
| `docker build .` | skipped | Docker is unavailable in this local shell, and the Dockerfile path includes package install plus `npm run build`. | Run in a Docker-capable environment with build cache state and generated-file diff notes. | unvalidated |
| `npm run generate-apps:clean` | skipped | Clean mode removes and recreates `public/images/apps`. | Use only behind an explicit generated-asset churn validation task. | manual only |

### Phase 8 Remediation Trace

Phase 8 converts `remote-template-build-step` from report-only evidence into
guarded build-pipeline controls. Ordinary `npm run build` and
`npm run build:analyze` now consume committed App Store snapshots. Remote
template work lives behind explicit App Store refresh commands, generated
snapshot review lives behind `npm run app-store:diff`, and stage timing lives
behind `scripts/measure-build-pipeline.js`.

| Finding | Phase 8 Evidence | Validation Coverage |
|---------|------------------|---------------------|
| PERF-201 | `package.json` separates `build` and `build:analyze` from `scripts/generate-apps-api.js`; explicit refresh remains available through `app-store:refresh` and compatibility `generate-apps` aliases. | `node --test scripts/generate-apps-api.test.mjs`; package script parser check |
| PERF-202 | `scripts/generate-apps-api.js` adds `runLimited()` with default concurrency 6 for accepted template processing and template-source fetches. | `runLimited()` concurrency/order test; source failure shape test |
| PERF-203 | Icon handling uses async fetch with timeout, cache-hit reuse, temp-file rename, and failure accounting instead of shelling out to `curl`. | cache-hit test; icon failure fallback test |
| PERF-204 | Generated snapshot mutation is explicit refresh-only, and `scripts/check-generated-app-assets.js` validates `config/apps.json`, `config/template-sources.json`, and `public/images/apps` before and after refresh/build/analyzer workflows. | `node --test scripts/check-generated-app-assets.test.mjs`; `npm run app-store:diff` |
| PERF-505 | The high-impact generator path is now split from ordinary builds, bounded for remote fan-out, and measurable as a separate refresh stage. | `node --test scripts/measure-build-pipeline.test.mjs`; gated live refresh timing |
| PERF-701 | Deployment parity remains a later phase boundary; Phase 8 gives deployment validation a snapshot-only build command and generated diff guard as prerequisites. | protected-scope diff check excludes deployment files |
| PERF-702 | Timing output records Node, npm, lockfile version, and locked package versions, with caveats when active Node major differs from `.nvmrc` or `node_modules` is absent. | gated Node 20 locked-dependency build/analyzer timing |

### Phase 9 Remediation Trace

Phase 9 converts `deployment-command-parity` from report-only evidence into a
maintained deployment checklist and deterministic guard foundation. The new
default validation path stays source/static-output based and keeps unsafe
network, deploy, Docker, browser, hosted-preview, external-service, and
generated-mutation checks behind explicit environment gates.

| Finding | Phase 9 Evidence | Validation Coverage |
|---------|------------------|---------------------|
| PERF-701 | `docs/deployment-parity.md` compares Vercel production, Vercel preview, Cloudflare Pages production, Cloudflare Pages preview, Docker/Nginx, and GHCR/Kubernetes across install, build, runtime, env, artifact, output, serving, redirect, header, cache, route-support, native, secret, and validation dimensions. `scripts/check-deployment-parity.js` validates checklist tokens, deployment source facts, package script wiring, and closed unsafe gate defaults. | `node --test scripts/check-deployment-parity.test.mjs`; `npm run deployment:check` |
| PERF-702 | `scripts/check-deployment-parity.js` exposes a locked-validation planner for `PHASE9_RUN_LOCKED_BUILD=1` that requires Node 20 from `.nvmrc`, installed `node_modules`, `npm run lint`, `npm run build:timed`, `npm run build:analyze:timed`, and generated diff guards around mutation-capable stages. | gated Node 20 locked-dependency build/analyzer validation; default local caveat when Node major or dependencies are unavailable |
| PERF-406 | `scripts/check-static-output.js` validates static-export prerequisites by parsing `next.config.mjs`, `vercel.json`, `public/_headers`, and `public/_redirects`, and by inspecting `out` artifacts when present. Route behavior and generated endpoint policy remain Phase 10 scope. | `node --test scripts/check-static-output.test.mjs`; `npm run static-output:check` |
| PERF-501 | `scripts/smoke-docker-nginx.js` adds an optional `PHASE9_RUN_DOCKER_SMOKE=1` disposable Docker/Nginx smoke path that verifies Dockerfile static-output copy assumptions before later native renderer policy work. Native rendering behavior remains Phase 12 scope. | `node --test scripts/smoke-docker-nginx.test.mjs`; gated Docker smoke |
| PERF-502 | Docker smoke prerequisites now cover the static serving boundary that thumbnail and OG native-rendering fixes must respect. Blog thumbnail pre-generation and renderer timing remain Phase 12 scope. | gated Docker smoke |
| PERF-605 | `scripts/check-static-output.js` compares immutable header/cache parity for `/mtc.js` and `/api/script.js` across Vercel and Cloudflare sources, while `scripts/smoke-docker-nginx.js` defines representative static asset probes for Docker/Nginx. Asset budgets and conversion work remain later owner scope. | `npm run static-output:check`; gated Docker smoke |

### Phase 12 Remediation Trace

Phase 12 converts `og-native-rendering` from report-only native image evidence
into a source-owned policy, shared renderer helper contract, local fixture
benchmark gate, static artifact alignment checks, and Docker/native guard
composition. Final fixed/validated/remaining audit status closeout remains
Phase 13 scope.

| Finding | Phase 12 Evidence | Validation Coverage |
|---------|-------------------|---------------------|
| PERF-501 | `/api/og` now has policy rows for deterministic `public/generated/native-images` source artifacts, `out/generated/native-images` static export artifacts, cache-key dimensions, runtime `public, max-age=86400`, versioned immutable static artifact semantics, shared OG render helpers, and Dockerfile native dependency token checks. | `npm run native-rendering:check`; `npm run native-rendering:benchmark`; `npm run docker:smoke`; open-gate `BLOCKED` wrappers |
| PERF-502 | Blog thumbnail SVG/PNG surfaces now have policy rows for pre-generated formats, shared format/static-param/render helpers, exact font and background fixture byte contracts, fixture benchmark rows, static artifact status reporting, and route-policy ownership alignment. | `node --test scripts/check-native-rendering-policy.test.mjs scripts/benchmark-native-rendering.test.mjs`; `npm run static-routes:check`; `npm run static-output:check` |
| PERF-701 | Deployment validation now composes native rendering source checks with Phase 9 safe validation, and Docker smoke checks Node 20/native package assumptions plus `native-rendering:check` and the gated benchmark command when `PHASE9_RUN_DOCKER_SMOKE=1` is opened. | `npm run validate:deployment`; `node --test scripts/check-deployment-parity.test.mjs scripts/smoke-docker-nginx.test.mjs` |

NATIVE-01 is covered by the source-owned policy, cache-key helpers, and route
adapters. NATIVE-02 is covered by the local fixture benchmark gate and injected
renderer tests. NATIVE-03 is covered by Dockerfile native library token checks,
package/font policy validation, deployment guard composition, static artifact
status reporting, and fail-closed Docker/native wrappers.

### Phase 10 Remediation Trace

Phase 10 converts `static-export-route-classification` from route inventory
evidence into a source-owned policy and guard. `config/static-export-route-policy.json`
records route rows, classification labels, supported deployment behavior, budget
owners, validation commands, and ROUTEFIX/PERF trace IDs. `docs/static-export-route-policy.md`
mirrors the same policy for human review. `scripts/check-static-export-routes.js`
validates policy drift, source files, artifact path containment, generated
artifact budgets, documented robots behavior, and hosted probe gating. Phase 9
deployment validation now reaches Phase 10 through `npm run static-output:check`
and also requires the standalone `static-routes:check` package script.

| Finding | Phase 10 Evidence | Validation Coverage |
|---------|-------------------|---------------------|
| PERF-401 | `/api/search` is classified as `static artifact via route handler` with `search-index` ownership and a 1000-record / 1048576-byte budget, preserving `fumadocs-search-index` traceability. | `node --test scripts/check-static-export-routes.test.mjs`; `npm run static-routes:check` |
| PERF-402 | `/llms.txt` is classified as `static artifact via route handler` with `llms` ownership and a 500-source-doc / 2097152-byte budget over the generated text artifact. | `node --test scripts/check-static-export-routes.test.mjs`; `npm run static-output:check` |
| PERF-404 | Main sitemap and AI FAQ sitemap rows are first-class static artifacts with 5000-URL / 2097152-byte budgets per artifact. | `npm run static-routes:check` |
| PERF-406 | Route policy covers sitemap, AI FAQ sitemap, RSS, sitemap index, `llms.txt`, search, robots, `/api/apps`, OG, blog thumbnails, and Turnstile verification with explicit labels for static, deployment-supported, API-like fallback, runtime native, and external-service-backed behavior. | `node --test scripts/check-static-export-routes.test.mjs scripts/check-static-output.test.mjs scripts/check-deployment-parity.test.mjs` |
| PERF-503 | `llms.txt` direct docs traversal now has an enforceable static output budget and remains traced to `static-export-route-classification`. | `npm run static-routes:check` |

ROUTEFIX-01 is covered by the route policy map. ROUTEFIX-02 is covered by
static artifact or documented deployment-supported behavior for generated
SEO/search/text outputs. ROUTEFIX-03 is covered by sitemap, search, and
`llms.txt` byte/count budgets. ROUTEFIX-04 is covered by Phase 9 composition,
missing-`out` caveat semantics, and the gated hosted probe contract.

Deployment target comparison, Docker smoke policy, Node locked-build
orchestration, shared shell bundle/hydration, native OG/blog thumbnail rendering
policy, analytics/auth/deploy loading, and browser trace closeout remain with
their owner phases.

## Phase 2 Validation

Phase 2 validation uses source scans, local snapshot counts, report token checks,
and the existing offline generator conversion test. Remote refresh, build,
analyzer, Docker, and clean-mode timing are recorded as skipped optional
evidence above.

### Validation Commands

```bash
rg -n "fetch\(|execSync|writeFileSync|rmSync|for \(const template|curl|timeout" scripts/generate-apps-api.js

rg -n "generate-apps|build:analyze|normalize-root-locale|npm ci|vercel build|docker/build-push|kubectl" package.json scripts/normalize-root-locale.js Dockerfile .github/workflows/*.yml

wc -c config/apps.json config/template-sources.json

find public/images/apps -type f | wc -l | tr -d ' '

find public/images/apps -type f -print0 | xargs -0 stat -f %z | awk '{s+=$1} END{print s+0}'

node -e "const fs=require('fs'); console.log(JSON.parse(fs.readFileSync('config/apps.json','utf8')).length)"

node -e "const fs=require('fs'); console.log(Object.keys(JSON.parse(fs.readFileSync('config/template-sources.json','utf8'))).length)"

node --test scripts/generate-apps-api.test.mjs

node -e "const fs=require('fs'); const s=fs.readFileSync('docs/performance-audit.md','utf8'); for (const token of ['remote-template-build-step','APPPIPE-01','APPPIPE-02','scripts/generate-apps-api.js','package.json','config/apps.json','config/template-sources.json','public/images/apps','source-text only','Phase 2 Validation']) { if (!s.includes(token)) throw new Error('missing '+token); }"
```

### Validation Log

| Check | Result | Evidence |
|-------|--------|----------|
| Generator source evidence scan | Passed on 2026-06-11 | `rg -n "fetch\(|execSync|writeFileSync|rmSync|for \(const template|curl|timeout" scripts/generate-apps-api.js` returned fetch calls, `execSync`, curl timeout, `rmSync`, serial loop, and JSON writes. |
| Build coupling source scan | Passed on 2026-06-11 | `rg -n "generate-apps|build:analyze|normalize-root-locale|npm ci|vercel build|docker/build-push|kubectl" package.json scripts/normalize-root-locale.js Dockerfile .github/workflows/*.yml` returned local scripts, Docker build, Cloudflare build, Vercel build, Docker build-push, and kubectl update surfaces. |
| Generated snapshot baseline | Passed on 2026-06-11 | `config/apps.json` 203,676 bytes and 150 records; `config/template-sources.json` 71,833 bytes and 150 keys; `public/images/apps` 210 files and 4,219,013 bytes. |
| Offline generator test | Passed on 2026-06-11 | `node --test scripts/generate-apps-api.test.mjs` passed 3 tests in 31.298875 ms. |
| Report contract token check | Passed on 2026-06-11 | Node token checks passed for APPPIPE-01, APPPIPE-02, `remote-template-build-step`, evidence paths, coverage labels, and Phase 2 validation. |

## Phase 3: App Store Runtime and Static Data Path

Phase 3 promotes the `app-store-data-pipeline` seed into a user-facing App
Store subsystem audit for APPPIPE-03, APPPIPE-04, and APPPIPE-05. This phase
covers committed static snapshots, runtime API conversion, loader caches,
fallback behavior, index/detail pages, filtering and sorting, README fetch and
markdown render behavior, screenshots, icons, template-source lookup, and deploy
modal flow. It also adds the route-local `app-detail-remote-readme` key for
README-specific fetch/render findings.

### Phase 3 Source Audit

| Subpath | Files | Evidence | Performance Reason | Validation Coverage | Duplicate Key |
|---------|-------|----------|--------------------|---------------------|---------------|
| Static catalog snapshot | `config/apps.json`, `config/apps.ts` | The committed snapshot has 150 app records and `appsConfig` maps that JSON into synchronous runtime data. `config/apps.ts` exposes `appsConfig`, lookup helpers, category helpers, and `getTemplateName()`. | The static payload is the source of truth for page rendering, sitemap entries, detail route params, SEO metadata, and deploy identity on the static path. | local counts, tested | `app-store-data-pipeline` |
| Template-source snapshot | `config/template-sources.json`, `hooks/use-template-source.ts` | The committed template-source snapshot has 150 keys and 297 input definitions; the hook imports it before considering a remote fallback. See `hooks/use-template-source.ts:5` and `hooks/use-template-source.ts:113-135`. | Deploy clicks depend on this client-loaded data before the modal can decide between a form, auth flow, redirect, or error state. | local counts, source-text only | `app-store-data-pipeline` |
| Loader caches and deploy URLs | `config/apps-loader.ts` | `categoryCache`, `allAppsCache`, `dynamicAppsCache`, `lastDynamicFetch`, and `DYNAMIC_CACHE_TTL = 5 * 60 * 1000` are module-level state; `loadStaticApps()` adds `deployUrl` through `getDeployUrl(getTemplateName(app))`. See `config/apps-loader.ts:33-42`, `config/apps-loader.ts:115-122`, and `config/apps-loader.ts:136-150`. | The same app list can be reused as static, dynamic, category-filtered, or browser-session data with different freshness and fallback semantics. | source-text only | `app-store-data-pipeline` |
| Runtime `/api/apps` conversion | `lib/api/apps-api.ts`, `app/api/apps/[[...lang]]/route.ts` | The route delegates to `handleAppsRequest(lang)`, which fetches the remote template API, converts records, sorts by deploy count/name, and returns fallback static apps on error. See `lib/api/apps-api.ts:185-223`, `lib/api/apps-api.ts:231-276`, and `lib/api/apps-api.ts:283-315`. | Runtime conversion duplicates App Store normalization while emitting a different shape from the committed snapshot. | source-text only | `app-store-data-pipeline` |
| Static index page | `app/[lang]/products/app-store/page.tsx`, `app/[lang]/products/app-store/components/app-store-content.tsx`, `components/app-store/app-grid.tsx` | The page imports `appsConfig`, passes it to page SEO, hero/showcase/grid composition, and the client grid. The grid computes category counts and visible rows with `useMemo()`. See `app/[lang]/products/app-store/page.tsx:14-90`, `app-store-content.tsx:4-31`, and `components/app-store/app-grid.tsx:200-239`. | Every App Store index visit pays for rendering the static app list, screenshot cards, category counts, filtering, sorting, and pagination state. | tested for grid source-text checks; source-text only for cost | `app-store-data-pipeline` |
| Browser filtering and sorting | `app/[lang]/products/app-store/components/app-store-browser-utils.ts`, `components/app-store/app-grid.tsx` | `getCategoryCounts()` and `getVisibleApps()` are called from the client grid; `getVisibleApps()` filters by query/category, sorts, clamps pagination, and slices results. | The work is repeated per query/category/sort/page change and scales with the full app list currently counted at 150 records. | source-text only; utility test gap recorded | `app-store-data-pipeline` |
| Detail page and related data | `app/[lang]/products/app-store/[slug]/page.tsx`, `app/[lang]/products/app-store/[slug]/components/app-detail-utils.ts` | `generateStaticParams()` expands canonical and legacy slugs from `loadAllApps()`, the page uses `getAppBySlug()`, `appsConfig`, `getRelatedApps()`, and `loadReadmeMarkdown(app)`. See `page.tsx:50-60` and `page.tsx:86-100`. | Static params, metadata, related templates, README fetches, and detail render work all depend on the same static app record shape. | tested for detail source-text checks; source-text only for cost | `app-store-data-pipeline` |
| README candidate fetch and render | `app/[lang]/products/app-store/[slug]/components/ReadmeMarkdownWindow.tsx`, `app/[lang]/products/app-store/[slug]/components/ReadmePreview.tsx` | `fetchReadme()` iterates candidate URLs with `cache: 'force-cache'`, reads the full response text, normalizes markdown, and `ReactMarkdown` renders the whole string with `remark-gfm`. See `ReadmeMarkdownWindow.tsx:289-310` and `ReadmeMarkdownWindow.tsx:397-508`. | Detail pages can pay remote candidate fetch latency and full markdown render cost before the README preview is available. | source-text only | `app-detail-remote-readme` |
| Screenshots, icons, and media | `components/app-store/app-grid.tsx`, `app/[lang]/products/app-store/[slug]/components/AppPreviewPanel.tsx`, `app/[lang]/products/app-store/[slug]/components/Screenshots.tsx`, `components/ui/app-icon.tsx`, `next.config.mjs` | App cards and detail panels use first screenshots through `next/image`; the snapshot has 150 remote screenshot URLs and 150 local icon paths; `next.config.mjs` sets `images.unoptimized: true`. See `components/app-store/app-grid.tsx:92-115` and `next.config.mjs:54-97`. | Static export leaves remote screenshots and local icons as browser-delivered media, so page-entry transfer and image scheduling depend on data shape and component usage. | local counts, source-text only | `app-store-data-pipeline` |
| Deploy modal flow | `components/app-store/app-grid.tsx`, `app/[lang]/products/app-store/[slug]/components/DeployButton.tsx`, `new-components/DeployModal/DeployModalContext.tsx`, `new-components/DeployModal/DeployModalInner.tsx`, `new-components/DeployModal/TemplateForm.tsx` | Grid/detail deploy actions call `openDeployModal(getTemplateName(app))`; the provider awaits `fetchTemplateSource(templateName)` before opening form/error state or checking auth for no-input templates. See `components/app-store/app-grid.tsx:333-335` and `DeployModalContext.tsx:62-132`. | Deploy click latency includes template-source lookup, form-data initialization, auth check, and redirect construction. | source-text only | `app-store-data-pipeline` |

### Static And Runtime Shape Comparison

| Field | Static Snapshot | Runtime Conversion | Audit Meaning |
|-------|-----------------|-------------------|---------------|
| `slug` | 150 records include canonical static `slug` values. | Runtime converter emits `slug: metadata.name`. | Runtime can expose upstream naming directly while static data uses the generated canonical value. |
| `templateName` | 3 records include `templateName`. | Runtime converter source scan reports `templateName: false`. | Mixed-case template deploy identity is preserved only by the static snapshot path. |
| `legacySlugs` | 3 records include non-empty `legacySlugs`. | Runtime converter source scan reports `legacySlugs: false`. | Legacy detail route support is tied to static data and `matchesAppSlug()`. |
| `description` | 150 records include descriptions. | Runtime converter emits `description: spec.description`. | Static and runtime paths can carry different upstream normalization or fallback semantics. |
| `icon` | 150 records include local icon paths. | Runtime converter builds `icon` from `iconPath`. | Runtime icon paths assume generated asset availability without the static generator's exact snapshot context. |
| `screenshots` | 150 records include screenshots; 150 screenshot URLs are remote. | Runtime converter emits `Array.isArray(spec.screenshots) ? spec.screenshots : []`. | Static fallback media completeness can differ from upstream runtime availability. |
| `readme` | 150 records include README URLs; all are raw GitHub URLs. | Runtime converter emits `readme: spec.readme`. | README render cost is data-dependent and remote. |
| `github` | 149 records include GitHub URLs. | Runtime converter emits `github: spec.gitRepo`. | GitHub fallback candidate discovery depends on runtime/static source completeness. |
| `website` | 150 records include website URLs. | Runtime converter emits `website: spec.url`. | Website values can participate in README source discovery when GitHub-like. |
| `tags` | 150 records include tags. | Runtime converter emits `tags: spec.categories`. | Tags feed search/filter strings in client interactions. |
| `source` | 150 records include source objects. | Runtime converter emits `source.url` and `source.deployCount`. | Deploy-count sorting depends on source data in both paths. |
| `i18n` | 150 records include `i18n.zh.description`. | Runtime converter emits `i18n` only when upstream has locale data. | Localized copy can be more complete in static snapshot rendering than dynamic runtime rendering. |
| `deployUrl` | Raw static JSON records have no `deployUrl`; `config/apps-loader.ts` adds it during loading. | Runtime converter source scan reports `deployUrl: false`; browser dynamic loading adds it later in `fetchDynamicApps()`. | Deploy URLs are loader-derived fields, so raw JSON/API payload consumers see different shapes before loader normalization. |

### Payload, Cache, Fallback, And Media Baseline

| Metric | Value | Evidence | Validation Coverage |
|--------|-------|----------|---------------------|
| `config/apps.json` bytes | 203,676 | `wc -c config/apps.json config/template-sources.json` | local counts |
| `config/template-sources.json` bytes | 71,833 | `wc -c config/apps.json config/template-sources.json` | local counts |
| Combined App Store JSON bytes | 275,509 | `wc -c config/apps.json config/template-sources.json` | local counts |
| App records | 150 | Node JSON parse count | local counts |
| Template-source keys | 150 | Node JSON parse count | local counts |
| Apps with `templateName` / `legacySlugs` | 3 / 3 | Node field coverage script | local counts |
| Apps with descriptions, icons, screenshots, README URLs, tags, source, and zh descriptions | 150 each | Node field coverage script | local counts |
| Apps with GitHub URLs | 149 | Node field coverage script | local counts |
| Total screenshots / remote screenshots | 150 / 150 | Node URL classification script | local counts |
| Local icon paths | 150 | Node URL classification script | local counts |
| Direct raw GitHub README URLs | 150 | Node URL classification script | local counts |
| Template-source entries with inputs | 83 of 150 | Node template-source script | local counts |
| Total template-source inputs | 297 | Node template-source script | local counts |
| Top template-source input counts | `outline` 19, `insforge` 17, `sub2api` 15, `s-pdf` 11, `ace-step` 10 | Node template-source script | local counts |
| Category counts | Tools 89, AI 26, Database 9, Low-Code 7, DevOps 7, Monitoring 6, Blog 3, Storage 3 | Node category count script | local counts |
| Local app image files / bytes | 210 files / 4,219,013 bytes | `find public/images/apps ...` | local counts |

### Cache And Fallback Matrix

| Path | Cache / Fallback Evidence | Audit Interpretation | Validation Coverage |
|------|---------------------------|----------------------|---------------------|
| Static imports | `config/apps.ts` imports `config/apps.json` and exports `appsConfig`; App Store index content passes that value to hero, showcase, and grid. | Static pages use committed generated data as their current truth. | source-text only |
| Module-level loader caches | `config/apps-loader.ts` keeps `categoryCache`, `allAppsCache`, `dynamicAppsCache`, `lastDynamicFetch`, and a 5-minute `DYNAMIC_CACHE_TTL`. | Server/static and browser paths can reuse process/session-local values with separate freshness behavior. | source-text only |
| Browser dynamic cache | `USE_DYNAMIC_LOADING = typeof window !== 'undefined'`; browser `loadAllApps()` can fetch `/api/apps`, cache it, and fall back to static apps on failure. | Any client caller of `loadAllApps()` can mix dynamic freshness with static fallback data. | source-text only |
| `/api/apps` fallback | `handleAppsRequest()` catches remote API failures and returns `loadFallbackApps()`; `loadFallbackApps()` returns `[]` if the static import also fails. | Runtime API consumers can receive HTTP 200 with static fallback data or an empty list. | source-text only |
| README fetch cache | README candidates are fetched with `cache: 'force-cache'`. | Detail page README latency can be cached by the platform, while candidate fan-out and full response parsing remain source-level risks. | source-text only |
| Deploy modal hook state | `useTemplateSource()` stores one `data` value, `isLoading`, and `error`; `openDeployModal()` awaits fetch/lookup before opening form or error state. | Deploy click latency is user-visible when template-source data misses the local JSON or returns slowly. | source-text only |

### Phase 3 Findings

| ID | status | severity | phase | files | entry point | module boundary | work type | execution timing | evidence | root cause | impact | remediation direction | validation coverage | duplicate key | dismissal rationale |
|----|--------|----------|-------|-------|-------------|-----------------|-----------|------------------|----------|------------|--------|-----------------------|---------------------|---------------|---------------------|
| PERF-301 | candidate | high | 3 | `config/apps.json`, `config/apps-loader.ts`, `config/apps.ts`, `lib/api/apps-api.ts`, `app/api/apps/[[...lang]]/route.ts` | `/api/apps`, App Store static pages, deploy buttons | `config`, `lib`, `app/api`, `app/[lang]` | CPU, network, developer workflow | static generation, request, interaction | Static data includes `templateName` and `legacySlugs` for 3 records; runtime converter source scan reports both fields absent and emits `slug: metadata.name`. | Static generator, static loader, and runtime API converter produce different app shapes. | Dynamic `/api/apps` consumers can lose mixed-case deploy identity, legacy slug support, and loader-derived fields unless another normalization layer repairs them. | Consolidate App Store normalization or introduce a shared runtime/static shape contract with focused tests for D-07 fields. | source-text only | `app-store-data-pipeline` | n/a |
| PERF-302 | candidate | medium | 3 | `config/apps-loader.ts`, `lib/api/apps-api.ts`, `config/apps.ts` | `loadAllApps()`, `/api/apps` | `config`, `lib`, `app/api` | network, CPU | request, interaction | Loader module caches use a 5-minute browser dynamic TTL and `/api/apps` falls back to static apps; fallback static import failure returns an empty app array with HTTP 200. | Cache scope and fallback semantics are split across loader and route handler paths. | Freshness, fallback interpretation, and empty-list success behavior can differ by caller, runtime, and cache state. | Record explicit freshness/fallback states in the shared app-data contract and make empty-list fallback distinguishable from successful remote data. | source-text only | `app-store-data-pipeline` | n/a |
| PERF-303 | candidate | medium | 3 | `components/app-store/app-grid.tsx`, `app/[lang]/products/app-store/components/app-store-browser-utils.ts`, `app/[lang]/products/app-store/[slug]/components/app-detail-utils.ts` | App Store category, query, sort, pagination, detail related apps | `components`, `app/[lang]` | CPU, hydration | interaction, page entry | The grid recomputes category counts and visible results through `useMemo()` over 150 apps; the utility filters, searches tags/descriptions/categories, sorts, clamps, and slices. Detail pages derive related apps from the full static list. | Repeated derived-data transformations are distributed across App Store UI and detail helpers. | Interaction cost grows with payload size and repeated state changes; current utility test command reports 0 tests, so behavior coverage is incomplete in this shell. | Centralize and memoize derived App Store indexes where useful, and repair the utility test command before marking filter/sort behavior tested. | source-text only | `app-store-data-pipeline` | n/a |
| PERF-304 | candidate | high | 3 | `app/[lang]/products/app-store/[slug]/page.tsx`, `app/[lang]/products/app-store/[slug]/components/ReadmeMarkdownWindow.tsx`, `app/[lang]/products/app-store/[slug]/components/ReadmePreview.tsx` | App detail README preview | `app/[lang]` | network, CPU | static generation, request, page entry | Detail rendering awaits `loadReadmeMarkdown(app)`; README loader iterates candidates, fetches with `cache: 'force-cache'`, reads full text, normalizes markdown, and renders full content with `ReactMarkdown` and `remark-gfm`. | README candidate fetch and markdown render are on the detail render path. | Detail pages can pay remote README latency and full markdown parse/render cost, especially when a direct README is absent and GitHub fallback candidates fan out. | Add README size/candidate limits, precomputed README summaries, or guarded static README caching in later fix planning. | source-text only | `app-detail-remote-readme` | n/a |
| PERF-305 | candidate | medium | 3 | `config/apps.json`, `components/app-store/app-grid.tsx`, `app/[lang]/products/app-store/[slug]/components/AppPreviewPanel.tsx`, `app/[lang]/products/app-store/[slug]/components/Screenshots.tsx`, `next.config.mjs` | App Store cards and detail media | `config`, `components`, `app/[lang]`, `next.config.mjs` | asset, network | page entry | Local counts show 150 remote screenshot URLs and 150 local icon paths; App cards and detail panels render screenshots with `next/image`; `next.config.mjs` sets `images.unoptimized: true` for static export. | App Store media delivery depends on remote screenshot URLs and static export image behavior. | Page-entry transfer and image scheduling can vary with upstream screenshot hosts and card/detail render density. | Add route-owned media budgets, screenshot dimension/host inventory, and lazy/priority policy review in the asset/bundle phase or later App Store fix plan. | local counts, source-text only | `app-store-data-pipeline` | n/a |
| PERF-306 | candidate | medium | 3 | `config/template-sources.json`, `hooks/use-template-source.ts`, `new-components/DeployModal/DeployModalContext.tsx`, `new-components/DeployModal/TemplateForm.tsx` | App card/detail Deploy click | `hooks`, `new-components`, `config/template-sources.json` | network, CPU, hydration | interaction | Template-source snapshot has 150 keys, 83 entries with inputs, and 297 total inputs; `openDeployModal()` awaits `fetchTemplateSource(templateName)` before opening form/error state or redirecting for no-input templates. | Deploy interaction depends on template-source lookup and form initialization at click time. | User-visible deploy latency can occur when local data misses, remote fallback is slow, or a high-input template initializes a large form. | Add per-template-source cache semantics, prefetch strategy, or a visible loading state with measured click-to-modal timing. | local counts, source-text only | `app-store-data-pipeline` | n/a |
| PERF-307 | candidate | low | 3 | `lib/api/apps-api.ts`, `app/api/apps/[[...lang]]/route.ts`, `config/apps.ts` | `/api/apps` fallback response | `app/api`, `lib`, `config` | network, CPU | request | `handleAppsRequest()` catches remote API failures and returns fallback apps; `loadFallbackApps()` catches static import failures and returns `[]`. | Fallback success and empty fallback share the same HTTP 200 response shape. | API clients can interpret fallback-empty as a successful empty catalog, masking data-source failure and causing empty UI states. | Encode fallback status metadata or non-success status for empty fallback so consumers can distinguish data absence from a valid empty catalog. | source-text only | `app-store-data-pipeline` | n/a |

### Phase 3 Skipped Validation

| Measurement | Status | Reason | Future Guard | Validation Coverage |
|-------------|--------|--------|--------------|---------------------|
| remote README smoke | skipped | Phase 3 excludes remote README fetch loops; source evidence already shows candidate fetch and render behavior. | Use a single-app smoke with explicit network notes if later severity needs live latency evidence. | manual only |
| generated data refresh | skipped | `npm run generate-apps` can contact remote APIs and rewrite `config/apps.json`, `config/template-sources.json`, and `public/images/apps`. | Run only in a generated-data refresh task with before/after git diff guards. | manual only |
| `npm run generate-apps` | skipped | It belongs to Phase 2 generator/build work and can mutate generated artifacts. | Keep as explicit refresh validation, separated from runtime App Store audit. | manual only |
| `npm run build` | skipped | The script runs `npm run generate-apps` before Next build. | Use generated-file guards and separate generator timing from Next build timing. | manual only |
| `npm run build:analyze` | skipped | The analyzer command runs the generator first, and bundle interpretation belongs to Phase 6. | Capture analyzer output in Phase 6 with generated-file guards. | manual only |
| Broad `/api/apps` or template-source polling | skipped | Phase 3 excludes production load tests and high-volume endpoint polling. | Use controlled request counts and target environment approval in a later measurement phase. | unvalidated |
| Production endpoint stress tests | skipped | Live traffic and operational load testing are out of scope for v1 source audit. | Require separate operational approval and traffic controls. | unvalidated |

### Phase 3 Validation

Phase 3 validation used local/source-text commands only. Application source,
generated JSON, app images, package files, and configuration source remained
read-only.

#### Validation Commands

```bash
node --version && npm --version

wc -c config/apps.json config/template-sources.json

find public/images/apps -type f | wc -l | tr -d ' '

find public/images/apps -type f -print0 | xargs -0 stat -f %z | awk '{s+=$1} END{print s+0}'

node -e "const fs=require('fs'); const apps=JSON.parse(fs.readFileSync('config/apps.json','utf8')); const sources=JSON.parse(fs.readFileSync('config/template-sources.json','utf8')); const counts={apps:apps.length,templateSourceKeys:Object.keys(sources).length,withTemplateName:apps.filter(a=>a.templateName).length,withLegacySlugs:apps.filter(a=>Array.isArray(a.legacySlugs)&&a.legacySlugs.length).length,withDescription:apps.filter(a=>a.description&&a.description.trim()).length,withIcon:apps.filter(a=>a.icon&&a.icon.trim()).length,withScreenshots:apps.filter(a=>Array.isArray(a.screenshots)&&a.screenshots.length).length,totalScreenshots:apps.reduce((n,a)=>n+(Array.isArray(a.screenshots)?a.screenshots.length:0),0),withReadme:apps.filter(a=>a.readme&&a.readme.trim()).length,withGithub:apps.filter(a=>a.github&&a.github.trim()).length,withWebsite:apps.filter(a=>a.website&&a.website.trim()).length,withTags:apps.filter(a=>Array.isArray(a.tags)&&a.tags.length).length,withSource:apps.filter(a=>a.source).length,withZhDescription:apps.filter(a=>a.i18n?.zh?.description?.trim()).length,remoteScreenshots:apps.reduce((n,a)=>n+(a.screenshots||[]).filter(s=>/^https?:\\/\\//.test(s)).length,0),readmeDirectGithubRaw:apps.filter(a=>/^https:\\/\\/raw\\.githubusercontent\\.com\\//i.test(a.readme||'')).length,localIcons:apps.filter(a=>/^\\/images\\/apps\\//.test(a.icon||'')||/^\\/icons\\//.test(a.icon||'')).length,templateSourcesWithInputs:Object.values(sources).filter(inputs=>Array.isArray(inputs)&&inputs.length>0).length,totalTemplateInputs:Object.values(sources).reduce((n,inputs)=>n+(Array.isArray(inputs)?inputs.length:0),0)}; const categories=apps.reduce((m,a)=>{m[a.category]=(m[a.category]||0)+1; return m;},{}); const topTemplateInputCounts=Object.entries(sources).map(([key,inputs])=>({key,count:Array.isArray(inputs)?inputs.length:0})).sort((a,b)=>b.count-a.count).slice(0,10); console.log(JSON.stringify({counts,categories,topTemplateInputCounts},null,2));"

node -e "const fs=require('fs'); const apps=JSON.parse(fs.readFileSync('config/apps.json','utf8')); const source=fs.readFileSync('lib/api/apps-api.ts','utf8'); const staticKeys=new Set(apps.flatMap(a=>Object.keys(a))); const runtimeFields={slug:/slug:\\s*metadata\\.name/.test(source),templateName:/templateName/.test(source),legacySlugs:/legacySlugs/.test(source),description:/description:\\s*spec\\.description/.test(source),icon:/icon:\\s*iconPath/.test(source),screenshots:/screenshots:\\s*Array\\.isArray\\(spec\\.screenshots\\)/.test(source),readme:/readme:\\s*spec\\.readme/.test(source),github:/github:\\s*spec\\.gitRepo/.test(source),website:/website:\\s*spec\\.url/.test(source),tags:/tags:\\s*spec\\.categories/.test(source),source:/source:\\s*\\{/.test(source),i18n:/Object\\.keys\\(i18n\\)\\.length/.test(source),deployUrl:/deployUrl/.test(source)}; console.log(JSON.stringify({staticKeys:[...staticKeys].sort(),runtimeFields},null,2));"

rg -n "appsConfig|loadAllApps|handleAppsRequest|loadFallbackApps|ReactMarkdown|useTemplateSource|openDeployModal|getVisibleApps|getCategoryCounts|force-cache|screenshots" config app components hooks lib new-components next.config.mjs

node --test config/apps-data-quality.test.mts

node --test components/app-store/app-grid.test.mts 'app/[lang]/products/app-store/app-store-page.test.mts' 'app/[lang]/products/app-store/[slug]/app-store-detail-page.test.mts'

node --test 'app/[lang]/products/app-store/components/app-store-browser-utils.test.mts'
```

#### Validation Log

| Check | Result | Evidence |
|-------|--------|----------|
| Environment | Gap noted on 2026-06-11 | Current shell reported Node `v24.13.0` and npm `11.6.2`; `.nvmrc` records canonical project runtime Node 20. |
| Payload baseline | Passed on 2026-06-11 | `config/apps.json` 203,676 bytes; `config/template-sources.json` 71,833 bytes; combined 275,509 bytes. |
| App image baseline | Passed on 2026-06-11 | `public/images/apps` has 210 files totaling 4,219,013 bytes. |
| Static data coverage | Passed on 2026-06-11 | Node counts returned 150 apps, 150 template-source keys, 150 README URLs, 150 screenshots, 150 local icons, 83 template-source entries with inputs, and 297 total inputs. |
| Static/runtime shape comparison | Passed for source audit on 2026-06-11 | Static keys included `templateName` and `legacySlugs`; runtime converter scan reported `templateName: false`, `legacySlugs: false`, and `deployUrl: false`. |
| Source evidence scan | Passed on 2026-06-11 | `rg` found expected evidence in `config/apps-loader.ts`, `config/apps.ts`, `lib/api/apps-api.ts`, `/api/apps`, index/detail pages, grid utilities, README loader, screenshot/media components, deploy modal, template-source hook, and `next.config.mjs`. |
| Static data contract test | Passed on 2026-06-11 | `node --test config/apps-data-quality.test.mts` passed 5 tests, 0 failed, duration 59.286041 ms. |
| App Store page/detail/grid source-text tests | Passed on 2026-06-11 | `node --test components/app-store/app-grid.test.mts 'app/[lang]/products/app-store/app-store-page.test.mts' 'app/[lang]/products/app-store/[slug]/app-store-detail-page.test.mts'` passed 7 tests, 0 failed, duration 54.149541 ms. |
| Browser utility behavior test | Gap recorded on 2026-06-11 | `node --test 'app/[lang]/products/app-store/components/app-store-browser-utils.test.mts'` exited successfully with `tests 0`, `pass 0`, and `fail 0`, so filter/sort behavior remains `source-text only`. |

## Phase 4: Route Classification and Content/Generated Endpoints

Phase 4 extends the audit ledger with route execution classification,
Fumadocs/content traversal, generated endpoint behavior, and static export
context for ROUTE-01, ROUTE-02, CONTENT-01, CONTENT-02, CONTENT-03, and
CONTENT-04. This pass is audit-only: application source, content, generated
snapshots, deployment files, and package files were read-only evidence.

### Phase 4 Route Inventory And Classification

Local source inventory on 2026-06-11 found 47 route-like files under `app`: 22
`page.tsx`, 8 `layout.tsx`, 2 `loading.tsx`, 2 `not-found.tsx`, 2 `error.tsx`,
9 `route.ts`, and 2 `sitemap.ts`. 35 route-like entries are localized under
`app/[lang]`, and 6 API route handlers live under `app/api`.

Exact route category labels for this phase are: `static page`,
`generated static artifact`, `runtime route handler`,
`external-service-backed endpoint`, and `deployment-specific path`.

| Route/File Group | Category | Execution Timing | Static Params | Metadata Generation | Loader Calls | Async/Fetch/Filesystem Signal | Cache/Static-Export Signal | Duplicate Key | Validation Coverage | Notes |
|------------------|----------|------------------|---------------|---------------------|--------------|-------------------------------|----------------------------|---------------|---------------------|-------|
| `app/layout.tsx`, `app/not-found.tsx` | static page | page entry, static generation | n/a | root layout metadata path only | none observed in route inventory scan | no route-level async signal in inventory scan | root shell for localized routes | `shared-layout-bundle-cost` | source-text only | Included for complete route tree coverage; detailed shell bundle ownership remains Phase 6. |
| `app/[lang]/layout.tsx` | static page | static generation, page entry | yes, locale list from `locales` | `metadata = generatePageMetadata()` | none in route scan | async layout; mounts analytics, structured data, search, auth, and deploy providers | shared locale shell under static export | `shared-layout-bundle-cost` | source-text only | Shared localized shell baseline for every `app/[lang]` route. |
| `app/[lang]/(home)/layout.tsx`, `app/[lang]/customers/layout.tsx`, `app/[lang]/legal/layout.tsx` | static page | page entry | inherited from locale layout | route-local or inherited metadata only | none observed in route inventory scan | no direct fetch/filesystem signal in inventory scan | localized layout entries | `shared-layout-bundle-cost` | source-text only | Group covers localized layout entries that primarily shape page chrome. |
| `app/[lang]/docs/layout.tsx` | static page | static generation, page entry | inherited from locale layout | inherited docs metadata context | `source.pageTree[params.lang]` | async layout wrapper | Fumadocs tree resolved during static/page render | `fumadocs-search-index` | source-text only | Docs sidebar tree traversal is Phase 4 content evidence. |
| `app/[lang]/docs/[[...slug]]/page.tsx` | static page | static generation, page entry | yes, `source.generateParams()` | yes, `generateDocsMetadata` | `source.getPage()` | async page, MDX body execution | static docs pages from Fumadocs source | `fumadocs-search-index` | source-text only | Renders `DocsPage`, `DocsBody`, `ImageZoom`, `Mermaid`, `PageActions`, and AI share controls. |
| `app/[lang]/(home)/blog/page.tsx`, `app/[lang]/(home)/blog/category/page.tsx`, `app/[lang]/(home)/blog/category/[category]/page.tsx` | static page | static generation, page entry, interaction | yes or inherited by route | metadata helpers where present | `blog.getPages()` through route/util helpers | async/static filtering and category work | blog listing generated from Fumadocs loader | `fumadocs-search-index` | source-text only | Blog listing/category routes are grouped because they share blog loader traversal and client tag/category filtering. |
| `app/[lang]/(home)/blog/[slug]/page.tsx`, `app/[lang]/(home)/blog/[slug]/layout.tsx` | static page | static generation, page entry | yes, `blog.generateParams()` | yes, `generateBlogMetadata` | `blog.getPage()`, `blog.getPages()`, `blog.pageTree` | async page/layout, `Promise.all()` for FAQ schema text | static blog article pages from Fumadocs source | `fumadocs-search-index` | source-text only | Renders MDX body, `ImageZoom`, `Mermaid`, FAQ accordions, `ReactMarkdown`, related articles, structured data, and AI share controls. |
| `app/[lang]/(home)/ai-quick-reference/page.tsx`, `app/[lang]/(home)/ai-quick-reference/[slug]/page.tsx`, `app/[lang]/(home)/ai-quick-reference/sitemap.ts` | static page | static generation, page entry | yes for detail route from `faqSource.getPages('en')` | route metadata where present | `faqSource.getPages()` | static param expansion over FAQ corpus | FAQ detail pages and localized sitemap path | `fumadocs-search-index` | local counts, source-text only | FAQ corpus has 2000 JSON files; detail params are generated for both `en` and `zh-cn`. |
| `app/[lang]/(home)/(new-home)/page.tsx`, `pricing/page.tsx`, `sealos-skills/page.tsx`, `contact/page.tsx`, `abuse/page.tsx`, `customers/page.tsx`, `customers/[slug]/page.tsx`, `app/[lang]/customers/[slug]/layout.tsx` | static page | static generation, page entry, interaction | inherited or route-local where present | route metadata where present | content/config imports only in scan | broad component imports; customer markdown path uses `ReactMarkdown` | localized marketing/customer pages under static export | `shared-layout-bundle-cost` | source-text only | Group covers localized marketing/customer detail page-layout and legal entry points outside Fumadocs content traversal. |
| `app/[lang]/products/app-store/page.tsx`, `app/[lang]/products/app-store/[slug]/page.tsx`, `app/[lang]/products/app-store/loading.tsx`, `error.tsx`, `[slug]/loading.tsx`, `[slug]/not-found.tsx`, `[slug]/error.tsx` | static page | static generation, page entry, interaction | yes for detail route | yes for index/detail SEO | App Store config/loader helpers | async README/detail evidence already recorded in Phase 3 | static App Store pages with generated JSON input | `app-store-data-pipeline` | source-text only | Classification row only; detailed App Store runtime/static data path was Phase 3. |
| `app/[lang]/products/devbox/page.tsx`, `app/[lang]/products/databases/page.tsx`, `app/[lang]/(home)/comparison/page.tsx`, `app/[lang]/(home)/comparison/[slug]/page.tsx`, `app/[lang]/solutions/industries/[industry]/page.tsx`, `app/[lang]/solutions/industries/[industry]/individual/page.tsx` | static page | static generation, page entry | route-specific where present | route metadata where present | config/static imports | broad product/comparison/industry imports | localized static pages | `shared-layout-bundle-cost` | source-text only | Grouped localized product/comparison/industry pages for route classification coverage. |
| `app/sitemap.ts` | generated static artifact | static generation, deployment | n/a | MetadataRoute sitemap | `source.getPages()`, `blog.getPages()`, `appsConfig` | async sitemap generator over multiple sources | `revalidate = false` | `static-export-route-classification` | source-text only, local counts | Main sitemap combines docs, blog, product, App Store, comparison, and locale-specific pages. |
| `app/sitemap-ai-faq.ts` | generated static artifact | static generation, deployment | n/a | MetadataRoute sitemap | `faqSource.getPages('en')`, `faqSource.getPages('zh-cn')` | synchronous sitemap function over FAQ corpus | `revalidate = false`, `dynamic = 'force-static'` | `fumadocs-search-index` | local counts, source-text only | AI quick reference sitemap is explicitly forced static for static export. |
| `app/api/search/route.ts` | generated static artifact | static generation, request, deployment | n/a | n/a | `source.getLanguages()` | static search index construction | `revalidate = false`, `staticGET: GET` | `fumadocs-search-index` | source-text only | Builds metadata-oriented search records for localized docs. |
| `app/rss.xml/route.ts` | generated static artifact | static generation, request, deployment | n/a | RSS serialization | `blog.getPages(defaultLanguage)` | feed serialization | `revalidate = false`, cache headers in response | `fumadocs-search-index` | source-text only | Generated feed path sorts default-language blog pages and serializes RSS. |
| `app/sitemap-index.xml/route.ts` | generated static artifact | static generation, request, deployment | n/a | XML sitemap index | none | small XML response | `revalidate = false`, cache headers in response | `static-export-route-classification` | source-text only | Emits sitemap index for main sitemap and AI FAQ sitemap. |
| `app/llms.txt/route.ts` | generated static artifact | static generation, request, deployment | n/a | text artifact | direct filesystem/content scan | `fast-glob`, async `fs.readFile`, `gray-matter`, `remark` pipeline, `Promise.all()` | `revalidate = false` | `static-export-route-classification` | local counts, source-text only | Scans localized docs files directly instead of using the Fumadocs loader boundary. |
| `app/api/robots/route.ts` | generated static artifact | request, deployment | n/a | robots text | none | small text response | host selected from default language | `static-export-route-classification` | source-text only | Included for generated endpoint coverage; no finding promoted. |
| `app/api/apps/[[...lang]]/route.ts` | external-service-backed endpoint | request, deployment | n/a | n/a | App Store API adapter | external template API and fallback static data | runtime route handler under static export classification | `app-store-data-pipeline` | source-text only | Classification-only row; detailed runtime API behavior belongs to Phase 3. |
| `app/api/og/route.ts`, `app/api/blog/[lang]/[slug]/thumbnail/[format]/route.ts` | runtime route handler | request, deployment | n/a | generated image metadata | blog loader and OG helpers | native image rendering path | runtime handler behavior depends on hosting target | `og-native-rendering` | source-text only | Classification-only rows; detailed native rendering belongs to Phase 5. |
| `app/api/abuse/verify-turnstile/route.ts` | external-service-backed endpoint | request, deployment | n/a | n/a | none | Turnstile verification network path | runtime handler behavior depends on hosting target | `static-export-route-classification` | source-text only | Classification-only row for external-service-backed endpoint coverage. |

Route signal scan over the 47 route-like files reported 14 files containing
`generateStaticParams`, 19 containing `generateMetadata`, 6 with
`revalidate = false`, 1 with `dynamic = 'force-static'`, 3 using `source.*`, 4
using `blog.*`, 2 using `faqSource.*`, 1 using `fetch(`, 1 with filesystem/glob
signals, and 6 with `NextResponse`.

### Phase 4 Content Corpus Baseline

| Corpus | File Count | Content File Count | Byte Baseline | Validation Coverage | Notes |
|--------|------------|--------------------|---------------|---------------------|-------|
| `content/docs` | 662 | 305 `*.mdx`/`*.md` | `*.en.mdx` 416,030 bytes; `*.zh-cn.mdx` 579,520 bytes | local counts | `llms.txt`, docs pages, docs sitemap entries, metadata, and search all depend on this corpus. |
| `content/blog` | 329 | 166 `*.mdx`/`*.md` | 3,687,149 bytes | local counts | Blog pages, RSS, blog article layout/schema, and main sitemap depend on this corpus. |
| `content/ai-quick-reference` | 2000 | 2000 JSON files | 3,755,109 bytes | local counts | FAQ detail params and AI FAQ sitemap expand from this corpus. |
| `config/apps.json` | 1 | 150 app records | Phase 3 baseline: 203,676 bytes | local counts | Phase 4 cites this only as input to `app/sitemap.ts`; App Store ownership remains Phase 3. |

### Fumadocs Loader Traversal Map

| Loader | Definition Boundary | Observed Traversal | Route/Helper Consumers | Performance Reason | Validation Coverage | Duplicate Key |
|--------|---------------------|--------------------|------------------------|--------------------|---------------------|---------------|
| `source` | `source.config.ts` defines docs at `content/docs`; `lib/source.ts` exposes `source = loader({ baseUrl: '/docs', source: createMDXSource(docs, meta) })`. | `source.getLanguages()`, `source.getPages()`, `source.getPage()`, `source.generateParams()`, `source.pageTree`. | `/api/search`, `app/sitemap.ts`, docs layout, docs page, `generateDocsMetadata`. | Docs content is traversed for static params, page render, metadata, sitemap, search index, and shared docs chrome. | source-text only, local counts | `fumadocs-search-index` |
| `blog` | `source.config.ts` defines blog at `content/blog`; `lib/source.ts` exposes `blog = loader({ baseUrl: '/blog', source: createMDXSource(blogPosts, []) })`. | `blog.getPages()`, `blog.getPage()`, `blog.generateParams()`, `blog.pageTree`. | RSS, `app/sitemap.ts`, blog article page/layout, blog utilities, blog thumbnail route, `generateBlogMetadata`. | Blog content is traversed for feed, sitemap, article render, metadata, related articles, adjacent posts, FAQ/HowTo schema, and future image generation. | source-text only, local counts | `fumadocs-search-index` |
| `faqSource` | `source.config.ts` defines AI quick reference meta collection at `content/ai-quick-reference`; `lib/source.ts` exposes `faqSource = loader({ baseUrl: '/ai-quick-reference', source: createMDXSource(aiQuickReference, []) })`. | `faqSource.getPages()`, `faqSource.getLanguages()`. | AI FAQ sitemap, AI quick reference detail static params, FAQ utilities. | 2000 JSON records can expand static params, sitemap entries, and helper traversal cost. | source-text only, local counts | `fumadocs-search-index` |
| Direct filesystem scans | Outside loader boundary in `app/llms.txt/route.ts` and `lib/utils/blog-utils.ts`. | `fast-glob`, async `fs.readFile`, `gray-matter`, `remark` pipeline; blog category helpers read `content/blog`. | `/llms.txt`, blog category utilities. | Direct scans duplicate content traversal outside the canonical Fumadocs loader and make payload budgeting harder. | source-text only | `static-export-route-classification` |

### Localized Rendering Path Map

| Path | Files | Rendering/Traversal Evidence | Phase 4 Interpretation | Validation Coverage |
|------|-------|------------------------------|------------------------|---------------------|
| Docs page | `app/[lang]/docs/[[...slug]]/page.tsx`, `app/[lang]/docs/layout.tsx` | `source.getPage()`, `source.generateParams()`, `source.pageTree`, `generateDocsMetadata`, MDX body, `ImageZoom`, `Mermaid`, `PageActions`, AI share controls. | Docs pages have repeated loader and metadata traversal plus route-render widgets; bundle/hydration ownership for widgets remains Phase 6. | source-text only |
| Blog article | `app/[lang]/(home)/blog/[slug]/page.tsx`, `app/[lang]/(home)/blog/[slug]/layout.tsx` | `blog.getPage()`, `blog.generateParams()`, `blog.getPages()`, `blog.pageTree`, `generateBlogMetadata`, article schema, FAQ schema through `Promise.all()`, HowTo schema, related articles, `ImageZoom`, `Mermaid`, FAQ accordions, `ReactMarkdown`, AI share controls. | Blog articles duplicate loader work across page, layout, metadata, related article selection, and schema generation. | source-text only |
| Blog listing/category | `app/[lang]/(home)/blog/page.tsx`, `category/page.tsx`, `category/[category]/page.tsx`, `lib/utils/blog-utils.ts` | Blog utilities call `blog.getPages(lang)`, category helpers, related filtering, and client tag/category controls. | Listing and category paths scale with the blog corpus and share traversal root cause with article routes. | source-text only |
| AI quick reference | `app/[lang]/(home)/ai-quick-reference/[slug]/page.tsx`, `app/[lang]/(home)/ai-quick-reference/sitemap.ts`, `app/sitemap-ai-faq.ts` | Detail params use English `faqSource.getPages('en')` and generate params for `en` and `zh-cn`; sitemap reads `faqSource.getPages()` by language. | 2000 JSON files create a static-param and sitemap growth surface. | source-text only, local counts |
| Search client | `components/docs/Search.tsx`, `app/[lang]/layout.tsx` | `DefaultSearchDialog` uses `useDocsSearch`, static Orama search, Mandarin tokenizer, and language tag filtering through shared locale shell. | Client search behavior shares the `fumadocs-search-index` root cause with `/api/search`. | source-text only |

### Generated Endpoint Table

| Endpoint / Helper | Files | Category | Source Evidence | Payload/Cache Behavior | Validation Coverage | Duplicate Key |
|-------------------|-------|----------|-----------------|------------------------|---------------------|---------------|
| `/api/search` | `app/api/search/route.ts`, `components/docs/Search.tsx`, `lib/source.ts` | generated static artifact | `createSearchAPI('advanced')`, `source.getLanguages().flatMap(...)`, metadata-oriented `content`, Mandarin tokenizer, `staticGET: GET`. | `revalidate = false`; search index is metadata-oriented rather than full-body docs content. | source-text only | `fumadocs-search-index` |
| `/rss.xml` | `app/rss.xml/route.ts`, `lib/source.ts` | generated static artifact | `blog.getPages(defaultLanguage)`, `new Feed(...)`, `feed.rss2()`, `NextResponse`. | `revalidate = false`; cache headers set in response; feed size scales with default-language blog pages. | source-text only | `fumadocs-search-index` |
| `/sitemap-index.xml` | `app/sitemap-index.xml/route.ts` | generated static artifact | Emits XML with main sitemap and AI FAQ sitemap locations through `NextResponse`. | `revalidate = false`; small generated XML route. | source-text only | `static-export-route-classification` |
| Main sitemap | `app/sitemap.ts`, `lib/source.ts`, `config/apps.json` | generated static artifact | Combines `source.getPages()`, `blog.getPages()`, static product pages, App Store detail pages, comparison combinations, and locale-specific marketing pages. | `revalidate = false`; app records counted at 150; docs/blog counts from local corpus. | source-text only, local counts | `static-export-route-classification` |
| AI FAQ sitemap | `app/sitemap-ai-faq.ts` | generated static artifact | Reads `faqSource.getPages('en')` and `faqSource.getPages('zh-cn')`, escapes XML, returns MetadataRoute items. | `revalidate = false`, `dynamic = 'force-static'`; 2000 JSON records counted locally. | source-text only, local counts | `fumadocs-search-index` |
| `/llms.txt` | `app/llms.txt/route.ts` | generated static artifact | Uses `fast-glob`, async `fs.readFile`, `gray-matter`, `remarkMdx`, `remarkInclude`, `remarkGfm`, `remarkStringify`, and `Promise.all()`. | `revalidate = false`; scans either `*.en.mdx` or `*.zh-cn.mdx`; local byte baselines are 416,030 and 579,520 bytes before serialization overhead. | source-text only, local counts | `static-export-route-classification` |
| `/api/robots` | `app/api/robots/route.ts` | generated static artifact | Small text response selects host by default language and emits sitemap references. | No promoted finding; include for route classification. | source-text only | `static-export-route-classification` |
| Metadata helpers | `lib/utils/metadata.ts` | static page helper | `generateDocsMetadata` calls `source.getPage()`; `generateBlogMetadata` calls `blog.getPage()`. | Metadata generation duplicates page-loader traversal on docs/blog routes. | source-text only | `fumadocs-search-index` |
| Structured data helpers | `lib/utils/structured-data.ts`, `app/[lang]/(home)/blog/[slug]/layout.tsx` | static page helper | Article, breadcrumb, FAQ, and HowTo schema generation run in blog article layout. | FAQ schema maps answers through async plain-text conversion before JSON-LD render. | source-text only | `fumadocs-search-index` |

### Phase 4 Findings

| ID | status | severity | phase | files | entry point | module boundary | work type | execution timing | evidence | root cause | impact | remediation direction | validation coverage | duplicate key | dismissal rationale |
|----|--------|----------|-------|-------|-------------|-----------------|-----------|------------------|----------|------------|--------|-----------------------|---------------------|---------------|---------------------|
| PERF-401 | candidate | medium | 4 | `app/api/search/route.ts`, `components/docs/Search.tsx`, `lib/source.ts`, `source.config.ts` | `/api/search`, shared docs search dialog | `app/api`, `components`, `lib`, `content` | CPU, bundle | static generation, request, page entry | `app/api/search/route.ts:21-33` builds a static advanced search API from `source.getLanguages()` and indexes title, description, structured data, URL, and a metadata-oriented `content` string; `components/docs/Search.tsx` consumes static search with a Mandarin tokenizer and language tag filtering. | Search index design is metadata-oriented and shared between the generated route and client search. | Current payload may stay small at the cost of body-text recall; adding full-body content later would grow static generation work, payload size, and client search cost. | Set an explicit search-index budget and decide whether language-sharded or body-content indexing is required before expanding the payload. | source-text only | `fumadocs-search-index` | n/a |
| PERF-402 | candidate | high | 4 | `app/llms.txt/route.ts`, `content/docs/**`, `source.config.ts` | `/llms.txt` | `app`, `content` | filesystem I/O, CPU | static generation, request, deployment | `app/llms.txt/route.ts:22-55` chooses localized docs globs, reads each file, parses frontmatter with `gray-matter`, processes markdown through `remark`, and joins the serialized output; local count commands found docs `*.en.mdx` at 416,030 bytes and `*.zh-cn.mdx` at 579,520 bytes before output metadata and markdown serialization. | `llms.txt` performs a direct docs filesystem scan and markdown pipeline outside the canonical Fumadocs loader. | Static export and hosting behavior can turn a large content scan into build-time or request-time CPU/filesystem cost, and output size grows with the docs corpus. | Precompute `llms.txt` as a static artifact or route it through the same content loader with payload-size budgets and language-specific output checks. | local counts, source-text only | `static-export-route-classification` | n/a |
| PERF-403 | candidate | medium | 4 | `app/[lang]/(home)/blog/[slug]/page.tsx`, `app/[lang]/(home)/blog/[slug]/layout.tsx`, `lib/utils/metadata.ts`, `lib/utils/blog-utils.ts`, `lib/utils/structured-data.ts` | Blog article pages and metadata | `app/[lang]`, `lib`, `content` | CPU, filesystem I/O | static generation, page entry | Blog article page calls `blog.getPage()` and `blog.generateParams()`; article layout calls `blog.getPage()`, `blog.getPages()`, related article selection, FAQ schema plain-text conversion through `Promise.all()`, and structured data helpers; metadata helpers call `blog.getPage()` again. | Blog rendering, metadata, related articles, and schema generation repeat traversal over the blog loader/corpus. | Static generation cost can grow with 166 blog content files and 3,687,149 local bytes, with article pages paying repeated loader and schema work per route. | Consolidate blog page data derivation per route and memoize or precompute related/schema inputs where the loader output is reused. | local counts, source-text only | `fumadocs-search-index` | n/a |
| PERF-404 | candidate | medium | 4 | `app/sitemap.ts`, `lib/source.ts`, `config/apps.json`, `app/[lang]/(home)/comparison/config/platforms` | Main sitemap generation | `app`, `lib`, `config` | CPU | static generation, deployment | `app/sitemap.ts:39-97` aggregates docs pages, blog pages, static product pages, 150 App Store records from `config/apps.json`, comparison pair combinations from platform slugs, and locale-specific marketing paths into one MetadataRoute sitemap. | Main sitemap generation aggregates multiple route/content/product sources in one static artifact. | Sitemap size and generation CPU can grow across docs, blog, app records, and comparison combinations while deployment behavior is static-export dependent. | Add sitemap item count budgets and consider splitting large source families into separate static sitemap artifacts with shared cache policy. | local counts, source-text only | `static-export-route-classification` | n/a |
| PERF-405 | candidate | medium | 4 | `source.config.ts`, `lib/source.ts`, `app/[lang]/(home)/ai-quick-reference/[slug]/page.tsx`, `app/sitemap-ai-faq.ts`, `content/ai-quick-reference/**` | AI quick reference pages and sitemap | `app/[lang]`, `app`, `lib`, `content` | CPU, filesystem I/O | static generation | `source.config.ts:70-79` defines a meta collection for AI quick reference; `lib/source.ts:28-32` exposes `faqSource`; detail params call `faqSource.getPages('en')` and expand both `en` and `zh-cn`; `app/sitemap-ai-faq.ts:21-43` reads English and Chinese FAQ pages. Local counts found 2000 JSON files totaling 3,755,109 bytes. | AI quick reference uses a large meta corpus for static params and sitemap generation. | Static generation and sitemap creation can scale with JSON corpus size, and language fallback behavior can multiply route params. | Add explicit FAQ corpus budgets, route-param counts, and sitemap split policy before increasing the AI quick reference dataset. | local counts, source-text only | `fumadocs-search-index` | n/a |
| PERF-406 | candidate | high | 4 | `next.config.mjs`, `app/api/search/route.ts`, `app/rss.xml/route.ts`, `app/sitemap-index.xml/route.ts`, `app/sitemap.ts`, `app/sitemap-ai-faq.ts`, `app/llms.txt/route.ts`, `app/api/robots/route.ts`, `app/api/apps/[[...lang]]/route.ts`, `app/api/og/route.ts`, `app/api/blog/[lang]/[slug]/thumbnail/[format]/route.ts`, `app/api/abuse/verify-turnstile/route.ts` | Static export route-handler classification | `app`, `next.config.mjs`, `vercel.json`, `.github/workflows` | developer workflow, CPU, deployment | static generation, request, deployment | Route inventory found generated static artifacts, runtime route handlers, and external-service-backed endpoints in the same App Router tree; several generated endpoints use `revalidate = false`, `/api/search` uses `staticGET`, and `app/sitemap-ai-faq.ts` sets `dynamic = 'force-static'`. | Static export mixes generated artifacts, API-like routes, runtime handlers, and external-service-backed endpoints that need hosting-specific classification. | Build, request, CDN cache, and deployment behavior can differ across Vercel, Cloudflare Pages, Docker/Nginx, and Kubernetes paths if route intent is implicit. | Create a deployment route matrix in Phase 7 and convert generated text/XML/search artifacts to explicit static outputs where static export should own them. | source-text only | `static-export-route-classification` | n/a |

### Phase 4 Skipped Validation

| Validation | Status | Reason | Validation Coverage |
|------------|--------|--------|---------------------|
| `npm run build` | skipped | Runs generated App Store refresh before Next build and can mutate generated artifacts. | manual only |
| `npm run build:analyze` | skipped | Runs generated App Store refresh and analyzer interpretation belongs to Phase 6. | manual only |
| Production endpoint polling | skipped | Phase 4 excludes production load, remote crawl, and endpoint stress validation. | unvalidated |
| Local dev server endpoint polling | skipped | Serving routes can hide static-export artifact behavior and is unnecessary for source classification. | manual only |
| Docker build | skipped | Deployment parity and Docker runtime behavior belong to Phase 7. | unvalidated |
| Browser trace | skipped | Shared shell, bundle, hydration, and interaction traces belong to Phase 6. | unvalidated |
| `/api/og` native rendering measurement | skipped | Native canvas/Sharp rendering ownership belongs to Phase 5; Phase 4 records classification only. | unvalidated |

### Phase 4 Validation

Phase 4 validation used source/count commands only. The scoped audit-only diff
check is recorded in the Phase 4 summary artifact after the report write.

#### Validation Commands

```bash
node --version
npm --version
cat .nvmrc
test -d .source && echo SOURCE_GENERATED || echo SOURCE_MISSING
git status --short
git rev-parse --abbrev-ref HEAD
git symbolic-ref --quiet HEAD || echo DETACHED

find app -type f \( -name 'page.tsx' -o -name 'layout.tsx' -o -name 'loading.tsx' -o -name 'not-found.tsx' -o -name 'error.tsx' -o -name 'route.ts' -o -name 'sitemap.ts' \) | sort

node - <<'NODE'
const fs = require('fs');
const path = require('path');
const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const filePath = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(filePath);
    else files.push(filePath);
  }
}
walk('app');
const routeLike = files.filter((file) =>
  /(^|\/)(page|layout|loading|not-found|error|route|sitemap)\.(tsx|ts)$/.test(file),
);
const counts = { page: 0, layout: 0, loading: 0, 'not-found': 0, error: 0, route: 0, sitemap: 0 };
for (const file of routeLike) counts[path.basename(file).split('.')[0]]++;
console.log(JSON.stringify({
  total: routeLike.length,
  counts,
  localized: routeLike.filter((file) => file.startsWith('app/[lang]/')).length,
  apiRouteHandlers: routeLike.filter((file) => file.includes('/api/') && file.endsWith('/route.ts')).length,
}, null, 2));
NODE

rg -n "defineDocs|defineCollections|frontmatterSchema|remarkPlugins|remarkImageOptions|loader\(|createMDXSource|source =|blog =|faqSource =" source.config.ts lib/source.ts

rg -n "source\.get|source\.generate|source\.pageTree|blog\.get|blog\.generate|blog\.pageTree|faqSource\.get|faqSource\.getLanguages" app lib components source.config.ts

rg -n "staticGET|Feed\(|feed\.rss2|sitemap|robots|llms|NextResponse|new Response|revalidate|dynamic =|fast-glob|gray-matter|remark\(|remarkGfm|remarkMdx|remarkStringify|remarkInclude|Promise\.all" app/api/search/route.ts app/rss.xml/route.ts app/sitemap-index.xml/route.ts app/sitemap.ts app/sitemap-ai-faq.ts app/llms.txt/route.ts app/api/robots/route.ts lib/utils/metadata.ts lib/utils/structured-data.ts

rg -n "Mermaid|ImageZoom|PageActions|AIShareButtons|ReactMarkdown|Accordions|DocsBody|DocsPage|SearchDialog|useDocsSearch|createTokenizer" 'app/[lang]' components/mdx components/docs lib

find content/docs -type f | wc -l | tr -d ' '
find content/blog -type f | wc -l | tr -d ' '
find content/ai-quick-reference -type f | wc -l | tr -d ' '
find content/docs -type f \( -name '*.mdx' -o -name '*.md' \) | wc -l | tr -d ' '
find content/blog -type f \( -name '*.mdx' -o -name '*.md' \) | wc -l | tr -d ' '
find content/ai-quick-reference -type f -name '*.json' | wc -l | tr -d ' '

find content/docs -type f -name '*.en.mdx' -print0 | xargs -0 wc -c | tail -1
find content/docs -type f -name '*.zh-cn.mdx' -print0 | xargs -0 wc -c | tail -1
find content/blog -type f \( -name '*.mdx' -o -name '*.md' \) -print0 | xargs -0 wc -c | tail -1
find content/ai-quick-reference -type f -name '*.json' -print0 | xargs -0 wc -c | tail -1

node - <<'NODE'
const fs = require('fs');
const apps = JSON.parse(fs.readFileSync('config/apps.json', 'utf8'));
console.log(JSON.stringify({ appStoreRecords: apps.length }, null, 2));
NODE

node - <<'NODE'
const fs = require('fs');
const report = fs.readFileSync('docs/performance-audit.md', 'utf8');
const tokens = [
  'Phase 4: Route Classification and Content/Generated Endpoints',
  'ROUTE-01',
  'ROUTE-02',
  'CONTENT-01',
  'CONTENT-02',
  'CONTENT-03',
  'CONTENT-04',
  'static-export-route-classification',
  'fumadocs-search-index',
  'static page',
  'generated static artifact',
  'runtime route handler',
  'external-service-backed endpoint',
  'deployment-specific path',
  'app/api/search/route.ts',
  'app/rss.xml/route.ts',
  'app/sitemap-index.xml/route.ts',
  'app/sitemap.ts',
  'app/sitemap-ai-faq.ts',
  'app/llms.txt/route.ts',
  'app/api/robots/route.ts',
  'source.config.ts',
  'lib/source.ts',
  'source-text only',
  'local counts',
  'skipped',
];
for (const token of tokens) {
  if (!report.includes(token)) throw new Error(`missing ${token}`);
}
console.log(`PASS ${tokens.length} report tokens`);
NODE

git diff --name-only -- app components new-components lib config content source.config.ts next.config.mjs vercel.json public .github Dockerfile package.json package-lock.json | sed '/^$/d'
```

#### Validation Log

| Check | Result | Evidence |
|-------|--------|----------|
| Environment snapshot | Gap recorded on 2026-06-11 | Current shell reported Node `v24.13.0`, npm `11.6.2`, `.nvmrc` `20`, `.source` as `SOURCE_MISSING`, branch as `HEAD`, and symbolic ref as `DETACHED`. Existing unrelated changes were present in `.planning/config.json` and `.planning/phases/01-audit-ledger-and-module-inventory/01-RESEARCH.md`. |
| Route inventory | Passed on 2026-06-11 | `find app ...` listed 47 route-like files; count script returned 22 pages, 8 layouts, 2 loading, 2 not-found, 2 error, 9 route handlers, 2 sitemap files, 35 localized entries, and 6 API route handlers. |
| Route signal scan | Passed on 2026-06-11 | Signal script returned 14 `generateStaticParams`, 19 `generateMetadata`, 6 `revalidate = false`, 1 `dynamic = 'force-static'`, 3 `source.*`, 4 `blog.*`, 2 `faqSource.*`, 1 `fetch(`, 1 filesystem/glob, and 6 `NextResponse` route-like files. |
| Loader boundary scan | Passed on 2026-06-11 | `rg` found `defineDocs`, `defineCollections`, frontmatter schemas, remark config, `createMDXSource`, and exported `source`, `blog`, and `faqSource` loaders in `source.config.ts` and `lib/source.ts`. |
| Loader traversal scan | Passed on 2026-06-11 | `rg` found `source.getLanguages()`, `source.getPages()`, `source.getPage()`, `source.generateParams()`, `source.pageTree`, `blog.getPages()`, `blog.getPage()`, `blog.generateParams()`, `blog.pageTree`, `faqSource.getPages()`, and `faqSource.getLanguages()` consumers across app and lib files. |
| Generated endpoint scan | Passed on 2026-06-11 | `rg` found `staticGET`, `Feed`, `feed.rss2`, sitemap, robots, `llms`, `NextResponse`, `new Response`, `revalidate`, `dynamic =`, `fast-glob`, `gray-matter`, `remark`, `remarkGfm`, `remarkMdx`, `remarkStringify`, `remarkInclude`, and `Promise.all` in the endpoint/helper files. |
| MDX/widget/client boundary scan | Passed after quoted-path rerun on 2026-06-11 | Initial unquoted zsh command failed on `app/[lang]`; rerun with `'app/[lang]'` passed and found `Mermaid`, `ImageZoom`, `PageActions`, AI share controls, `ReactMarkdown`, `Accordions`, `DocsBody`, `DocsPage`, `SearchDialog`, `useDocsSearch`, and `createTokenizer`. |
| Content counts | Passed on 2026-06-11 | Counts returned docs 662 files / 305 `*.mdx` or `*.md`, blog 329 files / 166 `*.mdx` or `*.md`, and AI quick reference 2000 JSON files. |
| Payload byte baselines | Passed on 2026-06-11 | Counts returned docs English MDX 416,030 bytes, docs Chinese MDX 579,520 bytes, blog MD/MDX 3,687,149 bytes, and AI quick reference JSON 3,755,109 bytes. |
| App Store sitemap input | Passed on 2026-06-11 | Node JSON parse of `config/apps.json` returned 150 app records. |
| Report contract token check | Passed on 2026-06-11 | Node token check returned `PASS 26 report tokens`. |
| Customer detail layout coverage check | Passed on 2026-06-11 | Direct text check found `app/[lang]/customers/[slug]/layout.tsx` in the Phase 4 route classification table. |
| Candidate count check | Passed on 2026-06-11 | Node count check returned 17 detailed candidate findings and 6 Phase 4 candidate findings. |
| Audit-only scoped diff check | Passed on 2026-06-11 | `git diff --name-only -- app components new-components lib config content source.config.ts next.config.mjs vercel.json public .github Dockerfile package.json package-lock.json \| sed '/^$/d'` returned no changed paths. |

## Phase 5: Function-Level Hotspots and Native Rendering

Phase 5 records helper-level performance root causes beneath the Phase 2, Phase
3, and Phase 4 route and subsystem findings. It covers HOTSPOT-01 through
HOTSPOT-04 with source-text scans, local font/background counts, duplicate-key
registry updates, and guarded skipped validation for runtime-heavy checks.

### Hotspot Inventory Summary

| Hotspot Class | Source Evidence | Owning Boundaries | Performance Reason | Validation Coverage | Duplicate Key |
|---------------|-----------------|-------------------|--------------------|---------------------|---------------|
| Synchronous filesystem | `lib/utils/blog-utils.ts` uses `fs.existsSync`, `fs.readdirSync`, and `fs.statSync`; `scripts/generate-apps-api.js` uses `fs.existsSync`, `fs.mkdirSync`, `fs.rmSync`, and `fs.writeFileSync`; `config/apps-data-quality.test.mts` and source-text tests read fixtures. | `lib`, `scripts`, `config` | Filesystem work is present on blog helper paths, generator paths, and validation support paths. Promoted findings focus on executable helpers and build/request surfaces. | source-text only | `fumadocs-search-index`, `remote-template-build-step` |
| Shell execution | `scripts/generate-apps-api.js:16` imports `execSync`; `scripts/generate-apps-api.js:388` shells to `curl`; `scripts/url-index-audit.sh` contains multiple `curl` calls. | `scripts` | Build and audit scripts can block on shell/network calls; the generator path is part of production build coupling. | source-text only | `remote-template-build-step` |
| CPU-heavy loops and nested transforms | `lib/og-canvas.ts` loops over triangle grid rows/columns and wrapped text words; `lib/utils/blog-utils.ts` filters, maps, sorts, and scores article groups; `app/sitemap.ts`, App Store helpers, and comparison helpers aggregate corpus-sized lists. | `lib`, `app`, `components`, `config` | CPU scales with render dimensions, content corpus size, app records, route params, and repeated derived-data transformations. | source-text only | `og-native-rendering`, `fumadocs-search-index`, `app-store-data-pipeline`, `static-export-route-classification` |
| Markdown/MDX processors | `app/llms.txt/route.ts` imports `fast-glob`, `gray-matter`, `remark`, `remarkMdx`, `remarkInclude`, `remarkGfm`, and `remarkStringify`; `lib/utils/content-utils.ts` uses `remark`, `remarkGfm`, and `remark-html`; `lib/remark/remark-mermaid.ts` walks the remark tree. | `app`, `lib`, `content` | Markdown processing can duplicate Fumadocs traversal and add CPU/filesystem cost to generated text, blog schema, and MDX build paths. | source-text only | `static-export-route-classification`, `fumadocs-search-index` |
| Native rendering | `app/api/og/route.ts` calls `drawCanvas()` and `sharp(...).webp().toBuffer()`; `lib/og-canvas.ts` registers fonts, creates canvas surfaces, loads images, and returns PNG buffers; blog thumbnails use `satori` and `ImageResponse`. | `app/api`, `lib`, `fonts`, `Dockerfile`, `package.json` | Canvas, Sharp, satori, ImageResponse, local fonts, and Docker native libraries can dominate request/static-generation cost and deployment variance. | local counts, source-text only | `og-native-rendering` |
| Network fan-out and concurrency | Generator fetches template list/source data, runtime apps API fetches remote templates, `use-template-source` has remote fallback, README candidates fetch with `cache: 'force-cache'`, shared auth/email flows fetch external endpoints, and Turnstile route posts to Cloudflare. | `scripts`, `lib`, `hooks`, `new-components`, `app/api`, `components` | User-facing interactions, request handlers, and builds can wait on external services or serial remote work. | source-text only | `remote-template-build-step`, `app-store-data-pipeline`, `app-detail-remote-readme`, `shared-auth-interaction-check`, `turnstile-request-verification` |

### Native Rendering Table

| Surface | Files | Trigger Path | Native/Rendering Work | Cache / Key Evidence | Local Counts | Deployment Variance | Validation Coverage | Duplicate Key |
|---------|-------|--------------|-----------------------|----------------------|--------------|---------------------|---------------------|---------------|
| `/api/og` | `app/api/og/route.ts`, `lib/og-canvas.ts`, `fonts/**`, `package.json`, `Dockerfile` | Request to `/api/og` | `drawCanvas()` creates a 1200x630 canvas, draws background/text/logo/icon layers, returns a PNG buffer, and `sharp` encodes WebP at quality 90. | Response sets `Cache-Control: public, max-age=86400`; route has a fixed image output path and cache granularity at the endpoint level. | Fonts: `arial.ttf` 915,212 bytes, `arial-bold.ttf` 57,448 bytes, `NotoSansSC-Black.ttf` 10,541,596 bytes. | Docker installs cairo, pango, jpeg, gif, rsvg, freetype, harfbuzz, fribidi, fontconfig, and curl for native image dependencies. | local counts, source-text only | `og-native-rendering` |
| Blog thumbnail route | `app/api/blog/[lang]/[slug]/thumbnail/[format]/route.ts`, `template.tsx`, `bgs/*.tsx`, `fonts/**` | `/api/blog/[lang]/[slug]/thumbnail/[format]` and static params | `generateStaticParams()` multiplies languages, posts, and three pregenerated formats; every render path loads three fonts and uses `satori` for SVG or `ImageResponse` for PNG. | Route path carries `lang`, `slug`, `format`, dimensions, and DPR; response sets `Cache-Control: public, max-age=86400`. | Five background TSX files total 156,597 bytes; largest are `WhatIsBg.tsx` at 2,847 lines / 82,149 bytes and `AppStoreChoicesBg.tsx` at 987 lines / 22,425 bytes. | Uses Next OG/ImageResponse, satori, local fonts, and static-export-sensitive route handling. | local counts, source-text only | `og-native-rendering` |
| Local fonts | `fonts/arial.ttf`, `fonts/arial-bold.ttf`, `fonts/NotoSansSC-Black.ttf` | Canvas and thumbnail renderers | Canvas registers all three fonts at module load; thumbnail renderer reads all three fonts with `Promise.all()` through `getFonts()`. | Font data is loaded from repository files; cache behavior is renderer/runtime dependent. | Total counted bytes: 11,514,256 across font files; combined font/background count command total included 11,670,853 bytes. | Font availability and native text shaping can differ by local shell, Docker builder, and hosting runtime. | local counts, source-text only | `og-native-rendering` |

### Network And Fan-Out Table

| Surface | Files | Trigger Path | Fan-Out / Network Work | Cache / State Evidence | Performance Reason | Validation Coverage | Duplicate Key |
|---------|-------|--------------|------------------------|------------------------|--------------------|---------------------|---------------|
| Template generator | `scripts/generate-apps-api.js` | `npm run generate-apps`, `npm run build`, CI/Docker build | Fetches template list, serially processes templates, shells to `curl` for icon downloads, fetches template sources, and writes generated JSON. | Uses generated snapshots and optional clean mode; no bounded concurrency in the serial loop. | Build time scales with remote template latency, icon latency, accepted template count, and write churn. | source-text only | `remote-template-build-step` |
| Runtime App Store API and deploy source | `lib/api/apps-api.ts`, `hooks/use-template-source.ts`, `new-components/DeployModal/**`, `config/site.ts` | `/api/apps`, deploy click, deploy modal open | Runtime fetches remote templates and sorts converted apps; template-source hook imports local JSON and falls back to `${siteConfig.templateApiEndpoint}/api/getTemplateSource`. | Loader and hook state provide local/static fallback, loading, and error state. | Request and interaction latency can include remote API fetches, loops, sorts, and deploy-source fallback work. | source-text only | `app-store-data-pipeline` |
| README and markdown interactions | `app/[lang]/products/app-store/[slug]/components/ReadmeMarkdownWindow.tsx`, `components/page-actions.tsx` | App detail README preview, copy/open markdown actions | README loader iterates candidates with `fetch(candidate.url, { cache: 'force-cache' })`; page actions fetch `markdownUrl`. | Uses platform cache hints for README fetches; interaction helpers fetch raw markdown on demand. | Detail and docs actions can wait for remote markdown and full text normalization/rendering. | source-text only | `app-detail-remote-readme`, `fumadocs-search-index` |
| Shared auth and email | `hooks/use-auth-redirect.ts`, `lib/utils/shared-auth.ts`, `new-components/AuthForm/**`, `new-components/DeployModal/**`, `config/site.ts` | Get started click, deploy click, auth modal email request/verify | `verifySharedAuth()` fetches `/api/auth/verifySharedToken` with credentials; auth form posts to email request and verify endpoints. | Browser/modal state decides redirect or auth form after network response. | Interaction completion can be gated by sequential shared-auth and email endpoint latency. | source-text only | `shared-auth-interaction-check` |
| Turnstile verification | `app/api/abuse/verify-turnstile/route.ts`, `app/[lang]/abuse/components/abuse-form.tsx`, `config/site.ts` | Abuse form submit | Client posts to `/api/abuse/verify-turnstile`; route parses JSON, updates a process-local `Map`, and posts to Cloudflare siteverify. | Rate-limit map cleans expired entries when size exceeds 1000; route uses forwarded IP and Cloudflare IP headers. | Request latency and failure behavior depend on external Turnstile verification and process-local rate-limit state. | source-text only | `turnstile-request-verification` |
| Analytics-adjacent paths | `components/analytics/**`, `hooks/use-gtm.ts`, `hooks/use-button-handler.ts`, `lib/gtm-utils.ts`, `app/[lang]/layout.tsx` | Page entry and button/video/share interactions | GTM, Clarity, Rybbit, Baidu, and Google Analytics script paths plus `trackButton` and `trackCustom` helpers. | Layout adds DNS prefetch/preconnect; script loading and bundle scoring are Phase 6 ownership. | Third-party analytics can affect page entry and interaction timing; full scoring remains in the frontend phase. | source-text only | `shared-layout-bundle-cost` |

### Phase 5 Findings

| ID | status | severity | phase | files | entry point | module boundary | work type | execution timing | evidence | root cause | impact | remediation direction | validation coverage | duplicate key | dismissal rationale |
|----|--------|----------|-------|-------|-------------|-----------------|-----------|------------------|----------|------------|--------|-----------------------|---------------------|---------------|---------------------|
| PERF-501 | candidate | high | 5 | `app/api/og/route.ts`, `lib/og-canvas.ts`, `fonts/**`, `package.json`, `Dockerfile` | `/api/og` | `app/api`, `lib`, `fonts`, `Dockerfile`, `package.json` | native rendering, CPU, asset | request, Docker, deployment | `app/api/og/route.ts` calls `drawCanvas()` and `sharp(canvasBuffer).webp({ quality: 90 }).toBuffer()`; `lib/og-canvas.ts` registers fonts, creates a 1200x630 canvas, loads images, draws grid/text/icon layers, and returns a PNG buffer; font counts found `fonts/NotoSansSC-Black.ttf` at 10,541,596 bytes. | `/api/og` performs native canvas drawing, font/image loading, PNG buffering, and Sharp WebP encoding on the route path. | Cache misses or hosting paths that execute the handler can pay CPU, memory, native dependency, and deployment-parity cost. | Pre-generate stable OG images or add route-level static output, renderer cache keys, and native runtime timing in a guarded fix phase. | local counts, source-text only | `og-native-rendering` | n/a |
| PERF-502 | candidate | high | 5 | `app/api/blog/[lang]/[slug]/thumbnail/[format]/route.ts`, `app/api/blog/[lang]/[slug]/thumbnail/[format]/template.tsx`, `app/api/blog/[lang]/[slug]/thumbnail/[format]/bgs/**`, `fonts/**` | Blog thumbnail route | `app/api`, `fonts` | native rendering, CPU, filesystem I/O | static generation, request, deployment | The route expands `generateStaticParams()` across languages, posts, and three pregenerated formats, reads three fonts with `Promise.all()`, uses `satori` for SVG, and uses `ImageResponse` for PNG; background counts found five TSX files totaling 156,597 bytes. | Blog thumbnails multiply font reads and JSX/SVG rendering work across route params, formats, and output types. | Static generation or request-time rendering can grow with blog corpus size, large background components, DPR/dimension variants, and local font size. | Pre-generate common thumbnails, memoize font buffers per process, cap variant dimensions, and add guarded renderer timing under Node 20. | local counts, source-text only | `og-native-rendering` | n/a |
| PERF-503 | candidate | high | 5 | `app/llms.txt/route.ts`, `content/docs/**`, `source.config.ts` | `/llms.txt` | `app`, `content` | filesystem I/O, CPU | static generation, request, deployment | `app/llms.txt/route.ts` imports `fast-glob`, `gray-matter`, `remark`, `remarkMdx`, `remarkInclude`, `remarkGfm`, and `remarkStringify`, maps every localized docs file, awaits `Promise.all()`, and joins the serialized output. | `llms.txt` duplicates direct docs filesystem traversal and markdown processing outside the canonical Fumadocs loader. | Static export or runtime execution can pay full-doc scan and remark CPU cost as docs corpus size grows. | Precompute language-specific `llms.txt` artifacts or share a bounded content-loader output with byte budgets and static-export route classification. | source-text only | `static-export-route-classification` | n/a |
| PERF-504 | candidate | medium | 5 | `lib/utils/blog-utils.ts`, `app/[lang]/(home)/blog/**`, `content/blog/**` | Blog listing, category, article related helpers | `lib`, `app/[lang]`, `content` | filesystem I/O, CPU | static generation, page entry | `lib/utils/blog-utils.ts` checks category directories with synchronous filesystem calls, filters language/category/tag lists, sorts posts by date, builds tag sets, scores related articles, partitions groups, and sorts each relevance group. | Blog helper work combines sync category scans, repeated filters/sorts, and related scoring over the blog corpus. | Static generation and page-entry helper cost can grow with blog post count, category count, tags, and related-article selection. | Precompute category and related-article indexes or memoize corpus-derived blog helper outputs per language/category. | source-text only | `fumadocs-search-index` | n/a |
| PERF-505 | candidate | high | 5 | `scripts/generate-apps-api.js`, `config/apps.json`, `config/template-sources.json`, `public/images/apps/**` | `npm run generate-apps`, `npm run build`, CI/Docker build | `scripts`, `config/apps.json`, `config/template-sources.json`, `public/images/apps` | network, filesystem I/O, developer workflow | build, CI, Docker | `scripts/generate-apps-api.js` fetches template lists, serially loops `for (const template of templates)`, calls `downloadIcon()`, shells to `curl` with `execSync()`, fetches template source data, sorts app configs, and writes generated JSON. | Build-time template processing serializes remote fetches, icon downloads, shell execution, and generated snapshot writes. | Build and CI latency can scale with upstream template API latency, icon latency, template count, and generated asset churn. | Split remote refresh from ordinary builds, add bounded concurrency and cache-aware icon/source fetching, and keep generated diff guards. | source-text only | `remote-template-build-step` | n/a |
| PERF-506 | candidate | medium | 5 | `lib/api/apps-api.ts`, `hooks/use-template-source.ts`, `new-components/DeployModal/**`, `config/site.ts` | `/api/apps`, deploy modal template-source lookup | `lib`, `hooks`, `new-components`, `config` | network, CPU | request, interaction | `lib/api/apps-api.ts` fetches the template API, loops over templates, converts and sorts apps, then falls back to static apps; `hooks/use-template-source.ts` imports local JSON and fetches `${siteConfig.templateApiEndpoint}/api/getTemplateSource` on misses before deploy modal state resolves. | Runtime App Store and deploy paths mix remote API fetches, per-template conversion, sorting, local JSON fallback, and remote template-source fallback. | Request and deploy-click latency can vary by remote template API health and local snapshot completeness. | Consolidate runtime/static shape contracts, make remote fallbacks explicit in UX/state, and add timing/fallback probes behind external-service guards. | source-text only | `app-store-data-pipeline` | n/a |
| PERF-507 | candidate | medium | 5 | `hooks/use-auth-redirect.ts`, `lib/utils/shared-auth.ts`, `new-components/AuthForm/**`, `new-components/DeployModal/**`, `config/site.ts` | Get started, deploy auth handoff, auth modal email request/verify | `hooks`, `lib`, `new-components`, `config` | network | interaction | `useAuthRedirect()` and deploy modal paths await `verifySharedAuth()`; `lib/utils/shared-auth.ts` fetches `/api/auth/verifySharedToken` with `credentials: 'include'`; `new-components/AuthForm/AuthFormContext.tsx` posts to `siteConfig.emailRequestEndpoint`; `VerifyCodeStep.tsx` posts to `siteConfig.emailVerifyEndpoint`. | Auth and deploy interactions can be gated by shared-auth verification plus email request/verification network calls. | Get-started and deploy flows can feel delayed by sequential external checks before navigation, form state, or successful verification. | Add interaction timing, visible pending states, and shared-auth/email retry budgets in a later frontend/API fix phase. | source-text only | `shared-auth-interaction-check` | n/a |
| PERF-508 | candidate | medium | 5 | `app/api/abuse/verify-turnstile/route.ts`, `app/[lang]/abuse/components/abuse-form.tsx`, `config/site.ts` | Abuse form Turnstile verification | `app/api`, `app/[lang]`, `config` | network, CPU | request, interaction, deployment | Abuse form posts to `/api/abuse/verify-turnstile`; the route reads forwarded IP headers, updates `rateLimitState`, cleans expired entries when the map exceeds 1000 entries, requires `TURNSTILE_SECRET_KEY`, posts to Cloudflare `siteverify`, and validates success details. | Abuse submissions depend on request-time external Turnstile verification and process-local rate-limit map cleanup. | Form submission latency, error rate, and deployment behavior can vary by Cloudflare response time, process lifetime, and hosting support for the route. | Add guarded local route smoke under Node 20, external-service timeout/error budgets, and deployment route matrix coverage in Phase 7. | source-text only | `turnstile-request-verification` | n/a |

### Phase 5 Skipped Validation

| Validation | Status | Reason | Guard For Future Run | Validation Coverage |
|------------|--------|--------|----------------------|---------------------|
| `npm run build` | skipped | It runs `npm run generate-apps` first and can call remote APIs, download icons, and rewrite generated data/assets. | Capture generated-file diff before and after. | manual only |
| `npm run build:analyze` | skipped | It runs the generator first, and bundle scoring belongs to Phase 6. | Use Phase 6 bundle plan with generated-file guard. | manual only |
| `npm run generate-apps` | skipped | It calls remote template APIs, shells to `curl`, writes JSON, and can change app images. | Run only with explicit generated snapshot timing objective and diff guard. | manual only |
| `/api/og` endpoint load | skipped | It executes native canvas/Sharp rendering and depends on static-export/hosting context. | Single local smoke under Node 20 with no load loop. | manual only |
| Blog thumbnail endpoint load | skipped | It can execute font reads, satori, and ImageResponse rendering. | Single local smoke under Node 20 with no load loop. | manual only |
| Docker build | skipped | Native dependency and deployment parity belong to Phase 7. | Docker-capable environment with cache state recorded. | unvalidated |
| Production endpoint stress | skipped | v1 audit excludes production load testing. | Separate operational approval and rate limits. | unvalidated |
| External Turnstile/auth/template API probes | skipped | Probes would send real traffic to external services. | Use source evidence in Phase 5; add explicit service guard later. | source-text only |

### Phase 5 Validation

| Check | Result | Evidence |
|-------|--------|----------|
| Environment snapshot | Gap recorded on 2026-06-11 | `node --version` returned `v24.13.0`, `npm --version` returned `11.6.2`, `.nvmrc` is `20`, `.source` returned `SOURCE_MISSING`, branch output was `HEAD`, symbolic ref returned `DETACHED`, and pre-existing unrelated changes were present in `.planning/config.json` and `.planning/phases/01-audit-ledger-and-module-inventory/01-RESEARCH.md`. |
| HOTSPOT-01 source scan | Passed on 2026-06-11 | `rg -n "execSync|spawnSync|curl|existsSync|readdirSync|statSync|readFileSync|writeFileSync|rmSync|mkdirSync|fast-glob|gray-matter|remark|remarkGfm|remarkMdx|remarkStringify|ReactMarkdown|createCanvas|registerFont|loadImage|sharp|satori|ImageResponse|fetch\(|Promise\.all|for \(|while \(|\.map\(|\.filter\(|\.sort\(" app lib hooks scripts config components new-components source.config.ts package.json Dockerfile` found sync filesystem, shell, loops, markdown processors, native rendering, and network/fan-out evidence across Phase 5 boundaries. |
| HOTSPOT-02 native scan | Passed on 2026-06-11 | Native scan found `drawCanvas`, `createCanvas`, `registerFont`, `loadImage`, `toBuffer`, `sharp`, `webp`, `satori`, `ImageResponse`, font reads, cache headers, `generateStaticParams`, format constants, dimension/DPR caps, package deps, and Docker native dependency evidence. |
| Font and background counts | Passed on 2026-06-11 | `stat` counted `fonts/arial.ttf` 915,212 bytes, `fonts/arial-bold.ttf` 57,448 bytes, and `fonts/NotoSansSC-Black.ttf` 10,541,596 bytes; background `wc` counted five TSX files totaling 156,597 bytes, with `WhatIsBg.tsx` at 2,847 lines / 82,149 bytes. |
| HOTSPOT-03 network scan | Passed on 2026-06-11 | Network scans found generator fetch/source/icon paths, runtime app API conversion, template-source fallback, shared auth, deploy modal auth checks, email request/verify endpoints, Turnstile siteverify route, README `cache: 'force-cache'`, page markdown fetches, GTM helpers, and analytics script loaders. |
| HOTSPOT-04 report contract | Passed on 2026-06-11 | Phase 5 report token checks, candidate ID checks for PERF-501 through PERF-508, duplicate key checks including `shared-auth-interaction-check` and `turnstile-request-verification`, and schema row checks passed after the report update. |
| Scoped audit-only diff | Passed on 2026-06-11 | Scoped diff over application source, content, generated data, deployment config, package, script, hook, font, and asset paths returned empty output. |
| Guarded checks | Skipped on 2026-06-11 | Build, analyzer, generator refresh, endpoint load, Docker build, production stress, and external service probes were skipped per Phase 5 audit-only scope. |

## Phase 6: Shared Shell, Bundle, Assets, and Interaction Performance

Phase 6 establishes the shared localized shell as the baseline every localized
route can inherit, then records route-local bundle, asset, media, animation,
hydration, and interaction findings as incremental cost above that baseline.
The evidence refresh used source/count commands only. Analyzer, build,
generator, Docker, browser trace, production probe, package install/update,
asset rewriting, and external auth/Turnstile/template calls stayed skipped
because the build/analyzer path invokes generated app refreshes and those
commands can mutate generated JSON or public app images.

### Environment Snapshot

| Command | Key Output | Phase 6 Meaning |
|---------|------------|-----------------|
| `pwd` | `/Users/longnv/.codex/worktrees/85a0/sealos.io` | Execution ran in the requested worktree. |
| `node --version` | `v24.13.0` | Local shell differs from the canonical `.nvmrc` Node 20 runtime; report evidence remains source/count only. |
| `npm --version` | `11.6.2` | npm was observed without installing or updating packages. |
| `cat .nvmrc` | `20` | Project runtime remains Node 20. |
| `git rev-parse --abbrev-ref HEAD` | `HEAD` | Worktree is detached in this shell. |
| `git symbolic-ref --quiet HEAD || echo DETACHED` | `DETACHED` | Commit safety requires special handling; audit edits remain scoped. |
| `test -d .source && echo SOURCE_PRESENT || echo SOURCE_MISSING` | `SOURCE_MISSING` | Fumadocs generated source is absent, so build/analyzer checks stay skipped. |

### Shared Shell Baseline

| Surface | Scope | Evidence | Performance Reason | Validation Coverage | Duplicate Key |
|---------|-------|----------|--------------------|---------------------|---------------|
| Locale layout shell | shared shell baseline | `app/[lang]/layout.tsx` imports `Analytics`, `GTMBody`, `DefaultSearchDialog`, `HomepageDarkMode`, `ConditionalSiteBanner`, `AuthFormProvider`, `DeployModalProvider`, `AuthForm`, and `DeployModal`, then mounts them around every localized route. | Every localized route can inherit provider, modal, analytics, search, and shell hydration before route-local content runs. | source-text only | `shared-layout-bundle-cost` |
| Analytics and GTM body | shared shell baseline | `components/analytics/index.tsx` contains timers, interaction listeners, script loaders, and analytics providers; `components/analytics/gtm-body.tsx` contributes the GTM iframe fallback. | Third-party script scheduling and listeners are part of the page-entry baseline. | source-text only | `shared-layout-bundle-cost` |
| Fumadocs provider and search | shared shell baseline plus reused search key | `app/[lang]/layout.tsx` passes `DefaultSearchDialog`; `components/docs/Search.tsx` uses `useDocsSearch` with static Orama search and Mandarin tokenizer. | Docs search client code is reachable from the shared provider, while payload/index growth remains the Phase 4 search key. | source-text only | `shared-layout-bundle-cost`, `fumadocs-search-index` |
| Shared auth and deploy modals | shared shell baseline plus reused auth key | `new-components/AuthForm/**`, `new-components/DeployModal/**`, `hooks/use-auth-redirect.ts`, and `hooks/use-template-source.ts` combine Radix dialogs, Motion animation, Turnstile, email endpoints, shared-auth verification, and template-source lookup. | Globally mounted modal providers and interaction code add route-wide hydration reach; request-time auth and Turnstile behavior reuses Phase 5 ownership. | source-text only | `shared-layout-bundle-cost`, `shared-auth-interaction-check`, `turnstile-request-verification` |
| Header and footer shell | shared shell baseline | `new-components/Header.tsx` imports Motion, Radix navigation, Lucide icons, GTM/auth helpers, and scroll state; `new-components/Footer/SealosSticky.tsx` uses Motion scroll state, `requestAnimationFrame`, scroll, and resize listeners. | Shared navigation and footer code can add first-load bundle and scroll scheduling cost across routes that use the new shell. | source-text only | `shared-layout-bundle-cost` |

### Client Boundary Inventory

| Group | Count | Evidence | Performance Reason |
|-------|-------|----------|--------------------|
| All client boundaries in audited frontend paths | 177 | `rg -l "^'use client'\|^\"use client\"" app components new-components hooks \| sort \| wc -l` returned `177`. | Client boundary count gives a source-level ceiling for hydration and route chunk surfaces before analyzer confirmation. |
| Shared shell and shared UI surfaces | 77 observed in research grouping | Phase 6 research grouped 28 shared shell files and 49 shared/UI primitive files from the 177 client files. | Shared boundaries can be inherited by many routes and should be separated from route-local incremental costs. |
| New-home route-local visual surfaces | 26 observed in research grouping | Phase 6 research grouped new-home files under `app/[lang]/(home)/(new-home)/**`. | Visual route costs are incremental above the shared shell baseline. |
| App Store, product, docs/blog/content, customer, and solution surfaces | 68 observed in research grouping | Phase 6 research grouped App Store 8, product 8, docs/blog/content 24, customers 8, and solutions 20. | These surfaces should keep route ownership when findings are scored. |

### Bundle Dependency Map

| Dependency / Surface | Source Trace | Route Ownership | Performance Reason | Validation Coverage | Duplicate Key |
|----------------------|--------------|-----------------|--------------------|---------------------|---------------|
| `motion/react` | Import scan found Motion traces in shared header/footer, AuthForm, DeployModal, animated UI primitives, DevBox, customer TOC, and new-home sections. | shared shell and route-local | Scroll state, in-view checks, animated dialogs, and route-local visual effects can add bundle and scheduling cost. | source-text only; analyzer skipped | `shared-layout-bundle-cost`, `visual-animation-loop-cost`, `customer-interaction-scheduling` |
| `framer-motion` | Import scan found Framer Motion traces in new-home components such as prompt, workflow, caps, hero, and carousel sections. | new-home route-local | Route-local Framer Motion imports are incremental above the shared shell baseline. | source-text only; analyzer skipped | `visual-animation-loop-cost` |
| `matter-js` | `app/[lang]/(home)/(new-home)/components/FallingTags.tsx` imports `matter-js`. | new-home route-local | Physics engine work and rAF loops belong to the visual-heavy route. | source-text only; analyzer skipped | `visual-animation-loop-cost` |
| `react-player/lazy` | `components/video.tsx` dynamically imports `react-player/lazy`. | product/video interaction | Player code is delayed until the video component path but still belongs to media interaction scoring. | source-text only; analyzer skipped | `visual-animation-loop-cost` |
| `mermaid` | `components/mdx/mermaid.tsx` dynamically imports `mermaid`. | docs/blog MDX widget | Mermaid is route-local docs/blog widget work, while search/content payload ownership remains Phase 4. | source-text only; analyzer skipped | `fumadocs-search-index` |
| `lucide-react` | Import scan found Lucide traces across shared header, UI components, App Store, product, solution, customer, blog, comparison, and AI quick reference surfaces. | shared shell and route-local | Icon imports have broad ownership; `next.config.mjs` attempts package import optimization for `lucide-react`. | source-text only; analyzer skipped | `shared-layout-bundle-cost` |
| Radix UI | Import scan found Radix dialogs, navigation menu, dropdown, select, switch, tooltip, visually hidden, and icon primitives across shared modals, new-home modal, UI primitives, and App Store states. | shared shell and route-local | Accessible primitives add client bundle and interaction behavior; ownership depends on mounted route. | source-text only; analyzer skipped | `shared-layout-bundle-cost`, `visual-animation-loop-cost` |
| Fumadocs UI | `app/[lang]/layout.tsx`, docs layouts/pages, blog article pages, and `components/docs/Search.tsx` import Fumadocs UI/provider/search/page components. | shared shell and docs/blog | Fumadocs provider/search are shell-reachable; docs/blog rendering is route-local. | source-text only; analyzer skipped | `shared-layout-bundle-cost`, `fumadocs-search-index` |
| Turnstile UI | `new-components/AuthForm/SelectMethodStep.tsx` and `app/[lang]/abuse/components/abuse-form.tsx` import `@marsidev/react-turnstile`. | shared auth modal and abuse route | Turnstile UI appears in shared auth and abuse interactions; request verification remains the Phase 5 key. | source-text only; external calls skipped | `shared-auth-interaction-check`, `turnstile-request-verification` |
| `three` | Package is declared, but the source import scan found no `from 'three'` matches in audited paths. | no current route owner found | Package presence alone is not promoted into a Phase 6 finding without route ownership or import trace. | source-text only | n/a |

### Asset Inventory

| Asset Group | Count / Size | Largest / Risky Files | Performance Reason | Validation Coverage | Duplicate Key |
|-------------|--------------|-----------------------|--------------------|---------------------|---------------|
| `public` | 16,728 KB | `public/images/quick-start.png` 1,065,159 bytes; `public/ai-faqs.en.json` 790,807 bytes; customer PNGs above 500 KB. | Static export serves these assets directly, so transfer and cache behavior depend on source size and host policy. | local counts | `static-export-asset-delivery` |
| `assets` | 1,204 KB | `assets/hero-grid.svg` 240,230 bytes; `assets/video-thumbnail.svg` 183,458 bytes. | Imported assets can affect route chunks or first-viewport visual transfer depending on component ownership. | local counts | `static-export-asset-delivery`, `visual-animation-loop-cost` |
| `fonts` | 11,252 KB across 3 files | `fonts/NotoSansSC-Black.ttf` 10,541,596 bytes; `fonts/arial.ttf` 915,212 bytes. | Browser/static delivery belongs to Phase 6 asset inventory; native renderer input remains `og-native-rendering`. | local counts | `static-export-asset-delivery`, `og-native-rendering` |
| `public/images` | 14,924 KB | Customer, DevBox, dashboard, archive, banner, and app images dominate the largest local files list. | Image transfer risk is cross-route and static-export-sensitive. | local counts | `static-export-asset-delivery` |
| `public/images/apps` | 4,604 KB | Largest observed app files include `happy-server.png` 608,306 bytes, `rybbit.png` 389,192 bytes, and `eaglercraft-server.svg` 151,997 bytes. | App media density is App Store-owned when rooted in generated media shape; generic static delivery remains Phase 6. | local counts | `app-store-data-pipeline`, `static-export-asset-delivery` |
| Extension mix | 483 files total: 264 SVG, 170 PNG, 18 ICO, 13 JPG, 5 WEBP, 5 JPEG, 3 TTF, plus single manifest/text/json/header/redirect files. | SVG and PNG dominate file count; local font bytes dominate size. | Extension mix highlights optimization targets for image policy, SVG policy, and font delivery. | local counts | `static-export-asset-delivery` |

### Image Policy

| Config Surface | Evidence | Static Export Implication | Validation Coverage | Duplicate Key |
|----------------|----------|---------------------------|---------------------|---------------|
| `images.unoptimized: true` | `next.config.mjs` sets `images.unoptimized: true`. | Browser receives source/remote image assets without Next image optimization output in static export. | source-text only | `static-export-asset-delivery` |
| Remote image hosts | `next.config.mjs` allows `oss.laf.run`, `images.tryfastgpt.ai`, `cdn.jsdelivr.net`, `images.sealos.run`, and `raw.githubusercontent.com`. | Remote image latency and cache behavior can vary outside the static export artifact. | source-text only | `static-export-asset-delivery`, `app-store-data-pipeline` |
| SVG policy | `next.config.mjs` sets `dangerouslyAllowSVG: true` and a restrictive `contentSecurityPolicy`. | SVG delivery is allowed and must rely on source hygiene, CSP, and host headers. | source-text only | `static-export-asset-delivery` |
| Cache TTL | `next.config.mjs` sets `minimumCacheTTL: 60`. | Static export and host behavior can dominate effective image caching. | source-text only | `static-export-asset-delivery` |
| Package import optimization | `next.config.mjs` includes `optimizePackageImports` for `fumadocs-ui`, `fumadocs-core`, `lucide-react`, `motion`, and selected Radix packages. | The config attempts bundle import optimization, but analyzer confirmation is deferred behind generated-file guards. | source-text only; analyzer skipped | `shared-layout-bundle-cost` |

### Interaction Trace

| Interaction | Files | Source Trigger | Shared / Incremental Scope | Performance Reason | Duplicate Key |
|-------------|-------|----------------|----------------------------|--------------------|---------------|
| App Store filters, sort, pagination, cards, deploy | `components/app-store/app-grid.tsx`, `app/[lang]/products/app-store/components/app-store-browser-utils.ts`, `new-components/DeployModal/**` | `useMemo` category counts and visible apps, state changes, deploy modal opening, template-source fetch fallback. | route-local incremental above shared shell | App list transformations and deploy lookup reuse App Store ownership; modal bundle reach also touches shared shell. | `app-store-data-pipeline`, `shared-layout-bundle-cost` |
| App detail README and media | `app/[lang]/products/app-store/[slug]/components/ReadmeMarkdownWindow.tsx`, `Screenshots.tsx`, `AppPreviewPanel.tsx` | `fetch(candidate.url)`, `ReactMarkdown`, screenshot/image rendering. | route-local incremental above shared shell | README fetch/render and media density can delay detail-page content and interactions. | `app-detail-remote-readme`, `app-store-data-pipeline` |
| Docs search and Mermaid | `components/docs/Search.tsx`, `components/mdx/mermaid.tsx` | `useDocsSearch`, static Orama search, dynamic `import('mermaid')`, SVG render state. | shared shell search plus route-local widget | Search is shell-reachable; Mermaid is route-local docs/blog client widget work. | `shared-layout-bundle-cost`, `fumadocs-search-index` |
| Auth, deploy, and Turnstile | `new-components/AuthForm/**`, `new-components/DeployModal/**`, `hooks/use-auth-redirect.ts`, `app/[lang]/abuse/components/abuse-form.tsx` | Dialog state, Motion animation, email request/verify fetches, shared-auth fetches, Turnstile widget callbacks. | shared shell plus route-specific abuse | User actions can wait on auth/deploy checks or request-time Turnstile verification. | `shared-layout-bundle-cost`, `shared-auth-interaction-check`, `turnstile-request-verification` |
| New-home visuals and video | `app/[lang]/(home)/(new-home)/**`, `new-components/GodRays.tsx` | `requestAnimationFrame`, `setTimeout`, `setInterval`, `IntersectionObserver`, `ResizeObserver`, `useInView`, `useScroll`, Matter engine update loop, YouTube iframe `postMessage`. | route-local incremental above shared shell | Visual loops, physics, scroll transforms, observers, and media modal work can affect main-thread scheduling. | `visual-animation-loop-cost` |
| Customer route interactions | `app/[lang]/customers/**` | TOC heading extraction timers, scroll/resize listeners, rAF bounds updates, testimonial interval, customer markdown render. | route-local incremental above shared shell | Customer pages add timers/listeners/filtering/markdown work beyond the shell. | `customer-interaction-scheduling` |
| AI FAQ client search | `app/[lang]/(home)/ai-quick-reference/components/FAQSearch.tsx` | Fetches `/ai-faqs.en.json`, uses Fuse filtering and debounced search/pagination. | route-local incremental above shared shell | A 790,807-byte JSON payload is fetched client-side before search can operate. | `fumadocs-search-index`, `static-export-asset-delivery` |

### Phase 6 Findings

| ID | status | severity | phase | files | entry point | module boundary | work type | execution timing | evidence | root cause | impact | remediation direction | validation coverage | duplicate key | dismissal rationale |
|----|--------|----------|-------|-------|-------------|-----------------|-----------|------------------|----------|------------|--------|-----------------------|---------------------|---------------|---------------------|
| PERF-601 | candidate | high | 6 | `app/[lang]/layout.tsx`, `components/analytics/**`, `components/docs/Search.tsx`, `new-components/AuthForm/**`, `new-components/DeployModal/**`, `new-components/Header.tsx`, `new-components/Footer/**` | Localized route shell | `app/[lang]`, `components`, `new-components`, `hooks` | bundle, hydration | page entry, interaction | `app/[lang]/layout.tsx` mounts analytics, GTM body, Fumadocs provider/search, banner/dark-mode clients, AuthForm/DeployModal providers, `AuthForm`, and `DeployModal` around localized children; the client-boundary scan returned 177 files across audited frontend paths. | The localized shell has broad globally mounted client/provider reach before route-local content runs. | Every localized route can inherit hydration, bundle, and interaction baseline cost even when the page body is static. | Split or lazy-load shell surfaces after analyzer/browser evidence, and define a shell budget that separates shared baseline from route increments. | source-text only; analyzer skipped | `shared-layout-bundle-cost` | n/a |
| PERF-602 | candidate | medium | 6 | `components/analytics/index.tsx`, `components/analytics/gtm-body.tsx`, `hooks/use-gtm.ts`, `config/analytics.ts` | Shared analytics baseline | `components`, `hooks`, `config` | bundle, hydration, network | page entry, interaction | Analytics source includes interaction listeners, 5-second fallback timers, delayed Clarity/Rybbit timers, GTM/Baidu/Google/email scripts, GTM body iframe, and button/video tracking helpers. | Third-party analytics scheduling and listener setup are part of the shared page-entry baseline. | Script loading, event listeners, fallback timers, and tracking callbacks can affect first-load and interaction timing across public routes. | Add analytics loading budgets, route-level opt-in where possible, and browser trace validation under a no-external-mutation guard. | source-text only; external probes skipped | `shared-layout-bundle-cost` | n/a |
| PERF-603 | candidate | high | 6 | `new-components/AuthForm/**`, `new-components/DeployModal/**`, `new-components/GodRays.tsx`, `hooks/use-auth-redirect.ts`, `hooks/use-template-source.ts`, `config/site.ts` | Global auth and deploy modal surface | `new-components`, `hooks`, `config` | bundle, hydration, network | page entry, interaction | Shared modal code imports Radix dialog, Motion animation, Turnstile, GodRays canvas, email request/verify fetches, shared-auth checks, local template-source JSON, and remote template-source fallback; the layout mounts both modal systems globally. | Auth/deploy UI and interaction code are globally reachable from the shared shell while also triggering network work on user actions. | Routes can carry modal hydration and bundle reach before users open a modal; deploy/auth clicks can wait on shared-auth, email, Turnstile, or template-source latency. | Gate modal internals behind user intent where feasible, keep shared-auth/template-source timing visible, and validate with analyzer plus interaction traces. | source-text only; analyzer and external calls skipped | `shared-layout-bundle-cost` | n/a |
| PERF-604 | candidate | high | 6 | `app/[lang]/(home)/(new-home)/**`, `new-components/GodRays.tsx`, `assets/hero-grid.svg`, `assets/video-thumbnail.svg` | New-home visual sections and demo video | `app/[lang]`, `new-components`, `assets` | bundle, hydration, asset | page entry, interaction | New-home source traces include Motion and Framer Motion imports, `GradientWave` canvas rAF with IntersectionObserver and ResizeObserver, `FallingTags` Matter.js physics and rAF loops, rotating words intervals, demo scroll transforms, video modal iframe and `postMessage`, plus imported SVG assets. | Visual-heavy route code stacks animation libraries, canvas loops, physics, timers, observers, and media activation above the shared shell baseline. | New-home route entry and interactions can pay main-thread scheduling, bundle, and media costs beyond the shared localized shell. | Defer route-local effects by viewport/user intent, add loop budgets, and confirm chunk and interaction cost with a guarded analyzer/browser trace. | source-text only; analyzer and browser trace skipped | `visual-animation-loop-cost` | n/a |
| PERF-605 | candidate | high | 6 | `next.config.mjs`, `public/**`, `assets/**`, `fonts/**` | Static export image and asset delivery | `next.config.mjs`, `public`, `assets`, `fonts` | asset | page entry, static generation, deployment | Asset counts found `public` 16,728 KB, `assets` 1,204 KB, `fonts` 11,252 KB, 483 files total, 264 SVG and 170 PNG files, and largest files including `fonts/NotoSansSC-Black.ttf` 10,541,596 bytes, `public/images/quick-start.png` 1,065,159 bytes, `public/ai-faqs.en.json` 790,807 bytes, and `public/images/devbox/streamlined-workflow.svg` 733,439 bytes; `next.config.mjs` sets `images.unoptimized: true`, remote patterns, `minimumCacheTTL: 60`, and `dangerouslyAllowSVG: true`. | Static export leaves browser image/font/JSON transfer and cache behavior to source assets and hosting policy. | Large fonts, PNG/SVG assets, remote image hosts, and client JSON can increase first-load transfer and route-local media cost. | Add asset budgets, image/font conversion candidates, host cache parity checks, and static-export-safe image policy review in fix/validation phases. | local counts, source-text only | `static-export-asset-delivery` | n/a |
| PERF-606 | candidate | medium | 6 | `components/app-store/app-grid.tsx`, `app/[lang]/products/app-store/components/app-store-browser-utils.ts`, `app/[lang]/products/app-store/[slug]/components/ReadmeMarkdownWindow.tsx`, `new-components/DeployModal/**`, `public/images/apps/**` | App Store grid, detail README, media, and deploy interactions | `components`, `app/[lang]`, `new-components`, `public/images/apps` | CPU, hydration, asset, network | page entry, interaction | App Store grid uses `useMemo` over category counts and visible apps, utility code filters/sorts/paginates, detail README fetches candidate URLs and renders `ReactMarkdown`, screenshots/media use static/export image policy, and deploy actions open the shared deploy modal. | App Store frontend interactions add route-local CPU/hydration/media work above the shared shell, while data/root ownership remains the existing App Store and README keys. | Filtering, pagination, README rendering, app images, and deploy modal opening can affect App Store interaction latency and page weight. | Keep App Store transformations under shared data-pipeline ownership, add UI-level interaction measurements, and evaluate derived-index or lazy README/media fixes later. | source-text only; analyzer and external README/template calls skipped | `app-store-data-pipeline` | n/a |
| PERF-607 | candidate | medium | 6 | `components/docs/Search.tsx`, `components/mdx/mermaid.tsx`, `app/[lang]/docs/**`, `app/[lang]/(home)/blog/[slug]/**` | Docs search and Mermaid widgets | `components`, `app/[lang]`, `content` | bundle, hydration, CPU | page entry, interaction | Search uses `useDocsSearch` with static Orama search and Mandarin tokenizer from the shared provider; Mermaid dynamically imports `mermaid`, initializes config, renders SVG, and stores output state for MDX diagrams. | Docs search is shell-reachable, while Mermaid adds route-local widget code and render work on docs/blog pages. | Docs/blog pages can inherit shared search client cost and add Mermaid render cost when diagrams are present. | Keep search payload/root cause under Phase 4, lazy-load diagram widgets by visibility/user intent, and verify route chunks with analyzer. | source-text only; analyzer skipped | `fumadocs-search-index` | n/a |
| PERF-608 | candidate | medium | 6 | `app/[lang]/customers/**` | Customer pages, TOC, testimonial, filters, and markdown | `app/[lang]` | hydration, CPU | page entry, interaction | Customer source traces include `ReactMarkdown`, TOC heading extraction timer, content bounds timer, scroll and resize listeners, rAF bounds updates, active-heading scroll handler, and testimonial `setInterval`. | Customer pages have route-local scheduling and markdown/filter work above the shared shell baseline. | Customer route interactions can add scroll/listener and markdown CPU cost during page entry and reading. | Consolidate scroll scheduling, precompute markdown where feasible, and add a customer-route interaction trace in validation follow-up. | source-text only; browser trace skipped | `customer-interaction-scheduling` | n/a |
| PERF-609 | candidate | medium | 6 | `app/[lang]/(home)/ai-quick-reference/components/FAQSearch.tsx`, `public/ai-faqs.en.json`, `components/docs/Search.tsx`, `source.config.ts` | AI FAQ client search payload | `app/[lang]`, `public`, `components`, `content` | asset, CPU, hydration | page entry, interaction | `FAQSearch.tsx` fetches `/ai-faqs.en.json`, debounces search, filters/paginates with Fuse, and the asset inventory counts `public/ai-faqs.en.json` at 790,807 bytes. | AI FAQ search loads a large client JSON payload and performs client-side search work as route-local cost above the shared shell. | The AI quick reference route can add transfer, hydration, and interaction CPU cost before search results feel responsive. | Shard or pre-index FAQ payloads, evaluate static search artifact size budgets, and reuse Fumadocs/search ownership where content indexing is shared. | local counts, source-text only | `fumadocs-search-index` | n/a |

### Phase 6 Skipped Validation

| Validation | Status | Reason | Guard For Future Run | Validation Coverage |
|------------|--------|--------|----------------------|---------------------|
| `npm run build:analyze` | skipped | `package.json` runs `npm run generate-apps` before `ANALYZE=true next build`, and the generator can call remote template APIs, download icons, and rewrite generated JSON/app images. | Add before/after guards for `config/apps.json`, `config/template-sources.json`, `public/images/apps`, `out`, analyzer output, and source/content/public diffs. | manual only |
| `npm run build` | skipped | Build invokes generated App Store refresh before Next build and can mutate generated artifacts. | Run only with generated-file diff guard and Node 20 runtime. | manual only |
| `npm run generate-apps` and `npm run generate-apps:clean` | skipped | Generator and clean mode can call remote services, shell to `curl`, write JSON, and rewrite or recreate app images. | Use a dedicated generated-artifact timing task with explicit diff review. | manual only |
| Docker build | skipped | Docker build installs dependencies, rewrites image paths, and runs `npm run build`, crossing package/build/generator/deployment boundaries. | Phase 7 deployment parity run in Docker-capable environment with cache and generated-file guards. | unvalidated |
| Dev server, browser trace, and visual inspection | skipped | Phase 6 made report-only edits and used source-trigger evidence; browser traces would add runtime noise and require a served app. | Run guarded browser traces after analyzer/source guards and without source mutations. | manual only |
| Production probes and endpoint polling | skipped | External service and production traffic are outside Phase 6 audit-only scope. | Separate operational approval, rate limits, and service ownership. | unvalidated |
| Auth, Turnstile, template, README, and analytics external calls | skipped | Live calls could hit external services and change request/account state. | Use mocked/local route smoke or explicit service guard in later validation. | source-text only |
| Package install/update and asset rewriting | skipped | Package files, generated data, public assets, fonts, and source assets are read-only for this plan. | Later fix phase with package legitimacy and asset diff gates. | n/a |

### Phase 6 Validation

| Check | Result | Evidence |
|-------|--------|----------|
| Environment snapshot | Gap recorded on 2026-06-11 | `node --version` returned `v24.13.0`, `npm --version` returned `11.6.2`, `.nvmrc` is `20`, branch output was `HEAD`, symbolic ref returned `DETACHED`, and `.source` returned `SOURCE_MISSING`. |
| Client boundary count | Passed on 2026-06-11 | `rg -l "^'use client'\|^\"use client\"" app components new-components hooks \| sort \| wc -l` returned `177`. |
| Dependency/import scan | Passed on 2026-06-11 | Import scan found Motion, Framer Motion, Matter.js, Mermaid dynamic import, ReactPlayer dynamic import, Lucide, Radix, Fumadocs UI, and Turnstile traces; no source import owner was found for `three`. |
| Interaction trace scan | Passed on 2026-06-11 | Source scan found analytics timers/listeners, GTM iframe, template-source fetch, header/footer scroll handling, auth/email fetches and intervals, Turnstile fetches, video/media tracking, docs search, Mermaid import, App Store README fetch/render, new-home rAF/observers/timers/iframe/postMessage, customer TOC timers/listeners/rAF, and testimonial intervals. |
| Asset inventory | Passed on 2026-06-11 | `du`, `find`, extension counts, and `stat` largest-file commands returned `public` 16,728 KB, `assets` 1,204 KB, `fonts` 11,252 KB, 483 total files, and largest file evidence listed in the Phase 6 asset table. |
| Image policy and analyzer script scan | Passed on 2026-06-11 | `next.config.mjs` scan found `optimizePackageImports`, `images`, `unoptimized`, `remotePatterns`, `minimumCacheTTL`, `dangerouslyAllowSVG`, and `contentSecurityPolicy`; `package.json` scan found `build`, `build:analyze`, `generate-apps`, and `generate-apps:clean`. |
| Report contract | Passed on 2026-06-11 | Phase 6 report token checks, candidate ID checks for PERF-601 through PERF-609, duplicate-key ownership checks, candidate count 34, and row schema checks passed after report update. |
| Scoped audit-only diff | Passed on 2026-06-11 | Scoped diff over application source, content, generated data, deployment config, package files, scripts, hooks, fonts, assets, and public files returned empty output. |

## Phase 7: Deployment Parity, Validation Gaps, and Prioritized Findings

Phase 7 closes the v1 audit as a report-only pass. It records deployment
parity, dependency/runtime baseline, validation coverage, skipped validation
guards, final finding counts, duplicate-key ownership, and grouped remediation
order. Direct fixes, package changes, generated refreshes, builds, analyzer
runs, Docker builds, deploys, browser traces, production probes, and external
service calls remain follow-up scope.

### Phase 7 Source Evidence Refresh

| Evidence Area | Result | Source / Command | Validation Coverage |
|---------------|--------|------------------|---------------------|
| Local runtime caveat | `.nvmrc` is `20`; local shell is Node `v24.13.0` and npm `11.6.2`. | `pwd && node --version && npm --version && cat .nvmrc` | tested |
| Dependency state caveat | `node_modules` is absent and `.source` is absent. | `test -d node_modules`, `test -d .source` | tested |
| Phase 6 count baseline | Current report had 34 `PERF-*` candidate rows before Phase 7 additions. | Node report parser over `docs/performance-audit.md` | tested |
| Final finding count | candidate: 36, confirmed: 0, dismissed: 0, deferred: 0 | Two Phase 7 candidate rows added: PERF-701 and PERF-702. | tested |
| Deployment command scan | Vercel, Cloudflare Pages, Docker/Nginx, GHCR, and Kubernetes command surfaces are present. | `rg -n "node-version: 20|npm install|npm ci|vercel build|pages deploy|docker/build-push-action|kubectl set image|/app/out|/usr/share/nginx/html" .github/workflows/*.yml Dockerfile package.json` | tested |
| Header/redirect/static export scan | Vercel headers/redirects, Cloudflare `_headers`/`_redirects`, static export, image policy, analyzer flag, and build scripts are present. | `rg -n "headers|redirects|Cache-Control|_headers|_redirects|robots.txt|output: 'export'|trailingSlash|unoptimized|remotePatterns|ANALYZE|generate-apps|normalize-root-locale" vercel.json public/_headers public/_redirects next.config.mjs package.json` | tested |
| Dependency lockfile scan | Package ranges and lockfile exact versions were parsed for Next, `@next/*`, MDX, Fumadocs, React, TypeScript, `canvas`, `sharp`, and `satori`. | Node JSON parser over `package.json` and `package-lock.json` | tested |
| Scoped audit-only diff | Protected source, content, generated data, deployment config, package files, scripts, hooks, fonts, assets, and public paths had no Phase 7 diff. | `git diff --name-only -- app components new-components lib config content source.config.ts next.config.mjs vercel.json public .github Dockerfile package.json package-lock.json scripts hooks fonts assets` | tested |

### Phase 7 Findings

| ID | status | severity | phase | files | entry point | module boundary | work type | execution timing | evidence | root cause | impact | remediation direction | validation coverage | duplicate key | dismissal rationale |
|----|--------|----------|-------|-------|-------------|-----------------|-----------|------------------|----------|------------|--------|-----------------------|---------------------|---------------|---------------------|
| PERF-701 | candidate | medium | 7 | `.github/workflows/deploy.yml`, `.github/workflows/preview.yml`, `.github/workflows/deploy-cloudflare.yml`, `.github/workflows/preview-cloudflare.yml`, `.github/workflows/build-image.yml`, `Dockerfile`, `vercel.json`, `public/_headers`, `public/_redirects`, `next.config.mjs`, `package.json` | Vercel, Cloudflare Pages, Docker/Nginx, GHCR, and Kubernetes deployment paths | `.github/workflows`, `Dockerfile`, `vercel.json`, `public`, `next.config.mjs`, `package.json` | developer workflow, deployment, filesystem I/O, native rendering | CI, Docker, deployment | Vercel production and preview use Node 20, `npm install`, global Vercel CLI install, `vercel pull`, `vercel build`, and prebuilt deploys; Cloudflare production and preview use Node 20, `npm ci`, `npm run build`, and `pages deploy ./out`; Docker uses `node:20-bookworm-slim`, native libraries, `scripts/replace-image-paths.sh`, `npm ci && npm run build`, and Nginx serving `/usr/share/nginx/html`; GHCR/Kubernetes builds `linux/amd64`, pushes image tags, then runs `kubectl set image` and `kubectl annotate`. | Deployment targets run different install, build, static export, header/redirect, serving, cache, route-support, and native dependency paths. | Performance fixes can validate on one host path while cache behavior, generated route behavior, native image behavior, or static asset serving differ on another path. | Add a deployment parity validation checklist and make generated static artifacts, headers, redirects, cache policy, Node/package install method, and native runtime assumptions explicit before fix rollout. | source-text only | `deployment-command-parity` | n/a |
| PERF-702 | candidate | low | 7 | `package.json`, `package-lock.json`, `.nvmrc`, `next.config.mjs` | Next.js, `@next/*`, MDX, analyzer, and static export dependency baseline | `package.json`, `next.config.mjs` | developer workflow, bundle | build, static generation, CI, deployment | `package.json` ranges include `next` `^14.2.28`, `@next/bundle-analyzer` `^15.4.1`, and `@next/mdx` `^15.2.0`; `package-lock.json` resolves `next` 14.2.28, `@next/bundle-analyzer` 15.4.1, and `@next/mdx` 15.3.0; `next.config.mjs` loads analyzer behavior through `ANALYZE=true`, static export, image policy, and package import optimization; `.nvmrc` requires Node 20 while local validation ran under Node `v24.13.0` with absent `node_modules` and `.source`. | Next runtime, `@next/*` tooling, MDX integration, analyzer output, and local validation are version-sensitive across semver ranges, lockfile exact versions, and runtime state. | Analyzer confidence, MDX integration confidence, typecheck/build reproducibility, and deployment parity can be reduced until validation uses Node 20 with installed locked dependencies. | Treat package-lock versions as baseline truth, align Next-adjacent tooling during a controlled dependency phase, and run typecheck/build/analyzer only in a Node 20 locked-dependency environment with generated-file guards. | source-text only | `next-package-version-alignment` | n/a |

### Phase 7 Deployment Parity Matrix

| Target | Build Command | Package Install Command | Node / Runtime | Env Source | Static Export Artifact | Serving Target | Redirects | Headers | Cache Behavior | Route Support | Native Dependency Variance |
|--------|---------------|-------------------------|----------------|------------|------------------------|----------------|-----------|---------|----------------|---------------|----------------------------|
| Vercel production | `vercel build --prod --local-config ./vercel.json` | `npm install`; global `vercel@latest` install | GitHub Actions Node 20; Vercel build/deploy runtime | `vercel pull --environment=preview` plus Vercel project secrets | Prebuilt Vercel output from local Vercel CLI build | Vercel hosting | `vercel.json` redirects | `vercel.json` headers | Vercel header rules, framework defaults, and CDN behavior | Vercel App Router behavior with prebuilt deploy; static export assumptions need host-specific confirmation | Uses GitHub Actions install and Vercel build environment; native package behavior differs from Docker image path |
| Vercel preview | `vercel build --local-config ./vercel.json` | `npm install`; global `vercel@latest` install | GitHub Actions Node 20; Vercel action `vercel-version` 41.4.1 | `vercel pull --environment=preview` plus preview action secrets | Prebuilt Vercel output from local Vercel CLI build | Vercel preview deployment | `vercel.json` redirects | `vercel.json` headers | Vercel preview CDN and framework defaults | Preview path may expose different branch/env route behavior from production | Same dependency/native caveat as production Vercel path |
| Cloudflare production | `npm run build` | `npm ci` | GitHub Actions Node 20 | GitHub Actions vars for `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_OPEN_SOURCE_URL`, `NEXT_PUBLIC_DEFAULT_LOCALE`; Cloudflare token/account env | `./out` | Cloudflare Pages | `public/_redirects` including `/robots.txt /api/robots 200` | `public/_headers` | `_headers` immutable cache rules for static assets; Pages defaults for others | Closest explicit static export path; API-like generated artifacts depend on static output and Pages routing | Uses local static export output; no Docker native runtime libraries |
| Cloudflare preview | `npm run build` in build job, then artifact upload/download | `npm ci` | GitHub Actions Node 20 | GitHub Actions vars plus Cloudflare token/account secrets | Uploaded `out` artifact deployed as `./out` | Cloudflare Pages preview branch | `public/_redirects` | `public/_headers` | Same source headers with preview branch CDN behavior | Preview branch deployment validates static export artifact path while avoiding production route probes | Uses local static export output; no Docker native runtime libraries |
| Docker/Nginx | `npm ci && npm run build` after image path replacement | `npm ci` | Builder `node:20-bookworm-slim`; runner `nginx:1.27-alpine` | Docker build args promoted to env; `DOCKER_BUILD=true`; `NEXT_TELEMETRY_DISABLED=1` | `/app/out` | Nginx web root `/usr/share/nginx/html` | Static files only unless Nginx config handles route fallback; `public/_redirects` and `vercel.json` are source evidence, not Nginx config | Static files only unless Nginx config handles headers | Nginx defaults unless image/runtime config adds cache headers | Static export files served by Nginx; API-like route support requires static artifact or server config evidence | Installs Cairo, JPEG, Pango, GIF, SVG, FreeType, HarfBuzz, FriBidi, fontconfig, curl for native `canvas`/`sharp` build/runtime path |
| GHCR/Kubernetes | `docker/build-push-action@v5` uses `Dockerfile`, then image update | Dockerfile runs `npm ci` inside builder | `linux/amd64` Docker image; Kubernetes deployment `sealos-docs` | Build args from GitHub secrets; kube config secret for update | Docker image containing `/usr/share/nginx/html` static export | Kubernetes deployment running GHCR image | Same Docker/Nginx static serving assumptions | Same Docker/Nginx static serving assumptions | Cluster ingress/CDN cache behavior outside repo evidence | Route behavior follows built static files plus cluster ingress configuration | Inherits Docker native libraries and architecture-specific image behavior |

### Dependency and Runtime Baseline

Package ranges are recorded beside lockfile exact versions because Phase 7
uses the lockfile as the reproducibility source for DEPS-01 and DEPS-02.

| Package / Runtime | `package.json` Range | Lockfile / Local Exact Version | Audit Meaning |
|-------------------|----------------------|-------------------------------|---------------|
| `next` | `^14.2.28` | `14.2.28` | Application runtime and static export baseline. |
| `@next/bundle-analyzer` | `^15.4.1` | `15.4.1` | Analyzer package is one major line ahead of Next runtime baseline. |
| `@next/mdx` | `^15.2.0` | `15.3.0` | MDX integration package is one major line ahead of Next runtime baseline. |
| `@mdx-js/loader` | `^3.1.0` | `3.1.0` | MDX loader baseline for content compilation. |
| `@mdx-js/react` | `^3.1.0` | `3.1.0` | MDX React runtime baseline. |
| `fumadocs-core` | `^15.2.6` | `15.2.8` | Docs/search/source loader baseline. |
| `fumadocs-ui` | `^15.2.8` | `15.2.8` | Docs UI and search client baseline. |
| `fumadocs-mdx` | `^11.5.8` | `11.5.8` | Postinstall/source generation baseline. |
| `react` | `^18.3.1` | `18.3.1` | UI runtime baseline. |
| `react-dom` | `^18.3.1` | `18.3.1` | DOM renderer baseline. |
| `typescript` | `^5.5.4` | `5.8.3` | Typecheck baseline. |
| `canvas` | `^3.1.0` | `3.1.0` | Native image generation dependency linked to Docker native libraries and OG paths. |
| `sharp` | `^0.33.5` | `0.33.5` | Native image processing dependency linked to OG and thumbnail paths. |
| `satori` | `^0.18.3` | `0.18.3` | Dynamic image rendering dependency. |
| Node | `.nvmrc` `20` | Local shell `v24.13.0`; workflow/Docker Node 20 evidence | Local validation caveat; CI/Docker baseline is Node 20. |
| npm / lockfile | npm lockfile v3 | Local npm `11.6.2`; `package-lock.json` lockfile version `3` | Package install/update and typecheck/build validation are environment-gated. |
| Generated dependency state | n/a | `node_modules` absent; `.source` absent | `npm run lint`, package-dependent tests, build, analyzer, and Fumadocs-generated-source validation stayed skipped. |

### Validation Coverage Matrix

Primary coverage labels in this matrix use only `tested`, `source-text only`,
`typecheck only`, `manual only`, and `unvalidated`. Details preserve the
reason stronger validation was skipped.

| Item | Module Boundary | Primary Coverage | Skipped / Gap Rationale | Safe Next Validation | Guard |
|------|-----------------|------------------|-------------------------|----------------------|-------|
| Module inventory | all audited boundaries | tested | Ledger/schema/source inventory checks passed in Phase 1. | Repeat source inventory count after large tree changes. | Source-count only. |
| `app` | route tree and handlers | source-text only | Static export route behavior is host-dependent. | Static artifact route map plus host preview smoke. | No production traffic; generated-file diff guard. |
| `app/[lang]` | localized pages and shared shell | source-text only | Analyzer/browser traces skipped. | Bundle analyzer and guarded browser trace. | Node 20, installed deps, generated-file guard. |
| `app/api` | generated and runtime-like endpoints | source-text only | Static export/request behavior requires host validation. | Static output inspection and approved endpoint smoke. | No load tests; no external secret use. |
| `components` | shared UI and widgets | source-text only | Analyzer/browser traces skipped. | Route chunk and interaction trace. | Local served build with clean diff. |
| `new-components` | header, footer, auth, deploy, visuals | source-text only | Auth, deploy, Turnstile, template calls skipped. | Mocked/local interaction smoke. | No live account/service mutation. |
| `config` | structured data and app snapshots | tested | Static JSON counts and tests exist; generated refresh skipped. | Contract tests after generator decoupling. | No remote refresh without diff guard. |
| `content` | docs, blog, AI quick reference | source-text only | Build-time traversal measured by counts only. | Static generation timing by corpus family. | Node 20, generated-file guard. |
| `hooks` | browser hooks and GTM/auth/template helpers | source-text only | External calls and browser traces skipped. | Mocked hook interaction tests. | No production service calls. |
| `lib` | loaders, metadata, API adapters, OG helpers | source-text only | Native rendering and external route calls skipped. | Unit tests plus guarded native render smoke. | Node 20 and native deps. |
| `scripts` | generator and normalization scripts | tested | Offline generator tests passed earlier; live generator skipped. | Generator timing with cached fixtures. | No remote writes without generated diff guard. |
| `public` | static assets, headers, redirects | source-text only | Host cache behavior unmeasured. | Static host header/redirect smoke. | Preview-only and no load test. |
| `assets` | imported SVG/image assets | source-text only | Asset optimization work skipped. | Asset budget check. | No rewrite without review. |
| `fonts` | local fonts | source-text only | Native/font render measurement skipped. | Font subset and render timing validation. | Native deps available. |
| `.github/workflows` | CI/deploy paths | source-text only | CI/deploy execution skipped. | Dry-run/source parity review. | No deploy credentials invoked. |
| `Dockerfile` | image build and Nginx runtime | source-text only | Docker build skipped. | Docker build timing and Nginx smoke. | Disposable image tag and generated diff guard. |
| `vercel.json` | Vercel headers/redirects | source-text only | Vercel deploy/probe skipped. | Vercel preview header/redirect smoke. | Preview-only and rollback path. |
| `next.config.mjs` | static export, images, analyzer, rewrites | source-text only | Build/analyzer skipped. | Build/analyzer in locked env. | Node 20, installed deps, generated diff guard. |
| `package.json` | scripts and dependencies | source-text only | Package install/update skipped. | Locked install in controlled env. | Package legitimacy and lockfile review. |
| `config/apps.json` | app snapshot | tested | Static counts and quality tests exist; refresh skipped. | Snapshot diff check after generator fix. | Generated-file diff guard. |
| `config/template-sources.json` | template-source snapshot | tested | Static counts exist; refresh skipped. | Contract test for input shape. | Generated-file diff guard. |
| `public/images/apps` | generated app media | source-text only | Image refresh/clean skipped. | Asset churn budget after generator decoupling. | No clean mode without review. |
| PERF-201 | `package.json`, `scripts` | source-text only | Build/analyzer timing skipped because generator can mutate artifacts. | Split generator from build, then time build and analyzer. | Node 20 plus generated-file diff guard. |
| PERF-202 | `scripts` | source-text only | Remote generator run skipped. | Fixture-backed bounded-concurrency benchmark. | No live template API during unit benchmark. |
| PERF-203 | `scripts`, `public/images/apps` | source-text only | Icon downloads skipped. | Mocked downloader timing and cache test. | No remote icon writes. |
| PERF-204 | `scripts`, generated app data | source-text only | Clean mode and generated writes skipped. | Snapshot diff budget test. | Generated-file diff guard. |
| PERF-301 | `config` | tested | Static data tests cover shape, runtime behavior remains source-level. | Expand contract tests for deploy URL shape. | Read-only fixture data. |
| PERF-302 | `config`, `lib` | source-text only | Runtime API external fetch skipped. | Mocked API conversion test. | No external template API call. |
| PERF-303 | `components`, `app/[lang]` | source-text only | Browser interaction trace skipped. | App Store filter/pagination interaction trace. | Local served build only. |
| PERF-304 | `app/[lang]` | source-text only | External README fetch skipped. | Mocked README candidate timing test. | No GitHub traffic. |
| PERF-305 | `app/[lang]`, `config` | source-text only | Static generation timing skipped. | Detail route static generation timing. | Generated-file diff guard. |
| PERF-306 | `public/images/apps`, `next.config.mjs` | source-text only | Image delivery host behavior unmeasured. | Asset transfer budget on preview. | Preview-only. |
| PERF-307 | `new-components`, `hooks` | source-text only | Auth/template-source calls skipped. | Mocked deploy click flow. | No live auth/template call. |
| PERF-401 | `app/api`, `components`, `lib`, `content` | source-text only | Search payload measurement limited to source. | Search artifact size and recall budget. | Static artifact inspection. |
| PERF-402 | `app`, `content` | source-text only | `/llms.txt` output generation timing skipped. | Precompute or static output size check. | No production endpoint call. |
| PERF-403 | `app/[lang]`, `lib`, `content` | source-text only | Static generation timing skipped. | Blog route timing by content count. | Node 20 build guard. |
| PERF-404 | `app`, `lib`, `config` | source-text only | Sitemap output size/timing skipped. | Static sitemap item count and byte budget. | Static artifact inspection. |
| PERF-405 | `app/[lang]`, `app`, `lib`, `content` | source-text only | FAQ corpus generation timing skipped. | FAQ params/sitemap count budget. | Source-count only first. |
| PERF-406 | `app`, `next.config.mjs`, deployment config | source-text only | Host behavior unvalidated. | Deployment route matrix smoke. | Preview/static only. |
| PERF-501 | `app/api`, `lib`, `fonts` | source-text only | Native render smoke skipped. | Local native render benchmark. | Native deps and Node 20. |
| PERF-502 | `app/api`, `lib`, `content` | source-text only | Thumbnail route rendering skipped. | Fixture thumbnail render benchmark. | No production request. |
| PERF-503 | `app/api`, `next.config.mjs` | source-text only | Static export route support unvalidated. | Static output route check. | No production probe. |
| PERF-504 | `lib`, `content` | source-text only | Content traversal timing skipped. | Loader traversal budget test. | Node 20 and generated source available. |
| PERF-505 | `scripts`, `Dockerfile` | source-text only | Docker build skipped. | Docker build stage timing. | Disposable image and generated diff guard. |
| PERF-506 | `new-components`, `hooks` | source-text only | Template-source external fallback skipped. | Mocked template-source latency test. | No remote call. |
| PERF-507 | `hooks`, `new-components` | source-text only | Shared-auth call skipped. | Mocked auth redirect smoke. | No account state mutation. |
| PERF-508 | `app/api`, abuse form | source-text only | Turnstile siteverify skipped. | Mocked route plus approved service smoke. | Secret-safe environment only. |
| PERF-601 | `app/[lang]`, shared shell | source-text only | Analyzer skipped. | Route chunk baseline. | Node 20, generated diff guard. |
| PERF-602 | `components`, `hooks`, `config` | source-text only | External analytics probes skipped. | Browser trace with network controls. | No production traffic. |
| PERF-603 | `new-components`, `hooks`, `config` | source-text only | Auth/deploy external calls skipped. | Modal lazy-load and mocked click trace. | No live service calls. |
| PERF-604 | `app/[lang]`, `new-components`, `assets` | source-text only | Browser trace skipped. | Interaction trace with visual loops. | Local served build. |
| PERF-605 | `next.config.mjs`, `public`, `assets`, `fonts` | source-text only | Host transfer/cache behavior skipped. | Asset budget and preview headers check. | No asset rewrite. |
| PERF-606 | `components`, `app/[lang]`, `new-components`, `public/images/apps` | source-text only | Browser and external README/template calls skipped. | App Store interaction trace with mocks. | No external traffic. |
| PERF-607 | `components`, `app/[lang]`, `content` | source-text only | Analyzer skipped. | Docs/blog chunk and Mermaid render smoke. | Local served build. |
| PERF-608 | `app/[lang]` | source-text only | Browser trace skipped. | Customer route scroll/timer trace. | Local served build. |
| PERF-609 | `app/[lang]`, `public`, `components`, `content` | source-text only | Browser payload trace skipped. | FAQ JSON transfer and search timing. | Local served build. |
| PERF-701 | deployment surfaces | source-text only | Deploy/build/probes skipped by report-only scope. | Deployment parity smoke by target. | Preview/static paths first. |
| PERF-702 | package and Next config | source-text only | Install/typecheck/build/analyzer skipped by absent deps and Node mismatch. | Locked dependency validation. | Node 20 and package legitimacy guard. |

### Consolidated Skipped Validation

| Skipped Validation | Primary Label | Rationale | Future Guard |
|--------------------|---------------|-----------|--------------|
| Package installs and updates | unvalidated | Install/update commands can change lockfiles or dependency state and were outside the allowed Phase 7 scope. | Package legitimacy review, Node 20, isolated dependency phase, lockfile diff review. |
| `npm run lint` / typecheck | manual only | `node_modules` is absent and local Node is `v24.13.0` while the project baseline is Node 20. | Install locked deps in Node 20 and run with no package diff. |
| Node tests importing app dependencies | manual only | Tests can require dependencies unavailable without `node_modules`; prior Phase 3 utility test had `tests 0`. | Node 20 plus locked deps; preserve `tests 0` gap until test is improved. |
| `npm run generate-apps` and `generate-apps:clean` | manual only | Generator can call remote template APIs, shell to `curl`, write JSON, and rewrite or recreate `public/images/apps`. | Before/after diff guard for `config/apps.json`, `config/template-sources.json`, and `public/images/apps`. |
| `npm run build` | manual only | Build invokes generated App Store refresh before Next build. | Generated-file diff guard, Node 20, installed deps, separate generator timing. |
| `npm run build:analyze` | manual only | Analyzer command invokes generated App Store refresh before `ANALYZE=true next build`. | Generated-file diff guard for generated app files, `out`, and analyzer output. |
| Docker build | unvalidated | Docker crosses package install, native libraries, image path rewrite, generator, Next build, and image artifact boundaries. | Docker-capable environment, disposable tag, generated-file diff guard. |
| Vercel, Cloudflare, GHCR, Kubernetes deploys | unvalidated | Deploys require credentials, create external artifacts, and can affect hosted state. | Preview-only deployment plan with rollback and secret handling. |
| Endpoint load tests and production probes | unvalidated | External probes can create traffic and measure host state outside report-only scope. | Approved rate limits, preview target, and no stress testing. |
| Browser traces and visual inspection | manual only | Requires a served app and can mix local runtime noise with source-only evidence. | Local Node 20 build or dev server after dependency state is established. |
| Auth, Turnstile, template API, README, analytics calls | source-text only | Live calls depend on secrets, external services, account state, or third-party traffic. | Mocked tests first; approved minimal service smoke later. |
| Generated app refreshes | manual only | Refresh can mutate JSON and image assets. | Dedicated generated artifact task with diff review. |
| Asset rewriting | manual only | `scripts/replace-image-paths.sh` can mutate paths during Docker build flow. | Disposable copy or explicit before/after diff guard. |

### Prioritized Remediation Order

| Priority | Duplicate Key / Root Cause | Included PERF IDs | Owner Module | Evidence Quality | Expected Impact | Fix Class | Recommended Validation Path | Scope |
|----------|----------------------------|-------------------|--------------|------------------|-----------------|-----------|-----------------------------|-------|
| 1 | `remote-template-build-step` | PERF-201, PERF-202, PERF-203, PERF-204, PERF-505 | `scripts`, `package.json`, `Dockerfile`, generated app assets | source-text only, tested generator unit path | Build-time and CI stability | Generator/build separation and bounded remote work | Fixture generator tests, generated diff guard, then Node 20 build timing | v2 fix execution |
| 2 | `deployment-command-parity` | PERF-701 | `.github/workflows`, `Dockerfile`, `vercel.json`, `public`, `next.config.mjs`, `package.json` | source-text only | Deployment variance and validation reliability | Deployment/cache parity checklist | Static output inspection, preview header/redirect checks, Docker/Nginx smoke | measurement expansion |
| 3 | `static-export-route-classification` | PERF-402, PERF-404, PERF-406, PERF-503 | `app`, `next.config.mjs`, deployment config | source policy, fixture tests, current-shell caveats | Route support, generated artifact size, deployment behavior | Static artifact policy | Static output route map, sitemap/search/llms byte budgets, host preview smoke | Phase 10 remediation trace |
| 4 | `shared-layout-bundle-cost` | PERF-601, PERF-602, PERF-603 | `app/[lang]`, `components`, `new-components`, `hooks` | source-text only | Broad user-facing page-entry cost | Shell/modal/code-split bundle work | Analyzer after generator guard, browser trace with external controls | v2 fix execution |
| 5 | `og-native-rendering` | PERF-501, PERF-502 | `app/api`, `lib`, `fonts`, `Dockerfile` | source-text only | Native CPU/memory and deployment variance | Pre-generation, cache, and native render policy | Local fixture render benchmark plus Docker native smoke | v2 fix execution |
| 6 | `static-export-asset-delivery` | PERF-605 | `next.config.mjs`, `public`, `assets`, `fonts` | local counts, source-text only | First-load transfer and cache behavior | Asset/font budget and host cache parity | Asset size budget, preview header checks, selective conversion tests | v2 fix execution |
| 7 | `app-store-data-pipeline` | PERF-301, PERF-302, PERF-303, PERF-305, PERF-306, PERF-307, PERF-506, PERF-606 | `config`, `lib`, `app/[lang]`, `components`, `new-components`, `public/images/apps` | tested static data, source-text only runtime | App Store page entry, interactions, deploy flow | Data contract, derived indexes, mocked runtime API | Contract tests, mocked API/deploy tests, App Store interaction trace | v2 fix execution |
| 8 | `fumadocs-search-index` | PERF-401, PERF-403, PERF-405, PERF-504, PERF-607, PERF-609 | `app/api`, `lib`, `content`, `components` | local counts, source-text only | Docs/search/static generation and route payload growth | Search/content budget and shard policy | Search artifact size budgets, loader traversal tests, route chunk checks | v2 fix execution |
| 9 | `visual-animation-loop-cost` | PERF-604 | `app/[lang]`, `new-components`, `assets` | source-text only | New-home interaction and main-thread scheduling | Viewport-gated animation scheduling | Local browser trace and route chunk inspection | measurement expansion |
| 10 | `customer-interaction-scheduling` | PERF-608 | `app/[lang]/customers/**` | source-text only | Customer route scroll and markdown interaction cost | Scroll/listener consolidation | Customer route interaction trace | measurement expansion |
| 11 | `app-detail-remote-readme` | PERF-304 | `app/[lang]/products/app-store/[slug]` | source-text only | App detail latency and markdown render cost | README fetch/render cache and lazy policy | Mocked README timing, markdown render benchmark | v2 fix execution |
| 12 | `shared-auth-interaction-check` | PERF-507 | `hooks`, `new-components` | source-text only | Deploy/auth click latency | Shared-auth gating and mocked smoke | Mocked auth redirect tests, approved minimal service smoke | measurement expansion |
| 13 | `turnstile-request-verification` | PERF-508 | `app/api`, abuse form | source-text only | External request latency and deployment variance | Verification timeout/rate-limit observability | Mocked route tests, secret-safe service smoke | measurement expansion |
| 14 | `next-package-version-alignment` | PERF-702 | `package.json`, `package-lock.json`, `.nvmrc`, `next.config.mjs` | source-text only | Build/analyzer/typecheck reproducibility | Controlled dependency alignment | Node 20 locked install, typecheck, build, analyzer with generated guard | measurement expansion |

### Final Traceability

| Requirement | Closeout Evidence |
|-------------|-------------------|
| DEPS-01 | Dependency and Runtime Baseline records package ranges, lockfile exact versions, Node baseline, npm lockfile version, absent `node_modules`, and absent `.source`. |
| DEPS-02 | PERF-702 records the Next, `@next/*`, MDX, Fumadocs, analyzer, lockfile, and runtime alignment caveat with package/lockfile/config evidence. |
| DEPLOY-01 | Phase 7 Deployment Parity Matrix records Vercel, Cloudflare, Docker/Nginx, GHCR, and Kubernetes source evidence. |
| DEPLOY-02 | PERF-701 and the parity matrix compare install/build/env/artifact/serving/redirect/header/cache/route/native behavior by deployment target. |
| VERIFY-01 | Validation Coverage Matrix covers module boundaries and detailed findings PERF-201 through PERF-609 plus PERF-701 and PERF-702. |
| VERIFY-02 | Consolidated Skipped Validation records safe guards for build, analyzer, generator, Docker, endpoint load, browser trace, production probes, external calls, package changes, generated refreshes, and asset rewriting. |
| VERIFY-03 | Final finding counts are `candidate: 36, confirmed: 0, dismissed: 0, deferred: 0`, and remediation is grouped by duplicate key/root cause. |

This phase is report-only. Fix execution, dependency changes, generated refreshes,
deployment changes, hosted probes, browser traces, and broader measurements are
follow-up scope.

### Phase 7 Validation

| Check | Result | Evidence |
|-------|--------|----------|
| Environment snapshot | Gap recorded on 2026-06-11 | `node --version` returned `v24.13.0`, `npm --version` returned `11.6.2`, `.nvmrc` is `20`, `node_modules` returned `NODE_MODULES_ABSENT`, and `.source` returned `SOURCE_ABSENT`. |
| Deployment source scan | Passed on 2026-06-11 | `rg` found Node 20, `npm install`, `npm ci`, Vercel build/deploy, Cloudflare Pages deploy, Docker build-push, Kubernetes update, Docker static output, and Nginx serving evidence. |
| Header/static export scan | Passed on 2026-06-11 | `rg` found Vercel headers/redirects, Cloudflare `_headers` and `_redirects`, `/robots.txt` rewrite, `output: 'export'`, `trailingSlash`, `unoptimized`, `remotePatterns`, `ANALYZE`, generator, and normalization evidence. |
| Dependency baseline scan | Passed on 2026-06-11 | Node package parser returned required package ranges and lockfile versions, including `next` 14.2.28, `@next/bundle-analyzer` 15.4.1, `@next/mdx` 15.3.0, Fumadocs packages, React 18.3.1, TypeScript 5.8.3, `canvas` 3.1.0, `sharp` 0.33.5, `satori` 0.18.3, and lockfile version 3. |
| Baseline count parse | Passed on 2026-06-11 | Before Phase 7 rows, Node report parser returned 34 candidate rows and no confirmed, dismissed, or deferred rows. |
| Final report contract | Passed on 2026-06-11 | Deterministic closeout checks validate Phase 7 tokens, final count text, exact 36 candidate row count, PERF-701/PERF-702 row schema, exact Phase 7 duplicate-key ownership, required remediation groups, and SUMMARY/UAT tokens. |
| Scoped audit-only diff | Passed on 2026-06-11 | Protected source, content, generated data, deployment config, package files, scripts, hooks, fonts, assets, and public paths returned empty diff after Phase 7 edits. |

## Phase 11: Shared Shell Bundle and Hydration Remediation

Phase 11 turns the Phase 6 `shared-layout-bundle-cost` audit finding into
source-level lazy boundaries for docs search, auth, deploy, and template-source
data reach. This phase preserves public hooks and user-visible flows while
reducing shared locale shell reach. Accepted bundle movement still requires a
Node 20 locked-dependency analyzer run because the current shell is Node
`v24.13.0`, `node_modules` is absent, `out` is absent, and analyzer artifacts
are absent.

### Phase 11 Source Changes

| Requirement | PERF Trace | Evidence | Validation Coverage |
|-------------|------------|----------|---------------------|
| SHELL-01 | PERF-601, PERF-602, PERF-603 | `app/[lang]/layout.tsx` now wires `RootProvider.search.SearchDialog` to `components/docs/LazySearchDialog.tsx`. Auth and deploy remain mounted as thin facades, while heavy inner dialogs load after open intent. | tested source guard; analyzer caveat |
| SHELL-02 | PERF-603 | `new-components/AuthForm/index.tsx` lazy-loads `AuthFormInner` after `useAuthForm().open`. `new-components/DeployModal/index.tsx` lazy-loads `DeployModalInner` after `useDeployModal().open`. `new-components/AuthForm/auth-email-actions.ts` owns email validation/request work and loads from `sendCode()` after auth intent. | tested source guard |
| SHELL-03 | PERF-601, PERF-607, PERF-609 | `components/docs/Search.tsx` continues to own `SharedProps`, `useDocsSearch`, Orama, Mandarin tokenizer, and `useParams`. `components/docs/LazySearchDialog.tsx` is the Fumadocs bridge from the shared shell. `/api/search` route semantics remain anchored to Phase 10. | tested source guard |
| SHELL-04 | PERF-601, PERF-602, PERF-603, PERF-702 | `.planning/phases/11-shared-shell-bundle-and-hydration/11-VALIDATION.md` records shared locale shell, route-local entries, analytics, auth, deploy, docs search, new header/footer, and legacy header/footer evidence plus current-shell caveats. | source guard passed; analyzer caveat |

### Phase 11 Surface Traceability

| Surface | Before 11-02 | After 11-02 | Duplicate Key |
|---------|--------------|-------------|---------------|
| shared locale shell | `app/[lang]/layout.tsx` reached `DefaultSearchDialog` directly and globally mounted auth/deploy surfaces. | The layout reaches `LazySearchDialog`, `AuthForm`, and `DeployModal` facades. Heavy search/auth/deploy internals are behind lazy imports. | `shared-layout-bundle-cost` |
| docs search | Search dialog, Orama, and Mandarin tokenizer were reachable through the layout import path. | `LazySearchDialog` dynamically imports `components/docs/Search.tsx`; search behavior stays in the existing Fumadocs dialog implementation. | `shared-layout-bundle-cost`, `fumadocs-search-index` |
| auth | `AuthForm` eagerly imported Radix/Motion/GodRays form internals, while email validation/request code lived in the command context. | `AuthForm` renders only after open intent and lazy-loads `AuthFormInner`; `sendCode()` dynamically loads `auth-email-actions.ts`. | `shared-layout-bundle-cost`, `shared-auth-interaction-check` |
| deploy | `DeployModal` eagerly imported dialog internals, `DeployModalContext` eagerly reached template-source hook code, and `hooks/use-template-source.ts` statically imported `config/template-sources.json`. | `DeployModal` renders only after open intent and lazy-loads `DeployModalInner`; `openDeployModal()` dynamically imports `loadTemplateSource()`; `loadTemplateSource()` dynamically imports `@/config/template-sources.json` and keeps API fallback semantics. | `shared-layout-bundle-cost`, `app-store-data-pipeline` |
| analytics | GTM fallback was tracked as a shared shell surface. | `components/analytics/gtm-body.tsx` remains server-renderable fallback markup using `analyticsConfig` and the same noscript iframe intent. | `shared-layout-bundle-cost` |
| header and footer | New and legacy header/footer systems were measured as route chrome surfaces. | Guard evidence still names `new-components/Header.tsx`, `new-components/Footer/**`, `components/header/**`, and `components/footer/**` for SHELL-04 grouping. | `shared-layout-bundle-cost` |

### Phase 11 Validation

| Command | Result | Evidence |
|---------|--------|----------|
| `node --test scripts/check-shell-bundle-baseline.test.mjs` | Passed on 2026-06-12 | 5 tests passed for surface collection, lazy-boundary fixtures, regression failures, analyzer caveats, and command/caveat output. |
| `npm run shell-bundle:check` | Passed on 2026-06-12 | Source lazy-boundary checks passed; analyzer artifacts reported `SKIPPED_WITH_CAVEAT` because Node is `v24.13.0`, `node_modules` is absent, `out` is absent, and analyzer HTML artifacts are absent. |
| `npm run app-store:diff` | Passed on 2026-06-12 | Apps `150`, template source keys `150`, changed paths `0`. |
| `npm run build:analyze:timed` | Caveated on 2026-06-12 | Pre generated diff guard passed; Next analyzer build exited `1` because the current shell has no installed dependencies. Accepted analyzer movement evidence requires Node 20 with installed locked dependencies. |
| `npm run static-output:check` | Passed with caveat on 2026-06-12 | Source checks and route policy passed; `out` artifact inspection was skipped because `out` is absent and the locked build gate is closed. |
| `npm run validate:deployment` | Passed on 2026-06-12 | Deployment parity source check passed; nested App Store diff passed; static-output check passed with `out` caveat; Docker smoke stayed behind its closed unsafe gate. |

Phase 11 closes the source-level remediation trace for SHELL-01, SHELL-02,
SHELL-03, SHELL-04, `shared-layout-bundle-cost`, PERF-601, PERF-602, PERF-603,
PERF-607, PERF-609, and PERF-702. Native OG/blog thumbnail rendering remains
Phase 12 ownership. Representative browser trace closeout remains Phase 13
ownership.

## Phase 13: Validation Closeout and Final v2 Audit Status

Phase 13 closes VALIDATE-02 and VALIDATE-03 for the v2 remediation set. The
browser trace closeout path is safe by default: `browser-trace:check` records
the representative route matrix and external-service controls while
`PHASE9_RUN_BROWSER_TRACE` is closed. Accepted navigation trace evidence remains
behind the explicit open gate
`PHASE9_RUN_BROWSER_TRACE=1 PHASE9_BROWSER_TRACE_BASE_URL=http://127.0.0.1:3000 npm run browser-trace:run`.

### Phase 13 Browser Trace Closeout

| Evidence | Result | Caveat / next gate |
|----------|--------|--------------------|
| `node --test scripts/check-browser-trace-closeout.test.mjs` | 6 tests passed for closed gate behavior, open-gate blockers, route fixtures, external controls, package scripts, and injectable environment helpers. | validated |
| `npm run browser-trace:check` | Printed `SKIPPED_WITH_CAVEAT`, exit code `0`, route rows for `/en`, `/en/docs`, `/en/docs/guides/app-deploy/first-deploy`, `/en/products/app-store`, `/en/products/app-store/n8n`, `/api/og`, and two blog thumbnail fixtures. | validated with caveat; accepted navigation evidence requires the `PHASE9_RUN_BROWSER_TRACE` open gate with Node 20, installed dependencies, generated `.source`, `out`, a local target, and an approved browser adapter. |
| External-service controls | Analytics, auth, Turnstile, template API, GitHub README, hosted-preview, production, and deploy requests are listed as blocked or stubbed controls by the trace guard. | validated with caveat; interaction traces that click auth, deploy, or App Store controls require mocked or blocked network outcomes. |

### Final v2 Audit Status Matrix

This matrix is the final v2 source-of-truth chain:
requirement -> PERF IDs -> duplicate key -> fix artifact -> evidence command
-> final status -> caveat/next gate.

| Requirement | PERF IDs | Duplicate key | Fix artifact | Evidence command | Final status | Caveat / next gate |
|-------------|----------|---------------|--------------|------------------|--------------|--------------------|
| BUILD-01 | PERF-201, PERF-505 | `remote-template-build-step` | `package.json`, `scripts/generate-apps-api.js`, generated snapshot reuse path | `npm run app-store:diff`; Phase 8 generator tests and package script checks | validated | Normal build path uses committed App Store snapshots; accepted timing still uses Node 20 locked dependencies. |
| BUILD-02 | PERF-202, PERF-203, PERF-505 | `remote-template-build-step` | Explicit App Store refresh controls in `scripts/generate-apps-api.js` | `npm run app-store:diff`; Phase 8 generator tests | validated | Live network refresh remains behind generated-file review gates. |
| BUILD-03 | PERF-204, PERF-505 | `remote-template-build-step` | Generated asset diff guard `scripts/check-generated-app-assets.js` | `npm run app-store:diff` | validated | Current result: apps `150`, template source keys `150`, changed paths `0`. |
| BUILD-04 | PERF-201, PERF-701, PERF-702 | `remote-template-build-step`, `deployment-command-parity`, `next-package-version-alignment` | Build/analyzer timing wrappers and generated diff guard | `npm run shell-bundle:check`; `npm run validate:deployment` | validated with caveat | Node 20, `node_modules`, `.source`, `out`, and analyzer artifacts are required for accepted timing and analyzer movement evidence. |
| DEPLOY-03 | PERF-701 | `deployment-command-parity` | `docs/deployment-parity.md`, `scripts/check-deployment-parity.js` | `npm run validate:deployment` | validated | Source parity targets and dimensions passed with unsafe gates closed. |
| DEPLOY-04 | PERF-701, PERF-406 | `deployment-command-parity`, `static-export-route-classification` | Static output guard, route policy, headers, redirects, cache evidence | `npm run static-output:check`; `npm run static-routes:check` | validated with caveat | `out` artifact inspection and hosted probes require `PHASE9_RUN_LOCKED_BUILD` and `PHASE9_RUN_HOSTED_PROBES`. |
| DEPLOY-05 | PERF-501, PERF-502, PERF-701 | `og-native-rendering`, `deployment-command-parity` | Docker/Nginx smoke gate and native rendering policy | `npm run validate:deployment` | validated with caveat | Real Docker/Nginx smoke requires `PHASE9_RUN_DOCKER_SMOKE=1` and Docker CLI availability. |
| ROUTEFIX-01 | PERF-402, PERF-404, PERF-406, PERF-503 | `static-export-route-classification` | `docs/static-export-route-policy.md`, static export route guard | `npm run static-routes:check` | validated | Route policy rows `11`, failures `0`. |
| ROUTEFIX-02 | PERF-402, PERF-404, PERF-406, PERF-503 | `static-export-route-classification` | Generated endpoint/static artifact policy | `npm run static-routes:check`; `npm run static-output:check` | validated with caveat | Local static artifact inspection requires generated `out`. |
| ROUTEFIX-03 | PERF-402, PERF-503 | `static-export-route-classification` | Sitemap, search, RSS, and `llms.txt` budget policy | `npm run static-routes:check` | validated | Source route policy and budgets passed. |
| ROUTEFIX-04 | PERF-406, PERF-701 | `static-export-route-classification`, `deployment-command-parity` | Static-output guard plus hosted probe gate | `npm run static-output:check`; `npm run static-routes:check` | validated with caveat | Hosted preview smoke requires `PHASE9_RUN_HOSTED_PROBES=1` with an approved hosted base URL. |
| SHELL-01 | PERF-601, PERF-602, PERF-603 | `shared-layout-bundle-cost` | Locale shell lazy boundary, search/auth/deploy facades | `npm run shell-bundle:check` | validated with caveat | Source lazy-boundary evidence passed; analyzer movement requires Node 20 dependencies and analyzer artifacts. |
| SHELL-02 | PERF-603 | `shared-layout-bundle-cost` | Auth and deploy dialog lazy-load facades | `npm run shell-bundle:check`; `npm run browser-trace:check` | validated with caveat | Click-level auth/deploy interaction trace requires the `PHASE9_RUN_BROWSER_TRACE` open gate with stubbed network controls. |
| SHELL-03 | PERF-601, PERF-602, PERF-603 | `shared-layout-bundle-cost`, `fumadocs-search-index` | `components/docs/LazySearchDialog.tsx` bridge and docs search isolation | `npm run shell-bundle:check`; `npm run browser-trace:check` | validated with caveat | Fumadocs search/content payload optimization remains future scope; current v2 evidence covers shell isolation. |
| SHELL-04 | PERF-601, PERF-602, PERF-603, PERF-702 | `shared-layout-bundle-cost`, `next-package-version-alignment` | Shell bundle baseline guard and analyzer caveat ledger | `npm run shell-bundle:check` | validated with caveat | Analyzer artifacts are absent; accepted bundle movement requires Node 20 locked dependencies and `npm run build:analyze:timed`. |
| NATIVE-01 | PERF-501, PERF-502 | `og-native-rendering` | Native rendering policy and cache-keyed route evidence | `npm run native-rendering:check`; `npm run static-output:check` | validated with caveat | Static/native artifact inspection requires generated `.source` or `out`. |
| NATIVE-02 | PERF-501, PERF-502 | `og-native-rendering` | Native benchmark gate and fixture matrix | `npm run native-rendering:check` | blocked pending gate | Accepted benchmark evidence requires `PHASE12_RUN_NATIVE_BENCHMARK=1` under Node 20 with installed dependencies and generated sources. |
| NATIVE-03 | PERF-501, PERF-502, PERF-701 | `og-native-rendering`, `deployment-command-parity` | Docker native assumptions plus smoke guard | `npm run validate:deployment`; `npm run native-rendering:check` | validated with caveat | Real Docker native validation requires `PHASE9_RUN_DOCKER_SMOKE=1` and Docker CLI availability. |
| VALIDATE-01 | PERF-701, PERF-702 | `deployment-command-parity`, `next-package-version-alignment` | Deployment validation guard set and locked-build caveat | `npm run validate:deployment`; `npm run shell-bundle:check` | blocked pending gate | Node 20 locked-dependency typecheck, build, and analyzer require `PHASE9_RUN_LOCKED_BUILD=1`, installed dependencies, `.source`, and `out`. |
| VALIDATE-02 | PERF-601, PERF-602, PERF-603, PERF-604 | `shared-layout-bundle-cost`, `visual-animation-loop-cost` | `scripts/check-browser-trace-closeout.js`, route fixture matrix, external controls | `node --test scripts/check-browser-trace-closeout.test.mjs`; `npm run browser-trace:check` | validated with caveat | Safe default trace closeout passed; accepted browser navigation evidence requires `PHASE9_RUN_BROWSER_TRACE=1 PHASE9_BROWSER_TRACE_BASE_URL=http://127.0.0.1:3000 npm run browser-trace:run`. |
| VALIDATE-03 | PERF-201, PERF-202, PERF-203, PERF-204, PERF-402, PERF-404, PERF-406, PERF-501, PERF-502, PERF-503, PERF-505, PERF-601, PERF-602, PERF-603, PERF-701, PERF-702 | `remote-template-build-step`, `static-export-route-classification`, `og-native-rendering`, `shared-layout-bundle-cost`, `deployment-command-parity`, `next-package-version-alignment` | This final v2 audit status matrix in `docs/performance-audit.md` | audit token checks for requirements, PERF IDs, statuses, and future-scope rows | fixed | This row is complete when the Phase 13 summary and validation artifacts are written. |
| VALIDATE-04 | PERF-701, PERF-702 | `deployment-command-parity`, `next-package-version-alignment` | Unsafe gate registry in deployment validation | `npm run validate:deployment` | validated | Unsafe network, deploy, Docker, browser, locked build, generated refresh, and generated-change gates are closed by default. |

### Remaining Future-Scope Matrix

These rows stay visible after v2 closeout and retain the same matrix chain:
requirement -> PERF IDs -> duplicate key -> fix artifact -> evidence command
-> final status -> caveat/next gate.

| Requirement | PERF IDs | Duplicate key | Fix artifact | Evidence command | Final status | Caveat / next gate |
|-------------|----------|---------------|--------------|------------------|--------------|--------------------|
| ASSETFIX-01 | PERF-605 | `static-export-asset-delivery` | Future asset/font budget and host cache parity work | Future asset size budget and preview header checks | remaining future scope | Static asset delivery optimization remains outside v2 closeout. |
| APPDATA-01 | PERF-301, PERF-302, PERF-303, PERF-305, PERF-306, PERF-307, PERF-506, PERF-606 | `app-store-data-pipeline` | Future App Store runtime data contract, indexing, and interaction tests | Future mocked API/deploy and App Store interaction trace | remaining future scope | App Store runtime data optimization remains a later phase. |
| DOCSEARCH-01 | PERF-401, PERF-403, PERF-405, PERF-504, PERF-607, PERF-609 | `fumadocs-search-index` | Future Fumadocs search/content budget and shard policy | Future search artifact budget and loader traversal tests | remaining future scope | Fumadocs search/content payload architecture remains a later phase. |
| VISUAL-01 | PERF-604 | `visual-animation-loop-cost` | Future viewport-gated animation scheduling | Future local browser trace and route chunk inspection | remaining future scope | Visual animation loops remain visible for route-level scheduling work. |
| CUSTOMER-01 | PERF-608 | `customer-interaction-scheduling` | Future customer route scroll/listener consolidation | Future customer route interaction trace | remaining future scope | Customer interactions remain visible for later measurement. |
| APPREADME-01 | PERF-304 | `app-detail-remote-readme` | Future README fetch/render cache and lazy policy | Future mocked README timing and markdown benchmark | remaining future scope | App detail README work remains visible for later App Store detail optimization. |
| AUTHNET-01 | PERF-507 | `shared-auth-interaction-check` | Future shared-auth mocked smoke and approved service check | Future mocked auth redirect tests and service smoke | remaining future scope | Shared-auth interaction checks remain visible for later network validation. |
| TURNSTILE-01 | PERF-508 | `turnstile-request-verification` | Future Turnstile route mocks and secret-safe service smoke | Future mocked route tests and approved Turnstile service check | remaining future scope | Turnstile service checks remain visible for later request-path validation. |
| DEPS-03 | PERF-702 | `next-package-version-alignment` | Future controlled dependency alignment phase | Future Node 20 locked install, typecheck, build, analyzer | remaining future scope | Dependency alignment remains a controlled package phase. |

## Handoff

Later phases should update this report in place:

1. Add detailed findings using the [Finding Schema](#finding-schema).
2. Reuse duplicate keys from [Duplicate-Key Policy](#duplicate-key-policy) when
   root cause and remediation path are shared.
3. Promote seed notes into detailed findings only after phase-owned evidence is
   collected.
4. Record validation coverage as `tested`, `source-text only`,
   `typecheck only`, `manual only`, or `unvalidated`.
5. Keep direct performance fixes for v2 fix execution after v1 audit coverage
   is complete.
