# Phase 27: Practice-Backed Tutorial Series - Research

**Researched:** 2026-07-16
**Domain:** Practice-backed FastAPI and Django tutorials, Sealos deployment evidence, deterministic screenshot production
**Confidence:** HIGH for repository and retained-evidence findings; MEDIUM for current public documentation until live execution reconfirms runtime behavior

<user_constraints>

## Implementation Decisions

### Six-Page Series Contract

- **D-01:** Create exactly these English sources and public route slugs:

  | Framework | Stage | Source path | Slug |
  |---|---|---|---|
  | FastAPI | Deploy | `content/tutorials/deploy-fastapi-sealos/index.en.mdx` | `deploy-fastapi-sealos` |
  | FastAPI | PostgreSQL | `content/tutorials/fastapi-postgresql-sealos/index.en.mdx` | `fastapi-postgresql-sealos` |
  | FastAPI | Production | `content/tutorials/fastapi-production-deployment-sealos/index.en.mdx` | `fastapi-production-deployment-sealos` |
  | Django | Deploy | `content/tutorials/deploy-django-sealos/index.en.mdx` | `deploy-django-sealos` |
  | Django | PostgreSQL | `content/tutorials/django-postgresql-sealos/index.en.mdx` | `django-postgresql-sealos` |
  | Django | Production | `content/tutorials/django-production-deployment-sealos/index.en.mdx` | `django-production-deployment-sealos` |

- **D-02:** Use `sealos-skills-fastapi` and `sealos-skills-django` as the
  series identifiers. Deploy uses `stage: beginner`, `seriesOrder: 1`;
  PostgreSQL uses `stage: advanced`, `seriesOrder: 2`; production uses
  `stage: production`, `seriesOrder: 3`.
- **D-03:** Link each page to its matching protected public source tag:

  | Page stage | FastAPI source | Django source |
  |---|---|---|
  | Deploy | `yangchuansheng/sealos-fastapi-tutorial@stage-1-deploy` | `yangchuansheng/sealos-django-tutorial@stage-1-deploy` |
  | PostgreSQL | `yangchuansheng/sealos-fastapi-tutorial@stage-2-postgresql` | `yangchuansheng/sealos-django-tutorial@stage-2-postgresql` |
  | Production | `yangchuansheng/sealos-fastapi-tutorial@stage-3-production` | `yangchuansheng/sealos-django-tutorial@stage-3-production` |

  The link must use the protected tag URL. Commit and tag-object identities may
  appear in an evidence note, while reader commands clone the tag by name.
- **D-04:** Preserve the complete frontmatter schema already consumed by
  Fumadocs: title, description, date, updated, stage, framework, series,
  seriesOrder, estimatedReadingTime, primaryKeyword, targetKeywords, tags,
  authors, relatedTutorials, cta, faq, and howTo. Use framework labels
  `FastAPI` and `Django` and framework tags `fastapi` and `django`.
- **D-05:** Keep related links inside each three-page framework series in
  stage order. Deploy pages use `Start free on Sealos` with
  `https://os.sealos.io`; PostgreSQL and production pages use
  `Open Sealos Skills` with `/sealos-skills`.

### Reader Journey and Source Authority

- **D-06:** Follow the existing Next.js stage-specific information
  architecture:
  - Deploy: prerequisites, plugin setup, source readiness, deploy request,
    assessment and template review, image/configuration, deployment, Runtime
    Truth Pass, generated `.sealos/` artifacts, troubleshooting, and next step.
  - PostgreSQL: key takeaways, prerequisites, architecture, database-ready
    source, full-stack deploy request, resource plan, production inputs,
    migration Job, schema-aware readiness, public read/write verification,
    restart persistence, troubleshooting, and next step.
  - Production: audience, plugin setup, launch model, readiness scorecard,
    immutable image, state and environment, migration-first rollout, runtime
    security, domain and HTTPS, logs, static assets where applicable,
    monitoring, backup, update, rollback, recovery, runbook, failures, and final
    checklist.
- **D-07:** Every framework statement, version, command, response, source tree,
  migration, image digest, runtime identity, and rollback claim must come from
  the matching protected-tag README/source or retained verified evidence.
  Prose must describe observed behavior at the named stage.
- **D-08:** Reader commands are copied or minimally parameterized from the
  protected-tag README and tracked source. Placeholders use clear public forms
  such as `<your-sealos-url>` and never carry a retained credential, namespace,
  cookie, Secret value, or private endpoint.
- **D-09:** Preserve current Sealos plugin language and entry surfaces:
  native Codex and Claude Code installation, Codex `$sealos`, Claude Code
  `/sealos`, Codex App plugin selection, Runtime Truth Pass, DEPLOY, UPDATE,
  `.sealos/analysis.json`, `.sealos/template/index.yaml`, and
  `.sealos/state.json`. Direct legacy skill commands remain outside tutorial
  prose.
- **D-10:** Keep the two Reference Applications continuous across each series.
  FastAPI uses the Tasks API with `/health`, generated `/docs`, and `/tasks`
  CRUD. Django uses the server-rendered Task Board, `/health`, `/tasks/`, and
  native `/admin/login/` plus authenticated Task readback.

### Exact 24-Screenshot Matrix

- **D-11:** Each page references exactly four unique WebP assets from its own
  `public/images/<tutorial-slug>/` directory. The complete matrix is:

  | Page | Asset filename | Adjacent reader task | Required evidence |
  |---|---|---|---|
  | `deploy-fastapi-sealos` | `local-stage-validation.webp` | Clone Stage 1, locked sync, tests, and local port 8000 start | Public tag identity plus real local test/start result |
  | `deploy-fastapi-sealos` | `sealos-analysis-template.webp` | Ask Sealos to assess and prepare the deploy | Real `.sealos/analysis.json` and generated template summary from the run-owned clone |
  | `deploy-fastapi-sealos` | `sealos-deployment-health.webp` | Accept deployment after Runtime Truth Pass | Real Sealos resources, rollout completion, public domain, and `/health` 200 |
  | `deploy-fastapi-sealos` | `swagger-tasks-api.webp` | Open and exercise the live application | Real browser Swagger UI plus public task create/list proof |
  | `fastapi-postgresql-sealos` | `database-ready-source.webp` | Clone Stage 2 and inspect database inputs | Protected tag, SQLAlchemy/Alembic source, exact env key, and migration revision |
  | `fastapi-postgresql-sealos` | `sealos-postgresql-plan.webp` | Review app, PostgreSQL, Secret, Service, Ingress, and Job plan | Real generated run-owned resource plan with values redacted |
  | `fastapi-postgresql-sealos` | `alembic-migration-complete.webp` | Run migration before readiness | Real Job `Complete=True`, Alembic `0001`, repeat/current result |
  | `fastapi-postgresql-sealos` | `persistent-crud-readback.webp` | Create, restart, and read a task | Real `/health` 200 and cross-process public CRUD persistence |
  | `fastapi-production-deployment-sealos` | `production-state-redacted.webp` | Resolve the protected source, immutable image, and deployment state | Real Stage 3 source, digest, redacted env/state, and same-image Job relation |
  | `fastapi-production-deployment-sealos` | `immutable-rollout-health.webp` | Migrate and roll out two replicas | Real migration completion, 2/2 Ready, digest, UID/GID, and `/health` 200 |
  | `fastapi-production-deployment-sealos` | `domain-runtime-logs.webp` | Verify public HTTPS and release logs | Real Sealos domain, HTTPS response, `/docs`, and credential-free release log |
  | `fastapi-production-deployment-sealos` | `rollback-recovery.webp` | Roll back and explicitly recover | Real A-B-A-B controller revisions with Task continuity |
  | `deploy-django-sealos` | `local-stage-validation.webp` | Clone Stage 1, migrate SQLite, test, and start port 8000 | Public tag identity plus real local tests, migration, and start result |
  | `deploy-django-sealos` | `sealos-analysis-template.webp` | Ask Sealos to assess and prepare the deploy | Real `.sealos/analysis.json` and generated template summary from the run-owned clone |
  | `deploy-django-sealos` | `sealos-deployment-health.webp` | Accept deployment after Runtime Truth Pass | Real Sealos resources, host-rewrite edge contract, public domain, and `/health` 200 |
  | `deploy-django-sealos` | `task-board-admin.webp` | Use the live application surface | Real Task Board create/list browser state and native admin login surface |
  | `django-postgresql-sealos` | `database-ready-source.webp` | Clone Stage 2 and inspect database inputs | Protected tag, psycopg settings, migration `0001_initial`, and exact env key |
  | `django-postgresql-sealos` | `sealos-postgresql-plan.webp` | Review app, PostgreSQL, Secret, Service, Ingress, and Job plan | Real generated run-owned resource plan with values redacted |
  | `django-postgresql-sealos` | `django-migration-complete.webp` | Run migration before readiness | Real Job `Complete=True`, `tasks.0001_initial`, repeat/current result |
  | `django-postgresql-sealos` | `persistent-board-admin.webp` | Create, restart, and read a Task | Real board persistence plus authenticated native admin readback |
  | `django-production-deployment-sealos` | `production-state-redacted.webp` | Resolve the protected source, immutable image, and deployment state | Real Stage 3 source, digest, redacted env/state, and same-image Job relation |
  | `django-production-deployment-sealos` | `immutable-rollout-health.webp` | Migrate and roll out two replicas | Real migration completion, 2/2 Ready, Gunicorn identity, and `/health` 200 |
  | `django-production-deployment-sealos` | `domain-static-logs.webp` | Verify public HTTPS, static assets, and logs | Real Sealos domain, Task Board, hashed WhiteNoise CSS, and release log |
  | `django-production-deployment-sealos` | `rollback-recovery.webp` | Roll back and explicitly recover | Real A-B-A-B controller revisions with board and admin Task continuity |

