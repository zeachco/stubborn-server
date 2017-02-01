'use strict';
const app = require('./server/app');
const config = require('./server/config');
const serverStart = require('./server/main');

const api = {};
api.log = require('./server/logger');
api.app = app;
api.config = config;
api.start = options => {
  config.set(options);
  serverStart(app);
};

api.set = config.set;
api.stop = () => require('./server/app').process.close();
module.exports = api;
