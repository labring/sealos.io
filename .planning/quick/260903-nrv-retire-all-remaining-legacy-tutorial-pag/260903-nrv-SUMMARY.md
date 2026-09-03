---
phase: 260903-nrv-retire-all-remaining-legacy-tutorial-pag
plan: "01"
subsystem: tutorial-publication
tags: [tutorials, seo, redirects, content-retirement]
provides:
  - "One qualified public Tutorial at /tutorials/django/deploy/"
  - "Planned hierarchical matrix opportunities for every future Tutorial"
  - "Permanent retirement handoffs for 12 flat legacy Tutorial URLs"
affects: [tutorials, sitemap, static-export, vercel, cloudflare-pages]
actuals:
  tasks: 2
  commits: 2
  files_changed: 77
key-files:
  modified:
    - app/[lang]/(home)/tutorials/tutorial-growth-data.ts
    - app/[lang]/(home)/tutorials/page.tsx
    - app/[lang]/(home)/tutorials/TutorialFrameworkMatrix.tsx
    - app/[lang]/(home)/tutorials/TutorialJourneyRail.tsx
    - scripts/validate-tutorials.mjs
    - vercel.json
    - public/_redirects
  deleted:
    - content/tutorials/{12 legacy flat slugs}/index.en.mdx
    - public/images/{12 legacy flat slugs}/
    - scripts/python-tutorial-assets.mjs
    - scripts/python-tutorial-assets.test.mjs
key-decisions:
  - "Django Deploy is the sole available Tutorial opportunity."
  - "Each retired flat URL permanently redirects to /tutorials/ on production hosts."
  - "Internal planning and evidence history remains available for audit."
requirements-completed: [L-01, L-02, L-03, L-04, L-05]
status: complete
---

# Quick Task 260903-nrv: Retire all remaining legacy Tutorial pages

The public Tutorial surface now contains the qualified Django Core guide and a truthful opportunity matrix.

## Accomplishments

- Removed 12 legacy MDX pages and their current workspace revisions.
- Removed 54 dedicated public images across 12 legacy directories.
- Removed the orphaned FastAPI Tutorial asset generator and its focused test.
- Changed Next.js, React, Node.js, and FastAPI opportunities to Planned and moved the primary journey to Django Core.
- Aligned every matrix opportunity with the hierarchical `/tutorials/{framework}/{stage}/` URL model.
- Added 24 permanent URL variants to both Vercel and Cloudflare Pages, all targeting `/tutorials/`.

## Task Commits

1. **Lock retirement and redirect contracts** — `4f07e09`
2. **Remove legacy surfaces and align publication state** — `7359e0c`

## Verification

- `pnpm validate-tutorials` — PASS, 1 Tutorial page.
- Focused Node tests — PASS, 14/14.
- `pnpm lint` — PASS.
- `pnpm build` — PASS, the static route manifest lists only Django Core under Tutorial details.
- `pnpm static-output:check` — PASS for source, output, and route policy.
- Source and output residue audit — PASS, 0 legacy directories.
- Local preview — PASS, index and Django Core return 200; all 12 retired paths return 404 under Next development routing.
- Browser audit — PASS, Django is the sole Available card and every retired framework uses a request action.

## Existing Work Preserved

The catch-all Tutorial route migration, shared Blog visual primitives, Django Core content and proof images, Tutorial metadata utilities, source schema changes, and internal planning evidence remain in the working tree.
