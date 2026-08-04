---
phase: 31-canonical-index-generation-and-local-parity
reviewed: 2026-08-03T19:39:06Z
depth: standard
files_reviewed: 9
files_reviewed_list:
  - package.json
  - public/ai-faqs.en.json
  - scripts/ai-faq-fixture.mjs
  - scripts/ai-faq-index.mjs
  - scripts/ai-faq-index.test.mjs
  - scripts/generate-ai-faq-index.mjs
  - scripts/measure-build-pipeline.js
  - scripts/measure-build-pipeline.test.mjs
  - scripts/verify-ai-faq-index.mjs
findings:
  critical: 2
  warning: 4
  info: 0
  total: 6
status: issues_found
---

# Phase 31: Code Review Report

**Reviewed:** 2026-08-03T19:39:06Z
**Depth:** standard
**Files Reviewed:** 9
**Status:** issues_found

## Summary

The canonical projection and ordinary UTF-8 happy path are internally
consistent, and the committed 2,000-record asset matches the current source
corpus. Two release-blocking defects remain: lossy UTF-8 decoding can accept
invalid source bytes and produce a false byte-parity pass, and ingestion
failures bypass the structured diagnostic path required by the phase contract.
Four additional findings affect publication status accuracy, error
classification, deterministic ordering, and regression reliability.

## Narrative Findings (AI reviewer)

The Node.js 20 focused suites passed with 57 FAQ tests and 8 timed-pipeline
tests. Independent byte-level, source-side, stream-failure, permission, and
locale fixtures exposed the issues below despite those passing suites.

## Critical Issues

### CR-01: Lossy UTF-8 decoding defeats source validation and byte parity

**Classification:** BLOCKER

**File:** `scripts/ai-faq-index.mjs:207`, `scripts/ai-faq-index.mjs:628`,
`scripts/verify-ai-faq-index.mjs:31`

**Issue:** Both source files and the generated index are read directly as
`utf8` strings. Node replaces malformed UTF-8 byte sequences with U+FFFD during
that conversion. A source JSON file containing byte `0xff` inside a quoted
field therefore loads successfully as U+FFFD and can be republished with
different bytes. More seriously, when the canonical source value is U+FFFD,
an index containing `0xff` in place of the canonical three-byte UTF-8 sequence
decodes to the same JavaScript string. The verifier returned status 0 for that
fixture even though the canonical and actual buffers were 70 and 68 bytes and
were byte-unequal. This violates invalid-input rejection and canonical byte
parity, and it creates a silent source-data rewrite path.

**Fix:** Read buffers, decode JSON with a fatal UTF-8 decoder, and retain the raw
index buffer for canonical comparison.

```javascript
import { TextDecoder } from 'node:util';

const utf8Decoder = new TextDecoder('utf-8', { fatal: true });

const sourceBuffer = await readFile(entry.sourcePath);
const sourceData = JSON.parse(utf8Decoder.decode(sourceBuffer));

const indexBuffer = await readFile(indexPath);
const indexRecords = JSON.parse(utf8Decoder.decode(indexBuffer));
const expectedBuffer = Buffer.from(expectedBytes, 'utf8');

if (!expectedBuffer.equals(indexBuffer)) {
  // Add the non-canonical serialization finding from raw buffers.
}
```

### CR-02: Ingestion failures bypass the required structured report

**Classification:** BLOCKER

**File:** `scripts/verify-ai-faq-index.mjs:27`,
`scripts/verify-ai-faq-index.mjs:42`,
`scripts/generate-ai-faq-index.mjs:41`,
`scripts/generate-ai-faq-index.mjs:69`

**Issue:** `loadCanonicalFAQSource()` throws before the verifier reads or
compares the index. The broad CLI catch blocks then print only
`AI FAQ source validation failed with N finding(s)`, discarding the structured
IDs, paths, fields, expected values, and actual values already attached to the
error. Invalid index JSON follows the same generic verifier catch. A fixture
with a malformed source filename and missing ID returned only a two-finding
count, with none of the 16 category totals or record details. Consequently,
source-side malformed/schema/duplicate/membership states cannot reach the
shared report formatter, and the generator gives maintainers no location to
repair. This breaks the bidirectional, actionable failure contract.

