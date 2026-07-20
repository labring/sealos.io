# Phase 26: Django Production Stage - Context

**Gathered:** 2026-07-16
**Status:** Ready for research and planning
**Source:** Confirmed milestone decisions plus verified Phase 23 and Phase 25 contracts

<domain>
## Phase Boundary

Evolve the protected Django PostgreSQL Stage 2 source into a reproducible
production release. This phase ends when the public repository contains a
locked Django 5.2 LTS image served by Gunicorn and WhiteNoise, two immutable
production image digests pass migration-first Sealos rollout, rollback, and
recovery against one PostgreSQL database, and protected annotated
`stage-3-production` resolves to public `main` while Stages 1 and 2 remain
exact.

Phase 26 owns the Reference Application source, publisher, container,
production manifests, live runtime evidence, public Stage 3 identity, and
run-scoped cleanup. Phase 27 owns tutorial prose, duration measurement, Sealos
Skills conversion, domains, and screenshots. Phase 28 owns catalog publication,
static site validation, and the milestone-wide residue audit.

</domain>

<decisions>
## Implementation Decisions

### Locked Django Runtime Graph

- **D-01:** Preserve Django 5.2 LTS, psycopg 3, Python `>=3.12,<3.13`, the
  accepted `uv.lock`, and the exact runtime-only `requirements.txt` export.
  Add only current compatible Gunicorn and WhiteNoise patch releases after
  primary-source identity and compatibility research.
- Keep `tasks.0001_initial`, the `Task` model, public form, routes, templates,
  administration, PostgreSQL URL parser, and schema-aware `/health` response
  bodies unchanged.
- Every local, CI, image, and public-clone gate must run `uv lock --check` and
  reproduce `requirements.txt` exactly from the committed lock.

### Build-Time Static Asset Contract

- **D-02:** Use a pinned official Python 3.12 slim-bookworm multi-stage image
  and the accepted uv toolchain. Research must re-resolve every base and Action
  digest immediately before implementation.
- Configure WhiteNoise directly after Django `SecurityMiddleware`, set an
  absolute `/static/` URL, a fixed image-local `STATIC_ROOT`, and compressed
  manifest static storage.
- Run `python manage.py collectstatic --noinput` during the image build. The
  build must fail on collection or manifest errors, and the runtime image
  receives the collected output through an allowlisted copy. Runtime startup
  performs zero static collection and requires zero writable static volume.
- A build-only placeholder may satisfy Django's secret-key import while
  collecting public assets. Production startup requires the runtime Secret.
  The build-only value carries no runtime authority and stays outside retained
  evidence.
- Acceptance must resolve the hashed Task Board stylesheet from the rendered
  page, receive HTTP 200 and CSS content from WhiteNoise, and verify immutable
  cache behavior. The collected manifest and asset remain inspectable inside
  the image.

### Production Settings, Process, and Security

- **D-03:** Production source runs with `DEBUG=False`, an explicit
  `DJANGO_SECRET_KEY`, explicit allowed hosts, the existing `DATABASE_URL`, and
  stable stdout/stderr logging. Secrets enter through a run-owned Kubernetes
  Secret and never through committed source, rendered evidence, or command
  output.
- Use exact allowed hosts for the Service acceptance path. The readiness probe
  sends a deterministic allowed Host header, preserving strict host validation
  without a wildcard.
- **D-04:** Run Gunicorn WSGI with
  `taskboard.wsgi:application`, bind `0.0.0.0:8000`, and configure exactly one
  synchronous worker per container. Each accepted Pod contains one Gunicorn
  master and one WSGI worker; Kubernetes provides horizontal scaling through
  two replicas.
- Run the final image as fixed UID/GID `10001:10001`. The Pod uses
  `runAsNonRoot`, `RuntimeDefault` seccomp, disabled privilege escalation,
  dropped Linux capabilities, a read-only root filesystem, and a bounded
  memory-backed `/tmp` volume. Gunicorn worker temporary state uses `/tmp`.
- Use `/health` exclusively as the database- and schema-aware readiness probe.
  Database outages remove Pods from Service endpoints while their processes
  remain available for logs and recovery.
