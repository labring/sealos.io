# Website acquisition tags for the existing Web GTM container

This additive patch makes the website's `acquisition_visit` and `download_click` events reach the existing GA4 destination. It targets **Web** container `sealos.io` / `GTM-5DTRN2V3`, GA4 `G-YF5VHZSTE0`. It neither configures a Server container nor creates another Google tag/SDK.

## Generate and verify

```sh
node scripts/gtm-acquisition/generate.cjs
node --test scripts/gtm-acquisition/generate.test.cjs
node --test scripts/test-acquisition-handoff.mjs
node scripts/verify-attribution-url.mjs
```

The generated `container.patch.json` contains exactly **2 GA4 Event tags, 2 exact-event triggers, 8 variables and 1 folder**. Every name starts with `Sealos Website Acquisition | ` and IDs are in the `810000` range. The separate App/console integration uses `Sealos Desktop App | ` and `800000` IDs; the two patches can be reviewed and merged independently into the same Web container. Do not replace the existing container or its old tags.

Tag and parameter-table shapes follow the existing container's exported GA4 Event tags. Local tests execute the ES5 scope variable, check mappings and references, and verify deterministic generation. **Official GTM import and Preview have not been run for this patch. JSON parsing or local tests are not production acceptance. No live container has been modified or published.**

## Wire and privacy boundary

The website observer synchronously writes the consented Cookie before pushing either event:

```js
dataLayer.push({
  event: 'download_click', // or acquisition_visit
  visitor_id: '<UUID>',
  surface: 'website',
  product_edition: 'global',
  analytics_consent: 'granted',
  acquisition_source: 'google',
  acquisition_medium: 'cpc',
  acquisition_campaign: null,
});
```

All six data fields except the permission guard are mapped as event parameters. Missing source labels are explicit `null`, so earlier Data Layer values cannot survive into a later event. There are no account IDs, tokens, raw URLs or `sea_attr` in these events. `client_id` and `user_id` stay under the existing Web Google tag's control; this patch never overwrites either.

Each tag requires its exact event name, actual HTTPS `sealos.io` or `www.sealos.io` with the standard port, `surface=website`, `product_edition=global`, `analytics_consent=granted` and a UUID visitor. Its scope also reads the current shared Cookie: canonical Base64URL, at most 2400 encoded/1800 decoded bytes, valid UTF-8/JSON, version 1, global realm, granted analytics and the **same** visitor ID. It only reads the Cookie. This prevents old queued events from passing after withdrawal clears the Cookie, or after a newly consented journey has another visitor ID. A blocked Cookie leaves these new events unmatched without blocking downloads.

The existing container provides Consent Mode Default (denied), Consent Mode Update on `sealos_consent_update`, and the Web Google tag. The observer projects the current explicit or saved analytics choice through that existing update event **before** the visit. It sends only granted/denied tracker values and deduplicates its permission snapshot across effect replay. Unspecified advertising permissions remain denied; saved analytics permission does not restore old advertising grants. It does not add a second consent manager, SDK or event queue. Verify these existing container prerequisites during import/Preview, because exported configuration can change independently of this repository.

The website subscribes to real Data Layer consent updates as well as existing DOM/storage notifications. A CMP can use its normal `gtag('consent', 'update', ...)` or `sealos_consent_update` push without a separate DOM dispatch. This does not create consent: the existing default remains denied, and production must still supply a real analytics grant. The domestic website's Rybbit configuration policy is not used here.

`visitor_id` is an event parameter, never a Google User-ID or client ID. These website tags must not map it to identity settings. The console and App use only authenticated userUid as User-ID. Validate the same GA4 destination, browser client-ID continuity, and Observed/Blended reporting identity; a Device-based report will count devices independently even when User-ID is supplied.

## Import and release acceptance

1. Open existing **Web** container `GTM-5DTRN2V3`, create a dedicated workspace and export its current configuration for backup.
2. Admin → Import Container → select `container.patch.json` → select that workspace → **Merge**. Inspect the import diff: only the namespaced entities above may be added. Stop on a name/ID conflict and reconcile it; do not overwrite or delete existing tags.
3. Check both GA4 Event tags target `G-YF5VHZSTE0` and use the corresponding exact Custom Event trigger. Check all eight variables and their references import successfully.
4. Preview a consented root/www visit and ordinary installer click. Confirm one event per observation, the same `visitor_id` as the Cookie, explicit empty source fields, and the intended GA4 destination. With stored analytics permission, the observer's consent update must precede the visit. Unknown/denied visits must not trigger these tags.
5. Delay GTM, consent and then withdraw before it processes queued events: the Cookie gate must reject those events. A new visitor, invalid Cookie, www without a choice, console hostname, App/China surface and blocked storage/Cookie must also fail closed. Verify existing website tags still behave as before.
6. Review together with [App #596](https://github.com/labring/sealox/pull/596) and [console #7421](https://github.com/labring/sealos/pull/7421). In the same system-browser profile, verify website → direct download → App OAuth → console `visitor_linked` → App events using one visitor and verified User-ID, while the App retains its separate client ID. Only publish after the normal configuration review; inspect actual GA reports afterward.

Use isolated sessions with all collector requests intercepted for synthetic tests. Real reporting acceptance is separate from those blocked-request tests. Register/query custom event parameters using the existing GA workflow if needed. `acquisition_*` fields are explicit custom context, not an automatic restoration of default advertising attribution; passing `visitor_id` likewise does not retroactively rewrite all anonymous GA history.
