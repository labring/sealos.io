# Roadmap: Sealos Skills Tutorial Alignment

## Overview

This roadmap updates the existing Sealos.io tutorial set so every Sealos Skills
installation and usage claim matches the latest upstream
`labring/sealos-skills` repository. The work starts at Phase 13 to keep future
phase directories unique in the current planning tree.

The milestone has three phases: source-of-truth install alignment, deploy-flow
content alignment, and cross-article validation.

## Phases

**Phase Numbering:**

- Integer phases (13, 14, 15): Planned milestone work.
- New phase directories start after the existing planning history.

- [x] **Phase 13: Upstream Install Contract Alignment** - Establish the latest (completed 2026-06-16)
  upstream source contract and update all tutorial installation and host usage
  copy.

- [x] **Phase 14: Deploy Workflow and Runtime Truth Alignment** - Update (completed 2026-06-16)
  tutorial deploy-flow sections for current `.sealos/`, DEPLOY/UPDATE, database,
  migration, and runtime verification behavior.

- [x] **Phase 15: Tutorial Metadata and Validation** - Align FAQ/HowTo metadata, (completed 2026-06-16)
  remove stale references, and run targeted tutorial validation.

## Phase Details

### Phase 13: Upstream Install Contract Alignment

**Goal**: Every tutorial gives current host-specific Sealos Skills installation
and invocation guidance.
**Depends on**: Milestone initialization
**Rationale**: Installation is the first user action in each tutorial, and the
latest upstream repository now leads with native Codex and Claude plugin
marketplace installation.
**Deliverables**:

  1. Source-truth notes that identify upstream commit
     `c171d444cc16a7d58b5d23f1a171989a0221c211` and the relevant README,
     marketplace, and deploy skill sections.

  2. Updated Codex install sections across all tutorial articles.
  3. Updated Claude Code install sections across all tutorial articles.
  4. Compatibility install copy positioned after native host install commands.
  5. Host usage copy that consistently maps Codex CLI, Codex App, Claude Code,
     and direct `skills.sh` entries.
**Requirements**: SOURCE-01, SOURCE-02, SOURCE-03, SOURCE-04, INSTALL-01,
INSTALL-02, INSTALL-03, INSTALL-04, INSTALL-05
**Success Criteria**:

  1. A reader can follow the Codex native install commands from any tutorial
     install section.

  2. A reader can follow the Claude Code native install commands from any
     tutorial install section.

  3. `npx plugins add` snippets are present as compatibility paths with
     host-specific targets.

  4. Direct `/sealos-deploy` examples appear only in direct `skills.sh`
     context.

  5. Targeted searches show the same host invocation model across all tutorial
     files.
**Likely Files**: `content/tutorials/deploy-nextjs-sealos/index.en.mdx`,
`content/tutorials/nextjs-postgresql-sealos/index.en.mdx`,
`content/tutorials/nextjs-production-deployment-sealos/index.en.mdx`
**Validation Approach**: Run targeted `rg` checks for install and invocation
phrases, then inspect each tutorial install section.
**Plans:** 5/5 plans complete

Plans:
**Wave 1**

- [x] 13-01-PLAN.md — Capture locked upstream install and host usage source truth.

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 13-02-PLAN.md — Update beginner tutorial install and host invocation body copy.
- [x] 13-03-PLAN.md — Update PostgreSQL tutorial install and host invocation body copy.
- [x] 13-04-PLAN.md — Update production checklist install and host invocation body copy.

**Wave 3** *(blocked on Wave 2 completion)*

- [x] 13-05-PLAN.md — Validate cross-article install contract and record evidence.

Cross-cutting constraints:

- Every tutorial body uses native Codex install commands before Codex compatibility copy.
- Every tutorial body uses native Claude Code install commands before Claude Code compatibility copy.
- Host usage maps Codex CLI to `$sealos`, Codex App to `+ -> Plugins -> Sealos`, and Claude Code to `/sealos`.
- Direct `/sealos-deploy`, `/sealos-database`, and `/sealos-s3` entries appear only in direct `skills.sh` context.
- Phase 14 owns deploy-flow expansion and Phase 15 owns FAQ/HowTo metadata harmonization.

