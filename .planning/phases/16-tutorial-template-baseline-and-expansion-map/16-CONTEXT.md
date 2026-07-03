# Phase 16: Tutorial Template Baseline and Expansion Map - Context

**Gathered:** 2026-06-29
**Status:** Ready for planning
**Mode:** `$gsd-discuss-phase 16 --auto`

<domain>
## Phase Boundary

Phase 16 produces the durable baseline that Phase 17 through Phase 20 will use
to expand the current three-page Next.js tutorial path into React and Node.js
tutorial paths. This phase locks the tutorial template contract, the React and
Node.js slug and asset map, the related-tutorial graph, the framework-specific
copy checklist, and the validator expansion approach. It does not author new
tutorial bodies, create screenshots, update validator code, or verify the
expanded tutorial set.

</domain>

<decisions>
## Implementation Decisions

### Template Contract

- **D-01:** Use the three existing Next.js tutorials as the canonical template
  family:
  `deploy-nextjs-sealos`, `nextjs-postgresql-sealos`, and
  `nextjs-production-deployment-sealos`.
- **D-02:** Preserve the three-stage taxonomy already encoded in
  `app/[lang]/(home)/tutorials/tutorial-growth-data.ts`: deploy, PostgreSQL,
  and production.
- **D-03:** Preserve the Fumadocs tutorial frontmatter contract from
  `source.config.ts`: `title`, `description`, `date`, optional `updated`,
  `stage`, `framework`, `series`, `seriesOrder`,
  optional `estimatedReadingTime`, `primaryKeyword`, `targetKeywords`, `tags`,
  `authors`, `relatedTutorials`, `cta`, optional `faq`, and optional `howTo`.
- **D-04:** Keep tutorial details English-only in this milestone. New tutorial
  source files use `index.en.mdx`; localized `index.zh-cn.mdx` files remain out
  of scope.
- **D-05:** Preserve the current CTA pattern: beginner deployment tutorials use
  `Start free on Sealos` with `https://os.sealos.io`; PostgreSQL and production
  tutorials use `Open Sealos Skills` with `/sealos-skills`.
- **D-06:** Preserve the current image convention: screenshots are referenced
  from root-relative `/images/<tutorial-slug>/<asset>.webp` paths. Shared
  product/plugin screenshots may stay shared only when they are still true for
  the new tutorial step.

### Expansion Map

- **D-07:** React tutorial slugs are locked to the existing inventory pattern:
  `deploy-react-sealos`, `react-postgresql-sealos`, and
  `react-production-deployment-sealos`.
- **D-08:** Node.js tutorial slugs are locked to the existing inventory pattern:
  `deploy-nodejs-sealos`, `nodejs-postgresql-sealos`, and
  `nodejs-production-deployment-sealos`.
- **D-09:** New tutorial image folders match tutorial slugs:
  `public/images/deploy-react-sealos/`,
  `public/images/react-postgresql-sealos/`,
  `public/images/react-production-deployment-sealos/`,
  `public/images/deploy-nodejs-sealos/`,
  `public/images/nodejs-postgresql-sealos/`, and
  `public/images/nodejs-production-deployment-sealos/`.
- **D-10:** Series identifiers are locked to `sealos-skills-react` and
  `sealos-skills-nodejs`.
- **D-11:** Series ordering mirrors the Next.js path: deploy is order 1 with
  `stage: beginner`, PostgreSQL is order 2 with `stage: advanced`, and
  production is order 3 with `stage: production`.
- **D-12:** Related tutorial links stay inside each framework's three-page
  series. Beginner links to PostgreSQL and production; PostgreSQL links to
  beginner and production; production links to beginner and PostgreSQL.
- **D-13:** Framework labels are `React` and `Node.js`. Tags include
  `tutorial`, `sealos-skills`, the framework key (`react` or `nodejs`), and
  `deployment`.

### Framework-Specific Copy Checklist

- **D-14:** Preserve Sealos Skills workflow language from the current Next.js
  tutorials: native Codex and Claude Code plugin install commands,
  `$sealos`, `/sealos`, Runtime Truth Pass, DEPLOY, UPDATE,
  `.sealos/analysis.json`, `.sealos/template/index.yaml`, and
  `.sealos/state.json`.
- **D-15:** React beginner content should replace Next.js-specific routing,
  server rendering, and standalone output language with React frontend app
  language: Vite or equivalent SPA setup, static build output, containerized
  web serving, runtime port exposure, public URL smoke checks, and environment
  variable guidance for browser-safe `VITE_` or documented equivalents.
