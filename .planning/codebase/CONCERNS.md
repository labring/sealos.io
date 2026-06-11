# Codebase Concerns

**Analysis Date:** 2026-06-11

## Tech Debt

**Remote template generation is tightly coupled to production builds:**
- Issue: `npm run build` always runs `npm run generate-apps`, and `scripts/generate-apps-api.js` fetches `https://template.os.sealos.io/api/listTemplate`, downloads icons, fetches per-template source inputs, and rewrites committed JSON files before `next build`.
- Files: `package.json`, `scripts/generate-apps-api.js`, `config/apps.json`, `config/template-sources.json`, `public/images/apps/`
- Impact: Production builds depend on remote API availability, remote response shape, network throughput, and external image URLs. Network failures are skipped only for the template list fetch; per-template source failures degrade silently into empty input arrays.
- Fix approach: Split generation from build. Use a checked-in snapshot for normal builds, add a separate refresh command/CI job for remote template ingestion, and make refresh failures visible with a nonzero exit or an explicit drift report.

**Runtime App Store API duplicates generator logic with weaker normalization:**
- Issue: `lib/api/apps-api.ts` reimplements template conversion separately from `scripts/generate-apps-api.js`. The runtime path uses raw `metadata.name` as `slug`, keeps `spec.url` unchanged, omits fallback screenshots, and only adds `i18n.zh.description` when the upstream response supplies it.
- Files: `lib/api/apps-api.ts`, `scripts/generate-apps-api.js`, `config/apps-loader.ts`, `config/apps.ts`
- Impact: `/api/apps` can return different slugs, URLs, screenshots, and localized descriptions from the generated static data. Client-side dynamic loading in `config/apps-loader.ts` can replace static data with a shape that detail pages and tests do not fully cover.
- Fix approach: Move template normalization into one shared module, use it from both the generator and `/api/apps`, and validate the API response with the same data-quality rules used by `config/apps-data-quality.test.mts`.

**Generated App Store data has weak schema validation at ingestion time:**
- Issue: `scripts/generate-apps-api.js` treats upstream template objects as loose JavaScript objects and writes `config/apps.json` plus `config/template-sources.json` directly after ad hoc normalization.
- Files: `scripts/generate-apps-api.js`, `config/apps.json`, `config/template-sources.json`
- Impact: Bad upstream fields can enter committed data and break route generation, deploy URLs, image rendering, structured metadata, or localized app copy.
- Fix approach: Add a Zod schema for remote template input and generated app output. Fail refresh on invalid required fields, unsafe URL schemes, duplicate slugs, and unsupported image extensions.

**Large TSX components carry mixed content, state, and presentation concerns:**
- Issue: Several components exceed 400 lines and combine content arrays, animation layout, rendering, and interaction logic.
- Files: `app/api/blog/[lang]/[slug]/thumbnail/[format]/bgs/WhatIsBg.tsx`, `app/api/blog/[lang]/[slug]/thumbnail/[format]/bgs/AppStoreChoicesBg.tsx`, `app/[lang]/customers/[slug]/page.tsx`, `new-components/Header.tsx`, `app/[lang]/(home)/(new-home)/sections/ComparisonSection.tsx`, `lib/og-canvas.ts`
- Impact: Small UI or content changes have broad review surface and high regression risk. Thumbnail and canvas rendering bugs are difficult to isolate.
- Fix approach: Extract data arrays, pure formatting helpers, and repeated visual primitives into colocated modules. Preserve public props and add narrow snapshot or rendering tests for extracted helpers.

**String-based tests lock implementation text instead of behavior:**
- Issue: `components/app-store/app-grid.test.mts` reads `components/app-store/app-grid.tsx` as text and asserts regexes against class names and source snippets.
- Files: `components/app-store/app-grid.test.mts`, `components/app-store/app-grid.tsx`
- Impact: Refactors that preserve behavior can fail tests, while real runtime regressions can pass when source text still matches.
- Fix approach: Add React rendering tests for App Store cards, filters, pagination, and empty states. Keep source-text tests only for intentional static contracts that are hard to observe at runtime.

