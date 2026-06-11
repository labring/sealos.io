<!-- refreshed: 2026-06-11 -->
# Architecture

**Analysis Date:** 2026-06-11

## System Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                  Next.js App Router                         │
├──────────────────┬──────────────────┬───────────────────────┤
│ Marketing Pages  │ Docs/Blog Pages  │ API/Generated Assets  │
│ `app/[lang]`     │ `content/*`      │ `app/api`, routes     │
└────────┬─────────┴────────┬─────────┴──────────┬────────────┘
         │                  │                     │
         ▼                  ▼                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Shared Rendering and Data Layer                 │
│ `components`, `new-components`, `lib/source.ts`, `config/*`  │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│ Static Content, Static Data, and Public Assets               │
│ `content`, `config/apps.json`, `public`, `assets`            │
└─────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| Root shell | Loads global CSS and delegates HTML rendering to locale layout. | `app/layout.tsx` |
| Locale shell | Creates `<html>`, analytics, Fumadocs provider, search, auth modal, deploy modal, and language params. | `app/[lang]/layout.tsx` |
| Navigation config | Defines shared docs layout options and localized header URLs. | `app/layout.config.tsx` |
| Docs source | Loads MDX docs, blog, and AI quick reference collections through Fumadocs. | `lib/source.ts` |
| MDX schema | Defines Fumadocs content collections and remark plugins. | `source.config.ts` |
| Docs route | Renders localized docs pages from `source.getPage()` and wires MDX components. | `app/[lang]/docs/[[...slug]]/page.tsx` |
| Docs layout | Renders Fumadocs sidebar tree and docs chrome. | `app/[lang]/docs/layout.tsx` |
| Blog routes | Render blog index and article pages from the blog loader. | `app/[lang]/(home)/blog/page.tsx`, `app/[lang]/(home)/blog/[slug]/page.tsx` |
| Marketing home | Composes the new landing page from section components. | `app/[lang]/(home)/(new-home)/page.tsx` |
| App Store data | Loads, caches, filters, and resolves deploy URLs for app templates. | `config/apps-loader.ts` |
| Apps API | Converts remote template API records to local app config shape. | `lib/api/apps-api.ts` |
| Metadata | Centralizes Next metadata for pages, docs, and blog routes. | `lib/utils/metadata.ts` |
| Structured data | Generates Schema.org JSON-LD objects for SEO surfaces. | `lib/utils/structured-data.ts` |

## Pattern Overview

**Overall:** Static-first localized content site with Next.js App Router, Fumadocs MDX loaders, and configuration-backed marketing surfaces.

**Key Characteristics:**
- Use `app/[lang]` as the language-scoped route boundary for public pages.
- Use Fumadocs loaders in `lib/source.ts` as the only entry point for docs, blog, and AI quick reference content.
- Use `config/*` for product, site, analytics, app-store, industry, and template data.
- Use server components for static page composition and client components for search, auth, deploy, filters, GTM, and interactive UI.
- Build output is configured as static export in production through `next.config.mjs`.

## Layers

**Route Layer:**
- Purpose: Own URL structure, route params, static params, layouts, metadata hooks, and route handlers.
- Location: `app`
- Contains: `page.tsx`, `layout.tsx`, `route.ts`, loading states, not-found states.
- Depends on: `lib`, `config`, `components`, `new-components`, `content` through loaders.
- Used by: Next.js runtime and static export build.

**Content Layer:**
- Purpose: Store localized MDX/MD content for docs, blog, and AI quick reference.
- Location: `content`
- Contains: `content/docs`, `content/blog`, `content/ai-quick-reference`.
- Depends on: Fumadocs frontmatter schemas in `source.config.ts`.
- Used by: `lib/source.ts`, route pages under `app/[lang]/docs`, `app/[lang]/(home)/blog`, and `app/[lang]/(home)/ai-quick-reference`.

**Data Configuration Layer:**
- Purpose: Store structured site, product, app-store, analytics, and industry data.
- Location: `config`
- Contains: `config/site.ts`, `config/analytics.ts`, `config/apps.json`, `config/apps-loader.ts`, `config/industries.tsx`, `config/template-sources.json`.
- Depends on: Environment variables and static JSON.
- Used by: Route pages, metadata helpers, header/footer, app-store pages, auth/deploy flows.

**Shared UI Layer:**
- Purpose: Provide reusable UI primitives, site chrome, MDX components, and feature widgets.
- Location: `components`, `new-components`
- Contains: Fumadocs extensions, shadcn-style primitives, header/footer, analytics, auth form, deploy modal, marketing widgets.
- Depends on: `lib/utils.ts`, `config/site.ts`, hooks, Radix UI, Fumadocs UI, Motion, Lucide.
- Used by: Route layer and MDX renderers.