- **D-16:** React PostgreSQL content should treat PostgreSQL as a full-stack app
  pattern that needs an API/service layer, server-side database access, env-key
  mapping, migrations or schema setup, and browser-to-API verification. It
  should avoid implying that a pure static React bundle connects directly to
  PostgreSQL.
- **D-17:** React production content should emphasize build output, static app
  serving, API/service coupling when present, environment classification,
  domain/HTTPS, logs, health checks, rollback, and Runtime Truth Pass.
- **D-18:** Node.js beginner content should replace Next.js app language with
  service runtime language: server entrypoint, package scripts, port binding,
  health endpoint, container start command, logs, and public URL smoke checks.
- **D-19:** Node.js PostgreSQL content should emphasize service/database
  coupling, database env-key detection, migrations, read/write verification,
  connection pooling awareness, runtime logs, and generated Sealos resource
  review.
- **D-20:** Node.js production content should emphasize process management,
  health checks, readiness, logs, env vars, database migrations, rollback,
  image tags, resource footprint, and Runtime Truth Pass.

### Validator Expansion

- **D-21:** Expand `scripts/validate-tutorials.mjs` from the current three
  hardcoded Next.js slugs to the nine expected tutorial slugs.
- **D-22:** Keep the existing validator guarantees: require English source,
  reject unexpected localized tutorial files, reject unknown `/tutorials/<slug>`
  links, require frontmatter keys, reject raw SEO/admin keys, require
  `/sealos-skills` CTA where applicable, require `https://os.sealos.io` for
  beginner signup CTAs, and keep `/tutorials` integration checks.
- **D-23:** Add framework-aware validator expectations so React and Node.js
  pages prove required Sealos Skills terms while avoiding stale Next.js-only
  copy in new framework bodies.
- **D-24:** Keep final image validation for Phase 19 and Phase 20. Phase 16
  records the planned image folders and image-reference pattern only.

### the agent's Discretion

The planner may choose the exact document shape for Phase 16 deliverables as
long as it records the baseline contract, slug map, image map, related graph,
copy checklist, and validator expansion plan with file-level references.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project and Roadmap

- `.planning/PROJECT.md` — Milestone scope, current tutorial set, prior
  evidence workflow, constraints, and language policy.
- `.planning/REQUIREMENTS.md` — Phase 16 requirements BASE-01, BASE-02, and
  BASE-03 plus downstream React, Node.js, screenshot, and validation
  requirements.
- `.planning/ROADMAP.md` — Phase 16 goal, deliverables, success criteria,
  likely files, and validation approach.
- `.planning/STATE.md` — Prior Phase 13 through Phase 15 tutorial decisions
  that must carry forward.

### Existing Tutorial Templates

- `content/tutorials/deploy-nextjs-sealos/index.en.mdx` — Beginner deploy
  tutorial template, beginner CTA, install section, deploy flow, Runtime Truth
  Pass, `.sealos/` state expectations, image references, and next-step links.
- `content/tutorials/nextjs-postgresql-sealos/index.en.mdx` — PostgreSQL
  full-stack tutorial template, database env-key language, one-request
  deployment model, migration guidance, and PostgreSQL verification pattern.
- `content/tutorials/nextjs-production-deployment-sealos/index.en.mdx` —
  Production checklist template, DEPLOY/UPDATE rules, Runtime Truth Pass,
  environment, database, storage, scaling, logs, backup, rollback, security,
  runbook, and failure taxonomy.

### Tutorial Integration Code

- `source.config.ts` — Tutorial collection schema and frontmatter contract.
- `lib/source.ts` — `tutorials` Fumadocs loader with `/tutorials` base URL.
- `lib/utils/tutorial-utils.ts` — Tutorial sorting, stage labels, summaries,
  adjacent navigation, related tutorials, and keyword extraction.
- `lib/utils/tutorial-metadata.ts` — Tutorial detail metadata, canonical URL,
  Open Graph, Twitter, authors, keywords, and English article metadata.
- `app/[lang]/(home)/tutorials/page.tsx` — Tutorial index metadata,
  structured data, English noindex handling for non-English route exports, and
  current public index composition.
- `app/[lang]/(home)/tutorials/[slug]/page.tsx` — Tutorial detail rendering,
  English page lookup, MDX image caption behavior, FAQ rendering, and static
  params.
- `app/[lang]/(home)/tutorials/tutorial-growth-data.ts` — Existing framework
  inventory, generated slug pattern, stage definitions, and React/Node.js
  "coming next" status.
