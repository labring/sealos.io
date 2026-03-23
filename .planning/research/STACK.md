# Technology Stack

**Project:** Sealos App Deploy Docs Restructure
**Researched:** 2026-03-23
**Scope:** Stack and tooling for restructuring an existing deployment-docs section inside the current static MDX docs site
**Overall recommendation:** Keep the current Next.js + Fumadocs + MDX platform. Add structure at the content-model and quality-gate layers, not a new docs platform.

## Recommended Stack

### Core platform to keep

| Technology | Version / State | Purpose | Why | Confidence |
|------------|-----------------|---------|-----|------------|
| Next.js App Router | Keep existing `next@14.2.x` static export setup | Site runtime and build pipeline | This project is an IA and content-system restructure, not a platform rewrite. The current site already fits the static hosting model and supports the docs routes, layouts, and page generation the section needs. | HIGH |
| `fumadocs-mdx` + `fumadocs-core` + `fumadocs-ui` | Keep existing majors already in repo | Content loading, page tree, sidebar, TOC, metadata, docs UI | Fumadocs already gives the exact primitives needed for a brownfield docs restructure: file-based routing, explicit page ordering, locale-aware page trees, and built-in search support. Replacing it would create migration work without solving the IA problem. | HIGH |
| Git-tracked MDX files in `content/docs/` | Keep existing | Source of truth for documentation content | Git-based MDX is the standard low-friction setup for product docs inside an app repo because it keeps review, versioning, and platform changes in the same workflow. For this effort, the bottleneck is structure and consistency, not authoring storage. | HIGH |
| Existing static search path with Fumadocs + Orama | Keep current static-search approach | Search and discovery without external infra | The repo already uses Fumadocs search with static export compatibility. That is the right 2025 pattern for a static docs site of this size: no extra hosted search dependency, no search migration during IA work. | HIGH |

### Information architecture and content system to add

| Technology / Pattern | Version / State | Purpose | Why | Confidence |
|----------------------|-----------------|---------|-----|------------|
| Diataxis content model | Adopt as the section-level IA model | Split content by user need: tutorial/get-started, how-to, reference, explanation | Deployment docs fail when feature pages are mistaken for a primary journey. Diataxis is the cleanest way to separate a first-success deployment path from follow-up operational references. | HIGH |
| GitLab CTRT topic typing | Adopt as the page-level discipline | Make each page clearly a concept, task, reference, or troubleshooting page | This prevents mixed-purpose pages and helps collapse thin content into durable page types. It is especially useful in brownfield docs where existing pages often mix overview, steps, and settings. | HIGH |
| Extended frontmatter schema in `source.config.ts` using existing Zod validation | Add repo-local schema fields | Make doc intent machine-readable and enforceable | The repo already validates frontmatter with Zod. Extend that schema instead of adding a CMS. Recommended minimum fields for this section: `title`, `description`, `docType`, `journey`, `prerequisites`, `related`, `lastReviewed`. | HIGH |
| Explicit `meta.en.json`-driven navigation | Keep and expand | Curated order, grouping, and section labels | A deployment journey should not rely on alphabetical order. Fumadocs `meta.json` ordering is the correct control surface for a docs restructure because it is explicit, reviewable, and local to the section. | HIGH |
| Fumadocs folder groups `(group-name)` where source grouping should not change URLs | Use selectively | Reorganize source files without unnecessary slug churn | Brownfield docs often need editorial regrouping before they need URL changes. Folder groups let the team improve maintainability without spending redirect budget on every move. | HIGH |
| Small shared MDX components only for repeatable doc structures | Add a few local components if needed | Standardize repeated blocks like prerequisites, result, related topics, troubleshooting | This improves consistency without turning docs pages into JSX-heavy app code. Use components only for stable patterns that appear many times. | MEDIUM |

### Supporting tooling to add

