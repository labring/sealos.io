import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const articlePath = new URL(
  '../content/blog/(app-deployment)/eaglercraft-server-docker/index.en.mdx',
  import.meta.url,
);
const tutorialPath = new URL(
  '../content/blog/(app-deployment)/eaglercraft-server/index.en.mdx',
  import.meta.url,
);

test('Docker Compose guide carries the verified deployment path and boundaries', () => {
  assert.ok(existsSync(articlePath), 'article file exists');
  const raw = readFileSync(articlePath, 'utf8');
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  assert.ok(match, 'frontmatter present');
  const [, frontmatter, body] = match;
  // Prose rewraps with every editorial pass; match against collapsed whitespace.
  const flat = body.replace(/\s+/g, ' ');

  assert.ok(
    frontmatter.includes(
      "title: 'Run Eaglercraft with Docker Compose: WSS, Persistent Worlds, and Backups'",
    ),
  );
  // Fumadocs renders the frontmatter title as the page's single H1.
  assert.ok(!/^#\s+/m.test(body), 'body leaves the H1 to the title');

  for (const heading of [
    '## What This Guide Builds',
    '## Before You Start',
    '## Create the Deployment Directory',
    '## Start and Verify the Stack',
    '## Register and Join From a Browser',
    '## Recreate the Container Without Losing the World',
    '## Back Up the Whole Data Directory',
    '## Rehearse the Restore',
    '## Learn the Incomplete-Directory Guard',
    '## Publish with the Caddy Overlay',
    '### Behind Carrier-Grade NAT: Cloudflare Tunnel',
    '## Troubleshoot the First Join',
    '## What This Guide Did Not Test',
    '## Where Sealos Fits',
  ])
    assert.ok(body.includes(heading), heading);

  // The shared ArticleFaq renderer supplies the FAQ heading from frontmatter.
  assert.equal((frontmatter.match(/^  - question:/gm) || []).length, 6);
  assert.ok(
    !/^##\s+FAQ/m.test(body),
    'body leaves the FAQ heading to ArticleFaq',
  );

  // The reader owns the Compose host; the commands have to match the recorded run.
  for (const text of [
    'ghcr.io/yangchuansheng/eaglerx1.8server:2.2.7',
    'stop_grace_period: 45s',
    "- '5200:5200'",
    "- '127.0.0.1:5201:5201'",
    './data:/eaglerX-1.8-server',
    'RCON_PASSWORD=replace-with-a-long-random-password',
    'docker compose config >/dev/null && echo base OK',
    'docker compose up -d',
    '/register <player-password>',
    'Successfully registered, you are now logged in.',
    'Saving...Saved the world',
    'docker compose down',
    'docker compose stop',
    'eaglercraft-full-cold-',
    'eaglercraft-world-cold-',
    'cloudflare/cloudflared:2026.9.1',
    'A Cloudflare Tunnel run from a carrier-grade NAT environment',
    '| Deployment | Read the Compose files',
    '| Management panel | Loopback-only port reached through an SSH tunnel',
    'Please log in using /login <password>',
    'CHECKSUM-MATCH',
    'mounted app dir is non-empty and incomplete',
    'compose.caddy.yaml',
    'header_up X-Real-IP {remote_host}',
    'caddy_data',
    'ssh -N -L 5201:127.0.0.1:5201 user@your-host',
    'save-all',
    '[yangchuansheng/eaglerXserver](https://github.com/yangchuansheng/eaglerXserver)',
    '[Eaglercraft template on Sealos](/products/app-store/eaglercraft-server/)',
    '[setup walkthrough](/blog/eaglercraft-server/)',
    '[Ubuntu VPS guide](/blog/eaglercraft-server-ubuntu-vps/)',
    '[Eaglercraft Hosting Costs](/blog/eaglercraft-hosting-cost/)',
  ])
    assert.ok(flat.includes(text), text);

  // Placeholder hostname in the instructions, no stray test artifacts.
  assert.ok(flat.includes('play.example.com'));
  assert.ok(!flat.includes('192.168.0.228'));
  assert.ok(!flat.includes('ComposeTest2026'));
  assert.ok(!flat.includes('eagler-rcon-2026'));

  // Unverified surfaces stay labelled as such.
  for (const text of [
    'Public DNS resolution for a real hostname',
    'wss://',
    'A second client joining simultaneously',
    'Upgrade from release 2.2.7 to a future image tag',
    'MINECRAFT_VERSION=1.12',
  ])
    assert.ok(flat.includes(text), text);
});

test('setup walkthrough points manual hosting readers at the Compose guide', () => {
  const tutorial = readFileSync(tutorialPath, 'utf8');
  const section = tutorial
    .split('## Continue with Manual Hosting')[1]
    .split('\n## ')[0];
  assert.ok(
    section.includes(
      '[Run Eaglercraft with Docker Compose](/blog/eaglercraft-server-docker/)',
    ),
  );
});
