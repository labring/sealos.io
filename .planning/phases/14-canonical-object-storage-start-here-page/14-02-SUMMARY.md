---
phase: 14-canonical-object-storage-start-here-page
plan: 02
subsystem: docs

tags: [object-storage, mdx, fumadocs, fd-steps, callout, bucket, credentials]

# Dependency graph
requires:
  - phase: 13-product-truth-safe-example-contract-and-page-outline
    provides: heading order, safe-example contract (D-05, D-07, D-09), screenshot posture, product-truth rules
  - phase: 14-01
    provides: English frontmatter and "What Object Storage Is" overview section
provides:
  - Create a Bucket section with fd-steps walkthrough and private-permission default
  - Permission-levels Callout explaining private, publicRead, publicReadWrite
  - Get Your Credentials section covering Access Key, Secret Key, Internal endpoint, External endpoint
  - Internal vs External endpoint Callout
  - Reused Chinese screenshots with English alt text (3 screenshots)
affects: [14-03, 15]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - fd-steps with h4 sub-steps for console walkthrough
    - Callout type="info" for permission-level explanation
    - Callout type="tip" for endpoint selection guidance
    - Screenshot reuse with English alt text noting Chinese console UI

key-files:
  created: []
  modified:
    - content/docs/guides/object-storage/index.en.mdx

key-decisions:
  - "Used action language ('use the bucket creation action', 'use the access key action') instead of quoting exact Chinese button labels, per D-10 unstable-fact rule"
  - "Described credential retrieval as a console-guided action with no placeholder values, per D-05"
  - "Framed private as the recommended starting point with all three permission levels explained, per D-07 and D-09"
  - "Included both credential screenshots (entry button and result popup) to carry UI position context that English labels cannot"

patterns-established:
  - "Append-only authoring: new sections are appended after prior-wave content, never replacing it"
  - "Console-UI-first prose: reader retrieves credentials by reading from a popup, never by pasting placeholders"

requirements-completed: [UPLD-01, UPLD-02]

# Metrics
duration: 5min
completed: 2026-04-18
---

# Phase 14 Plan 02: Bucket Creation and Credential Retrieval Sections Summary

**Create a Bucket walkthrough with three-permission-level Callout and Get Your Credentials section covering all four credential values with Internal-vs-External endpoint guidance**

## Performance

- **Duration:** ~5 min
- **Completed:** 2026-04-18
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments
- Appended "## Create a Bucket" section with `fd-steps` walkthrough (Open the Object Storage app, Create a new bucket) and private-permission default
- Added Callout explaining all three permission levels (private, publicRead, publicReadWrite) with private framed as recommended starting point
- Appended "## Get Your Credentials" section covering all four stable credential values (Access Key, Secret Key, Internal endpoint, External endpoint) as a console-guided retrieval action
- Added Callout explaining Internal endpoint (inside Sealos, lower latency) vs External endpoint (outside access)
- Reused three Chinese console screenshots with English alt text noting Chinese console UI

## Task Commits

1. **Task 1: Author bucket creation and credential retrieval sections** - `11a876f` (feat)

## Files Created/Modified
- `content/docs/guides/object-storage/index.en.mdx` - Appended Create a Bucket and Get Your Credentials sections after the overview

## Decisions Made
- Action-language phrasing ("use the bucket creation action", "use the access key action") rather than literal English button labels, matching D-10 unstable-fact policy so the guide stays correct if console labels shift
- Credential display described as reading values from a popup, with zero placeholder strings, matching D-05 safe-example contract
- Both credential screenshots kept (entry button + result popup) because UI position carries meaning that prose alone cannot convey for English readers navigating a Chinese UI

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- English Object Storage page now covers: overview, bucket creation with permission guidance, credential retrieval with endpoint explanation
- Plan 14-03 can append: Upload Your First File, Verify Your Upload, What's Next sections
- Existing content from Plan 14-01 preserved unchanged; append-only contract respected

## Self-Check: PASSED

Verification results:
- `## Create a Bucket` heading: present (line 28)
- `## Get Your Credentials` heading: present (line 66)
- `fd-steps` usage: present
- `Callout` components: 2 (type="info" for permissions, type="tip" for endpoints)
- `private` + `publicRead` + `publicReadWrite` mentioned
- Chinese characters in file: 0 (verified via python3 regex)
- `xxxxxxxx` placeholder strings: 0
- Existing "## What Object Storage Is" from Plan 14-01: preserved unchanged
- Commit `11a876f` exists in git log

---
*Phase: 14-canonical-object-storage-start-here-page*
*Completed: 2026-04-18*
