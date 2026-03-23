# Project Research Summary

**Project:** Sealos App Deploy Docs Restructure
**Domain:** Brownfield documentation IA redesign for English container app deployment docs
**Researched:** 2026-03-23
**Confidence:** HIGH

## Executive Summary

This project is not a docs-platform rewrite. It is a brownfield information-architecture redesign inside the existing Next.js 14 + Fumadocs + MDX stack for the English `App Deploy` section. The research is consistent: strong deployment documentation leads with one canonical first-success tutorial, then branches into focused task guides, troubleshooting, reference, and explanation. Sealos already has most of the topic coverage, but the current English section is organized as a flat feature list, contains stale links, and includes incomplete English pages, so users have to assemble the deployment journey themselves.

The recommended approach is to keep the current stack, redesign the section around a dual-layer model, and make first successful deployment the governing outcome. Build one end-to-end `first-deploy` tutorial, rewrite the landing page as a router instead of a brochure, then re-home existing pages into a post-success operations layer plus symptom-based troubleshooting. The main risks are shipping a nicer nav without fixing page purpose, link migration, and English-content readiness; mitigate that by locking the target taxonomy first, authoring the primary tutorial before refactoring satellites, and treating link/build/locale QA as a full rollout phase.

## Key Findings

### Recommended Stack

The stack recommendation is conservative and well supported by both the repo and official docs: keep the current Next.js static-export app, keep Fumadocs as the docs runtime, and solve this project at the content-model, navigation, and quality-gate layers. The repo already has the right primitives for file-based IA, locale-aware navigation, MDX content, and static search. A framework migration would add large execution risk without addressing the actual user problem.

The structural additions should be lightweight and local to the docs system: use a Diataxis-style split between tutorial, task, reference, and explanation; extend the existing Zod frontmatter schema in `source.config.ts`; keep `meta.en.json` as the explicit navigation control plane; and add docs-specific validation with Vale, `markdownlint-cli2`, and `lychee`. Because this is a brownfield English-only restructure, the safest rule is "change page purpose and ordering first, change URLs only where the journey truly benefits."

**Core technologies:**
- Next.js App Router static export (`next@14.2.x`) — keep the existing build/runtime model because this milestone is IA work, not platform work.
- Fumadocs (`fumadocs-mdx`, `fumadocs-core`, `fumadocs-ui`) — keep the existing page tree, sidebar, TOC, and search primitives that already match the problem.
- Git-tracked MDX in `content/docs/` — keep file-based content as the source of truth for reviewable docs changes.
- `meta.en.json` + extended Zod frontmatter — use explicit ordering and machine-readable page intent instead of implicit filesystem structure.
- Vale + `markdownlint-cli2` + `lychee` — add prose, structure, and link quality gates to make the restructure safe to ship.

### Expected Features

The feature research is clear: the English App Deploy docs need a dominant "start here" path, not another feature overview. The MVP is one first-deploy journey with prerequisites, a readiness checklist, exact steps, verification checkpoints, and short recovery branches for the most common failures. After that, the section should branch into task guides for the jobs users actually do after the app is running.

The differentiators worth keeping in scope are the ones that directly improve first-time success: embedded preflight checks, symptom-based troubleshooting, opinionated next steps, and a clean alternate path for Docker Compose migration. Scenario-heavy examples and broader explanatory depth are valuable, but they should wait until the new page roles and navigation model are stable.

**Must have (table stakes):**
- Clear primary "Start here" path — the landing page must route new users into the canonical deploy journey.
- Prerequisites and readiness checklist — image, port, env vars, storage, domain intent, and access assumptions must be explicit.
- End-to-end first-deploy walkthrough — one page that takes a user from zero to a reachable deployed app.
- Explicit success criteria and verification — define what "done" looks like and how to confirm it.
- First-deploy troubleshooting — cover image pull, wrong port, startup failure, and reachability issues close to the main path.
- Progressive disclosure and task-oriented follow-ups — move domain, config, storage, ports, scaling, and updates into focused post-success guides.

**Should have (competitive):**
- Embedded readiness checklist in the main guide — reduces avoidable failures before users click deploy.
- Verification-first IA — "deploy" and "confirm it works" should be part of the same flow.
- Symptom-based troubleshooting map — organize recovery by user-observed failure, not a generic FAQ.
- Opinionated next steps after success — point users to the next likely jobs immediately.
- Distinct Docker Compose migration entry point — prevent migrators from taking the wrong onboarding path.

