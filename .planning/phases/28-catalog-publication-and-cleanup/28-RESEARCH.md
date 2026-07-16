---
phase: 28-catalog-publication-and-cleanup
date: 2026-07-17
status: complete
---

# Phase 28 Technical Research

## Research Question

What must change, and what must remain stable, to publish the six accepted
FastAPI and Django tutorials as part of the production 15-page catalog?

## Current Publication Boundary

- `scripts/validate-tutorials.mjs` owns one fail-closed CLI rooted at
  `process.cwd()`. Its `tutorialContracts` array currently lists nine pages.
- `newTutorialSlugs` currently applies strict page-owned WebP checks to the six
  React and Node.js pages. The byte limit is `153600`; all new Python evidence
  cards are 31092-41958 bytes.
- The validator already checks required frontmatter, exact related links, CTA,
  body phrases, `/sealos`, forbidden public patterns, image resolution, folder
  inventory, metadata helpers, sitemap, header, forced dark mode, and index
  metadata.
- The current failure is deterministic: exactly one extra-directory issue lists
  the six accepted Phase 27 sources.

## Catalog Data Flow

- `AVAILABLE_FRAMEWORK_KEYS` contains Next.js, React, and Node.js.
- `COMING_NEXT_FRAMEWORK_KEYS` contains FastAPI, Django, Go, and Spring Boot.
- `getInventoryStatus()` maps every framework row from those sets.
- `TutorialFrameworkMatrix` already turns available cells into direct links.
- `TutorialStatusSummary` derives counts from the matrix. Promoting FastAPI and
  Django yields 15 available, six coming-next, and 33 planned guide cells.
- `TutorialJourneyRail` intentionally keeps Next.js as the default staged path;
  the framework matrix provides complete navigation for all available series.

## Index Publication Surface

- `page.tsx` loads every tutorial through `getSortedTutorials()`, so the
  CollectionPage ItemList will contain all 15 sources after validation opens.
- Metadata and hero copy still name only Next.js, React, and Node.js.
- `TutorialFrameworkMatrix.tsx` still says Next.js is the only complete path.
- FastAPI and Django already appear as framework rows; their status transition
  requires data and copy changes rather than a layout redesign.

## TDD Architecture

The stable public seam is the CLI process:

```text
fixture filesystem -> node scripts/validate-tutorials.mjs -> exit/status text
```

Use `node:test`, `spawnSync`, and mode-0700 temporary fixtures. The fixture
copies committed tutorial sources, all referenced public image bytes, and the
small integration-file allowlist required by the validator. It then mutates one
public input. This observes behavior and avoids exporting private parser helpers.

Vertical slice 1 specifies:

- exact 15-page success;
- 24 strict new Python assets inside the 12 strict React/Node/Python pages;
- stable failure when a required Python asset is absent.

Vertical slice 2 specifies:

- exact five-framework available set;
- stable failure when Django is removed from that set;
- stable failure when FastAPI/Django discoverability copy is absent.

## Static Build And HTTP Surface

- Production uses `output: 'export'`, `trailingSlash: true`, and unoptimized
  images in `next.config.mjs`.
- `npm run build` runs `next build` and root-locale normalization.
- English reader paths therefore resolve as directory indexes under `out/`.
- A loopback static server can exercise one index, six detail routes, and 24
  WebPs. HTML responses must be `text/html`; assets must be `image/webp`.
- The index HTML can prove all 15 direct links and current status counts without
  introducing another runtime dependency.

## Browser Review

The existing dark catalog composition remains authoritative. Review only the
changed publication state at 1440x900 and 390x844:

- FastAPI and Django matrix rows expose three available links each;
- visible copy names five public paths;
- derived counts are coherent;
- root overflow, stable overlap, and clipped labels are zero.

Review captures remain temporary and are inspected at original detail before
deletion.

## Evidence And Cleanup

- Phase 27 has ten read-only files and a verified nine-input checksum manifest.
  Record its before/after byte and mode equality.
- Phase 28 should retain a separate package: schema README, build result,
  HTTP JSONL, browser review, cleanup JSONL, review summary, and checksum
  manifest generated last.
- Reuse the protected Django `--assert-clean-all` gate and namespaced read-only
  resource queries. Add local process, browser, loopback port, scratch, ledger,
  and public temporary-image-tag checks.
- Stop and reap the exact static server before the final cleanup record.

## Pitfalls And Mitigations

| Pitfall | Mitigation |
| --- | --- |
| Generic discovery silently publishes future directories | Keep an exact 15-contract array and exact directory set |
| Python pages pass without strict asset folder closure | Add all six to the strict slug set and require four references |
| Catalog status and source validation drift independently | Validate the exact availability set and index copy in the same CLI |
| Test snapshots implementation text | Spawn the CLI and assert exit plus stable diagnostics |
| Development review hides export defects | Build production output and serve it through HTTP |
| Phase 28 mutates sealed Phase 27 evidence | Hash and mode snapshot Phase 27 before and after every closeout gate |
| Static server or browser session remains | Use exact PID/session ownership, traps, reaping, and port checks |

## Validation Architecture

| Layer | Command | Proves |
| --- | --- | --- |
| Focused TDD | `node --test scripts/validate-tutorials.test.mjs` | Public CLI success and invalid-input diagnostics |
| Production validator | `npm run validate-tutorials` | Exact 15-page catalog and asset contract |
| Type safety | `npm run lint` | Strict TypeScript integration |
| Build | `npm run build` | Static export generation |
| Static repository checks | `npm run static-output:check` and `npm run static-routes:check` | Existing export invariants |
| HTTP acceptance | Run-owned loopback request matrix | Index, six pages, and 24 WebPs |
| Browser acceptance | Named desktop/mobile session | Reader-visible availability state and responsive layout |
| Cleanup | Protected global harness plus exact read-only queries | Empty external and local footprint |
| Evidence | SHA-256 manifest and read-only modes | Durable publication proof |

## Recommendation

Execute two CLI-level RED/GREEN plans, then one production build, HTTP, browser,
cleanup, and checksum plan. Keep the existing UI architecture and Phase 27
evidence immutable.

## RESEARCH COMPLETE