## Known Bugs

**Search index contains titles and descriptions only:**
- Symptoms: `/api/search` indexes `title`, `description`, `structuredData`, and a language tag, while page body text is absent from the `content` field.
- Files: `app/api/search/route.ts`, `lib/source.ts`, `content/docs/`
- Trigger: Search for terms that appear only in docs body content.
- Workaround: Put critical search terms into frontmatter titles/descriptions.

**Fallback App Store API can return an empty successful payload:**
- Symptoms: When the external template API fails and static app import also fails, `lib/api/apps-api.ts` returns `{ apps: [], language }` with a 200 response.
- Files: `lib/api/apps-api.ts`, `app/api/apps/[[...lang]]/route.ts`
- Trigger: Runtime API outage plus missing or invalid static `config/apps.json` import.
- Workaround: Static pages that import `config/apps.json` directly still have data when the JSON file is valid.

**`siteConfig.ogImage` can render an invalid URL when `NEXT_PUBLIC_APP_URL` is unset:**
- Symptoms: The value is built from `process.env.NEXT_PUBLIC_APP_URL` directly, while `domain` already has a fallback.
- Files: `config/site.ts`
- Trigger: Code paths reading `siteConfig.ogImage` without `NEXT_PUBLIC_APP_URL` configured.
- Workaround: Metadata helpers mostly use `siteConfig.url.base` and `/api/og` instead of `siteConfig.ogImage`.

## Security Considerations

**Preview workflow executes fork code with privileged `pull_request_target` context:**
- Risk: `.github/workflows/preview.yml` triggers on `pull_request_target`, checks out `github.event.pull_request.head.repo.full_name`, installs dependencies, pulls Vercel environment variables, builds, and deploys using secrets.
- Files: `.github/workflows/preview.yml`
- Current mitigation: The separate `.github/workflows/preview-cloudflare.yml` uses `pull_request`, skips automatic fork previews, and gates `/preview` comments by maintainer permissions.
- Recommendations: Retire `.github/workflows/preview.yml` or convert it to the safer Cloudflare preview pattern. Build untrusted fork code in a secret-free `pull_request` job, then deploy only reviewed artifacts from trusted code.

**Icon download uses shell interpolation with upstream-controlled URLs:**
- Risk: `scripts/generate-apps-api.js` calls `execSync(\`curl -s -L -o "${outputPath}" "${iconUrl}"\`)`. The URL comes from the remote template API and is shell-quoted with string interpolation.
- Files: `scripts/generate-apps-api.js`
- Current mitigation: Output filename is based on a canonicalized slug and the command has a 10-second timeout.
- Recommendations: Replace shell `curl` with `fetch` plus `fs.writeFile`, enforce `http:`/`https:` protocols, reject private-network hosts if needed, cap downloaded bytes, validate content type, and sanitize SVG handling.

**Remote README rendering trusts third-party markdown for app details:**
- Risk: App detail pages can fetch README content from raw GitHub URLs or GitHub repos, normalize some HTML to markdown, and render it with `react-markdown`.
- Files: `app/[lang]/products/app-store/[slug]/components/ReadmeMarkdownWindow.tsx`, `config/apps.json`, `scripts/generate-apps-api.js`
- Current mitigation: Direct README URLs pass through `isUnsafeUrl`, GitHub URL parsing restricts repo discovery, and React Markdown escapes raw HTML by default.
- Recommendations: Keep raw HTML disabled, force safe link protocols, add `rel="nofollow noopener noreferrer"` for external README links, cap README fetch size, and test markdown containing hostile links/images.