- **D-12:** Match the established dark evidence-card form visible in the
  Next.js PostgreSQL/production and current React/Node.js assets: 1440x900
  canvas, dark navy/black surface, restrained teal or framework accent,
  thin-border browser/terminal chrome, small evidence eyebrow, concise white
  heading, and a large readable source panel. Browser captures retain the real
  product or application surface inside the frame. Terminal cards retain real
  commands and curated real output.
- **D-13:** Screenshot cards are presentation layers over traceable evidence.
  Product UI, browser state, terminal output, resource names, statuses, and
  HTTP results must originate in the recorded run. Layout may combine two
  related real observations in one card; content may be shortened with a
  visible omission marker while preserving semantic truth.
- **D-14:** Use deterministic redaction before rendering. Replace sensitive
  values with explicit labels such as `[REDACTED]` or documented placeholders.
  Preserve safe public GitHub URLs, protected tag names, public image digests,
  HTTP statuses, framework routes, migration revisions, and public Sealos
  domains required by the tutorial step.
- **D-15:** Every image uses descriptive alt text as its visible caption through
  the existing MDX image component. Alt text names the observed result and
  avoids generic labels such as `screenshot`, `image`, or `terminal` alone.
- **D-16:** Hard asset acceptance is `WEBP`, exactly `1440x900`, strictly below
  `200000` bytes, one reference per file, four references per page, and 24
  references total. Target 150 KB or less where readability survives so the
  assets remain compatible with the current repository budget style.
- **D-17:** Validate each image through metadata inspection, file signature,
  local reference resolution, nonblank canvas pixels, visual review at desktop
  and mobile page widths, readable text, redaction scan, source-evidence
  comparison, and a SHA-256 ledger entry. Compression must preserve the exact
  1440x900 canvas and critical text.

### Fresh Practice, Timing, and Evidence

- **D-18:** Run fresh reader workflows for both frameworks in a clean
  authenticated Sealos workspace. Every resource receives one exact run ID or
  equally strict ownership identity. Practice covers source clone, locked
  install, local validation, Sealos analysis/template generation, deployment,
  generated public HTTPS domain, health, live application behavior,
  PostgreSQL migration, schema-aware readiness, restart persistence,
  administration where applicable, immutable production rollout, logs,
  rollback, and recovery.
- **D-19:** Preserve all Reference Application source, protected tags, tag
  rulesets, public images, and sealed Phase 23/25/26 evidence bytes. Phase 27
  deploy artifacts, ingress adapters, browser state, and screenshot input are
  run-owned external or Sealos.io planning artifacts. Django public-domain
  practice uses a verified run-owned edge/Ingress host-rewrite to upstream
  `localhost`, preserving the frozen source's exact host contract.
- **D-20:** Use the recent sealed Phase 23 and Phase 26 four-state evidence and
  Phase 25 PostgreSQL evidence as accepted provenance for immutable release
  facts. Fresh Phase 27 runs supply missing reader timing, current Sealos
  analysis/template output, public domain/HTTPS, browser captures, and any
  evidence whose presentation depends on the current product surface.
- **D-21:** Measure both beginner workflows with the same fresh-reader clock.
  Record an ISO-8601 wall-clock start immediately before issuing the Sealos
  deploy request, an ISO-8601 end immediately after the generated public HTTPS
  `/health` returns its exact successful payload, monotonic elapsed
  milliseconds, framework, protected source tag, workspace context, and run
  ID. Local setup, authentication, and prerequisite installation occur before
  the measured interval.
- **D-22:** The phrase `in 5 Minutes` is enabled in both beginner titles only
  when both independently measured elapsed values are at most 300000 ms.
  Otherwise both pages use the evergreen `How to Deploy ... on Sealos` title.
  Each article reports its observed duration and the clock definition. A
  retry receives a new run ID and is retained as a separate attempt; title
  eligibility uses the accepted clean attempt with complete evidence.
- **D-23:** Retain a credential-free Phase 27 evidence package with at least:
  public source/tag identities, timing records, commands, generated resource
  summaries, migration results, runtime/log results, HTTP results, browser
  observations, rollback transitions, screenshot provenance, cleanup records,
  and one checksum manifest generated after semantic and credential review.
  Each screenshot ledger record includes page, filename, adjacent step,
  framework, stage, source artifact and record, capture session, redactions,
  dimensions, byte size, and SHA-256.
- **D-24:** Cleanup each accepted and failed practice attempt by exact ownership
  identity. Remove its Instance, Deployment, ReplicaSet, Pod, Service, Ingress,
  Job, PostgreSQL Cluster, PVC, Secret, ConfigMap, port-forward, local server,
  browser session, generated `.sealos/` state clone, render path, image scratch,
  and ownership ledger. Retain public repositories, protected tags, accepted
  immutable GHCR images, Phase 27 evidence, and final screenshot assets.

### Publication Gate and Phase Ownership

- **D-25:** Phase 27 may create all six MDX sources and 24 image assets while
  preserving `AVAILABLE_FRAMEWORK_KEYS`, the nine-page validator contract,
  tutorial index metadata, and static publication checks. This keeps the
  working branch release-ineligible until Phase 28 completes the publication
  transition.
- **D-26:** Phase 27 acceptance requires complete page-to-tag, claim-to-source,
  screenshot-to-evidence, and cleanup traceability. Any missing tag, timing
  record, evidence record, redaction review, image constraint, or adjacent-step
  match blocks the affected page and blocks Phase 28 promotion.

### the agent's Discretion

- Choose the exact FastAPI and Django accent colors inside the established dark
  evidence-card system.
- Choose whether each evidence card uses one full browser capture, one terminal
  panel, or a two-panel composition, subject to the matrix and provenance rules.
- Choose concise captions, troubleshooting examples, FAQ wording, and reading
  time after the required stage information architecture and verified claims
  are covered.
- Choose the Phase 27 evidence package's internal filenames and JSONL/text
  split while preserving the required fields, checksum-last rule, and
  credential-free contract.