### Phase 14: Deploy Workflow and Runtime Truth Alignment

**Goal**: Tutorial deploy-flow sections match the current Sealos deploy skill
pipeline and verification contract.
**Depends on**: Phase 13
**Rationale**: Upstream deploy behavior now includes state-aware DEPLOY/UPDATE
mode and Runtime Truth Pass checks that should shape beginner, PostgreSQL, and
production guidance.
**Deliverables**:

  1. Beginner tutorial pipeline copy updated for preflight, assessment, image
     detection, Dockerfile, build/push, template, configure, deploy, and Runtime
     Truth Pass.

  2. `.sealos/` artifact descriptions updated for `analysis.json`,
     `template/index.yaml`, `state.json`, optional `config.json`, and build
     output.

  3. PostgreSQL tutorial updated for app/database resource generation, exact env
     var wiring, migration planning, and full-stack verification.

  4. Production checklist updated for state-based updates, real App URL checks,
     logs, login/setup checks, authenticated smoke when relevant, and resource
     footprint.

  5. Troubleshooting copy updated for auth, Docker/GHCR, private image pull
     secrets, rollout verification, and state repair.
**Requirements**: DEPLOY-01, DEPLOY-02, DEPLOY-03, DEPLOY-04, DEPLOY-05,
DEPLOY-06
**Success Criteria**:

  1. A reader can distinguish first deploy and update behavior from the
     production checklist.

  2. A reader can inspect `.sealos/analysis.json`,
     `.sealos/template/index.yaml`, and `.sealos/state.json` with accurate
     expectations.

  3. PostgreSQL guidance keeps app, database, env vars, migration, and
     verification in one full-stack deployment plan.

  4. Runtime Truth Pass guidance includes real App URL, logs, login/setup, and
     resource footprint checks.

  5. Troubleshooting copy reflects current upstream deploy skill behavior.

**Likely Files**: `content/tutorials/deploy-nextjs-sealos/index.en.mdx`,
`content/tutorials/nextjs-postgresql-sealos/index.en.mdx`,
`content/tutorials/nextjs-production-deployment-sealos/index.en.mdx`
**Validation Approach**: Compare article body sections against upstream
`skills/sealos-deploy/SKILL.md`, `modules/preflight.md`, and
`modules/pipeline.md`; run targeted `rg` checks for `.sealos/`, Runtime Truth
Pass, DEPLOY/UPDATE, and state references.
**Plans:** 5/5 plans complete

Plans:
**Wave 1**

- [x] 14-01-PLAN.md — Capture locked deploy workflow source truth before tutorial edits.

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 14-02-PLAN.md — Update beginner tutorial deploy pipeline, `.sealos/`, Runtime Truth Pass, and troubleshooting body copy.
- [x] 14-03-PLAN.md — Update PostgreSQL tutorial full-stack resource, env-var, migration, and verification body copy.
- [x] 14-04-PLAN.md — Update production checklist DEPLOY/UPDATE, Runtime Truth Pass, rollback, and troubleshooting body copy.

**Wave 3** *(blocked on Wave 2 completion)*

- [x] 14-05-PLAN.md — Validate cross-article deploy workflow alignment and record Phase 15 handoff evidence.

Cross-cutting constraints:

- Phase 13 install and host invocation guidance stays intact while Phase 14 edits deploy-flow body copy.
- Runtime Truth Pass is taught as live runtime acceptance, with tutorial-specific checks for beginner, PostgreSQL, and production paths.
- `.sealos/` artifacts are described by lifecycle: optional config, regenerated analysis, conditional build result, generated template, and post-acceptance state.
- DEPLOY/UPDATE behavior depends on valid `.sealos/state.json` plus live deployment verification.
- Phase 15 owns FAQ/HowTo metadata harmonization, terminology-only cleanup, stale-reference reporting, and final repository tutorial validation.

### Phase 15: Tutorial Metadata and Validation

