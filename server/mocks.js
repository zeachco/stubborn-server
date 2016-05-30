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

const requireMock = (req) => {
  const key = req.method + ' ' + req.url;
  const dbMock = memoryDb(req).mocks[key];
  const file = path.join(process.cwd(), config.pathToMocks, req.url, req.method.toLowerCase());
  let mock = null;
  if (dbMock && dbMock.fn) {
    mock = dbMock.fn;
  } else if (dbMock && dbMock.alt) {
    mock = require(file + '-' + dbMock.alt
      .replace(/^(get|post|put|delete)\-/i, ''));
  } else {
    mock = require(file);
  }
  return mock;
};

app.use((req, res, next) => {
  let mocker = null;
  try {
    mocker = requireMock(req);
    try {
      MockBehaviours[typeof mocker](mocker, req, res);
      log.mock(`${req.method} ${req.url}`);
    } catch (e) {
      console.log(e);
    }
  } catch (e) {
    log.debug(`Fallback for ${req.method.toUpperCase()} ${req.url}`);
    next();
  }
});
