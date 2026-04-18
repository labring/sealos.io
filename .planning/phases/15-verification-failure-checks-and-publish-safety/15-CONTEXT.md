# Phase 15: Verification, Failure Checks, and Publish Safety - Context

**Gathered:** 2026-04-18
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase makes the English Object Storage start-here page publish-safe for
v1.3. It strengthens how first-upload success is verified, adds a compact
first-failure checklist, confirms the English Object Storage surface stays a
single safe leaf page, and runs the practical repo-level validation needed
before the milestone is considered ready to ship.

The phase stays inside the existing Object Storage English leaf page at
`content/docs/guides/object-storage/index.en.mdx` and its current top-level
guides registration. It does not reopen page architecture, does not add
child-page navigation, does not widen Object Storage docs into a library, and
does not turn the milestone into a broader cleanup of unrelated guides.

</domain>

<decisions>
## Implementation Decisions

### Carried-forward Object Storage milestone constraints (from Phase 13)
- **D-01:** `content/docs/guides/object-storage/index.en.mdx` remains the
  single canonical English Object Storage leaf page for v1.3.
- **D-02:** The canonical first-upload flow stays console-UI only (no SDK
  code, no CLI commands).
- **D-03:** Stable contract values may be exact (S3-compatible, MinIO-based,
  four credential values, three permission levels), but unstable UI labels
  and console URLs stay neutral — action language only.
- **D-04:** The example bucket stays `private` (D-07 carried forward). The
  milestone does not introduce a public bucket or a signed-URL tutorial.

### Verification presentation
- **D-05:** `Verify Your Upload` should become a short checklist, not prose.
  The checklist must be operator-grade and reflect the private-bucket
  reality.
- **D-06:** First success is defined by two signals visible in the console:
  1. the file appears in the bucket's file list with expected name, size,
     and timestamp
  2. opening the file's detail view shows a usable object URL / preview that
     proves the object exists at an addressable path (even though the URL
     itself is access-controlled for a private bucket)
- **D-07:** The checklist must not require making the bucket public or
  generating signed URLs. Those belong to later milestones.

### First-failure checklist density
- **D-08:** `If the first upload fails` keeps five fixed first-pass checks,
  mirroring the Phase 12 AI Proxy posture (compact, procedural, no decision
  tree).
- **D-09:** Checklist order: bucket-side first, then credential-side, then
  file-side:
  1. wrong or missing bucket (bucket not created or wrong region selected)
  2. permission denied (bucket-level permission too restrictive for your
     session, or action unavailable)
  3. wrong endpoint (internal vs external mismatch — future SDK context)
  4. wrong credentials (Access Key / Secret Key pair copied incorrectly —
     future SDK context)
  5. upload size or file-name issue (file too large for console upload, or
     characters the bucket rejects)
- **D-10:** Each check may carry one short "what to look at first" hint. The
  section stays compact and operational; no retry advice, no network
  troubleshooting tree.
- **D-11:** Checks 3 and 4 stay brief and clearly framed as "matters when you
  move to SDK or CLI access." They do not expand into an SDK tutorial.
- **D-12:** Tone of the failure section: short, hard, procedural. No
  apologies, no reassurance filler.

### Publish-safety validation scope
- **D-13:** Phase 15 runs both `npm run build` and `npm run lint` as the
  repo-level validation closeout for this milestone.
- **D-14:** If build or lint exposes clearly unrelated existing repo
  failures, they are recorded as environmental or pre-existing blockers,
  not misclassified as Object Storage regressions.
- **D-15:** Navigation and route checks stay Object Storage-specific: confirm
  the top-level guides nav still exposes `object-storage`, confirm the
  English route still lands on one leaf page, and confirm no
  `content/docs/guides/object-storage/meta.en.json` is created and no
  child-page exposure slipped in.
- **D-16:** Publish-safety scanning explicitly checks the Object Storage
  English surface for English-only copy, no Chinese residue (body, headings,
  alt text, frontmatter), no hardcoded secrets or placeholder credentials,
  and no unverified console URL or exact-label assertions.
- **D-17:** Phase 15 includes a focused Object Storage docs UAT pass in
  addition to shell checks and repo build/lint validation. The UAT proves a
  reader can follow the page from opening the Object Storage app to seeing
  their first file in the bucket list.

### Claude's Discretion
- Exact checklist wording for the strengthened verification section, as long
  as it stays short and clearly ordered per D-06.
- Exact one-sentence hints attached to each first-failure bullet, as long as
  they remain compact and operational.
- Exact command ordering and grouping inside the validation log, as long as
  Object Storage-specific content checks run alongside `npm run build` and
  `npm run lint`.
- Exact format of the Object Storage-specific UAT record, as long as it
  proves the reader can follow the page from first opening to first-success
  validation.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Milestone contract and phase scope
