# Object Storage Phase 13 Audit Baseline

**Phase:** 13
**Purpose:** Freeze the current worktree evidence before the English Object
Storage page is rewritten.
**Scope:** English placeholder, Chinese source material, screenshot evidence,
and route posture for the v1.3 start-here milestone.

## Current English placeholder audit

`content/docs/guides/object-storage/index.en.mdx` is a placeholder file with
Chinese-only metadata and zero English body content.

### Evidence from the current file

- The file contains only frontmatter (6 lines total, no body copy).
- The `title` value is `对象存储` (Chinese, not English).
- The `description` value is Chinese: `Sealos 对象存储提供企业级云存储解决方案，支持S3兼容接口、多语言SDK集成和精细权限管理。`
- The `keywords` array contains 12 Chinese terms: `对象存储`, `Sealos云存储`,
  `S3兼容存储`, `存储桶管理`, `文件上传下载`, `SDK集成`, `静态网站托管`,
  `访问权限控制`, `Kubernetes存储`, `云原生存储`, `数据安全`, `存储管理`.
- There is no English body copy.
- There is no quickstart section.
- There is no verification guidance.
- There is no overview paragraph.
- There is no credential retrieval guidance.

### Placeholder implications

- The English route already exists, but usable English content does not.
- Phase 14 must rewrite the page in place with real English frontmatter and body
  content.
- The frontmatter `title`, `description`, and `keywords` all need replacement
  with English equivalents.
- The current metadata residue confirms that direct translation drift is a real
  risk for this milestone, consistent with the AI Proxy Phase 10 finding.

## Chinese source-of-truth inventory

`content/docs/guides/object-storage/index.zh-cn.mdx` is the current factual
source (~10.6K, 282 lines). Its information architecture covers more ground
than the v1.3 English start-here target.

### Section inventory

#### Overview paragraph (lines 7-16) -- first-upload-path

Product description: Object Storage is Sealos's built-in object storage
service for managing unstructured data. Feature list covers 6 capabilities:
file upload, file download, public access permissions, SDK access, resource
monitoring, and static hosting.

**Classification:** first-upload-path -- the overview establishes product
understanding needed for the English page introduction.

#### `## 基本使用` > `### 创建存储桶` (lines 18-36) -- first-upload-path

Bucket creation walkthrough: open Sealos console, find Object Storage app
icon, click "Create Bucket" button, enter name, set access permission, click
"Apply". Includes a `<Callout>` block explaining the three permission levels:

- **private**: authenticated access only, for sensitive data
- **publicRead**: anonymous read, authenticated write, for content delivery
  and static hosting
- **publicReadWrite**: full anonymous read/write (use with caution)

**Classification:** first-upload-path -- bucket creation is step 1 of the
console-first first-upload walkthrough (per D-01, D-02).

#### `### 上传文件` (lines 38-58) -- first-upload-path

Step-by-step file upload via console UI using `<div className='fd-steps'>`:

1. Navigate to target bucket
2. Click "Upload" button in toolbar
3. Choose file or folder upload
4. Click "Upload" to start transfer

**Classification:** first-upload-path -- file upload is the core first-success
action (per D-02, D-08).

#### `### 修改访问权限` (lines 60-84) -- reference-only

Permission editing walkthrough: enter bucket settings, click "Edit" button,
select new access level, confirm and apply. Repeats the three permission
levels with slightly different usage guidance.

**Classification:** reference-only -- the English page should briefly explain
permission levels during bucket creation (per D-09) but does not need a
separate permission-editing section for the first-upload path.

#### `### 获取访问密钥` (lines 86-97) -- first-upload-path

Access Key retrieval: select target bucket, click "Access Key" button at
bottom-left. The popup window displays four values:

- Access Key
- Secret Key
- Internal endpoint (for services deployed inside Sealos Cloud)
- External endpoint (for external access)

**Classification:** first-upload-path -- credential retrieval is step 2 of
the first-upload walkthrough (per D-02, D-05).

#### `## 静态网站托管` (lines 98-126) -- deferred

Static website hosting setup: create a bucket with publicRead or
publicReadWrite permission, enable hosting, get auto-generated URL, configure
custom domain (links to App Deploy custom domain docs).

**Classification:** deferred -- static hosting is explicitly out of scope for
the v1.3 start-here milestone (per D-03, ROADMAP out-of-scope list).

