# Phase 27: Practice-Backed Tutorial Series - Pattern Map

**Mapped:** 2026-07-16
**Scope:** Six English tutorial drafts, 24 evidence-backed WebP assets, fresh
practice evidence, draft-only validation, and exact cleanup
**Publication boundary:** Phase 27 leaves the nine-page production validator and
FastAPI/Django catalog status unchanged

## Pattern Decision

Phase 27 is a content and evidence phase. The existing Fumadocs schema, loader,
detail route, metadata generator, series navigation, image renderer, and catalog
inventory already accept the six locked slugs. No page, layout, loader, metadata,
or catalog implementation change is needed.

One new, focused evidence-asset coordinator is justified. The production
validator intentionally rejects tutorial directories outside its nine-page
contract, so it cannot accept the six drafts during Phase 27. The new coordinator
must validate only the locked six-page draft bundle, preserve the current
publication boundary, render evidence cards from reviewed records, and remain
separate from `scripts/validate-tutorials.mjs` until Phase 28.

A historical implementation on branch
`codex/fastapi-django-tutorial-milestone` is the closest tooling analog:
`9edd81e:scripts/python-tutorial-assets.mjs` and
`9edd81e:scripts/python-tutorial-assets.test.mjs`. Its exact-set, image-record,
runtime-state, cleanup, token, test-gate, handoff, and read-only validation
patterns are useful. Its fixed run ID, old filenames, 149-closure evidence tree,
153600-byte hard budget, and Phase 25 catalog marker are stale. Do not cherry-pick
or restore that branch. Implement the smaller current contract from D-01 through
D-26.

## Exact Output Map

### Tutorial Sources

| Framework | Stage | Source | Series contract |
|---|---|---|---|
| FastAPI | Deploy | `content/tutorials/deploy-fastapi-sealos/index.en.mdx` | `sealos-skills-fastapi`, beginner, order 1 |
| FastAPI | PostgreSQL | `content/tutorials/fastapi-postgresql-sealos/index.en.mdx` | `sealos-skills-fastapi`, advanced, order 2 |
| FastAPI | Production | `content/tutorials/fastapi-production-deployment-sealos/index.en.mdx` | `sealos-skills-fastapi`, production, order 3 |
| Django | Deploy | `content/tutorials/deploy-django-sealos/index.en.mdx` | `sealos-skills-django`, beginner, order 1 |
| Django | PostgreSQL | `content/tutorials/django-postgresql-sealos/index.en.mdx` | `sealos-skills-django`, advanced, order 2 |
| Django | Production | `content/tutorials/django-production-deployment-sealos/index.en.mdx` | `sealos-skills-django`, production, order 3 |

### Screenshot Assets

