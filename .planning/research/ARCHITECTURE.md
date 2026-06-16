# Architecture Research: Sealos Skills Tutorial Alignment

**Researched:** 2026-06-16

## Content Architecture

Tutorial correctness has two coupled surfaces:

1. Visible MDX article body in `content/tutorials/**/index.en.mdx`.
2. Structured frontmatter metadata, especially `faq` and `howTo`, consumed by
   site metadata and structured-data utilities.

Both surfaces must be updated together. A body-only edit can leave stale FAQ or
HowTo content in generated SEO output.

## Source-Truth Architecture

Use upstream files as the authority chain:

1. `README.md` for install and usage copy.
2. `marketplaces/README.md` for support-claim boundaries.
3. `skills/sealos-deploy/SKILL.md` for deploy entry, scripts, logging, phase
   overview, and Runtime Truth Pass.
4. `skills/sealos-deploy/modules/pipeline.md` for artifact and update behavior.

## Execution Architecture

Phase 13 updates install and invocation copy first because it affects every
tutorial reader before deploy-specific steps.

Phase 14 updates deploy-flow content second because it depends on the host
entry language and spans article-specific sections.

Phase 15 updates metadata and validation last because structured metadata
should mirror the final visible copy.
