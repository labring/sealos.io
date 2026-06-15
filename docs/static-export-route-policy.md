# Static Export Route Policy

Phase 10 keeps generated SEO, search, text, native, external-service, and
API-like route behavior explicit for static export and deployment validation.
`config/static-export-route-policy.json` is the machine-readable source of
truth; this document is the matching human policy matrix.

## Classification Labels

Allowed labels:

- `static artifact`
- `static artifact via route handler`
- `documented deployment-supported route`
- `runtime native route`
- `external-service-backed route`
- `API-like runtime route with fallback`

## Route Matrix

| Route | Source | Method | Content type | Classification | Static export behavior | Input source | Runtime/external dependency | Budget | Validation command | Trace IDs |
|---|---|---|---|---|---|---|---|---|---|---|
| `/sitemap.xml` | `app/sitemap.ts` | GET | `application/xml` | `static artifact` | Expected artifact `out/sitemap.xml`. Main sitemap combines docs, blog, product, App Store, comparison, and localized marketing pages. | Fumadocs docs pages, blog pages, product paths, App Store config, comparison slugs, localized marketing paths. | Next.js static export and local loaders. External: none. | `main-sitemap`: 5000 URLs, 2097152 bytes. | `npm run static-routes:check` | ROUTEFIX-01, ROUTEFIX-02, ROUTEFIX-03, PERF-404, PERF-406, `static-export-route-classification` |
| `/ai-quick-reference/sitemap.xml` | `app/sitemap-ai-faq.ts` | GET | `application/xml` | `static artifact` | Expected artifact `out/ai-quick-reference/sitemap.xml`. AI FAQ sitemap uses `revalidate = false` and `dynamic = 'force-static'`. | Fumadocs AI quick reference pages for `en` and `zh-cn`. | Next.js static export and Fumadocs source loader. External: none. | `ai-faq-sitemap`: 5000 URLs, 2097152 bytes. | `npm run static-routes:check` | ROUTEFIX-01, ROUTEFIX-02, ROUTEFIX-03, PERF-404, PERF-406, `static-export-route-classification` |
| `/rss.xml` | `app/rss.xml/route.ts` | GET | `application/rss+xml; charset=utf-8` | `static artifact via route handler` | Expected artifact `out/rss.xml`; guard verifies RSS item shape when `out` exists. | Default-language blog pages. | Next.js route handler static export, `feed`, blog loader. External: none. | Informational. | `npm run static-routes:check` | ROUTEFIX-01, ROUTEFIX-02, PERF-406, `static-export-route-classification` |
| `/sitemap-index.xml` | `app/sitemap-index.xml/route.ts` | GET | `application/xml` | `static artifact via route handler` | Expected artifact `out/sitemap-index.xml`; guard verifies main sitemap and AI FAQ sitemap references. | Static sitemap location list and default locale domain. | Next.js route handler static export. External: none. | Informational. | `npm run static-routes:check` | ROUTEFIX-01, ROUTEFIX-02, PERF-406, `static-export-route-classification` |
| `/llms.txt` | `app/llms.txt/route.ts` | GET | `text/plain` | `static artifact via route handler` | Expected artifact `out/llms.txt`; guard enforces source-doc count and byte budgets. | Localized MDX docs files under `content/docs`. | Node filesystem, `fast-glob`, `gray-matter`, and remark pipeline during generation. External: none. | `llms`: 500 source docs, 2097152 bytes. | `npm run static-routes:check` | ROUTEFIX-01, ROUTEFIX-02, ROUTEFIX-03, PERF-402, PERF-503, PERF-406, `static-export-route-classification` |
| `/api/search` | `app/api/search/route.ts` | GET | `application/json` | `static artifact via route handler` | Expected artifact `out/api/search`; guard also accepts `out/api/search.json`, `out/api/search/index.json`, or `out/api/search/index.txt` when a build emits those shapes. | Fumadocs source language pages, page metadata, and heading-oriented search records. | Fumadocs `staticGET` and Mandarin tokenizer during generation. External: none. | `search-index`: 3000 records, 3145728 bytes. | `npm run static-routes:check` | ROUTEFIX-01, ROUTEFIX-02, ROUTEFIX-03, PERF-401, PERF-406, `fumadocs-search-index`, `static-export-route-classification` |
| `/robots.txt` | `app/api/robots/route.ts` | GET | `text/plain` | `documented deployment-supported route` | Supported by `public/robots.txt` and Cloudflare `/robots.txt /api/robots 200` in `public/_redirects`; guard verifies artifact or documented rewrite support. | Static public file and default-locale route handler host selection. | Cloudflare Pages rewrite support or static public file serving. External: none. | Informational. | `npm run static-routes:check` | ROUTEFIX-01, ROUTEFIX-02, PERF-406, `static-export-route-classification` |
| `/api/apps` | `app/api/apps/[[...lang]]/route.ts` | GET | `application/json` | `API-like runtime route with fallback` | Supported deployment path `/api/apps` and localized variants; committed `appsConfig` provides fallback when the remote template API fails. | Remote Sealos template API plus committed `config/apps.json` fallback through `lib/api/apps-api.ts`. | Next.js route support and apps API adapter. External: `template.sealos.io` API when network refresh is available. | Informational. | `npm run static-routes:check` | ROUTEFIX-01, ROUTEFIX-02, PERF-406, `static-export-route-classification` |
| `/api/og` | `app/api/og/route.ts` | GET | `image/webp` | `runtime native route` | Supported on deployments with native canvas and Sharp support. Phase 12 owns pre-generation, cache-key, font/native dependency, and renderer timing policy. | Open Graph canvas renderer defaults. | `canvas` renderer and `sharp` native libraries. External: none. | Phase 12 owner. | `npm run static-routes:check` | ROUTEFIX-01, PERF-406, `static-export-route-classification`, `og-native-rendering` |
| `/api/blog/:lang/:slug/thumbnail/:format` | `app/api/blog/[lang]/[slug]/thumbnail/[format]/route.ts` | GET | `image/png` | `runtime native route` | Supported on deployments with native image route support. Phase 12 owns native image route policy. | Fumadocs blog pages, route params, local fonts. | Next `ImageResponse`, Satori renderer, local font reads. External: none. | Phase 12 owner. | `npm run static-routes:check` | ROUTEFIX-01, PERF-406, `static-export-route-classification`, `og-native-rendering` |
| `/api/abuse/verify-turnstile` | `app/api/abuse/verify-turnstile/route.ts` | POST | `application/json` | `external-service-backed route` | Supported on deployments with server runtime and `TURNSTILE_SECRET_KEY`. Phase 10 only classifies this route and keeps Cloudflare siteverify calls out of local validation. | Request body Turnstile token and remote IP. | Server runtime, environment secret, process-local rate limit map. External: Cloudflare Turnstile siteverify API. | External-service boundary. | `npm run static-routes:check` | ROUTEFIX-01, PERF-406, `static-export-route-classification` |