- `app/[lang]/(home)/tutorials/TutorialFrameworkMatrix.tsx` — Matrix behavior
  that currently treats available tutorials differently from requestable paths.
- `app/[lang]/(home)/tutorials/TutorialJourneyRail.tsx` — Current three-stage
  public journey and available tutorial cards.
- `app/sitemap.ts` — Sitemap inclusion for English tutorial detail pages.
- `app/[lang]/utils/is-forced-dark-mode.ts` — `/tutorials` forced dark-mode
  route behavior.

### Validation and Assets

- `scripts/validate-tutorials.mjs` — Current tutorial validator that should be
  expanded from three expected slugs to nine expected slugs.
- `public/images/deploy-nextjs-sealos/` — Beginner tutorial image folder
  convention.
- `public/images/nextjs-postgresql-sealos/` — PostgreSQL tutorial WebP image
  folder convention.
- `public/images/nextjs-production-deployment-sealos/` — Production tutorial
  WebP image folder convention.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- `source.config.ts` tutorial schema already supports the needed frontmatter
  fields for React and Node.js pages without schema changes.
- `lib/source.ts` exposes a `tutorials` loader with `baseUrl: '/tutorials'`;
  new content should become available through the loader once source files are
  added and generated.
- `lib/utils/tutorial-utils.ts` sorts by `series` then `seriesOrder`; series
  names and ordering must be chosen before bodies are added.
- `app/[lang]/(home)/tutorials/tutorial-growth-data.ts` already contains the
  slug generator for React and Node.js: `deploy-<framework>-sealos`,
  `<framework>-postgresql-sealos`, and
  `<framework>-production-deployment-sealos`.
- `scripts/validate-tutorials.mjs` already encodes most repository-level
  tutorial publication rules and is the right expansion point for Phase 20.

### Established Patterns

- Tutorial pages are English-only. `getTutorialPage` returns `undefined` for
  non-English detail requests, and the index marks non-English tutorial exports
  as noindex.
- The public tutorial catalog has three stages: deploy, PostgreSQL, and
  production. This stage structure is already used by the journey rail and
  framework matrix.
- Existing tutorial images are referenced with root-relative paths under
  `/images/<slug>/...`. Current PostgreSQL and production screenshot assets are
  WebP; the older beginner assets are PNG and can remain as existing baseline
  assets until a future image cleanup phase.
- The validator rejects unknown tutorial links by comparing `/tutorials/<slug>`
  references against its expected slug set. The expected set must change before
  new React and Node.js cross-links are committed.

### Integration Points

- New tutorial source files connect through `content/tutorials/<slug>/index.en.mdx`.
- New screenshot assets connect through `public/images/<slug>/*.webp`.
- Tutorial listing, detail generation, sitemap output, metadata, related links,
  adjacent navigation, and framework matrix behavior depend on Fumadocs source
  generation plus `lib/utils/tutorial-utils.ts`.
- Phase 17 and Phase 18 can add tutorial content and temporary screenshot
  references only after Phase 16 has finalized slug and related-link contracts.
- Phase 19 owns real Sealos practice evidence, redaction, final screenshot
  production, WebP conversion, dimension checks, and MDX asset wiring.
- Phase 20 owns validator code updates, final source checks, image checks,
  TypeScript/content validation, and release readiness.

</code_context>

<specifics>
## Specific Ideas

- Keep the tutorial family discoverable as a matrix of framework paths by
  launch job. React and Node.js are "coming next" entries already represented
  by `tutorial-growth-data.ts`.
- Use one framework-local related graph per series to keep readers moving
  through beginner, PostgreSQL, and production for the same ecosystem.
- Keep the Sealos workflow language source-stable across frameworks so the
  expansion changes framework details while preserving deployment truth.
- Use the React PostgreSQL tutorial to teach a full-stack shape with an API or
  service layer, because a static React app alone has no safe direct database
  path.
- Use the Node.js production tutorial to focus on service runtime operations:
  process, port, health, logs, update, rollback, and Runtime Truth Pass.

</specifics>

<deferred>
## Deferred Ideas

- Additional framework tutorial families such as FastAPI, Django, Go, and
  Spring Boot stay in future phases after React and Node.js are complete.
- Non-English tutorial localization stays out of this milestone.
- Browser walkthrough videos and automated screenshot capture stay future
  requirements.
- Visual redesign of tutorial pages stays out of scope for this milestone.

</deferred>

---

*Phase: 16-Tutorial Template Baseline and Expansion Map*
*Context gathered: 2026-06-29*