**Image configuration allows remote SVG sources in an unoptimized static export:**
- Risk: `next.config.mjs` has `images.unoptimized: true`, broad `remotePatterns`, and `dangerouslyAllowSVG: true`. The Next image optimizer CSP does not protect raw browser loads in static export.
- Files: `next.config.mjs`, `components/app-store/app-grid.tsx`, `components/ui/app-icon.tsx`, `config/apps.json`
- Current mitigation: `contentSecurityPolicy` is configured in `next.config.mjs`, and generated icons are usually downloaded to `public/images/apps/`.
- Recommendations: Prefer locally downloaded raster icons for remote template data, reject SVG icons from the generator unless sanitized, and narrow remote image domains to the smallest required set.

**Turnstile rate limiting is per-process and header-trust based:**
- Risk: `app/api/abuse/verify-turnstile/route.ts` stores rate-limit state in a module-level `Map` and derives client identity from forwarded headers.
- Files: `app/api/abuse/verify-turnstile/route.ts`, `config/site.ts`
- Current mitigation: Turnstile token verification checks hostname, action, and cdata.
- Recommendations: Move rate limiting to Cloudflare, Vercel KV, Redis, or another shared edge-aware limiter. Trust `cf-connecting-ip` only behind Cloudflare-controlled deployments.

## Performance Bottlenecks

**Template refresh is serial and network-heavy:**
- Problem: `scripts/generate-apps-api.js` processes templates one by one, downloads each icon synchronously, and fetches each template source sequentially.
- Files: `scripts/generate-apps-api.js`, `package.json`
- Cause: The loop awaits `convertTemplateToAppConfig`, `downloadIcon`, and `fetchTemplateSource` per app before moving to the next template.
- Improvement path: Add bounded concurrency, shared fetch timeout handling, byte limits, retries with backoff, and a cache keyed by template slug plus upstream revision.

**Static search index scales poorly for full-document search:**
- Problem: `app/api/search/route.ts` currently keeps index size small by indexing only metadata, which limits relevance. Adding body text directly would increase generated API payload and build memory.
- Files: `app/api/search/route.ts`, `lib/source.ts`, `content/docs/`, `content/blog/`
- Cause: The search API is generated from all localized docs pages at module initialization.
- Improvement path: Build a precomputed search artifact during content generation, shard by language, and include normalized headings/body excerpts instead of full MDX text.

**OG image generation uses Node canvas and Sharp in a route handler:**
- Problem: `/api/og` runs `drawCanvas()` and `sharp(...).webp()` per request unless cached by the hosting layer.
- Files: `app/api/og/route.ts`, `lib/og-canvas.ts`
- Cause: The route constructs the image dynamically and returns a one-day cache header.
- Improvement path: Generate stable OG assets at build time for static export, or use route-level caching with content-addressed filenames for dynamic variants.

## Fragile Areas

**App Store data pipeline:**
- Files: `scripts/generate-apps-api.js`, `lib/api/apps-api.ts`, `config/apps-loader.ts`, `config/apps.ts`, `config/apps.json`, `config/template-sources.json`, `components/app-store/app-grid.tsx`
- Why fragile: The same concepts are represented across generated JSON, runtime API conversion, client caches, slug compatibility helpers, deploy URL generation, and detail page rendering.
- Safe modification: Change normalization in one shared module, update `config/apps-data-quality.test.mts`, run the generator intentionally, and inspect JSON diffs for slug, URL, screenshot, readme, and i18n changes.
- Test coverage: Existing data-quality tests cover slugs, SEO-critical fields, safe external URLs, and legacy slug support. Runtime `/api/apps` behavior and client cache replacement are untested.

**Localized routing and domain redirects:**
- Files: `next.config.mjs`, `vercel.json`, `public/_redirects`, `app/api/robots/route.ts`, `lib/utils/metadata.ts`, `lib/i18n.ts`
- Why fragile: Redirect behavior is split between Next development rewrites, Vercel redirects, Cloudflare Pages redirects, robots generation, and canonical metadata.
- Safe modification: Update both deployment redirect files together, keep `sealos.io` and `sealos.run` canonical rules aligned, and run a URL index audit after changes.
- Test coverage: No detected automated tests assert redirect parity, robots output, or canonical/alternate metadata.

