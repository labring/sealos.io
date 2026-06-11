# Native Rendering Policy

Phase 12 defines the source-owned policy for stable Open Graph and blog
thumbnail image delivery. `config/native-rendering-policy.json` is the
machine-readable source of truth; this document is the matching human contract.

## Scope

NATIVE-01 covers stable OG and blog thumbnail images from pre-generated or
cache-keyed render paths. The current surfaces are `/api/og` and
`/api/blog/:lang/:slug/thumbnail/:format`.

Phase 9 owns deployment parity, Node 20 locked-dependency orchestration, Docker
smoke policy, and unsafe gate definitions. Phase 10 owns static-export route
classification and records both native routes as `runtime native route` entries
owned by `phase-12-native-rendering`. Phase 13 owns representative browser
traces and final v2 audit status closeout.

## Static Artifact Ownership

Deterministic static artifacts are source-owned under
`public/generated/native-images` and are expected in static export output under
`out/generated/native-images`.

Fully versioned static artifact URLs include renderer, template, font,
dimension, DPR, and format tokens. Fully versioned static artifact URLs may use
`Cache-Control: public, max-age=31536000, immutable`.

Runtime routes and unversioned compatibility URLs keep
`Cache-Control: public, max-age=86400`.

| Surface | Route | Source | Format | Dimensions | DPR cap | Artifact strategy | Runtime cache |
|---|---|---|---|---:|---:|---|---|
| Homepage OG | `/api/og` | `app/api/og/route.ts` | WebP | 1200x630 | 1 | Deterministic static artifact plus runtime compatibility URL | `public, max-age=86400` |
| Blog thumbnail default | `/api/blog/:lang/:slug/thumbnail/:format` | `app/api/blog/[lang]/[slug]/thumbnail/[format]/route.ts` | SVG | 384x256 | 3 | Pre-generated format static artifact plus cache-keyed runtime variant | `public, max-age=86400` |
| Blog thumbnail card | `/api/blog/:lang/:slug/thumbnail/:format` | `app/api/blog/[lang]/[slug]/thumbnail/[format]/route.ts` | SVG | 400x210 | 3 | Pre-generated format static artifact plus cache-keyed runtime variant | `public, max-age=86400` |
| Blog thumbnail large | `/api/blog/:lang/:slug/thumbnail/:format` | `app/api/blog/[lang]/[slug]/thumbnail/[format]/route.ts` | PNG | 1200x630 | 3 | Pre-generated format static artifact plus cache-keyed runtime variant | `public, max-age=86400` |

Traceability stays explicit through `NATIVE-01`, `PERF-501`, `PERF-502`, and
`og-native-rendering`.

## Runtime Cache Keys

Runtime cache-keyed variants must include every field below:

- `imageType`
- `language`
- `slug`
- `dimensions`
- `dpr`
- `format`
- `rendererVersion`
- `templateVersion`
- `fontVersion`

The homepage OG route has fixed language and slug tokens because it renders the
site homepage. Blog thumbnail variants use route language and slug values.
Renderer, template, and font versions change whenever output bytes can change.

## Accepted Formats

Accepted formats are WebP, SVG, and PNG.

Homepage OG uses WebP through the existing `canvas` plus `sharp` path. Blog SVG
uses Satori. Blog PNG uses Next `ImageResponse`. Blog dimensions remain bounded
by the existing parser contract: minimum dimension 128, maximum dimension 4000,
and maximum DPR 3.

## Font Contract

Fonts are renderer inputs and are validated by exact path and byte count.

| Font | Weight | Expected bytes | Used by |
|---|---:|---:|---|
| `fonts/arial.ttf` | 400 | 915212 | Homepage OG, blog thumbnail |
| `fonts/arial-bold.ttf` | 700 | 57448 | Homepage OG, blog thumbnail |
| `fonts/NotoSansSC-Black.ttf` | 900 | 10541596 | Homepage OG, blog thumbnail |

Font version token: `native-fonts-2026-06-12`.

## Native Dependency Assumptions

The source guard validates package and lockfile entries for `canvas`, `sharp`,
and `satori` without importing native packages by default. Import and renderer
smoke evidence belongs to later Node 20/native dependency gates because accepted
runtime timing and Docker evidence require installed native dependencies.

The current package ranges are:

