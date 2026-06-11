# Codebase Structure

**Analysis Date:** 2026-06-11

## Directory Layout

```text
sealos.io/
├── app/                 # Next.js App Router pages, layouts, API routes, generated SEO routes
├── app/[lang]/          # Language-scoped public site routes
├── app/api/             # API route handlers for apps, search, OG, robots, abuse verification
├── components/          # Shared UI, docs widgets, header/footer, analytics, MDX helpers
├── new-components/      # New marketing/auth/deploy component system
├── config/              # Site config, analytics config, app-store data and loaders, industry data
├── content/             # Fumadocs MDX content for docs, blog, and AI quick reference
├── hooks/               # Client hooks for GTM, auth redirect, template source, buttons
├── lib/                 # Source loaders, i18n, metadata, structured data, API adapters, utilities
├── public/              # Static files served from web root
├── assets/              # Imported static assets and icon groups
├── fonts/               # Local font files used by rendering paths
├── scripts/             # Build-time and audit scripts
├── types/               # Shared TypeScript types
├── source.config.ts     # Fumadocs collection and MDX configuration
├── next.config.mjs      # Next.js, MDX, image, rewrites, and static export configuration
├── tsconfig.json        # TypeScript strict compiler options and `@/*` alias
└── package.json         # npm scripts and dependency manifest
```

## Directory Purposes

**`app`:**
- Purpose: Own the Next.js App Router tree.
- Contains: Root layout, locale layout, public pages, API routes, RSS, sitemap index, robots, search, OG, and `llms.txt`.
- Key files: `app/layout.tsx`, `app/[lang]/layout.tsx`, `app/layout.config.tsx`, `app/api/search/route.ts`, `app/rss.xml/route.ts`.

**`app/[lang]`:**
- Purpose: Scope all public-facing routes to a language parameter.
- Contains: Marketing pages, docs pages, blog pages, products, solutions, customers, legal, contact, and abuse report pages.
- Key files: `app/[lang]/layout.tsx`, `app/[lang]/docs/[[...slug]]/page.tsx`, `app/[lang]/(home)/(new-home)/page.tsx`.

**`app/[lang]/(home)`:**
- Purpose: Route group for home-style marketing pages that share top-level site chrome.
- Contains: New home page, blog, pricing, comparison, AI quick reference, and Sealos skills routes.
- Key files: `app/[lang]/(home)/(new-home)/page.tsx`, `app/[lang]/(home)/blog/page.tsx`, `app/[lang]/(home)/blog/[slug]/page.tsx`.

**`app/[lang]/docs`:**
- Purpose: Render Fumadocs documentation routes.
- Contains: Docs layout and catch-all docs page.
- Key files: `app/[lang]/docs/layout.tsx`, `app/[lang]/docs/[[...slug]]/page.tsx`.

**`app/[lang]/products`:**
- Purpose: Product marketing and app-store routes.
- Contains: DevBox, Databases, App Store index, App Store detail, loading, and not-found states.
- Key files: `app/[lang]/products/devbox/page.tsx`, `app/[lang]/products/databases/page.tsx`, `app/[lang]/products/app-store/page.tsx`, `app/[lang]/products/app-store/[slug]/page.tsx`.

**`app/api`:**
- Purpose: Provide API and generated data endpoints used by the static site and integrations.
- Contains: Abuse Turnstile verification, apps API, blog helpers, OG image, robots, search.
- Key files: `app/api/abuse/verify-turnstile/route.ts`, `app/api/apps/[[...lang]]/route.ts`, `app/api/og/route.ts`, `app/api/search/route.ts`.

**`components`:**
- Purpose: Shared component library for current pages, docs, MDX, analytics, layout chrome, and UI primitives.
- Contains: Header, footer, analytics scripts, docs search, MDX Mermaid renderer, page actions, app-store grid, Radix/shadcn-style UI primitives.
- Key files: `components/header/index.tsx`, `components/footer/index.tsx`, `components/docs/Search.tsx`, `components/mdx/mermaid.tsx`, `components/ui/button.tsx`.

**`new-components`:**
- Purpose: Newer design-system and workflow components for marketing pages plus global auth/deploy flows.
- Contains: Header, footer, auth form provider and steps, deploy modal provider and form, visual components.
- Key files: `new-components/Header.tsx`, `new-components/AuthForm/AuthFormProvider.tsx`, `new-components/AuthForm/index.tsx`, `new-components/DeployModal/index.tsx`.

**`config`:**
- Purpose: Store structured application configuration and static business data.
- Contains: Site config, analytics config, apps JSON, app loaders, industry definitions, template source data.
- Key files: `config/site.ts`, `config/analytics.ts`, `config/apps.json`, `config/apps-loader.ts`, `config/industries.tsx`.

**`content`:**
- Purpose: Store content that feeds Fumadocs collections.
- Contains: Documentation, blog posts, AI quick reference metadata/content, localized MDX files.
- Key files: `content/docs`, `content/blog`, `content/ai-quick-reference`.

**`lib`:**
- Purpose: Centralize framework-independent helpers and server/client-adjacent utilities.
- Contains: Fumadocs loaders, i18n, API adapters, metadata, structured data, blog utils, GTM helpers, OG canvas rendering, remark plugins.
- Key files: `lib/source.ts`, `lib/i18n.ts`, `lib/api/apps-api.ts`, `lib/utils/metadata.ts`, `lib/utils/structured-data.ts`, `lib/remark/remark-mermaid.ts`.

**`hooks`:**
- Purpose: Store reusable client hooks used by interactive components.
- Contains: GTM event hook, auth redirect hook, template-source hook, button handler hook, typewriter effect hook.
- Key files: `hooks/use-gtm.ts`, `hooks/use-auth-redirect.ts`, `hooks/use-template-source.ts`, `hooks/use-button-handler.ts`.

**`public`:**
- Purpose: Static assets served directly from `/`.
- Contains: Icons, images, favicon files, robots.txt, Sealos logos.
- Key files: `public/logo.svg`, `public/robots.txt`, `public/images`, `public/icons`.

**`assets`:**
- Purpose: Repo-local visual assets grouped by domain for component imports.
- Contains: AI agent app icons, database icons, platform icons, social icons, stacks icons, Sealos app icons, hero visuals.
- Key files: `assets/aiagent-appicons`, `assets/db-appicons`, `assets/stacks-appicons`, `assets/hero-grid.svg`.

**`scripts`:**
- Purpose: Build-time data generation and maintenance.
- Contains: App API generation, URL audit, locale normalization, image path replacement, script tests.
- Key files: `scripts/generate-apps-api.js`, `scripts/generate-apps-api.test.mjs`, `scripts/normalize-root-locale.js`, `scripts/url-index-audit.sh`.

**`types`:**
- Purpose: Shared TypeScript type definitions.
- Contains: Site config and content type definitions.
- Key files: `types/index.d.ts`, `types/content.ts`.

## Key File Locations

**Entry Points:**
- `app/layout.tsx`: Root App Router layout and global CSS import.
- `app/[lang]/layout.tsx`: Locale layout, provider setup, analytics, search, auth modal, deploy modal.
- `app/[lang]/docs/[[...slug]]/page.tsx`: Documentation catch-all page.
- `app/[lang]/(home)/blog/[slug]/page.tsx`: Blog article route.
- `app/[lang]/(home)/(new-home)/page.tsx`: Current home page composition.
- `app/api/apps/[[...lang]]/route.ts`: Localized app API entry point.
- `app/api/search/route.ts`: Static docs search API entry point.

**Configuration:**
- `next.config.mjs`: Next.js static export, MDX integration, image config, dev rewrites, bundle analyzer.
- `source.config.ts`: Fumadocs docs, blog, and AI quick reference collections.
- `tsconfig.json`: Strict TypeScript settings and `@/*` path alias.
- `components.json`: UI component generator aliases and styling config.
- `postcss.config.js`: Tailwind CSS PostCSS plugin setup.
- `prettier.config.js`: Formatting and Tailwind class sorting configuration.
- `vercel.json`: Deployment routing/header configuration.
- `.env.example`: Documented environment keys; treat actual `.env*` files as secret-bearing.

**Core Logic:**
- `lib/source.ts`: Fumadocs loader exports for docs, blog, and FAQ source.
- `lib/i18n.ts`: Supported languages, default locale behavior, locale slug helper.
- `lib/utils/metadata.ts`: Route metadata generation.
- `lib/utils/structured-data.ts`: Schema.org structured data generation.
- `config/apps-loader.ts`: App-store static/dynamic loading and cache logic.
- `lib/api/apps-api.ts`: Remote template API conversion to local `AppConfig`.
- `lib/og-canvas.ts`: OG image canvas renderer.

**User Interface:**
- `components/ui`: Shared UI primitives.
- `components/header/index.tsx`: Legacy/shared site header.
- `components/footer/index.tsx`: Legacy/shared site footer.
- `new-components/Header.tsx`: New header component.
- `new-components/AuthForm`: Auth modal context, steps, hooks, and types.
- `new-components/DeployModal`: Deploy modal context, form, and types.

**Content:**
- `content/docs`: Documentation MDX files.
- `content/blog`: Blog MDX files grouped by editorial category folders.
- `content/ai-quick-reference`: AI quick reference content and metadata.

**Testing:**
- `scripts/generate-apps-api.test.mjs`: Node test for generated app API behavior.
- `config/apps-data-quality.test.mts`: App data quality checks.
- `package.json`: `npm run lint` runs TypeScript checks; no general unit test script is defined.

## Naming Conventions

**Files:**
- Next routes use App Router reserved names: `page.tsx`, `layout.tsx`, `route.ts`, `loading.tsx`, `not-found.tsx`.
- React components use PascalCase filenames in `new-components`, such as `new-components/SealosBrandCard.tsx`.
- Shared UI primitives in `components/ui` use kebab-case filenames, such as `components/ui/button-shiny.tsx`.
- Hooks use `use-*.ts` or `use*.ts`, such as `hooks/use-gtm.ts` and `hooks/useTypewriterEffect.ts`.
- Utility modules use kebab-case or domain names, such as `lib/utils/structured-data.ts` and `lib/utils/blog-utils.ts`.
- MDX content uses localized suffixes under content collections, such as `.en.mdx` and `.zh-cn.mdx`.

**Directories:**
- Route groups use parentheses under `app`, such as `app/[lang]/(home)`.
- Dynamic routes use square brackets, such as `app/[lang]/products/app-store/[slug]` and `app/[lang]/docs/[[...slug]]`.
- Component domain folders are plural or feature-named, such as `components/docs`, `components/analytics`, `new-components/AuthForm`.
- Asset folders are grouped by domain, such as `assets/stacks-appicons`, `assets/platform-icons`, `public/images/apps`.

## Where to Add New Code

**New Public Page:**
- Primary code: Add `page.tsx` under the appropriate route in `app/[lang]`.
- Shared layout: Use existing `app/[lang]/layout.tsx`; add nested `layout.tsx` only for a route-specific shell.
- Metadata: Use `generatePageMetadata()` from `lib/utils/metadata.ts`.
- Shared components: Put reusable pieces in `components` or `new-components`; keep page-only sections beside the page route.

**New Documentation Page:**
- Primary content: Add localized MDX files under `content/docs`.
- Navigation metadata: Add or update Fumadocs meta files under `content/docs`.
- Rendering: Use existing docs route `app/[lang]/docs/[[...slug]]/page.tsx`.
- Shared MDX component: Add component to `components/mdx` and wire it in the docs page MDX components map when needed.

**New Blog Post:**
- Primary content: Add MDX under `content/blog`, preserving localized naming.
- Listing behavior: Use existing blog utilities in `lib/utils/blog-utils.ts`.
- Article rendering: Use `app/[lang]/(home)/blog/[slug]/page.tsx`.
- Metadata: Extend `source.config.ts` only when frontmatter schema needs a new field.

**New Product or Solution Page:**
- Primary code: Add route under `app/[lang]/products` or `app/[lang]/solutions`.
- Shared data: Put product constants in `config` when reused across pages or components.
- Reusable visual sections: Put route-specific sections next to the page; promote shared sections to `new-components` or `components`.

**New App Store Feature:**
- Data loading: Extend `config/apps-loader.ts` for app config access patterns.
- API behavior: Extend `lib/api/apps-api.ts` and route through `app/api/apps/[[...lang]]/route.ts`.
- UI: Add reusable app-store components under `components/app-store`.
- Static data: Regenerate or update `config/apps.json` through `scripts/generate-apps-api.js`.

**New API Route:**
- Primary code: Add `route.ts` under `app/api/<name>`.
- Shared business logic: Put reusable logic in `lib/api` or `lib/utils`.
- Responses: Use `NextResponse` and explicit status codes.
- Secrets: Read secret values from environment variables only.

**New Shared Component:**
- Stable UI primitive: Add to `components/ui`.
- Site-wide marketing component: Add to `new-components`.
- Legacy/shared header-footer/docs component: Add to the relevant folder under `components`.
- Client behavior: Add `'use client'` only in files that need browser hooks or events.

**New Utility:**
- Shared app utility: Add to `lib`.
- Blog/content utility: Add to `lib/utils`.
- Client hook: Add to `hooks`.
- External API adapter: Add to `lib/api`.

**New Static Asset:**
- Public URL asset: Add to `public`.
- Imported component asset: Add to `assets`.
- App icon generated by app-store flow: Add to `public/images/apps`.

## Special Directories

**`.planning`:**
- Purpose: GSD planning and codebase-map artifacts.
- Generated: Yes.
- Committed: Project-dependent; current codebase maps are written to `.planning/codebase`.

**`.source`:**
- Purpose: Generated Fumadocs source module imported by `lib/source.ts`.
- Generated: Yes, from `fumadocs-mdx`.
- Committed: Depends on repository policy; consumers should treat it as generated output.

**`content`:**
- Purpose: Source-of-truth site content.
- Generated: No.
- Committed: Yes.

**`config/apps.json`:**
- Purpose: Static app-store data consumed by `config/apps-loader.ts`.
- Generated: Yes, through `scripts/generate-apps-api.js`.
- Committed: Yes.

**`public/images/apps`:**
- Purpose: App-store icon/image assets referenced by generated app config.
- Generated: Partly generated by app data scripts.
- Committed: Yes.

**`node_modules`:**
- Purpose: npm dependency installation output.
- Generated: Yes.
- Committed: No.

**`.next`:**
- Purpose: Next.js build/dev output.
- Generated: Yes.
- Committed: No.

---

*Structure analysis: 2026-06-11*
