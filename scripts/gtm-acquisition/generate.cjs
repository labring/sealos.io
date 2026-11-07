#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const PREFIX = 'Sealos Website Acquisition | ';
const FIELDS = [
  'visitor_id',
  'surface',
  'product_edition',
  'analytics_consent',
  'acquisition_source',
  'acquisition_medium',
  'acquisition_campaign',
];
const PARAMS = FIELDS.filter((key) => key !== 'analytics_consent');
const template = (key, value) => ({ type: 'template', key, value });
const ref = (key) => '{{' + PREFIX + 'DLV - ' + key + '}}';
const equals = (left, right) => ({
  type: 'equals',
  parameter: [template('arg0', left), template('arg1', right)],
});

function generate() {
  const folderId = '810000';
  const variable = FIELDS.map((key, index) => ({
    variableId: String(810100 + index),
    name: PREFIX + 'DLV - ' + key,
    type: 'v',
    parentFolderId: folderId,
    parameter: [
      { type: 'integer', key: 'dataLayerVersion', value: '2' },
      { type: 'boolean', key: 'setDefaultValue', value: 'false' },
      template('name', key),
    ],
  }));
  variable.push({
    variableId: '810110',
    name: PREFIX + 'Scope',
    type: 'jsm',
    parentFolderId: folderId,
    parameter: [
      template(
        'javascript',
        'function() {\n' +
          '  var visitor = ' +
          ref('visitor_id') +
          ';\n' +
          "  if (location.protocol !== 'https:' || location.port ||\n" +
          "      (location.hostname !== 'sealos.io' && location.hostname !== 'www.sealos.io') ||\n" +
          '      ' +
          ref('surface') +
          " !== 'website' || " +
          ref('product_edition') +
          " !== 'global' ||\n" +
          '      ' +
          ref('analytics_consent') +
          " !== 'granted' ||\n" +
          '      !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(visitor)) return false;\n' +
          '  try {\n' +
          '    var match = document.cookie.match(/(?:^|;\\s*)sealos_acquisition_v1=([A-Za-z0-9_-]+)(?:;|$)/);\n' +
          '    if (!match || match[1].length > 2400) return false;\n' +
          "    var bytes = atob(match[1].replace(/-/g, '+').replace(/_/g, '/'));\n" +
          "    if (bytes.length > 1800 || btoa(bytes).replace(/\\+/g, '-').replace(/\\//g, '_').replace(/=+$/, '') !== match[1]) return false;\n" +
          "    var encoded = '';\n" +
          "    for (var i = 0; i < bytes.length; i++) encoded += '%' + ('0' + bytes.charCodeAt(i).toString(16)).slice(-2);\n" +
          '    var current = JSON.parse(decodeURIComponent(encoded));\n' +
          "    return !!(current && current.version === 1 && current.realm === 'global' && current.visitor_id === visitor &&\n" +
          "      current.consent && current.consent.analytics_storage === 'granted');\n" +
          '  } catch (error) { return false; }\n}',
      ),
    ],
  });
  const events = ['acquisition_visit', 'download_click'];
  const trigger = events.map((event, index) => ({
    triggerId: String(810001 + index),
    name: PREFIX + event,
    type: 'CUSTOM_EVENT',
    parentFolderId: folderId,
    customEventFilter: [equals('{{_event}}', event)],
    filter: [equals('{{' + PREFIX + 'Scope}}', 'true')],
  }));
  const tag = events.map((event, index) => ({
    tagId: String(810010 + index),
    name: PREFIX + 'GA4 - ' + event,
    type: 'gaawe',
    parentFolderId: folderId,
    parameter: [
      { type: 'boolean', key: 'sendEcommerceData', value: 'false' },
      template('eventName', event),
      template('measurementIdOverride', 'G-YF5VHZSTE0'),
      {
        type: 'list',
        key: 'eventSettingsTable',
        list: PARAMS.map((key) => ({
          type: 'map',
          map: [
            template('parameter', key),
            template('parameterValue', ref(key)),
          ],
        })),
      },
    ],
    firingTriggerId: [trigger[index].triggerId],
    tagFiringOption: 'oncePerEvent',
  }));
  return {
    exportFormatVersion: 2,
    containerVersion: {
      container: {
        accountId: '6299222375',
        containerId: '222308200',
        name: 'sealos.io',
        publicId: 'GTM-5DTRN2V3',
        usageContext: ['WEB'],
      },
      folder: [{ folderId, name: PREFIX + 'Integration v1' }],
      variable,
      trigger,
      tag,
    },
  };
}
if (require.main === module) {
  const output = path.resolve(
    process.argv[2] || path.join(__dirname, 'container.patch.json'),
  );
  // Reuse the repository's existing formatter so regeneration is review-stable.
  const prettier = require('prettier');
  prettier
    .format(JSON.stringify(generate()), { parser: 'json' })
    .then((json) => {
      fs.writeFileSync(output, json);
      process.stdout.write(output + '\n');
    })
    .catch((error) => {
      process.stderr.write(String(error) + '\n');
      process.exitCode = 1;
    });
}
module.exports = { generate };
