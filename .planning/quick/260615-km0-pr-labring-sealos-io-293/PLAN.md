---
status: planned
quick_id: 260615-km0
slug: pr-labring-sealos-io-293
---

# Quick Task 260615-km0: Address PR #293 Static Export Guard Feedback

## Objective

Resolve the latest PR #293 review feedback for static export route artifacts and
native static output inspection.

## Scope

This quick task covers exactly these review comments:

1. `/api/search` policy currently expects `out/api/search.json`; the reviewed
   build output path is `out/api/search`.
2. `scripts/check-static-output.js` fails when `out` exists and
   `out/generated/native-images` is absent; reviewed real output omits that
   directory.

## Files

- `config/static-export-route-policy.json`
- `docs/static-export-route-policy.md`
- `scripts/check-static-export-routes.js`
- `scripts/check-static-export-routes.test.mjs`
- `scripts/check-static-output.js`
- `scripts/check-static-output.test.mjs`
- `.planning/quick/260615-km0-pr-labring-sealos-io-293/SUMMARY.md`

## Tasks

1. Align the `/api/search` artifact contract with reviewed output.
   - Change the `/api/search` route row in
     `config/static-export-route-policy.json` so `expectedArtifact` is
     `out/api/search`.
   - Update `docs/static-export-route-policy.md` so the route matrix and budget
     contract name `out/api/search` as the primary static search artifact.
   - Update `scripts/check-static-export-routes.js` so the search artifact
     fallback list checks `out/api/search` first and still accepts the existing
     alternate emitted shapes after that primary path.
   - Update `scripts/check-static-export-routes.test.mjs` fixtures/assertions so
     the passing fixture writes and validates `out/api/search`.

2. Make native static output inspection match the reviewed export shape.
   - Update `validateNativeArtifactStatus()` in
     `scripts/check-static-output.js` so an existing `out` directory with an
     absent `out/generated/native-images` directory produces a caveat status
     without adding a failure.
   - Keep failure behavior for locked-build missing `out`, source artifact
     directories that exist but contain no files, and native artifact output
     directories that exist but contain no files.
   - Update `scripts/check-static-output.test.mjs` with a focused fixture where
     `out` exists and `out/generated/native-images` is absent. The expected
     result is no overall static-output failure from native artifacts, with the
     native artifact result carrying a caveat reason.

3. Verify focused tests and related npm guards.
   - Run focused Node tests:
     `node --test scripts/check-static-export-routes.test.mjs scripts/check-static-output.test.mjs`
   - Run related npm guards:
     `npm run static-routes:check`
     `npm run static-output:check`
     `npm run lint`
   - Create
     `.planning/quick/260615-km0-pr-labring-sealos-io-293/SUMMARY.md` with the
     changed files, verification commands, and outcomes.

## Verification

- `node --test scripts/check-static-export-routes.test.mjs scripts/check-static-output.test.mjs`
- `npm run static-routes:check`
- `npm run static-output:check`
- `npm run lint`
