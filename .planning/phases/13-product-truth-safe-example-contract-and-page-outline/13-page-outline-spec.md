# Object Storage Page Outline Specification

**Phase:** 13
**Purpose:** Lock the English Object Storage page role, heading order, writing
guardrails, screenshot posture, and navigation exclusions for v1.3.
**Target file:** `content/docs/guides/object-storage/index.en.mdx`

## Canonical page role

`content/docs/guides/object-storage/index.en.mdx` is the single canonical
English Object Storage leaf page for v1.3.

### Role statement

- It is the single canonical English Object Storage leaf page.
- It is the first page English readers should use for zero-to-one first-upload
  success.
- It must deliver the overview, bucket creation, credential retrieval, first
  file upload, permission explanation, and scope boundary in one place.
- It must not become a router page or gain child-page navigation.

### Page-role implications

- Phase 14 rewrites the page in place (no new section shell).
- The route `/docs/guides/object-storage/` continues to land directly on the
  start-here content.
- No sibling child pages are created in v1.3.

## Heading-level outline

The English page follows one fixed order from product framing to first upload
to scope boundary. The headings and their roles are locked.

### Locked heading order

```
## What Object Storage Is
  - 1-2 paragraphs: what the product does, S3-compatible, managed by Sealos
  - Mention capabilities at a high level (upload, download, permissions, SDK access)
  - Do NOT list SDK languages or static hosting details

## Create a Bucket
  - Use `<div className='fd-steps [&_h4]:fd-step'>` for step-by-step
  - Walk through opening the Object Storage app and creating a bucket
  - Set permission to `private` (per safe-example contract D-07)
  - Include the permission-level Callout explaining private/publicRead/publicReadWrite (per D-09)

## Get Your Credentials
  - Direct user to click the "Access Key" button (per D-05)
  - Describe what appears: Access Key, Secret Key, Internal endpoint, External endpoint
  - Do NOT show placeholder credential values (per safe-example contract)
  - Note: Internal endpoint is for services running inside Sealos; External is for outside access

## Upload Your First File
  - Use `<div className='fd-steps [&_h4]:fd-step'>` for step-by-step
  - Walk through navigating to the bucket, clicking Upload, selecting a file
  - Recommend a small test file (e.g., a plain text or small image file)
  - Console-UI only, no code (per D-01)

## Verify Your Upload
  - First-success = file appears in the console file list (per D-08)
  - Describe what the user should see: file name, size, timestamp in the list
  - Phase 15 will strengthen this section with failure checks

## What's Next
  - Brief scope boundary: mention that Object Storage also supports SDK access,
    static hosting, and monitoring
  - Frame these as future capabilities the user can explore
  - Do NOT provide walkthrough steps for any of them
  - Optionally link to the Chinese page for users who read Chinese
```

### Ordering rationale

- This order reflects one console-first flow from product understanding to
  bucket creation to credentials to first upload to verification to scope
  boundary.
- Product framing reduces uncertainty before the reader sees any UI steps.
- Bucket creation must appear before credential retrieval (a bucket must exist
  to have credentials).
- Credential retrieval appears before file upload so the reader understands the
  full access model, even though the console upload itself does not require
  manually entering credentials.
- Verification follows the upload action as immediate confirmation of success.
- Scope boundary comes last so the page stays focused on the first-upload path.

## Frontmatter contract

The English page frontmatter must be fully English:

```yaml
title: "Object Storage"
description: "S3-compatible object storage on Sealos -- create a bucket and upload your first file through the console."
keywords: [object storage, S3, bucket, file upload, credentials, Sealos]
```

### Frontmatter rules

- The `title` replaces the current Chinese `对象存储`.
- The `description` is roughly 20 words, mentions S3-compatible and first
  upload.
- The `keywords` array uses English terms relevant to the first-upload path.
- No Chinese text remains in the frontmatter.

## MDX component usage

### Required components

- `<div className='fd-steps [&_h4]:fd-step'>` with `<h4>` sub-steps for
  "Create a Bucket" and "Upload Your First File" sections.
- `<Callout type="info">` for the permission-level explanation in the bucket
  creation section.
- `<Callout type="tip">` for the Internal vs External endpoint note in the
  credential retrieval section.

### Excluded components

- No `<Tabs>` or `<Tab>` components (no SDK code examples in v1.3).
- No code blocks with language syntax highlighting (console-UI-first approach).

## Screenshot posture

Based on the Phase 13 audit classifications
(see `13-object-storage-audit.md`, Screenshot inventory).

### Reuse with English alt text (first-upload-path)

