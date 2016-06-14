'use strict';

const fileConfig = require('./server/config');

module.exports = defaultConfig => {
  const api = {};
  api.log = require('./server/logger');
  api.start = config => fileConfig(Object.assign({}, config, defaultConfig)) && require('./server')(config) && api;
  api.stop = () => require('./server/app').process.close() || api;
  return api;
};