**Defer (v2+):**
- Scenario-based examples beyond the canonical first-deploy walkthrough — high value, but only after the core journey is stable.
- Broader explanation coverage beyond the most necessary decision pages — useful later, not required for launch.
- Any wider i18n or platform rework — explicitly out of scope for this English-only docs restructure.

### Architecture Approach

The recommended architecture is a strict two-layer docs IA: one guided first-success path, then one operations layer for post-success tasks. That means the top level should route by intent, not by feature inventory. `index.en.mdx` should become a router page; `first-deploy.en.mdx` should own the happy path; operational jobs should live in `manage/*`; failures should move into `troubleshoot/*`; exact field behavior and decision support should live in `reference/*` and `concepts/*`.

**Major components:**
1. Landing/router page — route users into `first deploy`, `manage existing app`, or migration/support paths.
2. Canonical first-deploy tutorial — own the end-to-end happy path, prerequisites, verification, and first-failure branches.
3. Operations hub and task guides — own one post-success job per page, such as domain, env vars, config, storage, scaling, update, or migration.
4. Troubleshooting hub and symptom pages — recover broken states without re-teaching the full product.
5. Reference and concept pages — explain field behavior, limits, and decision criteria without polluting task flows.

### Critical Pitfalls

1. **Landing page stays a feature catalog** — avoid this by making one dominant CTA for first deployment and moving advanced topics into follow-up clusters.
2. **Pages mix tutorial, task, and reference roles** — avoid this by assigning one primary page type and one user job to every page before rewriting.
3. **Core journey is fragmented into thin pages** — avoid this by consolidating stubs and allowing deliberate duplication inside the primary tutorial.
4. **Prerequisites and verification remain implicit** — avoid this by standardizing `Before you begin`, expected outcome, and checkpoint sections in the tutorial and task guides.
5. **IA changes ship without migration QA** — avoid this by creating a slug/redirect table, cleaning up terminology, and running link/build/locale validation before merge.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Inventory, Terminology, and Target Taxonomy
**Rationale:** The section should not be rewritten until the English page inventory, target tree, naming rules, and slug strategy are fixed. This is the dependency anchor for every later phase.
**Delivers:** Current-page audit, thin/stub-page audit, terminology decisions, target IA tree, filename/slug mapping, `meta.en.json` redesign, and frontmatter schema additions such as `docType`, `journey`, `prerequisites`, `related`, and `lastReviewed`.
**Addresses:** Clear primary path, navigation grouped by user journey, page-role clarity.
**Avoids:** Mixed page types, vague titles, broken-link migration surprises, locale drift being discovered too late.

### Phase 2: Canonical First-Deploy Tutorial
**Rationale:** The whole restructure should optimize for first-time deployment success, so the canonical tutorial has to exist before the rest of the section is reorganized around it.
**Delivers:** A new `first-deploy.en.mdx` with prerequisites, readiness checklist, exact deploy sequence, verification checkpoints, compact "if this fails" branches, and opinionated next steps.
**Addresses:** Start-here path, end-to-end walkthrough, explicit success criteria, verification-first IA, first-deploy troubleshooting.
**Avoids:** Hidden prerequisites, ambiguous success state, over-fragmented onboarding, support-dependent first run.

### Phase 3: Router Page and Operations Layer Refactor
**Rationale:** Once the canonical path exists, the landing page and the rest of the section can be rebuilt around real user intent instead of feature parity.
**Delivers:** A rewritten `index.en.mdx` as a router page plus task-oriented `manage/*` pages or equivalent grouped content for:
- `add-a-domain` -> `domains-and-public-access`
- `environments` -> `environment-variables`
- `configmap` -> `config-files`
- `persistent-volume` -> `persistent-storage`
- `expose-multiple-ports` -> `ports-and-networking`
- `autoscaling` -> `scaling`
- `update-apps` -> `update-and-redeploy`
- `docker-compose-migration` -> `migrate-from-docker-compose`
**Uses:** Existing Next.js + Fumadocs + MDX stack, `meta.en.json`, frontmatter schema, and optional folder groups to limit unnecessary URL churn.
**Avoids:** Flat feature nav, equal visual weight for day-2 tasks, broken user flow between first success and follow-up jobs.

