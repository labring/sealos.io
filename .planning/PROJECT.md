# Sealos.io Tutorial Content Accuracy

## What This Is

This project maintains Sealos.io tutorial content for developers who use AI
agents to deploy applications to Sealos Cloud. The current milestone aligns all
`content/tutorials/**` Sealos Skills installation, invocation, and deployment
guidance with the latest `labring/sealos-skills` repository.

The immediate deliverable is an accurate, internally consistent tutorial set
that reflects the plugin-first Sealos Skills distribution model for Codex,
Claude Code, and compatible hosts.

## Core Value

Readers can install and use Sealos Skills from the tutorials with commands and
workflow expectations that match the current upstream plugin source.

## Current Milestone: v1.1 Sealos Skills Tutorial Alignment

**Goal:** Update every tutorial section that describes Sealos Skills
installation, invocation, deployment artifacts, update behavior, and runtime
verification so it matches upstream commit
`c171d444cc16a7d58b5d23f1a171989a0221c211`.

**Target features:**
- Native Codex plugin install guidance using `codex plugin marketplace add
  labring/sealos-skills` and `codex plugin add sealos@sealos`.
- Native Claude Code plugin install guidance using `claude plugin marketplace
  add labring/sealos-skills` and `claude plugin install sealos@sealos`.
- Compatibility install paths using `npx plugins add
  https://github.com/labring/sealos-skills --target codex|claude-code` as a
  secondary path.
- Consistent invocation guidance: `$sealos` for Codex CLI, Codex App
  `+ -> Plugins -> Sealos`, `/sealos` for Claude Code, and direct
  `/sealos-deploy` entries only for `skills.sh` sections.
- Current deploy-flow guidance covering `.sealos/` artifacts, DEPLOY/UPDATE
  mode, preflight/auth checks, Phase 6.5 Runtime Truth Pass, App URL/log/login
  verification, and resource footprint checks.

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

### Active

- [ ] Record the latest upstream `labring/sealos-skills` install and usage
  contract as the source of truth for tutorial edits.
- [ ] Update every Codex installation block in tutorials to prefer the native
  Codex plugin marketplace flow.
- [ ] Update every Claude Code installation block in tutorials to prefer the
  native Claude plugin marketplace flow.
- [ ] Keep `npx plugins add ... --target codex|claude-code` as a compatibility
  path with clear placement.
- [ ] Align tutorial invocation examples with `$sealos`, Codex App plugin
  picker, `/sealos`, and direct `skills.sh` entries by host type.
- [ ] Align deployment-flow descriptions with the current `sealos-deploy`
  pipeline, including `.sealos/analysis.json`, `.sealos/template/index.yaml`,
  `.sealos/state.json`, DEPLOY/UPDATE mode, and Phase 6.5 Runtime Truth Pass.
- [ ] Align PostgreSQL/full-stack tutorial copy with current database-resource,
  env-var, migration, and verification expectations.
- [ ] Align production-checklist copy with current update-state, runtime truth,
  rollback, log, App URL, and resource-footprint expectations.
- [ ] Update frontmatter FAQ and HowTo answers so structured metadata matches
  the article body.
- [ ] Validate tutorial consistency with targeted searches and the repository's
  tutorial validation script.

### Out of Scope

- New tutorial-topic expansion — this milestone updates the existing tutorial
  set.
- Sealos Skills repository behavior changes — upstream is the source for this
  content milestone.
- Live Sealos deployment proof for each tutorial — this milestone updates
  documentation accuracy from upstream source evidence.
- Visual redesign of tutorial pages — article accuracy and metadata consistency
  are the priority.
- Non-English tutorial localization — current tutorial files are English-only.

## Context

The active worktree already contains tutorial-related source additions and
modifications, including `content/tutorials/**`, tutorial routes under
`app/[lang]/(home)/tutorials/**`, tutorial metadata utilities, and validation
scripts. This milestone should scope planning and follow-up execution around
those files while leaving unrelated user changes intact.

Upstream `labring/sealos-skills` was checked at
`c171d444cc16a7d58b5d23f1a171989a0221c211`. Its README now presents a
plugin-first install model:

- Codex: `codex plugin marketplace add labring/sealos-skills` then
  `codex plugin add sealos@sealos`.
- Claude Code: `claude plugin marketplace add labring/sealos-skills` then
  `claude plugin install sealos@sealos`.
- Compatibility: `npx plugins add https://github.com/labring/sealos-skills
  --target codex|claude-code`.
- Direct `skills.sh`: `npx skills add labring/sealos-skills`, then direct
  `/sealos-deploy`, `/sealos-database`, and `/sealos-s3` entries.

The current tutorials still use `npx plugins add ...` as the recommended
install path in multiple sections. They also describe deploy behavior that
should be expanded to match current upstream behavior around Runtime Truth Pass,
logs, App URL verification, login/setup checks, resource footprints, and
state-based updates.

## Constraints

- **Source truth**: Tutorial claims about Sealos Skills must trace to the latest
  upstream repository, not older plugin memory.
- **Host accuracy**: Codex, Codex App, Claude Code, compatibility installers,
  context-only hosts, and direct `skills.sh` entries need separate language.
- **Scope**: Update existing tutorials and tutorial metadata only; keep broader
  site behavior changes in their own work.
- **SEO consistency**: Frontmatter FAQ and HowTo metadata must match the visible
  body copy.
- **Verification**: Use targeted `rg` checks plus tutorial validation before
  the milestone moves into execution completion.
- **Language**: Planning docs, code, code comments, commits, and PR text are
  written in English.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use upstream commit `c171d444cc16a7d58b5d23f1a171989a0221c211` as the tutorial source of truth | The user asked to optimize tutorials based on the latest `labring/sealos-skills`. | — Pending |
| Prefer native plugin marketplace install copy for Codex and Claude Code | Upstream README now leads with host-native plugin installation. | — Pending |
| Keep `npx plugins add` as a compatibility path | Upstream still documents it for local testing and cross-host installs. | — Pending |
| Treat Runtime Truth Pass as part of deployment guidance | Upstream deploy skill now verifies real App URL, logs, login/setup flow, and resource footprint before usability claims. | — Pending |
| Start this roadmap at Phase 13 | Existing `.planning/phases` directories already include 10 and 12, so Phase 13 keeps future phase paths unique. | — Pending |

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
*Last updated: 2026-06-16 after v1.1 milestone initialization*
