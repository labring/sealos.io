---
status: completed
quick_id: 260615-lqb
slug: pr-293-search-index-budget
---

# Quick Task 260615-lqb: Optimize PR #293 Search Index Budget

## Objective

Resolve the latest PR #293 review feedback where the exported static search
artifact measured `14344626` bytes, exceeding the `search-index` byte budget by
13.6x and causing `static-routes:check`, `static-output:check`, and
`validate:deployment` to fail.

## Scope

This quick task covers exactly the search-index budget failure for `/api/search`.
The preferred fix is to restore the generated artifact to metadata-oriented
search records rather than increasing the `search-index` budget.

## Source Audit

| Source | Item | Plan Status | Notes |
|---|---|---|---|
| GOAL | Optimize PR #293 `/api/search` static search index so the exported artifact fits the 1000-record / 1048576-byte budget. | COVERED | Tasks 1-3. |
| CONTEXT | Preserve language-scoped search results. | COVERED | Task 1 keeps advanced search and the language `tag` field consumed by `components/docs/Search.tsx`. |
| CONTEXT | Prefer optimizing the search export over raising the budget. | COVERED | Task 1 removes expanded body records from the index input; Task 2 keeps the current budget. |
| RESEARCH | `structuredData` drives Fumadocs advanced search expansion into heading/content Orama records. | COVERED | Task 1 trims `structuredData` to metadata-only shape before passing it to `createSearchAPI('advanced')`. |
| RESEARCH | Existing policy documents describe search as metadata-oriented. | COVERED | Task 2 adds guard coverage that enforces this contract. |

## Files

- `app/api/search/route.ts`
- `scripts/check-static-export-routes.test.mjs`
- `config/static-export-route-policy.json`
- `docs/static-export-route-policy.md`
- `.planning/quick/260615-lqb-pr-293-search-index-budget/SUMMARY.md`

## Tasks

1. Restore `/api/search` to metadata-oriented advanced search records.
   - In `app/api/search/route.ts`, keep `createSearchAPI('advanced')`, the
     Mandarin tokenizer, `staticGET: GET`, and the per-page `tag:
     entry.language` field so `components/docs/Search.tsx` can continue
     filtering by the current language.
   - Stop passing full `page.data.structuredData` into the advanced index.
     Replace it with a deliberately bounded structured-data object containing
     empty `headings` and `contents` arrays for each page, while keeping title,
     description, id, url, metadata-oriented content, and language tag values.
   - Keep the metadata-oriented `content` string focused on title,
     description, and the language marker. Do not add body text, MDX text,
     heading text, generated schema text, or blog/FAQ corpus text to the search
     record.
   - Use a small local helper or constant for the bounded structured-data shape
     so future readers can see that the empty arrays are intentional.

2. Strengthen budget fixtures without increasing the search-index limit.
   - Keep `config/static-export-route-policy.json` `budgets.search-index` at
     `maxCount: 1000` and `maxBytes: 1048576`.
   - Keep `docs/static-export-route-policy.md` aligned with the same budget and
     with the metadata-oriented `/api/search` contract. Update the wording only
     if Task 1 changes the implementation language enough to make the policy
     ambiguous.
   - Update `scripts/check-static-export-routes.test.mjs` so the passing search
     fixture resembles Fumadocs' exported object shape closely enough for
     `parseSearchRecords()` and byte budget assertions to cover the reviewed
     failure mode. The fixture should still stay small enough to pass the
     existing 1 MiB limit.
   - Add a focused assertion or fixture mutation showing that `search-index`
     byte overages continue to fail closed. Reuse the existing budget helper
     patterns instead of adding a second checker.

3. Verify the focused route budget and deployment guard chain.
   - Run the focused route policy test:
     `node --test scripts/check-static-export-routes.test.mjs`
   - Run the source/static route guard:
     `npm run static-routes:check`
   - Run the static output composition guard:
     `npm run static-output:check`
   - Run the deployment composition guard:
     `npm run validate:deployment`
   - Run TypeScript validation:
     `npm run lint`
   - When an `out` directory is available after a local build, run
     `npm run static-routes:check` again and confirm the `search-index` budget
     line reports no more than `1000` records and no more than `1048576` bytes
     for `out/api/search`.
   - Create
     `.planning/quick/260615-lqb-pr-293-search-index-budget/SUMMARY.md` with
     changed files, verification commands, measured search-index count/bytes
     when available, and any caveats such as a closed locked-build gate.

## Verification

- `node --test scripts/check-static-export-routes.test.mjs`
- `npm run static-routes:check`
- `npm run static-output:check`
- `npm run validate:deployment`
- `npm run lint`
- Optional full artifact check when local build output exists:
  `npm run build && npm run static-routes:check`

## Success Criteria

- `/api/search` keeps language-scoped advanced search behavior through the
  existing language tag path.
- The static search export returns metadata-oriented records and excludes
  expanded heading/body `structuredData` records.
- The `search-index` budget remains `1000` records / `1048576` bytes.
- `static-routes:check`, `static-output:check`, and `validate:deployment` have a
  passing path for the optimized artifact.