### Phase 4: Troubleshooting, Reference, and Decision Pages
**Rationale:** Failure handling and exact semantics should be extracted only after the happy path and task guides are stable, so support pages recover real flows instead of hypothetical ones.
**Delivers:** Symptom-based troubleshooting pages for unreachable apps, startup/port issues, domain/TLS failures, and config/storage mistakes; a deploy-form reference page; lean concept pages such as `env vars vs config files` and `when to use persistent storage`.
**Addresses:** Problem-to-fix troubleshooting, in-flow branching, decision support, cleaner separation of page roles.
**Avoids:** Happy-path overload, hidden troubleshooting, reference material leaking back into tutorials.

### Phase 5: Link Migration, QA, and Rollout
**Rationale:** In this project, QA is not polish. It is the release gate that makes a structural rewrite trustworthy.
**Delivers:** Internal-link validation, nav and breadcrumb QA, build verification, English locale review, screenshot freshness review, and redirect or alias handling for any changed public slugs.
**Addresses:** Consistent terminology and UI mapping, safe launch, discoverability, and migration hygiene.
**Avoids:** Broken links, stale filenames, untranslated metadata, static-export regressions, and launch-ready nav hiding incomplete content.

### Phase Ordering Rationale

- Taxonomy comes first because page naming, grouping, and URL strategy affect every rewrite that follows.
- The first-deploy tutorial comes before the landing page refactor because it defines the real primary path and exposes the right branch points.
- Operations pages come before troubleshooting/reference extraction because support content should attach to stable task flows, not draft IA.
- QA is its own final phase because link migration, nav behavior, and build safety can only be verified once the target tree is real.
- Keeping this English-only prevents the roadmap from bloating into an i18n migration disguised as an IA project.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 2:** Validate current App Deploy UI labels, required inputs, and verification surfaces against the product itself; the English docs are not reliable enough to be the sole source of truth.
- **Phase 4:** Validate which failure modes deserve first-class troubleshooting pages using actual Sealos behavior, support knowledge, or product-owner input.
- **Phase 5:** Confirm how redirects or alias pages should be handled in the current static hosting environment if public slugs change materially.

Phases with standard patterns (skip research-phase):
- **Phase 1:** IA inventory, taxonomy design, frontmatter extension, and `meta.en.json` restructuring are established brownfield docs patterns.
- **Phase 3:** Refactoring feature pages into task guides inside Fumadocs/MDX is straightforward once the target taxonomy is approved.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Official Next.js and Fumadocs guidance aligns directly with the current repo; no platform migration is needed. |
| Features | HIGH | Strong agreement across official deployment-doc patterns and the project goal of first successful deploy. |
| Architecture | HIGH | The tutorial + task + troubleshoot + reference split is a mature and well-documented model for deployment docs. |
| Pitfalls | HIGH | Risks are supported both by general docs guidance and by direct repo evidence such as flat nav, stale links, and incomplete English pages. |

**Overall confidence:** HIGH

### Gaps to Address

- Product-truth validation is still needed for the exact first-deploy flow, required fields, and verification surfaces in the current Sealos UI.
- Redirect strategy is hosting-dependent because Next.js static export alone is not the migration plan.
- Screenshot and asset freshness were not exhaustively audited; expect a dedicated English-asset cleanup pass in rollout.
- The roadmap still needs an explicit decision on where to preserve URLs with folder groups versus where to accept slug changes for a clearer IA.

## Sources

### Primary (HIGH confidence)
- Repo context: `.planning/PROJECT.md`, current English `content/docs/guides/app-deploy/` files, and `content/docs/guides/app-deploy/meta.en.json`
- Fumadocs official docs — MDX, page conventions, page tree, internationalization, static deploy, and Orama search guidance
- Next.js official docs — App Router static export and route generation guidance
- Diataxis official guidance — tutorial/how-to/reference/explanation separation
- GitLab documentation topic types — task/reference/tutorial page-discipline model
- Kubernetes page content types — tutorial/task/reference boundary guidance
- Microsoft and Google developer documentation style guidance — procedural writing and heading/procedure conventions
- Vale official docs — prose-lint integration guidance

### Secondary (MEDIUM confidence)
- Google Cloud Run, Fly.io, Render, Railway, and DigitalOcean App Platform docs — comparative deploy-path and IA pattern references
- `markdownlint-cli2` and `lychee` official project repositories — recommended as practical docs quality gates

---
*Research completed: 2026-03-23*
*Ready for roadmap: yes*