#### `## 使用 SDK 访问对象存储` (lines 128-281) -- deferred

SDK integration guide covering:

- Prerequisites: DevBox project + existing bucket
- SDK installation for Go (`minio-go`), Java (MinIO Maven/Gradle dependency),
  Node.js (`minio` npm package), Python (`minio` pip package)
- Code examples: Go and Java upload examples with placeholder credentials
  (`xxxxxxxx`, `objectstorageapi.xxx.xxx.xxx`)
- Others tab linking to MinIO SDK documentation

**Classification:** deferred -- SDK/CLI examples are explicitly deferred to a
later milestone (per D-03, ROADMAP out-of-scope list).

### Scope interpretation for v1.3

- **In scope for English page:** Overview, bucket creation (with permission
  explanation), credential retrieval, file upload via console UI.
- **Out of scope for English page:** Permission editing walkthrough, static
  website hosting, SDK integration examples, monitoring.
- The Chinese page is a factual inventory for extracting product facts.
  Phase 14 should write the English page for English readers from scratch,
  using Chinese content as source material (per PROJECT.md constraints).

## Screenshot inventory

9 `.zh-cn.png` files exist in `content/docs/guides/object-storage/images/`.
All screenshots contain Chinese UI text.

### 1. `sealos-objectstorage.zh-cn.png`

- **Size:** 706K
- **Referenced by:** line 24 -- bucket creation section intro
- **Content:** Sealos console app launcher showing the Object Storage app icon
- **Classification:** decorative
- **Recommendation:** omit -- console navigation can be described in text;
  the large file size (706K) and Chinese UI labels make it unsuitable for the
  English page

### 2. `object-storage-create-bucket-interface.zh-cn.png`

- **Size:** 173K
- **Referenced by:** line 28 -- bucket creation section
- **Content:** Bucket creation UI with name input, permission dropdown, and
  "Apply" button
- **Classification:** first-upload-path
- **Recommendation:** reuse-with-alt-text -- this screenshot shows the core
  bucket creation interface; the form layout is language-neutral enough to be
  useful with English alt text, though Chinese button labels are visible

### 3. `object-storage-upload-file-interface.zh-cn.png`

- **Size:** 160K
- **Referenced by:** line 60 -- file upload section
- **Content:** File upload interface with toolbar upload button and file list
- **Classification:** first-upload-path
- **Recommendation:** reuse-with-alt-text -- shows the upload workflow; the
  toolbar and file list layout is useful for orientation even with Chinese
  labels

### 4. `sealos-bucket-permission-setting-entry.zh-cn.png`

- **Size:** 169K
- **Referenced by:** line 72 -- permission editing section
- **Content:** Permission edit entry point showing the "Edit" button location
- **Classification:** reference-only
- **Recommendation:** omit -- the permission editing section is reference-only
  for the first-upload path; the English page covers permission choice during
  bucket creation instead

### 5. `sealos-objectstorage-access-key-get-entry.zh-cn.png`

- **Size:** 168K
- **Referenced by:** line 92 -- Access Key retrieval section
- **Content:** Bucket list view highlighting the "Access Key" button at
  bottom-left
- **Classification:** first-upload-path
- **Recommendation:** reuse-with-alt-text -- shows users where to find the
  credential retrieval button; the button position is the key information

### 6. `sealos-objectstorage-access-key-get-result.zh-cn.png`

- **Size:** 50K
- **Referenced by:** line 96 -- Access Key retrieval result
- **Content:** Popup displaying Access Key, Secret Key, Internal endpoint,
  and External endpoint values
- **Classification:** first-upload-path
- **Recommendation:** reuse-with-alt-text -- the credential display popup
  shows the four values users need; field labels (Access Key, Secret Key,
  Internal, External) use English terms even in the Chinese UI

### 7. `sealos-objectstorage-static-hosting-enable.zh-cn.png`

- **Size:** 175K
- **Referenced by:** line 109 -- static hosting enable step
- **Content:** Static hosting enable button in bucket toolbar
- **Classification:** deferred
- **Recommendation:** omit -- static hosting is out of scope for v1.3

### 8. `sealos-objectstorage-static-hosting-access.zh-cn.png`

