---
status: passed
quick_task: 260903-nrv
verified_at: 2026-09-03
score: 5/5
---

# Verification: Retire all remaining legacy Tutorial pages

## Result

All five must-haves passed against the implementation, generated output, and live local preview.

| Requirement | Result | Evidence |
|---|---|---|
| L-01: Django Core is the sole published Tutorial | PASS | `rg --files content/tutorials` returns one MDX file; validator and build route manifest agree. |
| L-02: Legacy content and 54 images are absent | PASS | Exact 12-slug source, public image, and static output audit reports zero residue. |
| L-03: Orphaned generator is absent | PASS | Both `scripts/python-tutorial-assets.mjs` and its test are absent. |
| L-04: Matrix reflects publication state | PASS | Browser snapshot exposes one Django Available link; retired framework cells expose request actions with hierarchical slugs. |
| L-05: Production redirects are complete | PASS | Redirect regression covers 24 source variants in both `vercel.json` and `public/_redirects` with destination `/tutorials/` and status 308. |

## Automated Checks

- `pnpm validate-tutorials`: passed.
- `node --test scripts/validate-tutorials.test.mjs scripts/check-static-output.test.mjs`: 14 passed, 0 failed.
- `pnpm lint`: passed.
- `pnpm build`: passed; 6,169 static pages generated.
- `pnpm static-output:check`: source, out artifacts, and route policy passed.
- `git diff --check`: passed.

## Surface Checks

- `http://localhost:3000/tutorials/`: 200.
- `http://localhost:3000/tutorials/django/deploy/`: 200.
- Twelve retired local detail paths: 12 × 404.
- Browser snapshot: Django Core CTA, published-path marker, one available Tutorial, and requestable future opportunities are present.

Native generated-image inspection retained its existing skipped-with-caveat state; both representative static assets passed.
