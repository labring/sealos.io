# Phase 27: Practice-Backed Tutorial Series - Context

**Gathered:** 2026-07-16
**Status:** Ready for research and planning
**Decision source:** Previously confirmed grill-with-docs decisions, verified
Phase 21-26 artifacts, current public repositories, and the existing tutorial
implementation

<domain>
## Phase Boundary

Phase 27 creates six English tutorial sources, exactly 24 practice-backed
screenshots, and a credential-free evidence package that links every tutorial
claim and image to protected public source or a real local, Sealos, Kubernetes,
HTTP, or browser observation. It also performs fresh run-owned practice needed
to measure beginner deployment duration and to capture public domain evidence.

Phase 27 preserves the tutorial catalog publication gate. Phase 28 promotes
FastAPI and Django in the framework matrix, expands the 15-page validator,
builds the static output, checks public routes and image content types, and
closes the milestone-wide cleanup audit.

</domain>

<decisions>
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

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Scope and Locked Decisions

- `AGENTS.md` - repository language, GSD, execution, response, and scope rules.
- `CONTEXT.md` - canonical tutorial publishing vocabulary.
- `.planning/PROJECT.md` - v1.3 goals, constraints, and publication boundaries.
- `.planning/REQUIREMENTS.md` - CONT-01 through CONT-04, SHOT-01, SHOT-02,
  and OPS-01 acceptance contracts.
- `.planning/ROADMAP.md` - Phase 27 goal and Phase 28 ownership boundary.
- `.planning/STATE.md` - current milestone position and active requirements.
- `.planning/quick/260715-e9k-define-fastapi-and-django-tutorial-expan/260715-e9k-CONTEXT.md`
  - user-confirmed series, source, runtime, evidence, timing, TDD, and cleanup
  decisions.

### Existing Tutorial Template and Runtime

- `content/tutorials/deploy-nextjs-sealos/index.en.mdx` - deploy-stage body,
  frontmatter, CTA, Sealos Skills, and Runtime Truth Pass reference.
- `content/tutorials/nextjs-postgresql-sealos/index.en.mdx` - PostgreSQL-stage
  architecture, resource plan, migration, and read/write reference.
- `content/tutorials/nextjs-production-deployment-sealos/index.en.mdx` -
  production scorecard, domain, logs, rollback, and runbook reference.
- `content/tutorials/deploy-react-sealos/index.en.mdx` and
  `content/tutorials/deploy-nodejs-sealos/index.en.mdx` - current exact
  four-image deploy density.
- `content/tutorials/react-postgresql-sealos/index.en.mdx` and
  `content/tutorials/nodejs-postgresql-sealos/index.en.mdx` - current exact
  four-image PostgreSQL density.
- `content/tutorials/react-production-deployment-sealos/index.en.mdx` and
  `content/tutorials/nodejs-production-deployment-sealos/index.en.mdx` -
  current exact four-image production density.
- `source.config.ts` - tutorial frontmatter schema.
- `lib/source.ts` - Fumadocs tutorial loader and `/tutorials` base URL.
- `lib/utils/tutorial-utils.ts` - English lookup, series sorting, adjacency,
  related links, stages, and keywords.
- `lib/utils/tutorial-metadata.ts` - tutorial SEO and canonical metadata.
- `app/[lang]/(home)/tutorials/[slug]/page.tsx` - MDX rendering, ImageZoom,
  alt-caption behavior, and static params.
- `app/[lang]/(home)/tutorials/[slug]/layout.tsx` - detail hero, CTA, TOC,
  adjacent navigation, related cards, and centered image layout.
- `app/[lang]/(home)/tutorials/tutorial-growth-data.ts` - reserved FastAPI and
  Django slugs and current `coming_next` publication state.
- `scripts/validate-tutorials.mjs` - current nine-page validation contract and
  Phase 28 expansion point.
- `public/images/nextjs-postgresql-sealos/` and
  `public/images/nextjs-production-deployment-sealos/` - canonical dark
  evidence-card visual form.
- `public/images/deploy-react-sealos/`,
  `public/images/react-postgresql-sealos/`,
  `public/images/react-production-deployment-sealos/`,
  `public/images/deploy-nodejs-sealos/`,
  `public/images/nodejs-postgresql-sealos/`, and
  `public/images/nodejs-production-deployment-sealos/` - exact four-image,
  1440x900 WebP precedent.

### Verified FastAPI Stages

