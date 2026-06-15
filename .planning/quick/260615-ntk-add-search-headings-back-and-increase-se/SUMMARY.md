---
status: completed
quick_id: 260615-ntk
slug: add-search-headings-back-and-increase-se
---

# Quick Task 260615-ntk Summary

## Result

Restored heading-level search records for `/api/search` and increased the
`search-index` budget to fit the measured heading-oriented artifact.

## Changed Files

- `app/api/search/route.ts`
  - Added heading-only structured data for advanced search.
  - Kept body `contents` empty so full-body content stays out of the index.
- `config/static-export-route-policy.json`
  - Increased `search-index` to `3000` records and `3145728` bytes.
  - Updated the input source description to heading-oriented search records.
- `docs/static-export-route-policy.md`
  - Updated route and budget documentation for the new search budget.
- `docs/performance-audit.md`
  - Updated stale search budget and search-design references.
- `scripts/check-static-export-routes.test.mjs`
  - Updated the source guard to require headings while keeping contents empty.

## Measured Artifact

- Artifact: `out/api/search`
- Records: `2141 / 3000`
- Bytes: `2751886 / 3145728`
- Record types:
  - `page`: `314`
  - `text`: `306`
  - `heading`: `1521`

## Verification

- `npm run build`
  - Passed under Node `v20.20.0` / npm `10.8.2`
  - Build emitted the existing static export rewrite warning and native
    sharp/canvas duplicate-class warning, then completed successfully.
- `npm run static-routes:check`
  - Passed with `search-index 2141/3000 records, 2751886/3145728 bytes`
- `npm run static-output:check`
  - Passed
- `npm run validate:deployment`
  - Passed
  - Docker smoke remains gate-controlled by `PHASE9_RUN_DOCKER_SMOKE`
  - Native generated image artifact inspection remains caveated for the current
    static export output
- `node --test scripts/check-static-export-routes.test.mjs`
  - Passed: `12/12`
- `npm run lint`
  - Passed

## Notes

The budget change is based on the local Node 20 build output after restoring
headings and keeping body content excluded.
