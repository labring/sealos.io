# Phase 12 Validation Scaffold: Native Rendering Policy

**Created:** 2026-06-12  
**Updated:** 2026-06-12 by `12-01-PLAN.md`
**Scope:** Planning scaffold for Phase 12 `Native Rendering Policy`  
**Goal:** Users can receive stable OG and blog thumbnail images from pre-generated or cache-keyed render paths with verified native dependency assumptions.

## Plan Split

| Plan | Wave | Requirements | Objective | Dependencies |
|------|------|--------------|-----------|--------------|
| `12-01-PLAN.md` | 1 | `NATIVE-01` | Create source-owned native rendering policy, docs, source guard, tests, npm command, and validation scaffold. | none |
| `12-02-PLAN.md` | 2 | `NATIVE-01`, `NATIVE-02` | Extract reusable render/font/cache-key helpers, preserve route behavior, and add gated local fixture benchmark. | `12-01` |
| `12-03-PLAN.md` | 3 | `NATIVE-03` | Compose Docker/native validation, static-output/route-policy alignment, audit traceability, and Phase 13 handoff. | `12-01`, `12-02` |

## 12-01 Source Validation Status

| Artifact | Status | Evidence |
|----------|--------|----------|
| `config/native-rendering-policy.json` | IMPLEMENTED | Defines homepage OG WebP plus blog SVG/PNG surfaces, renderer/template/font tokens, accepted formats, dimensions, DPR caps, cache-key fields, route-policy alignment, and validation commands. |
| `docs/native-rendering-policy.md` | IMPLEMENTED | Mirrors the machine policy and names static artifact ownership, runtime cache semantics, accepted formats, font contract, native dependency assumptions, Phase 9, Phase 10, and Phase 13 boundaries. |
| `scripts/check-native-rendering-policy.js` | IMPLEMENTED | Exports `validateNativeRenderingPolicy`, `validateNativePolicyConfig`, `validateNativeEnvironmentCaveats`, `validateNativeRoutePolicyAlignment`, `validateNativeFontContract`, and `printNativeRenderingPolicySummary`. |
| `scripts/check-native-rendering-policy.test.mjs` | IMPLEMENTED | Covers repository PASS plus fail-closed fixture cases for missing rows, invalid cache-key dimensions, route ownership drift, missing font rows, validation command drift, and current-shell caveats. |
| `package.json` | IMPLEMENTED | Adds `native-rendering:check` as `node scripts/check-native-rendering-policy.js` while preserving existing scripts from earlier phases. |

## NATIVE-01 Coverage

| Truth | Source Evidence | Status |
|-------|-----------------|--------|
| User can receive stable OG and blog thumbnail images from pre-generated or cache-keyed render paths. | Policy rows declare deterministic source artifacts in `public/generated/native-images`, static-export output in `out/generated/native-images`, and runtime cache-key dimensions for dynamic variants. | SOURCE-POLICY READY |
| Runtime routes and unversioned compatibility URLs use explicit cache headers. | Policy and docs keep `public, max-age=86400` for runtime routes and compatibility URLs. | SOURCE-POLICY READY |
| Longer immutable caching is restricted to versioned artifact URLs. | Policy and docs reserve immutable caching for fully versioned static artifact URLs. | SOURCE-POLICY READY |
| Phase 10 route ownership remains aligned. | Guard checks `/api/og` and `/api/blog/:lang/:slug/thumbnail/:format` are `runtime native route` rows owned by `phase-12-native-rendering`. | SOURCE-GUARDED |

## Environment Caveats

| Check | Current State | Acceptance Meaning |
|-------|---------------|--------------------|
| Active Node | `v24.13.0` | Source checks may run; accepted native timing evidence requires Node 20 from `.nvmrc`. |
| `.nvmrc` | `20` | Locked benchmark and deployment evidence must use Node 20. |
| `node_modules` | absent | Native imports and renderer timing are blocked until locked dependencies are installed. |
| `.source` | absent | Fumadocs-backed runtime route execution remains caveated in this shell. |
| `out` | absent | Static artifact inspection remains `SKIPPED_WITH_CAVEAT` until a locked build creates output. |
| Docker CLI | unavailable | Docker/Nginx native validation remains blocked until the gate runs in a Docker-capable environment. |

