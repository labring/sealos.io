# Requirements: Sealos English Guide Restructure

**Defined:** 2026-04-16
**Core Value:** A Sealos user can complete the primary workflow for a product
area from 0 to 1 without getting lost in fragmented documentation.

## v1 Requirements

Requirements for milestone v1.3, focused on the English Object Storage
start-here surface.

### Product Understanding & Orientation

- [ ] **OBJ-01**: A user can open the English `Object Storage` guide and
  understand what the product is without falling back to the Chinese page.
- [ ] **OBJ-02**: A user can understand why they would use `Object Storage` in
  Sealos instead of managing S3-compatible storage separately.
- [ ] **OBJ-03**: A user can recognize that the English Object Storage page is
  the single start-here path for completing a first successful file upload.

### First Successful Upload

- [ ] **UPLD-01**: A user can create a storage bucket from the English guide
  path with clear permission-level guidance.
- [ ] **UPLD-02**: A user can obtain the minimum credentials needed for Object
  Storage, including Access Key, Secret Key, and Endpoint, from one English
  guide path.
- [ ] **UPLD-03**: A user can upload a first file to the bucket and confirm
  success without needing a second guide page.

### Verification & Recovery

- [ ] **VRFY-01**: A user can verify that the first file upload succeeded using
  both the console file list and a direct access URL.
- [ ] **VRFY-02**: A user can run a compact first-failure checklist covering
  wrong endpoint, wrong credentials, permission denied, bucket not found, or
  upload size issues.

### Content Quality & Publish Safety

- [ ] **QLTY-01**: A user sees only English title, description, keywords, and
  body copy across the English Object Storage page.
- [ ] **QLTY-02**: A user can reach the English Object Storage start-here page
  from the existing Guides navigation without exposing non-existent child pages.
- [ ] **QLTY-03**: A maintainer can validate the Object Storage docs milestone
  with practical repo checks, including route or content audit, `npm run build`,
  and `npm run lint`.
- [ ] **QLTY-04**: The English Object Storage page reflects current Sealos
  product truth and uses safe example patterns, including no hardcoded secrets
  and no stale unverified live values.

## v2 Requirements

Deferred to later milestones. Tracked but not included in the current roadmap.

### Enhancements

- **ENHC-01**: Users can access SDK integration examples (Go, Java, Node.js,
  Python) for programmatic Object Storage access via MinIO-compatible clients.
- **ENHC-02**: Users can follow a static website hosting walkthrough to deploy
  and access a site from an Object Storage bucket.
- **ENHC-03**: Users can monitor bucket resource metrics and storage usage from
  the English docs surface.
- **ENHC-04**: Users can configure custom domains for Object Storage static
  hosting with clear cross-reference to App Deploy domain setup.

## Out of Scope

Explicit exclusions for milestone v1.3.

| Feature | Reason |
|---------|--------|
| SDK integration examples (Go, Java, Node.js, Python) | Deferred — start-here page covers console-first workflow only |
| Static website hosting walkthrough | Deferred — secondary capability after first upload success |
| Monitoring and resource metrics | Deferred — operational depth beyond first-success scope |
| Custom domain configuration | Deferred — requires cross-product reference to App Deploy |
| A multi-page Object Storage library | v1.3 is one canonical English entry point |
| Chinese Object Storage documentation rewrite | English-only milestone |
| Broad redesign of unrelated guide sections | Keep milestone focused |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| OBJ-01 | Phase 14 | Pending |
| OBJ-02 | Phase 14 | Pending |
| OBJ-03 | Phase 14 | Pending |
| UPLD-01 | Phase 14 | Pending |
| UPLD-02 | Phase 14 | Pending |
| UPLD-03 | Phase 14 | Pending |
| VRFY-01 | Phase 15 | Pending |
| VRFY-02 | Phase 15 | Pending |
| QLTY-01 | Phase 15 | Pending |
| QLTY-02 | Phase 15 | Pending |
| QLTY-03 | Phase 15 | Pending |
| QLTY-04 | Phase 13 | Pending |

**Coverage:**
- v1 requirements: 12 total
- Mapped to phases: 12
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-16*
*Last updated: 2026-04-16 after Object Storage v1.3 roadmap creation*
