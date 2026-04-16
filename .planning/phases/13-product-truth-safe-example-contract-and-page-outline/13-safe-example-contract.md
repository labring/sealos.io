# Object Storage Safe First-Upload Example Contract

**Phase:** 13
**Purpose:** Lock the allowed first-upload example shape, product-truth
handling, and verification contract for the English Object Storage start-here
page.
**Audience:** Phase 14 writers and reviewers.

## Console-UI first-upload example contract

Per D-01 and D-02, Phase 14 must use exactly one canonical first-upload
posture: a console-UI walkthrough. The English page walks the reader through
every step inside the Sealos console with zero code, zero SDK imports, and zero
CLI commands.

### Required example flow (per D-02)

The example must follow this exact sequence:

1. **Create a bucket** -- open the Object Storage app in the Sealos console,
   enter a bucket name, set permission to `private` (per D-07), and apply.
2. **Get credentials** -- click the "Access Key" button in the console to
   reveal Access Key, Secret Key, Internal endpoint, and External endpoint
   (per D-05).
3. **Upload a file** -- use the console Upload button to upload a small test
   file (per D-01).
4. **Verify success** -- the uploaded file appears in the console file list
   with its name, size, and timestamp visible (per D-08).

### Credential display rules (per D-05)

- Direct users to click the "Access Key" button in the console.
- The credential display shows four values: Access Key, Secret Key, Internal
  endpoint, External endpoint.
- The page must describe this as a console-guided retrieval action: the reader
  clicks a button in the console and reads their credentials from the popup.
- The page must NOT display placeholder credential values. No `xxxxxxxx`
  patterns, no `your-access-key-here` strings, no fabricated endpoint URLs.
- This approach differs from the AI Proxy v1.2 pattern (which used environment
  variables first, then the cURL command) because Object Storage v1.3 is
  console-UI-first per D-06. The reader never needs to paste credentials into
  a terminal for the first-upload path.

### File type and size recommendation

- Recommend uploading a small test file (e.g., a plain text file or a small
  image).
- Keep the recommendation generic enough that any user can follow it regardless
  of operating system or available files.
- Do not require a specific file format, exact file name, or exact size limit.

### What the example must NOT include (per D-03)

- No SDK code examples (Go, Java, Node.js, Python).
- No CLI upload commands (`mc`, `aws s3`, or similar).
- No `minio-go` or `minio` npm import examples.
- No programmatic credential handling or environment variable setup.
- No code blocks in the first-upload path.

### Why this contract is locked

- The canonical first-upload example must be console-UI-only.
- The example must stay minimal so the page remains a first-success tutorial,
  not a multi-client reference.
- SDK and CLI examples are explicitly deferred to a later milestone (per D-03).

## Permission guidance contract (per D-07, D-09)

### Default recommendation

- The example bucket must use `private` permission (safest default).
- The page must recommend `private` as the first-bucket choice.
- The page must frame `private` as the standard starting point for new users.

### Permission level explanations

The page must briefly explain all three levels (per D-09):

- **`private`**: only authenticated users can access bucket contents.
  Recommended for the first bucket and any bucket containing sensitive data.
- **`publicRead`**: anyone can read objects without authentication; write
  operations still require credentials. Suitable for content delivery and
  static website hosting.
- **`publicReadWrite`**: fully open read and write access. Use with caution;
  production environments should avoid this level.

### Permission scope for v1.3

- The example stays within `private` permission throughout the first-upload
  path.
- Public URL verification is out of scope for the first-upload path
  (per D-08).
- Permission editing guidance is reference-only: the page may mention that
  permissions can be changed later, but a full permission-editing walkthrough
  is not part of the first-upload flow.

## Verification signal contract (per D-08)

### First-success definition

- First-success = the uploaded file appears in the console file list.
- The page must describe what the user should see after upload: the file name,
  size, and timestamp visible in the bucket's file list view.
- This is a visual confirmation inside the console. The reader does not need to
  run any command or open any URL to verify.

### What verification must NOT include

- No public URL access test (the bucket is `private`).
- No SDK-based verification (no code in the first-upload path).
- No `curl` or `wget` download test.
- No programmatic file-existence check.

### Why console-list verification is sufficient

- The `private` bucket does not expose public URLs, so URL-based verification
  is impossible without additional credential setup.
- Console-list verification is the simplest confirmation that requires zero
  extra tools beyond the browser the reader is already using.

## Product-truth constraints (per D-10)

Phase 14 must follow a mixed product-truth policy. The audit baseline
(`13-object-storage-audit.md`) provides the evidence for each classification
below.

### Stable facts (may state as exact values)

These facts are verified in the Chinese source and the product architecture.
Phase 14 may write them as direct statements:

- Object Storage is S3-compatible (MinIO-based).
- Credentials include four values: Access Key, Secret Key, Internal endpoint,
  External endpoint.
- Three permission levels exist: `private`, `publicRead`, `publicReadWrite`.
- The product supports file upload, download, and permission management through
  the console.
- MinIO-compatible SDK access is available (mention only; no code examples in
  v1.3).
- Bucket names follow a `{namespace}-{name}` pattern.

### Unstable facts (use neutral descriptions until Phase 14 live-verifies)

These facts depend on UI rendering, localization, or deployment configuration
that may change between releases. Phase 14 must use generic action-oriented
descriptions:

- Exact button labels in the console (e.g., the precise text on the Upload
  button, the Access Key button, the Create Bucket button).
- Exact menu navigation paths to reach Object Storage in the Sealos console.
- Console URL patterns (e.g., `cloud.sealos.run` may change by region or
  release).
- Exact file size limits or storage quotas.
- Exact UI layout or position of controls (e.g., "bottom-left" for the Access
  Key button may shift).

### Handling rule

- **Stable facts:** write as direct statements with exact values.
- **Unstable facts:** use generic action-oriented descriptions that remain
  correct even if the UI changes (e.g., "click the upload control" rather than
  "click the Upload button labeled 'Upload'"; "open the credential display"
  rather than "click the button at the bottom-left corner labeled 'Access
  Key'").
- **When in doubt:** prefer neutral descriptions. A correct generic statement
  is better than an exact statement that becomes stale after a UI update.

### Evidence-only inputs, not approved final values

- The Chinese button text "创建存储桶" is an evidence input, not an approved
  English label.
- The Chinese button text "上传" is an evidence input, not an approved English
  label.
- The Chinese button text "访问密钥" is an evidence input, not an approved
  English label.
- The console URL `cloud.sealos.run` visible in the Chinese docs is an
  evidence input, not automatically approved as the final public URL.
- Placeholder credential strings in Chinese code examples (`xxxxxxxx`,
  `objectstorageapi.xxx.xxx.xxx`) are evidence of the credential shape, not
  values to reproduce in the English page.

## Screenshot posture for Phase 14

The audit baseline (`13-object-storage-audit.md`) classified all 9 existing
screenshots. For the English page:

### First-upload-path screenshots (may reuse with English alt text, per D-04)

These screenshots show the core bucket creation and upload workflow. Their form
layouts and button positions carry meaning independent of label language:

- `object-storage-create-bucket-interface.zh-cn.png` -- bucket creation UI
- `object-storage-upload-file-interface.zh-cn.png` -- file upload interface
- `sealos-objectstorage-access-key-get-entry.zh-cn.png` -- Access Key button
  location
- `sealos-objectstorage-access-key-get-result.zh-cn.png` -- credential popup
  display

Phase 14 should add English alt text noting that the screenshots show Chinese
UI. Phase 14 may also decide to describe the UI steps in text only if
screenshots add more confusion than clarity for English readers.

### Deferred screenshots (omit from v1.3 English page)

- `sealos-objectstorage-static-hosting-enable.zh-cn.png`
- `sealos-objectstorage-static-hosting-access.zh-cn.png`
- `sealos-objectstorage-static-hosting-custom-domain.zh-cn.png`

These belong to the static hosting feature, which is out of scope for v1.3.

### Decorative screenshots (omit, describe in text instead)

- `sealos-objectstorage.zh-cn.png` -- app launcher icon (706K, Chinese UI
  labels). Console navigation should be described in text.

## Deferred content boundary

Phase 14 must NOT include the following content in the v1.3 English Object
Storage page. Each item is explicitly deferred to a later milestone:

- **SDK integration examples** (Go, Java, Node.js, Python) -- deferred per
  D-03, tracked as ENHC-01.
- **Static website hosting walkthrough** -- deferred, tracked as ENHC-02.
- **Monitoring and resource metrics guidance** -- deferred, tracked as
  ENHC-03.
- **Custom domain configuration** -- deferred, tracked as ENHC-04.
- **Multi-page Object Storage navigation** -- v1.3 is one canonical English
  leaf page with no child-page structure.
- **Permission editing walkthrough** -- the first-upload path covers permission
  choice during bucket creation; a separate editing section is not needed for
  v1.3.
- **Programmatic credential handling** -- no environment variable setup, no
  config file guidance, no `.env` patterns in v1.3.

### Boundary reminder

- Phase 14 may add explanatory prose around this contract.
- Phase 14 may not change the canonical example shape (console-UI-only) without
  reopening Phase 13 decisions.
- Phase 14 may mention SDK access and static hosting as "available features" or
  "next steps" at the end of the page, but must not provide step-by-step
  guidance for deferred items.
