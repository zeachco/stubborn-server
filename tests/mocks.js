'use strict';

const test = require('ava');
const got = require('got');

const stub = require('../');
const { getTestConf } = require('./helpers');

test('mocks', t => {
  const s = stub();
  return getTestConf()
    .then(defaultTestConfig => {
      s.start(defaultTestConfig);
      return 'http://127.0.0.1:' + defaultTestConfig.servePort + '/api/path/to/service';
    })
    .then(got)
    .then(({ statusCode, body }) => {
      if (statusCode !== 200) {
        throw statusCode + ' ' + body;
      }
      const data = JSON.parse(body);
      t.truthy(data);
      t.is(data.type, 'this is a mock service');
      s.stop();
    });
});

test('statics files', t => {
  const s = stub();
  return getTestConf()
    .then(defaultTestConfig => {
      s.start(defaultTestConfig);
      return 'http://127.0.0.1:' + defaultTestConfig.servePort + '/home';
    })
    .then(got)
    .then(({ statusCode, body }) => {
      if (statusCode !== 200) {
        throw statusCode + ' ' + body;
      }
      t.true(body.indexOf('This static file is mocked') !== -1);
      s.stop();
    });
});
