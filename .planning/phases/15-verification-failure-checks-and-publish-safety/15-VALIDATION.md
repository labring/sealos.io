---
phase: 15
slug: verification-failure-checks-and-publish-safety
status: passed
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-18
executed: 2026-04-19
requirements_verified:
  - VRFY-01
  - VRFY-02
  - QLTY-01
  - QLTY-02
  - QLTY-03
---

# Phase 15 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

This document is executed worktree-locally (see 15-CONTEXT D-13, D-14). It
mixes Object Storage-specific shell assertions with repo-level `npm run build`
and `npm run lint` commands. Unrelated pre-existing repo failures are
classified separately from Object Storage regressions per D-14.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | shell assertions (`test`, `rg`, `ls`) plus repo build and type-check commands |
| **Config file** | none (uses `package.json` scripts directly) |
| **Quick run command** | `bash -lc 'test -f "content/docs/guides/object-storage/index.en.mdx" && ! rg -n "[一-龥]" "content/docs/guides/object-storage/index.en.mdx" && rg -n "^## (What Object Storage Is\|Create a Bucket\|Get Your Credentials\|Upload Your First File\|Verify Your Upload\|If the first upload fails\|What.s Next)" "content/docs/guides/object-storage/index.en.mdx" && rg -n "^title: \"Object Storage\"" "content/docs/guides/object-storage/index.en.mdx" && ! rg -n "Phase 15 will extend this section" "content/docs/guides/object-storage/index.en.mdx" && rg -n "\`private\`" "content/docs/guides/object-storage/index.en.mdx" && ! rg -n "xxxxxxxx\|your-access-key\|your-secret-key\|YOUR_ACCESS_KEY\|AKIA[A-Z0-9]+\|sk-[A-Za-z0-9]\|<access-key>\|<secret-key>" "content/docs/guides/object-storage/index.en.mdx" && ! test -f "content/docs/guides/object-storage/meta.en.json" && rg -n "\"object-storage\"" "content/docs/guides/meta.en.json" && ! rg -n "/docs/guides/object-storage/[a-z][a-z0-9-]+/?" "content/docs/guides/object-storage/index.en.mdx"'` |
| **Full suite command** | Same quick run as step 1, followed by `npm run build`, then `npm run lint` (run in that order so `.next/types` exists when lint runs — mirrors the Phase 12 known-good ordering). |
| **Estimated runtime** | ~5–10 minutes (build-dominated) |

---

## Quick run command

Fast-feedback loop — runs only the Object Storage-specific shell assertions
(no build, no lint). Used during Waves 1–3 after every task commit and
re-runnable in 15-04 as cheap pre-flight before invoking `npm run build`.

```bash
# 1. Page file exists
test -f "content/docs/guides/object-storage/index.en.mdx"

# 2. English-only (no Chinese residue)
! rg -n "[一-龥]" "content/docs/guides/object-storage/index.en.mdx"

# 3. All six required H2 sections plus "What's Next" are present
rg -n "^## (What Object Storage Is|Create a Bucket|Get Your Credentials|Upload Your First File|Verify Your Upload|If the first upload fails|What's Next)" "content/docs/guides/object-storage/index.en.mdx"

# 4. Frontmatter title is the canonical "Object Storage"
rg -n '^title: "Object Storage"' "content/docs/guides/object-storage/index.en.mdx"

# 5. No leftover forward-reference to Phase 15 inside the shipped page
! rg -n "Phase 15 will extend this section" "content/docs/guides/object-storage/index.en.mdx"

# 6. `private` appears as the recommended bucket permission
rg -n "\`private\`" "content/docs/guides/object-storage/index.en.mdx"

# 7. No placeholder credentials
! rg -n "xxxxxxxx|your-access-key|your-secret-key|YOUR_ACCESS_KEY|AKIA[A-Z0-9]+|sk-[A-Za-z0-9]|<access-key>|<secret-key>" "content/docs/guides/object-storage/index.en.mdx"

# 8. No local meta.en.json under object-storage (single-leaf posture)
! test -f "content/docs/guides/object-storage/meta.en.json"

# 9. object-storage is still registered in top-level Guides nav
rg -n '"object-storage"' "content/docs/guides/meta.en.json"

# 10. No invented child-page links under /docs/guides/object-storage/<segment>/
! rg -n "/docs/guides/object-storage/[a-z][a-z0-9-]+/?" "content/docs/guides/object-storage/index.en.mdx"
```

All checks expected to exit 0 (or return zero matches for negated checks).

---

## Full suite command

Ordered closeout sequence. Object Storage assertions run first (cheap, fast
fail); `npm run build` runs next (catches any MDX/route/compile regression);
`npm run lint` runs last after the build has generated `.next/types`.

**Rationale:**

- **Object Storage shell assertions first:** seconds to run; if they fail,
  there is no point spending minutes on a full build.
- **`npm run build` next:** exercises the real Next.js production build,
  which is where any routing, MDX parsing, or static-generation regression
  would surface. Per Phase 12 D-13, this is the authoritative publish-safe
  check for docs changes.
