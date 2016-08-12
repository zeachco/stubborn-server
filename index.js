'use strict';
const config = require('./server/config');
const serverStart = require('./server/main');

const api = {};
api.log = require('./server/logger');
api.config = config;
api.start = options => {
  config.set(options);
  serverStart();
};

api.set = config.set;
api.stop = () => require('./server/app').process.close();
module.exports = api;
