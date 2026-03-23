# Phase 1: Inventory, Terminology, and Target Taxonomy - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-23
**Phase:** 01-inventory-terminology-and-target-taxonomy
**Areas discussed:** Target tree shape, canonical terminology, slug migration posture, Phase 1 output depth, Docker Compose migration placement, legacy naming transition, slug compatibility scope

---

## Target tree shape

| Option | Description | Selected |
|--------|-------------|----------|
| A | `first-deploy + manage + troubleshoot` three-path structure | ✓ |
| B | `first-deploy + task library` without a distinct troubleshoot group | |
| C | Keep one flat directory and only rebalance order/weight | |
| D | the agent decides | |

**User's choice:** A
**Notes:** User approved a three-path, intent-led structure rather than a flat feature list.

---

## Canonical terminology

| Option | Description | Selected |
|--------|-------------|----------|
| A | Canonical docs term is `App Deploy` | ✓ |
| B | Canonical docs term is `App Launchpad` | |
| C | Keep both names in equal long-term use | |
| D | the agent decides | |

**User's choice:** A, with clarification
**Notes:** User clarified that `App Launchpad` is a Sealos module/UI name, while `App Deploy` is the broader documentation topic, so they should not be treated as conflicting aliases.

---

## Slug migration posture

| Option | Description | Selected |
|--------|-------------|----------|
| A | Prioritize clear IA and allow slug changes with explicit mapping/redirect planning | ✓ |
| B | Preserve most current slugs and only fix obvious breakage | |
| C | Do not change slugs in this milestone | |
| D | the agent decides | |

**User's choice:** A
**Notes:** User is comfortable with larger IA and URL changes if they improve the journey.

---

## Phase 1 output depth

| Option | Description | Selected |
|--------|-------------|----------|
| A | Produce inventory, target tree, page roles, terminology table, slug mapping, and schema/frontmatter recommendations | ✓ |
| B | Produce only inventory, target tree, and naming/slug principles | |
| C | Produce inventory only | |
| D | the agent decides | |

**User's choice:** A
**Notes:** User wants Phase 1 to leave downstream planner/researcher with a strong foundation package, not just a diagnosis.

---

## Docker Compose migration placement

| Option | Description | Selected |
|--------|-------------|----------|
| A | Show migration as a distinct landing-page intent, but keep it inside the broader manage/migration architecture | ✓ |
| B | Only surface migration inside manage | |
| C | Make migration a fourth top-level taxonomy branch | |
| D | the agent decides | |

**User's choice:** A
**Notes:** Migration should be visible early, but should not replace the primary three-part IA.

---

## Legacy naming transition

| Option | Description | Selected |
|--------|-------------|----------|
| A | Navigation/titles use `App Deploy`; only mention `App Launchpad` when referring to real UI/module labels | ✓ |
| B | Use dual titles such as `App Deploy / App Launchpad` | |
| C | Repeat legacy naming notes across most migrated pages | |
| D | the agent decides | |

**User's choice:** A
**Notes:** User confirmed that topic-level naming and UI-level naming can coexist without being merged into one canonical label.

---

## Slug compatibility scope

| Option | Description | Selected |
|--------|-------------|----------|
| A | Produce a complete old-to-new mapping for every renamed or moved page and treat redirect/alias handling as a rollout gate | ✓ |
| B | Only map likely high-traffic or externally linked pages | |
| C | Record migration notes without a full mapping table | |
| D | the agent decides | |

**User's choice:** A
**Notes:** Full mapping coverage is required, not a best-effort subset.

---

## the agent's Discretion

- Exact field names for any recommended docs frontmatter extensions
- Exact folder layout details, provided they preserve the approved three-intent IA

## Deferred Ideas

None.
