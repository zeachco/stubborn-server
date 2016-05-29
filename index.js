'use strict';

const rootDb = require('./server/memory-db');

let defaultConfig = {
  namespace: 'default',
  db: {},
  mocks: {}
};

const methods = {
  log: require('./server/logger'),
  start: () => require('./server'),
  setup: (config = defaultConfig) => {
    Object.keys(config.mocks).forEach(k => {
      let req = k.split(' ');
      let fn = config.mocks[k];
      let mapped = {
        path: req[1],
        method: req[0]
      };
      if (typeof fn === 'function') {
        mapped.fn = fn;
      } else {
        mapped.alt = fn;
      }
      config.mocks[k] = mapped;
    });
    const req = {
      hostname: config.namespace || 'default'
    };
    let db = rootDb(req);
    Object.keys(config.db).forEach(k => {
      db[k] = config.db[k];
    });
    db.mocks = config.mocks;
    rootDb.commit(req);
  },
  stop: () => {
    require('./server/app').process.close();
  }
};

module.exports = methods;