- **D-05:** Emit one stable startup identity record per WSGI worker containing
  the baked source release and expected immutable image reference. Runtime
  evidence correlates the Deployment digest, Pod image ID, source environment,
  Gunicorn topology, and startup record.

### Migration-First Workload Contract

- **D-06:** Commit parameterized Kubernetes Deployment and Service contracts
  with two replicas, rolling update `maxUnavailable: 0` and `maxSurge: 1`,
  bounded resources, revision history sufficient for rollback, port 8000,
  `/health` readiness, the full restricted security context, immutable image
  input, and a run-owned Secret reference.
- The Secret contract exposes exactly `DATABASE_URL` from key `url` and
  `DJANGO_SECRET_KEY` from a dedicated key. Harness-generated values remain in
  process environment or mode-0600 temporary state and are excluded from
  evidence.
- Evolve the accepted production migration Job in place. For each image
  candidate, run `python manage.py migrate --noinput` from the same immutable
  digest and database Secret used by the following Deployment, wait for
  `Complete=True`, verify `[X] 0001_initial`, then accept two-replica readiness.
- Keep the source-based Stage 2 migration adapter as an immutable historical
  validation surface. Production acceptance executes the application-image
  Job.
- Strict rendering accepts one allowlisted token vocabulary, rejects unresolved
  tokens, writes mode-0600 temporary manifests, and completes server-side
  validation before live creation.

### Public Runtime and Browser Acceptance

- **D-07:** Run the complete gate against a dedicated run-labeled PostgreSQL 17
  service in the authenticated Sealos namespace. One exact run ID owns the
  database, Secret, migration Jobs, Deployment, ReplicaSets, Pods, Service,
  port-forwards, browser session, state, renders, registry configs, and clones.
- At every accepted image state, verify two Ready Pods, exact image IDs,
  UID/GID, one Gunicorn master plus one worker, port 8000, read-only root,
  writable bounded `/tmp`, effective security policy, source/image startup
  logs, `/health`, the rendered board, the hashed CSS asset, and the
  administration login surface.
- Create one persistent Task through the public CSRF form under the baseline
  image. Read the same Task through the board and authenticated native Django
  administration after final rollout, rollback, and recovery. The PostgreSQL
  record and administration identity provide the continuity witness.
- Refresh the owned Service port-forward after each rollout so HTTP acceptance
  follows the active Pods.

### Immutable Image Publication

- **D-08:** Add the repository-owned minimal GitHub Actions publisher because
  the Django repository currently has no image workflow and the local host has
  no accepted daemon-backed builder. Follow the verified Phase 23 shape:
  exact-source checkout, clean PostgreSQL test gate, build-time collectstatic,
  pinned trusted Actions, `contents: read`, `packages: write`, linux/amd64, and
  anonymous GHCR readback.
- Publish exactly one `sha-<40-character-source-commit>` tag for each candidate
  and deploy only
  `ghcr.io/yangchuansheng/sealos-django-tutorial@sha256:<digest>`. Keep mutable
  branch, stage, date, short-SHA, `main`, and `latest` image tags outside the
  publisher contract.
- Retain two production-capable releases: Image A from the first minimal
  production GREEN descended from accepted Stage 2, and Image B from the final
  frozen Stage 3 source. Both images use migration `0001` and the same
  PostgreSQL data contract.
- Require public package visibility, repository linkage, isolated anonymous
  digest/config/manifest resolution, linux/amd64 identity, OCI source and
  revision equality, and workflow source/target equality before Sealos
  mutation.

### Source and Image Rollback

- **D-09:** Preserve the source boundary and runtime rollback as two linked
  proofs. Fresh public Stage 2 replay proves the exact protected pre-production
  source. Image A is the first production-capable child of that boundary and
  supplies the executable rollback target. Image B supplies the final Stage 3
  target.
- On one migrated PostgreSQL database, execute this exact state sequence:
  Image A migration and baseline rollout, Image B migration and final rollout,
  `kubectl rollout undo` to Image A, and explicit Image B recovery. Verify the
  same Task and administration readback through all four states.
- Update image digest and source-release environment as one Pod-template tuple.
  Both images retain schema `0001`, so rollback changes the application tuple
  while PostgreSQL data remains intact.

### Protected Stage 3 Publication

