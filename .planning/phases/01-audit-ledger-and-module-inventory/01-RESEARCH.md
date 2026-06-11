# Phase 1: Audit Ledger and Module Inventory - Research

**Researched:** 2026-06-11 [VERIFIED: init.phase-op]
**Domain:** Brownfield performance-audit ledger design, module inventory coverage, duplicate-key policy, and low-risk validation for an existing Next.js/Fumadocs static-first site [VERIFIED: .planning/PROJECT.md]
**Confidence:** HIGH for Phase 1 report structure and inventory coverage; MEDIUM for later runtime impact examples that remain seed context only [VERIFIED: .planning/phases/01-audit-ledger-and-module-inventory/01-CONTEXT.md]

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

## Implementation Decisions

### Report Contract

- **D-01:** Create `docs/performance-audit.md` as the only durable audit
  ledger for v1 findings.
- **D-02:** Use an append-friendly report layout that later phases can update
  in place without rewriting prior evidence.
- **D-03:** Include a front matter or top-level status section with audit
  version, last updated date, validation commands, and counts for inventory
  coverage and findings.
- **D-04:** Keep planning documents in `.planning/`; keep the user-facing audit
  record under `docs/`.

### Finding Schema

- **D-05:** Every finding row or section must support these fields: status,
  severity, phase, files, entry point, module boundary, work type, execution
  timing, evidence, root cause, impact, remediation direction, validation
  coverage, duplicate key, and dismissal rationale.
- **D-06:** Use stable status values: `candidate`, `confirmed`, `dismissed`,
  and `deferred`.
- **D-07:** Use stable validation values: `tested`, `source-text only`,
  `typecheck only`, `manual only`, and `unvalidated`.
- **D-08:** Separate work type from execution timing. Work type captures CPU,
  network, filesystem I/O, native rendering, bundle, hydration, asset, or
  developer workflow cost. Execution timing captures build, static generation,
  request, page entry, interaction, CI, Docker, or deployment behavior.

### Module Inventory

- **D-09:** Inventory every major repository surface before detailed inspection:
  `app`, `components`, `new-components`, `config`, `content`, `hooks`, `lib`,
  `scripts`, `public`, `assets`, `fonts`, `.github/workflows`, `Dockerfile`,
  `vercel.json`, `next.config.mjs`, `package.json`, and generated app data.
- **D-10:** Module inventory rows must include module boundary, entry points,
  owning files, work type, execution timing, likely phase owner, validation
  coverage, and notes.
- **D-11:** Treat route handlers, generated route-like files, static pages,
  API-like endpoints, scripts, assets, and deployment workflows as first-class
  modules.
- **D-12:** Validate inventory coverage against `rg --files` and the existing
  `.planning/codebase/*` maps.

### Duplicate-Key Policy

- **D-13:** Use duplicate keys to group repeated symptoms under one shared
  mechanism. Initial keys must include `app-store-data-pipeline`,
  `remote-template-build-step`, `static-export-route-classification`,
  `fumadocs-search-index`, `og-native-rendering`, and
  `shared-layout-bundle-cost`.
- **D-14:** A repeated issue should reference the same duplicate key when the
  root cause and remediation path are shared, even if evidence appears in
  multiple files.
- **D-15:** Route-local or module-local findings may use unique keys when
  remediation ownership is different.

### Validation Strategy

- **D-16:** Phase 1 validation should prove the report schema exists, the module
  inventory covers the intended repository surfaces, and duplicate-key examples
  are documented.
- **D-17:** Use low-risk local checks for this phase: file existence, schema
  headings/field checks, `rg --files` coverage comparison, and markdown source
  inspection.
- **D-18:** Leave expensive or network-dependent measurements to later phases
  unless they are needed to validate the ledger structure.

### the agent's Discretion

- The agent may choose Markdown table versus section layout per report area,
  as long as future phases can append rows cleanly and each required field is
  represented.
- The agent may add initial non-finding notes for known risk zones from
  `.planning/codebase/CONCERNS.md`, provided they are clearly marked as seed
  examples or candidates.

### the agent's Discretion

- The agent may choose Markdown table versus section layout per report area,
  as long as future phases can append rows cleanly and each required field is
  represented.
- The agent may add initial non-finding notes for known risk zones from
  `.planning/codebase/CONCERNS.md`, provided they are clearly marked as seed
  examples or candidates.

### Deferred Ideas (OUT OF SCOPE)

## Deferred Ideas

- Direct performance fixes are v2 scope.
- Production load testing is deferred until separate operational approval.
- Deep analyzer, Docker, route timing, and browser trace measurements belong to
  later phases where the relevant subsystem is in scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| LEDGER-01 | Create `docs/performance-audit.md` before module inspection begins. | Use the report skeleton and field-validation commands in this research before recording detailed findings. [VERIFIED: .planning/REQUIREMENTS.md] |