**Utility Layer:**
- Purpose: Encapsulate source loaders, i18n, metadata, structured data, content transforms, GTM events, OG rendering, and API adapters.
- Location: `lib`, `hooks`
- Contains: `lib/source.ts`, `lib/i18n.ts`, `lib/utils/metadata.ts`, `lib/utils/structured-data.ts`, `lib/api/apps-api.ts`, `hooks/use-gtm.ts`.
- Depends on: Next APIs, Fumadocs, local config, content loaders, browser APIs for hooks.
- Used by: Pages, route handlers, and client components.

**Asset Layer:**
- Purpose: Store static media and icons served directly or imported by components.
- Location: `public`, `assets`, `fonts`
- Contains: Public images, app icons, SVG assets, fonts, OG assets.
- Depends on: Next static file serving.
- Used by: Components, metadata, OG image generation, app-store cards.

## Data Flow

### Primary Docs Request Path

1. Locale route provides language context and Fumadocs provider (`app/[lang]/layout.tsx`).
2. Docs layout reads localized page tree from `source.pageTree[params.lang]` (`app/[lang]/docs/layout.tsx`).
3. Docs page resolves the MDX page with `source.getPage(params.slug, params.lang)` (`app/[lang]/docs/[[...slug]]/page.tsx`).
4. Fumadocs loader obtains docs from `content/docs` via `createMDXSource(docs, meta)` (`lib/source.ts`).
5. MDX content renders through Fumadocs components plus local `Mermaid`, `ImageZoom`, `PageActions`, and AI share controls (`app/[lang]/docs/[[...slug]]/page.tsx`).

### Blog Article Path

1. Blog route resolves async route params (`app/[lang]/(home)/blog/[slug]/page.tsx`).
2. Blog loader fetches content with `blog.getPage([slug], lang)` (`app/[lang]/(home)/blog/[slug]/page.tsx`).
3. Blog collection schema and MDX files come from `source.config.ts` and `content/blog`.
4. Article MDX renders with Fumadocs MDX components, local Mermaid, zoomable images, and optional FAQ accordions (`app/[lang]/(home)/blog/[slug]/page.tsx`).
5. Blog metadata comes from `generateBlogMetadata` (`lib/utils/metadata.ts`).

### Marketing Page Path

1. Locale layout supplies global providers and search/auth/deploy modals (`app/[lang]/layout.tsx`).
2. Route page composes domain-specific sections, such as the home page sections under `app/[lang]/(home)/(new-home)/sections`.
3. Shared site data comes from `config/site.ts`, navigation from `app/layout.config.tsx`, and reusable widgets from `new-components` and `components/ui`.
4. Structured data is generated by `lib/utils/structured-data.ts` and rendered by `components/structured-data.tsx`.

### App Store Data Path

1. Product route pages use `config/apps-loader.ts` to call `loadAllApps()`, `getAppsByCategory()`, or `getAppBySlug()`.
2. Server-side/static paths load `config/apps.json`; browser calls may fetch `/api/apps`.
3. `/api/apps` resolves language and delegates to `handleAppsRequest()` (`app/api/apps/[[...lang]]/route.ts`).
4. `handleAppsRequest()` fetches template records from `https://template.os.sealos.io/api/listTemplate` and converts them into `AppConfig` (`lib/api/apps-api.ts`).
5. Deploy URLs are derived with `getDeployUrl()` in `config/apps-loader.ts`.

### Generated SEO Endpoints

1. `/rss.xml` builds RSS from `blog.getPages(defaultLanguage)` (`app/rss.xml/route.ts`).
2. `/sitemap-index.xml` returns the sitemap index using `i18n.defaultLanguage` (`app/sitemap-index.xml/route.ts`).
3. `/llms.txt` scans localized docs MDX files, expands includes, and serializes markdown (`app/llms.txt/route.ts`).
4. `/api/search` builds a static Fumadocs search API from all localized docs pages (`app/api/search/route.ts`).
5. `/api/og` renders canvas OG output and converts it to WebP with Sharp (`app/api/og/route.ts`).

**State Management:**
- Global app state is provider-based for auth and deploy modals in `new-components/AuthForm/AuthFormProvider.tsx` and `new-components/DeployModal/DeployModalContext.tsx`.
- App-store loader state uses module-level caches in `config/apps-loader.ts`.
- Abuse verification rate limiting uses a module-level `Map` in `app/api/abuse/verify-turnstile/route.ts`.
- Most page content state is static build-time data from MDX, JSON, and config modules.