- `.planning/phases/21-fastapi-deploy-stage/21-01-SUMMARY.md`
- `.planning/phases/21-fastapi-deploy-stage/21-02-SUMMARY.md`
- `.planning/phases/21-fastapi-deploy-stage/21-03-SUMMARY.md`
- `.planning/phases/21-fastapi-deploy-stage/21-VERIFICATION.md`
- `.planning/phases/22-fastapi-postgresql-stage/22-01-SUMMARY.md`
- `.planning/phases/22-fastapi-postgresql-stage/22-02-SUMMARY.md`
- `.planning/phases/22-fastapi-postgresql-stage/22-03-SUMMARY.md`
- `.planning/phases/22-fastapi-postgresql-stage/22-04-SUMMARY.md`
- `.planning/phases/22-fastapi-postgresql-stage/22-VERIFICATION.md`
- `.planning/phases/23-fastapi-production-stage/23-01-SUMMARY.md`
- `.planning/phases/23-fastapi-production-stage/23-02-SUMMARY.md`
- `.planning/phases/23-fastapi-production-stage/23-03-SUMMARY.md`
- `.planning/phases/23-fastapi-production-stage/23-04-SUMMARY.md`
- `.planning/phases/23-fastapi-production-stage/23-VERIFICATION.md`
- `.planning/phases/23-fastapi-production-stage/evidence/` - sealed immutable
  image, migration, four-state runtime, logs, HTTP, rollback, publication, and
  cleanup records.

### Verified Django Stages

- `.planning/phases/24-django-deploy-stage/24-01-SUMMARY.md`
- `.planning/phases/24-django-deploy-stage/24-02-SUMMARY.md`
- `.planning/phases/24-django-deploy-stage/24-03-SUMMARY.md`
- `.planning/phases/24-django-deploy-stage/24-04-SUMMARY.md`
- `.planning/phases/24-django-deploy-stage/24-05-SUMMARY.md`
- `.planning/phases/24-django-deploy-stage/24-VERIFICATION.md`
- `.planning/phases/25-django-postgresql-stage/25-01-SUMMARY.md`
- `.planning/phases/25-django-postgresql-stage/25-02-SUMMARY.md`
- `.planning/phases/25-django-postgresql-stage/25-03-SUMMARY.md`
- `.planning/phases/25-django-postgresql-stage/25-04-SUMMARY.md`
- `.planning/phases/25-django-postgresql-stage/25-05-SUMMARY.md`
- `.planning/phases/25-django-postgresql-stage/25-VERIFICATION.md`
- `.planning/phases/25-django-postgresql-stage/evidence/` - PostgreSQL package,
  migration, Job, readiness, restart, admin, public replay, and cleanup records.
- `.planning/phases/26-django-production-stage/26-01-SUMMARY.md`
- `.planning/phases/26-django-production-stage/26-02-SUMMARY.md`
- `.planning/phases/26-django-production-stage/26-03-SUMMARY.md`
- `.planning/phases/26-django-production-stage/26-04-SUMMARY.md`
- `.planning/phases/26-django-production-stage/26-VERIFICATION.md`
- `.planning/phases/26-django-production-stage/evidence/` - sealed immutable
  image, collectstatic, migration, four-state runtime, logs, HTTP/admin,
  rollback, publication, and cleanup records.

### Protected Public Reference Applications

- `https://github.com/yangchuansheng/sealos-fastapi-tutorial` - public Tasks
  API repository; `main` and three protected annotated source stages.
- `https://github.com/yangchuansheng/sealos-django-tutorial` - public Task
  Board repository; `main` and three protected annotated source stages.
- `/Users/longnv/bin/repo/sealos-fastapi-tutorial/README.md` - current Stage 3
  reader workflow; use `git show <stage>^{}` for earlier README/source truth.
- `/Users/longnv/bin/repo/sealos-fastapi-tutorial/app/main.py`,
  `/Users/longnv/bin/repo/sealos-fastapi-tutorial/app/database.py`, and
  `/Users/longnv/bin/repo/sealos-fastapi-tutorial/app/models.py` - public HTTP,
  readiness, database, logging, and model behavior.
- `/Users/longnv/bin/repo/sealos-fastapi-tutorial/deploy/application.yaml`,
  `/Users/longnv/bin/repo/sealos-fastapi-tutorial/deploy/migration-job.yaml`,
  and `/Users/longnv/bin/repo/sealos-fastapi-tutorial/scripts/test-production.sh`
  - production workload, migration, rollback, evidence, and cleanup contract.
