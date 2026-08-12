---
quick_id: 260812-nea
status: complete
created: 2026-08-12
must_haves:
  truths:
    - The Sealos Skills hub presents nine real coding Agents as links to dedicated install pages and keeps skills.sh as a separate distribution channel.
    - Every Agent detail page provides a verified host-specific install path, three-step Quick Start, deployment evidence, prompts, FAQs, and resources.
    - The same typed Agent data drives UI copy, metadata, structured data, related links, and analytics identifiers.
    - All localized static routes, canonical URLs, sitemap entries, keyboard flows, and responsive layouts remain valid.
  artifacts:
    - app/[lang]/(home)/sealos-skills/content.ts
    - app/[lang]/(home)/sealos-skills/components.tsx
    - app/[lang]/(home)/sealos-skills/[agent]/page.tsx
    - app/[lang]/(home)/sealos-skills/[agent]/agent-guide-page.tsx
    - tests/sealos-skills-page.test.ts
  key_links:
    - AGENT_GUIDES feeds both the hub directory and generateStaticParams for the detail route.
    - Agent install and FAQ data feed rendered Quick Start content and detail-page JSON-LD.
    - Agent IDs feed internal URLs and unique Rybbit event IDs.
---

# Quick Task 260812-nea: Agent-specific Sealos Skills pages

## Goal

Build an Insforge-style Agent acquisition and installation architecture for
Sealos Skills while preserving the page's evidence-led deployment story and
static localized route contracts.

## Task 1: Extend typed Agent content and rebuild the hub directory

**Files:**
- `app/[lang]/(home)/sealos-skills/content.ts`
- `app/[lang]/(home)/sealos-skills/components.tsx`
- `app/[lang]/(home)/sealos-skills/top-sections.tsx`
- `app/[lang]/(home)/sealos-skills/interactive-sections.tsx`
- `app/[lang]/(home)/sealos-skills/shared.tsx`
- `public/images/sealos-skills/agent-icons/*`

**Action:**
- Expand `AGENT_TARGETS` with official descriptions, sources, availability,
  native installation steps, prompts, FAQs, resources, related IDs, and local
  official icons.
- Replace the consolidated install tab/accordion with a nine-card Agent
  Directory after the hero plus one skills.sh distribution row.
- Preserve the hero copy action, established deep-link anchors, evidence
  sections, copy accessibility, reduced motion, and unique directory analytics.

**Verify:**
- The hub renders nine Agent links in the locked order and one distinct
  `skills.sh` action.
- Every local icon resolves and has a recorded official source.
- Existing hero and downstream sections preserve their required anchors.

**Done:**
- The landing page gives visitors one immediate Agent choice and routes each
  choice into a dedicated installation journey.

## Task 2: Build the data-driven Agent detail route

**Files:**
- `app/[lang]/(home)/sealos-skills/[agent]/page.tsx`
- `app/[lang]/(home)/sealos-skills/[agent]/agent-guide-page.tsx`
- `app/[lang]/(home)/sealos-skills/content.ts`
- `app/sitemap.ts` or the repository's current sitemap source

**Action:**
- Generate nine statically exported routes from the typed Agent IDs and return
  `notFound()` for unsupported slugs.
- Render the shared detail skeleton with host-specific Quick Start, evidence,
  prompts, FAQs, resources, related Agents, and copy actions.
- Generate per-Agent metadata, canonical/alternate URLs, `HowTo`, `FAQPage`,
  and `BreadcrumbList` schemas from the same data.
- Add Agent-derived Rybbit IDs for directory opens, install copies, prompt
  copies, and source visits.

**Verify:**
- All nine default-locale and nine `/zh-cn` URLs appear in static output and the
  sitemap.
- Metadata, JSON-LD, internal links, and displayed install facts match each
  Agent's data record.
- Sticky navigation, copy feedback, and keyboard focus work on desktop/mobile.

**Done:**
- Every supported Agent has a substantial, indexable install and activation
  page with a direct conversion action and reviewable deployment outcome.

## Task 3: Lock contracts and validate production output

**Files:**
- `tests/sealos-skills-page.test.ts`
- `tests/rybbit-cta.test.ts`
- `.planning/quick/260812-nea-build-nine-agent-specific-sealos-skills-/260812-nea-SUMMARY.md`
- `.planning/quick/260812-nea-build-nine-agent-specific-sealos-skills-/260812-nea-VERIFICATION.md`
- `.planning/STATE.md`

**Action:**
- Extend source-contract tests for page ordering, nine routes, native install
  facts, content uniqueness, official icon assets, schemas, internal links,
  metadata, and all analytics IDs.
- Run focused tests, TypeScript, production build, locale/static route/static
  output checks, formatting, and `git diff --check`.
- Run browser QA at 1440x1000 and 390x844 for the hub plus representative
  plugin, extension, and repository-import pages.

**Verify:**
- All named automated checks pass.
- Browser QA confirms complete first views, sticky anchors, copy state,
  responsive Agent cards, zero horizontal overflow, and reduced-motion behavior.

**Done:**
- Repository tests and visual evidence demonstrate the complete hub-to-Agent
  install flow across static localized output.
