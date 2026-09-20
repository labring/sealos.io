# D04: Eaglercraft Client, Server, and WebSocket Gateway Explained

**Target length:** 60–90 seconds (approximately 180 spoken words).

**[0:00–0:17] Visual: highlight each box in the article's architecture diagram.**

Follow four parts: the Browser Client connects through the Eaglercraft Gateway to the Game Server. The Game Server saves progress in the Persistent World. The Client Website supplies the browser game; the Server Management Panel gives the owner controls.

**[0:17–0:34] Visual: show the article's address table, labelled Sealos.**

Open the Browser Play Link in your browser. Paste the WSS WebSocket Server Address into a compatible client's Multiplayer field. On Sealos, use HTTPS slash admin for the Server Management Panel. Self-hosted guides use a separate protected panel connection.

**[0:34–0:48] Visual: Sealos template card, Paper readiness, Join game.**

The Sealos template packages the client, Gateway, selected Paper Game Server, and persistent storage. Wait for Paper readiness, select Join game, and share the Browser Play Link. Each player registers an in-game password.

**[0:48–1:03] Visual: highlight the four hosting-path rows.**

Choose Sealos for managed application hosting, Ubuntu VPS for direct host control, Docker Compose for reproducible containers, or a Shared World for a temporary session. Keep storage and recovery in your hosting plan.

**[1:03–1:20] Visual: own-domain diagram labelled configuration example, then CTA.**

An owned domain routes HTTPS and WSS through Caddy to the Gateway. Follow the full guide for headers, panel protection, and verification. Read the architecture guide, then [deploy the Eaglercraft template](https://sealos.io/products/app-store/eaglercraft-server/) on Sealos.

## Publication checks

Validated on September 20, 2026 using:

```sh
pnpm exec fumadocs-mdx
pnpm lint
node --test scripts/*.test.mjs
node --test scripts/railway-cost.test.js config/apps-data-quality.test.mts
node --test 'app/**/*.test.mts'
pnpm build
EAGLERCRAFT_STATIC_CHECK=1 pnpm test:eaglercraft-client-server-gateway
```

The three Node suite commands passed 262 tests and skipped four optional
preview/export checks. The explicit static article check then passed all three
article tests, including the previously skipped export check. The production
build exported 6,251 pages and passed the 2,000-record AI FAQ route check.

Browser acceptance on the local static export confirmed a visible Mermaid SVG
with its accessible title and description, five tables with header cells, and
an FAQ answer opened with Enter. Repeat these browser checks after diagram or
shared renderer changes. Owned-domain DNS, TLS, and WSS deployment checks remain
outside this article's Verified Scope.

After the final integration-link label and glossary wording edits, MDX generation,
TypeScript lint, and source checks passed again. A fresh full export stopped with
`ENOSPC` before page generation; the disk had approximately 120 MiB free. The
successful export and browser checks above precede those wording-only edits.
Repeat the export check after reclaiming build space (the completed build used
approximately 6 GiB).
