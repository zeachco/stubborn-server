'use strict';

const test = require('ava');

const stub = require('../');
const { getTestConf } = require('./helpers');

test('server exposed api', t => {
  const s = stub();
  t.truthy(s.app);
  s.start();
  s.stop();
});

// logging tests
Object.keys(stub().log.mode).forEach(testLoggerMode);

function testLoggerMode(tm) {
  test(`logger on mode "${tm}"`, t => {
    stub().log.setMode(tm);
    ['debug', 'default', 'info', 'success', 'mock', 'warn', 'error']
      .forEach(function(mode) {
        stub().log[mode](`stubborn.log.${mode}`);
        t.pass();
      });
  });
}

test('configuration management', t => {
  const s = stub();
  return getTestConf()
    .then(defaultTestConfig => {
      s.config.set(defaultTestConfig);
      t.is(s.config.get().namespace, require('../stubborn').namespace);
      s.start({
        namespace: 'test1'
      });
      t.is(s.config.get().namespace, 'test1');
      s.config.set({
        namespace: 'test2'
      });
      t.is(s.config.get().namespace, 'test2');

      s.config.set(defaultTestConfig);
      for (let key in defaultTestConfig) {
        t.is(s.config.get()[key], defaultTestConfig[key]);
      }
      s.stop();
    });
});