| LEDGER-02 | Record a complete module inventory covering `app`, `components`, `new-components`, `config`, `content`, `hooks`, `lib`, `scripts`, `public`, `assets`, `fonts`, workflows, and deployment config. | Use the module taxonomy, `rg --files` coverage baseline, and coverage-count commands in this research. [VERIFIED: .planning/REQUIREMENTS.md] |
| LEDGER-03 | Define a finding schema with status, severity, phase, files, entry point, module boundary, work type, execution time, evidence, root cause, impact, remediation direction, validation coverage, duplicate key, and dismissal rationale. | Use the prescribed finding schema table and field-presence validation gate in this research. [VERIFIED: .planning/REQUIREMENTS.md] |
| LEDGER-04 | Use stable duplicate keys so shared issues such as App Store data flow, static export route classification, OG rendering, and shared layout bundle cost are grouped once. | Use the duplicate-key policy and seed duplicate-key registry in this research. [VERIFIED: .planning/REQUIREMENTS.md] |
</phase_requirements>

## Summary

Phase 1 should create the durable audit ledger contract and module inventory before subsystem inspection begins. [VERIFIED: .planning/ROADMAP.md] The execution artifact is `docs/performance-audit.md`, and later phases should append to that same report instead of creating separate audit ledgers. [VERIFIED: .planning/phases/01-audit-ledger-and-module-inventory/01-CONTEXT.md]

The implementation should be a documentation and validation phase: create a report skeleton, populate inventory rows for every major repository surface, document stable finding fields, document duplicate-key rules, add seed risk-zone examples, and verify coverage with low-risk source scans. [VERIFIED: .planning/phases/01-audit-ledger-and-module-inventory/01-CONTEXT.md] Detailed App Store, route, Fumadocs, OG, bundle, asset, and deployment findings belong to later phases. [VERIFIED: .planning/ROADMAP.md]

**Primary recommendation:** Implement `docs/performance-audit.md` as an append-friendly Markdown ledger with top-level status, module inventory, duplicate-key registry, finding schema, seed candidate examples, and a Phase 1 validation log. [VERIFIED: .planning/phases/01-audit-ledger-and-module-inventory/01-CONTEXT.md]

## Project Constraints (from AGENTS.md)

| Directive | Planning Impact |
|-----------|-----------------|
| User-facing replies must begin with `爸爸`. [VERIFIED: AGENTS.md] | Execution updates and final responses must preserve this prefix. |
| User-facing replies must be in Simplified Chinese. [VERIFIED: AGENTS.md] | Planner should write user responses in Simplified Chinese. |
| Planning docs, code, comments, commits, and PR text are written in English. [VERIFIED: AGENTS.md] | `docs/performance-audit.md` and phase artifacts should be English. |
| Before file-changing tools, work should start through a GSD command unless explicitly bypassed. [VERIFIED: AGENTS.md] | This research was invoked through `$gsd-plan-phase 1 --auto`; executor should keep phase artifacts in sync. |
| Keep the existing Next.js App Router, React, Fumadocs, npm, static export, and deployment model while auditing. [VERIFIED: AGENTS.md] | Phase 1 should design the ledger around the existing stack and avoid framework-migration assumptions. |
| Every finding needs file-level evidence and a concrete performance reason. [VERIFIED: AGENTS.md] | The finding schema must require evidence paths and root-cause/impact fields. |
| Treat user-facing slow paths, build-time slow paths, and developer workflow slow paths as separate impact categories. [VERIFIED: AGENTS.md] | The report should keep work type and execution timing as separate fields. |

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Audit ledger creation | Repository documentation | Planning artifacts | `docs/performance-audit.md` is the durable user-facing audit record, while `.planning/` stores GSD planning context. [VERIFIED: .planning/phases/01-audit-ledger-and-module-inventory/01-CONTEXT.md] |
| Module inventory coverage | Repository source tree | Planning codebase maps | Inventory must cover source directories, assets, scripts, workflows, and deployment config, with `.planning/codebase/*` as reference maps. [VERIFIED: .planning/REQUIREMENTS.md] |
| Finding schema | Repository documentation | Future phase execution | Later phases depend on stable fields for status, severity, phase, evidence, duplicate keys, and validation coverage. [VERIFIED: .planning/phases/01-audit-ledger-and-module-inventory/01-CONTEXT.md] |
| Duplicate-key policy | Repository documentation | Future remediation planning | Shared mechanisms need one root-cause key across repeated symptoms, so later findings can group remediation work. [VERIFIED: .planning/phases/01-audit-ledger-and-module-inventory/01-CONTEXT.md] |
| Phase 1 validation | Local development environment | Repository documentation | Validation uses file existence, `rg --files`, schema field checks, and markdown inspection. [VERIFIED: .planning/phases/01-audit-ledger-and-module-inventory/01-CONTEXT.md] |

## Standard Stack

### Core