| Package | Expected range | Runtime role |
|---|---|---|
| `canvas` | `^3.1.0` | Homepage OG canvas drawing |
| `sharp` | `^0.33.5` | Homepage OG WebP encoding |
| `satori` | `^0.18.3` | Blog thumbnail SVG rendering |

## Blog Background Fixtures

Blog background components are part of the native rendering fixture contract.
The expected fixture directory is
`app/api/blog/[lang]/[slug]/thumbnail/[format]/bgs`.

| Fixture | Expected bytes |
|---|---:|
| `AppDeploymentBg.tsx` | 24016 |
| `AppStoreChoicesBg.tsx` | 22425 |
| `BestPracticesBg.tsx` | 16186 |
| `TechComparedBg.tsx` | 11821 |
| `WhatIsBg.tsx` | 82149 |

The expected total is 156597 bytes. `WhatIsBg.tsx` is the largest fixture and
must remain represented in benchmark selection.

## Validation Commands

Run the focused source checks and composed deployment guards:

```bash
node --test scripts/check-native-rendering-policy.test.mjs scripts/benchmark-native-rendering.test.mjs scripts/smoke-docker-nginx.test.mjs scripts/check-deployment-parity.test.mjs scripts/check-static-output.test.mjs scripts/check-static-export-routes.test.mjs
npm run native-rendering:check
npm run native-rendering:benchmark
npm run static-routes:check
npm run static-output:check
npm run validate:deployment
npm run docker:smoke
```

`npm run native-rendering:check` validates policy rows, source files,
route-policy alignment, cache-key fields, accepted formats, DPR caps, exact font
bytes, package entries, package-script wiring, and current-shell caveats.

`npm run native-rendering:benchmark` exits 0 with `SKIPPED_WITH_CAVEAT` while
`PHASE12_RUN_NATIVE_BENCHMARK` is closed. When the gate is open, it requires
Node 20, installed dependencies, generated Fumadocs source, and static export
output before importing native renderers or running PNG `ImageResponse` smoke.

`npm run static-routes:check` keeps the Phase 10 classification link active for
the two runtime native route rows and verifies Phase 12 native image surfaces
stay owned by `phase-12-native-rendering`.

`npm run static-output:check` reports native artifact status from
`public/generated/native-images` and `out/generated/native-images` only when
source artifacts or static export output exist. Missing `out` remains
`SKIPPED_WITH_CAVEAT` while the locked build gate is closed.

`npm run validate:deployment` runs `npm run native-rendering:check` between the
generated App Store diff guard and static-output/Docker smoke checks.

`npm run docker:smoke` exits 0 with `SKIPPED_WITH_CAVEAT` while
`PHASE9_RUN_DOCKER_SMOKE` is closed. When opened, the Docker plan verifies
Dockerfile tokens for Node 20, native library packages, `npm ci && npm run
build`, `/app/out`, `/usr/share/nginx/html`, then runs the native rendering
source check and gated benchmark command before disposable image/container
smoke probes.

## Current Caveats

The current shell can provide source-level validation. Accepted native timing
and Docker evidence require later Phase 12 gates under Node 20 with installed
native dependencies.

Current caveats tracked by the policy:

| Caveat | Current source-level meaning |
|---|---|
| Active shell Node v24 | `.nvmrc` is 20, so accepted runtime benchmark evidence needs Node 20. |
| `node_modules` absent | Package import and renderer smoke evidence wait for dependency-installed gates. |
| `.source` absent | Generated Fumadocs content evidence waits for locked build gates. |
| `out` absent | Static-export artifact evidence waits for build gates. |
| Docker CLI unavailable | Docker/native image evidence waits for guarded Docker-capable environments. |

Open-gate wrappers are part of the acceptance contract. The native benchmark
wrapper passes only when `PHASE12_RUN_NATIVE_BENCHMARK=1` returns nonzero output
containing `BLOCKED` in this shell. The Docker smoke wrapper passes only when
`PHASE9_RUN_DOCKER_SMOKE=1` returns nonzero output containing `BLOCKED`.

## Phase 13 Handoff

Phase 12 hands Phase 13 a source-owned policy, route alignment guard, fixture
benchmark vocabulary, native dependency assumptions, static artifact caveats,
and Docker-gated evidence. Phase 13 consumes that evidence for browser traces
and final
`docs/performance-audit.md` status updates.
