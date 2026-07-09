# Roadmap: React and Node.js Tutorial Expansion

## Overview

This roadmap expands the Sealos.io tutorial catalog from the existing three
Next.js tutorials into React and Node.js series. The milestone keeps the
existing tutorial information architecture, Sealos Skills workflow guidance, and
validation style while requiring fresh practice evidence for screenshots.

The milestone has five phases: baseline extraction, React tutorial creation,
Node.js tutorial creation, practice-backed screenshot integration, and final
expanded-set validation.

## Phases

**Phase Numbering:**

- Integer phases (16, 17, 18, 19, 20): Planned milestone work.
- New phase directories continue after the completed v1.1 tutorial phases 13,
  14, and 15.

- [ ] **Phase 16: Tutorial Template Baseline and Expansion Map** - Extract the
  reusable tutorial contract from the three Next.js pages and lock the React and
  Node.js slug, metadata, link, and image plan.

- [ ] **Phase 17: React Tutorial Series** - Create the React beginner,
  PostgreSQL/full-stack, and production checklist tutorials with metadata,
  links, screenshots placeholders, and source validation.

- [ ] **Phase 18: Node.js Tutorial Series** - Create the Node.js beginner,
  PostgreSQL/full-stack, and production checklist tutorials with metadata,
  links, screenshots placeholders, and source validation.

- [ ] **Phase 19: Practice Evidence and Screenshot Assets** - Run the React and
  Node.js Sealos practice flows, capture evidence, redact sensitive values,
  produce WebP screenshots, and wire assets into the six new tutorials.

- [ ] **Phase 20: Expanded Tutorial Validation and Release Check** - Expand and
  run tutorial validation, image checks, targeted searches, and final
  TypeScript/content validation for the nine-page tutorial set.

## Phase Details

### Phase 16: Tutorial Template Baseline and Expansion Map

**Goal**: The implementation team has a locked template contract and expansion
map before authoring new tutorial content.
**Depends on**: Milestone initialization
**Rationale**: The user asked to use the three existing Next.js articles as the
template, so structure, metadata, link topology, screenshot conventions, and
validation expectations should be explicit before copy creation.
**Deliverables**:

  1. Baseline notes covering the reusable structure of the three Next.js
     tutorials.
  2. Final React and Node.js slug map, image folder map, series order, and
     related tutorial graph.
  3. Framework-specific copy checklist for replacing Next.js-only wording while
     preserving Sealos Skills workflow language.
  4. Validator expansion plan for the expected nine tutorial slugs.

**Requirements**: BASE-01, BASE-02, BASE-03
**Success Criteria**:

  1. The template baseline names the frontmatter keys, body sections, CTA
     pattern, link pattern, image convention, and validation checks that new
     tutorials must follow.
  2. Every planned React and Node.js page has a final slug, image folder, stage,
     series order, related tutorial list, and target framework label.
  3. The copy checklist identifies framework-specific replacements for setup,
     build, runtime, database, migration, production, and verification language.
  4. The validation plan explains how `scripts/validate-tutorials.mjs` will
     accept the expanded tutorial set.

**Likely Files**: `content/tutorials/**/index.en.mdx`,
`public/images/*`, `scripts/validate-tutorials.mjs`,
`lib/utils/tutorial-utils.ts`, `source.config.ts`
**Validation Approach**: Use CodeGraph for tutorial utilities, targeted `rg`
over `content/tutorials`, and manual comparison of the three current tutorial
files.

### Phase 17: React Tutorial Series

**Goal**: React readers can follow the three-part Sealos tutorial path with
React-specific content and metadata.
**Depends on**: Phase 16
**Rationale**: React is the first requested ecosystem and should reuse the
established beginner, PostgreSQL/full-stack, and production tutorial taxonomy.
**Deliverables**:

  1. React beginner deployment tutorial.
  2. React PostgreSQL/full-stack tutorial.
  3. React production checklist tutorial.
  4. React tutorial metadata, related tutorial links, CTA references, listing
     behavior, and temporary screenshot references or placeholders.