**MDX/docs rendering:**
- Files: `source.config.ts`, `lib/source.ts`, `app/[lang]/docs/[[...slug]]/page.tsx`, `app/[lang]/docs/layout.tsx`, `lib/remark/remark-mermaid.ts`, `components/mdx/mermaid.tsx`
- Why fragile: Fumadocs generation, git-based last-modified dates, custom remark plugins, Mermaid rendering, image zoom overrides, and GitHub edit links all depend on page file paths and language suffixes.
- Safe modification: Add MDX fixture pages for English and Chinese, verify generated static params, GitHub source URLs, Mermaid blocks, and image rendering before broad docs changes.
- Test coverage: No detected tests exercise docs route rendering, MDX component overrides, or generated metadata.

**CI/CD deployment surface:**
- Files: `.github/workflows/deploy.yml`, `.github/workflows/preview.yml`, `.github/workflows/preview-cloudflare.yml`, `.github/workflows/deploy-cloudflare.yml`, `.github/workflows/build-image.yml`, `Dockerfile`, `vercel.json`, `public/_redirects`
- Why fragile: The repo deploys through Vercel, Cloudflare Pages, Docker/GHCR, and a kubectl image update path. Each flow has different install commands, secrets, redirects, and artifact outputs.
- Safe modification: Treat workflow changes as production changes. Keep preview and production build commands aligned, prefer `npm ci`, and document which deployment target is authoritative for each domain.
- Test coverage: Workflows are validated only by CI execution; no local script checks workflow parity or secret exposure patterns.

## Scaling Limits

**In-memory caches reset per process and per browser session:**
- Current capacity: `config/apps-loader.ts` caches app data in module-level maps and browser memory; `app/api/abuse/verify-turnstile/route.ts` caps cleanup at 1000 rate-limit entries.
- Limit: Serverless cold starts, multiple regions, and multiple browser sessions do not share state. Abuse-rate enforcement and App Store API fetch savings are local to one process/session.
- Scaling path: Use CDN caching for `/api/apps`, add a build-time app snapshot, and move abuse rate limiting to shared infrastructure.

**Static export constrains server features:**
- Current capacity: `next.config.mjs` sets `output: 'export'` in production while keeping API route files for search, robots, OG, apps, and Turnstile verification.
- Limit: Hosting targets must provide compatible handling for API-like routes or rewrites. Pure static deployments depend on generated assets and platform-specific redirects.
- Scaling path: Classify routes as static artifacts, edge/server endpoints, or external services. Generate search/robots/OG as static files where practical, and host verification APIs on a runtime that matches their needs.

## Dependencies at Risk

**Next major-version mismatch in core packages:**
- Risk: `package.json` uses `next` 14.x while `@next/mdx` and `@next/bundle-analyzer` are 15.x. The config also includes `swcMinify`, which is legacy in modern Next versions.
- Impact: Build behavior, MDX integration, and analyzer behavior can drift across installs. Dependency updates can surface peer or runtime incompatibilities.
- Migration plan: Align all `@next/*` packages to the installed `next` major version, then test `npm run lint`, `npm run build`, docs rendering, and OG generation.

**Native image/canvas dependencies increase deployment variance:**
- Risk: `canvas` and `sharp` require native binaries and compatible Linux runtime libraries.
- Impact: Docker, Vercel, Cloudflare, and local macOS builds can fail differently, especially around OG generation and static export.
- Migration plan: Prefer build-time generation for stable OG assets, keep Docker image runtime libraries explicit, and add a smoke test that imports `canvas`, renders `drawCanvas()`, and encodes with `sharp`.

**Preview deployment actions are externally maintained and version-sensitive:**
- Risk: `.github/workflows/preview.yml` uses `amondnet/vercel-action@v25`; `.github/workflows/build-image.yml` uses `actions-hub/kubectl@master`.
- Impact: Action behavior can change independently of repo code, and `@master` tracks mutable code.
- Migration plan: Pin third-party actions to immutable SHAs or maintained official actions, and prefer direct CLI commands for Vercel/kubectl where secrets handling is easier to audit.

