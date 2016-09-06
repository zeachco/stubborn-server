'use strict';
const test = require('ava');
const stub = require('./');
const fileConfig = require('./stubborn');
const request = require('request');
const defaultTestConfig = {
  servePort: 9987,
  logMode: 'none',
  namespace: '',
  pathToMocks: 'demo/dynamic-mocks-examples',
  fallbacks: [{
    url: '/home/*',
    path: 'demo/static/'
  }]
};

test.beforeEach(() => {
  stub.config.set(defaultTestConfig);
});

test('server exposed api', () => {
  stub.start();
  stub.stop();
});

Object.keys(stub.log.mode).forEach(testLoggerMode);

function testLoggerMode(tm) {
  test(`logger on mode "${tm}"`, () => {
    stub.log.setMode(tm);
    ['debug', 'default', 'info', 'success', 'mock', 'warn', 'error']
    .forEach(function(mode) {
      stub.log[mode](`stubborn.log.${mode}`);
    });
  });
}


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

  stub.set(defaultTestConfig);
  for (let key in defaultTestConfig) {
    t.is(stub.config.get()[key], defaultTestConfig[key]);
  }
  stub.stop();
});

test('mocks', t => {
  return new Promise((resolve, reject) => {
    stub.start(defaultTestConfig);
    let target = 'http://127.0.0.1:' + defaultTestConfig.servePort + '/api/path/to/service';
    request(target, function(error, response, body) {
      // type = 'this is a mock service'
      if (!error && response.statusCode == 200) {
        let data = JSON.parse(body);
        t.truthy(data);
        t.is(data.type, 'this is a mock service');
        resolve();
      } else {
        reject(error || response.statusCode + ' ' + response.body);
      }
      stub.stop();
    });
  });
});

test('statics files', t => {
  return new Promise((resolve, reject) => {
    stub.start();
    let target = 'http://127.0.0.1:' + defaultTestConfig.servePort + '/home';
    request(target, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        t.true(body.indexOf('This static file is mocked') !== -1);
        resolve();
      } else {
        reject(error || response.statusCode + ' ' + response.body);
      }
      stub.stop();
    });
  });
});

test('namespace switching', t => {
  return new Promise((resolve, reject) => {
    stub.start(defaultTestConfig);
    stub.config.set({
      namespace: 'alt'
    });
    let target = 'http://127.0.0.1:' + defaultTestConfig.servePort + '/api/path/to/service';
    request(target, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        let data = JSON.parse(body);
        t.truthy(data);
        t.is(data.type, 'this is an alternative mock service');
        resolve();
      } else {
        reject(error || response.statusCode + ' ' + response.body);
      }
      stub.stop();
    });
  });
});

test('wildcard paths', t => {
  let target = 'http://127.0.0.1:' + defaultTestConfig.servePort + '/api/path/abc123/more/paths';

  return new Promise((resolve, reject) => {
    stub.start(Object.assign({}, defaultTestConfig, {
      fallbacks: [{
        url: /api\/path\/([^\/]+)/,
        mock: 'api/path/__wildcard__/more/paths'
      }]
    }));

    request(target, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        let data = JSON.parse(body);
        t.truthy(data);
        t.is(data.type, 'dynamic-mock');
        t.is(data.token, 'abc123');
        resolve();
      } else {
        reject(error || response.statusCode + ' ' + response.body);
      }
      stub.stop();
    });
  });
});

test('wildcard paths with string', t => {
  let target = 'http://127.0.0.1:' + defaultTestConfig.servePort + '/api/path/abc123/more/paths';

  return new Promise((resolve, reject) => {
    stub.start(Object.assign({}, defaultTestConfig, {
      fallbacks: [{
        url: 'api\/path\/([^\/]+)',
        mock: 'api/path/__wildcard__/more/paths'
      }]
    }));

    request(target, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        let data = JSON.parse(body);
        t.truthy(data);
        t.is(data.type, 'dynamic-mock');
        t.is(data.token, 'abc123');
        resolve();
      } else {
        reject(error || response.statusCode + ' ' + response.body);
      }
      stub.stop();
    });
  });
});

test('custom variable passed trough configuration', t => {
  let target = 'http://127.0.0.1:' + defaultTestConfig.servePort + '/api/path/to/service';

  return new Promise((resolve, reject) => {
    stub.start(Object.assign({}, defaultTestConfig, {
      namespace: 'config',
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

require('./tests/config-include')({
  stub,
  fileConfig,
  defaultTestConfig
});
