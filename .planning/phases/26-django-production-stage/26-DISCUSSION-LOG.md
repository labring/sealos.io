# Phase 26: Django Production Stage - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md; this log preserves the alternatives considered.

**Date:** 2026-07-16
**Phase:** 26-django-production-stage
**Areas discussed:** Production image and static assets, Gunicorn runtime and workload, Immutable publication and rollback, Evidence, TDD, and cleanup

---

## Production Image and Static Assets

| Option | Description | Selected |
|--------|-------------|----------|
| Build-time collection | Lock Gunicorn and WhiteNoise, run compressed-manifest `collectstatic` during a pinned multi-stage image build, and copy collected output into the runtime image. | Yes |
| Runtime collection | Collect assets during each container startup into writable storage. | |
| External static service | Add a separate object-store or CDN publication flow. | |

**User's choice:** Use the Next.js production-series rigor while keeping the
Django stack minimal and reproducible. Prior confirmations authorized the
simplest verifiable implementation.

**Notes:** WhiteNoise makes the existing Task Board CSS observable through the
same immutable image and avoids a new external service boundary.

---

## Gunicorn Runtime and Workload

| Option | Description | Selected |
|--------|-------------|----------|
| One worker per Pod | Run one Gunicorn master and one synchronous WSGI worker per non-root Pod, then scale with two Kubernetes replicas. | Yes |
| Multiple workers per Pod | Add process-level concurrency inside every replica. | |
| Development server | Continue production deployment through Django runserver. | |

**User's choice:** Gunicorn WSGI, WhiteNoise, non-root port 8000, schema-aware
readiness, and migration-first Kubernetes acceptance are locked.

**Notes:** Kubernetes owns horizontal scaling. The existing PostgreSQL parser,
Task migration, health payloads, form, and administration behavior stay stable.

---

## Immutable Publication and Rollback

| Option | Description | Selected |
|--------|-------------|----------|
| Two production images | Publish full-SHA Image A and Image B, deploy by digest, prove four runtime states, preserve all three protected source tags, and replay every public stage. | Yes |
| One production image | Preserve source history while limiting runtime proof to the final digest. | |
| Mutable release tag | Use a moving image tag for rollout and rollback. | |

**User's choice:** Use protected annotated source stages, two immutable GHCR
digests, same-digest migration Jobs, live Sealos rollback, and explicit final
recovery.

**Notes:** Exact Stage 2 remains the source provenance boundary. The first
production-capable child supplies a valid Gunicorn and WhiteNoise rollback
image; the final frozen source supplies Stage 3.

---

## Evidence, TDD, and Cleanup

| Option | Description | Selected |
|--------|-------------|----------|
| Executable plus live proof | Retain direct RED/GREEN seams, real GitHub/GHCR/PostgreSQL/Sealos/browser results, curated evidence, checksums, and exact cleanup. | Yes |
| Static proof only | Accept file-level contracts without real external collaborators. | |
| Manual proof | Accept reader screenshots and operator notes as the production gate. | |

**User's choice:** Keep the confirmed TDD seams public and executable, then
close the phase with real deployment, HTTP, administration, persistence,
rollback, publication, redaction, checksum, and cleanup evidence.

**Notes:** Phase 26 immediately removes its run footprint. Public source tags,
the public package, and the two accepted digests remain durable release inputs.

## the agent's Discretion

- Select compatible Gunicorn and WhiteNoise patch releases after official
  package verification.
- Re-resolve the Python, uv, and Action digests immediately before use.
- Select bounded namespace resource values, timeouts, probe timings, filenames,
  and a stable startup-log format.

## Deferred Ideas

- Phase 27: tutorials, duration measurement, Sealos Skills conversion,
  Ingress/domain work, and screenshots.
- Phase 28: catalog promotion, static publication validation, and final
  milestone residue audit.