| Page | Exact asset path | Evidence class |
|---|---|---|
| `deploy-fastapi-sealos` | `public/images/deploy-fastapi-sealos/local-stage-validation.webp` | Protected tag plus local test/start |
| `deploy-fastapi-sealos` | `public/images/deploy-fastapi-sealos/sealos-analysis-template.webp` | Run-owned analysis and template |
| `deploy-fastapi-sealos` | `public/images/deploy-fastapi-sealos/sealos-deployment-health.webp` | Rollout, domain, and health |
| `deploy-fastapi-sealos` | `public/images/deploy-fastapi-sealos/swagger-tasks-api.webp` | Real Swagger UI and task HTTP behavior |
| `fastapi-postgresql-sealos` | `public/images/fastapi-postgresql-sealos/database-ready-source.webp` | SQLAlchemy, Alembic, env key, revision |
| `fastapi-postgresql-sealos` | `public/images/fastapi-postgresql-sealos/sealos-postgresql-plan.webp` | Generated app/database/Job resource plan |
| `fastapi-postgresql-sealos` | `public/images/fastapi-postgresql-sealos/alembic-migration-complete.webp` | Complete Job and repeat revision 0001 |
| `fastapi-postgresql-sealos` | `public/images/fastapi-postgresql-sealos/persistent-crud-readback.webp` | Cross-process public CRUD persistence |
| `fastapi-production-deployment-sealos` | `public/images/fastapi-production-deployment-sealos/production-state-redacted.webp` | Protected source, digest, state, same-image Job |
| `fastapi-production-deployment-sealos` | `public/images/fastapi-production-deployment-sealos/immutable-rollout-health.webp` | Migration, 2/2 Ready, UID/GID, health |
| `fastapi-production-deployment-sealos` | `public/images/fastapi-production-deployment-sealos/domain-runtime-logs.webp` | Public HTTPS, docs, and release logs |
| `fastapi-production-deployment-sealos` | `public/images/fastapi-production-deployment-sealos/rollback-recovery.webp` | A-B-A-B revisions and Task continuity |
| `deploy-django-sealos` | `public/images/deploy-django-sealos/local-stage-validation.webp` | Protected tag, SQLite migration, tests, start |
| `deploy-django-sealos` | `public/images/deploy-django-sealos/sealos-analysis-template.webp` | Run-owned analysis and template |
| `deploy-django-sealos` | `public/images/deploy-django-sealos/sealos-deployment-health.webp` | Host rewrite, public domain, and health |
| `deploy-django-sealos` | `public/images/deploy-django-sealos/task-board-admin.webp` | Real board flow and native admin login |
| `django-postgresql-sealos` | `public/images/django-postgresql-sealos/database-ready-source.webp` | psycopg settings, env key, migration 0001 |
| `django-postgresql-sealos` | `public/images/django-postgresql-sealos/sealos-postgresql-plan.webp` | Generated app/database/Job resource plan |
| `django-postgresql-sealos` | `public/images/django-postgresql-sealos/django-migration-complete.webp` | Complete Job and repeat current migration |
| `django-postgresql-sealos` | `public/images/django-postgresql-sealos/persistent-board-admin.webp` | Restarted board plus authenticated admin readback |
| `django-production-deployment-sealos` | `public/images/django-production-deployment-sealos/production-state-redacted.webp` | Protected source, digest, state, same-image Job |
| `django-production-deployment-sealos` | `public/images/django-production-deployment-sealos/immutable-rollout-health.webp` | Migration, 2/2 Ready, Gunicorn, health |
| `django-production-deployment-sealos` | `public/images/django-production-deployment-sealos/domain-static-logs.webp` | HTTPS, board, hashed CSS, and logs |
| `django-production-deployment-sealos` | `public/images/django-production-deployment-sealos/rollback-recovery.webp` | A-B-A-B revisions, board, and admin continuity |

The exact total is 30 public deliverables: six MDX sources and 24 WebP files.
Each page owns one image directory, four unique files, and four one-time Markdown
references.

## File Classification

| New or modified file group | Role | Data flow | Closest analog | Match |
|---|---|---|---|---|
| Six `content/tutorials/<slug>/index.en.mdx` files | content document | source/evidence to rendered request-response page | Matching Next.js stage plus exact-four React/Node.js page | exact |
| Twenty-four `public/images/<slug>/*.webp` files | static visual asset | reviewed evidence to deterministic transform | Next.js evidence cards plus React/Node.js exact-four folders | exact |
| `scripts/python-tutorial-assets.test.mjs` | behavioral test | fixture file I/O and transform | historical `9edd81e` test plus current Node test conventions | role match |
| `scripts/python-tutorial-assets.mjs` | utility/CLI | JSONL/file I/O, validation, HTML composition, image transform | historical `9edd81e` coordinator and `scripts/validate-tutorials.mjs` | role match |
| `.planning/phases/27-practice-backed-tutorial-series/evidence/README.md` | schema documentation | evidence contract to replay | Phase 25 evidence README | exact |
| Evidence JSONL/text files | evidence ledger | append observations, then read-only verification | Phase 25 and Phase 23/26 evidence packages | exact |
| Evidence `checksums.txt` | integrity manifest | reviewed bytes to SHA-256 seal | Phase 23, 25, and 26 checksum manifests | exact |

## Tutorial Source Patterns

### Frontmatter

Use the schema at `source.config.ts:72-90`. Every page includes all of these
fields even where the Zod schema marks a field optional:

- `title`, `description`, `date`, `updated`
- `stage`, `framework`, `series`, `seriesOrder`
- `estimatedReadingTime`, `primaryKeyword`, `targetKeywords`
- `tags`, `authors`, `relatedTutorials`, `cta`, `faq`, `howTo`