- **D-10:** Freeze the complete reader source before final image acceptance.
  Public `main` must equal that final commit. Publish protected annotated
  `stage-3-production` with exact message `Django production stage` only after
  live rollback/recovery and clean public replay pass.
- Preserve Stage 1 direct object
  `0d9254d37914976898039ff3c55f94399aa1d7c0`, peeled commit
  `ca115bf21b599c14e667b336bd78e3c587c24208`, and message
  `Django deploy stage`.
- Preserve Stage 2 direct object
  `16f60a44885216fa35d67b0334914d8b8d4e8577`, peeled commit
  `16279958ca774f7a34c25b0102a483df53160d6f`, and message
  `Django PostgreSQL stage`.
- Preserve active ruleset `19014157` for `refs/tags/stage-*` update and deletion
  protection. Recover Stage 3 only through coherent absent or exact-matching
  local/remote states and use normal fast-forward branch and single-ref tag
  pushes.
- Fresh public HTTPS clones of all three tags must reproduce lock/export. Stage
  1 retains its public suite, Stage 2 retains its real PostgreSQL contract, and
  Stage 3 passes production static tests, a fresh real PostgreSQL gate, and
  anonymous final-image identity replay.

### TDD, Evidence, and Cleanup

- **D-11:** Drive the production dependency/settings/container/collectstatic
  contract through one public/static test-only RED followed directly by its
  minimum GREEN. Drive the Deployment/Service/Secret/migration/harness contract
  through a second test-only RED followed directly by its minimum GREEN.
- Tests inspect public files, Django startup behavior, collected asset output,
  and rendered workload contracts. Real GitHub, GHCR, PostgreSQL, Kubernetes,
  Gunicorn, WhiteNoise, HTTP, browser, and Git collaborators supply integration
  acceptance. Keep RED subjects unique, file scopes exact, and each GREEN a
  direct child of its RED.
- **D-12:** Retain curated credential-free evidence under the Phase 26 planning
  directory. The reviewed data set should cover workflow, images,
  `collectstatic`, migrations, runtime, logs, HTTP/admin behavior, rollback,
  publication, and cleanup, followed by one sorted checksum manifest generated
  atomically last.
- Scan every reviewed file for database URLs, password or Secret values,
  cookies, CSRF values, GitHub/bearer/service-account tokens, registry auth,
  kubeconfig data, private keys, unresolved tokens, tracebacks, and exception
  dumps before checksum acceptance.
- Freeze the evidence directory read-only after semantic verification,
  credential scanning, and checksum verification. Final readback may parse and
  verify the sealed package while preserving bytes.
- Delete every run-owned PostgreSQL object, application Deployment,
  ReplicaSet, Pod, Service, migration Job, Secret, ConfigMap, port-forward,
  Gunicorn process, browser session, temporary manifest, state path, clone,
  evidence scratch path, and anonymous registry configuration. Finish with a
  read-only exact-label and ownership-ledger audit.
- Preserve the public source repository, three protected source tags, active
  tag ruleset, public GHCR package, and the two accepted immutable image
  versions as durable release artifacts. Inventory any externally blocked
  temporary package-version cleanup by exact ID for Phase 28.

### the agent's Discretion

- Choose current compatible Gunicorn and WhiteNoise patch versions after
  official package and Django 5.2 compatibility verification.
- Choose the exact official Python and uv image digests after immediate
  registry re-resolution.
- Choose compact production test, workflow, manifest, evidence, and harness
  filenames that preserve the public contracts above.
- Choose bounded CPU, memory, timeout, and probe values that fit the
  authenticated namespace and preserve deterministic acceptance.
- Choose the stable startup log format and the smallest Django extension point
  that emits one record per WSGI worker.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Scope and Requirements

- `.planning/PROJECT.md` - v1.3 goals, evidence rules, runtime constraints, and
  project boundaries.
- `.planning/ROADMAP.md` - Phase 26 goal, dependencies, success criteria, and
  Phase 27-28 boundaries.
- `.planning/REQUIREMENTS.md` - DJAN-03 and DJAN-04 contracts.
- `.planning/STATE.md` - current phase position and accepted prior decisions.
- `.planning/quick/260715-e9k-define-fastapi-and-django-tutorial-expan/260715-e9k-CONTEXT.md`
  - milestone-wide framework, TDD, publication, evidence, and cleanup choices.
