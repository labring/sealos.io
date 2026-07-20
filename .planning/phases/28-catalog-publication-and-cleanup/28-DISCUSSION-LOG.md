# Phase 28: Catalog Publication and Cleanup - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md; this log preserves the alternatives considered.

**Date:** 2026-07-17
**Phase:** 28-catalog-publication-and-cleanup
**Areas discussed:** catalog availability, validator contract, TDD seams, static publication, evidence and cleanup

---

## Catalog Availability

| Option | Description | Selected |
| --- | --- | --- |
| Promote through the existing matrix | Add FastAPI and Django to the derived available set and update current catalog copy | Yes |
| Build a separate Python catalog band | Add a new layout section for the two Python frameworks | |
| Replace the Next.js default path | Make one new framework the primary hero journey | |

**User's choice:** The recommended existing-matrix path was auto-selected from
the user's prior confirmations to follow the Next.js series and current catalog.
**Notes:** The matrix already provides direct links for available items and keeps
all 18 framework requests in one inventory.

---

## Validator Contract

| Option | Description | Selected |
| --- | --- | --- |
| Expand the exact production contract | Validate exactly 15 pages plus strict Python stage, source, asset, and catalog rules | Yes |
| Discover any tutorial directory | Accept arbitrary future directories with generic checks | |
| Add a Python-only validator | Leave the production validator at nine pages and run a second command | |

**User's choice:** The exact 15-page production contract was selected.
**Notes:** One public validation command keeps the catalog release fail-closed.

---

## TDD Seams

| Option | Description | Selected |
| --- | --- | --- |
| CLI behavior with filesystem fixtures | Spawn the validator against copied committed sources and one mutated invalid input | Yes |
| Test private parser helpers | Export and assert internal parsing functions | |
| Snapshot the validator source | Compare implementation text to expected constants | |

**User's choice:** The CLI seam was already confirmed when the user invoked
`tdd` and then replied `确认`.
**Notes:** RED and GREEN proceed as vertical slices for source/assets, then
catalog availability and index discoverability.

---

## Static Publication

| Option | Description | Selected |
| --- | --- | --- |
| Production export plus loopback HTTP | Build once and request the exact reader routes and assets | Yes |
| Development-server review | Review routes from `next dev` only | |
| Filesystem-only inspection | Check `out/` paths without HTTP | |

**User's choice:** Production export plus loopback HTTP was selected.
**Notes:** The public acceptance set contains one index, six pages, and 24
WebPs, with a separate desktop/mobile index review.

---

## Evidence And Cleanup

| Option | Description | Selected |
| --- | --- | --- |
| Separate Phase 28 checksum seal | Preserve Phase 27 and record build, HTTP, browser, and cleanup results separately | Yes |
| Extend the Phase 27 seal | Make Phase 27 evidence writable again | |
| Keep terminal output only | Retain no durable publication evidence | |

**User's choice:** A separate Phase 28 seal was selected.
**Notes:** Phase 27 remains byte-identical and mode `0444`; all Phase 28 servers,
sessions, scratch, and external resource checks close before sealing.

## the agent's Discretion

- Focused fixture helper names and file organization.
- Concise index copy and metadata keyword wording.
- Run-owned static server implementation and Phase 28 evidence file split.
- Small matrix copy edits within the existing visual system.

## Deferred Ideas

None.
