# Phase 15 — Publish-Safety Audit

**Target:** `content/docs/guides/object-storage/index.en.mdx`
**Audit date:** 2026-04-18
**Plan:** 15-02 (Wave 2, depends on 15-01)
**Page state at audit:** post-Wave 1 hardening (commits e31f430, c0542fb); ~1168 words

This audit executes the grep-based publish-safety checks defined by D-16 of
the Phase 15 CONTEXT (English-only copy, no secrets or placeholder
credentials, no hardcoded console URLs, no exact-label assertions) and the
single-leaf posture checks defined by D-15 (top-level registration intact,
no local `meta.en.json`, no invented child-page routes).

---

## Check 1 — Chinese character residue (D-16)

**Scope:** body, headings, alt text, frontmatter (title, description,
keywords).

**Command:**

```
rg -n "[一-龥]" "content/docs/guides/object-storage/index.en.mdx"
```

**Expected:** zero matches.
**Actual:** zero matches. Exit code 1 (no match).

**Supplemental sweep for CJK punctuation and broader CJK blocks (macOS `rg`
covers CJK Unified Ideographs; a Python sweep additionally covers
`U+3000–303F`, `U+FF00–FFEF`, `U+2E80–2FFF`, `U+3400–4DBF`, `U+4E00–9FFF`):**

```
python3 -c "import re; ... pattern = [\u3000-\u303F\uFF00-\uFFEF\u2E80-\u2FFF\u3400-\u4DBF\u4E00-\u9FFF]"
```

**Expected:** zero matches.
**Actual:** zero matches.

**Frontmatter spot-check:**

```
title: "Object Storage"
description: "S3-compatible object storage on Sealos -- create a bucket and upload your first file through the console."
keywords: [object storage, S3, bucket, file upload, credentials, Sealos]
```

Frontmatter is English-only. Image alt text is English with the explicit
`(Chinese console UI)` annotation where the underlying screenshot still
renders the Chinese console, per the Phase 13 safe-example contract.

**Fix applied:** none required.

---

## Check 2 — Hardcoded secrets and placeholder credential strings (D-16)

**Command (superset of plan's required regex — adds `YOUR_ACCESS_KEY`,
`AKIA…`, `sk-…`, `<access-key>`, `<secret-key>`, and `SK…` shapes):**

```
rg -n "xxxxxxxx|your-access-key|your-secret-key|YOUR_ACCESS_KEY|AKIA[A-Z0-9]+|SK[A-Z0-9]+|sk-[A-Za-z0-9]|<access-key>|<secret-key>|objectstorageapi\." "content/docs/guides/object-storage/index.en.mdx"
```

**Expected:** zero matches.
**Actual:** zero matches. Exit code 1 (no match).

The page names the four credential values by type (`Access Key`,
`Secret Key`, Internal endpoint, External endpoint) without printing any
example value — which matches the safe-example contract's "name types, not
values" rule.

**Fix applied:** none required.

---

## Check 3 — Hardcoded console URLs in prose (D-16)

**Command (superset of plan's required regex — adds `cloud.sealos.io` and
any `*.sealos.{io,run}` hostname):**

```
rg -n "cloud\.sealos\.run|cloud\.sealos\.io|objectstorage\.[a-z]+\.sealos\.run|https?://[a-z]+\.sealos\.(io|run)" "content/docs/guides/object-storage/index.en.mdx"
```

**Expected:** zero matches in body prose. Local image paths under
`./images/...` are not URLs and fall outside this check.
**Actual:** zero matches. Exit code 1 (no match).

**Fix applied:** none required.

---

## Check 4 — Exact console button label assertions (D-16)

**Command:**

```
rg -n "button labeled|\"Upload\" button|\"Create Bucket\" button|\"Access Key\" button|click \"Upload\"|click \"Create Bucket\"|Click \"Upload\"|Click \"Create Bucket\"|Click \"Access Key\"" "content/docs/guides/object-storage/index.en.mdx"
```

**Expected:** zero matches.
**Actual:** zero matches. Exit code 1 (no match).

**Phrasing audit:** the page uses neutral action-oriented language
throughout — "use the bucket creation action", "use the access key action",
"use the upload action in the bucket toolbar". The phrase `Access Key`
appears only where it names the credential value itself (a stable
contract fact per the Phase 13 safe-example contract), not as the literal
text of a console button.

**Fix applied:** none required.

---

## Single-leaf posture

Per D-15, the English Object Storage surface must remain exactly one leaf
page under `/docs/guides/object-storage`, with the top-level registration
intact and no invented child routes.

### Check 5 — Top-level registration

**Command:**

```
rg -n "\"object-storage\"" "content/docs/guides/meta.en.json"
```

**Expected:** at least one match inside the `pages` array.
**Actual:**

```
content/docs/guides/meta.en.json:9:    "object-storage",
```

Exit code 0. Registration intact.

**Fix applied:** none required.

### Check 6 — No local Object Storage `meta.en.json`

**Command:**

```
test -f "content/docs/guides/object-storage/meta.en.json"
```

**Expected:** file does not exist (command returns non-zero).
**Actual:** file does not exist. Test command returned non-zero (`DOES NOT
EXIST`).

**Fix applied:** none required.

### Check 7 — No child-page links

**Command:**

```
rg -n "/docs/guides/object-storage/[a-z][a-z0-9-]+/?" "content/docs/guides/object-storage/index.en.mdx"
```

**Expected:** zero matches. The root route `/docs/guides/object-storage/`
is allowed (it is the page's own route) but must not carry an additional
path segment.
**Actual:** zero matches. Exit code 1 (no match).

**Fix applied:** none required.

### Check 8 — Directory contents

**Command:**

```
ls -la content/docs/guides/object-storage/
```

**Expected:** only `index.en.mdx`, `index.zh-cn.mdx`, and the `images/`
directory.
**Actual:**

```
images/
index.en.mdx        (7.4K)
index.zh-cn.mdx    (10.6K)
```

No stray MDX files. No local `meta.en.json`. No invented child directory.

**Fix applied:** none required.

---

## Summary

| # | Check                                         | Result |
|---|-----------------------------------------------|--------|
| 1 | Chinese character residue                     | PASS   |
| 1b | CJK punctuation / extended blocks            | PASS   |
| 2 | Hardcoded secrets and placeholder credentials | PASS   |
| 3 | Hardcoded console URLs in prose               | PASS   |
| 4 | Exact console button label assertions         | PASS   |
| 5 | Top-level `meta.en.json` registration         | PASS   |
| 6 | No local Object Storage `meta.en.json`        | PASS   |
| 7 | No invented child-page links                  | PASS   |
| 8 | Directory contents are single-leaf            | PASS   |

**Verdict:** PUBLISH-SAFE.

The English Object Storage page (`content/docs/guides/object-storage/index.en.mdx`)
is English-only, free of placeholder credentials, free of hardcoded console
URLs, free of exact-button-label assertions, and the single-leaf posture is
preserved. No edits to the page were required during this audit; the page
state established by Wave 1 (commits e31f430, c0542fb) already satisfies
D-15 and D-16.
