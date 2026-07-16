---
phase: 28-catalog-publication-and-cleanup
date: 2026-07-17
status: complete
---

# Phase 28 Pattern Map

## File Roles And Closest Analogs

| Phase file | Role | Closest analog | Pattern to preserve |
| --- | --- | --- | --- |
| `scripts/validate-tutorials.test.mjs` | CLI behavior test | `scripts/check-static-output.test.mjs` | `node:test`, isolated temp fixture, cleanup in `finally` |
| `scripts/validate-tutorials.mjs` | Production contract CLI | Current module | Exact contract arrays, stable `fail()` diagnostics, semantic exit codes |
| `app/[lang]/(home)/tutorials/tutorial-growth-data.ts` | Catalog state | Current module | Derived status from small framework-key sets |
| `app/[lang]/(home)/tutorials/page.tsx` | Metadata and hero composition | Current page | Constants feed metadata and structured data; small copy-only change |
| `app/[lang]/(home)/tutorials/TutorialFrameworkMatrix.tsx` | Matrix explanation | Current component | Existing available cells remain direct links |
| `evidence/*` | Publication authority | Phase 27 evidence package | Curated values, checksum last, read-only seal |

## Data Flow

```text
AVAILABLE_FRAMEWORK_KEYS
  -> getInventoryStatus()
  -> getTutorialFrameworkMatrix()
  -> matrix links + status summary

tutorialContracts + strictTutorialSlugs
  -> source/frontmatter/image/catalog checks
  -> npm run validate-tutorials exit

npm run build
  -> out/tutorials + out/images
  -> loopback HTTP matrix
  -> browser review
  -> Phase 28 evidence seal
```

## Test Fixture Pattern

The fixture copies only public validator inputs:

1. `content/tutorials/<15 exact slugs>/index.en.mdx`.
2. Every local image reference extracted from those sources.
3. Required metadata, source, sitemap, header, dark-mode, catalog data, matrix,
   and tutorial index files.
4. The validator executes by absolute script path with fixture `cwd`.
5. One copied input is changed per negative case.

Assertions use command exit and complete stable diagnostic fragments. They do
not import validator internals.

## Contract Extension Pattern

- Add FastAPI and Django contracts beside their stage peers.
- Each Python contract declares `sourceTag`, source URL, stage, series order,
  CTA, related tutorials, stage-specific body phrases, folder, WebP-only,
  width, and height.
- Rename the six-page strict set to represent all 12 strict React, Node.js,
  FastAPI, and Django pages.
- Require exactly four unique local images for every strict page and close each
  directory against its referenced set.
- Keep the existing `153600` byte limit; every accepted Python card is within it.

## Catalog Promotion Pattern

- Extend `AVAILABLE_FRAMEWORK_KEYS` by two keys.
- Remove FastAPI and Django from `COMING_NEXT_FRAMEWORK_KEYS`.
- Keep slug derivation and all UI branches unchanged.
- Update only visible/metadata language that claims the old three-framework or
  Next.js-only public state.
- Validate the source form of both key sets and copy through the CLI.

## Static Acceptance Pattern

- Allocate a loopback port before launch.
- Install cleanup traps before the server starts.
- Record PID, port, and server log in mode-0700 scratch.
- Poll `/tutorials/` with a bounded timeout.
- Request the exact 31-path matrix and capture status, content type, bytes, and
  content SHA-256 as JSONL.
- Close browser sessions, stop/reap PID, prove the port is free, then remove
  scratch before sealing evidence.

## Constraints

- No tutorial body or image byte changes are planned.
- No loader, metadata helper, detail route, detail layout, sitemap, header, dark
  mode, build configuration, or dependency changes are planned.
- Phase 27 evidence bytes and filesystem modes remain exact.
- No database schema files are involved.
