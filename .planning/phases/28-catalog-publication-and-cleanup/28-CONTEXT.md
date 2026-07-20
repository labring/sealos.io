# Phase 28: Catalog Publication and Cleanup - Context

**Gathered:** 2026-07-17
**Status:** Ready for planning

<domain>
## Phase Boundary

Publish the accepted FastAPI and Django Framework Tutorial Series through the
existing `/tutorials` catalog, expand the production validator from nine to 15
pages, prove the new Static Tutorial Surface through a production export and
loopback HTTP checks, and retain a final zero-residue publication record.

</domain>

<decisions>
## Implementation Decisions

### Catalog Availability And Reader Navigation
- **D-01:** `AVAILABLE_FRAMEWORK_KEYS` contains exactly `nextjs`, `react`,
  `nodejs`, `fastapi`, and `django`. Their 15 matrix cells are direct tutorial
  links; every remaining framework keeps its request path.
- **D-02:** Preserve the existing tutorial page composition and primary Next.js
  hero action. Update index metadata, hero copy, framework notes, and matrix
  copy so FastAPI and Django are visible as complete public paths in the first
  rendered catalog view.
- **D-03:** Keep the full 18-framework inventory and three launch jobs. Derived
  status counts become 15 available guides, six coming-next guides, and 33
  planned guides.

### Production Validator Contract
- **D-04:** `npm run validate-tutorials` remains the public validation seam and
  accepts exactly 15 English tutorial directories.
- **D-05:** Add the six Python pages to the strict WebP set. Each page requires
  its exact framework, stage, series order, related links, CTA, protected source
  tag, current Sealos language, four unique page-owned WebPs, 1440x900
  dimensions, the repository byte budget, and a matching folder allowlist.
- **D-06:** The validator also checks the catalog availability set and the
  FastAPI/Django index metadata and copy so source publication and reader
  discoverability change as one contract.

### TDD Seams
- **D-07:** Use `scripts/validate-tutorials.test.mjs` at the CLI boundary. The
  first vertical slice specifies exact 15-page source/asset acceptance and a
  stable missing-Python-asset failure. The second slice specifies five available
  framework paths and FastAPI/Django index discoverability.
- **D-08:** Every test observes command exit status and user-facing diagnostics.
  Fixtures copy committed public sources and assets, then introduce one invalid
  input through the public filesystem contract.

### Static Publication Acceptance
- **D-09:** Run one production static build, serve `out/` from an unused
  loopback port, and accept the English `/tutorials/` index, six new detail
  routes, and 24 new WebPs through HTTP.
- **D-10:** Require 200 responses, HTML and WebP content types, all 15 available
  catalog links, no reader-visible error export, and exact route/asset sets.
- **D-11:** Review `/tutorials/` at 1440x900 and 390x844. Require FastAPI and
  Django availability links, coherent counts and copy, zero root overflow,
  zero stable overlap, and no clipped labels.

### Evidence And Cleanup
- **D-12:** Preserve every Phase 27 evidence byte and `0444` mode. Phase 28 uses
  a separate checksum-last evidence package for build, static HTTP, browser,
  validator, and final cleanup results.
- **D-13:** Re-run exact namespaced Instance, App, workload, Service, Ingress,
  Job, PostgreSQL Cluster, PVC, Secret, and ConfigMap checks plus process,
  browser, path, ledger, local server, and temporary package checks after static
  acceptance. Every owned count must remain zero.
- **D-14:** Stop and reap the loopback server, close named browser sessions,
  remove review/build-server scratch, verify the static results, then seal the
  Phase 28 evidence package read-only.

### the agent's Discretion
- Choose focused test helper names and fixture layout while preserving CLI-level
  behavior and stable diagnostics.
- Choose the exact FastAPI/Django metadata keywords and concise index copy.
- Choose the loopback static server implementation and evidence file split.
- Choose minimal matrix wording updates that preserve the current visual system.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project And Phase Contracts
- `AGENTS.md` - response, language, GSD, TDD, scope, and execution rules.
- `CONTEXT.md` - Framework Tutorial Series, Available Framework Path, Tutorial
  Publication Gate, and Static Tutorial Surface vocabulary.
