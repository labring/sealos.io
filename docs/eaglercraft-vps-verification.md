# Eaglercraft Ubuntu VPS tutorial verification

Implementation of [C07 / issue #346](https://github.com/labring/sealos.io/issues/346).
Baseline: `bda0668f885c37763a78dbbb70d36bb75c14cee6`.
Canonical destination: <https://sealos.io/blog/eaglercraft-server-ubuntu-vps/>.
Fact-checked September 16, 2026 (Asia/Shanghai).

## Content and publishing

The new English article publishes at
`content/blog/(app-deployment)/eaglercraft-server-ubuntu-vps/index.en.mdx`. It
targets the reader who already owns an Ubuntu VPS and a domain, and it presents
one recommended path: Caddy terminates HTTPS on 443 and proxies to the gateway on
loopback. The article uses `play.example.com` as the host placeholder; every
screenshot keeps the real address bar of the test machine so a reader can see the
actual captured state.

The article embeds the Caddyfile and the gateway systemd unit as full text, and
links the remaining units, the environment template, and the backup script in the
upstream `deploy/ubuntu-vps/` directory.
[ADR 0005](adr/0005-keep-scenario-hosting-tutorials-in-blog.md) records the URL
decision that placed this scenario tutorial in the blog.

[C02](https://sealos.io/blog/eaglercraft-server/) now closes its manual-hosting
section with one sentence that links to this article, and this article links back
to C02, [C05](https://sealos.io/blog/eaglercraft-hosting-cost/), and the Sealos
template. Both edits ship in one pull request.

## Rechecked facts

- The upstream repository still publishes release `v2.2.7` (September 9, 2026)
  with no release assets, so the install path is the source archive at
  `https://github.com/yangchuansheng/eaglerXserver/archive/refs/tags/v2.2.7.tar.gz`.
  The archive contains the gateway, the 1.8 and 1.12 game servers, both browser
  clients, and the Server Management Panel in one tree.
- The upstream README documents the Docker path and its port contract: `5200`
  serves the browser client page together with the WebSocket game traffic, and
  `5201` serves the Server Management Panel. The README publishes no systemd or
  bare-metal path, which is the gap this article fills.
- `bungee/listeners.yml` in the shipped bundle binds `127.0.0.1:5200` and sets
  `forward_ip: true` with `forward_ip_header: X-Real-IP`. The gateway resolves
  the header on every request, and a request without it is dropped.
- `script/http_server.py` binds the panel to `0.0.0.0` on line 1955 with no
  environment override, so host firewall rules are the only control that keeps
  `5201` off the network.
- `script/http_server.py` reads `PUBLIC_GAME_URL` for the connection details on
  the Overview page. An empty value reports `source: inferred` and produces a
  loopback WebSocket address, so a bare-metal deployment has to set it.
- Ubuntu 24.04.4 LTS packages supply everything the runtime needs:
  `openjdk-21-jre-headless` 21.0.12, `caddy` 2.6.2, `tmux` 3.4, and `unzip` 6.0.

## Test environment

The recorded run used one Ubuntu 24.04.4 LTS machine with kernel
`7.0.0-31-generic`, 2 vCPU, 3,911 MiB memory, and a 51 GiB root disk. The machine
answered on `192.168.0.228` inside a private network, and it held no public DNS
record, no public certificate, and no inbound reachability from the internet.

## Install and service layout

The bundle unpacked to `/opt/eaglercraft`, owned by a dedicated `eaglercraft`
account created with `--system`, home `/opt/eaglercraft`, and `/usr/sbin/nologin`.
The install kept the two version trees side by side and pointed `web` and
`server` at the 1.8 build:

```text
/opt/eaglercraft/web    -> web-1.8
/opt/eaglercraft/server -> server-1.8
```

Four systemd units under `/etc/systemd/system/` run the deployment. All four
report `enabled`, and `eaglercraft-backup.timer` reports `active (waiting)` with
its next trigger at the following midnight.

| Unit | Process | Recorded footprint |
| --- | --- | --- |
| `eaglercraft-gateway.service` | `bungee/run.sh` and its Java process | 233.3 MiB memory, 8.9 s CPU after five minutes |
| `eaglercraft-paper.service` | `bin/paper-tmux.sh` supervising the Paper pane | `KillMode=mixed`, `TimeoutStopSec=60` |
| `eaglercraft-panel.service` | `python3 script/http_server.py` | 15.7 MiB memory |
| `eaglercraft-backup.service` and `.timer` | `bin/backup.sh` once a day | 252 ms CPU for one snapshot |

`ss -tlnp` confirms the intended exposure: the gateway listens on
`127.0.0.1:5200`, Paper on `127.0.0.1:25565`, RCON on `127.0.0.1:25575`, and the
panel on `0.0.0.0:5201`. The panel is the one process that cannot bind to
loopback through configuration.

## TLS termination and reverse proxy

The Caddyfile routes port 80 to the gateway and supplies the header the gateway
requires:

```text
:80 {
	encode zstd gzip
	reverse_proxy 127.0.0.1:5200 {
		header_up X-Real-IP {remote_host}
	}
}
```

`caddy validate` reports `Valid configuration`, and the reload left the service
active. HTTP through Caddy returned `200` with `2158` bytes and the title
`EaglercraftX 1.8`, both from `127.0.0.1` on the host and from the Mac over the
LAN address. A request to the gateway without the `X-Real-IP` header returned
`000` in the same test, which is how the missing-header failure was isolated.

The recorded test used a plain HTTP site block so the capture would not depend on
a public name. The article keeps the HTTPS form of the same block, with
`play.example.com` as the site address, and marks the certificate authority
issuance path as unverified.

## Firewall

`ufw` runs active with `deny (incoming)` as the default and three allowed ports:

```text
22/tcp   ALLOW IN   Anywhere
80/tcp   ALLOW IN   Anywhere
443/tcp  ALLOW IN   Anywhere
```

From the Mac, `tcp/80` reported `OPEN` and `tcp/5200`, `tcp/5201`,
`tcp/25565`, and `tcp/25575` reported `BLOCKED`. The panel kept listening on
`0.0.0.0:5201` throughout, and the firewall rules carried the access control.

## Reboot recovery

The machine rebooted with `ssh root@192.168.0.228 reboot`. SSH answered again
after roughly 30 seconds. All four units reported `active`, the four ports came
back with new process IDs, and `curl http://127.0.0.1/` returned `200`. The world
markers placed before the reboot were still present in the world afterwards.

## World persistence and the restore drill

The drill placed an emerald block at `-11 72 222` next to three gold blocks at
`-15 70 222`, `-11 71 222`, and `-13 71 224`, then saved through RCON and started
`eaglercraft-backup.service`. The service finished with `Result=success` and left
`world-20260916T020630Z.tar.gz` at `4,794,045` bytes.

The restore path then removed the emerald, stopped `eaglercraft-paper`, deleted
`world`, `world_nether`, and `world_the_end`, unpacked the newest snapshot into
`/opt/eaglercraft/server`, and started Paper again. `testforblock` confirmed the
emerald at `-11 72 222` and all three gold blocks, so a snapshot taken from a
running server restores into a playable world.

The marker checks failed once before they passed. The first RCON call read a
truncated reply while the server was under load and raised `struct.error`. The
retry against the same server and the same commands returned all four block
confirmations and a clean `save-all`.

## save-all flush on Java 21

The first version of `bin/backup.sh` sent `save-all flush` through the console
pane. On Java 21 with Paper 1.8.8 the command wedged the chunk I/O thread: the
console printed `All chunks are saved` without stopping, RCON stopped answering,
and the active log grew to `4,374,236,066` bytes in about five minutes. That log
holds `49,147,793` occurrences of the message.

The script now sends plain `save-all`, which reports `Saving...Saved the world`
and returns within a second. The reworked script carries a comment that names the
wedged variant and the reason it is avoided.

## Server Management Panel access

The panel is reachable through an SSH tunnel with
`ssh -N -L 5201:127.0.0.1:5201 root@192.168.0.228`. `http://127.0.0.1:5201/admin`
then returned `200` with `42,459` bytes and the title `EaglercraftX Admin
Console`. After the RCON password was entered, the console reported `Connected`,
`Paper is ready`, TPS `20.0` across the one, five, and fifteen minute windows, and
`0` online players.

The Overview connection card is the reason the article asks the reader to set
`PUBLIC_GAME_URL`. With the variable absent, the card reported `Inferred from
current host` and produced `ws://127.0.0.1:5200/`. After adding
`PUBLIC_GAME_URL=http://192.168.0.228/` to `/etc/eaglercraft/eaglercraft.env` and
restarting `eaglercraft-panel`, the card reported `Configured` and produced
`ws://192.168.0.228/`. The API reflected the same change:
`{"success": true, "source": "inferred", "game_url": ""}` became
`{"success": true, "source": "configured", "game_url": "http://192.168.0.228/"}`.

## Browser join

The browser client loaded through the Caddy entry point. The server list showed
the entry with its message of the day and a `0/60` player count, and the player
joined as `C07Verifier`. `/register C07Pass2026` returned the successful
registration message, and the player then moved through the world and reached the
marker area for the screenshots.

## Unverified scope

The recorded checks cover loopback and private-network access plus the reboot,
backup, restore, panel, and browser-join paths on one machine. These remain
unverified and the article labels them as such:

- Public DNS resolution for a real hostname.
- Certificate issuance and renewal through Let's Encrypt.
- A `wss://` connection over TLS from a browser.
- Inbound reachability from the public internet, including any provider firewall
  or security group in front of the machine.
- A second machine joining the server, and player capacity beyond one session.
- Upgrade and rollback of the runtime from one release to the next.

## Recorded implementation validation

Recorded after the article and the C02 edit landed on the branch, under Node
`v20.20.0` and pnpm `10.28.2`. The raw output lives in
`docs/evidence/eaglercraft-vps/implementation-validation.txt`.

- `pnpm lint` completed the TypeScript check with no diagnostics.
- `pnpm build` ran `verify:ai-faq-index`, the Next.js static export, the root
  locale normalization, and `verify:ai-faq-routes`, which reported
  `Result: PASS` with every duplicate and missing count at zero.
- `out/blog/eaglercraft-server-ubuntu-vps/index.html` carries the title `Host
  an Eaglercraft Server on an Ubuntu VPS | Sealos Blog`, the canonical
  `https://sealos.io/blog/eaglercraft-server-ubuntu-vps/`, and references to the
  five article images under `/_next/static/media/`.
- `node --test scripts/eaglercraft-vps-guide.test.mjs` passed 2 of 2 tests. The
  suite covers the section list, the recorded commands, the unverified-scope
  boundary, and the C02 convergence.
- `node --test scripts/eaglercraft-hosting-cost.test.mjs` kept passing 2 of 2.
- `git diff --check` reported no whitespace errors.

`scripts/eaglercraft-article-browser.test.mjs` now asserts the C02 links to
`/blog/eaglercraft-hosting-cost/`, `/blog/eaglercraft-server-ubuntu-vps/`,
`/docs/guides/app-deploy/persistent-volume/`, and
`/docs/guides/app-deploy/public-url-does-not-open/`. `scripts/url-index-audit.sh`
adds the new article URL and its trailing-slash form to the audited key URLs.

## Reproduction

Build with the repository's Node 20 runtime, then serve the export:

```sh
pnpm lint
pnpm build
python3 -m http.server 3421 --bind 127.0.0.1 --directory out
```

The evidence files in `docs/evidence/eaglercraft-vps/` hold the raw command
output for each recorded section, and the article images are encoded copies of
the captures named in their alt text.