| Tool | Version / State | Purpose | Why | Confidence |
|------|-----------------|---------|-----|------------|
| Vale CLI | Add as a prose linter | Enforce heading, style, terminology, and procedure consistency | Once the section is restructured, consistency becomes the next failure mode. Vale is the standard docs-team tool for making a style guide enforceable in CI and editors. | HIGH |
| `markdownlint-cli2` | Add as a Markdown structure linter | Catch heading/list/format issues early | It is a low-overhead way to keep MDX content structurally consistent during a large page move and rewrite. | MEDIUM |
| `lychee` | Add as a link checker | Catch broken internal and external links after URL changes | Link breakage is one of the highest-probability regressions in a brownfield docs restructure. A dedicated checker is worth adding. | HIGH |
| Existing `npm run lint` and `npm run build` | Keep existing | Build-safe validation | The current project already treats successful type-check and build as the primary safety gate. Keep that, then layer docs-specific checks on top. | HIGH |

### Infrastructure considerations for URL changes

| Technology / Capability | Version / State | Purpose | Why | Confidence |
|-------------------------|-----------------|---------|-----|------------|
| Host-level redirect mapping | Add only if URLs change materially | Preserve bookmarks and SEO equity | Next.js static export does not support runtime redirect behavior the way a server-rendered deployment does. If URLs change, redirects need to live in the hosting layer or be handled with alias pages. | HIGH |
| Existing locale file convention (`*.en.mdx`, `*.zh-cn.mdx`, locale meta files) | Keep existing | Maintain compatibility with the current i18n model | The milestone is English-only. Do not redesign locale architecture while restructuring one English docs section. | HIGH |

## Prescriptive recommendations

### Use this stack

1. Keep the existing Next.js static-export docs app.
2. Keep Fumadocs as the docs runtime, navigation system, and search system.
3. Restructure the App Deploy section around one dominant first-success path plus follow-up task/reference pages.
4. Encode page intent in frontmatter and navigation files, not in ad hoc naming.
5. Add docs-specific quality gates: prose lint, markdown lint, and link checking.
6. Use host-level redirects only for the pages whose URLs truly need to change.

### Implement it this way

- Use one end-to-end deployment tutorial or get-started page as the primary entry point.
- Move operational topics like autoscaling, storage, config, certificates, and updates into how-to/reference follow-ups.
- Keep `meta.en.json` as the source of truth for sidebar order and section labels.
- Use Fumadocs folder groups when you want better editorial organization without changing public slugs.
- Extend the existing Zod schema instead of adding a separate content system.
- Keep pages Markdown-first even though the file format is MDX.

### Minimal frontmatter schema to introduce

```ts
{
  title: string;
  description: string;
  docType: 'tutorial' | 'how-to' | 'reference' | 'troubleshooting';
  journey: 'first-deploy' | 'operate' | 'migrate';
  prerequisites?: string[];
  related?: string[];
  lastReviewed?: string;
}
```

Why this set:

- `docType` enforces page purpose.
- `journey` supports navigation and future filtering.
- `prerequisites` prevents hidden setup assumptions.
- `related` creates intentional cross-links after page splitting or consolidation.
- `lastReviewed` gives lightweight freshness tracking without introducing a CMS workflow.

## What not to change

| Do not change / introduce | Why not |
|---------------------------|---------|
| Do not migrate to Docusaurus, Starlight, Nextra, or another docs framework | The current platform already supports the needed restructure. A framework migration would dominate the milestone and bury the actual IA work. |
| Do not introduce a headless CMS | This restructure needs stronger file conventions and validation, not remote content infrastructure. A CMS adds workflow and modeling complexity with little payoff here. |
| Do not replace built-in Fumadocs search with Algolia/Meilisearch as part of this milestone | Search is not the bottleneck, and the current static-search setup already fits the site architecture. External search can be reconsidered only if docs scale or relevance becomes a proven problem. |
| Do not bundle a Next.js major upgrade with the docs restructure | Platform upgrades and IA work fail for different reasons. Combining them makes regressions harder to isolate. |
| Do not redesign the whole docs-site i18n model | The milestone is English-only and the existing locale setup already works with Fumadocs. |
| Do not overuse custom React components inside docs pages | JSX-heavy docs become harder to review and maintain. Reserve components for reusable structural blocks only. |
| Do not rely on implicit alphabetical navigation | A deployment journey needs deliberate ordering, not filesystem luck. |

