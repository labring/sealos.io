'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { spawnSync } = require('node:child_process');
const { generate } = require('./generate.cjs');
const PREFIX = 'Sealos Website Acquisition | ';
const uid = '11111111-1111-4111-8111-111111111111';
const state = {
  visitor_id: uid,
  surface: 'website',
  product_edition: 'global',
  analytics_consent: 'granted',
};
const location = { protocol: 'https:', hostname: 'sealos.io', port: '' };
function scope(actualLocation, values, cookie) {
  const variable = generate().containerVersion.variable.find(
    (item) => item.name === PREFIX + 'Scope',
  );
  const source = variable.parameter[0].value.replace(
    /\{\{Sealos Website Acquisition \| DLV - (.*?)\}\}/g,
    (_, key) => 'values[' + JSON.stringify(key) + ']',
  );
  const current = {
    version: 1,
    realm: 'global',
    visitor_id: uid,
    consent: { analytics_storage: 'granted' },
  };
  return vm.runInNewContext('(' + source + ')()', {
    location: actualLocation,
    values,
    atob,
    btoa,
    document: {
      cookie:
        cookie ??
        'sealos_acquisition_v1=' +
          Buffer.from(JSON.stringify(current)).toString('base64url'),
    },
  });
}
test('generator produces deterministic new-only entities for the existing Web container', () => {
  const patch = generate();
  assert.deepEqual(patch, generate());
  assert.equal(patch.exportFormatVersion, 2);
  assert.equal(patch.containerVersion.container.publicId, 'GTM-5DTRN2V3');
  for (const key of ['folder', 'tag', 'trigger', 'variable']) {
    const list = patch.containerVersion[key];
    assert.ok(list.length > 0);
    assert.ok(list.every((item) => item.name.startsWith(PREFIX)));
    const ids = list.map((item) => item[key + 'Id']);
    assert.ok(ids.every((id) => /^810\d{3}$/.test(id)));
    assert.equal(new Set(ids).size, ids.length);
  }
});
test('exactly two GA4 tags map the complete emitted wire without configuring identity or loading another SDK', () => {
  const patch = generate().containerVersion;
  assert.equal(patch.tag.length, 2);
  assert.equal(patch.trigger.length, 2);
  const eventNames = [];
  for (const tag of patch.tag) {
    assert.equal(tag.type, 'gaawe');
    assert.equal(
      tag.parameter.find((item) => item.key === 'measurementIdOverride').value,
      'G-YF5VHZSTE0',
    );
    eventNames.push(
      tag.parameter.find((item) => item.key === 'eventName').value,
    );
    const mapping = tag.parameter.find(
      (item) => item.key === 'eventSettingsTable',
    ).list;
    const names = mapping.map((item) => item.map[0].value);
    assert.deepEqual(
      names.sort(),
      [
        'visitor_id',
        'surface',
        'product_edition',
        'acquisition_source',
        'acquisition_medium',
        'acquisition_campaign',
      ].sort(),
    );
    for (const row of mapping)
      assert.equal(
        row.map[1].value,
        '{{' + PREFIX + 'DLV - ' + row.map[0].value + '}}',
      );
  }
  assert.deepEqual(eventNames.sort(), ['acquisition_visit', 'download_click']);
  assert.equal(
    patch.tag.some((tag) => ['googtag', 'html'].includes(tag.type)),
    false,
  );
});
test('all references resolve and each trigger requires its exact event and scope guard', () => {
  const patch = generate().containerVersion;
  assert.ok(patch.trigger.length > 0);
  const variables = new Set(patch.variable.map((item) => item.name));
  const triggers = new Set(patch.trigger.map((item) => item.triggerId));
  for (const reference of JSON.stringify(patch).matchAll(/\{\{(.*?)\}\}/g)) {
    assert.ok(
      reference[1] === '_event' || variables.has(reference[1]),
      reference[1],
    );
  }
  for (const tag of patch.tag) {
    const event = tag.parameter.find((item) => item.key === 'eventName').value;
    assert.ok(tag.firingTriggerId.every((id) => triggers.has(id)));
    const trigger = patch.trigger.find(
      (item) => item.triggerId === tag.firingTriggerId[0],
    );
    assert.equal(trigger.type, 'CUSTOM_EVENT');
    assert.equal(trigger.customEventFilter[0].type, 'equals');
    assert.deepEqual(
      trigger.customEventFilter[0].parameter.map((item) => item.value),
      ['{{_event}}', event],
    );
    assert.deepEqual(
      trigger.filter[0].parameter.map((item) => item.value),
      ['{{' + PREFIX + 'Scope}}', 'true'],
    );
  }
});
test('real ES5 scope allows only consented valid website visitors on HTTPS root or www', () => {
  assert.equal(scope(location, state), true);
  assert.equal(scope({ ...location, hostname: 'www.sealos.io' }, state), true);
  for (const host of [
    'usw-1.sealos.io',
    'sealos.run',
    'tenant.sealos.io',
    'sealos.io.evil.test',
    'evilsealos.io',
    '127.0.0.1',
  ]) {
    assert.equal(scope({ ...location, hostname: host }, state), false);
  }
  assert.equal(scope({ ...location, protocol: 'http:' }, state), false);
  assert.equal(scope({ ...location, port: '3000' }, state), false);
  for (const change of [
    { visitor_id: null },
    { visitor_id: 'bad' },
    { surface: 'desktop_app' },
    { surface: 'desktop_web' },
    { product_edition: 'china' },
    { analytics_consent: 'denied' },
    { analytics_consent: undefined },
  ]) {
    assert.equal(scope(location, { ...state, ...change }), false);
  }
});

