---
phase: 16
slug: tutorial-template-baseline-and-expansion-map
status: complete
created: 2026-06-29
---

# Phase 16 Pattern Map

## Planned Artifact Roles

| Planned artifact | Role | Closest existing analog | Pattern to reuse |
|------------------|------|-------------------------|------------------|
| `16-TUTORIAL-TEMPLATE-BASELINE.md` | Durable source-backed contract for the existing three tutorial templates | `.planning/PROJECT.md`, `.planning/REQUIREMENTS.md`, three `content/tutorials/*/index.en.mdx` files | Use tables with explicit file paths and exact source terms |
| `16-TUTORIAL-EXPANSION-MAP.md` | Locked React and Node.js slug, image, series, order, and related-link map | `app/[lang]/(home)/tutorials/tutorial-growth-data.ts`, `lib/utils/tutorial-utils.ts` | Mirror generated slug patterns and series-order behavior |
| `16-FRAMEWORK-COPY-CHECKLIST.md` | Framework-specific substitution checklist for Phase 17 and Phase 18 authors | Phase 16 `CONTEXT.md` D-14 through D-20, existing tutorial body headings | Preserve Sealos workflow language while replacing framework-specific setup/runtime details |
| `16-VALIDATOR-EXPANSION-PLAN.md` | Source-scoped plan for expanding tutorial validator coverage in Phase 20 | `scripts/validate-tutorials.mjs` | Keep expected slug set, frontmatter checks, CTA checks, link validation, and forbidden stale references explicit |

## Integration Flow to Preserve

```text
content/tutorials/<slug>/index.en.mdx
  -> source.config.ts tutorial schema
  -> lib/source.ts tutorials loader
  -> lib/utils/tutorial-utils.ts sorting, adjacent links, related links
  -> app/[lang]/(home)/tutorials page and detail routes
  -> app/sitemap.ts English tutorial URLs
  -> scripts/validate-tutorials.mjs source contract checks
```

Phase 16 should document this flow, then defer source implementation to later
phases.

## File-Level Patterns

### `source.config.ts`

The tutorial schema already accepts the frontmatter needed by the new pages:
`stage`, `framework`, `series`, `seriesOrder`, `estimatedReadingTime`,
`primaryKeyword`, `targetKeywords`, `relatedTutorials`, and `cta`.

### `lib/utils/tutorial-utils.ts`

The tutorial utility layer sorts by `series` and `seriesOrder`, then derives
adjacent tutorials from pages with the same series. The expansion map must
therefore lock:

- `sealos-skills-react`
- `sealos-skills-nodejs`
- deploy order `1`
- PostgreSQL order `2`
- production order `3`

### `app/[lang]/(home)/tutorials/tutorial-growth-data.ts`

The inventory generator already produces React and Node.js slug shapes:

- deploy: `deploy-<framework>-sealos`
- PostgreSQL: `<framework>-postgresql-sealos`
- production: `<framework>-production-deployment-sealos`

The Phase 16 map should adopt those exact shapes.

### `scripts/validate-tutorials.mjs`

The validator currently treats the expected slug list as the publication
contract. Phase 20 should expand that contract from three to nine slugs and add
framework-aware stale-copy checks.

## Execution Constraints for Phase 16

- Create planning documents only.
- Keep tutorial body authoring in Phase 17 and Phase 18.
- Keep practice evidence and screenshot asset generation in Phase 19.
- Keep validator code changes and final expanded-set validation in Phase 20.
- Use exact source paths and exact slug names in every deliverable.

## Pattern Mapping Complete