| Tool or Format | Version | Purpose | Why Standard |
|----------------|---------|---------|--------------|
| Markdown | Repository-native | Durable audit ledger at `docs/performance-audit.md`. | Existing project docs and GSD artifacts are Markdown, and Phase 1 is a documentation contract phase. [VERIFIED: codebase grep] |
| `rg` | 15.1.0 in current shell | Fast source inventory and schema validation. | Phase 1 validation explicitly uses `rg --files`, and `rg` is installed in the current environment. [VERIFIED: command output] |
| Node.js | Required 20 from `.nvmrc`; current shell reports v24.13.0 | Run existing Node test files and npm scripts when needed. | The repository requires Node 20, and the executor should align the shell before npm-based validation. [VERIFIED: .nvmrc and command output] |
| npm | Current shell reports 11.6.2 | Existing package manager and script runner. | `package-lock.json` exists and `package.json` defines validation/build scripts. [VERIFIED: package.json] |

### Supporting

| Tool or File | Version | Purpose | When to Use |
|--------------|---------|---------|-------------|
| `node:test` | Built into Node | Existing focused test runner. | Use only for optional source/data checks that do not expand Phase 1 into subsystem auditing. [VERIFIED: .planning/codebase/TESTING.md] |
| `.planning/codebase/*` maps | 2026-06-11 snapshots | Authoritative starting point for structure, architecture, stack, concerns, and testing. | Use for report seed taxonomy and to reduce duplicate discovery work. [VERIFIED: .planning/phases/01-audit-ledger-and-module-inventory/01-CONTEXT.md] |
| `docs/performance-audit.md` | New Phase 1 artifact | Working audit record. | Create before detailed module inspection begins. [VERIFIED: .planning/REQUIREMENTS.md] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Markdown ledger | JSON/YAML ledger | Markdown is easier for human audit reading and append-only phase updates in this project. [ASSUMED] |
| `rg --files` inventory baseline | `find` only | `rg --files` respects ignore rules and is already specified by Phase 1 validation context. [VERIFIED: .planning/phases/01-audit-ledger-and-module-inventory/01-CONTEXT.md] |
| One durable audit report | Per-phase reports | The locked decision names `docs/performance-audit.md` as the only durable v1 findings ledger. [VERIFIED: .planning/phases/01-audit-ledger-and-module-inventory/01-CONTEXT.md] |

**Installation:**

No external packages should be installed for Phase 1. [VERIFIED: .planning/phases/01-audit-ledger-and-module-inventory/01-CONTEXT.md]

**Version verification used during research:**

```bash
node --version
npm --version
rg --version | head -1
cat .nvmrc
```

The current shell reports Node v24.13.0 while `.nvmrc` requires Node 20, so the executor should activate Node 20 before npm validations. [VERIFIED: command output]

## Package Legitimacy Audit

Phase 1 should install no external packages. [VERIFIED: .planning/phases/01-audit-ledger-and-module-inventory/01-CONTEXT.md]

| Package | Registry | Age | Downloads | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-----------|-------------|-----------|-------------|
| none | n/a | n/a | n/a | n/a | n/a | No install required. [VERIFIED: phase scope] |

**Packages removed due to slopcheck [SLOP] verdict:** none. [VERIFIED: phase scope]
**Packages flagged as suspicious [SUS]:** none. [VERIFIED: phase scope]

## Architecture Patterns

### System Architecture Diagram

```text
Phase 1 inputs
  -> .planning/PROJECT.md + REQUIREMENTS.md + ROADMAP.md
  -> .planning/codebase/* + .planning/research/*
  -> rg --files source inventory
  -> docs/performance-audit.md
       -> Audit Status
       -> Module Inventory
       -> Finding Schema
       -> Duplicate-Key Registry
       -> Seed Candidate Notes
       -> Validation Log
  -> Later phases append detailed subsystem findings
```

This diagram is a ledger workflow, not an application runtime diagram. [VERIFIED: phase scope]

### Recommended Project Structure

```text
docs/
└── performance-audit.md        # Durable v1 audit ledger created in Phase 1

.planning/phases/01-audit-ledger-and-module-inventory/
├── 01-CONTEXT.md               # Locked decisions and scope
└── 01-RESEARCH.md              # This research file
```

The implementation should modify `docs/performance-audit.md` and leave later subsystem source files unchanged. [VERIFIED: .planning/ROADMAP.md]

### Pattern 1: Append-Friendly Ledger Skeleton

**What:** Use stable top-level sections with tables designed for row appends by later phases. [VERIFIED: .planning/phases/01-audit-ledger-and-module-inventory/01-CONTEXT.md]

**When to use:** Use for the Phase 1 report skeleton and every later audit update. [VERIFIED: .planning/ROADMAP.md]

**Example:**

```markdown
# Sealos.io Performance Audit

## Audit Status

| Field | Value |
|-------|-------|
| Audit version | v1 |
| Last updated | 2026-06-11 |
| Inventory coverage | Pending validation |
| Findings by status | candidate: 0, confirmed: 0, dismissed: 0, deferred: 0 |
| Last validation commands | See Validation Log |

## Module Inventory

| Module Boundary | Entry Points | Owning Files | Work Type | Execution Timing | Phase Owner | Validation Coverage | Notes |
|-----------------|--------------|--------------|-----------|------------------|-------------|---------------------|-------|
| Locale app shell | `app/[lang]/layout.tsx` | `app/layout.tsx`, `app/[lang]/layout.tsx`, `app/layout.config.tsx` | bundle, hydration, developer workflow | page entry, static generation | Phase 6 | source-text only | Shared shell baseline. |
```