The best exact-four examples are:

- Deploy: `content/tutorials/deploy-react-sealos/index.en.mdx:1-52` and
  `content/tutorials/deploy-nodejs-sealos/index.en.mdx:1-52`.
- PostgreSQL: `content/tutorials/nodejs-postgresql-sealos/index.en.mdx:1-50`.
- Production:
  `content/tutorials/react-production-deployment-sealos/index.en.mdx:1-50`
  and `content/tutorials/nodejs-production-deployment-sealos/index.en.mdx:1-50`.

Use `FastAPI` and `Django` as framework values, with lowercase framework tags.
Related tutorials stay framework-local and in stage order:

| Stage | `relatedTutorials` order |
|---|---|
| Deploy | PostgreSQL, production |
| PostgreSQL | deploy, production |
| Production | deploy, PostgreSQL |

Deploy CTA is exactly `Start free on Sealos` to `https://os.sealos.io`.
PostgreSQL and production CTA is exactly `Open Sealos Skills` to
`/sealos-skills`.

Beginner titles are computed from `evidence/timing.jsonl`. Use `in 5 Minutes`
in both titles only when both accepted clean attempts are at most 300000 ms.
Otherwise use evergreen `How to Deploy FastAPI on Sealos` and
`How to Deploy Django on Sealos` titles. Each beginner body reports its
observed duration and the exact clock boundary.

### Body Information Architecture

Copy stage structure, then replace every framework fact with protected-source
or evidence truth:

- Deploy follows `deploy-nextjs-sealos`: prerequisites, native plugin install,
  source readiness, deploy request, assessment, generated template, runtime
  configuration, deployment, Runtime Truth Pass, `.sealos/` artifacts,
  troubleshooting, and next step.
- PostgreSQL follows `nextjs-postgresql-sealos` for the conceptual sequence and
  `nodejs-postgresql-sealos` for exact-four image density: key takeaways,
  prerequisites, architecture, source, deploy request, plan, production inputs,
  migration, readiness, public read/write, restart persistence,
  troubleshooting, and next step.
- Production follows `nextjs-production-deployment-sealos` for the complete
  checklist and `react-production-deployment-sealos` or
  `nodejs-production-deployment-sealos` for exact-four image density: audience,
  plugin setup, launch model, scorecard, image, state, environment, migration,
  security, domain, logs, static assets for Django, monitoring, backup, update,
  rollback, recovery, runbook, failures, and final checklist.

Keep current plugin vocabulary from the Next.js sources: native Codex and
Claude Code installs, `$sealos`, `/sealos`, Codex App plugin selection,
`Runtime Truth Pass`, `DEPLOY`, `UPDATE`, `.sealos/analysis.json`,
`.sealos/template/index.yaml`, and `.sealos/state.json`.

### Image Syntax and Placement

Use plain root-relative Markdown immediately after the reader task it proves:

```markdown
![Descriptive observed result](/images/<tutorial-slug>/<asset>.webp)
```

`app/[lang]/(home)/tutorials/[slug]/page.tsx:31-40` maps the image to
`ImageZoom` and repeats `alt` as the visible caption. The alt text therefore
names an observed result and carries useful meaning at the embedded mobile
size. Avoid generic `screenshot`, `image`, or `terminal` captions.

No MDX imports or custom image components are needed. The loader at
`lib/source.ts:35-39`, English-only lookup at
`lib/utils/tutorial-utils.ts:34-65`, series adjacency at
`lib/utils/tutorial-utils.ts:91-105`, and related-link resolution at
`lib/utils/tutorial-utils.ts:107-116` already wire the pages.

### FAQ and HowTo

Write FAQ and HowTo after the body is evidence-complete. FAQ answers summarize
facts already supported by the matching tag or evidence record. HowTo steps
mirror the main reader sequence and use the same commands and placeholders.
The detail layout converts these structures into FAQ and HowTo structured data
at `app/[lang]/(home)/tutorials/[slug]/layout.tsx:87-108`.

## Claim-to-Source Map

