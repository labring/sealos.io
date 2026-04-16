# Phase 13: Product Truth, Safe Example Contract, and Page Outline - Context

**Gathered:** 2026-04-16
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase audits the current English and Chinese `Object Storage` docs surface,
then locks the safe first-upload example contract, product-truth posture, and
single-page outline for the English v1.3 milestone. It does not yet rewrite the
English page body in full, expand Object Storage into multiple pages, or add SDK
integration, static hosting walkthrough, or monitoring guidance.

</domain>

<decisions>
## Implementation Decisions

### First-upload example strategy
- **D-01:** The canonical first-upload example should use the Sealos console UI
  (click the Upload button), not SDK or CLI code examples.
- **D-02:** The example path is: create bucket → get credentials (via console
  "Access Key" button) → upload file via console UI → verify in file list.
- **D-03:** SDK/CLI upload examples are deferred to a later milestone.

### Screenshot handling
- **D-04:** Claude's Discretion — the planning/execution phases decide screenshot
  treatment based on actual need: critical-step screenshots may reuse the Chinese
  `.zh-cn.png` with English alt text, purely decorative screenshots may be
  omitted, and the audit should inventory which of the 9 existing screenshots
  serve the first-upload path.

### Credential display strategy
- **D-05:** Use a console-guided approach: direct users to click the "Access Key"
  button in the console to view Access Key, Secret Key, Internal endpoint, and
  External endpoint. Do not display placeholder credential values in the page.
- **D-06:** This differs from the AI Proxy v1.2 pattern (environment variables
  first) because the Object Storage milestone is console-UI-first, not
  CLI/SDK-first.

### Permission level guidance
- **D-07:** The example bucket should use `private` permission (safest default).
- **D-08:** First-success verification = the uploaded file appears in the console
  file list. No public URL verification needed for the private bucket.
- **D-09:** The page should briefly explain all three permission levels (private,
  publicRead, publicReadWrite) but recommend `private` for the first bucket.

### Product-truth policy (carried from Phase 10 pattern)
- **D-10:** Use a mixed product-truth policy: stable and verified UI facts may be
  written as exact values; potentially unstable details (button labels, exact
  menu paths) should stay neutral until Phase 13 audit verifies them against the
  current worktree or live UI.

### Claude's Discretion
- The exact page outline section order and pacing, as long as it covers:
  overview, bucket creation, credential retrieval, file upload, and permission
  explanation.
- Which of the 9 Chinese screenshots to reuse, omit, or flag for replacement.
- The exact file type and size recommendation for the first upload example.
- Whether to include a brief mention of SDK/static hosting as "next steps" at
  the end of the page.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Object Storage docs surface
- `content/docs/guides/object-storage/index.en.mdx` — Current English page (empty body, Chinese frontmatter only)
- `content/docs/guides/object-storage/index.zh-cn.mdx` — Chinese factual source (~10.6K, comprehensive)
- `content/docs/guides/object-storage/images/` — 9 Chinese screenshots for audit

### Navigation
- `content/docs/guides/meta.en.json` — English navigation; `object-storage` already registered

### Prior milestone pattern reference
- `.planning/phases/10-product-truth-safe-example-contract-and-page-outline/10-CONTEXT.md` — AI Proxy Phase 10 context (analogous phase, different product)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- AI Proxy English page (`content/docs/guides/ai-proxy/index.en.mdx`) — proven
  single-page start-here pattern with frontmatter, overview, step-by-step
  walkthrough, and publish-safe metadata
- Phase 10 audit artifact pattern (`10-ai-proxy-audit.md`,
  `10-safe-example-contract.md`, `10-page-outline-spec.md`) — reusable document
  structure for Object Storage equivalents

### Established Patterns
- fumadocs MDX components: `Tabs`, `Tab`, `Callout`, `div.fd-steps` for
  step-by-step guides
- English frontmatter: title, keywords, description all in English
- Single-leaf page posture: no `meta.en.json` child entries

### Integration Points
- `content/docs/guides/meta.en.json` — `object-storage` entry already present
- Cross-references to App Deploy custom domain docs (for static hosting mention
  in future milestones)

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches following the proven
Phase 10 audit + contract + outline pattern.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 13-product-truth-safe-example-contract-and-page-outline*
*Context gathered: 2026-04-16*