### Pattern 2: Finding Schema as a Contract

**What:** Define every supported field before any detailed finding rows are created. [VERIFIED: .planning/REQUIREMENTS.md]

**When to use:** Use when creating the report and when validating that every future finding can be represented. [VERIFIED: .planning/phases/01-audit-ledger-and-module-inventory/01-CONTEXT.md]

**Example:**

```markdown
## Finding Schema

| Field | Allowed Values or Format | Required | Notes |
|-------|--------------------------|----------|-------|
| Status | `candidate`, `confirmed`, `dismissed`, `deferred` | yes | Stable lifecycle value. |
| Severity | `high`, `medium`, `low`, `info` | yes | Use `info` for non-finding inventory notes. |
| Phase | `1` through `7` | yes | Phase that owns evidence. |
| Files | Backtick paths, comma-separated | yes | Include file-level evidence. |
| Entry point | Route, script, component, asset group, or workflow | yes | Name trigger path. |
| Module boundary | Inventory boundary name | yes | Must match module inventory. |
| Work type | CPU, network, filesystem I/O, native rendering, bundle, hydration, asset, developer workflow | yes | Separate from execution timing. |
| Execution timing | build, static generation, request, page entry, interaction, CI, Docker, deployment | yes | Separate from work type. |
| Evidence | File path plus concrete source reason | yes | Include command output when available. |
| Root cause | Text | yes for candidate/confirmed | Shared mechanism when duplicate key is reused. |
| Impact | Text | yes for candidate/confirmed | User-facing, build-time, developer workflow, or deployment variance. |
| Remediation direction | Text | yes for candidate/confirmed/deferred | Direction only during v1 audit. |
| Validation coverage | `tested`, `source-text only`, `typecheck only`, `manual only`, `unvalidated` | yes | Stable coverage values. |
| Duplicate key | kebab-case key | yes | Reuse for shared mechanisms. |
| Dismissal rationale | Text or `n/a` | yes | Required for dismissed findings. |
```

### Pattern 3: Duplicate-Key Registry

**What:** Declare reusable keys before later phases record evidence. [VERIFIED: .planning/phases/01-audit-ledger-and-module-inventory/01-CONTEXT.md]

**When to use:** Use when repeated symptoms share a root cause and remediation path. [VERIFIED: .planning/phases/01-audit-ledger-and-module-inventory/01-CONTEXT.md]

**Example:**