| Page | Protected source authority | Retained authority | Fresh Phase 27 authority |
|---|---|---|---|
| FastAPI deploy | Stage 1 README, `app/main.py`, lock, tests | Phase 21 verification | local start, analysis/template, public domain, Swagger/task browser |
| FastAPI PostgreSQL | Stage 2 README, `app/database.py`, `app/models.py`, Alembic 0001, Job manifests | Phase 22 and Phase 25 FastAPI replay | generated resource plan, current migration Job, public persistence |
| FastAPI production | Stage 3 README, Dockerfile, application and Job manifests | sealed Phase 23 workflow/images/migration/runtime/log/HTTP/rollback | current public domain, HTTPS, docs, current release log presentation |
| Django deploy | Stage 1 README, settings, views, board template, admin, migration | Phase 24 verification | local SQLite flow, analysis/template, host rewrite, board/admin browser |
| Django PostgreSQL | Stage 2 README, PostgreSQL settings, health view, migration and Job manifests | sealed Phase 25 package/migration/Job/HTTP/admin evidence | generated resource plan, current Job, public restart/admin presentation |
| Django production | Stage 3 README, Dockerfile, settings, WSGI, application and Job manifests | sealed Phase 26 workflow/images/migration/runtime/log/static/HTTP/rollback | current domain, HTTPS, board, hashed CSS, current log presentation |

Create one `claims.jsonl` record before drafting each material assertion. At
minimum, each record contains `claim_id`, `page`, `section`, `claim`,
`authority_kind`, `authority_path`, `authority_record_id`, `source_tag`, and
`reviewed=true`. Commands use protected-tag README text or a minimal public
parameterization such as `<your-sealos-url>`.

## Draft-Only Coordinator

### Minimal Files

Create only:

- `scripts/python-tutorial-assets.test.mjs`
- `scripts/python-tutorial-assets.mjs`

Use built-in `node:test`, `node:assert/strict`, `node:child_process`,
`node:crypto`, `node:fs`, `node:http`, and `node:path`, plus the existing
`js-yaml` dependency for structured frontmatter. Call `agent-browser`, `cwebp`,
`ffprobe`, FFmpeg, and Tesseract through literal argument arrays for capture,
encoding, metadata/pixel inspection, decoding, and OCR. The coordinator may
start only a loopback Node render server and must close only its exact named
browser session. `sharp`, ImageMagick, Playwright, new dependencies, and new
package scripts are outside this contract.

The coordinator should export these focused interfaces:

- `SCREENSHOT_CONTRACT`: the exact 24-record map above.
- `validateDraftBundle({ repoRoot, evidenceRoot, phaseBase })`: returns sorted
  structured issues and counts without mutating inputs.
- `renderEvidenceCard({ spec, evidence, browserCapture, outputPath })`: writes
  one exact 1440x900 WebP only after its evidence joins and redactions pass.
- `validateEvidenceCard({ path, record })`: checks signature, dimensions, byte
  limit, pixels, metadata, digest, and manifest agreement.
- CLI `--check-drafts`, `--render <record-id>`, and `--check-bundle` modes with
  stable exit codes 0 for pass, 1 for semantic failure, 2 for usage, and 3 for
  internal failure.

### TDD Pair

Use one dedicated TDD plan for the coordinator as one cohesive feature:

1. RED commit: `test(27-01): specify Python tutorial asset coordinator`
   changes only `scripts/python-tutorial-assets.test.mjs`. The first required
   failure is Node `ERR_MODULE_NOT_FOUND` for
   `scripts/python-tutorial-assets.mjs` after fixture setup succeeds.
2. GREEN commit: `feat(27-01): add Python tutorial asset coordinator`
   changes only `scripts/python-tutorial-assets.mjs`. It makes the same focused
   command pass without changing the test.

The test fixture must cover these stable semantic signatures after GREEN:

- `DRAFT_PAGE_SET_MISMATCH`
- `DRAFT_FRONTMATTER_MISMATCH`
- `DRAFT_SERIES_LINK_MISMATCH`
- `DRAFT_SOURCE_TAG_MISMATCH`
- `DRAFT_IMAGE_MATRIX_MISMATCH`
- `DRAFT_IMAGE_REFERENCE_MISMATCH`
- `EVIDENCE_JOIN_MISSING`
- `EVIDENCE_SECRET_MATCH`
- `IMAGE_FORMAT_MISMATCH`
- `IMAGE_DIMENSION_MISMATCH`
- `IMAGE_SIZE_LIMIT`
- `IMAGE_BLANK_CANVAS`
- `IMAGE_DIGEST_MISMATCH`
- `CHECKSUM_ORDER_INVALID`
- `PUBLICATION_BOUNDARY_CHANGED`