## Missing Critical Features

**No detected automated redirect/canonical audit in CI:**
- Problem: Redirect and canonical behavior spans `vercel.json`, `public/_redirects`, `app/api/robots/route.ts`, and `lib/utils/metadata.ts`.
- Blocks: Confident domain/language routing changes for `sealos.io`, `sealos.run`, `/en`, `/zh-cn`, docs, blog, and legacy URL migrations.

**No runtime contract tests for external-template fallback behavior:**
- Problem: The generator, `/api/apps`, and client loader each have their own fallback path.
- Blocks: Confident changes to App Store loading, deploy modal defaults, template input display, and canonical/legacy slug handling.

**No detected dependency/security audit command in package scripts:**
- Problem: `package.json` exposes `lint`, `build`, `build:analyze`, `dev`, `start`, and generator commands, but no security audit or CI aggregate verification command.
- Blocks: Consistent local verification before dependency or workflow changes.

## Test Coverage Gaps

**API routes:**
- What's not tested: `/api/apps`, `/api/search`, `/api/og`, `/api/robots`, and `/api/abuse/verify-turnstile` success/failure behavior.
- Files: `app/api/apps/[[...lang]]/route.ts`, `lib/api/apps-api.ts`, `app/api/search/route.ts`, `app/api/og/route.ts`, `app/api/robots/route.ts`, `app/api/abuse/verify-turnstile/route.ts`
- Risk: API regressions can ship through static builds or deployment rewrites.
- Priority: High

**Docs and MDX pages:**
- What's not tested: Static params, localized docs routing, GitHub edit links, Markdown source links, Mermaid rendering, image zoom component overrides, and metadata generation.
- Files: `app/[lang]/docs/[[...slug]]/page.tsx`, `app/[lang]/docs/layout.tsx`, `source.config.ts`, `lib/source.ts`, `components/mdx/mermaid.tsx`
- Risk: Content or route changes can break docs pages after build.
- Priority: High

**App Store detail pages and README rendering:**
- What's not tested: README source selection, remote markdown normalization, hostile links/images, app detail metadata, deploy modal input loading, and legacy slug redirects.
- Files: `app/[lang]/products/app-store/[slug]/components/ReadmeMarkdownWindow.tsx`, `hooks/use-template-source.ts`, `config/apps-loader.ts`, `config/apps-data-quality.test.mts`
- Risk: Third-party README content or template-source drift can break app detail pages or degrade security.
- Priority: High

**CI/CD workflows:**
- What's not tested: Secret exposure boundaries, build-command parity, Vercel/Cloudflare redirect parity, Docker image build expectations, and kubectl deployment update behavior.
- Files: `.github/workflows/deploy.yml`, `.github/workflows/preview.yml`, `.github/workflows/preview-cloudflare.yml`, `.github/workflows/deploy-cloudflare.yml`, `.github/workflows/build-image.yml`
- Risk: Preview and production deployment changes can compromise secrets or publish broken artifacts.
- Priority: High

**Visual-heavy components:**
- What's not tested: OG background components, `lib/og-canvas.ts`, homepage sections, customer pages, and header/footer interactions across desktop/mobile viewports.
- Files: `app/api/blog/[lang]/[slug]/thumbnail/[format]/bgs/WhatIsBg.tsx`, `app/api/blog/[lang]/[slug]/thumbnail/[format]/bgs/AppStoreChoicesBg.tsx`, `lib/og-canvas.ts`, `new-components/Header.tsx`, `new-components/Footer/index.tsx`, `app/[lang]/customers/[slug]/page.tsx`
- Risk: Layout, canvas output, and navigation regressions are caught manually late in the process.
- Priority: Medium

---

*Concerns audit: 2026-06-11*