## Resolved Research Defaults

| Decision Area | Phase 12 Default | Validation Impact |
|---------------|------------------|-------------------|
| Static artifact directory | Deterministic source artifacts live under `public/generated/native-images`; static export copies them to `out/generated/native-images`. | Policy and static-output guards validate source paths immediately and exported paths when `out` exists. |
| Runtime cache header | Runtime routes and unversioned compatibility URLs use `Cache-Control: public, max-age=86400`. | Route helper and policy checks preserve current cache behavior. |
| Versioned static artifact cache | Longer immutable caching is reserved for fully versioned static artifact URLs declared in `config/native-rendering-policy.json`. | Guard checks distinguish runtime compatibility URLs from fully versioned static artifact URLs. |
| PNG benchmark path | PNG `ImageResponse` smoke runs only inside the Node 20/native/Next runtime open gate. Default/source tests use Satori SVG fixtures and injected renderers. | Current-shell open-gate verifies use wrappers that pass only when `BLOCKED` is observed. |

## Multi-Source Coverage Audit

SOURCE | ID | Feature/Requirement | Plan | Status | Notes
------ | -- | ------------------- | ---- | ------ | -----
GOAL | phase-12 | Users can receive stable OG and blog thumbnail images from pre-generated or cache-keyed render paths with verified native dependency assumptions | 12-01, 12-02, 12-03 | COVERED | Policy, helper/benchmark, and deployment validation plans together satisfy the phase goal.
REQ | NATIVE-01 | User can receive stable OG and blog thumbnail images from pre-generated or cache-keyed render paths | 12-01, 12-02 | COVERED | 12-01 defines the policy and guard; 12-02 wires helpers and route adapters.
REQ | NATIVE-02 | Developer can benchmark OG and thumbnail rendering with local fixtures under Node 20 | 12-02 | COVERED | 12-02 adds fixture runner, tests, and gated accepted timing path.
REQ | NATIVE-03 | Developer can verify Docker native library assumptions for `canvas`, `sharp`, `satori`, and local fonts before deployment | 12-03 | COVERED | 12-03 extends Docker/deployment/static guards with native evidence.
RESEARCH | static-artifact-first | Static artifacts for deterministic inputs and cache-keyed runtime paths for dynamic variants | 12-01, 12-02 | COVERED | Config policy uses `public/generated/native-images` for source artifacts and `out/generated/native-images` for static-export output.
RESEARCH | no-new-packages | Use existing Next, React, canvas, sharp, satori, npm, and Node test stack | 12-01, 12-02, 12-03 | COVERED | All plans reuse existing dependencies.
RESEARCH | route-helper-extraction | Extract reusable helper functions from route handlers while preserving behavior | 12-02 | COVERED | `lib/native-rendering/*` helpers serve routes and benchmark.
RESEARCH | Node20-gated-benchmark | Accepted benchmark evidence requires Node 20, lockfile deps, and local fixtures | 12-02 | COVERED | `PHASE12_RUN_NATIVE_BENCHMARK` gate blocks timing when prerequisites are absent; PNG `ImageResponse` smoke runs inside this open gate.
RESEARCH | Docker-native-proof | Docker smoke must prove native package/font/render assumptions separately from static serving | 12-03 | COVERED | Docker subcheck composes with Phase 9 gate.
RESEARCH | Phase13-boundary | Browser traces and final audit closeout stay in Phase 13 | 12-03 | COVERED | 12-03 records handoff without taking Phase 13 scope.
CONTEXT | D-01 | Stable generated images are the user-facing goal | 12-01, 12-02 | SOURCE-GUARDED | `config/native-rendering-policy.json` and `docs/native-rendering-policy.md` define stable image delivery around deterministic artifacts and cache-keyed variants.
CONTEXT | D-02 | Prefer pre-generated or committed static artifacts for known input sets | 12-01, 12-02 | SOURCE-GUARDED | Known `/api/og` and blog `PREGENERATED_FORMATS` are policy rows and fixture contracts.
CONTEXT | D-03 | Dynamic variants use cache-keyed runtime render paths | 12-01, 12-02 | SOURCE-GUARDED | `cacheKeys.requiredDimensions` includes image type, language, slug, dimensions, DPR, format, renderer version, template version, and font version.
CONTEXT | D-04 | Generated image paths keep explicit cache headers | 12-01, 12-02 | SOURCE-GUARDED | Runtime routes and unversioned compatibility URLs keep `public, max-age=86400`; fully versioned static artifact URLs may use longer immutable caching.
CONTEXT | D-05 | Renderer policy defines ownership, output paths, formats, dimensions, DPR caps, and commands | 12-01 | SOURCE-GUARDED | `config/native-rendering-policy.json` owns the contract.
CONTEXT | D-06 | Preserve Next App Router and static export model | 12-01, 12-02, 12-03 | SOURCE-GUARDED | Policy and guard reference existing route files and static export directories without changing route behavior.
CONTEXT | D-07 | Reuse Phase 10 route classifications | 12-01, 12-03 | SOURCE-GUARDED | Guard alignment checks Phase 10 native route ownership.
CONTEXT | D-08 | Treat pre-generated files as static files under `/app/out`; runtime native support needs host native libs | 12-01, 12-03 | SOURCE-GUARDED | Policy distinguishes source artifacts in `public/generated/native-images`, exported files in `out/generated/native-images`, and runtime native route support.
CONTEXT | D-09 | Avoid widening deployment ownership | 12-03 | COVERED | Native validation composes through Phase 9 guard entry points.
CONTEXT | D-10 | Benchmark local fixtures under Node 20 with locked dependencies | 12-02 | COVERED | Benchmark gate requires `.nvmrc` Node 20 and installed dependencies for accepted timing.
CONTEXT | D-11 | Benchmark both surfaces and representative blog variants | 12-02 | COVERED | Fixture list includes OG, SVG, PNG, languages, categories, and largest DPR.
CONTEXT | D-12 | Benchmark output schema and fail-closed prerequisites | 12-02 | COVERED | Benchmark result schema and caveat status are required in tests.
CONTEXT | D-13 | Source validation can verify policies and record environment caveats | 12-01, 12-02, 12-03 | SOURCE-GUARDED | `npm run native-rendering:check` prints current-shell caveats without accepting runtime evidence.
CONTEXT | D-14 | Production endpoint stress and hosted probes require separate approval | 12-02 | COVERED | Benchmark uses local fixtures only.
CONTEXT | D-15 | Verify `canvas`, `sharp`, `satori`, and local fonts before deployment | 12-01, 12-02, 12-03 | SOURCE-GUARDED | Policy guard validates package and lockfile entries plus exact local font files; import/render smoke remains a later Node 20/native gate.
CONTEXT | D-16 | Docker evidence boundaries align with Phase 9 | 12-03 | COVERED | Docker native checks extend the existing smoke gate.
CONTEXT | D-17 | Fonts are part of the native-render contract | 12-01, 12-02 | SOURCE-GUARDED | Guard validates `fonts/arial.ttf`, `fonts/arial-bold.ttf`, and `fonts/NotoSansSC-Black.ttf` exact byte counts.
CONTEXT | D-18 | Blog thumbnail backgrounds are part of fixture selection | 12-01, 12-02 | SOURCE-GUARDED | Guard validates all five background fixture files, expected total bytes, and largest fixture identity.
CONTEXT | D-19 | Phase 13 owns representative browser traces and final closeout | 12-03 | COVERED | Handoff is explicit.
CONTEXT | D-20 | Preserve traceability to PERF-501, PERF-502, `og-native-rendering`, and NATIVE-01 through NATIVE-03 | 12-03 | COVERED | Audit and validation notes include these tokens.
CONTEXT | D-21 | Narrow traceability notes only; final status remains Phase 13 | 12-03 | COVERED | Plan 12-03 limits audit edits to traceability evidence.