The boundary test reads the Phase 27 base versions of
`tutorial-growth-data.ts`, `scripts/validate-tutorials.mjs`, and the tutorial
index metadata. It asserts that FastAPI and Django remain `coming_next`,
`AVAILABLE_FRAMEWORK_KEYS` remains exactly Next.js/React/Node.js, and the
production validator remains a nine-contract validator. Phase 27 does not make
`npm run validate-tutorials` pass after the six draft directories exist; that
failure is the intentional publication gate owned by Phase 28.

## Evidence Package Pattern

Use this compact exact set under
`.planning/phases/27-practice-backed-tutorial-series/evidence/`:

| File | Required content |
|---|---|
| `README.md` | Schema, authority order, replay, redaction, and checksum-last rules |
| `source-identities.jsonl` | Six protected tag URLs, tag objects, peeled commits, messages, and ruleset readback |
| `timing.jsonl` | Every beginner attempt with accepted flag, UTC start/end, monotonic elapsed ms, run ID, source tag, and redacted workspace context |
| `commands.txt` | Curated reader and operator commands with public placeholders |
| `claims.jsonl` | Page/section/claim to protected source or evidence record joins |
| `practice-events.jsonl` | Analysis, template, resource, Job, readiness, HTTP, browser, log, rollback, and recovery observations |
| `screenshots.jsonl` | Exact 24 records and final image metadata/provenance |
| `cleanup.jsonl` | One terminal record for every accepted and failed attempt |
| `review.txt` | Semantic, visual, redaction, credential, desktop, and mobile review result |
| `checksums.txt` | Sorted SHA-256 entries for the previous nine files, generated last |

Every `screenshots.jsonl` record includes:

- `record_id`, `page`, `filename`, `adjacent_step`, `framework`, `stage`
- `source_tag`, `source_artifact`, `source_record_id`, `evidence_ids`
- `capture_session`, `capture_sha256`, `redactions`
- `layout`, `required_tokens`, `forbidden_tokens`
- `width`, `height`, `bytes`, `sha256`, `format`
- `nonblank`, `metadata_stripped`, `desktop_review`, `mobile_review`

Every cleanup terminal records counts for Instance, App, Deployment, StatefulSet, ReplicaSet,
Pod, Service, Ingress, Job, PostgreSQL cluster, PVC, Secret, ConfigMap,
port-forward, local server, browser session, `.sealos/` clone, render scratch,
image scratch, ownership ledger, and temporary credentials. Counts are scoped
to one exact run ID. A retry always receives a new run ID and its own timing and
cleanup records.

Generate `checksums.txt` only after all semantic and credential scans pass and
`review.txt` records acceptance. Verify it immediately. Any later evidence edit
invalidates the seal and requires the full review sequence again.

## Fresh Practice Lifecycles

### Shared Ownership and Timing

For each framework and attempt:

1. Create a clean temporary protected-tag clone, mode-0700 scratch root,
   mode-0600 state/credential files, unique browser session, and exact run ID.
2. Complete local prerequisites, Sealos authentication, workspace selection,
   dependency installation, tests, and local startup before timing.
3. Record monotonic and UTC start immediately before issuing the Sealos deploy
   request.
4. Record end immediately after the generated public HTTPS `/health` returns
   the exact successful payload.
5. Continue analysis/template, application behavior, PostgreSQL, migration,
   restart, production, logs, rollback, recovery, and screenshot observations.
6. Freeze curated records, perform redaction review, then clean every owned
   resource and path.
7. Run an exact-label and ownership-ledger read-only audit before accepting the
   attempt.