## Budget Contract

| Output | Count budget | Byte budget | Measurement |
|---|---:|---:|---|
| Main sitemap | 5000 URLs | 2097152 bytes | Count `<loc>` entries and file bytes in `out/sitemap.xml`. |
| AI FAQ sitemap | 5000 URLs | 2097152 bytes | Count `<loc>` entries and file bytes in `out/ai-quick-reference/sitemap.xml`. |
| Search output | 3000 records | 3145728 bytes | Count generated JSON records and file bytes from the static search artifact. |
| `llms.txt` | 500 source docs | 2097152 bytes | Count `file:` source markers and file bytes in `out/llms.txt`. |
| RSS | Informational | Informational | Verify `out/rss.xml` shape when output exists. |
| Robots | Informational | Informational | Verify `public/robots.txt` or Cloudflare `/robots.txt /api/robots 200` support. |
| Sitemap index | Informational | Informational | Verify main sitemap and AI FAQ sitemap references. |

## Validation Gates

`npm run static-routes:check` validates route policy rows, source files,
classification labels, trace IDs, artifact containment, budgets, hosted probe
gate state, and policy-level validation gate traceability.

`npm run static-output:check` composes the Phase 9 source/static-output guard
with the Phase 10 route policy result. Missing `out` remains
`SKIPPED_WITH_CAVEAT` when `PHASE9_RUN_LOCKED_BUILD` is closed and fails closed
when the gate is open.

`validationGates.phase9Composition.traceIds` in
`config/static-export-route-policy.json` carries ROUTEFIX-04 for Phase 9
composition: source/static-output inspection, deployment parity gating, hosted
probe opt-in semantics, local output caveats, and locked-build validation.

Hosted route probes stay opt-in:

```bash
PHASE9_RUN_HOSTED_PROBES=1 PHASE10_HOSTED_BASE_URL=<approved-preview-url> npm run static-routes:check
```

Phase 9 remains owner for deployment target comparison, Docker smoke policy,
Node locked-build orchestration, and unsafe-gate definitions. Phase 11 owns
shared shell bundle and hydration work. Phase 12 owns native OG and thumbnail
rendering policy. Phase 13 owns browser trace closeout and broader asset budget
work.
