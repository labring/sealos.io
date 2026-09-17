# Eaglercraft Docker Compose tutorial verification

Implementation of [C08 / issue #350](https://github.com/labring/sealos.io/issues/350).
Baseline: `9dc8e473139fd67e2d8c6bc2bf72b61b76a4523b`.
Canonical destination: <https://sealos.io/blog/eaglercraft-server-docker/>.
Fact-checked September 17, 2026 (Asia/Shanghai).

## Content and publishing

The new English article publishes at
`content/blog/(app-deployment)/eaglercraft-server-docker/index.en.mdx`. It
targets the reader who runs Docker Compose v2 on a host they administer, and it
presents one recommended path: the published image runs the whole stack from
one container, a bind mount at `./data` carries the world and account state,
the management panel maps to the host loopback, and a Caddy overlay adds the
public HTTPS entry point. The article uses `play.example.com` as the host
placeholder.

The article embeds the base `compose.yaml`, the Caddy overlay, and the
Caddyfile site block as full text, and links the upstream
[`deploy/docker-compose/`](https://github.com/yangchuansheng/eaglerXserver/tree/main/deploy/docker-compose)
directory for the runnable set.
[ADR 0005](adr/0005-keep-scenario-hosting-tutorials-in-blog.md) covers the URL
decision that placed this scenario tutorial in the blog; the upstream placement
of the Compose assets is recorded in the upstream repository's
`deploy/docker-compose/ADR-0010-compose-deployment-directory.md`.

[C02](https://sealos.io/blog/eaglercraft-server/) extends its manual-hosting
section with one sentence that links to this article, and this article links
back to C02, the
[Ubuntu VPS guide](https://sealos.io/blog/eaglercraft-server-ubuntu-vps/),
[C05](https://sealos.io/blog/eaglercraft-hosting-cost/), and the Sealos
template. Both edits ship in one pull request.

## Test environment

The recorded run used one Ubuntu 24.04.4 LTS machine with kernel
`7.0.0-31-generic`, 2 vCPU, 3,911 MiB memory, at `192.168.0.228` inside a
private network. Docker Engine `29.1.3` and Docker Compose `v2.40.3` came from
the distribution repositories. The machine held no public DNS record, no
public certificate, and no inbound reachability from the internet. The browser
client ran on the operator's machine through an SSH tunnel
(`ssh -N -L 15200:127.0.0.1:5200 root@192.168.0.228`) because direct LAN
transfers of the multi-megabyte client assets truncated on the operator's VPN
route; the tunnel carried them complete.

## Deployment directory and image

Deployment ran from `/opt/eaglercraft-compose` with the upstream
`compose.yaml`, `.env.example` copied to `.env`
(`RCON_PASSWORD` set to a test value, `MINECRAFT_VERSION=1.8`,
`EAGLECRAFT_DATA_DIR=./data`), and the Caddy overlay plus `Caddyfile.example`
present for the config checks. The stack pulled
`ghcr.io/yangchuansheng/eaglerx1.8server:2.2.7` with digest
`sha256:56ad224a996030b7bfb2837702f065fe88685eda511d7a186812f22dc5cad047`.

`docker compose config` exited 0 for the base file and for the base plus
overlay combination, with the merged output showing the `5200` ingress on all
interfaces, `127.0.0.1:5201` on the loopback, the `./data` bind mount, and the
overlay's 80/443 TCP plus 443 UDP publications with the two named Caddy
volumes. Raw output: `docs/evidence/eaglercraft-compose/compose-config.txt` and
`compose-files.txt`.

## First start and exposure

The first `docker compose up -d` on an empty data directory initialized the
server tree from the image and reached `healthy` in under a minute. The
startup log confirmed the data contract: `web/ -> web-1.8`,
`server/ -> server-1.8`, the plugin repository for Minecraft 1.8, and
`RCON enabled via RCON_PASSWORD env var`. The initialized directory measured
about 380 MB, and the whole stack used about 589 MiB of memory after startup.

`ss` confirmed the intended exposure: `5200` on `0.0.0.0` and
`[::]`, and `5201` on `127.0.0.1` only. The client page and the panel page
both returned `200` through the loopback.

## Browser join and registration

The browser client loaded through the SSH tunnel entry point. The server list
showed the preconfigured entry with the `An EaglercraftX server` message of the
day and a `0/60` player count. The player joined as `ComposeTester`.

The first registration attempt opened chat, entered `/register`, and submitted
after the 30 second window, so the server logged in with
`ComposeTester lost connection: Login timed out!`. The server log carried no
register command for that attempt, which separated the chat submission failure
from a server fault. A second attempt submitted within the window and the chat
confirmed `Successfully registered, you are now logged in.` The LoginSecurity
configuration sets `login-timeout: 30`, which is the source of the window.

## Container recreation

After a `save-all` returned `Saving...Saved the world` at 15:44:15,
`docker compose down` removed the container and the `eaglercraft_default`
network, and `docker compose up -d` started a fresh container against the same
`./data` bind mount at 15:44:40. The container reported `healthy` about 45
seconds later. The data directory kept its 382 MB, and the LoginSecurity
database retained the `ComposeTester` bcrypt hash (verified through a strings
extraction of `LoginSecurity.db`).

The browser rejoined and the chat prompt changed to
`Please log in using /login <password>`. `/login` with the original password
returned `Successfully logged in.` Container status and image digests:
`docs/evidence/eaglercraft-compose/container-status.txt` and `image.txt`.

## Backup and restore drill

The backup step saved the world through the panel API
(`{"success": true, "response": "Saving...Saved the world"}` at 15:49:00),
recorded sha256 checksums for the 35 files under `world`, `world_nether`,
`world_the_end`, and the LoginSecurity database, then archived the whole
`data` directory to a 275 MB tarball while the container kept running.

The restore step stopped the stack, moved the live directory aside, unpacked
the archive into a fresh `data` directory, and compared checksums: all 35
files matched (`CHECKSUM-MATCH`). The stack returned to `healthy`, the client
page and the panel answered `200`, and RCON `list` answered
`There are 0/20 players online:` on the restored data. The moved directory was
then removed.

A secondary world-only archive (`data/server-1.8/world` as a 3.2 MB tarball
with a recorded sha256) exists for moving a world between two complete
installs.

## Incomplete-directory guard

Two partial-restore attempts confirmed the entrypoint guard:

1. A data directory holding one stray file: the container exited with
   `[start] ERROR: mounted app dir is non-empty and incomplete:
   /eaglerX-1.8-server` and the advice line `use an empty directory or restore
   a complete application directory`, then restarted in a loop.
2. A directory holding only `server-1.8/world` plus the LoginSecurity plugin:
   the same message and exit.

In both cases Compose kept restarting the container while the message repeated
in the logs. After each attempt the good directory was restored and the stack
returned to `healthy`. The recorded messages live in
`docs/evidence/eaglercraft-compose/recreation-backup-protection-log.txt`.

## Caddy overlay configuration

The overlay was exercised through `docker compose config` (merged contract
recorded above) rather than a live TLS run: the test network has no public DNS
name, so certificate issuance and `wss://` traffic stayed out of scope. The
Caddyfile site block mirrors the systemd guide's block with
`header_up X-Real-IP {remote_host}`, which the gateway requires.

## Unverified scope

The recorded checks cover loopback and private-network access plus the
recreation, backup, restore, guard, and browser-join paths on one machine.
These remain unverified and the article labels them as such:

- Public DNS resolution for a real hostname.
- Certificate issuance and renewal through Let's Encrypt.
- A `wss://` connection over TLS from a browser.
- A Cloudflare Tunnel run from a carrier-grade NAT environment.
- A join from an independent network outside the LAN.
- Inbound reachability from the public internet, including any provider
  firewall or security group in front of the machine.
- A second client joining simultaneously, and capacity beyond one session.
- Upgrade from 2.2.7 to a future image tag, and the `MINECRAFT_VERSION=1.12`
  variant.
- ARM hosts; the image publishes `linux/amd64`.

## Recorded implementation validation

Recorded after the article and the C02 edit landed on the branch, under Node
`v20.20.0` and pnpm `10.28.2`. The raw output lives in
`docs/evidence/eaglercraft-compose/implementation-validation.txt`.

- `pnpm lint` completed the TypeScript check with no diagnostics.
- `pnpm build` ran `verify:ai-faq-index`, the Next.js static export, the root
  locale normalization, and `verify:ai-faq-routes`, which reported
  `Result: PASS`.
- `out/blog/eaglercraft-server-docker/index.html` carries the article title,
  the canonical `https://sealos.io/blog/eaglercraft-server-docker/`, and the
  frontmatter FAQ entries.
- `node --test scripts/eaglercraft-compose-guide.test.mjs` passed its tests,
  covering the section list, the recorded commands, and the unverified-scope
  boundary.

### Cold-copy backup drill (spec Decision 12)

After the article first described a hot archive, the backup procedure was
re-executed per the spec: save-all, stop the stack, take both cold copies,
and restart. Recorded on 2026-09-17:

- 16:26:28 save-all response `{"success": true, "response":
  "Saving...Saved the world", "auth_kind": "token"}` from the panel API.
- `docker compose stop` completed at 16:26:42.
- Cold copy 1: full `data` tree to
  `/root/eaglercraft-full-cold-202609171626.tar.gz`, 275 MB, sha256
  `5fe13f425ec6eeccf07519ea201be217af583dd8fc93b6daac75ee235abec095`.
- Cold copy 2: world directory to
  `/root/eaglercraft-world-cold-202609171626.tar.gz`, 2.3 MB, sha256
  `b3cf79c536d97253b617824dd583fb14370ce8189d737974b36784177ec3dd08`.
- `docker compose start` restored `healthy` status 42 seconds later;
  client page and panel answered on loopback.

Two earlier same-day cold-copy attempts are superseded by this run: both
produced complete tarballs while the stack was stopped, and their save-all
calls failed on shell-escaping artifacts in the test harness (the article
and the panel itself were unaffected). The 16:26 run is the canonical
Decision 12 evidence.
