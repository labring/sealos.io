# Sealos App Deploy Docs Restructure

## What This Is

This project restructures the English `App Deploy` documentation in the Sealos docs site so a first-time user can go from zero to successfully deploying a container application. It is a brownfield documentation redesign inside the existing Next.js + fumadocs codebase, with permission to significantly change information architecture, directory structure, and URLs where that improves the deployment journey.

The goal is not to make every page longer. The goal is to redesign the docs so the primary path is clearer, the core deployment workflow is easier to complete, and advanced operational topics remain easy to find after the first successful deployment.

## Core Value

A new Sealos user can successfully deploy a container application from 0 to 1 without getting lost in fragmented documentation.

## Requirements

### Validated

- ✓ Existing docs site can publish structured English App Deploy documentation under `content/docs/guides/app-deploy/` — existing
- ✓ Existing App Deploy docs already cover key operational topics including create app, domains, environment variables, ConfigMap, autoscaling, persistent volume, multiple ports, updates, and certificates — existing
- ✓ Existing docs platform supports MDX content, hierarchy via `meta.en.json`, and static-export publication through the current Next.js + fumadocs stack — existing

### Active

- [ ] Redesign the English App Deploy information architecture around a clear primary deployment path for first-time users
- [ ] Create or reshape a main end-to-end deployment guide that gets a user from 0 to a successful container app deployment on Sealos
- [ ] Reorganize supporting docs so advanced topics like autoscaling, updates, and storage become follow-up operational references instead of the primary reading order
- [ ] Consolidate thin or fragmented pages where needed so each document has a clear job in the user journey
- [ ] Update navigation, taxonomy, and page relationships so the English App Deploy section is understandable without prior Sealos product knowledge

### Out of Scope

- Chinese App Deploy documentation rewrite — explicitly deferred because this effort is English-only
- Broad redesign of unrelated docs sections outside App Deploy — this work should stay focused on the deployment documentation journey
- Rebuilding the Sealos docs platform or changing the site’s core framework — the goal is documentation restructuring, not platform migration

## Context

- The codebase is a static-export Next.js 14 + fumadocs documentation site with content stored in `content/docs/`
- The current App Deploy docs live in `content/docs/guides/app-deploy/` and are organized as multiple topic pages referenced by `meta.en.json`
- Existing concerns include no automated test suite, static export constraints, and a large content surface area; docs changes are mainly validated by type-checking and successful builds
- Current App Deploy material appears topic-complete but likely under-optimized for first-time success: pages are thin, responsibilities are fragmented, and there is no clearly dominant “start here and deploy successfully” path
- The user is comfortable with major IA and URL changes for this section, which enables a true structural redesign instead of minor copy editing

## Constraints

- **Scope**: English-only — Chinese docs are out of scope for this restructure
- **Platform**: Existing Next.js + fumadocs content system — the restructure must fit current MDX, meta, and static-export constraints
- **Validation**: No dedicated doc test framework — changes must remain build-safe within the current validation model
- **Product fit**: Must reflect real Sealos App Deploy capabilities — restructuring cannot invent workflows that the product does not support
- **User outcome**: New-user deploy success takes priority over preserving current page boundaries

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Prioritize a dual-layer docs structure | Sealos needs both a first-success path and durable operational reference pages | — Pending |
| Optimize for first-time deployment success | The core user task is successful initial container app deployment | — Pending |
| English-only restructure | Reduces scope and lets the redesign focus on one content system first | — Pending |
| Allow major IA and URL changes | Existing structure should not constrain a better deployment journey | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `$gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `$gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-23 after initialization*