**Requirements**: REACT-01, REACT-02, REACT-03, REACT-04
**Success Criteria**:

  1. The React beginner tutorial can be read independently and follows the
     beginner Next.js tutorial structure with React-specific commands and
     deployment expectations.
  2. The React PostgreSQL tutorial teaches the app, database, environment,
     migration, and runtime verification path with React-specific language.
  3. The React production checklist teaches build, deploy, update, rollback,
     logs, health checks, Runtime Truth Pass, and resource footprint checks with
     React-specific language.
  4. React tutorials appear in the tutorial source set with valid frontmatter,
     related links, CTA data, and no broken `/tutorials/<slug>` references.

**Likely Files**: `content/tutorials/react-*/index.en.mdx`,
`public/images/react-*`, `scripts/validate-tutorials.mjs`,
`lib/utils/tutorial-utils.ts`
**Validation Approach**: Run targeted searches for React, Next.js-only remnants,
required Sealos Skills phrases, and internal tutorial links; run
`npm run validate-tutorials` after validator updates are in place.

### Phase 18: Node.js Tutorial Series

**Goal**: Node.js readers can follow the three-part Sealos tutorial path with
Node.js-specific content and metadata.
**Depends on**: Phase 17
**Rationale**: Node.js service deployment differs from React static/app
deployment in entrypoint, process, health, and backend/database language, so it
gets a dedicated content phase.
**Deliverables**:

  1. Node.js beginner deployment tutorial.
  2. Node.js PostgreSQL/full-stack tutorial.
  3. Node.js production checklist tutorial.
  4. Node.js tutorial metadata, related tutorial links, CTA references, listing
     behavior, and temporary screenshot references or placeholders.

**Requirements**: NODE-01, NODE-02, NODE-03, NODE-04
**Success Criteria**:

  1. The Node.js beginner tutorial can be read independently and follows the
     beginner Next.js tutorial structure with Node.js-specific commands,
     server entrypoint, and deployment expectations.
  2. The Node.js PostgreSQL tutorial teaches service, database, environment,
     migration, and runtime verification with Node.js-specific language.
  3. The Node.js production checklist teaches process management, health checks,
     deploy, update, rollback, logs, Runtime Truth Pass, and resource footprint
     checks with Node.js-specific language.
  4. Node.js tutorials appear in the tutorial source set with valid frontmatter,
     related links, CTA data, and no broken `/tutorials/<slug>` references.

**Likely Files**: `content/tutorials/nodejs-*/index.en.mdx`,
`public/images/nodejs-*`, `scripts/validate-tutorials.mjs`,
`lib/utils/tutorial-utils.ts`
**Validation Approach**: Run targeted searches for Node.js, Next.js-only
remnants, required Sealos Skills phrases, and internal tutorial links; run
`npm run validate-tutorials` after validator updates are in place.

### Phase 19: Practice Evidence and Screenshot Assets

**Goal**: Every new tutorial screenshot is backed by real Sealos practice
evidence and wired as a validated WebP asset.
**Depends on**: Phase 18
**Rationale**: The user explicitly required self-practice screenshots, and prior
tutorial work established that runtime truth is stronger than source-only
claims for tutorial visuals.
**Deliverables**:

  1. React practice evidence package covering beginner, PostgreSQL/full-stack,
     and production checklist screenshot states.
  2. Node.js practice evidence package covering beginner, PostgreSQL/full-stack,
     and production checklist screenshot states.
  3. Redacted screenshot sources or rendered captures for all new tutorial image
     slots.
  4. WebP screenshot assets under the new tutorial image folders.
  5. Updated MDX references from placeholders to final screenshot assets.

**Requirements**: SHOT-01, SHOT-02, SHOT-03, SHOT-04
**Success Criteria**:

  1. Each new screenshot has a traceable evidence source from a real Sealos
     practice command, browser state, or runtime verification step.
  2. Sensitive tokens, passwords, connection strings, and literal secrets are
     redacted in evidence and visible screenshot content.
  3. Every new tutorial image is WebP, has expected dimensions, stays inside the
     image-size budget, and is referenced by exactly the intended MDX files.
  4. Screenshot content matches the adjacent tutorial step and does not show
     contradictory framework, command, or deployment state.

