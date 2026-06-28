# Phase 16: Tutorial Template Baseline and Expansion Map - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-29
**Phase:** 16-Tutorial Template Baseline and Expansion Map
**Mode:** `$gsd-discuss-phase 16 --auto`
**Areas discussed:** Template Contract, Expansion Map, Framework-Specific Copy Checklist, Validator Expansion

---

## Template Contract

| Option | Description | Selected |
|--------|-------------|----------|
| Use the three Next.js tutorials as the canonical template family | Preserve the existing beginner, PostgreSQL, and production path as the source structure. | ✓ |
| Create a new generic article template first | Introduce a separate abstraction before writing React and Node.js tutorials. | |
| Let each new framework choose its own article shape | Optimize each article independently with fewer shared guarantees. | |

**User's choice:** Auto-selected the recommended existing-template option.
**Notes:** The roadmap and requirements explicitly say to use the three current
Next.js tutorials as templates. Current code already encodes the three-stage
journey and tutorial frontmatter schema.

---

## Expansion Map

| Option | Description | Selected |
|--------|-------------|----------|
| Follow the existing generated inventory slug pattern | Use `deploy-react-sealos`, `react-postgresql-sealos`, `react-production-deployment-sealos`, `deploy-nodejs-sealos`, `nodejs-postgresql-sealos`, and `nodejs-production-deployment-sealos`. | ✓ |
| Use SEO-title slugs independently per article | Choose per-article slugs from keyword phrasing. | |
| Put React and Node.js under nested framework directories | Change tutorial URL shape to framework grouping. | |

**User's choice:** Auto-selected the recommended existing-inventory option.
**Notes:** `tutorial-growth-data.ts` already generates the exact React and
Node.js slug pattern. Reusing it keeps public matrix intent, source filenames,
image folders, and validator expectations aligned.

---

## Framework-Specific Copy Checklist

| Option | Description | Selected |
|--------|-------------|----------|
| Preserve Sealos workflow language and replace only framework-specific app details | Keep Sealos Skills, Runtime Truth Pass, DEPLOY/UPDATE, and `.sealos/` guidance stable while adapting setup, build, runtime, database, migration, and verification wording. | ✓ |
| Rewrite each framework tutorial from scratch | Use the Next.js tutorials only as topic inspiration. | |
| Keep most Next.js copy and swap names late | Defer framework-specific language cleanup to validation. | |

**User's choice:** Auto-selected the recommended workflow-stable copy checklist.
**Notes:** Prior Phase 13 through Phase 15 decisions locked Sealos Skills
install, invocation, Runtime Truth Pass, and DEPLOY/UPDATE language. Phase 16
should make framework-specific replacement work explicit before body authoring.

---

## Validator Expansion

| Option | Description | Selected |
|--------|-------------|----------|
| Expand the current validator to the nine expected tutorial slugs | Preserve the existing checks and add framework-aware expectations. | ✓ |
| Build a new validator from scratch | Replace the existing validator with a new structure. | |
| Defer validator updates until final release | Add content first and update checks only in Phase 20. | |

**User's choice:** Auto-selected the recommended current-validator expansion.
**Notes:** `scripts/validate-tutorials.mjs` already checks expected slugs,
English-only source, frontmatter keys, related links, Sealos Skills CTA,
`/tutorials` routing integration, sitemap integration, and dark-mode routing.
Phase 16 records the expansion plan while later phases update code.

---

## the agent's Discretion

- The final Phase 16 plan may choose the artifact format for baseline notes and
  expansion maps.
- The planner may decide whether the validator expansion plan is a standalone
  document or a section inside the Phase 16 deliverable.

## Deferred Ideas

- Additional framework tutorial families after React and Node.js.
- Non-English tutorial localization.
- Browser walkthrough videos.
- Automated screenshot capture.
- Tutorial page visual redesign.
