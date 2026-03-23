# Conventions

## Code Style

- **Prettier** enforced with:
  - Single quotes, semicolons, trailing commas (all)
  - 2-space indentation, 80 char print width
  - LF line endings
  - Tailwind class sorting via `prettier-plugin-tailwindcss`
- **TypeScript strict mode** — `tsc --noEmit` for type checking
- **ESNext target** — Modern JS features, bundler module resolution

## Component Patterns

### File Organization
- One component per file (PascalCase)
- Co-located styles via Tailwind utility classes
- Sections separated from components (`sections/HeroSection.tsx` vs `components/BorderBeam.tsx`)

### Component Style
- Functional components with TypeScript
- Default exports for page components
- Named exports for shared components
- `cn()` utility (clsx + tailwind-merge) for conditional classes:
  ```typescript
  import { cn } from '@/lib/utils';
  className={cn('base-class', condition && 'conditional-class')}
  ```

### Patterns Used
- **Provider pattern** — `AuthFormProvider`, `DeployModalProvider` wrapping app in root layout
- **Route groups** — `(home)`, `(new-home)` for layout organization without URL impact
- **Parallel component systems** — Legacy `components/` and new `new-components/` coexist
- **Section-based page composition** — Homepage built from discrete section components

## Import Conventions

- **Path alias**: `@/` for project root (e.g., `@/lib/utils`, `@/components/ui`)
- **Relative imports** for co-located files within same directory
- **Named imports** preferred for utilities and hooks
- **Default imports** for React components from npm packages

## Content Conventions

### Blog Posts
- Located in `content/blog/(category)/` route groups
- Filename: `index.{locale}.mdx`
- Required frontmatter: `title`, `description`, `date`, `tags`, `authors`
- Optional: `image`, `imageTitle`, `faq` (structured FAQ schema), `howTo` (structured how-to schema)

### Documentation
- Located in `content/docs/`
- Uses fumadocs meta files for navigation structure
- Supports remark plugins: `remarkMermaid`, `remarkInstall`

### AI Quick Reference
- Located in `content/ai-quick-reference/`
- JSON format with: `title`, `description`, `category`, `keywords`, `content`
- ~2000 entries covering cloud-native topics

## Error Handling

- Console removal in production (except `error`, `warn`)
- CSP for SVG images: `default-src 'self'; script-src 'none'; sandbox;`
- Turnstile rate limiting for abuse reports (10 req/min)

## Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `HeroSection.tsx` |
| Hooks | camelCase with `use` prefix | `useTypewriterEffect.ts` |
| Utilities | camelCase | `gtm-utils.ts` |
| Config | camelCase | `site.ts` |
| Content dirs | kebab-case | `ai-quick-reference/` |
| Route groups | parenthesized | `(new-home)` |
| CSS classes | Tailwind utilities | `className="flex items-center"` |