**Fix:** Expose a non-throwing source inspection result containing records and
findings. Feed those findings into the shared buckets before membership and
field comparison, and route every verifier failure through one formatter. The
generator should format the same structured source findings before returning
status 1.

```javascript
const { records: sourceRecords, findings: sourceFindings } =
  await inspectCanonicalFAQSource({ sourceDirectory, expectedCount });

const report = compareFAQIndexRecords({
  sourceRecords,
  sourceFindings,
  indexRecords,
  indexBytes: indexBuffer,
});

stderr.write(formatFAQIndexReport(report));
return report.ok ? 0 : 1;
```

## Warnings

### WR-01: A summary-stream error is reported as a failed publication after rename

**Classification:** WARNING

**File:** `scripts/generate-ai-faq-index.mjs:61`

**Issue:** The destination rename and `stdout.write()` share one `try` block.
If the summary stream throws after the rename, the catch reports
`AI FAQ index generation failed` and returns status 1 even though the
destination already contains the new canonical bytes. An injected throwing
stream reproduced exactly that state. The return status and operator message
therefore disagree with the committed filesystem state.

**Fix:** Mark publication complete immediately after rename and handle summary
output separately. A summary failure should identify that publication already
succeeded and must not claim that generation failed.

```javascript
await filesystem.rename(temporaryPath, outputPath);
cleanupTemporaryPath = false;

try {
  stdout.write(summary);
} catch (error) {
  stderr.write(`AI FAQ index was generated, but summary output failed: ${getErrorMessage(error)}\n`);
}
return 0;
```

### WR-02: Filesystem read failures are mislabeled as invalid JSON

**Classification:** WARNING

**File:** `scripts/ai-faq-index.mjs:203`

**Issue:** One catch covers both `readFile()` and `JSON.parse()`, then always
emits `invalid-source-json` for `$json`. A regular source file made unreadable
with `EACCES` was reported as malformed JSON even though its contents were
never read. The category, field, and expected value are inaccurate and will
misdirect the structured diagnostics once CR-02 is fixed.

**Fix:** Catch source I/O and JSON parsing separately. Preserve read errors as a
distinct ingestion finding with the source path and system error code, then use
`invalid-source-json` only after bytes were read and parsing failed.

### WR-03: Filename tie-breaking depends on the process locale

**Classification:** WARNING

**File:** `scripts/ai-faq-index.mjs:85`

**Issue:** `localeCompare()` uses the process's default ICU locale. For a
duplicate-ID fixture containing `1-z.en.json` and `1-\u00e4.en.json`, Node 20
ordered the files as `U+00E4,z` under an English locale and `z,U+00E4` under
`sv-SE`. Duplicate
finding order and source positions therefore vary across valid execution
environments, contrary to the stable diagnostic contract.

**Fix:** Use an explicit code-unit comparison for the filename tie-breaker.

```javascript
function compareSourceRecords(left, right) {
  if (left.id !== right.id) return left.id - right.id;
  if (left.filename < right.filename) return -1;
  if (left.filename > right.filename) return 1;
  return 0;
}
```

### WR-04: The regression matrix omits the failing ingestion boundaries

**Classification:** WARNING

**File:** `scripts/ai-faq-index.test.mjs:270`,
`scripts/ai-faq-index.test.mjs:1008`

**Issue:** Every `runVerifyFAQIndex()` stale-fixture case mutates the parsed
index. Source-side categories are exercised only through the pure comparator,
after bypassing the throwing production loader. The suite also uses decoded
strings for byte assertions and has no invalid UTF-8, source read error, or
post-rename stream failure case. This allowed both blockers and the publication
status defect to pass all 57 FAQ tests.

**Fix:** Add end-to-end temporary fixtures for malformed, sparse, duplicate,
unreadable, and invalid-UTF-8 source files; raw invalid-UTF-8 index bytes; and a
throwing success stream after rename. Assert exact category details, raw buffer
inequality, exit status, and final destination bytes.

---

_Reviewed: 2026-08-03T19:39:06Z_
_Reviewer: the agent (gsd-code-reviewer)_
_Depth: standard_
