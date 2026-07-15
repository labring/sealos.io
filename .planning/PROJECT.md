# Sealos.io Tutorial Content Accuracy

## What This Is

This project maintains English Sealos.io tutorials for developers who use AI
agents to deploy framework applications to Sealos Cloud. The public catalog
currently contains complete Next.js, React, and Node.js tutorial series.

The current milestone adds FastAPI and Django series with public reference
applications, test-driven implementation, real Sealos practice evidence, and
verified screenshot assets.

## Core Value

Readers can reproduce framework-specific Sealos deployments from source,
commands, screenshots, and runtime evidence that match the current product.

## Current Milestone: v1.3 FastAPI and Django Tutorial Expansion

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

### Active

- [ ] Publish tested FastAPI and Django Reference Applications under the
  `yangchuansheng` GitHub account.
- [ ] Preserve stage-specific source through deploy, PostgreSQL, and production
  tags while `main` represents the complete production stage.
- [ ] Prove the FastAPI and Django HTTP seams with behavior-first tests.
- [ ] Prove migration and runtime behavior against fresh PostgreSQL databases.
- [ ] Capture redacted Practice Evidence from real Sealos deployments.
- [ ] Publish six English tutorial pages and 24 verified screenshot assets.
- [ ] Promote FastAPI and Django to available tutorial paths and validate the
  complete 15-page catalog.
- [ ] Remove all live practice resources after acceptance evidence is complete.

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

The source tree already contains nine English tutorial pages across Next.js,
React, and Node.js. The current React and Node.js pages establish a four-image
per-page density and the repository validator currently accepts nine slugs.

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
| Use three pages per framework | Matches the established deploy, PostgreSQL, and production reader journey. | — Pending |
| Use one Reference Application per framework | Keeps code, screenshots, and troubleshooting continuous across each series. | — Pending |
| Publish two public GitHub repositories | Makes tutorial commands and stage snapshots reproducible. | FastAPI Stages 1-3 published; Django pending. |
| Require 24 practice-backed screenshots | Preserves the current four-image framework tutorial density. | — Pending |
| Run migrations as one-shot Jobs | Keeps schema changes single-owner before rollout acceptance and scaling. | FastAPI Stage 2 completed two Jobs at Alembic revision `0001`. |
| Gate five-minute titles on measured evidence | Keeps duration claims tied to actual workflow timing. | — Pending |
| Test four public seams with vertical red-green slices | Keeps tests behavior-focused and durable through implementation changes. | FastAPI stages retain 24 direct RED/GREEN slices plus public behavior, static, migration, and runtime gates. |

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
*Last updated: 2026-07-15 after Phase 22 verification*
