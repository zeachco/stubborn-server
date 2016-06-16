'use strict';
const log = require('./logger');
const path = require('path');
const memoryDb = require('./memory-db');
const app = require('./app');
const config = require('./config');

const utils = {
  config: config,
  log: log.mock,
  db: memoryDb
};

const MockBehaviours = {
  'function': (data, req, res) => data(req, res, utils),
  'object': (data, req, res) => res.json(data),
  'null': (data, req, res) => res.end()
};

const requireMock = (req) => {
  let conf = config.get();
  let mock = null;
  const pathToMocks = conf.pathToMocks[0] === '/' ?
    conf.pathToMocks :
    path.join(process.cwd(), conf.pathToMocks);
  const file = path.join(
    pathToMocks,
    req.url.split('?')[0],
    req.method.toLowerCase() + (conf.namespace ? '-' + conf.namespace : '')
  );
  delete require.cache[require.resolve(file)];
  mock = require(file);
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