| # | Filename | Content | Section |
|---|----------|---------|---------|
| 2 | `object-storage-create-bucket-interface.zh-cn.png` | Bucket creation UI with name input, permission dropdown, and Apply button | Create a Bucket |
| 3 | `object-storage-upload-file-interface.zh-cn.png` | File upload interface with toolbar upload button and file list | Upload Your First File |
| 5 | `sealos-objectstorage-access-key-get-entry.zh-cn.png` | Bucket list view highlighting the Access Key button | Get Your Credentials |
| 6 | `sealos-objectstorage-access-key-get-result.zh-cn.png` | Credential display popup showing Access Key, Secret Key, Internal, External | Get Your Credentials |

### Omit from v1.3 English page

| # | Filename | Reason |
|---|----------|--------|
| 1 | `sealos-objectstorage.zh-cn.png` | Decorative app launcher icon; describe in text instead (706K, Chinese labels) |
| 4 | `sealos-bucket-permission-setting-entry.zh-cn.png` | Permission editing section is reference-only; text sufficient for first-upload path |
| 7 | `sealos-objectstorage-static-hosting-enable.zh-cn.png` | Static hosting is deferred to a later milestone |
| 8 | `sealos-objectstorage-static-hosting-access.zh-cn.png` | Static hosting is deferred to a later milestone |
| 9 | `sealos-objectstorage-static-hosting-custom-domain.zh-cn.png` | Custom domain configuration is deferred to a later milestone |

### Alt text rules

- All reused screenshots must have English alt text describing the action shown.
- Alt text should mention that the screenshot shows the Chinese console UI.
- Format example:
  `![Sealos Object Storage -- bucket creation interface (Chinese console UI)](./images/object-storage-create-bucket-interface.zh-cn.png)`
- Alt text should describe the user action or UI element visible in the
  screenshot, helping screen reader users understand the step.

### Screenshot instructional rule

- Screenshots are optional support; the text must stand on its own even if no
  screenshot ships.
- A screenshot can reinforce where to click, but it should not carry the
  primary instructional burden.
- Phase 14 decides at implementation time whether each screenshot adds enough
  value to include.

## Writing guardrails

### Language and tone

- All body copy, headings, callouts, and alt text in English.
- Action-oriented, second person ("you"), present tense.
- Short paragraphs (3-4 sentences max).
- Procedural steps use numbered lists inside `fd-steps`.
- Favor direct action language over promotional or marketing copy.

### Content boundaries (per safe-example contract deferred boundary)

Phase 14 must NOT include:

- SDK code examples or SDK install commands
- Static website hosting walkthrough
- Monitoring or resource metrics guidance
- Custom domain configuration
- CLI upload commands (`mc`, `aws s3`, etc.)
- Multiple worked examples for the same action
- Links to non-existent future Object Storage child pages

### Product-truth rules (per D-10 and audit)

**Stable facts -- state directly:**

- Object Storage is S3-compatible (MinIO-based)
- Credentials include four values: Access Key, Secret Key, Internal endpoint,
  External endpoint
- Three permission levels: `private`, `publicRead`, `publicReadWrite`
- The SDK ecosystem uses MinIO client libraries

**Potentially unstable UI labels -- use generic descriptions:**

- Exact button text for bucket creation (use "create a bucket" action language)
- Exact button text for file upload (use "upload" action language)
- Exact button text for credential retrieval (use "access key" action language)
- Exact menu path to reach Object Storage in the console
- Console URL pattern (do not hardcode a specific domain)
- Exact position of UI elements (screenshots can show position; text should
  describe the general area)

### Tone and pacing rules

- Keep section openings practical: state what the user will do, then guide
  through the steps.
- Every major section supports the reader's first successful file upload.
- The page reads as a start-here tutorial, not a translated reference manual.

## Navigation exclusions

### Locked navigation rules

- `content/docs/guides/meta.en.json` must NOT gain child entries under
  `object-storage`.
- No new MDX files are created under `content/docs/guides/object-storage/` in
  v1.3.
- The English Object Storage surface remains exactly one leaf page.
- Phase 14 must not create `content/docs/guides/object-storage/meta.en.json`.
- The page body handles orientation through headings, not through a sidebar
  subtree.

### Why this contract matters

- The English surface already has discovery via the top-level Guides entry.
- A router page would add one more click before first-upload success.
- Child-page navigation would imply a larger English library that does not yet
  exist.
- Content pressure beyond this page belongs in a later milestone.

## Explicit exclusions

The following structures and content types are outside the v1.3 page contract:

- No router page
- No multi-page English Object Storage library
- No SDK integration guide or code examples
- No static website hosting walkthrough
- No monitoring or resource metrics guide
- No custom domain configuration guide
- No CLI upload commands or examples
- No links to non-existent future Object Storage child pages
- No full permission management reference (brief explanation during bucket
  creation is sufficient)

### Enforcement note

- If content pressure grows beyond these boundaries, it belongs in a later
  phase.
- Phase 14 should follow this outline spec rather than reopening information
  architecture decisions.