- `/Users/longnv/bin/repo/sealos-django-tutorial/README.md` - current Stage 3
  reader workflow; use `git show <stage>^{}` for earlier README/source truth.
- `/Users/longnv/bin/repo/sealos-django-tutorial/taskboard/settings.py`,
  `/Users/longnv/bin/repo/sealos-django-tutorial/tasks/views.py`, and
  `/Users/longnv/bin/repo/sealos-django-tutorial/tasks/templates/tasks/board.html`
  - PostgreSQL readiness, Task Board, production host, and browser behavior.
- `/Users/longnv/bin/repo/sealos-django-tutorial/deploy/application.yaml`,
  `/Users/longnv/bin/repo/sealos-django-tutorial/deploy/migration-job.yaml`,
  and `/Users/longnv/bin/repo/sealos-django-tutorial/scripts/test-production.sh`
  - production workload, migration, static, admin, rollback, evidence, and
  cleanup contract.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- The Fumadocs tutorial schema, loader, metadata generator, detail layout,
  ImageZoom caption renderer, series navigation, related cards, and sitemap
  integration already support additional English series through content data.
- `tutorial-growth-data.ts` already generates all six locked FastAPI/Django
  slugs and marks both frameworks `coming_next`; Phase 28 only changes their
  publication status.
- `scripts/validate-tutorials.mjs` already parses frontmatter, series links,
  root-relative images, WebP dimensions, byte budgets, duplicate references,
  expected folders, required terms, and forbidden secrets. Phase 28 expands its
  contract from nine to 15 pages.
- The current exact-four React and Node.js screenshot folders provide a compact
  WebP precedent; the Next.js PostgreSQL/production folders provide the visual
  evidence-card precedent.
- FastAPI and Django reference harnesses already supply run labels, migration
  Jobs, readiness, browser/public HTTP observations, rollback states, evidence
  redaction, checksum generation, and exact cleanup functions that Phase 27 can
  extend externally without changing protected source.

### Established Patterns

- Tutorial discovery is data-driven from Fumadocs content; series equality and
  `seriesOrder` produce previous/next navigation automatically.
- English is the only tutorial detail language. Each new page uses
  `index.en.mdx`.
- Root-relative `/images/<slug>/<asset>.webp` references become centered,
  zoomable images with visible alt captions.
- Beginner deployment, PostgreSQL, and production use distinct body structures
  and CTA contracts while retaining the same Sealos Skills vocabulary.
- Public source stages use protected annotated tags; production Kubernetes
  consumes immutable image digests and runs migration before readiness.
- Practice resources and local collaborators are accepted only with exact
  ownership and zero-residue proof.

### Integration Points

- Six sources connect at `content/tutorials/<slug>/index.en.mdx`.
- Twenty-four assets connect at `public/images/<slug>/*.webp`.
- Phase 27 evidence connects under
  `.planning/phases/27-practice-backed-tutorial-series/evidence/` and maps each
  source claim and screenshot to protected or fresh-run authority.
- The new pages flow through `source.config.ts`, `lib/source.ts`,
  `lib/utils/tutorial-utils.ts`, and the tutorial detail route without a page
  component change.
- Phase 28 connects the completed Phase 27 artifacts to
  `tutorial-growth-data.ts`, tutorial index metadata, the validator contract,
  static export, route smoke tests, and final cleanup acceptance.

</code_context>

<specifics>
## Specific Ideas

- Treat every screenshot as a compact audit artifact: an evidence label,
  reader-facing claim, and the smallest real output needed to prove it.
- Use framework accents while retaining the same visual grammar: FastAPI may
  use teal/green and Django may use green with a restrained secondary blue.
- Combine Django Task Board and native admin evidence in a two-panel browser
  card so the beginner and PostgreSQL pages retain exact four-image density.
- Use the protected source tag as the code boundary and the immutable image
  digest as the production runtime boundary. Present both when a production
  step crosses source and runtime identity.
- Keep the generated Sealos public domain visible because it is part of the
  reproduction path. Redact workspace, credentials, cookies, Secret data, and
  private service endpoints.

</specifics>

<deferred>
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

</deferred>

---

*Phase: 27-practice-backed-tutorial-series*
*Context gathered: 2026-07-16 from confirmed decisions and verified Phase 21-26 evidence*
