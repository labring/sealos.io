---
phase: 16
slug: tutorial-template-baseline-and-expansion-map
status: complete
created: 2026-06-29
requirements:
  - BASE-01
  - BASE-02
  - BASE-03
---

# Phase 16 Research: Tutorial Template Baseline and Expansion Map

## Research Question

What does Phase 16 need to know before execution can lock the tutorial template
contract, React and Node.js expansion map, framework copy checklist, and
validator expansion plan?

## Source Evidence

### Current Tutorial Source Set

The current English tutorial set contains exactly three source pages:

| Stage | Slug | Source file | Image folder |
|-------|------|-------------|--------------|
| Beginner deploy | `deploy-nextjs-sealos` | `content/tutorials/deploy-nextjs-sealos/index.en.mdx` | `public/images/deploy-nextjs-sealos/` |
| PostgreSQL/full-stack | `nextjs-postgresql-sealos` | `content/tutorials/nextjs-postgresql-sealos/index.en.mdx` | `public/images/nextjs-postgresql-sealos/` |
| Production checklist | `nextjs-production-deployment-sealos` | `content/tutorials/nextjs-production-deployment-sealos/index.en.mdx` | `public/images/nextjs-production-deployment-sealos/` |

All three pages use the same frontmatter key family: `title`, `description`,
`date`, `updated`, `stage`, `framework`, `series`, `seriesOrder`,
`estimatedReadingTime`, `primaryKeyword`, `targetKeywords`, `tags`, `authors`,
`relatedTutorials`, `cta`, `faq`, and `howTo`.

### Tutorial Schema and Runtime Integration

`source.config.ts` defines the tutorial collection schema through Fumadocs. The
schema already supports the fields needed for React and Node.js tutorials:
`stage` is one of `beginner`, `advanced`, or `production`; `framework`,
`series`, `seriesOrder`, `primaryKeyword`, `targetKeywords`,
`relatedTutorials`, and `cta` are available without schema changes.

`lib/source.ts` exposes the `tutorials` loader with `/tutorials` as the base URL.
`lib/utils/tutorial-utils.ts` sorts tutorials by `series` and `seriesOrder`,
derives adjacent tutorials from matching `series`, and resolves
`relatedTutorials` by slug. This makes the Phase 16 series identifiers and
related graph a first-order contract for Phase 17 and Phase 18.

`app/[lang]/(home)/tutorials/tutorial-growth-data.ts` already contains the slug
generator that Phase 16 should adopt:

- deploy stage: `deploy-<framework>-sealos`
- PostgreSQL stage: `<framework>-postgresql-sealos`
- production stage: `<framework>-production-deployment-sealos`

For React and Node.js, this produces the locked target slugs already captured in
Phase 16 context:

- `deploy-react-sealos`
- `react-postgresql-sealos`
- `react-production-deployment-sealos`
- `deploy-nodejs-sealos`
- `nodejs-postgresql-sealos`
- `nodejs-production-deployment-sealos`

### Existing Body Pattern

The three Next.js tutorials share a stage-specific pattern rather than a
byte-for-byte body template:

| Stage | Reusable body contract |
|-------|------------------------|
| Beginner deploy | prerequisites, Sealos skill behavior, repo readiness, deploy prompt, analysis review, image/build/env/deploy steps, Runtime Truth Pass, `.sealos/` outputs, errors and fixes, next steps |
| PostgreSQL/full-stack | key takeaways, prerequisites, deployment model, example architecture, database-ready repo, full-stack prompt, generated app/database plan, production inputs, resource deployment, migrations, read/write verification, persistent storage guidance, errors and fixes |
| Production checklist | audience, plugin install, production model, readiness scorecard, build/image, `.sealos/` state, env vars, database/migrations, storage, domain/HTTPS, scaling, logs, backup, update/rollback, security, launch runbook, production failures, final checklist |

This pattern supports framework-specific rewriting while preserving Sealos
workflow language.

### Sealos Workflow Terms to Preserve

Phase 16 should instruct downstream phases to preserve these source-truth terms:

- native Codex install command: `codex plugin marketplace add labring/sealos-skills`
- native Claude Code install command: `claude plugin marketplace add labring/sealos-skills`
- compatibility installer form: `npx plugins add https://github.com/labring/sealos-skills --target ...`
- host invocation forms: `$sealos` and `/sealos`
- Runtime Truth Pass
- DEPLOY
- UPDATE
- `.sealos/analysis.json`
- `.sealos/template/index.yaml`
- `.sealos/state.json`

The React and Node.js tutorial bodies should change framework-specific
deployment details while retaining this Sealos vocabulary.

### Current Validator Shape

`scripts/validate-tutorials.mjs` currently hardcodes the three Next.js tutorial
slugs in `expected`. It enforces:

- English `index.en.mdx` existence for every expected slug.
- No `index.zh-cn.mdx` in the tutorial directories.
- No extra tutorial directories beyond `expected`.
- Required frontmatter keys.
- Rejection of raw SEO/admin frontmatter or body lines.
- Root-relative or external image references.
- `relatedTutorials` and `/tutorials/<slug>` links only to expected slugs.
- No `/blog/...` URLs for tutorial content.
- Required Sealos workflow phrases.
- No direct `/sealos-deploy`, `/sealos-database`, `/sealos-s3`, or `skills.sh`
  references.
- CTA constraints: `https://os.sealos.io` for the beginner signup tutorial and
  `/sealos-skills` for the PostgreSQL and production tutorials.

Phase 16 should plan a validator expansion document, while Phase 20 owns the
script changes and final expanded-set validation.

## Planning Implications

Phase 16 execution should produce planning artifacts, not tutorial bodies:

1. A template baseline document that records the reusable frontmatter, body,
   CTA, related-link, image, and validation contract with file-level evidence.
2. An expansion map that locks the six new React and Node.js slugs, image
   folders, stage, framework label, series identifier, order, and related graph.
3. A framework copy checklist that names the React and Node.js substitutions for
   setup, build, runtime, database, migration, production, and verification
   language while preserving Sealos Skills language.
4. A validator expansion plan that explains how the current validator should
   move from three expected slugs to nine expected slugs.

## Validation Architecture

Phase 16 validation is source and artifact validation. It should avoid builds,
live Sealos practice, screenshot generation, and validator implementation.

### Validation Targets

| Target | Validation method |
|--------|-------------------|
| Plan file visibility | `gsd-tools.cjs query phase-plan-index 16` sees all Phase 16 plans |
| Plan frontmatter | `gsd-tools.cjs query frontmatter.validate <plan> --schema plan` |
| Plan structure | `gsd-tools.cjs query verify.plan-structure <plan>` |
| Requirement coverage | `BASE-01`, `BASE-02`, and `BASE-03` appear in plan `requirements` fields |
| Decision coverage | `gsd-tools.cjs query check.decision-coverage-plan <phase_dir> <context_path>` |
| Baseline evidence during execute-phase | Targeted `rg` over the three Next.js tutorial files, `source.config.ts`, `lib/utils/tutorial-utils.ts`, `app/[lang]/(home)/tutorials/tutorial-growth-data.ts`, and `scripts/validate-tutorials.mjs` |
| Scope control during execute-phase | `git diff -- .planning/phases/16-tutorial-template-baseline-and-expansion-map .planning/STATE.md .planning/ROADMAP.md` |

### Feedback Sampling

The fastest feedback path for this phase is checking that each produced
planning document contains exact slug names, exact Sealos workflow terms, and
exact downstream ownership boundaries. The final execute-phase verifier should
record source assertions rather than running the full site build.

## Security Considerations

Phase 16 writes planning documents only. The main risks are documentation
tampering, accidental leakage of real credentials from copied evidence, and
validator guidance that allows unpublished routes or stale tutorial links. The
plans should require redaction guidance and exact slug/link tables to reduce
those risks.

## Package Legitimacy Audit

No package-manager install tasks are planned for Phase 16.

| Package | Ecosystem | Status | Reason |
|---------|-----------|--------|--------|
| N/A | N/A | N/A | Phase 16 produces planning documents only |

## Recommended Plan Breakdown

| Plan | Wave | Purpose | Requirements |
|------|------|---------|--------------|
| `16-01` | 1 | Create the template baseline and expansion map deliverables | BASE-01, BASE-02 |
| `16-02` | 2 | Create the framework copy checklist and validator expansion plan | BASE-02, BASE-03 |

## RESEARCH COMPLETE