- **Size:** 172K
- **Referenced by:** line 117 -- static hosting access URL
- **Content:** Auto-generated hosting URL display
- **Classification:** deferred
- **Recommendation:** omit -- static hosting is out of scope for v1.3

### 9. `sealos-objectstorage-static-hosting-custom-domain.zh-cn.png`

- **Size:** 169K
- **Referenced by:** line 124 -- custom domain configuration
- **Content:** Custom domain configuration entry point
- **Classification:** deferred
- **Recommendation:** omit -- static hosting is out of scope for v1.3

### Screenshot summary

| Classification | Count | Screenshots | Recommendation |
|----------------|-------|-------------|----------------|
| first-upload-path | 4 | #2 bucket creation, #3 file upload, #5 access key entry, #6 access key result | reuse-with-alt-text |
| reference-only | 1 | #4 permission edit entry | omit |
| decorative | 1 | #1 app launcher icon | omit |
| deferred | 3 | #7 hosting enable, #8 hosting access, #9 hosting custom domain | omit |

**Publication risk note:** All 9 screenshots contain Chinese UI text. The 4
first-upload-path screenshots are reusable with English alt text because their
form layouts and button positions carry meaning independent of label language.
Phase 14 should decide at implementation time whether to include them or
describe the UI steps in text only.

## Route and navigation posture

### Navigation evidence

- `content/docs/guides/meta.en.json` contains `"object-storage"` as a
  top-level Guides entry at position 6 (index 5) in the `pages` array.
- The full `pages` array order: `devbox`, `app-deploy`, `databases`,
  `app-store`, `ai-proxy`, `object-storage`, `cronjob`.
- There is no `content/docs/guides/object-storage/meta.en.json` (no child
  page entries registered).
- The English route `/docs/guides/object-storage/` already resolves.
- The current English route posture is a single leaf page rooted at
  `content/docs/guides/object-storage/index.en.mdx`.

### IA implication

- Discovery already exists at the top level.
- v1.3 does not need section-local child-page navigation to make the Object
  Storage page reachable.
- The milestone can rewrite the existing leaf page in place without changing
  the public route.
- Phase 13 posture: single canonical leaf page, no child navigation (per
  ROADMAP success criteria 2).

## Product-truth handling policy (per D-10)

### Stable facts (may be stated as exact values)

- Object Storage is S3-compatible (MinIO-based).
- Credentials include four values: Access Key, Secret Key, Internal endpoint,
  External endpoint.
- Three permission levels exist: `private`, `publicRead`, `publicReadWrite`.
- The SDK ecosystem uses MinIO client libraries (Go, Java, Node.js, Python).
- Bucket names follow a `{namespace}-{name}` pattern (visible in Chinese code
  examples as `xxxxxxxx-hello`).

### Potentially unstable UI labels (stay neutral until Phase 14 live-verifies)

- Exact button text for bucket creation ("创建存储桶" / "Create Bucket").
- Exact button text for file upload ("上传" / "Upload").
- Exact button text for credential retrieval ("访问密钥" / "Access Key").
- Exact menu path to reach Object Storage in the Sealos console.
- Console URL pattern (currently `cloud.sealos.run` in Chinese docs).
- Exact position of the "Access Key" button (described as "bottom-left" in
  Chinese docs).

### Operational rule for later phases

- Use stable facts freely in the English page.
- Use generic descriptions for UI paths ("open the Object Storage app",
  "click the credential button") until Phase 14 confirms exact labels.
- Do not copy Chinese button text into English instructions as literal
  translations.

## Phase 13 execution implications

This audit is the baseline for the rest of Phase 13 and should remain the
reference point for the safe-example contract (13-02) and the page-outline
spec (13-03).

### Locked implications

- Preserve the single leaf page posture for
  `content/docs/guides/object-storage/index.en.mdx`.
- Do not invent child-page navigation or create
  `content/docs/guides/object-storage/meta.en.json`.
- Treat screenshot names, screenshot strings, and placeholder credential
  values in the Chinese code examples as evidence inputs rather than
  publication truth.
- Use this audit as the baseline for the safe first-upload example contract.
- Use this audit as the baseline for the single-page outline spec.

### Phase boundary reminder

- Phase 13 defines constraints and planning artifacts.
- Phase 13 does not yet rewrite the English Object Storage guide body.
- Phase 14 should consume this file as the auditable record of what the
  current worktree actually proves.
