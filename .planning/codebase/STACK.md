# Stack

## Languages & Runtime

- **TypeScript** — Primary language for all source code
- **Node.js 20** — Runtime (specified in `.nvmrc` and Dockerfile)
- **MDX** — Content authoring format for docs and blog

## Framework

- **Next.js 14.2.x** — React meta-framework
  - Static export mode (`output: 'export'` in production)
  - App Router with i18n via `[lang]` dynamic segment
  - Trailing slash enabled
  - SWC minification
  - Page extensions: `js, jsx, ts, tsx, md, mdx`

## UI & Styling

- **React 18.3** — UI library
- **Tailwind CSS v4.1** — Utility-first CSS (via `@tailwindcss/postcss`)
- **shadcn/ui** — Component library (new-york style, RSC-enabled)
  - Config: `components.json`, aliases: `@/components`, `@/lib/utils`
- **Radix UI** — Headless primitives (accordion, dialog, dropdown, popover, select, tooltip, etc.)
- **Lucide React** — Icon library
- **Motion (Framer Motion) 12.x** — Animation library
- **Three.js 0.170** — 3D graphics (used in homepage effects)
- **Matter.js** — 2D physics engine (used for tag animations)

## Content & Documentation

- **fumadocs-mdx 11.x** — MDX processing and content collections
- **fumadocs-core 15.x** — Documentation framework core
- **fumadocs-ui 15.x** — Documentation UI components
- **fumadocs-docgen** — Code generation utilities
- **Zod** — Schema validation for frontmatter
- **remark/remark-gfm/remark-html** — Markdown processing
- **Mermaid** — Diagram rendering in docs

## Build & Development

- **PostCSS** — CSS processing pipeline
- **Prettier** — Code formatting (with tailwindcss plugin)
- **TypeScript strict mode** — Type checking (`tsc --noEmit`)
- **@next/bundle-analyzer** — Optional bundle analysis (`ANALYZE=true`)

## Image & Media

- **Sharp** — Image processing
- **Satori** — OG image generation
- **Canvas (node-canvas)** — Server-side canvas rendering
- **react-player** — Video playback

## Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | ^14.2.28 | Framework |
| `react` | ^18.3.1 | UI |
| `tailwindcss` | ^4.1.3 | Styling |
| `fumadocs-mdx` | ^11.5.8 | Content |
| `motion` | ^12.23.24 | Animation |
| `three` | ^0.170.0 | 3D effects |
| `zod` | ^3.23.8 | Validation |
| `fuse.js` | ^7.1.0 | Client-side search |

## Configuration Files

| File | Purpose |
|------|---------|
| `next.config.mjs` | Next.js config (static export, MDX, images) |
| `tsconfig.json` | TypeScript (ESNext, bundler resolution, `@/*` alias) |
| `source.config.ts` | fumadocs content collections (docs, blog, ai-quick-reference) |
| `postcss.config.js` | PostCSS with Tailwind |
| `prettier.config.js` | Prettier with tailwind plugin |
| `components.json` | shadcn/ui configuration |
| `.nvmrc` | Node version (20) |
