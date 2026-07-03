# Sealos.io Tutorial Content Accuracy

## What This Is

This project maintains Sealos.io tutorial content for developers who use AI
agents to deploy applications to Sealos Cloud. The current milestone expands the
existing Next.js tutorial pattern into React and Node.js tutorial series with
practice-backed screenshots, verified assets, and tutorial validation coverage.

The immediate deliverable is an accurate English tutorial set that teaches
React, Node.js, and Next.js deployment paths with consistent Sealos Skills
workflow expectations and screenshots captured from real Sealos practice.

## Core Value

Readers can follow framework-specific Sealos tutorials with commands,
screenshots, and validation evidence that match the current product workflow.

## Current Milestone: v1.2 React and Node.js Tutorial Expansion

**Goal:** Use the three existing Next.js tutorials as templates to add React and
Node.js tutorial series with real practice screenshots and repository validation.

**Target features:**
- React beginner deployment tutorial modeled on
  `deploy-nextjs-sealos`.
- React PostgreSQL/full-stack tutorial modeled on
  `nextjs-postgresql-sealos`.
- React production checklist tutorial modeled on
  `nextjs-production-deployment-sealos`.
- Node.js beginner deployment tutorial modeled on
  `deploy-nextjs-sealos`.
- Node.js PostgreSQL/full-stack tutorial modeled on
  `nextjs-postgresql-sealos`.
- Node.js production checklist tutorial modeled on
  `nextjs-production-deployment-sealos`.
- Practice-backed screenshots for the new tutorials, captured from real Sealos
  runs, redacted where needed, compressed to WebP, and referenced from MDX.
- Tutorial metadata, listing, adjacent tutorial navigation, image references,
  and validation scripts updated to include the new React and Node.js series.

## Requirements

### Validated

- ✓ Static-first localized Next.js App Router site exists — implemented through
  `app/[lang]`, `next.config.mjs`, and static export build behavior.
- ✓ Documentation, blog, and tutorial content are loaded through Fumadocs —
  implemented in `source.config.ts`, `lib/source.ts`, and `content/**`.
- ✓ Tutorial listing and detail routes exist — implemented under
  `app/[lang]/(home)/tutorials/**`.
- ✓ Next.js tutorial content exists — implemented under `content/tutorials/`
  with beginner, PostgreSQL, and production checklist articles.
- ✓ Sealos Skills landing-page routing exists — referenced through
  `/sealos-skills` and sitemap metadata.
- ✓ Sealos Skills tutorial install, invocation, deploy-flow, metadata, and
  validation guidance was aligned with upstream source truth — completed in
  v1.1 phases 13 through 15.

### Active

- [ ] Add a React beginner tutorial that follows the existing beginner Next.js
  tutorial structure while using React-specific project setup, deployment
  language, metadata, links, and screenshots.
- [ ] Add a React PostgreSQL/full-stack tutorial that follows the existing
  PostgreSQL Next.js tutorial structure while using React-specific app, database,
  environment, migration, and verification guidance.
- [ ] Add a React production checklist tutorial that follows the existing
  production Next.js tutorial structure while using React-specific build,
  deployment, rollback, and runtime verification guidance.
- [ ] Add a Node.js beginner tutorial that follows the existing beginner Next.js
  tutorial structure while using Node.js-specific project setup, deployment
  language, metadata, links, and screenshots.
- [ ] Add a Node.js PostgreSQL/full-stack tutorial that follows the existing
  PostgreSQL Next.js tutorial structure while using Node.js-specific service,
  database, environment, migration, and verification guidance.
- [ ] Add a Node.js production checklist tutorial that follows the existing
  production Next.js tutorial structure while using Node.js-specific build,
  deployment, rollback, and runtime verification guidance.
- [ ] Capture real Sealos practice evidence for React and Node.js paths before
  producing screenshots.
- [ ] Store tutorial screenshots as referenced WebP assets with validated
  dimensions, file sizes, and MDX references.
