# Phase 27 Practice-Backed Tutorial Evidence

This directory is the durable, read-only authority for the six FastAPI and
Django tutorial sources and their 24 evidence cards.

## Boundary And Inventory

- Phase base: `41aa0c2fd8d05d3c77e08e85e36011dc47a93a83`.
- Retained package: exactly ten files.
- Checksum inputs: exactly the first nine files below.
- Checksum manifest: generated last and excluded from its own input set.

| File | Role |
| --- | --- |
| `README.md` | Schema, authority, replay, redaction, ownership, and seal contract |
| `source-identities.jsonl` | Six protected annotated tags and two active rulesets |
| `timing.jsonl` | Accepted and rejected beginner timing attempts with cleanup joins |
| `commands.txt` | Curated public-placeholder replay commands |
| `claims.jsonl` | Thirty-eight reviewed page claims with normalized hashes and selectors |
| `practice-events.jsonl` | Sixty-eight reviewed local, Sealos, browser, and sealed-authority events |
| `screenshots.jsonl` | Twenty-four final asset and provenance records |
| `cleanup.jsonl` | Every attempt terminal plus the final cross-framework zero audit |
| `review.txt` | Human and machine acceptance matrix |
| `checksums.txt` | Sorted SHA-256 manifest over the previous nine files |

## Authority Order

1. The six protected annotated source tags own source, dependency, command, and
   manifest contracts.
2. Fresh Phase 27 practice events own current local, Sealos, browser, timing,
   migration, persistence, public, and cleanup observations.
3. Checksum-valid Phase 23, 25, and 26 evidence owns the production facts that
   are explicitly joined by path and record selector.
4. Current public tag and ruleset readback proves that the protected source
   identities remain unchanged.
5. Tutorial prose and evidence cards consume these authorities; they never
   create operational facts.

The retained upstream evidence manifests were verified before consolidation:

- Phase 23 manifest SHA-256:
  `0d84da0dbb202866048731c79e5bc7359c0a7fd38380045de3e4d51f187de642`.
- Phase 25 manifest SHA-256:
  `7edf3ba761497cef3546ad4dfc43ed42fef76fb1da63a7abb85290981ac869e8`.
- Phase 26 manifest SHA-256:
  `730a2debc4262483375319eeca93d28a8cdbd0dffb68e8155146f14ef2105831`.

## Stable Schemas

All JSONL files contain one compact JSON object per line and use
`record_id` as the stable row identity.

- Source rows include framework, stage, protected tag URL, annotated tag
  object, peeled commit, tag message, local/public equality, ruleset ID, and
  verified sealed-evidence manifest references.
- Timing rows include framework, run ID, protected Stage 1 identity, clock
  boundary, elapsed milliseconds, acceptance state, evidence completeness,
  HTTP result when reached, and terminal cleanup record ID.
- Claim rows include page, section, normalized `claim_text_sha256`, source
  artifact, record selector, optional event IDs, and reviewed state. The hash
  input is the claim after trim and whitespace collapse.
- Practice rows include framework, stage, event identity, reviewed state,
  source artifact, record selector, and event-specific observation fields.
- Screenshot rows include page, filename, adjacent step, protected tag,
  evidence IDs, capture session/hash, redactions, render layout, required and
  forbidden tokens, exact output metadata, semantic and visual status, and
  desktop/mobile review status. Structured terminal cards hash their canonical
  reviewed source payload; browser cards retain sanitized capture hashes.
- Cleanup rows include attempt identity, terminal state, zero-residue state,
  and owned resource/path/process counters. The `phase27-final` row is the
  read-only cross-framework audit.

Rows are sorted by framework, stage, and record ID where that order applies.
Retry attempts retain distinct run and cleanup IDs. Accepted timing records
never replace rejected attempts.

## Timing Decision

The beginner title gate is computed from accepted, evidence-complete attempts:

- FastAPI: `21106` ms.
- Django: `26099` ms.
- Threshold: `300000` ms.

Both frameworks therefore use the shared `in 5 Minutes` beginner title. Local
setup, authentication, source validation, analysis, and template review remain
outside the measured native DEPLOY-to-public-health interval.

## Redaction Contract

Retained files and decoded card text may contain public repositories, protected
tags, public image digests, public documentation URLs, generic placeholders,
and reviewed response facts. They exclude authorization headers, cookies,
CSRF values, credentials, kubeconfig content, private workspace identities,
private endpoints, raw cluster context, local absolute paths, and temporary
registry configuration. Public commands use angle-bracket placeholders.

Rejected attempts remain in timing and cleanup evidence with their reason and
terminal zero state. Sanitized application captures and render scratch are
inputs to review only and are removed before sealing.

## Replay

Run these checks from the repository root:

```bash
node --test scripts/python-tutorial-assets.test.mjs
node scripts/python-tutorial-assets.mjs \
  --check-bundle \
  --repo-root "$PWD" \
  --evidence-root \
  .planning/phases/27-practice-backed-tutorial-series/evidence \
  --phase-base \
  41aa0c2fd8d05d3c77e08e85e36011dc47a93a83
npm run lint
```

Verify the sealed package from its directory:

```bash
shasum -a 256 -c checksums.txt
```

## Checksum-Last Procedure

1. Complete source, timing, claim, event, image, visual, credential, cleanup,
   boundary, and history review.
2. Remove `work/`, sanitized captures, renderer data, browser sessions, local
   servers, temporary images, and run-owned runtime resources.
3. Hash exactly the nine input files through a mode-0600 temporary file in
   `LC_ALL=C` sorted relative-path order.
4. Atomically rename the temporary file to `checksums.txt`.
5. Require exactly nine entries and verify every digest immediately.
6. Run the coordinator and final validation again and compare all ten files
   before and after for byte equality.
7. Set all ten retained files to mode `0444`. Any later byte change requires a
   complete review and reseal.
