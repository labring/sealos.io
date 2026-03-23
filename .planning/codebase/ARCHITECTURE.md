# Architecture

## Pattern

**Static Site Generator** — Next.js App Router with static export. All pages are pre-rendered at build time and served as static HTML/CSS/JS via Cloudflare Pages or nginx.

No server-side rendering at runtime. API routes exist but are build-time only (OG image generation, search index, etc.).

## Layers

### Content Layer
- **fumadocs-mdx** processes MDX content from `content/` directory
- Three content collections defined in `source.config.ts`:
  - `docs` — Documentation (`content/docs/`)
  - `blog` — Blog posts (`content/blog/`)
  - `aiQuickReference` — FAQ/knowledge base (`content/ai-quick-reference/`)
- Content is loaded via fumadocs `loader()` in `lib/source.ts`
- Frontmatter validated with Zod schemas

### Presentation Layer
- **App Router** with `[lang]` dynamic segment for i18n
- Route groups organize pages:
  - `(home)` — Main marketing site (homepage, blog, comparison, FAQ)
  - `(new-home)` — New landing page design
  - `docs` — Documentation pages
  - `products`, `solutions`, `customers` — Marketing pages
  - `legal`, `contact`, `abuse` — Utility pages
- Two component systems coexist:
  - `components/` — Original component library
  - `new-components/` — Redesigned components (Header, Footer, AuthForm, DeployModal)

### Integration Layer
- `lib/api/` — API client utilities
- `config/` — Site configuration, app registry, template sources
- `hooks/` — React hooks (GTM, button handlers, template sources, typewriter)

## Data Flow

```
content/*.mdx → fumadocs-mdx → source.config.ts → lib/source.ts → pages
                                     ↓
                              Zod validation
                                     ↓
config/*.ts → React components → static HTML
     ↓
External APIs (Sealos platform) ← client-side only (auth, deploy)
```

## i18n Architecture

- Two locales: `en` (default), `zh-cn`
- URL pattern: `/{lang}/...` (default locale omitted via `hideLocale: 'default-locale'`)
- Content files use locale suffixes: `*.en.mdx`, `*.zh-cn.mdx`
- Chinese locale redirects to `sealos.run` domain (via `vercel.json`)
- i18n config: `lib/i18n.ts`

## Entry Points

| Entry Point | File | Purpose |
|------------|------|---------|
| Root layout | `app/[lang]/layout.tsx` | HTML shell, providers, analytics |
| Home layout | `app/[lang]/(home)/layout.tsx` | Marketing page wrapper |
| Homepage | `app/[lang]/(home)/(new-home)/page.tsx` | Landing page |
| Blog | `app/[lang]/(home)/blog/page.tsx` | Blog listing |
| Docs | `app/[lang]/docs/[[...slug]]/page.tsx` | Documentation |
| API routes | `app/api/*/route.ts` | Build-time APIs |

## Key Abstractions

- **fumadocs source loader** (`lib/source.ts`) — Unified content access
- **AuthFormProvider** (`new-components/AuthForm/`) — Authentication UI state
- **DeployModalProvider** (`new-components/DeployModal/`) — One-click deploy flow
- **siteConfig** (`config/site.ts`) — Centralized site configuration
- **Analytics** (`components/analytics/`) — GTM and tracking setup