The protected Stage 1 tags contain no Dockerfile and this machine has no usable
Docker path. Generate the deployable source artifact through the installed
plugin rules: create a deterministic protected-tag archive in a run-owned
bootstrap ConfigMap, unpack it in an initContainer based on the pinned Python
3.12 slim digest, install the tracked `requirements.txt` into a one-GiB
StatefulSet `volumeClaimTemplates` volume, and run the tracked FastAPI or Django
entry command from that volume. The same generated Template owns the bootstrap
ConfigMap, one-replica StatefulSet, Service, standard Sealos HTTPS Ingress, and
App resource. The PVC is run-owned and deleted after evidence capture. Django adds
`nginx.ingress.kubernetes.io/upstream-vhost: localhost`; a pinned run-owned
Nginx sidecar with a ConfigMap proxy configuration is the bounded fallback when
the live controller rejects that annotation. Dry-run and deploy use the local
plugin `deploy-template.mjs`, followed by real Kubernetes Runtime Truth Pass
reads. No public reference source receives a deployment artifact.

### FastAPI Practice

- Stage 1: clone `stage-1-deploy`, `uv sync --locked`, run 12 cases, start
  Uvicorn on an owned port, prove `/health`, `/docs`, and `/tasks`, then issue
  the measured deploy request.
- Capture real `.sealos/analysis.json` and `.sealos/template/index.yaml`
  summaries from the run-owned clone before public rollout acceptance.
- Capture the generated public HTTPS domain, `/health` 200, Swagger UI, task
  create/list, and runtime resource status.
- Stage 2: use the protected PostgreSQL source, generated PostgreSQL resource,
  Secret-backed URL, migration Job, schema-aware health, and create/restart/read
  proof. Preserve only curated credential-free fields.
- Stage 3: resolve the protected source and immutable digest, migrate before a
  two-replica rollout, capture UID/GID and logs, then execute and observe
  baseline, final, baseline rollback, and explicit final recovery. Sealed Phase
  23 records remain the authority for immutable historical facts; the fresh run
  supplies current product/domain/browser presentation.

### Django Practice

- Stage 1: clone `stage-1-deploy`, `uv sync --locked`, migrate SQLite, run five
  cases, start `runserver` on an owned port, prove health/board/admin, then issue
  the measured deploy request.
- Capture real analysis/template summaries, the generated domain, Task Board
  creation/listing, native admin login, and the run-owned public host-rewrite
  edge.
- Preserve the frozen application's exact `DJANGO_ALLOWED_HOSTS=localhost`
  contract. Verify a run-owned edge or Ingress path that rewrites upstream Host
  to `localhost`; record its source and live behavior before using it.
- Stage 2: use the protected psycopg source, repeat `tasks.0001_initial` Job,
  schema-aware health, process A write, process B read, and authenticated native
  admin readback. Admin credentials and CSRF/cookies stay in temporary mode-0600
  paths.
- Stage 3: resolve the protected source and immutable digest, run same-image
  migration before two Gunicorn replicas, capture hashed WhiteNoise CSS and
  current logs, then observe A-B-A-B board and admin continuity. Sealed Phase 26
  records remain the authority for immutable historical facts.

Parallel FastAPI and Django practice is safe only with distinct run IDs,
resource prefixes, local ports, browser sessions, scratch roots, and ownership
ledgers. Serialize them if the selected Sealos workspace or plugin session has a
single-active-run constraint.

## Screenshot Pipeline

Use this exact order for every image:

1. **Spec:** Select one locked screenshot record and its adjacent MDX step.
   Join it to protected source and one or more reviewed evidence records.
2. **Redaction:** Replace workspace names, namespace, credentials, cookies,
   Secret values, private endpoints, admin identities, and tokens with explicit
   labels. Preserve public tags, GitHub URLs, image digests, migration revisions,
   HTTP statuses, public routes, and public Sealos domains.
3. **HTML:** Generate a self-contained local evidence-card page from escaped
   values. Use a 1440x900 fixed canvas, dark navy/black surface, thin browser or
   terminal chrome, small evidence eyebrow, concise white heading, and a large
   readable panel. FastAPI uses restrained teal; Django uses green with a muted
   blue secondary accent.
4. **Real surface:** Browser cards embed a real sanitized application or Sealos
   capture. Terminal panels contain curated command/output lines copied from the
   joined evidence. Two-panel cards combine only observations from the same
   accepted run or explicitly identified sealed record.