- [ ] Update tutorial listing, metadata utilities, related tutorial links, and
  validation scripts so the new series are first-class `/tutorials` pages.
- [ ] Validate the expanded tutorial set with targeted searches, tutorial
  validation, image checks, and TypeScript/content checks.

### Out of Scope

- New framework tutorial families beyond React and Node.js — this milestone
  expands the current tutorial pattern to the two requested ecosystems.
- Non-English tutorial localization — current tutorial publication remains
  English-only for this milestone.
- Visual redesign of the tutorial pages — the work extends content, metadata,
  screenshots, and validation coverage.
- Sealos Skills behavior changes — tutorial content consumes the current Sealos
  workflow as source truth.
- Screenshot assets generated from imagined states — screenshots must come from
  this milestone's practice evidence.

## Context

The active tutorial set contains exactly three English Next.js pages:

- `content/tutorials/deploy-nextjs-sealos/index.en.mdx`
- `content/tutorials/nextjs-postgresql-sealos/index.en.mdx`
- `content/tutorials/nextjs-production-deployment-sealos/index.en.mdx`

Their image assets live under:

- `public/images/deploy-nextjs-sealos/`
- `public/images/nextjs-postgresql-sealos/`
- `public/images/nextjs-production-deployment-sealos/`

The existing tutorial utility and validation surfaces include
`lib/utils/tutorial-utils.ts`, `source.config.ts`, and
`scripts/validate-tutorials.mjs`. The validator currently expects the three
Next.js tutorial slugs and should be expanded or refactored for React and
Node.js publication.

Prior tutorial screenshot work established a real-evidence workflow: capture
live namespace evidence with `kubectl` and `curl`, redact literal secrets,
render screenshots from the actual outputs or browser state, convert assets to
WebP, verify dimensions and file size, confirm source references, and run
`npm run validate-tutorials`.

## Constraints

- **Template parity**: The React and Node.js series should preserve the
  information architecture, metadata depth, CTA pattern, and validation style of
  the three existing Next.js tutorials.
- **Practice evidence**: Screenshots must be based on real Sealos practice for
  the React and Node.js paths, with credentials and sensitive values redacted.
- **Asset quality**: Tutorial screenshots should use WebP, keep stable
  dimensions, stay reasonably small, and have exact MDX references.
- **SEO consistency**: Frontmatter, FAQ, HowTo steps, target keywords, related
  tutorials, and visible body copy must agree for every new tutorial.
- **Validation**: Use CodeGraph for indexed code exploration, targeted `rg`,
  `npm run validate-tutorials`, image checks, and the narrowest appropriate
  TypeScript/content validation.
- **Language**: Planning docs, code, code comments, commits, and PR text are
  written in English.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Scope v1.2 to React and Node.js tutorial families | The user asked to use the three `/tutorials` Next.js articles as templates for React and Node.js. | — Pending |
| Mirror the three-part Next.js tutorial taxonomy for both new ecosystems | Beginner, PostgreSQL/full-stack, and production checklist coverage keeps the tutorial catalog predictable. | — Pending |
| Require fresh practice evidence before screenshot creation | The user explicitly asked for self-practiced screenshots, and prior tutorial work used evidence-backed assets. | — Pending |
| Store new tutorial screenshots as WebP assets under framework-specific image folders | Existing tutorial assets use per-slug image folders, and WebP keeps article weight manageable. | — Pending |
| Start this roadmap at Phase 16 | The previous tutorial-alignment milestone completed phases 13 through 15, so Phase 16 preserves sequential planning history. | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `$gsd-transition`):
1. Requirements invalidated? -> Move to Out of Scope with reason
2. Requirements validated? -> Move to Validated with phase reference
3. New requirements emerged? -> Add to Active
4. Decisions to log? -> Add to Key Decisions
5. "What This Is" still accurate? -> Update if drifted

**After each milestone** (via `$gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-06-29 after v1.2 milestone initialization*
