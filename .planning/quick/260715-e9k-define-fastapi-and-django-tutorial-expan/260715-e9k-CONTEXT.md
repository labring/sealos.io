# Quick Task 260715-e9k: Define FastAPI and Django Tutorial Expansion - Context

**Gathered:** 2026-07-15
**Status:** Ready for planning

<domain>
## Task Boundary

Define the implementation contract for adding FastAPI and Django tutorial
series under `/tutorials`, using the current framework tutorial family as the
structural baseline.

</domain>

<decisions>
## Implementation Decisions

### Series Scope

- Add six tutorials in total: three for FastAPI and three for Django.
- Each framework series follows the existing three-stage path: beginner
  deployment, PostgreSQL integration, and production deployment.

### Framework-Native Example Shape

- The FastAPI path uses a REST API with `/docs`, `/health`, and CRUD endpoints.
  Its PostgreSQL stage adds SQLAlchemy, Alembic, and database-backed CRUD
  verification.
- The Django path uses a server-rendered application with `/admin` and
  `/health`. Its PostgreSQL stage covers migrations, administrator record
  creation, and page-level read verification.

### Screenshot Evidence Contract

- Build and deploy the FastAPI, Django, and PostgreSQL paths before producing
  screenshots.
- Capture practice evidence from terminal output, Sealos resources, and live
  browser results, with credentials and sensitive values redacted.
- Render screenshots as 1440x900 dark evidence cards matching the current
  Next.js tutorial family, export them as WebP, and keep each asset below
  200 KB.
- FastAPI evidence includes Swagger UI, health checks, and CRUD results.
- Django evidence includes the rendered application, Django administration,
  migrations, and database-backed records.

### Reference Application Continuity

- Use one reference application throughout all three pages in each framework
  series.
- The FastAPI reference application is `Tasks API`: begin with the REST service,
  add PostgreSQL-backed CRUD, then apply the production deployment checklist.
- The Django reference application is `Task Board`: begin with rendered pages
  and Django administration, add PostgreSQL-backed data, then apply the
  production deployment checklist.

### Public Reference Repositories

- Create `yangchuansheng/sealos-fastapi-tutorial` as the durable public source
  repository for the FastAPI series.
- Create `yangchuansheng/sealos-django-tutorial` as the durable public source
  repository for the Django series.
- Use these repositories as the source for tutorial links, deployment practice,
  and screenshot evidence.

### Reproducible Source Stages

- Tag each reference repository with `stage-1-deploy`,
  `stage-2-postgresql`, and `stage-3-production`.
- Keep `main` aligned with the complete production-stage application.
- Link each tutorial page to its matching immutable source tag.

### Python Dependency Baseline

- Use Python 3.12 for both reference applications.
- Manage project metadata and dependencies with `uv`, `pyproject.toml`, and a
  committed `uv.lock` file.
- Commit an exact-version `requirements.txt` exported from the lock file for
  compatibility with the current Sealos Skills Python detection and image
  generation path.
- Use Django 5.2 LTS for the Django reference application.

### Screenshot Coverage

- Deliver four screenshots per tutorial page, for a total of 24 screenshots.
- Beginner pages cover local validation, Sealos analysis and generated
  template, deployment completion, and the live application surface.
- PostgreSQL pages cover repository readiness, the generated resource plan,
  migration completion, and live database read/write verification.
- Production pages cover environment and deployment state, rollout and health,
  domain and logs, and rollback readiness.

### Production Runtime Baseline

- FastAPI uses SQLAlchemy 2, Alembic, psycopg 3, and one Uvicorn process per
  container. Sealos workload replicas provide horizontal replication.
- Django uses psycopg 3, Gunicorn WSGI, WhiteNoise, and `collectstatic`.
- Both applications bind to `0.0.0.0:8000`, run as a non-root user, and expose
  `/health` for runtime checks.

### Migration Execution

- Run database migrations through a one-shot Sealos/Kubernetes Job that reuses
  the application image and database Secret.
- The FastAPI migration Job runs `alembic upgrade head`.
- The Django migration Job runs `python manage.py migrate`.
- Treat successful migration completion as a prerequisite for rollout
  acceptance and horizontal scaling.
