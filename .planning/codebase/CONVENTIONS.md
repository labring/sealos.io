# Conventions

## Code Style

- **Prettier** enforced: single quotes, semicolons, trailing commas (all), 2-space indent, 80 char width, LF endings
- **Tailwind class sorting** via `prettier-plugin-tailwindcss`
- **TypeScript strict mode** — `tsc --noEmit` for type checking
- **ESNext target** — Modern JS features, bundler module resolution

## Component Patterns

- Functional components with TypeScript
- Default exports for page components, named exports for shared
- `cn()` utility (clsx + tailwind-merge) for conditional classes
- **Provider pattern** — `AuthFormProvider`, `DeployModalProvider` in root layout
- **Route groups** — `(home)`, `(new-home)` for layout organization
- **Section-based page composition** — Homepage built from discrete section components

## Import Conventions

- **Path alias**: `@/` for project root (`@/lib/utils`, `@/components/ui`)
- Relative imports for co-located files
- Named imports for utilities, default for npm React components

## Content Conventions

### Blog Posts
- Located in `content/blog/(category)/`
- Filename: `index.{locale}.mdx`
- Required frontmatter: `title`, `description`, `date`, `tags`, `authors`
- Optional: `image`, `faq` (structured FAQ schema), `howTo` (structured how-to schema)

### Documentation
- Located in `content/docs/`
- fumadocs meta files for navigation
- remark plugins: `remarkMermaid`, `remarkInstall`

### AI Quick Reference
- Located in `content/ai-quick-reference/`
- JSON format: `title`, `description`, `category`, `keywords`, `content`
- ~2000 entries covering cloud-native topics

## Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `HeroSection.tsx` |
| Hooks | camelCase with `use` prefix | `useTypewriterEffect.ts` |
| Utilities | camelCase | `gtm-utils.ts` |
| Config | camelCase | `site.ts` |
| Content dirs | kebab-case | `ai-quick-reference/` |
| Route groups | parenthesized | `(new-home)` |
