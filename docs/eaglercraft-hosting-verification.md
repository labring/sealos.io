# Eaglercraft hosting verification

Implementation of [issue #340](https://github.com/labring/sealos.io/issues/340),
validated September 10–11, 2026. Source baseline:
`3861956571eff7171d180248c3c28a7447143de8` (the merged App Store redesign,
including the live Eaglercraft world and component artwork).

## Delivered scope

The English template page now includes the hosting hero, four-step joining
guide, separately explained player and administrator credentials, resource
allocation, qualified Starter pricing, six visible FAQs, and maintained
technical references. Editorial facts live outside generated catalog files.
The existing deployment, authentication, attribution, canonical destination,
artwork, other templates, and Chinese presentation retain their shared paths.

The user authorized deployment through the Docker-to-Sealos skill, using the
existing authenticated workspace, and explicitly bypassed the unavailable GSD
workflow. The user subsequently waived further acceptance in response to the
second-device/network request. That scenario was skipped; fresh Sealos account
eligibility and account-specific billing remain unmeasured. This delivery follows
that revised acceptance scope.

## Website checks

| Check | Result |
| --- | --- |
| TDD at the exported browser boundary | The original page failed the required H1 assertion; the implemented page passes. |
| `pnpm lint` | Passed. |
| Existing app-detail, detail utility, and SEO checks | 17 tests passed. |
| `pnpm build` | Passed; 6,219 pages exported, including the AI FAQ route verification. |
| Both browser scenarios against the production export | Passed: desktop, 390px and 320px layouts, static copy with JavaScript disabled, image loading, mobile image scrolling, headings, anchors, FAQs, price/source URLs, metadata, schema, unrelated templates, Chinese page, and day/night interaction. |
| Authentication and deployment handoff | Passed for signed-out and signed-in states, including template name, version/password configuration, and attribution. External identity and deployment endpoints are intercepted at the website boundary. |
| Catalog regeneration | Isolated generator run with the verified template fixture preserved editorial config byte-for-byte. `pnpm app-store:diff` passed with 224 apps and 224 sources, zero changes. |
| Full test discovery | 284 tests: 279 passed, 3 failed, 2 browser tests skipped without their opt-in environment. Both browser tests passed separately against the export. |
| Review | Standards and spec reviewers completed independent reviews. Fixed the component filename/config naming findings and added missing price/reference link assertions. |

The three full-suite failures concern unchanged baseline files:
`new-components/footer.test.mts` expects an older Products order;
`new-components/header.test.mts` expects the template URL without its current
trailing slash; and `tests/rybbit-cta.test.ts` has an extensionless import rejected
by direct Node 24 execution. The latter's four assertions pass in an isolated
copy with only the import resolved to the existing `.ts` module. Repository
builds and type checks used Node 20; direct TypeScript test execution used Node 24.

Reproduce the browser acceptance after a build and serving `out/`:

```sh
APP_STORE_PREVIEW_URL=http://localhost:3411 \
PLAYWRIGHT_MODULE=/absolute/path/to/installed/playwright \
BROWSER_CHANNEL=chrome \
pnpm exec node --test scripts/eaglercraft-browser.test.mjs scripts/app-store-browser.test.mjs
```

## Actual deployment record

Both instances used the existing `usw-1` workspace, the reviewed template at
`labring-actions/templates@7102fcf6ed3ad666a405cb442cc5ac446ebf8bdc`, and
`ghcr.io/yangchuansheng/eaglerx1.8server:2.2.7` (resolved image digest
`sha256:56ad224a996030b7bfb2837702f065fe88685eda511d7a186812f22dc5cad047`).
The template passed all 58 template quality rules before deployment.
Main-container limits were 200m CPU and 1Gi memory, with a separate 1Gi PVC
per instance. The init-container limits were 100m CPU and 128Mi memory.

| Instance | Selected version | Actual result |
| --- | --- | --- |
| `eaglercraft-kvqdlpej` | 1.8 / Paper 1.8.8 | Admin ready; browser player registered; existing account rejoined after application restart; recognizable world change retained. |
| `eaglercraft-bwkyyrhu` | 1.12 / Paper 1.12.2 | Admin ready; retained-volume marker check passed. The browser asset download was truncated on the test network, preventing a completed browser join for this version. |

The client was Chrome on the execution Mac, controlled through Playwright over
the public HTTPS/WSS route. The actual registered player name was `___`, retained
for the restart test. The intended name `C01Owner` was lost during the automated
profile input; screenshots and the live player list establish the actual identity.
Early join attempts exceeded the login timeout. The successful attempt received
“Successfully registered, you are now logged in.” after `/register` with one
private password argument. A later `/login` with the same name and password
received “Successfully logged in.”

The administrator placed a gold block at `-188 70 -178`, positioned the player
near it, and ran `save-all`. A StatefulSet rollout restart replaced the application
pod while retaining PVC UID `c88aa4e4-b0f4-4c5f-8593-e7298783f5fb`.
After readiness returned, the player logged in and saw the same gold block;
`testforblock -188 70 -178 gold_block` independently confirmed its location.
The 1.12 instance similarly retained its block at `56 100 256` on PVC UID
`39765300-4a91-4d0b-8e8a-9008c375ee2b`.

The 1.12 asset advertised 16,770,268 bytes, while public downloads ended early
with HTTP/2 framing errors or HTTP/1 content-length mismatch. This observation
establishes a failed download on the tested path; its root cause remains open.
No deployment-duration, capacity, or independent-backup restoration claim is made.

Public Starter prices and qualifications were checked on September 10, 2026:
$7/month for eligible first paid-plan purchases and $34/month listed regular
price, with the published resource pool and qualified seven-day new-user trial.
The existing workspace's selected plan, offer eligibility, and displayed charge
were unavailable in this session. Public list prices and account-specific offers
remain separate evidence categories.

## Original session visuals

These unaltered screenshots belong to this deployment session. The public page's
console image is separately labeled as template-maintainer evidence.

- [Successful player registration](evidence/eaglercraft-hosting/owner18-registration-success.png)
- [Visible gold block before restart](evidence/eaglercraft-hosting/owner18-marker-before.png)
- [Existing account login after restart](evidence/eaglercraft-hosting/owner18-login-after-restart.png)
- [Visible gold block after restart](evidence/eaglercraft-hosting/owner18-marker-after.png)
- [Admin readiness, player, and coordinate verification](evidence/eaglercraft-hosting/admin18-marker-after.png)

The original build/test logs, template, deployment manifests, PVC records, and
desktop/mobile page captures are retained in the local session artifact directory
`~/.codex/visualizations/2026/09/10/01a08bf7-0f00-7483-9019-33d5bd022cbb/c01/`.
Credential files remain private outside the repository. Both test applications
and their volumes remain allocated; cleanup requires the separately authorized
destructive-resource action required by the deployment skill.