- **`npm run lint` last:** the repo's `lint` script is `rm -f tsconfig.tsbuildinfo && tsc --noEmit`, which depends on `.next/types` existing.
  Running lint before build fails for the same pre-existing ordering reason
  documented in Phase 12 `12-VALIDATION.md`. Running lint after build makes
  the TypeScript check meaningful.

```bash
# --- Step 1: Object Storage shell assertions (quick suite above) ---
bash -lc '
  test -f "content/docs/guides/object-storage/index.en.mdx" \
  && ! rg -n "[一-龥]" "content/docs/guides/object-storage/index.en.mdx" \
  && rg -n "^## (What Object Storage Is|Create a Bucket|Get Your Credentials|Upload Your First File|Verify Your Upload|If the first upload fails|What.s Next)" "content/docs/guides/object-storage/index.en.mdx" \
  && rg -n "^title: \"Object Storage\"" "content/docs/guides/object-storage/index.en.mdx" \
  && ! rg -n "Phase 15 will extend this section" "content/docs/guides/object-storage/index.en.mdx" \
  && rg -n "\`private\`" "content/docs/guides/object-storage/index.en.mdx" \
  && ! rg -n "xxxxxxxx|your-access-key|your-secret-key|YOUR_ACCESS_KEY|AKIA[A-Z0-9]+|sk-[A-Za-z0-9]|<access-key>|<secret-key>" "content/docs/guides/object-storage/index.en.mdx" \
  && ! test -f "content/docs/guides/object-storage/meta.en.json" \
  && rg -n "\"object-storage\"" "content/docs/guides/meta.en.json" \
  && ! rg -n "/docs/guides/object-storage/[a-z][a-z0-9-]+/?" "content/docs/guides/object-storage/index.en.mdx"
'

# --- Step 2: Repo-level build ---
npm run build

# --- Step 3: Repo-level lint (after build so .next/types exists) ---
npm run lint
```

---

## Task Map

| Requirement | Validated by | Command(s) |
|-------------|--------------|------------|
| `VRFY-01` | Presence of `## Verify Your Upload` and first-success content | `rg -n "^## Verify Your Upload" "content/docs/guides/object-storage/index.en.mdx"` |
| `VRFY-02` | Presence of `## If the first upload fails` fixed five-item checklist | `rg -n "^## If the first upload fails" "content/docs/guides/object-storage/index.en.mdx"` |
| `QLTY-01` | English-only copy, no placeholder credentials, no hardcoded console URLs | Quick-suite checks 2, 7 plus `15-02-AUDIT.md` Check 3 (console URL grep) |
| `QLTY-02` | Single-leaf posture, top-level nav registration, no child routes | Quick-suite checks 8, 9, 10 |
| `QLTY-03` | Repo build-safe + type-check-safe closeout | `npm run build` + `npm run lint` |

---

## Sampling Rate

- **After every task commit (Waves 1–3):** run the task-specific `rg -n` or
  `test -f` check from the per-task map recorded in `15-01-SUMMARY.md`,
  `15-02-SUMMARY.md`, and `15-03-SUMMARY.md`.
- **After every plan wave:** run the quick suite above.
- **Phase closeout (15-04):** run the full suite above, classify every
  warning / failure per D-14, seal `15-VERIFICATION.md`.
- **Max feedback latency (shell suite):** under 10 seconds.
- **Max feedback latency (full suite):** build-dominated, ~5–10 minutes.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Object Storage reader UAT | `QLTY-03` / D-17 | Must prove a first-time reader can walk the page end-to-end, not just pass string checks | Recorded in `15-03-UAT.md` (PASS) |
| Build/lint blocker classification | `QLTY-03` / D-14 | The worktree is dirty with unrelated doc deletions and SVG edits; any surfaced noise must be classified before shipping | Recorded in `## Execution Notes` below |

---

## Executed Command Order

Populated by 15-04 execution (this plan).

| Step | Command | Result | Runtime | Notes |
|------|---------|--------|---------|-------|
| 1 | Object Storage shell assertions (quick suite, 10 checks) | PASS | < 5s | All 10 shell assertions returned expected result |
| 2 | `npm run build` | PASS (with environmental noise) | ~3–5 min | See Execution Notes below |
| 3 | `npm run lint` | PASS | ~30–60s | Ran after build so `.next/types` existed |

---

## Execution Notes

### Worktree execution context

Per 15-CONTEXT note, this phase is executed worktree-locally in
`/Users/longnv/bin/repo/sealos.io/.claude/worktrees/init` because `gsd-tools`
still resolves the outer repository instead of this worktree. The worktree is
already dirty with unrelated doc deletions, SVG edits, and component changes
that predate Phase 15 (roughly 100+ files). Per D-14, these are execution
context, not Phase 15 regressions, and they are not fixed inside this plan.

### Step 1 — Object Storage shell assertions (quick suite)

All 10 checks returned the expected result:

