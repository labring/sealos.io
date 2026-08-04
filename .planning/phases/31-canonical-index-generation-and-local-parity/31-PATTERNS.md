# Phase 31: Canonical Index Generation And Local Parity - Pattern Map

**Mapped:** 2026-08-03
**Files analyzed:** 9 planned created or modified files
**Analogs found:** 9 / 9
**Primary analog families:** 5

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `scripts/ai-faq-index.mjs` | shared utility/domain module | file-I/O -> transform | `scripts/ai-faq-fixture.mjs` | role-match |
| `scripts/ai-faq-fixture.mjs` | compatibility adapter/utility | file-I/O -> transform | current `loadFAQPages()` and `groupByNormalizedSlug()` | direct modification |
| `scripts/generate-ai-faq-index.mjs` | CLI controller | file-I/O -> transform | `scripts/generate-apps-api.js` | role-match |
| `scripts/verify-ai-faq-index.mjs` | CLI controller | file-I/O -> transform | `scripts/verify-ai-faq-slugs.mjs`, `scripts/check-deployment-parity.js` | role-match |
| `scripts/ai-faq-index.test.mjs` | test | file-I/O -> transform | `scripts/generate-apps-api.test.mjs`, `scripts/check-deployment-parity.test.mjs` | role-match |
| `public/ai-faqs.en.json` | generated data/config | batch transform -> static asset | `FAQSearch.tsx` public contract | contract-match |
| `package.json` | package configuration | process orchestration | existing `scripts` block | direct modification |
| `scripts/measure-build-pipeline.js` | pipeline controller | event-driven child-process stages | existing stage factory and runner | direct modification |
| `scripts/measure-build-pipeline.test.mjs` | test | event-driven stage ordering | existing stage-order and failure tests | direct modification |

## Primary Analog Families

1. `scripts/ai-faq-fixture.mjs` supplies the existing English-source loader and
   the legacy normalized-slug grouping seam.
2. `scripts/verify-ai-faq-slugs.mjs` supplies the source-wide FAQ verifier
   shape and the 2,000-record assertion convention.
3. `scripts/generate-apps-api.js` plus `scripts/generate-apps-api.test.mjs`
   supplies the generated-data CLI, exported pure-function, and `node:test`
   conventions.
4. `scripts/check-deployment-parity.js` plus its test supplies an injectable
   CLI boundary with stream capture and returned exit codes.
5. `scripts/measure-build-pipeline.js` plus its test supplies ordered,
   fail-fast direct-Next stages and exact stage-list assertions.

## Cross-File Data Flow

```text
content/ai-quick-reference/*.en.json
  -> scripts/ai-faq-index.mjs
     -> scripts/generate-ai-faq-index.mjs -> public/ai-faqs.en.json
     -> scripts/verify-ai-faq-index.mjs -> package build gates and timed stages
     -> scripts/ai-faq-fixture.mjs -> existing slug and Phase 32 route verifiers
```

The shared module owns filename identity, source validation, projection,
numeric order, canonical bytes, semantic comparison, and finding formatting.
The generator and verifier remain thin command adapters around that boundary.

## Pattern Assignments

### `scripts/ai-faq-index.mjs` (shared utility, file-I/O -> transform)

**Closest analog:** `scripts/ai-faq-fixture.mjs`

