# Structure

## Directory Layout

```
sealos.io/
├── app/                          # Next.js App Router
│   ├── [lang]/                   # i18n dynamic segment
│   │   ├── (home)/               # Marketing site route group
│   │   │   ├── (new-home)/       # New landing page
│   │   │   │   ├── components/   # Homepage-specific components
│   │   │   │   ├── sections/     # Homepage sections (Hero, Caps, Demo, FAQ)
│   │   │   │   └── config/       # Homepage config (FAQ data, typewriter)
│   │   │   ├── blog/             # Blog pages and components
│   │   │   ├── comparison/       # Product comparison pages
│   │   │   ├── ai-quick-reference/ # FAQ/knowledge base
│   │   │   └── layout.tsx        # Header + Footer wrapper
│   │   ├── docs/                 # Documentation (fumadocs)
│   │   ├── products/             # Product pages
│   │   ├── solutions/            # Solution pages
│   │   ├── customers/            # Customer pages
│   │   ├── legal/                # Legal pages
│   │   ├── contact/              # Contact form
│   │   ├── abuse/                # Abuse report form
│   │   └── layout.tsx            # Root layout (HTML, providers)
│   ├── api/                      # API routes (build-time only)
│   │   ├── abuse/                # Abuse report endpoint
│   │   ├── apps/                 # App registry API
│   │   ├── blog/                 # Blog data API
│   │   ├── og/                   # OG image generation
│   │   ├── robots/               # robots.txt generation
│   │   └── search/               # Search index
│   ├── components/               # App-level components
│   ├── llms.txt/                 # LLM-friendly site description
│   ├── rss.xml/                  # RSS feed generation
│   └── sitemap-index.xml/        # Sitemap generation
├── assets/                       # SVG icons and images
├── components/                   # Shared component library
│   ├── analytics/                # GTM, analytics scripts
│   ├── animated-icons/           # Animated SVG icons
│   ├── app-store/                # App store components
│   ├── docs/                     # Documentation components
│   ├── feature/                  # Feature showcase components
│   ├── footer/                   # Legacy footer
│   ├── header/                   # Legacy header
│   ├── mdx/                     # MDX rendering components
│   └── ui/                       # shadcn/ui components
├── config/                       # Site configuration
│   ├── site.ts                   # Main site config
│   ├── apps.ts / apps.json       # App registry
│   ├── analytics.ts              # Analytics config
│   └── template-sources.json     # Template config
├── content/                      # Content files
│   ├── blog/                     # Blog MDX (categorized)
│   ├── docs/                     # Docs MDX
│   └── ai-quick-reference/       # ~2000 FAQ JSON files
├── fonts/                        # Custom font files
├── hooks/                        # React hooks
├── lib/                          # Utility libraries
│   ├── api/                      # API client utilities
│   ├── remark/                   # Custom remark plugins
│   ├── utils/                    # Metadata, structured data utils
│   ├── i18n.ts                   # i18n configuration
│   ├── source.ts                 # fumadocs source loader
│   └── utils.ts                  # General utilities (cn)
├── new-components/               # Redesigned components
│   ├── AuthForm/                 # Authentication form + provider
│   ├── DeployModal/              # Deploy modal + provider
│   ├── Footer/                   # New footer
│   └── Header/                   # New header
├── public/                       # Static assets
├── scripts/                      # Build scripts
├── types/                        # TypeScript type definitions
├── source.config.ts              # fumadocs content collections
├── next.config.mjs               # Next.js configuration
└── vercel.json                   # Vercel config (redirects)
```

## Key Locations

| What | Where |
|------|-------|
| Homepage | `app/[lang]/(home)/(new-home)/page.tsx` |
| Blog listing | `app/[lang]/(home)/blog/page.tsx` |
| Blog post | `app/[lang]/(home)/blog/[slug]/page.tsx` |
| Docs pages | `app/[lang]/docs/[[...slug]]/page.tsx` |
| Comparison pages | `app/[lang]/(home)/comparison/[slug]/page.tsx` |
| Site config | `config/site.ts` |
| Content schemas | `source.config.ts` |
| UI components | `components/ui/` |
| New Header/Footer | `new-components/Header/`, `new-components/Footer/` |
| Auth flow | `new-components/AuthForm/` |
| Deploy flow | `new-components/DeployModal/` |

## Naming Conventions

- **Components**: PascalCase files (`HeroSection.tsx`, `BlogGrid.tsx`)
- **Utilities**: camelCase files (`gtm-utils.ts`, `og-canvas.ts`)
- **Content**: kebab-case directories, locale-suffixed files (`index.en.mdx`)
- **Route groups**: Parenthesized (`(home)`, `(new-home)`)
- **Path alias**: `@/*` maps to project root