test('late GTM cannot send queued visitor events after withdrawal or a new consented journey', () => {
  assert.equal(scope(location, state, ''), false);
  assert.equal(scope(location, state, 'sealos_acquisition_v1=not-json'), false);
  for (const data of [
    {
      version: 1,
      realm: 'china',
      visitor_id: uid,
      consent: { analytics_storage: 'granted' },
    },
    {
      version: 1,
      realm: 'global',
      visitor_id: uid,
      consent: { analytics_storage: 'denied' },
    },
    {
      version: 1,
      realm: 'global',
      visitor_id: '22222222-2222-4222-8222-222222222222',
      consent: { analytics_storage: 'granted' },
    },
  ]) {
    assert.equal(
      scope(
        location,
        state,
        'sealos_acquisition_v1=' +
          Buffer.from(JSON.stringify(data)).toString('base64url'),
      ),
      false,
    );
  }
});

test('live Cookie guard accepts UTF-8 labels without rewriting and fails closed on malformed or oversized bytes', () => {
  const valid = {
    version: 1,
    realm: 'global',
    visitor_id: uid,
    consent: { analytics_storage: 'granted' },
    source: { source: '搜索', campaign: '推广' },
  };
  const raw = Buffer.from(JSON.stringify(valid)).toString('base64url');
  const cookie = 'other=value; sealos_acquisition_v1=' + raw;
  assert.equal(scope(location, state, cookie), true);
  assert.equal(cookie, 'other=value; sealos_acquisition_v1=' + raw);
  for (const value of [
    'a',
    raw + '=',
    'A'.repeat(2401),
    Buffer.from(JSON.stringify({ ...valid, extra: 'a'.repeat(1800) })).toString(
      'base64url',
    ),
    Buffer.concat([
      Buffer.from('{"invalid":"'),
      Buffer.from([0xc3]),
      Buffer.from('"}'),
    ]).toString('base64url'),
  ])
    assert.equal(
      scope(location, state, 'sealos_acquisition_v1=' + value),
      false,
    );
});

test('the real CLI reproduces the committed import artifact without a production connection', () => {
  const directory = fs.mkdtempSync(
    path.join(os.tmpdir(), 'sealos-website-gtm-'),
  );
  try {
    const output = path.join(directory, 'container.json');
    const run = spawnSync(
      process.execPath,
      [path.join(__dirname, 'generate.cjs'), output],
      { encoding: 'utf8' },
    );
    assert.equal(run.status, 0, run.stderr);
    const actual = fs.readFileSync(output, 'utf8');
    assert.equal(
      actual,
      fs.readFileSync(path.join(__dirname, 'container.patch.json'), 'utf8'),
    );
    assert.deepEqual(JSON.parse(actual), generate());
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
