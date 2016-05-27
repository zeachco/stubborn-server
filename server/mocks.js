'use strict';
const log = require('./logger');
const path = require('path');
const memoryDb = require('./memory-db');
const config = require('./config');
const app = require('./app');

const utils = {
  log: log.mock,
  db: memoryDb
};

const MockBehaviours = {
  'function': (data, req, res) => data(req, res, utils),
  'object': (data, req, res) => res.json(data),
  'null': (data, req, res) => res.end()
};

const requireMock = resolve => {
  return memoryDb[resolve] || require(resolve);
};

app.use((req, res, next) => {
  // req.session = 'test';
  // (memoryDb[req.session] ? && memoryDb[req.session][req.url])

  let mocker = null;
  const file = path.join(process.cwd(), config.mocks, req.url, req.method.toLowerCase());
  try {
    mocker = requireMock(file);
    try {
      MockBehaviours[typeof mocker](mocker, req, res);
      log.mock(`${req.method} ${req.url}`);
    } catch (e) {
      log.error(e);
    }
  } catch (e) {
    log.debug(`Fallback for ${req.method.toUpperCase()} ${req.url}`);
    next();
  }
});
