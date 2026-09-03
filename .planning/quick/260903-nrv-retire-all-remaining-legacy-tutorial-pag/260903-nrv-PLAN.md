---
phase: 260903-nrv-retire-all-remaining-legacy-tutorial-pag
plan: "01"
type: execute
wave: 1
depends_on: []
files_modified:
  - content/tutorials/
  - public/images/
  - app/[lang]/(home)/tutorials/tutorial-growth-data.ts
  - app/[lang]/(home)/tutorials/TutorialFrameworkMatrix.tsx
  - app/[lang]/(home)/tutorials/TutorialJourneyRail.tsx
  - app/[lang]/(home)/tutorials/page.tsx
  - scripts/validate-tutorials.mjs
  - scripts/validate-tutorials.test.mjs
  - scripts/python-tutorial-assets.mjs
  - scripts/python-tutorial-assets.test.mjs
  - scripts/check-static-output.test.mjs
  - vercel.json
  - public/_redirects
autonomous: true
requirements:
  - L-01
  - L-02
  - L-03
  - L-04
  - L-05
estimate:
  tasks: 2
  confidence: high
must_haves:
  truths:
    - "L-01: /tutorials/django/deploy/ is the only published tutorial page."
    - "L-02: All 12 retired flat tutorial content directories and their 54 public images are absent."
    - "L-03: The FastAPI-only python tutorial asset generator and its focused test are absent because they have no remaining consumer."
    - "L-04: Only Django Deploy is available in the public tutorial matrix; retired framework opportunities are planned and the primary CTA resolves to Django Core."
    - "L-05: Every slash and non-slash variant of the 12 retired URLs permanently redirects to /tutorials/ in both Vercel and Cloudflare Pages configuration."
  artifacts:
    - path: "content/tutorials/django/deploy/index.en.mdx"
      provides: "The sole published Tutorial detail page"
    - path: "app/[lang]/(home)/tutorials/tutorial-growth-data.ts"
      provides: "Opportunity-level publication state"
    - path: "vercel.json"
      provides: "Vercel retirement redirects"
    - path: "public/_redirects"
      provides: "Cloudflare Pages retirement redirects"
    - path: "scripts/validate-tutorials.mjs"
      provides: "Single-page Tutorial publication gate"
  key_links:
    - from: "app/[lang]/(home)/tutorials/tutorial-growth-data.ts"
      to: "app/[lang]/(home)/tutorials/TutorialFrameworkMatrix.tsx"
      via: "available status controls published links"
      pattern: "getTutorialFrameworkMatrix"
    - from: "vercel.json"
      to: "public/_redirects"
      via: "matching 308 redirect contracts"
      pattern: "/tutorials/"
    - from: "content/tutorials/django/deploy/index.en.mdx"
      to: "scripts/validate-tutorials.mjs"
      via: "recursive content discovery and published-link validation"
      pattern: "findTutorialFiles"
---

<objective>
Retire all remaining legacy flat Tutorial pages and align every active public surface with the opportunity matrix.

Purpose: Remove outdated content and evidence while preserving the qualified Django Core tutorial and future demand-capture opportunities.
Output: One published Tutorial, a truthful matrix, clean public assets, dead-pipeline removal, and cross-host permanent redirects.
</objective>

<context>
The user confirmed deletion of the 12 flat Next.js, React, Node.js, and FastAPI pages, including their current uncommitted migration edits. Their 54 dedicated images and the orphaned FastAPI asset generator are also retired. Internal `.planning/` history remains. The existing catch-all Tutorial route, shared Blog visual primitives, Django Core content, two Django Core proof images, and existing Django legacy redirects remain in place.

The strategy matrix already uses hierarchical replacement URLs and marks those opportunities as Research or Planned. The 12 old flat URLs redirect to `/tutorials/` until qualified replacements publish.
</context>

<tasks>

<task type="tracer" tdd="true">
  <name>Task 1: Lock the retirement and redirect contracts</name>
  <files>scripts/validate-tutorials.test.mjs, scripts/check-static-output.test.mjs</files>
  <action>Update the Tutorial validator acceptance test from 13 pages to the sole Django Core page. Add an exact redirect-parity contract for slash and non-slash variants of all 12 retired flat URLs, each targeting `/tutorials/` with 308 semantics on Vercel and Cloudflare Pages. Run the focused tests and retain their expected failures before implementation.</action>
  <verify>node --test scripts/validate-tutorials.test.mjs scripts/check-static-output.test.mjs</verify>
  <done>The tests encode one public Tutorial and all 24 retired URL variants, and fail against the current implementation for the expected reasons.</done>
</task>

<task type="auto">
  <name>Task 2: Remove legacy surfaces and align active publication state</name>
  <files>content/tutorials/, public/images/, app/[lang]/(home)/tutorials/tutorial-growth-data.ts, app/[lang]/(home)/tutorials/TutorialFrameworkMatrix.tsx, app/[lang]/(home)/tutorials/TutorialJourneyRail.tsx, app/[lang]/(home)/tutorials/page.tsx, scripts/validate-tutorials.mjs, scripts/python-tutorial-assets.mjs, scripts/python-tutorial-assets.test.mjs, vercel.json, public/_redirects</files>
  <action>Delete the 12 confirmed legacy MDX files, their 12 image directories containing 54 assets, and the orphaned Python Tutorial asset generator plus its test. Change publication status so Django Deploy is the only available opportunity; keep the retired framework opportunities visible as planned demand-capture cells and use the matrix authority's hierarchical slugs. Update index metadata, hero copy, featured card framework label, default badge, explanatory copy, primary CTA, and fallback URL around Django Core. Change the validator to require one page. Add matching permanent redirects for both path variants of every retired slug in Vercel and Cloudflare Pages configuration. Preserve all unrelated working-tree changes.</action>
  <verify>pnpm validate-tutorials &amp;&amp; node --test scripts/validate-tutorials.test.mjs scripts/check-static-output.test.mjs &amp;&amp; pnpm lint &amp;&amp; pnpm build &amp;&amp; pnpm static-output:check &amp;&amp; git diff --check</verify>
  <done>All five requirements hold, generated static output contains only Django Core Tutorial content, and the local preview renders the updated matrix.</done>
</task>

</tasks>

<verification>
1. Verify focused Tutorial and redirect tests.
2. Run TypeScript validation and a production static export.
3. Confirm the sole Tutorial output at `out/tutorials/django/deploy/index.html`.
4. Confirm every retired content and image directory is absent from source and static output.
5. Request all 12 retired local-preview URLs and confirm their source pages are unavailable while `/tutorials/` and Django Core render successfully; production redirect semantics remain covered by both host configurations.
</verification>

<success_criteria>
- Exactly one Tutorial MDX file remains.
- All retired public content, dedicated images, and orphaned generator code are removed.
- The public matrix exposes one available opportunity and uses planned cells for future demand capture.
- Vercel and Cloudflare Pages share the exact 24 permanent redirect rules.
- Focused tests, TypeScript, production build, static-output validation, and local visual checks pass.
</success_criteria>