- `AGENTS.md` - repository language, execution, GSD, and response rules.

### Verified FastAPI Production Pattern

- `.planning/phases/23-fastapi-production-stage/23-CONTEXT.md` - locked
  production-image, process, workload, rollback, publication, and evidence
  decisions.
- `.planning/phases/23-fastapi-production-stage/23-RESEARCH.md` - official
  container, GitHub Actions, GHCR, Kubernetes, and rollback findings.
- `.planning/phases/23-fastapi-production-stage/23-PATTERNS.md` - exact file
  map, TDD boundaries, harness lifecycle, and anti-patterns.
- `.planning/phases/23-fastapi-production-stage/23-01-PLAN.md` - baseline image
  and publisher execution contract.
- `.planning/phases/23-fastapi-production-stage/23-02-PLAN.md` - workload,
  production harness, and final image contract.
- `.planning/phases/23-fastapi-production-stage/23-03-PLAN.md` - real four-state
  Sealos rollback and recovery contract.
- `.planning/phases/23-fastapi-production-stage/23-04-PLAN.md` - protected Stage
  3 publication and public replay contract.
- `.planning/phases/23-fastapi-production-stage/23-01-SUMMARY.md` - accepted
  baseline image and workflow lessons.
- `.planning/phases/23-fastapi-production-stage/23-02-SUMMARY.md` - accepted
  workload, final image, and harness lessons.
- `.planning/phases/23-fastapi-production-stage/23-03-SUMMARY.md` - accepted
  live rollback, task continuity, evidence, and cleanup lessons.
- `.planning/phases/23-fastapi-production-stage/23-04-SUMMARY.md` - accepted
  protected tag, public replay, and publication evidence lessons.
- `.planning/phases/23-fastapi-production-stage/23-VERIFICATION.md` - independent
  FAST-03 and FAST-04 acceptance truth.

### Verified Django PostgreSQL Boundary

- `.planning/phases/25-django-postgresql-stage/25-CONTEXT.md` - strict
  PostgreSQL, migration, readiness, public behavior, identity, and stage-fence
  decisions.
- `.planning/phases/25-django-postgresql-stage/25-01-SUMMARY.md` - accepted
  dependency graph and package identity.
- `.planning/phases/25-django-postgresql-stage/25-02-SUMMARY.md` - accepted
  PostgreSQL configuration and schema-aware readiness.
- `.planning/phases/25-django-postgresql-stage/25-03-SUMMARY.md` - accepted
  repeatable migrations and Job contracts.
- `.planning/phases/25-django-postgresql-stage/25-04-SUMMARY.md` - accepted
  restart persistence, administration, evidence, and cleanup behavior.
- `.planning/phases/25-django-postgresql-stage/25-05-SUMMARY.md` - accepted
  public Stage 2 publication and replay identities.
- `.planning/phases/25-django-postgresql-stage/25-VERIFICATION.md` - independent
  TDD-02, TDD-03, and DJAN-02 acceptance truth.

### Reference Application Source

- `/Users/longnv/bin/repo/sealos-django-tutorial/pyproject.toml` - accepted
  Python, Django, psycopg, and test dependency graph.
- `/Users/longnv/bin/repo/sealos-django-tutorial/taskboard/settings.py` - strict
  PostgreSQL parsing and current pre-production settings boundary.
- `/Users/longnv/bin/repo/sealos-django-tutorial/tasks/views.py` - exact
  schema-aware health and public board behavior.
- `/Users/longnv/bin/repo/sealos-django-tutorial/deploy/migration-job.yaml` -
  future application-image migration Job contract.
- `/Users/longnv/bin/repo/sealos-django-tutorial/deploy/source-migration-job.yaml`
  - immutable Stage 2 source-based migration adapter.
- `/Users/longnv/bin/repo/sealos-django-tutorial/scripts/test-postgres.sh` -
  owned PostgreSQL, server, browser, evidence, and cleanup lifecycle.
- `/Users/longnv/bin/repo/sealos-django-tutorial/tests/test_public_http.py` -
  retained public Django behavior seam.
- `/Users/longnv/bin/repo/sealos-django-tutorial/tests/test_postgresql.py` -
  PostgreSQL configuration and readiness seam.
