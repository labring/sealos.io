---
phase: 27-practice-backed-tutorial-series
plan: "05"
subsystem: tutorial-evidence-assets
tags: [fastapi, django, webp, responsive-review, evidence-cards]
requires:
  - phase: 27-practice-backed-tutorial-series
    plan: "04"
    provides: Six evidence-backed tutorial drafts and 24 locked image references
provides:
  - Twenty-four reviewed 1440x900 WebP evidence cards
  - Desktop and mobile acceptance for all six tutorial pages
  - Complete asset provenance for the final evidence seal
affects: [27-06, 28-catalog-publication-and-cleanup]
tech-stack:
  added: []
  patterns: [dark evidence cards, fixed canvas rendering, responsive route review]
key-files:
  created:
    - public/images/deploy-fastapi-sealos/
    - public/images/fastapi-postgresql-sealos/
    - public/images/fastapi-production-deployment-sealos/
    - public/images/deploy-django-sealos/
    - public/images/django-postgresql-sealos/
    - public/images/django-production-deployment-sealos/
  modified: []
key-decisions:
  - "Render every evidence card from reviewed source records at a fixed 1440x900 canvas."
  - "Use one consistent neutral dark-card grammar with framework-specific accent colors."
  - "Contain the final Django digest in a scrollable code block to preserve exact text and mobile width."
requirements-completed: [SHOT-01, SHOT-02]
completed: 2026-07-17
status: complete
---

# Phase 27 Plan 05: Tutorial Evidence Cards Summary

All 24 locked tutorial assets now exist as reviewed, credential-free WebP
evidence cards. Every asset is 1440x900, below 200000 bytes, metadata-free,
nonblank, semantically joined to its adjacent tutorial step, and visually
accepted at original detail.

## Asset Inventory

| Asset | Bytes | SHA-256 |
| --- | ---: | --- |
| `public/images/deploy-fastapi-sealos/local-stage-validation.webp` | 35166 | `3695b2ebf28b0aefbccfc6eb5d9737ec52b5a64a2fa8889090d5caba8d332be8` |
| `public/images/deploy-fastapi-sealos/sealos-analysis-template.webp` | 32926 | `831ff9fc38c194433f033cb98eb35a09596ca8bf292496d31ae95008fd3ed0a6` |
| `public/images/deploy-fastapi-sealos/sealos-deployment-health.webp` | 31224 | `8ba13be8be13085f5ab8a8b6c7558391acba4c913275feb0d1927c9a3ec3135c` |
| `public/images/deploy-fastapi-sealos/swagger-tasks-api.webp` | 37350 | `f2505e9e0d56f3267c428ee7b78d3f336406fc713bb397c88803d78e6402d570` |
| `public/images/fastapi-postgresql-sealos/database-ready-source.webp` | 33752 | `db3d6b5986483e259b4f84bea82515330712f1aa52041033ff2327ab3ae6545d` |
| `public/images/fastapi-postgresql-sealos/sealos-postgresql-plan.webp` | 37074 | `24c084c635bc6b65890cdd3cb3ab1e89ccef41d75c68e990d6f6359f5b0f084e` |
| `public/images/fastapi-postgresql-sealos/alembic-migration-complete.webp` | 35494 | `d92811f644000db688a9d65e417c89ed23c556326c1997ee7d4fedcb0be9d9c5` |
| `public/images/fastapi-postgresql-sealos/persistent-crud-readback.webp` | 32504 | `aa4be9b1d25cf9c0d4983ca4563068314400f4a8f159260e041cf9e526c6a2a5` |
| `public/images/fastapi-production-deployment-sealos/production-state-redacted.webp` | 35770 | `2ddd69aa3f0725819acea0e439bc75af689d66399ce9e5e7fafdddf00d2d4706` |
| `public/images/fastapi-production-deployment-sealos/immutable-rollout-health.webp` | 34588 | `75d0a5699c9933411adba53dcd8224a87d64af8a1528389374ddb562c63f6871` |
| `public/images/fastapi-production-deployment-sealos/domain-runtime-logs.webp` | 37338 | `fb1a37ad7262477c8a972bdf0e92252204c31325d7050c76bde3a32eed6a4f44` |
| `public/images/fastapi-production-deployment-sealos/rollback-recovery.webp` | 31092 | `7acd51ee75ed7aeba5c1241f1eace61ab582956c5b4122e17821089d91a27e6d` |
| `public/images/deploy-django-sealos/local-stage-validation.webp` | 35600 | `faf37814ca65433fbe1765c60ae38ad272465054a418e95fd26d4547053f1829` |
| `public/images/deploy-django-sealos/sealos-analysis-template.webp` | 34006 | `b489acd9a4f8feb42e7e4d86e20babc347d79a055a282f4f998a421bcfc2172c` |
| `public/images/deploy-django-sealos/sealos-deployment-health.webp` | 31676 | `454ac44057fcee9af9d6c17a5bbc2a3e8b1ae7f913d4c07da602ac652f7ea3e1` |
| `public/images/deploy-django-sealos/task-board-admin.webp` | 33900 | `ef401cd54dedbf515b33fe337254174da061c0243d8668734b7ee2e82a42c722` |
| `public/images/django-postgresql-sealos/database-ready-source.webp` | 36978 | `b4eb93e0dea46abd13fdce4697327ad3592b71339e12c52e3e2957696a2d0d2a` |
| `public/images/django-postgresql-sealos/sealos-postgresql-plan.webp` | 38810 | `01cd14497e77a087b0d0c5ef6dc66548cc72652bfbd9646786d66769ee2e2b02` |
| `public/images/django-postgresql-sealos/django-migration-complete.webp` | 35888 | `db2e262eed49d6b9b66440614529fa653e4203de07524d1ef948f7b5937abcf0` |
| `public/images/django-postgresql-sealos/persistent-board-admin.webp` | 37782 | `dc84086c256e0fd0033983c32203d57a68564c7b5eb5f97146f988d020b3f065` |
| `public/images/django-production-deployment-sealos/production-state-redacted.webp` | 35936 | `c40da8cf6783ec3a56c7855f0145e29bc30e257e0beb0e2e7e82b6a2c7d442fa` |
| `public/images/django-production-deployment-sealos/immutable-rollout-health.webp` | 34084 | `1360eee34be5ee3f306767acfea6e28f77a1bb9952cd0bb2e50d42c13002f5c0` |
| `public/images/django-production-deployment-sealos/domain-static-logs.webp` | 41958 | `909b0a819a1abefb18e360e0fc0ebc2f1d1b2e26aaa567741116d087d96f7fa0` |
| `public/images/django-production-deployment-sealos/rollback-recovery.webp` | 32304 | `d9c84100efc7b1afbc93982f38b7ba642f255cb658be48d480381d4eeb3817d5` |

