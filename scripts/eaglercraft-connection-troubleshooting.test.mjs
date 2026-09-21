import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const articlePath = new URL(
  '../content/blog/(app-deployment)/eaglercraft-connection-troubleshooting/index.en.mdx',
  import.meta.url,
);

test('connection troubleshooting article carries the diagnostic contract', () => {
  assert.ok(existsSync(articlePath), 'article file exists');
  const raw = readFileSync(articlePath, 'utf8');
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  assert.ok(match, 'frontmatter present');
  const [, frontmatter, body] = match;
  const flat = body.replace(/\s+/g, ' ');

  assert.ok(
    frontmatter.includes(
      'title: "Eaglercraft Server Troubleshooting: Friends Can\'t Connect (WSS, 502, and 1006)"',
    ),
  );
  assert.ok(!/^#\s+/m.test(body), 'body leaves the H1 to the title');
  assert.ok(!/^##\s+FAQ/m.test(body), 'body leaves FAQ to the shared renderer');

  for (const heading of [
    '## 60-Second Triage',
    '## Symptom → Check → Fix',
    '## The Four Diagnostic Boundaries',
    '### 1. Client Reachability',
    '### 2. WebSocket Handshake',
    '### 3. Backend Session',
    '### 4. Game Login',
    '## Network Scope: Local, LAN, and External',
    '## Environment Branches',
    '## Four Minimum Failure Cases',
    '## Practice Evidence Record',
    '## Clean External-Network Retest',
    '## Choose the Next Path',
  ])
    assert.ok(body.includes(heading), heading);

  for (const text of [
    'Eaglercraft 1.8.8',
    'Eaglercraft 1.12.2',
    'Browser Play Link',
    'WebSocket Server Address',
    '502 Bad Gateway',
    '101 Switching Protocols',
    'close code `1006`',
    'Local-only success',
    'LAN success',
    'External-network success',
    'Sealos template',
    'Ubuntu, Paper, and Caddy',
    'Windows or home network with a Tunnel',
    'LoginSecurity',
    'AuthMe',
    '/register <player-password>',
    '/register <password> <password>',
    'Recovery Proof',
    '[Eaglercraft template on Sealos](/products/app-store/eaglercraft-server/)',
    '[first-join walkthrough](/blog/eaglercraft-server/)',
    '[Ubuntu VPS guide](/blog/eaglercraft-server-ubuntu-vps/)',
    '[Docker Compose guide](/blog/eaglercraft-server-docker/)',
  ])
    assert.ok(flat.includes(text), text);

  assert.equal((frontmatter.match(/^  - question:/gm) || []).length, 6);
});
