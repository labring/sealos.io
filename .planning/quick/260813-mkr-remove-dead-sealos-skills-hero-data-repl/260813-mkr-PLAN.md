---
quick_id: 260813-mkr
status: complete
---

# Plan: Remove dead Sealos Skills complexity

## Task 1: Delete unused data and assets

- Remove the unused Hero fields from `PAGE_COPY`.
- Remove the unused logo config property and its render merge.
- Delete the replaced PNG assets.

## Task 2: Remove redundant test lock and verify

- Remove the crypto import and full-file hash test.
- Run focused tests, TypeScript, diff checks, and asset-reference checks.
- Record GSD Summary/Verification and commit the scoped changes.
