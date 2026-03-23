# Phase 1: Inventory, Terminology, and Target Taxonomy - Context

**Gathered:** 2026-03-23
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase audits the current English `App Deploy` docs and defines the target information architecture, page roles, naming rules, and slug migration strategy for the restructure. It does not author the new first-deploy tutorial or rewrite the operational pages themselves.

</domain>

<decisions>
## Implementation Decisions

### Target IA shape
- **D-01:** The target App Deploy structure should use three primary user-intent entry paths: `first-deploy`, `manage`, and `troubleshoot`.
- **D-02:** `Migrate from Docker Compose` should be visible as a distinct intent on the landing page, but it should still live within the broader post-success/manage information architecture rather than becoming a fourth top-level taxonomy group.

### Canonical terminology
- **D-03:** Navigation labels, directory/group naming, and page titles should use `App Deploy` as the canonical documentation theme name.
- **D-04:** `App Launchpad` should only appear when referring to the real Sealos product module, UI surface, or button labels. It is not the canonical docs-section name.
- **D-05:** The docs should treat `App Deploy` and `App Launchpad` as different layers of naming, not as conflicting aliases: `App Deploy` is the topic area; `App Launchpad` is a product/UI term.
- **D-06:** Legacy naming should be handled minimally: only the landing/router page should introduce the relationship once, using wording equivalent to `App Deploy (in the App Launchpad UI)` or similar. Downstream pages should otherwise use `App Deploy` unless referencing exact UI copy.

### URL and migration strategy
- **D-07:** Information architecture clarity takes priority over preserving the current flat slug set.
- **D-08:** Phase 1 must produce a complete `old -> new` mapping table for every renamed, regrouped, or relocated English App Deploy page.
- **D-09:** Redirects, aliases, or equivalent migration handling for changed slugs must be treated as a rollout gate in the final validation phase rather than an optional cleanup.

### Phase 1 deliverables
- **D-10:** Phase 1 should produce a full foundation package, not just a lightweight inventory.
- **D-11:** The expected outputs include: current-page inventory, target tree, page-role classification, terminology table, slug mapping, and frontmatter/schema recommendations that help later phases plan content consistently.

### the agent's Discretion
- The exact folder-level implementation of the target tree inside Fumadocs may be decided during planning, as long as it preserves the locked user-intent structure.
- The exact names of schema fields may be decided during planning, as long as they support page-role clarity, prerequisites, and cross-linking.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project scope and requirements
- `.planning/PROJECT.md` — Core value, scope boundaries, platform constraints, and user-approved direction for the restructure
- `.planning/REQUIREMENTS.md` — Phase-aligned v1 requirements and roadmap traceability
- `.planning/ROADMAP.md` — Phase 1 goal, dependencies, and success criteria
- `.planning/STATE.md` — Current project position and known planning concerns

### Research that informs Phase 1
- `.planning/research/SUMMARY.md` — Executive synthesis of stack, IA, pitfalls, and roadmap implications
- `.planning/research/FEATURES.md` — Table stakes and anti-features for deployment-doc information architecture
- `.planning/research/ARCHITECTURE.md` — Recommended tutorial/task/troubleshoot split and target content-tree patterns
- `.planning/research/PITFALLS.md` — Failure modes to prevent during IA design, naming cleanup, and rollout planning
- `.planning/research/STACK.md` — Constraints and recommendations for keeping the current Next.js + Fumadocs + MDX stack

### Current App Deploy source of truth
- `content/docs/guides/app-deploy/meta.en.json` — Current flat navigation definition for English App Deploy
- `content/docs/guides/app-deploy/index.en.mdx` — Current landing page behavior, feature-catalog framing, and stale links
- `content/docs/guides/app-deploy/create-app.en.mdx` — Evidence that the existing "create app" page is too thin to serve as the canonical first-deploy path
- `content/docs/guides/app-deploy/docker-compose-migration.en.mdx` — Evidence that migration content currently exists as a thin page and needs repositioning
- `content/docs/guides/app-deploy/update-apps.en.mdx` — Evidence that some operational pages are too thin and need consolidation or rewrite

### Docs platform integration points
- `source.config.ts` — Current docs/frontmatter schema entry point; likely place for section-level schema extension
- `lib/source.ts` — Fumadocs source loader and page-tree integration
- `app/[lang]/docs/[[...slug]]/page.tsx` — Current docs rendering flow and page metadata usage
- `.planning/codebase/STRUCTURE.md` — Repo structure and docs-system layout
- `.planning/codebase/CONVENTIONS.md` — Content and docs conventions already used in the repo

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `content/docs/guides/app-deploy/meta.en.json`: existing sidebar control surface that can be rewritten into a journey-led structure
- `source.config.ts`: existing Zod-backed content schema entry point, suitable for adding docs-specific frontmatter fields if planning decides to do so
- `lib/source.ts`: existing Fumadocs loader setup, already supports page-tree-driven navigation without framework changes

### Established Patterns
- English docs use locale-suffixed MDX files under `content/docs/`
- Fumadocs navigation is file- and meta-driven rather than hard-coded in React components
- Docs rendering in `app/[lang]/docs/[[...slug]]/page.tsx` expects standard title/description/frontmatter-driven content

### Integration Points
- App Deploy IA changes will connect through `content/docs/guides/app-deploy/` content files and `meta.en.json`
- Any schema or content-model refinement will connect through `source.config.ts`
- Any final navigation and route validation will flow through the existing docs loader/rendering pipeline in `lib/source.ts` and `app/[lang]/docs/[[...slug]]/page.tsx`

</code_context>

<specifics>
## Specific Ideas

- The section should optimize for a new user reaching first successful deployment before encountering day-2 topics.
- Landing-page structure should explicitly separate the docs theme name (`App Deploy`) from the product-module/UI name (`App Launchpad`).
- Migration should be highly visible as a distinct user intent, but should not distort the primary three-part taxonomy.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 01-inventory-terminology-and-target-taxonomy*
*Context gathered: 2026-03-23*