| # | Check | Result |
|---|-------|--------|
| 1 | `test -f content/docs/guides/object-storage/index.en.mdx` | PASS (file exists) |
| 2 | No Chinese residue (`[一-龥]`) | PASS (0 matches) |
| 3 | All six required H2 sections plus `## What's Next` present | PASS (7 matches at lines 15, 28, 66, 93, 123, 140, 162) |
| 4 | `title: "Object Storage"` in frontmatter | PASS (line 2) |
| 5 | No `Phase 15 will extend this section` leftover | PASS (0 matches) |
| 6 | `` `private` `` recommended for bucket permission | PASS (3 matches at lines 45, 53, 134) |
| 7 | No placeholder credentials | PASS (0 matches) |
| 8 | No local `content/docs/guides/object-storage/meta.en.json` | PASS (file does not exist) |
| 9 | `"object-storage"` registered in top-level Guides nav | PASS (line 9 of `content/docs/guides/meta.en.json`) |
| 10 | No invented child-page paths `/docs/guides/object-storage/<segment>/` | PASS (0 matches) |

Shell suite verdict: PASS.

### Step 2 — `npm run build`

Command: `npm run build` → `npm run generate-apps && next build && node scripts/normalize-root-locale.js`.

Outcome: PASS with environmental noise. Exit code 0 (final `normalize-root-locale` step completed and emitted `copied en/ content to root export directory.`).

Key build-pipeline markers:
- `✓ Compiled successfully`
- `✓ Generating static pages (6027/6027)`
- `[normalize-root-locale] copied en/ content to root export directory.`

Zero Object Storage references appeared in the build log. Confirmed via
`grep -iE "object[-_ ]storage|content/docs/guides/object-storage" /tmp/15-04-build.log`
returning zero matches. The Object Storage English page rendered silently as
part of the 6027-page static generation, meaning no MDX parse error, no route
collision, and no type error originated from this page.

#### Warnings and errors surfaced during build

| # | Line | Classification | Root cause (one-line) |
|---|------|----------------|-----------------------|
| 1 | `❌ Error fetching template source for chatnio: fetch failed` | environmental or pre-existing blocker | Network fetch failure in `generate-apps` for an unrelated external template source (not Object Storage). |
| 2 | `❌ Error downloading icon for chatwoot: Command failed: curl -s -L -o .../chatwoot.png "https://avatars.githubusercontent.com/u/23416667?s=48&v=4"` | environmental or pre-existing blocker | External asset fetch failure for an unrelated app icon; pre-existing network noise. |
| 3 | `❌ Error fetching template source for chatwoot: fetch failed` | environmental or pre-existing blocker | Same root cause as #2; unrelated to Object Storage. |
| 4 | `❌ Error downloading icon for code-server: spawnSync /bin/sh ETIMEDOUT` | environmental or pre-existing blocker | curl subprocess timeout on unrelated app icon; pre-existing network noise. |
| 5 | `❌ Error downloading icon for minio: Command failed: curl -s -L -o .../minio.png "https://min.io/resources/favs/apple-icon-180x180.png"` | environmental or pre-existing blocker | External asset fetch failure for minio app icon; pre-existing network noise. |
| 6 | `⚠ Specified "rewrites" will not automatically work with "output: export"` (×2) | environmental or pre-existing blocker | Next.js static-export warning for repo-level config; pre-existing, also recorded in Phase 12's `12-VALIDATION.md`. |
| 7 | `⚠ rewrites, redirects, and headers are not applied when exporting your application, detected (rewrites)` | environmental or pre-existing blocker | Same Next.js export constraint as #6; pre-existing. |
| 8 | `objc[...]: Class GNotificationCenterDelegate is implemented in both .../canvas/.../libgio-2.0.0.dylib and .../sharp-libvips-darwin-arm64/lib/libvips-cpp.42.dylib` (×2) | environmental or pre-existing blocker | Native-module duplicate Objective-C class warning between `canvas` and `sharp-libvips`; pre-existing, also recorded in Phase 12's `12-VALIDATION.md`. |

Zero entries on the above list reference `content/docs/guides/object-storage/`,
`index.en.mdx`, Object Storage routing, Object Storage MDX parsing, or any
component rendered specifically for the Object Storage page.

Classification per D-14: every surfaced warning or error is an
**environmental or pre-existing blocker**. None are Object Storage regressions.

### Step 3 — `npm run lint`

Command: `npm run lint` → `rm -f tsconfig.tsbuildinfo && tsc --noEmit`. Ran
after `npm run build` so `.next/types` existed (mirroring the Phase 12
known-good ordering recorded in `12-VALIDATION.md`).

Outcome: PASS. Exit code 0. Zero diagnostics emitted. The log contains only
the npm banner line; `tsc --noEmit` printed nothing and exited cleanly.

Classification per D-14: no failures to classify.

### Overall validation verdict

**PASS-with-noted-noise.**

- All 10 Object Storage-specific shell assertions PASS.
- `npm run build` completed through `normalize-root-locale` with exit code 0.
- `npm run lint` PASS with zero diagnostics after build generated `.next/types`.
- All build warnings and errors are environmental or pre-existing blockers,
  not Object Storage regressions.
- `QLTY-03` is satisfied for the Object Storage v1.3 milestone closeout.

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 600s (build-dominated, ~5 min)
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** passed
