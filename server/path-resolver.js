'use strict';

const config = require('./config');
const path = require('path');
const logger = require('./logger');

module.exports = function pathResolver(req) {
  let conf = config.get();
  let mock = null;

  // If absolute path, leave as is, otherwise, use current process path
  const pathToMocks = conf.pathToMocks[0] === '/' ?
    conf.pathToMocks :
    path.join(process.cwd(), conf.pathToMocks);

  let file = path.join(
    pathToMocks,
    req.url.split('?')[0],
    req.method.toLowerCase() + (conf.namespace ? '-' + conf.namespace : '')
  );

  try {
    let resolved = require.resolve(file);
    delete require.cache[resolved];
    mock = require(file);
  } catch (e) {
    const firstMatching = conf.fallbacks.filter(f => !!f.mock && f.url.test(req.url))[0];
    if (firstMatching) {
      file = path.join(
        pathToMocks,
        firstMatching.mock,
        req.method.toLowerCase() + (conf.namespace ? '-' + conf.namespace : '')
      );
      mock = require(file);
      mock.matches = firstMatching.url.exec(req.url);
    } else {
      throw 'no';
    }
  }
  return mock;
};
