---
phase: 27-practice-backed-tutorial-series
plan: "04"
subsystem: tutorial-content
tags: [fastapi, django, mdx, tutorials, evidence-backed-content]
requires:
  - phase: 27-practice-backed-tutorial-series
    plan: "02"
    provides: Reviewed FastAPI source and practice evidence
  - phase: 27-practice-backed-tutorial-series
    plan: "03"
    provides: Reviewed Django source and practice evidence
provides:
  - Three-page FastAPI tutorial series
  - Three-page Django tutorial series
  - Shared evidence-derived five-minute title decision
  - Twenty-four locked screenshot references
affects: [27-05, 27-06, 28-catalog-publication-and-cleanup]
tech-stack:
  added: []
  patterns: [protected-tag authority, framework-local series, adjacent evidence images]
key-files:
  created:
    - content/tutorials/deploy-fastapi-sealos/index.en.mdx
    - content/tutorials/fastapi-postgresql-sealos/index.en.mdx
    - content/tutorials/fastapi-production-deployment-sealos/index.en.mdx
    - content/tutorials/deploy-django-sealos/index.en.mdx
    - content/tutorials/django-postgresql-sealos/index.en.mdx
    - content/tutorials/django-production-deployment-sealos/index.en.mdx
  modified: []
key-decisions:
  - "Use the five-minute beginner titles because both accepted clean deploy-to-public-health intervals are below 300000 ms."
  - "Keep PostgreSQL source prerequisites and current generated KubeBlocks versions in separate evidence-backed contexts."
  - "Keep fresh Phase 27 Django production observations separate from checksum-valid Phase 26 final and A-B-A-B authority."
requirements-completed: [CONT-01, CONT-02, CONT-03, CONT-04]
completed: 2026-07-17
status: complete
---

# Phase 27 Plan 04: Tutorial Series Summary

Six English tutorials now form two complete framework-local series grounded in
protected source tags and reviewed practice evidence.

## Shared Title Decision

Both accepted clean Stage 1 attempts satisfy the shared five-minute gate:

| Framework | Accepted interval | Clock boundary | Beginner title |
| --- | ---: | --- | --- |
| FastAPI | 21,106 ms | Native DEPLOY request to exact public HTTPS `/health` 200 | `How to Deploy FastAPI on Sealos in 5 Minutes` |
| Django | 26,099 ms | Native DEPLOY request to exact public HTTPS `/health` 200 | `How to Deploy Django on Sealos in 5 Minutes` |

Local setup, authentication, source validation, analysis, and template review
remain outside both measured intervals.

## Tutorial Matrix

| Framework | Stage | Series order | Protected tag | Images | Reviewed claims |
| --- | --- | ---: | --- | ---: | ---: |
| FastAPI | beginner | 1 | `stage-1-deploy` | 4 | 5 |
| FastAPI | advanced | 2 | `stage-2-postgresql` | 4 | 6 |
| FastAPI | production | 3 | `stage-3-production` | 4 | 6 |
| Django | beginner | 1 | `stage-1-deploy` | 4 | 6 |
| Django | advanced | 2 | `stage-2-postgresql` | 4 | 7 |
| Django | production | 3 | `stage-3-production` | 4 | 8 |

Every page includes complete frontmatter, framework-local related tutorials,
the locked stage CTA, evidence-backed FAQ and HowTo fields, one matching
protected-tag link, and four descriptive adjacent image references.

## Source Authority

- FastAPI protected source:
  `https://github.com/yangchuansheng/sealos-fastapi-tutorial/tree/<stage-tag>`.
- Django protected source:
  `https://github.com/yangchuansheng/sealos-django-tutorial/tree/<stage-tag>`.
- FastAPI prose resolves to 17 reviewed claims and 26 practice events.
- Django prose resolves to 21 reviewed claims and 42 practice events.
- Current generated KubeBlocks PostgreSQL `16.4.0` remains distinct from the
  protected source harness prerequisites using PostgreSQL 17 or 17.10.
- Django Stage 3 current baseline HTTPS, board, and WhiteNoise observations use
  fresh Phase 27 authority. Final admin, Gunicorn, logs, and A-B-A-B history use
  checksum-valid Phase 26 authority.

## Commits

- `320af97` - `docs(27-04): add FastAPI tutorial series`
- `a6ea141` - `docs(27-04): add Django tutorial series`

Each commit contains exactly its three framework MDX files.

## Verification

- Intermediate FastAPI gate produced exactly one
  `DRAFT_PAGE_SET_MISMATCH` for the three pending Django pages and reported
  `drafts_valid=3 drafts_pending=3 assets_pending=24 issues=1`.
- Complete draft gate passed with
  `drafts_valid=6 drafts_pending=0 assets_pending=24 issues=0`.
- All six pages contain exactly four unique locked image references.
- Prettier, whitespace, credential, protected-tag, series, CTA, and related-link
  checks passed.
- Phase 28's nine publication paths retain combined phase-base digest
  `d23664b0889a7d3b5d99fe5f9f017f565eb7a50fc076792a943fe120431ca433`.
- Catalog promotion, the production validator, build output, and static HTTP
  acceptance remain unchanged for Phase 28.

## Next Plan Readiness

Plan 27-05 can render the 24 locked WebPs from the reviewed screenshot ledgers
and five sanitized application captures per framework. Plan 27-06 can then
normalize, audit, checksum, and seal the complete evidence package.

---
*Phase: 27-practice-backed-tutorial-series*
*Completed: 2026-07-17*