5. **Render:** Serve the mode-0700 HTML scratch on a loopback owned port, open it
   in a uniquely named browser session at 1440x900, wait for fonts and images,
   and capture a PNG. Close the session and stop the server in a trap.
6. **Compress:** Encode WebP with metadata stripped. Try descending quality only
   until the image is strictly below 200000 bytes; target 150000 bytes or less
   when critical text remains readable. Preserve exactly 1440x900.
7. **Machine checks:** Verify RIFF/WEBP signature, exact dimensions, byte size,
   nonblank pixel variance, expected accent/background pixels, no transparent
   blank canvas, stripped metadata, one output path, and SHA-256.
8. **Semantic checks:** Compare visible commands, statuses, names, digest
   prefixes, migration revisions, and URLs against joined evidence. Scan OCR or
   rendered text plus source specs for credential patterns.
9. **Page checks:** Preview each draft page directly at desktop and mobile
   widths. Confirm no overlap or overflow, caption readability, correct adjacent
   placement, and useful ImageZoom inspection for dense terminal detail.
10. **Provenance:** Update `screenshots.jsonl` only after visual and semantic
    review. Remove raw captures, HTML, local server logs, and image scratch after
    their hashes and capture session identities are retained.

The canonical visual analogs are
`public/images/nextjs-postgresql-sealos/migration-step-complete.webp`,
`public/images/nextjs-production-deployment-sealos/sealos-runtime-logs.webp`,
`public/images/deploy-react-sealos/react-readiness-assessment.webp`, and
`public/images/nodejs-production-deployment-sealos/nodejs-rollback-readiness.webp`.
They establish the dark evidence-card grammar, while the new cards must use the
real FastAPI/Django records named in D-11.

## Phase 27 Publication Boundary

Treat these files as read-only byte boundaries during implementation:

- `app/[lang]/(home)/tutorials/tutorial-growth-data.ts`
- `scripts/validate-tutorials.mjs`
- `app/[lang]/(home)/tutorials/page.tsx`
- `source.config.ts`
- `lib/source.ts`
- `lib/utils/tutorial-utils.ts`
- `lib/utils/tutorial-metadata.ts`
- `app/[lang]/(home)/tutorials/[slug]/page.tsx`
- `app/[lang]/(home)/tutorials/[slug]/layout.tsx`

The six new content directories make the current production validator report
extra directories. This expected failure proves the release remains closed.
Phase 27 acceptance uses the draft coordinator and direct draft previews.
Phase 28 owns FastAPI/Django availability, index copy and keywords, 15-page
validator expansion, static build, route and image HTTP checks, and the
milestone-wide cleanup audit.

## Recommended Plans and Waves

Use six dependency-ordered plans across five waves:

| Plan | Wave | Depends on | Files and work | Acceptance |
|---|---:|---|---|---|
| `27-01` | 1 | none | TDD the two-file Python tutorial asset coordinator with fixture-only tests | Exact RED/GREEN scope, stable issue codes, read-only checks, publication boundary intact |
| `27-02` | 2 | `27-01` | FastAPI fresh practice and framework-owned evidence records | Accepted timing attempt, all three stages observed, 12 screenshot records sourceable, zero owned residue |
| `27-03` | 2 | `27-01` | Django fresh practice and framework-owned evidence records | Accepted timing attempt, host rewrite verified, all three stages observed, 12 screenshot records sourceable, zero owned residue |
| `27-04` | 3 | `27-02`, `27-03` | Two tasks author FastAPI and Django series in stage order, three MDX files per task | Six complete pages, title gate computed, exact frontmatter/links/CTA, four image refs per page, all claims joined |
| `27-05` | 4 | `27-04` | Batch-generate the 24 locked outputs from reviewed specs, then machine and page review | 24 unique nonblank 1440x900 WebP files below 200000 bytes with reviewed provenance |
| `27-06` | 5 | `27-05` | Final draft gate, source/evidence/asset review, cleanup replay, and checksum-last seal | All D-01 through D-26 checks pass, nine-page boundary unchanged, evidence checksums pass, worktree inventory exact |