**Goal**: Visible tutorial bodies, structured metadata, and validation checks
all agree after the content update.
**Depends on**: Phase 14
**Rationale**: FAQ and HowTo frontmatter feed structured data and search
surfaces, so metadata must be updated with the same install and deploy-flow
language as the article body.
**Deliverables**:

  1. Updated FAQ answers for all tutorial files touched by the install and
     deploy-flow changes.

  2. Updated HowTo steps for host-specific commands and current deploy
     workflow.

  3. Consistent terminology across all tutorials for Sealos Skills, Sealos
     plugin, Codex plugin, Runtime Truth Pass, `.sealos/`, and update mode.

  4. Targeted stale-reference search report.
  5. Passing tutorial validation command.

**Requirements**: CONSIST-01, CONSIST-02, CONSIST-03, CONSIST-04, VERIFY-01,
VERIFY-02, VERIFY-03, VERIFY-04
**Success Criteria**:

  1. Frontmatter FAQ and HowTo content matches the updated article body.
  2. `scripts/validate-tutorials.mjs` passes.
  3. Targeted searches show intentional use of every install and invocation
     phrase.

  4. The final diff stays scoped to tutorial content, tutorial metadata, and
     planning artifacts.

  5. The next GSD action can move directly into execution for Phase 15.

**Likely Files**: `content/tutorials/**/*.mdx`,
`scripts/validate-tutorials.mjs`, `lib/utils/tutorial-metadata.ts`,
`lib/utils/tutorial-utils.ts`, `source.config.ts`, `lib/source.ts`
**Validation Approach**: Run `node scripts/validate-tutorials.mjs`, targeted
`rg` checks, and the narrowest available lint/content validation for touched
files.
**Plans:** 3/3 plans complete

Plans:
**Wave 1**

- [x] 15-01-PLAN.md — Align beginner tutorial FAQ and HowTo metadata with the updated body.
- [x] 15-02-PLAN.md — Align PostgreSQL and production tutorial FAQ and HowTo metadata with updated body guidance.

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 15-03-PLAN.md — Harden tutorial validation and record final Phase 15 evidence.

Cross-cutting constraints:

- FAQ and HowTo frontmatter must make the same install, deploy-flow, and acceptance claims as visible tutorial bodies.
- Sealos Skills, Sealos plugin, Codex plugin, Runtime Truth Pass, `.sealos/`, DEPLOY, and UPDATE terminology follows the Phase 15 context glossary.
- Direct `/sealos-deploy`, `/sealos-database`, and `/sealos-s3` examples remain absent from tutorial source while no direct `skills.sh` section exists.
- Source-only link validation covers `/tutorials/<slug>`, `/sealos-skills`, `https://os.sealos.io`, and `https://sealos.io/docs/...`.
- Final validation records targeted `rg`, `npm run validate-tutorials`, `npm run lint`, and changed-file scope evidence.

## Requirement Coverage

| Requirement | Phase |
|-------------|-------|
| SOURCE-01 | Phase 13 |
| SOURCE-02 | Phase 13 |
| SOURCE-03 | Phase 13 |
| SOURCE-04 | Phase 13 |
| INSTALL-01 | Phase 13 |
| INSTALL-02 | Phase 13 |
| INSTALL-03 | Phase 13 |
| INSTALL-04 | Phase 13 |
| INSTALL-05 | Phase 13 |
| DEPLOY-01 | Phase 14 |
| DEPLOY-02 | Phase 14 |
| DEPLOY-03 | Phase 14 |
| DEPLOY-04 | Phase 14 |
| DEPLOY-05 | Phase 14 |
| DEPLOY-06 | Phase 14 |
| CONSIST-01 | Phase 15 |
| CONSIST-02 | Phase 15 |
| CONSIST-03 | Phase 15 |
| CONSIST-04 | Phase 15 |
| VERIFY-01 | Phase 15 |
| VERIFY-02 | Phase 15 |
| VERIFY-03 | Phase 15 |
| VERIFY-04 | Phase 15 |

**Coverage**: 23/23 v1.1 requirements mapped.

## Progress

**Execution Order:**
Phases execute in numeric order: 13 -> 14 -> 15

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 13. Upstream Install Contract Alignment | 5/5 | Complete   | 2026-06-16 |
| 14. Deploy Workflow and Runtime Truth Alignment | 5/5 | Complete    | 2026-06-16 |
| 15. Tutorial Metadata and Validation | 3/3 | Complete   | 2026-06-16 |