**Likely Files**: `public/images/react-*/*.webp`,
`public/images/nodejs-*/*.webp`, `content/tutorials/react-*/index.en.mdx`,
`content/tutorials/nodejs-*/index.en.mdx`,
`.planning/phases/19-practice-evidence-and-screenshot-assets/*`
**Validation Approach**: Run live `kubectl`/`curl`/browser checks as applicable,
redaction review, image dimension and file-size checks, MDX reference checks,
and `npm run validate-tutorials`.

### Phase 20: Expanded Tutorial Validation and Release Check

**Goal**: The nine-page tutorial catalog is internally consistent, validated,
and ready for implementation closeout.
**Depends on**: Phase 19
**Rationale**: Adding six content pages and image sets expands the validation
surface, so final checks must cover source metadata, links, screenshots,
terminology, and TypeScript/content integration.
**Deliverables**:

  1. Expanded `scripts/validate-tutorials.mjs` coverage for all nine expected
     tutorial slugs.
  2. Targeted stale-reference and terminology search report.
  3. Image reference and asset budget report.
  4. Passing `npm run validate-tutorials`.
  5. Passing TypeScript/content validation for touched files.
  6. Final changed-file scope review.

**Requirements**: VALID-01, VALID-02, VALID-03, VALID-04
**Success Criteria**:

  1. `npm run validate-tutorials` passes for the expanded tutorial set.
  2. Targeted searches prove required Sealos Skills, Runtime Truth Pass,
     `.sealos/`, DEPLOY/UPDATE, CTA, and internal link terms are intentional.
  3. Image checks prove every new MDX image reference resolves to a local WebP
     asset with expected dimensions and file size.
  4. TypeScript/content validation passes for touched utilities and generated
     source expectations.
  5. Final diff review shows the work is scoped to tutorial content, tutorial
     assets, tutorial metadata/utilities, validation scripts, and GSD artifacts.

**Likely Files**: `scripts/validate-tutorials.mjs`,
`content/tutorials/**/*.mdx`, `public/images/**/*.webp`,
`lib/utils/tutorial-utils.ts`, `source.config.ts`
**Validation Approach**: Run `npm run validate-tutorials`, `npm run lint`,
targeted `rg`, image `sips`/file-size checks, and `git diff --check`.

## Requirement Coverage

| Requirement | Phase |
|-------------|-------|
| BASE-01 | Phase 16 |
| BASE-02 | Phase 16 |
| BASE-03 | Phase 16 |
| REACT-01 | Phase 17 |
| REACT-02 | Phase 17 |
| REACT-03 | Phase 17 |
| REACT-04 | Phase 17 |
| NODE-01 | Phase 18 |
| NODE-02 | Phase 18 |
| NODE-03 | Phase 18 |
| NODE-04 | Phase 18 |
| SHOT-01 | Phase 19 |
| SHOT-02 | Phase 19 |
| SHOT-03 | Phase 19 |
| SHOT-04 | Phase 19 |
| VALID-01 | Phase 20 |
| VALID-02 | Phase 20 |
| VALID-03 | Phase 20 |
| VALID-04 | Phase 20 |

**Coverage**: 19/19 v1.2 requirements mapped.

## Progress

**Execution Order:**
Phases execute in numeric order: 16 -> 17 -> 18 -> 19 -> 20

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 16. Tutorial Template Baseline and Expansion Map | 0/2 | Planned | — |
| 17. React Tutorial Series | 0/0 | Pending | — |
| 18. Node.js Tutorial Series | 0/0 | Pending | — |
| 19. Practice Evidence and Screenshot Assets | 0/0 | Pending | — |
| 20. Expanded Tutorial Validation and Release Check | 0/0 | Pending | — |

---
*Roadmap created: 2026-06-29*
*Last updated: 2026-06-29 after v1.2 milestone initialization*