The 24 images are deterministic batch outputs from one renderer and one locked
manifest. Keep their exact paths in plan frontmatter even though the renderer
creates them in one bounded command. Manual per-image source editing would
exceed a plan's context and makes provenance harder to audit.

## Anti-Patterns

- Restoring the historical 17,000-line evidence fixture or its old 24 filenames.
- Modifying the production validator, catalog availability, index metadata, or
  static publication checks in Phase 27.
- Treating the expected nine-page validator failure as a defect during draft
  creation.
- Writing `in 5 Minutes` before both accepted timing records pass 300000 ms.
- Copying generic Next.js, React, or Node.js claims into Python tutorials without
  a protected Python source or retained evidence join.
- Fabricating Sealos UI, terminal output, public domains, resource status,
  migration state, browser state, logs, rollback transitions, or admin readback.
- Using a final evidence card as the sole authority for its own claim.
- Mixing observations from unrelated runs without identifying each source.
- Retaining raw database URLs, namespace/workspace names, Secret data, cookies,
  CSRF values, admin credentials, browser profiles, or private endpoints.
- Reusing one screenshot file or reference across pages.
- Rendering before redaction and evidence-join validation.
- Compressing by resizing the canvas or making critical text unreadable.
- Generating checksums before semantic and credential review.
- Editing sealed Phase 23, 25, or 26 evidence or either protected reference
  repository/tag.
- Broad cleanup by framework prefix. Cleanup uses exact run labels, exact names,
  and a validated ownership ledger.
- Reusing a run ID after a failed attempt.
- Keeping image scratch, HTML render files, local servers, browser sessions, or
  generated `.sealos/` state after accepted capture.
- Adding cross-framework related links. Each series remains framework-local.

## Final Inventory Algorithm

Record `PHASE27_BASE=$(git rev-parse HEAD)` before the first implementation
commit and preserve it in the evidence README. At closeout:

1. Build the expected site-file set from two coordinator files, the six exact
   MDX paths, and the 24 exact asset paths in this map.
2. Compare that sorted set with the non-planning paths from
   `git diff --name-only "$PHASE27_BASE"...HEAD`.
3. Compare each screenshot directory against its exact four-name allowlist and
   require 24 unique MDX references and 24 unique output digests.
4. Require zero diff from `PHASE27_BASE` for every publication-boundary file.
5. Verify the RED commit changes only the coordinator test and the direct GREEN
   changes only the coordinator implementation. Replay the RED failure and
   GREEN pass from isolated committed trees.
6. Compare later commit scopes to their plan-owned MDX, evidence, and asset
   allowlists. Generated assets may appear together in one commit only after
   their 24 manifest records pass.
7. Run the coordinator's complete draft bundle check, evidence credential scan,
   image metadata/pixel checks, direct desktop/mobile previews, and exact cleanup
   audit.
8. Write and verify the sorted checksum manifest last. Re-run it after the final
   commit and require zero listed-file drift.
9. Require `git status --porcelain --untracked-files=all` to be empty and all
   target reference repositories to remain clean at their protected Stage 3
   source.

## Shared Patterns

### Error Reporting

Return sorted issue objects with stable codes, path, record ID, and concise
message. Emit one line per issue and a deterministic final count. This follows
the historical coordinator and makes failing fixtures precise.

### Read-Only Validation

Snapshot input paths and SHA-256 values before and after `--check-drafts` and
`--check-bundle`. A successful validation must preserve every byte and directory
entry. Rendering is the only mutating mode and accepts one exact output record.

### Security

All external values cross an untrusted evidence boundary. Parse JSON/JSONL and
YAML structurally, escape HTML, pass subprocess arguments as arrays, reject path
escape, bind local render servers to loopback, use named browser sessions, keep
scratch mode 0700, keep state mode 0600, and fail closed on credential patterns.

### Cleanup

Every run records ownership before mutation, installs traps before starting a
process, verifies process identity before signaling, closes only its named
browser session, deletes only exact labeled resources and ledger paths, and ends
with a separate read-only zero-state query.

## No New Runtime Analog Needed

No application component, API route, loader, layout, metadata helper, catalog
function, or schema change belongs to Phase 27. The existing tutorial runtime is
already wired; the new work is content, evidence, deterministic asset generation,
and draft-only acceptance.
