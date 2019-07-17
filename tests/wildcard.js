'use strict';

const test = require('ava');
const got = require('got');

const stub = require('../');
const { getTestConf } = require('../helpers');

test('wildcard paths', t => {
  const s = stub();
  return getTestConf()
    .then(defaultTestConfig => {
      s.start(Object.assign({}, defaultTestConfig, {
        fallbacks: [{
          url: /api\/path\/([^/]+)/,
          mock: 'api/path/__wildcard__/more/paths'
        }]
      }));
      return 'http://127.0.0.1:' + defaultTestConfig.servePort + '/api/path/abc123/more/paths';
    })
    .then(got)
    .then(({ statusCode, body }) => {
      if (statusCode !== 200) {
        throw statusCode + ' ' + body;
      }
      let data = JSON.parse(body);
      t.truthy(data);
      t.is(data.type, 'dynamic-mock');
      t.is(data.token, 'abc123');
      s.stop();
    });
});

test('wildcard paths with string', t => {
  const s = stub();
  return getTestConf()
    .then(defaultTestConfig => {
      s.start(Object.assign({}, defaultTestConfig, {
        fallbacks: [{
          url: 'api/path/([^/]+)',
          mock: 'api/path/__wildcard__/more/paths'
        }]
      }));
      return 'http://127.0.0.1:' + defaultTestConfig.servePort + '/api/path/abc123/more/paths';
    })
    .then(got)
    .then(({ statusCode, body }) => {
      if (statusCode !== 200) {
        throw statusCode + ' ' + body;
      }
      let data = JSON.parse(body);
      t.truthy(data);
      t.is(data.type, 'dynamic-mock');
      t.is(data.token, 'abc123');
      s.stop();
    });
});
