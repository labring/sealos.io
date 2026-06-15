---
status: completed
quick_id: 260615-lqb
slug: pr-293-search-index-budget
---

# Quick Task 260615-lqb Summary

## Result

Resolved PR #293 review feedback for the `/api/search` static export budget.
The generated search artifact now stays metadata-oriented and fits the existing
`search-index` policy budget.

## Review Feedback

- PR comment:
  `https://github.com/labring/sealos.io/pull/293#discussion_r3411680103`
- Problem: `out/api/search` measured `14344626` bytes and exceeded the
  `1048576` byte budget.
- Resolution: bound advanced-search `structuredData` to empty heading and body
  arrays while preserving title, description, URL, id, language tag, tokenizer,
  and `staticGET` behavior.

## Changed Files

- `app/api/search/route.ts`
  - Keep advanced search metadata and language tags.
  - Remove expanded heading/body `structuredData` from the static index input.
- `scripts/check-static-export-routes.js`
  - Count Fumadocs/Orama exported records from `docs.docs`.
- `scripts/check-static-export-routes.test.mjs`
  - Add metadata-oriented search route guard coverage.
  - Use an Orama-shaped search fixture for route budget validation.

## Measured Artifact

- Artifact: `out/api/search`
- Records: `620 / 1000`
- Bytes: `919931 / 1048576`

## Verification

- `node --test scripts/check-static-export-routes.test.mjs`
  - Passed: `12/12`
- `npm run static-routes:check`
  - Passed with `search-index 620/1000 records, 919931/1048576 bytes`
- `npm run static-output:check`
  - Passed
- `npm run validate:deployment`
  - Passed
  - Docker smoke remains gate-controlled by `PHASE9_RUN_DOCKER_SMOKE`
  - Native generated image artifact inspection remains caveated for the current
    static export output
- `npm run lint`
  - Passed
- `npm run build`
  - Passed under Node `v20.20.0` / npm `10.8.2`
  - Build emitted remote markdown fetch timeout logs during static generation,
    then completed successfully and normalized the root locale export.

## Success Criteria

- `/api/search` preserves language-scoped advanced search behavior.
- Static search export excludes expanded heading/body records.
- `search-index` policy remains at `1000` records and `1048576` bytes.
- Static route, static output, deployment, build, and TypeScript checks pass.