- Choose run-owned generated resource names, bounded resource requests,
  capture tooling, WebP encoder settings, and the verified Sealos Ingress
  mechanism that rewrites Django's upstream Host to `localhost`.

## Deferred Ideas

- FastAPI/Django framework matrix promotion and index copy/keyword updates are
  Phase 28 work.
- Fifteen-page `npm run validate-tutorials` expansion and TDD-04 are Phase 28
  work.
- Fumadocs/static production build, six-page route smoke, 24 image HTTP and
  content-type checks, and final publication audit are Phase 28 work.
- Milestone-wide live resource, Instance, PVC, Secret, image-version, and local
  scratch cleanup readback is Phase 28 work; Phase 27 still cleans every run it
  owns before completion.
- Tutorial localization, additional frameworks, automated recurring capture,
  and browser walkthrough video remain future requirements.

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID | Phase 27 interpretation | Research implication |
|---|---|---|
| CONT-01 | Publish the locked FastAPI and Django deploy, PostgreSQL, and production source set. | Create the six English MDX sources with the existing schema and series contracts. [VERIFIED: `.planning/REQUIREMENTS.md`; `27-CONTEXT.md`] |
| CONT-02 | Ground every tutorial statement in the matching protected source stage or retained practice evidence. | Maintain a claim ledger whose selectors resolve to immutable source or evidence records. [VERIFIED: `.planning/REQUIREMENTS.md`; Phase 21-26 verification/evidence] |
| CONT-03 | Preserve the current tutorial journey, SEO, CTA, related-link, and Sealos Skills vocabulary. | Reuse the Next.js structure and current Fumadocs schema, loader, metadata, and detail layout. [VERIFIED: current nine tutorial sources; `source.config.ts`; tutorial route/layout utilities] |
| CONT-04 | Keep FastAPI and Django continuity across all three stages. | FastAPI remains the Tasks API; Django remains the Task Board plus native admin. [VERIFIED: protected reference repositories; `27-CONTEXT.md`] |
| SHOT-01 | Supply exactly 24 practice-backed screenshots, four unique 1440x900 WebPs per page. | Implement a deterministic capture, render, compression, and reference pipeline with hard metadata gates. [VERIFIED: `.planning/REQUIREMENTS.md`; `27-CONTEXT.md`] |
| SHOT-02 | Make each image readable, credential-free, traceable, and adjacent to its proving step. | Validate OCR/text bounds, source selectors, redaction, visual appearance, checksums, and MDX adjacency. [VERIFIED: `.planning/REQUIREMENTS.md`; `27-CONTEXT.md`] |
| OPS-01 | Practice in a real authenticated Sealos workspace and clean every owned artifact. | Use exact run IDs, fresh timing and domain observations, bounded workloads, exhaustive cleanup, and zero-residue readback. [VERIFIED: `.planning/REQUIREMENTS.md`; `27-CONTEXT.md`] |

</phase_requirements>

## Research Summary

Phase 27 should run as one evidence-producing workflow with three outputs: six
English MDX sources, 24 deterministic WebP evidence cards, and a checksum-bound
credential-free evidence package. The protected tags and sealed Phase 23/25/26
records are the authority for immutable source and release claims; fresh
run-owned Sealos practice is the authority for current plugin output, beginner
timing, generated public HTTPS domains, browser state, and cleanup. [VERIFIED:
`27-CONTEXT.md`; Phase 23/25/26 verification and evidence packages]

The implementation should add a Phase 27 pre-publication validator and leave
the existing nine-page validator, framework availability matrix, index
metadata, and production publication path untouched. The new source folders
make the branch intentionally release-ineligible until Phase 28 updates the
global publication contracts. [VERIFIED: `27-CONTEXT.md` D-25; current
`scripts/validate-tutorials.mjs`; `app/[lang]/(home)/tutorials/tutorial-growth-data.ts`]

The screenshot pipeline can use tools already installed on this machine:
Node.js to render escaped local HTML, `agent-browser` with bundled Chrome to
capture exact 1440x900 PNGs, `cwebp` to produce metadata-free WebP files,
FFmpeg and Tesseract to inspect pixels and text, and `view_image` for human
visual review. No new package installation is required. [VERIFIED: local tool
probe on 2026-07-16; screenshot and agent-browser skill instructions]

## Project Constraints

- All planning artifacts, tutorial prose, source, comments, commit text, and PR
  text are English; user-facing coordination remains Simplified Chinese.
  [VERIFIED: `AGENTS.md`]
- Repository edits must begin through GSD; this research used the Phase 27 GSD
  research seam and writes only the planning research artifact. [VERIFIED:
  `AGENTS.md`; `gsd-phase-researcher.toml`]
- The implementation must be surgical: six sources, 24 assets, Phase 27 tests,
  evidence, and run-owned external state only. [VERIFIED: `AGENTS.md`;
  `27-CONTEXT.md`]
- Phase 27 must keep the existing Next.js App Router, React, Fumadocs, npm,
  static-export, and deployment model. [VERIFIED: `AGENTS.md` project scope]
- Current source-of-truth behavior takes precedence over tutorial convention;
  conventions supply layout and reader flow after source and runtime facts are
  resolved. [VERIFIED: `AGENTS.md`; `27-CONTEXT.md` D-06 through D-09]

## Existing Tutorial Contract

### Frontmatter, Routing, and Rendering

The tutorial collection schema requires the fields below. `faq` and `howTo`
are optional in the schema yet required by the locked Phase 27 page contract.
The route uses English `index.en.mdx` content, `/tutorials/<slug>` canonical
URLs, and Fumadocs source loading. [VERIFIED: `source.config.ts`;
`lib/source.ts`; `27-CONTEXT.md` D-04]

```yaml
---
title: <locked or title-gated title>
description: <stage-specific search description>
date: 2026-07-16
updated: 2026-07-16
stage: beginner | advanced | production
framework: FastAPI | Django
series: sealos-skills-fastapi | sealos-skills-django
seriesOrder: 1 | 2 | 3
estimatedReadingTime: <positive integer>
primaryKeyword: <one framework-and-stage query>
targetKeywords:
  - <supporting query>
tags:
  - fastapi | django
  - sealos
  - deployment
authors:
  - Sealos Team
relatedTutorials:
  - <same-series slug in stage order>
cta:
  label: Start free on Sealos | Open Sealos Skills
  href: https://os.sealos.io | /sealos-skills
faq:
  - question: <verified reader question>
    answer: <verified answer>
howTo:
  name: <task name>
  description: <task description>
  totalTime: PT<minutes>M
  steps:
    - name: <step>
      text: <verified action>
---
```

`series` equality and `seriesOrder` drive adjacent navigation; explicit
`relatedTutorials` drive related cards. Root-relative images are wrapped by
ImageZoom, and each image's `alt` value is rendered as a visible caption.
[VERIFIED: `lib/utils/tutorial-utils.ts`;
`app/[lang]/(home)/tutorials/[slug]/page.tsx`;
`app/[lang]/(home)/tutorials/[slug]/layout.tsx`]

The detail layout and metadata path already emit article, breadcrumb, FAQ, and
HowTo structured data when the frontmatter is present. Canonical, Open Graph,
Twitter, and keyword metadata come from the centralized tutorial metadata
helper. [VERIFIED: tutorial detail layout; `lib/utils/tutorial-metadata.ts`;
structured-data utilities]

### Existing Body and CTA Conventions

The three Next.js pages establish distinct deploy, PostgreSQL, and production
information architectures; the React and Node.js pages establish the current
four-image density. Each image is located immediately after the reader action
that it proves. [VERIFIED: all nine current tutorial MDX sources]

The deploy CTA is `Start free on Sealos` at `https://os.sealos.io`; PostgreSQL
and production CTAs are `Open Sealos Skills` at `/sealos-skills`. Related links
stay within the framework series and preserve stage order. [VERIFIED: current
tutorial sources; `27-CONTEXT.md` D-05]

