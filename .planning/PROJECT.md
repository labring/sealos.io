# Sealos.io Tutorial Content Accuracy

## What This Is

This project maintains English Sealos.io tutorials for developers who use AI
agents to deploy framework applications to Sealos Cloud. The public catalog
contains complete Next.js, React, Node.js, FastAPI, and Django tutorial series.

Milestone v1.3 added the FastAPI and Django series with public reference
applications, test-driven implementation, real Sealos practice evidence,
verified screenshot assets, and production publication checks.

## Core Value

Readers can reproduce framework-specific Sealos deployments from source,
commands, screenshots, and runtime evidence that match the current product.

## Current Milestone: v1.3 FastAPI and Django Tutorial Expansion

**Status:** Complete on 2026-07-17.

**Goal:** Publish complete FastAPI and Django tutorial series backed by tested
reference applications and real Sealos deployment evidence.

**Target features:**
- Two durable public reference repositories with three reproducible source
  stages per framework.
- Three English tutorial pages for FastAPI and three for Django: deploy,
  PostgreSQL, and production.
- Twenty-four 1440x900 practice-backed WebP screenshots below 200 KB each.
- Tutorial matrix, navigation, metadata, and validation coverage for 15 pages.
- Vertical red-green delivery across the four confirmed public test seams.

## Requirements

### Validated

- ✓ Static localized Next.js App Router site and Fumadocs tutorial collection.
- ✓ Three English Next.js tutorial pages with Sealos Skills workflow guidance.
- ✓ Three React and three Node.js tutorial pages shipped in commit `89215c8`.
- ✓ Nine-page tutorial source validation passes on 2026-07-15.
- ✓ Framework matrix already reserves FastAPI and Django slug patterns.
- ✓ FastAPI Stage 1 is public at
  `yangchuansheng/sealos-fastapi-tutorial`; 12 HTTP cases pass from nine named
  behavior functions and protected `stage-1-deploy` resolves to accepted commit
  `276aa00` — validated in Phase 21.
- ✓ FastAPI Stage 2 is public at protected `stage-2-postgresql`; 24 public
  behavior cases, fresh and repeat Alembic migration, two migration Jobs, three
  clone replays, and zero-footprint cleanup pass at accepted commit `2b256b3`
  — validated in Phase 22.
- ✓ FastAPI Stage 3 is public at protected `stage-3-production`; two immutable
  GHCR digests, a migration-first four-state rollout, rollback, recovery,
  public replay, and zero-footprint cleanup pass at accepted commit `1dbbf19`
  — validated in Phase 23.
- ✓ Django Stages 1-3 are public, protected, test-driven, migration-first, and
  production-verified with immutable images and rehearsed rollback — validated
  in Phases 24-26.
- ✓ Six English FastAPI/Django tutorials and 24 reviewed 1440x900 WebPs are
  joined to protected source and real practice evidence — validated in Phase
  27.
- ✓ The 15-page catalog, five available framework paths, production static
  HTTP surface, responsive layout, and zero practice footprint pass the public
  validator and checksum-sealed publication gate — validated in Phase 28.

### Validated In v1.3

- [x] Publish tested FastAPI and Django Reference Applications under the
  `yangchuansheng` GitHub account.
- [x] Preserve stage-specific source through deploy, PostgreSQL, and production
  tags while `main` represents the complete production stage.
- [x] Prove the FastAPI and Django HTTP seams with behavior-first tests.
- [x] Prove migration and runtime behavior against fresh PostgreSQL databases.
- [x] Capture redacted Practice Evidence from real Sealos deployments.
- [x] Publish six English tutorial pages and 24 verified screenshot assets.
- [x] Promote FastAPI and Django to available tutorial paths and validate the
  complete 15-page catalog.
- [x] Remove all live practice resources after acceptance evidence is complete.

### Out of Scope

- Additional framework series beyond FastAPI and Django — scheduled after this
  milestone proves the expansion workflow.
- Tutorial localization — English remains the current publication contract.
- Tutorial page visual redesign — this milestone extends the established page
  and screenshot systems.
- Sealos Skills feature changes — tutorials consume current upstream behavior.
- Persistent live demo deployments — public source and evidence provide the
  durable reproduction path.

## Context

The source tree contains 15 English tutorial pages across Next.js, React,
Node.js, FastAPI, and Django. React, Node.js, FastAPI, and Django use a
four-image per-page density, and the repository validator accepts the exact 15
slugs.

The FastAPI path uses a `Tasks API` Reference Application. The Django path uses
a `Task Board` Reference Application. Each evolves through deploy, PostgreSQL,
and production stages while retaining one coherent codebase per framework.

The decision source is
`.planning/quick/260715-e9k-define-fastapi-and-django-tutorial-expan/260715-e9k-CONTEXT.md`.
The project glossary is `CONTEXT.md`.

## Constraints

- **TDD**: Test only the four confirmed public seams and execute one failing
  behavior test followed by the minimum passing implementation.
- **Template parity**: Preserve the existing tutorial information architecture,
  Sealos Skills workflow, metadata depth, CTA rules, and series navigation.
- **Practice evidence**: Produce screenshots from actual local and Sealos
  results with sensitive values redacted.
- **Asset quality**: Export 1440x900 WebP images below 200 KB and verify every
  MDX reference.
- **Runtime**: Use Python 3.12, `uv`, exported exact requirements, PostgreSQL,
  and one-shot migration Jobs.
- **Language**: Planning docs, source, comments, commits, PR text, and tutorial
  content are English.
- **Cleanup**: Remove the complete Sealos practice footprint after acceptance.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use three pages per framework | Matches the established deploy, PostgreSQL, and production reader journey. | FastAPI and Django each publish one complete three-page series. |
| Use one Reference Application per framework | Keeps code, screenshots, and troubleshooting continuous across each series. | Continuous Tasks API and Task Board sources span all three stages. |
| Publish two public GitHub repositories | Makes tutorial commands and stage snapshots reproducible. | Both repositories and all six protected stages are public. |
| Require 24 practice-backed screenshots | Preserves the current four-image framework tutorial density. | All 24 reviewed WebPs are published and validator-bound. |
| Run migrations as one-shot Jobs | Keeps schema changes single-owner before rollout acceptance and scaling. | Alembic `0001` and `tasks.0001_initial` complete before readiness. |
| Gate five-minute titles on measured evidence | Keeps duration claims tied to actual workflow timing. | Accepted timings are 21.106 seconds for FastAPI and 26.099 seconds for Django. |
| Test four public seams with vertical red-green slices | Keeps tests behavior-focused and durable through implementation changes. | All reference-app and catalog CLI seams retain adjacent RED/GREEN history. |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition**:
1. Move verified requirements to Validated with evidence.
2. Record scope changes and new decisions.
3. Update the current implementation focus.

**After each milestone**:
1. Review the core value and current product truth.
2. Audit deferred scope and durable evidence.
3. Record the final milestone outcome.

---
*Last updated: 2026-07-17 after Phase 28 verification*