## Command Matrix

| Command | Planned By | Expected Current-Shell Behavior |
|---------|------------|---------------------------------|
| `node --test scripts/check-native-rendering-policy.test.mjs` | 12-01 | PASS in the current shell. |
| `npm run native-rendering:check` | 12-01 | PASS source checks and prints current-shell caveats. |
| `npm run static-routes:check` | 12-01 | PASS when Phase 10 source guard files are present in this worktree; absent `out` remains a source-level caveat in the Phase 10 guard model. |
| `node --test scripts/benchmark-native-rendering.test.mjs` | 12-02 | Pass with injected renderers. |
| `npm run native-rendering:benchmark` | 12-02 | Exit 0 with `SKIPPED_WITH_CAVEAT` while `PHASE12_RUN_NATIVE_BENCHMARK` is closed. |
| `node -e "const { spawnSync } = require('child_process'); const r = spawnSync('npm', ['run', 'native-rendering:benchmark'], { env: { ...process.env, PHASE12_RUN_NATIVE_BENCHMARK: '1' }, encoding: 'utf8' }); const out = (r.stdout || '') + (r.stderr || ''); if ((r.status || 0) === 0 || !out.includes('BLOCKED')) throw new Error('expected BLOCKED benchmark gate');"` | 12-02 | Exit 0 only when the open benchmark gate returns nonzero output containing `BLOCKED`. |
| `node --test scripts/smoke-docker-nginx.test.mjs scripts/check-deployment-parity.test.mjs scripts/check-static-output.test.mjs scripts/check-static-export-routes.test.mjs` | 12-03 | Pass with injected fixtures and closed-gate behavior. |
| `npm run docker:smoke` | 12-03 | Exit 0 with `SKIPPED_WITH_CAVEAT` while `PHASE9_RUN_DOCKER_SMOKE` is closed. |
| `node -e "const { spawnSync } = require('child_process'); const r = spawnSync('npm', ['run', 'docker:smoke'], { env: { ...process.env, PHASE9_RUN_DOCKER_SMOKE: '1' }, encoding: 'utf8' }); const out = (r.stdout || '') + (r.stderr || ''); if ((r.status || 0) === 0 || !out.includes('BLOCKED')) throw new Error('expected BLOCKED docker smoke gate');"` | 12-03 | Exit 0 only when the open Docker smoke gate returns nonzero output containing `BLOCKED`. |
| `npm run static-routes:check` | 12-03 | Pass source policy and absent-`out` caveats. |
| `npm run static-output:check` | 12-03 | Pass source policy and absent-`out` caveats. |
| `npm run validate:deployment` | 12-03 | Pass safe validation path with closed unsafe gates. |

## Dependency Graph

| Plan | Needs | Creates |
|------|-------|---------|
| 12-01 | Phase 12 context, research, patterns, Phase 9/10 guard patterns | Native policy, docs, source guard, source tests, npm check command, validation scaffold |
| 12-02 | 12-01 native policy and guard | Render/font/cache-key helpers, route adapters, benchmark runner, benchmark tests, npm benchmark command |
| 12-03 | 12-01 policy/guard and 12-02 helpers/benchmark | Docker native subcheck, deployment/static guard composition, traceability notes, final validation evidence |

## Phase 13 Handoff

Phase 12 provides:
- Source-owned native image policy and guard evidence.
- Local fixture benchmark path with Node 20/native dependency acceptance gate.
- Docker/native dependency validation path under Phase 9 smoke gate.
- Static-output and route-policy alignment evidence.
- Traceability tokens for `PERF-501`, `PERF-502`, `PERF-701`, `og-native-rendering`, and `NATIVE-01` through `NATIVE-03`.

Phase 13 owns:
- Representative browser traces for public pages and image routes.
- Final fixed, validated, and remaining status updates in `docs/performance-audit.md`.
- Final v2 milestone closeout evidence.