The current availability matrix exposes Next.js, React, and Node.js while
FastAPI and Django remain `coming_next`. Phase 27 preserves this state.
[VERIFIED: `app/[lang]/(home)/tutorials/tutorial-growth-data.ts`;
`27-CONTEXT.md` D-25]

## Canonical Source and Evidence Authority

### Protected Tags

The local public-repository mirrors resolve the protected annotated tags to the
following exact object graph. Execution should repeat local and remote
readbacks before using them and record both identities in `source-tags.txt`.
[VERIFIED: `git tag --format` in both reference repositories on 2026-07-16]

| Framework | Tag | Annotated tag object | Peeled commit |
|---|---|---|---|
| FastAPI | `stage-1-deploy` | `77e57a281ecc087041b54273c1bfc63b66f13d1a` | `276aa00e4d5bb7a0d5e375fee530cde3240b2ce8` |
| FastAPI | `stage-2-postgresql` | `b61254c237885744ae85cb6f81386f77f1e3ac09` | `2b256b3dfc2a7d2a4b930c9970becca8c6da8cd3` |
| FastAPI | `stage-3-production` | `148b525452c3e1cd1b187b5d8ffb488b8fd16403` | `1dbbf19185207aed44a29ad6a3509d94a3670c43` |
| Django | `stage-1-deploy` | `0d9254d37914976898039ff3c55f94399aa1d7c0` | `ca115bf21b599c14e667b336bd78e3c587c24208` |
| Django | `stage-2-postgresql` | `16f60a44885216fa35d67b0334914d8b8d4e8577` | `16279958ca774f7a34c25b0102a483df53160d6f` |
| Django | `stage-3-production` | `f5d48ccd96f9b62da268720686e26666e2675235` | `8e372f93e1a7bb72880be5198430a065d38d65f5` |

FastAPI ruleset `18970425` and Django ruleset `19014157` protect
`refs/tags/stage-*` from update and deletion with no bypass. These values are
retained evidence facts and should receive a fresh read-only GitHub API check
before capture. [VERIFIED: Phase 23 and Phase 26 publication evidence;
reference harness assertions]

Reader clone commands should use the public tag name, for example:

```bash
git clone --branch stage-1-deploy --depth 1 \
  https://github.com/yangchuansheng/sealos-fastapi-tutorial.git
```

The protected tag URL is the reader-facing source link; direct and peeled IDs
belong in the evidence note and claim ledger. [VERIFIED: `27-CONTEXT.md` D-03]

### Sealed Evidence Reuse

Phase 23's sealed FastAPI production package proves the immutable A/B images,
migration-first rollout, two Ready replicas, UID/GID 10001, one Uvicorn worker,
port 8000, public health/docs behavior, A-B-A-B controller transitions, task
continuity, and exact cleanup. Its image identities are:
`sha256:b11293cf8ebb0e73fbabfd33ef6e812d53cb8176ea2db853769aae3dfa273337`
and
`sha256:c5f6d6df59d05ab9e079aab5dc9a9b0666218ae38f104630587343eaba25b5de`.
[VERIFIED: Phase 23 summaries, verification, and sealed evidence]

Phase 25's sealed Django PostgreSQL package proves the real PostgreSQL
dependency, `tasks.0001_initial`, migration Job completion and repeat/current
behavior, schema-aware readiness, process restart persistence, Task Board
state, authenticated native-admin readback, public replay, and exact cleanup.
[VERIFIED: Phase 25 summaries, verification, and evidence]

Phase 26's sealed Django production package proves immutable images, migration
before readiness, two Ready replicas, Gunicorn identity, collected and served
hashed WhiteNoise CSS `styles.852e61e8064c.css`, health/board/admin behavior,
A-B-A-B rollback/recovery, Task continuity, and exact cleanup. Its image
identities are
`sha256:df3772c3abedfb05c52d696f17ff8295d73f34b8b017f8b6ba2738fceb4247a8`
and
`sha256:aad216002fae3fd2adce92f09e47e936614b16964a6972c226c4058a16568c7b`.
[VERIFIED: Phase 26 summaries, verification, and sealed evidence]

Copy or reference sealed records by their existing SHA-256 identity. Preserve
their bytes. Fresh Phase 27 records should supply only current-product facts:
Sealos assessment/template output, generated domain and HTTPS behavior,
browser captures, beginner timing, Django Host rewrite, and run cleanup.
[VERIFIED: `27-CONTEXT.md` D-19 and D-20]

## Visual System Findings

Representative Next.js, React, and Node.js tutorial assets were inspected with
`view_image`. They use a 1440x900 dark navy/black canvas, subtle teal/green/blue
light, thin one-pixel frames, browser-style control dots, a small uppercase
evidence eyebrow, a concise white heading, muted support text, and a large
monospace terminal or source panel. [VERIFIED: visual inspection of
`generated-full-stack-plan.webp`, `sealos-runtime-logs.webp`,
`react-readiness-assessment.webp`, `react-state-template-review.webp`,
`nodejs-assessment-summary.webp`, and
`nodejs-migration-recovery-readiness.webp`]

Those six representative files are WebP 1440x900 and range from 32,034 to
112,286 bytes; the broader inspected precedent range is 26,578 to 112,286
bytes. FFmpeg signal statistics measured luma minima of 6-10, means of
29.46-37.58, and maxima of 233-245. [VERIFIED: local `file`, `stat`, `ffprobe`,
and FFmpeg `signalstats` probes]

Use FastAPI teal `#009688` and Django green `#44b78b` as phase-local accent
choices while retaining the neutral dark system. These are design decisions
within the delegated discretion. [ASSUMED]

Use Arial for interface text and Menlo for commands and output because both are
available locally and avoid network font loading. Keep critical output at 20px
or larger and labels/captions at 18px or larger on the 1440x900 source canvas.
[VERIFIED: local font availability; ASSUMED: minimum type sizes selected from
visual precedent]

Long URLs and digests need dedicated wrapping rules. Render them in fixed-width
blocks with `overflow-wrap: anywhere`, preserve the entire token in the
underlying evidence record, and use a visible omission marker only when the
card explicitly curates output. [VERIFIED: visual inspection found an awkward
URL wrap in the Node.js precedent; `27-CONTEXT.md` D-13]

## Environment Availability

### Local Tools

| Capability | Current availability | Planned use |
|---|---|---|
| Node.js / npm | Node `v24.13.0`, npm `11.6.2` | Built-in `node:test`, JSONL validation, escaped HTML rendering, local-only render server. [VERIFIED: local CLI probe] |
| `agent-browser` | `0.26.0`, bundled Chrome works | Named browser sessions, 1440x900 capture, live app and responsive page checks. [VERIFIED: local CLI probe and data-URL smoke capture] |
| `cwebp`, `dwebp`, `webpmux` | WebP tools `1.6.0` | Encode, decode, strip metadata, and inspect WebP files. [VERIFIED: local CLI probe] |
| FFmpeg / ffprobe | `8.0.1` | Dimensions, luma, entropy, and nonblank pixel checks. [VERIFIED: local CLI probe] |
| Tesseract | `5.5.2` | OCR expected-token and redaction scans. [VERIFIED: local CLI probe] |
| `kubectl` | Client `v1.35.0`, authenticated context | Read-only preflight, run-owned deploy verification, cleanup. [VERIFIED: local CLI and auth probes] |
| `gh`, `uv`, `jq` | Available | Public tag/ruleset checks, locked source replay, structured evidence. [VERIFIED: local CLI probe] |
| `sharp`, ImageMagick, Playwright CLI/module, Docker, `yq` | Absent | The plan has no dependency on these tools. [VERIFIED: local command/module probes] |

No external runtime or package dependency needs installation, so the package
legitimacy gate has no candidate package to audit. [VERIFIED: selected tool
chain]

