'use strict';

const test = require('ava');
const got = require('got');

const stub = require('../');
const { getTestConf } = require('./helpers');

test('custom path resolver', t => {
  const s = stub();
  return getTestConf()
    .then(defaultTestConfig => {
      s.start(Object.assign({}, defaultTestConfig, {
        plugins: [
          {
            loader: () => ({ a: 'a' })
          }
        ]
      }));
      return 'http://127.0.0.1:' + defaultTestConfig.servePort + '/custom-path-resolver';
    })
    .then(got)
    .then(({ statusCode, body }) => {
      if (statusCode !== 200) {
        throw statusCode + ' ' + body;
      }
      let data = JSON.parse(body);
      t.truthy(data);
      t.deepEqual(data, { a: 'a' });
      s.stop();
    });
});

test('multiple custom path resolver', t => {
  const s = stub();
  return getTestConf()
    .then(defaultTestConfig => {
      s.start(Object.assign({}, defaultTestConfig, {
        plugins: [
          {
            loader: () => { throw 'failed'; },
          },
          {
            loader: () => ({ b: 'b' })
          }
        ]
      }));
      return 'http://127.0.0.1:' + defaultTestConfig.servePort + '/multiple-custom-path-resolver';
    })
    .then(got)
    .then(({ statusCode, body }) => {
      if (statusCode !== 200) {
        throw statusCode + ' ' + body;
      }
      let data = JSON.parse(body);
      t.truthy(data);
      t.deepEqual(data, { b: 'b' });
      s.stop();
    });
});