```markdown
## Duplicate-Key Registry

| Duplicate Key | Shared Mechanism | Reuse Rule | Initial Evidence Pointers | Owner Phase |
|---------------|------------------|------------|---------------------------|-------------|
| `app-store-data-pipeline` | App Store generated JSON, runtime API, loader, and UI data shape. | Use when root cause is shared app-template normalization or cache/payload behavior. | `scripts/generate-apps-api.js`, `lib/api/apps-api.ts`, `config/apps-loader.ts` | Phase 3 |
| `remote-template-build-step` | Remote template ingestion in the production build path. | Use when root cause is generator/build coupling. | `package.json`, `scripts/generate-apps-api.js` | Phase 2 |
| `static-export-route-classification` | Static export with API-like routes and route handlers. | Use when root cause is deployment/runtime classification. | `next.config.mjs`, `app/api/**/route.ts`, `app/llms.txt/route.ts` | Phase 4 |
| `fumadocs-search-index` | Docs/content loaders feeding search payloads. | Use when root cause is search index generation or payload growth. | `app/api/search/route.ts`, `lib/source.ts`, `content/docs/**` | Phase 4 |
| `og-native-rendering` | Canvas/Sharp image rendering path. | Use when root cause is native rendering CPU or deployment variance. | `app/api/og/route.ts`, `lib/og-canvas.ts` | Phase 5 |
| `shared-layout-bundle-cost` | Global locale layout providers and client surfaces. | Use when root cause is shared shell hydration or bundle reach. | `app/[lang]/layout.tsx`, `new-components/AuthForm/**`, `new-components/DeployModal/**` | Phase 6 |
```

### Pattern 4: Inventory From Source of Truth Plus Coverage Counts

**What:** Combine `.planning/codebase/*` maps with `rg --files` counts. [VERIFIED: .planning/phases/01-audit-ledger-and-module-inventory/01-CONTEXT.md]

**When to use:** Use during Phase 1 execution before marking inventory complete. [VERIFIED: .planning/ROADMAP.md]

**Commands:**

```bash
for d in app components new-components config content hooks lib scripts public assets fonts .github; do
  printf '%s ' "$d"
  rg --files "$d" 2>/dev/null | wc -l | tr -d ' '
  printf '\n'
done

rg --files app components new-components config content hooks lib scripts public assets fonts .github \
  Dockerfile vercel.json next.config.mjs package.json source.config.ts tsconfig.json .nvmrc \
  public/_headers public/_redirects 2>/dev/null |
  awk 'BEGIN{FS="/"} {print $1}' | sort | uniq -c
```

Research-time baseline counts: `app` 264, `components` 80, `new-components` 29, `config` 8, `content` 2991, `hooks` 5, `lib` 16, `scripts` 5, `public` 398, `assets` 84, `fonts` 3, `.github` 5. [VERIFIED: command output]

### Anti-Patterns to Avoid

- **Separate per-phase audit ledgers:** Use `docs/performance-audit.md` as the durable v1 ledger. [VERIFIED: .planning/phases/01-audit-ledger-and-module-inventory/01-CONTEXT.md]
- **Detailed subsystem findings in Phase 1:** Keep App Store, route, content, OG, bundle, asset, and deployment evidence as seed notes unless the note proves the ledger structure. [VERIFIED: .planning/ROADMAP.md]
- **Finding rows without file-level evidence:** Every finding must support path-level evidence and a concrete performance reason. [VERIFIED: .planning/REQUIREMENTS.md]
- **Collapsing work type and execution timing:** Keep cost category and trigger timing as separate fields. [VERIFIED: .planning/phases/01-audit-ledger-and-module-inventory/01-CONTEXT.md]
- **Duplicate keys based on symptom text only:** Reuse a key when root cause and remediation path are shared. [VERIFIED: .planning/phases/01-audit-ledger-and-module-inventory/01-CONTEXT.md]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Source inventory | A manually typed file list | `rg --files` plus `.planning/codebase/STRUCTURE.md` | Phase 1 validation requires coverage comparison against repository files and codebase maps. [VERIFIED: .planning/phases/01-audit-ledger-and-module-inventory/01-CONTEXT.md] |
| Status lifecycle | Free-form status text | `candidate`, `confirmed`, `dismissed`, `deferred` | Locked status values support later counting and prioritization. [VERIFIED: .planning/phases/01-audit-ledger-and-module-inventory/01-CONTEXT.md] |
| Validation coverage taxonomy | Free-form coverage labels | `tested`, `source-text only`, `typecheck only`, `manual only`, `unvalidated` | Locked validation values support final coverage aggregation. [VERIFIED: .planning/phases/01-audit-ledger-and-module-inventory/01-CONTEXT.md] |
| Duplicate grouping | Per-file duplicate decisions | Duplicate-key registry | Shared mechanisms such as App Store pipeline and shared layout bundle cost need one grouping key. [VERIFIED: .planning/phases/01-audit-ledger-and-module-inventory/01-CONTEXT.md] |
| Phase validation | Network-heavy measurement | File existence, schema checks, and `rg --files` coverage | Expensive and network-dependent measurements belong to later subsystem phases. [VERIFIED: .planning/phases/01-audit-ledger-and-module-inventory/01-CONTEXT.md] |

**Key insight:** Phase 1 succeeds by making later evidence appendable, comparable, and deduplicated; it is a ledger-contract phase. [VERIFIED: .planning/ROADMAP.md]

## Common Pitfalls

### Pitfall 1: Inventory Looks Complete But Misses Non-Route Surfaces

**What goes wrong:** The report lists App Router pages but omits assets, workflows, scripts, generated data, fonts, and deployment config. [VERIFIED: .planning/REQUIREMENTS.md]
**Why it happens:** Auditors often start from page routes, while this project scope covers the whole repository. [VERIFIED: .planning/PROJECT.md]
**How to avoid:** Validate against `rg --files` for `app`, `components`, `new-components`, `config`, `content`, `hooks`, `lib`, `scripts`, `public`, `assets`, `fonts`, `.github`, and top-level config files. [VERIFIED: command output]
**Warning signs:** Inventory has page entries but no rows for `.github/workflows`, `Dockerfile`, `public`, `assets`, `fonts`, or generated app data. [VERIFIED: .planning/REQUIREMENTS.md]

### Pitfall 2: Seed Notes Become Premature Findings

**What goes wrong:** The Phase 1 report starts auditing App Store generation, Fumadocs search, OG rendering, or bundle costs in detail. [VERIFIED: .planning/ROADMAP.md]
**Why it happens:** `.planning/codebase/CONCERNS.md` contains credible risk zones that are useful for duplicate-key seed examples. [VERIFIED: .planning/codebase/CONCERNS.md]
**How to avoid:** Mark them as seed candidate notes or duplicate-key examples and assign detailed evidence to the later owning phase. [VERIFIED: .planning/ROADMAP.md]
**Warning signs:** Phase 1 includes timings, severity conclusions, or remediation priority for later-phase subsystems. [VERIFIED: .planning/ROADMAP.md]

### Pitfall 3: Duplicate Keys Are Too Specific

**What goes wrong:** Each file receives a separate key even when the same root cause spans generator, loader, API route, and UI. [VERIFIED: .planning/phases/01-audit-ledger-and-module-inventory/01-CONTEXT.md]
**Why it happens:** File-local audit flow can hide shared mechanisms. [VERIFIED: .planning/research/ARCHITECTURE.md]
**How to avoid:** Key by shared mechanism and remediation ownership. [VERIFIED: .planning/phases/01-audit-ledger-and-module-inventory/01-CONTEXT.md]
**Warning signs:** Keys repeat the filename instead of the mechanism, such as separate keys for each App Store data file. [ASSUMED]

### Pitfall 4: Validation Runs Under the Wrong Node Version

**What goes wrong:** npm validations may behave differently from the project runtime baseline. [VERIFIED: .planning/codebase/STACK.md]
**Why it happens:** `.nvmrc` requires Node 20, while the current shell reports Node v24.13.0. [VERIFIED: command output]
**How to avoid:** Activate Node 20 before running npm scripts, or record that npm validation was skipped due to runtime mismatch. [VERIFIED: .nvmrc and command output]
**Warning signs:** `node --version` prints a major version other than 20. [VERIFIED: .nvmrc]

## Code Examples

### Phase 1 Report Status Block

```markdown
## Audit Status

| Field | Value |
|-------|-------|
| Audit version | v1 |
| Last updated | 2026-06-11 |
| Scope | Full-codebase performance audit |
| Ledger owner | Phase 1 creates schema; later phases append evidence |
| Inventory coverage | app: pending, components: pending, new-components: pending, config: pending, content: pending, hooks: pending, lib: pending, scripts: pending, public: pending, assets: pending, fonts: pending, workflows: pending, deployment config: pending |
| Findings by status | candidate: 0, confirmed: 0, dismissed: 0, deferred: 0 |
```

### Phase 1 Module Inventory Rows

```markdown
| Module Boundary | Entry Points | Owning Files | Work Type | Execution Timing | Phase Owner | Validation Coverage | Notes |
|-----------------|--------------|--------------|-----------|------------------|-------------|---------------------|-------|
| Build scripts | `npm run generate-apps`, `npm run build` | `package.json`, `scripts/generate-apps-api.js`, `scripts/normalize-root-locale.js` | network, filesystem I/O, developer workflow | build, CI | Phase 2 | source-text only | Seed under `remote-template-build-step`; detailed audit deferred to Phase 2. |
| Generated SEO endpoints | `/api/search`, `/rss.xml`, `/sitemap-index.xml`, `/llms.txt`, sitemap files | `app/api/search/route.ts`, `app/rss.xml/route.ts`, `app/sitemap-index.xml/route.ts`, `app/llms.txt/route.ts`, `app/sitemap.ts`, `app/sitemap-ai-faq.ts` | CPU, filesystem I/O, network, developer workflow | static generation, request, deployment | Phase 4 | source-text only | Seed under `static-export-route-classification` and `fumadocs-search-index`; detailed audit deferred to Phase 4. |
| Native rendering | `/api/og`, blog thumbnail route | `app/api/og/route.ts`, `lib/og-canvas.ts`, `app/api/blog/[lang]/[slug]/thumbnail/[format]/route.ts`, `fonts/**` | native rendering, CPU, asset | request, deployment | Phase 5 | source-text only | Seed under `og-native-rendering`; detailed audit deferred to Phase 5. |
```

### Schema Validation Command

```bash
required_terms='Status|Severity|Phase|Files|Entry point|Module boundary|Work type|Execution timing|Evidence|Root cause|Impact|Remediation direction|Validation coverage|Duplicate key|Dismissal rationale'
rg -n "$required_terms" docs/performance-audit.md

rg -n "candidate|confirmed|dismissed|deferred" docs/performance-audit.md
rg -n "tested|source-text only|typecheck only|manual only|unvalidated" docs/performance-audit.md
rg -n "app-store-data-pipeline|remote-template-build-step|static-export-route-classification|fumadocs-search-index|og-native-rendering|shared-layout-bundle-cost" docs/performance-audit.md
```

### Coverage Validation Command

```bash
for expected in app components new-components config content hooks lib scripts public assets fonts .github Dockerfile vercel.json next.config.mjs package.json; do
  rg -n --fixed-strings "$expected" docs/performance-audit.md >/dev/null &&
    printf 'covered %s\n' "$expected" ||
    printf 'missing %s\n' "$expected"
done
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Repeated ad hoc source inspection | Durable `docs/performance-audit.md` ledger with schema, inventory, and duplicate keys | Phase 1 of this roadmap | Later phases can append evidence and avoid repeated discovery. [VERIFIED: .planning/PROJECT.md] |
| Per-file issue recording | Shared duplicate-key registry | Phase 1 of this roadmap | Shared mechanisms can be grouped under one remediation path. [VERIFIED: .planning/phases/01-audit-ledger-and-module-inventory/01-CONTEXT.md] |
| Unstructured validation notes | Stable validation coverage values | Phase 1 of this roadmap | Final audit can aggregate tested, source-text only, typecheck only, manual only, and unvalidated coverage. [VERIFIED: .planning/phases/01-audit-ledger-and-module-inventory/01-CONTEXT.md] |

**Deprecated/outdated:**

- Separate audit ledgers per phase: The locked decision uses `docs/performance-audit.md` as the only durable v1 findings ledger. [VERIFIED: .planning/phases/01-audit-ledger-and-module-inventory/01-CONTEXT.md]
- Detailed performance fixes during v1 discovery: Direct fixes are v2 scope. [VERIFIED: .planning/REQUIREMENTS.md]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Markdown is easier than JSON/YAML for this human-read audit ledger. | Standard Stack | A structured format could support automation better, but the locked artifact path is Markdown under `docs/`. |
| A2 | Filename-shaped duplicate keys are a warning sign for overly specific grouping. | Common Pitfalls | A future module-local issue may legitimately need a unique file-specific key. |

## Open Questions

1. **Should Phase 1 add a small validation script or keep validation as commands in the report?**
   - What we know: Phase 1 requires low-risk local checks and markdown inspection. [VERIFIED: .planning/phases/01-audit-ledger-and-module-inventory/01-CONTEXT.md]
   - What's unclear: The roadmap does not require a committed validation script in Phase 1. [VERIFIED: .planning/ROADMAP.md]
   - Recommendation: Keep validation as copyable commands in `docs/performance-audit.md` unless the planner wants a tiny script for repeatability. [ASSUMED]

2. **Should seed candidate examples be finding rows or separate non-finding notes?**
   - What we know: The context allows seed examples from `.planning/codebase/CONCERNS.md` when clearly marked as seed examples or candidates. [VERIFIED: .planning/phases/01-audit-ledger-and-module-inventory/01-CONTEXT.md]
   - What's unclear: The final report layout choice is left to agent discretion. [VERIFIED: .planning/phases/01-audit-ledger-and-module-inventory/01-CONTEXT.md]
   - Recommendation: Put them in a `Seed Candidate Notes` section and keep finding counts at zero until later phases confirm detailed evidence. [ASSUMED]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Node.js | Optional npm validation and existing tests | yes | Current shell v24.13.0; project requires 20 | Activate Node 20 from `.nvmrc` before npm checks. [VERIFIED: command output] |
| npm | Optional npm validation | yes | 11.6.2 | Use Node 20 aligned npm environment. [VERIFIED: command output] |
| `rg` | Inventory and schema validation | yes | 15.1.0 | Use `find` plus `grep` only if `rg` is unavailable. [VERIFIED: command output] |
| `git` | Status and optional documentation commit | yes | 2.50.1 | Manual file status inspection. [VERIFIED: command output] |
| `find` | Asset and file-list fallback | yes | `/usr/bin/find` | `rg --files`. [VERIFIED: command output] |
| `du` | Later payload-size inspection | yes | `/usr/bin/du` | Skip size checks in Phase 1. [VERIFIED: command output] |

**Missing dependencies with no fallback:**

- None for Phase 1 documentation and source-scan validation. [VERIFIED: command output]

**Missing dependencies with fallback:**

- Node 20 is not the current shell runtime; align with `.nvmrc` before npm validations. [VERIFIED: command output]

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Node.js built-in `node:test` for existing repository tests. [VERIFIED: .planning/codebase/TESTING.md] |
| Config file | none detected. [VERIFIED: .planning/codebase/TESTING.md] |
| Quick run command | `rg -n "Status|Severity|Phase|Files|Entry point|Module boundary|Work type|Execution timing|Evidence|Root cause|Impact|Remediation direction|Validation coverage|Duplicate key|Dismissal rationale" docs/performance-audit.md` |
| Full suite command | `npm run lint && node --test '**/*.test.mjs' '**/*.test.mts'` after activating Node 20. [VERIFIED: .planning/codebase/TESTING.md] |

### Phase Requirements to Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|--------------|
| LEDGER-01 | `docs/performance-audit.md` exists before detailed inspection. | source check | `test -f docs/performance-audit.md` | no at research time [VERIFIED: command output] |
| LEDGER-02 | Inventory covers required repository surfaces. | source check | `for expected in app components new-components config content hooks lib scripts public assets fonts .github Dockerfile vercel.json next.config.mjs package.json; do rg -n --fixed-strings "$expected" docs/performance-audit.md; done` | no at research time [VERIFIED: command output] |
| LEDGER-03 | Finding schema contains all required fields and stable status/validation values. | source check | `rg -n "Status|Severity|Phase|Files|Entry point|Module boundary|Work type|Execution timing|Evidence|Root cause|Impact|Remediation direction|Validation coverage|Duplicate key|Dismissal rationale|candidate|confirmed|dismissed|deferred|tested|source-text only|typecheck only|manual only|unvalidated" docs/performance-audit.md` | no at research time [VERIFIED: command output] |
| LEDGER-04 | Duplicate-key policy documents required seed keys. | source check | `rg -n "app-store-data-pipeline|remote-template-build-step|static-export-route-classification|fumadocs-search-index|og-native-rendering|shared-layout-bundle-cost" docs/performance-audit.md` | no at research time [VERIFIED: command output] |

### Sampling Rate

- **Per task commit:** Run file existence and schema/duplicate-key `rg` checks for `docs/performance-audit.md`. [VERIFIED: phase scope]
- **Per wave merge:** Run coverage command against required surfaces plus `git diff -- docs/performance-audit.md`. [VERIFIED: phase scope]
- **Phase gate:** `docs/performance-audit.md` exists, required schema fields exist, required module surfaces appear, and required duplicate keys appear. [VERIFIED: .planning/ROADMAP.md]

### Wave 0 Gaps

- [ ] `docs/performance-audit.md` - create report skeleton for LEDGER-01 through LEDGER-04. [VERIFIED: command output]
- [ ] Runtime alignment - activate Node 20 before npm commands because current shell is Node v24.13.0. [VERIFIED: command output]

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|------------------|
| V2 Authentication | no direct implementation in Phase 1 | Inventory existing auth-related surfaces only, such as `new-components/AuthForm/**` and auth utility paths. [VERIFIED: .planning/codebase/ARCHITECTURE.md] |
| V3 Session Management | no direct implementation in Phase 1 | Inventory existing session/auth surfaces only. [VERIFIED: .planning/codebase/ARCHITECTURE.md] |
| V4 Access Control | no direct implementation in Phase 1 | Phase 1 creates documentation and source-scan validation only. [VERIFIED: phase scope] |
| V5 Input Validation | yes for report schema quality | Use locked schema fields and stable enum values for finding/status/validation values. [VERIFIED: .planning/phases/01-audit-ledger-and-module-inventory/01-CONTEXT.md] |
| V6 Cryptography | no direct implementation in Phase 1 | Do not modify cryptographic or secret-handling code in Phase 1. [VERIFIED: phase scope] |

### Known Threat Patterns for This Phase

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Misleading audit evidence | Tampering | Require file-level evidence paths and validation coverage for every finding. [VERIFIED: .planning/REQUIREMENTS.md] |
| Secret leakage through validation commands | Information Disclosure | Do not read secret-bearing `.env` files; `.env.example` is the environment documentation file. [VERIFIED: .planning/codebase/STACK.md] |
| Overbroad execution during research validation | Denial of Service | Use low-risk source scans in Phase 1 and defer expensive/network-dependent measurements. [VERIFIED: .planning/phases/01-audit-ledger-and-module-inventory/01-CONTEXT.md] |

## Sources

### Primary (HIGH confidence)

- `.planning/PROJECT.md` - project scope, constraints, deliverable path, and out-of-scope boundaries. [VERIFIED: file read]
- `.planning/REQUIREMENTS.md` - LEDGER-01 through LEDGER-04 and full v1 requirement mapping. [VERIFIED: file read]
- `.planning/ROADMAP.md` - Phase 1 deliverables, success criteria, likely files, and validation approach. [VERIFIED: file read]
- `.planning/phases/01-audit-ledger-and-module-inventory/01-CONTEXT.md` - locked decisions, discretion, deferred scope, and canonical references. [VERIFIED: file read]
- `.planning/codebase/STRUCTURE.md` - directory/module boundaries and key file locations. [VERIFIED: file read]
- `.planning/codebase/ARCHITECTURE.md` - app layers, data flows, entry points, and constraints. [VERIFIED: file read]
- `.planning/codebase/STACK.md` - Node/npm/Next/Fumadocs/static export stack and scripts. [VERIFIED: file read]
- `.planning/codebase/CONCERNS.md` - seed performance risk zones and fragile areas. [VERIFIED: file read]
- `.planning/codebase/TESTING.md` - existing `node:test` style and commands. [VERIFIED: file read]
- `.planning/research/STACK.md`, `.planning/research/ARCHITECTURE.md`, `.planning/research/FEATURES.md` - prior stack, architecture, and feature audit research. [VERIFIED: file read]
- `package.json`, `next.config.mjs`, `.nvmrc` - scripts, static export config, dependencies, and Node baseline. [VERIFIED: file read]
- `rg --files` and environment probes - inventory counts and tool availability. [VERIFIED: command output]

### Secondary (MEDIUM confidence)

- None used. [VERIFIED: source list]

### Tertiary (LOW confidence)

- Assumptions A1 and A2 in the Assumptions Log. [ASSUMED]

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - Phase 1 uses existing repo docs, shell tools, and locked no-install scope. [VERIFIED: file read]
- Architecture: HIGH - Phase 1 ledger workflow is directly constrained by roadmap and context. [VERIFIED: .planning/ROADMAP.md]
- Pitfalls: HIGH for scope and validation pitfalls from context; MEDIUM for key-naming warning signs. [VERIFIED: .planning/phases/01-audit-ledger-and-module-inventory/01-CONTEXT.md]

**Research date:** 2026-06-11 [VERIFIED: current_date]
**Valid until:** 2026-07-11 for Phase 1 ledger design; re-check file counts before execution if source files change. [ASSUMED]