### Authenticated Sealos Read-Only Snapshot

The Codex marketplace plugin `sealos@sealos` is installed and enabled at
version `1.1.0`; the Claude plugin `sealos@labring-sealos-skills` is installed
and enabled at version `1.0.0`. Tutorial prose should use durable entry labels
and omit these snapshot versions. [VERIFIED: read-only plugin listing on
2026-07-16]

The current kube context is authenticated to the Sealos US West endpoint and
can get Pods and create Deployments, Ingresses, and Jobs. Store a hash of the
workspace context in retained evidence and keep the raw namespace and server
endpoint out of tutorial assets. [VERIFIED: read-only `kubectl config` and
`kubectl auth can-i` probes on 2026-07-16]

The current namespace has no Ingress resources, the target reference clones
contain no `.sealos/` state, and `agent-browser` has unrelated pre-existing
sessions. Execution must preserve unrelated sessions and resources. [VERIFIED:
read-only namespace, repository, and browser-session probes on 2026-07-16]

The current gaps are the facts Phase 27 must create: two accepted beginner
timing attempts, current `.sealos` analysis/template/state artifacts, generated
public HTTPS domains, application browser captures, Django Host-rewrite proof,
and exact run cleanup. [VERIFIED: comparison of the environment snapshot with
`27-CONTEXT.md` D-18 through D-24]

## Current Sealos Workflow

### Reader Entry Surface

Use these current reader-facing paths:

- Codex CLI: install/enable the Sealos plugin, then invoke `$sealos` in the
  reference clone. [VERIFIED: installed Sealos plugin documentation]
- Codex App: select the Sealos plugin in the plugin UI, then ask it to deploy
  the current repository. [VERIFIED: installed Sealos plugin documentation]
- Claude Code: install the native Sealos plugin, then invoke `/sealos`.
  [VERIFIED: installed Sealos plugin documentation]

Tutorial prose should use DEPLOY, UPDATE, Runtime Truth Pass, and the generated
`.sealos/analysis.json`, `.sealos/template/index.yaml`, and `.sealos/state.json`
artifacts. Direct legacy skill commands stay outside the articles. [VERIFIED:
installed plugin routing; `27-CONTEXT.md` D-09]

### Plugin Execution Path

The installed plugin performs preflight, repository assessment, image
detection or build, Dockerfile work when needed, template generation,
deployment configuration, Template API deployment, Runtime Truth Pass, and
state recording. The assessment writes `.sealos/analysis.json`; template
generation writes `.sealos/template/index.yaml`; accepted deployment writes
`.sealos/state.json`. [VERIFIED: installed Sealos plugin `SKILL.md`, phase
modules, and scripts]

The current internal template deployment helper posts the generated template
to the Sealos Template API and creates Sealos Instance/App state plus Kubernetes
workloads. Treat the helper path and API endpoint as implementation details;
reader instructions stay on `$sealos`, Codex App plugin selection, or
`/sealos`. [VERIFIED: installed `deploy-template.mjs` and plugin phase modules]