- `.planning/PROJECT.md` — Current milestone goal, English-only scope, rule
  that Object Storage v1.3 stays a single start-here surface.
- `.planning/REQUIREMENTS.md` — Phase 15 requirement targets: `VRFY-01`,
  `VRFY-02`, `QLTY-01`, `QLTY-02`, `QLTY-03`.
- `.planning/ROADMAP.md` — Phase 15 goal, success criteria, plan split
  (4 plans).
- `.planning/STATE.md` — Current milestone continuity plus the known worktree
  execution constraint.

### Locked Object Storage contracts from earlier phases
- `.planning/phases/13-product-truth-safe-example-contract-and-page-outline/13-CONTEXT.md`
  — Carries the high-level Object Storage milestone decisions Phase 15 must
  preserve.
- `.planning/phases/13-product-truth-safe-example-contract-and-page-outline/13-safe-example-contract.md`
  — Defines the mixed product-truth policy, private-bucket default, and the
  verification contract Phase 15 extends.
- `.planning/phases/13-product-truth-safe-example-contract-and-page-outline/13-page-outline-spec.md`
  — Preserves the single-leaf role, screenshot posture, frontmatter
  contract, and navigation exclusions.
- `.planning/phases/14-canonical-object-storage-start-here-page/14-CONTEXT.md`
  — Carries forward the page-authoring decisions Phase 15 will harden.

### Pattern reference (AI Proxy v1.2 publish-safety closeout)
- `.planning/phases/12-verification-failure-checks-and-publish-safety/12-CONTEXT.md`
  — Proven pattern for the same phase role.
- `.planning/phases/12-verification-failure-checks-and-publish-safety/12-01-PLAN.md`
  through `12-04-PLAN.md` — Four-plan structure Phase 15 mirrors.
- `.planning/phases/12-verification-failure-checks-and-publish-safety/12-VALIDATION.md`
  — Pattern for the validation log artifact.
- `.planning/phases/12-verification-failure-checks-and-publish-safety/12-VERIFICATION.md`
  — Pattern for the final verification report.

### Existing Object Storage implementation and navigation
- `content/docs/guides/object-storage/index.en.mdx` — The Phase 14 output
  that Phase 15 will harden for verification and publish safety.
- `content/docs/guides/object-storage/index.zh-cn.mdx` — Factual source for
  console flows, file-list rendering, and upload behavior.
- `content/docs/guides/meta.en.json` — Existing top-level guide registration
  that already exposes `object-storage`.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `content/docs/guides/object-storage/index.en.mdx`: Phase 14 already wrote
  skeletal `Verify Your Upload` and `What's Next` sections. Phase 15
  strengthens these in place, not replaces them structurally.
- `content/docs/guides/object-storage/index.zh-cn.mdx`: useful evidence
  source for file-list behavior and upload failure modes.
- `content/docs/guides/meta.en.json`: current top-level nav source proving
  `object-storage` is already discoverable in Guides.
- `package.json`: repo exposes `npm run build` and `npm run lint` as the
  practical release-safety commands.

### Established Patterns
- Docs verification in this repo is shell-first, then repo `build` / `lint`,
  with non-blocking environmental noise recorded separately when needed.
- Prior milestones keep phase verification artifacts under `.planning/phases/`
  and treat worktree-local execution as authoritative when automation points
  to the wrong repo.
- `gsd-tools` has a worktree path resolution bug: use direct `git` commands
  for staging and committing, not `gsd-tools commit`.

### Integration Points
- Phase 15 continues modifying `content/docs/guides/object-storage/index.en.mdx`
  in place.
- Phase 15 adds Object Storage-specific validation and verification artifacts
  under `.planning/phases/15-verification-failure-checks-and-publish-safety/`.
- Phase 15 validates current `content/docs/guides/meta.en.json` registration
  without widening into unrelated guide navigation cleanup.

</code_context>

<specifics>
## Specific Ideas

- The strengthened `Verify Your Upload` section should read like a
  release-ready operator checklist: "you should see X, Y, Z in the console",
  not a soft narrative paragraph.
- The new `If the first upload fails` section stays narrow and symptom-first:
  one short hint per check, no decision tree, five items total.
- Repo-level validation should be honest about the dirty worktree and any
  unrelated pre-existing failures, but still hold the Object Storage surface
  to a real publish-safe standard.
- The final UAT should prove a reader can go from opening the Object Storage
  app to seeing their first file row in the bucket list without consulting
  another page.
- The phase must check that Phase 14's explicit "Phase 15 will extend this
  section" signpost is replaced with the real content — no leftover
  forward-references to future phases in the shipped page.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope (all decisions carried forward
or derived from the Phase 12 proven pattern).

</deferred>

---
*Phase: 15-verification-failure-checks-and-publish-safety*
*Context gathered: 2026-04-18*
