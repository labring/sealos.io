# Phase 25 Evidence Schema

This directory retains credential-free acceptance evidence for the Django
PostgreSQL stage. Every runtime record comes from the final tracked source via:

```text
PHASE25_EVIDENCE_DIR=<this-directory> ./scripts/test-postgres.sh --phase-gate
```

The harness writes only curated outcomes. Database URLs, usernames, passwords,
cookies, CSRF values, Kubernetes Secret data, response bodies, exception text,
PIDs, and browser state remain in mode-0600 temporary paths and are removed by
the exact-run cleanup.

## Local Gate Files

| File | Schema |
|---|---|
| `package-identity.txt` | Package name, exact version, official source identity, Python version, and `uv.lock` SHA-256. |
| `django-migrations.txt` | Run ID, fresh/repeat source Job state, direct migrate results, applied migration, drift result, columns, and immutable migration SHA-256. |
| `django-jobs.txt` | Run ID, production validation result, source Job sequence, exact Job name, completion condition, applied migration, and rendered manifest SHA-256. |
| `django-http.jsonl` | Ordered method, public path, process identity, status, stable result, and the run-derived Task title for retained-data observations. |
| `cleanup.txt` | Run ID plus zero inventory, stopped port-forward and servers, closed browser state, absent paths, and free ports. |

`django-http.jsonl` uses one compact JSON object per line with keys sorted by
name. The sequence covers unavailable readiness, migrated readiness, process A
write/read, process B restart readback, the authenticated Task changelist, and
the Task change-form title readback.

## Publication Files

Plan 25-05 adds:

- `django-source.txt` for accepted/public commit and annotated-tag identity.
- `fastapi-phase-gate.txt` for the independent immutable FastAPI Stage 2 replay.
- `checksums.txt` for every retained evidence file except itself, sorted by
  filename and generated after the final review.

## Replay Order

1. Run the final-source local Django gate and exact cleanup.
2. Replay immutable FastAPI Stage 2 with its own run ID and temporary root.
3. Verify and publish the protected Django Stage 2 identity.
4. Clone the public Django tag into a fresh temporary root and rerun the gate.
5. Run the read-only cross-framework cleanup audit.
6. Scan all evidence inputs, then generate and verify `checksums.txt` last.

## Ownership Ledger

Active Django phase gates record one mode-0600 temporary ledger under
`/tmp/sealos-phase25-ownership/`. Records use `category|value` for owned
servers, port-forwards, browser sessions, temporary roots, state files, replay
clones, and credential paths. Normal cleanup removes each owned item and the
ledger. `--assert-clean-all` only reads remaining ledgers and live inventories;
it performs no cleanup mutation.