**Source-loading shape** ([scripts/ai-faq-fixture.mjs](../../../scripts/ai-faq-fixture.mjs#L1-L24)):

```javascript
import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

export async function loadFAQPages() {
  const sourceFiles = (await readdir(sourceDirectory))
    .filter((file) => file.endsWith(sourceSuffix))
    .sort();

  return Promise.all(sourceFiles.map(async (file) => {
    const slug = file.slice(0, -sourceSuffix.length);
    return {
      slug,
      url: `/ai-quick-reference/${slug}`,
      data: JSON.parse(await readFile(resolve(sourceDirectory, file), 'utf8')),
    };
  }));
}
```

**Apply:** keep explicit `node:` imports and a small exported async loader.
Phase 31 replaces the lexical sort with parsed numeric identity and replaces
the unbounded map with ordered bounded batches. Export pure helpers for
validation, projection, serialization, comparison, and report formatting so
the generator, verifier, fixture adapter, and test file share one behavior.

**Compatibility record shape:** legacy consumers currently receive `slug`,
`url`, and parsed `data`; preserve that adapter shape after the shared module
adds its internal numeric ID and projected-record representation.

### `scripts/ai-faq-fixture.mjs` (compatibility adapter, file-I/O -> transform)

**Direct analog:** its current public API

**Normalized grouping seam** ([scripts/ai-faq-fixture.mjs](../../../scripts/ai-faq-fixture.mjs#L26-L35)):

```javascript
export function groupByNormalizedSlug(pages) {
  const groups = new Map();
  for (const page of pages) {
    const normalizedSlug = page.slug.replace(/^\d+-/, '');
    const group = groups.get(normalizedSlug) || [];
    group.push(page);
    groups.set(normalizedSlug, group);
  }
  return groups;
}
```

**Apply:** retain `loadFAQPages()` and `groupByNormalizedSlug()` exports. Make
`loadFAQPages()` delegate to `ai-faq-index.mjs`, then map the validated source
records back to the existing page object shape. This keeps
`verify-ai-faq-slugs.mjs` and the Phase 32 route verifier compatible while
centralizing source enumeration and numeric ordering.

### `scripts/generate-ai-faq-index.mjs` (CLI controller, file-I/O -> transform)

**Closest analog:** `scripts/generate-apps-api.js`

**CLI orchestration and generated-data summary**
([scripts/generate-apps-api.js](../../../scripts/generate-apps-api.js#L480-L588)):

```javascript
async function processTemplates() {
  try {
    // Collect and transform all records before serializing output.
    const configContent = JSON.stringify(appConfigs, null, 2);
    fs.writeFileSync(APPS_CONFIG_PATH, configContent, 'utf8');
    console.log(`Generated main config file: ${APPS_CONFIG_PATH}`);
  } catch (error) {
    console.error('Error processing templates:', error.message);
    process.exit(1);
  }
}
```

**Entrypoint and testable exports**
([scripts/generate-apps-api.js](../../../scripts/generate-apps-api.js#L635-L644)):

```javascript
if (require.main === module) {
  processTemplates();
}

module.exports = {
  processTemplates,
  convertTemplateToAppConfig,
  buildTemplateListUrl,
};
```

**Apply:** use this separation of orchestration, concise English output, and
exported helpers. The Phase 31 `.mjs` command uses ESM and returns a status to
its entrypoint. Complete validation and canonical serialization precede one
exclusive same-directory temporary write and rename; the current generator's
direct `writeFileSync` is only a CLI-shape analog.

### `scripts/verify-ai-faq-index.mjs` (CLI controller, file-I/O -> transform)

**Source-scope verifier analog:** `scripts/verify-ai-faq-slugs.mjs`

**Imports, complete-source load, and inventory assertion**
([scripts/verify-ai-faq-slugs.mjs](../../../scripts/verify-ai-faq-slugs.mjs#L1-L16)):

```javascript
import assert from 'node:assert/strict';
import { groupByNormalizedSlug, loadFAQPages } from './ai-faq-fixture.mjs';

const pages = await loadFAQPages();
assert.equal(pages.length, 2000, 'the source collection must contain 2,000 pages');
const collisionGroups = groupByNormalizedSlug(pages);
```

**Injectable CLI analog**
([scripts/check-deployment-parity.js](../../../scripts/check-deployment-parity.js#L634-L681)):

```javascript
function runCli({
  argv = process.argv.slice(2),
  cwd = process.cwd(),
  stdout = process.stdout,
  stderr = process.stderr,
} = {}) {
  try {
    const result = validateDeploymentParity({ rootDir: cwd });
    printDeploymentParitySummary(result, stdout, stderr);
    return { exitCode: result.failures.length === 0 ? 0 : 1, result };
  } catch (error) {
    writeLine(stderr, `[deployment-parity] FAIL: ${error.message}`);
    return { exitCode: 1, error };
  }
}
```

**Apply:** export `runVerifyFAQIndex` with injected source/index paths and
streams. Return `0` or `1` to the entrypoint, print deterministic grouped
English diagnostics, and leave the working tree unchanged. Use the shared
module for parsed semantic and canonical-byte comparison.

### `scripts/ai-faq-index.test.mjs` (test, file-I/O -> transform)

**Pure-helper test pattern**
([scripts/generate-apps-api.test.mjs](../../../scripts/generate-apps-api.test.mjs#L1-L28)):

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import { buildTemplateListUrl, convertTemplateToAppConfig } from './generate-apps-api.js';

test('convertTemplateToAppConfig preserves template screenshots', async () => {
  const screenshots = ['https://example.com/app-screen-1.webp'];
  const app = await convertTemplateToAppConfig({
    metadata: { name: 'sample-app' },
    spec: { title: 'Sample App', screenshots },
  });
  assert.deepEqual(app?.screenshots, screenshots);
});
```

**CLI fixture and stream-capture pattern**
([scripts/check-deployment-parity.test.mjs](../../../scripts/check-deployment-parity.test.mjs#L159-L194)):

```javascript
const dir = await mkdtemp(join(tmpdir(), 'phase9-cli-lock-'));
const commands = [];
const lines = [];

const result = runCli({
  cwd: dir,
  stdout: { write: (line) => lines.push(line) },
  stderr: { write: (line) => lines.push(line) },
});

assert.equal(result.exitCode, 0);
await rm(dir, { recursive: true, force: true });
```

**Apply:** use built-in `node:test` and `node:assert/strict`; import the
shared `.mjs` module directly. Build compact fixtures under `mkdtemp(tmpdir())`,
clean each fixture through the test lifecycle, inject CLI paths and streams,
and assert returned status, deterministic output, and unchanged destination
bytes. Add one separate read-only real-corpus smoke.

### `public/ai-faqs.en.json` (generated data/config, batch transform -> static asset)

**Public-contract analog:**
`app/[lang]/(home)/ai-quick-reference/components/FAQSearch.tsx`

**Exact four-field contract**
([FAQSearch.tsx](../../../app/%5Blang%5D/(home)/ai-quick-reference/components/FAQSearch.tsx#L6-L11)):

```typescript
export interface FAQData {
  category: string;
  question: string;
  description: string;
  slug: string;
}
```

**Static fetch and client behavior**
([FAQSearch.tsx](../../../app/%5Blang%5D/(home)/ai-quick-reference/components/FAQSearch.tsx#L39-L57)):

```typescript
const response = await fetch('/ai-faqs.en.json');
if (response.ok) {
  const data: FAQData[] = await response.json();
  setAllFAQs(data);
}
```

**Apply:** generate a compact array whose object keys stay in this exact
order: `category`, `question`, `description`, `slug`. The artifact remains
committed, has no trailing newline, and changes only through the explicit
generator after source validation succeeds.

### `package.json` (configuration, process orchestration)

**Direct analog:** current scripts block

**Existing command placement and build shape**
([package.json](../../../package.json#L5-L22)):

```json
"build": "next build && node scripts/normalize-root-locale.js",
"build:analyze": "ANALYZE=true next build && node scripts/normalize-root-locale.js",
"test:ai-faq-slugs": "node scripts/verify-ai-faq-slugs.mjs",
"verify:ai-faq-routes": "node scripts/verify-ai-faq-routes.mjs",
"build:timed": "node scripts/measure-build-pipeline.js --mode=build"
```

**Apply:** add `generate:ai-faq-index`, `verify:ai-faq-index`, and
`test:ai-faq-index` alongside the existing FAQ commands. Prefix both standard
build commands with `npm run verify:ai-faq-index &&` so the read-only check
finishes before the Next command and root-locale normalization stays in its
current order.

### `scripts/measure-build-pipeline.js` (pipeline controller, event-driven child-process stages)

**Stage-construction pattern**
([scripts/measure-build-pipeline.js](../../../scripts/measure-build-pipeline.js#L88-L145)):

```javascript
function createStage(name, command, args, options = {}) {
  return { name, command, args, env: options.env };
}

if (mode === 'analyze') {
  return [
    createStage('pre generated diff guard', 'npm', ['run', 'app-store:diff']),
    createStage('Next analyzer build', getLocalNextCommand(), ['build'], {
      env: { ANALYZE: 'true' },
    }),
  ];
}
```

**Measured fail-fast execution**
([scripts/measure-build-pipeline.js](../../../scripts/measure-build-pipeline.js#L207-L244)):

```javascript
for (const stage of stages) {
  const result = runMeasuredStage(stage, options);
  results.push(result);
  if (result.status !== 0) {
    exitCode = result.status;
    break;
  }
}
```

**Apply:** add the AI FAQ parity command as the first build and analyze stage.
Keep the existing direct Next binary, analyzer environment scope, timing
records, and stop-on-first-failure behavior unchanged. Refresh mode remains
outside this phase boundary.

### `scripts/measure-build-pipeline.test.mjs` (test, event-driven stage ordering)

**Exact stage-list assertions**
([scripts/measure-build-pipeline.test.mjs](../../../scripts/measure-build-pipeline.test.mjs#L59-L90)):

```javascript
const stages = getStagesForMode('build');
assert.deepEqual(stages.map((stage) => stage.name), [
  'pre generated diff guard',
  'Next production build',
  'root locale normalization',
  'post generated diff guard',
]);
```

**Failure-order assertion**
([scripts/measure-build-pipeline.test.mjs](../../../scripts/measure-build-pipeline.test.mjs#L111-L132)):

```javascript
const result = runPipeline({ mode: 'build' }, { spawn });
assert.equal(result.exitCode, 2);
assert.equal(result.results.length, 2);
assert.deepEqual(seen[1], [getLocalNextCommand(), ['build']]);
```

**Apply:** update build and analyze expected arrays to start with the FAQ
parity stage. Add a failed-parity case that proves the Next binary remains
uninvoked and timing output only contains completed stages.

## Shared Patterns

### Explicit Runtime Imports

Use ESM `.mjs` files and explicit relative `.mjs` imports for every Phase 31
script-to-script dependency. Existing FAQ verification already imports the
shared fixture directly ([scripts/verify-ai-faq-slugs.mjs](../../../scripts/verify-ai-faq-slugs.mjs#L1-L8)); the new domain module becomes the single
source-loader import for the generator, verifier, fixture adapter, and test.

### Structured Domain Logic, Thin CLIs

Keep validation, projection, canonical serialization, comparison, and finding
formatting in `ai-faq-index.mjs`. The CLI boundary follows the injectable
`runCli` model at
[scripts/check-deployment-parity.js](../../../scripts/check-deployment-parity.js#L634-L686): injected paths and streams make CLI status and text testable
without production-only flags.

### Fixture Isolation And Cleanup

The focused test file follows the temporary-directory pattern in
[scripts/check-deployment-parity.test.mjs](../../../scripts/check-deployment-parity.test.mjs#L159-L194): unique `mkdtemp` roots, test-local output capture, and exact
recursive cleanup. Atomic-generation failure tests assert the original
destination bytes and the single owned temporary pathname.

### Ordered Build Gates

Package scripts gate normal builds; the timed helper has independent direct
Next execution, so it receives the same verifier as its first build/analyze
stage. The execution loop at
[scripts/measure-build-pipeline.js](../../../scripts/measure-build-pipeline.js#L215-L224) already preserves stage order and stops after the first non-zero
status.

### Preserved Scope Boundaries

`scripts/verify-ai-faq-routes.mjs` remains a Phase 32 surface. Its current
source load and route/sitemap checks begin at
[scripts/verify-ai-faq-routes.mjs](../../../scripts/verify-ai-faq-routes.mjs#L1-L18), so the fixture adapter preserves that contract while Phase 31 keeps
parity limited to source and `public/ai-faqs.en.json`.

The Vercel, Cloudflare, and Docker delivery files are verification-only
surfaces for this phase. Their package-build paths inherit the `package.json`
preflight, so the planned implementation assigns no workflow-file edit.

## No Direct Analog

| Needed Subpattern | Reason | Planner Direction |
|---|---|---|
| Same-directory exclusive temporary write followed by atomic rename | Existing generated-data code writes the destination directly at [scripts/generate-apps-api.js](../../../scripts/generate-apps-api.js#L580-L588); the repository has no safe atomic-publication helper in `scripts/`. | Implement the Phase 31 D-04 pattern with `node:fs/promises`, one UUID-named sibling temp path, `flag: 'wx'`, `rename`, and exact-path cleanup in `finally`. |

## Metadata

**Analog search scope:** `scripts/`, `package.json`, and the AI FAQ client
consumer.

**Files scanned:** 11 source, test, configuration, and client-contract files.

**Pattern extraction date:** 2026-08-03
