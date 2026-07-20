# Phase 28 Tutorial Publication Evidence

This package records the production publication gate for the 15-page English
tutorial catalog. It joins the committed source boundary to production build,
static HTTP, responsive browser, cleanup, and checksum results.

## Files

| File | Authority |
| --- | --- |
| `build.txt` | Curated command, duration, output inventory, and static-check results |
| `http.jsonl` | Exact 31-path loopback HTTP acceptance matrix |
| `browser.txt` | Desktop and mobile behavior plus visual review |
| `cleanup.jsonl` | Final external and local zero-residue audit |
| `review.txt` | Publication decision and Phase 27 equality summary |
| `checksums.txt` | SHA-256 seal for the previous six files |

## HTTP Schema

Each `http.jsonl` row contains `path`, `status`, normalized `content_type`,
response `bytes`, and response-body `sha256`. The deterministic matrix contains
one index, six Python tutorial pages, and 24 Python evidence WebPs.

## Cleanup Schema

The terminal `cleanup.jsonl` row records the run identity, local server/browser
ownership, Kubernetes resource-kind counts, temporary image count, local
footprint counts, Phase 27 equality, and one aggregate `zero_residue` decision.

## Replay

Run the public tutorial tests and validator, build the static export, execute
the repository static checks, serve `out/` on an unused loopback port, replay
the exact paths in `http.jsonl`, review `/tutorials/` at 1440x900 and 390x844,
then complete the cleanup and checksum gates described in `review.txt`.

All retained values exclude credentials, cookies, local absolute paths, and
raw Kubernetes objects. `checksums.txt` is generated last and all seven files
are retained read-only.
