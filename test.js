'use strict';
const test = require('ava');
const stub = require('./');
const fileConfig = require('./stubborn');
const request = require('request');
const testConfig = {
  servePort: 9987,
  verbose: false,
  namespace: '',
  pathToMocks: 'demo/dynamic-mocks-examples',
  fallbacks: [{
    url: '/home/*',
    path: 'demo/static/'
  }]
};

test.beforeEach(() => {
  stub.config.set(testConfig);
});

test('server exposed api', () => {
  stub.start();
  stub.stop();
});

test('exposed logger', () => {
  for (let k in stub.log) {
    stub.log[k](`stubborn.log.${k}`);
  }
});

test('configuration management', t => {
  t.is(stub.config.get().namespace, fileConfig.namespace);
  stub.start({
    namespace: 'test1'
  });
  t.is(stub.config.get().namespace, 'test1');
  stub.config.set({
    namespace: 'test2'
  });
  t.is(stub.config.get().namespace, 'test2');

  stub.set(testConfig);
  for (let key in testConfig) {
    t.is(stub.config.get()[key], testConfig[key]);
  }
  stub.stop();
});

test('mocks', t => {
  return new Promise((resolve, reject) => {
    stub.start(testConfig);
    let target = 'http://127.0.0.1:' + testConfig.servePort + '/api/path/to/service';
    request(target, function (error, response, body) {
      // type = 'this is a mock service'
      if (!error && response.statusCode == 200) {
        let data = JSON.parse(body);
        t.is(data.type, 'this is a mock service');
        resolve();
      } else {
        reject(error);
      }
      stub.stop();
    });
  });
});

test('statics files', t => {
  return new Promise((resolve, reject) => {
    stub.start();
    let target = 'http://127.0.0.1:' + testConfig.servePort + '/home';
    request(target, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        t.not(body.indexOf('This static file is mocked'), -1);
        resolve({
          error,
          body
        });
      } else {
        reject({
          error,
          body
        });
      }
      stub.stop();
    });
  });
});

test('namespace switching', t => {
  return new Promise((resolve, reject) => {
    stub.start(testConfig);
    stub.config.set({
      namespace: 'alt'
    });
    let target = 'http://127.0.0.1:' + testConfig.servePort + '/api/path/to/service';
    request(target, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        let data = JSON.parse(body);
        t.is(data.type, 'this is an alternative mock service');
        resolve();
      } else {
        reject(error);
      }
      stub.stop();
    });
  });
});
