'use strict';
const log = require('./logger');
const memoryDb = require('./memory-db');
const config = require('./config');
const pathResolver = require('./path-resolver');

const utils = {
  config: config,
  log: log.mock,
  db: memoryDb
};

const MockBehaviours = {
  'function': (mocker, req, res) => mocker(req, res, utils, mocker),
  'object': (data, req, res) => res.json(data),
  'null': (data, req, res) => res.end()
};
module.exports = app => {
  app.use((req, res, next) => {
    let mocker = null;
    try {
      mocker = pathResolver(req);
      try {
        MockBehaviours[typeof mocker](mocker, req, res);
        log.mock(`${req.method} ${req.url}`);
      } catch (e) {
        log.error({
          url: req.url,
          method: req.method,
          error: e
        });
      }
    } catch (e) {
      if (e.code === 'MODULE_NOT_FOUND') {
        log.debug(`Fallback for ${req.method.toUpperCase()} ${req.url}`);
      } else {
        log.error({
          url: req.url,
          method: req.method,
          error: e
        });
      }
      next();
    }
  });
};
