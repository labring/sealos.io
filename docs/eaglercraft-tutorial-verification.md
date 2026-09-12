# Eaglercraft hosting tutorial verification

Implementation of [C02 / issue #342](https://github.com/labring/sealos.io/issues/342).
Baseline: `dca6f5edabc9d5a10c5981f2cbd3691195c1fcc9`.
Canonical destination: <https://sealos.io/blog/eaglercraft-server/>.
Fact-checked September 12, 2026 (Asia/Shanghai).
The user explicitly authorized bypassing the unavailable GSD workflow for this task.

## Content and publishing

The existing English MDX article now follows hosting choice, prerequisites,
deployment, player registration, returning login, invitation, retained-storage
restart, architecture, troubleshooting, manual-hosting references, and six FAQs.
It retains the November 20, 2025 publication date and existing blog identity.
Fumadocs derives `lastModified` from the article's Git history. The old unsupported
frontmatter override was removed; the final committed export must carry the real
article Git author timestamp in both Open Graph and Article JSON-LD.

The existing article shell, FAQ renderer, schemas, product page, deployment handoff, and other locales retain their existing
structure. The shared blog metadata function now serializes the Git modification
time as ISO 8601; the exported browser test exposed the previous numeric
Open Graph timestamp and checks an existing blog article as a regression.
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

## New simultaneous Friend Join evidence

The live test used two isolated Playwright BrowserContexts in Chrome on the
execution Mac, sharing its network. Each context had its own browser storage and
personal Player Account. Both opened the public HTTPS client and connected through
its public WSS endpoint. This satisfies the accepted session boundary; the
second-device and independent-network waiver remains in effect.

- Instance: `eaglercraft-kvqdlpej`, namespace `ns-let51wad`.
- Browser Play Link:
  `https://eaglercraft-viwwojry.usw-1.sealos.app/?server=wss%3A%2F%2Feaglercraft-viwwojry.usw-1.sealos.app%2F`.
- Player A: `RiverBuilder`, newly registered with a private password. After the
  first automation session ended, a fresh isolated context returned with the
  same name and `/login`; the game displayed successful login.
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

An early attempt exceeded the registration window while the automation inspected
screens. Rejoining and submitting the command completed registration. One browser
automation call later timed out and reset its controller; the subsequent test used
fresh isolated contexts and verified the actual server player list. These were
harness interruptions; successful gameplay is evidenced separately above.

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
result. The added meeting platform has its own save confirmation; it is not part
of the earlier restart evidence.

The 1.12 record proves admin readiness and a retained-volume marker. Its browser
asset download was truncated, so full 1.12 browser joining remains unverified.
Capacity, startup duration, uptime, independent-network access, new-account
eligibility, account-specific billing, and independent backup restoration remain
unmeasured. C12 owns the full Recovery Copy export/restore procedure and Restored
World acceptance. Dedicated environment tutorials and the C04 video remain their
separate content tasks; the article links to available destinations.

## Validation

- TDD: the original production export failed the required new article H1; the
  first rewritten export passed it. The expanded scenario also detected the
  missing simultaneous-session evidence in the earlier export.
- Node 20 `pnpm lint`: passed after MDX generation and after the article/test edits.
- Node 20 production export after implementation commit `0d7bc4e`: passed with
  6,219 pages, locale normalization, and AI FAQ route verification. The clean
  final build includes the committed article and ISO metadata correction.
- Full Node 24 test discovery: 36 test files, 252 tests; 246 passed, three failed,
  three browser scenarios skipped without their opt-in preview environment.
  The failures are the same baseline footer product-order expectation, header
  trailing-slash expectation, and extensionless import in `tests/rybbit-cta.test.ts`
  recorded in C01. All three failures were reproduced against unchanged baseline
  sources in the C01 worktree. Their source files are unchanged by C02.
- Desktop/mobile visual checks: passed at 1440, 390, and 320 pixels with five
  loaded screenshots and no document overflow. Registration commands and
  address tables remain readable. All table-of-contents anchors, local destination
  links, and six keyboard-operated FAQ answers passed browser assertions.
- Independent Standards and Spec reviews: zero actionable findings on both axes,
  including the shared metadata date correction and existing-article regression.
- Final focused exported-browser acceptance: one scenario passed, zero failures
  or skips. It covers desktop and 390/320px layouts, JavaScript-disabled core
  instructions, image loading, heading order, anchors, credentials, addresses,
  qualified prices, internal links, both template actions, six keyboard-operated
  FAQs, canonical/title/description, and matching Article/FAQPage JSON-LD.
- The existing `/blog/what-is-sealos/` regression passed the shared ISO date check.
  Fumadocs uses Git `%ai` (author time): the article exports
  `2026-09-11T17:43:33.000Z` in both Open Graph and Article JSON-LD, matching
  implementation commit `0d7bc4e` exactly. Publication remains November 20, 2025.
- All six unique external article links returned HTTP 200. The four reused image
  files match their original evidence byte-for-byte; all five article images are
  below 210,000 bytes.
- `git diff --check`: passed.

Reproduce article acceptance after building and serving `out/`:

```sh
APP_STORE_PREVIEW_URL=http://127.0.0.1:3421 \
PLAYWRIGHT_MODULE=/absolute/path/to/installed/playwright \
BROWSER_CHANNEL=chrome \
node --test scripts/eaglercraft-article-browser.test.mjs
```

Local execution logs, source checks, and original screenshots:
`~/.codex/visualizations/2026/09/11/01a0915d-0aa5-75b1-8b16-38cb465d7cc9/c02/`.
Private credentials remain outside the repository. Website publishing is a
separate action; this delivery prepares the local implementation and commit.

## Template button follow-up (September 12, 2026)

- Replaced both article template links with the existing `DeployButton`, retaining
  `https://sealos.io/products/app-store/eaglercraft-server/`. Each action opens a
  new tab and includes visible destination guidance plus a descriptive image alt.
- Corrected the first deployment step to configure the version and administrator
  password before signing in when prompted on submission. This matches the
  form-first path in `new-components/DeployModal/DeployModalContext.tsx`.
- The expanded browser acceptance failed against the previous export with zero
  matching buttons instead of two, then passed against the updated export.
  Both actions were activated with Enter; the external destination response was
  intercepted to verify navigation without starting a deployment. All seven
  images loaded at 1440, 390, and 320 pixels with no document overflow.
- Node 20 typechecking and the 6,219-page production export passed. The export
  logged two upstream Markdown fetch timeouts while completing successfully.
  Full Node 24 discovery remained at 252 tests: 246 passed, the same three
  baseline failures, and three opt-in browser skips. Focused browser acceptance
  passed separately with zero skips. Both independent review axes had zero
  actionable findings; `git diff --check` passed.
- Local evidence in the directory above: `cta-build.log`, `cta-suite.log`,
  `cta-browser-test.log`, and six `cta-{top,bottom}-{1440,390,320}.png` screenshots.
