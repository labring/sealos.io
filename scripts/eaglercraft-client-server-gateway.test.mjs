import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const articlePath = new URL(
  '../content/blog/(app-deployment)/eaglercraft-client-server-gateway/index.en.mdx',
  import.meta.url,
);
const scriptPath = new URL(
  '../docs/eaglercraft-client-server-gateway-video-script.md',
  import.meta.url,
);
const contextPath = new URL('../CONTEXT.md', import.meta.url);

function readArticle() {
  assert.ok(existsSync(articlePath), 'article file exists');
  const raw = readFileSync(articlePath, 'utf8');
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  assert.ok(match, 'frontmatter present');
  return { frontmatter: match[1], body: match[2] };
}

test('architecture article contains the publication contract', () => {
  const { frontmatter, body } = readArticle();
  const flat = body.replace(/\s+/g, ' ');
  const wordCount = body.trim().split(/\s+/).length;

  assert.ok(
    frontmatter.includes(
      "title: 'Eaglercraft Client, Server, and WebSocket Gateway Explained'",
    ),
  );
  assert.ok(
    frontmatter.includes(
      "seoTitle: 'Eaglercraft Client, Server, and WebSocket Gateway Explained'",
    ),
  );
  assert.ok(frontmatter.includes('date: 2026-09-20'));
  assert.ok(
    frontmatter.includes(
      "tags: ['eaglercraft', 'minecraft', 'hosting', 'Sealos']",
    ),
  );
  assert.equal((frontmatter.match(/^  - question:/gm) || []).length, 5);
  assert.ok(!frontmatter.includes('howTo:'), 'HowTo data stays out of scope');
  assert.ok(!/^#\s+/m.test(body), 'body leaves the H1 to the title');
  assert.ok(wordCount >= 1800 && wordCount <= 2200, `word count: ${wordCount}`);

  for (const heading of [
    '## The Architecture in One View',
    '## What Each Component Does',
    '## HTTPS, WSS, and the Three Addresses',
    '## Choose a Hosting Path',
    '## How the Sealos Template Maps to the Stack',
    '## Use Your Own Domain',
    '## Direct Paper and Proxy-Based Integration',
    '## Common Address Mistakes',
    '## Where to Continue',
  ])
    assert.ok(body.includes(heading), heading);

  for (const text of [
    '```mermaid',
    'Browser Play Link',
    'WebSocket Server Address',
    'Eaglercraft Gateway',
    'Game Server',
    'Client Website',
    'Persistent World',
    'Server Management Panel',
    'Verified Scope',
    'reverse_proxy 127.0.0.1:5200',
    'wss://play.example.com/',
    '/admin',
    '<DeployButton',
    '[How to Host an Eaglercraft Server on an Ubuntu VPS](/blog/eaglercraft-server-ubuntu-vps/)',
    '[Run Eaglercraft with Docker Compose](/blog/eaglercraft-server-docker/)',
    '[Eaglercraft Hosting Costs: Free Options, Paid Plans, and Setup Trade-offs](/blog/eaglercraft-hosting-cost/)',
    '[troubleshooting guide](/docs/guides/app-deploy/troubleshoot/)',
    '[existing-Java-server integration guide](/blog/eaglercraft-existing-java-server/)',
  ])
    assert.ok(flat.includes(text), text);
});

test('video script and shared glossary cover the issue deliverables', () => {
  assert.ok(existsSync(scriptPath), 'video script exists');
  const script = readFileSync(scriptPath, 'utf8');
  const context = readFileSync(contextPath, 'utf8');

  for (const text of [
    'Eaglercraft Client, Server, and WebSocket Gateway Explained',
    'Browser Play Link',
    'WebSocket Server Address',
    'Sealos template',
    'deploy the Eaglercraft template',
  ]) {
    assert.ok(script.includes(text), text);
  }

  for (const term of [
    '**Browser Play Link**',
    '**WebSocket Server Address**',
    '**Client Website**',
    '**Persistent World**',
  ]) {
    assert.ok(context.includes(term), term);
  }
});