## Machine And Visual Review

- Coordinator bundle gate: `drafts_valid=6 drafts_pending=0 assets_pending=0 issues=0`.
- Dimensions and format: 24/24 at 1440x900 RIFF/WEBP.
- Unique content: 24/24 unique SHA-256 digests.
- Byte budget: 24/24 below 200000 bytes; observed range 31092-41958 bytes.
- Nonblank, metadata stripping, required-token, forbidden-token, credential,
  provenance, and semantic checks: 24/24 passed.
- Original-detail `view_image` review: 24/24 passed.

## Responsive Page Review

All six development routes passed at 1440x900 and 390x844. The 12 viewport
reviews verified route, title, body, four natural 1440x900 images, useful
alt-text captions, image adjacency, stable layout, and readable framing.

- Routes: 6/6 desktop and 6/6 mobile.
- Images: 48/48 viewport loads; captions: 48/48 exact alt matches.
- Root horizontal overflow: zero.
- Stable-element overlap: zero.
- Clipped long tokens: zero.
- Review screenshots: 12/12 accepted at original detail and removed afterward.
- The Django production mobile retest passed with
  `scrollWidth=390` and `innerWidth=390`.

## Commits

- `ff780be` - `docs(27-05): add FastAPI tutorial evidence cards`
- `6e851f9` - `docs(27-05): add Django tutorial evidence cards`

Each commit contains exactly the 12 framework-owned WebP files. The Django
production responsive correction is folded into the three-file Django tutorial
commit `a6ea141`.

## Verification And Cleanup

- `node --test scripts/python-tutorial-assets.test.mjs`: 17 passed, 0 failed.
- `npm run lint`: passed.
- Page-review server PID `56500` was reaped and port `49457` has no listener.
- Phase 27 page-review and render browser sessions: zero.
- Review, renderer, card, OCR, and image scratch: zero.
- Absolute workspace strings and retained browser-capture fields: zero.
- Phase 28 publication boundaries remain unchanged.

Plan 27-06 can now consolidate the reviewed staging records, add the final
cross-framework cleanup audit, generate the checksum manifest last, and seal
the ten-file evidence package.

---
*Phase: 27-practice-backed-tutorial-series*
*Completed: 2026-07-17*
