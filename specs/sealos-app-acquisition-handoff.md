# Website to Sealos App visitor linkage

This website change accompanies [App #596](https://github.com/labring/sealox/pull/596) and [console OAuth #7421](https://github.com/labring/sealos/pull/7421), implementing the visitor linkage in [#584](https://github.com/labring/sealox/issues/584). Overseas events use the existing Web GTM `GTM-5DTRN2V3` and GA4 `G-YF5VHZSTE0`; domestic events use the existing Rybbit destination. No new analytics database, MP relay, sGTM deployment or Brain change is required.

The two channels stay separate: `sealos.run` uses the China Cookie and domestic Rybbit; `sealos.io` uses the Global Cookie and Web GTM/GA4. The App routes by Main's selected product edition, never by download origin or Cookie contents. A different Cookie realm remains unmatched and cannot reroute events to the other destination.

Website runtime code configures only the GTM container for Google analytics. The unused direct GA loader and its disabled measurement-ID configuration are removed. GA4 destination IDs remain in the GTM import configuration, where tags need them; neither website visitor linkage nor console OAuth requires one.

## Journey and ownership

1. The website reads explicit or saved permission from the existing analytics consent signals. It adds no standalone visitor-linkage notice or checkbox on any page. Removing that UI does not grant permission: only a granted signal creates a random UUID and retains the first consented source; unknown or denied permission creates no identified website event.
2. The observer writes `sealos_acquisition_v1` synchronously before ordinary installer navigation. On HTTPS `sealos.io` and `www.sealos.io`, the Cookie uses `Domain=sealos.io; Path=/; Secure; SameSite=Lax; Max-Age=2592000`. Root and www can reuse an existing shared visitor after consent. Unknown permission must not delete another origin's journey; explicit denial clears the shared Cookie and this feature's local visitor/source state.
3. The visitor downloads the ordinary installer, opens the App and signs in through the system browser's console OAuth page. The console reads the shared Cookie, validates it and associates its visitor with the server-verified account. The App retains its own installation/client ID. Cookie data never selects or authenticates the account.
4. The website's `acquisition_visit` and `download_click` events carry the same visitor ID. The console's Data Layer event `web_visitor_linked` maps to GA4 `visitor_linked`; the App also emits GA4 `visitor_linked`, both with the verified User-ID. Events enter the existing GA4 destination. The additive website GTM patch is part of this PR; the App/console patch is delivered separately.

The Cookie is unpadded UTF-8 Base64URL JSON, at most 1800 decoded bytes:

```json
{
  "version": 1,
  "realm": "global",
  "visitor_id": "<random UUID>",
  "consent": {
    "analytics_storage": "granted",
    "ad_storage": "unspecified",
    "ad_user_data": "unspecified",
    "ad_personalization": "unspecified"
  },
  "source": { "source": "google", "medium": "cpc", "campaign": "launch" }
}
```

Source contains only the consumed `source`, `medium` and `campaign` labels, bounded to 100 characters each. A referrer host can infer the source, but landing/referrer URLs and timestamps are not persisted in this feature's Cookie or local source snapshot. Old snapshots are reduced to these three labels. Analytics permission never grants advertising permission. Same-origin cross-tab decisions synchronize through the existing consent storage key; consumed historical grants cannot undo withdrawal.

## Retained and removed components

| Component                                                                                         | Decision and evidence                                                                                                                                                   |
| ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Consent signal handling, visitor UUID, first source, observer, ordinary download anchors          | Retained: removing consent or identity breaks the privacy/linkage contract; installer navigation must remain independent.                                               |
| Standalone visitor-linkage notice and checkbox                                                    | Removed: the existing consent signal handling and Cookie/event pipeline do not require this UI. Removing it does not imply consent.                                     |
| Shared-domain Cookie                                                                              | Required: the console cannot read the website's origin-local storage. Local browser testing observes the Cookie on the console's real HTTP request.                     |
| `/app-attribution`, capability POST/continuation, acquisition issue API and acquisition deep link | Removed: backend #7421 consumes the Cookie during normal OAuth; its linkage functions work without those old endpoints.                                                 |
| New Cookie's GA/Rybbit aliases and copied `sea_attr`                                              | Removed: the same visitor/account/installation linkage succeeds without them. GA client ID may help diagnose historical SDK behavior but is not a required linkage key. |
| Separate activation/latest source state                                                           | Removed: the selected contract consumes one first-source snapshot.                                                                                                      |
| Existing Web `lib/attribution-url.ts` `sea_attr` URL decoration                                   | Retained unchanged: it serves the pre-existing Web attribution journey. The new Cookie does not duplicate or redefine it.                                               |

## Events, configuration and acceptance

Landing/referrer URLs and capture timestamps were also removed from the new source snapshot: the App, Web linkage and new GA4 tags consume only the three campaign labels. The original GTM attribution storage remains unchanged.

Only currently consented observations emit `acquisition_visit` or `download_click` with `visitor_id`, `surface=website`, `product_edition=global`, `analytics_consent=granted` and nullable `acquisition_source`, `acquisition_medium`, `acquisition_campaign`. Scalar fields explicitly clear absent values. The new events exclude raw URLs, credentials, `sea_attr` and account IDs. A download click is not an installation.

The website observer and its two GTM tags never set `user_id` or `client_id`: the visitor UUID remains an event/Cookie join key, and existing browser identity is preserved during visits, downloads and withdrawal. The console sets User-ID only after authenticating the account; the App uses the same UID, a separate stable installation-derived client ID, and null User-ID before login. GA4 reporting must use Observed or Blended identity, in the same property, for User-ID deduplication; Device-based identity ignores User-ID. Browser client-ID continuity between website and console and real report results must be checked after deployment. This does not retroactively rewrite all historical anonymous visits or guarantee one user after Cookie loss or a browser/device change.

The observer synchronizes the current analytics choice through the existing GTM `sealos_consent_update` rule before a visit, including on a returning page with a saved grant. Permission snapshots are deduplicated across effect replay; unspecified advertising stays denied. The new tags also require the current shared Cookie to remain granted and match the event's visitor, so GTM processing an old queued event after withdrawal cannot revive that journey. This guard checks bounded canonical Base64URL and valid UTF-8/JSON without rewriting the Cookie.

The consent subscription also observes actual Data Layer `consent/update` commands (including gtag's arguments object) and `sealos_consent_update` entries. It preserves the existing push function's receiver, arguments and return value, then batches observer notifications in a microtask to avoid re-entering GTM. Ordinary page events and consent defaults do not start linkage. Cleanup cancels pending notifications and preserves any later GTM push handler. A CMP no longer needs to dispatch a separate browser DOM event after updating the Data Layer. This is only a delivery bridge: it does not generate a grant, change the existing GTM default of denied, or apply the domestic Rybbit enablement policy overseas. If production has no real analytics grant producer, new overseas visitors remain unmatched until that existing consent source is configured.

Generate and test the additive website tags using `scripts/gtm-acquisition/generate.cjs` and its tests. Follow that directory's README to merge-import into the existing **Web** container. Data Layer pushes alone do not complete GA collection: official importer/Preview verification and publication are required operational steps. No production GTM setting is changed by this PR.

Run `node --test scripts/test-acquisition-handoff.mjs`, `node --test scripts/gtm-acquisition/generate.test.cjs`, the unchanged `node scripts/verify-attribution-url.mjs`, `pnpm lint` and `pnpm build`. Local tests and isolated browser/real-backend interoperability demonstrate the Cookie and module contract; they do not prove production OAuth, GA report ingestion, GA reporting identity or advertising conversion.

Use the same system-browser profile for the website and App OAuth. Different browser profiles, private browsing, Cookie/storage blocking, expired/cleared Cookies, unknown/denied permission or a China/Global mismatch remain unmatched and must not block downloading or signing in. Granting later starts observed linkage; it does not recover unobserved history. `visitor_id` events and User-ID provide explicit linkage data, not a promise that GA will retroactively merge every anonymous event or restore default advertising attribution. Validate consented visits, download, OAuth, account/mode changes and deployment events in both realms with the companion PRs before release acceptance; payment events require their own verified producers.
