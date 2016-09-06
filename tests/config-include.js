'use strict';
const test = require('ava');
const request = require('request');

module.exports = options => {
  const defaultTestConfig = options.defaultTestConfig;
  const stub = options.stub;

  test('express extensions with \'includes\' entries', t => {
    let target = 'http://127.0.0.1:' + defaultTestConfig.servePort + '/user/abc123/images/def456/thumb';
    return new Promise((resolve, reject) => {
      stub.start(Object.assign({}, defaultTestConfig, {
        includes: ['__custom/express_handlers']
      }));
      request(target, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          let data = JSON.parse(body);
          t.truthy(data);
          t.is(data.userId, 'abc123');
          t.is(data.imageId, 'def456');
          resolve();
        } else {
          reject(error || response.statusCode + ' ' + response.body);
        }
        stub.stop();
      });
    });
  });

  test('express extensions with \'includes\' entries can access to config', t => {
    let target = 'http://127.0.0.1:' + defaultTestConfig.servePort + '/user/abc123/images/def456/thumb';
    return new Promise((resolve, reject) => {
      stub.start(Object.assign({}, defaultTestConfig, {
        includes: ['__custom/express_handlers'],
        customPath: 'test'
      }));
      request(target, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          let data = JSON.parse(body);
          t.truthy(data);
          t.is(data.customPath, 'test');
          resolve();
        } else {
          reject(error || response.statusCode + ' ' + response.body);
        }
        stub.stop();
      });
    });
  });
};