- Keep application readiness pending until the required schema is available.

### Practice Resource Lifecycle

- Remove all live Sealos practice resources after screenshots and acceptance
  evidence are complete.
- Cleanup covers the Sealos `Instance`, application workloads, Services,
  Ingresses, migration Jobs, PostgreSQL Clusters, PVCs, test Secrets, and
  temporary image resources created by the tutorial runs.
- Preserve the two public reference repositories, redacted practice evidence,
  and final screenshot assets.

### Evidence-Gated Duration Claim

- Measure beginner deployment time from the Sealos deploy command to a
  successful public `/health` response in a clean authenticated workspace.
- Use `in 5 Minutes` in the beginner title when both FastAPI and Django satisfy
  the five-minute threshold.
- Use the evergreen `How to Deploy ... on Sealos` title and report the measured
  duration in the article when either practice run exceeds the threshold.

### Inherited Repository Contract

- Publish six English source pages as `index.en.mdx` files with these slugs:
  `deploy-fastapi-sealos`, `fastapi-postgresql-sealos`,
  `fastapi-production-deployment-sealos`, `deploy-django-sealos`,
  `django-postgresql-sealos`, and `django-production-deployment-sealos`.
- Use series identifiers `sealos-skills-fastapi` and `sealos-skills-django`.
  Deploy pages use `stage: beginner` and order 1, PostgreSQL pages use
  `stage: advanced` and order 2, and production pages use
  `stage: production` and order 3.
- Keep related tutorial links inside each three-page framework series.
- Beginner pages use the `Start free on Sealos` CTA with
  `https://os.sealos.io`. PostgreSQL and production pages use the
  `Open Sealos Skills` CTA with `/sealos-skills`.
- Preserve the current Codex `$sealos` and Claude Code `/sealos` workflows,
  Runtime Truth Pass, DEPLOY and UPDATE rules, and `.sealos/analysis.json`,
  `.sealos/template/index.yaml`, and `.sealos/state.json` terminology.
- Promote FastAPI and Django from `coming_next` to `available` in the tutorial
  framework matrix and expand repository validation from nine to 15 tutorial
  pages.

### Confirmed Test Seams

- **FastAPI HTTP seam:** Verify `/health`, `/docs`, and `/tasks` CRUD through
  public HTTP behavior, using a real test PostgreSQL database for the database
  stage.
- **Django HTTP seam:** Verify `/health`, task creation and listing, and
  `/admin/login` through public HTTP behavior. Confirm writes through later
  page reads.
- **Migration and runtime seam:** Run the migration Job against a fresh
  PostgreSQL database, then observe Job completion, readiness, and public HTTPS
  read/write behavior.
- **Tutorial publication seam:** Exercise `npm run validate-tutorials` and
  static-page smoke checks for the 15 slugs, framework matrix status, series
  navigation, and 24 referenced WebP assets with the required dimensions and
  size budget.
- Execute each seam as a vertical red-green slice: one failing behavior test,
  the minimum implementation that passes it, then the next behavior test.
- Keep internal collaborators real. Use boundary substitutes only where an
  external service cannot participate in the focused test.

### the agent's Discretion

- Select exact compatible FastAPI, Pydantic, SQLAlchemy, Alembic, psycopg,
  Gunicorn, and WhiteNoise patch versions when generating the lock files.
- Set initial CPU and memory requests from live cold-start and steady-state
  evidence.
- Choose screenshot filenames, captions, and accent colors within the locked
  1440x900 dark evidence-card system.
- Adapt section wording and troubleshooting examples while preserving the
  current tutorial information architecture and verified Sealos workflow.

</decisions>

<specifics>
## Specific Ideas

- Use the existing Next.js, React, and Node.js tutorial families as the current
  repository baseline.

</specifics>

<canonical_refs>
## Canonical References

- `content/tutorials/deploy-nextjs-sealos/index.en.mdx`
- `content/tutorials/nextjs-postgresql-sealos/index.en.mdx`
- `content/tutorials/nextjs-production-deployment-sealos/index.en.mdx`
- `scripts/validate-tutorials.mjs`

</canonical_refs>
