'use strict';

const test = require('ava');
const got = require('got');

const stub = require('../');
const { getTestConf } = require('./helpers');

test('custom variable passed through configuration', t => {
  const s = stub();
  return getTestConf()
    .then(defaultTestConfig => {
      s.start(Object.assign({}, defaultTestConfig, {
        namespace: 'config',
        customPath: 'test'
      }));
      return 'http://127.0.0.1:' + defaultTestConfig.servePort + '/api/path/to/service';
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
