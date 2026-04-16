# Sealos English Guide Restructure

## What This Is

This project incrementally restructures English Sealos guides so users can
complete core product workflows through clearer, task-oriented documentation
inside the existing Next.js + fumadocs docs site. The first milestone rebuilt
`App Deploy`, and the next milestone substantially rebuilt the English
`CronJob` surface through onboarding and lifecycle work. The current milestone
now shifts that same approach to `AI Proxy` so English users can understand the
product and complete a first successful model call without relying on the
Chinese docs.

## Core Value

A Sealos user can complete the primary workflow for a product area from 0 to 1
without getting lost in fragmented documentation.

## Current Milestone: v1.3 Object Storage English Start-Here Docs

**Goal:** Turn the nearly empty English `Object Storage` guide into a real
start-here page that helps an English user understand the product, create a
bucket, obtain credentials, and complete a first successful file upload.

**Target features:**
- A real English overview that explains what `Object Storage` is, why to use it,
  and what problem it solves inside Sealos
- One shortest-path quickstart that walks through creating a bucket, getting
  Access Key and Endpoint, and uploading a first file
- The minimum operational guidance needed for access permissions and first-failure
  checks without expanding into SDK integration, static hosting, or monitoring

## Requirements

### Validated

- ✓ English App Deploy docs now provide one canonical first-deploy path for a
  new user to go from zero to one successful container deployment — v1.0
- ✓ English App Deploy docs now provide focused follow-up task pages for the
  main day-2 jobs instead of relying on thin fragmented pages — v1.0
- ✓ English App Deploy docs now provide symptom-based troubleshooting and
  verified recovery links at failure-prone steps — v1.0
- ✓ English App Deploy rollout safety is now covered by route audits, build and
  lint validation, redirect mapping, and worktree-local UAT — v1.0
- ✓ The current docs platform supports task-oriented MDX guides, navigation via
  `meta.en.json`, and static-export publication through the existing Next.js +
  fumadocs stack — existing
- ✓ Phase 6 now locks the English CronJob terminology, flat page taxonomy, and
  product-truth writing guardrails from current Sealos UI evidence — v1.1
- ✓ Phase 7 now gives the English CronJob section one clear start-here path and
  one verified first-success tutorial for a fixed `visit a URL` example — v1.1
- ✓ Phase 8 now provides focused English lifecycle task pages for update,
  pause/resume, and delete, plus direct lifecycle discovery from the sidebar,
  router, and first-success guide — v1.1
- ✓ The English AI Proxy guide now explains what the product is and why to use
  it without falling back to the Chinese page — v1.2
- ✓ The English AI Proxy guide now lets a reader obtain the minimum
  credentials, make one first successful OpenAI-compatible request, and
  understand the minimum request fields — v1.2
- ✓ The AI Proxy English guide now defines first-success verification, compact
  first-failure checks, and passed publish-safety validation with route checks,
  `npm run build`, and `npm run lint` — v1.2

### Active

- [ ] English Object Storage docs provide a real product overview for English
  readers
- [ ] English Object Storage docs walk through creating a bucket, obtaining
  credentials, and uploading a first file
- [ ] English Object Storage docs include minimum access-permission guidance and
  first-failure checks

### Out of Scope

- Chinese Object Storage documentation rewrite — this milestone is English-only
- SDK integration examples (Go, Java, Node.js, Python) — deferred to a later
  milestone after the start-here page ships
- Static website hosting walkthrough — deferred to a later milestone
- Monitoring and resource metrics guidance — deferred to a later milestone
- A multi-page Object Storage library or deep reference — v1.3 is one canonical
  English entry point
- Broad redesign of unrelated guide sections — keep this milestone focused
- Remaining CronJob troubleshooting and rollout hardening — still deferred

## Context

- The codebase is a static-export Next.js 14 + fumadocs documentation site with
  content stored in `content/docs/`
- The current CronJob docs live in `content/docs/guides/cronjob/`
- The current AI Proxy docs live in `content/docs/guides/ai-proxy/`
- The current Object Storage docs live in `content/docs/guides/object-storage/`
- `content/docs/guides/object-storage/index.en.mdx` is nearly empty (374B,
  Chinese frontmatter only, no English body content)
- `content/docs/guides/object-storage/index.zh-cn.mdx` is the factual source
  (~10.6K) covering bucket CRUD, access keys, permissions, static hosting, SDK
  examples (Go/Java/Node.js/Python via MinIO), and monitoring
- `content/docs/guides/cronjob/index.en.mdx` now acts as an English router, and
  `content/docs/guides/cronjob/first-cronjob.en.mdx` now carries the canonical
  first-success tutorial
- `content/docs/guides/ai-proxy/index.en.mdx` is now a real English start-here
  page for the first AI Proxy call
- The previous milestones established a verified pattern for zero-to-one
  tutorial flow, product-truth auditing, safe example contracts, and
  publish-safety validation inside this worktree
- Worktree-local planning remains authoritative because automated GSD helpers
  still resolve the outer repository instead of this current worktree

## Current State

- Milestone v1.0 for App Deploy docs is complete and verified in the current
  worktree, including build, lint, redirect checks, and UAT
