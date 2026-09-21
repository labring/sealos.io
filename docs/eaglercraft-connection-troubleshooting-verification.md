# C010 Eaglercraft Connection Troubleshooting Verification

Last verified: 2026-09-22

This record separates observed Practice Evidence from article guidance. It
covers the local runtime and the current Sealos instance used while preparing
the connection troubleshooting article.

## Version and environment matrix

| Environment | Client/server scope | Result | Evidence |
| --- | --- | --- | --- |
| Sealos application | Eaglercraft 1.8 / Paper 1.8.8 | Ready and public connection info configured | `GET https://eaglercraft-viwwojry.usw-1.sealos.app/api/status` and `/api/connection-info` returned HTTP 200 |
| Local runtime repository `v2.2.7` | EaglercraftX 1.8 / Paper 1.8.8 | Running locally | `server-1.8/logs/latest.log` reports Paper 1.8.8 and LoginSecurity 3.2.0; ports 5200, 5201, 25565, and 25575 were listening |
| Local runtime repository `v2.2.7` | EaglercraftX 1.12 / Paper 1.12.2 | Assets and server bundle present; live join pending because this shell has no Java Runtime | `AGENTS.md`, `README.md`, `web-1.12/`, and `server-1.12/` document the 1.12 selection and port contract |

The 1.12.2 row remains an explicit scope boundary. The current Sealos
instance and local live process used for the primary check were 1.8. A local
attempt with `MINECRAFT_VERSION=1.12` stopped before Bungee became ready after
the shell reported `Unable to locate a Java Runtime`. The runtime repository
supports selecting `MINECRAFT_VERSION=1.12`, while a separate 1.12 instance
with Java 21 is required for a live compatibility result.

## Observed primary path

The Sealos application returned the following status payload:

```json
{
  "success": true,
  "rcon_host": "127.0.0.1",
  "rcon_port": 25575,
  "bridge_port": 5201,
  "minecraft_version": "1.8",
  "native_seed_finder_ready": true,
  "paper": { "state": "ready", "elapsed_seconds": null }
}
```

The connection-info endpoint returned:

```json
{
  "success": true,
  "source": "configured",
  "game_url": "https://eaglercraft-viwwojry.usw-1.sealos.app"
}
```

Opening the generated Browser Play Link reached the Eaglercraft client and
the LoginSecurity prompt:

```text
Please register using /register <password>
```

The browser reached the game login boundary with player `C010Verifier`. The
password entry and world entry require an operator to supply a player
credential, so this record does not claim a completed authenticated join or
Recovery Proof for the live Sealos world.

## Failure reproductions

### 502 Bad Gateway

The controlled local proxy test pointed an Nginx upstream at a stopped local
service and returned `502 Bad Gateway`:

```text
HTTP/1.1 502 Bad Gateway
Server: nginx/1.31.4
```

The matching repair is to restore the listener or correct the proxy upstream,
then repeat the HTTP page check and the WSS check. This reproduction
demonstrates the proxy boundary; it does not identify a production root cause
for any particular deployment.

### 101 followed by a close

The local WebSocket fixture completed the HTTP upgrade with:

```text
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: <computed value>
```

The fixture then closed the TCP connection before sending a WebSocket close
frame. This reproduces the transport-to-session boundary and requires the
gateway and game-server logs to identify the first component that closed a
real session.

### Close code 1006

The browser fixture at
`http://127.0.0.1:5204/c010-ws-close-1790008928.html` displayed:

```text
close code=1006 wasClean=false
```

The page served successfully, the browser opened the WebSocket, and the
server closed the TCP connection without a close frame. The result verifies
the article's description of `1006` as a browser-reported abnormal close.

### Page load succeeds and login fails

The live Sealos check reached the LoginSecurity registration prompt after the
page and connection-info checks passed. The execution-day command contract is
`/register <player-password>` followed by `/login <player-password>`;
the player password is separate from the administrator and RCON credentials.
An authenticated world entry and recovery check remain operator-owned because
they require a real player password.

## Network scope

| Scope | Observed result | Interpretation |
| --- | --- | --- |
| Local-only | Local runtime listeners and the local 1006 fixture were reachable | Confirms local process and test route behavior |
| LAN | Not executed in this environment | Requires a second device on the same private network |
| External-network | Sealos public HTTP API and Browser Play Link were reachable from the test browser | Confirms the observed public Sealos route; a second player on an independent ISP is still required for the full acceptance gate |

The Sealos API checks prove readiness and configured public routing. They do not
prove a second-network player join or Persistent World Recovery Proof.

## Evidence commands

Use these commands to repeat the non-credential checks:

```bash
curl -sS https://eaglercraft-viwwojry.usw-1.sealos.app/api/status
curl -sS https://eaglercraft-viwwojry.usw-1.sealos.app/api/connection-info
curl -i http://127.0.0.1:5204/c010-ws-close-1790008928.html
```

For a live 1.12.2 smoke test, start a separate runtime instance with
`MINECRAFT_VERSION=1.12` and an isolated data directory and ports, then record
page load, WebSocket handshake, backend readiness, LoginSecurity login,
external-network join, and Recovery Proof in this matrix.
