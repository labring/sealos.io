# Phase 27: Practice-Backed Tutorial Series - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution
> agents. Decisions are captured in `27-CONTEXT.md`; this log preserves the
> alternatives considered and the prior confirmations applied.

**Date:** 2026-07-16
**Phase:** 27-practice-backed-tutorial-series
**Areas discussed:** series shape and tags, page information architecture,
evidence authority, screenshot matrix and visual form, duration measurement,
practice ownership and cleanup, publication boundary
**Interaction source:** The user invoked `grill-with-docs`, confirmed each
decision branch repeatedly, invoked TDD, and explicitly directed autonomous
continuation. Phase 27 discussion therefore applied the confirmed choices
without reopening resolved questions.

---

## Series Shape and Immutable Source

| Option | Description | Selected |
|---|---|---|
| Two three-page framework series | Deploy, PostgreSQL, and production for FastAPI and Django, with one Reference Application per framework and one protected source tag per page | Yes |
| One broad page per framework | Combine all stages into two long pages | |
| Independent examples per page | Use unrelated applications and repositories for each stage | |

**User's choice:** Two coherent three-page series backed by the public
`yangchuansheng/sealos-fastapi-tutorial` and
`yangchuansheng/sealos-django-tutorial` repositories.

**Notes:** Slugs, series IDs, order, tags, framework labels, related links,
CTAs, Python 3.12, uv locks, requirements exports, and protected source tags
were confirmed before Phases 21-26 executed.

---

## Page Information Architecture

| Option | Description | Selected |
|---|---|---|
| Next.js stage parity | Preserve the deploy, PostgreSQL, and production structures, Sealos Skills language, frontmatter depth, CTA rules, and series navigation | Yes |
| Framework-native rewrite without shared structure | Use unique page organizations for FastAPI and Django | |
| Short command reference | Publish only clone, deploy, and curl commands | |

**User's choice:** Use the Next.js series as the structural template while
making every command, route, migration, runtime, and troubleshooting section
framework-native.

**Notes:** React and Node.js supply the current exact-four image density. The
existing page components already derive metadata, captions, adjacency, and
related links from MDX/frontmatter.

---

## Evidence Authority

| Option | Description | Selected |
|---|---|---|
| Protected source plus verified and fresh evidence | Use protected tag README/source, sealed Phase 21-26 evidence, and new run-owned practice for timing, domains, current Sealos surfaces, and screenshots | Yes |
| Source-only narrative | Infer deployment outcomes from tracked manifests and tests | |
| Illustrative output | Write plausible terminal and product output for readability | |

**User's choice:** Every claim and screenshot remains traceable to real source
or observed behavior.

**Notes:** Protected source and sealed evidence remain byte-stable. New Phase
27 practice fills the current product-surface, public-domain, and measured-time
gaps.

---

## Screenshot Matrix and Visual Form

| Option | Description | Selected |
|---|---|---|
| Exact four dark evidence cards per page | 24 unique 1440x900 WebP assets below 200 KB, each beside the step it proves | Yes |
| Variable density | Use as many screenshots as each page naturally produces | |
| Raw unframed captures | Place full terminal or browser captures directly in MDX | |

**User's choice:** Exact four-image density and the established dark
evidence-card form.

**Notes:** Real browser/application surfaces remain visible inside the card.
Terminal text comes from curated real output. Each image receives descriptive
alt/caption text, deterministic redaction, provenance, dimensions, size, and a
SHA-256 record. The 24-cell page/evidence matrix is locked in
`27-CONTEXT.md` D-11.

---

## Beginner Duration Claim

| Option | Description | Selected |
|---|---|---|
| Shared strict five-minute gate | Use `in 5 Minutes` in both beginner titles only when both clean fresh-reader runs reach public `/health` within 300 seconds | Yes |
| Independent title gate | Allow one framework title to use five minutes when only its run passes | |
| Evergreen titles only | Omit measured time from both titles | |

**User's choice:** Shared strict five-minute gate with retained start, end,
monotonic elapsed time, stage identity, workspace, and run ID.

**Notes:** The measured interval starts immediately before the Sealos deploy
request and ends after the generated public HTTPS `/health` returns the exact
successful payload. Both articles report their observed durations.

---

## Practice Ownership and Cleanup

| Option | Description | Selected |
|---|---|---|
| Run-owned full practice | Reproduce deployment, PostgreSQL, public domain, browser, admin, rollout, logs, rollback, recovery, and exact cleanup for both frameworks | Yes |
| Reuse historical runs only | Build screenshots only from existing retained evidence | |
| Keep live demos | Preserve deployed resources as long-running tutorial examples | |

**User's choice:** Fresh run-owned practice with zero retained live footprint.

**Notes:** Each attempt owns its Instance, workloads, Services, Ingresses,
Jobs, PostgreSQL resources, PVCs, Secrets, local processes, browser sessions,
render paths, and generated state. Durable outputs are public protected source,
accepted immutable images, redacted evidence, and final screenshots.

---

## Publication Boundary

| Option | Description | Selected |
|---|---|---|
| Fail-closed Phase 28 promotion | Phase 27 creates pages/assets/evidence; Phase 28 updates catalog availability and validator/static publication contracts after every Phase 27 gate passes | Yes |
| Immediate matrix promotion | Mark frameworks available as soon as MDX files exist | |
| Partial page release | Publish each completed page independently | |

**User's choice:** One fail-closed publication transition in Phase 28.

**Notes:** Missing provenance, timing, redaction, image, source-tag, or cleanup
evidence blocks the affected page and the catalog promotion.

---

## the agent's Discretion

- Framework accent colors inside the established visual system.
- One-panel versus two-panel evidence-card composition.
- Caption, FAQ, troubleshooting, and runbook wording within verified facts.
- Evidence package file split and capture/compression tooling.
- Run-owned resource names, bounded resources, and the Sealos Ingress mechanism
  used to preserve Django's upstream `Host: localhost` contract.

## Deferred Ideas

- Catalog availability, validator expansion, static route/image HTTP checks,
  index metadata updates, and milestone-wide cleanup are assigned to Phase 28.
- Localization, additional frameworks, recurring screenshot automation, and
  walkthrough videos remain future work.