- Milestone v1.1 for CronJob docs has completed Phase 6 in the current
  worktree, including the audit baseline, taxonomy contract, product-truth
  brief, and phase verification
- Milestone v1.1 for CronJob docs has now completed Phase 7 in the current
  worktree, including the English router, the canonical `first-cronjob`
  tutorial, and worktree-local verification
- Milestone v1.1 for CronJob docs has now completed Phase 8 in the current
  worktree, including the focused English lifecycle task pages for update,
  pause/resume, and delete, plus direct lifecycle links from navigation and the
  first-success guide
- Milestone v1.1 for CronJob docs still has an unexecuted Phase 9 for
  troubleshooting and rollout hardening, but that work is currently deferred
  while this milestone starts on AI Proxy
- Milestone v1.2 for AI Proxy docs is complete and verified in the current
  worktree, including AI Proxy-specific shell checks, `npm run build`,
  `npm run lint`, and focused reader UAT
- Milestone v1.3 for Object Storage English start-here docs is now starting in
  the current worktree
- `content/docs/guides/meta.en.json` already exposes `object-storage` as a
  top-level guide entry, so the main gap is content rather than navigation
  registration

## Constraints

- **Scope**: English-only — Chinese CronJob docs are out of scope for this
  milestone
- **Interface**: Sealos console UI-first — the milestone should document the
  product workflow users actually follow in the UI
- **Validation**: No dedicated docs test framework — validation still relies on
  practical route checks plus successful repo build and lint runs
- **Product fit**: Must reflect real Sealos CronJob capabilities — the docs
  cannot invent unsupported task types or recovery paths
- **Example strategy**: The zero-to-one path should use one fixed URL-visit
  example so success is easy to observe and verify
- **Source of truth**: The Chinese AI Proxy docs can be used as factual input,
  but the English page should be newly written for English readers rather than
  lightly translated line by line

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Restructure English guides one product workflow at a time | Keeps each milestone focused while still reusing proven documentation patterns | Accepted — App Deploy shipped first, CronJob is next |
| Prioritize first successful completion before exhaustive reference | Users need a clear happy path before they need full option coverage | Accepted — zero-to-one and lifecycle tasks lead, reference depth stays secondary |
| Keep milestone scope English-only | Reduces translation overhead and keeps iteration focused on one published surface | Accepted — Chinese CronJob docs remain outside this milestone |
| Keep CronJob docs UI-first | The milestone is about the Sealos console workflow, not Kubernetes-native reference docs | Accepted — no YAML or API expansion unless a later milestone asks for it |
| Use a fixed "visit a URL" first-success example | It gives the fastest visible proof that a scheduled task actually ran | Accepted — the onboarding path will anchor on one easy-to-verify example |
| Treat the current worktree as the source of truth for planning | Automated GSD helpers still resolve the outer repo incorrectly in this environment | Accepted — planning artifacts are created and maintained directly in this worktree |
| Keep the English CronJob section root as a router page | The landing surface should route users to start-here, lifecycle, and troubleshooting paths instead of collapsing into one overloaded page | Accepted — `index.en.mdx` remains the router root |
| Keep `CronJob` as the primary English name | The milestone needs a stable product-facing label, with friendlier wording only as a bridge | Accepted — `scheduled task` stays supporting-only |
| Ship a coarse first-pass CronJob page set | The first English CronJob surface should stay small and high-signal rather than becoming a broad reference library | Accepted — router + first tutorial + focused lifecycle task pages + symptom-based troubleshooting pages |
| Keep the English CronJob public contract on flat slugs | The previous milestone showed that flat routes are easier to validate and migrate safely | Accepted — no nested `manage/...` or `troubleshoot/...` public URLs in v1.1 |
| Use Webhook.site plus a fixed `*/5 * * * *` schedule for the first-success tutorial | This gives visible target-side proof and avoids turning the first guide into a timezone or exact-timing lesson | Accepted — Phase 7 tutorial now uses that exact first-success pattern |
| Start AI Proxy as a minimum viable English start-here milestone | The current English AI Proxy page is nearly empty, so the first win is one usable English entry point instead of a full docs library | Accepted — v1.2 will start with one real English overview + quickstart page |
| Use the Chinese AI Proxy page as product-truth input, not as the target IA | The Chinese page contains the factual product explanation, but the English milestone still needs user-oriented English writing and scope control | Accepted — Chinese content is source material, not the final English structure |
| Keep AI Proxy as one canonical leaf page in v1.2 | The current milestone has one dominant user job, so a router or child-page nav would add clicks before first success | Accepted — `content/docs/guides/ai-proxy/index.en.mdx` remains the single English start-here destination in v1.2 |
| Keep v1.2 focused on one safe first-call path plus minimum visibility checks | The milestone should prove zero-to-one success before expanding into reference or operations depth | Accepted — overview, credentials, one request, minimum request shape, billing/log visibility, and first-failure checks are in scope; deeper docs are deferred |
| Validate live example values before publishing the English AI Proxy page | The biggest quality risk is copying stale endpoint, model, or auth patterns from older docs | Accepted — Phase 10 will lock the safe example contract before drafting |

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
2. Core Value check - still the right priority?
3. Audit Out of Scope - reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-16 after Object Storage v1.3 milestone start*