## Key Abstractions

**Fumadocs Loaders:**
- Purpose: Provide typed access to docs, blog, and AI quick reference collections.
- Examples: `lib/source.ts`, `source.config.ts`.
- Pattern: Define collections once, expose `source`, `blog`, and `faqSource` loaders to routes.

**Language Boundary:**
- Purpose: Keep all public pages under `/:lang` while hiding the default locale where configured.
- Examples: `lib/i18n.ts`, `app/[lang]/layout.tsx`, `app/layout.config.tsx`.
- Pattern: Use `languagesType`, `LANGUAGES`, `locales`, and `getLanguageSlug()` rather than hard-coded language path logic in components.

**Central Site Config:**
- Purpose: Provide canonical domains, product URLs, auth endpoints, analytics-adjacent links, Turnstile config, and metadata defaults.
- Examples: `config/site.ts`, `config/analytics.ts`.
- Pattern: Read shared values from config modules and pass localized variants through helpers.

**Metadata and Structured Data Helpers:**
- Purpose: Generate consistent SEO metadata and Schema.org output for route surfaces.
- Examples: `lib/utils/metadata.ts`, `lib/utils/structured-data.ts`, `components/structured-data.tsx`.
- Pattern: Route pages export `generateMetadata` from centralized helpers or call `generatePageMetadata()`.

**Modal Providers:**
- Purpose: Support auth and template deploy flows across route trees without prop drilling.
- Examples: `new-components/AuthForm/AuthFormProvider.tsx`, `new-components/DeployModal/DeployModalContext.tsx`, `hooks/use-auth-redirect.ts`.
- Pattern: Mount providers once in `app/[lang]/layout.tsx`; client controls consume context hooks.

**UI Primitives:**
- Purpose: Shared component primitives and variants.
- Examples: `components/ui/button.tsx`, `components/ui/dialog.tsx`, `components/ui/popover.tsx`, `lib/utils.ts`.
- Pattern: Compose `cn()` with Radix primitives, Lucide icons, Fumadocs components, and Tailwind classes.

## Entry Points

**Next root layout:**
- Location: `app/layout.tsx`
- Triggers: Every App Router request.
- Responsibilities: Import `app/global.css` and return children.

**Locale app shell:**
- Location: `app/[lang]/layout.tsx`
- Triggers: All language-scoped pages.
- Responsibilities: Generate language static params, mount global providers, analytics, search, structured data, auth form, and deploy modal.

**Docs pages:**
- Location: `app/[lang]/docs/[[...slug]]/page.tsx`
- Triggers: `/docs` and `/docs/*` routes for each language.
- Responsibilities: Resolve MDX page, render docs content, expose static params, and generate metadata.

**Blog pages:**
- Location: `app/[lang]/(home)/blog/page.tsx`, `app/[lang]/(home)/blog/[slug]/page.tsx`
- Triggers: `/blog` and `/blog/:slug` for each language.
- Responsibilities: Render blog listing, category/tag filters, and article MDX.

**Marketing pages:**
- Location: `app/[lang]/(home)/(new-home)/page.tsx`, `app/[lang]/products/*/page.tsx`, `app/[lang]/solutions/industries/[industry]/page.tsx`
- Triggers: Public localized marketing URLs.
- Responsibilities: Compose product, solution, pricing, customer, and home views from local sections and shared components.

**Generated API routes:**
- Location: `app/api/*/route.ts`, `app/rss.xml/route.ts`, `app/sitemap-index.xml/route.ts`, `app/llms.txt/route.ts`
- Triggers: API, RSS, sitemap, robots, search, OG, and LLM text requests.
- Responsibilities: Return generated JSON, XML, text, or images from local config, content loaders, or external template data.

**Build pipeline:**
- Location: `package.json`, `next.config.mjs`, `scripts/generate-apps-api.js`, `scripts/normalize-root-locale.js`
- Triggers: `npm run build`, `npm run dev`, `npm run generate-apps`.
- Responsibilities: Generate app data, build Next output, normalize root locale output, and run Fumadocs MDX generation after install.

## Architectural Constraints