## Alternatives considered

| Category | Recommended | Alternative | Why not |
|----------|-------------|-------------|---------|
| Docs framework | Keep Next.js + Fumadocs | Docusaurus / Starlight / Nextra | Migration cost is far larger than the IA gain for this milestone. |
| Content source | Git-based MDX in repo | Headless CMS | Adds operational complexity without solving page-purpose and navigation problems. |
| Search | Built-in Fumadocs Orama static search | Algolia / Meilisearch | Unnecessary new service for a section restructure inside a static site. |
| IA control | `meta.en.json` + frontmatter + folder groups | Pure filesystem order | Too implicit for a journey-led docs experience. |
| URL migration handling | Host-level redirects or alias pages | Next.js runtime redirects | Not the right fit for a static-export deployment. |

## Installation

No new runtime framework is required for this restructure. Only add dev-time docs tooling.

```bash
# Existing validation
npm run lint
npm run build

# Suggested docs quality tools
npm install -D markdownlint-cli2

# Non-Node CLIs: install from official sources
# Vale: https://vale.sh/docs/install
# Lychee: https://lychee.cli.rs/ or https://github.com/lycheeverse/lychee
```

## Repo fit

These recommendations fit the current codebase directly:

- `source.config.ts` already centralizes frontmatter schema and MDX config, so schema extension belongs there.
- `lib/source.ts` already uses Fumadocs `loader()`, so page-tree-driven IA remains the correct abstraction.
- `app/[lang]/docs/layout.tsx` already renders `source.pageTree[lang]`, so navigation changes should be expressed through content structure and meta files.
- `app/api/search/route.ts` and `components/docs/Search.tsx` already implement static-export-friendly search, so search should be retained, not replaced.
- `content/docs/guides/app-deploy/meta.en.json` already acts as a local ordering file, so the App Deploy restructure should continue to use that pattern.

## Sources

- Fumadocs MDX overview: https://www.fumadocs.dev/docs/mdx (HIGH)
- Fumadocs page conventions and `meta.json` ordering: https://www.fumadocs.dev/docs/page-conventions (HIGH)
- Fumadocs page tree model: https://www.fumadocs.dev/docs/headless/page-tree (HIGH)
- Fumadocs internationalization: https://www.fumadocs.dev/docs/headless/internationalization and https://www.fumadocs.dev/docs/internationalization (HIGH)
- Fumadocs static build guidance: https://www.fumadocs.dev/docs/deploying/static (HIGH)
- Fumadocs built-in search / Orama: https://www.fumadocs.dev/docs/headless/search/orama and https://www.fumadocs.dev/docs/search/orama (HIGH)
- Next.js static export guide: https://nextjs.org/docs/app/guides/static-exports (HIGH)
- Next.js `generateStaticParams`: https://nextjs.org/docs/app/api-reference/functions/generate-static-params (HIGH)
- Diataxis map: https://diataxis.fr/map/ (HIGH)
- Diataxis how-to guides: https://diataxis.fr/how-to-guides/ (HIGH)
- Diataxis tutorials: https://www.diataxis.fr/tutorials/ (HIGH)
- Diataxis reference: https://diataxis.fr/reference/ (HIGH)
- GitLab documentation topic types: https://docs.gitlab.com/development/documentation/topic_types/ (HIGH)
- GitLab task topic type: https://docs.gitlab.com/development/documentation/topic_types/task/ (HIGH)
- GitLab reference topic type: https://docs.gitlab.com/development/documentation/topic_types/reference/ (HIGH)
- Google developer documentation style guide, headings: https://developers.google.com/style/headings (HIGH)
- Google developer documentation style guide, procedures: https://developers.google.com/style/procedures (HIGH)
- Vale introduction and configuration: https://vale.sh/docs/, https://vale.sh/docs/install, https://vale.sh/docs/vale-ini (HIGH)
- markdownlint-cli2 repository: https://github.com/DavidAnson/markdownlint-cli2 (MEDIUM; primary source is the official project repository)
- Lychee project: https://github.com/lycheeverse/lychee (MEDIUM; primary source is the official project repository)
