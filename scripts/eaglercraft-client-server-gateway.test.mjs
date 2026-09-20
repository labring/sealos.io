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
const diagramImagePath = new URL(
  '../content/blog/(app-deployment)/eaglercraft-client-server-gateway/images/eaglercraft-client-server-gateway-architecture.webp',
  import.meta.url,
);

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

  assert.ok(existsSync(diagramImagePath), 'architecture diagram image exists');

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
    './images/eaglercraft-client-server-gateway-architecture.webp',
    'Browser Play Link',
    'WebSocket Server Address',
    'Eaglercraft Gateway',
    'Game Server',
    'Client Website',
    'Persistent World',
    'Server Management Panel',
    'Verified Scope',
    'reverse_proxy 127.0.0.1:5200',
    'header_up X-Real-IP {remote_host}',
    'wss://play.example.com/',
    '/admin',
    '<DeployButton',
    '[How to Host an Eaglercraft Server on an Ubuntu VPS](/blog/eaglercraft-server-ubuntu-vps/)',
    '[Run Eaglercraft with Docker Compose](/blog/eaglercraft-server-docker/)',
    '[Eaglercraft Hosting Costs: Free Options, Paid Plans, and Setup Trade-offs](/blog/eaglercraft-hosting-cost/)',
    '[troubleshooting guide](/docs/guides/app-deploy/troubleshoot/)',
    '[upstream EaglerXServer integration guide](https://github.com/lax1dude/eaglerxserver/)',
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
    '**Browser Client**',
    '**Browser Play Link**',
    '**WebSocket Server Address**',
    '**Client Website**',
    '**Persistent World**',
  ]) {
    assert.ok(context.includes(term), term);
  }
});

// Run after pnpm build: EAGLERCRAFT_STATIC_CHECK=1 pnpm test:eaglercraft-client-server-gateway
// The normal unit suite can run before a static export exists.
test(
  'exported blog route preserves metadata, FAQ, diagram, and working links',
  {
    skip: process.env.EAGLERCRAFT_STATIC_CHECK !== '1',
  },
  () => {
    const output = new URL('../out/', import.meta.url);
    const route = 'blog/eaglercraft-client-server-gateway/';
    const html = readFileSync(new URL(`${route}index.html`, output), 'utf8');
    const { frontmatter, body } = readArticle();
    const title = 'Eaglercraft Client, Server, and WebSocket Gateway Explained';
    assert.ok(html.includes(`<title>${title}`));
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.match(
      html,
      /<h1\b[^>]*>Eaglercraft Client, Server, and WebSocket Gateway Explained<\/h1>/,
    );
    assert.ok(
      html.includes(`rel="canonical" href="https://sealos.io/${route}"`),
    );
    const description = frontmatter.match(/^description: '(.+)'$/m)[1];
    assert.ok(html.includes(`name="description" content="${description}"`));
    for (const [, heading] of body.matchAll(/^## (.+)$/gm)) {
      assert.ok(
        html.includes(`>${heading}</a>`),
        `rendered heading: ${heading}`,
      );
    }
    const structuredData = [
      ...html.matchAll(
        /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
      ),
    ].flatMap(([, json]) => JSON.parse(json));
    const faq = structuredData.find((item) => item['@type'] === 'FAQPage');
    assert.ok(faq, 'FAQ structured data is present');
    assert.equal(faq.mainEntity.length, 5);
    for (const item of faq.mainEntity) {
      assert.ok(html.includes(item.name), `visible FAQ: ${item.name}`);
      assert.ok(item.acceptedAnswer.text.length > 20);
    }
    assert.ok(!structuredData.some((item) => item['@type'] === 'HowTo'));
    assert.ok(
      html.includes('eaglercraft-client-server-gateway-architecture'),
      'rendered architecture image is present',
    );
    assert.ok(
      html.includes('Eaglercraft architecture showing the Browser Client'),
      'rendered architecture image has descriptive alt text',
    );
    assert.ok(html.includes('The diagram&#x27;s text alternative is:'));
    assert.equal((html.match(/<table\b/g) || []).length, 5);
    assert.equal((html.match(/<thead\b/g) || []).length, 5);
    assert.ok((html.match(/<th\b/g) || []).length >= 14);
    assert.ok(
      html.includes(
        'href="https://sealos.io/products/app-store/eaglercraft-server/"',
      ),
    );

    for (const [, href] of body.matchAll(/\]\((\/[^)]+)\)/g)) {
      assert.ok(html.includes(`href="${href}"`), `rendered link: ${href}`);
      const url = new URL(href, 'https://sealos.io');
      const target = readFileSync(
        new URL(`${url.pathname.slice(1)}index.html`, output),
        'utf8',
      );
      if (url.hash) {
        assert.ok(
          target.includes(`id="${url.hash.slice(1)}"`),
          `link anchor: ${href}`,
        );
      }
    }
  },
);