- `/Users/longnv/bin/repo/sealos-django-tutorial/tests/test_migrations.py` -
  immutable fresh/repeat migration seam.
- `/Users/longnv/bin/repo/sealos-django-tutorial/tests/test_migration_job.py` -
  exact production/source Job contracts.
- `/Users/longnv/bin/repo/sealos-django-tutorial/tests/test_postgres_harness.py`
  - static harness ordering, evidence, and read-only cleanup contracts.
- `/Users/longnv/bin/repo/sealos-django-tutorial/README.md` - Stage 2 reader
  workflow and explicit Phase 26 handoff.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- `taskboard.settings.database_config`: strict standard-library PostgreSQL URL
  parser with a one-second connection timeout and explicit test database.
- `tasks.views.health`: stable schema-aware 503/200 readiness using Django
  connection introspection and the real Task table name.
- `tasks.0001_initial`: immutable schema shared by baseline, final, rollback,
  and recovery images.
- `deploy/migration-job.yaml`: already defines fixed UID/GID 10001, a read-only
  root, bounded `/tmp`, Secret key `url`, and the exact Django migration command.
- `scripts/test-postgres.sh`: supplies run labels, PostgreSQL lifecycle,
  detached port-forward ownership, strict Job rendering, public CSRF writes,
  restart persistence, native admin browser readback, curated evidence, and
  read-only global cleanup.
- Phase 23 FastAPI production artifacts supply the proven exact-SHA publisher,
  anonymous registry gate, two-image rollout, four-state rollback, evidence,
  public replay, and protected-tag patterns.

### Established Patterns

- Public behavior remains the acceptance seam. Django routing, ORM,
  ModelForms, middleware, templates, static assets, and administration stay as
  real collaborators.
- Migration tooling exclusively owns schema changes. Application startup and
  health observe migration state.
- Every temporary Kubernetes and local object belongs to one exact run label,
  prefix, PID identity, named browser session, or ownership-ledger path.
- Dynamic image and runtime evidence lives in Sealos.io planning artifacts so
  the frozen public source commit remains the exact OCI revision.
- Protected stages use annotated tags with direct object, peeled commit,
  message, ruleset, public main, and fresh-clone readback.

### Integration Points

- `taskboard/settings.py` receives production secret, host, WhiteNoise, static
  root, storage, and logging configuration while preserving database parsing.
- `tasks/apps.py` or an equally small Django startup extension can emit the
  stable release identity record.
- New `Dockerfile`, `.dockerignore`, publisher workflow, production static
  tests, application manifest, and production harness extend the exact file
  boundary established by Phase 23.
- `deploy/migration-job.yaml` evolves from strict Stage 2 validation into the
  same-digest executable production Job.
- Phase 27 consumes protected Stage 3, both image digests, sealed runtime
  evidence, and cleanup proof when authoring tutorials and screenshots.

</code_context>

<specifics>
## Specific Ideas

- Mirror the successful FastAPI phase order: production image baseline,
  workload and final image, live rollback/recovery, then protected Stage 3 and
  public replay.
- Treat collected static assets as image build outputs with public HTTP proof,
  giving WhiteNoise and `collectstatic` a concrete reader-visible acceptance
  seam.
- Reuse one persisted Task and one native Django administration record as the
  cross-state database witness.
- Keep Image A as the executable production child of immutable Stage 2 while
  independently replaying the exact Stage 2 tag. This supplies both source
  rollback provenance and a valid Gunicorn/WhiteNoise runtime rollback target.

</specifics>

<deferred>
## Deferred Ideas

- Django production tutorial prose, screenshot rendering, measured duration
  claims, Sealos Skills conversion, Ingress, public domain, and browser capture
  remain Phase 27 scope.
- Framework matrix promotion, 15-page tutorial validation, static site route
  checks, image content-type checks, and milestone-wide final resource cleanup
  remain Phase 28 scope.
- Additional Django features, model fields, APIs, authentication flows, worker
  classes, caches, external static storage, and observability systems remain
  outside the current milestone.

</deferred>

---

*Phase: 26-django-production-stage*
*Context gathered: 2026-07-16 from confirmed decisions and verified prior-stage evidence*