Runtime truth should verify the generated public URL, workload rollout, Pod
status, logs, Ingress, Service endpoints, and exact application routes before
accepting a run. Sealos public-access documentation instructs users to enable
public access, record the generated address, and verify it in a browser.
[VERIFIED: installed plugin Runtime Truth Pass; CITED:
https://sealos.io/docs/guides/app-deploy/add-a-domain]

### Run Ownership and Naming

Generate one lowercase run ID per attempt, for example
`p27-fastapi-beginner-<UTC timestamp>-<random suffix>`, and place the exact ID
in every Kubernetes label, Sealos resource name, scratch directory, browser
session, timing record, and cleanup selector. Keep names within Kubernetes DNS
label limits. [ASSUMED: recommended ownership convention derived from D-18 and
D-24]

Recommended labels:

```yaml
metadata:
  labels:
    app.kubernetes.io/managed-by: phase-27
    sealos.io/tutorial-run: <run-id>
    sealos.io/tutorial-framework: fastapi
    sealos.io/tutorial-stage: beginner
```

Before any mutation, save a read-only baseline of exact run selectors and
prove that every proposed resource name is absent. After cleanup, query those
same names and selectors across Instance, App, Deployment, ReplicaSet, Pod,
Service, Ingress, Job, PostgreSQL Cluster, PVC, Secret, and ConfigMap kinds.
[VERIFIED: installed Sealos resource model and Phase 23/25/26 cleanup patterns]

Use the plugin-required kube invocation for live checks:

```bash
KUBECONFIG="$HOME/.sealos/kubeconfig" \
  kubectl --insecure-skip-tls-verify -n "$NAMESPACE" get pods
```

The retained evidence stores redacted commands and a workspace-context hash;
it excludes the namespace, API server, tokens, kubeconfig, Secret values, and
cookies. [VERIFIED: installed plugin instructions; `27-CONTEXT.md` D-08 and
D-23]

### Django Public Host Contract

The frozen Django production source requires the upstream Host value
`localhost`, and its readiness probe already sends `Host: localhost`.
[VERIFIED: Django protected Stage 3 source and deployment manifests]

Django validates request hosts against `ALLOWED_HOSTS` through
`request.get_host()`. ingress-nginx supports
`nginx.ingress.kubernetes.io/upstream-vhost` to set the upstream Host header.
[CITED: https://docs.djangoproject.com/en/5.2/topics/security/; CITED:
https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#custom-nginx-upstream-vhost]

Use a run-owned Ingress with the current Sealos NGINX conventions and this
edge contract:

```yaml
metadata:
  annotations:
    kubernetes.io/ingress.class: nginx
    nginx.ingress.kubernetes.io/upstream-vhost: localhost
```

Verify the rendered live Ingress, the generated public HTTPS `/health`, the
Task Board, and `/admin/login/`. Record the public host at the edge and the
fixed upstream Host contract in the claim ledger. If the current cluster
rejects or ignores the annotation, use a run-owned bounded edge proxy that sets
`Host: localhost`, then verify and clean it through the same ownership ledger.
[VERIFIED: installed Sealos NGINX rule; CITED:
https://kubernetes.github.io/ingress-nginx/user-guide/basic-usage/; ASSUMED:
run-owned proxy is the bounded fallback]

## Beginner Timing Gate

Prepare authentication, plugin installation, protected clone, locked install,
local tests, and local server verification before the measured interval. Start
both wall and monotonic clocks immediately before issuing the Sealos deploy
request. Stop both immediately after the generated public HTTPS `/health`
returns the protected stage's exact successful payload. [VERIFIED:
`27-CONTEXT.md` D-21]

Each JSONL timing record should contain:

```json
{
  "schema_version": 1,
  "attempt_id": "<unique attempt id>",
  "run_id": "<exact ownership id>",
  "framework": "fastapi",
  "protected_tag": "stage-1-deploy",
  "tag_commit": "<peeled sha>",
  "workspace_context_sha256": "<hash>",
  "start_wall": "<ISO-8601>",
  "end_wall": "<ISO-8601>",
  "start_monotonic_ns": "<integer string>",
  "end_monotonic_ns": "<integer string>",
  "elapsed_ms": 0,
  "health_url": "https://<public generated host>/health",
  "expected_payload_sha256": "<hash>",
  "observed_payload_sha256": "<hash>",
  "http_status": 200,
  "accepted": true,
  "evidence_complete": true,
  "title_eligible": true
}
```

Retain every retry as a separate attempt and assign a new run ID. The accepted
attempt requires complete source, command, resource, HTTP, browser, screenshot,
and cleanup evidence. [VERIFIED: `27-CONTEXT.md` D-22 and D-23]

Compute one shared title decision after both accepted attempts exist:

```text
shared_five_minute_title =
  fastapi.accepted && django.accepted &&
  fastapi.elapsed_ms <= 300000 && django.elapsed_ms <= 300000
```

When true, both beginner titles include `in 5 Minutes`; when false, both use
the evergreen `How to Deploy ... on Sealos` form. Each body reports its own
observed duration and the exact clock boundary. [VERIFIED: `27-CONTEXT.md`
D-22]

## Evidence Package Design

Use this Phase 27 directory:

```text
.planning/phases/27-practice-backed-tutorial-series/evidence/
├── README.md
├── source-tags.txt
├── claims.jsonl
├── timing.jsonl
├── commands.jsonl
├── sealos-analysis.jsonl
├── resource-plans.jsonl
├── migrations.jsonl
├── http.jsonl
├── browser.jsonl
├── runtime.jsonl
├── rollback.jsonl
├── screenshots.jsonl
├── cleanup.jsonl
├── redaction-review.txt
├── render-inputs/
│   └── <slug>/<asset>.json
└── checksums.txt
```

This split keeps immutable/public source identities, fresh observations,
render inputs, image provenance, and cleanup independently addressable while
retaining a single checksum boundary. [ASSUMED: selected evidence layout under
the delegated discretion]

All JSONL files should use one object per line, stable key ordering, LF endings,
`schema_version`, `record_id`, `run_id`, `observed_at`, `source_kind`, and a
SHA-256 of the source record or sanitized payload. [ASSUMED: deterministic
schema recommendation]

`claims.jsonl` should map `page`, `section`, `claim_id`, `claim_text_sha256`,
`protected_tag`, `source_artifact`, `source_record_id`, and
`record_selector`. `screenshots.jsonl` should additionally contain `filename`,
`adjacent_step`, `framework`, `stage`, `capture_session`, `render_input`,
`redactions`, `width`, `height`, `media_type`, `byte_size`, and `sha256`.
[VERIFIED: required screenshot fields in D-23; ASSUMED: additional claim fields]

Every retained public URL, domain, status, digest, migration revision, and
resource status needs one provenance selector. Secrets, authorization headers,
cookies, kubeconfig content, private endpoints, namespace, Secret values,
database URLs, and administrator credentials must be replaced before any
render input is written. [VERIFIED: `27-CONTEXT.md` D-08, D-14, and D-23]

Create `checksums.txt` only after semantic review, source comparison,
credential scanning, screenshot validation, and cleanup pass. Hash every
retained evidence file except the checksum manifest itself using sorted paths.
[VERIFIED: `27-CONTEXT.md` D-23; Phase 23/25/26 checksum-last precedent]

Recommended checksum command:

```bash
find . -type f ! -name checksums.txt -print0 \
  | LC_ALL=C sort -z \
  | xargs -0 shasum -a 256 > checksums.txt
```

## Deterministic Evidence-Card Pipeline

### 1. Sanitize and Bind Inputs

Read the selected evidence record, verify its checksum, apply field-based
redaction, escape HTML metacharacters, and write a sanitized render spec under
`evidence/render-inputs/<slug>/<asset>.json`. The spec includes source record
IDs, expected visible tokens, omission markers, redaction labels, layout type,
accent, and target asset path. [VERIFIED: D-13, D-14, and D-23; ASSUMED:
render-spec schema]

Keep raw capture files and browser cookies in a mode-0700 run scratch directory
outside the repository. Retain only sanitized render specs, final assets, and
credential-free evidence records. [VERIFIED: D-23 and D-24]

### 2. Render Fixed Local HTML

Use a Node.js script with no external assets, no animation, no network fetches,
Arial/Menlo fonts, a fixed 1440x900 root, fixed grid tracks, and escaped text.
Serve it on loopback for the duration of capture. The script should fail when
the root scrolls, critical elements leave the canvas, text overlaps, expected
tokens are absent, or document fonts are still loading. [ASSUMED: selected
deterministic renderer design]

Browser-side metrics must assert:

```text
innerWidth == 1440
innerHeight == 900
devicePixelRatio == 1
document.documentElement.scrollWidth <= 1440
document.documentElement.scrollHeight <= 900
every [data-critical] rect is within the canvas
every pair marked [data-no-overlap] has zero intersection
document.fonts.status == "loaded"
```

### 3. Capture a PNG

Use one fresh named session per asset and close it after capture:

```bash
agent-browser --session "$SESSION" set viewport 1440 900
agent-browser --session "$SESSION" open "$LOCAL_RENDER_URL"
agent-browser --session "$SESSION" wait --load networkidle
agent-browser --session "$SESSION" screenshot "$PNG_PATH"
agent-browser --session "$SESSION" close
```

The local smoke probe produced an exact 1440x900 PNG through this toolchain.
[VERIFIED: local agent-browser capture test on 2026-07-16]

For application-surface cards, first capture the real public page in a separate
run-owned browser session, record final URL/title/lang/body selectors and its
SHA-256, then embed that real capture inside the deterministic evidence frame.
[VERIFIED: D-12 and D-13; agent-browser skill]

### 4. Encode WebP

Use a fixed quality ladder until the target budget passes:

```bash
cwebp -quiet -q 84 -m 6 -sharp_yuv -metadata none \
  "$PNG_PATH" -o "$WEBP_PATH"
```

Retry with quality 80, then 76 when the result exceeds 150,000 bytes. Reject a
result at 200,000 bytes or above. Keep dimensions unchanged and omit variable
metadata. [CITED: https://developers.google.com/speed/webp/docs/cwebp;
VERIFIED: D-16; ASSUMED: selected quality ladder]

### 5. Validate the Asset

Run file, metadata, byte, pixel, OCR, redaction, provenance, and visual gates:

```bash
file "$WEBP_PATH"
ffprobe -v error -select_streams v:0 \
  -show_entries stream=codec_name,width,height -of json "$WEBP_PATH"
webpmux -info "$WEBP_PATH"
test "$(stat -f %z "$WEBP_PATH")" -lt 200000
dwebp "$WEBP_PATH" -o "$VERIFY_PNG"
tesseract "$VERIFY_PNG" stdout > "$OCR_PATH"
shasum -a 256 "$WEBP_PATH"
```

Use FFmpeg `signalstats` to reject uniform or nearblank output. The inspected
precedent has a luma span above 220; a conservative Phase 27 gate can require
`YMAX - YMIN >= 160`, together with nonzero entropy and successful expected-token
OCR. [VERIFIED: measured precedent; ASSUMED: selected blank threshold]

Compare OCR and the sanitized render spec against the source record's expected
tokens. Scan both for credential patterns and forbidden raw values. Use
`view_image` for every final WebP and inspect the rendered tutorial page at
1440x900 and 390x844 so captions, zoom wrappers, and surrounding prose remain
readable and free of overlap. [VERIFIED: D-17; screenshot skill]

## Validation Architecture

Nyquist validation is required because the output spans source contracts,
external runtime observations, generated images, and MDX integration. Each
failure boundary needs a test at the closest deterministic seam. [VERIFIED:
GSD research protocol; Phase 27 cross-system scope]

### Layered Gates

| Layer | Gate | Failure caught |
|---|---|---|
| Source identity | Direct/peeled tag and protected URL readback | Tag drift, wrong stage, mutable source. [VERIFIED: Phase 21-26 publication pattern] |
| Claim provenance | `claims.jsonl` schema plus selector resolution | Unsupported prose or mismatched stage claim. [ASSUMED: Phase 27 validator design] |
| Runtime | Exact run ID, rollout, Job, route, browser, and cleanup records | Stale observations, cross-run contamination, incomplete acceptance. [VERIFIED: D-18 through D-24] |
| Render input | JSON schema, escaping, expected token, redaction tests | Injection, secret leakage, wrong source selection. [ASSUMED: renderer test seam] |
| Asset | Signature, codec, dimensions, bytes, pixels, OCR, checksum | Wrong format, blank image, unreadable text, oversize file. [VERIFIED: D-16 and D-17] |
| MDX | Frontmatter, exactly four unique references, path resolution, alt quality, adjacency | Broken routing, duplicate image, generic caption, detached evidence. [VERIFIED: D-04, D-11, D-15] |
| Responsive page | Desktop/mobile browser assertions and screenshots | Caption overflow, image/prose overlap, broken zoom layout. [VERIFIED: D-17] |
| Publication fence | Existing validator and availability files remain byte-identical | Accidental Phase 28 promotion. [VERIFIED: D-25] |

### Pre-Publication Acceptance Commands

Add Phase 27-specific Node tests and scripts rather than expanding the current
nine-page validator:

```bash
node --test scripts/validate-phase27-tutorials.test.mjs
node --test scripts/render-tutorial-evidence.test.mjs
node --test scripts/validate-phase27-evidence.test.mjs
node scripts/validate-phase27-tutorials.mjs
node scripts/validate-phase27-evidence.mjs
npm run lint
```

The existing `npm run validate-tutorials` currently encodes exactly nine
tutorial directories and treats additional directories as a contract change.
After Phase 27 creates six source folders, that global validator remains a
deliberate publication blocker until Phase 28 expands it to 15 pages. Record
its source checksum before and after Phase 27 and require equality. [VERIFIED:
current `scripts/validate-tutorials.mjs`; D-25]

## Six-Page Content and SEO Blueprint

| Slug | Recommended title and keyword | Required body spine |
|---|---|---|
| `deploy-fastapi-sealos` | Shared gate chooses `How to Deploy FastAPI on Sealos in 5 Minutes` or `How to Deploy FastAPI on Sealos`; primary keyword `deploy FastAPI on Sealos`. [VERIFIED: D-22; ASSUMED: SEO wording] | Prerequisites; plugin entry; Stage 1 clone/locked validation; deploy request; analysis/template review; image/config; deploy; Runtime Truth Pass; `.sealos`; health/docs/tasks browser proof; failures; PostgreSQL next step. [VERIFIED: D-06, D-10, D-11] |
| `fastapi-postgresql-sealos` | `How to Deploy FastAPI with PostgreSQL on Sealos`; primary keyword `FastAPI PostgreSQL Sealos`. [ASSUMED: SEO wording] | Takeaways; prerequisites; architecture; Stage 2 SQLAlchemy/Alembic inputs; full-stack request; resource plan; Secret/env contract; migration Job `0001`; schema-aware readiness; public CRUD; restart persistence; failures; production next step. [VERIFIED: D-06, D-10, D-11; protected Stage 2 source] |
| `fastapi-production-deployment-sealos` | `FastAPI Production Deployment on Sealos`; primary keyword `FastAPI production deployment`. [ASSUMED: SEO wording] | Audience; plugin; launch model; scorecard; protected Stage 3 and digest; state/env; migration-first 2-replica rollout; UID/GID and one Uvicorn worker; HTTPS/docs/logs; monitoring/backup; update; A-B-A-B rollback/recovery; runbook; checklist. [VERIFIED: D-06, D-11; Phase 23 evidence] |
| `deploy-django-sealos` | Shared gate chooses `How to Deploy Django on Sealos in 5 Minutes` or `How to Deploy Django on Sealos`; primary keyword `deploy Django on Sealos`. [VERIFIED: D-22; ASSUMED: SEO wording] | Prerequisites; plugin entry; Stage 1 clone, migrate/test/run; deploy request; analysis/template; host-rewrite edge; Runtime Truth Pass; `.sealos`; health/board/admin browser proof; failures; PostgreSQL next step. [VERIFIED: D-06, D-10, D-11; protected Stage 1 source] |
| `django-postgresql-sealos` | `How to Deploy Django with PostgreSQL on Sealos`; primary keyword `Django PostgreSQL Sealos`. [ASSUMED: SEO wording] | Takeaways; architecture; Stage 2 psycopg/settings/migration; full-stack request; resource plan; Secret/env; `tasks.0001_initial` Job; readiness; Task Board; restart persistence; authenticated admin readback; failures; production next step. [VERIFIED: D-06, D-10, D-11; Phase 25 evidence] |
| `django-production-deployment-sealos` | `Django Production Deployment on Sealos`; primary keyword `Django production deployment`. [ASSUMED: SEO wording] | Audience; plugin; scorecard; Stage 3/digests; Gunicorn/WhiteNoise; collectstatic; migration-first 2-replica rollout; Host edge; HTTPS/board/admin/hashed CSS/logs; monitoring/backup; update; A-B-A-B rollback/recovery; runbook; checklist. [VERIFIED: D-06, D-11; Phase 26 evidence] |

Each page should use two to four FAQ entries that answer stage-specific
questions already proven by source or evidence, and a HowTo sequence matching
the actual reader workflow. `totalTime` must reflect the tutorial task rather
than asserting the beginner deployment measurement unless the page explains
that exact timing boundary. [VERIFIED: schema behavior; ASSUMED: SEO content
guidance]

Use 2026-07-16 as the initial `date` and execution completion day as `updated`
when implementation occurs later. Derive reading time after final prose and
keep descriptions concise enough for existing metadata rendering. [ASSUMED:
recommended editorial convention]

## TDD Seams

Use Node's built-in test runner and write the failing contract before each
implementation unit. No new test dependency is needed. [VERIFIED: repository
test conventions and local Node availability]

1. `scripts/validate-phase27-tutorials.test.mjs` starts red because the six
   locked sources are absent. It then covers exact paths, required frontmatter,
   series/order, CTA, protected-tag URLs, related-link ordering, shared title
   gate, exactly four unique references, descriptive alt text, and Phase 28
   fences. [ASSUMED: recommended TDD seam]
2. `scripts/render-tutorial-evidence.test.mjs` starts red around escaped input,
   deterministic layout/spec output, forbidden-value redaction, required
   tokens, fixed canvas metrics, and compression command construction.
   [ASSUMED: recommended TDD seam]
3. `scripts/validate-phase27-evidence.test.mjs` starts red around JSONL schemas,
   claim selectors, source checksums, timing gate, screenshot ledger, checksum
   order, and cleanup completeness. [ASSUMED: recommended TDD seam]
4. A final image integration gate checks all 24 assets and their MDX references
   after capture. Phase 28 owns the 15-page global validator and static-route
   suite. [VERIFIED: D-16, D-17, D-25; ASSUMED: test placement]

Capture RED and GREEN commands in plan summaries. Tests may use tiny fixture
records and generated one-pixel corruption cases; live Sealos calls belong in
the evidence workflow and receive deterministic replay validation afterward.
[ASSUMED: recommended test boundary]

## Security Domain

Security enforcement is required because this phase handles authenticated
Sealos access, Kubernetes resources, Django administrator state, public URLs,
rendered operational evidence, and cleanup. [VERIFIED: D-18 through D-24]

| ASVS area | Phase 27 control |
|---|---|
| V2 Authentication | Use native Django authentication for admin proof; create run-owned credentials in Secret state, retain no credential value, and close the browser session. [VERIFIED: protected Django source; D-14 and D-24] |
| V3 Session Management | Isolate each browser session by run ID, record only selectors/outcomes, then delete cookies/profile state during cleanup. [VERIFIED: D-23 and D-24] |
| V4 Access Control | Scope all mutations and deletion to exact run-owned names/labels; authenticate admin readback; preserve unrelated namespace resources and browser sessions. [VERIFIED: D-18 and D-24] |
| V5 Validation | Validate JSONL schemas, escape render input, bound all text, verify HTTP payloads, and retain existing FastAPI/Django input validation from protected source. [VERIFIED: protected source; D-07, D-13, D-17] |
| V6 Cryptography | Use generated HTTPS, Sealos Secrets, immutable SHA-256 image references, and SHA-256 evidence integrity; implement no custom cryptography. [VERIFIED: D-14, D-18, D-23] |

Primary threats and controls:

- Credential disclosure: field-based redaction, forbidden-value scan, OCR scan,
  checksum only after review, and scratch deletion. [VERIFIED: D-14, D-17,
  D-23, D-24]
- Cross-run deletion: exact run IDs, preflight absence checks, label and name
  intersection, and post-delete readback. [VERIFIED: D-18 and D-24]
- Screenshot fabrication or source drift: immutable source selectors, source
  record checksums, expected tokens, browser-session IDs, and screenshot
  ledger links. [VERIFIED: D-07, D-13, D-23]
- Render injection/path traversal: JSON schema, HTML escaping, allowlisted asset
  paths rooted under the six folders, and no remote assets. [ASSUMED:
  renderer hardening]
- Host-header failure: fixed upstream-vhost contract plus live public route
  verification. [VERIFIED: protected Django source; official Django and
  ingress-nginx documentation]

## Cleanup Protocol

Cleanup runs after every accepted or failed attempt, including a partially
created Template API deployment. Resolve resources by both exact recorded name
and exact run label, compare the two sets, and halt on any ambiguous ownership
match. [VERIFIED: D-24; Phase 23/25/26 cleanup precedent]

Delete and read back these run-owned kinds: `instances.app.sealos.io`,
`apps.app.sealos.io`, Deployments, ReplicaSets, Pods, Services, Ingresses, Jobs,
PostgreSQL Clusters, PVCs, Secrets, and ConfigMaps. Stop port-forwards, local
servers, and capture servers; close only run-owned browser sessions; remove the
run clone, `.sealos` state clone, render output, decoded images, PNG scratch,
and local ownership ledger. [VERIFIED: installed Sealos resource model; D-24]

`cleanup.jsonl` should record each attempted target, deletion result, final
readback count, local process/session result, and a final `zero_residue: true`
record. The evidence package and final WebPs remain; public protected sources
and accepted immutable GHCR images remain. [VERIFIED: D-24; ASSUMED: cleanup
record schema]

## Failure Modes and Plan Responses

| Failure | Required response |
|---|---|
| Protected tag or ruleset drift | Stop before deployment, record the mismatch, and research the new public identity. [VERIFIED: D-07 and protected-source contract] |
| Sealos analysis/template lacks a required app, database, Secret, Job, Service, or Ingress | Keep the run unaccepted, correct only run-owned generated artifacts through the current plugin workflow, and repeat with a new evidence record. [VERIFIED: D-18 and D-23] |
| Beginner attempt exceeds 300000 ms | Retain the attempt and use evergreen titles for both pages unless later accepted clean attempts for both independently pass the gate. [VERIFIED: D-22] |
| Public `/health` succeeds before complete evidence exists | Keep timing observation, mark the attempt incomplete, clean it, and use a fresh run ID for the accepted attempt. [VERIFIED: D-22 and D-23] |
| Django public host reaches DisallowedHost | Inspect the live Ingress, apply the run-owned upstream Host contract or bounded edge fallback, and reverify health/board/admin. [VERIFIED: protected source and official Host/Ingress docs] |
| Browser redirects to login/error or renders stale content | Record final URL, title, body selector, network/console state, and reject the capture until the live state matches the expected route. [VERIFIED: agent-browser skill; D-13] |
| Card is blank, clipped, unreadable, oversized, or fails OCR | Reject the asset, adjust deterministic layout or quality, regenerate from the same sanitized source, and keep the source selector unchanged. [VERIFIED: D-16 and D-17] |
| Redaction scan finds a raw sensitive value | Delete the derived render and image outputs, repair field-based redaction, regenerate, rescan, and rotate any exposed credential through the owning system. [VERIFIED: D-14, D-17, D-24] |
| Cleanup readback finds residue | Keep Phase 27 incomplete, delete the exact owned residue, repeat all resource and local readbacks, then generate final checksums. [VERIFIED: D-24 and D-26] |
| Existing nine-page validator or availability matrix changes | Revert the Phase 27-owned change and leave promotion to Phase 28. [VERIFIED: D-25] |

## Recommended Execution Shape

1. Add failing Phase 27 contract tests, evidence schemas, and source/tag
   preflight. Preserve checksums for the current validator and publication
   files. [ASSUMED: plan decomposition]
2. Run the two clean Stage 1 reader workflows through current Sealos entry
   surfaces, record clocks/domains/browser state, and clean each run. Compute
   the shared title gate. [VERIFIED: D-18, D-21, D-22, D-24]
3. Reuse sealed Stage 2/3 evidence, perform only the fresh current-product
   observations required by D-20, and build the complete claim ledger.
   [VERIFIED: D-19 and D-20]
4. Write the six MDX pages from protected-source and claim-ledger records, then
   place four image references at the adjacent proving steps. [VERIFIED: D-01,
   D-06, D-07, D-11]
5. Render, compress, inspect, and validate all 24 WebPs; run desktop/mobile page
   checks through the development server. [VERIFIED: D-12 through D-17]
6. Complete redaction and semantic review, prove zero residue for every run,
   generate `checksums.txt` last, and run Phase 27-specific tests plus TypeScript
   validation. [VERIFIED: D-23, D-24, D-26]

## Phase 28 Boundary

Phase 27 finishes with six source files, 24 final WebPs, complete Phase 27
evidence, exact run cleanup, Phase 27 validators, and unchanged global
publication contracts. [VERIFIED: D-25 and D-26]

Phase 28 owns FastAPI/Django availability promotion, tutorial index copy and
keyword updates, expansion of `npm run validate-tutorials` from nine to 15
pages, static production build, six public-route smokes, 24 image HTTP and
content-type checks, publication audit, and milestone-wide cleanup readback.
[VERIFIED: deferred decisions in `27-CONTEXT.md`; Roadmap Phase 28]

## Primary Sources

### Repository and Retained Evidence

- `27-CONTEXT.md`, `.planning/REQUIREMENTS.md`, `.planning/ROADMAP.md`, and
  `AGENTS.md`. [VERIFIED: repository]
- All nine current tutorial MDX files, `source.config.ts`, `lib/source.ts`,
  tutorial utilities/metadata, detail route/layout, growth data, and
  `scripts/validate-tutorials.mjs`. [VERIFIED: repository]
- Phase 21-26 summaries and verifications, plus sealed Phase 23/25/26 evidence.
  [VERIFIED: repository]
- FastAPI and Django protected public reference repositories and their tagged
  README/source/deployment harnesses. [VERIFIED: local mirrors and public Git]
- Installed Sealos plugin instructions, phase modules, rules, and deployment
  scripts at the current local plugin cache. [VERIFIED: local plugin]

### Official Documentation

- [Django security and Host validation](https://docs.djangoproject.com/en/5.2/topics/security/) [CITED]
- [Django settings reference](https://docs.djangoproject.com/en/5.2/ref/settings/) [CITED]
- [ingress-nginx annotations: custom upstream vhost](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#custom-nginx-upstream-vhost) [CITED]
- [ingress-nginx basic usage](https://kubernetes.github.io/ingress-nginx/user-guide/basic-usage/) [CITED]
- [Google WebP `cwebp` documentation](https://developers.google.com/speed/webp/docs/cwebp) [CITED]
- [Sealos public access and domain workflow](https://sealos.io/docs/guides/app-deploy/add-a-domain) [CITED]

## Confidence Assessment

- **HIGH:** tutorial schema/rendering, current source files, protected tag
  identities, sealed Phase 23/25/26 facts, installed local tool capabilities,
  and current plugin implementation. [VERIFIED: direct repository, Git,
  evidence, image, and CLI inspection]
- **MEDIUM:** official web documentation fetched through official domains and
  the read-only Sealos snapshot, because live product and cluster state can
  change before execution. [CITED: official links; VERIFIED: snapshot date]
- **Execution gate:** public domains, timing, browser surfaces, Host rewrite,
  and cleanup become HIGH only after fresh Phase 27 run records and checksum
  review exist. [VERIFIED: D-18 through D-26]
