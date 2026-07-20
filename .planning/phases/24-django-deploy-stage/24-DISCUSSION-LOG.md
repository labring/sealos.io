# Phase 24: Django Deploy Stage - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md; this log preserves the alternatives considered.

**Date:** 2026-07-15
**Phase:** 24-django-deploy-stage
**Areas discussed:** Rendered task workflow, Stage 1 persistence, Administration entry point, TDD and publication
**Mode:** Auto application of the user's previously confirmed milestone decisions

---

## Rendered Task Workflow

| Option | Description | Selected |
|--------|-------------|----------|
| Combined task board | One server-rendered page with inline creation and task listing. | Yes |
| Separate pages | Split creation and listing across separate views. | |
| REST endpoints | Use a JSON API as the primary Django surface. | |

**Confirmed choice:** Combined task board.
**Notes:** Preserves the locked server-rendered Task Board shape and gives later screenshots one complete browser surface.

---

## Stage 1 Persistence

| Option | Description | Selected |
|--------|-------------|----------|
| SQLite through Django ORM | Use framework-native ORM persistence and an initial migration. | Yes |
| Process-local state | Keep tasks only in application memory. | |
| PostgreSQL from Stage 1 | Start with the Phase 25 database contract. | |

**Confirmed choice:** SQLite through Django ORM.
**Notes:** Creates the smallest native Django stage while retaining a clear PostgreSQL transition in Phase 25.

---

## Administration Entry Point

| Option | Description | Selected |
|--------|-------------|----------|
| Task registration and admin login | Register the model and expose Django's native login. | Yes |
| Login only | Mount admin without Task registration. | |
| Custom administration | Build a separate administration surface. | |

**Confirmed choice:** Task registration and admin login.
**Notes:** Stage 1 proves the recognizable entry point; Phase 25 owns administrator-backed record creation.

---

## TDD and Publication

| Option | Description | Selected |
|--------|-------------|----------|
| Public HTTP and immutable stage identity | Use vertical RED/GREEN tests, public replay, and a protected annotated tag. | Yes |
| Model-level tests | Assert internal ORM state directly. | |
| Manual browser checks | Depend on operator observation. | |

**Confirmed choice:** Public HTTP and immutable stage identity.
**Notes:** Reuses the accepted FastAPI source-stage contract at the confirmed Django HTTP seam.

## the agent's Discretion

- Django package names, compact local CSS, stable task ordering, form error copy,
  focused test filenames, and bounded smoke harness details.

## Deferred Ideas

- PostgreSQL and migration Job work belongs to Phase 25.
- Production runtime and rollback work belongs to Phase 26.
- Sealos practice, tutorials, and screenshots belong to Phase 27.
- Catalog publication and final cleanup belong to Phase 28.
