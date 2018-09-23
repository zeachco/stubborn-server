'use strict';
const app = require('./server/app');
const config = require('./server/config');
const serverStart = require('./server/main');

module.exports = () => {
  const api = {};
  api.log = require('./server/logger');
  api.app = app();
  api.config = config();
  api.start = options => {
    api.config.set(options);
    serverStart(api);
  };

  api.set = api.config.set;
  api.stop = () => api.app.process.close();

  return api;
};
