# Phase 25: Django PostgreSQL Stage - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution
> agents. Decisions are captured in `25-CONTEXT.md`.

**Date:** 2026-07-15
**Phase:** 25-django-postgresql-stage
**Areas discussed:** Database boundary, migration ownership, readiness, shared framework proof, publication
**Mode:** Auto application of the user's previously confirmed milestone decisions

---

## Database Boundary

| Option | Description | Selected |
|--------|-------------|----------|
| Dedicated real PostgreSQL 17 | Use run-labeled Sealos resources and a bounded local port-forward. | Yes |
| SQLite compatibility mode | Retain SQLite when `DATABASE_URL` is absent. | |
| Mock database collaborator | Replace PostgreSQL with test doubles. | |

**Confirmed choice:** Dedicated real PostgreSQL 17.
**Notes:** Preserves the shared real-database contract and exact ownership-based cleanup.

## Migration Ownership

| Option | Description | Selected |
|--------|-------------|----------|
| Preserve Django `0001_initial` | Replay the existing migration on PostgreSQL and through the Job. | Yes |
| Generate a PostgreSQL-specific migration | Fork schema history for the database switch. | |
| Create schema at application startup | Let runtime code create missing tables. | |

**Confirmed choice:** Preserve Django `0001_initial`.
**Notes:** The model schema is portable; configuration changes while migration history stays immutable.

## Readiness and Persistence

| Option | Description | Selected |
|--------|-------------|----------|
| Schema-aware health plus process restart | Gate 200 on the migrated table and prove later-process readback. | Yes |
| TCP-only health | Treat an open database socket as ready. | |
| Single-process readback | Verify persistence within one server process. | |

**Confirmed choice:** Schema-aware health plus process restart.
**Notes:** Matches the migration-before-readiness and scale-safe persistence contract.

## Shared Framework Proof

| Option | Description | Selected |
|--------|-------------|----------|
| Rerun both real phase gates | Execute FastAPI and Django Jobs, readiness, HTTP, and cleanup. | Yes |
| Reuse Phase 22 report only | Treat prior FastAPI evidence as current. | |
| Django-only run | Limit Phase 25 evidence to the new framework. | |

**Confirmed choice:** Rerun both real phase gates.
**Notes:** TDD-03 explicitly requires both migration commands in one current acceptance boundary.

## Publication

| Option | Description | Selected |
|--------|-------------|----------|
| Protected annotated Stage 2 tag | Publish accepted source and replay it from public HTTPS. | Yes |
| Moving branch only | Leave Stage 2 without an immutable source identity. | |
| Publish after production | Delay Stage 2 identity until Phase 26. | |

**Confirmed choice:** Protected annotated Stage 2 tag.
**Notes:** Keeps the three-stage tutorial source contract independently reproducible.

## the agent's Discretion

- Exact psycopg patch after official identity verification.
- URL parsing helper boundaries and stable internal logging.
- Source Job packaging, bounded resource values, and evidence filenames.

## Deferred Ideas

- Gunicorn, WhiteNoise, container images, replicas, rollback, and recovery belong to Phase 26.
- Tutorial prose, practice screenshots, and measured duration belong to Phase 27.
- Catalog and static publication gates belong to Phase 28.
