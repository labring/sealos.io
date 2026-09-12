# Eaglercraft hosting tutorial verification

Implementation of [C02 / issue #342](https://github.com/labring/sealos.io/issues/342).
Baseline: `dca6f5edabc9d5a10c5981f2cbd3691195c1fcc9`.
Canonical destination: <https://sealos.io/blog/eaglercraft-server/>.
Fact-checked September 12, 2026 (Asia/Shanghai).

## Content and publishing

The existing English MDX article now follows hosting choice, prerequisites,
deployment, player registration, returning login, invitation, retained-storage
restart, architecture, troubleshooting, manual-hosting references, and six FAQs.
It retains the November 20, 2025 publication date and existing blog identity.
Fumadocs derives `lastModified` from the article's Git history. The old unsupported
frontmatter override was removed; the final committed export must carry the real
article Git author timestamp in both Open Graph and Article JSON-LD.

The shared blog metadata function serializes the Git modification time as ISO
8601. The optional `seoTitle` sets the HTML title; H1, Open Graph, Twitter, and
Article headline retain the article title. The SEO unit test covers trim and blank
fallback, and the browser test also checks an existing article's metadata.
FAQ questions and the complete tutorial render statically. The shared FAQ answers
use the existing hydrated disclosures; the browser check opens all six with the
keyboard and compares their visible answers with FAQPage JSON-LD.

Five article screenshots show readiness, first registration, returning login,
simultaneous Friend Join, and the retained world. A text diagram explains the
browser client, gateway, Paper, and persistent storage. The reader-facing page
contains the actual evidence scope; research identifiers and execution records
remain in this operations document.

## Rechecked facts

- The current template README and latest upstream release still identify 2.2.7.
  The actual `eaglercraft-kvqdlpej` pod runs
  `ghcr.io/yangchuansheng/eaglerx1.8server:2.2.7` at image digest
  `sha256:56ad224a996030b7bfb2837702f065fe88685eda511d7a186812f22dc5cad047`.
- The live 1.8 LoginSecurity configuration confirms 3–16-character usernames,
  6–32-character passwords, exact username matching, a 30-second login window,
  and `confirm-password: false`. The article shows one password argument for
  `/register` and the separate `/login` command.
- The live console shows `MC 1.8`, `Paper is ready`, and `Join game`. Its supplied
  link includes a `server` query string and can join directly after profile setup.
  The multiplayer menu also lists the deployment automatically.
- Public pricing still lists Starter at $7/month for eligible first paid-plan
  purchases and $34/month regular price, plus a qualified seven-day new-user
  trial. The article directs readers to current pricing and Cost Center.
  Account-specific eligibility and charges remain unmeasured.
- Source references: [template README](https://github.com/labring-actions/templates/blob/kb-0.9/template/eaglercraft-server/README.md),
  [release](https://github.com/yangchuansheng/eaglerXserver/releases/tag/v2.2.7),
  [LoginSecurity configuration](https://github.com/yangchuansheng/eaglerXserver/blob/v2.2.7/server-1.8/plugins/LoginSecurity/config.yml),
  and [pricing](https://sealos.io/pricing/).

Both template actions use the existing `DeployButton` and open the app-store
template in a new tab. The first deployment step configures the version and
administrator password before sign-in on submission, matching the form-first
path in `new-components/DeployModal/DeployModalContext.tsx`.

## Simultaneous Friend Join evidence

The live test used two isolated Playwright BrowserContexts in Chrome on the
execution Mac, sharing its network. Each context had its own browser storage and
personal Player Account. Both opened the public HTTPS client and connected through
its public WSS endpoint. Verification covers isolated sessions on one device and
network; second-device and independent-network access remain unverified.

- Instance: `eaglercraft-kvqdlpej`, namespace `ns-let51wad`.
- Browser Play Link:
  `https://eaglercraft-viwwojry.usw-1.sealos.app/?server=wss%3A%2F%2Feaglercraft-viwwojry.usw-1.sealos.app%2F`.
- Player A: `RiverBuilder`, newly registered with a private password. A fresh
  isolated context returned with the same name and `/login`; the game displayed
  successful login.
- Player B: `StoneExplorer`, separately registered with a different private
  password. The game displayed successful registration.
- At September 12, 2026, 01:29 Asia/Shanghai, both players were online together.
  The game player list and admin `list` result independently showed both names.
  StoneExplorer sent “At the gold block together.”, visible to RiverBuilder.
- Both met beside the original gold block at `-188 70 -178`. The administrator
  added a stone platform at y=69 and teleported the players there for the capture.
  `testforblock` confirmed the original gold block. These preparation actions
  took place in the existing test world. `save-all` subsequently confirmed the save.
- Both gameplay sessions were closed after capture. The application and its
  original storage remain allocated.

Artifacts:

- [Machine-readable practice record](evidence/eaglercraft-tutorial/practice.json).
- [Admin online list and block verification](evidence/eaglercraft-tutorial/two-players-admin.txt).
- [Admin screenshot](evidence/eaglercraft-tutorial/two-players-admin.webp).
- The article's `images/friend-join.webp` is an encoded copy of the original
  screenshot: both online names, StoneExplorer's character, and the gold block.

## Reused persistence and visual provenance

The four original images come from the [C01 verification record](eaglercraft-hosting-verification.md),
September 10–11, 2026. They preserve the actual player name `___`:

| Article image | Original evidence |
| --- | --- |
| `admin-ready.png` | `docs/evidence/eaglercraft-hosting/admin18-marker-after.png` |
| `first-join.webp` | `docs/evidence/eaglercraft-hosting/owner18-registration-success.webp` |
| `returning-login.webp` | `docs/evidence/eaglercraft-hosting/owner18-login-after-restart.webp` |
| `saved-world.webp` | `docs/evidence/eaglercraft-hosting/owner18-marker-after.webp` |

C01 saved the gold block, restarted the application pod, retained PVC UID
`c88aa4e4-b0f4-4c5f-8593-e7298783f5fb`, and logged in as the same player to inspect
that block. The original record includes the server-side block check and before/
after PVC evidence. This delivery reuses that same-version application-restart
result. The added meeting platform has a separate save confirmation.

The 1.12 record proves admin readiness and a retained-volume marker. Its browser
asset download was truncated, so full 1.12 browser joining remains unverified.
Capacity, startup duration, uptime, independent-network access, new-account
eligibility, account-specific billing, and independent backup restoration remain
unmeasured. C12 owns the full Recovery Copy export/restore procedure and Restored
World acceptance. Dedicated environment tutorials and the C04 video remain their
separate content tasks; the article links to available destinations.

## Recorded implementation validation (September 12, 2026)

- Node 20 typechecking and the 6,219-page production export passed, including
  locale normalization and AI FAQ route verification. The template-button export
  logged two upstream Markdown fetch timeouts while completing successfully.
- Full Node 24 test discovery: 36 test files, 252 tests; 246 passed, three failed,
  three browser scenarios skipped without their opt-in preview environment.
  The failures are the same baseline footer product-order expectation, header
  trailing-slash expectation, and extensionless import in `tests/rybbit-cta.test.ts`
  recorded in C01. All three failures were reproduced against unchanged baseline
  sources in the C01 worktree. Their source files are unchanged by C02.
- Focused exported-browser acceptance passed with zero skips at 1440, 390, and
  320 pixels: all seven images loaded, document width fit the viewport, core
  instructions rendered with JavaScript disabled, and anchors and internal links
  resolved. Both template actions opened the expected URL via Enter with the
  external response intercepted. All six FAQ answers opened via keyboard and
  matched FAQPage JSON-LD; title, description, canonical, and Article metadata
  checks passed, including the `/blog/what-is-sealos/` regression.
- Fumadocs uses Git `%ai` (author time) for modification dates in both Open Graph
  and Article JSON-LD. The `0d7bc4e` export recorded
  `2026-09-11T17:43:33.000Z`; later article commits update this value. Publication
  remains November 20, 2025.
- All six unique external article links returned HTTP 200. The four reused image
  files match their original evidence byte-for-byte; all five article images are
  below 210,000 bytes.
- `git diff --check`: passed.

## Review cleanup validation (September 13, 2026)

On Node 20.20.0, the SEO unit test and focused Chrome acceptance both passed
against the existing `37eee6be` production export before and after test cleanup.
The cleanup also passed 39 assertion boundary checks using the actual test blocks,
covering alt text, step numbering, FAQ counts, and all 27 retained body requirements.
Syntax and diff checks passed. This follow-up changes tests and this record;
the production build, live gameplay, and persistence results above remain the
recorded implementation checks.

## Reproduction

Build with the repository's Node 20 runtime, then serve the export:

```sh
pnpm lint
pnpm build
python3 -m http.server 3421 --bind 127.0.0.1 --directory out
```

In a separate terminal, run the SEO and article checks using installed Playwright
and Chrome:

```sh
pnpm exec node --test scripts/blog-seo-title.test.mjs
APP_STORE_PREVIEW_URL=http://127.0.0.1:3421 \
PLAYWRIGHT_MODULE=/absolute/path/to/installed/playwright \
BROWSER_CHANNEL=chrome \
pnpm exec node --test scripts/eaglercraft-article-browser.test.mjs
```
