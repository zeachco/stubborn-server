'use strict';

const config = require('./config');
const path = require('path');

module.exports = function pathResolver(req) {
  console.log(req.url);
  let conf = config.get();
  let mock = null;

  // If absolute path, leave as is, otherwise, use current process path
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
