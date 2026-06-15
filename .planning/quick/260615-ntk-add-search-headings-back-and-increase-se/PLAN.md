---
status: completed
quick_id: 260615-ntk
slug: add-search-headings-back-and-increase-se
---

# Quick Task 260615-ntk: Add Search Headings Back

## Objective

Restore heading-level recall in `/api/search` while keeping body content out of
the static search artifact. Increase the `search-index` budget to a measured,
bounded limit that allows heading records to pass PR #293 validation.

## Scope

This quick task updates only the search export behavior, route policy budget,
route-policy documentation, audit ledger references, and focused route-policy
tests.

## Tasks

1. Restore heading search records without full-body records.
   - Update `app/api/search/route.ts` so advanced search receives page headings
     from `page.data.structuredData.headings`.
   - Keep `contents` empty so full-body paragraph content does not expand into
     the static artifact.
   - Preserve title, description, id, URL, tokenizer, `staticGET`, and language
     tag behavior.

2. Increase the search-index budget with measured evidence.
   - Update `config/static-export-route-policy.json` to `3000` records and
     `3145728` bytes.
   - Update `docs/static-export-route-policy.md` and
     `docs/performance-audit.md` to describe heading-oriented search output.
   - Keep byte and record budgets enforced by `static-routes:check`.

3. Verify the PR #293 validation chain.
   - Run the focused route policy tests.
   - Run TypeScript validation.
   - Build under Node 20 and measure `out/api/search`.
   - Run `static-routes:check`, `static-output:check`, and
     `validate:deployment`.

## Success Criteria

- `/api/search` includes heading records.
- `/api/search` excludes full-body content records.
- `out/api/search` passes the updated `search-index` budget.
- PR #293 validation commands pass locally.