- **Rendering model:** Next.js App Router with static export in production via `output: process.env.NODE_ENV === 'production' ? 'export' : undefined` in `next.config.mjs`.
- **Threading:** JavaScript event loop and Next route handlers; CPU-heavy OG rendering uses `canvas` and `sharp` in `app/api/og/route.ts`.
- **Global state:** Module-level caches exist in `config/apps-loader.ts`; Turnstile verification rate-limit state exists in `app/api/abuse/verify-turnstile/route.ts`.
- **Language model:** Public routes are language-scoped by `app/[lang]`; language list is centralized in `lib/i18n.ts`.
- **Content generation:** `.source` is generated by `fumadocs-mdx` and imported by `lib/source.ts`.
- **Static images:** `next.config.mjs` sets `images.unoptimized: true` for static export compatibility.
- **Path aliases:** Use `@/*` from `tsconfig.json` for repo-root imports.
- **Secrets:** Runtime secrets are read only from environment variables, such as `TURNSTILE_SECRET_KEY` in `app/api/abuse/verify-turnstile/route.ts`.

## Anti-Patterns

### Direct Content Scans Inside Page Components

**What happens:** Reading MDX or filesystem content directly from route components duplicates loader behavior.
**Why it's wrong:** The repo has a single content loading abstraction in `lib/source.ts`, and bypassing it breaks Fumadocs i18n, page trees, metadata, and static params.
**Do this instead:** Add content to `content/docs`, `content/blog`, or `content/ai-quick-reference`, define schema in `source.config.ts` when needed, and read it through `source`, `blog`, or `faqSource` from `lib/source.ts`.

### Hard-Coded Locale URL Assembly

**What happens:** Components manually prepend `/en` or `/zh-cn`.
**Why it's wrong:** `lib/i18n.ts` supports a default language with hidden locale behavior, and `app/layout.config.tsx` already resolves localized links.
**Do this instead:** Use `getLanguageSlug()` from `lib/i18n.ts` and route-aware helpers in `app/layout.config.tsx`.

### Page-Local SEO Metadata Duplication

**What happens:** Pages define one-off Open Graph, Twitter, canonical, and robots metadata.
**Why it's wrong:** Canonical domain, RSS alternates, locale handling, and OG image defaults live in `lib/utils/metadata.ts`.
**Do this instead:** Export centralized helpers such as `generateDocsMetadata`, `generateBlogMetadata`, or call `generatePageMetadata()` from `lib/utils/metadata.ts`.

### Fetching App Template Data From UI Components

**What happens:** App-store UI components call remote template APIs directly.
**Why it's wrong:** App config normalization, caching, category mapping, fallback icons, and deploy URL generation are centralized.
**Do this instead:** Use `loadAllApps()`, `getAppsByCategory()`, `searchApps()`, or `getAppBySlug()` from `config/apps-loader.ts`; expose API behavior through `lib/api/apps-api.ts`.

## Error Handling

**Strategy:** Route handlers return explicit `NextResponse` statuses, content routes call `notFound()`, loaders throw descriptive build-time errors, and client/data helpers fall back to static data where possible.

**Patterns:**
- Use `notFound()` when content loader lookup fails in `app/[lang]/docs/[[...slug]]/page.tsx` and `app/[lang]/(home)/blog/[slug]/page.tsx`.
- Use `NextResponse.json()` with status codes in API routes such as `app/api/abuse/verify-turnstile/route.ts` and `app/api/og/route.ts`.
- Log external fetch/conversion failures with `console.error` in `lib/api/apps-api.ts` and `config/apps-loader.ts`.
- Throw setup guidance errors when generated app config is unavailable in `config/apps-loader.ts`.

## Cross-Cutting Concerns

**Logging:** `console.error` and `console.warn` are used in API routes, build config, and loaders; production removes `console` except `error` and `warn` through `next.config.mjs`.

**Validation:** Zod validates MDX frontmatter in `source.config.ts`; Cloudflare Turnstile responses are checked in `app/api/abuse/verify-turnstile/route.ts`; TypeScript strict mode is enabled in `tsconfig.json`.

**Authentication:** Auth UI is client-side modal based in `new-components/AuthForm`; endpoint URLs are configured in `config/site.ts`; shared auth verification helper lives in `lib/utils/shared-auth.ts`.

**Analytics:** GTM and analytics scripts are centralized in `components/analytics`, `hooks/use-gtm.ts`, `lib/gtm.ts`, `lib/gtm-utils.ts`, and `config/analytics.ts`.

**SEO:** Metadata helpers, structured data helpers, RSS, sitemap index, robots, search index, OG image generation, and `llms.txt` routes are first-class architectural surfaces in `lib/utils/metadata.ts`, `lib/utils/structured-data.ts`, and route handlers under `app`.

---

*Architecture analysis: 2026-06-11*
