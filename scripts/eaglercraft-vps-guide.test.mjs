import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const articlePath = new URL(
  '../content/blog/(app-deployment)/eaglercraft-server-ubuntu-vps/index.en.mdx',
  import.meta.url,
);
const tutorialPath = new URL(
  '../content/blog/(app-deployment)/eaglercraft-server/index.en.mdx',
  import.meta.url,
);

test('Ubuntu VPS guide carries the verified install path and boundaries', () => {
  assert.ok(existsSync(articlePath), 'article file exists');
  const raw = readFileSync(articlePath, 'utf8');
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  assert.ok(match, 'frontmatter present');
  const [, frontmatter, body] = match;
  // Prose rewraps with every editorial pass; match against collapsed whitespace.
  const flat = body.replace(/\s+/g, ' ');

  assert.ok(
    frontmatter.includes(
      "title: 'How to Host an Eaglercraft Server on an Ubuntu VPS'",
    ),
  );
  // Fumadocs renders the frontmatter title as the page's single H1.
  assert.ok(!/^#\s+/m.test(body), 'body leaves the H1 to the title');

  for (const heading of [
    '## What This Guide Builds',
    '## Before You Start',
    '## Install the Runtime',
    '## Configure the Environment File',
    '## Run the Services Under systemd',
    '## Point a Domain at the Server with Caddy',
    '## Open the Firewall',
    '## Join From a Browser',
    '## Reach the Server Management Panel Through an SSH Tunnel',
    '## Back Up the World and Rehearse a Restore',
    '## Reboot and Confirm Recovery',
    '## Upgrade to a New Release',
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

  // The reader owns the VPS; the commands have to match the recorded run.
  for (const text of [
    'openjdk-21-jre-headless tmux unzip caddy',
    '--shell /usr/sbin/nologin eaglercraft',
    'refs/tags/v2.2.7.tar.gz',
    'ln -sfn server-1.8 server',
    "echo 'eula=true'",
    'PUBLIC_GAME_URL=https://play.example.com/',
    'header_up X-Real-IP {remote_host}',
    'sudo ufw allow 443/tcp',
    'ssh -N -L 5201:127.0.0.1:5201 root@your-server',
    'save-all',
    'eaglercraft-backup.timer',
    '[yangchuansheng/eaglerXserver](https://github.com/yangchuansheng/eaglerXserver)',
    '[Eaglercraft template on Sealos](/products/app-store/eaglercraft-server/)',
    '[setup walkthrough](/blog/eaglercraft-server/)',
    '[Eaglercraft Hosting Costs](/blog/eaglercraft-hosting-cost/)',
  ])
    assert.ok(flat.includes(text), text);

  // Placeholder hostname in the instructions, real address bars in the captions.
  assert.ok(!flat.includes('play.eaglercraft.example'));
  assert.ok(flat.includes('play.example.com'));

  // Unverified surfaces stay labelled as such.
  for (const text of [
    'Public DNS resolution for a real hostname.',
    'Certificate issuance and renewal through Let',
    'A `wss://` game connection over TLS from a browser.',
    'did not exercise a release-to-release upgrade',
  ])
    assert.ok(flat.includes(text), text);

  // The captured trap belongs in the backup section as the reason for save-all.
  assert.ok(flat.includes('4,374,236,066'));
  assert.ok(flat.includes('save-all flush'));
});

test('setup walkthrough points manual hosting readers at the VPS guide', () => {
  const tutorial = readFileSync(tutorialPath, 'utf8');
  const section = tutorial
    .split('## Continue with Manual Hosting')[1]
    .split('\n## ')[0];
  const [guidance] = section.split('\n\n').filter((block) => block.trim());
  assert.ok(
    guidance.includes(
      '[How to Host an Eaglercraft Server on an Ubuntu VPS](/blog/eaglercraft-server-ubuntu-vps/)',
    ),
  );
  assert.ok(
    !section.includes('github.com'),
    'the upstream links moved to the VPS guide',
  );
});