- `.planning/PROJECT.md` - v1.3 product goal and static publication constraints.
- `.planning/REQUIREMENTS.md` - TDD-04, SHOT-03, PUB-01 through PUB-03, and
  OPS-02 acceptance.
- `.planning/ROADMAP.md` - Phase 28 boundary, success criteria, and ownership.
- `.planning/STATE.md` - current milestone and active requirements.

### Accepted Phase 27 Handoff
- `.planning/phases/27-practice-backed-tutorial-series/27-06-SUMMARY.md` - exact
  six sources, 24 assets, source history, boundary hashes, and cleanup handoff.
- `.planning/phases/27-practice-backed-tutorial-series/evidence/README.md` -
  evidence authority, schemas, redaction, replay, and checksum contract.
- `.planning/phases/27-practice-backed-tutorial-series/evidence/checksums.txt` -
  immutable nine-input Phase 27 evidence seal.

### Catalog And Validation Integration
- `app/[lang]/(home)/tutorials/tutorial-growth-data.ts` - framework inventory,
  availability state, slug derivation, and matrix data.
- `app/[lang]/(home)/tutorials/page.tsx` - catalog metadata, hero copy,
  structured data, and page composition.
- `app/[lang]/(home)/tutorials/TutorialFrameworkMatrix.tsx` - direct-link and
  request-cell behavior.
- `app/[lang]/(home)/tutorials/TutorialJourneyRail.tsx` - status counts and
  launch-job presentation.
- `scripts/validate-tutorials.mjs` - current nine-page production validation
  seam and stable diagnostics.
- `package.json` - `validate-tutorials`, build, lint, and postinstall commands.

### Production And Static Output
- `next.config.mjs` - production static export and trailing-slash behavior.
- `scripts/normalize-root-locale.js` - root locale output normalization.
- `scripts/check-static-export-routes.js` - established static route checks.
- `scripts/check-static-output.js` - established static output checks.
- `app/[lang]/(home)/tutorials/[slug]/page.tsx` - tutorial content rendering.
- `app/[lang]/(home)/tutorials/[slug]/layout.tsx` - tutorial detail layout and
  responsive surface.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `getTutorialFrameworkMatrix()` and `getTutorialInventoryItem()` already derive
  slugs and statuses from the framework availability sets.
- `TutorialFrameworkMatrix` already renders available items as direct links and
  unavailable items as tracked request actions.
- The validator already parses frontmatter, related links, image references,
  WebP dimensions, byte budgets, catalog source, and public integration files.
- Existing static-output scripts and the Phase 27 coordinator provide stable
  Node test and artifact-validation patterns.

### Established Patterns
- Tutorial content is English-only MDX loaded through Fumadocs and statically
  exported with trailing slashes.
- Strict tutorial assets live in `public/images/<tutorial-slug>/`, use four
  page-owned WebPs, and are validated through source references plus folder
  inventory.
- Repository tests use `node:test`; `npm run lint` is strict TypeScript checking.
- The catalog derives counts and matrix state from data rather than hard-coded
  JSX branches.

### Integration Points
- Add FastAPI/Django to `AVAILABLE_FRAMEWORK_KEYS` and remove their request-only
  state through the existing derived status function.
- Extend `tutorialContracts`, strict asset slugs, and catalog checks in
  `scripts/validate-tutorials.mjs`.
- Update metadata and visible copy in `page.tsx` plus the framework-matrix
  availability explanation.
- Build to `out/`, then exercise the exact index, detail, and asset URLs through
  a run-owned loopback server.

</code_context>

<specifics>
## Specific Ideas

- FastAPI remains described as the API and AI service path.
- Django remains described as the backend product path with its Task Board and
  native administration surface.
- The final visible catalog state contains five complete framework paths and 15
  direct tutorial links.
- Production acceptance covers 31 new public endpoints: one index, six detail
  pages, and 24 evidence assets.

</specifics>

<deferred>
## Deferred Ideas

None - discussion stayed within phase scope.

</deferred>

---

*Phase: 28-catalog-publication-and-cleanup*
*Context gathered: 2026-07-17*
