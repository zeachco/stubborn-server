'use strict';

const test = require('ava');
const got = require('got');

const stub = require('../');
const { getTestConf } = require('../helpers');

test('express extensions with \'includes\' entries', t => {
  const s = stub();
  return getTestConf()
    .then(defaultTestConfig => {
      s.start(Object.assign({}, defaultTestConfig, {
        includes: ['__custom/express_handlers']
      }));
      return 'http://127.0.0.1:' + defaultTestConfig.servePort + '/user/abc123/images/def456/thumb';
    })
    .then(got)
    .then(({ statusCode, body }) => {
      if (statusCode !== 200) {
        throw statusCode + ' ' + body;
      }
      let data = JSON.parse(body);
      t.truthy(data);
      t.is(data.userId, 'abc123');
      t.is(data.imageId, 'def456');
      s.stop();
    });
});

test('express extensions with \'includes\' entries can access to config', t => {
  const s = stub();
  return getTestConf()
    .then(defaultTestConfig => {
      s.start(Object.assign({}, defaultTestConfig, {
        includes: ['__custom/express_handlers'],
        customPath: 'test'
      }));
      return 'http://127.0.0.1:' + defaultTestConfig.servePort + '/user/abc123/images/def456/thumb';
    })
    .then(got)
    .then(({ statusCode, body }) => {
      if (statusCode !== 200) {
        throw statusCode + ' ' + body;
      }
      let data = JSON.parse(body);
      t.truthy(data);
      t.is(data.customPath, 'test');
      s.stop();
    });
});
